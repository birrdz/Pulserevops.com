// _ask_owner.js — OWNER-REQUESTED urgent channel (2026-06-30): email Kory immediately when
// Claude Code hits a PRESSING question it needs answered to proceed. Bypasses _emails_off.flag
// (that flag suppresses routine/visitor mail; this is the explicit owner ask-me channel).
// Resend key is pulled from Netlify env (resendapikey) when absent locally, then cached to
// _ask_owner_key.cache (gitignored). Recipient fixed to the owner.
//
//   node _ask_owner.js "Subject line" "The question / context body (plain text or html)"
//   node _ask_owner.js --question "Should I expand thin 13/13 entries or restore them?"
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const RECIPIENT = 'koryjordanwhite@gmail.com';
const KEY_CACHE = WD + '/_ask_owner_key.cache';
const env = k => { try { const m = fs.readFileSync(WD + '/.env.local', 'utf8').match(new RegExp('^' + k + '=(.+)$', 'm')); return m ? m[1].trim() : ''; } catch (e) { return ''; } };
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

async function resendKey() {
  let k = env('resendapikey') || env('RESEND_API_KEY');
  if (k) return k;
  try { k = fs.readFileSync(KEY_CACHE, 'utf8').trim(); if (k) return k; } catch (e) {}
  // pull from Netlify env API
  const TOKEN = env('NETLIFY_AUTH_TOKEN');
  const s = await fetch('https://api.netlify.com/api/v1/sites/' + SITE, { headers: { Authorization: 'Bearer ' + TOKEN } }).then(r => r.json());
  const acct = s.account_slug || s.account_name;
  const r = await fetch('https://api.netlify.com/api/v1/accounts/' + acct + '/env/resendapikey?site_id=' + SITE, { headers: { Authorization: 'Bearer ' + TOKEN } });
  if (!r.ok) throw new Error('netlify env fetch ' + r.status);
  const j = await r.json();
  const val = (j.values || []).find(v => v.context === 'all' || v.context === 'production') || (j.values || [])[0];
  k = val && val.value;
  if (!k) throw new Error('no resend key value');
  try { fs.writeFileSync(KEY_CACHE, k); } catch (e) {}
  return k;
}

async function askOwner(subject, bodyHtml) {
  const key = await resendKey();
  const html = `<div style="font-family:system-ui,Arial,sans-serif;font-size:15px;line-height:1.5;color:#15110d">
    <p style="font-size:17px;font-weight:800;color:#C8112B">🔴 Claude Code needs your answer</p>
    <div style="background:#fff7e6;border:1px solid #f0d9a0;border-radius:10px;padding:14px 16px;margin:10px 0">${bodyHtml}</div>
    <p style="color:#8a7a63;font-size:13px">Reply at the PC — Claude is holding for your call. (PULSE SEO scrub session, ${new Date().toLocaleString()})</p>
  </div>`;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'PULSE Engine <onboarding@resend.dev>', to: [RECIPIENT], subject: '🔴 ' + subject, html }),
  });
  const txt = await r.text();
  if (!r.ok) throw new Error('resend ' + r.status + ' ' + txt.slice(0, 200));
  return JSON.parse(txt);
}
async function ownerEmail(subject, htmlBody) {
  const key = await resendKey();
  const html = String(htmlBody || '').trim();
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'PULSE Engine <onboarding@resend.dev>', to: [RECIPIENT], subject: String(subject || 'PULSE').slice(0, 180), html }),
  });
  const txt = await r.text();
  if (!r.ok) throw new Error('resend ' + r.status + ' ' + txt.slice(0, 200));
  return JSON.parse(txt);
}
module.exports = { askOwner, ownerEmail };

if (require.main === module) (async () => {
  const a = process.argv.slice(2);
  let subject, body;
  if (a[0] === '--question') { subject = 'Claude needs a decision'; body = a.slice(1).join(' '); }
  else { subject = a[0] || 'Claude needs your answer'; body = a.slice(1).join(' ') || subject; }
  try { const r = await askOwner(subject, body.replace(/\n/g, '<br>')); console.log('sent', JSON.stringify(r)); }
  catch (e) { console.log('FAIL', e.message); process.exit(1); }
})();
