// Email corrected Q&A gold template + fixed live reference for owner approval.
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const RECIPIENT = 'koryjordanwhite@gmail.com';
const KEY_CACHE = WD + '/_ask_owner_key.cache';
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

const {
  QA_GOLD_ID,
  QA_GOLD_URL,
  QA_TEMPLATE_OUTLINE,
  auditGoldReferenceQa,
} = require('./_qa_gold_template');
const { VISUAL_LOCK_IMAGE_RENDER_LAW } = require('./_visual_lock_law');

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

(async () => {
  let audit = { compliant: false, issues: ['not checked'] };
  let title = QA_GOLD_ID;
  try {
    for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
      const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
    const { getStore } = require('@netlify/blobs');
    const store = getStore({
      name: 'pulse-machine-library',
      siteID: SITE,
      token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
    });
    const e = await store.get('answers/' + QA_GOLD_ID + '.json', { type: 'json' });
    title = (e && e.question) || title;
    if (e && e.answer) audit = auditGoldReferenceQa(e.answer, title);
  } catch (e) {}

  const key = await resendKey();
  const status = audit.compliant
    ? '✅ Live reference reshaped and passes gold audit'
    : '⚠️ Review needed — issues: ' + (audit.issues || []).join(', ');

  const outline = QA_TEMPLATE_OUTLINE + '\n\nVISUAL LOCK:\n' + VISUAL_LOCK_IMAGE_RENDER_LAW;

  const html = `<div style="font-family:system-ui,Arial,sans-serif;font-size:15px;line-height:1.6;color:#15110d;max-width:640px">
    <p style="font-size:20px;font-weight:800;margin:0 0 8px">🔒 Q&A GOLD TEMPLATE — READY FOR YOUR REVIEW</p>
    <p style="margin:0 0 12px"><b>ID:</b> <code>${esc(QA_GOLD_ID)}</code><br>
    <b>Title:</b> ${esc(title)}<br>
    <b>Live page (reshaped):</b> <a href="${QA_GOLD_URL}" style="color:#0b57d0;font-weight:700">${esc(QA_GOLD_URL)}</a></p>
    <p style="margin:0 0 12px;padding:10px 12px;background:${audit.compliant ? '#e8f5e9' : '#fff3e0'};border-radius:6px"><b>${esc(status)}</b></p>
    <p style="margin:0 0 8px;color:#6b5d49"><b>Please open the live page and confirm this layout is right.</b> No other essay rewrites will start until you approve.</p>
    <p style="margin:0 0 8px;font-weight:700">Corrected reading order:</p>
    <ol style="margin:0 0 12px;padding-left:20px;line-height:1.7">
      <li>Title (H1)</li>
      <li><code>## Direct Answer</code> — gold border box at render; <b>no top hero before this</b></li>
      <li>Content H2s: text block → one image → text → image (never stacked)</li>
      <li>CRO card at render after DA → text → image → text</li>
      <li>FAQ → Sources → Related on PULSE</li>
    </ol>
    <pre style="background:#f6f3ee;border:1px solid #e0d8cc;padding:14px 16px;font-size:12px;line-height:1.5;white-space:pre-wrap;word-break:break-word">${esc(outline)}</pre>
    <p style="margin-top:14px"><a href="${QA_GOLD_URL}" style="display:inline-block;background:#C8821E;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:700">Open live gold page — q11133</a></p>
    <p style="color:#8a7a63;font-size:12px;margin-top:12px">${new Date().toLocaleString()} · awaiting owner approval before batch rewrites</p>
  </div>`;

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'PULSE Engine <onboarding@resend.dev>',
      to: [RECIPIENT],
      subject: '🔒 Q&A GOLD TEMPLATE — review q11133 before batch (' + QA_GOLD_ID + ')',
      html,
    }),
  });
  const txt = await r.text();
  if (!r.ok) throw new Error('resend ' + r.status + ' ' + txt.slice(0, 200));
  console.log('sent review email → ' + RECIPIENT + ' · audit compliant=' + audit.compliant);
})().catch(e => { console.error(e.message); process.exit(1); });
