const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}
(async () => {
  const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
  const idx = (await s.get('_index.json', { type: 'json' })) || { entries: [] };
  const ra = (idx.entries || []).filter((e) => e && /^ra\d+$/i.test(e.id));
  const nums = ra.map((e) => parseInt(e.id.slice(2), 10)).sort((a, b) => a - b);
  console.log(JSON.stringify({ count: ra.length, max: nums[nums.length - 1] || 0, min: nums[0] || 0 }));
})();
