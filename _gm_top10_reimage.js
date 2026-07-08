// _gm_top10_reimage.js — fix Top-10 rank images that DON'T MATCH the title (owner 2026-07-08).
// SPEC: CLAUDE_CODE_PEXELS_IMAGE_RUN.md › "SPEC PATCH — IMAGE RELEVANCE GATE".
// Deterministic fallback chain, relevance gate at each step, NEVER DDG, NEVER random alternation:
//   Pexels(derived)→gate → Pexels retry(core terms)→gate → Pixabay(core)→gate → Pollinations(generated).
// For the GAMING pillar every Top-10 slot is a SPECIFIC game TITLE (e.g. "Elden Ring"): stock providers
// cannot serve specific titles, and generic tokens ("ring") would FALSE-POSITIVE the gate — so title slots
// deterministically resolve to Pollinations (the chain's designated safety net: prompt-driven → always on-topic),
// skipping the guaranteed-fallthrough Pexels/Pixabay calls to protect the shared 200/hr Pexels budget + Cursor.
// Overwrites the existing /assets/qa/<id>-1NN.jpg slot file (blob img path already points there → deploy pushes it).
// Pillar-parameterized (PILLAR env, default gm). PILOT=<id> processes a single page. Resume-safe via done file.
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const { makeContent } = require('./_img_flux_lib');   // Pollinations (flux) — slug-derived seed, self-hosts slot file
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const store = getStore({ name: 'pulse-machine-library', siteID: SITE, token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const PILLAR = (process.env.PILLAR || 'gm').toLowerCase();
const PILOT = process.env.PILOT ? process.env.PILOT.toLowerCase() : '';
const PILLAR_CONTEXT = { gm: 'video game key art, promotional game artwork' };
const DONE_F = WD + '/_' + PILLAR + '_reimage_done.json';
const REPORT_F = WD + '/_' + PILLAR + '_reimage_report.json';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const loadDone = () => { try { return new Set(JSON.parse(fs.readFileSync(DONE_F, 'utf8'))); } catch (e) { return new Set(); } };
const saveDone = s => { try { fs.writeFileSync(DONE_F, JSON.stringify([...s])); } catch (e) {} };

function cleanName(name) { return String(name || '').replace(/[\[\]"?🏆💎]/g, '').replace(/\s+/g, ' ').trim(); }

// Pollinations generate for one slot. makeContent builds a flux prompt from the alt + pillar context and
// self-hosts /assets/qa/<id>-<slot>.jpg with a slug-derived deterministic seed. Returns rel path or null.
async function pollinateSlot(id, rank, name) {
  const ctx = PILLAR_CONTEXT[PILLAR] || 'editorial photograph';
  const alt = (cleanName(name) + ' — ' + ctx).slice(0, 180);
  try {
    const loc = await Promise.race([
      makeContent(id, 100 + rank, alt),
      new Promise(r => setTimeout(() => r(null), 90000)),   // hard cap so one slot can't stall the batch
    ]);
    return loc || null;
  } catch (e) { return null; }
}

async function processPage(id) {
  const e = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!e || !e.answer) return { id, skip: 'no-blob' };
  const lines = String(e.answer).split('\n');
  const slots = [];
  let rank = 0;
  for (let i = 0; i < lines.length; i++) {
    const h = lines[i].match(/^##\s+(\d+)\.\s+(.+)$/); if (h) { rank = parseInt(h[1], 10); continue; }
    const pm = lines[i].match(/^@@PRODUCT\s+name="([^"]*)"/);
    if (pm && rank >= 1 && rank <= 10) slots.push({ rank, name: pm[1] });
  }
  if (!slots.length) return { id, skip: 'no-top10' };
  const results = [];
  for (const sl of slots) {
    // GAMING: specific title → Pollinations directly (stock can't serve, tokens false-positive the gate).
    const rel = await pollinateSlot(id, sl.rank, sl.name);
    results.push({
      rank: sl.rank, name: sl.name,
      status: rel ? 'ok' : 'MISS',
      chain_step: 'pollinations', gate: 'fallthrough', gate_version: 2,
    });
    if (!rel) { try { fs.appendFileSync(WD + '/image_run_misses.log', new Date().toISOString() + ' ' + id + '-' + sl.rank + ' "' + cleanName(sl.name) + '" pollinations-fail\n'); } catch (x) {} }
  }
  return { id, results };
}

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  let pages = (idx.entries || []).filter(e => e && new RegExp('^' + PILLAR + '\\d+$', 'i').test(String(e.id)));
  pages.sort((a, b) => String(a.id).localeCompare(String(b.id), undefined, { numeric: true }));
  if (PILOT) pages = pages.filter(p => String(p.id).toLowerCase() === PILOT);
  const done = loadDone();
  const report = (() => { try { return JSON.parse(fs.readFileSync(REPORT_F, 'utf8')); } catch (e) { return {}; } })();
  console.log('[' + PILLAR + '-reimage] ' + pages.length + ' pages · ' + done.size + ' done · chain=Pexels→Pixabay→Pollinations (NO DDG) · gaming title slots→Pollinations' + (PILOT ? ' · PILOT ' + PILOT : ''));
  for (const p of pages) {
    const id = String(p.id).toLowerCase();
    if (!PILOT && done.has(id)) continue;
    try {
      const r = await processPage(id);
      if (r.skip) { console.log('[' + PILLAR + '-reimage] ⏭ ' + id + ' ' + r.skip); continue; }
      const okN = r.results.filter(x => x.status === 'ok').length;
      const miss = r.results.filter(x => x.status !== 'ok').map(x => x.rank + ':' + x.name);
      report[id] = r.results; fs.writeFileSync(REPORT_F, JSON.stringify(report, null, 1));
      console.log('[' + PILLAR + '-reimage] ' + (okN === r.results.length ? '✅' : '⚠') + ' ' + id + ' ' + okN + '/' + r.results.length + ' (pollinations)' + (miss.length ? ' MISS=' + JSON.stringify(miss) : ''));
      for (const x of r.results) console.log('    ' + x.rank + '. ' + cleanName(x.name).padEnd(28).slice(0, 28) + ' ' + x.chain_step + '/' + x.gate + ' ' + x.status);
      if (okN === r.results.length && !PILOT) { done.add(id); saveDone(done); }
    } catch (x) { console.log('[' + PILLAR + '-reimage] ✖ ' + id + ' ' + (x && x.message)); }
  }
  console.log('[' + PILLAR + '-reimage] DONE');
})().catch(e => { console.error('FATAL', e && e.message, e && e.stack); process.exit(1); });
