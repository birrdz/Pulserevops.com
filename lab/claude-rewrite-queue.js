// Manage the Claude-Opus rewrite queue. Picks the next batch of entries that
// need to be rewritten to q9501/q9502 benchmark. Each Claude Code session,
// run this to get the next N entries — I (Claude Opus) write each one,
// save via lab/save-claude-opus-rewrite.js, then we move to the next.
//
// Usage:
//   BLOBS_PAT=... node lab/claude-rewrite-queue.js next [N]   # list next N (default 5)
//   BLOBS_PAT=... node lab/claude-rewrite-queue.js stats     # show progress overall

const { getStore } = require('@netlify/blobs');
const TOKEN = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
if (!TOKEN) { console.error('BLOBS_PAT required'); process.exit(1); }

const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOKEN });
const cmd = process.argv[2] || 'next';
const N = parseInt(process.argv[3] || '5', 10);

function meetsBenchmark(answer) {
  if (!answer) return false;
  const urls = (answer.match(/\bhttps?:\/\/[^\s)]+/g) || []).length;
  const tables = (answer.match(/^\|/gm) || []).length;
  const mermaid = (answer.match(/```mermaid/g) || []).length;
  const headings = (answer.match(/^## /gm) || []).length;
  return answer.length >= 4000 && mermaid >= 1 && urls >= 3 && tables >= 3 && headings >= 4;
}

(async () => {
  const idx = await store.get('_index.json', { type: 'json' });
  if (!idx || !Array.isArray(idx.entries)) { console.error('no index'); process.exit(1); }

  if (cmd === 'stats') {
    // Walk every entry and count benchmark vs not
    let benchmark = 0, sub = 0, checked = 0;
    for (const row of idx.entries) {
      if (!/^q\d+$/.test(row.id)) continue;
      checked++;
      if (checked % 200 === 0) console.error('  scanning... ' + checked);
      const e = await store.get('answers/' + row.id + '.json', { type: 'json' });
      if (e && meetsBenchmark(e.answer || '')) benchmark++;
      else sub++;
    }
    console.log('Library: ' + checked + ' entries');
    console.log('  Meets q9501/q9502 benchmark: ' + benchmark);
    console.log('  Needs rewrite: ' + sub);
    console.log('  Progress: ' + (benchmark / checked * 100).toFixed(1) + '%');
    return;
  }

  // cmd === 'next' — list the next N entries that need rewriting.
  // Priority: newest first (q-id desc) so the top of the library improves fastest.
  const candidates = idx.entries
    .filter(r => /^q\d+$/.test(r.id))
    .sort((a, b) => parseInt(String(b.id).slice(1), 10) - parseInt(String(a.id).slice(1), 10));

  const queue = [];
  for (const row of candidates) {
    if (queue.length >= N) break;
    const e = await store.get('answers/' + row.id + '.json', { type: 'json' });
    if (!e) continue;
    if (meetsBenchmark(e.answer || '')) continue;
    queue.push({
      id: row.id,
      question: e.question,
      currentLen: (e.answer || '').length,
      currentScore: e.quality_score,
    });
  }

  console.log('Next ' + queue.length + ' entries to rewrite (newest first):');
  for (const q of queue) {
    console.log('  ' + q.id + ' [score=' + q.currentScore + ', len=' + q.currentLen + '] · ' + q.question);
  }
  console.log('\nTo rewrite one: write the answer to lab/drafts/' + (queue[0] && queue[0].id) + '-<slug>.md, then run:');
  console.log('  BLOBS_PAT=... node lab/save-claude-opus-rewrite.js ' + (queue[0] && queue[0].id) + ' lab/drafts/' + (queue[0] && queue[0].id) + '-<slug>.md');
})().catch(e => { console.error('FATAL', e); process.exit(1); });
