// _image_scrub.js — Fable v2 IMAGE-ONLY scrub. Alternate DDG ↔ Pollinator covers + DDG sections.
// Launch: node _image_scrub.js   PILLAR=gp (one pillar)   PILLARS=gp,gm,ga (custom order)
// Smoke: SMOKE=10   PICK_SCOPE=covers (picker) | none (auto, default)
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const CSV = WD + '/_image_scrub.csv', STATUS = WD + '/_image_status.json', RESUME = WD + '/_image_resume.json', SAMPLES = WD + '/_image_samples.json', REG_F = WD + '/_img_registry.json', PID_F = WD + '/_image_scrub.pid';
const BATCH = 48, CB_WINDOW = 100, CB_PCT = 0.20;
const PICK_SCOPE = process.env.PICK_SCOPE || 'none';   // covers | all | none
const PICK_WAIT = process.env.PICK_WAIT !== '0';
const IMAGE_SCRUB_PILLAR = process.env.PILLAR || process.env.PILLARS || process.env.IMAGE_SCRUB_PILLAR || '';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const { ensureAlternateFaceCover, faceCardCoverOk, coverFileOk, coverPath, ensureDdgSectionImage, auditImage, backfillRegistry, verifyGradeStamp } = require('./_ddg_facecard_lib');
const { resolveCoverViaPicker } = require('./_image_picker_lib');
const DDG_PACE = parseInt(process.env.DDG_PACE_MS || '12000', 10);
const ddgPace = () => new Promise(r => setTimeout(r, DDG_PACE));
const NM = { tl: 'CRO & Tools', ca: 'Cars', bt: 'Boats', aq: 'Aquariums', ik: 'Industry KPIs', tk: 'Tech Stacks', bs: 'Book Summaries', st: 'Sales Trainings', fr: 'Franchises', co: 'Collectibles', ai: 'AI Infra', gb: 'Graphics', bo: 'Buildouts', sy: 'Style', cr: 'Crabbing', fs: 'Fishing', gp: 'GTM', ra: 'Rev Arch', pt: 'Pets', es: 'Espresso', tv: 'TVs', rs: 'Resorts', cl: 'Cologne', lv: 'Luxury Travel', ev: 'Events', ga: 'Gatherings', gm: 'Gaming', mv: 'Movies', wl: 'Wellness', dr: 'Drills', dn: 'Dining', nl: 'Nightlife', tn: 'Towns', sc: 'Schools', tc: 'Telco', er: 'Electronics', ce: 'Pulse News', q: 'Knowledge', ed: 'Advice', sw: 'Software', hf: 'Home & Family' };
const pof = id => (String(id).match(/^[a-z]+/) || [''])[0];
const readJ = (p, d) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return d; } };
const writeJ = (p, o) => { try { fs.writeFileSync(p, JSON.stringify(o)); } catch (e) {} };
const csvQ = s => '"' + String(s == null ? '' : s).replace(/"/g, '""') + '"';
const regSize = () => { try { return (JSON.parse(fs.readFileSync(REG_F, 'utf8')).entries || []).length; } catch (e) { return 0; } };
const stripHead = s => String(s).replace(/^#{2,3}\s+/, '').replace(/[\[\]"]/g, '').trim();
let phWindow = [];
let samples = readJ(SAMPLES, []);
let runStats = { fetched: 0, graded: 0, dedupedRejected: 0, placeholderHits: 0, gradeMissing: 0 };

function pushSample(id, oldUrl, newUrl) { samples.unshift({ id, old: oldUrl, neu: newUrl }); samples = samples.slice(0, 6); writeJ(SAMPLES, samples); }
function bumpStats(s) { if (!s) return; runStats.fetched += s.fetched || 0; runStats.graded += s.graded || 0; runStats.dedupedRejected += s.dedupedRejected || 0; runStats.placeholderHits += s.placeholderHits || 0; }

async function scrubCover(id, question, pillar, e) {
  if (faceCardCoverOk(id, e.cover_src) && coverFileOk(id) && await verifyGradeStamp(coverPath(id))) return { fixed: 0, skipped: 1, unresolved: 0, flags: [] };
  if (coverFileOk(id) && !(await verifyGradeStamp(coverPath(id)))) { runStats.gradeMissing++; return { fixed: 0, skipped: 0, unresolved: 1, flags: ['GRADE_MISSING'] }; }
  let ok = false;
  if (PICK_SCOPE === 'covers' && PICK_WAIT) {
    const r = await resolveCoverViaPicker(id, question, pillar, store, {});
    bumpStats(r.stats);
    ok = r.ok;
  } else {
    const src = await ensureAlternateFaceCover(id, question, store, e.cover_src);
    ok = faceCardCoverOk(id, src) && coverFileOk(id) && await verifyGradeStamp(coverPath(id));
    if (coverFileOk(id) && !ok) runStats.gradeMissing++;
  }
  if (ok) { await ddgPace(); return { fixed: 1, skipped: 0, unresolved: 0, flags: [] }; }
  return { fixed: 0, skipped: 0, unresolved: 1, flags: ['UNRESOLVED'] };
}

async function scrubPageImages(id, question, coverSrc) {
  let e; try { e = await store.get('answers/' + id + '.json', { type: 'json' }); } catch (x) { return { flags: ['DEAD'], total: 0, fixed: 0, skipped: 0, unresolved: 1 }; }
  if (!e || !e.answer) return { flags: [], total: 0, fixed: 0, skipped: 0, unresolved: 0 };
  const srcTag = coverSrc || e.cover_src || null;
  let body = e.answer, changed = false;
  const flags = new Set(); let total = 0, fixed = 0, skipped = 0, unresolved = 0;
  const pillar = pof(id);
  const cr = await scrubCover(id, question, pillar, { cover_src: srcTag });
  fixed += cr.fixed; skipped += cr.skipped; unresolved += cr.unresolved; cr.flags.forEach(f => flags.add(f));
  if (cr.fixed) phWindow.push(1); else if (cr.unresolved) phWindow.push(0);
  total++;
  const lines = body.split('\n');
  let heroSeen = false, si = -1;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/!\[([^\]]*)\]\(([^)\s]+)\)/);
    if (!m) continue;
    if (!heroSeen) { heroSeen = true; continue; }
    si++; total++;
    const url = m[2];
    const a = await auditImage(url, id);
    if (a.pass) { skipped++; continue; }
    flags.add(a.flag || 'STANDARD');
    if (a.flag === 'GRADE_MISSING') runStats.gradeMissing++;
    let sect = '';
    for (let j = i - 1; j >= 0; j--) { if (/^#{2,3}\s/.test(lines[j])) { sect = lines[j]; break; } }
    const secText = (stripHead(sect) + ' ' + String(question).replace(/[\[\]"?]/g, '').trim()).trim();
    let local = null;
    try { local = await ensureDdgSectionImage(id, si, secText); runStats.fetched++; if (local) runStats.graded++; } catch (x) {}
    if (local && await verifyGradeStamp(WD + local)) {
      const cap = m[1] || (String(question).slice(0, 66) + ' — ' + stripHead(sect).slice(0, 56));
      lines[i] = '![' + cap + '](' + local + ')'; changed = true; fixed++; phWindow.push(1); pushSample(id, url, local); await ddgPace();
    } else {
      unresolved++; flags.add('UNRESOLVED'); phWindow.push(0);
      if (local && !(await verifyGradeStamp(WD + local))) { flags.add('GRADE_MISSING'); runStats.gradeMissing++; }
    }
    if (phWindow.length > CB_WINDOW) phWindow = phWindow.slice(-CB_WINDOW);
  }
  if (changed) { try { await store.setJSON('answers/' + id + '.json', Object.assign({}, e, { answer: lines.join('\n'), updated_at: new Date().toISOString() })); } catch (x) {} }
  return { flags: [...flags], total, fixed, skipped, unresolved };
}

function writeStatus(allOrder, statusMap, tally, live) {
  const pillars = allOrder.map(p => Object.assign({ code: p.code, name: NM[p.code] || p.code, n: p.n }, statusMap[p.code] || { state: 'NOT STARTED' }, tally[p.code] || {}));
  writeJ(STATUS, { updated: new Date().toISOString(), pillars, live: live || null, registrySize: regSize(), samples, pickScope: PICK_SCOPE, runStats });
}

(async () => {
  try { fs.writeFileSync(PID_F, String(process.pid)); } catch (e) {}
  const cleanup = () => { try { fs.unlinkSync(PID_F); } catch (e) {} };
  process.on('exit', cleanup);
  process.on('SIGINT', () => { cleanup(); process.exit(0); });
  process.on('SIGTERM', () => { cleanup(); process.exit(0); });
  await backfillRegistry();
  try { fs.unlinkSync(WD + '/_image_scrub_stop.flag'); } catch (e) {}
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const byP = {}; const titleOf = {}; const coverSrcOf = {};
  for (const en of (idx.entries || [])) { if (!en || !en.id || /^vq_/i.test(en.id)) continue; const p = pof(en.id); if (!NM[p]) continue; (byP[p] = byP[p] || []).push(en.id); titleOf[en.id] = en.question || en.id; coverSrcOf[en.id] = en.cover_src || null; }
  const allOrder = Object.keys(byP).map(code => ({ code, n: byP[code].length, ids: byP[code] })).sort((a, b) => a.n - b.n);
  let order = allOrder;
  if (IMAGE_SCRUB_PILLAR) {
    const want = IMAGE_SCRUB_PILLAR.split(',').map(s => s.trim()).filter(Boolean);
    order = want.map(code => ({ code, n: (byP[code] || []).length, ids: byP[code] || [] })).filter(p => p.ids.length);
    if (!order.length) { console.error('PILLAR filter matched no pillars:', IMAGE_SCRUB_PILLAR); process.exit(1); }
  } else order.sort((a, b) => a.n - b.n);
  if (process.env.SMOKE) { const n = parseInt(process.env.SMOKE, 10) || 10; order = [Object.assign({}, order[0], { ids: order[0].ids.slice(0, n), n: Math.min(n, order[0].n) })]; console.log('🔬 SMOKE — ' + order[0].code + ' ' + order[0].n + ' pages\n'); }

  console.log('=== Fable v2 IMAGE SCRUB — DDG ↔ Pollinator covers · pick=' + PICK_SCOPE + (IMAGE_SCRUB_PILLAR ? ' · pillar=' + IMAGE_SCRUB_PILLAR : '') + ' ===');
  order.forEach(p => console.log(p.code.padEnd(5), (NM[p.code] || p.code).padEnd(18), String(p.n).padStart(6), 'pages ~' + Math.ceil(p.n / BATCH) + ' batches'));
  console.log('TOTAL', order.reduce((a, p) => a + p.n, 0), 'pages\n');

  const resume = readJ(RESUME, { donePillars: [], pillarProgress: {} });
  const statusMap = {};
  allOrder.forEach(p => {
    if (resume.donePillars.includes(p.code)) statusMap[p.code] = { state: 'DONE' };
    else if (((resume.pillarProgress[p.code] || {}).done || []).length) statusMap[p.code] = { state: 'IN PROGRESS' };
    else statusMap[p.code] = { state: 'NOT STARTED' };
  });
  if (!fs.existsSync(CSV)) fs.writeFileSync(CSV, 'url,pillar,slots_total,slots_fixed,slots_skipped,flags,action_taken\n');
  const tally = {}; writeStatus(allOrder, statusMap, tally, null);

  for (const pillar of order) {
    if (fs.existsSync(WD + '/_image_scrub_stop.flag')) { console.log('⏹ stop flag — exiting'); process.exit(0); }
    if (resume.donePillars.includes(pillar.code)) { console.log('skip', pillar.code, '(done)'); continue; }
    const done = new Set((resume.pillarProgress[pillar.code] || {}).done || []);
    const todo = pillar.ids.filter(id => !done.has(id));
    const totalBatches = Math.ceil(pillar.ids.length / BATCH);
    let fixed = 0, skipped = 0, unresolved = 0; const flagCounts = {};
    statusMap[pillar.code] = { state: 'IN PROGRESS' };
    let batchIdx = Math.floor(done.size / BATCH);
    writeStatus(allOrder, statusMap, tally, { pillar: pillar.code, batch: batchIdx + 1, totalBatches, fixed: 0, skipped: 0, unresolved: 0, done: done.size, n: pillar.n, starting: true });
    for (let i = 0; i < todo.length; i += BATCH) {
      const batch = todo.slice(i, i + BATCH);
      for (const id of batch) {
        if (fs.existsSync(WD + '/_image_scrub_stop.flag')) { console.log('⏹ stop flag — exiting'); resume.pillarProgress[pillar.code] = { done: [...done] }; writeJ(RESUME, resume); writeStatus(allOrder, statusMap, tally, null); process.exit(0); }
        const r = await scrubPageImages(id, titleOf[id], coverSrcOf[id]);
        fixed += r.fixed; skipped += r.skipped; unresolved += r.unresolved;
        r.flags.forEach(f => { flagCounts[f] = (flagCounts[f] || 0) + 1; });
        if (runStats.gradeMissing > 0 && r.flags.includes('GRADE_MISSING') && r.fixed === 0) {
          statusMap[pillar.code] = { state: 'STOPPED-PATTERN', breaker: 'GRADE_MISSING — code defect, fix choke point' };
          resume.pillarProgress[pillar.code] = { done: [...done] }; writeJ(RESUME, resume);
          writeStatus(allOrder, statusMap, tally, null);
          console.log('🛑 GRADE_MISSING detected — paused.');
          process.exit(3);
        }
        const action = r.unresolved ? (r.flags.join('|') || 'UNRESOLVED') : 'IMAGE_PASS';
        fs.appendFileSync(CSV, [csvQ('/knowledge/' + id), csvQ(pillar.code), csvQ(r.total), csvQ(r.fixed), csvQ(r.skipped), csvQ(r.flags.join('|')), csvQ(action)].join(',') + '\n');
        done.add(id);
        resume.pillarProgress[pillar.code] = { done: [...done] }; writeJ(RESUME, resume);
        tally[pillar.code] = { done: done.size, fixed, skipped, unresolved, flagCounts, batch: batchIdx + 1, totalBatches };
        writeStatus(allOrder, statusMap, tally, Object.assign({ pillar: pillar.code, batch: batchIdx + 1, totalBatches, fixed, skipped, unresolved, done: done.size, n: pillar.n, phFail: phWindow.filter(x => x === 0).length }, runStats));
        if (phWindow.length >= CB_WINDOW) {
          const fail = phWindow.filter(x => x === 0).length / phWindow.length;
          if (fail > CB_PCT) {
            statusMap[pillar.code] = { state: 'STOPPED-PATTERN', breaker: Math.round(fail * 100) + '% fetches failing (rate-limit or query defect)' };
            resume.pillarProgress[pillar.code] = { done: [...done] }; writeJ(RESUME, resume); writeStatus(allOrder, statusMap, tally, null);
            console.log('🛑 CIRCUIT BREAKER —', Math.round(fail * 100) + '% of last 100 fetches failing.');
            process.exit(2);
          }
        }
      }
      batchIdx++;
      resume.pillarProgress[pillar.code] = { done: [...done] }; writeJ(RESUME, resume);
      tally[pillar.code] = { done: done.size, fixed, skipped, unresolved, flagCounts, batch: batchIdx, totalBatches };
      statusMap[pillar.code] = { state: 'IN PROGRESS batch ' + batchIdx + '/' + totalBatches };
      writeStatus(allOrder, statusMap, tally, Object.assign({ pillar: pillar.code, batch: batchIdx, totalBatches, fixed, skipped, unresolved, done: done.size, n: pillar.n, phFail: phWindow.filter(x => x === 0).length }, runStats));
      console.log('[' + pillar.code + '] batch ' + batchIdx + '/' + totalBatches + ' | fixed ' + fixed + ' | skipped ' + skipped + ' | unresolved ' + unresolved);
    }
    const top = Object.entries(flagCounts).sort((a, b) => b[1] - a[1])[0];
    tally[pillar.code] = { done: done.size, fixed, skipped, unresolved, flagCounts, batch: totalBatches, totalBatches };
    statusMap[pillar.code] = { state: 'DONE', summary: 'fixed ' + fixed + ', skipped ' + skipped + ', unresolved ' + unresolved };
    resume.donePillars.push(pillar.code); writeJ(RESUME, resume); writeStatus(allOrder, statusMap, tally, null);
    console.log('=== ' + pillar.code + ' DONE — fixed ' + fixed + ', skipped ' + skipped + ', unresolved ' + unresolved + (top ? ', top flag ' + top[0] : '') + ' ===\n');
  }
  console.log('✅ IMAGE SCRUB COMPLETE. See _image_status.json + _image_scrub.csv');
})().catch(e => { console.error('[image-scrub] FATAL', e.message); process.exit(1); });
