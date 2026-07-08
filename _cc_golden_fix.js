// _cc_golden_fix.js — Claude Code agent golden-template fixer (owner 2026-07-06).
// When the DeepSeek rebuild leaves an entry non-compliant, escalate to a Claude Code agent
// (Max plan via _claude_chat) that rewrites the body to satisfy the EXACT golden template,
// verified by the real audit each pass. Loops until compliant or tries exhausted.
'use strict';
const { claudeChat } = require('./_claude_chat');
const { auditTop10GoldTemplate } = require('./_ranking_top10_gold_template');
const { auditQaGoldTemplate } = require('./_qa_gold_template');

const TOP10_RULES = `You are a meticulous editor fixing a PULSE "Top 10" ranking article to comply EXACTLY with the golden Top-10 template. Output ONLY the corrected full Markdown body — no preamble, no code fences around the whole thing.

REQUIRED ## H2 SECTIONS, in this exact order (no missing, no extra, no reordering):
1. ## Direct Answer  — names the Best Overall + Best Value picks in dense prose.
2. ## How We Ranked the Top 10  — weighted criteria bullets (NEVER numbered "## 1.").
3. ## 1. <Title> 🏆 BEST OVERALL   (rank 1 carries the 🏆 BEST OVERALL pill)
4. ## 2. <Title> 💎 BEST VALUE      (rank 2 carries the 💎 BEST VALUE pill)
5. ## 3. … through ## 10. …         (exactly 10 numbered ranked items, strict order 1..10)
6. (optional) a few contextual ## H2 sections
7. ## How to Choose … (or ## Which One Should You …)  — THIS section contains the ONE mermaid diagram
8. ## What to Look For
9. ## FAQ  — 5–6 **Question?** + answer pairs
10. ## Bottom Line
11. ## Sources  — 5–10 bulleted real named sources. THIS MUST BE THE VERY LAST SECTION.

HARD RULES:
- EXACTLY ONE \`\`\`mermaid\`\`\` diagram in the whole body (inside the How to Choose/Which section). Remove any extras. It must be render-safe.
- ## Sources is the FINAL section — nothing after it (no "Related on PULSE" after Sources; if a Related section exists, place it BEFORE Sources or fold its links into Sources).
- Do NOT fabricate: keep every real film/product, year, director, cast, runtime exactly as given.
- Preserve existing images and inline links. Keep the article's real content and depth.
- No TL;DR, no @@PRODUCT markers.`;

const QA_RULES = `You are a meticulous editor fixing a PULSE Q&A article to comply EXACTLY with the golden Q&A template. Output ONLY the corrected full Markdown body — no preamble, no code fences around the whole thing.

REQUIRED ## H2 SECTIONS, in this exact order:
1. ## Direct Answer  — FIRST content, dense answer prose. NO hero image before it.
2. 5–7 topical content ## H2 sections (NOT "## 1. Product" ranked items). Each = text block then a topical image, repeat.
3. (optional) ## Bottom Line
4. ## FAQ  — single header, 4–6 **Question?** + answer pairs
5. ## Sources  — 5–10 bulleted real named sources
6. ## Related on PULSE  — internal library link line (LAST)

HARD RULES:
- NO top hero image before ## Direct Answer. No stacked images (image immediately followed by image).
- No TL;DR, no @@PRODUCT / ranking pills, no live pollinations.ai URLs.
- Do NOT fabricate facts. Preserve real content, images, and inline links.`;

function stripFence(s) {
  return String(s || '').replace(/^﻿/, '').replace(/^\s*```(?:markdown|md)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
}

// ccGoldenFix(id, title, body, templateType, opts) → { body, compliant, tries, issues, changed }
async function ccGoldenFix(id, title, body, templateType, opts = {}) {
  const isQa = templateType === 'qa';
  const rules = isQa ? QA_RULES : TOP10_RULES;
  const audit = b => (isQa ? auditQaGoldTemplate(b, title, id) : auditTop10GoldTemplate(b, title));
  const tries = opts.tries || 3;
  const log = opts.log || (() => {});
  let cur = body;
  let last = audit(cur);
  if (last.compliant) return { body: cur, compliant: true, tries: 0, changed: false };

  for (let i = 1; i <= tries; i++) {
    const issues = (last.issues || []).join('; ');
    log(`  cc-fix ${id} try ${i}/${tries} — ${issues}`);
    let r;
    try {
      r = await claudeChat([
        { role: 'system', content: rules },
        { role: 'user', content: `Title: "${title}"\n\nThis article FAILS these golden-template checks (fix ALL of them, change nothing else of substance):\n${issues}\n\n--- CURRENT MARKDOWN BODY ---\n${String(cur).slice(0, 46000)}` },
      ], { timeoutMs: parseInt(process.env.CC_TIMEOUT_MS || '720000', 10) }); // 12 min (owner 2026-07-07 — 5 min timed out on big bodies)
    } catch (e) { log(`  cc-fix ${id} claude error: ${e.message}`); break; }
    const next = stripFence(r && r.content);
    if (!next || next.length < 800) { log(`  cc-fix ${id} — empty/short reply, keeping previous`); continue; }
    cur = next;
    last = audit(cur);
    if (last.compliant) { log(`  cc-fix ${id} ✅ compliant after ${i}`); return { body: cur, compliant: true, tries: i, changed: true }; }
  }
  return { body: cur, compliant: !!last.compliant, tries, issues: last.issues || [], changed: cur !== body };
}

module.exports = { ccGoldenFix };
