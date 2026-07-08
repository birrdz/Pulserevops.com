// Pillar 13/13 scrub progress — email every 3 min (owner 2026-07-06).
// Stop: touch _pillar_13_progress_email_stop.flag
const fs = require('fs');
const { spawn } = require('child_process');

const WD = 'C:/Users/koryj/website';
const BASE = 'http://127.0.0.1:8899';
const RECIPIENT = 'koryjordanwhite@gmail.com';
const KEY_CACHE = WD + '/_ask_owner_key.cache';
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const STOP = WD + '/_pillar_13_progress_email_stop.flag';
const PROGRESS_F = WD + '/_pillar_13_progress.json';
const INTERVAL_MS = parseInt(process.env.PILLAR_13_EMAIL_MS || String(3 * 60 * 1000), 10);
const KEY = '4444';

const PILLAR_NAMES = {
  tl: 'Pulse Tools / CRO', ca: 'Cars', bt: 'Boats', aq: 'Aquariums', ik: 'Industry KPIs', tk: 'Tech Stacks',
  bs: 'Book Summaries', st: 'Sales Trainings', fr: 'Franchises', co: 'Collectibles', ai: 'AI Infrastructure',
  gb: 'Graphics', bo: 'Buildouts', sy: 'Style', cr: 'Crabbing', fs: 'Fishing', gp: 'GTM Playbooks',
  ra: 'Revenue Architecture', pt: 'Pets', es: 'Espresso', tv: 'TVs', rs: 'Resorts', cl: 'Cologne',
  lv: 'Luxury Vacations', ev: 'Events', ga: 'Gatherings', gm: 'Gaming', mv: 'Movies', wl: 'Wellness',
  dr: 'Drills', dn: 'Dining', nl: 'Nightlife', tn: 'Towns', sc: 'Schools', tc: 'Telco', er: 'Electronics',
  ce: 'Current Events', q: 'Q&A', sw: 'Software', hf: 'Home & Family',
};
const HUB_SEG = {
  pt: '/pets/', ce: '/knowledge/', cr: '/crabbing/', fs: '/fishing/', sw: '/software/',
  aq: '/aquariums/', bt: '/boats/', ca: '/cars/', dn: '/dining/', mv: '/movies/',
};

for (const l of (() => {
  try { return fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/); } catch (e) { return []; }
})()) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

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

function entryUrl(id) {
  const pre = String(id).match(/^([a-z]+)/);
  const p = pre ? pre[1] : 'knowledge';
  const seg = HUB_SEG[p] || '/knowledge/';
  return 'https://pulserevops.com' + seg + id;
}

function linkHtml(url, label) {
  const u = String(url || '').trim();
  const text = esc(label || u);
  return '<a href="' + u + '" style="color:#0b57d0;text-decoration:underline;font-weight:700" target="_blank" rel="noopener noreferrer">' + text + '</a>';
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

async function fetchJson(url) {
  const r = await fetch(url, { signal: AbortSignal.timeout(15000) });
  return r.json();
}

async function send() {
  let progress = {};
  let status = {};
  try { progress = JSON.parse(fs.readFileSync(PROGRESS_F, 'utf8')); } catch (e) {}
  try { status = await fetchJson(BASE + '/scrub-status?key=' + KEY); } catch (e) {}
  try {
    const pd = await fetchJson(BASE + '/pillar-progress-data');
    if (pd && pd.pillars) progress.pillars = pd.pillars;
  } catch (e) {}

  const pillar = progress.activePillar || status.scrubPillarFilter || '?';
  const pillarName = progress.activePillarName || PILLAR_NAMES[pillar] || pillar.toUpperCase();
  const row = (progress.pillars || []).find(p => p.p === pillar) || {};
  const total = row.n || progress.total || progress.pillarTotal || '?';
  const inQueue = row.q != null ? row.q : (status.queueFilteredLen != null ? status.queueFilteredLen : '?');
  const at13 = row.at13 || progress.at13 || 0;
  const done = total !== '?' && inQueue !== '?' ? Math.max(0, total - inQueue) : '?';
  const running = !!(status.running || status.scrubBusy || progress.running);
  const curId = status.current || status.activeId || progress.currentId || '—';
  const curTitle = esc(status.scrubLive?.title || progress.currentTitle || '');
  const stage = esc(status.stage || status.scrubLive?.stage || progress.stage || (running ? 'running' : 'idle'));
  const certified = status.certified != null ? status.certified : (progress.certifiedThisRun || 0);
  const hubUrl = HUB_SEG[pillar] ? ('https://pulserevops.com' + HUB_SEG[pillar].replace(/\/$/, '')) : 'https://pulserevops.com';

  const subject = '🎯 ' + pillarName + ' 13/13 · ' + at13 + ' certified · ' + inQueue + ' left in queue';
  const html = `<div style="font-family:system-ui,Arial,sans-serif;font-size:15px;line-height:1.6;color:#15110d">
    <p style="font-size:18px;font-weight:800;margin:0 0 8px">🎯 ${esc(pillarName)} → 13/13 + images</p>
    <table style="border-collapse:collapse;font-size:14px">
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Pillar</td><td><b>${esc(pillar)}</b> · ${esc(pillarName)}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">At 13/13</td><td style="font-weight:700">${at13}${total !== '?' ? ' / ' + total : ''}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Queue left</td><td>${inQueue}${done !== '?' ? ' · ' + done + ' processed' : ''}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Status</td><td>${running ? '🟢 running' : '⏸ idle'} · ${stage}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Current</td><td>${esc(curId)}${curTitle ? ' — ' + curTitle : ''}${curId && curId !== '—' ? '<br>' + linkHtml(entryUrl(curId), entryUrl(curId)) : ''}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Certified this run</td><td>${certified}</td></tr>
    </table>
    <p style="margin-top:14px">${linkHtml(hubUrl, pillarName + ' hub')} · ${linkHtml('http://localhost:8899/pillar-progress', 'Live pillar map')}</p>
    <p style="color:#8a7a63;font-size:12px;margin-top:12px">Auto ping every 3 min · ${new Date().toLocaleString()} · stop: _pillar_13_progress_email_stop.flag</p>
  </div>`;

  const resend = await resendKey();
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + resend, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'PULSE Engine <onboarding@resend.dev>', to: [RECIPIENT], subject, html }),
  });
  const txt = await r.text();
  if (!r.ok) throw new Error('resend ' + r.status + ' ' + txt.slice(0, 160));
  console.log(new Date().toISOString() + ' sent · ' + pillar + ' · at13=' + at13 + ' · queue=' + inQueue);
}

(async () => {
  try { fs.unlinkSync(STOP); } catch (e) {}
  console.log('[pillar-13-email] up — every ' + Math.round(INTERVAL_MS / 60000) + ' min to ' + RECIPIENT);
  while (!fs.existsSync(STOP)) {
    try { await send(); } catch (e) { console.log('send ERR ' + e.message); }
    for (let i = 0; i < 90 && !fs.existsSync(STOP); i++) await sleep(INTERVAL_MS / 90);
  }
  console.log('[pillar-13-email] stop flag — exiting');
})();
