# Arturo — Product & Technology

> Internal research brief for Kory White's job prep. Facts only, cited inline. Arturo ceased operations in 2025; the company is described in past tense, the technology neutrally.

## What the platform did

Arturo was a property-intelligence platform that derived structured physical-property characteristics and predictive analytics from imagery, delivered on demand through an API. It combined multispectral imagery, geographic data, and a customer's own portfolio data with machine-learning models on a single platform to serve the P&C insurance, reinsurance, lending, and securities markets ([Business Wire, Series B](https://www.businesswire.com/news/home/20210427005718/en/), [Brains Behind AI](https://brainsbehind.ai/arturo/)). The company originated as a deep-learning spin-out of American Family Insurance and was briefly known as Deep Image Analytics before becoming independent in 2018 ([CB Insights](https://www.cbinsights.com/company/arturo-1)).

## Imagery sources

Arturo was imagery-agnostic and fused multiple layers of remote-sensing input rather than relying on a single source:

- **Aerial imagery** flown from aircraft — the primary workhorse, chosen because it offered higher resolution and finer granularity than satellite (fine enough to detect issues down to individual missing shingles) ([InsTech](https://www.instech.co/knowledge-centre/arturo-property-intelligence-from-the-sky/)).
- **Satellite imagery**, including satellite-derived **synthetic aperture radar (SAR)**, which could "see through clouds" to assess flooding impact in near real time during catastrophes ([InsTech](https://www.instech.co/knowledge-centre/arturo-property-intelligence-from-the-sky/)).
- **Drone and ground-level imagery** for closer, oblique views.
- **Multispectral imagery** — several co-registered image layers of the same scene — combined with geographic and portfolio data ([Business Wire](https://www.businesswire.com/news/home/20210427005718/en/)).

Rather than owning a fleet, Arturo fetched current imagery on demand from third-party content providers, notably **Nearmap** and **Maxar**, at the moment of an API call ([Arturo, "Hello World" on Medium](https://arturo-ai.medium.com/hello-world-1c160700512d)). It also announced partnerships to widen its stratospheric-imagery supply, adding **Near Space Labs** (Aug 2020) and **Urban Sky** (Mar 2021) as high-resolution balloon/stratospheric providers ([Business Wire — Near Space Labs](https://www.businesswire.com/news/home/20200819005141/en/), [Business Wire — Urban Sky](https://www.businesswire.com/news/home/20210309005247/en/)).

## Models and attributes

Arturo ran proprietary **deep-learning computer-vision models** over high-resolution imagery to extract structured observations and predictions for both residential and commercial properties. Public materials described the models as "deep learning" without naming specific architectures. The platform reported **100+ property attributes** (some later materials cited 150+), including roof condition and damage, roof composition/material, roof area and type, number of stories, building perimeter/footprint, exterior structures, solar panels, tree overhang, and proximity to flood and fire hazards ([InsTech](https://www.instech.co/knowledge-centre/arturo-property-intelligence-from-the-sky/), [Business Wire](https://www.businesswire.com/news/home/20210427005718/en/)). Beyond static measurement, the models produced **predictive** outputs such as the likelihood of a roof needing replacement or a property's wildfire exposure ([Medium](https://arturo-ai.medium.com/hello-world-1c160700512d)).

Two technical practices distinguished the platform:

- **Per-property and per-attribute confidence scores** returned with every on-demand analysis, so users knew when to trust a machine prediction and when to route it for human review ([Medium](https://arturo-ai.medium.com/hello-world-1c160700512d), [Brains Behind AI](https://brainsbehind.ai/arturo/)).
- **"Full Loop" deep learning** — a feedback mechanism that captured customer input from API interactions and fed it back into model retraining for continuous improvement. Models were validated against years of actual claims and inspection data from American Family, a top-10 U.S. insurer ([Medium](https://arturo-ai.medium.com/hello-world-1c160700512d)). Reported accuracy examples included identifying roof type with ~94% accuracy across the U.S. ([InsTech](https://www.instech.co/knowledge-centre/arturo-property-intelligence-from-the-sky/)).

## Speed and API delivery

The product was built for real-time, address-based lookups. When a customer requested data on a property through Arturo's API, the system fetched imagery from its content providers on the fly, ran it through the deep-learning models, and returned structured data — **often in under five seconds** ([InsTech](https://www.instech.co/knowledge-centre/arturo-property-intelligence-from-the-sky/)). At the batch end of the scale, Arturo processed nearly **9 million properties — every residential property in Australia — in about 48 hours** with client Suncorp, a dataset that had previously taken roughly 18 months to compile ([Brains Behind AI](https://brainsbehind.ai/arturo/), [InsurTech Insights](https://www.insurtechinsights.com/arturo-delivers-insights-across-nearly-9-million-australian-properties/)).

## Use cases

Arturo positioned the same attribute-and-prediction feed across the insurance value chain:

- **Underwriting and pricing / rating** — roof and structure condition informing risk selection and premium.
- **Address-based quote pre-fill** — API returning property characteristics to auto-populate quote and underwriting systems, reducing manual data entry.
- **Portfolio risk** — aggregate exposure analysis across a book of business.
- **Catastrophe response** — SAR-based flood assessment and post-event damage triage.
- **Claims** — remote damage assessment without a site visit; InsTech noted roughly a 30-minute reduction per claim ([InsTech](https://www.instech.co/knowledge-centre/arturo-property-intelligence-from-the-sky/), [Business Wire](https://www.businesswire.com/news/home/20210427005718/en/)).

A notable go-to-market channel was the Oct 2020 alliance with **LexisNexis Risk Solutions**, which paired Arturo's aerial-imagery ML with LexisNexis's claims and geospatial weather data to deliver roof-condition solutions to U.S. home insurers ([LexisNexis Risk Solutions](https://risk.lexisnexis.com/about-us/press-room/press-release/20201022-arturo-alliance)).

## How it compared technically to peers

Arturo competed with **Cape Analytics, ZestyAI, Betterview, Verisk, HOVER, CoreLogic/Cotality, and Insurdata** — all applying computer vision to geospatial imagery for property risk ([CB Insights](https://www.cbinsights.com/company/arturo-1)). The space shared a common pattern (CV models over aerial/satellite imagery producing property attributes), with differentiation on data depth, accuracy, and specialization. ZestyAI leaned into proprietary datasets and regulator-accepted **catastrophe models, especially wildfire** ([AI Market Watch](https://www.ai-market-watch.com/company/zestyai)); **Betterview** was acquired by aerial-imagery provider **Nearmap** in Dec 2023, vertically integrating imagery capture with analytics ([businessmodelcanvastemplate.com](https://businessmodelcanvastemplate.com/blogs/competitors/betterview-competitive-landscape)). Arturo's comparative technical emphases were its **multi-source imagery fusion** (aerial + satellite/SAR + drone + ground-level + multispectral) rather than a single feed, its **sub-5-second on-demand API** with per-attribute confidence scoring, and its **Full Loop retraining** validated against a top-10 carrier's real claims history — a lineage advantage from its American Family origin.

---
*Sources verified July 2026. Unverifiable model-architecture specifics (exact network types, layer counts) were not published and are omitted.*
