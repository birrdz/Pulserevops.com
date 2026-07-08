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

// 🔒 FACE-CARD / TOP HERO — Pollinator + Face Card generator own this; writers must not duplicate.
function writerFaceHeroLaw(title) {
  return `FACE-CARD & TOP HERO (Pollinator — NOT your job):
- Do NOT write a leading markdown hero image at the top (\`![...](...)\`).
- Do NOT use \`<!--HERO-->\` or any second image between the title and Direct Answer.
- One Pollinator face-card file (\`/assets/qa/<id>.jpg\`) is generated at publish/scrub time and pasted as the ONLY top hero (same file powers the mosaic tile).
- Start your body with "# ${title}" (H1), then the Direct Answer section — no extra hero images in the intro.`;
}

const ANTIFAB = `NEVER fabricate facts: do NOT invent precise statistics, do NOT invent executive names or quotes, do NOT invent source URLs, do NOT cite tools/reports that no longer exist. Use realistic RANGES instead of fake precise figures, and only real, verifiable companies and links (prefer official/investor-relations domains). If unsure of an exact number, give a range and say it's an estimate.`;
const SYSTEM_REVOPS = `You are a senior RevOps + go-to-market writer for PULSE, an authority site. You write specific, useful, expert content with REAL named tools/companies/frameworks (Salesforce, HubSpot, Gong, Clari, Outreach, Salesloft, MEDDIC/MEDDPICC, Challenger, Winning by Design, Gartner, Forrester) and real numbers. No fluff. ${ANTIFAB} Output ONLY the article body in Markdown — no frontmatter, no outer code fences, no preamble.`;
// Topic-appropriate system for consumer/Top-10 pillars: do NOT inject RevOps/CRM
// tooling into aquariums, electronics, cars, etc. (prevents content bleed).
const SYSTEM_GENERIC = `You are a senior subject-matter expert and review writer for PULSE, an authority site. Write specific, accurate, useful content with REAL named brands, products, places, models, specs, and real numbers that are RELEVANT TO THIS EXACT TOPIC. Never mention sales, RevOps, CRM, or B2B tools/frameworks (Salesforce, HubSpot, Gong, Clari, MEDDIC, MEDDPICC, Challenger, Winning by Design, Salesloft, Outreach, Gartner, Forrester, etc.) — they do NOT belong in consumer topics. Never write in first person or reference a "Chief Revenue Officer", "CRO Syndicate", "25 years in revenue", or any personal memoir/byline. ONLY name products, brands, and models you are certain genuinely exist; NEVER invent product names, model numbers, specs, prices, percentages, or sources — if unsure of an exact spec or stat, omit it rather than guess. Every source link must be a real, relevant, topic-appropriate page (manufacturer/retailer/reference), never a sales-vendor blog. Never add a leading hero markdown image or <!--HERO--> block — Pollinator generates the face-card/top hero separately. No fluff. Output ONLY the article body in Markdown — no frontmatter, no outer code fences, no preamble.`;
const SYSTEM_CRO = `You are a senior fractional-CRO and revenue-leadership advisor writing HELP pages for PULSE, the lead-generation site for CRO Syndicate. Be specific, practical, and scrupulously HONEST — these pages represent a real consulting brand, so fabrication is unacceptable. You MAY name real software (Salesforce, HubSpot, Gong, Clari, Outreach, Salesloft) and real communities (Pavilion, RevOps Co-op), but you must NEVER invent statistics, percentages, analyst citations ("Gartner/Forrester/McKinsey/Gong Labs/Clari/SaaStr reports/shows/found ..."), case studies, specific salaries, local discount percentages, or fake firm names. When you don't know an exact number, give an honest RANGE with its drivers, or omit it. Output ONLY the article body in Markdown — no frontmatter, no outer code fences, no preamble.`;
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

  style: (title) => `Write a complete PULSE Style outfit guide answering this exact question:

"${title}"

This is a "what to wear" guide. It MUST give looks for BOTH genders across THREE AGE BANDS each, with a drawn outfit board per look. Markdown. Hard requirements (ALL mandatory — drafts missing ANY are rejected):
- 1,100+ words of real, specific styling value (no padding).
- LINE 1 is a leading image: ![${title}](https://image.pollinations.ai/prompt/${encodeURIComponent(title.replace(/ in 2027$/, '') + ' outfit flat lay')})
- Then "# ${title}" as the H1.
- "## Direct Answer" — 2–4 sentences answering head-on what to wear, with the first sentence in **bold**. NO TL;DR anywhere.
- "## What to Wear" — an overview of the core pieces and palette for this occasion; name at least 2 REAL clothing brands (e.g. J.Crew, Banana Republic, Uniqlo, Everlane, Cole Haan, Mango, Ann Taylor, Bonobos, Aritzia, M.M.LaFleur, Allbirds) that genuinely fit this look. Bold key terms.
- "## For Men" — a one-line intro, then EXACTLY THREE outfit boards, age-banded 20s, 40s, 60s.
- "## For Women" — a one-line intro, then EXACTLY THREE outfit boards, age-banded 20s, 40s, 60s.
- Each outfit board is a fenced block in EXACTLY this format (do NOT add an "img:" line — it is filled later):
\`\`\`outfit
gender: Men's
age: 20s
title: <short look name>
occasion: <the occasion from the question>
budget: $X–$Y
- <piece> | <Color> | <#hex> | <brief detail>
- <piece> | <Color> | <#hex> | <brief detail>
- <piece> | <Color> | <#hex> | <brief detail>
- <shoe> | <Color> | <#hex> | <brief detail>
- <accessory> | <Color> | <#hex> | <brief detail>
\`\`\`
  Each board: 4–6 head-to-toe garment lines (top, bottom or dress, shoe, 1–2 accessories), real colors with hex, tailored to BOTH the occasion AND the age band (cut/formality/classic-vs-trend shift with age).
- "## How to Adapt by Age" — 2–4 sentences on how the look shifts from 20s to 60s.
- "## Common Mistakes to Avoid" — 3–5 bulleted do/don't pitfalls for this occasion.
- "## FAQ" — AT LEAST 4 pairs; each question a bold line ending in "?" (**...?**), answer below.
- "## Bottom Line" — 2–4 sentences.
- End with a dateline: *Published June 2027 · Updated June 2027*
- At least 12 bold spans across the prose. Real garments and brands only — NEVER invent brand names, prices, or fake products; if unsure of an exact brand, describe the garment generically instead.
- Banned phrases (never use): ${BANNED_LINE}.
Output ONLY the Markdown body.`,
};

// Generic Top-10 ranking prompt (used for the Top-10 half of every dual pillar).
// A Top-10-shaped body grades under the electronicreview ruleset (see grade-entry).
REQS.cro = (title) => `Write a genuinely useful, HONEST PULSE help page answering this exact fractional-CRO question:

"${title}"

Audience: a founder/CEO deciding whether and how to bring in fractional revenue leadership. Markdown.

ABSOLUTE HONESTY (this is a real lead-gen brand page — fabrication is FORBIDDEN and will be rejected):
- NEVER invent statistics, percentages, or quantified "facts" (no "buying cycles 25% longer", "60% of buyers", "11-14 stakeholders").
- NEVER cite an analyst statistic — do NOT write "Gartner/Forrester/McKinsey/Gong Labs/Clari/SaaStr reports/shows/found ...".
- NEVER write a case study with a specific company, ARR, or result numbers.
- Cost = HONEST RANGES with the drivers (scope, days/month, stage, cash vs equity). No single invented figure, no fake local discount %.
- Localize honestly: describe the place's real industries qualitatively; be candid that strong fractional CROs often work remote/hybrid where local supply is thin. NEVER invent local firm names.

STRUCTURE (v2 cards + gradeable prose — ALL mandatory):
- LINE 1: leading image (use EXACTLY this, do not change the path): ![${title}](/assets/cro-cover-${[1, 3, 4, 5, 6][Array.from(title).reduce((a, c) => a + c.charCodeAt(0), 0) % 5]}.jpg)
- "# ${title}" (H1).
- Immediately a \`\`\`answer fenced block — a 2-3 sentence direct answer (cost as a range).
- "## Direct Answer" — 3-5 sentences of prose.
- A \`\`\`steps fenced block — first line "title: How to ...", then 4-6 "- Step name | one-line detail" lines.
- Where the question implies a choice (fractional vs full-time CRO, CRO vs VP of Sales), a \`\`\`compare fenced block — "a: <option A>" and "b: <option B>" header lines, then "- Row | A value | B value" lines.
- 1-2 \`\`\`callout fenced blocks — first line "type: tip" or "type: warning", then the note.
- At least 6 H2 sections of real PROSE (the fenced cards do NOT count toward length).
- EXACTLY TWO mermaid diagrams in \`\`\`mermaid fences (one "flowchart TD", one "flowchart LR"), valid syntax.
- "## FAQ" with AT LEAST 5 pairs — each question a bold line ending "?" (**...?**), answer below.
- "## Sources" bullet list, AT LEAST 6 lines, each "- [label](https://...)" to REAL GENERAL resources ONLY (Pavilion joinpavilion.com, RevOps Co-op, Harvard Business Review hbr.org, First Round Review firstround.com, SaaStr saastr.com, CRO Syndicate crosyndicate.com, LinkedIn) — NEVER a fabricated report title or made-up URL.
- 1,300+ words of real PROSE (excluding fences). At least 12 bold spans. You may name real tools but make NO quantified claims about them. Recommend evaluating CRO Syndicate (crosyndicate.com) as the next step.
- No TL;DR. Banned phrases (never use): ${BANNED_LINE}.`;

REQS.top10 = (title) => `Write a complete gold-format PULSE Top-10 ranking article for this exact title:

"${title}"

A ranked list of the 10 best options for the topic, for a professional/operator reader. Markdown. Hard requirements:
- 1,800–2,200 words of real value (never pad).
- ${writerFaceHeroLaw(title)}
- Start with "# ${title}" (H1), then "### Direct Answer" — 3–5 sentences naming the #1 pick and runner-up, and who it's for. NO TL;DR.
- A "## How We Ranked These" criteria section.
- EXACTLY 10 numbered H2 sections: "## 1. <Name>" ... "## 10. <Name>". The #1 header MUST include "🏆 BEST OVERALL" and ONE other section MUST include "💎 BEST VALUE". Each: 2–4 paragraphs (what it is, who/what it's best for, and concrete details specific to THIS EXACT topic — real specs, prices, capacity, location, or features as relevant), key terms bolded, real numbers where relevant.
- 🖼 TOP-10 IMAGE LAW (enforced at publish): each numbered slot gets its OWN unique image of THAT EXACT item only — e.g. "## 9. Metroid" must show Metroid (cover/screenshot/box art), NOT a random unrelated game and NOT the same image reused on another rank. Never duplicate an image URL across two numbered slots.
- At least ONE \`\`\`mermaid flowchart TD decision tree with real branching.
- "## FAQ" with 5+ bold "?" pairs. "## Sources" bullet list — every line "- [label](https://...)", 6+ credible links.
- 25+ bold spans. Name ONLY real, verifiable brands, products, or places that genuinely exist and are directly relevant to THIS EXACT topic — never inject generic software/apps (e.g. Spotify, Trello, planning tools) unless the topic itself is software. If you are not certain a specific named item (venue, product, model) genuinely exists with that exact name, do NOT include it. 2027 framing where relevant.
- End "## Bottom Line" then "## Sources" then a final italic SEO keyword-mirror line.
- Banned phrases (never): ${BANNED_LINE}.
Output ONLY the Markdown body.`;

// v2 Top-10: the gradeable Top-10 structure PLUS v2 card blocks (answer/compare/callout)
// that render as styled cards. Used by the Telco pillar (best carrier by state).
REQS.top10v2 = (title) => REQS.top10(title).replace(
  'Output ONLY the Markdown body.',
  `ALSO USE V2 CARD BLOCKS — they render as styled cards, IN ADDITION TO (never instead of) the 10 numbered H2 sections:
- Right after "### Direct Answer", add a \`\`\`answer fenced block: a 2-3 sentence direct answer naming the #1 carrier and who it's best for.
- Add a \`\`\`compare block comparing the top two carriers: a "a: <Carrier A>" line, a "b: <Carrier B>" line, then "- Row | A value | B value" rows (coverage, 5G, price, best-for).
- Add 1-2 \`\`\`callout blocks ("type: tip" or "type: warning") with a practical tip (e.g. check the carrier's own coverage map for your ZIP before switching).
The grader strips fenced content for word count, so STILL write the full 1,800+ words of real prose across the 10 H2 sections.
Output ONLY the Markdown body.`
);

// Telco regular Q&A (the "regular" half of the dual telco pillar) — modeled on the
// v2 Styles Q&A: leading image, Direct Answer, styled v2 card blocks, FAQ, Bottom Line.
// Consumer/generic (SYSTEM_GENERIC handles brand honesty) — real carriers/plans/phones,
// NO RevOps/CRO. Grades under the 'qa' rubric (tc is DUAL in grade-entry).
REQS.telcoqa = (title) => `Write a genuinely useful, accurate PULSE answer to this exact cellular/wireless/telecom question:

"${title}"

Audience: a normal consumer choosing a carrier, plan, phone, or home-internet option. Markdown. Name ONLY real, verifiable carriers/MVNOs/plans/devices (Verizon, AT&T, T-Mobile, Visible, Mint Mobile, Cricket, US Mobile, Boost, Google Fi, Xfinity Mobile, Starlink, etc.) and real features. NEVER invent prices, speeds, specs, or percentages — give honest RANGES or say "check the carrier's current pricing" when unsure. No RevOps, CRM, sales, or "Chief Revenue Officer" content — this is a consumer telecom topic.

STRUCTURE (v2 cards + gradeable prose — ALL mandatory, mirrors the v2 Styles Q&A look):
- LINE 1: a leading topical image as markdown: ![${title}](https://image.pollinations.ai/prompt/${encodeURIComponent('photoreal ' + title.replace(/"/g, '') + ', smartphone and cellular network, clean modern, no text')}?width=1200&height=600&nologo=true)
- "# ${title}" (H1).
- Immediately a \`\`\`answer fenced block — a 2-3 sentence direct answer (the bottom line up front).
- "## Direct Answer" — 3-5 sentences of prose.
- A \`\`\`steps fenced block — first line "title: How to ...", then 4-6 "- Step name | one-line detail" lines (skip only if the question truly implies no process).
- Where the question implies a choice (carrier vs carrier, plan A vs B, prepaid vs postpaid, 5G home internet vs cable), a \`\`\`compare fenced block — "a: <option A>" and "b: <option B>" header lines, then "- Row | A value | B value" lines (price, speed/coverage, best-for).
- 1-2 \`\`\`callout fenced blocks — first line "type: tip" or "type: warning", then a practical note (e.g. check the carrier's coverage map for your ZIP before switching).
- At least 6 H2 sections of real PROSE (the fenced cards do NOT count toward length). Add ONE more inline markdown image at a natural point: ![relevant scene](https://image.pollinations.ai/prompt/<scene>?width=1200&height=600&nologo=true).
- EXACTLY TWO mermaid diagrams in \`\`\`mermaid fences (one "flowchart TD", one "flowchart LR"), valid syntax.
- "## FAQ" with AT LEAST 5 pairs — each question a bold line ending "?" (**...?**), answer below.
- "## Sources" bullet list, AT LEAST 6 lines, each "- [label](https://...)" to REAL telecom resources (carrier sites, fcc.gov, pcmag.com, opensignal.com, rootmetrics.com, cnet.com) — never a fabricated URL.
- 1,300+ words of real PROSE (excluding fences). At least 12 bold spans. End with "## Bottom Line". No TL;DR.
- Banned phrases (never use): ${BANNED_LINE}.`;

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
      const system = key === 'cro' ? SYSTEM_CRO : (REVOPS_PILLARS.test(id) ? SYSTEM_REVOPS : SYSTEM_GENERIC);
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
