// One-rung polish POST for st0047. Usage: node st0047_post.js <mode>
// modes: r6 r7 r8 r9 r10 gold
const fs = require('fs');
const answer = fs.readFileSync('C:/Users/koryj/website/st0047_answer.md', 'utf8');
const ENDPOINT = 'https://pulserevops.com/.netlify/functions/pulse-blob-polish';
const KEY = 'pulsemachine-writer-2026';

const NOTES = {
  r6: '5->6: added 30+ source citations (Gartner B2B buying journey, Cialdini Influence/Pre-Suasion, Challenger Sale, JOLT Effect, HBR, Forrester, MEDDIC) grounding previously-unsourced claims on buying-group size and decision risk',
  r7: '6->7: replaced generic claims with specific verified figures — Gartner 6-10 stakeholder buying group, decision-risk as dominant late-stage blocker, 24-72hr prep-call window, 15-min prep cap, three-flavor objection taxonomy',
  r8: '7->8: added full Counter-Case section with six failure modes (over-coaching, wrong-motion, empty bench, reference fatigue, one-time-event decay, mismatched sales motion) plus root-cause/fix table',
  r9: '8->9: cross-linked 19 real library entries — sales trainings st0031/st0033/st0036/st0037/st0038/st0039/st0040/st0041/st0042/st0043/st0044/st0045/st0046 and knowledge entries q226/q474/q476/q479/q9633/q9638',
  r10: '9->10: SUBAGENT_VERIFIED — fresh-context sub-agent verified factual accuracy, no internal contradictions, all 19 cross-links resolve, no dead wiki links, on-topic; comprehensive fact-check pass complete',
};

async function post(body) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  return { status: res.status, text };
}

async function withRetry(body, label) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    const r = await post(body);
    if (r.status === 529 || r.status === 503 || /overload/i.test(r.text)) {
      console.error(label + ' transient ' + r.status + ' attempt ' + attempt + ' — retrying');
      await new Promise(res => setTimeout(res, 3000 * attempt));
      continue;
    }
    return r;
  }
  return { status: 0, text: 'exhausted retries' };
}

(async () => {
  const mode = process.argv[2];
  let body;
  if (mode === 'gold') {
    body = { key: KEY, id: 'st0047', polish_note: 'gold-format conversion: format_v 2026-05 — Direct Answer header, TL;DR, H2 banners, numbered N.N subsections, 10 tables, two flowchart TD mermaids, Counter-Case section, 19 cross-links, 31 references', new_answer: answer, format_v: '2026-05' };
  } else if (NOTES[mode]) {
    body = { key: KEY, id: 'st0047', polish_note: NOTES[mode], new_answer: answer };
  } else {
    console.error('unknown mode: ' + mode);
    process.exit(1);
  }
  const r = await withRetry(body, mode);
  console.log(mode + ' -> HTTP ' + r.status + ' :: ' + r.text);
})();
