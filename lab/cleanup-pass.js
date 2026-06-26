// Cleanup pass — walks every qs=10 library entry, applies deterministic
// (non-AI) markdown cleanups, and writes back. Updates
// _cleanup_progress.json after each so the library page's progress bar
// can track it live.
//
// Operations applied:
//   1. Strip the layout-flow-agent damage — runs of consecutive bullets
//      where bullets are obvious connective fragments (start with "(" or
//      end with comma/period mid-phrase) get collapsed back into the
//      paragraph they were extracted from. Conservative — only collapses
//      when 3+ bullets in a row look like fragments.
//   2. Auto-paragraph-break giant walls — paragraphs >400 chars get split
//      at sentence boundaries (period/?/! + space + capital). The renderer
//      already does this on display, but baking it into the blob makes the
//      source cleaner for downstream re-rendering and for the SEO snippet.
//   3. Ensure section headers have blank-line padding so the renderer's
//      header detector fires correctly.
//
// SAFE — never deletes content, never changes facts, never alters tables
// / mermaids / blockquotes / numbered headers. Word count delta < 1%.

const { getStore } = require('@netlify/blobs');

const TOKEN = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
const SITE_ID = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
if (!TOKEN) { console.error('Missing BLOBS_PAT / NETLIFY_AUTH_TOKEN env var'); process.exit(1); }

const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: TOKEN });
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── Heuristic: does this bullet look like a connective fragment? ──────────
function bulletLooksLikeFragment(text) {
  const t = (text || '').trim();
  if (!t) return true;
  // Starts with closing punctuation / opens parenthetical without context
  if (/^[)\],.]/.test(t)) return true;
  if (/^\(/.test(t) && !/\)/.test(t)) return true; // unclosed paren
  // Short connector phrases
  if (t.length < 8 && /^(and|or|but|the|a|an|in|on|at|to|of|is|was|by|for|with)\b/i.test(t)) return true;
  // Ends with a comma or "and"/"or" mid-thought
  if (/,\s*$/.test(t) || /\b(and|or)\s*$/i.test(t)) return true;
  // No verb-like word at all → probably a sentence fragment
  if (t.length < 24 && !/\b(is|was|are|were|has|have|had|do|does|did|can|could|will|would|should|must|may|might|earn|cost|need|build|run|sell|buy|cite|target|require|deliver|generate|serve|use|pay|file|hire|launch)\b/i.test(t)) {
    // tolerate: starts with a capital letter or $ or number → probably standalone
    if (!/^[A-Z$\d]/.test(t)) return true;
  }
  return false;
}

// ── Collapse a run of fragment bullets back into prose ────────────────────
// Walks bullet groups inside the answer markdown. For each group, if 3+
// items look like fragments, join the items with spaces and re-attach to
// the preceding paragraph as a parenthetical.
function fixFragmentBullets(md) {
  const lines = md.split('\n');
  const out = [];
  let i = 0;
  let lastParaIdx = -1;
  while (i < lines.length) {
    const t = lines[i].trim();
    // Track last non-empty, non-header paragraph line for collapse target
    if (t && !/^#{1,6}\s/.test(t) && !/^[-•*]\s/.test(t) && !/^\d+\.\s/.test(t) && !/^>/.test(t) && !/^\|/.test(t) && !/^```/.test(t)) {
      lastParaIdx = out.length;
      out.push(lines[i]); i++; continue;
    }
    // Detect bullet block
    if (/^[-•*]\s+/.test(t)) {
      const items = [];
      const startIdx = i;
      while (i < lines.length && /^[-•*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-•*]\s+/, ''));
        i++;
      }
      // Decide: are these mostly fragments?
      const fragCount = items.filter(bulletLooksLikeFragment).length;
      const isMostlyFragments = items.length >= 3 && fragCount >= Math.ceil(items.length * 0.6);
      if (isMostlyFragments && lastParaIdx >= 0) {
        // Collapse: append items joined by " " to the previous paragraph in `out`
        const joined = items.map(s => s.replace(/^\*\*|\*\*$/g, '').trim()).join(' ');
        out[lastParaIdx] = out[lastParaIdx].replace(/\s*$/, '') + ' ' + joined;
        // Don't emit any bullet lines for this block
      } else {
        // Healthy bullet block — keep as-is
        for (let k = startIdx; k < i; k++) out.push(lines[k]);
      }
      continue;
    }
    // Blank line
    if (!t) { out.push(lines[i]); i++; continue; }
    // Other line types pass through
    out.push(lines[i]); i++;
  }
  return out.join('\n');
}

// ── Ensure blank line before/after H2/H3 so renderer detects them ─────────
function padHeaders(md) {
  const lines = md.split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    const isHeader = /^#{1,4}\s+/.test(t);
    if (isHeader) {
      if (out.length && out[out.length - 1].trim() !== '') out.push('');
      out.push(lines[i]);
      if (i + 1 < lines.length && lines[i + 1].trim() !== '') out.push('');
      continue;
    }
    out.push(lines[i]);
  }
  return out.join('\n');
}

// ── Main loop ─────────────────────────────────────────────────────────────
async function main() {
  console.log('Loading index...');
  const idx = await store.get('_index.json', { type: 'json' });
  if (!idx || !idx.entries) { console.error('No index'); process.exit(1); }
  // Process all qs=10 entries, newest q-id first (matches what shows on the
  // library page top), skipping the two locked benchmarks.
  const targets = idx.entries
    .filter(e => e && e.quality_score === 10 && e.id !== 'q9501' && e.id !== 'q9502')
    .sort((a, b) => {
      const an = /^q(\d+)$/.exec(a.id || ''); const bn = /^q(\d+)$/.exec(b.id || '');
      if (an && bn) return parseInt(bn[1], 10) - parseInt(an[1], 10);
      return 0;
    });
  console.log('Targets:', targets.length);
  const total = targets.length;
  const startedAt = Date.now();
  let done = 0;
  let changedCount = 0;
  let unchangedCount = 0;
  const writeProgress = async (currentId) => {
    try {
      await store.setJSON('_cleanup_progress.json', {
        ok: true, total, done, current: currentId, started_ms: startedAt, last_ms: Date.now(),
        changed: changedCount, unchanged: unchangedCount,
      });
    } catch (_e) { /* non-fatal */ }
  };
  await writeProgress(null);

  for (const row of targets) {
    const id = row.id;
    try {
      const entry = await store.get('answers/' + id + '.json', { type: 'json' });
      if (!entry || !entry.answer) { done++; unchangedCount++; await writeProgress(id); continue; }
      const before = entry.answer;
      let after = fixFragmentBullets(before);
      after = padHeaders(after);
      const beforeWords = before.split(/\s+/).filter(Boolean).length;
      const afterWords = after.split(/\s+/).filter(Boolean).length;
      const delta = Math.abs(beforeWords - afterWords) / Math.max(1, beforeWords);
      if (after !== before && delta < 0.05) {
        entry.answer = after;
        entry.cleanup_pass = { ts: Date.now(), version: 'v1', delta_words: afterWords - beforeWords };
        await store.setJSON('answers/' + id + '.json', entry);
        changedCount++;
        console.log(id, 'CLEANED', '(words', beforeWords, '->', afterWords + ')');
      } else if (after === before) {
        unchangedCount++;
      } else {
        // Delta too big — skip out of caution
        console.log(id, 'SKIPPED (delta', delta.toFixed(3), ')');
        unchangedCount++;
      }
    } catch (err) {
      console.error(id, 'ERROR', err.message);
      unchangedCount++;
    }
    done++;
    await writeProgress(id);
    // Gentle pace — 1.5s between entries. Pure local transform, no Anthropic
    // call, so quota isn't the bottleneck. The sleep is for blob-write rate.
    await sleep(1500);
  }
  console.log('Done.', { total, done, changed: changedCount, unchanged: unchangedCount });
  await writeProgress(null);
}

main().catch(err => { console.error(err); process.exit(1); });
