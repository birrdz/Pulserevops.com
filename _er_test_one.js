const fs = require('fs');
const { execSync } = require('child_process');
const { buildBody } = require('./_er_sprint300_bodies');
const q = require('./_er_sprint300.json');
const item = q[0];
const body = buildBody(item.title);
fs.writeFileSync(`C:/Users/koryj/${item.id}_answer.md`, body);
const titleEsc = item.title.replace(/"/g, '\\"');
const out = execSync(`node _write_er.js ${item.id} "${titleEsc}" ${item.slug}`, {
  cwd: 'C:/Users/koryj/website',
  encoding: 'utf8',
  stdio: 'inherit',
});
console.log('done');
