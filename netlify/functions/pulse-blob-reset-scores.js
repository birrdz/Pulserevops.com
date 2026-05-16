// One-time backfill — strips fake polished_at stamps and resets every entry
// to honest quality_score: 5. Polish loop earns score bumps from there.
// POST with key=pulsemachine-writer-2026 to run.

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
  const before = (idx.entries || []).filter(e => e.polished_at).length;

  idx.entries = (idx.entries || []).map(e => ({
    ...e,
    polished_at: null,
    quality_score: 5,
  }));
  await store.setJSON('_index.json', idx);

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ok: true,
      total_entries: idx.entries.length,
      stamps_stripped: before,
      all_now_at: 5,
      message: 'all entries reset to 5/10. polish loop earns each up.',
    }),
  };
};
