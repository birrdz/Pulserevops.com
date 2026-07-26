#!/usr/bin/env node
/**
 * CRO Pulse Tools (tl) — remove money / fractional-vs-full-time cost graphs.
 * Visual: strip matching image markdown + clear bad cover fields only.
 * Does NOT rewrite prose, sitemaps, IndexNow, or tags.
 *
 * Targets:
 *   - assets cro-cover-4.jpg / cro-cover-5.jpg (boardroom frac-CRO money slides)
 *   - fractional-cro-roi-comparison
 *   - pollinations prompts: Real Cost / cost breakdown / Fractional vs Full-Time / Compare: Fractional
 *
 * State: /tmp/tl-money-graph-strip-state.json
 * Log:   /tmp/tl-money-graph-strip.log
 *
 * Usage:
 *   INTERVAL_MS=120000 node _tl_money_graph_strip_drip.js
 *   ONCE=1 node _tl_money_graph_strip_drip.js
 */
const fs = require('fs');
const { getStore } = require('/workspace/node_modules/@netlify/blobs');

try {
  const envPath = process.env.AQ_DRIP_ENV || '/tmp/aq-drip.env';
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split(/\n/)) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (!m) continue;
      let v = m[2].trim();
      if (v.startsWith('"') && v.endsWith('"')) {
        try {
          v = JSON.parse(v);
        } catch {
          v = v.slice(1, -1);
        }
      } else if (v.startsWith("'") && v.endsWith("'")) {
        v = v.slice(1, -1).replace(/'\\''/g, "'");
      }
      if (!process.env[m[1]]) process.env[m[1]] = v;
    }
  }
} catch (_e) {}

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const STATE_PATH = '/tmp/tl-money-graph-strip-state.json';
const LOG_PATH = '/tmp/tl-money-graph-strip.log';
const QUEUE_CACHE = '/tmp/tl-money-graph-targets.json';
const INTERVAL_MS = Number(process.env.INTERVAL_MS || 2 * 60 * 1000);
const ONCE = process.env.ONCE === '1';
const RECIPIENT = process.env.ALERT_TO || process.env.ALERT_TO_EMAIL || 'koryjordanwhite@gmail.com';
const RESEND_KEY = process.env.resendapikey || process.env.RESEND_API_KEY || process.env.RESENDAPIKEY || '';
const RESEND_FROM = process.env.ALERT_FROM_EMAIL || 'PULSE Engine <onboarding@resend.dev>';
const SAFE_COVER = 'https://pulserevops.com/assets/cro-cover-8.jpg'; // handshake — no money slide

const cfg = require('/home/ubuntu/.config/netlify/config.json');
const token = Object.values(cfg.users || {})[0].auth.token;
const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token });

function log(line) {
  const s = `[${new Date().toISOString()}] ${line}`;
  console.log(s);
  fs.appendFileSync(LOG_PATH, s + '\n');
}

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
  } catch {
    return {
      pillar: 'tl',
      created_at: Date.now(),
      cursor: 0,
      queue: null,
      done: [],
      fixed: [],
      skipped_clean: [],
      errors: [],
      status: 'init',
    };
  }
}

function saveState(st) {
  st.updated_at = Date.now();
  fs.writeFileSync(STATE_PATH, JSON.stringify(st, null, 2));
}

function safeDecode(s) {
  try {
    return decodeURIComponent(String(s).replace(/\+/g, ' '));
  } catch {
    return String(s).replace(/%20/g, ' ').replace(/\+/g, ' ');
  }
}

function classifyImg(img) {
  const u = (img.match(/\(([^)]+)\)/) || [])[1] || '';
  const alt = (img.match(/!\[([^\]]*)\]/) || [])[1] || '';
  const blob = safeDecode(alt + ' ' + u);
  if (/cro-cover-4\.(jpg|png|webp)/i.test(u)) return 'cro-cover-4';
  if (/cro-cover-5\.(jpg|png|webp)/i.test(u)) return 'cro-cover-5';
  if (/fractional-cro-roi-comparison/i.test(u)) return 'roi-comparison-asset';
  if (
    /pollinations\.ai\/prompt\//i.test(u) &&
    /(real\s*cost|cost\s*breakdown|cost\s*of\s*a\s*frac|fractional\s*vs\.?\s*full|full[- ]?time\s*vs\.?\s*frac|compare:\s*fractional|what\s*you\s*(actually\s*)?get\s*for)/i.test(
      blob
    )
  ) {
    return 'cost-prompt';
  }
  if (/pollinations\.ai\/prompt\//i.test(u) && /fractional\s*cro\s*vs\.?\s*full/i.test(blob)) {
    return 'frac-vs-ft-prompt';
  }
  return null;
}

function stripBody(answer) {
  const removed = [];
  let next = String(answer || '').replace(/!\[[^\]]*\]\([^)]+\)/g, (img) => {
    const why = classifyImg(img);
    if (!why) return img;
    removed.push(why);
    return '';
  });
  // collapse leftover blank runs from removed image lines
  next = next.replace(/([^\n])\n{3,}/g, '$1\n\n').replace(/\n{3,}/g, '\n\n');
  return { next, removed };
}

function coverNeedsStrip(entry) {
  const fields = ['img', 'cover', 'face_path', 'cover_src'];
  const hit = {};
  for (const f of fields) {
    const v = String(entry[f] || '');
    if (/cro-cover-4/i.test(v) || /cro-cover-5/i.test(v)) hit[f] = v;
  }
  return hit;
}

async function buildQueue() {
  if (fs.existsSync(QUEUE_CACHE)) {
    try {
      const cached = JSON.parse(fs.readFileSync(QUEUE_CACHE, 'utf8'));
      if (Array.isArray(cached.hits) && cached.hits.length) {
        log(`Using cached target list: ${cached.hits.length} entries`);
        return cached.hits.map((h) => h.id);
      }
    } catch (_e) {}
  }
  log('Building money-graph target queue (read-only scan)…');
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const tl = (idx.entries || []).filter((e) => e && /^tl\d+$/i.test(e.id));
  const ids = [];
  for (let i = 0; i < tl.length; i += 30) {
    const chunk = tl.slice(i, i + 30);
    await Promise.all(
      chunk.map(async (row) => {
        const e = await store.get(`answers/${row.id}.json`, { type: 'json' });
        if (!e) return;
        const { removed } = stripBody(e.answer);
        const coverHit = Object.keys(coverNeedsStrip(e)).length > 0;
        if (removed.length || coverHit) ids.push(row.id);
      })
    );
    if (i % 1500 === 0 || i + 30 >= tl.length) {
      log(`scan ${Math.min(i + 30, tl.length)}/${tl.length} targets=${ids.length}`);
    }
  }
  ids.sort((a, b) => Number(a.slice(2)) - Number(b.slice(2)));
  return ids;
}

async function processOne(id) {
  const entry = await store.get(`answers/${id}.json`, { type: 'json', consistency: 'strong' });
  if (!entry) return { id, error: 'missing' };

  const { next, removed } = stripBody(entry.answer);
  const badCover = coverNeedsStrip(entry);
  if (!removed.length && !Object.keys(badCover).length) {
    return { id, skipped: true, reason: 'already_clean' };
  }

  const patch = {
    ...entry,
    answer: next,
    tl_money_graph_stripped_at: Date.now(),
    tl_money_graph_stripped: removed,
  };
  for (const f of Object.keys(badCover)) {
    if (f === 'cover_src') patch.cover_src = 'cro-cover-safe';
    else patch[f] = SAFE_COVER;
  }

  await store.setJSON(`answers/${id}.json`, patch);
  return {
    id,
    changed: true,
    removed,
    coverCleared: Object.keys(badCover),
  };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function emailOwner(subject, html) {
  if (!RESEND_KEY) {
    log('EMAIL skip — no Resend key');
    return { ok: false, reason: 'no_key' };
  }
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: RESEND_FROM, to: [RECIPIENT], subject, html }),
    });
    const text = await r.text();
    log('EMAIL resend ' + r.status + ' ' + text.slice(0, 160));
    return { ok: r.ok, status: r.status, body: text.slice(0, 300) };
  } catch (e) {
    log('EMAIL error ' + String(e.message || e));
    return { ok: false, reason: String(e.message || e) };
  }
}

function completionHtml(st) {
  return `
  <div style="font-family:Arial,sans-serif;line-height:1.5">
    <div style="background:#B91C1C;color:#fff;padding:14px 18px;font-size:20px;font-weight:700">
      🔴 RED LIGHT — CRO Pulse Tools money-graph strip complete
    </div>
    <div style="padding:16px;border:3px solid #B91C1C;background:#FEF2F2">
      <ul>
        <li><b>Pillar:</b> CRO Pulse Tools (<code>tl</code>)</li>
        <li><b>Processed:</b> ${(st.done || []).length}</li>
        <li><b>Stripped:</b> ${(st.fixed || []).length}</li>
        <li><b>Already clean:</b> ${(st.skipped_clean || []).length}</li>
        <li><b>Errors:</b> ${(st.errors || []).length}</li>
        <li><b>Prose / SEO / IndexNow:</b> untouched</li>
      </ul>
      <p style="color:#666;font-size:12px">${new Date().toISOString()}</p>
    </div>
  </div>`;
}

async function main() {
  let st = loadState();
  if (!st.queue) {
    const ids = await buildQueue();
    st.queue = ids;
    st.total = ids.length;
    st.cursor = 0;
    st.status = ids.length ? 'dripping' : 'complete';
    saveState(st);
    log(`Queue ready: ${ids.length} entries with money/frac-vs-FT graphs`);
    if (!ids.length) {
      await emailOwner('🔴 RED LIGHT — CRO money-graph scan clean', completionHtml(st));
      return;
    }
  }

  while (st.cursor < st.queue.length) {
    const id = st.queue[st.cursor];
    st.status = 'dripping';
    log(`UNIT ${st.cursor + 1}/${st.queue.length} → ${id}`);
    let result;
    try {
      result = await processOne(id);
    } catch (e) {
      result = { id, error: String(e.message || e) };
    }
    log(JSON.stringify(result));
    st.last_id = id;
    st.last_at = Date.now();
    st.last_result = result;
    if (result.error) st.errors.push({ id, error: result.error, at: Date.now() });
    else if (result.skipped) st.skipped_clean.push(id);
    else {
      st.done.push(id);
      if (result.changed) st.fixed.push(id);
    }
    st.cursor += 1;
    saveState(st);

    if (ONCE) break;
    if (st.cursor >= st.queue.length) break;
    log(`Sleeping ${INTERVAL_MS}ms…`);
    await sleep(INTERVAL_MS);
  }

  if (st.cursor >= st.queue.length) {
    st.status = 'complete';
    saveState(st);
    log('TL MONEY-GRAPH STRIP COMPLETE');
    if (!st.emailed_at) {
      const mailed = await emailOwner(
        `🔴 RED LIGHT — CRO money graphs stripped (${(st.fixed || []).length})`,
        completionHtml(st)
      );
      st.emailed_at = Date.now();
      st.email_result = mailed;
      saveState(st);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
