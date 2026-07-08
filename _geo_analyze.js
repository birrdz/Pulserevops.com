const fs = require('fs');
for (const l of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
// location = capitalized phrase after the last " in " (optionally before " in 20xx")
function loc(t) {
  t = String(t).replace(/\?/g, '').trim();
  const m = t.match(/\bin\s+([A-Z][A-Za-z.]+(?:[\s-][A-Z][A-Za-z.]+){0,2})(?:\s+in\s+20\d\d)?\s*$/);
  return m ? m[1].trim() : null;
}
function key(t) { const L = loc(t); return L ? String(t).replace(new RegExp('\\b' + esc(L) + '\\b'), '{LOC}') : String(t); }

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const tl = (idx.entries || []).filter(e => e && /^tl\d+$/.test(e.id) && e.question);
  const groups = {}; let withLoc = 0;
  for (const e of tl) { const k = key(e.question); (groups[k] = groups[k] || []).push(e.id); if (loc(e.question)) withLoc++; }
  const sizes = Object.values(groups).map(a => a.length);
  const multi = sizes.filter(s => s > 1);
  console.log('tl entries:', tl.length);
  console.log('with detected location:', withLoc);
  console.log('distinct title-templates:', Object.keys(groups).length);
  console.log('templates with >1 variant (dedupable):', multi.length, 'covering', multi.reduce((a, b) => a + b, 0), 'entries');
  console.log('=> unique DeepSeek fixes needed ~=', Object.keys(groups).length, '(vs', tl.length + ')');
  const top = Object.entries(groups).sort((a, b) => b[1].length - a[1].length).slice(0, 10);
  console.log('--- biggest template groups ---');
  top.forEach(([k, ids]) => console.log('  ' + ids.length + 'x  ' + k.slice(0, 72)));
})();
