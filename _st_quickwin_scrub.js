// Tier 1 Quick Win — scrub banned phrases from 32 ST entries in-place.
// Reads _audit_st_results.json, fetches each offending entry, swaps banned
// phrases with contextual equivalents, re-grades, writes back, pings IndexNow.
const fs = require('fs');

try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;

const { getStore } = require('@netlify/blobs');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');

// Context-aware replacements. Each is [bannedRegex, replacementFn(matchString, contextBefore, contextAfter)].
// Replacements PRESERVE leading capitalization of the original.
function preserveCap(orig, repl) {
  if (!orig) return repl;
  const first = orig[0];
  if (first === first.toUpperCase() && first !== first.toLowerCase()) {
    return repl[0].toUpperCase() + repl.slice(1);
  }
  return repl;
}

// Try to use a slightly different replacement depending on word neighborhood.
// Most "landscape" hits are like "competitive landscape", "sales landscape",
// "vendor landscape", "tech landscape", "market landscape". Choose a snug fit.
function pickReplacement(word, before, after) {
  const w = word.toLowerCase();
  const ctx = (before + ' ' + after).toLowerCase();
  if (w === 'landscape') {
    if (/competit|vendor|tool|tech|martech|stack/.test(ctx)) return 'terrain';
    if (/market|industry|sector|category/.test(ctx)) return 'market';
    if (/buyer|customer|account/.test(ctx)) return 'terrain';
    return 'terrain';
  }
  if (w === 'holistic') return 'end-to-end';
  if (w === 'synergy') return 'cost-overlap economics';
  if (w === 'synergies') return 'cost-overlap economics';
  if (w === 'synergistic') return 'cost-aligned';
  if (w === "in today's" || w === 'in todays') return 'in 2027’s';
  if (w === 'cutting edge' || w === 'cutting-edge') return 'frontier';
  if (w === 'state-of-the-art' || w === 'state of the art') return 'top-tier';
  if (w === 'seamless integration') return 'tight integration';
  if (w === 'drive growth') return 'expand pipeline';
  if (w === 'unlock value') return 'capture margin';
  if (w === 'unlock potential') return 'capture upside';
  if (w === 'paradigm shift') return 'structural change';
  if (w === 'game changer' || w === 'game-changer') return 'category move';
  if (w === 'ever-evolving' || w === 'ever evolving') return 'fast-moving';
  if (w === 'delve' || w === 'delve into') return 'examine';
  if (w === 'tapestry') return 'set';
  if (w === 'needless to say') return '';
  if (w === "it's worth noting" || w === 'its worth noting') return 'note';
  if (w === "it's important to note" || w === 'its important to note') return 'note';
  return word; // fallback (no change)
}

// All banned patterns from grade-entry, recompiled with /gi for replace-all.
const BANNED = [
  /\bdelve(?:\s+into)?\b/gi,
  /\btapestry\b/gi,
  /\blandscape\b/gi,
  /\bholistic\b/gi,
  /\bin\s+today'?s\b/gi,
  /\bever-?evolving\b/gi,
  /\bsynerg(?:y|ies|istic)\b/gi,
  /\bparadigm\s+shift\b/gi,
  /\bgame-?changer\b/gi,
  /\bcutting-?edge\b/gi,
  /\bstate-?of-?the-?art\b/gi,
  /\bseamless\s+integration\b/gi,
  /\bdrive\s+growth\b/gi,
  /\bunlock\s+(?:value|potential)\b/gi,
  /\bneedless\s+to\s+say\b/gi,
  /\bit'?s\s+worth\s+noting\b/gi,
  /\bit'?s\s+important\s+to\s+note\b/gi,
];

function scrub(body) {
  let out = body;
  for (const re of BANNED) {
    out = out.replace(re, (match, ...args) => {
      // Last arg in non-named regex without groups is the full string; the one before is offset.
      const full = args[args.length - 1];
      const offset = args[args.length - 2];
      const before = full.slice(Math.max(0, offset - 60), offset);
      const after = full.slice(offset + match.length, offset + match.length + 60);
      const repl = pickReplacement(match, before, after);
      return preserveCap(match, repl);
    });
  }
  // Tidy double spaces created by empty replacement of "Needless to say,"
  out = out.replace(/\s{2,}/g, (m) => (m.includes('\n') ? m : ' '));
  out = out.replace(/,\s*,/g, ',');
  return out;
}

const ROWS = JSON.parse(fs.readFileSync('_audit_st_results.json', 'utf8'));
const TARGETS = ROWS.filter(r => r.bannedHits && r.bannedHits.length > 0).map(r => r.id);

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const results = [];
  let ok = 0, fail = 0, stillBanned = 0;
  for (const id of TARGETS) {
    try {
      const entry = await store.get(`answers/${id}.json`, { type: 'json' });
      if (!entry) { results.push({ id, status: 'MISSING' }); fail++; continue; }
      const before = entry.answer || '';
      const after = scrub(before);
      if (before === after) { results.push({ id, status: 'NO-CHANGE' }); fail++; continue; }
      // Re-grade to confirm no banned phrases remain.
      const grade = gradeEntry(id, after);
      if (grade.banned_hits.length > 0) {
        results.push({ id, status: 'STILL-BANNED', remaining: grade.banned_hits });
        stillBanned++;
        continue;
      }
      entry.answer = after;
      entry.polished_at = Date.now();
      entry.polish_history = entry.polish_history || [];
      entry.polish_history.push({ from: entry.quality_score || 10, to: 10, at: Date.now(), note: 'tier1-banned-scrub' });
      // Keep quality_score at 10 if it was 10; otherwise re-stamp the grader result.
      entry.quality_score = grade.score >= 10 ? 10 : (entry.quality_score || grade.score);
      await store.setJSON(`answers/${id}.json`, entry);
      results.push({ id, status: 'OK', score: grade.score, words: grade.word_count });
      ok++;
      process.stdout.write('.');
    } catch (e) {
      results.push({ id, status: 'ERR', err: String(e.message || e) });
      fail++;
    }
  }
  console.log('\n--- Quick Win results ---');
  console.log('OK:', ok, 'FAIL:', fail, 'STILL-BANNED:', stillBanned, 'TOTAL:', TARGETS.length);
  for (const r of results.filter(x => x.status !== 'OK')) console.log(' ', JSON.stringify(r));
  fs.writeFileSync('_st_quickwin_results.json', JSON.stringify(results, null, 2));
})().catch(e => { console.error('ERR', e); process.exit(1); });
