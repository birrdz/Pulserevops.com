// Pulse AI Infrastructure — semantic search + FAQ compete keywords for ai#### entries.
// Applied via _ai_seo_optimize.js + ai-infrastructure.html hub sync.

const AI_KEYWORD_PHRASES = require('./_ai_keyword_phrases.json');

const AI_HUB_URL = 'https://pulserevops.com/ai-infrastructure';
const AI_HUB_PAGE = 'ai-infrastructure.html';
const AI_STATIC_URLS = [AI_HUB_URL];

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}

function phraseToFaq(phrase) {
  const topic = String(phrase)
    .replace(/^Best /i, '')
    .replace(/^Top 10 /i, '')
    .replace(/^The Ultimate List: /i, '')
    .trim();
  const q = `What are the ${topic.toLowerCase()}?`;
  const a = `Pulse AI Infrastructure ranks ${phrase} with Best Overall and Best Value picks, real pricing, platform notes, and a buyer decision tree for 2027 operators.`;
  return { q, a };
}

const SEMANTIC_FAQ_HUB_SCHEMA = AI_KEYWORD_PHRASES.map(phraseToFaq);

const COMPETE_DISPLAY_KEYWORDS = [
  'Semantic Search: AI Tools FAQ',
  'Pulse AI Infrastructure FAQ structured data',
  'Pulse AI Infrastructure semantic search optimization',
  'Pulse AI Infrastructure Top-10 Rankings',
  'Best Overall vs Best Value AI tools',
  'AI tool buyer guide 2027',
  'AI tools review 2027',
  'AI tools reviews',
  'AI tools comparison',
  'best AI tool rankings',
  ...AI_KEYWORD_PHRASES,
];

const GLOBAL_TAGS = [
  'pulse-ai-infrastructure',
  'ai-infrastructure',
  'ai-tools',
  'top-10',
  'best-of-2027',
  'semantic-search-faq',
  'ai-tools-buying-faq',
  'best-overall-best-value',
];

function keywordsFromTitle(title) {
  const t = String(title || '').toLowerCase();
  const hits = [];
  for (const phrase of AI_KEYWORD_PHRASES) {
    const p = phrase.toLowerCase().replace(/^top 10 /, '').replace(/^best /, '');
    const tokens = p.split(/\s+/).filter((w) => w.length > 3);
    const overlap = tokens.filter((w) => t.includes(w)).length;
    if (overlap >= 2 || t.includes(p.slice(0, 24))) hits.push(slugify(phrase));
  }
  if (!hits.length) {
    hits.push(...AI_KEYWORD_PHRASES.slice(0, 8).map(slugify));
  }
  return hits;
}

function tagsForEntry(id, question, existingTags = []) {
  const base = [...GLOBAL_TAGS, ...(existingTags || [])];
  const titleHits = keywordsFromTitle(question);
  const allSlugs = AI_KEYWORD_PHRASES.map(slugify);
  const merged = [...base, ...titleHits, ...allSlugs];
  return Array.from(new Set(merged.map(slugify).filter(Boolean)));
}

function allKeywordsFlat() {
  return Array.from(new Set([...GLOBAL_TAGS, ...AI_KEYWORD_PHRASES.map(slugify)]));
}

function hubDisplayKeywords() {
  return Array.from(
    new Set(COMPETE_DISPLAY_KEYWORDS.map((s) => String(s).trim()).filter(Boolean))
  );
}

function hubMetaKeywords(max = 48) {
  return hubDisplayKeywords().slice(0, max);
}

function semanticFaqForTitle(title) {
  const t = String(title || '').toLowerCase();
  const hits = [];
  for (const row of SEMANTIC_FAQ_HUB_SCHEMA) {
    const q = row.q.toLowerCase();
    const tokens = q.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 3);
    const overlap = tokens.filter((w) => t.includes(w)).length;
    if (overlap >= 3) hits.push(row.q.replace(/\?+$/, ''));
  }
  if (/writ|copy|blog|content/i.test(t)) hits.push('What are the top 10 ai tools for writing in 2027?');
  if (/cod|develop|program/i.test(t)) hits.push('What are the top 10 ai tools for coding in 2027?');
  if (/video|edit|film/i.test(t)) hits.push('What are the top 10 ai tools for video editing in 2027?');
  if (/image|photo|picture|generat/i.test(t)) hits.push('What are the top 10 ai tools for image generation in 2027?');
  if (/voice|speech|audio|podcast/i.test(t)) hits.push('What are the top 10 ai tools for voice cloning in 2027?');
  if (/music|song|audio/i.test(t)) hits.push('What are the top 10 ai tools for music creation in 2027?');
  if (/design|graphic|logo/i.test(t)) hits.push('What are the top 10 ai tools for graphic design in 2027?');
  if (/market|seo|ads|social/i.test(t)) hits.push('What are the top 10 ai tools for marketing in 2027?');
  if (/resume|cv|job/i.test(t)) hits.push('What are the top 10 ai tools for resume building in 2027?');
  if (/slide|presentation|deck/i.test(t)) hits.push('What are the top 10 ai tools for presentation slides in 2027?');
  if (/transcri|meeting|notes/i.test(t)) hits.push('What are the top 10 ai tools for transcription in 2027?');
  if (/data|analy|spreadsheet|excel/i.test(t)) hits.push('What are the top 10 ai tools for data analysis in 2027?');
  if (/chatbot|support|customer/i.test(t)) hits.push('What are the top 10 ai tools for chatbots in 2027?');
  if (/animat|motion/i.test(t)) hits.push('What are the top 10 ai tools for animation in 2027?');
  if (/email|outreach|sales/i.test(t)) hits.push('What are the top 10 ai tools for email writing in 2027?');
  if (/research|summar|pdf|document/i.test(t)) hits.push('What are the top 10 ai tools for research in 2027?');
  if (/website|app|build/i.test(t)) hits.push('What are the top 10 ai tools for website building in 2027?');
  if (/event|plan/i.test(t)) hits.push('What are the top 10 ai tools for event planning 2027?');
  if (!hits.length) hits.push(...SEMANTIC_FAQ_HUB_SCHEMA.slice(0, 6).map((r) => r.q.replace(/\?+$/, '')));
  return Array.from(new Set(hits)).slice(0, 16);
}

function hubFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${AI_HUB_URL}#faq`,
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
    '@id': `${hubUrl}#keyword-index`,
    name: 'Pulse AI Infrastructure Top-10 Search Index',
    description:
      'Semantic FAQ and Top-10 AI tools keyword index for writing, coding, video, design, voice, marketing, and automation.',
    numberOfItems: AI_KEYWORD_PHRASES.length,
    itemListElement: AI_KEYWORD_PHRASES.map((phrase, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: phrase,
      url: `${hubUrl}#${slugify(phrase)}`,
    })),
  };
}

function entrySeoBrandKeywords(question) {
  return Array.from(
    new Set([
      ...COMPETE_DISPLAY_KEYWORDS,
      ...semanticFaqForTitle(question),
      'Pulse AI Infrastructure review',
      'Pulse AI Infrastructure reviews',
      'Pulse AI Infrastructure rating',
      'Pulse AI Infrastructure comparison',
      'Pulse AI Infrastructure rankings',
    ])
  );
}

module.exports = {
  AI_HUB_URL,
  AI_HUB_PAGE,
  AI_STATIC_URLS,
  AI_KEYWORD_PHRASES,
  COMPETE_DISPLAY_KEYWORDS,
  SEMANTIC_FAQ_HUB_SCHEMA,
  GLOBAL_TAGS,
  tagsForEntry,
  allKeywordsFlat,
  hubDisplayKeywords,
  hubMetaKeywords,
  semanticFaqForTitle,
  hubFaqJsonLd,
  hubKeywordItemListJsonLd,
  entrySeoBrandKeywords,
};
