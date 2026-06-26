// QA sweep over the RevOps-100 line (q10798..q10898 inclusive).
// Pulls each entry from the blob store and validates structure.
// Usage: node _qa_revops100.js
const fs = require('fs');
const { getStore } = require('@netlify/blobs');

try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;

const FROM = 10798;
const TO = 10898;

function countWords(s) {
  // Strip code fences, tables, and markdown noise for prose-word estimate
  const cleaned = String(s || '')
    .replace(/```[\s\S]*?```/g, ' ')         // fenced blocks
    .replace(/^\|.*$/gm, ' ')                // table rows
    .replace(/[#>*`_\[\]\(\)\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned ? cleaned.split(' ').length : 0;
}

function countMermaid(s) {
  const m = String(s || '').match(/```mermaid/g);
  return m ? m.length : 0;
}

function hasFlowchartTD(s) {
  return /flowchart\s+TD/i.test(String(s || ''));
}

function hasDirectAnswer(s) {
  return /^|\n\s*##?\s*Direct Answer/i.test(String(s || '')) || /\bDirect Answer\b/.test(String(s || ''));
}

function hasSources(s) {
  return /\b(Sources?|References?|Citations?)\b/.test(String(s || ''));
}

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });

  const failures = [];
  const warnings = [];
  let okCount = 0;
  let missing = 0;

  for (let n = FROM; n <= TO; n++) {
    const id = `q${n}`;
    let e;
    try {
      e = await store.get(`answers/${id}.json`, { type: 'json' });
    } catch (err) {
      failures.push({ id, why: 'fetch_error: ' + (err && err.message) });
      continue;
    }
    if (!e) { missing++; failures.push({ id, why: 'MISSING' }); continue; }

    const issues = [];
    if (e.quality_score !== 10) issues.push(`qs=${e.quality_score}`);
    if (!e.gold_format) issues.push('not gold_format');
    if (e.format_v !== '2026-05') issues.push(`format_v=${e.format_v}`);
    const mc = countMermaid(e.answer);
    if (mc !== 2) issues.push(`mermaid=${mc}`);
    if (!hasFlowchartTD(e.answer)) issues.push('no flowchart TD');
    const wc = countWords(e.answer);
    if (wc < 1000) issues.push(`words=${wc} (low)`);
    if (wc > 1500) issues.push(`words=${wc} (high)`);
    if (!hasDirectAnswer(e.answer)) issues.push('no Direct Answer');
    if (!hasSources(e.answer)) issues.push('no Sources');
    const tagsOk = Array.isArray(e.tags) && e.tags.includes('revops-100');
    if (!tagsOk) issues.push('missing revops-100 tag');

    if (issues.length === 0) okCount++;
    else if (issues.every(i => i.startsWith('words=') && (i.includes('low') === false || wc >= 950))) {
      warnings.push({ id, q: e.question, wc, mc, issues });
      okCount++;
    } else {
      failures.push({ id, q: e.question, wc, mc, issues });
    }
  }

  console.log('===== RevOps-100 QA REPORT =====');
  console.log(`Range: q${FROM}..q${TO} (${TO - FROM + 1} entries)`);
  console.log(`OK:       ${okCount}`);
  console.log(`Warnings: ${warnings.length}`);
  console.log(`Failures: ${failures.length}`);
  console.log(`Missing:  ${missing}`);
  console.log('');
  if (warnings.length) {
    console.log('--- WARNINGS (acceptable but flagged) ---');
    for (const w of warnings) console.log(`${w.id} | wc=${w.wc} mc=${w.mc} | ${w.issues.join('; ')} | ${String(w.q).slice(0, 80)}`);
    console.log('');
  }
  if (failures.length) {
    console.log('--- FAILURES (need fix) ---');
    for (const f of failures) console.log(`${f.id} | wc=${f.wc} mc=${f.mc} | ${(f.issues || [f.why]).join('; ')} | ${String(f.q || '').slice(0, 80)}`);
  } else {
    console.log('No failures.');
  }
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
