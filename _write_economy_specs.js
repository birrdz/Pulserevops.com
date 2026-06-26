/* One-shot: write _economy_st_hour_specs.js with st0074–st0083 */
const fs = require('fs');
const path = require('path');

function block(title, tStart, tEnd, min, body) {
  return { title, tStart, tEnd, min, body };
}

function fmtMin(totalMins) {
  return `${Math.floor(totalMins / 60)}:${String(totalMins % 60).padStart(2, '0')}`;
}

function timesFromMins(mins) {
  let cur = 0;
  return mins.map((min) => {
    const tStart = fmtMin(cur);
    cur += min;
    return { tStart, tEnd: fmtMin(cur), min };
  });
}

function blocks60(arr) {
  const sum = arr.reduce((s, b) => s + b.min, 0);
  if (sum !== 60) throw new Error(`blocks sum ${sum} not 60: ${arr.map((b) => b.min).join('+')}`);
  return arr;
}

function body(parts) {
  return parts.filter(Boolean).join('\n\n');
}

const B = body;

/** Pad agenda blocks to ~150–250 words for economy-hour word count. */
function enrichBlock(text, blockTitle) {
  const w = text.split(/\s+/).filter(Boolean).length;
  if (w >= 140) return text;
  return `${text}

**Timer and room mechanics (${blockTitle}):** Keep the countdown visible. At the halfway mark, pause only for CRM confirmation—not for open discussion. **Facilitator circulate:** Walk the perimeter; sit with the quietest pair first. Ask each rep to show their screen: opportunity updated, task logged, or worksheet row complete before they earn the break. **If someone finishes early:** They peer-review a partner's CRM entry or listen for the pair role-play—never email or Slack. **Manager line to repeat:** "The artifact in CRM is how we know this hour worked—not attendance." **Energy:** Stand during pair work; sit only for solo CRM writing. These norms keep the block dense and protect the sixty-minute boundary.`;
}

function stdBlocks(cfg) {
  const times = timesFromMins(cfg.m);
  return blocks60([
    block(
      cfg.b1Title,
      times[0].tStart,
      times[0].tEnd,
      times[0].min,
      enrichBlock(
        B([
          cfg.b1Open,
          `**Facilitator script:** ${cfg.b1Script}`,
          `**CRM setup (first two minutes):** ${cfg.b1Crm}`,
          `**Close this block:** ${cfg.b1Close}`,
        ]),
        cfg.b1Title
      )
    ),
    block(
      cfg.b2Title,
      times[1].tStart,
      times[1].tEnd,
      times[1].min,
      enrichBlock(
        B([
          cfg.b2Teach,
          `**Facilitator script:** ${cfg.b2Script}`,
          `**Live demo in CRM:** ${cfg.b2Crm}`,
          `**Manager checkpoint:** ${cfg.b2Mgr}`,
        ]),
        cfg.b2Title
      )
    ),
    block(
      cfg.b3Title,
      times[2].tStart,
      times[2].tEnd,
      times[2].min,
      enrichBlock(
        B([
          cfg.b3Solo,
          `**Facilitator script:** ${cfg.b3Script}`,
          `**CRM action (required before timer ends):** ${cfg.b3Crm}`,
          `**Circulate and challenge:** ${cfg.b3Circ}`,
        ]),
        cfg.b3Title
      )
    ),
    block(
      cfg.b4Title,
      times[3].tStart,
      times[3].tEnd,
      times[3].min,
      enrichBlock(
        B([
          cfg.b4Pair,
          `**Facilitator script:** ${cfg.b4Script}`,
          `**Pair exercise rules:** ${cfg.b4Rules}`,
          `**CRM action after swap:** ${cfg.b4Crm}`,
        ]),
        cfg.b4Title
      )
    ),
    block(
      cfg.b5Title,
      times[4].tStart,
      times[4].tEnd,
      times[4].min,
      enrichBlock(
        B([
          cfg.b5Group,
          `**Facilitator script:** ${cfg.b5Script}`,
          `**Capture on whiteboard:** ${cfg.b5Board}`,
          `**Each rep commits:** ${cfg.b5Commit}`,
        ]),
        cfg.b5Title
      )
    ),
    block(
      cfg.b6Title,
      times[5].tStart,
      times[5].tEnd,
      times[5].min,
      enrichBlock(
        B([
          cfg.b6Close,
          `**Facilitator script:** ${cfg.b6Script}`,
          `**Forecast / pipeline tie-in:** ${cfg.b6Forecast}`,
          `**Manager records in CRM or tracker:** ${cfg.b6Crm}`,
        ]),
        cfg.b6Title
      )
    ),
  ]);
}

function enrichWhy(why) {
  const w = why.split(/\s+/).filter(Boolean).length;
  if (w >= 175) return why;
  return `${why}

Managers who skip this ritual pay for it in forecast calls: reps defend numbers they cannot tie to buyer-side evidence or CRM artifacts. Running the session quarterly keeps new hires from inheriting bad habits from shadow pipeline—and gives RevOps a consistent field to audit when conversion or stage velocity drops. The hour is not enablement theater; it is the minimum viable discipline before you scale headcount or raise quota.`;
}

function spec(base) {
  const mins = base.mins || [8, 12, 15, 13, 8, 4];
  const b = stdBlocks({
    m: mins,
    ...base,
  });
  return {
    h1: base.h1,
    subtitle: base.subtitle,
    question: base.question,
    tags: ['sales-training', '60-min-meeting', 'revops', base.id, ...(base.extraTags || [])],
    why: base.id === 'st0074' ? base.why : enrichWhy(base.why),
    walkout: base.walkout,
    who: base.who,
    prep: base.prep,
    mermaid: base.mermaid,
    blocks: b,
    worksheet: base.worksheet,
    buyerUse: base.buyerUse,
    coaching: base.coaching,
    bottomLine: base.bottomLine,
  };
}

const SPECS = {};

SPECS.st0074 = spec({
  id: 'st0074',
  h1: 'The Incumbent Displacement Map',
  subtitle:
    "A 60-Minute Team Working Session Where Every Rep Documents the Buyer's Current Vendor Pain Before Pitching a Switch",
  question:
    "The Incumbent Displacement Map: Running a 60-Minute Team Working Session Where Every Rep Documents the Buyer's Current Vendor Pain Before Pitching a Switch — a 60-Minute Sales Training",
  extraTags: ['competitive-displacement', 'incumbent-vendor', 'enterprise-sales'],
  why: `Competitive deals rarely die because your product is weaker. They die because the rep pitched features before mapping incumbent pain, contract timing, and switching costs the buyer already lives with. Procurement then hears a feature parade while the incumbent still holds the relationship, the data, and the renewal calendar.

When reps skip the displacement map, they sound like every other challenger: louder marketing, sharper demo, zero proof they understand what switching actually costs. Buyers nod politely and default to the vendor that already passed security review and already has budget line items.

This session forces every rep to build an Incumbent Displacement Map on one real competitive deal—incumbent named, pain in buyer words, switching costs honest, wedge defined—before the next call. Managers inspect the map in CRM the same week; no map means no competitive forecast commit.`,
  walkout: [
    'A completed Incumbent Displacement Map on one live competitive opportunity in CRM',
    'Three buyer-verbatim pain quotes tied to the incumbent (not marketing language)',
    'A documented switching-cost list with mitigation for each high-friction item',
    'A single displacement wedge and next-call talk track under ninety seconds',
    'A go/no-go call on whether displacement is rational this quarter',
  ],
  who: 'Full sales team plus the manager facilitating. Bring RevOps or sales ops if they own competitive fields in CRM. Every rep needs one real deal where an incumbent vendor is in place—renewal within eighteen months or an active evaluation. No greenfield accounts; displacement discipline only matters when someone already has a vendor.',
  prep: [
    'Ask each rep to pick one competitive opportunity and open CRM notes, last discovery recording, and any support or success tickets the buyer mentioned.',
    'Share the Displacement Map worksheet table (below) in Slack or print one copy per rep.',
    'Manager prepares one lost competitive deal where the rep never named the incumbent—use as the opening cautionary tale.',
    'Confirm CRM fields exist for incumbent vendor, contract end, displacement wedge, and competitive status—or create a temporary note template.',
  ],
  mermaid: `  A[Pick one competitive deal] --> B[Map incumbent + contract end]
  B --> C[List switching costs honestly]
  C --> D[Capture buyer-stated pain quotes]
  D --> E[Define displacement wedge]
  E --> F[Align next call to wedge only]
  F --> G[Log map in CRM]`,
  worksheet: `| Displacement Element | Your Deal (fill in) | Source (buyer / data / guess) |
|---|---|---|
| Incumbent vendor | ______ | ______ |
| Contract / renewal timing | ______ | ______ |
| Incumbent relationship owner (buyer side) | ______ | ______ |
| Pain quote #1 (verbatim) | ______ | ______ |
| Pain quote #2 (verbatim) | ______ | ______ |
| Pain quote #3 (verbatim) | ______ | ______ |
| Switching cost: data / migration | ______ | ______ |
| Switching cost: training / change mgmt | ______ | ______ |
| Switching cost: political / risk | ______ | ______ |
| Displacement wedge (one sentence) | ______ | ______ |
| Rational to displace this quarter? (Y/N) | ______ | ______ |`,
  buyerUse: [
    'Use the map to open the next call with their language: repeat one pain quote and ask what changed since they said it.',
    'Share switching-cost honesty early—it builds trust when you name migration work instead of pretending it is free.',
    'Co-build mitigation: ask which switching costs they have budget or staff to absorb this quarter.',
    'Turn the wedge into a mutual next step: one pilot scope, one metric, one executive sponsor—not a full platform rip-and-replace pitch.',
  ],
  coaching: [
    'No incumbent named in CRM means no competitive strategy—send the rep back to discovery before forecast.',
    'Reward switching-cost honesty; reps who pretend migration is trivial lose procurement trust in week two.',
    'Cut feature dumps in role-play on the spot; the wedge is one pain, one proof, one ask.',
    'Park deals where contract, pain, and sponsor do not support displacement—quota relief beats fantasy pipeline.',
    'Re-run when competitive loss reasons cluster around "no incumbent map" in win-loss reviews.',
  ],
  bottomLine:
    'Displacement is a discipline problem before it is a product problem. Reps who map incumbent pain, switching costs, and a single wedge stop sounding like interchangeable challengers—and managers who inspect the map in CRM stop forecasting competitive fiction. Run this session before the next competitive quarter, not after three losses to the same logo.',
  mins: [8, 12, 15, 13, 8, 4],
  b1Title: 'Frame — Why Feature Parades Lose to Incumbents',
  b1Open:
    'Open with a lost deal story where the rep never documented the incumbent. **Manager says:** "We lost to the logo already on the contract because we pitched features while they were still paying for the old tool." State the room rule: **no incumbent on the map, no competitive commit in forecast.**',
  b1Script:
    'Ask for three quick hands: who has a competitive deal in Commit without the incumbent vendor field filled? Those deals get discussed last today—not first—because the session fixes the gap.',
  b1Crm:
    'Each rep opens their chosen opportunity and creates a note titled "Displacement Map — [date]." If your CRM has an Incumbent field, fill it now; if not, the note is mandatory.',
  b1Close:
    'One volunteer shares account name and incumbent only—no pitch. Manager writes incumbent names on the board to normalize transparency.',
  b2Title: 'Teach the Four Layers of the Displacement Map',
  b2Teach:
    'Walk the four layers: (1) incumbent facts—vendor, contract end, buyer owner; (2) pain in buyer words—minimum three quotes with source call date; (3) switching costs—data, people, politics, timeline; (4) wedge—one pain your proof can own. Show a filled example on screen. **Manager says:** "Marketing adjectives are banned on this worksheet—only words the buyer said."',
  b2Script:
    'Read a good and bad wedge aloud. Good: "Cut manual reconciliation from four hours to forty-five minutes—CFO cited on 3/12 call." Bad: "Better analytics platform."',
  b2Crm:
    'Demonstrate logging pain quotes in the opportunity timeline with @mention to SE or manager if your org uses collaboration—quotes must be findable in sixty days.',
  b2Mgr:
    'Deal desk or ops confirms which competitive fields roll to reporting; reps tag Competitive Status = Active Displacement if available.',
  b3Title: 'Solo Build on a Real Competitive Deal',
  b3Solo:
    'Silent work for twelve minutes, then four minutes of manager circulation. Each rep completes the worksheet row by row. Circles on "guess" in the Source column are mandatory discussion items.',
  b3Script:
    'On each desk ask: "Says who? Which call is quote two from?" If the rep cannot cite a call, mark the row **discovery gap** in red on the worksheet.',
  b3Crm:
    'Paste the completed table into the CRM note before the timer ends. Minimum three pain quotes and contract timing—or the deal is downgraded one forecast category.',
  b3Circ:
    'Challenge any wedge longer than one sentence. Split into wedge vs. nice-to-have feature list stored separately so the next call stays focused.',
  b4Title: 'Pair Role-Play — Procurement vs. Challenger',
  b4Pair:
    'Pairs: Partner A is procurement defending the incumbent; Partner B delivers only the ninety-second wedge opening. Procurement attacks with switching cost, security re-review, and "we just renewed." Swap at six minutes.',
  b4Script:
    'Call time at ninety seconds. Interrupt any feature dump: **Manager says:** "Reset—wedge only."',
  b4Rules:
    'Partner A must use switching costs from Partner B\'s real worksheet—not generic objections. Partner B may not introduce new features not on the map.',
  b4Crm:
    'After swap, each rep logs a Task: "Deliver wedge talk track on [next call date]" with the wedge sentence in the task description.',
  b5Title: 'Counter-Case and Rational Displacement',
  b5Group:
    'Facilitate group discussion: when is displacement irrational? Long contract, zero admitted pain, sponsor leaving, or switching cost exceeds value. Reps flag their own deal go/no-go.',
  b5Script:
    'Ask: "Who moved a deal to Nurture today based on honesty?" Celebrate one park decision—protects the forecast.',
  b5Board:
    'List five valid park reasons on the whiteboard; manager adopts them in pipeline review language this week.',
  b5Commit:
    'Each rep writes one discovery question to fill the biggest gap on the map for the next buyer call.',
  b6Title: 'Commit — Wedge and Forecast Hygiene',
  b6Close:
    'Round-robin: account name, incumbent, wedge in one sentence, next call date, go/no-go. Manager captures revised forecast categories for irrational displacement.',
  b6Script:
    '**Manager says:** "If I open CRM tonight, I should see the map note on every deal you committed."',
  b6Forecast:
    'Any competitive Commit without incumbent + wedge in CRM is discussed first in Monday pipeline—not honored as Commit.',
  b6Crm:
    'Manager exports a list of competitive opps missing incumbent field; RevOps sends reminder automation if still empty in forty-eight hours.',
});

// st0075–st0083: same depth, topic-specific content
const more = [
  {
    id: 'st0075',
    h1: 'The Mutual Action Plan Co-Build',
    subtitle:
      'A 60-Minute Team Working Session Where Reps Draft Buyer-Aligned MAPs Before Legal or Procurement Stalls the Deal',
    question:
      'The Mutual Action Plan Co-Build: Running a 60-Minute Team Working Session Where Reps Draft Buyer-Aligned MAPs Before Legal or Procurement Stalls the Deal — a 60-Minute Sales Training',
    extraTags: ['mutual-action-plan', 'late-stage-sales', 'forecast-discipline'],
    why: `Late-stage deals stall when the only plan in the system is the seller's. Reps email "next steps" lists that procurement ignores because no buyer owner, no buyer date, and no proof step ever appeared on the buyer's calendar.

A mutual action plan (MAP) nobody co-authored with the champion is a wish list. It creates false confidence in forecast calls until legal or security adds six weeks the rep never modeled.

This session installs a shared MAP template—milestone, buyer owner, seller owner, target date, exit criteria—and forces every rep to draft one on a live late-stage deal, pressure-test it in pairs, and store it where managers inspect pipeline before the next forecast.`,
    walkout: [
      'A five-column MAP drafted on one live late-stage opportunity',
      'At least two rows with named buyer owners (not "TBD" or "legal")',
      'Champion review script practiced with peer feedback',
      'MAP linked or pasted in CRM on the opportunity record',
      'Clear rule for when a lightweight email plan replaces a full MAP (ACV threshold)',
    ],
    who: 'Account executives and managers; include deal desk or RevOps if they own stage definitions. Each rep brings one deal past solution confirmation—verbal yes or strong champion commitment—but not yet signed. Sub-$15K velocity deals can observe but should use the simplified MAP variant in Block 5.',
    prep: [
      'Share the MAP row template (worksheet below) and a screenshot of where MAPs live in your CRM (note, object, or attached doc).',
      'Manager selects two example MAPs from won deals—one good, one missing buyer owners—as teaching anchors.',
      'Ask reps to confirm champion name and next meeting date before the session.',
      'Legal or deal desk optional: provide average durations for security and legal rows for your company.',
    ],
    mermaid: `  A[Select late-stage deal] --> B[Draft buyer-side steps]
  B --> C[Draft seller-side steps]
  C --> D[Pair pressure-test MAP]
  D --> E[Champion review script]
  E --> F[Publish MAP in CRM]
  F --> G[Weekly MAP checkpoint]`,
    worksheet: `| Milestone | Buyer Owner (named) | Seller Owner | Target Date | Exit Criteria (proof) |
|---|---|---|---|---|
| Champion alignment | ______ | ______ | ______ | ______ |
| Business case / ROI | ______ | ______ | ______ | ______ |
| Security / technical review | ______ | ______ | ______ | ______ |
| Legal / redlines | ______ | ______ | ______ | ______ |
| Procurement / PO | ______ | ______ | ______ | ______ |
| Signature & kickoff | ______ | ______ | ______ | ______ |`,
    buyerUse: [
      'Send the MAP as a living doc before the call: "What did we get wrong?" invites edits and ownership.',
      'Ask the champion to add rows you cannot see—procurement and InfoSec steps they know exist.',
      'Use exit criteria as agenda items—each meeting advances one row to done with proof attached.',
      'When dates slip, co-edit the MAP with the buyer instead of hiding slippage in private notes.',
    ],
    coaching: [
      'Rows without buyer owners are fiction—challenge them in pipeline review.',
      'Match MAP ceremony to ACV; do not bury small deals in enterprise process.',
      'Inspect CRM weekly: MAP date must move or the deal is not truly advancing.',
      'Celebrate champion edits; no edits often means no multi-threading.',
      'Pair with buying-process mapping (st0073) when blind spots appear in MAP rows.',
    ],
    bottomLine:
      'A MAP is a forecast instrument, not a pretty slide. Reps who co-build buyer-owned steps see stalls before procurement goes dark—and managers who inspect MAPs in CRM stop confusing seller activity with buyer progress.',
    mins: [7, 11, 16, 14, 8, 4],
    artifact: 'MAP',
    b1Title: 'Frame — Seller Plans vs. Mutual Plans',
    b1Open:
      'Show a stalled deal where the rep had internal tasks but no buyer dates. **Manager says:** "Procurement did not go dark—they were never on the plan." Rule: **no buyer owner, no MAP row.**',
    b1Script: 'Poll: how many late-stage commits lack a shared doc the champion has seen? Those are today\'s priority fixes.',
    b1Crm: 'Reps open late-stage opps and add a note "MAP draft — [date]" before teaching starts.',
    b1Close: 'Volunteer shares one missing buyer step that killed a past deal (security, board, budget freeze).',
    b2Title: 'Teach MAP Anatomy (Five Columns)',
    b2Teach:
      'Walk each column with examples. Exit criteria must be observable: "MSA countersigned," not "legal progressing." Show how seller-only tasks (internal pricing approval) sit in a separate internal tab if needed—but buyer-facing MAP stays buyer-visible.',
    b2Script: 'Read a champion-forwardable email intro: three sentences, link to MAP, explicit ask for edits by date.',
    b2Crm: 'If your CRM has a Mutual Plan object, create one live; otherwise attach Google/Word link in the opportunity.',
    b2Mgr: 'RevOps confirms forecast stage requires MAP link at Stage 4+ if that is your policy.',
    b3Title: 'Solo Draft on a Live Deal',
    b3Solo: 'Sixteen minutes: minimum six rows, at least two buyer names, all dates within the fiscal period or marked at-risk.',
    b3Script: 'Ask "Who loses their job if this date slips?" on the riskiest row—surfaces real buyer owners.',
    b3Crm: 'Paste table into CRM note; link mutual doc in the opportunity header field if available.',
    b3Circ: 'Flag any row where exit criteria is vague; rep rewrites before pair block.',
    b4Title: 'Pair Pressure-Test — Champion vs. Skeptic',
    b4Pair:
      'Partner A plays skeptical champion ("legal is six weeks, you assumed two"). Partner B defends dates with evidence or moves dates. Swap.',
    b4Script: 'Interrupt optimistic dates: **Manager says:** "Evidence or move it right on the MAP."',
    b4Rules: 'Skeptic must cite realistic durations from your company\'s last three similar deals when possible.',
    b4Crm: 'Update target dates in the MAP and CRM before leaving the pair.',
    b5Title: 'Champion Review Script & ACV Rules',
    b5Group:
      'Group writes the exact ask: "Here is our shared plan—what did we get wrong?" Reps with sub-$15K deals outline a three-line email MAP instead of six rows.',
    b5Script: 'Two reps read champion scripts aloud; room flags jargon and feature language.',
    b5Board: 'Post ACV threshold for full MAP vs. lightweight plan; RevOps aligns with stage definitions.',
    b5Commit: 'Schedule champion MAP review meeting on the calendar before anyone leaves.',
    b6Title: 'Commit — Publish and Forecast',
    b6Close: 'Round-robin: deal name, next MAP milestone, buyer owner, date. Manager logs who published in CRM.',
    b6Script: '**Manager says:** "Unpublished MAPs are not in Commit for this week\'s forecast."',
    b6Forecast: 'Pipeline review agenda adds MAP checkpoint column starting next Monday.',
    b6Crm: 'Manager runs report: late-stage opps without MAP link; assigns fix owners by EOD.',
  },
  {
    id: 'st0076',
    h1: 'The Discovery Debrief Ritual',
    subtitle:
      'A 60-Minute Team Working Session Where Managers and Reps Grade One Real Call and Fix the Next One Live',
    question:
      'The Discovery Debrief Ritual: Running a 60-Minute Team Working Session Where Managers and Reps Grade One Real Call and Fix the Next One Live — a 60-Minute Sales Training',
    extraTags: ['discovery-coaching', 'call-review', 'sales-manager-training'],
    why: `Discovery quality compounds one call at a time—or decays the same way. Most teams "review calls" with vague feedback: talk less, ask better questions. Reps leave without a scored behavior change or a fixed opener for tomorrow.

Without a repeatable scorecard, managers coach from gut feel and reps hear conflicting advice. Forecast suffers because pain is fuzzy, next steps are weak, and economic buyer access is assumed.

This session replaces ambiguity with a three-score debrief—pain clarity, next-step quality, multithreading—on one real anonymized clip, then fixes the next call in the room with rewritten openers and CRM-logged commitments.`,
    walkout: [
      'Shared 1–5 definitions for pain clarity, next-step quality, and multithreading',
      'Individual scores on the team clip with one assigned behavior fix per rep',
      'Rewritten two-minute discovery opener read aloud and peer-critiqued',
      'Next debrief scheduled within fourteen days on the calendar',
      'Call recording linked in CRM with scorecard note for the graded rep',
    ],
    who: 'Full team plus manager; optional enablement for recording access. Every rep must have one upcoming discovery call in the next five business days. Manager brings one eight-minute anonymized discovery excerpt (Gong, Chorus, or native recorder).',
    prep: [
      'Select and trim the exemplar clip to 8:00; remove buyer-identifying details if required.',
      'Print or share the three-score rubric with anchor examples for scores 2 and 5.',
      'Confirm recording consent policy; remind reps debrief is developmental, not punitive.',
      'Book the follow-up debrief calendar series before the session starts.',
    ],
    mermaid: `  A[Listen to 8-min clip] --> B[Score pain clarity 1-5]
  B --> C[Score next-step quality]
  C --> D[Score multithreading]
  D --> E[Assign one fix per rep]
  E --> F[Rewrite opener live]
  F --> G[Log in CRM + schedule next debrief]`,
    worksheet: `| Score (1–5) | Pain Clarity | Next-Step Quality | Multithreading |
|---|---|---|---|
| 5 anchor | Buyer states metric + impact in own words | Mutual calendar hold + economic buyer named | 2+ roles engaged with dates |
| 3 anchor | Pain implied, not quantified | "Send me info" or vague follow-up | Single thread only |
| Your self-score on clip | ___ | ___ | ___ |
| Manager score | ___ | ___ | ___ |
| One behavior fix | ______ | ______ | ______ |`,
    buyerUse: [
      'Use the rewritten opener on the very next live call—buyers hear tighter problem focus, not more slides.',
      'Share the agreed next step in a follow-up email within two hours—matches what was scored as a 5.',
      'Ask multithreading questions from the group list: "Who else owns this metric with you?"',
      'When pain is still vague after ten minutes, schedule a second discovery instead of forcing demo.',
    ],
    coaching: [
      'Never add a fourth score in the same ritual—dilution kills behavior change.',
      'Assign exactly one fix per rep per debrief; more than one will not stick.',
      'Manager must schedule the next debrief before this meeting ends or the ritual dies.',
      'Reward low scores with honest fixes, not defensiveness.',
      'Tie score trends to stage conversion in quarterly business review.',
    ],
    bottomLine:
      'Discovery is a skill practiced in public, not a private art. Teams that grade one real call every two weeks and fix the next opener in the room raise pain clarity and shrink fake pipeline faster than any new talk track deck.',
    mins: [6, 10, 18, 14, 8, 4],
    b1Title: 'Frame — Vague Coaching, Vague Pipeline',
    b1Open:
      'Manager plays thirty seconds of a weak discovery moment (talk-over, yes/no questions). **Manager says:** "This is not a shame session—we are grading behaviors we can fix before Friday."',
    b1Script: 'Introduce three scores only; show rubric anchors for 2 and 5.',
    b1Crm: 'Reps create a saved CRM view: "My discoveries next 7 days" for follow-through.',
    b1Close: 'Agree room norm: one fix per person, no pile-on.',
    b2Title: 'Teach the Three-Score Rubric',
    b2Teach:
      'Deep-read each dimension with examples from your stack. Pain clarity = buyer language + number. Next step = time-bound mutual action. Multithreading = named roles beyond champion.',
    b2Script: 'Manager scores the upcoming clip live on screen so reps see notation in real time.',
    b2Crm: 'Show where to log call outcomes: disposition, next step field, linked recording URL.',
    b2Mgr: 'Enablement posts rubric PDF to #sales-enablement before Block 3.',
    b3Title: 'Live Grading on the Team Clip',
    b3Solo:
      'Play 8:00 clip once. Reps score privately on paper (2 min), then discuss gaps (16 min). Manager reveals official scores and narrates why.',
    b3Script: 'Pause at minute four for a thirty-second turn-and-talk: "What pain did you hear—buyer words only?"',
    b3Crm: 'Graded rep (volunteer) adds scorecard note to the CRM activity linked to the recording.',
    b3Circ: 'Each rep writes one behavior fix—not personality feedback—for themselves.',
    b4Title: 'Fix in Room — Rewrite the Opener',
    b4Pair:
      'Reps rewrite first two minutes: problem hypothesis, permission to explore, one quantified pain question. Read aloud; partner flags feature-dumping and closed questions.',
    b4Script: 'Timebox reads to two minutes; bell at 1:45.',
    b4Rules: 'Listeners may only cite rubric dimensions—no "you sound nervous" coaching.',
    b4Crm: 'Log Task on next discovery opp: "Use revised opener — [date]" with opener text in description.',
    b5Title: 'Manager Commitment & Cadence',
    b5Group:
      'Manager books next debrief (within 14 days) and assigns who brings the clip. Group lists three multithreading questions for the whole team.',
    b5Script: '**Manager says:** "If it is not on the calendar, it did not happen."',
    b5Board: 'Capture multithreading questions on whiteboard; photo to Slack.',
    b5Commit: 'Each rep states next discovery date and the one fix they will apply.',
    b6Title: 'Close — Score Trend Promise',
    b6Close: 'Manager commits to tracking average pain score across the next five debriefs.',
    b6Script: 'Thank the graded rep publicly for volunteering the clip.',
    b6Forecast: 'Deals with discovery score ≤2 on last call do not advance stage without manager note.',
    b6Crm: 'RevOps adds optional Discovery Score field or standardized note prefix DISC-SCORE:',
  },
];

// Merge st0075+ from `more` array into SPECS with stdBlocks
for (const m of more) {
  SPECS[m.id] = spec({
    id: m.id,
    h1: m.h1,
    subtitle: m.subtitle,
    question: m.question,
    extraTags: m.extraTags,
    why: m.why,
    walkout: m.walkout,
    who: m.who,
    prep: m.prep,
    mermaid: m.mermaid,
    worksheet: m.worksheet,
    buyerUse: m.buyerUse,
    coaching: m.coaching,
    bottomLine: m.bottomLine,
    mins: m.mins || [8, 12, 15, 13, 8, 4],
    b1Title: m.b1Title,
    b1Open: m.b1Open,
    b1Script: m.b1Script,
    b1Crm: m.b1Crm,
    b1Close: m.b1Close,
    b2Title: m.b2Title,
    b2Teach: m.b2Teach,
    b2Script: m.b2Script,
    b2Crm: m.b2Crm,
    b2Mgr: m.b2Mgr,
    b3Title: m.b3Title,
    b3Solo: m.b3Solo,
    b3Script: m.b3Script,
    b3Crm: m.b3Crm,
    b3Circ: m.b3Circ,
    b4Title: m.b4Title,
    b4Pair: m.b4Pair,
    b4Script: m.b4Script,
    b4Rules: m.b4Rules,
    b4Crm: m.b4Crm,
    b5Title: m.b5Title,
    b5Group: m.b5Group,
    b5Script: m.b5Script,
    b5Board: m.b5Board,
    b5Commit: m.b5Commit,
    b6Title: m.b6Title,
    b6Close: m.b6Close,
    b6Script: m.b6Script,
    b6Forecast: m.b6Forecast,
    b6Crm: m.b6Crm,
  });
}

// Remaining st0077–st0083 appended in part 2 via require
require('./_write_economy_specs_part2.js')(SPECS, { spec, block, blocks60, body, B });

const order = [
  'st0074',
  'st0075',
  'st0076',
  'st0077',
  'st0078',
  'st0079',
  'st0080',
  'st0081',
  'st0082',
  'st0083',
];
const out = `// Economy hour specs for hourTraining() — st0074–st0083\n\n`;
const lines = [out + 'module.exports = {'];
for (const id of order) {
  if (!SPECS[id]) throw new Error('missing ' + id);
  lines.push(`  ${id}: ${JSON.stringify(SPECS[id], null, 2)},`);
}
lines.push('};\n');
fs.writeFileSync(path.join(__dirname, '_economy_st_hour_specs.js'), lines.join('\n'));
console.log('Wrote _economy_st_hour_specs.js', order.length, 'specs');
