const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}
(async () => {
  const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
  const prog = JSON.parse(fs.readFileSync('C:/Users/koryj/_ca_sprint50_progress.json', 'utf8'));
  const queue = JSON.parse(fs.readFileSync('C:/Users/koryj/_ca_sprint50.json', 'utf8'));
  const missing = queue.filter((q) => !prog.done.includes(q.id));
  console.log('progress done:', prog.done.length, '/', queue.length);
  console.log('missing from progress:', missing.map((m) => m.id).join(', ') || '(none)');
  for (const id of ['ca0937', 'ca0938', 'ca0944', 'ca0973']) {
    const e = await s.get('answers/' + id + '.json', { type: 'json' });
    const w = e && e.answer ? e.answer.split(/\s+/).length : 0;
    console.log(id, e ? 'live' : 'MISSING', w + 'w', (e && e.question || '').slice(0, 55));
  }
})();
