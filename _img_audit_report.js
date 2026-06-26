// Aggregate ddg_result files + partial terminal progress for image audit report.
const fs = require('fs');
const path = require('path');
const ROOT = 'C:/Users/koryj/website';

const BEFORE = {
  q: 1644, ra: 472, gp: 391, bs: 262, tl: 185, st: 113, ca: 42, hf: 31, er: 13,
  sc: 9, bt: 5, ik: 5, dn: 3, ai: 2, cl: 2, nl: 2, ga: 1, gm: 1, ev: 1, wl: 1, tn: 1,
  aq: 0, '(other)': 6,
};

const results = {};
for (const f of fs.readdirSync(ROOT)) {
  const m = f.match(/^_(.+)_ddg_result\.json$/);
  if (!m) continue;
  try {
    results[m[1]] = JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
  } catch (e) {}
}

let auditAfter = {};
try {
  auditAfter = JSON.parse(fs.readFileSync(path.join(ROOT, '_img_law_audit.json'), 'utf8')).byPrefix || {};
} catch (e) {}

console.log('prefix | before | ddg_fixed | imgs_added | audit_fail_now');
const prefixes = [...new Set([...Object.keys(BEFORE), ...Object.keys(results)])].sort();
for (const p of prefixes) {
  if (p === '(other)') continue;
  const r = results[p] || {};
  const after = auditAfter[p] ? auditAfter[p].fail : '?';
  console.log(
    `${p.padEnd(6)} | ${String(BEFORE[p] || 0).padStart(6)} | ${String(r.fixed || 0).padStart(9)} | ${String(r.addedImgs || 0).padStart(10)} | ${String(after).padStart(14)}`
  );
}
