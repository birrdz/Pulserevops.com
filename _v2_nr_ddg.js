// _v2_nr_ddg.js — DDG lane(s) for needs-review entries only (_v2_needs_review.json).
// Default NR_DDG_LANES=1 (one instance). Round-robin split when NLANES>1. Prepends cover image when missing.
// tl (CRO) skipped — curated cro-cover rotation. Watchdog: _v2_supervisor.js
// stop: _v2_nr_ddg_stop.flag · log: _v2_nr_ddg.out.log
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');
const WD = process.env.PULSE_ROOT || __dirname;
const ENV_FILE = path.join(WD, '.env.local');
if (fs.existsSync(ENV_FILE)) {
  for (const l of fs.readFileSync(ENV_FILE, 'utf8').split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
const STOP = WD + '/_v2_nr_ddg_stop.flag';
const NR = WD + '/_v2_needs_review.json';
const LOG = WD + '/_v2_nr_ddg.out.log';
const LANE = parseInt(process.env.NR_DDG_LANE || process.env.LANE || '1', 10);
const NLANES = parseInt(process.env.NR_DDG_LANES || '1', 10);
const SKIP_PILLARS = new Set(['tl']);   // CRO uses curated cards, not generic DDG
const SUFFIX = { bs: 'book cover', sp: 'portrait' };
const PACE_MS = parseInt(process.env.NR_DDG_PACE_MS || '800', 10);
const IDLE_MS = parseInt(process.env.NR_DDG_IDLE_MS || '45000', 10);
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const logln = s => { const line = new Date().toISOString() + ` [nrddg${LANE}] ` + s; try { fs.appendFileSync(LOG, line + '\n'); } catch (e) {} console.log(line); };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const pillarOf = id => (String(id).match(/^[a-z]+/) || [''])[0];
const readArr = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return []; } };
const hasTopImage = b => /!\[[^\]]*\]\([^)]+\)/.test(String(b || '').slice(0, 1200));

function queryFrom(q, suf) {
  let t = String(q || '');
  t = t.replace(/\s*[—-]\s*Cliff Notes.*$/i, '').replace(/\s*[—-]\s*(Text|Key Passages|Summary).*$/i, '');
  t = t.replace(/\bin 20\d\d\b/gi, '').replace(/\b20\d\d\b/g, '').replace(/[?.!]+$/,'').trim();
  return (t + (suf ? (' ' + suf) : '')).trim();
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
    if (!m) { if (attempt < 2) { await sleep(1500 + attempt * 1500); return ddgImages(q, attempt + 1); } return []; }
    await sleep(120);
    const r = await fetch('https://duckduckgo.com/i.js?l=us-en&o=json&q=' + encodeURIComponent(q) + '&vqd=' + m[1] + '&f=,,,&p=1', { headers: { 'User-Agent': UA, Referer: 'https://duckduckgo.com/', Accept: 'application/json' }, signal: AbortSignal.timeout(15000) });
    if (r.status === 429 || r.status === 403) { if (attempt < 3) { await sleep(2500 + attempt * 2500); return ddgImages(q, attempt + 1); } return []; }
    let j; try { j = JSON.parse(await r.text()); } catch (e) { if (attempt < 2) { await sleep(2000); return ddgImages(q, attempt + 1); } return []; }
    return (j.results || []).map(x => ({ image: x.image }));
  } catch (e) { if (attempt < 2) { await sleep(1500); return ddgImages(q, attempt + 1); } return []; }
}

async function pickImage(q) {
  const arr = await ddgImages(q);
  for (const c of arr.slice(0, 20)) { if (c.image && await headOk(c.image)) return c.image; }
  return '';
}

async function fixCover(id, title) {
  const p = pillarOf(id);
  if (SKIP_PILLARS.has(p)) return 'skip-tl';
  const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
  if (!e || !e.answer) return 'no-blob';
  if (hasTopImage(e.answer)) return 'has-img';
  const lead = e.answer.match(/^﻿?\s*!\[[^\]]*\]\(([^)]+)\)/);
  const isPoll = lead && /pollinations\.ai/i.test(lead[1]);
  if (lead && !isPoll) return 'has-img';
  const img = await pickImage(queryFrom(title, SUFFIX[p] || ''));
  if (!img) return 'no-ddg';
  let body = e.answer.replace(/^﻿/, '');
  if (lead) body = body.replace(/^﻿?\s*!\[[^\]]*\]\([^)]+\)\s*\n*/, '');
  const alt = String(title).replace(/[\[\]"]/g, '').slice(0, 70);
  body = `![${alt}](${img})\n\n` + body.trimStart();
  await store.setJSON('answers/' + id + '.json', Object.assign({}, e, { answer: body, cover_upgraded: isPoll || e.cover_upgraded, updated_at: new Date().toISOString() }));
  return 'fixed';
}

module.exports = { fixCover, hasTopImage, pillarOf, queryFrom, pickImage, ddgImages };

if (require.main === module) (async () => {
  logln(`up — needs-review DDG lane ${LANE}/${NLANES}`);
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' }).catch(() => ({ entries: [] }));
  const titleOf = Object.fromEntries((idx.entries || []).filter(e => e && e.id).map(e => [e.id, e.question]));
  let fixed = 0;
  while (!fs.existsSync(STOP)) {
    const ids = readArr(NR);
    const mine = ids.filter((_, i) => i % NLANES === (LANE - 1));
    if (!mine.length) { logln('idle — no needs-review ids for this lane'); await sleep(IDLE_MS); continue; }
    logln(`pass — ${mine.length} needs-review ids (lane ${LANE})`);
    let passFixed = 0;
    for (const id of mine) {
      if (fs.existsSync(STOP)) break;
      try {
        const r = await fixCover(id, titleOf[id] || id);
        if (r === 'fixed') { passFixed++; fixed++; logln(`+cover ${id} (total ${fixed})`); }
      } catch (e) { logln(`ERR ${id} ${String(e.message).slice(0, 80)}`); }
      if (PACE_MS) await sleep(PACE_MS);
    }
    logln(`pass done — fixed ${passFixed} covers`);
    await sleep(8000);
  }
  logln('stop flag — exiting');
})().catch(e => { logln('FATAL ' + e.message); process.exit(1); });
