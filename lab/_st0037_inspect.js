const { getStore } = require('@netlify/blobs');
const fs = require('fs');

const token = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8')
  .split(/\r?\n/).find(l => l.startsWith('BLOBS_PAT=')).slice('BLOBS_PAT='.length).trim();

const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token
});

(async () => {
  const rec = await store.get('answers/st0037.json', { type: 'json' });
  const shape = {};
  for (const k of Object.keys(rec)) {
    const v = rec[k];
    shape[k] = Array.isArray(v) ? 'array[' + v.length + ']' : (v === null ? 'null' : typeof v);
  }
  console.log('ST0037 FIELD SHAPE:', JSON.stringify(shape, null, 2));
  console.log('TAGS:', JSON.stringify(rec.tags));

  const idx = await store.get('_index.json', { type: 'json' });
  const stIds = (idx.entries || []).map(e => e.id).filter(id => /^st\d+$/.test(id))
    .map(id => parseInt(id.slice(2), 10)).sort((a, b) => a - b);
  console.log('HIGHEST ST IN INDEX:', stIds[stIds.length - 1]);
  const sample = (idx.entries || []).find(e => e.id === 'st0037');
  console.log('INDEX ENTRY SHAPE st0037:', JSON.stringify(sample));
})().catch(e => console.error('ERR', e.message));
