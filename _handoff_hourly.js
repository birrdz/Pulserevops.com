// _handoff_hourly.js — ROLE LAW (owner 2026-06-30, 4444): auto-save the crossover
// handoff document for the next Claude Code session with a LIVE snapshot of
// campaign state + running lanes EVERY 15 MINUTES, then EMAIL that it's time for
// the handoff (email gated by _emails_off.flag). Runs once immediately on launch,
// then every 15 min. Cadence is a LAW — default is 15, do not raise without "4444".
//   Launch:  node _handoff_hourly.js   (background lane)
const fs = require('fs');
const { execSync } = require('child_process');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const HANDOFF = 'C:/Users/koryj/website/_HANDOFF_NEXT_CLAUDE.md';
const BASELINE = 19851, TARGET = 8730;
const NOTIFY = 'https://pulserevops.com/.netlify/functions/pulse-progress-notify?key=pulsemachine-writer-2026';

function liveLanes() {
  try {
    const out = execSync(`powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \\"Name='node.exe'\\" | ForEach-Object { $cl=$_.CommandLine; $m=[regex]::Matches($cl,'([_a-zA-Z0-9]+\\.js)'); ($m | ForEach-Object { $_.Value }) -join ',' }"`, { encoding: 'utf8', timeout: 20000 });
    const lanes = new Set();
    for (const line of out.split(/\r?\n/)) {
      for (const f of line.split(',')) { const n = f.trim(); if (n && n !== '_loadenv.js') lanes.add(n); }
    }
    return [...lanes].sort();
  } catch (e) { return ['(lane scan failed: ' + e.message + ')']; }
}

async function refresh(sendEmail = true) {
  const stamp = new Date().toLocaleString('en-US', { timeZone: 'America/New_York', hour12: true });
  let count = null, netNew = null;
  try { const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' }); count = idx.entries.length; netNew = count - BASELINE; } catch (e) {}
  const lanes = liveLanes();
  const indexnowOff = !lanes.includes('_indexnow_sitewide.js');

  const snap = [
    '<!-- LIVE-SNAPSHOT-START (auto, _handoff_hourly.js) -->',
    `## 🕒 LIVE SNAPSHOT — refreshed ${stamp} ET (auto, every 15 min)`,
    `- **Index:** ${count == null ? 'read-failed' : count.toLocaleString()} entries · **net-new ${netNew == null ? '?' : netNew.toLocaleString()} / ${TARGET.toLocaleString()}** (${netNew == null ? '?' : (netNew / TARGET * 100).toFixed(1)}%)`,
    `- **Running lanes (${lanes.length}):** ${lanes.join(', ') || 'NONE'}`,
    `- **\`_indexnow_sitewide.js\` OFF:** ${indexnowOff ? '✅ yes (correct)' : '⚠️ NO — KILL IT (clobbers index)'}`,
    '- This block is auto-regenerated every 15 min (LAW). The curated handoff below it is the durable knowledge — keep it.',
    '<!-- LIVE-SNAPSHOT-END -->',
    '',
  ].join('\n');

  let body = '';
  try { body = fs.readFileSync(HANDOFF, 'utf8'); } catch (e) {}
  if (/<!-- LIVE-SNAPSHOT-START[\s\S]*?<!-- LIVE-SNAPSHOT-END -->\n?/m.test(body)) {
    body = body.replace(/<!-- LIVE-SNAPSHOT-START[\s\S]*?<!-- LIVE-SNAPSHOT-END -->\n?/m, snap);
  } else {
    // insert right after the first H1 line, else prepend
    const lines = body.split('\n');
    const h1 = lines.findIndex(l => /^#\s/.test(l));
    if (h1 >= 0) { lines.splice(h1 + 1, 0, '', snap.trimEnd()); body = lines.join('\n'); }
    else body = snap + body;
  }
  fs.writeFileSync(HANDOFF, body);

  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6">
    <h2 style="margin:0 0 8px">⏰ Time for the handoff</h2>
    <p>The hourly handoff document has been refreshed for the next Claude Code session.</p>
    <ul>
      <li><b>Index:</b> ${count == null ? 'read-failed' : count.toLocaleString()} entries — <b>net-new ${netNew == null ? '?' : netNew.toLocaleString()} / ${TARGET.toLocaleString()}</b> (${netNew == null ? '?' : (netNew / TARGET * 100).toFixed(1)}%)</li>
      <li><b>Running lanes (${lanes.length}):</b> ${lanes.join(', ') || 'NONE'}</li>
      <li><b>_indexnow_sitewide.js OFF:</b> ${indexnowOff ? '✅ yes' : '⚠️ NO — kill it'}</li>
    </ul>
    <p style="color:#555">Full handoff: <code>C:/Users/koryj/website/_HANDOFF_NEXT_CLAUDE.md</code> (live snapshot at top). Refreshed ${stamp} ET.</p>
  </div>`;
  // 🔒 KILL SWITCH (owner 2026-06-26 PM: "cancel all automated emails"). Still refresh the
  // doc, but never email while the flag exists. Delete _emails_off.flag to re-enable.
  if (!sendEmail || fs.existsSync('C:/Users/koryj/website/_emails_off.flag')) { console.log(new Date().toISOString(), 'handoff doc refreshed (no email — disabled or start-of-shift)'); return; }
  try {
    const r = await fetch(NOTIFY, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject: `⏰ Time for the handoff — ${netNew == null ? '?' : netNew.toLocaleString()}/${TARGET.toLocaleString()} net-new · ${lanes.length} lanes`, html }) });
    console.log(new Date().toISOString(), 'handoff refreshed + emailed:', await r.text());
  } catch (e) { console.error(new Date().toISOString(), 'email failed:', e.message); }
}

// Start of shift: refresh the doc snapshot silently (no email). The "time for
// the handoff" email fires only at the hour mark, then every 60 min after.
(async () => {
  await refresh(false);
  setInterval(() => refresh(true), (parseInt(process.env.HANDOFF_INTERVAL_MIN || '15', 10)) * 60 * 1000);   // 🔒 LAW (owner 2026-06-30, 4444): auto-save every 15 min (default 15). Do not raise without "4444".
})();
