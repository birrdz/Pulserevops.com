// Ensure EVERY library answer has at least one real IMAGE (the "≥1 image/answer"
// LAW). Unlike _img_fix_novisual.js, this targets entries that have NO IMAGE even
// if they already have a mermaid diagram — a diagram is not an image.
//
// Efficiency: a persistent topic cache (_img_topic_cache.json) lets entries on the
// same topic REUSE a already-validated image URL (duplicates are allowed per owner),
// so we make far fewer DuckDuckGo calls than there are entries.
//
// Never regresses: only writes when a valid image is found AND the grade does not drop.
// Durable: writes a cursor/counter so it can run in the background and resume.
//
// Usage:
//   node _img_fill_every.js <prefixCSV> [--limit N] [--conc N]
//   e.g. node _img_fill_every.js cg,fr,ik,ra,gp,st,q --limit 500
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
} catch (e) {}
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const s = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });

const args = process.argv.slice(2);
const PREFIXES = (args.find(a => !a.startsWith('--')) || 'cg,fr,ik,ra,gp,st,q')
  .split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
const LIMIT = (() => { const i = args.indexOf('--limit'); return i >= 0 ? parseInt(args[i + 1]) : Infinity; })();
const CONC = (() => { const i = args.indexOf('--conc'); return i >= 0 ? parseInt(args[i + 1]) : 3; })();
const CACHE_PATH = 'C:/Users/koryj/website/_img_topic_cache.json';
const RESULT_PATH = 'C:/Users/koryj/website/_img_fill_every_result.json';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const hasImage = (a) => /@@PRODUCT[^\n]*\bimg=/.test(a) || /!\[[^\]]*\]\([^)]+\)/.test(a) || /<img\s/i.test(a) || /<svg/i.test(a);
const prefixOf = (id) => { const m = String(id).match(/^([a-z]+)/i); return m ? m[1].toLowerCase() : '?'; };

const STOP = new Set('the a an of for to in on and or how do you what is are best top 2027 with your my we i it that this when why which who whom should can will be as at by from into about revops rev ops'.split(/\s+/));
function topicKey(question, tags) {
  // Prefer a specific (non-pillar-generic) tag; else salient keywords from the question.
  const generic = new Set(['industry-kpi', 'sales-training', 'tech-stack', 'gtm-playbook', 'revenue-architecture', 'coaching', 'top-10', 'best-of-2027', 'collectible']);
  const tag = (tags || []).map(t => String(t).toLowerCase()).find(t => !generic.has(t) && t.length > 3);
  const words = String(question || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/)
    .filter(w => w.length > 2 && !STOP.has(w)).slice(0, 4);
  return (tag ? tag + ' ' : '') + words.join(' ');
}
function searchQuery(question, tags) {
  const k = topicKey(question, tags);
  return (k + ' business chart').trim();
}

const BAD_HOST = /scribdassets|slideshare|slidesharecdn|imgv2-\d|lookaside|fbsbx|pinimg\/\d+x|ytimg|gstatic/i;
async function headOk(url) {
  if (BAD_HOST.test(url)) return false;
  try {
    const r = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(10000) });
    const ct = (r.headers.get('content-type') || '').toLowerCase();
    if (r.ok && ct.startsWith('image/')) return true;
    const g = await fetch(url, { method: 'GET', headers: { Range: 'bytes=0-1024', 'User-Agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(10000) });
    const ct2 = (g.headers.get('content-type') || '').toLowerCase(); return g.ok && ct2.startsWith('image/');
  } catch (e) { return false; }
}
async function ddgImages(q, attempt = 0) {
  try {
    const tp = await fetch('https://duckduckgo.com/?q=' + encodeURIComponent(q) + '&iax=images&ia=images', { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(15000) });
    const html = await tp.text();
    const m = html.match(/vqd=([\d-]+)/) || html.match(/vqd="([^"]+)"/);
    if (!m) { if (attempt < 2) { await sleep(1500 + attempt * 1500); return ddgImages(q, attempt + 1); } return []; }
    await sleep(120);
    const r = await fetch('https://duckduckgo.com/i.js?l=us-en&o=json&q=' + encodeURIComponent(q) + '&vqd=' + m[1] + '&f=,,,&p=1', { headers: { 'User-Agent': UA, 'Referer': 'https://duckduckgo.com/', 'Accept': 'application/json' }, signal: AbortSignal.timeout(15000) });
    if (r.status === 429 || r.status === 403) { if (attempt < 3) { await sleep(2500 + attempt * 2500); return ddgImages(q, attempt + 1); } return []; }
    const t = await r.text(); let j; try { j = JSON.parse(t); } catch (e) { if (attempt < 2) { await sleep(2000); return ddgImages(q, attempt + 1); } return []; }
    return (j.results || []).map(x => ({ image: x.image, title: x.title }));
  } catch (e) { if (attempt < 2) { await sleep(1500); return ddgImages(q, attempt + 1); } return []; }
}
function insertImage(body, url, alt) {
  const safeAlt = String(alt || 'illustration').replace(/[\[\]]/g, '').slice(0, 80);
  const imgMd = `![${safeAlt}](${url})`;
  const lines = body.split(/\r?\n/);
  let at = lines.findIndex(l => /^#{1,3}\s+\S/.test(l));
  if (at < 0) at = lines.findIndex(l => l.trim().length);
  if (at < 0) return imgMd + '\n\n' + body;
  lines.splice(at + 1, 0, '', imgMd);
  return lines.join('\n');
}

let cache = {};
try { cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8')); } catch (e) {}
let cacheDirty = 0;
function saveCache() { try { fs.writeFileSync(CACHE_PATH, JSON.stringify(cache)); cacheDirty = 0; } catch (e) {} }

(async () => {
  const idx = (await s.get('_index.json', { type: 'json' })) || { entries: [] };
  const ids = (idx.entries || []).map(e => e.id).filter(id => PREFIXES.includes(prefixOf(id)));
  console.log('Candidate ids in prefixes', PREFIXES.join(','), '=', ids.length);

  let fixed = 0, failed = 0, skipped = 0, i = 0, processed = 0;
  let cacheHits = 0, ddgCalls = 0;
  async function worker() {
    while (i < ids.length && processed < LIMIT) {
      const id = ids[i++];
      let e;
      try { e = await s.get('answers/' + id + '.json', { type: 'json' }); } catch (err) { continue; }
      const a = (e && e.answer) || '';
      if (!a || hasImage(a)) { skipped++; continue; }   // already has an image
      processed++;
      const key = topicKey(e.question, e.tags) || id;
      try {
        let url = cache[key];
        if (url) { cacheHits++; }
        else {
          ddgCalls++;
          const arr = await ddgImages(searchQuery(e.question, e.tags));
          for (const c of arr.slice(0, 8)) { if (!c.image) continue; if (await headOk(c.image)) { url = c.image; break; } }
          if (url) { cache[key] = url; if (++cacheDirty >= 10) saveCache(); }
        }
        if (!url) { failed++; console.log('  NO-IMG', id, key.slice(0, 40)); continue; }
        const before = gradeEntry(id, e.answer);
        const newBody = insertImage(e.answer, url, e.question || id);
        const after = gradeEntry(id, newBody);
        if (after.score < before.score) { failed++; console.log('  SKIP(regress)', id, before.score, '->', after.score); continue; }
        e.answer = newBody; e.ts = Date.now(); e.polished_at = Date.now();
        await s.setJSON('answers/' + id + '.json', e);
        try { await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'pulsemachine-writer-2026', id }), signal: AbortSignal.timeout(8000) }); } catch (e) {}
        fixed++;
        if (fixed % 25 === 0) { console.log(`  [${fixed}] ${id} +img  (cacheHits=${cacheHits} ddg=${ddgCalls})`); fs.writeFileSync(RESULT_PATH, JSON.stringify({ prefixes: PREFIXES, processed, fixed, failed, cacheHits, ddgCalls }, null, 1)); }
      } catch (err) { failed++; console.log('  ERR', id, err.message); }
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  saveCache();
  const out = { prefixes: PREFIXES, processed, fixed, failed, skipped, cacheHits, ddgCalls };
  fs.writeFileSync(RESULT_PATH, JSON.stringify(out, null, 1));
  console.log('DONE', JSON.stringify(out));
})().catch(e => { saveCache(); console.error('FATAL', e && e.stack); process.exit(1); });
