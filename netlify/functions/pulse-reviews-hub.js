// ════════════════════════════════════════════════════════════════════════
// pulse-reviews-hub — /reviews landing page that lists every reviews URL
// on the site. Gives Google a strong internal-link anchor for discovering
// the reviews mirror corpus.
//
// Mounted at /reviews via netlify.toml redirect.
// ════════════════════════════════════════════════════════════════════════

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

let TOOLS = null;
try { TOOLS = require('./lib/pulse-tools-registry').TOOLS; } catch (e) {}

const SITE = 'https://pulserevops.com';
const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

function initStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  if (tok && SITE_ID) { try { return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok }); } catch (e) { return null; } }
  try { return getStore('pulse-machine-library'); } catch (e) { return null; }
}

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

exports.handler = async () => {
  const store = initStore();
  let entries = [];
  if (store) {
    try {
      const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
      entries = (idx.entries || []).slice(0, 500); // cap the hub at 500 most-recent for page weight
    } catch (e) {}
  }

  const isTraining = e => (Array.isArray(e.tags) && e.tags.includes('sales-training')) || /^st\d+$/i.test(e.id || '');
  const isKpi      = e => (Array.isArray(e.tags) && e.tags.includes('industry-kpi')) || /^ik\d+$/i.test(e.id || '');

  const knowledgeEntries = entries.filter(e => !isTraining(e) && !isKpi(e)).slice(0, 200);
  const trainingEntries  = entries.filter(isTraining).slice(0, 100);
  const kpiEntries       = entries.filter(e => !isTraining(e) && isKpi(e)).slice(0, 150);

  function entryRow(e, pathPrefix) {
    const path = pathPrefix + e.id + '/reviews';
    const q = esc((e.question || '').slice(0, 120));
    return '<li><a href="' + path + '">' + q + ' — Reviews</a></li>';
  }

  const staticReviewsPages = [
    { p: '/home/reviews',             label: 'PULSE Home Reviews' },
    { p: '/knowledge/reviews',        label: 'Knowledge Library Reviews' },
    { p: '/sales-trainings/reviews',  label: 'Sales Trainings Reviews' },
    { p: '/industry-kpis/reviews',    label: 'Industry KPIs Reviews' },
    { p: '/dashboard/reviews',        label: 'Pulse Dashboard Reviews' },
    { p: '/matrix/reviews',           label: 'Sales Rep Matrix Reviews' },
    { p: '/schedule/reviews',         label: 'Sales Cadence Schedule Reviews' },
    { p: '/bins/reviews',             label: 'Pulse Bins Reviews' },
    { p: '/answers/reviews',          label: 'Sales Answers Reviews' },
    { p: '/machine/reviews',          label: 'Pulse Machine Reviews' },
  ];

  const toolsList = TOOLS ? Object.entries(TOOLS).map(([slug, t]) => ({
    path: '/tools/' + slug + '/reviews',
    name: 'Free ' + (t.name || slug) + ' Reviews',
  })) : [];

  const title = 'Pulse RevOps Reviews and Expert Analysis 2027 — 3,700+ Sales and RevOps Topics';
  const desc  = 'Reviews and expert analysis of every Pulse RevOps tool, sales KPI, sales training, and RevOps answer. Free, browser-only, no login.';

  const html = `<!doctype html>
<html lang="en"><head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
  <link rel="canonical" href="${SITE}/reviews">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${SITE}/reviews">
  <meta property="og:image" content="${SITE}/pulse-og.png">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23E8710A' d='M3 12h3l2-7 4 14 2-7h7'/%3E%3C/svg%3E">
  <style>
    *{box-sizing:border-box;}html,body{margin:0;padding:0;background:#070a0f;color:#EDE5D8;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.7;}
    a{color:#FF8C1A;text-decoration:none;}a:hover{text-decoration:underline;}
    .top{padding:24px clamp(20px,5vw,56px);display:flex;justify-content:space-between;align-items:center;font-size:0.7rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(237,229,216,0.65);border-bottom:1px solid rgba(255,255,255,0.05);}
    main{max-width:980px;margin:0 auto;padding:36px clamp(20px,5vw,40px) 64px;}
    h1{font-size:clamp(2rem,4.2vw,3.2rem);font-weight:900;letter-spacing:-0.01em;line-height:1.12;margin:0 0 16px;color:#fff;}
    .lead{font-size:1.05rem;color:rgba(237,229,216,0.78);max-width:780px;margin:0 0 32px;}
    h2{font-size:1.4rem;font-weight:800;color:#FFD740;margin:36px 0 14px;padding-bottom:8px;border-bottom:1px solid rgba(255,215,64,0.18);}
    ul{padding-left:18px;margin:0 0 24px;}li{margin:6px 0;}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:10px 28px;}
    .footer-note{padding:28px;text-align:center;color:rgba(237,229,216,0.4);font-size:0.74rem;letter-spacing:0.08em;border-top:1px solid rgba(255,255,255,0.04);}
  </style><link rel="stylesheet" href="/assets/pulse-tan.css"></head><body>
  <div class="top"><span><a href="/">PULSE REVOPS</a></span><span><a href="/knowledge.html">📚 Library</a> · <a href="/sales-trainings">Trainings</a> · <a href="/industry-kpis">KPIs</a> · <a href="/tools/">Tools</a></span></div>
  <main>
    <h1>Reviews and Expert Analysis — Every Sales, RevOps, and Operator Topic in the Pulse Library</h1>
    <p class="lead">${esc(desc)} Every topic below has a Pulse expert analysis page — reviews, operator-grade insight, and 2027-current benchmarks.</p>

    <h2>Pulse Hubs and Tools — Reviews</h2>
    <ul class="grid">
      ${staticReviewsPages.map(p => '<li><a href="' + p.p + '">' + esc(p.label) + '</a></li>').join('')}
      ${toolsList.map(t => '<li><a href="' + t.path + '">' + esc(t.name) + '</a></li>').join('')}
    </ul>

    <h2>Industry KPIs — Reviews</h2>
    <ul class="grid">${kpiEntries.map(e => entryRow(e, '/industry-kpis/')).join('')}</ul>

    <h2>Sales Trainings — Reviews</h2>
    <ul class="grid">${trainingEntries.map(e => entryRow(e, '/sales-trainings/')).join('')}</ul>

    <h2>Knowledge Library Answers — Reviews</h2>
    <ul class="grid">${knowledgeEntries.map(e => entryRow(e, '/knowledge/')).join('')}</ul>

    <p style="margin-top:36px;color:rgba(237,229,216,0.6);font-size:0.9rem;">
      Showing recent ${knowledgeEntries.length + trainingEntries.length + kpiEntries.length} entries. The full reviews sitemap covers ${'all 3,700+'} entries at <a href="/sitemap-reviews.xml">/sitemap-reviews.xml</a>.
    </p>
  </main>
  <div class="footer-note">All Pulse content is free · No login, no card, no email gate · <a href="/">Home</a></div>
</body></html>`;

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=600' },
    body: html,
  };
};
