// pulse-white-image-audit-background — scan newest→oldest for blank/white and
// mangled/defunct images, strip them from answer blobs + bad covers, email EACH
// fixed knowledge URL so the owner can spot-check.
//
// LAW: do NOT weaken visual-lock / preserveImages. Purged answer becomes the
// new original so white/mangled URLs cannot be restored by preserveImages.
//
// Trigger: POST /.netlify/functions/pulse-white-image-audit-background
//   body: { key:'pulsemachine-writer-2026', batch:500, force?:true }
// Cron: every 15 min via netlify.toml

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

// Mangled Flux/hotlink leftovers (ca0432 class): real URL + prompt junk.
const MANGLED_RX =
  /(?:%2C%20|,)\s*realistic\s+magazine\s+style|nologo=true|model=flux|image\.pollinations\.ai|prompt\/[^)\s]*no%20text|no%20watermark\?width=/i;

function initStore() {
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  try {
    return getStore('pulse-machine-library');
  } catch (e) {
    return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok });
  }
}

function entryTs(e) {
  const vals = [e.ts, e.polished_at, e.was_indexed_at, e.last_modified_ms].map((v) =>
    typeof v === 'number' ? v : typeof v === 'string' && /^\d+$/.test(v) ? +v : 0
  );
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

function normUrl(u) {
  return String(u || '').replace(/\?.*$/, '').trim();
}

async function emailOne(subject, html) {
  const rs = process.env.RESEND_API_KEY || process.env.resendapikey || process.env.RESENDAPIKEY;
  const from = process.env.ALERT_FROM_EMAIL || process.env.alert_from_email || 'onboarding@resend.dev';
  // Prefer live notify (works from this site); Resend direct as backup.
  try {
    await fetch(SITE + '/.netlify/functions/pulse-progress-notify?key=' + KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, html, to: RECIPIENT }),
      signal: AbortSignal.timeout(12000),
    });
    return;
  } catch (e) {}
  if (!rs) return;
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + rs, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [RECIPIENT], subject, html }),
      signal: AbortSignal.timeout(15000),
    });
  } catch (e) {}
}

function isMangled(u) {
  return MANGLED_RX.test(String(u || ''));
}

/** Extract markdown image URLs — allow junk past first ')' for mangled lines. */
function extractMdImageUrls(answer) {
  const urls = [];
  const lines = String(answer || '').split('\n');
  for (const line of lines) {
    // Full mangled form: ![alt](url)junk) OR normal ![alt](url)
    let m = line.match(/!\[[^\]]*\]\((https?:\/\/[^\s]+|\/assets\/[^\s)]+)\)/i);
    if (!m) m = line.match(/!\[[^\]]*\]\(([^)\s]+)\)/);
    if (m) urls.push(m[1]);
    // If line has mangled flux junk, capture the whole paren payload
    if (isMangled(line)) {
      const m2 = line.match(/!\[[^\]]*\]\((.+)\)\s*$/);
      if (m2) urls.push(m2[1]);
    }
    const pm = line.match(/@@PRODUCT[^]*?\bimg="([^"]+)"/i);
    if (pm) urls.push(pm[1]);
  }
  return [...new Set(urls.filter(Boolean))];
}

/** Fetch image bytes; classify ok / defunct / white / mangled. */
async function classifyImage(url) {
  if (isMangled(url)) return { kind: 'mangled', url };
  const abs = absUrl(url);
  if (!abs) return { kind: 'empty' };
  // Skip classifying shared CRO pool assets as purge targets
  if (/\/assets\/cro-cover-\d+\.jpg/i.test(url) || /\/assets\/cro-cover-\d+\.jpg/i.test(abs)) {
    return { kind: 'ok', url: abs, skipPurge: true };
  }
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
      // Blank page = nearly all white pixels
      white = (mean >= 235 && whitePct >= 0.9) || whitePct >= 0.95;
    } catch (e) {
      const ff = buf.filter((b) => b >= 0xf0).length / buf.length;
      if (buf.length < 8000 && ff > 0.55) white = true;
    }
    if (white) return { kind: 'white', url: abs, mean, whitePct, bytes: buf.length };
    return { kind: 'ok', url: abs, bytes: buf.length, mean, whitePct };
  } catch (e) {
    return { kind: 'defunct', url: abs, reason: String(e.message || e).slice(0, 80) };
  }
}

function stripBadFromBody(body, badUrls) {
  let b = String(body || '');
  const ban = new Set((badUrls || []).map((u) => normUrl(u)));
  // Also ban by distinctive mangled substrings
  const lines = b.split('\n');
  const out = [];
  for (let line of lines) {
    const isImgLine = /!\[[^\]]*\]\(/i.test(line);
    const isProd = /@@PRODUCT/i.test(line) && /img="/i.test(line);

    if (isImgLine) {
      if (isMangled(line)) continue; // drop whole mangled image line
      const m = line.match(/!\[[^\]]*\]\(([^)\s]+)\)/) || line.match(/!\[[^\]]*\]\((.+)\)\s*$/);
      if (m) {
        const u = normUrl(m[1]);
        const rel = u.replace(/^https?:\/\/(?:www\.)?pulserevops\.com/i, '');
        if (
          ban.has(u) ||
          ban.has(rel) ||
          [...ban].some((x) => x && (u.includes(x) || rel.includes(x) || line.includes(x)))
        ) {
          continue;
        }
      }
    }

    if (isProd) {
      for (const bad of ban) {
        if (bad && line.includes(bad)) {
          line = line.replace(/\s*img="[^"]*"/i, '');
          break;
        }
      }
      if (isMangled(line)) line = line.replace(/\s*img="[^"]*"/i, '');
    }

    out.push(line);
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

async function savePurged(store, idx, entryRow, blob, badUrls, reason, coverBad) {
  const id = entryRow.id;
  const purgedList = Array.isArray(entryRow.purged_image_urls) ? entryRow.purged_image_urls.slice() : [];
  for (const u of badUrls) {
    const n = normUrl(u);
    if (n && !purgedList.includes(n)) purgedList.push(n);
  }
  const ts = new Date().toISOString();

  if (blob) {
    const prevBanned = Array.isArray(blob.purged_image_urls) ? blob.purged_image_urls : [];
    const banned = [...new Set(prevBanned.concat(purgedList))];
    const newAnswer = stripBadFromBody(blob.answer || '', banned);
    const next = Object.assign({}, blob, {
      answer: newAnswer,
      face_purged_at: ts,
      face_purge_reason: reason,
      purged_image_urls: banned,
      updated_at: ts,
    });
    if (coverBad) {
      next.cover_src = null;
      next.face_title_baked = false;
    }
    await store.setJSON('answers/' + id + '.json', next);
  }

  const i = (idx.entries || []).findIndex((e) => e && e.id === id);
  if (i >= 0) {
    const ent = Object.assign({}, idx.entries[i]);
    if (coverBad) {
      delete ent.img;
      delete ent.cover_src;
      delete ent.face_title_baked;
    }
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

  const batch = Math.min(
    800,
    Math.max(50, parseInt(body.batch || process.env.WHITE_AUDIT_BATCH || DEFAULT_BATCH, 10) || DEFAULT_BATCH)
  );
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
      let blob = null;
      try {
        blob = await store.get('answers/' + id + '.json', { type: 'json' });
      } catch (e) {}

      const cover = row.img || row.cover || '';
      const bodyUrls = blob && blob.answer ? extractMdImageUrls(blob.answer) : [];
      const candidates = [...new Set([cover, ...bodyUrls].filter(Boolean))];

      const bad = [];
      const reasons = [];
      let coverBad = false;
      let coverRemapped = false;

      for (const u of candidates) {
        if (/\/assets\/cro-cover-\d+\.jpg/i.test(u)) continue;

        // Fast path: mangled markdown / flux junk — no fetch needed
        if (isMangled(u)) {
          bad.push(u);
          reasons.push('mangled');
          if (cover && (u === cover || normUrl(u) === normUrl(cover))) coverBad = true;
          continue;
        }

        let cls = await classifyImage(u);
        if (cls.kind === 'ok') continue;

        // Versioned / defunct cover → try canonical face before purge
        const isCover = cover && (u === cover || normUrl(u) === normUrl(cover) || absUrl(u) === absUrl(cover));
        if ((cls.kind === 'defunct' || /\/assets\/qa\/[^/]+-v\d+\.jpg/i.test(u)) && isCover) {
          const canon = canonFace(id);
          const c2 = await classifyImage(canon);
          if (c2.kind === 'ok') {
            const i = (idx.entries || []).findIndex((e) => e && e.id === id);
            if (i >= 0) {
              idx.entries[i].img = canon;
              idx.entries[i].cover_src = idx.entries[i].cover_src || 'flux';
            }
            if (blob) {
              let ans = String(blob.answer || '');
              const from = String(u);
              ans = ans.split(from).join(canon);
              ans = ans.split(SITE + from).join(SITE + canon);
              ans = ans.split(normUrl(from)).join(canon);
              await store.setJSON(
                'answers/' + id + '.json',
                Object.assign({}, blob, {
                  answer: ans,
                  img: canon,
                  updated_at: new Date().toISOString(),
                  white_audit_remapped_at: new Date().toISOString(),
                })
              );
              blob = await store.get('answers/' + id + '.json', { type: 'json' });
            }
            remapped++;
            coverRemapped = true;
            const url = knowledgeUrl(id);
            fixed.push({ id, action: 'remap', url, from: u, to: canon });
            await emailOne(
              'PULSE image remapped — ' + id,
              '<p>Remapped defunct/versioned cover → canonical. Visual-lock intact (no old-image revive).</p>' +
                '<p><a href="' +
                url +
                '">' +
                url +
                '</a></p>' +
                '<p>from: <code>' +
                String(u).replace(/</g, '') +
                '</code><br>to: <code>' +
                canon +
                '</code></p>'
            );
            continue;
          }
        }

        if (cls.kind === 'white' || cls.kind === 'defunct' || cls.kind === 'mangled') {
          bad.push(u);
          reasons.push(cls.kind + (cls.reason ? ':' + cls.reason : ''));
          if (isCover) coverBad = true;
        }
      }

      if (bad.length) {
        const reason = [...new Set(reasons)].join(',') || 'white-or-defunct';
        const url = await savePurged(store, idx, row, blob, bad, reason, coverBad);
        purgedN++;
        fixed.push({ id, action: 'purge', url, reason, bad, coverBad });
        await emailOne(
          'PULSE blank/mangled image removed — ' + id,
          '<p>Removed blank/white or mangled/defunct image slot(s). Stored answer updated so visual-lock cannot restore them.</p>' +
            '<p><b>Check this page:</b> <a href="' +
            url +
            '">' +
            url +
            '</a></p>' +
            '<p>reason: <code>' +
            String(reason).replace(/</g, '') +
            '</code> · coverCleared=' +
            coverBad +
            '</p>' +
            '<ul>' +
            bad.map((u) => '<li><code>' + String(u).replace(/</g, '').slice(0, 220) + '</code></li>').join('') +
            '</ul>'
        );
      } else if (!coverRemapped) {
        okN++;
      }

      doneSet.add(id);
    }

    await store.setJSON('_index.json', idx);
    state.doneIds = [...doneSet];
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

    if (fixed.length) {
      await emailOne(
        'PULSE white-image batch — ' + fixed.length + ' fixed / ' + slice.length + ' scanned',
        '<p>Newest→oldest. Each fixed URL was emailed individually above for spot-check.</p>' +
          '<p>scanned=' +
          slice.length +
          ' purged=' +
          purgedN +
          ' remapped=' +
          remapped +
          ' ok=' +
          okN +
          '</p>' +
          '<ul>' +
          fixed
            .slice(0, 50)
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
