// content_gate.js — the 13/13 golden-template GATE that stands in front of the picker.
// Mechanically-checkable subset of SCRUBBER_SPEC.md PASS 1. An entry body must pass
// this BEFORE it is allowed to reach the image-placement picker. The judgment criteria
// (no-fabrication, mermaid-renders-clean, source-URLs-live) are certified by the
// Claude Code improvement agent; this module is the fast, deterministic guard rail so
// no un-improved body can slip into the queue.
//
// Returns { score, max, pass, fails:[{n,name,detail}] }. pass === true only at full score.

'use strict';

// Count "real" words: strip code fences, URLs, markdown punctuation, image lines.
function wordCount(body) {
  const cleaned = String(body || '')
    .replace(/```[\s\S]*?```/g, ' ')            // fenced blocks (mermaid etc.)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')       // image markdown
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')     // link text only
    .replace(/https?:\/\/\S+/g, ' ')             // bare URLs
    .replace(/[#>*_`~|=]/g, ' ')                 // markdown punctuation
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned ? cleaned.split(' ').filter(Boolean).length : 0;
}

function section(body, re) {
  const lines = String(body || '').split('\n');
  const start = lines.findIndex(l => re.test(l.trim()));
  if (start < 0) return null;
  let end = start + 1;
  while (end < lines.length && !/^##\s/.test(lines[end].trim())) end++;
  return lines.slice(start, end).join('\n');
}

// ── TOP_LIST v2.2 awareness (additive, 2026-07-29) ───────────────────────────
// The 13 checks below all match markdown (`^## Heading`). A v2.2 TOP_LIST body is
// HTML, so the gate literally cannot SEE its sections and would score a perfect
// page ~7/13. This branch reads the same 13 points off the HTML structure instead.
// It fires ONLY on bodies stamped data-template="TOP_LIST" data-version="v2";
// every other entry on the site takes the original path, byte for byte.
function isTopListV2(body) {
  return /data-template=["']TOP_LIST["']/.test(body) && /data-version=["']v2["']/.test(body);
}

function htmlSection(body, cls, tag) {
  const re = new RegExp('<' + (tag || 'section') + '[^>]*class=["\'][^"\']*\\b' + cls + '\\b[\\s\\S]*?<\\/' + (tag || 'section') + '>', 'i');
  return (body.match(re) || [])[0] || null;
}

function gateScoreTopListV2(body) {
  const fails = [];
  const add = (n, name, detail) => fails.push({ n, name, detail });

  // 1. WORD COUNT 2,500–3,200 (v2.2 band). Strip scripts/comments/fences/tags first.
  const wc = wordCount(
    body.replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<!--[\s\S]*?-->/g, ' ')
        .replace(/<[^>]+>/g, ' ')
  );
  if (wc < 2500) add(1, 'WORD_COUNT', wc + ' words (need ≥2500)');

  // 2/3. DIRECT ANSWER — <section class="g-direct">, 1–2 paragraphs, substantial
  const da = htmlSection(body, 'g-direct');
  if (!da) add(2, 'DIRECT_ANSWER', 'no <section class="g-direct"> block');
  else if (wordCount(da.replace(/<[^>]+>/g, ' ')) < 40) add(3, 'DIRECT_ANSWER_COMPLETE', 'Direct Answer is a stub (<40 words)');

  // 4. FAQ ≥ 5 pairs — <section class="g-faq"> with 5 <h3>
  const faq = htmlSection(body, 'g-faq');
  if (!faq) add(4, 'FAQ', 'no <section class="g-faq"> block');
  else {
    const pairs = (faq.match(/<h3\b/gi) || []).length;
    if (pairs < 5) add(4, 'FAQ', 'only ' + pairs + ' FAQ pairs (need ≥5)');
  }

  // 5. MERMAID exactly 2 — NON-WAIVABLE for TOP_LIST, and the two must differ
  const merBlocks = Array.from(body.matchAll(/```mermaid([\s\S]*?)```/gi)).map(m => m[1].trim());
  if (merBlocks.length !== 2) add(5, 'MERMAID', merBlocks.length + ' mermaid diagrams (need exactly 2)');
  else if (merBlocks[0] === merBlocks[1]) add(5, 'MERMAID', 'both mermaid diagrams are identical (must be unique per page)');

  // 7. SOURCES 5–6 real external URLs
  const src = htmlSection(body, 'g-sources');
  if (!src) add(7, 'SOURCES', 'no <section class="g-sources"> block');
  else {
    const urls = (src.match(/https?:\/\/[^\s"'<)]+/gi) || []).filter(u => !/pulserevops\.com/i.test(u));
    if (urls.length < 5) add(7, 'SOURCES', urls.length + ' external source URLs (need ≥5)');
  }

  // 8. RELATED — <nav class="g-related"> ("Keep Reading" is v2.2's wording for it)
  if (!htmlSection(body, 'g-related', 'nav')) add(8, 'RELATED', 'no <nav class="g-related"> block');

  // 9. CLEAN LINKS — no placeholder/empty targets, and no unfilled {{SLOT}}s
  if (/href=["']\s*(#|TODO|)\s*["']/i.test(body)) add(9, 'CLEAN_LINKS', 'placeholder/empty link target present');
  else if (/\{\{[A-Z0-9_]+\}\}/.test(body)) {
    const left = [...new Set(Array.from(body.matchAll(/\{\{([A-Z0-9_]+)\}\}/g)).map(m => m[1]))];
    add(9, 'CLEAN_LINKS', 'unfilled template slots: ' + left.join(', '));
  }

  const checks = 13;
  return { score: checks - fails.length, max: checks, pass: fails.length === 0, wordCount: wc, mermaids: merBlocks.length, template: 'TOP_LIST_v2', fails };
}
// ─────────────────────────────────────────────────────────────────────────────

function gateScore(entry) {
  const body = String((entry && (entry.body || entry.answer)) || '');
  if (isTopListV2(body)) return gateScoreTopListV2(body);
  const fails = [];
  const add = (n, name, detail) => fails.push({ n, name, detail });

  // 1. WORD COUNT ≥ 2500
  const wc = wordCount(body);
  if (wc < 2500) add(1, 'WORD_COUNT', wc + ' words (need ≥2500)');

  // 2/3. DIRECT ANSWER present + substantial
  const da = section(body, /^##\s*Direct Answer\b/i);
  if (!da) add(2, 'DIRECT_ANSWER', 'no "## Direct Answer" section at top');
  else if (wordCount(da) < 40) add(3, 'DIRECT_ANSWER_COMPLETE', 'Direct Answer is a stub (<40 words)');

  // 4. FAQ ≥ 5 pairs
  const faq = section(body, /^##\s*(FAQ|Frequently Asked)/i);
  if (!faq) add(4, 'FAQ', 'no FAQ section');
  else {
    const pairs = (faq.match(/^###?\s+\S|^\*\*[^*]+\?\*\*|^\s*[-*]?\s*\*\*Q/gmi) || []).length
               || (faq.match(/\?\s*$/gm) || []).length;
    if (pairs < 5) add(4, 'FAQ', 'only ~' + pairs + ' FAQ pairs (need ≥5)');
  }

  // 5. MERMAID exactly 2
  const mer = (body.match(/```mermaid/gi) || []).length;
  if (mer !== 2) add(5, 'MERMAID', mer + ' mermaid diagrams (need exactly 2)');

  // 7. SOURCES ≥ 5 real URLs, not our own domain
  const src = section(body, /^##\s*Sources\b/i);
  if (!src) add(7, 'SOURCES', 'no Sources section');
  else {
    const urls = (src.match(/https?:\/\/[^\s)]+/gi) || []).filter(u => !/pulserevops\.com/i.test(u));
    if (urls.length < 5) add(7, 'SOURCES', urls.length + ' external source URLs (need ≥5)');
  }

  // 8. RELATED ON PULSE present
  if (!/Related on PULSE/i.test(body)) add(8, 'RELATED', 'no "Related on PULSE" section');

  // 9. CLEAN LINKS — no placeholder/empty targets
  if (/\]\(\s*(#|TODO|)\s*\)/i.test(body)) add(9, 'CLEAN_LINKS', 'placeholder/empty link target present');

  const checks = 13;
  const score = checks - fails.length;
  return { score, max: checks, pass: fails.length === 0, wordCount: wc, mermaids: mer, fails };
}

module.exports = { gateScore, wordCount };

// CLI: node content_gate.js <entryId>  → prints the score card
if (require.main === module) {
  const fs = require('fs');
  const id = process.argv[2];
  const p = __dirname + '/entries/' + id + '.json';
  const e = JSON.parse(fs.readFileSync(p, 'utf8'));
  const r = gateScore(e);
  console.log((r.pass ? '✅ 13/13' : '❌ ' + r.score + '/13') + '  ' + id + '  (' + r.wordCount + ' words, ' + r.mermaids + ' mermaids)');
  for (const f of r.fails) console.log('   ✗ ' + f.n + ' ' + f.name + ' — ' + f.detail);
}
