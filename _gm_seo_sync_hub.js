// Sync semantic compete keywords onto gaming.html hub meta + FAQPage JSON-LD.
const fs = require('fs');
const path = require('path');
const {
  GM_HUB_PAGE,
  GM_HUB_URL,
  hubMetaKeywords,
  hubFaqJsonLd,
  hubKeywordItemListJsonLd,
  hubVideoGameNotesJsonLd,
  GM_KEYWORD_PHRASES,
} = require('./_gm_compete_semantic_keywords');
const { pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');

const HUB = path.join(__dirname, GM_HUB_PAGE);
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
  '$1Top-10 gaming rankings — consoles, PCs, peripherals, and games with Best Overall + Best Value picks. Semantic-search FAQ for esports gear, cloud gaming, indie dev, and player how-to guides (2027).$3'
);

const faqLd = hubFaqJsonLd();
const keywordListLd = hubKeywordItemListJsonLd(GM_HUB_URL);
const collectionLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${GM_HUB_URL}#webpage`,
  name: 'Pulse Gaming — Top-10 Gaming Rankings',
  alternateName: 'Pulse Gaming Semantic Search FAQ Index',
  url: GM_HUB_URL,
  description:
    'Top-10 gaming rankings for hardware, games, and esports gear with Best Overall + Best Value picks, specs, prices, and player-tested verdicts.',
  keywords: phrases.slice(0, 24).join(', '),
  isPartOf: { '@type': 'WebSite', name: 'Pulse RevOps', url: 'https://pulserevops.com' },
};
const gamingNotesLd = hubVideoGameNotesJsonLd(GM_HUB_URL);

const ldBlock = `<script type="application/ld+json">\n${JSON.stringify(collectionLd, null, 2)}\n</script>\n<script type="application/ld+json">\n${JSON.stringify(gamingNotesLd, null, 2)}\n</script>\n<script type="application/ld+json">\n${JSON.stringify(faqLd, null, 2)}\n</script>\n<script type="application/ld+json">\n${JSON.stringify(keywordListLd, null, 2)}\n</script>`;

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
  GM_HUB_PAGE,
  'metaKeywords=',
  phrases.length,
  'faqQuestions=',
  faqLd.mainEntity.length,
  'keywordPhrases=',
  GM_KEYWORD_PHRASES.length
);

(async () => {
  const ping = await pingIndexNowUrlList([GM_HUB_URL]);
  console.log('IndexNow hub', JSON.stringify(ping));
})().catch(() => {});
