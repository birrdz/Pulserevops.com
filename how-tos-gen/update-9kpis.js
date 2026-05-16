// Updates each how-to page's "4 KPIs That Matter Most" section to a 9-KPI
// section pulled from INDUSTRY_PRESETS (which already has 9 KPIs per industry).
// Also injects a small client-side script that, on page load, fetches the
// latest cron-updated KPIs from `/.netlify/functions/industry-kpis?ind=<slug>`
// and overlays them onto the existing cards if successful.
//
// Run from project root:
//   node how-tos-gen/update-9kpis.js
//
// Idempotent — running twice is fine; the regex-anchored replacement matches
// only the original 4-KPI block.

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const HOW_TOS_DIR = path.join(PROJECT_ROOT, 'how-tos');
const DASHBOARD = path.join(PROJECT_ROOT, 'dashboard.html');

// ── Extract INDUSTRY_PRESETS from dashboard.html ─────────────────────────────
function extractPresets() {
  const html = fs.readFileSync(DASHBOARD, 'utf8');
  // Find: const INDUSTRY_PRESETS = { ... };
  // The block is multi-line and contains nested objects; we'll grab from the
  // "const INDUSTRY_PRESETS = {" through the matching "};" by counting braces.
  const startMatch = html.match(/const INDUSTRY_PRESETS = \{/);
  if (!startMatch) throw new Error('Could not find INDUSTRY_PRESETS in dashboard.html');
  const start = startMatch.index + startMatch[0].length - 1; // position of the '{'
  let depth = 0;
  let end = -1;
  for (let i = start; i < html.length; i++) {
    const c = html[i];
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) { end = i; break; }
    }
  }
  if (end < 0) throw new Error('Could not match closing brace for INDUSTRY_PRESETS');
  const body = html.slice(start, end + 1);

  // Per-industry KPI names: walk slug entries by regex.
  // Pattern: <slug>: { kpis: ['...','...',...], ... }
  const presets = {};
  const reSlug = /(\w[\w-]{0,40}?)\s*:\s*\{\s*kpis\s*:\s*\[([^\]]+)\]/g;
  let m;
  while ((m = reSlug.exec(body)) !== null) {
    const slug = m[1];
    const arrBody = m[2];
    // Parse the string array — values are 'single quoted', possibly escaped.
    const items = [];
    const reStr = /'((?:\\'|[^'])*?)'/g;
    let s;
    while ((s = reStr.exec(arrBody)) !== null) {
      items.push(s[1].replace(/\\'/g, "'"));
    }
    if (items.length) presets[slug] = items;
  }
  return presets;
}

// ── Render the new 9-KPI HTML block ──────────────────────────────────────────
function renderKpiBlock(slug, kpis, industryLabel) {
  const cards = kpis.slice(0, 9).map((name, i) => {
    return `    <div class="kpi-card"><div class="kpi-label">KPI ${i+1}</div><div class="kpi-name">${name}</div></div>`;
  }).join('\n');
  return `  <h2>The 9 KPIs That Matter Most</h2>
  <p>Stop tracking everything. These nine metrics give you the clearest signal of revenue health in ${industryLabel}:</p>
  <div class="kpi-grid" id="how-to-kpi-grid" data-industry="${slug}">
${cards}
  </div>
  <script>
  // Daily-refreshed KPIs from the prewarm cron (industry-kpis-refresh-background).
  // If the cron has cached fresh data for this industry, swap the cards in place.
  (function(){
    try {
      var grid = document.getElementById('how-to-kpi-grid');
      if (!grid) return;
      var ind = grid.getAttribute('data-industry') || '${slug}';
      var ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
      var t = setTimeout(function(){ if (ctrl) ctrl.abort(); }, 4000);
      fetch('/.netlify/functions/industry-kpis?ind=' + encodeURIComponent(ind), ctrl ? { signal: ctrl.signal } : {})
        .then(function(r){ clearTimeout(t); return r.ok ? r.json() : null; })
        .then(function(d){
          if (!d || !d.ok || !Array.isArray(d.kpis) || !d.kpis.length) return;
          var real = d.kpis.filter(function(k){ return k && k.name && !/^KPI\\s*\\d+$/i.test(String(k.name).trim()); });
          if (real.length < 3) return; // placeholder-only response, ignore
          var html = real.slice(0, 9).map(function(k, i){
            return '<div class="kpi-card"><div class="kpi-label">KPI ' + (i+1) + '</div><div class="kpi-name">' + (k.name || '').replace(/[<>]/g, '') + '</div></div>';
          }).join('');
          grid.innerHTML = html;
        })
        .catch(function(){ /* baked-in 9 stay visible */ });
    } catch(e) {}
  })();
  </script>`;
}

// ── Map slug → friendly label (matches how-tos index data) ───────────────────
const LABELS = {
  security:'Home Security', internet:'Internet / Broadband', solar:'Solar / Energy',
  mortgage:'Mortgage / Lending', insurance:'Insurance', realestate:'Real Estate',
  saas:'SaaS / Software', gym:'Fitness / Gym', streaming:'Streaming / Media',
  banking:'Banking / Fintech', healthcare:'Healthcare', auto:'Auto / Dealership',
  pest:'Pest Control', hvac:'HVAC / Home Services', cable:'Cable / Satellite TV',
  moving:'Moving / Storage', travel:'Travel / Hospitality', legal:'Legal / Professional',
  retail:'Retail / E-commerce', staffing:'Staffing / Recruiting', pharma:'Pharma / Biotech',
  meddevice:'Medical Device', construction:'Construction', edtech:'Education / EdTech',
  restaurant:'Restaurant', ecommerce:'E-commerce / DTC', cybersec:'Cybersecurity',
  logistics:'Logistics / Freight', events:'Events / Entertainment', dental:'Dental / Ortho',
  veterinary:'Veterinary', cleaning:'Cleaning / Facilities', wellness:'Wellness / Spa',
  msp:'IT Services / MSP', media:'Digital Advertising', agriculture:'Agriculture',
  wholesale:'Wholesale Distribution', printing:'Printing / Signage', nonprofit:'Nonprofit'
};

// ── Replace the "4 KPIs" block in a single how-to file ──────────────────────
function processFile(filePath) {
  const slug = path.basename(filePath, '.html');
  if (slug === 'index') return { slug, status: 'skip-index' };
  if (!LABELS[slug]) return { slug, status: 'unknown-slug' };

  let html = fs.readFileSync(filePath, 'utf8');
  // Match: <h2>The 4 KPIs That Matter Most</h2> + intro <p> + <div class="kpi-grid">...</div>
  // Anchored so we don't double-replace if the file is already updated.
  const re = /<h2>The 4 KPIs That Matter Most<\/h2>\s*<p>[^<]*<\/p>\s*<div class="kpi-grid">[\s\S]*?<\/div>/;
  if (!re.test(html)) {
    // Already updated? Or unexpected structure. Skip with a note.
    if (/The 9 KPIs That Matter Most/.test(html)) return { slug, status: 'already-9' };
    return { slug, status: 'pattern-not-found' };
  }
  return { slug, status: 'ok' };
}

// Main
const presets = extractPresets();
const files = fs.readdirSync(HOW_TOS_DIR)
  .filter(f => f.endsWith('.html') && f !== 'index.html')
  .map(f => path.join(HOW_TOS_DIR, f));

const stats = { ok: 0, 'already-9': 0, 'pattern-not-found': 0, 'unknown-slug': 0, 'no-kpis': 0 };
const issues = [];

files.forEach(filePath => {
  const slug = path.basename(filePath, '.html');
  if (!LABELS[slug]) { stats['unknown-slug']++; issues.push({slug, reason:'no label'}); return; }
  const kpis = presets[slug];
  if (!kpis || kpis.length < 9) {
    stats['no-kpis']++;
    issues.push({slug, reason:'no 9 KPIs in presets', got: kpis ? kpis.length : 0});
    return;
  }

  let html = fs.readFileSync(filePath, 'utf8');
  const re = /<h2>The 4 KPIs That Matter Most<\/h2>[\s\S]*?<\/div>/;
  if (!re.test(html)) {
    if (/The 9 KPIs That Matter Most/.test(html)) {
      stats['already-9']++;
      return;
    }
    stats['pattern-not-found']++;
    issues.push({slug, reason:'4-KPI pattern not found'});
    return;
  }

  const newBlock = renderKpiBlock(slug, kpis, LABELS[slug]);
  // Trim leading 2 spaces from rendered block to match indentation of original
  const indented = newBlock; // newBlock already starts at proper indent
  html = html.replace(re, indented);
  fs.writeFileSync(filePath, html);
  stats.ok++;
});

console.log('Done.', stats);
if (issues.length) console.log('Issues:', issues);
