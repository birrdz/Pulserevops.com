// PULSE Human-Interaction visitor alert — the SERVER side of the Human Gate.
// The client (/js/human-gate.js) only POSTs here AFTER a verified human
// interaction (click >2s after load, not the honeypot). This endpoint adds
// defense-in-depth: it drops known bot User-Agents and de-dupes to at most
// ONE owner email per visitor (hashed IP) per day, then emails via the
// existing pulse-progress-notify path. No email ever fires on a page load.

const { getStore } = require('@netlify/blobs');

const SITE = 'https://pulserevops.com';
const QUOTA_KEY = '_visitor_alert_quota.json';

// Known crawlers / AI bots / automation. If the UA matches, never alert.
const BOT_RX = /(bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora|pinterest|vkshare|whatsapp|telegram|headless|phantomjs|puppeteer|playwright|selenium|python-requests|curl|wget|axios|node-fetch|httpclient|gptbot|chatgpt|oai-searchbot|claudebot|claude-web|anthropic|ccbot|perplexity|google-extended|bytespider|amazonbot|applebot|semrush|ahrefs|mj12bot|dotbot|dataforseo)/i;

function initStore() {
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) { try { return getStore({ name: 'pulse-votes', siteID: sid, token: tok }); } catch (e) {} }
  try { return getStore('pulse-votes'); } catch (e) { return null; }
}
function clientIp(event) {
  const h = event.headers || {};
  return (h['x-nf-client-connection-ip'] || (h['x-forwarded-for'] || '').split(',')[0] || h['client-ip'] || '0.0.0.0').trim();
}
function hashIp(ip) {
  let h = 5381; const s = 'va:' + ip;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h.toString(36);
}
const today = () => new Date().toISOString().slice(0, 10);
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
const ok = (b) => ({ statusCode: 204, headers: CORS, body: '' });

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return ok();

  let p = {};
  try { p = JSON.parse(event.body || '{}'); } catch (e) { return ok(); }

  // Owner opted IN (2026-06-19) to alerts on EVERY visitor AND JS-running
  // bots/crawlers, deduped to one email per IP/day. We no longer drop bots by
  // UA — we only label them. (Most non-JS crawlers never run this beacon at
  // all, so volume stays sane and the per-IP/day quota below caps the rest.)
  const ua = String(p.ua || (event.headers && event.headers['user-agent']) || '');
  const isBotUa = BOT_RX.test(ua);

  const store = initStore();
  if (!store) return ok();

  // De-dupe: at most one email per hashed IP per day.
  const ipHash = hashIp(clientIp(event));
  const day = today();
  let quota = {};
  try { quota = (await store.get(QUOTA_KEY, { type: 'json' })) || {}; } catch (e) {}
  if (quota[ipHash] === day) return ok();          // already alerted today
  quota[ipHash] = day;
  // light prune so the blob can't grow unbounded
  const keys = Object.keys(quota);
  if (keys.length > 5000) for (const k of keys) if (quota[k] !== day) delete quota[k];
  try { await store.setJSON(QUOTA_KEY, quota); } catch (e) {}

  // NO VISITOR EMAILS (owner 2026-06-25): cancelled entirely. This endpoint no
  // longer emails on visits (neither per-visit nor batched). Visitor COUNT is
  // surfaced in the gap-fill progress emails instead, sourced from the live
  // `_stats` daily counter. We keep the per-IP/day quota write above only so the
  // beacon stays cheap; nothing is emailed from here.
  return ok();
};

function esc(s) { return String(s).replace(/[<>&"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c])); }
