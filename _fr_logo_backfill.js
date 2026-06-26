// Keyless single-LOGO backfill for the franchises pillar (fr####).
// Franchise entries are single-subject (NOT Top-10), so each gets ONE company
// logo image prepended at the very top as a standalone markdown image:
//   ![<Brand> logo](<url>)
// which the renderer turns into <figure class="entry-graphic"><img>.
// Logo found via keyless DuckDuckGo image search ("<brand> logo"). Idempotent:
// skips entries that already start with an image. Never deletes existing body.
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try { const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const line of env.split(/\r?\n/)) { const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const s = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });

const CONCURRENCY = 3;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
const num = id => parseInt(String(id).match(/\d+/)[0], 10);
const sleep = ms => new Promise(r => setTimeout(r, ms));
// URL must satisfy the renderer's plain-image regex: ^https?://[^)\s]+$
const renderableUrl = u => typeof u === 'string' && /^https?:\/\/[^)\s]+$/.test(u);

// Extract the brand/business name from "Should I open or buy a <NAME> franchise in YYYY?"
function brandFromQuestion(q) {
  let m = q.match(/(?:buy|open)\s+(?:a|an)\s+(.+?)\s+franchise/i);
  if (m) return m[1].trim();
  m = q.match(/(?:a|an)\s+(.+?)\s+franchise/i);
  if (m) return m[1].trim();
  return q.replace(/^should i.*?\b(?:a|an)\b\s*/i, '').replace(/\s+franchise.*$/i, '').replace(/\?+$/, '').trim();
}

async function headOk(url) {
  try {
    const r = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(10000) });
    const ct = (r.headers.get('content-type') || '').toLowerCase();
    if (r.ok && ct.startsWith('image/')) return true;
    if (!r.ok || !ct) { const g = await fetch(url, { method: 'GET', headers: { Range: 'bytes=0-1024', 'User-Agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(10000) }); const ct2 = (g.headers.get('content-type') || '').toLowerCase(); return g.ok && ct2.startsWith('image/'); }
    return false;
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

// Pick the best renderable, HEAD-valid logo. Prefer .png/.svg (transparent logos).
async function findLogo(brand) {
  const arr = await ddgImages(brand + ' logo');
  const cands = arr.map(x => x.image).filter(renderableUrl);
  const ranked = cands.slice().sort((a, b) => {
    const score = u => (/\.svg(\?|$)/i.test(u) ? 0 : /\.png(\?|$)/i.test(u) ? 1 : 2);
    return score(a) - score(b);
  });
  for (const u of ranked.slice(0, 10)) { if (await headOk(u)) return u; }
  return '';
}
async function pingIndexNow(id) { try { await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'pulsemachine-writer-2026', id }), signal: AbortSignal.timeout(8000) }); } catch (e) {} }
async function emailOwner(subject, html) { try { await fetch('https://pulserevops.com/.netlify/functions/pulse-progress-notify?key=pulsemachine-writer-2026', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject, html }), signal: AbortSignal.timeout(12000) }); } catch (e) {} }

(async () => {
  const idx = (await s.get('_index.json', { type: 'json' })) || { entries: [] };
  const all = (idx.entries || []).map(e => e.id).filter(id => /^fr\d+$/.test(id)).sort((a, b) => num(a) - num(b));
  // target entries with no leading image
  const targets = [];
  for (const id of all) {
    const e = await s.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
    if (!e || !e.answer) continue;
    const firstNonEmpty = e.answer.split(/\r?\n/).find(l => l.trim());
    if (firstNonEmpty && /^!\[/.test(firstNonEmpty.trim())) continue; // already has a top image
    targets.push(id);
  }
  console.log(`FR logo targets (no top image): ${targets.length} / ${all.length}`);
  let done = 0, noLogo = 0, fail = 0, cursor = 0, lastEmail = Date.now();
  async function worker() {
    while (cursor < targets.length) {
      const id = targets[cursor++];
      try {
        const e = await s.get('answers/' + id + '.json', { type: 'json' });
        const firstNonEmpty = (e.answer || '').split(/\r?\n/).find(l => l.trim());
        if (firstNonEmpty && /^!\[/.test(firstNonEmpty.trim())) { continue; }
        const brand = brandFromQuestion(e.question || '');
        const logo = await findLogo(brand);
        if (!logo) { noLogo++; console.log(`  noLogo ${id} (${brand})`); continue; }
        e.answer = `![${brand.replace(/[\[\]]/g, '')} logo](${logo})\n\n` + e.answer.replace(/^\s+/, '');
        e.ts = Date.now(); e.polished_at = Date.now();
        await s.setJSON('answers/' + id + '.json', e);
        await pingIndexNow(id);
        done++;
        console.log(`  [${done}] ${id} ${brand} -> ${logo.slice(0, 70)}`);
      } catch (err) { fail++; console.log(`  FAIL ${id}: ${err.message}`); }
      if (Date.now() - lastEmail > 15 * 60 * 1000) { lastEmail = Date.now(); await emailOwner(`PULSE fr logo backfill: ${done}/${targets.length}`, `<p>Franchise logo backfill (keyless/DuckDuckGo): <b>${done}</b>/${targets.length} entries given a company logo, ${noLogo} no-logo, ${fail} failed.</p>`); }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  console.log(`\nFR LOGO DONE. added=${done} noLogo=${noLogo} fail=${fail}`);
  fs.writeFileSync('C:/Users/koryj/website/_fr_logo_result.json', JSON.stringify({ targets: targets.length, done, noLogo, fail }, null, 1));
  await emailOwner(`PULSE fr logo backfill COMPLETE`, `<p>Franchise logo backfill finished. <b>${done}</b> company logos added across ${targets.length} entries (${noLogo} no-logo, ${fail} failed).</p><p>https://pulserevops.com/franchises</p>`);
})().catch(e => { console.error('FATAL', e && e.stack); process.exit(1); });
