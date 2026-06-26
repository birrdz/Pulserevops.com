// Export entries that are MISSING a FAQ (live blob scan) to a JSON batch file
// so Claude can author FAQs for them. Broad-first (index order).
// Usage: node _faq_export_batch.js <prefixCSV> <limit> <outfile>
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try { const e = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8'); for (const l of e.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const PRE = (process.argv[2] || 'q').split(',').map(x => x.trim().toLowerCase());
const LIMIT = parseInt(process.argv[3] || '40', 10);
const OUT = process.argv[4] || 'C:/Users/koryj/website/faq_batch.json';
const prefixOf = id => { const m = String(id).match(/^([a-z]+)/i); return m ? m[1].toLowerCase() : '?'; };
const hasFAQ = a => /^#{2,4}\s*(\d+[.)]\s*)?(FAQ|Frequently Asked)/im.test(a);
(async () => {
  const idx = (await s.get('_index.json', { type: 'json' })) || { entries: [] };
  const ids = (idx.entries || []).map(e => e.id).filter(id => PRE.includes(prefixOf(id)));
  const out = []; let i = 0;
  async function scan() {
    while (i < ids.length && out.length < LIMIT) {
      const id = ids[i++];
      try { const e = await s.get('answers/' + id + '.json', { type: 'json' });
        if (e && e.answer && !hasFAQ(e.answer)) out.push({ id, question: e.question || id, body: String(e.answer).slice(0, 6000) });
      } catch (e) {}
    }
  }
  await Promise.all(Array.from({ length: 16 }, scan));
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
  console.log('exported ' + out.length + ' entries -> ' + OUT);
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
