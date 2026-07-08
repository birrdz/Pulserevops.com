// CRO Pulse Tools (tl) — conservative topical answer duplicate (owner 2026-07-07)
// Dup ONLY when angle + structure truly match (geo city swap, same hire/cost angle).
// Never lazy-dup across buckets, companies, tools, or loose token overlap.
'use strict';

const {
  croBucket,
  tokenize,
  describeForMeta,
  geoTokens,
} = require('./_facecard_pool_match');
const { dsChat: defaultDsChat } = require('./_ds_lib');
const { reshapeQaGoldBody, auditQaGoldTemplate, appliesQaGold } = require('./_qa_gold_template');
const { stripAllCroFromBody } = require('./_cro_strip_lib');
const { isKoryCroImg } = require('./_img_flux_lib');
const {
  ensureDirectAnswerAfterHero,
  wordCount,
} = require('./_format_fixer_lib');
const { lockQaVisualShape } = require('./_visual_lock_law');
const { repairBrokenQaImages, fillEntryMissingImages } = require('./_ddg_facecard_lib');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');

const DUP_AFTER = parseInt(process.env.TL_ANSWER_DUP_AFTER || '100', 10);
const POOL_CAP = parseInt(process.env.TL_ANSWER_POOL_CAP || '200', 10);

/** Buckets we may ever dup from — never tools/saas/general lazy reuse */
const DUP_BUCKETS = new Set(['geo', 'hire', 'cost', 'fractional']);

function overlapScore(a, b) {
  if (!a.length || !b.length) return 0;
  const A = new Set(a);
  const B = new Set(b);
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return inter / Math.max(A.size, B.size, 1);
}

function extractGeoPlace(title) {
  const t = String(title || '').toLowerCase();
  const m = t.match(/\bin\s+([a-z][a-z\s.'-]{2,48})(?:\s+in\s+2027)?\s*\??\s*$/i)
    || t.match(/\bin\s+([a-z][a-z\s.'-]{2,48})/i);
  if (!m) return '';
  return m[1].trim().replace(/\s+/g, ' ');
}

function titleCaseGeo(s) {
  return String(s || '')
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function withoutGeoTokens(tokens, title) {
  const geo = new Set(geoTokens(title));
  const place = extractGeoPlace(title).toLowerCase().split(/\s+/).filter(Boolean);
  const drop = new Set([...geo, ...place, '2027']);
  return (tokens || []).filter((t) => !drop.has(t));
}

function isPoolWorthySource(title) {
  return DUP_BUCKETS.has(croBucket(title));
}

function enforceCroCardLaw(body) {
  let b = stripAllCroFromBody(String(body || ''));
  return b
    .split('\n')
    .filter((line) => {
      const m = line.match(/!\[([^\]]*)\]\(([^)\s]+)\)/);
      return !(m && isKoryCroImg(m[2]));
    })
    .join('\n');
}

/**
 * Strict gate: is dup sensible for this target/source pair?
 * Returns { allowed, mode, reason } — allowed only for tight topical matches.
 */
function evaluateDupPair(targetTitle, sourceTitle) {
  const tgtBucket = croBucket(targetTitle);
  const srcBucket = croBucket(sourceTitle);
  if (!DUP_BUCKETS.has(tgtBucket) || !DUP_BUCKETS.has(srcBucket)) {
    return { allowed: false, reason: 'bucket_not_dup_eligible:' + tgtBucket };
  }
  if (tgtBucket !== srcBucket && !(tgtBucket === 'geo' && srcBucket === 'geo')) {
    return { allowed: false, reason: 'bucket_mismatch:' + srcBucket + '→' + tgtBucket };
  }

  const tgtGeo = extractGeoPlace(targetTitle);
  const srcGeo = extractGeoPlace(sourceTitle);
  const tgtCore = withoutGeoTokens(tokenize(targetTitle), targetTitle);
  const srcCore = withoutGeoTokens(tokenize(sourceTitle), sourceTitle);
  const coreOverlap = overlapScore(tgtCore, srcCore);

  // Geo city swap: same angle, different place (DMV / local CRO pages)
  if (tgtGeo && srcGeo && tgtGeo.toLowerCase() !== srcGeo.toLowerCase()) {
    if (coreOverlap < 0.55) {
      return { allowed: false, reason: 'geo_core_overlap_low:' + coreOverlap.toFixed(2) };
    }
    return { allowed: true, mode: 'geo-swap', reason: 'geo_swap:' + srcGeo + '→' + tgtGeo };
  }

  // Same city or no geo — only dup if titles are near-identical angle (year twin etc.)
  if (tgtGeo && srcGeo && tgtGeo.toLowerCase() === srcGeo.toLowerCase()) {
    return { allowed: false, reason: 'same_geo_no_dup' };
  }

  // Non-geo angle twin: hire/cost/fractional with same structural question
  if (!tgtGeo && !srcGeo && tgtBucket === srcBucket && coreOverlap >= 0.72) {
    const tgtSet = new Set(tgtCore);
    const srcSet = new Set(srcCore);
    const onlyTgt = tgtCore.filter((t) => !srcSet.has(t));
    const onlySrc = srcCore.filter((t) => !tgtSet.has(t));
    const diff = [...onlyTgt, ...onlySrc].filter((t) => t !== '2027');
    if (diff.length <= 2) {
      return { allowed: true, mode: 'angle-twin', reason: 'angle_twin:' + tgtBucket };
    }
    return { allowed: false, reason: 'angle_diff_tokens:' + diff.join(',') };
  }

  return { allowed: false, reason: 'no_sensible_dup_match' };
}

/**
 * Pick dup source only when evaluateDupPair passes for BOTH titles.
 * Returns null when no sensible match — caller must full-rebuild.
 */
function pickDupSource(targetTitle, pool, opts) {
  if (!pool || !pool.length) return null;
  if (!isPoolWorthySource(targetTitle)) return null;

  let best = null;
  let bestScore = 0;
  let bestEval = null;

  for (const row of pool) {
    if (!row || !row.body || !isPoolWorthySource(row.title)) continue;
    const evalResult = evaluateDupPair(targetTitle, row.title);
    if (!evalResult.allowed) continue;

    const tokens = tokenize(targetTitle);
    let score = overlapScore(tokens, row.tokens || []);
    if (evalResult.mode === 'geo-swap') score += 0.4;
    if (evalResult.mode === 'angle-twin') score += 0.25;

    if (score > bestScore) {
      bestScore = score;
      best = row;
      bestEval = evalResult;
    }
  }

  if (!best || !bestEval) return null;
  return { source: best, score: bestScore, mode: bestEval.mode, reason: bestEval.reason };
}

function escapeRe(s) {
  return String(s || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function stripCodeFence(s) {
  return String(s || '')
    .replace(/^\s*```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim();
}

/**
 * Rewrite ONLY the location-specific text blocks for the target place.
 * Everything else (structure, generic prose, ALL images) is preserved verbatim.
 * The Direct Answer block plus any block mentioning the source/target place is
 * regenerated so local claims (cities, agencies, salary ranges, market/regulatory
 * notes) are accurate for the target location. Falls back to the input body on any
 * DS/parse failure so the dup path stays safe.
 */
async function localizeGeoSegments(body, srcGeo, tgtGeo, targetTitle, dsChat) {
  const chat = dsChat || defaultDsChat;
  if (!chat || !tgtGeo) return body;
  const tgtName = titleCaseGeo(tgtGeo);
  const srcRe = srcGeo ? new RegExp('\\b' + escapeRe(srcGeo) + '\\b', 'i') : null;
  const tgtRe = new RegExp('\\b' + escapeRe(tgtName) + '\\b', 'i');

  const blocks = String(body || '').split(/\n{2,}/);
  const idxs = [];
  const targets = [];
  blocks.forEach((blk, i) => {
    const t = blk.trim();
    if (!t) return;
    if (/^\s*!\[[^\]]*\]\([^)]+\)\s*$/.test(t)) return; // image-only block
    if (/```/.test(t)) return; // mermaid / code fence
    const isDirectAnswer = /^##\s+Direct\s+Answer\b/i.test(t);
    const mentionsPlace = tgtRe.test(t) || (srcRe && srcRe.test(t));
    if (isDirectAnswer || mentionsPlace) {
      idxs.push(i);
      targets.push(blk);
    }
  });
  if (!targets.length) return body;

  const sys =
    'You localize CRO (conversion rate optimization) content to one specific US location. ' +
    'For each input text block, rewrite EVERY place-specific claim — cities, metro areas, agencies, ' +
    'salary/rate ranges, market conditions, regulations, local examples — so it is accurate for "' +
    tgtName +
    '". Keep all NON-location content, meaning, and approximate length the same. ' +
    'Preserve markdown exactly: heading lines (##/###), bold **text**, list markers, and any "**Question?**" FAQ prefixes. ' +
    'Do NOT add, remove, or reference images. Do NOT add new headings. ' +
    'Return ONLY a JSON array of strings — same length and order as the input array.';
  let arr;
  try {
    const { content } = await chat(
      [
        { role: 'system', content: sys },
        { role: 'user', content: JSON.stringify(targets) },
      ],
      { temperature: 0.5 },
    );
    arr = JSON.parse(stripCodeFence(content));
  } catch (e) {
    return body;
  }
  if (!Array.isArray(arr) || arr.length !== targets.length) return body;
  idxs.forEach((bi, k) => {
    if (typeof arr[k] === 'string' && arr[k].trim()) blocks[bi] = arr[k].trim();
  });
  return blocks.join('\n\n');
}

async function adaptDupBody(sourceBody, sourceTitle, targetTitle, opts) {
  opts = opts || {};
  const evalResult = evaluateDupPair(targetTitle, sourceTitle);
  if (!evalResult.allowed) {
    throw new Error('adaptDupBody blocked: ' + evalResult.reason);
  }

  let b = String(sourceBody || '');
  const srcGeo = extractGeoPlace(sourceTitle);
  const tgtGeo = extractGeoPlace(targetTitle);

  if (evalResult.mode === 'geo-swap' && srcGeo && tgtGeo) {
    // 1) Swap the primary place name everywhere it is named literally.
    const re = new RegExp(escapeRe(srcGeo), 'gi');
    b = b.replace(re, titleCaseGeo(tgtGeo));
    // 2) Rewrite only the location-specific blocks for the target place;
    //    generic context + all images stay identical to the source.
    b = await localizeGeoSegments(b, srcGeo, tgtGeo, targetTitle, opts.dsChat);
  }

  const st = String(sourceTitle || '').trim();
  const tt = String(targetTitle || '').trim();
  if (st && tt && st !== tt) {
    if (new RegExp('^#\\s+' + escapeRe(st) + '\\s*$', 'im').test(b)) {
      b = b.replace(/^#\s+.+$/m, '# ' + tt);
    }
    const reTitle = new RegExp(escapeRe(st), 'g');
    b = b.replace(reTitle, tt);
  }
  return enforceCroCardLaw(reshapeQaGoldBody(b));
}

/**
 * Target is a pillar-wide geo-swap candidate: any dup-eligible bucket
 * (geo / hire / cost / fractional) that names a specific place. croBucket()
 * ranks hire/cost/fractional above geo, so "fractional CRO cost in Maryland"
 * is still a geo-swap target even though its bucket label is "fractional".
 */
function isGeoDupTarget(title) {
  return DUP_BUCKETS.has(croBucket(title)) && !!extractGeoPlace(title);
}

/**
 * Find a geo-swap source from the WHOLE pillar (index + blobs), not just the
 * in-run pool. Picks the best geo sibling (same core angle, different place) whose
 * published body still applies the Q&A gold shape. Returns null when no sensible
 * match — caller must full-rebuild.
 */
async function findPillarGeoSource(targetTitle, opts) {
  opts = opts || {};
  const { idx, store, selfId } = opts;
  if (!idx || !store || !isGeoDupTarget(targetTitle)) return null;
  const appliesFn = opts.appliesQaGold || appliesQaGold;
  const exclude = opts.exclude instanceof Set ? opts.exclude : new Set();
  const tgtCore = withoutGeoTokens(tokenize(targetTitle), targetTitle);
  const tgtGeo = extractGeoPlace(targetTitle).toLowerCase();

  const cands = [];
  for (const e of idx.entries || []) {
    if (!e || !e.id || e.id === selfId || exclude.has(e.id)) continue;
    if (!/^tl\d+$/i.test(e.id)) continue;
    if (e.pending) continue;
    const title = e.question || '';
    if (!isGeoDupTarget(title)) continue;
    if (extractGeoPlace(title).toLowerCase() === tgtGeo) continue;
    const ev = evaluateDupPair(targetTitle, title);
    if (!ev.allowed || ev.mode !== 'geo-swap') continue;
    const score = overlapScore(tgtCore, withoutGeoTokens(tokenize(title), title));
    cands.push({ e, title, score, ev });
  }
  cands.sort((a, b) => b.score - a.score);

  for (const c of cands.slice(0, 8)) {
    const blob = await store.get('answers/' + c.e.id + '.json', { type: 'json' }).catch(() => null);
    if (!blob || !blob.answer || blob.pending) continue;
    if (!appliesFn(c.e.id, blob.answer, { title: c.title })) continue;
    return {
      source: { id: c.e.id, title: c.title, body: blob.answer },
      score: c.score,
      mode: 'geo-swap',
      reason: c.ev.reason + ' (pillar)',
    };
  }
  return null;
}

function canUseAnswerDup(fixCount) {
  return fixCount >= DUP_AFTER;
}

function registerCertifiedAnswer(pool, entry) {
  if (!entry || !isPoolWorthySource(entry.title)) return pool || [];
  pool = pool || [];
  const meta = describeForMeta(entry.title);
  const row = {
    id: entry.id,
    title: entry.title,
    body: entry.body,
    bucket: meta.bucket,
    tokens: meta.tokens,
    geo: meta.geo,
    at: new Date().toISOString(),
  };
  const filtered = pool.filter((p) => p && p.id !== row.id);
  filtered.unshift(row);
  return filtered.slice(0, POOL_CAP);
}

async function rebuildDupQaEntry(id, title, body, opts) {
  opts = opts || {};
  if (!appliesQaGold(id, body, { title })) {
    return { ok: false, reason: 'not_qa_gold_shape' };
  }
  let b = enforceCroCardLaw(reshapeQaGoldBody(String(body || '')));
  b = ensureDirectAnswerAfterHero(b);
  b = lockQaVisualShape(b, id, title);

  const repaired = await repairBrokenQaImages(id, title, b, {
    onProgress: opts.onProgress,
    upgradeMode: true,
    alternateSources: true,
    pollinatorPrefer: true,
    allowTopicalReuse: true,
  });
  b = repaired.body || b;

  const filled = await fillEntryMissingImages(id, title, b, {
    onProgress: opts.onProgress,
    upgradeMode: true,
    alternateSources: true,
    pollinatorPrefer: true,
    allowTopicalReuse: true,
  });
  b = filled.body || b;
  b = ensureDirectAnswerAfterHero(enforceCroCardLaw(b));

  const gold = auditQaGoldTemplate(b, title, id);
  const grade = gradeEntry(id, b);
  const wc = wordCount(b);
  if (!gold.compliant || grade.score < 13) {
    return {
      ok: false,
      body: b,
      grade: grade.score,
      gold,
      words: wc,
      reason: !gold.compliant ? (gold.issues || []).join(', ') : 'grade_' + grade.score,
    };
  }
  return {
    ok: true,
    body: b,
    grade: grade.score,
    gold,
    words: wc,
    learnLogLine: filled.throttleLearn || repaired.throttleLearn || null,
  };
}

module.exports = {
  DUP_AFTER,
  POOL_CAP,
  DUP_BUCKETS,
  canUseAnswerDup,
  pickDupSource,
  evaluateDupPair,
  isPoolWorthySource,
  adaptDupBody,
  registerCertifiedAnswer,
  rebuildDupQaEntry,
  extractGeoPlace,
  isGeoDupTarget,
  findPillarGeoSource,
  localizeGeoSegments,
};
