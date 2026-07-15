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
  const auditOpts = { valid, sliceKeys: opts.sliceKeys, title, qaGoldOutline: opts.qaGoldOutline !== false && appliesQaGold(id, b, { title }) };
  const before = auditForFix(id, b, auditOpts);
  if (before.pass) {
    return { body: b, steps: ['already-pass'], before, after: before, pass: true, skipped: true };
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

  return { body: b, steps, before, after, pass: after.pass };
}

module.exports = {
  MIN_SCORE,
  WORD_FLOOR,
  wordCount,
  directAnswerEmpty,
  directAnswerFull,
  directAnswerTextOnly,
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
