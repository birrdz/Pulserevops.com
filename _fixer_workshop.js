'use strict';
/**
 * Santa's Workshop queue — final phase AFTER Fixer 3/3 (sim · quality · gate).
 * Title + image chips in Fixer are fake; Square Builder owns photos/titles.
 */
const fs = require('fs');
const path = require('path');

const WD = __dirname;
const SIM = path.join(WD, 'sim');
const WORKSHOP_F = path.join(SIM, 'workshop_queue.json');
const FIXER33_F = path.join(SIM, 'FIXER_33.md');
const FIXED_F = path.join(SIM, 'FIXED.md');

function readJSON(f, d) {
  try {
    return JSON.parse(fs.readFileSync(f, 'utf8'));
  } catch (e) {
    return d;
  }
}
function writeJSON(f, o) {
  try {
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, JSON.stringify(o, null, 2));
  } catch (e) {}
}
function pillarOf(id) {
  const m = String(id || '').match(/^([a-z]+)/i);
  return m ? m[1].toLowerCase() : '';
}

function loadWorkshop() {
  const q = readJSON(WORKSHOP_F, null) || { at: null, items: [] };
  if (!Array.isArray(q.items)) q.items = [];
  return q;
}

function saveWorkshop(q) {
  q.at = new Date().toISOString();
  writeJSON(WORKSHOP_F, q);
}

/** Ids that passed Fixer 3/3 (content) — leave Fixer queue; wait in workshop. */
function loadFixer33Ids() {
  const set = new Set();
  try {
    const md = fs.readFileSync(FIXER33_F, 'utf8');
    for (const line of md.split(/\r?\n/)) {
      if (!/\b3\/3\b/.test(line)) continue;
      const m = line.match(/\b([a-z]{1,6}\d{1,6})\b/i);
      if (m) set.add(m[1].toLowerCase());
    }
  } catch (e) {}
  const q = loadWorkshop();
  for (const it of q.items || []) {
    if (it && it.id) set.add(String(it.id).toLowerCase());
  }
  return set;
}

function logFixer33(id, fam, score, kind) {
  try {
    if (!fs.existsSync(FIXER33_F)) {
      fs.writeFileSync(
        FIXER33_F,
        '# sim/FIXER_33.md — Fixer content done (sim·quality·gate = 3/3). Next: Santa Workshop / Square Builder.\n\n'
      );
    }
    fs.appendFileSync(
      FIXER33_F,
      `- ${new Date().toISOString()} · ${id} · family ${fam || '-'} · score ${score != null ? score : '-'} · ${kind || '-'} · 3/3 · workshop\n`
    );
  } catch (e) {}
}

function logWorkshopFixed(id, fam, score, kind) {
  try {
    if (!fs.existsSync(FIXED_F)) {
      fs.writeFileSync(
        FIXED_F,
        '# sim/FIXED.md — RESOLVED (Fixer 3/3 + Santa Workshop SAVE). Append-only.\n\n'
      );
    }
    fs.appendFileSync(
      FIXED_F,
      `- ${new Date().toISOString()} · ${id} · family ${fam || '-'} · score ${score != null ? score : '-'} · ${kind || 'workshop'} · 5/5\n`
    );
  } catch (e) {}
}

/**
 * After Fixer 3/3 — drop URL into Santa's Workshop (open black pills).
 */
function enqueueWorkshop({ id, title, score, kind, family } = {}) {
  const idl = String(id || '').toLowerCase();
  if (!idl) return { ok: false, error: 'no id' };
  const q = loadWorkshop();
  let row = (q.items || []).find((x) => String(x.id).toLowerCase() === idl);
  if (!row) {
    row = {
      id: idl,
      title: String(title || idl),
      pillar: pillarOf(idl),
      score: score != null ? score : null,
      kind: kind || null,
      family: family || null,
      done: false,
      at: new Date().toISOString(),
    };
    q.items.push(row);
  } else if (!row.done) {
    if (title) row.title = String(title);
    if (score != null) row.score = score;
    row.at = new Date().toISOString();
  } else {
    // Already workshop-saved — leave green history; re-open only if explicitly re-enqueued
    row.done = false;
    row.title = String(title || row.title || idl);
    row.at = new Date().toISOString();
  }
  // Open work first; greens to the back
  q.items = (q.items || [])
    .filter((x) => x && !x.done)
    .concat((q.items || []).filter((x) => x && x.done));
  saveWorkshop(q);
  logFixer33(idl, family, score, kind);
  return { ok: true, queue: q, item: row };
}

function markWorkshopSaved(id, meta) {
  const idl = String(id || '').toLowerCase();
  const q = loadWorkshop();
  const row = (q.items || []).find((x) => String(x.id).toLowerCase() === idl);
  if (row) {
    row.done = true;
    row.savedAt = new Date().toISOString();
  }
  q.items = (q.items || [])
    .filter((x) => x && !x.done)
    .concat((q.items || []).filter((x) => x && x.done));
  saveWorkshop(q);
  logWorkshopFixed(idl, meta && meta.family, meta && meta.score, meta && meta.kind);
  return q;
}

function openWorkshopIds() {
  return loadWorkshop()
    .items.filter((x) => x && x.id && !x.done)
    .map((x) => String(x.id).toLowerCase());
}

module.exports = {
  WORKSHOP_F,
  FIXER33_F,
  loadWorkshop,
  saveWorkshop,
  loadFixer33Ids,
  enqueueWorkshop,
  markWorkshopSaved,
  openWorkshopIds,
  logFixer33,
  logWorkshopFixed,
};
