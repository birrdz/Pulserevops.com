#!/usr/bin/env node
/**
 * CRO Pulse Tools — rotate image kits + 50-face hero pool through tl pages.
 *
 *   face card === hero card (dupes OK)
 *   body kit  = 4–6 images (may also dupe face/hero)
 *   kit#      = idNum % KIT_COUNT
 *   face#     = idNum % 50
 *
 *   node _tl_cro_kit_rotate.js
 *   PILOT=tl10740,tl9495 node _tl_cro_kit_rotate.js
 *   LIMIT=2000 REBUILD_KITS=1 node _tl_cro_kit_rotate.js
 */
'use strict';

const fs = require('fs');
const { getStore } = require('/workspace/node_modules/@netlify/blobs');
const { lockTlAnswerEntry, isTlId, croCoverForId, facePoolSize } = require('/workspace/_tl_cover_lock_lib');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const POOL_FILE = process.env.CRO_DECK_POOL || '/tmp/tl-cro-internal100.json';
const KITS_FILE = '/tmp/tl-cro-kits.json';
const STATE = '/tmp/tl-cro-kit-rotate-state.json';
const REPORT = '/tmp/tl-cro-kit-rotate-report.json';
const LOG = '/tmp/tl-cro-kit-rotate.log';

const KIT_COUNT = Math.max(5, Math.min(10, Number(process.env.KIT_COUNT || 8) || 8));
const BODY_PER_KIT = Math.max(4, Math.min(6, Number(process.env.BODY_PER_KIT || 5) || 5));

try {
  const envPath = '/tmp/aq-drip.env';
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split(/\n/)) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (!m) continue;
      let v = m[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      if (!process.env[m[1]]) process.env[m[1]] = v;
    }
  }
} catch (_e) {}

const cfg = require('/home/ubuntu/.config/netlify/config.json');
const token = Object.values(cfg.users || {})[0].auth.token;
const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token });

function log(s) {
  const line = `[${new Date().toISOString()}] ${s}`;
  console.log(line);
  fs.appendFileSync(LOG, line + '\n');
}

function idNum(id) {
  return Math.abs(parseInt(String(id).replace(/\D/g, ''), 10) || 0);
}

function kitIndex(id) {
  // 0..KIT_COUNT-1
  return idNum(id) % KIT_COUNT;
}

function isProtectedImg(url) {
  return /cro-syndicate-logo|kory-white|\/assets\/kory/i.test(String(url || ''));
}

function isBodyQaImg(url) {
  const u = String(url || '').split('?')[0];
  if (!/^\/assets\/qa\//i.test(u)) return false;
  if (isProtectedImg(u)) return false;
  if (/cro-cover-/i.test(u)) return false;
  return true;
}

function loadBodyPool() {
  const raw = JSON.parse(fs.readFileSync(POOL_FILE, 'utf8'));
  return (raw.available || raw.pool || [])
    .map((x) => (typeof x === 'string' ? x : x.img))
    .filter((u) => u && /^\/assets\//.test(u));
}

/** Build KIT_COUNT body kits (heroes come from 50-face pool via croCoverForId). */
function buildKits(pool) {
  if (fs.existsSync(KITS_FILE) && process.env.REBUILD_KITS !== '1') {
    try {
      const prev = JSON.parse(fs.readFileSync(KITS_FILE, 'utf8'));
      if (prev.kits && prev.kits.length === KIT_COUNT && prev.bodyPerKit === BODY_PER_KIT) {
        return prev.kits;
      }
    } catch (_e) {}
  }
  let bodyPool = pool.slice();
  if (bodyPool.length < KIT_COUNT * BODY_PER_KIT) {
    const ext = [];
    while (ext.length < KIT_COUNT * BODY_PER_KIT) ext.push(...bodyPool);
    bodyPool = ext;
  }
  const kits = [];
  for (let i = 0; i < KIT_COUNT; i++) {
    const start = i * BODY_PER_KIT;
    const body = bodyPool.slice(start, start + BODY_PER_KIT);
    kits.push({ kit: i + 1, body });
  }
  const out = {
    at: new Date().toISOString(),
    kitCount: KIT_COUNT,
    bodyPerKit: BODY_PER_KIT,
    facePool: facePoolSize(),
    rule: 'hero = faces50[id%50]; body kit = kits[id%8]; rotate through CRO Pulse Tools',
    kits,
  };
  fs.writeFileSync(KITS_FILE, JSON.stringify(out, null, 2));
  return kits;
}

function isProseLine(line) {
  const t = String(line || '').trim();
  if (!t) return false;
  if (/^#{1,6}\s/.test(t)) return false;
  if (/^```/.test(t)) return false;
  if (/^!\[[^\]]*\]\(/.test(t)) return false;
  if (/^\[!\[/.test(t)) return false;
  if (/^👉\s/.test(t)) return false;
  if (/^[-*_]{3,}$/.test(t)) return false;
  if (/^(?:[-*+]|\d+\.)\s/.test(t) && t.length < 50) return false;
  return t.length >= 40;
}

function inProtectedZone(sectionHead) {
  return /CRO Businesses Near You|FAQ|Sources|Related on PULSE/i.test(String(sectionHead || ''));
}

/**
 * Apply one kit: strip old body qa imgs, place 1 image after every 2 prose paras,
 * dump any leftovers before FAQ / Sources / CTA.
 */
function applyKit(answer, kit) {
  let body = String(answer || '').replace(/\r\n/g, '\n');

  body = body.replace(/!\[([^\]]*)\]\(([^)]+)\)\n?/g, (full, _alt, url) => {
    if (!isBodyQaImg(url)) return full;
    return '';
  });
  body = body.replace(/\n{3,}/g, '\n\n');

  const queue = kit.body.slice();
  const placed = [];
  const lines = body.split('\n');
  const out = [];
  let paraCount = 0;
  let inFence = false;
  let sectionHead = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const t = line.trim();
    if (/^```/.test(t)) {
      inFence = !inFence;
      out.push(line);
      continue;
    }
    if (/^#{1,4}\s+/.test(t)) {
      sectionHead = t;
      out.push(line);
      continue;
    }
    out.push(line);
    if (inFence || inProtectedZone(sectionHead)) continue;
    if (!isProseLine(line)) continue;
    paraCount++;
    if (paraCount % 2 === 0 && queue.length) {
      const img = queue.shift();
      placed.push(img);
      out.push('');
      out.push('![CRO revenue operations — figure ' + placed.length + '](' + img + ')');
      out.push('');
    }
  }

  body = out.join('\n');

  // leftovers → before FAQ / Sources / CRO Businesses / end
  if (queue.length) {
    const block =
      '\n\n' +
      queue
        .map((img) => {
          placed.push(img);
          return '![CRO revenue operations — figure ' + placed.length + '](' + img + ')';
        })
        .join('\n\n') +
      '\n\n';
    if (/\n##\s*FAQ\b/i.test(body)) body = body.replace(/\n##\s*FAQ\b/i, block + '## FAQ');
    else if (/\n##\s*Sources\b/i.test(body)) body = body.replace(/\n##\s*Sources\b/i, block + '## Sources');
    else if (/\n##\s*CRO Businesses Near You\b/i.test(body)) {
      body = body.replace(/\n##\s*CRO Businesses Near You\b/i, block + '## CRO Businesses Near You');
    } else body = body.trim() + block;
  }

  body = body.replace(/\n{3,}/g, '\n\n').trim() + '\n';
  return { body, placed: kit.body.slice() };
}

function loadState() {
  let st;
  try {
    st = JSON.parse(fs.readFileSync(STATE, 'utf8'));
  } catch {
    st = {};
  }
  st.done = Array.isArray(st.done) ? st.done : [];
  st.fixed = Array.isArray(st.fixed) ? st.fixed : [];
  st.skipped = Array.isArray(st.skipped) ? st.skipped : [];
  st.errors = Array.isArray(st.errors) ? st.errors : [];
  return st;
}

function saveState(st) {
  fs.writeFileSync(STATE, JSON.stringify(st));
}

async function main() {
  const pilot = String(process.env.PILOT || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const limit = Number(process.env.LIMIT || 0) || 0;
  const st = loadState();
  const doneSet = new Set(st.done || []);

  const pool = loadBodyPool();
  const kits = buildKits(pool);
  log(`KITS ${kits.length} × body=${BODY_PER_KIT} · facePool=${facePoolSize()}`);

  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  let rows = (idx.entries || []).filter(
    (e) =>
      e &&
      isTlId(e.id) &&
      /CRO|Chief Revenue Officer|fractional CRO|interim CRO|VP of Sales|Chief Sales|Chief Commercial/i.test(
        e.question || ''
      )
  );
  rows.sort((a, b) => idNum(a.id) - idNum(b.id));

  let ids = rows.map((e) => e.id);
  if (pilot.length) ids = pilot;
  ids = ids.filter((id) => !doneSet.has(id));
  if (limit > 0) ids = ids.slice(0, limit);

  log(`START ids=${ids.length} kits=${kits.length} alreadyDone=${doneSet.size}`);

  const stats = { scanned: 0, fixed: 0, skipped: 0, errors: 0, byKit: {} };
  for (let i = 1; i <= kits.length; i++) stats.byKit[i] = 0;

  for (const id of ids) {
    stats.scanned++;
    try {
      const entry = await store.get('answers/' + id + '.json', { type: 'json' });
      if (!entry || !entry.answer) {
        st.skipped.push(id);
        st.done.push(id);
        stats.skipped++;
        saveState(st);
        continue;
      }

      const ki = kitIndex(id);
      const kit = kits[ki];
      const hero = croCoverForId(id); // 50-face pool; face === hero
      // Body kit may include the same URL as face/hero — dupes OK
      const { body, placed } = applyKit(entry.answer, kit);

      let save = Object.assign({}, entry, {
        answer: body,
        cro_kit: kit.kit,
        cro_kit_body: placed,
        cro_kit_assigned_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      try {
        save = lockTlAnswerEntry(save, id).entry; // sets img=cover=face=hero
        save.cro_kit = kit.kit;
        save.cro_kit_body = placed;
        save.answer = body;
      } catch (_e) {
        save.img = hero;
        save.cover = hero;
        save.face = hero;
        save.cover_src = 'cro-face-pool';
        save.face_title_baked = false;
      }

      await store.setJSON('answers/' + id + '.json', save);

      try {
        const row = (idx.entries || []).find((e) => e && e.id === id);
        if (row) {
          row.img = save.img || hero;
          row.cover_src = 'cro-face-pool';
          row.face_title_baked = false;
        }
      } catch (_e) {}

      st.fixed.push({ id, kit: kit.kit, hero: save.img || hero, bodyN: placed.length });
      st.done.push(id);
      stats.fixed++;
      stats.byKit[kit.kit] = (stats.byKit[kit.kit] || 0) + 1;
      if (stats.fixed <= 15 || stats.fixed % 200 === 0) {
        log(`FIXED ${id} kit=${kit.kit} hero=${save.img || hero} body=${placed.length}`);
      }
      saveState(st);

      if (stats.fixed % 500 === 0) {
        try {
          await store.setJSON('_index.json', idx);
          log('INDEX checkpoint stamped');
        } catch (e) {
          log('INDEX checkpoint err ' + e.message);
        }
      }
    } catch (e) {
      stats.errors++;
      st.errors.push({ id, err: String(e.message || e) });
      log('ERR ' + id + ' ' + (e.message || e));
      saveState(st);
    }
  }

  try {
    await store.setJSON('_index.json', idx);
    log('INDEX final stamp ok');
  } catch (e) {
    log('INDEX final err ' + e.message);
  }

  const report = { at: new Date().toISOString(), stats, kitsFile: KITS_FILE, sample: (st.fixed || []).slice(-15) };
  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2));
  log('DONE ' + JSON.stringify(stats));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
