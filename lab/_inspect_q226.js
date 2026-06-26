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
  const e = await store.get('answers/q226.json', { type: 'json' });
  if (!e) { console.log('NOT FOUND'); return; }
  const words = String(e.answer||'').replace(/```[\s\S]*?```/g,' ').replace(/https?:\/\/\S+/g,' ').replace(/[#>*_`~|\-=]/g,' ').replace(/\s+/g,' ').trim().split(' ').filter(Boolean).length;
  console.log(JSON.stringify({
    id: e.id,
    question: e.question,
    quality_score: e.quality_score,
    format_v: e.format_v || null,
    word_count: words,
    char_count: String(e.answer||'').length,
    tags_count: Array.isArray(e.tags) ? e.tags.length : 0,
    sources_count: Array.isArray(e.sources) ? e.sources.length : 0,
    polish_history_len: Array.isArray(e.polish_history) ? e.polish_history.length : 0,
    ts: e.ts,
    polished_at: e.polished_at || null,
    answer_head: String(e.answer||'').slice(0, 800),
  }, null, 2));
})().catch(err => { console.error('ERR', err); process.exit(1); });
