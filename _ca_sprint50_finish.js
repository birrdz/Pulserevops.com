// Post-publish image pipeline for ca0924–ca0973 (sprint 50).
// LAW (from _TOP10_PRODUCT_SPEC.md + _img_cover_all.js):
//   1) Every Top-10 entry needs 10 @@PRODUCT img= cards (Serper method).
//   2) Every entry needs a leading cover markdown image at the top.
//
// Usage:
//   node _ca_sprint50_finish.js              # all 50 ids from _ca_sprint50.json
//   node _ca_sprint50_finish.js ca0924       # single id
//   node _ca_sprint50_finish.js --cards-only # skip cover backfill
const fs = require('fs');
const { execSync } = require('child_process');
const { getStore } = require('@netlify/blobs');

try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const CARDS_ONLY = process.argv.includes('--cards-only');
const single = process.argv.find(a => /^ca\d+$/.test(a));
const queue = single
  ? [{ id: single }]
  : JSON.parse(fs.readFileSync('C:/Users/koryj/_ca_sprint50.json', 'utf8'));

const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOK });
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function headOk(url) {
  try {
    const r = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(9000) });
    const ct = (r.headers.get('content-type') || '').toLowerCase();
    if (r.ok && ct.startsWith('image/')) return true;
    const g = await fetch(url, { method: 'GET', headers: { Range: 'bytes=0-1024', 'User-Agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(9000) });
    return g.ok && (g.headers.get('content-type') || '').toLowerCase().startsWith('image/');
  } catch (e) { return false; }
}

async function ddgImages(q, attempt = 0) {
  try {
    const tp = await fetch('https://duckduckgo.com/?q=' + encodeURIComponent(q) + '&iax=images&ia=images', { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(15000) });
    const html = await tp.text();
    const m = html.match(/vqd=([\d-]+)/) || html.match(/vqd="([^"]+)"/);
    if (!m) { if (attempt < 3) { await sleep(1500); return ddgImages(q, attempt + 1); } return []; }
    await sleep(120);
    const r = await fetch('https://duckduckgo.com/i.js?l=us-en&o=json&q=' + encodeURIComponent(q) + '&vqd=' + m[1] + '&f=,,,&p=1', { headers: { 'User-Agent': UA, Referer: 'https://duckduckgo.com/', Accept: 'application/json' }, signal: AbortSignal.timeout(15000) });
    if (r.status === 429) { if (attempt < 4) { await sleep(3000); return ddgImages(q, attempt + 1); } return []; }
    const j = JSON.parse(await r.text());
    return (j.results || []).map(x => ({ image: x.image, url: x.url }));
  } catch (e) { if (attempt < 3) { await sleep(1500); return ddgImages(q, attempt + 1); } return []; }
}

async function addCover(id, title) {
  const rec = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!rec || !rec.answer) return { id, cover: 'skip-no-body' };
  if (/^﻿?\s*!\[/.test(rec.answer)) return { id, cover: 'skip-has-cover' };
  let q = String(title || rec.question || id).replace(/\s*[—-]\s*Best Overall.*$/i, '').replace(/[?.!]+$/, '').trim().slice(0, 100);
  const arr = await ddgImages(q + ' car');
  let img = '';
  for (const c of arr.slice(0, 10)) { if (c.image && await headOk(c.image)) { img = c.image; break; } }
  if (!img) return { id, cover: 'fail-no-img' };
  rec.answer = rec.answer.replace(/^﻿/, '');
  rec.answer = '![Cover image for ' + q.replace(/[\[\]]/g, '') + '](' + img + ')\n\n' + rec.answer;
  rec.ts = Date.now();
  await store.setJSON('answers/' + id + '.json', rec);
  try {
    await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'pulsemachine-writer-2026', id }), signal: AbortSignal.timeout(8000) });
  } catch (e) {}
  return { id, cover: 'ok' };
}

function run(cmd) {
  return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], cwd: 'C:/Users/koryj/website' });
}

(async () => {
  const results = [];
  for (const item of queue) {
    const id = item.id;
    const title = item.title || '';
    const row = { id, cards: null, insert: null, republish: null, cover: null };
    try {
      // Step 1: Serper cards from live blob
      const buildOut = run(`node _build_cards.js ${id} car`);
      row.cards = buildOut.trim().slice(0, 200);
      // Step 2: insert @@PRODUCT lines into local md
      const insOut = run(`node _insert_cards.js ${id}`);
      row.insert = insOut.trim();
      // Step 3: republish with --force (body file restored by _build_cards)
      const titleEsc = title.replace(/"/g, '\\"');
      const slug = item.slug || '';
      const pubOut = run(`node _write_ca.js ${id} "${titleEsc}" ${slug} --force`);
      row.republish = pubOut.trim().slice(0, 200);
      // Step 4: cover image (unless --cards-only)
      if (!CARDS_ONLY) {
        await sleep(800);
        const cov = await addCover(id, title);
        row.cover = cov.cover;
      }
      results.push(row);
      console.log(JSON.stringify(row));
      await sleep(1200);
    } catch (e) {
      row.err = String(e.message || e).slice(0, 300);
      if (e.stdout) row.stdout = String(e.stdout).slice(0, 200);
      if (e.stderr) row.stderr = String(e.stderr).slice(0, 200);
      results.push(row);
      console.error('FAIL', id, row.err);
    }
  }
  const out = 'C:/Users/koryj/_ca_sprint50_finish_report.json';
  fs.writeFileSync(out, JSON.stringify(results, null, 1));
  const ok = results.filter(r => !r.err).length;
  console.log(`\nDONE ${ok}/${queue.length} | report: ${out}`);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
