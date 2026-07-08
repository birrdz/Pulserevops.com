// FAST mv batch (owner 2026-07-08): for every mv Top-10 entry — reshape to gold structure
// (collapseToGoldStructure) → apply REAL title-matched posters from the library (ensureDdgSectionImage
// moviePoster) → verify master-law + image audit + 13/13 grade → publish → email the QID link.
// Uses existing content (grades 15/13 after reshape). Resumable via _mv_fast_batch_done.json.
// Stop: _mv_fast_batch_stop.flag
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
process.env.STAGGER_DDG_POLLINATOR = '1'; // movies mode (poster lib authoritative)
const { getStore } = require('@netlify/blobs');
const { collapseToGoldStructure } = require('./_aq_top10_gold_fix_lib');
const { ensureDdgSectionImage } = require('./_ddg_facecard_lib');
const M = require('./_ranking_list_master_law');
const { auditImages } = require('./netlify/functions/lib/ensure-entry-images');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const store = getStore({ name: 'pulse-machine-library', siteID: SITE, token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const RESEND = process.env.resendapikey || process.env.RESEND_API_KEY;
const DONE_F = WD + '/_mv_fast_batch_done.json';
const STOP_F = WD + '/_mv_fast_batch_stop.flag';
const RECIP = 'koryjordanwhite@gmail.com';
const sleep = ms => new Promise(r => setTimeout(r, ms));
function loadDone() { try { return new Set(JSON.parse(fs.readFileSync(DONE_F, 'utf8'))); } catch (e) { return new Set(); } }
function saveDone(s) { try { fs.writeFileSync(DONE_F, JSON.stringify([...s])); } catch (e) {} }
function esc(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

async function emailEntry(id, title) {
  const url = 'https://pulserevops.com/knowledge/' + id;
  const html = '<div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;max-width:600px;color:#15110d">' +
    '<p style="font-size:18px;font-weight:800">✅ Q&amp;A fixed &amp; published · ' + esc(id) + '</p>' +
    '<p style="font-size:13px;color:#0b57d0;font-weight:700">MV pillar · 13/13 gold Top-10 · real movie posters</p>' +
    '<p style="font-weight:700">' + esc(title) + '</p>' +
    '<p><a href="' + url + '" style="color:#0b57d0;font-weight:700">' + url + '</a></p></div>';
  try { const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + RESEND, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: 'PULSE Engine <onboarding@resend.dev>', to: [RECIP], subject: '✅ ' + id + ' fixed · ' + String(title).slice(0, 58), html }) }); return r.status; } catch (e) { return 'err'; }
}

async function processOne(id) {
  const e = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!e || !e.answer) return { id, skip: 'no-blob' };
  const title = e.question || id;
  let body = collapseToGoldStructure(e.answer, id, title);
  // apply real posters per rank
  const lines = body.split('\n'); let rank = 0;
  for (let i = 0; i < lines.length; i++) {
    const h = lines[i].match(/^##\s+(\d+)\.\s+(.+)$/); if (h) { rank = parseInt(h[1], 10); continue; }
    if (/^@@PRODUCT/.test(lines[i]) && rank >= 1 && rank <= 10) {
      const nm = (lines[i].match(/name="([^"]*)"/) || [])[1] || '';
      const st = (lines[i].match(/site="([^"]*)"/) || [])[1] || 'https://www.imdb.com/';
      let local = null;
      try { local = await ensureDdgSectionImage(id, 100 + rank, (nm + ' ' + String(title).replace(/[\[\]"?]/g, '')).trim(), { moviePoster: true, movieSlot: nm }); } catch (x) {}
      if (local) lines[i] = '@@PRODUCT name="' + nm + '" img="' + local + '" site="' + st + '"';
    }
  }
  body = lines.join('\n');
  const master = M.auditRankingListMaster(body, title);
  const imgs = auditImages(id, body);
  const grade = gradeEntry(id, body, { imagesDeferred: false });
  if (!master.compliant || !imgs.compliant || grade.score < 13) {
    return { id, skip: 'not-compliant', master: master.compliant, img: imgs.compliant, grade: grade.score, issues: (master.issues || []).slice(0, 4) };
  }
  const now = new Date().toISOString();
  await store.setJSON('answers/' + id + '.json', Object.assign({}, e, { answer: body, quality_score: 13, updated_at: now }));
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const row = (idx.entries || []).find(x => x && x.id === id);
  if (row) { row.quality_score = 13; row.tags = [...new Set([...(row.tags || []), 'pulse-recent'])]; await store.setJSON('_index.json', idx); }
  const es = await emailEntry(id, title);
  return { id, ok: true, grade: grade.score, email: es };
}

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const mvIds = (idx.entries || []).map(e => e && e.id).filter(x => /^mv\d+$/i.test(String(x))).map(x => x.toLowerCase()).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const done = loadDone();
  console.log('[mv-batch] ' + mvIds.length + ' mv entries · ' + done.size + ' already done');
  let ok = 0, skip = 0;
  for (const id of mvIds) {
    if (fs.existsSync(STOP_F)) { console.log('[mv-batch] STOP flag'); break; }
    if (done.has(id)) continue;
    try {
      const r = await processOne(id);
      if (r.ok) { ok++; done.add(id); saveDone(done); console.log('[mv-batch] ✅ ' + id + ' ' + r.grade + '/13 · email ' + r.email + ' (' + ok + ' published)'); }
      else { skip++; console.log('[mv-batch] ⏭ ' + id + ' skip=' + r.skip + ' grade=' + (r.grade || '?') + ' master=' + r.master + ' img=' + r.img + ' ' + JSON.stringify(r.issues || '')); }
    } catch (e) { skip++; console.log('[mv-batch] ⚠ ' + id + ' ' + (e && e.message)); }
    await sleep(1500);
  }
  console.log('[mv-batch] DONE — published ' + ok + ' · skipped ' + skip);
})().catch(e => { console.error('FATAL', e && e.message); process.exit(1); });
