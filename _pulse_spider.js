// _pulse_spider.js — "PULSE SPIDER" v2: a Screaming-Frog-style SEO crawler/auditor for
// pulserevops.com, tuned to BEAT Screaming Frog on this specific (JS-rendered, blob-backed) site.
//
// PARITY WITH SCREAMING FROG (HTTP layer, all accurate without rendering):
//   status codes, redirect chains, content-type, response time, size, crawl depth,
//   <title> (+len/dupe/missing), meta description (+len/dupe/missing), H1 (count/dupe),
//   H2 count, canonical (+missing/canonicalised), meta robots + X-Robots-Tag header,
//   hreflang, JSON-LD schema types (+datePublished/dateModified), Open Graph/Twitter tags,
//   images (count + missing alt), internal/external links, indexability + reason,
//   inlinks (link equity), orphan pages (sitemap vs crawl), insecure (http) links,
//   exact-duplicate content hashing, optional external-link HEAD checks.
//
// BETTER THAN SCREAMING FROG, HERE: this site renders answer content client-side, so a raw
// crawl (and even an SF render) under-counts content. For library URLs (/<seg>/<id>) the
// spider reads the CANONICAL SOURCE — the answer blob + index entry — for true word count,
// image count, H1/H2, FAQ, mermaid, and CRO-card presence. It also groups every issue BY
// PILLAR and does a sitemap-vs-crawl coverage reconciliation.
//
// Dependency-free except @netlify/blobs (already a project dep, used only for enrichment).
// Read-only. Polite (capped URLs + concurrency + delay). Reports -> _seo_audit/.
//
//   node _pulse_spider.js
//   MAX_URLS=2000 CONCURRENCY=8 node _pulse_spider.js
//   SEED=https://pulserevops.com/telco FROM_SITEMAP=0 node _pulse_spider.js
//   BLOB_ENRICH=0 node _pulse_spider.js            (skip blob content lookups)
//   CHECK_EXTERNAL=1 node _pulse_spider.js          (HEAD-check external links)

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ---------------- CONFIG ----------------
const CFG = {
  seed: process.env.SEED || 'https://pulserevops.com/',
  maxUrls: parseInt(process.env.MAX_URLS || '300', 10),
  concurrency: parseInt(process.env.CONCURRENCY || '6', 10),
  delayMs: parseInt(process.env.DELAY_MS || '150', 10),
  maxDepth: parseInt(process.env.MAX_DEPTH || '25', 10),
  fromSitemap: process.env.FROM_SITEMAP !== '0',
  sitemapCap: parseInt(process.env.SITEMAP_CAP || '600', 10),
  checkExternal: process.env.CHECK_EXTERNAL === '1',
  blobEnrich: process.env.BLOB_ENRICH !== '0',
  timeoutMs: parseInt(process.env.TIMEOUT_MS || '20000', 10),
  titleMin: 30, titleMax: 65, metaMin: 70, metaMax: 165,
  thinWords: parseInt(process.env.THIN_WORDS || '300', 10),
  outDir: process.env.OUTDIR || 'C:/Users/koryj/website/_seo_audit',
  ua: 'PulseSpider/2.0 (+SEO audit; like Screaming Frog)'
};
CFG.host = new URL(CFG.seed).host;

// ---------------- utils ----------------
const sleep = ms => new Promise(r => setTimeout(r, ms));
const decode = s => (s || '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, ' ');
const collapse = s => decode(s).replace(/\s+/g, ' ').trim();
const sha1 = s => crypto.createHash('sha1').update(s || '').digest('hex').slice(0, 12);
function attr(tag, name) { const m = tag.match(new RegExp(name + '\\s*=\\s*"([^"]*)"', 'i')) || tag.match(new RegExp(name + "\\s*=\\s*'([^']*)'", 'i')); return m ? m[1] : null; }
function normUrl(href, base) {
  try {
    const u = new URL(href, base); if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    u.hash = ''; ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid'].forEach(p => u.searchParams.delete(p));
    let s = u.toString(); if (s.endsWith('/') && u.pathname !== '/') s = s.slice(0, -1); return s;
  } catch (e) { return null; }
}
const isInternal = u => { try { return new URL(u).host === CFG.host; } catch (e) { return false; } };
const idFromUrl = u => { try { const seg = new URL(u).pathname.split('/').filter(Boolean).pop() || ''; return /^(?:[a-z]{1,3}\d+|vq_[a-z0-9]+)$/i.test(seg) ? seg : null; } catch (e) { return null; } };
const pillarOf = u => { try { const segs = new URL(u).pathname.split('/').filter(Boolean); return segs[0] || '(root)'; } catch (e) { return '(root)'; } };

// ---------------- robots.txt ----------------
let DISALLOW = [];
async function loadRobots() {
  try { const r = await fetch(`https://${CFG.host}/robots.txt`, { headers: { 'User-Agent': CFG.ua } }); if (!r.ok) return; const txt = await r.text(); let on = false;
    for (const line of txt.split(/\r?\n/)) { const l = line.replace(/#.*$/, '').trim(); if (!l) continue; const m = l.match(/^([A-Za-z-]+)\s*:\s*(.*)$/); if (!m) continue; const k = m[1].toLowerCase(), v = m[2].trim(); if (k === 'user-agent') on = (v === '*'); else if (k === 'disallow' && on && v) DISALLOW.push(v); }
  } catch (e) {}
}
const robotsBlocked = u => { try { const p = new URL(u).pathname; return DISALLOW.some(d => d.endsWith('$') ? p.endsWith(d.slice(0, -1)) : p.startsWith(d)); } catch (e) { return false; } };

// ---------------- sitemap ingestion (for seeds + coverage reconciliation) ----------------
async function fetchText(u) { try { const r = await fetch(u, { headers: { 'User-Agent': CFG.ua }, signal: AbortSignal.timeout(CFG.timeoutMs) }); if (!r.ok) return null; return await r.text(); } catch (e) { return null; } }
async function ingestSitemaps() {
  const found = new Set();
  const idxXml = await fetchText(`https://${CFG.host}/sitemap-index.xml`);
  const maps = []; if (idxXml) (idxXml.match(/<loc>([^<]+)<\/loc>/g) || []).forEach(m => maps.push(m.replace(/<\/?loc>/g, '')));
  maps.push(`https://${CFG.host}/sitemap.xml`);
  for (const sm of maps) { if (found.size >= CFG.sitemapCap) break; const xml = await fetchText(sm); if (!xml) continue;
    for (const m of (xml.match(/<loc>([^<]+)<\/loc>/g) || [])) { const u = normUrl(m.replace(/<\/?loc>/g, '')); if (u && isInternal(u) && !/\.xml($|\?)/i.test(u)) { found.add(u); if (found.size >= CFG.sitemapCap) break; } } }
  return [...found];
}

// ---------------- blob enrichment (canonical content source) ----------------
let STORE = null, INDEX_BY_ID = null, SITE_TOTAL = 0;
async function initBlobs() {
  try {
    for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
    const { getStore } = require('@netlify/blobs');
    STORE = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
    const idx = await STORE.get('_index.json', { type: 'json', consistency: 'strong' });
    INDEX_BY_ID = new Map(); for (const e of (idx.entries || [])) if (e && e.id) INDEX_BY_ID.set(e.id, e);
    SITE_TOTAL = INDEX_BY_ID.size; // true catalog size, for the site-coverage progress bar
    console.log(`[spider] blob enrichment ON — index has ${INDEX_BY_ID.size} entries`);
  } catch (e) { console.log('[spider] blob enrichment unavailable: ' + e.message); STORE = null; }
}
const blobCache = new Map();
async function enrichFromBlob(id) {
  if (!STORE) return null;
  if (blobCache.has(id)) return blobCache.get(id);
  let out = null;
  try {
    const b = await STORE.get('answers/' + id + '.json', { type: 'json' });
    if (b && b.answer) {
      const body = b.answer;
      const prose = body.replace(/```[\s\S]*?```/g, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').replace(/<[^>]+>/g, ' ').replace(/[#>*_`|-]/g, ' ');
      out = {
        b_wordCount: collapse(prose).split(/\s+/).filter(Boolean).length,
        b_imgCount: (body.match(/!\[[^\]]*\]\([^)]+\)/g) || []).length + (body.match(/@@PRODUCT[^\n]* img=/g) || []).length,
        b_h1: (body.match(/^#\s+/gm) || []).length, b_h2: (body.match(/^##\s+/gm) || []).length,
        b_hasFAQ: /(^|\n)##?\s*(FAQ|Frequently Asked)/i.test(body),
        b_mermaids: (body.match(/```mermaid/g) || []).length,
        b_hasCRO: /crosyndicate\.com|calendly\.com\/korywhiterevops|cro-syndicate-card/i.test(body),
        b_qs: (INDEX_BY_ID.get(id) || {}).quality_score
      };
    }
  } catch (e) {}
  blobCache.set(id, out); return out;
}

// ---------------- fetch with manual redirect chain ----------------
async function fetchPage(url) {
  const chain = []; let cur = url, status = 0, finalUrl = url, hops = 0; const t0 = Date.now();
  while (hops < 6) {
    let r; try { r = await fetch(cur, { headers: { 'User-Agent': CFG.ua }, redirect: 'manual', signal: AbortSignal.timeout(CFG.timeoutMs) }); }
    catch (e) { return { status: 0, error: e.name === 'TimeoutError' ? 'timeout' : e.message, finalUrl: cur, chain, ms: Date.now() - t0 }; }
    status = r.status; finalUrl = cur;
    if (status >= 300 && status < 400 && r.headers.get('location')) { const loc = normUrl(r.headers.get('location'), cur); chain.push({ from: cur, status, to: loc }); if (!loc || loc === cur) break; cur = loc; hops++; continue; }
    const ct = (r.headers.get('content-type') || '').toLowerCase();
    const xRobots = (r.headers.get('x-robots-tag') || '').toLowerCase();
    let body = null; if (status === 200 && ct.includes('text/html')) body = await r.text();
    return { status, finalUrl, chain, ms: Date.now() - t0, contentType: ct, xRobots, size: +(r.headers.get('content-length') || (body ? Buffer.byteLength(body) : 0)), body };
  }
  return { status, finalUrl, chain, ms: Date.now() - t0, redirectLoop: true };
}

// ---------------- HTML parse ----------------
function parsePage(url, html) {
  const titleTags = html.match(/<title[^>]*>([\s\S]*?)<\/title>/gi) || [];
  const title = titleTags.length ? collapse(titleTags[0].replace(/<\/?title[^>]*>/gi, '')) : '';
  let metaDesc = '', metaRobots = '', ogTitle = '', ogDesc = '', twTitle = ''; let metaDescCount = 0;
  for (const tag of (html.match(/<meta\b[^>]*>/gi) || [])) {
    const name = (attr(tag, 'name') || '').toLowerCase(); const prop = (attr(tag, 'property') || '').toLowerCase();
    if (name === 'description') { metaDesc = collapse(attr(tag, 'content') || ''); metaDescCount++; }
    if (name === 'robots') metaRobots = (attr(tag, 'content') || '').toLowerCase();
    if (prop === 'og:title') ogTitle = collapse(attr(tag, 'content') || '');
    if (prop === 'og:description') ogDesc = collapse(attr(tag, 'content') || '');
    if (name === 'twitter:title') twTitle = collapse(attr(tag, 'content') || '');
  }
  let canonical = '', hreflangCount = 0;
  for (const tag of (html.match(/<link\b[^>]*>/gi) || [])) { const rel = (attr(tag, 'rel') || '').toLowerCase(); if (rel === 'canonical') canonical = normUrl(attr(tag, 'href') || '', url) || ''; if (rel === 'alternate' && /hreflang/i.test(tag)) hreflangCount++; }
  const h1s = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || []).map(h => collapse(h.replace(/<[^>]+>/g, '')));
  const h2Count = (html.match(/<h2[\s>]/gi) || []).length;
  // JSON-LD schema
  let schemaTypes = [], datePublished = '', dateModified = '';
  for (const blk of (html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [])) {
    const json = blk.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
    (json.match(/"@type"\s*:\s*"([^"]+)"/g) || []).forEach(t => schemaTypes.push(t.split('"')[3]));
    const dp = json.match(/"datePublished"\s*:\s*"([^"]+)"/); if (dp && !datePublished) datePublished = dp[1];
    const dm = json.match(/"dateModified"\s*:\s*"([^"]+)"/); if (dm && !dateModified) dateModified = dm[1];
  }
  const text = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ');
  const wordCount = collapse(text).split(/\s+/).filter(Boolean).length;
  const imgs = html.match(/<img\b[^>]*>/gi) || []; let imgMissingAlt = 0; for (const im of imgs) { const a = attr(im, 'alt'); if (a === null || a.trim() === '') imgMissingAlt++; }
  let internal = 0, external = 0, insecure = 0; const outlinks = [];
  for (const tag of (html.match(/<a\b[^>]*href\s*=\s*["'][^"']*["'][^>]*>/gi) || [])) {
    const href = attr(tag, 'href'); if (!href || /^(mailto:|tel:|javascript:|#)/i.test(href)) continue;
    const abs = normUrl(href, url); if (!abs) continue; if (abs.startsWith('http://')) insecure++;
    if (isInternal(abs)) { internal++; outlinks.push(abs); } else { external++; outlinks.push(abs); }
  }
  return { title, titleCount: titleTags.length, metaDesc, metaDescCount, metaRobots, ogTitle, ogDesc, twTitle, canonical, hreflangCount,
    h1: h1s[0] || '', h1Count: h1s.length, h2Count, schemaTypes: [...new Set(schemaTypes)].join('|'), datePublished, dateModified,
    wordCount, imgCount: imgs.length, imgMissingAlt, internalLinks: internal, externalLinks: external, insecureLinks: insecure,
    contentHash: sha1(collapse(text)), outlinks };
}

function indexability(r) {
  if (r.status === 0) return ['Non-Indexable', r.error || 'no response'];
  if (r.status >= 400) return ['Non-Indexable', 'Error ' + r.status];
  if (r.status >= 300) return ['Non-Indexable', 'Redirect ' + r.status];
  if (r.robotsBlocked) return ['Non-Indexable', 'robots.txt'];
  if (/noindex/.test(r.metaRobots || '') || /noindex/.test(r.xRobots || '')) return ['Non-Indexable', 'noindex'];
  if (r.canonical && r.canonical !== r.url) return ['Non-Indexable', 'Canonicalised'];
  return ['Indexable', ''];
}

// ---------------- live progress (for the dashboards' progress bar) ----------------
function writeProgress(obj) {
  try { if (!fs.existsSync(CFG.outDir)) fs.mkdirSync(CFG.outDir, { recursive: true }); fs.writeFileSync(path.join(CFG.outDir, 'progress.json'), JSON.stringify(obj)); } catch (e) {}
  if (STORE) { try { STORE.setJSON('seo-monitor/progress.json', obj).catch(() => {}); } catch (e) {} }
}

// ---------------- crawl ----------------
const records = new Map(), inlinks = new Map(), queued = new Set();
const addInlink = (t, s) => { if (!inlinks.has(t)) inlinks.set(t, new Set()); const x = inlinks.get(t); if (x.size < 50) x.add(s); };

async function crawl() {
  await loadRobots();
  if (CFG.blobEnrich) await initBlobs();
  const queue = []; const enq = (u, d) => { const n = normUrl(u); if (n && isInternal(n) && !queued.has(n)) { queued.add(n); queue.push({ url: n, depth: d }); } };
  enq(CFG.seed, 0);
  let sitemapSeeds = [];
  if (CFG.fromSitemap) {
    sitemapSeeds = await ingestSitemaps();
    // ROTATION (owner: "assess new 400 every time" + spider self-covers the whole site):
    // advance a persisted offset by maxUrls each run, so successive runs crawl a fresh
    // window and the entire catalog is covered over ~ceil(total/maxUrls) runs.
    const OFFP = 'C:/Users/koryj/website/_spider_offset.json';
    let off = 0; try { off = (JSON.parse(fs.readFileSync(OFFP, 'utf8')).offset) || 0; } catch (e) {}
    if (sitemapSeeds.length) { off = off % sitemapSeeds.length; sitemapSeeds = sitemapSeeds.slice(off).concat(sitemapSeeds.slice(0, off)); }
    try { fs.writeFileSync(OFFP, JSON.stringify({ offset: off + CFG.maxUrls, total: sitemapSeeds.length, at: new Date().toISOString() })); } catch (e) {}
    sitemapSeeds.forEach(u => enq(u, 1));
    console.log(`[spider] sitemap seeds: ${sitemapSeeds.length} (rotated window @ offset ${off}/${sitemapSeeds.length})`);
  }
  console.log(`[spider] start=${CFG.seed} host=${CFG.host} maxUrls=${CFG.maxUrls} conc=${CFG.concurrency} blobEnrich=${CFG.blobEnrich}`);

  let processed = 0, head = 0, active = 0;
  const crawlStart = new Date().toISOString(); let lastProg = 0;
  writeProgress({ running: true, crawled: 0, target: CFG.maxUrls, siteTotal: SITE_TOTAL || CFG.maxUrls, broken: 0, startedAt: crawlStart });
  async function worker() {
    while (true) {
      if (records.size >= CFG.maxUrls) return;
      if (head >= queue.length) { if (active === 0) return; await sleep(40); continue; }
      const item = queue[head++]; if (!item || records.has(item.url) || item.depth > CFG.maxDepth) continue;
      active++;
      try {
        const blocked = robotsBlocked(item.url);
        const res = await fetchPage(item.url);
        const rec = { url: item.url, pillar: pillarOf(item.url), depth: item.depth, status: res.status, error: res.error || '', contentType: res.contentType || '', xRobots: res.xRobots || '', ms: res.ms, size: res.size || 0, redirectTo: res.chain.length ? res.chain[res.chain.length - 1].to : '', redirectHops: res.chain.length, robotsBlocked: blocked };
        if (res.body) {
          Object.assign(rec, parsePage(item.url, res.body));
          for (const l of rec.outlinks) { if (isInternal(l)) { addInlink(l, item.url); if (records.size + (queue.length - head) < CFG.maxUrls * 4) enq(l, item.depth + 1); } else addInlink(l, item.url); }
          delete rec.outlinks;
          // blob enrichment for library pages — TRUE content metrics (beats render)
          const id = idFromUrl(item.url);
          if (id && CFG.blobEnrich) { const e = await enrichFromBlob(id); if (e) { rec.id = id; Object.assign(rec, e); } }
        }
        const [idx, reason] = indexability(rec); rec.indexability = idx; rec.indexReason = reason;
        records.set(item.url, rec); processed++;
        if (processed % 50 === 0) console.log(`[spider] ${processed} crawled (queue ${queue.length - head})`);
        if (processed - lastProg >= 15) { lastProg = processed; writeProgress({ phase: 'crawl', running: true, crawled: processed, target: CFG.maxUrls, siteTotal: SITE_TOTAL || CFG.maxUrls, broken: [...records.values()].filter(r => r.status >= 400 || r.status === 0).length, startedAt: crawlStart }); }
      } catch (e) { records.set(item.url, { url: item.url, pillar: pillarOf(item.url), depth: item.depth, status: 0, error: e.message, indexability: 'Non-Indexable', indexReason: e.message }); }
      finally { active--; }
      if (CFG.delayMs) await sleep(CFG.delayMs);
    }
  }
  await Promise.all(Array.from({ length: CFG.concurrency }, worker));

  let externalResults = [];
  if (CFG.checkExternal) {
    const ext = new Set(); for (const [t] of inlinks) if (!isInternal(t)) ext.add(t);
    const list = [...ext].slice(0, 500); console.log(`[spider] HEAD-checking ${list.length} external links...`); let i = 0;
    const ew = async () => { while (i < list.length) { const u = list[i++]; let st = 0; try { const r = await fetch(u, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(12000) }); st = r.status; } catch (e) { st = 0; } externalResults.push({ url: u, status: st, sources: [...(inlinks.get(u) || [])].slice(0, 3).join(' | ') }); if (CFG.delayMs) await sleep(CFG.delayMs); } };
    await Promise.all(Array.from({ length: Math.min(6, CFG.concurrency) }, ew));
  }
  writeProgress({ phase: 'done', running: false, crawled: records.size, target: CFG.maxUrls, siteTotal: SITE_TOTAL || CFG.maxUrls, broken: [...records.values()].filter(r => r.status >= 400 || r.status === 0).length, startedAt: crawlStart, finishedAt: new Date().toISOString() });
  return { sitemapSeeds, externalResults };
}

// ---------------- reporting ----------------
const csvEsc = v => { v = v == null ? '' : String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
const writeCsv = (file, rows, cols) => { const out = [cols.join(',')]; for (const r of rows) out.push(cols.map(c => csvEsc(r[c])).join(',')); fs.writeFileSync(path.join(CFG.outDir, file), out.join('\n')); };
// content metric helpers: prefer blob (true) value, fall back to rendered-HTML value
const W = r => (typeof r.b_wordCount === 'number' ? r.b_wordCount : r.wordCount) || 0;
const IMG = r => (typeof r.b_imgCount === 'number' ? r.b_imgCount : r.imgCount) || 0;

async function report(meta) {
  if (!fs.existsSync(CFG.outDir)) fs.mkdirSync(CFG.outDir, { recursive: true });
  const all = [...records.values()];
  const html200 = all.filter(r => r.status === 200 && (r.contentType || '').includes('text/html'));
  const indexable = html200.filter(r => r.indexability === 'Indexable');

  const dupBy = key => { const m = new Map(); for (const r of indexable) { const v = (r[key] || '').trim().toLowerCase(); if (!v) continue; (m.get(v) || m.set(v, []).get(v)).push(r.url); } return [...m.entries()].filter(([, u]) => u.length > 1); };
  const dupTitles = dupBy('title'), dupMeta = dupBy('metaDesc'), dupH1 = dupBy('h1');
  // exact-duplicate page bodies (content hash) — Screaming Frog "Exact Duplicates"
  const hashMap = new Map(); for (const r of indexable) { if (!r.contentHash) continue; (hashMap.get(r.contentHash) || hashMap.set(r.contentHash, []).get(r.contentHash)).push(r.url); }
  const dupBodies = [...hashMap.values()].filter(u => u.length > 1);

  const broken = all.filter(r => r.status >= 400 || r.status === 0).map(r => ({ url: r.url, pillar: r.pillar, status: r.status || r.error, sources: [...(inlinks.get(r.url) || [])].slice(0, 5).join(' | ') }));
  const redirects = all.filter(r => r.status >= 300 && r.status < 400).map(r => ({ url: r.url, status: r.status, redirectTo: r.redirectTo, hops: r.redirectHops, sources: [...(inlinks.get(r.url) || [])].slice(0, 3).join(' | ') }));
  const missingTitle = indexable.filter(r => !r.title), shortTitle = indexable.filter(r => r.title && r.title.length < CFG.titleMin), longTitle = indexable.filter(r => r.title && r.title.length > CFG.titleMax), multiTitle = indexable.filter(r => r.titleCount > 1);
  const missingMeta = indexable.filter(r => !r.metaDesc), longMeta = indexable.filter(r => r.metaDesc && r.metaDesc.length > CFG.metaMax), multiMeta = indexable.filter(r => r.metaDescCount > 1);
  const missingH1 = indexable.filter(r => !r.h1Count), multiH1 = indexable.filter(r => r.h1Count > 1);
  const missingCanonical = indexable.filter(r => !r.canonical);
  const titleEqH1 = indexable.filter(r => r.title && r.h1 && r.title.toLowerCase() === r.h1.toLowerCase());
  // CONTENT-QUALITY checks run ONLY on real content pages = blob-enriched library entries
  // (skips JS-rendered hubs/shells, so no thin/no-image false positives — better than SF).
  const lib = indexable.filter(r => r.id);
  const thin = lib.filter(r => W(r) < CFG.thinWords);
  const noImg = lib.filter(r => IMG(r) === 0);
  const missingCRO = [];   // CRO card is render-injected on every answer page (not in blob) — not a real gap
  const missingFAQ = lib.filter(r => r.b_hasFAQ === false);   // site law: every answer has an FAQ
  const imgNoAlt = html200.filter(r => (r.imgMissingAlt || 0) > 0 && typeof r.b_imgCount !== 'number'); // static pages only (rendered HTML reliable there)
  const noSchema = indexable.filter(r => !r.schemaTypes);
  const insecure = html200.filter(r => (r.insecureLinks || 0) > 0);
  const nonIndex = html200.filter(r => r.indexability !== 'Indexable');
  // A page is DISCOVERABLE if it's in the sitemap (search engines find it there) — so
  // sitemap pages are NOT orphans and NOT "low-inlink" problems. The rotating crawl only
  // covers a 5k window, so the old definitions wrongly flagged the entire non-crawled
  // remainder. Correct: orphan = crawled-via-link, NOT in sitemap, AND zero inlinks; and
  // low-inlinks only applies to non-sitemap pages.
  const seedSet = new Set(meta.sitemapSeeds || []);
  const lowInlinks = indexable.filter(r => r.depth > 0 && !seedSet.has(r.url) && (inlinks.get(r.url) || new Set()).size < 2);
  const mostLinked = indexable.map(r => ({ url: r.url, inlinks: (inlinks.get(r.url) || new Set()).size })).sort((a, b) => b.inlinks - a.inlinks).slice(0, 50);
  const slowest = html200.map(r => ({ url: r.url, ms: r.ms })).sort((a, b) => b.ms - a.ms).slice(0, 50);
  const orphans = all.filter(r => r.depth > 0 && r.status === 200 && !seedSet.has(r.url) && (inlinks.get(r.url) || new Set()).size === 0).map(r => r.url);
  const brokenExternal = (meta.externalResults || []).filter(r => r.status >= 400 || r.status === 0);

  // per-pillar rollup
  const pillars = {}; for (const r of all) { const p = r.pillar || '(root)'; pillars[p] = pillars[p] || { pillar: p, urls: 0, broken: 0, redirects: 0, nonIndexable: 0, missingTitle: 0, dup: 0, thin: 0, noImg: 0 }; const o = pillars[p]; o.urls++; if (r.status >= 400 || r.status === 0) o.broken++; if (r.status >= 300 && r.status < 400) o.redirects++; if (r.indexability !== 'Indexable' && (r.contentType || '').includes('html')) o.nonIndexable++; if ((r.contentType || '').includes('html') && r.status === 200) { if (!r.title) o.missingTitle++; if (r.id && W(r) < CFG.thinWords && r.indexability === 'Indexable') o.thin++; if (r.id && IMG(r) === 0 && r.indexability === 'Indexable') o.noImg++; } }

  writeCsv('internal_all.csv', all, ['url', 'pillar', 'status', 'indexability', 'indexReason', 'depth', 'title', 'metaDesc', 'h1', 'h1Count', 'h2Count', 'b_wordCount', 'wordCount', 'b_imgCount', 'imgCount', 'imgMissingAlt', 'internalLinks', 'externalLinks', 'insecureLinks', 'canonical', 'hreflangCount', 'schemaTypes', 'datePublished', 'dateModified', 'metaRobots', 'xRobots', 'b_hasFAQ', 'b_mermaids', 'b_hasCRO', 'b_qs', 'redirectTo', 'redirectHops', 'contentType', 'ms', 'size', 'contentHash']);
  writeCsv('issue_broken_4xx_5xx.csv', broken, ['url', 'pillar', 'status', 'sources']);
  writeCsv('issue_redirects_3xx.csv', redirects, ['url', 'status', 'redirectTo', 'hops', 'sources']);
  writeCsv('issue_titles.csv', [...missingTitle.map(r => ({ url: r.url, problem: 'MISSING' })), ...shortTitle.map(r => ({ url: r.url, problem: 'SHORT', len: r.title.length, value: r.title })), ...longTitle.map(r => ({ url: r.url, problem: 'LONG', len: r.title.length, value: r.title })), ...multiTitle.map(r => ({ url: r.url, problem: 'MULTIPLE' }))], ['url', 'problem', 'len', 'value']);
  writeCsv('issue_duplicate_titles.csv', dupTitles.map(([v, u]) => ({ title: v, count: u.length, examples: u.slice(0, 6).join(' | ') })), ['title', 'count', 'examples']);
  writeCsv('issue_meta.csv', [...missingMeta.map(r => ({ url: r.url, problem: 'MISSING' })), ...longMeta.map(r => ({ url: r.url, problem: 'LONG', len: r.metaDesc.length })), ...multiMeta.map(r => ({ url: r.url, problem: 'MULTIPLE' }))], ['url', 'problem', 'len']);
  writeCsv('issue_duplicate_meta.csv', dupMeta.map(([v, u]) => ({ metaDesc: v.slice(0, 140), count: u.length, examples: u.slice(0, 6).join(' | ') })), ['metaDesc', 'count', 'examples']);
  writeCsv('issue_h1.csv', [...missingH1.map(r => ({ url: r.url, problem: 'MISSING_H1' })), ...multiH1.map(r => ({ url: r.url, problem: 'MULTIPLE_H1', count: r.h1Count }))], ['url', 'problem', 'count']);
  writeCsv('issue_duplicate_h1.csv', dupH1.map(([v, u]) => ({ h1: v, count: u.length, examples: u.slice(0, 6).join(' | ') })), ['h1', 'count', 'examples']);
  writeCsv('issue_duplicate_bodies.csv', dupBodies.map(u => ({ count: u.length, urls: u.slice(0, 8).join(' | ') })), ['count', 'urls']);
  writeCsv('issue_missing_canonical.csv', missingCanonical.map(r => ({ url: r.url })), ['url']);
  writeCsv('issue_title_equals_h1.csv', titleEqH1.map(r => ({ url: r.url, title: r.title })), ['url', 'title']);
  writeCsv('issue_thin_content.csv', thin.map(r => ({ url: r.url, words: W(r), source: typeof r.b_wordCount === 'number' ? 'blob' : 'html' })), ['url', 'words', 'source']);
  writeCsv('issue_no_image.csv', noImg.map(r => ({ url: r.url, id: r.id })), ['url', 'id']);
  writeCsv('issue_missing_cro_card.csv', missingCRO.map(r => ({ url: r.url, id: r.id })), ['url', 'id']);
  writeCsv('issue_missing_faq.csv', missingFAQ.map(r => ({ url: r.url, id: r.id })), ['url', 'id']);
  writeCsv('issue_images_missing_alt.csv', imgNoAlt.map(r => ({ url: r.url, imgCount: r.imgCount, imgMissingAlt: r.imgMissingAlt })), ['url', 'imgCount', 'imgMissingAlt']);
  writeCsv('issue_missing_schema.csv', noSchema.map(r => ({ url: r.url })), ['url']);
  writeCsv('issue_insecure_links.csv', insecure.map(r => ({ url: r.url, insecureLinks: r.insecureLinks })), ['url', 'insecureLinks']);
  writeCsv('issue_non_indexable.csv', nonIndex.map(r => ({ url: r.url, reason: r.indexReason })), ['url', 'reason']);
  writeCsv('issue_low_inlinks.csv', lowInlinks.map(r => ({ url: r.url, inlinks: (inlinks.get(r.url) || new Set()).size })), ['url', 'inlinks']);
  writeCsv('issue_orphan_pages.csv', orphans.map(u => ({ url: u })), ['url']);
  writeCsv('report_most_linked.csv', mostLinked, ['url', 'inlinks']);
  writeCsv('report_slowest.csv', slowest, ['url', 'ms']);
  writeCsv('report_by_pillar.csv', Object.values(pillars).sort((a, b) => b.urls - a.urls), ['pillar', 'urls', 'broken', 'redirects', 'nonIndexable', 'missingTitle', 'thin', 'noImg']);
  if (CFG.checkExternal) writeCsv('issue_broken_external.csv', brokenExternal, ['url', 'status', 'sources']);

  const I = {
    broken_4xx_5xx: broken.length, redirects_3xx: redirects.length,
    missing_titles: missingTitle.length, duplicate_titles: dupTitles.length, short_titles: shortTitle.length, long_titles: longTitle.length, multiple_titles: multiTitle.length,
    missing_meta: missingMeta.length, duplicate_meta: dupMeta.length, long_meta: longMeta.length,
    missing_h1: missingH1.length, multiple_h1: multiH1.length, duplicate_h1: dupH1.length,
    duplicate_bodies: dupBodies.length, missing_canonical: missingCanonical.length, title_equals_h1: titleEqH1.length,
    thin_content: thin.length, pages_no_image: noImg.length, missing_cro_card: missingCRO.length, missing_faq: missingFAQ.length, images_missing_alt: imgNoAlt.length, missing_schema: noSchema.length,
    insecure_link_pages: insecure.length, non_indexable: nonIndex.length, low_inlinks: lowInlinks.length, orphan_pages: orphans.length,
    broken_external: CFG.checkExternal ? brokenExternal.length : 'not-checked'
  };
  const summary = { crawledAt_utc: meta.nowIso, seed: CFG.seed, host: CFG.host, urls_crawled: all.length, html_200: html200.length, indexable: indexable.length, blob_enriched: CFG.blobEnrich, issues: I, pillars: Object.values(pillars).sort((a, b) => b.urls - a.urls) };
  fs.writeFileSync(path.join(CFG.outDir, 'summary.json'), JSON.stringify(summary, null, 2));

  const md = `# PULSE Spider — SEO Crawl Report
Crawled: ${meta.nowIso} · Seed: ${CFG.seed} · Host: ${CFG.host}
URLs crawled: **${all.length}** · HTML 200: **${html200.length}** · Indexable: **${indexable.length}** · Blob-enriched content: **${CFG.blobEnrich ? 'yes (accurate)' : 'no'}**

## Issues
| Issue | Count |
|---|---|
| 🔴 Broken (4xx/5xx) | ${I.broken_4xx_5xx} |
| 🔁 Redirects (3xx) | ${I.redirects_3xx} |
| 🏷️ Missing / Duplicate titles | ${I.missing_titles} / ${I.duplicate_titles} |
| 🏷️ Short / Long / Multiple titles | ${I.short_titles} / ${I.long_titles} / ${I.multiple_titles} |
| 📝 Missing / Duplicate / Long meta | ${I.missing_meta} / ${I.duplicate_meta} / ${I.long_meta} |
| #️⃣ Missing / Multiple / Duplicate H1 | ${I.missing_h1} / ${I.multiple_h1} / ${I.duplicate_h1} |
| 👯 Exact-duplicate page bodies | ${I.duplicate_bodies} |
| 🔗 Missing canonical | ${I.missing_canonical} |
| 🪞 Title == H1 | ${I.title_equals_h1} |
| 📄 Thin content (<${CFG.thinWords}w, library only) | ${I.thin_content} |
| 🖼️ Library pages with no image | ${I.pages_no_image} |
| 🪪 Answer pages missing CRO card | ${I.missing_cro_card} |
| ❓ Answer pages missing FAQ | ${I.missing_faq} |
| 🖼️ Static pages w/ imgs missing alt | ${I.images_missing_alt} |
| 🧩 Missing JSON-LD schema | ${I.missing_schema} |
| 🔓 Pages with insecure (http) links | ${I.insecure_link_pages} |
| 🚫 Non-indexable | ${I.non_indexable} |
| 🕸️ Low internal inlinks (<2) | ${I.low_inlinks} |
| 👻 Orphan pages (sitemap, not linked) | ${I.orphan_pages} |
| 🌐 Broken external links | ${I.broken_external} |

## By pillar (top)
| Pillar | URLs | Broken | Redirects | Non-indexable | Missing title | Thin | No image |
|---|---|---|---|---|---|---|---|
${summary.pillars.slice(0, 15).map(p => `| ${p.pillar} | ${p.urls} | ${p.broken} | ${p.redirects} | ${p.nonIndexable} | ${p.missingTitle} | ${p.thin} | ${p.noImg} |`).join('\n')}

Per-issue URL lists are the CSVs in this folder. \`internal_all.csv\` has every URL + all 35 columns (b_* = canonical blob-sourced content metrics).
`;
  fs.writeFileSync(path.join(CFG.outDir, 'report.md'), md);
  // publish to a blob so the LIVE on-site /seo dashboard can read it (served key-gated)
  if (STORE) {
    try {
      let hist = [];
      try { hist = fs.readFileSync(path.join(CFG.outDir, 'history.jsonl'), 'utf8').trim().split(/\n/).filter(Boolean).map(l => JSON.parse(l)); } catch (e) {}
      hist.push({ at: summary.crawledAt_utc, urls: summary.urls_crawled, issues: summary.issues });
      await STORE.setJSON('seo-monitor/latest.json', { summary, broken: broken.slice(0, 200), redirects: redirects.slice(0, 100), history: hist.slice(-80), generatedAt: summary.crawledAt_utc });
      console.log('[spider] published seo-monitor/latest.json to blob');
    } catch (e) { console.log('[spider] blob publish failed: ' + e.message); }
  }
  return summary;
}

(async () => {
  const t0 = Date.now();
  const meta = await crawl(); meta.nowIso = new Date().toISOString();
  const summary = await report(meta);
  console.log('\n===== PULSE SPIDER SUMMARY =====');
  console.log('crawled:', summary.urls_crawled, '| html200:', summary.html_200, '| indexable:', summary.indexable, '| blob-enriched:', summary.blob_enriched);
  console.log('issues:', JSON.stringify(summary.issues, null, 1));
  console.log(`\nreports -> ${CFG.outDir} (report.md + summary.json + 20+ CSVs)`);
  console.log(`done in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
})().catch(e => { console.error('FATAL', e && e.stack); process.exit(1); });
