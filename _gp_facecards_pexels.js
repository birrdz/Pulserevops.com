// _gp_facecards_pexels.js — GTM (gp) face cards = RELEVANT Pexels photos matched to each entry's industry
// (owner 2026-07-10: construction entry -> construction workers, hospital -> doctors, etc.). Derives a query
// from each title, caches per query (cheap on the Pexels limit), falls back to generic business/work photos.
'use strict';
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const flib = require('./_ddg_facecard_lib');
const PEXELS = process.env.PEXELS_API_KEY;
const DONE_F = WD + '/_gp_facecards_pexels_done.json';
const sleep = ms => new Promise(r => setTimeout(r, ms));

// derive the industry/subject from a gp title, then a Pexels query that yields people-at-work / relevant photos
const STOP = /\b(the|complete|operating|operator|playbook|guide|strategy|gtm|go[- ]to[- ]market|for|in|2027|2026|and|of|a|an|to|with|your|how|what|is|best|top|\d+)\b/gi;
function deriveQuery(title) {
  let t = String(title || '');
  let m = t.match(/playbook for (.+?)(?:\s+in\s+20\d\d|\s*[—\-:?]|$)/i) || t.match(/for (.+?)(?:\s+in\s+20\d\d|\s*[—\-:?]|$)/i);
  let subject = m ? m[1] : '';
  subject = subject.replace(STOP, ' ').replace(/[^a-z0-9 ]/gi, ' ').replace(/\s+/g, ' ').trim();
  if (subject && subject.split(' ').length <= 5 && subject.length > 2) return subject + ' professionals at work';
  return null; // motion/abstract -> generic
}
const GENERIC = ['business team meeting office', 'people working modern office', 'professionals collaborating work', 'coworkers working desks', 'office building city', 'busy restaurant staff', 'startup team laptops working'];
const cache = new Map();
async function photosFor(q) {
  if (cache.has(q)) return cache.get(q);
  let out = [];
  try {
    const r = await fetch('https://api.pexels.com/v1/search?per_page=15&orientation=landscape&query=' + encodeURIComponent(q), { headers: { Authorization: PEXELS }, signal: AbortSignal.timeout(30000) });
    if (r.ok) { const j = await r.json(); if ((j.total_results || 0) >= 3) out = (j.photos || []).filter(p => p.width >= 1200).map(p => p.src.large2x || p.src.large || p.src.original); }
  } catch (e) {}
  cache.set(q, out); await sleep(1600); // throttle unique API calls (cached ones are free)
  return out;
}
async function main() {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const gp = (idx.entries || []).filter(e => e && e.id && /^gp\d/i.test(String(e.id)));
  const done = (() => { try { return new Set(JSON.parse(fs.readFileSync(DONE_F, 'utf8'))); } catch (e) { return new Set(); } })();
  console.log('[gp-pexels] gp entries=' + gp.length + '  alreadyDone=' + done.size);
  let n = 0, fail = 0, gi = 0;
  for (const e of gp) {
    const id = String(e.id);
    if (done.has(id)) continue;
    const title = e.question || e.title || '';
    const dq = deriveQuery(title);
    let urls = dq ? await photosFor(dq) : [];
    if (!urls.length) urls = await photosFor(GENERIC[gi++ % GENERIC.length]);   // relevant → else generic business
    if (!urls.length) { fail++; continue; }
    const seed = [...id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0);
    const url = urls[seed % urls.length];
    try {
      const ir = await fetch(url, { signal: AbortSignal.timeout(30000) }); if (!ir.ok) { fail++; continue; }
      const buf = Buffer.from(await ir.arrayBuffer());
      await flib.gradeFaceCardFromBuffer(buf, flib.coverPath(id), { question: title });
      try { const cur = await store.get('answers/' + id + '.json', { type: 'json' }); if (cur) await store.setJSON('answers/' + id + '.json', Object.assign({}, cur, { cover_src: 'pexels-business' })); } catch (z) {}
      e.img = '/assets/qa/' + id + '.jpg'; e.cover_src = 'pexels-business';
      done.add(id); n++;
      if (n % 20 === 0) { fs.writeFileSync(DONE_F, JSON.stringify([...done])); try { await store.setJSON('_index.json', idx); } catch (z) {} process.stdout.write('\r[gp-pexels] ' + n + '/' + gp.length + '  q="' + (dq || 'generic') + '"'); }
    } catch (x) { fail++; }
  }
  fs.writeFileSync(DONE_F, JSON.stringify([...done]));
  try { await store.setJSON('_index.json', idx); } catch (z) {}
  console.log('\n[gp-pexels] DONE covered=' + n + ' failed=' + fail + ' uniqueQueries=' + cache.size);
}
main().catch(e => { console.error('[gp-pexels] FATAL', e.message); process.exit(1); });
