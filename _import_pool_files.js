// Import full-size images from a folder → Fable grade → pool-{pillar}-NNN.jpg
// Usage: node _import_pool_files.js "C:/path/to/folder" tl 1
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { storeGradedImage, flushReg, poolImageRel, verifyGradeStamp, GRADE_STAMP } = require('./_ddg_facecard_lib');

const WD = 'C:/Users/koryj/website';
const DIR = WD + '/assets/qa';
const SRC_DIR = process.argv[2] || path.join(process.env.USERPROFILE || '', 'Downloads', 'pool-import');
const PILLAR = process.argv[3] || 'tl';
const SLOT_START = parseInt(process.argv[4] || '1', 10);
const MIN_W = 600;
const MIN_H = 400;

function poolPath(slot) {
  return DIR + '/pool-' + PILLAR + '-' + String(slot).padStart(3, '0') + '.jpg';
}

async function pHash(buf) {
  try {
    const { data } = await sharp(buf, { animated: false }).grayscale().resize(9, 8, { fit: 'fill' }).raw().toBuffer({ resolveWithObject: true });
    let bits = '';
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { const i = y * 9 + x; bits += data[i] < data[i + 1] ? '1' : '0'; }
    return bits;
  } catch (e) { return null; }
}

function regAdd(ph, url, w, h, slot, query) {
  const REG = WD + '/_img_registry.json';
  let r; try { r = JSON.parse(fs.readFileSync(REG, 'utf8')); } catch (e) { r = { entries: [] }; }
  if (!Array.isArray(r.entries)) r.entries = [];
  const fakeId = '_pool-' + PILLAR + '-' + String(slot).padStart(3, '0');
  r.entries = r.entries.filter(e => e.url !== url);
  r.entries.push({ ph, url, w, h, pillar: PILLAR, pool: true, poolSlot: slot, poolQuery: query || 'owner-import', pages: [fakeId] });
  fs.writeFileSync(REG, JSON.stringify(r));
}

async function main() {
  if (!fs.existsSync(SRC_DIR)) {
    console.error('Folder not found:', SRC_DIR);
    console.error('Usage: node _import_pool_files.js "C:/path/to/images" tl 1');
    process.exit(1);
  }
  const files = fs.readdirSync(SRC_DIR)
    .filter(f => /\.(jpe?g|png|webp)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  if (!files.length) { console.error('No images in', SRC_DIR); process.exit(1); }
  console.log('Importing', files.length, 'from', SRC_DIR, '→ pool-' + PILLAR + ' starting slot', SLOT_START);
  let slot = SLOT_START, ok = 0, skip = 0;
  for (const f of files) {
    const src = path.join(SRC_DIR, f);
    const buf = fs.readFileSync(src);
    const meta = await sharp(buf).metadata();
    if ((meta.width || 0) < MIN_W || (meta.height || 0) < MIN_H) {
      console.log('✗ skip (too small)', f, meta.width + 'x' + meta.height);
      skip++;
      continue;
    }
    const dest = poolPath(slot);
    const rel = poolImageRel(PILLAR, slot);
    const stored = await storeGradedImage(buf, dest, { width: Math.min(1000, meta.width || 1000), bright: false });
    if (!(await verifyGradeStamp(dest))) throw new Error('grade stamp missing');
    const ph = await pHash(fs.readFileSync(dest));
    regAdd(ph, rel, stored.w, stored.h, slot, 'import:' + f);
    console.log('✓ pool-' + PILLAR + '-' + String(slot).padStart(3, '0'), f, '→', stored.w + '×' + stored.h);
    slot++;
    ok++;
  }
  flushReg();
  console.log('Done:', ok, 'imported,', skip, 'skipped (need ≥' + MIN_W + '×' + MIN_H + ' px)');
}

main().catch(e => { console.error(e); process.exit(1); });
