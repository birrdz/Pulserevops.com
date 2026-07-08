// ════════════════════════════════════════════════════════════════════════
// tools-page — server-rendered SEO landing pages for each PULSE dashboard
// tool / War Room section.
//
// Mounted at /tools/<slug> via netlify.toml. Each page has:
//   - H1, marketing copy, JSON-LD SoftwareApplication schema
//   - "Open the live tool" CTA deep-linking to /dashboard.html#anchor
//   - Related-tool cards + library cross-links
//
// Strategy: each section of the dashboard becomes its own indexable URL
// targeting specific search queries (e.g. "free SaaS gross profit calculator",
// "rep scheduling matrix", "service fees calculator").
// ════════════════════════════════════════════════════════════════════════

const { SITE, TOOLS, liveDashboardUrl } = require('./lib/pulse-tools-registry');
const { pulseOrgLogoImageObject } = require('./lib/pulse-brand');

function escHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}
function escAttr(s) { return escHtml(s); }

exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  let slug = String(params.slug || '').toLowerCase().trim();

  // Path fallback (Netlify redirect query-param substitution can be flaky)
  if (!slug) {
    const probe = event.path || event.rawUrl || '';
    const m = probe.match(/\/tools\/([a-z0-9-]+)/i);
    if (m) slug = m[1].toLowerCase();
  }

  // Pulse Tools library pillar — /tools/tl#### entries are library entries, not
  // interactive calculator pages. Delegate them to the entry renderer so they
  // share the full answer template (Direct Answer + Top-10 tools + FAQ).
  if (/^tl\d+$/i.test(slug)) {
    const entry = require('./pulse-machine-entry');
    return entry.handler({
      ...event,
      path: '/tools/' + slug,
      queryStringParameters: { ...(event.queryStringParameters || {}), id: slug },
    }, {});
  }

  // Index mode: /tools/ (no slug) renders a grid of all tools
  if (!slug) {
    const idxUrl = SITE + '/calculators';
    const n = Object.keys(TOOLS).length;
    const idxDesc = 'All ' + n + ' PULSE tools — free CRM, pipeline rooms, calculators, guided tour, and operator dashboards. Browser-only, no login.';
    const idxLd = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      url: idxUrl,
      name: 'PULSE Tools — Free Operator-Grade RevOps Tools',
      description: idxDesc,
      hasPart: Object.entries(TOOLS).map(([s, t]) => ({
        '@type': 'SoftwareApplication',
        name: 'PULSE ' + t.name,
        url: SITE + '/tools/' + s,
        applicationCategory: 'BusinessApplication',
      })),
    };
    const cards = Object.entries(TOOLS).map(([s, t]) => `
      <a href="/tools/${escAttr(s)}" style="display:block;background:linear-gradient(155deg,rgba(20,25,32,0.7),rgba(10,13,18,0.5));border:1px solid rgba(255,255,255,0.08);border-left:3px solid #E8710A;border-radius:12px;padding:22px 24px;text-decoration:none;color:inherit;transition:all 0.18s;">
        <div style="font-size:0.62rem;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;color:#FF8C1A;margin-bottom:8px;">${escHtml(t.icon)} ${escHtml(t.name)}</div>
        <div style="font-size:0.92rem;color:rgba(237,229,216,0.78);line-height:1.55;margin-bottom:10px;">${escHtml(t.short.slice(0, 160))}…</div>
        <div style="font-size:0.66rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(34,197,94,0.85);">Free · No login · Open ↗</div>
      </a>`).join('');

    // Pulse Tools how-to library — the tl#### Q&A entries (formula + Top-10 tools).
    let tlSection = '';
    try {
      const { getStore } = require('@netlify/blobs');
      let store;
      try { store = getStore('pulse-machine-library'); }
      catch (e) { store = getStore({ name: 'pulse-machine-library', siteID: process.env.SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.NETLIFY_BLOBS_TOKEN || process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN }); }
      const idx = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] };
      const tlAll = idx.entries.filter(e => e && /^tl\d+$/i.test(e.id)).sort((a, b) => (b.ts || 0) - (a.ts || 0));
      const tl = tlAll.slice(0, 300); // render only the 300 most-recent cards (full count below)
      if (tlAll.length) {
        const links = tl.map(e => `
          <a href="/tools/${escAttr(e.id)}" style="display:block;background:rgba(20,25,32,0.5);border:1px solid rgba(255,255,255,0.07);border-left:3px solid #39A6FF;border-radius:10px;padding:16px 18px;text-decoration:none;color:inherit;">
            <div style="font-size:0.95rem;font-weight:700;color:#EDE5D8;line-height:1.4;">${escHtml(e.question || e.id)}</div>
            <div style="font-size:0.62rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(57,166,255,0.85);margin-top:8px;">Method + Top 10 tools ↗</div>
          </a>`).join('');
        tlSection = `
          <h2 style="font-size:1.5rem;font-weight:900;color:#fff;margin:52px 0 6px;">Pulse Tools — Operator How-To Library</h2>
          <p class="lead" style="margin-bottom:22px;">${tlAll.length} answers that show you the actual method (the formula + a worked example) <b>and</b> the top 10 real tools that solve it — calculate reps, forecast revenue, predict churn, and more.</p>
          <div class="grid">${links}</div>`;
      }
    } catch (e) { tlSection = ''; }

    const idxHtml = `<!doctype html>
<html lang="en"><head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>PULSE Tools — Free Operator-Grade RevOps Calculators & Dashboards</title>
  <meta name="description" content="${escAttr(idxDesc)}">
  <meta name="keywords" content="free revops tools, sales calculator, gross profit calculator, free crm, rep scoring, sales coaching tool">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
  <link rel="canonical" href="${idxUrl}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="PULSE Tools — Free RevOps Operator Tools">
  <meta property="og:description" content="${escAttr(idxDesc)}">
  <meta property="og:url" content="${idxUrl}">
  <meta property="og:image" content="${SITE}/pulse-og.png">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png">
  <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png">
  <script type="application/ld+json">${JSON.stringify(idxLd)}</script>
  <style>
    *{box-sizing:border-box;}html,body{margin:0;padding:0;background:#070a0f;color:#EDE5D8;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.7;}
    a{color:#FF8C1A;text-decoration:none;}.top{padding:24px clamp(20px,5vw,56px);display:flex;justify-content:space-between;align-items:center;font-size:0.7rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(237,229,216,0.65);border-bottom:1px solid rgba(255,255,255,0.05);}
    main{max-width:1080px;margin:0 auto;padding:48px clamp(20px,5vw,40px) 64px;}
    h1{font-size:clamp(2.2rem,5vw,3.6rem);font-weight:900;letter-spacing:-0.01em;line-height:1.1;margin:0 0 16px;color:#fff;}
    .lead{font-size:1.12rem;color:rgba(237,229,216,0.78);max-width:760px;margin:0 0 36px;}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:14px;}
    .footer-note{padding:32px;text-align:center;color:rgba(237,229,216,0.35);font-size:0.7rem;letter-spacing:0.1em;border-top:1px solid rgba(255,255,255,0.04);}.footer-note a{color:rgba(255,140,26,0.7);}
  </style><link rel="stylesheet" href="/assets/pulse-tan.css"></head><body>
  <div class="top"><span><a href="/">PULSE REVOPS</a></span><span><a href="/dashboard.html">🛠 Free CRM</a> · <a href="/knowledge.html">📚 Library</a> · <a href="/themachine">The Machine</a></span></div>
  <main>
    <h1>Free Sales &amp; RevOps Tools — Operator-Grade Calculators &amp; Dashboards</h1>
    <p class="lead">${escHtml(idxDesc)} Built by a 22-year revenue executive — free, browser-only, no login required.</p>
    <div class="grid">${cards}</div>
    ${tlSection}
  </main>
  <div class="footer-note">All tools free · No login, no card, no email gate · <a href="/privacy">Privacy</a></div>
  <script src="/assets/visit-alert.js" defer></script>
  <script src="/assets/intent-beacon.js" defer></script>
</body></html>`;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=600, s-maxage=1800' },
      body: idxHtml,
    };
  }

  if (!TOOLS[slug]) {
    return {
      statusCode: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: `<!doctype html><html><head><title>Tool not found · PULSE</title><meta name="robots" content="noindex"></head><body style="font-family:system-ui;padding:48px;background:#0a0d12;color:#EDE5D8;text-align:center;"><h1 style="color:#FF8C1A;">Tool not found</h1><p><a href="/tools/" style="color:#FF8C1A;">See all PULSE tools</a> or open the <a href="/dashboard.html" style="color:#FF8C1A;">free CRM dashboard</a>.</p></body></html>`,
    };
  }

  const t = TOOLS[slug];
  const url = SITE + '/tools/' + slug;
  const liveUrl = t.openUrl || liveDashboardUrl(t);
  const robotsMeta = t.noindex ? 'noindex, follow' : 'index, follow, max-snippet:-1, max-image-preview:large';
  // Single-option pages: the Pulse Check matrix opens straight to the live tool —
  // no secondary "See all tools" button, no "Operators also use" cross-sell.
  const matrixOnly = slug === 'pulse-matrix' || slug === 'pulse-check';

  // Related tool cards
  const related = (t.related_tools || []).filter(s => TOOLS[s]).map(s => ({ slug: s, ...TOOLS[s] }));
  const relatedHtml = related.map(r => `
    <a href="/tools/${escAttr(r.slug)}" style="display:block;background:rgba(20,25,32,0.55);border:1px solid rgba(255,255,255,0.08);border-left:3px solid #E8710A;border-radius:10px;padding:16px 20px;text-decoration:none;color:inherit;transition:border-color 0.15s;">
      <div style="font-size:0.66rem;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#FF8C1A;margin-bottom:6px;">${escHtml(r.icon)} ${escHtml(r.name)}</div>
      <div style="font-size:0.85rem;color:rgba(237,229,216,0.72);line-height:1.5;">${escHtml(r.short.slice(0, 130))}…</div>
    </a>`).join('');

  // Library tag cross-links
  const tagLinksHtml = (t.related_tags || []).map(tag => `<a href="/knowledge/tag/${escAttr(tag)}" style="display:inline-block;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:rgba(237,229,216,0.85);padding:6px 14px;border-radius:99px;font-size:0.74rem;font-weight:600;text-decoration:none;margin-right:6px;margin-bottom:6px;transition:all 0.15s;">${escHtml(tag.replace(/-/g, ' '))} →</a>`).join('');

  // JSON-LD: SoftwareApplication with Kory as creator/founder for entity authority
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'PULSE ' + t.name,
    url,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
    description: t.short,
    creator: {
      '@type': 'Person',
      '@id': SITE + '/#korywhite',
      name: 'Kory White',
      jobTitle: 'Chief Revenue Officer',
      
      sameAs: [
        'https://www.linkedin.com/in/korywhite',
        'https://theexecutivereview.org/kory-white.html',
      ],
    },
    publisher: {
      '@type': 'Organization',
      '@id': SITE + '/#organization',
      name: 'Pulse RevOps',
      url: SITE,
      logo: pulseOrgLogoImageObject(),
      founder: { '@id': SITE + '/#korywhite' },
    },
  };

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <link rel="stylesheet" href="/css/mobile-fix.css">
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#FF6B30" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#09090F" media="(prefers-color-scheme: dark)">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="PULSE">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <title>Free ${escHtml(t.name)} — Sales &amp; RevOps Tool | PULSE</title>
  <meta name="description" content="${escAttr(t.short)}">
  <meta name="keywords" content="${escAttr(t.keywords.join(', '))}, free RevOps tools, free sales tools, PULSE RevOps">
  <meta name="author" content="Pulse RevOps · Kory White">
  <meta name="robots" content="${robotsMeta}">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escAttr('Free ' + t.name + ' — Sales & RevOps Tool | PULSE')}">
  <meta property="og:description" content="${escAttr(t.short)}">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="Pulse RevOps">
  <meta property="og:image" content="${SITE}/pulse-og.png">
  <meta property="og:image:alt" content="${escAttr(t.name + ' — free Pulse RevOps tool')}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escAttr('Free ' + t.name + ' | PULSE RevOps')}">
  <meta name="twitter:description" content="${escAttr(t.short)}">
  <meta name="twitter:image" content="${SITE}/pulse-og.png">
  <meta name="twitter:image:alt" content="${escAttr(t.name + ' — free Pulse RevOps tool')}">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png">
  <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png">
  <script type="application/ld+json">${JSON.stringify(ld)}</script>
  <style>
    *{box-sizing:border-box;}
    html,body{margin:0;padding:0;background:#070a0f;color:#EDE5D8;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.7;}
    a{color:#FF8C1A;text-decoration:none;}
    a:hover{text-decoration:underline;}
    .top{padding:24px clamp(20px,5vw,56px);display:flex;justify-content:space-between;align-items:center;font-size:0.7rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(237,229,216,0.65);border-bottom:1px solid rgba(255,255,255,0.05);}
    main{max-width:880px;margin:0 auto;padding:36px clamp(20px,5vw,40px) 64px;}
    .crumb{font-size:0.66rem;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(237,229,216,0.45);margin-bottom:18px;}
    .crumb a{color:rgba(237,229,216,0.65);}
    h1{font-size:clamp(2rem,4.2vw,3.2rem);font-weight:900;letter-spacing:-0.01em;line-height:1.1;margin:0 0 14px;color:#fff;}
    .icon{font-size:1.6rem;margin-right:10px;vertical-align:-4px;}
    .lead{font-size:1.12rem;color:rgba(237,229,216,0.85);max-width:720px;margin:0 0 28px;}
    .price-tag{display:inline-block;background:rgba(34,197,94,0.12);border:1px solid rgba(34,197,94,0.4);color:#22c55e;padding:6px 14px;border-radius:99px;font-size:0.7rem;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:24px;}
    .cta-row{display:flex;flex-wrap:wrap;gap:12px;margin:24px 0 36px;}
    .cta-primary{display:inline-flex;align-items:center;gap:8px;padding:14px 32px;background:linear-gradient(135deg,#E8710A,#FF8C1A);border:1px solid #FF8C1A;border-radius:10px;color:#fff !important;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;font-size:0.85rem;box-shadow:0 8px 24px rgba(232,113,10,0.32);transition:all 0.2s;}
    .cta-primary:hover{transform:translateY(-1px);text-decoration:none;}
    .cta-ghost{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;background:transparent;border:1px solid rgba(255,255,255,0.18);border-radius:10px;color:#EDE5D8 !important;font-weight:700;letter-spacing:0.06em;font-size:0.84rem;transition:all 0.2s;}
    .cta-ghost:hover{border-color:#FF8C1A;color:#FF8C1A !important;text-decoration:none;}
    .body p{font-size:1.02rem;color:rgba(237,229,216,0.88);margin:0 0 18px;}
    .body strong{color:#fff;}
    .section-h{font-size:0.7rem;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:#FF8C1A;margin:36px 0 14px;}
    .related-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;margin-bottom:18px;}
    .footer-note{padding:32px clamp(20px,5vw,56px);text-align:center;color:rgba(237,229,216,0.35);font-size:0.7rem;letter-spacing:0.1em;border-top:1px solid rgba(255,255,255,0.04);}
    .footer-note a{color:rgba(255,140,26,0.7);}
  </style>
</head>
<body>
  <div class="top">
    <span><a href="/">PULSE REVOPS</a></span>
    <span><a href="/dashboard.html">🛠 Free CRM</a> &nbsp;·&nbsp; <a href="/knowledge.html">📚 Library</a> &nbsp;·&nbsp; <a href="/themachine">The Machine</a></span>
  </div>
  <main>
    <div class="crumb"><a href="/">Pulse</a> · <a href="/dashboard.html">Dashboard</a> · ${escHtml(t.name)}</div>
    <h1><span class="icon">${escHtml(t.icon)}</span>${escHtml(t.name)}</h1>
    <span class="price-tag">Free · No login · No card</span>
    <p class="lead">${escHtml(t.short)}</p>
    <div class="cta-row">
      <a class="cta-primary" href="${escAttr(liveUrl)}">${matrixOnly ? 'Open the Pulse Check matrix ↗' : 'Open the live tool ↗'}</a>
      ${matrixOnly ? '' : `<a class="cta-ghost" href="/dashboard.html">See all PULSE tools →</a>`}
    </div>

    <div class="body">
      ${t.body.map(p => `<p>${p}</p>`).join('')}
    </div>

    ${tagLinksHtml ? `
      <div class="section-h">Researched in the library</div>
      <div style="margin-bottom:24px;">${tagLinksHtml}</div>
    ` : ''}

    ${matrixOnly ? '' : `<div class="section-h">Operators also use</div>
    <div class="related-grid">${relatedHtml}</div>`}

    <div style="margin:36px 0 0;padding:24px 28px;background:linear-gradient(155deg,rgba(232,113,10,0.08),rgba(10,13,18,0.4));border:1px solid rgba(232,113,10,0.25);border-radius:14px;text-align:center;">
      <div style="font-size:0.7rem;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:#FF8C1A;margin-bottom:10px;">⌬ Built by an operator, free for operators</div>
      <div style="font-size:0.92rem;color:rgba(237,229,216,0.72);max-width:540px;margin:0 auto 16px;">PULSE is a free operator-grade RevOps platform built by a 22-year revenue executive. The Machine — our autonomous AI knowledge engine — researches one operator question every 30 minutes and publishes it free.</div>
      <a class="cta-primary" href="${escAttr(liveUrl)}" style="margin:0;">Open ${escHtml(t.name)} now ↗</a>
    </div>
  </main>
  <div class="footer-note">
    Free PULSE tool · No login, no card, no email gate
    <div style="margin-top:8px;font-size:0.66rem;letter-spacing:0.06em;text-transform:none;color:rgba(237,229,216,0.45);line-height:1.6;">
      Built by <span style="color:rgba(255,140,26,0.85);font-weight:700;">Kory White</span> — 22-year revenue executive, architect of PULSE RevOps · <a href="https://www.linkedin.com/in/korywhite" target="_blank" rel="noopener">LinkedIn</a> · <a href="https://theexecutivereview.org/kory-white.html" target="_blank" rel="noopener">Featured on TheExecutiveReview</a> · <a href="/privacy">Privacy</a>
    </div>
  </div>
  <script src="/assets/visit-alert.js" defer></script>
  <script src="/assets/intent-beacon.js" defer></script>
</body>
</html>`;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=600, s-maxage=1800',
    },
    body: html,
  };
};

// Re-export registry for sitemap / IndexNow scripts
exports.TOOLS = TOOLS;
exports.liveDashboardUrl = liveDashboardUrl;
