// Batch Top-10 image+link backfill for the ENTIRE er (Electronic Reviews) pillar.
// Mirrors netlify/functions/pulse-backfill-images-background.js backfillBody()
// exactly (same @@PRODUCT card format, image dedup, HEAD validation) but runs
// locally with concurrency, writes directly to blobs, pings IndexNow per entry,
// and emails the owner every ~15 min. Idempotent/resumable: skips entries that
// already contain @@PRODUCT.
const fs = require('fs');
const { getStore } = require('@netlify/blobs');

try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const SERPER = process.env.SERPER_API_KEY;
const s = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });

const CONCURRENCY = 5;
const num = id => parseInt(String(id).match(/\d+/)[0], 10);
const sleep = ms => new Promise(r => setTimeout(r, ms));

function cleanName(s) {
  return s.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}⭐️]/gu, ' ')
    .replace(/\bBEST OVERALL\b/gi, '').replace(/\bBEST VALUE\b/gi, '')
    .replace(/\s{2,}/g, ' ').trim();
}
async function headOk(url) {
  try {
    const r = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(9000) });
    const ct = (r.headers.get('content-type') || '').toLowerCase();
    if (r.ok && ct.startsWith('image/')) return true;
    if (!r.ok || !ct) {
      const g = await fetch(url, { method: 'GET', headers: { Range: 'bytes=0-1024' }, redirect: 'follow', signal: AbortSignal.timeout(9000) });
      const ct2 = (g.headers.get('content-type') || '').toLowerCase();
      return g.ok && ct2.startsWith('image/');
    }
    return false;
  } catch (e) { return false; }
}
async function serperImages(queries) {
  const r = await fetch('https://google.serper.dev/images', {
    method: 'POST',
    headers: { 'X-API-KEY': SERPER, 'Content-Type': 'application/json' },
    body: JSON.stringify(queries.map(q => ({ q }))),
    signal: AbortSignal.timeout(30000),
  });
  const d = await r.json();
  return Array.isArray(d) ? d : [d];
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
  for (const p of picks) {
    let str = `@@PRODUCT name="${p.q.replace(/"/g, '')}"`;
    if (p.img) { str += ` img="${p.img.replace(/"/g, '')}"`; imgs++; }
    if (p.site) { str += ` site="${p.site.replace(/"/g, '')}"`; links++; }
    card[p.idx] = str;
  }
  const out = [];
  for (const l of lines) { out.push(l); const m = l.match(/^##\s+(\d+)\.\s/); if (m && card[m[1]]) out.push(card[m[1]]); }
  return { body: out.join('\n'), imgs, links, items: items.length };
}
async function pingIndexNow(id) {
  try { await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'pulsemachine-writer-2026', id }), signal: AbortSignal.timeout(8000) }); } catch (e) {}
}
async function emailOwner(subject, html) {
  try { await fetch('https://pulserevops.com/.netlify/functions/pulse-progress-notify?key=pulsemachine-writer-2026', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject, html }), signal: AbortSignal.timeout(12000) }); } catch (e) {}
}

(async () => {
  const idx = (await s.get('_index.json', { type: 'json' })) || { entries: [] };
  const allEr = (idx.entries || []).map(e => e.id).filter(id => /^er\d+$/.test(id)).sort((a, b) => num(a) - num(b));

  // Determine which still need cards (resumable)
  const todo = [];
  for (const id of allEr) {
    const e = await s.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
    if (e && e.answer && !/@@PRODUCT/.test(e.answer)) todo.push(id);
  }
  const startTotal = allEr.length, alreadyDone = startTotal - todo.length;
  console.log(`er pillar: ${startTotal} total | ${alreadyDone} already have cards | ${todo.length} to backfill`);

  let done = 0, failed = 0, totalImgs = 0, totalLinks = 0;
  let lastEmail = Date.now();
  const failures = [];

  async function processOne(id) {
    try {
      const entry = await s.get('answers/' + id + '.json', { type: 'json' });
      if (!entry || !entry.answer) { failed++; failures.push(id + '(nobody)'); return; }
      if (/@@PRODUCT/.test(entry.answer)) { return; } // raced/already done
      const res = await backfillBody(entry.answer);
      if (!res) { failed++; failures.push(id + '(noitems)'); return; }
      entry.answer = res.body; entry.ts = Date.now(); entry.polished_at = Date.now();
      await s.setJSON('answers/' + id + '.json', entry);
      await pingIndexNow(id);
      done++; totalImgs += res.imgs; totalLinks += res.links;
      console.log(`  [${done}/${todo.length}] ${id} -> ${res.imgs} imgs / ${res.links} links (${res.items} items)`);
    } catch (e) {
      failed++; failures.push(id + '(' + (e.message || 'err').slice(0, 40) + ')');
      console.log(`  FAIL ${id}: ${e.message}`);
    }
  }

  // concurrency pool
  let cursor = 0;
  async function worker() {
    while (cursor < todo.length) {
      const id = todo[cursor++];
      await processOne(id);
      // 15-min progress email law
      if (Date.now() - lastEmail > 15 * 60 * 1000) {
        lastEmail = Date.now();
        await emailOwner(`PULSE er backfill: ${done}/${todo.length} done`,
          `<p>Electronic Reviews image+link backfill in progress.</p><p><b>${done}</b> of ${todo.length} entries backfilled this run (${alreadyDone} were already done). ${totalImgs} images / ${totalLinks} links added. ${failed} failures so far.</p>`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  console.log(`\nDONE. backfilled=${done} failed=${failed} imgs=${totalImgs} links=${totalLinks}`);
  if (failures.length) console.log('failures:', failures.join(', '));
  await emailOwner(`PULSE er backfill COMPLETE: ${done} entries`,
    `<p>Electronic Reviews (er) pillar image+link backfill finished.</p><p><b>${alreadyDone + done}</b> of ${startTotal} er entries now have @@PRODUCT image+link cards (${done} added this run, ${alreadyDone} already done). ${totalImgs} images / ${totalLinks} links added. ${failed} failures${failures.length ? ': ' + failures.slice(0, 30).join(', ') : ''}.</p><p>https://pulserevops.com/electronic-reviews</p>`);

  fs.writeFileSync('C:/Users/koryj/website/_er_backfill_result.json', JSON.stringify({ startTotal, alreadyDone, done, failed, totalImgs, totalLinks, failures }, null, 1));
})().catch(e => { console.error('FATAL', e && e.stack); process.exit(1); });
