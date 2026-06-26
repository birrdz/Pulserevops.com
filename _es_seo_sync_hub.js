// Sync semantic compete keywords onto estates.html hub meta + FAQPage JSON-LD.
const fs = require('fs');
const path = require('path');
const {
  ES_HUB_PAGE,
  ES_HUB_URL,
  hubMetaKeywords,
  hubFaqJsonLd,
  hubKeywordItemListJsonLd,
  ES_KEYWORD_PHRASES,
} = require('./_es_compete_semantic_keywords');
const { pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');

const HUB = path.join(__dirname, ES_HUB_PAGE);
const phrases = hubMetaKeywords(48);
const joined = phrases.join(', ');

function escMeta(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;');
}

let html = fs.readFileSync(HUB, 'utf8');

html = html
  .split('\n')
  .map((line) =>
    /^\s*<meta name="keywords"/i.test(line)
      ? `<meta name="keywords" content="${escMeta(joined)}">`
      : line
  )
  .join('\n');

if (!/^\s*<meta name="keywords"/im.test(html)) {
  html = html.replace(
    /(<link rel="canonical"[^>]+>)/i,
    `$1\n<meta name="keywords" content="${escMeta(joined)}">`
  );
}

html = html.replace(
  /(<meta name="description" content=")([^"]*)(" *\/?>)/i,
  '$1Top-10 luxury estate &amp; real-estate rankings — gated communities, waterfront markets, builders, and neighborhoods with Best Overall + Best Value picks and real numbers (2027).$3'
);

const faqLd = hubFaqJsonLd();
const keywordListLd = hubKeywordItemListJsonLd(ES_HUB_URL);
const collectionLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${ES_HUB_URL}#webpage`,
  name: 'Pulse Estates — Top-10 Luxury Real Estate Rankings',
  alternateName: 'Pulse Estates Semantic Search FAQ Index',
  url: ES_HUB_URL,
  description:
    'Top-10 luxury estate and real-estate rankings with Best Overall + Best Value picks. Semantic FAQ structured data for gated communities, waterfront markets, golf communities, and luxury home builders.',
  keywords: phrases.slice(0, 24).join(', '),
  isPartOf: { '@type': 'WebSite', name: 'Pulse RevOps', url: 'https://pulserevops.com' },
};

const ldBlock = `<script type="application/ld+json">\n${JSON.stringify(collectionLd, null, 2)}\n</script>\n<script type="application/ld+json">\n${JSON.stringify(faqLd, null, 2)}\n</script>\n<script type="application/ld+json">\n${JSON.stringify(keywordListLd, null, 2)}\n</script>`;

if (html.includes('application/ld+json')) {
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/gi, '');
}
if (html.includes('</head>')) {
  html = html.replace('</head>', `${ldBlock}\n</head>`);
} else {
  html = html.replace(/<body>/i, `${ldBlock}\n</head>\n<body>`);
}

fs.writeFileSync(HUB, html);
console.log(
  'patched',
  ES_HUB_PAGE,
  'metaKeywords=',
  phrases.length,
  'faqQuestions=',
  faqLd.mainEntity.length,
  'keywordPhrases=',
  ES_KEYWORD_PHRASES.length
);

(async () => {
  const ping = await pingIndexNowUrlList([ES_HUB_URL]);
  console.log('IndexNow hub', JSON.stringify(ping));
})().catch(() => {});
