// Sync semantic compete keywords onto buildouts.html hub meta + FAQPage JSON-LD.
const fs = require('fs');
const path = require('path');
const {
  BO_HUB_PAGE,
  BO_HUB_URL,
  hubMetaKeywords,
  hubFaqJsonLd,
  hubKeywordItemListJsonLd,
  BO_KEYWORD_PHRASES,
} = require('./_bo_compete_semantic_keywords');
const { pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');

const HUB = path.join(__dirname, BO_HUB_PAGE);
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
  '$1Save money on your commercial buildout and lease — TI allowances, NNN, CAM caps, free rent, and how not to get screwed by the landlord. Semantic-search FAQ for fit-out costs, lease negotiation, and buildout strategy (2027).$3'
);

const faqLd = hubFaqJsonLd();
const keywordListLd = hubKeywordItemListJsonLd(BO_HUB_URL);
const collectionLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${BO_HUB_URL}#webpage`,
  name: 'Pulse Buildouts — Commercial CRE & Buildout Q&A',
  alternateName: 'Pulse Buildouts Semantic Search FAQ Index',
  url: BO_HUB_URL,
  description:
    'Commercial buildout and lease guides with TI allowance negotiation, NNN vs gross lease, CAM caps, free rent, contractor vetting, and tenant improvement budgeting.',
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
  BO_HUB_PAGE,
  'metaKeywords=',
  phrases.length,
  'faqQuestions=',
  faqLd.mainEntity.length,
  'keywordPhrases=',
  BO_KEYWORD_PHRASES.length
);

(async () => {
  const ping = await pingIndexNowUrlList([BO_HUB_URL]);
  console.log('IndexNow hub', JSON.stringify(ping));
})().catch(() => {});
