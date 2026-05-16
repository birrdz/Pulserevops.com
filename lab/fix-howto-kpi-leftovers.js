// Fix the broken KPI section across all how-tos. The bad pattern:
//   </script><div class="kpi-name">[X]</div></div>
//     <div class="kpi-card"><div class="kpi-label">KPI 2</div>...</div>
//     <div class="kpi-card"><div class="kpi-label">KPI 3</div>...</div>
//     <div class="kpi-card"><div class="kpi-label">KPI 4</div>...</div>
//   </div>
//
// The new 9 KPIs grid + script already lives ABOVE this and has its own </div>.
// The leftover orphans are the trailing 4 cards from the old 4-KPI layout.
// Strip everything from `</script><div class="kpi-name">` through the next `</div>`
// that's the end-of-grid (the one right before <div class="callout">).

const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'how-tos');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'index.html');

let fixed = 0, skipped = 0;
for (const f of files) {
  const p = path.join(dir, f);
  let html = fs.readFileSync(p, 'utf8');
  if (!html.includes('</script><div class="kpi-name">')) { skipped++; continue; }
  // Match `</script>` + the orphan kpi-name div + the 3 leftover kpi-cards + their closing </div>
  // The orphans always end with `  </div>` followed by a blank line then `<div class="callout">`
  const before = html;
  html = html.replace(
    /<\/script><div class="kpi-name">[\s\S]*?<\/div>\s*\n\s*<div class="callout">/,
    '</script>\n\n  <div class="callout">'
  );
  if (html === before) { skipped++; continue; }
  fs.writeFileSync(p, html, 'utf8');
  console.log('fixed', f);
  fixed++;
}
console.log('done:', { fixed, skipped, total: files.length });
