// Live-library dedupe for economy CRO cron (no LLM).

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

async function fetchLibrary() {
  const r = await fetch(
    'https://pulserevops.com/.netlify/functions/pulse-machine-library-list?recent=5000'
  );
  const j = await r.json().catch(() => ({}));
  return (j.entries || []).filter((e) => e && /^q\d+$/i.test(e.id));
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
    similar: similar.slice(0, 5),
  };
}

module.exports = { fetchLibrary, checkAgainst, norm, jaccard };
