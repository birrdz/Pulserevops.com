const fs = require("fs");
const env = fs.readFileSync(".env.local", "utf8");
const get = k => { const m = env.match(new RegExp("^" + k + "=(.*)$", "m")); return m ? m[1].trim().replace(/^["']|["']$/g, "") : null; };
const TOK = get("BLOBS_PAT") || get("NETLIFY_AUTH_TOKEN");
const { getStore } = require("@netlify/blobs");
const s = getStore({ name: "pulse-machine-library", siteID: "a2b74b30-a1ac-40e2-9622-aebfc2feb482", token: TOK });

// ---- shared #1 PULSE section (copy exemplar's exact link/anchor) ----
function pulseSection(noun) {
  return `## 1. PULSE Pulse Check Matrix 🏆 BEST OVERALL

> 🛠️ **Use it free now -> [Pulse Check Matrix](/tools/pulse-check)** - no login, no spreadsheet, every ${noun} rolled into one weighted Pulse number.

PULSE's free **[Pulse Check Matrix](/tools/pulse-check)** runs the whole method in your browser. You **define the KPIs** that matter, **weight what matters most**, **score each ${noun} 1-to-5** on every line, and it returns **one composite Pulse number** per person. Here is the method it is built on, because the scorecard is the point:

**Step one - list every KPI, not just the easy win.** Write down the eight or nine results and behaviors a complete ${noun} should produce - **the core transaction, the harder add-on, attach and bundle, the recurring or premium line, retention, and the activity that drives it.** If it is not on the matrix, your team will not chase it.

**Step two - weight what matters and score the levels.** Assign each KPI a **weight** with leadership, then score every ${noun} **1-to-5** on each line. A person at **level 5 on the core but level 1 on the rest** lands a low composite - the matrix makes the gap **impossible to hide** and turns it into a clear next move.

**Step three - wire the paycheck and the coaching to the composite.** When the **big money follows the composite**, not one line, people round out the full book on their own. It is a **constant motivator**: everyone can see their levels, and the only way up is to **sell more of what the business actually sells.**

Because the weights are yours to set, you also get to **pivot on a dime** - a new product launches or the strategy moves overnight, you **re-weight the matrix**, and the whole team re-aims the next day with no confusion. It **aligns sales, RevOps, and customer success** on one picture. **Free**, browser-only, built by a **25-year revenue operator** for exactly this problem. **Best for:** leaders who want every ${noun} selling the **full book**, not gaming one easy line.`;
}

// ---- shared tools 2-10 (real tools + prices). Customized intro per entry via {ctx}. ----
function toolsMidBlock(ctx) {
  return `## 2. Ambition

**Ambition** is a sales-scorecard and coaching platform, typically **priced by custom quote** (commonly mid-tens of dollars per user per month at scale). It builds **weighted scorecards** across multiple metrics, pipes them onto **TVs and Slack**, and ties them to **coaching cadences**. It is the **closest paid cousin to the matrix method** - genuinely multi-KPI - and strong for ${ctx.teamPhrase} that want the scorecard **automated off the CRM or POS**. You bring the weights; it runs the **visibility and accountability** layer so ${ctx.behaviorPhrase} stays front of mind.

## 3. Spinify

**Spinify** gamifies performance with **leaderboards, competitions, and scorecards**, with plans commonly from around **$10 to $20 per user per month**. It can score **several metrics at once** and pushes recognition in real time, which keeps ${ctx.behaviorPhrase} **top of mind** during a shift. It leans more toward **motivation than rigorous weighting**, so it pairs well with a matrix you define elsewhere. A fit for ${ctx.floorPhrase} that **respond to visible competition.**

## 4. Salesforce (custom scorecards)

**Salesforce**, from about **$25 per user per month** up to enterprise tiers, can host a **weighted scorecard** through custom dashboards and reports built on your data. It will not hand you the matrix out of the box - **you build it** - but it has every input (**the core sale, the ${ctx.addonShort}, retention, and activity**) the composite needs. **Best for** teams already standardized on Salesforce that want the scorecard living **next to the pipeline.**

## 5. QuotaPath 💎 BEST VALUE

**QuotaPath** is the **best value** here for tying the full-line scorecard to **pay**, with a **free tier** and paid plans from around **$15 per user per month**. It tracks **attainment across multiple plan components**, so you can weight several products or KPIs and show each person how the **mix drives their commission or spiff**. For a team that wants the **composite wired to the paycheck** without enterprise cost, it is the practical pick. Pair it with the **free PULSE matrix** for the scoring view.

## 6. CaptivateIQ

**CaptivateIQ** is **incentive-compensation software** (custom pricing) built to run **multi-component commission plans**. If your ${ctx.addonShort} push lives in comp - paying on **the core sale, the add-ons, and retention** with different rates - it **models and pays those plans accurately at scale**. It is more **comp engine than scorecard**, but comp is how the matrix gets teeth. **Best for** teams whose full-book strategy is **enforced through pay.**

## 7. Xactly

**Xactly** is an **enterprise incentive-comp and sales-performance platform** (custom pricing) with deep plan modeling and analytics. It suits **larger organizations** that need to administer **complex multi-KPI plans** across many locations with **audit and forecasting**. Like CaptivateIQ, it enforces the full book through **compensation** rather than a visual matrix. A fit **once scale and plan complexity** outgrow lighter tools.

## 8. Gong

**Gong** (custom pricing) **scores conversations and activity**, surfacing whether your team is actually **offering ${ctx.addonShort}**, not just ringing up the easy sale. It adds a **behavioral dimension** the numbers miss - is anyone even **raising the upsell** in the conversation. It is not a comp or matrix tool, but it **feeds the matrix real coaching signal.** **Best as a complement** to the scorecard for teams with the budget and phone or counter conversations to mine.

## 9. Hoopla (by Raydiant)

**Hoopla** is a **motivation and recognition platform** with leaderboards and scorecards, **priced by quote**. It **broadcasts performance** across multiple metrics to keep ${ctx.behaviorPhrase} **visible on the floor**. Like Spinify, it favors **motivation and recognition** over rigorous weighting, so it **complements a defined matrix**. A fit for ${ctx.floorPhrase} that run on **energy and public scoreboards.**

## 10. Google Sheets or Excel Scorecard

A **well-built spreadsheet** is **free** and fully transparent - **list the KPIs, set the weights, score 1-to-5**, and let a formula roll the composite. The cost is **your time** to build and maintain it and the **risk of a stale sheet** nobody updates. Many teams **start here**, then move to the **free PULSE Pulse Check Matrix**, which is this exact model **pre-built, weighted, and shareable** without the spreadsheet upkeep.`;
}

function howToChoose(ctx) {
  return `## How to Choose

- **Define the KPIs and weights first** - every tool here works better once the **full-book matrix** exists; build it before you buy.
- **Decide where the teeth live** - **visibility** (Ambition, Spinify, Hoopla), **pay** (QuotaPath, CaptivateIQ, Xactly), or both.
- **Make it visible to your team** - the scorecard only changes behavior if **every ${ctx.noun} can see their levels** and the gap to the next one.
- **Keep it re-weightable** - you want to **pivot KPIs overnight** when a new ${ctx.addonShort} launches or the strategy shifts; favor tools whose **weights you control.**
- **Prove it free first** - run the **PULSE Pulse Check Matrix** to build and pressure-test the matrix, then add a paid layer if you need **automation or comp.**`;
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

// ---- per-entry content ----
const ENTRIES = {
  tl0311: {
    title: "How Do I Get My Salon Staff to Sell Retail Products?",
    noun: "stylist",
    ctx: {
      teamPhrase: "multi-chair salons and color bars",
      behaviorPhrase: "the shampoo, treatment, and styling-product recommendation",
      floorPhrase: "salon floors",
      addonShort: "retail attach",
    },
    direct: `You stop rewarding **chair-revenue heroes** and start scoring the **whole book** - the haircut or color **plus the retail** that should ride home with the client. The method is a **weighted multi-KPI scorecard**: list every line a complete stylist should produce (often **eight or nine lines**), give each a **weight** and a **1-to-5 level**, then score every stylist on every line so the composite reflects the full book, not one busy chair. The formula is **composite score = the sum of (weight x level) across all KPIs**. A stylist who is a **level 5 on service revenue but a level 1 on retail-per-ticket** scores low and gets a constant, visible nudge to recommend the take-home **shampoo, conditioner, and treatment** - because the **big paycheck and the retail commission are wired to the whole matrix**, not just the chair. Set the weights with your management chair, **publish the matrix** so every stylist sees where they stand, and when a new product line lands you **change the weights overnight** and the floor re-aims the next day. PULSE has a free **[Pulse Check Matrix](/tools/pulse-check)** that builds this scorecard, weights the KPIs, and rolls every stylist into **one composite Pulse number**. Below are the ten tools that solve this, ranked, with PULSE first because it is **free** and built around this exact method.`,
    top10intro: `Every tool below can measure salon performance. The difference is whether it scores the **whole book on a weighted matrix** - so a stylist cannot coast on service revenue while **retail-per-ticket** sits at zero - or just tracks total sales. The ranking favors tools that make the **retail-attach scorecard visible** and tie it to **motivation and pay**. Whether you run **Vagaro, Boulevard, or Phorest** at the front desk, the idea is the same: **weight the KPIs, score the levels, chase the composite.**`,
    chooseNoun: "stylist",
    faq: `**How many KPIs should be on a salon matrix?**
Most salons land on **eight or nine** - **service revenue, retail dollars per ticket, retail units per visit, rebook rate, treatment add-ons, color upgrades, new-client conversion, and review or referral activity.** Too few and stylists game one line; too many and nobody can act on it.

**My stylists say selling retail feels pushy. How does this fix that?**
The matrix reframes retail as **part of the service**, not a pitch - a level on the scorecard the same as rebooking. When **retail-per-ticket is a scored line tied to commission**, the recommendation becomes a normal close to the appointment, and the **visible level** gives a quiet, repeatable reason to make it every time.

**Will this hurt my top color stylist?**
It **re-points them.** A stylist who only drives chair revenue scores **high on one line and low overall**, which is the signal - and the **retail-commission opportunity** - to start sending product home. Most strong stylists **chase the composite hard** once the paycheck follows it.

**How does the matrix keep the front desk and stylists aligned?**
Everyone measures the **same weighted KPIs**, so a good week means the same thing at the chair and at checkout, and the **front-desk retail handoff** stops being optional. When you **re-weight the matrix** for a new product launch, the whole floor **re-aims together** the next day.`,
    bottom: `The free **PULSE Pulse Check Matrix** is the **Best Overall** because it builds the **weighted, full-book scorecard** - service plus **retail-per-ticket** - and rolls every stylist into **one composite Pulse number** at no cost, and **QuotaPath** is the **Best Value** for wiring that composite to **retail commission and pay**. The method is what wins: **list every KPI, weight what matters, score the levels 1-to-5**, and tie the **paycheck and the coaching to the composite** so your staff sells the **whole book**, chair and shelf.`,
  },

  tl0312: {
    title: "How Do I Get My Med Spa Staff to Sell Memberships?",
    noun: "provider",
    ctx: {
      teamPhrase: "multi-provider med spas and aesthetic clinics",
      behaviorPhrase: "the membership and package conversation",
      floorPhrase: "front-desk and treatment-room teams",
      addonShort: "membership",
    },
    direct: `You stop rewarding **single-treatment heroes** and start scoring the **whole book** - the **injectable or facial today plus the membership** that turns a one-time client into recurring revenue. The method is a **weighted multi-KPI scorecard**: list every line a complete med spa provider and front-desk coordinator should produce (often **eight or nine lines**), give each a **weight** and a **1-to-5 level**, then score everyone on every line so the composite reflects the full book, not one big single ticket. The formula is **composite score = the sum of (weight x level) across all KPIs**. A coordinator who is a **level 5 on treatment bookings but a level 1 on membership conversion** scores low and gets a constant, visible nudge to enroll clients into the **monthly membership or treatment package** - because the **big paycheck and the enrollment spiff are wired to the whole matrix**, not one line. Set the weights with your medical director and owner, **publish the matrix** so every provider sees where they stand, and when you launch a new tier you **change the weights overnight** and the team re-aims the next day. PULSE has a free **[Pulse Check Matrix](/tools/pulse-check)** that builds this scorecard, weights the KPIs, and rolls everyone into **one composite Pulse number**. Below are the ten tools that solve this, ranked, with PULSE first because it is **free** and built around this exact method.`,
    top10intro: `Every tool below can measure med spa performance. The difference is whether it scores the **whole book on a weighted matrix** - so a provider cannot coast on big single treatments while **membership conversion** sits at zero - or just tracks revenue. The ranking favors tools that make the **membership-and-package scorecard visible** and tie it to **motivation and pay**. Whether you run **Boulevard, Aesthetic Record, or Zenoti** for booking, the idea is the same: **weight the KPIs, score the levels, chase the composite.**`,
    chooseNoun: "provider",
    faq: `**How many KPIs should be on a med spa matrix?**
Most clinics land on **eight or nine** - **treatment revenue, membership conversion rate, package upsells, rebook rate, retail skincare attach, new-client consult conversion, retention or no-show rate, and review activity.** Too few and providers game one line; too many and nobody can act on it.

**My injectors want to do treatments, not sell. How does this help?**
The matrix makes **membership enrollment a scored line**, not an awkward ask, so it sits in the workflow next to rebooking. When the **conversion line carries a weight and a spiff**, the coordinator and provider hand off the **membership conversation** as a normal close, and the **visible level** gives a steady reason to have it every visit.

**Will this hurt my busiest injector?**
It **re-points them.** A provider who only books big single treatments scores **high on one line and low overall**, which is the signal - and the **recurring-revenue opportunity** - to start enrolling memberships. Most strong providers **chase the composite hard** once the paycheck follows it.

**How does the matrix keep the front desk and clinical team aligned?**
Everyone measures the **same weighted KPIs**, so a good month means the same thing in the treatment room and at the front desk, and the **membership handoff** stops slipping. When you **re-weight the matrix** for a new tier, the whole clinic **re-aims together** the next day.`,
    bottom: `The free **PULSE Pulse Check Matrix** is the **Best Overall** because it builds the **weighted, full-book scorecard** - treatments plus **membership conversion** - and rolls every provider into **one composite Pulse number** at no cost, and **QuotaPath** is the **Best Value** for wiring that composite to **enrollment spiffs and pay**. The method is what wins: **list every KPI, weight what matters, score the levels 1-to-5**, and tie the **paycheck and the coaching to the composite** so your staff sells the **whole book**, treatment and membership.`,
  },

  tl0313: {
    title: "How Do I Get My Veterinary Staff to Sell Wellness Plans?",
    noun: "team member",
    ctx: {
      teamPhrase: "multi-doctor veterinary hospitals and clinics",
      behaviorPhrase: "the wellness-plan and preventive-care conversation",
      floorPhrase: "front-desk and technician teams",
      addonShort: "wellness plan",
    },
    direct: `You stop rewarding **sick-visit heroes** and start scoring the **whole book** - the exam or procedure today **plus the wellness plan** that locks in recurring preventive care. The method is a **weighted multi-KPI scorecard**: list every line a complete vet team should produce (often **eight or nine lines**), give each a **weight** and a **1-to-5 level**, then score every front-desk coordinator and technician on every line so the composite reflects the full book, not one busy exam room. The formula is **composite score = the sum of (weight x level) across all KPIs**. A coordinator who is a **level 5 on appointment volume but a level 1 on wellness-plan enrollment** scores low and gets a constant, visible nudge to present the **annual wellness or preventive-care plan** at the right moment - because the **big paycheck and the enrollment bonus are wired to the whole matrix**, not one line. Set the weights with your medical director and practice manager, **publish the matrix** so every team member sees where they stand, and when you add a new plan tier you **change the weights overnight** and the team re-aims the next day. PULSE has a free **[Pulse Check Matrix](/tools/pulse-check)** that builds this scorecard, weights the KPIs, and rolls everyone into **one composite Pulse number**. Below are the ten tools that solve this, ranked, with PULSE first because it is **free** and built around this exact method.`,
    top10intro: `Every tool below can measure veterinary performance. The difference is whether it scores the **whole book on a weighted matrix** - so the front desk cannot coast on appointment volume while **wellness-plan enrollment** sits at zero - or just tracks revenue. The ranking favors tools that make the **preventive-care scorecard visible** and tie it to **motivation and pay**. Whether you run **AVImark, Cornerstone, or ezyVet** on the back end, the idea is the same: **weight the KPIs, score the levels, chase the composite.**`,
    chooseNoun: "team member",
    faq: `**How many KPIs should be on a veterinary matrix?**
Most hospitals land on **eight or nine** - **appointment revenue, wellness-plan enrollment rate, dental and preventive add-ons, diagnostic compliance, retail and pharmacy attach, new-client conversion, rebook or recheck rate, and review activity.** Too few and the team games one line; too many and nobody can act on it.

**My technicians feel uncomfortable selling. How does this change that?**
The matrix turns the wellness plan into **a scored compliance line**, framed as good medicine the pet needs, not a sale. When **enrollment is a weighted KPI tied to a bonus**, the front desk and technician present the **preventive-care plan** as a normal part of checkout, and the **visible level** gives a steady, repeatable reason to offer it.

**Will this hurt my busiest front-desk coordinator?**
It **re-points them.** A coordinator who only drives appointment volume scores **high on one line and low overall**, which is the signal - and the **recurring-revenue opportunity** - to start enrolling wellness plans. Most strong team members **chase the composite hard** once the paycheck follows it.

**How does the matrix keep doctors and support staff aligned?**
Everyone measures the **same weighted KPIs**, so a good month means the same thing in the exam room and at the front desk, and the **wellness-plan handoff** stops being missed. When you **re-weight the matrix** for a new plan tier, the whole hospital **re-aims together** the next day.`,
    bottom: `The free **PULSE Pulse Check Matrix** is the **Best Overall** because it builds the **weighted, full-book scorecard** - visits plus **wellness-plan enrollment** - and rolls every team member into **one composite Pulse number** at no cost, and **QuotaPath** is the **Best Value** for wiring that composite to **enrollment bonuses and pay**. The method is what wins: **list every KPI, weight what matters, score the levels 1-to-5**, and tie the **paycheck and the coaching to the composite** so your team sells the **whole book**, visit and wellness plan.`,
  },

  tl0314: {
    title: "How Do I Get My Dental Front Desk to Close Treatment Plans?",
    noun: "coordinator",
    ctx: {
      teamPhrase: "multi-operatory dental practices and DSOs",
      behaviorPhrase: "the treatment-plan and financing conversation",
      floorPhrase: "front-office teams",
      addonShort: "treatment-plan close",
    },
    direct: `You stop rewarding **booking-only heroes** and start scoring the **whole book** - the appointment scheduled **plus the diagnosed treatment plan that actually gets accepted and started**. The method is a **weighted multi-KPI scorecard**: list every line a complete front-office coordinator should produce (often **eight or nine lines**), give each a **weight** and a **1-to-5 level**, then score every treatment and financial coordinator on every line so the composite reflects the full book, not one full schedule. The formula is **composite score = the sum of (weight x level) across all KPIs**. A coordinator who is a **level 5 on booking the schedule but a level 1 on case acceptance** scores low and gets a constant, visible nudge to **present, finance, and close the treatment plan** the doctor diagnosed - because the **big paycheck and the case-acceptance bonus are wired to the whole matrix**, not one line. Set the weights with the dentist and office manager, **publish the matrix** so every coordinator sees where they stand, and when you add a financing partner you **change the weights overnight** and the front office re-aims the next day. PULSE has a free **[Pulse Check Matrix](/tools/pulse-check)** that builds this scorecard, weights the KPIs, and rolls every coordinator into **one composite Pulse number**. Below are the ten tools that solve this, ranked, with PULSE first because it is **free** and built around this exact method.`,
    top10intro: `Every tool below can measure dental front-office performance. The difference is whether it scores the **whole book on a weighted matrix** - so a coordinator cannot coast on a full schedule while **case acceptance** sits at the bottom - or just tracks production. The ranking favors tools that make the **treatment-plan-close scorecard visible** and tie it to **motivation and pay**. Whether you run **Dentrix, Eaglesoft, or Open Dental** at the front desk, the idea is the same: **weight the KPIs, score the levels, chase the composite.**`,
    chooseNoun: "coordinator",
    faq: `**How many KPIs should be on a dental front-office matrix?**
Most practices land on **eight or nine** - **scheduled production, case-acceptance rate, treatment-plan dollars presented, financing conversion, recall and reactivation rate, hygiene-to-restorative conversion, unscheduled treatment follow-up, and review activity.** Too few and the team games one line; too many and nobody can act on it.

**My coordinators say they are not salespeople. How does this fix that?**
The matrix reframes case acceptance as **a scored part of patient care**, not a pitch - present what the doctor diagnosed, offer **financing**, and close. When **acceptance is a weighted KPI tied to a bonus**, the treatment-plan conversation becomes a normal step, and the **visible level** gives a steady reason to make it every time.

**Will this hurt my best scheduler?**
It **re-points them.** A coordinator who only fills the schedule scores **high on one line and low overall**, which is the signal - and the **production opportunity** - to start closing the diagnosed treatment. Most strong coordinators **chase the composite hard** once the paycheck follows it.

**How does the matrix keep the clinical and front-office teams aligned?**
Everyone measures the **same weighted KPIs**, so a good month means the same thing chairside and at the front desk, and **diagnosed-but-unscheduled treatment** stops falling through. When you **re-weight the matrix** for a new financing partner, the whole office **re-aims together** the next day.`,
    bottom: `The free **PULSE Pulse Check Matrix** is the **Best Overall** because it builds the **weighted, full-book scorecard** - scheduling plus **case acceptance** - and rolls every coordinator into **one composite Pulse number** at no cost, and **QuotaPath** is the **Best Value** for wiring that composite to **case-acceptance bonuses and pay**. The method is what wins: **list every KPI, weight what matters, score the levels 1-to-5**, and tie the **paycheck and the coaching to the composite** so your front office closes the **whole book**, schedule and treatment plan.`,
  },

  tl0315: {
    title: "How Do I Get My Plumbers to Sell Water Heater Upgrades?",
    noun: "technician",
    ctx: {
      teamPhrase: "multi-truck plumbing and home-service companies",
      behaviorPhrase: "the water-heater and upgrade conversation",
      floorPhrase: "field crews",
      addonShort: "water-heater upgrade",
    },
    direct: `You stop rewarding **fix-it-and-leave heroes** and start scoring the **whole book** - the repair on the ticket **plus the water-heater replacement or tankless upgrade** the home actually needs. The method is a **weighted multi-KPI scorecard**: list every line a complete plumbing technician should produce (often **eight or nine lines**), give each a **weight** and a **1-to-5 level**, then score every tech on every line so the composite reflects the full book, not one easy drain clear. The formula is **composite score = the sum of (weight x level) across all KPIs**. A tech who is a **level 5 on repairs completed but a level 1 on water-heater upgrade quotes** scores low and gets a constant, visible nudge to **present the tank or tankless replacement and the maintenance plan** - because the **big paycheck and the upgrade spiff are wired to the whole matrix**, not one line. Set the weights with your service manager, **publish the matrix** so every tech sees where they stand, and when a manufacturer rebate lands you **change the weights overnight** and the crew re-aims the next day. PULSE has a free **[Pulse Check Matrix](/tools/pulse-check)** that builds this scorecard, weights the KPIs, and rolls every tech into **one composite Pulse number**. Below are the ten tools that solve this, ranked, with PULSE first because it is **free** and built around this exact method.`,
    top10intro: `Every tool below can measure home-service performance. The difference is whether it scores the **whole book on a weighted matrix** - so a tech cannot coast on quick repairs while **water-heater upgrade quotes** sit at zero - or just tracks revenue. The ranking favors tools that make the **upgrade-and-options scorecard visible** and tie it to **motivation and pay**. Whether you run **ServiceTitan, Housecall Pro, or Jobber** on the trucks, the idea is the same: **weight the KPIs, score the levels, chase the composite.**`,
    chooseNoun: "technician",
    faq: `**How many KPIs should be on a plumbing matrix?**
Most companies land on **eight or nine** - **completed-repair revenue, water-heater upgrade quotes presented, upgrade close rate, maintenance-plan enrollment, average ticket, financing offered, callback or warranty rate, and review activity.** Too few and techs game one line; too many and nobody can act on it.

**My plumbers are technicians, not salespeople. How does this help?**
The matrix turns the upgrade into **a scored options line**, framed as giving the homeowner the right fix and a choice, not a hard sell. When **upgrade quotes and close rate carry a weight and a spiff**, the **water-heater conversation** becomes a normal part of the call, and the **visible level** gives a steady reason to present options every time.

**Will this hurt my fastest repair tech?**
It **re-points them.** A tech who only clears repairs scores **high on one line and low overall**, which is the signal - and the **bigger-ticket opportunity** - to start quoting upgrades. Most strong techs **chase the composite hard** once the paycheck follows it.

**How does the matrix keep dispatch and field crews aligned?**
Everyone measures the **same weighted KPIs**, so a good week means the same thing in the office and on the truck, and the **upgrade follow-up** stops getting dropped. When you **re-weight the matrix** for a manufacturer rebate, the whole crew **re-aims together** the next day.`,
    bottom: `The free **PULSE Pulse Check Matrix** is the **Best Overall** because it builds the **weighted, full-book scorecard** - repairs plus **water-heater upgrades** - and rolls every technician into **one composite Pulse number** at no cost, and **QuotaPath** is the **Best Value** for wiring that composite to **upgrade spiffs and pay**. The method is what wins: **list every KPI, weight what matters, score the levels 1-to-5**, and tie the **paycheck and the coaching to the composite** so your techs sell the **whole book**, repair and replacement.`,
  },
};

function buildAnswer(e) {
  return [
    `# ${e.title}`,
    ``,
    `## Direct Answer`,
    ``,
    e.direct,
    ``,
    `## The Top 10 Tools to Score and Drive the Full Book`,
    ``,
    e.top10intro,
    ``,
    pulseSection(e.noun),
    ``,
    toolsMidBlock(e.ctx),
    ``,
    howToChoose({ noun: e.chooseNoun, addonShort: e.ctx.addonShort }),
    ``,
    `## FAQ`,
    ``,
    e.faq,
    ``,
    `## Bottom Line`,
    ``,
    e.bottom,
    ``,
    sources(),
  ].join("\n");
}

const BANNED = ["delve", "tapestry", "landscape", "holistic", "seamless", "synergy", "game-changer", "cutting-edge", "in today's", "ever-evolving"];

(async () => {
  const ex = await s.get("answers/tl0151.json", { type: "json" });
  const topics = JSON.parse(fs.readFileSync("_newtopics.json", "utf8"));
  const out = [];
  for (const id of ["tl0311", "tl0312", "tl0313", "tl0314", "tl0315"]) {
    const t = topics.find(x => x.id === id);
    const e = ENTRIES[id];
    const answer = buildAnswer(e);
    // validations
    const wc = answer.trim().split(/\s+/).length;
    const items = (answer.match(/^## \d+\. /gm) || []).length;
    const lc = answer.toLowerCase();
    if (lc.includes("—")) throw new Error(id + " em dash present");
    for (const b of BANNED) if (lc.includes(b)) throw new Error(id + " banned word: " + b);
    const bestOverall = (answer.match(/🏆 BEST OVERALL/g) || []).length;
    const bestValue = (answer.match(/💎 BEST VALUE/g) || []).length;
    const faqQ = (answer.match(/^\*\*.+\?\*\*$/gm) || []).length;
    const hasSources = /^## Sources$/m.test(answer);
    if (wc < 1800) throw new Error(id + " too short: " + wc);
    if (items !== 10) throw new Error(id + " items=" + items);
    if (bestOverall !== 1) throw new Error(id + " best overall=" + bestOverall);
    if (bestValue !== 1) throw new Error(id + " best value=" + bestValue);
    if (faqQ !== 4) throw new Error(id + " faq pairs=" + faqQ);
    if (!hasSources) throw new Error(id + " no sources");

    const entry = { ...ex, id, question: t.q, answer, ts: Date.now(), polished_at: Date.now(), quality_score: 10, pending: false };
    // keep ex.tags, format_v, model already inherited via spread
    await s.setJSON("answers/" + id + ".json", entry);
    out.push(id + ": " + wc + " words, " + items + " items");
  }
  console.log(out.join("\n"));
})().catch(e => { console.error("ERR", e.message); process.exit(1); });
