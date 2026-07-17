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
const { gateScore } = require('./content_gate.js');

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
function buildPrompt(question, body) {
  return [
    'You are rewriting a RevOps knowledge Q&A essay to a LOCKED golden template. Output ONLY the',
    'finished markdown body — no preamble, no explanation, no code fence around the whole thing.',
    '',
    'QUESTION (the page answers this): ' + question,
    '',
    'HARD REQUIREMENTS (all must be met — this is scored 13/13 and rejected below 13):',
    '1. Open with a line "## Direct Answer" then a COMPLETE, self-contained answer (a reader who',
    '   stops there is fully answered). Not a stub.',
    '2. >= 2500 words of REAL content. No filler, no repeated sentences, no restating the question.',
    '3. Multiple "## " H2 sections with genuine substance and specifics.',
    '4. EXACTLY 2 mermaid diagrams, each in a ```mermaid fenced block, valid renderable syntax',
    '   (flowchart TD or similar; no stray characters; every node/edge well-formed).',
    '5. A "## FAQ" section with AT LEAST 5 question/answer pairs (each question a "### " heading).',
    '6. A "## Sources" section with AT LEAST 5 real, verifiable external URLs (reputable sites).',
    '   NEVER cite pulserevops.com. Use real, well-known sources you are confident exist.',
    '7. A "## Related on PULSE" section (3-6 sibling-topic bullet links is fine).',
    '8. ZERO fabrication: no invented vendors, prices, stats, studies, or quotes. If unsure, keep it',
    '   general instead of inventing a specific.',
    '9. Do NOT include ANY image markdown (no ![...](...)). Images are placed separately by a human.',
    '',
    'Rewrite/expand the draft below to meet EVERY requirement. Keep what is good, fix what is weak,',
    'add real substance to reach the word count. Return ONLY the markdown body.',
    '',
    '--- CURRENT DRAFT ---',
    String(body || '').slice(0, 60000),
  ].join('\n');
}

function runClaude(prompt, timeoutMs) {
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
  if (!/\n?##\s/.test(out) || out.length < 400) return { ok: false, err: 'writer returned no usable markdown (' + out.length + ' chars) — body left unchanged' };
  return { ok: true, text: out };
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

  while (attempts < maxAttempts) {
    attempts++;
    const r = runClaude(buildPrompt(entry.question, body), opts.timeoutMs);
    if (!r.ok) { writerErr = r.err; break; }   // writer down (credits/auth/etc.) — stop; never corrupt
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
  entry.improved_by = writerErr ? 'skeleton-seed (writer offline)' : 'claude-code-cli';
  fs.writeFileSync(ep, JSON.stringify(entry, null, 1));

  return {
    ok: true, id,
    before: before.score, after: Math.max(bestScore, 0), pass: last.pass,
    words: last.wordCount, fails: last.fails, attempts,
    note: writerErr ? ('writer offline (' + writerErr + ') — seeded a skeleton; run Improve again once the Max-plan writer is back') : undefined,
  };
}

module.exports = { improveEntry, claudeBin };

// CLI: node improve_content.js <id>
if (require.main === module) {
  const id = process.argv[2];
  if (!id) { console.error('usage: node improve_content.js <entryId>'); process.exit(1); }
  improveEntry(id).then(r => { console.log(JSON.stringify(r, null, 1)); }).catch(e => { console.error(String(e)); process.exit(1); });
}
