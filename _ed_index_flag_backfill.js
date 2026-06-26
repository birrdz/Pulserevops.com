// Backfill the `editorial_style` flag onto _index.json entries wherever the BLOB
// has it. The in-place editorial engine (_ed_scale_fresh.js) sets editorial_style
// on the answer blob only (to avoid parallel _index.json clobber), so the index
// can't filter for them. This reconcile copies the flag up to the index so the
// Editorials pillar (?cat=editorials) can surface every in-place editorial WITHOUT
// moving/duplicating any page (same id/URL). Idempotent + re-runnable.
//   node _ed_index_flag_backfill.js [--conc 20]
const fs = require('fs');
const path = require('path');
try { const e = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8'); for (const l of e.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
const { getStore } = require('@netlify/blobs');
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i >= 0 ? process.argv[i + 1] : d; };
const CONC = parseInt(arg('conc', '20'), 10);
(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const idx = await store.get('_index.json', { type: 'json' });
  const es = idx.entries || [];
  // Candidates: every non-ed text entry not already flagged in the index.
  const cands = es.filter(e => e && e.id && /^[a-z]+\d+$/.test(e.id) && !/^ed\d+$/.test(e.id) && !e.editorial_style);
  console.log('scanning ' + cands.length + ' index entries for editorial_style on the blob (conc ' + CONC + ')');
  let i = 0, flagged = 0, miss = 0, checked = 0;
  async function worker() {
    while (i < cands.length) {
      const e = cands[i++];
      try {
        const b = await store.get('answers/' + e.id + '.json', { type: 'json' });
        checked++;
        if (b && b.editorial_style) { e.editorial_style = true; flagged++; }
        else miss++;
      } catch (err) { miss++; }
      if (checked % 1000 === 0) console.log('  ' + checked + '/' + cands.length + ' checked, ' + flagged + ' newly flagged');
    }
  }
  await Promise.all(Array.from({ length: CONC }, () => worker()));
  // Total editorials now visible in the index (newly flagged + ed#### standalone + any prior flag)
  const total = es.filter(e => e.editorial_style || /^ed\d+$/.test(e.id) || e.source === 'editorial').length;
  await store.setJSON('_index.json', idx);
  console.log('DONE newly_flagged=' + flagged + ' miss=' + miss + ' | editorials now in index=' + total);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
