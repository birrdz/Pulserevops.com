// _movies_alt_orchestrator.js — Movies pillar golden-template pipeline (new project, owner 2026-07-07).
// Classify → golden-template rebuild (Top-10 aq1158 / Q&A q11133) → 13/13 gate → save → email each question ID.
'use strict';
const fs = require('fs');
const { spawn } = require('child_process');
const WD = __dirname;
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
// New movies project (owner 2026-07-07): stagger DDG ↔ Pollinator for internal (section/product) images.
// MUST be set before any require() that loads _ddg_facecard_lib.js (its provider-ban consts read this at load).
if (!process.env.STAGGER_DDG_POLLINATOR) process.env.STAGGER_DDG_POLLINATOR = '1';
// Self-host product @@PRODUCT images in ONE pass (no hotlink round → no gate re-fetch bottleneck).
if (!process.env.SELF_HOST_PRODUCT_IMAGES) process.env.SELF_HOST_PRODUCT_IMAGES = '1';
// Fail-fast a hung provider fetch → gate's guaranteed self-hosted library fallback (legit fetches finish ~20s).
if (!process.env.PROD_IMG_TIMEOUT_MS) process.env.PROD_IMG_TIMEOUT_MS = '35000';

const { getStore } = require('@netlify/blobs');
const { pickGoldTemplate } = require('./_pulse_gold_template_router');
const { spotCheckEntry } = require('./_ranking_list_rebuild_lib');
const { auditTop10GoldTemplate } = require('./_ranking_top10_gold_template');
const { needsAqTop10Fix, rebuildAqTop10Entry, saveAqTop10Entry } = require('./_aq_top10_gold_fix_lib');
const { needsAqQaFix, rebuildAqQaEntry, saveAqQaEntry } = require('./_aq_qa_gold_fix_lib');
const { auditQaGoldTemplate } = require('./_qa_gold_template');
const { dsChat, todaySpend, DAILY_CAP } = require('./_ds_lib');
const meter = require('./_perf_meter'); // timing + self-learning bottleneck optimizer (owner 2026-07-06)
const { ccGoldenFix } = require('./_cc_golden_fix'); // Claude Code agent escalation when non-compliant (owner)
const { sendFaceCardEmail } = require('./_facecard_resend_email');
const { poolCount } = require('./_facecard_pool_lib');
const { fableImageRenderGate } = require('./_fable_image_render_gate'); // Fable live-render image guard — all images must render (mobile+desktop) before publish (owner 2026-07-07)

const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const RECIP = 'koryjordanwhite@gmail.com';
const RESEND_KEY = process.env.RESEND_API_KEY || process.env.resendapikey || process.env.RESENDAPIKEY;
const COVDIR = WD + '/assets/qa';
const STOP = WD + '/_movies_alt_stop.flag';
const SKIP_QA_FIXES = process.env.SKIP_QA_FIXES === '1'; // new project (owner 2026-07-07): golden-template Q&A/Top-10 fixes ON by default; set SKIP_QA_FIXES=1 only to fall back to face-cards-only
const DS_SAFETY = 0.50;                        // leave a little headroom under the daily cap
const sleep = ms => new Promise(r => setTimeout(r, ms));
const nowIso = () => new Date().toISOString();
function log(...a) { console.log(nowIso().slice(11, 19), ...a); }
function esc(s) { return String(s == null ? '' : s).replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c])); }

async function emailResend(subject, html, attachments) {
  if (!RESEND_KEY) { log('  (no RESEND key — skip email)'); return; }
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'PULSE Engine <onboarding@resend.dev>', to: [RECIP], subject, html, attachments: attachments || [] }),
    });
    if (!r.ok) log('  email HTTP ' + r.status);
  } catch (e) { log('  email err ' + e.message); }
}

const FRAME = (title, rows) =>
  '<div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:560px">' +
  '<h2 style="font-family:Georgia,serif;color:#15110d;margin:0 0 10px">' + title + '</h2>' +
  rows + '</div>';

// ── STEP A: make exactly ONE face card via the locked campaign generator (all laws intact) ──
// ASYNC (child spawn) so it overlaps the Q&A fix — the ~40s cover runs off the critical path.
// pillar (optional) scopes the generator to that prefix via ONLY_PREFIX (e.g. 'tl' for Pulse Tools).
// extraEnv: POOL_INVENTORY, SMART_DUP, POOL_BUILD_ONLY, SKIP_FACE_CARD_EMAIL, etc.
function makeOneFaceCard(pillar, extraEnv) {
  return new Promise(resolve => {
    const env = Object.assign({}, process.env,
      { LIMIT: '1', POLLINATOR_FREQ_MS: '20000', PILLAR_PAUSE_MS: '0', COOL_MAX_MS: '60000', COOL_STEP_MS: '5000' },
      extraEnv || {});
    if (!extraEnv || extraEnv.SKIP_FACE_CARD_EMAIL == null) env.SKIP_FACE_CARD_EMAIL = '1';
    if (pillar) env.ONLY_PREFIX = pillar;
    let out = '';
    const p = spawn('node', ['_all_flux_facecards.js'], { cwd: WD, env });
    p.stdout.on('data', d => { out += d; }); p.stderr.on('data', d => { out += d; });
    const to = setTimeout(() => { try { p.kill(); } catch (e) {} }, 5 * 60 * 1000);
    p.on('close', () => {
      clearTimeout(to);
      // line 186: "  ✓ 1/1 mv0050 [flux] 92KB  (...)  <-  <question>"
      const m = out.match(/✓\s+\d+\/\d+\s+([a-z]+\d+)\s+\[flux\][^<]*<-\s*(.+)$/m);
      if (m) return resolve({ id: m[1].trim(), question: m[2].trim(), ok: true });
      if (/DONE · rebuilt 0/.test(out)) return resolve({ ok: false, done: true }); // nothing left to build
      const fail = out.match(/✗\s+([a-z]+\d+)\s+flux FAILED/);
      resolve({ ok: false, id: fail ? fail[1] : null });
    });
    p.on('error', () => { clearTimeout(to); resolve({ ok: false, id: null }); });
  });
}

async function emailFaceCard(fc) {
  try {
    await sendFaceCardEmail({ id: fc.id, question: fc.question, source: '_movies_alt_orchestrator.js' });
  } catch (e) {
    log('  email err ' + e.message);
  }
}

// ── STEP B: fix ONE Q&A to its correct golden template (chosen by title) ──
async function fixOneEntry(store, idx, pillar, item, validIds, onProgress) {
  const existing = await store.get('answers/' + item.id + '.json', { type: 'json' });
  const body = existing.answer || existing.body || '';
  const pick = pickGoldTemplate(item.id, body, item.title);   // title-driven classification (owner)
  const template = pick.template === 'qa' ? 'qa' : 'top10';

  if (template === 'top10') {
    const tAll = meter.start();
    const before = auditTop10GoldTemplate(body, item.title);
    const tr = meter.start(); const rebuilt = await rebuildAqTop10Entry(item.id, item.title, body, { dsChat, onProgress }); tr.stop('rebuild');
    let nb = rebuilt.body;
    let gold = rebuilt.gold || auditTop10GoldTemplate(nb, item.title);
    let ccUsed = false;
    if (!gold.compliant) {                       // escalate to a Claude Code agent (owner 2026-07-06)
      const tcc = meter.start();
      const cc = await ccGoldenFix(item.id, item.title, nb, 'top10', { log });
      tcc.stop('ccfix');
      if (cc.changed) { nb = cc.body; gold = auditTop10GoldTemplate(nb, item.title); ccUsed = true; }
    }
    const ti = meter.start(); const img = await fableImageRenderGate(item.id, item.title, nb, { store, template: 'top10', onProgress }); ti.stop('imgrender');
    if (img.body && img.body !== nb) { nb = img.body; gold = auditTop10GoldTemplate(nb, item.title); } // adopt re-fetched/self-hosted images
    const ts = meter.start(); await saveAqTop10Entry(store, idx, item.id, item.title, nb, existing); ts.stop('save');
    const tc = meter.start(); const check = await spotCheckEntry(item.id, nb, item.title); tc.stop('check');
    const ms = tAll.stop('fix');
    return {
      template: 'Top-10 (aq1158)' + (ccUsed ? ' +CC' : ''), grade: check.grade, pass: check.grade >= 13 && gold.compliant && img.pass, ms,
      before: (before.issues || []).slice(0, 6), goldOk: gold.compliant, goldIssues: (gold.issues || []).slice(0, 4),
      imgPass: img.pass, imgTotal: img.total, imgFailed: (img.failed || []).map(f => f.url + ' (' + f.flag + ')').slice(0, 4),
    };
  }
  const tAll = meter.start();
  const before = auditQaGoldTemplate(body, item.title, item.id);
  const sibRe = new RegExp('^' + pillar + '\\d+$');
  const siblings = (idx.entries || []).filter(e => e && sibRe.test(e.id) && e.id !== item.id).slice(0, 8)
    .map(e => ({ id: e.id, title: e.question || e.id }));
  const tr = meter.start(); const rebuilt = await rebuildAqQaEntry(item.id, item.title, body, { store, entryMeta: existing, siblings, valid: validIds, dsChat, onProgress }); tr.stop('rebuild');
  let nb = rebuilt.body;
  let gold = auditQaGoldTemplate(nb, item.title, item.id);
  let ccUsed = false;
  if (!gold.compliant) {                         // escalate to a Claude Code agent (owner 2026-07-06)
    const tcc = meter.start();
    const cc = await ccGoldenFix(item.id, item.title, nb, 'qa', { log });
    tcc.stop('ccfix');
    if (cc.changed) { nb = cc.body; gold = auditQaGoldTemplate(nb, item.title, item.id); ccUsed = true; }
  }
  const ti = meter.start(); const img = await fableImageRenderGate(item.id, item.title, nb, { store, template: 'qa', onProgress }); ti.stop('imgrender');
  if (img.body && img.body !== nb) { nb = img.body; gold = auditQaGoldTemplate(nb, item.title, item.id); } // adopt re-fetched/self-hosted images
  const ts = meter.start(); const saved = await saveAqQaEntry(store, idx, item.id, item.title, nb, existing); ts.stop('save');
  const ms = tAll.stop('fix');
  return {
    template: 'Q&A (q11133)' + (ccUsed ? ' +CC' : ''), grade: saved.grade, pass: saved.grade >= 13 && gold.compliant && img.pass, ms,
    before: (before.issues || []).slice(0, 6), goldOk: gold.compliant, goldIssues: (gold.issues || []).slice(0, 4),
    imgPass: img.pass, imgTotal: img.total, imgFailed: (img.failed || []).map(f => f.url + ' (' + f.flag + ')').slice(0, 4),
  };
}

async function emailFix(pillarLabel, item, res, n) {
  const url = 'https://pulserevops.com/knowledge/' + item.id;
  const idLink = '<a href="' + url + '" style="color:#0b57d0;font-weight:800;text-decoration:none">' + esc(item.id) + '</a>';
  await emailResend((res.pass ? '✅' : '⚠️') + ' ' + pillarLabel + ' fixed · ' + item.id + ' [' + res.template + ']',
    FRAME('🛠️ ' + pillarLabel + ' Q&A corrected — ' + idLink + '  (#' + n + ')',
      '<p style="margin:0 0 4px;font-weight:700;color:#15110d">' + esc(item.title) + '</p>' +
      '<p style="margin:0 0 8px;color:#3a3229">Template (by title): <b>' + res.template + '</b> · grade <b>' + res.grade + '/13</b> · ' +
      (res.pass ? '<span style="color:#127a3d;font-weight:700">PASS 13/13 + golden compliant</span>'
        : '<span style="color:#b23;font-weight:700">below bar — flagged for re-run</span>') + '</p>' +
      '<p style="margin:0 0 8px;font-size:12px;color:#3a3229">🖼️ Images render (mobile+desktop): ' +
      (res.imgPass ? '<span style="color:#127a3d;font-weight:700">✓ all ' + (res.imgTotal || 0) + ' render-verified</span>'
        : '<span style="color:#b23;font-weight:700">✗ ' + (res.imgFailed && res.imgFailed.length ? esc(res.imgFailed.join(', ')) : 'render check failed') + '</span>') + '</p>' +
      (res.before && res.before.length ? '<p style="margin:0 0 8px;font-size:12px;color:#6b5d49">Was failing: ' + esc(res.before.join(', ')) + '</p>' : '') +
      '<p style="margin:0"><a href="' + url + '" style="color:#0b57d0;font-weight:700">' + url + '</a></p>'));
}

// Hand a passed (13/13) fix to Stage-2: the 2 Claude Code auditors (_v2_auditor.js, Max plan)
// read _v2_approved.json newest-first, critique + improve, then promote to _v2_cc_approved.json.
const APPROVED_F = WD + '/_v2_approved.json';
function approveForCcAudit(id) {
  try {
    let arr = []; try { arr = JSON.parse(fs.readFileSync(APPROVED_F, 'utf8')) || []; } catch (e) {}
    if (!arr.includes(id)) { arr.push(id); fs.writeFileSync(APPROVED_F, JSON.stringify(arr)); }
  } catch (e) {}
}

const PILLAR_LABEL = { mv: 'Movies', tl: 'CRO Pulse Tools' };
const TL_POOL_INVENTORY = 200;

async function runTlInventoryPhase(store) {
  const label = PILLAR_LABEL.tl;
  let stalled = 0;
  const startPool = poolCount('tl');
  log('▶▶ TL INVENTORY: target ' + TL_POOL_INVENTORY + ' pool images (have ' + startPool + ')');
  await emailResend('▶ ' + label + ' — building 200 face-card inventory',
    FRAME(label + ' inventory phase',
      '<p>Generating <b>200</b> unique Pollinator face-card pool images for CRO Pulse Tools.</p>' +
      '<p style="color:#6b5d49;font-size:13px">After inventory: smart topical duplicates from pool when they fit; new flux when they do not. Resend email per card.</p>'));
  const cardEnv = {
    POOL_INVENTORY: String(TL_POOL_INVENTORY),
    SMART_DUP: '0',
    POOL_BUILD_ONLY: '1',
    ORIG_PER_PILLAR: String(TL_POOL_INVENTORY),
    SKIP_FACE_CARD_EMAIL: '0',
  };
  while (poolCount('tl') < TL_POOL_INVENTORY) {
    if (fs.existsSync(STOP)) return { inventory: poolCount('tl'), stopped: true };
    const before = poolCount('tl');
    const fc = await makeOneFaceCard('tl', cardEnv);
    if (fc.ok) {
      stalled = 0;
      log('  ✓ inventory ' + before + '→' + poolCount('tl') + ' · ' + fc.id);
    } else if (fc.done) {
      break;
    } else {
      stalled++;
      if (stalled >= 5) break;
    }
  }
  const inventory = poolCount('tl');
  await emailResend('✅ ' + label + ' inventory · ' + inventory + '/200',
    FRAME(label + ' inventory ready',
      '<p><b>' + inventory + '</b> / 200 pool images built.</p>' +
      '<p style="color:#6b5d49">Next: smart pool duplicates + new flux for remaining tl covers (no Q&A fixes).</p>'));
  log('◀◀ TL INVENTORY end · ' + inventory + '/200');
  return { inventory, stopped: false };
}

async function emailPerf(label, fixed, total, covers) {
  const s = meter.snapshot();
  await emailResend('⚡ ' + label + ' · ' + fixed + (total ? '/' + total : '') + ' fixed · ' + s.fixesPerHr + '/hr',
    FRAME('⚡ ' + label + ' — progress + performance',
      '<p style="margin:0 0 6px"><b>' + fixed + '</b>' + (total ? ' / ' + total : '') + ' Q&As fixed · <b>' + covers + '</b> covers · <b>' + s.fixesPerHr + '</b> fixes/hr</p>' +
      '<p style="margin:0 0 6px;font-size:13px;color:#3a3229">Bottleneck: <b>' + s.bottleneck + '</b> · self-tuned concurrency K=<b>' + s.k + '</b> (best proven K=' + s.kBest + ')</p>' +
      '<p style="margin:0;font-size:12px;color:#6b5d49">fix ' + meter.fmtMs(s.fix) + ' (rebuild ' + meter.fmtMs(s.rebuild) + ' · save ' + meter.fmtMs(s.save) + ' · check ' + meter.fmtMs(s.check) + ') · card ' + meter.fmtMs(s.card) + ' overlapped (off critical path)</p>'));
}

// ── Face cards only — no golden-template Q&A fixes (owner SKIP_QA_FIXES) ──
async function runFaceCardsOnlyPhase(store, pillar, opts) {
  const label = PILLAR_LABEL[pillar] || pillar;
  const faceCardEnv = Object.assign({ SKIP_FACE_CARD_EMAIL: '0' }, (opts && opts.faceCardEnv) || {});
  let idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const re = new RegExp('^' + pillar + '\\d+$');
  const rows = (idx.entries || []).filter((e) => e && re.test(e.id));
  const needCover = rows.filter((e) => e.cover_src !== 'flux').length;
  log('▶▶ FACE CARDS ' + label + ' (' + pillar + '): ' + rows.length + ' entries · ' + needCover + ' need covers · Q&A fixes OFF');
  await emailResend('▶ ' + label + ' — face cards only (no Q&A fixes)',
    FRAME(label + ' face cards', '<p><b>' + rows.length + '</b> entries · <b>' + needCover + '</b> need covers.</p>' +
      '<p style="color:#6b5d49;font-size:13px">Golden-template Q&A fixes are <b>disabled</b>. Pollinator face cards only · Resend per card · no deploy.</p>'));

  let covers = 0;
  let stalled = 0;
  let stopped = false;
  while (true) {
    if (fs.existsSync(STOP)) { stopped = true; break; }
    const fc = await makeOneFaceCard(pillar, faceCardEnv);
    if (fc.ok) {
      covers++;
      stalled = 0;
      meter.incCards(1);
      log('  ✓ card ' + fc.id);
      await emailFaceCard(fc);
      idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    } else if (fc.done) {
      break;
    } else {
      stalled++;
      if (fc.id) log('  ✗ card ' + fc.id);
      if (stalled >= 8) break;
    }
  }

  const state = stopped ? 'stopped' : 'complete';
  await emailResend((stopped ? '⏸️ ' : '✅ ') + label + ' face cards ' + state,
    FRAME(label + ' face cards ' + state,
      '<p><b>' + covers + '</b> covers this run · Q&A fixes <b>skipped</b> (owner law).</p>'));
  log('◀◀ FACE CARDS ' + label + ' end · covers=' + covers + ' (' + state + ')');
  return { fixed: 0, covers, stopped };
}

// Legacy combined phase — Q&A fix path disabled when SKIP_QA_FIXES
async function runPhase(store, pillar, opts) {
  if (SKIP_QA_FIXES) return runFaceCardsOnlyPhase(store, pillar, opts);
  const label = PILLAR_LABEL[pillar] || pillar;
  const faceCardEnv = (opts && opts.faceCardEnv) || {};
  const emailEach = pillar === 'mv' || process.env.EMAIL_EACH === '1'; // email each fixed Q&A (owner 2026-07-07)
  const PERF_EVERY = pillar === 'mv' ? 12 : 25; // progress+perf email cadence
  const cap = (DAILY_CAP || 22) - DS_SAFETY;
  let idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const validIds = new Set((idx.entries || []).filter(e => e && e.id).map(e => e.id));
  const re = new RegExp('^' + pillar + '\\d+$');
  const rows = (idx.entries || []).filter(e => e && re.test(e.id));
  rows.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
  const total = rows.length;
  const needCover = rows.filter(e => e.cover_src !== 'flux').length;
  log('▶▶ PHASE ' + label + ' (' + pillar + '): ' + total + ' entries · ' + needCover + ' need covers');
  await emailResend('▶ ' + label + ' — starting',
    FRAME(label + ' pillar', '<p>' + total + ' entries · <b>' + needCover + '</b> need face-card covers.</p>' +
      '<p style="color:#6b5d49;font-size:13px">Face cards overlapped with Q&A fixes · self-tuning concurrency · no cooldowns · no deploy.' +
      (emailEach ? ' Emailing each activity.' : ' Batched progress every ' + PERF_EVERY + '.') + '</p>'));

  let fixed = 0, covers = 0, fixPtr = 0, coversDone = process.env.NO_FACE_CARDS === '1', stopped = false, capped = false, lastPerf = 0; // NO_FACE_CARDS=1 → face-card generator owns covers, skip spawns here (owner 2026-07-07)
  const fixedLog = []; // {id,title,pass,grade,imgPass} for the final completion email (linked q-ids)
  while (true) {
    if (fs.existsSync(STOP)) { stopped = true; break; }
    const K = Math.max(1, Math.min(meter.K, meter.MAX_K));

    // gather up to K entries still needing a fix (skip already-golden ones)
    const batch = []; let fixesDone = false;
    while (batch.length < K) {
      if (fixPtr >= rows.length) { fixesDone = true; break; }
      const row = rows[fixPtr++];
      let a; try { a = await store.get('answers/' + row.id + '.json', { type: 'json' }); } catch (x) { continue; }
      if (!a) continue;
      const body = a.answer || a.body || '';
      const title = row.question || row.id;
      const pick = pickGoldTemplate(row.id, body, title);
      const needs = pick.template === 'qa'
        ? needsAqQaFix(row.id, body, title, row, false)
        : needsAqTop10Fix(row.id, body, title, row, false);
      if (!needs) continue;
      batch.push({ id: row.id, title, template: pick.template });
    }

    if (batch.length) { // DeepSeek cap gate before spending on the batch
      const spent = (typeof todaySpend === 'function' ? todaySpend() : 0) || 0;
      if (spent >= cap) { capped = true; stopped = true; break; }
    }

    // ── overlap: ONE face card (async) alongside the K concurrent fixes ──
    const cardP = coversDone ? Promise.resolve({ done: true }) : makeOneFaceCard(pillar, faceCardEnv);
    const wallT = meter.start();
    const results = await Promise.all(batch.map(it =>
      fixOneEntry(store, idx, pillar, it, validIds).then(r => ({ it, r })).catch(e => ({ it, err: e }))));
    const wallMs = batch.length ? wallT.stop('fixbatch') : wallT.peek();
    const idleT = meter.start();
    const fc = await cardP;              // usually already finished (card < fix)
    idleT.stop('idle');

    if (fc.ok) { covers++; meter.incCards(1); log('  ✓ card ' + fc.id); if (emailEach) await emailFaceCard(fc); }
    else if (fc.done) { coversDone = true; }
    else if (fc.id) { log('  ✗ card ' + fc.id); }

    // ── safe single index write: snapshot fixed rows → reload (adopt card cover_src) → re-apply → write ──
    if (batch.length) {
      const snaps = {};
      for (const it of batch) { const r = (idx.entries || []).find(e => e && e.id === it.id); if (r) snaps[it.id] = r; }
      idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
      for (const id in snaps) { const i = (idx.entries || []).findIndex(e => e && e.id === id); if (i >= 0) idx.entries[i] = snaps[id]; }
      await store.setJSON('_index.json', idx);
    } else if (fc.ok) {
      idx = await store.get('_index.json', { type: 'json', consistency: 'strong' }); // adopt cover_src (no fixes this cycle)
    }

    for (const { it, r, err } of results) {
      if (err) {
        log('  ✗ fix err ' + it.id + ' · ' + err.message);
        await emailResend('⚠️ ' + label + ' fix errored · ' + it.id,
          FRAME('Fix error — ' + it.id, '<p>' + esc(it.title) + '</p><p style="color:#b23">' + esc(err.message) + '</p>'));
        continue;
      }
      fixed++;
      fixedLog.push({ id: it.id, title: it.title, pass: r.pass, grade: r.grade, imgPass: r.imgPass });
      if (r.pass) approveForCcAudit(it.id); // → Stage-2 CC auditors (2 workers, Max plan)
      log('  ' + (r.pass ? '✓' : '⚠') + ' ' + it.id + ' grade=' + r.grade + ' ' + meter.fmtMs(r.ms || 0) + ' (K=' + K + ')');
      if (emailEach) await emailFix(label, it, r, fixed);
    }

    if (batch.length) meter.batchDone(K, batch.length, wallMs);
    meter.nextK();               // self-learning: pick concurrency for next batch
    meter.writeDashboard();
    if (fixed - lastPerf >= PERF_EVERY) { lastPerf = fixed; await emailPerf(label, fixed, total, covers); }

    if (capped) { stopped = true; break; }
    if (coversDone && fixesDone) break; // both streams exhausted for this pillar
  }

  const state = capped ? 'paused (DeepSeek cap)' : stopped ? 'stopped' : 'complete';
  const s = meter.snapshot();
  const fixedListHtml = fixedLog.length
    ? '<p style="margin:14px 0 4px;font-weight:700;color:#15110d">Fixed this run (' + fixedLog.length + ') — click a question ID:</p>' +
      '<ol style="margin:0;padding-left:20px;color:#3a3229;font-size:13px">' +
      fixedLog.map(f => {
        const u = 'https://pulserevops.com/knowledge/' + f.id;
        return '<li style="margin:0 0 3px">' +
          '<a href="' + u + '" style="color:#0b57d0;font-weight:800;text-decoration:none">' + esc(f.id) + '</a> — ' +
          esc(String(f.title || '').slice(0, 70)) + ' · ' +
          (f.pass ? '<span style="color:#127a3d;font-weight:700">PASS ' + f.grade + '/13' + (f.imgPass ? ' 🖼️✓' : '') + '</span>'
                  : '<span style="color:#b23;font-weight:700">' + f.grade + '/13' + (f.imgPass ? ' 🖼️✓' : ' 🖼️✗') + '</span>') +
          '</li>';
      }).join('') +
      '</ol>'
    : '';
  await emailResend((stopped ? '⏸️ ' : '✅ ') + label + ' phase ' + state + ' · ' + fixed + ' fixed',
    FRAME(label + ' phase ' + state,
      '<p><b>' + fixed + '</b> Q&As corrected · <b>' + covers + '</b> new covers · <b>' + s.fixesPerHr + '</b> fixes/hr · bottleneck <b>' + s.bottleneck + '</b> · best K=' + s.kBest + '.</p>' +
      (capped ? '<p style="color:#6b5d49">DeepSeek daily cap reached — restart to resume this pillar.</p>'
        : stopped ? '<p style="color:#6b5d49">Stopped via flag.</p>'
        : '<p style="color:#127a3d">All ' + label + ' covers + Q&As done. ✅</p>') +
      fixedListHtml));
  log('◀◀ PHASE ' + label + ' end · fixed=' + fixed + ' covers=' + covers + ' (' + state + ')');
  return { fixed, covers, stopped: stopped || capped };
}

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE, token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

  // ── Quality-first harness (owner 2026-07-07): land ONE entry to standard, then N in a row, with per-phase logging.
  //    ONE_ID=mv0001  → fix that exact entry (even if already golden).  RUN_N=10 → first 10 needing a fix, sequential.
  if (process.env.ONE_ID || process.env.RUN_N) {
    // Fallback-fire-rate = the early-warning number (owner/advisor 2026-07-07): live provider health.
    // High library-reuse across a batch → providers degrading → cross-entry repeats + pHash rejections next.
    const batchM = { slots: 0, liveOk: 0, timeouts: 0, libReuse: 0, hotlink: 0, gateLibFill: 0 };
    let entM = { slots: 0, liveOk: 0, timeouts: 0, libReuse: 0, hotlink: 0, gateLibFill: 0 };
    const resetEnt = () => { entM = { slots: 0, liveOk: 0, timeouts: 0, libReuse: 0, hotlink: 0, gateLibFill: 0 }; };
    const bump = (k) => { entM[k]++; batchM[k]++; };
    const prog = (p) => {
      const k = p.phase || p.kind || '';
      if (k === 'product') entM._pending = p.rank; // a live attempt started
      if (k === 'product-done') { if (entM._pending === p.rank) { /* resolved */ } entM.slots++; batchM.slots++; }
      if (k === 'product-timeout' || k === 'product-fallback-timeout') bump('timeouts');
      if (k === 'product-library-reuse') { bump('libReuse'); log('   · ONE-STRIKE: provider timed out → library reuse #' + p.rank); return; }
      if (k === 'library-fallback') { bump('gateLibFill'); }
      if (k === 'one-strike-fallback') { log('   · GATE ONE-STRIKE: provider hung → guaranteedLibraryFill (' + p.failing + ' slot' + (p.failing === 1 ? '' : 's') + ')'); return; }
      log('   · ' + k + (p.label ? ' ' + p.label : '') +
        (p.round ? ' r' + p.round : '') + (p.rank ? ' #' + p.rank : '') + (p.failing != null ? ' failing=' + p.failing : '') +
        (p.flags && p.flags.length ? ' [' + p.flags.join(',') + ']' : ''));
    };
    let idxF = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    const validIds = new Set((idxF.entries || []).filter(e => e && e.id).map(e => e.id));
    const pillar = process.env.PILLAR || 'mv';
    const re = new RegExp('^' + pillar + '\\d+$');
    let rows = (idxF.entries || []).filter(e => e && re.test(e.id));
    rows.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
    if (process.env.ONE_ID) rows = rows.filter(r => r.id === process.env.ONE_ID);
    const N = process.env.ONE_ID ? 1 : (parseInt(process.env.RUN_N, 10) || 1);
    let done = 0, passStreak = 0, bestStreak = 0;
    for (const row of rows) {
      if (done >= N) break;
      if (fs.existsSync(STOP)) { log('⏹ stop flag'); break; }
      let a; try { a = await store.get('answers/' + row.id + '.json', { type: 'json' }); } catch (x) { continue; }
      const body = (a && (a.answer || a.body)) || '';
      const title = row.question || row.id;
      const pick = pickGoldTemplate(row.id, body, title);
      if (!process.env.ONE_ID) {
        const needs = pick.template === 'qa' ? needsAqQaFix(row.id, body, title, row, false) : needsAqTop10Fix(row.id, body, title, row, false);
        if (!needs) { log('· skip ' + row.id + ' (already golden)'); continue; }
      }
      const item = { id: row.id, title, template: pick.template };
      log('▶ FIX ' + item.id + ' [' + pick.template + '] ' + String(title).slice(0, 60));
      resetEnt();
      const t0 = Date.now();
      let res;
      try { res = await fixOneEntry(store, idxF, pillar, item, validIds, prog); }
      catch (e) {
        log('✗ ' + item.id + ' ERROR ' + e.message);
        await emailResend('⚠️ Movies fix errored · ' + item.id, FRAME('Fix error — ' + item.id, '<p>' + esc(title) + '</p><p style="color:#b23">' + esc(e.message) + '</p>'));
        passStreak = 0; continue;
      }
      const snap = (idxF.entries || []).find(e => e && e.id === item.id);
      idxF = await store.get('_index.json', { type: 'json', consistency: 'strong' });
      if (snap) { const i = (idxF.entries || []).findIndex(e => e && e.id === item.id); if (i >= 0) idxF.entries[i] = snap; await store.setJSON('_index.json', idxF); }
      done++;
      const secs = Math.round((Date.now() - t0) / 1000);
      log((res.pass ? '✓ PASS ' : '⚠ BELOW ') + item.id + ' grade=' + res.grade + '/13 gold=' + res.goldOk + ' img=' + res.imgPass + '(' + res.imgTotal + ') ' + secs + 's');
      if (res.imgFailed && res.imgFailed.length) log('   img fails: ' + res.imgFailed.join(', '));
      const fbCount = entM.libReuse + entM.gateLibFill + entM.hotlink;
      const rate = entM.slots ? Math.round((fbCount / entM.slots) * 100) : 0;
      log('   img-src: ' + entM.slots + ' slots · ' + entM.timeouts + ' timeouts · ' + entM.libReuse + ' lib-reuse · ' + entM.gateLibFill + ' gate-lib · fallback-rate=' + rate + '%');
      await emailFix('Movies', item, res, done);
      passStreak = (res.pass && res.imgPass) ? passStreak + 1 : 0;
      bestStreak = Math.max(bestStreak, passStreak);
      log('   streak=' + passStreak + ' (best=' + bestStreak + ')');
    }
    const bFb = batchM.libReuse + batchM.gateLibFill + batchM.hotlink;
    const bRate = batchM.slots ? Math.round((bFb / batchM.slots) * 100) : 0;
    log('◀ harness done · processed=' + done + ' · bestStreak=' + bestStreak);
    log('◀ BATCH img health · ' + batchM.slots + ' slots · ' + batchM.timeouts + ' timeouts · ' + batchM.libReuse + ' lib-reuse · ' + batchM.gateLibFill + ' gate-lib · FALLBACK-RATE=' + bRate + '% (early-warning: >33% = live providers degrading)');
    return;
  }

  // Optional fallback path — face-cards-only inventory campaign (legacy tl project).
  if (process.env.TL_QA_ONLY === '1' || process.env.LEGACY_TL === '1') {
    log('▶ TL — golden-template Q&A fixes for tl · classify→golden→13/13 gate · email each fixed q-id · no face cards · no deploy');
    const r = await runPhase(store, 'tl', {});
    log('◀ TL done · fixed=' + r.fixed + ' (' + (r.stopped ? 'stopped/capped' : 'complete') + ')');
    return;
  }

  // Default (new project): Movies pillar golden-template fixes — classify → golden shape → 13/13 gate → save → email each question ID.
  const pillar = process.env.PILLAR || 'mv';
  if (!process.env.NO_FACE_CARDS) process.env.NO_FACE_CARDS = '1'; // focus on golden entry fixes; skip the parallel cover generator
  log('▶ MOVIES golden-template fixes (' + pillar + ') · classify→golden→13/13 gate · email each fixed q-id · no deploy');
  const r = await runPhase(store, pillar, {});
  log('◀ MOVIES done · fixed=' + r.fixed + ' covers=' + r.covers + ' (' + (r.stopped ? 'stopped/capped' : 'complete') + ')');
})().catch(e => { log('FATAL', e && e.message, e && e.stack); process.exit(1); });
