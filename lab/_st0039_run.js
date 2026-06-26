// st0039 -- The Concession Ledger -- create at qs5 + polish ladder to qs9.
// Direct blob write for shell (pulse-blob-writer rejects st#### ids),
// then POSTs to pulse-blob-polish for 5->6->7->8->9.
const { getStore } = require('@netlify/blobs');
const fs = require('fs');
const path = require('path');
const https = require('https');

const envPath = path.join(__dirname, '..', '.env.local');
const env = {};
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2];
  }
}
const BLOBS_PAT = env.BLOBS_PAT;
const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const STORE = 'pulse-machine-library';
const SHARED_KEY = 'pulsemachine-writer-2026';

const ID = 'st0039';
const QUESTION = "The Concession Ledger: Trading (Never Giving) Every Discount in the Final Negotiation So You Land the Deal Without Gutting Margin — a 60-Minute Sales Training";

const tags = [
  'sales-training',
  'concession-ledger-training',
  'sales-negotiation',
  'discounting-discipline',
  'concession-trading',
  'margin-defense',
  'deal-desk',
  'give-get',
  'closing-negotiation',
  'b2b-sales-coaching',
  'revops',
  '60-min-meeting',
  'standard-team',
  'st0039'
];

const sources = [
  { title: 'Negotiation research baseline -- "Getting to Yes" (Roger Fisher & William Ury, Harvard Negotiation Project, 1981/2011 3rd ed) + "Never Split the Difference" (Chris Voss, 2016) + "Bargaining for Advantage" (G. Richard Shell, Wharton, 2006) + Harvard Program on Negotiation (PON) -- the principled-negotiation and tactical-empathy canon underpinning concession discipline: BATNA (Best Alternative To a Negotiated Agreement) as the source of walk-away power; the principle that unilateral concessions train the counterparty to keep asking; anchoring and the contrast effect; the give-get rule that every concession must be conditional and reciprocal; Shell\'s research that negotiators who concede in small, slowing increments and label each concession as costly capture materially more value than those who concede in large early jumps.', url: 'https://www.pon.harvard.edu/' },
  { title: 'B2B SaaS discounting benchmarks -- OpenView Partners SaaS Benchmarks, KeyBanc Capital Markets (KBCM) SaaS Survey, Pacific Crest/KBCM, RevOps Co-op, Gong Labs revenue-intelligence research, and CSO Insights / Korn Ferry sales-performance studies: average B2B software discount off list runs ~20-30% with a long tail of 40%+ on competitive enterprise deals; deals discounted more than ~20% off list show measurably lower net revenue retention and higher churn in year two because price sets the customer\'s value anchor; Gong call-analysis finds discount language introduced before value is quantified correlates with larger final discounts and longer cycles; end-of-quarter deals close at systematically deeper discounts when reps lack a concession framework.', url: 'https://openviewpartners.com/expansion-saas-benchmarks/' },
  { title: 'Deal desk, CPQ, and pricing-governance practice -- Salesforce CPQ / Revenue Cloud, DealHub, Subscript, and RevOps deal-desk operating models: the discount-approval matrix (rep-authority band, manager band, VP band, CFO/deal-desk band); the role of a deal desk in enforcing concession reciprocity (multi-year term, prepayment, case-study rights, reference calls, logo rights, expansion commitments, reduced payment terms, narrowed scope) rather than price-only giveaways; price-floor and margin-floor governance; the standard finding that deals routed through a deal desk with a concession-trade requirement protect 3-8 points of gross margin versus rep-discretion discounting.', url: 'https://www.salesforce.com/products/cpq/overview/' },
  { title: 'Sales-methodology and value-selling sources -- MEDDICC / MEDDPICC (Darius Lahoutifard, Force Management Command of the Message and Value Negotiation, Winning by Design), Challenger Sale (Matthew Dixon & Brent Adamson, CEB/Gartner), and the value-selling literature: the principle that price objections are value-quantification failures; ROI and business-case construction as the precondition for holding price; the Challenger finding that negotiation outcomes are largely determined before the negotiation table by how well economic value was framed; Force Management Value Negotiation guidance that concessions must map to a documented decision criteria and metrics, never to pressure.', url: 'https://www.forcemanagement.com/' },
  { title: 'Procurement-side perspective -- the buyer playbook taught to professional purchasers (CIPS Chartered Institute of Procurement & Supply, ISM Institute for Supply Management, and common enterprise-procurement negotiation tactics): the "flinch," the "higher authority," the "nibble," the "good cop / bad cop," the deadline squeeze, the false competitor quote, and the budget-anchor; understanding that procurement is professionally measured on savings captured, which is why a seller\'s unilateral concession is logged and benchmarked and used as the new floor in the next renewal.', url: 'https://www.cips.org/' }
];

// ---- baseline (qs5) answer ----
const BASE = `> ### Pulse Sales Training -- The Concession Ledger
> **Who this is for:** B2B account executives, senior sellers, sales managers, and deal-desk partners who reach the final negotiation -- the redline, the price ask, the procurement call -- and need to land the deal without giving away gross margin. This is a 60-minute sales-team meeting your manager runs, not a webinar. Run it before quarter-end, before any large deal enters legal, and before procurement gets involved.
>
> **The core idea:** A concession is not a gift. It is a trade. Every reduction in price, every added term, every shortened payment window must be exchanged for something of equal or greater value to your company -- a longer term, a prepayment, a reference, a case study, an expansion commitment, a faster signature. Reps who *give* concessions train the buyer to keep asking. Reps who *trade* concessions land the deal and protect the number. The discipline tool is a written Concession Ledger: a two-column running list of every give and every get, kept visibly during the negotiation so nothing leaves the table for free.

## MEETING AGENDA -- 60 MINUTES

| Time | Block | Owner | Outcome |
|------|-------|-------|---------|
| **0:00-0:08** | **Intro + Cold Open** -- two reps, same deal: one discounts 18% unilaterally to "save the quarter," one trades every point and lands at 6% off for a 3-year prepaid term | Manager | The room sees that trading beats giving on both price and close rate |
| **0:08-0:30** | **The Teach** -- the 5-step TRADE method (Tag, Reframe, Anchor, Deal, Earn-it) + the 4 concession traps + the give/get menu + the discount-authority ladder | Manager | Every rep can recite TRADE and name 6 non-price gets |
| **0:30-0:40** | **Discussion** -- 8 prompts: end-of-quarter pressure, procurement tactics, when to walk, the "your competitor is cheaper" line, splitting the difference | Manager + room | Audit last 10 closed deals by discount depth and what was traded |
| **0:40-0:54** | **Role-Play x2** -- R1: VP of Procurement squeezing on price at quarter-end; R2: a champion asking for a "friendly" discount to get it past their CFO | Pairs | Run TRADE live under two buyer archetypes |
| **0:54-0:58** | **Debrief + Commitments** -- strongest step, weakest step, one trap each rep owns, one concession each rep gave for free last quarter | Manager | A trade-don't-give habit and a personal commitment |
| **0:58-1:00** | **Leave-Behind** -- the Concession Ledger card + the give/get menu + the discount-authority ladder go in every rep's deal folder | Manager | One page on every desk |

> ### Bottom Line
> A buyer does not respect you more for caving. Procurement is *measured* on the savings they extract -- your unilateral discount becomes their logged win and next year's price floor. You hold margin by making every concession conditional, reciprocal, slow, and visibly costly. Trade, never give. Land the deal *and* the number.

---

## SECTION 1 -- INTRO + COLD OPEN (0:00-0:08)

Open with the story, not the slide. Two reps. Same product, same list price, same quarter-end deadline.

**Rep A** got a price ask in the final week: "We love it, but we need a better number." Rep A wanted the deal in the quarter, so Rep A said, "Let me see what I can do" -- and came back with 18% off. The buyer took it, then asked for net-60 payment terms too. Rep A gave that as well. The deal closed at 18% off, net-60, one-year term. The customer's renewal a year later anchored to that discounted price and asked for more.

**Rep B** got the same ask. Rep B did not move on price first. Rep B said: "I can find room on price, but not for free -- tell me what flexibility you have on term length and payment timing, and I'll build something that works for both of us." Rep B traded: 6% off the list price *in exchange for* a 3-year term and annual prepayment. The deal closed at 6% off, prepaid, 3 years locked. Higher total contract value, higher margin, a customer anchored to near-list pricing, and a renewal already secured.

Same deal. The difference was not skill at "selling." The difference was that Rep B treated every concession as a trade and kept a ledger. That is the entire meeting.

\`\`\`mermaid
flowchart TD
  A[Buyer asks for a lower price] --> B{Do you have a Concession Ledger?}
  B -->|No| C[Give discount to save the quarter]
  C --> D[Buyer asks for more: terms, scope, payment]
  D --> E[Margin gutted + renewal anchored low]
  B -->|Yes| F[TRADE: Tag the ask as costly]
  F --> G[Reframe to value + total cost]
  G --> H[Anchor: name a get before any give]
  H --> I[Deal: concede small, slow, conditional]
  I --> J[Earn-it: get is signed alongside the give]
  J --> K[Deal closed + margin held + renewal protected]
\`\`\`

---

## SECTION 2 -- THE TEACH (0:08-0:30)

The negotiation is mostly decided before the negotiation. If you quantified value and built a business case, you arrive with leverage. If you led with features and price, you arrive defenseless. Assume you did the work -- now hold the line with the **TRADE** method.

### The TRADE Method

**T -- Tag the ask as costly.** When the buyer asks for a discount, do not react and do not move. Name the ask as significant: "A price change of that size is a real decision on our side -- it has to go through approval, and it has to be matched by something." Tagging slows the negotiation and signals that price does not move for free.

**R -- Reframe to value and total cost.** Pull the conversation off the line-item price and back to the business case and the total cost of the relationship. "Before we talk about the number, let us re-confirm the value -- you said this saves your team roughly X hours a month. The price question is really a value question."

**A -- Anchor with a get before any give.** Never state a discount first. State what you need in return first: "If we can find price flexibility, here is what would make that possible on our side -- a longer term, prepayment, a reference, a case study." You anchor the trade before you anchor the number.

**D -- Deal in small, slow, conditional steps.** Concede in shrinking increments, never in one large jump, and always conditionally: "*If* you can commit to three years, *then* I can take 6% off." The word "if" is the most important word in the negotiation. A concession without an "if" is a gift.

**E -- Earn-it: the get is signed alongside the give.** A promised "get" that is not in the contract is not a get. The reference commitment, the prepayment, the term -- all of it lands in the signed agreement at the same moment the discount does. If the get slips out of the paperwork, the give comes back out too.

### The 4 Concession Traps

1. **The unilateral give.** Moving on price without asking for anything. Trains the buyer to keep asking. This is the single most expensive habit in B2B selling.
2. **Splitting the difference.** "You are at 100, I am at 120, let us meet at 110." It feels fair and is purely reflexive -- it concedes half your remaining position for nothing.
3. **The fast, large jump.** Going straight to your best price to "save time." It signals every prior number was inflated and invites the buyer to push past your floor.
4. **The unwritten get.** Trading a discount for a verbal promise of a reference or expansion that never makes it into the contract. By renewal, the get has evaporated and the discount is permanent.

### The Give / Get Menu -- six non-price gets

Multi-year term commitment; annual or multi-year prepayment; a named reference and reference calls; a published case study and logo rights; an expansion or cross-sell commitment with dates; a faster signature and a tighter close date. Price is the *last* lever, never the first.

### The Discount-Authority Ladder

Reps hold a small band of discretion; managers hold the next band; VP or deal desk holds the next; CFO or deal desk holds anything below the margin floor. Knowing your band is power: "That number is below what I can approve -- which means it has to be earned with term and prepayment, and it still has to clear my VP." The ladder is not bureaucracy; it is cover. "Higher authority" is a legitimate, honest brake on a runaway concession.

---

## SECTION 3 -- THE DISCUSSION (0:30-0:40)

Whiteboard the last 10 closed deals: discount depth, and what -- if anything -- was traded for it. Then work the prompts.

1. **End-of-quarter pressure -- who actually needs the deal more?** Your urgency is visible to the buyer. Discuss how to keep quarter-end pressure off your face and voice.
2. **"Your competitor is cheaper."** Is it a real, comparable quote, or an anchor? How do you ask to see it without calling the buyer a liar?
3. **Procurement's standard tactics.** The flinch, the nibble, the higher authority, the fake deadline. Name the ones you saw last quarter.
4. **When do you walk?** No budget authority, no business case, demands below the margin floor with no get on offer -- name your walk-away triggers.
5. **Splitting the difference -- why it feels fair and is not.** Practice the line that refuses the split without breaking rapport.
6. **The "friendly" discount from a champion.** Your champion is on your side but wants a discount to look good internally. How do you arm them without caving?
7. **The nibble after verbal yes.** "Great, we are in -- just throw in onboarding for free." How do you trade even the small asks?
8. **One concession you gave for free last quarter.** Each rep names one. No judgment -- just naming it.

---

## SECTION 4 -- ROLE-PLAY x2 (0:40-0:54)

Pair up. Two scenarios, about 7 minutes each, 60-second reset between.

### Role-Play 1 -- VP of Procurement, quarter-end squeeze (7 min)

**Setup:** Dana Whitfield, VP of Procurement at a mid-market logistics company, on the phone in the final week of your quarter. The deal is verbally approved by the business owner. Dana opens with: "Your number is 22% over what we benchmarked. I have two other vendors at lower prices. If you want this signed before your quarter closes, I need your best and final today." The rep must run TRADE: tag the ask, reframe to value and total cost, anchor a get (multi-year term, prepayment), concede in small conditional steps, and get the term into the paperwork alongside any discount.

### Role-Play 2 -- the "friendly" champion discount (7 min)

**Setup:** Marcus Bell, your champion and the VP of Operations who wants to buy. Marcus says: "I am fighting for you internally, but my CFO will not sign at this price. Give me something I can take to him -- even 15% -- and I will get it through." The champion is genuinely on your side, which makes the unilateral give tempting. The rep must arm the champion with a *traded* concession (a smaller discount tied to a 3-year term and a reference) and the value language the champion can carry to the CFO.

> Coach note: in both role-plays, listen for the word "if." If the rep concedes without an "if," stop the role-play and reset. Listen also for whether the rep states a number before stating a get -- that is the most common failure.

---

## SECTION 5 -- DEBRIEF + COMMITMENTS (0:54-0:58)

Three quick questions, then commitments.

1. **Strongest TRADE step? Weakest?** Most rooms are strong on Tag and weak on Earn-it -- they trade well verbally but let the get fall out of the contract.
2. **Which of the 4 traps is yours?** Each rep names one out loud.
3. **One concession you gave for free last quarter, and what you should have traded for it.** Specific deal, specific get.

Commitment: every rep names one open deal and the get they will require before any price movement on it this week.

---

## SECTION 6 -- LEAVE-BEHIND (0:58-1:00)

Hand out the one-page card. It has three things: the **TRADE** method (Tag, Reframe, Anchor, Deal, Earn-it); the **give/get menu** (the six non-price gets); and the **discount-authority ladder** (your band, manager band, VP/deal-desk band, CFO/floor band). The card goes in every rep's deal folder. The rule on the card, in one line: **Never give a concession. Trade it -- small, slow, conditional, and in writing.**`;

// =========================================================================
function postPolish(payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const req = https.request({
      hostname: 'pulserevops.com',
      path: '/.netlify/functions/pulse-blob-polish',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  const mode = process.argv[2];
  const store = getStore({ name: STORE, siteID: SITE_ID, token: BLOBS_PAT });

  if (mode === 'shell') {
    const ts = Date.now();
    const entry = {
      id: ID, question: QUESTION, answer: BASE, tags, sources,
      ts, model: 'claude-opus-4-7-via-claude-code',
      quality_score: 5, polished_at: null, polish_history: []
    };
    await store.setJSON('answers/' + ID + '.json', entry);
    const idx = await store.get('_index.json', { type: 'json' });
    idx.entries = idx.entries.filter(e => e.id !== ID);
    idx.entries.unshift({ id: ID, question: QUESTION, tags, ts, quality_score: 5, polished_at: null });
    await store.setJSON('_index.json', idx);
    console.log('SHELL WRITTEN: ' + ID + ' qs5  answer chars=' + BASE.length);
    return;
  }

  if (mode === 'verify') {
    const e = await store.get('answers/' + ID + '.json', { type: 'json' });
    console.log('id=' + e.id + ' qs=' + e.quality_score + ' chars=' + e.answer.length +
      ' polish_history=' + (e.polish_history ? e.polish_history.length : 0));
    return;
  }

  if (mode === 'final') {
    const e = await store.get('answers/' + ID + '.json', { type: 'json' });
    console.log('=== FINAL qs=' + e.quality_score + ' ===');
    console.log(e.answer);
    return;
  }
}

main().catch(e => { console.error('ERR', e); process.exit(1); });
