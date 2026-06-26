// Quick SEO spot-check for HS Football Recruiting (hf####) entries.
const https = require('https');

const IDS = process.argv.slice(2);
if (!IDS.length) {
  console.error('usage: node _hf_seo_check.js hf0002 hf0003 ...');
  process.exit(1);
}

function get(url) {
  return new Promise((resolve) => {
    https
      .get(url, { headers: { 'User-Agent': 'pulse-hf-seo-check/1.0' } }, (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve({ status: res.statusCode, body }));
      })
      .on('error', (e) => resolve({ status: 0, body: e.message }));
  });
}

function pick(html, re) {
  const m = html.match(re);
  return m ? (m[1] || m[0]).trim() : '';
}

async function main() {
  const sm = await get('https://pulserevops.com/.netlify/functions/pulse-machine-sitemap?pillar=hf');
  const smBody = sm.body || '';
  let allOk = true;

  for (const id of IDS) {
    const url = `https://pulserevops.com/highschool-football-recruiting/${id}`;
    const page = await get(url);
    const html = page.body || '';
    const canonical = pick(html, /rel="canonical"\s+href="([^"]+)"/i);
    const title = pick(html, /<title[^>]*>([^<]+)/i);
    const desc = pick(html, /name="description"\s+content="([^"]+)"/i);
    const keywords = pick(html, /name="keywords"\s+content="([^"]+)"/i);
    const h1 = pick(html, /<h1[^>]*class="q"[^>]*>([^<]+)/i) || pick(html, /<h1[^>]*>([^<]+)/i);
    const jsonLd = /application\/ld\+json/i.test(html);
    const inSitemap = smBody.includes(`/highschool-football-recruiting/${id}`);
    const seoOk =
      page.status === 200 &&
      title &&
      desc &&
      canonical.includes(id) &&
      h1 &&
      jsonLd &&
      inSitemap;
    if (!seoOk) allOk = false;
    console.log(`${id}\tHTTP ${page.status}\tSEO ${seoOk ? 'OK' : 'FAIL'}\tSitemap ${inSitemap ? 'yes' : 'NO'}`);
    console.log(`  title: ${title.slice(0, 90)}`);
    console.log(`  keywords: ${keywords.slice(0, 120)}...`);
  }

  console.log('\nSummary:', allOk ? 'ALL PASS' : 'ISSUES FOUND');
  process.exit(allOk ? 0 : 1);
}

main();
