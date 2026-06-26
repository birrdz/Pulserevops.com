## Operating Cadence: The Monthly FX Risk Committee

A hedge program does not run itself. The instruments, the policy, and the technology stack are inert until a recurring human forum reviews exposure, approves trades, and owns the variances. Across multi-currency operators, the single most reliable predictor of whether an FX program survives its second year is not the sophistication of the models — it is the existence of a disciplined monthly cadence with a named owner, a fixed agenda, and a decision log.

### 1. Why The Committee Beats Ad-Hoc Hedging

Ad-hoc hedging fails in three predictable ways. First, it is **emotionally reactive**: trades get placed after a painful currency move, locking in the worst rate, which is the textbook definition of buying insurance after the house has burned. Second, it is **personality-dependent**: when the one treasurer who "watches FX" goes on leave or quits, coverage silently lapses. Third, it is **unauditable**: with no minutes and no decision log, neither the audit committee nor the external auditor can confirm the policy was followed, which turns every hedge into a potential ASC 815 documentation failure.

A standing FX Risk Committee converts hedging from a heroic individual act into a **boring, repeatable process**. Companies that institutionalize this — the treasury functions at firms like Microsoft (MSFT), Coca-Cola (KO), and Netflix (NFLX) — describe their FX programs in investor communications as mechanical and rules-based precisely because the committee removes discretion from the moment of stress. The committee is where coverage ratios get reaffirmed, where exceptions get documented, and where the CFO gets a one-page exposure summary that can be defended to the board.

### 2. Committee Charter, Membership, And Decision Rights

The committee needs a written charter, approved by the CFO and ratified by the audit committee, that fixes its mandate, membership, quorum, and escalation thresholds. Vague mandates produce vague meetings.

| Role | Title | Committee responsibility |
|---|---|---|
| **Chair** | VP Treasury or Treasurer | Owns the agenda, calls the meeting, signs the minutes |
| **Exposure owner** | FP&A Director | Brings the refreshed exposure map and forecast variances |
| **Execution owner** | Treasury Manager / FX Dealer | Reports fills, mark-to-market, and counterparty utilization |
| **Accounting owner** | Technical Accounting Manager | Confirms hedge documentation and effectiveness testing status |
| **Sponsor** | CFO (or delegate) | Approves out-of-policy exceptions, owns the board narrative |
| **Independent check** | Internal Audit (observer) | Attends quarterly; tests adherence to the policy |

Decision rights must be **explicit and tiered**. A useful structure: the Treasury Manager can execute any trade inside the approved policy band without further sign-off; trades that move coverage outside the band require Chair approval; any tenor extension beyond 18 months or any use of a new instrument class requires CFO approval; and changes to the policy itself require audit-committee ratification. Writing these tiers down is what lets the program move fast on routine trades while keeping a hard brake on the unusual ones.

### 3. The Standing Monthly Agenda

A committee meeting that improvises its agenda will spend 40 minutes on whatever currency moved most last week and never get to the structural questions. The agenda below is deliberately fixed; the chair runs it in order every month.

| Agenda item | Owner | Time | Output |
|---|---|---|---|
| **1. Exposure refresh** | FP&A Director | 10 min | Updated exposure map vs. prior month |
| **2. Forecast accuracy review** | FP&A Director | 5 min | Forecast-vs-actual variance by zone |
| **3. Hedge position & MTM** | Treasury Manager | 10 min | Coverage ratio by zone, mark-to-market |
| **4. Policy compliance check** | Treasury Manager | 5 min | Exceptions log, band breaches |
| **5. New trade recommendations** | Treasury Manager | 10 min | Proposed forwards/options for approval |
| **6. Hedge accounting status** | Technical Accounting | 5 min | Effectiveness test results, dedesignations |
| **7. Counterparty & limit review** | Treasury Manager | 5 min | Credit utilization vs. limits |
| **8. Decisions & actions** | Chair | 5 min | Signed decision log, action owners |

The discipline is in items 2, 4, and 6 — the items that ad-hoc hedging skips. Forecast accuracy review is where you discover that the Brazil sales team systematically over-forecasts by 20%, which means you have been over-hedging BRL and paying carry on phantom revenue. The policy compliance check is where a 3-month-old band breach gets caught before the auditor finds it. The hedge accounting status item is what keeps a designated cash-flow hedge from quietly failing its effectiveness test and dumping volatility into the P&L.

### 4. The Decision Log And Audit Trail

Every committee decision must be captured in a **decision log** — a running register, not buried in prose minutes. Each row records: date, decision, rationale, the exposure or trade affected, who approved it, and the policy clause it relies on. When the external auditor or the audit committee asks "why did coverage on EUR drop from 75% to 55% in March," the answer is one row in the log, not a forensic reconstruction of email threads.

The decision log is also the **hedge documentation backbone** for ASC 815 and IFRS 9. Hedge accounting requires contemporaneous documentation of the hedge relationship, the risk being hedged, and the effectiveness assessment method. A committee that logs every designation decision at the moment it is made has, almost as a byproduct, produced the documentation the standards demand. A committee that logs nothing has to manufacture documentation after the fact — which is exactly the pattern that draws a material-weakness finding.

### 5. Quarterly And Annual Overlays

The monthly cadence handles execution. Two slower loops handle structure:

- **Quarterly policy review.** Once a quarter, the committee steps back from individual trades and asks whether the policy still fits the business. Has a new currency zone crossed the materiality threshold? Has volatility in an existing pair shifted enough to warrant a different coverage ratio? Should the tenor ladder be extended? Internal Audit attends this session.
- **Annual board reaffirmation.** Once a year, the CFO takes the FX policy to the board (or audit committee) for formal reaffirmation. This is not a rubber stamp — it is the governance event that makes the policy a board-owned mandate rather than a treasury preference, which matters enormously when a bad year produces a painful constant-currency gap and someone asks who approved the strategy.

The cadence, then, is a nested set of loops: monthly execution, quarterly structure, annual governance. Each loop has a named owner and a documented output, and together they convert FX risk from a source of surprise into a managed, reportable line of work.

---

## Common Failure Modes And How To Avoid Them

Multi-currency FX programs rarely fail because the math was wrong. They fail because of process gaps, organizational blind spots, and a handful of seductive mistakes that look reasonable in the moment. The failure modes below are the ones that recur across treasury post-mortems; each is paired with the specific control that prevents it.

### 1. Hedging The Forecast Instead Of The Exposure

The most common and most expensive error is treating the revenue forecast as if it were a firm commitment. Forecasts are wrong — systematically and directionally. If the Brazil team consistently over-forecasts BRL revenue by 20% and treasury hedges 80% of the forecast, the company is effectively hedging 96% of *actual* revenue, and the 16-point overshoot is a speculative short BRL position that the policy never authorized.

**The control:** hedge layered tranches against forecast-confidence bands, not the raw forecast. Hedge a high ratio (70-90%) against the high-confidence near-term tranche, a moderate ratio (40-60%) against the medium tranche, and a low ratio (0-25%) against the speculative far tranche. Feed every committee meeting a forecast-vs-actual variance report so the bias becomes visible and the ratios get recalibrated.

### 2. Confusing Translation Exposure With Cash Exposure

Translation (or accounting) exposure moves reported equity and OCI when foreign subsidiaries are consolidated; it does not, by itself, move cash. Transaction exposure moves cash. Teams that hedge translation exposure with cash instruments — buying forwards to "protect" the book value of a foreign subsidiary — spend real cash carry to smooth an accounting number, and frequently create transaction exposure where none existed.

**The control:** classify every exposure as transactional, translational, or economic before deciding whether and how to hedge it (the taxonomy established earlier in this entry). Hedge transaction exposure as a default; hedge translation exposure only deliberately, only with net-investment hedges, and only when the policy explicitly says so. Operators such as Philip Morris International (PM) and Diageo (DEO) are explicit in disclosures that they hedge transaction exposure far more aggressively than translation exposure, precisely because confusing the two burns cash.

### 3. The Single-Counterparty Concentration Trap

A treasury team builds a comfortable relationship with one relationship bank and routes every forward and option through it. The pricing is fine, the operations are smooth — until that bank's credit deteriorates, or it pulls a credit line during a market stress event, or a margin call lands at the worst possible moment with no diversified relationships to lean on.

| Counterparty exposure issue | Symptom | Mitigation |
|---|---|---|
| **Credit concentration** | >50% of notional with one bank | Spread across 3-5 ISDA counterparties |
| **Pricing opacity** | No competitive quotes | Require 2+ quotes on trades above a threshold |
| **Margin/collateral shock** | CSA call drains liquidity | Model worst-case CSA calls into the liquidity buffer |
| **Documentation gap** | Trading before ISDA/CSA signed | No trade until master agreements are executed |

**The control:** maintain a panel of 3-5 ISDA-papered counterparties, set a per-counterparty notional limit in the policy, and review credit utilization at every monthly committee meeting.

### 4. Letting Hedge Accounting Lapse Into P&L Volatility

A company designates its forwards as cash-flow hedges, enjoys the smooth P&L for a year, and then a forecast transaction is no longer probable — or the hedge ratio drifts and the effectiveness test fails. Without anyone noticing, the hedge is dedesignated, and mark-to-market starts flowing straight through the income statement, producing exactly the earnings volatility the program was built to eliminate.

**The control:** make hedge-accounting effectiveness a standing monthly agenda item owned by technical accounting. Run effectiveness testing on schedule, document every designation and dedesignation contemporaneously in the decision log, and alert the committee the moment a forecast transaction's probability weakens. The earlier section on ASC 815 and IFRS 9 mechanics is only protective if someone monitors it monthly.

### 5. Over-Hedging Into A Carry Bleed

In a high-interest-rate-differential pair — selling forward a high-yield currency like the Brazilian real, Mexican peso, or Indian rupee against the US dollar — the forward points are large and the cost of carry is real. A team that hedges 100% of every exposure at long tenors can spend several percent of revenue per year on carry, quietly eroding the very margin it set out to protect.

**The control:** treat the forward-points cost as an explicit line item in the hedge cost-benefit analysis. Hedge high-carry currencies at lower ratios and shorter tenors; consider options or collars where the carry on a forward is punitive; and report total hedge cost (carry plus premium) to the committee every month so the bleed is visible rather than hidden.

### 6. The Natural Hedge That Was Never Counted

A company books USD-functional FX losses on its euro revenue while, two floors away, its European subsidiary pays euro-denominated salaries, rent, and vendor invoices. The euro costs are a natural offset to the euro revenue — but because exposure is measured gross at the revenue line rather than net of in-currency costs, treasury hedges the full gross euro revenue and pays to hedge an exposure that was already 40% self-neutralizing.

**The control:** always measure **net exposure by currency** — revenue minus same-currency costs minus same-currency financing — before sizing any hedge. Inventory natural hedges first; hedge only the residual. This is the cheapest risk reduction available and it is routinely missed because revenue and cost data live in different systems.

### 7. No Owner, No Cadence, No Memory

The quietest failure mode: the program has no single named owner, the committee meets "when something happens," and institutional memory walks out the door with the last treasurer. Six months later nobody can explain why coverage is where it is, the policy is a stale PDF, and the next currency shock is met with improvisation.

**The control:** the monthly committee, the written charter, and the decision log described in the prior section. Every one of the failure modes above is, at root, a governance failure — and governance is the cheapest insurance in the entire program.

---

## A 90-Day Rollout Plan For The FX Risk Program

A multi-currency FX program does not need to be built all at once, and it should not be. The rollout below stages the work over 90 days so that each phase produces a usable artifact, exposure gets covered progressively rather than all-or-nothing, and the organization builds the governance muscle before it builds the trading muscle. The plan assumes a company that has crossed four currency zones and currently runs little or no formal hedging.

### 1. Phase One — Days 1 To 30: Measure And Mandate

The first month produces no trades. It produces **visibility and authority** — the two things without which any trade is premature.

| Week | Workstream | Deliverable |
|---|---|---|
| **Week 1** | Stand up the project; name the owner | Project charter, executive sponsor confirmed |
| **Week 2** | Build the multi-currency exposure map | Net exposure by currency, transaction vs. translation |
| **Week 3** | Quantify exposure: VaR and EaR baseline | Earnings-at-risk figure with confidence interval |
| **Week 4** | Draft the FX hedging policy | Policy document ready for CFO/audit-committee review |

The non-negotiable Phase One output is a one-page exposure summary that the CFO can read in two minutes: here are our currency zones, here is net exposure in each, here is the earnings-at-risk number, here is what an adverse move costs. That single page is what converts "we should probably hedge" into a funded, sponsored program. If the exposure map and the EaR figure are not done by Day 30, the rollout is already behind, because everything downstream depends on them.

### 2. Phase Two — Days 31 To 60: Policy, Plumbing, And First Hedges

With visibility and a draft policy in hand, the second month builds the operational machinery and places the first conservative hedges.

| Week | Workstream | Deliverable |
|---|---|---|
| **Week 5** | Ratify the policy; open ISDA discussions | Board/audit-committee-approved policy |
| **Week 6** | Onboard 3-5 counterparties; sign ISDAs/CSAs | Executed master agreements, credit limits set |
| **Week 7** | Select and configure the TMS / treasury tooling | Exposure feed and trade capture configured |
| **Week 8** | Execute the first tranche of hedges | Layered forwards on near-term, high-confidence exposure |

The first hedges should be deliberately unambitious: short-tenor forwards on the most material and most confident exposure tranche, sized conservatively inside the policy band. The goal of Week 8 is not optimal coverage — it is to run the full cycle once (recommend, approve, execute, capture, document) so that every system and handoff gets tested on a small, low-risk trade rather than discovered mid-crisis. Hedge accounting designation begins here too, with technical accounting documenting the first cash-flow hedge relationship contemporaneously.

### 3. Phase Three — Days 61 To 90: Scale Coverage And Institutionalize

The third month scales coverage toward the policy target and locks in the cadence that makes the program durable.

| Week | Workstream | Deliverable |
|---|---|---|
| **Week 9** | Layer hedges across remaining zones and tranches | Coverage at policy-target ratios across all material zones |
| **Week 10** | Build the FX dashboard and reporting pack | Live coverage, MTM, and EaR dashboard |
| **Week 11** | Run the first formal monthly FX Risk Committee | Signed minutes and decision log |
| **Week 12** | Prepare the first constant-currency investor view | Constant-currency revenue bridge for IR |

By Day 90 the program is fully operational: material exposure is covered at policy ratios, hedge accounting is designated and tested, a dashboard reports the state of the book, the monthly committee has met at least once with a signed decision log, and the investor-communication layer can produce a constant-currency bridge. The program is no longer a project — it is a process.

### 4. Sequencing Risks To Watch During Rollout

Three sequencing mistakes can derail an otherwise sound plan:

- **Trading before papering.** Executing a forward before the ISDA and CSA are signed creates legal and credit exposure with no master agreement to govern it. ISDA execution in Phase Two is a hard gate — no trade crosses it unsigned.
- **Hedging before measuring.** Placing hedges before the exposure map is validated risks hedging gross instead of net, missing natural offsets, and over-hedging an over-forecast. Phase One must finish before Phase Two trades.
- **Building tooling before policy.** Configuring a TMS before the policy defines coverage bands and tenor ladders means the system encodes assumptions that the policy may later contradict. Policy ratification precedes tooling configuration.

Run the phases in order, treat each gate as a real gate, and the 90-day plan produces a defensible program with no heroic sprint at the end.

---

## Metrics, Dashboards, And Proving The Program Works

An FX program that cannot prove its own effectiveness will lose its budget the first time a currency moves against the company despite the hedges — because without metrics, "we hedged and still lost money" reads as failure rather than as the expected, designed-for outcome. The metrics layer exists to make the program legible: to the CFO, to the board, to the auditor, and to investors. A hedge program is working when the *volatility* of FX-affected results falls, not when FX never costs anything.

### 1. The Core Metric Set

A small, stable set of metrics is far more useful than a sprawling one. Six numbers cover the program.

| Metric | What it measures | Healthy range / target |
|---|---|---|
| **Hedge coverage ratio** | % of net exposure hedged, by zone | Within policy band (e.g., 50-80%) |
| **Earnings-at-risk (EaR)** | Worst-case earnings impact at a confidence level | Below the board-set tolerance |
| **Residual (unhedged) exposure** | Net exposure not covered by hedges | Deliberate, within policy |
| **Hedge effectiveness ratio** | Hedge gain/loss vs. hedged-item loss/gain | 80-125% (ASC 815 / IFRS 9 zone) |
| **Total hedge cost** | Forward-points carry + option premium | Tracked vs. budget |
| **Forecast accuracy** | Forecast vs. actual revenue by currency | Bias trending toward zero |

The discipline is to report **the same six numbers every month**, by currency zone, so trends are visible. A coverage ratio drifting below the band, an EaR creeping above tolerance, or a forecast bias that never closes are all early-warning signals that the monthly committee can act on before they become a board-level surprise.

### 2. The FX Risk Dashboard

The dashboard is the committee's single source of truth and the artifact the CFO screenshots into the board pack. It should be one screen, organized top to bottom:

- **Exposure band.** Net exposure by currency, transaction vs. translation, with the largest zones highlighted. This is the "what are we exposed to" layer.
- **Coverage band.** Hedge coverage ratio by currency against the policy band, color-coded — green inside the band, amber drifting, red breached. This is the "are we covered" layer.
- **Risk band.** Current earnings-at-risk against the board tolerance line, plus a residual-exposure figure. This is the "how much can still hurt us" layer.
- **Cost and accounting band.** Total hedge cost month-to-date and year-to-date against budget, plus hedge-effectiveness test status (pass/fail by relationship). This is the "what is it costing and is the accounting clean" layer.

The design principle is **exception visibility**: a committee member should be able to glance at the dashboard and see, in under ten seconds, whether anything is outside policy. Detail lives underneath; the top screen surfaces only what needs a decision.

### 3. Proving Effectiveness To The Board And Investors

Boards and investors do not want to hear that FX never cost anything — they want evidence that FX results became *predictable*. Three proof points carry that argument.

| Proof point | Evidence | Audience |
|---|---|---|
| **Volatility reduction** | Standard deviation of FX-affected earnings, pre- vs. post-program | Board, CFO |
| **Constant-currency clarity** | A reconciled constant-currency revenue bridge every quarter | Investors, IR |
| **Outcome vs. design** | Actual loss compared against the modeled EaR distribution | Board, audit committee |

The most powerful single chart is **earnings volatility before and after** the hedge program: if the spread of quarterly FX impact narrows materially, the program is doing its job, regardless of whether any individual quarter showed a hedge gain or loss. The constant-currency revenue bridge — the layer where companies like Salesforce (CRM), ServiceNow (NOW), and SAP (SAP) translate growth into a currency-neutral figure for investors — proves that management can separate operating performance from FX noise. And comparing the actual worst-case loss against the modeled EaR distribution proves the model was calibrated: a loss that lands inside the predicted distribution validates the program even when it is painful.

### 4. The Quarterly Hedge-Program Scorecard

Once a quarter, the monthly metrics roll up into a one-page scorecard for the audit committee. It answers four questions in four lines:

- **Were we covered to policy?** Average coverage ratio by zone vs. the policy band.
- **Did the program reduce volatility?** Standard deviation of FX impact, this period vs. baseline.
- **Was the accounting clean?** Count of hedge relationships, effectiveness pass rate, any dedesignations.
- **What did it cost?** Total hedge cost as a percentage of revenue, vs. budget.

A scorecard that answers those four questions, backed by the monthly dashboard and the committee's decision log, is what makes the FX program defensible. It converts a function that would otherwise be judged on the unfair standard of "did we lose money on currency" into one judged on the correct standard: did we make currency outcomes predictable, well-governed, and within the tolerance the board approved. That is what proving the program works actually means.
