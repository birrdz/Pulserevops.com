// _facecard_resend_email.js — Resend email after each face-card cover (owner 2026-07-06)
'use strict';
const fs = require('fs');
const path = require('path');

const WD = path.join(__dirname);
const RECIP = 'koryjordanwhite@gmail.com';
const COVDIR = WD + '/assets/qa';
const KEY_CACHE = WD + '/_ask_owner_key.cache';
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

function env(k) {
  try {
    const m = fs.readFileSync(WD + '/.env.local', 'utf8').match(new RegExp('^' + k + '=(.+)$', 'm'));
    return m ? m[1].trim() : '';
  } catch (e) {
    return '';
  }
}

function esc(s) {
  return String(s == null ? '' : s).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
}

async function resendKey() {
  let k =
    process.env.RESEND_API_KEY ||
    process.env.resendapikey ||
    process.env.RESENDAPIKEY ||
    env('resendapikey') ||
    env('RESEND_API_KEY');
  if (k) return k;
  try {
    k = fs.readFileSync(KEY_CACHE, 'utf8').trim();
    if (k) return k;
  } catch (e) {}
  const TOKEN = process.env.NETLIFY_AUTH_TOKEN || env('NETLIFY_AUTH_TOKEN');
  if (!TOKEN) throw new Error('no resend key');
  const s = await fetch('https://api.netlify.com/api/v1/sites/' + SITE, {
    headers: { Authorization: 'Bearer ' + TOKEN },
  }).then((r) => r.json());
  const acct = s.account_slug || s.account_name;
  const r = await fetch(
    'https://api.netlify.com/api/v1/accounts/' + acct + '/env/resendapikey?site_id=' + SITE,
    { headers: { Authorization: 'Bearer ' + TOKEN } },
  );
  if (!r.ok) throw new Error('netlify env ' + r.status);
  const j = await r.json();
  const val = (j.values || []).find((v) => v.context === 'all' || v.context === 'production') || (j.values || [])[0];
  k = val && val.value;
  if (!k) throw new Error('no resend key');
  try {
    fs.writeFileSync(KEY_CACHE, k);
  } catch (e) {}
  return k;
}

/**
 * @param {{ id: string, question: string, kb?: number, source?: string }} opts
 */
async function sendFaceCardEmail({ id, question, kb, source }) {
  if (process.env.SKIP_FACE_CARD_EMAIL === '1') return { ok: false, skipped: true };
  const att = [];
  try {
    att.push({
      filename: id + '.jpg',
      content: fs.readFileSync(COVDIR + '/' + id + '.jpg').toString('base64'),
    });
  } catch (e) {}
  const pageUrl = 'https://pulserevops.com/knowledge/' + id;
  const imgUrl = 'https://pulserevops.com/assets/qa/' + id + '.jpg';
  const html =
    '<div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:560px;color:#15110d">' +
    '<h2 style="font-family:Georgia,serif;margin:0 0 10px">🖼️ Face card · ' +
    esc(id) +
    '</h2>' +
    '<p style="margin:0 0 6px;color:#3a3229">' +
    esc(question) +
    '</p>' +
  (kb ? '<p style="margin:0 0 8px;font-size:13px;color:#6b5d49">' + kb + ' KB · pollinator flux</p>' : '') +
    '<p style="margin:0 0 8px"><a href="' +
    pageUrl +
    '" style="color:#0b57d0;font-weight:700">' +
    pageUrl +
    '</a></p>' +
    '<p style="margin:0 0 8px"><a href="' +
    imgUrl +
    '" style="color:#0b57d0">' +
    imgUrl +
    '</a></p>' +
    (att.length
      ? '<p style="font-size:12px;color:#6b5d49;margin:0">Cover attached ↓ (mosaic updates on deploy).</p>'
      : '<p style="font-size:12px;color:#b23;margin:0">Cover file not found locally — blob still updated.</p>') +
    (source ? '<p style="font-size:11px;color:#8a7a63;margin:8px 0 0">' + esc(source) + '</p>' : '') +
    '</div>';
  const key = await resendKey();
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'PULSE Engine <onboarding@resend.dev>',
      to: [RECIP],
      subject: '🖼️ Face card · ' + id,
      html,
      attachments: att,
    }),
  });
  if (!r.ok) {
    const txt = await r.text();
    throw new Error('resend ' + r.status + ' ' + txt.slice(0, 160));
  }
  return { ok: true };
}

module.exports = { sendFaceCardEmail, resendKey, RECIP };
