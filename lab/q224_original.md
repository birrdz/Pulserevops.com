## Direct Answer
Handle territory disputes by replacing politics with a deterministic, transparent system: (1) score every account on ARR potential, ICP fit, and rep capacity using a published 5–7 variable formula; (2) publish written Rules of Engagement (RoE) before any conflict erupts; (3) enforce a CRO-owned 48-hour resolution SLA with a public ledger; (4) freeze territory changes to quarter boundaries; (5) align comp so reps don't have economic incentive to fight. Reps rarely quit because they lose disputes—they quit because the process feels rigged. The single most powerful lever: make the math auditable by every AE in under 5 minutes.

## Detail

### Why Territory Disputes Spike Attrition
[Gartner's 2024 Sales HR research](https://www.gartner.com/en/sales) attributes **23%** of unwanted AE attrition events to perceived territory unfairness. [Bridge Group's 2024 SaaS AE Metrics Report](https://www.bridgegroupinc.com/) shows median quota attainment drops from **62% to 47%** when territories shift mid-quarter. [Forrester's B2B sales benchmarks](https://www.forrester.com/blogs/category/b2b-sales/) put the cost of a regretted AE departure at **6–9 months of fully-loaded comp** plus a **30–40% productivity gap** on orphaned accounts during ramp of the replacement. [Xactly's 2024 sales performance index](https://www.xactlycorp.com/) corroborates: reps with stable territories hit quota at **1.4x** the rate of those reassigned within the year. [Anaplan's connected planning study](https://www.anaplan.com/) found organizations with formal territory governance see **31% higher** sales productivity year-over-year.

This is not a morale problem. It is a system design problem—and the solution is mechanical, not interpersonal.

### Pillar 1: Build the Model (Pre-Empt the Fight)
**Concrete scoring formula** — publish this exactly, no black box:

`AccountScore = 0.35*ARRpotential + 0.25*ICPfit + 0.20*GrowthSignal + 0.10*Geography + 0.10*RepRelationship`

Keep weights to 5–7 inputs. Anything more complex becomes opaque AND gameable.

- **ARR potential** — firmographics from [Crunchbase](https://www.crunchbase.com/), [LinkedIn Sales Navigator](https://business.linkedin.com/sales-solutions/sales-navigator), [ZoomInfo](https://www.zoominfo.com/) intent + employee-count proxies
- **ICP fit** — industry, size, tech stack match (BuiltWith / G2 signals)
- **Growth signal** — hiring velocity, recent funding, tech adds
- **Geography** — time-zone alignment, regional regulatory familiarity
- **Rep relationship** — prior touches, alumni connections, prior personal account ownership

**Tooling**: Encode the formula in [Salesforce Maps / Territory Planning](https://www.salesforce.com/products/maps/overview/), [HubSpot's territory management](https://www.hubspot.com/products/sales), or [Anaplan for Sales](https://www.anaplan.com/solutions/sales-performance-management/). If the model lives only in a RevOps spreadsheet, it will be questioned.

**Capacity gates**: Cap each rep at **$8M–$10M** current-state ARR ownership. [OpenView's expansion benchmarks](https://openviewpartners.com/blog/) flag saturation above ~150 active accounts as a churn predictor for reps AND customers (under-attention drives logo loss).

**Transparent math**: [Pavilion's](https://www.joinpavilion.com/) RevOps community guidance: every rep should be able to recalculate their territory score in under 5 minutes. If they can't, fix the model.

### Pillar 2: Written Rules of Engagement (RoE)
- **Net-new vs. expansion**: Explicit. Expansion belongs to the CSM-aligned AE; net-new follows the territory map.
- **First-touch-wins** works for prospects under ~$5M ARR. Above that, use **weighted split-credit** per [SaaStr's compensation guidance](https://www.saastr.com/):
  - Single-touch: 100% to closer
  - Multi-touch: 60% closer / 30% prospector / 10% AE-of-record
  - Strategic carve-out: 50% named-account owner / 50% closer
- **Documented carve-outs**: Named-account lists override geographic territory. Publish the list. No back-channel exceptions.
- **Dispute frequency benchmark**: Healthy orgs see **<3% of opps disputed** per quarter. Above 5% means RoE is broken—rebuild before patching individual cases.

### Pillar 3: Resolution SLA + Escalation Path
1. **Hour 0–24**: Dispute filed; both reps submit objective evidence (CRM activity, last-touch date, opp stage progression, BANT confirmation)
2. **Hour 24–48**: RevOps Director makes preliminary call based on data
3. **Hour 48**: If contested, **CRO decides**—no committee, no consensus theater. Binding.
4. **Hour 48+**: Decision logged in public territory ledger with one-paragraph rationale
5. Losing rep gets priority on next **2–3 high-potential** accounts to offset morale hit
6. Repeated appeals (>2 in 90 days from same rep) trigger HR check-in—not punishment, but signal of broken trust

### Pillar 4: Quarter-Boundary Freeze
No mid-quarter territory changes except for terminations, LOA, or PIP completions. [Bridge Group](https://www.bridgegroupinc.com/) data: stable territories for **3+ quarters** correlate with **18–24%** higher close rates. Treat territory like the tax code—predictable wins.

### Pillar 5: Comp-Plan Integration
Territory disputes are amplified by comp design. Pair the territory model with:
- **Accelerators above 100% attainment** so reps focus on closing rather than grabbing accounts
- **SPIFs for under-penetrated segments** to redirect attention away from disputed turf
- **Clawback clauses** when an account leaves within 12 months—reduces grab-and-dump incentive
- **Flatten payouts on cross-boundary deals** so reps don't have economic reason to fight over edge cases

### First 30 Days Implementation Playbook
- **Days 1–7**: Audit current territory map, count active disputes, baseline attainment by rep
- **Days 8–14**: Draft scoring formula with 1 rep advisor + RevOps; publish to leadership
- **Days 15–21**: Open RoE comment period; every AE reviews and signs
- **Days 22–30**: Migrate scoring into Salesforce/HubSpot/Anaplan; publish ledger; announce 48-hr SLA
- **Day 31+**: Weekly compliance check on SLA for the first quarter

### Signs Your Model Is Healthy
- Dispute rate <3% of opps per quarter
- 100% of CRO decisions logged within 48 hours
- Zero hidden carve-outs (verified by quarterly audit)
- Top reps and bottom reps both believe the model is fair (anonymous pulse survey)
- AE attrition <15% annualized, with <5% citing territory as a top-3 reason

### Bear Case (When This Fails)
- **Failure 1—CRO override theater**: CRO publicly favors a star rep; RoE becomes performative; trust collapses within one quarter; tenured reps interview elsewhere. **Recovery**: CRO publicly recuses on disputes involving top 3 reps; delegates to VP Sales for 2 quarters; publishes recusal log.
- **Failure 2—First-touch gaming**: Reps spam every account with a single LinkedIn touch to claim ownership. **Recovery**: Add minimum-activity floor (3+ meaningful touches over 14 days) before a first-touch claim is valid; auto-expire stale claims at 30 days.
- **Failure 3—Mid-quarter shake-ups**: Even "fair" reassignments mid-quarter destroy trust faster than dispute resolution rebuilds. **Recovery**: Public 6-month freeze with CEO-signed commitment; any exception requires CFO + CRO + CEO sign-off.
- **Failure 4—Hidden carve-outs**: Strategic accounts assigned via back-channel. Once discovered, RoE loses credibility for 2+ quarters. **Recovery**: Publish full carve-out list; commit in writing to no future undocumented carve-outs; quarterly third-party audit.
- **Failure 5—Over-engineered scoring**: A 47-variable model nobody understands is functionally identical to no model. **Recovery**: Cut to 5–7 weighted inputs; re-publish with worked examples; require any future variable add to remove an existing one.
- **Failure 6—Comp plan misalignment**: Territory model is fair but comp pays disproportionately for disputed accounts, so reps still fight. **Recovery**: Audit comp by territory tier; flatten payouts on cross-boundary deals; eliminate per-account bonuses.

### Operator Checklist
- [ ] Account scoring model published in shared doc, refreshed quarterly
- [ ] RoE document signed by every AE on hire and re-acknowledged quarterly
- [ ] Territory ledger visible to all sales (decisions + rationale)
- [ ] CRO 48-hour SLA tracked publicly with monthly compliance %
- [ ] Quarter-boundary change freeze enforced—no exceptions without C-suite trio sign-off
- [ ] Quarterly RoE audit by RevOps + CRO + 1 rep representative
- [ ] Dispute frequency tracked monthly; alert if >5%
- [ ] Anonymous quarterly pulse survey on territory fairness perception
- [ ] Comp plan reviewed annually for cross-boundary distortion

See related: [/knowledge/q07](https://pulserevops.com/knowledge/q07) AE ramp curves, [/knowledge/q09](https://pulserevops.com/knowledge/q09) onboarding compensation, [/knowledge/q42](https://pulserevops.com/knowledge/q42) commission split mechanics, [/knowledge/q56](https://pulserevops.com/knowledge/q56) compensation design, [/knowledge/q88](https://pulserevops.com/knowledge/q88) sales pulse surveys, [/knowledge/q133](https://pulserevops.com/knowledge/q133) RevOps tooling stack, [/knowledge/q189](https://pulserevops.com/knowledge/q189) CRO decision frameworks, [/knowledge/q210](https://pulserevops.com/knowledge/q210) quota allocation models.

TAGS: territory-management,ae-morale,quota-allocation,commission-splits,revenue-ops,roe,cro-decisions,sales-attrition,sales-leadership,scoring-models,comp-plan-design,sla-governance