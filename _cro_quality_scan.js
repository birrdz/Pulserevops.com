// _cro_quality_scan.js — BROAD CRO quality supervisor (detector). Owner (2026-06-29):
// "supervisor needs to fix quality of ALL these answers + add FAQ + go v2." The old
// _cro_fab_scan only checked v2-card/fabrication from tl10009+. This scans the WHOLE
// CRO (tl) band and flags any entry that is SLOPPY by quality:
//   - thin: prose word count < MINW (default 1200), OR
//   - missing the v2 ```answer card, OR
//   - missing a ## FAQ section.
// Writes the flagged set to _cro_quality_queue.json for a forced v2 reground:
//   CRO_QUEUE=_cro_quality_queue.json CRO_FORCE=1 CRO_CONC=4 node _cro_ds_run.js
// The reground regenerates honest v2 (1300+ words + FAQ + v2 cards + curated cover via
// REQS.cro), which fixes length + FAQ + format + top image in one shot. Re-run to converge.
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const FROM = parseInt(process.env.CRO_SCAN_FROM || '1', 10);
const MINW = parseInt(process.env.CRO_MINW || '1200', 10);
const CAP = parseInt(process.env.CRO_QUALITY_CAP || '100000', 10);
const isCro = q => /(\bCRO\b|chief revenue officer|fractional revenue|VP of Sales)/i.test(q || '');
// prose word count = body minus fenced v2 blocks (grader strips those) minus image lines.
function proseWords(body) {
  const stripped = String(body)
    .replace(/```[\s\S]*?```/g, ' ')          // fenced v2 cards / mermaid
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')      // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');   // link text only
  return (stripped.match(/[A-Za-z0-9][A-Za-z0-9'-]*/g) || []).length;
}
(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const cro = idx.entries.filter(e => /^tl\d+$/.test(e.id) && +e.id.slice(2) >= FROM && isCro(e.question));
  const flagged = []; let scanned = 0, thin = 0, noV2 = 0, noFaq = 0;
  const CONC = 8; let cur = 0;
  async function worker() {
    while (cur < cro.length) {
      const e = cro[cur++];
      const b = await store.get('answers/' + e.id + '.json', { type: 'json' }).catch(() => null);
      if (!b || !b.answer) continue; scanned++;
      const body = b.answer;
      const w = proseWords(body);
      const hasV2 = /```answer/.test(body);
      const hasFaq = /##\s*FAQ\b/i.test(body) || /\bFrequently Asked Questions\b/i.test(body);
      const isThin = w < MINW;
      if (isThin || !hasV2 || !hasFaq) {
        flagged.push({ id: e.id, title: e.question, kind: 'cro', prefix: 'tl', _w: w, _v2: hasV2, _faq: hasFaq });
        if (isThin) thin++; if (!hasV2) noV2++; if (!hasFaq) noFaq++;
      }
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  flagged.sort((a, b) => +a.id.slice(2) - +b.id.slice(2));
  const out = flagged.slice(0, CAP).map(({ _w, _v2, _faq, ...keep }) => keep);
  fs.writeFileSync('C:/Users/koryj/website/_cro_quality_queue.json', JSON.stringify(out, null, 1));
  console.log('CRO scanned:', scanned, '| FLAGGED:', flagged.length, '(thin<' + MINW + ':' + thin + ', missing-v2:' + noV2 + ', missing-FAQ:' + noFaq + ')');
  if (out.length) console.log('queue band:', out[0].id, '..', out[out.length - 1].id, '| written', out.length, 'to _cro_quality_queue.json');
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
