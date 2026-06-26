const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (_) {}
const IDS = ['bt0001', 'bt0100', 'bt0188', 'bt0200', 'bt0300', 'bt0400'];
(async () => {
  const s = getStore({
    name: 'pulse-machine-library',
    siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN,
  });
  for (const id of IDS) {
    const e = await s.get(`answers/${id}.json`, { type: 'json' });
    console.log(
      id,
      e ? `tags=${e.tags?.length} kw=${e.seo_brand_keywords?.length} phrases=${e.seo_keyword_phrase_count} opt=${!!e.seo_optimized_at}` : 'MISSING'
    );
  }
  const idx = (await s.get('_index.json', { type: 'json' })) || { entries: [] };
  const stamped = (idx.entries || []).filter((e) => e && /^bt\d+$/i.test(e.id) && e.seo_optimized_at);
  console.log('index stamped', stamped.length, '/ 400');
})();
