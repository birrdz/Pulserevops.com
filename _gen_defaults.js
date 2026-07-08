// _gen_defaults.js — build the homepage "instant-fill" default set = a diverse batch of REAL pollinator
// (cover_src='flux') covers, round-robin by pillar, CRO/tl excluded, aquariums capped. Writes _defaults.json.
// Re-run + `node _inject_defaults.js` before each deploy so the homepage keeps filling with newly-made covers.
const fs = require('fs');
for (const l of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const AQ_CAP = parseInt(process.env.DEF_AQ_CAP || '24', 10), LIMIT = parseInt(process.env.DEF_LIMIT || '120', 10);
(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const es = (idx.entries || []).filter(e => e && e.id && e.question && e.cover_src === 'flux' && e.img && /\/assets\/qa\//.test(e.img));
  const byP = {}; for (const e of es) { const p = (e.id.match(/^[a-z]+/) || [''])[0]; if (p === 'tl') continue; (byP[p] = byP[p] || []).push(e); }
  const pills = Object.keys(byP);
  pills.forEach(p => { byP[p].sort((a, b) => (b.ts || 0) - (a.ts || 0)); if (p === 'aq') byP[p].splice(AQ_CAP); });
  const out = []; for (let lap = 0; lap < 40 && out.length < LIMIT; lap++) { let added = false; for (const p of pills) { if (byP[p][lap]) { out.push(byP[p][lap]); added = true; } } if (!added) break; }
  const arr = out.slice(0, LIMIT).map(e => ({ id: e.id, img: e.img, question: String(e.question).replace(/"/g, '”').slice(0, 110) }));
  fs.writeFileSync('C:/Users/koryj/website/_defaults.json', JSON.stringify(arr));
  console.log('flux covers:', es.length, '| defaults:', arr.length, '| pillars:', pills.length, '| aq:', arr.filter(x => /^aq/.test(x.id)).length);
})().catch(e => { console.log('ERR', e.message); process.exit(1); });
