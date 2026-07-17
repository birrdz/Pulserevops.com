// new/merge_arch_to_cro.js — run this WHEN the Architecture × Art review is done.
// Folds every APPROVED architecture image into what's left of the CRO image pool
// (new/imagebank/cro + _approved.json) so the CRO fixers draw from them too.
// Dedup by id — safe to run more than once. Face-card uniqueness is preserved because
// every image keeps its unique Pexels id (the fixer's markFaceUsed enforces once-only).
'use strict';
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const ARCH_DIR = WD + '/new/imagebank/arch';
const ARCH_IMG = ARCH_DIR + '/img';
const ARCH_APP = ARCH_DIR + '/_approved.json';
const CRO_DIR = WD + '/new/imagebank/cro';
const CRO_APP = WD + '/new/imagebank/_approved.json';
const load = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } };

fs.mkdirSync(CRO_DIR, { recursive: true });
const arch = load(ARCH_APP, []);
const cro = load(CRO_APP, []);
const have = new Set(cro.map(x => x.id));
let added = 0, missing = 0;
for (const a of arch) {
  if (have.has(a.id)) continue;
  const src = ARCH_IMG + '/' + a.file;
  if (!fs.existsSync(src)) { missing++; continue; }
  fs.copyFileSync(src, CRO_DIR + '/' + a.id + '.jpg');
  cro.push({ id: a.id, file: a.id + '.jpg', query: a.query, w: a.w, h: a.h, theme: 'architecture-art' });
  have.add(a.id); added++;
}
fs.writeFileSync(CRO_APP, JSON.stringify(cro));
console.log('[merge] architecture approved=' + arch.length + ' · added-to-CRO=' + added + ' · already-present-skipped=' + (arch.length - added - missing) + ' · file-missing=' + missing + ' · CRO pool now=' + cro.length);
