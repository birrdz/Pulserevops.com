// Site-wide answer DEFECT SCANNER — reads EVERY answer blob, flags mechanical
// problems, writes a prioritized fix-queue (_audit_fix_queue.json) for the
// Claude auditor agents. Read-only. CLI: node -r ./_loadenv.js _audit_scan.js
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

const BANNED = /\b(delve|tapestry|holistic|ever-?evolving|synerg(y|ies|istic)|paradigm shift|game-?changer|cutting-?edge|state-?of-?the-?art|seamless integration|needless to say|in today's)\b/i;
const MOJIBAKE = /Ã[\x80-\xBF]|â€|â€™|â€œ|â€\x9d|Â[ \xA0]|ï¿½|�|Ã©|Ã¨|Ã¼|Ã±|â„¢|â€“|â€”/;
const STALE_YEAR = /\bin (20(1\d|2[0-5]))\b/i; // "in 2010".."in 2025" — likely stale vs 2027 framing

function defects(a) {
  const body = String(a || '');
  const issues = [];
  if (!body.trim()) { issues.push('EMPTY'); return issues; }
  if (body.length < 600) issues.push('TOO_SHORT(' + body.length + ')');
  if (/^﻿/.test(body) || body.indexOf('﻿') >= 0) issues.push('BOM');
  if (MOJIBAKE.test(body)) issues.push('MOJIBAKE');
  if (/```(?:markdown|md)\b/i.test(body)) issues.push('CODEFENCE_WRAP');
  if (/@@PRODUCT|@@IMAGE|\$\{[^}]*\}|\{\{[^}]*\}\}/.test(body)) issues.push('UNRENDERED_TOKEN');
  if (/\b(undefined|null|\[object Object\]|NaN)\b/.test(body)) issues.push('JS_LEAK');
  if (/&amp;(amp|lt|gt|quot|#\d);|&lt;|&gt;/.test(body)) issues.push('HTML_ENTITY');
  if (/#{1,6}[^#\s]/.test(body)) issues.push('HEADER_NOSPACE');     // ##Heading
  if (/[ \t]{2,}\S/.test(body.replace(/\n/g, ''))) issues.push('DOUBLE_SPACE');
  if (/\s[,.;:!?]/.test(body)) issues.push('SPACE_BEFORE_PUNCT');
  if (/```mermaid/i.test(body)) { const o = (body.match(/```mermaid/gi) || []).length, c = (body.match(/```/g) || []).length; if (c < o * 2) issues.push('MERMAID_UNCLOSED'); }
  if (/!\[[^\]]*\]\(\s*\)/.test(body) || /!\[[^\]]*\]\((?!https?:)/.test(body)) issues.push('BROKEN_IMG');
  if (BANNED.test(body)) issues.push('BANNED_PHRASE');
  if (STALE_YEAR.test(body)) issues.push('STALE_YEAR');
  if (/(.)\1{6,}/.test(body.replace(/[-=_*#.\s]/g, ''))) issues.push('CHAR_REPEAT');
  if (/^(.{20,})\n\1$/m.test(body)) issues.push('DUP_LINE');
  return issues;
}

(async () => {
  // gather all answer ids
  const ids = [];
  let cursor;
  do {
    const res = await store.list({ prefix: 'answers/', cursor });
    for (const b of res.blobs) { const m = b.key.match(/^answers\/([a-z]+\d+|vq_[a-z0-9]+)\.json$/i); if (m) ids.push(m[1]); }
    cursor = res.cursor;
  } while (cursor);
  console.log('answer blobs:', ids.length);

  const flagged = [];
  const counts = {};
  let i = 0, scanned = 0;
  const CONC = 16;
  async function worker() {
    while (i < ids.length) {
      const id = ids[i++];
      try {
        const a = await store.get('answers/' + id + '.json', { type: 'json' });
        scanned++;
        const iss = defects(a && a.answer);
        if (iss.length) { flagged.push({ id, prefix: (id.match(/^[a-z]+/) || [''])[0], issues: iss }); for (const x of iss) counts[x.replace(/\(.*/, '')] = (counts[x.replace(/\(.*/, '')] || 0) + 1; }
      } catch (e) { /* skip */ }
      if (scanned % 1000 === 0) console.log('  scanned', scanned, '/', ids.length, '| flagged', flagged.length);
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));

  // priority: severe defects first
  const SEV = ['EMPTY', 'MOJIBAKE', 'CODEFENCE_WRAP', 'UNRENDERED_TOKEN', 'JS_LEAK', 'MERMAID_UNCLOSED', 'BROKEN_IMG'];
  flagged.sort((a, b) => (b.issues.some(x => SEV.includes(x)) ? 1 : 0) - (a.issues.some(x => SEV.includes(x)) ? 1 : 0));
  fs.writeFileSync('_audit_fix_queue.json', JSON.stringify(flagged, null, 0));
  console.log('\n=== SCAN COMPLETE ===');
  console.log('scanned:', scanned, '| flagged:', flagged.length);
  console.log('issue counts:', JSON.stringify(counts, null, 0));
  console.log('queue written: _audit_fix_queue.json');
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
