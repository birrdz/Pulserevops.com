const fs = require('fs');
const { getStore } = require('@netlify/blobs');

// parse .env.local
const env = fs.readFileSync('.env.local', 'utf8');
const m = {};
env.split(/\r?\n/).forEach(l => { const i = l.indexOf('='); if (i > 0) m[l.slice(0, i).trim()] = l.slice(i + 1).trim(); });
const TOK = m.BLOBS_PAT || m.NETLIFY_AUTH_TOKEN;
const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOK });

const ANS = require('./_tl_sched_ans_476.js');

(async () => {
  const ex = await s.get('answers/tl0001.json', { type: 'json' });
  const out = [];
  for (const { id, question, answer } of ANS) {
    const e = { ...ex, id, question, answer, ts: Date.now(), polished_at: Date.now() };
    e.pending = false;
    delete e.quality_audit;
    await s.setJSON('answers/' + id + '.json', e);
    const words = answer.split(/\s+/).filter(Boolean).length;
    const items = (answer.match(/^## \d+\. /gm) || []).length;
    out.push(`${id}: ${words}w ${items}i`);
  }
  out.forEach(l => console.log(l));
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
