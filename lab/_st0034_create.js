// st0034 -- Commercial Waste & Recycling Hauling Service-Contract Bid
// (Multi-Tenant Retail / Restaurant Account) 2027.
// Pulse Sales Trainings entry. New industry vertical: commercial
// waste/recycling hauling account rep walking a retail-center owner /
// property manager / restaurant operator through a service-contract bid.

const { getStore } = require('@netlify/blobs');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const ID = 'st0034';
const QUESTION = "Commercial Waste & Recycling Hauling Service-Contract Bid (Multi-Tenant Retail / Restaurant Account) 2027 — a 60-Minute Sales Training";

const tags = [
  'sales-training',
  'st0034',
  'commercial-waste-hauling-bid-training',
  'commercial-waste-hauling',
  'recycling-service-contract',
  'multi-tenant-retail',
  'restaurant-waste',
  'organics-diversion',
  'contamination-fee',
  'roll-off-vs-front-load',
  'waste-audit',
  '60-min-meeting',
  'standard-team'
];

const sources = [
  { title: 'Waste Management Inc NYSE:WM (CEO Jim Fish, Houston TX) — the largest integrated waste and environmental-services company in North America: ~$21B revenue + ~48,000 employees + ~260 active landfills + ~340 transfer stations + ~100+ recycling facilities (MRFs) + the dominant commercial front-load + roll-off + compactor hauler for retail centers + restaurants + grocery. Pivotal 2024-2027 commercial dynamics — WM Sustainability Services + WM organics + food-waste diversion programs + Bagster + WM SmartTruck route optimization; commercial front-load pricing typical $90-$450/mo per 2-8yd container by haul-frequency + region + landfill tip-fee pass-through; contamination/overage fees + fuel surcharge + environmental recovery fee + administrative fee the structural "below-the-line" cost stack every retail tenant disputes at renewal.', url: 'https://www.wm.com/' },
  { title: 'Republic Services Inc NYSE:RSG (CEO Jon Vander Ark, Phoenix AZ) — the #2 US integrated waste-services company: ~$15B revenue + ~41,000 employees + ~200+ landfills + ~70+ recycling centers + Republic Services Blue Planet sustainability platform + the Polymer Centers (recycled-plastics processing) + RISE route + container telematics. Pivotal 2024-2027 commercial dynamics — Republic competes head-to-head with WM for multi-tenant retail + restaurant + grocery front-load and compactor service-agreements; standard 36-60 month evergreen auto-renew agreement + liquidated-damages early-termination clause + annual CPI + disposal-cost + fuel + recycling-commodity adjustment the most-disputed renewal mechanics in commercial waste.', url: 'https://www.republicservices.com/' },
  { title: 'GFL Environmental Inc NYSE:GFL (CEO Patrick Dovigi, Vaughan ON Canada) — the #4 North American diversified environmental-services company ~$7.5B revenue + ~20,000 employees + the most acquisitive consolidator in solid waste 2018-2024 (100+ tuck-in acquisitions); plus Casella Waste Systems NASDAQ:CWST (Northeast US regional, Rutland VT), Waste Connections NYSE:WCN (CEO Ronald Mittelstaedt, The Woodlands TX, ~$8.9B revenue, secondary/exclusive-market strategy), and thousands of regional + independent haulers. Pivotal 2024-2027 dynamics — regional + independent haulers win multi-tenant retail and restaurant accounts on (a) local route density + 24-48hr responsiveness (b) flat-rate no-junk-fee pricing transparency (c) flexible month-to-month or 12-month terms vs national-hauler 36-60mo evergreen auto-renew (d) willingness to right-size container + frequency rather than over-service.', url: 'https://www.gflenv.com/' },
  { title: 'US EPA Resource Conservation and Recovery Act (RCRA, 42 USC 6901) + EPA Sustainable Materials Management + EPA WARM (Waste Reduction Model) + EPA 2030 National Recycling Goal (50% recycling rate) + EPA Food Loss and Waste 2030 Reduction Goal — the federal solid-waste regulatory and policy perimeter. Plus state-level organics-diversion mandates driving every commercial waste bid 2024-2032: California SB 1383 (mandatory organic-waste/food-scrap diversion, CalRecycle-enforced, penalties phased in from 2024), Vermont Act 148 Universal Recycling Law, Massachusetts Commercial Food Material Disposal Ban, Connecticut + New York + New Jersey + Maryland + Washington organics-diversion and commercial-recycling mandates. Pivotal bid frame — the hauler is the operator s compliance partner for organics diversion, recycling-stream separation, and the documented diversion records that survive a municipal audit or franchise-hauler-zone enforcement action.', url: 'https://www.epa.gov/rcra' },
  { title: 'National Waste & Recycling Association NWRA (Arlington VA) + Solid Waste Association of North America SWANA (Silver Spring MD) + Waste Dive + Waste360 + Resource Recycling — the industry trade-press, benchmarking, and policy perimeter. Pivotal commercial-waste benchmarking — US solid-waste and recycling industry ~$90B+ revenue; commercial/industrial collection ~45% of hauler revenue; recycling-commodity revenue (OCC old corrugated cardboard, mixed paper, scrap metal) highly volatile and increasingly shared-risk in commercial agreements; commercial container right-sizing (downsizing an over-serviced 8yd 3x/week to a 6yd 2x/week, or compaction) consistently shown to cut a retail tenant total waste cost 15-40% with equal or better service; franchise-hauler municipal zone systems (exclusive commercial-waste franchise zones, common in California and growing) reshaping the competitive bid in many metros.', url: 'https://wasterecycling.org/' },
  { title: 'Commercial-waste retail and restaurant buyer-psychology + the four conversations every waste-hauling account rep avoids at the bid: (1) the over-service / right-sizing conversation — incumbent national haulers routinely leave a retail tenant on an 8yd container collected 3-6x/week long after the tenant store closed a department, switched to e-commerce fulfillment, or installed a baler, because larger container plus higher frequency bills more and the auto-renew agreement removes any forcing function; a documented waste audit (4-week fill-level + weight study) typically supports a 1-2 container-size downsize or a frequency cut worth 15-40% of spend. (2) the junk-fee / below-the-line conversation — fuel surcharge, environmental recovery fee, administrative fee, regulatory cost recovery, and franchise fee can total 25-45% of an invoice and are the single biggest source of retail-tenant distrust; transparent flat-rate or capped-pass-through pricing is the differentiator. (3) the contamination-fee conversation — single-stream recycling and organics contamination (a greasy pizza box, a plastic bag, food in the recycling) triggers contamination/overage surcharges that surprise the operator; the rep who runs a dock walk, labels the stream, and trains the back-of-house staff prevents the fee and earns the renewal. (4) the auto-renew / evergreen-trap conversation — national-hauler commercial agreements carry 36-60 month terms, evergreen auto-renewal, narrow non-renewal notice windows (often 60-90 days), and liquidated-damages early-termination clauses (often 6x monthly charges or 50% of remaining term); the operator who misses the notice window is locked for another full term, and the rep who navigates this honestly — versus exploiting it — wins long-term trust. These four avoided conversations explain most of the margin and retention gap between top-quartile and bottom-quartile commercial-waste account reps.', url: 'https://www.wastedive.com/' }
];

const tldr = `> ### 🗑️ The Pulse Training
> **Who this is for:** **Commercial waste & recycling account reps + sales managers + municipal/franchise-zone reps** at **Waste Management NYSE:WM / Republic Services NYSE:RSG / GFL Environmental NYSE:GFL / Waste Connections NYSE:WCN / Casella + regional and independent haulers** bidding a **multi-tenant retail center, strip mall, mixed-use property, or restaurant** on a front-load, roll-off, compactor, recycling, and organics service-contract — at renewal, at a property-management RFP, or after a tenant complaint about junk fees and contamination charges. Per **NWRA + SWANA + EPA + Waste Dive**: top-quartile reps run a documented **waste audit**, win on **right-sized containers + transparent pricing + organics compliance**, and hold **88-94% renewal**; bottom-quartile reps quote a container and a frequency off a price sheet, hide the fee stack below the line, and churn at the first competitive RFP.
>
> **What teams leave with:** **5-STAGE WASTE BID-WALK (WALK → WEIGH → SHOW → STRUCTURE → SECURE)** + **4 AVOIDED CONVERSATIONS** (right-sizing / junk-fee transparency / contamination fees / auto-renew evergreen trap). Plus verbatim language, a multi-tenant retail role-play, an account-quality self-diagnosis, an EPA RCRA + state organics-mandate compliance walkthrough, and a container right-sizing playbook.
>
> **Sales manager brings:** (1) 3 recent lost-bid debriefs. (2) Waste Bid Kit — 4-week waste-audit scorecard + container right-sizing calculator + fee-stack transparency sheet + organics-diversion compliance cross-walk + contamination-prevention dock-walk checklist + service-agreement term/notice/liquidated-damages template. (3) Whiteboard the last 10 bids by outcome, monthly spend, diversion rate, and retention.

## MEETING AGENDA — 60 MINUTES

| Time | Block | Owner | Outcome |
|------|-------|-------|---------|
| **0:00-0:10** | **Intro + Cold Open** — Rep A quoted a strip-mall owner a flat per-container price, lost to a regional hauler on transparency; Rep B ran a 4-week waste audit on a 14-tenant retail center, right-sized 3 containers, fixed contamination, and won the full property | Sales Mgr | Audit-anchored bid beats price-sheet quote |
| **0:10-0:35** | **Teach** — 5-STAGE (WALK/WEIGH/SHOW/STRUCTURE/SECURE) + 4 avoided conversations + EPA RCRA + state organics-mandate compliance | Sales Mgr | Recite 5 stages + 4 avoided + compliance lenses |
| **0:35-0:45** | **Discussion** — 8 prompts on incumbent over-service, junk-fee objections, contamination, evergreen auto-renew, when to walk | Sales Mgr + room | Audit last 10 bids |
| **0:45-1:05** | **Role-Play** — Property Manager Dana at a 14-tenant retail center comparing your bid to the incumbent national hauler | Pairs | Run the 5-STAGE under a real buyer |
| **1:05-1:10** | **Debrief + Commitments** — 3 Qs + 1 lost bid + 1 verbatim line | Sales Mgr | Audit-first habit |
| **1:10-1:13** | **Leave-Behind** — Waste Bid Script Card + right-sizing calculator + fee-transparency sheet | Sales Mgr | One-pager in every bag |

> ### 🎯 Bottom Line
> A multi-tenant retail center owner doesn't pick you because your container is five dollars cheaper — she picks you because you spent four weeks measuring how full her dumpsters actually are, showed her she's paying for an 8-yard bin collected three times a week that's never more than half full, separated her fee stack onto one transparent line, fixed the contamination that's been costing her overage charges, and built her an organics program that keeps her compliant with the state mandate. Run the **5-STAGE WASTE BID-WALK + 4 avoided conversations + compliance lens** = transparent pricing, higher diversion, and a property owner who renews. Quote a container off a price sheet and hide the junk fees = you win the month and lose the property at the next RFP.

`;

const core = `---

## SECTION 1 — INTRO + AGENDA (0:00-0:10)

> ### 🟡 Coach Note
> Do NOT open with the WM Sustainability Services brochure or the Republic Blue Planet one-pager. Whiteboard. Say the cold-open, the five stages, the four avoided conversations, and the compliance lens. Ten minutes. Hard stop at 0:10.

### The numbers, then the story.

Commercial and industrial collection is roughly **45% of hauler revenue**, and the multi-tenant retail center — a strip mall, a power center, a mixed-use property, a restaurant row — is the most over-serviced, most fee-opaque account type in the entire industry. Per **NWRA + SWANA + Waste Dive**, a documented waste audit on a typical retail tenant supports a container downsize or frequency cut worth **15-40% of spend** with equal or better service, because the container and frequency were set years ago and the auto-renew agreement removed any forcing function to revisit them.

Layer on the regulatory squeeze. **EPA RCRA**, the **EPA 2030 National Recycling Goal**, and a wave of state **organics-diversion mandates** — California SB 1383, Vermont Act 148, Massachusetts and Connecticut and New York and New Jersey and Maryland and Washington commercial food-waste rules — now make the hauler the operator's compliance partner. A restaurant that does not divert organics where it is mandated faces escalating penalties and franchise-zone enforcement. The bid is no longer a container and a price. It is a compliance program.

**The story.** **Rep A** quoted a strip-mall owner a flat per-container price off the regional rate sheet. No walk. No audit. No fee breakdown. The owner compared it line-for-line to a regional hauler whose quote put every fee on one transparent line and offered a 12-month term instead of a 60-month evergreen. **Rep A lost the whole property.**

**Rep B** took a 14-tenant retail center and ran a four-week waste audit — fill levels and weights on every container, dock walks at the two restaurants and the grocery. She found three over-serviced containers, a recycling stream contaminated by one restaurant's grease and plastic, and no organics program in a mandate state. She right-sized the three containers, added an organics route for the restaurants, fixed the contamination with stream labeling and a back-of-house training, and put every fee on one line. **She won the full property, raised total diversion, and the owner signed a multi-year agreement she actually understood.**

> ### ⚠️ Common Trap
> *"Rep A lost because the regional hauler was cheaper."* The regional hauler was not cheaper on the container. It was cheaper on the truth. Rep A's quote looked low and then carried a fuel surcharge, an environmental recovery fee, and an administrative fee that the owner only discovered on invoice three. The owner did not pick a price. She picked the rep who would not be a surprise.

**Transition:** "Next 50 minutes: five-stage waste bid-walk, four avoided conversations, the compliance lens, one role-play. Let's go."

---

## SECTION 2 — THE TEACH (0:10-0:35)

> ### 🟡 Coach Note
> Twenty-five minutes. Split into 5-STAGE (12 min) + Four Avoided Conversations (8 min) + Compliance Lens (3 min) + Account-Quality Self-Diagnosis (2 min).

### Part A — The 5-STAGE WASTE BID-WALK (12 min)

You do not win a multi-tenant property with a per-container price. You earn it by WALKING the docks and enclosures, WEIGHING what is actually being thrown away, SHOWING the owner her over-service and fee stack, STRUCTURING a right-sized transparent agreement, and SECURING a term she understands.

#### Stage 1 — WALK (2.5 min)

The bid starts with a physical walk of every trash enclosure, compactor, dock, and recycling area on the property. Note container size, type (front-load, roll-off, compactor), current collection frequency, condition, contamination, blocked access, and which tenants share which container. The owner or property manager must see you with a clipboard at the enclosure, not handing a quote in the leasing office.

> ### 🎤 Verbatim Script — WALK
> *"Dana — I walked all six enclosures. Two restaurants share an 8-yard front-load on a 3x/week pickup. The grocery has its own compactor. The recycling bin at the north enclosure has cardboard, but also food waste and plastic film — that's a contamination charge waiting to happen. Two enclosure gates don't latch, so you're getting illegal dumping from the parking lot. None of this is in your current agreement. That walk is the bid conversation."*

#### Stage 2 — WEIGH (2.5 min)

Layer on data. Run a four-week waste audit — fill-level readings on each container at every scheduled pickup, weights where possible, photos. This is the difference between a guess and a case. The audit tells you exactly which containers are over-serviced and which streams are contaminated.

> ### 🎤 Verbatim Script — WEIGH
> *"Dana — four weeks of fill-level data. The shared restaurant container averaged 55% full at each 3x/week pickup — you're paying for a third pickup you don't use. The grocery compactor is right-sized. The recycling bin is contaminated about one week in three, which is why you've seen overage fees. The organics? There isn't a program, and you're in a mandate state. That's the picture before we talk price."*

#### Stage 3 — SHOW (2.5 min)

Two-panel reveal. Left: current — container sizes, frequencies, the full fee stack, contamination charges, no organics. Right: proposed — right-sized containers, transparent pricing, contamination fixed, organics program, compliance covered.

> ### 🎤 Verbatim Script — SHOW
> *"Dana — left, your current setup: 8-yard 3x/week shared restaurant container, recycling with monthly contamination fees, no organics, and a fuel surcharge plus environmental fee plus admin fee that add about 32% to your invoice. Right, proposed: 6-yard 2x/week, recycling with labeled streams and a staff training, an organics route for both restaurants, and every fee on one transparent line. Same service level — actually better — at lower total cost and full state compliance."*

#### Stage 4 — STRUCTURE (2.5 min)

Build the agreement. Right-sized containers and frequency, a recycling and organics program, transparent pricing — a flat rate or a clearly capped pass-through — a service-level commitment, and a term and notice window the owner understands.

> ### 🎤 Verbatim Script — STRUCTURE
> *"Dana — the agreement, four parts. (1) Right-sized service: 6-yard 2x/week shared, compactor unchanged, recycling and a new organics route. (2) Transparent pricing: one monthly rate, fuel and disposal capped pass-through stated in writing, no surprise environmental or admin fees. (3) Service commitment: missed-pickup credit, 24-48hr responsiveness, quarterly fill-level review so we right-size again if your tenants change. (4) Term: 36 months, 90-day non-renewal notice clearly stated, no liquidated-damages trap — I'll put the notice date in writing on page one."*

#### Stage 5 — SECURE (2.5 min)

Lock the agreement and the relationship. Confirm the term, the notice date in writing, the quarterly review cadence, and the compliance documentation the owner needs for the state.

> ### 🎤 Verbatim Script — SECURE
> *"Dana — let's lock it. 36-month agreement, the 90-day notice date printed on page one so it's never a trap, quarterly fill-level reviews, and I'll deliver your organics-diversion records every quarter so you're audit-ready for the state mandate. You're not signing a container. You're signing a partner who'll keep right-sizing this as your tenant mix changes."*

### Part B — The Four Avoided Conversations (8 min)

#### Conversation 1 — "Your incumbent has you over-serviced — that bills more, it isn't better service"

National haulers routinely leave a retail tenant on a larger container and a higher frequency than the waste volume justifies, because the auto-renew agreement removes any forcing function to revisit it. **Script:** *"Dana — your shared container is half-full at every pickup. A 6-yard 2x/week handles this with equal service. Over-servicing bills more; it does not protect you. The audit proves the right size."*

#### Conversation 2 — "Let's put your fees on one transparent line"

Fuel surcharge, environmental recovery fee, administrative fee, and regulatory cost recovery can total 25-45% of an invoice and are the biggest source of retail-tenant distrust. **Script:** *"Dana — I'm not going to quote you a low container and bury the rest below the line. One monthly rate. Fuel and disposal are a capped pass-through, stated in writing. If a fee changes, you'll know why before you see it."*

#### Conversation 3 — "Contamination fees are preventable — here's how"

A greasy pizza box, plastic film, or food in the recycling triggers contamination and overage surcharges that surprise the operator. **Script:** *"Dana — those overage charges aren't random. The recycling stream is contaminated about a third of the time. We label the streams, do a 20-minute back-of-house training with the restaurant staff, and the fee goes away. Prevention, not a surprise charge."*

#### Conversation 4 — "Let's talk honestly about your term and your notice window"

National commercial agreements carry 36-60 month terms, evergreen auto-renewal, narrow notice windows, and liquidated-damages early-termination clauses. **Script:** *"Dana — your current agreement auto-renews and the non-renewal window is 60 days. Miss it and you're locked another full term. I'm going to print your notice date on page one of our agreement. I'd rather earn the renewal than trap you into it."*

### Part C — The Compliance Lens (3 min)

Every commercial waste rep must navigate the regulatory perimeter. **EPA RCRA** governs solid-waste handling. The **EPA 2030 National Recycling Goal** and **Food Loss and Waste Reduction Goal** set national direction. The decisive driver is the state **organics-diversion mandate** — California SB 1383, Vermont Act 148, Massachusetts and Connecticut and New York and New Jersey and Maryland and Washington commercial food-waste rules — which require restaurants and food businesses to divert organics and keep documented diversion records. In franchise-hauler zone metros, the hauler is also the operator's interface to the municipal exclusive-zone program. The rep who can speak to the operator's specific mandate, build the organics route, and deliver the diversion records wins on credibility.

### Part D — Account-Quality Self-Diagnosis (2 min)

Every sales manager self-diagnoses each account on five metrics: audit completed before bid, container right-sizing done, fee transparency delivered, organics/recycling compliance in place, renewal rate. The room learns instantly which accounts are top-quartile relationships and which are price-sheet quotes waiting to churn.

> ### 🎯 Bottom Line
> Five stages plus four avoided conversations plus the compliance lens. Stages without the avoided conversations is a competent quote that loses at the next RFP. The avoided conversations without the stages is honesty with no plan.

---

## SECTION 3 — THE DISCUSSION (0:35-0:45)

> ### 🟡 Coach Note
> Whiteboard five columns WALK/WEIGH/SHOW/STRUCTURE/SECURE and four rows for the avoided conversations. Each rep audits the last 10 bids out loud. Count to five after each prompt.

**1 — "When do you walk away from a bid?"** When the owner refuses a waste audit, demands the lowest container price with no interest in service or compliance, and wants a 60-month evergreen with no transparency. **Sales Mgr:** *"That account churns the moment a competitor undercuts. Don't buy a relationship you can't keep."*

**2 — "Incumbent has the tenant over-serviced — how do you prove it?"** Four-week fill-level audit with photos. **Sales Mgr:** *"Data, not opinion. Half-full containers at every pickup is the whole argument."*

**3 — "Owner says 'just give me your best per-container price' — what do you do?"** Redirect to total cost and the fee stack. **Sales Mgr:** *"The container price is a fraction of the invoice. Quote the all-in number or you'll lose to whoever quotes it lower and bills it back."*

**4 — "Restaurant tenant keeps getting contamination fees — how do you fix it before the bid?"** Dock walk, stream labeling, 20-minute staff training. **Sales Mgr:** *"Fix the contamination on the walk-through. You've solved a problem the incumbent kept billing for."*

**5 — "Owner is mid-term on a 60-month evergreen — is there a bid here?"** Yes — find the notice date, build the proposal, deliver it inside the window. **Sales Mgr:** *"Most owners don't know their notice date. Find it, calendar it, and be the rep who showed them."*

**6 — "Organics mandate state, owner has no program — how do you frame it?"** Compliance risk plus penalty exposure plus the documented diversion records. **Sales Mgr:** *"Organics isn't an upsell. It's the law where they operate. Frame it as risk removed."*

**7 — "Recycling-commodity prices crashed — incumbent jacked the recycling rate. Your move?"** Shared-risk transparent pass-through, explained. **Sales Mgr:** *"Don't hide commodity risk and don't eat it blindly. Explain it. Transparency on volatility builds more trust than a fake-flat rate that breaks."*

**8 — "ONE verbatim change."** Each rep names ONE stage they skipped and ONE avoided conversation they dodged this week. **Sales Mgr:** *"CRM task. Monday huddle. Ride-along."*

---

## SECTION 4 — ROLE-PLAY (0:45-1:05)

> ### 🟡 Coach Note
> Pair the reps. One scenario, run it twice with a 60-second reset. Listen for whether the rep insists on the audit, puts the fee stack on one line without flinching, raises contamination and organics, and prints the notice date.

### Role-Play — Property Manager Dana at a 14-Tenant Retail Center (10 min)

**Setup:** Dana Whitfield, property manager at Crossroads Retail Center — a 14-tenant strip and power center with two full-service restaurants, a quick-service tenant, a grocery, and ten retail stores, in a state with an active commercial organics-diversion mandate. The incumbent national hauler's 60-month agreement expires in 80 days. Current spend is roughly $4,200/mo across six front-load containers and one grocery compactor. Tenants have complained about junk fees and surprise overage charges. Dana invited bids from the incumbent, one other national hauler, and your regional firm. The rep is Sam, a commercial account rep at the regional hauler. Run the full 5-STAGE plus the four avoided conversations and close a transparent, right-sized 36-month agreement.

> ### 🎤 PROSPECT — Dana Whitfield
> 44, 9-year property manager, financially literate, manages a portfolio of retail centers, distrusts hidden fees, leads on tenant satisfaction and total cost.
>
> **Deflection 1 (min 4):** *"The incumbent has been here ten years and they just quoted me a lower per-container rate than you. Why would I switch and pay more?"*
>
> **Deflection 2 (min 8):** *"The organics program sounds like an upsell. My restaurants will push back on another line item, and frankly the recycling already costs me in contamination fees. Why add more?"*

> ### 🎤 ACCOUNT REP — Sam
>
> - **Min 0-3 (WALK + WEIGH):** *"Dana — I walked all six enclosures and the compactor, and I'd like to run a four-week fill-level audit before I quote a dollar. On the walk I already saw a shared restaurant container that looks under-filled at pickup, a contaminated recycling stream, two gates that don't latch, and no organics program in a mandate state. Let me weigh it properly, then we talk."*
> - **Min 3-5 (SHOW + STRUCTURE):** *"Here's the audit. The shared 8-yard 3x/week container ran 55% full — a 6-yard 2x/week covers it. Your invoice carries a fuel, environmental, and admin fee adding about 32%. Proposed: right-sized containers, one transparent monthly rate with a capped written pass-through, contamination fixed, an organics route, and quarterly reviews. Lower total cost, better service, full compliance."*
> - **Min 5-7 (Deflection 1 — incumbent quoted lower per-container):** *"Dana — pull the incumbent's invoice, not their quote. Their per-container line is low; their fuel surcharge, environmental recovery fee, and admin fee are not on the quote. My all-in number is below their all-in invoice — and I'll print it as one line so you can check me every month. Ten years of being over-serviced and surprised isn't loyalty earned. It's a renewal nobody re-examined."*
> - **Min 7-9 (Deflection 2 — organics is an upsell):** *"Dana — organics isn't an upsell, it's the law where your restaurants operate, and the penalties for non-compliance fall on the property. I'll build the route, train the back-of-house staff, and deliver your diversion records every quarter so you're audit-ready. And the contamination fees you already pay? Those go away when we label the streams and run a 20-minute training. You'll spend less on waste overall and remove a compliance risk."*
> - **Min 9-10 (SECURE):** *"Two asks. (1) A 36-month agreement at the transparent all-in rate, with your 90-day non-renewal date printed on page one — no trap. (2) Introduce me to two property managers in your portfolio. Sign, and I deliver the right-sized containers, the organics route, the contamination training, and your first quarterly diversion report within 30 days."*

### 60-Second Reset

> ### 🟡 Coach Note
> "Switch sides — 60-second reset." Stand up, read the other role's paper, go.

> ### 🟡 Coach Note
> The rep will want to (a) match the incumbent's per-container price — don't, quote all-in; (b) skip the audit to bid faster — don't, the audit is the entire case; (c) treat organics as optional — don't, it's compliance; (d) leave the notice date out of the agreement — don't, printing it is the trust close.

---

## SECTION 5 — DEBRIEF + COMMITMENTS (1:05-1:10)

> ### 🟡 Coach Note
> Three debrief questions, then commitments.

**Debrief 1 — "Strongest stage? Weakest?"** Reps over-index WALK and under-index WEIGH (the four-week audit feels slow) and STRUCTURE (transparent pricing feels like giving up margin). **Sales Mgr:** *"Skip the audit and you're guessing. Skip transparency and you've trained the customer to distrust you."*

**Debrief 2 — "Which avoided conversation did you dodge most?"** Most name fee transparency. **Sales Mgr:** *"When you bury the fee stack, you win the signature and lose the renewal. Put it on one line and the customer stops shopping you."*

**Debrief 3 — "Which bid do you owe a redo?"** ONE recent lost or flat bid. **Sales Mgr:** *"Email within 48 hours: 'I'd like to run a four-week waste audit on your property — no cost, no obligation — and show you where you're over-serviced.' The audit re-opens the bid."*

> ### 🎤 Commitment Ritual (Verbatim)

**Sales Mgr:** "Open the CRM. Four lines. (1) A bid that closed on price alone or that you lost. (2) A stage you skipped and the verbatim line to redeliver. (3) An avoided conversation you dodged and the reframe. (4) One account that needs a waste audit booked in the next 30 days. Read it aloud."

Coach the vague: *"Which property? Which container? Which dollar number? Out loud now."*

---

## SECTION 6 — LEAVE-BEHIND WALKTHROUGH (1:10-1:13)

> ### 🟡 Coach Note
> Hand out the one-pager. 30 seconds per section. Digital in the CRM, one in every account-rep bag.

> ### 📋 Leave-Behind — "The 5-Stage Waste Bid-Walk Script Card"

> **WHAT TO BRING ON EVERY RETAIL/RESTAURANT BID:** (1) Enclosure-walk checklist (container size, type, frequency, condition, contamination, access, tenant-share map). (2) Four-week waste-audit scorecard (fill levels, weights, photos). (3) Container right-sizing calculator. (4) Fee-stack transparency sheet. (5) EPA RCRA + state organics-mandate cross-walk. (6) Contamination-prevention dock-walk and staff-training checklist. (7) Service-agreement template with term, notice date, missed-pickup credit, no liquidated-damages trap.

> **THE 5-STAGE SCRIPT CARD:** (1) WALK — every enclosure, compactor, dock; note size, frequency, contamination, access. (2) WEIGH — four-week fill-level and weight audit with photos. (3) SHOW — left current vs right proposed: right-sized containers, transparent pricing, contamination fixed, organics added. (4) STRUCTURE — right-sized service, one transparent rate, capped written pass-through, service commitment, clear term. (5) SECURE — lock the agreement, print the notice date, quarterly reviews, deliver diversion records.

> **THE 4 AVOIDED CONVERSATIONS:** (1) Right-sizing — the audit proves the over-service. (2) Fee transparency — one line, capped written pass-through, no surprises. (3) Contamination — label streams, train staff, prevent the fee. (4) Auto-renew/evergreen — find the notice date, print it, earn the renewal.

> **NEVER DO:** quote a container off a price sheet without a walk / skip the four-week audit / bury fuel + environmental + admin fees below the line / leave a tenant over-serviced because it bills more / treat organics as optional in a mandate state / exploit an evergreen auto-renew instead of printing the notice date / quote a fake-flat rate that breaks when commodities move.

> ### 🎯 If You Only Remember One Thing
> You don't win a multi-tenant retail property with a per-container price — you win it by walking every enclosure, weighing what's actually thrown away across four weeks, showing the owner the over-service and the buried fee stack side by side, structuring a right-sized transparent agreement with the organics program the state mandate requires, and printing the non-renewal notice date on page one so the relationship is never a trap. Every property quoted off a price sheet is a future loss at the next RFP; every property that was audited, right-sized, made transparent, and kept compliant is a relationship a competitor can't undercut.

---

## How This Training Sits Inside Your Sales Motion

**Monday huddle** weekly — prior week's bids plus one verbatim drill. **Week 1** WALK every enclosure on the target property. **Weeks 1-4** WEIGH — the fill-level and weight audit. **Bid day** SHOW the left-right panel and STRUCTURE the transparent agreement. **Close** SECURE the term with the printed notice date. **Quarterly** account-quality review and re-right-sizing as tenant mix changes.

`;

const flow = `

## The 5-Stage Waste Bid-Walk Flow

\`\`\`mermaid
flowchart TD
  A[Sales Mgr Opens] --> B[Section 1 Cold Open — Rep A flat per-container quote lost a strip mall on transparency vs Rep B four-week waste audit on a 14-tenant retail center right-sized 3 containers fixed contamination added organics won the property]
  B --> C[Section 2 Teach 25 min]
  C --> C1[Part A 5-STAGE — WALK every enclosure compactor dock / WEIGH four-week fill-level + weight audit / SHOW current over-service + fee stack vs right-sized transparent proposal / STRUCTURE right-sized service + one transparent rate + capped pass-through + clear term / SECURE lock agreement + print notice date + quarterly reviews + diversion records]
  C --> C2[Part B 4 Avoided — container right-sizing / junk-fee transparency / contamination-fee prevention / auto-renew evergreen trap]
  C --> C3[Part C Compliance Lens — EPA RCRA + 2030 Recycling Goal + state organics mandates SB 1383 Act 148 + franchise-hauler zones]
  C --> C4[Part D Account-Quality Self-Diagnosis 5 metrics]
  C1 & C2 & C3 & C4 --> F[Section 3 Discussion 8 prompts]
  F --> G[Section 4 Role-Play — Property Manager Dana 14-tenant retail center vs incumbent national hauler]
  G --> H[Section 5 Debrief + Commitments]
  H --> I[Section 6 Leave-Behind Script Card]
  I --> J[Audit-anchored bid — transparent pricing + right-sized containers + organics compliance + property owner renews]
\`\`\`
`;

const answer = tldr + core + flow;

(async () => {
  const store = getStore({
    name: 'pulse-machine-library',
    siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: process.env.BLOBS_PAT
  });

  const wordCount = answer.split(/\s+/).filter(Boolean).length;
  console.log('ID:', ID);
  console.log('answer chars:', answer.length, '| words:', wordCount);
  console.log('has mermaid:', answer.includes('```mermaid'));

  const record = {
    id: ID,
    question: QUESTION,
    answer,
    tags,
    sources,
    ts: Date.now(),
    model: 'claude-opus-4-7-via-claude-code',
    quality_score: 5,
    polished_at: null,
    polish_history: []
  };

  await store.setJSON('answers/' + ID + '.json', record);
  console.log('wrote answers/' + ID + '.json');

  const idx = await store.get('_index.json', { type: 'json' });
  if (!idx || !Array.isArray(idx.entries)) throw new Error('bad index');
  const existing = idx.entries.findIndex(e => e.id === ID);
  if (existing !== -1) idx.entries.splice(existing, 1);
  idx.entries.unshift({
    id: ID,
    question: QUESTION,
    tags,
    ts: record.ts,
    quality_score: 5,
    polished_at: null
  });
  await store.setJSON('_index.json', idx);
  console.log('index updated, entries:', idx.entries.length);
})().catch(e => { console.error('ERROR', e); process.exit(1); });
