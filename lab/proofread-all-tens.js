// One-shot proofreader for every 10/10 entry. Uses Gemini 2.0 Flash (separate
// quota from the polish grader so this doesn't block the running cycle loop).
// Reports back with: per-entry verdict, top recurring issues across the set,
// and a final pass/flag summary. Writes detailed results to a JSON file
// alongside the script.

const { getStore } = require('@netlify/blobs');
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
if (!TOKEN) { console.error('BLOBS_PAT required'); process.exit(1); }
const PROOFREAD_URL = 'https://pulserevops.com/.netlify/functions/pulse-proofread';
const KEY = 'pulsemachine-writer-2026';
const RPM_PACE_MS = 4500; // 15 RPM Gemini 2.0 Flash free tier, leave headroom

const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOKEN });
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Proofreader rubric — broader than the polish 9→10 gate. Flags AI tells,
// hallucinations, internal contradictions, missing sections, broken cross-links.
const RUBRIC = `You are a senior proofreader for a RevOps/SaaS knowledge library entry. Read the entry carefully and flag QUALITY issues a careful editor would catch.

Score 1-10. Return ONLY a single raw JSON object (no markdown fences, no prose):
{"score": <1-10 integer>, "verdict": "pass"|"flag", "issues": ["short specific issue 1", "short specific issue 2", "..."]}

Flag (verdict="flag") if ANY of these are true:
1. Internal contradiction (a number stated one way in prose contradicts the table/diagram).
2. Hallucinated vendor or product (a company name that doesn't exist or isn't in this category).
3. Missing core section (no Direct Answer, no Bottom Line, no sources, no counter-argument, no cross-links).
4. Severe AI tells: "leverage" as verb, "delve into", "synergy", "best-in-class", "ever-evolving", "in today's fast-paced world".
5. Direct Answer addresses wrong question.
6. Cross-links to q-IDs that look fabricated or don't match the topic.
7. Broken markdown formatting (unrendered raw markdown, unclosed code fences, malformed tables).
8. Factually wrong by an order of magnitude (e.g. "SaaS gross margin 30%" when it's typically 70-80%).

Pass (verdict="pass") if the entry is solid — comprehensively researched, structured, sourced, with risks acknowledged. Minor weaknesses ARE acceptable for pass; flag only on clear issues per the list above.

Be specific in the issues list — quote the exact problem language when possible. Max 5 issues per entry.`;

async function proofreadOne(id) {
  const r = await fetch(PROOFREAD_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: KEY, id }),
  });
  const j = await r.json().catch(() => ({}));
  if (!j || !j.ok) return { ok: false, reason: 'proofread ' + r.status + ' ' + (j.reason || '') };
  return { ok: true, body: j };
}

(async () => {
  console.log('[' + new Date().toISOString() + '] proofread-all-tens · loading index...');
  const idx = await store.get('_index.json', { type: 'json' });
  const tens = (idx.entries || []).filter(e => (e.quality_score || 5) >= 10 && /^q\d+$/.test(String(e.id)));
  console.log('  found ' + tens.length + ' entries at 10/10 to proofread');
  console.log('  estimated time: ' + Math.round(tens.length * RPM_PACE_MS / 60000) + ' min (4.5s/entry · 15 RPM Gemini free tier)');

  const results = [];
  const issueCounts = {};
  let passed = 0, flagged = 0, errored = 0;

  for (let i = 0; i < tens.length; i++) {
    const row = tens[i];
    const r = await proofreadOne(row.id);
    if (!r.ok) {
      errored++;
      results.push({ id: row.id, error: r.reason });
      console.log('[' + new Date().toISOString() + ']   ' + (i+1) + '/' + tens.length + ' ' + row.id + ' ERROR · ' + r.reason);
    } else {
      const verdict = r.body.verdict === 'pass' ? 'pass' : 'flag';
      if (verdict === 'pass') passed++; else flagged++;
      const issues = Array.isArray(r.body.issues) ? r.body.issues : [];
      results.push({ id: row.id, question: row.question, score: r.body.score, verdict, issues });
      console.log('[' + new Date().toISOString() + ']   ' + (i+1) + '/' + tens.length + ' ' + row.id + ' ' + verdict + ' score=' + r.body.score + (issues.length ? ' · ' + issues.slice(0, 2).join(' | ').slice(0, 140) : ''));
      // Tally issue themes for the summary.
      for (const issue of issues) {
        const themes = ['hallucinated vendor', 'contradiction', 'missing section', 'AI tells', 'wrong question', 'cross-link', 'formatting', 'order of magnitude', 'leverage', 'delve', 'synergy', 'best-in-class', 'ever-evolving', 'fast-paced', 'unrendered', 'malformed', 'no Direct Answer', 'no Bottom Line', 'no sources', 'no counter'];
        for (const theme of themes) {
          if (issue.toLowerCase().includes(theme.toLowerCase())) {
            issueCounts[theme] = (issueCounts[theme] || 0) + 1;
            break;
          }
        }
      }
    }
    if (i < tens.length - 1) await sleep(RPM_PACE_MS);
  }

  // Write detailed results to JSON file alongside this script.
  const outPath = path.join(__dirname, 'proofread-results-' + new Date().toISOString().slice(0, 10) + '.json');
  fs.writeFileSync(outPath, JSON.stringify({ ts: Date.now(), total: tens.length, passed, flagged, errored, issueCounts, results }, null, 2));

  // Print summary.
  console.log('\n=== PROOFREAD COMPLETE ===');
  console.log('Total proofread: ' + tens.length);
  console.log('  Passed:  ' + passed + ' (' + (passed/tens.length*100).toFixed(1) + '%)');
  console.log('  Flagged: ' + flagged + ' (' + (flagged/tens.length*100).toFixed(1) + '%)');
  console.log('  Errored: ' + errored);
  console.log('\nTop issue themes across the set:');
  const sortedIssues = Object.entries(issueCounts).sort((a, b) => b[1] - a[1]);
  for (const [theme, count] of sortedIssues.slice(0, 15)) {
    console.log('  ' + theme.padEnd(28) + ' ' + count);
  }
  console.log('\nTop flagged entries (worst scores first):');
  const sortedFlags = results.filter(r => r.verdict === 'flag').sort((a, b) => (a.score || 0) - (b.score || 0));
  for (const r of sortedFlags.slice(0, 15)) {
    console.log('  ' + r.id + ' score=' + r.score + ' · ' + (r.issues || []).slice(0, 2).join(' | ').slice(0, 140));
  }
  console.log('\nFull results written to: ' + outPath);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
