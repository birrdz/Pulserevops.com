// Sync semantic compete keywords onto clubs.html hub meta + FAQPage JSON-LD.
const fs = require('fs');
const path = require('path');
const {
  CL_HUB_PAGE,
  CL_HUB_URL,
  hubMetaKeywords,
  hubFaqJsonLd,
  hubKeywordItemListJsonLd,
  hubLocalBusinessNotesJsonLd,
  CL_KEYWORD_PHRASES,
} = require('./_cl_compete_semantic_keywords');
const { pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');

const HUB = path.join(__dirname, CL_HUB_PAGE);
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
  '$1Top-10 private and social club rankings with Best Overall + Best Value picks. Semantic-search FAQ answers for membership clubs, networking, dues, amenities, and third-space lifestyle guides for 2027.$3'
);

const collectionLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${CL_HUB_URL}#webpage`,
  name: 'Pulse Clubs — Top-10 Private Club Rankings',
  alternateName: 'Pulse Clubs Semantic Search FAQ Index',
  url: CL_HUB_URL,
  description:
    'Top-10 private and social club rankings with Best Overall + Best Value picks. Semantic FAQ structured data for membership clubs, networking, amenities, and third-space lifestyle guides.',
  keywords: phrases.slice(0, 24).join(', '),
  isPartOf: { '@type': 'WebSite', name: 'Pulse RevOps', url: 'https://pulserevops.com' },
  about: {
    '@type': 'LocalBusiness',
    '@id': `${CL_HUB_URL}#local-clubs`,
    name: 'Pulse Clubs Private Club Guide',
    description: 'Private and social club rankings with membership guides for US cities.',
    areaServed: { '@type': 'Country', name: 'United States' },
  },
};

const faqLd = hubFaqJsonLd();
const keywordListLd = hubKeywordItemListJsonLd(CL_HUB_URL);
const localBizLd = hubLocalBusinessNotesJsonLd(CL_HUB_URL);

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
console.log('patched', CL_HUB_PAGE, 'metaKeywords=', phrases.length, 'faqQuestions=', faqLd.mainEntity.length, 'keywordPhrases=', CL_KEYWORD_PHRASES.length);

(async () => {
  const ping = await pingIndexNowUrlList([CL_HUB_URL]);
  console.log('IndexNow hub', JSON.stringify(ping));
})().catch(() => {});
