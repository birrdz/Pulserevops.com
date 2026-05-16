// One-shot bulk stamper — sets was_indexed_at = now on every entry in the
// library index. Used after a bulk IndexNow submission so the cards show
// the green ⊙ INDEXED badge across the whole library.

const { getStore } = require('@netlify/blobs');
const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const KEY = 'pulsemachine-writer-2026';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'POST only' };
  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'bad json' }) }; }
  if (body.key !== KEY) return { statusCode: 401, body: JSON.stringify({ ok: false, reason: 'bad key' }) };

  const tok = process.env.BLOBS_PAT;
  let store;
  try { store = getStore('pulse-machine-library'); }
  catch { store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok }); }

  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const ts = Date.now();
  idx.entries = (idx.entries || []).map(e => ({ ...e, was_indexed_at: ts }));
  await store.setJSON('_index.json', idx);

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ok: true,
      total_entries: idx.entries.length,
      stamped_at: ts,
    }),
  };
};
