// Audit EVERY library entry for at least one image. Groups by pillar prefix.
// "Has image" = an @@PRODUCT img= card, a markdown ![](url), or an <img tag.
// Usage: node _img_audit_all.js
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
} catch (e) {}
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const CONC = 16;
const prefixOf = (id) => { const m = String(id).match(/^([a-z]+)/i); return m ? m[1].toLowerCase() : (/^vq_/.test(id) ? 'vq' : '?'); };
const hasImage = (a) => /@@PRODUCT[^\n]*\bimg=/.test(a) || /!\[[^\]]*\]\([^)]+\)/.test(a) || /<img\s/i.test(a) || /<svg/i.test(a);
const hasMermaid = (a) => /```mermaid/.test(a);
(async () => {
  const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOK });
  const idx = await s.get('_index.json', { type: 'json' });
  const ids = (idx.entries || []).map(e => e.id);
  const stat = {}; // prefix -> {total, withImg, noImg:[]}
  let i = 0, done = 0;
  async function worker() {
    while (i < ids.length) {
      const id = ids[i++];
      const p = prefixOf(id);
      stat[p] = stat[p] || { total: 0, withImg: 0, noImgNoMermaid: 0, noImg: [] };
      stat[p].total++;
      try {
        const e = await s.get('answers/' + id + '.json', { type: 'json' });
        const a = (e && e.answer) || '';
        if (hasImage(a)) stat[p].withImg++;
        else { stat[p].noImg.push(id); if (!hasMermaid(a)) stat[p].noImgNoMermaid++; }
      } catch (err) { stat[p].noImg.push(id + '(err)'); stat[p].noImgNoMermaid++; }
      done++;
      if (done % 1000 === 0) console.error('  ...scanned', done, '/', ids.length);
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  const rows = Object.keys(stat).sort();
  let totalNo = 0;
  let totalNoMM = 0;
  console.log('PREFIX  TOTAL  WITH_IMG  NO_IMG  NO_IMG_NO_MERMAID');
  for (const p of rows) { const r = stat[p]; totalNo += r.noImg.length; totalNoMM += r.noImgNoMermaid; console.log(p.padEnd(7), String(r.total).padStart(5), String(r.withImg).padStart(8), String(r.noImg.length).padStart(7), String(r.noImgNoMermaid).padStart(16)); }
  console.log('TOTAL entries:', ids.length, '| no real image:', totalNo, '| no image AND no mermaid:', totalNoMM);
  fs.writeFileSync('C:/Users/koryj/website/_img_audit_all.json', JSON.stringify(stat, null, 1));
  console.log('full detail -> _img_audit_all.json');
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
