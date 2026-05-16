// entry-view — log a single page-view on a library entry, return the
// top-N trending entries for the last 7 days. Storage is a single rolling
// blob (pulse-view-counts) for simplicity; race-tolerant for low-traffic
// library since reads/writes are fast enough.
//
// POST { id } → increments today's count for that entry (returns ok)
// GET ?trending=1 → top 12 entries by 7-day sum, with id + count
// GET ?id=qXXXX → single entry's count summary
//
// Storage shape (single blob 'counts.json' inside store 'pulse-view-counts'):
//   {
//     entries: { "q1843": { total: 22, days: { "2026-05-05": 7, "2026-05-04": 11, ... } } },
//     last_pruned: 1714780800000
//   }

const { getStore } = require('@netlify/blobs');
const crypto = require('crypto');

function initBlob(name) {
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  try { return getStore(name); }
  catch (e1) { if (tok && sid) { try { return getStore({ name, siteID: sid, token: tok }); } catch (e2) { return null; } } return null; }
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}
function lastNDays(n) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const d = new Date(Date.now() - i * 86400000);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

// Bot UA filter — pages opened by crawlers/preview-fetchers don't count as reads.
const BOT_RE = /bot|crawl|spider|slurp|baidu|yandex|googlebot|bingbot|facebookexternalhit|whatsapp|twitterbot|linkedinbot|preview|fetch|monitor|scrape|curl|wget|python-requests|axios|node-fetch|headlesschrome|puppeteer|playwright|lighthouse/i;
function looksLikeBot(ua) { return !ua || BOT_RE.test(String(ua)); }

// Hash IP+UA so we can dedupe one human per entry per day without storing raw IPs.
function visitorFingerprint(headers) {
  const ip = headers['x-nf-client-connection-ip']
    || (headers['x-forwarded-for'] || '').split(',')[0].trim()
    || headers['client-ip'] || 'unknown';
  const ua = headers['user-agent'] || '';
  return crypto.createHash('sha256').update(ip + '|' + ua).digest('hex').slice(0, 12);
}

// Read either legacy numeric day-buckets ({"2026-05-05": 7}) or new shape
// ({"2026-05-05": {c: 7, ips: [...]}}). Returns count.
function dayCount(slot) {
  if (slot == null) return 0;
  if (typeof slot === 'number') return slot;
  return slot.c || 0;
}

exports.handler = async (event) => {
  const store = initBlob('pulse-view-counts');
  if (!store) return { statusCode: 500, body: JSON.stringify({ ok: false, reason: 'blob unavailable' }) };

  if (event.httpMethod === 'GET') {
    const qs = event.queryStringParameters || {};
    const counts = (await store.get('counts.json', { type: 'json' })) || { entries: {}, last_pruned: 0 };
    if (qs.trending || qs.all) {
      // Sum last 7 days for each entry. ?trending=1 → top 12 sorted desc;
      // ?all=1 → flat { id: sum } map of every entry with sum>0 (for grid badges).
      const days7 = lastNDays(7);
      const ranked = Object.keys(counts.entries || {})
        .map(id => {
          const e = counts.entries[id] || {};
          let sum = 0;
          for (const d of days7) sum += dayCount(e.days && e.days[d]);
          return { id, sum, total: e.total || 0 };
        })
        .filter(r => r.sum > 0);
      if (qs.all) {
        const map = {};
        for (const r of ranked) map[r.id] = r.sum;
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=120' },
          body: JSON.stringify({ ok: true, counts: map }),
        };
      }
      ranked.sort((a, b) => b.sum - a.sum);
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' },
        body: JSON.stringify({ ok: true, trending: ranked.slice(0, 12) }),
      };
    }
    if (qs.id) {
      const e = (counts.entries || {})[qs.id] || { total: 0, days: {} };
      const flatDays = {};
      for (const d of Object.keys(e.days || {})) flatDays[d] = dayCount(e.days[d]);
      return { statusCode: 200, body: JSON.stringify({ ok: true, id: qs.id, total: e.total || 0, days: flatDays }) };
    }
    return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'specify ?trending=1 or ?id=qXXXX' }) };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ ok: false, reason: 'POST or GET' }) };
  }
  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch (e) { return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'bad json' }) }; }
  const id = String(body.id || '').trim();
  if (!id || !/^v?q[a-z0-9_]*\d+$/i.test(id)) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'bad id' }) };
  }

  // Bot filter — skip increment but return ok so the client doesn't error.
  const ua = (event.headers && event.headers['user-agent']) || '';
  if (looksLikeBot(ua)) {
    return { statusCode: 200, body: JSON.stringify({ ok: true, id, skipped: 'bot' }) };
  }

  // Read-modify-write
  const counts = (await store.get('counts.json', { type: 'json' })) || { entries: {}, last_pruned: 0 };
  if (!counts.entries) counts.entries = {};
  if (!counts.entries[id]) counts.entries[id] = { total: 0, days: {} };
  const today = todayKey();
  const fp = visitorFingerprint(event.headers || {});

  // Migrate legacy numeric slot to {c, ips} shape on first touch.
  let slot = counts.entries[id].days[today];
  if (typeof slot === 'number') slot = { c: slot, ips: [] };
  if (!slot) slot = { c: 0, ips: [] };
  if (!Array.isArray(slot.ips)) slot.ips = [];

  // IP+UA dedup — one read per visitor per entry per day.
  if (slot.ips.indexOf(fp) !== -1) {
    counts.entries[id].days[today] = slot;
    return { statusCode: 200, body: JSON.stringify({ ok: true, id, skipped: 'dedup', total: counts.entries[id].total || 0 }) };
  }
  slot.c = (slot.c || 0) + 1;
  slot.ips.push(fp);
  // Cap ips array at 5000 to bound blob size on viral entries; oldest fingerprints drop first.
  if (slot.ips.length > 5000) slot.ips = slot.ips.slice(-5000);
  counts.entries[id].days[today] = slot;
  counts.entries[id].total = (counts.entries[id].total || 0) + 1;

  // Prune day buckets older than 14 days, once per hour
  if (Date.now() - (counts.last_pruned || 0) > 3600000) {
    const keep = new Set(lastNDays(14));
    for (const eid of Object.keys(counts.entries)) {
      const e = counts.entries[eid];
      if (e.days) {
        for (const d of Object.keys(e.days)) {
          if (!keep.has(d)) delete e.days[d];
        }
      }
    }
    counts.last_pruned = Date.now();
  }

  await store.setJSON('counts.json', counts);
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, id, total: counts.entries[id].total }),
  };
};
