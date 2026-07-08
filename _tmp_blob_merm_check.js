'use strict';
require('./_loadenv.js');
const { getStore } = require('@netlify/blobs');

(async () => {
  const id = process.argv[2] || 'aq1160';
  const store = getStore({
    name: 'pulse-machine-library',
    siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
  });
  const raw = await store.get('answers/' + id + '.json', { type: 'text' });
  if (!raw) throw new Error('missing blob answers/' + id + '.json');
  const e = JSON.parse(raw);
  const a = e.answer || '';
  const merm = a.match(/```mermaid[\s\S]*?```/g) || [];
  const bare = a.match(/^flowchart TD[\s\S]*?(?=\n\n|\n##|$)/gm) || [];
  console.log('id:', id, 'answer len:', a.length);
  console.log('mermaid fences:', merm.length);
  console.log('bare flowchart blocks:', bare.length);
  for (let i = 0; i < bare.length; i++) {
    console.log('bare', i, ':', bare[i].slice(0, 120).replace(/\n/g, ' '));
  }
  for (let i = 0; i < merm.length; i++) {
    console.log('fence', i, ':', merm[i].slice(0, 120).replace(/\n/g, ' '));
  }
  const lead = a.match(/^[^\n]*!\[[^\]]*\]\([^)]+\)/m);
  console.log('leading image:', lead ? lead[0].slice(0, 100) : 'none');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
