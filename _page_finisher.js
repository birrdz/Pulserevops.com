// _page_finisher.js — 👷 WHOLE CREW: ONE page, beginning to end (owner 2026-07-21). Each crew takes a page and
// does EVERY step on it before moving on: WRITE to 12-13/13 → FACE CARD → HERO → BODY 1..N (N scaled to length)
// → mark fully done → next page. Pick your pillar, pick how many crews (1/2/3). If two crews run into each other
// they LEAPFROG — jump ahead 5 spots — via a shared claim file. Reuses the real writer + image publishers.
// Run: SLOT_PILLAR=tl BOX_I=0 node _page_finisher.js
'use strict';
const fs = require('fs'), https = require('https'), http = require('http'), crypto = require('crypto');
const WD = 'C:/Users/koryj/website';
try { for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
const PEXELS = process.env.PEXELS_API_KEY || '';
const { getStore } = require('@netlify/blobs');
function theStore() { return getStore({ name: 'pulse-machine-library', siteID: process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN }); }
let rebuildToGate = null, surgicalGateFix = null; try { ({ rebuildToGate, surgicalGateFix } = require('./new/improve_content')); } catch (e) {}
let claudeUnbenched = () => false; try { ({ claudeUnbenched } = require('./new/_claude_bench')); } catch (e) {}
const { publishContentBody, publishFaceImageOnly, publishBodySlot } = require('./new/publish_core');
let emailEntryDone = () => {}; try { ({ emailEntryDone } = require('./_entry_done_email')); } catch (e) {}
let sharp = null; try { sharp = require('sharp'); } catch (e) {}
// 🔒 SHARED IMAGE STANDARDS (new/_image_standards.js) — ONE source of truth for image quality,
// required by BOTH this crew and new/_drip.js so the two can never drift apart.
const STD = require('./new/_image_standards');
// 🏆 title-only Top-10 classifier — the trigger for the ranked golden template
let titleSuggestsRankingList = () => false;
try { ({ titleSuggestsRankingList } = require('./_ranking_list_master_law')); } catch (e) {}
let PILLAR = (process.env.SLOT_PILLAR || process.env.DEFAULT_PILLAR || 'tl').toLowerCase().replace(/[^a-z]/g, '');
// ROTATION (owner 2026-07-21): a small-pillar crew (ROTATE=1) that FINISHES its pillar jumps to the next
// un-taken small Q&A pillar — never the same one twice. The tl crew launches WITHOUT ROTATE and stays on tl.
const ROTATE = process.env.ROTATE === '1';
const SMALL_ROTATION = (process.env.ROTATION_PILLARS || 'gp,bo,ra,cg,sw,sk').split(',').map(s => s.trim()).filter(Boolean);
// ROAM (owner 2026-07-21): crew jumps to a RANDOM pillar + RANDOM question every page, so consecutive entries
// are never from the same cluster (breaks up near-dupes; the dup-gate catches any that slip through).
const ROAM = process.env.ROAM === '1';
const UNDER12 = process.env.UNDER12 === '1';   // 📉 Less than 12/13 — work score < 12 / failed-rewrite pile
// 🆕 NEW Q&A CREW (owner 2026-07-28: "fix new pipeline q and a — give them a dedicated crew to write new q and as").
// NEWQA=1 makes this crew work ONE pile only: the brand-new questions `_pipeline_gen.js` seeded (index row
// `pending:true`, blob `pipeline_new:true`) — never the 36k-page revision backlog. It writes them FULL.
const NEWQA = process.env.NEWQA === '1';
// 🔒 WHY A WORD FLOOR (the bug this fixes): WORD_COUNT (≥2500) is point 1 OF 13 in content_gate.js, so a
// ~650-word stub scores exactly 12/13 — it fails ONLY the word count. With GATE_MIN=12 that publishes. On a
// REVISION that's fine (real prose already exists, we're topping it up). On a BRAND-NEW page it is the whole
// problem: the seeds generated 2026-07-27/28 (tk561-570, st816-825) all published at 12/13 with 637-1241
// words — thin pages, permanently marked done. A new page therefore has to clear a real word floor as WELL
// as the gate before the crew will publish it. 0 disables.
const NEW_MIN_WORDS = Math.max(0, parseInt(process.env.NEWQA_MIN_WORDS || '2000', 10));
const wcount = b => String(b || '').replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;
// 🔁 FORCE REWRITE — never trust the stored gate score; run the writer on every page. See finishPage.
const FORCE_REWRITE = process.env.FORCE_REWRITE === '1';
// 💸 CHEAP WRITE (hub default ON): surgical $0 first → ≥12 publish; else ONE DeepSeek try. No Cursor team/redo.
const CHEAP_WRITE = process.env.CHEAP_WRITE !== '0';
// ROAM list. The hub passes the FULL pillar set via env (single source of truth = _hub.js PILLARS), so adding a
// pillar to the dropdown actually reaches the crews. The fallback below is every real pillar in the library —
// the old default was only 10 (tl,gp,bo,ra,cg,sw,sk,ik,ai,q), which is why roaming crews never touched Cars,
// Boats, Pets, Travel, Gaming and the rest no matter what the dropdown said.
const ROAM_PILLARS = (process.env.ROAM_PILLARS || 'tl,gp,ra,cg,st,sk,ik,tk,sw,bo,fr,bs,ai,q,mv,aq,ca,bt,co,sy,gb,nil,ed,er,pt,sc,dn,es,tv,sp,tc,rs,nl,cl,tn,lv,wl,ev,ga,gm,hf,et,se,tr').split(',').map(s => s.trim()).filter(Boolean);
// COOLDOWN (owner 2026-07-21): after a crew FINISHES a page, wait this long before the next — paces the load so
// crews don't hammer the connection. Staggered starts (BOX_I × cooldown) offset the crews so only one works at a time.
const COOLDOWN_MS = parseInt(process.env.COOLDOWN_MS || '0', 10);   // 0 = no cooldown unless set in the box
const GATE_MIN = parseInt(process.env.GATE_MIN || '12', 10);   // min gate score to publish (DeepSeek often lands 11)
const STAGGER_MS = parseInt(process.env.STAGGER_MS || String(COOLDOWN_MS), 10);   // how far apart crews start (default = cooldown)
const ROTF = WD + '/new/imagebank/_pillar_rotation.json';
function loadRot() { try { return JSON.parse(fs.readFileSync(ROTF, 'utf8')); } catch (e) { return { done: [], taken: {} }; } }
function saveRot(o) { try { fs.writeFileSync(ROTF, JSON.stringify(o)); } catch (e) {} }
// ISOLATED HOP (owner 2026-07-22): a ROAM crew hops to a pillar NO OTHER crew is on — crews never share a pillar.
// Shared assignment file; entries go stale after 5 min so a dead crew's pillar frees up.
const ASSIGNF = WD + '/new/imagebank/_pillar_assign.json';
function loadAssign() { try { const o = JSON.parse(fs.readFileSync(ASSIGNF, 'utf8')); const now = Date.now(); for (const k of Object.keys(o)) if (now - (o[k].ts || 0) > 300000) delete o[k]; return o; } catch (e) { return {}; } }
function saveAssign(o) { try { fs.writeFileSync(ASSIGNF, JSON.stringify(o)); } catch (e) {} }
function pickIsolatedPillar() {
  const a = loadAssign(), mine = 'box' + BOX_I;
  const taken = new Set(Object.keys(a).filter(k => k !== mine).map(k => a[k].p));
  let pool = ROAM_PILLARS.filter(p => !taken.has(p) && p !== PILLAR);   // isolated + different from where I am
  if (!pool.length) pool = ROAM_PILLARS.filter(p => !taken.has(p));      // else any isolated pillar
  if (!pool.length) pool = ROAM_PILLARS;                                  // else (more crews than pillars) any
  const p = pool[Math.floor(Math.random() * pool.length)];
  a[mine] = { p, ts: Date.now() }; saveAssign(a);
  return p;
}
// 🆕 Where are the unwritten seeds? Counts `pending` index rows per pillar and returns the pillar with the most,
// preferring one no other crew is sitting on. Used by roaming NEW-Q&A crews so every hop lands on real work.
function pickSeededPillar(idx) {
  const cnt = {};
  for (const e of ((idx && idx.entries) || [])) {
    if (!e || e.pending !== true) continue;
    const m = String(e.id || '').match(/^([a-z]+)\d/);
    if (!m || ROAM_PILLARS.indexOf(m[1]) < 0) continue;
    cnt[m[1]] = (cnt[m[1]] || 0) + 1;
  }
  const ranked = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a]);
  if (!ranked.length) return null;
  const a = loadAssign(), mine = 'box' + BOX_I;
  const taken = new Set(Object.keys(a).filter(k => k !== mine).map(k => a[k].p));
  const p = ranked.find(x => !taken.has(x)) || ranked[0];
  a[mine] = { p, ts: Date.now() }; saveAssign(a);
  return p;
}
const PORT = parseInt(process.env.FINISHER_PORT || process.env.LASTLEG_PORT || '7700', 10);
const BOX_I = parseInt(process.env.BOX_I || '0', 10), BOX_N = parseInt(process.env.BOX_N || '1', 10);
const HUB_FLEET = WD + '/_hub_fleet.json';
// 🔢 DYNAMIC EVEN-SPLIT (owner 2026-07-23): every PINNED crew on the same pillar+pod shares that pillar's pages
// evenly — recomputed from the live fleet EACH loop, so launching 3 crews on one pillar gives a clean 1/3 each,
// and adding a 4th (or losing one to a crash) re-partitions ALL of them with no restart. The spawn-time BOX_I/BOX_N
// env vars are only a fallback for when the fleet file can't be read or this crew isn't found in it. Roaming crews
// are isolated (never share a pillar) → always N=1, take everything on whatever pillar they hopped to.
let _strideCache = { i: BOX_I, n: BOX_N }, _strideAt = 0;
function liveStride() {
  if (typeof ROAM !== 'undefined' && ROAM) return { i: 0, n: 1 };
  const now = Date.now();
  if (now - _strideAt < 4000) return _strideCache;   // cheap: re-read the fleet file at most every 4s
  _strideAt = now;
  try {
    const fleet = JSON.parse(fs.readFileSync(HUB_FLEET, 'utf8'));
    const me = Array.isArray(fleet) ? fleet.find(b => b && b.port === PORT) : null;
    if (!me) { _strideCache = { i: BOX_I, n: BOX_N }; return _strideCache; }
    const myPod = me.podIndex || 0;
    const peers = fleet
      .filter(b => b && b.type === me.type && b.pillar === me.pillar && (b.podIndex || 0) === myPod && !(b.opts && b.opts.zone))
      .sort((a, b) => a.port - b.port);
    const idx = peers.findIndex(b => b.port === PORT);
    _strideCache = (idx < 0 || !peers.length) ? { i: BOX_I, n: BOX_N } : { i: idx, n: peers.length };
  } catch (e) { _strideCache = { i: BOX_I, n: BOX_N }; }
  return _strideCache;
}
const DO_WRITE = process.env.FINISHER_WRITE !== '0';   // set FINISHER_WRITE=0 to image-only (assume already written)
const DRY = process.env.DRY === '1';                   // DRY=1 → log what it WOULD do, place/write nothing (preview/smoke test)
let DONEF = WD + '/new/imagebank/_finisher_' + PILLAR + '_done.json';
function doneList() { try { return JSON.parse(fs.readFileSync(DONEF, 'utf8')); } catch (e) { return []; } }
function addDone(id) { try { const a = doneList(); if (a.indexOf(id) < 0) { a.push(id); fs.writeFileSync(DONEF, JSON.stringify(a)); } } catch (e) {} }
// 📋 NOT-FINISHED PILE (owner 2026-07-22): a page a crew can't get to gate after a couple tries goes HERE (one shared
// pile) instead of looping/deferring forever. The owner works the pile later. Shows on the hub as a count.
const NOTFIN = WD + '/_not_finished.json';
const UNDER12_FAIL = WD + '/_under12_failed.json';   // 📉 Less than 12/13 — rewrites that couldn't clear the gate
function addNotFinished(id, score) { try { let a = []; try { a = JSON.parse(fs.readFileSync(NOTFIN, 'utf8')); } catch (e) {} if (!a.find(x => x && x.id === id)) { a.push({ id, pillar: PILLAR, score: score || 0, ts: Date.now() }); fs.writeFileSync(NOTFIN, JSON.stringify(a)); } } catch (e) {} }
function addUnder12Failed(id, score) {
  try {
    let a = []; try { a = JSON.parse(fs.readFileSync(UNDER12_FAIL, 'utf8')); } catch (e) {}
    if (!a.find(x => x && x.id === id)) {
      a.push({ id, pillar: PILLAR, score: score || 0, ts: Date.now() });
      fs.writeFileSync(UNDER12_FAIL, JSON.stringify(a));
    }
    // also keep the legacy not-finished list in sync
    addNotFinished(id, score);
  } catch (e) {}
}
// LEAPFROG claim registry — crews share this file; a page claimed by another crew makes this crew jump ahead 5.
// 🔁 BACK OF THE LINE (owner 2026-07-28: "when a url doesnt hit 12 put it back in inv in that same pillar to be
// run again at the back"). A page that misses the gate is NOT dropped and NOT retried immediately — it stays in
// its own pillar's inventory but sorts to the very end, so the crew spends its next hours on pages it has never
// tried instead of grinding the same stubborn URL. It comes back around naturally once the fresh work runs out.
// Map of id → the moment it was sent back, so repeat offenders queue behind first-time misses.
let BACKF = WD + '/new/imagebank/_finisher_' + PILLAR + '_back.json';
function backMap() { try { return JSON.parse(fs.readFileSync(BACKF, 'utf8')) || {}; } catch (e) { return {}; } }
function sendToBack(id, score) {
  try { const m = backMap(); m[id] = { ts: Date.now(), score: score || 0, tries: ((m[id] && m[id].tries) || 0) + 1 }; fs.writeFileSync(BACKF, JSON.stringify(m)); return m[id].tries; } catch (e) { return 0; }
}
function clearBack(id) { try { const m = backMap(); if (m[id]) { delete m[id]; fs.writeFileSync(BACKF, JSON.stringify(m)); } } catch (e) {} }
let CLAIMS = WD + '/new/imagebank/_wholecrew_' + PILLAR + '_claims.json';
function loadClaims() { try { const o = JSON.parse(fs.readFileSync(CLAIMS, 'utf8')); const now = Date.now(); for (const k of Object.keys(o)) if (now - (o[k].ts || 0) > 600000) delete o[k]; return o; } catch (e) { return {}; } }
function claim(id) { try { const o = loadClaims(); o[id] = { box: BOX_I, ts: Date.now() }; fs.writeFileSync(CLAIMS, JSON.stringify(o)); } catch (e) {} }
function releaseClaim(id) { try { const o = loadClaims(); if (o[id] && o[id].box === BOX_I) { delete o[id]; fs.writeFileSync(CLAIMS, JSON.stringify(o)); } } catch (e) {} }
// 🚦 IMAGE TURNSTILE — one crew places images (the blob-heavy burst) at a time, so N crews never hammer the
// connection together. Text generation stays parallel; only the image phase is serialized. Stale-breaks at 4 min.
const IMGLOCK = WD + '/new/imagebank/_finisher_imglock.json';
function readImgLock() { try { return JSON.parse(fs.readFileSync(IMGLOCK, 'utf8')); } catch (e) { return null; } }
async function acquireImgLock() {
  for (let i = 0; i < 900; i++) {                       // wait up to ~7.5 min for a turn
    const l = readImgLock(), now = Date.now();
    if (!l || l.holder === -1 || l.holder === BOX_I || (now - (l.ts || 0) > 240000)) {
      try { fs.writeFileSync(IMGLOCK, JSON.stringify({ holder: BOX_I, ts: now })); } catch (e) {}
      await sleep(120 + Math.floor(Math.random() * 120));   // jitter so simultaneous acquirers don't collide
      const l2 = readImgLock(); if (l2 && l2.holder === BOX_I) return;   // won the turn
    }
    await sleep(500);
  }
}
function touchImgLock() { const l = readImgLock(); if (l && l.holder === BOX_I) { try { fs.writeFileSync(IMGLOCK, JSON.stringify({ holder: BOX_I, ts: Date.now() })); } catch (e) {} } }
function releaseImgLock() { const l = readImgLock(); if (l && l.holder === BOX_I) { try { fs.writeFileSync(IMGLOCK, JSON.stringify({ holder: -1, ts: 0 })); } catch (e) {} } }
const PEXUSED = WD + '/new/imagebank/_picture_pexels_used.json';
function usedPex() { try { return new Set(JSON.parse(fs.readFileSync(PEXUSED, 'utf8'))); } catch (e) { return new Set(); } }
function addUsedPex(ids) { try { const s = usedPex(); ids.forEach(i => i && s.add(i)); fs.writeFileSync(PEXUSED, JSON.stringify(Array.from(s))); } catch (e) {} }
const PEXLIB = WD + '/assets/qa/_pexels_stored';
function packRefs() { try { return fs.readdirSync(PEXLIB).filter(f => /\.(jpe?g|png)$/i.test(f) && f.indexOf('_kmm_') !== 0); } catch (e) { return []; } }
function readPack(f) { try { return fs.readFileSync(PEXLIB + '/' + String(f).replace(/\.\.|[\/\\]/g, '')); } catch (e) { return null; } }
function log(m) { try { fs.appendFileSync(WD + '/_page_finisher.out.log', new Date().toISOString() + ' [' + PILLAR + '/' + BOX_I + '] ' + m + '\n'); } catch (e) {} }
const sleep = ms => new Promise(r => setTimeout(r, ms));
// a step that fails for a NETWORK reason (not a real content problem) → defer the page, never mark it done.
function isNetErr(e) { return /fetch failed|entry not found|ENOTFOUND|ETIMEDOUT|EAI_AGAIN|ECONNRESET|socket hang|network|timeout|503|502|429/i.test(String((e && e.message) || e)); }
// retry a blob op through flaky-connection blips (only network errors; real errors throw immediately)
async function retryNet(fn, tries) { tries = tries || 5; for (let i = 0; i < tries; i++) { try { return await fn(); } catch (e) { if (i === tries - 1 || !isNetErr(e)) throw e; await sleep(1200 * (i + 1)); } } }
const deferUntil = new Map();   // id → ts; skip a page for a cooldown after a network-deferred attempt
const failCount = new Map();     // id → times it failed to WRITE to gate; after a few, skip it so the crew advances
function noteFail(id) { const c = (failCount.get(id) || 0) + 1; failCount.set(id, c); return c; }
// 📧 THE ONLY EMAIL (owner 2026-07-21): one message when a Whole Crew finishes ALL steps on ONE answer page.
// Bypasses the global _emails_off / _entry_done_email_off flags on purpose; honors its OWN _crew_email_off.flag.
function resendKey() { let k = process.env.RESEND_API_KEY || process.env.resendapikey; if (k) return k; try { for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*(resendapikey|RESEND_API_KEY)\s*=\s*(.*)\s*$/i); if (m) return m[2].replace(/^["']|["']$/g, ''); } } catch (e) {} return ''; }
// persistent queue so a completed page's email is NEVER lost to a flaky connection — retried until it lands.
// PER-CREW file (BOX_I) so 3 crews never race/duplicate/corrupt a shared queue — each drains only its own.
const PENDING_EMAIL = WD + '/_crew_email_pending_' + BOX_I + '.json';
function loadPending() { try { return JSON.parse(fs.readFileSync(PENDING_EMAIL, 'utf8')) || []; } catch (e) { return []; } }
function savePending(a) { try { fs.writeFileSync(PENDING_EMAIL, JSON.stringify(a)); } catch (e) {} }
async function sendOneEmail(rec) {   // returns true only on a confirmed send (or if silenced)
  if (fs.existsSync(WD + '/_crew_email_off.flag')) return true;
  const k = resendKey(); if (!k) { log('email SKIP ' + rec.id + ' — no resend key'); return false; }
  const id = rec.id, q = rec.q || '', bodyN = rec.bodyN || 0, mermN = rec.mermN || 0;
  const isNew = !!rec.isNew;
  const miss = !!rec.miss;   // <12 gate miss email
  const score = (rec.score != null && rec.score !== '') ? Number(rec.score) : null;
  const rating = (score != null && !isNaN(score)) ? (score + '/13') : '?/13';
  const url = 'https://pulserevops.com/knowledge/' + id;
  if (miss) {
    const subject = '📉 MISS ' + rating + ' — ' + id + ' (didn\'t hit 12)';
    const html = '<div style="font-family:system-ui,Arial;font-size:16px;line-height:1.5;color:#111">'
      + '<div style="display:inline-block;background:#b3121f;color:#fff;font-size:12px;font-weight:800;letter-spacing:.6px;padding:4px 10px;border-radius:999px;margin:0 0 10px">📉 DIDN\'T HIT 12</div>'
      + '<h2 style="margin:0 0 8px;color:#b3121f">Didn\'t hit 12 — ' + rating + '</h2>'
      + '<p style="margin:0 0 6px"><b>' + id + '</b>' + (q ? ' — ' + String(q).slice(0, 160) : '') + '</p>'
      + '<p style="margin:0 0 6px;color:#444">Gate score: <b style="color:#b3121f;font-size:20px">' + rating + '</b> (need ≥12). Sent to Less than 12/13 pile · pillar ' + PILLAR + '</p>'
      + '<p style="margin:12px 0"><a href="' + url + '" style="background:#555;color:#fff;text-decoration:none;padding:11px 18px;border-radius:8px;font-weight:800;display:inline-block">Open ' + id + ' →</a></p>'
      + '<p style="font-size:12px;color:#888;margin-top:16px">Create _crew_email_off.flag to silence these.</p></div>';
    try {
      const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + k, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: 'PULSE Crew <onboarding@resend.dev>', to: ['koryjordanwhite@gmail.com'], subject, html }), signal: AbortSignal.timeout(12000) });
      if (r.ok) { log('email SENT miss ' + id + ' ' + rating); return true; }
      const t = await r.text().catch(() => ''); log('email FAIL ' + id + ' ' + r.status + ' ' + t.slice(0, 120)); return false;
    } catch (e) { log('email ERR ' + id + ' ' + ((e && e.message) || e)); return false; }
  }
  const label = isNew ? '🆕 NEW' : '♻️ REVISED';
  const subject = label + ' ' + rating + ' — ' + id;
  const badge = '<div style="display:inline-block;background:' + (isNew ? '#0d7a3f' : '#555') + ';color:#fff;font-size:12px;font-weight:800;letter-spacing:.6px;padding:4px 10px;border-radius:999px;margin:0 0 10px">'
    + (isNew ? '🆕 NEW' : '♻️ REVISED') + ' · ' + rating + '</div>';
  const html = '<div style="font-family:system-ui,Arial;font-size:16px;line-height:1.5;color:#111">'
    + badge
    + '<h2 style="margin:0 0 8px;color:' + (isNew ? '#0d7a3f' : '#b3121f') + '">' + (isNew ? '🆕 New page published' : '♻️ Revised page published') + ' — ' + rating + '</h2>'
    + '<p style="margin:0 0 6px"><b>' + id + '</b>' + (q ? ' — ' + String(q).slice(0, 160) : '') + '</p>'
    + '<p style="margin:0 0 6px;color:#444">Gate score: <b style="color:#0d7a3f;font-size:20px">' + rating + '</b></p>'
    + '<p style="margin:0 0 6px;color:#444">write → face card → hero → ' + bodyN + ' body image' + (bodyN === 1 ? '' : 's') + ' → 🧜 ' + mermN + ' mermaid · pillar ' + PILLAR + '</p>'
    + '<p style="margin:12px 0"><a href="' + url + '" style="background:#b3121f;color:#fff;text-decoration:none;padding:11px 18px;border-radius:8px;font-weight:800;display:inline-block">Open ' + id + ' →</a></p>'
    + '<p style="font-size:12px;color:#888;margin-top:16px">Create _crew_email_off.flag to silence these.</p></div>';
  try {
    const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + k, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: 'PULSE Crew <onboarding@resend.dev>', to: ['koryjordanwhite@gmail.com'], subject, html }), signal: AbortSignal.timeout(12000) });
    if (r.ok) { log('email SENT ' + id + ' ' + rating); return true; }
    const t = await r.text().catch(() => ''); log('email FAIL ' + id + ' ' + r.status + ' ' + t.slice(0, 120)); return false;
  } catch (e) { log('email ERR ' + id + ' ' + ((e && e.message) || e)); return false; }
}
// try now (4 attempts w/ backoff); if the connection is down, QUEUE it so it goes out later — never dropped.
async function emailCrewDone(id, q, coverN, bodyN, mermN, isNew, score) {
  const rec = { id, q: String(q || '').slice(0, 160), bodyN: bodyN || 0, mermN: mermN || 0, isNew: !!isNew, score: (score != null ? score : null), ts: Date.now() };
  for (let a = 0; a < 4; a++) { if (await sendOneEmail(rec)) return; await sleep(1500 * (a + 1)); }
  const p = loadPending(); if (!p.find(x => x.id === id && !x.miss)) { p.push(rec); savePending(p); }
  log('email QUEUED ' + id + ' ' + ((score != null) ? (score + '/13') : '') + ' — will retry until it lands');
}
async function emailCrewMiss(id, q, score) {
  const rec = { id, q: String(q || '').slice(0, 160), miss: true, score: (score != null ? score : 0), ts: Date.now() };
  for (let a = 0; a < 4; a++) { if (await sendOneEmail(rec)) return; await sleep(1500 * (a + 1)); }
  const p = loadPending(); if (!p.find(x => x.id === id && x.miss)) { p.push(rec); savePending(p); }
  log('email QUEUED miss ' + id + ' ' + ((score != null) ? (score + '/13') : '') + ' — will retry until it lands');
}
// drains the queue whenever the connection is healthy; called each loop tick (cheap when empty).
let flushing = false;
async function flushPendingEmails() {
  if (flushing) return; flushing = true;
  try { const p = loadPending(); if (p.length) { const keep = []; for (const rec of p) { if (!(await sendOneEmail(rec))) keep.push(rec); } if (keep.length !== p.length) savePending(keep); } } catch (e) {} finally { flushing = false; }
}

function pexels(q) { return new Promise(res => { if (!PEXELS) return res(null); const req = https.get('https://api.pexels.com/v1/search?per_page=80&orientation=landscape&query=' + encodeURIComponent(q || 'business'), { headers: { Authorization: PEXELS }, timeout: 7000 }, r => { let s = ''; r.on('data', d => s += d); r.on('end', () => { try { res(JSON.parse(s)); } catch (e) { res(null); } }); }); req.on('error', () => res(null)); req.on('timeout', () => { try { req.destroy(); } catch (e) {} res(null); }); }); }
function dl(url) { return new Promise(res => { const req = https.get(url, { timeout: 12000 }, r => { if (r.statusCode !== 200) { r.resume(); return res(null); } const c = []; r.on('data', d => c.push(d)); r.on('end', () => res(Buffer.concat(c))); }); req.on('error', () => res(null)); req.on('timeout', () => { try { req.destroy(); } catch (e) {} res(null); }); }); }
async function fmt(buf) { if (!sharp) return buf; const W = 1200, H = 675; try { const bg = await sharp(buf).resize(W, H, { fit: 'cover', position: sharp.strategy.attention }).blur(26).modulate({ brightness: 0.55 }).toBuffer(); const fg = await sharp(buf).resize(W, H, { fit: 'inside' }).toBuffer(); return await sharp(bg).composite([{ input: fg, gravity: 'center' }]).jpeg({ quality: 86 }).toBuffer(); } catch (e) { return buf; } }
const STOP = new Set('the a an and or for you your what how when why who are can does did best top key guide list most common know before about with from that this into of to in on is it revops business company 2024 2025 2026 2027 2028'.split(' '));
function deriveQuery(t) { return String(t || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(w => w.length > 3 && !STOP.has(w)).slice(0, 3).join(' ') || 'business office'; }
// fallback that "goes with everything" (owner rule 2026-07-21): buildings / architecture / artwork / art
const FALLBACK = ['buildings', 'architecture', 'modern architecture', 'artwork', 'abstract art', 'fine art', 'city skyline'];
const KWSTOP = new Set('the a an and or for you your what how when why who are can could would should will hire hiring fractional in of to on is it at with from best top 2024 2025 2026 2027 2028 2029 revops company business'.split(' '));
function titleKeywords(t) { return String(t || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(w => w.length > 3 && !KWSTOP.has(w)); }
// ANTI-DRIFT: the written body must actually be ABOUT the question — its distinctive words (esp. the place/subject)
// must appear. Catches the writer wandering off-task or reusing another page's body. Requires the LAST distinctive
// token (usually the city/subject) present + ≥50% of the question's key words.
function onTopic(question, body) {
  const key = titleKeywords(question); if (key.length < 2) return true;
  const bl = String(body || '').toLowerCase();
  const hit = key.filter(w => bl.indexOf(w) >= 0).length;
  const subject = key[key.length - 1];                       // the distinctive tail token (city/subject)
  return (bl.indexOf(subject) >= 0) && (hit / key.length >= 0.5);
}
// 🔍 AUDITOR — dup-check: fingerprint each page (top significant words) and refuse to publish one that is ≥30%
// similar to any page this pillar's crew already finished. Fingerprints append to a per-pillar JSONL (fast).
const DUP_THRESH = 0.30;
let FPF = WD + '/new/imagebank/_finisher_' + PILLAR + '_fp.jsonl';
let FP_CACHE = null;
function loadFP() { if (FP_CACHE) return FP_CACHE; FP_CACHE = []; try { for (const l of fs.readFileSync(FPF, 'utf8').split('\n')) { if (!l.trim()) continue; try { const o = JSON.parse(l); FP_CACHE.push({ id: o.id, fp: new Set(o.fp) }); } catch (e) {} } } catch (e) {} return FP_CACHE; }
function pageFP(body) { const w = String(body || '').toLowerCase().replace(/```[\s\S]*?```/g, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(x => x.length > 4); const f = {}; for (const x of w) f[x] = (f[x] || 0) + 1; return new Set(Object.keys(f).sort((a, b) => f[b] - f[a]).slice(0, 60)); }
function jac(a, b) { let i = 0; for (const w of a) if (b.has(w)) i++; return i / (a.size + b.size - i || 1); }
function dupOf(fp) { const c = loadFP(); let best = 0, id = null; for (const e of c) { const s = jac(fp, e.fp); if (s > best) { best = s; id = e.id; if (best >= 0.6) break; } } return { sim: best, of: id }; }
function addFP(id, fp) { loadFP().push({ id, fp }); try { fs.appendFileSync(FPF, JSON.stringify({ id, fp: [...fp] }) + '\n'); } catch (e) {} }

// pick ONE image: best keyword match first, then buildings/architecture/art fallback, then local packs — never
// a globally-used dupe (unless everything fresh is exhausted) and never the same image twice on a page.
async function pickImage(query, seen, title) {
  const used = usedPex();
  const kw = titleKeywords(title || query);
  const psrc = p => p.src.large2x || p.src.original || p.src.large;
  const pidOf = src => (String(src).match(/\/photos\/(\d+)\//) || [])[1] || '';
  // 1. TOPIC MATCH — score each Pexels result by keyword overlap of its alt-text with the title, best first
  const topic = [];
  const r = await pexels(query);
  // 🔒 RELEVANCE GATE — same rules as the drip (owner 2026-07-29: "same image standards ... front end").
  // nouns = the title's own words PLUS the pillar's visual vocabulary, so "does this photo belong on
  // THIS page" is judged the same way on both machines.
  const nouns = new Set(kw);
  for (const w of (STD.PILLAR_CONTEXT[PILLAR] || [])) String(w).split(/\s+/).forEach(x => nouns.add(x.toLowerCase()));
  let vetoDrop = 0, ambigDrop = 0;
  ((r && r.photos) || []).forEach(p => {
    const src = psrc(p); const alt = String(p.alt || '').toLowerCase();
    // per-pillar veto list (_pillar_image_notes.json, live-editable) — hard reject
    if (STD.vetoed(alt, PILLAR)) { vetoDrop++; return; }
    // an ambiguous-only match ("drill", "training", "team") is NOT evidence the photo belongs —
    // this is the check that stops soccer photos landing on a sales page.
    if (alt && !STD.altOverlapOk(alt, nouns)) { ambigDrop++; return; }
    const score = kw.reduce((s, w) => s + (alt.indexOf(w) >= 0 ? 1 : 0), 0);
    topic.push({ src, isPack: false, pid: pidOf(src), score });
  });
  if (vetoDrop || ambigDrop) log('   🔒 image filter — ' + vetoDrop + ' vetoed · ' + ambigDrop + ' ambiguous-only · ' + topic.length + ' kept');
  topic.sort((a, b) => b.score - a.score);   // strongest keyword match leads
  // 2. FALLBACK — buildings / architecture / artwork (goes with everything) when the topic match is thin
  const fbList = [];
  const r2 = await pexels(FALLBACK[Math.floor(Math.random() * FALLBACK.length)]);
  ((r2 && r2.photos) || []).forEach(p => { const src = psrc(p); fbList.push({ src, isPack: false, pid: pidOf(src), score: 0 }); });
  // 3. LOCAL PACKS — 7900+ pool, random FRESH window (network-free catch-all, no repeats)
  const packs = []; const packPool = packRefs().filter(f => !used.has(f));
  for (let i = 0; i < 80 && packPool.length; i++) { const f = packPool.splice(Math.floor(Math.random() * packPool.length), 1)[0]; packs.push({ src: f, isPack: true, pid: f, score: 0 }); }
  const order = [...topic, ...fbList, ...packs];
  // PASS 0: fresh (never-used) only. PASS 1: allow reuse ONLY when everything fresh is gone.
  for (let pass = 0; pass < 2; pass++) {
    for (const c of order) {
      if (pass === 0 && c.pid && used.has(c.pid)) continue;
      // 🔒 SHARED IMAGE STANDARDS — the drip's quality gates, now applied on the FRONT END so a page
      // is right the first time instead of waiting for the drip to come back and redo it:
      //   · rejects blank / white / blown-out frames (the "white box on a dark layout" bug)
      //   · edge test kills product-on-white shots with pale flat margins
      //   · auto-focus crop (sharp attention) so the subject fills the frame
      //   · never upscales — HD comes from a bigger source, not from stretching
      // Runs BEFORE fmt() so a rejected candidate never reaches the page; fmt() then standardises
      // the final frame so the site's existing look is unchanged.
      const graded = c.isPack
        ? await STD.fetchImage({ local: true, file: c.src })
        : await STD.fetchImage(c.src);
      if (!graded) continue;                    // failed a standard → next candidate
      const buf = await fmt(graded);
      const h = crypto.createHash('md5').update(buf).digest('hex');
      if (seen.has(h)) continue;   // never the same image twice on one page
      seen.add(h);
      return { buf, pid: c.pid };
    }
  }
  return null;
}
const MERM_DIR = /^(flowchart|graph|sequenceDiagram|classDiagram|stateDiagram(-v2)?|erDiagram|gantt|pie|journey|mindmap|timeline|quadrantChart|gitGraph|xychart-beta|C4Context)\b/;
function sanitizeMermaidBlock(code) {
  let lines = String(code || '').replace(/\r/g, '').split('\n').map(l => l.replace(/[ \t]+$/g, ''));
  while (lines.length && !lines[0].trim()) lines.shift();
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
  if (!lines.length) return { code: '', valid: false };
  lines = lines.map(l => l.replace(/\*\*/g, '').replace(/`/g, '').replace(/^(\s*)[-*]\s+/, '$1'));   // strip md artifacts that break the parser
  if (!MERM_DIR.test(lines[0].trim())) lines.unshift('flowchart TD');                                 // no directive → default flowchart
  lines[0] = lines[0].replace(/^(\s*)graph\b/, '$1flowchart');                                        // graph → flowchart (both valid)
  lines = lines.map(l => l.replace(/\[([^\]\n|]*)\]/g, (m, txt) => {                                   // quote risky node labels: A[Cost (2027): x] → A["Cost (2027): x"]
    const t = txt.trim(); if (!t || /^".*"$/.test(t)) return m;
    return /[()#:;<>&%\/]/.test(t) ? '["' + t.replace(/["<>]/g, '') + '"]' : '[' + t + ']';
  }));
  const out = lines.join('\n'); const rest = out.slice(out.indexOf('\n') + 1);
  const valid = MERM_DIR.test(lines[0].trim()) && lines.length >= 2 && /(-->|---|==>|-\.->|\[|\(|:|\bparticipant\b)/.test(rest);
  return { code: out, valid };
}
function headingsOf(body) {
  const hs = [];
  for (const m of String(body).matchAll(/^##\s+(.+?)\s*$/gm)) { const h = m[1].replace(/[#*`"]/g, '').trim(); if (h && !/^direct answer/i.test(h) && !/^(sources|related|faq|frequently|people also|references)/i.test(h)) hs.push(h); }
  return hs;
}
// build a GUARANTEED-valid mermaid: simple ids (S,N0,N1…), every label double-quoted (so parens/colons/
// symbols can never break the parser), canonical flowchart syntax. Two variants so the page's 2 diagrams differ.
function genMermaid(title, steps, variant) {
  const clean = x => String(x || '').replace(/["\n#`*\[\]{}()<>|]/g, '').replace(/\s+/g, ' ').trim().slice(0, 38);
  const t = clean(title) || 'Overview';
  let s = (steps && steps.length ? steps : ['Assess', 'Plan', 'Build', 'Measure', 'Improve']).map(clean).filter(Boolean).slice(0, 5);
  if (s.length < 2) s = ['Assess', 'Plan', 'Execute', 'Measure'];
  if (variant === 'hub') {   // hub-and-spoke, left-to-right
    let out = 'flowchart LR\n  C["' + t + '"]';
    s.forEach((x, i) => { out += '\n  C --> H' + i + '["' + x + '"]'; });
    return out;
  }
  let out = 'flowchart TD\n  S["' + t + '"]', prev = 'S';   // linear top-down
  s.forEach((x, i) => { out += '\n  ' + prev + ' --> N' + i + '["' + x + '"]'; prev = 'N' + i; });
  return out;
}
// DELETE-AND-READD (owner 2026-07-21): in-place repair let subtle syntax errors slip through, so we no longer
// trust any existing diagram. Rip out EVERY mermaid block and drop in 2 freshly generated, guaranteed-valid
// ones (linear + hub) derived from the page's own headings — below the Direct Answer, inside content sections.
function mermaidCleanup(body, title) {
  let src = String(body || '');
  const before = (src.match(/```mermaid/g) || []).length;
  // 1. DELETE every existing mermaid block (and any blank-line pileup left behind)
  src = src.replace(/```mermaid[ \t]*\r?\n[\s\S]*?```/g, '').replace(/\n{3,}/g, '\n\n');
  // 2. ADD exactly TWO fresh valid diagrams (content_gate MERMAID needs exactly 2 — one left pages stuck at 11–12)
  let added = 0;
  for (let guard = 0; added < 2 && guard < 6; guard++) {
    const heads = headingsOf(src);
    const contentH2 = [...src.matchAll(/^##\s+.+$/gm)].filter(x => !/direct answer/i.test(x[0]));
    let target = null;                                        // prefer a content section that has no mermaid yet
    for (const h of contentH2) { const start = h.index + h[0].length; const nx = src.indexOf('\n## ', start); if (!/```mermaid/.test(src.slice(start, nx < 0 ? src.length : nx))) { target = h; break; } }
    if (!target) target = contentH2[contentH2.length - 1] || null;
    const steps = added === 0 ? heads.slice(0, 4) : heads.slice(Math.max(0, heads.length - 4));
    const gen = '\n\n```mermaid\n' + genMermaid(title, steps.length ? steps : heads, added === 0 ? 'linear' : 'hub') + '\n```\n';
    if (target && target.index != null) { const pos = target.index + target[0].length; src = src.slice(0, pos) + gen + src.slice(pos); }
    else src = src.replace(/\s*$/, '') + gen;
    added++;
  }
  const count = (src.match(/```mermaid/g) || []).length;
  return { body: src, changed: true, fixed: before, added, count };   // always rewrites → clean diagrams every page
}

let CUR = '', DONE = 0, WROTE = 0, STAGE = 'idle';   // STAGE drives the monitor's red→yellow→green stage bar
// STATUS FILE (owner 2026-07-22): the crew's own HTTP server is blocked while it writes, so the box iframe/status
// can't be read mid-write. Instead we write the stage to a tiny file SYNCHRONOUSLY the instant it changes (before any
// blocking work) — the Manager (always responsive) reads these files to render the boxes + stage bars reliably.
const STATUSF = WD + '/new/imagebank/_crew_' + PORT + '.json';
let COOLDOWN_UNTIL = 0;   // epoch ms when the current cooldown ends (0 = not cooling down) → drives the countdown in the UI
let FLIP = '';            // non-empty while an over-the-hump engine switch is happening → drives the flip animation in the UI
// 🏁 WIN/LOSS for THIS RUN: every page that came up short of the gate (e.g. 11/13) and got the full opposite-engine
// RESTART is counted — WIN if the restart pushed it to 12+ on-topic (published), LOSS if it still missed (Not-Finished).
// Pages that passed on the first write are neither (they never needed rescuing). Surfaced live in the hub.
let SAVE_WIN = 0, SAVE_LOSS = 0;
let LAST_GATE = '';   // e.g. tl1234 12/13 ✓ — hub top bar
// 🏁 PAUSE-ON-COMPLETE (owner 2026-07-28: "once the pillar is complete pause"). A pinned crew that has finished
// its pillar stops picking work instead of re-scanning the index forever. Declared here (above setStage) because
// the status file carries the paused flag to the hub. It keeps a slow watch so a fresh seed / requeue / reset
// wakes it back up on its own — paused is not dead.
var PAUSED = false, PAUSE_WHY = '';
const PAUSE_RECHECK_MS = Math.max(15000, parseInt(process.env.PAUSE_RECHECK_MS || '120000', 10));
function setStage(s) { STAGE = s; const _sp = liveStride(); try { fs.writeFileSync(STATUSF, JSON.stringify({ port: PORT, box: BOX_I, pillar: PILLAR, engine: (typeof ENGINE !== 'undefined' ? ENGINE : ''), stage: STAGE, current: CUR, done: DONE, wrote: WROTE, remaining: (typeof REMAIN !== 'undefined' ? REMAIN : 0), total: (typeof TOTAL !== 'undefined' ? TOTAL : 0), cooldownUntil: COOLDOWN_UNTIL, flip: FLIP, win: SAVE_WIN, loss: SAVE_LOSS, lastGate: LAST_GATE, paused: PAUSED, pauseWhy: PAUSE_WHY, newqa: NEWQA, splitI: _sp.i, splitN: _sp.n, ts: Date.now() })); } catch (e) {} }
// engine: 'ccds' (CC first, DS when CC can't reach the bar) | 'claude' | 'deepseek' | 'cursor'
// | 'alternate' (flip DS↔CC per page). Claude unbenched 2026-07-28 → CC + DS are the writers.
const ENGINE_MODE = (process.env.ENGINE_MODE || process.env.WRITER_ENGINE || 'ccds').toLowerCase();
function engLabel(e) {
  e = String(e || '').toLowerCase();
  if (e === 'ccds') return claudeUnbenched() ? 'CC+DS' : 'DeepSeek';
  if (e === 'claude') return claudeUnbenched() ? 'Claude Code' : 'CC(benched)';
  if (e === 'cursor') return 'Cursor';
  if (e === 'alternate') return 'Alternate';
  return 'DeepSeek';
}
let ENGINE = engLabel((ENGINE_MODE === 'claude' && !claudeUnbenched()) ? 'deepseek' : ENGINE_MODE);
function pickEngine() {   // set the forced writer for THIS page (per-page flip when alternating)
  // ⭐ PREMIUM (owner 2026-07-28) — auto-select the writer and go through ALL of them to reach 12/13. The page
  // opens on the cheapest engine that can do the job; the ladder below then escalates through Claude Code and
  // Cursor, broadening scope, until the gate clears. Nothing to choose per page — the ladder decides.
  if (ENGINE_MODE === 'premium') {
    process.env.WRITER_ENGINE = claudeUnbenched() ? 'ccds' : 'deepseek';
    ENGINE = '⭐ Premium (all writers)';
  } else if (ENGINE_MODE === 'ccds') {
    // 🤖 CC + DS: Claude Code writes, DeepSeek is the fallback inside runWriter when CC fails
    // or cannot reach the bar. One env value drives both (see improve_content.runWriter).
    process.env.WRITER_ENGINE = claudeUnbenched() ? 'ccds' : 'deepseek';
    ENGINE = engLabel('ccds');
  } else if (ENGINE_MODE === 'alternate') {
    // owner 2026-07-28: alternate now flips DS ↔ CC (was DS ↔ Cursor).
    const e = (DONE % 2 === 0) ? 'deepseek' : (claudeUnbenched() ? 'claude' : 'cursor');
    process.env.WRITER_ENGINE = e;
    ENGINE = engLabel(e);
  } else if (ENGINE_MODE === 'cursor') {
    process.env.WRITER_ENGINE = 'cursor';
    ENGINE = 'Cursor';
  } else if (ENGINE_MODE === 'claude' && claudeUnbenched()) {
    process.env.WRITER_ENGINE = 'claude';
    ENGINE = 'Claude Code';
  } else {
    process.env.WRITER_ENGINE = 'deepseek';
    ENGINE = 'DeepSeek';
  }
}
async function finishPage(id, blob) {
  CUR = id; pickEngine(); setStage('write');
  const title = blob.question || blob.h1 || '';
  // 🆕 captured BEFORE the post-publish blob re-read: was this a brand-new pipeline-generated question (vs a revision
  // of an existing page)? Drives the "NEW PIPELINE" labelling in the completion email.
  const isNewPipeline = !!(blob && blob.pipeline_new);
  if (DRY) { const w = String((blob && blob.answer) || '').split(/\s+/).filter(Boolean).length; const bn = Math.max(2, Math.min(6, Math.round(w / 450))); const mc = mermaidCleanup(String((blob && blob.answer) || ''), title); log(id + ' [DRY] would: write(' + (blob.gate_score || 0) + '/13) → cover → body 1-' + bn + ' → 🧜 mermaid(fix ' + mc.fixed + '/add ' + mc.added + '→' + mc.count + ')  · ' + REMAIN + ' left in ' + PILLAR); console.log('[DRY] picked ' + id + ' — ' + w + 'w → cover + ' + bn + ' body → mermaid: fix ' + mc.fixed + ' add ' + mc.added + ' = ' + mc.count + ' · ' + REMAIN + ' left'); releaseClaim(id); process.exit(0); }
  // 1. WRITE to 12-13/13 (only if not already there). Owner: 12 OR 13 both publish.
  // PRESSURE TEST: a page that isn't already at 12+ must be WRITTEN to 12+ or it does NOT publish (deferred below).
  // 🔁 FORCE REWRITE (owner 2026-07-28: "even if they are approved based on their 12 out of 13, every single
  // URL answer has to go through the actual rewriting and fixing — it doesn't just get pushed through, it
  // actually gets redone"). Normally a page already at the gate skips the writer entirely, which is how a run
  // can "finish" hundreds of pages without rewriting a single one. FORCE_REWRITE=1 removes that shortcut: the
  // ladder runs on every page regardless of its stored score.
  // 🏆 TOP-10 CLASSIFY BY TITLE ONLY (owner 2026-07-29: "if it says in the title top 10 blah blah blah you
  // know it's a top 10 — just write the f*** over it the way it needs to be").
  //
  // This crew NEVER passed a template, so buildPromptFor() defaulted to 'qa' on EVERY page — including every
  // Top-10. That is why ranked pages came out as essays ("Benchmarks across the ten cards" as one heading
  // instead of ten ranked items). The top10 branch of the writer existed and was simply never reached.
  //
  // Classification is on the TITLE ALONE, deliberately. The old router required
  // titleSuggestsRankingList(title) && isRankingListBody(body) — so a Top-10 already written as an essay
  // could never be identified, because the malformed body was the evidence used to decide whether to fix
  // the malformed body. Self-perpetuating. The title states the intent; the body is what we are replacing.
  const IS_TOP10 = titleSuggestsRankingList(title);
  if (IS_TOP10) log(id + ' 🏆 TOP-10 by title — writing the ranked golden template (#1..#10), overwriting whatever is there');

  let writeOk = FORCE_REWRITE ? false : ((blob.gate_score || 0) >= GATE_MIN);
  // A ranked page whose body has no ranks is BROKEN no matter what its stored score says — the score comes
  // from the general 13-point gate, which a well-written essay passes. Re-open it and write it as a Top-10.
  if (writeOk && IS_TOP10) {
    const ranks = (String(blob.answer || '').match(/^##\s+\d+\.\s/gm) || []).length;
    if (ranks < 3) {
      writeOk = false;
      log(id + ' 🏆 stored ' + (blob.gate_score || 0) + '/13 but ' + ranks + ' ranked sections — a Top-10 written as an essay. Rewriting as ranked.');
    }
  }
  if (FORCE_REWRITE) log(id + ' 🔁 FORCE REWRITE — stored ' + (blob.gate_score || 0) + '/13 ignored, running the full writer ladder');
  // 🆕 THIN NEW PAGE = NOT DONE. A pipeline seed that only ever got the cheap pass carries gate_score 12 with a
  // stub body, so this crew used to skip the writer entirely and go straight to images. The one point it dropped
  // IS the word count — so re-open it and write it properly.
  const newWords = wcount(blob.answer);
  if (writeOk && isNewPipeline && NEW_MIN_WORDS && newWords < NEW_MIN_WORDS) {
    writeOk = false;
    log(id + ' 🆕 thin new page — ' + newWords + 'w at ' + (blob.gate_score || 0) + '/13 (need ≥' + NEW_MIN_WORDS + 'w) → rewriting in full');
  }
  let gateAlreadyOk = writeOk;
  let pageGateScore = writeOk ? (blob.gate_score || GATE_MIN) : null;
  let contentFail = false;   // true ONLY when the writer produced a page that failed the gate/topic/dup (a real
                             // content problem). Network/writer-down failures are NOT content fails → never skipped.
  if (DO_WRITE && rebuildToGate && !writeOk) {
    // HARD RULE (owner 2026-07-27): do NOT process face/body/mermaid until gate ≥12 (12 or higher).
    // Ladder per round: surgical → DS×3 → Cursor×3 → DS×2 → Cursor×4.
    // If still short → START OVER (full ladder again) up to GATE_RESTARTS times.
    const RESTARTS = Math.max(1, parseInt(process.env.GATE_RESTARTS || '4', 10));
    const primeEng = (process.env.WRITER_ENGINE || 'deepseek').toLowerCase();
    const setEng = e => { process.env.WRITER_ENGINE = e; ENGINE = engLabel(e); };
    const better = (a, b) => (a && a.body && (a.after || 0) >= ((b && b.after) || -1));
    const srcBody = blob.answer || '';
    // 🆕 A brand-new question (pipeline seed, or simply no body yet) must clear the word floor TOO — otherwise
    // the ladder's first rung (surgical $0 on an empty body = a padded skeleton) can satisfy `r.after >= 12`
    // and the crew publishes a stub. Revisions keep the plain gate bar exactly as before.
    const needWords = (isNewPipeline || wcount(srcBody) < 300) ? NEW_MIN_WORDS : 0;
    const hit12 = (r, topic) => !!(r && r.body && (r.after >= GATE_MIN) && topic && wcount(r.body) >= needWords);
    if (needWords) log(id + ' 🆕 NEW Q&A — publish bar is ≥' + GATE_MIN + '/13 AND ≥' + needWords + ' words');
    try {
      let r = null, topic = false, rescued = false, stuckAt = 0;

      for (let round = 1; round <= RESTARTS && !hit12(r, topic); round++) {
        if (round > 1) {
          log(id + ' 🔄 START OVER round ' + round + '/' + RESTARTS + ' · last best ' + ((r && r.after) || 0) + '/13 (need ≥' + GATE_MIN + ')');
          FLIP = '🔄 restart ' + round + '/' + RESTARTS;
          setStage('write');
          await sleep(800);
        }

        // (0) surgical $0
        FLIP = '💸 surgical $0 · r' + round;
        setStage('write');
        const sx = rebuildToGate(title, srcBody, { maxAttempts: 0, id, template: IS_TOP10 ? 'top10' : 'qa' });
        const stx = sx && sx.body && onTopic(title, sx.body);
        if (better(sx, r)) { r = sx; topic = stx; }
        // 🔁 Under FORCE_REWRITE the $0 surgical rung may NOT end the page. Mechanical patching is exactly the
        // "pushed through without being redone" path the owner is trying to eliminate — so keep its result as a
        // floor to beat, but always continue on to a real writer.
        if (!FORCE_REWRITE && hit12(r, topic)) break;

        // 🧗 FULL LADDER — EVERY writer, broadening as it climbs (owner 2026-07-28: "broaden scope plus bring in
        // cc cursor ds etc to push to 12/13"). It used to be DS → Cursor → DS → Cursor, which meant Claude Code
        // never touched a stuck page even now that it's unbenched, and every Cursor rung was a guaranteed no-op
        // because CURSOR_API_KEY has never been set — two of the four rescue rungs did literally nothing.
        //
        // Now: cheap engine first, then alternate models so a page that one writer can't shape gets a genuinely
        // different attempt rather than the same one again. Scope broadens from rung 2 on (and from rung 1 on a
        // restart round, since a restart already proves tight scope isn't working).
        //
        // Unavailable engines are SKIPPED, not attempted: Claude only when unbenched (Max-plan CLI, never metered
        // API — see runClaude), Cursor only when CURSOR_API_KEY exists. A skipped rung is logged so a missing key
        // shows up as a line in the log instead of a silent gap in the ladder.
        const RUNGS = [
          { eng: 'deepseek', tries: 3, broaden: false, tag: '💸 DeepSeek×3' },
          { eng: 'claude',   tries: 2, broaden: true,  tag: '🛟 Claude Code×2 · broaden' },
          { eng: 'cursor',   tries: 3, broaden: true,  tag: '🛟 Cursor×3 · broaden' },
          { eng: 'deepseek', tries: 2, broaden: true,  tag: '🛟 DeepSeek×2 · broaden' },
          { eng: 'claude',   tries: 3, broaden: true,  tag: '♻️ FULL Claude Code×3 · broaden' },
          { eng: 'cursor',   tries: 4, broaden: true,  tag: '♻️ FULL Cursor×4 · broaden' },
        ];
        const available = e => e === 'claude' ? claudeUnbenched()
                             : e === 'cursor' ? !!(process.env.CURSOR_API_KEY || '').trim()
                             : true;
        // ⭐ PREMIUM vs the single-engine modes. Premium is the whole ladder — every writer, broadening as it
        // climbs. The other modes keep the ladder inside the engine family the operator picked, so choosing
        // "DeepSeek only" still means DeepSeek only; it just gets its retries in the same broadening shape.
        const ALLOW = { premium: ['deepseek', 'claude', 'cursor'], ccds: ['deepseek', 'claude'], alternate: ['deepseek', 'claude'],
                        deepseek: ['deepseek'], claude: ['claude'], cursor: ['cursor'] }[ENGINE_MODE] || ['deepseek', 'claude'];
        for (const rung of RUNGS) {
          if (ALLOW.indexOf(rung.eng) < 0) continue;   // outside the selected engine family
          if (!available(rung.eng)) { log(id + ' ⏭ skip ' + rung.tag + ' — ' + (rung.eng === 'cursor' ? 'no CURSOR_API_KEY' : 'Claude benched')); continue; }
          // broaden on this rung, or on ANY rung once we're in a restart round
          const wide = rung.broaden || round > 1;
          const opts = Object.assign({ maxAttempts: rung.tries, id, template: IS_TOP10 ? 'top10' : 'qa' }, wide ? { stuck: true, broaden: true } : {},
            FORCE_REWRITE ? { force: true } : {});   // 🔁 force = never return "already at bar, no writer needed"
          if (wide && !rescued) { rescued = true; stuckAt = (r && r.after) || 0; log(id + ' stuck ' + stuckAt + '/13 — broadening scope + rotating writers (round ' + round + ')'); }
          setEng(rung.eng);
          FLIP = rung.tag + ' · r' + round;
          setStage('write');
          const out = rebuildToGate(title, srcBody, opts);
          const ok = out && out.body && onTopic(title, out.body);
          if (better(out, r)) { r = out; topic = ok; }
          log(id + ' ' + rung.tag + ' → ' + ((out && out.after) || 0) + '/13 · ' + wcount(out && out.body) + 'w'
            + ' (best ' + ((r && r.after) || 0) + '/13)' + ((out && out.err) ? ' · ' + String(out.err).slice(0, 60) : ''));
          if (hit12(r, topic)) break;
        }
      }

      setEng(primeEng); FLIP = '';
      if (hit12(r, topic)) {
        SAVE_WIN++;
        LAST_GATE = id + ' ' + r.after + '/13 ✓';
        const how = rescued ? ('rescue ' + stuckAt + '→' + r.after) : (r.surgicalOnly ? 'surgical' : 'write');
        log(id + ' 🏁 HIT ≥' + GATE_MIN + ' — ' + how + ' · ' + r.after + '/13 · run ' + SAVE_WIN + 'W-' + SAVE_LOSS + 'L');
        setStage('write');
        await retryNet(() => publishContentBody(id, r.body));
        clearBack(id);   // 🔁 it cleared the bar — off the back-of-the-line list
        WROTE++; writeOk = true; pageGateScore = r.after;
        log(id + ' WROTE ' + r.after + '/13 ✓' + (r.surgicalOnly ? ' (surgical-only · $0)' : (rescued ? ' (cursor-helped)' : '')));
        try { blob = await theStore().get('answers/' + id + '.json', { type: 'json', consistency: 'strong' }); } catch (e) {}
      } else if (r && r.body) {
        // HARD STOP — never process images / mermaid / DONE below 12
        SAVE_LOSS++;
        LAST_GATE = id + ' ' + ((r && r.after) || 0) + '/13 ✗';
        addUnder12Failed(id, r.after);
        deferUntil.set(id, Date.now() + 45 * 60 * 1000);
        // 🔁 back of THIS pillar's line — still in inventory, just last. Never marked done, never dropped.
        const tries = sendToBack(id, r.after);
        log(id + ' ⛔ BLOCKED process — best ' + r.after + '/13 · ' + wcount(r.body) + 'w after ' + RESTARTS + ' full restarts (need ≥' + GATE_MIN + (needWords ? ' and ≥' + needWords + 'w' : '') + ') · no images · 🔁 sent to the back of ' + PILLAR + ' (miss #' + tries + ') · run ' + SAVE_WIN + 'W-' + SAVE_LOSS + 'L');
        await emailCrewMiss(id, title, r.after);
        CUR = ''; setStage('idle'); return;
      }
    } catch (e) { log(id + ' write err ' + ((e && e.message) || e)); }
  }
  // Absolute gate: never place images until write cleared ≥12
  if (!writeOk) {
    deferUntil.set(id, Date.now() + 90000);
    failCount.delete(id);
    log(id + ' ⛔ SKIP process — not ≥' + GATE_MIN + ' yet (network/writer)');
    CUR = ''; setStage('idle'); return;
  }
  const words = String((blob && blob.answer) || '').replace(/[#>*`~\[\]()>-]/g, ' ').split(/\s+/).filter(Boolean).length;
  // 🏆 RANKED PAGE: ONE IMAGE PER RANKED ITEM, AND IT MUST BE *THAT* ITEM (owner 2026-07-29:
  // "1 through 10 have to be the exact image of the number that it's associated with").
  // Slot N is item N — so slot N's search query comes from ITEM N'S OWN NAME, never from the page
  // title. Using the page title for all ten slots is why a Top-10 got ten generic photos that had
  // nothing to do with the individual picks. Matches the IMAGE ACQUISITION CONTRACT in CLAUDE.md:
  // "TOP_LIST item images derive their query from each item's own text."
  const rankNames = (String((blob && blob.answer) || '').match(/^##\s+\d+\.\s+(.+)$/gm) || [])
    .map(h => h.replace(/^##\s+\d+\.\s+/, '')
               .replace(/[🏆💎]/g, '')
               .replace(/\bBEST\s+(?:OVERALL|VALUE)\b/gi, '')
               .replace(/[—–|]/g, ' ')
               .replace(/\s{2,}/g, ' ').trim())
    .filter(Boolean);
  const bodyN = rankNames.length >= 3
    ? Math.min(10, rankNames.length)                                 // one per rank, cover is separate
    : Math.max(2, Math.min(6, Math.round(words / 450)));             // essay: images by length
  if (rankNames.length >= 3) log(id + ' 🏆 ' + rankNames.length + ' ranked items → ' + bodyN + ' images, one per rank, each searched by its OWN name');
  const q = deriveQuery(title);
  const seen = new Set();
  claim(id);   // heartbeat: refresh our claim now that writing (the slow step) is done
  let netFail = false, coverOk = false, bodyOk = 0;
  setStage('lock');
  await acquireImgLock();   // 🚦 wait my turn — only one crew places images at a time (no connection hammering)
  setStage('face');
  // 2. FACE CARD / HERO cover
  const cov = await pickImage(q, seen, title);
  if (!cov) netFail = true;   // couldn't even fetch an image → network is down
  else { const OUT = WD + '/new/output/' + id; try { fs.mkdirSync(OUT, { recursive: true }); fs.writeFileSync(OUT + '/facecard.jpg', cov.buf); fs.writeFileSync(OUT + '/meta.json', JSON.stringify({ id, faceCard: 'facecard.jpg' })); await retryNet(() => publishFaceImageOnly(id)); addUsedPex([cov.pid]); coverOk = true; log(id + ' cover'); } catch (e) { if (isNetErr(e)) netFail = true; log(id + ' cover err ' + ((e && e.message) || e)); } }
  setStage('hero');   // face image doubles as the hero → mark hero done so its cell greens right after Face
  // 3. BODY 1..N
  for (let n = 1; n <= bodyN; n++) {
    setStage('body' + n);
    // Slot n illustrates ranked item n → search for that item by name, and score relevance against
    // the item, not the page. Falls back to the page query only on non-ranked pages.
    const itemName = rankNames[n - 1] || '';
    const slotQuery = itemName ? deriveQuery(itemName + ' ' + title) : q;
    const slotTitle = itemName ? (itemName + ' ' + title) : title;
    const img = await pickImage(slotQuery, seen, slotTitle);
    if (!img) { netFail = true; break; }
    try { await retryNet(() => publishBodySlot(id, img.buf, n)); addUsedPex([img.pid]); bodyOk++; log(id + ' body ' + n); } catch (e) { if (isNetErr(e)) netFail = true; log(id + ' body ' + n + ' err ' + ((e && e.message) || e)); }
    touchImgLock();   // keep my turn alive during the image burst
    await sleep(200);
  }
  // 4. 🧜 MERMAID CLEANUP — last crew member: fix broken diagrams, guarantee exactly 2 valid ones.
  setStage('mermaid');
  let mermN = 0;
  try {
    const fresh = await theStore().get('answers/' + id + '.json', { type: 'json', consistency: 'strong' });
    if (fresh && fresh.answer) {
      const mc = mermaidCleanup(fresh.answer, title); mermN = mc.count;
      if (mc.changed) { await retryNet(() => publishContentBody(id, mc.body)); log(id + ' 🧜 mermaid: fixed ' + mc.fixed + ' + added ' + mc.added + ' → ' + mc.count + ' valid'); }
      else log(id + ' 🧜 mermaid ok (' + mc.count + ' valid)');
    }
  } catch (e) { if (isNetErr(e)) netFail = true; log(id + ' mermaid err ' + ((e && e.message) || e)); }
  // GATE: only mark done + email when the page truly finished. Network trouble → defer & retry, never a
  // half-done page permanently marked done (a slow/flaky connection would otherwise gut the pillar).
  if (coverOk && !netFail && writeOk) {
    setStage('done');
    addDone(id); DONE++;
    if (gateAlreadyOk && DO_WRITE) { SAVE_WIN++; LAST_GATE = id + ' ' + (blob.gate_score || GATE_MIN) + '/13 ✓'; log(id + ' 🏁 HIT 12+ — already ≥12 · run ' + SAVE_WIN + 'W-' + SAVE_LOSS + 'L'); /* HIT counted at DONE */ }
    log(id + ' ✅ DONE — cover + ' + bodyOk + '/' + bodyN + ' body + ' + mermN + ' mermaid' + (DO_WRITE ? ' (+write)' : ''));
    await emailCrewDone(id, title, 1, bodyOk, mermN, isNewPipeline, pageGateScore != null ? pageGateScore : ((blob && blob.gate_score) != null ? blob.gate_score : GATE_MIN));   // 📧 every finished entry
  } else {
    deferUntil.set(id, Date.now() + 90000);   // retry once things settle — never publish a page that failed write or lost network
    log(id + ' ⏸ DEFERRED — ' + (!writeOk ? 'FAILED PRESSURE TEST (gate<12)' : 'network errors') + ' (cover ' + (coverOk ? 'ok' : 'FAIL') + ', body ' + bodyOk + '/' + bodyN + ') — NOT published');
  }
  releaseImgLock();   // 🚦 my turn done → next crew can place images
  CUR = ''; setStage('idle');
}

let rx = new RegExp('^' + PILLAR + '\\d');
// switch this crew to a new pillar at runtime (rotation) — recompute every pillar-derived path + reset caches
function setPillar(p) { PILLAR = p; DONEF = WD + '/new/imagebank/_finisher_' + p + '_done.json'; BACKF = WD + '/new/imagebank/_finisher_' + p + '_back.json'; CLAIMS = WD + '/new/imagebank/_wholecrew_' + p + '_claims.json'; FPF = WD + '/new/imagebank/_finisher_' + p + '_fp.jsonl'; rx = new RegExp('^' + p + '\\d'); FP_CACHE = null; }   // DONE is a run-total — do NOT reset on pillar switch (roam calls this every page)
// a ROTATE crew that finished its pillar claims the next un-taken small pillar (never repeats a done/taken one)
function advancePillar() {
  const r = loadRot(); r.done = r.done || []; r.taken = r.taken || {};
  if (r.done.indexOf(PILLAR) < 0) r.done.push(PILLAR);   // mark the one we just finished done
  delete r.taken[PILLAR];
  const mine = 'box' + BOX_I;
  const now = Date.now();
  for (const k of Object.keys(r.taken)) { if (now - (r.taken[k].ts || 0) > 900000) delete r.taken[k]; }   // release stale claims
  const takenSet = new Set(Object.values(r.taken).map(v => v.p));
  const next = SMALL_ROTATION.find(p => p !== PILLAR && r.done.indexOf(p) < 0 && !takenSet.has(p));
  if (!next) { saveRot(r); return false; }
  r.taken[mine] = { p: next, ts: now }; saveRot(r);
  log('🔁 pillar ' + PILLAR + ' COMPLETE → rotating to ' + next);
  setPillar(next);
  return true;
}
let running = false, REMAIN = 0, TOTAL = 0;
async function loop() {
  if (running) return; running = true;
  flushPendingEmails();   // drain any queued completion emails when the connection is healthy (fire-and-forget)
  try {
    // Guard against PARTIAL/empty index reads the flaky connection returns (a truncated read would falsely
    // look like "pillar complete"). The real index is ~36k entries — reject anything under 1000 and retry.
    let idx = null; for (let i = 0; i < 6; i++) { try { const r = await theStore().get('_index.json', { type: 'json', consistency: 'strong' }); if (r && r.entries && r.entries.length > 1000) { idx = r; break; } } catch (e) {} await sleep(700); }
    if (!idx) { log('index read thin/failed — waiting (network)'); running = false; return setTimeout(loop, 8000); }
    // 🆕 A roaming NEW-Q&A crew must hop to a pillar that actually HAS unwritten seeds — a plain random hop lands
    // on an empty pillar ~40 times out of 44 and the crew looks stuck doing nothing.
    // 🆕 SEED PREEMPTION — unwritten new questions outrank a crew's assigned pillar (owner 2026-07-29:
    // "anytime the multihub is running, automatically prioritize those first").
    //
    // Roam-only prioritisation was not enough: crews pinned to `bt` cleared bt's seeds and then had no way to
    // reach the 44 seeds sitting across 24 OTHER pillars — the oldest had waited 165 hours. A brand-new question
    // with no body is the highest-value page in the library and the cheapest to move, so it now preempts the
    // pillar assignment for as long as any seed exists anywhere. When the seeds run dry every crew returns to
    // its normal pillar automatically, so this costs nothing once the backlog is clear.
    // 🔒 PINNED MEANS PINNED (owner 2026-07-29: "i want to be able to do 1 pillar at a time if i want").
    // Preemption used to run unconditionally, so unchecking roam appeared to do nothing — crews still hopped
    // to seeded pillars. That was the right default while 44 seeds were rotting, but it took away the ability
    // to work a single pillar deliberately, which is a normal thing to want.
    //
    // Now: a ROAMING crew still chases seeds first (they are the highest-value pages and roamers have nowhere
    // particular to be). A PINNED crew stays on its pillar — it will still do that pillar's own seeds first,
    // because the seeds-to-the-front ordering below is per-pillar and applies either way.
    const seedPillar = ROAM ? pickSeededPillar(idx) : null;
    if (seedPillar) {
      if (seedPillar !== PILLAR) log('🆕 PREEMPT — leaving ' + PILLAR + ' for ' + seedPillar + ' (unwritten new questions)');
      setPillar(seedPillar);
    }
    // 🎲 ROAM HOP — seeded pillars FIRST (owner 2026-07-29: "when on roam the hub prioritize fixing those").
    // The hourly generator drops one brand-new question an hour into a random pillar. A purely random hop would
    // only land on that pillar ~1 time in 44, so fresh questions could sit unwritten for days. Now a roaming crew
    // looks for a pillar holding unwritten seeds and goes there; only when none are left does it fall back to the
    // normal isolated-random hop. pickSeededPillar already avoids pillars another crew has claimed.
    // seeds already preempted above and win regardless of pillar or roam setting; only hop randomly when the
    // seed backlog is empty and this crew is a roamer.
    if (ROAM && !seedPillar) setPillar(pickIsolatedPillar());
    const done = new Set(doneList());
    let all = ((idx && idx.entries) || []).filter(e => e && rx.test(String(e.id || '')));
    if (DO_WRITE === false) { const w = new Set((() => { try { return JSON.parse(fs.readFileSync(WD + '/new/imagebank/_content_done.json', 'utf8')); } catch (e) { return []; } })()); all = all.filter(e => w.has(e.id)); }  // image-only mode: only writer-finished
    TOTAL = all.length;
    const nowTs = Date.now();
    let pages = all.filter(e => !done.has(e.id) && !((deferUntil.get(e.id) || 0) > nowTs)).sort((a, b) => (a.ts || 0) - (b.ts || 0));
    // 🆕 NEW-Q&A mode: ONLY the brand-new pipeline seeds for this pillar. Two sources, merged:
    //   • index rows still flagged `pending` — set by _pipeline_gen.js, cleared by publishContentBody
    //   • this pillar's fix-queue file — where the generator drops every fresh id
    // Nothing else is eligible, so a dedicated crew can never wander off into the revision backlog.
    if (NEWQA) {
      let fq = new Set();
      try { fq = new Set(JSON.parse(fs.readFileSync(WD + '/new/imagebank/_fix_queue_' + PILLAR + '.json', 'utf8'))); } catch (e) {}
      const seeds = pages.filter(e => e && (e.pending === true || fq.has(e.id)));
      pages = seeds;
      REMAIN = pages.length;
      // "candidates" not "seeds": the fix-queue half of this pile is unverified until the blob is read at pick time
      log('🆕 new-Q&A mode — ' + pages.length + ' candidate(s) in ' + PILLAR + ' (pending rows + fix-queue; verified against the blob at pick)');
    }
    // 📉 Less than 12/13 mode: failed-rewrite pile + score < 12 (merge; don't ONLY spin recent misses)
    else if (UNDER12) {
      let failIds = new Set();
      try { for (const x of JSON.parse(fs.readFileSync(UNDER12_FAIL, 'utf8'))) if (x && x.id) failIds.add(String(x.id)); } catch (e) {}
      const failed = pages.filter(e => failIds.has(e.id));
      const low = pages.filter(e => {
        // Prefer gate_score (what crews stamp); quality_score alone was stuck at 10 and mis-targeted.
        const q = (e.gate_score != null ? e.gate_score : (e.quality_score == null ? 10 : e.quality_score));
        return q < GATE_MIN;
      });
      const seen = new Set();
      const merged = [];
      for (const e of low.concat(failed)) {
        if (!e || !e.id || seen.has(e.id)) continue;
        seen.add(e.id);
        merged.push(e);
      }
      // Prefer never-tried / not-in-failed first (easier wins), then failed pile
      merged.sort((a, b) => {
        const af = failIds.has(a.id) ? 1 : 0;
        const bf = failIds.has(b.id) ? 1 : 0;
        if (af !== bf) return af - bf;
        return (a.ts || 0) - (b.ts || 0);
      });
      pages = merged;
      REMAIN = pages.length;
      log('📉 under12 mode — ' + pages.length + ' left (failed-pile ' + failed.length + ', score<12 ' + low.length + ')');
    } else {
      REMAIN = pages.length;   // ← countdown: 250 → 249 → … as pages finish
    }
    // 🆕 NEW QUESTIONS FIRST — a pillar's unwritten seeds sort to the very front, ahead of the whole backlog.
    // Hopping to the right pillar is only half of it: `fr` alone has ~1,000 ids on its fix-queue, so without this
    // a crew would land on the seeded pillar and still spend hours on old pages before reaching the new question.
    // Applies to every crew, not just NEWQA ones — a brand-new question with no body is the most valuable page in
    // the pillar and the cheapest to move (it starts at 0, so any real write is progress).
    {
      const fresh = pages.filter(e => e && e.pending === true);
      if (fresh.length && fresh.length < pages.length) {
        pages = fresh.concat(pages.filter(e => !(e && e.pending === true)));
        log('🆕 ' + fresh.length + ' unwritten new question(s) moved to the front of ' + PILLAR);
      }
    }
    // 🔁 BACK OF THE LINE — applied LAST, after every mode has chosen its pile, so nothing re-sorts past it.
    // Pages that already missed the gate stay in this pillar's inventory but sort behind everything never tried,
    // and behind each other in the order they were sent back. A crew always works fresh pages first and only
    // comes back to a stubborn URL once the new work is exhausted.
    {
      const bk = backMap();
      if (Object.keys(bk).length) {
        const back = pages.filter(e => bk[e.id]);
        if (back.length && back.length < pages.length) {
          back.sort((a, b) => ((bk[a.id].ts || 0) - (bk[b.id].ts || 0)));
          pages = pages.filter(e => !bk[e.id]).concat(back);
          log('🔁 ' + back.length + ' previously-missed page(s) held at the back of ' + PILLAR);
        }
      }
    }
    // ANTI-COLLISION + EVEN SPLIT: deterministic partition by crew index, recomputed live each loop (liveStride).
    // With N crews on this pillar, crew k only ever sees pages where (position % N === k) → no two crews touch the
    // same page (no "same page, different images" dupes) AND the pillar is shared evenly N ways.
    const _st = liveStride();
    if (_st.n > 1) pages = pages.filter((e, i) => (i % _st.n) === _st.i);
    if (!pages.length) {
      if (ROAM) { running = false; return setTimeout(loop, 250); }   // this random pillar is empty → just try another
      // ROTATION: pillar genuinely complete (index read OK + 0 undone, ignoring temporary network-deferrals)?
      const trulyLeft = all.filter(e => !done.has(e.id)).length;
      if (ROTATE && idx && idx.entries && all.length > 0 && trulyLeft === 0) {
        if (advancePillar()) { running = false; return setTimeout(loop, 500); }   // jumped to next small pillar → go
        log('🔁 all rotation pillars done — nothing left to jump to'); running = false; return setTimeout(loop, 60000);
      }
      // 🏁 PILLAR COMPLETE → PAUSE (owner 2026-07-28: "once the pillar is complete pause").
      // A pinned crew with nothing left used to keep re-reading the index every 30s forever, which reads as
      // "still running" in the hub and quietly burns connection on a finished pillar. Now it PAUSES: goes idle,
      // says so in its status file so the hub row shows ⏸ PILLAR COMPLETE, and stops picking work. It re-checks
      // slowly and un-pauses by itself if work appears (a generator seed, a requeue, a reset) — so a paused crew
      // is not a dead crew, it just stops spinning.
      if (!PAUSED) {
        PAUSED = true;
        PAUSE_WHY = (NEWQA ? 'no unwritten seeds left in ' : 'pillar complete — 0 left in ') + PILLAR;
        CUR = ''; setStage('paused');
        log('🏁 PILLAR COMPLETE — ⏸ PAUSED (' + PAUSE_WHY + ', ' + all.length + ' total, ' + trulyLeft + ' undone). Watching for new work.');
      }
      running = false; return setTimeout(loop, PAUSE_RECHECK_MS);
    }
    if (PAUSED) { PAUSED = false; PAUSE_WHY = ''; log('▶️ new work in ' + PILLAR + ' (' + pages.length + ') — un-pausing'); }
    // ♻️ FIX PILE priority (owner 2026-07-22): if the manager re-queued pages for THIS pillar, rewrite them FIRST.
    let onFixPile = false;
    try { const fq = new Set(JSON.parse(fs.readFileSync(WD + '/new/imagebank/_fix_queue_' + PILLAR + '.json', 'utf8'))); if (fq.size) { const fp = pages.filter(e => fq.has(e.id)); if (fp.length) { pages = fp; onFixPile = true; } } } catch (e) {}
    // PICK: ROAM → a RANDOM question (breaks up dup-clusters); otherwise leapfrog oldest-first.
    const claims = loadClaims(); let pick = null, i = 0;
    if (ROAM) { pick = pages[Math.floor(Math.random() * pages.length)]; }   // random page this pillar (breaks up dup-clusters)
    else { while (i < pages.length) { const id = pages[i].id; if (claims[id] && claims[id].box !== BOX_I) { i += 5; continue; } pick = pages[i]; break; } }
    if (!pick) { running = false; return setTimeout(loop, 4000); }   // everything ahead is claimed — brief wait
    claim(pick.id); await sleep(70);
    const c2 = loadClaims(); if (c2[pick.id] && c2[pick.id].box !== BOX_I) { running = false; return setTimeout(loop, 300); }  // lost the race → re-pick (leapfrog)
    let blob = null; try { blob = await theStore().get('answers/' + pick.id + '.json', { type: 'json', consistency: 'strong' }); } catch (e) {}
    // 🆕 VERIFY the pick is really a brand-new pipeline question. The pillar fix-queue is a SHARED file — the
    // dedupe "dissolve" and the manual requeue both write into it — so it is not on its own proof of newness
    // (a co smoke test pulled 114 "seeds", 96 of which were finished 13/13 pages that had been requeued). The
    // blob is the authority: `pipeline_new` is stamped by _pipeline_gen.js and by nothing else. An empty body
    // also qualifies — it has never been written, whatever put it in the queue.
    if (NEWQA && blob && !blob.pipeline_new && wcount(blob.answer) >= 300) {
      log(pick.id + ' 🆕 not a pipeline seed (already written, no pipeline_new) — skipping in new-Q&A mode');
      deferUntil.set(pick.id, Date.now() + 24 * 3600 * 1000);
      try { const f = WD + '/new/imagebank/_fix_queue_' + PILLAR + '.json'; const a = JSON.parse(fs.readFileSync(f, 'utf8')); const b = a.filter(x => x !== pick.id); if (b.length !== a.length) fs.writeFileSync(f, JSON.stringify(b)); } catch (e) {}
      releaseClaim(pick.id); running = false; return setTimeout(loop, 200);
    }
    if (blob) { await finishPage(pick.id, blob); } else { log(pick.id + ' no blob — skip'); addDone(pick.id); }
    if (onFixPile) { try { const f = WD + '/new/imagebank/_fix_queue_' + PILLAR + '.json'; const a = JSON.parse(fs.readFileSync(f, 'utf8')); const b = a.filter(x => x !== pick.id); if (b.length !== a.length) fs.writeFileSync(f, JSON.stringify(b)); } catch (e) {} }   // ♻️ done → off the fix pile
    releaseClaim(pick.id);
    running = false;
    const cd = COOLDOWN_MS > 1200 ? COOLDOWN_MS : 1200;
    if (COOLDOWN_MS > 1200) { COOLDOWN_UNTIL = Date.now() + COOLDOWN_MS; CUR = ''; setStage('cooldown'); log('😴 cooldown ' + Math.round(COOLDOWN_MS / 1000) + 's before next page'); setTimeout(() => { COOLDOWN_UNTIL = 0; }, COOLDOWN_MS); }
    return setTimeout(loop, cd);   // 🕒 pace the load: cooldown after each page
  } catch (e) { log('loop err ' + ((e && e.message) || e)); }
  running = false;
  setTimeout(loop, 1200);
}

http.createServer((req, res) => {
  if (req.url === '/api/status') { res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' }); return res.end(JSON.stringify({ pillar: PILLAR, box: BOX_I, engine: ENGINE, stage: STAGE, current: CUR, done: DONE, wrote: WROTE, remaining: REMAIN, total: TOTAL, paused: PAUSED, pauseWhy: PAUSE_WHY, newqa: NEWQA })); }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`<!doctype html><html><head><meta charset="utf-8"><title>Kory's Crew</title></head>
<body style="margin:0;background:#0b0b0b;color:#eee;font-family:system-ui,Arial;padding:16px">
<div id=hd style="font-size:1.15rem;font-weight:800;color:#f5c542"></div>
<div id=bar style="display:flex;gap:6px;flex-wrap:wrap;margin:14px 0"></div>
<div id=st style="color:#bbb;font-size:.95rem"></div>
<script>
var SEQ=['write','cover','body1','body2','body3','body4','body5','body6','mermaid'];
var BOXES=[['write','Write'],['cover','Face'],['cover','Hero'],['body1','Img 1'],['body2','Img 2'],['body3','Img 3'],['body4','Img 4'],['body5','Img 5'],['body6','Img 6'],['mermaid','Mermaid']];
function col(bs,cur){if(cur==='done')return '#2ecc71';if(cur==='lock'||cur==='cover')cur='cover';var bi=SEQ.indexOf(bs),ci=SEQ.indexOf(cur);if(ci<0)return '#33181a';if(bi<ci)return '#2ecc71';if(bi===ci)return '#f1c40f';return '#33181a';}
async function tick(){try{var d=await(await fetch('/api/status')).json();
var cur=d.current?(d.stage||'idle'):'idle';
var live=!!d.current&&cur!=='idle';
document.body.style.boxShadow=live?'inset 0 0 0 4px #2ecc71':'inset 0 0 0 1px #222';
document.getElementById('hd').innerHTML='<span style="color:'+(live?'#2ecc71':'#666')+';font-size:1.05rem">'+(live?'● UP':'○ idle')+'</span> &middot; 👷 Kory&#39;s Crew &middot; '+String(d.pillar||'').toUpperCase()+' &middot; <span style="color:#8ab4ff">'+(d.engine||'')+'</span>';
document.getElementById('bar').innerHTML=BOXES.map(function(b){var c=col(b[0],cur);var tc=(c==='#f1c40f')?'#1a1a1a':(c==='#2ecc71'?'#06210f':'#7a4a45');return '<div style="min-width:62px;text-align:center;padding:9px 6px;border-radius:7px;font-size:.7rem;font-weight:800;background:'+c+';color:'+tc+'">'+b[1]+'</div>';}).join('');
document.getElementById('st').innerHTML='<p style="font-size:1.05rem"><b style="font-size:1.5rem;color:#f5c542">'+Number(d.remaining||0).toLocaleString()+'</b> left in '+d.pillar+'</p><p>working: <b style="color:#fff">'+(d.current||'—')+'</b></p><p>done this run: '+d.done+' &middot; wrote: '+d.wrote+'</p>';
}catch(e){}}
setInterval(tick,1200);tick();
</script></body></html>`);
}).listen(PORT, () => {
  if (ROTATE) { const r = loadRot(); r.taken = r.taken || {}; r.taken['box' + BOX_I] = { p: PILLAR, ts: Date.now() }; saveRot(r); }   // claim starting pillar so peers don't jump onto it
  log('👷 whole crew up on :' + PORT + ' pillar=' + PILLAR + ' crew=' + (BOX_I + 1) + '/' + BOX_N + ' write=' + DO_WRITE + (ROTATE ? ' [ROTATE]' : ' [pinned]')
    + (NEWQA ? ' 🆕 [NEW Q&A CREW — seeds only, ≥' + GATE_MIN + '/13 AND ≥' + NEW_MIN_WORDS + 'w]' : '')
    + (FORCE_REWRITE ? ' 🔁 [FORCE REWRITE — every page goes through the writer]' : ''));
  setInterval(flushPendingEmails, 20000); flushPendingEmails();
  const stagger = BOX_I * STAGGER_MS;   // 🕒 offset crews so only ~one works at a time
  if (stagger > 0) log('⏳ staggered start — first page in ' + Math.round(stagger / 1000) + 's');
  setTimeout(loop, stagger);
});
