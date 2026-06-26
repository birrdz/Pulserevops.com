// Retry sprint300 entries that failed with image LAW or code errors.
const fs = require('fs');
const { execSync } = require('child_process');

const RETRIES = [
  {
    prefix: 'cg',
    id: 'cg0549',
    title: 'Top 10 1:1 Coaching Questions for BDRs',
    slug: 'coach-1-1-coaching-questions-bdrs',
    buildBody: require('./_cg_sprint300_bodies').buildBody,
    writeScript: '_write_cg.js',
  },
  {
    prefix: 'rs',
    id: 'rs0165',
    title: 'Top 10 All-Inclusive Resorts in Tulum',
    slug: 'rs-all-inclusive-resorts-tulum',
    buildBody: require('./_rs_sprint300_bodies').buildBody,
    writeScript: '_write_rs.js',
  },
];

const SYNC_ONLY = [
  { prefix: 'cg', id: 'cg0524' },
  { prefix: 'es', id: 'es0064' },
];

function progPath(prefix) {
  return `C:/Users/koryj/website/_${prefix}_sprint300_progress.json`;
}

function markDone(prefix, id) {
  const p = progPath(prefix);
  const data = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : { done: [] };
  if (!data.done.includes(id)) {
    data.done.push(id);
    data.updated = new Date().toISOString();
    fs.writeFileSync(p, JSON.stringify(data, null, 2));
    console.log(`SYNC ${id} → progress`);
  }
}

for (const item of SYNC_ONLY) {
  markDone(item.prefix, item.id);
}

for (const item of RETRIES) {
  const { id, title, slug, buildBody, writeScript, prefix } = item;
  try {
    fs.writeFileSync(`C:/Users/koryj/${id}_answer.md`, buildBody(title));
    const titleEsc = title.replace(/"/g, '\\"');
    const out = execSync(`node ${writeScript} ${id} "${titleEsc}" ${slug}`, {
      cwd: 'C:/Users/koryj/website',
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 20 * 1024 * 1024,
    });
    const line = out.trim().split('\n').pop();
    const r = JSON.parse(line);
    if (r.ok) {
      markDone(prefix, id);
      console.log(`OK ${id} ${r.words || '?'}w ${r.url}`);
    } else {
      console.error(`FAIL ${id}`, r);
    }
  } catch (e) {
    console.error(`ERR ${id}`, e.message);
    if (e.stderr) console.error(String(e.stderr).slice(-500));
  }
}
