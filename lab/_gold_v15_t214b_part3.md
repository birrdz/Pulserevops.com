
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
