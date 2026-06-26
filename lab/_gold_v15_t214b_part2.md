
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
