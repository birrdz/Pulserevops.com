// Site-wide image fix progress email — every 5 min to owner.
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const RECIPIENT = 'koryjordanwhite@gmail.com';
const KEY_CACHE = WD + '/_ask_owner_key.cache';
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const STOP = WD + '/_site_image_fix_email_stop.flag';
const PROGRESS_F = WD + '/_site_image_fix_progress.json';
const LOG_F = WD + '/_site_image_fix_email.log';
const INTERVAL_MS = 5 * 60 * 1000;
const ONCE = process.argv.includes('--once');

for (const l of (() => {
  try { return fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/); } catch (e) { return []; }
})()) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
let firstSend = true;

function log(msg) {
  const line = new Date().toISOString() + ' ' + msg;
  console.log(line);
  try { fs.appendFileSync(LOG_F, line + '\n'); } catch (e) {}
}

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function resendKey() {
  let k = process.env.resendapikey || process.env.RESEND_API_KEY;
  if (k) return k;
  try { k = fs.readFileSync(KEY_CACHE, 'utf8').trim(); if (k) return k; } catch (e) {}
  const TOKEN = process.env.NETLIFY_AUTH_TOKEN;
  const s = await fetch('https://api.netlify.com/api/v1/sites/' + SITE, { headers: { Authorization: 'Bearer ' + TOKEN } }).then(r => r.json());
  const acct = s.account_slug || s.account_name;
  const r = await fetch('https://api.netlify.com/api/v1/accounts/' + acct + '/env/resendapikey?site_id=' + SITE, { headers: { Authorization: 'Bearer ' + TOKEN } });
  const j = await r.json();
  const val = (j.values || []).find(v => v.context === 'all' || v.context === 'production') || (j.values || [])[0];
  k = val && val.value;
  if (!k) throw new Error('no resend key');
  return k;
}

async function send() {
  let p = {};
  try { p = JSON.parse(fs.readFileSync(PROGRESS_F, 'utf8')); } catch (e) {}

  const rk = p.ranking || {};
  const es = p.essays || {};
  const phase = esc(p.phase || 'idle');
  const running = !!p.running;
  const samples = (p.samples || []).slice(0, 5);
  const samplesHtml = samples.length
    ? samples.map(s => '<li><a href="' + esc(s.url) + '">' + esc(s.title || s.id) + '</a> · ' + esc(s.phase || '') + (s.productImgs != null ? ' · ' + s.productImgs + ' prod imgs' : s.imgs != null ? ' · ' + s.imgs + ' section imgs' : '') + '</li>').join('')
    : '<li style="color:#8a7a63">Sample links every 10–25 fixes</li>';

  const subject = firstSend
    ? '🌐 Site image fix running — ranking lists + essay answers'
    : '🌐 Site images · rank ' + (rk.fixed || 0) + '/' + (rk.total || '?') + ' · essays ' + (es.fixed || 0) + '/' + (es.total || '?');

  const html = `<div style="font-family:system-ui,Arial,sans-serif;font-size:15px;line-height:1.6;color:#15110d">
    <p style="font-size:18px;font-weight:800;margin:0 0 8px">${firstSend ? 'Got it? ✅ Site-wide image fix' : '🌐 Site-wide image fix progress'}</p>
    <p style="margin:0 0 12px;color:#6b5d49">${firstSend ? 'Ping every <b>5 minutes</b>. <b>Ranking lists</b>: product image on every pick, no top hero. <b>Essay answers</b>: images spaced occasionally through the text, no top hero.' : 'Auto ping every 5 min.'}</p>
    <table style="border-collapse:collapse;font-size:14px">
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Phase</td><td>${phase}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Status</td><td>${running ? '🟢 running' : '⏸ done/idle'} · ${esc(p.stage || '')}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Ranking lists</td><td><b>${rk.fixed || 0}</b> / ${rk.total || '?'} fixed · ${rk.failed || 0} failed · ${rk.remaining != null ? rk.remaining : '?'} left</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Essay answers</td><td><b>${es.fixed || 0}</b> / ${es.total || '?'} fixed · ${es.failed || 0} failed · ${es.remaining != null ? es.remaining : '?'} left</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Working on</td><td>${esc(p.currentId || '—')}${p.currentTitle ? ' — ' + esc(p.currentTitle) : ''}</td></tr>
    </table>
    <p style="font-weight:700;margin:16px 0 6px">Spot-check links</p>
    <ul style="margin:0;padding-left:18px">${samplesHtml}</ul>
    <p style="color:#8a7a63;font-size:12px;margin-top:12px">${new Date().toLocaleString()} · stop: _site_image_fix_email_stop.flag</p>
  </div>`;

  const key = await resendKey();
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'PULSE Engine <onboarding@resend.dev>', to: [RECIPIENT], subject, html }),
  });
  if (!r.ok) throw new Error('resend ' + r.status + ' ' + (await r.text()).slice(0, 120));
  log('sent · rank ' + (rk.fixed || 0) + '/' + (rk.total || 0) + ' · essays ' + (es.fixed || 0) + '/' + (es.total || 0));
  firstSend = false;
}

(async () => {
  try { fs.unlinkSync(STOP); } catch (e) {}
  log('[site-image-email] every 5 min → ' + RECIPIENT);
  if (ONCE) {
    try { await send(); } catch (e) { log('ERR ' + e.message); process.exit(1); }
    return;
  }
  try { await send(); } catch (e) { log('ERR ' + e.message); }
  while (!fs.existsSync(STOP)) {
    for (let i = 0; i < 150 && !fs.existsSync(STOP); i++) await sleep(INTERVAL_MS / 150);
    if (fs.existsSync(STOP)) break;
    try { await send(); } catch (e) { log('ERR ' + e.message); }
  }
})();
