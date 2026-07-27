// _ds_antidrift.js — 🔒 DEEPSEEK ANTI-DRIFT / ANTI-DUPLICATE LAW (owner 2026-07-21).
// Canonical spec: ../_DEEPSEEK_ANTIDRIFT_LAW.md. Self-contained module implementing all 5
// mechanisms that keep the DeepSeek writer from converging to boilerplate / near-duplicates:
//   1. ANCHOR INJECTION   — 3-5 entry-specific anchors forced verbatim; checkAnchors() rejects misses.
//   2. BANNED PHRASE LIST  — _BANNED_PHRASES.json injected into the prompt; updateBanned() grows it.
//   3. POST-GEN DUP GATE   — cosine > 0.82 OR shared 8-gram vs last 200 accepted in the pillar → reject.
//   4. STRUCTURE ROTATION  — _SKELETONS.json, 4+ outline skeletons/pillar, assigned by entry-index mod N.
//   5. SCOPE FENCE         — "single topic … do not generalize/pad/restate/add sections beyond skeleton".
//
// Orchestration (the 2-attempt temp-bump retry) lives in improve_content.js which calls buildAugment()
// before generation and postGen() after. This module is PURE (no network) so it is safe to unit-test.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');                       // website root
const BANNED_FILE = path.join(ROOT, '_BANNED_PHRASES.json');
const SKEL_FILE = path.join(ROOT, '_SKELETONS.json');
const DRIFT_LOG = path.join(ROOT, '_DRIFT_LOG.md');
const STORE_DIR = path.join(__dirname, 'imagebank');           // per-pillar accepted stores live here
const DUP_COSINE = 0.82;                                       // reject at cosine sim > this
const GRAM_N = 8;                                              // shared N-gram → reject
const STORE_KEEP = 200;                                        // last-N accepted entries kept per pillar
const BANNED_CAP = 200;                                        // banned-phrase list cap (oldest roll off)

// ── pillar + stable index ───────────────────────────────────────────────────
function pillarOf(id) {
  const m = String(id || '').match(/^([a-z]+)/i);
  return m ? m[1].toLowerCase() : 'x';
}
function entryIndex(id) {
  const m = String(id || '').match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

// ── tokenization / vectors / n-grams (shared by dup-gate + banned-phrase miner) ──
const STOP = new Set(('a an and are as at be but by for from has have how i if in into is it its of on or should '
  + 'that the their they this to was what when where which who why with you your do does can could would will '
  + 'about over under between across per each any some more most not no yes we our us he she his her them then '
  + 'than so such just also very much many few one two three').split(/\s+/));
function cleanText(text) {
  return String(text || '')
    .replace(/```[\s\S]*?```/g, ' ')             // code / mermaid fences
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')        // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')      // link text only
    .replace(/https?:\/\/\S+/g, ' ')             // bare urls
    .replace(/[#>*_`~|=\-]/g, ' ')               // markdown punctuation
    .toLowerCase();
}
function tokens(text, keepStop) {
  const raw = cleanText(text).replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean);
  return keepStop ? raw : raw.filter(w => w.length >= 3 && !STOP.has(w));
}
function tfVector(toks) {
  const m = Object.create(null);
  for (const t of toks) m[t] = (m[t] || 0) + 1;
  return m;
}
function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (const k in a) { na += a[k] * a[k]; if (b[k]) dot += a[k] * b[k]; }
  for (const k in b) nb += b[k] * b[k];
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}
function hash32(s) { return crypto.createHash('md5').update(s).digest().readUInt32LE(0); }
// deduped set of N-gram hashes over the FULL token stream (stopwords kept — boilerplate uses them).
function gramSet(text, n) {
  n = n || GRAM_N;
  const t = tokens(text, true);
  const set = new Set();
  for (let i = 0; i + n <= t.length; i++) set.add(hash32(t.slice(i, i + n).join(' ')));
  return set;
}

// ── (1) ANCHOR INJECTION ─────────────────────────────────────────────────────
// A single, near-ubiquitous keyword per pillar (safe verbatim anchor — appears in virtually every entry).
const PILLAR_ANCHOR = {
  tl: 'RevOps', q: 'RevOps', gp: 'revenue', ra: 'revenue', cg: 'RevOps',
  bo: 'commercial', sw: 'software', st: 'sales', ik: 'metric', bs: 'strategy',
};
function pillarAnchor(pillar) { return PILLAR_ANCHOR[pillar] || 'revenue'; }

// derive 3-5 entry-specific anchors from the question + id.
function deriveAnchors(question, id) {
  const q = String(question || '');
  const pillar = pillarOf(id);
  const out = [];
  const push = (w) => { if (w && !out.some(x => x.toLowerCase() === w.toLowerCase())) out.push(w); };

  // city / proper-place: capitalized phrase after " in " that is NOT a 4-digit year.
  const mIn = q.match(/\bin\s+([A-Z][a-zA-Z]+(?:[ -][A-Z][a-zA-Z]+){0,2})\b/);
  if (mIn && !/^\d{4}$/.test(mIn[1])) push(mIn[1]);

  // distinctive nouns from the question: longest non-stopword tokens (keep original surface form).
  const surface = q.replace(/[^A-Za-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean);
  const scored = surface
    .filter(w => w.length >= 4 && !STOP.has(w.toLowerCase()) && !/^\d{4}$/.test(w))
    .sort((a, b) => b.length - a.length);
  for (const w of scored) { if (out.length >= 4) break; push(w); }

  // pillar keyword (near-ubiquitous, safe verbatim).
  push(pillarAnchor(pillar));

  // guarantee 3-5.
  return out.slice(0, 5);
}
// returns the anchors NOT found (case-insensitive substring) in the output.
function checkAnchors(output, anchors) {
  const hay = String(output || '').toLowerCase();
  return (anchors || []).filter(a => hay.indexOf(String(a).toLowerCase()) < 0);
}

// ── (2) BANNED PHRASE LIST ───────────────────────────────────────────────────
function loadBanned() {
  try { const a = JSON.parse(fs.readFileSync(BANNED_FILE, 'utf8')); return Array.isArray(a) ? a : []; }
  catch (e) { return []; }
}
function saveBanned(a) {
  try { fs.writeFileSync(BANNED_FILE, JSON.stringify(a.slice(-BANNED_CAP), null, 0)); } catch (e) {}
}
// pull the top-20 most-repeated 5-grams across a batch of outputs, append (dedup), cap 200 oldest-roll-off.
function updateBanned(outputs) {
  const counts = new Map();
  for (const o of (outputs || [])) {
    const t = tokens(o, true);
    const seenInDoc = new Set();
    for (let i = 0; i + 5 <= t.length; i++) {
      const g = t.slice(i, i + 5).join(' ');
      if (seenInDoc.has(g)) continue; seenInDoc.add(g);   // count each 5-gram once per doc → "repeated across entries"
      counts.set(g, (counts.get(g) || 0) + 1);
    }
  }
  const top = [...counts.entries()].filter(([, c]) => c >= 2).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([g]) => g);
  if (!top.length) return loadBanned();
  const cur = loadBanned();
  const lower = new Set(cur.map(x => x.toLowerCase()));
  for (const g of top) if (!lower.has(g)) { cur.push(g); lower.add(g); }
  saveBanned(cur);
  return cur.slice(-BANNED_CAP);
}

// ── (4) STRUCTURE ROTATION ───────────────────────────────────────────────────
function loadSkeletons() {
  try { return JSON.parse(fs.readFileSync(SKEL_FILE, 'utf8')) || {}; } catch (e) { return {}; }
}
function pickSkeleton(pillar, id) {
  const all = loadSkeletons();
  const set = (all[pillar] && all[pillar].length) ? all[pillar] : (all._default || []);
  if (!set.length) return null;
  const idx = entryIndex(id) % set.length;
  return { skeleton: set[idx], idx, count: set.length };
}

// ── (3) POST-GEN DUPLICATE GATE ──────────────────────────────────────────────
function storePath(pillar) { return path.join(STORE_DIR, '_accepted_' + pillar + '.jsonl'); }
// read the last STORE_KEEP accepted fingerprints for a pillar.
function loadAccepted(pillar) {
  let lines = [];
  try { lines = fs.readFileSync(storePath(pillar), 'utf8').split(/\r?\n/).filter(Boolean); } catch (e) { return []; }
  const recs = [];
  for (const l of lines.slice(-STORE_KEEP)) {
    try { const r = JSON.parse(l); if (r && r.tf) { r.tf = r.tf; r._g = new Set(r.g || []); recs.push(r); } } catch (e) {}
  }
  return recs;
}
// dupGate(output, pillar) → { dup, sim, sharedGram, worstId, passage }
function dupGate(output, pillar) {
  const prior = loadAccepted(pillar);
  const tf = tfVector(tokens(output, false));
  const gs = gramSet(output, GRAM_N);
  let worst = 0, worstId = '';
  for (const p of prior) {
    const s = cosine(tf, p.tf);
    if (s > worst) { worst = s; worstId = p.id; }
    if (s > DUP_COSINE) return { dup: true, sim: s, sharedGram: false, worstId: p.id, passage: passageFrom(output) };
    // shared 8-gram?
    if (p._g && p._g.size) {
      for (const h of gs) { if (p._g.has(h)) return { dup: true, sim: s, sharedGram: true, worstId: p.id, passage: passageFrom(output) }; }
    }
  }
  return { dup: false, sim: worst, sharedGram: false, worstId, passage: '' };
}
// pull a representative offending passage (first substantial content paragraph) to quote back on retry.
function passageFrom(output) {
  const paras = String(output || '').split(/\n{2,}/).map(s => s.trim())
    .filter(s => s && !s.startsWith('#') && !s.startsWith('```') && s.length > 120);
  return (paras[1] || paras[0] || '').slice(0, 400);
}
// record an accepted output's fingerprint into the pillar store (append; keep last 200).
function recordAccepted(output, pillar, id) {
  const rec = { id: id || '', ts: Date.now(), tf: tfVector(tokens(output, false)), g: [...gramSet(output, GRAM_N)] };
  try {
    fs.mkdirSync(STORE_DIR, { recursive: true });
    let lines = [];
    try { lines = fs.readFileSync(storePath(pillar), 'utf8').split(/\r?\n/).filter(Boolean); } catch (e) {}
    // replace any existing record for this id (re-runs), then append and trim to last 200.
    if (id) lines = lines.filter(l => { try { return JSON.parse(l).id !== id; } catch (e) { return true; } });
    lines.push(JSON.stringify(rec));
    fs.writeFileSync(storePath(pillar), lines.slice(-STORE_KEEP).join('\n') + '\n');
  } catch (e) {}
  return rec;
}

// ── drift log ────────────────────────────────────────────────────────────────
function logDrift(id, reason, worstSim) {
  const line = '| ' + new Date().toISOString() + ' | ' + (id || '?') + ' | ' + reason + ' | '
    + (worstSim != null ? Number(worstSim).toFixed(3) : '') + ' |\n';
  try { fs.appendFileSync(DRIFT_LOG, line); } catch (e) {}
}

// ── (5) SCOPE FENCE + prompt assembly ────────────────────────────────────────
// buildAugment(question, id) → { pillar, idx, anchors, skeleton, block } where `block` is appended to the
// base golden prompt. Everything the 5 mechanisms inject into the prompt is assembled here.
function buildAugment(question, id, opts) {
  opts = opts || {};
  const broaden = !!opts.broaden;   // stuck/rescue only — softens fence, still anchored to core Q
  const pillar = pillarOf(id);
  const anchors = deriveAnchors(question, id);
  const skel = pickSkeleton(pillar, id);
  const banned = loadBanned();

  const parts = [];
  parts.push('');
  parts.push('=== ANTI-DRIFT DIRECTIVES (mandatory — output is REJECTED if violated) ===');

  // (1) anchors
  if (anchors.length) {
    parts.push('ANCHORS — you MUST use each of these EXACT terms verbatim at least once in the body:');
    parts.push('  ' + anchors.map(a => '"' + a + '"').join(', '));
  }

  // (5) scope fence — tight by default; stuck mode allows adjacent breadth
  parts.push('SCOPE FENCE — This page\'s CORE topic is: ' + String(question || '').trim());
  if (broaden) {
    parts.push('  STUCK MODE: answer that core question first, then BROADEN into closely adjacent angles just');
    parts.push('  outside the narrow topic (related workflows, neighboring use-cases, upstream/downstream effects,');
    parts.push('  comparable scenarios). Do NOT wander into unrelated domains. Still follow the skeleton section count.');
    parts.push('  Go DEEP: ~2600-3200 words of SPECIFIC substance. Thin pages are rejected.');
  } else {
    parts.push('  Do not generalize, do not restate the question, do not add sections beyond the skeleton. Stay tightly');
    parts.push('  on this one topic — but go DEEP: hit ~2600-3200 words of SPECIFIC, concrete substance (numbers, steps,');
    parts.push('  examples, trade-offs). "No padding" means no filler/repetition — NOT fewer words. Thin pages are rejected.');
  }

  // (4) structure rotation
  if (skel && skel.skeleton) {
    parts.push('STRUCTURE (variant ' + (skel.idx + 1) + '/' + skel.count + ' for this entry — the content H2 titles are');
    parts.push('  yours, but they MUST follow this flow and opening pattern so consecutive entries differ):');
    (skel.skeleton.order || []).forEach((s, i) => parts.push('  ' + (i + 1) + '. ' + s));
    parts.push('  Place the 2 mermaid diagrams inside the sections marked "(mermaid)".');
  }

  // (2) banned phrases
  if (banned.length) {
    parts.push('BANNED PHRASES — never use any of these exact phrases (rewrite the idea freshly):');
    for (const b of banned.slice(-40)) parts.push('  - ' + b);   // inject the most-recent 40 to bound prompt size
  }

  parts.push('=== END ANTI-DRIFT DIRECTIVES ===');
  return { pillar, idx: skel ? skel.idx : 0, anchors, skeleton: skel ? skel.skeleton : null, block: parts.join('\n') };
}

// postGen(output, ctx) — run anchor-check + dup-gate. ctx = { question, id, anchors }.
// Returns { ok, reason, missing, sim, sharedGram, passage }. On ok:false the caller retries (temp+0.15)
// once, then skips + logs. On final accept the caller must call recordAccepted().
function postGen(output, ctx) {
  ctx = ctx || {};
  const anchors = ctx.anchors || deriveAnchors(ctx.question, ctx.id);
  const missing = checkAnchors(output, anchors);
  if (missing.length) {
    return { ok: false, reason: 'anchor-miss', missing, sim: 0, sharedGram: false,
             passage: '', note: 'missing anchors: ' + missing.join(', ') };
  }
  const d = dupGate(output, pillarOf(ctx.id));
  if (d.dup) {
    return { ok: false, reason: d.sharedGram ? 'shared-8gram' : 'cosine-dup', missing: [],
             sim: d.sim, sharedGram: d.sharedGram, passage: d.passage,
             note: (d.sharedGram ? 'shared 8-gram with ' : 'cosine ' + d.sim.toFixed(3) + ' vs ') + (d.worstId || '') };
  }
  return { ok: true, reason: 'clean', missing: [], sim: d.sim, sharedGram: false, passage: '' };
}

module.exports = {
  pillarOf, entryIndex, deriveAnchors, checkAnchors, pillarAnchor,
  loadBanned, updateBanned, saveBanned,
  loadSkeletons, pickSkeleton,
  dupGate, recordAccepted, loadAccepted, passageFrom,
  logDrift, buildAugment, postGen,
  // internals exposed for tests:
  _cosine: cosine, _tfVector: tfVector, _tokens: tokens, _gramSet: gramSet,
  DUP_COSINE, GRAM_N, STORE_KEEP, BANNED_CAP,
};
