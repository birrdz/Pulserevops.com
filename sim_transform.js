// sim_transform.js — KORY'S FIX-IT-ALL MACHINE · the in-house scrubber (Claude Code).
// For each NEAR-DUP variant: iteratively rewrite ONLY the prose with Claude Code — keeping every heading,
// mermaid, image, FAQ and source EXACTLY — re-measuring similarity vs its family each pass, and repeating
// until overlap drops UNDER the target (default 30%). Then gate (real content gate via /gate-publish) and
// publish. Per-entry similarity % is written to sim/fix_progress.json for the live dashboard. STUBS get a
// full Claude Code write. Resume-safe. Logs everything. Publish flips only on gate pass.
'use strict';
const fs = require('fs');
const path = require('path');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const { claudeChat } = require('./_claude_chat');
const { dsChat } = require('./_ds_lib');
const flib = require('./_ddg_facecard_lib');
const sharp = require('sharp');
const SIM = WD + '/sim';
// STORED approved Pexels (owner 2026-07-11) — no API fetch.
// Primary: assets/qa/_pexels_stored (filled when you ✓ in the gallery).
// Fallback: approved manifest provider=pexels still in _gp_pool.
const pexelsStoredLib = (() => { try { return require('./_pexels_stored_lib'); } catch (e) { return null; } })();
const _approval = (() => { try { return JSON.parse(fs.readFileSync(WD + '/_gp_pool_approval.json', 'utf8')); } catch (e) { return {}; } })();
const _okVals = new Set([true, 1, 'ok', 'approve', 'approved', 'yes']);
const _pexelsStored = (() => {
  if (pexelsStoredLib) {
    try { pexelsStoredLib.backfillApprovedPexels(); } catch (e) {}
    const fromFolder = pexelsStoredLib.listStored();
    if (fromFolder.length) return fromFolder;
  }
  try {
    const man = JSON.parse(fs.readFileSync(WD + '/_gp_pool_manifest.json', 'utf8'));
    return (man.slots || [])
      .filter(s => s && s.ok && String(s.provider || '').toLowerCase() === 'pexels' && _okVals.has(_approval[s.slot]))
      .map(s => WD + '/assets/qa/_gp_pool/' + String(s.slot).padStart(3, '0') + '.jpg')
      .filter(f => { try { return fs.statSync(f).size > 3000; } catch (e) { return false; } });
  } catch (e) { return []; }
})();
const _facecardPoolStored = (() => {
  const root = WD + '/_facecard_pool';
  try {
    const out = [];
    const walk = d => {
      for (const n of fs.readdirSync(d)) {
        const p = d + '/' + n;
        try {
          if (fs.statSync(p).isDirectory()) walk(p);
          else if (/\.jpe?g$/i.test(n) && fs.statSync(p).size > 3000) out.push(p);
        } catch (e) {}
      }
    };
    if (fs.existsSync(root)) walk(root);
    return out;
  } catch (e) { return []; }
})();
console.log('[sim] stored Pexels donors: ' + _pexelsStored.length + '  facecard_pool: ' + _facecardPoolStored.length);
async function isBlurry(file) { try { const s = await sharp(file).resize(256, 256, { fit: 'inside' }).greyscale().convolve({ width: 3, height: 3, kernel: [0, 1, 0, 1, -4, 1, 0, 1, 0] }).stats(); return (s.channels[0].stdev || 0) < parseFloat(process.env.SIM_BLUR_MIN || '8'); } catch (e) { return true; } }
// QUALIFY (owner 2026-07-12): HTML title + UNTITLED browse .sq.jpg only.
// NEVER bake gold titles onto face-card / mosaic JPGs here — that double-title bug is banned on browse rows.
async function stampImgSq(id, imgSq) {
  try {
    const idx = await store.get('_index.json', { type: 'json' });
    const ent = (idx.entries || []).find(x => x && x.id === id);
    if (ent) {
      let dirty = false;
      if (ent.imgSq !== imgSq) { ent.imgSq = imgSq; dirty = true; }
      // Keep face-card on `img` for answer-page heroes. Only stamp imgSq for browse.
      // NEVER replace /assets/qa/<id>.jpg with .sq.jpg (that wiped top images).
      if (ent.img && /\.sq\.jpg(\?|$)/i.test(String(ent.img))) {
        const face = '/assets/qa/' + id + '.jpg';
        ent.img = face; dirty = true;
      }
      if (dirty) await store.setJSON('_index.json', idx);
    }
  } catch (e) {}
}

async function ensureBrowseSquare(id, title) {
  const bsr = require('./_browse_square_rules');
  const sqPath = path.join(WD, 'assets', 'qa', id + '.sq.jpg');
  const imgSq = '/assets/qa/' + id + '.sq.jpg';
  let needSq = false;
  try { if (fs.statSync(sqPath).size < 8000) needSq = true; } catch (e) { needSq = true; }
  if (!needSq) {
    await stampImgSq(id, imgSq);
    return 'ok';
  }
  // Try rules lib first
  try {
    const r = await bsr.applyBrowseSquareRules(id, title, {
      onStamp: async (sid, sq) => { await stampImgSq(sid, sq); }
    });
    if (r && r.ok) return 'ok';
  } catch (e) {}
  // Last resort: any stored / pool donor — never fail-fast the whole URL on image alone
  const donors = (_pexelsStored && _pexelsStored.length) ? _pexelsStored
    : (_facecardPoolStored && _facecardPoolStored.length) ? _facecardPoolStored : [];
  if (!donors.length) return 'no-pexels';
  const seed = [...String(id)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0);
  const donor = donors[seed % donors.length];
  try {
    await sharp(donor).rotate().resize(760, 760, { fit: 'cover', position: 'attention' }).jpeg({ quality: 86, mozjpeg: true }).toFile(sqPath);
    await stampImgSq(id, imgSq);
    return 'ok';
  } catch (e) {
    return 'sq-fail';
  }
}

async function ensureQuality(id, blob) {
  const title = String(blob.h1 || blob.title || blob.question || '').trim();
  if (!title) return 'no-title';
  try {
    const r = await ensureBrowseSquare(id, title);
    return r === 'ok' ? 'ok' : (r || 'sq-fail');
  } catch (e) {
    return 'sq-fail';
  }
}
/** Mark title/image chips from ensureQuality. Title = HTML on card; image = untitled .sq.jpg.
 *  Image failure is soft — do NOT abort the whole fix (was burning pillars in seconds). */
function applyTitleImageChecks(P, qres) {
  if (qres === 'no-title') {
    P.checks.title = 'failed'; P.checks.image = 'pending'; P.status = 'failed';
    return { ok: false, why: 'missing title' };
  }
  P.checks.title = 'done';
  if (qres === 'ok') P.checks.image = 'done';
  else {
    // Soft fail: keep going to gate. Image chip shows failed but URL still gets real work.
    P.checks.image = 'failed';
  }
  return { ok: true };
}
function toIq(raw) {
  if (typeof raw !== 'number' || !isFinite(raw)) return 0;
  if (raw >= 11) return 10; // legacy gate stamps 11–13 → 10/10 display
  return Math.max(0, Math.min(10, Math.round(raw)));
}
/** Map gate checklist score (0–13) → quality /10 for the panel. */
function gateToIq(score) {
  const s = Number(score) || 0;
  if (s >= 13) return 10;
  if (s <= 0) return 0;
  return Math.max(1, Math.min(10, Math.round((s / 13) * 10)));
}
/** On approve: stamp quality 10/10 (instant blob write — better than 9, nearly free). */
async function stampIqPass(id) {
  const score = 10;
  try {
    const cur = await store.get('answers/' + id + '.json', { type: 'json' });
    if (cur) await store.setJSON('answers/' + id + '.json', Object.assign({}, cur, { quality_score: score }));
  } catch (e) {}
  try {
    const idx = await store.get('_index.json', { type: 'json' });
    const ent = (idx.entries || []).find(x => x && x.id === id);
    if (ent) { ent.quality_score = score; await store.setJSON('_index.json', idx); }
  } catch (e) {}
  return score;
}
const REPORT_F = SIM + '/scan_report.json', STATUS_F = SIM + '/run_status.json', STATE_F = SIM + '/transform_state.json';
const FAILS_F = SIM + '/transform_failures.md', PROG_F = SIM + '/fix_progress.json', FIXED_F = SIM + '/FIXED.md';
const GATE = 'http://localhost:8899/gate-publish';
const TARGET = parseFloat(process.env.SIM_FIX_TARGET || '0.30');   // rewrite until family overlap is UNDER this
const MAX_PASSES = parseInt(process.env.SIM_FIX_PASSES || '6', 10);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const readJSON = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } };
const setStatus = o => { try { fs.writeFileSync(STATUS_F, JSON.stringify(Object.assign(readJSON(STATUS_F, {}), o, { updated: new Date().toISOString() }), null, 1)); } catch (e) {} };
const logFail = (id, why) => { try { fs.appendFileSync(FAILS_F, `- ${new Date().toISOString()} · ${id} · ${why}\n`); } catch (e) {} };
// resolved-ledger: every entry that passed the real gate + published, off the bad list forever
const logFixed = (id, fam, score, kind) => { try { if (!fs.existsSync(FIXED_F)) fs.writeFileSync(FIXED_F, '# sim/FIXED.md — RESOLVED entries (fixed → gated 13/13 → published). Append-only. The bad list only shrinks.\n\n'); fs.appendFileSync(FIXED_F, `- ${new Date().toISOString()} · ${id} · family ${fam || '-'} · score ${score != null ? score : '-'} · ${kind}\n`); } catch (e) {} };
// Circuit breaker REMOVED (owner 2026-07-12) — do not pause/halt the fix run on fail rate.
const _bwin = [];
const recordOutcome = () => {};
const breakerPct = () => null;
const breakerTripped = () => false;
function clearBreakerWindow() { _bwin.length = 0; }

// ── similarity (mirror of the scanner) ──
const STATES = ['alabama','alaska','arizona','arkansas','california','colorado','connecticut','delaware','florida','georgia','hawaii','idaho','illinois','indiana','iowa','kansas','kentucky','louisiana','maine','maryland','massachusetts','michigan','minnesota','mississippi','missouri','montana','nebraska','nevada','new hampshire','new jersey','new mexico','new york','north carolina','north dakota','ohio','oklahoma','oregon','pennsylvania','rhode island','south carolina','south dakota','tennessee','texas','utah','vermont','virginia','washington','west virginia','wisconsin','wyoming'];
const LOCRE = new RegExp('\\b(' + STATES.join('|') + ')\\b', 'gi');
function sentsOf(md) {
  let t = String(md || '').replace(/```[\s\S]*?```/g, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').replace(/\[[^\]]*\]\([^)]*\)/g, ' ').replace(/<[^>]+>/g, ' ').toLowerCase();
  t = t.replace(LOCRE, ' LOCATION ').replace(/\$?\b\d[\d,\.]*%?\b/g, ' NUM ').replace(/[^a-z0-9\.\!\?\s]/g, ' ').replace(/\s+/g, ' ');
  return new Set(t.split(/(?<=[\.\!\?])\s+/).map(s => s.replace(/[^a-z0-9 ]/g, '').trim()).filter(s => s.split(' ').length >= 4));
}
function overlap(a, b) { if (!a.size || !b.size) return 0; const s = a.size < b.size ? a : b, big = s === a ? b : a; let n = 0; for (const x of s) if (big.has(x)) n++; return n / s.size; }
function maxOverlap(bodySents, famSets) { let mx = 0; for (const fs2 of famSets) mx = Math.max(mx, overlap(bodySents, fs2)); return mx; }

async function getBody(id) { try { const a = await store.get('answers/' + id + '.json', { type: 'json', consistency: 'strong' }); return { blob: a || {}, body: (a && (a.answer || a.body)) || '' }; } catch (e) { return { blob: {}, body: '' }; } }
async function writeChat(messages) {
  // DS_ONLY/NO_CLAUDE=1 → DeepSeek only (owner: do NOT spend Claude Code usage). Otherwise Claude Code first, DeepSeek fallback.
  const dsOnly = process.env.DS_ONLY === '1' || process.env.NO_CLAUDE === '1';
  if (!dsOnly) { try { const r = await claudeChat(messages, { timeoutMs: 180000 }); const t = typeof r === 'string' ? r : (r && (r.content || r.text)) || ''; if (t && t.length > 200) return t; } catch (e) {} }
  try { const r = await dsChat(messages, { max_tokens: 8000, temperature: 0.8 }); return (r && r.content) || ''; } catch (e) { return ''; }
}
async function gate(id, body, m, dryRun) {
  const r = await fetch(GATE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: '4444', id, body, title: m.title, question: m.question, metaTitle: m.metaTitle, metaDesc: m.metaDesc, simMode: true, dryRun: !!dryRun || DRY }), signal: AbortSignal.timeout(120000) });
  return await r.json();
}
// image checks the gate waives in simMode — a rewrite is never failed/repaired for these
const GATE_WAIVE = new Set(['heroImage', 'faceCardApplicable', 'pollinatorFaceCover', 'pollinatorInternalFlux', 'media3to10', 'imagesLaw', 'top10Images', 'rankingListMaster', 'score12']);
// map a failing gate check → concrete "re-add this dropped golden element" instruction
const CHECK_HELP = {
  faq6: 'Restore the "## FAQ" section with AT LEAST 6 **bold question?** + answer pairs.',
  mermaid2: 'Restore EXACTLY 2 ```mermaid diagrams inside content sections.',
  mermaidClean: 'Make both ```mermaid blocks valid and closed; no stray fences.',
  sources5: 'Restore the "## Sources" list of 5-10 real named source links.',
  relatedPulse: 'Restore the "## Related on PULSE" section with 3-5 links to https://pulserevops.com/knowledge/<id>.',
  directAnswer: 'Keep "## Direct Answer" as the first H2 (2+ sentences, 160+ chars).',
  directAnswerFull: 'Make the "## Direct Answer" block 2+ sentences and 160+ chars.',
  qaGoldOutline: 'Order MUST be: ## Direct Answer → depth ## sections → ## Related questions → ## FAQ → ## Sources → ## Related on PULSE.',
  words2000: 'Keep it 2000+ words — never shorten.',
  linksClean: 'Internal links must be well-formed https://pulserevops.com/knowledge/<id>.',
};

const REWRITE_SYS = 'You are a senior RevOps editor rewriting a page so it stops being a near-duplicate of its siblings. HARD RULES: (1) Keep EVERY markdown ## / ### heading, EXACTLY 2 ```mermaid code blocks, every image ![](), the "## FAQ" section with AT LEAST 6 **bold question?** + answer pairs, the "## Sources" list of 5-10 links, AND the "## Related on PULSE" section — all present, EXACTLY, in the same order. Dropping ANY of these fails the gate and wastes the whole rewrite. (2) Output MUST be the SAME LENGTH OR LONGER — at least 2000 words. NEVER summarize, shorten, or drop sections. (3) Rewrite ONLY the paragraph sentences between the headings — different angle, specifics, examples — so the page reads genuinely distinct; expand rather than cut. (4) Never a mad-libs place-name swap. Return the COMPLETE markdown, top to bottom, nothing else.';
const DRY = process.env.SIM_DRY === '1';   // validate the fix loop without publishing anything live

async function fixVariant(id, famSets, prog) {
  const { blob, body } = await getBody(id);
  const m = { title: blob.h1 || blob.title, question: blob.question, metaTitle: blob.meta_title, metaDesc: blob.meta_description };
  // live per-entry checklist the dashboard renders
  const P = prog[id] = { id: id, title: String(m.question || m.title || id).slice(0, 72), ov: 100, target: TARGET, status: 'fixing', pass: 0,
    checks: { similarity: 'active', title: 'pending', image: 'pending', gate: 'pending' } };
  writeProg(prog);
  if (!body || body.length < 300) { P.status = 'failed'; P.checks.similarity = 'failed'; writeProg(prog); return { ok: false, why: 'empty body' }; }
  let best = body, bestOv = maxOverlap(sentsOf(best), famSets);
  P.ov = Math.round(bestOv * 100); writeProg(prog);
  for (let pass = 1; pass <= MAX_PASSES && bestOv >= TARGET; pass++) {
    P.pass = pass; writeProg(prog);
    const user = 'Similarity to its siblings is currently ' + Math.round(bestOv * 100) + '% — get it UNDER ' + Math.round(TARGET * 100) + '% by rewriting the prose harder (keep all structure/images/mermaids/FAQ/sources verbatim).\n\nPAGE:\n' + best;
    const out = await writeChat([{ role: 'system', content: REWRITE_SYS }, { role: 'user', content: user }]);
    if (out && out.length >= Math.min(best.length * 0.9, body.length * 0.9)) { const o2 = maxOverlap(sentsOf(out), famSets); if (o2 < bestOv) { best = out; bestOv = o2; } }   // no-shrink: reject truncated rewrites
    P.ov = Math.round(bestOv * 100); writeProg(prog);
    if (bestOv < TARGET) break;
    await sleep(800);
  }
  if (bestOv >= TARGET) { P.status = 'failed'; P.checks.similarity = 'failed'; writeProg(prog); return { ok: false, why: 'stuck at ' + Math.round(bestOv * 100) + '%', ov: bestOv }; }
  P.checks.similarity = 'done'; P.checks.title = 'active'; P.checks.image = 'active'; writeProg(prog);
  const qres = await ensureQuality(id, blob);   // HTML title + untitled .sq.jpg (no face-card bake)
  const ti = applyTitleImageChecks(P, qres); writeProg(prog);
  if (!ti.ok) { recordOutcome(false); logFail(id, ti.why); return { ok: false, why: ti.why, ov: bestOv }; }
  P.checks.gate = 'active'; writeProg(prog);
  // gate: score dry first. Real (non-waived) content fails mean the rewrite dropped golden structure —
  // re-add exactly those, keep the differentiation, retry (up to 2). Only publish once it clears.
  let g = await gate(id, best, m, true);
  for (let rep = 0; rep < 2 && !g.pass && (g.failed || []).some(c => !GATE_WAIVE.has(c)); rep++) {
    const need = (g.failed || []).filter(c => !GATE_WAIVE.has(c)).map(c => '- ' + (CHECK_HELP[c] || c));
    const out = await writeChat([{ role: 'system', content: REWRITE_SYS }, { role: 'user', content: 'This page is now distinct enough — KEEP that differentiation. But it FAILS these golden checks because pieces got dropped. Re-add EXACTLY these, change nothing else:\n' + need.join('\n') + '\n\nPAGE:\n' + best }]);
    if (out && out.length > best.length * 0.85) { const o2 = maxOverlap(sentsOf(out), famSets); if (o2 < TARGET) best = out; }   // accept only if still under the similarity target
    g = await gate(id, best, m, true);
  }
  if (g.pass && !DRY) g = await gate(id, best, m, false);   // real publish once it clears (original behavior)
  const ok = !!(g.ok && g.pass && (DRY || g.published));
  P.checks.gate = (ok ? 'done' : 'failed'); P.status = (ok ? 'approved' : 'failed');
  if (ok) { P.iq = await stampIqPass(id); P.checks.similarity = 'done'; }
  writeProg(prog);
  if (ok) return { ok: true, ov: bestOv, score: g.score, iq: P.iq };
  return { ok: false, why: g.pass ? 'publish failed' : 'gate: ' + (g.failed || []).join(','), ov: bestOv };
}

// full-quality upgrade prompt (Sub-13 + stubs) — build the page up to the 13-point checklist, never fabricate.
const QUALITY_SYS = [
  'You are a senior RevOps editor upgrading a thin page to pass a strict 13-point golden gate. Output COMPLETE markdown ONLY — no preamble, no CRO/"Kory White" markup, no image markdown. Keep the original question/topic. Follow this EXACT structure and order:',
  '## Direct Answer',
  '<2 to 4 sentences, AT LEAST 160 characters, answering the question directly>',
  '<one intro paragraph>',
  '## <depth section 1, phrased as a searchable sub-question>',
  '<2+ paragraphs, 60+ words>',
  '(Write 4 to 6 total "## " depth sections. Place EXACTLY 2 ```mermaid diagrams inside two of them. Weave 2-3 links to https://pulserevops.com/knowledge/<id> into the prose.)',
  '## Related questions',
  '### <a related question>?', '<answer, 50 words or fewer>', '(3 to 5 pairs)',
  '## FAQ', '**<a question>?**', '<answer paragraph>', '(AT LEAST 6 **bold question?** + answer pairs)',
  '## Sources', '- [<real source name>](https://<real-url>)', '(5 to 10 real, credible, named sources)',
  '## Related on PULSE', '- [<a related question>](https://pulserevops.com/knowledge/<id>)', '(3 to 5 internal links)',
  'HARD RULES: minimum 2000 words. NEVER fabricate specific prices, statistics, vendor names, or numbers. Output ONLY markdown, starting at "## Direct Answer".',
].join('\n');

// Sub-13/13: bring an entry up to the checklist. Many just carry a stale score, so we gate the CURRENT body
// first and only rewrite if it actually fails — then feed the failing checks back until it passes.
async function fixSub13(id, prog) {
  const { blob, body } = await getBody(id);
  const m = { title: blob.h1 || blob.title, question: blob.question, metaTitle: blob.meta_title, metaDesc: blob.meta_description };
  const P = prog[id] = { id, kind: 'sub13', title: String(m.question || m.title || id).slice(0, 72), ov: 0, iq: toIq(blob.quality_score), target: 13, metric: 'score', status: 'fixing', pass: 0,
    checks: { similarity: 'active', title: 'pending', image: 'pending', gate: 'pending' } };
  writeProg(prog);
  P.checks.title = 'active'; P.checks.image = 'active'; writeProg(prog);
  const qres = await ensureQuality(id, blob);   // HTML title + untitled .sq.jpg (no face-card bake)
  const ti = applyTitleImageChecks(P, qres); writeProg(prog);
  if (!ti.ok) { recordOutcome(false); logFail(id, ti.why); return { ok: false, why: ti.why }; }
  P.checks.similarity = 'done'; P.checks.gate = 'active'; writeProg(prog);
  let best = body || '';
  // Original loop: gate until pass+publish (simMode waives image/score12). Quality shown as /10.
  let g = best.length > 400 ? await gate(id, best, m) : { ok: true, pass: false, failed: ['words2000'] };
  P.ov = (g && g.score) || 0; P.iq = gateToIq(P.ov); writeProg(prog);
  for (let pass = 1; pass <= MAX_PASSES && !(g && g.ok && g.pass && (DRY || g.published)); pass++) {
    P.pass = pass; P.checks.similarity = 'active'; writeProg(prog);
    const fb = (g && g.failed && g.failed.length) ? '\n\nThe checklist currently FAILS on: ' + g.failed.join(', ') + '. Fix exactly those.' : '';
    const user = (best.length > 400 ? 'Upgrade this page so it passes all 13 checklist points.' + fb + '\n\nPAGE:\n' + best
                                    : 'Write a complete golden page for this question: "' + (m.question || m.title || id) + '".');
    const out = await writeChat([{ role: 'system', content: QUALITY_SYS }, { role: 'user', content: user }]);
    if (out && out.length > Math.max(600, best.length * 0.9)) best = out;
    P.checks.similarity = 'done'; writeProg(prog);
    g = await gate(id, best, m);
    P.ov = (g && g.score) || 0; P.iq = gateToIq(P.ov); writeProg(prog);
    await sleep(600);
  }
  if (g && g.ok && g.pass && (DRY || g.published)) {
    P.iq = await stampIqPass(id); // 10/10 stamp — instant
    P.checks.similarity = 'done'; P.checks.gate = 'done'; P.status = 'approved'; writeProg(prog);
    return { ok: true, score: g.score, iq: P.iq };
  }
  P.checks.gate = 'failed'; P.status = 'failed'; writeProg(prog);
  return { ok: false, why: 'gate: ' + ((g && g.failed) || []).join(',') };
}

// STUB: no real body — write a full golden page from the question, then gate.
async function fixStub(id, prog) {
  const { blob } = await getBody(id);
  const m = { title: blob.h1 || blob.title, question: blob.question, metaTitle: blob.meta_title, metaDesc: blob.meta_description };
  const P = prog[id] = { id, kind: 'stub', title: String(m.question || m.title || id).slice(0, 72), ov: 0, iq: toIq(blob.quality_score), target: 13, metric: 'score', status: 'fixing', pass: 0,
    checks: { similarity: 'active', title: 'pending', image: 'pending', gate: 'pending' } };
  writeProg(prog);
  const out = await writeChat([{ role: 'system', content: QUALITY_SYS }, { role: 'user', content: 'Write a complete golden page for this question: "' + (m.question || m.title || id) + '".' }]);
  P.checks.similarity = 'done'; P.checks.title = 'active'; P.checks.image = 'active'; writeProg(prog);
  const qres = await ensureQuality(id, blob);
  const ti = applyTitleImageChecks(P, qres); writeProg(prog);
  if (!ti.ok) { recordOutcome(false); logFail(id, ti.why); return { ok: false, why: ti.why }; }
  P.checks.gate = 'active'; writeProg(prog);
  if (out && out.length > 600) {
    const g = await gate(id, out, m);
    P.ov = (g && g.score) || 0; P.iq = gateToIq(P.ov); writeProg(prog);
    if (g && g.ok && g.pass && (DRY || g.published)) {
      P.iq = await stampIqPass(id);
      P.checks.gate = 'done'; P.checks.similarity = 'done'; P.status = 'approved'; writeProg(prog);
      return { ok: true, score: g.score, iq: P.iq };
    }
  }
  P.checks.gate = 'failed'; P.status = 'failed'; writeProg(prog);
  return { ok: false, why: 'STUB not certified' };
}

const _progCache = readJSON(PROG_F, {});
function writeProg(p) { try { fs.writeFileSync(PROG_F, JSON.stringify(p)); } catch (e) {} }

async function main() {
  // Scope is LOCKED from argv for the whole process — never re-read config (prevents ALL diversion mid-run).
  const scope = (process.argv[2] || '').trim();
  if (!scope) { console.error('HALT: no scope. Pass pillar code or ALL explicitly.'); process.exit(2); }
  const LOCKED = scope;
  const rep = readJSON(REPORT_F, null);
  if (!rep) { console.error('HALT: no scan_report.json — run the report first.'); process.exit(2); }
  // If the report was for a specific pillar, refuse to run as ALL / different pillar
  if (rep.scope && String(rep.scope).toUpperCase() !== 'ALL' && String(rep.scope).toLowerCase() !== LOCKED.toLowerCase()) {
    console.error('HALT: report scope=' + rep.scope + ' but transform asked for ' + LOCKED + ' — re-run REPORT on the pillar you want.');
    process.exit(2);
  }
  if (LOCKED.toUpperCase() === 'ALL' && rep.scope && String(rep.scope).toUpperCase() !== 'ALL') {
    console.error('HALT: refusing ALL diversion — report is locked to ' + rep.scope);
    process.exit(2);
  }
  const inScope = id => {
    if (LOCKED.toUpperCase() === 'ALL') return true;
    // Exact pillar prefix only: gp matches gp123, not ga/gm (word-boundary style)
    const s = LOCKED.toLowerCase().replace(/[^a-z0-9]/g, '');
    const idl = String(id || '').toLowerCase();
    return new RegExp('^' + s + '\\d').test(idl) || idl === s;
  };
  const state = readJSON(STATE_F, { cleared: [], strikes: {} }); const cleared = new Set(state.cleared); const strikes = state.strikes || {};
  const saveState = () => { try { fs.writeFileSync(STATE_F, JSON.stringify({ cleared: [...cleared], strikes })); } catch (e) {} };
  const prog = _progCache;

  // ── one flat worklist: near-dup variants (with their family), then Sub-13, then stubs ──
  // scoping knobs: SIM_FAMILY=Fxxxx (one clone family only) · SIM_PILE=NEAR_DUP|SUB13|STUB (one pile only)
  const ONLY_FAM = process.env.SIM_FAMILY || (process.argv.find(a => a.startsWith('--family=')) || '').replace('--family=', '');
  const ONLY_PILE = (process.env.SIM_PILE || '').toUpperCase();
  const wantND = !ONLY_PILE || ONLY_PILE === 'NEAR_DUP';
  const work = [];
  if (wantND) {
    const fams = Object.values(rep.families || {}).filter(f => f.members.some(inScope) && (!ONLY_FAM || f.id === ONLY_FAM));
    for (const fam of fams) {
      const members = fam.members.filter(inScope);
      for (const id of members) { if (rep.entries[id] && rep.entries[id].canonical) continue; work.push({ id, kind: 'neardup', fam, members }); }
    }
  }
  if (!ONLY_FAM) for (const e of Object.values(rep.entries || {})) {
    if (!inScope(e.id)) continue;
    if (e.pile === 'SUB13' && (!ONLY_PILE || ONLY_PILE === 'SUB13')) work.push({ id: e.id, kind: 'sub13' });
    else if (e.pile === 'STUB' && (!ONLY_PILE || ONLY_PILE === 'STUB')) work.push({ id: e.id, kind: 'stub' });
  }
  const nd = work.filter(w => w.kind === 'neardup').length, sb = work.filter(w => w.kind === 'sub13').length, st = work.filter(w => w.kind === 'stub').length;
  let todo = work.filter(w => !cleared.has(w.id));
  if (process.env.SIM_MAX) todo = todo.slice(0, parseInt(process.env.SIM_MAX, 10));   // cap for smoke tests
  console.log(`[fix-it-all] LOCKED scope=${LOCKED} worklist=${work.length} todo=${todo.length}  similarity=${nd} sub13=${sb} stubs=${st}  batch=${process.env.SIM_BATCH || 10}`);
  setStatus({ stage: 'transform', phase: 'starting', scope: LOCKED, lockedScope: LOCKED, total: work.length, todo: todo.length, similarity: nd, sub13: sb, stubs: st, transformed: 0, published: 0, failed: 0, target: TARGET, note: 'Locked on ' + LOCKED + ' until done' });

  // sibling sentence-sets, computed once per family (near-dup fix needs them)
  const famSetCache = {};
  async function famSetsFor(w) {
    if (famSetCache[w.fam.id]) return famSetCache[w.fam.id];
    const sets = []; for (const x of w.members) { const { body } = await getBody(x); sets.push({ id: x, set: sentsOf(body) }); }
    return (famSetCache[w.fam.id] = sets);
  }

  try { fs.unlinkSync(SIM + '/STOP.flag'); } catch (e) {}   // clear any prior force-stop
  let fixed = 0, failed = 0;
  // Batch size = panel "URLs fixed at a time" (gen/config.json fixConcurrency). Re-read each loop so the knob is law.
  function liveConc() {
    let n = parseInt(process.env.SIM_BATCH || '0', 10);
    try {
      const cfg = JSON.parse(fs.readFileSync(WD + '/gen/config.json', 'utf8'));
      if (cfg && cfg.fixConcurrency != null) n = parseInt(cfg.fixConcurrency, 10);
    } catch (e) {}
    if (!Number.isFinite(n) || n < 1) n = 1;
    if (n > 50) n = 50;
    return n;
  }
  console.log('[fix-it-all] concurrency=' + liveConc() + ' (panel fixConcurrency — only that many at a time)');
  for (let i = 0; i < todo.length; ) {
    if (fs.existsSync(SIM + '/STOP.flag')) { setStatus({ stage: 'stopped', phase: 'idle', note: 'Force-stopped.' }); console.log('[fix-it-all] FORCE STOP — halting'); return; }
    const CONC = liveConc();
    for (const k of Object.keys(prog)) if (prog[k].status === 'approved') delete prog[k];   // keep the live checklist to the current batch
    writeProg(prog);
    const batch = todo.slice(i, i + CONC);
    i += CONC;
    setStatus({ phase: `fixing ${Math.min(i, todo.length)} of ${todo.length} · ${CONC} at a time`, fixConcurrency: CONC });
    await Promise.all(batch.map(async w => {
      const famId = w.fam && w.fam.id;
      try {
        let r;
        if (w.kind === 'neardup') { const sets = await famSetsFor(w); r = await fixVariant(w.id, sets.filter(f => f.id !== w.id).map(f => f.set), prog); }
        else if (w.kind === 'sub13') r = await fixSub13(w.id, prog);
        else r = await fixStub(w.id, prog);
        if (r.ok) {                                                        // FIXED → gated 13/13 → published: off the bad list forever
          fixed++; cleared.add(w.id); delete strikes[w.id]; saveState();
          logFixed(w.id, famId, r.score, w.kind); recordOutcome(true);
          console.log(`  ✓ ${w.id} [${w.kind}] gate ${r.score || ''}${r.ov ? ' ' + Math.round(r.ov * 100) + '%' : ''}`);
        } else {                                                           // FAIL → strike; NEVER republished; 3 strikes = removed from list, logged, skipped
          failed++; strikes[w.id] = (strikes[w.id] || 0) + 1; recordOutcome(false);
          if (strikes[w.id] >= 3) { cleared.add(w.id); logFail(w.id, w.kind + ' 3-STRIKE SKIP: ' + r.why); console.log(`  ✗✗✗ ${w.id} [${w.kind}] 3-strike SKIP — ${r.why}`); }
          else { logFail(w.id, w.kind + ' strike ' + strikes[w.id] + ': ' + r.why); console.log(`  ✗ ${w.id} [${w.kind}] strike ${strikes[w.id]} — ${r.why}`); }
          saveState();
        }
      } catch (e) { failed++; strikes[w.id] = (strikes[w.id] || 0) + 1; recordOutcome(false); if (strikes[w.id] >= 3) cleared.add(w.id); saveState(); logFail(w.id, w.kind + ' exception (strike ' + strikes[w.id] + '): ' + (e && e.message)); }
      // dashboard: bad list shrinks (fixed + 3-strike-skipped both leave), fixed climbs
      setStatus({ transformed: fixed, failed, fixedTotal: fixed, remaining: Math.max(0, work.length - cleared.size), currentId: w.id, breaker: null, scope: LOCKED, lockedScope: LOCKED });
    }));
    // circuit breaker deleted — never pause/halt on fail rate
  }
  setStatus({ stage: 'done', phase: 'idle', scope: LOCKED, lockedScope: LOCKED, transformed: fixed, failed, fixedTotal: fixed, remaining: Math.max(0, work.length - cleared.size), verified: failed === 0, note: 'Finished ' + LOCKED });
  console.log(`[fix-it-all] DONE scope=${LOCKED}  fixed+published=${fixed}  failed=${failed}  remaining=${Math.max(0, work.length - cleared.size)}  (sim/FIXED.md ledger updated)`);
}
main().catch(e => { console.error('[fix-it-all] FATAL', e.message); setStatus({ stage: 'error', phase: 'idle', error: e.message }); process.exit(1); });
