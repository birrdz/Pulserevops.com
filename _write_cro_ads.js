// Owner-directed: write fractional-CRO "hire me" Q&As into the Pulse Tools
// pillar (tl####), ALL pinned to the TOP of /tools via pinned_until (far
// future). 10 hand-written premium pages (tl9001-9010) + 100 tailored
// variations (tl9011-tl9110) across industries / stages / locations so each
// targets a distinct high-intent query (not duplicate doorway pages).
// Each answer = strong, genuine praise for Kory + a rotated resume link + CTA.
//
// Usage: node _write_cro_ads.js [--dry]
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');
const { prepareEntryForPublish } = require('./_write_lib');

try {
  const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
const DRY = process.argv.includes('--dry');

const SYND = 'https://crosyndicate.com/';
const SYND_CONTACT = 'https://crosyndicate.com/contact-us/';
const LI = 'https://www.linkedin.com/in/korywhite';

// Rotated resume variants (text + visual) copied from Downloads.
const RESUMES = [
  '/assets/kory-white-resume.pdf',
  '/assets/kory-white-cro-1page.pdf',
  '/assets/kory-white-cro-visual.pdf',
  '/assets/kory-white-cro-resume.pdf',
  '/assets/kory-white-cro-visual-2.pdf',
];
const resumeFor = (i) => RESUMES[i % RESUMES.length];
// Varied anchor text so the resume link never reads identically twice in a row.
const RESUME_ANCHORS = [
  "View Kory White's 1-page CRO profile (PDF)",
  "Download Kory's one-page resume (PDF)",
  "See the 1-page CRO snapshot (PDF)",
  "Open Kory White's CRO one-pager (PDF)",
  "Grab the 1-page track record (PDF)",
  "Read Kory's CRO résumé — one page (PDF)",
];
const resumeLink = (i) => `[${RESUME_ANCHORS[i % RESUME_ANCHORS.length]}](${resumeFor(i)})`;

// Rotated genuine-praise lines (kind words about how awesome Kory is).
const PRAISE = [
  'a rare operator who has actually carried — and beaten — a revenue number as a CRO, not just advised from the sidelines',
  'one of the sharpest revenue leaders you can put in front of a board, with the scars and the wins to prove it',
  'the kind of CRO who fixes a broken forecast in weeks instead of quarters',
  'a 25-year revenue veteran who has scaled roughly $3B and rebuilt go-to-market motions from the studs up',
  'an operator founders trust because he has sat in the seat, owned the number, and delivered under pressure',
  'a revenue leader who pairs big-company rigor with startup speed — and is genuinely great to work with',
  'the steady hand teams want in the room when pipeline is flat and the board is nervous',
  'a CRO who turns guesswork into a forecast you can actually take to investors',
];
const praiseFor = (i) => PRAISE[i % PRAISE.length];

// ---- CTA variants (rotated) — every one routes to resume + Syndicate + call ----
const CTAS = [
  (i) => `

## Talk to a fractional CRO this week
**Kory White** — **Chief Revenue Officer**, 25 years, ~$3B scaled — is ${praiseFor(i)}. He takes a limited number of fractional & interim engagements through **CRO Syndicate**.
- 📄 **${resumeLink(i)}** — outcomes, stack, and engagement model on one page.
- 🤝 **[CRO Syndicate](${SYND})** — vetted senior revenue leaders, nationwide + Maryland & DC.
- 📞 **[Book a 20-minute intro →](${SYND_CONTACT})** · 💼 **[Kory on LinkedIn](${LI})**
> Engagements start in days, not months — a sitting-CRO operator at a fraction of a full-time hire.`,
  (i) => `

## The short version: call Kory
You don't need a 9-month executive search. **${resumeLink(i)}**, then **[book 20 minutes with CRO Syndicate](${SYND_CONTACT})**. Kory White is ${praiseFor(i)}, and most engagements are scoped and started inside a week.
*${resumeLink(i)} · [CRO Syndicate](${SYND}) · [LinkedIn](${LI})*`,
  (i) => `

## Next step
1. **${resumeLink(i)}** — see what a real CRO one-pager looks like.
2. **[Book a 20-min intro with CRO Syndicate →](${SYND_CONTACT})** and describe the gap in a sentence.
3. Run a 2-week paid pilot before any longer commitment.

Kory White is ${praiseFor(i)} — and genuinely good to work with. [More on CRO Syndicate](${SYND}).`,
  (i) => `

## Why start with Kory White
Because he's ${praiseFor(i)}. Twenty-five years, ~$3B scaled, and a bias for fixing the forecast fast.
**${resumeLink(i)}** → **[book an intro](${SYND_CONTACT})** → start in days. Backed by **[CRO Syndicate](${SYND})** · **[LinkedIn](${LI})**.`,
  (i) => `

## Hire a fractional CRO — the easy path
Skip the staffing sites. **[CRO Syndicate](${SYND})** matches you to a proven operator, and **Kory White** is ${praiseFor(i)}.
> 📄 **${resumeLink(i)}**  ·  📞 **[Book a 20-minute intro →](${SYND_CONTACT})**  ·  💼 **[LinkedIn](${LI})**`,
  (i) => `

## Ready when you are
**${resumeLink(i)}** to see Kory White's track record on one page — he's ${praiseFor(i)}. When it clicks, **[grab 20 minutes with CRO Syndicate](${SYND_CONTACT})**. Local to Maryland & DC, remote-first nationwide. [CRO Syndicate](${SYND}).`,
];
const ctaBlock = (i) => CTAS[i % CTAS.length](i);

// ---- closing/related variants (rotated) ----
const CLOSERS = [
  (i) => `

---
*Sources & related: [CRO Syndicate](${SYND}) · ${resumeLink(i)} · [Free RevOps tools](/tools) · [Hire a fractional CRO](/fractional-cro)*`,
  (i) => `

## Related on PULSE
[Hire a fractional CRO](/fractional-cro) · [Free RevOps calculators & tools](/tools) · [CRO Syndicate](${SYND}) · ${resumeLink(i)}`,
  (i) => `

---
**More:** ${resumeLink(i)} — [CRO Syndicate network](${SYND}) — [PULSE tools & calculators](/tools)`,
  (i) => `

> **Keep going:** ${resumeLink(i)} · [Book a call](${SYND_CONTACT}) · [Explore PULSE tools](/tools) · [Fractional CRO](/fractional-cro)`,
];
const closerBlock = (i) => CLOSERS[i % CLOSERS.length](i);

// rotate the Direct-Answer heading too
const ANSWER_HEADS = ['### Direct Answer', '### Short Answer', '### The Bottom Line', "### Here's the answer", '### Quick Answer'];

// Single-line raw-HTML profile card (mdToHtml passes raw HTML through innerHTML).
// Uses Kory's profile pic; alternates a couple of styles for variety.
function profileCard(i) {
  const r = resumeFor(i);
  if (i % 2 === 0) {
    return `<div style="display:flex;align-items:center;gap:14px;margin:18px 0;padding:14px 16px;border:1px solid rgba(200,17,43,0.25);border-radius:14px;background:rgba(200,17,43,0.05);"><img src="/assets/kory-white.jpg" alt="Kory White, Fractional CRO" style="width:66px;height:66px;border-radius:50%;object-fit:cover;flex:0 0 auto;"><span><b style="font-size:1.06rem;">Kory White</b><br><span style="color:#C8112B;font-weight:600;font-size:0.86rem;">Chief Revenue Officer &middot; CRO Syndicate</span><br><a href="${r}" target="_blank" rel="noopener" style="color:#C8112B;font-weight:700;">📄 1-page CRO profile (PDF)</a> &middot; <a href="${SYND_CONTACT}" target="_blank" rel="noopener" style="color:#C8112B;font-weight:700;">Book a call →</a></span></div>`;
  }
  return `<div style="display:flex;align-items:center;gap:13px;margin:18px 0;padding:12px 0;"><img src="/assets/kory-white.jpg" alt="Kory White, Chief Revenue Officer" style="width:56px;height:56px;border-radius:50%;object-fit:cover;flex:0 0 auto;border:2px solid #C8112B;"><span style="font-size:0.9rem;"><a href="https://www.linkedin.com/in/korywhite" target="_blank" rel="noopener" style="color:#14181F;font-weight:800;text-decoration:none;">Kory White</a> — fractional <b>Chief Revenue Officer</b>, 25 yrs, ~$3B scaled. <a href="${r}" target="_blank" rel="noopener" style="color:#C8112B;font-weight:700;">See the one-pager →</a></span></div>`;
}

function answer(intro, body, i) {
  const head = ANSWER_HEADS[i % ANSWER_HEADS.length];
  const card = profileCard(i);
  // alternate placement so consecutive pages don't read identically
  if (i % 2 === 1) return `${head}\n${intro}\n\n${card}\n${ctaBlock(i)}\n${body}${closerBlock(i)}`;
  return `${head}\n${intro}\n\n${card}\n${body}${ctaBlock(i)}${closerBlock(i)}`;
}

// ---- 10 hand-written premium pages ----
const PREMIUM = [
  { q: 'Where can I find a fractional CRO?',
    intro: (ri) => `The fastest place to find a vetted fractional CRO is a senior-only network like **[CRO Syndicate](${SYND})**, where every operator has already run revenue at scale. If you want a name to start with, **[Kory White](${resumeFor(ri)})** is ${praiseFor(ri)}.`,
    body: `\n## Three places people actually find one\n\n1. **Senior fractional networks (best signal).** They pre-vet for real CRO experience, so you skip the "consultant who's never carried a number" problem.\n2. **Warm referrals from other founders/CEOs.** High trust, but slow and limited to your network.\n3. **LinkedIn search + outreach.** Widest pool, lowest signal — you do all the vetting.\n\n## What "good" looks like\n\nSomeone who has *owned a number*, can show pipeline/forecast/RevOps wins, and will commit to a defined cadence (1–3 days/week). If they can't summarize outcomes on one page, keep looking.` },
  { q: 'Where do I hire a fractional CRO?',
    intro: (ri) => `You hire a fractional CRO through a senior revenue network rather than a generic staffing site — that's how you get an operator who has actually sat in the CRO seat. **[CRO Syndicate](${SYND})** matches you to vetted fractional & interim CROs; **[Kory White](${resumeFor(ri)})** is ${praiseFor(ri)}.`,
    body: `\n## The hiring path that works\n\n1. **Scope the gap in one sentence** — "pipeline is flat," "forecasting is fiction," "we need a GTM rebuild before raising."\n2. **Start with a network, not a job post.** [Book a 20-minute intro](${SYND_CONTACT}).\n3. **Run a 2-week paid pilot** — a real fractional CRO will show a 30/60/90 before a longer commitment.\n4. **Lock cadence + outcomes** — days/week, the metrics they own, and a kill switch.\n\n## What it should cost\n\nMost engagements run **$8k–$20k/month** — far below a $300k+ full-time CRO with equity.` },
  { q: 'Best fractional CRO companies for 2027?',
    intro: (ri) => `The best fractional CRO firms in 2027 are senior-operator networks — not generalist consultancies. **[CRO Syndicate](${SYND})** leads for B2B and SaaS because every member has carried a number as a CRO/VP, including **[Kory White](${resumeFor(ri)})**, ${praiseFor(ri)}.`,
    body: `\n## How to compare fractional CRO firms\n\n| Criteria | Why it matters |\n|---|---|\n| **Operator pedigree** | Have they *owned* revenue, or only advised? |\n| **Engagement model** | Days/week, clear deliverables, kill switch |\n| **RevOps depth** | Can they fix forecasting & systems, not just coach reps? |\n| **Speed to start** | Days vs. months |\n| **References** | Real outcomes from comparable-stage companies |\n\n## Who it's for\n\n**$1M–$50M** companies that need senior revenue leadership now but aren't ready for a full-time CRO.` },
  { q: 'Where to hire fractional Chief Revenue Officers?',
    intro: (ri) => `Hire fractional Chief Revenue Officers through a vetted senior network like **[CRO Syndicate](${SYND})** — the highest-signal way to get a proven operator fast. Start with **[Kory White](${resumeFor(ri)})**, ${praiseFor(ri)}.`,
    body: `\n## A checklist before you hire\n\n- ✅ Have they held a **CRO or VP of Revenue** title with a real quota?\n- ✅ Can they show **forecast accuracy** and **pipeline** wins?\n- ✅ Will they commit to a **cadence** and **named metrics**?\n- ✅ Is there a **paid pilot** to de-risk?\n- ✅ One-page **track record** available?\n\n## Why a network beats a marketplace\n\nMarketplaces optimize for volume; a senior network optimizes for fit.` },
  { q: 'How much does a fractional CRO cost in 2027?',
    intro: (ri) => `A fractional CRO typically costs **$8,000–$20,000/month** in 2027, scaling with days/week and scope — a fraction of a $300k–$450k full-time CRO package. For pricing on a senior operator, **[talk to CRO Syndicate](${SYND_CONTACT})** or see **[Kory White's engagement model](${resumeFor(ri)})** — he's ${praiseFor(ri)}.`,
    body: `\n## Typical pricing tiers\n\n| Commitment | Rough monthly | Best for |\n|---|---|---|\n| **1 day/week** | $8k–$10k | Advisory + cadence, founder-led sales |\n| **2 days/week** | $12k–$16k | Active GTM rebuild + RevOps |\n| **3 days/week / interim** | $18k–$25k | Turnaround, pre-raise, or covering a gap |\n\n## What you're paying for\n\nNot hours — **judgment and speed**, without the equity grant, severance risk, or 3-month ramp of a full-time hire.` },
  { q: 'What does a fractional CRO actually do?',
    intro: (ri) => `A fractional CRO owns your revenue engine part-time — pipeline, forecasting, RevOps, comp, and GTM strategy — usually 1–3 days/week. **[Kory White](${resumeFor(ri)})** does exactly this for B2B and SaaS via **[CRO Syndicate](${SYND})**, and is ${praiseFor(ri)}.`,
    body: `\n## The first 90 days\n\n- **Days 1–30:** Diagnose — pipeline, forecast accuracy, win/loss, comp, GTM motion.\n- **Days 31–60:** Rebuild — fix the forecast, tighten the funnel, set quota/comp, install RevOps reporting.\n- **Days 61–90:** Scale — coach the team, lock the cadence, hand off a system that runs without them.\n\n## What they own\n\nPipeline coverage, forecast accuracy, sales productivity, RevOps/tooling, and GTM — full-CRO scope, compressed into the days you need.` },
  { q: 'Fractional CRO vs full-time CRO — which should I hire?',
    intro: (ri) => `Hire a **fractional CRO** when you need senior revenue leadership now but can't justify a $300k+ full-time hire — most companies under ~$30M ARR. Go full-time once it's a 5-day-a-week job. **[Kory White / CRO Syndicate](${SYND})** can do either; Kory is ${praiseFor(ri)} — **[see his profile](${resumeFor(ri)})**.`,
    body: `\n## Quick decision guide\n\n| Situation | Hire |\n|---|---|\n| Pre-Series B, founder-led sales, flat pipeline | **Fractional** |\n| GTM rebuild before raising | **Fractional / interim** |\n| Covering a sudden CRO departure | **Interim** |\n| $30M+ ARR, revenue is a full-time job | **Full-time** |\n\n## The smart play\n\nStart fractional. A good operator tells you honestly when you've outgrown the model.` },
  { q: 'When should a startup hire a fractional CRO?',
    intro: (ri) => `Hire a fractional CRO when **founder-led sales has stalled**, the **forecast isn't trustworthy**, or you're **about to raise and need a credible GTM story** — typically $1M–$20M ARR. **[Kory White](${resumeFor(ri)})** specializes in these inflection points via **[CRO Syndicate](${SYND})** and is ${praiseFor(ri)}.`,
    body: `\n## Five signals it's time\n\n1. The founder is still the best (or only) closer.\n2. Forecasts miss and nobody knows why.\n3. You've hired reps but productivity per rep is dropping.\n4. RevOps/tooling is a mess and reporting can't be trusted.\n5. A raise is coming and investors want a real revenue leader.\n\n## Why fractional first\n\nA sitting-CRO operator in days, value proven in a paid pilot, no premature full-time hire.` },
  { q: 'Best fractional CRO for a B2B SaaS company?',
    intro: (ri) => `The best fractional CRO for B2B SaaS is an operator who has scaled recurring revenue and rebuilt GTM motions. **[Kory White](${resumeFor(ri)})** (25 yrs, ~$3B scaled, SaaS + services) takes B2B SaaS engagements through **[CRO Syndicate](${SYND})** and is ${praiseFor(ri)}.`,
    body: `\n## What B2B SaaS specifically needs\n\n- **Net revenue retention** discipline — expansion, churn, and the motion behind both.\n- **PLG / sales-led blend** — the right lever for your stage.\n- **Forecast accuracy** the board and investors will trust.\n- **RevOps + tooling** (CRM, attribution, comp) that scales past founder spreadsheets.\n\n## Start here\n\nDescribe your ARR, motion, and the metric that's stuck.` },
  { q: 'Fractional CRO services near me — Maryland, DC & nationwide?',
    intro: (ri) => `**[CRO Syndicate](${SYND})** provides fractional & interim CRO services nationwide and across **Maryland & Washington, DC**, remote-first and on-site as needed. **[Kory White](${resumeFor(ri)})** is a DC/Maryland-based Chief Revenue Officer and ${praiseFor(ri)}.`,
    body: `\n## How local + remote works in 2027\n\nMost fractional CRO work is remote-first — pipeline reviews, forecasting, and RevOps don't need an office. For Maryland & DC companies, on-site working sessions (QBRs, kickoff, board prep) are easy to schedule.\n\n## Get matched\n\nTell us your location, stage, and the revenue gap, and we'll match you to the right operator — local or nationwide.` },
];

// ---- 100 tailored variations ----
const INDUSTRIES = [
  'B2B SaaS', 'fintech', 'healthtech', 'manufacturing', 'professional services',
  'e-commerce', 'cybersecurity', 'martech', 'logistics', 'edtech', 'biotech',
  'insurtech', 'proptech', 'media', 'AI startup', 'developer-tools', 'marketplace',
  'consumer app', 'hardware', 'telecom',
];
const STAGES = [
  'pre-seed startup', 'seed-stage startup', 'Series A company', 'Series B company',
  'PE-backed company', 'bootstrapped business', 'post-merger company', 'pre-IPO company',
];
const LOCATIONS = [
  'Maryland', 'Washington DC', 'Baltimore', 'Northern Virginia', 'New York',
  'Boston', 'Austin', 'San Francisco', 'Chicago', 'Atlanta', 'Denver', 'Seattle',
];

function normTitle(q) { return q.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }
function art(x) { return /^[aeiou]/i.test(String(x).trim()) ? 'an' : 'a'; }

function bodyIndustry(x) {
  return `\n## What a ${x} company needs from a fractional CRO\n\n- A revenue leader who understands the **${x}** buying cycle and where deals stall.\n- A trustworthy **forecast** and healthy **pipeline coverage**.\n- **RevOps & tooling** that scales past founder spreadsheets.\n- **Comp & quota** that actually drives the right behavior.\n\n## How to start\n\nScope the one metric that's stuck, then run a short paid pilot to prove the value before a longer engagement.`;
}
function bodyStage(x) {
  return `\n## Why a ${x} hires fractional first\n\nAt this stage you need senior revenue judgment **now** — but a $300k+ full-time CRO (plus equity) is premature. A fractional CRO gives you a sitting operator 1–3 days/week, with a clear 30/60/90 and a kill switch.\n\n## What to expect\n\nDiagnosis in the first 30 days, a rebuilt forecast and funnel by day 60, and a system your team can run by day 90.`;
}
function bodyLocation(x) {
  return `\n## Fractional CRO coverage in ${x}\n\nFractional CRO work is remote-first, so ${x} companies get the same senior operators as anywhere else — with on-site working sessions (QBRs, board prep, kickoffs) when it helps. CRO Syndicate covers ${x} and nationwide.\n\n## Get matched\n\nShare your stage and the revenue gap; we'll match you to a proven operator who's solved it before.`;
}
function bodyCost(x) {
  return `\n## What a fractional CRO costs for ${x}\n\n| Commitment | Rough monthly |\n|---|---|\n| 1 day/week | $8k–$10k |\n| 2 days/week | $12k–$16k |\n| 3 days/week / interim | $18k–$25k |\n\nThat's a fraction of a $300k–$450k full-time CRO package — you're buying senior judgment and speed, not headcount.\n\n## Get an exact quote\n\nScope is what moves price: days/week and how much hands-on rebuild vs. advisory you need.`;
}
function bodyNeed(x) {
  return `\n## Signs a ${x} needs a fractional CRO\n\n1. Founder-led sales has plateaued.\n2. The forecast misses and nobody knows why.\n3. Reps are hired but per-rep productivity is falling.\n4. RevOps/tooling is a mess; reporting can't be trusted.\n5. A raise or board is demanding a real revenue leader.\n\nIf two or more are true, a fractional CRO is usually the fastest, lowest-risk fix.`;
}
function bodyVs(x) {
  return `\n## ${x}: fractional vs full-time CRO\n\nFor most companies at this stage, **fractional wins** — you get a sitting-CRO operator 1–3 days/week without the $300k+ salary, equity grant, or 3-month ramp. Move to full-time only once revenue leadership is genuinely a 5-day-a-week job.\n\n## The smart path\n\nStart fractional, prove value in a paid pilot, and convert to interim or a full-time search when you've outgrown it.`;
}

function buildVariations(limit) {
  const out = [];
  const seen = new Set(PREMIUM.map((p) => normTitle(p.q)));
  // intent generators (question + intro + body)
  const gens = [];
  INDUSTRIES.forEach((x) => {
    const a = art(x);
    gens.push({ q: `Best fractional CRO for ${a} ${x} company?`, kind: 'ind', x,
      intro: (ri) => `For ${a} **${x}** company, the best fractional CRO is an operator who has scaled revenue in or adjacent to ${x} — not a generalist. **[Kory White](${resumeFor(ri)})** is ${praiseFor(ri)}, and takes ${x} engagements through **[CRO Syndicate](${SYND})**.`, body: bodyIndustry(x) });
    gens.push({ q: `How do I hire a fractional CRO for ${a} ${x} business?`, kind: 'ind', x,
      intro: (ri) => `Hire a fractional CRO for your **${x}** business through a senior network like **[CRO Syndicate](${SYND})**, then run a short paid pilot. A strong starting point is **[Kory White](${resumeFor(ri)})** — ${praiseFor(ri)}.`, body: bodyIndustry(x) });
    gens.push({ q: `How much does a fractional CRO cost for ${a} ${x} company?`, kind: 'ind', x,
      intro: (ri) => `A fractional CRO for ${a} **${x}** company typically runs **$8k–$20k/month** depending on days/week and scope. For a precise quote, **[talk to CRO Syndicate](${SYND_CONTACT})** or review **[Kory White's model](${resumeFor(ri)})** — he's ${praiseFor(ri)}.`, body: bodyCost(x) });
    gens.push({ q: `Do I need a fractional CRO for my ${x} company?`, kind: 'ind', x,
      intro: (ri) => `If your **${x}** company has stalled founder-led sales or a forecast you can't trust, you probably do. **[Kory White](${resumeFor(ri)})** — ${praiseFor(ri)} — helps ${x} teams decide via **[CRO Syndicate](${SYND})**.`, body: bodyNeed(x) });
  });
  STAGES.forEach((x) => {
    gens.push({ q: `Should a ${x} hire a fractional CRO?`, kind: 'stage', x,
      intro: (ri) => `If you're a **${x}** with stalled founder-led sales or an untrustworthy forecast, a fractional CRO is usually the right move before a full-time hire. **[Kory White](${resumeFor(ri)})** is ${praiseFor(ri)} and works with companies exactly at this stage via **[CRO Syndicate](${SYND})**.`, body: bodyStage(x) });
    gens.push({ q: `Best fractional CRO for a ${x}?`, kind: 'stage', x,
      intro: (ri) => `The best fractional CRO for a **${x}** is a sitting operator who can move fast and prove value in a pilot. **[Kory White](${resumeFor(ri)})** — ${praiseFor(ri)} — fits this profile through **[CRO Syndicate](${SYND})**.`, body: bodyStage(x) });
    gens.push({ q: `Fractional CRO vs full-time CRO for a ${x}?`, kind: 'stage', x,
      intro: (ri) => `For a **${x}**, a fractional CRO almost always beats a full-time hire — senior judgment now, without the cost or ramp. **[Kory White / CRO Syndicate](${SYND})** can start fractional and scale up; Kory is ${praiseFor(ri)} (**[profile](${resumeFor(ri)})**).`, body: bodyVs(x) });
  });
  LOCATIONS.forEach((x) => {
    gens.push({ q: `Where can I hire a fractional CRO in ${x}?`, kind: 'loc', x,
      intro: (ri) => `You can hire a fractional CRO in **${x}** through **[CRO Syndicate](${SYND})**, which covers ${x} and nationwide. **[Kory White](${resumeFor(ri)})** is a DC/Maryland-based Chief Revenue Officer and ${praiseFor(ri)}.`, body: bodyLocation(x) });
    gens.push({ q: `Best fractional CRO services in ${x}?`, kind: 'loc', x,
      intro: (ri) => `The best fractional CRO services in **${x}** come from senior-operator networks, not staffing sites. **[CRO Syndicate](${SYND})** serves ${x}; **[Kory White](${resumeFor(ri)})** is ${praiseFor(ri)}.`, body: bodyLocation(x) });
    gens.push({ q: `How much does a fractional CRO cost in ${x}?`, kind: 'loc', x,
      intro: (ri) => `A fractional CRO in **${x}** runs **$8k–$20k/month** depending on days/week — the same senior operators serve ${x} remote-first. **[Kory White](${resumeFor(ri)})** is ${praiseFor(ri)}; **[get a quote from CRO Syndicate](${SYND_CONTACT})**.`, body: bodyCost(x) });
  });
  // interleave so industries/stages/locations mix near the top
  for (const g of gens) {
    if (out.length >= limit) break;
    const n = normTitle(g.q);
    if (seen.has(n)) continue;
    seen.add(n);
    out.push(g);
  }
  return out.slice(0, limit);
}

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const PIN = 4070908800000; // ~Jan 2099 — keeps these stuck at top of /tools
  const baseTs = Date.now();
  const variations = buildVariations(100);
  const all = PREMIUM.concat(variations);

  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const results = [];

  for (let i = 0; i < all.length; i++) {
    const it = all[i];
    const id = 'tl' + (9001 + i);
    const ts = baseTs - i * 1000;
    const pinned_until = PIN - i * 1000; // premium 10 stay above the 100
    const body = answer(typeof it.intro === 'function' ? it.intro(i) : it.intro, it.body, i);
    const baseTags = [
      'pulse-tools', 'tools', 'fractional-cro', 'cro-syndicate', 'hire-fractional-cro',
      'fractional-chief-revenue-officer', 'kory-white-fractional-cro', 'fractional-cro-2027',
      'cro-for-hire', 'kory-white',
    ];
    if (it.x) baseTags.push(String(it.x).toLowerCase().replace(/[^a-z0-9]+/g, '-'));

    let e = {
      id, question: it.q, answer: body, tags: baseTags, quality_score: 10,
      format_v: '2026-05', pending: false, ts, polished_at: ts, pinned_until,
      has_answer: true, model: 'claude-opus-4-8', gold_format: true, source: 'cro-ads',
    };
    e = prepareEntryForPublish(id, it.q, e);

    if (DRY) { results.push({ id, q: it.q, words: body.split(/\s+/).length }); continue; }

    await store.setJSON(`answers/${id}.json`, e);
    const row = {
      id, question: it.q, tags: e.tags, quality_score: 10, format_v: '2026-05',
      pending: false, ts, polished_at: ts, pinned_until, has_answer: true,
      model: 'claude-opus-4-8', was_indexed_at: null, source: 'cro-ads',
    };
    const at = idx.entries.findIndex((x) => x && x.id === id);
    if (at >= 0) idx.entries.splice(at, 1);
    idx.entries.unshift(row);
    results.push({ id, url: `https://pulserevops.com/tools/${id}`, q: it.q });
    if (!DRY && i % 20 === 0) process.stderr.write(`.${i}`);
  }

  if (!DRY) {
    await store.setJSON('_index.json', idx);
    for (const r of results) {
      try {
        await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'pulsemachine-writer-2026', id: r.id }),
        });
      } catch (e) {}
    }
  }
  console.log(JSON.stringify({ ok: true, dry: DRY, count: results.length, total_index: idx.entries.length, sample: results.slice(0, 12) }, null, 2));
})().catch((e) => { console.error('ERR', e && e.message); process.exit(1); });
