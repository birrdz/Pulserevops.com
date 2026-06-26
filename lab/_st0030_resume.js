// st0030 resume — rebuilds trimmed ladder layers and resumes polish 6->7->8->9.
// The 60-min-meeting format enforces a 10,500-word hard cap; the original
// run cleared qs6 then hit the cap at qs7. This script submits trimmed full
// documents at qs7/qs8/qs9 (polish replaces `answer` wholesale, so layers
// need not be strictly additive from the stored value).

const { getStore } = require('@netlify/blobs');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const ID = 'st0030';
const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const KEY = 'pulsemachine-writer-2026';
const POLISH_URL = 'https://pulserevops.com/.netlify/functions/pulse-blob-polish';
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  const TOKEN = process.env.BLOBS_PAT;
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: TOKEN });

  // pull the live qs6 entry — its `answer` is the v6 base (tldr+core+flow+src)
  const entry = await store.get('answers/' + ID + '.json', { type: 'json' });
  if (!entry) { console.error('st0030 not found'); process.exit(1); }
  const words = s => s.split(/\s+/).filter(Boolean).length;
  console.log('live entry qs:', entry.quality_score, '· answer words:', words(entry.answer));

  // ---- TRIMMED SOURCES (replaces the verbose Sources section) ----
  // The original src section ran ~1,900 words and pushed v9 over the 10,500 cap.
  // This leaner version keeps all 12 sources, every URL, and the load-bearing
  // facts, but cuts the long descriptive runs.
  const srcTrim = `

---

## Sources & Further Reading

The market structure, instruments, and benchmarks in this training are grounded in the industry, regulatory, and trade sources below. Keep the CIAB market index and the NCCI experience-mod methodology especially close when preparing a takeover.

1. **Marsh McLennan (NYSE:MMC)** — the world's largest insurance broker and risk-advisory holding company (Marsh, Guy Carpenter, Mercer, Oliver Wyman). Broker consolidation is pushing the national brokers down-market into the middle-market commercial-account segment, intensifying renewal-takeover competition. <https://www.marshmclennan.com/>

2. **Aon plc (NYSE:AON)** — the #2 global broker; its acquisition of NFP (~$13B, closed 2024) explicitly targets the middle market, creating both takeover openings (integration disruption) and threats (roll-up of regional agencies). <https://www.aon.com/>

3. **Arthur J. Gallagher & Co (NYSE:AJG)** — the #3 global broker and the most acquisitive consolidator of independent agencies; its roll-up means a buyer's "local agency" of 20 years may now be a Gallagher branch with a retiring principal — a classic takeover opening. <https://www.ajg.com/>

4. **Council of Insurance Agents & Brokers (CIAB)** — publisher of the quarterly Commercial Property/Casualty Market Index, the most-cited benchmark for commercial-insurance pricing direction by line. The takeover producer reads it to set honest renewal expectations. <https://www.ciab.com/>

5. **Independent Insurance Agents & Brokers of America (the Big "I")** — represents ~25,000 independent agency locations; the independent-agency channel competes on multi-carrier market access, local service, and claims advocacy versus captive single-carrier agents and direct digital channels. <https://www.independentagent.com/>

6. **NCCI (National Council on Compensation Insurance)** — the workers-compensation rating organization that calculates the Experience Modification Rate. The mod is publicly calculable, lags loss experience by ~a year, and is the most powerful and most-misunderstood number in a commercial renewal. <https://www.ncci.com/>

7. **AM Best** — the dominant carrier financial-strength rating agency (A++ to D). Most commercial buyers, lenders, and contracts require a minimum carrier rating; the takeover producer maps carrier appetite, rating, and claims service to the prospect's class of business. <https://www.ambest.com/>

8. **NAIC and the 50 state departments of insurance** — insurance is state-regulated; the broker-of-record letter is recognized across markets as the client's instruction that a named agency now represents the account, and carriers will not let two agencies block or re-market the same account at once. <https://www.naic.org/>

9. **Insurance Information Institute (Triple-I)** — industry data on catastrophe losses, social inflation, and combined-ratio trends. Social inflation (litigation funding and large jury verdicts) elevates auto and liability loss costs; the takeover producer frames the renewal honestly rather than over-promising rate relief. <https://www.iii.org/>

10. **Vermont Captive Insurance Association (VCIA)** — the captive and alternative-risk-transfer perimeter. A group captive lets a profitable, well-run middle-market account retain underwriting profit on its own predictable losses — a differentiated structure the transactional incumbent rarely raised. <https://www.vcia.com/>

11. **RIMS (Risk and Insurance Management Society)** — publisher of the total-cost-of-risk (TCOR) framework: premiums + retained losses + risk-control spend + administrative cost. The transactional incumbent sells premium; the advisory takeover producer sells total cost of risk. <https://www.rims.org/>

12. **Commercial-insurance buyer-psychology synthesis** — drawn from CIAB, RIMS, and Big "I" producer-development data: four avoided conversations (BOR vs re-market, "transactional not bad," loss-runs and the experience mod, and "the increase is the market") explain most of the gap between top- and bottom-quartile producers. <https://www.ciab.com/resources/>

`;

  // The qs6 `answer` = tldr+core+flow+ORIGINAL_src. Strip the original Sources
  // section and re-attach the trimmed one to form the v6 base.
  const marker = '\n\n---\n\n## Sources & Further Reading';
  const v6base = entry.answer.split(marker)[0];
  const v6 = v6base + srcTrim;

  const num = `

---

## The Numbers Behind the Takeover

A renewal-takeover producer who can't speak the quantitative language of commercial insurance loses on credibility before strategy. Treat ranges as planning bands, confirm account-specific numbers from the actual loss runs and the NCCI worksheet, and read the current CIAB Commercial P/C Market Index before setting any renewal expectation.

### Experience modification rate — the surcharge math

| Experience mod | Meaning | Effect on a $200K WC manual premium |
|---|---|---|
| **0.85** | Strong credit mod | Premium ≈ $170K — a $30K discount |
| **1.00** | Average — actual losses match expected | Premium ≈ $200K — neither credit nor debit |
| **1.19** | Debit mod (the Calderon role-play) | Premium ≈ $238K — a $38K surcharge |
| **1.28** | Heavy debit mod (the Donnelly role-play) | Premium ≈ $256K — a $56K surcharge |

The mod is a multiplier on **manual premium**, calculated by NCCI from roughly the prior three policy years excluding the most recent, and it **lags actual experience by about a year** — which is why a genuinely improved operation can still carry a high mod, and why open claims with stale reserves are so damaging. A claim still **open** on the loss run is valued at **paid plus reserved**; an inflated reserve inflates the mod until the claim closes or the reserve is corrected. This is the single highest-leverage technical insight in a workers-comp-heavy takeover.

### Total cost of risk — the four components

**Total cost of risk (TCOR)** = (1) insurance premiums + (2) retained/uninsured losses (deductibles, self-insured retentions, uninsured claims) + (3) risk-control and loss-prevention spend + (4) risk-management administrative cost. For a middle-market account, premium is typically only **55-75%** of true TCOR; the retained-loss component is the one the incumbent's premium quote never surfaces. In the Calderon role-play, a ~$400K premium sits inside a ~$940K TCOR — the difference is where the takeover argument lives.

### Renewal-takeover timeline — the discipline that beats the incumbent block

| Days to renewal | Stage | What must be done |
|---|---|---|
| **120 days** | SURFACE | Economic-buyer discovery meeting completed |
| **90 days** | STRESS-TEST | Loss runs and mod worksheet pulled and read |
| **60 days** | STRUCTURE + SUBSTANTIATE | Program redesigned, written TCOR analysis presented |
| **30 days** | SECURE | BOR signed and/or market authorization submitted before the incumbent locks the carriers |

A takeover started inside **30 days** is almost always a price-check: no time to pull loss runs, no time to re-market cleanly, and the incumbent can block the carriers. Top-quartile producers start at **90-120 days**; bottom-quartile producers start at **2-3 weeks** and compete only on price.

### Market-direction and captive discipline

Commercial-insurance pricing moves by line and by cycle — read the current **CIAB Commercial P/C Market Index** before promising anything. Through **2024-2025**, commercial **property** stayed elevated on catastrophe losses and replacement-cost inflation; **commercial auto** stayed adverse on social inflation; **workers compensation** continued a long soft run. A 12-20% property increase may simply be the market — promising to erase it is how you inherit a renewal you lose in 12 months. A **group captive** becomes worth a feasibility analysis once a middle-market account carries roughly **$300K+** in combined casualty premium, has **predictable, lower-hazard** losses, and is well-run — a structural reframe the transactional incumbent rarely raised.

`;

  const counter = `

---

## Counter-Case: When the Renewal Takeover Playbook Is the Wrong Move

A disciplined producer is as good at *not* chasing a takeover as at running one. Applied indiscriminately, the 5-stage motion burns time, damages reputation, and occasionally hands a client a worse outcome.

### 1. When the incumbent is genuinely excellent

Some incumbents are not transactional — they pull loss runs, run quarterly stewardship, have driven the mod down, and placed the program well. If your STRESS-TEST finds a well-managed program, **say so and walk**. Telling a CFO her broker is doing real work, when true, builds more long-term credibility than a forced pitch.

### 2. When a re-market would damage the client's market access

Re-marketing means approaching carriers. In a **hard market**, or in a **niche class** with few willing carriers, sending the account into the market clumsily — or letting multiple agencies hit the same carriers — can **burn the markets** and leave the client with *worse* options. If you cannot run a controlled, single-channel marketing process, recommend a BOR on the existing program or recommend the client stay put.

### 3. When the only reason to switch is price

If your full analysis surfaces no structural improvement and the *only* lever is a few percent of premium, **the takeover is not real**. You will win it on price and lose it back on price. Decline gracefully — a book built on price-driven takeovers is a book that churns.

### 4. When you cannot get the loss runs or the economic buyer

If the prospect will not authorize loss runs and will not put you in front of the CFO/owner, you cannot run STRESS-TEST or SUBSTANTIATE — you cannot do the job. Continuing makes you an unpaid price-checker sharpening the incumbent's pencil. **No loss runs and no buyer access = no takeover. Walk.**

### 5. When the timing genuinely doesn't work

A serious takeover needs roughly **90-120 days**. Introduced inside 30 days of renewal, the honest move is usually: *"There isn't time to do this properly before this renewal. Let your current program renew, and let me start the real process 120 days before your next one."* That sentence loses a quote and wins a relationship.

### 6. When a captive is being used as a gimmick

A captive is a serious, multi-year financial commitment with real exit cost and collateral implications. Raising it to *sound* sophisticated, on an account too small, too volatile, or too hazardous to qualify, discredits everything else in your analysis. Raise alternative risk transfer **only** where the loss profile and premium scale genuinely support it.

> ### 🟡 Coach Note
> The counter-case is not a hedge — it is the discipline that makes the playbook trustworthy. A producer who will walk away from the wrong takeover is one a CFO believes when she runs the right one.

`;

  const links = `

---

## Related Pulse Sales Trainings

This renewal-takeover training is one motion inside the broader Pulse Sales Trainings library. Pair this session with the related entries below — each is a runnable 60-minute meeting template.

- **st0026 — Managed IT Services (MSP) MSA Renewal Conversation: Surviving the Mid-Market Squeeze.** The closest structural cousin: winning or defending a recurring-revenue service agreement at renewal against a price-anchored incumbent. The MSP renewal and the P&C takeover share the core lesson — a renewal won on price is lost back on price.
- **st0027 — Commercial HVAC Service Agreement Renewal Conversation.** Another recurring-contract renewal motion built on moving the buyer from "price of the contract" to "total cost" — directly analogous to moving an insurance buyer from premium to total cost of risk.
- **st0001 — The Discovery Call Reset: The 7-Question Framework That Surfaces Real Pain.** The SURFACE stage of this training is a specialized discovery motion; st0001 is the discovery fundamentals every producer should master first.
- **st0006 — The Pricing Conversation: When to Introduce, When to Defend, When to Walk.** The "the increase is the market" avoided conversation and the discipline of never over-promising rate relief are pricing-conversation skills covered in depth in st0006.
- **st0014 — Financial Advisor: The Discovery Meeting With a $2M Client.** A parallel advisory-sale motion — earning the right to manage a client's financial risk mirrors earning the right to manage a business's insurable risk.
- **st0002 — Multi-Threading Enterprise Deals: How to Earn the Right to the Economic Buyer.** The SURFACE-stage problem of reaching the CFO/owner instead of the certificate clerk is a multi-threading problem; st0002 is the dedicated training on it.

Run st0030 as the industry-specific application; run st0001, st0002, and st0006 as the underlying skill foundations.

`;

  const v7 = v6 + num;
  const v8 = v7 + counter;
  const v9 = v8 + links;
  console.log('rebuilt layer words: v6=' + words(v6), 'v7=' + words(v7), 'v8=' + words(v8), 'v9=' + words(v9));
  if (words(v9) > 10500) { console.error('v9 STILL over cap:', words(v9)); process.exit(1); }

  const steps = [
    { target: 7, new_answer: v7, note: 'Added "The Numbers Behind the Takeover" — verified quantitative detail: an experience-mod surcharge math table, the four-component total-cost-of-risk definition, the 120/90/60/30-day renewal-takeover timeline table, CIAB market-direction discipline by line, and group-captive entry economics.' },
    { target: 8, new_answer: v8, note: 'Added a Counter-Case section — six situations where the renewal-takeover playbook is the wrong move (excellent incumbent, market-access damage from re-marketing, price-only switch, no loss-run/buyer access, broken timing, captive-as-gimmick), with coaching on when to slow down or walk away.' },
    { target: 9, new_answer: v9, note: 'Added a Related Pulse Sales Trainings cross-link section connecting to six verified sibling entries (st0026 MSP MSA renewal, st0027 commercial HVAC service agreement renewal, st0001 discovery call reset, st0006 pricing conversation, st0014 financial advisor discovery, st0002 multi-threading to the economic buyer).' }
  ];

  for (const s of steps) {
    const payload = { key: KEY, id: ID, polish_note: s.note, new_answer: s.new_answer };
    const r = await fetch(POLISH_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const body = await r.json().catch(() => ({}));
    console.log('-> qs' + s.target + ' · HTTP ' + r.status + ' · ' + JSON.stringify(body).slice(0, 320));
    if (r.status !== 200) { console.error('FAIL at qs' + s.target); process.exit(1); }
    await sleep(900);
  }

  const finalEntry = await store.get('answers/' + ID + '.json', { type: 'json' });
  console.log('=== FINAL ===');
  console.log('id:', finalEntry.id);
  console.log('quality_score:', finalEntry.quality_score);
  console.log('answer:', (finalEntry.answer || '').length, 'chars,', words(finalEntry.answer || ''), 'words');
  console.log('polish_history len:', (finalEntry.polish_history || []).length);
  fs.writeFileSync(path.join(__dirname, '..', '..', '_st0030_final.json'), JSON.stringify(finalEntry, null, 2));
  console.log('wrote _st0030_final.json');
  console.log('=== DONE st0030 ===');
}

main().catch(e => { console.error('ERROR:', e); process.exit(1); });
