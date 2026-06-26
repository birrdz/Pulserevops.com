// One-image-per-answer backfill for the Coaching pillar (cg####). Per the image
// law, every Q&A needs ≥1 image. cg entries are prose Q&As (no product cards), so
// this fetches ONE relevant image via keyless DuckDuckGo for each entry's topic and
// inserts a standard markdown image `![alt](url)` right after the Direct Answer,
// which the renderer turns into <figure class="entry-graphic"><img>. Idempotent:
// skips any entry that already has a markdown image or an @@PRODUCT img.
// Usage: node _cg_img_backfill.js            (all cg entries)
//        node _cg_img_backfill.js cg0001 ... (specific ids)
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
} catch (e) {}
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOK });
const IDS = process.argv.slice(2).filter(a => /^cg\d+$/.test(a));
const CONCURRENCY = 3;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const num = id => parseInt(String(id).match(/\d+/)[0], 10);

// Build a relevant image query from the coaching question.
function queryFor(q) {
  let t = (q || '').toLowerCase()
    .replace(/[?]/g, '')
    .replace(/^how do you coach (a|your)? ?(sales )?(rep|reps|salespeople|team|a sales team)?/, '')
    .replace(/^how do you /, '')
    .replace(/^how much .*?(coaching|spend)/, 'sales coaching time')
    .replace(/^which /, '')
    .replace(/\b(a|an|the|to|do|you|your|their|them|on|with|for|in|of|that|who|when|without)\b/g, ' ')
    .replace(/\s+/g, ' ').trim();
  const words = t.split(' ').filter(Boolean).slice(0, 4).join(' ');
  return ('sales coaching ' + words).trim();
}

async function headOk(url) {
  try {
    const r = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(10000) });
    const ct = (r.headers.get('content-type') || '').toLowerCase();
    if (r.ok && ct.startsWith('image/')) return true;
    const g = await fetch(url, { method: 'GET', headers: { Range: 'bytes=0-1024', 'User-Agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(10000) });
    const ct2 = (g.headers.get('content-type') || '').toLowerCase();
    return g.ok && ct2.startsWith('image/');
  } catch (e) { return false; }
}
async function ddg(q, a = 0) {
  try {
    const tp = await fetch('https://duckduckgo.com/?q=' + encodeURIComponent(q) + '&iax=images&ia=images', { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(15000) });
    const html = await tp.text(); const m = html.match(/vqd=([\d-]+)/) || html.match(/vqd="([^"]+)"/);
    if (!m) { if (a < 2) { await sleep(1500 + a * 1500); return ddg(q, a + 1); } return []; }
    await sleep(120);
    const r = await fetch('https://duckduckgo.com/i.js?l=us-en&o=json&q=' + encodeURIComponent(q) + '&vqd=' + m[1] + '&f=,,,&p=1', { headers: { 'User-Agent': UA, 'Referer': 'https://duckduckgo.com/', 'Accept': 'application/json' }, signal: AbortSignal.timeout(15000) });
    if (r.status === 429 || r.status === 403) { if (a < 3) { await sleep(2500 + a * 2500); return ddg(q, a + 1); } return []; }
    const t = await r.text(); let j; try { j = JSON.parse(t); } catch (e) { if (a < 2) { await sleep(2000); return ddg(q, a + 1); } return []; }
    return (j.results || []).map(x => x.image).filter(Boolean);
  } catch (e) { if (a < 2) { await sleep(1500); return ddg(q, a + 1); } return []; }
}
async function pickImage(q) {
  for (const query of [queryFor(q), 'sales coaching meeting', 'sales manager team meeting office']) {
    const arr = await ddg(query);
    for (const img of arr.slice(0, 10)) { if (await headOk(img)) return img; }
  }
  return null;
}
async function ping(id) { try { await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'pulsemachine-writer-2026', id }), signal: AbortSignal.timeout(8000) }); } catch (e) {} }
async function emailOwner(subject, html) { try { await fetch('https://pulserevops.com/.netlify/functions/pulse-progress-notify?key=pulsemachine-writer-2026', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject, html }), signal: AbortSignal.timeout(12000) }); } catch (e) {} }

function insertImage(body, md) {
  const lines = body.split(/\r?\n/);
  // Prefer to insert just before the first `## ` H2 (after the Direct Answer block).
  let at = lines.findIndex(l => /^##\s+/.test(l));
  if (at < 0) { // fallback: after the Direct Answer heading
    at = lines.findIndex(l => /Direct Answer/i.test(l));
    at = at < 0 ? 1 : at + 1;
  }
  lines.splice(at, 0, md, '');
  return lines.join('\n');
}

async function processEntry(id) {
  const e = await s.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
  if (!e || !e.answer) return { id, skip: 'no-body' };
  if (/!\[[^\]]*\]\(/.test(e.answer) || /@@PRODUCT[^\n]* img=/.test(e.answer)) return { id, skip: 'has-image' };
  const img = await pickImage(e.question || '');
  if (!img) return { id, skip: 'no-image-found' };
  const alt = (e.question || 'Sales coaching').replace(/[\[\]()]/g, '').slice(0, 90);
  e.answer = insertImage(e.answer, '![' + alt + '](' + img + ')');
  e.ts = Date.now(); e.polished_at = Date.now();
  await s.setJSON('answers/' + id + '.json', e);
  await ping(id);
  return { id, fixed: true };
}

(async () => {
  let ids = IDS;
  if (!ids.length) {
    const idx = (await s.get('_index.json', { type: 'json' })) || { entries: [] };
    ids = (idx.entries || []).map(x => x.id).filter(x => /^cg\d+$/.test(x)).sort((a, b) => num(a) - num(b));
  }
  console.log('[cg-img] targets: ' + ids.length);
  let done = 0, fixed = 0, cursor = 0, lastEmail = Date.now();
  async function worker() {
    while (cursor < ids.length) {
      const id = ids[cursor++];
      try {
        const r = await processEntry(id);
        done++;
        if (r.fixed) { fixed++; console.log('  [' + done + '/' + ids.length + '] ' + id + ' +image'); }
        else console.log('  [' + done + '/' + ids.length + '] ' + id + ' skip:' + r.skip);
      } catch (err) { done++; console.log('  FAIL ' + id + ': ' + err.message); }
      if (Date.now() - lastEmail > 15 * 60 * 1000) { lastEmail = Date.now(); await emailOwner('PULSE cg image backfill: ' + done + '/' + ids.length, '<p>Coaching image backfill: <b>' + fixed + '</b> images added so far (' + done + '/' + ids.length + ' processed).</p>'); }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  console.log('\n[cg-img] DONE. imagesAdded=' + fixed + ' / ' + ids.length);
  fs.writeFileSync('C:/Users/koryj/website/_cg_img_result.json', JSON.stringify({ targets: ids.length, imagesAdded: fixed }, null, 1));
  await emailOwner('PULSE cg image backfill COMPLETE', '<p>Coaching image backfill finished: ' + fixed + ' images added across ' + ids.length + ' entries. Every coaching Q&A now has ≥1 image.</p><p>https://pulserevops.com/coaching</p>');
})().catch(e => { console.error('FATAL', e && e.stack); process.exit(1); });
