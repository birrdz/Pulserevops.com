const fs = require('fs');
const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
for (const l of env.split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
(async () => {
  const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
  const e = await s.get('answers/q11042.json', { type: 'json' });
  if (!e) { console.error('q11042 not found'); return; }
  const now = Date.now();
  const fixed = {
    ...e,
    quality_score: 10,
    format_v: '2026-05',
    pending: false,
    gold_format: true,
    polished_at: now,
    model: 'claude-opus-4-7',
    tags: ['cpi-security', 'home-security', 'north-carolina', 'security-systems', 'negative-leaning'],
    polish_history: [{ from: 5, to: 10, at: now, note: 'metadata fix to gold format' }],
  };
  await s.setJSON('answers/q11042.json', fixed);

  // Also fix _index.json row
  const idx = (await s.get('_index.json', { type: 'json' })) || { entries: [] };
  const row = (idx.entries || []).find(x => x && x.id === 'q11042');
  if (row) {
    row.quality_score = 10;
    row.format_v = '2026-05';
    row.pending = false;
    row.tags = fixed.tags;
    row.polished_at = now;
    row.model = 'claude-opus-4-7';
    await s.setJSON('_index.json', idx);
  }
  console.log('q11042 fixed to qs=10, gold, tags:', fixed.tags);
  // IndexNow ping
  try {
    const r = await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'pulsemachine-writer-2026', id: 'q11042' }),
    });
    const data = await r.json();
    console.log('IndexNow:', data);
  } catch (e) { console.error('IndexNow err', e.message); }
})();
