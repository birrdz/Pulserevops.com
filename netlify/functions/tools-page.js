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

const SITE = 'https://pulserevops.com';

const TOOLS = {
  'gross-profit-calculator': {
    name: 'Gross Profit Calculator',
    icon: '💰',
    anchor: '#profit-calc-section',
    short: 'Free SaaS gross profit calculator. Model margin per KPI, per rep, per territory — KPI count × revenue-per-unit, totals roll up to monthly + annualized revenue.',
    keywords: ['gross profit calculator', 'saas margin calculator', 'kpi revenue calculator', 'sales gross profit', 'free gp calculator'],
    body: [
      'Most "gross profit calculators" online ask for two numbers and spit out a margin %. That isn\'t how operators think about gross profit. The PULSE Gross Profit Calculator works the way a CRO actually models the business: each KPI line gets its own monthly count and revenue-per-unit, totals roll up to monthly and annualized GP, and the whole thing syncs with House Goals so changing your goals updates margin in real time.',
      'Use it to model the gross profit impact of changing comp accelerators, adding a new service line, or removing a low-margin SKU before you commit. Built for sales leaders running $1M–$200M ARR commercial operations.',
      'Free. No login, no credit card, no email gate. Pull your KPI names directly from House Goals or input them manually. Reset and re-model in 30 seconds.',
    ],
    related_tools: ['house-goals', 'pulse-check', 'recruiting-calculator'],
    related_tags: ['comp-design', 'saas-gtm', 'forecast-accuracy'],
  },

  'service-fees': {
    name: 'Service Fees Calculator',
    icon: '💵',
    anchor: '#service-fees-section',
    short: 'Free service-fees revenue calculator. Add up to 5 fees, set per-fee attach rates and back-office cost — see what % of overhead the fees actually cover.',
    keywords: ['service fees calculator', 'attach rate calculator', 'recurring revenue calculator', 'back office cost coverage', 'service fee model'],
    body: [
      'Service fees are the most under-modeled revenue stream in B2B sales. Most CFOs treat them as a line item; most CROs ignore them entirely. They shouldn\'t. A 65% attach rate on a $9.99 fee across 1,800 monthly units is $140K/month — often more than a junior AE\'s full quota and almost always enough to fully fund the back-office headcount that supports them.',
      'The PULSE Service Fees Calculator lets you model up to 5 fees with their own amounts and attach rates, set a default attach rate that pre-fills new rows, and configure your back-office headcount. The output: monthly fee revenue, annualized, and the % of back-office cost the fees already cover. Use it before you ask the CFO for approval to add another back-office hire.',
      'Free. No login. Saves nothing server-side — your model lives in the browser.',
    ],
    related_tools: ['gross-profit-calculator', 'house-goals'],
    related_tags: ['pricing-strategy', 'revops', 'comp-design'],
  },

  'house-goals': {
    name: 'House Goals (Month-Ahead Goal Setting)',
    icon: '🏠',
    anchor: '#monthly-goals-section',
    short: 'Free month-ahead goal-setting tool. PULSE suggests a smart target per rep using ((3-month avg + same month last year) ÷ 2) × growth factor. Adjust, lock, ship.',
    keywords: ['monthly sales goal calculator', 'rep goal setting tool', 'sales target calculator', 'house goals tool', 'sales quota planning'],
    body: [
      'Most monthly goal-setting is a guess. Or it\'s last month + 5%. Or it\'s the board number divided by headcount. None of those produce a goal that\'s both fair to the rep and accountable to the P&L. House Goals uses a defensible formula: <strong>((3-month average + same month last year) ÷ 2) × growth factor</strong>. That blends recent momentum with seasonal reality, then lets you tune the growth factor by rep, by team, or by segment.',
      'Apply All Suggestions to populate every rep\'s next-month goal at once. Carry Over Current pulls forward the existing month if you want a holdback period. Submit & Lock freezes the goals for the upcoming period — visible to reps, locked from edits, paired with the Pulse Check scoring matrix to keep effort and outcome in sync.',
      'Goals only get set once per month. The window opens automatically; the countdown badge tells you when. Free, browser-only, no account required.',
    ],
    related_tools: ['pulse-check', 'pulse-matrix', 'gross-profit-calculator'],
    related_tags: ['sales-leadership', 'forecast-accuracy', 'cro-playbook'],
  },

  'pulse-check': {
    name: 'Pulse Check (Rep Scoring Matrix)',
    icon: '◉',
    anchor: '#inline-matrix',
    short: 'Free rep-scoring matrix. Score every rep on the metrics that matter — attainment, activity, hygiene, coachability — into one defensible pulse number.',
    keywords: ['rep scoring tool', 'sales performance matrix', 'sales rep scorecard', 'pulse check tool', 'rep accountability tool'],
    body: [
      'Most rep scorecards collapse into one of two failure modes: a single attainment number that ignores effort, or a 14-column dashboard that nobody reads. Pulse Check is the third option — a 5-to-7-metric scoring matrix where you weight what matters, score each rep on a consistent 1–5, and produce one composite Pulse number that\'s defensible in a comp conversation, a PIP, or a board QBR.',
      'Use it weekly during pipeline review, monthly for comp committee, or quarterly for promotions. The matrix forces the operator (you) to commit to what "good" looks like before scoring — which is the opposite of most performance reviews where the criteria materialize after the fact.',
      'Free. No login. Pairs with House Goals via the locked combined Pulse Matrix view (password-protected for owners) where goal-setting and scoring sit side-by-side for full team accountability.',
    ],
    related_tools: ['pulse-matrix', 'coaching', 'house-goals'],
    related_tags: ['sales-leadership', 'cro-playbook', 'performance-management'],
  },

  'pulse-matrix': {
    name: 'Pulse Matrix (Combined Goals × Scoring)',
    icon: '⌬',
    anchor: '#inline-matrix',
    short: 'The locked combined House Goals × Pulse Check view. Goal-setting and rep-scoring side-by-side for end-to-end team accountability.',
    keywords: ['pulse matrix', 'sales accountability matrix', 'rep goal scoring tool', 'combined goals scoring', 'sales leader matrix'],
    body: [
      'Most leaders run goal-setting and rep-scoring in separate spreadsheets. The result: goals get set with one mental model, performance gets scored with another, and the two never meet until comp time when nobody remembers why the goal was the goal in the first place. Pulse Matrix fixes that by locking the two views together — every rep\'s next-month goal sits beside their current Pulse Check score, the comp conversation has all the context in one frame, and there\'s no "we set the goal high because…" argument.',
      'This is the locked combined view. It exists for owners who want a single source of truth for "what we said the rep would do" and "what the rep actually did." Modifications require a password — once the matrix is set, it stays set, because that\'s the whole point.',
      'Free, browser-only. The password gate is intentional — keeps the spreadsheet from getting "tweaked" mid-quarter.',
    ],
    related_tools: ['house-goals', 'pulse-check', 'coaching'],
    related_tags: ['sales-leadership', 'forecast-accuracy', 'cro-playbook'],
  },

  'coaching': {
    name: 'AI Sales Coaching',
    icon: '🎯',
    anchor: '#coaching-section',
    short: 'Free AI-driven sales coaching. Surface the highest-impact coaching opportunity for each rep based on their recent activity, attainment, and pipeline shape.',
    keywords: ['ai sales coaching', 'sales rep coaching tool', 'rep development tool', 'sales manager coaching', 'free coaching tool'],
    body: [
      'Most sales-coaching tools cost $80-$150/seat/month and deliver advice no manager would actually give. PULSE Coaching is different — it analyzes a rep\'s recent week (calls made, demos held, deals advanced, deals slipped) and surfaces the single highest-impact behavioral change that would shift their next two weeks.',
      'Designed for managers who don\'t want to read 300 words to find the action. Every coaching output is one specific behavior, one observable metric, one timeline. Use it before your weekly 1:1.',
      'Free. No login required for the basic coaching prompt. Pairs with Pulse Check so the coaching point and the score row reinforce each other.',
    ],
    related_tools: ['pulse-check', 'pulse-matrix', 'rep-scheduling'],
    related_tags: ['sales-leadership', 'rep-development', 'cro-playbook'],
  },

  'recruiting-calculator': {
    name: 'Recruiting Calculator',
    icon: '🎓',
    anchor: '#recruiting-calc-section',
    short: 'Free recruiting calculator. Tell it your monthly attainment goal, ramp time, and current rep capacity — it tells you exactly how many reps you need to hire, and when.',
    keywords: ['sales recruiting calculator', 'rep hiring calculator', 'sales capacity calculator', 'sdr ae hiring model', 'free recruiting tool'],
    body: [
      'Most "how many reps do I need" calculators ignore the two factors that actually matter: ramp time and current capacity utilization. PULSE Recruiting Calculator builds those in. You input your monthly goal, the average ramp curve (typically 60-90 days to 80% productivity for mid-market AEs), and your current team\'s utilization. It outputs how many reps you need to hire — and when each one needs to start so they\'re ramped before the goal hits.',
      'Use it before the next board meeting when the CRO asks "do we have enough capacity to hit Q3?" The honest answer almost always involves hiring 2-4 weeks earlier than feels comfortable.',
      'Free, browser-only. No saved state — every model is a fresh planning session.',
    ],
    related_tools: ['gross-profit-calculator', 'house-goals', 'rep-scheduling'],
    related_tags: ['hiring', 'gtm-scaling', 'cro-playbook'],
  },

  'rep-scheduling': {
    name: 'Rep Scheduling Matrix',
    icon: '🕒',
    anchor: '#sched-matrix-section',
    short: 'Free rep scheduling tool. Calculate how many shifts you actually need this week to hit the GP target — auto-distributes by day, protects high-value selling hours.',
    keywords: ['sales rep scheduling tool', 'shift calculator', 'sales coverage planner', 'rep capacity scheduler', 'free scheduling matrix'],
    body: [
      'Sales scheduling is usually either "everyone works the same week" (wasteful) or "the manager picks favorites" (toxic). Rep Scheduling Matrix is the operator-grade middle path: input the weekly gross-profit target, the matrix calculates how many shifts you need at your average GP-per-shift, then auto-distributes them across the seven days of the week.',
      'Designed around a healthy schedule by default — 6-hour shifts, 4.5 days/week, doubles only when the math forces it. The output isn\'t just shift counts; it\'s a daily breakdown showing how many people you need on Monday vs Saturday, which reveals coverage holes before they hit your numbers.',
      'Free, browser-only. Pulls revenue benchmarks from House Goals if connected.',
    ],
    related_tools: ['recruiting-calculator', 'gross-profit-calculator', 'pulse-check'],
    related_tags: ['gtm-operations', 'sales-leadership', 'capacity-planning'],
  },

  'lead-enricher': {
    name: 'Lead Enricher',
    icon: '🔍',
    anchor: '#lead-enricher-section',
    short: 'Free lead enricher. Drop in an IP, domain, or company name — get the full firmographic profile (industry, size, tech stack, intent signals).',
    keywords: ['lead enrichment tool', 'free lead enricher', 'company lookup tool', 'b2b lead enrichment', 'ip-to-company lookup'],
    body: [
      'Most lead-enrichment tools cost $1-$5 per record and gate the data behind 14-day trials. PULSE Lead Enricher is free for ad-hoc use — drop a website URL, a company name, or an IP address from your visitor logs and get back the firmographic profile: industry, employee count, location, and (where available) tech stack and intent signals.',
      'Use it for one-off prospect research before a discovery call, for whale-watch (figure out which company just visited your site), or for territory planning when you\'re trying to size a new vertical.',
      'Free for ad-hoc lookups. Powered by IPinfo + first-party intent data when the visitor comes from your own site.',
    ],
    related_tools: ['revenue-intelligence', 'pulse-check'],
    related_tags: ['outbound', 'prospecting', 'revops'],
  },

  'revenue-intelligence': {
    name: 'Revenue Intelligence (CRM)',
    icon: '📊',
    anchor: '#rev-intel-section',
    short: 'The free PULSE CRM. Deals, pipeline, forecast, leaders, beats — operator-grade revenue intelligence without the Salesforce bill.',
    keywords: ['free crm', 'revenue intelligence platform', 'sales pipeline tool', 'free salesforce alternative', 'pulse crm'],
    body: [
      'PULSE Revenue Intelligence is a full operator-grade CRM that runs entirely in your browser — no servers, no logins, no per-seat fees. Deals, pipeline by stage, forecast roll-up, leader-board for reps, and "beats" (the daily activity rhythm that separates the top quartile from the bottom).',
      'Built by a 22-year revenue executive who got tired of paying $175/seat/month for Salesforce features 95% of mid-market teams never use. Designed around the metrics that actually drive forecast accuracy — and pairs natively with House Goals, Pulse Check, and the coaching surface so the same data point lights up everywhere it should.',
      'Free, browser-only, your data stays on your device. No vendor lock-in, no migration risk, no lose-the-CRM-when-you-cancel.',
    ],
    related_tools: ['lead-enricher', 'war-room', 'pulse-matrix'],
    related_tags: ['crm-hygiene', 'pipeline-management', 'forecast-accuracy', 'salesforce'],
  },

  'war-room': {
    name: 'War Room',
    icon: '⚔',
    anchor: '#warroom',
    short: 'The PULSE War Room. Reports on reports on reports — every leadership view, every rep, every deal, in one operational command center.',
    keywords: ['sales war room', 'revops command center', 'sales leadership dashboard', 'sales operations war room', 'sales meeting tool'],
    body: [
      'Most "executive dashboards" are read-only summaries that get printed for the QBR and forgotten. The War Room is the opposite — an operational command surface where pipeline, deals, reps, leaders, and forecast all live together, each clickable, each drill-downable, each driving the next decision.',
      'Built for the moment between Tuesday\'s pipeline meeting and Friday\'s board call when you have 90 minutes to figure out if you\'re going to hit the number. The War Room shows you which deals to push, which reps to call, which leaders to lean on, which forecast assumptions are getting fragile — all in one room, no tab-switching, no spreadsheet exports.',
      'Free. Press <kbd>L</kbd> from any sub-room to return to the War Room.',
    ],
    related_tools: ['revenue-intelligence', 'pulse-matrix', 'coaching'],
    related_tags: ['sales-leadership', 'forecast-accuracy', 'pipeline-management'],
  },
};

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

  // Index mode: /tools/ (no slug) renders a grid of all tools
  if (!slug) {
    const idxUrl = SITE + '/tools/';
    const idxDesc = 'All PULSE tools — free, browser-only, no login. Gross profit calculator, rep scheduling matrix, house goals, pulse check rep scoring, recruiting calculator, lead enricher, full revenue intelligence CRM, war room.';
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
  <meta property="og:image" content="${SITE}/assets/PULSELINKEDINBG.jpg">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23E8710A' d='M3 12h3l2-7 4 14 2-7h7'/%3E%3C/svg%3E">
  <script type="application/ld+json">${JSON.stringify(idxLd)}</script>
  <style>
    *{box-sizing:border-box;}html,body{margin:0;padding:0;background:#070a0f;color:#EDE5D8;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.7;}
    a{color:#FF8C1A;text-decoration:none;}.top{padding:24px clamp(20px,5vw,56px);display:flex;justify-content:space-between;align-items:center;font-size:0.7rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(237,229,216,0.65);border-bottom:1px solid rgba(255,255,255,0.05);}
    main{max-width:1080px;margin:0 auto;padding:48px clamp(20px,5vw,40px) 64px;}
    h1{font-size:clamp(2.2rem,5vw,3.6rem);font-weight:900;letter-spacing:-0.01em;line-height:1.1;margin:0 0 16px;color:#fff;}
    .lead{font-size:1.12rem;color:rgba(237,229,216,0.78);max-width:760px;margin:0 0 36px;}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:14px;}
    .footer-note{padding:32px;text-align:center;color:rgba(237,229,216,0.35);font-size:0.7rem;letter-spacing:0.1em;border-top:1px solid rgba(255,255,255,0.04);}.footer-note a{color:rgba(255,140,26,0.7);}
  </style></head><body>
  <div class="top"><span><a href="/">PULSE REVOPS</a></span><span><a href="/dashboard.html">🛠 Free CRM</a> · <a href="/knowledge.html">📚 Library</a> · <a href="/themachine">The Machine</a></span></div>
  <main>
    <h1>PULSE Tools</h1>
    <p class="lead">${escHtml(idxDesc)} Built by a 22-year revenue executive — free, browser-only, no login required.</p>
    <div class="grid">${cards}</div>
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
  const liveUrl = SITE + '/dashboard.html' + t.anchor;

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
      url: SITE + '/resume',
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
      founder: { '@id': SITE + '/#korywhite' },
    },
  };

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escHtml(t.name)} — Free ${escHtml(t.name)} · PULSE</title>
  <meta name="description" content="${escAttr(t.short)}">
  <meta name="keywords" content="${escAttr(t.keywords.join(', '))}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escAttr(t.name + ' · PULSE')}">
  <meta property="og:description" content="${escAttr(t.short)}">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="Pulse RevOps">
  <meta property="og:image" content="${SITE}/assets/PULSELINKEDINBG.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escAttr(t.name + ' · PULSE')}">
  <meta name="twitter:description" content="${escAttr(t.short)}">
  <meta name="twitter:image" content="${SITE}/assets/PULSELINKEDINBG.jpg">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23E8710A' d='M3 12h3l2-7 4 14 2-7h7'/%3E%3C/svg%3E">
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
      <a class="cta-primary" href="${escAttr(liveUrl)}">Open the live tool ↗</a>
      <a class="cta-ghost" href="/dashboard.html">See all PULSE tools →</a>
    </div>

    <div class="body">
      ${t.body.map(p => `<p>${p}</p>`).join('')}
    </div>

    ${tagLinksHtml ? `
      <div class="section-h">Researched in the library</div>
      <div style="margin-bottom:24px;">${tagLinksHtml}</div>
    ` : ''}

    <div class="section-h">Operators also use</div>
    <div class="related-grid">${relatedHtml}</div>

    <div style="margin:36px 0 0;padding:24px 28px;background:linear-gradient(155deg,rgba(232,113,10,0.08),rgba(10,13,18,0.4));border:1px solid rgba(232,113,10,0.25);border-radius:14px;text-align:center;">
      <div style="font-size:0.7rem;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:#FF8C1A;margin-bottom:10px;">⌬ Built by an operator, free for operators</div>
      <div style="font-size:0.92rem;color:rgba(237,229,216,0.72);max-width:540px;margin:0 auto 16px;">PULSE is a free operator-grade RevOps platform built by a 22-year revenue executive. The Machine — our autonomous AI knowledge engine — researches one operator question every 30 minutes and publishes it free.</div>
      <a class="cta-primary" href="${escAttr(liveUrl)}" style="margin:0;">Open ${escHtml(t.name)} now ↗</a>
    </div>
  </main>
  <div class="footer-note">
    Free PULSE tool · No login, no card, no email gate
    <div style="margin-top:8px;font-size:0.66rem;letter-spacing:0.06em;text-transform:none;color:rgba(237,229,216,0.45);line-height:1.6;">
      Built by <a href="/resume" style="color:rgba(255,140,26,0.85);font-weight:700;">Kory White</a> — 22-year revenue executive, architect of PULSE RevOps · <a href="https://www.linkedin.com/in/korywhite" target="_blank" rel="noopener">LinkedIn</a> · <a href="https://theexecutivereview.org/kory-white.html" target="_blank" rel="noopener">Featured on TheExecutiveReview</a> · <a href="/privacy">Privacy</a>
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

// Export the registry so the sitemap function can read it
exports.TOOLS = TOOLS;
