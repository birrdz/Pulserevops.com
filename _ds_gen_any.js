// Generic DeepSeek body generator for any Q&A-style pillar. Picks a prompt by id
// prefix, generates, scrubs banned phrases, grades against THAT pillar's ruleset
// (grade-entry auto-detects by id), retries until clean. images_law deferred.
// CLI: node _ds_gen_any.js <id> "<title>" [--write]
const fs = require('fs');
const { dsChat } = require('./_ds_lib');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');

const BANNED_REPLACE = [
  [/\bdelve(?:\s+into)?\b/gi, 'examine'], [/\btapestry\b/gi, 'mix'], [/\blandscape\b/gi, 'market'],
  [/\bholistic\b/gi, 'complete'], [/\bin\s+today'?s\b/gi, 'in current'], [/\bever-?evolving\b/gi, 'fast-changing'],
  [/\bsynergistic\b/gi, 'aligned'], [/\bsynerg(?:y|ies)\b/gi, 'alignment'], [/\bparadigm\s+shift\b/gi, 'major shift'],
  [/\bgame-?changer\b/gi, 'breakthrough'], [/\bcutting-?edge\b/gi, 'modern'], [/\bstate-?of-?the-?art\b/gi, 'top-tier'],
  [/\bseamless\s+integration\b/gi, 'tight integration'], [/\bdrive\s+growth\b/gi, 'grow revenue'],
  [/\bunlock\s+value\b/gi, 'capture value'], [/\bunlock\s+potential\b/gi, 'realize potential'],
  [/\bneedless\s+to\s+say\b/gi, 'clearly'], [/\bit'?s\s+worth\s+noting\b/gi, 'note'], [/\bit'?s\s+important\s+to\s+note\b/gi, 'importantly'],
];
function sanitize(b) {
  for (const [re, rep] of BANNED_REPLACE) b = b.replace(re, (m) => (/^[A-Z]/.test(m) ? rep[0].toUpperCase() + rep.slice(1) : rep));
  return b;
}
function clean(body) {
  let b = String(body || '').trim().replace(/^```(?:markdown|md)?\s*\n([\s\S]*?)\n```\s*$/i, '$1');
  return sanitize(b.trim());
}
const BANNED_LINE = 'delve, tapestry, landscape, holistic, "in today\'s", ever-evolving, synergy, paradigm shift, game-changer, cutting-edge, state-of-the-art, seamless integration, drive growth, unlock value/potential, needless to say, "it\'s worth noting", "it\'s important to note"';

const ANTIFAB = `NEVER fabricate facts: do NOT invent precise statistics, do NOT invent executive names or quotes, do NOT invent source URLs, do NOT cite tools/reports that no longer exist. Use realistic RANGES instead of fake precise figures, and only real, verifiable companies and links (prefer official/investor-relations domains). If unsure of an exact number, give a range and say it's an estimate.`;
const SYSTEM_REVOPS = `You are a senior RevOps + go-to-market writer for PULSE, an authority site. You write specific, useful, expert content with REAL named tools/companies/frameworks (Salesforce, HubSpot, Gong, Clari, Outreach, Salesloft, MEDDIC/MEDDPICC, Challenger, Winning by Design, Gartner, Forrester) and real numbers. No fluff. ${ANTIFAB} Output ONLY the article body in Markdown — no frontmatter, no outer code fences, no preamble.`;
// Topic-appropriate system for consumer/Top-10 pillars: do NOT inject RevOps/CRM
// tooling into aquariums, electronics, cars, etc. (prevents content bleed).
const SYSTEM_GENERIC = `You are a senior subject-matter expert and review writer for PULSE, an authority site. Write specific, accurate, useful content with REAL named brands, products, places, models, specs, and real numbers that are RELEVANT TO THIS EXACT TOPIC. Never mention sales, RevOps, CRM, or B2B tools/frameworks (Salesforce, HubSpot, Gong, Clari, MEDDIC, MEDDPICC, Challenger, Winning by Design, Salesloft, Outreach, Gartner, Forrester, etc.) — they do NOT belong in consumer topics. Never write in first person or reference a "Chief Revenue Officer", "CRO Syndicate", "25 years in revenue", or any personal memoir/byline. ONLY name products, brands, and models you are certain genuinely exist; NEVER invent product names, model numbers, specs, prices, percentages, or sources — if unsure of an exact spec or stat, omit it rather than guess. Every source link must be a real, relevant, topic-appropriate page (manufacturer/retailer/reference), never a sales-vendor blog. No fluff. Output ONLY the article body in Markdown — no frontmatter, no outer code fences, no preamble.`;
const SYSTEM = SYSTEM_REVOPS; // back-compat

const REQS = {
  qa: (title) => `Write a complete gold-format PULSE answer to this exact RevOps question:

"${title}"

Frame it around the CURRENT 2027 RevOps reality (AI in the funnel, vendor consolidation, longer cycles, buying committees) where relevant. Use Markdown. Hard requirements (all mandatory):
- 1,400–2,000 words of real value (hard floor 1,200). NO padding.
- Start with "### Direct Answer" — 3–6 sentences answering head-on. NO TL;DR anywhere.
- At least 6 H2/H3 sections.
- EXACTLY TWO mermaid diagrams in \`\`\`mermaid fences (one "flowchart TD" decision tree, one "flowchart LR" process/loop), valid syntax, real branching.
- A "## FAQ" with AT LEAST 5 pairs; each question a bold line ending in "?" (**...?**), answer below.
- A "## Sources" bullet list — EVERY line starts with "- " + a real link "- [label](https://...)", AT LEAST 6 credible sources (HBR, Gartner, Forrester, McKinsey, Gong Labs, SaaStr, Bessemer, vendor blogs).
- At least 12 bold spans. Name at least 3 real tools/companies/frameworks.
- End with "## Bottom Line" (2–4 sentences) then "## Sources", then a final italic SEO keyword-mirror line.
- Banned phrases (never use): ${BANNED_LINE}.
Output ONLY the Markdown body.`,

  kpi: (title) => `Write a complete gold-format PULSE Industry KPI guide titled:

"${title}"

Follow the locked ik0035 structure. Markdown. Hard requirements:
- 1,500+ words (absolute floor 1,200).
- Start with "### Direct Answer", then a TL;DR blockquote (> **TL;DR:** ...).
- These H2 sections (5+ of 6 required, in order): "## Why <industry> Measures Differently", "## The Most Important KPIs to Track" (define each KPI in depth), "## Real Operators", "## Failure Modes", "## Reporting Cadence", "## 30-60-90".
- TWO \`\`\`mermaid diagrams. A "## FAQ" with 5+ bold "?" pairs. A "## Sources" bullet list (- [..](http..)) with 6+ links.
- 25+ bold spans; 5+ real named vendors with real prices/benchmarks.
- Banned phrases (never): ${BANNED_LINE}.
Output ONLY the Markdown body.`,

  revenuearchitecture: (title) => `Write a complete gold-format PULSE Revenue Architecture answer (locked q12243 template) titled:

"${title}"

Markdown. Hard requirements (ALL mandatory — drafts missing ANY are rejected):
- 1,800+ words. Start with "### Direct Answer" (NO TL;DR).
- 5–7 numbered H2 sections ("## 1. ...") each with H3 subsections.
- You MUST include EXACTLY TWO mermaid diagrams, each in its own \`\`\`mermaid fenced block (one "flowchart TD", one "flowchart LR"), valid syntax, real branching. Two separate fences — not one.
- You MUST bold AT LEAST 30 key phrases across the sections using **...** (vendor names, role names, metrics, key moves). Bold liberally in every section.
- Real named vendors + prices + analysts + benchmarks. 2027 framing. Operator-role specificity.
- "## FAQ" (5+ bold "?" pairs), "## Bottom Line", "## Sources" bullet list — every line "- [label](https://...)", 6+ links.
- Banned phrases (never): ${BANNED_LINE}.
Output ONLY the Markdown body.`,

  gtmplaybook: (title) => REQS.revenuearchitecture(title).replace('Revenue Architecture answer', 'GTM Playbook answer'),

  training: (title) => `Write a complete gold-format PULSE Sales Training (locked st213 template) titled:

"${title}"

A ready-to-run training/meeting. Markdown. Hard requirements:
- 1,500+ words. Start with "### Direct Answer" (NO TL;DR).
- 6 numbered H2 sections each with a time allocation in the header, e.g. "## 1. Warm-Up (10 min)". Include verbatim scripts.
- TWO \`\`\`mermaid diagrams. "## FAQ" (5+ bold "?" pairs). "## Sources" bullet list (- [..](http..), 6+).
- 15+ bold spans; 3+ real named frameworks/tools.
- Banned phrases (never): ${BANNED_LINE}.
Output ONLY the Markdown body.`,
};

// Generic Top-10 ranking prompt (used for the Top-10 half of every dual pillar).
// A Top-10-shaped body grades under the electronicreview ruleset (see grade-entry).
REQS.top10 = (title) => `Write a complete gold-format PULSE Top-10 ranking article for this exact title:

"${title}"

A ranked list of the 10 best options for the topic, for a professional/operator reader. Markdown. Hard requirements:
- 1,800–2,200 words of real value (never pad).
- Start with "### Direct Answer" — 3–5 sentences naming the #1 pick and runner-up, and who it's for. NO TL;DR.
- A "## How We Ranked These" criteria section.
- EXACTLY 10 numbered H2 sections: "## 1. <Name>" ... "## 10. <Name>". The #1 header MUST include "🏆 BEST OVERALL" and ONE other section MUST include "💎 BEST VALUE". Each: 2–4 paragraphs (what it is, how/when to use, a real tool/framework ref), key terms bolded, real prices/numbers where relevant.
- At least ONE \`\`\`mermaid flowchart TD decision tree with real branching.
- "## FAQ" with 5+ bold "?" pairs. "## Sources" bullet list — every line "- [label](https://...)", 6+ credible links.
- 25+ bold spans. 3+ real named tools/companies. 2027 framing where relevant.
- End "## Bottom Line" then "## Sources" then a final italic SEO keyword-mirror line.
- Banned phrases (never): ${BANNED_LINE}.
Output ONLY the Markdown body.`;

function pillarKey(id) {
  if (/^ik\d/i.test(id)) return 'kpi';
  if (/^ra\d/i.test(id)) return 'revenuearchitecture';
  if (/^gp\d/i.test(id)) return 'gtmplaybook';
  if (/^st\d/i.test(id)) return 'training';
  return 'qa'; // q, tk, cg-qa, default
}

async function generateGradedBody(id, title, opts = {}) {
  const maxTries = opts.maxTries ?? 3;
  // kind 'top10' -> Top-10 prompt (grades as electronicreview by shape);
  // otherwise the pillar's regular ruleset prompt.
  const key = opts.kind === 'top10' ? 'top10' : (opts.ruleset || pillarKey(id));
  const promptFn = REQS[key] || REQS.qa;
  const chat = opts.chat || dsChat; // injectable engine (gemini/groq/etc); defaults to DeepSeek
  let best = null;
  for (let i = 0; i < maxTries; i++) {
    const fix = i > 0 && best ? `\n\nYOUR PREVIOUS DRAFT FAILED: ${best.grade.missing.join(', ')}. Fix every one. ${best.grade.banned_hits.length ? 'Remove: ' + best.grade.banned_hits.join(', ') : ''}` : '';
    let content;
    try {
      const ground = opts.grounding ? '\n\n' + opts.grounding : '';
      // ONLY the actual RevOps pillars get the RevOps system. EVERY consumer
      // pillar (aq, er, sc, dn, ca, bt, co, bs, …) ALWAYS gets the generic
      // non-RevOps system regardless of kind — fixes RevOps/CRO memoir bleed
      // that leaked when a consumer entry was generated as a non-top10 kind.
      const REVOPS_PILLARS = /^(q|ik|tk|tl|st|cg|ra|gp)\d/i;
      const system = REVOPS_PILLARS.test(id) ? SYSTEM_REVOPS : SYSTEM_GENERIC;
      const r = await chat([{ role: 'system', content: system }, { role: 'user', content: promptFn(title) + ground + fix }], { temperature: 0.6, max_tokens: 8000 });
      content = clean(r.content);
    } catch (e) { if (i === maxTries - 1) throw e; continue; }
    const grade = gradeEntry(id, content, { imagesDeferred: true });
    if (!best || grade.score > best.grade.score) best = { body: content, grade };
    if (grade.banned_hits.length === 0 && grade.missing.every((m) => m === 'images_law')) return { body: content, grade, tries: i + 1 };
  }
  return { body: best.body, grade: best.grade, tries: maxTries };
}

module.exports = { generateGradedBody, pillarKey };

if (require.main === module) {
  (async () => {
    const id = process.argv[2], title = process.argv[3], write = process.argv.includes('--write');
    if (!id || !title) { console.error('usage: node _ds_gen_any.js <id> "<title>" [--write]'); process.exit(1); }
    const { body, grade, tries } = await generateGradedBody(id, title);
    if (write) fs.writeFileSync(`C:/Users/koryj/${id}_answer.md`, body);
    console.log(JSON.stringify({ id, ruleset: pillarKey(id), tries, score: grade.score, words: grade.word_count, missing: grade.missing, banned: grade.banned_hits, written: write }));
  })().catch((e) => { console.error('ERR', e.message); process.exit(1); });
}
