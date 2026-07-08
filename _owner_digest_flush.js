// _owner_digest_flush.js — every 10 min, flush the owner-digest queue so partial (<25) click batches still email
// (Netlify crons are disabled). Reads the same blob queue the deployed pulse-click-notify writes. Stop: _owner_digest_flush_stop.flag
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const KEY_CACHE = WD + '/_ask_owner_key.cache';
const STOP = WD + '/_owner_digest_flush_stop.flag';
const LOG = 'C:/Users/koryj/AppData/Local/Temp/claude/C--Users-koryj/13770b56-5042-4718-9ba0-6cd6a9b9e409/scratchpad/_owner_digest_flush.log';
const INTERVAL_MS = 10 * 60 * 1000;
for (const l of (() => { try { return fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/); } catch (e) { return []; } })()) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const sleep = ms => new Promise(r => setTimeout(r, ms));
function env(k) { try { const m = fs.readFileSync(WD + '/.env.local', 'utf8').match(new RegExp('^' + k + '=(.+)$', 'm')); return m ? m[1].trim() : ''; } catch (e) { return ''; } }
function log(m) { const l = new Date().toISOString() + ' ' + m; console.log(l); try { fs.appendFileSync(LOG, l + '\n'); } catch (e) {} }
async function ensureResendKey() {
  if (process.env.RESEND_API_KEY) return;
  let k = env('resendapikey') || env('RESEND_API_KEY');
  if (!k) { try { k = fs.readFileSync(KEY_CACHE, 'utf8').trim(); } catch (e) {} }
  if (!k) { try { const TOKEN = env('NETLIFY_AUTH_TOKEN'); const s = await fetch('https://api.netlify.com/api/v1/sites/' + SITE, { headers: { Authorization: 'Bearer ' + TOKEN } }).then(r => r.json()); const acct = s.account_slug || s.account_name; const r = await fetch('https://api.netlify.com/api/v1/accounts/' + acct + '/env/resendapikey?site_id=' + SITE, { headers: { Authorization: 'Bearer ' + TOKEN } }); const j = await r.json(); const val = (j.values || []).find(v => v.context === 'all' || v.context === 'production') || (j.values || [])[0]; k = val && val.value; if (k) fs.writeFileSync(KEY_CACHE, k); } catch (e) {} }
  if (k) process.env.RESEND_API_KEY = k;
}
(async () => {
  try { fs.unlinkSync(STOP); } catch (e) {}
  process.env.NETLIFY_SITE_ID = process.env.NETLIFY_SITE_ID || SITE;
  process.env.BLOBS_PAT = process.env.BLOBS_PAT || env('BLOBS_PAT') || env('NETLIFY_AUTH_TOKEN');
  await ensureResendKey();
  const { forceFlush } = require('./netlify/functions/lib/owner-digest');
  log('owner-digest flush heartbeat up — every 10 min');
  while (!fs.existsSync(STOP)) {
    for (let i = 0; i < 60 && !fs.existsSync(STOP); i++) await sleep(INTERVAL_MS / 60);
    if (fs.existsSync(STOP)) break;
    try {
      const r = await forceFlush(); if (r && r.flushed) log('flushed ' + r.flushed + ' lead signals · sent=' + r.sent);
      const c = await forceFlush('click-digest-queue.json', 'human clicks'); if (c && c.flushed) log('flushed ' + c.flushed + ' human clicks · sent=' + c.sent);
    } catch (e) { log('flush err ' + e.message); }
  }
  log('stop flag — exiting');
})().catch(e => { log('FATAL ' + e.message); process.exit(1); });
