// Publish one Cars entry end-to-end: write -> cards -> insert -> force republish -> IndexNow
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const id = process.argv[2];
const title = process.argv[3];
const slug = process.argv[4] || '';
if (!id || !title) {
  console.error('usage: node _ca_publish_one.js <ca####> "<title>" [slug]');
  process.exit(1);
}
const bodyPath = `C:/Users/koryj/${id}_answer.md`;
if (!fs.existsSync(bodyPath)) {
  console.error('missing body:', bodyPath);
  process.exit(1);
}
const wd = 'C:/Users/koryj/website';
const run = (cmd) => {
  console.log('>', cmd);
  execSync(cmd, { cwd: wd, stdio: 'inherit', shell: true });
};
(async () => {
  const slugArg = slug ? ` "${slug}"` : '';
  run(`node _write_ca.js ${id} "${title.replace(/"/g, '\\"')}"${slugArg}`);
  await new Promise(r => setTimeout(r, 2000));
  run(`node _build_cards.js ${id} car`);
  run(`node _insert_cards.js ${id}`);
  run(`node _write_ca.js ${id} "${title.replace(/"/g, '\\"')}"${slugArg} --force`);
  try {
    const r = await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'pulsemachine-writer-2026', id }),
      signal: AbortSignal.timeout(12000)
    });
    console.log('IndexNow', r.status, await r.text());
  } catch (e) { console.error('IndexNow fail', e.message); }
  console.log('DONE', id, 'https://pulserevops.com/cars/' + id);
})().catch(e => { console.error(e); process.exit(1); });
