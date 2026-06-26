// Regenerate static sitemap.xml tool URLs from pulse-tools-registry.
const fs = require('fs');
const path = require('path');
const { TOOLS, SITE } = require('../netlify/functions/lib/pulse-tools-registry');

const smPath = path.join(__dirname, '..', 'sitemap.xml');
const today = new Date().toISOString().slice(0, 10);
let xml = fs.readFileSync(smPath, 'utf8');

const start = '  <!-- PULSE tool landing pages';
const end = '  <!-- Operator-grade pillar pages';
const i0 = xml.indexOf(start);
const i1 = xml.indexOf(end);
if (i0 < 0 || i1 < 0) throw new Error('sitemap.xml markers not found');

const lines = [
  start + ' (sync via node scripts/sync-tools-sitemap.js) -->',
  `  <url><loc>${SITE}/tools/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.92</priority></url>`,
];
Object.keys(TOOLS)
  .sort()
  .forEach((slug) => {
    const t = TOOLS[slug];
    if (t.noindex) return;
    const pri = t.category === 'crm' || t.category === 'warroom' ? '0.9' : '0.85';
    lines.push(
      `  <url><loc>${SITE}/tools/${slug}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>${pri}</priority></url>`
    );
  });
lines.push('');

xml = xml.slice(0, i0) + lines.join('\n') + '\n' + xml.slice(i1);
fs.writeFileSync(smPath, xml, 'utf8');
console.log('Updated', smPath, 'with', lines.length - 2, 'tool URLs');
