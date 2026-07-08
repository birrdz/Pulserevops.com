// One-off builder: turn the sandbox prototypes into production pages.
//  - downloads every Pollinations image to /assets/hv2/ (cached, so live loads are instant)
//  - swaps the prototype <title> for the real SEO head (canonical, OG, JSON-LD, favicons, manifest)
//  - repoints every prototype link (#, story.html, hub.html, tools.html) to real LIVE routes
//  - makes images load directly (no live generator on the production page)
// Re-runnable: skips images already cached.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SB = 'C:\\Users\\koryj\\AppData\\Local\\Temp\\claude\\C--Users-koryj\\15e2a644-c455-4107-ae7c-e832c08428dc\\scratchpad\\michelin-preview';
const OUT = 'C:\\Users\\koryj\\website';
const IMG_DIR = path.join(OUT, 'assets', 'hv2');
fs.mkdirSync(IMG_DIR, { recursive: true });

const FAVI = `<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#fdfbf7">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/svg+xml" href="/icon-192.svg">
<link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png">`;

const HEAD_HOME = `<title>Pulse — We add value</title>
<link rel="canonical" href="https://pulserevops.com/">
<meta name="description" content="Pulse — we add value. One free library of 35,000+ operator-grade answers, rankings, and guides across revenue, business, buying guides, places, and lifestyle.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://pulserevops.com/">
<meta property="og:site_name" content="Pulse">
<meta property="og:title" content="Pulse — We add value">
<meta property="og:description" content="35,000+ researched answers that add value — across revenue, business, buying guides, places and lifestyle. All free.">
<meta property="og:image" content="https://pulserevops.com/pulse-og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Pulse — We add value">
<meta name="twitter:description" content="35,000+ researched answers that add value. All free.">
<meta name="twitter:image" content="https://pulserevops.com/pulse-og.png">
${FAVI}
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebSite","name":"Pulse","alternateName":"Pulse RevOps","url":"https://pulserevops.com/","potentialAction":{"@type":"SearchAction","target":{"@type":"EntryPoint","urlTemplate":"https://pulserevops.com/knowledge?q={search_term_string}"},"query-input":"required name=search_term_string"}}
</script>`;

const HEAD_TOOLS = `<title>Pulse Tools — Practical how-tos for your revenue engine | Pulse</title>
<link rel="canonical" href="https://pulserevops.com/pulse-tools">
<meta name="description" content="Pulse Tools — plain, practical how-to answers for the tools that run your revenue engine: calculators, CRMs, forecasting, automation and reporting.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://pulserevops.com/pulse-tools">
<meta property="og:site_name" content="Pulse">
<meta property="og:title" content="Pulse Tools — Practical how-tos for your revenue engine">
<meta property="og:description" content="Calculators, CRMs, forecasting, automation, reporting — answered plainly.">
<meta property="og:image" content="https://pulserevops.com/pulse-og.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Pulse Tools — Practical how-tos for your revenue engine">
<meta name="twitter:image" content="https://pulserevops.com/pulse-og.png">
${FAVI}`;

async function localizeImages(html) {
  const urls = [...new Set([...html.matchAll(/https:\/\/image\.pollinations\.ai\/prompt\/[^"'\s]+/g)].map(m => m[0]))];
  console.log('  images to cache:', urls.length);
  let n = 0;
  for (const u of urls) {
    const name = 'hv2-' + crypto.createHash('sha1').update(u).digest('hex').slice(0, 16) + '.jpg';
    const fp = path.join(IMG_DIR, name);
    if (!fs.existsSync(fp) || fs.statSync(fp).size < 1200) {
      let ok = false;
      for (let t = 0; t < 4 && !ok; t++) {
        try {
          const r = await fetch(u, { signal: AbortSignal.timeout(50000) });
          if (r.ok) { const b = Buffer.from(await r.arrayBuffer()); if (b.length > 1200) { fs.writeFileSync(fp, b); ok = true; } }
        } catch (e) {}
        if (!ok) await new Promise(r => setTimeout(r, 1800));
      }
      console.log('   ' + (ok ? 'OK  ' : 'FAIL') + ' ' + name);
    }
    html = html.split(u).join('/assets/hv2/' + name);
    n++;
  }
  return html;
}

function commonTransforms(html) {
  // images load directly now (no live generator on the production page)
  html = html.replace(/data-src=/g, 'src=');
  html = html.replace(/class="ph load"/g, 'class="ph"');
  html = html.replace(/class="ph load"/g, 'class="ph"');
  // homepage started images at opacity:0 (revealed by the JS loader) — make them visible without it
  html = html.replace('img{opacity:0;transition:opacity .6s ease}', 'img{opacity:1}');
  // add lazy loading to every img
  html = html.replace(/<img /g, '<img loading="lazy" ');
  return html;
}

(async () => {
  // ---------- HOMEPAGE ----------
  let home = fs.readFileSync(path.join(SB, 'index.html'), 'utf8');
  // real nav + brand links
  home = home.replace(/<nav class="top">[\s\S]*?<\/nav>/,
    '<nav class="top"><a href="/">The Guide</a><a href="/coaching">Fractional CRO</a><a href="/pulse-tools">Pulse Tools</a><a href="/knowledge">The Library</a><a href="/knowledge">Search</a></nav>');
  // pillar library tiles -> real hubs (by their Pollinations seed, before localization strips it)
  const tileMap = { 302: '/tech-stacks', 303: '/industry-kpis', 304: '/cars', 305: '/boats', 306: '/collectibles', 307: '/aquariums', 308: '/style' };
  for (const [seed, url] of Object.entries(tileMap)) {
    home = home.replace(new RegExp('href="#"(><div class="ph load"><img [^>]*seed=' + seed + '")'), 'href="' + url + '"$1');
  }
  // generic link repointing (everything lands on a real live page)
  home = home.replace(/href="story\.html"/g, 'href="/knowledge"')
             .replace(/href="qacards\.html"/g, 'href="/knowledge"')
             .replace(/href="hub\.html"/g, 'href="/coaching"')
             .replace(/href="tools\.html"/g, 'href="/pulse-tools"')
             .replace(/href="index\.html"/g, 'href="/"')
             .replace(/href="#"/g, 'href="/knowledge"');
  home = home.replace('<title>PULSE — The Guide to Everything Worth Knowing</title>', HEAD_HOME);
  home = commonTransforms(home);
  home = await localizeImages(home);
  fs.writeFileSync(path.join(OUT, 'index.html'), home);
  console.log('WROTE index.html');

  // ---------- PULSE TOOLS ----------
  let tools = fs.readFileSync(path.join(SB, 'tools.html'), 'utf8');
  tools = tools.replace(/<nav class="top">[\s\S]*?<\/nav>/,
    '<nav class="top"><a href="/">The Guide</a><a href="/coaching">Fractional CRO</a><a href="/pulse-tools">Pulse Tools</a><a href="/knowledge">The Library</a><a href="/knowledge">Search</a></nav>');
  tools = tools.replace(/<a class="qa">/g, '<a class="qa" href="/knowledge">');
  tools = tools.replace(/href="index\.html"/g, 'href="/"').replace(/href="#"/g, 'href="/knowledge"');
  tools = tools.replace('<title>Pulse Tools — The Collection · PULSE</title>', HEAD_TOOLS);
  tools = commonTransforms(tools);
  tools = await localizeImages(tools);
  fs.writeFileSync(path.join(OUT, 'pulse-tools.html'), tools);
  console.log('WROTE pulse-tools.html');
  console.log('DONE');
})();
