// Scrub all 10/10 entries to the q9501/q9502 benchmark. For each 10/10:
//   1. Check if it already meets the bespoke benchmark (length≥4000, mermaid≥1,
//      urls≥3, tables≥3, headings≥4). If yes, skip.
//   2. If not, call Gemini Pro (Workspace tier) to REWRITE it as a bespoke
//      researched answer matching q9501/q9502 style. Mermaid REQUIRED.
//   3. Save the rewritten answer (still at 10/10 — we're upgrading, not demoting).
//
// Uses Workspace Pro tier so rate limits effectively don't apply for cron-scale
// usage. ~5-12s per entry. ~907 entries × 8s = ~2 hours total.
//
// Usage:
//   GEMINI_API_KEY=... BLOBS_PAT=... node lab/scrub-all-tens-to-benchmark.js [--dry-run] [--limit=N]

const { getStore } = require('@netlify/blobs');
const TOKEN = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const GEMINI_KEY = process.env.GEMINI_API_KEY;
if (!TOKEN) { console.error('BLOBS_PAT required'); process.exit(1); }
if (!GEMINI_KEY) { console.error('GEMINI_API_KEY required'); process.exit(1); }
const DRY = process.argv.includes('--dry-run');
const limitArg = process.argv.find(a => a.startsWith('--limit='));
const LIMIT = limitArg ? parseInt(limitArg.split('=')[1], 10) : 0;

const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOKEN });

function meetsBenchmark(answer) {
  if (!answer) return false;
  const urls = (answer.match(/\bhttps?:\/\/[^\s)]+/g) || []).length;
  const tables = (answer.match(/^\|/gm) || []).length;
  const mermaid = (answer.match(/```mermaid/g) || []).length;
  const headings = (answer.match(/^## /gm) || []).length;
  return answer.length >= 4000 && mermaid >= 1 && urls >= 3 && tables >= 3 && headings >= 4;
}

const SYSTEM_PROMPT = `You are a senior B2B / GTM operator-researcher rewriting a knowledge-library answer for pulserevops.com. Your output must match the q9501/q9502 benchmark:

HARD REQUIREMENTS:
- 5,000-12,000 characters of substantive prose
- At least ONE \`\`\`mermaid block (REQUIRED — no exceptions)
- 4-8 markdown tables ("|" syntax) for benchmarks/comparisons
- 3-8 real source URLs (Pavilion, Bridge Group, OpenView, BLS, SBA, HBR, Forrester, McKinsey, Carta, Bessemer, NFIB, IBISWorld, etc — use REAL URLs)
- 4-8 section headings using "## "
- Real, named company examples that the operator-class would recognize
- Real numbers: ARR bands, comp bands, conversion %, retention %, cycle days
- Operator voice — no AI-tells like "I hope this helps" or "It's important to note"
- Acknowledge a counter-case / risk explicitly somewhere
- PRESERVE the original answer's core thesis and any unique insights — don't strip what's already good. Augment, restructure, add what's missing.

Return ONLY a single raw JSON object (no markdown fences, no prose outside the JSON):
{"answer": "...full upgraded markdown answer..."}`;

async function geminiRewrite(question, currentAnswer) {
  try {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + encodeURIComponent(GEMINI_KEY);
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: 'Question: ' + question + '\n\nCurrent answer (upgrade this — preserve good parts, fix gaps, ensure mermaid + tables + sources):\n\n' + (currentAnswer || '').slice(0, 8000) }] }],
        generationConfig: { temperature: 0.5, maxOutputTokens: 8192 },
      }),
    });
    if (!r.ok) return { ok: false, reason: r.status + ' ' + (await r.text()).slice(0, 200) };
    const j = await r.json();
    const text = j && j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts && j.candidates[0].content.parts[0] && j.candidates[0].content.parts[0].text;
    if (!text) return { ok: false, reason: 'empty content' };
    const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
    const parsed = JSON.parse(cleaned);
    if (!parsed.answer || parsed.answer.length < 3000) return { ok: false, reason: 'too short (' + (parsed.answer || '').length + ' chars)' };
    if (!meetsBenchmark(parsed.answer)) return { ok: false, reason: 'rewrite did not meet benchmark', answer: parsed.answer };
    return { ok: true, answer: parsed.answer };
  } catch (e) {
    return { ok: false, reason: 'exception: ' + String(e).slice(0, 200) };
  }
}

async function writeProgress(state) {
  try { await store.setJSON('_scrub_progress.json', state); } catch (_e) {}
}

(async () => {
  const idx = await store.get('_index.json', { type: 'json' });
  if (!idx || !Array.isArray(idx.entries)) { console.error('no index'); process.exit(1); }

  const tens = idx.entries
    .filter(r => /^q\d+$/.test(r.id) && r.quality_score === 10)
    .sort((a, b) => parseInt(String(a.id).slice(1), 10) - parseInt(String(b.id).slice(1), 10));

  console.log('Library has ' + tens.length + ' 10/10 entries. Scrubbing all to q9501/q9502 benchmark' + (DRY ? ' (DRY RUN)' : '') + (LIMIT ? ' (limit=' + LIMIT + ')' : '') + '...');
  const targets = LIMIT ? tens.slice(0, LIMIT) : tens;

  let skipped = 0, upgraded = 0, failed = 0;
  const failures = [];
  const t0 = Date.now();
  await writeProgress({ total: targets.length, processed: 0, skipped: 0, upgraded: 0, failed: 0, in_progress: true, last_run_ms: Date.now() });

  for (let i = 0; i < targets.length; i++) {
    const row = targets[i];
    const e = await store.get('answers/' + row.id + '.json', { type: 'json' });
    if (!e) { failed++; failures.push({ id: row.id, reason: 'missing-blob' }); continue; }
    const a = e.answer || '';

    if (meetsBenchmark(a)) {
      skipped++;
      if ((i+1) % 25 === 0) console.log('  [' + (i+1) + '/' + targets.length + '] skipped (meets benchmark): ' + row.id);
      await writeProgress({ total: targets.length, processed: i+1, skipped, upgraded, failed, in_progress: true, last_run_ms: Date.now() });
      continue;
    }

    console.log('  [' + (i+1) + '/' + targets.length + '] upgrading ' + row.id + ' (len=' + a.length + ', missing benchmark)...');
    const result = await geminiRewrite(e.question, a);
    if (!result.ok) {
      failed++;
      failures.push({ id: row.id, reason: result.reason });
      console.log('    FAIL: ' + result.reason);
      await writeProgress({ total: targets.length, processed: i+1, skipped, upgraded, failed, in_progress: true, last_run_ms: Date.now() });
      continue;
    }

    if (DRY) {
      upgraded++;
      console.log('    [DRY] would upgrade to ' + result.answer.length + ' chars');
    } else {
      e.answer = result.answer;
      e.last_modified_ms = Date.now();
      // Keep score at 10 — we're upgrading, not relevel. Polish_history stays.
      await store.setJSON('answers/' + row.id + '.json', e);
      upgraded++;
      console.log('    OK upgraded to ' + result.answer.length + ' chars');
    }
    await writeProgress({ total: targets.length, processed: i+1, skipped, upgraded, failed, in_progress: true, last_run_ms: Date.now() });

    // Pace — 1.5s between Gemini calls (Workspace Pro tier handles this easily but be polite)
    await new Promise(r => setTimeout(r, 1500));
  }

  await writeProgress({ total: targets.length, processed: targets.length, skipped, upgraded, failed, in_progress: false, last_run_ms: Date.now() });

  console.log('\n=== SCRUB COMPLETE ' + (DRY ? '(dry run) ' : '') + '===');
  console.log('Total processed: ' + targets.length);
  console.log('Skipped (already met benchmark): ' + skipped);
  console.log('Upgraded via Gemini: ' + upgraded);
  console.log('Failed: ' + failed);
  console.log('Elapsed: ' + ((Date.now()-t0)/60000).toFixed(1) + ' min');
  if (failures.length) {
    console.log('\nFirst 10 failures:');
    for (const f of failures.slice(0, 10)) console.log('  ' + f.id + ': ' + f.reason);
  }
})().catch(e => { console.error('FATAL', e); process.exit(1); });
