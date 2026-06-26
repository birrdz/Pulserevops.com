// Sync semantic compete keywords onto dining.html hub meta + FAQPage JSON-LD.
const fs = require('fs');
const path = require('path');
const {
  DN_HUB_PAGE,
  DN_HUB_URL,
  hubMetaKeywords,
  hubFaqJsonLd,
  hubKeywordItemListJsonLd,
  hubLocalBusinessNotesJsonLd,
  DN_KEYWORD_PHRASES,
} = require('./_dn_compete_semantic_keywords');
const { pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');

const HUB = path.join(__dirname, DN_HUB_PAGE);
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
  '$1Top-10 restaurant rankings with Best Overall + Best Value picks. Semantic-search FAQ answers for local dining, cuisines, date nights, family spots, reservations, and food-trip guides — real menus and prices for 2027.$3'
);

const collectionLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${DN_HUB_URL}#webpage`,
  name: 'Pulse Dining — Top-10 Restaurant Rankings',
  alternateName: 'Pulse Dining Semantic Search FAQ Index',
  url: DN_HUB_URL,
  description:
    'Top-10 restaurant rankings with Best Overall + Best Value picks. Semantic FAQ structured data for local dining, cuisines, occasions, vibes, and reservation how-to guides.',
  keywords: phrases.slice(0, 24).join(', '),
  isPartOf: { '@type': 'WebSite', name: 'Pulse RevOps', url: 'https://pulserevops.com' },
  about: {
    '@type': 'LocalBusiness',
    '@id': `${DN_HUB_URL}#local-dining`,
    name: 'Pulse Dining Restaurant Guide',
    description: 'Local restaurant rankings and dining guides for US cities and neighborhoods.',
    areaServed: { '@type': 'Country', name: 'United States' },
  },
};

const faqLd = hubFaqJsonLd();
const keywordListLd = hubKeywordItemListJsonLd(DN_HUB_URL);
const localBizLd = hubLocalBusinessNotesJsonLd(DN_HUB_URL);

const ldBlock = `<script type="application/ld+json">\n${JSON.stringify(collectionLd, null, 2)}\n</script>\n<script type="application/ld+json">\n${JSON.stringify(faqLd, null, 2)}\n</script>\n<script type="application/ld+json">\n${JSON.stringify(keywordListLd, null, 2)}\n</script>\n<script type="application/ld+json">\n${JSON.stringify(localBizLd, null, 2)}\n</script>`;

if (html.includes('application/ld+json')) {
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/gi, '');
}
if (html.includes('</head>')) {
  html = html.replace('</head>', `${ldBlock}\n</head>`);
} else {
  html = html.replace(/<body>/i, `${ldBlock}\n</head>\n<body>`);
}

fs.writeFileSync(HUB, html);
console.log('patched', DN_HUB_PAGE, 'metaKeywords=', phrases.length, 'faqQuestions=', faqLd.mainEntity.length, 'keywordPhrases=', DN_KEYWORD_PHRASES.length);

(async () => {
  const ping = await pingIndexNowUrlList([DN_HUB_URL]);
  console.log('IndexNow hub', JSON.stringify(ping));
})().catch(() => {});
