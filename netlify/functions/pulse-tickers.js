// ════════════════════════════════════════════════════════════════════════
// pulse-tickers — daily-refreshed feeds for the homepage scrolling tickers:
//   gold  = 24 "Gold Path" library questions (the brown/gold ticker)
//   pain  = 24 "Pain Strip" operator-pain phrases (the green ticker)
//
// Both rotate DAILY so visitors see fresh content every 24h. The pool is
// computed each day by `pulse-tickers-cron` and cached in the Blobs store
// at `_tickers_daily.json`. This endpoint reads the cache.
//
// GET /.netlify/functions/pulse-tickers
//   → { gold: [...24 strings...], pain: [...24 strings...], generated_iso }
// ════════════════════════════════════════════════════════════════════════

const { getStore } = require('@netlify/blobs');

const STORE = 'pulse-machine-library';
const KEY = '_tickers_daily.json';
const TTL_MS = 25 * 60 * 60 * 1000; // 25h — outlives a daily cron with margin

// Fallback pool — used when cache is empty/stale. Same set the cron uses.
const PAIN_POOL = [
  "My reps don't know their number until it's too late",
  "I'm managing to a forecast I don't trust",
  "My best rep just quit and I didn't see it coming",
  "We hit quota but I still can't explain why",
  "My pipeline looks full and my month is still ending slow",
  "I'm coaching but nothing is changing",
  "I hired fast and now I'm managing slow",
  "Leadership wants a number I can't stand behind",
  "My team is busy but revenue isn't moving",
  "I have data but I don't have visibility",
  "End of month shouldn't feel like a surprise every time",
  "My comp plan is motivating the wrong behavior",
  "I'm spending more on tools than I'm getting out of them",
  "My CRM is full and my forecast is empty",
  "The board wants growth and the team is treading water",
  "My win rate is fine but my cycle time is destroying me",
  "I keep losing deals I thought were committed",
  "My BDRs are burning out and the pipeline isn't replenishing",
  "Top reps are leaving and I can't figure out why",
  "Every QBR feels like the same conversation",
  "I'm forecasting on hope instead of math",
  "My deal desk is becoming a bottleneck",
  "We're winning the wrong customers",
  "I have a comp plan but no one believes the numbers",
  "Renewal season is coming and I have no early-warning signal",
  "My territory plan is from last year and the market moved",
  "Marketing pipeline isn't converting and no one knows why",
  "I keep promising the board a number I privately don't trust",
  "Sales-marketing handoffs are dropping deals on the floor",
  "I have three forecasts and none of them agree",
  "Expansion ARR stalled and I can't trace why",
  "My CSMs are firefighting instead of growing accounts",
  "I'm running pipeline reviews that feel like therapy sessions",
  "My RevOps lead just left and the dashboards are dying",
  "Investors want certainty I can't give them",
  "I want to coach but I don't have the call data to coach from",
  "My top rep is half the number — what happens when she leaves",
  "Discount creep is eating the margin and no one is tracking it",
  "I have 14 dashboards and zero answers",
  "AI is supposed to be helping and my reps are using it to dodge work",
  "I'm forecasting in a spreadsheet because the CRM lies",
  "Every deal review turns into the same five reps' deals",
  "Q4 keeps saving Q3 and I don't have another Q3 in me",
  "My quotas were set by finance and nobody buys into them",
  "I have a ramp plan but new reps still take 9 months to break even",
  "My pricing keeps slipping at the deal desk and I can't see why",
  "I have a great culture and a bad number",
  "I have a great number and a culture that won't last",
  "Customer success is invisible until churn shows up",
];

function dayKey(now) {
  // YYYY-MM-DD in UTC — used as the daily-shuffle seed
  const d = new Date(now);
  return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0') + '-' + String(d.getUTCDate()).padStart(2, '0');
}

function seededShuffle(arr, seedStr) {
  // Deterministic shuffle: same seed → same order (so the daily rotation
  // is stable for the whole UTC day, then re-rotates at 00:00 UTC).
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function initStore() {
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  try {
    return (tok && sid)
      ? getStore({ name: STORE, siteID: sid, token: tok })
      : getStore(STORE);
  } catch (_) { return null; }
}

async function computeFreshSnapshot(store) {
  const today = dayKey(Date.now());
  // (1) Gold path — 24 qs=10 questions from the library (newest qs=10s first)
  let goldPool = [];
  try {
    const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
    goldPool = (idx.entries || [])
      .filter((e) => e && e.id && (e.quality_score || 0) >= 10 && e.question && !/^vq_/i.test(e.id))
      .map((e) => e.question);
  } catch (_) {}
  if (goldPool.length < 24) {
    // Library is too small for a daily pool — pad with curated baseline
    goldPool = goldPool.concat([
      "How do you build a comp plan that keeps your top 20% without overpaying the bottom 60%?",
      "What does a real pipeline review look like vs. a status meeting with slides?",
      "How do you tell your board you're missing quota before they figure it out?",
      "What's the right number of reps before you need a second manager?",
      "How do you onboard a new AE in 30 days without losing a quarter?",
      "When does a RevOps hire actually pay off?",
      "How do you design territory splits that don't start civil wars?",
      "What do you do when your CRM data is too dirty to trust?",
      "How do you run a PIP that actually works instead of just documenting a firing?",
      "What does good channel partner comp actually look like?",
    ]);
  }
  const gold = seededShuffle(goldPool, today + ':gold').slice(0, 24);
  const pain = seededShuffle(PAIN_POOL, today + ':pain').slice(0, 24);
  return {
    gold,
    pain,
    day: today,
    generated_at: Date.now(),
    generated_iso: new Date().toISOString(),
    source: 'pulse-tickers (live compute)',
  };
}

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, max-age=1800, s-maxage=3600', // 30min browser, 1h CDN
  };
  const store = initStore();
  if (!store) return { statusCode: 500, headers, body: JSON.stringify({ ok: false, error: 'store init failed' }) };

  const qs = (event && event.queryStringParameters) || {};
  const force = qs.force === '1' || qs.force === 'true';
  const today = dayKey(Date.now());

  let cached = null;
  try { cached = await store.get(KEY, { type: 'json' }); } catch (_) {}

  // Cache fresh-for-today → return as-is
  if (cached && !force && cached.day === today && cached.generated_at && Date.now() - cached.generated_at < TTL_MS) {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, cached: true, ...cached }) };
  }

  // Stale / missing / forced — recompute
  try {
    const snap = await computeFreshSnapshot(store);
    try { await store.setJSON(KEY, snap); } catch (_) {}
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, cached: false, ...snap }) };
  } catch (err) {
    if (cached) {
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true, cached: true, stale: true, ...cached, fallback_reason: String(err && err.message) }) };
    }
    return { statusCode: 500, headers, body: JSON.stringify({ ok: false, error: String(err && err.message) }) };
  }
};
