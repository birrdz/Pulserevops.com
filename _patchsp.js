// Idempotent wiring for the Speeches pillar (sp → /speeches). Adds `sp`
// alongside the existing `sk` anchors in every shared file.
const fs = require('fs');
function patch(file, edits) {
  let s = fs.readFileSync(file, 'utf8');
  let changed = 0;
  for (const [needle, repl, marker] of edits) {
    if (s.includes(marker)) { continue; } // already patched
    if (!s.includes(needle)) { console.log('  !! anchor MISSING in ' + file + ': ' + needle.slice(0, 50)); continue; }
    s = s.replace(needle, repl); changed++;
  }
  fs.writeFileSync(file, s);
  console.log((changed ? '✓ ' : '· ') + file + ' (' + changed + ' edits)');
}

// 1. entry renderer
patch('netlify/functions/pulse-machine-entry.js', [
  ['gatherings|gaming|skills)\\/([\\w-]+?)', 'gatherings|gaming|skills|speeches)\\/([\\w-]+?)', 'skills|speeches)'],
  ["sk:['/skills/','/skills','Skills','Pulse Skills']};",
   "sk:['/skills/','/skills','Skills','Pulse Skills'],sp:['/speeches/','/speeches','Speeches','Pulse Speeches']};", "'Pulse Speeches']"],
  ['|sy|ga|gm|sk)(?=\\d)', '|sy|ga|gm|sk|sp)(?=\\d)', '|sk|sp)(?=\\d)'],
]);
// 2. library-entry-url
patch('netlify/functions/lib/library-entry-url.js', [
  ["if (/^sk\\d+$/i.test(e.id)) return 'skill';",
   "if (/^sk\\d+$/i.test(e.id)) return 'skill';\n  if (/^sp\\d+$/i.test(e.id)) return 'speech';", "return 'speech';"],
  ["if (kind === 'skill') return `${SITE}/skills/${id}`;",
   "if (kind === 'skill') return `${SITE}/skills/${id}`;\n  if (kind === 'speech') return `${SITE}/speeches/${id}`;", "/speeches/${id}`;"],
]);
// 3. sitemap
patch('netlify/functions/pulse-machine-sitemap.js', [
  ["sk: { path: '/skills',                         name: 'Skill Drills' },",
   "sk: { path: '/skills',                         name: 'Skill Drills' },\n  sp: { path: '/speeches',                       name: 'Speeches' },", "name: 'Speeches' }"],
  ["  sk: '/skills/',\n", "  sk: '/skills/',\n  sp: '/speeches/',\n", "sp: '/speeches/',"],
  ["'sitemap-skills':                 'sk',", "'sitemap-skills':                 'sk',\n      'sitemap-speeches':               'sp',", "'sitemap-speeches'"],
  ['|sy|ga|gm|sk)\\d+$/i.test(e.id)', '|sy|ga|gm|sk|sp)\\d+$/i.test(e.id)', '|sk|sp)\\d+$/i.test'],
  ["ga:'/gatherings/', gm:'/gaming/', sk:'/skills/' };", "ga:'/gatherings/', gm:'/gaming/', sk:'/skills/', sp:'/speeches/' };", "sk:'/skills/', sp:'/speeches/'"],
]);
// 4. library-list PILLAR_ID_RX
patch('netlify/functions/pulse-machine-library-list.js', [
  ['ga:/^ga\\d+$/, gm:/^gm\\d+$/, sk:/^sk\\d+$/,', 'ga:/^ga\\d+$/, gm:/^gm\\d+$/, sk:/^sk\\d+$/, sp:/^sp\\d+$/,', 'sk:/^sk\\d+$/, sp:/^sp\\d+$/'],
]);
// 5. pillar-page.js
patch('js/pillar-page.js', [
  ["{ key: 'sk',     label: '🎯 Skill Drills', re: /^sk\\d+$/i },",
   "{ key: 'sk',     label: '🎯 Skill Drills', re: /^sk\\d+$/i },\n    { key: 'sp',     label: '🎤 Speeches',   re: /^sp\\d+$/i },", "label: '🎤 Speeches'"],
  ["    sk: '/skills/',\n", "    sk: '/skills/',\n    sp: '/speeches/',\n", "sp: '/speeches/',"],
  ["    sk:     '/skills',\n", "    sk:     '/skills',\n    sp:     '/speeches',\n", "sp:     '/speeches',"],
]);
// 6. index.html door
patch('index.html', [
  ['<a class="pcard" href="/skills"><span class="em">🎯</span><span class="pt"><span class="pn">Skill Drills</span><span class="pd">Runnable team workshops</span></span></a>',
   '<a class="pcard" href="/skills"><span class="em">🎯</span><span class="pt"><span class="pn">Skill Drills</span><span class="pd">Runnable team workshops</span></span></a>\n    <a class="pcard" href="/speeches"><span class="em">🎤</span><span class="pt"><span class="pn">Speeches</span><span class="pd">Toasts &amp; famous speeches</span></span></a>',
   'href="/speeches"'],
]);
console.log('done');
