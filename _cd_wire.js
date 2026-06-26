// Register the Contracts & Deals pillar (cd####, /contracts) across all wiring
// points, anchored right after the bo (Buildouts) entries. Idempotent.
const fs = require('fs');
const edits = [
  ['netlify/functions/pulse-machine-library-list.js',
   'co:/^co\\d+$/, ai:/^ai\\d+$/, bo:/^bo\\d+$/,',
   'co:/^co\\d+$/, ai:/^ai\\d+$/, bo:/^bo\\d+$/, cd:/^cd\\d+$/,'],
  ['netlify/functions/pulse-machine-sitemap.js',
   "bo: { path: '/buildouts',                      name: 'Buildouts' },",
   "bo: { path: '/buildouts',                      name: 'Buildouts' },\n  cd: { path: '/contracts',                      name: 'Contracts & Deals' },"],
  ['netlify/functions/pulse-machine-entry.js',
   "bo:['/buildouts/','/buildouts','Buildouts','Pulse Buildouts']};",
   "bo:['/buildouts/','/buildouts','Buildouts','Pulse Buildouts'],cd:['/contracts/','/contracts','Contracts & Deals','Pulse Contracts']};"],
  ['netlify/functions/pulse-machine-entry.js',
   "|coaching|buildouts)",
   "|coaching|buildouts|contracts)"],
  ['js/pulse-search.js',
   "bo:['/buildouts/','🏗️','Buildouts']",
   "bo:['/buildouts/','🏗️','Buildouts'], cd:['/contracts/','📑','Contracts']"],
  ['netlify/functions/pulse-indexnow-target.js',
   '|cg|co|ai|bo)\\d+$/i.test(id)',
   '|cg|co|ai|bo|cd)\\d+$/i.test(id)'],
  ['netlify/functions/lib/indexnow-ping-entry.js',
   '|cg|co|ai|bo)\\d+$/i.test(id)',
   '|cg|co|ai|bo|cd)\\d+$/i.test(id)'],
  ['netlify/functions/lib/library-entry-url.js',
   "if (/^bo\\d+$/i.test(e.id)) return 'buildout';",
   "if (/^bo\\d+$/i.test(e.id)) return 'buildout';\n  if (/^cd\\d+$/i.test(e.id)) return 'contract';"],
  ['netlify/functions/lib/library-entry-url.js',
   "if (kind === 'buildout') return `${SITE}/buildouts/${id}`;",
   "if (kind === 'buildout') return `${SITE}/buildouts/${id}`;\n  if (kind === 'contract') return `${SITE}/contracts/${id}`;"],
  ['netlify.toml',
   '[[redirects]]\n  from = "/sitemap-buildouts.xml"',
   '[[redirects]]\n  from = "/sitemap-contracts.xml"\n  to = "/.netlify/functions/pulse-machine-sitemap?pillar=cd"\n  status = 200\n[[redirects]]\n  from = "/contracts/:id/reviews"\n  to = "/.netlify/functions/pulse-machine-entry?id=:id&kind=contract&view=reviews"\n  status = 200\n[[redirects]]\n  from = "/contracts/:id/review"\n  to = "/.netlify/functions/pulse-machine-entry?id=:id&kind=contract&view=reviews"\n  status = 200\n[[redirects]]\n  from = "/contracts/:id"\n  to = "/.netlify/functions/pulse-machine-entry?id=:id&kind=contract"\n  status = 200\n[[redirects]]\n  from = "/contracts"\n  to = "/contracts.html"\n  status = 200\n[[redirects]]\n  from = "/sitemap-buildouts.xml"'],
];
let okAll = true;
for (const [file, find, repl] of edits) {
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes(repl) && repl !== find) { console.log('SKIP (already wired):', file, '·', find.slice(0, 30)); continue; }
  const n = s.split(find).length - 1;
  if (n !== 1) { console.log('!! ' + file + ': ' + n + ' matches for [' + find.slice(0, 40) + '] — NOT edited'); okAll = false; continue; }
  fs.writeFileSync(file, s.replace(find, repl));
  console.log('wired:', file, '·', find.slice(0, 34));
}
console.log(okAll ? 'ALL WIRED' : 'SOME FAILED');
