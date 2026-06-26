const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (_) {}
(async () => {
  const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
  const e = await s.get('answers/cg0001.json', { type: 'json' });
  console.log(JSON.stringify({
    id: e.id,
    tagCount: (e.tags || []).length,
    kwCount: (e.seo_brand_keywords || []).length,
    faqCount: (e.seo_semantic_faq_questions || []).length,
    seo_optimized_at: e.seo_optimized_at,
    seo_keyword_phrase_count: e.seo_keyword_phrase_count,
    sampleTags: (e.tags || []).slice(0, 5),
    sampleKw: (e.seo_brand_keywords || []).slice(0, 3),
  }, null, 2));
})();
