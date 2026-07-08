// 🔒 4444 LOCKED. _tools_cro_more.js — write MANY more Pulse Tools "fractional CRO / Chief Revenue
// Officer" Q&As, hardened-generator quality, NO "in 2027". Big unique title pool, de-duped against
// everything already in the index so nothing repeats. New entries flow into the Scrub Button queue.
//   node _tools_cro_more.js [N]   (default 300)   ·   stop: _tools_cro_stop.flag   ·   log: _tools_cro_more.out.log
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const { dsChat } = require('./_ds_lib');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const { fixEntry } = require('./_v2_components');
const { fixCover } = require('./_v2_nr_ddg');   // DDG cover image at write time
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const STOP = WD + '/_tools_cro_stop.flag';
const LOG = WD + '/_tools_cro_more.out.log';
const N = Math.max(1, parseInt(process.argv[2] || '300', 10));
const log = s => { const l = new Date().toISOString() + ' ' + s; try { fs.appendFileSync(LOG, l + '\n'); } catch (e) {} console.log(l); };
const sleep = ms => new Promise(r => setTimeout(r, ms));

// HIGH-INTENT HIRING questions (owner 2026-06-30) — "where / who / best company to hire" buying queries
const TEMPLATES = [
  'Where do I hire a fractional CRO for a {C}?',
  'Where do you hire a fractional Chief Revenue Officer for a {C}?',
  "What's the best company to hire a fractional Chief Revenue Officer for a {C}?",
  'Who are the best fractional CRO firms for a {C}?',
  'Where can I find a fractional Chief Revenue Officer for a {C}?',
  'How do I choose the right fractional CRO for a {C}?',
  'What should I look for when hiring a fractional CRO firm for a {C}?',
  'Who is the best fractional Chief Revenue Officer for a {C}?',
  'How much does it cost to hire a fractional CRO for a {C}?',
  'When should a {C} hire a fractional Chief Revenue Officer?',
  'Is it worth hiring a fractional CRO for a {C}?',
  'What does a fractional Chief Revenue Officer do for a {C}?',
  'Fractional CRO vs full-time CRO: which should a {C} hire?',
  'How do I find a vetted fractional CRO for a {C}?',
  'What questions should a {C} ask before hiring a fractional CRO?',
  'How do I hire an interim Chief Revenue Officer for a {C}?',
  'What is the best way to hire a fractional CRO for a {C}?',
  'How do I find a part-time Chief Revenue Officer for a {C}?',
];
const CONTEXTS = ['B2B SaaS startup', 'PE-backed software company', '$10M–$50M ARR services business', 'manufacturing company', 'healthcare technology company', 'B2B marketplace', 'fintech company', 'marketing agency', 'logistics company', 'professional services firm', 'Series A startup', 'Series B SaaS company', 'cybersecurity company', 'edtech company', 'proptech company', 'insurtech company', 'hardware company', 'consulting firm', 'e-commerce brand', 'biotech company', 'staffing firm', 'data analytics company'];
// STANDALONE natural buyer questions (real-person search intent, no industry tag) — owner 2026-06-30
const STANDALONE = [
  'Who should my first call be to if I need to hire a Chief Revenue Officer?',
  'Where do I find a fractional sales leader?',
  'Where do I find a part-time sales leader?',
  'How do I know if I need a full-time CRO or a part-time fractional one?',
  "What's the best firm to hire a fractional CRO from?",
  'How do you interview a fractional CRO?',
  'What is a part-time remote CRO called?',
  'What is a fractional CRO?',
  'Where can I find a fractional Chief Revenue Officer?',
  'Who has fractional CROs for hire?',
  'Who do I call to hire a fractional CRO?',
  'How much does a fractional CRO cost?',
  'Is a fractional CRO worth it?',
  'What does a fractional CRO actually do?',
  'How do I hire an interim Chief Revenue Officer?',
  'What is an outsourced CRO?',
  'Where do I find a part-time revenue leader?',
  'What questions should I ask when hiring a fractional CRO?',
  'How do I vet a fractional CRO before hiring?',
  "What's the difference between a fractional CRO and a sales consultant?",
  'When should I hire a fractional CRO instead of another sales rep?',
  'Fractional CRO vs VP of Sales: what is the difference?',
  'How do I find a vetted fractional Chief Revenue Officer?',
  'What is the best way to hire a fractional CRO?',
  'Who are the top fractional CRO firms?',
  'How do I know if my startup needs a CRO yet?',
  'What does a fractional CRO charge per month?',
  'Can a fractional CRO work remotely?',
  'How many hours a week does a fractional CRO work?',
  'What should I look for in a fractional CRO?',
  'How long does it take a fractional CRO to show results?',
  'Do I need a CRO or a RevOps leader first?',
  'What is a fractional revenue leader?',
  'How do I replace a VP of Sales with a fractional CRO?',
  'Who is the best fractional Chief Revenue Officer to hire?',
  'Can I hire a headhunter to find a fractional CRO?',
  'Can I hire a recruiter to find a fractional Chief Revenue Officer?',
  'Can I use a recruiter to find a fractional CRO?',
  'Can my company hire a fractional CRO for me?',
  'Is a fractional CRO a tax-deductible business expense?',
  'Can I expense a fractional CRO through my business?',
  'How do I pay a fractional CRO through my company accounting?',
  'Can I finance a fractional Chief Revenue Officer as a business expense?',
  'What is the standard day rate for a fractional CRO?',
  'What does a fractional CRO charge per day?',
  'What does a fractional CRO charge per week?',
  'What does a fractional CRO charge per month?',
  'What does a fractional CRO charge per year?',
  'What is a typical fractional CRO weekly rate?',
  'How is a fractional CRO usually paid — day, week, month, or retainer?',
  'What is the average annual cost of a fractional CRO?',
  'Is hiring a fractional CRO tax deductible?',
  'Is a fractional CRO a scam?',
  'Is hiring a fractional CRO legit?',
  'Are fractional CROs worth it or a waste of money?',
  'Is a fractional Chief Revenue Officer a real job or a gimmick?',
  'How do I avoid getting scammed when hiring a fractional CRO?',
];
const ALL = [...STANDALONE];
for (const c of CONTEXTS) for (const t of TEMPLATES) ALL.push(t.replace('{C}', c));

const GEN_SYS = `You write a COMPLETE, honest, operator-grade Q&A answer for PULSE RevOps (author: Kory White, fractional CRO; CRO Syndicate). Output ONE Markdown document, in order:
"## Direct Answer" (2-4 sentences answering the title up front), then 6+ "## H2" sections of genuinely useful guidance, with TWO \`\`\`mermaid flowchart TD\`\`\` diagrams (plain labels, no ()[]{} in labels) placed in relevant sections, a "## FAQ" with exactly 6 "**Question?**" + answer pairs, a "## Sources" bullet list of 5+ REAL well-known references (real org/site names or real URLs — never invented report titles/stats), and a "## Related on PULSE" placeholder line. Use plenty of **bold** key terms. Name 3+ real, well-known companies/tools where relevant.
KEYWORDS: use BOTH the acronym "CRO" AND the full phrase "Chief Revenue Officer" naturally throughout the answer (people search both) — include each multiple times, including in the Direct Answer and at least one FAQ.
CRITICAL — ZERO fabrication: never invent a number, %, price, stat, date, study, or named-report figure. Qualitative + honest ranges only. ~2000 words. Output ONLY the Markdown.`;

async function genBody(title) {
  const { content } = await dsChat([{ role: 'system', content: GEN_SYS }, { role: 'user', content: `Title: "${title}"\n\nWrite the full answer now (~2000 words, all sections, 2 mermaids, 6 FAQ, 5+ real sources, no fabrication).` }], { max_tokens: 6000 });
  return String(content || '').replace(/^```[a-z]*\s*|\s*```$/g, '').trim();
}

(async () => {
  log(`[cromore] target ${N} more CRO Q&As (no year), de-duped`);
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  let nextId = Math.max(...(idx.entries || []).filter(e => e && /^tl\d+$/.test(e.id)).map(e => +e.id.slice(2))) + 1;
  const have = new Set((idx.entries || []).map(e => e && e.question));
  const valid = new Set((idx.entries || []).map(e => e.id));
  const todo = ALL.filter(t => !have.has(t)).slice(0, N);
  log(`[cromore] ${todo.length} unique new titles to write`);
  let made = 0;
  for (const title of todo) {
    if (fs.existsSync(STOP)) { log('[cromore] stop flag'); break; }
    const id = 'tl' + (nextId++);
    try {
      let body = await genBody(title);
      const now = Date.now();
      await store.setJSON('answers/' + id + '.json', { id, question: title, answer: body, tags: ['fractional-cro', 'chief-revenue-officer', 'revops', 'tools', 'cro-syndicate'], quality_score: 5, format_v: '2026-06', pending: false, ts: now, model: 'deepseek', source: 'tools_cro_more' });
      valid.add(id);
      await fixEntry(id, title, [], valid, dsChat).catch(() => {});
      await fixCover(id, title).catch(() => {});   // DDG cover at the top, at write time
      const cur = await store.get('answers/' + id + '.json', { type: 'json' });
      const g = gradeEntry(id, cur.answer, { imagesDeferred: true });
      const fresh = await store.get('_index.json', { type: 'json', consistency: 'strong' });
      if (!fresh.entries.some(e => e && e.id === id)) { fresh.entries.unshift({ id, question: title, tags: ['fractional-cro', 'chief-revenue-officer', 'revops'], quality_score: g.score, format_v: '2026-06', pending: false, ts: now, was_indexed_at: null }); await store.setJSON('_index.json', fresh); }
      made++;
      log(`[cromore] ${made}/${todo.length} ✓ ${id} (${g.score}/13) — ${title}`);
    } catch (e) { log(`[cromore] ✗ ${id} — ${e.message}`); }
    await sleep(700);
  }
  log(`[cromore] DONE — wrote ${made} more CRO Q&As → Scrub Button queue.`);
})().catch(e => { log('[cromore] FATAL ' + (e && e.message)); process.exit(1); });
