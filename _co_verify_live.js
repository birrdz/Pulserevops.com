const fs = require('fs');
(async () => {
  const r = await fetch('https://pulserevops.com/.netlify/functions/pulse-machine-sitemap');
  const t = await r.text();
  console.log(
    JSON.stringify({
      status: r.status,
      co0001: t.includes('/collectibles/co0001'),
      co0074: t.includes('/collectibles/co0074'),
      hub: t.includes('/collectibles'),
    })
  );
  const page = await fetch('https://pulserevops.com/collectibles/co0001');
  const html = await page.text();
  const kw = (html.match(/<meta name="keywords" content="([^"]*)"/i) || [])[1] || '';
  console.log(
    JSON.stringify({
      co0001_status: page.status,
      keywords_len: kw.length,
      has_pulse_collectibles: kw.toLowerCase().includes('pulse collectibles'),
      has_baseball: kw.toLowerCase().includes('baseball'),
      has_ld_json: html.includes('application/ld+json'),
    })
  );
  const hub = await fetch('https://pulserevops.com/collectibles');
  const hubHtml = await hub.text();
  const hubKw = (hubHtml.match(/<meta name="keywords" content="([^"]*)"/i) || [])[1] || '';
  console.log(
    JSON.stringify({
      hub_status: hub.status,
      hub_keywords_len: hubKw.length,
      hub_faq: hubHtml.includes('FAQPage'),
      hub_keyword_index: hubHtml.includes('keyword-index'),
      hub_phrase_count: (hubHtml.match(/"@type": "Question"/g) || []).length,
    })
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
