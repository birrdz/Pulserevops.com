// ════════════════════════════════════════════════════════════════════════
// pulse-trivia-score — DAILY leaderboard for PULSE trivia (resets 12am ET).
// Each midnight (ET) the day rolls over: the day's #1 is archived as that day's
// WINNER (shown on the homepage), and a fresh board starts. Rollover is LAZY —
// the first request after midnight performs it (no cron needed).
//   GET  -> { ok, day, dayName, top:[{name,score,ts}], winners:[{date,day,name,score}] }
//   POST { name, score } -> { ok, rank, day, top:[...], winners:[...] }
// Blobs: trivia/today.json {day,dayName,scores[]} · trivia/winners.json {winners[]}
// ════════════════════════════════════════════════════════════════════════
let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store',
};
const TODAY_KEY = 'trivia/today.json';
const WIN_KEY = 'trivia/winners.json';
const TOP_N = 20, KEEP = 200, KEEP_WINNERS = 14;
const TZ = 'America/New_York';

function etDate() { return new Date().toLocaleDateString('en-CA', { timeZone: TZ }); }      // 'YYYY-MM-DD'
function etDayName() { return new Date().toLocaleDateString('en-US', { timeZone: TZ, weekday: 'short' }); } // 'Mon'

function initStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) { try { return getStore({ name: 'pulse-machine-library', siteID: sid, token: tok }); } catch (e) { return null; } }
  try { return getStore('pulse-machine-library'); } catch (e) { return null; }
}
const json = (sc, obj) => ({ statusCode: sc, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify(obj) });
const cleanName = s => String(s || '').replace(/[^A-Za-z0-9 _.\-]/g, '').trim().slice(0, 14) || 'Anon';
const cleanScore = n => { const v = Math.floor(Number(n)); return (isFinite(v) && v >= 0 && v <= 1000000) ? v : 0; };

async function getJSON(store, key, fallback) { try { const d = await store.get(key, { type: 'json', consistency: 'strong' }); return d || fallback; } catch (e) { return fallback; } }

// ── House players (seeded for engagement) — deterministic per day so the board
// is stable within a day but fresh each day; capped low enough that a real player
// who answers a handful of questions can top them. ──────────────────────────
const HOUSE = ['Maya R.', 'TJ', 'Sofia', 'rev_ninja', 'Carlos M.', 'Priya', 'Dak', 'Jordan B.', 'Lena', 'quotaQueen', 'Sam W.', 'Nina', 'Theo', 'pipeline_pro', 'Ava', 'Marcus', 'Kim', 'dealcloser', 'Ria', 'Owen', 'Bea', 'Nate', 'Zoe', 'closerKev', 'Gabi', 'Devon', 'Mara', 'snipeWill'];
function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function houseScores(day) {
  const rnd = mulberry32(hashStr('pulse-trivia-' + day));
  const n = 10 + Math.floor(rnd() * 5); // 10–14 house players
  const idx = HOUSE.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const t = idx[i]; idx[i] = idx[j]; idx[j] = t; }
  const out = [];
  for (let k = 0; k < n; k++) { out.push({ name: HOUSE[idx[k]], score: 30 + Math.floor(rnd() * 13) * 10, ts: Date.now(), house: true }); } // 30–150
  return out;
}

// Roll the day over if needed; returns the live {today, winners}.
async function ensureDay(store) {
  const day = etDate();
  let today = await getJSON(store, TODAY_KEY, null);
  let winners = (await getJSON(store, WIN_KEY, { winners: [] })).winners || [];
  if (!today || today.day !== day) {
    // archive the closing day's winner (if it had any scores)
    if (today && Array.isArray(today.scores) && today.scores.length) {
      const w = today.scores.slice().sort((a, b) => b.score - a.score)[0];
      if (w && !winners.some(x => x.date === today.day)) {
        winners.unshift({ date: today.day, day: today.dayName || '', name: w.name, score: w.score });
        winners = winners.slice(0, KEEP_WINNERS);
        try { await store.setJSON(WIN_KEY, { winners }); } catch (e) {}
      }
    }
    today = { day, dayName: etDayName(), scores: houseScores(day) };
    try { await store.setJSON(TODAY_KEY, today); } catch (e) {}
  }
  return { today, winners };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  const store = initStore();
  if (!store) return json(503, { ok: false, reason: 'store not wired' });

  const { today, winners } = await ensureDay(store);
  const topOf = arr => arr.slice().sort((a, b) => b.score - a.score).slice(0, TOP_N);

  if (event.httpMethod === 'GET') {
    return json(200, { ok: true, day: today.day, dayName: today.dayName, top: topOf(today.scores), winners });
  }

  if (event.httpMethod === 'POST') {
    let b = {}; try { b = JSON.parse(event.body || '{}'); } catch (e) {}
    const name = cleanName(b.name), score = cleanScore(b.score);
    if (!score) return json(200, { ok: false, reason: 'no score', winners });
    const existing = today.scores.find(s => s.name.toLowerCase() === name.toLowerCase());
    if (existing) { if (score > existing.score) { existing.score = score; existing.ts = Date.now(); } }
    else today.scores.push({ name, score, ts: Date.now() });
    today.scores.sort((a, b) => b.score - a.score);
    today.scores = today.scores.slice(0, KEEP);
    try { await store.setJSON(TODAY_KEY, today); } catch (e) { return json(200, { ok: false, reason: 'write failed' }); }
    const rank = today.scores.findIndex(s => s.name.toLowerCase() === name.toLowerCase()) + 1;
    return json(200, { ok: true, rank: rank || null, day: today.day, dayName: today.dayName, top: topOf(today.scores), winners });
  }

  return json(405, { ok: false, reason: 'GET or POST only' });
};
