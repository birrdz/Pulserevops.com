// Deep audit for Coaching (cg####) entries. Reads the real answer body from blobs
// (not just structural counts) and checks template conformance + content reality.
// Usage: node _cg_audit.js cg0201 cg0202 ...   (or a range: node _cg_audit.js 201 210)
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const env = fs.readFileSync('.env.local', 'utf8');
for (const l of env.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

const BANNED = ['delve', 'tapestry', 'landscape', 'holistic', "in today's", 'ever-evolving', 'synergy', 'synergistic', 'paradigm shift', 'game-changer', 'cutting-edge', 'state-of-the-art', 'seamless integration', 'drive growth', 'unlock value', 'unlock potential', 'needless to say', "it's worth noting", "it's important to note"];
const ENTITIES = ['GROW', 'MEDDIC', 'MEDDPICC', 'Challenger', 'SPIN', 'Sandler', 'Gong', 'Chorus', 'Salesforce', 'Outreach', 'Clari', 'Salesloft', 'Winning by Design', 'RAIN Group', 'Gainsight', 'Command of the Message', 'GAP Selling', 'BANT'];

let ids = process.argv.slice(2).filter(a => /^cg\d+$/.test(a));
const range = process.argv.slice(2).filter(a => /^\d+$/.test(a)).map(Number);
if (!ids.length && range.length === 2) { ids = []; for (let i = range[0]; i <= range[1]; i++) ids.push('cg' + String(i).padStart(4, '0')); }
if (!ids.length) { console.error('usage: node _cg_audit.js cg0201 ... | node _cg_audit.js 201 210'); process.exit(1); }

function wc(t) { return (t.match(/\b[\w'-]+\b/g) || []).length; }

(async () => {
  const bodies = {};
  let pass = 0, fail = 0;
  const norms = {};
  for (const id of ids) {
    const e = await s.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
    if (!e || !e.answer) { console.log(`\n${id}  ❌ NO BLOB`); fail++; continue; }
    const b = e.answer; bodies[id] = b;
    const grade = gradeEntry(id, b);
    const issues = [];
    // Deep checks beyond the structural grader:
    const words = wc(b);
    if (words < 1400) issues.push(`words ${words} < 1400`);
    if (!/###\s+Direct Answer/i.test(b)) issues.push('no ### Direct Answer');
    if (/\bTL;?DR\b/i.test(b)) issues.push('contains TL;DR (banned for cg)');
    const h2 = (b.match(/^##\s+/gm) || []).length, h3 = (b.match(/^###\s+/gm) || []).length;
    if (h2 + h3 < 6) issues.push(`only ${h2 + h3} H2/H3 sections`);
    const mer = (b.match(/```mermaid/g) || []).length;
    if (mer < 2) issues.push(`only ${mer} mermaid`);
    if (!/```mermaid[\s\S]*?flowchart TD/i.test(b)) issues.push('no flowchart TD (diagnosis)');
    if (!/```mermaid[\s\S]*?flowchart LR/i.test(b)) issues.push('no flowchart LR (cadence)');
    if (!/##\s+FAQ/i.test(b)) issues.push('no ## FAQ');
    const faqQ = (b.match(/^\*\*[^*]+\?\*\*/gm) || []).length;
    if (faqQ < 5) issues.push(`FAQ bold-? pairs = ${faqQ} < 5`);
    if (!/##\s+Sources/i.test(b)) issues.push('no ## Sources');
    const links = (b.match(/\[[^\]]+\]\(https?:\/\/[^)]+\)/g) || []).length;
    if (links < 6) issues.push(`only ${links} source links < 6`);
    const bold = (b.match(/\*\*[^*]+\*\*/g) || []).length;
    if (bold < 10) issues.push(`only ${bold} bold spans < 10`);
    const ents = ENTITIES.filter(x => b.includes(x));
    if (ents.length < 3) issues.push(`named entities ${ents.length} < 3`);
    const hitBanned = BANNED.filter(w => new RegExp('\\b' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(b));
    if (hitBanned.length) issues.push('BANNED: ' + hitBanned.join(','));
    if (!/^\s*\*[^*].*\*\s*$/m.test(b.split('\n').slice(-4).join('\n'))) issues.push('no italic SEO mirror final line');
    // Title/body coherence: key noun from question should appear in body.
    const q = (e.question || '').toLowerCase();
    if (!/coach/i.test(b)) issues.push('body never says "coach"');
    norms[id] = b.toLowerCase().replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').slice(0, 4000);

    const ok = grade.score >= 10 && issues.length === 0;
    if (ok) pass++; else fail++;
    console.log(`\n${id}  grader=${grade.score}/12  words=${words}  H=${h2 + h3}  mer=${mer}  faq=${faqQ}  src=${links}  bold=${bold}  ents=${ents.length}  ${ok ? '✅ PASS' : '❌ ' + issues.join(' | ')}`);
  }
  // Cross-entry near-duplicate detection (Jaccard on word sets).
  const idl = Object.keys(norms);
  let dupWarn = 0;
  for (let i = 0; i < idl.length; i++) for (let j = i + 1; j < idl.length; j++) {
    const A = new Set(norms[idl[i]].split(' ')), B = new Set(norms[idl[j]].split(' '));
    let inter = 0; for (const w of A) if (B.has(w)) inter++;
    const jac = inter / (A.size + B.size - inter);
    if (jac > 0.6) { console.log(`\n⚠ near-duplicate ${idl[i]} ~ ${idl[j]} (jaccard ${jac.toFixed(2)})`); dupWarn++; }
  }
  console.log(`\n=== AUDIT: ${pass} pass / ${fail} fail / ${ids.length} total; dup-warnings=${dupWarn} ===`);
  process.exit(fail ? 2 : 0);
})().catch(e => { console.error('FATAL', e.stack); process.exit(1); });
