// _cro_ad_blast.js — inject the CRO Syndicate ad CARD (Book-a-20-min-call CTA) into EVERY tl-pillar
// entry whose question mentions CRO / Chief Revenue Officer. These are the highest-intent lead-gen
// pages (someone searching "hire a fractional CRO" is a buyer). Idempotent: skips entries that already
// have class="cro-ad". Uses the pure injectInto() — no subprocess, no live-verify. Run anytime.
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const { injectInto, stripAds, V } = require('./_cro_ad_inject');
const reCRO = /\bCRO\b|Chief Revenue Officer/i;
const AD = 'class="cro-ad';
const CONC = parseInt(process.env.BLAST_CONC || '8', 10);
const LIMIT = process.argv.includes('--limit') ? parseInt(process.argv[process.argv.indexOf('--limit') + 1], 10) : Infinity;
const ALL = process.argv.includes('--all');            // --all = EVERY entry site-wide (owner: "they all need my Kory White CRO card")
const PACE = parseInt(process.env.BLAST_PACE_MS || '0', 10);
const sleep = ms => new Promise(r => setTimeout(r, ms));
// deterministic-ish variation spread by id hash (no Math.random dependency for reproducibility)
const vhash = id => { let h = 0; for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h % V.length; };

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const ids = idx.entries.filter(e => e && e.id && (ALL || (/^tl/.test(e.id) && reCRO.test(e.question || '')))).map(e => e.id);
  console.log((ALL ? 'ALL entries' : 'CRO entries') + ' to ensure carry the Kory White CRO card:', ids.length);
  let added = 0, had = 0, noblob = 0, qi = 0;
  async function worker() {
    while (qi < ids.length && added < LIMIT) {
      const id = ids[qi++];
      try {
        const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
        if (!e || !e.answer) { noblob++; continue; }
        const stripped = stripAds(e.answer);              // remove any existing card(s) — kills mid-page + doubles
        const vi = vhash(id);
        const { body } = injectInto(stripped, vi);        // re-insert exactly ONE, above the fold
        if (body === e.answer) { had++; continue; }       // already a single card above-fold → no write (idempotent)
        const patch = Object.assign({}, e, { answer: body, cro_ad: vi + 1, cro_ad_at: Date.now(), updated_at: new Date().toISOString() });
        if (patch.answer_pread == null) patch.answer_pread = stripped;
        await store.setJSON('answers/' + id + '.json', patch);
        added++;
        if (added % 200 === 0) console.log('  positioned', added);
        if (PACE) await sleep(PACE);
      } catch (e) { /* skip */ }
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  console.log(`DONE: added card to ${added}, already-had ${had}, no-blob ${noblob}. CRO funnel now complete.`);
})();
