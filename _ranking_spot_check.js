// Mobile + desktop spot-check for one ranking-list URL — no full image gate.
// Usage: node _ranking_spot_check.js https://pulserevops.com/aquariums/aq1158
const UA = {
  desktop: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  mobile: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
};

async function fetchHtml(url, ua) {
  const r = await fetch(url, {
    headers: { 'User-Agent': ua, Accept: 'text/html', 'Cache-Control': 'no-cache' },
    redirect: 'follow',
    signal: AbortSignal.timeout(30000),
  });
  return { ok: r.ok, status: r.status, html: await r.text() };
}

function analyze(html, label) {
  const hasEntryCover = /class="entry-cover"/i.test(html);
  const titleMatch = html.match(/<h1[^>]*class="q"[^>]*>([^<]+)/i);
  const title = titleMatch ? titleMatch[1].trim() : '(unknown)';
  const imgSrcs = [];
  const re = /<img[^>]+src="([^"]+)"/gi;
  let m;
  while ((m = re.exec(html)) && imgSrcs.length < 30) imgSrcs.push(m[1]);
  const productCards = (html.match(/class="product-card"/gi) || []).length;
  const directGold = /class="direct-answer-box"/i.test(html);
  const wsrvCount = imgSrcs.filter(u => /wsrv\.nl|images\.weserv\.nl/i.test(u)).length;
  return { label, title, hasEntryCover, directGold, productCards, imgCount: imgSrcs.length, wsrvCount, imgSrcs: imgSrcs.slice(0, 12) };
}

async function checkImg(url, ua) {
  try {
    const r = await fetch(url, {
      method: 'GET',
      headers: { Range: 'bytes=0-4096', 'User-Agent': ua },
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
    });
    const ct = r.headers.get('content-type') || '';
    return { url, ok: r.ok && /image\//i.test(ct), status: r.status, ct };
  } catch (e) {
    return { url, ok: false, status: 0, ct: String(e.message || e) };
  }
}

(async () => {
  const url = process.argv[2] || 'https://pulserevops.com/aquariums/aq1158';
  console.log('Spot-check:', url, '\n');

  for (const mode of ['desktop', 'mobile']) {
    const ua = UA[mode];
    const { ok, status, html } = await fetchHtml(url, ua);
    if (!ok) {
      console.log(mode.toUpperCase(), 'FAIL page', status);
      continue;
    }
    const a = analyze(html, mode);
    console.log('=== ' + mode.toUpperCase() + ' ===');
    console.log('  title:', a.title.slice(0, 80));
    console.log('  entry-cover (top hero):', a.hasEntryCover ? 'YES — problem' : 'no ✓');
    console.log('  direct-answer gold box:', a.directGold ? 'yes' : 'no (needs renderer deploy)');
    console.log('  product cards:', a.productCards);
    console.log('  img tags:', a.imgCount, '(wsrv:', a.wsrvCount + ')');

    const sample = a.imgSrcs.filter(u => /^https?:\/\//i.test(u)).slice(0, 5);
    let broken = 0;
    for (const u of sample) {
      const c = await checkImg(u, ua);
      const mark = c.ok ? 'ok' : 'BROKEN';
      if (!c.ok) broken++;
      console.log('  img', mark + ':', u.slice(0, 90));
    }
    console.log('  sample imgs broken:', broken + '/' + sample.length);
    console.log('');
  }
})().catch(e => { console.error(e); process.exit(1); });
