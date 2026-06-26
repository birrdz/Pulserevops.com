// Commit a Top-10/Tools batch from a manifest written by an authoring agent.
// Manifest: C:/Users/koryj/_manifest_<name>.json = [{id,title,slug}, ...]
// Runs _er_fix.js then the matching _write_<pillar>.js (gates at >=10/12).
// Usage: node _commit_manifest.js <name1> [<name2> ...]
const fs = require('fs');
const { execFileSync } = require('child_process');
function writerFor(id) {
  const p = (id.match(/^[a-z]+/i) || [''])[0].toLowerCase();
  const f = `_write_${p}.js`;
  return fs.existsSync(f) ? f : null;
}
let ok = 0, fail = 0;
for (const name of process.argv.slice(2)) {
  const mf = `C:/Users/koryj/_manifest_${name}.json`;
  if (!fs.existsSync(mf)) { console.error(`no manifest ${mf}`); continue; }
  let items = [];
  try { items = JSON.parse(fs.readFileSync(mf, 'utf8')); } catch (e) { console.error(`bad json ${mf}`); continue; }
  let mOk = 0, mPending = 0;
  for (const it of items) {
    const body = `C:/Users/koryj/${it.id}_answer.md`;
    if (!it.id || !it.title) { console.error(`  skip (missing id/title)`); fail++; continue; }
    if (!fs.existsSync(body)) { console.error(`  ${it.id}: no answer file`); fail++; mPending++; continue; }
    const w = writerFor(it.id);
    if (!w) { console.error(`  ${it.id}: no writer`); fail++; continue; }
    try { execFileSync('node', ['_er_fix.js', it.id], { stdio: 'ignore' }); } catch (e) {}
    try {
      execFileSync('node', [w, it.id, it.title, it.slug || ''], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
      console.log(`OK ${it.id}`); ok++; mOk++;
    } catch (e) {
      const msg = (e.stderr || e.stdout || e.message || '').toString().split('\n').filter(Boolean).slice(0, 2).join(' | ');
      console.error(`REJECT ${it.id}: ${msg}`); fail++; mPending++;
    }
  }
  if (mPending === 0 && mOk === items.length) { try { fs.unlinkSync(mf); } catch (e) {} }
}
console.log(`\ncommitted OK=${ok} FAIL=${fail}`);
