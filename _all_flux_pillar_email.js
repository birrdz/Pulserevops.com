// _all_flux_pillar_email.js — every-5-min Resend email scoped to the CURRENT pillar only (owner 2026-07-06).
// Replaces the whole-stock emailer. Reports the pillar the generator is on now (smallest pillar with covers
// still to make), its progress, rate + ETA to finish THAT pillar, and attaches 3 fresh covers from it.
// Stop: _all_flux_pillar_email_stop.flag
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const RECIPIENT = 'koryjordanwhite@gmail.com';
const KEY_CACHE = WD + '/_ask_owner_key.cache';
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const INTERVAL_MS = 2 * 60 * 1000; // every 2 min (owner 2026-07-06)
const QADIR = WD + '/assets/qa';
const PROG_F = 'C:/Users/koryj/AppData/Local/Temp/claude/C--Users-koryj/13770b56-5042-4718-9ba0-6cd6a9b9e409/scratchpad/_all_flux_progress.json';
const LOG_F = 'C:/Users/koryj/AppData/Local/Temp/claude/C--Users-koryj/13770b56-5042-4718-9ba0-6cd6a9b9e409/scratchpad/_all_flux_pillar_email.log';
const STOP = WD + '/_all_flux_pillar_email_stop.flag';
const ONCE = process.argv.includes('--once');
for (const l of (() => { try { return fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/); } catch (e) { return []; } })()) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: SITE, token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
// pillar display names (best-effort; falls back to the code)
// content-accurate names (owner 2026-07-06 — verified against real titles)
const NM = { fs: 'Fishing', mv: 'Movies', hf: 'NIL Sports', gm: 'Gaming', ga: 'Getaways & Games', sw: 'Software', ev: 'Event Venues', sk: 'Sales Skills', wl: 'Wellness', lv: 'Places to Retire', tn: 'Best Towns', co: 'Collectibles', cl: 'Cologne', nl: 'Nightlife', rs: 'Resorts', tc: 'Telco', sp: 'Speeches', tv: 'Resorts', bo: 'Buildouts', cr: 'Crabbing', bs: 'Book Summaries', es: 'Luxury Real Estate', dn: 'Dining', bt: 'Boats', gp: 'GTM Playbooks', ai: 'AI Tools', sc: 'Schools', tk: 'Tech Stacks', gb: 'Graphics', ra: 'Revenue Architecture', pt: 'Pets', ik: 'Industry KPIs', er: 'Electronics', cg: 'Coaching', st: 'Sales Trainings', aq: 'Aquariums', ed: 'Life Advice', fr: 'Franchises', ca: 'Cars', sy: 'Style', q: 'Knowledge Q&A', tl: 'CRO & Tools' };
const sleep = ms => new Promise(r => setTimeout(r, ms));
let firstSend = true, lastFluxP = null, lastAt = null, lastPillar = null;
let lastSentMs = Date.now() - INTERVAL_MS; // on startup, first email covers only the last interval (not the whole backlog)
const MAX_ATTACH = parseInt(process.env.EMAIL_MAX_ATTACH || '30', 10);
function env(k) { try { const m = fs.readFileSync(WD + '/.env.local', 'utf8').match(new RegExp('^' + k + '=(.+)$', 'm')); return m ? m[1].trim() : ''; } catch (e) { return ''; } }
function log(m) { const l = new Date().toISOString() + ' ' + m; console.log(l); try { fs.appendFileSync(LOG_F, l + '\n'); } catch (e) {} }
function esc(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
async function resendKey() {
  let k = env('resendapikey') || env('RESEND_API_KEY'); if (k) return k;
  try { k = fs.readFileSync(KEY_CACHE, 'utf8').trim(); if (k) return k; } catch (e) {}
  const TOKEN = env('NETLIFY_AUTH_TOKEN');
  const s = await fetch('https://api.netlify.com/api/v1/sites/' + SITE, { headers: { Authorization: 'Bearer ' + TOKEN } }).then(r => r.json());
  const acct = s.account_slug || s.account_name;
  const r = await fetch('https://api.netlify.com/api/v1/accounts/' + acct + '/env/resendapikey?site_id=' + SITE, { headers: { Authorization: 'Bearer ' + TOKEN } });
  if (!r.ok) throw new Error('netlify env ' + r.status);
  const j = await r.json();
  const val = (j.values || []).find(v => v.context === 'all' || v.context === 'production') || (j.values || [])[0];
  k = val && val.value; if (!k) throw new Error('no resend key');
  try { fs.writeFileSync(KEY_CACHE, k); } catch (e) {}
  return k;
}
// The current pillar = smallest pillar (by total entries) that still has covers to make (matches generator order).
async function currentPillar() {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const es = (idx.entries || []).filter(e => e && e.id && e.question && /^[a-z]+\d+$/.test(e.id));
  const tot = {}, flux = {}, qById = {};
  for (const e of es) { const p = e.id.match(/^([a-z]+)\d+$/)[1]; tot[p] = (tot[p] || 0) + 1; qById[e.id] = e.question; if (e.cover_src === 'flux') flux[p] = (flux[p] || 0) + 1; }
  // Prefer the generator's ACTUAL current pillar (from its progress lastId) — accurate even during a FORCE_ALL regen.
  let p = null;
  try { const pr = JSON.parse(fs.readFileSync(PROG_F, 'utf8')); const mm = pr && pr.lastId && String(pr.lastId).match(/^([a-z]+)\d+$/); if (mm && tot[mm[1]]) p = mm[1]; } catch (e) {}
  if (!p) { const remaining = Object.keys(tot).filter(pp => (flux[pp] || 0) < tot[pp]).sort((a, b) => tot[a] - tot[b]); p = remaining[0] || null; }
  const donePillars = Object.keys(tot).filter(pp => (flux[pp] || 0) >= tot[pp]).length;
  return p ? { p, flux: flux[p] || 0, total: tot[p], qById, donePillars, totPillars: Object.keys(tot).length } : { p: null, donePillars: Object.keys(tot).length, totPillars: Object.keys(tot).length };
}
// EVERY face-card cover created since `sinceMs` (owner 2026-07-06: "send me every image you create every 5 min").
function coversSince(sinceMs, cap) {
  try {
    const files = fs.readdirSync(QADIR).filter(f => /^[a-z]+\d+\.jpg$/.test(f));
    return files.map(f => { try { return { id: f.replace(/\.jpg$/, ''), f, m: fs.statSync(QADIR + '/' + f).mtimeMs }; } catch (e) { return null; } })
      .filter(Boolean).filter(x => x.m > sinceMs).sort((a, b) => b.m - a.m).slice(0, cap);
  } catch (e) { return []; }
}
async function send() {
  const cp = await currentPillar();
  if (!cp.p) {
    const key = await resendKey();
    await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: 'PULSE Engine <onboarding@resend.dev>', to: [RECIPIENT], subject: '🎏 Face cards — ALL pillars complete', html: '<div style="font-family:system-ui,Arial,sans-serif">All pillars are 100% flux. Campaign complete.</div>' }) });
    log('all complete'); firstSend = false; return;
  }
  const { p, flux, total, qById } = cp;
  const name = NM[p] || p;
  const remaining = total - flux;
  const pct = total ? ((flux / total) * 100).toFixed(0) : '0';
  const nowMs = Date.now();
  let ratePerHr = null, eta = 'measuring…';
  if (lastPillar === p && lastFluxP != null && lastAt != null && flux > lastFluxP) { ratePerHr = (flux - lastFluxP) / ((nowMs - lastAt) / 3600000); if (ratePerHr > 0) { const hrs = remaining / ratePerHr; eta = hrs < 1 ? Math.round(hrs * 60) + ' min' : hrs.toFixed(1) + ' hrs'; } }
  lastPillar = p; lastFluxP = flux; lastAt = nowMs;
  const nowStamp = Date.now();
  const made = coversSince(lastSentMs, MAX_ATTACH);
  const attachments = [];
  const links = made.map(r => {
    try { attachments.push({ filename: r.id + '.jpg', content: fs.readFileSync(QADIR + '/' + r.f).toString('base64') }); } catch (e) {}
    return '<li style="margin-bottom:6px"><a href="https://pulserevops.com/assets/qa/' + r.id + '.jpg" style="color:#0b57d0;font-weight:700">' + r.id + '.jpg</a> · <a href="https://pulserevops.com/knowledge/' + r.id + '" style="color:#0b57d0">page</a><br><span style="font-size:12px;color:#6b5d49">' + esc((qById[r.id] || '').slice(0, 70)) + '</span></li>';
  }).join('') || '<li style="color:#8a7a63">none in the last 5 min</li>';
  lastSentMs = nowStamp; // next email covers everything made after this send
  const subject = firstSend ? '🎏 Pillar emails on — now on ' + name + ' (' + p + ')' : '🎏 ' + name + ' · ' + flux + '/' + total + ' (' + pct + '%) · ' + remaining + ' left · ' + eta;
  const html = `<div style="font-family:system-ui,Arial,sans-serif;font-size:15px;line-height:1.6;color:#15110d">
    <p style="font-size:18px;font-weight:800;margin:0 0 4px">🎏 Current pillar: ${esc(name)} <span style="color:#8a7a63;font-weight:600">(${p})</span></p>
    <p style="margin:0 0 12px;color:#6b5d49">${cp.donePillars}/${cp.totPillars} pillars fully done · deploy fires when this one finishes</p>
    <table style="border-collapse:collapse;font-size:14px;margin-bottom:10px">
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Covers</td><td style="font-weight:700">${flux} / ${total} (${pct}%)</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Remaining</td><td style="font-weight:700">${remaining}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Rate / ETA</td><td>${ratePerHr ? Math.round(ratePerHr) + '/hr · ' + eta : eta}</td></tr>
    </table>
    <p style="font-weight:700;margin:12px 0 4px">🖼️ ${made.length} new cover${made.length === 1 ? '' : 's'} this interval — all attached ↓${made.length >= MAX_ATTACH ? ' (capped at ' + MAX_ATTACH + ')' : ''}</p>
    <ul style="margin:0;padding-left:18px">${links}</ul>
    <p style="color:#8a7a63;font-size:12px;margin-top:12px">${new Date().toLocaleString()} · pillar-only · pollinator flux · stop: _all_flux_pillar_email_stop.flag</p>
  </div>`;
  const key = await resendKey();
  const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: 'PULSE Engine <onboarding@resend.dev>', to: [RECIPIENT], subject, html, attachments }) });
  const txt = await r.text();
  if (!r.ok) throw new Error('resend ' + r.status + ' ' + txt.slice(0, 160));
  log('sent · ' + p + ' ' + flux + '/' + total); firstSend = false;
}
(async () => {
  if (!ONCE) { try { fs.unlinkSync(STOP); } catch (e) {} }
  log(ONCE ? 'one-shot' : 'pillar email every 5 min to ' + RECIPIENT);
  try { await send(); } catch (e) { log('ERR ' + e.message); }
  if (ONCE) return;
  while (!fs.existsSync(STOP)) {
    for (let i = 0; i < 150 && !fs.existsSync(STOP); i++) await sleep(INTERVAL_MS / 150);
    if (fs.existsSync(STOP)) break;
    try { await send(); } catch (e) { log('ERR ' + e.message); }
  }
  log('stop flag — exiting');
})().catch(e => { log('FATAL ' + e.message); process.exit(1); });
