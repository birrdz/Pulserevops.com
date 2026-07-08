// _cro_weave.js — interlink the tl-pillar fractional-CRO topic cluster (8,810 entries that
// currently have ZERO internal links). For each entry, inject a "## Related on PULSE" block of
// 5-7 sibling CRO guides chosen by: same city (complementary intent) → same vertical → same intent.
// Idempotent via <!--cro-weave--> marker. Modes:
//   node _cro_weave.js --dry --city Charlotte     preview blocks for one city (no writes)
//   node _cro_weave.js --dry --limit 5            preview 5 (no writes)
//   node _cro_weave.js --limit 200                write 200 then stop
//   node _cro_weave.js                            write all (idempotent; skips done)
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const CITY = (args.includes('--city') ? args[args.indexOf('--city') + 1] : null);
const LIMIT = args.includes('--limit') ? parseInt(args[args.indexOf('--limit') + 1], 10) : Infinity;
const MARK = '<!--cro-weave-->';
const reCRO = /\bCRO\b|Chief Revenue Officer/i;

function parse(q) {
  q = q || '';
  let intent = 'other';
  if (/how much|cost|price|pay|salary|rate|\$/i.test(q)) intent = 'cost';
  else if (/what should i look for|what to look for|how to (choose|evaluate|vet)|how do i evaluate/i.test(q)) intent = 'evaluate';
  else if (/how do i (hire|find|get)|where (do|can) i (find|hire|get)/i.test(q)) intent = 'hire';
  else if (/need|should i hire|worth it/i.test(q)) intent = 'need';
  else if (/interim|part.?time|outsourced|fractional/i.test(q)) intent = 'type';
  const city = (q.match(/ in ([A-Z][A-Za-z.'-]+(?: [A-Z][A-Za-z.'-]+){0,2}) in 20/) || [])[1] || null;
  const vert = (q.match(/(?:a|an) ([a-z][\w\s$.-]*?) (?:company|business|startup|firm)/i) || [])[1] || null;
  return { intent, city, vert };
}

function pickSiblings(p, all, byCity, byVert) {
  const out = [], seen = new Set([p.id]);
  const add = (e) => { if (e && !seen.has(e.id)) { seen.add(e.id); out.push(e); } };
  // 1) same city, prefer a different intent (complementary buyer-journey links)
  if (p.city && byCity[p.city]) {
    const pool = byCity[p.city].filter(e => e.id !== p.id);
    const diff = pool.filter(e => e.intent !== p.intent);
    const same = pool.filter(e => e.intent === p.intent);
    [...diff, ...same].slice(0, 4).forEach(add);
  }
  // 2) same vertical
  if (p.vert && byVert[p.vert]) byVert[p.vert].filter(e => e.id !== p.id).slice(0, 2).forEach(add);
  // 3) same intent, any place (fill to 6)
  if (out.length < 6) all.filter(e => e.intent === p.intent && e.id !== p.id).slice(0, 6 - out.length).forEach(add);
  return out.slice(0, 6);
}

function buildBlock(sibs) {
  const lines = sibs.map(s => `- [${s.q.replace(/\s+$/,'')}](/knowledge/${s.id})`);
  // hub link up to the fractional-CRO authority
  lines.push('- [Hire a Fractional CRO — CRO Syndicate](https://crosyndicate.com/)');
  return `${MARK}\n## Related on PULSE\n\n${lines.join('\n')}\n`;
}

function inject(body, block) {
  if (body.includes(MARK)) return null; // already woven (idempotent)
  // if a generic Related block already exists, REPLACE it (upgrade to CRO-specific) — avoids doubles
  const reRel = /\n#{2,3}\s*Related on PULSE[\s\S]*?(?=\n#{1,2}\s|\s*$)/i;
  if (reRel.test(body)) return body.replace(reRel, '\n' + block.replace(/\n+$/, '') + '\n');
  // else place before ## Sources, else before ## FAQ, else append
  const reSrc = /\n## Sources\b/i, reFaq = /\n## (FAQ|Frequently)\b/i;
  if (reSrc.test(body)) return body.replace(reSrc, '\n' + block + '\n## Sources');
  if (reFaq.test(body)) return body.replace(reFaq, '\n' + block + '\n## FAQ');
  return body.replace(/\s*$/, '') + '\n\n' + block;
}

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  let tlCRO = idx.entries.filter(e => e && /^tl/.test(e.id) && reCRO.test(e.question || ''))
    .map(e => ({ id: e.id, q: e.question, ...parse(e.question) }));
  const byCity = {}, byVert = {};
  for (const p of tlCRO) { if (p.city) (byCity[p.city] = byCity[p.city] || []).push(p); if (p.vert) (byVert[p.vert] = byVert[p.vert] || []).push(p); }

  let work = tlCRO;
  if (CITY) work = tlCRO.filter(p => p.city === CITY);

  let done = 0, skipped = 0, wrote = 0, noSib = 0;
  for (const p of work) {
    if (wrote >= LIMIT) break;
    const sibs = pickSiblings(p, tlCRO, byCity, byVert);
    if (!sibs.length) { noSib++; continue; }
    const block = buildBlock(sibs);
    if (DRY) {
      if (done < (CITY ? 99 : 4)) { console.log(`\n=== ${p.id} [${p.intent}] ${p.q}`); console.log(block); }
      done++; continue;
    }
    const e = await store.get('answers/' + p.id + '.json', { type: 'json' }).catch(() => null);
    if (!e || !e.answer) { skipped++; continue; }
    const nb = inject(e.answer, block);
    if (!nb) { skipped++; continue; }
    await store.setJSON('answers/' + p.id + '.json', Object.assign({}, e, { answer: nb, cro_woven_at: new Date().toISOString(), updated_at: new Date().toISOString() }));
    wrote++;
    if (wrote % 100 === 0) console.log(`woven ${wrote}...`);
  }
  console.log(DRY ? `\nDRY: ${done} previewed, ${noSib} had no siblings (of ${work.length})` : `DONE: wrote ${wrote}, skipped ${skipped} (already-woven/no-blob), noSiblings ${noSib}`);
})();
