// _aq_progress_email.js — email the owner the aquarium pollinator-cover progress every 15 min
// (owner 2026-07-03 explicit request — bypasses _emails_off.flag like _ask_owner.js). Reads TRUE
// progress from the index (aq entries with cover_src==='flux') + recent rate from cover file mtimes
// + drip indexing state. Sends one immediately, then every 15 min. Stop: _aq_progress_email_stop.flag.
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const RECIPIENT = 'koryjordanwhite@gmail.com';
const KEY_CACHE = WD + '/_ask_owner_key.cache';
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const STOP = WD + '/_aq_progress_email_stop.flag';
const INTERVAL = 15 * 60 * 1000;
const env = k => { try { const m = fs.readFileSync(WD + '/.env.local', 'utf8').match(new RegExp('^' + k + '=(.+)$', 'm')); return m ? m[1].trim() : ''; } catch (e) { return ''; } };
for (const l of (() => { try { return fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/); } catch (e) { return []; } })()) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: SITE, token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function resendKey() {
  let k = env('resendapikey') || env('RESEND_API_KEY'); if (k) return k;
  try { k = fs.readFileSync(KEY_CACHE, 'utf8').trim(); if (k) return k; } catch (e) {}
  const TOKEN = env('NETLIFY_AUTH_TOKEN');
  const s = await fetch('https://api.netlify.com/api/v1/sites/' + SITE, { headers: { Authorization: 'Bearer ' + TOKEN } }).then(r => r.json());
  const acct = s.account_slug || s.account_name;
  const r = await fetch('https://api.netlify.com/api/v1/accounts/' + acct + '/env/resendapikey?site_id=' + SITE, { headers: { Authorization: 'Bearer ' + TOKEN } });
  if (!r.ok) throw new Error('netlify env ' + r.status);
  const j = await r.json();
  const val = (j.values || []).find(v => v.context === 'all' || v.context === 'production') || (j.values || [])[0];
  k = val && val.value; if (!k) throw new Error('no resend key'); try { fs.writeFileSync(KEY_CACHE, k); } catch (e) {}
  return k;
}
function recentRate() {
  try {
    const dir = WD + '/assets/qa';
    const ts = fs.readdirSync(dir).filter(f => /^aq\d+\.jpg$/.test(f)).map(f => fs.statSync(dir + '/' + f).mtimeMs).sort((a, b) => a - b).slice(-15);
    if (ts.length < 3) return null;
    let s = 0; for (let i = 1; i < ts.length; i++) s += (ts[i] - ts[i - 1]);
    return Math.round(s / (ts.length - 1) / 1000);
  } catch (e) { return null; }
}
async function send() {
  const N = parseInt(process.env.SKIM_N || '40', 10);
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const es = idx.entries || [];
  const isFlux = e => e && e.cover_src === 'flux';
  // SKIM target = newest-N per real pillar (the homepage-visible set)
  const byP = {};
  for (const e of es) { if (!e || !e.id) continue; const p = (e.id.match(/^[a-z]+/) || [''])[0]; if (!/^[a-z]{2,3}$/.test(p) || p === 'vq') continue; (byP[p] = byP[p] || []).push(e); }
  let skimTarget = 0, skimDone = 0;
  for (const p of Object.keys(byP)) { const top = byP[p].sort((a, b) => (b.ts || 0) - (a.ts || 0)).slice(0, N); skimTarget += top.length; skimDone += top.filter(isFlux).length; }
  const skimPct = skimTarget ? Math.round(skimDone / skimTarget * 1000) / 10 : 0;
  // aquariums full-pillar progress
  const aq = es.filter(e => e && /^aq\d+$/.test(e.id));
  const aqDone = aq.filter(isFlux).length;
  // site-wide pollinator covers
  const siteFlux = es.filter(isFlux).length;
  const rate = recentRate();
  const remaining = skimTarget - skimDone;
  const etaMin = rate ? Math.round(remaining * rate / 60) : null;
  const idxN = es.filter(e => e && e.was_indexed_at).length;
  const unindexed = es.length - idxN;
  let dripToday = 0; try { const d = JSON.parse(fs.readFileSync(WD + '/_indexnow_drip_day.json', 'utf8')); dripToday = d.n || 0; } catch (e) {}
  const subject = `🃏 Skim ${skimDone}/${skimTarget} (${skimPct}%) · aq ${aqDone}/${aq.length}`;
  const html = `<div style="font-family:system-ui,Arial,sans-serif;font-size:15px;line-height:1.6;color:#15110d">
    <p style="font-size:18px;font-weight:800;margin:0 0 8px">🃏 Homepage skim (top-${N}/pillar) — ${skimDone}/${skimTarget} (${skimPct}%)</p>
    <table style="border-collapse:collapse;font-size:14px">
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Skim done (flux)</td><td style="font-weight:700">${skimDone} / ${skimTarget}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Skim remaining</td><td>${remaining}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Recent rate</td><td>${rate ? rate + 's/cover' : 'n/a'}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">ETA skim</td><td>${etaMin != null ? (etaMin >= 60 ? (Math.round(etaMin / 6) / 10) + ' h' : etaMin + ' min') : 'n/a'}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Aquariums (full)</td><td>${aqDone} / ${aq.length}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Site pollinator covers</td><td>${siteFlux}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Indexing (drip today)</td><td>${dripToday} pinged · ${unindexed} un-indexed left</td></tr>
    </table>
    <p style="color:#8a7a63;font-size:12px;margin-top:12px">Auto ping every 15 min · ${new Date().toLocaleString()} · pollinator-only, one-at-a-time · skim first → then finish aquariums</p>
  </div>`;
  const key = await resendKey();
  const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: 'PULSE Engine <onboarding@resend.dev>', to: [RECIPIENT], subject, html }) });
  const txt = await r.text(); if (!r.ok) throw new Error('resend ' + r.status + ' ' + txt.slice(0, 160));
  console.log(new Date().toISOString() + ' sent · skim ' + skimDone + '/' + skimTarget + ' (' + skimPct + '%) · aq ' + aqDone + '/' + aq.length);
}
(async () => {
  console.log('[aq-progress-email] up — every 15 min to ' + RECIPIENT);
  while (!fs.existsSync(STOP)) {
    try { await send(); } catch (e) { console.log('send ERR ' + e.message); }
    for (let i = 0; i < 90 && !fs.existsSync(STOP); i++) await sleep(INTERVAL / 90);   // ~15 min, checks stop flag often
  }
  console.log('[aq-progress-email] stop flag — exiting');
})();
