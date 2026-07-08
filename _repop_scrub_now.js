// Stop scrubber, merge entire catalog + parked into queue, clear side pools, restart scrub.
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const KEY = '4444';
const AP = WD + '/_v2_approved.json';
const CC = WD + '/_v2_cc_approved.json';
const QUEUE = WD + '/_scrub_button_queue.json';
const COOKQ = WD + '/_scrub_cook_queue.json';
const PARK = WD + '/_redbox_parked.json';
const PENDING = WD + '/_scrub_pending_signoff.json';
const REJECT_FIX = WD + '/_scrub_reject_fix.json';
const AGENT_FIX = WD + '/_scrub_agent_fix_queue.json';
const sleep = ms => new Promise(r => setTimeout(r, ms));

for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

async function stopScrub() {
  try {
    await fetch('http://localhost:8899/scrub-auto', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: KEY, action: 'stop' }) });
    for (let i = 0; i < 30; i++) {
      const st = await fetch('http://localhost:8899/scrub-status').then(r => r.json()).catch(() => null);
      if (!st || (!st.running && !st.scrubBusy)) return st;
      await sleep(500);
    }
  } catch (e) {}
  return null;
}

function readArr(p) { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return []; } }

(async () => {
  console.log('[repop] stopping scrubber…');
  await stopScrub();

  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const es = (idx.entries || []).filter(e => e && e.id && !/^vq_/i.test(e.id));
  const unproven = [], certified = [];
  for (const e of es) {
    const certed = e.cc_signed || (typeof e.quality_score === 'number' && e.quality_score >= 12 && e.format_v);
    (certed ? certified : unproven).push(e.id);
  }

  const park = readArr(PARK).map(p => (p && p.id) || p).filter(Boolean);
  const pending = readArr(PENDING).map(p => p && p.id).filter(Boolean);
  const fixing = readArr(REJECT_FIX).map(p => p && p.id).filter(Boolean);
  const cook = readArr(COOKQ);
  const ap = readArr(AP);
  const cc = readArr(CC);

  const bak = WD + '/_scrub_repop_backup_' + Date.now() + '.json';
  fs.writeFileSync(bak, JSON.stringify({
    at: new Date().toISOString(),
    ap, cc, queue: readArr(QUEUE), cook, park: readArr(PARK), pending: readArr(PENDING), rejectFix: readArr(REJECT_FIX),
  }));

  const seen = new Set(), out = [];
  for (const id of [...pending, ...fixing, ...park, ...cook, ...unproven, ...certified, ...ap, ...cc]) {
    if (id && !seen.has(id)) { seen.add(id); out.push(id); }
  }

  fs.writeFileSync(AP, '[]');
  fs.writeFileSync(CC, '[]');
  fs.writeFileSync(COOKQ, '[]');
  fs.writeFileSync(PARK, '[]');
  fs.writeFileSync(PENDING, '[]');
  fs.writeFileSync(REJECT_FIX, '[]');
  try { fs.writeFileSync(AGENT_FIX, '[]'); } catch (e) {}
  fs.writeFileSync(QUEUE, JSON.stringify(out));

  console.log('[repop] backup:', bak);
  console.log('[repop] catalog=' + es.length + ' queue=' + out.length + ' (unproven=' + unproven.length + ' certified-last=' + certified.length + ')');
  console.log('[repop] cleared: green=' + ap.length + ' cc=' + cc.length + ' park=' + park.length + ' pending=' + pending.length + ' fixing=' + fixing.length);
  console.log('[repop] ready — scrubber idle. Hit Begin Scrub in the UI when you want to start.');
  const st = await fetch('http://localhost:8899/state?key=' + KEY).then(r => r.json()).catch(() => null);
  if (st) console.log('[repop] UI state: green=' + st.green + ' under=' + st.under + ' pending=' + (st.pending || 0) + ' fixing=' + (st.fixing || 0));
})().catch(e => { console.error('[repop] FATAL', e.message); process.exit(1); });
