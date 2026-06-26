// Lean full-library index for whole-site search + full listing.
// Returns EVERY entry as compact {i:id, q:question, p:pillarPath} — no tags/body,
// so the whole 20k+ library fits well under Netlify's 6MB function response limit
// (library-list bloats past 6MB because it includes 20 tags/row).
// GET /.netlify/functions/pulse-search-index  → { ok, total, entries:[{i,q,p}] }
const { getStore } = require('@netlify/blobs');
const { libraryEntryPublicUrl } = require('./lib/library-entry-url');

const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

exports.handler = async () => {
  try {
    const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
    const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: tok });
    const idx = await store.get('_index.json', { type: 'json' });
    const out = [];
    for (const e of (idx.entries || [])) {
      if (!e || !e.id || !e.question) continue;
      // public path (pretty pillar URL, falls back to /knowledge/<id>)
      let p = '/knowledge/' + e.id;
      try { const u = libraryEntryPublicUrl(e); if (u) p = u.replace(/^https?:\/\/[^/]+/, ''); } catch (_) {}
      out.push({ i: e.id, q: e.question, p });
    }
    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=300', 'access-control-allow-origin': '*' },
      body: JSON.stringify({ ok: true, total: out.length, entries: out }),
    };
  } catch (e) {
    return { statusCode: 200, headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' }, body: JSON.stringify({ ok: false, error: String(e.message || e), entries: [] }) };
  }
};
