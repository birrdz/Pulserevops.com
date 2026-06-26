// Republish specific aq IDs from queue + local answer md.
const fs = require('fs');
const { execSync } = require('child_process');
const { buildBody } = require('./_aq_sprint150_bodies');

const QUEUE = JSON.parse(fs.readFileSync('C:/Users/koryj/_aq_sprint125_fish.json', 'utf8'));
const IDS = (process.argv[2] || '').split(',').filter(Boolean);
const map = new Map(QUEUE.map((q) => [q.id, q]));

for (const id of IDS) {
  const item = map.get(id);
  if (!item) {
    console.error('no queue row', id);
    continue;
  }
  const md = `C:/Users/koryj/${id}_answer.md`;
  const body = fs.existsSync(md) ? fs.readFileSync(md, 'utf8') : buildBody(item.title);
  fs.writeFileSync(md, body);
  const titleEsc = item.title.replace(/"/g, '\\"');
  const out = execSync(`node _write_aq.js ${id} "${titleEsc}" ${item.slug}`, {
    cwd: 'C:/Users/koryj/website',
    encoding: 'utf8',
  });
  console.log(id, out.trim().slice(0, 100));
}
