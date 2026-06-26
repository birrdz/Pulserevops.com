// Polish endpoint — bumps an entry's quality_score by +1 (capped at 10) and
// appends a polish_history record. The actual quality work (research,
// fact-check, adversarial pass) happens in the wake-loop on Opus; this
// endpoint just records the verified bump after the work is done.
//
// POST body shape:
//   { key, id, polish_note, new_answer? }
//   - key: shared secret
//   - id: q1234
//   - polish_note: short string describing what was verified/added at this step
//   - new_answer: (optional) replacement answer text if the polish revised the body
//
// Score progression:
//   5/10 → 6/10  add real source citations to currently unsourced claims
//   6/10 → 7/10  WebSearch-verified specific numbers replace generic %s
//   7/10 → 8/10  add adversarial counter-argument section
//   8/10 → 9/10  cross-link to 4+ topically relevant q-IDs
//   9/10 → 10/10 comprehensive fact-check, every claim sourced. polished_at set.

const { getStore } = require('@netlify/blobs');
const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const KEY = 'pulsemachine-writer-2026';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: corsHeaders(), body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: corsHeaders(), body: 'POST only' };

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'bad json' }) }; }

  if (body.key !== KEY) return { statusCode: 401, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'bad key' }) };

  const { id, polish_note, set_score } = body;
  // Accept knowledge-library ids (qNNNN), sales-training ids (stNNNN),
  // industry-KPI ids (ikNNNN — the Industry KPIs content pillar), and
  // visitor-asked questions (vq_xxxxx — queue-hash-suffixed). Visitor
  // questions render under /knowledge/vq_* and live in the same blob store.
  if (!id || !/^(?:q\d+|st\d+|ik\d+|vq_[a-z0-9]+)$/i.test(id)) return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'bad id (must be qNNNN, stNNNN, ikNNNN, or vq_xxxx)' }) };
  if (!polish_note || polish_note.length < 8) return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'polish_note required (min 8 chars)' }) };

  const tok = process.env.BLOBS_PAT;
  let store;
  try { store = getStore('pulse-machine-library'); }
  catch { store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok }); }

  const entry = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!entry) return { statusCode: 404, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'entry not found' }) };

  // Index is source of truth for quality_score (per-entry blobs may carry
  // stale values from before the score-system rebuild). Fall back to per-entry
  // value if index doesn't have one.
  const idxForScore = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const idxRow = (idxForScore.entries || []).find(x => x && x.id === id);
  const currentScore = (idxRow && typeof idxRow.quality_score === 'number')
    ? idxRow.quality_score
    : (typeof entry.quality_score === 'number' ? entry.quality_score : 5);

  // Two modes:
  //   - set_score: 1-10 → first-touch rating from the polish loop's assessment
  //     pass. Used to honestly grade legacy entries before incrementing them.
  //   - default: +1 increment, capped at 10. Used for normal polish steps.
  let newScore;
  if (typeof set_score === 'number' && set_score >= 1 && set_score <= 10) {
    newScore = Math.round(set_score);
  } else {
    if (currentScore >= 10) {
      // v15.2 gold-format pathway: qs=10 entries can still receive a fresh
      // body + format_v stamp (the gold-format conversion) without a qs bump.
      // Requires new_answer ≥800 chars AND format_v string. Logs a polish
      // event with from=10, to=10 so the live map + activity feed surface it.
      const goldNewAnswer = typeof body.new_answer === 'string' ? body.new_answer : '';
      const goldFormatV   = typeof body.format_v === 'string' ? body.format_v : '';
      if (goldNewAnswer.length >= 800 && goldFormatV.length > 0) {
        const tsGold = Date.now();
        const goldHistory = Array.isArray(entry.polish_history) ? entry.polish_history.slice() : [];
        goldHistory.push({ ts: tsGold, from: 10, to: 10, note: polish_note || 'gold-format' });
        const goldEntry = { ...entry, answer: goldNewAnswer, format_v: goldFormatV, polish_history: goldHistory, polished_at: tsGold };
        delete goldEntry.baseline_answer_v5;
        await store.setJSON('answers/' + id + '.json', goldEntry);
        // Mirror format_v to index
        const idxG = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
        const iG = (idxG.entries || []).findIndex(e => e.id === id);
        if (iG >= 0) {
          idxG.entries[iG] = { ...idxG.entries[iG], format_v: goldFormatV, last_modified_ms: tsGold };
          await store.setJSON('_index.json', idxG);
        }
        // Log polish event so live map + activity feed see it
        try {
          const evsG = (await store.get('_polish_events.json', { type: 'json' })) || { events: [] };
          evsG.events.push({ ts: tsGold, id, from: 10, to: 10, note: polish_note || 'gold-format' });
          if (evsG.events.length > 1000) evsG.events = evsG.events.slice(-1000);
          await store.setJSON('_polish_events.json', evsG);
        } catch (_e) {}
        return { statusCode: 200, headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
          body: JSON.stringify({ ok: true, id, quality_score: 10, format_v: goldFormatV, gold_format: true, from: 10, to: 10 }) };
      }
      return { statusCode: 200, headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: true, id, quality_score: 10, message: 'already at 10/10' }) };
    }
    newScore = Math.min(10, currentScore + 1);
  }

  // Substantive-bump enforcement — bumps to scores 6/7/8/9 represent real
  // content additions (sources, verified numbers, counter-args, cross-links)
  // and MUST come with a revised answer body. The 9→10 step is allowed
  // without a body change since it's a fact-check gate, not a content add.
  // set_score (rating mode) is exempt because it's an assessment, not a bump.
  const substantiveBumpToScores = new Set([6, 7, 8, 9]);
  const isSubstantiveBump = (typeof set_score !== 'number') && substantiveBumpToScores.has(newScore);
  if (isSubstantiveBump) {
    const newAnswer = typeof body.new_answer === 'string' ? body.new_answer : '';
    if (!newAnswer || newAnswer.length < 800) {
      return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({
        ok: false, reason: 'new_answer required for substantive bumps to ' + newScore + '/10 (min 800 chars)',
      }) };
    }
    if (newAnswer.trim() === (entry.answer || '').trim()) {
      return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({
        ok: false, reason: 'new_answer is identical to current entry answer — substantive bump requires real content changes',
      }) };
    }
  }

  // ── Word-cap guard (added 2026-05-18) ──────────────────────────────────
  // Hard server-side cap to stop bloated drafts from landing in the blob.
  // q9670 + q9671 both overshot to 14-16K because the polish-helper passes
  // new_answer straight through with no length check — agents would write
  // a clean baseline, then ADD content at each ladder rung, and the final
  // 10/10 answer would be 50%+ over target. This rejects writes that
  // exceed the format-appropriate cap. Cap is tag-driven: format tags
  // (60-min-meeting / 2-hour-deep-dive / etc.) bump the limit for longer
  // sales-training formats; absent any format tag, q-IDs cap at 10,500
  // and st-IDs cap at 11,000 (small buffer for the 60-min default).
  if (typeof body.new_answer === 'string' && body.new_answer.length >= 800) {
    const tags = Array.isArray(body.tags) ? body.tags
               : Array.isArray(entry.tags) ? entry.tags : [];
    const FORMAT_CAPS = {
      '60-min-meeting':     10500,
      '2-hour-deep-dive':   16000,
      'half-day-workshop':  22000,
      'full-day-training':  30000,
      '2-day-offsite':      45000,
      '1-week-bootcamp':    70000,
    };
    const isTraining = /^st\d+$/i.test(id) || tags.indexOf('sales-training') !== -1;
    let wordCap;
    const formatTag = tags.find(t => FORMAT_CAPS[t] !== undefined);
    if (formatTag)        wordCap = FORMAT_CAPS[formatTag];
    else if (isTraining)  wordCap = 11000;  // default sales-training cap
    else                  wordCap = 10500;  // q-entry cap
    const wordCount = body.new_answer.trim().split(/\s+/).length;
    if (wordCount > wordCap) {
      return { statusCode: 413, headers: corsHeaders(), body: JSON.stringify({
        ok: false,
        reason: 'new_answer is ' + wordCount + ' words; exceeds hard cap of ' + wordCap
              + (formatTag ? ' for format "' + formatTag + '"' : ' (default for ' + (isTraining ? 'sales-training' : 'q-entry') + ')')
              + '. Trim, then resubmit. Length must match scope — do not pad ladder rungs with new sections.',
        word_count: wordCount,
        word_cap: wordCap,
        over_by: wordCount - wordCap,
      }) };
    }
  }
  const ts = Date.now();
  const polishHistory = Array.isArray(entry.polish_history) ? entry.polish_history.slice() : [];
  polishHistory.push({ ts, from: currentScore, to: newScore, note: polish_note });

  // 9 → 10 hard gate: requires the polish_note to include a sub-Agent
  // attestation from the wake-loop. The wake-loop spawns a fresh-context
  // Claude sub-Agent that compares baseline vs current and returns
  // pass/fail; only on 'pass' does the wake-loop POST here with the
  // attestation marker. No external graders, no paid services.
  if (newScore === 10 && (typeof set_score !== 'number')) {
    const noteHasAttestation = /SUBAGENT_VERIFIED|SUB-AGENT VERIFIED/i.test(polish_note || '');
    if (!noteHasAttestation) {
      return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({
        ok: false,
        reason: 'polish_note must include "SUBAGENT_VERIFIED" — the wake-loop must run a fresh Claude sub-Agent against the 10/10 rubric before bumping. Stays at ' + currentScore + '/10.',
      }) };
    }
  }

  // Capture baseline for legacy entries — if this is the entry's first
  // substantive bump (5→6) and no baseline exists yet, snapshot the CURRENT
  // body as the 5/10 reference. This lets the 9→10 grader compare on legacy
  // entries that pre-date the blob writer's baseline-tracking change.
  let baselineToKeep = entry.baseline_answer_v5;
  const isFirstSubstantiveBump = (newScore === 6) && (typeof set_score !== 'number') && !baselineToKeep;
  if (isFirstSubstantiveBump) {
    baselineToKeep = entry.answer;
  }

  const updatedEntry = {
    ...entry,
    answer: typeof body.new_answer === 'string' && body.new_answer.length >= 800 ? body.new_answer : entry.answer,
    quality_score: newScore,
    polish_history: polishHistory,
    polished_at: newScore >= 10 ? ts : null,
    // Purge the baseline once the entry hits 10/10 — no version bloat.
    baseline_answer_v5: newScore >= 10 ? undefined : baselineToKeep,
  };
  if (newScore >= 10) delete updatedEntry.baseline_answer_v5;
  await store.setJSON('answers/' + id + '.json', updatedEntry);

  // Mirror score + polished_at into the index entry too (so list views show current score without per-entry fetch)
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const i = (idx.entries || []).findIndex(e => e.id === id);
  if (i >= 0) {
    idx.entries[i] = {
      ...idx.entries[i],
      quality_score: newScore,
      polished_at: newScore >= 10 ? ts : null,
      // Stamp last_modified_ms so the IndexNow batch picks this entry up on
      // its next run and re-submits the URL to search engines with the new
      // content. Without this, polished entries never re-crawl.
      last_modified_ms: ts,
    };
    await store.setJSON('_index.json', idx);
  }

  // Append a polish event so the ticker can compute polish-per-hour rate.
  // Trim log to the last 1000 events to keep size bounded.
  try {
    const evs = (await store.get('_polish_events.json', { type: 'json' })) || { events: [] };
    evs.events.push({ ts, id, from: currentScore, to: newScore });
    if (evs.events.length > 1000) evs.events = evs.events.slice(-1000);
    await store.setJSON('_polish_events.json', evs);
  } catch (_e) {}

  // IndexNow re-ping: only when the entry reaches 10/10 (was: every ladder
  // step, which fired 5× per polish and burned function invocations). The
  // scheduled batch handles intermediate states; the final-state ping here
  // matches what Google/Bing actually want to know about.
  if (newScore >= 10) {
    try {
      fetch('https://pulserevops.com/.netlify/functions/pulse-machine-indexnow-batch-background', { method: 'POST' })
        .catch(() => {});
    } catch (_e) {}
  }

  return {
    statusCode: 200,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, id, quality_score: newScore, from: currentScore, polished: newScore >= 10 }),
  };
};
