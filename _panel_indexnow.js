'use strict';
/**
 * Panel IndexNow worker — spawned by dashboard_server.js (never touches gen/fixer).
 * Usage: node _panel_indexnow.js site|delta|stop
 * Status: gen/indexnow_panel.json
 * Cooldowns: gen/indexnow_cooldown.json (site=7d, delta=24h)
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const { libraryEntryPublicUrl, libraryEntryKind } = require('./netlify/functions/lib/library-entry-url');
const { pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');

const MODE = String(process.argv[2] || '').toLowerCase();
const GEN = path.join(WD, 'gen');
const STATUS_F = path.join(GEN, 'indexnow_panel.json');
const COOL_F = path.join(GEN, 'indexnow_cooldown.json');
const STOP_F = path.join(GEN, 'indexnow_stop.flag');
const SITE_MS = 7 * 24 * 3600 * 1000;
const DELTA_MS = 24 * 3600 * 1000;
const BATCH = 200;
const HOST = 'https://pulserevops.com';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const MONEY = [
  HOST + '/fractional-cro',
  HOST + '/hire',
  HOST + '/revenue-checkup',
  HOST + '/tools',
  HOST + '/go-to-market-playbooks',
  HOST + '/industry-kpis',
  HOST + '/revenue-architecture',
  HOST + '/sales-trainings',
  HOST + '/coaching',
  HOST + '/crosyndicate',
];

function readJSON(f, d) { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } }
function writeJSON(f, o) { try { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, JSON.stringify(o, null, 1)); } catch (e) {} }
function setStatus(patch) {
  const cur = readJSON(STATUS_F, {});
  writeJSON(STATUS_F, Object.assign({}, cur, patch, { updated: Date.now() }));
}

function fetchText(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'pulse-panel-indexnow/1.0' }, timeout: 20000 }, (res) => {
      let b = '';
      res.on('data', (c) => (b += c));
      res.on('end', () => resolve({ status: res.statusCode, body: b }));
    }).on('error', (e) => resolve({ status: 0, body: e.message }));
  });
}
const parseLocs = (xml) => {
  const o = [];
  const re = /<loc>([^<]+)<\/loc>/gi;
  let m;
  while ((m = re.exec(xml))) o.push(m[1].trim());
  return o;
};

function loadCool() {
  return readJSON(COOL_F, { siteAt: 0, deltaAt: 0 });
}
function saveCool(c) { writeJSON(COOL_F, c); }

function cooldownLeft(mode) {
  const c = loadCool();
  const at = mode === 'site' ? c.siteAt : c.deltaAt;
  const win = mode === 'site' ? SITE_MS : DELTA_MS;
  return Math.max(0, (at || 0) + win - Date.now());
}

async function indexedStats(store) {
  const idx = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] };
  const es = (idx.entries || []).filter((e) => e && e.id && !/^vq_/i.test(String(e.id)));
  const indexed = es.filter((e) => e.was_indexed_at).length;
  const total = es.length;
  const pct = total ? Math.round((1000 * indexed) / total) / 10 : 0;
  return { total, indexed, pct };
}

async function buildSiteUrls(store) {
  const idx = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] };
  const entries = (idx.entries || []).filter((e) => e && e.id);
  const libUrls = [];
  for (const e of entries) {
    try {
      if (!libraryEntryKind(e)) continue;
      const u = libraryEntryPublicUrl(e);
      if (u) libUrls.push(u);
    } catch (err) {}
  }
  const staticUrls = new Set(MONEY);
  try {
    parseLocs(fs.readFileSync(path.join(WD, 'sitemap.xml'), 'utf8')).forEach((u) => {
      if (u.includes('pulserevops.com')) staticUrls.add(u);
    });
  } catch (e) {}
  try {
    const smIndex = await fetchText(HOST + '/sitemap-index.xml');
    const kids = parseLocs(smIndex.body || '').filter((u) => /\.xml$/i.test(u)).slice(0, 40);
    for (const sm of kids) {
      const r = await fetchText(sm);
      if (r.status === 200) parseLocs(r.body).forEach((u) => u.includes('pulserevops.com') && staticUrls.add(u));
      await sleep(80);
    }
  } catch (e) {}
  // Money first, then library, then other static
  const all = [];
  const seen = new Set();
  for (const u of [...MONEY, ...libUrls, ...staticUrls]) {
    if (!u || seen.has(u)) continue;
    seen.add(u);
    all.push(u);
  }
  return all;
}

async function buildDeltaUrls(store) {
  const idx = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] };
  const since = Date.now() - 14 * 24 * 3600 * 1000;
  const fresh = (idx.entries || [])
    .filter((e) => e && e.id && ((e.ts || 0) >= since || (e.polished_at || 0) >= since))
    .sort((a, b) => (b.ts || b.polished_at || 0) - (a.ts || a.polished_at || 0));

  // Recently fixed from FIXED.md
  const fixedIds = new Set();
  try {
    const md = fs.readFileSync(path.join(WD, 'sim', 'FIXED.md'), 'utf8');
    const cut = Date.now() - 14 * 24 * 3600 * 1000;
    for (const line of md.split(/\r?\n/)) {
      const m = line.match(/^- (\d{4}-\d{2}-\d{2}T[^ ]+) · ([a-z]+\d+)/i);
      if (!m) continue;
      if (Date.parse(m[1]) >= cut) fixedIds.add(m[2].toLowerCase());
    }
  } catch (e) {}

  const byId = new Map();
  for (const e of idx.entries || []) if (e && e.id) byId.set(String(e.id).toLowerCase(), e);

  const urls = [];
  const seen = new Set();
  for (const u of MONEY) {
    if (!seen.has(u)) { seen.add(u); urls.push(u); }
  }
  for (const e of fresh) {
    try {
      const u = libraryEntryPublicUrl(e);
      if (u && !seen.has(u)) { seen.add(u); urls.push(u); }
    } catch (err) {}
  }
  for (const id of fixedIds) {
    const e = byId.get(id);
    if (!e) continue;
    try {
      const u = libraryEntryPublicUrl(e);
      if (u && !seen.has(u)) { seen.add(u); urls.push(u); }
    } catch (err) {}
  }
  return urls.slice(0, 3900);
}

async function stampBatched(store, urls) {
  // Single re-read + write — only for delta. Site stays ping-only (clobber-safe vs fixer).
  const want = new Set();
  for (const u of urls) {
    const m = String(u).match(/\/([a-z]+\d+)(?:\/)?$/i);
    if (m) want.add(m[1].toLowerCase());
  }
  if (!want.size) return 0;
  const idx = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] };
  const ts = new Date().toISOString();
  let n = 0;
  for (const e of idx.entries || []) {
    if (!e || !e.id) continue;
    if (!want.has(String(e.id).toLowerCase())) continue;
    if (!e.was_indexed_at) { e.was_indexed_at = ts; n++; }
  }
  if (n) await store.setJSON('_index.json', idx);
  return n;
}

async function run(mode) {
  if (mode !== 'site' && mode !== 'delta') {
    console.error('usage: node _panel_indexnow.js site|delta');
    process.exit(1);
  }
  try { fs.unlinkSync(STOP_F); } catch (e) {}

  const left = cooldownLeft(mode);
  if (left > 0) {
    setStatus({
      stage: 'cooldown',
      mode,
      note: mode + ' on cooldown',
      cooldownMs: left,
      running: false,
    });
    console.log('[indexnow] cooldown', mode, left);
    process.exit(2);
  }

  const store = getStore({
    name: 'pulse-machine-library',
    siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
  });

  setStatus({
    stage: 'building',
    mode,
    running: true,
    done: 0,
    total: 0,
    note: 'Building URL list…',
    err: null,
  });

  const urls = mode === 'site' ? await buildSiteUrls(store) : await buildDeltaUrls(store);
  setStatus({
    stage: 'pinging',
    mode,
    running: true,
    done: 0,
    total: urls.length,
    note: 'Pinging IndexNow…',
  });

  let pinged = 0, okB = 0, failB = 0;
  for (let i = 0; i < urls.length; i += BATCH) {
    if (fs.existsSync(STOP_F)) {
      setStatus({ stage: 'stopped', mode, running: false, done: pinged, total: urls.length, note: 'Stopped by owner' });
      try { fs.unlinkSync(STOP_F); } catch (e) {}
      process.exit(0);
    }
    const chunk = urls.slice(i, i + BATCH);
    let r;
    try { r = await pingIndexNowUrlList(chunk); } catch (e) { r = { ok: false, err: e.message }; }
    if (r && r.ok) { okB++; pinged += chunk.length; } else failB++;
    setStatus({
      stage: 'pinging',
      mode,
      running: true,
      done: Math.min(pinged, urls.length),
      total: urls.length,
      okBatches: okB,
      failBatches: failB,
      note: 'Pinging ' + Math.min(pinged, urls.length) + ' / ' + urls.length,
    });
    await sleep(800);
  }

  let stamped = 0;
  if (mode === 'delta') {
    setStatus({ stage: 'stamping', mode, running: true, done: pinged, total: urls.length, note: 'Stamping was_indexed_at…' });
    try { stamped = await stampBatched(store, urls); } catch (e) {}
  }

  const stats = await indexedStats(store);
  const cool = loadCool();
  if (mode === 'site') cool.siteAt = Date.now();
  else cool.deltaAt = Date.now();
  saveCool(cool);

  const last = {
    at: Date.now(),
    mode,
    urls: urls.length,
    pinged,
    okBatches: okB,
    failBatches: failB,
    stamped,
    indexed: stats.indexed,
    total: stats.total,
    pct: stats.pct,
  };
  const prev = readJSON(STATUS_F, {});
  const lasts = Object.assign({}, prev.last || {});
  lasts[mode] = last;

  setStatus({
    stage: 'done',
    mode,
    running: false,
    done: pinged,
    total: urls.length,
    note: 'Done · ' + stats.indexed.toLocaleString() + ' / ' + stats.total.toLocaleString() + ' indexed (' + stats.pct + '%)',
    last: lasts,
    stats,
  });
  console.log('[indexnow] DONE', JSON.stringify(last));
}

if (MODE === 'stop') {
  fs.writeFileSync(STOP_F, '1');
  setStatus({ stage: 'stopping', running: true, note: 'Stop requested…' });
  process.exit(0);
}

run(MODE).catch((e) => {
  setStatus({ stage: 'error', running: false, err: String(e.message || e), note: 'Error: ' + String(e.message || e) });
  console.error(e);
  process.exit(1);
});
