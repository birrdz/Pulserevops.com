## Instrument Selection: Forwards, Options, Collars, and Natural Hedges

Once you have quantified exposure and set coverage ratios, the program lives or dies on instrument choice. The same 60% coverage target on a EUR receivable book can cost 4 basis points or 90 basis points of revenue depending on what you transact. Instrument selection is where treasury earns its seat at the table — and where finance leaders most often default to the wrong tool because it is the one their bank pitched hardest.

### 1. The Instrument Decision Framework

Every hedging instrument trades off three properties: **cost certainty**, **outcome certainty**, and **upside participation**. You cannot maximize all three. A forward locks the rate and costs nothing upfront, but you forfeit any favorable move. A bought option preserves upside but charges a premium. A collar splits the difference. The discipline is to map each exposure type to the instrument whose tradeoff matches the exposure's behavior, rather than running one instrument across the whole book.

The framework that survives audit committee scrutiny ties instrument to **forecast confidence**. Highly certain exposures — a signed multi-year EUR contract with a fixed invoice schedule — belong in forwards, because the only risk is the rate, not the existence of the cash flow. Probabilistic exposures — pipeline-weighted bookings in a new GBP region — belong in options, because you do not want to be over-hedged if the deals slip. Forward-hedging forecast revenue that then does not materialize leaves treasury holding a derivative against a cash flow that never arrives, and that orphaned forward becomes a speculative position the moment the underlying disappears.

| Instrument | Upfront cost | Upside retained | Best-fit exposure | Typical tenor |
|---|---|---|---|---|
| Outright forward | Zero (rate embedded) | None | Contracted, high-certainty receivables/payables | 1-12 months |
| Bought vanilla option | Premium 0.8-2.5% notional | Full | Forecast/pipeline revenue, M&A contingencies | 3-12 months |
| Zero-cost collar | Zero net | Partial (capped) | Medium-certainty forecast revenue | 3-9 months |
| Participating forward | Zero net | Partial (ratio) | Forecast revenue where some upside matters | 3-9 months |
| Cross-currency swap | Spread embedded | None | Long-dated debt and intercompany loan FX | 1-7 years |
| Natural hedge | Zero | N/A | Structural cost/revenue currency matching | Permanent |

### 2. Forwards: The Workhorse and Its Hidden Costs

The outright forward is the default instrument for a reason: it is liquid, cheap, and produces a deterministic outcome. For a company with predictable invoice schedules across EUR, GBP, CAD, and AUD, a laddered forward program covering 50-70% of the next 12 months of contracted revenue is the right backbone. The forward rate is simply spot adjusted by the interest rate differential between the two currencies — the "forward points" — so there is no premium to expense.

The hidden costs are three. First, **credit lines**: every forward consumes counterparty credit, and a fast-scaling company can exhaust its uncommitted FX lines just as it needs them most — negotiate committed lines with your banking syndicate before you need them. Second, **margin and CSA terms**: forwards under a Credit Support Annex can trigger collateral calls when rates move against you, a liquidity drain at exactly the wrong moment. Workday (WDAY) treasurers explicitly model this collateral drag in their cash forecasts. Third, **mark-to-market volatility on the balance sheet** if hedge accounting is not applied — covered in the next section.

The right structure for forwards is a **rolling layered ladder**: hedge declining percentages of revenue further out — say 80% of the nearest quarter, 60% of the next, 40% of the third, 20% of the fourth — and roll the ladder forward each month. This smooths the blended rate, avoids point-in-time rate bets, and means no single forecast revision blows up the program.

### 3. Options and Collars: Paying for Asymmetry

Options matter when the exposure itself is uncertain. A US software firm opening a Japan entity and forecasting JPY revenue it has never booked before should not forward-hedge that forecast. Buy puts on JPY/USD instead (the right to sell yen at a floor). If the revenue materializes, the floor protects margin; if it does not, the maximum loss is the premium — far cheaper than unwinding an over-hedged forward book.

The **zero-cost collar** is the instrument finance leaders reach for when an option premium is hard to defend to a cost-conscious CFO. You buy the protective put and simultaneously sell a call to fund it, netting zero upfront cost; the trade-off is a cap on favorable participation at the call strike. For medium-certainty forecast revenue, a collar that protects below, say, 1.05 EUR/USD and caps above 1.15 bounds the outcome on both sides for free. Adobe (ADBE) and Salesforce (CRM) both disclose option and collar usage alongside forwards precisely because their forecast revenue carries genuine probability weighting that pure forwards cannot honor. The **participating forward** is a middle option: zero net cost, a hedged rate, and a defined ratio — often 50% — of any favorable move retained.

### 4. Natural Hedges: The Cheapest Hedge Is the One You Never Trade

Before any derivative, the program should exhaust natural hedges, because they cost nothing and never expire. A natural hedge is structural alignment: matching the currency of your costs to the currency of your revenue so the exposure cancels inside the operating model.

Three practical levers. **Localize the cost base**: a company earning meaningful EUR revenue should pay euro-denominated salaries, hosting, and vendor costs out of that revenue rather than converting to USD and back — Spotify (SPOT), earning across dozens of currencies, deliberately builds cost centers in its major revenue currencies. **Currency-match debt**: financing a European acquisition with euro-denominated debt means interest and principal are serviced by euro cash flows, neutralizing the loan's FX exposure structurally; Booking Holdings (BKNG), with euro-heavy revenue, has historically held euro-denominated debt for exactly this reason. **Build regional delivery teams paid in the local currency** so the margin on that region becomes far less FX-sensitive.

The natural hedge's one cost is reduced flexibility — you cannot freely move cash to where returns are highest. But for the structural, permanent portion of exposure it is almost always superior to a perpetually rolled derivative. The rule: **use natural hedges for the permanent base layer, and derivatives only for the residual transactional and forecast layers on top.**

### 5. Building the Instrument Mix by Layer

The mature program does not pick one instrument; it layers them against the exposure stack.

| Exposure layer | Certainty | Instrument | Coverage target |
|---|---|---|---|
| Structural cost/revenue mismatch | Permanent | Natural hedge (localization, currency-matched debt) | As feasible |
| Contracted backlog (signed, scheduled) | Very high | Layered forward ladder | 70-90% |
| Forecast recurring revenue (predictable renewals) | High | Forward ladder, declining by tenor | 40-70% |
| Pipeline / new-zone forecast revenue | Medium-low | Bought options or collars | 25-50% |
| Intercompany loans and long-dated debt | High | Cross-currency swaps | 90-100% |
| Translational exposure on net assets | Ongoing | Selective net-investment hedges | 0-50%, policy call |

The blended cost of this mix should be a tracked metric. A well-run program at a $300M-revenue company with four to six currency zones typically spends 8-20 basis points of hedged revenue per year on premiums and forward points combined. Spend above 30 basis points and you are over-using options on exposures certain enough for forwards; spend under 5 and you are almost certainly under-hedged on the uncertain layers, carrying forecast risk you have not priced.

---

## ASC 815 vs IFRS 9 Hedge Accounting Mechanics

Hedge accounting is the most under-appreciated part of an FX program, and the place where a technically correct hedge can still produce an ugly income statement. The economics of a hedge can be perfect while the accounting makes earnings look volatile — and the audit committee reacts to the accounting, not the economics. If you scale across four-plus currency zones without designing the accounting treatment in parallel with the trades, you will spend board meetings explaining mark-to-market noise that has nothing to do with the business.

### 1. The Core Problem Hedge Accounting Solves

A derivative is, by default, marked to fair value through profit and loss every reporting period. The hedged item — a forecast EUR sale, for example — is not yet on the books. So in the default world the hedge's gains and losses hit earnings now, while the offsetting revenue lands later. The two halves of an economically matched position are recognized in different periods, producing reported earnings volatility that is an accounting artifact.

Hedge accounting is the elective regime that re-synchronizes the timing. It lets you defer the derivative's gains and losses in equity — Other Comprehensive Income, or OCI — until the hedged revenue is recognized, at which point both release to earnings together. The economics were always matched; hedge accounting makes the accounting reflect that. It is elective — you must opt in, document, and prove it — which is why so many otherwise sophisticated programs skip it and then suffer the earnings noise.

### 2. ASC 815 — The US GAAP Framework

Under ASC 815, FX revenue programs almost always use the **cash flow hedge** model. The mechanics:

- **Designation and documentation at inception.** Before or at the trade date, you must formally document the hedging relationship — the hedged item (e.g., "the first $5M of forecasted EUR-denominated subscription revenue in Q3 2026"), the hedging instrument, the risk hedged, and the effectiveness method. Documentation written after the trade is invalid — the most common cause of a denied designation.
- **Effective portion to OCI.** The change in the derivative's fair value attributable to the hedged risk goes to OCI, not earnings.
- **Reclassification on recognition.** When the forecast revenue is recognized, the accumulated OCI amount is reclassified into the same income statement line — revenue — so the hedged rate is what shows up.
- **The 2017 ASU simplification.** ASU 2017-12 removed the old requirement to separately measure and record hedge ineffectiveness in earnings each period; for a qualifying hedge the entire fair-value change can go to OCI. This is why post-2018 FX programs are far cleaner, and why any company still running pre-2017 mental models should revisit its treatment.

The qualifying bar is **highly probable forecast transactions** — you cannot cash-flow-hedge revenue that is merely possible. This is the accounting reason the prior section insists on forwards for contracted backlog and options for pipeline: options on uncertain revenue often cannot get cash flow hedge designation. Treasurers at NVIDIA (NVDA) and Microsoft (MSFT) disclose exactly which forecast horizons they treat as highly probable, and keep that horizon conservative to protect designation.

### 3. IFRS 9 — The Framework for Your Non-US Entities

If you scale across four-plus currency zones, you almost certainly have subsidiaries reporting under IFRS, and IFRS 9 governs hedge accounting there. The philosophy is the same — defer to OCI, release with the hedged item — but the mechanics differ in ways that matter operationally.

| Dimension | ASC 815 (US GAAP) | IFRS 9 |
|---|---|---|
| Effectiveness test | Quantitative historically; eased post-2017 | Principles-based "economic relationship," no bright-line 80-125% rule |
| Retrospective testing | Not required for qualifying hedges post-ASU 2017-12 | Not required; prospective assessment only |
| Cost of hedging (option time value) | Time-value changes can be excluded and deferred | Treated as a "cost of hedging," deferred in a separate OCI reserve |
| Rebalancing | Not a formal concept; de-designate and re-designate | Formal rebalancing of the hedge ratio permitted without de-designation |
| Voluntary de-designation | Permitted | Not permitted unless the risk objective changes |

The practical consequence: **your US parent and your IFRS subsidiaries can account for the same economic hedge differently**, and group consolidation must reconcile the two. The most common pain point is IFRS 9's prohibition on voluntary de-designation — under US GAAP a treasurer can unwind a designation at will, while under IFRS the relationship ends only if the risk objective genuinely changes or the hedged item is no longer expected. Build that asymmetry into the trade lifecycle so a routine US-side adjustment does not strand an IFRS designation.

### 4. Net Investment Hedges — Translational Exposure

Cash flow hedges address transactional exposure. For translational exposure — the swing in a foreign subsidiary's net assets on consolidation — both frameworks offer the **net investment hedge**, where the instrument's effective gains and losses go to the cumulative translation adjustment within OCI, offsetting the translation of the subsidiary's net assets. Companies use foreign-currency debt or forwards for this. It is a board-policy decision, not a default: hedging translation protects book equity but consumes cash and credit, and many companies deliberately leave translational exposure unhedged because it does not affect cash flow. The decision belongs in the FX policy, debated explicitly.

### 5. The Operational Discipline That Keeps Designation Alive

Hedge accounting failures are almost never about the math; they are about process. Four disciplines keep the regime intact:

- **Designation memos before the trade.** A standing template, completed and dated before execution, signed by treasury and reviewed by technical accounting. No memo, no designation.
- **A hedge effectiveness calendar.** Even with eased testing, prospective assessments and documentation reviews must happen on schedule; missing a period can break the designation retroactively.
- **The "highly probable" guardrail.** Sales and FP&A own the forecast treasury hedges. If forecast revenue is routinely missed, the "highly probable" assertion collapses — tie hedge sizing to forecast accuracy track record, not optimism.
- **A de-designation playbook.** When a forecast transaction becomes no longer probable, GAAP requires immediate reclassification of the related OCI balance to earnings. Have the playbook ready, because discovering it during the audit is far worse.

The payoff for getting this right is concrete: earnings that move with the business, not with the spot market. That is the difference between an FX program the board trusts and one it interrogates every quarter.

---

## Constant-Currency Reporting and the Investor Communication Layer

A hedge program protects cash and margin. It does not, by itself, make the growth story legible to investors. That is the job of the reporting layer — and for a company scaling across four-plus currency zones, constant-currency reporting is not a nicety. It is the difference between investors seeing your real growth rate and investors seeing a number distorted by the dollar.

### 1. Why Constant-Currency Is Non-Negotiable Past Four Zones

When revenue spans EUR, GBP, JPY, CAD, AUD, and more, reported USD growth is a blend of two things: how the business actually grew, and how those currencies moved against the dollar. In a year when the dollar strengthens broadly, a company growing 22% in local-currency terms can report 15% growth in USD. The 7-point gap is pure FX, and investors who cannot see through it will mis-value the company — usually downward, because they cannot tell whether the slowdown is operational or mechanical.

**Constant-currency (or "FX-neutral") growth** strips this out. You recompute the current period's foreign revenue using the prior period's exchange rates, so the only thing that changes is the business. The result isolates operational performance. Every large multi-currency company — Salesforce (CRM), SAP (SAP), Adobe (ADBE), ServiceNow (NOW) — reports both as-reported and constant-currency growth precisely because investors demand the bridge. Past four currency zones, omitting it signals either unsophistication or something to hide.

### 2. The Constant-Currency Calculation

The method must be consistent and disclosed.

| Method | How it works | Use case |
|---|---|---|
| Prior-period rate method | Translate current-period local revenue at the average rate from the comparable prior period | Most common for YoY growth-rate reporting |
| Budget-rate method | Translate actuals at the rates assumed in the annual plan | Internal performance vs. plan; isolates rate variance from operating variance |

A worked example. Suppose EUR revenue was 100M EUR last year at an average 1.10 USD/EUR (= $110M reported) and 115M EUR this year at an average 1.05 USD/EUR (= $120.75M reported). As-reported growth is 9.8%. Constant-currency growth re-translates this year's 115M EUR at last year's 1.10 rate = $126.5M, against $110M last year — **15% constant-currency growth.** The 5.2-point gap is the FX headwind. That bridge — "we grew 15% in constant currency; a stronger dollar reduced reported growth to 9.8%" — is exactly the sentence investors need.

A critical discipline: **constant-currency is a presentation of operating performance, not a measure of the hedge.** The hedge protects cash flow and margin; constant-currency reporting explains the top line. The hedge result shows up in the realized rate on revenue and in hedge gains/losses; the constant-currency figure shows up in the growth-rate bridge. Investors should hear both, framed separately.

### 3. The FX Bridge — The Slide Investors Actually Want

The single most valuable artifact is the **FX bridge**: a waterfall reconciling prior-period revenue to current-period revenue, with FX broken out as its own bar. A clean bridge has four components — prior period revenue (starting bar), organic/operational growth (the constant-currency contribution), FX impact (the translation effect, isolated), and current period revenue (ending bar).

When the FX bar is negative and material, the CFO should name it on the earnings call before an analyst does: "Reported revenue grew 10%; on a constant-currency basis we grew 15%; FX was a 5-point headwind driven primarily by EUR and JPY weakness." This pre-empts the question, demonstrates command of the numbers, and frames the dollar move as exogenous rather than a performance miss. The companies that handle FX questions worst are the ones that wait to be asked.

### 4. Guidance in a Multi-Currency World

Guidance is where FX communication most often goes wrong. Three practices separate disciplined issuers from the rest:

- **State the FX assumption.** When you issue revenue guidance, disclose the exchange rates it assumes; then a later guidance revision can be attributed cleanly to FX rather than operations.
- **Guide in constant currency where possible.** Increasingly, multi-currency companies provide guidance ranges in constant-currency terms, removing the burden of forecasting exchange rates from the operating guide entirely.
- **Quantify FX sensitivity.** A short disclosure — "a 5% move in the EUR/USD rate changes annual revenue by approximately $X million" — lets analysts model FX themselves and stops them over- or under-estimating the exposure.

The hedge program connects here. Because forwards lock a known rate on a large share of near-term revenue, the company can guide with more confidence on the hedged portion and disclose the residual unhedged sensitivity — telling investors, in effect, "70% of the next two quarters of EUR revenue is hedged at a blended 1.08; only the remaining 30% is exposed to spot." That is a far stronger guidance posture than a fully unhedged peer, and a genuine, disclosable benefit of running the program.

### 5. The Internal Reporting Layer — Don't Penalize the Wrong People

Constant-currency reporting matters internally as much as externally. If a regional GM in the UK is measured on USD-translated revenue, a falling pound makes a great operator look like a failure — and a rising pound flatters a weak one. Neither outcome is acceptable.

The fix is to **evaluate operating units in their functional currency or at budget rates**, holding FX as a separate, treasury-owned line. The regional leader is accountable for local-currency performance; treasury and the FX program are accountable for the rate. This separation is also a quiet retention tool: nothing erodes a strong regional leader's trust faster than a bonus destroyed by a currency move they neither caused nor could hedge. Build the constant-currency view into the management reporting pack, the QBR deck, and the compensation framework — not just the investor materials.

---

## Treasury Tech Stack: TMS Selection and Data Pipelines

A four-plus-currency FX program cannot run on spreadsheets. It can limp along on them — many companies do, far longer than they should — but spreadsheet-based hedging is how exposures get double-counted, hedge designations lapse, and a forward gets forgotten until it settles into a surprise. The technology layer is what makes the program auditable, repeatable, and scalable.

### 1. The Maturity Curve — Match the Tool to the Stage

You do not need a Tier 1 treasury management system on day one. You need the right tool for your current complexity, and a clear trigger for the next upgrade.

| Stage | Revenue / zones | Tooling | Trigger to advance |
|---|---|---|---|
| Stage 0 — Spreadsheet | <$50M, 1-2 zones | Disciplined, version-controlled exposure workbook | Third zone, or first hedge accounting need |
| Stage 1 — Lightweight TMS | $50-250M, 3-5 zones | Cloud treasury module or focused hedging platform | Hedge accounting complexity, audit findings |
| Stage 2 — Dedicated TMS | $250M-1B+, 5-10 zones | Standalone TMS (Kyriba, GTreasury, FIS Quantum, ION) | Cash visibility gaps, multi-entity netting, board scrutiny |
| Stage 3 — TMS + analytics layer | $1B+, 10+ zones | TMS plus dedicated exposure-analytics and VaR tooling | Economic-exposure modeling, multi-asset risk |

The mistake at both ends: a $40M company buying a six-figure TMS it cannot staff, and a $400M company still running its entire hedge book in a workbook one analyst maintains and nobody else can read. The right move is to advance one stage ahead of the pain, not two.

### 2. What a TMS Actually Does for an FX Program

A treasury management system is not just a trade blotter. For an FX program it delivers five capabilities spreadsheets cannot:

- **Centralized cash and exposure visibility.** Real-time, multi-currency, multi-entity views of cash and forecasted exposure — the single source of truth the exposure map needs to stay live rather than going stale the day after the quarterly close.
- **Exposure capture and forecasting.** Automated ingestion of receivables, payables, and forecast data from the ERP, so exposures are not re-keyed by hand.
- **Trade execution and lifecycle management.** Connection to bank dealing portals and multi-bank platforms (360T, FXall, Bloomberg FXGO), straight-through processing, and automated tracking of every forward and option from trade to settlement.
- **Hedge accounting automation.** Designation documentation, effectiveness testing, OCI tracking, and journal entries — the single biggest reason to graduate off spreadsheets. Doing ASC 815 / IFRS 9 by hand at five-plus zones is an audit finding waiting to happen.
- **Reporting and controls.** Audit trails, segregation-of-duties enforcement, payment controls, and the dashboards the FX committee runs on.

### 3. Selecting the TMS — A Practical Scorecard

When you reach Stage 2, run a structured selection rather than buying the loudest vendor.

| Criterion | What to probe | Why it matters |
|---|---|---|
| ERP connectivity | Native, supported connectors to your ERP (NetSuite, SAP, Oracle, Workday) | A broken integration means manual re-keying — the exact problem you are buying the TMS to solve |
| Hedge accounting depth | Out-of-the-box ASC 815 and IFRS 9 support, both frameworks | Multi-zone groups need both; bolting accounting on later is painful |
| Bank connectivity | Banks and dealing platforms supported, host-to-host / API / SWIFT | Determines whether execution and confirmations are automated or manual |
| Exposure forecasting | Ability to model forecast revenue by currency, not just actuals | The program hedges forecasts; the tool must handle them |
| Implementation time and cost | Realistic timeline, total cost including integration | Stage 2 implementations run months, not weeks |
| Scalability | Headroom for the next 3-5 currency zones and entities | You are scaling; do not buy for today's footprint |
| Security and controls | SOC reports, SSO, granular permissions, segregation of duties | Treasury moves real money; controls are not optional |

The well-known platforms — Kyriba, GTreasury, FIS, ION — each have strengths, and the right answer depends on your ERP and footprint. The selection process matters more than the brand. Companies running modern cloud ERPs should weigh native treasury modules heavily before assuming a standalone TMS, because the integration savings are real.

### 4. The Data Pipeline — The Part That Actually Fails

Most TMS implementations disappoint not because the software is bad but because the data feeding it is. Four pipelines must be engineered and owned:

- **Exposure data (ERP to TMS).** Receivables, payables, and the bookings/revenue forecast must flow automatically on a defined cadence. If the forecast still arrives as an emailed spreadsheet from FP&A, the TMS is only as current as that email. This pipeline is the program's lifeblood and deserves a named owner.
- **Market data (rate providers to TMS).** Spot rates, forward curves, and volatility surfaces from a reliable provider feed both valuation and the VaR/EaR models. Stale or single-sourced rates produce wrong fair values and wrong risk numbers.
- **Trade data (dealing platforms to TMS).** Executed forwards and options should flow back automatically with confirmations matched. Manual trade entry is a top source of error and a segregation-of-duties weakness.
- **Accounting data (TMS to ERP/GL).** Hedge accounting journal entries — OCI movements, reclassifications, fair value adjustments — must post back to the general ledger cleanly. A broken return pipeline means accounting re-keys the TMS's output, reintroducing the error risk the system was meant to remove.

The discipline: treat these four pipelines as named, owned, monitored data products with documented refresh cadences and break alerts — not one-time integration tasks that are "done" at go-live.

### 5. Build vs. Buy and the Realistic Roadmap

A scaling company should buy the TMS and build only the thin analytics layer on top — the VaR/EaR models and bespoke dashboards reflecting its specific exposure structure. Building a TMS from scratch is never the answer; the trade lifecycle, bank connectivity, and hedge accounting are deep, regulated domains where vendors have decades of head start. A realistic roadmap for a company moving from three to six currency zones: roughly one quarter to select and contract the TMS, one to two quarters to implement and integrate the ERP and bank connections, and a further quarter to migrate the hedge book and validate hedge accounting in parallel before cutting the spreadsheet over. Budget six to nine months end to end, and do not let the FX program's growth outrun the tooling — running new zones on the old spreadsheet "just until the TMS is live" is precisely when the costly errors happen.

---

## Operating Cadence: The Monthly FX Risk Committee

Tools and instruments are necessary but not sufficient. What turns an FX program from a collection of trades into a managed discipline is **cadence** — a recurring, decision-making forum with a defined membership, a fixed agenda, and a clear charter. Without it, FX management drifts into ad hoc reactions to whatever rate move spooked someone that week. The FX Risk Committee is the governance heartbeat of the program.

### 1. Charter and Authority — What the Committee Is For

The FX Risk Committee exists to **own the FX policy, monitor exposure against it, approve hedging decisions within delegated authority, and escalate what exceeds that authority.** Its charter, approved by the CFO and acknowledged by the audit committee, should state explicitly:

- The committee's decision rights — which hedges treasury may execute under standing policy without further approval, and which require committee sign-off.
- The escalation thresholds — the exposure size, tenor, or instrument type that must go to the CFO or board.
- The explicit prohibition on speculation — the committee hedges identified exposures and does not take directional currency positions. This sentence belongs in writing.
- The cadence — monthly as the baseline, with a defined trigger for convening an ad hoc session on a major rate dislocation.

A committee without a written charter becomes a discussion group. The charter is what gives treasury the authority to act quickly within bounds and the obligation to escalate beyond them.

### 2. Membership — Who Sits at the Table

The committee is deliberately cross-functional, because FX exposure originates outside treasury and the hedge program affects functions beyond it.

| Role | Contribution to the committee |
|---|---|
| Treasurer / Head of Treasury (chair) | Owns the program; runs the meeting; brings exposure and hedge analytics |
| CFO (or VP Finance) | Sets risk appetite; holds escalation authority; sponsors the program to the board |
| FP&A lead | Owns the revenue forecast that drives exposure; reconciles hedge to plan |
| Controller / Technical Accounting | Confirms hedge accounting designation and effectiveness; flags accounting impacts |
| Revenue / Regional operations rep | Provides forward visibility on bookings and pipeline by currency |
| Tax (advisory / as needed) | Flags transfer pricing and intercompany FX interactions |

The recurring lesson from companies that scale well: **FP&A and the revenue side must be in the room.** The quality of every hedge decision depends on the quality of the forecast, and the forecast is not treasury's to produce. A committee of treasury and accounting alone hedges yesterday's actuals; a committee that includes FP&A and revenue hedges tomorrow's exposure.

### 3. The Standing Monthly Agenda

A disciplined committee runs the same agenda every month, so meetings are about decisions, not orientation:

- **Exposure review.** The refreshed multi-currency exposure map — net exposure by currency, current vs. prior month, drivers of the change.
- **Hedge position and coverage.** Coverage ratios by currency and tenor against policy targets; flag any currency drifting outside the policy band.
- **Market and rate review.** A brief, factual update on rate moves and forward curves — context, explicitly not a forecast the committee is asked to bet on.
- **Risk metrics.** Current Value-at-Risk and Earnings-at-Risk against limits; trend over recent months.
- **Hedge accounting status.** Designations in place, effectiveness assessments completed, any forecast transactions at risk of failing the "highly probable" test.
- **Decisions and escalations.** Specific hedges to execute, adjust, or roll — recorded with rationale; anything exceeding delegated authority routed to the CFO or board with a recommendation.

Every decision and its rationale goes into the minutes. The minutes are not bureaucracy; they are the audit trail that demonstrates the program is governed, deliberate, and non-speculative — exactly what auditors and the audit committee want to see.

### 4. The Decision Discipline — Rules Over Reactions

The committee's hardest job is resisting the temptation to become a currency-trading desk. The strongest committees operate by **pre-agreed rules rather than monthly judgment calls.** The policy sets the coverage ladder; the committee's monthly task is mostly to confirm the program is executing the policy and to act on genuine exceptions — a forecast revision, a new currency zone, a breached limit.

This rules-based posture is what keeps the program defensible. When a member argues for under-hedging because "the euro looks cheap," the chair's answer is the policy: the program hedges exposure, it does not take views. When the dollar moves sharply and there is pressure to react, the discipline is to check whether the move actually breached a limit or changed an exposure — and if not, to do nothing. The committees that destroy value treat every meeting as a fresh opportunity to bet; the committees that protect value treat the meeting as a control check on a system that mostly runs itself.

### 5. Connecting the Cadence to the Rest of the Business

The FX committee does not operate in isolation. Its outputs feed three other rhythms:

- **The forecast cycle.** The committee's exposure review is only as good as the FP&A forecast, so the committee should sit shortly after the monthly forecast refresh, consuming the latest numbers rather than stale ones.
- **The close and reporting cycle.** Hedge accounting status from the committee feeds the controller's close; the constant-currency and FX-bridge figures the committee reviews feed the investor-reporting layer.
- **The board cycle.** A concise FX summary — exposure, coverage, VaR/EaR vs. limits, cost of the program — should roll up into the quarterly CFO board package, so the board sees a governed program rather than hearing about FX only when something goes wrong.

Run this cadence for a few quarters and FX management stops being a source of surprises. The committee becomes the place where exposure is seen early, hedged deliberately, accounted for cleanly, and communicated clearly — which is the entire point of building the program in the first place.
