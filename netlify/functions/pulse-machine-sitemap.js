// ════════════════════════════════════════════════════════════════════════
// pulse-machine-sitemap — dynamic sitemap that always reflects the live
// state of the autonomously growing knowledge library.
//
// Mounted at /sitemap-knowledge.xml via netlify.toml redirect. The main
// /sitemap.xml stays static (covers the rest of the site); this is a
// secondary sitemap specifically for the library.
// ════════════════════════════════════════════════════════════════════════

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const SITE = 'https://pulserevops.com';

function initStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) { try { return getStore({ name: 'pulse-machine-library', siteID: sid, token: tok }); } catch (e) { return null; } }
  try { return getStore('pulse-machine-library'); } catch (e) { return null; }
}

function isoDate(ms) {
  return new Date(ms || Date.now()).toISOString().slice(0, 10);
}
function escXml(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

exports.handler = async () => {
  const store = initStore();
  let entries = [];
  let latestTs = Date.now();
  if (store) {
    try {
      const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
      entries = (idx.entries || []).slice(0, 5000);
      if (entries.length && entries[0].ts) latestTs = entries[0].ts;
    } catch (e) {}
  }

  let body = '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    // The hub itself — change-freq tracks the live library cadence
    + '<url><loc>' + SITE + '/knowledge.html</loc>'
    + '<lastmod>' + isoDate(latestTs) + '</lastmod>'
    + '<changefreq>hourly</changefreq><priority>0.92</priority></url>\n';

  // Per-entry indexable URLs — each library entry has its own server-rendered
  // page at /knowledge/<id> with full content, JSON-LD, and OG cards. Each
  // gets indexed independently by Google, qualifies for its own snippet.
  entries.forEach(e => {
    if (!e || !e.id) return;
    body += '<url><loc>' + SITE + '/knowledge/' + escXml(e.id) + '</loc>'
      + '<lastmod>' + isoDate(e.ts) + '</lastmod>'
      + '<changefreq>weekly</changefreq>'
      + '<priority>0.75</priority></url>\n';
  });

  // Tag landing pages — each unique tag with ≥2 entries gets its own URL.
  // Below 2 entries the page is too thin to index as a cluster.
  const tagCounts = {};
  entries.forEach(e => {
    (e.tags || []).forEach(t => {
      const tl = String(t || '').toLowerCase().trim();
      if (tl && /^[a-z0-9-]+$/.test(tl) && tl.length <= 50) {
        tagCounts[tl] = (tagCounts[tl] || 0) + 1;
      }
    });
  });
  Object.entries(tagCounts)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .forEach(([tag, count]) => {
      // Priority scales with entry count: 0.6 for 2 entries, capped at 0.85
      const priority = Math.min(0.85, 0.55 + count * 0.03).toFixed(2);
      body += '<url><loc>' + SITE + '/knowledge/tag/' + escXml(tag) + '</loc>'
        + '<lastmod>' + isoDate(latestTs) + '</lastmod>'
        + '<changefreq>daily</changefreq>'
        + '<priority>' + priority + '</priority></url>\n';
    });

  body += '</urlset>\n';

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600', // 10 min cache
    },
    body,
  };
};
