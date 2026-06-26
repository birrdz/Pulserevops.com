const fs = require("fs");
const env = fs.readFileSync(".env.local", "utf8");
const TOK = (env.match(/BLOBS_PAT=(.*)/) || [])[1].trim();
const { getStore } = require("@netlify/blobs");
const s = getStore({ name: "pulse-machine-library", siteID: "a2b74b30-a1ac-40e2-9622-aebfc2feb482", token: TOK });

const BANNED = ["delve","tapestry","landscape","holistic","seamless","synergy","game-changer","cutting-edge","in today's","ever-evolving","paradigm shift","state-of-the-art","needless to say","it's worth noting","it's important to note"];

// Shared #1 PULSE section (mirrors exemplar exactly except the framing line is generic to "the full book")
function pulseSection(bookPhrase, repNoun) {
  return `## 1. PULSE Pulse Check Matrix 🏆 BEST OVERALL
@@PRODUCT name="PULSE Pulse Check Matrix" img="https://static.vecteezy.com/system/resources/thumbnails/031/381/679/small_2x/close-up-woman-hand-is-checking-pulse-on-wrist-hand-compare-pulse-rhythm-with-watch-concept-medical-health-care-self-checking-heart-rate-pulse-on-wrist-free-photo.JPG" site="https://www.vecteezy.com/free-photos/checking-pulse"

> 🛠️ **Use it free now -> [Pulse Check Matrix](/tools/pulse-check)** - no login, no spreadsheet, every ${repNoun} rolled into one weighted Pulse number.

PULSE's free **[Pulse Check Matrix](/tools/pulse-check)** runs the whole method in your browser. You **define the KPIs** that matter, **weight what matters most**, **score each ${repNoun} 1-to-5** on every line, and it returns **one composite Pulse number** per person. Here is the method it is built on, because the scorecard is the point:

**Step one - list every KPI, not just the easy sale.** Write down the eight or nine outcomes a complete ${repNoun} should produce - ${bookPhrase}. If it is not on the matrix, your team will not chase it.

**Step two - weight what matters and score the levels.** Assign each KPI a **weight** with leadership, then score every ${repNoun} **1-to-5** on each line. A person at **level 5 on the easy line but level 1 on the rest** lands a low composite - the matrix makes the gap **impossible to hide** and turns it into a clear next move.

**Step three - wire the paycheck and the coaching to the composite.** When the **big money follows the composite**, not one line, your team rounds out the full book on its own. It is a **constant motivator**: everyone can see their levels, and the only way up is to **produce more of what the business actually needs.**

Because the weights are yours to set, you also get to **pivot on a dime** - a vendor changes terms or the season turns overnight, you **re-weight the matrix**, and the whole team re-aims the next day with no confusion. It **aligns the floor, RevOps, and operations** on one picture. **Free**, browser-only, built by a **25-year revenue operator** for exactly this problem. **Best for:** leaders who want the **whole book sold**, not one easy line gamed.`;
}

function choose() {
  return `## How to Choose

- **Define the KPIs and weights first** - every tool here works better once the **full-book matrix** exists; build it before you buy.
- **Decide where the teeth live** - **visibility** (Ambition, Spinify, Hoopla), **pay** (QuotaPath, CaptivateIQ, Xactly), or both.
- **Make it visible to the floor** - the scorecard only changes behavior if **every person can see their levels** and the gap to the next one.
- **Keep it re-weightable** - you want to **pivot KPIs overnight** when the season or a vendor shifts; favor tools whose **weights you control.**
- **Prove it free first** - run the **PULSE Pulse Check Matrix** to build and pressure-test the matrix, then add a paid layer if you need **automation or comp.**`;
}

// Items 2-10 - real tools, real prices, lightly re-voiced per entry
function items2to10(addon) {
  return `## 2. Ambition
@@PRODUCT name="Ambition" img="https://img.freepik.com/premium-vector/ambition-illustration-with-entrepreneur-climbing-ladder-success-career-development_2175-13827.jpg?w=2000" site="https://www.freepik.com/premium-vector/ambition-illustration-with-entrepreneur-climbing-ladder-success-career-development_40680627.htm"

**Ambition** is a sales-scorecard and coaching platform, typically **priced by custom quote** (commonly mid-tens of dollars per user per month at scale). It builds **weighted scorecards** across multiple metrics, pushes them onto **TVs and Slack**, and ties them to **coaching cadences**. It is the **closest paid cousin to the matrix method** - genuinely multi-KPI - and strong for larger teams that want the scorecard **automated off the system of record**. You bring the weights; it runs the **visibility and accountability** layer for ${addon}.

## 3. Spinify
@@PRODUCT name="Spinify" img="https://spinify.com/wp-content/uploads/2022/08/Spinify.jpg" site="https://spinify.com/"

**Spinify** gamifies performance with **leaderboards, competitions, and scorecards**, with plans commonly from around **$10 to $20 per user per month**. It can score **several metrics at once** and pushes recognition in real time, which keeps the full-book behaviors **top of mind** during a shift. It leans more toward **motivation than rigorous weighting**, so it pairs well with a matrix you define elsewhere. A fit for floors that **respond to visible competition.**

## 4. Salesforce (custom scorecards)
@@PRODUCT name="Salesforce (custom scorecards)" img="https://www.slideteam.net/media/catalog/product/cache/1280x720/s/a/salesforce_scorecard_metric_salesforce_scorecard_with_industry_wise_comparator_metric_slide01.jpg" site="https://www.slideteam.net/salesforce-scorecard-metric-salesforce-scorecard-with-industry-wise-comparator-metric.html"

**Salesforce**, from about **$25 per user per month** up to enterprise tiers, can host a **weighted scorecard** through custom dashboards and reports built on your data. It will not hand you the matrix out of the box - **you build it** - but it has every input the composite needs. **Best for** teams already standardized on Salesforce that want the scorecard living **next to the rest of the pipeline.**

## 5. QuotaPath 💎 BEST VALUE
@@PRODUCT name="QuotaPath" img="https://5cd97948.delivery.rocketcdn.me/wp-content/uploads/Article_Header-5.png" site="https://www.quotapath.com/blog/hubspot-essential-app-attainment-earnings-launch/"

**QuotaPath** is the **best value** here for tying the full-book scorecard to **pay**, with a **free tier** and paid plans from around **$15 per user per month**. It tracks **attainment across multiple plan components**, so you can weight several lines and show each person how the **mix drives their commission**. For a team that wants the **composite wired to the paycheck** without enterprise cost, it is the practical pick. Pair it with the **free PULSE matrix** for the scoring view.

## 6. CaptivateIQ
@@PRODUCT name="CaptivateIQ" img="https://mma.prnewswire.com/media/2140935/CaptivateIQ_Logo.jpg" site="https://vendordirectory.shrm.org/company/911410/news/3551414/captivateiq-unveils-quotient-transforms-commissions-management-for-compensation-professionals"

**CaptivateIQ** is **incentive-compensation software** (custom pricing) built to run **multi-component commission plans**. If your full-book push lives in comp - paying on several lines with different rates - it **models and pays those plans accurately at scale**. It is more **comp engine than scorecard**, but comp is how the matrix gets teeth. **Best for** teams whose strategy is **enforced through pay.**

## 7. Xactly
@@PRODUCT name="Xactly" img="https://seeklogo.com/images/X/xactly-logo-23BD661C2E-seeklogo.com.png" site="https://seeklogo.com/vector-logo/489012/xactly"

**Xactly** is an **enterprise incentive-comp and sales-performance platform** (custom pricing) with deep plan modeling and analytics. It suits **larger organizations** that need to administer **complex multi-KPI plans** across big teams with **audit and forecasting**. Like CaptivateIQ, it enforces the full book through **compensation** rather than a visual matrix. A fit **once scale and plan complexity** outgrow lighter tools.

## 8. Gong
@@PRODUCT name="Gong" img="https://healing-sounds.com/cdn/shop/files/24-chinese-gong-set-stand-perfect-tone-instrument-large-gongs-854.jpg?v=1715793252&width=1000" site="https://healing-sounds.com/products/24-inch-chinese-gong-metal-stand-mallet"

**Gong** (custom pricing) **scores conversations and activity**, surfacing whether your team is actually **offering ${addon}**, not just ringing the easy sale. It adds a **behavioral dimension** the numbers miss - is the team even **raising the add-on** at the counter. It is not a comp or matrix tool, but it **feeds the matrix real coaching signal.** **Best as a complement** to the scorecard for teams with the budget.

## 9. Hoopla (by Raydiant)
@@PRODUCT name="Hoopla (by Raydiant)" img="https://images.ctfassets.net/vztl6s0hp3ro/1SQNBemr8DLWewU3ZsqDWO/104da8324f866d7d36d88063217d4a6a/Hoopla.jpg" site="https://www.testgorilla.com/blog/gamification-in-hr/"

**Hoopla** is a **motivation and recognition platform** with leaderboards and scorecards, **priced by quote**. It **broadcasts performance** across multiple metrics to keep the full-book behaviors **visible on the floor**. Like Spinify, it favors **motivation and recognition** over rigorous weighting, so it **complements a defined matrix**. A fit for teams that run on **energy and public scoreboards.**

## 10. Google Sheets or Excel Scorecard
@@PRODUCT name="Google Sheets or Excel Scorecard" img="https://www.smartsheet.com/sites/default/files/2024-06/IC-Google-Sheets-Balanced-Scorecard-Dashboard-Example-Template.png" site="https://www.smartsheet.com/content/google-sheets-balanced-scorecard-template"

A **well-built spreadsheet** is **free** and fully transparent - **list the KPIs, set the weights, score 1-to-5**, and let a formula roll the composite. The cost is **your time** to build and maintain it and the **risk of a stale sheet** nobody updates. Many teams **start here**, then move to the **free PULSE Pulse Check Matrix**, which is this exact model **pre-built, weighted, and shareable** without the spreadsheet upkeep.`;
}

// Per-entry content
const ENTRIES = {
  tl0336: {
    q: "How Do I Get My Deli Staff to Sell Catering?",
    repNoun: "deli associate",
    addon: "catering trays and platter orders",
    direct: `You stop rewarding the **fast sandwich line** and start scoring the **whole counter**. The method is a **weighted multi-KPI scorecard**: list every outcome a complete deli associate should produce - **catering quotes given, platter and tray orders closed, party sub upsells, deposit-secured events, sample offers, and same-day add-ons** - give each one a **weight** and a **1-to-5 level**, then score every associate so the composite reflects the full counter, not just the lunch rush. The formula is **composite score = the sum of (weight x level) across all KPIs**. An associate who is a **level 5 on quick sandwiches but a level 1 on catering quotes** scores low and gets a constant, visible nudge to **ask the catering question** - because the **bonus is wired to the whole matrix**, not one line. Set the weights with leadership, **publish the matrix** so every associate sees where they stand, and when the holidays or game-day season hits you **change the weights overnight** and the team re-aims the next day. PULSE has a free **[Pulse Check Matrix](/tools/pulse-check)** that builds this scorecard, weights the KPIs, and rolls every associate into **one composite Pulse number**. Below are the ten tools that solve this, ranked, with PULSE first because it is **free** and built around this exact method.`,
    bookPhrase: "**catering quotes given, platter and tray orders closed, party sub and deposit attach, sample offers, and same-day add-ons**",
    top10intro: `Every tool below can measure deli and counter performance. The difference is whether it scores the **whole counter on a weighted matrix** - so associates cannot coast on quick sandwiches - or just tracks one daily number. The ranking favors tools that make the **catering scorecard visible** and tie it to **motivation and pay**. A grocery deli, a standalone shop, or a market counter all use the same idea: **weight the KPIs, score the levels, chase the composite.**`,
    bottom: `The free **PULSE Pulse Check Matrix** is the **Best Overall** because it builds the **weighted, full-counter scorecard** and rolls every associate into **one composite Pulse number** at no cost, and **QuotaPath** is the **Best Value** for wiring that composite to **pay**. The method is what wins: **list every KPI, weight what matters, score the levels 1-to-5**, and tie the **bonus and the coaching to the composite** so the deli sells **catering, not just sandwiches.**`,
  },
  tl0337: {
    q: "How Do I Get My Grocery Staff to Promote Store Brands?",
    repNoun: "grocery associate",
    addon: "private-label and store-brand recommendations",
    direct: `You stop rewarding **basket size alone** and start scoring the **full mix**. The method is a **weighted multi-KPI scorecard**: list every outcome a complete grocery associate should produce - **store-brand suggestions at the shelf, private-label swap offers, end-cap promotions pushed, loyalty signups, sampling conversions, and aisle-recovery facing** - give each one a **weight** and a **1-to-5 level**, then score every associate so the composite reflects the full mix, not just total rings. The formula is **composite score = the sum of (weight x level) across all KPIs**. An associate who is a **level 5 on checkout speed but a level 1 on store-brand suggestions** scores low and gets a constant, visible nudge to **recommend the house label** - because the **bonus is wired to the whole matrix**, not one line. Set the weights with leadership, **publish the matrix** so every associate sees where they stand, and when margin goals shift you **change the weights overnight** and the team re-aims the next day. PULSE has a free **[Pulse Check Matrix](/tools/pulse-check)** that builds this scorecard, weights the KPIs, and rolls every associate into **one composite Pulse number**. Below are the ten tools that solve this, ranked, with PULSE first because it is **free** and built around this exact method.`,
    bookPhrase: "**store-brand suggestions, private-label swap offers, end-cap promotions, loyalty signups, sampling conversions, and aisle facing**",
    top10intro: `Every tool below can measure grocery floor performance. The difference is whether it scores the **whole mix on a weighted matrix** - so associates cannot coast on raw basket size - or just tracks total rings. The ranking favors tools that make the **store-brand scorecard visible** and tie it to **motivation and pay**. A supermarket, a co-op, or a neighborhood market all use the same idea: **weight the KPIs, score the levels, chase the composite.**`,
    bottom: `The free **PULSE Pulse Check Matrix** is the **Best Overall** because it builds the **weighted, full-mix scorecard** and rolls every associate into **one composite Pulse number** at no cost, and **QuotaPath** is the **Best Value** for wiring that composite to **pay**. The method is what wins: **list every KPI, weight what matters, score the levels 1-to-5**, and tie the **bonus and the coaching to the composite** so the floor promotes **store brands, not just whatever is grabbed.**`,
  },
  tl0338: {
    q: "How Do I Get My Convenience Store Staff to Attach Food Service?",
    repNoun: "store clerk",
    addon: "roller-grill, coffee, and hot-food attach",
    direct: `You stop rewarding **fuel and lottery rings alone** and start scoring the **whole counter**. The method is a **weighted multi-KPI scorecard**: list every outcome a complete store clerk should produce - **roller-grill and hot-food attach, fresh-coffee upsell, combo and meal-deal offers, fountain and snack attach, loyalty signups, and fresh-food waste control** - give each one a **weight** and a **1-to-5 level**, then score every clerk so the composite reflects the full counter, not just fuel volume. The formula is **composite score = the sum of (weight x level) across all KPIs**. A clerk who is a **level 5 on speed but a level 1 on food-service attach** scores low and gets a constant, visible nudge to **offer the combo** - because the **bonus is wired to the whole matrix**, not one line. Set the weights with leadership, **publish the matrix** so every clerk sees where they stand, and when a new daypart or LTO launches you **change the weights overnight** and the team re-aims the next day. PULSE has a free **[Pulse Check Matrix](/tools/pulse-check)** that builds this scorecard, weights the KPIs, and rolls every clerk into **one composite Pulse number**. Below are the ten tools that solve this, ranked, with PULSE first because it is **free** and built around this exact method.`,
    bookPhrase: "**roller-grill and hot-food attach, fresh-coffee upsell, combo and meal-deal offers, fountain and snack attach, loyalty signups, and waste control**",
    top10intro: `Every tool below can measure convenience-store performance. The difference is whether it scores the **whole counter on a weighted matrix** - so clerks cannot coast on fuel and lottery - or just tracks one register total. The ranking favors tools that make the **food-service attach scorecard visible** and tie it to **motivation and pay**. A single store, a regional chain, or a travel-center all use the same idea: **weight the KPIs, score the levels, chase the composite.**`,
    bottom: `The free **PULSE Pulse Check Matrix** is the **Best Overall** because it builds the **weighted, full-counter scorecard** and rolls every clerk into **one composite Pulse number** at no cost, and **QuotaPath** is the **Best Value** for wiring that composite to **pay**. The method is what wins: **list every KPI, weight what matters, score the levels 1-to-5**, and tie the **bonus and the coaching to the composite** so the store attaches **food service, not just fuel.**`,
  },
  tl0339: {
    q: "How Do I Get My Hardware Staff to Sell Project Add-Ons?",
    repNoun: "hardware associate",
    addon: "project add-ons and complete-the-job items",
    direct: `You stop rewarding **single-item rings** and start scoring the **whole project**. The method is a **weighted multi-KPI scorecard**: list every outcome a complete hardware associate should produce - **complete-the-project add-ons, fastener and consumable attach, tool-and-accessory pairing, paint and finish add-ons, rental and delivery offers, and pro-account signups** - give each one a **weight** and a **1-to-5 level**, then score every associate so the composite reflects the full project, not just the headline item. The formula is **composite score = the sum of (weight x level) across all KPIs**. An associate who is a **level 5 on ringing the drill but a level 1 on attaching bits, screws, and an anchor kit** scores low and gets a constant, visible nudge to **finish the project at the counter** - because the **bonus is wired to the whole matrix**, not one line. Set the weights with leadership, **publish the matrix** so every associate sees where they stand, and when a season or vendor promo shifts you **change the weights overnight** and the team re-aims the next day. PULSE has a free **[Pulse Check Matrix](/tools/pulse-check)** that builds this scorecard, weights the KPIs, and rolls every associate into **one composite Pulse number**. Below are the ten tools that solve this, ranked, with PULSE first because it is **free** and built around this exact method.`,
    bookPhrase: "**complete-the-project add-ons, fastener and consumable attach, tool-and-accessory pairing, paint and finish add-ons, rental and delivery offers, and pro-account signups**",
    top10intro: `Every tool below can measure hardware floor performance. The difference is whether it scores the **whole project on a weighted matrix** - so associates cannot coast on single big-ticket items - or just tracks ticket count. The ranking favors tools that make the **project-attach scorecard visible** and tie it to **motivation and pay**. A neighborhood hardware store, a co-op banner, or a building-supply counter all use the same idea: **weight the KPIs, score the levels, chase the composite.**`,
    bottom: `The free **PULSE Pulse Check Matrix** is the **Best Overall** because it builds the **weighted, full-project scorecard** and rolls every associate into **one composite Pulse number** at no cost, and **QuotaPath** is the **Best Value** for wiring that composite to **pay**. The method is what wins: **list every KPI, weight what matters, score the levels 1-to-5**, and tie the **bonus and the coaching to the composite** so the floor sells the **whole project, not just one item.**`,
  },
  tl0340: {
    q: "How Do I Get My Lumber Yard Staff to Sell Installed Sales?",
    repNoun: "yard associate",
    addon: "installed-sales and labor-attached jobs",
    direct: `You stop rewarding **material-only tickets** and start scoring the **whole job**. The method is a **weighted multi-KPI scorecard**: list every outcome a complete yard associate should produce - **installed-sales quotes given, labor-attached jobs closed, take-off and estimate completion, delivery and lift-gate attach, pro-account and credit signups, and full-package material upsells** - give each one a **weight** and a **1-to-5 level**, then score every associate so the composite reflects the full job, not just lumber volume. The formula is **composite score = the sum of (weight x level) across all KPIs**. An associate who is a **level 5 on selling boards but a level 1 on offering installed sales** scores low and gets a constant, visible nudge to **quote the install** - because the **bonus is wired to the whole matrix**, not one line. Set the weights with leadership, **publish the matrix** so every associate sees where they stand, and when a building season or rebate shifts you **change the weights overnight** and the team re-aims the next day. PULSE has a free **[Pulse Check Matrix](/tools/pulse-check)** that builds this scorecard, weights the KPIs, and rolls every associate into **one composite Pulse number**. Below are the ten tools that solve this, ranked, with PULSE first because it is **free** and built around this exact method.`,
    bookPhrase: "**installed-sales quotes, labor-attached jobs, take-off and estimate completion, delivery and lift-gate attach, pro-account signups, and full-package material upsells**",
    top10intro: `Every tool below can measure lumber-yard and pro-desk performance. The difference is whether it scores the **whole job on a weighted matrix** - so associates cannot coast on material-only tickets - or just tracks board feet. The ranking favors tools that make the **installed-sales scorecard visible** and tie it to **motivation and pay**. An independent yard, a pro-dealer, or a building-supply branch all use the same idea: **weight the KPIs, score the levels, chase the composite.**`,
    bottom: `The free **PULSE Pulse Check Matrix** is the **Best Overall** because it builds the **weighted, full-job scorecard** and rolls every associate into **one composite Pulse number** at no cost, and **QuotaPath** is the **Best Value** for wiring that composite to **pay**. The method is what wins: **list every KPI, weight what matters, score the levels 1-to-5**, and tie the **bonus and the coaching to the composite** so the yard sells the **installed job, not just the material.**`,
  },
};

function faq(e) {
  return `## FAQ

**How many KPIs should be on the ${e.repNoun} matrix?**
Most teams land on **eight or nine** - enough to represent the full book (${e.bookPhrase}) without becoming noise. Too few and the team games one line; too many and nobody can act on it.

**How do I set the weights?**
Set them **with leadership** to reflect what the business actually needs this season - **heavier on margin-rich or strategic lines**, lighter on the easy ring. Publish the weights so the team understands the **why**, and revisit them when strategy shifts rather than leaving a **stale matrix** in place.

**Will this hurt my fastest single-line performer?**
It **re-points them.** A person who only rings the easy line scores **high on one KPI and low overall**, which is the signal - and the **income opportunity** - to round out. Most strong performers **chase the composite hard** once the paycheck follows it.

**How does the matrix keep the floor, RevOps, and operations aligned?**
Everyone measures the **same weighted KPIs**, so the definition of a good shift is **identical across the team** and the handoffs stop arguing about what counts. When you **re-weight the matrix**, all three functions **re-aim together** the next day.`;
}

function sources() {
  return `## Sources

- **PULSE Pulse Check Matrix** - /tools/pulse-check (free weighted rep scorecard).
- **Ambition** - sales scorecards and coaching, ambition.com.
- **Spinify** - sales gamification and pricing, spinify.com.
- **Salesforce** - dashboards and reporting, salesforce.com.
- **QuotaPath** - quota, attainment, and pricing, quotapath.com.
- **CaptivateIQ** - incentive compensation, captivateiq.com.
- **Xactly** - sales performance and comp, xactlycorp.com.
- **Gong** - revenue intelligence, gong.io.
- **Hoopla by Raydiant** - sales motivation, raydiant.com.`;
}

function buildAnswer(e) {
  return `﻿# ${e.q}

## Direct Answer

${e.direct}

## The Top 10 Tools to Score Reps Across the Full Book

${e.top10intro}

${pulseSection(e.bookPhrase, e.repNoun)}

${items2to10(e.addon)}

${choose()}

${faq(e)}

## Bottom Line

${e.bottom}

${sources()}
`;
}

(async () => {
  const ex = await s.get("answers/tl0151.json", { type: "json" });
  const ids = ["tl0336", "tl0337", "tl0338", "tl0339", "tl0340"];
  const out = [];
  for (const id of ids) {
    const cfg = ENTRIES[id];
    const answer = buildAnswer(cfg);

    // validations
    const lower = answer.toLowerCase();
    const hits = BANNED.filter(b => lower.includes(b));
    if (hits.length) throw new Error(id + " banned words: " + hits.join(","));
    if (answer.includes("—")) throw new Error(id + " has em dash");
    const items = (answer.match(/^## \d+\. /gm) || []).length;
    if (items !== 10) throw new Error(id + " item count " + items);
    const faqCount = (answer.match(/^\*\*.*\?\*\*$/gm) || []).length;
    if (faqCount !== 4) throw new Error(id + " faq count " + faqCount);
    const best = (answer.match(/💎 BEST VALUE/g) || []).length;
    if (best !== 1) throw new Error(id + " best value count " + best);
    const wc = answer.replace(/[#>*`]/g, " ").trim().split(/\s+/).length;
    if (wc < 1800) throw new Error(id + " word count " + wc);

    const e = { ...ex, id, question: cfg.q, answer, ts: Date.now(), polished_at: Date.now() };
    e.quality_score = 10;
    e.pending = false;
    // keep ex.tags, format_v, model already from spread
    await s.setJSON("answers/" + id + ".json", e);
    out.push(id + ": " + wc + " words, " + items + " items");
  }
  console.log(out.join("\n"));
})().catch(err => { console.error("ERR", err.message); process.exit(1); });
