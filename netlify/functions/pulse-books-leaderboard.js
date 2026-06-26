// Book Summaries leaderboard — Top 25 "MUST-READ" + Bottom 25 "SKIP THESE"
// derived from bs#### entries. Score ranks books by author authority, recency,
// and 2027-RevOps relevance. Same scrolling-ribbon API shape as the franchise
// leaderboard so the homepage widget can be a near-copy.
//
// Cached at the edge for 2 min; revalidates in background.

const { getStore } = require('@netlify/blobs');

const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

function initStore() {
  const token = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  if (!token) return null;
  return getStore({ name: 'pulse-machine-library', siteID: SID, token });
}

// Author/title authority tiers — books most worth a CRO/RevOps leader's time
// in 2027. Top tier = canonical, currently-cited, applied weekly. Bottom tier
// = classic but increasingly dated for modern revenue operating models.
const AUTHOR_BONUS = {
  // S-tier — direct, current, structural
  'chris voss': 28, 'daniel pink': 26, 'robert cialdini': 26, 'matthew dixon': 28,
  'brent adamson': 26, 'neil rackham': 24, 'daniel kahneman': 28, 'keenan': 24,
  // A-tier — operator-grade, still actively cited in 2027 playbooks
  'jeb blount': 20, 'mark roberge': 22, 'aaron ross': 22, 'anthony iannarino': 20,
  'mike weinberg': 18, 'oren klaff': 18, 'jill konrath': 16, 'jason lemkin': 16,
  // B-tier — solid foundational, partially aging
  'jeffrey gitomer': 10, 'brian tracy': 8, 'mike schultz': 12, 'john doerr': 14,
  'michael bosworth': 10, 'art sobczak': 10, 'tony hughes': 10, 'mark hunter': 8,
  'stu heinecke': 10, 'eliyahu m. goldratt': 14, 'geoffrey a. moore': 16,
  'david sandler': 10, 'thomas williams': 6,
  // C-tier — classic but increasingly dated for modern RevOps
  'dale carnegie': -8, 'og mandino': -14, 'grant cardone': -6, 'jordan belfort': -10,
  'josiane feigon': -6, 'sam walton': -2, 'david maister': 6, 'charles green': 4,
};

function nameFromQuestion(q) {
  if (!q) return '';
  let s = String(q).trim();
  // "<Book Title> by <Author> — Cliff Notes Summary" → "<Book Title>"
  s = s.replace(/\s+by\s+[^—–\-]+(?:—|–|--)\s+.+$/i, '');
  // Fallback: strip trailing "— Cliff Notes …"
  s = s.replace(/\s+(?:—|–|--)\s+(?:Cliff Notes|Chapter|Summary).+$/i, '');
  return s.trim();
}

function authorFromQuestion(q) {
  if (!q) return '';
  const m = String(q).match(/\s+by\s+([^—–\-]+?)(?:\s+(?:—|–|--)|\s*$)/i);
  return m ? m[1].trim() : '';
}

function extractSnippet(body) {
  const text = String(body || '').slice(0, 2200);
  const m = text.match(/##\s*Direct Answer[^\n]*\n+([\s\S]+?)(?=\n##|\n###)/i);
  const direct = m ? m[1] : text;
  return direct.replace(/[*_`>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 110);
}

function dailySeed(idAndDate) {
  let h = 0;
  for (let i = 0; i < idAndDate.length; i++) h = ((h << 5) - h + idAndDate.charCodeAt(i)) | 0;
  return ((h >>> 0) % 10000) / 10000;
}

function scoreEntry(entry, dateKey) {
  const author = authorFromQuestion(entry.question || '');
  const key = author.toLowerCase().split(/[&,]| and /)[0].trim();
  const bonus = AUTHOR_BONUS[key] != null ? AUTHOR_BONUS[key] : 0;

  // Recency: more-recently-polished entries get a small bump (signals our
  // editorial team thinks the book still earns a re-read).
  let recency = 0;
  if (entry.polished_at && typeof entry.polished_at === 'number') {
    const daysOld = (Date.now() - entry.polished_at) / 86400000;
    if (daysOld < 14)  recency = 8;
    else if (daysOld < 60)  recency = 4;
    else if (daysOld < 180) recency = 0;
    else recency = -4;
  }

  // Daily variance: ±6 points
  const variance = (dailySeed(entry.id + '|' + dateKey) - 0.5) * 12;

  let score = 60 + bonus + recency + variance;
  score = Math.max(1, Math.min(99, Math.round(score)));
  return { score, author, snippet: extractSnippet(entry.answer) };
}

function provideLine(s) {
  if (s.score >= 80) return 'Canonical must-read in 2027';
  if (s.score >= 70) return 'Still operator-grade';
  if (s.score >= 60) return 'Solid foundational read';
  if (s.score >= 50) return 'Useful for context';
  if (s.score >= 40) return 'Pick selectively';
  if (s.score >= 30) return 'Aging — read with caveats';
  return 'Skippable for current operators';
}

exports.handler = async (event) => {
  const store = initStore();
  if (!store) {
    return { statusCode: 503, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, err: 'no_store' }) };
  }

  let idx;
  try {
    idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  } catch (e) {
    return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, err: 'idx_read_failed' }) };
  }

  const bsRefs = (idx.entries || []).filter(e => e && /^bs\d+$/i.test(e.id));
  const refs = bsRefs.slice(0, 120);
  const dateKey = new Date().toISOString().slice(0, 10);

  const scored = (await Promise.all(refs.map(async (ref) => {
    try {
      const blob = await store.get('answers/' + ref.id + '.json', { type: 'json' });
      if (!blob) return null;
      const s = scoreEntry(blob, dateKey);
      return {
        id: ref.id,
        name: nameFromQuestion(blob.question || ref.question) + (s.author ? ' — ' + s.author : ''),
        score: s.score,
        author: s.author,
        provides: provideLine(s),
        url: 'https://pulserevops.com/sales-book-summaries/' + ref.id,
      };
    } catch (e) { return null; }
  }))).filter(Boolean);

  scored.sort((a, b) => b.score - a.score);
  const top25 = scored.slice(0, 25);
  const bottom25 = scored.slice(-25).reverse();

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=120, stale-while-revalidate=600',
    },
    body: JSON.stringify({
      ok: true,
      asof: new Date().toISOString().slice(0, 10),
      total_evaluated: scored.length,
      top25,
      bottom25,
      top5: top25.slice(0, 5),
      bottom5: bottom25.slice(0, 5),
    }),
  };
};
