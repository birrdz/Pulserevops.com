// Batch runner for the Claude Code CRO front band (tl10009–tl10158).
// Sequential, idempotent, in-band only. Generates body then calls publishTextFirst.
const fs = require('fs');
const path = require('path');
const { build } = require('./_cro_cc_gen');
const { publishTextFirst } = require('./_ds_publish');
const { getStore } = require('@netlify/blobs');

try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const q = JSON.parse(fs.readFileSync('C:/Users/koryj/website/_cro_cc_queue.json', 'utf8'));
  const START = process.argv[2] || null; // optional resume id
  const LIMIT = process.argv[3] ? parseInt(process.argv[3], 10) : q.length;
  let published = 0, skipped = 0, failed = 0, processed = 0;
  const fails = [];
  let started = !START;
  for (const { id, title } of q) {
    if (!started) { if (id === START) started = true; else continue; }
    if (processed >= LIMIT) break;
    processed++;
    // idempotency
    try {
      const ex = await store.get(`answers/${id}.json`, { type: 'json' });
      if (ex && ex.quality_score >= 10) { skipped++; console.log('SKIP', id, '(already published)'); continue; }
    } catch (e) {}
    // generate body
    const body = build(id, title);
    fs.writeFileSync(`C:/Users/koryj/${id}_answer.md`, body, 'utf8');
    // publish
    try {
      const r = await publishTextFirst(id, title, {});
      if (r.ok) { published++; console.log('OK', id, r.score, r.words); }
      else { failed++; fails.push({ id, reason: r.reason, missing: r.missing, banned: r.banned }); console.log('FAIL', id, JSON.stringify(r.missing || r.reason), JSON.stringify(r.banned || [])); }
    } catch (e) {
      failed++; fails.push({ id, err: e.message }); console.log('ERR', id, e.message);
    }
  }
  console.log('---SUMMARY---');
  console.log(JSON.stringify({ published, skipped, failed, processed, fails }, null, 0));
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
