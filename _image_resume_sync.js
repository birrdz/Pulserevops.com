// One-shot: sync _image_resume.json from _image_scrub.csv (recover after crash mid-batch)
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const csv = fs.readFileSync(WD + '/_image_scrub.csv', 'utf8').trim().split(/\r?\n/).slice(1);
const byP = {};
for (const line of csv) {
  const m = line.match(/"\/knowledge\/([^"]+)","([^"]+)"/);
  if (!m) continue;
  (byP[m[2]] = byP[m[2]] || new Set()).add(m[1]);
}
const resume = JSON.parse(fs.readFileSync(WD + '/_image_resume.json', 'utf8'));
for (const [p, set] of Object.entries(byP)) {
  if (resume.donePillars.includes(p)) continue;
  resume.pillarProgress[p] = { done: [...set] };
}
fs.writeFileSync(WD + '/_image_resume.json', JSON.stringify(resume));
for (const [p, set] of Object.entries(byP)) console.log(p, set.size, 'pages in CSV');
console.log('hf resume now:', (resume.pillarProgress.hf || {}).done?.length || 0);
