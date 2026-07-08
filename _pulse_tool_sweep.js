// _pulse_tool_sweep.js — sweep EVERY tl entry and fix the self-promo "PULSE <tool>"
// product items whose IMAGE and/or LINK are wrong. Sets img -> the PULSE logo and
// site/link -> the correct /tools/<slug>. Deploy-free (answer blobs only). Idempotent.
// Usage: node -r ./_loadenv.js _pulse_tool_sweep.js [--dry]
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

const DRY = process.argv.includes('--dry');
const LOGO = 'https://pulserevops.com/pulse-logo.svg';
const BASE = 'https://pulserevops.com';

// PULSE tool display-name fragment -> canonical /tools slug.
const SLUG = [
  [/pulse\s*check/i,            '/tools/pulse-check'],
  [/rep\s*scheduling/i,         '/tools/rep-scheduling'],
  [/house\s*goals/i,            '/tools/house-goals'],
  [/gross\s*profit/i,           '/tools/gross-profit-calculator'],
  [/tier\s*distribution/i,      '/tools/tier-distribution'],
  [/service\s*fees/i,           '/tools/service-fees'],
  [/recruiting\s*calculator/i,  '/tools/recruiting-calculator'],
  [/lead\s*enrich/i,            '/tools/lead-enricher'],
  [/90[-\s]*day/i,              '/tools/90-day-revenue-plan'],
  [/pulse\s*matrix/i,           '/tools/pulse-matrix'],
];
function slugFor(name) {
  for (const [rx, s] of SLUG) if (rx.test(name)) return BASE + s;
  return BASE + '/tools'; // unknown PULSE tool -> tools index (no broken link)
}

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const tl = idx.entries.filter(e => /^tl\d+$/.test(e.id));
  let scanned = 0, fixed = 0, items = 0;
  const byTool = {}, badHosts = {};
  for (const e of tl) {
    const a = await store.get(`answers/${e.id}.json`, { type: 'json' });
    if (!a || !a.answer || !/PULSE/.test(a.answer)) continue;
    const before = a.answer;
    let body = before;
    // 1) @@PRODUCT lines whose name contains PULSE -> force logo + correct slug.
    body = body.replace(/@@PRODUCT\s+name="([^"]*PULSE[^"]*)"\s+img="([^"]*)"\s+site="([^"]*)"/gi,
      (m, name, img, site) => {
        items++;
        byTool[name] = (byTool[name] || 0) + 1;
        const h = (img.match(/https?:\/\/([^/]+)/) || [])[1] || 'local';
        if (img !== LOGO) badHosts[h] = (badHosts[h] || 0) + 1;
        return `@@PRODUCT name="${name}" img="${LOGO}" site="${slugFor(name)}"`;
      });
    // 2) markdown images whose alt mentions a PULSE tool but URL is a wrong host.
    body = body.replace(/!\[([^\]]*PULSE[^\]]*)\]\((https?:\/\/[^)]+)\)/gi,
      (m, alt, url) => (url === LOGO ? m : `![${alt}](${LOGO})`));
    if (body !== before) {
      if (!DRY) { a.answer = body; a.pulse_tool_sweep_at = Date.now(); await store.setJSON(`answers/${e.id}.json`, a); }
      fixed++;
      if (!DRY && fixed % 25 === 0) console.log(`  …fixed ${fixed}`);
    }
    scanned++;
  }
  console.log(`${DRY ? 'DRY ' : ''}DONE. tl scanned(with PULSE): ${scanned} | entries changed: ${fixed} | PULSE product items: ${items}`);
  console.log('by tool:', JSON.stringify(byTool, null, 0));
  console.log('bad image hosts (pre-fix):', JSON.stringify(badHosts, null, 0));
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
