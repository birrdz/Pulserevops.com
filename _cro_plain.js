// 🔒 4444. _cro_plain.js — PLAIN-JANE CRO finding/hiring questions (owner spec 2026-06-30).
// NO cities, NO pricing, NO industries, NO nuance — just basic questions a real person types into
// Google to FIND or HIRE a fractional CRO. Each = full 12/13–13/13 with a curated TOP IMAGE,
// CRO card (render-time), 6 FAQ, 2 mermaids, 5+ real sources, both "CRO" + "Chief Revenue Officer".
//   node _cro_plain.js [N]   (default 150)   ·   stop: _cro_plain_stop.flag   ·   log: _cro_plain.out.log
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const { dsChat } = require('./_ds_lib');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const { fixEntry } = require('./_v2_components');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const STOP = WD + '/_cro_plain_stop.flag';
const LOG = WD + '/_cro_plain.out.log';
const N = Math.max(1, parseInt(process.argv[2] || '150', 10));
const log = s => { const l = new Date().toISOString() + ' ' + s; try { fs.appendFileSync(LOG, l + '\n'); } catch (e) {} console.log(l); };
const sleep = ms => new Promise(r => setTimeout(r, ms));

// build a big pool of plain finding/hiring questions: STEMS that take "a/an <role>" × ROLES, + extras
const STEMS = [
  'Where do I find {R}?', 'Where can I find {R}?', 'Where do I hire {R}?', 'Where can I hire {R}?',
  'Where do I look for {R}?', 'Where do you find {R}?', 'Where should I find {R}?', 'Where do I get {R}?',
  'How do I find {R}?', 'How do I hire {R}?', 'How do you find {R}?', 'How can I find {R}?',
  'How do you hire {R}?', 'Who can help me find {R}?', 'Who do I call to hire {R}?',
  'Can I hire {R}?', 'Is there a way to find {R}?', 'What is the best way to find {R}?',
  'Where is the best place to find {R}?', 'How do I find a good {R2}?', 'How do I find a vetted {R2}?',
  'How do I find the right {R2}?', 'Where do I find {R} online?', 'How do I find {R} I can trust?',
];
const ROLES = [
  ['a fractional CRO', 'fractional CRO'],
  ['a fractional Chief Revenue Officer', 'fractional Chief Revenue Officer'],
  ['a part-time CRO', 'part-time CRO'],
  ['a part-time Chief Revenue Officer', 'part-time Chief Revenue Officer'],
  ['an interim CRO', 'interim CRO'],
  ['an outsourced CRO', 'outsourced CRO'],
  ['a fractional revenue leader', 'fractional revenue leader'],
  ['a remote fractional CRO', 'remote fractional CRO'],
];
const EXTRA = [
  'What companies provide fractional CROs?', 'What companies can I call to find a fractional CRO?',
  'What firms offer fractional CRO services?', 'Who provides fractional Chief Revenue Officers?',
  'Who has fractional CROs for hire?', 'What company should I call to hire a fractional CRO?',
  'Who do I contact to find a fractional Chief Revenue Officer?', 'Is there a directory of fractional CROs?',
  'Can I find a fractional CRO on LinkedIn?', 'What service finds fractional CROs for you?',
  'Who places fractional Chief Revenue Officers?', 'Where do startups find a fractional CRO?',
  'How do I find a fractional CRO for my company?', 'How do I find a fractional CRO near me?',
  'What should I Google to find a fractional CRO?', 'How do I start looking for a fractional CRO?',
  'Who hires out fractional Chief Revenue Officers?', 'What is a fractional CRO and where do I find one?',
];
const ALL = [];
for (const [r, r2] of ROLES) for (const s of STEMS) ALL.push(s.replace('{R}', r).replace('{R2}', r2));
ALL.push(...EXTRA);
const POOL = [...new Set(ALL)];

const GEN_SYS = `You write a COMPLETE, honest, operator-grade Q&A answer for PULSE RevOps (author: Kory White, fractional CRO; CRO Syndicate). Output ONE Markdown document, in order:
"## Direct Answer" (2-4 sentences answering the title up front), then 6+ "## H2" sections of genuinely useful guidance, with TWO \`\`\`mermaid flowchart TD\`\`\` diagrams (plain labels, no ()[]{} in labels), a "## FAQ" with exactly 6 "**Question?**" + answer pairs, a "## Sources" bullet list of 5+ REAL well-known references (real org/site names or real URLs — never invented report titles/stats), and a "## Related on PULSE" placeholder line. Use plenty of **bold** key terms. Name 3+ real, well-known companies/tools where relevant.
KEYWORDS: use BOTH "CRO" AND "Chief Revenue Officer" naturally throughout (people search both).
CRITICAL — ZERO fabrication: never invent a number, %, price, stat, date, study, or named-report figure, and NEVER put a year like 2027 in the answer. Qualitative only. ~2000 words. Output ONLY the Markdown.`;

async function genBody(title) {
  const { content } = await dsChat([{ role: 'system', content: GEN_SYS }, { role: 'user', content: `Title: "${title}"\n\nWrite the full answer now (~2000 words, all sections, 2 mermaids, 6 FAQ, 5+ real sources, both "CRO" and "Chief Revenue Officer", NO year, no fabrication).` }], { max_tokens: 6000 });
  return String(content || '').replace(/^```[a-z]*\s*|\s*```$/g, '').replace(/\bin\s+20\d\d\b/gi, '').trim();
}

(async () => {
  log(`[croplain] pool has ${POOL.length} unique plain questions; target ${N}`);
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  let nextId = Math.max(...(idx.entries || []).filter(e => e && /^tl\d+$/.test(e.id)).map(e => +e.id.slice(2))) + 1;
  const have = new Set((idx.entries || []).map(e => e && e.question));
  const valid = new Set((idx.entries || []).map(e => e.id));
  const todo = POOL.filter(t => !have.has(t)).slice(0, N);
  log(`[croplain] ${todo.length} unique to write`);
  let made = 0;
  for (const title of todo) {
    if (fs.existsSync(STOP)) { log('[croplain] stop flag'); break; }
    const id = 'tl' + (nextId++);
    try {
      let body = await genBody(title);
      const cover = '/assets/cro-cover-' + ((+id.slice(2) % 5) + 1) + '.jpg';
      const alt = title.replace(/[\[\]"]/g, '').slice(0, 80);
      if (!/^﻿?\s*!\[/.test(body)) body = '![' + alt + '](' + cover + ')\n\n' + body;
      const now = Date.now();
      await store.setJSON('answers/' + id + '.json', { id, question: title, answer: body, tags: ['fractional-cro', 'chief-revenue-officer', 'revops', 'tools', 'cro-syndicate'], quality_score: 5, format_v: '2026-06', pending: false, ts: now, model: 'deepseek', source: 'cro_plain' });
      valid.add(id);
      await fixEntry(id, title, [], valid, dsChat).catch(() => {});
      const cur = await store.get('answers/' + id + '.json', { type: 'json' });
      const g = gradeEntry(id, cur.answer, { imagesDeferred: true });
      const fresh = await store.get('_index.json', { type: 'json', consistency: 'strong' });
      if (!fresh.entries.some(e => e && e.id === id)) { fresh.entries.unshift({ id, question: title, tags: ['fractional-cro', 'chief-revenue-officer', 'revops'], quality_score: g.score, format_v: '2026-06', pending: false, ts: now, was_indexed_at: null }); await store.setJSON('_index.json', fresh); }
      made++;
      log(`[croplain] ${made}/${todo.length} ✓ ${id} (${g.score}/13) — ${title}`);
    } catch (e) { log(`[croplain] ✗ ${id} — ${e.message}`); }
    await sleep(700);
  }
  log(`[croplain] DONE — wrote ${made} plain CRO questions.`);
})().catch(e => { log('[croplain] FATAL ' + (e && e.message)); process.exit(1); });
