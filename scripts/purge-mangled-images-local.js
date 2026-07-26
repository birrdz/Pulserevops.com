#!/usr/bin/env node
// Local mangled/broken image purge — newest→oldest until gone.
// Strips mangled Flux-junk hotlinks + defunct/broken image slots from answer
// blobs. Does NOT target "white pixel" photos. Emails each fixed URL.
// LAW: visual-lock untouched; purged body becomes new original.

const { getStore } = require('@netlify/blobs');

const SITE_ID = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const KEY = 'pulsemachine-writer-2026';
const SITE = 'https://pulserevops.com';
const STATE_KEY = '_mangled_image_purge_state.json';
const LIMIT = parseInt(process.env.PURGE_LIMIT || '5000', 10);
// Owner cadence: process PURGE_MAX_NEW=2750 (full wave), THEN fact-check that same batch.
const MAX_NEW = parseInt(process.env.PURGE_MAX_NEW || '0', 10); // if >0, only process this many not-yet-done
const BATCH_LOG = parseInt(process.env.PURGE_BATCH_LOG || '25', 10);
// PURGE_REPROCESS=1 → re-run purge on existing doneIds (or PURGE_IDS_JSON list), do not scan "new" ids
const REPROCESS = String(process.env.PURGE_REPROCESS || '') === '1';
const IDS_JSON = process.env.PURGE_IDS_JSON || ''; // optional path/blob key override via local file path

const MANGLED_RX =
  /(?:%2C%20|,)\s*realistic\s+magazine\s+style|nologo=true|model=flux|image\.pollinations\.ai|no%20watermark\?width=|prompt\/[^)\s]*no%20text/i;

function store() {
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
  if (!tok) throw new Error('BLOBS_PAT required');
  return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok });
}

function entryTs(e) {
  const vals = [e.ts, e.polished_at, e.was_indexed_at, e.last_modified_ms].map((v) =>
    typeof v === 'number' ? v : typeof v === 'string' && /^\d+$/.test(v) ? +v : 0
  );
  return Math.max(0, ...vals);
}

function knowledgeUrl(id) {
  return SITE + '/knowledge/' + encodeURIComponent(id);
}

function isMangled(u) {
  return MANGLED_RX.test(String(u || ''));
}

function lineHasBadImage(line) {
  if (!/!\[[^\]]*\]\(/i.test(line) && !(/@@PRODUCT/i.test(line) && /img="/i.test(line))) return false;
  if (isMangled(line)) return true;
  // Broken markdown image with junk after .png/.jpg closing paren early
  if (/!\[[^\]]*\]\([^)]+\.(?:png|jpe?g|webp|gif)\)[%?]/i.test(line) && /flux|nologo|realistic/i.test(line))
    return true;
  return false;
}

function stripBadImages(answer) {
  const lines = String(answer || '').split('\n');
  const out = [];
  const removed = [];
  for (let line of lines) {
    if (/!\[[^\]]*\]\(/i.test(line) && lineHasBadImage(line)) {
      const m = line.match(/!\[[^\]]*\]\((.+)\)\s*$/) || line.match(/!\[[^\]]*\]\(([^)\s]+)\)/);
      removed.push(m ? m[1].slice(0, 240) : line.slice(0, 120));
      continue;
    }
    if (/@@PRODUCT/i.test(line) && /img="/i.test(line) && isMangled(line)) {
      const before = line;
      line = line.replace(/\s*img="[^"]*"/i, '');
      if (line !== before) removed.push('@@PRODUCT img stripped');
    }
    out.push(line);
  }
  return { answer: out.join('\n').replace(/\n{3,}/g, '\n\n').trim(), removed };
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

async function classifyDefunct(url) {
  if (!url || isMangled(url)) return true;
  if (/\/assets\/cro-cover-\d+\.jpg/i.test(url)) return false;
  const abs = /^https?:\/\//i.test(url) ? url : url[0] === '/' ? SITE + url : '';
  if (!abs) return false;
  // Only check self-hosted assets for defunct; skip external hotlinks that aren't mangled
  if (!/pulserevops\.com\/assets\//i.test(abs) && !/^\/assets\//i.test(url)) return false;
  try {
    const r = await fetch(abs, {
      method: 'GET',
      headers: { 'User-Agent': 'PulseMangledPurge/1.0', Accept: 'image/*' },
      redirect: 'follow',
      signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) return true;
    const ct = (r.headers.get('content-type') || '').toLowerCase();
    const buf = Buffer.from(await r.arrayBuffer());
    return !ct.startsWith('image/') || buf.length < 800;
  } catch (e) {
    return true;
  }
}

async function main() {
  const s = store();
  let state = { doneIds: [], purged: 0, scanned: 0, skipped: 0 };
  try {
    state = Object.assign(state, (await s.get(STATE_KEY, { type: 'json' })) || {});
  } catch (e) {}

  const idx = await s.get('_index.json', { type: 'json', consistency: 'strong' });
  if (!idx || !Array.isArray(idx.entries)) throw new Error('no index');

  const rows = idx.entries
    .filter((e) => e && e.id && /^[a-z]{2,3}\d/i.test(String(e.id)))
    .slice()
    .sort((a, b) => entryTs(b) - entryTs(a))
    .slice(0, LIMIT);

  const done = new Set(state.doneIds || []);
  let todo;
  if (REPROCESS || IDS_JSON) {
    let ids = [];
    if (IDS_JSON) {
      const fs = require('fs');
      ids = JSON.parse(fs.readFileSync(IDS_JSON, 'utf8'));
      if (ids && ids.ids) ids = ids.ids;
    } else {
      ids = (state.doneIds || []).slice();
    }
    if (!Array.isArray(ids) || !ids.length) throw new Error('reprocess: no ids');
    if (MAX_NEW > 0) ids = ids.slice(0, MAX_NEW);
    const byId = new Map(rows.map((e) => [e.id, e]));
    todo = ids.map((id) => byId.get(id) || { id });
    // allow re-processing these ids
    for (const id of ids) done.delete(id);
    console.log(
      JSON.stringify({
        phase: 'reprocess-start',
        todo: todo.length,
        maxNew: MAX_NEW || null,
        note: 'full restart on locked wave — mangled purge first',
      })
    );
  } else {
    todo = rows.filter((e) => !done.has(e.id));
    if (MAX_NEW > 0) todo = todo.slice(0, MAX_NEW);
    console.log(
      JSON.stringify({
        phase: 'start',
        limit: LIMIT,
        maxNew: MAX_NEW || null,
        todo: todo.length,
        alreadyDone: done.size,
      })
    );
  }

  // No batch-start email on reprocess (owner wants per-page only when something changes)
  if (!REPROCESS && !IDS_JSON) {
    await emailOne(
      'PULSE mangled/broken image purge started',
      '<p>Purging mangled/broken image slots (not white photos) newest→oldest.</p>' +
        '<p>Queue: <b>' +
        todo.length +
        '</b> of newest ' +
        LIMIT +
        '. One email per purged page.</p>'
    );
  }

  let purged = 0;
  let scanned = 0;
  let skipped = 0;
  let indexDirty = false;

  for (const row of todo) {
    const id = row.id;
    scanned++;
    let blob;
    try {
      blob = await s.get('answers/' + id + '.json', { type: 'json' });
    } catch (e) {
      done.add(id);
      continue;
    }
    if (!blob || typeof blob.answer !== 'string') {
      skipped++;
      done.add(id);
      continue;
    }

    const { answer: cleaned, removed } = stripBadImages(blob.answer);

    // Also drop defunct self-hosted cover if broken
    let coverBad = false;
    const cover = row.img || blob.img || '';
    if (cover && (isMangled(cover) || (await classifyDefunct(cover)))) {
      // Try canonical remap first
      const canon = '/assets/qa/' + id + '.jpg';
      const canonDead = await classifyDefunct(canon);
      const i = (idx.entries || []).findIndex((e) => e && e.id === id);
      if (!canonDead && /\/assets\/qa\//i.test(cover)) {
        if (i >= 0) {
          idx.entries[i].img = canon;
          indexDirty = true;
        }
        // swap in body if present
        blob.answer = String(cleaned || blob.answer).split(cover).join(canon);
        blob.img = canon;
        blob.white_audit_remapped_at = new Date().toISOString();
        await s.setJSON('answers/' + id + '.json', blob);
        const url = knowledgeUrl(id);
        purged++;
        await emailOne(
          'PULSE image remapped — ' + id,
          '<p>Defunct cover → canonical.</p><p><a href="' + url + '">' + url + '</a></p>'
        );
        done.add(id);
        if (purged % BATCH_LOG === 0) {
          state.doneIds = [...done];
          state.purged = (state.purged || 0) + purged;
          state.scanned = (state.scanned || 0) + scanned;
          await s.setJSON(STATE_KEY, state);
          console.log(JSON.stringify({ progress: true, scanned, purged, skipped, id }));
        }
        continue;
      }
      coverBad = true;
      if (cover) removed.push(cover);
    }

    if (!removed.length && cleaned === blob.answer && !coverBad) {
      skipped++;
      done.add(id);
      if (scanned % 100 === 0) {
        console.log(JSON.stringify({ progress: true, scanned, purged, skipped, id, note: 'clean' }));
        state.doneIds = [...done];
        state.scanned = (state.scanned || 0) + scanned;
        await s.setJSON(STATE_KEY, state);
      }
      continue;
    }

    const banned = Array.isArray(blob.purged_image_urls) ? blob.purged_image_urls.slice() : [];
    for (const u of removed) {
      const n = String(u).replace(/\?.*$/, '');
      if (n && !banned.includes(n)) banned.push(n);
    }
    const ts = new Date().toISOString();
    const next = Object.assign({}, blob, {
      answer: cleaned,
      purged_image_urls: banned,
      face_purged_at: ts,
      face_purge_reason: 'mangled-or-broken',
      updated_at: ts,
    });
    if (coverBad) {
      next.cover_src = null;
      next.face_title_baked = false;
      delete next.img;
      const i = (idx.entries || []).findIndex((e) => e && e.id === id);
      if (i >= 0) {
        const ent = Object.assign({}, idx.entries[i]);
        delete ent.img;
        delete ent.cover_src;
        ent.face_purged_at = ts;
        ent.face_purge_reason = 'mangled-or-broken';
        ent.purged_image_urls = banned;
        idx.entries[i] = ent;
        indexDirty = true;
      }
    }

    await s.setJSON('answers/' + id + '.json', next);
    purged++;
    const url = knowledgeUrl(id);
    await emailOne(
      'PULSE mangled/broken image removed — ' + id,
      '<p>Removed mangled/broken image slot(s). Visual-lock intact (purged body = new original).</p>' +
        '<p><b>Check:</b> <a href="' +
        url +
        '">' +
        url +
        '</a></p>' +
        '<ul>' +
        removed.map((u) => '<li><code>' + String(u).replace(/</g, '').slice(0, 220) + '</code></li>').join('') +
        '</ul>'
    );

    done.add(id);
    if (purged % BATCH_LOG === 0 || scanned % 50 === 0) {
      state.doneIds = [...done];
      if (state.doneIds.length > 25000) state.doneIds = state.doneIds.slice(-25000);
      state.purged = (state.purged || 0) + purged;
      state.scanned = (state.scanned || 0) + scanned;
      state.lastId = id;
      state.lastRunAt = ts;
      await s.setJSON(STATE_KEY, state);
      if (indexDirty) {
        await s.setJSON('_index.json', idx);
        indexDirty = false;
      }
      console.log(JSON.stringify({ progress: true, scanned, purged, skipped, id }));
    }
  }

  if (indexDirty) await s.setJSON('_index.json', idx);
  state.doneIds = [...done];
  if (state.doneIds.length > 25000) state.doneIds = state.doneIds.slice(-25000);
  state.purged = (state.purged || 0) + purged;
  state.scanned = (state.scanned || 0) + scanned;
  state.skipped = (state.skipped || 0) + skipped;
  state.lastRunAt = new Date().toISOString();
  state.complete = true;
  await s.setJSON(STATE_KEY, state);

  if (!REPROCESS && !IDS_JSON) {
    await emailOne(
      'PULSE mangled/broken purge finished — ' + purged + ' fixed',
      '<p>Finished newest ' +
        LIMIT +
        '.</p><p>scanned=' +
        scanned +
        ' purged=' +
        purged +
        ' clean/skipped=' +
        skipped +
        '</p>'
    );
  }
  console.log(JSON.stringify({ done: true, reprocess: !!(REPROCESS || IDS_JSON), scanned, purged, skipped }));
}

main().catch((e) => {
  console.error(JSON.stringify({ fatal: String(e.message || e) }));
  process.exit(1);
});
