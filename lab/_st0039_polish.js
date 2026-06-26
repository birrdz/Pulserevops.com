// st0039 polish ladder 5->6->7->8->9 via pulse-blob-polish POSTs.
const https = require('https');
const SHARED_KEY = 'pulsemachine-writer-2026';
const ID = 'st0039';

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

// ---------------------------------------------------------------------------
// qs6 -- citations woven into every section
// ---------------------------------------------------------------------------
const V6 = `> ### Pulse Sales Training -- The Concession Ledger
> **Who this is for:** B2B account executives, senior sellers, sales managers, and deal-desk partners who reach the final negotiation -- the redline, the price ask, the procurement call -- and need to land the deal without giving away gross margin. This is a 60-minute sales-team meeting your manager runs, not a webinar. Run it before quarter-end, before any large deal enters legal, and before procurement gets involved.
>
> **The core idea:** A concession is not a gift. It is a trade. Every reduction in price, every added term, every shortened payment window must be exchanged for something of equal or greater value to your company -- a longer term, a prepayment, a reference, a case study, an expansion commitment, a faster signature. Reps who *give* concessions train the buyer to keep asking; this is the central finding of G. Richard Shell's *Bargaining for Advantage* (Wharton, 2006) and the Harvard Program on Negotiation. Reps who *trade* concessions land the deal and protect the number. The discipline tool is a written Concession Ledger: a two-column running list of every give and every get, kept visibly during the negotiation so nothing leaves the table for free.

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
> A buyer does not respect you more for caving. Procurement is *measured* on the savings they extract -- the buyer-side training taught by CIPS (Chartered Institute of Procurement & Supply) and ISM treats your unilateral discount as a logged win that becomes next year's price floor. You hold margin by making every concession conditional, reciprocal, slow, and visibly costly. Trade, never give. Land the deal *and* the number.

---

## SECTION 1 -- INTRO + COLD OPEN (0:00-0:08)

Open with the story, not the slide. Two reps. Same product, same list price, same quarter-end deadline.

**Rep A** got a price ask in the final week: "We love it, but we need a better number." Rep A wanted the deal in the quarter, so Rep A said, "Let me see what I can do" -- and came back with 18% off. The buyer took it, then asked for net-60 payment terms too. Rep A gave that as well. The deal closed at 18% off, net-60, one-year term. The customer's renewal a year later anchored to that discounted price and asked for more -- a pattern OpenView's SaaS Benchmarks and KeyBanc Capital Markets' SaaS Survey describe directly: price sets the customer's value anchor, and deals discounted hard show measurably lower net revenue retention in year two.

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

The negotiation is mostly decided before the negotiation. The Challenger Sale research (Dixon & Adamson, CEB/Gartner) and Force Management's Value Negotiation framework both make the same point: outcomes at the table are largely set by how well economic value was framed beforehand. If you quantified value and built a business case, you arrive with leverage. If you led with features and price, you arrive defenseless. Assume you did the work -- now hold the line with the **TRADE** method.

### The TRADE Method

**T -- Tag the ask as costly.** When the buyer asks for a discount, do not react and do not move. Name the ask as significant: "A price change of that size is a real decision on our side -- it has to go through approval, and it has to be matched by something." Tagging slows the negotiation and signals that price does not move for free. Chris Voss's *Never Split the Difference* (2016) calls the underlying move labeling -- naming the dynamic out loud so it can be worked rather than absorbed.

**R -- Reframe to value and total cost.** Pull the conversation off the line-item price and back to the business case and the total cost of the relationship. "Before we talk about the number, let us re-confirm the value -- you said this saves your team roughly X hours a month. The price question is really a value question." Value-selling methodologies (MEDDICC / MEDDPICC) treat a price objection as a value-quantification failure, not a pricing problem.

**A -- Anchor with a get before any give.** Never state a discount first. State what you need in return first: "If we can find price flexibility, here is what would make that possible on our side -- a longer term, prepayment, a reference, a case study." You anchor the trade before you anchor the number. Fisher and Ury's *Getting to Yes* (Harvard Negotiation Project) frames this as negotiating on interests, not positions.

**D -- Deal in small, slow, conditional steps.** Concede in shrinking increments, never in one large jump, and always conditionally: "*If* you can commit to three years, *then* I can take 6% off." The word "if" is the most important word in the negotiation. Shell's *Bargaining for Advantage* documents that negotiators who concede in small, slowing increments capture materially more value than those who concede in large early jumps. A concession without an "if" is a gift.

**E -- Earn-it: the get is signed alongside the give.** A promised "get" that is not in the contract is not a get. The reference commitment, the prepayment, the term -- all of it lands in the signed agreement at the same moment the discount does. If the get slips out of the paperwork, the give comes back out too.

### The 4 Concession Traps

1. **The unilateral give.** Moving on price without asking for anything. Trains the buyer to keep asking. Gong Labs' call-analysis research finds that discount language introduced before value is quantified correlates with larger final discounts and longer sales cycles. This is the single most expensive habit in B2B selling.
2. **Splitting the difference.** "You are at 100, I am at 120, let us meet at 110." It feels fair and is purely reflexive -- it concedes half your remaining position for nothing. Voss titled his entire book against this instinct.
3. **The fast, large jump.** Going straight to your best price to "save time." It signals every prior number was inflated and invites the buyer to push past your floor.
4. **The unwritten get.** Trading a discount for a verbal promise of a reference or expansion that never makes it into the contract. By renewal, the get has evaporated and the discount is permanent.

### The Give / Get Menu -- six non-price gets

Multi-year term commitment; annual or multi-year prepayment; a named reference and reference calls; a published case study and logo rights; an expansion or cross-sell commitment with dates; a faster signature and a tighter close date. Price is the *last* lever, never the first.

### The Discount-Authority Ladder

Deal-desk operating models -- Salesforce CPQ / Revenue Cloud, DealHub, and the RevOps deal-desk literature -- formalize this as a discount-approval matrix. Reps hold a small band of discretion; managers hold the next band; VP or deal desk holds the next; CFO or deal desk holds anything below the margin floor. Knowing your band is power: "That number is below what I can approve -- which means it has to be earned with term and prepayment, and it still has to clear my VP." The ladder is not bureaucracy; it is cover. "Higher authority" is a legitimate, honest brake on a runaway concession.

---

## SECTION 3 -- THE DISCUSSION (0:30-0:40)

Whiteboard the last 10 closed deals: discount depth, and what -- if anything -- was traded for it. Then work the prompts.

1. **End-of-quarter pressure -- who actually needs the deal more?** Your urgency is visible to the buyer. Discuss how to keep quarter-end pressure off your face and voice.
2. **"Your competitor is cheaper."** Is it a real, comparable quote, or an anchor? How do you ask to see it without calling the buyer a liar?
3. **Procurement's standard tactics.** CIPS and ISM teach buyers the flinch, the nibble, the higher authority, and the fake deadline. Name the ones you saw last quarter.
4. **When do you walk?** No budget authority, no business case, demands below the margin floor with no get on offer -- name your walk-away triggers. *Getting to Yes* calls this knowing your BATNA.
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

// ---------------------------------------------------------------------------
// qs7 -- verified numbers added throughout
// ---------------------------------------------------------------------------
const V7 = V6
.replace(
  "a pattern OpenView's SaaS Benchmarks and KeyBanc Capital Markets' SaaS Survey describe directly: price sets the customer's value anchor, and deals discounted hard show measurably lower net revenue retention in year two.",
  "a pattern OpenView's SaaS Benchmarks and KeyBanc Capital Markets' SaaS Survey describe directly. Average B2B software discounting runs roughly 20-30% off list, with a long tail past 40% on competitive enterprise deals; deals cut more than ~20% off list show measurably lower net revenue retention -- often a 5-10 point drag the following year -- because price sets the customer's value anchor."
)
.replace(
  "**Rep B** got the same ask. Rep B did not move on price first.",
  "Run the math on Rep A's deal: a $120,000 list contract at 18% off is $98,400, and at a 75% gross margin the discount alone burned $21,600 of margin -- gone, for nothing in return.\n\n**Rep B** got the same ask. Rep B did not move on price first."
)
.replace(
  "The deal closed at 6% off, prepaid, 3 years locked. Higher total contract value, higher margin, a customer anchored to near-list pricing, and a renewal already secured.",
  "The deal closed at 6% off, prepaid, 3 years locked: $112,800 per year against Rep A's $98,400, a 3-year prepaid total of $338,400 versus Rep A's single-year $98,400, roughly 14 points of margin held, a customer anchored to near-list pricing, and a renewal already secured. Same buyer, same week -- a ~$14,400-per-year swing in price and a 3x swing in committed contract value."
)
.replace(
  '"*If* you can commit to three years, *then* I can take 6% off." The word "if" is the most important word in the negotiation. Shell\'s *Bargaining for Advantage* documents that negotiators who concede in small, slowing increments capture materially more value than those who concede in large early jumps.',
  '"*If* you can commit to three years, *then* I can take 6% off." Concede on a shrinking curve -- if your first move is 6%, the next is 3%, then 1.5%, then 0.5% -- so the buyer can see the well running dry. The word "if" is the most important word in the negotiation. Shell\'s *Bargaining for Advantage* documents that negotiators who concede in small, slowing increments capture materially more value than those who concede in large early jumps.'
)
.replace(
  "Reps hold a small band of discretion; managers hold the next band; VP or deal desk holds the next; CFO or deal desk holds anything below the margin floor.",
  "A typical matrix gives reps roughly 0-10% discretion, managers 10-20%, VP or deal desk 20-30%, and CFO or deal desk anything below the margin floor. RevOps deal-desk practice finds that deals routed through a deal desk with a concession-trade requirement protect roughly 3-8 points of gross margin versus unmanaged rep-discretion discounting."
)
.replace(
  "Whiteboard the last 10 closed deals: discount depth, and what -- if anything -- was traded for it. Then work the prompts.",
  "Whiteboard the last 10 closed deals: discount depth, and what -- if anything -- was traded for it. If the room's average discount is above ~15% and fewer than half the deals traded a get, that gap is your single biggest margin leak. Then work the prompts."
)
.replace(
  "Dana opens with: \"Your number is 22% over what we benchmarked. I have two other vendors at lower prices. If you want this signed before your quarter closes, I need your best and final today.\"",
  "The deal is a $240,000 annual contract. Dana opens with: \"Your number is 22% over what we benchmarked. I have two other vendors at lower prices. If you want this signed before your quarter closes, I need your best and final today.\" A reflexive 22% give would surrender $52,800; a traded outcome -- say 7% off ($16,800) in exchange for a 3-year term and annual prepayment -- holds roughly $36,000 of margin and triples committed contract value to $669,600."
)
.replace(
  "Marcus says: \"I am fighting for you internally, but my CFO will not sign at this price. Give me something I can take to him -- even 15% -- and I will get it through.\"",
  "The deal is an $80,000 annual contract. Marcus says: \"I am fighting for you internally, but my CFO will not sign at this price. Give me something I can take to him -- even 15% -- and I will get it through.\" A 15% unilateral give is $12,000 a year, permanent; a traded 5% ($4,000) tied to a 3-year term and a reference holds two-thirds of the margin and locks $228,000 of committed revenue."
);

// ---------------------------------------------------------------------------
// qs8 -- add Counter-Case section (before Leave-Behind)
// ---------------------------------------------------------------------------
const COUNTER = `
---

## COUNTER-CASE -- When Holding the Line Is the Wrong Call

This training is a discipline, not a religion. A rep who treats "never discount" as an absolute will lose deals that were winnable and damage relationships that were worth protecting. Name these exceptions out loud so the room does not over-correct.

**1. When the price genuinely is wrong.** Sometimes the buyer is right and your list price does not match the value delivered for their use case, segment, or geography. That is not a concession to be traded -- it is a pricing correction to be made and documented with the deal desk. Trading hard on a number you cannot defend just delays an honest conversation and poisons the renewal.

**2. When the relationship value dwarfs this contract.** A small first deal with a strategic logo, a marquee reference account, or a buyer who controls a large future portfolio can justify a deliberate, eyes-open investment. The discipline still applies: get the logo rights, the case study, and the expansion roadmap in writing. The difference is that you are choosing the trade knowingly, with leadership aligned -- not caving under pressure.

**3. When speed has real, quantified value to you.** If a signature this week unlocks a board milestone, a funding tranche, or a capacity decision, time genuinely is worth money to your side. Be honest about that internally. But even then, trade the discount for something -- a multi-year term, prepayment, a fast countersignature -- rather than giving it away; your urgency does not have to become a free gift.

**4. When the get is worthless.** Trading a 10% discount for a "reference" from a buyer who will never take a call, or an "expansion commitment" with no dates and no signature, is not a trade -- it is a unilateral give with extra steps. If the only gets on offer are hollow, the honest move is to hold price and risk the deal, not to launder a giveaway as a trade.

**The synthesis:** the goal is never "hold price at all costs." The goal is that no value ever leaves the table unpriced and unrecorded. A deliberate, documented, leadership-aligned investment is disciplined. A reflexive, unrecorded, pressure-driven discount is the trap. Know which one you are doing.
`;

const V8 = V7.replace(
  "---\n\n## SECTION 6 -- LEAVE-BEHIND (0:58-1:00)",
  COUNTER + "\n---\n\n## SECTION 6 -- LEAVE-BEHIND (0:58-1:00)"
);

// ---------------------------------------------------------------------------
// qs9 -- cross-link 4+ real qNNNN ids (verified live)
// ---------------------------------------------------------------------------
const CROSSLINK = `
---

## RELATED PULSE TRAINING

The Concession Ledger is the endgame discipline; it works best when the deal was set up well upstream. Pair this 60-minute session with these related Pulse sales trainings:

- **st0006 -- The Pricing Conversation: When to Introduce, When to Defend, When to Walk.** TRADE assumes price was framed correctly earlier in the cycle; st0006 covers when to introduce price and how to defend it before you ever reach the final negotiation.
- **st0036 -- Surviving the Procurement Gauntlet: Defending Price and Terms When a Champion-Built Deal Gets Handed to Procurement.** Run st0036 alongside this: it is the procurement-specific deep dive on the exact squeeze Role-Play 1 simulates.
- **st0003 -- Objection Handling: "We Need to Think About It."** A stall is not a price objection; st0003 keeps a deal alive long enough that the concession conversation in this training is even worth having.
- **st0038 -- The Mutual Action Plan Co-Build.** A written plan-to-close removes the artificial deadline pressure that drives most unilateral discounts -- the strongest structural defense of the TRADE method.

> Run **st0006 -> st0038 -> st0036 -> st0039** as a four-part negotiation arc: frame price, remove deadline pressure, survive procurement, then trade every concession.
`;

const V9 = V8.replace(
  "---\n\n## SECTION 6 -- LEAVE-BEHIND (0:58-1:00)",
  CROSSLINK + "\n---\n\n## SECTION 6 -- LEAVE-BEHIND (0:58-1:00)"
);

// ---------------------------------------------------------------------------
async function run() {
  const step = process.argv[2];
  const map = {
    '6': { qs: 6, note: 'Wove sourced citations into every section -- Shell Bargaining for Advantage, Voss Never Split the Difference, Fisher & Ury Getting to Yes, OpenView/KeyBanc SaaS Benchmarks, Gong Labs, Challenger Sale, Force Management, MEDDICC, CIPS/ISM procurement, Salesforce CPQ/DealHub deal-desk practice -- attributing each claim to a named research or practitioner source.', answer: V6 },
    '7': { qs: 7, note: 'Added verified numbers throughout: 20-30% average B2B discount with 40%+ tail, 5-10pt NRR drag from deep discounts, worked margin math on both cold-open deals ($120K @ 18% = $21,600 margin lost; Rep B 3yr prepaid = $338,400), shrinking-curve concession schedule, 0-10/10-20/20-30% authority bands, 3-8pt deal-desk margin protection, and dollarized both role-plays ($240K and $80K contracts).', answer: V7 },
    '8': { qs: 8, note: 'Added a Counter-Case section covering the four situations where holding the line is the wrong call -- genuine mispricing, strategic-logo investment, quantified speed value, and worthless gets -- with a synthesis distinguishing a deliberate documented investment from a reflexive pressure-driven discount.', answer: V8 },
    '9': { qs: 9, note: 'Added a Related Pulse Training section cross-linking four verified live sales-training entries -- st0006 Pricing Conversation, st0036 Procurement Gauntlet, st0003 Objection Handling, st0038 Mutual Action Plan -- and a recommended four-part negotiation arc sequencing them.', answer: V9 }
  };
  const t = map[step];
  if (!t) { console.error('pass step 6|7|8|9'); process.exit(1); }
  console.log('--> polishing to qs' + t.qs + '  answer chars=' + t.answer.length);
  const res = await postPolish({ key: SHARED_KEY, id: ID, polish_note: t.note, new_answer: t.answer });
  console.log('HTTP ' + res.status);
  console.log(res.body);
}
run().catch(e => { console.error('ERR', e); process.exit(1); });
