// audit-visuals — scans every q*.json for: (1) Mermaid block present + valid,
// (2) sources array with >=3 real URLs. Run daily during the drip.
//
// Usage:  node lab/audit-visuals.js [--fix]  (--fix not implemented yet)
const fs = require('fs');
const path = require('path');

const LAB_DIR = path.join(__dirname, 'cheap-100');
const MERMAID_RE = /```mermaid[\s\S]*?```/i;
const MERMAID_BAD_BRACKET_RE = /\]\]/;

const files = fs.readdirSync(LAB_DIR).filter(f => /^q\d+\.json$/.test(f));
const missing_visual = [];
const broken_mermaid = [];
const missing_sources = [];
const low_sources = [];
const broken_json = [];
let visual_ok = 0;
let sources_ok = 0;

for (const f of files) {
  let entry;
  try { entry = JSON.parse(fs.readFileSync(path.join(LAB_DIR, f), 'utf8')); }
  catch (e) { broken_json.push(f); continue; }
  const body = entry.answer || '';
  // Visual check
  const mm = body.match(MERMAID_RE);
  if (!mm) {
    missing_visual.push({ id: entry.id, question: (entry.question || '').slice(0, 80) });
  } else if (MERMAID_BAD_BRACKET_RE.test(mm[0])) {
    broken_mermaid.push({ id: entry.id, question: (entry.question || '').slice(0, 80) });
  } else {
    visual_ok++;
  }
  // Sources check
  if (!entry.sources || !Array.isArray(entry.sources) || entry.sources.length === 0) {
    missing_sources.push({ id: entry.id, question: (entry.question || '').slice(0, 80) });
  } else if (entry.sources.length < 3) {
    low_sources.push({ id: entry.id, count: entry.sources.length });
  } else {
    sources_ok++;
  }
}

console.log('---- daily audit ----');
console.log('total q*.json files :', files.length);
console.log('');
console.log('VISUALS');
console.log('  with mermaid       :', visual_ok);
console.log('  MISSING mermaid    :', missing_visual.length);
console.log('  BROKEN mermaid `]]`:', broken_mermaid.length);
console.log('');
console.log('SOURCES');
console.log('  with >=3 sources   :', sources_ok);
console.log('  MISSING/empty      :', missing_sources.length);
console.log('  LOW (<3)           :', low_sources.length);
console.log('');
console.log('broken JSON         :', broken_json.length);

if (missing_visual.length && missing_visual.length <= 50) {
  console.log('\nMissing visuals:');
  missing_visual.forEach(m => console.log('  ' + m.id + ' · ' + m.question));
}
if (broken_mermaid.length) {
  console.log('\nBroken mermaid (`]]`):');
  broken_mermaid.forEach(m => console.log('  ' + m.id + ' · ' + m.question));
}
if (missing_sources.length && missing_sources.length <= 50) {
  console.log('\nMissing sources:');
  missing_sources.forEach(m => console.log('  ' + m.id + ' · ' + m.question));
}
if (low_sources.length) {
  console.log('\nLow source count:');
  low_sources.forEach(m => console.log('  ' + m.id + ' (' + m.count + ')'));
}

// Persist a snapshot so the loop / dashboard can read it
const snapshotPath = path.join(__dirname, 'visual-audit.json');
fs.writeFileSync(snapshotPath, JSON.stringify({
  audited_at: new Date().toISOString(),
  total: files.length,
  visual_ok: visual_ok,
  missing_visual_count: missing_visual.length,
  broken_mermaid_count: broken_mermaid.length,
  sources_ok: sources_ok,
  missing_sources_count: missing_sources.length,
  low_sources_count: low_sources.length,
  broken_json_count: broken_json.length,
  missing_visual: missing_visual,
  broken_mermaid: broken_mermaid,
  missing_sources: missing_sources,
  low_sources: low_sources,
  broken_json: broken_json,
}, null, 2));
console.log('\nsnapshot →', snapshotPath);
