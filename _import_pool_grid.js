// Split 10×10 image grid → upscale → grade → pool-{pillar}-NNN.jpg
const fs = require('fs');
const sharp = require('sharp');
const { storeGradedImage, flushReg, poolImageRel, verifyGradeStamp, GRADE_STAMP } = require('./_ddg_facecard_lib');

const WD = 'C:/Users/koryj/website';
const DIR = WD + '/assets/qa';
const SRC = process.env.POOL_GRID_SRC || (process.env.USERPROFILE + '/Downloads/image (3).jpg');
const PILLAR = process.env.POOL_PILLAR || 'tl';
const SLOT_START = parseInt(process.env.POOL_SLOT_START || '1', 10);
const COLS = 10;
const ROWS = 10;
const MODE = process.env.POOL_GRID_MODE || 'flush'; // flush = edge-to-edge | framed = inset past mat/frame
const OUT_W = parseInt(process.env.POOL_OUT_W || '800', 10);
const POOL_QUERY = process.env.POOL_QUERY || 'grid-import';

function poolImagePath(pillar, slot) {
  return DIR + '/pool-' + pillar + '-' + String(slot).padStart(3, '0') + '.jpg';
}

async function detectGrid(srcBuf) {
  const meta = await sharp(srcBuf).metadata();
  const w = meta.width, h = meta.height;
  const { data } = await sharp(srcBuf).raw().toBuffer({ resolveWithObject: true });
  const ch = meta.channels || 3;
  const lum = (x, y) => { const i = (y * w + x) * ch; return (data[i] + data[i + 1] + data[i + 2]) / 3; };
  const rows = [];
  for (let y = 0; y < h; y++) { let s = 0; for (let x = 0; x < w; x++) s += lum(x, y); rows.push(s / w); }
  const cols = [];
  for (let x = 0; x < w; x++) { let s = 0; for (let y = 0; y < h; y++) s += lum(x, y); cols.push(s / h); }
  let top = 0, left = 0, bottom = h - 1, right = w - 1;
  for (let y = 0; y < Math.min(80, h - 1); y++) { if (rows[y] < rows[y + 1] - 2) { top = y; break; } }
  for (let y = h - 1; y > Math.max(h - 80, 0); y--) { if (rows[y] < rows[y - 1] - 2) { bottom = y; break; } }
  for (let x = 0; x < Math.min(80, w - 1); x++) { if (cols[x] < cols[x + 1] - 2) { left = x; break; } }
  for (let x = w - 1; x > Math.max(w - 80, 0); x--) { if (cols[x] < cols[x - 1] - 2) { right = x; break; } }
  return { left, top, width: right - left + 1, height: bottom - top + 1, imgW: w, imgH: h };
}

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
    Object.assign(existing, { ph, w, h, pool: true, poolSlot: slot, poolQuery: POOL_QUERY, pillar: PILLAR });
  } else {
    r.entries.push({ ph, url, w, h, pillar: PILLAR, pool: true, poolSlot: slot, poolQuery: POOL_QUERY, pages: [fakeId] });
  }
  fs.writeFileSync(REG_F, JSON.stringify(r));
}

async function cellToImage(srcBuf, grid, col, row) {
  const cw = Math.floor(grid.width / COLS);
  const ch = Math.floor(grid.height / ROWS);
  const left = grid.left + col * cw;
  const top = grid.top + row * ch;
  const insetX = MODE === 'framed' ? Math.round(cw * 0.12) : Math.round(cw * 0.02);
  const insetY = MODE === 'framed' ? Math.round(ch * 0.14) : Math.round(ch * 0.02);
  let tile = sharp(srcBuf).extract({
    left: left + insetX,
    top: top + insetY,
    width: Math.max(8, cw - insetX * 2),
    height: Math.max(8, ch - insetY * 2),
  });
  if (MODE === 'framed') {
    try { tile = tile.trim({ threshold: 18 }); } catch (e) {}
  }
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
  const grid = await detectGrid(srcBuf);
  console.log('Source:', SRC);
  console.log('Grid:', grid, 'mode:', MODE, 'slots:', SLOT_START, '→', SLOT_START + COLS * ROWS - 1);
  if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });

  let ok = 0, fail = 0;
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const slot = SLOT_START + row * COLS + col;
      const dest = poolImagePath(PILLAR, slot);
      const rel = poolImageRel(PILLAR, slot);
      try {
        const raw = await cellToImage(srcBuf, grid, col, row);
        const stored = await storeGradedImage(raw, dest, { width: Math.min(1000, OUT_W), bright: false });
        const stamped = await verifyGradeStamp(dest);
        if (!stamped) throw new Error('Fable grade stamp missing (' + GRADE_STAMP + ')');
        const ph = await pHash(fs.readFileSync(dest));
        regAddPool(ph, rel, stored.w, stored.h, slot);
        ok++;
        if (slot % 10 === 0 || slot === SLOT_START) console.log('✓ pool-' + PILLAR + '-' + String(slot).padStart(3, '0') + ' → ' + stored.w + '×' + stored.h + ' · Fable graded');
      } catch (e) {
        fail++;
        console.log('✗ slot ' + slot + ': ' + e.message);
      }
    }
  }
  flushReg();
  console.log('\nDone: ' + ok + ' imported, ' + fail + ' failed');
}

main().catch(e => { console.error(e); process.exit(1); });
