# Arturo — GTM Playbook + KPIs

> Internal brief for Kory White's job prep. NOT for publication.
> Two clearly separated layers: **(A) VERIFIED Arturo facts** (cited, real URLs) and **(B) GENERAL B2B-insurtech GTM/KPI framework** (industry best-practice, NOT Arturo-specific). Arturo is **defunct** (ceased operations 2025) — company described in past tense. No Arturo metric below is invented; unlabeled numbers are general-industry benchmarks.

---

## A. VERIFIED — Arturo's actual GTM motion

**Who they sold to.** Arturo was a property-intelligence provider selling into the **P&C insurance ecosystem** — home and commercial carriers, plus reinsurance, lending, and securities buyers. Its go-to-market centered on large carriers rather than SMB volume. Publicly named customers/relationships included **USAA, American Family, Openly, Hippo (2019), Suncorp (AU), and IAG (AU)**. ([InsTech profile](https://www.instech.co/knowledge-centre/arturo-property-intelligence-from-the-sky/); [InsurTech Digital](https://insurtechdigital.com/technology-and-ai/american-family-insurance-spin-out-arturo-innovates-proptech))

**Founding advantage / warm-start motion.** Arturo was a **deep-learning spin-out from American Family Insurance** (independent from 2018 after ~3 years internal R&D). That heritage gave it an anchor carrier, domain credibility, and a strategic investor on the cap table — a classic "incubated-by-a-customer" GTM edge that shortens the trust cycle with other carriers. ([LexisNexis release](https://risk.lexisnexis.com/about-us/press-room/press-release/20201022-arturo-alliance))

**Product delivery = API + platform.** Arturo sold an **API-based** property-intelligence product: address-based quote pre-fill, portfolio-level scoring, 100+ derived property attributes (roof condition/composition, exterior structures, solar, hazard proximity), reportedly returned in ~5 seconds. Delivery model supported **straight-through processing** in underwriting (eliminating on-site inspection for lower-risk properties) and **remote claims** assessment. This is a usage/consumption-shaped product — value scales with addresses and API calls. ([InsTech profile](https://www.instech.co/knowledge-centre/arturo-property-intelligence-from-the-sky/))

**Documented value proof points (from one client, per InsTech).** Remote claims assessment cut "average time spent on each claim by 30 minutes, resulting in several million dollars of savings"; the models were cited at "94% accuracy" on roof types, with coverage of "over 70% of the US and the four major cities in Australia." *Note: these are Arturo/InsTech-stated figures, single-client and vendor-sourced — treat as marketing claims, not audited results.* ([InsTech profile](https://www.instech.co/knowledge-centre/arturo-property-intelligence-from-the-sky/))

**Channel / partnership play — the standout GTM lever.** In **October 2020, Arturo partnered with LexisNexis Risk Solutions** to power the LexisNexis **Rooftop** solution: Arturo's aerial-imagery ML plugged into LexisNexis's claims + weather data and, critically, its existing distribution into U.S. home insurers. This is a textbook **embed-in-an-incumbent-channel** move — reaching carriers through a data provider already integrated in their workflows rather than selling each carrier direct. ([LexisNexis release](https://risk.lexisnexis.com/about-us/press-room/press-release/20201022-arturo-alliance); [Coverager](https://coverager.com/lexisnexis-and-arturo-partner-to-deliver-analytics-powered-roof-solutions/))

**Land-and-expand with large insurers.** The Australia deployment is the clearest expansion signal: with **Suncorp**, Arturo processed **~9 million properties (effectively every residential property in Australia) in ~48 hours** — a portfolio-scale engagement, not a single-line pilot. **IAG** was both a customer relationship and, via **IAG Firemark Ventures**, an investor — the incubation pattern repeated in-market. ([InsurTech Insights](https://www.insurtechinsights.com/arturo-delivers-insights-across-nearly-9-million-australian-properties/); [IAG newsroom](https://iag.com.au/newsroom/innovation/iag-invests-arturo-ai-powered-analytics-start))

**Marketing / positioning evolution.** In **March 2023** Arturo rebranded around "**property intelligence for the entire insurance ecosystem**," and (per agency Flo.) deliberately shifted from a technology/AI-first pitch to a **confidence/"clarity, speed, reliability"** narrative. Flo.'s account explicitly names the GTM friction Arturo faced: **multi-stakeholder buying, long sales cycles, and risk-averse, AI-skeptical decision-makers** — with activation timed around major industry events. ([Businesswire rebrand](https://www.businesswire.com/news/home/20230320005106/en/); [Flo. case study](https://www.flomktg.com/client-stories/arturo))

**Capital backing the motion.** ~**$47M** total: Series A **$8M (2020)**, Series B **$25M (2021)** led by Atlantic Bridge; investors included American Family, Crosslink, IAG Firemark Ventures, and RPS Ventures. ([Businesswire Series A](https://www.businesswire.com/news/home/20200407005756/en/))

**Outcome.** Despite the anchor customers and channel, Arturo **ceased operations in 2025 following an asset sale** (coverage July 30, 2025; website went dark; CEO Marty Smuin confirmed). Public reporting did **not** cleanly name the acquiring legal entity (Smuin referenced the tech continuing in "earth observation" for large insurers; a "Risk Solutions" buyer is referenced but **unverified** — do not assert it as fact). ([The Insurer](https://www.theinsurer.com/ti/news/arturo-ceases-operations-after-asset-sale-ceo-says-2025-07-30/); [Coverager](https://coverager.com/arturos-website-goes-dark-following-asset-sale/))

**What the record does NOT tell us (so I will not invent it):** Arturo's ACV, CAC, LTV, NRR, pilot-to-production conversion, logo count, or API-call volumes were never publicly disclosed. Everything in Section B is general framework, not an Arturo number.

---

## B. GENERAL FRAMEWORK — how a B2B insurtech / property-data company like Arturo goes to market and what it measures

*This section is industry best-practice for a data/analytics insurtech selling into carriers. It is a lens for interviews, NOT a description of Arturo's internal metrics.*

**The motion (enterprise, carrier-led):**
1. **Land via pilot / POC** — a bounded proof (e.g., score a sample book, benchmark accuracy vs. current inspection process) with a champion in underwriting, claims, or data science.
2. **Prove ROI** — loss-ratio impact, inspection cost avoided, cycle-time reduction, straight-through-processing rate.
3. **Convert pilot → production** through a multi-stakeholder committee (underwriting, actuarial, IT/security, procurement, compliance) — the long, risk-averse cycle Flo. described.
4. **Expand** — more lines, more states/geographies, more of the portfolio, more API endpoints (underwriting → claims → cat response).
5. **Channel leverage** — embed in data aggregators (LexisNexis, Verisk-type) and policy-admin/underwriting-workbench platforms to inherit distribution.

**Typical KPI set:**

| KPI | What it measures | General benchmark range (enterprise insurtech/data) |
|---|---|---|
| Sales cycle length | POC-start → signed production contract | 6–18 months (enterprise carriers often 9–12+) |
| ACV (annual contract value) | Recurring revenue per logo | Low six figures → low seven figures for large carriers |
| Pilot/POC → production conversion | % of pilots that become paid production | ~20–40% healthy; higher signals strong fit |
| Net revenue retention (NRR) | Expansion net of churn within base | >110% good; >120% best-in-class for usage-based data |
| Gross revenue retention | Logo/$ retained before expansion | >90% target |
| CAC payback | Months of gross margin to recover CAC | <18–24 months acceptable in enterprise |
| LTV:CAC | Lifetime value vs. acquisition cost | ≥3:1 target |
| Logo count / named-carrier penetration | # of carriers + tier of each | Fewer, larger logos > many small |
| Usage: API calls / addresses scored | Consumption depth (proxy for stickiness & expansion) | Growth MoM; % of client's book covered |
| Model accuracy / precision-recall | Product quality vs. ground truth | Vendor-stated; carriers audit independently |
| Gross margin | Software vs. imagery/compute COGS | 60–80%; imagery/data licensing drags it down |
| Time-to-first-value | POC kickoff → first usable insight | Days-to-weeks; faster = shorter sales cycle |

**Two structural KPI cautions specific to this category (framework, still not Arturo-specific):**
- **Imagery/data COGS compress margin.** Licensing satellite/aerial imagery (Vexcel, Nearmap-type) and compute makes gross margin materially lower than pure SaaS — a real dynamic for any Arturo-like business and a likely pressure on unit economics.
- **Concentration risk.** A few whale carriers = high ACV but fragile GRR; losing (or being incubated by then out-competed by) one anchor can be existential. Arturo's dependence on a small set of large carriers plus a channel partner is consistent with why "great logos" did not guarantee survival.

---

### Bottom line for interview use
Arturo's *verified* GTM = anchor-customer incubation (Am Fam), enterprise direct sales to large P&C carriers (USAA, Suncorp, IAG, Hippo, Openly), a marquee **channel embed with LexisNexis Risk Solutions**, portfolio-scale land-and-expand (9M AU properties), and a 2023 confidence-led rebrand to fight long, AI-skeptical, multi-stakeholder sales cycles — yet it still failed and sold for assets in 2025. The KPI table above is the **standard operating dashboard** for a company like this; none of those figures are documented Arturo numbers.
