// Quick check: lists any visitor questions awaiting Claude Code answer.
// Reads _visitor_needs_human.json directly from the blob store.
//
// Usage: node _check_pending_vq.js
const fs = require('fs');
const path = require('path');

try {
  const envFile = path.join(__dirname, '.env.local');
  if (fs.existsSync(envFile)) {
    for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
    }
  }
} catch (_e) {}

const { getStore } = require('@netlify/blobs');
const SID = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const f = (await store.get('_visitor_needs_human.json', { type: 'json' })) || { items: [] };
  const items = f.items || [];
  if (!items.length) {
    console.log('No pending visitor questions need Claude Code answers.');
    return;
  }
  console.log(`${items.length} visitor question(s) awaiting Claude Code:\n`);
  items.forEach((it, i) => {
    const ago = it.flagged_at ? Math.round((Date.now() - it.flagged_at) / 60000) + 'm ago' : '?';
    console.log(`  [${i + 1}] ${it.vq_id}  (${ago})`);
    console.log(`        q: ${(it.q || '').slice(0, 140)}`);
    console.log(`        reason: ${it.reason || ''}`);
    console.log('');
  });
  console.log('To answer: draft body to C:/Users/koryj/<vq_id>_answer.md then');
  console.log('  node _write_vq.js <vq_id> "<question>"');
})();
