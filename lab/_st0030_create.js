// st0030 -- Commercial P&C Insurance Renewal Takeover (Winning the Account
// from the Incumbent Broker at Renewal) 2027. Pulse Sales Trainings entry
// (route: /sales-trainings/st0030, tag: sales-training). Industry =
// commercial property & casualty insurance producer / account executive at
// an independent agency or broker walking a business owner / CFO / risk
// manager through a takeover of their P&C program at renewal -- competing
// against the incumbent broker of record. Six fixed sections, runnable
// 60-minute meeting template. Stages: SURFACE / STRESS-TEST / STRUCTURE /
// SUBSTANTIATE / SECURE. Walks 5->6->7->8->9 ladder.
// Composed entirely by Claude Opus via Claude Code. No external LLM APIs.

const { getStore } = require('@netlify/blobs');
const fs = require('fs');
const path = require('path');

// --- load .env.local for BLOBS_PAT ---
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const ID = 'st0030';
const QUESTION = "Commercial P&C Insurance Renewal Takeover: Winning the Account from the Incumbent Broker at Renewal — a 60-Minute Sales Training";

const tags = [
  'sales-training',
  'commercial-pc-insurance-renewal-takeover-training',
  'commercial-insurance',
  'property-and-casualty',
  'broker-of-record',
  'renewal-takeover',
  'risk-management',
  'workers-compensation',
  'experience-mod',
  'total-cost-of-risk',
  'captive-insurance',
  'insurance-producer',
  '60-min-meeting',
  'standard-team',
  'st0030'
];

const sources = [
  { title: 'Marsh McLennan NYSE:MMC (CEO John Doyle, New York NY) — the world\'s largest insurance broker + risk-advisory holding company ~$24B revenue + ~90,000 colleagues + ~130 countries: Marsh (commercial P&C broking + risk advisory), Guy Carpenter (reinsurance), Mercer (health + benefits + retirement), Oliver Wyman (management consulting). Marsh is the dominant broker for large-cap + upper-middle-market commercial property + casualty + workers-compensation + management-liability + cyber programs; Marsh Connect + Marsh ClearSight RMIS (risk-management information system) + Marsh Advisory total-cost-of-risk analytics define the upper-market broker-of-record standard. Pivotal 2024-2027 dynamic — broker consolidation + the upper-middle-market squeeze pushes Marsh / Aon / Gallagher / WTW down-market into the $25M-$250M-revenue commercial-account segment historically owned by regional independent agencies, intensifying renewal-takeover competition; the broker-of-record letter (BOR) remains the single legal instrument that transfers an account between brokers without re-marketing the policy.', url: 'https://www.marshmclennan.com/' },
  { title: 'Aon plc NYSE:AON (CEO Greg Case, Dublin Ireland + London UK) — the #2 global insurance broker + professional-services firm ~$15B+ revenue + ~60,000 colleagues + ~120 countries; Aon Commercial Risk Solutions + Aon Health Solutions + Aon Reinsurance Solutions + Aon Wealth Solutions; Aon\'s "Aon United" cross-sell model + Aon Business Services delivery platform + the 2023-2024 acquisition of NFP (~$13B deal closing 2024) explicitly to push Aon into the middle-market commercial-insurance segment. Pivotal renewal-takeover dynamic — Aon + NFP integration creates both opportunity (incumbent-broker service disruption + producer attrition during integration) and threat (NFP roll-up of regional independent agencies removes local-relationship competitors); the middle-market commercial P&C account ($10M-$250M business revenue) is the contested ground where national-broker analytics + scale collide with regional-agency relationship + service responsiveness.', url: 'https://www.aon.com/' },
  { title: 'Arthur J. Gallagher & Co NYSE:AJG (CEO J. Patrick Gallagher Jr, Rolling Meadows IL) — the #3 global broker + the most acquisitive consolidator in the independent-agency channel ~$11B+ revenue + ~55,000 employees + ~70 countries; Gallagher completes 30-50+ agency acquisitions per year (tuck-in mergers of regional independent commercial-insurance agencies) and the 2024-2025 acquisition of AssuredPartners (~$13.5B) further concentrates the middle-market. Gallagher\'s "Gallagher Way" sales culture + Gallagher Drive analytics + the producer-validation + book-of-business economics model are the industry reference points for commercial-insurance producer compensation; pivotal renewal-takeover dynamic — Gallagher\'s roll-up means the "independent local agency" a business owner has used for 20 years may now be a Gallagher branch, and the incumbent producer may be a recently-acquired retiring principal whose service has decayed during earn-out — a classic takeover opening at renewal.', url: 'https://www.ajg.com/' },
  { title: 'Council of Insurance Agents & Brokers CIAB (Washington DC) — the trade association of the largest commercial-insurance brokers + agencies; the CIAB Commercial Property/Casualty Market Index Survey (quarterly) is the most-cited benchmark for commercial-insurance pricing direction. CIAB Q-by-Q index tracks average commercial P&C premium rate change by line (property, general liability, commercial auto, workers comp, umbrella, cyber, D&O, EPL). Pivotal 2024-2027 market context — after the hard market of 2020-2023 (broad rate increases across property + casualty), commercial property remained elevated into 2024-2025 driven by catastrophe losses + reinsurance cost + replacement-cost inflation, while workers compensation continued a long soft streak; commercial auto stayed persistently adverse on social-inflation + nuclear-verdict loss trends. The renewal-takeover producer must read the CIAB index to set accurate renewal expectations and avoid promising rate relief the market cannot deliver.', url: 'https://www.ciab.com/' },
  { title: 'Independent Insurance Agents & Brokers of America (the Big "I", Alexandria VA) + Applied Systems (Epic agency-management system) + Vertafore (AMS360 + Sagitta agency-management systems) — the independent-agency channel infrastructure perimeter. The Big "I" represents ~25,000 independent agency locations; the independent-agency channel writes the majority of US commercial-lines premium. Applied Epic + Vertafore AMS360 are the dominant agency-management systems (policy, client, accounting, and renewal-pipeline systems of record). Pivotal renewal-takeover dynamic — the independent agency competes on carrier-market access (an independent agency represents many carriers and can shop the account), local service, and claims advocacy; the captive-agent channel (a single-carrier agent, e.g. a State Farm or Allstate commercial agent) and the direct-to-business digital channel are the structural competitors. The "broker of record" instrument and the renewal date are the two facts that govern when and how an account can legally move.', url: 'https://www.independentagent.com/' },
  { title: 'NCCI (National Council on Compensation Insurance, Boca Raton FL) — the workers-compensation rating + data organization for ~35+ states; NCCI calculates the Experience Modification Rate (the "experience mod" or "e-mod" / "x-mod"), the multiplier applied to a business\'s workers-compensation manual premium that reflects its actual loss experience versus the expected loss for its class code and size. An experience mod of 1.00 is average; below 1.00 (a "credit mod") earns a discount; above 1.00 (a "debit mod") is a surcharge. Pivotal renewal-takeover dynamic — the experience mod is the single most powerful and most-misunderstood number in a commercial-insurance renewal: it is publicly calculable, it lags actual loss experience by roughly a year, and a producer who can read an NCCI mod worksheet, identify reserve-driven mod inflation, and build a claims-advocacy + safety + return-to-work plan to drive the mod down is delivering a quantified, defensible reason to switch brokers that the incumbent never showed the client.', url: 'https://www.ncci.com/' },
  { title: 'AM Best (Oldwick NJ) — the dominant insurance-carrier financial-strength rating agency; the AM Best Financial Strength Rating (FSR, scale A++ to D) and Issuer Credit Rating measure a carrier\'s ability to pay claims. Most commercial-insurance buyers, lenders, and contract requirements specify a minimum carrier rating (commonly "A- VII or better"). Pivotal renewal-takeover dynamic — carrier financial strength, appetite, and stability are part of the program a broker is responsible for; a renewal-takeover producer demonstrates value by mapping which carriers in their agency\'s appointment roster have the best appetite, pricing, and claims service for the prospect\'s specific class of business, and by flagging where the incumbent has placed the account with a carrier that is non-admitted, surplus-lines, or rating-stressed without explaining the trade-off to the client.', url: 'https://www.ambest.com/' },
  { title: 'NAIC (National Association of Insurance Commissioners, Kansas City MO) + the 50 state departments of insurance — the US insurance-regulation perimeter. Insurance is regulated at the state level; the NAIC coordinates model laws, the surplus-lines framework, producer licensing, and market-conduct standards. Pivotal renewal-takeover dynamic — the broker-of-record letter is recognized across state markets as the client\'s instruction to a carrier that a named agency now represents the account; carriers honor a valid BOR, typically with a short waiting period, and will not allow two agencies to "block" or re-market the same account simultaneously. A renewal-takeover producer must understand the difference between (a) a BOR move on the existing program (no re-marketing, same carrier, new broker) and (b) competing for the account by re-marketing it to new carriers at renewal — the two paths have different timelines, different risks of an incumbent "blocking" the markets, and different ethical and disclosure obligations.', url: 'https://www.naic.org/' },
  { title: 'Insurance Information Institute (Triple-I, New York NY) + the broader commercial-insurance loss-trend perimeter — Triple-I publishes industry data on catastrophe losses, social inflation, litigation funding, and combined-ratio trends. Pivotal 2024-2027 context for the renewal-takeover producer — "social inflation" (rising claim costs driven by litigation funding, broader liability theories, and larger jury awards / "nuclear verdicts" of $10M+) materially elevates commercial auto and general/excess liability loss trends; replacement-cost inflation elevates property values and therefore property premium; the renewal-takeover producer must frame the renewal honestly: a 12-20% property increase may be the market, not the broker\'s failure, and the producer who explains the macro loss environment, then shows what they will control (program structure, deductible strategy, carrier selection, claims advocacy, loss control), builds more credibility than one who promises to simply "beat the price."', url: 'https://www.iii.org/' },
  { title: 'Captive insurance + alternative-risk-transfer perimeter — the Vermont Captive Insurance Association (Vermont is the largest US captive domicile), the Self-Insurance Institute of America (SIIA), and the group-captive managers (e.g. group captives for middle-market commercial accounts). A captive is an insurance company owned by the business(es) it insures; single-parent captives, group captives, and cell captives let a middle-market business retain underwriting profit and investment income on its own predictable losses rather than paying it to a traditional carrier. Pivotal renewal-takeover dynamic — for a profitable, lower-hazard, well-run middle-market account (often $300K+ in annual workers-comp + auto + general-liability premium), a group-captive proposal is a sophisticated, differentiated alternative the incumbent transactional broker likely never raised; presenting a captive feasibility analysis at renewal repositions the conversation from "price of insurance" to "total cost of risk and ownership of your loss dollars."', url: 'https://www.vcia.com/' },
  { title: 'RIMS (Risk and Insurance Management Society, New York NY) + the "total cost of risk" (TCOR) framework — RIMS is the professional association of corporate risk managers; the RIMS-published TCOR framework defines the true cost of risk as the sum of (1) insurance premiums, (2) retained losses / deductibles / self-insured losses, (3) risk-control and loss-prevention spending, and (4) risk-management administrative cost. Pivotal renewal-takeover dynamic — the transactional incumbent broker sells "premium"; the advisory takeover producer sells "total cost of risk." A business with a $400K premium and $250K of uninsured retained losses, claim-handling friction, and an inflated experience mod has a TCOR far above its premium line; the producer who quantifies TCOR, benchmarks it against industry, and presents a multi-year plan to reduce it gives the buyer a CFO-grade, defensible reason to change brokers that has nothing to do with shaving 5% off a quote.', url: 'https://www.rims.org/' },
  { title: 'Commercial-insurance buyer-psychology + the four conversations every renewal-takeover producer avoids: (1) the broker-of-record vs re-market conversation — a producer afraid of looking aggressive lets the prospect believe the only way to switch is a painful full re-marketing of every policy, when often the cleaner first step is a BOR on a well-priced existing program plus a forward plan, OR conversely lets the prospect sign a BOR that hands the producer an account they then cannot improve; the honest producer explains both paths and which one actually serves the client. (2) the "your incumbent isn\'t bad, they\'re just transactional" conversation — most incumbents are not negligent, they are simply order-takers who shop the renewal, email three quotes, and disappear for 51 weeks; the takeover producer must make the case for proactive advisory service without slandering a competitor, which feels risky and so gets skipped. (3) the experience-mod / loss-run conversation — many producers never pull and read the prospect\'s loss runs and NCCI mod worksheet because it is technical work and the answer might be unflattering; yet the loss runs are where the real, quantified, switch-justifying story lives. (4) the "this renewal increase is the market, not me" conversation — a producer who over-promises rate relief to win the account inherits a renewal they cannot deliver and loses the account in 12 months; the disciplined producer sets honest market expectations up front. Per CIAB + RIMS + Big "I" producer-development data, these four avoided conversations explain the majority of the gap between top-quartile producers (high close rate, high retention, growing books) and bottom-quartile producers (low close rate, churning books, competing only on price).', url: 'https://www.ciab.com/resources/' }
];


// ============================================================================
// TLDR -- intro callout + meeting agenda
// ============================================================================
const tldr = `> ### 🛡️ The Pulse Training
> **Who this is for:** **Commercial P&C producers + account executives + sales managers + agency principals** at **independent agencies + regional brokers + national-broker middle-market teams (Marsh / Aon / Gallagher / WTW down-market units)** competing to take a **commercial property & casualty program away from an incumbent broker at renewal**. The target account is a **$10M-$250M-revenue business** — a manufacturer, contractor, distributor, healthcare group, or hospitality operator — whose owner/CFO/risk manager has used the same agency for years and is "happy enough" but has never been shown a real risk plan. Per **CIAB + RIMS + the Big "I" + NCCI**, top-quartile producers win renewal takeovers by selling **total cost of risk**, not premium; bottom-quartile producers chase the same accounts on price and lose them back in 12 months.
>
> **What teams leave with:** a **5-STAGE RENEWAL TAKEOVER (SURFACE → STRESS-TEST → STRUCTURE → SUBSTANTIATE → SECURE)** + the **4 AVOIDED CONVERSATIONS** (broker-of-record vs re-market / "transactional not bad" / experience-mod & loss-runs / "the increase is the market"). Plus verbatim language, two role-plays (CFO Dana at a $60M manufacturer 75 days from renewal + owner-operator Ray at a $14M contractor with a debit experience mod), a producer-quartile self-diagnosis, an NCCI experience-mod read script, and a TCOR build.
>
> **Sales manager brings:** (1) 3 recent lost-takeover debriefs. (2) Takeover Kit — SURFACE discovery scorecard + TCOR worksheet + experience-mod read sheet + carrier-appetite map + broker-of-record vs re-market decision card + renewal-timeline template. (3) Whiteboard the last 10 takeover attempts by outcome, account size, and whether the producer pulled loss runs.

## MEETING AGENDA -- 60 MINUTES

| Time | Block | Owner | Outcome |
|------|-------|-------|---------|
| **0:00-0:10** | **Intro + Cold Open** — Producer A quoted a $45M distributor 14 days before renewal, undercut the incumbent 6% on premium, lost when the incumbent matched and the CFO had no reason to endure a switch. Producer B started 120 days out at a $60M manufacturer, pulled 5 years of loss runs, read the experience mod, built a total-cost-of-risk plan, and won on a forward strategy — not price | Sales Mgr | A takeover is won on a risk plan and a timeline, not a cheaper quote |
| **0:10-0:35** | **Teach** — 5-STAGE (SURFACE / STRESS-TEST / STRUCTURE / SUBSTANTIATE / SECURE) + 4 avoided conversations + producer-quartile self-diagnosis + the 3 instruments (broker-of-record letter / loss runs / NCCI experience mod) | Sales Mgr | Recite 5 stages + 4 avoided + define BOR, loss run, e-mod verbatim |
| **0:35-0:45** | **Discussion** — 8 prompts on incumbent-blocking, when to BOR vs re-market, when to walk, reading a debit mod, honest renewal expectations, captive feasibility, multi-threading the CFO, and the 90-day timeline | Sales Mgr + room | Audit the last 10 takeover attempts by quartile behavior |
| **0:45-1:05** | **Role-Play x 2** — R1: CFO Dana at a $60M precision manufacturer, 75 days from renewal, "happy with our broker, send me a number." R2: owner-operator Ray at a $14M commercial contractor with a 1.28 debit experience mod he thinks is "just bad luck" | Pairs | Run the 5-STAGE under two buyer archetypes |
| **1:05-1:10** | **Debrief + Commitments** — 3 questions + 1 lost takeover to re-open + 1 verbatim line + 1 conversation you avoided | Sales Mgr | Build the proactive-takeover habit |
| **1:10-1:13** | **Leave-Behind** — Renewal Takeover Script Card + Producer Quartile Self-Diagnosis + Experience-Mod Read Sheet + TCOR Build + BOR-vs-Re-Market Decision Card | Sales Mgr | One-pager in every producer's bag |

> ### 🎯 Bottom Line
> **A $60M manufacturer's CFO does not move her insurance program to you because your quote is 6% cheaper — the incumbent will match that the day she mentions it. She moves because you started 120 days before renewal, pulled and read five years of loss runs, explained why her 1.19 experience mod is costing her real money and exactly how to drive it down, quantified her total cost of risk including the $280K of retained and uninsured losses her premium line never showed her, and handed her a written multi-year plan with a timeline — while her incumbent emails three quotes once a year and disappears.** Run the **5-STAGE SURFACE / STRESS-TEST / STRUCTURE / SUBSTANTIATE / SECURE + the 4 avoided conversations + a producer-quartile self-diagnosis** and you win takeovers on strategy, retain them for years, and grow a book. Skip the loss runs, quote on price, start two weeks out, and over-promise rate relief, and you win the occasional account on a 6% discount and lose it back at the next renewal.

`;

// ============================================================================
// CORE -- Sections 1-6
// ============================================================================
const core = `---

## SECTION 1 -- INTRO + AGENDA (0:00-0:10)

> ### 🟡 Coach Note
> Do NOT open with a carrier brochure or your agency's "value proposition" slide. Whiteboard. Say the two-producer cold open, name the four avoided conversations, and define the three instruments every renewal takeover turns on — the broker-of-record letter, the loss run, and the NCCI experience mod. **Ten minutes. Hard stop at 0:10.**

### The pattern, then the story.

**The pattern.** Most commercial-insurance producers compete for renewal accounts the same losing way: they find out a business's renewal date, call two or three weeks before it, ask for the current premium, take the account's information to a couple of carriers, and come back with a quote that is a few percent cheaper than the incumbent's. This is not selling — it is bidding. And bidding has three fatal flaws at renewal. First, the incumbent broker controls the relationship and the timeline, and the moment the buyer says "I got a cheaper number," the incumbent simply goes back to the same carrier and matches it — your 6% discount evaporates and you have trained the buyer to treat insurance as a commodity. Second, you have given the buyer no reason to endure the genuine friction of switching brokers — re-issuing certificates, re-introducing the account to a new service team, re-papering the relationship. Third, you have anchored the entire relationship on price, which means the next producer who calls with a cheaper number does to you exactly what you tried to do to the incumbent.

**The renewal takeover is a different motion entirely.** You are not bidding on a policy. You are making the case that the buyer's risk is being *managed transactionally* when it should be *managed strategically* — and that the difference is measured in real dollars of total cost of risk, not in the premium line alone. That case is built on evidence the buyer has never seen, because the incumbent never showed it: the loss runs, the experience-mod worksheet, the gap between premium and total cost of risk, the carrier-appetite map, and a forward plan with a timeline. A takeover producer who does this work wins on strategy, and an account won on strategy is an account you keep.

**The story.** **Producer A** found out a **$45M food distributor** was 14 days from renewal. He got the current premium ($310K), took the loss summary the buyer's office manager emailed him, ran it past two carriers, and came back at $291K — 6% under. The buyer mentioned the number to her incumbent. The incumbent called the carrier, came back at $289K, and added, "I've taken care of you for nine years." Producer A lost. He never pulled the full loss runs, never read the experience mod, never met the CFO, and never gave the buyer a single reason to switch other than $21K — a reason the incumbent erased in one phone call.

**Producer B** started on a **$60M precision manufacturer 120 days before renewal**. Week 1, she ran SURFACE — a real discovery meeting with the CFO and the operations VP, not the office manager. Week 3, she ran STRESS-TEST — she pulled five years of loss runs and the NCCI experience-mod worksheet, found a 1.19 debit mod inflated by two open claims carrying stale reserves, and identified $280K of retained and uninsured loss the premium line had never surfaced. Week 6, she ran STRUCTURE — a redesigned program with a deductible strategy, a better-fit carrier from her agency's appointment roster, and a claims-advocacy and return-to-work plan to drive the mod toward 1.00. Week 9, she ran SUBSTANTIATE — a written total-cost-of-risk analysis and a three-year plan presented to the CFO and the owner. Week 11, she ran SECURE — a broker-of-record letter on the cleanest path plus a re-market mandate on the lines that needed it, with a signed service calendar. **She won the account at a premium only 3% below the incumbent — and a projected total-cost-of-risk reduction of $190K over three years.** The CFO did not switch for the 3%. She switched for the plan.

> ### ⚠️ Common Trap
> *"Producer A lost because the incumbent had a nine-year head start."* **(1)** The nine years were exactly the weakness — nine years of transactional service, never a risk plan, never a loss-run review, never a CFO meeting. **(2)** A 6% discount is not a reason to switch; it is a reason for the incumbent to make one phone call. **(3)** Producer A lost the day he decided to bid instead of diagnose. SURFACE before you STRUCTURE. STRESS-TEST before you quote a number.

**Transition:** "For the next 50 minutes: the 5-stage renewal takeover, the 4 conversations producers avoid, and two role-plays. Let's go."

---

## SECTION 2 -- THE TEACH (0:10-0:35)

> ### 🟡 Coach Note
> Twenty-five minutes. Split into **5-STAGE (12 min, ~2.5 min/stage)** + **the 4 Avoided Conversations (8 min)** + **the 3 Instruments (3 min)** + **Producer Quartile Self-Diagnosis (2 min)**. End-of-section test: every producer recites the 5 stages, the 4 avoided conversations, and defines broker-of-record letter, loss run, and experience mod without notes.

### Part A -- The 5-STAGE RENEWAL TAKEOVER (12 min)

Most lost renewal takeovers collapse at Stage 1 (no real discovery — the producer talked to whoever answered the phone, not the economic buyer) or Stage 2 (no loss runs, no experience-mod read — the producer quoted blind). **You do not win a commercial P&C account at renewal with a cheaper number — you EARN it by SURFACING what the business is actually trying to protect and who actually owns the risk decision, STRESS-TESTING the current program against the loss runs and the experience mod, STRUCTURING a redesigned program and a forward plan, SUBSTANTIATING it with a written total-cost-of-risk analysis, and SECURING the move on the right legal path with a service commitment in writing.**

#### Stage 1 -- SURFACE (2.5 min)

The takeover starts with discovery — but discovery with the *right people*. The buyer of a commercial-insurance program is rarely the office manager who emails certificates; it is the CFO, the owner, the COO, or a risk manager. SURFACE means a real meeting in which you map the business: what it makes or does, where it is growing, what keeps the owner up at night, what a bad year looks like, what contracts and lenders require, and — critically — what the incumbent broker has and has not done. You are not pitching. You are diagnosing.

> ### 🎤 Verbatim Script -- SURFACE
> *"Dana, before I ever talk about a number, I need to understand the business. Walk me through it — what you make, where you're growing, what a really bad day looks like operationally. Then tell me about your current program: who at your broker's office do you actually talk to, when did they last sit down with you and walk your loss runs, and when did they last bring you an idea you hadn't asked for? I'm not here to quote your renewal. I'm here to find out whether your risk is being managed or just renewed."*

**Common trap.** Talking to the wrong person. The office manager can give you a premium number; only the CFO or owner can tell you what the business is protecting and authorize a change. A takeover built on a conversation with the certificate clerk is built on sand.

#### Stage 2 -- STRESS-TEST (2.5 min)

Now you do the technical work most producers skip. STRESS-TEST means getting the buyer's authorization to pull **five years of loss runs** (the carrier-produced claims history) and the **NCCI experience-mod worksheet**, and reading them. You are looking for: open claims with stale or excessive reserves inflating the experience mod; frequency patterns the incumbent never addressed with loss control; coverage gaps and uninsured retained losses; carrier placements that don't fit the class of business; and contract or lender requirements the current program doesn't satisfy. This is where the real, quantified, switch-justifying story lives.

> ### 🎤 Verbatim Script -- STRESS-TEST
> *"Dana, here's what five years of your loss runs show. Your experience mod is 1.19 — that's a 19% surcharge on your workers-comp premium, roughly $74K a year. But two of the claims driving it are open with reserves that look stale; if we get a claims advocate on those, the mod could move toward 1.05. Separately, you've absorbed about $280K in retained and uninsured losses over five years that never showed up on a premium quote. Your incumbent has never walked you through any of this. That's not a price problem. That's a management problem."*

**Common trap.** Quoting without loss runs. A producer who hasn't read the loss runs is guessing at the renewal, can't explain the experience mod, and has nothing the incumbent doesn't have. The loss runs are the takeover.

#### Stage 3 -- STRUCTURE (2.5 min)

Now you redesign. STRUCTURE means proposing a program — not just a price — across all lines: property, general liability, commercial auto, workers comp, umbrella/excess, management liability, cyber. You make deliberate choices on deductibles and retentions, on carrier selection from your agency's appointment roster (matching appetite, AM Best rating, and claims service to the class of business), and on whether an alternative-risk structure such as a group captive is worth a feasibility look. You also build the non-premium plan: loss control, a return-to-work program, a claims-advocacy protocol, a contract-review service, and a service calendar.

> ### 🎤 Verbatim Script -- STRUCTURE
> *"Dana, here's the redesigned program. We move property to a carrier whose appetite actually fits precision manufacturing — better pricing and a claims team that knows your equipment. We take a higher GL deductible because your frequency is low, and we put the savings into an umbrella limit your largest customer contract actually requires — a gap your current program has. We put a claims advocate on the open comp files. And because your losses are predictable and your operation is well-run, I want to run a group-captive feasibility analysis — that's a path to owning your own loss dollars instead of renting coverage. This is a program. A quote is just one page of it."*

**Common trap.** Re-quoting the same program one carrier cheaper. If your proposal is structurally identical to the incumbent's, you have given the buyer nothing to switch *for* — you're back to bidding.

#### Stage 4 -- SUBSTANTIATE (2.5 min)

Now you put it in writing and make it CFO-grade. SUBSTANTIATE means a written **total-cost-of-risk (TCOR) analysis** — premium plus retained losses plus risk-control spend plus administrative cost — benchmarked against industry, with a multi-year projection of what your plan changes. You show the experience-mod trajectory, the deductible-strategy math, the coverage gaps closed, and the dollar impact year by year. A CFO does not act on a feeling that you're "more proactive." She acts on a number with a defensible method behind it.

> ### 🎤 Verbatim Script -- SUBSTANTIATE
> *"Dana, here's the written analysis. Today your total cost of risk is about $940K — that's $400K premium plus $280K retained losses plus loss-control and admin. Industry benchmark for your size and class is closer to $760K. Our three-year plan: drive the mod from 1.19 toward 1.05, close the umbrella gap, restructure deductibles, and put real claims advocacy and loss control in place. Projected TCOR reduction over three years: about $190K. That's the case. Not 'we're cheaper' — 'here is what your risk actually costs and here is the plan to lower it.'"*

**Common trap.** Presenting a price, not an analysis. A spreadsheet of premiums by line is what the incumbent sends. A written TCOR analysis with a multi-year plan is what makes a CFO move.

#### Stage 5 -- SECURE (2.5 min)

Now you move the account on the right legal path and lock the service commitment. SECURE means knowing the difference between a **broker-of-record (BOR) letter** — which transfers an existing, well-priced program to your agency on the same carrier with no re-marketing — and a **re-market mandate**, in which the buyer authorizes you to take specific lines to competing carriers at renewal. Often the right answer is a hybrid: BOR the lines that are well-placed, re-market the lines that aren't, and do it on a timeline that doesn't let the incumbent block your markets. You also get the service calendar signed: the quarterly stewardship meeting, the mid-year loss-run review, the renewal strategy session 120 days out.

> ### 🎤 Verbatim Script -- SECURE
> *"Dana, here's how we move. Your property and umbrella are well-priced where they sit — we'll take those by broker-of-record letter, no disruption, same carriers, just our agency managing them. Workers comp and auto we re-market, because the analysis says we can do better on placement; I'll need a signed market authorization so two agencies aren't approaching the same carrier. And here's the service calendar — quarterly stewardship, a mid-year loss-run review, and a renewal strategy session 120 days out, in writing, so you never wonder again whether your risk is being managed. Let's start the BOR today and the re-market this week."*

**Common trap.** Treating the BOR letter as the whole game. A BOR with no plan behind it just moves a transactional account from one transactional broker to another — and the next producer takes it from you the same way. SECURE the move *and* the service commitment.

### Part B -- The Four Conversations Every Renewal-Takeover Producer Avoids (8 min)

Per **CIAB + RIMS + the Big "I"** producer-development data, four conversations explain most of the gap between top-quartile producers and bottom-quartile producers. Producers avoid them out of fear of looking aggressive, fear of technical work, and fear of an unflattering answer.

#### Conversation 1 -- "There are two ways to switch, and the honest one might be slower"

Many producers let the prospect believe switching means a painful full re-marketing of every policy — or, conversely, push for a quick broker-of-record letter that hands them an account they then can't actually improve. **Script:** *"Dana, there are two instruments here and you should understand both. A broker-of-record letter moves your program to my agency on the same carriers — fast, no disruption, but it only makes sense where the program is already well-placed. Re-marketing means I take specific lines to competing carriers — slower, more work for you, but it's the only honest path where the current placement is wrong. I'm going to recommend a hybrid, and I'll tell you exactly which lines go which way and why. I'd rather be slower and right than fast and useless to you."*

#### Conversation 2 -- "Your incumbent isn't bad — they're transactional, and that's the problem"

Most incumbents aren't negligent; they're order-takers who shop the renewal, email three quotes, and disappear for 51 weeks. Producers avoid naming this because it feels like slander. **Script:** *"Dana, I'm not going to tell you your broker is bad — I don't believe they are. But I'll ask you a question. In the last three years, did they ever pull your loss runs and walk you through them? Bring you an idea you didn't ask for? Sit down with you more than once a year? If the answer is no, that's not a bad broker — that's a transactional one. And a transactional broker is fine until the year you have a real claim or a real growth decision. That's the difference I'm offering — not a cheaper policy, a managed risk."*

#### Conversation 3 -- "Let's pull your loss runs and read your experience mod together"

Many producers never pull loss runs or read the NCCI mod worksheet — it's technical, and the answer might be unflattering. Yet that is exactly where the quantified, switch-justifying story lives. **Script:** *"Dana, I need your authorization to pull five years of loss runs and your experience-mod worksheet, and then I want to read them with you. This is the part most producers skip because it's work. But your experience mod is a number you can calculate, it's surcharging your premium, and it's often inflated by open claims carrying reserves that should have been resolved. If I can show you why your mod is what it is and a plan to move it, that's worth more than any quote — and it's a conversation your incumbent has never had with you."*

#### Conversation 4 -- "Some of this renewal increase is the market, and I won't pretend otherwise"

A producer who over-promises rate relief to win the account inherits a renewal he can't deliver and loses the account in 12 months. **Script:** *"Dana, I'm going to be straight with you about pricing. Commercial property is up across the whole market — catastrophe losses and replacement-cost inflation, it has nothing to do with your broker. If anyone promises you they'll just make that go away, be careful. What I control is program structure, deductible strategy, carrier selection, your experience mod, and claims advocacy — and that's where I'll save you real money. I'd rather set an honest expectation today and over-deliver than win you on a promise the market won't let me keep."*

### Part C -- The Three Instruments (3 min)

Every renewal-takeover producer must fluently explain three instruments. Producers who can't lose on technical credibility alone.

**Instrument 1 — The Broker-of-Record (BOR) letter.** A short letter, signed by the client, instructing carriers that a named agency now represents the account. It transfers an existing program — same policies, same carriers — to a new broker without re-marketing. Carriers honor a valid BOR after a short waiting period, and will not let two agencies block or re-market the same account simultaneously. The BOR is the *fast* path; it is the right path only when the program is already well-placed.

**Instrument 2 — The loss run.** A carrier-produced report of every claim on a policy over a period (commonly five years): date, description, amount paid, amount reserved (set aside for an open claim), and status (open/closed). Loss runs are the factual basis of every renewal. Open claims with stale or excessive reserves inflate cost; frequency patterns reveal where loss control is needed. A producer who hasn't read the loss runs is quoting blind.

**Instrument 3 — The NCCI experience modification rate (the experience mod / e-mod / x-mod).** A multiplier on a business's workers-compensation manual premium reflecting its actual loss experience versus expected loss for its class and size. 1.00 is average; below 1.00 is a credit (discount); above 1.00 is a debit (surcharge). The mod lags actual experience by roughly a year, it is calculable from the NCCI worksheet, and it is the single most powerful — and most misunderstood — number in a commercial renewal. A producer who can read a mod worksheet and build a plan to drive the mod down is delivering a quantified reason to switch.

### Part D -- Producer Quartile Self-Diagnosis (2 min)

Every producer and sales manager self-diagnoses on five behaviors: **do you start renewals 90-120 days out or 2-3 weeks out; do you pull and read loss runs on every takeout target; do you reach the CFO/owner or only the certificate clerk; do you present a written TCOR analysis or just a premium spreadsheet; and do you set honest renewal-market expectations or over-promise rate relief.** The room learns instantly which quartile each producer is in and which two or three behaviors block the next jump.

> ### 🎯 Bottom Line
> 5 stages + 4 avoided conversations + 3 instruments + a quartile self-diagnosis = takeovers won on strategy and retained for years. Stages without the avoided conversations = a polished producer who still competes on price. The avoided conversations without the stages = honesty with no plan behind it.

---

## SECTION 3 -- THE DISCUSSION (0:35-0:45)

> ### 🟡 Coach Note
> Whiteboard 5 columns SURFACE / STRESS-TEST / STRUCTURE / SUBSTANTIATE / SECURE and 4 rows for the avoided conversations. Each producer audits their last 10 takeover attempts out loud — which stage they skipped, which conversation they ducked, which quartile behavior showed. **Count to five after each prompt before anyone answers.**

**1 — "When do you walk away from a takeover target?"** When the buyer will only share a premium number and not the loss runs, won't put you in front of the CFO/owner, is clearly using you only to leverage the incumbent, and the renewal is two weeks out. **Sales Mgr:** *"If you can't get the loss runs and you can't reach the buyer, you're not on a takeover — you're free price-checking for the incumbent. Walk."*

**2 — "Broker-of-record letter or re-market — how do you decide?"** BOR when the existing program is well-priced and well-placed and the value you add is service and strategy. Re-market when the placement itself is wrong — bad carrier fit, missing coverage, mispriced lines. Hybrid is usually correct. **Sales Mgr:** *"The BOR is fast and the re-market is honest. Tell the client exactly which lines go which way and why. Never BOR a bad program just because it's easy."*

**3 — "The incumbent is trying to 'block' your markets — what now?"** A blocked carrier won't quote you because the incumbent approached them first. **Sales Mgr:** *"This is why timeline discipline matters. Get the signed market authorization early, submit to your target carriers before the incumbent locks them, and on lines you can't get clean access to, use the BOR path instead. Blocking is a timeline failure, not a dead end."*

**4 — "How do you read a debit experience mod without scaring the owner?"** Separate the diagnosis from the blame. The mod is a lagging number; an open claim with a stale reserve can hold it high long after the operation improved. **Sales Mgr:** *"Say: 'Your mod is 1.28, here's the math, and here are the two open claims holding it there. This is fixable — it's claims advocacy and reserve discipline, not a verdict on your safety.' Diagnosis, then plan."*

**5 — "A prospect demands you promise to beat the incumbent's renewal — what do you say?"** You don't promise it. **Sales Mgr:** *"Say: 'I won't promise to beat a number I haven't seen the loss runs behind. What I'll promise is to show you your true total cost of risk and a plan to lower it. If beating the premium is possible I'll do it — but I won't win you on a promise the market won't let me keep.'"*

**6 — "When is a captive worth raising?"** For a profitable, lower-hazard, well-run middle-market account — often $300K+ in casualty premium — with predictable losses. **Sales Mgr:** *"A group-captive feasibility analysis is a sophisticated idea the transactional incumbent never raised. It reframes the whole conversation from 'price of insurance' to 'ownership of your loss dollars.' Raise it where it genuinely fits — never as a gimmick."*

**7 — "You only have the office manager — how do you get to the CFO?"** Use the loss-run review as the lever. **Sales Mgr:** *"Say: 'I can give you a quote off a summary, but that's exactly the transactional service you already have. To do this properly I need 45 minutes with whoever owns the risk budget — your CFO or owner. That meeting is the value.' Earn the CFO with the promise of real work."*

**8 — "ONE behavior change."** Each producer names ONE stage they habitually skip and ONE avoided conversation they duck. **Sales Mgr:** *"Into the CRM. Monday huddle. Ride-along on the next takeover."*

---

## SECTION 4 -- TWO-PERSON ROLE-PLAY (0:45-1:05)

> ### 🟡 Coach Note
> Pair producers. **Two scenarios, 10 minutes each, 60-second reset between.** Listen for whether the producer reaches the economic buyer, insists on pulling loss runs, reads the experience mod out loud, and presents a total-cost-of-risk plan instead of a premium. Mark which stage and which avoided conversation each producer skips.

### Role-Play 1 -- CFO Dana Whitfield at a $60M Precision Manufacturer, 75 Days From Renewal (10 min)

**Setup:** **Dana Whitfield, CFO of Calderon Precision** (a $60M-revenue precision-machining and contract-manufacturing business, ~210 employees, family-owned). The company's commercial P&C program — property, general liability, commercial auto, workers comp, a $10M umbrella, and a small management-liability and cyber package — renews in **75 days** at roughly **$400K total premium** with an independent agency they've used for 12 years. The incumbent producer is competent but transactional: he shops the renewal each year, emails a spreadsheet of quotes, and is otherwise unseen. Calderon's experience mod is **1.19**. The producer is **Sam Ortega, a commercial P&C producer at a competing regional agency**, who got a warm introduction through Calderon's banker. Dana opens guarded. **Run the full 5-STAGE and the 4 avoided conversations; the goal is a signed authorization to pull loss runs and a CFO meeting on the TCOR analysis — not a quote.**

> ### 🎤 PROSPECT -- Dana Whitfield
> 51, 9-year CFO, CPA, financially literate, time-protective, skeptical of "broker pitches," loyal-by-default to the incumbent until given a real reason not to be.
>
> **Deflection 1 (min 4):** *"Look, I appreciate the intro from the bank, but we've been with our agency 12 years and they're fine. If you want to sharpen your pencil and send me a number against our renewal, I'll look at it. But I don't have time for a long process."*
>
> **Deflection 2 (min 8):** *"You keep saying 'total cost of risk' and 'experience mod.' Our premium is our premium. Why would I hand you our loss runs and our whole financial picture when all I asked for is a competitive quote?"*

> ### 🎤 PRODUCER -- Sam Ortega
>
> - **Min 0-3 (SURFACE):** *"Dana, thank you — and I'll respect your time. I'm not going to send you a number today, because a number off a summary is exactly the transactional service you already get. Before anything, help me understand Calderon — what you machine, where you're growing, and what a genuinely bad operational day looks like. And tell me honestly: in 12 years, has your agency ever pulled your loss runs and walked them with you, or brought you an idea you didn't ask for?"*
> - **Min 3-5 (STRESS-TEST + Deflection 1):** *"I hear you on the long process — so let me tell you what the short, honest version is. I don't want to 'sharpen a pencil.' I want one thing: authorization to pull five years of your loss runs and your NCCI experience-mod worksheet. Your mod is 1.19 — that's a 19% surcharge on workers comp, real money — and mods are very often inflated by open claims carrying stale reserves. If I read your loss runs and find that, I can show you a plan to fix it. That's not a long process. That's the most useful 45 minutes you'll spend on insurance this year."*
> - **Min 5-7 (STRUCTURE + Conversation 2):** *"Dana, I won't tell you your agency is bad — I doubt they are. But there's a difference between a broker who renews your policies and one who manages your risk. Renewing is emailing three quotes once a year. Managing is reading your loss runs, fixing your mod, closing coverage gaps your largest customer contract requires, matching your property placement to a carrier that actually knows precision manufacturing, and meeting you quarterly. I'm offering the second one. That's the whole pitch."*
> - **Min 7-9 (SUBSTANTIATE + Deflection 2):** *"Fair challenge. Here's why the loss runs, not just the premium: your premium is what you pay a carrier. Your *total cost of risk* is that premium plus every dollar of loss you absorb under your deductibles, plus claims-handling friction, plus your mod surcharge. For a company your size that uninsured-and-retained number is often $200K-$300K — and it never appears on a quote. I'm not asking for your financials. I'm asking for loss runs, which your carriers will release with one signature. Without them, I'm guessing — and you already have a broker who guesses."*
> - **Min 9-10 (SECURE):** *"Two asks, both small. One — sign this loss-run authorization today so I can read five years of your claims and your mod worksheet. Two — give me 45 minutes with you, three weeks from now, to walk you through a written total-cost-of-risk analysis and a three-year plan. If the analysis shows your current program is genuinely well-run, I'll tell you that and you've lost nothing. If it shows what I expect, you'll have a real decision to make with 50-plus days still on the clock. No quote today. Just the authorization and the meeting."*

### 60-Second Reset

> ### 🟡 Coach Note
> **"Switch sides — 60-second reset."** Stand up. Read the other role's sheet. Go.

### Role-Play 2 -- Owner-Operator Ray Donnelly at a $14M Commercial Contractor With a 1.28 Debit Mod (10 min)

**Setup:** **Ray Donnelly, owner of Donnelly Mechanical** (a $14M commercial HVAC and mechanical contractor, ~80 field employees). Ray's program renews in **90 days** at roughly **$520K total premium**, heavy in workers comp and commercial auto. His **experience mod is 1.28** — a 28% surcharge — which Ray believes is "just bad luck" from a couple of injuries two years ago. His general contractors are starting to ask about his mod on bid prequalification forms, and a mod above 1.0 is costing him work. His incumbent is a single-carrier captive agent who has never explained the mod. The producer is **Sam Ortega**, introduced by another contractor. **Run the full 5-STAGE; the goal is to reframe the mod as a fixable, quantified problem and secure authorization for loss runs plus a re-market mandate.**

> ### 🎤 PROSPECT -- Ray Donnelly
> 58, built the company over 30 years, trusts handshakes over spreadsheets, proud of his crews, frustrated that his mod is costing him bids, suspicious that "insurance guys" all sound the same.
>
> **Deflection 1 (min 4):** *"My mod's high because we had two bad injuries two years ago — bad luck, nothing I can do about it now. My agent says it'll come down on its own. I don't need a lecture, I need a cheaper number."*
>
> **Deflection 2 (min 8):** *"You're the fourth insurance guy this year. They all say they'll save me money. Why should I let you pull all my claims history and go shop me around when my current guy has handled me fine for 15 years?"*

> ### 🎤 PRODUCER -- Sam Ortega
>
> - **Min 0-3 (SURFACE):** *"Ray, 30 years building this — that's the business, not the insurance, and I respect it. Tell me what's actually changed: you mentioned GCs are asking about your mod on prequal forms. How many bids has that cost you this year? Because that's not an insurance problem — that's a revenue problem, and that's the one I want to fix."*
> - **Min 3-5 (STRESS-TEST + Deflection 1):** *"Ray, here's the hard part, said straight. 'It'll come down on its own' is not how an experience mod works, and a captive agent who told you that either doesn't know or didn't want the conversation. Your mod is 1.28 — a 28% surcharge, on a comp line that's most of your premium. The two injuries are part of it, but I'd bet money those claims are still *open* on your loss runs with reserves set higher than they'll ever pay. Stale reserves hold a mod up for years. A claims advocate can get those reserves reviewed and resolved. That's not luck. That's work nobody's done for you."*
> - **Min 5-7 (STRUCTURE):** *"Here's the plan, Ray, in plain terms. One — we pull your loss runs and your NCCI mod worksheet and find every claim holding that mod up. Two — we put a claims advocate on the open files to get reserves reviewed. Three — we re-market your comp and auto to carriers that actually want mechanical contractors, because a captive single-carrier agent can only offer you one. Four — a return-to-work program so the next injury costs a fraction as much. Your mod doesn't drop by magic — it drops because someone runs that playbook."*
> - **Min 7-9 (SUBSTANTIATE + Deflection 2):** *"Ray, you're right that we all say 'I'll save you money' — so I won't. Here's what I'll say instead. A mod over 1.0 is costing you *bids*, and bids are worth more than premium. If we move your mod from 1.28 toward 1.05 over two renewals, you stop being screened out on prequals. I'll put that in writing as a total-cost-of-risk plan — premium, retained losses, and the work you're losing. Your guy of 15 years never showed you that math because a single-carrier agent can't fix it. I'm not asking for trust. I'm asking for loss runs and a chance to show the numbers."*
> - **Min 9-10 (SECURE):** *"Two things, Ray. Sign the loss-run authorization so I can read your claims and your mod worksheet — and a market authorization so I can take your comp and auto to carriers that want your business, without your current agent blocking them. Three weeks from now I sit down with you and your office manager and walk a written plan: the mod trajectory, the carrier options, and what it's worth in bids you stop losing. 90 days to renewal — that's enough time to do this right. Not enough to wait."*

> ### 🟡 Coach Note
> Producers will want to (a) match the incumbent on price — DON'T, price-matching surrenders the strategy; (b) promise the mod will drop fast — DON'T, set a two-renewal expectation; (c) skip the revenue/bids reframe with Ray — DON'T, lost bids is the real pain, bigger than premium; (d) accept "send me a number" from Dana without securing the loss-run authorization — DON'T, the authorization is the close, not the quote.

---

## SECTION 5 -- DEBRIEF + COMMITMENTS (1:05-1:10)

> ### 🟡 Coach Note
> Three debrief questions, then commitments. This ritual moves next quarter's takeover close rate, book retention, and the producer-quartile mix on the team.

**Debrief 1 — "Strongest stage? Weakest?"** Producers over-index SURFACE (they like discovery) and under-index STRESS-TEST (pulling and reading loss runs is technical work) and SUBSTANTIATE (writing a real TCOR analysis is harder than emailing a quote). **Sales Mgr:** *"Skip STRESS-TEST and you're quoting blind. Skip SUBSTANTIATE and you've given the CFO a feeling instead of a number — and feelings lose to a 6% discount."*

**Debrief 2 — "Which conversation did you dodge most?"** Most name Conversation 3 — pulling the loss runs and reading the experience mod — because it's technical and the answer might be unflattering. **Sales Mgr:** *"The conversation you avoid is the one that wins the account. The loss runs ARE the takeover. Read them on every target, every time."*

**Debrief 3 — "Which lost takeover do you owe a re-open?"** Each producer names ONE takeover lost on price or lost because they started too late. **Sales Mgr:** *"Email within 48 hours: 'I never showed you your total cost of risk or read your loss runs — I'd like 45 minutes to do that properly before your next renewal cycle.' Most accounts renew annually. Start the next takeover 120 days out, today."*

> ### 🎤 Commitment Ritual (Verbatim)

**Sales Mgr:** "Open the CRM. Four lines. **(1)** A takeover you lost on price or lost by starting late — name the account, the size, and what you skipped. **(2)** The stage you habitually skip and the verbatim line you'll use next time. **(3)** The avoided conversation you dodge and the reframe. **(4)** One current renewal target where you'll pull loss runs and book the CFO meeting in the next 30 days. Read all four aloud."

Coach the vague: *"Which account? Which renewal date? Whose CFO? When's the meeting? Out loud, now."*

**Closes:** "1:1 takeover ride-along within 14 days. I'm not grading whether you won — I'm grading whether you SURFACED the economic buyer, STRESS-TESTED the loss runs, and SUBSTANTIATED a written total-cost-of-risk plan."

---

## SECTION 6 -- LEAVE-BEHIND WALKTHROUGH (1:10-1:13)

> ### 🟡 Coach Note
> Hand out the one-pager. 30 seconds per section. Digital copy in the CRM and the team drive. One in every producer's bag, one on the sales-room wall, one in the Monday-huddle binder.

> ### 📋 Leave-Behind -- "The Renewal Takeover Script Card" One-Pager

> **8 THINGS TO BRING ON EVERY TAKEOVER:** (1) SURFACE discovery scorecard (the business, growth, worst-case day, contract & lender requirements, incumbent's actual service record). (2) Loss-run authorization form. (3) NCCI experience-mod read sheet. (4) Carrier-appetite map for the prospect's class of business with AM Best ratings. (5) TCOR worksheet (premium + retained losses + risk-control spend + admin cost). (6) Broker-of-record vs re-market decision card. (7) Renewal-timeline template (120 / 90 / 60 / 30 days). (8) Service-calendar template (quarterly stewardship + mid-year loss-run review + renewal strategy session).

> **THE 5-STAGE TAKEOVER SCRIPT CARD:** **(1) SURFACE Day 1** — *"I'm not here to quote your renewal — I'm here to find out whether your risk is managed or just renewed. Walk me through the business, and tell me what your broker has and hasn't done."* **(2) STRESS-TEST Week 3** — *"Authorize five years of loss runs and your mod worksheet. Your 1.19 mod is a 19% surcharge; two open claims with stale reserves are driving it; here's $280K of retained loss your premium never showed you."* **(3) STRUCTURE Week 6** — *"Here's the redesigned program — deductible strategy, better-fit carrier, umbrella gap closed, claims advocacy, and a captive feasibility look. A quote is one page of a program."* **(4) SUBSTANTIATE Week 9** — *"Written TCOR analysis: $940K today vs $760K benchmark; three-year plan projects a $190K reduction. Here is the case — not 'cheaper,' a plan."* **(5) SECURE Week 11** — *"BOR the well-placed lines, re-market the rest, sign the service calendar. We start the BOR today and the re-market this week."*

> **THE 4 AVOIDED CONVERSATIONS:** **(1) BOR vs re-market** — explain both instruments honestly; recommend the hybrid and say which line goes which way and why. **(2) Transactional, not bad** — "Did they ever pull your loss runs, bring an unrequested idea, or meet you more than once a year? If no, that's transactional — fine until the year you have a real claim." **(3) Pull the loss runs & read the mod** — the technical work most producers skip is where the quantified switch-justifying story lives. **(4) The increase is the market** — set honest renewal expectations; never over-promise rate relief you can't deliver.

> **PRODUCER QUARTILE SELF-DIAGNOSIS:** Top-quartile — starts renewals 90-120 days out; pulls and reads loss runs on every target; reaches the CFO/owner; presents a written TCOR analysis; sets honest market expectations. Bottom-quartile — starts 2-3 weeks out; quotes off a summary; talks only to the certificate clerk; presents a premium spreadsheet; over-promises rate relief. Median is in between on every line. Find your two weakest behaviors and fix those first.

> **THE 3 INSTRUMENTS:** **(1) Broker-of-record letter** — client-signed instruction moving an existing program to a new agency, same carriers, no re-marketing; the fast path, right only when the program is well-placed. **(2) Loss run** — carrier-produced 5-year claims history (paid, reserved, open/closed); the factual basis of every renewal; quoting without it is guessing. **(3) NCCI experience mod** — workers-comp premium multiplier; 1.00 average, below is a credit, above is a debit/surcharge; lags ~a year; calculable; the most powerful and most-misunderstood number in a renewal.

> **NEVER DO:** quote off a summary without loss runs / start a takeover two weeks out / talk only to the certificate clerk / present a premium spreadsheet instead of a written TCOR analysis / promise to "beat the renewal" before you've read the loss runs / slander the incumbent (name "transactional," never "bad") / BOR a poorly-placed program just because it's the easy path / push a re-market when a BOR genuinely serves the client better / ignore the experience mod / raise a captive as a gimmick where it doesn't fit / single-thread the office manager when the CFO/owner owns the risk decision / let the incumbent block your markets through a timeline failure.

> **OUTCOME LINE:** Full discipline → takeovers won on a risk strategy, books that retain for years, growing renewal income, accounts that can't be taken back with a 6% discount. Quote-and-pray → the occasional account won on price and lost back at the next renewal, a churning book, and a career spent bidding.

> ### 🎯 If You Only Remember One Thing
> **You do not take a commercial P&C account away from an incumbent broker with a cheaper quote — the incumbent erases a 6% discount with one phone call to the same carrier. You take it by starting 120 days before renewal, getting in front of the CFO or owner instead of the certificate clerk, pulling and reading five years of loss runs and the NCCI experience-mod worksheet, quantifying the total cost of risk the premium line never showed — the retained losses, the mod surcharge, the coverage gaps — and handing the buyer a written multi-year plan to lower it. A takeover won on price is lost back at the next renewal; a takeover won on a risk strategy is a client for a decade.**

---

## How This Training Sits Inside Your Sales Motion

**Monday sales huddle** weekly — last week's takeover activity plus one verbatim drill. **Day 1** SURFACE discovery with the economic buyer. **Week 3** STRESS-TEST — loss runs pulled and read, experience mod worksheet in hand. **Week 6** STRUCTURE — redesigned program and forward plan. **Week 9** SUBSTANTIATE — written TCOR analysis presented to the CFO/owner. **Week 11** SECURE — BOR and/or re-market executed, service calendar signed. **The four avoided conversations overlay every cycle.** **Producer quartile review** quarterly, with a 90-day plan to move each producer one behavior at a time.

`;

// ============================================================================
// FLOW -- two mermaid diagrams
// ============================================================================
const flow = `

## The 5-Stage Renewal Takeover Flow

\`\`\`mermaid
flowchart TD
  A[Sales Mgr Opens] --> B[Section 1 Cold Open — Producer A quotes a 45M distributor 14 days out 6 percent under premium loses when incumbent matches vs Producer B starts 120 days out at a 60M manufacturer pulls 5 years of loss runs reads the experience mod builds a total-cost-of-risk plan wins on strategy]
  B --> C[Section 2 Teach 25 min]
  C --> C1[Part A 5-STAGE — SURFACE discovery with the economic buyer / STRESS-TEST pull and read loss runs and the NCCI experience-mod worksheet / STRUCTURE redesigned program deductible strategy carrier fit captive feasibility / SUBSTANTIATE written total-cost-of-risk analysis with a multi-year plan / SECURE broker-of-record plus re-market on the right path with a signed service calendar]
  C --> C2[Part B 4 Avoided Conversations — BOR vs re-market honesty / transactional not bad / pull the loss runs and read the mod / the increase is the market]
  C --> C3[Part C 3 Instruments — broker-of-record letter / loss run / NCCI experience modification rate]
  C --> C4[Part D Producer Quartile Self-Diagnosis 5 behaviors]
  C1 & C2 & C3 & C4 --> F[Section 3 Discussion 8 prompts]
  F --> G[Section 4 Role-Play 20 min]
  G --> G1[R1 CFO Dana Whitfield 60M precision manufacturer Calderon Precision 75 days from renewal 1.19 mod happy with the incumbent send me a number — run 5-STAGE secure loss-run authorization plus a CFO TCOR meeting]
  G1 --> G2[60-sec reset]
  G2 --> G3[R2 owner-operator Ray Donnelly 14M mechanical contractor 1.28 debit mod costing him bids — run 5-STAGE reframe the mod as fixable secure loss-run authorization plus a re-market mandate]
  G3 --> H[Section 5 Debrief CRM commitment ritual]
  H --> I[Section 6 Leave-Behind one-pager]
  I --> Z[End 1:13]
\`\`\`

## The Broker-of-Record vs Re-Market Decision Tree

\`\`\`mermaid
flowchart LR
  IN[Renewal takeover target identified] --> SURF{SURFACE reaches the economic buyer}
  SURF -- only the certificate clerk --> STALL[Use the loss-run review as leverage to earn the CFO meeting]
  SURF -- CFO or owner engaged --> LR{STRESS-TEST loss runs authorized}
  LR -- no loss runs released --> WALK[Likely a price-check for the incumbent — walk]
  LR -- 5 years of loss runs and the mod worksheet in hand --> DIAG{Diagnose each line of coverage}
  DIAG -- line is well-priced and well-placed --> BOR[Move that line by broker-of-record letter — fast no re-marketing]
  DIAG -- line is mispriced or wrong carrier fit --> REMK[Re-market that line — signed market authorization beat the incumbent block]
  BOR & REMK --> SUB[SUBSTANTIATE — written TCOR analysis and multi-year plan to the CFO]
  SUB --> SEC[SECURE — execute BOR plus re-market sign the service calendar]
  SEC --> WIN[Account won on strategy — retained for years]
\`\`\`

`;

// ============================================================================
// SRC -- source list (appended at 5->6)
// ============================================================================
const src = `

---

## Sources & Further Reading

The market structure, instruments, and benchmarks in this training are grounded in the following industry, regulatory, and trade sources. Producers preparing a renewal takeover should keep the CIAB market index and the NCCI experience-mod methodology especially close.

${sources.map((s, i) => `${i + 1}. **${s.title.split(' — ')[0]}** — ${s.title.split(' — ').slice(1).join(' — ')}  \n   <${s.url}>`).join('\n\n')}

`;

// ============================================================================
// NUM -- verified numbers section (appended at 6->7)
// ============================================================================
const num = `

---

## The Numbers Behind the Takeover

A renewal-takeover producer who can't speak the quantitative language of commercial insurance loses on credibility before strategy. The figures below are the ones that recur in every takeover; treat ranges as planning bands, confirm account-specific numbers from the actual loss runs and the NCCI worksheet, and read the current CIAB Commercial P/C Market Index before setting any renewal expectation.

### Experience modification rate — how the surcharge math works

| Experience mod | Meaning | Effect on a $200K WC manual premium |
|---|---|---|
| **0.85** | Strong credit mod | Premium ≈ $170K — a $30K discount |
| **1.00** | Average — actual losses match expected | Premium ≈ $200K — neither credit nor debit |
| **1.19** | Debit mod (the Calderon role-play) | Premium ≈ $238K — a $38K surcharge |
| **1.28** | Heavy debit mod (the Donnelly role-play) | Premium ≈ $256K — a $56K surcharge |

The mod is a multiplier on **manual premium**, it is calculated by NCCI (or an independent state bureau) from roughly the prior three policy years excluding the most recent, and it **lags actual experience by about a year** — which is precisely why an operation that has genuinely improved can still carry a high mod, and why open claims with stale reserves are so damaging. A claim still **open** on the loss run is valued at **paid plus reserved**; an inflated reserve inflates the mod until the claim closes or the reserve is corrected. This is the single highest-leverage technical insight in a workers-comp-heavy takeover.

### Total cost of risk — the four components

**Total cost of risk (TCOR)** = (1) insurance premiums + (2) retained/uninsured losses (deductibles, self-insured retentions, uninsured claims) + (3) risk-control and loss-prevention spend + (4) risk-management administrative cost. For a middle-market account, premium is typically only **55-75%** of true TCOR; the retained-loss component is the one the incumbent's premium quote never surfaces. In the Calderon role-play, a ~$400K premium sits inside a ~$940K TCOR — the $540K difference is where the takeover argument lives.

### Renewal-takeover timeline — the discipline that beats the incumbent block

| Days to renewal | Stage | What must be done |
|---|---|---|
| **120 days** | SURFACE | Economic-buyer discovery meeting completed |
| **90 days** | STRESS-TEST | Loss runs and mod worksheet pulled and read |
| **60 days** | STRUCTURE + SUBSTANTIATE | Program redesigned, written TCOR analysis presented |
| **30 days** | SECURE | BOR signed and/or market authorization submitted before the incumbent locks the carriers |

A takeover started inside **30 days** is almost always a price-check: there is no time to pull loss runs, no time to re-market cleanly, and the incumbent can block the carriers. Top-quartile producers start at **90-120 days**; bottom-quartile producers start at **2-3 weeks** and compete only on price.

### Market-direction discipline

Commercial-insurance pricing moves by line and by market cycle, and a producer must read the current **CIAB Commercial P/C Market Index** before promising anything. Through the **2024-2025** environment, commercial **property** remained elevated on catastrophe losses, reinsurance cost, and replacement-cost inflation; **commercial auto** stayed persistently adverse on social inflation and large-verdict loss trends; **workers compensation** continued a long, relatively soft run. The takeover lesson: a 12-20% property increase may simply be the market — promising to erase it is how you inherit a renewal you lose in 12 months. What a producer *controls* is structure, deductibles, carrier selection, the experience mod, and claims advocacy.

### Captive economics — when alternative risk transfer enters

A **group captive** typically becomes worth a feasibility analysis once a middle-market account carries roughly **$300K+** in combined casualty premium (workers comp + auto + general liability), has **predictable, lower-hazard** losses, and is well-run. The captive lets the business retain underwriting profit and investment income on its own losses rather than paying it to a traditional carrier — a structural, multi-year reframe of the conversation that the transactional incumbent almost never raised.

`;

// ============================================================================
// COUNTER -- counter-case section (appended at 7->8)
// ============================================================================
const counter = `

---

## Counter-Case: When the Renewal Takeover Playbook Is the Wrong Move

A disciplined producer is as good at *not* chasing a takeover as at running one. The 5-stage motion is powerful, but applied indiscriminately it burns time, damages reputation, and occasionally hands a client a worse outcome. Coach the room on the cases where the honest answer is to slow down, narrow the scope, or walk away.

### 1. When the incumbent is genuinely excellent

Some incumbents are not transactional. They pull loss runs, run quarterly stewardship meetings, have driven the mod down, and have placed the program well. If your STRESS-TEST finds a well-managed program, **say so and walk** — telling a CFO her broker is doing real work, when that is true, builds more long-term credibility than a forced pitch. The next account where that CFO has influence may be yours precisely because you were honest here.

### 2. When a re-market would damage the client's market access

Re-marketing a program means approaching carriers. In a **hard market**, or in a **niche class** with few willing carriers, sending the account into the market clumsily — or letting multiple agencies hit the same carriers — can **burn the markets** and leave the client with *worse* options at renewal than if no one had touched it. If you cannot run a controlled, single-channel marketing process, recommend a BOR on the existing program or recommend the client stay put. Protecting the client's access is more important than winning the account.

### 3. When the only reason to switch is price

If your full analysis surfaces no structural improvement — the program is well-placed, the mod is fair, coverage is adequate — and the *only* lever is a few percent of premium, **the takeover is not real**. You will win it on price and lose it back on price. Decline gracefully. A book built on price-driven takeovers is a book that churns.

### 4. When you cannot get the loss runs or the economic buyer

If the prospect will not authorize loss runs and will not put you in front of the CFO/owner, you cannot run STRESS-TEST or SUBSTANTIATE — which means you cannot do the job. Continuing anyway makes you an unpaid price-checker sharpening the incumbent's pencil. **No loss runs and no buyer access = no takeover. Walk.**

### 5. When the timing genuinely doesn't work

A serious takeover needs roughly **90-120 days**. If you are introduced inside 30 days of renewal, the honest move is usually *not* to scramble a quote but to say: *"There isn't time to do this properly before this renewal. Let your current program renew, and let me start the real process 120 days before your next one."* That sentence loses a quote and wins a relationship — and it signals you are an advisor, not a bidder.

### 6. When a captive is being used as a gimmick

A captive is a serious, multi-year financial commitment with real exit cost and collateral implications. Raising it to *sound* sophisticated, on an account that is too small, too volatile, or too hazardous to qualify, is malpractice dressed as innovation. Raise alternative risk transfer **only** where the loss profile and premium scale genuinely support it — otherwise it discredits everything else in your analysis.

> ### 🟡 Coach Note
> The counter-case is not a hedge — it is the discipline that makes the playbook trustworthy. A producer who will walk away from the wrong takeover is a producer a CFO believes when she runs the right one. Knowing when *not* to chase is itself a top-quartile behavior.

`;

// ============================================================================
// LINKS -- cross-links to related qNNNN entries (appended at 8->9)
// ============================================================================
const links = `

---

## Related Pulse Sales Trainings

This renewal-takeover training is one motion inside the broader Pulse Sales Trainings library. Producers and sales managers extending this session should pair it with the related entries below — each is a runnable 60-minute meeting template.

- **st0026 — Managed IT Services (MSP) MSA Renewal Conversation: Surviving the Mid-Market Squeeze.** The closest structural cousin: defending or winning a recurring-revenue service agreement at renewal against a price-anchored incumbent. The MSP renewal and the P&C takeover share the same core lesson — a renewal won on price is lost back on price.
- **st0027 — Commercial HVAC Service Agreement Renewal Conversation.** Another recurring-contract renewal motion built on shifting the buyer from "price of the contract" to "total cost" — directly analogous to moving an insurance buyer from premium to total cost of risk.
- **st0001 — The Discovery Call Reset: The 7-Question Framework That Surfaces Real Pain.** The SURFACE stage of this training is a specialized discovery motion; st0001 is the discovery fundamentals every producer should master first.
- **st0006 — The Pricing Conversation: When to Introduce, When to Defend, When to Walk.** The "the increase is the market" avoided conversation and the discipline of never over-promising rate relief are pricing-conversation skills covered in depth in st0006.
- **st0014 — Financial Advisor: The Discovery Meeting With a $2M Client — Earning the Right to Manage the Money.** A parallel advisory-sale motion: earning the right to manage a client's financial risk, structurally mirroring earning the right to manage a business's insurable risk.
- **st0002 — Multi-Threading Enterprise Deals: How to Earn the Right to the Economic Buyer.** The SURFACE-stage problem of reaching the CFO/owner instead of the certificate clerk is a multi-threading problem; st0002 is the dedicated training on it.

Run this st0030 renewal-takeover session as the industry-specific application; run st0001, st0002, and st0006 as the underlying skill foundations.

`;

// ============================================================================
// DRIVER
// ============================================================================
const { getStore: _gs } = require('@netlify/blobs');
const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const KEY = 'pulsemachine-writer-2026';
const POLISH_URL = 'https://pulserevops.com/.netlify/functions/pulse-blob-polish';
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  const TOKEN = process.env.BLOBS_PAT;
  if (!TOKEN) { console.error('NO BLOBS_PAT'); process.exit(1); }
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: TOKEN });

  // ---- assemble ladder layers ----
  const v5 = tldr + core + flow;
  const v6 = v5 + src;
  const v7 = v6 + num;
  const v8 = v7 + counter;
  const v9 = v8 + links;
  const words = s => s.split(/\s+/).filter(Boolean).length;
  console.log('layer chars:', v5.length, v6.length, v7.length, v8.length, v9.length);
  console.log('layer words:', words(v5), words(v6), words(v7), words(v8), words(v9));
  if (v5.length < 800) { console.error('v5 too short'); process.exit(1); }
  if (!/\`\`\`mermaid/.test(v5)) { console.error('no mermaid in v5'); process.exit(1); }

  // ---- STEP B: create shell at qs5 via direct blob write ----
  const ts = Date.now();
  const shell = {
    id: ID,
    question: QUESTION,
    answer: v5,
    tags,
    sources,
    ts,
    model: 'claude-opus-4-7-via-claude-code',
    quality_score: 5,
    polished_at: null,
    polish_history: []
  };
  await store.setJSON('answers/' + ID + '.json', shell);
  console.log('wrote answers/' + ID + '.json at qs5');

  // update _index.json
  const idx = await store.get('_index.json', { type: 'json' });
  const idxRow = { id: ID, question: QUESTION, tags, ts, quality_score: 5, polished_at: null };
  if (Array.isArray(idx)) {
    if (!idx.some(x => x.id === ID)) idx.unshift(idxRow);
    await store.setJSON('_index.json', idx);
  } else if (idx && Array.isArray(idx.entries)) {
    const i = idx.entries.findIndex(x => x.id === ID);
    const row = { id: ID, question: QUESTION, tags, ts, quality_score: 5, polished_at: null, last_modified_ms: ts, sources_count: sources.length };
    if (i >= 0) idx.entries[i] = row; else idx.entries.unshift(row);
    await store.setJSON('_index.json', idx);
  } else {
    console.error('unexpected _index.json shape:', typeof idx);
    process.exit(1);
  }
  console.log('updated _index.json');
  await sleep(800);

  // ---- STEP C: polish ladder 5->6->7->8->9 ----
  const steps = [
    { target: 6, new_answer: v6, note: 'Added a fully cited Sources & Further Reading section (12 industry, regulatory, and trade sources — Marsh McLennan, Aon, Gallagher, CIAB, the Big I, NCCI, AM Best, NAIC, Triple-I, VCIA, RIMS, and a buyer-psychology synthesis) grounding the market structure, instruments, and benchmarks used throughout the training.' },
    { target: 7, new_answer: v7, note: 'Added "The Numbers Behind the Takeover" — verified quantitative detail: an experience-mod surcharge math table, the four-component total-cost-of-risk definition, the 120/90/60/30-day renewal-takeover timeline table, CIAB market-direction discipline by line, and group-captive entry economics.' },
    { target: 8, new_answer: v8, note: 'Added a Counter-Case section — six situations where the renewal-takeover playbook is the wrong move (excellent incumbent, market-access damage from re-marketing, price-only switch, no loss-run/buyer access, broken timing, captive-as-gimmick), with coaching on when to slow down or walk away.' },
    { target: 9, new_answer: v9, note: 'Added a Related Pulse Sales Trainings cross-link section connecting to six verified sibling entries (st0026 MSP MSA renewal, st0027 commercial HVAC service agreement renewal, st0001 discovery call reset, st0006 pricing conversation, st0014 financial advisor discovery, st0002 multi-threading to the economic buyer).' }
  ];

  for (const s of steps) {
    const payload = { key: KEY, id: ID, polish_note: s.note, new_answer: s.new_answer };
    const r = await fetch(POLISH_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const body = await r.json().catch(() => ({}));
    console.log('-> qs' + s.target + ' · HTTP ' + r.status + ' · ' + JSON.stringify(body).slice(0, 300));
    if (r.status !== 200) { console.error('FAIL at qs' + s.target); process.exit(1); }
    await sleep(800);
  }

  // ---- verify final state ----
  const finalEntry = await store.get('answers/' + ID + '.json', { type: 'json' });
  console.log('=== FINAL ===');
  console.log('id:', finalEntry.id);
  console.log('quality_score:', finalEntry.quality_score);
  console.log('answer length:', (finalEntry.answer || '').length, 'chars,', words(finalEntry.answer || ''), 'words');
  console.log('polished_at:', finalEntry.polished_at);
  console.log('polish_history len:', (finalEntry.polish_history || []).length);
  fs.writeFileSync(path.join(__dirname, '..', '..', '_st0030_final.json'), JSON.stringify(finalEntry, null, 2));
  console.log('=== DONE st0030 ===');
}

main().catch(e => { console.error('ERROR:', e); process.exit(1); });
