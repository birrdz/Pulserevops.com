// Real-photo search: Serper (cheap) + DuckDuckGo (free, slow). Cost-first — no paid generation.
const { UA, queryVariants, prefixOf } = require('./img-cover-lib');
const { geminiImageSearchQuery } = require('./gemini-image-lib');

function serperKey() {
  return (process.env.SERPER_API_KEY || '').trim();
}

const DDG_DELAY_MS = Math.max(500, parseInt(process.env.DDG_DELAY_MS || process.env.DDG_THROTTLE_COOLDOWN_MS || '15000', 10) || 15000);
let lastDdgAt = 0;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function ddgThrottle(opts) {
  if (opts && opts.skipThrottle) return;
  const jitter = Math.floor(Math.random() * 1500);
  const wait = DDG_DELAY_MS + jitter;
  const elapsed = Date.now() - lastDdgAt;
  if (elapsed < wait) await sleep(wait - elapsed);
  lastDdgAt = Date.now();
}

async function headOk(url) {
  try {
    const r = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(10000) });
    const ct = (r.headers.get('content-type') || '').toLowerCase();
    if (r.ok && ct.startsWith('image/')) return true;
    const g = await fetch(url, {
      method: 'GET',
      headers: { Range: 'bytes=0-1024', 'User-Agent': UA },
      redirect: 'follow',
      signal: AbortSignal.timeout(10000),
    });
    return g.ok && (g.headers.get('content-type') || '').toLowerCase().startsWith('image/');
  } catch (e) {
    return false;
  }
}

async function ddgImages(q, attempt = 0, throttleOpts) {
  if (attempt === 0) await ddgThrottle(throttleOpts);
  try {
    const tp = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(q)}&iax=images&ia=images`, {
      headers: { 'User-Agent': UA },
      signal: AbortSignal.timeout(15000),
    });
    const html = await tp.text();
    const m = html.match(/vqd=([\d-]+)/) || html.match(/vqd="([^"]+)"/);
    if (!m) {
      if (attempt < 2) {
        await sleep(1500 + attempt * 1500);
        return ddgImages(q, attempt + 1);
      }
      return [];
    }
    await sleep(120);
    const r = await fetch(
      `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(q)}&vqd=${m[1]}&f=,,,&p=1`,
      {
        headers: { 'User-Agent': UA, Referer: 'https://duckduckgo.com/', Accept: 'application/json' },
        signal: AbortSignal.timeout(15000),
      }
    );
    if (r.status === 429 || r.status === 403) {
      if (attempt < 3) {
        await sleep(2500 + attempt * 2500);
        return ddgImages(q, attempt + 1);
      }
      return [];
    }
    let j;
    try {
      j = JSON.parse(await r.text());
    } catch (e) {
      if (attempt < 2) {
        await sleep(2000);
        return ddgImages(q, attempt + 1);
      }
      return [];
    }
    return (j.results || []).map((x) => ({ image: x.image, url: x.url }));
  } catch (e) {
    if (attempt < 2) {
      await sleep(1500);
      return ddgImages(q, attempt + 1);
    }
    return [];
  }
}

async function serperImageQuery(q) {
  const key = serperKey();
  if (!key) return null;
  try {
    const r = await fetch('https://google.serper.dev/images', {
      method: 'POST',
      headers: { 'X-API-KEY': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: String(q).slice(0, 200) }),
      signal: AbortSignal.timeout(25000),
    });
    if (!r.ok) return null;
    const d = await r.json();
    const arr = (d && d.images) || [];
    for (const c of arr.slice(0, 8)) {
      const img = c.imageUrl || c.image;
      if (img && (await headOk(img))) {
        return { img, site: c.link || c.source || '', via: 'serper:' + q };
      }
    }
    return null;
  } catch (e) {
    return null;
  }
}

async function ddgPickFirst(q, limit = 6, emptyAttempt = 0, throttleOpts) {
  const arr = await ddgImages(q, 0, throttleOpts);
  for (const c of arr.slice(0, limit)) {
    if (c.image && (await headOk(c.image))) {
      return { img: c.image, site: c.url || '', via: 'ddg:' + q };
    }
  }
  if (!arr.length && emptyAttempt < 3) {
    await sleep(DDG_DELAY_MS * 2 ** emptyAttempt);
    return ddgPickFirst(q, limit, emptyAttempt + 1, throttleOpts);
  }
  return null;
}

/** Serper first (cheap), DDG fallback (free). Optional Gemini text refine for query only. */
async function searchRealPhoto(subject, id, opts = {}) {
  const pre = prefixOf(id) || (String(id || '').match(/^([a-z]+)/i) || [])[1] || '';
  const suffix = opts.suffix ? ' ' + opts.suffix : '';
  const queries = [];
  let refined = null;
  if (!opts.skipRefine) {
    refined = await geminiImageSearchQuery(subject, pre);
    if (refined && refined !== subject) queries.push(refined + suffix);
  }
  for (const v of queryVariants(subject, pre)) {
    queries.push(v + suffix);
  }
  if (subject && !queries.includes(subject + suffix)) queries.push(subject + suffix);

  const seen = new Set();
  for (const q of queries) {
    if (!q || seen.has(q)) continue;
    seen.add(q);

    const serper = await serperImageQuery(q);
    if (serper) return serper;

    await ddgThrottle(opts);
    const ddg = await ddgPickFirst(q, refined && q.includes(refined) ? 8 : 5, 0, opts);
    if (ddg) return ddg;
  }
  return null;
}

module.exports = {
  serperKey,
  DDG_DELAY_MS,
  ddgThrottle,
  headOk,
  ddgImages,
  ddgPickFirst,
  serperImageQuery,
  searchRealPhoto,
};
