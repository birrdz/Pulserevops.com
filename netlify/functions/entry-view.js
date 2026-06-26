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
const { buildTop10Weekly } = require('./lib/top10-weekly');

const TOP10_KEY = 'top10-weekly.json';
const TOP10_MAX_AGE_MS = 65 * 60 * 1000;

function initBlob(name) {
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  try { return getStore(name); }
  catch (e1) { if (tok && sid) { try { return getStore({ name, siteID: sid, token: tok }); } catch (e2) { return null; } } return null; }
}

async function getTop10Weekly(viewStore) {
  const libStore = initBlob('pulse-machine-library');
  let snap = await viewStore.get(TOP10_KEY, { type: 'json' });
  const stale = !snap || !snap.updated_at || Date.now() - snap.updated_at > TOP10_MAX_AGE_MS;
  if (stale && libStore) {
    snap = await buildTop10Weekly(viewStore, libStore);
    await viewStore.setJSON(TOP10_KEY, snap);
  }
  return snap || { updated_at: Date.now(), period_days: 7, items: [] };
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
    if (qs.top10) {
      const snap = await getTop10Weekly(store);
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300',
        },
        body: JSON.stringify({
          ok: true,
          updated_at: snap.updated_at,
          period_days: snap.period_days || 7,
          items: snap.items || [],
        }),
      };
    }
    if (qs.trending || qs.all) {
      // Sum last 7 days for each entry. ?trending=1 → top 12 sorted desc;
      // ?all=1 → flat { id: sum } map of every entry with sum>0 (for grid badges).
      // ?pillar=q|st|ik|tk|gb|bs|er|ra|gp|sports → filter to that ID prefix or
      //   tag (sports = entries tagged sports/nil/football/mbb/wbb).
      const days7 = lastNDays(7);
      const PILLAR_RX = {
        q:/^q\d+$|^vq_/, st:/^st\d+$/, ik:/^ik\d+$/, tk:/^tk\d+$/, gb:/^gb\d+$/,
        bs:/^bs\d+$/, er:/^er\d+$/, ra:/^ra\d+$/, gp:/^gp\d+$/,
      };
      const pillarKey = (qs.pillar || '').toLowerCase().trim();
      const pillarRx = pillarKey && PILLAR_RX[pillarKey] ? PILLAR_RX[pillarKey] : null;
      const ranked = Object.keys(counts.entries || {})
        .map(id => {
          const e = counts.entries[id] || {};
          let sum = 0;
          for (const d of days7) sum += dayCount(e.days && e.days[d]);
          return { id, sum, total: e.total || 0 };
        })
        .filter(r => r.sum > 0 && (!pillarRx || pillarRx.test(r.id)));
      if (qs.all) {
        const map = {};
        const totals = {};
        for (const r of ranked) map[r.id] = r.sum;
        for (const eid of Object.keys(counts.entries || {})) {
          const t = (counts.entries[eid] && counts.entries[eid].total) || 0;
          if (t > 0) totals[eid] = t;
        }
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=120' },
          body: JSON.stringify({ ok: true, counts: map, totals: totals }),
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
  // Accept every pillar prefix (was q/vq-only, which under-counted the whole site).
  if (!id || !/^(vq_[a-z0-9]+|[a-z]{1,5}\d+)$/i.test(id)) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'bad id' }) };
  }

  // Bot filter — skip increment but return ok so the client doesn't error.
  const ua = (event.headers && event.headers['user-agent']) || '';
  if (looksLikeBot(ua)) {
    return { statusCode: 200, body: JSON.stringify({ ok: true, id, skipped: 'bot' }) };
  }

  // Owner's own devices carry a permanent pulse_owner=1 cookie — never count
  // the owner as a visitor (the beacon sends cookies same-origin).
  const _ck = (event.headers && (event.headers.cookie || event.headers.Cookie)) || '';
  if (/(?:^|;\s*)pulse_owner=1\b/.test(_ck)) {
    return { statusCode: 200, body: JSON.stringify({ ok: true, id, skipped: 'owner' }) };
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
  // Site-wide daily visitor total for the 15-min heartbeat (non-bot, non-owner,
  // deduped one-per-visitor-per-entry-per-day). Resets at midnight via hour keys.
  try { const st = require('./_stats'); await st.bump({ views: 1 }); await st.bumpDaily({ views: 1 }); } catch (e) {}

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
