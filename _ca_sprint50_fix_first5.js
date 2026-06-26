// Republish ca0924-ca0928 with template bodies (overwrite low-quality Gemini drafts).
const fs = require('fs');
const { execSync } = require('child_process');
const { buildBody } = require('./_ca_sprint50_bodies');
const QUEUE = JSON.parse(fs.readFileSync('C:/Users/koryj/_ca_sprint50.json', 'utf8'));
const IDS = ['ca0924','ca0925','ca0926','ca0927','ca0928'];
for (const id of IDS) {
  const item = QUEUE.find(q => q.id === id);
  const body = buildBody(item.title);
  fs.writeFileSync(`C:/Users/koryj/${id}_answer.md`, body);
  const titleEsc = item.title.replace(/"/g, '\\"');
  const out = execSync(`node _write_ca.js ${id} "${titleEsc}" ${item.slug} --force`, { cwd: 'C:/Users/koryj/website', encoding: 'utf8' });
  console.log(out.trim());
}
