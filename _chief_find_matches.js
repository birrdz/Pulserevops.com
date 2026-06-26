// Find all Q&As with word-boundary "chief" in question or answer.
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');

try {
  const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (_) {}

const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN;
const CHIEF_RE = /\bchief\b/i;
const OUT = path.join(__dirname, '_chief_matches.json');

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const matches = [];
  const pillarCounts = {};

  for (const row of idx.entries || []) {
    if (!row || !/^q\d+$/i.test(row.id)) continue;
    const q = String(row.question || '');
    const qHit = CHIEF_RE.test(q);
    let answerHit = false;
    let entry = null;
    const blob = await store.get(`answers/${row.id}.json`, { type: 'json' });
    if (blob) {
      entry = blob;
      answerHit = CHIEF_RE.test(String(blob.answer || ''));
    }
    if (!qHit && !answerHit) continue;

    const pillar = 'knowledge';
    pillarCounts[pillar] = (pillarCounts[pillar] || 0) + 1;
    matches.push({
      id: row.id,
      question: q.slice(0, 140),
      pillar,
      url: `https://pulserevops.com/knowledge/${row.id}`,
      matchIn: [qHit && 'question', answerHit && 'answer'].filter(Boolean),
      tags: (row.tags || []).slice(0, 10),
      hasSeo: !!(entry && entry.seo_optimized_at),
    });
  }

  matches.sort((a, b) => parseInt(a.id.slice(1), 10) - parseInt(b.id.slice(1), 10));
  const report = { count: matches.length, pillarCounts, matches };
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ count: matches.length, pillarCounts, ids: matches.map((m) => m.id) }, null, 2));
})().catch((e) => {
  console.error('ERR', e && e.message);
  process.exit(1);
});
