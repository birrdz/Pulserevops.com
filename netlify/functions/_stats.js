// _stats — lightweight traffic counter for PULSE owner reports.
// Sharded hourly buckets in the 'pulse-machine-stats' blob store:
//   key  h/<YYYY-MM-DDTHH>__s<0-9>   value { bots:{name:n}, leads, clicks, toolSaves }
// Counts crawler hits (named bots only) + conversions (leads / CRO+LinkedIn clicks /
// tool saves). Humans are not counted (the owner asked for "crawlers + bought").
const { getStore } = require('@netlify/blobs');

function store() {
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  return (tok && sid) ? getStore({ name: 'pulse-machine-stats', siteID: sid, token: tok })
                      : getStore('pulse-machine-stats');
}
function hourKey(d) { return (d || new Date()).toISOString().slice(0, 13); } // YYYY-MM-DDTHH (UTC)

// Named-crawler detection. Returns a clean label or null.
const BOT_MAP = [
  [/googlebot/i, 'Googlebot'], [/google-extended|googleother/i, 'Google-Extended'],
  [/bingbot|adidxbot/i, 'Bingbot'], [/gptbot/i, 'GPTBot'], [/oai-searchbot/i, 'OAI-SearchBot'],
  [/chatgpt-user/i, 'ChatGPT-User'], [/claudebot/i, 'ClaudeBot'], [/claude-web/i, 'Claude-Web'],
  [/anthropic/i, 'Anthropic-AI'], [/perplexitybot|perplexity/i, 'PerplexityBot'],
  [/applebot/i, 'Applebot'], [/yandex/i, 'YandexBot'], [/duckduckbot|duckduckgo/i, 'DuckDuckBot'],
  [/baiduspider/i, 'Baiduspider'], [/ahrefsbot/i, 'AhrefsBot'], [/semrushbot/i, 'SemrushBot'],
  [/bytespider/i, 'Bytespider'], [/amazonbot/i, 'Amazonbot'], [/facebookexternalhit|meta-externalagent/i, 'Meta'],
  [/linkedinbot/i, 'LinkedInBot'], [/twitterbot/i, 'Twitterbot'], [/slackbot/i, 'Slackbot'],
  [/petalbot/i, 'PetalBot'], [/mj12bot/i, 'MJ12bot'], [/dotbot/i, 'DotBot'],
];
function classifyBot(ua) {
  if (!ua) return null;
  for (const [re, name] of BOT_MAP) if (re.test(ua)) return name;
  if (/\b(bot|spider|crawler|crawl|slurp|http-?client|python-requests|curl|wget|scrapy|headless)\b/i.test(ua)) return 'Other-bot';
  return null;
}

async function bump(fields, d) {
  try {
    const s = store();
    const shard = Math.floor(Math.random() * 10);
    const key = 'h/' + hourKey(d) + '__s' + shard;
    const cur = (await s.get(key, { type: 'json' })) || {};
    for (const [k, v] of Object.entries(fields)) {
      if (k === 'bot') { cur.bots = cur.bots || {}; cur.bots[v] = (cur.bots[v] || 0) + 1; }
      else cur[k] = (cur[k] || 0) + v;
    }
    await s.setJSON(key, cur);
  } catch (e) { /* never break the request over a stat */ }
}

// ── Cheap DAILY counter (Eastern-day keyed, 10 shards) ──────────────────────
// Sharded write = no contention; the heartbeat reads only 10 blobs for "today"
// (vs ~240 when summing hourly shards), so it never times out. Resets at ET
// midnight automatically (new date key). Used for the daily human-visits + clicks.
function etDate(d) { return new Date(d || Date.now()).toLocaleDateString('en-CA', { timeZone: 'America/New_York' }); }
async function bumpDaily(fields, d) {
  try {
    const s = store();
    const key = 'd/' + etDate(d) + '__s' + Math.floor(Math.random() * 10);
    const cur = (await s.get(key, { type: 'json' })) || {};
    for (const [k, v] of Object.entries(fields)) cur[k] = (cur[k] || 0) + v;
    await s.setJSON(key, cur);
  } catch (e) { /* stats never break the request */ }
}
async function readDaily(date) {
  const s = store();
  const d = date || etDate();
  const agg = { views: 0, clicks: 0 };
  const shards = await Promise.all(Array.from({ length: 10 }, (_, i) => s.get('d/' + d + '__s' + i, { type: 'json' }).catch(() => null)));
  for (const c of shards) { if (c) { agg.views += c.views || 0; agg.clicks += c.clicks || 0; } }
  return agg;
}

async function readHour(hk) {
  const s = store();
  const agg = { bots: {}, botTotal: 0, leads: 0, clicks: 0, toolSaves: 0, views: 0 };
  for (let i = 0; i < 10; i++) {
    try {
      const c = await s.get('h/' + hk + '__s' + i, { type: 'json' });
      if (!c) continue;
      if (c.bots) for (const [k, v] of Object.entries(c.bots)) { agg.bots[k] = (agg.bots[k] || 0) + v; agg.botTotal += v; }
      agg.leads += c.leads || 0; agg.clicks += c.clicks || 0; agg.toolSaves += c.toolSaves || 0; agg.views += c.views || 0;
    } catch (e) {}
  }
  return agg;
}

async function readRange(hours) {
  const now = Date.now();
  const total = { bots: {}, botTotal: 0, leads: 0, clicks: 0, toolSaves: 0 };
  for (let i = 1; i <= hours; i++) {
    const hk = hourKey(new Date(now - i * 3600e3));
    const a = await readHour(hk);
    for (const [k, v] of Object.entries(a.bots)) total.bots[k] = (total.bots[k] || 0) + v;
    total.botTotal += a.botTotal; total.leads += a.leads; total.clicks += a.clicks; total.toolSaves += a.toolSaves;
  }
  return total;
}

function botBreakdown(bots) {
  const entries = Object.entries(bots).sort((a, b) => b[1] - a[1]);
  if (!entries.length) return 'none';
  return entries.map(([k, v]) => k + ' ' + v).join(', ');
}

async function sendOwner(subject, lines) {
  const RECIPIENT = 'koryjordanwhite@gmail.com';
  const html = '<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.7;color:#171E14">' +
    lines.map(l => l.replace(/</g, '&lt;')).join('<br>') + '</div>';
  const pm = process.env.POSTMARK_SERVER_TOKEN || process.env.POSTMARK_API_KEY;
  const rs = process.env.RESEND_API_KEY || process.env.resendapikey || process.env.RESENDAPIKEY;
  const from = process.env.ALERT_FROM_EMAIL || process.env.alert_from_email || 'onboarding@resend.dev';
  try {
    if (pm) { await fetch('https://api.postmarkapp.com/email', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-Postmark-Server-Token': pm }, body: JSON.stringify({ From: from, To: RECIPIENT, Subject: subject, HtmlBody: html, MessageStream: 'outbound' }) }); return 'postmark'; }
    if (rs) { await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + rs, 'Content-Type': 'application/json' }, body: JSON.stringify({ from, to: [RECIPIENT], subject, html }) }); return 'resend'; }
  } catch (e) { return 'err:' + (e.message || e); }
  return 'no-provider';
}

module.exports = { store, hourKey, classifyBot, bump, bumpDaily, readDaily, etDate, readHour, readRange, botBreakdown, sendOwner };
