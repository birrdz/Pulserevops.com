// _fcro_remaining_scan.js — ground-truth progress scan for the fractional-CRO (tl) rewrite run.
// Uses the SAME gate as _fcro_audit2.js. Scans every tl entry whose question mentions "fractional cro",
// writes _fcro_remaining.json {done:[ids], todo:[{id,question,problems}], counts}. Read-only (no writes to blobs).
const { getStore } = require('@netlify/blobs');
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
// GATE = current SPEC2 (_FCRO_EXEMPLAR.md) signature. "From the CRO Syndicate network" is the verbatim
// Kory-block intro unique to the current spec — the reliable "is-SPEC2-done" marker.
const BANNED = ['delve', 'tapestry', 'holistic', 'ever-evolving', 'synergy', 'paradigm shift', 'game-changer', 'cutting-edge', 'state-of-the-art', 'seamless integration', 'needless to say', "in today's", "it's worth noting", "it's important to note"];
function gateProblems(a) {
  a = a || '';
  const p = [];
  const words = a.split(/\s+/).filter(Boolean).length;
  if (words < 1600) p.push('words=' + words);
  if (!a.includes('/assets/kory-white.jpg')) p.push('noPhoto');
  if (!a.includes('/cro-syndicate-logo.png')) p.push('noLogo');
  if (!/From the CRO Syndicate network/.test(a)) p.push('noKoryBlock');
  if (!/crosyndicate\.com/i.test(a)) p.push('noSyndLink');
  if (!/\$3 billion/.test(a)) p.push('no$3B');
  if ((a.match(/^\*\*[^*\n]+\?\*\*\s*$/gm) || []).length !== 4) p.push('faq!=4');
  if (!/^##\s+Sources/m.test(a)) p.push('noSources');
  if (/—/.test(a)) p.push('emdash');
  const banned = BANNED.filter(b => a.toLowerCase().includes(b)); if (banned.length) p.push('banned:' + banned.join('/'));
  return p;
}
(async () => {
  const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
  const idx = await s.get('_index.json', { type: 'json' });
  const scope = (idx.entries || []).filter(e => e && /^tl\d+$/.test(String(e.id)) && /fractional\s*cro/i.test(e.question || ''));
  scope.sort((a, b) => parseInt(String(a.id).slice(2), 10) - parseInt(String(b.id).slice(2), 10));
  const done = [], todo = [];
  let n = 0;
  for (const row of scope) {
    const e = await s.get('answers/' + row.id + '.json', { type: 'json' });
    n++;
    if (n % 250 === 0) { fs.writeFileSync('C:/Users/koryj/website/_fcro_scan_progress.txt', n + '/' + scope.length + ' done=' + done.length + ' todo=' + todo.length); }
    if (!e) { todo.push({ id: row.id, question: row.question, problems: ['NO_BLOB'] }); continue; }
    const probs = gateProblems(e.answer);
    if (probs.length) todo.push({ id: row.id, question: row.question, problems: probs });
    else done.push(row.id);
  }
  const out = { scanned: scope.length, done: done.length, todo: todo.length, pct: (done.length / scope.length * 100).toFixed(1), doneIds: done, todoList: todo };
  fs.writeFileSync('C:/Users/koryj/website/_fcro_remaining.json', JSON.stringify(out, null, 1));
  // problem histogram
  const hist = {};
  for (const t of todo) for (const p of t.problems) { const k = p.split(':')[0].replace(/=\d+/, ''); hist[k] = (hist[k] || 0) + 1; }
  console.log('SCANNED ' + scope.length + ' | DONE ' + done.length + ' (' + out.pct + '%) | TODO ' + todo.length);
  console.log('problem histogram:', JSON.stringify(hist));
  console.log('wrote _fcro_remaining.json');
})().catch(x => { console.error('ERR', x.message); process.exit(1); });
