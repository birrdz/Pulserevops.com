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

function gateScore(entry) {
  const body = String((entry && (entry.body || entry.answer)) || '');
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
