/* st0077–st0083 economy hour specs */
module.exports = function register(SPECS, { spec }) {
  const items = [
    mk0077(),
    mk0078(),
    mk0079(),
    mk0080(),
    mk0081(),
    mk0082(),
    mk0083(),
  ];
  for (const m of items) SPECS[m.id] = spec(m);
};

function mk0077() {
  return {
    id: 'st0077',
    h1: 'The Renewal Rescue Standup',
    subtitle:
      'A 60-Minute Team Working Session Where AEs and CSMs Align on At-Risk Accounts Before the Quarter Ends',
    question:
      'The Renewal Rescue Standup: Running a 60-Minute Team Working Session Where AEs and CSMs Align on At-Risk Accounts Before the Quarter Ends — a 60-Minute Sales Training',
    extraTags: ['renewal-risk', 'customer-success', 'account-management'],
    mins: [8, 11, 18, 13, 6, 4],
    why: `Renewals fail in the handoff between AE optimism and CSM telemetry. AEs hear "everything is fine" from the champion while usage drops, support tickets spike, and the economic buyer goes quiet—then the quarter ends with a surprise churn or downsell.

Subjective "feels shaky" does not belong in a renewal forecast. Teams need three agreed at-risk triggers, one save play per account, and one executive touch logged before procurement or the incumbent re-enters.

This standup aligns AEs and CSMs on a single at-risk list, assigns paired ownership, and installs a weekly fifteen-minute cadence through quarter-end with CRM discipline managers can audit.`,
    walkout: [
      'Shared definition of at-risk (usage, champion, support triggers)',
      'Triage completed on every account below health threshold',
      'One documented save play and target date per at-risk account',
      'Executive touch scheduled or completed for top-five risk accounts',
      'Weekly renewal standup on the calendar through quarter-end',
    ],
    who: 'Account executives, customer success managers, and the revenue leader or sales manager facilitating. RevOps should attend if they own health scores. Every participant brings accounts renewing in the next ninety days and access to product usage or health dashboard.',
    prep: [
      'Export accounts with health score under 90 (or your org threshold) and renewal date this quarter.',
      'CSM and AE pre-tag root cause hypothesis in CRM before the meeting—no blank rows.',
      'Manager prepares two save stories from last quarter (executive bridge, success plan reset, etc.).',
      'Confirm CRM fields for Save Play, Exec Touch Date, and Renewal Risk Reason.',
    ],
    mermaid: `  A[Pull health + usage signals] --> B[Flag accounts under threshold]
  B --> C[Assign AE + CSM owner]
  C --> D[Pick one save play each]
  D --> E[Book exec touch]
  E --> F[Log in CRM weekly]
  F --> G[Track save rate not activity]`,
    worksheet: `| Account | Health | Trigger (usage/champion/support) | Root Cause | Save Play | Owner AE/CSM | Exec Touch Date |
|---|---|---|---|---|---|---|
| ______ | ___ | ______ | ______ | ______ | ______ | ______ |
| ______ | ___ | ______ | ______ | ______ | ______ | ______ |
| ______ | ___ | ______ | ______ | ______ | ______ | ______ |`,
    buyerUse: [
      'Present the save play as a partnership reset—not a discount panic—tied to outcomes they cared about at purchase.',
      'Use usage data as a conversation starter: "We noticed X—want to align on success plan?"',
      'Executive touches focus on business risk and roadmap, not feature apologies.',
      'Document agreed success milestones in writing so renewal is about progress, not price alone.',
    ],
    coaching: [
      'No "feels fine" without usage and champion evidence in CRM.',
      'AE and CSM must co-own the save play—split blame kills renewals.',
      'Measure save rate and net retention, not count of check-in emails.',
      'Escalate accounts with no exec touch two weeks before renewal.',
      'Run weekly until quarter-end; skip one week and the list rots.',
    ],
    bottomLine:
      'Renewal risk is a coordination problem before it is a pricing problem. When AEs and CSMs share one at-risk list, one play, and one exec touch in CRM, surprises leave the forecast—and save rate becomes a leading indicator, not a post-mortem.',
    b1Title: 'Frame — Handoff Gaps Kill Renewals',
    b1Open:
      'Manager shares a churn story where AE and CSM had different stories on the same account. **Manager says:** "Telemetry beats optimism—if it is not in CRM, it did not happen."',
    b1Script: 'List three at-risk triggers on the board; team may not add subjective triggers today.',
    b1Crm: 'Open shared renewal dashboard or CRM report filtered to this quarter.',
    b1Close: 'Pair every AE with their CSM for triage block—no solo work.',
    b2Title: 'Define At-Risk Triggers',
    b2Teach:
      'Agree: (1) usage drop beyond X% vs. baseline, (2) champion gone or unresponsive fourteen days, (3) P1/P2 support pattern or escalated ticket. Optional fourth: competitive evaluation signal from product or intent.',
    b2Script: 'RevOps shows how health score is calculated—reps must know what moves the number.',
    b2Crm: 'Add Renewal Risk Reason picklist values matching triggers if missing.',
    b2Mgr: 'Manager sets rule: accounts under threshold appear on Monday standup agenda automatically.',
    b3Title: 'Account Triage — Five Minutes Each',
    b3Solo:
      'AE+CSM pairs review every at-risk row. Five minutes per account: signal, root cause, save play, date. Manager enforces timebox.',
    b3Script: '**Manager says:** "If you cannot name the save play, the account is red—not yellow."',
    b3Crm: 'Update each account: Save Play text, Exec Touch Date, Risk Reason before moving to next row.',
    b3Circ: 'Challenge save plays that are only "check in"—require buyer-visible action.',
    b4Title: 'Save Play Library',
    b4Pair:
      'Pairs draft one paragraph for assigned play type (exec bridge, success plan reset, commercial concession, roadmap preview, reference call). Share best wording with group.',
    b4Script: 'Read two exec-bridge email intros aloud—peer critique for tone.',
    b4Rules: 'Plays must include buyer outcome language, not internal tasks only.',
    b4Crm: 'Tag accounts with Save Play Type field for reporting.',
    b5Title: 'Weekly Cadence Install',
    b5Group:
      'Book recurring 15-minute renewal standup through quarter-end. Assign note-taker and CRM hygiene owner.',
    b5Script: 'Forecast call will start with save-rate metric, not activity counts.',
    b5Board: 'Write standup agenda template: top five risks, exec touch status, blockers.',
    b5Commit: 'Each pair names their highest-risk account and exec touch date this week.',
    b6Title: 'Close — Save Rate Commitment',
    b6Close: 'Leader states target save rate or gross retention floor for the quarter.',
    b6Script: 'Thank CSMs and AEs for joint ownership—no finger-pointing close.',
    b6Forecast: 'Renewal commit requires Save Play + exec touch in CRM.',
    b6Crm: 'Manager exports at-risk list to tracker; reviews in forecast Monday.',
  };
}

function mk0078() {
  return {
    id: 'st0078',
    h1: 'The Three-Touch Outbound Sprint',
    subtitle:
      'A 60-Minute Team Working Session Where SDRs Build Signal-Based Sequences Instead of Generic Blasts',
    question:
      'The Three-Touch Outbound Sprint: Running a 60-Minute Team Working Session Where SDRs Build Signal-Based Sequences Instead of Generic Blasts — a 60-Minute Sales Training',
    extraTags: ['outbound-sdr', 'apollo-sequences', 'prospecting'],
    mins: [8, 12, 17, 13, 6, 4],
    why: `Outbound fails when touch one, two, and three say the same value proposition louder. SDRs burn territory on "just checking in" sequences that train buyers to ignore your domain.

Signal-based outbound ties each touch to one observable event—funding, hiring, tech install, intent spike—so the buyer hears relevance, proof, and a small ask in that order.

This sprint forces each SDR to pick one operational signal, write three differentiated touches, enroll fifty accounts in the sequencer, and tag the play in CRM for seven-day reply review against team median.`,
    walkout: [
      'One chosen signal per SDR that can be sourced this week',
      'Three-touch sequence: insight, proof, ask—peer-validated for duplication',
      'Fifty-account cohort enrolled in Apollo or equivalent',
      'Play name and tags in CRM for attribution',
      'Calendar hold for seven-day results review',
    ],
    who: 'SDR team plus SDR manager; AE optional for proof-point stories. Each SDR needs sequencer access and a defined ICP segment. Marketing may join for approved customer proof snippets.',
    prep: [
      'List five signals your data stack can operationalize (funding, job posts, technographic, intent, website spike).',
      'Pull median reply and meeting rates for last thirty days as the benchmark.',
      'Share exemplar three-touch sequence that beat median last quarter.',
      'Create CRM campaign or tag naming convention: SIG-[signal]-[date].',
    ],
    mermaid: `  A[Pick one ICP segment] --> B[Choose one signal]
  B --> C[Write touch 1 insight]
  C --> D[Write touch 2 proof]
  D --> E[Write touch 3 ask]
  E --> F[Launch 50-account test]
  F --> G[Review in 7 days]`,
    worksheet: `| Touch | Purpose | Subject Line | Body (key sentence) | CTA |
|---|---|---|---|---|
| 1 — Insight | Teach | ______ | ______ | ______ |
| 2 — Proof | Show peer outcome | ______ | ______ | ______ |
| 3 — Ask | Small specific ask | ______ | ______ | ______ |
| Signal source | ______ | Enroll date | ______ | Play tag SIG-___ |`,
    buyerUse: [
      'Touch 1 should stand alone as useful even if they never reply—builds credibility for touch 2.',
      'Touch 2 cites a peer story with metric, not a logo wall.',
      'Touch 3 ask is small: one question, one time slot, one asset—not a full demo demand.',
      'When they reply, reference the signal in the first sentence of the live call.',
    ],
    coaching: [
      'No signal, no sequence—block generic blasts in weekly inspection.',
      'Peers reject duplicate touches in review; sameness is a coaching stop.',
      'Kill plays under median at day seven—do not let losers run a month.',
      'Rotate signals monthly to avoid stale messaging.',
      'Attribute meetings to play tag in CRM or reporting lies.',
    ],
    bottomLine:
      'Outbound is an experiment factory, not a volume contest. SDRs who ship one signal-based three-touch play per week learn faster than teams who rewrite the same blast—and managers who review tagged cohorts on day seven stop funding losing copy.',
    b1Title: 'Frame — Same Message, Three Times',
    b1Open:
      'Show three emails from a failed sequence that differ only in "bumping this." **Manager says:** "Touch two must prove; touch three must ask—never repeat touch one."',
    b1Script: "Display team median reply rate; today's bar is to beat it in seven days.",
    b1Crm: 'Create CRM tag or campaign folder for sprint plays before writing.',
    b1Close: 'Each SDR states their ICP slice and signal candidate in one sentence.',
    b2Title: 'Signal Picker & Differentiation Rules',
    b2Teach:
      'Signal must be verifiable in under five minutes per account. Walk touch purposes: teach → prove → ask. Ban "hope you are well" openers.',
    b2Script: 'Manager rejects any signal the SDR cannot operationalize without manual research on 200 accounts.',
    b2Crm: 'Document signal query (Apollo filter, Sales Nav, intent topic) in the worksheet row.',
    b2Mgr: 'RevOps confirms tracking fields for sequence enrollment count.',
    b3Title: 'Write & Peer-Review Sequence',
    b3Solo:
      'SDRs draft all three touches. Peer swap at minute ten: highlight duplicate sentences and weak CTAs. Revise before enroll.',
    b3Script: '**Manager says:** "If touch 2 could send without touch 1, you wrote two touch 1s."',
    b3Crm: 'Paste final copy into CRM campaign notes or sequencer template library.',
    b3Circ: 'Marketing approves proof point claims on the spot or SDR swaps story.',
    b4Title: 'Launch Fifty-Account Cohort',
    b4Pair:
      'Pairs verify filter returns ~50 accounts, enroll, and apply play tag. Partner B audits Partner A\'s tags before submit.',
    b4Script: 'Start enroll only after peer sign-off—prevents wrong segment disasters.',
    b4Rules: 'Fifty accounts max; no multi-thousand blast from this room today.',
    b4Crm: 'Log activity: "Launched SIG play [name] — 50 accounts" on each SDR user or team report.',
    b5Title: 'Schedule Seven-Day Review',
    b5Group:
      'Entire team books same review slot. Define kill criteria: reply rate below 50% of median or zero meetings.',
    b5Script: 'Assign who presents winning play copy at review.',
    b5Board: 'Write kill/scale rules on whiteboard.',
    b5Commit: 'Each SDR states expected reply rate hypothesis.',
    b6Title: 'Close — Attribution Discipline',
    b6Close: 'Confirm play naming convention and CRM tag on every enrolled account.',
    b6Script: '**Manager says:** "Untagged sequences do not count toward your number this week."',
    b6Forecast: 'SDR leaderboard adds signal-play meeting rate column next week.',
    b6Crm: 'RevOps builds report: meetings by SIG- tag vs. untagged outbound.',
  };
}

function mk0079() {
  return {
    id: 'st0079',
    h1: 'The Executive Access Workshop',
    subtitle:
      'A 60-Minute Team Working Session Where Reps Earn C-Level Meetings With Business Outcomes Not Product Tours',
    question:
      'The Executive Access Workshop: Running a 60-Minute Team Working Session Where Reps Earn C-Level Meetings With Business Outcomes Not Product Tours — a 60-Minute Sales Training',
    extraTags: ['executive-selling', 'enterprise-sales', 'c-level-access'],
    mins: [8, 12, 15, 13, 8, 4],
    why: `Executives take meetings about risk, money, and peer outcomes—not feature tours. Reps who ask champions to "set up a demo with your CEO" get ghosted because the ask has no business reason and no executive time respect.

Executive access is earned with a ninety-second outcome narrative, peer proof, and one decision—not with slideware. Deals that need C-level sponsorship for budget or risk must be flagged early; deals that do not should not waste executive calendar.

This workshop drafts the narrative, practices champion routing with forwardable blurbs, and logs exec meetings only where the agenda ends in a decision.`,
    walkout: [
      'Ninety-second executive narrative (outcome, peer proof, one ask) peer-critiqued',
      'Forwardable champion blurb drafted for one live enterprise deal',
      'Twenty-five-minute exec agenda with explicit decision line',
      'List of anti-patterns posted to team channel',
      'CRM updated with Exec Meeting Needed flag and target date',
    ],
    who: 'Enterprise AEs and sales manager; SEs optional for fact-checking proof points. Each AE brings one deal that genuinely requires executive sponsorship (budget, risk, strategic alignment)—not every mid-market opp.',
    prep: [
      'Collect two anonymized exec-meeting agendas that ended in a decision vs. one that became a demo.',
      'Enablement shares approved peer proof stories with metrics—no unverified claims.',
      'Manager identifies which deals in pipeline incorrectly lack exec strategy.',
      'Confirm CRM field Exec Meeting Status or equivalent.',
    ],
    mermaid: `  A[Select enterprise deal] --> B[Draft outcome headline]
  B --> C[Add peer proof point]
  C --> D[Define single exec ask]
  D --> E[Route via champion blurb]
  E --> F[Log exec meeting in CRM]
  F --> G[Run 25-min decision agenda]`,
    worksheet: `| Element | Draft (your deal) |
|---|---|
| Outcome headline (no product words) | ______ |
| Peer type + metric + timeframe | ______ |
| Single exec ask (decision) | ______ |
| Champion forwardable blurb (≤120 words) | ______ |
| Exec agenda — decision line | ______ |`,
    buyerUse: [
      'Give the champion a blurb they can paste—reduces friction and rewrites.',
      'Open the exec meeting with their priority metric, not your company history.',
      'End with one decision: approve pilot scope, sponsor business case, or align on risk mitigation.',
      'Send a one-page follow-up that mirrors the agenda decisions, not a sixty-slide deck.',
    ],
    coaching: [
      'Reject vague adjectives in outcome headlines—manager enforces on the spot.',
      'No exec meeting without champion path documented in CRM.',
      'Post anti-patterns in Slack; reference in deal review when exec access fails.',
      'Do not schedule exec time for deals that only need technical validation.',
      'Log exec meetings as activities with decision outcome within 24 hours.',
    ],
    bottomLine:
      'Executive calendar is a scarce resource. Reps who show up with outcomes, peer proof, and one decision earn access; reps who request demos get deferred forever. This workshop makes the narrative and routing repeatable before quarter-end enterprise commits.',
    b1Title: 'Frame — Features vs. Executive Risk',
    b1Open:
      'Read a failed exec-request email that asks for a product tour. **Manager says:** "Executives fund risk reduction and peer outcomes—your ask must match."',
    b1Script: 'Poll: who has an exec meeting on calendar with a written decision line? Count hands.',
    b1Crm: 'Flag deals >$X ARR with Exec Meeting Needed = Yes where strategy missing.',
    b1Close: 'Share anti-pattern list starter: demo request, roadmap dump, unpaid consulting.',
    b2Title: 'Outcome Headline & Peer Proof',
    b2Teach:
      'Template: "We help [peer type] achieve [metric] in [timeframe]." Strip product nouns. Pair proof must include number and peer segment.',
    b2Script: 'Manager rejects three volunteer headlines live—team learns the bar.',
    b2Crm: 'Store approved narrative in opportunity note Exec Narrative v1.',
    b2Mgr: 'Enablement validates proof claims against case study library.',
    b3Title: 'Champion Routing & Agenda Build',
    b3Solo:
      'Draft forwardable blurb and 25-minute agenda: context (5), peer story (10), decision (10). Silent write then pair review.',
    b3Script: '**Manager says:** "If the champion cannot forward it without editing, rewrite."',
    b3Crm: 'Log Task: Send champion blurb by [date]; attach agenda doc link.',
    b3Circ: 'Cut any agenda item that is product feature depth.',
    b4Title: 'Role-Play — Champion Says No',
    b4Pair:
      'Partner A is busy champion pushing back on exec time. Partner B practices routing and shrinking ask. Swap.',
    b4Script: 'Timebox to three minutes per side—force concise responses.',
    b4Rules: 'Champion may only object with realistic reasons from your deals.',
    b4Crm: 'If no path, mark deal Not Ready for Exec—do not fake pipeline.',
    b5Title: 'Anti-Patterns & Slack Post',
    b5Group:
      'Team completes anti-pattern list; owner posts to #sales within the hour. Add "exec meeting without decision" as pipeline review flag.',
    b5Script: 'Two volunteers read blurbs aloud for group approval.',
    b5Board: 'Capture top five anti-patterns.',
    b5Commit: 'Each AE states exec meeting target date or Nurture reason.',
    b6Title: 'Close — CRM Exec Discipline',
    b6Close: 'Round-robin: deal, exec ask in one line, champion send date.',
    b6Script: '**Manager says:** "Exec hold without CRM note equals no credit."',
    b6Forecast: 'Enterprise commit requires exec strategy field populated.',
    b6Crm: 'Manager report: enterprise opps missing exec narrative note.',
  };
}

function mk0080() {
  return {
    id: 'st0080',
    h1: 'The Contract Pre-Flight',
    subtitle:
      'A 60-Minute Team Working Session Where Reps Surface Legal and Security Landmines Before Procurement Goes Dark',
    question:
      'The Contract Pre-Flight: Running a 60-Minute Team Working Session Where Reps Surface Legal and Security Landmines Before Procurement Goes Dark — a 60-Minute Sales Training',
    extraTags: ['legal-redlines', 'procurement', 'deal-desk'],
    mins: [8, 12, 16, 13, 7, 4],
    why: `Deals slip when legal and security surprises appear after verbal yes. Reps forecast Commit while MSA status, security questionnaire, data residency, and signature authority are still "unknown"—then procurement goes silent for six weeks.

Pre-flight is a checklist discipline run before forecast commit, not after the buyer ghosts legal. Early legal intro on a twenty-minute buyer call prevents redline ping-pong nobody modeled.

This session co-builds the checklist with legal/RevOps, applies it to top commits live, and downgrades any deal with unchecked unknowns until pre-flight is green.`,
    walkout: [
      'Ten-item pre-flight checklist agreed with legal and RevOps',
      'Checklist completed on each rep\'s top three commit deals',
      'Role-play script for early legal intro practiced',
      'Forecast rule: no Commit without completed pre-flight',
      'Unknowns logged as tasks with owners and dates in CRM',
    ],
    who: 'Account executives, sales manager, and strongly recommended: legal counsel or deal desk plus RevOps. Reps bring top three forecast commits. Without legal present, use recorded checklist from last quarter and schedule legal office hours within a week.',
    prep: [
      'Legal/RevOps drafts draft checklist items before the room (MSA, security, insurance, residency, payment terms, authority).',
      'Reps pull status on each item for top three commits—honest unknowns allowed.',
      'Manager brings one slipped deal caused by late security review.',
      'CRM: ensure Pre-Flight Status field or note template exists.',
    ],
    mermaid: `  A[Verbal yes on deal] --> B[Run pre-flight checklist]
  B --> C{Blockers found?}
  C -->|Yes| D[Engage legal early]
  C -->|No| E[Confirm close timeline]
  D --> F[Update forecast category]
  F --> G[Audit commits weekly]`,
    worksheet: `| Pre-Flight Item | Y / N / Unknown | Owner | Target Date | Notes |
|---|---|---|---|---|
| MSA path (new vs. existing) | ___ | ______ | ______ | ______ |
| Security questionnaire status | ___ | ______ | ______ | ______ |
| Data residency / DPA | ___ | ______ | ______ | ______ |
| Insurance / vendor onboarding | ___ | ______ | ______ | ______ |
| Payment terms within policy | ___ | ______ | ______ | ______ |
| Signature authority confirmed | ___ | ______ | ______ | ______ |
| Procurement / PO process known | ___ | ______ | ______ | ______ |
| **Forecast category after pre-flight** | ______ | | | |`,
    buyerUse: [
      'Invite legal early as a service: "Twenty minutes to align on paper path" reduces buyer anxiety.',
      'Share checklist transparency with champion—shows you have closed similar deals.',
      'Use unknowns to co-build timeline with buyer procurement, not to hide internally.',
      'Reset close date when security queue length is buyer-confirmed, not rep-assumed.',
    ],
    coaching: [
      'Any Unknown on a commit deal triggers downgrade until resolved or dated.',
      'Reps who hide from legal get surprised—reward early introductions.',
      'RevOps audits pre-flight monthly on Commit stage opps.',
      'Pair with buying-process map when procurement steps were invisible.',
      'Celebrate downgrades that save forecast credibility.',
    ],
    bottomLine:
      'Verbal yes is not commit-ready. Reps who run pre-flight before forecast calls surface landmines while buyers still care—and managers who enforce green pre-flight stop week-twelve collapses from invisible legal queues.',
    b1Title: 'Frame — Late Legal Surprises',
    b1Open:
      'Walk through slipped commit: verbal yes in week four, security appeared week eight. **Manager says:** "Pre-flight is how we earn Commit, not how we decorate it."',
    b1Script: 'Legal states average security duration this quarter—write it on the board.',
    b1Crm: 'Open top commit opps; create Pre-Flight note stub on each.',
    b1Close: 'Agree: Unknown = not Commit until dated task exists.',
    b2Title: 'Build the Ten-Item Checklist',
    b2Teach:
      'Legal and RevOps finalize yes/no/unknown items. Define evidence required for Yes (ticket ID, signed DPA, etc.).',
    b2Script: 'Reps ask clarifying questions—capture edge cases in footnotes on worksheet.',
    b2Crm: 'Publish checklist link in CRM sidebar or sales wiki; pin in Slack.',
    b2Mgr: 'Align forecast stage definition with pre-flight complete.',
    b3Title: 'Apply to Live Commits',
    b3Solo:
      'Each rep completes checklist for three commits. Manager and legal circulate—any Unknown without owner/date gets immediate downgrade discussion.',
    b3Script: '**Manager says:** "Show me the task in CRM for every Unknown."',
    b3Crm: 'Create tasks for each Unknown with legal or buyer owner; set due dates.',
    b3Circ: 'Legal flags deals that need buyer-side security contact this week.',
    b4Title: 'Role-Play Early Legal Intro',
    b4Pair:
      'Practice inviting legal to a short buyer call: champion present, agenda tight, no redline negotiation on the call.',
    b4Script: 'Interrupt if rep apologizes for legal—coach confidence framing.',
    b4Rules: 'Buyer played by manager or legal; objections must be realistic.',
    b4Crm: 'Log scheduled legal intro as activity on opportunity.',
    b5Title: 'Forecast Hygiene Rule',
    b5Group:
      'Team adopts written rule: no Commit without completed pre-flight. RevOps describes audit cadence.',
    b5Script: 'Manager names first weekly audit date.',
    b5Board: 'Document downgrade triggers.',
    b5Commit: 'Each rep states one deal they downgraded today and why.',
    b6Title: 'Close — Audit Promise',
    b6Close: 'Legal/RevOps confirms support SLA for Unknown clearance.',
    b6Script: 'Thank legal for attending—reinforce partnership not police.',
    b6Forecast: 'Pipeline review sorts Commit opps by pre-flight status first.',
    b6Crm: 'RevOps saves report: Commit opps missing pre-flight note.',
  };
}

function mk0081() {
  return {
    id: 'st0081',
    h1: 'The Win-Loss Sprint',
    subtitle:
      'A 60-Minute Team Working Session Where Reps Turn Three Lost Deals Into Playbook Updates the Whole Team Uses',
    question:
      'The Win-Loss Sprint: Running a 60-Minute Team Working Session Where Reps Turn Three Lost Deals Into Playbook Updates the Whole Team Uses — a 60-Minute Sales Training',
    extraTags: ['win-loss-analysis', 'sales-enablement', 'closed-lost'],
    mins: [8, 11, 17, 13, 7, 4],
    why: `Teams repeat losses when nobody writes them down. Closed-lost reasons become "no decision" or "other" in CRM, and the same competitor talk track beats you next quarter because enablement never shipped a fix.

Win-loss is not a post-mortem guilt session—it is a sprint: interview one lost deal, tag a controlled reason, extract one playbook change, publish before Friday.

This session locks a five-reason taxonomy, practices neutral fifteen-minute interviews, and ends with three team-adopted updates enablement can publish immediately.`,
    walkout: [
      'Five allowed loss reasons with cap on Other',
      'Fifteen-minute neutral interview script practiced',
      'One lost deal presented per rep with one playbook fix',
      'CRM loss reason tagged on presented deals',
      'Enablement publish commitment with owner and due date',
    ],
    who: 'Full sales team, manager, and enablement owner (or manager as proxy). Each rep brings one closed-lost deal from the last ninety days where buyer contact is still possible or notes exist.',
    prep: [
      'Enablement prepares shared playbook doc section: Win-Loss Updates.',
      'Manager exports closed-lost opps with blank or Other reasons—assign fixes today.',
      'Share interview script; emphasize no selling on the call.',
      'Confirm CRM picklist matches five reasons before the session.',
    ],
    mermaid: `  A[Pick closed-lost deal] --> B[Interview buyer or champion]
  B --> C[Tag primary loss reason]
  C --> D[Draft playbook fix]
  D --> E[Present to team]
  E --> F[Ship update in enablement]
  F --> G[Track repeat loss rate]`,
    worksheet: `| Loss Reason (pick one) | Evidence (quote / data) | Playbook Fix (one) | Owner | Publish By |
|---|---|---|---|---|
| Price | ______ | ______ | ______ | ______ |
| Timing | ______ | ______ | ______ | ______ |
| Incumbent | ______ | ______ | ______ | ______ |
| No decision | ______ | ______ | ______ | ______ |
| Fit | ______ | ______ | ______ | ______ |
| **Other (≤10% team losses)** | ______ | ______ | ______ | ______ |`,
    buyerUse: [
      'Thank the buyer for honesty—neutral tone increases response rate for future interviews.',
      'Ask what would have had to be true to choose you—surfaces real fit and timing gaps.',
      'Share aggregate learnings internally, never attribute quotes in marketing without permission.',
      'Use fixes in the next similar deal—buyers hear sharper discovery and competitive framing.',
    ],
    coaching: [
      'Cap Other at ten percent—force precision in pipeline analytics.',
      'One playbook fix per loss presentation—no laundry lists.',
      'Unpublished fixes do not count; enablement date is part of the sprint scorecard.',
      'Manager schedules interviews within seven days for reps who only have CRM guesses.',
      'Review if same loss reason clusters above thirty percent—strategic signal.',
    ],
    bottomLine:
      'Losses are inventory if you tag and teach them. Reps who run neutral interviews and ship one playbook update per loss stop donating the same deal shape to competitors—and managers who inspect loss reason quality get forecasting and enablement that actually moves.',
    b1Title: 'Frame — Repeat Losses Are a Documentation Problem',
    b1Open:
      'Show CRM chart of Other/blank loss reasons. **Manager says:** "We are not losing randomly—we are failing to record and teach."',
    b1Script: 'Enablement shows empty playbook section—today we fill it.',
    b1Crm: 'Filter closed-lost last 90 days; assign each rep one opp to present.',
    b1Close: 'Rule: no selling on win-loss interview calls—remove from room if debated.',
    b2Title: 'Loss Reason Taxonomy & Interview Script',
    b2Teach:
      'Define five reasons with examples. Walk fifteen-minute script: thank, context, what decided, what would have changed outcome, permission to follow up.',
    b2Script: 'Manager and rep role-play two minutes of the script—room critiques tone.',
    b2Crm: 'Demonstrate tagging loss reason on closed opp; require primary reason only.',
    b2Mgr: 'RevOps locks Other picklist or requires manager approval for Other.',
    b3Title: 'Playbook Extraction Presentations',
    b3Solo:
      'Each rep prepares five-minute presentation: deal summary, reason, one fix (talk track, competitor card, discovery question). Three reps present live if time; others submit in doc.',
    b3Script: '**Manager says:** "Fix must be usable Monday morning—not train-more platitudes."',
    b3Crm: 'Update loss reason on presented opps before leaving the block.',
    b3Circ: 'Team votes top fix to publish first if multiple compete.',
    b4Title: 'Peer Hardening of Fixes',
    b4Pair:
      'Pairs stress-test fixes: would this have changed your last lost deal? Rewrite weak fixes.',
    b4Script: 'Bell at five minutes—swap partners if odd count.',
    b4Rules: 'Critique the fix, not the rep who lost the deal.',
    b4Crm: 'Log enablement task linked to loss opp for traceability.',
    b5Title: 'Publish Commitment',
    b5Group:
      'Enablement owner commits publish date for top three fixes. Assign doc sections and reviewers.',
    b5Script: 'Name Slack channel post template for Monday ship.',
    b5Board: 'List fixes shipping this week with owners.',
    b5Commit: 'Reps without interview scheduled book it before EOD.',
    b6Title: 'Close — Metric to Watch',
    b6Close: 'Manager sets thirty-day goal: reduce Other/blank loss reasons to under ten percent.',
    b6Script: 'Celebrate one painful lesson shared publicly—psychological safety.',
    b6Forecast: 'Win-loss quality discussed in QBR, not only win rate.',
    b6Crm: 'RevOps dashboard: loss reason distribution week over week.',
  };
}

function mk0082() {
  return {
    id: 'st0082',
    h1: 'The Territory Signal Stack',
    subtitle:
      'A 60-Minute Team Working Session Where Reps Rank Accounts by Intent Signals Instead of Alphabetical CRM Sorts',
    question:
      'The Territory Signal Stack: Running a 60-Minute Team Working Session Where Reps Rank Accounts by Intent Signals Instead of Alphabetical CRM Sorts — a 60-Minute Sales Training',
    extraTags: ['territory-planning', 'account-prioritization', 'intent-data'],
    mins: [8, 12, 17, 13, 6, 4],
    why: `Reps waste quarters on accounts that look big in CRM but will never buy this period. Alphabetical sorts and "largest employee count" views feel productive while tier-one signals sit untouched.

A signal stack combines firmographic fit, intent, engagement, and timing into a ranked call list—top twenty accounts get exec touches and sequences; tier three gets nurture only.

This session defines weights with RevOps, ranks thirty accounts live, assigns channel by tier, and commits to logging touches only against tier-one targets for two weeks so meeting rate proves the model.`,
    walkout: [
      'Three-tier scoring model with numeric weights from RevOps fields',
      'Ranked top thirty accounts with stack rank numbers in CRM',
      'Two-week channel plan: exec / sequence / nurture by tier',
      'Meetings-booked metric tied to tier-one only for review',
      'Manager challenge list for any top-ten with zero recent engagement',
    ],
    who: 'All reps with named territories plus manager and RevOps. Marketing optional for intent source clarification. Reps need CRM export or view of their territory accounts and access to intent/engagement tools.',
    prep: [
      'RevOps publishes scoring fields and weights (fit, intent, engagement, timing) in a one-pager.',
      'Reps export territory accounts to spreadsheet or use CRM inline editing view.',
      'Manager identifies last quarter\'s tier-one accounts that booked zero meetings—teaching moment.',
      'Confirm where stack rank number will live in CRM (custom field or tag TOP20-).',
    ],
    mermaid: `  A[Export territory accounts] --> B[Score fit 1-3]
  B --> C[Add intent + engagement]
  C --> D[Compute stack rank]
  D --> E[Top 20 = weekly focus]
  E --> F[Log touches in CRM]
  F --> G[Review tier-1 meeting rate]`,
    worksheet: `| Account | Fit (1-3) | Intent | Engagement | Timing | Weighted Score | Tier (1/2/3) | Channel |
|---|---|---|---|---|---|---|---|
| ______ | ___ | ___ | ___ | ___ | ___ | ___ | ______ |
| ______ | ___ | ___ | ___ | ___ | ___ | ___ | ______ |
| **Top 20 cutoff score** | | | | | ___ | | |`,
    buyerUse: [
      'Tier-one outreach references the signal they triggered—buyers know why you called now.',
      'Exec touches carry business outcome hooks, not generic check-ins.',
      'Tier-three nurture stays valuable but does not consume live call blocks.',
      'When a tier-three account spikes intent, promote it—stack is living.',
    ],
    coaching: [
      'Challenge top-ten with zero engagement—fix signal model or rep discipline.',
      'Do not let reps invent shadow spreadsheets—RevOps fields are source of truth.',
      'Review tier-one meeting rate in two weeks; underperformance means model or messaging fix.',
      'Rebalance weights quarterly when ICP shifts.',
      'Celebrate reps who demote famous logos with no signals—saves time.',
    ],
    bottomLine:
      'Territory management is prioritization math, not alphabet soup. Reps who stack-rank by fit, intent, engagement, and timing book more meetings with less noise—and managers who inspect tier-one outcomes learn whether the model or the message needs fixing.',
    b1Title: 'Frame — Busy vs. Prioritized',
    b1Open:
      'Show rep activity report with high touch count and low meetings. **Manager says:** "Activity on tier three is optional; tier one is mandatory."',
    b1Script: 'RevOps walks the weight formula in three minutes—no math debates in the room.',
    b1Crm: 'Open territory view; add temporary column for Weighted Score if needed.',
    b1Close: 'Each rep states count of accounts in territory—sets scope for rank block.',
    b2Title: 'Scoring Model Teach-In',
    b2Teach:
      'Define tiers with thresholds. Examples: tier 1 = top twenty scores; tier 2 = next thirty; tier 3 = remainder. Clarify intent vs. engagement sources.',
    b2Script: 'Work one example account on screen start to finish.',
    b2Crm: 'Document field API names for integrations—reps tag correctly.',
    b2Mgr: 'Manager notes accounts that must never auto-tier (strategic logos).',
    b3Title: 'Rank Live — Top Thirty',
    b3Solo:
      'Reps score and sort thirty accounts. Manager challenges any top-ten with zero engagement in last sixty days—demote or justify with written signal.',
    b3Script: '**Manager says:** "Famous logo without signal is tier two until proven."',
    b3Crm: 'Write stack rank integer to CRM field; tag TOP20 for tier one.',
    b3Circ: 'RevOps helps reps stuck on missing intent data—default rules provided.',
    b4Title: 'Two-Week Channel Plan',
    b4Pair:
      'Pairs assign channel per tier for their top twenty: exec touch, sequence enrollment, nurture only. Cross-check for realistic capacity.',
    b4Script: 'Capacity cap: max five exec touches per rep per week.',
    b4Rules: 'Plans must name first touch date within five business days.',
    b4Crm: 'Create tasks for tier-one first touches with due dates.',
    b5Title: 'Metrics & Review Date',
    b5Group:
      'Book two-week review. Metric: meetings booked from tier-one accounts only.',
    b5Script: 'Manager commits to not judging tier-three activity in interim.',
    b5Board: 'Post metric definition in Slack.',
    b5Commit: 'Each rep names first tier-one account they will call tomorrow.',
    b6Title: 'Close — Model Feedback Loop',
    b6Close: 'RevOps invites feedback on weights after review—one adjustment per quarter max.',
    b6Script: '**Manager says:** "If tier one underperforms, we fix signals—not blame reps first."',
    b6Forecast: 'Pipeline creation goals align to tier-one meetings, not total dials.',
    b6Crm: 'Save ranked export snapshot for comparison at two-week review.',
  };
}

function mk0083() {
  return {
    id: 'st0083',
    h1: 'The Split Documentation Standup',
    subtitle:
      'A 60-Minute Team Working Session Where Reps Lock Credit Splits Before Quarter Close Prevents Commission Fights',
    question:
      'The Split Documentation Standup: Running a 60-Minute Team Working Session Where Reps Lock Credit Splits Before Quarter Close Prevents Commission Fights — a 60-Minute Sales Training',
    extraTags: ['sales-compensation', 'deal-splits', 'revops-ops'],
    mins: [8, 11, 18, 13, 6, 4],
    why: `Commission disputes are forecast noise turned toxic. Overlay AEs, SEs, partners, and marketplace sourced deals create ambiguous credit after the check prints—Finance and Sales Ops spend weeks arbitrating while morale drops.

Splits must be documented on live Commit deals with manager sign-off before Close Won, not in Slack threads after quarter-end.

This standup shows where splits live in CRM, audits every Commit deal in the room, and defines a forty-eight-hour escalation path with evidence requirements.`,
    walkout: [
      'CRM split fields located and understood by every rep',
      'Every Commit deal has named rows for overlay, SE, partner roles',
      'Manager sign-off captured on disputed or partner deals',
      'Partner deal checklist completed for channel/marketplace commits',
      'Posted escalation path in #sales-ops with forty-eight-hour window',
    ],
    who: 'All closing reps, sales manager, and RevOps (required). Finance or Sales Ops optional but valuable for comp plan edge cases. Every rep with deals in Commit stage.',
    prep: [
      'RevOps demos split object/fields in CRM on a recorded two-minute clip shared before standup.',
      'Manager exports Commit-stage pipeline with split completeness flag.',
      'Collect last quarter\'s top three commission disputes as anonymized examples.',
      'Draft escalation path template for #sales-ops post.',
    ],
    mermaid: `  A[Open commit deal] --> B[Document all roles]
  B --> C[Confirm split % in CRM]
  C --> D[Manager sign-off]
  D --> E[Close won]
  E --> F[Audit vs comp plan]
  F --> G[48hr dispute window]`,
    worksheet: `| Opportunity | AE % | Overlay / SE | Partner Source? | Split in CRM (Y/N) | Manager Sign-off | Notes |
|---|---|---|---|---|---|---|
| ______ | ___ | ______ | Y/N | ___ | ___ | ______ |
| ______ | ___ | ______ | Y/N | ___ | ___ | ______ |
| **Partner checklist** (source/close/renewal) | | | | | | ______ |`,
    buyerUse: [
      'Not buyer-facing—internal discipline protects customer handoffs when AE/CSM splits are clear.',
      'Partner deals: confirm who owns customer introduction on first call to avoid duplicate outreach.',
      'Clean splits speed implementation kickoff because the right AE owns the relationship.',
      'Transparency reduces rep conflict that buyers sense as disorganization.',
    ],
    coaching: [
      'Missing split on Commit = automatic downgrade until documented.',
      'Manager sign-off required on any non-standard percentage.',
      'Partner deals use separate checklist—never assume default splits.',
      'RevOps audits monthly; do not wait for commission statements.',
      'Post disputes only through escalation path—no Slack wars.',
    ],
    bottomLine:
      'Credit clarity is RevOps hygiene, not Finance cleanup. Reps who document splits on live commits close the quarter without commission theater—and managers who audit in the standup protect forecast credibility and team trust.',
    b1Title: 'Frame — Commission Fights Are Preventable',
    b1Open:
      'Anonymized dispute story: same deal, two reps, no CRM row. **Manager says:** "If it is not in CRM before Close Won, it did not happen."',
    b1Script: 'RevOps states comp plan reference doc location.',
    b1Crm: 'Open Commit pipeline view with Split Complete filter.',
    b1Close: 'Agree standup rule: no new Commit today without split row attempt.',
    b2Title: 'Split Fields Walkthrough',
    b2Teach:
      'RevOps screenshares: primary AE, overlay, SE credit, partner sourced, split percentages, approval workflow. Channel deals get second checklist: source, close, renewal owner.',
    b2Script: 'Reps ask edge cases—RevOps captures for FAQ post.',
    b2Crm: 'Each rep bookmarks split entry screen on one live opp.',
    b2Mgr: 'Manager explains sign-off button or comment tag MANAGER-SPLIT-OK.',
    b3Title: 'Live Audit — Every Commit',
    b3Solo:
      'Go down Commit list alphabetically by rep. Five minutes per deal max: all roles named, percentages sum to 100, partner flags set.',
    b3Script: '**Manager says:** "Downgrade now if split missing—fix before week-end close."',
    b3Crm: 'Update split rows live; downgrade forecast category when incomplete.',
    b3Circ: 'Finance clarifies marketplace vs. reseller rules on the spot if present.',
    b4Title: 'Partner Deal Deep Dive',
    b4Pair:
      'Pairs complete partner checklist on any channel/marketplace commit. Verify sourced vs. closed credit.',
    b4Script: 'Read escalation path draft; team edits wording.',
    b4Rules: 'Percentages must match comp plan caps—RevOps validates.',
    b4Crm: 'Tag partner opps PARTNER-SPLIT-AUDITED when done.',
    b5Title: 'Escalation Path Publish',
    b5Group:
      'Finalize forty-eight-hour dispute window and evidence list (CRM screenshot, email, comp plan section). Owner posts to #sales-ops before standup ends.',
    b5Script: 'Manager forbids informal side deals on splits.',
    b5Board: 'Escalation steps numbered 1–4 on whiteboard.',
    b5Commit: 'RevOps schedules monthly split audit calendar series.',
    b6Title: 'Close — Zero Missing Splits',
    b6Close: 'Report: count of Commit opps fixed today vs. downgraded.',
    b6Script: 'Thank RevOps—reinforce partnership.',
    b6Forecast: 'Commit definition includes split completeness in CRM.',
    b6Crm: 'RevOps sends Commit opps missing splits report Friday EOD weekly.',
  };
}
