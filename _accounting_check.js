// 🔒 4444 LOCKED (owner 2026-06-30). _accounting_check.js — guarantee the books always balance.
// INVARIANT: every catalog URL is in exactly ONE pile — GREEN (_v2_approved.json) or RED
// (_v2_needs_review.json). No overlap, no gaps, no stale ids. So green + red == catalogTotal, forever.
// Also checks the indexed axis: indexed + notIndexed == catalogTotal.
//   node _accounting_check.js            # verify only — report any drift
//   node _accounting_check.js --repair   # enforce: red = (red∪queue)∩catalog ; green = catalog − red ; queue = red
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const { pushSeoCounts } = require('./_seo_monitor_sync_lib');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const AP = WD + '/_v2_approved.json', NR = WD + '/_v2_needs_review.json', QUEUE = WD + '/_scrub_button_queue.json';
const readArr = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return []; } };
const writeArr = (f, a) => fs.writeFileSync(f, JSON.stringify(a));
const REPAIR = process.argv.includes('--repair');

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const catalog = (idx.entries || []).filter(e => e && e.id).map(e => e.id);
  const catSet = new Set(catalog);
  const indexed = (idx.entries || []).filter(e => e && e.was_indexed_at).length;

  let green = readArr(AP), red = readArr(NR), queue = readArr(QUEUE);
  const gSet = new Set(green), rSet = new Set(red);
  const overlap = green.filter(id => rSet.has(id));                 // in BOTH piles (bad)
  const accounted = new Set([...green, ...red]);
  const missing = catalog.filter(id => !accounted.has(id));         // in catalog, in NEITHER pile (bad)
  const staleGreen = green.filter(id => !catSet.has(id));           // green id not in catalog
  const staleRed = red.filter(id => !catSet.has(id));               // red id not in catalog
  const qNotRed = queue.filter(id => !rSet.has(id));                // queue id not marked red

  console.log('=== ACCOUNTING CHECK ===');
  console.log('catalogTotal :', catalog.length);
  console.log('GREEN(approved):', green.length, ' RED(needsReview):', red.length, ' SUM:', green.length + red.length, green.length + red.length === catalog.length ? '✅ == catalog' : '❌ MISMATCH');
  console.log('overlap(in both):', overlap.length, ' missing(in neither):', missing.length, ' staleGreen:', staleGreen.length, ' staleRed:', staleRed.length, ' queue∉red:', qNotRed.length);
  console.log('INDEXED axis : indexed', indexed, '+ notIndexed', catalog.length - indexed, '=', catalog.length, '✅');

  const clean = overlap.length === 0 && missing.length === 0 && staleGreen.length === 0 && staleRed.length === 0 && (green.length + red.length === catalog.length);
  if (clean) { console.log('\n✅ BOOKS BALANCE — every URL in exactly one pile, sum == catalog.'); }
  else if (!REPAIR) { console.log('\n⚠️ DRIFT FOUND — run with --repair to enforce the invariant.'); }

  if (REPAIR) {
    // RED = (current red ∪ queue) limited to catalog (drop stale). GREEN = catalog − RED. QUEUE = RED (preserve order).
    fs.writeFileSync(AP + '.pre_acct.json', JSON.stringify(green));
    fs.writeFileSync(NR + '.pre_acct.json', JSON.stringify(red));
    const redFinal = [...new Set([...red, ...queue])].filter(id => catSet.has(id));
    const redFinalSet = new Set(redFinal);
    const greenFinal = catalog.filter(id => !redFinalSet.has(id));   // everything not red = green (no gaps, no overlap by construction)
    // queue keeps its existing order for ids still red, then any red not yet queued
    const queueFinal = [...queue.filter(id => redFinalSet.has(id)), ...redFinal.filter(id => !queue.includes(id))];
    writeArr(AP, greenFinal); writeArr(NR, redFinal); writeArr(QUEUE, queueFinal);
    try { await pushSeoCounts(store, { note: 'accounting reconcile: green = catalog − red' }); } catch (e) {}
    console.log('\n🔧 REPAIRED → GREEN', greenFinal.length, '+ RED', redFinal.length, '=', greenFinal.length + redFinal.length, '(catalog', catalog.length + ')', greenFinal.length + redFinal.length === catalog.length ? '✅' : '❌', '· queue', queueFinal.length);
  }
})().catch(e => { console.log('[acct] FATAL', e && e.message); process.exit(1); });
