// _indexnow_delta.js — ping IndexNow for recently created OR fixed entries.
// Deploy-free; notifies Bing/Yandex/etc to crawl the freshly-published pages,
// which now carry the per-URL keyword clusters + "People also search for" lines.
//   node _indexnow_delta.js [--hours=26]
const fs = require('fs'); const path = require('path');
for (const l of fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const { pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');
const { libraryEntryPublicUrl } = require('./netlify/functions/lib/library-entry-url');
const HOURS = +(((process.argv.find(a => a.startsWith('--hours=')) || '').split('=')[1]) || 26);
const SINCE = Date.now() - HOURS * 3600 * 1000;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const changedAt = e => Math.max(
  Number(e && e.ts) || 0,
  Number(e && e.polished_at) || 0,
  Number(e && e.updated_at) || 0,
  Number(e && e.last_modified_ms) || 0
);

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const fresh = (idx.entries || []).filter(e => e && e.id && changedAt(e) >= SINCE);
  const urls = [...new Set(fresh.map(libraryEntryPublicUrl).filter(Boolean))];
  console.log(`[delta] ${urls.length} entries created or fixed in the last ${HOURS}h`);
  if (!urls.length) return;
  let pinged = 0, ok = 0, fail = 0;
  for (let i = 0; i < urls.length; i += 200) {
    const chunk = urls.slice(i, i + 200);
    let r; try { r = await pingIndexNowUrlList(chunk); } catch (e) { r = { ok: false, err: e.message }; }
    if (r && r.ok) { ok++; pinged += chunk.length; } else { fail++; console.log('  batch fail:', JSON.stringify(r).slice(0, 160)); }
    console.log(`  batch ${Math.floor(i / 200) + 1}/${Math.ceil(urls.length / 200)} ok=${!!(r && r.ok)} pinged=${pinged}`);
    await sleep(800);
  }
  fs.writeFileSync(path.join(__dirname, '_indexnow_delta_result.json'), JSON.stringify({ entries: urls.length, pinged, okBatches: ok, failBatches: fail, hours: HOURS, at: Date.now() }, null, 1));
  console.log(`[delta] DONE pinged=${pinged} okBatches=${ok} failBatches=${fail}`);
})().catch(e => { console.error('FATAL', e && e.message); process.exit(1); });
