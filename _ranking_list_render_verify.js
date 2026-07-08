// Live render verification — same wsrv proxy path the Q&A page uses (no Netlify deploy for blob fixes).
const sleep = ms => new Promise(r => setTimeout(r, ms));

function liveImgProxy(u) {
  u = String(u || '').trim();
  if (!/^https?:\/\//i.test(u)) return u;
  if (/(^|\/\/)(pulserevops\.com|wsrv\.nl|images\.weserv\.nl|image\.pollinations\.ai)/i.test(u)) return u;
  if (/pinimg\.com|pinterest\.com|redd\.it|redditmedia\.com|i\.imgur\.com/i.test(u)) return u;
  return 'https://wsrv.nl/?url=' + encodeURIComponent(u.replace(/^https?:\/\//i, '')) + '&w=1280&output=webp&q=82&we&n=-1';
}

async function imgLoads(u) {
  try {
    if (!u) return false;
    if (u.startsWith('/')) return false;
    const r = await fetch(u, {
      method: 'GET',
      headers: { Range: 'bytes=0-8192', 'User-Agent': 'Mozilla/5.0' },
      redirect: 'follow',
      signal: AbortSignal.timeout(20000),
    });
    if (!r.ok) return false;
    return /image\//i.test(r.headers.get('content-type') || '');
  } catch (e) {
    return false;
  }
}

async function primeProxiedImage(u) {
  if (!u || u.startsWith('/') || !/^https?:\/\//i.test(u)) return false;
  const proxied = liveImgProxy(u);
  const targets = proxied === u ? [u] : [u, proxied];
  for (const target of targets) {
    try {
      await fetch(target, {
        method: 'GET',
        headers: { Range: 'bytes=0-65535', 'User-Agent': 'Mozilla/5.0' },
        redirect: 'follow',
        signal: AbortSignal.timeout(25000),
      });
    } catch (e) {}
  }
  return true;
}

async function imgLoadsLive(u, opts) {
  opts = opts || {};
  if (!u || u.startsWith('/')) return false;
  const tries = parseInt(process.env.DDG_PROXY_TRIES || '4', 10);
  const gap = parseInt(process.env.DDG_PROXY_RETRY_MS || '1500', 10);
  for (let t = 0; t < tries; t++) {
    if (!(await imgLoads(u))) {
      if (t + 1 < tries) await sleep(gap);
      continue;
    }
    const proxied = liveImgProxy(u);
    if (proxied === u) return true;
    if (await imgLoads(proxied)) {
      await primeProxiedImage(u);
      await sleep(parseInt(process.env.WSRV_WARM_MS || '1200', 10));
      if (await imgLoads(proxied)) return true;
    }
    if (t + 1 < tries) await sleep(gap);
  }
  return false;
}

async function ddgRenderSettle() {
  await sleep(parseInt(process.env.DDG_RENDER_SETTLE_MS || '1200', 10));
}

/** Wait until one image renders on the live page path (proxy + settle). */
async function waitForImageRender(url, id, onProgress) {
  if (!url) return false;
  if (onProgress) onProgress({ label: 'priming wsrv', url, id });
  if (/^https?:\/\//i.test(url)) await primeProxiedImage(url);
  if (onProgress) onProgress({ label: 'render settle', url, id });
  await ddgRenderSettle();
  const ok = await imgLoadsLive(url, {});
  if (onProgress) onProgress({ label: ok ? 'render ok' : 'render fail', url, id });
  return ok;
}

function collectRankingImageUrls(body, heroUrl) {
  const urls = [];
  const seen = new Set();
  const add = (u) => {
    u = String(u || '').trim();
    if (!u || seen.has(u)) return;
    seen.add(u);
    urls.push(u);
  };
  add(heroUrl);
  const lead = String(body || '').match(/^!\[[^\]]*\]\(([^)]+)\)/m);
  if (lead) add(lead[1]);
  for (const m of String(body || '').matchAll(/@@PRODUCT[^\n]* img="([^"]+)"/g)) add(m[1]);
  return urls;
}

/** Verify images one at a time in order (hero first, then products 1..N). */
async function verifyImagesSequential(body, heroUrl, onProgress) {
  const urls = collectRankingImageUrls(body, heroUrl);
  for (let i = 0; i < urls.length; i++) {
    const u = urls[i];
    if (onProgress) onProgress({ step: i + 1, total: urls.length, url: u });
    if (!(await waitForImageRender(u, '', onProgress))) {
      return { ok: false, bad: u, step: i + 1 };
    }
  }
  return { ok: true, count: urls.length };
}

module.exports = {
  liveImgProxy,
  imgLoadsLive,
  waitForImageRender,
  verifyImagesSequential,
  collectRankingImageUrls,
  ddgRenderSettle,
};
