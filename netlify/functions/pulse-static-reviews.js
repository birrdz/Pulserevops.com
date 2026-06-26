// ════════════════════════════════════════════════════════════════════════
// pulse-static-reviews — wraps any static HTML page on the site with a
// "reviews" framing: rewrites <title> and <meta description> so the page
// ranks for "[page topic] reviews" queries.
//
// Mounted via netlify.toml redirects for every static page on the site.
// Same content as the original page, different SEO metadata.
// ════════════════════════════════════════════════════════════════════════

const https = require('https');

// Map of page slug → underlying static page path on the site.
const PAGES = {
  home:              { path: '/',                 label: 'Free RevOps Tools, Sales KPI Calculator and Fractional CRO' },
  knowledge:         { path: '/knowledge.html',   label: '3,700+ Researched Sales and RevOps Answers' },
  'sales-trainings': { path: '/sales-trainings.html', label: '1-Hour Sales Trainings Library' },
  'industry-kpis':   { path: '/industry-kpis.html',   label: 'Industry Sales KPIs by Sector' },
  'tech-stacks':     { path: '/tech-stacks.html',      label: 'Recommended Software Stack by Industry' },
  graphics:          { path: '/graphics.html',         label: 'Free RevOps Graphics, Banners and Presentation Art' },
  dashboard:         { path: '/dashboard.html',   label: 'Pulse RevOps Dashboard' },
  matrix:            { path: '/matrix.html',      label: 'Sales Rep Performance Matrix' },
  schedule:          { path: '/schedule.html',    label: 'Sales Cadence Schedule Builder' },
  bins:              { path: '/bins.html',        label: 'Pulse Bins Workspace' },
  answers:           { path: '/answers.html',     label: 'Sales Answers Drop' },
  machine:           { path: '/pulse-new.html',   label: 'Pulse Machine Fact Checker for RevOps' },
};

const HOST = 'pulserevops.com';

function fetchPage(path) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: HOST,
      path,
      method: 'GET',
      headers: { 'User-Agent': 'pulse-static-reviews/1.0' },
      timeout: 15000,
    };
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: data, contentType: res.headers['content-type'] || 'text/html' }));
    });
    req.on('error', reject);
    req.on('timeout', () => { try { req.destroy(); } catch (_) {} reject(new Error('timeout')); });
    req.end();
  });
}

function rewriteForReviews(html, pageLabel) {
  if (!html) return html;
  const reviewsTitle = `${pageLabel} — Reviews and Expert Analysis 2027 | Pulse RevOps`;
  const reviewsDesc  = `Reviews and expert analysis of ${pageLabel}. Free sales and RevOps tools, sales KPI benchmarks, and operator-grade insights from the Pulse RevOps library.`;

  // Rewrite <title>
  html = html.replace(/<title>[^<]*<\/title>/i, '<title>' + reviewsTitle.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</title>');

  // Rewrite <meta name="description" content="...">
  html = html.replace(
    /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i,
    '<meta name="description" content="' + reviewsDesc.replace(/"/g, '&quot;') + '">'
  );

  // Rewrite og:title and og:description for share preview consistency
  html = html.replace(
    /<meta\s+property=["']og:title["']\s+content=["'][^"']*["']\s*\/?>/i,
    '<meta property="og:title" content="' + reviewsTitle.replace(/"/g, '&quot;') + '">'
  );
  html = html.replace(
    /<meta\s+property=["']og:description["']\s+content=["'][^"']*["']\s*\/?>/i,
    '<meta property="og:description" content="' + reviewsDesc.replace(/"/g, '&quot;') + '">'
  );

  // Add a noindex-safe canonical reset so Google treats this as its own URL
  // (no canonical to the original) but page content stays identical otherwise.
  html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, '');

  return html;
}

exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  let pageKey = (params.page || '').toString().toLowerCase().replace(/[^a-z0-9-]/g, '');
  let dynamicSourcePath = null;
  let dynamicLabel = null;

  // Tools sub-page reviews: /tools/<slug>/reviews — fetch from /tools/<slug>
  if (event.path) {
    const mt = event.path.match(/^\/tools\/([a-z0-9-]+)\/reviews?\/?$/i);
    if (mt) {
      const slug = mt[1].toLowerCase();
      dynamicSourcePath = '/tools/' + slug;
      dynamicLabel = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
  }
  if (params.tools_slug) {
    const slug = String(params.tools_slug).toLowerCase().replace(/[^a-z0-9-]/g, '');
    dynamicSourcePath = '/tools/' + slug;
    dynamicLabel = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  // If path-only routing (no query), try to derive page from path like /dashboard/reviews
  if (!pageKey && !dynamicSourcePath && event.path) {
    const m = event.path.match(/^\/([\w-]+)\/reviews?\/?$/);
    if (m) pageKey = m[1].toLowerCase();
  }

  if (!dynamicSourcePath && (!pageKey || !PAGES[pageKey])) {
    return { statusCode: 404, headers: { 'Content-Type': 'text/html' }, body: '<h1>404</h1><p>Reviews page not found.</p>' };
  }

  const sourcePath = dynamicSourcePath || PAGES[pageKey].path;
  const pageLabel  = dynamicLabel || PAGES[pageKey].label;

  let resp;
  try { resp = await fetchPage(sourcePath); }
  catch (e) {
    return { statusCode: 502, headers: { 'Content-Type': 'text/html' }, body: '<h1>502</h1><p>Unable to fetch source page.</p>' };
  }
  if (!resp || resp.status !== 200) {
    return { statusCode: resp && resp.status || 502, headers: { 'Content-Type': 'text/html' }, body: '<h1>Error</h1><p>Source page unavailable.</p>' };
  }

  const html = rewriteForReviews(resp.body, pageLabel);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
      'X-Robots-Tag': 'index, follow',
    },
    body: html,
  };
};

exports.PAGES = PAGES;
