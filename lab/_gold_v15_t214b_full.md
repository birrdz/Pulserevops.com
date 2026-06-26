### Direct Answer

When your contract has no upfront commitment, CAC modeling stops being a single division problem and becomes a cohort-maturation problem. You cannot divide sales-and-marketing spend by "deals closed" because a usage-based deal at signature is worth almost nothing — it earns value over the following 12 to 36 months as the customer ramps consumption. The fix: split CAC into Land-CAC (the cost to acquire the account and its first dollar of usage) and Expansion-CAC (the cost to grow that account), then measure payback against trailing run-rate ARR computed from actual metered revenue, never against signed TCV. Track every acquisition cohort by signature month and watch the curve of run-rate ARR climb; CAC payback is the month that cumulative cohort gross profit crosses cumulative cohort acquisition cost. If you report CAC the SaaS-textbook way on a usage-based book, you will either look broke (in month one) or look like a genius (by month 30) — and both are lies.

> **TLDR**
> - **Usage-based deals have no TCV**, so the denominator in classic CAC (S&M / new ARR) is undefined or near-zero at signature. Replace "new ARR" with **trailing 90-day annualized run-rate ARR** measured from metered revenue.
> - **Split the spend.** Land-CAC = cost to win the logo and first usage. Expansion-CAC = cost of the CSM, solutions, and growth motion that drives consumption upward. Blending them hides a healthy land motion behind an expensive expansion motion (or vice versa).
> - **Model by cohort, not by period.** Group customers by signature month, track their run-rate ARR maturation curve, and compute payback as the month cumulative cohort gross profit crosses cumulative CAC.
> - **Payback is slower and that is fine.** Best-in-class usage-based payback runs 15-25 months on a fully-loaded basis versus 12-18 for seat-based — because revenue is back-loaded. Judge the *shape* of the ramp, not the month-one number.
> - **Net revenue retention does the heavy lifting.** Snowflake, Datadog, and MongoDB built durable models on 120-140% NRR. In usage-based, NRR is not a vanity metric — it is the core return mechanism that makes a long payback acceptable.
> - **Watch the accounting.** ASC 340-40 capitalized commissions, ASC 606 variable-consideration constraints, and marketplace fees (AWS Marketplace's 3-5%) all distort reported CAC if you ignore them.
> - **Counter-case:** if your usage is committed-spend-forward (a drawdown contract with a real minimum), you are closer to a hybrid SaaS deal and classic CAC with a maturation haircut works fine.

---

## 1. Why Classic CAC Breaks On A Usage-Based Book

### 1.1 The denominator disappears

The textbook CAC payback formula every SaaS operator memorizes is:

```
CAC Payback (months) = S&M Spend (period) / (New ARR (period) x Gross Margin) x 12
```

That formula has a load-bearing assumption hidden inside it: **the deal you signed has a known annual value the moment ink hits paper.** A seat-based contract for 50 seats at $1,200 per seat per year is worth $60,000 of ARR on day one. You can divide by it. The denominator is real, knowable, and stable.

Usage-based pricing detonates that assumption. When Snowflake signs a new customer, the contract frequently specifies a price per credit and, in many cases, a capacity commitment — but the *realized* revenue depends entirely on how many queries that customer runs over the next year. When Twilio (TWLO) signs a developer, there may be no commitment at all: the customer puts a credit card down and pays per SMS, per minute, per verification. The "new ARR" of that deal at signature is, honestly, somewhere between zero and "we will find out." You cannot divide by a number you do not have.

Operators who try to force usage-based deals into the seat-based formula make one of two errors:

- **The optimist's error:** they use the *capacity commitment* or the sales rep's *forecast* as new ARR. This inflates the denominator, makes CAC payback look fast, and sets the board up for a brutal miss when actual consumption comes in 30-50% below the rep's happy-path number.
- **The pessimist's error:** they use *month-one realized revenue* annualized. A customer who signed on the 25th and ran two test queries produces a denominator near zero, so CAC payback computes as "infinite." The finance team panics, marketing budget gets cut, and a perfectly healthy land motion gets strangled.

Both errors come from the same root cause: **in usage-based pricing, the value of a customer is a function of time, not a property of the contract.** CAC modeling has to respect that.

### 1.2 Revenue is back-loaded, so payback is back-loaded

In a seat-based world, revenue is roughly flat from month one. The customer pays the same $5,000 a month in month one as in month twelve (absent expansion). Cost recovery is linear and predictable.

In a usage-based world, revenue follows a *ramp*. A new Snowflake customer in month one is migrating a few workloads, running pilots, and training a team. Their bill is small. By month nine they have moved production pipelines over, turned on Snowpark, and added three business units. Their bill is 4-8x the month-one figure. The revenue — and therefore the cost recovery — is structurally **back-loaded.**

This means CAC payback on a usage-based book is *mechanically* slower than on a seat-based book selling to the same customer at the same eventual ACV. It is not a sign of a worse business. It is a sign of a different revenue *shape*. The job of the model is to make that shape visible so leadership stops comparing a usage-based payback number to a seat-based benchmark and panicking.

### 1.3 The customer count is misleading too

Seat-based SaaS has a clean unit: the customer, or the seat. Usage-based pricing fuzzes even this. Is a developer who signed up, ran $4 of usage, and churned a "customer acquired"? Technically yes. Economically no. If you compute CAC as S&M divided by *logos*, a self-serve freemium funnel that converts thousands of $5-a-month hobbyists will show a gorgeous (tiny) CAC and a worthless book of business.

The discipline usage-based companies adopt is a **qualified-cohort definition**: a customer counts toward the CAC denominator only once they cross a minimum activation threshold — first production workload, first $X of monthly usage, or first paid invoice above a floor. Everything below that line is funnel, not revenue.

> **Cross-link:** See *q421 — Explaining negative churn (expansion revenue) to board auditors* for how to defend the >100% NRR that makes usage-based unit economics work, and *q417 — What the Rule of 40 actually measures* for how to frame the growth/margin tradeoff when payback is long.

---

## 2. The Core Reframe: Run-Rate ARR Instead Of Contract Value

### 2.1 Defining run-rate ARR

If you cannot use contract value, you need a denominator that reflects the *actual economic reality* of the account. That denominator is **run-rate ARR**: the annualized value of recent metered revenue.

The standard construction:

```
Run-Rate ARR (account, month M) = (sum of metered revenue, months M-2..M) / 3 x 12
```

You take a trailing 90-day window of *realized, invoiced* usage revenue, average it to a clean monthly figure, and annualize. The 90-day window smooths out the spikiness inherent in consumption — a customer who runs a giant batch job in one month and nothing the next should not whipsaw your ARR.

Some companies use a 30-day window for faster signal and some use a 6-month window for maximum smoothness. The tradeoff is responsiveness versus noise. **90 days is the consensus default** among usage-based finance teams (Snowflake and Datadog both report on a trailing basis) because it balances both and aligns to a fiscal quarter.

| Window | Pro | Con | Best for |
|---|---|---|---|
| 30-day | Fast signal; catches ramp early | Very noisy; one batch job distorts it | Early-stage PLG with smooth daily usage |
| 90-day | Balances noise and responsiveness | Lags a genuine step-change by ~6 weeks | Default for most usage-based companies |
| 6-month | Extremely smooth; board-friendly | Slow to reflect churn or a usage cliff | Mature enterprise consumption books |

### 2.2 Run-rate ARR versus the alternatives

| Denominator candidate | What it is | Why it fails / works |
|---|---|---|
| Signed TCV | Total contract value at signature | Fails — often zero or a meaningless minimum |
| Rep-forecast ARR | Sales rep's consumption projection | Fails — systematically optimistic, 30-50% high |
| Month-1 annualized | First month usage x 12 | Fails — near zero during ramp; payback looks infinite |
| Capacity commitment | The contracted minimum spend | Partial — useful as a floor, but ignores upside |
| **Trailing 90-day run-rate ARR** | Realized metered revenue, annualized | **Works — reflects actual economics, smooths spikes** |
| Cohort-mature run-rate ARR | Run-rate ARR at month 12-18 of the cohort | Works for LTV; too slow for live CAC tracking |

### 2.3 The maturation curve

The single most important artifact in usage-based CAC modeling is the **cohort maturation curve**: a chart with months-since-signature on the x-axis and run-rate ARR (indexed to month 1 = 1.0) on the y-axis.

A healthy enterprise consumption curve might look like this:

| Months since signature | Indexed run-rate ARR | Interpretation |
|---|---|---|
| Month 1 | 1.0 | Land value; pilots and migration begin |
| Month 3 | 1.6 | First production workloads live |
| Month 6 | 2.8 | Multiple workloads; team trained |
| Month 12 | 4.5 | Steady-state for initial use cases |
| Month 18 | 6.0 | New use cases; second department |
| Month 24 | 7.2 | Mature; expansion slows to NRR baseline |

That curve *is* your model. Once you know the shape, you can take any new cohort's month-1 run-rate ARR and project its month-24 value. You can compute LTV. You can compute payback. Everything downstream depends on having a credible, regularly-refreshed maturation curve built from your own historical cohorts.

```mermaid
flowchart TD
    A[New customer signs<br/>usage-based contract] --> B[Land-CAC incurred<br/>sales + marketing]
    B --> C[Month 1 run-rate ARR<br/>small: pilots only]
    C --> D{Cohort maturation<br/>tracking begins}
    D --> E[Months 1-6<br/>workloads migrate]
    D --> F[Expansion-CAC incurred<br/>CSM + solutions eng]
    E --> G[Run-rate ARR climbs<br/>per maturation curve]
    F --> G
    G --> H{Cumulative cohort<br/>gross profit >=<br/>cumulative CAC?}
    H -->|Not yet| I[Continue tracking<br/>payback pending]
    H -->|Yes| J[CAC Payback reached<br/>record the month]
    J --> K[Post-payback:<br/>NRR drives LTV]
    I --> G

---

## 3. Splitting CAC: Land-CAC Versus Expansion-CAC

### 3.1 Why the split is non-negotiable

In a seat-based world you can get away with one blended CAC because the acquisition motion and the renewal motion are economically similar — a renewal at the same seat count costs the customer success team a few hours and produces the same revenue. The acquisition cost dominates and the model survives the simplification.

In a usage-based world, **the expansion motion is where most of the revenue comes from, and it has a real, large cost.** A new Snowflake (SNOW) account might land at $40,000 of run-rate ARR and mature to $280,000 — meaning roughly 85% of the eventual revenue is *expansion* revenue. If you blend the cost of acquiring that logo with the cost of the solutions architects, customer success managers, and usage-growth campaigns that drove the 7x expansion, you get a single CAC number that is true of nothing. It overstates the cost of landing and understates the cost of growing.

The discipline: **two CAC buckets, two denominators, two payback numbers.**

| Dimension | Land-CAC | Expansion-CAC |
|---|---|---|
| What it buys | The logo plus first dollar of usage | Growth of an existing account's consumption |
| Spend included | New-business AEs, SDRs, brand/demand marketing, sales engineering for first deal | CSMs, account managers, solutions architects, expansion campaigns, allocated usage-growth product investment |
| Denominator | Month-1 (or first-90-day) run-rate ARR of new cohort | Net-new run-rate ARR from existing accounts in period |
| Healthy payback | 6-12 months | 12-24 months, but on much larger revenue |
| Failure signal | Rising with flat land ARR equals top-of-funnel inefficiency | Rising with flat expansion equals product not creating new use cases |

### 3.2 Computing Land-CAC

```
Land-CAC = New-business S&M spend (period) / Count of qualified new cohorts (period)

Land-CAC Payback (months) = Land-CAC / (Month-1 run-rate ARR x Gross Margin) x 12
```

A subtlety: because month-1 run-rate ARR is small and noisy, many companies compute Land-CAC payback against **first-90-day average run-rate ARR** rather than month-1 alone. This gives the customer a quarter to get past pure setup and produces a more stable denominator. Either is defensible — pick one and hold it constant so trend lines mean something.

What goes in the new-business S&M bucket:

- **New-business account executives** — fully loaded salary, benefits, and the OTE portion tied to new logos.
- **SDR and BDR team cost** — the entire outbound prospecting function feeds the land motion.
- **Demand-generation marketing** — paid acquisition, events, content, and the marketing operations stack, to the extent it drives new logos.
- **Sales engineering for the first deal** — the pre-sales SE hours spent on a proof-of-concept before signature.
- **Marketplace listing fees on the first transaction** — AWS Marketplace, Azure Marketplace, and GCP Marketplace take a percentage of the deal; that fee on the *landing* transaction is a land cost.

### 3.3 Computing Expansion-CAC

```
Expansion-CAC = (Expansion S&M + CS spend, period) / Net-new run-rate ARR from existing accounts (period)

Expansion-CAC Payback (months) = Expansion-CAC / (Net-new run-rate ARR x Gross Margin) x 12
```

What goes in the expansion bucket:

- **Customer success managers** — in a usage-based model the CSM is a revenue role, not a support role. They drive workload adoption.
- **Solutions architects and post-sales SEs** — the people who help customers light up new use cases that consume more.
- **Account managers** — the commercial owners of expansion and renewal.
- **Expansion marketing** — lifecycle campaigns, in-product growth nudges, customer advisory boards, and usage-based education programs.
- **Allocated growth-engineering cost** — controversial, but a slice of the product investment that exists specifically to create more billable surface area (new connectors, new compute types) is arguably an expansion-CAC. Most companies leave this in R&D; sophisticated ones allocate a portion.

### 3.4 The blended view, and when to use it

You still report a blended CAC for board and benchmarking purposes, because investors and comparables expect it:

```
Blended CAC = (Total S&M + CS spend) / Total net-new run-rate ARR (land + expansion)
```

But the blended number is an *output*, not a decision tool. You make decisions — where to add headcount, which motion to fund — off the *split*. The blended figure is for the scoreboard; the split is for the playbook.

> **Cross-link:** See *q429 — Building a tiered partner program that rewards scale without collapsing margin* for how channel-sourced land deals change the Land-CAC math, and *q430 — Deal-share compensation models that keep partners hungry* for partner-influenced expansion.

---

## 4. Cohort-Based Modeling, Step By Step

### 4.1 Group by signature month

Every customer enters the model in a **cohort defined by the month they signed** — the May 2025 cohort, the June 2025 cohort, and so on. You never again look at "all customers" as an undifferentiated mass for CAC purposes; you look at cohorts maturing in parallel.

For each cohort you track, every month:

| Field | Definition |
|---|---|
| Cohort size | Count of qualified customers who signed that month |
| Land-CAC (cohort) | New-business S&M attributed to that month's signings |
| Cumulative run-rate ARR | Sum of all cohort members' current run-rate ARR |
| Cumulative gross profit | Cumulative cohort revenue x gross margin, summed monthly |
| Logo retention | Percent of original cohort still active |
| Net revenue retention | Current cohort run-rate ARR / cohort run-rate ARR at month 3 |

### 4.2 Build the maturation curve from history

Take your oldest cohorts — the ones with 18-24 or more months of history — and chart their indexed run-rate ARR by month-since-signature. Average across several mature cohorts to get a *canonical maturation curve.* Refresh it quarterly, because the curve shifts as your product, pricing, and customer mix evolve.

A worked enterprise consumption example, a 25-customer cohort that lands at $40k month-1 run-rate ARR per logo:

| Month | Indexed | Cohort run-rate ARR | Cum. gross profit (75% GM) | Cum. Land-CAC |
|---|---|---|---|---|
| 1 | 1.00 | $1,000,000 | $62,500 | $1,500,000 |
| 3 | 1.60 | $1,600,000 | $312,000 | $1,500,000 |
| 6 | 2.80 | $2,800,000 | $787,000 | $1,500,000 |
| 12 | 4.50 | $4,500,000 | $2,180,000 | $1,500,000 |
| 18 | 6.00 | $6,000,000 | $4,140,000 | $1,500,000 |
| 24 | 7.20 | $7,200,000 | $6,560,000 | $1,500,000 |

In this example Land-CAC for the cohort is $1.5M ($60k per logo). On a land-only basis, cumulative gross profit crosses cumulative CAC between month 9 and month 12. We refine the crossover read in section 5 once expansion spend is layered in.

### 4.3 Project new cohorts onto the curve

Once the canonical curve exists, every new cohort gets projected: take its month-1 run-rate ARR, multiply by the curve's index values, and you have a forecast cohort revenue stream. This is the foundation of both CAC payback forecasting and LTV.

### 4.4 The cohort triangle

The classic display is a **cohort triangle** (or layer cake): rows are signature months, columns are months-since-signature, cells are run-rate ARR. Reading down a column shows how a given maturity stage trends across cohorts (is your month-6 value improving?). Reading across a row shows one cohort's life. It is the single most informative chart in usage-based finance, and it is the chart the board should see every quarter.

| Cohort | M1 | M3 | M6 | M12 | M18 |
|---|---|---|---|---|---|
| Jan 2025 | $0.9M | $1.5M | $2.6M | $4.3M | $5.9M |
| Feb 2025 | $1.0M | $1.6M | $2.8M | $4.5M | $6.1M |
| Mar 2025 | $1.1M | $1.8M | $3.1M | $4.9M | n/a |
| Apr 2025 | $1.2M | $2.0M | $3.4M | n/a | n/a |
| May 2025 | $1.3M | $2.2M | n/a | n/a | n/a |

A triangle like this one — where each new cohort's month-3 number is bigger than the last's — is the visual signature of an improving land motion. If the column held flat or declined, you would know your top of funnel is degrading even while total revenue still grows.

---

## 5. Computing CAC Payback Correctly

### 5.1 Payback is a crossover, not a ratio

In the seat-based world CAC payback is a ratio you compute once. In the usage-based world payback is an **event you observe**: the month in which a cohort's cumulative gross profit first equals or exceeds the cumulative cost spent to acquire and grow it.

```
For cohort C:
  CumGP(M)  = sum over months 1..M of (cohort revenue x gross margin)
  CumCAC(M) = Land-CAC + sum over months 1..M of allocated Expansion-CAC
  Payback   = the smallest M such that CumGP(M) >= CumCAC(M)
```

Two honest versions of this calculation exist, and you should report both:

- **Land-only payback** — CumCAC includes only Land-CAC. This answers "did acquiring the logo pay off?" and is the faster, cleaner number.
- **Fully-loaded payback** — CumCAC includes Land-CAC plus the expansion spend allocated to that cohort over time. This is slower and is the number that actually tells you whether the *whole* customer relationship is economically sound.

### 5.2 A worked payback table

Using the section 4.2 cohort, now with expansion spend layered in:

| Month | Cohort run-rate ARR | Monthly GP (75%) | Cum. GP | Cum. Land-CAC | Cum. fully-loaded CAC | Land payback? | Full payback? |
|---|---|---|---|---|---|---|---|
| 1 | $1.00M | $62.5k | $62.5k | $1.50M | $1.50M | No | No |
| 3 | $1.60M | $100k | $250k | $1.50M | $1.62M | No | No |
| 6 | $2.80M | $175k | $700k | $1.50M | $1.86M | No | No |
| 9 | $3.60M | $225k | $1.30M | $1.50M | $2.10M | No | No |
| 12 | $4.50M | $281k | $2.05M | $1.50M | $2.40M | Yes (~M11) | No |
| 15 | $5.20M | $325k | $3.00M | $1.50M | $2.70M | Yes | Yes (~M15) |
| 18 | $6.00M | $375k | $4.10M | $1.50M | $3.00M | Yes | Yes |

Read it carefully. Land-CAC payback lands around **month 11.** Fully-loaded payback — the honest number — lands around **month 15.** A board hearing only "CAC payback is 11 months" would be told a half-truth. The disciplined report shows both and explains the gap: the gap *is* the expansion investment, and the expansion investment is *why* the cohort run-rate ARR went from $1M to $6M.

### 5.3 Benchmarks, and how to read them

| Pricing model | Typical CAC payback (fully-loaded) | Why |
|---|---|---|
| Seat-based SMB SaaS | 5-12 months | Revenue flat from month 1; fast recovery |
| Seat-based enterprise SaaS | 12-18 months | Larger deals, longer sales cycle |
| Usage-based PLG / self-serve | 6-15 months | Low Land-CAC, but high churn drag |
| Usage-based enterprise consumption | 15-25 months | Back-loaded revenue; heavy expansion spend |
| Usage-based with AI/inference COGS | 18-30 months | Lower gross margin compresses GP-based payback |

The headline: **a usage-based enterprise payback of 20 months is not worse than a seat-based payback of 14 months.** It is a different revenue shape. The usage-based cohort, by month 36, is generating multiples more gross profit because NRR keeps compounding. Payback measures *speed of recovery*, not *quality of the asset.* Pair payback with LTV/CAC and NRR before drawing any conclusion.

### 5.4 The discounted version for the rigorous

Cohort cash flows arrive over 24-plus months, so a dollar of gross profit in month 24 is worth less than a dollar in month 1. The rigorous version discounts the monthly GP stream at the company's cost of capital before finding the crossover. In a low-rate environment the adjustment is small; at a 12-15% cost of capital it pushes payback out by 1-3 months on a long-tail usage cohort. Report it if your CFO or board cares; most usage-based companies run the undiscounted version for the operating dashboard and the discounted version for strategic-finance reviews.

---

## 6. LTV, NRR, And The Return Mechanism

### 6.1 NRR is not vanity — it is the engine

In a seat-based business, net revenue retention above 100% is a pleasant bonus. In a usage-based business, **NRR above 100% is the entire investment thesis.** A long CAC payback is only acceptable because the cohort keeps expanding for years after payback. The math of usage-based unit economics does not work at 100% NRR — it requires the 110-140% band that the best consumption companies sustain.

| Company | Reported NRR band (mature) | Pricing model |
|---|---|---|
| Snowflake (SNOW) | ~125-130% | Per-credit consumption |
| Datadog (DDOG) | ~110-120% | Per-host, per-event usage |
| MongoDB (MDB) Atlas | ~115-120% | Consumption (Atlas) |
| Twilio (TWLO) | ~100-110% | Per-message / per-minute usage |
| Cloudflare (NET) | ~110-115% | Usage + subscription hybrid |

Snowflake's run to scale was, in plain terms, a story of landing accounts at modest run-rate ARR and riding 125%+ NRR for years. Frank Slootman and then-CFO Mike Scarpelli built the company's external narrative explicitly around net revenue retention because they understood that, in a consumption model, NRR is the number that turns a slow payback into a phenomenal LTV.

### 6.2 Computing LTV with a maturation curve

```
Cohort LTV = sum over the customer's life of (run-rate ARR_t x Gross Margin) - Expansion-CAC_t
           discounted at cost of capital

Simplified steady-state form:
LTV per customer = (Mature run-rate ARR x Gross Margin) / (Churn rate + Discount rate)
```

The honest LTV calculation uses the maturation curve for the ramp years and a steady-state perpetuity (with churn and discounting) for the long tail. The two common LTV mistakes in usage-based modeling:

- **Using month-1 run-rate ARR as the LTV base** — this dramatically understates LTV by ignoring the entire maturation ramp.
- **Using mature run-rate ARR with no churn or discount** — this dramatically overstates LTV by assuming the customer expands forever and a future dollar equals a present dollar.

### 6.3 LTV/CAC for usage-based

| Metric | Healthy usage-based target | Note |
|---|---|---|
| LTV / Land-CAC | 5x or higher | Land motion should be very efficient |
| LTV / fully-loaded CAC | 3x or higher | Same 3x bar as seat-based, but earned over a longer horizon |
| Gross margin | 70-80% (software), 50-65% (AI/inference-heavy) | COGS includes cloud infrastructure |
| Months to recover fully-loaded CAC | 15-25 | Longer is acceptable if NRR is strong |
| Burn multiple | Under 1.5x | Net burn / net-new ARR; ties payback to cash |

The 3x LTV/CAC rule survives the transition to usage-based pricing — but the *time horizon* over which you earn it stretches out. A seat-based company hits 3x in maybe 30 months; a usage-based enterprise company might hit it in 40-50 months. Same destination, longer road, and the road is fine because the cohort is bigger at the end.

### 6.4 The negative-churn cohort

The defining feature of a great usage-based cohort is **negative churn**: even after some logos leave, the expansion of the survivors more than replaces the lost revenue, so cohort run-rate ARR keeps climbing for years. This is the layer-cake chart where every cohort's revenue band grows thicker over time rather than thinning. It is also the single hardest thing to explain to a board auditor who learned that retention maxes out at 100%.

> **Cross-link:** See *q421 — Explaining negative churn to board auditors who think NRR cannot exceed 100%* for the exact framing and *q417 — What the Rule of 40 actually measures* for combining growth and margin into one board-grade number.

---

## 7. The Accounting Layer: ASC 606, ASC 340-40, And Marketplace Fees

### 7.1 ASC 606 variable consideration

Usage-based revenue is, in accounting language, **variable consideration.** Under ASC 606 you recognize revenue as the usage occurs (the performance obligation is satisfied), which conveniently aligns with how the CAC model wants to see revenue — as realized metered amounts. But two ASC 606 wrinkles touch the CAC model:

- **The constraint on variable consideration** — you cannot recognize estimated future usage as revenue today; you recognize it as it happens. This is *good* for CAC modeling because it forces the denominator to be realized revenue, exactly what run-rate ARR is built on.
- **Minimum commitments and breakage** — if a contract has a use-it-or-lose-it minimum, the unused portion ("breakage") gets recognized on a pattern. This matters because a committed minimum is partly a seat-like fixed component, and your CAC model should treat the committed floor differently from the variable upside (see the Counter-Case in section 9).

### 7.2 ASC 340-40 capitalized commissions

This is the accounting rule that most distorts a naive CAC read. **ASC 340-40 requires you to capitalize the incremental costs of obtaining a contract — principally sales commissions — and amortize them over the period you expect to benefit**, which for an expanding customer relationship can be several years.

Why it matters for CAC:

- Your **GAAP S&M expense** in any given quarter is *amortized* commission cost, not *cash* commission cost. If you build CAC off the GAAP P&L, you are using a smoothed number.
- For a *cash* CAC and payback view — the view most operators and growth investors actually want — you should use **cash commissions paid in the period**, not the amortized figure.
- Be explicit in every CAC report about which basis you used. "CAC payback 14 months (cash-commission basis)" and "CAC payback 19 months (GAAP-amortized basis)" can both be true of the same company.

| Commission treatment | What it does to reported CAC | Use it for |
|---|---|---|
| Cash commissions paid | Higher S&M in growth quarters; truer cash picture | Operating dashboard, cash payback, burn analysis |
| ASC 340-40 amortized | Smoothed S&M; matches GAAP P&L | Board GAAP reconciliation, investor comparables |

Usage-based pricing complicates ASC 340-40 further because the *amortization period* depends on the expected customer life — and expected life is itself a function of the maturation and retention curves you built in section 4. The accounting and the unit-economics model are linked: the maturation curve feeds the amortization assumption.

### 7.3 Marketplace fees as a CAC and COGS line

A large and growing share of usage-based revenue flows through the cloud marketplaces — **AWS Marketplace, Microsoft Azure Marketplace, and Google Cloud Marketplace.** These take a listing fee, historically around 3% for private offers and higher for public listings, deducted from the transaction.

Where does the marketplace fee belong?

- **On the landing transaction** — treat it as a Land-CAC component; it is a cost of acquiring that revenue.
- **On every subsequent expansion transaction** — treat the ongoing fee as either an Expansion-CAC component or a COGS reduction-of-revenue line, depending on your accounting policy. Most companies net it against revenue.

Either way, if you ignore marketplace fees you overstate gross margin and understate CAC. On a book where 40% of revenue runs through marketplaces at a 3% take, that is roughly 1.2 points of blended gross margin — material when GP is the numerator of payback.

### 7.4 Cloud COGS and the AI-inference squeeze

Usage-based gross margin is not the 80-85% of classic SaaS. The COGS line carries **cloud infrastructure** — the compute and storage you consume to deliver the metered service. For a Snowflake-style data platform, gross margin sits in the low-to-mid 70s. For an AI-API business (think the per-token pricing of OpenAI or Anthropic, or any company reselling inference), gross margin can fall to 50-65% because GPU inference is genuinely expensive.

This matters enormously for CAC payback, because payback is computed on **gross profit**, not revenue. A 15-point gross-margin haircut pushes a 16-month payback out toward 20-22 months arithmetically. When you model CAC for a usage-based AI product, you must model the COGS curve alongside the revenue curve — and watch for the case where a customer's usage grows but, because they shifted to a cheaper model tier or you cut prices, gross profit grows slower than run-rate ARR.

| Usage-based archetype | Typical gross margin | Payback implication |
|---|---|---|
| Data warehouse / analytics platform | 70-78% | Standard usage-based payback band |
| Observability / monitoring | 75-82% | Among the healthier consumption margins |
| Communications API (SMS, voice) | 50-60% | Carrier costs compress GP heavily |
| AI / LLM inference API | 50-65% | GPU COGS; payback runs long |
| Infrastructure / CDN | 70-78% | Bandwidth COGS, improving with scale |

---

## 8. Instrumentation: The Data You Need Before Any Of This Works

### 8.1 Metering and billing must be trustworthy

None of the modeling above is possible if you cannot trust your usage data. The foundation is a **metering pipeline** that captures every billable event accurately, deduplicates it, and reconciles to the invoice. If your run-rate ARR is built on metered events that drift from what you actually bill, every cohort number is fiction.

Practical requirements:

- **Event-level capture** — every billable unit (query, GB, API call, message) logged with a customer ID and timestamp.
- **Idempotency and dedup** — replays and retries must not double-count.
- **Reconciliation to invoices** — monthly tie-out of metered events to billed revenue; investigate any variance over a small threshold.
- **A rating engine** — the layer that turns events into dollars per the customer's specific price plan, including tiers, volume discounts, and credits.

### 8.2 Attribution: tying spend to cohorts

CAC modeling needs S&M spend attributable to a *signature month.* That requires:

- **Marketing attribution** — first-touch and multi-touch models that assign demand-gen spend to the cohorts it produced. Imperfect, but directionally necessary.
- **Sales cost allocation** — AE and SE time and commission mapped to the deals they closed in that month.
- **CS cost allocation** — CSM and SA cost mapped to the accounts (and therefore cohorts) they manage, so Expansion-CAC can be attributed.

### 8.3 The instrumentation stack

| Layer | Purpose | Representative tooling |
|---|---|---|
| Event capture | Log billable usage events | In-house pipeline, Segment-style event bus |
| Metering and rating | Turn events into priced amounts | Metronome, Orb, m3ter, Amberflo, in-house |
| Billing and invoicing | Generate invoices, collect payment | Stripe (per-usage billing), Maxio, Zuora, in-house |
| Revenue recognition | ASC 606 schedules, ASC 340-40 amortization | Maxio, Zuora RevPro, Leapfin, in-house |
| Analytics and cohorts | Build maturation curves, cohort triangles | Warehouse (Snowflake/Databricks) + dbt + BI |
| CRM | Spend attribution, deal data | Salesforce, HubSpot |

Stripe deserves a specific mention: its usage-based billing supports metered pricing, and many early-stage usage-based companies run their entire metering-to-invoice flow on it before graduating to a dedicated metering layer like Metronome or Orb as plan complexity grows.

### 8.4 The minimum viable CAC model

If you are early and cannot build all of the above, the minimum viable version is:

1. **Define a qualified customer** — first paid invoice above a floor.
2. **Tag every qualified customer with a signature month.**
3. **Pull each customer's monthly metered revenue** from billing.
4. **Compute trailing-90-day run-rate ARR** per customer, summed per cohort.
5. **Allocate S&M** between new-business and expansion as best you can — even a rough split beats a blend.
6. **Build the crossover table** from section 5 for each cohort.

That is a spreadsheet, not a data platform. It is enough to start, and it is infinitely better than dividing quarterly S&M by quarterly logo count.

---

## 9. Counter-Case: When This Approach Does Not Apply

The cohort-maturation, run-rate-ARR, split-CAC machinery in this answer is the right approach for a *genuinely* usage-based business — one where revenue is variable, back-loaded, and expansion-driven. It is the wrong approach, or overkill, in several situations. Be honest about which business you actually have.

### 9.1 Committed-spend-forward contracts

If your "usage-based" contract is really a **drawdown commitment** — the customer commits to spend $500,000 over the year and meters against that balance — you are much closer to a seat-based deal than a pure-usage deal. The committed $500,000 *is* a real TCV. You can divide by it. Classic CAC payback, with a modest haircut for the portion of commitment customers historically fail to consume, works fine. Reserve the full cohort machinery for the *uncommitted* or *overage* portion of revenue, and treat the committed floor with standard SaaS CAC math.

### 9.2 Stable, non-ramping usage

Some usage-based products have **flat consumption from day one** — the customer plugs in, hits steady-state usage within a month, and stays there. A simple utility-style API where customers do not "ramp" has no meaningful maturation curve. In that case month-1 run-rate ARR is a fine denominator and classic CAC payback applies directly. The cohort-maturation apparatus exists to handle the *ramp*; if there is no ramp, you do not need it.

### 9.3 Pure self-serve freemium with negligible CAC

If acquisition is entirely product-led — no AEs, no SDRs, marginal marketing spend — then Land-CAC is so small that obsessing over its measurement is a poor use of time. The economic question for a freemium funnel is **free-to-paid conversion rate and infrastructure cost-to-serve free users**, not CAC payback. Model the funnel, not the cohort crossover. (Once the company layers an enterprise sales motion on top of the self-serve base, the full apparatus comes back — but for the pure-PLG slice it is overkill.)

### 9.4 Pre-product-market-fit or tiny n

Cohort modeling needs *enough cohorts with enough history.* If you have signed 14 customers and your oldest cohort is four months old, you do not have a maturation curve — you have anecdotes. Forcing a cohort model on a tiny, young dataset produces false precision. At that stage, track each account's usage individually, talk to customers, and wait until you have 6-plus months of history across several cohorts before trusting the curve.

### 9.5 Hyper-volatile or seasonal usage

If your customers' usage swings violently with their own business cycles — a tax-software API that spikes every April, an e-commerce infrastructure product that triples on Black Friday — then even a 90-day trailing run-rate ARR misrepresents the account. You need **seasonally-adjusted run-rate ARR** or a trailing-twelve-month base, and you should be cautious comparing cohorts that landed in different seasons. The standard apparatus still applies, but the run-rate ARR definition needs a seasonality correction first.

| Situation | Use full cohort apparatus? | Use instead |
|---|---|---|
| Genuine uncommitted usage with ramp | Yes — the core case | n/a |
| Committed drawdown contract | Partly | Classic CAC on the committed floor |
| Flat, non-ramping usage | No | Month-1 run-rate ARR, classic payback |
| Pure self-serve freemium | No | Free-to-paid funnel economics |
| Pre-PMF, fewer than ~20 customers | No | Account-by-account tracking, qualitative |
| Hyper-seasonal usage | Modified | Seasonally-adjusted or TTM run-rate ARR |

---

## 10. The Board Narrative: Presenting Usage-Based CAC Without Getting Killed

### 10.1 Lead with the shape, not the number

A board that benchmarks your 19-month usage-based payback against a seat-based comp's 13 months will conclude you are inefficient — unless you reframe first. Open the CAC section of the board deck with the **cohort maturation curve and the cohort triangle**, not with a payback number. Show that each cohort is bigger than the last at the same maturity, that run-rate ARR climbs for 24-plus months, and that NRR sits at 120-plus percent. *Then* show payback, and it reads as the natural consequence of a back-loaded revenue model rather than as a problem.

### 10.2 The five numbers to standardize

| Metric | Definition | Why the board needs it |
|---|---|---|
| Land-CAC payback | Months to recover Land-CAC from cohort GP | Health of the acquisition motion |
| Fully-loaded CAC payback | Months to recover land plus expansion CAC | Honest whole-relationship economics |
| Net revenue retention | Cohort run-rate ARR vs. month-3 base | The return mechanism; must be 110-plus percent |
| LTV / fully-loaded CAC | Lifetime GP over total CAC | The 3x quality bar |
| Burn multiple | Net burn / net-new run-rate ARR | Ties unit economics to cash runway |

Define each one precisely, in a footnote, and *never change the definitions* once set. The fastest way to lose board trust is to redefine run-rate ARR or shuffle the Land/Expansion boundary between meetings so trends become meaningless.

### 10.3 What the best operators say

The usage-based finance playbook is not folklore — it is documented by the people who built it. **Kyle Poyar** (formerly of OpenView, now Growth Unhinged) has written extensively on usage-based pricing economics and the cohort-expansion model. **Bessemer Venture Partners** publishes the State of the Cloud and CAC payback benchmarks that frame the 15-25 month usage-based range. **ICONIQ Growth** publishes operating benchmarks that explicitly separate consumption-model retention from seat-model retention. At the company level, Snowflake's Frank Slootman and Mike Scarpelli built an entire investor-relations practice around explaining NRR as the core return engine, and Datadog's Olivier Pomel has repeatedly framed Datadog's land-and-expand consumption motion as the reason payback is slower but LTV is enormous. When you present usage-based CAC, you are standing on a well-documented body of practice — cite it.

### 10.4 The one-paragraph summary for the board

*"We acquire customers at a low Land-CAC and a small initial run-rate ARR. Over the following 24 months each cohort's run-rate ARR grows three-to-seven-fold as customers migrate workloads and adopt new use cases, driven by an expansion motion we fund deliberately. Land-CAC pays back in roughly 11 months; fully-loaded CAC pays back in roughly 15-18 months; LTV-to-CAC clears 3x by month 40. The slower payback versus a seat-based comparable is a function of revenue shape, not efficiency — and the back-loaded shape is exactly what produces our 120-plus percent net revenue retention and our compounding cohort value."*

That paragraph, backed by the maturation curve, the cohort triangle, and the five standardized metrics, is how you model and *defend* CAC for usage-based pricing when there is no upfront contract value.

> **Cross-link:** See *q417 — What the Rule of 40 actually measures*, *q419* (this entry), *q421 — Negative churn for board auditors*, *q429 — Tiered partner programs without margin collapse*, and *q430 — Deal-share partner compensation* for the connected RevOps and SaaS-finance playbook.

---


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


---

## Sources

1. Bessemer Venture Partners — "State of the Cloud" annual report, CAC payback benchmarks.
2. Bessemer Venture Partners — "The Bessemer 10 Laws of Cloud Computing."
3. Bessemer Venture Partners — "Scaling to $100 Million" ARR benchmarks.
4. OpenView Partners — "Usage-Based Pricing" research series.
5. OpenView Partners — annual SaaS Benchmarks Report.
6. Kyle Poyar — "Growth Unhinged" newsletter, usage-based pricing economics.
7. Kyle Poyar / OpenView — "The Usage-Based Pricing Playbook."
8. ICONIQ Growth — "Growth & Efficiency" SaaS operating benchmarks.
9. ICONIQ Growth — consumption-model retention benchmark studies.
10. Snowflake (SNOW) — Form 10-K, revenue recognition and remaining performance obligations.
11. Snowflake (SNOW) — investor presentations on net revenue retention.
12. Frank Slootman & Mike Scarpelli — Snowflake earnings call commentary on consumption economics.
13. Datadog (DDOG) — Form 10-K, usage-based revenue and dollar-based net retention.
14. Datadog (DDOG) — investor day, land-and-expand consumption motion.
15. MongoDB (MDB) — Form 10-K, Atlas consumption revenue disclosure.
16. Twilio (TWLO) — Form 10-K, usage-based revenue and dollar-based net expansion rate.
17. Cloudflare (NET) — Form 10-K, hybrid usage and subscription revenue.
18. FASB ASC 606 — "Revenue from Contracts with Customers."
19. FASB ASC 606 — variable consideration and the constraint guidance.
20. FASB ASC 340-40 — "Other Assets and Deferred Costs — Contracts with Customers" (capitalized contract costs).
21. AICPA — revenue recognition guidance for software and SaaS entities.
22. AWS Marketplace — seller listing fee and private-offer fee schedule.
23. Microsoft Azure Marketplace / commercial marketplace — transaction fee documentation.
24. Google Cloud Marketplace — partner program fee documentation.
25. a16z — "The Metrics Behind Consumption-Based Businesses."
26. a16z — "16 Startup Metrics" (LTV, CAC, payback definitions).
27. David Skok, For Entrepreneurs — "SaaS Metrics 2.0" (CAC payback, LTV/CAC).
28. Metronome — usage-based billing and metering documentation.
29. Orb — metering and revenue analytics documentation.
30. m3ter — usage-based metering and revenue management resources.
31. Amberflo — usage-based pricing and metering resources.
32. Stripe — usage-based and metered billing product documentation.
33. KeyBanc Capital Markets — annual SaaS Survey, CAC and retention benchmarks.
34. SaaS Capital — "Spending Benchmarks for Private B2B SaaS Companies."
35. Battery Ventures — "State of the OpenCloud" usage and retention data.
36. Snowflake (SNOW) — Form 10-K, cost of revenue and gross margin discussion.
37. Anthropic & OpenAI — published per-token API pricing as reference points for inference-cost economics.
38. Tomasz Tunguz, Theory Ventures (formerly Redpoint) — analyses of consumption-based growth and net dollar retention.
39. ProfitWell / Paddle — retention and pricing benchmark research.
40. Notion / Bessemer "Cloud 100" methodology — efficiency and growth scoring for cloud companies.
