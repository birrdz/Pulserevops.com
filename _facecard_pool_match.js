// _facecard_pool_match.js — topical pool duplicate picker for CRO Pulse Tools (tl) (owner 2026-07-06)
'use strict';

const STOP = new Set(
  'a an the and or for in on at to of is are was were be been being have has had do does did will would can could should may might with from by as it its this that these those how what which who when where why best top'.split(
    ' ',
  ),
);

function tokenize(title) {
  return String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

function croBucket(title) {
  const t = String(title || '').toLowerCase();
  if (/\bfractional\b/.test(t)) return 'fractional';
  if (/\b(hire|hiring|recruit|should i hire|who is the best)\b/.test(t)) return 'hire';
  if (/\b(cost|salary|compensation|pay|rate|pricing|fee)\b/.test(t)) return 'cost';
  if (/\b(software|tool|platform|crm|tech stack|automation)\b/.test(t)) return 'tools';
  if (/\b(what is|what are|what does|role of|definition)\b/.test(t)) return 'what-is';
  if (/\b(saas|b2b|startup|enterprise)\b/.test(t)) return 'saas';
  if (/\b(in [a-z]|near me|dmv|maryland|delaware|virginia|district|city)\b/.test(t)) return 'geo';
  return 'general';
}

function geoTokens(title) {
  const t = String(title || '').toLowerCase();
  const m = t.match(/\bin\s+([a-z][a-z\s-]{2,40})/);
  if (m) return tokenize(m[1]);
  return [];
}

function overlapScore(a, b) {
  if (!a.length || !b.length) return 0;
  const A = new Set(a);
  const B = new Set(b);
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return inter / Math.max(A.size, B.size, 1);
}

/**
 * Pick best pool slot for a question, or null if duplicate would not make sense.
 * @param {string} question
 * @param {Array<{seq:number,question:string,bucket:string,tokens:string[]}>} meta
 * @param {{ minScore?: number }} opts
 */
function pickSmartPoolSlot(question, meta, opts) {
  if (!meta || !meta.length) return null;
  const minScore = (opts && opts.minScore) != null ? opts.minScore : 0.42;
  const tokens = tokenize(question);
  const bucket = croBucket(question);
  const geo = geoTokens(question);
  let best = null;
  let bestScore = 0;
  for (const row of meta) {
    if (row.seq == null) continue;
    let score = overlapScore(tokens, row.tokens || []);
    if (bucket === row.bucket) score += 0.35;
    if (bucket === 'geo' && row.bucket === 'geo') {
      score += overlapScore(geo, row.geo || []) * 0.5;
    }
    if (bucket !== row.bucket && bucket !== 'general' && row.bucket !== 'general') {
      score -= 0.25;
    }
    if (score > bestScore) {
      bestScore = score;
      best = row.seq;
    }
  }
  return bestScore >= minScore ? best : null;
}

function describeForMeta(question) {
  return {
    question: String(question || '').slice(0, 200),
    bucket: croBucket(question),
    tokens: tokenize(question),
    geo: geoTokens(question),
  };
}

module.exports = { tokenize, croBucket, geoTokens, overlapScore, pickSmartPoolSlot, describeForMeta };
