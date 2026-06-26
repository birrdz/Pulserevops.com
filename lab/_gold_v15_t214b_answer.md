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
