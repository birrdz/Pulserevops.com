const fs = require('fs');
const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
for (const l of env.split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const targetId = process.argv[2] || 'q10909';
const durationMs = parseInt(process.argv[3] || '180000', 10);
const intervalMs = 5000;
(async () => {
  const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
  const endsAt = Date.now() + durationMs;
  let ticks = 0;
  while (Date.now() < endsAt) {
    const now = Date.now();
    const prev = (await s.get('_audit_state.json', { type: 'json' })) || {};
    await s.setJSON('_audit_state.json', {
      ...prev,
      currently_auditing_id: targetId,
      started_at: now,
      last_completed_id: targetId,
      last_completed_at: now,
    });
    ticks++;
    console.log(`[${new Date().toISOString()}] pinned ${targetId} (tick ${ticks})`);
    await new Promise(r => setTimeout(r, intervalMs));
  }
  console.log(`Released after ${ticks} ticks`);
})();
