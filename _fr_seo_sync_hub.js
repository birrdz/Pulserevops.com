// Sync semantic compete keywords onto franchises.html hub meta + FAQPage JSON-LD.
const fs = require('fs');
const path = require('path');
const {
  FR_HUB_PAGE,
  FR_HUB_URL,
  hubMetaKeywords,
  hubFaqJsonLd,
  hubKeywordItemListJsonLd,
  FR_KEYWORD_PHRASES,
} = require('./_fr_compete_semantic_keywords');
const { pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');

const HUB = path.join(__dirname, FR_HUB_PAGE);
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
    (m) => `${m}\n<meta name="keywords" content="${escMeta(joined)}">`
  );
}

html = html.replace(
  /(<meta name="description" content=")([^"]*)(" *\/?>)/i,
  '$1Should you open a snow-cone shop, buy a Chick-fil-A franchise, or launch a cleaning business in 2027? Operator-grade franchise and business-evaluation guides with real FDD numbers, unit economics, and open-or-buy decision trees.$3'
);

const faqLd = hubFaqJsonLd();
const keywordListLd = hubKeywordItemListJsonLd(FR_HUB_URL);
const collectionLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${FR_HUB_URL}#webpage`,
  name: 'Pulse Franchises — Business Ideas & Franchise Evaluations',
  alternateName: 'Pulse Franchises Semantic Search FAQ Index',
  url: FR_HUB_URL,
  description:
    'Operator-grade franchise and business-evaluation guides with startup costs, unit economics, FDD review checklists, and open-or-buy decision trees for 2027.',
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
  FR_HUB_PAGE,
  'metaKeywords=',
  phrases.length,
  'faqQuestions=',
  faqLd.mainEntity.length,
  'keywordPhrases=',
  FR_KEYWORD_PHRASES.length
);

(async () => {
  const ping = await pingIndexNowUrlList([FR_HUB_URL]);
  console.log('IndexNow hub', JSON.stringify(ping));
})().catch(() => {});
