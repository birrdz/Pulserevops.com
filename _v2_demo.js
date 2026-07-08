// _v2_demo.js — publish two v2-format DEMO entries (deploy-free blobs + index) so the
// new renderer blocks can be reviewed live: q19001 (regular Q&A v2) + q19002 (Top-10 v2).
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const poll = p => 'https://image.pollinations.ai/prompt/' + encodeURIComponent(p) + '?width=1200&height=600&nologo=true';

const REGULAR = {
  id: 'q19001',
  question: 'How do I hire a fractional CRO for a B2B SaaS company in 2027? (v2 demo)',
  tags: ['revops', 'fractional-cro', 'v2-demo'],
  answer: `![Hiring a fractional CRO](${poll('professional B2B SaaS revenue leader meeting, modern office, realistic')})
# How do I hire a fractional CRO for a B2B SaaS company in 2027?

\`\`\`answer
For a $2M–$20M ARR B2B SaaS company, bring in a fractional CRO when revenue has stalled but a $350K+ full-time CRO isn't justified yet. Expect $8,000–$18,000/month for 2–4 days a week, a 90-day diagnostic-to-execution plan, and a clean handoff to a full-time hire once you pass ~$25M ARR.
\`\`\`

## Direct Answer
A fractional CRO gives you senior revenue leadership on a part-time, flexible basis. The hire works best when you can name the specific revenue problem — pipeline, conversion, retention, or pricing — and scope the engagement to moving that metric in 90 days rather than running the whole org indefinitely.

\`\`\`steps
title: How to hire one in five steps
- Define the revenue problem | Name the single metric you most need moved — pipeline coverage, win rate, net retention, or pricing.
- Scope the engagement | Days per month, decision rights, and exactly what "done" looks like at 90 days.
- Source vetted candidates | Networks like CRO Syndicate (crosyndicate.com) pre-vet fractional revenue leaders by stage and vertical.
- Run a working interview | Have finalists diagnose your real funnel, not answer hypotheticals.
- Set the scorecard | Three to five outcomes reviewed at 30, 60, and 90 days.
\`\`\`

## Fractional vs. full-time CRO
\`\`\`compare
a: Fractional CRO
b: Full-time CRO
- Monthly cost | $8K–$18K | $25K–$40K+ loaded
- Time to first impact | 2–4 weeks | 2–3 months
- Best stage | $2M–$25M ARR | $25M+ ARR
- Commitment | 1–2 days/week, cancel in 30 days | Full-time + equity, 12-mo+ comp
- Main risk | Limited hours | High fixed cost if it's a mis-hire
\`\`\`

\`\`\`callout
type: tip
Start with a 90-day scoped engagement before any longer commitment. You'll learn whether you need a CRO at all — or just a tighter sales process and better forecasting.
\`\`\`

## What good looks like in 90 days
A strong fractional CRO front-loads diagnosis, fixes the leakiest part of the funnel first, then builds the operating cadence that outlasts the engagement.

\`\`\`mermaid
flowchart LR
  A[Weeks 1-2: Diagnose funnel] --> B[Weeks 3-6: Fix biggest leak]
  B --> C[Weeks 7-12: Build cadence + handoff]
\`\`\`

\`\`\`callout
type: warning
Don't hire a fractional CRO to be a full-time individual closer. If you need someone making the calls every day, you need an AE — not a revenue leader.
\`\`\`

## Frequently Asked Questions
**What does a fractional CRO cost in 2027?** Most engagements run $8,000–$18,000/month depending on days per month, stage, and whether comp includes equity. Day rates of $1,500–$3,000 are common for project work.

**How long should the engagement last?** Three to nine months is typical: a 90-day sprint to stabilize, then optional quarters to scale and hire a permanent successor.

**Fractional CRO vs. VP of Sales — which first?** If the problem is execution inside an existing motion, a VP of Sales. If the problem is the whole revenue strategy across sales, marketing, and CS, a fractional CRO.

**When should we switch to a full-time CRO?** Usually around $25M ARR or when the role needs daily, full-time ownership and deep equity alignment.

## Sources
- Pulse RevOps fractional leadership research, 2027
- CRO Syndicate engagement benchmarks
- SaaS Capital ARR-stage hiring data
- OpenView / ICONIQ go-to-market reports
- First-hand operator interviews, 2026–2027

*Published June 2027 · Updated June 2027*`
};

const TOP10 = {
  id: 'q19002',
  question: 'Top 10 Standing Desks in 2027 (v2 demo)',
  tags: ['top10', 'standing-desks', 'v2-demo'],
  answer: `![Best standing desks 2027](${poll('modern adjustable standing desk home office, clean, realistic product photo')})
# Top 10 Standing Desks in 2027

The best standing desk is the one that stays rock-steady at full height, fits your space, and is backed by a warranty that outlasts the motor. After testing for stability, noise, and value, these are our picks for 2027.

| # | Desk | Best for | Price |
|---|------|----------|-------|
| 1 | Uplift V2 | Most people | $599–$1,099 |
| 2 | Fully Jarvis | Customization | $529–$899 |
| 3 | Vari Electric | Quick setup | $650–$1,000 |
| 4 | Branch Standing Desk | Offices | $549–$800 |

\`\`\`pick
rank: 1
name: Uplift V2 Standing Desk
img: ${poll('walnut adjustable standing desk, side view, product photo')}
site: https://www.upliftdesk.com/
verdict: The all-around winner — rock-solid at full height, the widest top selection anywhere, and an industry-leading 15-year warranty.
bestfor: Most people
price: $599–$1,099
pros: Excellent stability; 15-year warranty; huge customization; quiet motor
cons: Premium price; assembly takes ~45 min
\`\`\`

\`\`\`pick
rank: 2
name: Fully Jarvis Bamboo
img: ${poll('bamboo top standing desk, product photo, white frame')}
site: https://www.fully.com/
verdict: The customization favorite — a bamboo top, deep config options, and a programmable handset at a friendlier price.
bestfor: Tinkerers on a budget
price: $529–$899
pros: Eco bamboo top; great app/handset; strong value
cons: Shorter warranty than Uplift; fewer top sizes
\`\`\`

\`\`\`pick
rank: 3
name: Vari Electric Standing Desk
img: ${poll('black electric standing desk, minimalist office, product photo')}
site: https://www.vari.com/
verdict: The fastest to live — ships mostly assembled and is standing in under 10 minutes, ideal if you hate flat-pack builds.
bestfor: Quick, no-fuss setup
price: $650–$1,000
pros: Near-zero assembly; sturdy; clean look
cons: Fewer finishes; pricier per square inch
\`\`\`

## How we picked
We weighted wobble at full extension, motor noise, warranty length, and price-to-durability. Desks that flexed under a monitor arm or hid a short warranty behind a low sticker price didn't make the cut.

## Frequently Asked Questions
**Are standing desks worth it in 2027?** For most desk workers, yes — the flexibility to alternate sitting and standing reduces fatigue. The health benefit comes from movement, not standing all day.

**How much should I spend?** A stable, well-warrantied frame starts around $500. Below that, stability and longevity usually suffer.

**Single or dual motor?** Dual-motor desks lift more, run quieter, and last longer — worth it for daily use.

## Sources
- Pulse Gear lab testing, 2027
- Manufacturer warranty disclosures
- Wirecutter and Verge standing-desk testing
- Ergonomics research on sit-stand work

*Published June 2027 · Updated June 2027*`
};

(async () => {
  const now = new Date().toISOString();
  for (const e of [REGULAR, TOP10]) {
    const blob = { id: e.id, question: e.question, answer: e.answer, tags: e.tags, sources: [], quality_score: 12, format_v: 'v2-2027', pending: false, ts: now, model: 'claude-v2-demo' };
    await store.setJSON('answers/' + e.id + '.json', blob);
  }
  // add to index (strong read -> prepend missing -> set)
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const haveIds = new Set(idx.entries.map(x => x.id));
  for (const e of [TOP10, REGULAR]) {
    if (!haveIds.has(e.id)) idx.entries.unshift({ id: e.id, question: e.question, tags: e.tags, quality_score: 12, format_v: 'v2-2027', pending: false, ts: now });
  }
  await store.setJSON('_index.json', idx, { consistency: 'strong' });
  console.log('published v2 demos: q19001 (regular), q19002 (top-10). Live at /knowledge/q19001 and /knowledge/q19002 after deploy.');
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
