// Set each mv Top-10 entry's FACE-CARD COVER to its #1 (Best Overall) movie poster — a real poster
// from inside that Q&A — graded to the square mosaic tile. Fixes flux/missing covers. (owner 2026-07-08)
// Then the covers need a deploy (static). Resumable: _mv_poster_covers_done.json
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const { parseMovieSlot } = require('./_mv_image_title_match');
const { storeGradedImage } = require('./_ddg_facecard_lib');
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const store = getStore({ name: 'pulse-machine-library', siteID: SITE, token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const LIB = WD + '/assets/qa/_poster-lib';
const DONE_F = WD + '/_mv_poster_covers_done.json';
const sleep = ms => new Promise(r => setTimeout(r, ms));
function loadDone() { try { return new Set(JSON.parse(fs.readFileSync(DONE_F, 'utf8'))); } catch (e) { return new Set(); } }
function saveDone(s) { try { fs.writeFileSync(DONE_F, JSON.stringify([...s])); } catch (e) {} }

// find the #1 ranked movie name in the body
function rank1Movie(body) {
  const m = String(body || '').match(/^##\s+1\.\s+(.+)$/m);
  if (!m) return '';
  return m[1].replace(/\s*🏆\s*BEST\s+OVERALL\s*$/i, '').replace(/\s*[🏆💎][^\n]*$/g, '').trim();
}
function libPosterBuf(name) {
  const mv = parseMovieSlot(name);
  for (const key of [mv.slugYear, mv.slug].filter(Boolean)) {
    const f = LIB + '/' + key + '.jpg';
    try { if (fs.statSync(f).size > 4000) return fs.readFileSync(f); } catch (e) {}
  }
  return null;
}

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const mvRows = (idx.entries || []).filter(e => e && /^mv\d+$/i.test(String(e.id)));
  const done = loadDone();
  console.log('[mv-covers] ' + mvRows.length + ' mv entries · ' + done.size + ' done');
  let ok = 0, skip = 0, idxDirty = false;
  for (const row of mvRows) {
    const id = String(row.id).toLowerCase();
    if (done.has(id)) continue;
    try {
      const e = await store.get('answers/' + id + '.json', { type: 'json' });
      const name = rank1Movie(e && e.answer);
      if (!name) { skip++; console.log('[mv-covers] ⏭ ' + id + ' no rank-1'); continue; }
      const buf = libPosterBuf(name);
      if (!buf) { skip++; console.log('[mv-covers] ⏭ ' + id + ' no lib poster for "' + name + '"'); continue; }
      // grade the poster into the square mosaic tile (centered, attention crop)
      const dest = WD + '/assets/qa/' + id + '.jpg';
      const stored = await storeGradedImage(buf, dest, { square: 760, faceCard: true, cropPosition: 'attention', bright: false });
      if (!stored) { skip++; console.log('[mv-covers] ⚠ ' + id + ' grade failed'); continue; }
      row.img = '/assets/qa/' + id + '.jpg';
      row.cover_src = 'poster';
      row.face_title_baked = false;
      idxDirty = true;
      done.add(id); saveDone(done); ok++;
      if (ok % 10 === 0) { await store.setJSON('_index.json', idx); idxDirty = false; }
      console.log('[mv-covers] ✅ ' + id + ' cover = #1 poster "' + name + '" (' + ok + ')');
    } catch (x) { skip++; console.log('[mv-covers] ⚠ ' + id + ' ' + (x && x.message)); }
    await sleep(300);
  }
  if (idxDirty) await store.setJSON('_index.json', idx);
  console.log('[mv-covers] DONE — covers set ' + ok + ' · skipped ' + skip);
})().catch(e => { console.error('FATAL', e && e.message); process.exit(1); });
