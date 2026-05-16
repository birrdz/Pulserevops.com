// ════════════════════════════════════════════════════════════════════════
// pulse-ff-daily — daily Fantasy Football Top-N rankings aggregator.
//
// Phase 1: pulls 10-team standard (non-PPR) ADP from FantasyFootballCalculator
// (free public API). Writes today's snapshot + computes deltas vs yesterday.
//
// Phase 2 (later): adds Sleeper, ESPN, Yahoo, FantasyPros, NFL.com, CBS,
// KeepTradeCut as additional sources and aggregates into a true consensus.
//
// League spec (user-locked): 10-team, standard scoring (no PPR), starting
// lineup QB / 2RB / 2WR / TE / FLEX / K / DST.
//
// Blob store: pulse-fantasy-football
//   sources/ffc-YYYY-MM-DD.json   raw ADP snapshot from FFC
//   sources/ffc-latest.json       last successful FFC snapshot
//   daily/YYYY-MM-DD.json         aggregated rankings + metadata
//   _latest.json                  most recent aggregated rankings (page reads this)
//   _meta.json                    last update times, source health
// ════════════════════════════════════════════════════════════════════════

const { getStore } = require('@netlify/blobs');

const STORE_NAME = 'pulse-fantasy-football';
const SITE_ID = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

function todayET() {
  // YYYY-MM-DD in America/New_York (the user's league timezone)
  const now = new Date();
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' });
  return fmt.format(now);
}

function ymdMinusDays(n) {
  const d = new Date(Date.now() - n * 86400000);
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' });
  return fmt.format(d);
}

function initStore() {
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  return getStore({ name: STORE_NAME, siteID: SITE_ID, token: tok });
}

async function fetchFFC() {
  // Try the upcoming NFL season first (this year + 1 if we're past March = next
  // season is "this calendar year"). Fall back to default (most recent complete
  // season) when upcoming-season mock drafts haven't started yet.
  const now = new Date();
  const upcomingSeason = now.getMonth() >= 2 ? now.getFullYear() : now.getFullYear() - 1;
  for (const year of [upcomingSeason, '']) {
    const qs = year ? '?teams=10&position=all&year=' + year : '?teams=10&position=all';
    const url = 'https://fantasyfootballcalculator.com/api/v1/adp/standard' + qs;
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'pulse-ff-daily/1.0' } });
      if (!r.ok) continue;
      const j = await r.json();
      if (j.status !== 'Success') continue;
      if (!Array.isArray(j.players) || j.players.length === 0) continue;
      j._requested_year = year || 'default';
      return j;
    } catch (_) { /* try next */ }
  }
  throw new Error('FFC: no usable ADP for any candidate year');
}

function normalizeFFC(j) {
  // Sort by ADP ascending and emit a clean shape the page can render directly.
  const players = (j.players || []).slice().sort((a, b) => (a.adp || 999) - (b.adp || 999));
  return players.map((p, i) => ({
    rank: i + 1,
    name: p.name,
    pos: p.position === 'DEF' ? 'DST' : p.position === 'PK' ? 'K' : p.position,
    team: p.team || '',
    bye: p.bye || null,
    adp: p.adp,
    adp_round_pick: p.adp_formatted,
    high: p.high,
    low: p.low,
    stdev: p.stdev,
    times_drafted: p.times_drafted,
    sources: ['FantasyFootballCalculator'],
  }));
}

function computeDeltas(today, yesterday) {
  if (!yesterday || !Array.isArray(yesterday.rankings)) return today;
  const prevByName = {};
  yesterday.rankings.forEach(p => { prevByName[p.name] = p.rank; });
  return today.map(p => {
    const prevRank = prevByName[p.name];
    return Object.assign({}, p, {
      prev_rank: prevRank || null,
      delta: prevRank ? prevRank - p.rank : null, // positive = riser
    });
  });
}

async function run() {
  const store = initStore();
  const today = todayET();
  const yesterday = ymdMinusDays(1);

  // 1) fetch FFC
  const ffcRaw = await fetchFFC();
  await store.setJSON('sources/ffc-' + today + '.json', ffcRaw);
  await store.setJSON('sources/ffc-latest.json', ffcRaw);

  // 2) normalize
  const normalized = normalizeFFC(ffcRaw);

  // 3) load yesterday's aggregate for delta calc
  let prevAgg = null;
  try { prevAgg = await store.get('daily/' + yesterday + '.json', { type: 'json' }); } catch (_) {}
  if (!prevAgg) {
    try { prevAgg = await store.get('_latest.json', { type: 'json' }); } catch (_) {}
  }

  // 4) compute deltas
  const withDeltas = computeDeltas(normalized, prevAgg);

  // 5) movers (top 10 risers / fallers among players ranked top-200)
  const ranked200 = withDeltas.filter(p => p.rank <= 200);
  const risers  = ranked200.filter(p => (p.delta || 0) > 0).sort((a, b) => b.delta - a.delta).slice(0, 10);
  const fallers = ranked200.filter(p => (p.delta || 0) < 0).sort((a, b) => a.delta - b.delta).slice(0, 10);

  const aggregate = {
    ok: true,
    generated_at: Date.now(),
    date: today,
    league: {
      teams: 10,
      scoring: 'standard',
      starters: 'QB / 2 RB / 2 WR / TE / FLEX / K / DST',
    },
    source_meta: {
      ffc: {
        type: ffcRaw.meta && ffcRaw.meta.type,
        teams: ffcRaw.meta && ffcRaw.meta.teams,
        rounds: ffcRaw.meta && ffcRaw.meta.rounds,
        total_drafts: ffcRaw.meta && ffcRaw.meta.total_drafts,
        window_start: ffcRaw.meta && ffcRaw.meta.start_date,
        window_end: ffcRaw.meta && ffcRaw.meta.end_date,
        requested_year: ffcRaw._requested_year,
      },
    },
    sources_used: ['FantasyFootballCalculator'],
    rankings: withDeltas,
    movers: { risers, fallers },
  };

  // 6) write
  await store.setJSON('daily/' + today + '.json', aggregate);
  await store.setJSON('_latest.json', aggregate);

  // 7) meta
  const meta = (await store.get('_meta.json', { type: 'json' })) || {};
  meta.last_run_ms = Date.now();
  meta.last_run_date = today;
  meta.sources = meta.sources || {};
  meta.sources.ffc = { last_ok_ms: Date.now(), last_count: normalized.length };
  await store.setJSON('_meta.json', meta);

  return {
    ok: true,
    date: today,
    total_players: normalized.length,
    risers_count: risers.length,
    fallers_count: fallers.length,
  };
}

exports.handler = async () => {
  try {
    const out = await run();
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(out) };
  } catch (e) {
    return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, error: e.message }) };
  }
};
