// DDG image lane — slow free keyless backfill behind EVERYTHING the writers produce.
// Cover-image for Q&A-style pillars, Top-10 card backfill for listicle pillars.
// Loops until images_pending hits 0 (re-checks each pass; keeps up with new writes).
// Sequential / gentle (sleep between passes). Run in background; it runs until done.
const { execSync } = require('child_process');
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

// Q&A-style pillars → one representative cover image (suffix tunes the DDG query)
const COVER = { q: '', ik: '', tk: '', cg: '', st: '', ra: '', gp: '', sw: '', tl: '', ai: '', bo: '', gb: '', sk: '', hf: '', bs: 'book cover', sp: 'portrait' };
// Listicle pillars → per-item Top-10 card backfill (needs the pillar URL path)
const TOP10 = { er: '/electronic-reviews', ca: '/cars', bt: '/boats', aq: '/aquariums', fr: '/franchises', sc: '/schools', pt: '/pets', co: '/collectibles', wl: '/wellness', gm: '/gaming', mv: '/movies', dn: '/dining', rs: '/resorts', tv: '/travel', tn: '/towns', lv: '/living', es: '/estates', cl: '/clubs', ev: '/events', ga: '/gatherings', sy: '/style', nl: '/nightlife' };

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
// Optional pillar partition: --pillars=er,ca,fr  → only those prefixes (lets 2 lanes run without colliding)
const _pf = (process.argv.find(a => a.startsWith('--pillars=')) || '').split('=')[1];
const PILLAR_FILTER = _pf ? new Set(_pf.split(',').map(s => s.trim()).filter(Boolean)) : null;
async function pending() {
  const idx = await store.get('_index.json', { type: 'json' }).catch(() => ({ entries: [] }));
  const byp = {}; let total = 0;
  for (const e of idx.entries) { if (e && e.images_pending) { const p = (String(e.id).match(/^([a-z]+)/) || [])[1]; if (PILLAR_FILTER && !PILLAR_FILTER.has(p)) continue; byp[p] = (byp[p] || 0) + 1; total++; } }
  return { total, byp };
}
function run(cmd) { try { execSync(cmd, { cwd: 'C:/Users/koryj/website', stdio: 'ignore', timeout: 600000 }); } catch (e) {} }

(async () => {
  const MAX_PASSES = 1000;
  for (let pass = 1; pass <= MAX_PASSES; pass++) {
    const { total, byp } = await pending();
    console.log(`[img-lane] pass ${pass} start: images_pending=${total} ${JSON.stringify(byp)}`);
    if (total === 0) { console.log('[img-lane] ALL IMAGES DONE'); break; }
    // only run pillars that actually have pending images this pass
    for (const p of Object.keys(byp)) {
      if (COVER[p] !== undefined) run(`node _cover_img_any.js ${p} "${COVER[p]}"`);
      else if (TOP10[p]) run(`node _img_backfill_any.js ${p} ${TOP10[p]}`);
      else run(`node _cover_img_any.js ${p} ""`); // fallback: generic cover for unmapped prefix
    }
    await sleep(15000); // gentle pacing between passes
  }
  console.log('[img-lane] exiting');
})().catch(e => { console.error('[img-lane] FATAL', e.message); });
