// ════════════════════════════════════════════════════════════════════════
// intent-track — silent server function. Logs B2B account-level intent data.
//
// Fired client-side once per session by /assets/intent-beacon.js.
// Reads the visitor's IP from Netlify-injected request headers, filters bots
// and residential traffic, queries IPinfo.io for company-level data, and
// writes a single JSON record to the `pulse-intent` Blob store.
//
// Returns 204 No Content. Browser sees nothing — fully invisible to user.
//
// Dependencies:
//   IPINFO_TOKEN (env var) — get from https://ipinfo.io/signup (free 50k/mo)
//   BLOBS_PAT or NETLIFY_AUTH_TOKEN — for blob writes
//
// Filters out:
//   · known bot user-agents (Googlebot, LinkedInBot, FacebookExternalHit, etc.)
//   · residential ISPs (when IPinfo flags type === 'residential')
//   · invalid / private IPs
//
// Privacy: covered by /privacy.html. Raw IPs retained 90 days, aggregated
// company data retained indefinitely as standard business analytics.
// ════════════════════════════════════════════════════════════════════════

const https = require('https');

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Bot UA patterns — skip these to avoid wasting IPinfo lookups + skewing data
const BOT_UA_RE = /bot|crawl|spider|slurp|facebookexternalhit|linkedinbot|twitterbot|whatsapp|slackbot|discordbot|telegrambot|preview|fetch|monitor|uptime|ping|wget|curl|python-requests|axios|headless|scrapy|lighthouse|chrome-lighthouse/i;

function initStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) {
    try { return getStore({ name: 'pulse-intent', siteID: sid, token: tok }); }
    catch (e) { return null; }
  }
  try { return getStore('pulse-intent'); } catch (e) { return null; }
}

// IPinfo.io lookup. Returns parsed JSON or null on failure.
function ipinfoLookup(ip, token) {
  return new Promise((resolve) => {
    const opts = {
      hostname: 'ipinfo.io',
      path: '/' + encodeURIComponent(ip) + '/json?token=' + encodeURIComponent(token),
      method: 'GET',
      headers: { 'Accept': 'application/json', 'User-Agent': 'pulserevops-intent/1.0' },
      timeout: 4000,
    };
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { resolve(null); }
      });
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
    req.end();
  });
}

// Extract a short human-friendly UA summary (browser + OS)
function uaSummary(ua) {
  if (!ua) return 'unknown';
  let browser = 'Other';
  if (/Edg\//.test(ua))           browser = 'Edge';
  else if (/Chrome\//.test(ua))   browser = 'Chrome';
  else if (/Firefox\//.test(ua))  browser = 'Firefox';
  else if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) browser = 'Safari';
  let os = 'Other';
  if (/Windows NT/.test(ua))      os = 'Windows';
  else if (/Mac OS X|Macintosh/.test(ua)) os = 'macOS';
  else if (/Android/.test(ua))    os = 'Android';
  else if (/iPhone|iPad/.test(ua)) os = 'iOS';
  else if (/Linux/.test(ua))      os = 'Linux';
  return browser + ' / ' + os;
}

// Strip query strings + fragments, keep just the path, cap length
function cleanPath(p) {
  if (!p) return '/';
  return String(p).split('?')[0].split('#')[0].slice(0, 240);
}

// Date-prefix key for blob storage so listing can filter by day cheaply
function dayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}
function tsId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST')    return { statusCode: 204, headers: CORS, body: '' };

  // Extract IP — Netlify injects this header on production; fallback to
  // x-forwarded-for if present (first IP in the comma-separated chain).
  let ip = event.headers['x-nf-client-connection-ip']
        || (event.headers['x-forwarded-for'] || '').split(',')[0].trim()
        || '';
  ip = ip.replace(/[^0-9a-fA-F:.]/g, ''); // sanitize

  const ua = event.headers['user-agent'] || '';

  // Filter 1 — bots (no IPinfo spend, no logging)
  if (BOT_UA_RE.test(ua)) {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  // Filter 2 — invalid / private / loopback
  if (!ip || /^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|127\.|169\.254\.|0\.0\.0\.0|::1|fe80:|fc00:)/.test(ip)) {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  // Parse client-supplied beacon body for path + referrer (these can't come
  // from headers reliably — beacon sends them explicitly).
  let beaconPath = '/', beaconRef = '';
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    beaconPath = cleanPath(body.path || '/');
    beaconRef  = String(body.ref || '').slice(0, 480);
  } catch (e) {}

  // IPinfo lookup (skip if no token configured)
  const token = process.env.IPINFO_TOKEN || process.env.ipinfo_token;
  let info = null;
  if (token) {
    info = await ipinfoLookup(ip, token);
  }

  // Filter 3 — non-prospect traffic. Three buckets get dropped:
  //   (a) residential ISPs flagged by IPinfo (type === 'residential')
  //   (b) datacenter / hosting / cloud / VPN / proxy IPs — bots, crawlers,
  //       scrapers, uptime monitors. This is the big one: Azure (Microsoft
  //       Boydton), AWS, GCP, OVH, Vultr, M247, DataCamp, etc. On the IPinfo
  //       free tier `type` is usually absent, so we ALSO match the org/ASN
  //       name against a noise pattern.
  //   (c) the site owner's own ISP — keeps the owner's home visits out of
  //       analytics (configurable via OWNER_ISP_RE env var).
  const ipType = (info && (info.type || (info.privacy && info.privacy.type))) || '';
  const orgStr = String(
    (info && (info.org
      || (info.company && info.company.name)
      || (info.asn && info.asn.name))) || ''
  ).toLowerCase();

  // (a) residential
  if (ipType === 'residential') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  // (b) datacenter / hosting / infra — by IPinfo type OR org-name pattern.
  // Org regex is env-overridable (NOISE_ORG_RE) so it can be tuned without a
  // redeploy. Note: this drops traffic from the big clouds' corporate orgs
  // too (Microsoft/Amazon/Google) — acceptable because the overwhelming
  // majority of such hits are datacenter bots, not employees.
  const HOSTING_TYPE_RE = /^(hosting|vpn|proxy|tor|relay)$/;
  let noiseOrgRe;
  try {
    noiseOrgRe = new RegExp(
      process.env.NOISE_ORG_RE
      || '\\b(amazon|aws|microsoft|azure|google|gcp|cloudflare|ovh|hetzner|digitalocean|linode|akamai|fastly|vultr|constant company|m247|datacamp|leaseweb|choopa|contabo|scaleway|gsl networks|hostroyale|packethub|globaltelehost|arelion|31173|trabia|logicweb|oracle|alibaba|tencent|censys|shodan|bytedance|bytespider|datacenter|hosting|colocation|cloud services|server|vps)\\b',
      'i'
    );
  } catch (e) { noiseOrgRe = /datacenter|hosting/i; }
  if (HOSTING_TYPE_RE.test(ipType) || (orgStr && noiseOrgRe.test(orgStr))) {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  // (c) owner's own ISP — env-overridable; defaults to "breezeline" since
  // that's the owner's residential ISP and was generating ~36% of all hits.
  try {
    const ownerIspRe = new RegExp(process.env.OWNER_ISP_RE || 'breezeline', 'i');
    if (orgStr && ownerIspRe.test(orgStr)) {
      return { statusCode: 204, headers: CORS, body: '' };
    }
  } catch (e) { /* bad regex in env var — skip owner filter */ }

  // Build the record. `company` may come from `org` (free tier) or
  // `company.name` (paid). Normalize either path.
  const company = (info && info.company && info.company.name)
    || (info && info.org && info.org.replace(/^AS\d+\s*/i, '')) // strip "AS12345 " prefix
    || null;
  const domain = (info && info.company && info.company.domain) || null;

  const record = {
    ts: Date.now(),
    day: dayKey(),
    ip_hash: hashIp(ip), // store hash, not raw IP, to honor 90-day raw-IP retention
    company: company,
    domain: domain,
    city: info && info.city,
    region: info && info.region,
    country: info && info.country,
    type: ipType || null,
    path: beaconPath,
    referrer: beaconRef || null,
    ua_summary: uaSummary(ua),
  };

  const store = initStore();
  if (store) {
    try {
      const key = record.day + '/' + tsId() + '.json';
      await store.setJSON(key, record);
    } catch (e) {
      // Silent — never break the user's page-load on a logging failure
    }
  }

  return { statusCode: 204, headers: CORS, body: '' };
};

// Lightweight non-cryptographic hash of an IP — sufficient for dedup/joining
// company analytics without retaining raw IPs past their TTL.
function hashIp(ip) {
  let h = 2166136261;
  for (let i = 0; i < ip.length; i++) {
    h ^= ip.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h.toString(16);
}
