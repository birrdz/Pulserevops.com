// Pulse Yup/Nope voting — IP-based gamification, no login required.
// Every visitor gets 25 Yup/Nope votes per day (keyed to a hashed IP).
// A Yup/Nope adjusts an entry's community score, which the pillar pages use to
// bubble popular entries to the top of their category. Best-effort storage:
//   pulse-votes blob → '_scores.json' = { [id]: { y, n } }
//                    → '_quota.json'  = { [ipHash]: { d: 'YYYY-MM-DD', u: N } }
//
// GET  /.netlify/functions/pulse-vote            → { ok, scores, remaining, cap }
// POST /.netlify/functions/pulse-vote {id, dir}  → { ok, id, y, n, score, remaining }
//   dir = 'yup' | 'nope'

const { getStore } = require('@netlify/blobs');
let libraryEntryPublicUrl = null;
try { ({ libraryEntryPublicUrl } = require('./lib/library-entry-url')); } catch (e) {}

const SITE = 'https://pulserevops.com';
const DAILY_CAP = 25;
const SCORES_KEY = '_scores.json';
const QUOTA_KEY = '_quota.json';

function initStore() {
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) { try { return getStore({ name: 'pulse-votes', siteID: sid, token: tok }); } catch (e) {} }
  try { return getStore('pulse-votes'); } catch (e) { return null; }
}

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  };
}

function clientIp(event) {
  const h = event.headers || {};
  return (h['x-nf-client-connection-ip'] || (h['x-forwarded-for'] || '').split(',')[0] || h['client-ip'] || '0.0.0.0').trim();
}
function hashIp(ip) {
  let h = 5381;
  const s = 'pv:' + ip;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h.toString(36);
}
function today() { return new Date().toISOString().slice(0, 10); }

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors(), body: '' };
  const store = initStore();
  if (!store) return { statusCode: 200, headers: cors(), body: JSON.stringify({ ok: false, reason: 'no store' }) };

  const ipHash = hashIp(clientIp(event));
  const day = today();

  // Read current state
  let scores = {}, quota = {};
  try { scores = (await store.get(SCORES_KEY, { type: 'json' })) || {}; } catch (e) {}
  try { quota = (await store.get(QUOTA_KEY, { type: 'json' })) || {}; } catch (e) {}

  let q = quota[ipHash];
  if (!q || q.d !== day) q = { d: day, u: 0 };
  const remaining = Math.max(0, DAILY_CAP - q.u);

  if (event.httpMethod === 'GET') {
    return { statusCode: 200, headers: cors(), body: JSON.stringify({ ok: true, scores, remaining, cap: DAILY_CAP }) };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: cors(), body: JSON.stringify({ ok: false, reason: 'method' }) };
  }

  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch (e) {}
  const id = String(body.id || '').replace(/[^\w-]/g, '');
  const dir = body.dir === 'nope' ? 'nope' : (body.dir === 'yup' ? 'yup' : null);
  if (!id || !dir) return { statusCode: 400, headers: cors(), body: JSON.stringify({ ok: false, reason: 'bad params' }) };

  if (remaining <= 0) {
    const cur = scores[id] || { y: 0, n: 0 };
    return { statusCode: 200, headers: cors(), body: JSON.stringify({ ok: false, reason: 'limit', id, y: cur.y, n: cur.n, score: cur.y - cur.n, remaining: 0, cap: DAILY_CAP }) };
  }

  const cur = scores[id] || { y: 0, n: 0 };
  if (dir === 'yup') cur.y = (cur.y || 0) + 1; else cur.n = (cur.n || 0) + 1;
  scores[id] = cur;
  q.u += 1;
  quota[ipHash] = q;

  try { await store.setJSON(SCORES_KEY, scores); } catch (e) {}
  try { await store.setJSON(QUOTA_KEY, quota); } catch (e) {}

  // Notify the owner on every vote (best-effort; never blocks the response value).
  try {
    var url = (libraryEntryPublicUrl ? libraryEntryPublicUrl({ id: id }) : (SITE + '/knowledge/' + id)) || (SITE + '/knowledge/' + id);
    var emoji = dir === 'yup' ? '👍 Yup' : '👎 Nope';
    await fetch(SITE + '/.netlify/functions/pulse-progress-notify?key=pulsemachine-writer-2026', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: emoji + ' vote — ' + id,
        html: '<p>Someone just <b>' + (dir === 'yup' ? "Yup'd 👍" : "Nope'd 👎") + '</b> <b>' + id + '</b>.</p>'
            + '<p>New community score: <b>' + (cur.y - cur.n) + '</b> &nbsp;(' + cur.y + ' yup / ' + cur.n + ' nope)</p>'
            + '<p><a href="' + url + '">' + url + '</a></p>',
      }),
    });
  } catch (e) {}

  return {
    statusCode: 200,
    headers: cors(),
    body: JSON.stringify({ ok: true, id, dir, y: cur.y, n: cur.n, score: cur.y - cur.n, remaining: Math.max(0, DAILY_CAP - q.u), cap: DAILY_CAP }),
  };
};
