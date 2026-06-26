// Ensure every answer with NO visual (no image AND no mermaid) gets ONE real
// image. Targets text-pillar entries (q/ik/tl/st/...) that _img_backfill_any.js
// can't handle (no Top-10 @@PRODUCT structure). Fetches one relevant image via
// keyless DuckDuckGo using the entry's question/title, HEAD-validates it, and
// inserts a markdown image right after the first heading. Republishes + IndexNow.
// Never regresses: only writes when a valid image was found.
//
// Usage: node _img_fix_novisual.js [prefixCSV]   e.g. node _img_fix_novisual.js ik,q,tl,st
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
const PREFIXES = (process.argv[2] || 'ik,q,tl,st').split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
const CONC = 3;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const hasImage = (a) => /@@PRODUCT[^\n]*\bimg=/.test(a) || /!\[[^\]]*\]\([^)]+\)/.test(a) || /<img\s/i.test(a) || /<svg/i.test(a);
const hasMermaid = (a) => /```mermaid/.test(a);
const prefixOf = (id) => { const m = String(id).match(/^([a-z]+)/i); return m ? m[1].toLowerCase() : '?'; };

async function headOk(url) {
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
  // insert after the first heading line; else after first non-empty line; else top
  let at = lines.findIndex(l => /^#{1,3}\s+\S/.test(l));
  if (at < 0) at = lines.findIndex(l => l.trim().length);
  if (at < 0) return imgMd + '\n\n' + body;
  lines.splice(at + 1, 0, '', imgMd);
  return lines.join('\n');
}
(async () => {
  const idx = (await s.get('_index.json', { type: 'json' })) || { entries: [] };
  const ids = (idx.entries || []).map(e => e.id).filter(id => PREFIXES.includes(prefixOf(id)));
  // find targets: no image AND no mermaid
  const targets = [];
  let scanned = 0, i = 0;
  async function scanWorker() {
    while (i < ids.length) {
      const id = ids[i++];
      try { const e = await s.get('answers/' + id + '.json', { type: 'json' }); const a = (e && e.answer) || ''; if (a && !hasImage(a) && !hasMermaid(a)) targets.push({ id, q: e.question || id }); } catch (e) {}
      scanned++; if (scanned % 500 === 0) console.error('  scanned', scanned, '/', ids.length, 'targets', targets.length);
    }
  }
  await Promise.all(Array.from({ length: 8 }, scanWorker));
  console.log('Targets (no image + no mermaid):', targets.length);
  let fixed = 0, failed = 0, j = 0;
  async function fixWorker() {
    while (j < targets.length) {
      const { id, q } = targets[j++];
      try {
        const arr = await ddgImages(q);
        let pick = null;
        for (const c of arr.slice(0, 8)) { if (!c.image) continue; if (await headOk(c.image)) { pick = c; break; } }
        if (!pick) { failed++; console.log('  NO-IMG', id, q.slice(0, 50)); continue; }
        const e = await s.get('answers/' + id + '.json', { type: 'json' });
        const before = gradeEntry(id, e.answer);
        const newBody = insertImage(e.answer, pick.image, q);
        const after = gradeEntry(id, newBody);
        if (after.score < before.score) { failed++; console.log('  SKIP(regress)', id, before.score, '->', after.score); continue; }
        e.answer = newBody; e.ts = Date.now(); e.polished_at = Date.now();
        await s.setJSON('answers/' + id + '.json', e);
        try { await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'pulsemachine-writer-2026', id }), signal: AbortSignal.timeout(8000) }); } catch (e) {}
        fixed++; console.log(`  [${fixed}] ${id} +img`);
      } catch (err) { failed++; console.log('  ERR', id, err.message); }
    }
  }
  await Promise.all(Array.from({ length: CONC }, fixWorker));
  console.log(`DONE prefixes=[${PREFIXES}] targets=${targets.length} fixed=${fixed} failed=${failed}`);
  fs.writeFileSync('C:/Users/koryj/website/_img_fix_novisual_result.json', JSON.stringify({ prefixes: PREFIXES, targets: targets.length, fixed, failed }, null, 1));
})().catch(e => { console.error('FATAL', e && e.stack); process.exit(1); });
