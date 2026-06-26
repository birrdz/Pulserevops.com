// Build a clean, landing-page-style PREVIEW of one live answer page.
// Pulls the already-rendered body HTML from the live entry (words unchanged)
// and re-wraps it in a minimalist white/cream/orange template.
const fs = require('fs');
const https = require('https');

const SRC = process.argv[2] || 'https://pulserevops.com/movies/mv0001';
const OUT = 'answer-preview.html';

function get(url) {
  return new Promise((res, rej) => {
    https.get(url, r => {
      if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) return res(get(r.headers.location));
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(d));
    }).on('error', rej);
  });
}
// Extract inner HTML of the first <div class="body"> ... </div> (balanced).
function extractBody(html) {
  const start = html.search(/<div class="body">/);
  if (start < 0) return null;
  let i = html.indexOf('>', start) + 1;
  const innerStart = i;
  let depth = 1;
  const re = /<\/?div\b[^>]*>/g; re.lastIndex = i;
  let m;
  while ((m = re.exec(html))) {
    if (m[0].slice(0, 2) === '</') depth--; else depth++;
    if (depth === 0) return html.slice(innerStart, m.index);
  }
  return html.slice(innerStart);
}
function extractTitle(html) {
  const m = html.match(/<title>([^<]*)<\/title>/i);
  return m ? m[1].replace(/\s*[—|]\s*PULSE.*$/i, '').trim() : 'Pulse Answer';
}

(async () => {
  const html = await get(SRC);
  let body = extractBody(html);
  const title = extractTitle(html);
  if (!body) { console.error('no body found'); process.exit(1); }

  const page = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>${title} — PULSE (preview)</title>
<meta name="robots" content="noindex">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--orange:#E25C29;--od:#C44E1F;--og:rgba(226,92,41,.10);--ink:#16161D;--ink2:#55576A;--ink3:#8A8BA0;--bg:#fff;--soft:#FAF8F4;--line:rgba(20,20,30,.10);--font:'Plus Jakarta Sans',system-ui,sans-serif}
html{scroll-behavior:smooth}
body{font-family:var(--font);color:var(--ink);background:var(--bg);line-height:1.7;-webkit-font-smoothing:antialiased}
.pbar{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 22px;background:rgba(255,255,255,.86);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
.pbar img{height:26px;width:auto;display:block}
.pbar a.back{font-size:12.5px;font-weight:800;letter-spacing:.02em;color:var(--ink2);text-decoration:none;padding:8px 14px;border:1px solid var(--line);border-radius:99px;transition:.15s}
.pbar a.back:hover{color:var(--orange);border-color:var(--orange)}
.preview-flag{position:fixed;bottom:14px;right:14px;z-index:50;background:#16161D;color:#fff;font-size:11px;font-weight:800;letter-spacing:.04em;padding:8px 14px;border-radius:99px;opacity:.85}
.wrap{max-width:760px;margin:0 auto;padding:38px 22px 90px}
/* typography — airy, minimalist, landing-page calm */
.body h1{font-size:clamp(30px,5.2vw,46px);font-weight:900;letter-spacing:-1.4px;line-height:1.08;margin:6px 0 10px}
.body h2{font-size:clamp(21px,3vw,27px);font-weight:800;letter-spacing:-.4px;line-height:1.2;margin:46px 0 14px;padding-top:22px;border-top:1px solid var(--line)}
.body h3{font-size:18px;font-weight:800;margin:26px 0 8px;color:var(--ink)}
.body h2::before{content:"";display:block;width:38px;height:4px;border-radius:99px;background:var(--orange);margin-bottom:14px}
.body p{margin:0 0 16px;font-size:16.5px;color:#23232e}
.body a{color:var(--od);text-decoration:underline;text-underline-offset:2px;text-decoration-thickness:1px}
.body strong{font-weight:800;color:var(--ink)}
.body ul,.body ol{margin:0 0 18px;padding-left:22px}
.body li{margin:0 0 9px;font-size:16px}
.body li::marker{color:var(--orange)}
.body blockquote{margin:18px 0;padding:14px 20px;background:var(--soft);border-left:4px solid var(--orange);border-radius:0 12px 12px 0;color:var(--ink2);font-size:16px}
.body hr{border:none;border-top:1px solid var(--line);margin:30px 0}
.body table{width:100%;border-collapse:collapse;margin:18px 0;font-size:14.5px}
.body th,.body td{border:1px solid var(--line);padding:10px 12px;text-align:left}
.body th{background:var(--soft);font-weight:800}
.body code{background:var(--soft);border:1px solid var(--line);border-radius:6px;padding:1px 6px;font-size:14px}
.body .mermaid-wrap{margin:22px 0;padding:20px;background:var(--soft);border:1px solid var(--line);border-radius:16px;overflow-x:auto;text-align:center}
.body .mermaid-wrap svg{max-width:100%!important;height:auto!important}
/* the 🏆 / 💎 highlight lines pop without shouting */
.body p:has(strong)::first-line{}
</style>
</head>
<body>
<header class="pbar">
  <a href="/" aria-label="PULSE home"><img src="/pulse-logo.png" alt="PULSE"></a>
  <a class="back" href="/movies">← Back to library</a>
</header>
<main class="wrap">
  <article class="body">${body}</article>
</main>
<div class="preview-flag">🎨 NEW LOOK — PREVIEW</div>
<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
<script>
  try{ if(window.mermaid){ window.mermaid.initialize({startOnLoad:true,theme:'neutral',themeVariables:{fontFamily:'Plus Jakarta Sans, sans-serif',primaryColor:'#FAF8F4',primaryBorderColor:'#E25C29',lineColor:'#8A8BA0'}}); } }catch(e){}
</script>
</body>
</html>`;
  fs.writeFileSync(OUT, page);
  console.log('wrote', OUT, '(', page.length, 'bytes ) from', SRC, '— title:', title);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
