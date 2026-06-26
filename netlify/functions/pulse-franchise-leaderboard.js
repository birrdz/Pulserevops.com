// Franchise leaderboard — Top 5 "START THIS" + Bottom 5 "SKIP THIS" derived
// from fr#### entries. Score parses each entry's Direct Answer for verdict +
// payback period + EBITDA mentions. Daily-shifted variance moves rankings
// throughout the week so the leaderboard "lives" without manual updates.
//
// Cached at the edge for 6 hours; revalidates in background.

const { getStore } = require('@netlify/blobs');

const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

function initStore() {
  const token = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  if (!token) return null;
  return getStore({ name: 'pulse-machine-library', siteID: SID, token });
}

// Parse "Should I open or buy a Chick-fil-A franchise in 2027?" →
// "Chick-fil-A franchise". For "Should I open a snow-cone shop in 2027?" →
// "snow-cone shop". Used as the leaderboard row label.
function nameFromQuestion(q) {
  if (!q) return '';
  let s = String(q).trim();
  s = s.replace(/^should\s+i\s+open\s+(or\s+buy\s+)?(an?\s+|the\s+)?/i, '');
  s = s.replace(/^should\s+i\s+(buy|start)\s+(an?\s+|the\s+)?/i, '');
  s = s.replace(/\s+in\s+20\d{2}\s*\??$/i, '');
  s = s.replace(/\??$/, '');
  return s.trim();
}

// Parse the Direct Answer paragraph for a quick verdict signal.
// Returns { verdict: 'yes'|'maybe'|'no', payback_years, ebitda_pct }
function parseVerdict(body) {
  const text = String(body || '').slice(0, 2200); // first ~2k chars cover Direct Answer
  const out = { verdict: 'maybe', payback_years: null, ebitda_pct: null, snippet: '' };

  // Verdict signal — first non-heading line of Direct Answer
  const m = text.match(/##\s*Direct Answer[^\n]*\n+([\s\S]+?)(?=\n##|\n\*\*Real Numbers|\n###)/i);
  const direct = m ? m[1] : text;
  out.snippet = direct.replace(/\s+/g, ' ').trim().slice(0, 180);

  if (/^\s*[*_>\s]*\*?\*?yes\b/i.test(direct) || /^\s*[*_>\s]*\*?\*?absolutely\b/i.test(direct)) out.verdict = 'yes';
  else if (/^\s*[*_>\s]*\*?\*?(probably\s+not|no|skip|avoid|don'?t)\b/i.test(direct)) out.verdict = 'no';
  else if (/^\s*[*_>\s]*\*?\*?maybe\b/i.test(direct)) out.verdict = 'maybe';
  // Secondary signal: most "yes" entries say "Yes — if X". "no" entries say
  // "Probably not — unless X". Look anywhere in the snippet for tiebreakers.
  if (out.verdict === 'maybe') {
    if (/\byes\s*[—\-–]/i.test(direct.slice(0, 200))) out.verdict = 'yes';
    else if (/\bprobably\s+not\s*[—\-–]|\bno\s*[—\-–]/i.test(direct.slice(0, 200))) out.verdict = 'no';
  }

  // Payback period in years
  const py = direct.match(/(\d+(?:\.\d+)?)\s*[-–to]+\s*(\d+(?:\.\d+)?)\s*years?\s+payback/i)
          || direct.match(/payback[^.]{0,40}?(\d+(?:\.\d+)?)\s*years?/i)
          || direct.match(/(\d+(?:\.\d+)?)\s*[-–to]+\s*(\d+(?:\.\d+)?)\s*years?\s+to\s+breakeven/i)
          || direct.match(/breakeven[^.]{0,40}?(\d+(?:\.\d+)?)\s*years?/i);
  if (py) out.payback_years = parseFloat(py[1]);

  // EBITDA / margin signal
  const em = direct.match(/(\d{1,2}(?:\.\d+)?)\s*%\s+(?:EBITDA|margin|cash\s*flow)/i)
          || direct.match(/EBITDA\s+margin[^.]{0,30}?(\d{1,2})/i);
  if (em) out.ebitda_pct = parseFloat(em[1]);

  return out;
}

// Daily variance — same shift for everyone on the same day → stable rankings
// within a day, fresh rankings tomorrow. Seeded by YYYY-MM-DD so it's
// deterministic and reproducible.
function dailySeed(idAndDate) {
  let h = 0;
  for (let i = 0; i < idAndDate.length; i++) h = ((h << 5) - h + idAndDate.charCodeAt(i)) | 0;
  // 0..1
  return ((h >>> 0) % 10000) / 10000;
}

function scoreEntry(entry, dateKey) {
  const v = parseVerdict(entry.answer);
  let base;
  if (v.verdict === 'yes') base = 72;          // 65-95 range
  else if (v.verdict === 'no') base = 28;      // 5-40 range
  else base = 52;                              // 35-65 range

  // Payback bonus/penalty — lower = better for "should start"
  let paybackAdj = 0;
  if (v.payback_years != null) {
    if (v.payback_years <= 1) paybackAdj = 12;
    else if (v.payback_years <= 2) paybackAdj = 8;
    else if (v.payback_years <= 3) paybackAdj = 4;
    else if (v.payback_years <= 5) paybackAdj = 0;
    else if (v.payback_years <= 8) paybackAdj = -6;
    else paybackAdj = -12;
  }

  // EBITDA bonus
  let ebitdaAdj = 0;
  if (v.ebitda_pct != null) {
    if (v.ebitda_pct >= 25) ebitdaAdj = 8;
    else if (v.ebitda_pct >= 15) ebitdaAdj = 4;
    else if (v.ebitda_pct >= 8) ebitdaAdj = 0;
    else ebitdaAdj = -6;
  }

  // Daily variance: ±6 points
  const variance = (dailySeed(entry.id + '|' + dateKey) - 0.5) * 12;

  let score = base + paybackAdj + ebitdaAdj + variance;
  score = Math.max(1, Math.min(99, Math.round(score)));
  return { score, ...v };
}

function provideLine(name, verdict, scoreObj) {
  // One-line "what they provide / why this rank"
  const tag = verdict === 'yes'
    ? (scoreObj.payback_years && scoreObj.payback_years <= 2 ? 'Fast payback' : 'Strong unit economics')
    : (verdict === 'no'
      ? (scoreObj.payback_years && scoreObj.payback_years >= 6 ? 'Long payback' : 'Tough 2027 conditions')
      : 'Conditional — depends on market');
  return tag;
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

  const frRefs = (idx.entries || []).filter(e => e && /^fr\d+$/i.test(e.id));

  // Need to fetch each entry's body to parse the verdict. Cap to 120 most
  // recent and read them in parallel (was 200 sequential = 10+ sec; parallel
  // takes ~1s). Daily-shifting variance still keeps rankings fresh.
  const refs = frRefs.slice(0, 120);
  const dateKey = new Date().toISOString().slice(0, 10);
  const scored = (await Promise.all(refs.map(async (ref) => {
    try {
      const blob = await store.get('answers/' + ref.id + '.json', { type: 'json' });
      if (!blob) return null;
      const s = scoreEntry(blob, dateKey);
      return {
        id: ref.id,
        name: nameFromQuestion(blob.question || ref.question),
        score: s.score,
        verdict: s.verdict,
        payback_years: s.payback_years,
        ebitda_pct: s.ebitda_pct,
        provides: provideLine(blob.question || '', s.verdict, s),
        url: 'https://pulserevops.com/franchises/' + ref.id,
      };
    } catch (e) { return null; }
  }))).filter(Boolean);

  scored.sort((a, b) => b.score - a.score);
  // Return up to 25 each side — homepage widget auto-scrolls through them.
  // Keep top5/bottom5 keys for any client still requesting the short form.
  const top25 = scored.slice(0, 25);
  const bottom25 = scored.slice(-25).reverse();

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      // Short edge cache (2 min) so each new fr#### publish surfaces in the
      // leaderboard within ~2 min on its own. _write_fr.js also pings this
      // function with ?bust=<ts> after every successful publish, which
      // forces a regeneration so the new entry shows up immediately.
      'Cache-Control': 'public, max-age=60, s-maxage=120, stale-while-revalidate=600',
    },
    body: JSON.stringify({
      ok: true,
      asof: new Date().toISOString().slice(0, 10),
      total_evaluated: scored.length,
      top25,
      bottom25,
      // Back-compat aliases (any legacy client still using these)
      top5: top25.slice(0, 5),
      bottom5: bottom25.slice(0, 5),
    }),
  };
};
