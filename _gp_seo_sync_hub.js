// Sync semantic compete keywords onto go-to-market-playbooks.html hub meta + FAQPage JSON-LD.
const fs = require('fs');
const path = require('path');
const {
  GP_HUB_PAGE,
  GP_HUB_URL,
  hubMetaKeywords,
  hubFaqJsonLd,
  hubKeywordItemListJsonLd,
  GP_KEYWORD_PHRASES,
} = require('./_gp_compete_semantic_keywords');
const { pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');

const HUB = path.join(__dirname, GP_HUB_PAGE);
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
  // Use a function replacement, NOT a string. The keyword phrases contain
  // literal "$1M to $10M ARR" — in a string replacement JS reads those $1/$10
  // as backreferences, eating them and injecting the captured <link> tag mid
  // attribute (which closes content="" early and dumps the keyword list as
  // visible body text). A function return value is never $-substituted.
  const metaTag = `<meta name="keywords" content="${escMeta(joined)}">`;
  html = html.replace(
    /(<link rel="canonical"[^>]+>)/i,
    (_m, p1) => `${p1}\n${metaTag}`
  );
}

html = html.replace(
  /(<meta name="description" content=")([^"]*)(" *\/?>)/i,
  '$1Operator-grade GTM playbooks for B2B SaaS — launch, scale, and pivot motions, PLG vs sales-led, ICP, positioning, pricing, channel, and RevOps alignment. Semantic-search FAQ index for 2027.$3'
);

const faqLd = hubFaqJsonLd();
const keywordListLd = hubKeywordItemListJsonLd(GP_HUB_URL);
const collectionLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${GP_HUB_URL}#webpage`,
  name: 'Pulse GTM Playbooks — Go-To-Market Operator Guides',
  alternateName: 'Pulse GTM Semantic Search FAQ Index',
  url: GP_HUB_URL,
  description:
    'Step-by-step go-to-market playbooks for launching, scaling, and pivoting B2B SaaS motions. Semantic FAQ structured data for ICP, positioning, pricing, channel, and RevOps-aligned GTM operating models.',
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
console.log('patched', GP_HUB_PAGE, 'metaKeywords=', phrases.length, 'faqQuestions=', faqLd.mainEntity.length, 'keywordPhrases=', GP_KEYWORD_PHRASES.length);

(async () => {
  const ping = await pingIndexNowUrlList([GP_HUB_URL]);
  console.log('IndexNow hub', JSON.stringify(ping));
})().catch(() => {});
