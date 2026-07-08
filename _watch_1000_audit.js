// _watch_1000_audit — unattended 1000 checkpoint (owner 4444, 2026-07-02).
// Waits until GREEN (certified since the all-to-red reset) crosses 1000, then: pauses the scrubber,
// deep-audits ALL certified with the REAL grader, auto-fixes any imperfect (build Top-10 images / cover),
// re-audits until clean, EMAILS the owner the verdict, then RESUMES the scrubber to do the rest.
// Stop: _watch_1000_stop.flag
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const { ensureImages, auditImages } = require('./netlify/functions/lib/ensure-entry-images');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const TARGET = parseInt(process.env.WATCH_TARGET || '1000', 10);
const pillarOf = id => (String(id).match(/^[a-z]+/) || [''])[0];
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function jget(u) { try { const r = await fetch(u, { signal: AbortSignal.timeout(8000) }); return await r.json(); } catch (e) { return null; } }
async function post(action) { try { await fetch('http://localhost:8899/scrub-auto', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: '4444', action }) }); } catch (e) {} }
async function email(subject, message) { try { await fetch('https://pulserevops.com/.netlify/functions/pulse-owner-notify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'pulsemachine-writer-2026', subject, message }) }); } catch (e) {} }

function judge(id, body) {
  const g = gradeEntry(id, body, {});
  const why = [];
  if (g.score < 12) why.push('score ' + g.score + ':' + (g.missing || []).join(','));
  const hero = (body.match(/!\[[^\]]*\]\(([^)]+)\)/) || [])[1] || '';
  if (!hero) why.push('no hero');
  if (pillarOf(id) !== 'tl' && /cro-cover-/.test(hero)) why.push('cro-cover-on-' + pillarOf(id));
  const ia = auditImages(id, body);
  if (ia.top10 && !ia.compliant) why.push('top10 imgs ' + ia.productImgs + '/10');
  return { score: g.score, ok: why.length === 0, why };
}

async function auditAll() {
  let green = []; try { green = JSON.parse(fs.readFileSync(WD + '/_v2_approved.json', 'utf8')) || []; } catch (e) {}
  const bad = [];
  for (const id of green) {
    const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
    if (!e || !e.answer) { bad.push({ id, why: ['no blob'] }); continue; }
    const j = judge(id, e.answer);
    if (!j.ok) bad.push({ id, why: j.why });
  }
  return { total: green.length, bad };
}

async function fix(id) {
  const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
  if (!e || !e.answer) return false;
  let body = e.answer;
  try { const ri = await ensureImages(id, e.question, body); if (ri && ri.body) body = ri.body; } catch (x) {}
  const j = judge(id, body);
  await store.setJSON('answers/' + id + '.json', Object.assign({}, e, { answer: body, quality: j.score + '/13', updated_at: new Date().toISOString() }));
  return j.ok;
}

(async () => {
  console.log('[watch1000] armed · target green = ' + TARGET);
  // 1) wait for the checkpoint
  while (!fs.existsSync(WD + '/_watch_1000_stop.flag')) {
    const s = await jget('http://localhost:8899/scrub-status?key=4444');
    const green = s && s.state ? s.state.green : 0;
    if (green >= TARGET) break;
    await sleep(20000);
  }
  if (fs.existsSync(WD + '/_watch_1000_stop.flag')) { console.log('[watch1000] stopped by flag'); return; }
  console.log('[watch1000] hit ' + TARGET + ' — pausing scrubber for the checkpoint audit');
  await post('stop'); await sleep(6000);
  // 2) audit + auto-fix loop (up to 3 passes)
  let report = await auditAll();
  console.log('[watch1000] pass0: ' + (report.total - report.bad.length) + '/' + report.total + ' perfect · ' + report.bad.length + ' to fix');
  let fixedTotal = 0;
  for (let pass = 1; pass <= 3 && report.bad.length; pass++) {
    for (const b of report.bad) { const ok = await fix(b.id); if (ok) fixedTotal++; }
    report = await auditAll();
    console.log('[watch1000] pass' + pass + ': ' + (report.total - report.bad.length) + '/' + report.total + ' perfect · ' + report.bad.length + ' left');
  }
  const perfect = report.total - report.bad.length;
  const byP = {}; // final tally
  // 3) email verdict
  const msg = '✅ 1,000 CHECKPOINT — personally audited every certified entry with the real grader.\n\n' +
    'Certified so far: ' + report.total + '\n' +
    'PERFECT (true 12/13+): ' + perfect + '/' + report.total + ' (' + Math.round(perfect / report.total * 100) + '%)\n' +
    'Auto-fixed this pass: ' + fixedTotal + '\n' +
    (report.bad.length ? ('Still imperfect (' + report.bad.length + ', need a look):\n' + report.bad.slice(0, 30).map(b => '  ⚠️ ' + b.id + ' — ' + b.why.join(' | ')).join('\n')) : 'Every single one is perfect. 🎉') +
    '\n\n' + (report.bad.length ? 'Left the scrubber PAUSED so you can review the stragglers. Hit Begin Scrub to continue.' : 'All clean — RESUMING the scrubber to finish the remaining ~26k. It will keep certifying at 12/13+.');
  await email('✅ Pulse scrub — 1,000 checkpoint (' + perfect + '/' + report.total + ' perfect)', msg);
  console.log('[watch1000] emailed verdict · perfect ' + perfect + '/' + report.total);
  // 4) all clean → do the rest (owner pre-authorized "then you can do the rest"); else stay paused
  if (!report.bad.length) { await post('start'); console.log('[watch1000] resumed — doing the rest'); }
  else console.log('[watch1000] left paused for owner review');
})().catch(e => { console.log('[watch1000] FATAL', e && e.stack); process.exit(1); });
