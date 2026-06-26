// Whole-site IndexNow submit — pillar-agnostic. Submits EVERY library entry URL
// (all pillars via libraryEntryPublicUrl) + every static/sitemap URL to IndexNow,
// then stamps was_indexed_at on library rows. Safe for the multi-pillar library
// (unlike _index_all_pages_seo.js, which only buckets q/st/ik and crashes on cg/ca/co…).
//
// Usage:
//   node _indexnow_sitewide.js              # full site resubmit + stamp
//   node _indexnow_sitewide.js --missing    # only un-stamped library entries (+ static)
//   node _indexnow_sitewide.js --dry        # build + count URLs, no pings, no stamps
const fs = require('fs');
const path = require('path');
const https = require('https');
const { getStore } = require('@netlify/blobs');
const { libraryEntryKind, libraryEntryPublicUrl } = require('./netlify/functions/lib/library-entry-url');
const { pingIndexNowUrlList, stampIndexed } = require('./netlify/functions/lib/indexnow-ping-entry');

const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
for (const l of env.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const HOST = 'https://pulserevops.com';
const BATCH = 200;
const MISSING_ONLY = process.argv.includes('--missing');
const DRY = process.argv.includes('--dry');
const sleep = ms => new Promise(r => setTimeout(r, ms));

function fetchText(url) {
  return new Promise(resolve => {
    https.get(url, { headers: { 'User-Agent': 'pulse-indexnow-sitewide/1.0' } }, res => {
      let b = ''; res.on('data', c => b += c); res.on('end', () => resolve({ status: res.statusCode, body: b }));
    }).on('error', e => resolve({ status: 0, body: e.message }));
  });
}
const parseLocs = xml => { const o = []; const re = /<loc>([^<]+)<\/loc>/gi; let m; while ((m = re.exec(xml))) o.push(m[1].trim()); return o; };

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: TOK });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const entries = (idx.entries || []).filter(e => e && e.id);

  // 1) Library entry URLs (all pillars).
  const libRows = entries.filter(e => { try { return !!libraryEntryKind(e); } catch (_) { return false; } });
  const libToSubmit = MISSING_ONLY ? libRows.filter(e => !e.was_indexed_at) : libRows;
  const libUrls = [];
  for (const e of libToSubmit) { try { const u = libraryEntryPublicUrl(e); if (u) libUrls.push(u); } catch (_) {} }

  // 2) Static + sitemap URLs. Walk sitemap-index.xml → child sitemaps → <loc>s.
  const staticUrls = new Set();
  try { parseLocs(fs.readFileSync(path.join(__dirname, 'sitemap.xml'), 'utf8')).forEach(u => u.includes('pulserevops.com') && staticUrls.add(u)); } catch (_) {}
  const smIndex = await fetchText(HOST + '/sitemap-index.xml');
  const childSitemaps = parseLocs(smIndex.body || '').filter(u => /\.xml$/i.test(u));
  for (const sm of childSitemaps) {
    const r = await fetchText(sm);
    if (r.status === 200) parseLocs(r.body).forEach(u => u.includes('pulserevops.com') && staticUrls.add(u));
    await sleep(120);
  }
  // Also pull the dynamic machine sitemap (covers library URLs as a backstop).
  const smMachine = await fetchText(HOST + '/.netlify/functions/pulse-machine-sitemap');
  if (smMachine.status === 200) parseLocs(smMachine.body).forEach(u => u.includes('pulserevops.com') && staticUrls.add(u));

  // 3) Merge + dedup. Library URLs first (priority), then static.
  const all = Array.from(new Set([...libUrls, ...staticUrls]));
  console.log(`[sitewide] library rows=${libRows.length} submitting=${libUrls.length} | static/sitemap=${staticUrls.size} | TOTAL unique=${all.length}` + (MISSING_ONLY ? ' (missing-only)' : ' (full)'));

  if (DRY) { console.log('[dry] no pings sent. sample:', all.slice(0, 5)); fs.writeFileSync(path.join(__dirname, '_indexnow_sitewide_urls.json'), JSON.stringify(all, null, 1)); return; }

  // 4) Ping IndexNow in batches.
  let pinged = 0, okBatches = 0, failBatches = 0;
  for (let i = 0; i < all.length; i += BATCH) {
    const chunk = all.slice(i, i + BATCH);
    let r; try { r = await pingIndexNowUrlList(chunk); } catch (e) { r = { ok: false, err: e.message }; }
    if (r && r.ok) { okBatches++; pinged += chunk.length; } else { failBatches++; }
    if ((i / BATCH) % 5 === 0) console.log(`  batch ${i / BATCH + 1}/${Math.ceil(all.length / BATCH)} ok=${!!(r && r.ok)} pinged=${pinged}`);
    await sleep(800);
  }

  // 5) Stamp library rows we submitted.
  const ts = Date.now();
  let stamped = 0;
  for (const e of libToSubmit) { try { await stampIndexed(store, e.id, ts); stamped++; } catch (_) {} }

  const result = { submitted_urls: all.length, library_urls: libUrls.length, static_urls: staticUrls.size, pinged, okBatches, failBatches, stamped, missing_only: MISSING_ONLY, at: ts };
  fs.writeFileSync(path.join(__dirname, '_indexnow_sitewide_result.json'), JSON.stringify(result, null, 2));
  console.log('[sitewide] DONE ' + JSON.stringify(result));
})().catch(e => { console.error('FATAL', e && e.stack); process.exit(1); });
