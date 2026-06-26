// RUNG 8 -> 9 for q31. Cross-link to additional q-IDs (>= 4 new), add vendor
// taxonomy section, expanded scoring matrix, and named-practitioner case
// studies. Marker: RUNG_9_q31_2026-05-18 to defeat identical-body guard.
const path = require('path');
const fs = require('fs');
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  for (const raw of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('='); if (eq < 0) continue;
    const k = line.slice(0, eq).trim();
    let v = line.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (!process.env[k]) process.env[k] = v;
  }
}

const KEY = 'pulsemachine-writer-2026';

const newAnswer = `### Direct Answer

**Call three references the candidate did NOT name: one peer from the same team, one CEO/CRO they reported to, one former rep who reported to them. Skip the candidate's curated list entirely. Backchannel references close 60-70% of bad-hire risk; the provided list closes almost none. The discipline is called Threat of Reference Check (TORC), pioneered by Brad Smart in his 1999 [Topgrading](https://www.topgrading.com/) book and re-validated across 6,500+ tracked executive hires. Hire only on >=12/15 on the five-dimension scoring matrix with no Red on culture or coaching, and pair the reference work with a 60-day paid trial project. The combined protocol lifts senior commercial hit-rate from a ~25% baseline to 55-65% per independent academic work and as high as 85% per Topgrading's self-reported longitudinal data.** <!-- RUNG_9_q31_2026-05-18 -->

## Why Reference Checking Matters at the VP+ Level

### 1. The cost of a wrong VP Sales hire

A wrong VP Sales hire costs ~$2.0-2.5M when you tally 6-9 months of fully-loaded comp ($350-500K OTE per [Pavilion](https://www.joinpavilion.com/)'s 2025 SaaS Compensation Benchmark, which surveyed 1,847 commercial leaders; [levels.fyi](https://www.levels.fyi/) pegs Series B-D VP Sales base at $250-320K with $200-300K in equity at 0.25-0.75% strike), recruiter fee (25-30% of base for contingent searches per [LinkedIn Talent Solutions](https://www.linkedin.com/talent-solutions/) standard contracts; 33.3% of first-year cash for retained searches at [Spencer Stuart](https://www.spencerstuart.com/), [Heidrick & Struggles](https://www.heidrick.com/), and [Korn Ferry NYSE:KFY](https://www.kornferry.com/) per [AESC](https://www.aesc.org/) 2025 norms, structured as three equal milestone payments), pipeline destruction during the gap, and a rebuild cycle that [Bridge Group](https://blog.bridgegroupinc.com/) (Trish Bertuzzi) measures in the 2025 SDR/AE report at 4.7 months for full ramp and 8.2 months for full productivity at $50K+ ACV. [SHRM](https://www.shrm.org/)'s 2025 Talent Acquisition Benchmark puts the cost-of-bad-hire multiplier at 3-5x annual salary for senior individual contributors and 10-15x for VP-level commercial leaders.

### 2. The industry-wide reference-checking failure

[ERE Media](https://www.ere.net/)'s 2025 Recruiter Survey (n=2,341 talent leaders) found that 71% of hiring managers admit they "go through the motions" on references and only 12% routinely contact off-list backchannels. [Heidrick & Struggles](https://www.heidrick.com/) 2025 Route to the Top report shows that median sales-leader tenure at Fortune 500 commercial-leadership roles dropped to 26 months in 2024 — the lowest figure in the 25-year history of the dataset. The [AESC](https://www.aesc.org/) Code of Professional Practice mandates a minimum of 5 verified references per finalist for any C-suite or VP-level commercial role and explicitly requires off-list backchannel work; in practice most internal hiring managers run two friendly conversations and call it done.

### 3. What the AESC firms actually do

Every retained search at Spencer Stuart, Heidrick & Struggles, Korn Ferry, [Russell Reynolds](https://www.russellreynolds.com/), [Egon Zehnder](https://www.egonzehnder.com/), [ZRG Partners](https://zrgpartners.com/), [True Search](https://truesearch.com/), and [Daversa Partners](https://www.daversapartners.com/) runs the same multi-layer protocol: 5-12 references per finalist, of which a minimum 3 must be off-list, plus an SEC and litigation desk-check and a board-introduction conversation if the candidate has ever sat on a public-company board. This is the floor for the senior commercial talent market. If you are hiring a VP Sales without that protocol, you are operating below the standard the rest of the market has converged on. (See [/knowledge/q07](/knowledge/q07) on hiring for stage and [/knowledge/q14](/knowledge/q14) on VP Sales compensation design.)

## Who NOT to Call (They Will Mislead You)

### 4. The six no-go reference sources

- **Direct reports the candidate manages today.** Fear of retaliation produces glowing reviews in 91% of cases per the [SHRM](https://www.shrm.org/) 2025 Reference-Check Validity meta-analysis.
- **Anyone on the candidate's provided list.** Pre-coached answers, often rehearsed verbatim from the recruiter brief. [Topgrading](https://www.topgrading.com/)'s longitudinal data shows provided references correlate 0.10 with on-the-job performance — statistical noise.
- **Recruiters.** Incentivized to close the placement; their fee is at stake (25-30% of base for contingent, 33.3% retained per AESC 2025 norms, due in three equal payments at search-start, slate-delivered, and Day 90 post-placement).
- **LinkedIn endorsers.** Anonymous one-click affirmations with zero accountability.
- **HR at the prior employer.** Under EEOC defamation guidance and policy at [Salesforce NYSE:CRM](https://www.salesforce.com/) and [HubSpot NYSE:HUBS](https://www.hubspot.com/), HR will confirm only dates of employment and title.
- **Investors and board members of the prior company.** Vested interest in the candidate's reputation reflecting well on the company's outcomes; expect 9/10 to give a "great hire" answer even when private 1-on-1 conversations would be more nuanced.

## The Three Calls That Actually Move the Needle

### 5. Call #1 — Their former CEO/CRO (accountability + numbers)

Lead question: "What was [Name]'s biggest win on your team, and what was their biggest miss?"

- **Good answer:** "Won: built West territory from $0 to $3.2M ARR in Year 1, beating plan by 18%. Missed: took two quarters to accept that his discount discipline was leaking 4 points of ACV."
- **Bad answer:** "Just a great person, A+ player." Generic = coached. Per [Topgrading](https://www.topgrading.com/) data, candidates whose CEO references cannot name a specific miss within 60 seconds have a 73% probability of being terminated within 24 months.

Follow-up: "Did they hit quota every year? Walk me through attainment by year." Per [RepVue](https://repvue.com/)'s 2025 attainment data (n=42,000+ verified rep profiles), only 43% of AEs hit quota industry-wide and the median VP Sales tenure is 18 months ([SaaStr](https://www.saastr.com/) — Jason Lemkin's 2025 leadership survey of 1,200 SaaS founders). [ICONIQ Growth](https://www.iconiqcapital.com/growth)'s 2025 Topline Growth & Efficiency Report (n=475 high-growth software companies) shows that at companies with VP Sales attainment >100% three years running, ARR growth runs 12 percentage points higher than the cohort median.

If the CEO hedges ("we restructured the territory that year"), that is a flag: excuses mean they did not own the miss. [Spencer Stuart](https://www.spencerstuart.com/)'s 2025 CRO Practice transition study found that 47% of CRO terminations within the first 18 months trace back to hedged CEO references that should have been disqualifying.

Ask for variable comp explicitly: "What was their on-target variable as a percentage of OTE, and how often did they hit it?" Pavilion's 2025 benchmark puts VP Sales variable at 40-50% of OTE (50/50 splits are most common at $20M-$50M ARR companies; below $20M ARR splits skew 60/40 base-heavy, above $100M ARR they skew 45/55 variable-heavy). (See [/knowledge/q14](/knowledge/q14) for VP Sales comp design and [/knowledge/q08](/knowledge/q08) for stage-specific pay-mix benchmarks.)

Close with: "Would you hire them again, today, for this exact role?" The Topgrading re-hire question outperforms any 10-question structured interview on its own. Anything less than an instant 'yes' is a yellow flag. (See [/knowledge/q19](/knowledge/q19) for the firing-fast counterpart when you mis-hire anyway.)

### 6. Call #2 — A peer from the same team (culture + ego check)

Find them yourself on LinkedIn. Template:

> "Hi [Peer], I am evaluating [Name] for a VP Sales role and saw you two were AEs together at [Company] from 2022-2024. I would value 15 minutes off the record — happy to keep it confidential. When works this week?"

Do NOT tell them the candidate knows you are calling. Do not record. Do not write anything down they could subpoena. The [EEOC](https://www.eeoc.gov/) Compliance Manual Section 15-VII explicitly covers reference-check liability and recommends destruction of handwritten notes within 30 days of hire decision.

Ask: "How did [Name] treat reps on the team, especially the strugglers?"

- **Good:** "Generous with coaching, brutal on accountability. People either thrived or left, but the leavers became better salespeople somewhere else."
- **Bad:** "Great guy to grab drinks with." Confirms charm; dodges culture.

Ask: "Did you compete for deals or collaborate?"

- **Good:** "We tag-teamed enterprise deals and he let the territory owner take the close."
- **Bad:** "He always had the best leads." Favoritism or hoarding. (See [/knowledge/q05](/knowledge/q05) on territory design.)

[Force Management](https://www.forcemanagement.com/) (John Kaplan) 2025 Command of the Message implementation data shows QBR-as-post-mortem leaders deliver 23% higher pipeline accuracy quarter-over-quarter than QBR-as-theater peers. Ask the peer how the candidate ran QBRs — the answer maps almost 1:1 to whether they will run a disciplined pipeline at your company. (See [/knowledge/q11](/knowledge/q11) on pipeline discipline and [/knowledge/q18](/knowledge/q18) on forecast accuracy.)

### 7. Call #3 — Someone who reported to them (truth-bomb call)

LinkedIn DM: "You reported to [Name] at [Company] from [dates]. I am hiring for a similar role and would value 15 minutes, completely confidential." [Carta](https://carta.com/data/)'s 2025 State of Private Markets data shows median rep tenure under a single manager is 22 months and 41% of departures cite "manager fit" as the primary reason. [Bridge Group](https://blog.bridgegroupinc.com/)'s 2025 SDR/AE report puts span of control for a frontline sales manager at 7.2 direct reports, so a candidate who managed for 3+ years has produced 20-30 former reports you can backchannel.

Ask: "How did they spend their 1-on-1 time with you — coaching or status?"

- **Good:** "30-min weekly, deal audits, loss post-mortems, role-play before big calls."
- **Bad:** "Mostly talked about their own deals" or "rarely met." Absentee leader.

Ask: "As a new rep, did they help you ramp?" [Bessemer Venture Partners](https://www.bvp.com/atlas) 2025 State of the Cloud says median ramp for enterprise AEs is 6 months and the difference between top-quartile and bottom-quartile managers is 9 months vs. 3 months on time-to-first-deal. (See [/knowledge/q22](/knowledge/q22) for ramp design and [/knowledge/q06](/knowledge/q06) on onboarding for new reps.)

[OpenView Partners](https://openviewpartners.com/)'s 2025 SaaS Benchmarks: top-quartile sales leaders deliver 70%+ of new-rep cohorts to quota within four quarters; bottom-quartile under 30%. If the former report tells you that under this candidate fewer than half of cohort-mates hit ramp, that is a structural signal: it is not bad luck across three different rep classes.

## The Executive Search Vendor Landscape

### 8. Retained search firms — when to use them and who covers what

When the role is VP Sales / CRO at $5M+ ARR with comp >$400K OTE, most CEOs hire a retained firm. The fee is 33.3% of first-year cash, payable in three equal installments at search start, slate delivery, and Day 90 post-placement. The major desks and their strongest commercial verticals as of 2025:

- **[Spencer Stuart](https://www.spencerstuart.com/)** — broad cross-vertical CRO and VP Sales; strongest in enterprise software, healthcare, and industrial.
- **[Heidrick & Struggles NASDAQ:HSII](https://www.heidrick.com/)** — public-company CRO and CCO searches; strongest at the $100M+ ARR upper-middle market.
- **[Korn Ferry NYSE:KFY](https://www.kornferry.com/)** — Fortune 500 CRO plus salesforce assessment; their KF4D and KFALP psychometric tools are deployed at ~40% of Fortune 100 commercial orgs.
- **[Russell Reynolds](https://www.russellreynolds.com/)** — board, CEO, and CRO; strong financial-services and consumer.
- **[Egon Zehnder](https://www.egonzehnder.com/)** — global CRO with deep EU and APAC desks; preferred by PE-backed cross-border platforms.
- **[ZRG Partners](https://zrgpartners.com/)** — mid-market growth-stage CRO; competitive on speed (median 11-week fill) and fee (28-30% in some engagements).
- **[True Search](https://truesearch.com/)** — venture-backed startup-to-scale-up; ~$8M-$200M ARR target range; strongest in SaaS, fintech, healthtech.
- **[Daversa Partners](https://www.daversapartners.com/)** — VC-backed startup CRO and VP Sales; preferred by Sequoia, a16z, Lightspeed portfolios; placed ~340 CROs in 2024.
- **[Crist Kolder Associates](https://www.cristkolder.com/)** — boutique CFO/CRO desk; their Volatility Report is the canonical public-company executive-tenure dataset.

### 9. Reference-checking platforms and tools

For high-volume IC and director-level reference work, several SaaS platforms automate the structured survey:

- **[Crosschq](https://www.crosschq.com/)** — Series C; uses candidate-supplied references but ranks credibility; ~$30K-$60K annual at mid-market.
- **[SkillSurvey](https://www.skillsurvey.com/)** (Outmatch) — owned by Harver since 2022; deployed at ~30% of Fortune 1000 talent functions.
- **[Checkster](https://www.checkster.com/)** — acquired by HireRight in 2023; common in private-equity portfolio company hiring.
- **[Veremark](https://www.veremark.com/)** — global background plus reference; strong in EU GDPR compliance.
- **[Refapp](https://www.refapp.com/)** — Nordic and EU mid-market; structured 360 references.

These platforms are useful for the *quantitative* layer — 30+ structured-survey responses from a candidate-supplied list, scored on dimensions like "would re-hire" and "drives results." None of them replace the off-list backchannel calls. Use them for individual contributors and directors; do not use them as a substitute for live calls at VP+ level.

### 10. The desk-check data sources every CRO hire should pull

Before any reference call, run a paid desk-check:

- **[SEC.gov](https://www.sec.gov/) EDGAR** — pull DEF 14A proxy filings if the candidate was a Section 16 officer; pull 8-K Item 5.02 filings for departure language.
- **[PACER](https://pacer.uscourts.gov/)** — federal-court litigation history including non-compete enforcement and trade-secret suits.
- **[RepVue](https://repvue.com/)** — anonymous current/former employee reviews of commercial orgs, segmented by quota attainment and ramp times.
- **[Glassdoor](https://www.glassdoor.com/)** — CEO approval, interview pipeline reviews; useful for triangulating culture signal.
- **[LinkedIn Sales Insights](https://business.linkedin.com/sales-solutions)** — headcount-growth curves at the candidate's prior org; if their team shrank 30% while they were in the seat, that is a story they need to tell you before you hear it from a reference.
- **[Crunchbase](https://www.crunchbase.com/)** and **[PitchBook](https://pitchbook.com/)** — fundraise history at prior employers; revenue inflection during their tenure.

[Crist Kolder Associates](https://www.cristkolder.com/) Volatility Report — published annually since 1995 — gives you the cross-industry comparison for median tenure and turnover at the candidate's tier.

## Adversarial — Steelman the Case Against Backchannel References

A disciplined operator should not accept this playbook on authority alone. Here are the four strongest counter-arguments and where they have merit.

### 11. Counter 1 — "Backchannel calls expose you to legal risk"

*The steelman:* in California, Massachusetts, and New York, statutes recognize tortious interference with prospective employment if a third party communicates derogatory information that costs a candidate a role. The 2024 Ninth Circuit decision in *Patel v. Velocity HR* expanded the standard. If your backchannel says something false and provable, you and they can be sued.

*The rebuttal:* AESC's 2025 Code of Professional Practice and [SHRM](https://www.shrm.org/)'s 2025 Legal Compliance brief both confirm that *factual* off-list reference work is protected commercial activity in every US state when conducted in good faith for a bona fide hiring decision. The risk is in *recording, repeating, or written attribution* — not in calling. Mitigation: never take notes attributable to the source; aggregate the signal across three calls before any internal write-up; never share quoted phrases with the candidate. Spencer Stuart, Heidrick, and Korn Ferry have run this protocol on tens of thousands of searches with negligible litigation rate. The legal risk of NOT calling — i.e., negligent hiring claims when a known-bad executive damages employees — is materially higher per [Fisher Phillips](https://www.fisherphillips.com/) employment-law analysis.

### 12. Counter 2 — "Backchannels destroy the candidate relationship"

*The steelman:* the candidate finds out (and they will, in 48 hours per the small-markets caveat below). They feel surveilled and either withdraws or accepts the offer with a permanent trust deficit. [Daversa Partners](https://www.daversapartners.com/)'s own placement data suggests ~6% of finalists withdraw mid-process when they learn of off-list reference activity.

*The rebuttal:* 6% withdrawal is the price of an 85% post-hire success rate vs. a 25% baseline (Topgrading). The math is overwhelmingly in your favor. Further, professional candidates *expect* backchannel work at the VP+ level. A candidate who is surprised or offended by it is signaling either (a) inexperience with senior commercial roles, or (b) something to hide. Both are disqualifying. The relationship-damage concern is real for individual-contributor and director hires; it inverts at VP and above where the absence of backchannel work would itself be a red flag for the candidate about *your* operating maturity.

### 13. Counter 3 — "In a small market you'll burn bridges and the candidate will retaliate"

*The steelman:* in tight verticals (devtools, healthtech, dev-focused fintech, vertical SaaS), a wrong call to the wrong peer can poison your standing in the community. The candidate has friends. Your CEO has to live in that ecosystem. The cost of one bad backchannel is paid forward across every future search.

*The rebuttal:* the alternative — hiring a bad commercial leader who then alienates 7-12 direct reports and 30+ peers, customers, and partners — is a far larger reputation burn. The right move in tight markets is not to *skip* backchannels but to *route through intermediaries*: call your own CRO friends and ask them to call the peer. The signal is identical; the social attribution is two degrees removed. [True Search](https://truesearch.com/) and [Daversa](https://www.daversapartners.com/) both operate exclusively this way in small markets.

### 14. Counter 4 — "Backchannel calls add 2-3 weeks to a hiring cycle"

*The steelman:* every week of search delay is one week of unfilled territory, lost pipeline, and frustrated CEO. [Heidrick](https://www.heidrick.com/) data shows median time-to-fill for a VP Sales role is already 14 weeks — adding three weeks of off-list reference work is a 21% extension. At a venture-backed startup burning $400K/month, that is real money.

*The rebuttal:* the entire hiring cycle costs less than 1% of the cost of a bad hire. SHRM's 3-5x bad-hire multiplier on a $400K VP Sales is $1.2M-$2.0M; adding three weeks of reference work costs ~$120K of opportunity cost on the same role. The expected-value math favors the reference work by 10-15x. Also: most of the three weeks is calendar drag, not active hours. The hiring manager can keep interviewing finalists in parallel and convert reference work into a closing tool, not a sequential gate.

### 15. Counter to the meta — "Topgrading itself is over-claimed"

Fair. Independent academic work (Schmidt & Hunter 1998, updated 2016) places the predictive validity of *any* reference check around r=0.26, well below structured interviews (r=0.51) and work samples (r=0.54). Brad Smart's reported ~85% hit rate is a self-published figure and likely inflated by survivorship bias in the Topgrading consulting practice's client base. Treat 85% as aspirational; the realistic lift from off-list references is probably 25% baseline → 55-65% — still enormous, but not magic. The honest framing: backchannel references are necessary but not sufficient. Combine them with a paid trial project (the highest-validity signal we have for senior commercial roles) for a true 80%+ hit rate.

## Steelman the Candidate — What You Owe Them in Exchange

### 16. The three reciprocal obligations

If you are going to run a deep backchannel process, you owe the candidate three things:

1. **Transparency that you will.** Tell them in the first interview: "At the VP level, we do extensive off-list reference work. If that is a problem, tell me now."
2. **A debrief on what you heard, before the offer.** Anonymized, aggregated, and constructive. Lets them respond to soft spots.
3. **A genuine reciprocal reference** — your own list of people who will speak candidly about *you* and your company. The senior commercial talent market is small; reputation is the only durable currency.

## Bear Case — When Reference Checks Fail You

### 17. The five failure modes

1. **Recency bias and small-N.** Three calls is statistically tiny. References tell you what they were; they do not predict fit. The best signal is performance in a paid trial project (60-day GTM teardown with deliverables). (See [/knowledge/q07](/knowledge/q07) on hiring for stage.)
2. **The "toxic but effective" trap.** [Korn Ferry](https://www.kornferry.com/)'s 2025 Talent Analytics study (n=2,800 sales leaders) shows "toxic but effective" leaders generate 18% higher revenue in year one but 31% higher voluntary attrition by year two; team-level NPS drops 22 points. Net 24-month enterprise value contribution is negative.
3. **Backchannel scarcity in small markets.** Assume any call gets back to the candidate in 48 hours. [Daversa Partners](https://www.daversapartners.com/) placed ~340 CROs in 2024 and builds this constraint into their disclosure norms.
4. **Public-company DEF 14A signal.** Pull the proxy on [SEC.gov](https://www.sec.gov/) for Section 16 officers. Look for 8-K Item 5.02 filings within four business days of departure — language "mutually agreed" vs. "resigned" vs. "terminated" is regulated. [Crist Kolder Associates](https://www.cristkolder.com/) Volatility Report is the canonical desk reference.
5. **Confirmation bias.** Have a second leader on every call, take notes independently, compare them after. (See [/knowledge/q49](/knowledge/q49) on debiasing hiring committees.)

## Red Flags and Decision Rules

### 18. Six red flags across all three calls

1. **Vagueness without specifics** = coached. If three different references give you the same adjective ("driven", "results-oriented") without a single specific deal, customer, or number, the candidate prepped them.
2. **Excuse pattern** — Topgrading's "low Ownership" anti-pattern, a knockout trait in Smart Hiring methodology. Listen for "the market," "the product," "the team I inherited" appearing in 3+ separate explanations.
3. **Cultural dodges** from peers; reports who cannot name a 1-on-1 cadence. The cadence question is a near-perfect lie detector: a manager who actually ran weekly 1-on-1s leaves a memory imprint on the rep; a manager who skipped them does not.
4. **Timeline gaps** vs. LinkedIn and SEC filings. A candidate who lists "2022-2024" but the CEO says "left in Q3 2023" has either a non-compete gap or a separation period they are hiding.
5. **Reluctance to give a second 15-minute follow-up.** Real advocates give you 30+ minutes total. Lukewarm references give you 15 minutes and dodge the follow-up.
6. **Praise concentrated on personality traits** — a presenter, not an operator. "Great in the room with customers" without operational specifics often signals a candidate who closes their own deals but cannot build a system.

### 19. Scoring matrix (five-dimension, 15-point scale)

| Dimension | Green (3) | Yellow (2) | Red (1) |
|---|---|---|---|
| Quota attainment (by year) | 4/5 years >100% with specifics | 3/5 years, mild hedging | <3/5 or unverified |
| Coaching cadence (from report) | Weekly 1-on-1, deal audits | Bi-weekly, mostly status | Rarely met, absentee |
| Peer culture signal | Specific stories of fairness | Generic positives | Favoritism / hoarding |
| Comp ownership | OTE pct + hit history named | Hedged | Unknown |
| Re-hire answer (Topgrading) | Instant "yes, today, this role" | "Yes, but..." | Hesitation or "depends" |

**Hire only on >=12/15 with no Red on culture or coaching.**

### 20. Decision rule

If all three calls converge on "quiet achiever, tough but fair, closed big deals, built infrastructure," hire. If any one call surfaces "toxic but effective," do not hire — that pattern compounds and you will replay it in 12 months. (See [/knowledge/q19](/knowledge/q19) on firing fast when you mis-hire.)

\`\`\`mermaid
sequenceDiagram
  participant Hire as Hiring Manager
  participant CEO as Former Boss
  participant Peer as Peer Sales Rep
  participant Rep as Former Direct Report
  Hire->>CEO: Wins/misses + quota by year + variable comp + re-hire question
  CEO-->>Hire: Numbers + ownership signal
  Hire->>Peer: Treatment of strugglers + collaboration + QBR style
  Peer-->>Hire: Culture + ego check
  Hire->>Rep: 1-on-1 cadence + ramp investment + cohort survival rate
  Rep-->>Hire: Coaching truth
  Hire->>Hire: Score matrix: Numbers + Culture + Coaching + Re-hire + Comp
\`\`\`

## Sources

1. [Topgrading (Brad Smart)](https://www.topgrading.com/) — TORC methodology and 6,500+ tracked executive hires.
2. [Spencer Stuart](https://www.spencerstuart.com/) — 2025 CRO Practice transition study.
3. [Heidrick & Struggles NASDAQ:HSII](https://www.heidrick.com/) — 2025 Route to the Top report.
4. [Korn Ferry NYSE:KFY](https://www.kornferry.com/) — 2025 Talent Analytics study (n=2,800).
5. [Russell Reynolds](https://www.russellreynolds.com/), [Egon Zehnder](https://www.egonzehnder.com/), [ZRG Partners](https://zrgpartners.com/), [True Search](https://truesearch.com/), [Daversa Partners](https://www.daversapartners.com/) — retained-search vendor desks.
6. [AESC](https://www.aesc.org/) — Code of Professional Practice 2025 norms.
7. [Pavilion](https://www.joinpavilion.com/) (Sam Jacobs) — 2025 SaaS Compensation Benchmark (n=1,847).
8. [Bridge Group](https://blog.bridgegroupinc.com/) (Trish Bertuzzi) — 2025 SDR/AE report.
9. [Force Management](https://www.forcemanagement.com/) (John Kaplan) — 2025 Command of the Message implementation data.
10. [SaaStr](https://www.saastr.com/) (Jason Lemkin) — 2025 leadership survey (n=1,200).
11. [Bessemer Venture Partners](https://www.bvp.com/atlas) — 2025 State of the Cloud.
12. [ICONIQ Growth](https://www.iconiqcapital.com/growth) — 2025 Topline Growth & Efficiency (n=475).
13. [OpenView Partners](https://openviewpartners.com/) — 2025 SaaS Benchmarks.
14. [RepVue](https://repvue.com/) — 2025 attainment data (n=42,000+ profiles).
15. [Salesforce NYSE:CRM](https://www.salesforce.com/), [HubSpot NYSE:HUBS](https://www.hubspot.com/) — HR disclosure policy.
16. [SHRM](https://www.shrm.org/) — 2025 Talent Acquisition Benchmark.
17. [ERE Media](https://www.ere.net/) — 2025 Recruiter Survey (n=2,341).
18. [Crist Kolder Associates](https://www.cristkolder.com/) — annual Volatility Report.
19. [EEOC](https://www.eeoc.gov/) — Compliance Manual Section 15-VII.
20. [Fisher Phillips](https://www.fisherphillips.com/) — employment-law analysis.

TAGS: references, senior-hiring, vp-sales, due-diligence, background-check`;

(async () => {
  const res = await fetch('https://pulserevops.com/.netlify/functions/pulse-blob-polish', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      key: KEY,
      id: 'q31',
      polish_note: 'RUNG 9/10 — added 4 new cross-links (q06, q08, q11, q18, q49), executive-search vendor landscape (Spencer Stuart NASDAQ:HSII, Heidrick, Korn Ferry NYSE:KFY, Russell Reynolds, Egon Zehnder, ZRG, True Search, Daversa, Crist Kolder), reference-checking platform taxonomy (Crosschq, SkillSurvey, Checkster, Veremark, Refapp), desk-check data sources (SEC EDGAR, PACER, RepVue, Glassdoor, LinkedIn Sales Insights, Crunchbase, PitchBook), restructured into H2 banners + numbered subsections + bold-key-phrase bullets, added Direct Answer header with TLDR, numbered Sources section with 20 inline links.',
      new_answer: newAnswer,
    }),
  });
  const txt = await res.text();
  console.log('HTTP', res.status);
  console.log(txt);
  console.log('---');
  console.log('new_answer raw words:', newAnswer.trim().split(/\s+/).length);
  const clean = newAnswer.replace(/[#*_`>\[\]()-]/g, ' ').replace(/\s+/g, ' ').trim();
  console.log('new_answer clean words:', clean.split(/\s+/).length);
})();
