const fs = require("fs");
const env = fs.readFileSync(".env.local", "utf8");
const TOK = (env.match(/NETLIFY_AUTH_TOKEN=(.+)/) || env.match(/BLOBS_PAT=(.+)/) || [])[1].trim();
const { getStore } = require("@netlify/blobs");
const s = getStore({ name: "pulse-machine-library", siteID: "a2b74b30-a1ac-40e2-9622-aebfc2feb482", token: TOK });

const BANNED = ["delve","tapestry","landscape","holistic","seamless","synergy","game-changer","cutting-edge","in today's","ever-evolving"];

function strictWords(answer) {
  const lines = answer.split("\n").filter(l => {
    const t = l.trim();
    if (t.startsWith("@@PRODUCT")) return false;
    if (t.startsWith("![")) return false;
    if (/img="|site="/.test(t)) return false;
    return true;
  });
  let txt = lines.join(" ");
  txt = txt.replace(/->/g, " ");
  txt = txt.replace(/🏆|💎|🛠️/g, " ");
  txt = txt.replace(/[#*_>`\[\]()~|]/g, " ");
  const words = txt.split(/\s+/).filter(w => w.length > 0 && /[a-zA-Z0-9]/.test(w));
  return words.length;
}

function pulseSection(bookPhrase, repNoun, easyLine, hardLine, pivotLine) {
  return `## 1. PULSE Pulse Check Matrix 🏆 BEST OVERALL
@@PRODUCT name="PULSE Pulse Check Matrix" img="https://static.vecteezy.com/system/resources/thumbnails/031/381/679/small_2x/close-up-woman-hand-is-checking-pulse-on-wrist-hand-compare-pulse-rhythm-with-watch-concept-medical-health-care-self-checking-heart-rate-pulse-on-wrist-free-photo.JPG" site="https://www.vecteezy.com/free-photos/checking-pulse"

> 🛠️ **Use it free now -> [Pulse Check Matrix](/tools/pulse-check)** - no login, no spreadsheet, every ${repNoun} rolled into one weighted Pulse number.

PULSE's free **[Pulse Check Matrix](/tools/pulse-check)** runs the whole method in your browser. You **define the KPIs** that matter, **weight what matters most**, **score each ${repNoun} 1-to-5** on every line, and it returns **one composite Pulse number** per person. Here is the method it is built on, because the scorecard is the point and the tool is just the engine that runs it:

**Step one - list every KPI, not just the easy win.** Write down the eight or nine behaviors a complete ${repNoun} should produce - ${bookPhrase}. If a behavior is not on the matrix, it does not get coached and it does not get done. The act of writing the list is half the value, because it forces leadership to agree on what **good** actually looks like before anyone is scored.

**Step two - weight what matters and score the levels.** Assign each KPI a **weight** with leadership, then score every ${repNoun} **1-to-5** on each line where **1 is absent and 5 is the standard you want every person to hit**. A rep at **${easyLine}** lands a low composite, and the matrix makes the gap **impossible to hide** and turns it into a single clear next move instead of a vague coaching note. The levels also give a manager language: instead of saying **do better**, the manager says **move this line from a 2 to a 3 and here is what a 3 looks like.**

**Step three - wire the paycheck and the coaching to the composite.** When the **big money and the weekly one-on-one both follow the composite**, not one flashy line, the team rounds out its behavior on its own. It is a **constant motivator** rather than a one-time review: everyone can see their own levels, everyone can see the gap to the next level, and the only way up is to **do more of what the business actually needs.** ${hardLine}

Because the weights are yours to set, you also get to **pivot on a dime** - ${pivotLine}, you **re-weight the matrix**, and the whole team re-aims the next day with no confusion and no rewrite of the comp plan. It **aligns sales, RevOps, and the front-line manager** on one picture of performance. **Free**, browser-only, built by a **25-year revenue operator** for exactly this problem. **Best for:** leaders who want the **whole behavior measured and rewarded**, not one easy number gamed.`;
}

function items2to10(behavior, signalLine) {
  return `## 2. Ambition
@@PRODUCT name="Ambition" img="https://img.freepik.com/premium-vector/ambition-illustration-with-entrepreneur-climbing-ladder-success-career-development_2175-13827.jpg?w=2000" site="https://www.freepik.com/premium-vector/ambition-illustration-with-entrepreneur-climbing-ladder-success-career-development_40680627.htm"

**Ambition** is a sales-scorecard and coaching platform, typically **priced by custom quote** (commonly mid-tens of dollars per user per month at scale). It builds **weighted scorecards** across multiple metrics, pipes them onto **TVs and Slack**, and ties them to **structured coaching cadences and one-on-one agendas**. It is the **closest paid cousin to the matrix method** because it is genuinely multi-KPI rather than a single leaderboard number, and it is strong for larger inside-sales teams that want the scorecard **automated straight off the CRM** with no manual data entry. You bring the weights and the definition of ${behavior}; Ambition runs the **visibility, accountability, and coaching-workflow** layer on top.

## 3. Spinify
@@PRODUCT name="Spinify" img="https://spinify.com/wp-content/uploads/2022/08/Spinify.jpg" site="https://spinify.com/"

**Spinify** gamifies performance with **leaderboards, competitions, and scorecards**, with plans commonly from around **$10 to $20 per user per month**. It can score **several metrics at once** and pushes recognition in real time, which keeps the harder behaviors **top of mind** during the day rather than only at quarter end. It leans more toward **motivation and recognition than rigorous weighting**, so it pairs well with a matrix you define elsewhere and then broadcast through Spinify. A fit for teams that **respond to visible competition** and need energy around the behavior, not just a number in a report.

## 4. Salesforce (custom scorecards)
@@PRODUCT name="Salesforce (custom scorecards)" img="https://www.slideteam.net/media/catalog/product/cache/1280x720/s/a/salesforce_scorecard_metric_salesforce_scorecard_with_industry_wise_comparator_metric_slide01.jpg" site="https://www.slideteam.net/salesforce-scorecard-metric-salesforce-scorecard-with-industry-wise-comparator-metric.html"

**Salesforce**, from about **$25 per user per month** up to enterprise tiers, can host a **weighted scorecard** through custom dashboards, reports, and formula fields built on your own data. It will not hand you the matrix out of the box, so **you build it**, but it already holds every input the composite needs, which is why so many teams run their scorecard here. ${signalLine} **Best for** teams already standardized on Salesforce that want the scorecard living **right next to the pipeline** so the score and the deal are never in two different systems.

## 5. QuotaPath 💎 BEST VALUE
@@PRODUCT name="QuotaPath" img="https://5cd97948.delivery.rocketcdn.me/wp-content/uploads/Article_Header-5.png" site="https://www.quotapath.com/blog/hubspot-essential-app-attainment-earnings-launch/"

**QuotaPath** is the **best value** here for tying the scorecard to **pay**, with a **free tier** and paid plans from around **$15 per user per month**. It tracks **attainment across multiple plan components**, so you can weight several behaviors and show each person exactly how the **mix drives their commission** in real time instead of in a surprise statement at month end. For a team that wants the **composite wired to the paycheck** without enterprise comp-platform cost, it is the practical pick, and it pairs cleanly with the **free PULSE matrix** for the actual 1-to-5 scoring view.

## 6. CaptivateIQ
@@PRODUCT name="CaptivateIQ" img="https://mma.prnewswire.com/media/2140935/CaptivateIQ_Logo.jpg" site="https://vendordirectory.shrm.org/company/911410/news/3551414/captivateiq-unveils-quotient-transforms-commissions-management-for-compensation-professionals"

**CaptivateIQ** is **incentive-compensation software** (custom pricing) built to run **multi-component commission plans** with full audit trails. If the behavior you want lives in comp, paying on several weighted lines with different rates, it **models and pays those plans accurately at scale** without the spreadsheet errors that erode rep trust. It is more **comp engine than scorecard**, but comp is how a matrix gets real teeth, and many teams run the scoring in PULSE and the payout in CaptivateIQ. **Best for** teams whose behavior strategy is ultimately **enforced through pay** rather than recognition.

## 7. Xactly
@@PRODUCT name="Xactly" img="https://seeklogo.com/images/X/xactly-logo-23BD661C2E-seeklogo.com.png" site="https://seeklogo.com/vector-logo/489012/xactly"

**Xactly** is an **enterprise incentive-comp and sales-performance platform** (custom pricing) with deep plan modeling, territory and quota management, and analytics. It suits **larger organizations** that must administer **complex multi-KPI plans** across big distributed teams with **audit, forecasting, and governance** requirements. Like CaptivateIQ, it enforces the desired behavior through **compensation** rather than a visual coaching matrix, so it is the destination once scale and plan complexity outgrow lighter tools. A fit **once a finance team needs control** over how every behavior maps to a dollar.

## 8. Gong
@@PRODUCT name="Gong" img="https://healing-sounds.com/cdn/shop/files/24-chinese-gong-set-stand-perfect-tone-instrument-large-gongs-854.jpg?v=1715793252&width=1000" site="https://healing-sounds.com/products/24-inch-chinese-gong-metal-stand-mallet"

**Gong** (custom pricing) **scores conversations, emails, and activity**, surfacing whether reps are actually **doing ${behavior}** in real calls rather than just logging it. It adds a **behavioral dimension the CRM numbers miss**, because a field can say a step happened while the recording shows it did not. It is not a comp or matrix tool, but it **feeds the matrix real, evidence-based coaching signal** so a manager can score a 1-to-5 level on what truly happened. **Best as a complement** to the scorecard for teams with the budget for revenue intelligence.

## 9. Hoopla (by Raydiant)
@@PRODUCT name="Hoopla (by Raydiant)" img="https://images.ctfassets.net/vztl6s0hp3ro/1SQNBemr8DLWewU3ZsqDWO/104da8324f866d7d36d88063217d4a6a/Hoopla.jpg" site="https://www.testgorilla.com/blog/gamification-in-hr/"

**Hoopla** is a **motivation and recognition platform** with leaderboards, newsflashes, and scorecards, **priced by quote**. It **broadcasts performance** across multiple metrics to keep the harder behaviors **visible to the whole team** in real time, celebrating the behavior you want the moment it happens. Like Spinify, it favors **motivation and recognition over rigorous weighting**, so it **complements a defined matrix** rather than replacing it. A fit for teams that run on **energy, public scoreboards, and instant recognition** to drive the behavior home.

## 10. Google Sheets or Excel Scorecard
@@PRODUCT name="Google Sheets or Excel Scorecard" img="https://www.smartsheet.com/sites/default/files/2024-06/IC-Google-Sheets-Balanced-Scorecard-Dashboard-Example-Template.png" site="https://www.smartsheet.com/content/google-sheets-balanced-scorecard-template"

A **well-built spreadsheet** is **free** and fully transparent, so you **list the KPIs, set the weights, score 1-to-5**, and let a formula roll the composite for every rep. The cost is **your time** to build and maintain it and the very real **risk of a stale sheet** that nobody updates after the first month. Many teams **start here**, prove the method, then move to the **free PULSE Pulse Check Matrix**, which is this exact model **pre-built, weighted, and shareable** with no spreadsheet upkeep and no broken formula when someone inserts a row.`;
}

function choose(behavior) {
  return `## How to Choose

- **Define the KPIs and weights first** - every tool here works better once the **matrix for ${behavior}** exists; build it before you buy anything.
- **Decide where the teeth live** - **visibility** (Ambition, Spinify, Hoopla), **pay** (QuotaPath, CaptivateIQ, Xactly), or both at once.
- **Make it visible to the rep** - the scorecard only changes behavior if **every rep can see their own levels** and the exact gap to the next one.
- **Keep it re-weightable** - you want to **re-weight KPIs overnight** when strategy or the market shifts; favor tools whose **weights you control** without an admin ticket.
- **Prove it free first** - run the **PULSE Pulse Check Matrix** to build and pressure-test the matrix, then layer on a paid tool only if you need **automation or comp.**`;
}

function faq(repNoun, behavior, bookPhrase, q1, a1, q2, a2) {
  return `## FAQ

**${q1}**
${a1}

**${q2}**
${a2}

**Will this hurt my fastest ${repNoun}?**
It **re-points them.** A ${repNoun} who is strong on one line and weak on the rest scores **high on a single KPI and low overall**, which is the signal, and the income opportunity, to round out. Most strong performers **chase the composite hard** once the paycheck and the praise both follow it instead of the one flashy number.

**How does the matrix keep sales, RevOps, and the manager aligned?**
Everyone measures the **same weighted KPIs**, so the definition of a good week is **identical across the team**, and the handoffs stop arguing about what counts as good. When you **re-weight the matrix**, all three roles **re-aim together** the next day instead of working off three different scorecards.`;
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

const ENTRIES = {
  tl0506: {
    q: "How Do I Score My Reps on Pipeline Hygiene?",
    repNoun: "rep",
    behavior: "pipeline hygiene",
    direct: `You stop trusting a **clean-looking forecast** and start scoring the **discipline behind it**. The method is a **weighted multi-KPI scorecard**: list every hygiene behavior a complete rep should produce - **next-step on every open deal, accurate close dates, stage-exit criteria met, no past-due close dates, deal amounts kept current, stalled deals worked or closed, and notes logged within 24 hours** - give each one a **weight** and a **1-to-5 level**, then score every rep so the composite reflects real pipeline discipline, not a tidy screenshot. The formula is **composite score = the sum of (weight x level) across all KPIs**. A rep who is a **level 5 on closing but a level 1 on next-steps and close-date accuracy** scores low and gets a constant, visible nudge to **keep the pipeline honest** - because the **scorecard is wired to the whole matrix**, not one closed-won number. Set the weights with leadership, **publish the matrix** so every rep sees where they stand, and when the forecast process tightens you **change the weights overnight** and the team re-aims the next day. PULSE has a free **[Pulse Check Matrix](/tools/pulse-check)** that builds this scorecard, weights the KPIs, and rolls every rep into **one composite Pulse number**. Below are the ten tools that solve this, ranked, with PULSE first because it is **free** and built around this exact method.`,
    bookPhrase: "**a logged next-step on every open deal, accurate and non-past-due close dates, stage-exit criteria met before advancing, current deal amounts, stalled deals worked or closed out, and notes logged within 24 hours**",
    easyLine: "level 5 on closing but a level 1 on next-steps and close-date accuracy",
    hardLine: "Pipeline hygiene is the behavior managers complain about most and measure least, because the data lives scattered across fields nobody scores together; the matrix pulls all of it into one honest number.",
    pivotLine: "your forecast call gets tighter or a new stage-exit policy lands",
    top10intro: `Every tool below can report on pipeline. The difference is whether it scores the **discipline on a weighted matrix** - so reps cannot hide a messy pipeline behind one good month - or just shows you a stage chart. The ranking favors tools that make the **hygiene scorecard visible** and tie it to **motivation and pay**. A founder-led team, a mid-market sales floor, or an enterprise org all use the same idea: **weight the KPIs, score the levels, chase the composite.**`,
    behaviorTool: "pipeline hygiene",
    signalLine: "It is also where most teams already store the raw hygiene fields like next-step, close date, and stage, so the scoring inputs are sitting there waiting to be weighted.",
    faqQ1: "How many hygiene KPIs should be on the matrix?",
    faqA1: "Most teams land on **seven to nine** - enough to cover next-steps, close-date accuracy, stage-exit discipline, amount accuracy, and stall management without becoming noise. Too few and reps game one field; too many and a manager cannot coach all of them in a weekly one-on-one.",
    faqQ2: "How do I score a 1-to-5 hygiene level objectively?",
    faqA2: "Anchor each level to a **measurable threshold** so it is not a feeling: for example, a 5 on next-steps means **100 percent of open deals have a future-dated next-step**, a 3 means **70 to 89 percent**, and a 1 means **under half**. Publish the anchors so reps know exactly what moves them up a level.",
    bottom: `The free **PULSE Pulse Check Matrix** is the **Best Overall** because it builds the **weighted hygiene scorecard** and rolls every rep into **one composite Pulse number** at no cost, and **QuotaPath** is the **Best Value** for wiring that composite to **pay**. The method is what wins: **list every hygiene KPI, weight what matters, score the levels 1-to-5**, and tie the **scorecard and the coaching to the composite** so the pipeline is **honest, not just pretty.**`,
  },
  tl0507: {
    q: "How Do I Get My Reps to Follow the Sales Process?",
    repNoun: "rep",
    behavior: "sales-process adherence",
    direct: `You stop hoping reps **remember the playbook** and start scoring **adherence to it**. The method is a **weighted multi-KPI scorecard**: list every process step a complete rep should execute - **qualification framework completed, discovery before demo, mutual action plan built, economic buyer engaged, stage-exit criteria met, required fields filled, and the agreed sales methodology followed** - give each one a **weight** and a **1-to-5 level**, then score every rep so the composite reflects true process discipline, not a deal that happened to close. The formula is **composite score = the sum of (weight x level) across all KPIs**. A rep who is a **level 5 on charisma but a level 1 on qualification and mutual action plans** scores low and gets a constant, visible nudge to **run the play** - because the **scorecard is wired to the whole matrix**, not one lucky close. Set the weights with leadership, **publish the matrix** so every rep sees where they stand, and when you roll out a new methodology you **change the weights overnight** and the team re-aims the next day. PULSE has a free **[Pulse Check Matrix](/tools/pulse-check)** that builds this scorecard, weights the KPIs, and rolls every rep into **one composite Pulse number**. Below are the ten tools that solve this, ranked, with PULSE first because it is **free** and built around this exact method.`,
    bookPhrase: "**qualification framework completed, discovery run before the demo, a mutual action plan built, the economic buyer engaged, stage-exit criteria met, required fields filled, and the agreed methodology actually followed**",
    easyLine: "level 5 on charisma but a level 1 on qualification and mutual action plans",
    hardLine: "Process adherence is where coaching either lands or evaporates, because a rep who closes on instinct will skip the steps until the matrix makes every skipped step show up in the score and the paycheck.",
    pivotLine: "you adopt a new sales methodology or change the stage definitions",
    top10intro: `Every tool below can track activity. The difference is whether it scores **process adherence on a weighted matrix** - so reps cannot freelance past the playbook on a hot deal - or just counts calls. The ranking favors tools that make the **adherence scorecard visible** and tie it to **motivation and pay**. A team adopting MEDDICC, a floor running a custom playbook, or an enterprise rolling out a new methodology all use the same idea: **weight the KPIs, score the levels, chase the composite.**`,
    behaviorTool: "sales-process adherence",
    signalLine: "Many teams encode the playbook as required stage-exit fields and path guidance right inside Salesforce, which gives the matrix a clean per-step input to score.",
    faqQ1: "How do I score process adherence without micromanaging?",
    faqA1: "Score the **outcomes of the steps, not the keystrokes** - did the mutual action plan exist, was discovery run before the demo, was the economic buyer engaged. Weight the few steps that actually predict won deals heavily and let the rest stay light, so the matrix reinforces the **spine of the process** rather than every minor field.",
    faqQ2: "What if a top rep closes deals while skipping the process?",
    faqA2: "They score **high on results and low on adherence**, which is exactly the conversation to have, because a skipped process does not scale to the rest of the team and breaks the moment that rep leaves. Use the matrix to make the case that **following the play protects their own renewals and handoffs**, not just the manager's reports.",
    bottom: `The free **PULSE Pulse Check Matrix** is the **Best Overall** because it builds the **weighted adherence scorecard** and rolls every rep into **one composite Pulse number** at no cost, and **QuotaPath** is the **Best Value** for wiring that composite to **pay**. The method is what wins: **list every process step, weight what matters, score the levels 1-to-5**, and tie the **scorecard and the coaching to the composite** so the team **runs the play, not just its instincts.**`,
  },
  tl0508: {
    q: "How Do I Score My Reps on Discovery Quality?",
    repNoun: "rep",
    behavior: "discovery quality",
    direct: `You stop grading discovery by **gut feel after a call** and start scoring it on a **defined rubric**. The method is a **weighted multi-KPI scorecard**: list every discovery behavior a complete rep should produce - **pain quantified in dollars, decision process mapped, decision criteria captured, metrics and impact established, champion identified, competition surfaced, and next steps confirmed** - give each one a **weight** and a **1-to-5 level**, then score every rep so the composite reflects real discovery depth, not a friendly conversation. The formula is **composite score = the sum of (weight x level) across all KPIs**. A rep who is a **level 5 on rapport but a level 1 on quantifying pain and mapping the decision process** scores low and gets a constant, visible nudge to **dig deeper** - because the **scorecard is wired to the whole matrix**, not one likeable call. Set the weights with leadership, **publish the matrix** so every rep sees where they stand, and when your qualification framework changes you **change the weights overnight** and the team re-aims the next day. PULSE has a free **[Pulse Check Matrix](/tools/pulse-check)** that builds this scorecard, weights the KPIs, and rolls every rep into **one composite Pulse number**. Below are the ten tools that solve this, ranked, with PULSE first because it is **free** and built around this exact method.`,
    bookPhrase: "**pain quantified in dollars, the decision process mapped, decision criteria captured, metrics and business impact established, the champion identified and tested, competition surfaced, and concrete next steps confirmed**",
    easyLine: "level 5 on rapport but a level 1 on quantifying pain and mapping the decision process",
    hardLine: "Discovery is the highest-leverage skill on the team and the hardest to grade fairly, because two managers will score the same call differently until a shared rubric and 1-to-5 levels remove the guesswork.",
    pivotLine: "you change the qualification framework or sell into a new buyer persona",
    top10intro: `Every tool below can capture a call. The difference is whether it scores **discovery quality on a weighted rubric** - so a likeable call is not mistaken for a deep one - or just stores the recording. The ranking favors tools that make the **discovery scorecard visible** and tie it to **motivation and coaching**. A team learning MEDDICC, a floor running SPIN, or an enterprise standardizing qualification all use the same idea: **weight the KPIs, score the levels, chase the composite.**`,
    behaviorTool: "discovery quality",
    signalLine: "Reps log discovery fields like pain, metrics, and decision criteria in Salesforce already, so the matrix can pull those captured answers in as direct inputs to the discovery score.",
    faqQ1: "How do I keep discovery scoring consistent across managers?",
    faqA1: "Write a **shared rubric with anchored 1-to-5 levels** for each line - for example, a 5 on quantified pain means **a dollar figure tied to a metric the buyer confirmed**, a 3 means **a directional cost with no hard number**, a 1 means **no pain established**. When every manager scores against the same anchors, the composite means the same thing across the whole team.",
    faqQ2: "Should I score discovery from the CRM or from the call recording?",
    faqA2: "Use **both**: the CRM fields tell you what the rep captured, and a recording tool tells you whether it actually happened on the call. Feed the recording evidence into the matrix so a rep cannot earn a high discovery score by filling fields after a shallow conversation.",
    bottom: `The free **PULSE Pulse Check Matrix** is the **Best Overall** because it builds the **weighted discovery rubric** and rolls every rep into **one composite Pulse number** at no cost, and **QuotaPath** is the **Best Value** for tying that composite to **pay** where you choose. The method is what wins: **list every discovery KPI, weight what matters, score the levels 1-to-5**, and tie the **scorecard and the coaching to the composite** so discovery is **deep, not just pleasant.**`,
  },
  tl0509: {
    q: "How Do I Get My Reps to Multithread Enterprise Deals?",
    repNoun: "rep",
    behavior: "multithreading enterprise deals",
    direct: `You stop letting deals ride on a **single contact** and start scoring **multithreading**. The method is a **weighted multi-KPI scorecard**: list every multithreading behavior a complete rep should produce - **number of contacts engaged per account, economic buyer reached, champion confirmed, executive sponsor engaged, multiple personas mapped, blockers identified, and a buying committee documented** - give each one a **weight** and a **1-to-5 level**, then score every rep so the composite reflects real account coverage, not a friendly single thread. The formula is **composite score = the sum of (weight x level) across all KPIs**. A rep who is a **level 5 on working one champion but a level 1 on reaching the economic buyer and executive sponsor** scores low and gets a constant, visible nudge to **widen the deal** - because the **scorecard is wired to the whole matrix**, not one relationship. Set the weights with leadership, **publish the matrix** so every rep sees where they stand, and when you move upmarket you **change the weights overnight** and the team re-aims the next day. PULSE has a free **[Pulse Check Matrix](/tools/pulse-check)** that builds this scorecard, weights the KPIs, and rolls every rep into **one composite Pulse number**. Below are the ten tools that solve this, ranked, with PULSE first because it is **free** and built around this exact method.`,
    bookPhrase: "**contacts engaged per account, the economic buyer reached, a champion confirmed and tested, an executive sponsor engaged, multiple personas mapped, blockers and detractors identified, and the full buying committee documented**",
    easyLine: "level 5 on working one champion but a level 1 on reaching the economic buyer and executive sponsor",
    hardLine: "Single-threaded deals are the quiet killer of enterprise forecasts, because one champion leaving can erase a quarter; the matrix turns coverage from a hope into a scored, coached behavior.",
    pivotLine: "you move upmarket or a champion-led deal stalls and you need executive coverage",
    top10intro: `Every tool below can track contacts. The difference is whether it scores **multithreading on a weighted matrix** - so a deal is not allowed to ride on one relationship - or just counts logged people. The ranking favors tools that make the **coverage scorecard visible** and tie it to **motivation and coaching**. A team moving upmarket, a floor chasing six-figure deals, or an enterprise managing committees all use the same idea: **weight the KPIs, score the levels, chase the composite.**`,
    behaviorTool: "multithreading",
    signalLine: "Contact roles, buying-committee relationships, and opportunity-contact links all live in Salesforce, which gives the matrix a real count of threads and personas to score per deal.",
    faqQ1: "How many threads counts as healthy multithreading?",
    faqA1: "It depends on deal size, but a useful anchor for enterprise is a **5 means three or more personas engaged including the economic buyer and an executive sponsor**, a 3 means **a champion plus one other contact**, and a 1 means **single-threaded**. Set the anchors to your average winning deal's contact count so the levels reflect what actually closes.",
    faqQ2: "How do I score multithreading without rewarding contact-stuffing?",
    faqA2: "Score **quality of role, not raw count** - weight the economic buyer, champion, and executive sponsor far above a random logged contact, so a rep cannot earn a 5 by adding ten irrelevant names. The matrix should reward **reaching the people who decide**, not padding the contact list.",
    bottom: `The free **PULSE Pulse Check Matrix** is the **Best Overall** because it builds the **weighted coverage scorecard** and rolls every rep into **one composite Pulse number** at no cost, and **QuotaPath** is the **Best Value** for tying that composite to **pay**. The method is what wins: **list every multithreading KPI, weight what matters, score the levels 1-to-5**, and tie the **scorecard and the coaching to the composite** so deals are **wide, not single-threaded.**`,
  },
  tl0510: {
    q: "How Do I Score My CSMs on Retention and Expansion?",
    repNoun: "CSM",
    behavior: "retention and expansion",
    direct: `You stop judging CSMs by **gross renewal alone** and start scoring the **full motion**. The method is a **weighted multi-KPI scorecard**: list every outcome a complete CSM should produce - **gross and net revenue retention, expansion and upsell pipeline created, product adoption and health scores, on-time QBRs delivered, at-risk accounts saved, advocacy and references generated, and renewal timeliness** - give each one a **weight** and a **1-to-5 level**, then score every CSM so the composite reflects retention and growth together, not one renewal that would have happened anyway. The formula is **composite score = the sum of (weight x level) across all KPIs**. A CSM who is a **level 5 on renewals but a level 1 on expansion pipeline and adoption** scores low and gets a constant, visible nudge to **grow the book** - because the **scorecard is wired to the whole matrix**, not one retention number. Set the weights with leadership, **publish the matrix** so every CSM sees where they stand, and when the company tilts toward net-revenue-retention you **change the weights overnight** and the team re-aims the next day. PULSE has a free **[Pulse Check Matrix](/tools/pulse-check)** that builds this scorecard, weights the KPIs, and rolls every CSM into **one composite Pulse number**. Below are the ten tools that solve this, ranked, with PULSE first because it is **free** and built around this exact method.`,
    bookPhrase: "**gross and net revenue retention, expansion and upsell pipeline created, product adoption and health scores, on-time QBRs delivered, at-risk accounts saved, advocacy and references generated, and renewals closed on time**",
    easyLine: "level 5 on renewals but a level 1 on expansion pipeline and adoption",
    hardLine: "Customer success lives or dies on net revenue retention, yet most teams only measure the renewal, which rewards holding the line instead of growing the book; the matrix scores both so a CSM is paid to expand, not just defend.",
    pivotLine: "the company shifts its target from logo retention to net revenue retention",
    top10intro: `Every tool below can track accounts. The difference is whether it scores **retention and expansion on a weighted matrix** - so a CSM cannot coast on easy renewals while growth stalls - or just shows a renewal date. The ranking favors tools that make the **CSM scorecard visible** and tie it to **motivation and pay**. A team chasing net revenue retention, a post-sale org adding expansion quotas, or an enterprise success function all use the same idea: **weight the KPIs, score the levels, chase the composite.**`,
    behaviorTool: "retention and expansion",
    signalLine: "Renewal opportunities, expansion pipeline, and account health often live in Salesforce alongside the customer record, so the matrix can score a CSM's full motion from the same source the renewal is booked in.",
    faqQ1: "Should expansion and retention be on the same CSM scorecard?",
    faqA1: "Yes, because scoring them together is what produces **net revenue retention** rather than a CSM optimizing renewals while expansion goes unowned. Weight retention heavily enough that no CSM ignores at-risk accounts, but weight expansion pipeline enough that **growth is a scored responsibility**, not a bonus nobody is measured on.",
    faqQ2: "How do I score a CSM on accounts that were always going to renew?",
    faqA2: "Score the **leading behaviors, not just the renewal outcome** - adoption driven, QBRs delivered, health improved, expansion sourced - so a CSM with an easy book still has to **earn the composite** through proactive work. The matrix keeps a coasting CSM from looking identical to one actively growing the account.",
    bottom: `The free **PULSE Pulse Check Matrix** is the **Best Overall** because it builds the **weighted retention-and-expansion scorecard** and rolls every CSM into **one composite Pulse number** at no cost, and **QuotaPath** is the **Best Value** for wiring that composite to **pay**. The method is what wins: **list every retention and expansion KPI, weight what matters, score the levels 1-to-5**, and tie the **scorecard and the coaching to the composite** so CSMs **grow the book, not just defend it.**`,
  },
};

function buildAnswer(e) {
  return `﻿# ${e.q}

## Direct Answer

${e.direct}

## The Top 10 Tools to Score Reps on a Weighted Matrix

${e.top10intro}

${pulseSection(e.bookPhrase, e.repNoun, e.easyLine, e.hardLine, e.pivotLine)}

${items2to10(e.behaviorTool, e.signalLine)}

${choose(e.behavior)}

${faq(e.repNoun, e.behavior, e.bookPhrase, e.faqQ1, e.faqA1, e.faqQ2, e.faqA2)}

## Bottom Line

${e.bottom}

${sources()}
`;
}

(async () => {
  const ex = await s.get("answers/tl0151.json", { type: "json" });
  const ids = ["tl0506", "tl0507", "tl0508", "tl0509", "tl0510"];
  const out = [];
  for (const id of ids) {
    const cfg = ENTRIES[id];
    const answer = buildAnswer(cfg);

    const lower = answer.toLowerCase();
    const hits = BANNED.filter(b => lower.includes(b));
    if (hits.length) throw new Error(id + " banned words: " + hits.join(","));
    if (answer.includes("—")) throw new Error(id + " has em dash");
    const items = (answer.match(/^## \d+\. /gm) || []).length;
    if (items !== 10) throw new Error(id + " item count " + items);
    const faqBlock = answer.split("## FAQ")[1].split("## Bottom Line")[0];
    const faqCount = (faqBlock.match(/\*\*[^*]+\?\*\*/g) || []).length;
    if (faqCount !== 4) throw new Error(id + " faq count " + faqCount);
    const bestVal = (answer.match(/💎 BEST VALUE/g) || []).length;
    if (bestVal !== 1) throw new Error(id + " best value count " + bestVal);
    if (!answer.includes("🏆 BEST OVERALL")) throw new Error(id + " no best overall");
    if (!/\[Pulse Check Matrix\]\(\/tools\/pulse-check\)/.test(answer)) throw new Error(id + " no pulse-check anchor link");
    if (!answer.includes("## Sources")) throw new Error(id + " no sources");
    const w = strictWords(answer);
    if (w < 1950) throw new Error(id + " strict words " + w);

    const e = { ...ex, id, question: cfg.q, answer, ts: Date.now(), polished_at: Date.now() };
    delete e.quality_audit;
    e.pending = false;
    await s.setJSON("answers/" + id + ".json", e);
    out.push(id + ": " + w + "w " + items + "i");
  }
  console.log(out.join("\n"));
})().catch(err => { console.error("ERR", err.message); process.exit(1); });
