// Add an on-brand Contracts & Deals SVG hero to cd#### entries lacking one.
// Usage: node _cd_addhero.js cd0001 cd0002 ...
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try { const e = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8'); for (const l of e.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const ids = process.argv.slice(2).filter(x => /^cd\d+$/i.test(x));
const hasImage = a => /!\[[^\]]*\]\([^)]+\)/.test(a) || /<img\s/i.test(a) || /<svg/i.test(a);
function hero(q) {
  const t = String(q).replace(/[<>&]/g, '').slice(0, 64);
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 340" role="img" aria-label="' + t + ' — PULSE Contracts & Deals">'
    + '<rect width="1200" height="340" fill="#EBE9DE"/><rect width="14" height="340" fill="#C0531F"/>'
    + '<text x="58" y="116" font-family="Arial,Helvetica,sans-serif" font-size="32" font-weight="800" letter-spacing="3" fill="#C0531F">PULSE CONTRACTS &amp; DEALS</text>'
    + '<text x="56" y="198" font-family="Arial,Helvetica,sans-serif" font-size="60" font-weight="800" fill="#2b2b2b">Read it. Negotiate it. Don’t get screwed.</text>'
    + '<text x="58" y="258" font-family="Arial,Helvetica,sans-serif" font-size="30" font-weight="600" fill="#6b5b4d">Leases, vendor MSAs, financing &amp; fees — in your favor</text>'
    + '<g transform="translate(1018,84)" fill="none" stroke="#C0531F" stroke-width="9" stroke-linejoin="round">'
    + '<rect x="30" y="20" width="120" height="150" rx="6"/><line x1="52" y1="56" x2="128" y2="56"/><line x1="52" y1="86" x2="128" y2="86"/><line x1="52" y1="116" x2="108" y2="116"/>'
    + '<path d="M96 150 l20 20 l34 -40" stroke-width="11"/></g>'
    + '</svg>';
}
(async () => {
  let done = 0, skip = 0, miss = 0;
  for (const id of ids) {
    const e = await s.get('answers/' + id + '.json', { type: 'json' });
    if (!e || !e.answer) { miss++; console.log('  MISS', id); continue; }
    if (hasImage(e.answer)) { skip++; continue; }
    e.answer = hero(e.question || id) + '\n\n' + e.answer; e.ts = Date.now(); e.polished_at = Date.now();
    await s.setJSON('answers/' + id + '.json', e); done++; console.log('  +hero', id);
  }
  console.log('CD HERO DONE: added=' + done + ' skipped=' + skip + ' missing=' + miss + ' of ' + ids.length);
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
