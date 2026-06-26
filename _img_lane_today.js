// DDG image lane — TODAY-AND-FORWARD scope (owner 2026-06-25): only image the
// gap-fill entries written today onward (ts >= today-midnight, frozen at launch),
// skipping the ~462-entry old backlog. Keeps running to pick up future writes.
const { execSync } = require('child_process');
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

// Freeze cutoff = start of today, so "today and forward" stays anchored across midnight.
const _d = new Date(); _d.setHours(0, 0, 0, 0); const CUTOFF = _d.getTime();

const COVER = { q: '', ik: '', tk: '', cg: '', st: '', ra: '', gp: '', sw: '', tl: '', ai: '', bo: '', gb: '', sk: '', hf: '', bs: 'book cover', sp: 'portrait' };
const TOP10 = { er: '/electronic-reviews', ca: '/cars', bt: '/boats', aq: '/aquariums', fr: '/franchises', sc: '/schools', pt: '/pets', co: '/collectibles', wl: '/wellness', gm: '/gaming', mv: '/movies', dn: '/dining', rs: '/resorts', tv: '/travel', tn: '/towns', lv: '/living', es: '/estates', cl: '/clubs', ev: '/events', ga: '/gatherings', sy: '/style', nl: '/nightlife' };

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function pending() {
  const idx = await store.get('_index.json', { type: 'json' }).catch(() => ({ entries: [] }));
  const byp = {}; let total = 0;
  for (const e of idx.entries) {
    if (e && e.images_pending && (e.ts || 0) >= CUTOFF) { const p = (String(e.id).match(/^([a-z]+)/) || [])[1]; byp[p] = (byp[p] || 0) + 1; total++; }
  }
  return { total, byp };
}
function run(cmd) { try { execSync(cmd, { cwd: 'C:/Users/koryj/website', stdio: 'ignore', timeout: 600000 }); } catch (e) {} }

(async () => {
  console.log(`[img-today] cutoff = ${new Date(CUTOFF).toString()} (ts>=${CUTOFF})`);
  let idlePolls = 0;
  for (let pass = 1; pass <= 100000; pass++) {
    const { total, byp } = await pending();
    console.log(`[img-today] pass ${pass}: today-pending=${total} ${JSON.stringify(byp)}`);
    if (total === 0) {
      idlePolls++;
      // stay alive to image future writes ("and forward"); back off when idle
      await sleep(60000);
      continue;
    }
    idlePolls = 0;
    for (const p of Object.keys(byp)) {
      if (TOP10[p]) run(`node _img_backfill_any.js ${p} ${TOP10[p]} --since=${CUTOFF}`);
      else if (COVER[p] !== undefined) run(`node _cover_img_any.js ${p} "${COVER[p]}" --since=${CUTOFF}`);
      else run(`node _cover_img_any.js ${p} "" --since=${CUTOFF}`);
    }
    await sleep(15000);
  }
})().catch(e => { console.error('[img-today] FATAL', e.message); });
