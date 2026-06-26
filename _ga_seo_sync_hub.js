// Sync semantic compete keywords onto gatherings.html hub meta + FAQPage JSON-LD.
const fs = require('fs');
const path = require('path');
const {
  GA_HUB_PAGE,
  GA_HUB_URL,
  hubMetaKeywords,
  hubFaqJsonLd,
  hubKeywordItemListJsonLd,
  GA_KEYWORD_PHRASES,
} = require('./_ga_compete_semantic_keywords');
const { pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');

const HUB = path.join(__dirname, GA_HUB_PAGE);
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
  '$1Top-10 gathering venue and caterer rankings with Best Overall + Best Value picks. Semantic-search FAQ for intentional hosting, community-building gatherings, wedding venues, and party spaces — real detail for 2027.$3'
);

const collectionLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${GA_HUB_URL}#webpage`,
  name: 'Pulse Gatherings — Top-10 Venue & Hosting Rankings',
  alternateName: 'Pulse Gatherings Semantic Search FAQ Index',
  url: GA_HUB_URL,
  description:
    'Top-10 wedding venues, event spaces, caterers, and party spots with Best Overall + Best Value picks. Semantic FAQ structured data for intentional hosting and community-building gatherings.',
  keywords: phrases.slice(0, 24).join(', '),
  isPartOf: { '@type': 'WebSite', name: 'Pulse RevOps', url: 'https://pulserevops.com' },
};

const faqLd = hubFaqJsonLd();
const keywordListLd = hubKeywordItemListJsonLd(GA_HUB_URL);

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
console.log('patched', GA_HUB_PAGE, 'metaKeywords=', phrases.length, 'faqQuestions=', faqLd.mainEntity.length, 'keywordPhrases=', GA_KEYWORD_PHRASES.length);

(async () => {
  const ping = await pingIndexNowUrlList([GA_HUB_URL]);
  console.log('IndexNow hub', JSON.stringify(ping));
})().catch(() => {});
