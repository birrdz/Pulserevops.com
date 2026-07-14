// _mojibake_fix.js — safe site-wide UTF-8 mojibake repair (owner 2026-07-14).
// Each bad sequence is DERIVED from the correct char via the exact Win-1252 double-encoding that
// produced it, so we only ever replace genuine mojibake — never already-correct text.
// Usage:  node _mojibake_fix.js            (DRY — report only)
//         node _mojibake_fix.js --apply    (write fixes)
'use strict';
const fs = require('fs');
const path = require('path');
const WD = __dirname;
const APPLY = process.argv.includes('--apply');

// Windows-1252 high range (0x80-0x9F) — the bytes that differ from Latin-1.
const CP1252 = { 0x80:'€',0x82:'‚',0x83:'ƒ',0x84:'„',0x85:'…',0x86:'†',0x87:'‡',0x88:'ˆ',0x89:'‰',0x8A:'Š',0x8B:'‹',0x8C:'Œ',0x8E:'Ž',0x91:'‘',0x92:'’',0x93:'“',0x94:'”',0x95:'•',0x96:'–',0x97:'—',0x98:'˜',0x99:'™',0x9A:'š',0x9B:'›',0x9C:'œ',0x9E:'ž',0x9F:'Ÿ' };
function decodeWin1252(buf) {
  let s = '';
  for (const b of buf) {
    if (b >= 0x80 && b <= 0x9F) s += (CP1252[b] || '�');
    else s += String.fromCharCode(b);
  }
  return s;
}
// mojibake form of a correct string = decode-its-utf8-bytes-as-win1252
function mojibakeOf(correct) { return decodeWin1252(Buffer.from(correct, 'utf8')); }

// Correct characters that appear on the site (punctuation, accents, emoji).
const TARGETS = [
  '·','→','↑','↓','–','—','…','•','×','▾','▸','“','”','‘','’','©','®','™','€','⏱️','🏆','─',
  'é','è','ê','à','â','ü','ö','ä','ñ','ç','É',
  '📅','📞','🚀','🦄','💼','📈','📉','🎯','📊','💰','🧭','✅','⏱️','🔍','⭐','📚','🎓','🧰','🎨','📖',
  '🏗️','🗺️','🏪','🏘️','🏫','🌃','🍽️','🧘','✈️','🌴','🏡','⛳','🛋','🎟','👗','🥂','🛠️','🃏','🐠','🤖','📑','📶','💡',
  '🎬','🎮','⛵','🚗','🏈','🛠','⌬','🚨','🔒','🔑','🧩','📆','🧾','🏆','🎏','🧼','⚙️','📌','▶','■'
];
// Build map mojibake→correct. Also add the DOUBLE-encoded form (mojibake of the mojibake) for
// text that got mangled twice (seen in CSS comments). Longest keys first so overlaps resolve right.
const map = new Map();
for (const c of TARGETS) {
  const m1 = mojibakeOf(c);
  if (m1 && m1 !== c) map.set(m1, c);
  const m2 = mojibakeOf(m1);
  if (m2 && m2 !== c && m2 !== m1) map.set(m2, c);
  const m3 = mojibakeOf(m2);                                  // triple-encoded (seen in old CSS comments)
  if (m3 && m3 !== c && m3 !== m1 && m3 !== m2) map.set(m3, c);
}
const keys = [...map.keys()].sort((a, b) => b.length - a.length);

function fixText(txt) {
  let out = txt, n = 0;
  for (const k of keys) {
    if (out.indexOf(k) === -1) continue;
    const before = out;
    out = out.split(k).join(map.get(k));
    if (out !== before) n += (before.length - out.length) / Math.max(1, (k.length - map.get(k).length)) || 1;
  }
  return { out, changed: out !== txt };
}

// Walk site HTML (skip build/vendor/draft copies to avoid double work).
const SKIP_DIRS = new Set(['node_modules', '_site_deploy', '_draft_slim', 'derby', 'lab', '.git', '.netlify']);
const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name)) walk(path.join(dir, e.name)); }
    else if (/\.(html|js|css)$/i.test(e.name) && e.name !== '_mojibake_fix.js' && !/\.min\.js$/i.test(e.name)) files.push(path.join(dir, e.name));
  }
})(WD);

let touched = 0, totalHits = 0;
const report = [];
for (const f of files) {
  let txt;
  try { txt = fs.readFileSync(f, 'utf8'); } catch (e) { continue; }
  // quick pre-check: any mojibake marker at all?
  if (!/[ÃÂâðŸ]/.test(txt)) continue;
  const { out, changed } = fixText(txt);
  if (!changed) continue;
  // count distinct sequences fixed
  let hits = 0; for (const k of keys) { let i = 0; while ((i = txt.indexOf(k, i)) !== -1) { hits++; i += k.length; } }
  touched++; totalHits += hits;
  report.push('  ' + path.relative(WD, f) + '  (' + hits + ' seq)');
  if (APPLY) fs.writeFileSync(f, out);
}
console.log((APPLY ? 'APPLIED' : 'DRY RUN') + ' — ' + files.length + ' html files scanned');
console.log('files with mojibake fixed: ' + touched + '  · total sequences: ' + totalHits);
console.log(report.slice(0, 40).join('\n'));
if (report.length > 40) console.log('  … +' + (report.length - 40) + ' more');
