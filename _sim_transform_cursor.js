// sim_transform.js — KORY'S FIX-IT-ALL MACHINE · the in-house scrubber (Claude Code).
// For each NEAR-DUP variant: iteratively rewrite ONLY the prose with Claude Code — keeping every heading,
// mermaid, image, FAQ and source EXACTLY — re-measuring similarity vs its family each pass, and repeating
// until overlap drops UNDER the target (default 30%). Then gate (real content gate via /gate-publish) and
// publish. Per-entry similarity % is written to sim/fix_progress.json for the live dashboard. STUBS get a
// full Claude Code write. Resume-safe. Logs everything. Publish flips only on gate pass.
'use strict';
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const { claudeChat } = require('./_claude_chat');
const { dsChat } = require('./_ds_lib');
const flib = require('./_ddg_facecard_lib');
const sharp = require('sharp');
const SIM = WD + '/sim';
// owner-approved images (the ~1,840 you ✓'d) — used to replace missing/blurry covers
const _approval = (() => { try { return JSON.parse(fs.readFileSync(WD + '/_gp_pool_approval.json', 'utf8')); } catch (e) { return {}; } })();
const _okVals = new Set([true, 1, 'ok', 'approve', 'approved', 'yes']);
const _approvedFiles = Object.keys(_approval).filter(k => _okVals.has(_approval[k])).map(s => WD + '/assets/qa/_gp_pool/' + String(s).padStart(3, '0') + '.jpg').filter(f => { try { return require('fs').statSync(f).size > 3000; } catch (e) { return false; } });
async function isBlurry(file) { try { const s = await sharp(file).resize(256, 256, { fit: 'inside' }).greyscale().convolve({ width: 3, height: 3, kernel: [0, 1, 0, 1, -4, 1, 0, 1, 0] }).stats(); return (s.channels[0].stdev || 0) < parseFloat(process.env.SIM_BLUR_MIN || '8'); } catch (e) { return true; } }
// QUALIFY: must have a title + a non-blurry face-card image. If missing/blurry, replace from approved images.
async function ensureQuality(id, blob) {
  const title = blob.h1 || blob.title || blob.question || '';
  const cp = flib.coverPath(id); let need = false;
  try { if (require('fs').statSync(cp).size < 8000) need = true; } catch (e) { need = true; }
  if (!need && await isBlurry(cp)) need = true;
  if (need && _approvedFiles.length) {
    try {
      const seed = [...String(id)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0);
      const buf = require('fs').readFileSync(_approvedFiles[seed % _approvedFiles.length]);
      await flib.gradeFaceCardFromBuffer(buf, cp, { question: title });
      const cur = await store.get('answers/' + id + '.json', { type: 'json' }); if (cur) await store.setJSON('answers/' + id + '.json', Object.assign({}, cur, { cover_src: 'approved-pool' }));
      return 'cover-replaced';
    } catch (e) { return 'cover-fail'; }
  }
  return need ? 'no-approved' : 'ok';
}
const REPORT_F = SIM + '/scan_report.json', STATUS_F = SIM + '/run_status.json', STATE_F = SIM + '/transform_state.json';
const FAILS_F = SIM + '/transform_failures.md', PROG_F = SIM + '/fix_progress.json';
const GATE = 'http://localhost:8899/gate-publish';
const TARGET = parseFloat(process.env.SIM_FIX_TARGET || '0.30');   // rewrite until family overlap is UNDER this
const MAX_PASSES = parseInt(process.env.SIM_FIX_PASSES || '6', 10);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const readJSON = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } };
const setStatus = o => { try { fs.writeFileSync(STATUS_F, JSON.stringify(Object.assign(readJSON(STATUS_F, {}), o, { updated: new Date().toISOString() }), null, 1)); } catch (e) {} };
const logFail = (id, why) => { try { fs.appendFileSync(FAILS_F, `- ${new Date().toISOString()} · ${id} · ${why}\n`); } catch (e) {} };

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
  // Claude Code first; DeepSeek fallback only if claude.exe errors
  try { const r = await claudeChat(messages, { timeoutMs: 180000 }); const t = typeof r === 'string' ? r : (r && (r.content || r.text)) || ''; if (t && t.length > 200) return t; } catch (e) {}
  try { const r = await dsChat(messages, { max_tokens: 8000, temperature: 0.8 }); return (r && r.content) || ''; } catch (e) { return ''; }
}
async function gate(id, body, m) {
  const r = await fetch(GATE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: '4444', id, body, title: m.title, question: m.question, metaTitle: m.metaTitle, metaDesc: m.metaDesc, simMode: true }), signal: AbortSignal.timeout(120000) });
  return await r.json();
}

const REWRITE_SYS = 'You are a senior RevOps editor rewriting a page so it stops being a near-duplicate of its siblings. HARD RULES: (1) Keep EVERY markdown ## / ### heading, every ```mermaid code block, every image ![](), every FAQ question, and every Sources link EXACTLY and in the same order. (2) The output MUST be the SAME LENGTH OR LONGER than the input — at least 2000 words. NEVER summarize, shorten, or drop sections. (3) Rewrite ONLY the paragraph sentences between the headings — different angle, specifics, examples — so the page reads genuinely distinct; expand each section with substantive detail rather than cutting. (4) Never a mad-libs place-name swap. Return the COMPLETE markdown of the whole page, top to bottom, nothing else.';

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
  const qres = await ensureQuality(id, blob);   // title + non-blurry cover (fixes from approved if bad)
  P.checks.title = 'done'; P.checks.image = (qres === 'cover-replaced' ? 'fixed' : 'done'); P.checks.gate = 'active'; writeProg(prog);
  const g = await gate(id, best, m);
  P.checks.gate = (g.pass ? 'done' : 'failed'); P.status = (g.ok && g.pass && g.published ? 'approved' : 'failed'); writeProg(prog);
  if (g.ok && g.pass && g.published) return { ok: true, ov: bestOv, score: g.score };
  return { ok: false, why: g.pass ? 'publish failed' : 'gate: ' + (g.failed || []).join(','), ov: bestOv };
}

// full-quality upgrade prompt (Sub-13 + stubs) — build the page up to the 13-point checklist, never fabricate.
const QUALITY_SYS = 'You are a senior RevOps editor upgrading a page to pass a strict 13-point quality checklist. REQUIREMENTS: a DIRECT ANSWER paragraph at the very top; at least 6 substantive "## " H2 sections; MINIMUM 2,400 words (never under 2,000); a "## Frequently Asked Questions" section with at least 6 Q&A pairs; EXACTLY 2 ```mermaid diagrams; a "## Sources" list of at least 5 credible links. Keep the original question/topic. Be specific and accurate — NEVER fabricate numbers, vendors, prices, or statistics. Return the COMPLETE upgraded markdown only, nothing else.';

// Sub-13/13: bring an entry up to the checklist. Many just carry a stale score, so we gate the CURRENT body
// first and only rewrite if it actually fails — then feed the failing checks back until it passes.
async function fixSub13(id, prog) {
  const { blob, body } = await getBody(id);
  const m = { title: blob.h1 || blob.title, question: blob.question, metaTitle: blob.meta_title, metaDesc: blob.meta_description };
  const P = prog[id] = { id, kind: 'sub13', title: String(m.question || m.title || id).slice(0, 72), ov: 0, target: 13, metric: 'score', status: 'fixing', pass: 0,
    checks: { similarity: 'active', title: 'pending', image: 'pending', gate: 'pending' } };
  writeProg(prog);
  P.checks.title = 'active'; P.checks.image = 'active'; writeProg(prog);
  await ensureQuality(id, blob);                                   // title + non-blurry approved cover
  P.checks.title = 'done'; P.checks.image = 'done'; P.checks.gate = 'active'; P.checks.similarity = 'done'; writeProg(prog);
  let best = body || '';
  let g = best.length > 400 ? await gate(id, best, m) : { ok: true, pass: false, failed: ['words2000'] };
  P.ov = (g && g.score) || 0; writeProg(prog);
  for (let pass = 1; pass <= MAX_PASSES && !(g && g.ok && g.pass && g.published); pass++) {
    P.pass = pass; P.checks.similarity = 'active'; writeProg(prog);
    const fb = (g && g.failed && g.failed.length) ? '\n\nThe checklist currently FAILS on: ' + g.failed.join(', ') + '. Fix exactly those.' : '';
    const user = (best.length > 400 ? 'Upgrade this page so it passes all 13 checklist points.' + fb + '\n\nPAGE:\n' + best
                                    : 'Write a complete golden page for this question: "' + (m.question || m.title || id) + '".');
    const out = await writeChat([{ role: 'system', content: QUALITY_SYS }, { role: 'user', content: user }]);
    if (out && out.length > Math.max(600, best.length * 0.9)) best = out;
    P.checks.similarity = 'done'; writeProg(prog);
    g = await gate(id, best, m);
    P.ov = (g && g.score) || 0; writeProg(prog);
    await sleep(600);
  }
  if (g && g.ok && g.pass && g.published) { P.checks.gate = 'done'; P.status = 'approved'; writeProg(prog); return { ok: true, score: g.score }; }
  P.checks.gate = 'failed'; P.status = 'failed'; writeProg(prog);
  return { ok: false, why: 'gate: ' + ((g && g.failed) || []).join(',') };
}

// STUB: no real body — write a full golden page from the question, then gate.
async function fixStub(id, prog) {
  const { blob } = await getBody(id);
  const m = { title: blob.h1 || blob.title, question: blob.question, metaTitle: blob.meta_title, metaDesc: blob.meta_description };
  const P = prog[id] = { id, kind: 'stub', title: String(m.question || m.title || id).slice(0, 72), ov: 0, target: 13, metric: 'score', status: 'fixing', pass: 0,
    checks: { similarity: 'active', title: 'pending', image: 'pending', gate: 'pending' } };
  writeProg(prog);
  const out = await writeChat([{ role: 'system', content: QUALITY_SYS }, { role: 'user', content: 'Write a complete golden page for this question: "' + (m.question || m.title || id) + '".' }]);
  P.checks.similarity = 'done'; P.checks.title = 'active'; P.checks.image = 'active'; writeProg(prog);
  await ensureQuality(id, blob);
  P.checks.title = 'done'; P.checks.image = 'done'; P.checks.gate = 'active'; writeProg(prog);
  if (out && out.length > 600) {
    const g = await gate(id, out, m);
    P.ov = (g && g.score) || 0; writeProg(prog);
    if (g && g.ok && g.pass && g.published) { P.checks.gate = 'done'; P.status = 'approved'; writeProg(prog); return { ok: true, score: g.score }; }
  }
  P.checks.gate = 'failed'; P.status = 'failed'; writeProg(prog);
  return { ok: false, why: 'STUB not certified' };
}

const _progCache = readJSON(PROG_F, {});
function writeProg(p) { try { fs.writeFileSync(PROG_F, JSON.stringify(p)); } catch (e) {} }

async function main() {
  const scope = (process.argv[2] || 'ALL').trim();
  const rep = readJSON(REPORT_F, null);
  if (!rep) { console.error('HALT: no scan_report.json — run the report first.'); process.exit(2); }
  const inScope = id => scope.toUpperCase() === 'ALL' || String(id).toLowerCase().startsWith(scope.toLowerCase());
  const state = readJSON(STATE_F, { cleared: [] }); const cleared = new Set(state.cleared);
  const saveState = () => { try { fs.writeFileSync(STATE_F, JSON.stringify({ cleared: [...cleared] })); } catch (e) {} };
  const prog = _progCache;

  // ── one flat worklist: near-dup variants (with their family), then Sub-13, then stubs ──
  const fams = Object.values(rep.families || {}).filter(f => f.members.some(inScope));
  const work = [];
  for (const fam of fams) {
    const members = fam.members.filter(inScope);
    for (const id of members) { if (rep.entries[id] && rep.entries[id].canonical) continue; work.push({ id, kind: 'neardup', fam, members }); }
  }
  for (const e of Object.values(rep.entries || {})) {
    if (!inScope(e.id)) continue;
    if (e.pile === 'SUB13') work.push({ id: e.id, kind: 'sub13' });
    else if (e.pile === 'STUB') work.push({ id: e.id, kind: 'stub' });
  }
  const nd = work.filter(w => w.kind === 'neardup').length, sb = work.filter(w => w.kind === 'sub13').length, st = work.filter(w => w.kind === 'stub').length;
  const todo = work.filter(w => !cleared.has(w.id));
  console.log(`[fix-it-all] scope=${scope} worklist=${work.length} todo=${todo.length}  similarity=${nd} sub13=${sb} stubs=${st}  batch=${process.env.SIM_BATCH || 10}`);
  setStatus({ stage: 'transform', phase: 'starting', scope, total: work.length, todo: todo.length, similarity: nd, sub13: sb, stubs: st, transformed: 0, published: 0, failed: 0, target: TARGET });

  // sibling sentence-sets, computed once per family (near-dup fix needs them)
  const famSetCache = {};
  async function famSetsFor(w) {
    if (famSetCache[w.fam.id]) return famSetCache[w.fam.id];
    const sets = []; for (const x of w.members) { const { body } = await getBody(x); sets.push({ id: x, set: sentsOf(body) }); }
    return (famSetCache[w.fam.id] = sets);
  }

  try { fs.unlinkSync(SIM + '/STOP.flag'); } catch (e) {}   // clear any prior force-stop
  let fixed = 0, failed = 0;
  const CONC = parseInt(process.env.SIM_BATCH || '10', 10);   // never work more than ~10 at a time
  for (let i = 0; i < todo.length; i += CONC) {
    if (fs.existsSync(SIM + '/STOP.flag')) { setStatus({ stage: 'stopped', phase: 'idle', note: 'Force-stopped.' }); console.log('[fix-it-all] FORCE STOP — halting'); return; }
    for (const k of Object.keys(prog)) if (prog[k].status === 'approved') delete prog[k];   // keep the live checklist to the current batch
    writeProg(prog);
    const batch = todo.slice(i, i + CONC);
    setStatus({ phase: `fixing ${i + 1}-${Math.min(i + CONC, todo.length)} of ${todo.length}` });
    await Promise.all(batch.map(async w => {
      try {
        let r;
        if (w.kind === 'neardup') { const sets = await famSetsFor(w); r = await fixVariant(w.id, sets.filter(f => f.id !== w.id).map(f => f.set), prog); }
        else if (w.kind === 'sub13') r = await fixSub13(w.id, prog);
        else r = await fixStub(w.id, prog);
        if (r.ok) { fixed++; cleared.add(w.id); saveState(); console.log(`  ✓ ${w.id} [${w.kind}] gate ${r.score || ''}${r.ov ? ' ' + Math.round(r.ov * 100) + '%' : ''}`); }
        else { failed++; logFail(w.id, w.kind + ': ' + r.why); console.log(`  ✗ ${w.id} [${w.kind}] ${r.why}`); }
      } catch (e) { failed++; logFail(w.id, w.kind + ' exception: ' + (e && e.message)); }
      setStatus({ transformed: fixed, failed });
    }));
  }
  setStatus({ stage: 'done', phase: 'idle', transformed: fixed, failed, verified: failed === 0 });
  console.log(`[fix-it-all] DONE  fixed+published=${fixed}  failed=${failed}`);
}
main().catch(e => { console.error('[fix-it-all] FATAL', e.message); setStatus({ stage: 'error', phase: 'idle', error: e.message }); process.exit(1); });
