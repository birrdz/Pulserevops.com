// Sync Pulse Industry KPIs hub meta + JSON-LD. Usage: node _ik_seo_sync_hub.js
const fs = require('fs');
const path = require('path');
const { IK_HUB_PAGE, IK_HUB_URL, hubMetaKeywords, hubFaqJsonLd, hubKeywordItemListJsonLd, IK_KEYWORD_PHRASES } = require('./_ik_compete_semantic_keywords');
const { pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');

const HUB = path.join(__dirname, IK_HUB_PAGE);
function escMeta(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;'); }

let html = fs.readFileSync(HUB, 'utf8');
const phrases = hubMetaKeywords(48);
const joined = phrases.join(', ');
html = html.split('\n').map((line) => /^\s*<meta name="keywords"/i.test(line) ? `<meta name="keywords" content="${escMeta(joined)}">` : line).join('\n');
if (!/^\s*<meta name="keywords"/im.test(html)) {
  html = html.replace(/(<link rel="canonical"[^>]+>)/i, `$1\n<meta name="keywords" content="${escMeta(joined)}">`);
}
const collectionLd = {
  '@context': 'https://schema.org', '@type': 'CollectionPage', '@id': `${IK_HUB_URL}#webpage`,
  name: 'Pulse Industry KPIs', url: IK_HUB_URL, description: "Industry KPI benchmarks and Top-10 metric guides for operators and RevOps leaders.",
  keywords: phrases.slice(0, 24).join(', '),
};
const ldBlock = `<script type="application/ld+json">\n${JSON.stringify(collectionLd, null, 2)}\n</script>\n<script type="application/ld+json">\n${JSON.stringify(hubFaqJsonLd(), null, 2)}\n</script>\n<script type="application/ld+json">\n${JSON.stringify(hubKeywordItemListJsonLd(IK_HUB_URL), null, 2)}\n</script>`;
if (html.includes('application/ld+json')) html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/gi, '');
html = html.replace('</head>', `${ldBlock}\n</head>`);
fs.writeFileSync(HUB, html);
console.log('hub synced', IK_HUB_PAGE, 'phrases', IK_KEYWORD_PHRASES.length);
(async () => { const ping = await pingIndexNowUrlList([IK_HUB_URL]); console.log('hub IndexNow', JSON.stringify(ping)); })().catch(console.error);
