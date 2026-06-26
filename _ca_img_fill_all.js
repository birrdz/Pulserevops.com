// Fill missing images for ALL ca#### entries (11-image LAW).
//   1 cover markdown image + 10 @@PRODUCT img= cards per Top-10.
//
// Usage:
//   node _ca_img_fill_all.js              # audit-driven fill (all weak entries)
//   node _ca_img_fill_all.js --cover-only # covers only
//   node _ca_img_fill_all.js ca0924       # single id
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

const COVER_ONLY = process.argv.includes('--cover-only');
const single = process.argv.find(a => /^ca\d+$/.test(a));
const ROOT = 'C:/Users/koryj/website';
const AUDIT = 'C:/Users/koryj/website/_ca_img_audit.json';
const PROG = 'C:/Users/koryj/website/_ca_img_fill_progress.json';

const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
const sleep = ms => new Promise(r => setTimeout(r, ms));

function run(cmd) {
  return execSync(cmd, { encoding: 'utf8', cwd: ROOT, stdio: ['pipe', 'pipe', 'pipe'] });
}

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
  if (!rec || !rec.answer) return 'skip-no-body';
  if (/^﻿?\s*!\[/.test(rec.answer)) return 'skip-has-cover';
  let q = String(title || rec.question || id).replace(/\s*[—-]\s*Best Overall.*$/i, '').replace(/[?.!]+$/, '').trim().slice(0, 100);
  const arr = await ddgImages(q + ' car');
  let img = '';
  for (const c of arr.slice(0, 12)) { if (c.image && await headOk(c.image)) { img = c.image; break; } }
  if (!img) return 'fail-no-img';
  rec.answer = rec.answer.replace(/^﻿/, '');
  rec.answer = '![Cover image for ' + q.replace(/[\[\]]/g, '') + '](' + img + ')\n\n' + rec.answer;
  rec.ts = Date.now();
  await store.setJSON('answers/' + id + '.json', rec);
  try {
    await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'pulsemachine-writer-2026', id }), signal: AbortSignal.timeout(8000) });
  } catch (e) {}
  return 'ok';
}

async function fullCards(id, title) {
  const titleEsc = String(title || '').replace(/"/g, '\\"');
  run(`node _build_cards.js ${id} car`);
  // _build_cards strips @@PRODUCT; insert fresh lines
  const md = `C:/Users/koryj/${id}_answer.md`;
  let body = fs.readFileSync(md, 'utf8');
  if (!body.includes('@@PRODUCT')) {
    run(`node _insert_cards.js ${id}`);
    body = fs.readFileSync(md, 'utf8');
  }
  // If insert aborted (partial @@PRODUCT left), strip and re-insert
  if ((body.match(/^@@PRODUCT/gm) || []).length < 5) {
    body = body.split(/\r?\n/).filter(l => !/^@@PRODUCT/.test(l)).join('\n');
    fs.writeFileSync(md, body);
    run(`node _insert_cards.js ${id}`);
  }
  run(`node _write_ca.js ${id} "${titleEsc}" --force`);
  return 'ok';
}

(async () => {
  let queue = [];
  if (single) {
    const e = await store.get('answers/' + single + '.json', { type: 'json' });
    queue = [{ id: single, question: e && e.question }];
  } else if (fs.existsSync(AUDIT)) {
    const a = JSON.parse(fs.readFileSync(AUDIT, 'utf8'));
    const seen = new Set();
    for (const id of a.needCover || []) {
      if (!seen.has(id)) { seen.add(id); queue.push({ id, needCover: true }); }
    }
    for (const row of a.needFull || []) {
      if (!seen.has(row.id)) { seen.add(row.id); queue.push({ id: row.id, question: row.question, needFull: true }); }
      else {
        const q = queue.find(x => x.id === row.id);
        if (q) { q.needFull = true; q.question = q.question || row.question; }
      }
    }
    for (const row of a.needStraggler || []) {
      if (!seen.has(row.id)) { seen.add(row.id); queue.push({ id: row.id, needStraggler: true }); }
      else {
        const q = queue.find(x => x.id === row.id);
        if (q) q.needStraggler = true;
      }
    }
  } else {
    console.error('Run node _ca_img_audit.js first');
    process.exit(1);
  }

  console.log('queue:', queue.length);
  const results = [];
  let i = 0;
  for (const item of queue) {
    i++;
    const row = { id: item.id, cover: null, cards: null, straggler: null };
    try {
      if (!COVER_ONLY && item.needFull) {
        row.cards = await fullCards(item.id, item.question);
        await sleep(1000);
      } else if (!COVER_ONLY && item.needStraggler) {
        run(`node _ca_fix_stragglers.js ${item.id}`);
        row.straggler = 'ok';
        await sleep(600);
      }
      if (item.needCover || COVER_ONLY) {
        row.cover = await addCover(item.id, item.question);
        await sleep(800);
      } else if (!item.needCover) {
        const e = await store.get('answers/' + item.id + '.json', { type: 'json' });
        if (e && e.answer && !/^﻿?\s*!\[/.test(e.answer)) {
          row.cover = await addCover(item.id, item.question || (e && e.question));
        }
      }
      results.push(row);
      console.log(`[${i}/${queue.length}]`, JSON.stringify(row));
      if (i % 10 === 0) fs.writeFileSync(PROG, JSON.stringify({ done: i, total: queue.length, results: results.slice(-20) }, null, 1));
    } catch (e) {
      row.err = String(e.message || e).slice(0, 300);
      if (e.stderr) row.stderr = String(e.stderr).slice(0, 200);
      results.push(row);
      console.error('FAIL', item.id, row.err);
    }
  }
  fs.writeFileSync('C:/Users/koryj/website/_ca_img_fill_report.json', JSON.stringify(results, null, 1));
  console.log('DONE', results.length);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
