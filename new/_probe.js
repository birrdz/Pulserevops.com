// read-only probe: max q id + shape of a real recent entry (answer body image format, index row, tags)
'use strict';
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
const store = getStore({ name: 'pulse-machine-library', siteID: sid, token: tok });
(async () => {
  const idx = await store.get('_index.json', { type: 'json' });
  const qs = idx.entries.filter(e => /^q\d+$/.test(e.id || ''));
  let max = 0; for (const e of qs) { const n = +e.id.slice(1); if (n > max) max = n; }
  console.log('TOTAL entries:', idx.entries.length, '· q-entries:', qs.length, '· MAX q id: q' + max);
  // newest recent q entry
  const recent = qs.slice().sort((a, b) => (b.polished_at || b.ts || 0) - (a.polished_at || a.ts || 0))[0];
  console.log('\n=== NEWEST q _index ROW ===\n', JSON.stringify(recent, null, 1));
  const blob = await store.get('answers/' + recent.id + '.json', { type: 'json' });
  console.log('\n=== answers/' + recent.id + '.json keys ===\n', Object.keys(blob));
  console.log('\n=== that entry tags ===\n', JSON.stringify(blob.tags));
  const body = blob.answer || '';
  console.log('\n=== body length:', body.length, 'chars ===');
  // show how body images appear (first 3 img-ish lines)
  const imgLines = body.split('\n').filter(l => /!\[|<img|<figure|\/assets\/qa\//i.test(l)).slice(0, 6);
  console.log('\n=== body image lines ===\n' + (imgLines.join('\n') || '(none found)'));
  // also probe qa-bin existence for that id
  const meta = await store.getMetadata('qa-bin/' + recent.id + '.jpg').catch(() => null);
  console.log('\n=== qa-bin/' + recent.id + '.jpg present:', !!meta, meta ? '' : '(served static instead)');
})().catch(e => console.log('ERR', e.message));
