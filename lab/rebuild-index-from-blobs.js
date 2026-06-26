#!/usr/bin/env node
// Rebuilds pulse-machine-library/_index.json by walking the answers/ blob
// prefix. Recovers entries lost to concurrent-writer races in the pillar
// writer scripts (_write_gp.js, _write_ra.js, etc).
//
// Same kind of rescue that ran on 2026-05 when the index dropped from
// 6,271 → 5,014 and we rebuilt it from the answer blobs.
//
// Usage: node lab/rebuild-index-from-blobs.js [--dry-run]

const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');

try {
  const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
const DRY = process.argv.includes('--dry-run');

if (!TOK) {
  console.error('FAIL — no BLOBS_PAT/NETLIFY_BLOBS_TOKEN in env');
  process.exit(1);
}

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });

  console.log('Reading current _index.json...');
  const currentIdx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const currentCount = (currentIdx.entries || []).length;
  console.log('  current index has', currentCount, 'entries');

  console.log('Listing answers/ blob prefix (this may take a moment)...');
  const all = [];
  let cursor;
  let pages = 0;
  do {
    const res = await store.list({ prefix: 'answers/', cursor });
    if (Array.isArray(res.blobs)) {
      for (const b of res.blobs) all.push(b.key);
    }
    cursor = res.cursor;
    pages++;
    if (pages > 200) { console.warn('  too many pages, stopping'); break; }
  } while (cursor);
  console.log('  found', all.length, 'answer blobs across', pages, 'list pages');

  if (all.length <= currentCount) {
    console.log('Blob count <= index count — no rebuild needed.');
    return;
  }

  console.log('Loading each blob to extract index metadata...');
  const entries = [];
  let i = 0;
  // Throttle to ~50 concurrent reads to avoid hammering blob store.
  const CONCURRENCY = 50;
  const queue = all.slice();
  async function worker() {
    while (queue.length) {
      const key = queue.shift();
      i++;
      if (i % 250 === 0) console.log('  read', i, '/', all.length);
      try {
        const blob = await store.get(key, { type: 'json' });
        if (!blob || !blob.id) continue;
        entries.push({
          id: blob.id,
          question: blob.question || '',
          tags: blob.tags || [],
          quality_score: typeof blob.quality_score === 'number' ? blob.quality_score : 5,
          format_v: blob.format_v || null,
          pending: !!blob.pending,
          ts: blob.ts || 0,
          polished_at: blob.polished_at || 0,
          model: blob.model || null,
          was_indexed_at: blob.was_indexed_at || null,
          gold_format: !!blob.gold_format,
        });
      } catch (e) {
        console.warn('  failed', key, e && e.message);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

  // Sort newest first (matches the live writer's unshift behavior).
  entries.sort((a, b) => (b.ts || 0) - (a.ts || 0));

  console.log('Built fresh index with', entries.length, 'entries.');
  console.log('  delta: +' + (entries.length - currentCount), 'entries recovered');

  if (DRY) {
    console.log('DRY-RUN: not writing _index.json. Re-run without --dry-run to commit.');
    return;
  }

  await store.setJSON('_index.json', { entries });
  console.log('WROTE _index.json with', entries.length, 'entries.');
})().catch(e => { console.error('FAIL', e && e.message); process.exit(1); });
