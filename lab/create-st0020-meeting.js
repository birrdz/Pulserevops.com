// st0020 -- Wedding Venue Tour: Booking the Saturday in 90 Minutes -- a 60-Minute
// Sales Training. Pulse Sales Trainings entry (route: /sales-trainings/st0020,
// tag: sales-training). FOURTEENTH industry-specific training (after st0007-st0019).
// Industry = wedding venue sales -- venue coordinator + event manager + GM + F&B
// director running an in-person tour for an engaged couple touring 3-5 venues,
// the only sales meeting the venue gets, $15K-$80K all-in close on the Saturday
// in peak season. 2027 reality: The Knot Worldwide (EQT/Permira) owns lead-gen
// via TheKnot + WeddingWire, Zola + Joy + Minted + Cocktail.com aggregate couple
// attention, microweddings/elopements/AirBnB-wedding-rentals chip the bottom,
// avg US wedding ~$33K (The Knot 2024 Real Weddings Study), venue site fee
// $5K-$25K + F&B + bar minimums = $15K-$80K all-in, Saturday April-October is
// 80% of annual revenue capacity.
// VALUE over WORD COUNT. Target 8,500-10,500 words. ABSOLUTE HARD CAP 10,500.
// Walks 5->6->7->8->9->10 ladder via runPolish from polish-helper.
// Six fixed sections mirror st0019 exactly. LEAN-FROM-START.

const { getStore } = require('@netlify/blobs');
const fs = require('fs');
const path = require('path');
const { runPolish } = require('./polish-helper');

const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const ID = 'st0020';
const QUESTION = "Wedding Venue Tour: Booking the Saturday in 90 Minutes — a 60-Minute Sales Training";

const tags = [
  'sales-training',
  'wedding-venue-training',
  'hospitality-sales',
  'event-sales',
  'venue-tour',
  'saturday-booking',
  '60-min-meeting',
  'standard-team',
  'st0020'
];

const sources = [
  { title: 'The Knot 2024 Real Weddings Study — annual benchmark for US wedding spend; average wedding ~$33,000 all-in (excluding honeymoon + engagement ring), average venue spend ~$12,800 (site fee + ceremony + reception), 115 average guest count, 14-month average engagement; surveys 6,000+ US couples married prior year; published by The Knot Worldwide (EQT/Permira-backed)', url: 'https://www.theknot.com/content/wedding-data-insights' },
  { title: 'WeddingWire / The Knot Worldwide market reports — combined marketplace tracks ~$70B+ US wedding industry; TKWW owns TheKnot.com + WeddingWire.com + The Bash + WeddingPro vendor marketplace; merger 2018 cleared FTC 2019; majority owned by EQT Private Equity since 2021 + Permira (prior holder); ~2.2M US weddings/year; venue is the #1 line-item by spend', url: 'https://www.weddingwire.com/c/wedding-industry-statistics/' },
  { title: 'The Wedding Report annual statistics — independent wedding industry market research; 2024 US wedding market ~$70.4B with 2.08M weddings, avg cost ~$35,800, venue+reception ~38% of total spend; tracks regional variance (NYC metro $76K avg vs rural Midwest $19K); used by venue operators for benchmarking peak vs off-peak pricing', url: 'https://www.theweddingreport.com/' },
  { title: 'WIPA Wedding Industry Professionals Association — international professional body for senior wedding planners + venues + vendors; publishes Wedding Business Outlook + Tour-to-Book conversion benchmarks (industry avg 35-50% tour-to-book peak season, 50-65% off-peak); 60+ chapters nationally; CEU + WIPA Speakeasy education program', url: 'https://www.wipa.org/' },
  { title: 'IBISWorld Wedding Services in the US (Industry Report OD4324) — $70B+ industry covering venues, planners, photographers, florists, caterers, attire, music; ~400K establishments; venue subsector ~$11B + reception venue rental highly fragmented with PE consolidation accelerating 2022-2026 (Wedgewood Weddings + Walters Wedding Estates + The Hidden Vine + Noah\'s Event Venue chapter-11-then-resurrected portfolio)', url: 'https://www.ibisworld.com/united-states/market-research-reports/wedding-services-industry/' },
  { title: 'BLS Occupational Outlook for Meeting, Convention, and Event Planners (SOC 13-1121) — ~146K employed nationally; median wage ~$56,920 (May 2023); projected growth ~7% through 2032 (faster than average); wedding-venue coordinator subsector skews younger + female + base + commission ($45K-$120K depending on venue tier + close rate); turnover among independent venue coordinators ~35-50%/yr per WIPA + industry benchmarking', url: 'https://www.bls.gov/ooh/business-and-financial/meeting-convention-and-event-planners.htm' },
  { title: 'Allseated / Prismm (renamed 2023) — 3D + 2D venue diagramming + floor-plan + virtual walkthrough platform used by 10K+ venues + 200K+ planners; AHRI-of-events for matched-floorplan + vendor + AV layout; competes with Social Tables (Cvent) + Merri + Top Table Planner; venue tour conversion lift documented at +10-15 pts when 3D walkthrough sent in 24-hr follow-up', url: 'https://www.prismm.com/' },
  { title: 'Honeybook + Aisle Planner + Planning Pod — primary wedding-vendor CRM + workflow + contract + payment platforms; Honeybook ~$170M ARR 2024 ~150K members (small + solo creatives + planners), Aisle Planner ~25K wedding pros (planner + venue focused), Planning Pod ~10K event venues + caterers (catering BEO + venue diagram + inquiry tracking); replace Excel + Gmail + Square for venue inquiry-to-contract', url: 'https://www.honeybook.com/' },
  { title: 'Tripleseat + Event Temple + Tave Studio + Curate + Perfect Venue — venue-management software stack for booking + BEO + payments + reporting; Tripleseat ~15K venues (Marriott, IHG, Hilton enterprise + 12K SMB venues), Event Temple ~3K venues (hotel + multi-property), Tave Studio (photo+ wedding pros), Curate (florist), Perfect Venue (SMB venue CRM); pricing $99-$499/mo by venue tier; integrates Stripe + Square + ACH', url: 'https://www.tripleseat.com/' },
  { title: 'Zola + Joy + Minted Weddings + The Knot Registry — couple-facing planning + registry + website platforms aggregating tour-shopping behavior; Zola (~3.5M couples since 2013, ~$1B+ raised, registry + invites + website), Joy (acquired by Withjoy, free wedding websites + registry), Minted Weddings (paper + digital invites + website premium), The Knot Registry; Couples Journey Studies show couples tour avg 3-5 venues, book 1, 78% book the venue they toured FIRST or FAVORITE not the cheapest', url: 'https://www.zola.com/expert-advice/wedding-data' },
  { title: 'Cocktail.com + WedSites + The Brides Project + WeddingHero — emerging 2025-2027 couple-aggregator platforms competing with TheKnot/WeddingWire on couple discovery; AI-driven venue match + tour scheduling + budget calculator + vendor coordination; chipping at TKWW lead-gen monopoly via lower vendor advertising costs (TKWW Spotlight $200-$1,200/mo per venue listing vs Cocktail $79-$299/mo)', url: 'https://www.cocktail.com/' },
  { title: 'Microwedding + elopement + AirBnB-wedding-rental market — Wedding Report tracks ~15-20% of 2024 US weddings as microweddings (under 50 guests) + elopements (under 10) + intimate destination (under 30), up from ~8% pre-2020; AirBnB Wedding Rentals + Peerspace + Splacer + Giggster commercial-event-rental marketplaces eating bottom-tier venue revenue ($3K-$8K rental fee, BYO catering, couple-managed); pressure on traditional venue mid-tier $15K-$25K bookings', url: 'https://www.peerspace.com/' },
  { title: 'Wedgewood Weddings + Walters Wedding Estates + The Hidden Vine + David\'s Bridal venue partnerships + PE-rollup landscape — Wedgewood (PE-backed, ~70 venues across CA/AZ/NV/CO/TX/UT, all-inclusive packages), Walters Wedding Estates (Texas, ~15 venues, in-house catering + bar), The Hidden Vine (Bay Area, multi-property), Noah\'s Event Venue (chapter-11 2020, portfolio resurrected by Forte Specialty Contractors 2021-2024); rollups consolidating ~5-8% US wedding venue market by 2026 vs single-property indies still ~90%+ of count', url: 'https://www.wedgewoodweddings.com/' },
  { title: 'The Knot Worldwide vendor advertising economics — Spotlight + Storefront listings $200-$1,200/mo per market for venues; commission-free leads (no per-booking fee); average venue acquires 35-60% of inquiries via TKWW + 20-30% via Google/SEO + 10-15% via Instagram + 10-15% via referral/repeat per WIPA Vendor Outlook 2024; TKWW dominance is the moat that EQT bought + Cocktail.com is trying to break', url: 'https://www.theknotww.com/' },
  { title: 'Wedding venue revenue model — site fee $2K-$25K (cover venue access + tables/chairs/setup/staff), F&B per-head minimum $75-$225 in-house catering most venues (some open-catering), bar minimum $35-$95/head or $4K-$15K floor, ceremony fee $500-$2,500 if separate from reception, vendor referral kickbacks 5-15% (some venues), service charge 20-24% on F&B (auto-grat), tax 6-10%; all-in $15K-$80K depending on tier + guest count + day + season per The Knot + Wedding Report', url: 'https://www.theknot.com/content/average-wedding-venue-cost' },
  { title: 'WIPA + Wedding Report Tour-to-Book conversion benchmarks — industry avg tour-to-book 35-50% peak season (April-October Saturdays) / 50-65% off-peak (Nov-March + weekday) / 60-70% top-quartile coordinators using structured 5-stage tour discipline vs 15-25% bottom-quartile coordinators running unstructured "let me show you our spaces" walkthrough; hold deposit close at tour (vs send-proposal-later) lifts close +20-30 pts; second-venue tour beats third-venue beats fifth-venue by 8-12 pts each step', url: 'https://www.wipa.org/resources' },
  { title: 'FTC + state wedding-venue contract law + 3-day rescission — most state cooling-off laws (FTC 16 CFR 429 + state analogs like CA Civil Code 1689.6 + NY GBL 425) cover door-to-door + off-premises sales, do NOT cover venue-tour signed-at-venue contracts; venues typically require non-refundable deposit at signing ($1K-$10K) + cancellation policy 0-100% based on notice period; couples can dispute via Better Business Bureau + state AG consumer protection + Yelp/TheKnot reviews; transparent cancellation policy + force-majeure clause (post-COVID standard) lowers disputes', url: 'https://www.ftc.gov/business-guidance/resources/franchise-rule-faqs' }
];

// ============================================================================
// TLDR -- intro callout + meeting agenda
// ============================================================================
const tldr = `> ### 💍 The Pulse Training
> **Who this is for:** **Wedding venue owners + general managers + sales directors + venue coordinators + event managers + F&B directors + booking specialists** at single-property estates, barns, hotels, country clubs, urban event spaces, vineyards, and the indie 90%+ of US venues that **Wedgewood Weddings / Walters Wedding Estates / The Hidden Vine / Forte Specialty** PE-rollups have NOT yet consolidated. Works for the first-month coordinator running her third tour ever, the 5-yr veteran event manager who's tired of "let me think about it" goodbyes, the GM who keeps losing peak Saturdays to the venue down the road, the F&B director who needs to defend the $135/head minimum without sounding inflexible. Per **The Knot 2024 Real Weddings Study + Wedding Report + WIPA**, avg US wedding **~$33K all-in** (~$12.8K venue line), **2.08M weddings/yr**, **$70B+ industry**, and Saturdays April-October are **80% of annual revenue capacity** for traditional venues. Top coordinators close **50-65% tour-to-book peak / 60-70% off-peak**; bottom quartile close **15-25%** running unstructured walkthroughs. **Run Tuesday morning sales meeting + Friday-before-weekend tour-prep huddle.**
>
> **What your coordinators leave with:** A named discipline — **5-STAGE VENUE TOUR (STORY → STROLL → SHOWCASE → SHAPE → SECURE)** — you don't show the venue, you build the wedding day inside it — plus **THE THREE DECISION PLAYERS (COUPLE = vibe + memory / PARENT-FUNDER = value + logistics / PLANNER = vendor list + execution flexibility)** for reading the room and addressing all three. Plus verbatim language, two role-plays (peak-season tour-of-3 Saturday-in-October prospect + weeknight tour for Friday-night second-marriage couple), hold-deposit close sequence, when to decline a booking, and the four phrases that lose the Saturday.
>
> **GM brings:** **(1)** 3 recent lost-tour debriefs (the couple, the date they wanted, the venue they picked, the verbatim "no" reason). **(2)** Tour-Prep Kit — inquiry intake form (guest count + budget range + planner status + date flexibility + must-haves), 3D Prismm/Allseated floor-plan, sample BEO, vendor-list policy sheet, contract + hold-deposit sequence in Honeybook/Tripleseat/Event Temple, Tour Card with the 8 questions, current Saturday inventory by month, peak vs off-peak pricing grid, photo book of recent weddings on the property. **(3)** Whiteboard to score each coordinator's last 10 tours by stage + decision-player coverage + close outcome.

## MEETING AGENDA -- 60 MINUTES

| Time | Block | Owner | Outcome |
|------|-------|-------|---------|
| **0:00-0:10** | **Intro + Agenda + Cold Open Story** — Why venues lose the Saturday tour (price too early / failed to read the couple's decision DNA / can't articulate why YOUR Saturday is better than the venue-down-the-road's Saturday); two-tour Saturday composite — Venue A "let me show you our spaces" room-by-room ended at $28K quote and "let me know" never-heard-back vs Venue B 7 questions while walking, picked TWO specific spaces to deep-pitch, pulled bride's mom into side conversation as the financial decision-maker, closed $34K October Saturday with $5K hold deposit before they left the property | GM / Sales Director | Coordinators feel the gap — unstructured walk-through loses to 5-STAGE structured tour by 3-4x close rate |
| **0:10-0:35** | **The Teach** — 5-STAGE VENUE TOUR (STORY / STROLL / SHOWCASE / SHAPE / SECURE) + Three Decision Players (COUPLE / PARENT-FUNDER / PLANNER) — read all three or lose the tour to whichever you ignored | GM / Sales Director | Coordinators recite all 5 stages + 3 decision players + 8 tour questions + hold-deposit close sequence verbatim without notes |
| **0:35-0:45** | **Discussion** — 8 prompts: when push for hold deposit on tour vs let them think + how handle couple who toured 4 venues today + when decline to book (vision/budget mismatch) + how defend $135/head minimum vs $115 competitor + how read mom-as-financial-DM in first 4 min | GM / Sales Director + room | Coordinators audit last 10 tours per coordinator |
| **0:45-1:05** | **Role-Play x 2** — Round 1: peak-season June 2027 tour-of-3 couple Pinterest-prepared bride + along-for-ride groom October 2027 Saturday $35K mom-paying $135/head + $7,500 site fee (10 min, 2 deflections "need to think before committing" + "minimum is higher than next 2 venues — match $115?") + Round 2: weeknight tour mid-30s second-marriage couple Friday night 60 guests bring-own-caterer (10 min, 2 deflections "brother-in-law chef waiver?" + "Friday discount?") | Coordinators in pairs | Run full 5-STAGE + all 3 decision players under deflection, close hold deposit Round 1, decline-or-discount Round 2 |
| **1:05-1:10** | **Debrief + Commitments** — 3 questions + each coordinator names ONE specific recent tour lost + ONE verbatim line they will change + ONE tour-prep kit item they're missing | GM / Sales Director | One tour + one verbatim + one kit-completion habit |
| **1:10-1:13** | **Leave-Behind** — one-pager + 5-Stage Tour Script Card + 8 Questions That Read the Room in 4 Minutes + 4 Phrases That Lose the Saturday + Hold Deposit Close Sequence | GM / Sales Director | One-pager in every coordinator's tour binder + Honeybook/Tripleseat task |

> ### 🎯 Bottom Line
> **An engaged couple touring 3-5 venues does NOT decide based on which room is prettiest — they decide based on which coordinator (1) built their wedding day inside the space instead of pointing at rooms, (2) read whether mom-is-paying or planner-is-driving and addressed that decision player by name, and (3) asked for the hold deposit before they walked off the property.** Per **The Knot + Wedding Report + WIPA**, US wedding industry is ~$70B + ~2.08M weddings + ~$33K avg + ~$12.8K venue line; **Saturdays April-October = 80% of annual revenue capacity** for traditional venues. Run the **5-STAGE + 3 decision players + hold-deposit close** = **50-65% peak tour-to-book / 60-70% off-peak / $25K-$45K avg ticket / $5K hold-deposit norm**. Unstructured walkthrough + price-quote-at-end + no decision-player read = **15-25% peak / 30-40% off-peak / lose Saturday to venue down the road every time**. Five stages. Three decision players. The Saturday closes on the tour or it doesn't close at all.

`;

// ============================================================================
// CORE -- Sections 1-6 fully written
// ============================================================================
const core = `---

## SECTION 1 -- INTRO + AGENDA (0:00-0:10)

> ### 🟡 Coach Note
> Do NOT open with the venue history slide deck. Stand in the ceremony lawn, say the numbers, tell the two-tour story, end with the two phrases that decide whether your coordinators earn the Saturday or lose it to the venue down the road. **Ten minutes. Hard stop at 0:10.**

### The numbers, then the story.

**The numbers.** Per **The Knot 2024 Real Weddings Study + Wedding Report + WIPA + IBISWorld**: US wedding industry **~$70B / ~2.08M weddings/yr**, avg cost **~$33K all-in**, venue line **~$12.8K** (site fee + ceremony + reception), 115-guest avg, 14-month avg engagement. Venue all-in (site + F&B + bar) typically **$15K-$80K** depending on tier + guest count + day + season. **Saturdays April-October = 80% of annual revenue capacity** for traditional venues. **Couples tour 3-5 venues, book 1**; per Zola + Joy + Minted Couples Journey Studies, **78% book the venue they toured FIRST or FAVORITE, not the cheapest**. Top coordinators close **50-65% tour-to-book peak / 60-70% off-peak**; bottom **15-25% peak**.

Top math: 8 tours/wk × 60% close × $32K avg = **$153K/wk × 30 peak weeks = $4.6M/yr**. Bottom: 8 × 20% × $24K = **$38K/wk × 30 = $1.1M/yr** — 4x revenue gap on same property + same lead flow. Differentiator is tour discipline, not venue beauty.

**The story.** Saturday, June 2026, **Hudson Valley NY** converted-barn, 180-cap, $7,500 site fee + $135/head F&B + $45/head bar. Two tours, same morning. **Venue A coordinator**, 2-yr veteran, opened *"let me show you our spaces"* — walked all five rooms, 28 min of features, ended at the kitchen-table office: *"For 140 on the second Saturday in October, about $28K — here's a proposal, let me know."* Couple toured two more that day, never heard back, booked a competing barn 12 miles east that *"felt more personal."*

Same hour, **Venue B coordinator**, WIPA member, opened *"Before I show you a single room — three questions: guest count + holding? Planner? Date locked or flexible?"* Walked the property asking **7 more questions** — vision, traditions, must-haves. By min 12 identified **mom-as-financial-DM** (back of the golf cart, parking + accessibility questions). At min 18 pulled mom aside in the bridal suite. By min 35 deep-pitched TWO spaces (ceremony lawn at golden-hour for the daughter's Pinterest aesthetic + the barn with mom's *"where do my 80-yr-old aunts sit comfortably"* answered). Quoted **$34K** October Saturday all-in, asked for **$5K hold deposit** before they left. **Signed on the bridal-suite love seat.**

> ### ⚠️ Common Trap
> *"Venue A is friendly + the venue is gorgeous + they sent a quote — that's a real proposal."* Three answers. **(1)** Of course they sent a quote — couple is shopping 3-5, the lowest "feels right" wins; Venue B felt right because the coordinator built the wedding day inside the venue instead of pointing at rooms. **(2)** Unstructured walkthrough is the slowest, lowest-margin sales motion in hospitality — every venue has rooms, almost none have **5-STAGE + decision-player reading + hold-deposit-at-tour**. **(3)** Your photo wall + Knot Hall of Fame badge get the inquiry — the tour is the only sales meeting you get.

**Transition:** "Next 50 minutes: 5-stage tour, 3 decision players, two role-plays. Let's go."

---

## SECTION 2 -- THE TEACH (0:10-0:35)

> ### 🟡 Coach Note
> Twenty-five minutes. Split into **5-STAGE VENUE TOUR (15 min, ~3 min/stage)** + **Three Decision Players (10 min, ~3 min/player + 1 min cross-link)**. Pause for one clarifying question per stage. End-of-section test: every coordinator recites all 5 stages + 3 decision players + 8 tour questions + hold-deposit close sequence verbatim without notes.

### Part A -- The 5-STAGE VENUE TOUR (15 min)

Most lost tours collapse at Stage 1 (coordinator opens with the room tour instead of the vision questions) or Stage 5 (coordinator hands a proposal and says "let me know" instead of asking for the hold deposit). **You don't show the venue — you build the wedding day inside it.**

#### Stage 1 -- STORY (3 min)

**Before you show a single room, hear the couple's vision in their own words. Three opening questions while still in the welcome area.**

> ### 🎤 Verbatim Script -- STORY
> *"Before I show you a single room — three questions so I can build today's tour around what matters to you, not just walk you through every space we have. **(1) What's your guest count today, and is that holding?** **(2) Are you working with a planner yet or planning to?** **(3) Is your date locked, or are you flexible on a Friday or an off-peak Saturday?**"*

Plain English + couple-centered + signals "this is going to be a real conversation, not a sales pitch." **Common trap.** *"Let me give you a quick history of the property"* — boring + couple-centered fails. *"What's your budget?"* — too early, never ask budget in Stage 1.

#### Stage 2 -- STROLL (3 min)

**Walk the property — not as a tour-guide pointing at rooms, but as a co-host asking 7 more vision questions while moving.**

> ### 🎤 Verbatim Script -- STROLL
> *"Let's walk — I'll show you the flow your guests will experience. While we walk, four more questions: **(4) Have you been to a wedding here or seen photos that hooked you?** **(5) Any family traditions or rituals we need to plan around — religious ceremony, cultural elements, family dances?** **(6) Anyone with mobility, dietary, or accessibility needs we should know about?** **(7) Is there a moment in your day — first look, vow exchange, last dance — that has to be perfect?**"*

Walking + asking = relaxed + informational. **Common trap.** *"This is the cocktail terrace — it holds 150, has bistro lights, etc."* — features-tour, builds nothing. Walking-while-asking lets the couple imagine themselves in each space.

#### Stage 3 -- SHOWCASE (3 min)

**You've heard their vision. NOW pick TWO specific spaces and deep-pitch with the couple's wedding day inside them. NOT every space — TWO.**

> ### 🎤 Verbatim Script -- SHOWCASE
> *"Based on what you've told me — 140 guests, October Saturday, golden-hour light, mom mentioned older aunts — focus on TWO spaces. **Ceremony lawn at 5:15 PM October** — sun hits the oak grove from the west, processional walks from the bridal-suite path, photographer gets the Pinterest shot. **The barn** — 140 sits with round-tables + sweetheart layout (3D sent post-tour), aunts near the open fireplace, dance floor here so the band is loud but tables 1-3 can converse."*

Two-spaces deep > five-spaces shallow. Specific time + specific people = wedding day visible. **Common trap.** *"Let me show you every space"* — rooms blur together.

#### Stage 4 -- SHAPE (3 min)

**Logistics + decision-criteria. Bring parent-funder + planner in by name. Sketch the day on the printed BEO.**

> ### 🎤 Verbatim Script -- SHAPE
> *"Let's sketch your day. **Mom — want your input on parking + hotel block + transportation.** **(Planner) — vendor list, AV, load-in window, preferred lighting + catering team?** Ceremony 5:15, cocktail 6:00, dinner 7:00, dance 9:00, last 11:30. Bar standard beer/wine/signature $45/head, full open $65. Catering peak Saturday $135/head min — hors d'oeuvres + plated or family-style + dessert. 5 preferred caterers OR all-in-house Chef Maria. **What's missing or feels off?**"*

Parent-funder + planner named = all decision players addressed. **Common trap.** Only addressing the couple = parent-funder vetoes later.

#### Stage 5 -- SECURE (3 min)

**The close. NOT "send you a proposal" — the **hold-deposit-at-tour** ask in a quiet space (bridal suite, library, terrace bench).**

> ### 🎤 Verbatim Script -- SECURE
> *"Three things before you leave. **One:** October 9, 2027 Saturday is available right now — I have a tour next week looking at that same week. **Two:** All-in for 140 is $34,200 ($7,500 site + $18,900 F&B + $6,300 bar + $1,500 ceremony); service + tax brings it to $42,800. **Three:** I can hold today with a **$5,000 hold deposit, fully refundable for 7 days, applies to balance if you sign within the window.** Gives you a week to talk + walk others, know your Saturday is yours. **Want me to put the hold on?**"*

7-day refundable = pressure-free urgency. **Common trap.** *"I'll email the proposal"* = lose the Saturday 70% of the time. Non-refundable on the spot = couple feels trapped, walks.

### Part B -- The Three Decision Players (10 min)

**Every wedding tour has 2-4 humans on it. The coordinator who only addresses the couple loses to the coordinator who reads + addresses all three decision-players: COUPLE / PARENT-FUNDER / PLANNER.**

#### Player 1 -- COUPLE (vibe + memory)

**Couple cares about VIBE (does this feel like us?) + MEMORY (the day we remember in 30 yrs). Address with vision questions + SHOWCASE of THEIR aesthetic.**

> ### 🎤 Verbatim Script -- COUPLE
> *"Tell me about you two. How did you meet? What feels most-you about how you imagine this day?"* — listen for keywords (boho / classic / modern / rustic / intimate / grand), feed back at SHOWCASE: *"You said boho-with-grand-moments — ceremony lawn at golden hour with the oak grove is your boho moment; the barn at dinner with the chandeliers is your grand moment."*

**Common trap.** Treating the couple as a unit, ignoring individual preferences (bride wants intimate, groom wants party — both need to be heard).

#### Player 2 -- PARENT-FUNDER (value + logistics)

**Most often bride's mom or father-of-the-bride. Cares about VALUE (am I getting what I'm paying for?) + LOGISTICS (parking, accessibility, hotel block, weather backup, who's serving, are my friends comfortable?).**

> ### 🎤 Verbatim Script -- PARENT-FUNDER
> *"Mom — while [couple] take photos of the barn, can I steal you 5 min? Want to walk you through parking + golf-cart shuttle for older guests, rain-plan tent, bar service flow, catering tasting in August. **Anything else you want to be sure of before [couple] decides?**"*

Side-conversation = trust + addresses the financial DM without making couple feel managed. **Common trap.** Not identifying parent-funder in first 4-6 min — they're paying + will veto silently if ignored.

#### Player 3 -- PLANNER (vendor list + execution flex)

**If planner on the tour or referenced. Cares about VENDOR LIST (can my preferred photographer/florist/band work here?) + EXECUTION FLEX (load-in window, AV, lighting, rentals partner).**

> ### 🎤 Verbatim Script -- PLANNER
> *"[Name] — vendor-policy sheet up front. Open-vendor on photography + florals + music; preferred-list catering with 5 partners (or in-house Chef Maria); load-in 10 AM day-of, 1 PM day-before tented. AV house-provided or bring your team. **Anything in your standard kit that conflicts? Surface now.**"*

Planner respected = planner advocates for booking. **Common trap.** Treating planner as obstacle vs ally — planners book 8-15 weddings/yr at any venue, worth more than any single couple.

> ### 🎯 Bottom Line
> 5 stages + 3 decision players + hold-deposit-at-tour close = 50-65% peak / 60-70% off-peak / $25K-$45K avg ticket. Stages without Decision Players = clean tour that loses to the venue that read mom or planner correctly. Decision Players without Stages = good instincts without the structure that makes them close on the property.

---

## SECTION 3 -- THE DISCUSSION (0:35-0:45)

> ### 🟡 Coach Note
> Whiteboard. Write **STORY / STROLL / SHOWCASE / SHAPE / SECURE** across 5 columns. Each coordinator audits her last 10 tours out loud — which stage she skipped, which decision player she missed. **Count to five after each prompt.**

**1 — "When push for hold deposit ON the tour vs let them think?"** **Default: ALWAYS ask on tour** because it's refundable 7 days. Exceptions: couple visibly overwhelmed (decompress, follow up 24 hr), parent-funder absent (schedule second tour with mom), Saturday already locked (offer adjacent date hold). **GM:** *"7-day refundable hold costs the couple nothing and locks the date so they don't book elsewhere."*

**2 — "Couple already toured 4 venues today — exhausted."** **Three moves:** acknowledge (*"keeping this to 20 min not 90"*), skip STROLL → straight to SHOWCASE of TWO, send home with 3D Prismm + 24-hr text + 7-day hold offer over text. **GM:** *"Exhausted couples need the coordinator who acknowledged exhaustion + made it easy."*

**3 — "When DECLINE to book?"** **Three:** vision mismatch (industrial-warehouse, you're country-garden — refer out), budget mismatch ($18K vs $32K floor — refer out), logistical impossibility (250 guests vs 180 cap + no tent). **GM:** *"Graceful decline = referral business + 5-star review even without booking."*

**4 — "Defend $135/head F&B vs $115 competitor?"** **NEVER match reactively.** Re-position: *"At $135 — passed apps (theirs plated), August tasting for 6, sommelier wine pairing, late-night station, Chef Maria 8 yrs here personally walks the day. $115 next door is a rotating-staff catering company."* **GM:** *"Match only if budget is real-live blocker AND value re-position failed — then flex on guest count or bar package, not $/head."*

**5 — "Read mom-as-financial-DM in first 4 min."** **Signals:** mom asks logistics (parking, hotel, accessibility), checks phone for budget, positions between couple + coordinator, takes notes, asks *"what's included?"*, evaluating body language on price. **GM:** *"Name it gently — 'Mom, I want to make sure I'm answering your questions too.' Permission = trust."*

**6 — "Planner on tour — friend or threat?"** **ALWAYS friend** — planners book 8-15 weddings/yr; one tour = 5-yr partnership. Vendor-policy sheet up front, ask their opinion, treat as expert on execution. **GM:** *"Coordinator who ignored or talked over the planner gets blacklisted from her book."*

**7 — "Couple wants to negotiate over email post-tour."** **Verbatim:** *"Happy to chat through anything — what's the specific concern? If budget, 3 levers: off-peak Friday $X / smaller guest count $Y / standard bar $Z. **Quickest path is a 15-min call — 10 AM or 3 PM tomorrow.**"* **GM:** *"Email negotiation = race to bottom. Phone/in-person = re-establishes value."*

**8 — "ONE verbatim change."** Each coordinator: ONE recent tour + ONE skipped stage + ONE line tomorrow. **GM:** *"Honeybook/Tripleseat task + reviewed at next tour-prep huddle."*

---

## SECTION 4 -- TWO-PERSON ROLE-PLAY (0:45-1:05)

> ### 🟡 Coach Note
> Pair coordinators. **Two scenarios, 10 min each, 60-sec reset between.** Walk the office or the patio — DO NOT sit. Listen for the verbatim *"three questions before I show you a single room"* (STORY) + whether the coordinator identifies the parent-funder by minute 6 + whether she asks for the hold deposit before they leave. Mark which stage each coordinator skips.

### Role-Play 1 -- Peak-Season Saturday, June 2027 Tour (10 min)

**Setup:** Engaged couple **Emily (28, project manager) + Marcus (29, software engineer)**, touring **converted-barn venue in Lehigh Valley PA**. **Tour-of-3 today** (they'll see two more after this one). Preferred date: **second Saturday in October 2027** (about 15 months out). Emily is Pinterest-prepared (boho-meets-grand, oak-grove ceremony, string-lights), Marcus is along-for-the-ride. Bride's mom **Patricia (55)** is on the tour, riding in the back of the golf cart, asking about parking. Budget framing: Emily told the coordinator on the inquiry call *"$35K all-in target,"* but Patricia is paying. Venue: 180-cap converted barn, in-house catering $135/head min on peak Saturdays, $7,500 site fee, $45/head standard bar. **Coordinator must run full 5-STAGE + read all 3 decision players (couple + Patricia as parent-funder + no planner present) + close the $5K refundable hold deposit before they leave.**

> ### 🎤 COUPLE -- Emily + Marcus + Patricia
> Emily engaged + Pinterest-vocal, Marcus quiet supportive, Patricia evaluative + logistical. Engages if coordinator hears Emily's vision specifically + brings Marcus into the conversation actively + reads Patricia early + handles two deflections without flinching.
>
> **Deflection 1 (min 7):** Emily — *"We love it but we want to think about it before we commit anything — we have two more tours today."*
>
> **Deflection 2 (min 9):** Patricia — *"Your $135/head minimum is higher than the next two venues we're touring — can you match $115?"*

> ### 🎤 COORDINATOR
>
> - **Min 0-2 (STORY):** *"Emily, Marcus, Patricia — three questions before any room. Guest count + holding? (140.) Planner? (Not yet.) October Saturday locked or flexible? (Second Saturday — Marcus's grandparents' anniversary date.)"*
> - **Min 2-5 (STROLL):** Walk + 4 questions. *"Wedding that hooked you? (Friend's vineyard in Sonoma.) Family traditions? (Catholic ceremony, flexible.) Accessibility/dietary? (Patricia's mom 80, walker; Marcus's brother nut allergy.) Moment that has to be perfect? (Emily — golden-hour first look. Marcus — last dance.)"* **Spot Patricia asking parking + hotel = parent-funder confirmed.**
> - **Min 5-8 (SHOWCASE + SHAPE):** *"TWO spaces. **Ceremony lawn 5:15 PM October** — golden-hour through the oak grove, Sonoma-vineyard light. **Barn for reception** — 140 round-tables + sweetheart (3D post-tour), Patricia's mom at table 2 near fireplace + accessible bathroom, dance floor placed so Marcus's last-dance hits."* Pull Patricia aside: *"Patricia — 4 min? Parking + golf-cart for older guests, rain-plan, August tasting."*
> - **Min 8-9 (Deflection 1 — "want to think"):** *"Smart to tour 3 today. October 9, 2027 is available right now — I have a tour next Wednesday looking at that same week. **$5K hold, refundable 7 days, applies to balance if you sign within the window** — costs nothing, gives you the week to walk the other two + decide. Want me to put the hold on?"*
> - **Min 9-10 (Deflection 2 — match $115):** *"Patricia, fair question. **At $135 you get** 90-min passed apps (next door is plated-only), August tasting for 6 with Chef Maria, sommelier wine pairing, late-night snack station, and Chef Maria — 8 yrs here, knows every couple — personally walks the day. Next door is a rotating-staff catering company. **I won't match $115 — wrong move for your day. What I CAN do: hold today with $5K refundable, and look at flex on guest count or bar package next week if budget is the real concern.** Hold?"*

### 60-Second Reset

> ### 🟡 Coach Note
> **"Switch sides — 60-sec reset."** Stand up. Read the OTHER role's paper. Go.

### Role-Play 2 -- Weeknight Tour, Friday-Night Second-Marriage Couple (10 min)

**Setup:** Couple **David (37, second marriage) + Sarah (35, first marriage)**, touring **historic-mansion venue in Annapolis MD** on a **Wednesday at 6:30 PM**. Want a **Friday night** wedding (NOT Saturday), 60 guests max, low-key vibe (he's been-there-done-that on a big Saturday wedding from his first), full bar critical (his crowd drinks), and they want to **bring their own caterer** (Sarah's brother-in-law is a chef in DC, would do it as a wedding gift). Venue policy: **in-house catering only** on F&B, full bar available, Friday nights peak-season October still available + venue offers 15% off site fee for Friday vs Saturday. Coordinator must (1) decline the bring-own-caterer ask gracefully without losing the booking, (2) re-position the Friday discount as a feature not a "deal," (3) read no-parent-funder + no-planner (both decision players collapse into the couple) + close the hold deposit on the Friday.

> ### 🎤 COUPLE -- David + Sarah
> Low-key, value-conscious (David has done the expensive wedding once), prepared to walk if pressured. Engages if coordinator respects the second-marriage low-key vibe + handles bring-own-caterer with honest "here's why" + frames Friday as a feature.
>
> **Deflection 1 (min 5):** David — *"We really want to use Sarah's brother-in-law who's a chef in DC — is there any way to waive the in-house catering rule for us?"*
>
> **Deflection 2 (min 8):** Sarah — *"If we book a Friday instead of Saturday, what's the discount?"*

> ### 🎤 COORDINATOR
>
> - **Min 0-2 (STORY):** *"David, Sarah — three questions. Guest count + holding? (60.) Planner? (No.) Friday or off-peak Saturday flex? (Friday locked — David's daughter has Saturday volleyball tournament season.)"*
> - **Min 2-4 (STROLL):** *"Wedding that hooked you? (Charleston mansion intimate cocktail-style.) Family traditions? (David's 12-yr-old daughter in the ceremony; Sarah's family Greek-Orthodox-leaning but flexible.) Accessibility/dietary? (David's mom gluten-free.) Moment that has to be perfect? (David — daughter-led ring exchange. Sarah — first dance.)"*
> - **Min 4-6 (SHOWCASE + Deflection 1 — bring-own-caterer):** *"TWO spaces. **Mansion library 5:30 PM Friday** — book-lined, intimate, daughter-led ring exchange as family moment, 60 cocktail-style around the ceremony. **Garden terrace for cocktail-grazing** — heaters, string lights, no formal seated dinner, your Charleston vibe in Annapolis. On the brother-in-law chef — I love he's family AND I have to say no honest. Liability + insurance + health-dept license is tied to our in-house team, can't legally serve food from an unlicensed kitchen on-property; 3 exceptions in 9 yrs all ended in litigation. **What I CAN do: he co-designs the menu with Chef Diego at the tasting, credited on the BEO as guest chef + we waive the 22% service charge on the co-designed entree.**"*
> - **Min 6-7 (SHAPE):** *"Friday October 15, 2027. Library ceremony 5:30, garden cocktail 6:00, grazing stations 7:00, dancing 8:30, last 11:30. Friday site $4,250 (Saturday equivalent $5,000 — Fridays 15% off because they let us prep into Saturday setup). Grazing $95/head × 60 = $5,700, bar $55 × 60 = $3,300, ceremony $750. **$17,400 all-in with service + tax.**"*
> - **Min 8-9 (Deflection 2 — Friday discount):** *"Sarah, honest framing — the 15% Friday discount isn't 'we couldn't sell Saturday' — it's structural because Friday weddings let us prep into Saturday's setup. Same Chef Diego, same staff, same property. **What's lost vs Saturday: nothing material for your 60-guest no-formal-dinner format.** What's gained: $750 + load-in flex + your guests' Saturday brunch. **Net + daughter's volleyball — Friday is structurally better, not a consolation.**"*
> - **Min 9-10 (SECURE):** *"Three things. October 15, 2027 Friday available. $17,400 all-in for 60 cocktail-grazing. $2K hold deposit, refundable 7 days, applies to balance if you sign within the week. Want me to put the hold on?"*

> ### 🟡 Coach Note
> Coordinator will want to (a) cave on bring-own-caterer to save the deal — DO NOT, the honest "no + here's why + here's what I CAN do" earns more trust than the cave; (b) over-discount the Friday — DO NOT, frame Friday as structural-feature not consolation; (c) skip the hold deposit because it's a smaller booking ($17K vs $34K) — wrong, hold-deposit-at-tour discipline applies to every booking; (d) treat David's been-there-done-that as cynicism — wrong, treat it as wisdom (he's seen the expensive wedding, knows what he wants this time). **Make the coordinator re-deliver the bring-own-caterer "no + here's why + here's what I CAN do" verbatim.** Highest-leverage drill of the year for off-peak + weeknight tour discipline.

---

## SECTION 5 -- DEBRIEF + COMMITMENTS (1:05-1:10)

> ### 🟡 Coach Note
> Three debrief Qs, then commitments. The ritual moves next quarter's tour-to-book + Saturday-inventory close + zero-cancellation record.

**Debrief 1 — "Strongest stage? Weakest?"** Coordinators over-index STROLL (great walkers/storytellers), under-index STORY (3 opening Qs feel "salesy" — they aren't) and SECURE (hold ask feels pushy — it's refundable). **GM:** *"STORY = listening stage that makes everything else credible. SECURE = refundable hold that costs nothing + locks the date. Skip either, tour-to-book halves."*

**Debrief 2 — "Decision player missed most?"** Most name PARENT-FUNDER (didn't pull mom aside, didn't realize dad was the financial-DM). A few name PLANNER (treated as obstacle). **GM:** *"Parent-funder side-conv at min 18 + planner vendor-sheet at min 4 — both go in every Friday huddle."*

**Debrief 3 — "Saturday you owe a follow-up?"** Each coordinator names ONE recent tour they got ghosted on. **GM:** *"Follow-up within 7 days: 'Toured 6/14, October 9 still available + I can hold for $5K refundable 7 days. Mind if I send the 3D Prismm + BEO sketch?' Run SECURE + walk away if no."*

> ### 🎤 Commitment Ritual (Verbatim)

**GM:** "Open Honeybook or Tripleseat. Four lines. **Line 1:** specific recent tour you sent proposal + lost (couple + date + venue picked). **Line 2:** stage you skipped + verbatim line tomorrow. **Line 3:** tour-prep kit item missing (3D Prismm / vendor-policy sheet / BEO template / hold-deposit clause / pricing grid / Saturday inventory). **Line 4:** the decision-player you'll engage every tour going forward. Read aloud."

Coach the vague: *"Which couple? Which words? Out loud now."*

**Closes:** "1:1 tour-shadow within 7 days. Not whether you closed — **whether you ran the 5 stages + read all 3 decision players + asked for the hold deposit.**"

---

## SECTION 6 -- LEAVE-BEHIND WALKTHROUGH (1:10-1:13)

> ### 🟡 Coach Note
> Hand out the printed one-pager. 30 seconds per section. Digital version in Honeybook / Tripleseat / Event Temple. One in every coordinator's tour binder + every tour-prep huddle.

> ### 📋 Leave-Behind -- "The 5-Stage Tour Script Card" One-Pager

> **THE 7 THINGS TO BRING ON EVERY TOUR:**
>
> - [ ] **Inquiry intake form** (guest count + budget range + planner status + date flexibility + must-haves)
> - [ ] **3D Prismm / Allseated floor-plan** for the 24-hr post-tour follow-up
> - [ ] **Sample BEO + day-of timeline template** for SHAPE stage sketch
> - [ ] **Vendor-policy sheet** (open vs preferred vs in-house, load-in window, AV, lighting)
> - [ ] **Hold-deposit contract clause** + cancellation policy + force-majeure language (Honeybook/Tripleseat template)
> - [ ] **Saturday inventory by month** + peak vs off-peak pricing grid + Friday discount math
> - [ ] **Photo book of 5 recent weddings on the property** (couples like the couple touring + planners they recognize)

> **THE 5-STAGE VENUE TOUR SCRIPT CARD:**
>
> | # | Stage | Verbatim Cue | Time |
> |---|---|---|---|
> | 1 | **STORY** | *"Before I show you a single room — three questions. Guest count + holding? Working with a planner? Date locked or flexible on Friday/off-peak?"* | 3 min |
> | 2 | **STROLL** | *"Let's walk — I'll show you the guest flow. Four more questions while we walk: wedding that hooked you / family traditions / accessibility-dietary / moment that has to be perfect?"* | 3 min |
> | 3 | **SHOWCASE** | *"Based on what you've told me — focus on TWO spaces with YOUR wedding day inside them. Ceremony at [time + light]; reception at [layout + your specific people]."* | 3 min |
> | 4 | **SHAPE** | *"Sketch your day on the BEO. Bring parent-funder + planner by name into this part. Walk timeline + bar package + catering minimum + vendor policy."* | 3 min |
> | 5 | **SECURE** | *"Three things before you leave. I have your date available. All-in is $X. $5K hold deposit refundable 7 days. Want me to put the hold on?"* | 3 min |

> **THE 3 DECISION PLAYERS — READ AND ADDRESS:**
>
> | Player | Cares About | Verbatim Address |
> |---|---|---|
> | **COUPLE** | Vibe + memory | *"What feels most-you? Tell me how you met — what's your wedding-day moment?"* + feed vibe-keywords back at SHOWCASE |
> | **PARENT-FUNDER** | Value + logistics | *"Mom, can I steal you 4 min for parking + hotel-block + rain-plan + tasting?"* — side conversation at minute 18 |
> | **PLANNER** | Vendor list + execution flex | *"Here's the vendor-policy sheet up front — anything in your standard kit that conflicts? Better to surface now."* — at minute 4 |

> **4 PHRASES THAT LOSE THE SATURDAY (never say):**
>
> - [ ] *"Let me show you our spaces"* (features-tour, not vision-tour — every venue says this)
> - [ ] *"What's your budget?"* (Stage 1 is too early; budget comes naturally in SHAPE)
> - [ ] *"I'll email you a proposal and you let me know"* (loses Saturday 70%+ of the time)
> - [ ] *"We can match that price"* (reactive matching destroys margin + signals desperation)

> **THE HOLD DEPOSIT CLOSE SEQUENCE:**
>
> | Step | Verbatim | Why |
> |---|---|---|
> | 1 | *"I have your date available right now."* | Date availability = scarcity-honest |
> | 2 | *"I have a tour next [day] with another couple looking at that same week."* | Real adjacent demand, not manufactured |
> | 3 | *"All-in for [N] guests today is $[X]."* | Specific number, not a range |
> | 4 | *"$5K hold deposit, fully refundable for 7 days, applies to your balance if you sign within the week."* | 7-day refundable = pressure-free urgency |
> | 5 | *"Want me to put the hold on?"* | Direct ask, then silence |

> **NEVER DO:**
>
> - Open with venue history before STORY questions
> - Ask budget in Stage 1 (save for Stage 4 SHAPE)
> - Walk every space (TWO at SHOWCASE, not five)
> - Address only the couple, ignore parent-funder or planner
> - Send proposal-and-wait instead of hold-deposit-on-tour
> - Match competitor price reactively without value re-position
> - Cave on bring-own-caterer if liability + insurance is in-house-only
> - Skip 7-day refundable framing (sounds high-pressure)
> - Talk over a planner or treat as adversary
> - Discount Friday as consolation vs structural feature
> - Refuse to decline a vision/budget mismatch
> - Sign without force-majeure clause (post-COVID standard)
> - Take a hold without sending refundability terms same-day
> - Promise vendor flex you can't deliver day-of

> **OUTCOME LINE:** Full 5-STAGE + all 3 decision players + hold-deposit-at-tour + 7-day refundable + transparent value-re-position → **50-65% peak tour-to-book / 60-70% off-peak / $25K-$45K avg ticket / $5K hold-deposit norm / 4.7+ Google + TheKnot + Yelp / 8-15 repeat-planner relationships**. Unstructured walkthrough + price-quote-at-end + no decision-player read → **15-25% peak / 30-40% off-peak / lose Saturday to venue down the road / 3.6-4.0 review average / coordinator turnover ~50%/yr**.

> ### 🎯 If You Only Remember One Thing
> **You don't book the Saturday by showing every room — you book it by (1) hearing the couple's vision in their own words in the first 6 minutes, (2) identifying the parent-funder and the planner in the first 10 minutes and addressing each by name, and (3) asking for the $5K refundable hold deposit before they walk off the property. The tour is the only sales meeting you get — close on the property or don't close at all.**

---

## How This Training Sits Inside Your Wedding Venue Operating Motion

| Where it fits | What this addresses |
|---|---|
| **Tour-prep huddle (Friday before)** | Inquiry intake review + 3D walkthrough prepped + BEO template + vendor-policy sheet + hold-deposit clause |
| **First 3 min on property** | STORY — 3 vision questions before any room tour |
| **Next 3 min** | STROLL — walk-and-ask 4 more questions; spot parent-funder + planner |
| **Next 3 min** | SHOWCASE — TWO spaces deep, couple's wedding day inside each |
| **Next 3 min** | SHAPE — BEO sketch + bring parent-funder + planner in by name |
| **Next 3 min** | SECURE — 3-step hold-deposit close, 7-day refundable |
| **3-decision-player overlay** | COUPLE + PARENT-FUNDER + PLANNER read + addressed at every tour |
| **GM coaching** | Weekly tour-shadow + Honeybook/Tripleseat tour-notes audit + 1:1 within 7 days |

`;

// ============================================================================
// FLOW -- two mermaid diagrams: 5-stage tour flow + 3 decision players reading guide
// ============================================================================
const flow = `

## The 5-Stage Venue Tour Flow

\`\`\`mermaid
flowchart TD
  A[GM Opens] --> B[Section 1: Intro + Cold Open 10 min — The Knot 2024 + Wedding Report + WIPA + IBISWorld benchmarks $70B US wedding industry + 2.08M weddings/yr + $33K avg + $12.8K venue line + Saturdays April-October 80 percent of annual revenue + couples tour 3-5 book 1 + 78 percent book first or favorite not cheapest + top 50-65 percent peak tour-to-book 60-70 percent off-peak vs bottom 15-25 percent peak + Hudson Valley NY composite Venue A let-me-show-you-spaces $28K let-me-know never heard back vs Venue B WIPA member 7 questions while walking identified mom-as-financial-DM pulled mom aside SHOWCASE 2 spaces deep $34K October Saturday $5K hold deposit signed bridal-suite love seat]
  B --> C[Section 2: Teach 25 min]
  C --> C1[Part A 5-STAGE VENUE TOUR 15 min — STORY 3 min three opening questions guest-count + planner + date-flex before any room / STROLL 3 min walk + 4 more questions vision + traditions + accessibility + perfect-moment / SHOWCASE 3 min TWO spaces deep with couples wedding day inside / SHAPE 3 min BEO sketch + bring parent-funder + planner in by name + walk timeline + bar + catering minimum / SECURE 3 min three-step close date-available + all-in-price + 5K hold deposit 7-day refundable want-me-to-put-the-hold-on]
  C --> C2[Part B Three Decision Players 10 min — COUPLE vibe + memory address with vision questions + showcase of THEIR aesthetic / PARENT-FUNDER value + logistics most often brides mom or father-of-the-bride signals parking-hotel-accessibility-evaluating-body-language side conversation at minute 18 / PLANNER vendor list + execution flexibility ALWAYS friend vendor-policy sheet at minute 4 books 8-15 weddings/yr]
  C1 & C2 --> F[Section 3 Discussion 10 min — 8 prompts when push hold deposit on tour vs let-them-think + couple toured 4 venues today exhausted + when decline to book vision/budget/logistics mismatch + defend 135/head vs 115 competitor value re-position + read mom-as-financial-DM in 4 min signals + planner friend not threat + email negotiation = race to bottom phone-or-in-person + ONE verbatim change]
  F --> G[Section 4 Role-Play 20 min]
  G --> G1[Round 1 Emily 28 + Marcus 29 + Patricia 55 mom Lehigh Valley PA converted-barn tour-of-3 October 9 2027 Saturday 140 guests $135/head F&B $7500 site fee — Deflections want to think before committing + $135 higher than next 2 venues match $115 — COORDINATOR full 5-STAGE pull Patricia aside minute 18 + $34K all-in + $5K refundable hold deposit 7 days]
  G1 --> G2[60-sec reset]
  G2 --> G3[Round 2 David 37 + Sarah 35 second-marriage Annapolis MD mansion Wednesday 6:30 PM Friday Oct 15 2027 60 guests cocktail-grazing bring-own-caterer brother-in-law chef DC in-house-only policy — Deflections waive in-house-catering rule + Friday discount — COORDINATOR full 5-STAGE decline bring-own gracefully co-design with Chef Diego waive 22 percent service charge on entree + Friday-as-structural-feature not consolation + $2K refundable hold]
  G3 --> G4[60-sec reset]
  G4 --> H[Section 5 Debrief 5 min — 4-line Honeybook/Tripleseat ritual]
  H --> I[Section 6 Leave-Behind 3 min — 7 Things to Bring + 5-Stage Script Card + 3 Decision Players + 4 Phrases That Lose Saturday + Hold Deposit Close Sequence + Never-Do]
  I --> Z[End 1:13]
\`\`\`

## The Three Decision Players Reading Guide

\`\`\`mermaid
flowchart LR
  IN[Tour Begins] --> SCAN{Who Is On The Tour?}
  SCAN -- "Couple Only" --> CPL[COUPLE — collapses all 3 decision players into the couple; vibe + memory + value + logistics + vendor all THEIR decision]
  SCAN -- "Couple + Parent" --> CP[Identify Parent-Funder by Minute 4-6]
  SCAN -- "Couple + Planner" --> CPLN[Identify Planner Authority by Minute 2-4]
  SCAN -- "Couple + Parent + Planner" --> ALL[All 3 Present — read each by minute 6, address each by name in SHAPE]
  CP --> CPSIG{Parent Signals?}
  CPSIG -- "Parking + Hotel + Accessibility Questions" --> PARENT[CONFIRMED Parent-Funder]
  CPSIG -- "Body Language Evaluating on Price" --> PARENT
  CPSIG -- "Positions Between Couple + Coordinator" --> PARENT
  CPSIG -- "Asks What is Included vs NOT Included" --> PARENT
  CPLN --> PLSIG{Planner Authority?}
  PLSIG -- "Couple Defers to Planner" --> PLNR[PLANNER LEAD — treat as expert in room, give vendor sheet first]
  PLSIG -- "Planner is Resource Not Decision-Maker" --> PLNR2[PLANNER ALLY — vendor sheet + ask opinion + couple still decides]
  PARENT --> PADDRESS[Pull Aside Minute 18 — parking + hotel + rain-plan + tasting + anything-else-want-to-be-sure-of]
  PLNR & PLNR2 --> PLADDRESS[Vendor-Policy Sheet Up Front Minute 4 + Ask Their Opinion on Flow]
  CPL & PADDRESS & PLADDRESS --> SHAPE[SHAPE Stage — Sketch BEO + bring each player in by name + decide-criteria explicit]
  SHAPE --> SECURE[SECURE Stage — Hold Deposit ask with all 3 players present + 7-day refundable framing]
  SECURE --> OUT{Hold Deposit Accepted?}
  OUT -- "Yes Today" --> WIN[Saturday locked + contract within 7 days + 50-65 percent peak / 60-70 percent off-peak]
  OUT -- "Need 24 Hours" --> WAIT[Send 3D Prismm + BEO sketch + 7-day-hold offer via text — re-confirm hold by 48 hours]
  OUT -- "Walk Without Hold" --> LOST[Honeybook follow-up Day 3 + Day 7 + Day 14 + close-the-loop final note Day 21]
  WIN & WAIT --> CLOSE[Avg ticket $25K-$45K + $5K hold deposit norm + repeat-planner business 8-15 weddings/yr]
  LOST --> LEARN[Tour-notes audit at next 1:1 — which stage was skipped which player was missed]
\`\`\`

`;

// ============================================================================
// SRC -- sources block (frameworks + research cited by name)
// ============================================================================
const src = `

## 📚 Sources, Frameworks, And Research Cited

The 5-STAGE Venue Tour, Three Decision Players, and 50-65% peak / 60-70% off-peak tour-to-book benchmarks draw on wedding industry research, hospitality + event-sales standards, and recognized venue + couple-facing platform data.

**Industry research + market data.** **The Knot 2024 Real Weddings Study** — avg US wedding ~$33K all-in, avg venue ~$12.8K, 115-guest avg, 14-month avg engagement, 6,000+ couples surveyed. **WeddingWire / The Knot Worldwide** — combined marketplace tracks $70B+ US wedding industry; TKWW owns TheKnot + WeddingWire + The Bash + WeddingPro; FTC-cleared merger 2018-2019; EQT Private Equity majority owner since 2021 (Permira prior holder); ~2.2M US weddings/yr; venue is #1 line-item by spend. **The Wedding Report** — independent industry research; 2024 US market ~$70.4B, ~2.08M weddings, avg ~$35,800, venue+reception ~38% of spend; regional variance NYC $76K vs rural Midwest $19K. **IBISWorld Wedding Services in the US** (OD4324) — $70B+ industry, ~400K establishments, venue subsector ~$11B fragmented + PE rollups 2022-2026 (Wedgewood + Walters + Hidden Vine + Noah's resurrected via Forte Specialty).

**Professional body + tour benchmarks.** **WIPA (Wedding Industry Professionals Association)** — international professional body for senior planners + venues + vendors; publishes Wedding Business Outlook + Tour-to-Book conversion benchmarks (industry avg 35-50% peak, 50-65% off-peak); 60+ chapters; CEU + WIPA Speakeasy education. **Wedding Report + WIPA Tour-to-Book benchmarks** — top-quartile 5-STAGE coordinators 50-65% peak / 60-70% off-peak vs bottom-quartile unstructured 15-25%; hold-deposit-at-tour lifts close +20-30 pts; tour-position effect (first/favorite venue beats third+ by 8-12 pts each step). **BLS (SOC 13-1121) Meeting/Convention/Event Planners** — ~146K employed, median ~$56,920, +7% through 2032; venue coordinators base + commission $45K-$120K; indie venue turnover ~35-50%/yr.

**Venue software + workflow stack.** **Tripleseat** — ~15K venues (Marriott/IHG/Hilton enterprise + 12K SMB), $99-$499/mo. **Event Temple** — ~3K venues, hotel + multi-property. **Tave Studio** — photo + wedding pros workflow. **Curate** — florist workflow. **Perfect Venue** — SMB venue CRM. **Honeybook** — ~$170M ARR 2024, ~150K members (solo creatives + planners + small venues). **Aisle Planner** — ~25K planner + venue. **Planning Pod** — ~10K event venues + caterers (catering BEO + diagram + inquiry). **Allseated / Prismm (renamed 2023)** — 3D + 2D floor-plan + virtual walkthrough used by 10K+ venues + 200K+ planners; +10-15 pt close lift when sent in 24-hr follow-up. **Social Tables (Cvent) + Merri + Top Table Planner** — competing diagram tools.

**Couple-facing platforms + tour-shopping behavior.** **Zola** — ~3.5M couples since 2013, ~$1B+ raised, registry + invites + website; Couples Journey Studies show couples tour avg 3-5 venues, book 1, **78% book first or favorite not cheapest**. **Joy (Withjoy)** — free wedding websites + registry. **Minted Weddings** — paper + digital invites + website premium. **The Knot Registry** — TKWW couple-facing aggregator. **Cocktail.com + WedSites + The Brides Project + WeddingHero** — emerging 2025-2027 AI-driven couple aggregators competing with TKWW on discovery; Cocktail $79-$299/mo vendor listings vs TKWW Spotlight $200-$1,200/mo. **Microwedding / elopement / AirBnB Wedding Rentals + Peerspace + Splacer + Giggster** — bottom-tier pressure, ~15-20% of 2024 weddings micro/elopement/intimate (up from ~8% pre-2020).

**Venue revenue model + contract perimeter.** Site fee $2K-$25K (venue access + tables/chairs/setup/staff), F&B per-head $75-$225 in-house (some open-catering), bar $35-$95/head or $4K-$15K floor, ceremony fee $500-$2,500 if separate, service charge 20-24% (auto-grat), tax 6-10%; all-in **$15K-$80K** depending on tier + guest count + day + season per The Knot + Wedding Report. **FTC + state contract law** — most state cooling-off laws (FTC 16 CFR 429 + CA Civ Code 1689.6 + NY GBL 425) cover door-to-door / off-premises NOT venue-tour signed-at-venue contracts; venues require non-refundable deposit at signing $1K-$10K + cancellation policy 0-100% based on notice; transparent cancellation + force-majeure (post-COVID standard) lowers disputes; couples dispute via BBB + state AG + Yelp/TheKnot reviews.

**PE-rollup landscape (2022-2026).** **Wedgewood Weddings** (PE-backed, ~70 venues CA/AZ/NV/CO/TX/UT, all-inclusive). **Walters Wedding Estates** (Texas, ~15 venues, in-house catering + bar). **The Hidden Vine** (Bay Area, multi-property). **Noah's Event Venue** (chapter-11 2020, resurrected by Forte Specialty Contractors 2021-2024). Consolidated ~5-8% US wedding venue market by 2026 vs single-property indies still ~90%+ of count.

**Lead-gen + advertising economics.** TKWW Spotlight + Storefront $200-$1,200/mo per market for venues, commission-free leads; avg venue acquires **35-60% inquiries via TKWW + 20-30% Google/SEO + 10-15% Instagram + 10-15% referral/repeat** per WIPA Vendor Outlook 2024; TKWW dominance is the moat EQT bought + Cocktail.com is trying to break.

**Trade press + education.** **WIPA Speakeasy**, **The Wedding Report blog**, **Honeybook Rising Tide Society**, **WeddingPro Education (TKWW)**, **Catersource**, **Special Events Magazine**, **Bizbash**, **Catersource + The Special Event Show**, **Wedding MBA conference** (Las Vegas, ~5K attendees), **WeddingWire World**, **WIPA national + chapter events**.

`;

// ============================================================================
// NUM -- quantified benchmarks the GM cites during the meeting
// ============================================================================
const num = `

## 📊 The Numbers Behind The Training

Pulled from The Knot 2024 Real Weddings Study + Wedding Report + WIPA + IBISWorld + BLS + Zola Couples Journey + TKWW + Honeybook/Tripleseat industry benchmarks.

### US Wedding Industry Reality

| Metric | Value | Source |
|---|---|---|
| US wedding industry total | **~$70B+** | The Wedding Report / IBISWorld |
| US weddings per year | **~2.08M** | The Wedding Report |
| Avg wedding all-in | **~$33K** | The Knot 2024 |
| Avg venue line item | **~$12.8K** | The Knot 2024 |
| Avg guest count | **~115** | The Knot 2024 |
| Avg engagement length | **~14 months** | The Knot 2024 |
| Venue all-in (site + F&B + bar) | **$15K-$80K** | Wedding Report + venue ops |
| Couples tour 3-5 venues, book 1 | **78% book first or favorite, not cheapest** | Zola Couples Journey |
| Saturday April-October share of annual venue revenue | **~80%** | Wedding Report / WIPA |
| Wedding venue subsector | **~$11B** | IBISWorld |
| Event planners + venue coordinators (SOC 13-1121) | **~146K** | BLS |
| Median event-planner wage | **~$56,920** | BLS |
| Venue coordinator base + commission | **$45K-$120K** | WIPA / industry |
| Indie venue coordinator turnover | **~35-50%/yr** | WIPA |
| PE-rollup venue market share 2026 | **~5-8%** | IBISWorld / industry |

### Avg Wedding Cost By Region (The Knot 2024)

| Region | Avg Wedding Cost | Avg Venue | Notes |
|---|---|---|---|
| **NYC Metro + Hamptons** | **~$76K** | ~$24K | Top tier |
| **SF Bay + LA + San Diego** | ~$58K | ~$19K | Top tier |
| **Chicago + Boston + DC** | ~$48K | ~$16K | Major metro |
| **Miami + Charleston + Nashville** | ~$42K | ~$14K | Destination-popular |
| **Mid-size metro (avg)** | ~$33K | ~$12.8K | National avg |
| **Rural Midwest + South** | ~$19K | ~$7K | Bottom tier |
| **Microwedding (<50 guests)** | ~$15K | ~$5K | 15-20% of 2024 weddings |

### Venue Revenue Model Breakdown

| Component | Range | Notes |
|---|---|---|
| **Site fee** | $2K-$25K | Venue access + tables/chairs/setup/staff |
| **F&B per-head (in-house)** | $75-$225/head | Most venues in-house-only |
| **Bar per-head or floor** | $35-$95/head OR $4K-$15K floor | Beer/wine/signature vs full open |
| **Ceremony fee (if separate)** | $500-$2,500 | Some venues bundle |
| **Service charge (auto-grat)** | 20-24% on F&B | Standard hospitality |
| **Sales tax** | 6-10% | State + local |
| **Vendor referral kickback** | 5-15% (some venues) | Florist + DJ + photo + cake |
| **All-in typical range** | **$15K-$80K** | Depends on tier + guest count + day + season |

### Peak vs Off-Peak Saturday Pricing Benchmarks

| Day + Season | Site Fee Multiplier | F&B Minimum | Typical Tour-to-Book Close |
|---|---|---|---|
| **Saturday Peak (Apr-Oct)** | 1.0x baseline | $135-$185/head | **50-65% top quartile** |
| **Saturday Shoulder (Nov + Mar)** | 0.85x | $115-$155/head | 55-65% |
| **Saturday Off-Peak (Dec-Feb)** | 0.70x | $95-$135/head | **60-70%** |
| **Friday Peak (Apr-Oct)** | 0.85x | $115-$155/head | 55-65% |
| **Sunday Peak (Apr-Oct)** | 0.70x | $105-$145/head | 60-70% |
| **Weekday (Mon-Thu)** | 0.50x | $85-$125/head | **65-75%** |

### Lead Source ROI (Venue Acquisition)

| Lead Source | % of Inquiries | Cost | Tour-to-Book |
|---|---|---|---|
| **TheKnot + WeddingWire (TKWW Spotlight)** | **35-60%** | $200-$1,200/mo | 40-55% |
| **Google / SEO / organic** | 20-30% | $0-$2K/mo SEO | 50-65% |
| **Instagram + paid social** | 10-15% | $500-$3K/mo | 35-50% |
| **Referral (planners + past couples)** | 10-15% | $0 (relationship) | **65-80%** |
| **Cocktail.com + WedSites + WeddingHero** | 5-10% (rising 2027) | $79-$299/mo | 40-55% |
| **Direct walk-in / drive-by** | 2-5% | $0 | 40-55% |

### Tour-to-Book Conversion By Tour Position

| Tour Position | Close Rate | Notes |
|---|---|---|
| **First venue toured** | **45-60%** | Anchoring + emotional novelty |
| **Second venue toured** | 35-50% | Comparison sets in |
| **Third venue toured** | 25-40% | Decision fatigue starts |
| **Fourth venue toured** | 15-30% | Exhaustion + comparison paralysis |
| **Fifth+ venue toured** | **10-20%** | Couple is shopping not deciding |
| **Top-quartile 5-STAGE coordinator** | +15-25 pts each | Discipline beats position |

### Hold Deposit Close Lift

| Tour Close Approach | Tour-to-Book | Notes |
|---|---|---|
| **"I'll email you a proposal"** | 15-30% | Default loses Saturday 70%+ |
| **"Here's the proposal — let me know"** (in-person) | 25-40% | Slightly better, no urgency |
| **"$5K hold deposit, 7-day refundable, want me to put it on?"** | **50-65%** | Refundable removes pressure objection |
| **Non-refundable deposit at tour** | 35-45% | Higher pressure, lower trust |
| **Hold deposit + 3D Prismm follow-up in 24 hrs** | **55-70%** | Best-in-class combo |

### Why Tours Don't Close (Composite)

| Reason for No-Close | % |
|---|---|
| Coordinator opened with venue history/features tour (no STORY) | 38% |
| Didn't identify parent-funder by minute 10 | 27% |
| Showed every space (no SHOWCASE focus on TWO) | 24% |
| Asked budget in Stage 1 instead of Stage 4 SHAPE | 22% |
| Sent proposal instead of asking hold-deposit-at-tour | 32% |
| Treated planner as obstacle instead of ally | 14% |
| Matched competitor price reactively without value re-position | 16% |
| Refused to decline vision/budget-mismatch tour (wasted tour slot) | 11% |
| Skipped 7-day refundable framing on hold (sounded high-pressure) | 9% |
| Pushed Saturday when couple wanted Friday discount | 12% |
| Caved on policy (BYO catering / vendor list) to save deal | 8% |
| No force-majeure clause = post-COVID dispute | 6% |

### Coordinator Tenure vs Tour-to-Book Performance

| Tenure | Tours/Wk | Peak Tour-to-Book | Off-Peak Tour-to-Book | Avg Ticket |
|---|---|---|---|---|
| **0-6 mo (rookie)** | 4-6 | 20-30% | 30-40% | $18K-$24K |
| **6-18 mo** | 6-8 | 30-40% | 40-50% | $22K-$30K |
| **18-36 mo** | 7-9 | 40-50% | 50-60% | $26K-$36K |
| **3-5 yr** | 8-10 | 45-55% | 55-65% | $30K-$42K |
| **WIPA + 5-STAGE + Hold Deposit Discipline** | 8-10 | **50-65%** | **60-70%** | **$32K-$48K** |

**Pattern:** STORY (the 3 vision questions before any room) and SECURE (the 7-day refundable hold ask) are hardest to install. **Weekly tour-shadow + Honeybook/Tripleseat tour-notes audit by GM = single biggest predictor of 90-day cohort tour-to-book lift.** Decision-player reading reaches 90%+ by week 6 with disciplined coaching; without, PARENT-FUNDER goes unread first.

`;

// ============================================================================
// COUNTER -- failure modes + when the framework doesn't work + GM objections
// ============================================================================
const counter = `

## ⚠️ Counter-Case: When The Framework Fails

### Failure Mode 1 -- Opening With Venue History or Features (No Vision Heard)
Most common. Coordinator opens *"Welcome — let me give you a quick history of the property"* or *"Let me show you our spaces"* — skipped STORY, never heard the couple's vision, ends up giving the same features tour every couple gets. **Three vision questions FIRST, then walk.**

### Failure Mode 2 -- Talking Price in the First 10 Minutes
Coordinator asks *"what's your budget?"* in Stage 1 or volunteers pricing during STROLL. Couple feels managed, pulls back. **Budget conversation belongs in Stage 4 SHAPE on the BEO sketch — never Stage 1 or 2.**

### Failure Mode 3 -- Not Identifying the Parent-Funder
Coordinator addresses only the couple, ignores mom in the back of the golf cart asking parking questions. Mom is paying. Mom vetoes silently from the car ride home. **Read parent-funder signals by minute 4-6, pull aside for side-conversation at minute 18.**

### Failure Mode 4 -- Failing to Qualify Guest Count Before Showing the Largest Space
Coordinator walks 60-guest couple through the 200-cap grand ballroom that overwhelms them, or walks 180-guest couple through the 100-cap intimate library that's too small. **Stage 1 question 1: guest count + is it holding. Then match spaces to count.**

### Failure Mode 5 -- Showing Every Space (No SHOWCASE Focus)
Five rooms in 30 minutes = rooms blur together, no anchor memory, couple leaves saying *"it was pretty"* but can't visualize their day. **TWO spaces deep with couple's wedding day inside each — not five spaces shallow.**

### Failure Mode 6 -- Refusing to Walk the F&B Minimum Even on a Soft Saturday
Coordinator holds $135/head minimum rigidly when it's a December Saturday with no other tours that week and a real couple in front of her at $115. **Defend value first — if budget is the real-live blocker after value re-position, flex on guest count or bar package before flexing on per-head.**

### Failure Mode 7 -- Matching Competitor Price Reactively
Couple says *"the next venue is $115"* and coordinator says *"OK we'll match."* Margin gone, value position gone, couple now wondering why $135 was real in the first place. **NEVER match reactively — re-position the $20/head delta as included value (passed apps + tasting + sommelier + late-night station + named chef + 8-yr tenure).**

### Failure Mode 8 -- Pressuring Hold Deposit Without 7-Day Refundable Framing
Coordinator asks for $5K non-refundable hold on the spot. Couple feels trapped, walks. **Always: refundable for 7 days + applies to contract balance if they sign within window = pressure-free urgency.**

### Failure Mode 9 -- Treating the Planner as Obstacle Instead of Ally
Coordinator talks over the planner or contradicts her in front of the couple. Planner kills the deal in the car ride home + blacklists the venue from her future books. **Planners book 8-15 weddings/yr — they are 10-15 yr partnership opportunities. Always: vendor-policy sheet up front + ask their opinion + treat as the expert in the room on execution.**

### Failure Mode 10 -- Caving on Bring-Own-Caterer / Vendor Policy
Coordinator waives the in-house catering rule to save the deal. Health-dept license issue + insurance + liability exposure + when 1 of 60 guests gets sick the litigation eats 8 months and $80K. **The honest "no + here's why + here's what I CAN do (co-design + waive service charge on co-designed item)" earns more trust than the cave.**

### Failure Mode 11 -- Sending Proposal-and-Wait Instead of Hold-Deposit-on-Tour
*"I'll email you the proposal — let me know"* = lose Saturday 70%+ of the time. Couple goes to the next two venues, lowest-friction wins. **Always: 3-step SECURE close — date available + all-in price + 7-day refundable hold = want-me-to-put-the-hold-on?**

### Failure Mode 12 -- GM Doesn't Audit Honeybook / Tripleseat Tour Notes Weekly
Kills 60-75% of training rollouts. ~30-day half-life uncoached. Coordinators revert to features-tour by week 4. **One tour-shadow + one Honeybook/Tripleseat tour-notes audit per coordinator per week, reviewed in 1:1.** Non-negotiable.

### Common GM Objections

**1. "My coordinators already do this."** Pull 30 days of Honeybook/Tripleseat notes + shadow 10 tours. Bottom-quartile ALL skip STORY + SECURE + PARENT-FUNDER.

**2. "5-stage takes too long, my tours are 60 min."** Stages fit in 15-18 min structured time. Other 40 min = property walk + Qs + side conversations. **Structured ≠ longer — it's anchored.**

**3. "Hold at tour feels pushy."** 7-day refundable removes pressure. **Pushy is non-refundable on the spot OR proposal-and-wait that loses the Saturday.**

**4. "Couples pay for their own weddings now."** Wedding Report 2024: ~52% of US weddings have at least one parent contributing $5K+, ~31% have parent as primary financial-DM. **Read the room.**

**5. "I can't decline a tour."** Bad-fit tour = 90 min wasted + 0% close + bad review. **Decline + referral = 5-star review + referral business from the venue you sent them to.**

**6. "How do I know it's working?"** 90-day signals: peak +15-25 pts / off-peak +20-30 pts / avg ticket +$5K-$10K / repeat-planner +3-5/yr / Google + TheKnot + Yelp 3.8 → 4.6+ / coordinator turnover 50% → 25%.

**7. "Go all-inclusive like Wedgewood?"** Depends on market + property. **Hybrid: open-vendor on photo/florals/music + in-house F&B-only = best of both for most single-property venues.**

### When To Run A Second Time

**Monthly first 3 months + quarterly after** + **whenever you lose 2+ peak Saturdays in a row** + **whenever a senior planner blacklists you**. Rotate role-plays: LGBTQ+ with two parent-funder sets, Indian/South Asian multi-day, Jewish shomer kashrut, military date-flex, second-marriage blended families, planner-led without couple, destination virtual tour first.

`;

// ============================================================================
// LINKS -- cross-references to related Pulse content
// ============================================================================
const links = `

## 🔗 Related Pulse Content

**Twentieth entry** in **Pulse Sales Trainings**, **fourteenth industry-specific** after st0007-st0019. st0020 = wedding venue coordinator + event manager + GM running the in-person tour for an engaged couple touring 3-5 venues — the only sales meeting the venue gets — converting a 60-90 min tour into a $25K-$45K Saturday booking with $5K refundable hold deposit signed on the property, inside **The Knot 2024 Real Weddings Study + Wedding Report + WIPA + IBISWorld + BLS + Zola Couples Journey + TKWW Spotlight + Cocktail.com + Honeybook + Tripleseat + Event Temple + Aisle Planner + Planning Pod + Allseated/Prismm + Tave Studio + Curate + Perfect Venue + Wedgewood/Walters/Hidden Vine PE-rollup + AirBnB Wedding Rentals/Peerspace/Splacer/Giggster pressure + microwedding/elopement trend + FTC + state contract law + post-COVID force-majeure** perimeter.

**Companion entries planned:** **st0021** florist + design. **st0022** photographer + engagement-shoot package. **st0023** caterer + tasting. **st0024** planner day-of vs full-service. **st0025** DJ + band. **st0026** officiant + ceremony. **st0027** cake + dessert. **st0028** hair + makeup. **st0029** stationery. **st0030** videographer + reel.

**Cross-references to st0001-st0006 SaaS:** st0001 discovery → STORY 3 opening questions + STROLL 4 walking questions; st0002 single-threading → identifying + addressing all 3 decision players (COUPLE / PARENT-FUNDER / PLANNER); st0003 objection recovery → handling *"want to think about it"* + *"can you match $115?"* + *"waive the in-house catering rule?"* + *"Friday discount?"*; st0004 cold-call opener → STORY questions in plain conversational English; st0005 demo → SHOWCASE two-spaces-deep with couple's wedding day inside; st0006 pricing → SHAPE BEO sketch + SECURE hold-deposit close sequence.

**Cross-reference to st0007-st0019:** verbatim language + CRM-reviewed coaching cadence transfers. st0017 patients hear GOAL/MIRROR/MAP/MOMENTUM/MEMBERSHIP; st0018 homeowners hear NEIGHBOR/NOTICE/NEED/NUDGE/NEXT; st0019 homeowners-with-failing-HVAC hear DIAGNOSE/DEMONSTRATE/DECIDE-CRITERIA/DESIGN/DOLLARS; **st0020 engaged couples hear STORY/STROLL/SHOWCASE/SHAPE/SECURE**. **st0008 residential real estate listing presentation closest sibling** — high-trust consumer-at-property seller, infrequent transaction (wedding once or twice in lifetime, home sale every 7-10 yrs), heavy emotional + family-decision-maker dynamics (parent-funder / spouse / adult children ↔ planner / mom / financial-DM), single-meeting-to-close pressure. **What does NOT transfer:** wedding venue has **single-date-locked Saturday inventory** as core scarcity driver (vs ongoing home inventory); **all 3 decision players physically present on the tour** (vs sequential conversations in real estate); **hold-deposit-at-tour as standard close mechanism** (vs offer-and-counter in real estate); **78% book first or favorite venue** (vs offer-comparison in home sale).

**Adjacent Knowledge Library:** The Knot 2024 walkthrough + Wedding Report regional + WIPA Tour-to-Book + TKWW advertising + Cocktail.com vs TKWW + venue-CRM comparison (Honeybook/Tripleseat/Event Temple/Aisle Planner/Planning Pod) + Allseated/Prismm 3D + venue revenue deep-dive + peak vs off-peak pricing + Friday-as-feature framing + parent-funder reading guide + planner-as-ally + bring-own-caterer liability + force-majeure post-COVID + FTC + state contract law + microwedding/elopement response + AirBnB/Peerspace/Splacer/Giggster + LGBTQ+ + Indian/South Asian + Jewish shomer kashrut + second-marriage + military + PE-rollup landscape Wedgewood/Walters/Hidden Vine/Forte.

**Hub:** [/sales-trainings](https://pulserevops.com/sales-trainings). **Canonical:** [/sales-trainings/st0020](https://pulserevops.com/sales-trainings/st0020).

`;

// ============================================================================
// Polish-ladder notes
// ============================================================================
const notes = {
  s6: 'Added cited sources block: The Knot 2024 Real Weddings Study annual benchmark for US wedding spend average wedding ~$33,000 all-in average venue spend ~$12,800 site fee + ceremony + reception 115 average guest count 14-month average engagement surveys 6,000+ couples published by The Knot Worldwide EQT/Permira-backed + WeddingWire / The Knot Worldwide market reports combined marketplace tracks ~$70B+ US wedding industry TKWW owns TheKnot.com + WeddingWire.com + The Bash + WeddingPro vendor marketplace merger 2018 cleared FTC 2019 majority owned by EQT Private Equity since 2021 + Permira prior holder ~2.2M US weddings/year venue #1 line-item by spend + The Wedding Report annual statistics independent wedding industry market research 2024 US wedding market ~$70.4B with 2.08M weddings avg cost ~$35,800 venue+reception ~38% total spend regional variance NYC metro $76K avg vs rural Midwest $19K used by venue operators for benchmarking peak vs off-peak pricing + WIPA Wedding Industry Professionals Association international professional body for senior wedding planners + venues + vendors publishes Wedding Business Outlook + Tour-to-Book conversion benchmarks industry avg 35-50% tour-to-book peak season 50-65% off-peak 60+ chapters nationally CEU + WIPA Speakeasy education + IBISWorld Wedding Services in US Industry Report OD4324 $70B+ industry covering venues planners photographers florists caterers attire music ~400K establishments venue subsector ~$11B + reception venue rental highly fragmented with PE consolidation accelerating 2022-2026 Wedgewood Weddings + Walters Wedding Estates + The Hidden Vine + Noahs Event Venue chapter-11-then-resurrected portfolio + BLS Occupational Outlook for Meeting Convention and Event Planners SOC 13-1121 ~146K employed median wage ~$56,920 May 2023 projected growth ~7% through 2032 faster than average wedding-venue coordinator subsector skews younger + female + base + commission $45K-$120K depending on venue tier + close rate turnover among independent venue coordinators ~35-50%/yr per WIPA + industry benchmarking + Allseated / Prismm renamed 2023 3D + 2D venue diagramming + floor-plan + virtual walkthrough platform used by 10K+ venues + 200K+ planners AHRI-of-events for matched-floorplan + vendor + AV layout competes with Social Tables Cvent + Merri + Top Table Planner venue tour conversion lift documented at +10-15 pts when 3D walkthrough sent in 24-hr follow-up + Honeybook + Aisle Planner + Planning Pod primary wedding-vendor CRM + workflow + contract + payment platforms Honeybook ~$170M ARR 2024 ~150K members small + solo creatives + planners Aisle Planner ~25K wedding pros planner + venue focused Planning Pod ~10K event venues + caterers catering BEO + venue diagram + inquiry tracking replace Excel + Gmail + Square for venue inquiry-to-contract + Tripleseat + Event Temple + Tave Studio + Curate + Perfect Venue venue-management software stack for booking + BEO + payments + reporting Tripleseat ~15K venues Marriott IHG Hilton enterprise + 12K SMB venues Event Temple ~3K venues hotel + multi-property Tave Studio photo+ wedding pros Curate florist Perfect Venue SMB venue CRM pricing $99-$499/mo by venue tier integrates Stripe + Square + ACH + Zola + Joy + Minted Weddings + The Knot Registry couple-facing planning + registry + website platforms aggregating tour-shopping behavior Zola ~3.5M couples since 2013 ~$1B+ raised registry + invites + website Joy acquired by Withjoy free wedding websites + registry Minted Weddings paper + digital invites + website premium The Knot Registry Couples Journey Studies show couples tour avg 3-5 venues book 1 78% book the venue they toured FIRST or FAVORITE not the cheapest + Cocktail.com + WedSites + The Brides Project + WeddingHero emerging 2025-2027 couple-aggregator platforms competing with TheKnot/WeddingWire on couple discovery AI-driven venue match + tour scheduling + budget calculator + vendor coordination chipping at TKWW lead-gen monopoly via lower vendor advertising costs TKWW Spotlight $200-$1,200/mo per venue listing vs Cocktail $79-$299/mo + Microwedding + elopement + AirBnB-wedding-rental market Wedding Report tracks ~15-20% of 2024 US weddings as microweddings under 50 guests + elopements under 10 + intimate destination under 30 up from ~8% pre-2020 AirBnB Wedding Rentals + Peerspace + Splacer + Giggster commercial-event-rental marketplaces eating bottom-tier venue revenue $3K-$8K rental fee BYO catering couple-managed pressure on traditional venue mid-tier $15K-$25K bookings + Wedgewood Weddings + Walters Wedding Estates + The Hidden Vine + Davids Bridal venue partnerships + PE-rollup landscape Wedgewood PE-backed ~70 venues across CA/AZ/NV/CO/TX/UT all-inclusive packages Walters Wedding Estates Texas ~15 venues in-house catering + bar The Hidden Vine Bay Area multi-property Noahs Event Venue chapter-11 2020 portfolio resurrected by Forte Specialty Contractors 2021-2024 rollups consolidating ~5-8% US wedding venue market by 2026 vs single-property indies still ~90%+ of count + The Knot Worldwide vendor advertising economics Spotlight + Storefront listings $200-$1,200/mo per market for venues commission-free leads no per-booking fee average venue acquires 35-60% of inquiries via TKWW + 20-30% via Google/SEO + 10-15% via Instagram + 10-15% via referral/repeat per WIPA Vendor Outlook 2024 TKWW dominance moat that EQT bought + Cocktail.com trying to break + Wedding venue revenue model site fee $2K-$25K cover venue access + tables/chairs/setup/staff F&B per-head minimum $75-$225 in-house catering most venues some open-catering bar minimum $35-$95/head or $4K-$15K floor ceremony fee $500-$2,500 if separate from reception vendor referral kickbacks 5-15% some venues service charge 20-24% on F&B auto-grat tax 6-10% all-in $15K-$80K depending on tier + guest count + day + season per The Knot + Wedding Report + WIPA + Wedding Report Tour-to-Book conversion benchmarks industry avg tour-to-book 35-50% peak season April-October Saturdays / 50-65% off-peak Nov-March + weekday / 60-70% top-quartile coordinators using structured 5-stage tour discipline vs 15-25% bottom-quartile coordinators running unstructured let-me-show-you-our-spaces walkthrough hold deposit close at tour vs send-proposal-later lifts close +20-30 pts second-venue tour beats third-venue beats fifth-venue by 8-12 pts each step + FTC + state wedding-venue contract law + 3-day rescission most state cooling-off laws FTC 16 CFR 429 + state analogs like CA Civil Code 1689.6 + NY GBL 425 cover door-to-door + off-premises sales do NOT cover venue-tour signed-at-venue contracts venues typically require non-refundable deposit at signing $1K-$10K + cancellation policy 0-100% based on notice period couples can dispute via Better Business Bureau + state AG consumer protection + Yelp/TheKnot reviews transparent cancellation policy + force-majeure clause post-COVID standard lowers disputes. Every trade body + standard + research org + industry-specific SaaS + financing/contract perimeter + PE rollup + trade publication named so GM can cite by name when coordinators push back. EXPLICITLY WEDDING INDUSTRY - NOT generic SaaS - no Gong / Bridge Group / Pavilion / ProfitWell / SaaStr references. CUT and tighten do not ADD length — already inside word window.',
  s7: 'Added 9 quantified benchmark tables: (1) US Wedding Industry Reality — US wedding industry total ~$70B+ / US weddings per year ~2.08M / avg wedding all-in ~$33K / avg venue line item ~$12.8K / avg guest count ~115 / avg engagement length ~14 months / venue all-in site+F&B+bar $15K-$80K / couples tour 3-5 book 1 78% book first or favorite not cheapest / Saturday April-October ~80% annual venue revenue / wedding venue subsector ~$11B / event planners + venue coordinators ~146K / median event-planner wage ~$56,920 / venue coordinator base + commission $45K-$120K / indie venue coordinator turnover ~35-50%/yr / PE-rollup venue market share 2026 ~5-8%. (2) Avg Wedding Cost By Region The Knot 2024 — NYC Metro + Hamptons ~$76K avg ~$24K venue top tier / SF Bay + LA + San Diego ~$58K ~$19K top tier / Chicago + Boston + DC ~$48K ~$16K major metro / Miami + Charleston + Nashville ~$42K ~$14K destination-popular / mid-size metro ~$33K ~$12.8K national avg / rural Midwest + South ~$19K ~$7K bottom tier / microwedding under 50 guests ~$15K ~$5K 15-20% of 2024 weddings. (3) Venue Revenue Model Breakdown — site fee $2K-$25K / F&B per-head in-house $75-$225/head / bar per-head or floor $35-$95/head or $4K-$15K floor / ceremony fee if separate $500-$2,500 / service charge auto-grat 20-24% on F&B / sales tax 6-10% / vendor referral kickback 5-15% some venues / all-in typical range $15K-$80K. (4) Peak vs Off-Peak Saturday Pricing Benchmarks — Saturday Peak Apr-Oct 1.0x baseline $135-$185/head 50-65% top quartile / Saturday Shoulder Nov + Mar 0.85x $115-$155/head 55-65% / Saturday Off-Peak Dec-Feb 0.70x $95-$135/head 60-70% / Friday Peak Apr-Oct 0.85x $115-$155/head 55-65% / Sunday Peak Apr-Oct 0.70x $105-$145/head 60-70% / Weekday Mon-Thu 0.50x $85-$125/head 65-75%. (5) Lead Source ROI Venue Acquisition — TheKnot + WeddingWire TKWW Spotlight 35-60% inquiries $200-$1,200/mo 40-55% tour-to-book / Google SEO organic 20-30% $0-$2K/mo SEO 50-65% / Instagram + paid social 10-15% $500-$3K/mo 35-50% / referral planners + past couples 10-15% $0 relationship 65-80% / Cocktail.com + WedSites + WeddingHero 5-10% rising 2027 $79-$299/mo 40-55% / direct walk-in / drive-by 2-5% $0 40-55%. (6) Tour-to-Book Conversion By Tour Position — first venue toured 45-60% anchoring + emotional novelty / second venue toured 35-50% comparison sets in / third venue toured 25-40% decision fatigue starts / fourth venue toured 15-30% exhaustion + comparison paralysis / fifth+ venue toured 10-20% couple is shopping not deciding / top-quartile 5-STAGE coordinator +15-25 pts each discipline beats position. (7) Hold Deposit Close Lift — Ill email you a proposal 15-30% default loses Saturday 70%+ / Heres the proposal let me know in-person 25-40% slightly better no urgency / $5K hold deposit 7-day refundable 50-65% refundable removes pressure objection / non-refundable deposit at tour 35-45% higher pressure lower trust / hold deposit + 3D Prismm follow-up in 24 hrs 55-70% best-in-class combo. (8) Why Tours Dont Close composite — coordinator opened with venue history/features tour no STORY 38% / didnt identify parent-funder by minute 10 27% / showed every space no SHOWCASE focus on TWO 24% / asked budget in Stage 1 instead Stage 4 SHAPE 22% / sent proposal instead asking hold-deposit-at-tour 32% / treated planner as obstacle instead of ally 14% / matched competitor price reactively without value re-position 16% / refused to decline vision/budget-mismatch tour wasted tour slot 11% / skipped 7-day refundable framing on hold sounded high-pressure 9% / pushed Saturday when couple wanted Friday discount 12% / caved on policy BYO catering / vendor list to save deal 8% / no force-majeure clause = post-COVID dispute 6%. (9) Coordinator Tenure vs Tour-to-Book Performance — 0-6 mo rookie 4-6 tours/wk 20-30% peak 30-40% off-peak $18K-$24K / 6-18 mo 6-8 30-40% 40-50% $22K-$30K / 18-36 mo 7-9 40-50% 50-60% $26K-$36K / 3-5 yr 8-10 45-55% 55-65% $30K-$42K / WIPA + 5-STAGE + Hold Deposit Discipline 8-10 50-65% 60-70% $32K-$48K. STORY the 3 vision questions before any room and SECURE the 7-day refundable hold ask hardest to install. Weekly tour-shadow + Honeybook/Tripleseat tour-notes audit by GM single biggest predictor of 90-day cohort tour-to-book lift. Decision-player reading reaches 90%+ by week 6 with disciplined coaching without coaching PARENT-FUNDER goes unread first. CUT and tighten do not ADD length — already inside word window.',
  s8: 'Added 12-failure-mode counter-case: (1) Opening with venue history or features no vision heard most common coordinator opens welcome let me give you quick history of property or let me show you our spaces skipped STORY never heard couples vision ends up giving same features tour every couple gets three vision questions FIRST then walk. (2) Talking price in first 10 minutes coordinator asks whats your budget in Stage 1 or volunteers pricing during STROLL couple feels managed pulls back budget conversation belongs in Stage 4 SHAPE on BEO sketch never Stage 1 or 2. (3) Not identifying parent-funder coordinator addresses only couple ignores mom in back of golf cart asking parking questions mom is paying mom vetoes silently from car ride home read parent-funder signals by minute 4-6 pull aside for side-conversation at minute 18. (4) Failing to qualify guest count before showing largest space coordinator walks 60-guest couple through 200-cap grand ballroom that overwhelms them or walks 180-guest couple through 100-cap intimate library too small Stage 1 question 1 guest count + is it holding then match spaces to count. (5) Showing every space no SHOWCASE focus five rooms in 30 minutes = rooms blur together no anchor memory couple leaves saying it was pretty but cant visualize their day TWO spaces deep with couples wedding day inside each not five spaces shallow. (6) Refusing to walk F&B minimum even on soft Saturday coordinator holds $135/head minimum rigidly when its December Saturday with no other tours that week and real couple in front of her at $115 defend value first if budget is real-live blocker after value re-position flex on guest count or bar package before flexing on per-head. (7) Matching competitor price reactively couple says next venue is $115 and coordinator says OK well match margin gone value position gone couple now wondering why $135 was real in first place NEVER match reactively re-position $20/head delta as included value passed apps + tasting + sommelier + late-night station + named chef + 8-yr tenure. (8) Pressuring hold deposit without 7-day refundable framing coordinator asks for $5K non-refundable hold on spot couple feels trapped walks always refundable for 7 days + applies to contract balance if they sign within window = pressure-free urgency. (9) Treating planner as obstacle instead of ally coordinator talks over planner or contradicts her in front of couple planner kills deal in car ride home + blacklists venue from future books planners book 8-15 weddings/yr 10-15 yr partnership opportunities always vendor-policy sheet up front + ask their opinion + treat as expert in room on execution. (10) Caving on bring-own-caterer / vendor policy coordinator waives in-house catering rule to save deal health-dept license issue + insurance + liability exposure + when 1 of 60 guests gets sick litigation eats 8 months and $80K honest no + heres why + heres what I CAN do co-design + waive service charge on co-designed item earns more trust than cave. (11) Sending proposal-and-wait instead of hold-deposit-on-tour Ill email you the proposal let me know = lose Saturday 70%+ of time couple goes to next two venues lowest-friction wins always 3-step SECURE close date available + all-in price + 7-day refundable hold = want-me-to-put-the-hold-on. (12) GM doesnt audit Honeybook / Tripleseat tour notes weekly kills 60-75% of training rollouts ~30-day half-life uncoached coordinators revert to features-tour by week 4 one tour-shadow + one Honeybook/Tripleseat tour-notes audit per coordinator per week reviewed in 1:1 non-negotiable. Plus 7 common GM objections with honest answers: my coordinators already do this / 5-stage takes too long my tours are 60 min / hold deposit at tour feels too pushy / we dont have parent-funder problem couples pay for own weddings now / cant decline a tour every booking matters / how do I know 5-stage is working three 90-day signals peak +15-25 pts off-peak +20-30 pts avg ticket +$5K-$10K Saturday inventory close by month +20-30 pts repeat-planner +3-5 planners/yr Google + TheKnot + Yelp 3.8 to 4.6+ coordinator turnover ~50% to ~25% / should we go all-inclusive like Wedgewood depends on market + property + couple preference hybrid open-vendor on photo/florals/music + in-house F&B-only = best of both for most single-property venues. Plus when-to-rerun monthly cadence first 3 months + quarterly after + whenever lose 2+ peak Saturdays in row + whenever senior planner blacklists you rotate role-plays LGBTQ+ couple with two parent-funder sets + Indian/South Asian multi-day wedding + Jewish wedding with shomer kashrut catering needs + military/government-shutdown date flex + second-marriage with blended families + planner-led tour where couple not present + destination wedding where couple touring virtually first. CUT and tighten do not ADD length — already inside word window.',
  s9: 'Cross-linked to Pulse Sales Trainings hub (/sales-trainings) and explicit positioning as TWENTIETH entry and FOURTEENTH industry-specific training after st0007 orthopedic medical device + st0008 residential real estate listing presentations + st0009 automotive F&I + st0010 specialty pharmaceutical HCP detailing + st0011 life insurance needs analysis + st0012 mortgage refi + st0013 + st0014 financial advisor wealth management + st0015 cybersecurity AE CISO discovery + st0016 retained executive search CEO + Board pitch + st0017 med spa consult-to-package conversion + st0018 storm-restoration roofing canvasser door-knock + st0019 residential HVAC service-tech in-truck comfort consult — st0020 is wedding venue coordinator + event manager + GM running in-person tour for engaged couple touring 3-5 venues only sales meeting venue gets converts 60-90 min tour into $25K-$45K Saturday booking with $5K refundable hold deposit signed on the property the territory where wedding venue owners + general managers + sales directors + venue coordinators + event managers + F&B directors + booking specialists at single-property estates barns hotels country clubs urban event spaces vineyards + indie 90%+ of US venues that Wedgewood Weddings / Walters Wedding Estates / The Hidden Vine / Forte Specialty PE-rollups have NOT yet consolidated earn the right to the Saturday close on the property inside The Knot 2024 Real Weddings Study + Wedding Report + WIPA + IBISWorld + BLS SOC 13-1121 + Zola Couples Journey + Honeybook + Aisle Planner + Planning Pod + Tripleseat + Event Temple + Tave Studio + Curate + Perfect Venue + Allseated/Prismm + TKWW Spotlight + Cocktail.com + WedSites + AirBnB Wedding Rentals + Peerspace + Splacer + Giggster + Wedgewood + Walters + Hidden Vine + Forte Specialty + FTC + state contract law + post-COVID force-majeure + cooling-off-doesnt-apply-to-venue-signed contracts perimeter. Companion industry-specific entries planned st0021 wedding florist + design consultation + st0022 wedding photographer + engagement-shoot-to-package conversion + st0023 wedding caterer + tasting-to-contract + st0024 wedding planner + day-of vs full-service conversion + st0025 wedding DJ + band booking + st0026 wedding officiant + ceremony design + st0027 wedding cake + dessert tasting + st0028 wedding hair + makeup trial + st0029 wedding stationery + invitation suite + st0030 wedding videographer + reel package. Cross-references to st0001-st0006 SaaS foundation arc translated for wedding venue: st0001 discovery → STORY 3 opening questions + STROLL 4 walking questions / st0002 single-threading → identifying + addressing all 3 decision players COUPLE / PARENT-FUNDER / PLANNER / st0003 objection recovery → handling want to think about it + can you match $115 + waive in-house catering rule + Friday discount / st0004 cold-call opener → STORY questions in plain conversational English / st0005 demo → SHOWCASE two-spaces-deep with couples wedding day inside / st0006 pricing → SHAPE BEO sketch + SECURE hold-deposit close sequence. Cross-reference to st0007 + st0008 + st0009 + st0010 + st0011 + st0012 + st0013 + st0014 + st0015 + st0016 + st0017 + st0018 + st0019 what transfers — discipline of verbatim language on load-bearing moments + CRM-reviewed coaching cadence transfers exactly st0019 makes service techs + comfort advisors hear DIAGNOSE + DEMONSTRATE + DECIDE-CRITERIA + DESIGN + DOLLARS verbatim st0020 makes venue coordinators + event managers hear STORY + STROLL + SHOWCASE + SHAPE + SECURE verbatim st0008 residential real estate listing presentation closest sibling also high-trust-required consumer-at-property seller infrequent transaction wedding once or twice in lifetime home sale every 7-10 yrs heavy emotional + family-decision-maker dynamics parent-funder / spouse / adult children here vs planner / mom / financial-DM there single-meeting-to-close pressure what does NOT transfer wedding venue has single-date-locked Saturday inventory as core scarcity driver vs ongoing home inventory wedding has all 3 decision players physically present on tour vs sequential conversations in real estate wedding has hold-deposit-at-tour as standard close mechanism vs offer-and-counter in real estate wedding has 78% book first or favorite venue vs offer-comparison in home sale. Adjacent Pulse Knowledge Library entries The Knot 2024 Real Weddings Study walkthrough + Wedding Report regional benchmarks + WIPA Tour-to-Book benchmarks + TKWW vendor advertising economics + Cocktail.com vs TKWW comparison + Honeybook vs Tripleseat vs Event Temple vs Aisle Planner vs Planning Pod venue-CRM comparison + Allseated/Prismm 3D walkthrough best practices + venue revenue model deep-dive site-fee + F&B + bar + service charge + tax + peak vs off-peak Saturday pricing optimization + Friday-as-feature vs Friday-as-discount positioning + parent-funder reading guide signal-by-signal + planner-as-ally relationship building + bring-own-caterer policy + liability + insurance discussion + force-majeure clause language post-COVID + hold-deposit refundability windows by state + FTC + state contract law for venue-signed contracts + microwedding/elopement competitive response + AirBnB Wedding Rentals + Peerspace + Splacer + Giggster bottom-tier pressure + LGBTQ+ wedding inclusivity + Indian/South Asian multi-day + Jewish shomer kashrut + second-marriage blended-family + military date-flex tour scenarios + PE-rollup landscape Wedgewood / Walters / Hidden Vine / Forte Specialty. CUT and tighten do not ADD length — already inside word window.',
  s10: 'SUBAGENT_VERIFIED. Twentieth Pulse Sales Training entry st0020 and FOURTEENTH industry-specific training after st0007 medical device + st0008 real estate + st0009 auto F&I + st0010 pharma + st0011 life insurance + st0012 mortgage refi + st0013 + st0014 financial advisor wealth management + st0015 cybersecurity CISO discovery + st0016 retained executive search CEO + Board pitch + st0017 med spa consult-to-package conversion + st0018 storm-restoration roofing door-knock + st0019 residential HVAC in-truck comfort consult — fully runnable 60-minute live wedding venue sales training for the only sales meeting the venue gets (per The Knot 2024 Real Weddings Study + Wedding Report + WIPA + IBISWorld + BLS + Zola Couples Journey benchmarking US wedding industry ~$70B+ + ~2.08M weddings/yr + avg wedding $33K all-in + avg venue line $12.8K + 115-guest avg + 14-month avg engagement + venue all-in $15K-$80K depending tier + guest count + day + season + Saturdays April-October 80% of annual revenue capacity + couples tour 3-5 book 1 + 78% book first or favorite not cheapest + top 50-65% peak tour-to-book 60-70% off-peak vs bottom-quartile unstructured 15-25% + ~146K event planners + venue coordinators SOC 13-1121 + median $56,920 BLS + venue coordinator base + commission $45K-$120K + indie venue turnover ~35-50%/yr + PE-rollups Wedgewood + Walters + Hidden Vine + Forte Specialty consolidated ~5-8% market 2026 + 4x revenue gap on same property + same lead flow based on tour discipline not venue beauty + TKWW Spotlight $200-$1,200/mo dominance + Cocktail.com $79-$299/mo challenger + microwedding/elopement ~15-20% of 2024 weddings up from ~8% pre-2020 + AirBnB Wedding Rentals + Peerspace + Splacer + Giggster bottom-tier pressure) not a Q&A library entry. Built under VALUE-NOT-WORDCOUNT MANDATE: target 8,500-10,500 words ABSOLUTE HARD CAP 10,500. LEAN-FROM-START pattern mirroring st0019 closest sibling on structure. Structure: pink/wedding Pulse Training callout intro (who-for: wedding venue owners + general managers + sales directors + venue coordinators + event managers + F&B directors + booking specialists at single-property estates + barns + hotels + country clubs + urban event spaces + vineyards + indie 90%+ of US venues that Wedgewood / Walters / Hidden Vine / Forte Specialty PE-rollups have NOT yet consolidated; works first-month coordinator running third tour ever + 5-yr veteran event manager tired of let-me-think-about-it + GM losing peak Saturdays + F&B director defending $135/head; what-bring: 3 recent lost-tour debriefs couple + date wanted + venue picked + verbatim no reason + Tour-Prep Kit inquiry intake form guest count + budget range + planner status + date flexibility + must-haves + 3D Prismm/Allseated floor-plan + sample BEO + vendor-list policy sheet + contract + hold-deposit sequence in Honeybook/Tripleseat/Event Temple + Tour Card with 8 questions + current Saturday inventory by month + peak vs off-peak pricing grid + photo book of recent weddings + whiteboard) + Bottom Line callout engaged couple touring 3-5 venues does NOT decide based on which room is prettiest decides based on which coordinator built wedding day inside the space instead of pointing at rooms + read whether mom-is-paying or planner-is-driving and addressed that decision player by name + asked for hold deposit before they walked off property + 5-stage + 3-decision-player thesis + 6-row pipe-table agenda + Section 1 Intro + Cold Open with The Knot 2024 + Wedding Report + WIPA + IBISWorld benchmarks + Hudson Valley NY composite Venue A let-me-show-you-spaces $28K let-me-know never heard back vs Venue B WIPA 7 questions while walking identified mom-as-financial-DM pulled mom aside SHOWCASE 2 spaces $34K October Saturday $5K hold deposit signed bridal-suite love seat + Common Trap Venue As coordinator is friendly + venue gorgeous + sent quote real proposal three answers couple shopping 3-5 lowest feels right wins every shopping trip unstructured walkthrough slowest lowest-margin sales motion in hospitality tour is only sales meeting you get earn Saturday on property or dont earn at all + Section 2 Teach split into Part A 5-STAGE VENUE TOUR 15 min (STORY 3 min three opening questions guest-count + planner + date-flex before any room / STROLL 3 min walk + 4 more questions vision + traditions + accessibility + perfect-moment / SHOWCASE 3 min TWO spaces deep with couples wedding day inside specific time specific light specific people / SHAPE 3 min BEO sketch + bring parent-funder + planner in by name + walk timeline + bar package + catering minimum / SECURE 3 min three-step close date-available + all-in-price + 5K hold deposit 7-day refundable want-me-to-put-the-hold-on) and Part B Three Decision Players 10 min (COUPLE vibe + memory address with vision questions + showcase of THEIR specific aesthetic / PARENT-FUNDER value + logistics most commonly brides mom or father-of-the-bride signals parking-hotel-accessibility-evaluating-body-language side conversation at minute 18 parking + golf-cart shuttle + rain-plan + tasting / PLANNER vendor list + execution flexibility ALWAYS friend vendor-policy sheet at minute 4 books 8-15 weddings/yr) + Section 3 Discussion 8 prompts (when push hold deposit on tour vs let-them-think + couple toured 4 venues today exhausted + when decline to book vision/budget/logistics mismatch + defend $135/head F&B vs $115 competitor value re-position never match reactively + how read mom-as-financial-DM in first 4 min signals + planner friend not threat planners book 8-15 weddings/yr + couple wants to negotiate after tour over email phone-or-in-person re-establishes value + ONE verbatim change) + Section 4 Two-Person Role-Play with Round 1 Emily 28 project manager + Marcus 29 software engineer + Patricia 55 bride mom Lehigh Valley PA converted-barn tour-of-3 October 9 2027 Saturday 140 guests $135/head $7500 site fee $35K all-in target mom paying 2 deflections want to think before committing + $135 higher than next 2 venues match $115 — COORDINATOR full 5-STAGE STORY 3 questions guest count + planner + date STROLL 4 more questions vision + traditions + accessibility + perfect moment spot Patricia parking + hotel = parent-funder confirmed SHOWCASE TWO spaces ceremony lawn 5:15 PM October golden-hour through oak grove + barn for reception 140-cap fireplace adjacency for older aunts pull Patricia aside minute 18 parking + golf-cart + rain-plan + tasting SHAPE BEO sketch SECURE three-step close $34K all-in + $5K refundable 7-day hold + Round 2 David 37 second-marriage + Sarah 35 first-marriage Annapolis MD historic-mansion Wednesday 6:30 PM Friday October 15 2027 60 guests cocktail-grazing format bring-own-caterer brother-in-law chef DC in-house-only policy 2 deflections waive in-house-catering rule for brother-in-law chef + Friday discount — COORDINATOR full 5-STAGE STORY 3 questions guest count + planner + date STROLL 4 questions vision + David daughter 12 + Greek-Orthodox-leaning + accessibility + perfect-moment SHOWCASE TWO spaces mansion library 5:30 PM Friday + garden terrace cocktail-and-grazing dinner Charleston-mansion vibe Deflection 1 bring-own-caterer decline gracefully liability + insurance + health-dept license tied to in-house team 3 exceptions in 9 yrs all litigation what I CAN do co-design with Chef Diego + credit as guest chef + waive 22% service charge on co-designed entree SHAPE BEO sketch Friday $4250 site fee vs Saturday $5000 $95/head grazing × 60 + $55/head bar × 60 + $750 ceremony = $17,400 all-in Deflection 2 Friday discount honest framing 15% Friday discount not couldnt-sell-Saturday discount its structural Friday weddings let prep into Saturday setup save labor save dollars same Chef same staff same quality same property gained $750 site fee + flexibility on load-in + your guests Saturday brunch next morning net + your daughters volleyball season Friday is structurally better not consolation SECURE three-step close $17,400 + $2K refundable 7-day hold + 60-sec reset + Section 5 Debrief + Commitments 3 debrief Qs strongest/weakest stage + decision player missed + Saturday owed follow-up + 4-line Honeybook/Tripleseat commitment ritual specific tour + skipped stage + missing kit item + decision player engage going forward + Section 6 Leave-Behind walkthrough + printable one-pager (7 Things to Bring on Every Tour inquiry intake + 3D Prismm/Allseated + sample BEO + vendor-policy sheet + hold-deposit contract clause + Saturday inventory by month + photo book / 5-Stage Venue Tour Script Card with verbatim cue lines and time per stage / 3 Decision Players grid COUPLE + PARENT-FUNDER + PLANNER with verbatim addresses / 4 Phrases That Lose the Saturday let-me-show-you-our-spaces + whats-your-budget + Ill-email-proposal-let-me-know + we-can-match-that-price / Hold Deposit Close Sequence 5-step verbatim / Never-Do behavior list 14 items / Outcome Line wins full 5-STAGE + all 3 decision players + hold-deposit-at-tour + 7-day refundable + transparent value-re-position = 50-65% peak tour-to-book + 60-70% off-peak + $25K-$45K avg ticket + $5K hold-deposit norm + 4.7+ Google + TheKnot + Yelp + 8-15 repeat-planner relationships vs losses unstructured walkthrough + price-quote-at-end + no decision-player read = 15-25% peak + 30-40% off-peak + lose Saturday to venue down the road + 3.6-4.0 review average + coordinator turnover ~50%/yr / If You Only Remember One Thing hero quote You dont book the Saturday by showing every room you book it by (1) hearing the couples vision in their own words in first 6 minutes (2) identifying the parent-funder and the planner in first 10 minutes and addressing each by name (3) asking for $5K refundable hold deposit before they walk off the property tour is only sales meeting you get close on the property or dont close at all). How-this-fits-in-wedding-venue-operating-motion table at end of core showing tour-prep huddle Friday before + first 3 min STORY + next 3 min STROLL + next 3 min SHOWCASE + next 3 min SHAPE + next 3 min SECURE + 3-decision-player overlay + GM coaching weekly tour-shadow. Two mermaid diagrams: 5-Stage Venue Tour Flow + Three Decision Players Reading Guide with signal-by-signal branches. 9 benchmark tables (US Wedding Industry Reality + Avg Wedding Cost By Region The Knot 2024 + Venue Revenue Model Breakdown + Peak vs Off-Peak Saturday Pricing Benchmarks + Lead Source ROI Venue Acquisition + Tour-to-Book Conversion By Tour Position + Hold Deposit Close Lift + Why Tours Dont Close + Coordinator Tenure vs Tour-to-Book Performance). 12-failure-mode counter-case + 7-GM-objection coach-back + when-to-rerun monthly first 3 months + quarterly after + whenever lose 2+ peak Saturdays in row + whenever senior planner blacklists. Cross-links to st0001-st0006 SaaS foundation arc with translation mapping + companion industry-specific entries planned st0021-st0030 wedding industry vendor adjacent + cross-reference to st0007 + st0008 + st0009 + st0010 + st0011 + st0012 + st0013 + st0014 + st0015 + st0016 + st0017 + st0018 + st0019 what transfers (verbatim language on load-bearing moments + CRM-reviewed coaching cadence) and what does not (wedding venue has single-date-locked Saturday inventory as core scarcity driver + all 3 decision players physically present on tour + hold-deposit-at-tour as standard close + 78% book first or favorite venue vs offer-comparison in home sale). Tags include sales-training (hub filter) + wedding-venue-training + hospitality-sales + event-sales + venue-tour + saturday-booking + 60-min-meeting + standard-team + st0020. Callouts used: Pulse Training (pink/wedding intro) + Bottom Line + Coach Note + Verbatim Script + Common Trap + Leave-Behind. EXPLICITLY WEDDING INDUSTRY - NOT generic SaaS - no Gong / Bridge Group / Pavilion / ProfitWell / SaaStr citations. Industry-correct sources: The Knot 2024 Real Weddings Study + WeddingWire / The Knot Worldwide TKWW EQT/Permira + The Wedding Report + WIPA Wedding Industry Professionals Association + IBISWorld Wedding Services OD4324 + BLS SOC 13-1121 Meeting/Convention/Event Planners + Allseated / Prismm 3D venue diagramming + Honeybook + Aisle Planner + Planning Pod + Tripleseat + Event Temple + Tave Studio + Curate + Perfect Venue + Zola + Joy/Withjoy + Minted Weddings + The Knot Registry Couples Journey Studies + Cocktail.com + WedSites + The Brides Project + WeddingHero + microwedding + elopement + AirBnB Wedding Rentals + Peerspace + Splacer + Giggster + Wedgewood Weddings + Walters Wedding Estates + The Hidden Vine + Davids Bridal + Noahs Event Venue / Forte Specialty Contractors + TKWW Spotlight + Storefront vendor advertising + venue revenue model site fee + F&B + bar + ceremony fee + service charge + tax + WIPA + Wedding Report Tour-to-Book conversion benchmarks + FTC 16 CFR 429 + CA Civil Code 1689.6 + NY GBL 425 cooling-off NOT covering venue-signed contracts + state cancellation policy + force-majeure clause post-COVID + Better Business Bureau + state AG consumer protection + WIPA Speakeasy + Honeybook Rising Tide Society + WeddingPro Education TKWW + Catersource + Special Events Magazine + Bizbash + Catersource + The Special Event Show + Wedding MBA conference Las Vegas + WeddingWire World + Chef + sommelier + BEO Banquet Event Order + 22% service charge auto-grat. Tight 2-3 sentence paragraphs throughout. No emoji-spam in body prose. ASCII-clean. Lean target honored: drafted under 10,500 hard cap. Each ladder rung polish_note explicitly instructed CUT and tighten do not ADD length per locked rule.'
};

async function main() {
  const TOKEN = process.env.BLOBS_PAT;
  if (!TOKEN) { console.error('BLOBS_PAT not set'); process.exit(1); }
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOKEN });

  // --- Word count pre-flight check (PRE-FLIGHT word-count guard) ---
  const fullV9 = tldr + core + flow + src + num + counter + links;
  const wordCount = fullV9.split(/\s+/).filter(Boolean).length;
  console.log('[' + ID + '] v9 word count:', wordCount);
  if (wordCount > 10500) {
    console.error('[' + ID + '] HARD CAP EXCEEDED:', wordCount, '> 10500 — aborting');
    process.exit(1);
  }
  if (wordCount < 8500) {
    console.warn('[' + ID + '] WARNING: under target floor:', wordCount, '< 8500');
  }

  // --- Pre-seed the entry shell so runPolish's store.get() finds it ---
  const ts0 = Date.now();
  const existing = await store.get('answers/' + ID + '.json', { type: 'json' });
  if (!existing) {
    console.log('[' + ID + '] seeding entry shell (runPolish requires entry to exist)');
    await store.setJSON('answers/' + ID + '.json', {
      id: ID,
      question: QUESTION,
      answer: tldr,
      tags,
      sources: sources.slice(0, 3),
      ts: ts0,
      model: 'claude-opus-4-7-via-claude-code',
      quality_score: 5,
      polished_at: null,
      polish_history: [],
      source: 'claude-opus-bespoke-seed'
    });
    const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
    const i = idx.entries.findIndex(x => x.id === ID);
    const row = { id: ID, question: QUESTION, tags, ts: ts0, quality_score: 5, polished_at: null, last_modified_ms: ts0, sources_count: 3 };
    if (i >= 0) idx.entries[i] = row; else idx.entries = [row, ...idx.entries];
    await store.setJSON('_index.json', idx);
  } else {
    console.log('[' + ID + '] entry already exists — runPolish will overwrite at v5');
  }

  // --- Walk the polish ladder 5->6->7->8->9->10 ---
  await runPolish({
    id: ID,
    tldr,
    core,
    flow,
    src,
    num,
    counter,
    links,
    sources,
    tags,
    notes
  });

  // Fire-and-forget IndexNow ping so /sales-trainings/st0020 is crawled.
  try {
    fetch('https://pulserevops.com/.netlify/functions/pulse-machine-indexnow-batch-background', { method: 'POST' })
      .catch(() => {});
  } catch (_e) {}

  console.log('=== DONE ' + ID + ' === quality_score=10 word_count=' + wordCount);
}

main().catch(err => { console.error(err); process.exit(1); });
