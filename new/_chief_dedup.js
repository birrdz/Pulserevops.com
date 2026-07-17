'use strict';
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN });
const EXCL = /Chief Revenue|Chief revenue|\bCRO\b|Chief of Staff|Chief Pilot|Chief Marketing|Chief Financial|Chief Operating|Chief Executive|Chief Technology|Chief Product|Chief People|Chief Data|Chief Information|Chief Sales|Chief Growth|Chief Customer|Chief Human|Chief Compliance|Chief Privacy|Chief Crypto|Chief Joseph|Chief Security|Chief Legal|Chief Medical|Chief Nursing|Chief Diversity|Chief Digital|Chief Strategy|Chief Analytics|Chief Risk|Chief Investment|Chief Accounting|Chief Learning|Chief AI/i;
(async () => {
  const idx = await store.get('_index.json', { type: 'json' });
  const chief = idx.entries.filter(e => /\bChief\b/i.test(e.question || '') && !EXCL.test(e.question || ''));
  console.log('EXISTING Chief women-network entries:', chief.length);
  fs.writeFileSync(WD + '/new/_chief_existing.json', JSON.stringify(chief.map(e => e.question), null, 1));
  chief.forEach(e => console.log('•', (e.question || '').replace(/\s+in 2027.*$/i, '').slice(0, 72)));
})().catch(e => console.log('ERR', e.message));
