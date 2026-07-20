// ════════════════════════════════════════════════════════════════════════
// pulse-machine-sitemap — dynamic sitemap (seo-sweep 2026-06-22: bo+ai omnibus + cg hub slug).
// state of the autonomously growing knowledge library.
//
// Mounted at /sitemap-knowledge.xml via netlify.toml redirect. The main
// /sitemap.xml stays static (covers the rest of the site); this is a
// secondary sitemap specifically for the library.
// ════════════════════════════════════════════════════════════════════════

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}
const { libraryEntryPublicUrl } = require('./lib/library-entry-url');

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
function entryModifiedMs(entry) {
  const timestamps = [
    entry && entry.ts,
    entry && entry.polished_at,
    entry && entry.updated_at,
    entry && entry.last_modified_ms,
  ].map(Number).filter(Number.isFinite);
  return timestamps.length ? Math.max(...timestamps) : Date.now();
}
function escXml(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function canonicalEntryUrl(entry) {
  return libraryEntryPublicUrl(entry) || (SITE + '/knowledge/' + encodeURIComponent(String(entry && entry.id || '')));
}
function entryMatchesPillar(entry, pillarKey) {
  const id = String(entry && entry.id || '');
  if (!id) return false;
  if (pillarKey === 'q') return /^q\d+$/i.test(id) || /^vq_/i.test(id) || /^ed\d+$/i.test(id);
  return new RegExp('^' + pillarKey + '\\d+$', 'i').test(id);
}

// Per-pillar filter mode — when ?pillar=<key> is set, emit ONLY that pillar's
// hub + per-entry URLs. Keys: q (knowledge) · st (sales-trainings) · ik
// (industry-kpis) · tk (tech-stacks) · gb (graphics) · bs (book-summaries) ·
// er (electronic-reviews) · ra (revenue-architecture) · gp (go-to-market-playbooks).
// Unfiltered (no `?pillar=` param) → omnibus sitemap (legacy behavior).
const PILLAR_HUB = {
  q:  { path: '/knowledge.html',                 name: 'Knowledge' },
  st: { path: '/sales-trainings',                name: 'Sales Trainings' },
  ik: { path: '/industry-kpis',                  name: 'Industry KPIs' },
  tk: { path: '/tech-stacks',                    name: 'Tech Stacks' },
  gb: { path: '/graphics',                       name: 'Graphics' },
  bs: { path: '/sales-book-summaries',           name: 'Book Summaries' },
  er: { path: '/electronic-reviews',             name: 'Electronic Reviews' },
  ra: { path: '/revenue-architecture',           name: 'Revenue Architecture' },
  gp: { path: '/go-to-market-playbooks',         name: 'GTM Playbooks' },
  bo: { path: '/buildouts',                      name: 'Buildouts' },
  cd: { path: '/contracts',                      name: 'Contracts & Deals' },
  pt: { path: '/pets',                           name: 'Pets' },
  sw: { path: '/software',                       name: 'Software' },
  fr: { path: '/franchises',                     name: 'Franchises' },
  ca: { path: '/cars',                           name: 'Cars' },
  tn: { path: '/towns',                          name: 'Towns' },
  sc: { path: '/schools',                        name: 'Schools' },
  nl: { path: '/nightlife',                      name: 'Nightlife' },
  dn: { path: '/dining',                         name: 'Dining' },
  bt: { path: '/boats',                          name: 'Boats' },
  mv: { path: '/movies',                         name: 'Movies' },
  wl: { path: '/wellness',                       name: 'Wellness' },
  dr: { path: '/drills',                         name: 'Drills' },
  tv: { path: '/travel',                         name: 'Travel' },
  rs: { path: '/resorts',                        name: 'Resorts' },
  es: { path: '/estates',                        name: 'Estates' },
  cl: { path: '/clubs',                          name: 'Clubs' },
  lv: { path: '/living',                         name: 'Living' },
  ev: { path: '/events',                         name: 'Events' },
  sy: { path: '/style',                          name: 'Style' },
  ga: { path: '/gatherings',                     name: 'Gatherings' },
  gm: { path: '/gaming',                         name: 'Gaming' },
  sk: { path: '/skills',                         name: 'Skill Drills' },
  sp: { path: '/speeches',                       name: 'Speeches' },
  tl: { path: '/tools',                          name: 'Tools' },
  cg: { path: '/coaching',                       name: 'Coaching' },
  co: { path: '/collectibles',                   name: 'Collectibles' },
  aq: { path: '/aquariums',                      name: 'Aquariums' },
  hf: { path: '/highschool-football-recruiting', name: 'HS Football Recruiting' },
  ai: { path: '/ai-infrastructure',              name: 'AI Infrastructure' },
  tc: { path: '/telco',                          name: 'Telco' },
};
exports.handler = async (event) => {
  // Pillar can come from EITHER:
  //  (a) ?pillar=<key> query param (direct function URL hit), OR
  //  (b) the request PATH — when /sitemap-<slug>.xml is rewritten to this
  //      function via netlify.toml, the `to` URL's query string is DROPPED
  //      (Netlify only preserves the incoming request's query). So we parse
  //      the original `event.path` to recover the pillar key from the slug.
  const qs = (event && event.queryStringParameters) || {};
  let pillarKey = (qs.pillar || '').toLowerCase().trim();
  if (!pillarKey && event && event.path) {
    const PATH_TO_KEY = {
      'sitemap-knowledge':              'q',
      'sitemap-knowledge-live':         'q',
      'sitemap-tools':                  'tl',
      'sitemap-sales-trainings':        'st',
      'sitemap-industry-kpis':          'ik',
      'sitemap-tech-stacks':            'tk',
      'sitemap-graphics':               'gb',
      'sitemap-book-summaries':         'bs',
      'sitemap-electronic-reviews':     'er',
      'sitemap-revenue-architecture':   'ra',
      'sitemap-go-to-market-playbooks': 'gp',
      'sitemap-franchises':             'fr',
      'sitemap-cars':                   'ca',
      'sitemap-towns':                  'tn',
      'sitemap-schools':                'sc',
      'sitemap-nightlife':              'nl',
      'sitemap-dining':                 'dn',
      'sitemap-boats':                  'bt',
      'sitemap-movies':                 'mv',
      'sitemap-wellness':               'wl',
      'sitemap-drills':                 'dr',
      'sitemap-travel':                 'tv',
      'sitemap-resorts':                'rs',
      'sitemap-estates':                'es',
      'sitemap-collectibles':           'co',
      'sitemap-aquariums':              'aq',
      'sitemap-highschool-football-recruiting': 'hf',
      'sitemap-ai-infrastructure':      'ai',
      'sitemap-telco':                  'tc',
      'sitemap-coaching':               'cg',
      'sitemap-buildouts':              'bo',
      'sitemap-pets':                   'pt',
      'sitemap-software':               'sw',
      'sitemap-clubs':                  'cl',
      'sitemap-living':                 'lv',
      'sitemap-events':                 'ev',
      'sitemap-style':                  'sy',
      'sitemap-gatherings':             'ga',
      'sitemap-gaming':                 'gm',
      'sitemap-skills':                 'sk',
      'sitemap-speeches':               'sp',
    };
    const m = event.path.match(/\/(sitemap-[a-z-]+)\.xml$/i);
    if (m && PATH_TO_KEY[m[1].toLowerCase()]) pillarKey = PATH_TO_KEY[m[1].toLowerCase()];
  }
  const filterPillar = PILLAR_HUB[pillarKey] ? pillarKey : null;

  const store = initStore();
  let entries = [];
  let latestTs = Date.now();
  if (store) {
    try {
      const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
      // Load the full catalog; advertised sitemap endpoints filter it by exact
      // pillar, keeping each response below Google and Netlify response limits.
      entries = (idx.entries || []).slice(0, 50000).map(entry => ({
        ...entry,
        ts: entryModifiedMs(entry),
      }));
      if (entries.length && entries[0].ts) latestTs = entries[0].ts;
    } catch (e) {}

    // If a pillar filter is set, emit a focused single-pillar sitemap
    // (hub URL + every entry whose id matches the pillar prefix). Returns early.
    if (filterPillar) {
      const hub = PILLAR_HUB[filterPillar];
      const pillarEntries = entries.filter(e => entryMatchesPillar(e, filterPillar));
      const pillarLatestTs = pillarEntries.length && pillarEntries[0].ts ? pillarEntries[0].ts : latestTs;
      let pBody = '<?xml version="1.0" encoding="UTF-8"?>\n'
        + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + '<url><loc>' + SITE + hub.path + '</loc>'
        + '<lastmod>' + isoDate(pillarLatestTs) + '</lastmod>'
        + '<changefreq>hourly</changefreq><priority>0.95</priority></url>\n';
      pillarEntries.forEach(e => {
        if (!e || !e.id) return;
        pBody += '<url><loc>' + escXml(canonicalEntryUrl(e)) + '</loc>'
          + '<lastmod>' + isoDate(e.ts) + '</lastmod>'
          + '<changefreq>weekly</changefreq><priority>0.78</priority></url>\n';
        // Review-mirror URLs are intentionally excluded: they redirect to this
        // canonical page and must not be submitted for indexing.
      });
      pBody += '</urlset>';
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=600, s-maxage=3600' },
        body: pBody,
      };
    }
  }

  // Keep entries grouped by pillar for sitemap reporting, but emit the single
  // canonical /knowledge/<id> URL used by the renderer for every answer.
  const isTrainingEntry = e => (Array.isArray(e.tags) && e.tags.includes('sales-training')) || /^st\d+$/i.test(e.id || '');
  const isKpiEntry      = e => (Array.isArray(e.tags) && e.tags.includes('industry-kpi')) || /^ik\d+$/i.test(e.id || '');
  const isTechstackEntry = e => /^tk\d+$/i.test(e.id || '');
  const isGraphicEntry  = e => /^gb\d+$/i.test(e.id || '');
  const isBookSummaryEntry = e => /^bs\d+$/i.test(e.id || '');
  const isElectronicReviewEntry = e => /^er\d+$/i.test(e.id || '');
  const isRevenueArchitectureEntry = e => /^ra\d+$/i.test(e.id || '');
  const isGTMPlaybookEntry = e => /^gp\d+$/i.test(e.id || '');
  const isFranchiseEntry = e => /^fr\d+$/i.test(e.id || '');
  const isCarEntry = e => /^ca\d+$/i.test(e.id || '');
  const trainingEntries = entries.filter(isTrainingEntry);
  const kpiEntries      = entries.filter(e => !isTrainingEntry(e) && isKpiEntry(e));
  const techstackEntries = entries.filter(e => !isTrainingEntry(e) && !isKpiEntry(e) && isTechstackEntry(e));
  const graphicEntries  = entries.filter(e => !isTrainingEntry(e) && !isKpiEntry(e) && !isTechstackEntry(e) && isGraphicEntry(e));
  const bookSummaryEntries = entries.filter(e => !isTrainingEntry(e) && !isKpiEntry(e) && !isTechstackEntry(e) && !isGraphicEntry(e) && isBookSummaryEntry(e));
  const electronicReviewEntries = entries.filter(e => !isTrainingEntry(e) && !isKpiEntry(e) && !isTechstackEntry(e) && !isGraphicEntry(e) && !isBookSummaryEntry(e) && isElectronicReviewEntry(e));
  const revenueArchitectureEntries = entries.filter(e => !isTrainingEntry(e) && !isKpiEntry(e) && !isTechstackEntry(e) && !isGraphicEntry(e) && !isBookSummaryEntry(e) && !isElectronicReviewEntry(e) && isRevenueArchitectureEntry(e));
  const gtmPlaybookEntries = entries.filter(e => !isTrainingEntry(e) && !isKpiEntry(e) && !isTechstackEntry(e) && !isGraphicEntry(e) && !isBookSummaryEntry(e) && !isElectronicReviewEntry(e) && !isRevenueArchitectureEntry(e) && isGTMPlaybookEntry(e));
  const franchiseEntries = entries.filter(isFranchiseEntry);
  const carEntries = entries.filter(isCarEntry);
  const isNewPillarEntry = e => e && e.id && /^(tn|sc|nl|dn|bt|mv|wl|dr|tv|rs|es|cl|lv|ev|sy|ga|gm|sk|sp|tl|cg|co|ai|bo|aq|hf|pt|sw|tc)\d+$/i.test(e.id);
  const newPillarEntries = entries.filter(isNewPillarEntry);
  const libraryEntries  = entries.filter(e => !isTrainingEntry(e) && !isKpiEntry(e) && !isTechstackEntry(e) && !isGraphicEntry(e) && !isBookSummaryEntry(e) && !isElectronicReviewEntry(e) && !isRevenueArchitectureEntry(e) && !isGTMPlaybookEntry(e) && !isFranchiseEntry(e) && !isCarEntry(e) && !isNewPillarEntry(e));
  const latestTrainingTs = trainingEntries.length && trainingEntries[0].ts ? trainingEntries[0].ts : latestTs;
  const latestKpiTs      = kpiEntries.length && kpiEntries[0].ts ? kpiEntries[0].ts : latestTs;
  const latestTechstackTs = techstackEntries.length && techstackEntries[0].ts ? techstackEntries[0].ts : latestTs;
  const latestGraphicTs = graphicEntries.length && graphicEntries[0].ts ? graphicEntries[0].ts : latestTs;
  const latestBookSummaryTs = bookSummaryEntries.length && bookSummaryEntries[0].ts ? bookSummaryEntries[0].ts : latestTs;
  const latestElectronicReviewTs = electronicReviewEntries.length && electronicReviewEntries[0].ts ? electronicReviewEntries[0].ts : latestTs;
  const latestRevenueArchitectureTs = revenueArchitectureEntries.length && revenueArchitectureEntries[0].ts ? revenueArchitectureEntries[0].ts : latestTs;
  const latestGtmPlaybookTs = gtmPlaybookEntries.length && gtmPlaybookEntries[0].ts ? gtmPlaybookEntries[0].ts : latestTs;

  let body = '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    // Hubs — each gets its own top-priority URL
    + '<url><loc>' + SITE + '/knowledge.html</loc>'
    + '<lastmod>' + isoDate(latestTs) + '</lastmod>'
    + '<changefreq>hourly</changefreq><priority>0.92</priority></url>\n'
    + '<url><loc>' + SITE + '/sales-trainings</loc>'
    + '<lastmod>' + isoDate(latestTrainingTs) + '</lastmod>'
    + '<changefreq>hourly</changefreq><priority>0.92</priority></url>\n'
    + '<url><loc>' + SITE + '/industry-kpis</loc>'
    + '<lastmod>' + isoDate(latestKpiTs) + '</lastmod>'
    + '<changefreq>hourly</changefreq><priority>0.92</priority></url>\n'
    + '<url><loc>' + SITE + '/tech-stacks</loc>'
    + '<lastmod>' + isoDate(latestTechstackTs) + '</lastmod>'
    + '<changefreq>hourly</changefreq><priority>0.92</priority></url>\n'
    + '<url><loc>' + SITE + '/graphics</loc>'
    + '<lastmod>' + isoDate(latestGraphicTs) + '</lastmod>'
    + '<changefreq>hourly</changefreq><priority>0.92</priority></url>\n'
    + '<url><loc>' + SITE + '/sales-book-summaries</loc>'
    + '<lastmod>' + isoDate(latestBookSummaryTs) + '</lastmod>'
    + '<changefreq>hourly</changefreq><priority>0.92</priority></url>\n'
    + '<url><loc>' + SITE + '/electronic-reviews</loc>'
    + '<lastmod>' + isoDate(latestElectronicReviewTs) + '</lastmod>'
    + '<changefreq>hourly</changefreq><priority>0.92</priority></url>\n'
    + '<url><loc>' + SITE + '/revenue-architecture</loc>'
    + '<lastmod>' + isoDate(latestRevenueArchitectureTs) + '</lastmod>'
    + '<changefreq>hourly</changefreq><priority>0.92</priority></url>\n'
    + '<url><loc>' + SITE + '/go-to-market-playbooks</loc>'
    + '<lastmod>' + isoDate(latestGtmPlaybookTs) + '</lastmod>'
    + '<changefreq>hourly</changefreq><priority>0.92</priority></url>\n'
    + '<url><loc>' + SITE + '/fractional-cro</loc>'
    + '<lastmod>' + isoDate(latestTs) + '</lastmod>'
    + '<changefreq>weekly</changefreq><priority>0.95</priority></url>\n'
    + '<url><loc>' + SITE + '/fractional-cro-maryland-dc</loc>'
    + '<lastmod>' + isoDate(latestTs) + '</lastmod>'
    + '<changefreq>weekly</changefreq><priority>0.95</priority></url>\n'
    + '<url><loc>' + SITE + '/cro-syndicate-team</loc>'
    + '<lastmod>' + isoDate(latestTs) + '</lastmod>'
    + '<changefreq>weekly</changefreq><priority>0.95</priority></url>\n'
    + '<url><loc>' + SITE + '/kory-white-maryland</loc>'
    + '<lastmod>' + isoDate(latestTs) + '</lastmod>'
    + '<changefreq>weekly</changefreq><priority>0.95</priority></url>\n'
    + '<url><loc>' + SITE + '/highschool-football-recruiting</loc>'
    + '<lastmod>' + isoDate(latestTs) + '</lastmod>'
    + '<changefreq>weekly</changefreq><priority>0.92</priority></url>\n'
    + '<url><loc>' + SITE + '/tools</loc>'
    + '<lastmod>' + isoDate(latestTs) + '</lastmod>'
    + '<changefreq>weekly</changefreq><priority>0.92</priority></url>\n';

  // Per-entry indexable URLs — each entry has one canonical /knowledge/<id>
  // page with full content, JSON-LD, and OG cards.
  libraryEntries.forEach(e => {
    if (!e || !e.id) return;
    body += '<url><loc>' + escXml(canonicalEntryUrl(e)) + '</loc>'
      + '<lastmod>' + isoDate(e.ts) + '</lastmod>'
      + '<changefreq>weekly</changefreq>'
      + '<priority>0.75</priority></url>\n';
  });
  trainingEntries.forEach(e => {
    if (!e || !e.id) return;
    // Trainings get a slightly higher priority — fewer entries, longer-form,
    // direct revenue tie-in (sales-leader audience).
    body += '<url><loc>' + escXml(canonicalEntryUrl(e)) + '</loc>'
      + '<lastmod>' + isoDate(e.ts) + '</lastmod>'
      + '<changefreq>weekly</changefreq>'
      + '<priority>0.85</priority></url>\n';
  });
  kpiEntries.forEach(e => {
    if (!e || !e.id) return;
    // Industry-KPI guides — benchmark-heavy, evergreen reference content.
    body += '<url><loc>' + escXml(canonicalEntryUrl(e)) + '</loc>'
      + '<lastmod>' + isoDate(e.ts) + '</lastmod>'
      + '<changefreq>weekly</changefreq>'
      + '<priority>0.80</priority></url>\n';
  });
  techstackEntries.forEach(e => {
    if (!e || !e.id) return;
    // Tech-stack guides — recommended software stack per industry.
    body += '<url><loc>' + escXml(canonicalEntryUrl(e)) + '</loc>'
      + '<lastmod>' + isoDate(e.ts) + '</lastmod>'
      + '<changefreq>weekly</changefreq>'
      + '<priority>0.80</priority></url>\n';
  });
  graphicEntries.forEach(e => {
    if (!e || !e.id) return;
    // Graphics — downloadable banners, slides, printables, clip art.
    body += '<url><loc>' + escXml(canonicalEntryUrl(e)) + '</loc>'
      + '<lastmod>' + isoDate(e.ts) + '</lastmod>'
      + '<changefreq>monthly</changefreq>'
      + '<priority>0.70</priority></url>\n';
  });
  bookSummaryEntries.forEach(e => {
    if (!e || !e.id) return;
    // Sales Book Summaries (Cliff Notes) — top 25 sales books chapter-by-chapter.
    // Higher priority because the SEO opportunity (book-summary queries) is huge.
    body += '<url><loc>' + escXml(canonicalEntryUrl(e)) + '</loc>'
      + '<lastmod>' + isoDate(e.ts) + '</lastmod>'
      + '<changefreq>weekly</changefreq>'
      + '<priority>0.85</priority></url>\n';
  });
  electronicReviewEntries.forEach(e => {
    if (!e || !e.id) return;
    // Electronic Reviews — top-10 consumer electronics rankings with Best
    // Overall + Best Value highlights. Commercial-intent queries — high priority.
    body += '<url><loc>' + escXml(canonicalEntryUrl(e)) + '</loc>'
      + '<lastmod>' + isoDate(e.ts) + '</lastmod>'
      + '<changefreq>weekly</changefreq>'
      + '<priority>0.88</priority></url>\n';
  });
  revenueArchitectureEntries.forEach(e => {
    if (!e || !e.id) return;
    // Revenue Architecture — 8th pillar. Operator-grade essays on GTM design,
    // pipeline math, comp + org architecture. High strategic-search intent.
    body += '<url><loc>' + escXml(canonicalEntryUrl(e)) + '</loc>'
      + '<lastmod>' + isoDate(e.ts) + '</lastmod>'
      + '<changefreq>weekly</changefreq>'
      + '<priority>0.90</priority></url>\n';
  });
  gtmPlaybookEntries.forEach(e => {
    if (!e || !e.id) return;
    // Go-To-Market Playbooks — 9th pillar. Step-by-step playbooks for GTM
    // launches, scaling motions, and pivots. High strategic-search intent.
    body += '<url><loc>' + escXml(canonicalEntryUrl(e)) + '</loc>'
      + '<lastmod>' + isoDate(e.ts) + '</lastmod>'
      + '<changefreq>weekly</changefreq>'
      + '<priority>0.90</priority></url>\n';
  });
  franchiseEntries.forEach(e => {
    if (!e || !e.id) return;
    // Franchises — "Should I open/buy <brand> in 2027?" buyer-intent guides.
    body += '<url><loc>' + escXml(canonicalEntryUrl(e)) + '</loc>'
      + '<lastmod>' + isoDate(e.ts) + '</lastmod>'
      + '<changefreq>weekly</changefreq>'
      + '<priority>0.80</priority></url>\n';
  });
  carEntries.forEach(e => {
    if (!e || !e.id) return;
    // Cars — "Top 10 <vehicle class> <year>" ranked buying guides at /cars/<id>.
    body += '<url><loc>' + escXml(canonicalEntryUrl(e)) + '</loc>'
      + '<lastmod>' + isoDate(e.ts) + '</lastmod>'
      + '<changefreq>weekly</changefreq>'
      + '<priority>0.80</priority></url>\n';
  });
  // New Top-10 pillars retain their category grouping while sharing the same
  // canonical entry URL model.
  newPillarEntries.forEach(e => {
    if (!e || !e.id) return;
    body += '<url><loc>' + escXml(canonicalEntryUrl(e)) + '</loc>'
      + '<lastmod>' + isoDate(e.ts) + '</lastmod>'
      + '<changefreq>weekly</changefreq>'
      + '<priority>0.80</priority></url>\n';
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

  // Slim every <url> to <loc>+<lastmod> only — drop <changefreq>/<priority>
  // (Google ignores both). At ~275 bytes/url the full omnibus (22,960+ entries)
  // hit Netlify's 6MB function-response limit → 502; this cuts to ~110 bytes/url
  // (~2.5MB) so ALL entries fit, with headroom to ~50k. Owner 2026-06-27.
  body = body.replace(/<changefreq>[^<]*<\/changefreq>/g, '').replace(/<priority>[^<]*<\/priority>/g, '');

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600', // 10 min cache
    },
    body,
  };
};

exports._test = {
  canonicalEntryUrl,
  entryModifiedMs,
  entryMatchesPillar,
};
