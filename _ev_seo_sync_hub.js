// Sync semantic compete keywords onto events.html hub meta + FAQPage / Event JSON-LD.
const fs = require('fs');
const path = require('path');
const {
  EV_HUB_PAGE,
  EV_HUB_URL,
  hubMetaKeywords,
  hubFaqJsonLd,
  hubKeywordItemListJsonLd,
  hubEventSeriesJsonLd,
  EV_KEYWORD_PHRASES,
} = require('./_ev_compete_semantic_keywords');
const { pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');

const HUB = path.join(__dirname, EV_HUB_PAGE);
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
  '$1Top-10 event rankings with Best Overall + Best Value picks. Semantic-search FAQ for music festivals, food festivals, concerts, corporate venues, and city happenings — dates, tickets, and insider tips for 2026.$3'
);

const faqLd = hubFaqJsonLd();
const keywordListLd = hubKeywordItemListJsonLd(EV_HUB_URL);
const eventSeriesLd = hubEventSeriesJsonLd();
const collectionLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${EV_HUB_URL}#webpage`,
  name: 'Pulse Events — Top-10 Event Rankings',
  alternateName: 'Pulse Events Semantic Search FAQ Index',
  url: EV_HUB_URL,
  description:
    'Top-10 festival and event rankings with Best Overall + Best Value picks. Semantic FAQ structured data for music, food, cultural, and city calendars — each ranking maps to Event-style picks with dates, venues, and ticket guidance.',
  keywords: phrases.slice(0, 24).join(', '),
  about: eventSeriesLd,
  isPartOf: { '@type': 'WebSite', name: 'Pulse RevOps', url: 'https://pulserevops.com' },
};

const ldBlock = `<script type="application/ld+json">\n${JSON.stringify(collectionLd, null, 2)}\n</script>\n<script type="application/ld+json">\n${JSON.stringify(eventSeriesLd, null, 2)}\n</script>\n<script type="application/ld+json">\n${JSON.stringify(faqLd, null, 2)}\n</script>\n<script type="application/ld+json">\n${JSON.stringify(keywordListLd, null, 2)}\n</script>`;

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
  EV_HUB_PAGE,
  'metaKeywords=',
  phrases.length,
  'faqQuestions=',
  faqLd.mainEntity.length,
  'keywordPhrases=',
  EV_KEYWORD_PHRASES.length
);

(async () => {
  const ping = await pingIndexNowUrlList([EV_HUB_URL]);
  console.log('IndexNow hub', JSON.stringify(ping));
})().catch(() => {});
