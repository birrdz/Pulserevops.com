// ════════════════════════════════════════════════════════════════════════
// apollo-daily-publish-background — runs daily at 7am UTC.
//
// FREE MODE: does NOT call Anthropic API. Instead:
//   1. Pulls today's new Apollo contacts → top N missing companies
//   2. Writes the queue to blob `apollo-daily-queue/<YYYY-MM-DD>.json`
//   3. Emails Kory the day's pending list with one-click links
//
// Generation happens later when Kory opens Claude Code — sub-agent
// workers (covered by Claude Code subscription, no per-call cost) pick
// up the queue and publish.
//
// Required env: APOLLO_API_KEY, BLOBS_PAT, RESEND_API_KEY (optional)
// ════════════════════════════════════════════════════════════════════════

const https = require('https');
const { getStore } = require('@netlify/blobs');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOP_N = 5;
const APOLLO_WINDOW_DAYS = 1;

function slugify(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/^the-/, '');
}

async function ap(path, key, params) {
  const url = new URL('https://api.apollo.io/api/v1' + path);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  const r = await fetch(url.toString(), {
    method: 'GET',
    headers: { 'X-Api-Key': key, 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
  });
  if (!r.ok) throw new Error('apollo ' + path + ' ' + r.status);
  return r.json();
}

async function sendEmail(toEmail, fromEmail, subject, html) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !toEmail) return;
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: fromEmail, to: [toEmail], subject, html }),
    });
  } catch (e) { console.warn('email failed:', e.message); }
}

exports.handler = async () => {
  const apolloKey = process.env.APOLLO_API_KEY;
  if (!apolloKey) { console.error('[apollo-daily] no APOLLO_API_KEY'); return { statusCode: 200, body: 'no key' }; }

  const cutoff = Date.now() - APOLLO_WINDOW_DAYS * 86400000;
  const contacts = [];
  try {
    for (let page = 1; page <= 5; page++) {
      const r = await ap('/contacts/search', apolloKey, {
        per_page: 100, page,
        sort_by_field: 'contact_created_at', sort_ascending: false,
      });
      const pageContacts = r.contacts || [];
      if (!pageContacts.length) break;
      let stop = false;
      for (const c of pageContacts) {
        const ts = new Date(c.contact_created_at || c.created_at || 0).getTime();
        if (ts < cutoff) { stop = true; break; }
        contacts.push(c);
      }
      if (stop) break;
    }
  } catch (e) {
    console.error('[apollo-daily] apollo fetch failed:', e.message);
    return { statusCode: 200, body: 'apollo fetch failed' };
  }

  const companyMap = new Map();
  for (const c of contacts) {
    const company = (c.organization && c.organization.name) || c.account_name || '';
    if (!company) continue;
    const slug = slugify(company);
    if (!slug) continue;
    if (!companyMap.has(slug)) {
      companyMap.set(slug, {
        slug, name: company, contact_count: 0,
        sample_contact: { name: (c.first_name || '') + ' ' + (c.last_name || ''), title: c.title || '', email: c.email || '' },
        domain: (c.organization && c.organization.primary_domain) || '',
        industry: (c.organization && c.organization.industry) || '',
      });
    }
    companyMap.get(slug).contact_count++;
  }

  const lib = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: process.env.BLOBS_PAT });
  let idx;
  try { idx = (await lib.get('_index.json', { type: 'json' })) || { entries: [] }; }
  catch (e) { idx = { entries: [] }; }
  const coveredSlugs = new Set();
  for (const e of idx.entries) {
    const tags = Array.isArray(e.tags) ? e.tags : [];
    for (const t of tags) { const s = slugify(t); if (s) coveredSlugs.add(s); }
  }

  const missing = [];
  for (const [slug, info] of companyMap) if (!coveredSlugs.has(slug)) missing.push(info);
  missing.sort((a, b) => b.contact_count - a.contact_count);
  const targets = missing.slice(0, TOP_N);

  const today = new Date().toISOString().slice(0, 10);
  const queue = {
    generated_at: new Date().toISOString(),
    date: today,
    window_days: APOLLO_WINDOW_DAYS,
    total_contacts: contacts.length,
    unique_companies: companyMap.size,
    covered_count: companyMap.size - missing.length,
    missing_count: missing.length,
    targets,
    status: 'pending',  // will flip to 'published' when Claude Code dispatches
  };

  const queueStore = getStore({ name: 'apollo-daily-queue', siteID: SITE_ID, token: process.env.BLOBS_PAT });
  await queueStore.setJSON(today + '.json', queue);
  await queueStore.setJSON('latest.json', queue);

  const toEmail = process.env.ALERT_TO_EMAIL;
  const fromEmail = process.env.ALERT_FROM_EMAIL || 'onboarding@resend.dev';
  if (toEmail && targets.length) {
    const html = `
      <div style="font-family:system-ui,-apple-system,sans-serif;font-size:14px;line-height:1.6;color:#222;max-width:560px;">
        <div style="font-size:18px;font-weight:700;color:#E8710A;margin-bottom:12px;">Apollo Daily Queue · ${targets.length} pending playbooks</div>
        <p>${contacts.length} new Apollo contacts in last 24h → ${companyMap.size} unique companies → ${missing.length} missing playbooks. Top ${TOP_N} queued for today:</p>
        <ol style="padding-left:20px;">
          ${targets.map(t => `<li><b>${t.name}</b> · ${t.contact_count} contact${t.contact_count === 1 ? '' : 's'} · ${t.domain || 'no domain'} · ${t.industry || 'industry n/a'}</li>`).join('')}
        </ol>
        <p style="margin-top:16px;color:#666;font-size:12px;">Open Claude Code and say "run today's apollo queue" — sub-agents will publish all ${targets.length} playbooks (free under subscription).</p>
        <p style="color:#999;font-size:11px;">Queue stored at apollo-daily-queue/${today}.json</p>
      </div>`;
    await sendEmail(toEmail, fromEmail, `🔄 Apollo daily: ${targets.length} playbooks queued for ${today}`, html);
  }

  console.log('[apollo-daily] queued', targets.length, 'companies for', today);
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, queued: targets.length, date: today }),
  };
};

exports.config = {
  schedule: '0 7 * * *',
};
