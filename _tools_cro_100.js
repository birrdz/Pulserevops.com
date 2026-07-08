// 🔒 4444 LOCKED (owner 2026-06-30). _tools_cro_100.js — write 100 NEW Pulse Tools "Chief Revenue
// Officer / fractional CRO" Q&As, hardened-generator quality, NO "in 2027" in the title. Each entry
// is built honest (no fabricated stats/sources), written to the blob + index as a tl#### entry, and
// (because it's new + under review) flows into the Scrub Button queue for you to certify/QA.
//   node _tools_cro_100.js [N]   (default 100)   ·   stop: _tools_cro_stop.flag   ·   log: _tools_cro.out.log
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const { dsChat } = require('./_ds_lib');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const { fixEntry } = require('./_v2_components');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const STOP = WD + '/_tools_cro_stop.flag';
const LOG = WD + '/_tools_cro.out.log';
const N = Math.max(1, Math.min(100, parseInt(process.argv[2] || '100', 10)));
const log = s => { const l = new Date().toISOString() + ' ' + s; try { fs.appendFileSync(LOG, l + '\n'); } catch (e) {} console.log(l); };
const sleep = ms => new Promise(r => setTimeout(r, ms));

// 100 CRO Q&A titles — NO year. (templates × company contexts, de-duped to 100)
const TEMPLATES = [
  'What does a fractional Chief Revenue Officer actually do for a {C}?',
  'How much does a fractional CRO cost for a {C}?',
  'When should a {C} hire a fractional Chief Revenue Officer?',
  'Fractional CRO vs full-time CRO: which does a {C} need?',
  'How do I find a fractional CRO for my {C}?',
  'What ROI should a {C} expect from a fractional Chief Revenue Officer?',
  'What are the signs a {C} needs a Chief Revenue Officer?',
  'How does a fractional CRO build a revenue engine for a {C}?',
  'What should a {C} look for when hiring a fractional CRO?',
  'How long does a {C} typically work with a fractional Chief Revenue Officer?',
];
const CONTEXTS = ['B2B SaaS startup', 'PE-backed software company', '$10M–$50M ARR services business', 'manufacturing company', 'healthcare technology company', 'B2B marketplace', 'fintech company', 'marketing agency', 'logistics company', 'professional services firm'];
const TITLES = [];
for (const t of TEMPLATES) for (const c of CONTEXTS) { TITLES.push(t.replace('{C}', c)); if (TITLES.length >= 100) break; }

const GEN_SYS = `You write a COMPLETE, honest, operator-grade Q&A answer for PULSE RevOps (author: Kory White, fractional CRO; CRO Syndicate). Output ONE Markdown document with, in order:
"## Direct Answer" (2-4 sentences answering the title up front), then 6+ "## H2" sections of genuinely useful guidance, with TWO \`\`\`mermaid flowchart TD\`\`\` diagrams (plain labels, no ()[]{} in labels) placed in relevant sections, a "## FAQ" with exactly 6 "**Question?**" + answer pairs, a "## Sources" bullet list of 5+ REAL well-known references (real org/site names or real URLs — never invented report titles/stats), and a "## Related on PULSE" placeholder line. Use plenty of **bold** key terms. Name 3+ real, well-known companies/tools where relevant.
CRITICAL — ZERO fabrication: never invent a number, %, price, stat, date, study, or named-report figure (no "Gong Labs/Forrester/Gartner says X%"). Qualitative + honest ranges only. ~2000 words. Output ONLY the Markdown.`;

async function genBody(title) {
  const { content } = await dsChat([{ role: 'system', content: GEN_SYS }, { role: 'user', content: `Title: "${title}"\n\nWrite the full answer now (~2000 words, all sections, 2 mermaids, 6 FAQ, 5+ real sources, no fabrication).` }], { max_tokens: 6000 });
  return String(content || '').replace(/^```[a-z]*\s*|\s*```$/g, '').trim();
}

(async () => {
  log(`[cro100] writing ${N} CRO Q&As (no year), hardened generators`);
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  let nextId = Math.max(...(idx.entries || []).filter(e => e && /^tl\d+$/.test(e.id)).map(e => +e.id.slice(2))) + 1;
  const have = new Set((idx.entries || []).map(e => e && e.question));
  const valid = new Set((idx.entries || []).map(e => e.id));
  let made = 0;
  for (let i = 0; i < N && !fs.existsSync(STOP); i++) {
    const title = TITLES[i];
    if (have.has(title)) { log(`[cro100] skip dup: ${title}`); continue; }
    const id = 'tl' + (nextId++);
    try {
      let body = await genBody(title);
      const now = Date.now();
      await store.setJSON('answers/' + id + '.json', { id, question: title, answer: body, tags: ['fractional-cro', 'chief-revenue-officer', 'revops', 'tools', 'cro-syndicate'], quality_score: 5, format_v: '2026-06', pending: false, ts: now, model: 'deepseek', source: 'tools_cro_100' });
      // top up any missing station deterministically/DeepSeek so it's close to bar before the button QAs it
      valid.add(id);
      await fixEntry(id, title, [], valid, dsChat).catch(() => {});
      const cur = await store.get('answers/' + id + '.json', { type: 'json' });
      const g = gradeEntry(id, cur.answer, { imagesDeferred: true });
      // add to index (front)
      const fresh = await store.get('_index.json', { type: 'json', consistency: 'strong' });
      if (!fresh.entries.some(e => e && e.id === id)) { fresh.entries.unshift({ id, question: title, tags: ['fractional-cro', 'chief-revenue-officer', 'revops'], quality_score: g.score, format_v: '2026-06', pending: false, ts: now, was_indexed_at: null }); await store.setJSON('_index.json', fresh); }
      made++;
      log(`[cro100] ${made}/${N} ✓ ${id} (${g.score}/13) — ${title}`);
    } catch (e) { log(`[cro100] ✗ ${id} ${title} — ${e.message}`); }
    await sleep(800);
  }
  log(`[cro100] DONE — wrote ${made} CRO Q&As. They're new → the Scrub Button watcher queues them for your QA/certify.`);
})().catch(e => { log('[cro100] FATAL ' + (e && e.message)); process.exit(1); });
