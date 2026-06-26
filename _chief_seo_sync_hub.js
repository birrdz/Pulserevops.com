// Sync Chief Women's Network semantic compete keywords onto knowledge.html hub meta + JSON-LD.
const fs = require('fs');
const path = require('path');
const {
  CHIEF_HUB_PAGE,
  CHIEF_HUB_URL,
  hubMetaKeywords,
  hubFaqJsonLd,
  hubKeywordItemListJsonLd,
  CHIEF_KEYWORD_PHRASES,
} = require('./_chief_compete_semantic_keywords');
const { pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');

const HUB = path.join(__dirname, CHIEF_HUB_PAGE);
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

const faqLd = hubFaqJsonLd();
const keywordListLd = hubKeywordItemListJsonLd(CHIEF_HUB_URL);
const collectionLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${CHIEF_HUB_URL}#webpage`,
  name: 'Pulse RevOps Knowledge — Sales RevOps & GTM Answers',
  alternateName: 'Chief Women\'s Network Semantic Search FAQ Index',
  url: CHIEF_HUB_URL,
  description:
    'Sales RevOps and GTM operator answers with Chief Women\'s Network membership, chapter, event, and competitor-comparison semantic FAQ structured data.',
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
  CHIEF_HUB_PAGE,
  'metaKeywords=',
  phrases.length,
  'faqQuestions=',
  faqLd.mainEntity.length,
  'keywordPhrases=',
  CHIEF_KEYWORD_PHRASES.length
);

(async () => {
  const ping = await pingIndexNowUrlList([CHIEF_HUB_URL, 'https://pulserevops.com/knowledge.html']);
  console.log('IndexNow hub', JSON.stringify(ping));
})().catch(() => {});
