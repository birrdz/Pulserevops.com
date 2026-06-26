// ════════════════════════════════════════════════════════════════════════
// pulse-machine-reviews-sitemap — dynamic sitemap for the reviews-mirror
// URLs. Every library entry gets a parallel <existing-url>/reviews mirror
// indexed separately so the site ranks for "[topic] reviews" queries.
//
// Mounted at /sitemap-reviews.xml via netlify.toml redirect.
// ════════════════════════════════════════════════════════════════════════

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

let TOOLS = null;
try { TOOLS = require('./lib/pulse-tools-registry').TOOLS; } catch (e) {}

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

  const isTrainingEntry = e => (Array.isArray(e.tags) && e.tags.includes('sales-training')) || /^st\d+$/i.test(e.id || '');
  const isKpiEntry      = e => (Array.isArray(e.tags) && e.tags.includes('industry-kpi')) || /^ik\d+$/i.test(e.id || '');
  const isTechstackEntry = e => /^tk\d+$/i.test(e.id || '');
  const isGraphicEntry  = e => /^gb\d+$/i.test(e.id || '');

  // Static-page reviews mirrors — major HTML pages get a `<page>/reviews` URL.
  // These get top priority because they're the highest-traffic pages on the site.
  const staticReviewsPages = [
    '/home/reviews',
    '/knowledge/reviews',
    '/sales-trainings/reviews',
    '/industry-kpis/reviews',
    '/tech-stacks/reviews',
    '/graphics/reviews',
    '/dashboard/reviews',
    '/matrix/reviews',
    '/schedule/reviews',
    '/bins/reviews',
    '/answers/reviews',
    '/machine/reviews',
  ];

  let body = '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Static-page reviews — highest priority
  for (const p of staticReviewsPages) {
    body += '<url><loc>' + SITE + p + '</loc>'
         + '<lastmod>' + isoDate(latestTs) + '</lastmod>'
         + '<changefreq>weekly</changefreq>'
         + '<priority>0.9</priority></url>\n';
  }

  // Tools-page reviews — every tool in the registry gets a /tools/<slug>/reviews mirror.
  if (TOOLS) {
    for (const slug of Object.keys(TOOLS)) {
      body += '<url><loc>' + SITE + '/tools/' + slug + '/reviews</loc>'
           + '<lastmod>' + isoDate(latestTs) + '</lastmod>'
           + '<changefreq>weekly</changefreq>'
           + '<priority>0.75</priority></url>\n';
    }
  }

  for (const e of entries) {
    if (!e || !e.id) continue;
    const lastmod = isoDate(e.ts);
    let suffixPath;
    if (isTrainingEntry(e))       suffixPath = '/sales-trainings/' + e.id + '/reviews';
    else if (isKpiEntry(e))       suffixPath = '/industry-kpis/' + e.id + '/reviews';
    else if (isTechstackEntry(e)) suffixPath = '/tech-stacks/' + e.id + '/reviews';
    else if (isGraphicEntry(e))   suffixPath = '/graphics/' + e.id + '/reviews';
    else                          suffixPath = '/knowledge/' + e.id + '/reviews';
    body += '<url><loc>' + SITE + suffixPath + '</loc>'
         + '<lastmod>' + lastmod + '</lastmod>'
         + '<changefreq>weekly</changefreq>'
         + '<priority>0.6</priority></url>\n';
  }
  body += '</urlset>\n';

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600',
    },
    body,
  };
};
