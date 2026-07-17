// new/publish_live.js — CLI wrapper over publish_core.publishLive.
// Usage: node new/publish_live.js <newId> [qid]
'use strict';
const { publishLive } = require('./publish_core');
const newId = process.argv[2];
if (!newId) { console.log('usage: node new/publish_live.js <newId> [qid]'); process.exit(1); }
publishLive({ newId, qid: process.argv[3] })
  .then(r => console.log('\n✅ LIVE (no deploy) → ' + r.url + '  (' + r.words + ' words)'))
  .catch(e => { console.log('ERROR', e.message); process.exit(1); });
