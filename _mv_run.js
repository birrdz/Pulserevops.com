// _mv_run.js — Movies pillar processor (owner 2026-07-08, clean rebuild).
//
// One job, done simply: for every mv#### library entry —
//   1. classify template (Top-10 vs Q&A) by title
//   2. rebuild the body to the golden standard (DeepSeek)
//   3. escalate to a Claude Code fix ONLY if still non-compliant
//   4. image gate using the LOCAL POSTER LIBRARY only (no live DDG/flux)
//   5. save to the blob library
//   6. verify (13/13 gate + golden + images) and EMAIL the owner after EACH one
//
// Env knobs:
//   ONE_ID=mv0001   process just that entry
//   LIMIT=5         cap the number processed
//   MV_EMAIL=...    override recipient
// Stop cleanly any time by creating _mv_run_stop.flag.
'use strict';
const fs = require('fs');
const WD = __dirname;

// ── env (.env.local) ── resilient: try local + absolute path, never crash.
(function loadEnv() {
  const paths = [WD + '/.env.local', 'C:/Users/koryj/website/.env.local'];
  for (const p of paths) {
    try {
      const txt = fs.readFileSync(p, 'utf8');
      for (const l of txt.split(/\r?\n/)) {
        const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
        if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
      }
      return;
    } catch (_e) { /* try next path */ }
  }
  console.warn('WARN: could not read .env.local — relying on inherited env');
})();
// Image policy: poster library ONLY (no live providers), no face-card generator.
// MUST be set before requiring _ddg_facecard_lib (provider bans read at load).
process.env.MV_POSTER_LIBRARY_ONLY = process.env.MV_POSTER_LIBRARY_ONLY || '1';
process.env.NO_FACE_CARDS = process.env.NO_FACE_CARDS || '1';
if (!process.env.STAGGER_DDG_POLLINATOR) process.env.STAGGER_DDG_POLLINATOR = '1';
if (!process.env.SELF_HOST_PRODUCT_IMAGES) process.env.SELF_HOST_PRODUCT_IMAGES = '1';
if (!process.env.PROD_IMG_TIMEOUT_MS) process.env.PROD_IMG_TIMEOUT_MS = '35000';

const { getStore } = require('@netlify/blobs');
const { pickGoldTemplate } = require('./_pulse_gold_template_router');
const { rebuildAqTop10Entry, saveAqTop10Entry } = require('./_aq_top10_gold_fix_lib');
const { rebuildAqQaEntry, saveAqQaEntry } = require('./_aq_qa_gold_fix_lib');
const { auditTop10GoldTemplate } = require('./_ranking_top10_gold_template');
const { auditQaGoldTemplate } = require('./_qa_gold_template');
const { spotCheckEntry } = require('./_ranking_list_rebuild_lib');
const { fableImageRenderGate } = require('./_fable_image_render_gate');
const { ccGoldenFix } = require('./_cc_golden_fix');
const { dsChat, todaySpend, DAILY_CAP } = require('./_ds_lib');

const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const RECIP = process.env.MV_EMAIL || 'koryjordanwhite@gmail.com';
const RESEND_KEY = process.env.RESEND_API_KEY || process.env.resendapikey || process.env.RESENDAPIKEY;
const STOP = WD + '/_mv_run_stop.flag';
const ONLY = process.env.ONE_ID || '';
const LIMIT = parseInt(process.env.LIMIT || '0', 10) || 0;
const DS_SAFETY = 0.50;

const iso = () => new Date().toISOString();
const log = (...a) => console.log(iso().slice(11, 19), ...a);
const esc = (s) => String(s == null ? '' : s).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));

async function email(subject, html) {
  if (!RESEND_KEY) { log('  (no RESEND key — skip email)'); return; }
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'PULSE Engine <onboarding@resend.dev>', to: [RECIP], subject, html }),
    });
    if (!r.ok) log('  email HTTP ' + r.status);
  } catch (e) { log('  email err ' + e.message); }
}

function entryEmail(item, res, n, total) {
  const url = 'https://pulserevops.com/movies/' + item.id;
  const ok = res.pass;
  const goldOk = !res.issues || !res.issues.length;
  return email(
    (ok ? '✅' : '⚠️') + ' Movies ' + item.id + ' (' + n + '/' + total + ') · ' + res.grade + '/13',
    '<div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:560px">' +
    '<h2 style="font-family:Georgia,serif;margin:0 0 10px">' + (ok ? '🎬 Movie entry done' : '⚠️ Movie entry below bar') + ' — ' + esc(item.id) + '</h2>' +
    '<p style="margin:0 0 4px;font-weight:700;color:#15110d">' + esc(item.title) + '</p>' +
    '<p style="margin:0 0 8px;color:#3a3229">Template <b>' + res.template + '</b> · grade <b>' + res.grade + '/13</b> · ' +
      (ok ? '<span style="color:#127a3d;font-weight:700">PASS 13/13 + golden + images verified</span>'
          : '<span style="color:#b23;font-weight:700">below bar' + (goldOk ? '' : ' — ' + esc((res.issues || []).slice(0, 4).join(', '))) + '</span>') + '</p>' +
    '<p style="margin:0 0 8px;font-size:12px;color:#3a3229">🖼️ images: ' +
      (res.imgPass ? '<span style="color:#127a3d;font-weight:700">✓ ' + (res.imgTotal || 0) + ' verified</span>'
                   : '<span style="color:#b23;font-weight:700">✗ ' + esc((res.imgFailed || []).slice(0, 4).join(', ') || 'render fail') + '</span>') + '</p>' +
    '<p style="margin:0"><a href="' + url + '" style="color:#0b57d0;font-weight:700">' + url + '</a></p>' +
    '<p style="margin:10px 0 0;color:#6b5d49;font-size:11px">' + n + ' of ' + total + ' · ' + iso() + '</p></div>');
}

async function processEntry(store, idx, item, validIds) {
  const existing = await store.get('answers/' + item.id + '.json', { type: 'json' });
  const body = (existing && (existing.answer || existing.body)) || '';
  const pick = pickGoldTemplate(item.id, body, item.title);
  const template = pick.template === 'qa' ? 'qa' : 'top10';

  if (template === 'top10') {
    const rebuilt = await rebuildAqTop10Entry(item.id, item.title, body, { dsChat });
    let nb = rebuilt.body;
    let gold = rebuilt.gold || auditTop10GoldTemplate(nb, item.title);
    if (!gold.compliant) {
      try { const cc = await ccGoldenFix(item.id, item.title, nb, 'top10', { log }); if (cc && cc.changed) { nb = cc.body; gold = auditTop10GoldTemplate(nb, item.title); } }
      catch (e) { log('  ccGoldenFix top10 skipped: ' + e.message); }
    }
    const img = await fableImageRenderGate(item.id, item.title, nb, { store, template: 'top10' });
    if (img.body && img.body !== nb) { nb = img.body; gold = auditTop10GoldTemplate(nb, item.title); }
    await saveAqTop10Entry(store, idx, item.id, item.title, nb, existing);
    const check = await spotCheckEntry(item.id, nb, item.title);
    return { template: 'top10', grade: check.grade, pass: check.grade >= 13 && gold.compliant && img.pass,
      issues: gold.issues || [], imgPass: img.pass, imgTotal: img.total, imgFailed: (img.failed || []).map((f) => f.url || f.flag || '') };
  }

  const siblings = (idx.entries || []).filter((e) => e && /^mv\d+$/i.test(e.id) && e.id !== item.id).slice(0, 8)
    .map((e) => ({ id: e.id, title: e.question || e.id }));
  const rebuilt = await rebuildAqQaEntry(item.id, item.title, body, { store, entryMeta: existing, siblings, valid: validIds, dsChat });
  let nb = rebuilt.body;
  let gold = auditQaGoldTemplate(nb, item.title, item.id);
  if (!gold.compliant) {
    try { const cc = await ccGoldenFix(item.id, item.title, nb, 'qa', { log }); if (cc && cc.changed) { nb = cc.body; gold = auditQaGoldTemplate(nb, item.title, item.id); } }
    catch (e) { log('  ccGoldenFix qa skipped: ' + e.message); }
  }
  const img = await fableImageRenderGate(item.id, item.title, nb, { store, template: 'qa' });
  if (img.body && img.body !== nb) { nb = img.body; gold = auditQaGoldTemplate(nb, item.title, item.id); }
  const saved = await saveAqQaEntry(store, idx, item.id, item.title, nb, existing);
  return { template: 'qa', grade: saved.grade, pass: saved.grade >= 13 && gold.compliant && img.pass,
    issues: gold.issues || [], imgPass: img.pass, imgTotal: img.total, imgFailed: (img.failed || []).map((f) => f.url || f.flag || '') };
}

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE, token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
  let idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const validIds = new Set((idx.entries || []).filter((e) => e && e.id).map((e) => e.id));
  let rows = (idx.entries || []).filter((e) => e && /^mv\d+$/i.test(e.id));
  rows.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
  if (ONLY) rows = rows.filter((r) => r.id === ONLY);
  const total = LIMIT ? Math.min(LIMIT, rows.length) : rows.length;

  log('▶ MV RUN · ' + total + ' entries · poster-library-only · email each · stop: _mv_run_stop.flag');
  await email('▶ Movies run started · ' + total + ' entries',
    '<p>Processing <b>' + total + '</b> movie entries to the golden 13/13 standard with the local poster library. You will get an email after <b>each</b> finished entry.</p>');

  let done = 0, passN = 0, failN = 0;
  for (const row of rows) {
    if (done >= total) break;
    if (fs.existsSync(STOP)) { log('⏹ stop flag — halting'); await email('⏸️ Movies run stopped', '<p>Stopped by flag at ' + done + '/' + total + ' · ' + passN + ' passed.</p>'); break; }

    let spent = 0;
    try { const s = todaySpend(); if (s && typeof s.spent === 'number') spent = s.spent; } catch (_e) {}
    if (DAILY_CAP && spent >= (DAILY_CAP - DS_SAFETY)) {
      log('⏹ daily DS cap reached ($' + spent.toFixed(2) + '/' + DAILY_CAP + ')');
      await email('⏸️ Movies run paused — daily budget cap', '<p>Stopped at ' + done + '/' + total + ' — DeepSeek daily cap ($' + DAILY_CAP + ') reached. Resume when the cap resets or raise it.</p>');
      break;
    }

    const item = { id: row.id, title: row.question || row.id };
    done++;
    log('▶ ' + item.id + ' (' + done + '/' + total + ') ' + String(item.title).slice(0, 60));
    let res;
    try {
      idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
      res = await processEntry(store, idx, item, validIds);
    } catch (e) {
      log('✗ ' + item.id + ' ERROR ' + e.message);
      failN++;
      await email('⚠️ Movies ' + item.id + ' errored (' + done + '/' + total + ')',
        '<p><b>' + esc(item.id) + '</b> — ' + esc(item.title) + '</p><p style="color:#b23">' + esc(e.message) + '</p>');
      continue;
    }
    if (res.pass) passN++; else failN++;
    log((res.pass ? '✓ PASS ' : '⚠ BELOW ') + item.id + ' grade=' + res.grade + '/13 img=' + res.imgPass + '(' + res.imgTotal + ')');
    await entryEmail(item, res, done, total);
  }

  log('◀ MV RUN done · processed=' + done + ' · pass=' + passN + ' · fail=' + failN);
  await email((failN ? '🎬 Movies run finished · ' : '✅ Movies run 100% · ') + passN + '/' + done + ' passed',
    '<div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:560px">' +
    '<h2 style="font-family:Georgia,serif">🎬 Movies run finished</h2>' +
    '<p style="font-size:18px;font-weight:800">' + passN + ' / ' + done + ' passed</p>' +
    (failN ? '<p style="color:#b23;font-weight:700">' + failN + ' below bar — see the per-entry emails.</p>'
           : '<p style="color:#127a3d;font-weight:700">All entries passed. 🎉</p>') +
    '<p style="color:#6b5d49;font-size:11px">' + iso() + '</p></div>');
})().catch((e) => { console.error('FATAL', e && e.message, e && e.stack); process.exit(1); });
