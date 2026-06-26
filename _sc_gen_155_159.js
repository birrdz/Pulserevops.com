const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const get = k => { const m = env.match(new RegExp('^' + k + '=(.*)$', 'm')); return m ? m[1].trim() : ''; };
const TOK = get('NETLIFY_AUTH_TOKEN') || get('BLOBS_PAT');
const { getStore } = require('@netlify/blobs');
const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOK });

const slugify = q => q.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const ENTRIES = require('./_sc_content_155_159.js');

(async () => {
  const ex = await s.get('answers/sc0001.json', { type: 'json' });
  const out = [];
  for (const { id, question, answer } of ENTRIES) {
    const slug = slugify(question);
    const e = {
      ...ex,
      id,
      question,
      answer,
      tags: ['school', 'top-10', 'best-of-2027', 'schools', slug],
      ts: Date.now(),
      polished_at: Date.now(),
      pending: false
    };
    // keep qs:10 / format_v / model from ex
    delete e.quality_audit;
    delete e.was_indexed_at;
    await s.setJSON('answers/' + id + '.json', e);
    const words = answer.split(/\s+/).filter(Boolean).length;
    const count = (answer.match(/^## \d+\. /gm) || []).length;
    out.push(`${id}: ${words}w ${count} schools`);
  }
  console.log(out.join('\n'));
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
