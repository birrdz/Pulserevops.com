// Generate pillar SEO stack files from _pillar_hf_wellness_specs.js
const fs = require('fs');
const path = require('path');
const { PILLAR_SPECS } = require('./_pillar_hf_wellness_specs');

const ROOT = __dirname;

function upper(prefix) {
  return String(prefix).toUpperCase();
}

function writePhrases(spec) {
  const phrases = spec.genPhrases();
  const file = path.join(ROOT, `_${spec.prefix}_keyword_phrases.json`);
  fs.writeFileSync(file, JSON.stringify(phrases, null, 2) + '\n');
  return phrases.length;
}

function writeCompete(spec) {
  const P = upper(spec.prefix);
  const file = path.join(ROOT, `_${spec.prefix}_compete_semantic_keywords.js`);
  const body = `// ${spec.brand} — semantic search + FAQ compete keywords for ${spec.prefix}#### entries.
const ${P}_KEYWORD_PHRASES = require('./_${spec.prefix}_keyword_phrases.json');

const ${P}_HUB_URL = '${spec.hubUrl}';
const ${P}_HUB_PAGE = '${spec.hubPage}';
const ${P}_STATIC_URLS = [${P}_HUB_URL];

function slugify(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 72);
}

function phraseToFaq(phrase) {
  const topic = String(phrase).replace(/^Best /i, '').replace(/^Top 10 /i, '').trim();
  const q = /^how/i.test(phrase) ? \`\${phrase.replace(/\\?+$/, '')}?\` : \`What are the best \${topic.toLowerCase()}?\`;
  const a = \`${spec.brand} ranks \${phrase} with Best Overall and Best Value picks and a buyer decision tree for 2027.\`;
  return { q, a };
}

const SEMANTIC_FAQ_HUB_SCHEMA = ${P}_KEYWORD_PHRASES.slice(0, 48).map(phraseToFaq);

const COMPETE_DISPLAY_KEYWORDS = [
  'Semantic Search: ${spec.brand} FAQ',
  '${spec.brand} FAQ structured data',
  '${spec.brand} semantic search optimization',
  '${spec.brand} Top-10 Rankings',
  'Best Overall vs Best Value',
  'top-10 rankings 2027',
  ...${P}_KEYWORD_PHRASES,
];

const GLOBAL_TAGS = ${JSON.stringify(spec.globalTags)};

function keywordsFromTitle(title) {
  const t = String(title || '').toLowerCase();
  const hits = [];
  for (const phrase of ${P}_KEYWORD_PHRASES) {
    const p = phrase.toLowerCase().replace(/^top 10 /, '').replace(/^best /, '');
    const tokens = p.split(/\\s+/).filter((w) => w.length > 3);
    const overlap = tokens.filter((w) => t.includes(w)).length;
    if (overlap >= 2 || t.includes(p.slice(0, 24))) hits.push(slugify(phrase));
  }
  if (!hits.length) hits.push(...${P}_KEYWORD_PHRASES.slice(0, 8).map(slugify));
  return hits;
}

function tagsForEntry(id, question, existingTags = []) {
  const base = [...GLOBAL_TAGS, ...(existingTags || [])];
  const titleHits = keywordsFromTitle(question);
  const allSlugs = ${P}_KEYWORD_PHRASES.map(slugify);
  return Array.from(new Set([...base, ...titleHits, ...allSlugs].map(slugify).filter(Boolean)));
}

function hubDisplayKeywords() {
  return Array.from(new Set(COMPETE_DISPLAY_KEYWORDS.map((s) => String(s).trim()).filter(Boolean)));
}

function hubMetaKeywords(max = 48) {
  return hubDisplayKeywords().slice(0, max);
}

function semanticFaqForTitle(title) {
  const t = String(title || '').toLowerCase();
  const hits = [];
  for (const row of SEMANTIC_FAQ_HUB_SCHEMA) {
    const q = row.q.toLowerCase();
    const tokens = q.replace(/[^a-z0-9\\s]/g, ' ').split(/\\s+/).filter((w) => w.length > 3);
    const overlap = tokens.filter((w) => t.includes(w)).length;
    if (overlap >= 3) hits.push(row.q.replace(/\\?+$/, ''));
  }
  if (!hits.length) hits.push(...SEMANTIC_FAQ_HUB_SCHEMA.slice(0, 6).map((r) => r.q.replace(/\\?+$/, '')));
  return Array.from(new Set(hits)).slice(0, 16);
}

function hubFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': \`\${${P}_HUB_URL}#faq\`,
    mainEntity: SEMANTIC_FAQ_HUB_SCHEMA.map((row) => ({
      '@type': 'Question',
      name: row.q,
      acceptedAnswer: { '@type': 'Answer', text: row.a },
    })),
  };
}

function hubKeywordItemListJsonLd(hubUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': \`\${hubUrl}#keyword-index\`,
    name: '${spec.brand} Search Index',
    numberOfItems: ${P}_KEYWORD_PHRASES.length,
    itemListElement: ${P}_KEYWORD_PHRASES.map((phrase, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: phrase,
      url: \`\${hubUrl}#\${slugify(phrase)}\`,
    })),
  };
}

function entrySeoBrandKeywords(question) {
  return Array.from(new Set([
    ...COMPETE_DISPLAY_KEYWORDS,
    ...semanticFaqForTitle(question),
    '${spec.brand} review',
    '${spec.brand} reviews',
    '${spec.brand} rankings',
  ]));
}

module.exports = {
  ${P}_HUB_URL,
  ${P}_HUB_PAGE,
  ${P}_STATIC_URLS,
  ${P}_KEYWORD_PHRASES,
  COMPETE_DISPLAY_KEYWORDS,
  SEMANTIC_FAQ_HUB_SCHEMA,
  GLOBAL_TAGS,
  tagsForEntry,
  hubDisplayKeywords,
  hubMetaKeywords,
  semanticFaqForTitle,
  hubFaqJsonLd,
  hubKeywordItemListJsonLd,
  entrySeoBrandKeywords,
};
`;
  fs.writeFileSync(file, body);
}

function writeSyncHub(spec) {
  const P = upper(spec.prefix);
  const file = path.join(ROOT, `_${spec.prefix}_seo_sync_hub.js`);
  const body = `// Sync ${spec.brand} hub meta + JSON-LD. Usage: node _${spec.prefix}_seo_sync_hub.js
const fs = require('fs');
const path = require('path');
const { ${P}_HUB_PAGE, ${P}_HUB_URL, hubMetaKeywords, hubFaqJsonLd, hubKeywordItemListJsonLd, ${P}_KEYWORD_PHRASES } = require('./_${spec.prefix}_compete_semantic_keywords');
const { pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');

const HUB = path.join(__dirname, ${P}_HUB_PAGE);
function escMeta(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;'); }

let html = fs.readFileSync(HUB, 'utf8');
const phrases = hubMetaKeywords(48);
const joined = phrases.join(', ');
html = html.split('\\n').map((line) => /^\\s*<meta name="keywords"/i.test(line) ? \`<meta name="keywords" content="\${escMeta(joined)}">\` : line).join('\\n');
if (!/^\\s*<meta name="keywords"/im.test(html)) {
  html = html.replace(/(<link rel="canonical"[^>]+>)/i, \`$1\\n<meta name="keywords" content="\${escMeta(joined)}">\`);
}
const collectionLd = {
  '@context': 'https://schema.org', '@type': 'CollectionPage', '@id': \`\${${P}_HUB_URL}#webpage\`,
  name: '${spec.brand}', url: ${P}_HUB_URL, description: ${JSON.stringify(spec.hubDesc)},
  keywords: phrases.slice(0, 24).join(', '),
};
const ldBlock = \`<script type="application/ld+json">\\n\${JSON.stringify(collectionLd, null, 2)}\\n</script>\\n<script type="application/ld+json">\\n\${JSON.stringify(hubFaqJsonLd(), null, 2)}\\n</script>\\n<script type="application/ld+json">\\n\${JSON.stringify(hubKeywordItemListJsonLd(${P}_HUB_URL), null, 2)}\\n</script>\`;
if (html.includes('application/ld+json')) html = html.replace(/<script type="application\\/ld\\+json">[\\s\\S]*?<\\/script>\\s*/gi, '');
html = html.replace('</head>', \`\${ldBlock}\\n</head>\`);
fs.writeFileSync(HUB, html);
console.log('hub synced', ${P}_HUB_PAGE, 'phrases', ${P}_KEYWORD_PHRASES.length);
(async () => { const ping = await pingIndexNowUrlList([${P}_HUB_URL]); console.log('hub IndexNow', JSON.stringify(ping)); })().catch(console.error);
`;
  fs.writeFileSync(file, body);
}

function writeOptimize(spec) {
  const P = upper(spec.prefix);
  const file = path.join(ROOT, `_${spec.prefix}_seo_optimize.js`);
  const body = `// SEO-optimize all ${spec.prefix}#### entries. Usage: node _${spec.prefix}_seo_optimize.js [--dry-run]
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { tagsForEntry, entrySeoBrandKeywords, semanticFaqForTitle, ${P}_STATIC_URLS, ${P}_KEYWORD_PHRASES } = require('./_${spec.prefix}_compete_semantic_keywords');
const { pingIndexNowEntry, pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');
try { const env = fs.readFileSync('${ROOT.replace(/\\/g, '/')}/.env.local', 'utf8'); for (const line of env.split(/\\r?\\n/)) { const m = line.match(/^\\s*([A-Za-z0-9_]+)\\s*=\\s*(.*)\\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (_) {}
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN;
const DRY = process.argv.includes('--dry-run');
const RX = /^${spec.prefix}\\d+$/i;
(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const rows = (idx.entries || []).filter((e) => e && RX.test(e.id));
  let changed = 0;
  for (const row of rows) {
    const entry = await store.get('answers/' + row.id + '.json', { type: 'json' });
    if (!entry) continue;
    const newTags = tagsForEntry(row.id, entry.question || row.question, entry.tags || row.tags);
    const newDisplay = entrySeoBrandKeywords(entry.question || row.question);
    const newFaq = semanticFaqForTitle(entry.question || row.question);
    const did = JSON.stringify(newTags) !== JSON.stringify(entry.tags || []) || JSON.stringify(entry.seo_brand_keywords || []) !== JSON.stringify(newDisplay) || JSON.stringify(entry.seo_semantic_faq_questions || []) !== JSON.stringify(newFaq);
    if (!DRY && did) {
      const now = Date.now();
      await store.setJSON('answers/' + row.id + '.json', { ...entry, tags: newTags, seo_brand_keywords: newDisplay, seo_semantic_faq_questions: newFaq, seo_semantic_faq: true, seo_keyword_phrase_count: ${P}_KEYWORD_PHRASES.length, seo_optimized_at: now });
      const i = idx.entries.findIndex((e) => e && e.id === row.id);
      if (i >= 0) idx.entries[i] = { ...idx.entries[i], tags: newTags, seo_optimized_at: now };
      changed++;
      await pingIndexNowEntry(row.id, store, { ...row, tags: newTags });
      console.log(row.id, 'stamped');
    }
  }
  if (!DRY) await store.setJSON('_index.json', idx);
  if (!DRY) await pingIndexNowUrlList(${P}_STATIC_URLS);
  const report = { ok: true, prefix: '${spec.prefix}', count: rows.length, changed, phrases: ${P}_KEYWORD_PHRASES.length };
  fs.writeFileSync('${ROOT.replace(/\\/g, '/')}/_${spec.prefix}_seo_optimize_report.json', JSON.stringify(report, null, 1));
  console.log(JSON.stringify(report));
})().catch((e) => { console.error(e); process.exit(1); });
`;
  fs.writeFileSync(file, body);
}

function generateStack(prefix) {
  const spec = PILLAR_SPECS[prefix];
  if (!spec) throw new Error('unknown prefix ' + prefix);
  const n = writePhrases(spec);
  writeCompete(spec);
  writeSyncHub(spec);
  writeOptimize(spec);
  return { prefix, phrases: n };
}

module.exports = { generateStack };
