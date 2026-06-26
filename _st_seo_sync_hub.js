// Sync semantic compete keywords onto sales-trainings.html hub meta + FAQPage JSON-LD.
const fs = require('fs');
const path = require('path');
const {
  ST_HUB_PAGE,
  ST_HUB_URL,
  hubMetaKeywords,
  hubFaqJsonLd,
  hubKeywordItemListJsonLd,
  ST_KEYWORD_PHRASES,
} = require('./_st_compete_semantic_keywords');
const { pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');

const HUB = path.join(__dirname, ST_HUB_PAGE);
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
  '$1Top-10 sales training rankings with Best Overall + Best Value picks. Semantic-search FAQ answers for MEDDPICC drills, Challenger exercises, role-play scenarios, manager workshops, and enablement agendas — ready to run in 2027.$3'
);

const faqLd = hubFaqJsonLd();
const keywordListLd = hubKeywordItemListJsonLd(ST_HUB_URL);
const collectionLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${ST_HUB_URL}#webpage`,
  name: 'Pulse Sales Trainings — Top-10 Sales Training Rankings',
  alternateName: 'Pulse Sales Trainings Semantic Search FAQ Index',
  url: ST_HUB_URL,
  description:
    'Top-10 sales training rankings with Best Overall + Best Value picks. Semantic FAQ structured data for methodologies, drills, role-plays, manager trainings, and sales enablement workshops.',
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
console.log('patched', ST_HUB_PAGE, 'metaKeywords=', phrases.length, 'faqQuestions=', faqLd.mainEntity.length, 'keywordPhrases=', ST_KEYWORD_PHRASES.length);

(async () => {
  const ping = await pingIndexNowUrlList([ST_HUB_URL]);
  console.log('IndexNow hub', JSON.stringify(ping));
})().catch(() => {});
