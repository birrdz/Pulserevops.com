const fs = require('fs');
const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
for (const l of env.split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
(async () => {
  const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
  const fresh = {
    currently_auditing_id: null,
    started_at: 0,
    last_completed_id: null,
    last_completed_at: 0,
    last_audit_issues: [],
    last_audit_words: 0,
    last_audit_mermaid: 0,
    audited_count: 0,
    loop_count: 0,
    issues_found_total: 0,
    total_entries: 0,
  };
  await s.setJSON('_audit_state.json', fresh);
  console.log('Auditor RESET — will start fresh from page 1 (newest entry) on next tick.');
})();
