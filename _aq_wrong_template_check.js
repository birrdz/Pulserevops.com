// Spot-check aq bodies for WRONG template markers (Cars/RevOps bleed).
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}
const BAD = [
  { key: 'cars_ranked_header', re: /How We Ranked the Top 10/i },
  { key: 'starting_msrp', re: /Starting MSRP/i },
  { key: 'price_disclaimer_cars', re: /Prices vary significantly based on condition and market/i },
  { key: 'buyer_decision_tree_cars', re: /Buyer Decision Tree/i },
  { key: 'write_ca_path', re: /_write_ca\.js/i },
  { key: 'caranddriver', re: /caranddriver\.com/i },
];
(async () => {
  const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
  const hits = [];
  for (let n = 1; n <= 50; n++) {
    const id = 'aq' + String(n).padStart(4, '0');
    const e = await s.get('answers/' + id + '.json', { type: 'json' });
    if (!e) continue;
    const found = BAD.filter(b => b.re.test(e.answer)).map(b => b.key);
    if (found.length) hits.push({ id, bad: found });
  }
  console.log(JSON.stringify({ scanned: 50, wrongTemplate: hits.length, hits }, null, 2));
})();
