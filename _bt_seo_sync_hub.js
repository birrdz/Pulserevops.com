// Sync semantic compete keywords onto boats.html hub meta + FAQPage JSON-LD.
const fs = require('fs');
const path = require('path');
const {
  BT_HUB_PAGE,
  BT_HUB_URL,
  hubMetaKeywords,
  hubFaqJsonLd,
  hubKeywordItemListJsonLd,
  BT_KEYWORD_PHRASES,
} = require('./_bt_compete_semantic_keywords');
const { pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');

const HUB = path.join(__dirname, BT_HUB_PAGE);
const phrases = hubMetaKeywords(48);
const joined = phrases.join(', ');

function escMeta(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/\$/g, '&#36;');
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
  '$1Top-10 boat rankings with Best Overall + Best Value picks. Semantic-search FAQ answers for pontoons, bowriders, center consoles, fishing boats, and buyer guides — real prices and specs for 2027.$3'
);

const faqLd = hubFaqJsonLd();
const keywordListLd = hubKeywordItemListJsonLd(BT_HUB_URL);
const collectionLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${BT_HUB_URL}#webpage`,
  name: 'Pulse Boats — Top-10 Marine Rankings',
  alternateName: 'Pulse Boats Semantic Search FAQ Index',
  url: BT_HUB_URL,
  description:
    'Top-10 boat rankings by type and use case with Best Overall + Best Value picks. Semantic FAQ structured data for buying, recreational boating, maintenance, and marine comparisons.',
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
console.log('patched', BT_HUB_PAGE, 'metaKeywords=', phrases.length, 'faqQuestions=', faqLd.mainEntity.length, 'keywordPhrases=', BT_KEYWORD_PHRASES.length);

(async () => {
  const ping = await pingIndexNowUrlList([BT_HUB_URL]);
  console.log('IndexNow hub', JSON.stringify(ping));
})().catch(() => {});
