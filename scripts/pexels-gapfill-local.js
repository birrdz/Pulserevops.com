#!/usr/bin/env node
// Pexels gap-fill for image-purge doneIds (or FACTCHECK cohort).
// HARD LAW: serial Pexels, ≥18s between calls. Self-host to assets/qa/.
// Emails each filled knowledge URL. Visual-lock: only swaps cover/slot URLs.

const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');
const { pexelsRequest } = require('../netlify/functions/lib/pexels-throttle');
const { deriveImageSearchQuery } = require('../netlify/functions/lib/derive-image-search-query');

let storeGradedImage;
try {
  ({ storeGradedImage } = require('../_ddg_facecard_lib'));
} catch (e) {
  console.error(JSON.stringify({ fatal: 'ddg_facecard_lib: ' + e.message }));
  process.exit(1);
}

function loadEnv(p) {
  try {
    for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch (e) {}
}
loadEnv('/tmp/pulse-runtime.env');
loadEnv(path.join(process.cwd(), '.env.local'));

const SITE_ID = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const KEY = 'pulsemachine-writer-2026';
const SITE = 'https://pulserevops.com';
const STATE_KEY = '_pexels_gapfill_state.json';
const IMAGE_STATE_KEY = '_mangled_image_purge_state.json';
const ASSET_DIR = path.join(process.cwd(), 'assets', 'qa');
const MAX = parseInt(process.env.PEXELS_MAX || '0', 10); // 0 = all doneIds
const PEXELS_KEY = process.env.PEXELS_API_KEY || process.env.Pexels_Api_Key;

fs.mkdirSync(ASSET_DIR, { recursive: true });

function store() {
  const tok = process.env.BLOBS_PAT;
  if (!tok) throw new Error('BLOBS_PAT required');
  if (!PEXELS_KEY) throw new Error('PEXELS_API_KEY required');
  return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok });
}

function knowledgeUrl(id) {
  return SITE + '/knowledge/' + encodeURIComponent(id);
}

async function emailOne(subject, html) {
  try {
    await fetch(SITE + '/.netlify/functions/pulse-progress-notify?key=' + KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, html }),
      signal: AbortSignal.timeout(15000),
    });
  } catch (e) {}
}

async function pexelsSearch(query) {
  const url =
    'https://api.pexels.com/v1/search?per_page=5&orientation=landscape&query=' +
    encodeURIComponent(query);
  const r = await pexelsRequest(async () => {
    const res = await fetch(url, {
      headers: { Authorization: PEXELS_KEY, 'User-Agent': 'pulserevops-pexels-gapfill/1.0' },
      signal: AbortSignal.timeout(30000),
    });
    const body = Buffer.from(await res.arrayBuffer());
    return { status: res.status, body };
  });
  if (r.status !== 200) throw new Error('Pexels HTTP ' + r.status);
  return JSON.parse(r.body.toString('utf8'));
}

function bestPhoto(photos) {
  const ok = (photos || []).filter((p) => p && p.width >= 1200 && p.width >= p.height);
  const pool = ok.length ? ok : (photos || []).filter((p) => p && p.src);
  pool.sort((a, b) => b.width * b.height - a.width * a.height);
  const p = pool[0];
  if (!p) return null;
  return (p.src && (p.src.large2x || p.src.large || p.src.original)) || null;
}

async function download(url) {
  const r = await fetch(url, {
    headers: { 'User-Agent': 'pulserevops-pexels-gapfill/1.0' },
    signal: AbortSignal.timeout(45000),
  });
  if (!r.ok) throw new Error('download ' + r.status);
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length < 3000) throw new Error('tiny download');
  return buf;
}

function needsCover(row, blob) {
  const img = (row && row.img) || (blob && blob.img) || '';
  if (!img) return true;
  if (/pollinations|nologo=true|model=flux|img-missing|cro-cover-\d/i.test(img)) return true;
  if (/face_purged_at/.test(JSON.stringify(row || {})) && !img) return true;
  if (row && row.face_purged_at && (!img || /pollinations/i.test(img))) return true;
  return false;
}

async function main() {
  const s = store();
  let state = { doneIds: [], filled: 0, skipped: 0, misses: 0 };
  try {
    state = Object.assign(state, (await s.get(STATE_KEY, { type: 'json' })) || {});
  } catch (e) {}

  const imgState = (await s.get(IMAGE_STATE_KEY, { type: 'json' })) || {};
  let ids = Array.isArray(imgState.doneIds) ? imgState.doneIds.slice() : [];
  if (!ids.length) throw new Error('no image-purge doneIds');
  if (MAX > 0) ids = ids.slice(0, MAX);

  const done = new Set(state.doneIds || []);
  const todo = ids.filter((id) => !done.has(id));
  console.log(JSON.stringify({ phase: 'pexels-start', todo: todo.length, already: done.size }));

  await emailOne(
    'PULSE Pexels gap-fill started',
    '<p>Filling image gaps with <b>Pexels</b> (18s throttle) on the ' +
      todo.length +
      ' image-purged entries. One email per filled page.</p>'
  );

  const idx = await s.get('_index.json', { type: 'json', consistency: 'strong' });
  let filled = 0;
  let skipped = 0;
  let misses = 0;
  let dirty = false;

  for (const id of todo) {
    const row = (idx.entries || []).find((e) => e && e.id === id) || { id };
    let blob = null;
    try {
      blob = await s.get('answers/' + id + '.json', { type: 'json' });
    } catch (e) {}

    if (!needsCover(row, blob) && row.cover_src === 'pexels') {
      skipped++;
      done.add(id);
      continue;
    }

    const title = (blob && blob.question) || row.question || id;
    const query = deriveImageSearchQuery(title);
    try {
      const data = await pexelsSearch(query);
      const srcUrl = bestPhoto(data.photos);
      if (!srcUrl) {
        misses++;
        done.add(id);
        console.log(JSON.stringify({ id, miss: true, query }));
        continue;
      }
      const buf = await download(srcUrl);
      const dest = path.join(ASSET_DIR, id + '.jpg');
      await storeGradedImage(buf, dest, {
        square: 760,
        faceCard: true,
        cropPosition: 'attention',
        bright: false,
      });

      const rel = '/assets/qa/' + id + '.jpg';
      const i = (idx.entries || []).findIndex((e) => e && e.id === id);
      if (i >= 0) {
        idx.entries[i].img = rel;
        idx.entries[i].cover_src = 'pexels';
        idx.entries[i].face_title_baked = false;
        dirty = true;
      }
      if (blob) {
        // promote cover in body if leading image was purged/mangled — keep slot count
        let ans = String(blob.answer || '');
        const lead = ans.match(/^﻿?\s*!\[[^\]]*\]\([^)]*\)\s*\n*/);
        if (lead) {
          const alt = (title || id).replace(/[\[\]"]/g, '').slice(0, 80);
          ans = '![' + alt + '](' + rel + ')\n\n' + ans.replace(/^﻿?\s*!\[[^\]]*\]\([^)]*\)\s*\n*/, '');
        }
        await s.setJSON(
          'answers/' + id + '.json',
          Object.assign({}, blob, {
            answer: ans,
            img: rel,
            cover_src: 'pexels',
            pexels_filled_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
        );
      }

      filled++;
      done.add(id);
      const url = knowledgeUrl(id);
      await emailOne(
        'PULSE Pexels image filled — ' + id,
        '<p>Cover filled via <b>Pexels</b> (self-hosted).</p>' +
          '<p><b>Check:</b> <a href="' +
          url +
          '">' +
          url +
          '</a></p>' +
          '<p>query: <code>' +
          String(query).replace(/</g, '') +
          '</code></p>'
      );

      if (filled % 10 === 0) {
        await s.setJSON('_index.json', idx);
        dirty = false;
        state.doneIds = [...done];
        state.filled = (state.filled || 0) + filled;
        state.skipped = (state.skipped || 0) + skipped;
        state.misses = (state.misses || 0) + misses;
        state.lastId = id;
        state.lastRunAt = new Date().toISOString();
        await s.setJSON(STATE_KEY, state);
        console.log(JSON.stringify({ progress: true, filled, skipped, misses, id, query }));
      } else {
        console.log(JSON.stringify({ filled: true, id, query }));
      }
    } catch (e) {
      console.log(JSON.stringify({ id, err: String(e.message || e).slice(0, 160) }));
      // retry later — do not mark done on hard errors
      await new Promise((r) => setTimeout(r, 5000));
    }
  }

  if (dirty) await s.setJSON('_index.json', idx);
  state.doneIds = [...done];
  state.filled = (state.filled || 0) + filled;
  state.skipped = (state.skipped || 0) + skipped;
  state.misses = (state.misses || 0) + misses;
  state.complete = true;
  state.lastRunAt = new Date().toISOString();
  await s.setJSON(STATE_KEY, state);

  await emailOne(
    'PULSE Pexels gap-fill finished — ' + filled + ' filled',
    '<p>filled=' + filled + ' skipped=' + skipped + ' misses=' + misses + '</p>' +
      '<p>Files written under <code>assets/qa/</code> — deploy needed for static CDN.</p>'
  );
  console.log(JSON.stringify({ done: true, filled, skipped, misses }));
}

main().catch((e) => {
  console.error(JSON.stringify({ fatal: String(e.message || e) }));
  process.exit(1);
});
