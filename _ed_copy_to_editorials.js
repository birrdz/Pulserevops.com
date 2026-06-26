// Mint a literal ed#### COPY into the Editorials section for every in-place editorial
// (owner 2026-06-24). The original stays put in its home pillar (the in-place rewrite
// on q####/aq####/etc.); this creates a parallel ed#### entry with the SAME body that
// lives in the Editorials section. The copy carries editorial_copy:true + editorial_of,
// and the renderer emits a <link rel=canonical> back to the original so Google
// consolidates to one page (no duplicate-content penalty).
//
// Idempotent: skips any source that already has a copy (tracked by ed.editorial_of).
// Re-run after each new editorial batch to mint the missing copies.
//   node _ed_copy_to_editorials.js [--limit N]
const fs = require('fs');
const path = require('path');
try { const e = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8'); for (const l of e.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
const { getStore } = require('@netlify/blobs');
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i >= 0 ? process.argv[i + 1] : d; };
const LIMIT = parseInt(arg('limit', '0'), 10) || Infinity;
const CONC = 16;
(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const idx = await store.get('_index.json', { type: 'json' });
  const es = idx.entries || [];
  // sources already copied → skip (idempotent)
  const copied = new Set(es.filter(e => e && /^ed\d+$/.test(e.id) && e.editorial_of).map(e => e.editorial_of));
  // candidates: in-place editorials (flag in index) that don't yet have a copy
  let cands = es.filter(e => e && e.id && e.editorial_style && !/^ed\d+$/.test(e.id) && e.source !== 'editorial' && !copied.has(e.id));
  cands = cands.slice(0, LIMIT);
  let maxEd = Math.max(0, ...es.filter(e => /^ed\d+$/.test(e.id)).map(e => parseInt(e.id.slice(2), 10)));
  console.log('minting ' + cands.length + ' editorial copies (starting after ed' + String(maxEd).padStart(4, '0') + ')');
  // pre-assign ids so the index push order is deterministic
  const jobs = cands.map((src, n) => ({ src, edId: 'ed' + String(maxEd + 1 + n).padStart(4, '0') }));
  let i = 0, made = 0, fail = 0;
  const newIndexRows = [];
  async function worker() {
    while (i < jobs.length) {
      const k = i++; const { src, edId } = jobs[k];
      try {
        const sb = await store.get('answers/' + src.id + '.json', { type: 'json' });
        if (!sb || !sb.answer) { fail++; continue; }
        const ts = src.ts || sb.ts || src.polished_at || 0;
        const tags = Array.from(new Set([...(Array.isArray(src.tags) ? src.tags : []), 'editorial', 'pulse-editorial', 'operators-take']));
        const ed = {
          id: edId, question: src.question || sb.question, answer: sb.answer, tags,
          quality_score: src.quality_score || 10, format_v: src.format_v || '2026-05',
          pending: false, ts, polished_at: src.polished_at || ts, has_answer: true,
          model: sb.model || 'deepseek', source: 'editorial', editorial_of: src.id, editorial_copy: true,
        };
        await store.setJSON('answers/' + edId + '.json', ed);
        newIndexRows.push({ id: edId, question: ed.question, tags, quality_score: ed.quality_score, format_v: ed.format_v, pending: false, ts, polished_at: ed.polished_at, has_answer: true, model: ed.model, source: 'editorial', editorial_of: src.id, editorial_copy: true, was_indexed_at: null });
        made++;
        if (made % 100 === 0) console.log('  ' + made + '/' + jobs.length + ' copies minted');
      } catch (err) { fail++; console.log('  ERR ' + src.id + ' ' + (err.message || err)); }
    }
  }
  await Promise.all(Array.from({ length: CONC }, () => worker()));
  // append all new rows to the index once
  idx.entries = newIndexRows.concat(es);
  await store.setJSON('_index.json', idx);
  const totalEd = (idx.entries || []).filter(e => /^ed\d+$/.test(e.id)).length;
  console.log('DONE made=' + made + ' fail=' + fail + ' | total ed#### in index=' + totalEd);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
