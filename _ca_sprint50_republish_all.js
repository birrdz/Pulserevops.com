// Force-republish ca0924–ca0973 with correct titles + template bodies (sequential, no races).
const fs = require('fs');
const { execSync } = require('child_process');
const { buildBody } = require('./_ca_sprint50_bodies');
const QUEUE = JSON.parse(fs.readFileSync('C:/Users/koryj/_ca_sprint50.json', 'utf8'));

for (const item of QUEUE) {
  const body = buildBody(item.title);
  fs.writeFileSync(`C:/Users/koryj/${item.id}_answer.md`, body);
  const titleEsc = item.title.replace(/"/g, '\\"');
  try {
    const out = execSync(`node _write_ca.js ${item.id} "${titleEsc}" ${item.slug} --force`, {
      cwd: 'C:/Users/koryj/website', encoding: 'utf8', timeout: 60000,
    });
    console.log(out.trim());
  } catch (e) {
    console.error('FAIL', item.id, String(e.stderr || e.message).slice(0, 200));
  }
}
