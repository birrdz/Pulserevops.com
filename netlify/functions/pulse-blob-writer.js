// Dumb blob writer — accepts {id, question, answer, tags, sources} via POST,
// writes to the pulse-machine-library blob store. NO LLM calls. NO Anthropic.
// Used by the cloud routine which generates entries on Anthropic's side
// (billed to user's $200 Claude.ai plan, not separate API).
const { getStore } = require('@netlify/blobs');
const { pingIndexNowQ } = require('./lib/indexnow-ping-q');
const { pingIndexNowEntry } = require('./lib/indexnow-ping-entry');
const { capitalizeQuestion, capitalizeSentencesInMarkdown } = require('./lib/text-capitalize');
const { ensureImages } = require('./lib/ensure-entry-images');
const { gradeEntry } = require('./lib/grade-entry');
const { VISITOR_ANSWER } = require('./lib/anthropic-models');
const { applyPillarSeo } = require('./lib/ensure-pillar-seo');
const { blobsPat, netlifySiteId } = require('./lib/load-env');
const SITE_ID = netlifySiteId();
// Shared secret to prevent random POSTs flooding the library. Change if leaked.
const KEY = 'pulsemachine-writer-2026';

function corsHeaders() {
  return { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: corsHeaders(), body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: corsHeaders(), body: 'POST only' };

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'bad json' }) }; }

  if (body.key !== KEY) return { statusCode: 401, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'bad key' }) };

  let { id, question, answer } = body;
  if (!id || !/^q\d+$/.test(id)) return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'bad id (must be qNNNN)' }) };
  question = capitalizeQuestion(question);
  answer = capitalizeSentencesInMarkdown(answer);
  if (!question || question.length < 8) return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'bad question' }) };
  if (!answer || answer.length < 800) return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'answer too short (min 800 chars)' }) };
  if (!/```mermaid/.test(answer)) return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'missing mermaid block' }) };

  const deferImages = !!(body.defer_images || (body.skip_images && /^q\d+$/.test(id)));
  const ts = Date.now();

  // Ship-first law (q####): publish text now; DDG turtle backfills cover later.
  if (!deferImages && !body.skip_images) {
    const img = await ensureImages(id, question, answer);
    answer = img.body;
    if (!img.audit.compliant && !body.force_images) {
      const g = gradeEntry(id, answer);
      return {
        statusCode: 422,
        headers: corsHeaders(),
        body: JSON.stringify({ ok: false, reason: 'images_law', needs: img.audit.needs, score: g.score }),
      };
    }
  }

  const tok = blobsPat();
  let store;
  try { store = getStore('pulse-machine-library'); }
  catch { store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok }); }

  // Don't overwrite existing
  const existing = await store.get('answers/' + id + '.json', { type: 'json' });
  if (existing) return { statusCode: 409, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'id exists', id }) };

  const baseTags = Array.isArray(body.tags) ? body.tags : [];
  const seoBase = applyPillarSeo(id, question, {
    id,
    question,
    answer,
    tags: baseTags,
    sources: Array.isArray(body.sources) ? body.sources : [],
    ts,
    model: body.model || VISITOR_ANSWER,
    lab_run: body.lab_run || 'session-' + new Date(ts).toISOString().slice(0, 10),
  });
  const stamped = seoBase.entry;
  await store.setJSON('answers/' + id + '.json', {
    ...stamped,
    // Honest defaults: a fresh write starts at 5/10. Polish passes earn each
    // step up to 10. polished_at is only set when quality_score reaches 10.
    polished_at: null,
    quality_score: 5,
    polish_history: [],
    // Snapshot of the 5/10 baseline kept until the entry hits 10/10. Used by
    // the 9→10 gate to verify the polished version is meaningfully more
    // detailed AND more intelligent than the original — not just longer.
    // Purged once 10/10 verification passes, so storage stays bounded.
    baseline_answer_v5: body.answer,
    ...(deferImages ? { images_deferred_at: ts, images_deferred_note: 'ddg-turtle-backfill' } : {}),
  });

  // Update index — race-tolerant: re-read after a tiny stagger, dedupe before write.
  // Two concurrent POSTs would otherwise read same baseline and last-write-wins drops one.
  await new Promise(r => setTimeout(r, 200 + Math.floor(Math.random() * 300)));
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const indexed = new Set((idx.entries || []).map(e => e.id));
  if (!indexed.has(id)) {
    idx.entries.unshift({
      id,
      question,
      tags: stamped.tags || baseTags,
      ts,
      polished_at: null,
      quality_score: 5,
    });
  }
  // TRUE CHRONOLOGICAL order for the persisted _index.json: newest `ts`
  // first, all id types (q####, vq_*, hand-curated) intermixed. A freshly
  // written entry appears at the top and ages downward as newer ones arrive.
  idx.entries.sort((a, b) => (b.ts || 0) - (a.ts || 0));
  await store.setJSON('_index.json', idx);

  // Every new publish: IndexNow (all engines) + was_indexed_at — required by publish rule.
  let indexResult = null;
  if (!body.skip_index) {
    const indexRow = (idx.entries || []).find((e) => e && e.id === id);
    indexResult = await pingIndexNowEntry(id, store, indexRow);
    if (!indexResult?.ok && /^q\d+$/.test(id)) {
      indexResult = await pingIndexNowQ(id, store);
    }
  }

  return {
    statusCode: 200,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ok: true,
      id,
      ts,
      total_now: idx.entries.length,
      indexed: !!indexResult?.ok,
      index: indexResult,
      images_deferred: deferImages,
    }),
  };
};
