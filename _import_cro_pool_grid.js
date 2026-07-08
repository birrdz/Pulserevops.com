// Split 10×10 CRO headshot grid → upscale → grade → pool-tl-001..100
const fs = require('fs');
const sharp = require('sharp');
const { storeGradedImage, flushReg, poolImageRel } = require('./_ddg_facecard_lib');
const DIR = WD + '/assets/qa';
function poolImagePath(pillar, slot) {
  return DIR + '/pool-' + pillar + '-' + String(slot).padStart(3, '0') + '.jpg';
}

const WD = 'C:/Users/koryj/website';
const SRC = process.env.CRO_GRID || (process.env.USERPROFILE + '/Downloads/image (2).jpg');
const PILLAR = 'tl';
const COLS = 10;
const ROWS = 10;
const GRID = { left: 23, top: 22, width: 1001, height: 514 };
const OUT_W = 800; // upscale target width (meets qualifyPhoto min after grade)

async function pHash(buf) {
  try {
    const { data } = await sharp(buf, { animated: false }).grayscale().resize(9, 8, { fit: 'fill' }).raw().toBuffer({ resolveWithObject: true });
    let bits = '';
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { const i = y * 9 + x; bits += data[i] < data[i + 1] ? '1' : '0'; }
    return bits;
  } catch (e) { return null; }
}

function regAddPool(ph, url, w, h, slot) {
  const REG_F = WD + '/_img_registry.json';
  let r;
  try { r = JSON.parse(fs.readFileSync(REG_F, 'utf8')); } catch (e) { r = { entries: [] }; }
  if (!Array.isArray(r.entries)) r.entries = [];
  const fakeId = '_pool-' + PILLAR + '-' + String(slot).padStart(3, '0');
  let existing = r.entries.find(e => e.url === url);
  if (existing) {
    existing.ph = ph; existing.w = w; existing.h = h; existing.pool = true;
    existing.poolSlot = slot; existing.poolQuery = 'cro-grid-import';
    existing.pillar = PILLAR;
  } else {
    r.entries.push({ ph, url, w, h, pillar: PILLAR, pool: true, poolSlot: slot, poolQuery: 'cro-grid-import', pages: [fakeId] });
  }
  fs.writeFileSync(REG_F, JSON.stringify(r));
}

async function cellToPortrait(srcBuf, col, row) {
  const cw = Math.floor(GRID.width / COLS);
  const ch = Math.floor(GRID.height / ROWS);
  const left = GRID.left + col * cw;
  const top = GRID.top + row * ch;
  // Inset past black frame + white mat (~12% each side)
  const insetX = Math.round(cw * 0.12);
  const insetY = Math.round(ch * 0.14);
  let tile = sharp(srcBuf).extract({
    left: left + insetX,
    top: top + insetY,
    width: Math.max(8, cw - insetX * 2),
    height: Math.max(8, ch - insetY * 2),
  });
  try {
    tile = tile.trim({ threshold: 18 });
  } catch (e) { /* keep untrimmed */ }
  const meta = await tile.metadata();
  const scale = OUT_W / Math.max(1, meta.width || 1);
  const outH = Math.max(400, Math.round((meta.height || 1) * scale));
  return tile
    .resize(OUT_W, outH, { fit: 'fill', kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 0.8 })
    .jpeg({ quality: 95 })
    .toBuffer();
}

async function main() {
  if (!fs.existsSync(SRC)) { console.error('Missing source:', SRC); process.exit(1); }
  const srcBuf = fs.readFileSync(SRC);
  const dir = WD + '/assets/qa';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  let ok = 0, fail = 0;
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const slot = row * COLS + col + 1;
      const dest = poolImagePath(PILLAR, slot);
      const rel = poolImageRel(PILLAR, slot);
      try {
        const raw = await cellToPortrait(srcBuf, col, row);
        const stored = await storeGradedImage(raw, dest, { width: Math.min(1000, OUT_W), bright: false });
        const ph = await pHash(fs.readFileSync(dest));
        regAddPool(ph, rel, stored.w, stored.h, slot);
        ok++;
        if (slot % 10 === 0 || slot === 1) console.log('✓ pool-' + PILLAR + '-' + String(slot).padStart(3, '0') + ' → ' + stored.w + '×' + stored.h);
      } catch (e) {
        fail++;
        console.log('✗ slot ' + slot + ': ' + e.message);
      }
    }
  }
  flushReg();
  console.log('\nDone: ' + ok + ' imported, ' + fail + ' failed → ' + dir + '/pool-' + PILLAR + '-*.jpg');
}

main().catch(e => { console.error(e); process.exit(1); });
