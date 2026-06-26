// Generic per-pillar leaderboard — Top 25 + Bottom 25 with pillar-specific
// scoring. Powers /leaderboards/<pillar> for every pillar that doesn't have a
// custom function (franchises + books have their own). Same response shape so
// the leaderboard page renderer + homepage widgets work unchanged.
//
// Usage: GET /.netlify/functions/pulse-pillar-leaderboard?pillar=<key>
// Keys: kpi, ra, gp, tk, st, q, er, sports

const { getStore } = require('@netlify/blobs');

const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

function initStore() {
  const token = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  if (!token) return null;
  return getStore({ name: 'pulse-machine-library', siteID: SID, token });
}

// Per-pillar config: ID regex, hot/cold topic keyword weights, URL prefix,
// "provides" line templates, and the human label for top/bottom tiers.
const PILLAR_CFG = {
  kpi: {
    id: /^ik\d+$/i,
    url: '/industry-kpis/',
    hot:  ['saas','ai','agent','automation','revops','revenue ops','platform','vertical','b2b','signal','pipeline','intent','consumption'],
    cold: ['print','fax','call center cold','legacy','onprem','on-prem','door knock','direct mail'],
    topProvides:  'Strong 2027 benchmark set',
    bottomProvides:'Aging vertical · benchmarks shifting',
  },
  ra: {
    id: /^ra\d+$/i,
    url: '/revenue-architecture/',
    hot:  ['industry','architect','vertical','saas','platform','consumption','plg','plg-led','expansion','nrr','grr','intent','signal','ai','agent'],
    cold: ['outbound spray','cold dial','legacy crm','spreadsheet forecast','rep ranking sheet'],
    topProvides:  'Operator-grade 2027 blueprint',
    bottomProvides:'Operational tactic — depth varies',
  },
  gp: {
    id: /^gp\d+$/i,
    url: '/go-to-market-playbooks/',
    hot:  ['plg','product-led','community','signal','intent','platform','vertical','consumption','nrr','expansion','ai','agent','partner-led'],
    cold: ['mass mail','cold spray','door-to-door','outbound spray'],
    topProvides:  'Top 2027 GTM motion',
    bottomProvides:'Motion with limited 2027 lift',
  },
  tk: {
    id: /^tk\d+$/i,
    url: '/tech-stacks/',
    hot:  ['hubspot','salesforce','outreach','salesloft','gong','clari','snowflake','databricks','rb2b','common room','clay','warmly','ai','agent'],
    cold: ['outdated','legacy','onprem','homegrown','spreadsheet'],
    topProvides:  'Sharpest 2027 vendor lineup',
    bottomProvides:'Stack with aging components',
  },
  st: {
    id: /^st\d+$/i,
    url: '/sales-trainings/',
    hot:  ['discovery','meddpicc','meddicc','challenger','medical','negotiation','closing','objection','pipeline','forecast','renewal','expansion'],
    cold: ['cold call script','door-to-door','spray and pray'],
    topProvides:  'Ready-to-run · high-impact session',
    bottomProvides:'Theoretical · pick selectively',
  },
  q: {
    id: /^q\d+$/i,
    url: '/knowledge/',
    hot:  ['2027','ai','agent','platform','consumption','plg','revops','signal','intent','industry','vertical','saas','expansion','nrr','renewal','forecast'],
    cold: ['legacy','outdated','spreadsheet','cold call','dial','door'],
    topProvides:  'Trending · highest 2027 demand',
    bottomProvides:'Older topic · still cited but cooling',
  },
  er: {
    id: /^er\d+$/i,
    url: '/electronic-reviews/',
    hot:  ['monitor','headphone','webcam','microphone','standing desk','laptop','dock','ssd','gpu','keyboard','mouse','ergonomic'],
    cold: ['novelty','gadget','phone case','sticker'],
    topProvides:  'High-utility · operator-essential',
    bottomProvides:'Optional gear · low daily ROI',
  },
  sports: {
    id: null, // filter via tags instead of id-prefix
    tagRx: /^(sports|nil|football|mbb|wbb|college-sports|nil-business)$/i,
    url: '/knowledge/',
    hot:  ['nil','football','sec','big ten','b1g','playoff','revenue share','collective','men','women','mbb','wbb','top-25'],
    cold: ['mid-major','independent','low-major','d-iii'],
    topProvides:  'Top 2027 program · strong NIL economy',
    bottomProvides:'Program with weaker NIL signal',
  },
};

function dailySeed(idAndDate) {
  let h = 0;
  for (let i = 0; i < idAndDate.length; i++) h = ((h << 5) - h + idAndDate.charCodeAt(i)) | 0;
  return ((h >>> 0) % 10000) / 10000;
}

function shortName(q) {
  if (!q) return '';
  let s = String(q).trim();
  // Knock off the click-magnet SERP suffixes that the entry handler adds
  s = s.replace(/\s*[·—–\-]\s*(2027 Benchmarks|2027 Stack|2027 Operator Blueprint|2027 Step-by-Step Playbook|60-Min Ready-to-Run Meeting|Top-10 \+ Best Overall|Step-by-Step Answer|Cliff Notes Summary|Reviews and Expert Analysis|Real FDD Numbers).*$/i, '');
  if (s.length > 110) s = s.slice(0, 108) + '…';
  return s;
}

function scoreEntry(entry, cfg, dateKey) {
  const q = String(entry.question || '').toLowerCase();
  const tags = (Array.isArray(entry.tags) ? entry.tags : []).map(t => String(t).toLowerCase());
  const hay = q + ' ' + tags.join(' ');

  // Topic alignment: +N for each hot keyword hit, -N for each cold hit
  let topic = 0;
  for (const kw of cfg.hot)  if (hay.includes(kw.toLowerCase())) topic += 8;
  for (const kw of cfg.cold) if (hay.includes(kw.toLowerCase())) topic -= 10;
  topic = Math.max(-25, Math.min(35, topic));

  // Recency: more-recently-polished entries get a small bump
  let recency = 0;
  const ts = entry.polished_at || entry.ts || 0;
  if (ts) {
    const daysOld = (Date.now() - ts) / 86400000;
    if (daysOld < 14)  recency = 8;
    else if (daysOld < 60)  recency = 4;
    else if (daysOld < 180) recency = 0;
    else recency = -4;
  }

  // Depth: longer answer = deeper coverage (proxy for quality)
  const wc = String(entry.answer || '').split(/\s+/).filter(Boolean).length;
  let depth = 0;
  if (wc >= 2200) depth = 6;
  else if (wc >= 1800) depth = 4;
  else if (wc >= 1400) depth = 2;
  else if (wc >= 1000) depth = 0;
  else depth = -4;

  // Daily variance ±6
  const variance = (dailySeed(entry.id + '|' + dateKey) - 0.5) * 12;

  let score = 60 + topic + recency + depth + variance;
  score = Math.max(1, Math.min(99, Math.round(score)));
  return { score, topic, recency, depth };
}

function provideLine(s, cfg) {
  if (s.score >= 75) return cfg.topProvides;
  if (s.score >= 55) return 'Solid · still worth reading';
  return cfg.bottomProvides;
}

exports.handler = async (event) => {
  const qs = (event && event.queryStringParameters) || {};
  const key = String(qs.pillar || '').toLowerCase();
  const cfg = PILLAR_CFG[key];
  if (!cfg) {
    return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, err: 'unknown pillar', valid: Object.keys(PILLAR_CFG) }) };
  }

  const store = initStore();
  if (!store) {
    return { statusCode: 503, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, err: 'no_store' }) };
  }

  let idx;
  try {
    idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  } catch (e) {
    return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, err: 'idx_read_failed' }) };
  }

  // Filter to this pillar's entries — by id-prefix or tag-pattern
  const allEntries = idx.entries || [];
  const isMatch = (e) => {
    if (!e || !e.id) return false;
    if (cfg.id && cfg.id.test(e.id)) return true;
    if (cfg.tagRx && Array.isArray(e.tags)) {
      for (const t of e.tags) if (cfg.tagRx.test(String(t).toLowerCase())) return true;
    }
    return false;
  };
  // Knowledge pillar: exclude entries that belong to OTHER pillars by id-prefix
  // (st, ik, tk, gb, bs, er, ra, gp, fr) so /^q\d+$/ doesn't sweep vq_/sports.
  const pillarEntries = allEntries.filter(e => {
    if (key === 'q') {
      if (!/^q\d+$/i.test(e.id || '')) return false;
      return true;
    }
    if (key === 'sports') return isMatch(e);
    return isMatch(e);
  }).slice(0, 200);

  const dateKey = new Date().toISOString().slice(0, 10);
  const scored = (await Promise.all(pillarEntries.map(async (ref) => {
    try {
      const blob = await store.get('answers/' + ref.id + '.json', { type: 'json' });
      if (!blob) return null;
      const s = scoreEntry({ ...ref, ...blob }, cfg, dateKey);
      return {
        id: ref.id,
        name: shortName(blob.question || ref.question || ref.id),
        score: s.score,
        provides: provideLine(s, cfg),
        url: 'https://pulserevops.com' + cfg.url + ref.id,
      };
    } catch (e) { return null; }
  }))).filter(Boolean);

  scored.sort((a, b) => b.score - a.score);
  const top25 = scored.slice(0, 25);
  const bottom25 = scored.slice(-25).reverse();

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=120, stale-while-revalidate=600',
    },
    body: JSON.stringify({
      ok: true,
      pillar: key,
      asof: new Date().toISOString().slice(0, 10),
      total_evaluated: scored.length,
      top25,
      bottom25,
      top5: top25.slice(0, 5),
      bottom5: bottom25.slice(0, 5),
    }),
  };
};
