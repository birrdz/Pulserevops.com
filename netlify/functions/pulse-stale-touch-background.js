// Weekly stale-touch — finds the oldest 10/10 entry (by polished_at), refreshes
// its polished_at + last_modified_ms timestamps to "now", then fires the
// IndexNow batch so search engines re-crawl it. Pure metadata bump, no body
// edit. Bumps Google's "dateModified" signal to fight ranking decay on aging
// entries. Scheduled weekly via netlify.toml.

const { getStore } = require('@netlify/blobs');
const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

function initStore() {
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  try { return getStore('pulse-machine-library'); }
  catch { return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok }); }
}

exports.handler = async () => {
  const store = initStore();
  const idx = await store.get('_index.json', { type: 'json' });
  if (!idx || !Array.isArray(idx.entries)) {
    return { statusCode: 200, body: 'no index' };
  }
  // Pick the 5 oldest 10/10 entries by polished_at (or last_modified_ms if newer)
  const tens = idx.entries
    .filter(e => e.quality_score === 10 && e.polished_at)
    .map(e => ({ ...e, _staleTs: Math.max(e.polished_at || 0, e.last_modified_ms || 0) }))
    .sort((a, b) => a._staleTs - b._staleTs)
    .slice(0, 5);
  if (!tens.length) return { statusCode: 200, body: 'no 10/10s' };

  const ts = Date.now();
  const touched = [];
  for (const t of tens) {
    const entry = await store.get('answers/' + t.id + '.json', { type: 'json' });
    if (!entry) continue;
    entry.polished_at = ts;
    entry.last_touched_at = ts;
    await store.setJSON('answers/' + t.id + '.json', entry);
    const i = idx.entries.findIndex(e => e.id === t.id);
    if (i >= 0) {
      idx.entries[i].polished_at = ts;
      idx.entries[i].last_modified_ms = ts;
    }
    touched.push(t.id);
  }
  await store.setJSON('_index.json', idx);

  // Fire IndexNow batch fire-and-forget so the touched URLs get re-crawled
  try {
    fetch('https://pulserevops.com/.netlify/functions/pulse-machine-indexnow-batch-background', { method: 'POST' }).catch(() => {});
  } catch (_e) {}

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, touched, ts }),
  };
};
