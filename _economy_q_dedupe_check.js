// Check a proposed Q&A question against live library (economy, no LLM).
// Usage: node _economy_q_dedupe_check.js "How do you fix forecast sandbagging in Salesforce?"
const https = require('https');

function norm(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function tokens(s) {
  const stop = new Set([
    'how', 'do', 'you', 'what', 'is', 'the', 'a', 'an', 'to', 'in', 'on', 'for', 'of', 'and', 'or',
  ]);
  return norm(s)
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stop.has(w));
}

function jaccard(a, b) {
  const A = new Set(tokens(a));
  const B = new Set(tokens(b));
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const t of A) if (B.has(t)) inter++;
  return inter / (A.size + B.size - inter);
}

function fetchLibrary() {
  return new Promise((resolve, reject) => {
    https
      .get('https://pulserevops.com/.netlify/functions/pulse-machine-library-list?recent=5000', (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          try {
            resolve(JSON.parse(body).entries || []);
          } catch (e) {
            reject(e);
          }
        });
      })
      .on('error', reject);
  });
}

function checkAgainst(entries, proposed) {
  const nProp = norm(proposed);
  const exact = [];
  const similar = [];
  for (const e of entries) {
    const q = e.question || '';
    const n = norm(q);
    if (n === nProp) exact.push({ id: e.id, question: q });
    else {
      const sim = jaccard(proposed, q);
      if (sim >= 0.72) similar.push({ id: e.id, question: q, score: +sim.toFixed(2) });
    }
  }
  similar.sort((a, b) => b.score - a.score);
  return {
    clear: exact.length === 0 && similar.length === 0,
    proposed,
    exact,
    similar: similar.slice(0, 8),
  };
}

async function main() {
  const proposed = process.argv.slice(2).join(' ').trim();
  if (!proposed) {
    console.error('Usage: node _economy_q_dedupe_check.js "Your question here?"');
    process.exit(1);
  }

  const entries = (await fetchLibrary()).filter((e) => /^q\d+$/i.test(e.id));
  const result = { ...checkAgainst(entries, proposed), library_q_count: entries.length };
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.clear ? 0 : 2);
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = { fetchLibrary, checkAgainst, norm };
