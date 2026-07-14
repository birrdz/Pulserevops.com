'use strict';
/**
 * Corey Fixer pods — PANEL SCOPES ONLY (live site pillars unchanged).
 *
 * Owner 2026-07-13:
 *  - Pods of 30 URLs for the fixer generator
 *  - URLs may mix pillars
 *  - Sort need-fix by remaining 3/3 real stages (sim·quality·gate; image/title fake)
 *  - Pass 3/3 → Santa Workshop (Square Builder); FIXED only after workshop SAVE
 *  - New need-fix URLs → new open pods
 *  - Already-fixed → green DONE pods of 30
 *  - Fully fixed open pod → green + locked (cannot re-fix)
 */
const fs = require('fs');
const path = require('path');

const WD = path.join(__dirname);
const SIM = path.join(WD, 'sim');
const PODS_F = path.join(SIM, 'fixer_pods.json');
const FIXED_F = path.join(SIM, 'FIXED.md');
const STATE_F = path.join(SIM, 'transform_state.json');
const REPORT_F = path.join(SIM, 'scan_report.json');
const REPORT_SITE_F = path.join(SIM, 'scan_report_sitewide.json');
const PROG_F = path.join(SIM, 'fix_progress.json');

const CHUNK = 30;
const STAGE_ORDER = ['similarity', 'quality', 'image', 'title', 'gate'];

const readJSON = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } };
const writeJSON = (f, o) => {
  try {
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, JSON.stringify(o, null, 1));
  } catch (e) {}
};

function idNum(id) {
  return parseInt(String(id || '').replace(/\D/g, ''), 10) || 0;
}
function pillarOf(id) {
  const m = String(id || '').match(/^([a-z]+)\d/i);
  return m ? m[1].toLowerCase() : '';
}
function sortIds(ids) {
  return [...ids].sort((a, b) => idNum(a) - idNum(b));
}

function parsePodScope(scope) {
  const s = String(scope || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  if (s === 'next30' || s === 'next') return { kind: 'next', n: 30 };
  const m = s.match(/^(pod|done)(\d{1,4})$/);
  if (!m) return null;
  return { kind: m[1], n: parseInt(m[2], 10) };
}

const NEXT30_F = path.join(SIM, 'next30.json');

/** Prefer a fat sitewide need-fix report — never trust a tiny next30-scoped scan alone. */
function bestNeedReport() {
  const cur = readJSON(REPORT_F, null);
  const site = readJSON(REPORT_SITE_F, null);
  const countNeed = (rep) => {
    if (!rep || !rep.entries) return 0;
    let n = 0;
    for (const e of Object.values(rep.entries)) {
      if (e && e.pile && e.pile !== 'PASS') n++;
    }
    return n;
  };
  const curN = countNeed(cur);
  const siteN = countNeed(site);
  if (cur && curN >= 50 && String(cur.scope || '').toLowerCase() !== 'next30') {
    try { writeJSON(REPORT_SITE_F, cur); } catch (e) {}
    return cur;
  }
  if (siteN > curN) return site;
  return cur || site;
}

/** Full need-fix queue sorted by remaining 5/5 need (most first). */
function needFixQueue() {
  const cleared = loadClearedIds();
  const prog = readJSON(PROG_F, {});
  const ids = [];
  const seen = new Set();
  let rep = bestNeedReport();

  // Tiny next30-scoped report → rebuild from open fixer pods / sitewide pack
  const countNeed = (r) => {
    if (!r || !r.entries) return 0;
    let n = 0;
    for (const e of Object.values(r.entries)) if (e && e.pile && e.pile !== 'PASS') n++;
    return n;
  };
  if (countNeed(rep) < 30) {
    try {
      const pack = readJSON(PODS_F, { open: [], done: [] });
      const entries = {};
      for (const pod of (pack.open || [])) {
        for (const id of (pod.ids || [])) {
          const idl = String(id).toLowerCase();
          if (cleared.has(idl)) continue;
          entries[idl] = { id: idl, pile: 'SUB13', pillar: pillarOf(idl) };
        }
      }
      // Also fold any leftover tiny report ids
      for (const [id, e] of Object.entries((rep && rep.entries) || {})) {
        const idl = String(id).toLowerCase();
        if (cleared.has(idl) || !e || e.pile === 'PASS') continue;
        if (!entries[idl]) entries[idl] = Object.assign({}, e, { id: idl });
      }
      if (Object.keys(entries).length >= 30) {
        rep = { scope: 'pods-sitewide', at: new Date().toISOString(), entries };
        try { writeJSON(REPORT_SITE_F, rep); } catch (e) {}
      } else if (Object.keys(entries).length) {
        rep = { scope: 'pods-fallback', at: new Date().toISOString(), entries };
      }
    } catch (e) {}
  }

  const need = [];
  const imageOnly = String(process.env.SIM_FIX_STAGE || '').toLowerCase().trim() === 'image';
  const imageDone = imageOnly ? loadImageDoneIds() : new Set();
  // Fixer FIRST → 3/3 → Santa Workshop. Never block Fixer on Square Builder.
  let workshopDone = new Set();
  try {
    workshopDone = require('./_fixer_workshop').loadFixer33Ids();
  } catch (e) {}
  for (const [id, e] of Object.entries((rep && rep.entries) || {})) {
    const idl = String(id).toLowerCase();
    if (cleared.has(idl)) continue;
    if (workshopDone.has(idl)) continue; // already 3/3 — waiting in / sitting through workshop
    // Image GO: skip already image-done so NEXT 30 advances — pod stays until workshop SAVE
    if (imageOnly && imageDone.has(idl)) continue;
    if (!e || e.pile === 'PASS') continue;
    need.push({ id: idl, need: remainingNeed(id, e, prog) });
  }
  need.sort((a, b) => (b.need - a.need) || (idNum(a.id) - idNum(b.id)));
  for (const row of need) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    ids.push(row.id);
  }

  // Owner priority front (Image Fixer):
  // File: sim/fix_priority_front.json → { priority: ['ik','ra',...], ids?: [...] }
  // Explicit ids: pin those exact IDs at the head (owner force batches). Then pillar prefixes.
  try {
    const pri = readJSON(path.join(SIM, 'fix_priority_front.json'), null);
    if (Array.isArray(pri && pri.ids) && pri.ids.length) {
      const front = [];
      const frontSet = new Set();
      for (const raw of pri.ids) {
        const id = String(raw || '').toLowerCase();
        if (!id || frontSet.has(id)) continue;
        frontSet.add(id);
        front.push(id);
      }
      const rest = ids.filter((id) => !frontSet.has(id));
      return front.concat(rest);
    }
    const prefixes = Array.isArray(pri && pri.priority) ? pri.priority.map((p) => String(p).toLowerCase()) : [];
    if (prefixes.length) {
      const prefSet = new Set(prefixes);
      const front = [];
      const rest = [];
      const byP = Object.fromEntries(prefixes.map((p) => [p, []]));
      for (const id of ids) {
        const p = pillarOf(id);
        if (prefSet.has(p)) byP[p].push(id);
        else rest.push(id);
      }
      for (const p of prefixes) front.push(...(byP[p] || []));
      return front.concat(rest);
    }
  } catch (e) {}

  return ids;
}

/**
 * NEXT 30 window into the need-fix queue.
 * opts.offset — start index (0, 30, 60, …)
 * opts.skip — if true, advance one window past current offset
 */
function takeNext30(opts) {
  opts = opts || {};
  const prev = readJSON(NEXT30_F, {});
  let offset = Number.isFinite(Number(opts.offset)) ? Math.max(0, Math.floor(Number(opts.offset))) : Math.max(0, Math.floor(Number(prev.offset) || 0));
  if (opts.skip) offset = offset + CHUNK;

  const queue = needFixQueue();
  if (offset >= queue.length && queue.length) offset = 0; // wrap
  const ids = queue.slice(offset, offset + CHUNK);
  const batch = Math.floor(offset / CHUNK) + 1;
  const batches = Math.max(1, Math.ceil(queue.length / CHUNK));
  const out = {
    at: new Date().toISOString(),
    scope: 'next30',
    n: ids.length,
    ids,
    offset,
    batch,
    batches,
    left: Math.max(0, queue.length - offset - ids.length),
    totalNeed: queue.length,
  };
  writeJSON(NEXT30_F, out);
  const cur = readJSON(PODS_F, { open: [], done: [], locked: {} });
  cur.next30 = out;
  writeJSON(PODS_F, cur);
  return out;
}

/** Skip current stuck group → next 30. */
function skipNext30(opts) {
  return takeNext30(Object.assign({}, opts || {}, { skip: true }));
}

function loadNext30() {
  const cur = readJSON(NEXT30_F, null);
  if (cur && Array.isArray(cur.ids) && cur.ids.length) return cur;
  return takeNext30();
}

function idInNext30(id) {
  const pack = loadNext30();
  const idl = String(id || '').toLowerCase();
  return (pack.ids || []).map(String).map((x) => x.toLowerCase()).includes(idl);
}

/**
 * Truly-fixed ids only (FIXED.md success lines = full 5/5).
 * NEVER treat Image-only or 3-strike skips as done — that emptied pods forever.
 */
function loadClearedIds() {
  const cleared = new Set();
  try {
    const md = fs.readFileSync(FIXED_F, 'utf8');
    for (const line of md.split(/\r?\n/)) {
      // Success ledger lines look like: · id · … · score N · … · 5/5
      if (!/\b5\/5\b/.test(line) && !/\b4\/4\b/.test(line)) continue;
      if (/\bimage-done\b/i.test(line)) continue;
      const m = line.match(/\b([a-z]{1,6}\d{1,6})\b/i);
      if (m) cleared.add(m[1].toLowerCase());
    }
  } catch (e) {}
  return cleared;
}

/** Image-stage completions — advance Image GO pods without removing from 5/5 work. */
function loadImageDoneIds() {
  const done = new Set();
  const f = path.join(SIM, 'IMAGE_DONE.md');
  try {
    const md = fs.readFileSync(f, 'utf8');
    for (const line of md.split(/\r?\n/)) {
      if (!/\bimage-done\b/i.test(line) && !/\b1\/5\b/.test(line)) continue;
      const m = line.match(/\b([a-z]{1,6}\d{1,6})\b/i);
      if (m) done.add(m[1].toLowerCase());
    }
  } catch (e) {}
  return done;
}

/** How many of the 3 real Fixer stages still needed (0–3). Image/title are fake. */
function remainingNeed(id, entry, prog) {
  const e = entry || {};
  const p = (prog && prog[id]) || (prog && prog[String(id).toLowerCase()]) || {};
  const checks = p.checks || {};
  let need = 0;
  if (!(checks.similarity === 'done' || checks.similarity === 'skip')) {
    if (e.pile === 'NEAR_DUP' || (typeof e.overlap === 'number' && e.overlap >= 0.30)) need++;
    else if (!checks.similarity) need++;
  }
  const thin = e.pile === 'STUB' || e.pile === 'SUB13' || (e.words != null && e.words < 800);
  if (!(checks.quality === 'done' || checks.quality === 'skip')) {
    if (thin || e.pile === 'SUB13' || e.pile === 'STUB') need++;
  }
  // image + title are FAKE blast-past — Santa Workshop / Square Builder owns photos + title UI
  if (!(checks.gate === 'done' || checks.gate === 'skip')) {
    if (thin || e.pile === 'SUB13' || e.pile === 'STUB') need++;
  }
  if (e.pile === 'PASS' && !p.status) return 0;
  return Math.max(0, Math.min(3, need));
}

function chunk30(ids) {
  const out = [];
  for (let i = 0; i < ids.length; i += CHUNK) out.push(ids.slice(i, i + CHUNK));
  return out;
}

/**
 * Build / refresh fixer pods from last scan + FIXED ledger.
 * Live pillars NEVER change — this is panel chips only.
 */
function buildFixerPods(opts) {
  opts = opts || {};
  const rep = opts.report || readJSON(REPORT_F, null);
  const prog = opts.prog || readJSON(PROG_F, {});
  const cleared = opts.cleared || loadClearedIds();
  const prev = readJSON(PODS_F, { open: [], done: [], locked: {} });

  const entries = (rep && rep.entries) || {};
  const needFix = [];
  const alreadyOk = new Set([...cleared]);

  for (const [id, e] of Object.entries(entries)) {
    const idl = String(id).toLowerCase();
    if (cleared.has(idl)) {
      alreadyOk.add(idl);
      continue;
    }
    if (!e || e.pile === 'PASS') {
      alreadyOk.add(idl);
      continue;
    }
    const need = remainingNeed(id, e, prog);
    needFix.push({ id: idl, need, pile: e.pile || '' });
  }

  // Preserve locked green pods — do NOT rebuild duplicates
  const lockedIds = new Set();
  const lockedPods = [];
  const seenPodKeys = new Set();
  function takeDonePod(pod) {
    if (!pod || !Array.isArray(pod.ids) || !pod.ids.length) return;
    const key = (pod.ids || []).map((x) => String(x).toLowerCase()).sort().join(',');
    if (seenPodKeys.has(key)) return;
    seenPodKeys.add(key);
    lockedPods.push(Object.assign({}, pod, { locked: true, green: true }));
    for (const id of pod.ids) lockedIds.add(String(id).toLowerCase());
  }
  for (const pod of (prev.done || [])) takeDonePod(pod);
  for (const pod of Object.values(prev.locked || {})) takeDonePod(pod);

  // Already-fixed not in a locked pod → pack into green DONE pods of 30
  const fixedLoose = [...alreadyOk].filter((id) => !lockedIds.has(id)).sort((a, b) => idNum(a) - idNum(b));
  const doneChunks = chunk30(fixedLoose);
  const done = lockedPods.slice();
  let doneNum = done.length;
  for (const ids of doneChunks) {
    doneNum++;
    done.push({
      p: 'done' + doneNum,
      name: 'DONE ' + doneNum,
      n: ids.length,
      ids,
      locked: true,
      green: true,
      note: 'fully fixed · locked',
    });
    for (const id of ids) lockedIds.add(id);
  }

  // Need-fix: sort by remaining 5/5 need (most first), then id
  needFix.sort((a, b) => (b.need - a.need) || (idNum(a.id) - idNum(b.id)));
  const openIds = needFix.map((x) => x.id).filter((id) => !lockedIds.has(id));
  const openChunks = chunk30(openIds);
  const open = [];
  for (let i = 0; i < openChunks.length; i++) {
    const ids = openChunks[i];
    const needs = ids.map((id) => {
      const row = needFix.find((x) => x.id === id);
      return row ? row.need : 0;
    });
    const avgNeed = needs.length ? (needs.reduce((a, b) => a + b, 0) / needs.length) : 0;
    open.push({
      p: 'pod' + (i + 1),
      name: 'POD ' + (i + 1),
      n: ids.length,
      ids,
      locked: false,
      green: false,
      avgNeed: Math.round(avgNeed * 10) / 10,
      note: '~' + avgNeed.toFixed(1) + '/5 need · mix OK',
    });
  }

  // Promote any open pod that somehow became all-cleared
  const stillOpen = [];
  for (const pod of open) {
    const left = pod.ids.filter((id) => !cleared.has(id) && !lockedIds.has(id));
    if (!left.length) {
      doneNum++;
      done.push({
        p: 'done' + doneNum,
        name: 'DONE ' + doneNum,
        n: pod.ids.length,
        ids: pod.ids.slice(),
        locked: true,
        green: true,
        note: 'pod cleared · locked',
        from: pod.p,
      });
    } else if (left.length < pod.ids.length) {
      stillOpen.push(Object.assign({}, pod, { ids: left, n: left.length }));
    } else {
      stillOpen.push(pod);
    }
  }

  // Re-number open pods after promotions
  const openFinal = [];
  for (let i = 0; i < stillOpen.length; i++) {
    const pod = stillOpen[i];
    openFinal.push(Object.assign({}, pod, {
      p: 'pod' + (i + 1),
      name: 'POD ' + (i + 1),
    }));
  }

  const out = {
    at: new Date().toISOString(),
    chunk: CHUNK,
    open: openFinal,
    done,
    locked: {},
    stats: {
      needFix: openIds.length,
      fixed: fixedLoose.length + lockedIds.size,
      openPods: openFinal.length,
      donePods: done.length,
    },
  };
  for (const pod of done) out.locked[pod.p] = pod;
  writeJSON(PODS_F, out);
  return out;
}

let _podsCache = { mtime: -1, data: null };
function loadPods() {
  // mtime-cached: pod-scope filtering calls this once PER ENTRY (35k×); re-reading the big
  // pods file each time made pod scans hang. Cache until fixer_pods.json actually changes.
  try {
    const st = fs.statSync(PODS_F);
    if (_podsCache.data && _podsCache.mtime === st.mtimeMs) return _podsCache.data;
    const cur = readJSON(PODS_F, null);
    if (cur && (cur.open || cur.done)) { _podsCache = { mtime: st.mtimeMs, data: cur }; return cur; }
  } catch (e) {}
  return buildFixerPods();
}

function idInPodScope(id, scope, pods) {
  const parsed = parsePodScope(scope);
  if (!parsed) return null;
  if (parsed.kind === 'next') return idInNext30(id);
  const pack = pods || loadPods();
  const list = parsed.kind === 'done' ? (pack.done || []) : (pack.open || []);
  const pod = list.find((p) => p.p === parsed.kind + parsed.n)
    || (pack.locked && pack.locked[parsed.kind + parsed.n])
    || (parsed.kind === 'next' ? (pack.next30 || null) : null);
  if (!pod && parsed.kind === 'next') return idInNext30(id);
  if (!pod) return false;
  const idl = String(id || '').toLowerCase();
  return (pod.ids || []).map(String).map((x) => x.toLowerCase()).includes(idl);
}

function isPodLocked(scope, pods) {
  const parsed = parsePodScope(scope);
  if (!parsed) return false;
  if (parsed.kind === 'next') return false; // NEXT 30 is always runnable
  const pack = pods || loadPods();
  if (parsed.kind === 'done') return true;
  const pod = (pack.open || []).find((p) => p.p === 'pod' + parsed.n);
  if (pod && pod.locked) return true;
  if (pack.locked && pack.locked['pod' + parsed.n]) return true;
  return false;
}

/** Mark a pod green+locked when all 30 are in FIXED (true 5/5 only).
 *  Image-only completions must NEVER lock/remove a pod. */
function maybeLockPod(scope) {
  const parsed = parsePodScope(scope);
  if (!parsed || parsed.kind !== 'pod') return null;
  const pack = loadPods();
  const pod = (pack.open || []).find((p) => p.p === 'pod' + parsed.n);
  if (!pod) return null;
  const cleared = loadClearedIds(); // FIXED.md 5/5 only — not IMAGE_DONE
  const left = (pod.ids || []).filter((id) => !cleared.has(String(id).toLowerCase()));
  if (left.length) return { locked: false, left: left.length };
  // Move to done
  const donePod = {
    p: 'done' + ((pack.done || []).length + 1),
    name: 'DONE ' + ((pack.done || []).length + 1),
    n: pod.ids.length,
    ids: pod.ids.slice(),
    locked: true,
    green: true,
    note: 'fully fixed · locked',
    from: pod.p,
  };
  pack.open = (pack.open || []).filter((p) => p.p !== pod.p);
  pack.done = (pack.done || []).concat([donePod]);
  pack.locked = pack.locked || {};
  pack.locked[donePod.p] = donePod;
  pack.locked[pod.p] = donePod; // old name also blocked
  pack.at = new Date().toISOString();
  writeJSON(PODS_F, pack);
  return { locked: true, pod: donePod };
}

// ── legacy pillar-section helpers (kept for old tl1-style scopes if typed) ──
const CHUNK_LEGACY = 30;
function sectionSizeForCount(n) { return n <= 1 ? Math.max(1, n) : CHUNK_LEGACY; }
function podCountFor(n, size) {
  if (n <= 1) return 1;
  return Math.min(99, Math.max(1, Math.ceil(n / size)));
}
function podIndexForId(id, nPods) {
  if (nPods <= 1) return 0;
  return idNum(id) % nPods;
}
function buildSections(prefix, ids, _ignoredSize, displayName) {
  const pfx = String(prefix || '').toLowerCase().replace(/[^a-z]/g, '');
  const re = new RegExp('^' + pfx + '\\d', 'i');
  const sorted = sortIds((ids || []).filter((id) => re.test(String(id))));
  const size = sectionSizeForCount(sorted.length, pfx);
  const nPods = podCountFor(sorted.length, size);
  const buckets = Array.from({ length: nPods }, () => []);
  for (const id of sorted) buckets[podIndexForId(id, nPods)].push(id);
  const base = displayName || pfx.toUpperCase();
  const sections = [];
  for (let i = 0; i < nPods; i++) {
    const slice = buckets[i];
    if (!slice.length && nPods > 1) continue;
    sections.push({
      p: pfx + (i + 1),
      name: base + ' ' + (i + 1),
      n: slice.length,
      note: slice.length ? (slice[0] + '-' + slice[slice.length - 1]) : '',
      ids: slice,
    });
  }
  return { sorted, sections, size, nPods };
}
function parseSectionScope(scope) {
  const pod = parsePodScope(scope);
  if (pod) return { prefix: pod.kind, section: pod.n, isFixerPod: true };
  const s = String(scope || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const m = s.match(/^([a-z]+)(\d{1,2})$/);
  if (!m) return null;
  const section = parseInt(m[2], 10);
  if (section < 1 || section > 99) return null;
  return { prefix: m[1], section };
}
function idInSectionScope(id, scope, packsByPrefix) {
  const podHit = idInPodScope(id, scope, null);
  if (podHit !== null) return podHit;
  const parsed = parseSectionScope(scope);
  if (!parsed || parsed.isFixerPod) return parsed && parsed.isFixerPod ? false : null;
  // legacy pillar section
  let sorted = null, size = null, nPods = null;
  if (Array.isArray(packsByPrefix)) {
    sorted = packsByPrefix;
    size = sectionSizeForCount(sorted.length);
    nPods = podCountFor(sorted.length, size);
  } else if (packsByPrefix && packsByPrefix.sorted) {
    sorted = packsByPrefix.sorted;
    size = packsByPrefix.size || sectionSizeForCount(sorted.length);
    nPods = packsByPrefix.nPods || podCountFor(sorted.length, size);
  } else if (packsByPrefix && packsByPrefix[parsed.prefix]) {
    const pack = packsByPrefix[parsed.prefix];
    sorted = pack.sorted;
    size = pack.size || sectionSizeForCount(sorted.length);
    nPods = pack.nPods || podCountFor(sorted.length, size);
  }
  if (!sorted || !sorted.length) return false;
  const idl = String(id || '').toLowerCase();
  return podIndexForId(idl, nPods) === (parsed.section - 1);
}

module.exports = {
  CHUNK,
  SECTION_SIZE: CHUNK,
  SPLIT_MIN: 2,
  STAGE_ORDER,
  PODS_F,
  NEXT30_F,
  idNum,
  sortIds,
  pillarOf,
  parsePodScope,
  buildFixerPods,
  loadPods,
  idInPodScope,
  idInNext30,
  takeNext30,
  skipNext30,
  loadNext30,
  needFixQueue,
  bestNeedReport,
  isPodLocked,
  maybeLockPod,
  loadClearedIds,
  loadImageDoneIds,
  remainingNeed,
  // legacy
  CHUNK_MID: CHUNK,
  CHUNK_BIG: CHUNK,
  CHUNK_TL: CHUNK,
  sectionSizeForCount,
  podCountFor,
  podIndexForId,
  buildSections,
  buildTlSections: (ids) => buildSections('tl', ids, CHUNK, 'Pulse Tools'),
  parseSectionScope,
  parseTlSectionScope: (scope) => {
    const p = parseSectionScope(scope);
    return p && p.prefix === 'tl' ? p.section : 0;
  },
  idInSectionScope,
  idInTlSectionScope: (id, scope, sorted) => idInSectionScope(id, scope, sorted),
};

if (require.main === module) {
  const pack = buildFixerPods();
  console.log(JSON.stringify(pack.stats, null, 2));
  console.log('open', pack.open.slice(0, 3).map((p) => p.p + ':' + p.n).join(' '));
  console.log('done', pack.done.slice(0, 3).map((p) => p.p + ':' + p.n).join(' '));
}
