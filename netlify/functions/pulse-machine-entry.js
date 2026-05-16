// ════════════════════════════════════════════════════════════════════════
// pulse-machine-entry — server-renders one library entry as a full HTML
// page at its own URL, so every Q/A becomes independently indexable in
// Google + Perplexity + ChatGPT. Each entry gets:
//   - Per-page <title>, <meta description>, OG/Twitter cards
//   - QAPage + TechArticle JSON-LD with this entry as mainEntity
//   - Server-rendered markdown (so crawlers don't need to execute JS)
//   - Mermaid client-side render for diagrams
//   - Deep Dive cluster links (3 related entries by tag overlap)
//   - Citation cards
//
// Mounted at /knowledge/<id> via netlify.toml redirect.
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

function escHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}
function escAttr(s) { return escHtml(s); }
function hostOf(u) { try { return new URL(u).hostname.replace(/^www\./,''); } catch(e) { return u; } }

// ── Markdown → HTML (server-side, no deps). Same dialect as /knowledge.html
const URL_RE = /\bhttps?:\/\/[^\s<>"'\)\]]+/g;
function renderInline(text) {
  // Stash already-converted markdown links behind opaque placeholders so the
  // bare-URL pass below can't re-match URLs inside their own href attributes
  // (the bug that produced HTML-soup like `[label](url" target="_blank">label)`
  // on entry pages — markdown link gets HTML-ified, then URL_RE re-wraps the
  // URL inside the href, and the inner replacement breaks the outer tag).
  const mdLinks = [];
  text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, l, u) => {
    const i = mdLinks.length;
    mdLinks.push('<a href="' + u + '" target="_blank" rel="noopener noreferrer">' + escHtml(l) + '</a>');
    return '\x00MDLINK' + i + '\x00';
  });
  text = text.replace(/`([^`]+)`/g, (_, c) => '<code>' + escHtml(c) + '</code>');
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  text = text.replace(URL_RE, u => '<a href="' + u + '" target="_blank" rel="noopener noreferrer">' + u + '</a>');
  // Restore the markdown-link placeholders.
  text = text.replace(/\x00MDLINK(\d+)\x00/g, (_, i) => mdLinks[parseInt(i, 10)]);
  return text;
}
function renderTable(lines) {
  const rows = lines.map(l => l.replace(/^\||\|$/g, '').split('|').map(c => c.trim()))
    .filter(r => !r.every(c => /^[:\-\s]+$/.test(c)));
  if (!rows.length) return '';
  const head = rows[0]; const body = rows.slice(1);
  return '<table><thead><tr>' + head.map(c => '<th>' + renderInline(escHtml(c)) + '</th>').join('') + '</tr></thead><tbody>'
    + body.map(r => '<tr>' + r.map(c => '<td>' + renderInline(escHtml(c)) + '</td>').join('') + '</tr>').join('')
    + '</tbody></table>';
}
function renderMd(text) {
  text = String(text || '').replace(/\r\n/g, '\n').trim();
  const lines = text.split('\n'); const out = []; let i = 0; let paraBuf = [];
  const flush = () => { if (paraBuf.length) { const j = paraBuf.join(' ').trim(); if (j) out.push('<p>' + renderInline(escHtml(j)) + '</p>'); paraBuf = []; } };
  while (i < lines.length) {
    const line = lines[i]; const t = line.trim();
    if (/^```mermaid\s*$/i.test(t)) {
      flush(); i++; const mer = [];
      while (i < lines.length && !/^```/.test(lines[i].trim())) { mer.push(lines[i]); i++; }
      i++;
      const src = mer.join('\n').trim();
      if (src) out.push('<div class="mermaid-wrap"><div class="mermaid">' + escHtml(src) + '</div></div>');
      continue;
    }
    if (!t) { flush(); i++; continue; }
    if (/^#{2,3}\s+/.test(t)) {
      flush(); const lvl = t.match(/^(#{2,3})/)[1].length;
      const c = t.replace(/^#{2,3}\s+/, '');
      out.push('<h' + lvl + '>' + renderInline(escHtml(c)) + '</h' + lvl + '>'); i++; continue;
    }
    if (/^\|.*\|/.test(t) && i + 1 < lines.length && /^\|[\s:|-]+\|/.test(lines[i+1].trim())) {
      flush(); const tbl = [];
      while (i < lines.length && /^\|.*\|/.test(lines[i].trim())) { tbl.push(lines[i].trim()); i++; }
      out.push(renderTable(tbl)); continue;
    }
    if (/^[-•*]\s+/.test(t)) {
      flush(); const items = [];
      while (i < lines.length && /^[-•*]\s+/.test(lines[i].trim())) { items.push(lines[i].trim().replace(/^[-•*]\s+/, '')); i++; }
      out.push('<ul>' + items.map(x => '<li>' + renderInline(escHtml(x)) + '</li>').join('') + '</ul>'); continue;
    }
    if (/^\d+\.\s+/.test(t)) {
      flush(); const nums = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) { nums.push(lines[i].trim().replace(/^\d+\.\s+/, '')); i++; }
      out.push('<ol>' + nums.map(x => '<li>' + renderInline(escHtml(x)) + '</li>').join('') + '</ol>'); continue;
    }
    paraBuf.push(t); i++;
  }
  flush();
  return out.join('');
}

function findRelated(entry, allEntries, n) {
  n = n || 3;
  const myTagsArr = Array.isArray(entry.tags) ? entry.tags : [];
  const myTags = new Set(myTagsArr);
  if (!myTags.size) return [];
  return allEntries
    .filter(e => e.id !== entry.id)
    .map(e => {
      let overlap = 0;
      const tagsArr = Array.isArray(e.tags) ? e.tags : [];
      tagsArr.forEach(t => { if (myTags.has(t)) overlap++; });
      return { e, score: overlap };
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score || b.e.ts - a.e.ts)
    .slice(0, n)
    .map(x => x.e);
}

// AEO snippet-bait excerpt for meta description / OG / Twitter cards.
// The Machine's answers follow this structure:
//   ## Heading\n\n**40-50 word answer paragraph**\n\n---\n\n### THE DETAIL...
// We want the bold answer paragraph (snippet-bait), not the heading.
// Walk paragraphs in order, skip any that are pure headings or rules,
// and use the first real prose block. Strip markdown so the snippet
// renders cleanly in Google search results.
function stripMd(s) {
  return String(s || '')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')           // images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')        // links → text
    .replace(/`([^`]+)`/g, '$1')                    // inline code
    .replace(/\*\*([^*]+)\*\*/g, '$1')              // bold
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '$1')     // italic
    .replace(/^#{1,6}\s+/gm, '')                    // heading markers
    .replace(/^\s*[-*+]\s+/gm, '')                  // list bullets
    .replace(/^\s*\d+\.\s+/gm, '')                  // numbered list
    .replace(/^\s*>\s*/gm, '')                      // blockquote
    .replace(/\s+/g, ' ')
    .trim();
}
function descExcerpt(answer) {
  if (!answer) return '';
  const blocks = String(answer).split(/\n\s*\n/);
  for (const b of blocks) {
    const t = b.trim();
    if (!t) continue;
    if (/^#{1,6}\s/.test(t)) continue;             // skip pure heading
    if (/^[-=*_]{3,}\s*$/.test(t)) continue;       // skip horizontal rule
    if (/^```/.test(t)) continue;                  // skip code fence
    if (/^\|/.test(t)) continue;                   // skip table
    const cleaned = stripMd(t);
    if (cleaned.length < 40) continue;             // skip tiny fragments
    return cleaned.slice(0, 240);
  }
  return stripMd(answer).slice(0, 240);
}

exports.handler = async (event) => {
  // Extract id from path: /knowledge/<id> OR ?id=<id>
  let id = null;
  const params = event.queryStringParameters || {};
  if (params.id) id = String(params.id).replace(/[^\w-]/g, '');
  if (!id && event.path) {
    const m = event.path.match(/\/knowledge\/([\w-]+)/);
    if (m) id = m[1];
  }
  if (!id) return { statusCode: 404, headers: { 'Content-Type': 'text/html' }, body: '<h1>404</h1><p>No entry id provided.</p>' };

  const store = initStore();
  if (!store) return { statusCode: 503, headers: { 'Content-Type': 'text/html' }, body: '<h1>503</h1><p>Library not available.</p>' };

  let entry, idx;
  try {
    entry = await store.get('answers/' + id + '.json', { type: 'json' });
    idx   = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  } catch (e) {
    return { statusCode: 500, headers: { 'Content-Type': 'text/html' }, body: '<h1>500</h1><p>Error reading library.</p>' };
  }
  // Index is source of truth for quality_score and polished_at — per-entry
  // blobs may carry stale values from before the score-system rebuild.
  if (entry && idx && Array.isArray(idx.entries)) {
    const idxEntry = idx.entries.find(e => e && e.id === id);
    if (idxEntry) {
      if (typeof idxEntry.quality_score === 'number') entry.quality_score = idxEntry.quality_score;
      entry.polished_at = idxEntry.polished_at || null;
    }
  }
  if (!entry) {
    return {
      statusCode: 404,
      headers: { 'Content-Type': 'text/html' },
      body: '<!doctype html><html><head><title>Not found · Pulse Library</title><meta name="robots" content="noindex"></head><body style="background:#070a0f;color:#EDE5D8;font-family:sans-serif;padding:40px;"><h1>Entry not found</h1><p>This library entry doesn\'t exist or has been removed.</p><p><a href="/knowledge.html" style="color:#FF8C1A;">Back to the library</a></p></body></html>',
    };
  }

  const url       = SITE + '/knowledge/' + id;
  const title     = (entry.question || '').slice(0, 70);
  const desc      = descExcerpt(entry.answer);
  const tagsList  = entry.tags || [];
  const sourcesArr= entry.sources || [];
  const related   = findRelated({ id, tags: tagsList }, idx.entries || [], 10);

  // Prev/Next neighbors by q-ID numeric order — gives Google explicit
  // sequential crawl pathing via <link rel="prev">/<link rel="next">.
  // Also rendered as a nav at the bottom of the page for human users.
  function qNum(qid) {
    const m = /^q0*(\d+)$/.exec(qid || '');
    return m ? parseInt(m[1], 10) : null;
  }
  const allQEntries = (idx.entries || []).filter(e => e && /^q\d+$/.test(e.id || '')).map(e => ({ id: e.id, n: qNum(e.id), question: e.question || '' })).filter(e => e.n !== null).sort((a, b) => a.n - b.n);
  const myIdx = allQEntries.findIndex(e => e.id === id);
  const prevQ = myIdx > 0 ? allQEntries[myIdx - 1] : null;
  const nextQ = myIdx >= 0 && myIdx < allQEntries.length - 1 ? allQEntries[myIdx + 1] : null;
  const prevUrl = prevQ ? (SITE + '/knowledge/' + prevQ.id) : '';
  const nextUrl = nextQ ? (SITE + '/knowledge/' + nextQ.id) : '';
  const seqNavLinks = (prevQ ? '<link rel="prev" href="' + prevUrl + '">' : '') + (nextQ ? '<link rel="next" href="' + nextUrl + '">' : '');
  // Crawl-flow boost: 15 random recent entries (last 200 pool) for Google to follow.
  // "Discovered - not indexed" is the dominant GSC reason; more in-page links to
  // not-yet-crawled URLs gives Google fresh discovery paths from indexed pages.
  const recentPool = (idx.entries || []).filter(e => e && e.id && e.id !== id).slice(0, 200);
  const moreLinks = [];
  const usedIds = new Set([id, ...related.map(r => r.id)]);
  for (let i = 0; i < 15 && recentPool.length; i++) {
    const pick = recentPool[Math.floor(Math.random() * recentPool.length)];
    if (pick && !usedIds.has(pick.id)) { moreLinks.push(pick); usedIds.add(pick.id); }
  }
  const datePub   = new Date(entry.ts || Date.now()).toISOString();

  // JSON-LD: QAPage + TechArticle. Author attribution names BOTH the Machine
  // (the AI agent that researched the answer) AND Kory White as editor — the
  // human operator whose 22-year revenue expertise stands behind the curation.
  // Strengthens E-E-A-T signal for Google + AI Overviews.
  const machineAuthor = {
    "@type": "Organization",
    "@id": SITE + "/#themachine",
    "name": "Pulse RevOps · The Machine",
    "url": SITE + "/themachine",
    "description": "Autonomous AI knowledge engine for Sales RevOps. Researches one operator question every 30 minutes with Claude Sonnet 4.6 + live web search."
  };
  const koryEditor = {
    "@type": "Person",
    "@id": SITE + "/#korywhite",
    "name": "Kory White",
    "jobTitle": "Chief Revenue Officer",
    "url": SITE + "/resume",
    "image": SITE + "/assets/kory-white.jpg",
    "sameAs": [
      "https://www.linkedin.com/in/korywhite",
      "https://theexecutivereview.org/kory-white.html",
      SITE + "/resume"
    ]
  };
  const publisherOrg = {
    "@type": "Organization",
    "@id": SITE + "/#organization",
    "name": "Pulse RevOps",
    "url": SITE,
    "founder": koryEditor,
    "logo": { "@type": "ImageObject", "url": SITE + "/og-preview.jpg" }
  };

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "QAPage",
        "url": url,
        "mainEntity": {
          "@type": "Question",
          "name": entry.question,
          "answerCount": 1,
          "datePublished": datePub,
          "author": machineAuthor,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": String(entry.answer || '').slice(0, 5000),
            "url": url,
            "datePublished": datePub,
            "author": machineAuthor
          }
        }
      },
      {
        "@type": "TechArticle",
        "headline": entry.question,
        "url": url,
        "datePublished": datePub,
        "dateModified": (entry.polished_at ? new Date(entry.polished_at).toISOString() : datePub),
        "keywords": tagsList.join(', '),
        "author":    machineAuthor,
        "editor":    koryEditor,
        "publisher": publisherOrg,
        "mainEntityOfPage": { "@type": "WebPage", "@id": url },
        "description": desc
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home",      "item": SITE + "/" },
          { "@type": "ListItem", "position": 2, "name": "Knowledge Library", "item": SITE + "/knowledge.html" },
          { "@type": "ListItem", "position": 3, "name": entry.question, "item": url }
        ]
      }
    ]
  };

  // Always render the original Operator voice (entry.answer) for uniform UX
  // across the entire library. The In-Between bake was disabled 2026-05-04;
  // any partial-baked answer_between fields are ignored.
  const renderedAnswer = renderMd(entry.answer);

  // Word count for the meta row — strip markdown noise (code fences, URLs,
  // table pipes, heading hashes) so the count reflects readable prose.
  const wordCount = (() => {
    const raw = String(entry.answer || '');
    const cleaned = raw
      .replace(/```[\s\S]*?```/g, ' ')        // fenced code blocks (mermaid, etc.)
      .replace(/https?:\/\/\S+/g, ' ')         // URLs
      .replace(/[#>*_`~|\-=]/g, ' ')           // markdown punctuation
      .replace(/\s+/g, ' ')
      .trim();
    return cleaned ? cleaned.split(' ').filter(Boolean).length : 0;
  })();
  const wordCountFmt = wordCount.toLocaleString('en-US');

  // Normalize sources — entries store them as either string URLs OR {url, title} objects
  const normalizedSources = sourcesArr
    .map(s => typeof s === 'string' ? { url: s, title: '' } : s)
    .filter(s => s && s.url);
  const sourcesHtml = normalizedSources.length
    ? '<div class="entry-sources"><div class="entry-sources-label">Sources cited</div>'
      + normalizedSources.map(s => '<a class="entry-source" href="' + escAttr(s.url) + '" target="_blank" rel="noopener noreferrer">'
          + '<span class="es-host">' + escHtml(hostOf(s.url)) + '</span>'
          + '<span class="es-title">' + escHtml(s.title || s.url) + '</span></a>').join('')
      + '</div>' : '';

  const relatedHtml = related.length
    ? '<div class="entry-sources" style="margin-top:18px;"><div class="entry-sources-label">Deep dive · related in the library</div>'
      + related.map(r => '<a class="entry-source" href="/knowledge/' + escAttr(r.id) + '">'
          + '<span class="es-host">' + escHtml((r.tags || []).slice(0, 2).join(' · ') || '·') + '</span>'
          + '<span class="es-title">' + escHtml(r.question) + '</span></a>').join('')
      + '</div>' : '';
  const moreHtml = moreLinks.length
    ? '<div class="entry-sources" style="margin-top:18px;"><div class="entry-sources-label">More from the library</div>'
      + moreLinks.map(r => '<a class="entry-source" href="/knowledge/' + escAttr(r.id) + '">'
          + '<span class="es-host">' + escHtml((r.tags || []).slice(0, 2).join(' · ') || '·') + '</span>'
          + '<span class="es-title">' + escHtml(r.question || r.id) + '</span></a>').join('')
      + '</div>' : '';

  // ── Apply-this-in-PULSE — dynamic operator-tools section based on tags.
  // Cross-link from library entries into the free CRM / pillar pages so
  // the library compounds value out instead of dead-ending on read.
  const tagSet = new Set((tagsList || []).map(t => String(t).toLowerCase()));
  const tagText = (entry.question + ' ' + (entry.answer || '').slice(0, 400)).toLowerCase();
  function matchAny(words) {
    return words.some(w => tagSet.has(w) || tagText.includes(w));
  }
  const tools = [];
  if (matchAny(['discount', 'discount-governance', 'deal-desk', 'pricing-authority', 'pricing-discipline', 'shadow-pricing', 'cpq']))
    tools.push({ href: '/pillars/deal-desk-architecture-scaled-governance', title: 'Pillar · Deal Desk Architecture', sub: 'From founder override to scaled governance' });
  if (matchAny(['founder', 'founder-led', 'early-stage', 'series-a', 'series-b', 'pmf', 'product-market-fit']))
    tools.push({ href: '/pillars/founder-led-sales-governance-stack', title: 'Pillar · Founder-Led Sales Governance', sub: 'The governance stack that scales' });
  if (matchAny(['crm', 'salesforce', 'hubspot', 'data-hygiene', 'pipeline-hygiene', 'cro-strategy', 'cro-playbook']))
    tools.push({ href: '/dashboard.html#rev-intel-section', title: 'Free CRM · Revenue Intelligence', sub: 'Audit pipeline, score reps, ship the fix' });
  if (matchAny(['pulse-check', 'rep-scoring', 'coaching', 'performance', 'attainment']))
    tools.push({ href: '/dashboard.html#inline-matrix', title: 'Pulse Check', sub: 'Score reps on the metrics that matter' });
  if (matchAny(['comp', 'ote', 'compensation', 'accelerators', 'quota', 'gross-profit']))
    tools.push({ href: '/dashboard.html#profit-calc-section', title: 'Gross Profit Calculator', sub: 'Model margin per deal, per rep, per territory' });
  if (matchAny(['hiring', 'recruiting', 'headcount', 'ramp']))
    tools.push({ href: '/dashboard.html#recruiting-calc-section', title: 'Recruiting Calculator', sub: 'How many reps you need before you hire' });
  if (matchAny(['scheduling', 'shift', 'capacity', 'territory']))
    tools.push({ href: '/dashboard.html#sched-matrix-section', title: 'Rep Scheduling Matrix', sub: 'Protect high-value selling time' });
  if (matchAny(['saas', 'arr', 'nrr', 'churn']))
    tools.push({ href: '/how-tos/saas.html#silent-killer', title: 'How-To · SaaS Churn', sub: 'Silent revenue killer playbook' });
  if (matchAny(['hvac', 'home-services', 'service-fleet']))
    tools.push({ href: '/how-tos/hvac.html#million-ceiling', title: 'How-To · The $1M HVAC Ceiling', sub: 'Capacity, routing, maintenance density' });

  const toolsHtml = tools.length
    ? '<div class="entry-sources" style="margin-top:18px;border-color:rgba(232,113,10,0.35);"><div class="entry-sources-label" style="color:#FF8C1A;">⌬ Apply this in PULSE</div>'
      + tools.slice(0, 3).map(t => '<a class="entry-source" href="' + escAttr(t.href) + '" style="border-color:rgba(232,113,10,0.25);">'
          + '<span class="es-host" style="color:rgba(255,140,26,0.7);">' + escHtml(t.title) + '</span>'
          + '<span class="es-title">' + escHtml(t.sub) + '</span></a>').join('')
      + '</div>' : '';

  const tagsHtml = tagsList.map(t => {
    const slug = String(t).toLowerCase().replace(/[^a-z0-9-]/g, '');
    return '<a class="entry-tag" href="/knowledge/tag/' + escAttr(slug) + '">' + escHtml(t) + '</a>';
  }).join('');

  // Share buttons — pre-populated with the question + URL for one-click
  // distribution of the autonomously researched content.
  const shareText  = encodeURIComponent(entry.question + ' — Pulse Knowledge Library');
  const shareUrl   = encodeURIComponent(url);
  const linkedInUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' + shareUrl;
  const xUrl        = 'https://twitter.com/intent/tweet?text=' + shareText + '&url=' + shareUrl + '&via=coachkorywhite';
  const facebookUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + shareUrl;
  const emailUrl    = 'mailto:?subject=' + shareText + '&body=' + encodeURIComponent('From the Pulse Knowledge Library:\n\n' + entry.question + '\n\n' + url);
  const shareHtml = '<div class="share-row" aria-label="Share this answer">'
    + '<span class="share-label">Share:</span>'
    + '<a class="share-btn" href="' + linkedInUrl + '" target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">in</a>'
    + '<a class="share-btn" href="' + xUrl       + '" target="_blank" rel="noopener noreferrer" aria-label="Share on X">𝕏</a>'
    + '<a class="share-btn" href="' + facebookUrl + '" target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">f</a>'
    + '<a class="share-btn" href="' + emailUrl   + '" aria-label="Share via email">✉</a>'
    + '<button class="share-btn copy-link" type="button" data-url="' + escAttr(url) + '" aria-label="Copy link">⎘</button>'
    + '</div>';

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escHtml(title)} — Pulse Knowledge Library</title>
  <meta name="description" content="${escAttr(desc)}">
  <meta name="keywords" content="${escAttr(tagsList.join(', '))}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
  <link rel="canonical" href="${url}">
  ${seqNavLinks}
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escAttr(title)}">
  <meta property="og:description" content="${escAttr(desc)}">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="Pulse RevOps">
  <meta property="og:image" content="${SITE}/og-preview.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escAttr(title)}">
  <meta name="twitter:description" content="${escAttr(desc)}">
  <meta name="twitter:image" content="${SITE}/og-preview.jpg">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23E8710A' d='M3 12h3l2-7 4 14 2-7h7'/%3E%3C/svg%3E">
  <script type="application/ld+json">${JSON.stringify(ld)}</script>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <script>
    if (window.mermaid && window.mermaid.initialize) {
      window.mermaid.initialize({
        startOnLoad: true, theme: 'dark', securityLevel: 'loose',
        themeVariables: { fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
          primaryColor:'#1a1f29', primaryTextColor:'#EDE5D8', primaryBorderColor:'#E8710A',
          lineColor:'rgba(232,113,10,0.65)', mainBkg:'#1a1f29', textColor:'#EDE5D8' },
      });
    }
  </script>
  <style>
    :root { --orange:#E8710A; --orange-bright:#FF8C1A; --ink:#EDE5D8; --bg:#070a0f; --muted:rgba(237,229,216,0.5); }
    *{box-sizing:border-box;}
    html,body{margin:0;padding:0;background:var(--bg);color:var(--ink);font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.7;}
    a{color:var(--orange-bright);text-decoration:none;}
    a:hover{text-decoration:underline;}
    .top{padding:24px clamp(20px,5vw,56px);display:flex;justify-content:space-between;align-items:center;font-size:0.7rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(237,229,216,0.65);border-bottom:1px solid rgba(255,255,255,0.05);}
    .top a{color:var(--orange-bright);}
    article{max-width:880px;margin:0 auto;padding:36px clamp(20px,5vw,40px) 64px;}
    .crumb{font-size:0.66rem;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:var(--muted);margin-bottom:14px;}
    .crumb a{color:var(--muted);}
    h1.q{font-size:clamp(1.8rem,3.4vw,2.6rem);font-weight:900;letter-spacing:-0.01em;line-height:1.2;margin:0 0 18px;}
    .meta-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;font-size:0.66rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(237,229,216,0.45);margin-bottom:28px;}
    .entry-tag{display:inline-block;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);color:rgba(237,229,216,0.7);padding:3px 9px;border-radius:99px;font-size:0.6rem;text-decoration:none;transition:all 0.12s;}
    a.entry-tag:hover{background:rgba(232,113,10,0.12);border-color:rgba(232,113,10,0.4);color:rgba(255,180,90,0.9);text-decoration:none;}
    .body p{margin:0 0 16px;color:rgba(237,229,216,0.94);font-size:1.15rem;}
    .body strong{color:#fff;}
    .body h2,.body h3{font-size:0.82rem;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:var(--orange-bright);margin:22px 0 10px;}
    .body ul,.body ol{margin:8px 0 16px;padding-left:24px;}
    .body li{margin-bottom:7px;font-size:1.1rem;}
    .body table{width:100%;border-collapse:collapse;margin:14px 0 18px;font-size:0.92rem;}
    .body th,.body td{padding:8px 12px;text-align:left;border-bottom:1px solid rgba(255,255,255,0.08);}
    .body th{color:var(--orange-bright);font-weight:800;letter-spacing:0.04em;text-transform:uppercase;font-size:0.72rem;}
    .body code{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);padding:1px 6px;border-radius:4px;font-family:'JetBrains Mono','SF Mono',monospace;font-size:0.85em;color:#FFD740;}
    .body .mermaid-wrap{margin:14px 0;padding:18px;background:rgba(0,0,0,0.4);border:1px solid rgba(232,113,10,0.18);border-radius:10px;overflow-x:auto;text-align:center;position:relative;}
    .body .mermaid-wrap svg{max-width:100% !important;height:auto !important;cursor:zoom-in;transition:transform 0.15s;}
    .body .mermaid-wrap svg:hover{transform:scale(1.01);}
    .body .mermaid-wrap::after{content:"⛶ click to zoom";position:absolute;top:8px;right:12px;font-size:0.6rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,140,26,0.55);pointer-events:none;}
    .viz-lightbox{position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:9999;display:none;align-items:center;justify-content:center;padding:24px;cursor:zoom-out;}
    .viz-lightbox.show{display:flex;}
    .viz-lightbox-inner{width:96vw;height:92vh;max-width:1600px;background:#0e1218;border:1px solid rgba(232,113,10,0.4);border-radius:14px;padding:24px;overflow:auto;display:flex;align-items:center;justify-content:center;}
    .viz-lightbox-inner svg{width:100%;height:auto;max-height:88vh;display:block;}
    .viz-lightbox-close{position:absolute;top:18px;right:22px;background:rgba(232,113,10,0.18);border:1px solid rgba(232,113,10,0.55);color:#FFD7A8;font-size:1.4rem;width:42px;height:42px;border-radius:50%;cursor:pointer;font-weight:900;line-height:1;display:flex;align-items:center;justify-content:center;}
    .viz-lightbox-close:hover{background:rgba(232,113,10,0.35);}
    .dl-btn{display:inline-flex;align-items:center;gap:6px;background:rgba(232,113,10,0.1);border:1px solid rgba(232,113,10,0.4);color:#FFB46A;padding:6px 12px;border-radius:8px;font-family:inherit;font-size:0.7rem;font-weight:700;letter-spacing:0.06em;cursor:pointer;text-decoration:none;transition:all 0.15s;}
    .dl-btn:hover{background:rgba(232,113,10,0.22);border-color:rgba(232,113,10,0.7);color:#FFD7A8;text-decoration:none;}
    .dl-row{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0 4px;padding-top:14px;border-top:1px solid rgba(255,255,255,0.06);}
    .dl-label{font-size:0.6rem;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;color:rgba(237,229,216,0.45);margin-right:4px;align-self:center;}
    .entry-sources{margin-top:22px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.08);}
    .entry-sources-label{font-size:0.6rem;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;color:rgba(237,229,216,0.45);margin-bottom:8px;}
    .entry-source{display:flex;gap:12px;padding:10px 14px;margin:6px 0;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:8px;align-items:center;text-decoration:none;color:rgba(237,229,216,0.85);}
    .entry-source:hover{background:rgba(232,113,10,0.06);border-color:rgba(232,113,10,0.45);text-decoration:none;}
    .entry-source .es-host{font-size:0.62rem;color:rgba(237,229,216,0.45);letter-spacing:0.08em;text-transform:uppercase;flex-shrink:0;}
    .entry-source .es-title{font-size:0.92rem;color:rgba(237,229,216,0.9);flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
    .footer-note{padding:24px;text-align:center;color:rgba(237,229,216,0.35);font-size:0.66rem;letter-spacing:0.16em;}
    .share-row{display:flex;align-items:center;gap:8px;margin:24px 0 4px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.06);}
    .share-label{font-size:0.6rem;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;color:rgba(237,229,216,0.45);margin-right:4px;}
    .share-btn{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:8px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);color:rgba(237,229,216,0.7);font-family:inherit;font-size:0.95rem;font-weight:600;cursor:pointer;text-decoration:none;transition:all 0.15s;}
    .share-btn:hover{border-color:rgba(232,113,10,0.55);color:var(--orange-bright);background:rgba(232,113,10,0.06);text-decoration:none;}
    .share-btn.copied{color:var(--green,#22c55e);border-color:rgba(34,197,94,0.5);}
    .layman-hero{margin:0 0 22px;padding:18px 22px;background:linear-gradient(135deg,rgba(255,140,26,0.18),rgba(232,113,10,0.1));border:2px solid rgba(255,140,26,0.55);border-radius:14px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;box-shadow:0 4px 14px rgba(232,113,10,0.15);}
    .layman-hero-text{flex:1;min-width:200px;}
    .layman-hero-title{font-size:0.96rem;font-weight:900;color:#FFD7A8;letter-spacing:0.01em;line-height:1.3;margin-bottom:3px;}
    .layman-hero-sub{font-size:0.78rem;color:rgba(237,229,216,0.7);line-height:1.4;}
    .layman-row{margin:18px 0 4px;}
    .layman-btn{display:inline-flex;align-items:center;gap:10px;background:linear-gradient(180deg,#FF8C1A,#E8710A);border:none;color:#0a0a0a;padding:14px 22px;border-radius:12px;font-family:inherit;font-size:0.92rem;font-weight:900;letter-spacing:0.04em;cursor:pointer;transition:all 0.15s;box-shadow:0 3px 10px rgba(232,113,10,0.4);white-space:nowrap;}
    .layman-btn:hover:not([disabled]){transform:translateY(-1px);box-shadow:0 5px 16px rgba(232,113,10,0.55);background:linear-gradient(180deg,#FFA640,#FF8C1A);}
    .layman-btn[disabled]{opacity:0.65;cursor:wait;}
    .voice-btn{padding:10px 14px;font-size:0.82rem;letter-spacing:0.02em;}
    .voice-btn .lb-icon{font-size:1rem;}
    .voice-btn:not(.voice-active){background:rgba(255,140,26,0.08);color:rgba(255,215,168,0.85);box-shadow:none;border:1px solid rgba(255,140,26,0.35);}
    .voice-btn:not(.voice-active):hover{background:rgba(255,140,26,0.15);color:#FFD7A8;}
    .voice-btn.voice-active{background:linear-gradient(180deg,#FF8C1A,#E8710A);color:#0a0a0a;box-shadow:0 3px 10px rgba(232,113,10,0.4);border:none;}
    .layman-btn .lb-icon{font-size:1.2rem;}
    .layman-hero .layman-btn{margin:0;}
    .layman-panel{margin-top:14px;padding:18px 20px;background:rgba(255,140,26,0.05);border:1px dashed rgba(255,140,26,0.4);border-radius:10px;color:rgba(237,229,216,0.95);font-size:1rem;line-height:1.65;display:none;}
    .layman-panel.show{display:block;animation:layfade 0.35s ease-out;}
    .layman-panel .lp-label{font-size:0.6rem;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;color:#FF8C1A;margin-bottom:10px;display:block;}
    .layman-panel p{margin:0 0 10px;}
    .layman-panel em{color:rgba(255,203,128,0.9);font-style:italic;}
    .layman-panel ul,.layman-panel ol{margin:8px 0 10px 22px;padding:0;}
    @keyframes layfade{from{opacity:0;transform:translateY(-4px);}to{opacity:1;transform:translateY(0);}}
    @media print {
      html,body{background:#fff !important;color:#111 !important;}
      .top,.dl-row,.share-row,.viz-dl-bar,#social-panel,#voice-switcher,.viz-lightbox,.entry-tools,.related-list,#feedback-row,#read-progress,#scroll-top{display:none !important;}
      a{color:#111 !important;text-decoration:none !important;}
      article{max-width:none !important;padding:0 !important;}
      .body{color:#111 !important;}
      .body h1,.body h2,.body h3{color:#111 !important;page-break-after:avoid;}
      .body p,.body li,.body td,.body th{color:#111 !important;}
      .body .mermaid-wrap{background:#fff !important;border:1px solid #ccc !important;page-break-inside:avoid;}
      .body table{page-break-inside:avoid;}
      .footer-note{color:#666 !important;border-top:1px solid #ccc;padding-top:12px;margin-top:24px;font-size:9pt;}
    }
  </style>
</head>
<body>
  <div id="read-progress" aria-hidden="true" style="position:fixed;top:0;left:0;height:3px;width:0;background:linear-gradient(90deg,#FF8C1A,#FFD740);z-index:9999;transition:width 0.1s linear;box-shadow:0 0 8px rgba(255,140,26,0.5);"></div>
  <button id="scroll-top" type="button" aria-label="Scroll to top" style="position:fixed;bottom:24px;right:24px;width:42px;height:42px;border-radius:50%;background:rgba(232,113,10,0.92);border:1px solid rgba(255,255,255,0.18);color:#fff;font-size:1.1rem;font-weight:900;cursor:pointer;z-index:9000;opacity:0;pointer-events:none;transition:opacity 0.2s, transform 0.15s;box-shadow:0 6px 20px rgba(232,113,10,0.4);font-family:inherit;">↑</button>
  <div class="top">
    <a href="/">Pulse</a>
    <span><a href="/knowledge.html">← Library</a></span>
  </div>
  <article>
    <div class="crumb"><a href="/knowledge.html">Knowledge Library</a> · ${escHtml(tagsList[0] || 'Sales')}</div>
    <div style="margin:0 0 12px;">
      ${(() => {
        const sc = typeof entry.quality_score === 'number' ? entry.quality_score : 5;
        const isPolishing = sc > 5 && sc < 10;
        let bg, bd, tx, sh, lbl, labelText = 'Current Quality';
        if (sc >= 10) {
          bg = 'linear-gradient(135deg,#FFD740,#E89F0A)'; bd = '#FFD740'; tx = '#1a1208';
          sh = '0 0 12px rgba(255,215,64,0.7)'; lbl = '10/10'; labelText = '✓ Machine Certified';
        } else if (isPolishing) {
          bg = 'linear-gradient(135deg,#39FF14,#00C030)'; bd = '#39FF14'; tx = '#001405';
          sh = '0 0 12px rgba(57,255,20,0.75)'; lbl = sc + '/10';
        } else {
          bg = 'rgba(0,40,18,0.72)'; bd = 'rgba(57,255,20,0.45)'; tx = '#7BFF8F';
          sh = '0 0 6px rgba(57,255,20,0.18)'; lbl = sc + '/10';
        }
        const labelBg = isPolishing ? 'rgba(0,40,18,0.85)' : (sc >= 10 ? 'linear-gradient(135deg,#FFE34F,#FFB347)' : 'rgba(0,30,12,0.75)');
        const labelTx = isPolishing ? '#39FF14' : (sc >= 10 ? '#1a1208' : '#7BFF8F');
        const labelBd = isPolishing ? '#39FF14' : (sc >= 10 ? '#FFE34F' : 'rgba(57,255,20,0.4)');
        const labelSh = isPolishing ? 'box-shadow:0 0 8px rgba(57,255,20,0.5);' : (sc >= 10 ? 'box-shadow:0 0 8px rgba(255,227,79,0.5);' : '');
        const polishingPill = isPolishing
          ? `<span style="display:inline-block;background:linear-gradient(135deg,#00ff41,#00b830);color:#001405;padding:5px 12px;border-radius:99px;font-size:0.6rem;font-weight:900;letter-spacing:0.16em;text-transform:uppercase;border:1px solid #00ff41;box-shadow:0 0 12px rgba(0,255,65,0.7);vertical-align:middle;margin-right:4px;">◉ Currently Polishing</span>`
          : '';
        return `${polishingPill}<span style="display:inline-block;background:${labelBg};color:${labelTx};padding:5px 12px;border-radius:99px;font-size:0.6rem;font-weight:900;letter-spacing:0.16em;text-transform:uppercase;border:1px solid ${labelBd};${labelSh}vertical-align:middle;margin-right:4px;">${labelText}</span><span style="display:inline-block;background:${bg};color:${tx};padding:5px 12px;border-radius:99px;font-size:0.6rem;font-weight:900;letter-spacing:0.16em;text-transform:uppercase;border:1px solid ${bd};box-shadow:${sh};vertical-align:middle;margin-right:4px;">${lbl}</span><span role="button" tabindex="0" aria-label="How does the score work?" onclick="showIQHelp()" onkeypress="if(event.key===&quot;Enter&quot;){showIQHelp();}" style="display:inline-block;width:18px;height:18px;line-height:16px;text-align:center;background:rgba(57,255,20,0.18);border:1px solid rgba(57,255,20,0.55);color:#39FF14;border-radius:50%;font-size:0.7rem;font-weight:900;cursor:pointer;margin-right:8px;vertical-align:middle;user-select:none;">?</span>`;
      })()}
    </div>
    <h1 class="q">${escHtml(entry.question)}</h1>
    <div class="meta-row"><span style="display:inline-flex;align-items:center;gap:6px;padding:3px 10px;background:rgba(255,140,26,0.10);border:1px solid rgba(255,140,26,0.35);border-radius:99px;color:#FFB870;font-size:0.66rem;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;" title="Word count of this answer">📖 ${wordCountFmt} words</span><span style="margin-left:auto;">${new Date(entry.ts).toLocaleDateString()}</span></div>
    <div style="margin:10px 0 18px;">
      <button type="button" id="read-aloud-top" aria-label="Read this answer aloud" style="display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,rgba(57,166,255,0.22),rgba(120,180,255,0.14));border:1px solid rgba(57,166,255,0.6);color:#9ECFFF;font-family:inherit;font-size:0.78rem;font-weight:800;letter-spacing:0.10em;text-transform:uppercase;padding:9px 16px;border-radius:99px;cursor:pointer;box-shadow:0 0 12px rgba(57,166,255,0.25);"><span id="ra-top-icon" style="font-size:1rem;">🔊</span><span id="ra-top-label">Listen to this answer</span></button>
    </div>
<!-- Voice switcher removed 2026-05-03 — single In-Between voice only -->
    <div class="body">${renderedAnswer}</div>
    <div class="dl-row" aria-label="Download options">
      <span class="dl-label">Download:</span>
      <button class="dl-btn" type="button" id="dl-md">⬇ Answer (.md)</button>
      <button class="dl-btn" type="button" id="dl-pdf">⬇ Answer (.pdf)</button>
      <button class="dl-btn" type="button" id="open-social" style="background:linear-gradient(135deg,rgba(232,113,10,0.18),rgba(168,139,250,0.18));border-color:rgba(255,140,26,0.55);color:#FFD7A8;">✨ Social Studio</button>
      <button class="dl-btn" type="button" id="read-aloud-btn" aria-label="Read this answer aloud" style="background:linear-gradient(135deg,rgba(57,166,255,0.18),rgba(120,180,255,0.12));border-color:rgba(57,166,255,0.55);color:#9ECFFF;"><span id="ra-icon">🔊</span> <span id="ra-label">Listen</span></button>
    </div>
    <div id="social-panel" hidden style="margin-top:16px;padding:18px 20px;background:rgba(15,18,22,0.95);border:1px solid rgba(255,140,26,0.4);border-radius:14px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <div style="font-size:0.7rem;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:#FF8C1A;">✨ Social Studio</div>
        <button id="social-close" type="button" style="background:transparent;border:none;color:rgba(237,229,216,0.55);font-size:1.2rem;cursor:pointer;padding:0 6px;">×</button>
      </div>
      <div id="social-status" style="font-size:0.78rem;color:rgba(237,229,216,0.65);margin-bottom:12px;">Click Generate to build a copy-paste-ready X thread, LinkedIn post, and Reddit comment from this entry.</div>
      <button id="social-generate" type="button" style="background:linear-gradient(135deg,#FF8C1A,#E8710A);border:none;color:#0a0a0a;font-family:inherit;font-size:0.84rem;font-weight:800;letter-spacing:0.04em;padding:10px 22px;border-radius:10px;cursor:pointer;">Generate ✨</button>
      <div id="social-results" hidden style="margin-top:14px;display:flex;flex-direction:column;gap:14px;"></div>
    </div>
    <textarea id="raw-md" hidden readonly>${escHtml(entry.answer || '')}</textarea>
    <div id="feedback-row" style="margin-top:18px;padding:14px 18px;background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.06);border-radius:10px;display:flex;flex-wrap:wrap;align-items:center;gap:14px;">
      <span style="font-size:0.7rem;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;color:rgba(237,229,216,0.7);">Was this helpful?</span>
      <button class="fb-btn" type="button" data-vote="yes" style="background:rgba(34,197,94,0.12);border:1px solid rgba(34,197,94,0.4);color:#6ef0a3;font-family:inherit;font-size:0.75rem;font-weight:700;letter-spacing:0.06em;padding:6px 14px;border-radius:7px;cursor:pointer;">👍 Yes</button>
      <button class="fb-btn" type="button" data-vote="no" style="background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.4);color:#fca5a5;font-family:inherit;font-size:0.75rem;font-weight:700;letter-spacing:0.06em;padding:6px 14px;border-radius:7px;cursor:pointer;">👎 No</button>
      <button id="star-btn" type="button" title="Save to your starred list" style="background:rgba(255,215,64,0.10);border:1px solid rgba(255,215,64,0.4);color:#FFD740;font-family:inherit;font-size:0.75rem;font-weight:700;letter-spacing:0.06em;padding:6px 14px;border-radius:7px;cursor:pointer;"><span id="star-icon">☆</span> <span id="star-label">Star</span></button>
      <span id="fb-tally" style="font-size:0.68rem;color:rgba(237,229,216,0.55);margin-left:auto;">&nbsp;</span>
    </div>
    ${shareHtml}
    ${sourcesHtml}
    ${toolsHtml}
    ${relatedHtml}
    ${moreHtml}
    ${(prevQ || nextQ) ? `<nav class="seq-nav" aria-label="Previous and next library entry" style="display:flex;gap:12px;justify-content:space-between;margin:30px 0 12px;padding:14px 0;border-top:1px solid rgba(255,255,255,0.08);">
      ${prevQ ? `<a rel="prev" href="${prevUrl}" style="flex:1;text-decoration:none;color:rgba(237,229,216,0.85);font-size:0.78rem;line-height:1.4;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px 14px;transition:all 0.15s;">
        <span style="display:block;font-size:0.55rem;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:var(--orange-bright);margin-bottom:4px;">← Previous</span>
        ${escHtml(prevQ.question.slice(0, 90))}
      </a>` : '<span style="flex:1"></span>'}
      ${nextQ ? `<a rel="next" href="${nextUrl}" style="flex:1;text-align:right;text-decoration:none;color:rgba(237,229,216,0.85);font-size:0.78rem;line-height:1.4;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px 14px;transition:all 0.15s;">
        <span style="display:block;font-size:0.55rem;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:var(--orange-bright);margin-bottom:4px;">Next →</span>
        ${escHtml(nextQ.question.slice(0, 90))}
      </a>` : '<span style="flex:1"></span>'}
    </nav>` : ''}
  </article>
  <div class="viz-lightbox" id="viz-lightbox" role="dialog" aria-label="Visual zoom">
    <button class="viz-lightbox-close" id="viz-lightbox-close" aria-label="Close">×</button>
    <div class="viz-lightbox-inner" id="viz-lightbox-inner"></div>
  </div>
  <div class="footer-note">
    Researched autonomously by <a href="/themachine" style="color:rgba(255,140,26,0.7);">The Machine</a> · Claude Sonnet 4.6 + live web search · Cited &amp; dated
    <div style="margin-top:8px;font-size:0.62rem;letter-spacing:0.06em;text-transform:none;color:rgba(237,229,216,0.45);line-height:1.6;">
      Curated by <a href="/resume" style="color:rgba(255,140,26,0.85);font-weight:700;">Kory White</a> — 22-year revenue executive, architect of PULSE RevOps · <a href="https://www.linkedin.com/in/korywhite" target="_blank" rel="noopener" style="color:rgba(255,140,26,0.65);">LinkedIn</a> · <a href="https://theexecutivereview.org/kory-white.html" target="_blank" rel="noopener" style="color:rgba(255,140,26,0.65);">Featured on TheExecutiveReview</a>
    </div>
  </div>
  <script src="/assets/visit-alert.js" defer></script>
  <script>
    // Reading progress bar + scroll-to-top button
    (function(){
      var bar = document.getElementById('read-progress');
      var topBtn = document.getElementById('scroll-top');
      if (!bar && !topBtn) return;
      var ticking = false;
      function update() {
        var docH = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - window.innerHeight;
        var y = window.scrollY || window.pageYOffset || 0;
        var pct = docH > 0 ? Math.min(100, Math.max(0, (y / docH) * 100)) : 0;
        if (bar) bar.style.width = pct + '%';
        if (topBtn) {
          if (y > 600) { topBtn.style.opacity = '0.92'; topBtn.style.pointerEvents = 'auto'; }
          else { topBtn.style.opacity = '0'; topBtn.style.pointerEvents = 'none'; }
        }
        ticking = false;
      }
      window.addEventListener('scroll', function(){
        if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
      }, { passive: true });
      if (topBtn) {
        topBtn.addEventListener('click', function(){
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        topBtn.addEventListener('mouseenter', function(){ topBtn.style.transform = 'scale(1.08)'; });
        topBtn.addEventListener('mouseleave', function(){ topBtn.style.transform = ''; });
      }
      update();
    })();

    // Copy-link button — replaces clipboard text with the entry URL
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('.copy-link');
      if (!btn) return;
      var u = btn.getAttribute('data-url');
      if (!u) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(u).then(function() {
          btn.classList.add('copied'); btn.textContent = '✓';
          setTimeout(function() { btn.classList.remove('copied'); btn.textContent = '⎘'; }, 1800);
        });
      }
    });

    // 3-voice switcher — translates the whole answer into Operator / In-Between / Layman
    // via /.netlify/functions/voice-translate. Preserves length, tables, mermaid.
    // Cached per-voice in sessionStorage so re-clicks are instant. The "Operator" button
    // restores the original markdown (which is what's rendered server-side by default).
    (function(){
      try {
      var switcher = document.getElementById('voice-switcher');
      var panel = document.getElementById('layman-panel');
      if (!switcher || !panel) { console.warn('[voice] missing switcher or panel'); return; }
      var body = panel.querySelector('.lp-body');
      var panelLabel = document.getElementById('voice-panel-label');
      if (!body || !panelLabel) { console.warn('[voice] missing body or panel label'); return; }
      var voiceBtns = switcher.querySelectorAll('.voice-btn');
      var entryId = switcher.getAttribute('data-id');
      // Render-markdown — handles paragraphs, bullets, headers, tables, mermaid blocks,
      // code blocks, autolinks for URLs and cross-references like (q1604).
      function mdToHtml(md) {
        var src = (md || '').trim();
        // Pull out fenced code blocks first so their content doesn't get
        // mangled by the line-by-line parser
        var blocks = [];
        src = src.replace(/\`\`\`(mermaid|json|js|javascript|bash|sh|html|css|sql|python|py)?\\n?([\\s\\S]*?)\`\`\`/g, function(_, lang, code){
          var idx = blocks.length;
          if ((lang || '').toLowerCase() === 'mermaid') {
            blocks.push('<div class="mermaid-wrap" style="margin:14px 0;background:rgba(255,140,26,0.04);border:1px solid rgba(255,140,26,0.2);border-radius:10px;padding:14px;overflow-x:auto;"><pre class="mermaid" style="background:transparent;border:none;padding:0;margin:0;">' + code.trim() + '</pre></div>');
          } else {
            blocks.push('<pre style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:12px;overflow-x:auto;font-size:0.82rem;line-height:1.45;margin:12px 0;"><code>' + code.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</code></pre>');
          }
          return '\\u0001BLOCK' + idx + '\\u0001';
        });
        var lines = src.split(/\\n/);
        var html = '', inUl = false, tableRows = [];
        function inline(s){
          // Bold + italic
          var out = s.replace(/\\*\\*([^*]+)\\*\\*/g,'<strong>$1</strong>')
                     .replace(/\\*([^*]+)\\*/g,'<em>$1</em>')
                     .replace(/_([^_]+)_/g,'<em>$1</em>');
          // Markdown links [text](url)
          out = out.replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g, function(_, txt, url){
            return '<a href="' + url + '" target="_blank" rel="noopener" style="color:var(--orange-bright);">' + txt + '</a>';
          });
          // Bare URLs
          out = out.replace(/(^|[^"'>=])(https?:\\/\\/[^\\s<)\\]"]+)/g, function(_, pre, url){
            return pre + '<a href="' + url + '" target="_blank" rel="noopener" style="color:var(--orange-bright);word-break:break-all;">' + url + '</a>';
          });
          // Cross-link refs like (q1604) → clickable internal link
          out = out.replace(/\\(q(\\d{3,5})\\)/g, function(_, n){
            return '(<a href="/knowledge/q' + n + '" style="color:var(--orange-bright);">q' + n + '</a>)';
          });
          return out;
        }
        function flushTable(){
          if (!tableRows.length) return;
          var t = '<table style="width:100%;border-collapse:collapse;margin:14px 0;font-size:0.9rem;">';
          tableRows.forEach(function(row, idx){
            var tag = idx === 0 ? 'th' : 'td';
            var bg = idx === 0 ? 'background:rgba(255,140,26,0.12);' : '';
            t += '<tr style="' + bg + '">' + row.map(function(c){ return '<' + tag + ' style="padding:8px 12px;border:1px solid rgba(255,140,26,0.25);text-align:left;vertical-align:top;">' + inline(c.trim()) + '</' + tag + '>'; }).join('') + '</tr>';
          });
          t += '</table>';
          html += t;
          tableRows = [];
        }
        for (var i=0;i<lines.length;i++){
          var l = lines[i];
          // Block placeholder line (mermaid/code) — emit as-is
          if (/^\\u0001BLOCK\\d+\\u0001\\s*$/.test(l)) {
            if (inUl){ html += '</ul>'; inUl = false; }
            if (tableRows.length) flushTable();
            html += l;
            continue;
          }
          if (/^\\|.*\\|\\s*$/.test(l)) {
            if (/^\\|[\\s\\-:|]+\\|\\s*$/.test(l)) continue;
            tableRows.push(l.replace(/^\\||\\|$/g,'').split('|'));
            continue;
          } else if (tableRows.length) { flushTable(); }
          if (/^#{1,3}\\s+/.test(l)) {
            if (inUl){ html += '</ul>'; inUl = false; }
            var lvl = l.match(/^#+/)[0].length;
            html += '<h' + (lvl+1) + ' style="color:#FFD7A8;margin:16px 0 8px;font-size:' + (1.15 - lvl*0.06) + 'rem;font-weight:800;">' + inline(l.replace(/^#+\\s+/,'')) + '</h' + (lvl+1) + '>';
          } else if (/^\\s*[-•]\\s+/.test(l)) {
            if (!inUl){ html += '<ul style="margin:8px 0 12px 22px;padding:0;">'; inUl = true; }
            html += '<li style="margin:4px 0;">' + inline(l.replace(/^\\s*[-•]\\s+/,'')) + '</li>';
          } else if (!l.trim()) {
            if (inUl){ html += '</ul>'; inUl = false; }
          } else {
            if (inUl){ html += '</ul>'; inUl = false; }
            html += '<p style="margin:8px 0;line-height:1.6;">' + inline(l) + '</p>';
          }
        }
        if (inUl) html += '</ul>';
        if (tableRows.length) flushTable();
        // Restore the code/mermaid blocks
        html = html.replace(/\\u0001BLOCK(\\d+)\\u0001/g, function(_, idx){ return blocks[+idx] || ''; });
        return html;
      }
      var denseBody = document.querySelector('.body');
      var VOICE_LABELS = {
        operator: 'Operator-Grade',
        between: 'In-Between',
        layman: 'Plain English',
      };
      function setActive(voice){
        voiceBtns.forEach(function(b){
          if (b.getAttribute('data-voice') === voice) b.classList.add('voice-active');
          else b.classList.remove('voice-active');
        });
      }
      function showOriginal(){
        // Operator voice = the original markdown, which is already rendered in .body server-side
        panel.classList.remove('show');
        if (denseBody) denseBody.style.display = '';
        setActive('operator');
      }
      function showTranslated(voice, text){
        body.innerHTML = mdToHtml(text);
        panelLabel.textContent = VOICE_LABELS[voice] || voice;
        panel.classList.add('show');
        if (denseBody) denseBody.style.display = 'none';
        setActive(voice);
        // Re-run mermaid on any newly-injected diagrams in the translated panel
        try {
          if (window.mermaid && typeof window.mermaid.run === 'function') {
            var freshNodes = body.querySelectorAll('.mermaid:not([data-processed="true"])');
            if (freshNodes.length) window.mermaid.run({ nodes: freshNodes });
          }
        } catch (e) { console.warn('[voice] mermaid re-run failed', e); }
      }
      voiceBtns.forEach(function(btn){
        btn.addEventListener('click', function(){
          var voice = btn.getAttribute('data-voice');
          if (voice === 'operator') { showOriginal(); return; }
          var cacheKey = 'voice:v1:' + voice + ':' + entryId;
          var cached = null;
          try { cached = sessionStorage.getItem(cacheKey); } catch(e){}
          if (cached && cached.length > 50) { showTranslated(voice, cached); return; }
          var origLabel = btn.querySelector('.lb-label').textContent;
          btn.disabled = true;
          btn.querySelector('.lb-label').textContent = 'Translating...';
          fetch('/.netlify/functions/voice-translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: entryId, target_voice: voice }),
          }).then(function(r){ return r.json(); }).then(function(j){
            btn.disabled = false;
            btn.querySelector('.lb-label').textContent = origLabel;
            if (j && j.ok && j.answer) {
              try { sessionStorage.setItem(cacheKey, j.answer); } catch(e){}
              showTranslated(voice, j.answer);
            } else {
              body.innerHTML = '<p>Could not translate. Reason: ' + ((j && j.reason) || 'unknown') + '. Try again in a moment.</p>';
              panel.classList.add('show');
            }
          }).catch(function(err){
            console.error('[voice] fetch error', err);
            btn.disabled = false;
            btn.querySelector('.lb-label').textContent = origLabel;
            body.innerHTML = '<p>Network hiccup: ' + (err && err.message || 'unknown') + '. Try again.</p>';
            panel.classList.add('show');
          });
        });
      });
      } catch (err) {
        console.error('[layman] init error', err);
      }
    })();

    // Visual lightbox + downloads
    (function(){
      try {
      var lb = document.getElementById('viz-lightbox');
      var lbInner = document.getElementById('viz-lightbox-inner');
      var lbClose = document.getElementById('viz-lightbox-close');
      function openLightbox(svg){
        if (!svg || !lb || !lbInner) return;
        var clone = svg.cloneNode(true);
        // Strip mermaid-set attributes that constrain size, force responsive
        clone.removeAttribute('style');
        clone.removeAttribute('width');
        clone.removeAttribute('height');
        clone.style.width = '100%';
        clone.style.height = 'auto';
        clone.style.maxHeight = '88vh';
        clone.style.display = 'block';
        // Ensure preserveAspectRatio scales properly
        clone.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        lbInner.innerHTML = '';
        lbInner.appendChild(clone);
        lb.classList.add('show');
        document.body.style.overflow = 'hidden';
      }
      function closeLightbox(){
        if (!lb) return;
        lb.classList.remove('show');
        document.body.style.overflow = '';
      }
      // Event delegation — works regardless of when mermaid SVG renders.
      // Catches clicks on any SVG inside .mermaid-wrap forever, including
      // SVGs added by post-render mermaid.run() or voice-translate panel.
      document.addEventListener('click', function(e){
        var svg = e.target.closest('.mermaid-wrap svg, .mermaid-wrap');
        if (!svg) return;
        // If user clicked the wrap itself (not inside an SVG), find the inner SVG
        if (svg.classList && svg.classList.contains('mermaid-wrap')) {
          var inner = svg.querySelector('svg');
          if (!inner) return;
          svg = inner;
        }
        e.preventDefault();
        openLightbox(svg);
      });
      if (lbClose) lbClose.addEventListener('click', closeLightbox);
      if (lb) lb.addEventListener('click', function(e){ if (e.target === lb) closeLightbox(); });
      document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeLightbox(); });

      // Download helpers
      function downloadBlob(blob, filename){
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url; a.download = filename;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);
      }
      function getFirstSvg(){
        return document.querySelector('.mermaid-wrap svg');
      }
      function svgString(svg){
        var clone = svg.cloneNode(true);
        if (!clone.getAttribute('xmlns')) clone.setAttribute('xmlns','http://www.w3.org/2000/svg');
        return new XMLSerializer().serializeToString(clone);
      }
      var entryId = ${JSON.stringify(entry.id)};
      var entryQ = ${JSON.stringify(entry.question || '')};

      var dlMd = document.getElementById('dl-md');
      if (dlMd) dlMd.addEventListener('click', function(){
        var ta = document.getElementById('raw-md');
        var md = ta ? (ta.value || ta.textContent || '') : '';
        var header = '# ' + entryQ + '\\n\\nSource: https://pulserevops.com/knowledge/' + entryId + '\\n\\n---\\n\\n';
        var blob = new Blob([header + md], { type: 'text/markdown;charset=utf-8' });
        downloadBlob(blob, entryId + '.md');
      });

      // PDF download — uses browser print to PDF (clean, no extra dependencies)
      var dlPdf = document.getElementById('dl-pdf');
      if (dlPdf) dlPdf.addEventListener('click', function(){
        window.print();
      });

      // Read Aloud — uses the browser-native Web Speech API (free, client-side,
      // no API cost). Reads the question + the rendered answer body. Toggles
      // between Listen / Stop on BOTH the top-of-page button and the bottom
      // download-row button, keeping their states in sync. Falls back to
      // disabled if unsupported.
      (function(){
        var btn = document.getElementById('read-aloud-btn');
        var topBtn = document.getElementById('read-aloud-top');
        if (!btn && !topBtn) return;
        var icon = document.getElementById('ra-icon');
        var label = document.getElementById('ra-label');
        var topIcon = document.getElementById('ra-top-icon');
        var topLabel = document.getElementById('ra-top-label');
        if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
          [btn, topBtn].forEach(function(b){
            if (!b) return;
            b.disabled = true;
            b.style.opacity = '0.45';
            b.style.cursor = 'not-allowed';
            b.title = 'Your browser does not support speech synthesis';
          });
          return;
        }
        var synth = window.speechSynthesis;
        var speaking = false;

        function getReadableText(){
          // Strip markdown/HTML noise. Pull the visible text out of .body and
          // de-noise tables, code blocks, and image captions so the voice
          // reads the narrative content. Returns the FULL answer text — chunking
          // for browser TTS limits happens in handleClick via chunkForSpeech.
          var body = document.querySelector('article .body');
          var raw = body ? body.innerText : '';
          // Remove mermaid blocks, source URLs, and excessive whitespace.
          raw = raw.replace(/https?:\\/\\/\\S+/g, '');
          raw = raw.replace(/\\|[^\\n]*\\|/g, '');
          raw = raw.replace(/[-=]{3,}/g, '');
          raw = raw.replace(/\\n{3,}/g, '\\n\\n');
          return entryQ + '. ' + raw;
        }
        function chunkForSpeech(text, maxLen){
          // Browsers throttle/truncate utterances >~32KB and Chrome sometimes
          // stalls beyond ~15s of speech per utterance. Split at sentence
          // boundaries into chunks ≤ maxLen chars so we can queue them
          // sequentially via onend chaining.
          maxLen = maxLen || 3000;
          var chunks = [];
          var i = 0;
          while (i < text.length){
            var end = Math.min(i + maxLen, text.length);
            if (end < text.length){
              var lastPeriod = text.lastIndexOf('. ', end);
              var lastBang   = text.lastIndexOf('! ', end);
              var lastQ      = text.lastIndexOf('? ', end);
              var lastNL     = text.lastIndexOf('\\n', end);
              var boundary = Math.max(lastPeriod, lastBang, lastQ, lastNL);
              if (boundary > i + Math.floor(maxLen / 2)) end = boundary + 1;
            }
            var slice = text.substring(i, end).trim();
            if (slice) chunks.push(slice);
            i = end;
          }
          return chunks;
        }

        function pickVoice(){
          var voices = synth.getVoices() || [];
          if (!voices.length) return null;
          var byLangNatural = voices.find(function(v){ return /en-US/i.test(v.lang) && /Natural|Google|Microsoft|Samantha|Aria|Jenny/i.test(v.name); });
          if (byLangNatural) return byLangNatural;
          var byLang = voices.find(function(v){ return /^en/i.test(v.lang); });
          return byLang || voices[0];
        }

        function setIdle(){
          speaking = false;
          if (icon) icon.textContent = '🔊';
          if (label) label.textContent = 'Listen';
          if (topIcon) topIcon.textContent = '🔊';
          if (topLabel) topLabel.textContent = 'Listen to this answer';
        }
        function setPlaying(){
          speaking = true;
          if (icon) icon.textContent = '⏹';
          if (label) label.textContent = 'Stop';
          if (topIcon) topIcon.textContent = '⏹';
          if (topLabel) topLabel.textContent = 'Stop reading';
        }

        function handleClick(){
          if (speaking) { synth.cancel(); setIdle(); return; }
          var text = getReadableText();
          if (!text) return;
          synth.cancel();
          var chunks = chunkForSpeech(text, 3000);
          if (!chunks.length) return;
          var v = pickVoice();
          var idx = 0;
          function speakNext(){
            if (!speaking) return; // user pressed Stop
            if (idx >= chunks.length){ setIdle(); return; }
            var u = new SpeechSynthesisUtterance(chunks[idx]);
            if (v) u.voice = v;
            u.rate = 1.0;
            u.pitch = 1.0;
            u.onend = function(){ idx++; speakNext(); };
            u.onerror = function(){ setIdle(); };
            synth.speak(u);
          }
          setPlaying();
          speakNext();
        }

        if (btn) btn.addEventListener('click', handleClick);
        if (topBtn) topBtn.addEventListener('click', handleClick);
        if (synth.onvoiceschanged !== undefined) synth.onvoiceschanged = function(){};
        window.addEventListener('beforeunload', function(){ try { synth.cancel(); } catch(e){} });
      })();

      // Fire-and-forget view ping — increments per-entry view counter for trending.
      // Once-per-session debounce so reload-spamming doesn't inflate counts.
      (function(){
        try {
          var sessKey = 'pulse-viewed-' + entryId;
          if (sessionStorage.getItem(sessKey)) return;
          sessionStorage.setItem(sessKey, '1');
          fetch('/.netlify/functions/entry-view', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: entryId }),
            keepalive: true,
          }).catch(function(){});
        } catch(e) {}
      })();

      // ★ Star — saves entry id to localStorage 'pulse-stars-v1'. Toggleable.
      // Surfaces on /knowledge.html via a "★ Starred" filter pill.
      (function(){
        var btn = document.getElementById('star-btn');
        if (!btn) return;
        var icon = document.getElementById('star-icon');
        var label = document.getElementById('star-label');
        var KEY = 'pulse-stars-v1';
        function getStars() {
          try { return JSON.parse(localStorage.getItem(KEY) || '[]') || []; } catch(e){ return []; }
        }
        function setStars(arr) { try { localStorage.setItem(KEY, JSON.stringify(arr)); } catch(e){} }
        function paint() {
          var stars = getStars();
          var on = stars.indexOf(entryId) !== -1;
          if (icon) icon.textContent = on ? '★' : '☆';
          if (label) label.textContent = on ? 'Starred' : 'Star';
          btn.style.background = on ? 'rgba(255,215,64,0.22)' : 'rgba(255,215,64,0.10)';
        }
        paint();
        btn.addEventListener('click', function(){
          var stars = getStars();
          var idx = stars.indexOf(entryId);
          if (idx !== -1) stars.splice(idx, 1);
          else stars.unshift(entryId);
          setStars(stars);
          paint();
        });
      })();

      // "Was this helpful?" feedback — Y/N votes logged to entry-feedback blob.
      // Persists vote in localStorage so a single user can't double-vote on
      // the same entry from the same browser.
      (function(){
        var row = document.getElementById('feedback-row');
        if (!row) return;
        var tallyEl = document.getElementById('fb-tally');
        var voteKey = 'pulse-fb-' + entryId;
        var existingVote = null;
        try { existingVote = localStorage.getItem(voteKey); } catch(e){}
        function paintTally(yes, no, myVote) {
          var total = (yes || 0) + (no || 0);
          var pct = total ? Math.round((yes / total) * 100) : null;
          var lbl = total === 0 ? 'Be the first.' :
                    (myVote ? 'Thanks — you voted ' + (myVote === 'yes' ? '👍' : '👎') + '. ' : '') +
                    (pct !== null ? pct + '% found this helpful · ' + total + ' vote' + (total === 1 ? '' : 's') : '');
          if (tallyEl) tallyEl.textContent = lbl;
        }
        function setVotedState(vote) {
          row.querySelectorAll('.fb-btn').forEach(function(btn){
            btn.disabled = true;
            btn.style.cursor = 'default';
            btn.style.opacity = btn.dataset.vote === vote ? '1' : '0.4';
          });
        }
        // Fetch initial tally
        fetch('/.netlify/functions/entry-feedback?id=' + encodeURIComponent(entryId))
          .then(function(r){ return r.ok ? r.json() : null; })
          .then(function(j){
            if (j && j.ok) paintTally(j.yes, j.no, existingVote);
          }).catch(function(){});
        if (existingVote) setVotedState(existingVote);
        row.querySelectorAll('.fb-btn').forEach(function(btn){
          btn.addEventListener('click', function(){
            if (existingVote) return;
            var vote = btn.dataset.vote;
            setVotedState(vote);
            try { localStorage.setItem(voteKey, vote); } catch(e){}
            existingVote = vote;
            fetch('/.netlify/functions/entry-feedback', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: entryId, vote: vote }),
            }).then(function(r){ return r.json(); }).then(function(j){
              if (j && j.ok) paintTally(j.yes, j.no, vote);
            }).catch(function(){});
          });
        });
      })();

      // Per-mermaid SVG/PNG download — exports the SPECIFIC diagram clicked,
      // with a "pulserevops.com/knowledge/qXXXX" watermark baked into PNG.
      function downloadMermaidSvg(svg, idx){
        if (!svg) return;
        var s = svgString(svg);
        var blob = new Blob([s], { type: 'image/svg+xml;charset=utf-8' });
        downloadBlob(blob, entryId + '-viz' + (idx > 0 ? ('-' + (idx + 1)) : '') + '.svg');
      }
      function downloadMermaidPng(svg, idx){
        if (!svg) return;
        var s = svgString(svg);
        var img = new Image();
        var w = svg.viewBox && svg.viewBox.baseVal && svg.viewBox.baseVal.width || svg.clientWidth || 1200;
        var h = svg.viewBox && svg.viewBox.baseVal && svg.viewBox.baseVal.height || svg.clientHeight || 630;
        var scale = 2;
        img.onload = function(){
          var c = document.createElement('canvas');
          c.width = w * scale; c.height = h * scale;
          var ctx = c.getContext('2d');
          ctx.fillStyle = '#0e1218';
          ctx.fillRect(0,0,c.width,c.height);
          ctx.drawImage(img, 0, 0, c.width, c.height);
          // Watermark — bottom-right, branded
          ctx.fillStyle = 'rgba(232,113,10,0.85)';
          ctx.font = 'bold ' + Math.round(14 * scale) + 'px Inter, Segoe UI, sans-serif';
          ctx.textAlign = 'right';
          ctx.textBaseline = 'bottom';
          ctx.fillText('pulserevops.com/knowledge/' + entryId, c.width - 16 * scale, c.height - 12 * scale);
          c.toBlob(function(blob){
            if (blob) downloadBlob(blob, entryId + '-viz' + (idx > 0 ? ('-' + (idx + 1)) : '') + '.png');
            else alert('PNG export failed (your browser may block SVG→canvas).');
          }, 'image/png');
        };
        img.onerror = function(){ alert('Could not render PNG.'); };
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(s)));
      }
      function injectPerMermaidButtons(){
        var wraps = document.querySelectorAll('.mermaid-wrap');
        wraps.forEach(function(wrap, idx){
          if (wrap.querySelector('.viz-dl-bar')) return; // already injected
          var svg = wrap.querySelector('svg');
          if (!svg) return; // mermaid hasn't rendered yet
          var bar = document.createElement('div');
          bar.className = 'viz-dl-bar';
          bar.style.cssText = 'position:absolute;top:8px;left:12px;display:flex;gap:6px;z-index:5;';
          var svgBtn = document.createElement('button');
          svgBtn.type = 'button';
          svgBtn.textContent = '⬇ SVG';
          svgBtn.title = 'Download this diagram as SVG';
          svgBtn.style.cssText = 'background:rgba(0,0,0,0.55);border:1px solid rgba(255,140,26,0.4);color:#FFD7A8;font-family:inherit;font-size:0.6rem;font-weight:700;letter-spacing:0.08em;padding:4px 9px;border-radius:5px;cursor:pointer;';
          svgBtn.addEventListener('click', function(e){ e.stopPropagation(); downloadMermaidSvg(svg, idx); });
          var pngBtn = document.createElement('button');
          pngBtn.type = 'button';
          pngBtn.textContent = '⬇ PNG';
          pngBtn.title = 'Download this diagram as PNG (watermarked)';
          pngBtn.style.cssText = svgBtn.style.cssText;
          pngBtn.addEventListener('click', function(e){ e.stopPropagation(); downloadMermaidPng(svg, idx); });
          bar.appendChild(svgBtn);
          bar.appendChild(pngBtn);
          wrap.appendChild(bar);
        });
      }
      // Run on load + observe for late-rendered mermaid SVGs
      injectPerMermaidButtons();
      var injectInterval = setInterval(injectPerMermaidButtons, 600);
      setTimeout(function(){ clearInterval(injectInterval); injectPerMermaidButtons(); }, 8000);
      } catch(err){ console.error('[viz] init error', err); }
    })();

    // ✨ Social Studio — generates copy-paste X thread + LinkedIn post + Reddit comment
    (function(){
      try {
      var openBtn = document.getElementById('open-social');
      var panel = document.getElementById('social-panel');
      var closeBtn = document.getElementById('social-close');
      var genBtn = document.getElementById('social-generate');
      var status = document.getElementById('social-status');
      var results = document.getElementById('social-results');
      if (!openBtn || !panel) return;

      openBtn.addEventListener('click', function(){ panel.hidden = false; openBtn.scrollIntoView({behavior:'smooth',block:'center'}); });
      if (closeBtn) closeBtn.addEventListener('click', function(){ panel.hidden = true; });

      function makeCopyBlock(label, text) {
        var wrap = document.createElement('div');
        wrap.style.cssText = 'background:rgba(0,0,0,0.4);border:1px solid rgba(255,140,26,0.25);border-radius:10px;padding:14px;';
        var header = document.createElement('div');
        header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;';
        var lbl = document.createElement('span');
        lbl.style.cssText = 'font-size:0.62rem;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:#FF8C1A;';
        lbl.textContent = label;
        var copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.style.cssText = 'background:rgba(255,140,26,0.15);border:1px solid rgba(255,140,26,0.4);color:#FFD7A8;font-family:inherit;font-size:0.66rem;font-weight:700;letter-spacing:0.04em;padding:5px 11px;border-radius:6px;cursor:pointer;';
        copyBtn.textContent = '⎘ Copy';
        copyBtn.addEventListener('click', function(){
          if (navigator.clipboard) navigator.clipboard.writeText(text).then(function(){
            copyBtn.textContent = '✓ Copied'; setTimeout(function(){ copyBtn.textContent = '⎘ Copy'; }, 1400);
          });
        });
        header.appendChild(lbl); header.appendChild(copyBtn);
        var pre = document.createElement('pre');
        pre.style.cssText = 'white-space:pre-wrap;word-break:break-word;font-family:Inter,system-ui,sans-serif;font-size:0.88rem;line-height:1.55;color:#EDE5D8;margin:0;max-height:280px;overflow-y:auto;';
        pre.textContent = text;
        wrap.appendChild(header); wrap.appendChild(pre);
        return wrap;
      }

      genBtn.addEventListener('click', function(){
        var id = ${JSON.stringify(entry.id)};
        genBtn.disabled = true; genBtn.textContent = 'Generating ✨';
        status.textContent = 'Building X / LinkedIn / Reddit cuts...';
        results.hidden = true; results.innerHTML = '';
        fetch('/.netlify/functions/social-cut', {
          method: 'POST',
          headers: { 'Content-Type':'application/json' },
          body: JSON.stringify({ id: id }),
        }).then(function(r){ return r.ok ? r.json() : Promise.reject(new Error('http ' + r.status)); })
          .then(function(j){
            genBtn.disabled = false; genBtn.textContent = 'Regenerate ✨';
            if (!j.ok) { status.textContent = '⚠ ' + (j.reason || 'unknown error'); return; }
            status.textContent = '✓ Ready — copy each block and post.';
            results.innerHTML = '';
            if (Array.isArray(j.x_thread)) {
              var threadText = j.x_thread.map(function(t,i){ return (i+1)+'/ '+t; }).join('\\n\\n');
              results.appendChild(makeCopyBlock('𝕏 Thread (' + j.x_thread.length + ' tweets)', threadText));
            }
            if (j.linkedin_post) results.appendChild(makeCopyBlock('LinkedIn Post', j.linkedin_post));
            if (j.reddit_comment) results.appendChild(makeCopyBlock('Reddit Comment', j.reddit_comment));
            results.hidden = false;
          })
          .catch(function(err){
            genBtn.disabled = false; genBtn.textContent = 'Generate ✨';
            status.textContent = '⚠ ' + (err.message || 'network error');
          });
      });
      } catch (err) { console.error('[social] init error', err); }
    })();
  </script>

  <!-- ── 10/10 RevOps IQ Verified explanation modal — global, click-to-open ── -->
  <div id="iq-help-modal" style="display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.78);backdrop-filter:blur(4px);align-items:center;justify-content:center;padding:24px;" onclick="if(event.target===this)hideIQHelp();">
    <div style="background:linear-gradient(180deg,#1a0e08,#0a0604);border:1px solid rgba(232,113,10,0.45);border-radius:14px;max-width:540px;width:100%;padding:28px 30px 26px;box-shadow:0 20px 60px rgba(0,0,0,0.6),0 0 30px rgba(192,78,0,0.18);font-family:Inter,system-ui,sans-serif;color:rgba(237,229,216,0.95);">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
        <span style="display:inline-block;background:linear-gradient(135deg,#FFD740,#E89F0A);color:#1a1208;padding:5px 12px;border-radius:99px;font-size:0.6rem;font-weight:900;letter-spacing:0.16em;text-transform:uppercase;border:1px solid #FFD740;box-shadow:0 0 10px rgba(255,215,64,0.55);">RevOps IQ Score</span>
        <button type="button" aria-label="Close" onclick="hideIQHelp()" style="background:none;border:none;color:rgba(237,229,216,0.55);font-size:1.5rem;line-height:1;cursor:pointer;padding:0 4px;">×</button>
      </div>
      <h3 style="margin:0 0 12px;font-size:1.1rem;font-weight:700;letter-spacing:0.01em;color:#FFE34F;">What does the score mean?</h3>
      <p style="margin:0 0 14px;font-size:0.85rem;line-height:1.55;color:rgba(237,229,216,0.85);">Every entry shows a live, honest <strong>x/10</strong> score. Fresh entries start at <strong>5/10</strong> &mdash; schema-complete with an opinionated framework. They climb as the AI does real research and verification work between posts.</p>
      <ul style="margin:0 0 16px;padding-left:18px;font-size:0.82rem;line-height:1.6;color:rgba(237,229,216,0.78);">
        <li><strong>5/10</strong> &mdash; fresh write. Structured argument, named vendors, illustrative numbers (not yet fact-checked).</li>
        <li><strong>6/10</strong> &mdash; every claim resolves to a public source URL.</li>
        <li><strong>7/10</strong> &mdash; illustrative numbers replaced with current verified figures from primary sources (10-Qs, press releases, Gartner/Forrester).</li>
        <li><strong>8/10</strong> &mdash; adversarial counter-argument section added; alternative views represented honestly.</li>
        <li><strong>9/10</strong> &mdash; cross-links to 4+ topically related entries in the library; no internal contradictions.</li>
        <li><strong>10/10</strong> &mdash; comprehensive fact-check passed. The answer would survive expert review and is the best response we can produce regardless of where you shopped it.</li>
      </ul>
      <p style="margin:0;font-size:0.72rem;color:rgba(237,229,216,0.55);font-style:italic;">Score is dynamic &mdash; entries improve over hours/days/weeks as the polish loop earns each step. Nothing claims 10/10 unless it actually passes every check.</p>
    </div>
  </div>
  <script>
    window.showIQHelp = function() {
      var m = document.getElementById('iq-help-modal');
      if (m) { m.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
    };
    window.hideIQHelp = function() {
      var m = document.getElementById('iq-help-modal');
      if (m) { m.style.display = 'none'; document.body.style.overflow = ''; }
    };
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape') window.hideIQHelp();
    });
  </script>
</body>
</html>`;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=600', // 5min browser, 10min CDN
    },
    body: html,
  };
};
