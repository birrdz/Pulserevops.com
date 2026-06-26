// Sync semantic compete keywords onto nightlife.html hub meta + FAQPage JSON-LD.
const fs = require('fs');
const path = require('path');
const {
  NL_HUB_PAGE,
  NL_HUB_URL,
  hubMetaKeywords,
  hubFaqJsonLd,
  hubKeywordItemListJsonLd,
  hubLocalBusinessNotesJsonLd,
  NL_KEYWORD_PHRASES,
} = require('./_nl_compete_semantic_keywords');
const { pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');

const HUB = path.join(__dirname, NL_HUB_PAGE);
const phrases = hubMetaKeywords(48);
const joined = phrases.join(', ');

function escMeta(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
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
  '$1Top-10 nightlife rankings with Best Overall + Best Value picks. Semantic-search FAQ for bars, clubs, rooftops, speakeasies, and going-out guides — cover charges, dress codes, and reservation tips for 2027.$3'
);

const collectionLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${NL_HUB_URL}#webpage`,
  name: 'Pulse Nightlife — Top-10 Bars and Clubs Rankings',
  alternateName: 'Pulse Nightlife Semantic Search FAQ Index',
  url: NL_HUB_URL,
  description: 'Top-10 nightlife rankings with Best Overall + Best Value picks across cities worldwide.',
  keywords: phrases.slice(0, 24).join(', '),
  isPartOf: { '@type': 'WebSite', name: 'Pulse RevOps', url: 'https://pulserevops.com' },
};

const ldBlock = `<script type="application/ld+json">\n${JSON.stringify(collectionLd, null, 2)}\n</script>\n<script type="application/ld+json">\n${JSON.stringify(hubFaqJsonLd(), null, 2)}\n</script>\n<script type="application/ld+json">\n${JSON.stringify(hubKeywordItemListJsonLd(NL_HUB_URL), null, 2)}\n</script>\n<script type="application/ld+json">\n${JSON.stringify(hubLocalBusinessNotesJsonLd(NL_HUB_URL), null, 2)}\n</script>`;

if (html.includes('application/ld+json')) {
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/gi, '');
}
html = html.replace('</head>', `${ldBlock}\n</head>`);

fs.writeFileSync(HUB, html);
console.log('hub synced', NL_HUB_PAGE, 'phrases', NL_KEYWORD_PHRASES.length);

(async () => {
  const ping = await pingIndexNowUrlList([NL_HUB_URL]);
  console.log('hub IndexNow', JSON.stringify(ping));
})().catch((e) => console.error(e));
