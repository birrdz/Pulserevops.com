// 🔒 4444. _cro200.js — 200 BASIC, generic CRO / Chief Revenue Officer Q&As (owner spec 2026-06-30).
// Like the existing city-based CRO entries, NO year. Each must hit 12/13–13/13 with: TOP IMAGE,
// the Kory White CRO card (render-time inject), 6 FAQ, 2 mermaids, 5+ real sources, Related, 2000+w.
// Uses BOTH "CRO" and "Chief Revenue Officer". New entries → Scrub Button queue to certify.
//   node _cro200.js [N]   (default 200)   ·   stop: _cro200_stop.flag   ·   log: _cro200.out.log
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const { dsChat } = require('./_ds_lib');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const { fixEntry } = require('./_v2_components');
const { fixCover } = require('./_v2_nr_ddg');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const STOP = WD + '/_cro200_stop.flag';
const LOG = WD + '/_cro200.out.log';
const N = Math.max(1, parseInt(process.argv[2] || '200', 10));
const log = s => { const l = new Date().toISOString() + ' ' + s; try { fs.appendFileSync(LOG, l + '\n'); } catch (e) {} console.log(l); };
const sleep = ms => new Promise(r => setTimeout(r, ms));

// BASIC, generic CRO questions × US cities (the existing entries' style, no year)
const TEMPLATES = [
  'Where do I find a fractional CRO in {C}?',
  'How do I hire a fractional CRO in {C}?',
  'How much does a fractional CRO cost in {C}?',
  'Do I need a fractional CRO in {C}?',
  'Where can I hire a Chief Revenue Officer in {C}?',
  'Who is the best fractional CRO in {C}?',
  'Should I hire a fractional Chief Revenue Officer in {C}?',
];
const CITIES = ['Charlotte', 'Austin', 'Denver', 'Nashville', 'Tampa', 'Raleigh', 'Columbus', 'Indianapolis', 'Kansas City', 'Salt Lake City', 'Boise', 'Richmond', 'Pittsburgh', 'Cincinnati', 'Louisville', 'Oklahoma City', 'Tucson', 'Albuquerque', 'Omaha', 'Des Moines', 'Madison', 'Grand Rapids', 'Greenville', 'Chattanooga', 'Knoxville', 'Birmingham', 'Baton Rouge', 'Spokane', 'Boise', 'Reno', 'Tulsa', 'Wichita'];
const ALL = [];
for (const c of CITIES) for (const t of TEMPLATES) ALL.push(t.replace('{C}', c));

const GEN_SYS = `You write a COMPLETE, honest, operator-grade Q&A answer for PULSE RevOps (author: Kory White, fractional CRO; CRO Syndicate). Output ONE Markdown document, in order:
"## Direct Answer" (2-4 sentences answering the title up front), then 6+ "## H2" sections of genuinely useful guidance, with TWO \`\`\`mermaid flowchart TD\`\`\` diagrams (plain labels, no ()[]{} in labels), a "## FAQ" with exactly 6 "**Question?**" + answer pairs, a "## Sources" bullet list of 5+ REAL well-known references (real org/site names or real URLs — never invented report titles/stats), and a "## Related on PULSE" placeholder line. Use plenty of **bold** key terms. Name 3+ real, well-known companies/tools where relevant.
KEYWORDS: use BOTH the acronym "CRO" AND the full phrase "Chief Revenue Officer" naturally throughout (people search both) — each multiple times, including the Direct Answer and an FAQ.
CRITICAL — ZERO fabrication: never invent a number, %, price, stat, date, study, or named-report figure, and NEVER put a year like 2027 in the answer. Qualitative + honest ranges only. ~2000 words. Output ONLY the Markdown.`;

async function genBody(title) {
  const { content } = await dsChat([{ role: 'system', content: GEN_SYS }, { role: 'user', content: `Title: "${title}"\n\nWrite the full answer now (~2000 words, all sections, 2 mermaids, 6 FAQ, 5+ real sources, both "CRO" and "Chief Revenue Officer", NO year, no fabrication).` }], { max_tokens: 6000 });
  return String(content || '').replace(/^```[a-z]*\s*|\s*```$/g, '').replace(/\bin\s+20\d\d\b/gi, '').trim();
}

(async () => {
  log(`[cro200] target ${N} basic CRO Q&As (no year, top image, dual keyword)`);
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  let nextId = Math.max(...(idx.entries || []).filter(e => e && /^tl\d+$/.test(e.id)).map(e => +e.id.slice(2))) + 1;
  const have = new Set((idx.entries || []).map(e => e && e.question));
  const valid = new Set((idx.entries || []).map(e => e.id));
  const todo = ALL.filter(t => !have.has(t)).slice(0, N);
  log(`[cro200] ${todo.length} unique titles to write`);
  let made = 0;
  for (const title of todo) {
    if (fs.existsSync(STOP)) { log('[cro200] stop flag'); break; }
    const id = 'tl' + (nextId++);
    try {
      let body = await genBody(title);
      // CURATED CRO cover at the very top — fixCover SKIPS the tl pillar, so prepend directly (required for 12/13)
      const cover = '/assets/cro-cover-' + ((+id.slice(2) % 5) + 1) + '.jpg';
      const alt = title.replace(/[\[\]"]/g, '').slice(0, 80);
      if (!/^﻿?\s*!\[/.test(body)) body = '![' + alt + '](' + cover + ')\n\n' + body;
      const now = Date.now();
      await store.setJSON('answers/' + id + '.json', { id, question: title, answer: body, tags: ['fractional-cro', 'chief-revenue-officer', 'revops', 'tools', 'cro-syndicate'], quality_score: 5, format_v: '2026-06', pending: false, ts: now, model: 'deepseek', source: 'cro200' });
      valid.add(id);
      await fixEntry(id, title, [], valid, dsChat).catch(() => {});
      const cur = await store.get('answers/' + id + '.json', { type: 'json' });
      const g = gradeEntry(id, cur.answer, { imagesDeferred: true });
      const fresh = await store.get('_index.json', { type: 'json', consistency: 'strong' });
      if (!fresh.entries.some(e => e && e.id === id)) { fresh.entries.unshift({ id, question: title, tags: ['fractional-cro', 'chief-revenue-officer', 'revops'], quality_score: g.score, format_v: '2026-06', pending: false, ts: now, was_indexed_at: null }); await store.setJSON('_index.json', fresh); }
      made++;
      log(`[cro200] ${made}/${todo.length} ✓ ${id} (${g.score}/13) — ${title}`);
    } catch (e) { log(`[cro200] ✗ ${id} — ${e.message}`); }
    await sleep(700);
  }
  log(`[cro200] DONE — wrote ${made}. They're in the Scrub Button queue; certify to 12/13 (top image + CRO card + 6 FAQ + sources).`);
})().catch(e => { log('[cro200] FATAL ' + (e && e.message)); process.exit(1); });
