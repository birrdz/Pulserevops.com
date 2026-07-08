// Standalone, SEO-indexable leaderboard pages — /leaderboards/<pillar>.
// Renders the full Top 25 + Bottom 25 server-side as HTML so Google can crawl
// the rankings + entry names (instead of relying on client-side fetch like
// the homepage widget). Same scrolling-ribbon visuals as the homepage.

const SITE = 'https://pulserevops.com';

// Per-pillar config: which leaderboard function feeds this page + display labels.
// Extend this map as new pillar leaderboards land (kpi, ra, gp, tk, st, q, er, sports).
const PILLARS = {
  franchises: {
    fn: 'pulse-franchise-leaderboard',
    emoji: '🏪',
    name: 'Franchise',
    pillarUrl: '/franchises',
    topLabel: 'Top 25 — Start These',
    bottomLabel: 'Bottom 25 — Skip These',
    topTag: 'Best 2027 unit economics',
    bottomTag: 'Tough conditions, long payback',
    model: 'Daily-shifting model — verdict + payback + EBITDA',
    desc: 'Top 25 franchises to open in 2027 and Bottom 25 to skip. Daily-shifting rankings derived from real FDD numbers, payback period, and EBITDA margin. From our Franchises pillar.',
  },
  books: {
    fn: 'pulse-books-leaderboard',
    emoji: '📖',
    name: 'Sales Book',
    pillarUrl: '/sales-book-summaries',
    topLabel: 'Top 25 — Must-Read',
    bottomLabel: 'Bottom 25 — Skip / Aging',
    topTag: 'Canonical for 2027 operators',
    bottomTag: 'Classic but dated for current playbooks',
    model: 'Authority + recency model',
    desc: 'Top 25 must-read sales books for 2027 operators and Bottom 25 aging/skippable classics. Ranked by author authority, recency, and 2027 RevOps relevance. From our Book Summaries pillar.',
  },
  kpi: {
    fn: 'pulse-pillar-leaderboard?pillar=kpi',
    emoji: '📊', name: 'Industry KPI', pillarUrl: '/industry-kpis',
    topLabel: 'Top 25 — Strongest Benchmark Sets',
    bottomLabel: 'Bottom 25 — Aging Verticals',
    topTag: 'Highest 2027 demand verticals',
    bottomTag: 'Verticals with cooling benchmarks',
    model: 'Topic + recency + depth + variance',
    desc: 'Top 25 industry KPI benchmark sets ranked by 2027 demand, recency, and depth — and Bottom 25 verticals where benchmarks are shifting. From our Industry KPIs pillar.',
  },
  ra: {
    fn: 'pulse-pillar-leaderboard?pillar=ra',
    emoji: '🏗️', name: 'Revenue Architecture', pillarUrl: '/revenue-architecture',
    topLabel: 'Top 25 — Hottest Blueprints',
    bottomLabel: 'Bottom 25 — Cooling Approaches',
    topTag: '2027 industry-architecture blueprints',
    bottomTag: 'Aging mechanic-only deep-dives',
    model: 'Topic + recency + depth + variance',
    desc: 'Top 25 revenue-architecture blueprints for 2027 — industry-specific operating models, comp design, forecasting — and Bottom 25 cooling approaches. From our Revenue Architecture pillar.',
  },
  gp: {
    fn: 'pulse-pillar-leaderboard?pillar=gp',
    emoji: '🗺️', name: 'GTM Playbook', pillarUrl: '/go-to-market-playbooks',
    topLabel: 'Top 25 — Hottest Motions',
    bottomLabel: 'Bottom 25 — Motions Losing Steam',
    topTag: '2027 GTM motions with most lift',
    bottomTag: 'Motions with limited 2027 lift',
    model: 'Topic + recency + depth + variance',
    desc: 'Top 25 GTM motions winning in 2027 — PLG, community-led, signal-driven outbound — and Bottom 25 motions losing steam. From our GTM Playbooks pillar.',
  },
  tk: {
    fn: 'pulse-pillar-leaderboard?pillar=tk',
    emoji: '🧰', name: 'Tech Stack', pillarUrl: '/tech-stacks',
    topLabel: 'Top 25 — Sharpest 2027 Stacks',
    bottomLabel: 'Bottom 25 — Stacks With Aging Components',
    topTag: 'Best-in-class vendor lineups',
    bottomTag: 'Stacks with legacy / aging pieces',
    model: 'Vendor freshness + recency + depth',
    desc: 'Top 25 industry tech stacks for 2027 — operator-graded vendor lineups — and Bottom 25 stacks with aging components. From our Tech Stacks pillar.',
  },
  st: {
    fn: 'pulse-pillar-leaderboard?pillar=st',
    emoji: '⚔', name: 'Sales Training', pillarUrl: '/sales-trainings',
    topLabel: 'Top 25 — Drop-In Sessions',
    bottomLabel: 'Bottom 25 — Pick Selectively',
    topTag: 'High-impact ready-to-run meetings',
    bottomTag: 'Theoretical · pick selectively',
    model: 'Action density + recency + variance',
    desc: 'Top 25 sales-training sessions to drop into next week — ready-to-run, 60-min, action-dense — and Bottom 25 to pick more selectively. From our Sales Trainings pillar.',
  },
  q: {
    fn: 'pulse-pillar-leaderboard?pillar=q',
    emoji: '📚', name: 'Knowledge', pillarUrl: '/knowledge',
    topLabel: 'Top 25 — Trending Now',
    bottomLabel: 'Bottom 25 — Cooling Topics',
    topTag: 'Highest 2027 search demand',
    bottomTag: 'Topics with falling demand',
    model: '2027-topic alignment + recency + depth',
    desc: 'Top 25 trending RevOps Q&A topics in 2027 — AI, agents, PLG, consumption, signals — and Bottom 25 cooling. From our Knowledge Library pillar.',
  },
  reviews: {
    fn: 'pulse-pillar-leaderboard?pillar=er',
    emoji: '⭐', name: 'Electronic Review', pillarUrl: '/electronic-reviews',
    topLabel: 'Top 25 — Operator-Essential',
    bottomLabel: 'Bottom 25 — Low Daily ROI',
    topTag: 'High-utility gear for operators',
    bottomTag: 'Optional gear · low daily ROI',
    model: 'Category utility + recency + variance',
    desc: 'Top 25 operator-essential gear categories in 2027 and Bottom 25 low-ROI optional gear. From our Electronic Reviews pillar.',
  },
  sports: {
    fn: 'pulse-pillar-leaderboard?pillar=sports',
    emoji: '🏈', name: 'Sports / NIL', pillarUrl: '/sports',
    topLabel: 'Top 25 — Strongest NIL Programs',
    bottomLabel: 'Bottom 25 — Weaker NIL Signal',
    topTag: 'Top-tier 2027 NIL economies',
    bottomTag: 'Programs with weaker NIL signals',
    model: 'Program tier + recency + variance',
    desc: 'Top 25 college programs with the strongest 2027 NIL economies and Bottom 25 with weaker NIL signals. From our Sports / NIL pillar.',
  },
};

function esc(s) {
  return String(s || '').replace(/[<>&"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' })[c]);
}

function row(item, i) {
  return '<a class="fl-row" href="' + esc(item.url) + '">'
    + '<div class="fl-rank">#' + (i + 1) + '</div>'
    + '<div><div class="fl-name">' + esc(item.name) + '</div>'
    + '<div class="fl-provides">' + esc(item.provides) + '</div></div>'
    + '<div class="fl-score">' + item.score + '</div></a>';
}

exports.handler = async (event) => {
  // Identify pillar from path: /leaderboards/<key>
  let key = '';
  const m = (event.path || '').match(/\/leaderboards\/([\w-]+)/i);
  if (m) key = m[1].toLowerCase();
  if (!key && event.queryStringParameters && event.queryStringParameters.pillar) {
    key = String(event.queryStringParameters.pillar).toLowerCase();
  }
  const cfg = PILLARS[key];
  if (!cfg) {
    return {
      statusCode: 404,
      headers: { 'Content-Type': 'text/html' },
      body: '<!doctype html><html><head><title>Leaderboard not found</title><meta name="robots" content="noindex"><link rel="stylesheet" href="/assets/pulse-tan.css"></head><body style="background:#070a0f;color:#EDE5D8;font-family:sans-serif;padding:40px;"><h1>Leaderboard not found</h1><p>Available: ' + Object.keys(PILLARS).map(k => '<a href="/leaderboards/' + k + '" style="color:#FF8C1A;">' + k + '</a>').join(' · ') + '</p></body></html>',
    };
  }

  // Fetch the per-pillar JSON leaderboard
  let data = null;
  try {
    const r = await fetch(SITE + '/.netlify/functions/' + cfg.fn);
    data = await r.json();
  } catch (e) { data = null; }
  const top = (data && (data.top25 || data.top5)) || [];
  const bot = (data && (data.bottom25 || data.bottom5)) || [];
  const asof = (data && data.asof) || new Date().toISOString().slice(0, 10);
  const totalEvaluated = (data && data.total_evaluated) || 0;

  const url = SITE + '/leaderboards/' + key;
  const title = `${cfg.emoji} ${cfg.name} Leaderboard 2027 — Top 25 & Bottom 25 Rankings · Pulse RevOps`;
  const desc = cfg.desc;

  // ItemList JSON-LD for the Top 25 — Google can lift this into a rich result
  const itemListLD = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': cfg.name + ' Leaderboard — Top 25',
    'itemListOrder': 'https://schema.org/ItemListOrderDescending',
    'numberOfItems': top.length,
    'url': url,
    'description': desc,
    'itemListElement': top.slice(0, 25).map((it, i) => ({
      '@type': 'ListItem',
      'position': i + 1,
      'name': it.name,
      'url': it.url,
    })),
  };

  // Quick Answer snippet (Law 3) — what this page IS, 40-55 words
  const quickAnswer = `The ${cfg.name} Leaderboard ranks the Top 25 picks and Bottom 25 to avoid for 2027, refreshed daily. Rankings derive from real benchmark data + operator judgment. Use the Top 25 as your shortlist for further research; use the Bottom 25 as a "don't waste your time" filter.`;

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<link rel="canonical" href="${url}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:type" content="website">
<meta property="og:image" content="${SITE}/pulse-og.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${SITE}/pulse-og.png">
<script type="application/ld+json">${JSON.stringify(itemListLD)}</script>
<style>
:root{--bg:#070a0f;--card:#0F1217;--cardh:#161922;--bdr:rgba(255,255,255,.07);--t1:#EEEEF5;--t2:#A0A4B5;--t3:#6E7088;--orange:#FF6B30}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--t1);font-family:'Plus Jakarta Sans',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.5}
a{color:inherit;text-decoration:none}
.wrap{max-width:1280px;margin:0 auto;padding:32px 20px 80px}
.crumb{font-size:11px;color:var(--t3);letter-spacing:.06em;margin-bottom:14px;text-transform:uppercase;font-weight:700}
.crumb a{color:var(--orange)}
h1{font-size:clamp(28px,4.5vw,44px);font-weight:900;letter-spacing:-1px;margin:0 0 14px;line-height:1.05}
.quick{margin:0 0 24px;padding:16px 20px;background:linear-gradient(135deg,rgba(255,140,26,.08),rgba(255,107,48,.04));border-left:4px solid #FF8C1A;border-radius:10px;font-size:15px;line-height:1.65;color:#EDE5D8;font-weight:500}
.quick .label{display:block;font-size:10px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;color:#FF8C1A;margin-bottom:6px}
.fl-cols{display:grid;gap:14px;grid-template-columns:1fr}
@media(min-width:880px){.fl-cols{grid-template-columns:1fr 1fr}}
.fl-col{background:var(--card);border:1px solid var(--bdr);border-radius:14px;padding:14px 14px 10px;position:relative;overflow:hidden}
.fl-col.fl-go{border-color:rgba(34,197,94,.35)}
.fl-col.fl-no{border-color:rgba(239,68,68,.30)}
.fl-col-hd{display:flex;justify-content:space-between;align-items:baseline;margin:0 0 10px;gap:10px;flex-wrap:wrap}
.fl-col-title{font-size:12px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}
.fl-go .fl-col-title{color:#86EFAC}
.fl-no .fl-col-title{color:#FCA5A5}
.fl-col-tag{font-size:10px;color:var(--t3);font-weight:600}
.fl-list{display:flex;flex-direction:column;gap:6px}
.fl-row{display:grid;grid-template-columns:34px 1fr auto;gap:10px;align-items:center;padding:9px 12px;background:rgba(255,255,255,.015);border:1px solid rgba(255,255,255,.04);border-radius:10px;transition:border-color .15s,background .15s}
.fl-row:hover{border-color:rgba(255,107,48,.3);background:rgba(255,107,48,.04)}
.fl-rank{font:900 16px/1 'JetBrains Mono',monospace}
.fl-go .fl-rank{color:#22C55E}
.fl-no .fl-rank{color:#EF4444}
.fl-name{font-size:13.5px;font-weight:700;color:#EEEEF5;line-height:1.25}
.fl-provides{font-size:11px;color:#9CA3AF;margin-top:2px}
.fl-score{font:800 13px/1 'JetBrains Mono',monospace;color:#FFD7A8;white-space:nowrap}
.footer{margin-top:18px;font-size:11px;color:var(--t3);text-align:center}
.toplinks{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0 24px}
.toplinks a{display:inline-flex;align-items:center;gap:6px;padding:7px 12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:99px;color:#EEEEF5;font-size:12px;font-weight:700}
.toplinks a:hover{border-color:rgba(255,107,48,.5);background:rgba(255,107,48,.08)}
</style>
</head>
<body>
<div class="wrap">
  <div class="crumb"><a href="/">Pulse</a> · Leaderboards · ${esc(cfg.name)}</div>
  <h1>${esc(cfg.emoji)} ${esc(cfg.name)} Leaderboard <span style="color:#FF8C1A">— ${esc(asof)}</span></h1>
  <aside class="quick"><span class="label">⚡ Quick Answer</span>${esc(quickAnswer)}</aside>
  <div class="toplinks">
    <a href="/">← Home</a>
    <a href="${esc(cfg.pillarUrl)}">${esc(cfg.emoji)} Browse all ${esc(cfg.name)} entries →</a>
    <a href="/leaderboards/franchises">🏪 Franchise Leaderboard</a>
    <a href="/leaderboards/books">📖 Books Leaderboard</a>
  </div>
  <div class="fl-cols">
    <div class="fl-col fl-go">
      <div class="fl-col-hd">
        <div class="fl-col-title">🟢 ${esc(cfg.topLabel)}</div>
        <div class="fl-col-tag">${esc(cfg.topTag)}</div>
      </div>
      <div class="fl-list">${top.length ? top.map(row).join('') : '<div style="padding:14px;color:var(--t3);font-size:12px;">Rankings rebuilding — refresh in a minute.</div>'}</div>
    </div>
    <div class="fl-col fl-no">
      <div class="fl-col-hd">
        <div class="fl-col-title">🔴 ${esc(cfg.bottomLabel)}</div>
        <div class="fl-col-tag">${esc(cfg.bottomTag)}</div>
      </div>
      <div class="fl-list">${bot.length ? bot.map(row).join('') : '<div style="padding:14px;color:var(--t3);font-size:12px;">Rankings rebuilding — refresh in a minute.</div>'}</div>
    </div>
  </div>
  <div class="footer">As of ${esc(asof)} · ${totalEvaluated} entries evaluated · ${esc(cfg.model)} · Refreshes daily as 2027 conditions shift</div>
</div>
</body>
</html>`;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=600, stale-while-revalidate=3600',
    },
    body: html,
  };
};
