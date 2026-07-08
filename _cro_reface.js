// _cro_reface — replace the bad shared CRO covers on tl (Chief Revenue Officer) Q&As with UNIQUE,
// varied images (owner 2026-07-02: "poll & ddg find new better ones, wide variety, no dupes").
// For each tl entry whose hero is a shared cro-cover / generic / flaky-flux / missing: alternate
// DDG real photo <-> Pollinations flux, topical to THAT question, verify it renders, and DEDUPE
// (skip a URL already used this shard). Blob-only — the index backfill re-stamps img from the blob.
// Sharded: node _cro_reface.js SHARD SHARDS.  Stop: _cro_reface_stop.flag
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
let searchRealPhoto = null; try { ({ searchRealPhoto } = require('./netlify/functions/lib/img-search-lib')); } catch (e) {}
const SHARD = parseInt(process.argv[2] || '0', 10), SHARDS = parseInt(process.argv[3] || '1', 10);
const CONC = parseInt(process.env.CRO_CONC || '2', 10), PACE = parseInt(process.env.CRO_PACE || '500', 10);
// a "bad" hero we must replace: shared cover / placeholder / flaky flux / none
const BAD = /\/assets\/cro-cover-\d|placeholder|og-preview|pulse-og|no-?image|pollinations/i;
const firstImage = b => { const m = String(b || '').slice(0, 1200).match(/!\[[^\]]*\]\(([^)\s]+)/); return m ? m[1] : null; };
function fluxCover(title) {
  const prompt = ('high quality editorial photograph illustrating ' + String(title).slice(0, 100) + ', revenue operations, business leadership, modern office, realistic magazine style, warm light, no text, no watermark, no words').slice(0, 320);
  let h = 0; for (const c of String(title)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return 'https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt) + '?width=1200&height=675&nologo=true&model=flux&seed=' + (h % 100000);
}
async function loads(u) { try { const r = await fetch(u, { signal: AbortSignal.timeout(45000) }); return r.ok && (r.headers.get('content-type') || '').startsWith('image'); } catch (e) { return false; } }
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  let ids = (idx.entries || []).filter(e => e && /^tl\d+$/.test(e.id)).map(e => e.id).filter((_, n) => n % SHARDS === SHARD);
  console.log('[cro-reface] shard ' + SHARD + '/' + SHARDS + ' · ' + ids.length + ' tl entries');
  const used = new Set();               // dedupe within this shard
  let qi = 0, refaced = 0, ddg = 0, flux = 0, kept = 0, skip = 0, done = 0;
  async function pickDdg(q, id) { if (!searchRealPhoto) return null; try { const pk = await searchRealPhoto(q, id, { skipRefine: true, suffix: 'business office' }); if (pk && pk.img && !used.has(pk.img) && await loads(pk.img)) return pk.img; } catch (e) {} return null; }
  async function pickFlux(q) { const c = fluxCover(q); if (!used.has(c) && await loads(c)) return c; return null; }
  async function worker() {
    while (qi < ids.length) {
      if (fs.existsSync(WD + '/_cro_reface_stop.flag')) return;
      const id = ids[qi++];
      try {
        const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
        if (e && e.answer) {
          const hero = firstImage(e.answer);
          if (hero && !BAD.test(hero)) { kept++; }         // already a unique real photo — leave it
          else {
            const q = e.question || id;
            // alternate DDG <-> flux for variety; fall back to the other; dedupe
            let url = (done % 2 === 0) ? (await pickDdg(q, id)) || (await pickFlux(q)) : (await pickFlux(q)) || (await pickDdg(q, id));
            if (url) {
              used.add(url); if (/pollinations/i.test(url)) flux++; else ddg++;
              const alt = String(q).replace(/[\[\]"]/g, '').slice(0, 80);
              const body = '![' + alt + '](' + url + ')\n\n' + String(e.answer).replace(/^﻿?\s*!\[[^\]]*\]\([^)]*\)\s*\n*/, '');
              await store.setJSON('answers/' + id + '.json', Object.assign({}, e, { answer: body, cro_refaced: true, face_verified: true, face_real: !/pollinations/i.test(url), face_at: new Date().toISOString() }));
              refaced++;
            } else { skip++; }
          }
        }
      } catch (x) {}
      if (++done % 50 === 0) console.log('[cro-reface] s' + SHARD + ' ' + done + '/' + ids.length + ' · refaced=' + refaced + ' (ddg=' + ddg + ' flux=' + flux + ') kept=' + kept + ' skip=' + skip);
      await sleep(PACE);
    }
  }
  await Promise.all(Array.from({ length: CONC }, () => worker()));
  console.log('[cro-reface] s' + SHARD + ' DONE · refaced=' + refaced + ' ddg=' + ddg + ' flux=' + flux + ' kept=' + kept + ' skip=' + skip);
})().catch(e => { console.log('[cro-reface] FATAL', e && e.message); process.exit(1); });
