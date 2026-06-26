// Sync semantic compete keywords onto collectibles.html hub meta + FAQPage JSON-LD.
const fs = require('fs');
const path = require('path');
const {
  CO_HUB_PAGE,
  CO_HUB_URL,
  hubMetaKeywords,
  hubFaqJsonLd,
  hubKeywordItemListJsonLd,
  CO_KEYWORD_PHRASES,
} = require('./_co_compete_semantic_keywords');
const { pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');

const HUB = path.join(__dirname, CO_HUB_PAGE);
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
  '$1Top-10 collectible rankings with Best Overall + Best Value picks. Semantic-search FAQ for trading cards, coins, comics, watches, sneakers, vinyl, and memorabilia — real prices and grading guides for 2027.$3'
);

const faqLd = hubFaqJsonLd();
const keywordListLd = hubKeywordItemListJsonLd(CO_HUB_URL);
const collectionLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${CO_HUB_URL}#webpage`,
  name: 'Pulse Collectibles — Top-10 Collectible Rankings',
  alternateName: 'Pulse Collectibles Semantic Search FAQ Index',
  url: CO_HUB_URL,
  description:
    'Top-10 collectible rankings with Best Overall + Best Value picks. Semantic FAQ structured data for sports cards, coins, comics, watches, sneakers, vinyl, and memorabilia collectors.',
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
console.log('patched', CO_HUB_PAGE, 'metaKeywords=', phrases.length, 'faqQuestions=', faqLd.mainEntity.length, 'keywordPhrases=', CO_KEYWORD_PHRASES.length);

(async () => {
  const ping = await pingIndexNowUrlList([CO_HUB_URL]);
  console.log('IndexNow hub', JSON.stringify(ping));
})().catch(() => {});
