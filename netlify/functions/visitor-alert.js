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

  // BATCHED VISITOR ALERTS (owner 2026-06-29): "1 email per 10 visitors, show all 10 URLs."
  // Accumulate every visit in a blob buffer; when it reaches BATCH_SIZE, send ONE email
  // listing all 10 visited URLs (with human/bot label, time, referrer), then clear the
  // buffer. No per-IP dedup — every beacon counts. Email via the working pulse-progress-notify
  // path (Postmark/Resend -> koryjordanwhite@gmail.com).
  const BATCH_KEY = '_visitor_batch.json';
  const BATCH_SIZE = 10;
  const rec = {
    page: String(p.page || '/').slice(0, 300),
    ref: String(p.ref || '').slice(0, 200),
    human: !!p.human,
    bot: isBotUa,
    at: new Date().toISOString(),
  };
  let batch = [];
  try { batch = (await store.get(BATCH_KEY, { type: 'json', consistency: 'strong' })) || []; } catch (e) {}
  if (!Array.isArray(batch)) batch = [];
  batch.push(rec);

  if (batch.length >= BATCH_SIZE) {
    const group = batch.slice(0, BATCH_SIZE);
    const rows = group.map((v, i) =>
      `<tr><td style="padding:4px 8px;color:#888">${i + 1}</td>`
      + `<td style="padding:4px 8px"><a href="https://pulserevops.com${esc(v.page)}">${esc(v.page)}</a></td>`
      + `<td style="padding:4px 8px">${v.human ? '👤 human' : (v.bot ? '🤖 bot' : '• visit')}</td>`
      + `<td style="padding:4px 8px;color:#888;white-space:nowrap">${esc((v.at || '').slice(11, 19))} UTC</td>`
      + `<td style="padding:4px 8px;color:#888">${esc(v.ref || '—')}</td></tr>`
    ).join('');
    const html = `<h2>🔔 10 new visitors on Pulse</h2>`
      + `<table style="border-collapse:collapse;font-family:system-ui,sans-serif;font-size:14px">`
      + `<tr><th style="padding:4px 8px">#</th><th align="left" style="padding:4px 8px">Page</th><th align="left" style="padding:4px 8px">Type</th><th align="left" style="padding:4px 8px">Time</th><th align="left" style="padding:4px 8px">Referrer</th></tr>`
      + `${rows}</table><p style="color:#888;font-size:12px">Batched: 1 email per 10 visitors · sent ${esc(new Date().toISOString())}</p>`;
    try {
      await fetch('https://pulserevops.com/.netlify/functions/pulse-progress-notify', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: '🔔 10 new Pulse visitors', html }),
      });
    } catch (e) {}
    batch = batch.slice(BATCH_SIZE); // keep any overflow beyond 10
  }
  try { await store.setJSON(BATCH_KEY, batch); } catch (e) {}
  return ok();
};

function esc(s) { return String(s).replace(/[<>&"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c])); }
