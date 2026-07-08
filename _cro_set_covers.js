// _cro_set_covers.js — standardize the TOP cover image on every CRO (tl) entry to one of
// the 3 curated covers (/assets/cro-cover-1|2|3.jpg), rotating deterministically by title
// (same hash the writer uses). Replaces the random per-page DDG/pollinations covers.
// Deploy-free (answer blobs only). Idempotent. Marks cover_locked so it's clear it's curated.
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const FROM = parseInt(process.env.CRO_SCAN_FROM || '9398', 10);
const isCro = q => /(\bCRO\b|chief revenue officer|fractional revenue|VP of Sales)/i.test(q || '');
const cover = title => '/assets/cro-cover-' + [1, 3, 4, 5, 6][Array.from(String(title)).reduce((a, c) => a + c.charCodeAt(0), 0) % 5] + '.jpg';
(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const cro = idx.entries.filter(e => /^tl\d+$/.test(e.id) && +e.id.slice(2) >= FROM && isCro(e.question));
  let fixed = 0, skip = 0;
  for (const e of cro) {
    const b = await store.get('answers/' + e.id + '.json', { type: 'json' }).catch(() => null);
    if (!b || !b.answer) continue;
    const c = cover(e.question);
    const imgLine = '![' + e.question + '](' + c + ')';
    const lines = b.answer.split('\n');
    const i0 = lines.findIndex(l => l.trim());
    if (i0 >= 0 && /^!\[[^\]]*\]\([^)]*\)\s*$/.test(lines[i0].trim())) {
      if (lines[i0].includes(c)) { skip++; continue; }   // already the right curated cover
      lines[i0] = imgLine;                                // replace existing leading image
    } else {
      lines.unshift(imgLine, '');                         // no leading image → prepend one
    }
    b.answer = lines.join('\n');
    b.cover_locked = true;
    await store.setJSON('answers/' + e.id + '.json', b);
    fixed++;
    if (fixed % 50 === 0) console.log('  …set', fixed);
  }
  console.log('CRO covers standardized:', fixed, '| already-correct:', skip, '| total CRO scanned:', cro.length);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
