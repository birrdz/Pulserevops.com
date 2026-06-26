// Publish-time pillar SEO: merge compete keyword stacks + IndexNow ping.
// Idempotent — safe on every write. Skips pillars without a compete module.

const {
  getPillarRegistry,
  loadCompeteModule,
  keywordPhraseCount,
  logSkipOnce,
} = require('../../../_pillar_seo_registry');
const { pingIndexNowEntry } = require('./indexnow-ping-entry');

function pillarPrefixFromId(id) {
  if (!id || typeof id !== 'string') return null;
  const base = id.replace(/rv$/i, '');
  if (/^vq_/i.test(base)) return 'vq';
  const m = base.match(/^([a-z]+)\d+$/i);
  return m ? m[1].toLowerCase() : null;
}

/**
 * Merge tags, seo_brand_keywords, seo_semantic_faq_questions from pillar compete module.
 * @returns {{ entry: object, applied: boolean, changed?: boolean, prefix?: string, tagCount?: number, keywordCount?: number, reason?: string }}
 */
function applyPillarSeo(id, title, entry = {}, opts = {}) {
  const prefix = pillarPrefixFromId(id);
  if (!prefix) {
    return { entry, applied: false, reason: 'no_prefix' };
  }

  const reg = getPillarRegistry(prefix);
  if (!reg) {
    if (!opts.silent) logSkipOnce(prefix, 'no registry row');
    return { entry, applied: false, reason: 'no_registry', prefix };
  }

  const mod = loadCompeteModule(prefix);
  if (!mod || typeof mod.tagsForEntry !== 'function' || typeof mod.entrySeoBrandKeywords !== 'function') {
    if (!opts.silent) logSkipOnce(prefix, 'compete module missing or incomplete');
    return { entry, applied: false, reason: 'no_module', prefix };
  }

  const question = title || entry.question || '';
  const existingTags = entry.tags || [];
  const newTags = mod.tagsForEntry(id, question, existingTags);
  const newDisplay = mod.entrySeoBrandKeywords(question);
  const newFaq =
    typeof mod.semanticFaqForTitle === 'function' ? mod.semanticFaqForTitle(question) : [];

  const phraseCount = keywordPhraseCount(mod, reg);
  const now = opts.now || Date.now();

  const changed =
    JSON.stringify(newTags) !== JSON.stringify(existingTags) ||
    JSON.stringify(entry.seo_brand_keywords || []) !== JSON.stringify(newDisplay) ||
    JSON.stringify(entry.seo_semantic_faq_questions || []) !== JSON.stringify(newFaq);

  const updated = {
    ...entry,
    tags: newTags,
    seo_brand_keywords: newDisplay,
    seo_semantic_faq_questions: newFaq,
    seo_semantic_faq: true,
    seo_keyword_phrase_count: phraseCount,
    seo_optimized_at: now,
    seo_pillar: prefix,
  };

  return {
    entry: updated,
    applied: true,
    changed,
    prefix,
    tagCount: newTags.length,
    keywordCount: newDisplay.length,
    phraseCount,
  };
}

/** IndexNow via shared helper; stamps was_indexed_at when store provided. */
async function pingIndexNowAfterPublish(id, store, indexRow, opts = {}) {
  if (opts.skipIndex) return null;
  return pingIndexNowEntry(id, store, indexRow);
}

module.exports = {
  pillarPrefixFromId,
  applyPillarSeo,
  pingIndexNowAfterPublish,
};
