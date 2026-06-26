// Sync Pulse Football Recruiting hub meta + JSON-LD. Usage: node _hf_seo_sync_hub.js
const fs = require('fs');
const path = require('path');
const { HF_HUB_PAGE, HF_HUB_URL, hubMetaKeywords, hubFaqJsonLd, hubKeywordItemListJsonLd, HF_KEYWORD_PHRASES } = require('./_hf_compete_semantic_keywords');
const { pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');

const HUB = path.join(__dirname, HF_HUB_PAGE);
function escMeta(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;'); }

let html = fs.readFileSync(HUB, 'utf8');
const phrases = hubMetaKeywords(48);
const joined = phrases.join(', ');
html = html.split('\n').map((line) => /^\s*<meta name="keywords"/i.test(line) ? `<meta name="keywords" content="${escMeta(joined)}">` : line).join('\n');
if (!/^\s*<meta name="keywords"/im.test(html)) {
  html = html.replace(/(<link rel="canonical"[^>]+>)/i, `$1\n<meta name="keywords" content="${escMeta(joined)}">`);
}
const collectionLd = {
  '@context': 'https://schema.org', '@type': 'CollectionPage', '@id': `${HF_HUB_URL}#webpage`,
  name: 'Pulse Football Recruiting', url: HF_HUB_URL, description: "Top-10 HS football recruiting rankings with Best Overall + Best Value picks for camps, coaches, and NIL prep.",
  keywords: phrases.slice(0, 24).join(', '),
};
const ldBlock = `<script type="application/ld+json">\n${JSON.stringify(collectionLd, null, 2)}\n</script>\n<script type="application/ld+json">\n${JSON.stringify(hubFaqJsonLd(), null, 2)}\n</script>\n<script type="application/ld+json">\n${JSON.stringify(hubKeywordItemListJsonLd(HF_HUB_URL), null, 2)}\n</script>`;
if (html.includes('application/ld+json')) html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/gi, '');
html = html.replace('</head>', `${ldBlock}\n</head>`);
fs.writeFileSync(HUB, html);
console.log('hub synced', HF_HUB_PAGE, 'phrases', HF_KEYWORD_PHRASES.length);
(async () => { const ping = await pingIndexNowUrlList([HF_HUB_URL]); console.log('hub IndexNow', JSON.stringify(ping)); })().catch(console.error);
