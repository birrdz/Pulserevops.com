#!/usr/bin/env node
/**
 * CRO Pulse Tools — mass-assign numbered image decks (depleting).
 *
 * Deck 1 → odd tl ids (…1,3,5…)
 * Deck 2 → even tl ids (…2,4,6…)
 *
 * Draw from available → remove (deplete). Empty → reshuffle used back.
 * Cross-page dupes ALLOWED (no pHash / no-dupe gate on this path).
 * Heroes stay cro-cover-locked. Logos / kory headshots untouched.
 *
 *   node _tl_cro_deck_assign.js
 *   LIMIT=500 node _tl_cro_deck_assign.js
 *   PILOT=tl10740,tl9495 node _tl_cro_deck_assign.js
 *   BODY_SLOTS=3 node _tl_cro_deck_assign.js
 */
'use strict';

const fs = require('fs');
const { getStore } = require('/workspace/node_modules/@netlify/blobs');
const { lockTlAnswerEntry, isTlId } = require('/workspace/_tl_cover_lock_lib');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const POOL_FILE = process.env.CRO_DECK_POOL || '/tmp/tl-cro-internal100.json';
const STATE = '/tmp/tl-cro-deck-assign-state.json';
const REPORT = '/tmp/tl-cro-deck-assign-report.json';
const LOG = '/tmp/tl-cro-deck-assign.log';
/** Max body images per page (hero is separate via cro-cover lock). */
const BODY_SLOTS = Math.max(1, Math.min(8, Number(process.env.BODY_SLOTS || 4) || 4));
/** Insert 1 deck image after every N prose paragraphs. */
const EVERY_N_PARAS = Math.max(1, Math.min(6, Number(process.env.EVERY_N_PARAS || 2) || 2));

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

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}

function idNum(id) {
  return Math.abs(parseInt(String(id).replace(/\D/g, ''), 10) || 0);
}

function deckNo(id) {
  return idNum(id) % 2 === 1 ? 1 : 2;
}

function isProtectedImg(url) {
  const u = String(url || '');
  return (
    /cro-syndicate-logo|kory-white|cro-cover-|\/assets\/kory/i.test(u) ||
    /^https?:\/\//i.test(u)
  );
}

function isBodyQaImg(url) {
  const u = String(url || '').split('?')[0];
  if (!/^\/assets\/qa\//i.test(u)) return false;
  if (isProtectedImg(u)) return false;
  return true;
}

function loadPool() {
  const raw = JSON.parse(fs.readFileSync(POOL_FILE, 'utf8'));
  const urls = (raw.available || raw.pool || []).map((x) => (typeof x === 'string' ? x : x.img)).filter(Boolean);
  if (urls.length < 20) throw new Error('pool too small: ' + urls.length + ' in ' + POOL_FILE);
  const half = Math.floor(urls.length / 2);
  return {
    1: { available: shuffle(urls.slice(0, half)), used: [] },
    2: { available: shuffle(urls.slice(half)), used: [] },
    all: urls,
  };
}

function draw(decks, n) {
  const d = decks[n];
  if (!d.available.length) {
    d.available = shuffle(d.used);
    d.used = [];
    if (!d.available.length) throw new Error('deck ' + n + ' empty');
  }
  const img = d.available.shift();
  d.used.push(img);
  return img;
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
  if (st.decks && st.decks[1] && st.decks[2]) {
    for (const n of [1, 2]) {
      st.decks[n].available = Array.isArray(st.decks[n].available) ? st.decks[n].available : [];
      st.decks[n].used = Array.isArray(st.decks[n].used) ? st.decks[n].used : [];
    }
  } else {
    st.decks = null;
  }
  return st;
}

function saveState(st) {
  fs.writeFileSync(STATE, JSON.stringify(st));
}

function isProseLine(line) {
  const t = String(line || '').trim();
  if (!t) return false;
  if (/^#{1,6}\s/.test(t)) return false;
  if (/^```/.test(t)) return false;
  if (/^!\[[^\]]*\]\(/.test(t)) return false;
  if (/^#{1,6}\s/.test(t)) return false;
  if (/^(?:[-*+]|\d+\.)\s/.test(t) && t.length < 40) return false;
  if (/^[-*_]{3,}$/.test(t)) return false;
  if (/^>\s/.test(t)) return false;
  if (/^\[!\[/.test(t)) return false; // linked logo
  // short CTA / link-only lines
  if (/^👉\s/.test(t)) return false;
  if (t.length < 60 && /^\[/.test(t)) return false;
  // real paragraph-ish
  return t.length >= 40 || /\.\s/.test(t) || t.length >= 80;
}

function inProtectedZone(sectionHead) {
  return /CRO Businesses Near You|FAQ|Sources|Related on PULSE/i.test(String(sectionHead || ''));
}

/**
 * Hero = cro-cover (via lockTlAnswerEntry).
 * Body = strip old /assets/qa/* (keep logos/kory) then insert 1 deck image
 * after every EVERY_N_PARAS prose paragraphs (cap BODY_SLOTS).
 */
function assignBodyImages(answer, id, decks) {
  const n = deckNo(id);
  let body = String(answer || '').replace(/\r\n/g, '\n');
  const drawn = [];
  let replaced = 0;

  // Strip existing body QA images (keep logos / kory / cro-cover)
  body = body.replace(/!\[([^\]]*)\]\(([^)]+)\)\n?/g, (full, alt, url) => {
    if (!isBodyQaImg(url)) return full;
    replaced++;
    return '';
  });
  body = body.replace(/\n{3,}/g, '\n\n');

  const lines = body.split('\n');
  const out = [];
  let paraCount = 0;
  let inserted = 0;
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
    if (paraCount % EVERY_N_PARAS === 0 && inserted < BODY_SLOTS) {
      // don't stack two images
      const prev = out[out.length - 1] || '';
      const next = (lines[i + 1] || '').trim();
      if (/!\[[^\]]*\]\(/.test(prev) || /!\[[^\]]*\]\(/.test(next)) continue;

      const img = draw(decks, n);
      drawn.push(img);
      inserted++;
      out.push('');
      out.push('![CRO revenue operations — figure ' + inserted + '](' + img + ')');
      out.push('');
    }
  }

  // If page was too short / no prose hits, force at least 1–2 after Direct Answer
  if (inserted === 0) {
    const joined = out.join('\n');
    const forceN = Math.min(2, BODY_SLOTS);
    const inject = [];
    for (let k = 0; k < forceN; k++) {
      const img = draw(decks, n);
      drawn.push(img);
      inject.push('![CRO revenue operations — figure ' + (k + 1) + '](' + img + ')');
    }
    const block = '\n\n' + inject.join('\n\n') + '\n\n';
    if (/##\s*Direct Answer\b[^\n]*\n/i.test(joined)) {
      body = joined.replace(/(##\s*Direct Answer\b[^\n]*\n)/i, '$1' + block);
    } else {
      body = block + joined;
    }
    inserted = forceN;
  } else {
    body = out.join('\n');
  }

  body = body.replace(/\n{3,}/g, '\n\n').trim() + '\n';
  return { body, deck: n, drawn, replaced, inserted };
}

async function main() {
  const pilot = String(process.env.PILOT || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const limit = Number(process.env.LIMIT || 0) || 0;
  const st = loadState();
  const doneSet = new Set(st.done || []);
  const decks = st.decks && st.decks[1] && st.decks[2] ? st.decks : loadPool();
  // persist deck split sizes once
  if (!st.deckMeta) {
    st.deckMeta = {
      deck1Size: decks[1].available.length + decks[1].used.length,
      deck2Size: decks[2].available.length + decks[2].used.length,
      rule: 'odd tl ids → deck 1; even tl ids → deck 2; depleting draw',
      noDupe: false,
    };
  }
  st.decks = decks;

  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  let rows = (idx.entries || []).filter(
    (e) => e && isTlId(e.id) && /CRO|Chief Revenue Officer|fractional CRO|interim CRO|VP of Sales|Chief Sales/i.test(e.question || '')
  );
  rows.sort((a, b) => idNum(a.id) - idNum(b.id));

  let ids = rows.map((e) => e.id);
  if (pilot.length) ids = pilot;
  ids = ids.filter((id) => !doneSet.has(id));
  if (limit > 0) ids = ids.slice(0, limit);

  log(
    `START ids=${ids.length} bodySlots=${BODY_SLOTS} deck1=${st.deckMeta.deck1Size} deck2=${st.deckMeta.deck2Size} alreadyDone=${doneSet.size}`
  );

  const stats = { scanned: 0, fixed: 0, skipped: 0, errors: 0, draws: 0 };

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

      const { body, deck, drawn, replaced } = assignBodyImages(entry.answer, id, decks);
      if (!drawn.length && body === entry.answer) {
        st.skipped.push(id);
        st.done.push(id);
        stats.skipped++;
        saveState(st);
        continue;
      }

      let save = Object.assign({}, entry, {
        answer: body,
        updated_at: new Date().toISOString(),
        cro_deck: deck,
        cro_deck_imgs: drawn,
        cro_deck_assigned_at: new Date().toISOString(),
      });
      try {
        save = lockTlAnswerEntry(save, id).entry;
      } catch (_e) {}

      await store.setJSON('answers/' + id + '.json', save);
      st.fixed.push({ id, deck, n: drawn.length, replaced, sample: drawn.slice(0, 3) });
      st.done.push(id);
      st.decks = decks;
      stats.fixed++;
      stats.draws += drawn.length;
      if (stats.fixed <= 12 || stats.fixed % 100 === 0) {
        log(`FIXED ${id} deck=${deck} drew=${drawn.length} replaced=${replaced} · ${drawn[0] || ''}`);
      }
      saveState(st);
    } catch (e) {
      stats.errors++;
      st.errors.push({ id, err: String(e.message || e) });
      log('ERR ' + id + ' ' + (e.message || e));
      saveState(st);
    }
  }

  const report = {
    at: new Date().toISOString(),
    stats,
    deckMeta: st.deckMeta,
    deckLeft: {
      1: { available: decks[1].available.length, used: decks[1].used.length },
      2: { available: decks[2].available.length, used: decks[2].used.length },
    },
    sampleFixed: (st.fixed || []).slice(-20),
  };
  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2));
  log('DONE ' + JSON.stringify(stats));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
