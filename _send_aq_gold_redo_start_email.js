// One-shot start notification — Aquarium dual gold template redo.
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const RECIPIENT = 'koryjordanwhite@gmail.com';
const KEY_CACHE = WD + '/_ask_owner_key.cache';
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

for (const l of (() => {
  try { return fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/); } catch (e) { return []; }
})()) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const { getStore } = require('@netlify/blobs');
const { pickGoldTemplate } = require('./_pulse_gold_template_router');

function env(k) {
  try {
    const m = fs.readFileSync(WD + '/.env.local', 'utf8').match(new RegExp('^' + k + '=(.+)$', 'm'));
    return m ? m[1].trim() : '';
  } catch (e) {
    return '';
  }
}

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function resendKey() {
  let k = env('resendapikey') || env('RESEND_API_KEY');
  if (k) return k;
  try { k = fs.readFileSync(KEY_CACHE, 'utf8').trim(); if (k) return k; } catch (e) {}
  const TOKEN = env('NETLIFY_AUTH_TOKEN');
  const s = await fetch('https://api.netlify.com/api/v1/sites/' + SITE, { headers: { Authorization: 'Bearer ' + TOKEN } }).then(r => r.json());
  const acct = s.account_slug || s.account_name;
  const r = await fetch('https://api.netlify.com/api/v1/accounts/' + acct + '/env/resendapikey?site_id=' + SITE, { headers: { Authorization: 'Bearer ' + TOKEN } });
  if (!r.ok) throw new Error('netlify env ' + r.status);
  const j = await r.json();
  const val = (j.values || []).find(v => v.context === 'all' || v.context === 'production') || (j.values || [])[0];
  k = val && val.value;
  if (!k) throw new Error('no resend key');
  try { fs.writeFileSync(KEY_CACHE, k); } catch (e) {}
  return k;
}

(async () => {
  const store = getStore({
    name: 'pulse-machine-library',
    siteID: SITE,
    token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
  });

  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const rows = (idx.entries || []).filter(e => e && /^aq\d+$/i.test(e.id));
  let top10 = 0;
  let qa = 0;
  let other = 0;

  for (const row of rows) {
    let body = '';
    try {
      const e = await store.get('answers/' + row.id + '.json', { type: 'json' });
      body = e && e.answer ? e.answer : '';
    } catch (err) {}
    const route = pickGoldTemplate(row.id, body, row.question || '');
    if (route.template === 'top10') top10++;
    else if (route.template === 'qa') qa++;
    else other++;
  }

  let progress = {};
  try { progress = JSON.parse(fs.readFileSync(WD + '/_aq_gold_redo_progress.json', 'utf8')); } catch (e) {}

  const queued = progress.queued || (top10 + qa);
  const logPath = '_aq_gold_redo_batch.log';

  const html = `<div style="font-family:system-ui,Arial,sans-serif;font-size:15px;line-height:1.6;color:#15110d;max-width:720px">
    <p style="font-size:18px;font-weight:800;margin:0 0 8px">🐠 Aquarium redo started</p>
    <p style="margin:0 0 12px;color:#6b5d49"><b>You will get one email per 13/13 entry</b> (immediate, not batched). Plus a progress ping every 5 minutes.</p>
    <p style="margin:0 0 12px;color:#6b5d49"><b>Top 10 entries</b> use <a href="https://pulserevops.com/aquariums/aq1158">aq1158</a> law. <b>Q&amp;A entries</b> use <a href="https://pulserevops.com/knowledge/q11133">q11133</a> law.</p>
    <table style="border-collapse:collapse;font-size:14px">
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Total aq entries</td><td><b>${rows.length}</b></td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Top 10 (ranking)</td><td><b>${top10}</b></td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Q&amp;A (essay)</td><td><b>${qa}</b></td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Queued this run</td><td><b>${queued}</b></td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Other / skip</td><td>${other}</td></tr>
    </table>
    <p style="font-weight:700;margin:16px 0 6px">Rule files</p>
    <ul style="margin:0;padding-left:18px">
      <li><code>.cursor/rules/pulse-template-selection.mdc</code></li>
      <li><code>_pulse_gold_template_router.js</code></li>
      <li><code>_ranking_top10_gold_template.js</code> (aq1158)</li>
      <li><code>_qa_gold_template.js</code> (q11133)</li>
    </ul>
    <p style="margin-top:14px;color:#8a7a63;font-size:13px">Log: <code>${esc(logPath)}</code> · Progress pings every 5 min · ${new Date().toLocaleString()}</p>
  </div>`;

  const key = await resendKey();
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'PULSE Engine <onboarding@resend.dev>',
      to: [RECIPIENT],
      subject: '🐠 Aquarium redo started — one email per 13/13 entry',
      html,
    }),
  });
  const txt = await r.text();
  if (!r.ok) throw new Error('resend ' + r.status + ' ' + txt.slice(0, 200));

  console.log('EMAIL_SENT', RECIPIENT, 'total=' + rows.length, 'top10=' + top10, 'qa=' + qa, 'queued=' + queued);
})().catch(err => {
  console.error('ERR', err.message);
  process.exit(1);
});
