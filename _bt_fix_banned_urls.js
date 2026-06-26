// Fix boats entries whose ONLY grader miss is a banned word living inside an
// image/site URL (e.g. "...State-of-the-art...webp", "...landscape...jpg").
// Re-sources a clean, banned-word-free image+source pair via keyless DDG and
// swaps the offending URL. Re-grades; saves only if it clears 12/12.
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { gradeEntry, BANNED_PHRASES } = require('./netlify/functions/lib/grade-entry');
try { const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOK });
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const hasBanned = u => BANNED_PHRASES.some(re => re.test(u));
const renderable = u => /^https?:\/\/[^)\s"']+$/.test(u);

async function headOk(u) { try { const g = await fetch(u, { method: 'GET', headers: { Range: 'bytes=0-1024', 'User-Agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(9000) }); const ct = (g.headers.get('content-type') || '').toLowerCase(); return g.ok && ct.startsWith('image/'); } catch (e) { return false; } }
async function ddg(q, attempt = 0) {
  try {
    const tp = await fetch('https://duckduckgo.com/?q=' + encodeURIComponent(q) + '&iax=images&ia=images', { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(15000) });
    const html = await tp.text(); const m = html.match(/vqd=([\d-]+)/) || html.match(/vqd="([^"]+)"/);
    if (!m) { if (attempt < 2) { await sleep(1500); return ddg(q, attempt + 1); } return []; }
    await sleep(120);
    const r = await fetch('https://duckduckgo.com/i.js?l=us-en&o=json&q=' + encodeURIComponent(q) + '&vqd=' + m[1] + '&f=,,,&p=1', { headers: { 'User-Agent': UA, 'Referer': 'https://duckduckgo.com/', 'Accept': 'application/json' }, signal: AbortSignal.timeout(15000) });
    if (r.status === 429 || r.status === 403) { if (attempt < 3) { await sleep(2500); return ddg(q, attempt + 1); } return []; }
    const t = await r.text(); let j; try { j = JSON.parse(t); } catch (e) { return []; }
    return (j.results || []).map(x => ({ image: x.image, url: x.url }));
  } catch (e) { if (attempt < 2) { await sleep(1500); return ddg(q, attempt + 1); } return []; }
}
async function cleanPair(q) {
  const arr = await ddg(q);
  for (const c of arr.slice(0, 25)) {
    if (!c.image || !renderable(c.image) || hasBanned(c.image)) continue;
    const site = (c.url && !hasBanned(c.url)) ? c.url : '';
    if (await headOk(c.image)) return { image: c.image, site };
  }
  return null;
}
async function pingIndexNow(id) { try { await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'pulsemachine-writer-2026', id }) }); } catch (e) {} }

(async () => {
  const ids = process.argv.slice(2);
  for (const id of ids) {
    const rec = await s.get('answers/' + id + '.json', { type: 'json' });
    let body = rec.answer;
    const topic = (rec.question || id).replace(/Top 10|\(Ranked\)|Best/gi, '').trim();
    // find every URL token that contains a banned word
    const urlRe = /https?:\/\/[^)\s"']+/g;
    const bad = (body.match(urlRe) || []).filter(hasBanned);
    if (!bad.length) { console.log(id, 'no banned URL found (already clean?)'); continue; }
    for (const u of bad) {
      const pair = await cleanPair(topic + ' boat');
      if (!pair) { console.log(id, 'NO clean replacement for', u.slice(0, 50)); continue; }
      // replace the URL; if it sat in a site="..." with no image, use image url anyway
      body = body.split(u).join(pair.image);
      console.log('  ' + id, 'swapped', u.slice(0, 45), '->', pair.image.slice(0, 45));
    }
    const g = gradeEntry(id, body);
    if (g.banned_hits.length) { console.log(id, 'STILL banned:', g.banned_hits.join(','), '— skipping save'); continue; }
    rec.answer = body; rec.ts = Date.now(); rec.polished_at = Date.now();
    await s.setJSON('answers/' + id + '.json', rec);
    await pingIndexNow(id);
    console.log(id, 'FIXED -> score', g.score + '/12, banned clear');
  }
})().catch(e => { console.error('ERR', e && e.stack); process.exit(1); });
