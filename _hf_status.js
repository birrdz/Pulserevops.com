// Quick HF pillar status: live IDs vs hf0001-hf0050 queue
const fs = require('fs');
const { getStore } = require('@netlify/blobs');

try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (_) {}

const wf = fs.readFileSync('C:/Users/koryj/website/_hf_workflow.js', 'utf8');
const queue = [];
for (const m of wf.matchAll(/\{"id":"(hf\d+)","title":"([^"]+)","slug":"([^"]+)"\}/g)) {
  queue.push({ id: m[1], title: m[2], slug: m[3] });
}

const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN;

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const liveSet = new Set(
    (idx.entries || []).filter((e) => e && /^hf\d+$/i.test(e.id)).map((e) => e.id)
  );

  const missing = queue.filter((q) => !liveSet.has(q.id));
  const live = queue.filter((q) => liveSet.has(q.id));

  console.log(JSON.stringify({
    queueTotal: queue.length,
    liveInQueue: live.length,
    missingCount: missing.length,
    liveAnywhere: [...liveSet].sort((a, b) => parseInt(a.slice(2), 10) - parseInt(b.slice(2), 10)).length,
    missing,
  }, null, 2));
})().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
