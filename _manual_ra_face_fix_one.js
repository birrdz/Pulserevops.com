'use strict';
/**
 * ONE-id RA face + top fix (no shortcuts).
 * Usage: node _manual_ra_face_fix_one.js <id>
 *
 * 1) Pull photo by title (inventory → Pexels API)
 * 2) Write face card to assets/qa/{id}.jpg
 * 3) Write top internal = same URL
 * Agent must visually confirm before moving to next id.
 */
const fs = require('fs');
const path = require('path');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
process.env.TOPIC_PILLAR = 'ra';
process.env.TOPIC_BANK = '1';
process.env.TOPIC_PAGE = '1';
process.env.GP_TOPIC_PORT = '18918'; // unused — we only borrow stage helpers

const { assertNoShortcuts } = require('./_no_shortcuts_image_law');
const { getStore } = require('@netlify/blobs');
const { syncHeroDupesFaceCard } = require('./_img_flux_rewrite_lib');
const { queryForTitle } = require('./_gp_topic_image_queries');

const id = String(process.argv[2] || '').trim().toLowerCase();
assertNoShortcuts({ id });

const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});

const QA = path.join(WD, 'assets', 'qa');
const STAGE = path.join(WD, '_ra_topic_stage');
const STATE_F = path.join(WD, '_ra_topic_review_state.json');
const LOG = path.join(WD, '_ra_manual_face_fix.jsonl');
const MOSAIC = path.join(WD, 'mosaic-pool-ra.json');

function loadJSON(f, d) {
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; }
}
function saveJSON(f, o) {
  fs.writeFileSync(f, JSON.stringify(o, null, 2));
}

(async () => {
  // Load review module after env — exposes stageOne via requiring internals is hard.
  // Inline: spawn child that uses apply path after we stage via HTTP-less copy of logic.
  // Simpler: require the batch file's exports — it doesn't export. So duplicate thin path:
  const sharp = require('sharp');
  const flib = require('./_ddg_facecard_lib');
  const { queryForTitle: qft, subjectFromTitle, isArchitectureQuery, ARCH_FALLBACK } = require('./_gp_topic_image_queries');

  const mos = JSON.parse(fs.readFileSync(MOSAIC, 'utf8'));
  const row = mos.find((e) => e && String(e.id).toLowerCase() === id);
  const blob = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!blob && !row) {
    console.error('NO_ENTRY', id);
    process.exit(5);
  }
  const title = (blob && (blob.question || blob.title)) || (row && (row.question || row.title)) || id;
  const meta = qft(title);

  // Reuse staging by temporarily requiring and calling through a small bridge
  // Start ephemeral require of gp after setting state file
  let st = loadJSON(STATE_F, { approved: {}, trashed: {}, usedPhotos: {}, zoomQueue: {}, batch: null, bank: [] });
  const usedIds = new Set(Object.keys(st.usedPhotos || {}));

  // Dynamic import of stage helpers — extract by evaluating module is too heavy.
  // Call Pexels + inventory here (mirrored minimal).
  const PEXELS_INV = path.join(QA, '_pexels_stored');
  const PEXELS = process.env.PEXELS_API_KEY || '';

  function loadInv() {
    const out = [];
    try {
      for (const n of fs.readdirSync(PEXELS_INV)) {
        if (!/\.jpe?g$/i.test(n)) continue;
        const fp = path.join(PEXELS_INV, n);
        try { if (fs.statSync(fp).size < 3000) continue; } catch (e) { continue; }
        const m = n.match(/_(\d+)\.jpe?g$/i);
        out.push({ file: n, path: fp, photoId: m ? m[1] : ('inv-' + n), query: n.replace(/_/g, ' ') });
      }
    } catch (e) {}
    return out;
  }
  function scoreInv(item, tokens) {
    const hay = (item.query + ' ' + item.file).toLowerCase();
    let s = 0;
    for (const t of tokens) {
      if (t.length < 3) continue;
      if (hay.includes(t)) s += t.length >= 6 ? 2 : 1;
    }
    return s;
  }
  async function pexelsSearch(query, page) {
    if (!PEXELS) return [];
    const url = 'https://api.pexels.com/v1/search?per_page=30&orientation=landscape&page=' + page + '&query=' + encodeURIComponent(query);
    const r = await fetch(url, { headers: { Authorization: PEXELS }, signal: AbortSignal.timeout(30000) });
    if (!r.ok) return [];
    const j = await r.json();
    const out = [];
    const seen = new Set();
    for (const p of j.photos || []) {
      if (!p || !p.id || p.width < 1000) continue;
      const pid = String(p.id);
      if (seen.has(pid)) continue;
      seen.add(pid);
      const u = (p.src && (p.src.original || p.src.large2x || p.src.large)) || '';
      if (u) out.push({ id: pid, url: u });
    }
    await new Promise((r) => setTimeout(r, 200));
    return out;
  }

  const STOP = new Set('the a an to for of in on and or with your how what top best most common complete operating playbook guide strategy gtm revenue architecture architect operations revops business company industry 2026 2027'.split(/\s+/));
  const tokens = String([meta.subject, title, meta.query].filter(Boolean).join(' '))
    .toLowerCase().replace(/[^a-z0-9\s]+/g, ' ').split(/\s+/)
    .filter((t) => t.length >= 3 && !STOP.has(t) && !/^\d+$/.test(t));

  let buf = null;
  let photoId = '';
  let srcUrl = '';
  let mode = '';
  let query = meta.query;

  const forceApi = !process.argv.includes('--inv') || process.env.RA_FACE_API === '1';
  // Default: Pexels API by title. Use --inv only when inventory is trusted.

  // Inventory (skip with --api — mislabeled inv files caused scooter junk)
  if (!forceApi) {
    const inv = loadInv();
    const qTokens = String(meta.query || '').toLowerCase().split(/\s+/).filter((t) => t.length >= 4);
    const ranked = inv
      .map((it, i) => ({ it, i, sc: scoreInv(it, tokens), qsc: scoreInv(it, qTokens) }))
      .filter((x) => x.sc >= 4 && x.qsc >= 2 && !usedIds.has(String(x.it.photoId)))
      .sort((a, b) => b.qsc - a.qsc || b.sc - a.sc || a.i - b.i);
    for (let n = 0; n < Math.min(8, ranked.length); n++) {
      try {
        buf = fs.readFileSync(ranked[n].it.path);
        photoId = String(ranked[n].it.photoId);
        srcUrl = 'file:///' + ranked[n].it.path.replace(/\\/g, '/');
        mode = 'pexels-inv';
        query = meta.query || ranked[n].it.query;
        usedIds.add(photoId);
        break;
      } catch (e) { buf = null; }
    }
  }

  // Pexels API
  if (!buf) {
    const qs = [meta.query];
    if (meta.subject) qs.push(meta.subject + ' people working professionals');
    outer: for (const q of qs) {
      for (let page = 1; page <= 5; page++) {
        const hits = await pexelsSearch(q, page);
        for (const h of hits) {
          if (usedIds.has(h.id)) continue;
          try {
            const ir = await fetch(h.url, { signal: AbortSignal.timeout(30000) });
            if (!ir.ok) continue;
            buf = Buffer.from(await ir.arrayBuffer());
            if (buf.length < 8000) { buf = null; continue; }
            photoId = h.id;
            srcUrl = h.url;
            mode = 'pexels-api';
            query = q;
            usedIds.add(h.id);
            break outer;
          } catch (e) { buf = null; }
        }
      }
    }
  }

  if (!buf) {
    console.error(JSON.stringify({ ok: false, id, title, err: 'no photo' }));
    process.exit(6);
  }

  fs.mkdirSync(STAGE, { recursive: true });
  const facePath = path.join(QA, id + '.jpg');
  const sqPath = path.join(QA, id + '.sq.jpg');
  const rawPath = path.join(STAGE, id + '.raw.jpg');
  fs.writeFileSync(rawPath, buf);
  const rotated = await sharp(buf).rotate().toBuffer();
  const box = 760;
  await sharp({
    create: { width: box, height: box, channels: 3, background: { r: 0, g: 0, b: 0 } },
  }).composite([{
    input: await sharp(rotated).resize(box, box, { fit: 'inside', withoutEnlargement: false }).jpeg({ quality: 90, mozjpeg: true }).toBuffer(),
    gravity: 'centre',
  }]).jpeg({ quality: 86, mozjpeg: true }).toFile(sqPath);
  await flib.gradeFaceCardFromBuffer(rotated, facePath, {
    question: '',
    cropPosition: 'centre',
    fit: 'contain',
  });

  // Face → top same URL
  const url = '/assets/qa/' + id + '.jpg';
  const cur = blob || (await store.get('answers/' + id + '.json', { type: 'json' }));
  if (cur) {
    let body = syncHeroDupesFaceCard(id, title, String(cur.answer || cur.body || ''));
    const ms = [...body.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)];
    for (const m of ms) {
      const u = m[2].replace(/\?.*$/, '');
      if (u === url || u.endsWith('/' + id + '.jpg')) continue;
      const alt = m[1] || title;
      const idx = body.indexOf(m[0]);
      if (idx >= 0) {
        body = body.slice(0, idx) + '![' + alt + '](' + url + ')' + body.slice(idx + m[0].length);
      }
      break;
    }
    await store.setJSON('answers/' + id + '.json', Object.assign({}, cur, {
      answer: body,
      img: url,
      cover_src: 'pexels-topic',
      face_title_baked: false,
    }));
  }
  try {
    const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    const ent = (idx.entries || []).find((x) => x && String(x.id).toLowerCase() === id);
    if (ent) {
      ent.img = url;
      ent.cover_src = 'pexels-topic';
      await store.setJSON('_index.json', idx);
    }
  } catch (e) {}

  st.approved = st.approved || {};
  st.approved[id] = { at: Date.now(), query, mode, photoId, manualFix: true };
  st.usedPhotos = st.usedPhotos || {};
  if (photoId) st.usedPhotos[photoId] = id;
  delete (st.trashed || {})[id];
  saveJSON(STATE_F, st);

  const rec = { id, title, query, mode, photoId, face: url, at: Date.now() };
  fs.appendFileSync(LOG, JSON.stringify(rec) + '\n');
  console.log(JSON.stringify(Object.assign({ ok: true }, rec, { facePath, faceSz: fs.statSync(facePath).size })));
})().catch((e) => { console.error(e); process.exit(1); });
