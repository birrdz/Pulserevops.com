// Verifies sample published ids: blob exists w/ answer, noindex cleared, in index.
//   node _wave2_verify.js id1 id2 ...
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try { const env = fs.readFileSync('C:/Users/koryj/website/.env.local','utf8'); for (const l of env.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}} catch(e){}
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const ids = process.argv.slice(2);
(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOK });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const inIdx = new Set(idx.entries.filter(e=>e&&e.id).map(e=>e.id));
  for (const id of ids) {
    const rec = await store.get('answers/'+id+'.json', { type: 'json' }).catch(()=>null);
    const has_answer = !!(rec && rec.answer && rec.answer.length > 200);
    const noindex = !!(rec && rec.noindex);
    console.log(JSON.stringify({ id, blob: !!rec, has_answer, noindex_cleared: !noindex, in_index: inIdx.has(id), pending: rec ? rec.pending : null }));
  }
})().catch(e=>{console.error('ERR',e&&e.message);process.exit(1);});
