// Sync semantic compete keywords onto cars.html hub meta + FAQPage JSON-LD.
const fs = require('fs');
const path = require('path');
const {
  CA_HUB_PAGE,
  CA_HUB_URL,
  hubMetaKeywords,
  hubFaqJsonLd,
  hubModelItemListJsonLd,
} = require('./_ca_compete_semantic_keywords');
const { pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');

const HUB = path.join(__dirname, CA_HUB_PAGE);
const phrases = hubMetaKeywords(48);
const joined = phrases.join(', ');

function escMeta(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/\$/g, '&#36;');
}

let html = fs.readFileSync(HUB, 'utf8');

// Replace entire keywords line (legacy corruption may embed `>` inside the attribute).
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

// Semantic-search hub description
html = html.replace(
  /(<meta name="description" content=")([^"]*)(" *\/?>)/i,
  '$1Top-10 vehicle rankings with Best Overall + Best Value picks. Semantic-search FAQ answers for used SUVs, sedans, trucks, hybrids, and EVs — real prices, reliability, and buyer guides for 2025–2027.$3'
);

// Replace or inject CollectionPage + FAQPage JSON-LD
const faqLd = hubFaqJsonLd();
const modelListLd = hubModelItemListJsonLd(CA_HUB_URL);
const collectionLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${CA_HUB_URL}#webpage`,
  name: 'Pulse Cars — Top-10 Vehicle Rankings',
  alternateName: '200 Automotive Variations: Model, Type, and Decade',
  url: CA_HUB_URL,
  description:
    'Top-10 vehicle rankings by class and year with Best Overall + Best Value picks. 200 automotive variations indexed by Model, Type (body style), and Decade for semantic search and FAQ structured data.',
  keywords: phrases.slice(0, 24).join(', '),
  isPartOf: { '@type': 'WebSite', name: 'Pulse RevOps', url: 'https://pulserevops.com' },
};

const ldBlock = `<script type="application/ld+json">\n${JSON.stringify(collectionLd, null, 2)}\n</script>\n<script type="application/ld+json">\n${JSON.stringify(faqLd, null, 2)}\n</script>\n<script type="application/ld+json">\n${JSON.stringify(modelListLd, null, 2)}\n</script>`;

if (html.includes('application/ld+json')) {
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/gi, '');
}
if (html.includes('</head>')) {
  html = html.replace('</head>', `${ldBlock}\n</head>`);
} else {
  html = html.replace(/<body>/i, `${ldBlock}\n</head>\n<body>`);
}

fs.writeFileSync(HUB, html);
console.log('patched', CA_HUB_PAGE, 'metaKeywords=', phrases.length, 'faqQuestions=', faqLd.mainEntity.length, 'modelCatalog=', modelListLd.numberOfItems);

(async () => {
  const ping = await pingIndexNowUrlList([CA_HUB_URL]);
  console.log('IndexNow hub', JSON.stringify(ping));
})().catch(() => {});
