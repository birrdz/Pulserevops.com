// DeepSeek body generator for the Coaching pillar (cg####).
// LAW (2026-06-23): DeepSeek writes ALL text; images come later via Claude Code.
// Two formats (1:1 mix): kind='top10' (Top-10 ranking) | kind='qa' (operator Q&A).
// Generates a body, grades it locally (images deferred), retries until >=10/12.
//
// CLI:  node _cg_ds_gen.js <cg####> <top10|qa> "<title>" [--write]
//       --write saves C:/Users/koryj/<id>_answer.md (else prints score only)
const fs = require('fs');
const { dsChat } = require('./_ds_lib');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');

const BANNED = ['delve', 'tapestry', 'landscape', 'holistic', "in today's", 'ever-evolving',
  'synergy', 'synergistic', 'paradigm shift', 'game-changer', 'game changer', 'cutting-edge',
  'state-of-the-art', 'seamless integration', 'drive growth', 'unlock value', 'unlock potential',
  'needless to say', "it's worth noting", "it's important to note"];

const SYSTEM = `You are a senior sales-enablement writer for PULSE, a RevOps authority site. You write practical, specific, manager-facing content with real frameworks (GROW, Sandler, Challenger, MEDDIC/MEDDPICC, SPIN, Command of the Message, GAP selling), real tools (Gong, Chorus, Salesforce, Outreach, Clari, Salesloft, HubSpot), and verbatim scripts. You never use filler or marketing fluff. You output ONLY the article body in Markdown — no frontmatter, no outer code fences, no preamble.`;

function bannedList() {
  return BANNED.join(', ');
}

function promptQA(title) {
  return `Write a complete gold-format PULSE Coaching Q&A answer to this exact question:

"${title}"

The reader is the COACH (sales manager / VP / enablement leader), not the rep. Answer head-on with real, usable specifics. Use Markdown. Follow this EXACT skeleton and hard requirements:

HARD REQUIREMENTS (all mandatory):
- 1,500–2,000 words of real value (never pad).
- Start with "### Direct Answer" — 3–6 sentences that answer the question head-on and name the core coaching move. NO TL;DR anywhere.
- At least 6 H2/H3 sections total.
- Exactly TWO mermaid diagrams in \`\`\`mermaid code fences: the first a "flowchart TD" diagnosis decision tree (symptom -> root cause: skill vs will vs knowledge vs system); the second a "flowchart LR" coaching cadence loop (observe -> diagnose -> coach -> practice -> measure -> repeat). Real branching, valid mermaid syntax.
- A "## FAQ" section with AT LEAST 5 Q&A pairs. Each question is a bold line ending in a question mark, like **How long should this take?** followed by the answer in the next paragraph.
- A "## Sources" section with AT LEAST 6 real sources formatted as a Markdown bullet list — EVERY line MUST start with "- " followed by a link, like "- [Gong Labs research](https://www.gong.io/...)". Use HBR, Gong Labs/Gong.io, Sales Hacker, RAIN Group, Sandler, Challenger/Gartner, Winning by Design, Salesforce/Outreach blogs, SBI, Richardson, CSO Insights.
- At least 12 bold spans (**...**) total.
- Name at least 3 real frameworks/tools/companies.
- Include verbatim manager scripts (the exact words to say in a 1:1), leaning on the GROW model.
- 2027 framing where relevant (AI call-coaching, hybrid teams, longer cycles, buying committees).
- End with a "## Bottom Line" (2–4 sentences) then the "## Sources" list, then a final italic line mirroring the SEO keywords, e.g. *Sales coaching for <topic> — how to coach <topic>, sales manager coaching guide, rep coaching framework, and a coaching playbook for 2027.*

RECOMMENDED SECTION FLOW: ### Direct Answer / ## Why This Happens — Diagnose Before You Coach (with the TD mermaid) / ## The Coaching Conversation (verbatim GROW scripts) / ## The Coaching Plan / Cadence (with the LR mermaid) / ## Drills & Role-Play / ## What to Measure / ## Common Mistakes Managers Make / ## FAQ / ## Bottom Line / ## Sources.

BANNED PHRASES (never use any of these): ${bannedList()}.

Output ONLY the Markdown body.`;
}

function promptTop10(title) {
  return `Write a complete gold-format PULSE Coaching TOP-10 ranking article for this exact title:

"${title}"

This is a ranked list of the 10 best coaching techniques/plays/drills/tools for the topic. The reader is a sales manager/VP/enablement leader. Use Markdown. Follow this EXACT structure and hard requirements:

HARD REQUIREMENTS (all mandatory):
- 1,800–2,200 words of real value (never pad).
- Start with "### Direct Answer" — 3–5 sentences naming the #1 pick and the runner-up, and who this is for. NO TL;DR.
- A "## How We Ranked These" section explaining the criteria.
- EXACTLY 10 numbered product/technique sections as H2 headers: "## 1. <Name>", "## 2. <Name>", ... "## 10. <Name>". The #1 section header MUST include the marker "🏆 BEST OVERALL" and ONE other section (any rank) MUST include the marker "💎 BEST VALUE". Each numbered section: 2–4 paragraphs with what it is, how to run it, when to use it, and a real framework/tool reference. Bold the key terms.
- At least ONE mermaid diagram in a \`\`\`mermaid fence: a "flowchart TD" decision tree ("Which coaching move should you run?") with real branching.
- A "## FAQ" section with AT LEAST 5 Q&A pairs. Each question a bold line ending in "?", answer below it.
- A "## Sources" section with AT LEAST 6 real sources formatted as a Markdown bullet list — EVERY line MUST start with "- " followed by a link, like "- [Gong](https://www.gong.io)". Use Gong, Salesforce, HubSpot, MEDDIC Academy, Winning by Design, Force Management, Challenger, Sandler, Sales Hacker, HBR, RAIN Group.
- At least 25 bold spans (**...**) total — product names, key terms, pros/cons all bolded.
- Name at least 3 real frameworks/tools/companies.
- 2027 framing where relevant.
- End with "## Bottom Line" (2–4 sentences) then "## Sources", then a final italic SEO keyword mirror line.

BANNED PHRASES (never use any of these): ${bannedList()}.

Output ONLY the Markdown body.`;
}

// Deterministic banned-phrase scrubber. DeepSeek loves "landscape"/"holistic"
// etc.; retries don't reliably remove them, so we replace with safe equivalents
// (case-preserving for the first letter) before grading. Avoids lost entries.
const BANNED_REPLACE = [
  [/\bdelve(?:\s+into)?\b/gi, 'examine'],
  [/\btapestry\b/gi, 'mix'],
  [/\blandscape\b/gi, 'market'],
  [/\bholistic\b/gi, 'complete'],
  [/\bin\s+today'?s\b/gi, 'in current'],
  [/\bever-?evolving\b/gi, 'fast-changing'],
  [/\bsynergistic\b/gi, 'aligned'],
  [/\bsynerg(?:y|ies)\b/gi, 'alignment'],
  [/\bparadigm\s+shift\b/gi, 'major shift'],
  [/\bgame-?changer\b/gi, 'breakthrough'],
  [/\bcutting-?edge\b/gi, 'modern'],
  [/\bstate-?of-?the-?art\b/gi, 'top-tier'],
  [/\bseamless\s+integration\b/gi, 'tight integration'],
  [/\bdrive\s+growth\b/gi, 'grow revenue'],
  [/\bunlock\s+value\b/gi, 'capture value'],
  [/\bunlock\s+potential\b/gi, 'realize potential'],
  [/\bneedless\s+to\s+say\b/gi, 'clearly'],
  [/\bit'?s\s+worth\s+noting\b/gi, 'note'],
  [/\bit'?s\s+important\s+to\s+note\b/gi, 'importantly'],
];
function sanitizeBanned(body) {
  let b = body;
  for (const [re, rep] of BANNED_REPLACE) {
    b = b.replace(re, (m) => (/^[A-Z]/.test(m) ? rep.charAt(0).toUpperCase() + rep.slice(1) : rep));
  }
  return b;
}

function clean(body) {
  let b = String(body || '').trim();
  // strip an accidental outer ```markdown ... ``` fence
  b = b.replace(/^```(?:markdown|md)?\s*\n([\s\S]*?)\n```\s*$/i, '$1');
  return sanitizeBanned(b.trim());
}

async function generateGradedBody(id, title, kind, opts = {}) {
  const maxTries = opts.maxTries ?? 3;
  const prompt = kind === 'top10' ? promptTop10(title) : promptQA(title);
  let best = null;
  for (let i = 0; i < maxTries; i++) {
    const messages = [
      { role: 'system', content: SYSTEM },
      { role: 'user', content: prompt + (i > 0 && best ? `\n\nYOUR PREVIOUS DRAFT FAILED THESE CHECKS: ${best.grade.missing.join(', ')}. Fix every one of them. ${best.grade.banned_hits.length ? 'Remove banned phrases: ' + best.grade.banned_hits.join(', ') + '.' : ''}` : '') },
    ];
    let content;
    try {
      const r = await dsChat(messages, { temperature: 0.6, max_tokens: 8000 });
      content = clean(r.content);
    } catch (e) {
      if (i === maxTries - 1) throw e;
      continue;
    }
    const grade = gradeEntry(id, content, { imagesDeferred: true });
    if (!best || grade.score > best.grade.score) best = { body: content, grade };
    // Accept only when text is fully clean: no banned phrases and the ONLY failing
    // criterion is images_law (deferred to the later Claude image pass).
    const textClean = grade.banned_hits.length === 0 &&
      grade.missing.every((m) => m === 'images_law');
    if (textClean) return { body: content, grade, tries: i + 1 };
  }
  return { body: best.body, grade: best.grade, tries: maxTries };
}

module.exports = { generateGradedBody, promptQA, promptTop10 };

// CLI
if (require.main === module) {
  (async () => {
    const id = process.argv[2];
    const kind = process.argv[3];
    const title = process.argv[4];
    const write = process.argv.includes('--write');
    if (!/^cg\d+$/.test(id || '') || !['top10', 'qa'].includes(kind) || !title) {
      console.error('usage: node _cg_ds_gen.js <cg####> <top10|qa> "<title>" [--write]');
      process.exit(1);
    }
    const { body, grade, tries } = await generateGradedBody(id, title, kind);
    if (write) fs.writeFileSync(`C:/Users/koryj/${id}_answer.md`, body);
    console.log(JSON.stringify({ id, kind, tries, score: grade.score, words: grade.word_count,
      banned: grade.banned_hits, missing: grade.missing, written: write }));
  })().catch((e) => { console.error('ERR', e.message); process.exit(1); });
}
