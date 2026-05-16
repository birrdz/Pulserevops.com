// ════════════════════════════════════════════════════════════════════════
// pulse-ff-simulate — Monte Carlo season simulator for Fantasy Football.
//
// For each top-200 player, samples a season-total point distribution from
// (mean projection, stdev) derived from ADP + position. Runs N=1000 sims.
// Aggregates: % of sims each player finishes top-N at their position.
//
// Output drives the "Season Simulations" card on /sports — shows things
// like "Josh Allen wins QB1 in 38% of sims" / "Saquon top-3 RB in 67%".
//
// Blob: pulse-fantasy-football/simulations/_latest.json
// ════════════════════════════════════════════════════════════════════════

const { getStore } = require('@netlify/blobs');

const STORE_NAME = 'pulse-fantasy-football';
const SITE_ID = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const N_SIMS = 1000;

// Base season-points anchors by positional finish in standard scoring.
// These come from 2025 actuals (the just-finished season) and are the
// statistical anchor for the talent curve.
//   index 0 = position #1 finish, last = late starter / waiver tier
const POS_CURVES = {
  QB:  [410, 380, 360, 345, 330, 315, 300, 285, 270, 255, 240, 225, 210, 195, 180, 165, 150, 140, 130, 120],
  RB:  [300, 270, 250, 235, 220, 205, 195, 185, 175, 165, 155, 145, 135, 125, 115, 105, 95,  88,  82,  75],
  WR:  [260, 240, 225, 215, 205, 195, 185, 175, 165, 155, 145, 135, 125, 115, 105, 95,  88,  82,  76,  70],
  TE:  [220, 180, 160, 145, 130, 120, 110, 100, 92,  85,  78,  72,  66,  60,  55,  50,  46,  42,  38,  34],
  K:   [160, 150, 140, 130, 122, 114, 106, 98,  92,  86,  80,  74,  68,  62,  56,  50,  46,  42,  38,  34],
  DST: [180, 165, 150, 138, 128, 118, 108, 98,  90,  82,  74,  66,  60,  54,  48,  42,  38,  34,  30,  26],
};

// Volatility coefficients (stdev / mean) by positional tier. Elite players
// are MORE consistent than tier-2 because injury is the dominant variance
// driver and elite players play more snaps. Late-round = pure variance.
function stdevFactor(positionalRank, posKey) {
  const tier =
    positionalRank <= 3  ? 0.18 :
    positionalRank <= 8  ? 0.26 :
    positionalRank <= 16 ? 0.36 :
                           0.48;
  // Kickers and DSTs are essentially noise; bump stdev.
  if (posKey === 'K' || posKey === 'DST') return tier + 0.15;
  return tier;
}

// Box-Muller transform for one Normal(0,1) sample.
function gaussian01() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function pointsFor(positionalRank, posKey) {
  const curve = POS_CURVES[posKey] || POS_CURVES.WR;
  if (positionalRank <= curve.length) return curve[positionalRank - 1];
  // Tail off after the curve ends
  const lastVal = curve[curve.length - 1];
  return Math.max(20, lastVal - (positionalRank - curve.length) * 3);
}

function initStore() {
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  return getStore({ name: STORE_NAME, siteID: SITE_ID, token: tok });
}

async function run() {
  const store = initStore();

  // Pull the latest rankings (FFC-based for now)
  const latest = await store.get('_latest.json', { type: 'json' });
  if (!latest || !Array.isArray(latest.rankings)) {
    throw new Error('no _latest.json rankings to simulate against');
  }

  // 1) Compute positional rank for each player from current ADP.
  const ranked = latest.rankings.slice();
  const posCounters = {};
  ranked.forEach(p => {
    const k = p.pos;
    posCounters[k] = (posCounters[k] || 0) + 1;
    p._posRank = posCounters[k]; // 1-indexed
    p._mean    = pointsFor(p._posRank, k);
    p._stdev   = p._mean * stdevFactor(p._posRank, k);
  });

  // 2) Run sims. For each sim: sample each player's season total, sort within
  //    position, tally each player's finish.
  const tallies = {}; // playerKey → { top1, top3, top5, top12, sims }
  ranked.forEach(p => {
    tallies[p.name] = {
      name: p.name, pos: p.pos, team: p.team, adpRank: p.rank,
      top1: 0, top3: 0, top5: 0, top12: 0,
    };
  });

  for (let s = 0; s < N_SIMS; s++) {
    // Per-position bucket of {name, sampled}
    const buckets = {};
    ranked.forEach(p => {
      const sampled = Math.max(0, p._mean + p._stdev * gaussian01());
      (buckets[p.pos] = buckets[p.pos] || []).push({ name: p.name, sampled });
    });
    for (const pos in buckets) {
      buckets[pos].sort((a, b) => b.sampled - a.sampled);
      buckets[pos].forEach((p, idx) => {
        const t = tallies[p.name];
        if (!t) return;
        const finish = idx + 1;
        if (finish === 1)  t.top1++;
        if (finish <= 3)   t.top3++;
        if (finish <= 5)   t.top5++;
        if (finish <= 12)  t.top12++;
      });
    }
  }

  // 3) Convert tallies to pct, attach to player rows.
  const enriched = ranked.map(p => {
    const t = tallies[p.name] || {};
    const pct = n => Math.round((n / N_SIMS) * 1000) / 10;
    return {
      rank: p.rank, name: p.name, pos: p.pos, team: p.team,
      top1_pct:  pct(t.top1 || 0),
      top3_pct:  pct(t.top3 || 0),
      top5_pct:  pct(t.top5 || 0),
      top12_pct: pct(t.top12 || 0),
    };
  });

  // 4) Position leaders — players who win their position most often.
  const posWinners = { QB: [], RB: [], WR: [], TE: [] };
  enriched.forEach(p => {
    if (posWinners[p.pos] !== undefined) posWinners[p.pos].push(p);
  });
  for (const pos in posWinners) {
    posWinners[pos].sort((a, b) => b.top1_pct - a.top1_pct);
    posWinners[pos] = posWinners[pos].slice(0, 6);
  }

  // 5) Write
  const out = {
    ok: true,
    generated_at: Date.now(),
    n_sims: N_SIMS,
    season: '2026',
    method: 'Monte Carlo from ADP-derived (mean, stdev) per player, Normal sampling, ' + N_SIMS + ' season totals, sort within position per sim.',
    leaders: posWinners,
    all: enriched,
  };
  await store.setJSON('simulations/_latest.json', out);
  return { ok: true, n_sims: N_SIMS, players_simulated: ranked.length, qb1_top: posWinners.QB[0] };
}

exports.handler = async () => {
  try {
    const out = await run();
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(out) };
  } catch (e) {
    return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, error: e.message }) };
  }
};
