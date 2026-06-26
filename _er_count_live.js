const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN;
(async () => {
  const s = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const idx = (await s.get('_index.json', { type: 'json' })) || { entries: [] };
  const er = (idx.entries || [])
    .filter((e) => e && /^er\d+$/i.test(e.id))
    .sort((a, b) => parseInt(a.id.slice(2), 10) - parseInt(b.id.slice(2), 10));
  const nums = er.map((e) => parseInt(e.id.slice(2), 10));
  const max = nums.length ? Math.max(...nums) : 0;
  const titles = er.map((e) => e.question).filter(Boolean);
  fs.writeFileSync('C:/Users/koryj/website/_er_existing_titles.json', JSON.stringify(titles, null, 2));
  console.log(
    JSON.stringify({
      count: er.length,
      first: er[0] ? { id: er[0].id, q: er[0].question } : null,
      last: er[er.length - 1] ? { id: er[er.length - 1].id, q: er[er.length - 1].question } : null,
      maxNum: max,
      nextStart: max + 1,
      nextEnd: max + 300,
      nextIdStart: 'er' + String(max + 1).padStart(4, '0'),
      nextIdEnd: 'er' + String(max + 300).padStart(4, '0'),
    }, null, 2)
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
