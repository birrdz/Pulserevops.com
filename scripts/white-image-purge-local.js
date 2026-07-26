#!/usr/bin/env node
// WHITE / MANGLED / DEFUNCT image purge — local full-inventory service.
// Strips bad slots from answer blobs (visual-lock safe). No Cursor rewrite.
// Digests emails (not per-URL). Skips the URL the Cursor drip is mid-fixing.
//
// Env:
//   WHITE_PURGE_BATCH=80          pages per tick
//   WHITE_PURGE_IDLE_MS=3000      pause when caught up / between ticks
//   WHITE_PURGE_EMAIL_EVERY=40    digest every N purged pages
//   WHITE_PURGE_ONCE=1            one tick then exit
//
// State blob: _white_image_purge_local_state.json

const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');

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
const STATE_KEY = '_white_image_purge_local_state.json';
const BUSY_FILE = '/tmp/cursor-drip-busy.id';
const BATCH = Math.max(10, parseInt(process.env.WHITE_PURGE_BATCH || '80', 10));
const IDLE_MS = Math.max(500, parseInt(process.env.WHITE_PURGE_IDLE_MS || '3000', 10));
const EMAIL_EVERY = Math.max(5, parseInt(process.env.WHITE_PURGE_EMAIL_EVERY || '10', 10));
const ONCE = String(process.env.WHITE_PURGE_ONCE || '') === '1';

const MANGLED_RX =
  /(?:%2C%20|,)\s*realistic\s+magazine\s+style|nologo=true|model=flux|image\.pollinations\.ai|no%20watermark\?width=|prompt\/[^)\s]*no%20text/i;

function store() {
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
  if (!tok) throw new Error('BLOBS_PAT required');
  return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok });
}

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
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

function absUrl(u) {
  if (!u) return '';
  if (/^https?:\/\//i.test(u)) return u;
  if (u[0] === '/') return SITE + u;
  return '';
}

function normUrl(u) {
  return String(u || '')
    .replace(/\?.*$/, '')
    .trim();
}

function isMangled(u) {
  return MANGLED_RX.test(String(u || ''));
}

function wsrvUrl(abs) {
  const u = String(abs || '');
  if (!/^https?:\/\//i.test(u)) return null;
  if (/pulserevops\.com\/assets\//i.test(u) || /wsrv\.nl\//i.test(u)) return null;
  const bare = u.replace(/^https?:\/\//i, '');
  return 'https://wsrv.nl/?url=' + encodeURIComponent(bare) + '&w=760&output=webp&q=80&we&n=-1';
}

function dripBusyId() {
  try {
    return String(fs.readFileSync(BUSY_FILE, 'utf8') || '').trim().toLowerCase();
  } catch (e) {
    return '';
  }
}

async function emailOne(subject, html) {
  try {
    const r = await fetch(SITE + '/.netlify/functions/pulse-progress-notify?key=' + KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, html }),
      signal: AbortSignal.timeout(15000),
    });
    const detail = await r.text();
    console.log(JSON.stringify({ email: r.ok ? 'ok' : 'fail', status: r.status, subject, detail: detail.slice(0, 120) }));
  } catch (e) {
    console.log(JSON.stringify({ email: 'err', subject, err: String(e.message || e).slice(0, 80) }));
  }
}

function extractMdImageUrls(answer) {
  const urls = [];
  for (const line of String(answer || '').split('\n')) {
    let m = line.match(/!\[[^\]]*\]\((https?:\/\/[^\s]+|\/assets\/[^\s)]+)\)/i);
    if (!m) m = line.match(/!\[[^\]]*\]\(([^)\s]+)\)/);
    if (m) urls.push(m[1]);
    if (isMangled(line)) {
      const m2 = line.match(/!\[[^\]]*\]\((.+)\)\s*$/);
      if (m2) urls.push(m2[1]);
    }
    const pm = line.match(/@@PRODUCT[^]*?\bimg="([^"]+)"/i);
    if (pm) urls.push(pm[1]);
  }
  return [...new Set(urls.filter(Boolean))];
}

async function classifyImage(url) {
  if (!url) return { kind: 'empty', url };
  if (isMangled(url)) return { kind: 'mangled', url };
  if (/\/assets\/cro-cover-\d+\.jpg/i.test(url)) return { kind: 'ok', url, skipPurge: true };
  if (/img-missing|placeholder\.svg|\/img\/auto\//i.test(url)) return { kind: 'defunct', url };
  if (/\/colors\/|chalk\+?white|color.?swatch|paint.?chip|colou?r.?chip/i.test(url)) {
    return { kind: 'white', url, reason: 'color-swatch' };
  }
  const abs = absUrl(url);
  if (!abs) return { kind: 'empty', url };
  const via = wsrvUrl(abs) || abs;
  try {
    const r = await fetch(via, {
      headers: { 'User-Agent': 'PulseWhitePurgeLocal/1.0', Accept: 'image/*' },
      redirect: 'follow',
      signal: AbortSignal.timeout(12000),
    });
    if (!r.ok) {
      if (via !== abs) {
        try {
          const r2 = await fetch(abs, {
            headers: { 'User-Agent': 'PulseWhitePurgeLocal/1.0', Accept: 'image/*' },
            redirect: 'follow',
            signal: AbortSignal.timeout(12000),
          });
          if (!r2.ok) return { kind: 'defunct', status: r2.status, url: abs };
          return { kind: 'defunct', status: r.status, url: abs, reason: 'wsrv-fail-origin-ok' };
        } catch (e2) {
          return { kind: 'defunct', url: abs, reason: 'wsrv+origin-fail' };
        }
      }
      return { kind: 'defunct', status: r.status, url: abs };
    }
    const ct = (r.headers.get('content-type') || '').toLowerCase();
    const buf = Buffer.from(await r.arrayBuffer());
    if (!ct.startsWith('image/') || buf.length < 1200) {
      return { kind: 'defunct', url: abs, reason: 'not-image-or-tiny', bytes: buf.length };
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
      white = (mean >= 235 && whitePct >= 0.85) || whitePct >= 0.92 || (mean >= 225 && whitePct >= 0.8);
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
  const ban = new Set((badUrls || []).map((u) => normUrl(u)));
  const out = [];
  for (let line of String(body || '').split('\n')) {
    const isImgLine = /!\[[^\]]*\]\(/i.test(line);
    const isProd = /@@PRODUCT/i.test(line) && /img="/i.test(line);
    if (isImgLine) {
      if (isMangled(line)) continue;
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

async function savePurged(s, idx, entryRow, blob, badUrls, reason, coverBad) {
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
    const next = Object.assign({}, blob, {
      answer: stripBadFromBody(blob.answer || '', banned),
      face_purged_at: ts,
      face_purge_reason: reason,
      purged_image_urls: banned,
      white_purge_local_at: ts,
      updated_at: ts,
    });
    if (coverBad) {
      next.cover_src = null;
      next.face_title_baked = false;
      if (next.img && banned.some((b) => next.img.includes(normUrl(b)) || normUrl(b).includes(normUrl(next.img)))) {
        delete next.img;
      }
    }
    await s.setJSON('answers/' + id + '.json', next);
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
    ent.white_purge_local_at = ts;
    idx.entries[i] = ent;
  }
  return knowledgeUrl(id);
}

const emailBuf = [];
let lastDigestAt = 0;

async function flushDigest(reason) {
  if (!emailBuf.length) return;
  const items = emailBuf.splice(0, emailBuf.length);
  lastDigestAt = Date.now();
  const subject = (
    'PULSE white purge · ' + items.length + ' pages · ' + new Date().toISOString().slice(11, 16) + 'Z'
  ).slice(0, 180);
  const html =
    '<p><b>White/mangled/defunct purge</b> (' +
    esc(reason) +
    ') — strip-only service (no Cursor rewrite). Drip still replaces if it hits leftovers.</p><ol>' +
    items
      .map(
        (x) =>
          '<li><a href="' +
          esc(x.url) +
          '">' +
          esc(x.id) +
          '</a> · ' +
          esc(x.reason) +
          ' · ' +
          (x.bad || 0) +
          ' slot(s)</li>'
      )
      .join('') +
    '</ol>';
  await emailOne(subject, html);
}

async function queueDigest(item) {
  emailBuf.push(item);
  if (emailBuf.length >= EMAIL_EVERY || (!lastDigestAt && emailBuf.length >= 5)) {
    await flushDigest(emailBuf.length >= EMAIL_EVERY ? 'every-' + EMAIL_EVERY : 'startup');
  }
}

async function processOne(s, idx, row) {
  const id = String(row.id).toLowerCase();
  if (dripBusyId() === id) {
    return { id, action: 'skip-drip-busy' };
  }
  let blob = null;
  try {
    blob = await s.get('answers/' + id + '.json', { type: 'json' });
  } catch (e) {
    return { id, action: 'missing' };
  }
  const cover = (row && (row.img || row.cover)) || (blob && blob.img) || '';
  const bodyUrls = blob && blob.answer ? extractMdImageUrls(blob.answer) : [];
  const candidates = [...new Set([cover, ...bodyUrls].filter(Boolean))].slice(0, 40);
  const bad = [];
  const reasons = [];
  let coverBad = false;

  for (const u of candidates) {
    if (/\/assets\/cro-cover-\d+\.jpg/i.test(u)) continue;
    if (isMangled(u)) {
      bad.push(u);
      reasons.push('mangled');
      if (cover && (u === cover || normUrl(u) === normUrl(cover))) coverBad = true;
      continue;
    }
    const cls = await classifyImage(u);
    if (cls.kind === 'ok' || cls.kind === 'empty') continue;
    if (cls.kind === 'white' || cls.kind === 'defunct' || cls.kind === 'mangled') {
      bad.push(u);
      reasons.push(cls.kind + (cls.reason ? ':' + cls.reason : ''));
      if (cover && (u === cover || normUrl(u) === normUrl(cover) || absUrl(u) === absUrl(cover))) coverBad = true;
    }
  }

  if (!bad.length) return { id, action: 'ok' };

  const reason = [...new Set(reasons)].join(',') || 'white-or-defunct';
  const url = await savePurged(s, idx, row, blob, bad, reason, coverBad);
  await queueDigest({ id, url, reason, bad: bad.length });
  return { id, action: 'purge', reason, bad: bad.length, url };
}

async function ensureInventory(s, state) {
  const need =
    !Array.isArray(state.inventoryIds) ||
    !state.inventoryIds.length ||
    !state.inventoryBuiltAt ||
    Date.now() - Date.parse(state.inventoryBuiltAt) > 6 * 3600 * 1000;
  if (!need) return;
  const idx = await s.get('_index.json', { type: 'json', consistency: 'strong' });
  if (!idx || !Array.isArray(idx.entries)) throw new Error('no index');
  const rows = idx.entries
    .filter((e) => e && e.id && /^[a-z]{2,3}\d/i.test(String(e.id)))
    .slice()
    .sort((a, b) => entryTs(b) - entryTs(a));
  state.inventoryIds = rows.map((e) => String(e.id).toLowerCase());
  state.inventoryBuiltAt = new Date().toISOString();
  if (state.cursor == null) state.cursor = 0;
  console.log(JSON.stringify({ phase: 'inventory', inventory: state.inventoryIds.length }));
}

async function tick(s, state) {
  await ensureInventory(s, state);
  const inventory = state.inventoryIds || [];
  if (!inventory.length) return { scanned: 0, remaining: 0 };

  const done = new Set(state.doneIds || []);
  const idx = await s.get('_index.json', { type: 'json', consistency: 'strong' });
  const byId = new Map((idx.entries || []).filter((e) => e && e.id).map((e) => [String(e.id).toLowerCase(), e]));

  let scanned = 0;
  let purged = 0;
  let okN = 0;
  let skipped = 0;
  let indexDirty = false;
  const startCursor = state.cursor || 0;

  while (scanned < BATCH) {
    if ((state.cursor || 0) >= inventory.length) {
      state.cursor = 0;
      // Full pass complete — clear done set so we re-scan for new white/broken later
      if (done.size >= inventory.length * 0.95) {
        console.log(JSON.stringify({ phase: 'wrap', done: done.size, inventory: inventory.length }));
        done.clear();
        state.passes = (state.passes || 0) + 1;
      }
      if (scanned > 0) break;
    }
    const id = inventory[state.cursor || 0];
    state.cursor = (state.cursor || 0) + 1;
    if (done.has(id)) {
      skipped++;
      scanned++;
      continue;
    }
    const row = byId.get(id) || { id };
    const t0 = Date.now();
    const r = await processOne(s, idx, row);
    scanned++;
    if (r.action === 'purge') {
      purged++;
      indexDirty = true;
      done.add(id);
    } else if (r.action === 'ok' || r.action === 'missing') {
      okN++;
      done.add(id);
    } else if (r.action === 'skip-drip-busy') {
      skipped++;
      // do not mark done — retry next pass
    } else {
      done.add(id);
    }
    console.log(
      JSON.stringify({
        progress: true,
        scanned,
        purged,
        ok: okN,
        skipped,
        cursor: state.cursor,
        id,
        action: r.action,
        bad: r.bad || 0,
        ms: Date.now() - t0,
      })
    );
  }

  if (indexDirty) await s.setJSON('_index.json', idx);
  state.doneIds = [...done];
  state.scanned = (state.scanned || 0) + scanned;
  state.purged = (state.purged || 0) + purged;
  state.ok = (state.ok || 0) + okN;
  state.lastRunAt = new Date().toISOString();
  state.lastBatch = { scanned, purged, ok: okN, skipped, startCursor };
  await s.setJSON(STATE_KEY, state);

  console.log(
    JSON.stringify({
      phase: 'tick',
      scanned,
      purged,
      ok: okN,
      skipped,
      cursor: state.cursor,
      inventory: inventory.length,
      done: done.size,
      totals: { scanned: state.scanned, purged: state.purged, ok: state.ok },
      emailBuf: emailBuf.length,
    })
  );
  // Don't leave digests sitting — flush after each tick if anything pending
  if (emailBuf.length) await flushDigest('tick');
  return { scanned, purged, remaining: Math.max(0, inventory.length - done.size) };
}

async function main() {
  const s = store();
  let state = { doneIds: [], cursor: 0, scanned: 0, purged: 0, ok: 0, inventoryIds: [] };
  try {
    state = Object.assign(state, (await s.get(STATE_KEY, { type: 'json' })) || {});
  } catch (e) {}

  await emailOne(
    'PULSE white purge ON — full inventory (strip-only)',
    '<p>Local white/mangled/defunct purge walking the full inventory.</p>' +
      '<p>No Cursor rewrite. Digest every <b>' +
      EMAIL_EVERY +
      '</b> purged pages. Cursor drip keeps fact-check/content; still replaces if it hits a leftover purge.</p>'
  );
  lastDigestAt = Date.now();
  console.log(JSON.stringify({ phase: 'start', batch: BATCH, idleMs: IDLE_MS, emailEvery: EMAIL_EVERY }));

  for (;;) {
    try {
      const r = await tick(s, state);
      if (emailBuf.length && Date.now() - lastDigestAt > 15 * 60 * 1000) await flushDigest('max-gap');
      if (ONCE) {
        await flushDigest('once-exit');
        break;
      }
      if (!r.purged && r.remaining === 0) {
        await new Promise((x) => setTimeout(x, IDLE_MS * 4));
        state.inventoryBuiltAt = null; // refresh
      } else {
        await new Promise((x) => setTimeout(x, IDLE_MS));
      }
    } catch (e) {
      console.log(JSON.stringify({ phase: 'error', err: String(e.message || e).slice(0, 200) }));
      await new Promise((x) => setTimeout(x, 5000));
    }
  }
}

main().catch((e) => {
  console.error(JSON.stringify({ fatal: String(e.message || e) }));
  process.exit(1);
});
