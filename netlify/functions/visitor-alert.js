// PULSE Human-Interaction visitor alert — SERVER side of the Human Gate.
// Client (/js/human-gate.js + pulse-lead-track) POSTs after load; we email the
// owner when the visit looks human (mousemove / click) and is not a known bot.
// Dedup: ONE email per visitor IP per day so page-hopping doesn't flood inbox.
// Owner 2026-07-13: anytime a real / likely-human visits.

const { getStore } = require('@netlify/blobs');

const RECIPIENT = process.env.OWNER_EMAIL || 'koryjordanwhite@gmail.com';
const QUOTA_KEY = '_visitor_alert_quota.json';

const BOT_RX = /(bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora|pinterest|vkshare|whatsapp|telegram|headless|phantomjs|puppeteer|playwright|selenium|python-requests|curl|wget|axios|node-fetch|httpclient|gptbot|chatgpt|oai-searchbot|claudebot|claude-web|anthropic|ccbot|perplexity|google-extended|bytespider|amazonbot|applebot|semrush|ahrefs|mj12bot|dotbot|dataforseo|uptime|pingdom|monitor|lighthouse)/i;

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
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
};
const ok = () => ({ statusCode: 204, headers: CORS, body: '' });
function esc(s) {
  return String(s || '').replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));
}

async function sendOwnerEmail(subject, html) {
  const from = process.env.ALERT_FROM_EMAIL || process.env.alert_from_email || 'onboarding@resend.dev';
  const pmKey = process.env.POSTMARK_SERVER_TOKEN || process.env.POSTMARK_API_KEY;
  const rsKey = process.env.RESEND_API_KEY || process.env.resendapikey || process.env.RESENDAPIKEY;
  if (pmKey) {
    const r = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Postmark-Server-Token': pmKey },
      body: JSON.stringify({ From: from, To: RECIPIENT, Subject: subject, HtmlBody: html, MessageStream: 'outbound', Tag: 'visitor-alert' }),
    });
    return r.ok;
  }
  if (rsKey) {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + rsKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [RECIPIENT], subject, html }),
    });
    return r.ok;
  }
  return false;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return ok();

  let p = {};
  try { p = JSON.parse(event.body || '{}'); } catch (e) { return ok(); }

  const ua = String(p.ua || (event.headers && (event.headers['user-agent'] || event.headers['User-Agent'])) || '');
  if (BOT_RX.test(ua)) return ok(); // hard drop known bots

  const human = !!(p.human || p.click);
  // Owner: real human OR seems human. Without mouse/click, still allow if UA looks like a browser
  // and dwell is long enough — but prefer the human flag from the client.
  const dwell = Number(p.dwell_ms) || 0;
  const seemsHuman = human || dwell >= 2500;
  if (!seemsHuman) return ok();

  const store = initStore();
  if (!store) return ok();

  const ip = clientIp(event);
  const key = hashIp(ip) + ':' + today();
  let quota = {};
  try { quota = (await store.get(QUOTA_KEY, { type: 'json', consistency: 'strong' })) || {}; } catch (e) {}
  if (quota[key]) return ok(); // already emailed this IP today

  const page = String(p.page || '/').slice(0, 300);
  const abs = page.startsWith('http') ? page : ('https://pulserevops.com' + (page.charAt(0) === '/' ? page : '/' + page));
  const ref = String(p.ref || '').slice(0, 200);
  const when = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  const label = human ? '👤 human signal (mouse/click)' : '👤 likely human (dwell)';
  const html = `<div style="font-family:system-ui,sans-serif;max-width:560px">
    <h2 style="color:#C0531F;margin:0 0 12px">👤 Human visitor on Pulse</h2>
    <p style="margin:0 0 12px"><b>Site visited:</b><br>
      <a href="${esc(abs)}" style="color:#C0531F;font-size:16px;font-weight:700;word-break:break-all">${esc(abs)}</a>
    </p>
    <p style="margin:0 0 8px"><b>Signal:</b> ${label}</p>
    <p style="margin:0 0 8px"><b>When:</b> ${esc(when)} ET</p>
    <p style="margin:0 0 8px"><b>Referrer:</b> ${esc(ref || '—')}</p>
    <p style="margin:0;color:#888;font-size:12px">1 email per IP / day · Resend/Postmark</p>
  </div>`;

  try {
    await sendOwnerEmail('👤 Human visitor · ' + page, html);
    quota[key] = Date.now();
    // prune old days (keep last ~400 keys)
    const keys = Object.keys(quota);
    if (keys.length > 400) {
      keys.sort((a, b) => (quota[a] || 0) - (quota[b] || 0));
      for (let i = 0; i < keys.length - 350; i++) delete quota[keys[i]];
    }
    await store.setJSON(QUOTA_KEY, quota);
  } catch (e) {}

  return ok();
};
