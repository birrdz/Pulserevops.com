// improve_content.js — on-demand "Improve to 13/13" using the bundled Claude Code CLI
// (headless, under the owner's Max plan — NO Anthropic API billing, per the Max-plan-only law).
//
// improveEntry(id) reads new/entries/<id>.json, asks Claude Code to rewrite the body to the
// golden Q&A template, validates with content_gate, writes the improved body back, and returns
// { ok, before, after, pass, fails, attempts }. Images are NEVER touched here — the human places
// those in the picker. This only fixes CONTENT.

'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { gateScore, wordCount } = require('./content_gate.js');
const { claudeUnbenched } = require('./_claude_bench.js');
const { surgicalGateFix: surgicalGateFixExt } = require('./_surgical_gate_fix.js');
// 🔒 DEEPSEEK ANTI-DRIFT / ANTI-DUPLICATE LAW (owner 2026-07-21) — canonical: ../_DEEPSEEK_ANTIDRIFT_LAW.md.
let antidrift = null; try { antidrift = require('./_ds_antidrift.js'); } catch (e) {}

const ENTRIES = path.join(__dirname, 'entries');

// Resolve the bundled Claude Code CLI (latest installed extension version).
function claudeBin() {
  const base = path.join(process.env.USERPROFILE || '', '.vscode', 'extensions');
  let hit = '';
  try {
    const dirs = fs.readdirSync(base).filter(d => /^anthropic\.claude-code-/i.test(d)).sort();
    for (const d of dirs) {
      const p = path.join(base, d, 'resources', 'native-binary', 'claude.exe');
      if (fs.existsSync(p)) hit = p; // last (highest-sorted) wins
    }
  } catch (e) {}
  return hit;
}

// Compact golden Q&A template + 13-point rubric — the LOCKED shape (GOLDEN_TEMPLATE_QA.md / q11133).
// 🥇 TOP-10 GOLD PROMPT (aq1158). The Q&A prompt below explicitly FORBIDS numbered headings — but
// a ranking page REQUIRES "## 1." … "## 10.". Routing every page through the Q&A shape is why
// Top-10 entries kept failing auditTop10GoldTemplate no matter how many times they were rewritten.
// Structure mirrors TOP10_SECTION_ORDER / TOP10_TEMPLATE_OUTLINE in _ranking_top10_gold_template.js.
function buildTop10Prompt(question, body) {
  return [
    'You are REWRITING a ranked "Top 10" page to its LOCKED golden template (gold reference: aq1158).',
    'The existing draft is MALFORMED — mine it for FACTS only, discard its structure, and rebuild the',
    'golden shape fresh. Output ONLY the finished markdown body — no preamble, no outer code fence.',
    '',
    'PAGE TITLE / QUESTION: ' + question,
    '',
    'THE SHAPE IS FIXED. Copy this skeleton exactly and change ONLY the content. Every ranked item is',
    'built the SAME WAY — three paragraphs and one image slot — so the page reads identically from #1 to #10.',
    '',
    '## Direct Answer',
    '<EXACTLY 3 paragraphs, 60-90 words each, answering the general question the title asks. Paragraph 1',
    ' names the Best Overall and Best Value picks. Paragraph 2 says what separates the top of the field',
    ' from the bottom. Paragraph 3 says who each end of the list is for. No bullets, no list, no diagram.>',
    '',
    '## How We Ranked These',
    '<weighted criteria as bullets, then ONE ```mermaid flowchart TD``` block showing how the criteria',
    ' combine into the ranking. NEVER number this heading as "## 1.".>',
    '',
    '## 1. <Name of the #1 pick> 🏆 BEST OVERALL',
    '<EXACTLY 3 paragraphs, 70-110 words each, about THIS pick and nothing else. Paragraph 1: what it is',
    ' and why it takes the top spot. Paragraph 2: how it performs in real use, with the concrete numbers',
    ' that justify the rank. Paragraph 3: its limits and who should skip it.>',
    '- **Price:** <real price or honest range>',
    '- **Pros:** <2-3 specifics>',
    '- **Cons:** <1-2 specifics>',
    '',
    '**Verdict:** <one sentence, and it MUST contain a number — the stat that earns this rank.>',
    '',
    '## 2. <Name of the #2 pick> 💎 BEST VALUE',
    '<same structure as #1: EXACTLY 3 paragraphs, then Price / Pros / Cons, then **Verdict:**>',
    '',
    '## 3. through ## 10.',
    '<REPEAT THE IDENTICAL BLOCK for ranks 3,4,5,6,7,8,9,10 — heading "## N. <Name>", then EXACTLY 3',
    ' paragraphs, then Price / Pros / Cons bullets, then a **Verdict:** line. Ten ranked sections total,',
    ' numbered 1 to 10 with no gaps and no reordering. Each one names a DIFFERENT real product/place.>',
    '',
    '## How to Choose',
    '<a short lead-in, then ONE ```mermaid flowchart TD``` block that walks a buyer to a pick.>',
    '',
    '## What to Look For',
    '<bullet checklist>',
    '',
    '## FAQ',
    '<5-6 pairs, each a bold "**Question?**" line then an answer paragraph of 40-80 words>',
    '',
    '## Bottom Line',
    '<recap of Best Overall + Best Value>',
    '',
    '## Sources',
    '<5-10 real, verifiable external URLs as bullets. NEVER cite pulserevops.com.>',
    '',
    '## Related on PULSE',
    '<3-6 sibling-topic bullet links>',
    '',
    'HARD RULES (violating any = rejected):',
    '- TEN ranked sections, headed "## 1." … "## 10.", in order, no gaps. This is the Top-10 template.',
    '- EXACTLY 3 paragraphs under every ranked heading. Not 1, not 5. The same everywhere.',
    '- EXACTLY 2 ```mermaid``` blocks on the page: one in "How We Ranked These", one in "How to Choose".',
    '  They must be DIFFERENT diagrams. Two is the requirement — not one, not three.',
    '- 2,600-3,400 words total. 2,600 is a hard FLOOR.',
    '- NO "## TL;DR". NO image markdown ![...](...) anywhere — each rank gets its image from its',
    '  @@PRODUCT slot, placed by the machine. Writing image markdown DUPLICATES every image.',
    '- ZERO fabrication: no invented vendors, prices, specs or quotes. If unsure, stay general.',
    '',
    'Return ONLY the finished markdown body in the exact shape above.',
    '',
    '--- RAW SOURCE DRAFT (mine for facts only; discard its structure) ---',
    String(body || '').slice(0, 60000),
  ].join('\n');
}

// Routes to the correct golden template. opts.template: 'top10' | 'qa' | 'style'.
function buildPromptFor(question, body, opts) {
  const t = String((opts && opts.template) || 'qa').toLowerCase();
  if (t === 'top10') return buildTop10Prompt(question, body);
  return buildPrompt(question, body);
}

function buildPrompt(question, body) {
  return [
    'You are REWRITING a RevOps knowledge Q&A page to a LOCKED golden template. The existing draft is',
    'MALFORMED — treat it as raw factual source material ONLY. DISCARD its structure, its headings, and',
    'especially its Direct Answer entirely, then build the golden shape FRESH from scratch. Do NOT preserve',
    'the old layout. Output ONLY the finished markdown body — no preamble, no explanation, no outer code fence.',
    '',
    'QUESTION (the page answers this): ' + question,
    '',
    'THE GOLDEN SHAPE — every entry is UNIFORM. Emit these sections in EXACTLY this order:',
    '',
    '1. "## Direct Answer" (MUST be the first line/H2). Then ONE short paragraph of 40-60 words that fully,',
    '   quotably answers the question — a reader who stops here is answered. NO image, NO mermaid, NO bullet',
    '   list, NO pills inside it. Just one tight paragraph. (This is the featured-snippet target — keep it short.)',
    '2. THREE to SIX "## " content sections with PLAIN topical headings (e.g. "## How the incentive changes',
    '   behavior"). NEVER numbered ("## 1." / "## 2.") — numbered headings are the Top-10 template and are',
    '   FORBIDDEN here. Each section >= 40 words of real, specific substance: concrete numbers/ranges,',
    '   step-by-steps, examples, trade-offs a practitioner could act on. Aim 2,000-3,000 words total across',
    '   these — 2,000 is the floor and 3,000 is a hard CEILING. Be thorough and specific, never padded.',
    '3. EXACTLY 2 mermaid diagrams, each in a ```mermaid fenced block with valid renderable syntax (flowchart TD',
    '   or similar; well-formed nodes/edges; no stray characters). Place each mermaid INSIDE one of the content',
    '   "## " sections above (NEVER inside the Direct Answer, NEVER before the first content section). The site',
    '   renderer automatically clusters them at the bottom of the page — you just author them inside content sections.',
    '4. "## Related questions" then 3-5 "### Question?" sub-questions, each answered in <= 50 words.',
    '5. "## FAQ" (unnumbered) with 5 to 6 pairs — each a "**Question?**" bold line followed by an answer paragraph.',
    '6. "## Sources" with 5 to 10 real, verifiable external URLs (reputable, well-known sites you are confident',
    '   exist). NEVER cite pulserevops.com. NEVER invent a source.',
    '7. "## Related on PULSE" — 3-6 sibling-topic bullet links.',
    '',
    'HARD RULES (violating any = rejected):',
    '- NO "## TL;DR" section, ever. NO image markdown at all (no ![...](...)) — a human places every image.',
    '- Direct Answer stays 40-60 words, one paragraph, no diagram. Mermaids ONLY inside content sections.',
    '- ZERO fabrication: no invented vendors, prices, stats, studies, or quotes. If unsure, stay general.',
    '- 2,000-3,000 words of REAL content. 2,000 is the hard floor and 3,000 is a hard CEILING —',
    '  do not exceed it. Comprehensive and useful, never padded, never repetitive.',
    '- Plain topical H2s only (never numbered). Keep every entry structurally identical to this shape.',
    '',
    'Return ONLY the finished markdown body in the exact section order above.',
    '',
    '--- RAW SOURCE DRAFT (mine for facts only; discard its structure) ---',
    String(body || '').slice(0, 60000),
  ].join('\n');
}

// opts.raw — accept a NON-article response (a bare paragraph, a single section) instead of
// requiring a full "## …" markdown body. The drip's shape-repair rung asks for one 45-60 word
// paragraph; without this the router rejected every such reply as "no usable markdown" and the
// repair could never run. The error-signature guard below still applies in raw mode, so an
// auth/billing line can never be mistaken for content.
function runClaude(prompt, timeoutMs, opts) {
  opts = opts || {};
  const bin = claudeBin();
  if (!bin) return { ok: false, err: 'Claude Code CLI not found (VSCode extension missing?)' };
  // LAW: writers ALWAYS run on the owner's Max ($200) plan — NEVER pay-as-you-go API billing.
  // Strip any metered key from the child env so the CLI uses the stored Max-plan subscription login.
  // A leftover ANTHROPIC_API_KEY (it's set in .env.local) was making the CLI bill a depleted balance
  // and return "Credit balance is too low", which then got saved as the entry body.
  const env = Object.assign({}, process.env);
  delete env.ANTHROPIC_API_KEY;
  delete env.ANTHROPIC_AUTH_TOKEN;
  delete env.CLAUDE_API_KEY;
  const r = spawnSync(bin, ['-p', '--output-format', 'text'], {
    input: prompt,
    encoding: 'utf8',
    timeout: timeoutMs || 300000,
    maxBuffer: 1024 * 1024 * 32,
    windowsHide: true,
    env,
  });
  if (r.error) return { ok: false, err: String(r.error.message || r.error) };
  const out = String(r.stdout || '').trim();
  const errText = String(r.stderr || '').trim();
  if (r.status && r.status !== 0) return { ok: false, err: 'writer failed (exit ' + r.status + '): ' + (out || errText).slice(0, 200) };
  if (!out) return { ok: false, err: 'empty output from Claude Code (' + errText.slice(0, 200) + ')' };
  // NEVER let an auth/billing/error line become the body — these are short plain-text lines, not answers.
  const ERR_SIG = /credit balance is too low|insufficient (?:credit|balance|funds)|invalid api key|not authenticated|authentication_error|please run .*login|usage limit reached|rate limit|quota|overloaded|too many requests/i;
  if (ERR_SIG.test(out) && out.length < 500) return { ok: false, err: 'writer unavailable: "' + out.slice(0, 140) + '"' };
  if (opts.raw) return { ok: true, text: out, engine: 'claude-code-cli' };
  if (!/\n?##\s/.test(out) || out.length < 400) return { ok: false, err: 'writer returned no usable markdown (' + out.length + ' chars) — body left unchanged' };
  return { ok: true, text: out, engine: 'claude-code-cli' };
}

// ── DeepSeek writer (PRIMARY, owner 2026-07-21) ─────────────────────────────
// Runs the DeepSeek client in a child process (new/_ds_run_once.js) so this
// stays synchronous like runClaude(). Returns the same { ok, text } shape.
// On failure it sets ranOut=true when DeepSeek has genuinely RUN OUT (daily cap
// hit, 402 balance depleted, or no key) so the router falls back to Claude Code.
function runDeepSeek(prompt, timeoutMs, temperature, opts) {
  opts = opts || {};
  const helper = path.join(__dirname, '_ds_run_once.js');
  if (!fs.existsSync(helper)) return { ok: false, err: 'deepseek helper missing', ranOut: false };
  // Anti-drift retry bumps temperature (+0.15) to break out of a near-duplicate — pass it to the child.
  const env = Object.assign({}, process.env);
  if (temperature != null && Number.isFinite(temperature)) env.DS_TEMPERATURE = String(temperature);
  const r = spawnSync(process.execPath, [helper], {
    input: prompt,
    encoding: 'utf8',
    timeout: timeoutMs || 300000,
    maxBuffer: 1024 * 1024 * 32,
    windowsHide: true,
    env,
  });
  if (r.error) return { ok: false, err: 'deepseek: ' + String(r.error.message || r.error), ranOut: false };
  const out = String(r.stdout || '').trim();
  const errText = String(r.stderr || '').trim();
  const OUT_SIG = /DS_DAILY_CAP|DeepSeek 402|insufficient|payment required|not set/i;
  if (r.status && r.status !== 0) {
    const ranOut = OUT_SIG.test(errText);
    return { ok: false, err: 'deepseek ' + (ranOut ? 'RAN OUT' : 'failed') + ': ' + errText.slice(0, 200), ranOut };
  }
  if (opts.raw) {
    if (!out) return { ok: false, err: 'deepseek returned nothing', ranOut: false };
    return { ok: true, text: out, engine: 'deepseek' };
  }
  if (!out || !/\n?##\s/.test(out) || out.length < 400) {
    return { ok: false, err: 'deepseek returned no usable markdown (' + out.length + ' chars)', ranOut: false };
  }
  return { ok: true, text: out, engine: 'deepseek' };
}

// Cursor Agent writer — local @cursor/sdk Agent.prompt via child process (owner 2026-07-26).
function runCursor(prompt, timeoutMs) {
  const helper = path.join(__dirname, '_cursor_run_once.js');
  if (!fs.existsSync(helper)) return { ok: false, err: 'cursor helper missing' };
  const r = spawnSync(process.execPath, [helper], {
    input: prompt,
    encoding: 'utf8',
    timeout: timeoutMs || 600000,
    maxBuffer: 1024 * 1024 * 32,
    windowsHide: true,
    env: process.env,
  });
  if (r.error) return { ok: false, err: 'cursor: ' + String(r.error.message || r.error) };
  const out = String(r.stdout || '').trim();
  const errText = String(r.stderr || '').trim();
  if (r.status && r.status !== 0) {
    return { ok: false, err: 'cursor failed: ' + (errText || out).slice(0, 220) };
  }
  if (!out || !/\n?##\s/.test(out) || out.length < 400) {
    return { ok: false, err: 'cursor returned no usable markdown (' + out.length + ' chars)' };
  }
  return { ok: true, text: out, engine: 'cursor-agent' };
}

// Writer router — DeepSeek FIRST, Claude Code fallback when DeepSeek runs out
// (owner 2026-07-21). Overrides: WRITER_ENGINE=claude → Claude only (old behavior);
// WRITER_ENGINE=deepseek → DeepSeek only, no fallback;
// WRITER_ENGINE=cursor → Cursor Agent only (hub option, owner 2026-07-26).
// WRITER_ENGINE values:
//   ccds     → CC + DS: Claude Code writes, DeepSeek picks up when CC fails (owner 2026-07-28)
//   claude   → Claude Code only, DS as safety net if CC is down
//   deepseek → DeepSeek only, no fallback
//   cursor   → Cursor Agent only
//   (unset)  → DeepSeek first, then CC, then Cursor
function runWriter(prompt, timeoutMs, temperature, opts) {
  opts = opts || {};
  const forced = String(process.env.WRITER_ENGINE || '').toLowerCase();
  // raw mode → the caller wants a fragment (e.g. one paragraph), not a full article. Route it
  // to the requested engine only; the full-article fallback chain does not apply.
  if (opts.raw) {
    if (forced === 'deepseek') return runDeepSeek(prompt, timeoutMs, temperature, opts);
    if (claudeUnbenched()) {
      const cc = runClaude(prompt, timeoutMs, opts);
      if (cc.ok) return cc;
    }
    return runDeepSeek(prompt, timeoutMs, temperature, opts);
  }

  // 🤖 CC + DS (owner 2026-07-28: "use cc and ds as writers" · "bring in ds when cannot reach 12/13").
  // CC leads. DS is the reinforcement — it runs whenever CC returns nothing usable. The score-based
  // half of the rule (CC produced a body but it graded under the bar) is enforced one level up by
  // the drip's supervisor ladder and the finisher's rescue rung, which re-call with WRITER_ENGINE
  // pinned to deepseek. Here we only handle "CC could not produce".
  if (forced === 'ccds') {
    if (claudeUnbenched()) {
      const cc = runClaude(prompt, timeoutMs);
      if (cc.ok) return cc;
      const ds1 = runDeepSeek(prompt, timeoutMs, temperature);
      if (ds1.ok) return ds1;
      return { ok: false, err: 'CC+DS both failed — cc:[' + cc.err + '] ds:[' + ds1.err + ']' };
    }
    return runDeepSeek(prompt, timeoutMs, temperature);
  }

  if (forced === 'claude') {
    if (claudeUnbenched()) {
      const cc = runClaude(prompt, timeoutMs);
      if (cc.ok) return cc;
      return runDeepSeek(prompt, timeoutMs, temperature);   // CC down → DS keeps the line moving
    }
    const ds0 = runDeepSeek(prompt, timeoutMs, temperature);
    if (ds0.ok) return ds0;
    return runCursor(prompt, timeoutMs);
  }
  if (forced === 'cursor') return runCursor(prompt, timeoutMs);

  const ds = runDeepSeek(prompt, timeoutMs, temperature);
  if (ds.ok || forced === 'deepseek') return ds;
  // DeepSeek down → Claude Code (unbenched 2026-07-28), then Cursor.
  if (claudeUnbenched()) {
    const cc = runClaude(prompt, timeoutMs);
    if (cc.ok) return cc;
  }
  const cu = runCursor(prompt, timeoutMs);
  if (cu.ok) return cu;
  return { ok: false, err: 'all writers failed — ds:[' + ds.err + '] cursor:[' + cu.err + ']' };
}

// Strip an accidental outer ```markdown fence if the model wrapped the whole body.
function unfence(t) {
  const m = String(t).match(/^```(?:markdown|md)?\s*\n([\s\S]*?)\n```\s*$/);
  return m ? m[1] : t;
}

// Clean golden-shape skeleton used when a body is empty/junk, so the writer expands STRUCTURE
// (not garbage) and a failed writer leaves a scaffold instead of an error string.
function skeleton(question) {
  const q = String(question || 'this topic').trim();
  return [
    '## Direct Answer', '',
    'DRAFT — replace with a complete, self-contained answer to: ' + q, '',
    '## Overview', '', 'Short version and key context.', '',
    '## Details', '', 'The substance: how it works, what drives it, the trade-offs.', '',
    '## What To Watch', '', 'Pitfalls, realistic ranges, how to sanity-check.', '',
    '## FAQ', '',
    '### ' + q, 'Answer.', '',
    '### What affects this the most?', 'Answer.', '',
    '## Sources', '', 'Add 5+ real external references.', '',
    '## Related on PULSE', '', '3-6 sibling-topic links.',
  ].join('\n');
}

async function improveEntry(id, opts) {
  opts = opts || {};
  const ep = path.join(ENTRIES, id + '.json');
  if (!fs.existsSync(ep)) return { ok: false, err: 'entry ' + id + ' not found' };
  const entry = JSON.parse(fs.readFileSync(ep, 'utf8'));
  const before = gateScore(entry);

  // A body that is empty, a stub, or a leftover error line ("Credit balance is too low") is JUNK:
  // start the writer from a clean golden skeleton, and let ANY real result beat it.
  const junkBody = !entry.body || String(entry.body).trim().length < 300
    || /credit balance is too low|insufficient (?:credit|balance)|invalid api key/i.test(String(entry.body));
  let body = junkBody ? skeleton(entry.question) : entry.body;

  let bestBody = body;
  let bestScore = junkBody ? -1 : before.score;   // junk must be beaten by anything, incl. the skeleton
  let last = before;
  let attempts = 0;
  const maxAttempts = opts.maxAttempts || 2;
  let writerErr = '';
  let lastEngine = '';

  while (attempts < maxAttempts) {
    attempts++;
    const r = runWriter(buildPrompt(entry.question, body), opts.timeoutMs);
    if (!r.ok) { writerErr = r.err; break; }   // writer down (credits/auth/etc.) — stop; never corrupt
    if (r.engine) lastEngine = r.engine;
    const cand = unfence(r.text);
    const g = gateScore({ body: cand });
    if (g.score > bestScore) { bestBody = cand; bestScore = g.score; last = g; body = cand; }
    if (g.pass) break;
  }

  // Persist ONLY if we ended with something better than the real content we started with.
  const improved = junkBody ? (bestBody !== entry.body) : (bestScore > before.score);
  if (!improved) {
    return { ok: false, err: writerErr || 'writer could not improve the content',
             before: before.score, after: before.score, attempts };
  }
  entry.body = bestBody;
  entry.gate_score = bestScore;
  entry.improved_at = new Date().toISOString();
  entry.improved_by = writerErr ? 'skeleton-seed (writer offline)' : (lastEngine || 'claude-code-cli');
  fs.writeFileSync(ep, JSON.stringify(entry, null, 1));

  return {
    ok: true, id,
    before: before.score, after: Math.max(bestScore, 0), pass: last.pass,
    words: last.wordCount, fails: last.fails, attempts,
    note: writerErr ? ('writer offline (' + writerErr + ') — seeded a skeleton; run Improve again once the Max-plan writer is back') : undefined,
  };
}

// surgicalGateFix — delegated to _surgical_gate_fix.js (structural only; no fake DA/FAQ/sources)
function surgicalGateFix(body, question) { return surgicalGateFixExt(body, question); }

// goldShapeOK(body) — enforces the LOCKED q11133 essay SHAPE (beyond the 13/13 gate): short Direct Answer,
// no mermaid inside it, plain (non-numbered) H2s, no TL;DR. The gate is blind to these; this catches them.
function goldShapeOK(body) {
  body = String(body || ''); if (!body) return false;
  const firstH2 = body.match(/^##\s+(.+)$/m);
  if (firstH2 && !/Direct Answer/i.test(firstH2[1])) return false;         // Direct Answer must be the first H2
  const daIdx = body.search(/^##\s*Direct Answer/im);
  const firstMermaid = body.indexOf('```mermaid');
  if (firstMermaid >= 0 && daIdx >= 0 && firstMermaid < daIdx) return false; // mermaid ABOVE the Direct Answer heading (top-of-page) → forbidden
  const m = body.match(/##\s*Direct Answer[^\n]*\n([\s\S]*?)(?=\n##\s|$)/i);
  if (!m) return false;                                                    // no Direct Answer section
  if (/```mermaid/.test(m[1])) return false;                              // mermaid INSIDE Direct Answer → renders high
  const daWords = m[1].replace(/[#>*`_\[\]()-]/g, ' ').split(/\s+/).filter(Boolean).length;
  if (daWords > 80) return false;                                          // Direct Answer too long (golden = 40-60 words)
  if (/^##\s+\d+\.\s/m.test(body)) return false;                          // numbered H2 = Top-10 leakage, forbidden here
  if (/##\s*TL;?\s*DR/i.test(body)) return false;                         // TL;DR forbidden in Q&A
  return true;
}

// rebuildToGate(question, body) — BLOB-SAFE writer loop for the Content Builder (owner 2026-07-17).
// Rebuilds toward 13/13 AND the golden SHAPE on the Max-plan CLI. Ranks candidates by gate score PLUS a
// golden-shape bonus, so a correctly-shaped rewrite beats an already-13/13-but-malformed original (the old
// `g.score > bestScore` test kept the malformed original because 13 is not > 13). Does NOT persist.
// === STUCK-SCORE ESCALATION (owner 2026-07-22) ===
// Stuck at 11/13 with the SAME failed point(s) two attempts running means the targeted-patch prompt isn't strong
// enough — the fixer keeps nibbling instead of rewriting. Detect the plateau and escalate to a from-scratch rewrite
// of ONLY the failing sections, with one bonus attempt. gateScore returns fails as [{n,name,detail}], so labelFails()
// flattens them to stable strings for both the plateau compare and the directive.
function labelFails(fails) {
  return (fails || []).map(f => (typeof f === 'string' ? f : ((f.n != null ? f.n + '. ' : '') + (f.name || '')).trim())).filter(Boolean);
}
function detailFails(fails) {
  return (fails || []).filter(f => f && typeof f === 'object' && f.detail)
    .map(f => '- ' + ((f.n != null ? f.n + '. ' : '') + (f.name || '')).trim() + ' — ' + f.detail);
}
function isPlateaued(st) {
  if (st.history.length < 2) return false;
  const a = st.history[st.history.length - 1];
  const b = st.history[st.history.length - 2];
  return a.score === b.score &&
    JSON.stringify([...a.failed].sort()) === JSON.stringify([...b.failed].sort());
}
function buildStuckBroadenDirective() {
  // Owner 2026-07-27: only when stuck below gate — not on first-pass writes.
  return [
    '# STUCK — BROADEN SCOPE + STYLE',
    'You are stuck below the publish gate. Do NOT write thinner or more generic.',
    '1. Keep answering the CORE question in Direct Answer and the main H2s.',
    '2. BROADEN: weave in closely adjacent angles just outside the narrow topic — related workflows,',
    '   neighboring use-cases, upstream/downstream effects, comparable industries, adjacent tools,',
    '   or side scenarios that still illuminate the answer.',
    '3. Broaden writing STYLE: vary sentence rhythm, section angles, and examples so it stops sounding templated.',
    '4. Do NOT wander into unrelated domains. Anchors + golden template shape still mandatory.',
  ].join('\n');
}
function buildEscalatedDirective(id, attempt, failed, details) {
  return [
    `# ESCALATED FIX — ${id} (attempt ${attempt})`,
    `Targeted patches did NOT move these rubric points: [${failed.join(", ")}]`,
  ].concat(details && details.length ? ['', 'WHAT EACH FAILED POINT REQUIRES:'].concat(details) : []).concat([
    `ORDERS:`,
    `1. REWRITE the section(s) owning each failed point from scratch. No patching.`,
    `2. Re-read each failed point's rubric definition verbatim before writing.`,
    `3. Passing sections are LOCKED — do not touch (no-re-coaching law).`,
    `4. Self-verify each failed point against its rubric definition before returning.`,
    `5. Because you are stuck: ` + buildStuckBroadenDirective().replace(/^# STUCK[^\n]*\n/, '').replace(/\n/g, ' '),
  ]).join("\n");
}

function rebuildToGate(question, body, opts) {
  opts = opts || {};
  // Publish bar (owner): 12 OR 13 both OK. Surgical + early-exit are ENGINE-AGNOSTIC (DS / Cursor / CC).
  const TARGET = (opts.targetScore != null) ? opts.targetScore : parseInt(process.env.GATE_MIN || '12', 10);
  const junkBody = !body || String(body).trim().length < 300
    || /credit balance is too low|insufficient (?:credit|balance)|invalid api key/i.test(String(body));
  let cur = junkBody ? skeleton(question) : body;
  // Mechanical patches first — same path for every writer engine (no model call).
  {
    const sx0 = surgicalGateFix(cur, question);
    if (sx0.fixed.length) {
      cur = sx0.body;
      try { console.error('[surgical] ' + (opts.id || question.slice(0, 40)) + ' pre-writer: ' + sx0.fixed.join(',')); } catch (e) {}
    }
  }
  const before = gateScore({ body: cur, question });
  const rank = (g, b) => (g.score || 0) + (goldShapeOK(b) ? 0.5 : 0);      // gate score + golden-shape bonus
  let bestBody = cur, bestRank = junkBody ? -1 : rank(before, cur), attempts = 0, writerErr = '';
  let maxAttempts = (opts.maxAttempts != null) ? opts.maxAttempts : 3;   // 0 allowed (surgical-only tests)
  const st = { history: [] };                // [{score, failed:[labels]}] per attempt → drives the plateau detector
  let escalated = false;                     // escalation fires at most once per page
  let surgicalOnly = false;

  // Already at publish bar after surgical → skip writer entirely (works offline / any engine).
  // opts.force (owner 2026-07-28) disables this shortcut: the caller wants the page genuinely REWRITTEN, not
  // waved through because a mechanical patch happened to reach the bar. Used by FORCE_REWRITE crews.
  if (!junkBody && before.score >= TARGET && !opts.force) {
    surgicalOnly = true;
    return {
      ok: true, body: cur, before: before.score, after: before.score,
      pass: !!before.pass, shapeOK: goldShapeOK(cur), fails: before.fails || [],
      words: before.wordCount || 0, attempts: 0, err: '',
      anchors: [], surgicalOnly: true, surgicalFixed: true,
    };
  }

  // 🔒 Anti-drift context: augment the golden prompt with anchors + banned phrases + a rotated skeleton +
  // scope fence (mechanisms 1/2/4/5). DeepSeek prose is then run through the post-gen anchor/dup gate (3).
  // ON by default; opts.antidrift===false disables (used by the safe internal test harness if needed).
  const id = opts.id || '';
  const AD = (opts.antidrift !== false) && antidrift;
  const stuckMode = !!(opts.stuck || opts.broaden); // owner: broaden adjacent scope/style only when stuck
  let aug = null, anchors = [];
  if (AD) {
    try {
      aug = antidrift.buildAugment(question, id, { broaden: stuckMode });
      anchors = aug.anchors || [];
    } catch (e) { aug = null; }
  }
  const DS_BASE_TEMP = 0.6, DS_BUMP = 0.15;      // matches _ds_lib default; retry nudges diversity up
  let acceptedBody = null;                       // best anti-drift-clean DeepSeek body → recorded to the dup store
  let driftSkip = null;                          // set when anti-drift skips the entry (2nd failure, no clean body)

  while (attempts < maxAttempts) {
    attempts++;
    // Use the golden template that matches THIS page (opts.template, set by the caller from
    // pickGoldTemplate). Without it every page — including ranked Top-10s — was rewritten into the
    // Q&A shape, whose rules explicitly forbid the numbered headings a Top-10 page must have.
    const base = buildPromptFor(question, cur, { template: opts.template });
    let prompt = aug ? (base + '\n' + aug.block) : base;
    if (stuckMode) prompt += '\n\n' + buildStuckBroadenDirective();
    // 🧗 PLATEAU → ESCALATE: same score + same failed points twice running. Stop nibbling; order a from-scratch
    // rewrite of only the failing sections and buy one extra attempt to land it.
    if (!escalated && isPlateaued(st)) {
      escalated = true; maxAttempts++;
      const lastFails = st.history[st.history.length - 1];
      prompt += '\n\n' + buildEscalatedDirective(id || question.slice(0, 48), attempts, lastFails.failed, lastFails.details);
      if (!stuckMode) prompt += '\n\n' + buildStuckBroadenDirective();
      try { console.error('[escalate] ' + (id || question.slice(0, 40)) + ' plateaued at ' + lastFails.score + '/13 on [' + lastFails.failed.join(', ') + '] → full-section rewrite + broaden (+1 attempt)'); } catch (e) {}
    }
    let r = runWriter(prompt, opts.timeoutMs);
    if (!r.ok) { writerErr = r.err; break; }
    let cand = unfence(r.text);

    // ── (3) POST-GEN DUPLICATE GATE + anchor check — DeepSeek prose ONLY (Claude/Cursor unchanged) ──
    if (AD && r.engine === 'deepseek') {
      const pg = antidrift.postGen(cand, { question, id, anchors });
      if (!pg.ok) {
        // retry ONCE with temperature +0.15 and the offending passage quoted back. NEVER loop > 2 total.
        const retryPrompt = prompt
          + '\n\nYOUR PREVIOUS DRAFT WAS REJECTED (' + pg.reason + '). Produce a DISTINCT rewrite.'
          + (pg.missing && pg.missing.length ? '\nYou omitted required anchors — you MUST include verbatim: ' + pg.missing.join(', ') + '.' : '')
          + (pg.passage ? '\nDo NOT resemble this passage; say it differently and freshly:\n"""\n' + pg.passage + '\n"""' : '');
        const r2 = runWriter(retryPrompt, opts.timeoutMs, DS_BASE_TEMP + DS_BUMP);
        if (r2.ok && r2.engine === 'deepseek') {
          const cand2 = unfence(r2.text);
          const pg2 = antidrift.postGen(cand2, { question, id, anchors });
          if (pg2.ok) { cand = cand2; r = r2; }
          else {                                 // 2nd anti-drift failure → skip this entry, log, stop.
            antidrift.logDrift(id, pg2.reason, pg2.sim);
            if (!acceptedBody) { driftSkip = { reason: pg2.reason, sim: pg2.sim }; writerErr = 'anti-drift skip: ' + pg2.reason; }
            break;
          }
        } else if (r2.ok) { cand = unfence(r2.text); r = r2; }   // fell back to Cursor/CC on retry — accept (DS-only gate)
        else {                                   // retry writer failed outright → treat as drift skip
          antidrift.logDrift(id, pg.reason, pg.sim);
          if (!acceptedBody) { driftSkip = { reason: pg.reason, sim: pg.sim }; writerErr = 'anti-drift skip: ' + pg.reason; }
          break;
        }
      }
    }

    // Surgical AFTER every writer (DS / Cursor / CC) — patches mermaid/FAQ/sources/related the model missed.
    {
      const sx = surgicalGateFix(cand, question);
      if (sx.fixed.length) {
        cand = sx.body;
        try { console.error('[surgical] ' + (id || question.slice(0, 40)) + ' post-' + (r.engine || 'writer') + ': ' + sx.fixed.join(',')); } catch (e) {}
      }
    }

    const g = gateScore({ body: cand, question });
    st.history.push({ score: g.score || 0, failed: labelFails(g.fails), details: detailFails(g.fails) });   // plateau trail
    const cr = rank(g, cand);
    if (cr > bestRank) { bestBody = cand; bestRank = cr; cur = cand; if (r.engine === 'deepseek') acceptedBody = cand; }
    if (g.score >= TARGET) break;                                          // publish bar met (12+ by default) — stop
    if (g.pass && goldShapeOK(cand)) break;                                // 13/13 AND correct golden shape → done
  }

  // Final surgical pass on best body (covers writer-fail / early-break cases for any engine).
  {
    const sxF = surgicalGateFix(bestBody, question);
    if (sxF.fixed.length) bestBody = sxF.body;
  }

  // On accept → record the best DeepSeek body's fingerprint to the last-200 pillar dup store.
  if (AD && acceptedBody && !driftSkip) { try { antidrift.recordAccepted(acceptedBody, antidrift.pillarOf(id), id); } catch (e) {} }

  const bg = gateScore({ body: bestBody, question });
  return { ok: !writerErr && bg.score >= 0, body: bestBody, before: before.score, after: Math.max(bg.score, 0),
           pass: !!bg.pass, shapeOK: goldShapeOK(bestBody), fails: bg.fails || [], words: bg.wordCount || 0, attempts, err: writerErr,
           anchors, driftSkip: driftSkip || undefined, surgicalOnly: surgicalOnly || undefined };
}

module.exports = { improveEntry, claudeBin, runClaude, runDeepSeek, runCursor, runWriter, buildPrompt, buildTop10Prompt, buildPromptFor, unfence, skeleton, gateScore, goldShapeOK, rebuildToGate, surgicalGateFix };

// CLI: node improve_content.js <id>
if (require.main === module) {
  const id = process.argv[2];
  if (!id) { console.error('usage: node improve_content.js <entryId>'); process.exit(1); }
  improveEntry(id).then(r => { console.log(JSON.stringify(r, null, 1)); }).catch(e => { console.error(String(e)); process.exit(1); });
}
