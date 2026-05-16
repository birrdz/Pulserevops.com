// apollo-debug — quick diagnostic to see what's actually in Apollo sequences.
// Returns raw sequence list + first sequence's contact details.

exports.handler = async (event) => {
  const apiKey = process.env.APOLLO_API_KEY;
  if (!apiKey) return { statusCode: 200, body: JSON.stringify({ ok: false, reason: 'no APOLLO_API_KEY' }) };

  async function ap(path, params) {
    const url = new URL('https://api.apollo.io/api/v1' + path);
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
    const r = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'X-Api-Key': apiKey, 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
    });
    const text = await r.text();
    let j; try { j = JSON.parse(text); } catch (e) { j = { _raw: text.slice(0, 400) }; }
    return { status: r.status, data: j };
  }

  const out = {};

  // 1) List sequences
  const seqs = await ap('/emailer_campaigns/search', { per_page: 25 });
  out.sequences_status = seqs.status;
  out.sequences = (seqs.data?.emailer_campaigns || []).map(s => ({
    id: s.id,
    name: s.name,
    archived: s.archived,
    active: s.active,
    num_steps: s.num_steps,
    num_contacts: s.num_contacts || s.num_active_contacts || 0,
    created_at: s.created_at,
  }));

  // 2) Inspect first non-archived sequence
  const first = (seqs.data?.emailer_campaigns || []).find(s => !s.archived);
  if (first) {
    const detail = await ap('/emailer_campaigns/' + first.id);
    out.first_seq_detail = {
      id: first.id,
      name: first.name,
      contact_ids_count: (detail.data?.emailer_campaign?.contact_ids || []).length,
      sample_contact_ids: (detail.data?.emailer_campaign?.contact_ids || []).slice(0, 5),
      keys_in_response: Object.keys(detail.data?.emailer_campaign || {}),
    };
  }

  // 3) Recently-created contacts (last 7 days)
  const recent = await ap('/contacts/search', { per_page: 25, page: 1, sort_by_field: 'contact_created_at', sort_ascending: false });
  out.recent_contacts_status = recent.status;
  out.recent_contacts_total = recent.data?.pagination?.total_entries || 0;
  out.recent_contacts_sample = (recent.data?.contacts || []).slice(0, 15).map(c => ({
    name: (c.first_name || '') + ' ' + (c.last_name || ''),
    title: c.title || '',
    company: (c.organization && c.organization.name) || c.account_name || '',
    created: c.contact_created_at || c.created_at,
    email: c.email || '',
  }));

  // 4) Saved lists
  const lists = await ap('/labels');
  out.lists_status = lists.status;
  out.lists = (lists.data?.labels || []).slice(0, 20).map(l => ({ id: l.id, name: l.name, kind: l.kind, modality: l.modality }));

  // 5) Accounts (companies) recently added
  const accts = await ap('/accounts/search', { per_page: 25, page: 1, sort_by_field: 'account_created_at', sort_ascending: false });
  out.accounts_status = accts.status;
  out.accounts_total = accts.data?.pagination?.total_entries || 0;
  out.accounts_sample = (accts.data?.accounts || []).slice(0, 15).map(a => ({
    name: a.name || '',
    domain: a.domain || a.website_url || '',
    created: a.account_created_at || a.created_at,
    industry: a.industry || '',
  }));

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(out, null, 2),
  };
};
