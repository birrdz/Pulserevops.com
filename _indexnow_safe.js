// _indexnow_safe.js — CLOBBER-SAFE sitewide IndexNow submit. Pings every URL from
// _indexnow_sitewide_urls.json (built by `_indexnow_sitewide.js --dry`) in batches.
// Deploy-free: blobs/content are already live; this only NOTIFIES search engines.
// IMPORTANT: does NOT stamp was_indexed_at (no _index.json read-modify-write), so it
// can never clobber the index/progress-bar the way `_indexnow_sitewide.js` did.
//   node _indexnow_safe.js [--limit N]   (stop: create _indexnow_safe_stop.flag)
const fs = require('fs');
const path = require('path');
for (const l of fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');
const STOP = path.join(__dirname, '_indexnow_safe_stop.flag');
const LIMIT = +(((process.argv.find(a => a.startsWith('--limit=')) || '').split('=')[1]) || 0);
const BATCH = 200;
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  let all = JSON.parse(fs.readFileSync(path.join(__dirname, '_indexnow_sitewide_urls.json'), 'utf8'));
  if (LIMIT) all = all.slice(0, LIMIT);
  console.log(`[indexnow-safe] ${all.length} URLs, batch=${BATCH}`);
  let pinged = 0, okB = 0, failB = 0;
  for (let i = 0; i < all.length; i += BATCH) {
    if (fs.existsSync(STOP)) { console.log('[indexnow-safe] stop flag'); break; }
    const chunk = all.slice(i, i + BATCH);
    let r; try { r = await pingIndexNowUrlList(chunk); } catch (e) { r = { ok: false, err: e.message }; }
    if (r && r.ok) { okB++; pinged += chunk.length; } else { failB++; if (failB <= 3) console.log('  batch fail:', JSON.stringify(r).slice(0, 200)); }
    if ((i / BATCH) % 5 === 0) console.log(`  batch ${i / BATCH + 1}/${Math.ceil(all.length / BATCH)} ok=${!!(r && r.ok)} pinged=${pinged}`);
    await sleep(800);
  }
  const result = { submitted: all.length, pinged, okBatches: okB, failBatches: failB, at: Date.now() };
  fs.writeFileSync(path.join(__dirname, '_indexnow_safe_result.json'), JSON.stringify(result, null, 1));
  console.log('[indexnow-safe] DONE ' + JSON.stringify(result));
})().catch(e => { console.error('FATAL', e && e.stack); process.exit(1); });
