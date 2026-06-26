// Post-publish image pipeline for aq0051–aq0200.
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

const single = process.argv.find((a) => /^aq\d+$/.test(a));
const queue = single
  ? [{ id: single }]
  : JSON.parse(fs.readFileSync('C:/Users/koryj/_aq_sprint150.json', 'utf8'));

const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';

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
    const j = JSON.parse(await r.text());
    return (j.results || []).map((x) => ({ image: x.image, url: x.url }));
  } catch (e) { if (attempt < 3) { await sleep(1500); return ddgImages(q, attempt + 1); } return []; }
}

async function addCover(id, title) {
  const rec = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!rec || !rec.answer) return { id, cover: 'skip-no-body' };
  if (/^﻿?\s*!\[/.test(rec.answer)) return { id, cover: 'skip-has-cover' };
  let q = String(title || rec.question || id).replace(/[?.!]+$/, '').trim().slice(0, 100);
  const arr = await ddgImages(q + ' aquarium');
  let img = '';
  for (const c of arr.slice(0, 10)) { if (c.image && await headOk(c.image)) { img = c.image; break; } }
  if (!img) return { id, cover: 'fail-no-img' };
  rec.answer = '![Cover image for ' + q.replace(/[\[\]]/g, '') + '](' + img + ')\n\n' + rec.answer.replace(/^﻿/, '');
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
      row.cards = run(`node _build_cards.js ${id} aquarium`).trim().slice(0, 200);
      row.insert = run(`node _insert_cards.js ${id}`).trim();
      const titleEsc = title.replace(/"/g, '\\"');
      row.republish = run(`node _write_aq.js ${id} "${titleEsc}" ${item.slug || ''} --force`).trim().slice(0, 200);
      await sleep(800);
      row.cover = (await addCover(id, title)).cover;
      results.push(row);
      console.log(JSON.stringify(row));
      await sleep(1200);
    } catch (e) {
      row.err = String(e.message || e).slice(0, 300);
      results.push(row);
      console.error('FAIL', id, row.err);
    }
  }
  fs.writeFileSync('C:/Users/koryj/_aq_sprint150_finish_report.json', JSON.stringify(results, null, 1));
  console.log(`\nDONE ${results.filter((r) => !r.err).length}/${queue.length}`);
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
