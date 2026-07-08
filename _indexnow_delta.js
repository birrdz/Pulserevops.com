// _indexnow_delta.js — ping IndexNow for ONLY today's NEW entries (the delta).
// Deploy-free; notifies Bing/Yandex/etc to crawl the freshly-published pages,
// which now carry the per-URL keyword clusters + "People also search for" lines.
//   node _indexnow_delta.js [--hours=26]
const fs = require('fs'); const path = require('path');
for (const l of fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const { pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');
const HOURS = +(((process.argv.find(a => a.startsWith('--hours=')) || '').split('=')[1]) || 26);
const SINCE = Date.now() - HOURS * 3600 * 1000;
const SITE = 'https://pulserevops.com';
const sleep = ms => new Promise(r => setTimeout(r, ms));
// pillar → URL path (mirror of the sitemap's routing)
const SEG = { tl: '/tools/', ik: '/industry-kpis/', st: '/sales-trainings/', tk: '/tech-stacks/', gb: '/graphics/', bs: '/sales-book-summaries/', er: '/electronic-reviews/', fr: '/franchises/', ca: '/cars/', co: '/collectibles/', aq: '/aquariums/', hf: '/highschool-football-recruiting/', ai: '/ai-infrastructure/', sp: '/speeches/', sy: '/style/', cg: '/coaching/', sw: '/software/', tn: '/towns/', sc: '/schools/', nl: '/nightlife/', dn: '/dining/', bt: '/boats/', mv: '/movies/', wl: '/wellness/', tv: '/travel/', rs: '/resorts/', es: '/estates/', cl: '/clubs/', lv: '/living/', ev: '/events/', ga: '/gatherings/', gm: '/gaming/', pt: '/pets/', bo: '/buildouts/' };

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const fresh = (idx.entries || []).filter(e => e && e.id && (e.ts || 0) >= SINCE);
  const urls = fresh.map(e => { const p = (e.id.match(/^([a-z]+)/i) || [])[1].toLowerCase(); return SITE + (SEG[p] || '/knowledge/') + e.id; });
  console.log(`[delta] ${urls.length} entries created in the last ${HOURS}h`);
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
