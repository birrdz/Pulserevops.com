// _master_scrub.js — LINEAR, PILLAR-BY-PILLAR execution of SCRUBBER_SPEC.md.
// Single job at a time (one writer to the pHash registry — zero dedupe races). Drives the proven
// /scrub-one endpoint (full 13/13 rubric + auto-publish gate + DDG dedupe covers). Smallest pillars
// first. 48/batch. Checkpoints CSV + PROGRESS.md + resume file after every batch (resumable, idempotent).
// Pillar close-out report + 20% circuit breaker. Launch: node _master_scrub.js   Stop: Ctrl-C (resumes).
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const KEY = '4444', BASE = 'http://localhost:8899';
const QUEUE = WD + '/_scrub_button_queue.json';
const CSV = WD + '/_master_scrub.csv';
const PROG = WD + '/PROGRESS.md';
const RESUME = WD + '/_master_resume.json';
const STATUS = WD + '/_master_status.json';   // structured live state for dashboard.html
const REG_F = WD + '/_img_registry.json';
const BATCH = 48, CB_PCT = 0.20;   // circuit breaker: a criterion failing >20% of a pillar's pages = systematic defect
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const NM = { tl: 'CRO & Tools', ca: 'Cars', bt: 'Boats', aq: 'Aquariums', ik: 'Industry KPIs', tk: 'Tech Stacks', bs: 'Book Summaries', st: 'Sales Trainings', fr: 'Franchises', co: 'Collectibles', ai: 'AI Infra', gb: 'Graphics', bo: 'Buildouts', sy: 'Style', cr: 'Crabbing', fs: 'Fishing', gp: 'GTM', ra: 'Rev Arch', pt: 'Pets', es: 'Espresso', tv: 'TVs', rs: 'Resorts', cl: 'Cologne', lv: 'Luxury Travel', ev: 'Events', ga: 'Gatherings', gm: 'Gaming', mv: 'Movies', wl: 'Wellness', dr: 'Drills', dn: 'Dining', nl: 'Nightlife', tn: 'Towns', sc: 'Schools', tc: 'Telco', er: 'Electronics', ce: 'Pulse News', q: 'Knowledge', ed: 'Advice', sw: 'Software', hf: 'Home & Family' };
const pof = id => (String(id).match(/^[a-z]+/) || [''])[0];
const readJ = (p, d) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return d; } };
const writeJ = (p, o) => { try { fs.writeFileSync(p, JSON.stringify(o)); } catch (e) {} };
const csvQ = s => '"' + String(s == null ? '' : s).replace(/"/g, '""') + '"';

async function scrubOne() {
  const r = await fetch(BASE + '/scrub-one', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: KEY }), signal: AbortSignal.timeout(600000) });
  return r.json();
}

function regSize() { try { return (JSON.parse(fs.readFileSync(REG_F, 'utf8')).entries || []).length; } catch (e) { return 0; } }
function writeStatus(order, statusMap, tally, live) {
  const pillars = order.map(p => Object.assign({ code: p.code, name: NM[p.code] || p.code, n: p.n }, statusMap[p.code] || { state: 'NOT STARTED' }, tally[p.code] || {}));
  writeJ(STATUS, { updated: new Date().toISOString(), pillars, live: live || null, registrySize: regSize() });
}
function writeProgress(order, statusMap) {
  let md = '# PULSE Master Scrub — PROGRESS\n\n> Linear, pillar-by-pillar. Auto-updated after every batch.\n\n| Pillar | Pages | Status |\n|---|---|---|\n';
  for (const p of order) { const s = statusMap[p.code] || { state: 'NOT STARTED' }; md += `| ${p.code} ${NM[p.code] || ''} | ${p.n} | ${s.state}${s.summary ? ' — ' + s.summary : ''} |\n`; }
  try { fs.writeFileSync(PROG, md); } catch (e) {}
}

(async () => {
  // pillar order: smallest first, REAL pillars only (skip malformed/junk id-prefixes)
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const byP = {};
  for (const e of (idx.entries || [])) { if (!e || !e.id || /^vq_/i.test(e.id)) continue; const p = pof(e.id); if (!NM[p]) continue; (byP[p] = byP[p] || []).push(e.id); }
  let order = Object.keys(byP).map(code => ({ code, n: byP[code].length, ids: byP[code] })).sort((a, b) => a.n - b.n);
  if (process.env.SMOKE) {   // SMOKE=N: run only N pages of the smallest real pillar, then exit (Fable's pre-launch proof)
    const n = parseInt(process.env.SMOKE, 10) || 10;
    order = [Object.assign({}, order[0], { ids: order[0].ids.slice(0, n), n: Math.min(n, order[0].n) })];
    console.log('🔬 SMOKE MODE — ' + order[0].code + ' ' + order[0].n + ' pages only\n');
  }

  console.log('=== MASTER SCRUB — LINEAR, SMALLEST PILLAR FIRST ===');
  console.log('code  pillar               pages  batches');
  order.forEach(p => console.log(p.code.padEnd(5), (NM[p.code] || p.code).padEnd(19), String(p.n).padStart(6), String(Math.ceil(p.n / BATCH)).padStart(5)));
  console.log('TOTAL:', order.reduce((a, p) => a + p.n, 0), 'pages\n');

  const resume = readJ(RESUME, { donePillars: [], pillarProgress: {} });
  const statusMap = {};
  order.forEach(p => { statusMap[p.code] = resume.donePillars.includes(p.code) ? { state: 'DONE' } : { state: 'NOT STARTED' }; });
  if (!fs.existsSync(CSV)) fs.writeFileSync(CSV, 'url,rubric_score,failed_criteria,image_flags,action_taken\n');
  const tally = {};
  writeProgress(order, statusMap); writeStatus(order, statusMap, tally, null);

  for (const pillar of order) {
    if (resume.donePillars.includes(pillar.code)) { console.log('skip', pillar.code, '(done)'); continue; }
    const done = new Set((resume.pillarProgress[pillar.code] || {}).done || []);
    const todo = pillar.ids.filter(id => !done.has(id));
    const totalBatches = Math.ceil(pillar.ids.length / BATCH);
    const failCounts = {}; let passed = 0, held = 0, dupes = 0;
    statusMap[pillar.code] = { state: 'IN PROGRESS' };
    // isolate this pillar in the red queue so /scrub-one only pulls from it (single writer, linear)
    writeJ(QUEUE, todo.slice());
    let batchIdx = Math.floor(done.size / BATCH);
    for (let i = 0; i < todo.length; i += BATCH) {
      const batch = todo.slice(i, i + BATCH);
      writeJ(QUEUE, batch.slice());
      for (let k = 0; k < batch.length; k++) {
        let res; try { res = await scrubOne(); } catch (e) { res = { status: 'error', msg: e.message }; }
        const id = res.id || batch[k];
        const score = res.score != null ? res.score : '';
        const action = res.status === 'certified' ? 'auto-published' : (res.status === 'requeue' ? 're-scrub' : res.status);
        if (res.status === 'certified') passed++; else if (res.status === 'requeue' || res.status === 'parked') held++;
        (res.failedCriteria || []).forEach(c => { failCounts[c] = (failCounts[c] || 0) + 1; });   // heatmap + 20% breaker
        const flags = res.msg && /IMAGE_|dedup|dupe/i.test(res.msg) ? res.msg.slice(0, 40) : '';
        if (/dedup|dupe/i.test(res.msg || '')) dupes++;
        fs.appendFileSync(CSV, [csvQ('/knowledge/' + id), csvQ(score), csvQ((res.failedCriteria || []).join('|')), csvQ(flags), csvQ(action)].join(',') + '\n');
        done.add(id);
      }
      batchIdx++;
      resume.pillarProgress[pillar.code] = { done: [...done] };
      writeJ(RESUME, resume);
      statusMap[pillar.code] = { state: `IN PROGRESS batch ${batchIdx}/${totalBatches}` };
      tally[pillar.code] = { done: done.size, passed, held, dupes, batch: batchIdx, totalBatches, failCounts };
      writeProgress(order, statusMap);
      writeStatus(order, statusMap, tally, { pillar: pillar.code, batch: batchIdx, totalBatches, passed, fixed: 0, held, dupes });
      console.log(`[${pillar.code}] batch ${batchIdx}/${totalBatches} | passed ${passed} | held ${held} | dupes rejected ${dupes}`);
    }
    // pillar close-out + 20% circuit breaker
    const worst = Object.entries(failCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const summary = `passed ${passed}/${pillar.n}, held ${held}, dupes ${dupes}`;
    tally[pillar.code] = { done: done.size, passed, held, dupes, batch: totalBatches, totalBatches, failCounts };
    const cbHit = worst.find(([, c]) => c / pillar.n > CB_PCT);
    statusMap[pillar.code] = cbHit ? { state: 'STOPPED-PATTERN', summary, breaker: 'criterion ' + cbHit[0] } : { state: 'DONE', summary };
    if (!cbHit) resume.donePillars.push(pillar.code);
    writeJ(RESUME, resume); writeProgress(order, statusMap); writeStatus(order, statusMap, tally, null);
    console.log(`\n=== PILLAR ${pillar.code} CLOSE-OUT — ${summary} ===`);
    if (cbHit) { console.log(`🛑 CIRCUIT BREAKER: criterion ${cbHit[0]} failed on ${Math.round(cbHit[1] / pillar.n * 100)}% of ${pillar.code} — systematic defect. STOPPING before next pillar.`); process.exit(2); }
  }
  console.log('\n✅ MASTER SCRUB COMPLETE — all pillars 13/13 or held. See PROGRESS.md + _master_scrub.csv');
})().catch(e => { console.error('[master-scrub] FATAL', e.message); process.exit(1); });
