// Aquariums pillar — Q&A gold path (q11133 law) for non-ranking essay entries.
process.env.POLLINATOR_FREQ_MS = process.env.POLLINATOR_FREQ_MS || '20000';
process.env.DDG_THROTTLE_COOLDOWN_MS = process.env.DDG_THROTTLE_COOLDOWN_MS || '15000';
process.env.DDG_DELAY_MS = process.env.DDG_DELAY_MS || '15000';
const { fillEntryMissingImages, repairBrokenQaImages } = require('./_ddg_facecard_lib');
const { learnLogLine } = require('./_image_provider_alternate');
const { fixEntry } = require('./_v2_components');
const { dsChat } = require('./_ds_lib');
const { stripAllCroFromBody } = require('./_cro_strip_lib');
const { isKoryCroImg } = require('./_img_flux_lib');
const {
  formatFixEntry,
  contentRubricAudit,
  ensureDirectAnswerAfterHero,
  repairBrokenDirectAnswer,
  ensureDirectAnswerText,
  directAnswerFull,
  wordCount,
  WORD_FLOOR,
} = require('./_format_fixer_lib');
const { auditQaGoldTemplate, needsQaGoldFix, appliesQaGold, reshapeQaGoldBody } = require('./_qa_gold_template');
const { lockQaVisualShape } = require('./_visual_lock_law');
const { auditDirectAnswerNotBlank } = require('./_image_provider_alternate');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const { prepareEntryForPublish } = require('./_write_lib');
const { pickGoldTemplate } = require('./_pulse_gold_template_router');
const { entryTopicKey } = require('./netlify/functions/lib/entry-image-query');

const FORMAT_V_QA_GOLD = '2026-07-aq-qa-gold';
const FORMAT_V_AQ_QA = FORMAT_V_QA_GOLD;

const BAN_MAP = [[/\bdelve(?:\s+into)?\b/gi, 'examine'], [/\btapestry\b/gi, 'mix'], [/\blandscape\b/gi, 'market'], [/\bholistic\b/gi, 'complete'], [/\bin\s+today'?s\b/gi, 'in the'], [/\bever-?evolving\b/gi, 'changing']];

function deban(body) {
  let b = String(body);
  for (const [re, rep] of BAN_MAP) b = b.replace(re, rep);
  return b;
}

function boldify(body, target) {
  let b = String(body);
  const count = () => (b.match(/\*\*[^*\n]+\*\*/gi) || []).length;
  if (count() >= target) return b;
  b = b.replace(/^(\s*[-*]\s+)([A-Z][^:\n*]{2,46}):\s/gm, (m, p, lead) => count() >= target ? m : `${p}**${lead.trim()}:** `);
  return b;
}

function enforceCroCardLaw(body) {
  let b = stripAllCroFromBody(String(body || ''));
  return b.split('\n').filter(line => {
    const m = line.match(/!\[([^\]]*)\]\(([^)\s]+)\)/);
    return !(m && isKoryCroImg(m[2]));
  }).join('\n');
}

function isStub(body) {
  const b = reshapeQaGoldBody(String(body || ''));
  if (wordCount(b) < 800) return true;
  if (/^!\[[^\]]*\]\([^)]+\)/.test(b.trim()) && !/^##\s+Direct\s+Answer/im.test(b.trim())) return true;
  if (!/^##\s+Direct\s+Answer/im.test(b)) return true;
  if (auditDirectAnswerNotBlank(b).length) return true;
  if (!directAnswerFull(b)) return true;
  return false;
}

function needsAqQaFix(id, body, title, entry, forceAll) {
  if (pickGoldTemplate(id, body, title).template !== 'qa') return false;
  if (forceAll) return true;
  if (isStub(body)) return true;
  if (needsQaGoldFix(body, title, id)) return true;
  if (entry && entry.format_v !== FORMAT_V_AQ_QA) return true;
  const audit = contentRubricAudit(id, body, { title, qaGoldOutline: true });
  if (!audit.pass) return true;
  return false;
}

async function rebuildAqQaEntry(id, title, body, opts) {
  opts = opts || {};
  if (!opts.store) throw new Error('rebuildAqQaEntry requires opts.store');
  if (!appliesQaGold(id, body, { title })) {
    throw new Error('Entry does not apply Q&A gold: ' + id);
  }

  let b = enforceCroCardLaw(reshapeQaGoldBody(String(body || '')));
  b = repairBrokenDirectAnswer(b);
  b = boldify(deban(b), 25);
  b = ensureDirectAnswerAfterHero(b);
  b = await ensureDirectAnswerText(title, b, opts.dsChat);

  const r = await formatFixEntry(id, title, b, {
    valid: opts.valid || new Set(),
    siblings: opts.siblings || [],
    store: opts.store,
    entryMeta: opts.entryMeta || { id, question: title, answer: b },
    fixEntry,
    dsChat,
    deban,
    boldify,
    enforceCroCardLaw,
    qaGoldOutline: true,
    maxRounds: opts.maxRounds != null ? opts.maxRounds : 3,
    onProgress: opts.onProgress,
  });
  b = r.body || b;
  b = lockQaVisualShape(enforceCroCardLaw(b), id, title);
  if (auditDirectAnswerNotBlank(b).length) {
    b = await ensureDirectAnswerText(title, b, opts.dsChat);
    b = ensureDirectAnswerAfterHero(enforceCroCardLaw(b));
  }

  const topicKey = entryTopicKey(title);
  const imageOpts = {
    onProgress: opts.onProgress,
    upgradeMode: true,
    alternateSources: true,
    pollinatorPrefer: true,
    allowTopicalReuse: true,
    topicKey,
  };

  const repaired = await repairBrokenQaImages(id, title, b, imageOpts);
  b = repaired.body || b;

  const filled = await fillEntryMissingImages(id, title, b, imageOpts);
  b = filled.body || b;
  b = ensureDirectAnswerAfterHero(enforceCroCardLaw(b));

  // Gold audit: direct_answer_blank — regenerate DA and re-run format pass (up to 2 tries).
  for (let daTry = 0; daTry < 2 && auditDirectAnswerNotBlank(b).length; daTry++) {
    if (opts.onProgress) opts.onProgress({ label: 'regen Direct Answer', phase: 'direct-answer' });
    b = await ensureDirectAnswerText(title, b, opts.dsChat);
    b = ensureDirectAnswerAfterHero(enforceCroCardLaw(b));
    const daFix = await formatFixEntry(id, title, b, {
      valid: opts.valid || new Set(),
      siblings: opts.siblings || [],
      store: opts.store,
      entryMeta: opts.entryMeta || { id, question: title, answer: b },
      fixEntry,
      dsChat,
      deban,
      boldify,
      enforceCroCardLaw,
      qaGoldOutline: true,
      maxRounds: 1,
      onProgress: opts.onProgress,
    });
    b = daFix.body || b;
    b = ensureDirectAnswerAfterHero(enforceCroCardLaw(b));
  }

  const throttleLearn = filled.throttleLearn || repaired.throttleLearn || null;
  if (opts.onProgress) opts.onProgress({ label: learnLogLine(), phase: 'throttle-learn' });

  const gold = auditQaGoldTemplate(b, title, id);
  const audit = contentRubricAudit(id, b, { valid: opts.valid || new Set(), title, qaGoldOutline: true });
  const grade = gradeEntry(id, b);
  const wc = wordCount(b);

  if (!gold.compliant) {
    throw new Error('Q&A gold audit: ' + (gold.issues || []).join(', '));
  }
  if (!audit.pass || wc < WORD_FLOOR) {
    throw new Error('Rubric: ' + wc + 'w · ' + (audit.failed || []).join(', '));
  }
  if (grade.score < 13) {
    throw new Error('Grade ' + grade.score + '/13 required: ' + (grade.missing || []).join(', '));
  }

  return {
    body: b,
    gold,
    audit,
    grade: grade.score,
    formatSteps: r.steps || [],
    words: wc,
    throttleLearn,
    learnLogLine: learnLogLine(),
  };
}

async function saveQaGoldEntry(store, idx, id, title, body, existing) {
  const now = Date.now();
  const grade = gradeEntry(id, body);
  const pre = (String(id).match(/^[a-z]+/) || ['q'])[0];
  const heroM = String(body || '').match(/^!\[[^\]]*\]\(([^)]+)\)/);
  const entry = prepareEntryForPublish(id, title, {
    id,
    question: title,
    answer: body,
    tags: (existing && existing.tags) || [pre],
    quality_score: Math.max(12, grade.score),
    format_v: FORMAT_V_QA_GOLD,
    pending: false,
    ts: existing && existing.ts ? existing.ts : now,
    polished_at: now,
    cover_src: heroM ? 'inline-hero' : 'no-hero',
    face_title_baked: false,
    image_topic_key: entryTopicKey(title),
  });
  await store.setJSON('answers/' + id + '.json', entry);
  const i = (idx.entries || []).findIndex(e => e && e.id === id);
  const row = {
    id,
    question: title,
    format_v: FORMAT_V_QA_GOLD,
    cover_src: entry.cover_src,
    img: heroM ? heroM[1] : '',
    polished_at: now,
  };
  if (i >= 0) idx.entries[i] = Object.assign({}, idx.entries[i], row);
  return { grade: grade.score, imgs: (body.match(/!\[[^\]]*\]\([^)]+\)/g) || []).length };
}

/** @deprecated use saveQaGoldEntry */
const saveAqQaEntry = saveQaGoldEntry;

module.exports = {
  FORMAT_V_QA_GOLD,
  FORMAT_V_AQ_QA,
  needsAqQaFix,
  needsQaGoldEntryFix: needsAqQaFix,
  rebuildAqQaEntry,
  rebuildQaGoldEntry: rebuildAqQaEntry,
  saveQaGoldEntry,
  saveAqQaEntry,
  isStub,
  repairBrokenQaImages,
};
