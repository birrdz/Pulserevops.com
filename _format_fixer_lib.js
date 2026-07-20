// _format_fixer_lib.js — content + structure rubric fixes only. Never changes image URLs.
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const { fixEntry, C } = require('./_v2_components');
const { countCroInBody } = require('./_cro_strip_lib');
const { auditQaGoldTemplate, appliesQaGold, needsQaGoldFix } = require('./_qa_gold_template');
const { enforceWriterVisualLock } = require('./_visual_lock_law');

const MIN_SCORE = 12;
const WORD_FLOOR = 2000;

function wordCount(b) {
  return String(b || '').replace(/[#*`>\-\[\]()!]/g, ' ').split(/\s+/).filter(Boolean).length;
}

const DA_INNER_RE = /##\s+Direct\s+Answer\s*\n+([\s\S]*?)(?=\n##\s|\n```|$)/i;
const DA_BLOCK_REPLACE_RE = /##\s+Direct\s+Answer\s*\n+[\s\S]*?(?=\n##\s|$)/i;

function directAnswerInner(body) {
  const m = String(body || '').match(DA_INNER_RE);
  return m ? m[1] : '';
}

function directAnswerTextOnly(body) {
  return String(directAnswerInner(body) || '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/[#*`>_]/g, '')
    .trim();
}

function directAnswerEmpty(body) {
  if (!/^##\s+Direct\s+Answer/im.test(String(body || ''))) return true;
  return !directAnswerTextOnly(body);
}

function directAnswerFull(body) {
  const para = directAnswerTextOnly(body);
  const sentences = (para.match(/[.!?](?:\s|$)/g) || []).length;
  return para.length >= 140 && sentences >= 2;
}

/** Owner: DA must be short (2–3 sentences). Fat / mashed DA counts as broken. */
function directAnswerNeedsSlim(body) {
  const b = String(body || '');
  // "## Direct Answer **Yes**…" — heading not on its own line (renderer shows raw ##)
  // Only horizontal whitespace — \s would also match a correct blank line after the heading.
  if (/^##\s+Direct\s+Answer[ \t]+\S/im.test(b)) return true;
  // Depth H2s mashed into the DA paragraph
  if (/##\s+Direct\s+Answer[\s\S]{0,12000}?##\s+(?!Direct\s+Answer|FAQ|Sources|Related)/i.test(b)) {
    const inner = directAnswerInner(b);
    if (inner && /##\s+\S/.test(inner)) return true;
  }
  const para = directAnswerTextOnly(b);
  if (!para) return /^##\s+Direct\s+Answer/im.test(b);
  const sentences = (para.match(/[.!?](?:\s|$)/g) || []).length;
  if (para.length > 420 || sentences > 3) return true;
  const words = para.split(/\s+/).filter(Boolean).length;
  return words > 70;
}

/** Split prose into sentences without mangling decimals / URLs. */
function splitSentences(text) {
  const t = String(text || '').replace(/\s+/g, ' ').trim();
  if (!t) return [];
  const parts = [];
  let buf = '';
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    buf += ch;
    if (/[.!?]/.test(ch)) {
      const next = t[i + 1];
      const prev = t[i - 1];
      if (ch === '.' && prev && /\d/.test(prev) && next && /\d/.test(next)) continue;
      if (ch === '.' && prev && /[A-Z]/.test(prev) && next && /[A-Z]/.test(next)) continue;
      if (next == null || /\s/.test(next) || /["')\]]/.test(next)) {
        const s = buf.trim();
        if (s) parts.push(s);
        buf = '';
        while (i + 1 < t.length && /\s/.test(t[i + 1])) i++;
      }
    }
  }
  if (buf.trim()) parts.push(buf.trim());
  return parts;
}

/**
 * Repair mashed Direct Answer walls:
 * 1) Ensure newline after ## Direct Answer
 * 2) Explode inline ## depth headings that were swallowed into the DA paragraph
 * 3) Slim DA prose to 2–3 sentences (~40–80 words; keep ≥140 chars / ≥2 sents for rubric)
 */
function repairSlimDirectAnswer(body) {
  let b = String(body || '').replace(/\r\n/g, '\n');
  if (!/^##\s+Direct\s+Answer/im.test(b)) return b;

  // Normalize heading variants
  b = b
    .replace(/^###\s+Direct\s+Answer/im, '## Direct Answer')
    .replace(/^##\s+Quick\s+Answer/im, '## Direct Answer')
    .replace(/^###\s+Quick\s+Answer/im, '## Direct Answer');

  // "## Direct Answer **Yes**…" → "## Direct Answer\n\n**Yes**…"
  b = b.replace(/^##\s+Direct\s+Answer[ \t]+(?=\S)/im, '## Direct Answer\n\n');

  // Explode inline H2s (not inside fences): "…text. ## What is…" → proper section breaks
  const parts = b.split(/(```[\s\S]*?```)/g);
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].startsWith('```')) continue;
    parts[i] = parts[i].replace(/([^\n])[ \t]*(##\s+[^\n#]+)/g, (m, prev, h2) => {
      const title = h2.replace(/^##\s+/, '').trim();
      if (!title) return m;
      return prev + '\n\n## ' + title + '\n\n';
    });
  }
  b = parts.join('');

  // Slim only the Direct Answer block prose
  b = b.replace(/^(##\s+Direct\s+Answer\n+)([\s\S]*?)(?=\n##\s|$)/im, (full, h, block) => {
    const mediaRe = /(\n(?:!\[[^\]]*\]\([^)]+\)|```[\s\S]*?```)\s*)/;
    const mediaM = block.match(mediaRe);
    const firstMediaAt = mediaM && mediaM.index > 0 ? mediaM.index : -1;
    const proseRaw = firstMediaAt >= 0 ? block.slice(0, firstMediaAt) : block;
    const tail = firstMediaAt >= 0 ? block.slice(firstMediaAt) : '';
    const plain = proseRaw
      .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const sents = splitSentences(plain);
    const wordN = (t) => String(t || '').split(/\s+/).filter(Boolean).length;
    // Already tight enough (gold: ~40–60 words, 2–3 sentences)
    if (sents.length <= 3 && plain.length <= 420 && wordN(plain) <= 70) {
      return h.replace(/\n+$/, '\n\n') + plain + '\n' + (tail ? (tail.startsWith('\n') ? tail : '\n' + tail) : '');
    }
    let keep = sents.slice(0, Math.min(3, sents.length));
    let joined = keep.join(' ');
    // Prefer 2 sentences when still bloated
    while ((wordN(joined) > 65 || joined.length > 420) && keep.length > 2) {
      keep = keep.slice(0, keep.length - 1);
      joined = keep.join(' ');
    }
    if (keep.length < 2 && sents.length >= 2) {
      keep = sents.slice(0, 2);
      joined = keep.join(' ');
    }
    // Rubric floor: ≥140 chars / ≥2 sentences when available
    while (joined.length < 140 && keep.length < sents.length) {
      keep = sents.slice(0, keep.length + 1);
      joined = keep.join(' ');
    }
    if (!joined) return full;
    if (!/\*\*[^*]+\*\*/.test(joined) && /\*\*[^*]+\*\*/.test(plain)) {
      const bold = plain.match(/\*\*([^*]+)\*\*/);
      if (bold && !joined.includes(bold[1])) {
        joined = joined.replace(bold[1], '**' + bold[1] + '**');
      }
    }
    return h.replace(/\n+$/, '\n\n') + joined + '\n' + (tail ? (tail.startsWith('\n') ? tail : '\n' + tail) : '');
  });

  return b.replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

/** Old broken passes put mermaid/code inside ## Direct Answer — strip and relocate orphans. */
function repairBrokenDirectAnswer(body) {
  let b = String(body || '');
  const m = b.match(DA_INNER_RE);
  if (!m) return b;
  const inner = m[1];
  const orphanMermaid = (inner.match(/```mermaid[\s\S]*?```/g) || []);
  const textOnly = directAnswerTextOnly(b);
  const sentences = (textOnly.match(/[.!?](?:\s|$)/g) || []).length;
  if (textOnly.length >= 140 && sentences >= 2) return b;
  let rest = b.replace(DA_BLOCK_REPLACE_RE, '').replace(/\n{3,}/g, '\n\n').trim();
  const daStub = '## Direct Answer\n\n';
  const insert = orphanMermaid.length ? '\n\n' + orphanMermaid.join('\n\n') : '';
  const heroM = rest.match(/^!\[[^\]]*\]\([^)]+\)/m);
  if (heroM) {
    const idx = rest.indexOf(heroM[0]) + heroM[0].length;
    rest = rest.slice(0, idx).trimEnd() + '\n\n' + daStub.trimEnd() + insert + '\n\n' + rest.slice(idx).trimStart();
  } else {
    rest = daStub + insert + '\n\n' + rest;
  }
  return rest.replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

async function ensureDirectAnswerText(title, body, chat) {
  let b = repairBrokenDirectAnswer(body);
  b = ensureDirectAnswerAfterHero(b);
  if (directAnswerFull(b)) return b;
  const { genDirectAnswer } = require('./_v2_components');
  const { dsChat } = require('./_ds_lib');
  const daBlock = await genDirectAnswer(title, chat || dsChat);
  if (DA_BLOCK_REPLACE_RE.test(b)) b = b.replace(DA_BLOCK_REPLACE_RE, daBlock.trim());
  else {
    const heroM = b.match(/^!\[[^\]]*\]\([^)]+\)/m);
    if (heroM) {
      const idx = b.indexOf(heroM[0]) + heroM[0].length;
      b = b.slice(0, idx).trimEnd() + '\n\n' + daBlock.trim() + '\n\n' + b.slice(idx).trimStart();
    } else {
      b = daBlock.trim() + '\n\n' + b;
    }
  }
  return ensureDirectAnswerAfterHero(b);
}

/** Blob must not carry baked CRO — render-time injects card after Direct Answer only. */
function croBlobClean(body) {
  const b = String(body || '');
  if (countCroInBody(b) > 0) return false;
  if (/\bkory-white\.jpg\b/i.test(b)) return false;
  if (/<aside class=["']cro-ad/i.test(b)) return false;
  return true;
}

/** Reading order for live CRO card: hero image → ## Direct Answer (full) → [render injects CRO] → rest. */
function croPlacementReady(body) {
  const b = String(body || '');
  if (!C.topImage(b)) return false;
  if (!C.directAnswer(b)) return false;
  if (!directAnswerFull(b)) return false;
  if (!croBlobClean(b)) return false;
  const heroM = b.match(/!\[[^\]]*\]\([^)]+\)/);
  if (!heroM) return false;
  const heroIdx = b.indexOf(heroM[0]);
  const daM = b.match(/##\s+Direct\s+Answer\b/i);
  if (!daM || daM.index <= heroIdx) return false;
  const afterHero = b.slice(heroIdx + heroM[0].length);
  const firstH2 = afterHero.match(/\n##\s+([^\n]+)/);
  if (!firstH2) return true;
  return /^Direct\s+Answer\b/i.test(firstH2[1].trim());
}

const DA_BLOCK_RE = /##\s+Direct\s+Answer\s*\n+[\s\S]*?(?=\n##\s|\n---\s*$|\s*$)/i;

/** Move ## Direct Answer block to immediately follow the hero image (CRO inject point). */
function ensureDirectAnswerAfterHero(body) {
  let b = String(body || '').replace(/\r\n/g, '\n').trim();
  const daM = b.match(DA_BLOCK_RE);
  if (!daM) return b;
  const daBlock = daM[0].trim();
  let rest = b.replace(DA_BLOCK_RE, '').replace(/\n{3,}/g, '\n\n').trim();
  const heroM = rest.match(/!\[[^\]]*\]\([^)]+\)/);
  if (!heroM) return b;
  const heroIdx = rest.indexOf(heroM[0]);
  const heroEnd = heroIdx + heroM[0].length;
  const before = rest.slice(0, heroEnd).trimEnd();
  const after = rest.slice(heroEnd).replace(/^\n+/, '').trimStart();
  const out = [before, '', daBlock, after].filter(Boolean).join('\n\n');
  return out.replace(/\n{3,}/g, '\n\n').trim();
}

const CONTENT_KEYS = [
  'words2000', 'heroImage', 'directAnswer', 'directAnswerFull', 'croBlobClean', 'croPlacementReady',
  'faq6', 'mermaid2', 'mermaidClean', 'sources5', 'relatedPulse', 'linksClean', 'score12',
];

function contentRubricAudit(id, body, opts) {
  opts = opts || {};
  const valid = opts.valid || new Set();
  const g = gradeEntry(id, body, { imagesDeferred: true });
  const wc = wordCount(body);
  const checks = {
    words2000: wc >= WORD_FLOOR,
    heroImage: C.topImage(body),
    directAnswer: C.directAnswer(body),
    directAnswerFull: directAnswerFull(body),
    croBlobClean: croBlobClean(body),
    croPlacementReady: croPlacementReady(body),
    faq6: C.faq5(body),
    mermaid2: C.twoMermaid(body),
    mermaidClean: C.mermaidClean(body),
    sources5: C.sources5(body),
    relatedPulse: C.related(body),
    linksClean: C.linksClean(body, valid),
    score12: g.score >= MIN_SCORE,
  };
  if (opts.qaGoldOutline && appliesQaGold(id, body, { title: opts.title })) {
    const gold = auditQaGoldTemplate(body, opts.title, id);
    checks.qaGoldOutline = gold.compliant;
  }
  const keys = opts.qaGoldOutline && appliesQaGold(id, body, { title: opts.title })
    ? CONTENT_KEYS.concat(['qaGoldOutline'])
    : CONTENT_KEYS;
  const failed = keys.filter(k => !checks[k]);
  const total = keys.length;
  const passed = total - failed.length;
  return {
    pass: failed.length === 0,
    checks,
    failed,
    passed,
    total,
    rubricPct: Math.round(passed / total * 100),
    contentScore: g.score,
    words: wc,
    wordFloor: WORD_FLOOR,
    missing: g.missing || [],
    qaGoldIssues: checks.qaGoldOutline === false
      ? (auditQaGoldTemplate(body, opts.title, id).issues || [])
      : [],
  };
}

function contentFormatPass(id, body, valid) {
  return contentRubricAudit(id, body, { valid }).pass;
}

/** When sliceKeys is set, pass/fail only those rubric checks (used by Rubric Writing station). */
function auditForFix(id, body, opts) {
  opts = opts || {};
  const base = contentRubricAudit(id, body, opts);
  const sliceKeys = opts.sliceKeys;
  if (!sliceKeys || !sliceKeys.length) return base;
  const failed = sliceKeys.filter(k => !(base.checks && base.checks[k]));
  const total = sliceKeys.length;
  const passed = total - failed.length;
  return {
    pass: failed.length === 0,
    checks: Object.fromEntries(sliceKeys.map(k => [k, !!(base.checks && base.checks[k])])),
    failed,
    passed,
    total,
    rubricPct: total ? Math.round(passed / total * 100) : base.rubricPct,
    contentScore: base.contentScore,
    words: base.words,
    wordFloor: base.wordFloor,
    missing: base.missing,
  };
}

function isImageLine(line) {
  const t = String(line || '').trim();
  return /^!\[[^\]]*\]\([^)]+\)/.test(t) || /^@@PRODUCT\b/.test(t);
}

function collectImageLines(body) {
  return String(body || '').split('\n').filter(isImageLine);
}

/** Restore original image / @@PRODUCT lines — content fixes must not add or swap images. */
function preserveImages(originalBody, newBody, opts) {
  return enforceWriterVisualLock(originalBody, newBody, opts || {});
}

async function formatFixEntry(id, title, body, opts) {
  opts = opts || {};
  const valid = opts.valid || new Set();
  const siblings = opts.siblings || [];
  const store = opts.store;
  const original = String(body || '');
  const steps = [];
  let b = original;
  // Owner 2026-07-20: always repair mashed / obese Direct Answers before anything else
  if (directAnswerNeedsSlim(b) || !directAnswerFull(b)) {
    const slimmed = repairSlimDirectAnswer(b);
    if (slimmed !== b) {
      b = slimmed;
      steps.push('da-slim');
    }
  }
  const auditOpts = { valid, sliceKeys: opts.sliceKeys, title, qaGoldOutline: opts.qaGoldOutline !== false && appliesQaGold(id, b, { title }) };
  const before = auditForFix(id, original, auditOpts);
  let afterPre = auditForFix(id, b, auditOpts);
  if (afterPre.pass && !directAnswerNeedsSlim(b)) {
    b = preserveImages(original, b, { id, title, qaGold: auditOpts.qaGoldOutline });
    return { body: b, steps: steps.length ? steps : ['already-pass'], before, after: afterPre, pass: true, skipped: !steps.length };
  }

  const target = (opts.pillarOf && opts.pillarOf(id) === 'q') ? 8 : 25;
  if (opts.deban && opts.boldify) {
    const nb = opts.boldify(opts.deban(b), target);
    if (nb !== b) { b = nb; steps.push('deban+bold'); }
  }
  if (opts.ensureErFormat) {
    const er = opts.ensureErFormat(id, b);
    if (er !== b) { b = er; steps.push('er-format'); }
  }
  if (opts.enforceCroCardLaw) {
    const cr = opts.enforceCroCardLaw(b, id);
    if (cr !== b) { b = cr; steps.push('cro-strip'); }
  }
  const ordered = ensureDirectAnswerAfterHero(b);
  if (ordered !== b) { b = ordered; steps.push('da-after-hero'); }
  b = preserveImages(original, b, { id, title, qaGold: auditOpts.qaGoldOutline });

  let after = auditForFix(id, b, auditOpts);
  const maxRounds = opts.maxRounds != null ? opts.maxRounds : 2;
  for (let round = 0; round < maxRounds && !after.pass; round++) {
    if (opts.shouldStop && opts.shouldStop()) return { body: b, steps, before, after, pass: false, stopped: true };
    if (!opts.fixEntry || !store) break;
    if (opts.onProgress) opts.onProgress({ phase: 'deepseek', round: round + 1, label: 'Content stations · round ' + (round + 1) });
    await store.setJSON('answers/' + id + '.json', Object.assign({}, opts.entryMeta || {}, {
      answer: b,
      h1: (opts.entryMeta && opts.entryMeta.h1) || title,
      updated_at: new Date().toISOString(),
    }));
    await opts.fixEntry(id, title, siblings, valid, opts.dsChat).catch(() => null);
    const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
    if (e && e.answer) b = preserveImages(original, e.answer, { id, title, qaGold: auditOpts.qaGoldOutline });
    steps.push('deepseek-r' + (round + 1));
    if (opts.enforceCroCardLaw) b = preserveImages(original, opts.enforceCroCardLaw(b, id), { id, title, qaGold: auditOpts.qaGoldOutline });
    const ord = ensureDirectAnswerAfterHero(b);
    if (ord !== b) { b = preserveImages(original, ord, { id, title, qaGold: auditOpts.qaGoldOutline }); steps.push('da-after-hero'); }
    if (opts.ensureErFormat) b = preserveImages(original, opts.ensureErFormat(id, b), { id, title, qaGold: auditOpts.qaGoldOutline });
    if (opts.sliceKeys && opts.sliceKeys.includes('relatedPulse') && siblings.length) {
      const rel = '## Related on PULSE\n\n' + siblings.slice(0, 5).map(s => '- [' + String(s.title || s.id).replace(/[\[\]]/g, '') + '](/knowledge/' + (s.id || s) + ')').join('\n');
      if (!/## Related on PULSE/i.test(b)) b = preserveImages(original, b.trimEnd() + '\n\n' + rel + '\n', { id, title, qaGold: auditOpts.qaGoldOutline });
      else {
        const nb = b.replace(/#{2,3}\s*Related on PULSE[\s\S]*?(?=\n#{2,3}\s|$)/i, rel + '\n\n');
        if (nb !== b) b = preserveImages(original, nb, { id, title, qaGold: auditOpts.qaGoldOutline });
      }
      if (!steps.includes('related-pulse')) steps.push('related-pulse');
    }
    after = auditForFix(id, b, auditOpts);
  }

  // Final DA slim — DeepSeek often re-bloats the lead
  if (directAnswerNeedsSlim(b) || !directAnswerFull(b)) {
    const slimmed = repairSlimDirectAnswer(b);
    if (slimmed !== b) {
      b = preserveImages(original, slimmed, { id, title, qaGold: auditOpts.qaGoldOutline });
      steps.push('da-slim-final');
      after = auditForFix(id, b, auditOpts);
    }
  }

  return { body: b, steps, before, after, pass: after.pass };
}

module.exports = {
  MIN_SCORE,
  WORD_FLOOR,
  wordCount,
  directAnswerEmpty,
  directAnswerFull,
  directAnswerTextOnly,
  directAnswerNeedsSlim,
  splitSentences,
  repairSlimDirectAnswer,
  repairBrokenDirectAnswer,
  ensureDirectAnswerText,
  croBlobClean,
  croPlacementReady,
  ensureDirectAnswerAfterHero,
  contentRubricAudit,
  auditForFix,
  contentFormatPass,
  preserveImages,
  ensureDirectAnswerAfterHero,
  formatFixEntry,
  CONTENT_KEYS,
  needsQaGoldFix,
  auditQaGoldTemplate,
  appliesQaGold,
};
