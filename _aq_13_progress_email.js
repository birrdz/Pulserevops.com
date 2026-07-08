// Email owner Aquariums 13/13 scrub progress every 25 min via Resend (owner explicit request).
// Bypasses _emails_off.flag. Stop: touch _aq_13_progress_email_stop.flag
const fs = require('fs');
const path = require('path');

const WD = 'C:/Users/koryj/website';
const BASE = 'http://localhost:8899';
const RECIPIENT = 'koryjordanwhite@gmail.com';
const KEY_CACHE = WD + '/_ask_owner_key.cache';
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const STOP = WD + '/_aq_13_progress_email_stop.flag';
const PROGRESS_F = WD + '/_aq_13_progress.json';
const INTERVAL_MS = 5 * 60 * 1000;
const PILLAR = 'aq';

const env = k => {
  try {
    const m = fs.readFileSync(WD + '/.env.local', 'utf8').match(new RegExp('^' + k + '=(.+)$', 'm'));
    return m ? m[1].trim() : '';
  } catch (e) {
    return '';
  }
};

for (const l of (() => {
  try { return fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/); } catch (e) { return []; }
})()) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

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

async function fetchJson(url) {
  const r = await fetch(url, { signal: AbortSignal.timeout(15000) });
  return r.json();
}

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function send() {
  let progress = {};
  let status = {};
  let local = {};
  try { progress = await fetchJson(BASE + '/pillar-progress-data'); } catch (e) {}
  try { status = await fetchJson(BASE + '/scrub-status'); } catch (e) {}
  try { local = JSON.parse(fs.readFileSync(PROGRESS_F, 'utf8')); } catch (e) {}

  const aq = (progress.pillars || []).find(p => p.p === PILLAR) || {};
  const at13 = aq.at13 || local.at13 || 0;
  const total = aq.total || local.total || 900;
  const inQueue = aq.inQueue != null ? aq.inQueue : (local.inQueue != null ? local.inQueue : (status.queueByPillar || {})[PILLAR]);
  const done = Math.max(0, total - (inQueue || 0));
  const pct13 = aq.pct13 != null ? aq.pct13 : (total ? Math.round(at13 / total * 1000) / 10 : 0);
  const pctDone = total ? Math.round(done / total * 1000) / 10 : 0;
  const running = !!(status.running || status.scrubBusy || local.running);
  const curId = status.current || status.activeId || status.scrubLive?.id || local.currentId || '—';
  const curTitle = esc(status.scrubLive?.title || local.currentTitle || '');
  const stage = esc(status.stage || status.scrubLive?.stage || local.stage || (running ? 'running' : 'idle'));
  const certifiedRun = status.certified != null ? status.certified : (local.certifiedThisRun || 0);
  const recent = (progress.recent || []).filter(r => r.pillar === PILLAR).slice(0, 5);
  const recentHtml = recent.length
    ? recent.map(r => '<li><a href="' + esc(r.url) + '">' + esc(r.id) + '</a> · ' + esc(r.title) + '</li>').join('')
    : '<li style="color:#8a7a63">No recent 13/13 completions yet this session</li>';

  const subject = '🐠 Aquariums 13/13 · ' + at13 + '/' + total + ' certified · queue ' + (inQueue || 0) + ' left';
  const html = `<div style="font-family:system-ui,Arial,sans-serif;font-size:15px;line-height:1.6;color:#15110d">
    <p style="font-size:18px;font-weight:800;margin:0 0 8px">🐠 Aquariums → 13/13 scrub</p>
    <table style="border-collapse:collapse;font-size:14px">
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">At 13/13 (index)</td><td style="font-weight:700">${at13} / ${total} (${pct13}%)</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Scrub queue left</td><td>${inQueue || 0} · ${done}/${total} processed (${pctDone}%)</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Status</td><td>${running ? '🟢 running' : '⏸ idle/stopped'} · ${stage}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Current entry</td><td>${esc(curId)}${curTitle ? ' — ' + curTitle : ''}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Certified this run</td><td>${certifiedRun}</td></tr>
    </table>
    <p style="font-weight:700;margin:16px 0 6px">Recent 13/13</p>
    <ul style="margin:0;padding-left:18px">${recentHtml}</ul>
    <p style="margin-top:14px"><a href="http://localhost:8899/pillar-progress">Live pillar map</a> · <a href="https://pulserevops.com/aquariums">Aquariums hub</a></p>
    <p style="color:#8a7a63;font-size:12px;margin-top:12px">Auto ping every 5 min · ${new Date().toLocaleString()} · stop: _aq_13_progress_email_stop.flag</p>
  </div>`;

  const key = await resendKey();
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'PULSE Engine <onboarding@resend.dev>', to: [RECIPIENT], subject, html }),
  });
  const txt = await r.text();
  if (!r.ok) throw new Error('resend ' + r.status + ' ' + txt.slice(0, 160));
  console.log(new Date().toISOString() + ' sent · aq ' + at13 + '/' + total + ' · queue ' + (inQueue || 0));
}

(async () => {
  try { fs.unlinkSync(STOP); } catch (e) {}
  console.log('[aq-13-progress-email] up — every 5 min to ' + RECIPIENT);
  while (!fs.existsSync(STOP)) {
    try { await send(); } catch (e) { console.log('send ERR ' + e.message); }
    for (let i = 0; i < 150 && !fs.existsSync(STOP); i++) await sleep(INTERVAL_MS / 150);
  }
  console.log('[aq-13-progress-email] stop flag — exiting');
})();
