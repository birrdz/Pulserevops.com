// Per-fix emailer for the pillar 13/13 fix campaign (starting with mv).
// Watches the scrub run-log (_scrub_run_log.json); the instant an entry is
// certified/published at 13/13 by the scrubber, emails koryjordanwhite@gmail.com
// the QID + live link. Seeds the seen-set at boot so it never floods on already-
// certified history — only entries fixed AFTER this watcher starts trigger mail.
// Env: PILLAR (default 'mv' — set '' or 'all' for every pillar).
// Run:  node _campaign_publish_emailer.js   (stop: _campaign_email_stop.flag)
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const RECIPIENT = 'koryjordanwhite@gmail.com';
const SCRUBLOG = WD + '/_scrub_run_log.json';
const SEEN_F = WD + '/_campaign_email_seen.json';
const STOP_F = WD + '/_campaign_email_stop.flag';
const LOG_F = WD + '/_campaign_email.log';
const POLL_MS = 20000;
const PILLAR = (process.env.PILLAR === undefined ? 'mv' : process.env.PILLAR).toLowerCase();
const DONE_STATUS = new Set(['certified', 'green']);

for (const l of (() => { try { return fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/); } catch (e) { return []; } })()) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const RESEND_KEY = process.env.resendapikey || process.env.RESEND_API_KEY || process.env.RESENDAPIKEY;

function log(m) { const s = new Date().toISOString() + ' ' + m; try { fs.appendFileSync(LOG_F, s + '\n'); } catch (e) {} console.log('[fix-email] ' + m); }
function esc(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function pillarOf(id) { const m = String(id).match(/^([a-z]+)\d/i); return m ? m[1].toLowerCase() : ''; }
function loadSeen() { try { return new Set(JSON.parse(fs.readFileSync(SEEN_F, 'utf8'))); } catch (e) { return null; } }
function saveSeen(set) { try { fs.writeFileSync(SEEN_F, JSON.stringify([...set])); } catch (e) {} }
function readLog() { try { return JSON.parse(fs.readFileSync(SCRUBLOG, 'utf8')); } catch (e) { return []; } }

function certifiedIds() {
  const arr = readLog();
  const out = [];
  const seenLocal = new Set();
  for (const e of arr) {
    if (!e || !e.id || !DONE_STATUS.has(e.status)) continue;
    const id = String(e.id).toLowerCase();
    if (seenLocal.has(id)) continue;
    if (PILLAR && PILLAR !== 'all' && pillarOf(id) !== PILLAR) continue;
    seenLocal.add(id);
    out.push({ id, title: e.title || id, score: e.score });
  }
  return out;
}

async function emailEntry(e) {
  const url = 'https://pulserevops.com/knowledge/' + e.id;
  const pill = pillarOf(e.id).toUpperCase();
  const html = '<div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:600px;color:#15110d">' +
    '<p style="font-size:18px;font-weight:800;margin:0 0 8px">✅ Q&amp;A fixed &amp; published · ' + esc(e.id) + '</p>' +
    '<p style="margin:0 0 4px;font-size:13px;color:#0b57d0;font-weight:700">' + esc(pill) + ' pillar · 13/13 Google-quality · Top-10 images verified</p>' +
    '<p style="margin:0 0 12px;font-weight:700">' + esc(e.title) + '</p>' +
    '<p style="margin:0 0 6px"><a href="' + url + '" style="color:#0b57d0;font-weight:700">' + url + '</a></p>' +
    '<p style="color:#8a7a63;font-size:12px;margin-top:12px">' + new Date().toLocaleString() + ' · pillar fix-to-13/13 campaign</p></div>';
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST', headers: { Authorization: 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'PULSE Engine <onboarding@resend.dev>', to: [RECIPIENT], subject: '✅ ' + e.id + ' fixed · ' + String(e.title).slice(0, 66), html }),
  });
  if (!r.ok) { log('resend ' + r.status + ' ' + (await r.text()).slice(0, 140) + ' · ' + e.id); return false; }
  log('emailed ' + e.id + ' · ' + String(e.title).slice(0, 60));
  return true;
}

(async () => {
  if (!RESEND_KEY) { log('FATAL no resend key in env'); process.exit(1); }
  let seen = loadSeen();
  if (!seen) { seen = new Set(certifiedIds().map(e => e.id)); saveSeen(seen); log('seeded seen with ' + seen.size + ' already-certified ' + (PILLAR || 'all') + ' ids — emails only NEW fixes from here'); }
  else { log('resumed · seen=' + seen.size); }
  log('watcher live · pillar=' + (PILLAR || 'all') + ' · polling every ' + (POLL_MS / 1000) + 's');
  while (!fs.existsSync(STOP_F)) {
    try {
      const fresh = certifiedIds().filter(e => !seen.has(e.id));
      for (const e of fresh) { const ok = await emailEntry(e); seen.add(e.id); if (ok) saveSeen(seen); await new Promise(r => setTimeout(r, 1200)); }
      if (fresh.length) log('cycle: emailed ' + fresh.length + ' new · total seen ' + seen.size);
    } catch (e) { log('loop err ' + (e.message || e)); }
    await new Promise(r => setTimeout(r, POLL_MS));
  }
  log('stopped (flag)');
})().catch(e => { log('FATAL ' + (e && e.message)); process.exit(1); });
