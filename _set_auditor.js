const fs = require('fs');
const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
for (const l of env.split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
(async () => {
  const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
  const targetId = process.argv[2] || 'q10909';
  const now = Date.now();
  const prev = (await s.get('_audit_state.json', { type: 'json' })) || {};
  const next = {
    ...prev,
    currently_auditing_id: targetId,
    started_at: now,
    last_completed_id: targetId,
    last_completed_at: now,
  };
  await s.setJSON('_audit_state.json', next);
  console.log('Auditor pinned to:', targetId);
  console.log('State:', JSON.stringify(next, null, 2));
})();
