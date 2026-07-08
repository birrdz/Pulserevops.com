// _gm_content_batch.js — gm Top-10 content/format fix (owner "do whatever you did for movies", 2026-07-08).
// Per page: collapseToGoldStructure (strip <!--HERO--> + leading pollinations hero, strip rank markdown
// images, add How We Ranked / What to Look For, fix tail order) → self-host each rank's image from its
// ORIGINAL hotlinked URL (download → storeGradedImage → /assets/qa/<id>-1NN.jpg; flux fallback if dead)
// → verify master-law + image audit + 13/13 → publish + email. Leaves the face-card cover (Pexels) alone.
// Resume-safe: _gm_content_done.json. Run AFTER the Pexels cover run releases image_run.lock.
const fs = require('fs'), https = require('https'), http = require('http');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const { collapseToGoldStructure } = require('./_aq_top10_gold_fix_lib');
const { storeGradedImage } = require('./_ddg_facecard_lib');
const { makeContent } = require('./_img_flux_lib');
const M = require('./_ranking_list_master_law');
const { auditImages } = require('./netlify/functions/lib/ensure-entry-images');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const { shouldSkipMv } = require('./netlify/functions/lib/mv-pillar-guard');
const { shouldSkipHf } = require('./netlify/functions/lib/hf-pillar-guard');
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const store = getStore({ name: 'pulse-machine-library', siteID: SITE, token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const RESEND = process.env.resendapikey || process.env.RESEND_API_KEY;
const PILLAR = (process.env.PILLAR || 'gm').toLowerCase();
const DONE_F = WD + '/_' + PILLAR + '_content_done.json';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const loadDone = () => { try { return new Set(JSON.parse(fs.readFileSync(DONE_F, 'utf8'))); } catch (e) { return new Set(); } };
const saveDone = s => { try { fs.writeFileSync(DONE_F, JSON.stringify([...s])); } catch (e) {} };
const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function fetchBuf(url) {
  return new Promise((resolve) => {
    if (!/^https?:\/\//.test(String(url || ''))) return resolve(null);
    const lib = url.startsWith('https') ? https : http;
    try {
      const req = lib.get(url, { timeout: 20000, headers: { 'User-Agent': 'Mozilla/5.0 pulserevops-image/1.0' } }, res => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) { return resolve(fetchBuf(res.headers.location)); }
        if (res.statusCode !== 200 || !/^image\//i.test(res.headers['content-type'] || '')) { res.resume(); return resolve(null); }
        const c = []; res.on('data', x => c.push(x)); res.on('end', () => { const b = Buffer.concat(c); resolve(b.length > 6000 ? b : null); });
      });
      req.on('error', () => resolve(null)); req.on('timeout', () => { req.destroy(); resolve(null); });
    } catch (e) { resolve(null); }
  });
}

// capture rank -> original @@PRODUCT img from the ORIGINAL body (before collapse drops them)
function captureOrigImgs(body) {
  const map = {}; let slot = 0;
  for (const line of String(body).split('\n')) {
    const h = line.match(/^##\s+(\d+)\.\s+/); if (h) { slot = parseInt(h[1], 10); continue; }
    const pm = line.match(/^@@PRODUCT[^\n]*img="([^"]*)"/); if (pm && slot) map[slot] = pm[1];
  }
  return map;
}

async function emailEntry(id, title) {
  if (!RESEND) return 'no-key';
  const url = 'https://pulserevops.com/knowledge/' + id;
  const html = '<div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;max-width:600px;color:#15110d">' +
    '<p style="font-size:18px;font-weight:800">✅ Q&amp;A fixed &amp; published · ' + esc(id) + '</p>' +
    '<p style="font-size:13px;color:#0b57d0;font-weight:700">' + esc(PILLAR.toUpperCase()) + ' pillar · 13/13 gold Top-10 · self-hosted images</p>' +
    '<p style="font-weight:700">' + esc(title) + '</p><p><a href="' + url + '" style="color:#0b57d0;font-weight:700">' + url + '</a></p></div>';
  try { const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + RESEND, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: 'PULSE Engine <onboarding@resend.dev>', to: ['koryjordanwhite@gmail.com'], subject: '✅ ' + id + ' fixed · ' + String(title).slice(0, 56), html }) }); return r.status; } catch (e) { return 'err'; }
}

async function processOne(id, idx) {
  const e = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!e || !e.answer) return { id, skip: 'no-blob' };
  const title = e.question || e.title || id;
  const orig = captureOrigImgs(e.answer);
  // De-number meta headings wrongly numbered as ranks (phantom-rank fix) + strip any 🏆/💎 pill from
  // a meta heading — BEFORE collapse, else "## 1. How We Ranked … 🏆 BEST OVERALL" parses as rank 1.
  let pre = String(e.answer)
    .replace(/^##\s+\d+\.\s+(How We Ranked|How to Choose|What to Look For|What Makes|Which\b|Why\b|Bottom Line|FAQ|Sources|Related\b|Direct Answer)([^\n]*)$/gim, '## $1$2')
    .replace(/^(##\s+(?:How We Ranked|How to Choose|What to Look For|What Makes|Which|Why)[^\n]*?)\s*[🏆💎][^\n]*$/gim, '$1');
  let body = collapseToGoldStructure(pre, id, title);
  // self-host each rank image from its ORIGINAL hotlink (grade + local); flux fallback if dead
  const lines = body.split('\n'); let rank = 0, filled = 0;
  for (let i = 0; i < lines.length; i++) {
    const h = lines[i].match(/^##\s+(\d+)\.\s+(.+)$/); if (h) { rank = parseInt(h[1], 10); continue; }
    if (/^@@PRODUCT/.test(lines[i]) && rank >= 1 && rank <= 10) {
      const nm = (lines[i].match(/name="([^"]*)"/) || [])[1] || '';
      const st = (lines[i].match(/site="([^"]*)"/) || [])[1] || '';
      const rel = '/assets/qa/' + id + '-' + (100 + rank) + '.jpg';
      const dest = WD + rel;
      let ok = false, useRel = rel;
      const src = orig[rank];
      // (a) already a valid self-hosted local image → KEEP it (no fetch, no flux — this was the hang)
      if (src && /^\/assets\/qa\//.test(src)) {
        try { if (fs.statSync(WD + src).size > 6000) { useRel = src; ok = true; } } catch (e) {}
      }
      // (b) real hotlink → download + grade + self-host
      if (!ok && src && /^https?:\/\//.test(src) && !/pollinations\.ai/i.test(src)) {
        const buf = await fetchBuf(src);
        if (buf) { try { ok = await storeGradedImage(buf, dest, { width: 800, bright: false }); } catch (x) {} }
      }
      // (c) last resort → flux, WITH a hard 60s timeout so one slot can never stall the batch
      if (!ok) {
        try {
          const loc = await Promise.race([
            makeContent(id, 100 + rank, (nm + ' ' + String(title).replace(/[\[\]"?]/g, '')).trim()),
            new Promise(r => setTimeout(() => r(null), 60000)),
          ]);
          if (loc) ok = true;
        } catch (x) {}
      }
      if (ok) { lines[i] = '@@PRODUCT name="' + nm.replace(/"/g, '') + '" img="' + useRel + '"' + (st ? ' site="' + st.replace(/"/g, '') + '"' : ''); filled++; }
    }
  }
  body = lines.join('\n');
  const master = M.auditRankingListMaster(body, title);
  const imgs = auditImages(id, body);
  const grade = gradeEntry(id, body, { imagesDeferred: false });
  if (!master.compliant || !imgs.compliant || grade.score < 13) return { id, skip: 'not-compliant', grade: grade.score, master: master.compliant, img: imgs.compliant, issues: (master.issues || []).slice(0, 4), filled };
  // publish: answer blob + index quality_score/tags. Leave cover img (Pexels) alone.
  await store.setJSON('answers/' + id + '.json', Object.assign({}, e, { answer: body, quality_score: 13, updated_at: new Date().toISOString() }));
  const row = (idx.entries || []).find(x => x && String(x.id).toLowerCase() === id);
  if (row) { row.quality_score = 13; row.tags = [...new Set([...(row.tags || []), 'pulse-recent'])]; }
  return { id, ok: true, grade: grade.score, filled, email: await emailEntry(id, title) };
}

(async () => {
  if (PILLAR === 'mv' || PILLAR === 'hf') throw new Error('HARD EXCLUSION ' + PILLAR);
  const _completed = (() => { try { return JSON.parse(fs.readFileSync(WD + '/image_run_completed.json', 'utf8')); } catch (e) { return []; } })();
  if (Array.isArray(_completed) && _completed.map(String).includes(PILLAR)) throw new Error('COMPLETED pillar ' + PILLAR + ' on do-not-touch list — refusing');
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  let pages = (idx.entries || []).filter(e => e && new RegExp('^' + PILLAR + '\\d+$', 'i').test(String(e.id)));
  pages = pages.filter(e => !shouldSkipMv({ id: e.id }) && !shouldSkipHf({ id: e.id }));
  pages.sort((a, b) => String(a.id).localeCompare(String(b.id), undefined, { numeric: true }));
  const done = loadDone(); let ok = 0, skip = 0;
  console.log('[' + PILLAR + '-content] ' + pages.length + ' pages · ' + done.size + ' done');
  for (const p of pages) {
    const id = String(p.id).toLowerCase();
    if (done.has(id)) continue;
    try {
      const r = await processOne(id, idx);
      if (r.ok) { ok++; done.add(id); saveDone(done); if (ok % 5 === 0) await store.setJSON('_index.json', idx); console.log('[' + PILLAR + '-content] ✅ ' + id + ' ' + r.grade + '/13 filled=' + r.filled + ' email=' + r.email + ' (' + ok + ')'); }
      else { skip++; console.log('[' + PILLAR + '-content] ⏭ ' + id + ' skip=' + r.skip + ' grade=' + (r.grade || '?') + ' master=' + r.master + ' img=' + r.img + ' filled=' + (r.filled || 0) + ' ' + JSON.stringify(r.issues || '')); }
    } catch (x) { skip++; console.log('[' + PILLAR + '-content] ⚠ ' + id + ' ' + (x && x.message)); }
    await sleep(500);
  }
  await store.setJSON('_index.json', idx);
  console.log('[' + PILLAR + '-content] DONE published=' + ok + ' skipped=' + skip);
})().catch(e => { console.error('FATAL', e && e.message); process.exit(1); });
