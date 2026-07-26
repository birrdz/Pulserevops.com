// pulse-white-image-audit-background — scan newest→oldest covers for white/defunct
// images, clear them from index + answer blob, email each fixed knowledge URL.
//
// LAW: do NOT weaken visual-lock / preserveImages. We only UPDATE the stored
// answer so the purged body becomes the new original (old white URLs cannot
// be restored by preserveImages). Stamp face_purged + purged_image_urls ban.
//
// Trigger: POST /.netlify/functions/pulse-white-image-audit-background
//   body: { key:'pulsemachine-writer-2026', batch:500 }
// Or scheduled every 15 min via netlify.toml.
// Uses Netlify site env: BLOBS_PAT, RESEND_API_KEY.

const { getStore } = require('@netlify/blobs');

const SITE_ID = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const KEY = 'pulsemachine-writer-2026';
const RECIPIENT = 'koryjordanwhite@gmail.com';
const STATE_KEY = '_white_image_audit_state.json';
const LOCK_KEY = '_white_image_audit_lock.json';
const LOCK_MS = 14 * 60 * 1000;
const DEFAULT_BATCH = 500;
const SITE = 'https://pulserevops.com';
const UA = 'PulseWhiteImageAudit/1.0';

function initStore() {
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  try {
    return getStore('pulse-machine-library');
  } catch (e) {
    return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok });
  }
}

function entryTs(e) {
  const vals = [e.ts, e.polished_at, e.was_indexed_at, e.last_modified_ms]
    .map((v) => (typeof v === 'number' ? v : typeof v === 'string' && /^\d+$/.test(v) ? +v : 0));
  return Math.max(0, ...vals);
}

function canonFace(id) {
  return '/assets/qa/' + id + '.jpg';
}

function absUrl(u) {
  if (!u) return '';
  if (/^https?:\/\//i.test(u)) return u;
  if (u[0] === '/') return SITE + u;
  return '';
}

function knowledgeUrl(id) {
  return SITE + '/knowledge/' + encodeURIComponent(id);
}

async function emailOne(subject, html) {
  const rs = process.env.RESEND_API_KEY || process.env.resendapikey || process.env.RESENDAPIKEY;
  const from = process.env.ALERT_FROM_EMAIL || process.env.alert_from_email || 'onboarding@resend.dev';
  if (!rs) {
    // Fallback to live notify (also Resend on site)
    try {
      await fetch(SITE + '/.netlify/functions/pulse-progress-notify?key=' + KEY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, html }),
        signal: AbortSignal.timeout(12000),
      });
    } catch (e) {}
    return;
  }
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + rs, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [RECIPIENT], subject, html }),
      signal: AbortSignal.timeout(15000),
    });
  } catch (e) {}
}

/** Fetch image bytes; classify ok / defunct / white. */
async function classifyImage(url) {
  const abs = absUrl(url);
  if (!abs) return { kind: 'empty' };
  try {
    const r = await fetch(abs, {
      headers: { 'User-Agent': UA, Accept: 'image/*' },
      redirect: 'follow',
      signal: AbortSignal.timeout(12000),
    });
    if (!r.ok) return { kind: 'defunct', status: r.status, url: abs };
    const ct = (r.headers.get('content-type') || '').toLowerCase();
    const buf = Buffer.from(await r.arrayBuffer());
    if (!ct.startsWith('image/') || buf.length < 1200) {
      return { kind: 'defunct', status: r.status, url: abs, reason: 'not-image-or-tiny', bytes: buf.length };
    }
    // JPEG/PNG near-white heuristic without sharp: sample luminance from raw-ish decode via createImageBitmap not available in Node.
    // Use simple JPEG scan: if file is tiny AND mostly 0xFF bytes → white page.
    // Prefer pixel decode when sharp is available.
    let white = false;
    let mean = null;
    let whitePct = null;
    try {
      const sharp = require('sharp');
      const { data, info } = await sharp(buf)
        .resize(96, 96, { fit: 'inside' })
        .removeAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const n = info.width * info.height;
      let sum = 0;
      let w = 0;
      for (let i = 0; i < data.length; i += 3) {
        const m = (data[i] + data[i + 1] + data[i + 2]) / 3;
        sum += m;
        if (m >= 245) w++;
      }
      mean = sum / n;
      whitePct = w / n;
      white = (mean >= 235 && whitePct >= 0.9) || whitePct >= 0.95;
    } catch (e) {
      // Fallback: very small bright JPEG often = blank
      const ff = buf.filter((b) => b >= 0xf0).length / buf.length;
      if (buf.length < 8000 && ff > 0.55) white = true;
    }
    if (white) return { kind: 'white', url: abs, mean, whitePct, bytes: buf.length };
    return { kind: 'ok', url: abs, bytes: buf.length, mean, whitePct };
  } catch (e) {
    return { kind: 'defunct', url: abs, reason: String(e.message || e).slice(0, 80) };
  }
}

function stripUrlFromBody(body, urls) {
  let b = String(body || '');
  const ban = new Set((urls || []).map((u) => String(u).replace(/\?.*$/, '')));
  if (!ban.size) return b;
  const lines = b.split('\n');
  const out = [];
  for (const line of lines) {
    const m = line.match(/!\[[^\]]*\]\(([^)\s]+)\)/);
    if (m) {
      const u = m[1].replace(/\?.*$/, '');
      const rel = u.replace(/^https?:\/\/(?:www\.)?pulserevops\.com/i, '');
      if (ban.has(u) || ban.has(rel) || [...ban].some((x) => u.endsWith(x) || rel.endsWith(x))) {
        continue; // drop white/defunct image line — body becomes new original
      }
    }
    // also @@PRODUCT img="..."
    if (/@@PRODUCT/i.test(line) && /img="/i.test(line)) {
      let drop = false;
      for (const bad of ban) {
        if (line.includes(bad)) {
          // strip img attr only, keep product card
          line = line.replace(/\s*img="[^"]*"/i, '');
          drop = false;
        }
      }
      void drop;
    }
    out.push(line);
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

async function purgeEntry(store, idx, entryRow, badUrls, reason) {
  const id = entryRow.id;
  const blob = await store.get('answers/' + id + '.json', { type: 'json' });
  const purgedList = Array.isArray(entryRow.purged_image_urls) ? entryRow.purged_image_urls.slice() : [];
  for (const u of badUrls) {
    const n = String(u).replace(/\?.*$/, '');
    if (n && !purgedList.includes(n)) purgedList.push(n);
  }
  const ts = new Date().toISOString();

  if (blob) {
    const prevBanned = Array.isArray(blob.purged_image_urls) ? blob.purged_image_urls : [];
    const banned = [...new Set(prevBanned.concat(purgedList))];
    const newAnswer = stripUrlFromBody(blob.answer || '', banned);
    await store.setJSON('answers/' + id + '.json', Object.assign({}, blob, {
      answer: newAnswer,
      cover_src: null,
      face_title_baked: false,
      face_purged_at: ts,
      face_purge_reason: reason,
      purged_image_urls: banned,
      // CRITICAL: store purged answer as canonical — preserveImages will use THIS
      // as original on later writer passes, so white URLs cannot revive.
      updated_at: ts,
    }));
  }

  const i = (idx.entries || []).findIndex((e) => e && e.id === id);
  if (i >= 0) {
    const ent = Object.assign({}, idx.entries[i]);
    delete ent.img;
    delete ent.cover_src;
    delete ent.face_title_baked;
    ent.face_purged_at = ts;
    ent.face_purge_reason = reason;
    ent.purged_image_urls = purgedList;
    idx.entries[i] = ent;
  }

  return knowledgeUrl(id);
}

exports.handler = async (event) => {
  let body = {};
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {}
  if (event.httpMethod === 'POST' && body.key && body.key !== KEY) {
    return { statusCode: 401, body: JSON.stringify({ ok: false, reason: 'bad key' }) };
  }

  const batch = Math.min(800, Math.max(50, parseInt(body.batch || process.env.WHITE_AUDIT_BATCH || DEFAULT_BATCH, 10) || DEFAULT_BATCH));
  const store = initStore();

  let lock = null;
  try {
    lock = await store.get(LOCK_KEY, { type: 'json' });
  } catch (e) {}
  if (lock && lock.ts && Date.now() - lock.ts < LOCK_MS && !body.force) {
    return { statusCode: 200, body: JSON.stringify({ ok: true, locked: true }) };
  }
  await store.setJSON(LOCK_KEY, { ts: Date.now() });

  try {
    let state = { cursor: 0, scanned: 0, purged: 0, remapped: 0, ok: 0, doneIds: [] };
    try {
      state = Object.assign(state, (await store.get(STATE_KEY, { type: 'json' })) || {});
    } catch (e) {}

    const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    if (!idx || !Array.isArray(idx.entries)) {
      return { statusCode: 200, body: JSON.stringify({ ok: false, reason: 'no index' }) };
    }

    // Newest → oldest. Skip already face_purged in this campaign unless recheck.
    const rows = idx.entries
      .filter((e) => e && e.id && /^[a-z]{2,3}\d/i.test(String(e.id)))
      .slice()
      .sort((a, b) => entryTs(b) - entryTs(a));

    const doneSet = new Set(state.doneIds || []);
    const todo = rows.filter((e) => !doneSet.has(e.id));
    const slice = todo.slice(0, batch);

    const fixed = [];
    let remapped = 0;
    let okN = 0;
    let purgedN = 0;

    for (const row of slice) {
      const id = row.id;
      const img = row.img || row.cover || '';
      const candidates = [];
      if (img) candidates.push(img);
      // Also check body hero if cover empty
      let blob = null;
      try {
        blob = await store.get('answers/' + id + '.json', { type: 'json' });
      } catch (e) {}
      if (blob && blob.answer) {
        const m = String(blob.answer).slice(0, 2000).match(/!\[[^\]]*\]\(([^)\s]+)\)/);
        if (m) candidates.push(m[1]);
      }

      const bad = [];
      let reason = '';
      let anyOk = false;

      for (const u of [...new Set(candidates)]) {
        // Never treat cro-cover pool as "white page" purge targets for deletion of shared assets
        if (/\/assets\/cro-cover-\d+\.jpg/i.test(u)) {
          anyOk = true;
          continue;
        }
        let cls = await classifyImage(u);
        if (cls.kind === 'ok') {
          anyOk = true;
          continue;
        }
        // Versioned / defunct pointer → try canonical face before purge
        if (cls.kind === 'defunct' || /\/assets\/qa\/[^/]+-v\d+\.jpg/i.test(u)) {
          const canon = canonFace(id);
          const c2 = await classifyImage(canon);
          if (c2.kind === 'ok') {
            const i = (idx.entries || []).findIndex((e) => e && e.id === id);
            if (i >= 0) {
              idx.entries[i].img = canon;
              idx.entries[i].cover_src = idx.entries[i].cover_src || 'flux';
            }
            if (blob) {
              // swap URL in body only at matching slots — keep slot count (visual lock)
              const banned = [String(u).replace(/\?.*$/, '')];
              let ans = String(blob.answer || '');
              for (const b of banned) {
                ans = ans.split(b).join(canon);
                ans = ans.split(SITE + b).join(SITE + canon);
              }
              await store.setJSON('answers/' + id + '.json', Object.assign({}, blob, {
                answer: ans,
                img: canon,
                updated_at: new Date().toISOString(),
                white_audit_remapped_at: new Date().toISOString(),
              }));
              blob = null; // refreshed
            }
            remapped++;
            const url = knowledgeUrl(id);
            fixed.push({ id, action: 'remap', url, from: u, to: canon });
            await emailOne(
              'PULSE white/defunct image fixed — ' + id,
              '<p>Remapped defunct/versioned cover → canonical (did <b>not</b> revive old images).</p>' +
                '<p><a href="' + url + '">' + url + '</a></p>' +
                '<p>from: <code>' + String(u).replace(/</g, '') + '</code><br>to: <code>' + canon + '</code></p>'
            );
            anyOk = true;
            continue;
          }
        }
        if (cls.kind === 'white' || cls.kind === 'defunct') {
          bad.push(u);
          reason = cls.kind + (cls.reason ? ':' + cls.reason : '');
        }
      }

      if (bad.length && !anyOk) {
        const url = await purgeEntry(store, idx, row, bad, reason || 'white-or-defunct');
        purgedN++;
        fixed.push({ id, action: 'purge', url, reason, bad });
        await emailOne(
          'PULSE white/defunct image removed — ' + id,
          '<p>Removed white/defunct image(s). Blob answer updated so visual-lock cannot restore them.</p>' +
            '<p><a href="' + url + '">' + url + '</a></p>' +
            '<p>reason: <code>' + String(reason).replace(/</g, '') + '</code></p>' +
            '<ul>' + bad.map((u) => '<li><code>' + String(u).replace(/</g, '') + '</code></li>').join('') + '</ul>'
        );
      } else if (!bad.length) {
        okN++;
      }

      doneSet.add(id);
    }

    await store.setJSON('_index.json', idx);
    state.doneIds = [...doneSet];
    // Bound state growth — keep last 20k ids
    if (state.doneIds.length > 20000) state.doneIds = state.doneIds.slice(-20000);
    state.scanned = (state.scanned || 0) + slice.length;
    state.purged = (state.purged || 0) + purgedN;
    state.remapped = (state.remapped || 0) + remapped;
    state.ok = (state.ok || 0) + okN;
    state.lastRunAt = new Date().toISOString();
    state.lastBatch = slice.length;
    state.lastFixed = fixed.length;
    await store.setJSON(STATE_KEY, state);
    await store.setJSON(LOCK_KEY, { ts: 0 });

    // Batch summary email
    if (fixed.length) {
      await emailOne(
        'PULSE white-image audit batch — ' + fixed.length + ' fixed / ' + slice.length + ' scanned',
        '<p>Newest→oldest batch. Visual-lock / preserveImages left intact; purged bodies are the new originals.</p>' +
          '<p>scanned=' + slice.length + ' purged=' + purgedN + ' remapped=' + remapped + ' ok=' + okN + '</p>' +
          '<ul>' +
          fixed
            .slice(0, 40)
            .map((f) => '<li><a href="' + f.url + '">' + f.id + '</a> · ' + f.action + '</li>')
            .join('') +
          '</ul>'
      );
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ok: true,
        scanned: slice.length,
        remaining: Math.max(0, todo.length - slice.length),
        purged: purgedN,
        remapped,
        okN,
        fixed: fixed.length,
        totals: { scanned: state.scanned, purged: state.purged, remapped: state.remapped },
      }),
    };
  } catch (e) {
    try {
      await store.setJSON(LOCK_KEY, { ts: 0 });
    } catch (e2) {}
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: String(e.message || e) }) };
  }
};
