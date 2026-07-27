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
let PILLAR = (process.env.SLOT_PILLAR || process.env.DEFAULT_PILLAR || 'tl').toLowerCase().replace(/[^a-z]/g, '');
// ROTATION (owner 2026-07-21): a small-pillar crew (ROTATE=1) that FINISHES its pillar jumps to the next
// un-taken small Q&A pillar — never the same one twice. The tl crew launches WITHOUT ROTATE and stays on tl.
const ROTATE = process.env.ROTATE === '1';
const SMALL_ROTATION = (process.env.ROTATION_PILLARS || 'gp,bo,ra,cg,sw,sk').split(',').map(s => s.trim()).filter(Boolean);
// ROAM (owner 2026-07-21): crew jumps to a RANDOM pillar + RANDOM question every page, so consecutive entries
// are never from the same cluster (breaks up near-dupes; the dup-gate catches any that slip through).
const ROAM = process.env.ROAM === '1';
const UNDER12 = process.env.UNDER12 === '1';   // 📉 Less than 12/13 — work score < 12 / failed-rewrite pile
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
  ((r && r.photos) || []).forEach(p => { const src = psrc(p); const alt = String(p.alt || '').toLowerCase(); const score = kw.reduce((s, w) => s + (alt.indexOf(w) >= 0 ? 1 : 0), 0); topic.push({ src, isPack: false, pid: pidOf(src), score }); });
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
      const raw = c.isPack ? readPack(c.src) : await dl(c.src);
      if (!raw || raw.length < 2500) continue;
      const buf = await fmt(raw);
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
function setStage(s) { STAGE = s; const _sp = liveStride(); try { fs.writeFileSync(STATUSF, JSON.stringify({ port: PORT, box: BOX_I, pillar: PILLAR, engine: (typeof ENGINE !== 'undefined' ? ENGINE : ''), stage: STAGE, current: CUR, done: DONE, wrote: WROTE, remaining: (typeof REMAIN !== 'undefined' ? REMAIN : 0), total: (typeof TOTAL !== 'undefined' ? TOTAL : 0), cooldownUntil: COOLDOWN_UNTIL, flip: FLIP, win: SAVE_WIN, loss: SAVE_LOSS, lastGate: LAST_GATE, splitI: _sp.i, splitN: _sp.n, ts: Date.now() })); } catch (e) {} }
// engine: 'deepseek' | 'cursor' | 'alternate' (flip DS↔Cursor). Claude BENCHED until Tue (owner 2026-07-26).
const ENGINE_MODE = (process.env.ENGINE_MODE || process.env.WRITER_ENGINE || 'deepseek').toLowerCase();
function engLabel(e) {
  e = String(e || '').toLowerCase();
  if (e === 'claude') return claudeUnbenched() ? 'Claude Code' : 'CC(benched)';
  if (e === 'cursor') return 'Cursor';
  if (e === 'alternate') return 'Alternate';
  return 'DeepSeek';
}
let ENGINE = engLabel(ENGINE_MODE === 'claude' ? 'deepseek' : ENGINE_MODE);
function pickEngine() {   // set the forced writer for THIS page (per-page flip when alternating)
  // Claude on the bench until Tuesday — any 'claude' request routes to DeepSeek.
  if (ENGINE_MODE === 'alternate') {
    const e = (DONE % 2 === 0) ? 'deepseek' : 'cursor';
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
  let writeOk = (blob.gate_score || 0) >= GATE_MIN;
  let gateAlreadyOk = writeOk;
  let pageGateScore = writeOk ? (blob.gate_score || GATE_MIN) : null;
  let contentFail = false;   // true ONLY when the writer produced a page that failed the gate/topic/dup (a real
                             // content problem). Network/writer-down failures are NOT content fails → never skipped.
  if (DO_WRITE && rebuildToGate && !writeOk) {
    // 🔓 GUARDRAIL OVERRIDE (owner 2026-07-22): publish any page that reaches the gate score AND is on-topic — even if
    // rebuildToGate returned ok:false because the anti-drift dup-gate flagged the DeepSeek rewrite.
    // 💸 CHEAP (default): surgical $0 → if ≥12 publish; else ONE DeepSeek attempt; miss stays on under12 pile.
    // 🔁 FULL (cheap off): TEAM Cursor+DS + FULL Cursor redo before under12 pile.
    const primeEng = (process.env.WRITER_ENGINE || 'deepseek').toLowerCase();
    const engName = e => (e === 'claude' ? 'Claude Code' : (e === 'cursor' ? 'Cursor Agent' : 'DeepSeek'));
    const setEng = e => { process.env.WRITER_ENGINE = e; ENGINE = engLabel(e); };
    const better = (a, b) => (a && a.body && (a.after || 0) >= ((b && b.after) || -1));
    const srcBody = blob.answer || '';
    try {
      let r, topic, rescued = false, stuckAt = 0;

      if (CHEAP_WRITE) {
        // (0) surgical only — $0
        FLIP = '💸 cheap · surgical $0';
        setStage('write');
        r = rebuildToGate(title, srcBody, { maxAttempts: 0, id });
        topic = r && r.body && onTopic(title, r.body);
        if (r && r.after >= GATE_MIN && topic) {
          // free hit
        } else {
          // (1) up to 3 DeepSeek passes (still no Cursor) — 1× was landing ~9/13 too often
          setEng('deepseek');
          FLIP = '💸 cheap · DeepSeek×3';
          setStage('write');
          const d1 = rebuildToGate(title, srcBody, { maxAttempts: 3, id });
          const t1 = d1 && d1.body && onTopic(title, d1.body);
          if (better(d1, r)) { r = d1; topic = t1; }
        }
      } else {
        r = rebuildToGate(title, srcBody, { maxAttempts: 3, id });
        topic = r && r.body && onTopic(title, r.body);

        if (r && !(r.after >= GATE_MIN && topic)) {
          rescued = true;
          stuckAt = (r && r.after) || 0;
          log(id + ' stuck ' + stuckAt + '/13 on ' + engName(primeEng) + ' — TEAM Cursor + DeepSeek');
          FLIP = '🤝 TEAM Cursor + DeepSeek · stuck @' + stuckAt + '/13';
          setStage('write');

          setEng('cursor');
          FLIP = '🤝 TEAM · Cursor Agent';
          setStage('write');
          const cTry = rebuildToGate(title, srcBody, { maxAttempts: 3, id });
          const cTopic = cTry && cTry.body && onTopic(title, cTry.body);
          if (better(cTry, r)) { r = cTry; topic = cTopic; }

          setEng('deepseek');
          FLIP = '🤝 TEAM · DeepSeek';
          setStage('write');
          const dTry = rebuildToGate(title, srcBody, { maxAttempts: 3, id });
          const dTopic = dTry && dTry.body && onTopic(title, dTry.body);
          if (better(dTry, r)) { r = dTry; topic = dTopic; }
        }

        if (r && !(r.after >= GATE_MIN && topic)) {
          if (!rescued) { rescued = true; stuckAt = (r && r.after) || 0; }
          log(id + ' still short ' + ((r && r.after) || 0) + '/13 — FULL Cursor redo');
          setEng('cursor');
          FLIP = '♻️ FULL Cursor redo · last @' + ((r && r.after) || 0) + '/13';
          setStage('write');
          const c2 = rebuildToGate(title, srcBody, { maxAttempts: 4, id });
          const t2 = c2 && c2.body && onTopic(title, c2.body);
          if (better(c2, r)) { r = c2; topic = t2; }
        }
      }

      setEng(primeEng); FLIP = '';
      if (r && r.body && (r.after >= GATE_MIN) && topic) {
        SAVE_WIN++;
        LAST_GATE = id + ' ' + r.after + '/13 ✓';
        const how = rescued ? ('rescue ' + stuckAt + '→' + r.after) : (r.surgicalOnly ? 'surgical' : (CHEAP_WRITE ? 'cheap-write' : 'write'));
        log(id + ' 🏁 HIT 12+ — ' + how + ' · run ' + SAVE_WIN + 'W-' + SAVE_LOSS + 'L');
        setStage('write');
        await retryNet(() => publishContentBody(id, r.body)); WROTE++; writeOk = true; pageGateScore = r.after; log(id + ' WROTE ' + r.after + '/13 ✓' + (r.surgicalOnly ? ' (surgical-only · $0)' : (CHEAP_WRITE ? ' (cheap)' : (r.ok ? '' : ' (drift-override)')))); try { blob = await theStore().get('answers/' + id + '.json', { type: 'json', consistency: 'strong' }); } catch (e) {} }
      else if (r && r.body) {
        SAVE_LOSS++;
        LAST_GATE = id + ' ' + ((r && r.after) || 0) + '/13 ✗';
        addUnder12Failed(id, r.after);
        // Do NOT addDone on a <12 miss — keep it on the Less-than-12 pile for rerun (owner 2026-07-27).
        // Defer so we don't immediately re-spin the same hard miss (lets inventory advance).
        deferUntil.set(id, Date.now() + 45 * 60 * 1000);
        log(id + ' 📉 MISS <12 — best ' + r.after + '/13 · run ' + SAVE_WIN + 'W-' + SAVE_LOSS + 'L' + (CHEAP_WRITE ? ' · cheap' : '') + ' · deferred 45m');
        await emailCrewMiss(id, title, r.after);   // 📧 every finished attempt (hit or miss)
        CUR = ''; setStage('idle'); return;
      }
    } catch (e) { log(id + ' write err ' + ((e && e.message) || e)); }
  }
  if (!writeOk) {   // reached only on network/writer-down (no usable body) → defer + retry, never the Not-Finished pile
    deferUntil.set(id, Date.now() + 90000); failCount.delete(id); log(id + ' ⏸ DEFERRED — network/writer down, will retry'); CUR = ''; setStage('idle'); return;
  }
  const words = String((blob && blob.answer) || '').replace(/[#>*`~\[\]()>-]/g, ' ').split(/\s+/).filter(Boolean).length;
  const bodyN = Math.max(2, Math.min(6, Math.round(words / 450)));   // how many body images this length holds
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
    const img = await pickImage(q, seen, title);
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
function setPillar(p) { PILLAR = p; DONEF = WD + '/new/imagebank/_finisher_' + p + '_done.json'; CLAIMS = WD + '/new/imagebank/_wholecrew_' + p + '_claims.json'; FPF = WD + '/new/imagebank/_finisher_' + p + '_fp.jsonl'; rx = new RegExp('^' + p + '\\d'); FP_CACHE = null; }   // DONE is a run-total — do NOT reset on pillar switch (roam calls this every page)
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
    if (ROAM) setPillar(pickIsolatedPillar());   // 🎲 hop to an UNCLAIMED pillar (crews stay isolated, never share)
    const done = new Set(doneList());
    let all = ((idx && idx.entries) || []).filter(e => e && rx.test(String(e.id || '')));
    if (DO_WRITE === false) { const w = new Set((() => { try { return JSON.parse(fs.readFileSync(WD + '/new/imagebank/_content_done.json', 'utf8')); } catch (e) { return []; } })()); all = all.filter(e => w.has(e.id)); }  // image-only mode: only writer-finished
    TOTAL = all.length;
    const nowTs = Date.now();
    let pages = all.filter(e => !done.has(e.id) && !((deferUntil.get(e.id) || 0) > nowTs)).sort((a, b) => (a.ts || 0) - (b.ts || 0));
    // 📉 Less than 12/13 mode: failed-rewrite pile + score < 12 (merge; don't ONLY spin recent misses)
    if (UNDER12) {
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
      log('partition complete — 0 left, waiting'); running = false; return setTimeout(loop, 30000);
    }
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
  if (req.url === '/api/status') { res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' }); return res.end(JSON.stringify({ pillar: PILLAR, box: BOX_I, engine: ENGINE, stage: STAGE, current: CUR, done: DONE, wrote: WROTE, remaining: REMAIN, total: TOTAL })); }
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
  log('👷 whole crew up on :' + PORT + ' pillar=' + PILLAR + ' crew=' + (BOX_I + 1) + '/' + BOX_N + ' write=' + DO_WRITE + (ROTATE ? ' [ROTATE]' : ' [pinned]'));
  setInterval(flushPendingEmails, 20000); flushPendingEmails();
  const stagger = BOX_I * STAGGER_MS;   // 🕒 offset crews so only ~one works at a time
  if (stagger > 0) log('⏳ staggered start — first page in ' + Math.round(stagger / 1000) + 's');
  setTimeout(loop, stagger);
});
