// groundskeeper.js — KORY'S GROUNDSKEEPER (built by Fable, 2026-07-15)
//
// One small, honest machine. It walks the ENTIRE published library one entry at a
// time, forever: CHECK each entry against the 13-point gate (free, no AI) →
// if it passes, write a receipt → if it fails, FIX it with Claude Code (Max plan),
// re-gate, publish, and only THEN write a receipt. Counters start at ZERO and only
// climb on receipts. When Claude Max is out of usage it PAUSES and says so on the
// dashboard, then auto-resumes when usage comes back. It never pretends.
//
// LAWS HONORED:
//  · DEPLOY LAW — content goes to Blobs only; this program NEVER deploys.
//  · IMAGE LAWS — text-only for now (gate waives image checks in simMode).
//    The image lane stays closed until the render path is DOM-verified.
//  · Max-plan only — ANTHROPIC_API_KEY is scrubbed from the environment at boot
//    so the Claude CLI can only ever use the Max login, never a pay-per-use key.
//
// RUN:   node groundskeeper.js          → dashboard at http://localhost:8917
// STOP:  Ctrl+C  (or create sim/groundskeeper/STOP.flag, or the STOP button)
// PACE:  GK_PACE_SECONDS=60 node groundskeeper.js   (default 45s between entries)
'use strict';
const fs = require('fs');
const http = require('http');
const { spawn, exec } = require('child_process');
const SELFTEST = process.argv.includes('--selftest');
const WD = process.env.GK_WD || 'C:/Users/koryj/website';

// ── env (.env.local) then SCRUB the API key so claude.exe can't inherit it ──
try {
  for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}
delete process.env.ANTHROPIC_API_KEY; // Max-plan-only law — hard guarantee

let store = null, claudeChat = null;
if (!SELFTEST) {
  const { getStore } = require('@netlify/blobs');
  store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
  ({ claudeChat } = require('./_claude_chat'));
}
// SELF-TEST (`node groundskeeper.js --selftest`): runs the WHOLE machine against a tiny fake
// library — fake store, fake gate, fake Claude that hits a usage cliff once — and proves every
// path: PASS receipt, FIX→publish receipt, honest pause/resume. Touches NOTHING real.
const TESTIO = SELFTEST ? (() => {
  const good = 'GOLD-OK ' + 'x'.repeat(600);
  const lib = { entries: [{ id: 't1', question: 'already-good page', ts: 3 }, { id: 't2', question: 'broken page', ts: 2 }, { id: 't3', question: 'page hit by usage cliff', ts: 1 }] };
  const answers = { t1: { answer: good }, t2: { answer: 'bad ' + 'y'.repeat(500) }, t3: { answer: 'bad ' + 'z'.repeat(500) } };
  let wcalls = 0, probes = 0, down = false, downUsed = false;
  return {
    index: async () => JSON.parse(JSON.stringify(lib)),
    getAnswer: async id => answers[id] ? JSON.parse(JSON.stringify(answers[id])) : null,
    setAnswer: async (id, blob) => { answers[id] = blob; },
    gate: async (id, body, dryRun) => /GOLD-OK/.test(String(body)) ? { ok: true, pass: true, published: !dryRun, score: 13, failed: [] } : { ok: true, pass: false, published: false, score: 8, failed: ['faq6', 'sources5'] },
    write: async () => { wcalls++; if (wcalls === 2 && !downUsed) { down = true; downUsed = true; return null; } return good; },
    probe: async () => { if (down) { probes++; if (probes >= 2) down = false; return !down; } return true; },
  };
})() : null;
// GOLDEN TEMPLATES — the same router the pipeline uses decides Top-10 vs Q&A essay vs Style,
// so every fix is rebuilt in the shape Kory locked (aq1158 / q11133 / sy0001).
let goldRouter = null, qaGold = null;
try { goldRouter = require('./_pulse_gold_template_router'); } catch (e) { console.log('[gk] WARN: gold router not loadable — using generic Q&A shape (' + (e && e.message) + ')'); }
try { qaGold = require('./_qa_gold_template'); } catch (e) {}
function goldSpecFor(id, body, title) {
  let pick = null;
  try { pick = goldRouter && goldRouter.pickGoldTemplate(id, body, title); } catch (e) {}
  const t = (pick && pick.template) || 'qa';
  if (t === 'top10') return { t, spec: 'TEMPLATE LAW — TOP-10 / RANKING LIST (golden reference: ' + ((pick && pick.goldUrl) || 'aq1158') + '). Structure: intro, then EXACTLY the ranked numbered ## sections the title promises ("Top 10" → ## 1. through ## 10.), each ranked item with its own heading and 2+ substantial paragraphs, then ## Related questions → ## FAQ (6+ **bold question?** pairs) → ## Sources (5-10 named links) → ## Related on PULSE (3-5 internal links). 2500+ words.' };
  if (t === 'style') { let s = null; try { s = require('./_style_gold_template').STYLE_TEMPLATE_SPEC; } catch (e) {} return { t, spec: s || ('TEMPLATE LAW — STYLE OUTFIT GUIDE (golden reference: ' + ((pick && pick.goldUrl) || 'sy0001') + '). Intro, then six outfit ## sections — 3 men\'s ages + 3 women\'s ages — then ## Related questions → ## FAQ (6+ **bold question?** pairs) → ## Sources (5-10 links) → ## Related on PULSE. 2500+ words.') }; }
  let outline = '';
  try { if (qaGold && qaGold.QA_TEMPLATE_OUTLINE) outline = '\nGolden outline:\n' + [].concat(qaGold.QA_TEMPLATE_OUTLINE).join('\n'); } catch (e) {}
  return { t, spec: 'TEMPLATE LAW — Q&A ESSAY (golden reference: q11133). Structure: ## Direct Answer FIRST (2+ sentences, 160+ chars), then 5+ depth ## sections with ### subsections and EXACTLY 2 ```mermaid diagrams inside content sections, then ## Related questions → ## FAQ (6+ **bold question?** pairs) → ## Sources (5-10 named links) → ## Related on PULSE (3-5 internal links). 2500+ words.' + outline };
}

const GK = WD + '/sim/groundskeeper';
fs.mkdirSync(GK, { recursive: true });
const LEDGER_F = GK + (SELFTEST ? '/selftest_ledger.md' : '/ledger.md');   // append-only receipts — the truth
const STATE_F = GK + (SELFTEST ? '/selftest_state.json' : '/state.json'); // resume cursor + counters
const STOP_F = GK + '/STOP.flag';
try { fs.unlinkSync(STOP_F); } catch (e) {}  // clear any leftover stop flag so a fresh launch always runs
const PORT = SELFTEST ? 8918 : parseInt(process.env.GK_PORT || '8917', 10);
const PACE_MS = SELFTEST ? 150 : Math.max(5, parseInt(process.env.GK_PACE_SECONDS || '45', 10)) * 1000;
const GATE = 'http://localhost:8899/gate-publish';
const GATE_PORT = 8899;

// image checks the gate waives in simMode (same set the fixer uses)
const WAIVE = new Set(['heroImage', 'faceCardApplicable', 'pollinatorFaceCover', 'pollinatorInternalFlux', 'media3to10', 'imagesLaw', 'top10Images', 'rankingListMaster', 'score12']);
const CHECK_HELP = {
  faq6: 'Restore the "## FAQ" section with AT LEAST 6 **bold question?** + answer pairs.',
  mermaid2: 'Restore EXACTLY 2 ```mermaid diagrams inside content sections.',
  mermaidClean: 'Make both ```mermaid blocks valid and closed; no stray fences.',
  sources5: 'Restore the "## Sources" list of 5-10 real named source links.',
  relatedPulse: 'Restore the "## Related on PULSE" section with 3-5 links to https://pulserevops.com/knowledge/<id>.',
  directAnswer: 'Keep "## Direct Answer" as the first H2 (2+ sentences, 160+ chars).',
  directAnswerFull: 'Make the "## Direct Answer" block 2+ sentences and 160+ chars.',
  qaGoldOutline: 'Order MUST be: ## Direct Answer → depth ## sections → ## Related questions → ## FAQ → ## Sources → ## Related on PULSE.',
  words2000: 'Keep it 2500+ words — never shorten.',
  linksClean: 'Internal links must be well-formed https://pulserevops.com/knowledge/<id>.',
};
const REWRITE_SYS = 'You are a senior RevOps editor fixing a published page IN PLACE. HARD RULES: (1) Keep EVERY markdown ## / ### heading, EXACTLY 2 ```mermaid code blocks, every image ![](), the "## FAQ" section with AT LEAST 6 **bold question?** + answer pairs, the "## Sources" list of 5-10 links, AND the "## Related on PULSE" section — all present, in this order: ## Direct Answer → depth sections → ## Related questions → ## FAQ → ## Sources → ## Related on PULSE. (2) 2500+ words — NEVER shorten. (3) Fix ONLY what the checklist says is broken; keep everything that already works. (4) Return the COMPLETE markdown page, top to bottom, nothing else — no preamble, no commentary.';

// ── state ──
const state = (SELFTEST ? null : (() => { try { return JSON.parse(fs.readFileSync(STATE_F, 'utf8')); } catch (e) { return null; } })()) || { cycle: 1, receipts: {}, checked: 0, passed: 0, fixed: 0, failed: 0, startedAt: new Date().toISOString() };
state.receipts = state.receipts || {};
let live = { phase: 'starting', id: null, title: null, note: '', engine: 'idle', pausedUntil: null, total: 0, recent: [], startedRun: new Date().toISOString(), paceMs: PACE_MS };
let userPaused = false, stopReq = false, restartReq = false;

const save = () => { try { fs.writeFileSync(STATE_F, JSON.stringify(state)); } catch (e) {} };
function receipt(id, verdict, score, why) {
  const line = `- ${new Date().toISOString()} · ${id} · ${verdict}${score != null ? ' · score ' + score : ''}${why ? ' · ' + why : ''} · cycle ${state.cycle}\n`;
  try { if (!fs.existsSync(LEDGER_F)) fs.writeFileSync(LEDGER_F, '# GROUNDSKEEPER LEDGER — append-only receipts. Every line here really happened.\n\n'); fs.appendFileSync(LEDGER_F, line); } catch (e) {}
  state.receipts[id] = { v: verdict, s: score, at: Date.now(), c: state.cycle };
  state.checked++;
  if (verdict === 'PASS') state.passed++;
  else if (verdict === 'FIXED') state.fixed++;
  else state.failed++;
  live.recent.unshift({ id, verdict, score, why: why || '', at: new Date().toISOString() });
  live.recent = live.recent.slice(0, 30);
  save();
  console.log(`[gk] ${verdict} ${id}${score != null ? ' score=' + score : ''}${why ? ' — ' + why : ''}  (checked ${state.checked} · passed ${state.passed} · fixed ${state.fixed} · failed ${state.failed})`);
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── gate (reuses the existing scrub server; starts it if it's down) ──
async function gateCall(id, body, m, dryRun) {
  if (SELFTEST) return TESTIO.gate(id, body, dryRun);
  const r = await fetch(GATE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: '4444', id, body, title: m.title, question: m.question, metaTitle: m.metaTitle, metaDesc: m.metaDesc, simMode: true, dryRun: !!dryRun }), signal: AbortSignal.timeout(120000) });
  return await r.json();
}
async function gateUp() {
  try {
    const r = await fetch(GATE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: '4444', id: '_health', body: 'x', simMode: true, dryRun: true }), signal: AbortSignal.timeout(6000) });
    if (!r.ok) return false;
    const j = await r.json().catch(() => null);
    return !!(j && (typeof j.score === 'number' || 'pass' in j));
  } catch (e) { return false; }
}
async function ensureGate() {
  if (await gateUp()) return true;
  live.note = 'starting quality gate…';
  try {
    const env = Object.assign({}, process.env, { GATE_ONLY: '1', GOLD_SKIP_IMG_GATE: '1', SCRUB_BTN_PORT: String(GATE_PORT) });
    const p = spawn(process.execPath, [WD + '/_scrub_button_server.js'], { cwd: WD, env, detached: true, stdio: 'ignore' });
    p.unref();
  } catch (e) {}
  for (let i = 0; i < 25; i++) { await sleep(1000); if (await gateUp()) return true; }
  return false;
}
const contentOk = g => !!g && g.ok !== false && (g.pass === true || (Array.isArray(g.failed) && g.failed.length > 0 && g.failed.every(c => WAIVE.has(c))));

// ── Claude (Max plan) with an honest usage-cliff pause ──
async function claudeProbe() {
  if (SELFTEST) return TESTIO.probe();
  try { const r = await claudeChat([{ role: 'user', content: 'Reply with the single word: ok' }], { timeoutMs: 90000 }); return !!(r && (r.content || '').length); } catch (e) { return false; }
}
async function waitForClaude() {
  // Claude failed twice in a row → assume usage cliff. Pause LOUDLY, probe every 30 min.
  live.engine = 'paused'; live.phase = 'paused'; live.pauses = (live.pauses || 0) + 1;
  while (!stopReq) {
    const until = new Date(Date.now() + 30 * 60000);
    live.pausedUntil = until.toISOString();
    live.note = 'Claude Max is out of usage — paused, auto-retrying every 30 min. Nothing is being faked.';
    console.log('[gk] PAUSED — Claude Max out of usage. Next probe ' + until.toLocaleTimeString());
    for (let i = 0; i < (SELFTEST ? 1 : 60) && !stopReq; i++) await sleep(SELFTEST ? 200 : 30000);
    if (stopReq) return false;
    if (await claudeProbe()) { live.engine = 'ok'; live.pausedUntil = null; live.note = 'Claude usage is back — resuming.'; console.log('[gk] RESUMED — Claude is answering again.'); return true; }
  }
  return false;
}
async function claudeWrite(messages) {
  if (SELFTEST) return TESTIO.write();
  try {
    const r = await claudeChat(messages, { timeoutMs: 240000 });
    const t = (r && (r.content || r.text)) || '';
    return t && t.length > 400 ? t : null;
  } catch (e) { return null; }
}

// ── the fix (surgical first, golden rewrite second) ──
async function fixEntry(id, meta, body, failedChecks) {
  const help = (failedChecks || []).filter(c => !WAIVE.has(c)).map(c => CHECK_HELP[c] || ('Fix failing check: ' + c));
  const gold = goldSpecFor(id, body, meta.question || meta.title || '');
  live.note = 'below standard (' + gold.t + ' template) — fixing…';
  const attempts = [];
  if (body && body.length > 400) attempts.push([{ role: 'system', content: REWRITE_SYS }, { role: 'user', content: 'Question: "' + (meta.question || meta.title || id) + '"\n\n' + gold.spec + '\n\nFAILING CHECKS TO FIX:\n' + (help.join('\n') || '(bring the whole page up to the golden standard)') + '\n\nCURRENT PAGE:\n' + body }]);
  attempts.push([{ role: 'system', content: REWRITE_SYS }, { role: 'user', content: 'Write the COMPLETE golden page, from scratch, for this question: "' + (meta.question || meta.title || id) + '".\n\n' + gold.spec + '\n\nEvery required section, 2500+ words.' }]);
  let consecutiveClaudeFails = 0;
  for (const msgs of attempts) {
    if (stopReq) return { done: false, why: 'stopped' };
    live.note = 'writing fix with Claude Max…'; live.engine = 'writing';
    const out = await claudeWrite(msgs);
    if (out == null) {
      consecutiveClaudeFails++;
      if (consecutiveClaudeFails >= 2 || !(await claudeProbe())) {
        const back = await waitForClaude();
        if (!back) return { done: false, why: 'stopped while paused' };
        const retry = await claudeWrite(msgs);
        if (retry == null) return { done: false, why: 'claude write failed after resume' };
        return await gateAndPublish(id, retry, meta);
      }
      continue;
    }
    live.engine = 'ok';
    const res = await gateAndPublish(id, out, meta);
    if (res.done) return res;
  }
  return { done: false, why: 'gate still failing after rewrite attempts' };
}
async function gateAndPublish(id, newBody, meta) {
  live.note = 'gating + publishing…';
  let g;
  try { g = await gateCall(id, newBody, meta, false); } catch (e) { return { done: false, why: 'gate unreachable' }; }
  if (contentOk(g) && (g.published || g.pass)) return { done: true, score: g.score };
  const realFail = ((g && g.failed) || []).filter(c => !WAIVE.has(c));
  return { done: false, why: realFail.length ? 'gate: ' + realFail.join(',') : (g && g.error) || 'gate said no' };
}

// ── store wrappers (real blobs, or the self-test fakes) ──
const getIdx = () => SELFTEST ? TESTIO.index() : store.get('_index.json', { type: 'json', consistency: 'strong' });
const getAns = id => SELFTEST ? TESTIO.getAnswer(id) : store.get('answers/' + id + '.json', { type: 'json', consistency: 'strong' });
const setAns = (id, blob) => SELFTEST ? TESTIO.setAnswer(id, blob) : store.setJSON('answers/' + id + '.json', blob);

// ── main walk ──
async function run() {
  if (!SELFTEST && !(await ensureGate())) { live.phase = 'error'; live.note = 'Quality gate would not start (port 8899). Fix that first — I will not pretend without it.'; console.log('[gk] FATAL: gate down.'); return; }
  live.engine = (await claudeProbe()) ? 'ok' : 'unknown';
  while (!stopReq) {
    let idx;
    try { idx = await getIdx(); } catch (e) { live.note = 'library index unreachable — retrying in 60s'; await sleep(60000); continue; }
    const entries = (idx && idx.entries || []).filter(e => e && e.id);
    live.total = entries.length;
    // PRIORITY (Kory 2026-07-15): brand-new entries (never receipted — fresh pipeline output)
    // JUMP THE LINE and get checked first, newest first. Then the old backlog in stable id order.
    entries.sort((a, b) => {
      const an = !state.receipts[a.id], bn = !state.receipts[b.id];
      if (an !== bn) return an ? -1 : 1;                                  // new before old
      if (an && bn) return (b.ts || 0) - (a.ts || 0);                     // newest new first
      return String(a.id).localeCompare(String(b.id));                    // stable backlog order
    });
    const todo = entries.filter(e => { const r = state.receipts[e.id]; return !r || r.c < state.cycle; });
    if (!todo.length) {
      if (SELFTEST) {
        const ok = state.passed === 1 && state.fixed === 2 && state.failed === 0 && (live.pauses || 0) >= 1;
        console.log('\n══════════ GROUNDSKEEPER SELF-TEST ══════════');
        console.log(' PASS receipt (already-good page)      : ' + (state.passed === 1 ? '✓' : '✗ got ' + state.passed));
        console.log(' FIXED receipts (broken pages repaired): ' + (state.fixed === 2 ? '✓' : '✗ got ' + state.fixed));
        console.log(' Honest pause on Claude usage cliff    : ' + ((live.pauses || 0) >= 1 ? '✓ paused, then auto-resumed' : '✗ never paused'));
        console.log(' False failures                        : ' + (state.failed === 0 ? '✓ none' : '✗ ' + state.failed));
        console.log(' Receipt ledger written                : ' + (fs.existsSync(LEDGER_F) ? '✓' : '✗'));
        console.log(ok ? ' RESULT: ✅ THE MACHINE WORKS — safe to run for real' : ' RESULT: ❌ SOMETHING IS WRONG — do NOT run live, tell Fable');
        console.log('═════════════════════════════════════════════\n');
        process.exit(ok ? 0 : 1);
      }
      state.cycle++; save();
      live.phase = 'cycle-done'; live.note = 'Full pass complete — every entry has a receipt. Resting 6h, then re-walking (cycle ' + state.cycle + ').';
      console.log('[gk] CYCLE COMPLETE. Resting 6h.');
      for (let i = 0; i < 720 && !stopReq; i++) await sleep(30000);
      continue;
    }
    let processed = 0;
    for (const ent of todo) {
      if (stopReq) break;
      // re-read the library index every 20 entries so fresh pipeline output can jump in line mid-walk
      if (++processed > 20) break;
      while (userPaused && !stopReq) { live.phase = 'paused'; live.note = 'paused by you'; await sleep(2000); }
      if (fs.existsSync(STOP_F)) { stopReq = true; break; }
      const id = ent.id;
      // NEVER touch the golden reference pages themselves — they are the measuring stick.
      if (id === 'aq1158' || id === 'q11133' || id === 'sy0001') { if (!state.receipts[id] || state.receipts[id].c < state.cycle) receipt(id, 'PASS', null, 'golden reference — never modified'); continue; }
      live.phase = 'checking'; live.nextAt = null; live.id = id; live.title = ent.question || ent.title || id; live.note = 'reading + gating (no AI)…';
      let blob = {};
      try { blob = (await getAns(id)) || {}; } catch (e) {}
      const body = (blob.answer || blob.body || '');
      const meta = { title: blob.title || ent.title, question: blob.question || ent.question, metaTitle: blob.metaTitle, metaDesc: blob.metaDesc };
      let g = null;
      try { g = await gateCall(id, body, meta, true); } catch (e) { live.note = 'gate hiccup — restarting it'; if (!(await ensureGate())) { await sleep(30000); continue; } try { g = await gateCall(id, body, meta, true); } catch (e2) { receipt(id, 'ERROR', null, 'gate unreachable'); continue; } }
      if (body.length > 400 && contentOk(g)) {
        // already up to standard → stamp verified, receipt, move on. No AI spent.
        try { await setAns(id, Object.assign({}, blob, { quality_score: 10, gk_verified: new Date().toISOString() })); } catch (e) {}
        receipt(id, 'PASS', g.score);
      } else {
        live.phase = 'fixing'; live.note = 'below standard — fixing…';
        const res = await fixEntry(id, meta, body, (g && g.failed) || []);
        if (res.done) {
          try { const cur = (await getAns(id)) || {}; await setAns(id, Object.assign({}, cur, { quality_score: 10, gk_verified: new Date().toISOString() })); } catch (e) {}
          receipt(id, 'FIXED', res.score);
        } else if (/stopped/.test(res.why || '')) { break; }
        else receipt(id, 'FAILED', null, res.why);
      }
      live.phase = 'resting'; live.nextAt = Date.now() + PACE_MS; live.note = 'next entry in ' + Math.round(PACE_MS / 1000) + 's';
      await sleep(PACE_MS);
    }
  }
  live.phase = 'stopped'; live.note = restartReq ? 'restarting…' : 'stopped cleanly'; save();
  console.log('[gk] ' + (restartReq ? 'RESTARTING…' : 'STOPPED.') + ' Ledger: ' + LEDGER_F);
  await sleep(1500);
  process.exit(restartReq ? 42 : 0);   // 42 tells RUN-GROUNDSKEEPER.bat to relaunch automatically
}

// ── dashboard ──
const PAGE = `<!doctype html><meta charset=utf-8><title>Groundskeeper</title>
<style>body{background:#0c0c0f;color:#e8e6e1;font:15px/1.5 system-ui,Segoe UI,sans-serif;max-width:880px;margin:24px auto;padding:0 16px}
h1{font-size:22px;margin:0 0 2px}.sub{color:#8a8680;font-size:13px;margin-bottom:18px}
.row{display:flex;gap:12px;flex-wrap:wrap;margin:14px 0}
.card{background:#141419;border:1px solid #26262e;border-radius:12px;padding:14px 18px;flex:1;min-width:140px}
.card b{display:block;font-size:30px;font-weight:800}.card span{color:#8a8680;font-size:12px;text-transform:uppercase;letter-spacing:.06em}
.pass b{color:#22c55e}.fixed b{color:#f59e0b}.fail b{color:#ef4444}
#now{background:#141419;border:1px solid #26262e;border-radius:12px;padding:14px 18px;margin:14px 0}
#phase{font-weight:800}.paused #phase{color:#f59e0b}.ok #phase{color:#22c55e}
#bar{height:10px;background:#1e1e26;border-radius:6px;overflow:hidden;margin:10px 0}
#fill{height:100%;background:linear-gradient(90deg,#22c55e,#84cc16);width:0%}
table{width:100%;border-collapse:collapse;font-size:13px}td,th{padding:6px 8px;border-bottom:1px solid #1e1e26;text-align:left}
.PASS{color:#22c55e}.FIXED{color:#f59e0b}.FAILED,.ERROR{color:#ef4444}
button{background:#26262e;color:#e8e6e1;border:0;border-radius:8px;padding:8px 14px;font-weight:700;cursor:pointer;margin-right:8px}
button:hover{background:#33333d}#stop{background:#7f1d1d}
a{color:#f0c469;text-decoration:none;font-weight:700}a:hover{text-decoration:underline}</style>
<h1>🌱 Groundskeeper</h1><div class=sub>walks every published entry · checks it · fixes what fails · receipts only — nothing fake</div>
<div class=row>
<div class=card><b id=checked>0</b><span>checked</span></div>
<div class="card pass"><b id=passed>0</b><span>passed</span></div>
<div class="card fixed"><b id=fixedN>0</b><span>fixed</span></div>
<div class="card fail"><b id=failedN>0</b><span>couldn't fix yet</span></div>
<div class=card><b id=total>–</b><span>library total</span></div>
<div class="card fail"><b id=remaining>–</b><span>left to fix</span></div>
<div class="card pass"><b id=pct>–</b><span>library verified</span></div>
</div>
<div id=now><div><span id=phase>starting…</span> <span id=engine style="float:right;color:#8a8680"></span></div>
<div id=bar><div id=fill></div></div>
<div id=cur style="font-weight:600"></div><div id=note style="color:#8a8680"></div></div>
<div><button id=pause>⏸ pause</button><button id=restart>🔄 restart</button><button id=fixgate>🩺 fix gate</button><button id=reset>🧹 start over</button><button id=stop>■ stop</button></div>
<h3>Recent receipts</h3><table id=recent><tr><th>time</th><th>entry</th><th>verdict</th><th>detail</th></tr></table>
<script>
let paused=false;
async function tick(){try{const s=await(await fetch('/api/status')).json();
checked.textContent=s.checked.toLocaleString();passed.textContent=s.passed.toLocaleString();
fixedN.textContent=s.fixed.toLocaleString();failedN.textContent=s.failed.toLocaleString();
total.textContent=(s.total||0).toLocaleString();
remaining.textContent=(s.total?Math.max(0,s.total-(s.verified||0)):0).toLocaleString();
pct.textContent=(s.pct!=null?s.pct+'%':'–');
phase.textContent=s.phase.toUpperCase()+(s.phase==='paused'&&s.pausedUntil?' — retry '+new Date(s.pausedUntil).toLocaleTimeString():'');
document.getElementById('now').className=s.phase==='paused'?'paused':'ok';
engine.textContent='engine: Claude Max — '+s.engine;
fill.style.width=(s.total?Math.min(100,(s.cycleDone||0)/s.total*100):0)+'%';
phase.textContent+=s.total?('  ·  cycle '+s.cycle+': '+(s.cycleDone||0).toLocaleString()+' / '+s.total.toLocaleString()):'';
cur.innerHTML=s.id?('now on <a href="https://pulserevops.com/knowledge/'+s.id+'" target="_blank">'+s.id+'</a> — '+(s.title||'')):'';note.textContent=s.note||'';
if(s.phase==='resting'&&s.nextAt){var rem=Math.max(0,Math.ceil((s.nextAt-Date.now())/1000));note.textContent='next entry in '+rem+'s';}
paused=s.userPaused;document.getElementById('pause').textContent=paused?'▶ resume':'⏸ pause';
recent.innerHTML='<tr><th>time</th><th>entry (click to open the live page)</th><th>verdict</th><th>detail</th></tr>'+s.recent.map(r=>'<tr><td>'+new Date(r.at).toLocaleTimeString()+'</td><td><a href="https://pulserevops.com/knowledge/'+r.id+'" target="_blank">'+r.id+'</a></td><td class='+r.verdict+'>'+r.verdict+(r.score!=null?' ('+r.score+')':'')+'</td><td>'+(r.why||'')+'</td></tr>').join('');
}catch(e){phase.textContent='DASHBOARD LOST CONTACT — is groundskeeper running?'}}
document.getElementById('pause').onclick=()=>fetch('/api/'+(paused?'resume':'pause'),{method:'POST'}).then(tick);
document.getElementById('stop').onclick=()=>{if(confirm('Stop the groundskeeper? It finishes the current entry, writes its ledger, and exits.'))fetch('/api/stop',{method:'POST'})};
document.getElementById('restart').onclick=()=>{if(confirm('Restart the groundskeeper? It finishes the current entry, then comes right back on its own. Progress is kept.'))fetch('/api/restart',{method:'POST'})};
document.getElementById('fixgate').onclick=()=>fetch('/api/fix-gate',{method:'POST'}).then(tick);
document.getElementById('reset').onclick=()=>{if(confirm('START OVER from zero? All counters reset and the whole library gets re-walked. Old receipts are archived, not deleted.'))fetch('/api/reset-progress',{method:'POST'}).then(tick)};
tick();setInterval(tick,1000);
</script>`;
http.createServer((req, res) => {
  const u = req.url.split('?')[0];
  if (u === '/' || u === '/index.html') { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); return res.end(PAGE); }
  if (u === '/api/status') { let cycleDone = 0, verified = 0; for (const k in state.receipts) { const r = state.receipts[k]; if (r.c === state.cycle) cycleDone++; if (r.v === 'PASS' || r.v === 'FIXED') verified++; } const pct = live.total ? +(Math.min(100, verified / live.total * 100)).toFixed(1) : null; res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify(Object.assign({}, live, { checked: state.checked, passed: state.passed, fixed: state.fixed, failed: state.failed, cycle: state.cycle, cycleDone, verified, pct, userPaused }))); }
  if (req.method === 'POST' && u === '/api/pause') { userPaused = true; res.writeHead(200); return res.end('{"ok":true}'); }
  if (req.method === 'POST' && u === '/api/resume') { userPaused = false; res.writeHead(200); return res.end('{"ok":true}'); }
  if (req.method === 'POST' && u === '/api/stop') { stopReq = true; res.writeHead(200); return res.end('{"ok":true}'); }
  if (req.method === 'POST' && u === '/api/restart') { restartReq = true; stopReq = true; userPaused = false; res.writeHead(200); return res.end('{"ok":true}'); }
  if (req.method === 'POST' && u === '/api/fix-gate') {
    (async () => {
      live.note = 'restarting the quality gate…';
      try {
        await new Promise(r => exec('for /f "tokens=5" %a in (\'netstat -ano ^| findstr :' + GATE_PORT + ' ^| findstr LISTENING\') do taskkill /F /PID %a', { windowsHide: true }, () => r()));
        await sleep(900);
        const up = await ensureGate();
        live.note = up ? 'quality gate restarted ✓ — carrying on' : 'gate would NOT restart — screenshot this for Fable';
      } catch (e) { live.note = 'gate restart error: ' + (e && e.message); }
    })();
    res.writeHead(200); return res.end('{"ok":true}');
  }
  if (req.method === 'POST' && u === '/api/reset-progress') {
    try { if (fs.existsSync(LEDGER_F)) fs.renameSync(LEDGER_F, LEDGER_F.replace(/\.md$/, '') + '.archived-' + Date.now() + '.md'); } catch (e) {}
    state.receipts = {}; state.checked = 0; state.passed = 0; state.fixed = 0; state.failed = 0; state.cycle = 1; save();
    live.recent = []; live.note = 'progress reset — walking the whole library again from zero (old receipts archived)';
    res.writeHead(200); return res.end('{"ok":true}');
  }
  res.writeHead(404); res.end('{}');
}).listen(PORT, () => console.log('[gk] dashboard → http://localhost:' + PORT));

process.on('SIGINT', () => { console.log('\n[gk] stopping after current entry…'); stopReq = true; setTimeout(() => process.exit(0), 8000); });
run().catch(e => { console.error('[gk] crash:', e); live.phase = 'error'; live.note = String(e && e.message); });
