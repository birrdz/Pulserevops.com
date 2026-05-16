// One-shot: pull queue + index sizes/shape, dump 60 unanswered candidates.
const { getStore } = require('@netlify/blobs');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOKEN = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
if (!TOKEN) { console.error('TOKEN required'); process.exit(1); }

const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: TOKEN });

(async () => {
  const q = await store.get('queue.json', { type: 'json' });
  const idx = await store.get('_index.json', { type: 'json' });
  console.log('queue items total:', (q && q.items || []).length);
  console.log('index entries total:', (idx && idx.entries || []).length);
  const answered = new Set(((idx && idx.entries) || []).map(e => (e.question || '').toLowerCase().trim()));
  const fresh = ((q && q.items) || []).filter(it => it && it.q && !answered.has(it.q.toLowerCase().trim()) && !it.q.includes('�'));
  console.log('fresh unanswered:', fresh.length);
  fresh.sort((a, b) => {
    const pa = a.priority || 0, pb = b.priority || 0;
    if (pb !== pa) return pb - pa;
    return (a.ts || 0) - (b.ts || 0);
  });
  const top = fresh.slice(0, 60);
  console.log('\n=== TOP 60 ===');
  for (let i = 0; i < top.length; i++) {
    const it = top[i];
    console.log(`${i + 1}. [p=${it.priority || 0}] ${it.q}`);
  }
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
