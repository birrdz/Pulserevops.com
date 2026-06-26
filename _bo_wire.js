// Register the new Pulse Buildouts pillar (bo####, /buildouts) across all wiring
// points, modeled exactly on the collectibles/ai pillars. Idempotent.
const fs = require('fs');
const edits = [
  // 1) library-list PILLAR_ID_RX — makes answers FILTER to the Buildouts pillar
  ['netlify/functions/pulse-machine-library-list.js',
   'tl:/^tl\\d+$/, cg:/^cg\\d+$/, co:/^co\\d+$/, ai:/^ai\\d+$/,',
   'tl:/^tl\\d+$/, cg:/^cg\\d+$/, co:/^co\\d+$/, ai:/^ai\\d+$/, bo:/^bo\\d+$/,'],
  // 2) sitemap hub
  ["netlify/functions/pulse-machine-sitemap.js",
   "gp: { path: '/go-to-market-playbooks',         name: 'GTM Playbooks' },",
   "gp: { path: '/go-to-market-playbooks',         name: 'GTM Playbooks' },\n  bo: { path: '/buildouts',                      name: 'Buildouts' },"],
  // 3) entry renderer __M route/eyebrow map
  ["netlify/functions/pulse-machine-entry.js",
   "ai:['/ai-infrastructure/','/ai-infrastructure','AI Infrastructure','Pulse AI Infrastructure']};",
   "ai:['/ai-infrastructure/','/ai-infrastructure','AI Infrastructure','Pulse AI Infrastructure'],bo:['/buildouts/','/buildouts','Buildouts','Pulse Buildouts']};"],
  // 4) homepage search map (pulse-search.js)
  ["js/pulse-search.js",
   "ai:['/ai-infrastructure/','🤖','AI Tools']",
   "ai:['/ai-infrastructure/','🤖','AI Tools'], bo:['/buildouts/','🏗️','Buildouts']"],
  // 5) netlify.toml routes (insert buildouts block before the collectibles block)
  ['netlify.toml',
   '[[redirects]]\n  from = "/collectibles/:id/reviews"',
   '[[redirects]]\n  from = "/sitemap-buildouts.xml"\n  to = "/.netlify/functions/pulse-machine-sitemap?pillar=bo"\n  status = 200\n[[redirects]]\n  from = "/buildouts/:id/reviews"\n  to = "/.netlify/functions/pulse-machine-entry?id=:id&kind=buildout&view=reviews"\n  status = 200\n[[redirects]]\n  from = "/buildouts/:id/review"\n  to = "/.netlify/functions/pulse-machine-entry?id=:id&kind=buildout&view=reviews"\n  status = 200\n[[redirects]]\n  from = "/buildouts/:id"\n  to = "/.netlify/functions/pulse-machine-entry?id=:id&kind=buildout"\n  status = 200\n[[redirects]]\n  from = "/buildouts"\n  to = "/buildouts.html"\n  status = 200\n[[redirects]]\n  from = "/collectibles/:id/reviews"'],
];
let okAll = true;
for (const [file, find, repl] of edits) {
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes(repl) && repl !== find) { console.log('SKIP (already wired):', file); continue; }
  const n = s.split(find).length - 1;
  if (n !== 1) { console.log('!! ' + file + ': found ' + n + ' matches for anchor (expected 1) — NOT edited'); okAll = false; continue; }
  s = s.replace(find, repl);
  fs.writeFileSync(file, s);
  console.log('wired:', file);
}
console.log(okAll ? 'ALL WIRED' : 'SOME FAILED — review above');
