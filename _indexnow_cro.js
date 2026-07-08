// _indexnow_cro.js — ping IndexNow for THIS SESSION'S CRO delta: every tl (tools)
// entry mentioning CRO / Chief Revenue Officer (all retitled to "in 2027" + the CRO
// finder pages published this session). Clobber-safe (ping-only, no index write).
//   node -r ./_loadenv.js _indexnow_cro.js
const fs = require('fs'); const path = require('path');
const { getStore } = require('@netlify/blobs');
const { pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const SITE = 'https://pulserevops.com';
const BATCH = 200;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const isCro = q => /(\bCRO\b|chief revenue officer)/i.test(q || '');

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const urls = idx.entries.filter(e => /^tl\d+$/.test(e.id) && isCro(e.question)).map(e => `${SITE}/tools/${e.id}`);
  console.log(`[indexnow-cro] ${urls.length} CRO/tools URLs, batch=${BATCH}`);
  let pinged = 0, okB = 0, failB = 0;
  for (let i = 0; i < urls.length; i += BATCH) {
    const chunk = urls.slice(i, i + BATCH);
    let r; try { r = await pingIndexNowUrlList(chunk); } catch (e) { r = { ok: false, err: e.message }; }
    if (r && r.ok) { okB++; pinged += chunk.length; } else { failB++; if (failB <= 3) console.log('  batch fail:', JSON.stringify(r).slice(0, 200)); }
    console.log(`  batch ${i / BATCH + 1}/${Math.ceil(urls.length / BATCH)} ok=${!!(r && r.ok)} pinged=${pinged}`);
    await sleep(800);
  }
  fs.writeFileSync(path.join(__dirname, '_indexnow_cro_result.json'), JSON.stringify({ submitted: urls.length, pinged, okBatches: okB, failBatches: failB, at: Date.now() }, null, 1));
  console.log('[indexnow-cro] DONE ' + JSON.stringify({ submitted: urls.length, pinged, okBatches: okB, failBatches: failB }));
})().catch(e => { console.error('FATAL', e && e.stack); process.exit(1); });
