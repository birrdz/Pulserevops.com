// _sy_conform.js — read-only 7-image conformance sweep for Style (sy) entries.
// Checks per entry: cover image on body line 1, exactly 6 outfit blocks
// (3 Men's + 3 Women's, age bands 20s/40s/60s each), and non-empty img: per block.
const fs = require('fs'), path = require('path');
try { const e = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8'); for (const l of e.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
const { getStore } = require('@netlify/blobs');
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;

const MAXID = parseInt(process.argv[2] || '167', 10); // sweep sy0001..sy<MAXID>

function firstNonEmptyLine(body) {
  for (const l of body.split(/\r?\n/)) { if (l.trim() !== '') return l.trim(); }
  return '';
}

function analyze(body) {
  const cover = /^!\[.*\]\(\s*https?:\/\/\S+\)/.test(firstNonEmptyLine(body));
  const re = /```outfit\r?\n([\s\S]*?)```/g; let m;
  let men = 0, women = 0, missingImg = 0, blocks = 0;
  const bands = new Set();
  const menBands = new Set(), womenBands = new Set();
  while ((m = re.exec(body))) {
    blocks++;
    const inner = m[1];
    const meta = {};
    for (const s of inner.split(/\r?\n/)) { const kv = s.match(/^(gender|age|img):\s*(.*)$/i); if (kv) meta[kv[1].toLowerCase()] = kv[2].trim(); }
    const isWomen = /women|female|ladies/i.test(meta.gender || '');
    const isMen = /men|male|guys/i.test(meta.gender || '') && !isWomen;
    const band = (meta.age || '').match(/\d{2}s?/) ? (meta.age.match(/\d{2}/)[0] + 's') : '';
    if (band) bands.add(band);
    if (isWomen) { women++; if (band) womenBands.add(band); }
    else if (isMen) { men++; if (band) menBands.add(band); }
    const img = (meta.img || '').trim();
    if (!img || /placeholder|example\.com|prompt\//i.test(img)) {
      // pollinations prompt covers are placeholders; but for per-outfit treat blank/placeholder as missing
      if (!img) missingImg++;
      else if (/placeholder|example\.com/i.test(img)) missingImg++;
    }
  }
  const wantBands = ['20s', '40s', '60s'];
  const menBandsOk = wantBands.every(b => menBands.has(b));
  const womenBandsOk = wantBands.every(b => womenBands.has(b));
  return { cover, blocks, men, women, missingImg, bands: [...bands].sort(), menBandsOk, womenBandsOk };
}

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const ids = (idx.entries || []).filter(e => e && /^sy\d+$/.test(e.id) && parseInt(e.id.slice(2), 10) <= MAXID && parseInt(e.id.slice(2), 10) >= 1).map(e => e.id).sort((a, b) => a.localeCompare(b));
  const rows = [];
  for (const id of ids) {
    const blob = await store.get('answers/' + id + '.json', { type: 'json' });
    if (!blob || !blob.answer) { rows.push({ id, missing: true }); continue; }
    const a = analyze(blob.answer);
    rows.push({ id, ...a });
  }
  let fully = 0;
  const noCover = [], wrongBlocks = [], imgGaps = [], missingBlob = [];
  for (const r of rows) {
    if (r.missing) { missingBlob.push(r.id); continue; }
    const structOk = r.cover && r.blocks === 6 && r.men === 3 && r.women === 3 && r.menBandsOk && r.womenBandsOk;
    const imgOk = r.missingImg === 0;
    if (structOk && imgOk) { fully++; continue; }
    if (!r.cover) noCover.push(r.id);
    if (!(r.blocks === 6 && r.men === 3 && r.women === 3 && r.menBandsOk && r.womenBandsOk)) wrongBlocks.push(`${r.id}(b${r.blocks}/m${r.men}/w${r.women}${r.menBandsOk ? '' : '/mAge'}${r.womenBandsOk ? '' : '/wAge'})`);
    if (structOk && !imgOk) imgGaps.push(`${r.id}:${r.missingImg}`);
  }
  console.log('=== Part B: sy0001-sy' + String(MAXID).padStart(4, '0') + ' (' + rows.length + ' entries) ===');
  console.log('FULLY COMPLIANT: ' + fully + '/' + rows.length);
  console.log('\n-- missing blob: ' + (missingBlob.join(', ') || 'none'));
  console.log('\n-- MISSING COVER (' + noCover.length + '): ' + (noCover.join(', ') || 'none'));
  console.log('\n-- WRONG BLOCK STRUCTURE (' + wrongBlocks.length + '): ' + (wrongBlocks.join(', ') || 'none'));
  console.log('\n-- ONLY IMG GAPS (struct OK, blocks missing img) (' + imgGaps.length + '): ' + (imgGaps.join(', ') || 'none'));
  // emit the img-gap ids (clean) for the nudge step
  fs.writeFileSync(path.join(__dirname, '_sy_imggap_ids.txt'), imgGaps.map(x => x.split(':')[0]).join('\n'));
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
