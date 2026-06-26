// Local batch image backfill for the ENTIRE cars pillar.
// Mirrors pulse-backfill-images-background.js logic but runs locally, in a loop,
// directly against the blob store. Skips entries that already have @@PRODUCT.
// Usage: node _ca_image_backfill.js [prefix] [concurrency]
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try { const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}

const PREFIX = (process.argv[2] || 'ca').toLowerCase();
const CONC = parseInt(process.argv[3] || '4', 10);
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const KEY = process.env.SERPER_API_KEY;
const PILLAR_PATH = { ca: 'cars', er: 'electronic-reviews' };

function store() { return getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOK }); }
const num = (id) => { const m = String(id).match(/\d+/); return m ? parseInt(m[0], 10) : 0; };
function cleanName(s) {
  return s.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}⭐️]/gu, ' ')
    .replace(/\bBEST OVERALL\b/gi, '').replace(/\bBEST VALUE\b/gi, '')
    .replace(/\s{2,}/g, ' ').trim();
}
async function headOk(url) {
  try { const r = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(9000) });
    const ct = (r.headers.get('content-type') || '').toLowerCase();
    if (r.ok && ct.startsWith('image/')) return true;
    if (!r.ok || !ct) { const g = await fetch(url, { method: 'GET', headers: { Range: 'bytes=0-1024' }, redirect: 'follow', signal: AbortSignal.timeout(9000) });
      const ct2 = (g.headers.get('content-type') || '').toLowerCase(); return g.ok && ct2.startsWith('image/'); }
    return false; } catch (e) { return false; }
}
async function serperImages(queries) {
  const r = await fetch('https://google.serper.dev/images', { method: 'POST',
    headers: { 'X-API-KEY': KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(queries.map(q => ({ q }))), signal: AbortSignal.timeout(30000) });
  const d = await r.json(); return Array.isArray(d) ? d : [d];
}
async function backfillBody(answer) {
  const lines = answer.split(/\r?\n/);
  const items = [];
  for (const l of lines) { const m = l.match(/^##\s+(\d+)\.\s+(.+)$/); if (m) items.push({ idx: m[1], q: cleanName(m[2]) }); }
  if (items.length < 5) return null;
  const results = await serperImages(items.map(i => i.q));
  const picks = await Promise.all(items.map(async (it, i) => {
    const arr = (results[i] && results[i].images) || [];
    for (const c of arr.slice(0, 6)) { if (!c.imageUrl) continue; if (await headOk(c.imageUrl)) return { idx: it.idx, q: it.q, img: c.imageUrl, site: c.link || '' }; }
    return { idx: it.idx, q: it.q, img: '', site: (arr[0] && arr[0].link) || '' };
  }));
  const seen = new Set();
  for (const p of picks) { if (p.img) { if (seen.has(p.img)) p.img = ''; else seen.add(p.img); } }
  const card = {}; let imgs = 0, links = 0;
  for (const p of picks) { let s = `@@PRODUCT name="${p.q.replace(/"/g, '')}"`;
    if (p.img) { s += ` img="${p.img.replace(/"/g, '')}"`; imgs++; }
    if (p.site) { s += ` site="${p.site.replace(/"/g, '')}"`; links++; }
    card[p.idx] = s; }
  const out = [];
  for (const l of lines) { out.push(l); const m = l.match(/^##\s+(\d+)\.\s/); if (m && card[m[1]]) out.push(card[m[1]]); }
  return { body: out.join('\n'), imgs, links, items: items.length };
}

(async () => {
  const s = store();
  const idx = await s.get('_index.json', { type: 'json' });
  const ids = (idx.entries || []).filter(e => e && new RegExp('^' + PREFIX + '\\d+$').test(e.id)).map(e => e.id).sort((a, b) => num(a) - num(b));
  console.log(`[${PREFIX}] ${ids.length} entries total. Concurrency ${CONC}.`);
  let done = 0, skipped = 0, failed = 0, totImgs = 0;
  const queue = ids.slice();
  async function worker(wid) {
    while (queue.length) {
      const id = queue.shift();
      try {
        const entry = await s.get('answers/' + id + '.json', { type: 'json' });
        if (!entry || !entry.answer) { skipped++; continue; }
        if (/@@PRODUCT/.test(entry.answer)) { skipped++; continue; }
        const res = await backfillBody(entry.answer);
        if (!res) { skipped++; continue; }
        entry.answer = res.body; entry.ts = Date.now(); entry.polished_at = Date.now();
        await s.setJSON('answers/' + id + '.json', entry);
        done++; totImgs += res.imgs;
        try { await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'pulsemachine-writer-2026', id }) }); } catch (e) {}
        console.log(`  +${id}  ${res.imgs}img/${res.links}lnk  (${done} done, ${skipped} skip)`);
      } catch (e) { failed++; console.log(`  !${id} ERR ${e && e.message}`); }
    }
  }
  await Promise.all(Array.from({ length: CONC }, (_, i) => worker(i)));
  console.log(`DONE [${PREFIX}]: ${done} backfilled (${totImgs} imgs), ${skipped} skipped/already-had, ${failed} failed.`);
})().catch(e => { console.error('FATAL', e && e.message); process.exit(1); });
