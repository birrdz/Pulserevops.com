// Sync semantic compete keywords onto coaching.html hub meta + FAQPage JSON-LD.
const fs = require('fs');
const path = require('path');
const {
  CG_HUB_PAGE,
  CG_HUB_URL,
  hubMetaKeywords,
  hubFaqJsonLd,
  hubKeywordItemListJsonLd,
  CG_KEYWORD_PHRASES,
} = require('./_cg_compete_semantic_keywords');
const { pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');

const HUB = path.join(__dirname, CG_HUB_PAGE);
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
  '$1Practical sales coaching Q&A for managers — how to coach reps on prospecting, discovery, objections, closing, pipeline, 1:1s, ramp, and underperformance. Semantic-search FAQ index for 2027.$3'
);

const faqLd = hubFaqJsonLd();
const keywordListLd = hubKeywordItemListJsonLd(CG_HUB_URL);
const collectionLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${CG_HUB_URL}#webpage`,
  name: 'Pulse Coaching — Sales Coaching Q&A for Managers',
  alternateName: 'Pulse Coaching Semantic Search FAQ Index',
  url: CG_HUB_URL,
  description:
    'Manager-facing sales coaching answers with scripts, diagnosis frameworks, and coaching cadences. Semantic FAQ structured data for prospecting, discovery, objections, closing, and pipeline coaching.',
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
console.log('patched', CG_HUB_PAGE, 'metaKeywords=', phrases.length, 'faqQuestions=', faqLd.mainEntity.length, 'keywordPhrases=', CG_KEYWORD_PHRASES.length);

(async () => {
  const ping = await pingIndexNowUrlList([CG_HUB_URL]);
  console.log('IndexNow hub', JSON.stringify(ping));
})().catch(() => {});
