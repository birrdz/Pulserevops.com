// _cro_fab_scan.js — SUPERVISOR (detector). Scans published CRO entries (tl, recent
// sprint band tl10009+) and flags any that (a) lack the v2 ```answer card or (b) carry
// fabrication markers (analyst-stat citations or a $-figure case study). Writes the
// flagged set to _cro_reground_queue.json for a forced re-ground:
//   CRO_QUEUE=_cro_reground_queue.json CRO_FORCE=1 node _cro_ds_run.js
// Re-run after each reground pass; it converges (fixed entries stop being flagged).
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const FROM = parseInt(process.env.CRO_SCAN_FROM || '10009', 10);
const isCro = q => /(\bCRO\b|chief revenue officer|fractional revenue|VP of Sales)/i.test(q || '');
// A fabricated STAT = analyst name + a report-verb + a NUMBER/percent. (The old version
// flagged tool mentions ("Clari … data"), "report progress to the board", and ALLOWED
// source links like "[SaaStr – community…]" — all false positives that never converged.
// Require a figure so only invented statistics trip it.)
const ANALYST = /(Gartner|Forrester|McKinsey|Gong Labs|Clari|SaaStr|IDC|Bain|Harvard Business Review|HBR)\b[^.\n]{0,40}\b(report|reports|shows|showed|found|finds|survey|study|studies|estimate)\b[^.\n]{0,40}(\d|\bpercent\b|%)/i;
// A fabricated mini case-study = a company descriptor + a $ figure + an OUTCOME claim.
// (The earlier version flagged any "company … $number", which false-positived on honest
//  cost RANGES and on mermaid ARR nodes — and never converged. Require an outcome verb.)
const CASESTUDY = /\b(a|an|one)\b[^.\n]{0,50}\b(firm|company|startup|client)\b[^.\n]{0,120}\$\s?\d[^.\n]{0,100}\b(cut|grew|scaled|increased|reduced|boosted|tripled|doubled|saved|generated|drove|improved|closed|added)\b/i;
(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const cro = idx.entries.filter(e => /^tl\d+$/.test(e.id) && +e.id.slice(2) >= FROM && isCro(e.question));
  const flagged = []; let scanned = 0, noV2 = 0, fab = 0;
  for (const e of cro) {
    const b = await store.get('answers/' + e.id + '.json', { type: 'json' }).catch(() => null);
    if (!b || !b.answer) continue; scanned++;
    const body = b.answer;
    const hasV2 = /```answer/.test(body);
    const hasFab = ANALYST.test(body) || CASESTUDY.test(body);
    if (!hasV2 || hasFab) { flagged.push({ id: e.id, title: e.question, kind: 'cro', prefix: 'tl' }); if (!hasV2) noV2++; if (hasFab) fab++; }
  }
  flagged.sort((a, b) => +a.id.slice(2) - +b.id.slice(2));
  fs.writeFileSync('C:/Users/koryj/website/_cro_reground_queue.json', JSON.stringify(flagged, null, 1));
  console.log('scanned:', scanned, '| flagged:', flagged.length, '(missing-v2:' + noV2 + ', fabrication-markers:' + fab + ')');
  if (flagged.length) console.log('reground band:', flagged[0].id, '..', flagged[flagged.length - 1].id);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
