// _v2_publish_verify.js — deterministic publish spot-check (4444). Shared by dual gate + watcher.
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const { auditComparisonEntry } = require('./netlify/functions/lib/vs-expert-verify');
const { C } = require('./_v2_components');

const MIN_SCORE = parseInt(process.env.V2C_MIN_SCORE || '12', 10);
const WORD_FLOOR = parseInt(process.env.V2C_WORDS || '2000', 10);

const wordCount = b => (String(b || '').replace(/```[\s\S]*?```/g, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').match(/[A-Za-z0-9'-]+/g) || []).length;

function stationGaps(b, valid, id, title) {
  const f = [];
  const score = gradeEntry(id || 'x', b, { imagesDeferred: true }).score;
  if (score < MIN_SCORE) f.push(`score<${MIN_SCORE}`);
  if (wordCount(b) < WORD_FLOOR) f.push(`words<${WORD_FLOOR}`);
  if (!C.directAnswer(b)) f.push('directAnswer');
  if (!C.faq(b)) f.push('faq');
  if (!C.faq5(b)) f.push('faq5');
  if (!C.sources(b)) f.push('sources');
  if (!C.sources5(b)) f.push('sources5');
  if (!C.twoMermaid(b)) f.push('twoMermaid');
  if (!C.mermaidClean(b)) f.push('mermaidClean');
  if (!C.related(b)) f.push('related');
  if (!C.linksClean(b, valid)) f.push('linksClean');
  // CRO card injected at render time — not required in blob body
  if (!C.topImage(b)) f.push('topImage');
  if (/!\[\s*\]\(/.test(b)) f.push('emptyAlt');
  const vs = auditComparisonEntry(id || 'x', title || '', b);
  if (vs.isComparison) {
    if (!vs.structuralPass) f.push(...vs.gaps.map(g => 'vs:' + g));
    else if (!vs.render || !vs.render.renders) f.push('vs:compare_wont_render');
  }
  return { score, gaps: f, vsAudit: vs.isComparison ? vs : null };
}

function spotCheckEntry(id, body, valid, title) {
  if (!body) return { pass: false, score: 0, gaps: ['no-blob'], words: 0 };
  const { score, gaps, vsAudit } = stationGaps(body, valid, id, title);
  const words = wordCount(body);
  const pass = score >= MIN_SCORE && gaps.length === 0;
  const quality = pass ? `${score}/13` : null;
  return { pass, score, gaps, words, quality, minScore: MIN_SCORE, vsAudit };
}

module.exports = { spotCheckEntry, stationGaps, wordCount, MIN_SCORE, WORD_FLOOR };
