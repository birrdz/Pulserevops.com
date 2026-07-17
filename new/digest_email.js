// new/digest_email.js — hourly email digest of NEWLY published Block Builder entries.
// A sample (up to 8) of ones finished (💚 fixed) + created (🩷 new), with clickable question IDs
// so Kory can spot-check they look good. Tracks last-sent so it never re-sends the same ones.
'use strict';
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const KEY = process.env.resendapikey || process.env.RESEND_API_KEY;
const RECIPIENT = 'koryjordanwhite@gmail.com';
const OUT = WD + '/new/output';
const STATE = WD + '/new/_digest_last.json';
const SITE = 'https://pulserevops.com';
const esc = s => String(s || '').replace(/</g, '&lt;');

function lastSent() { try { return JSON.parse(fs.readFileSync(STATE, 'utf8')).ts; } catch (e) { return Date.now() - 2 * 3600 * 1000; } } // first run: last 2h
function saveSent(ts) { try { fs.writeFileSync(STATE, JSON.stringify({ ts })); } catch (e) {} }

async function sendDigest() {
  if (!KEY) { console.log('[digest] no resend key'); return; }
  const since = lastSent(), now = Date.now();
  const items = [];
  try {
    for (const d of fs.readdirSync(OUT)) {
      let m; try { m = JSON.parse(fs.readFileSync(OUT + '/' + d + '/meta.json', 'utf8')); } catch (e) { continue; }
      if (!m.live || !m.qid) continue;
      const t = Date.parse(m.liveAt || m.publishedAt || 0) || 0;
      if (t > since) items.push({ qid: m.qid, title: m.title || m.qid, fixed: (m.trim === 'green'), t });
    }
  } catch (e) {}
  if (!items.length) { console.log('[digest] nothing new since last email'); saveSent(now); return; }
  items.sort((a, b) => b.t - a.t);
  const nFix = items.filter(i => i.fixed).length, nNew = items.length - nFix;
  const show = items.slice(0, 8);
  const row = i => '<tr><td style="padding:9px 8px;font-size:13px;white-space:nowrap">' + (i.fixed ? '💚 fixed' : '🩷 new') + '</td>'
    + '<td style="padding:9px 8px"><a href="' + SITE + '/knowledge/' + i.qid + '" style="color:#0a7cff;font-weight:800;text-decoration:none">' + i.qid + '</a> &nbsp;<span style="color:#333">' + esc(i.title) + '</span></td></tr>';
  const more = items.length > show.length ? '<p style="color:#888;font-size:13px">…and ' + (items.length - show.length) + ' more.</p>' : '';
  const html = '<div style="font-family:system-ui,Arial;max-width:660px;color:#111">'
    + '<h2 style="margin:0 0 4px">PULSE build digest</h2>'
    + '<p style="color:#666;margin:0 0 14px">' + nNew + ' new 🩷 · ' + nFix + ' fixed 💚 — tap each to check it looks good:</p>'
    + '<table style="border-collapse:collapse;width:100%;border-top:1px solid #eee">' + show.map(row).join('') + '</table>' + more + '</div>';
  const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: 'PULSE Engine <onboarding@resend.dev>', to: [RECIPIENT], subject: 'PULSE — ' + nNew + ' new, ' + nFix + ' fixed', html }) });
  if (!r.ok) { console.log('[digest] resend error', r.status, (await r.text()).slice(0, 160)); return; }
  saveSent(now);
  console.log('[digest] emailed ' + items.length + ' (' + nNew + ' new, ' + nFix + ' fixed) to ' + RECIPIENT);
}

sendDigest();
setInterval(sendDigest, 60 * 60 * 1000);
console.log('[digest] hourly email digest up · ' + RECIPIENT);
