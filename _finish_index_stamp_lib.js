/**
 * Robust _index.json quality_score stamp.
 * Answers blob is source of truth; index is merged under a lock + verify
 * so scrubber / parallel writers cannot silently drop finish scores.
 */
const fs = require('fs');
const { lockTlIndexRow, isTlId } = require('/workspace/_tl_cover_lock_lib');

const LOCK = process.env.INDEX_STAMP_LOCK || '/tmp/pulse-index-stamp.lock';
const MAX_WAIT_MS = 20000;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function withIndexLock(fn) {
  const started = Date.now();
  while (Date.now() - started < MAX_WAIT_MS) {
    try {
      fs.writeFileSync(LOCK, String(process.pid) + ' ' + Date.now(), { flag: 'wx' });
      try {
        return await fn();
      } finally {
        try {
          fs.unlinkSync(LOCK);
        } catch (_e) {}
      }
    } catch (_e) {
      // stale lock (>90s) → break
      try {
        const st = fs.statSync(LOCK);
        if (Date.now() - st.mtimeMs > 90000) fs.unlinkSync(LOCK);
      } catch (_e2) {}
      await sleep(80 + Math.floor(Math.random() * 160));
    }
  }
  // last resort without lock
  return fn();
}

/**
 * Stamp one or many ids from answer blobs into _index.json.
 * @param {object} store netlify blob store
 * @param {string[]} ids
 * @param {{log?: Function}} opts
 */
async function stampIndexFromAnswers(store, ids, opts) {
  const log = (opts && opts.log) || (() => {});
  const lockTlCover = !!(opts && opts.lockTlCover);
  const uniq = Array.from(new Set((ids || []).filter(Boolean)));
  if (!uniq.length) return { updated: 0, ok: 0, missing: 0 };

  return withIndexLock(async () => {
    const scores = new Map();
    for (let i = 0; i < uniq.length; i += 40) {
      const chunk = uniq.slice(i, i + 40);
      const rows = await Promise.all(
        chunk.map(async (id) => {
          try {
            const a = await store.get('answers/' + id + '.json', { type: 'json' });
            return [id, a];
          } catch {
            return [id, null];
          }
        })
      );
      for (const [id, a] of rows) {
        if (!a) continue;
        const score = Number(a.quality_score) || 0;
        if (score < 13 && !a.tl_finish_drip_at && !a.finish_drip_at) continue;
        scores.set(id, {
          quality_score: score,
          polished_at: a.polished_at,
          tl_finish_drip_at: a.tl_finish_drip_at || a.finish_drip_at,
          images_deferred_at: a.images_deferred_at,
        });
      }
    }
    if (!scores.size) return { updated: 0, ok: 0, missing: uniq.length };

    let updated = 0;
    let ok = 0;
    let missing = 0;
    for (let attempt = 0; attempt < 3; attempt++) {
      const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
      const entries = (idx && idx.entries) || [];
      const byId = new Map(entries.map((e, i) => [e.id, i]));
      updated = 0;
      missing = 0;
      for (const [id, patch] of scores) {
        const i = byId.get(id);
        if (i == null) {
          missing++;
          continue;
        }
        const e = entries[i];
        const score = Math.max(Number(e.quality_score) || 0, Number(patch.quality_score) || 0);
        const wantLock = lockTlCover && isTlId(id);
        const locked = wantLock ? lockTlIndexRow(e, id) : e;
        const coverSame =
          !wantLock ||
          (e.img === locked.img && e.cover_src === 'cro-cover-locked' && !e.face_title_baked);
        if (
          (Number(e.quality_score) || 0) === score &&
          e.tl_finish_drip_at === patch.tl_finish_drip_at &&
          coverSame
        ) {
          ok++;
          continue;
        }
        entries[i] = Object.assign({}, locked, {
          quality_score: score,
          polished_at: patch.polished_at || e.polished_at,
          tl_finish_drip_at: patch.tl_finish_drip_at || e.tl_finish_drip_at,
          images_deferred_at: e.images_deferred_at || patch.images_deferred_at || undefined,
        });
        updated++;
      }
      if (!updated) return { updated: 0, ok, missing };
      idx.entries = entries;
      await store.setJSON('_index.json', idx);

      // verify sample / all stamped
      const verify = await store.get('_index.json', { type: 'json', consistency: 'strong' });
      const vmap = Object.fromEntries(((verify && verify.entries) || []).map((e) => [e.id, e]));
      let bad = 0;
      for (const [id, patch] of scores) {
        const e = vmap[id];
        if (!e || (Number(e.quality_score) || 0) < Math.min(13, Number(patch.quality_score) || 0)) bad++;
      }
      if (!bad) {
        log('INDEX stamp ok updated=' + updated + ' attempt=' + (attempt + 1));
        return { updated, ok: scores.size - missing, missing };
      }
      log('INDEX stamp verify miss bad=' + bad + ' retry=' + (attempt + 1));
      await sleep(200);
    }
    return { updated, ok, missing };
  });
}

module.exports = { stampIndexFromAnswers, withIndexLock };
