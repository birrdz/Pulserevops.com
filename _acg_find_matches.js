// Find all Q&As matching ACG Systems — index-first (fast), then answer text check.
const fs = require('fs');
const { getStore } = require('@netlify/blobs');

try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (_) {}

const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN;

function textHit(s) {
  const t = String(s || '').toLowerCase();
  return t.includes('acg systems') || t.includes('acg system') || /\bacg\b/.test(t);
}

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };

  const candidates = (idx.entries || []).filter((row) => {
    if (!row || !/^q\d+$/i.test(row.id)) return false;
    const tags = row.tags || [];
    if (tags.some((t) => /acg/i.test(String(t)))) return true;
    return textHit(row.question);
  });

  const matches = [];
  for (const row of candidates) {
    const entry = await store.get(`answers/${row.id}.json`, { type: 'json' });
    const q = String((entry && entry.question) || row.question || '');
    const tags = (entry && entry.tags) || row.tags || [];
    const tagHit = tags.some((t) => /acg/i.test(String(t)));
    const qHit = textHit(q);
    const answerHit = entry ? textHit(entry.answer) : false;
    matches.push({
      id: row.id,
      question: q,
      pillar: 'knowledge',
      url: `https://pulserevops.com/knowledge/${row.id}`,
      matchIn: [qHit && 'question', tagHit && 'tags', answerHit && 'answer'].filter(Boolean),
      tags: tags.slice(0, 8),
      hasSeo: !!(entry && entry.seo_optimized_at),
    });
  }

  matches.sort((a, b) => parseInt(a.id.slice(1), 10) - parseInt(b.id.slice(1), 10));
  fs.writeFileSync(
    'C:/Users/koryj/website/_acg_matches.json',
    JSON.stringify({ count: matches.length, matches }, null, 2)
  );
  console.log(JSON.stringify({ count: matches.length, ids: matches.map((m) => m.id) }, null, 2));
})().catch((e) => {
  console.error('ERR', e && e.message);
  process.exit(1);
});
