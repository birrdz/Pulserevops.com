// Probe every sitemap referenced by the site. For each, count <loc>s and
// status-check a spread sample (redirect:manual, so 301/302/308 = redirect,
// 404/410 = not found). Localizes which sitemaps emit non-200 URLs.
// Usage: node _sitemap_probe.js [samplePerSitemap=20]
const SAMPLE = parseInt(process.argv[2] || '20', 10);
const SITEMAPS = [
  'sitemap.xml','sitemap-tools.xml','sitemap-knowledge.xml','sitemap-recent.xml',
  'sitemap-press.xml','sitemap-news.xml','sitemap-howtos.xml','sitemap-pillars.xml',
  'sitemap-blog.xml','sitemap-machine.xml','sitemap-images.xml','sitemap-reviews.xml',
  'sitemap-knowledge-live.xml','sitemap-sales-trainings.xml','sitemap-industry-kpis.xml',
  'sitemap-tech-stacks.xml','sitemap-graphics.xml','sitemap-book-summaries.xml',
  'sitemap-electronic-reviews.xml','sitemap-revenue-architecture.xml',
  'sitemap-go-to-market-playbooks.xml','sitemap-franchises.xml','sitemap-leaderboards.xml',
  'sitemap-misc.xml','sitemap-trending.xml','.netlify/functions/pulse-machine-sitemap',
];
const BASE = 'https://pulserevops.com/';
async function status(u) {
  try {
    const r = await fetch(u, { method: 'GET', redirect: 'manual' });
    return r.status;
  } catch (e) { return 'ERR'; }
}
function pick(arr, n) {
  if (arr.length <= n) return arr;
  const step = arr.length / n, out = [];
  for (let i = 0; i < n; i++) out.push(arr[Math.floor(i * step)]);
  return out;
}
(async () => {
  const dirty = [];
  for (const sm of SITEMAPS) {
    let xml;
    try { xml = await (await fetch(BASE + sm)).text(); }
    catch (e) { console.log(`${sm.padEnd(42)} FETCH-ERR`); continue; }
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
    if (!locs.length) { console.log(`${sm.padEnd(42)} 0 locs`); continue; }
    const sample = pick(locs, SAMPLE);
    const codes = await Promise.all(sample.map(status));
    const buckets = {};
    codes.forEach(c => { const k = String(c)[0] === '2' ? '2xx' : String(c)[0] === '3' ? '3xx' : String(c)[0] === '4' ? '4xx' : String(c); buckets[k] = (buckets[k] || 0) + 1; });
    const bad = sample.filter((_, i) => String(codes[i])[0] === '3' || String(codes[i])[0] === '4');
    const badCodes = codes.filter(c => String(c)[0] === '3' || String(c)[0] === '4');
    console.log(`${sm.padEnd(42)} ${String(locs.length).padStart(5)} locs | sample ${SAMPLE}: ${JSON.stringify(buckets)}`);
    if (bad.length) { dirty.push({ sm, locs: locs.length, badCodes, examples: bad.slice(0, 4) }); }
  }
  console.log('\n=== DIRTY SITEMAPS (sample had 3xx/4xx) ===');
  dirty.forEach(d => { console.log(`  ${d.sm} (${d.locs} locs) codes=${JSON.stringify(d.badCodes)}`); d.examples.forEach(e => console.log(`     ${e}`)); });
})();
