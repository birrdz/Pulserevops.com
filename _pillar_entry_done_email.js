// Per-entry Resend email when a pillar image fix completes one Q&A (any pillar).
// Usage: await notifyPillarEntryDone({ id, title, url, phase, grade, imageCount })
'use strict';

const fs = require('fs');
const WD = __dirname;
const RECIPIENT = 'koryjordanwhite@gmail.com';
const KEY_CACHE = WD + '/_ask_owner_key.cache';
const LOG_F = WD + '/_pillar_entry_done_email.log';
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

for (const l of (() => {
  try { return fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/); } catch (e) { return []; }
})()) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const { pillarUrl } = require('./_ranking_list_rebuild_lib');

function env(k) {
  try {
    const m = fs.readFileSync(WD + '/.env.local', 'utf8').match(new RegExp('^' + k + '=(.+)$', 'm'));
    return m ? m[1].trim() : '';
  } catch (e) {
    return '';
  }
}

function log(msg) {
  const line = new Date().toISOString() + ' ' + msg;
  try { fs.appendFileSync(LOG_F, line + '\n'); } catch (e) {}
  console.log('[pillar-email] ' + msg);
}

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function pillarOf(id) {
  const m = String(id).match(/^([a-z]+)\d/i);
  return m ? m[1].toLowerCase() : '';
}

async function resendKey() {
  let k = env('resendapikey') || env('RESEND_API_KEY') || env('RESENDAPIKEY');
  if (k) return k;
  try { k = fs.readFileSync(KEY_CACHE, 'utf8').trim(); if (k) return k; } catch (e) {}
  const TOKEN = env('NETLIFY_AUTH_TOKEN');
  if (!TOKEN) throw new Error('no resend key');
  const s = await fetch('https://api.netlify.com/api/v1/sites/' + SITE, { headers: { Authorization: 'Bearer ' + TOKEN } }).then((r) => r.json());
  const acct = s.account_slug || s.account_name;
  const r = await fetch('https://api.netlify.com/api/v1/accounts/' + acct + '/env/resendapikey?site_id=' + SITE, { headers: { Authorization: 'Bearer ' + TOKEN } });
  if (!r.ok) throw new Error('netlify env ' + r.status);
  const j = await r.json();
  const val = (j.values || []).find((v) => v.context === 'all' || v.context === 'production') || (j.values || [])[0];
  k = val && val.value;
  if (!k) throw new Error('no resend key');
  try { fs.writeFileSync(KEY_CACHE, k); } catch (e) {}
  return k;
}

/**
 * Email owner when one entry finishes pillar image fix.
 * @returns {{ sent: boolean, reason?: string }}
 */
async function notifyPillarEntryDone(opts) {
  opts = opts || {};
  const id = String(opts.id || '').toLowerCase();
  if (!/^[a-z]+\d+$/i.test(id)) return { sent: false, reason: 'bad_id' };
  if (process.env.PILLAR_IMAGE_EMAIL_EACH === '0') return { sent: false, reason: 'disabled' };

  const title = opts.title || opts.question || id;
  const url = opts.url || pillarUrl(id);
  const pill = pillarOf(id).toUpperCase();
  const phase = opts.phase || 'images';
  const grade = opts.grade != null ? opts.grade : '';
  const imgs = opts.imageCount != null ? opts.imageCount : '';
  const subject = '✅ ' + id + ' · ' + String(title).slice(0, 66);

  const html = '<div style="font-family:system-ui,Arial,sans-serif;font-size:15px;line-height:1.6;color:#15110d;max-width:640px">' +
    '<p style="font-size:18px;font-weight:800;margin:0 0 8px">✅ ' + esc(id) + ' · pillar image fix done</p>' +
    '<p style="margin:0 0 4px;font-size:13px;color:#0b57d0;font-weight:700">' + esc(pill) + ' · ' + esc(phase) + '</p>' +
    '<p style="margin:0 0 12px;font-weight:700">' + esc(title) + '</p>' +
    '<p style="margin:0 0 6px"><a href="' + esc(url) + '" style="color:#0b57d0;font-weight:700;text-decoration:underline">' + esc(url) + '</a></p>' +
    (grade !== '' ? '<p style="margin:8px 0 0;font-size:13px;color:#5a4f42">Grade: <b>' + esc(String(grade)) + '/13</b>' +
      (imgs !== '' ? ' · Images: <b>' + esc(String(imgs)) + '</b>' : '') + '</p>' : '') +
    '<p style="color:#8a7a63;font-size:12px;margin-top:14px">' + new Date().toLocaleString() + ' · pillar image rollout</p></div>';

  const key = await resendKey();
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'PULSE Engine <onboarding@resend.dev>',
      to: [RECIPIENT],
      subject,
      html,
    }),
  });
  const txt = await r.text();
  if (!r.ok) throw new Error('resend ' + r.status + ' ' + txt.slice(0, 160));
  log('sent · ' + id + ' · ' + url);
  return { sent: true, subject };
}

module.exports = { notifyPillarEntryDone, RECIPIENT, pillarUrl };

if (require.main === module) {
  (async () => {
    const id = (process.argv.find((a) => a.startsWith('--id=')) || '').split('=')[1] || 'hf0001';
    const r = await notifyPillarEntryDone({
      id,
      title: process.argv.find((a) => a.startsWith('--title='))?.split('=').slice(1).join('=') || 'Test entry',
      phase: 'test',
      grade: 13,
      imageCount: 10,
    });
    console.log(JSON.stringify(r, null, 2));
  })().catch((e) => { console.error(e.message); process.exit(1); });
}
