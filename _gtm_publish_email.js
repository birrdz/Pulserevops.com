// _gtm_publish_email.js — emails the owner each NEW gp (GTM) entry's link as it publishes 13/13 (owner 2026-07-06).
// Published = appears in _index.json. Snapshots existing gp ids at start; emails new ones via Resend. Stops after
// EXPECT new ones (default 10) or _gtm_publish_email_stop.flag. Uses Resend (owner's chosen email tool).
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const RECIPIENT = 'koryjordanwhite@gmail.com';
const KEY_CACHE = WD + '/_ask_owner_key.cache';
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const EXPECT = parseInt(process.env.GTM_EXPECT || '10', 10);
const STOP = WD + '/_gtm_publish_email_stop.flag';
const LOG = 'C:/Users/koryj/AppData/Local/Temp/claude/C--Users-koryj/13770b56-5042-4718-9ba0-6cd6a9b9e409/scratchpad/_gtm_publish_email.log';
for (const l of (() => { try { return fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/); } catch (e) { return []; } })()) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: SITE, token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const sleep = ms => new Promise(r => setTimeout(r, ms));
function env(k) { try { const m = fs.readFileSync(WD + '/.env.local', 'utf8').match(new RegExp('^' + k + '=(.+)$', 'm')); return m ? m[1].trim() : ''; } catch (e) { return ''; } }
function log(m) { const l = new Date().toISOString() + ' ' + m; console.log(l); try { fs.appendFileSync(LOG, l + '\n'); } catch (e) {} }
async function resendKey() {
  let k = env('resendapikey') || env('RESEND_API_KEY'); if (k) return k;
  try { k = fs.readFileSync(KEY_CACHE, 'utf8').trim(); if (k) return k; } catch (e) {}
  const TOKEN = env('NETLIFY_AUTH_TOKEN');
  const s = await fetch('https://api.netlify.com/api/v1/sites/' + SITE, { headers: { Authorization: 'Bearer ' + TOKEN } }).then(r => r.json());
  const acct = s.account_slug || s.account_name;
  const r = await fetch('https://api.netlify.com/api/v1/accounts/' + acct + '/env/resendapikey?site_id=' + SITE, { headers: { Authorization: 'Bearer ' + TOKEN } });
  const j = await r.json(); const val = (j.values || []).find(v => v.context === 'all' || v.context === 'production') || (j.values || [])[0];
  k = val && val.value; try { fs.writeFileSync(KEY_CACHE, k); } catch (e) {}
  return k;
}
async function gpEntries() {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const m = {}; for (const e of (idx.entries || [])) if (e && e.id && /^gp\d+$/.test(e.id)) m[e.id] = e.question || '';
  return m;
}
async function emailOne(id, question) {
  const url = 'https://pulserevops.com/knowledge/' + id;
  const html = `<div style="font-family:system-ui,Arial,sans-serif;font-size:15px;color:#15110d">
    <p style="font-size:18px;font-weight:800;margin:0 0 6px">✅ New GTM Q&amp;A published — 13/13</p>
    <p style="margin:0 0 8px"><b>${id}</b></p>
    <p style="margin:0 0 8px">${String(question || '').replace(/</g, '&lt;')}</p>
    <p style="margin:0"><a href="${url}" style="color:#0b57d0;font-weight:700">${url}</a></p>
  </div>`;
  const key = await resendKey();
  const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: 'PULSE Engine <onboarding@resend.dev>', to: [RECIPIENT], subject: '✅ New GTM Q&A published: ' + id, html }) });
  if (!r.ok) throw new Error('resend ' + r.status + ' ' + (await r.text()).slice(0, 120));
}
(async () => {
  try { fs.unlinkSync(STOP); } catch (e) {}
  const baseline = await gpEntries();
  const seen = new Set(Object.keys(baseline));
  log('watching for new gp entries (baseline ' + seen.size + '); will email up to ' + EXPECT + ' new links');
  let emailed = 0, idleTicks = 0;
  while (!fs.existsSync(STOP) && emailed < EXPECT && idleTicks < 240) { // ~2h safety cap
    await sleep(30000);
    let cur; try { cur = await gpEntries(); } catch (e) { log('idx err ' + e.message); continue; }
    const fresh = Object.keys(cur).filter(id => !seen.has(id));
    if (!fresh.length) { idleTicks++; continue; }
    idleTicks = 0;
    for (const id of fresh) {
      seen.add(id);
      try { await emailOne(id, cur[id]); emailed++; log('emailed ' + id + ' (' + emailed + '/' + EXPECT + ')'); }
      catch (e) { log('email fail ' + id + ' ' + e.message); }
    }
  }
  log('done — emailed ' + emailed + ' new gp links');
})().catch(e => { log('FATAL ' + e.message); process.exit(1); });
