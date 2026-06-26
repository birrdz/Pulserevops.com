
---

## 11. A Fully Worked Example: Modeling One Real Account End To End

Abstract formulas only go so far. Walk through a single representative account from signature to maturity so the mechanics become concrete.

### 11.1 The setup

"Meridian Logistics" signs with a usage-based data platform in January. The contract has **no fixed ARR** — it specifies a price of $2.40 per compute credit and a soft 12-month capacity reservation of 500,000 credits, but the reservation is not a hard minimum and carries no take-or-pay penalty. The sales rep's forecast at signature: $480,000 of year-one consumption. The CRO's experience says rep forecasts run 35% hot.

The cost to land Meridian:

| Land-CAC component | Amount |
|---|---|
| AE OTE allocation (deal credit) | $26,000 |
| SDR-sourced pipeline cost allocation | $7,000 |
| Sales engineering (proof-of-concept, 60 hours) | $11,000 |
| Demand-gen marketing allocation | $9,000 |
| Marketplace private-offer fee on landing transaction (3%) | $2,800 |
| **Total Land-CAC** | **$55,800** |

### 11.2 The realized ramp

Here is what actually happened — the metered revenue, month by month, and the trailing-90-day run-rate ARR derived from it:

| Month | Metered revenue | Trailing-90-day avg | Run-rate ARR | Notes |
|---|---|---|---|---|
| 1 | $4,200 | $4,200 | $50,400 | Setup, two pilot workloads |
| 2 | $6,800 | $5,500 | $66,000 | First pipeline migrated |
| 3 | $9,100 | $6,700 | $80,400 | Team trained; production starts |
| 6 | $19,400 | $16,800 | $201,600 | Three workloads in production |
| 9 | $28,700 | $25,100 | $301,200 | Second business unit onboarded |
| 12 | $35,200 | $32,900 | $394,800 | Steady-state for initial use cases |
| 18 | $44,600 | $42,000 | $504,000 | New use case: ML feature store |
| 24 | $51,300 | $49,100 | $589,200 | Mature; expansion at NRR baseline |

Note three things. First, the rep's $480,000 year-one forecast was wrong — actual year-one *consumed* revenue (the sum of months 1-12) was about $215,000, and the month-12 *run-rate* was $394,800. Had finance used $480,000 as the CAC denominator, payback would have looked roughly twice as fast as reality. Second, month-1 run-rate ARR of $50,400 annualized would have made CAC payback look slow and scary. Third, the *true* economic story — a customer climbing from $50k to $589k run-rate ARR — is only visible through the cohort lens.

### 11.3 The expansion cost

Meridian did not climb that curve for free. The platform spent on it:

| Expansion-CAC component (cumulative, months 1-24) | Amount |
|---|---|
| CSM time allocation (revenue-driving customer success) | $34,000 |
| Solutions architect (new use-case enablement, ML feature store) | $19,000 |
| Account manager expansion selling | $14,000 |
| Expansion marketing / customer education allocation | $4,000 |
| Ongoing marketplace fees on expansion transactions (3%) | $5,200 |
| **Total Expansion-CAC (24 months)** | **$76,200** |

### 11.4 The crossover

Gross margin on this platform is 76%. Here is the crossover calculation:

| Month | Cum. metered revenue | Cum. gross profit (76%) | Cum. Land-CAC | Cum. fully-loaded CAC | Land paid back? | Fully paid back? |
|---|---|---|---|---|---|---|
| 3 | $20,100 | $15,276 | $55,800 | $63,500 | No | No |
| 6 | $62,000 | $47,120 | $55,800 | $71,000 | No | No |
| 9 | $135,000 | $102,600 | $55,800 | $98,000 | Yes (~M7) | Yes (~M9) |
| 12 | $215,000 | $163,400 | $55,800 | $112,000 | Yes | Yes |
| 18 | $410,000 | $311,600 | $55,800 | $128,000 | Yes | Yes |
| 24 | $620,000 | $471,200 | $55,800 | $132,000 | Yes | Yes |

Land-CAC paid back around **month 7.** Fully-loaded CAC paid back around **month 9.** And by month 24, Meridian has thrown off $471,000 of cumulative gross profit against $132,000 of total CAC — an LTV/CAC well past 3x with years of runway left. This single account, modeled honestly, tells a fantastic story. Modeled with the rep's forecast it would have looked artificially fast; modeled off month-1 run-rate ARR it would have looked broken. The cohort-and-crossover method is the only one that tells the truth.

### 11.5 What if Meridian had stalled?

The same machinery catches the bad case. Suppose Meridian's usage flatlined at the month-6 level — $201,600 run-rate ARR — and never grew. Cumulative gross profit by month 24 would be roughly $290,000 against $132,000 CAC: still profitable, still past payback, but a *materially worse* asset, and the maturation curve would show the stall by month 9-10. That early warning — a cohort tracking below the canonical curve — is the operating signal that triggers a customer-success intervention long before the annual renewal conversation.

---

## 12. Common Failure Modes And How To Catch Them

Even teams that adopt cohort modeling make recurring mistakes. Here are the failure modes that most often corrupt a usage-based CAC model, and the diagnostic that catches each one.

### 12.1 Mixing self-serve and enterprise in one cohort

A company with both a self-serve PLG funnel and an enterprise sales motion that lumps both into one monthly cohort will produce a meaningless blended CAC and a meaningless blended maturation curve. The two motions have different Land-CAC (near-zero versus $50k-plus), different ramps, and different retention. **Always segment cohorts by motion** — at minimum self-serve versus sales-led — and ideally by segment (SMB / mid-market / enterprise) on top of that.

### 12.2 Counting unqualified signups in the denominator

If the CAC denominator includes every free or trivially-small signup, blended CAC looks artificially tiny and the team congratulates itself on efficiency it does not have. Enforce the **qualified-customer threshold** ruthlessly and report the qualification rate as its own metric.

### 12.3 Letting the maturation curve go stale

The canonical maturation curve is built from history, but the business changes — new products, pricing changes, a shift in customer mix. A curve built 18 months ago can badly misforecast today's cohorts. **Refresh the curve quarterly** and watch whether recent cohorts systematically beat or miss it; a persistent gap means the curve needs rebuilding.

### 12.4 Confusing run-rate ARR growth with gross-profit growth

On an AI-inference or communications book where COGS is large and variable, a customer's run-rate ARR can grow while gross profit grows slower — or even shrinks — because they shifted usage toward a lower-margin product or you cut prices. Payback is computed on gross profit, so **track a gross-profit maturation curve alongside the revenue curve**, not just the revenue one.

### 12.5 Ignoring the cash-versus-GAAP gap

A team that builds CAC off the GAAP P&L is using ASC 340-40 amortized commissions and will report a different (usually faster-looking) payback than the cash reality. In a fast-growing company the cash CAC is materially higher than the amortized CAC. **State the basis explicitly** and, for cash-runway decisions, use the cash-commission number.

### 12.6 Benchmarking against the wrong comparable

The single most common board-level error: comparing a usage-based enterprise payback to a seat-based SMB payback and concluding the usage-based business is inferior. **Benchmark like against like** — usage-based enterprise consumption companies against each other — and always pair payback with NRR and LTV/CAC so the back-loaded revenue shape is visible.

| Failure mode | Diagnostic that catches it | Fix |
|---|---|---|
| Self-serve mixed with enterprise | Bimodal cohort run-rate ARR distribution | Segment cohorts by motion |
| Unqualified signups in denominator | Suspiciously low blended CAC, low ARPU | Enforce qualified-customer threshold |
| Stale maturation curve | Recent cohorts persistently off-curve | Rebuild curve quarterly |
| Revenue vs. gross-profit divergence | Run-rate ARR up, GP flat or down | Track GP maturation curve too |
| Cash vs. GAAP commission gap | Payback differs from cash burn reality | State basis; use cash for runway |
| Wrong benchmark comparable | Payback "looks bad" vs. seat-based comp | Benchmark like-for-like; show NRR |

---

## 13. Operating Cadence: Running The Model Month After Month

A CAC model is not a one-time analysis; it is a living instrument with a monthly and quarterly rhythm. Here is the cadence that keeps it honest and useful.

### 13.1 The monthly close routine

1. **Pull metered revenue** for every customer for the closed month from the billing system.
2. **Recompute trailing-90-day run-rate ARR** per customer and roll it up per cohort.
3. **Update the cohort triangle** — one new diagonal cell per active cohort.
4. **Allocate the month's S&M and CS spend** into Land and Expansion buckets and attribute to cohorts.
5. **Advance every cohort's crossover table** by one month; flag any cohort that crossed payback this month.
6. **Compare each active cohort to the canonical maturation curve**; flag any cohort tracking more than a set tolerance below curve as a customer-success risk.
7. **Publish the operating dashboard** — Land-CAC payback, fully-loaded payback, NRR, LTV/CAC, burn multiple, on standardized definitions.

### 13.2 The quarterly review

1. **Rebuild the canonical maturation curve** from all mature cohorts.
2. **Review the cohort triangle columns** — is month-3, month-6, month-12 run-rate ARR improving across vintages?
3. **Reconcile cash versus GAAP** CAC and explain the gap.
4. **Re-examine the Land/Expansion boundary** — has any role's mix shifted enough to reclassify? (Reclassify deliberately and disclose it; never drift silently.)
5. **Update board materials** with the maturation curve, triangle, and five standardized metrics.

### 13.3 Who owns what

| Role | Ownership in the CAC model |
|---|---|
| Strategic finance / FP&A | Owns the model, definitions, board narrative |
| Revenue operations | Owns spend attribution and the Land/Expansion split |
| Data / analytics engineering | Owns metering reconciliation and the cohort warehouse |
| Customer success leadership | Owns the off-curve intervention process |
| CRO and CMO | Consume the split to allocate headcount and budget |

The model fails when no single person owns the *definitions.* Whoever owns strategic finance must be the definitional authority: what run-rate ARR is, where the Land/Expansion line sits, which commission basis the dashboard uses. Everything else can be distributed; the definitions cannot.

### 13.4 Closing thought

Modeling CAC for usage-based pricing with no upfront contract value is not harder than seat-based CAC — it is *differently shaped.* Once you accept that a customer's value is a function of time, replace contract value with trailing run-rate ARR, split the spend into Land and Expansion, model in cohorts, and read payback as a crossover event, the whole picture becomes not just tractable but *richer* than the seat-based version. You see the maturation, you see the expansion engine, you see the off-curve accounts early, and you can defend a longer payback as the price of a compounding, negative-churn revenue base. That is the model. Run it monthly, refresh it quarterly, and never let the definitions drift.
