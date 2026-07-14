'use strict';
/**
 * Seed _live_bank from existing local pools (fast), unique by hash.
 * Then Pexels fill can top off to 1000+.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');

const WD = __dirname;
const BANK = path.join(WD, 'assets', 'qa', '_live_bank');
const HASH_F = path.join(BANK, '_hashes.json');
const MANI = path.join(BANK, '_manifest.json');
const TARGET = parseInt(process.env.SEED_TARGET || '1000', 10) || 1000;
const SOURCES = [
  path.join(WD, 'assets', 'qa', '_pexels_stored'),
  path.join(WD, 'assets', 'qa', '_gp_pool'),
  path.join(WD, '_facecard_pool'),
];

fs.mkdirSync(BANK, { recursive: true });
function readJSON(f, d) {
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; }
}
function writeJSON(f, o) {
  fs.writeFileSync(f, JSON.stringify(o, null, 2));
}
function walkJpgs(dir, out) {
  try {
    for (const n of fs.readdirSync(dir)) {
      const p = path.join(dir, n);
      try {
        const st = fs.statSync(p);
        if (st.isDirectory()) walkJpgs(p, out);
        else if (/\.jpe?g$/i.test(n) && st.size > 8000) out.push(p);
      } catch (e) {}
    }
  } catch (e) {}
  return out;
}

(async () => {
  const hashes = new Set(readJSON(HASH_F, []));
  const mani = readJSON(MANI, { slots: [] });
  let have = fs.readdirSync(BANK).filter((n) => /\.jpe?g$/i.test(n)).length;
  console.log('[seed] have', have, 'target', TARGET);
  const files = [];
  for (const s of SOURCES) walkJpgs(s, files);
  // shuffle-ish by path hash
  files.sort((a, b) => crypto.createHash('md5').update(a).digest('hex').localeCompare(crypto.createHash('md5').update(b).digest('hex')));
  let added = 0;
  for (const src of files) {
    if (have + added >= TARGET) break;
    let buf;
    try { buf = fs.readFileSync(src); } catch (e) { continue; }
    const hash = crypto.createHash('sha256').update(buf).digest('hex');
    if (hashes.has(hash)) continue;
    const name = 'bank_' + hash.slice(0, 16) + '.jpg';
    const dest = path.join(BANK, name);
    if (fs.existsSync(dest)) continue;
    await sharp(buf)
      .rotate()
      .resize(1400, 1400, { fit: 'cover', position: 'attention' })
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(dest);
    hashes.add(hash);
    mani.slots.push({ file: name, from: src, hash, at: new Date().toISOString(), via: 'seed' });
    added++;
    if (added % 50 === 0) console.log('[seed] added', added, 'total', have + added);
  }
  writeJSON(HASH_F, [...hashes]);
  writeJSON(MANI, mani);
  console.log(JSON.stringify({ ok: true, added, bank: have + added }));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
