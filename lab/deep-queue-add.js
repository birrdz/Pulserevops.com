// deep-queue-add.js — add one or more deep-dive specs to _deep_queue.json
// for the every-10-minute pulse-deep-queue-tick-background cron to publish.
//
// Usage:
//   node lab/deep-queue-add.js path/to/spec1.json [path/to/spec2.json ...]
//
// Each spec file must export (or contain JSON of):
//   { id, tldr, core, flow, src, num, counter, links, sources, tags, notes }
//
// Compatible with the runPolish() helper format. Easiest workflow:
//   1. Write your deep-dive script as you normally would (e.g., rewrite-q1908-deep.js)
//   2. Instead of calling runPolish(...), export the spec object
//   3. Run this helper to push the spec into the queue
//
// Locked workflow compliance: this script is run by Claude Code (Opus) on the
// operator's local machine. The cron itself does NOT generate any content;
// it only publishes pre-written specs already in the queue.

const { getStore } = require('@netlify/blobs');
const path = require('path');
const fs = require('fs');

const QUEUE_KEY = '_deep_queue.json';

async function main() {
  const TOKEN = process.env.BLOBS_PAT;
  if (!TOKEN) {
    console.error('BLOBS_PAT not set. Source .env.local first.');
    process.exit(1);
  }
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOKEN });

  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: node lab/deep-queue-add.js <spec.json> [spec2.json ...]');
    process.exit(1);
  }

  const specs = args.map(arg => {
    const fp = path.resolve(arg);
    if (!fs.existsSync(fp)) { console.error('not found: ' + fp); process.exit(1); }
    let s;
    if (fp.endsWith('.json')) {
      s = JSON.parse(fs.readFileSync(fp, 'utf8'));
    } else {
      delete require.cache[fp];
      s = require(fp);
      if (s && s.default) s = s.default;
    }
    if (!s || !s.id || !s.tldr) { console.error('spec missing id/tldr: ' + fp); process.exit(1); }
    return s;
  });

  let queueDoc = (await store.get(QUEUE_KEY, { type: 'json' })) || {
    queue: [],
    published: [],
    started_ms: Date.now()
  };
  queueDoc.queue = queueDoc.queue || [];

  let added = 0;
  for (const s of specs) {
    // Dedupe: skip if same ID already in queue
    if (queueDoc.queue.some(q => q.id === s.id)) {
      console.log('skip (already in queue): ' + s.id);
      continue;
    }
    queueDoc.queue.push(s);
    added++;
    console.log('added: ' + s.id);
  }

  await store.setJSON(QUEUE_KEY, queueDoc);
  console.log('\nqueue size: ' + queueDoc.queue.length + ' entries');
  console.log('cron fires every 10 minutes — full queue will publish over ' + Math.round(queueDoc.queue.length * 10 / 60 * 10) / 10 + ' hours');
}

main().catch(e => { console.error(e); process.exit(1); });
