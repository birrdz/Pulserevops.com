const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (_) {}
(async () => {
  const s = getStore({
    name: 'pulse-machine-library',
    siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN,
  });
  const idx = (await s.get('_index.json', { type: 'json' })) || { entries: [] };
  const bt = (idx.entries || []).filter((e) => e && /^bt\d+$/i.test(e.id));
  bt.sort((a, b) => parseInt(a.id.slice(2), 10) - parseInt(b.id.slice(2), 10));
  const stamped = bt.filter((e) => e.seo_optimized_at);
  console.log(JSON.stringify({ btCount: bt.length, stamped: stamped.length, first: bt[0]?.id, last: bt[bt.length - 1]?.id }, null, 2));
  const e = await s.get('answers/bt0001.json', { type: 'json' });
  console.log(
    JSON.stringify(
      {
        id: 'bt0001',
        tags: e?.tags?.length,
        seo_brand_keywords: e?.seo_brand_keywords?.length,
        seo_semantic_faq_questions: e?.seo_semantic_faq_questions?.length,
        seo_keyword_phrase_count: e?.seo_keyword_phrase_count,
        sampleKw: (e?.seo_brand_keywords || []).slice(0, 3),
      },
      null,
      2
    )
  );
})();
