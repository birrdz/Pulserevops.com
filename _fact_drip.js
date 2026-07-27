'use strict';
/**
 * _fact_drip.js — FACT-CHECK rewrite drip (owner 2026-07-26).
 * DeepSeek only. Rewrites pages that invented venues/stats. Starts with Vegas nightlife nl0137.
 *
 * Usage:
 *   node _fact_drip.js              # process queue (default seed + _fact_drip_queue.json)
 *   node _fact_drip.js nl0137 tv0183
 *   FACT_DRY=1 node _fact_drip.js   # rewrite + score, do NOT publish
 *
 * Stop: create _fact_drip_stop.flag
 */
'use strict';
const fs = require('fs');
const path = require('path');
const WD = __dirname;
try {
  for (const l of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

process.env.WRITER_ENGINE = 'deepseek'; // never CC
const { getStore } = require('@netlify/blobs');
const { runDeepSeek, unfence, gateScore } = require('./new/improve_content');
const { publishContentBody } = require('./new/publish_core');

const QUEUEF = path.join(WD, '_fact_drip_queue.json');
const DONEF = path.join(WD, '_fact_drip_done.json');
const LOGF = path.join(WD, '_fact_drip.out.log');
const STOPF = path.join(WD, '_fact_drip_stop.flag');
const DRY = process.env.FACT_DRY === '1';
const FOREVER = process.argv.includes('--forever') || process.env.FACT_FOREVER === '1';
const SEED = ['nl0137']; // proven fabricated Vegas nightlife
const RESCAN_MS = parseInt(process.env.FACT_RESCAN_MS || String(20 * 60 * 1000), 10);

function log(m) {
  const line = new Date().toISOString() + ' ' + m;
  console.log(line);
  try { fs.appendFileSync(LOGF, line + '\n'); } catch (e) {}
}
function loadQ() { try { return JSON.parse(fs.readFileSync(QUEUEF, 'utf8')); } catch (e) { return []; } }
function saveQ(a) { fs.writeFileSync(QUEUEF, JSON.stringify(a, null, 0)); }
function loadDone() { try { return new Set(JSON.parse(fs.readFileSync(DONEF, 'utf8'))); } catch (e) { return new Set(); } }
function addDone(id) {
  const d = [...loadDone()];
  if (!d.includes(id)) { d.push(id); fs.writeFileSync(DONEF, JSON.stringify(d)); }
}
function theStore() {
  return getStore({
    name: 'pulse-machine-library',
    siteID: process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN,
  });
}

// Heuristic: Top-10 nightlife/travel pages that invent hall/garden venue names
function looksFabricated(title, body) {
  const t = String(title || '');
  const b = String(body || '');
  if (/Meridian Hall|Atlas Hall|Onyx Las Hall|Jade Hall|Sapphire Hall|Copper Las|Ivory at Las Vegas|Las Vegas Crimson|Las Vegas Golden/i.test(b)) return true;
  if (/nightlife|nightclub|bars? in|resorts? in|hotels? in/i.test(t) && /\b\w+ Hall\b/.test(b) && !/Caesars|Bellagio|Wynn|MGM|Palms|Resorts World|Sphere|Tao|Omnia|Hakkasan|XS\b|Marquee|Zouk|LIV\b/i.test(b)) return true;
  return false;
}

function buildFactPrompt(question, body) {
  return [
    'You are FACT-CHECKING and REWRITING a live knowledge page. The draft is UNTRUSTWORTHY.',
    'Many names, venues, stats, and rankings may be INVENTED. Do not preserve fake entities.',
    '',
    'QUESTION: ' + question,
    '',
    'HARD RULES:',
    '1. ZERO fabrication. Only real, currently operating places / schools / products you are confident exist.',
    '2. For Las Vegas nightlife: use REAL venues (e.g. XS, Omnia, Hakkasan, Tao, Marquee, Jewel, Zouk, LIV, Encore Beach Club, etc.) — NEVER invent "Hall" / "Atlas" / "Meridian" style names.',
    '3. If you are not sure a place exists, OMIT it. Prefer fewer real items over 10 fake ones.',
    '4. No invented prices, % stats, or "Best of 2027" awards unless widely reported — stay qualitative if unsure.',
    '5. Sources: 5+ real external URLs that plausibly support the page (official sites, Eater, Time Out, VisitLasVegas, etc.). No random HBR/McKinsey homepages for nightlife.',
    '6. Output the LOCKED Q&A / Top-10 markdown shape matching the question type. Include ## Direct Answer first, exactly 2 mermaid diagrams in content sections, ## FAQ (5+), ## Sources (5+), ## Related on PULSE.',
    '7. Output ONLY the finished markdown body — no preamble.',
    '',
    '--- UNTRUSTED DRAFT (mine structure only; discard invented names) ---',
    String(body || '').slice(0, 50000),
  ].join('\n');
}

async function processOne(id) {
  if (fs.existsSync(STOPF)) return { ok: false, stop: true };
  const store = theStore();
  let blob = null;
  try { blob = await store.get('answers/' + id + '.json', { type: 'json', consistency: 'strong' }); } catch (e) {}
  if (!blob) { log(id + ' MISSING'); return { ok: false }; }
  const title = blob.question || blob.h1 || id;
  const before = String(blob.answer || '');
  const g0 = gateScore({ body: before, question: title });
  log(id + ' start · was ' + g0.score + '/13 · fabricatedHeuristic=' + looksFabricated(title, before));

  const prompt = buildFactPrompt(title, before);
  const r = runDeepSeek(prompt, 360000);
  if (!r.ok) { log(id + ' writer FAIL ' + r.err); return { ok: false, err: r.err }; }
  const body = unfence(r.text);
  const g1 = gateScore({ body, question: title });
  if (looksFabricated(title, body)) {
    log(id + ' REJECT still looks fabricated after rewrite · ' + g1.score + '/13');
    return { ok: false, err: 'still fabricated' };
  }
  if (g1.score < 12) {
    log(id + ' REJECT gate ' + g1.score + '/13 fails=' + (g1.fails || []).map(f => f.name).join(','));
    return { ok: false, err: 'gate ' + g1.score };
  }
  if (DRY) {
    log(id + ' DRY ok would publish ' + g1.score + '/13 (' + g1.wordCount + 'w)');
    return { ok: true, dry: true, after: g1.score };
  }
  await publishContentBody(id, body);
  // stamp fact-clean + clear flag on blob
  try {
    const store = theStore();
    const fresh = await store.get('answers/' + id + '.json', { type: 'json', consistency: 'strong' });
    if (fresh) {
      fresh.fact_flagged = false;
      fresh.fact_clean = true;
      fresh.fact_clean_at = Date.now();
      fresh.fact_clean_by = 'fact_drip';
      await store.setJSON('answers/' + id + '.json', fresh);
    }
  } catch (e) {}
  addDone(id);
  log(id + ' PUBLISHED fact-clean ' + g1.score + '/13 · https://pulserevops.com/knowledge/' + id);
  return { ok: true, after: g1.score };
}

async function refillQueueFromScan() {
  // Pull flagged ledger + under12 nightlife/travel/toplists not yet done
  const done = loadDone();
  let q = loadQ();
  const have = new Set(q);
  try {
    const rep = JSON.parse(fs.readFileSync(path.join(WD, '_fact_flagged.json'), 'utf8'));
    for (const it of (rep.items || [])) {
      if (it && it.id && !done.has(it.id) && !have.has(it.id)) { q.push(it.id); have.add(it.id); }
    }
  } catch (e) {}
  try {
    const inv = JSON.parse(fs.readFileSync(path.join(WD, '_under12_inventory.json'), 'utf8'));
    for (const id of (inv.ids || [])) {
      if (!id || done.has(id) || have.has(id)) continue;
      // prioritize high-risk pillars for fact rewrite
      if (/^(nl|tv|rs|dn|tn|sc|cl|lv|ev|ca|fr|aq|sy)/i.test(id)) { q.push(id); have.add(id); }
    }
  } catch (e) {}
  try {
    const idx = await theStore().get('_index.json', { type: 'json', consistency: 'strong' });
    for (const e of (idx.entries || [])) {
      if (!e || !e.id || done.has(e.id) || have.has(e.id)) continue;
      const t = String(e.question || e.title || '');
      if (/vegas/i.test(t) && /nightlife|nightclub|bar|resort|hotel/i.test(t)) {
        q.push(e.id); have.add(e.id);
      }
    }
  } catch (e) {}
  saveQ(q);
  return q.length;
}

async function main() {
  try { fs.unlinkSync(STOPF); } catch (e) {}
  const argvIds = process.argv.slice(2).filter(x => /^[a-z]+\d+/i.test(x));
  let q = loadQ();
  for (const id of SEED.concat(argvIds)) if (!q.includes(id)) q.push(id);
  if (q.length < 20) await refillQueueFromScan();
  saveQ(q);
  const done = loadDone();
  log('FACT DRIP start · queue=' + q.length + ' dry=' + DRY + ' forever=' + FOREVER + ' engine=deepseek');

  do {
    q = loadQ();
    while (q.length) {
      if (fs.existsSync(STOPF)) { log('STOP flag — exiting'); return; }
      const id = q.shift();
      saveQ(q);
      if (done.has(id)) { log(id + ' skip done'); continue; }
      try {
        await processOne(id);
        done.add(id);
      } catch (e) {
        log(id + ' ERR ' + ((e && e.message) || e));
      }
      await new Promise(r => setTimeout(r, 1500));
    }
    if (!FOREVER) break;
    log('FACT DRIP queue empty — rescanning inventory in ' + Math.round(RESCAN_MS / 1000) + 's');
    await new Promise(r => setTimeout(r, RESCAN_MS));
    if (fs.existsSync(STOPF)) break;
    const n = await refillQueueFromScan();
    log('FACT DRIP refilled queue=' + n);
  } while (FOREVER && !fs.existsSync(STOPF));

  log('FACT DRIP idle');
}

main().catch(e => { log('FATAL ' + e); process.exit(1); });
