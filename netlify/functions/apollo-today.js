// apollo-today — pull today's new Apollo contacts, dedupe to companies,
// cross-check against library coverage, return list of companies missing
// a revenue-fix playbook entry.
//
// GET /.netlify/functions/apollo-today        → JSON of today's targets
// GET /.netlify/functions/apollo-today?days=7 → last 7 days
//
// Required env: APOLLO_API_KEY, BLOBS_PAT

const { getStore } = require('@netlify/blobs');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

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

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };

  const apiKey = process.env.APOLLO_API_KEY;
  if (!apiKey) return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: false, reason: 'no APOLLO_API_KEY' }) };

  const days = Math.max(1, Math.min(30, parseInt((event.queryStringParameters || {}).days || '1', 10)));
  const cutoffMs = Date.now() - days * 86400000;

  // Pull recent contacts, descending by creation
  const all = [];
  try {
    for (let page = 1; page <= 4; page++) {
      const r = await ap('/contacts/search', apiKey, {
        per_page: 100,
        page,
        sort_by_field: 'contact_created_at',
        sort_ascending: false,
      });
      const contacts = r.contacts || [];
      if (!contacts.length) break;
      let stopped = false;
      for (const c of contacts) {
        const ts = new Date(c.contact_created_at || c.created_at || 0).getTime();
        if (ts < cutoffMs) { stopped = true; break; }
        all.push(c);
      }
      if (stopped) break;
    }
  } catch (e) {
    return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, reason: 'apollo fetch failed: ' + e.message }) };
  }

  // Dedupe to companies
  const companyMap = new Map(); // slug → { name, contact_count, sample_contact, domain, industry }
  for (const c of all) {
    const company = (c.organization && c.organization.name) || c.account_name || '';
    if (!company) continue;
    const slug = slugify(company);
    if (!slug) continue;
    if (!companyMap.has(slug)) {
      companyMap.set(slug, {
        slug,
        name: company,
        contact_count: 0,
        sample_contact: { name: (c.first_name || '') + ' ' + (c.last_name || ''), title: c.title || '', email: c.email || '' },
        domain: (c.organization && c.organization.primary_domain) || '',
        industry: (c.organization && c.organization.industry) || '',
      });
    }
    companyMap.get(slug).contact_count++;
  }

  // Check library coverage by tag-slug match
  const lib = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: process.env.BLOBS_PAT });
  let idx;
  try { idx = (await lib.get('_index.json', { type: 'json' })) || { entries: [] }; }
  catch (e) { idx = { entries: [] }; }
  const coveredSlugs = new Set();
  const slugToEntryId = {};
  for (const e of idx.entries) {
    const tags = Array.isArray(e.tags) ? e.tags : [];
    for (const t of tags) {
      const s = slugify(t);
      if (s) {
        coveredSlugs.add(s);
        if (!slugToEntryId[s]) slugToEntryId[s] = e.id;
      }
    }
  }

  const missing = [];
  const covered = [];
  for (const [slug, info] of companyMap) {
    if (coveredSlugs.has(slug)) {
      covered.push({ ...info, library_id: slugToEntryId[slug] });
    } else {
      missing.push(info);
    }
  }
  missing.sort((a, b) => b.contact_count - a.contact_count);
  covered.sort((a, b) => b.contact_count - a.contact_count);

  return {
    statusCode: 200,
    headers: { ...CORS, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify({
      ok: true,
      window_days: days,
      total_contacts_in_window: all.length,
      unique_companies: companyMap.size,
      covered_count: covered.length,
      missing_count: missing.length,
      missing,
      covered,
    }, null, 2),
  };
};
