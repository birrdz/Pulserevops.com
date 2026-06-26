const { getStore } = require('@netlify/blobs');
const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
if (!process.env.BLOBS_PAT && process.env.NETLIFY_AUTH_TOKEN) process.env.BLOBS_PAT = process.env.NETLIFY_AUTH_TOKEN;
(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
  const evs = await store.get('_polish_events.json', { type: 'json' });
  const q226events = (evs && evs.events ? evs.events : []).filter(e => e && e.id === 'q226');
  console.log('q226 polish events count:', q226events.length);
  console.log('q226 polish events (last 8):');
  for (const e of q226events.slice(-8)) console.log('  ', e.from + '->' + e.to, e.note ? (e.note.slice(0,80) + (e.note.length>80?'...':'')) : '');
  // 413/504 events — likely refers to rate-limit / timeout events
  const ev413 = (evs && evs.events ? evs.events : []).filter(e => e && (e.status === 413 || e.status === 504 || /413|504/.test(String(e.note||''))));
  console.log('total 413/504 events in _polish_events.json:', ev413.length);
  // Check entry
  const e = await store.get('answers/q226.json', { type: 'json' });
  console.log('blob format_v=', e.format_v, 'qs=', e.quality_score, 'polish_history=', (e.polish_history||[]).length);
  // Index entry
  const idx = await store.get('_index.json', { type: 'json' });
  const idxRow = idx.entries.find(x => x && x.id === 'q226');
  console.log('index format_v=', idxRow && idxRow.format_v, 'qs=', idxRow && idxRow.quality_score);
})().catch(err => { console.error('ERR', err); process.exit(1); });
