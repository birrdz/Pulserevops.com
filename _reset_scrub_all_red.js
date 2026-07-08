// Move entire Q&A population to red unscrubbed pool (owner reset).
// Clears green (AP), merges all index IDs into scrub QUEUE, empties cook queue.
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const AP = WD + '/_v2_approved.json';
const CC = WD + '/_v2_cc_approved.json';
const QUEUE = WD + '/_scrub_button_queue.json';
const COOKQ = WD + '/_scrub_cook_queue.json';
const KEY = '4444';

(async () => {
  // stop auto-scrub if running
  try {
    await fetch('http://localhost:8899/scrub-auto', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: KEY, action: 'stop' }) });
  } catch (e) {}
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const ids = [...new Set((idx.entries || []).filter(e => e && e.id && !/^vq_/i.test(e.id)).map(e => e.id))];
  const bak = WD + '/_scrub_reset_backup_' + Date.now() + '.json';
  fs.writeFileSync(bak, JSON.stringify({
    at: new Date().toISOString(),
    ap: JSON.parse(fs.readFileSync(AP, 'utf8')),
    cc: JSON.parse(fs.readFileSync(CC, 'utf8')),
    queue: JSON.parse(fs.readFileSync(QUEUE, 'utf8')),
    cook: JSON.parse(fs.readFileSync(COOKQ, 'utf8')),
  }));
  fs.writeFileSync(AP, '[]');
  fs.writeFileSync(COOKQ, '[]');
  fs.writeFileSync(QUEUE, JSON.stringify(ids));
  console.log('RESET OK');
  console.log('  index IDs -> scrub queue:', ids.length);
  console.log('  approved (green) cleared: 0');
  console.log('  cook queue cleared: 0');
  console.log('  backup:', bak);
  console.log('  NOTE: blob cc_signed unchanged — already-certified may wave through fast pass until re-cooked.');
  const st = await fetch('http://localhost:8899/state?key=' + KEY).then(r => r.json()).catch(() => null);
  if (st) console.log('  UI state now:', { green: st.green, under: st.under });
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
