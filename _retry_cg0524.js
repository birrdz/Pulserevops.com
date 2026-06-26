// One-off retry: cg0524 image LAW skip.
const fs = require('fs');
const { execSync } = require('child_process');
const { buildBody } = require('./_cg_sprint300_bodies');

const id = 'cg0524';
const title = 'Top 10 Sales Coaching Drills for First-Line Managers';
const slug = 'coach-sales-coaching-drills-first-line-managers';

fs.writeFileSync(`C:/Users/koryj/${id}_answer.md`, buildBody(title));
const titleEsc = title.replace(/"/g, '\\"');
const out = execSync(`node _write_cg.js ${id} "${titleEsc}" ${slug}`, {
  cwd: 'C:/Users/koryj/website',
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
  maxBuffer: 20 * 1024 * 1024,
});
console.log(out.trim());
