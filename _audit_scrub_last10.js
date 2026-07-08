// Log each scrub-one completion + audit last N runs (owner QA after 10 scrubs).
const fs = require('fs');
const path = require('path');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const { bodyImagesAllFlux, KORY_CRO_IMG } = require('./_img_flux_lib');
const { faceCardCoverOk } = require('./_face_cover_lib');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const LOGF = WD + '/_scrub_run_log.json';
const N = parseInt(process.argv[2] || '10', 10);

function readLog() { try { return JSON.parse(fs.readFileSync(LOGF, 'utf8')); } catch (e) { return []; } }
function imgUrls(body) {
  const imgs = []; let m; const re = /!\[[^\]]*\]\(([^)]+)\)/g;
  while ((m = re.exec(String(body))) && imgs.length < 14) imgs.push(m[1]);
  return imgs;
}

async function auditId(id) {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const ent = (idx.entries || []).find(e => e && e.id === id) || {};
  const blob = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
  const body = blob && blob.answer ? blob.answer : '';
  const g = gradeEntry(id, body, { imagesDeferred: true });
  let coverKb = 0; try { coverKb = Math.round(fs.statSync(path.join(WD, 'assets/qa', id + '.jpg')).size / 1024); } catch (e) {}
  const urls = imgUrls(body);
  const livePoll = urls.filter(u => /pollinations\.ai/i.test(u));
  const internalDdg = urls.slice(1).filter(u => u !== KORY_CRO_IMG).every(u => /^https?:\/\//i.test(u) && !/pollinations\.ai/i.test(u) && !/^\/assets\/qa\//.test(u));
  const checks = {
    score12: g.score >= 12,
    faceFlux: faceCardCoverOk(id, ent.cover_src),
    internalDdg,
    allInternalFlux: bodyImagesAllFlux(body),
    coverKb40: coverKb >= 40,
    ccSigned: !!(blob && (blob.cc_signed || blob.claude_certified)),
    noLivePollinator: livePoll.length === 0,
  };
  const failed = Object.keys(checks).filter(k => !checks[k]);
  return { id, title: (ent.question || blob && blob.question || '').slice(0, 70), score: g.score, cover_src: ent.cover_src, coverKb, failed, checks, missing: g.missing || [], steps: null };
}

(async () => {
  const log = readLog().slice(0, N);
  if (!log.length) { console.log('No scrub runs logged yet at', LOGF); process.exit(1); }
  console.log('=== SCRUB AUDIT — last', log.length, 'runs ===\n');
  let pass = 0, fail = 0;
  const rows = [];
  for (const row of log) {
    const a = await auditId(row.id);
    a.status = row.status;
    a.steps = row.steps;
    a.ts = row.ts;
    a.scrubScore = row.score;
    const ok = row.status === 'certified' && a.failed.length === 0;
    if (ok) pass++; else fail++;
    rows.push(a);
    console.log((ok ? '✅' : '❌') + ' ' + row.id + ' | scrub:' + row.status + ' ' + (row.score || '?') + '/13 | grade:' + a.score + '/13');
    if (a.failed.length) console.log('   FAIL:', a.failed.join(', '));
    if (row.steps && row.steps.length) console.log('   steps:', row.steps.join(' → '));
    console.log('');
  }
  // serial slot check — runs should not overlap (end of run N before start of N+1)
  let overlap = 0;
  for (let i = 1; i < log.length; i++) {
    const prevEnd = log[i - 1].endedAt || log[i - 1].ts;
    const curStart = log[i].startedAt || log[i].ts;
    if (prevEnd && curStart && new Date(curStart) < new Date(prevEnd)) overlap++;
  }
  console.log('=== SUMMARY ===');
  console.log('certified+compliant:', pass + '/' + log.length);
  console.log('issues:', fail);
  console.log('serial overlap violations:', overlap, '(0 = one-at-a-time OK)');
  const allOk = fail === 0 && overlap === 0;
  console.log(allOk ? '\n✅ SCRUB PIPELINE OK' : '\n❌ SCRUB PIPELINE NEEDS ATTENTION');
  process.exit(allOk ? 0 : 1);
})().catch(e => { console.error('AUDIT FAIL', e.message); process.exit(1); });
