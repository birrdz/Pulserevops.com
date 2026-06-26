// Smoke test: applyPillarSeo stamps 200+ keywords for ev0001.
const assert = require('assert');
const { applyPillarSeo, pillarPrefixFromId } = require('./netlify/functions/lib/ensure-pillar-seo');
const { listRegisteredPrefixes } = require('./_pillar_seo_registry');

const id = 'ev0001';
const title = 'Top 10 Music Festivals in Austin 2027';

assert.strictEqual(pillarPrefixFromId(id), 'ev');
assert.ok(listRegisteredPrefixes().includes('ev'));

const result = applyPillarSeo(id, title, { id, question: title, tags: ['events'] });
assert.strictEqual(result.applied, true, 'expected SEO applied for ev');
assert.ok(result.keywordCount >= 200, `expected 200+ keywords, got ${result.keywordCount}`);
assert.ok(Array.isArray(result.entry.seo_brand_keywords));
assert.ok(Array.isArray(result.entry.seo_semantic_faq_questions));
assert.ok(result.entry.seo_semantic_faq === true);
assert.ok(result.entry.tags.length > 10);

// Graceful skip for pillar without compete module
const ra = applyPillarSeo('ra0001', 'GTM Design in 2027', { tags: ['revops'] }, { silent: true });
assert.strictEqual(ra.applied, false);

console.log(
  JSON.stringify({
    ok: true,
    id,
    prefix: result.prefix,
    keywordCount: result.keywordCount,
    tagCount: result.tagCount,
    phraseCount: result.phraseCount,
    registeredPillars: listRegisteredPrefixes(),
  })
);
