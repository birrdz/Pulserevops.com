// Image pass for text-first entries (LAW: text first via DeepSeek, images after
// via Anthropic/Claude). Finds every images_pending entry, runs the cost-optimized
// image pipeline (topic cache -> DDG/Serper -> Pollinations -> Grok -> Anthropic
// -> Gemini), republishes the body WITH images, and clears the pending flag.
// Resumable. Usage: node _ds_image_pass.js [--parallel=2] [--limit=N]
const fs = require('fs');
const path = require('path');
const { loadEnv } = require('./netlify/functions/lib/load-env');
loadEnv(path.join(__dirname));
const { getStore } = require('@netlify/blobs');
const { ensureImages } = require('./netlify/functions/lib/ensure-entry-images');

const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const PAR = parseInt(arg('parallel', '2'), 10);
const LIMIT = parseInt(arg('limit', '0'), 10);
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const LOG = 'C:/Users/koryj/website/_ds_image_pass.log';
const PROG = 'C:/Users/koryj/website/_ds_image_pass_progress.json';
const STOP = 'C:/Users/koryj/website/_ds_image_stop.flag';
const log = (s) => { const l = `${new Date().toISOString().slice(11, 19)} ${s}`; fs.appendFileSync(LOG, l + '\n'); console.log(l); };
const EMAIL = 'https://pulserevops.com/.netlify/functions/pulse-progress-notify?key=pulsemachine-writer-2026';
const email = async (s, h) => { try { await fetch(EMAIL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject: s, html: h }) }); } catch (e) {} };

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const idx = await store.get('_index.json', { type: 'json' });
  const prog = fs.existsSync(PROG) ? JSON.parse(fs.readFileSync(PROG, 'utf8')) : { done: [] };
  const doneSet = new Set(prog.done);
  let pending = (idx.entries || []).filter((e) => e && e.images_pending && !doneSet.has(e.id)).map((e) => e.id);
  if (LIMIT > 0) pending = pending.slice(0, LIMIT);

  const total = pending.length;
  log(`START image-pass — ${total} entries, parallel ${PAR}`);
  await email('PULSE image pass START', `<p>Filling images for <b>${total}</b> text-first entries via the image pipeline (DDG/Pollinations first, Anthropic fallback).</p>`);

  let done = 0, fail = 0, qi = 0, lastEmail = Date.now();
  async function worker(w) {
    while (qi < pending.length) {
      if (fs.existsSync(STOP)) { log(`worker ${w} stop flag`); return; }
      const id = pending[qi++];
      try {
        const entry = await store.get(`answers/${id}.json`, { type: 'json' });
        if (!entry) { log(`SKIP ${id} no blob`); continue; }
        const img = await ensureImages(id, entry.question || '', entry.answer || '');
        const compliant = img && img.audit && img.audit.compliant;
        entry.answer = (img && img.body) || entry.answer;
        if (compliant) { entry.images_pending = false; delete entry.images_deferred_at; }
        entry.images_done_at = Date.now();
        await store.setJSON(`answers/${id}.json`, entry);
        // update index row flag
        const row = (idx.entries || []).find((e) => e && e.id === id);
        if (row && compliant) { delete row.images_pending; }
        if (compliant) { done++; prog.done.push(id); } else { fail++; log(`PARTIAL ${id} not fully compliant: ${(img.audit && img.audit.needs || []).join(',')}`); prog.done.push(id); }
        fs.writeFileSync(PROG, JSON.stringify(prog, null, 2));
        log(`${compliant ? 'OK' : 'PART'} ${id} (${done}/${total})`);
      } catch (e) { fail++; log(`ERR ${id} ${e.message}`); }
      if (Date.now() - lastEmail >= 15 * 60 * 1000) { lastEmail = Date.now(); await store.setJSON('_index.json', idx); await email(`PULSE image pass — ${done}/${total}`, `<p>Images done <b>${done}</b>, partial/failed ${fail}, remaining ${total - qi}.</p>`); }
    }
  }
  await Promise.all(Array.from({ length: PAR }, (_, w) => worker(w)));
  await store.setJSON('_index.json', idx); // persist cleared flags
  log(`DONE image-pass done=${done} fail=${fail}`);
  await email('PULSE image pass COMPLETE', `<p>Images filled for <b>${done}</b> entries (${fail} partial/failed). Text-first entries now have covers + product cards.</p>`);
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
