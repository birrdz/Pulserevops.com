#!/usr/bin/env node
const fs = require('fs');
const { getStore } = require('@netlify/blobs');

function loadEnv(p) {
  try {
    for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch (e) {}
}
loadEnv('/tmp/pulse-runtime.env');

const SITE = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

(async () => {
  const s = getStore({ name: 'pulse-machine-library', siteID: SITE, token: process.env.BLOBS_PAT });
  const lock = JSON.parse(fs.readFileSync('/tmp/wave1-2750-lock.json', 'utf8'));
  const ids = lock.ids;
  if (!ids || ids.length < 1000) throw new Error('bad lock');

  await s.setJSON('_mangled_image_purge_state.json', {
    doneIds: ids,
    lastId: ids[ids.length - 1],
    lastRunAt: new Date().toISOString(),
    complete: true,
    note: 'wave1 locked — Cursor rewrite restart (no DeepSeek writing)',
  });
  await s.setJSON('_batch_cycle_state.json', {
    doneIds: [],
    fixed: 0,
    passed: 0,
    imaged: 0,
    errors: 0,
    restartedAt: new Date().toISOString(),
    restartReason: 'owner: start over — Cursor writes only, no DeepSeek rewrites',
    writer: 'cursor',
    stopAt: 8000,
    batchSize: 2750,
    complete: false,
  });
  await s.setJSON('_factcheck_audit_state.json', {
    doneIds: [],
    flagged: 0,
    passed: 0,
    resetAt: new Date().toISOString(),
  });
  await s.setJSON('_cursor_write_queue.json', {
    items: [],
    writer: 'cursor-only',
    resetAt: new Date().toISOString(),
  });
  fs.mkdirSync('logs', { recursive: true });
  fs.writeFileSync('logs/cursor-write-queue.json', JSON.stringify({ items: [], writer: 'cursor-only' }, null, 2));

  const r = await fetch(
    'https://pulserevops.com/.netlify/functions/pulse-progress-notify?key=pulsemachine-writer-2026',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: 'PULSE starting over — Cursor rewrites only (no DeepSeek writing)',
        html:
          '<p>DeepSeek content rewrites are <b>stopped</b>.</p>' +
          '<p>Starting the first <b>2750</b> over again:</p><ol>' +
          '<li>Mangled-image purge already done on this wave</li>' +
          '<li>Fact-check audit queues issues</li>' +
          '<li><b>Cursor</b> rewrites content (not DeepSeek — they made the errors)</li>' +
          '<li>Pexels image + one email per full fix</li></ol>',
      }),
      signal: AbortSignal.timeout(20000),
    }
  );
  console.log(JSON.stringify({ email: r.status, reset: true, locked: ids.length, writer: 'cursor' }));
})().catch((e) => {
  console.error(String(e && e.stack ? e.stack : e));
  process.exit(1);
});
