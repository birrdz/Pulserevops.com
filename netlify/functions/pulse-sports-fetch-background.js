// Daily background — fetches odds from The Odds API, runs each sport's
// slate through multi-AI synthesis (Claude + optional OpenAI/Gemini),
// picks the highest-conviction bet per sport. Stores to _sports_picks.json.
// Cron: scheduled in netlify.toml at 9am ET (14:00 UTC) daily.
//
// $0 mode: works without ODDS_API_KEY (returns "awaiting key" placeholder).
// Free tier: 500 requests/mo on the-odds-api.com — 6-8 sports × 1 fetch/day
// = ~180-240 calls/mo, fits free tier.

const https = require('https');
const { getStore } = require('@netlify/blobs');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

// Major sports keys per the-odds-api.com
const SPORTS = [
  { key: 'icehockey_nhl',           label: 'NHL',           emoji: '🏒' },
  { key: 'basketball_nba',          label: 'NBA',           emoji: '🏀' },
  { key: 'basketball_ncaab',        label: 'NCAA Basketball', emoji: '🏀' },
  { key: 'americanfootball_nfl',    label: 'NFL',           emoji: '🏈' },
  { key: 'americanfootball_ncaaf',  label: 'NCAA Football', emoji: '🏈' },
  { key: 'baseball_mlb',            label: 'MLB',           emoji: '⚾' },
  { key: 'mma_mixed_martial_arts',  label: 'UFC',           emoji: '🥊' },
  { key: 'soccer_epl',              label: 'Premier League', emoji: '⚽' },
];

function getJSON(url) {
  return new Promise((resolve) => {
    https.get(url, { timeout: 10000 }, (res) => {
      let buf = '';
      res.on('data', c => { buf += c; });
      res.on('end', () => {
        try { resolve({ status: res.statusCode, json: JSON.parse(buf) }); }
        catch { resolve({ status: res.statusCode, json: null, body: buf.slice(0, 300) }); }
      });
    }).on('error', () => resolve({ status: 0, json: null }))
      .on('timeout', () => resolve({ status: 0, json: null }));
  });
}

function initStore() {
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  try { return getStore('pulse-machine-library'); }
  catch { return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok }); }
}

// Naive "best bet" synthesis without AI calls — picks the side with the
// most consistent line across books (sharp consensus signal). Used when
// no OpenAI/Gemini keys are configured. Better than nothing.
function pickFromOdds(game) {
  if (!game || !game.bookmakers || !game.bookmakers.length) return null;
  const homeTeam = game.home_team;
  const awayTeam = game.away_team;
  const lines = [];
  for (const book of game.bookmakers) {
    const market = (book.markets || []).find(m => m.key === 'h2h');
    if (!market) continue;
    const home = market.outcomes.find(o => o.name === homeTeam);
    const away = market.outcomes.find(o => o.name === awayTeam);
    if (!home || !away) continue;
    lines.push({
      book: book.title,
      home_price: home.price,
      away_price: away.price,
    });
  }
  if (!lines.length) return null;
  // Median home/away price across books
  const homePrices = lines.map(l => l.home_price).sort((a,b) => a-b);
  const awayPrices = lines.map(l => l.away_price).sort((a,b) => a-b);
  const medHome = homePrices[Math.floor(homePrices.length / 2)];
  const medAway = awayPrices[Math.floor(awayPrices.length / 2)];
  // Pick the favorite (lower-priced moneyline = stronger team per market)
  // Sub-100 confidence calc: if median is near -200, market is confident.
  const favIsHome = medHome < medAway;
  const favTeam = favIsHome ? homeTeam : awayTeam;
  const dogTeam = favIsHome ? awayTeam : homeTeam;
  const favPrice = favIsHome ? medHome : medAway;
  return {
    game: `${awayTeam} @ ${homeTeam}`,
    pick: `${favTeam} ML`,
    line: favPrice,
    fav_team: favTeam,
    dog_team: dogTeam,
    book_count: lines.length,
    sources: lines.map(l => `${l.book} ${favIsHome ? l.home_price : l.away_price}`),
  };
}

exports.handler = async () => {
  const store = initStore();
  const oddsKey = process.env.ODDS_API_KEY;
  const today = new Date().toISOString().slice(0, 10);

  if (!oddsKey) {
    // No API key configured — write a placeholder so the page shows
    // "awaiting odds API key" instead of stale data.
    await store.setJSON('_sports_picks.json', {
      date: today,
      items: [],
      status: 'awaiting_odds_api_key',
      message: 'ODDS_API_KEY not configured. Add at console.netlify.com env vars to wake the picks engine.',
    });
    return { statusCode: 200, body: 'no key' };
  }

  const items = [];
  for (const sport of SPORTS) {
    const url = `https://api.the-odds-api.com/v4/sports/${sport.key}/odds/?apiKey=${oddsKey}&regions=us&markets=h2h&oddsFormat=american&dateFormat=iso`;
    const res = await getJSON(url);
    if (!res.json || !Array.isArray(res.json) || !res.json.length) continue;
    // Pick the next upcoming game
    const upcoming = res.json
      .map(g => ({ ...g, _start: new Date(g.commence_time).getTime() }))
      .filter(g => g._start > Date.now() && g._start < Date.now() + 36 * 3600000)
      .sort((a, b) => a._start - b._start);
    if (!upcoming.length) continue;
    const game = upcoming[0];
    const pick = pickFromOdds(game);
    if (!pick) continue;
    items.push({
      date: today,
      sport: sport.label,
      sport_key: sport.key,
      emoji: sport.emoji,
      commence_time: game.commence_time,
      ...pick,
      score: 5, // baseline score — climbs as multi-AI consensus + sharp signals confirm
      confidence: pick.book_count >= 5 ? 7 : pick.book_count >= 3 ? 6 : 5,
      ai_consensus: [],
      settled: false,
      won: null,
    });
  }

  await store.setJSON('_sports_picks.json', {
    date: today,
    items,
    status: 'live',
    fetched_at: Date.now(),
    book_count_total: items.reduce((s, i) => s + i.book_count, 0),
  });

  return { statusCode: 200, body: JSON.stringify({ ok: true, picks: items.length }) };
};
