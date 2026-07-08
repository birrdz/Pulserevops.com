// One-shot: email each golden template individually (owner review).
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const RECIPIENT = 'koryjordanwhite@gmail.com';
const KEY_CACHE = WD + '/_ask_owner_key.cache';
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

const { TOP10_GOLD_ID, TOP10_GOLD_URL, TOP10_TEMPLATE_OUTLINE } = require('./_ranking_top10_gold_template');
const { QA_GOLD_ID, QA_GOLD_URL, QA_TEMPLATE_OUTLINE } = require('./_qa_gold_template');

function env(k) {
  try {
    const m = fs.readFileSync(WD + '/.env.local', 'utf8').match(new RegExp('^' + k + '=(.+)$', 'm'));
    return m ? m[1].trim() : '';
  } catch (e) { return ''; }
}

async function resendKey() {
  let k = env('resendapikey') || env('RESEND_API_KEY');
  if (k) return k;
  try { k = fs.readFileSync(KEY_CACHE, 'utf8').trim(); if (k) return k; } catch (e) {}
  const TOKEN = env('NETLIFY_AUTH_TOKEN');
  const s = await fetch('https://api.netlify.com/api/v1/sites/' + SITE, { headers: { Authorization: 'Bearer ' + TOKEN } }).then(r => r.json());
  const acct = s.account_slug || s.account_name;
  const r = await fetch('https://api.netlify.com/api/v1/accounts/' + acct + '/env/resendapikey?site_id=' + SITE, { headers: { Authorization: 'Bearer ' + TOKEN } });
  const j = await r.json();
  const val = (j.values || []).find(v => v.context === 'all' || v.context === 'production') || (j.values || [])[0];
  k = val && val.value;
  if (!k) throw new Error('no resend key');
  return k;
}

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function sendOne(key, tpl) {
  const html = `<div style="font-family:system-ui,Arial,sans-serif;font-size:15px;line-height:1.6;color:#15110d;max-width:640px">
    <p style="font-size:20px;font-weight:800;margin:0 0 8px">🔒 GOLD TEMPLATE — ${esc(tpl.label)}</p>
    <p style="margin:0 0 12px"><b>ID:</b> <code>${esc(tpl.id)}</code><br>
    <b>Live reference:</b> <a href="${tpl.url}" style="color:#0b57d0;font-weight:700">${esc(tpl.url)}</a></p>
    <p style="margin:0 0 8px;color:#6b5d49">Immutable shape — new content + new images per entry only. Do not regenerate or restyle this reference.</p>
    <pre style="background:#f6f3ee;border:1px solid #e0d8cc;padding:14px 16px;font-size:12px;line-height:1.5;white-space:pre-wrap;word-break:break-word">${esc(tpl.outline)}</pre>
    <p style="margin-top:14px"><a href="${tpl.url}" style="display:inline-block;background:#C8821E;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:700">Open live gold page</a></p>
    <p style="color:#8a7a63;font-size:12px;margin-top:12px">${new Date().toLocaleString()} · AQ batch stopped per owner</p>
  </div>`;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'PULSE Engine <onboarding@resend.dev>',
      to: [RECIPIENT],
      subject: '🔒 GOLD TEMPLATE — ' + tpl.label + ' (' + tpl.id + ')',
      html,
    }),
  });
  const txt = await r.text();
  if (!r.ok) throw new Error('resend ' + r.status + ' ' + txt.slice(0, 160));
  console.log('sent · ' + tpl.id + ' → ' + RECIPIENT);
}

(async () => {
  const key = await resendKey();
  await sendOne(key, {
    label: 'Q&A Essay — CORRECTED LAW (owner 2026-07-06)',
    id: QA_GOLD_ID,
    url: QA_GOLD_URL,
    outline: QA_TEMPLATE_OUTLINE,
  });
})().catch(e => { console.error(e.message); process.exit(1); });
