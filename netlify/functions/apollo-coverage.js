// ════════════════════════════════════════════════════════════════════════════
// APOLLO COVERAGE — cross-checks Apollo sequence contacts against the Pulse
// library to surface companies that are in your outreach pipeline but don't
// have a revenue-fix entry yet.
//
// Runs:
//   GET /.netlify/functions/apollo-coverage?sync=1   — manual trigger
//   Scheduled daily at 7am UTC via netlify.toml      — automatic
//
// Required env: APOLLO_API_KEY (Apollo developer-portal key)
// Optional:    ALERT_TO_EMAIL, RESEND_API_KEY (sends digest email if set)
//
// Output:
//   - Writes apollo-coverage.json blob with { checked_at, sequences[], missing[],
//     covered[] } so the result can be queried separately.
//   - Returns the same JSON in the response body.
// ════════════════════════════════════════════════════════════════════════════
const { getStore } = require('@netlify/blobs');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function slugify(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/^the-/, '');
}

async function apolloFetch(path, key, params) {
  const url = new URL('https://api.apollo.io/api/v1' + path);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  const r = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'X-Api-Key': key,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error('apollo ' + path + ' ' + r.status + ': ' + text.slice(0, 200));
  }
  return r.json();
}

async function listSequences(key) {
  // Apollo: GET /emailer_campaigns to list user's sequences
  const data = await apolloFetch('/emailer_campaigns/search', key, { per_page: 100 });
  return data.emailer_campaigns || [];
}

async function listSequenceContacts(key, sequenceId) {
  // Apollo: GET /contacts under a sequence
  const data = await apolloFetch('/emailer_campaigns/' + sequenceId, key);
  return (data.emailer_campaign && data.emailer_campaign.contact_ids) || [];
}

async function fetchContacts(key, ids) {
  if (!ids.length) return [];
  // Apollo: bulk_match endpoint accepts up to ~10 contacts per call.
  // For our purpose we only need company name, so fetch one at a time
  // (slower but reliable).
  const out = [];
  for (const id of ids.slice(0, 200)) {
    try {
      const d = await apolloFetch('/contacts/' + id, key);
      const c = d.contact || {};
      out.push({
        id,
        name: (c.first_name || '') + ' ' + (c.last_name || ''),
        title: c.title || '',
        company: (c.organization && c.organization.name) || c.account_name || '',
      });
    } catch (e) {
      out.push({ id, error: e.message });
    }
  }
  return out;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  const apiKey = process.env.APOLLO_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, reason: 'APOLLO_API_KEY not set in Netlify env' }),
    };
  }

  // ── Step 1: pull sequences + contacts from Apollo ─────────────────────────
  let sequences = [];
  try {
    const all = await listSequences(apiKey);
    // Filter to active "Executive CRO Outreach" first; if none match, take all
    const exec = all.filter(s => /cro|exec|outreach/i.test(s.name || ''));
    sequences = exec.length ? exec : all;
  } catch (e) {
    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, reason: 'apollo sequences fetch failed: ' + e.message }),
    };
  }

  // ── Step 2: collect company names from sequence contacts ──────────────────
  const apolloCompanies = new Map(); // slug → { name, sequence }
  for (const seq of sequences.slice(0, 5)) {
    try {
      const ids = await listSequenceContacts(apiKey, seq.id);
      const contacts = await fetchContacts(apiKey, ids);
      for (const c of contacts) {
        if (!c.company) continue;
        const slug = slugify(c.company);
        if (!slug) continue;
        if (!apolloCompanies.has(slug)) {
          apolloCompanies.set(slug, { name: c.company, sequence: seq.name, contact_count: 1 });
        } else {
          apolloCompanies.get(slug).contact_count++;
        }
      }
    } catch (e) {
      console.warn('seq fetch failed:', seq.id, e.message);
    }
  }

  // ── Step 3: pull library tags and find covered companies ──────────────────
  const lib = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: process.env.BLOBS_PAT });
  const idx = (await lib.get('_index.json', { type: 'json' })) || { entries: [] };
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

  // ── Step 4: split apollo companies into covered vs missing ────────────────
  const missing = [];
  const covered = [];
  for (const [slug, info] of apolloCompanies) {
    if (coveredSlugs.has(slug)) {
      covered.push({ slug, name: info.name, sequence: info.sequence, contact_count: info.contact_count, library_id: slugToEntryId[slug] });
    } else {
      missing.push({ slug, name: info.name, sequence: info.sequence, contact_count: info.contact_count });
    }
  }
  missing.sort((a, b) => b.contact_count - a.contact_count);

  const result = {
    ok: true,
    checked_at: new Date().toISOString(),
    sequences_scanned: sequences.length,
    apollo_companies_total: apolloCompanies.size,
    library_entries_total: idx.entries.length,
    covered_count: covered.length,
    missing_count: missing.length,
    missing: missing.slice(0, 200),
    covered: covered.slice(0, 200),
  };

  // ── Step 5: persist snapshot ──────────────────────────────────────────────
  try {
    const cov = getStore({ name: 'apollo-coverage', siteID: SITE_ID, token: process.env.BLOBS_PAT });
    await cov.setJSON('latest.json', result);
  } catch (e) {
    console.warn('coverage snapshot save failed:', e.message);
  }

  // ── Step 6: optional digest email if missing > 0 ─────────────────────────
  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.ALERT_TO_EMAIL;
  if (resendKey && toEmail && missing.length > 0) {
    try {
      const html = `
        <div style="font-family:system-ui,-apple-system,sans-serif;font-size:14px;line-height:1.6;color:#222;max-width:560px;">
          <div style="font-size:18px;font-weight:700;color:#E8710A;margin-bottom:12px;">Apollo Coverage · ${missing.length} companies missing library entries</div>
          <p>Companies in your Apollo outreach sequence that don't have a revenue-fix playbook on pulserevops.com yet:</p>
          <ol style="padding-left:20px;">
            ${missing.slice(0, 30).map(m => `<li><b>${m.name}</b> · ${m.contact_count} contact${m.contact_count === 1 ? '' : 's'} · seq: ${m.sequence}</li>`).join('')}
          </ol>
          <p style="margin-top:16px;color:#666;font-size:12px;">${covered.length} already covered. Snapshot stored in apollo-coverage blob.</p>
        </div>`;
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + resendKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.ALERT_FROM_EMAIL || 'onboarding@resend.dev',
          to: [toEmail],
          subject: `📊 Apollo coverage gap: ${missing.length} companies need library entries`,
          html,
        }),
      });
    } catch (e) {
      console.warn('digest email failed:', e.message);
    }
  }

  return {
    statusCode: 200,
    headers: { ...CORS, 'Content-Type': 'application/json' },
    body: JSON.stringify(result, null, 2),
  };
};

// Netlify scheduled-function metadata (daily 7am UTC)
exports.config = {
  schedule: '0 7 * * *',
};
