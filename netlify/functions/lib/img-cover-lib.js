// Shared cover-image helpers: weak-cover detection + DDG query variants.
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';

const TOPIC = {
  q: 'revenue operations business strategy',
  gp: 'go to market strategy',
  ra: 'revenue operations GTM sales team',
  ik: 'business KPI dashboard',
  st: 'sales team training meeting',
  tk: 'business software technology stack',
  bs: 'business strategy book cover',
  cg: 'sales coaching manager training',
  gb: 'business infographic',
  sp: 'public speaking podium',
  sk: 'team workshop skills',
  sy: 'professional business fashion',
  fr: 'franchise storefront business',
  tl: 'business calculator tools',
  er: 'consumer electronics gadget product review',
  ca: 'car automobile vehicle',
  aq: 'aquarium fish tank',
  hf: 'high school football recruiting',
  tn: 'town city skyline',
  sc: 'school campus education',
  bt: 'boat yacht marine',
  mv: 'movie cinema film',
  wl: 'wellness spa health',
  dr: 'sports drill training',
  tv: 'travel destination',
  rs: 'resort hotel luxury',
  es: 'luxury estate home',
  cl: 'nightclub lounge',
  lv: 'home living interior',
  ev: 'event conference',
  ga: 'gathering community',
  gm: 'gaming esports',
  dn: 'restaurant dining food',
  nl: 'nightlife bar city',
  co: 'collectible memorabilia',
  ai: 'AI data center infrastructure',
  bo: 'construction buildout',
};

const STOP = /^(how|what|whats|what's|why|when|where|who|which|should|is|are|do|does|did|can|could|the|a|an|to|of|in|for|on|with|your|you|my|i|it|and|or)$/i;

function prefixOf(id) {
  return (String(id).match(/^([a-z]+)\d+$/i) || [])[1] || '';
}

function leadingImageMatch(answer) {
  return String(answer || '').match(/^﻿?\s*!\[([^\]]*)\]\(([^)]+)\)/);
}

function isWeakCoverUrl(url) {
  const u = String(url || '').toLowerCase();
  if (!u) return true;
  if (u.includes('placeholder.svg')) return true;
  if (u.includes('pulserevops.com/img/auto/') && u.endsWith('.svg')) return true;
  if (u.includes('/img/auto/') && u.endsWith('.svg')) return true;
  return false;
}

function needsCoverImage(answer) {
  const m = leadingImageMatch(answer);
  if (!m) return true;
  return isWeakCoverUrl(m[2]);
}

function stripLeadingImage(answer) {
  return String(answer || '').replace(/^﻿?\s*!\[[^\]]*\]\([^)]+\)\s*\n*/m, '');
}

function queryVariants(q, pre) {
  let t = String(q || '').replace(/[?.!]+$/g, '').replace(/\bin\s+20\d\d\b/gi, '').replace(/\b20\d\d\b/g, '').trim();
  const full = t.slice(0, 120);
  const words = t.split(/\s+/).filter((w) => w.length > 1);
  const sig = words.filter((w) => !STOP.test(w.replace(/[^A-Za-z']/g, '')));
  const core = sig.slice(0, 8).join(' ');
  const out = [];
  if (core && core.length > 3) out.push(core);
  if (full && full !== core) out.push(full);
  if (TOPIC[pre]) out.push(`${core} ${TOPIC[pre]}`.trim());
  if (TOPIC[pre]) out.push(TOPIC[pre]);
  return [...new Set(out.filter(Boolean))];
}

async function headOk(url) {
  try {
    const r = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(9000) });
    const ct = (r.headers.get('content-type') || '').toLowerCase();
    if (r.ok && ct.startsWith('image/')) return true;
    const g = await fetch(url, {
      method: 'GET',
      headers: { Range: 'bytes=0-1024', 'User-Agent': UA },
      redirect: 'follow',
      signal: AbortSignal.timeout(9000),
    });
    return g.ok && (g.headers.get('content-type') || '').toLowerCase().startsWith('image/');
  } catch (e) {
    return false;
  }
}

async function ddgImages(q, attempt = 0) {
  try {
    const tp = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(q)}&iax=images&ia=images`, {
      headers: { 'User-Agent': UA },
      signal: AbortSignal.timeout(15000),
    });
    const html = await tp.text();
    const m = html.match(/vqd=([\d-]+)/) || html.match(/vqd="([^"]+)"/);
    if (!m) {
      if (attempt < 3) {
        await new Promise((r) => setTimeout(r, 1500 + attempt * 1500));
        return ddgImages(q, attempt + 1);
      }
      return [];
    }
    await new Promise((r) => setTimeout(r, 120));
    const r = await fetch(
      `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(q)}&vqd=${m[1]}&f=,,,&p=1`,
      {
        headers: { 'User-Agent': UA, Referer: 'https://duckduckgo.com/', Accept: 'application/json' },
        signal: AbortSignal.timeout(15000),
      }
    );
    if (r.status === 429 || r.status === 403) {
      if (attempt < 4) {
        await new Promise((r) => setTimeout(r, 3000 + attempt * 3000));
        return ddgImages(q, attempt + 1);
      }
      return [];
    }
    let j;
    try {
      j = JSON.parse(await r.text());
    } catch (e) {
      if (attempt < 3) {
        await new Promise((r) => setTimeout(r, 2000));
        return ddgImages(q, attempt + 1);
      }
      return [];
    }
    return (j.results || []).map((x) => x.image).filter(Boolean);
  } catch (e) {
    if (attempt < 3) {
      await new Promise((r) => setTimeout(r, 1500));
      return ddgImages(q, attempt + 1);
    }
    return [];
  }
}

async function pickCoverImage(question, id) {
  const pre = prefixOf(id);
  for (const v of queryVariants(question, pre)) {
    const arr = await ddgImages(v);
    for (const img of arr.slice(0, 12)) {
      if (img && (await headOk(img))) return { img, via: v };
    }
  }
  return null;
}

module.exports = {
  UA,
  prefixOf,
  leadingImageMatch,
  isWeakCoverUrl,
  needsCoverImage,
  stripLeadingImage,
  queryVariants,
  pickCoverImage,
};
