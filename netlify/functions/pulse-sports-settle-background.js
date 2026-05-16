// Daily settler — pulls final scores from ESPN's free public API, marks
// each prior pick win/loss/push, updates lifetime + per-sport stats.
// Cron: scheduled for 6am ET (11:00 UTC) daily — after most prior-day
// games finish.

const https = require('https');
const { getStore } = require('@netlify/blobs');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

function getJSON(url) {
  return new Promise((resolve) => {
    https.get(url, { timeout: 10000 }, (res) => {
      let buf = '';
      res.on('data', c => { buf += c; });
      res.on('end', () => {
        try { resolve({ status: res.statusCode, json: JSON.parse(buf) }); }
        catch { resolve({ status: res.statusCode, json: null }); }
      });
    }).on('error', () => resolve({ status: 0, json: null }));
  });
}

function initStore() {
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  try { return getStore('pulse-machine-library'); }
  catch { return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok }); }
}

// ESPN free scoreboard endpoints (no auth required)
const ESPN = {
  NHL:    'https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard',
  NBA:    'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard',
  'NCAA Basketball': 'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard',
  NFL:    'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard',
  'NCAA Football': 'https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard',
  MLB:    'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard',
  UFC:    'https://site.api.espn.com/apis/site/v2/sports/mma/ufc/scoreboard',
  'Premier League': 'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard',
};

function settleByMoneyline(pick, espnEvent) {
  const competitors = espnEvent.competitions[0].competitors;
  const home = competitors.find(c => c.homeAway === 'home');
  const away = competitors.find(c => c.homeAway === 'away');
  const homeScore = parseInt(home.score, 10);
  const awayScore = parseInt(away.score, 10);
  const homeName = home.team.displayName;
  const awayName = away.team.displayName;
  const winnerName = homeScore > awayScore ? homeName : (awayScore > homeScore ? awayName : null);
  // Match by team substring
  const pickedTeam = pick.fav_team;
  if (!winnerName) return 'push';
  if (pickedTeam.toLowerCase().includes(winnerName.toLowerCase().split(' ').slice(-1)[0].toLowerCase()) ||
      winnerName.toLowerCase().includes(pickedTeam.toLowerCase().split(' ').slice(-1)[0].toLowerCase())) {
    return 'won';
  }
  return 'lost';
}

exports.handler = async () => {
  const store = initStore();
  const picks = await store.get('_sports_picks.json', { type: 'json' });
  if (!picks || !Array.isArray(picks.items) || !picks.items.length) {
    return { statusCode: 200, body: 'no picks to settle' };
  }

  const stats = (await store.get('_sports_stats.json', { type: 'json' })) || {
    lifetime: { wins: 0, losses: 0, pushes: 0, total: 0 },
    by_sport: {},
    today: { wins: 0, losses: 0, pushes: 0, total: 0, date: null },
    history: [],
  };

  const today = new Date().toISOString().slice(0, 10);
  if (stats.today.date !== today) {
    stats.today = { wins: 0, losses: 0, pushes: 0, total: 0, date: today };
  }

  let settledCount = 0;
  for (const pick of picks.items) {
    if (pick.settled) continue;
    const espnUrl = ESPN[pick.sport];
    if (!espnUrl) continue;
    const r = await getJSON(espnUrl);
    if (!r.json || !Array.isArray(r.json.events)) continue;
    // Find finished event matching the pick's teams
    const event = r.json.events.find(e => {
      if (!e.status || e.status.type.name !== 'STATUS_FINAL') return false;
      const teams = (e.competitions[0].competitors || []).map(c => c.team.displayName.toLowerCase());
      return teams.some(t => pick.fav_team.toLowerCase().includes(t.split(' ').slice(-1)[0]) ||
                              t.includes(pick.fav_team.toLowerCase().split(' ').slice(-1)[0]));
    });
    if (!event) continue;
    const verdict = settleByMoneyline(pick, event);
    pick.settled = true;
    pick.won = verdict === 'won' ? true : verdict === 'lost' ? false : null;
    pick.settled_at = Date.now();

    // Update stats
    if (!stats.by_sport[pick.sport]) stats.by_sport[pick.sport] = { wins: 0, losses: 0, pushes: 0 };
    if (verdict === 'won') {
      stats.lifetime.wins++; stats.today.wins++; stats.by_sport[pick.sport].wins++;
    } else if (verdict === 'lost') {
      stats.lifetime.losses++; stats.today.losses++; stats.by_sport[pick.sport].losses++;
    } else {
      stats.lifetime.pushes++; stats.today.pushes++; stats.by_sport[pick.sport].pushes++;
    }
    stats.lifetime.total++;
    stats.today.total++;
    settledCount++;
  }

  await store.setJSON('_sports_picks.json', picks);
  await store.setJSON('_sports_stats.json', stats);

  return { statusCode: 200, body: JSON.stringify({ ok: true, settled: settledCount }) };
};
