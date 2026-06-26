// Rewrite one library Q&A with Gemini/LLM on Netlify (GEMINI_API_KEY in env).

const { generateAnswer } = require('./economy-answer-generate');
const { validateEconomyAnswer } = require('./economy-answer-quality');
const { capitalizeSentencesInMarkdown } = require('./text-capitalize');

async function setInFlight(store, id, action, score) {
  const cur = (await store.get('_in_flight.json', { type: 'json' })) || {};
  const workers = (cur.workers || []).filter((w) => w && w.id !== id);
  workers.push({ id, action, score: score ?? null, ts: Date.now() });
  await store.setJSON('_in_flight.json', { ids: workers.map((w) => w.id), workers, ts: Date.now() });
  await store.setJSON('_current_activity.json', { action, target: id, score: score ?? null, ts: Date.now() });
}

async function clearInFlight(store, id) {
  const cur = (await store.get('_in_flight.json', { type: 'json' })) || {};
  const workers = (cur.workers || []).filter((w) => w && w.id !== id);
  await store.setJSON('_in_flight.json', { ids: workers.map((w) => w.id), workers, ts: Date.now() });
  if (!workers.length) {
    await store.setJSON('_current_activity.json', { action: 'idle', target: id, score: null, ts: Date.now() });
  }
}

async function polishEntryById(store, id, opts = {}) {
  const dryRun = !!opts.dryRun;
  const blob = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!blob?.question) {
    return { ok: false, status: 404, reason: 'entry not found', id };
  }

  await setInFlight(store, id, 'polishing', blob.quality_score || 5);

  let answer;
  let source;
  try {
    ({ answer, source } = await generateAnswer(blob.question, {
      preferLlm: true,
      llmRequired: true,
      preferGrok: opts.preferGrok !== false,
    }));
  } catch (err) {
    await clearInFlight(store, id);
    const errMsg = String(err.message || err);
    const hint = errMsg.includes('429')
      ? 'Gemini quota exceeded — add GROK_API_KEY or XAI_API_KEY on Netlify, or wait for quota reset.'
      : errMsg.includes('no grok key')
        ? 'Add GROK_API_KEY or XAI_API_KEY on Netlify (Site settings → Environment variables).'
        : 'Check GEMINI_API_KEY, GROK_API_KEY, or GROQ_API_KEY on Netlify.';
    return {
      ok: false,
      status: 502,
      reason: 'llm_failed',
      id,
      question: blob.question,
      error: errMsg.slice(0, 400),
      hint,
    };
  }

  answer = capitalizeSentencesInMarkdown(answer);
  const fin = validateEconomyAnswer(answer);
  if (!fin.ok) {
    await clearInFlight(store, id);
    return {
      ok: false,
      status: 422,
      reason: 'quality_gate',
      id,
      words: fin.words,
      mermaidOk: fin.mermaidOk,
      source,
    };
  }

  if (!dryRun) {
    const ts = Date.now();
    const labRun = source && String(source).startsWith('llm-') ? 'economy-llm-polish-v1' : 'economy-polish-v1';
    await store.setJSON('answers/' + id + '.json', {
      ...blob,
      answer,
      lab_run: labRun,
      source,
      quality_polish_at: ts,
      last_modified_ms: ts,
      baseline_answer_v5: blob.baseline_answer_v5 || blob.answer,
    });
    const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
    const i = (idx.entries || []).findIndex((x) => x?.id === id);
    if (i >= 0) {
      idx.entries[i] = { ...idx.entries[i], last_modified_ms: ts };
      await store.setJSON('_index.json', idx);
    }
  }

  await clearInFlight(store, id);

  return {
    ok: true,
    status: 200,
    id,
    question: blob.question,
    source,
    words: fin.words,
    dryRun,
    url: 'https://pulserevops.com/knowledge/' + id,
  };
}

module.exports = { polishEntryById, setInFlight, clearInFlight };
