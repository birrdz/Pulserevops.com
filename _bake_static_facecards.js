// _bake_static_facecards.js — STATIC_IMAGE_LAW baker (owner/Fable 2026-07-15).
// Face-card images must be baked STATIC files at assets/qa/<id>.jpg (no runtime blob-reader/function).
// Walks the index, finds entries MISSING that static file, and bakes one from the best source:
//   1) local assets/qa/<id>.sq.jpg (square variant)  2) the entry's img-field local asset (topic image)
//   3) download the live photo from prod (https://pulserevops.com/assets/qa/<id>.jpg)
//   4) fall back to the pillar's topic image so it always renders (never a 404).
// Serial · resume-safe (skips ids already in the receipt ledger) · one receipt per entry.
'use strict';
const fs = require('fs');
const path = require('path');
const https = require('https');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

const QA = WD + '/assets/qa';
const BK = WD + '/sim/baker';
fs.mkdirSync(BK, { recursive: true });
const LEDGER = BK + '/receipts.md';
const LOCK = BK + '/lock';
const PROD = 'https://pulserevops.com/assets/qa/';
const pOf = id => (String(id).match(/^([a-z]+)\d/i) || [, ''])[1].toLowerCase();

function doneSet() {
  const s = new Set();
  try { for (const line of fs.readFileSync(LEDGER, 'utf8').split('\n')) { const m = line.match(/·\s*([a-z]+\d[a-z0-9]*)\s*·/i); if (m) s.add(m[1].toLowerCase()); } } catch (e) {}
  return s;
}
function receipt(id, source, bytes, note) {
  const line = `- ${new Date().toISOString()} · ${id} · ${source} · ${bytes}B${note ? ' · ' + note : ''}\n`;
  if (!fs.existsSync(LEDGER)) fs.writeFileSync(LEDGER, '# BAKER RECEIPTS — one line per baked static face card. Append-only.\n\n');
  fs.appendFileSync(LEDGER, line);
}
function dl(url) {
  return new Promise((resolve) => {
    https.get(url, res => {
      if (res.statusCode !== 200) { res.resume(); return resolve(null); }
      const ct = res.headers['content-type'] || '';
      if (!/image\//i.test(ct)) { res.resume(); return resolve(null); }
      const chunks = []; res.on('data', d => chunks.push(d)); res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', () => resolve(null));
  });
}

(async () => {
  if (fs.existsSync(LOCK)) { console.log('[baker] lock present — another run active. exit.'); process.exit(0); }
  fs.writeFileSync(LOCK, String(process.pid));
  const cleanup = () => { try { fs.unlinkSync(LOCK); } catch (e) {} };
  process.on('exit', cleanup); process.on('SIGINT', () => { cleanup(); process.exit(1); });
  try {
    const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    const es = (idx.entries || []).filter(e => e && e.id && !/^vq_/i.test(String(e.id)));

    // pillar -> topic image path (from the topic-interim entries) for the last-resort fallback
    const pillarTopic = {};
    for (const e of es) { const im = String(e.img || ''); if (im.startsWith('/assets/topics/')) { const p = pOf(e.id); if (!pillarTopic[p] && fs.existsSync(WD + im)) pillarTopic[p] = WD + im; } }

    const done = doneSet();
    const work = es.filter(e => !fs.existsSync(QA + '/' + e.id + '.jpg') && !done.has(e.id.toLowerCase()));
    console.log('[baker] worklist:', work.length, '(missing static, not yet baked)');

    let baked = 0, byProd = 0, byTopic = 0, bySq = 0, byImgField = 0, failed = 0;
    for (let i = 0; i < work.length; i++) {
      const e = work[i]; const id = e.id; const dst = QA + '/' + id + '.jpg';
      let buf = null, source = null;
      // 1) local .sq variant
      if (fs.existsSync(QA + '/' + id + '.sq.jpg')) { buf = fs.readFileSync(QA + '/' + id + '.sq.jpg'); source = 'local-sq'; bySq++; }
      // 2) img-field local asset (topic image, etc.)
      if (!buf) { const im = String(e.img || ''); if (im.startsWith('/assets/') && fs.existsSync(WD + im)) { buf = fs.readFileSync(WD + im); source = 'img-field'; byImgField++; } }
      // 3) live photo from prod (the real image that renders today)
      if (!buf) { const got = await dl(PROD + id + '.jpg'); if (got && got.length > 500) { buf = got; source = 'prod-download'; byProd++; } }
      // 4) pillar topic image fallback — always render, never 404
      if (!buf) { const t = pillarTopic[pOf(id)]; if (t && fs.existsSync(t)) { buf = fs.readFileSync(t); source = 'topic-fallback'; byTopic++; } }

      if (!buf || buf.length < 500) { failed++; receipt(id, 'FAILED-no-source', 0, e.cover_src || ''); continue; }
      fs.writeFileSync(dst, buf);
      baked++; receipt(id, source, buf.length, e.cover_src || '');
      if (baked % 20 === 0) console.log(`[baker] ${baked}/${work.length} baked…`);
    }
    console.log(`[baker] DONE — baked ${baked} · failed ${failed}  (prod-dl ${byProd} · topic-fallback ${byTopic} · sq ${bySq} · img-field ${byImgField})`);
  } finally { cleanup(); }
})().catch(e => { console.log('[baker] ERROR', e.message); try { fs.unlinkSync(LOCK); } catch (_) {} process.exit(1); });
