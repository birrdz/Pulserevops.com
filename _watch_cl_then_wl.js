// Waits until the cl (Clubs) batch finishes, then fires _seed_wl.js to advance
// the campaign to wl (Wellness). "Finished" = cl >= 90 (50 base + 40 seeded) OR
// cl count plateaus for 4 consecutive checks at >=85 (some titles may dupe/fail).
// Runs in background so the cl->wl handoff is hands-free.
const fs = require('fs');
const { execSync } = require('child_process');
for (const f of ['.env.local', '.env']) { try { for (const l of fs.readFileSync('C:/Users/koryj/website/' + f, 'utf8').split(/\r?\n/)) { const m = l.match(/^([A-Za-z0-9_]+)=(.*)$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {} }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const clCount = async () => { const idx = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] }; return idx.entries.filter(e => /^cl\d+$/i.test(e.id)).length; };
(async () => {
  let prev = -1, stable = 0;
  for (let i = 0; i < 90; i++) {
    let c = 0; try { c = await clCount(); } catch (e) {}
    console.log(new Date().toISOString(), 'cl=' + c);
    if (c >= 90) { console.log('cl complete (>=90) — advancing'); break; }
    if (c === prev) stable++; else stable = 0;
    if (stable >= 4 && c >= 85) { console.log('cl plateaued at ' + c + ' — advancing'); break; }
    prev = c;
    await sleep(30000);
  }
  const out = execSync('node _seed_wl.js', { cwd: 'C:/Users/koryj/website' }).toString();
  console.log('SEEDED WL:\n' + out);
})().catch(e => { console.error('watch err', e && e.message); process.exit(1); });
