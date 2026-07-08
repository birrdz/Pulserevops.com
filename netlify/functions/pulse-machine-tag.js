// ════════════════════════════════════════════════════════════════════════
// pulse-machine-tag — server-rendered landing page for one library tag.
//
// Mounted at /knowledge/tag/<tag> via netlify.toml redirect. Each tag
// becomes its own indexable URL with:
//   - Curated list of entries with that tag (full questions + snippets)
//   - JSON-LD CollectionPage schema
//   - Internal links to related tags (tag co-occurrence)
//   - OG meta + canonical
//
// Strategy: multiplies indexable surface from 1 library hub → N tag pages.
// Each one becomes its own SEO landing page for queries like
// "discount governance playbook" or "salesforce CRM hygiene".
// ════════════════════════════════════════════════════════════════════════

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const SITE = 'https://pulserevops.com';
const { pulseOrgLogoImageObject } = require('./lib/pulse-brand');

function initStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) { try { return getStore({ name: 'pulse-machine-library', siteID: sid, token: tok }); } catch (e) { return null; } }
  try { return getStore('pulse-machine-library'); } catch (e) { return null; }
}

function escHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}
function escAttr(s) { return escHtml(s); }

// Convert tag slug to readable title — "discount-governance" → "Discount Governance"
function tagTitle(tag) {
  return String(tag || '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function snippetOf(answer, n) {
  const text = String(answer || '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#*`>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.slice(0, n || 200) + (text.length > (n || 200) ? '…' : '');
}

exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  let rawTag = String(params.tag || '').toLowerCase().trim();

  // Netlify redirect query-param substitution can be flaky for :tag in the
  // `to` field — fall back to parsing the tag out of the original URL path.
  if (!rawTag) {
    const probe = event.path || event.rawUrl || '';
    // Accept underscores, ampersands (URL-encoded as %26), spaces (%20),
    // plus alphanumeric and hyphens. Some legacy tags include these chars.
    const m = probe.match(/\/(?:knowledge|sales-trainings|industry-kpis)\/tag\/([^/?#]+)/i);
    if (m) {
      try { rawTag = decodeURIComponent(m[1]).toLowerCase().trim(); }
      catch (e) { rawTag = m[1].toLowerCase().trim(); }
    }
  }

  // Validate tag — allow lowercase alphanum, hyphens, underscores, ampersands,
  // and spaces. Reject only control chars / path separators. Max 80 chars.
  // Invalid tag → 301 to the library hub so Google de-indexes the URL and
  // backlinks don't dead-end (matches the /press/* and /blog/* precedent).
  if (!rawTag || !/^[\w\s&.-]+$/.test(rawTag) || rawTag.length > 80) {
    return {
      statusCode: 301,
      headers: { Location: SITE + '/knowledge', 'Cache-Control': 'public, max-age=86400' },
      body: '',
    };
  }

  const store = initStore();
  if (!store) return { statusCode: 500, body: 'no store' };

  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const allEntries = idx.entries || [];

  // Filter entries with this tag
  const matched = allEntries.filter(e => (e.tags || []).map(t => t.toLowerCase()).includes(rawTag));

  // Tag exists in URL space but no entries match → 301 to the library hub
  // with ?tag=<slug> filter so Google replaces the URL with the canonical
  // destination instead of leaving hundreds of soft-404 ghosts in the index.
  if (!matched.length) {
    return {
      statusCode: 301,
      headers: {
        Location: SITE + '/knowledge?tag=' + encodeURIComponent(rawTag),
        'Cache-Control': 'public, max-age=86400',
      },
      body: '',
    };
  }

  const titleCase = tagTitle(rawTag);
  const url = SITE + '/knowledge/tag/' + rawTag;
  const desc = `${matched.length} researched ${titleCase} entries from Pulse Machine — autonomous AI knowledge engine for sales operations. Each answer is sourced, cited, and dated.`;

  // Pull full answers in parallel for snippets (cap to 50 to bound cost)
  const visible = matched.slice(0, 50);
  const fulls = await Promise.all(
    visible.map(e => store.get('answers/' + e.id + '.json', { type: 'json' }).catch(() => null))
  );

  // Co-occurring tags — find tags that frequently appear alongside this one
  const coTags = {};
  matched.forEach(e => {
    (e.tags || []).forEach(t => {
      const tl = t.toLowerCase();
      if (tl !== rawTag) coTags[tl] = (coTags[tl] || 0) + 1;
    });
  });
  const relatedTags = Object.entries(coTags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([t, c]) => ({ tag: t, count: c }));

  // JSON-LD CollectionPage + ItemList + Person/Organization for entity authority
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        url,
        name: `${titleCase} — Pulse Knowledge Library`,
        description: desc,
        isPartOf: { '@type': 'WebSite', name: 'Pulse RevOps · The Machine', url: SITE },
        about: { '@type': 'Thing', name: titleCase },
        editor: { '@id': SITE + '/#korywhite' },
        publisher: { '@id': SITE + '/#organization' },
        hasPart: visible.slice(0, 20).map(e => ({
          '@type': 'QAPage',
          url: SITE + '/knowledge/' + e.id,
          name: e.question,
        })),
      },
      {
        '@type': 'ItemList',
        url,
        numberOfItems: matched.length,
        itemListElement: visible.slice(0, 20).map((e, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: SITE + '/knowledge/' + e.id,
          name: e.question,
        })),
      },
      {
        '@type': 'Person',
        '@id': SITE + '/#korywhite',
        name: 'Kory White',
        jobTitle: 'Chief Revenue Officer',
        
        sameAs: [
          'https://www.linkedin.com/in/korywhite',
          'https://theexecutivereview.org/kory-white.html',
        ],
      },
      {
        '@type': 'Organization',
        '@id': SITE + '/#organization',
        name: 'Pulse RevOps',
        url: SITE,
        logo: pulseOrgLogoImageObject(),
        founder: { '@id': SITE + '/#korywhite' },
      },
    ],
  };

  const cardsHtml = visible.map((e, i) => {
    const full = fulls[i];
    const snippet = full && full.answer ? snippetOf(full.answer, 240) : '';
    const tagsHtml = (e.tags || []).slice(0, 5).map(t => {
      const isCurrent = t.toLowerCase() === rawTag;
      return `<a href="/knowledge/tag/${escAttr(t.toLowerCase())}" style="background:${isCurrent ? 'rgba(232,113,10,0.18)' : 'rgba(255,255,255,0.06)'};border:1px solid ${isCurrent ? 'rgba(232,113,10,0.45)' : 'rgba(255,255,255,0.08)'};color:${isCurrent ? '#FF8C1A' : 'rgba(237,229,216,0.7)'};padding:2px 9px;border-radius:99px;font-size:0.6rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;text-decoration:none;margin-right:4px;">${escHtml(t)}</a>`;
    }).join('');
    const date = new Date(e.ts || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `
      <article style="background:rgba(20,25,32,0.55);border:1px solid rgba(255,255,255,0.06);border-left:3px solid #E8710A;border-radius:10px;padding:18px 20px;margin-bottom:14px;transition:border-color 0.15s;">
        <h2 style="font-size:1.1rem;font-weight:700;color:#fff;line-height:1.35;margin:0 0 8px;">
          <a href="/knowledge/${escAttr(e.id)}" style="color:#fff;text-decoration:none;">${escHtml(e.question)}</a>
        </h2>
        <div style="margin-bottom:10px;">${tagsHtml}<span style="color:rgba(237,229,216,0.4);font-size:0.65rem;letter-spacing:0.1em;text-transform:uppercase;font-weight:700;margin-left:4px;">${escHtml(date)}</span></div>
        ${snippet ? `<p style="font-size:0.92rem;color:rgba(237,229,216,0.72);line-height:1.6;margin:0 0 10px;">${escHtml(snippet)}</p>` : ''}
        <a href="/knowledge/${escAttr(e.id)}" style="font-size:0.7rem;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;color:#FF8C1A;text-decoration:none;border-bottom:1px dotted rgba(255,140,26,0.4);">Read full answer ↗</a>
      </article>`;
  }).join('');

  const relatedTagsHtml = relatedTags.length
    ? `<div style="margin:32px 0 18px;padding:18px 20px;background:rgba(20,25,32,0.55);border:1px solid rgba(255,255,255,0.06);border-radius:10px;">
        <div style="font-size:0.66rem;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:#FF8C1A;margin-bottom:10px;">Related topics in the library</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${relatedTags.map(rt => `<a href="/knowledge/tag/${escAttr(rt.tag)}" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:rgba(237,229,216,0.85);padding:5px 12px;border-radius:99px;font-size:0.72rem;font-weight:600;text-decoration:none;transition:all 0.15s;">${escHtml(tagTitle(rt.tag))} <span style="color:rgba(237,229,216,0.4);">(${rt.count})</span></a>`).join('')}
        </div>
      </div>` : '';

  const truncationNote = matched.length > visible.length
    ? `<div style="text-align:center;margin:24px 0;font-size:0.78rem;color:rgba(237,229,216,0.5);">Showing ${visible.length} of ${matched.length} entries · <a href="/knowledge.html?tag=${escAttr(rawTag)}" style="color:#FF8C1A;">browse all in the library →</a></div>`
    : '';

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escHtml(titleCase)} — ${matched.length} entries · Pulse Knowledge Library</title>
  <meta name="description" content="${escAttr(desc)}">
  <meta name="keywords" content="${escAttr([rawTag, titleCase, ...relatedTags.slice(0,5).map(r => r.tag)].join(', '))}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escAttr(titleCase + ' — ' + matched.length + ' entries · Pulse Knowledge Library')}">
  <meta property="og:description" content="${escAttr(desc)}">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="Pulse RevOps">
  <meta property="og:image" content="${SITE}/pulse-og.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escAttr(titleCase + ' — Pulse Knowledge Library')}">
  <meta name="twitter:description" content="${escAttr(desc)}">
  <meta name="twitter:image" content="${SITE}/pulse-og.png">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png">
  <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <script type="application/ld+json">${JSON.stringify(ld)}</script>
  <style>
    *{box-sizing:border-box;}
    html,body{margin:0;padding:0;background:#070a0f;color:#EDE5D8;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.7;}
    a{color:#FF8C1A;text-decoration:none;}
    a:hover{text-decoration:underline;}
    .top{padding:24px clamp(20px,5vw,56px);display:flex;justify-content:space-between;align-items:center;font-size:0.7rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(237,229,216,0.65);border-bottom:1px solid rgba(255,255,255,0.05);}
    main{max-width:880px;margin:0 auto;padding:36px clamp(20px,5vw,40px) 64px;}
    .crumb{font-size:0.66rem;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(237,229,216,0.45);margin-bottom:14px;}
    .crumb a{color:rgba(237,229,216,0.65);}
    h1{font-size:clamp(2rem,4.2vw,3rem);font-weight:900;letter-spacing:-0.01em;line-height:1.15;margin:0 0 14px;color:#fff;}
    .lead{font-size:1.05rem;color:rgba(237,229,216,0.72);max-width:680px;margin:0 0 24px;}
    .stat-row{display:flex;flex-wrap:wrap;gap:18px;align-items:center;font-size:0.78rem;color:rgba(237,229,216,0.55);font-weight:600;margin-bottom:32px;padding-bottom:18px;border-bottom:1px solid rgba(255,255,255,0.06);}
    .stat-row b{color:#FF8C1A;font-weight:800;font-size:0.92rem;}
    .footer-note{padding:32px clamp(20px,5vw,56px);text-align:center;color:rgba(237,229,216,0.35);font-size:0.7rem;letter-spacing:0.1em;border-top:1px solid rgba(255,255,255,0.04);}
    .footer-note a{color:rgba(255,140,26,0.7);}
  </style>
<link rel="stylesheet" href="/assets/pulse-tan.css"></head>
<body>
  <div class="top">
    <span><a href="/">PULSE REVOPS</a></span>
    <span><a href="/knowledge.html">📚 Library</a> &nbsp;·&nbsp; <a href="/themachine">The Machine</a></span>
  </div>
  <main>
    <div class="crumb"><a href="/">Pulse</a> · <a href="/knowledge.html">Library</a> · ${escHtml(titleCase)}</div>
    <h1>${escHtml(titleCase)}</h1>
    <p class="lead">${escHtml(desc)}</p>
    <div class="stat-row">
      <span><b>${matched.length}</b> ${matched.length === 1 ? 'entry' : 'entries'}</span>
      <span><b>${relatedTags.length}</b> related topics</span>
      <span>Updated <b>${escHtml(new Date(matched[0].ts || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }))}</b></span>
    </div>

    ${cardsHtml}
    ${truncationNote}
    ${relatedTagsHtml}
  </main>
  <div class="footer-note">
    Researched autonomously by <a href="/themachine">The Machine</a> · Claude Sonnet 4.6 + live web search
    <div style="margin-top:8px;font-size:0.74rem;letter-spacing:0.04em;text-transform:none;color:rgba(237,229,216,0.5);line-height:1.65;">
      Curated by Chief Revenue Officer <a href="https://www.linkedin.com/in/korywhite" target="_blank" rel="noopener" data-pulse-click="curator" style="color:rgba(255,140,26,0.9);font-weight:800;text-decoration:none;">Kory White</a> &middot; <a href="https://crosyndicate.com/" target="_blank" rel="noopener" data-pulse-click="cro-syndicate" style="color:rgba(255,140,26,0.85);font-weight:800;text-decoration:none;">CRO Syndicate</a> &middot; <a href="https://www.linkedin.com/in/korywhite" target="_blank" rel="noopener" style="color:rgba(255,140,26,0.7);">LinkedIn</a> · <a href="/privacy">Privacy</a>
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
      'Cache-Control': 'public, max-age=300, s-maxage=600',
    },
    body: html,
  };
};
