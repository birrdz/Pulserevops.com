// Revalidate + repair franchise (fr####) top logos whose URL has gone dead.
// All fr entries already have a leading ![logo](url); some of those URLs now
// return 404/403/202/text-html (rot or hotlink block) and render as a broken
// image. This script GET-checks every fr top image; for the broken ones it
// re-sources a working logo via keyless DuckDuckGo (same finder as
// _fr_logo_backfill.js), swaps ONLY the top image line, and pings IndexNow.
// Never blanks an image it can't replace. Idempotent.
//   node _fr_logo_revalidate.js
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try { const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const line of env.split(/\r?\n/)) { const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const s = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });

const CONCURRENCY = 5;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
const num = id => parseInt(String(id).match(/\d+/)[0], 10);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const renderableUrl = u => typeof u === 'string' && /^https?:\/\/[^)\s]+$/.test(u);

function brandFromQuestion(q) {
  let m = q.match(/(?:buy|open)\s+(?:a|an)\s+(.+?)\s+franchise/i);
  if (m) return m[1].trim();
  m = q.match(/(?:a|an)\s+(.+?)\s+franchise/i);
  if (m) return m[1].trim();
  return q.replace(/^should i.*?\b(?:a|an)\b\s*/i, '').replace(/\s+franchise.*$/i, '').replace(/\?+$/, '').trim();
}

// Returns true if the URL currently serves an image. Two attempts so a
// transient network blip doesn't flag a good logo as broken.
async function imageLoads(url, attempt = 0) {
  try {
    const r = await fetch(url, { method: 'GET', headers: { Range: 'bytes=0-2048', 'User-Agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(10000) });
    const ct = (r.headers.get('content-type') || '').toLowerCase();
    if (r.ok && ct.startsWith('image/')) return true;
    // 4xx/5xx/non-image => broken (no retry; it's a definitive answer)
    return false;
  } catch (e) {
    // network/timeout — retry once before declaring broken
    if (attempt < 1) { await sleep(800); return imageLoads(url, attempt + 1); }
    return false;
  }
}
async function headOk(url) {
  try {
    const g = await fetch(url, { method: 'GET', headers: { Range: 'bytes=0-2048', 'User-Agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(10000) });
    const ct = (g.headers.get('content-type') || '').toLowerCase();
    return g.ok && ct.startsWith('image/');
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
    return (j.results || []).map(x => ({ image: x.image, url: x.url }));
  } catch (e) { if (attempt < 2) { await sleep(1500); return ddgImages(q, attempt + 1); } return []; }
}
async function findLogo(brand, avoid) {
  const arr = await ddgImages(brand + ' logo');
  const cands = arr.map(x => x.image).filter(renderableUrl).filter(u => u !== avoid);
  const ranked = cands.slice().sort((a, b) => {
    const score = u => (/\.svg(\?|$)/i.test(u) ? 0 : /\.png(\?|$)/i.test(u) ? 1 : 2);
    return score(a) - score(b);
  });
  for (const u of ranked.slice(0, 12)) { if (await headOk(u)) return u; }
  return '';
}
async function pingIndexNow(id) { try { await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'pulsemachine-writer-2026', id }), signal: AbortSignal.timeout(8000) }); } catch (e) {} }
async function emailOwner(subject, html) { try { await fetch('https://pulserevops.com/.netlify/functions/pulse-progress-notify?key=pulsemachine-writer-2026', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject, html }), signal: AbortSignal.timeout(12000) }); } catch (e) {} }

(async () => {
  const idx = (await s.get('_index.json', { type: 'json' })) || { entries: [] };
  const all = (idx.entries || []).filter(e => e && typeof e.id === 'string' && /^fr\d+$/.test(e.id)).map(e => e.id).sort((a, b) => num(a) - num(b));
  console.log('FR entries to revalidate:', all.length);

  let cursor = 0, checked = 0, okCount = 0, broken = 0, fixed = 0, noReplace = 0, fail = 0, lastEmail = Date.now();
  const stillBroken = [];
  async function worker() {
    while (cursor < all.length) {
      const id = all[cursor++];
      try {
        const e = await s.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
        if (!e || !e.answer) { fail++; continue; }
        const lines = e.answer.split(/\r?\n/);
        const firstIdx = lines.findIndex(l => l.trim());
        const first = firstIdx >= 0 ? lines[firstIdx].trim() : '';
        const m = first.match(/^!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)\s*$/);
        checked++;
        if (!m) { // leading line isn't a plain image — re-source from brand
          broken++;
          const brand0 = brandFromQuestion(e.question || '');
          const logo0 = await findLogo(brand0, null);
          if (logo0) { e.answer = `![${brand0.replace(/[\[\]]/g, '')} logo](${logo0})\n\n` + e.answer.replace(/^\s+/, ''); e.ts = Date.now(); e.polished_at = Date.now(); await s.setJSON('answers/' + id + '.json', e); await pingIndexNow(id); fixed++; console.log(`  FIX(noimg) ${id} ${brand0} -> ${logo0.slice(0, 60)}`); }
          else { noReplace++; stillBroken.push(id); console.log(`  NO-REPLACE ${id} (${brand0})`); }
          continue;
        }
        const url = m[2];
        if (await imageLoads(url)) { okCount++; continue; }
        // broken — re-source
        broken++;
        const brand = brandFromQuestion(e.question || '');
        const logo = await findLogo(brand, url);
        if (!logo) { noReplace++; stillBroken.push(id); console.log(`  NO-REPLACE ${id} (${brand}) old=${url.slice(0, 50)}`); continue; }
        lines[firstIdx] = `![${(m[1] || brand + ' logo').replace(/[\[\]]/g, '')}](${logo})`;
        e.answer = lines.join('\n');
        e.ts = Date.now(); e.polished_at = Date.now();
        await s.setJSON('answers/' + id + '.json', e);
        await pingIndexNow(id);
        fixed++;
        console.log(`  FIX ${id} ${brand} -> ${logo.slice(0, 60)}`);
      } catch (err) { fail++; console.log(`  FAIL ${id}: ${err.message}`); }
      if (Date.now() - lastEmail > 15 * 60 * 1000) { lastEmail = Date.now(); await emailOwner(`PULSE fr logo revalidate: ${checked}/${all.length}`, `<p>Franchise logo revalidation: <b>${fixed}</b> broken logos repaired, ${broken} broken found, ${noReplace} unreplaceable so far (${checked}/${all.length} checked).</p>`); }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  const out = { total: all.length, checked, ok: okCount, broken, fixed, noReplace, fail, stillBroken };
  fs.writeFileSync('C:/Users/koryj/website/_fr_logo_revalidate_result.json', JSON.stringify(out, null, 1));
  console.log(`\nFR REVALIDATE DONE. checked=${checked} ok=${okCount} broken=${broken} fixed=${fixed} noReplace=${noReplace} fail=${fail}`);
  if (stillBroken.length) console.log('still broken (no replacement found):', stillBroken.join(', '));
  await emailOwner(`PULSE fr logo revalidate COMPLETE`, `<p>Franchise logo revalidation finished. <b>${fixed}</b> dead logos repaired out of ${broken} broken (${noReplace} could not be re-sourced). ${okCount} already-valid.</p><p>https://pulserevops.com/franchises</p>`);
})().catch(e => { console.error('FATAL', e && e.stack); process.exit(1); });
