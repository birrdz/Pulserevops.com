// One-off: strip all visitor-source items from queue.json so the hot-pink
// "✍ Writing Now" cards stop appearing on /knowledge. User pivoted away from
// flushing the remaining 2 (vq_1onlyrv, vq_1v3r76y) — wants them removed
// instead of written. Also strips any other source==='visitor' items that
// may have piled up.

const { getStore } = require('@netlify/blobs');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
if (!process.env.BLOBS_PAT && process.env.NETLIFY_AUTH_TOKEN) {
  process.env.BLOBS_PAT = process.env.NETLIFY_AUTH_TOKEN;
}

async function main() {
  const store = getStore({
    name: 'pulse-machine-library',
    siteID: process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
  });

  const queue = (await store.get('queue.json', { type: 'json' })) || { items: [] };
  const before = (queue.items || []).length;
  const visitorBefore = (queue.items || []).filter(it => it && it.source === 'visitor').length;
  const remaining = (queue.items || []).filter(it => !it || it.source !== 'visitor');
  await store.setJSON('queue.json', { items: remaining });

  console.log(JSON.stringify({
    ok: true,
    queue_total_before: before,
    visitor_items_removed: visitorBefore,
    queue_total_after: remaining.length,
  }, null, 2));
}

main().catch(e => { console.error(e); process.exit(1); });
