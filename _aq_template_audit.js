// Verify live aq#### blobs match the locked Aquariums Top-10 template.
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const REQUIRED = [
  { key: 'direct_answer', re: /^#{2,3}\s+Direct Answer/im },
  { key: 'how_we_ranked', re: /^#{2,3}\s+How We Ranked/im },
  { key: 'best_overall', re: /🏆\s*BEST OVERALL/i },
  { key: 'best_value', re: /💎\s*BEST VALUE/i },
  { key: 'how_to_choose', re: /^#{2,3}\s+How to Choose/im },
  { key: 'what_to_look_for', re: /^#{2,3}\s+What to Look For/im },
  { key: 'faq', re: /^#{2,3}\s+FAQ/im },
  { key: 'bottom_line', re: /^#{2,3}\s+Bottom Line/im },
  { key: 'sources', re: /^#{2,3}\s+Sources/im },
  { key: 'mermaid', re: /```mermaid\b/ },
  { key: 'product_lines', re: /@@PRODUCT/g, min: 10 },
  { key: 'numbered_sections', re: /^##\s+\d+\./gm, min: 10 },
  { key: 'price_cost', re: /\*\*Price \/ Cost:\*\*/g, min: 10 },
  { key: 'faq_bold_q', re: /^\*\*[^*]+\?\*\*/gm, min: 4 },
];

function templateCheck(body) {
  const miss = [];
  for (const r of REQUIRED) {
    const hits = (body.match(r.re) || []).length;
    if (r.min ? hits < r.min : !hits) miss.push(r.key + (r.min ? ` (${hits}/${r.min})` : ''));
  }
  return miss;
}

(async () => {
  const start = parseInt(process.argv[2] || '1', 10);
  const end = parseInt(process.argv[3] || '50', 10);
  const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
  const fails = [];
  let pass = 0;
  for (let n = start; n <= end; n++) {
    const id = 'aq' + String(n).padStart(4, '0');
    const e = await s.get('answers/' + id + '.json', { type: 'json' });
    if (!e || !e.answer) { fails.push({ id, err: 'no blob' }); continue; }
    const g = gradeEntry(id, e.answer);
    const tmpl = templateCheck(e.answer);
    const imgs = (e.answer.match(/@@PRODUCT[^\n]* img=/g) || []).length;
    const cover = /^﻿?\s*!\[/.test(e.answer);
    const ok = g.score >= 12 && tmpl.length === 0 && imgs >= 10 && cover;
    if (ok) pass++;
    else fails.push({ id, score: g.score, gradeMissing: g.missing, tmplMissing: tmpl, imgs, cover, words: g.word_count });
  }
  const total = end - start + 1;
  console.log(JSON.stringify({ range: `aq${String(start).padStart(4,'0')}-aq${String(end).padStart(4,'0')}`, total, pass, fail: fails.length, fails: fails.slice(0, 15) }, null, 2));
})();
