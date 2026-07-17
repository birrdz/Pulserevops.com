# Arturo — Competitors & Market Landscape

> Internal research brief for Kory White's job prep. Facts only, no opinions on who is "better." **Arturo is DEFUNCT** (ceased operations 2025 following an asset sale). This document profiles the property-intelligence / geospatial-analytics-for-insurance market Arturo competed in.

## Market overview

Arturo operated in the "property intelligence" or "geospatial AI for insurance" market: companies that apply computer vision and machine learning to satellite, aerial, and other imagery to derive physical property characteristics (roof condition/material, structures, vegetation, pools, etc.) and risk-predictive analytics for P&C insurance underwriting, pricing, claims, and portfolio/catastrophe management. Arturo's differentiators were its origin as a deep-learning spin-out of American Family Insurance (independent from 2018), its blend of satellite + aerial + ground-level + multispectral imagery on one platform, its ~100+ property attributes returned quickly via API, and its strong Australian footprint (e.g., processing ~9M Australian residential properties with Suncorp; IAG Firemark Ventures as an investor). A recurring market theme is **consolidation**: several of Arturo's peers have been acquired by larger data/analytics or imagery companies, while Arturo itself did not survive as a standalone.

## Competitor profiles

### Cape Analytics (now a Moody's company)
Cape Analytics applies computer vision and machine learning to geospatial imagery (satellite/aerial) plus other data to produce 120+ risk-predictive property attributes on an individual-address basis across the US and parts of Canada and Australia, covering perils such as wildfire, wind, hail, and hurricane. In January 2025, Moody's Corporation announced an agreement to acquire Cape Analytics, folding its geospatial AI into Moody's insurance risk models. **Difference vs. Arturo:** Cape was arguably Arturo's most direct US head-to-head competitor (near-identical attribute-from-imagery pitch); it was independent/VC-backed (DCVC) rather than an insurer spin-out, and it survived via acquisition into a large ratings/analytics firm. **Status: operating** (as part of Moody's).
Sources: [capeanalytics.com](https://capeanalytics.com/) · [Moody's press release](https://ir.moodys.com/press-releases/news-details/2025/Moodys-to-Acquire-CAPE-Analytics-Adding-AI-Powered-Geospatial-Property-Risk-Intelligence-to-Its-Industry-Leading-Insurance-Risk-Models/default.aspx)

### ZestyAI (Zesty.ai)
ZestyAI provides AI-powered, property-level risk models for insurers, emphasizing climate and catastrophe perils. Its flagship Z-FIRE wildfire model combines aerial imagery, fire science, and proprietary modeling; the company also covers hail, wind, severe convective storm, and non-weather water, claiming coverage of a large share of loss-driving P&C perils. **Difference vs. Arturo:** ZestyAI leans more toward predictive *risk scoring / cat modeling* (especially wildfire) than the broad "extract many physical attributes" catalog that defined Arturo; it is heavily concentrated in climate-peril underwriting. **Status: operating** (independent).
Sources: [zesty.ai](https://zesty.ai/) · [Z-FIRE product](https://zesty.ai/products/wildfire)

### Betterview (acquired by Nearmap)
Betterview was a property intelligence and risk-management platform for insurance, applying AI and computer vision to identify and mitigate property risk and automate underwriting and inspection workflows, surfacing 100+ AI-powered property attributes. In December 2023, aerial-imagery provider Nearmap (owned by Thoma Bravo) agreed to acquire Betterview, integrating its AI onto Nearmap's high-resolution imagery stack. **Difference vs. Arturo:** Betterview emphasized workflow/inspection tooling and a "risk management" dashboard layer; post-acquisition it is paired with Nearmap's own captive aerial imagery, whereas Arturo sourced multiple imagery types. **Status: operating** (as Nearmap/Betterview).
Sources: [Nearmap newsroom](https://www.nearmap.com/newsroom/nearmap-acquires-betterview) · [PRNewswire](https://www.prnewswire.com/news-releases/nearmap-announces-agreement-to-acquire-betterview-a-complementary-property-intelligence-and-risk-management-platform-302006721.html)

### Verisk
Verisk is a large, established global data-analytics and technology provider to insurance. Its Aerial Imagery Analytics offering sources imagery from the Vexcel Data Program (a very large aerial imagery program) and applies computer-vision ML to derive property analytics for P&C underwriting and rating; it also sells adjacent data such as Roof Age, Homeowner Data, and Property History. Notable adopter: Florida's Citizens Property Insurance. **Difference vs. Arturo:** Verisk is a diversified incumbent (ISO ratings, cat modeling, claims data) for whom imagery analytics is one product line among many, versus Arturo's single-focus startup; scale, distribution, and bundled insurance data were Verisk's advantages. **Status: operating** (large public company).
Sources: [Verisk Aerial Imagery Analytics](https://www.verisk.com/products/aerial-imagery-analytics/) · [Citizens adoption](https://www.verisk.com/company/newsroom/citizens-adopts-aerial-imagery-analytics-from-verisk-to-improve-underwriting-in-florida-market/)

### HOVER
HOVER turns smartphone photos of a home into a fully measured 3D model with dimensions for roof, siding, walls, windows, and doors. Its primary users are contractors (material takeoffs, estimates) and, increasingly, insurance adjusters (claim-ready damage documentation from a single visit). **Difference vs. Arturo:** HOVER is fundamentally a *ground-level, user-captured measurement/3D* product for claims and contractor estimating, not a remote-imagery, address-based underwriting-intelligence platform; the overlap with Arturo is partial (property measurement/claims) rather than direct. **Status: operating** (independent).
Sources: [hover.to](https://hover.to/) · [HOVER product](https://hover.to/product/)

### CoreLogic / Cotality
CoreLogic is a major property-data and analytics provider spanning mortgage, insurance, real estate, and government, anchored by assets such as its integrated property identifier (CLIP). In March 2025 the company rebranded to **Cotality**. Its insurance offerings include property attributes, hazard/risk data, and catastrophe analytics at national scale. **Difference vs. Arturo:** Cotality (CoreLogic) is a broad incumbent property-data aggregator with deep public-record, hazard, and valuation datasets, whereas Arturo was imagery-AI-first and much smaller; the two overlapped mainly on property attributes and risk data. **Status: operating** (rebranded to Cotality).
Sources: [Cotality press release](https://www.cotality.com/press-releases/meet-cotality) · [Insurance Journal](https://www.insurancejournal.com/news/national/2025/03/24/816859.htm)

### Insurdata
Insurdata (founded 2017, Denver, CO) focuses on high-resolution exposure data and geocoding for the re/insurance industry, using a multi-sourced methodology to improve pricing, underwriting, and risk management — addressing inadequate/aggregated exposure data and missing attributes such as first-floor elevation. **Difference vs. Arturo:** Insurdata's emphasis is *exposure data quality and geocoding* (getting the risk located and characterized accurately, often for reinsurance/portfolio use) rather than Arturo's roof/structure attribute extraction from imagery for primary underwriting. **Status: operating** (independent).
Sources: [insurdata.io](https://www.insurdata.io/) · [CB Insights profile](https://www.cbinsights.com/company/insurdata)

## Comparison table

| Company | Core offering | Primary imagery/data | Insurance focus | How it differed from Arturo | Status (2025–26) |
|---|---|---|---|---|---|
| **Arturo** | 100+ property attributes + predictive analytics from imagery | Satellite + aerial + ground-level + multispectral | Underwriting, pricing, claims, cat/portfolio | (baseline) AmFam deep-learning spin-out; multi-imagery blend; strong Australia footprint | **DEFUNCT — ceased operations 2025 after asset sale** |
| **Cape Analytics** | 120+ risk-predictive attributes per address | Satellite + aerial | Underwriting automation, inspection, weather/cat perils | Most direct US rival; VC-backed, not an insurer spin-out; survived via acquisition | Operating (Moody's company, acquisition announced Jan 2025) |
| **ZestyAI** | Property-level AI risk models/scores | Aerial imagery + permits + weather data | Climate/cat perils — wildfire (Z-FIRE), hail, wind, water | More cat-risk scoring vs. broad attribute extraction | Operating (independent) |
| **Betterview** | Property intelligence + risk-mgmt workflow, 100+ attributes | AI/CV on aerial imagery (now Nearmap's) | Underwriting + inspection workflow automation | Workflow/inspection dashboard emphasis; now on Nearmap captive imagery | Operating (acquired by Nearmap, Dec 2023) |
| **Verisk** | Aerial Imagery Analytics + broad insurance data | Vexcel aerial imagery + ML; multi-platform | Underwriting, rating, loss control | Diversified incumbent; imagery is one line among many | Operating (large public co.) |
| **HOVER** | Smartphone photos → measured 3D property model | User-captured ground-level photos | Contractor estimating + claims adjusting | Ground-level measurement/3D for claims, not remote underwriting intel | Operating (independent) |
| **CoreLogic / Cotality** | Broad property data, analytics, hazard/cat | Public records + hazard data + imagery | Underwriting, valuation, cat analytics | Incumbent data aggregator; deeper records/valuation, less imagery-AI-first | Operating (rebranded Cotality, Mar 2025) |
| **Insurdata** | High-resolution exposure data + geocoding | Multi-sourced geocoding methodology | Exposure quality, pricing, reinsurance/portfolio | Exposure/geocoding focus vs. attribute extraction | Operating (independent, founded 2017) |

## Takeaways for the market

- **Arturo is the outlier that did not survive.** Every profiled peer is still operating as of 2025–26 — several through acquisition (Cape → Moody's; Betterview → Nearmap), one via rebrand (CoreLogic → Cotality). Arturo instead ceased operations in 2025 after an asset sale ([The Insurer](https://www.theinsurer.com/ti/news/arturo-ceases-operations-after-asset-sale-ceo-says-2025-07-30/), [Coverager](https://coverager.com/arturos-website-goes-dark-following-asset-sale/)).
- **Consolidation was the dominant market dynamic:** large ratings/analytics firms (Moody's, Verisk, CoreLogic/Cotality) and imagery providers (Nearmap) absorbed or out-scaled the pure-play startups.
- **Segmentation:** the field splits between broad attribute-extraction platforms (Arturo, Cape, Betterview, Verisk), cat-peril risk scoring (ZestyAI), exposure/geocoding (Insurdata), incumbent data aggregation (Cotality), and ground-level measurement/claims (HOVER).
