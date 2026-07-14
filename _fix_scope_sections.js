'use strict';
/**
 * Fixer scope sections — live URLs unchanged.
 *
 * Under 1000 → exactly 2 halves (300→150, 400→200, 800→400)
 * 1000–1999 → chunks of 600 (1200→two 600s)
 * 2000+ → chunks of 500 (2000→four 500s)
 *
 * Scopes: {prefix}{n} e.g. tl1, q2, ik3 (section 1–99).
 */
const CHUNK_MID = 600;
const CHUNK_BIG = 500;

function idNum(id) {
  return parseInt(String(id || '').replace(/\D/g, ''), 10) || 0;
}

function sortIds(ids) {
  return [...ids].sort((a, b) => idNum(a) - idNum(b));
}

function sectionSizeForCount(n) {
  if (n <= 1) return Math.max(1, n);
  if (n < 1000) return Math.ceil(n / 2);
  if (n < 2000) return CHUNK_MID;
  return CHUNK_BIG;
}

function buildPillarSections(prefix, displayName, ids) {
  const pfx = String(prefix || '').toLowerCase().replace(/[^a-z]/g, '');
  const re = new RegExp('^' + pfx + '\\d', 'i');
  const sorted = sortIds((ids || []).filter((id) => re.test(String(id))));
  const size = sectionSizeForCount(sorted.length);
  const sections = [];
  if (!sorted.length) return { sorted, sections, size };
  const nSec = Math.max(1, Math.ceil(sorted.length / size));
  for (let i = 0; i < nSec; i++) {
    const slice = sorted.slice(i * size, (i + 1) * size);
    if (!slice.length) break;
    sections.push({
      p: pfx + (i + 1),
      name: displayName + ' ' + (i + 1),
      n: slice.length,
      note: slice[0] + '-' + slice[slice.length - 1],
      ids: slice,
    });
  }
  return { sorted, sections, size };
}

function parseSectionScope(scope) {
  const s = String(scope || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const m = s.match(/^([a-z]+)(\d{1,2})$/);
  if (!m) return null;
  const section = parseInt(m[2], 10);
  if (section < 1 || section > 99) return null;
  if (m[2].length >= 4) return null;
  return { prefix: m[1], section };
}

function sectionIndex(id, sortedIds, size) {
  const want = idNum(id);
  let lo = 0, hi = sortedIds.length - 1, found = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const cmp = idNum(sortedIds[mid]) - want;
    if (cmp === 0) { found = mid; break; }
    if (cmp < 0) lo = mid + 1;
    else hi = mid - 1;
  }
  if (found < 0) return -1;
  return Math.floor(found / size);
}

/** @returns {boolean|null} null = not a numbered section scope */
function idInSectionScope(id, scope, packsByPrefix) {
  const parsed = parseSectionScope(scope);
  if (!parsed) return null;
  const idl = String(id || '').toLowerCase();
  if (!new RegExp('^' + parsed.prefix + '\\d').test(idl)) return false;
  const pack = packsByPrefix && packsByPrefix[parsed.prefix];
  if (!pack || !pack.sorted || !pack.sorted.length) return false;
  const idx = sectionIndex(id, pack.sorted, pack.size);
  return idx === (parsed.section - 1);
}

module.exports = {
  CHUNK_MID,
  CHUNK_BIG,
  sectionSizeForCount,
  buildPillarSections,
  parseSectionScope,
  idInSectionScope,
  sortIds,
  idNum,
};
