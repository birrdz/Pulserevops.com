// Republish one RA entry from sprint queue.
const fs = require('fs');
const { execSync } = require('child_process');
const { buildBody } = require('./_ra_sprint150_bodies');
const QUEUE = JSON.parse(fs.readFileSync('C:/Users/koryj/_ra_sprint150.json', 'utf8'));
const id = process.argv[2];
const item = QUEUE.find((q) => q.id === id);
if (!item) {
  console.error('not in queue', id);
  process.exit(1);
}
const md = `C:/Users/koryj/${id}_answer.md`;
const body = fs.existsSync(md) ? fs.readFileSync(md, 'utf8') : buildBody(item.title);
fs.writeFileSync(md, body);
const titleEsc = item.title.replace(/"/g, '\\"');
const out = execSync(`node _write_ra.js ${id} "${titleEsc}" ${item.slug}`, { cwd: 'C:/Users/koryj/website', encoding: 'utf8' });
console.log(out.trim());
