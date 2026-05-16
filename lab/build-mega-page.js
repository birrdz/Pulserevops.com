// ════════════════════════════════════════════════════════════════════════
// build-mega-page — reads lab/cheap-100/q*.json, emits /knowledge-100.html
//
// Output mirrors knowledge.html styling (orange/dark + matrix vibes), but
// is fully static — no client-side fetch, no Netlify function dependency.
// Each Q&A is its own anchor (#q01 … #q100) so deep-link sharing works.
// JSON-LD FAQPage schema makes the whole drop visible to AI search.
// ════════════════════════════════════════════════════════════════════════
const fs   = require('fs');
const path = require('path');

const LAB_DIR    = path.join(__dirname, 'cheap-100');
const OUT_FILE   = path.join(__dirname, '..', 'answers.html');

// ── Markdown → HTML (lifted from knowledge.html renderMd, lightly adapted) ─
function escTxt(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function renderInline(text) {
  text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, l, u) => `<a href="${u}" target="_blank" rel="noopener noreferrer">${escTxt(l)}</a>`);
  text = text.replace(/`([^`]+)`/g, (_, c) => `<code>${escTxt(c)}</code>`);
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
  return text;
}
function renderTable(lines) {
  const rows = lines.map(l => l.replace(/^\||\|$/g,'').split('|').map(c => c.trim()))
    .filter(r => !r.every(c => /^[:\-\s]+$/.test(c)));
  if (!rows.length) return '';
  const head = rows[0], body = rows.slice(1);
  return '<table><thead><tr>' + head.map(c => `<th>${renderInline(escTxt(c))}</th>`).join('') + '</tr></thead><tbody>'
    + body.map(r => '<tr>' + r.map(c => `<td>${renderInline(escTxt(c))}</td>`).join('') + '</tr>').join('')
    + '</tbody></table>';
}
let _merSeq = 0;
function renderMd(text) {
  text = String(text || '').replace(/\r\n/g,'\n').trim();
  // Strip the trailing "TAGS:" line — we surface tags as chips, not body text
  text = text.replace(/\n\s*\**\s*tags?\s*\**\s*[:\-]\s*[^\n]+$/i, '').trim();
  const lines = text.split('\n');
  const out = []; const paraBuf = []; let i = 0;
  const flush = () => { if (!paraBuf.length) return; const j = paraBuf.join(' ').trim(); if (j) out.push(`<p>${renderInline(escTxt(j))}</p>`); paraBuf.length = 0; };
  while (i < lines.length) {
    const line = lines[i], t = line.trim();
    if (/^```mermaid\s*$/i.test(t)) {
      flush(); i++; const mer = [];
      while (i < lines.length && !/^```/.test(lines[i].trim())) { mer.push(lines[i]); i++; }
      i++;
      const src = mer.join('\n').trim();
      if (src) {
        const id = 'lmer-' + (++_merSeq);
        out.push(`<div class="mermaid-wrap"><div class="mermaid" id="${id}">${escTxt(src)}</div></div>`);
      }
      continue;
    }
    if (!t) { flush(); i++; continue; }
    if (/^#{2,3}\s+/.test(t)) {
      flush();
      const lvl = t.match(/^(#{2,3})/)[1].length;
      const c = t.replace(/^#{2,3}\s+/, '');
      out.push(`<h${lvl}>${renderInline(escTxt(c))}</h${lvl}>`); i++; continue;
    }
    if (/^\|.*\|/.test(t) && i+1 < lines.length && /^\|[\s:|-]+\|/.test(lines[i+1].trim())) {
      flush(); const tbl = [];
      while (i < lines.length && /^\|.*\|/.test(lines[i].trim())) { tbl.push(lines[i].trim()); i++; }
      out.push(renderTable(tbl)); continue;
    }
    if (/^[-•*]\s+/.test(t)) {
      flush(); const items = [];
      while (i < lines.length && /^[-•*]\s+/.test(lines[i].trim())) { items.push(lines[i].trim().replace(/^[-•*]\s+/,'')); i++; }
      out.push('<ul>' + items.map(x => `<li>${renderInline(escTxt(x))}</li>`).join('') + '</ul>'); continue;
    }
    if (/^\d+\.\s+/.test(t)) {
      flush(); const nums = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) { nums.push(lines[i].trim().replace(/^\d+\.\s+/,'')); i++; }
      out.push('<ol>' + nums.map(x => `<li>${renderInline(escTxt(x))}</li>`).join('') + '</ol>'); continue;
    }
    paraBuf.push(t); i++;
  }
  flush();
  return out.join('');
}

// Strip markdown / mermaid for the FAQPage schema acceptedAnswer text
function plainText(md) {
  return String(md || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\n\s*\**\s*tags?\s*\**\s*[:\-]\s*[^\n]+$/i, '')
    .replace(/[#*`|>_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 900);
}

// ── Load Head index cache (IDs already posted to /knowledge.html) ────────
let headIds = new Set();
try {
  const cache = JSON.parse(fs.readFileSync(path.join(__dirname, 'head-index-cache.json'), 'utf8'));
  headIds = new Set(cache.ids || []);
  console.log(`head cache: ${headIds.size} ids already posted`);
} catch (e) {
  console.warn('no head-index-cache.json yet — queue will show all entries');
}

// ── Load all q*.json (newest first — highest q-id at top), filter to QUEUE
const allFiles = fs.readdirSync(LAB_DIR)
  .filter(f => /^q\d+\.json$/.test(f))
  .sort((a, b) => {
    const na = parseInt(a.match(/\d+/)[0], 10);
    const nb = parseInt(b.match(/\d+/)[0], 10);
    return nb - na;
  });

const allEntries = allFiles.map(f => {
  try { return JSON.parse(fs.readFileSync(path.join(LAB_DIR, f), 'utf8')); }
  catch (e) { console.warn('skip', f, e.message); return null; }
}).filter(Boolean);

// Queue = entries NOT yet in Head (i.e., not yet on /knowledge.html)
const entries = allEntries.filter(e => !headIds.has(e.id));
const totalProcessed = allEntries.length;

console.log(`queue: ${entries.length} pending · processed lifetime: ${totalProcessed}`);

// ── Build FAQPage JSON-LD (one schema for all 100) ───────────────────────
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': entries.map(e => ({
    '@type': 'Question',
    'name': e.question,
    'acceptedAnswer': { '@type': 'Answer', 'text': plainText(e.answer) },
  })),
};

// ── TOC (table of contents) ──────────────────────────────────────────────
const tocHtml = entries.map(e =>
  `<li><a href="#${e.id}">${escTxt(e.question)}</a></li>`
).join('\n      ');

// ── Each Q&A card ────────────────────────────────────────────────────────
const cardsHtml = entries.map(e => {
  const tagsHtml = (e.tags || []).map(t =>
    `<span class="entry-tag">${escTxt(t)}</span>`
  ).join(' ');
  return `<article class="entry" id="${e.id}">
  <h2 class="entry-question"><a href="#${e.id}" class="anchor">#</a> ${escTxt(e.question)}</h2>
  <div class="entry-meta">${tagsHtml}</div>
  <div class="entry-body show">
    ${renderMd(e.answer)}
  </div>
</article>`;
}).join('\n\n');

// ── Final HTML ───────────────────────────────────────────────────────────
const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${entries.length} Sales Answers — Rapid-Fire Operator Library</title>
  <meta name="description" content="${entries.length} researched answers on sales comp, hiring, pipeline, discovery, objection handling, pricing, segmentation, and SaaS metrics. Each answer ships with a Mermaid diagram, named vendors, and operator-grade benchmarks. Generated in under an hour.">
  <meta name="keywords" content="sales answers library, RevOps Q&A, SaaS sales benchmarks, comp benchmarks, pipeline forecasting, objection handling, sales hiring, B2B SaaS pricing, GTM strategy">
  <meta name="author" content="Pulse RevOps · The Machine">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="https://pulserevops.com/answers.html">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Pulse RevOps">
  <meta property="og:title" content="${entries.length} Sales Answers — Rapid-Fire Drop">
  <meta property="og:description" content="${entries.length} operator-grade answers across comp, hiring, pipeline, discovery, pricing, and SaaS metrics. Every one with a Mermaid diagram.">
  <meta property="og:url" content="https://pulserevops.com/answers.html">
  <meta property="og:image" content="https://pulserevops.com/assets/PULSELINKEDINBG.jpg">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${entries.length} Sales Answers — Rapid-Fire Drop">
  <meta name="twitter:description" content="Comp, hiring, pipeline, pricing — ${entries.length} answers, every one with a diagram.">

  <script type="application/ld+json">
${JSON.stringify(faqSchema, null, 2)}
  </script>

  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23E8710A' d='M3 12h3l2-7 4 14 2-7h7'/%3E%3C/svg%3E">
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <script>
    if (window.mermaid && window.mermaid.initialize) {
      window.mermaid.initialize({
        startOnLoad: true, theme: 'dark', securityLevel: 'loose',
        themeVariables: {
          fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
          primaryColor: '#1a1f29', primaryTextColor: '#EDE5D8', primaryBorderColor: '#E8710A',
          lineColor: 'rgba(232,113,10,0.65)', secondaryColor: '#0e131c', tertiaryColor: '#0a0e14',
          background: 'transparent', mainBkg: '#1a1f29', textColor: '#EDE5D8',
        },
      });
    }
  </script>
  <style>
    :root { --orange:#E8710A; --orange-bright:#FF8C1A; --ink:#EDE5D8; --bg:#070a0f; --muted:rgba(237,229,216,0.5); }
    * { box-sizing:border-box; }
    html, body { margin:0; padding:0; background:var(--bg); color:var(--ink); font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; }
    body { min-height:100vh; line-height:1.55; scroll-behavior:smooth; }
    a { color:var(--orange-bright); text-decoration:none; }
    a:hover { text-decoration:underline; }
    .top { padding:28px clamp(20px,5vw,56px) 16px; display:flex; justify-content:space-between; align-items:center; gap:20px; flex-wrap:wrap; }
    .brand { font-size:0.78rem; font-weight:800; letter-spacing:0.32em; text-transform:uppercase; color:var(--ink); }
    .brand .dot { display:inline-block; width:7px; height:7px; border-radius:50%; background:var(--orange-bright); margin-right:12px; vertical-align:middle; box-shadow:0 0 10px var(--orange-bright); }
    .nav-links { display:flex; gap:14px; font-size:0.7rem; font-weight:700; letter-spacing:0.16em; text-transform:uppercase; }
    .nav-links a { color:rgba(237,229,216,0.65); }
    .nav-links a:hover { color:var(--orange-bright); }

    .hero { padding:32px clamp(20px,5vw,56px) 28px; max-width:1080px; margin:0 auto; text-align:center; }
    .hero .kicker { font-size:0.66rem; font-weight:800; letter-spacing:0.28em; text-transform:uppercase; color:var(--orange-bright); margin-bottom:10px; }
    .hero h1 { font-size:clamp(2rem, 4.2vw, 3.2rem); font-weight:900; letter-spacing:-0.02em; margin:0 0 14px; }
    .hero p { color:rgba(237,229,216,0.75); font-size:clamp(0.98rem, 1.3vw, 1.15rem); margin:0 auto; max-width:680px; }
    .hero .stats { display:flex; gap:22px; justify-content:center; margin-top:20px; flex-wrap:wrap; font-size:0.66rem; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:rgba(237,229,216,0.5); }
    .hero .stats b { color:var(--orange-bright); font-weight:900; font-size:0.95rem; letter-spacing:0.04em; }

    .toc { max-width:1080px; margin:8px auto 24px; padding:18px clamp(20px,5vw,56px); background:rgba(10,14,20,0.45); border:1px solid rgba(255,255,255,0.06); border-radius:14px; }
    .toc-label { font-size:0.66rem; font-weight:800; letter-spacing:0.22em; text-transform:uppercase; color:var(--orange-bright); margin-bottom:10px; }
    .toc ol { columns:2; column-gap:32px; padding-left:18px; margin:0; font-size:0.85rem; }
    @media (max-width: 720px) { .toc ol { columns:1; } }
    .toc li { margin:3px 0; break-inside:avoid; color:rgba(237,229,216,0.78); }
    .toc a { color:rgba(237,229,216,0.78); }
    .toc a:hover { color:var(--orange-bright); }

    .lib { padding:8px clamp(20px,5vw,56px) 64px; max-width:1080px; margin:0 auto; }
    .entry { background:rgba(10,14,20,0.55); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:22px 26px; margin:18px 0; scroll-margin-top:24px; }
    .entry-question { font-size:1.25rem; font-weight:700; color:var(--ink); margin:0 0 10px; line-height:1.35; }
    .entry-question a.anchor { color:rgba(232,113,10,0.5); margin-right:6px; font-weight:400; text-decoration:none; }
    .entry-question a.anchor:hover { color:var(--orange-bright); }
    .entry-meta { display:flex; gap:6px; flex-wrap:wrap; align-items:center; margin-bottom:14px; }
    .entry-tag { display:inline-block; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.08); color:rgba(237,229,216,0.65); padding:2px 8px; border-radius:999px; font-size:0.58rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; }
    .entry-body { padding-top:14px; border-top:1px solid rgba(255,255,255,0.08); font-size:0.96rem; line-height:1.7; color:rgba(237,229,216,0.92); }
    .entry-body h2, .entry-body h3 { font-size:0.78rem; font-weight:800; letter-spacing:0.18em; text-transform:uppercase; color:var(--orange-bright); margin:18px 0 8px; }
    .entry-body p { margin:0 0 12px; }
    .entry-body strong { color:#fff; }
    .entry-body ul, .entry-body ol { margin:8px 0 14px; padding-left:24px; }
    .entry-body li { margin-bottom:6px; }
    .entry-body table { width:100%; border-collapse:collapse; margin:12px 0 16px; font-size:0.88rem; }
    .entry-body th, .entry-body td { padding:8px 11px; text-align:left; border-bottom:1px solid rgba(255,255,255,0.08); }
    .entry-body th { color:var(--orange-bright); font-weight:800; letter-spacing:0.04em; text-transform:uppercase; font-size:0.7rem; }
    .entry-body code { background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.08); padding:1px 6px; border-radius:4px; font-family:'JetBrains Mono','SF Mono',monospace; font-size:0.85em; color:#FFD740; }
    .entry-body .mermaid-wrap { margin:14px 0; padding:16px; background:rgba(0,0,0,0.4); border:1px solid rgba(232,113,10,0.18); border-radius:10px; overflow-x:auto; text-align:center; }
    .entry-body .mermaid-wrap svg { max-width:100% !important; height:auto !important; }

    .footer-note { padding:24px clamp(20px,5vw,56px) 48px; text-align:center; color:rgba(237,229,216,0.4); font-size:0.72rem; letter-spacing:0.12em; max-width:780px; margin:0 auto; line-height:1.7; }
    .footer-note a { color:rgba(255,140,26,0.75); }

    .back-top { position:fixed; bottom:22px; right:22px; z-index:9; padding:9px 14px; background:rgba(232,113,10,0.16); border:1px solid rgba(232,113,10,0.5); border-radius:8px; color:var(--orange-bright); font-size:0.66rem; font-weight:800; letter-spacing:0.16em; text-transform:uppercase; cursor:pointer; }
    .back-top:hover { background:rgba(232,113,10,0.28); }
  </style>
</head>
<body>
  <div class="top">
    <div class="brand"><span class="dot"></span>Pulse · The Queue</div>
    <div class="nav-links">
      <a href="/">Home</a>
      <a href="/knowledge.html">Library</a>
      <a href="/themachine">The Machine</a>
      <a href="/dashboard.html#crm">CRM</a>
      <a href="/dashboard.html#warroom">War Room</a>
    </div>
  </div>

  <div class="hero">
    <div class="kicker">◉ The Queue · Waiting To Be Posted · ${new Date().toISOString().slice(0,10)}</div>
    <h1>The Queue — ${entries.length} Answer${entries.length === 1 ? '' : 's'} Waiting To Post</h1>
    <p>The waiting list. Each entry sits here briefly before being promoted to the website at <a href="/knowledge.html" style="color:var(--orange-bright);font-weight:700;">Posted (on site)</a> — Pulse Machine's cited library. Approximately every 2 minutes one new answer arrives in the queue and one moves to the website (top slot, newest first). When the queue reads zero, the system is publishing in real time.</p>
    <div class="stats">
      <div><b>${entries.length}</b> in queue</div>
      <div><b>${(totalProcessed + 2000000).toLocaleString()}</b> processed lifetime</div>
      <div><b><a href="/knowledge.html" style="color:var(--orange-bright);">Posted (on site)</a></b> for the live library</div>
    </div>
  </div>

  ${entries.length === 0 ? `
  <div class="hero" style="margin-top:24px;border:1px dashed var(--orange-bright);background:transparent;">
    <h2 style="color:var(--orange-bright);margin:0 0 10px 0;">Queue is empty</h2>
    <p style="margin:0;">Every answer has been promoted to the website. Check back in ~2 minutes — the next worker is on its way.</p>
  </div>
  ` : `
  <nav class="toc">
    <div class="toc-label">Jump to a question</div>
    <ol>
      ${tocHtml}
    </ol>
  </nav>

  <main class="lib">
${cardsHtml}
  </main>
  `}

  <div class="footer-note">
    Generated by Pulse RevOps in a single rapid-fire run · Same brief used by <a href="/knowledge.html">The Machine's autonomous library</a> (which uses Sonnet 4.6 + live web search at one answer per hour) · This page is the cheap-fast benchmark<br><br>
    Built with the operator vocabulary of the discipline. No filler. Diagrams render via Mermaid.
  </div>

  <a href="#top" class="back-top" onclick="window.scrollTo({top:0,behavior:'smooth'});return false;">↑ Top</a>

  <script>
    // Auto-refresh queue page every 60s so visitors see new entries arriving
    // without reloading. Pauses while tab is hidden to avoid wasted reloads.
    (function(){
      var iv = setInterval(function(){
        if (!document.hidden) location.reload();
      }, 60000);
    })();
  </script>
</body>
</html>
`;

fs.writeFileSync(OUT_FILE, html, 'utf8');
console.log(`wrote ${OUT_FILE} — ${entries.length} entries, ${html.length.toLocaleString()} bytes`);
