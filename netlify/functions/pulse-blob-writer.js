// Dumb blob writer — accepts {id, question, answer, tags, sources} via POST,
// writes to the pulse-machine-library blob store. NO LLM calls. NO Anthropic.
// Used by the cloud routine which generates entries on Anthropic's side
// (billed to user's $200 Claude.ai plan, not separate API).
const { getStore } = require('@netlify/blobs');
const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
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

  const { id, question, answer } = body;
  if (!id || !/^q\d+$/.test(id)) return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'bad id (must be qNNNN)' }) };
  if (!question || question.length < 8) return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'bad question' }) };
  if (!answer || answer.length < 800) return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'answer too short (min 800 chars)' }) };
  if (!/```mermaid/.test(answer)) return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'missing mermaid block' }) };

  const tok = process.env.BLOBS_PAT;
  let store;
  try { store = getStore('pulse-machine-library'); }
  catch { store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok }); }

  // Don't overwrite existing
  const existing = await store.get('answers/' + id + '.json', { type: 'json' });
  if (existing) return { statusCode: 409, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'id exists', id }) };

  const ts = Date.now();
  await store.setJSON('answers/' + id + '.json', {
    id,
    question,
    answer,
    tags: Array.isArray(body.tags) ? body.tags : [],
    sources: Array.isArray(body.sources) ? body.sources : [],
    ts,
    model: body.model || 'claude-opus-4-7',
    lab_run: body.lab_run || 'session-' + new Date(ts).toISOString().slice(0, 10),
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
      tags: body.tags || [],
      ts,
      polished_at: null,
      quality_score: 5,
    });
  }
  // q-IDs (the routine's auto-numbered entries) rank ahead of everything else
  // (visitor questions vq_*, hand-curated, etc.) so the public library shows
  // the freshest authored content first AND the routine's "find next id" grep
  // reliably hits a q-prefix at the top. Within q-IDs sort by numeric desc;
  // non-q-IDs fall back to ts desc.
  idx.entries.sort((a, b) => {
    const aIsQ = /^q\d+$/.test(a.id);
    const bIsQ = /^q\d+$/.test(b.id);
    if (aIsQ && !bIsQ) return -1;
    if (!aIsQ && bIsQ) return 1;
    if (aIsQ && bIsQ) {
      return parseInt(b.id.slice(1), 10) - parseInt(a.id.slice(1), 10);
    }
    return (b.ts || 0) - (a.ts || 0);
  });
  await store.setJSON('_index.json', idx);

  return {
    statusCode: 200,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, id, ts, total_now: idx.entries.length }),
  };
};
