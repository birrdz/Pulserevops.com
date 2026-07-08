// Inject the tan stylesheet link into HTML-emitting function files (before the
// first </head> in their template). Idempotent. Edits both roots.
const fs = require('fs');
const path = require('path');
const LINK = '<link rel="stylesheet" href="/assets/pulse-tan.css">';
const TARGETS = ['tools-page.js','pulse-leaderboard-page.js','pulse-machine-tag.js','pulse-machine-rank-view.js','pulse-reviews-hub.js','pulse-gone.js','pulse-machine-audit-list.js'];
const ROOTS = ['C:/Users/koryj/pulse-deploy-clean/netlify/functions','C:/Users/koryj/website/netlify/functions'];
for (const root of ROOTS) {
  for (const t of TARGETS) {
    const f = path.join(root, t);
    let s; try { s = fs.readFileSync(f, 'utf8'); } catch (e) { console.log('skip (missing)', f); continue; }
    if (s.includes('pulse-tan.css')) { console.log('already', t, '@', root.includes('clean')?'clean':'website'); continue; }
    if (!/<\/head>/.test(s)) { console.log('no </head>', t); continue; }
    s = s.replace('</head>', LINK + '</head>'); // first occurrence
    fs.writeFileSync(f, s);
    console.log('injected', t, '@', root.includes('clean')?'clean':'website');
  }
}
