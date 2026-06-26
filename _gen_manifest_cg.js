// Generates _manifest_cg.json — 200 distinct sales-coaching Q&A topics across
// 20 themes (10 each). Run: node _gen_manifest_cg.js
const fs = require('fs');
const Q = [
  // A — Coaching fundamentals / manager-as-coach
  "How do you transition from top sales rep to sales coach?",
  "How much time should a sales manager spend coaching each week?",
  "How do you build a weekly sales coaching cadence that sticks?",
  "How do you coach salespeople without micromanaging them?",
  "How do you give sales reps feedback they'll actually act on?",
  "How do you coach a sales team when you're also carrying a quota?",
  "How do you decide which reps to coach first?",
  "How do you create a coaching culture on a sales team?",
  "How do you measure whether your sales coaching is working?",
  "How do you coach reps who think they don't need coaching?",
  // B — Onboarding & ramping
  "How do you coach a new SDR through their first 30 days?",
  "How do you ramp a new account executive to full quota faster?",
  "How do you build a 30/60/90 day coaching plan for a new rep?",
  "How do you coach a rep who's struggling during onboarding?",
  "How do you onboard an experienced sales hire without insulting them?",
  "How do you coach product knowledge to a brand-new salesperson?",
  "How do you certify a new rep is ready to sell on their own?",
  "How do you coach a career-changer into their first sales role?",
  "How do you shorten sales ramp time with better coaching?",
  "How do you coach a new rep through their first lost deal?",
  // C — Prospecting & pipeline generation
  "How do you coach a sales rep who won't prospect?",
  "How do you coach a rep to build a consistent prospecting habit?",
  "How do you coach reps to keep their pipeline 3x covered?",
  "How do you coach a rep whose pipeline keeps drying up?",
  "How do you coach reps to personalize outreach at scale?",
  "How do you coach a rep who only works inbound leads?",
  "How do you coach reps to book more meetings from cold outreach?",
  "How do you coach a rep to research accounts before reaching out?",
  "How do you coach reps on multithreading into target accounts?",
  "How do you coach a rep to follow up without being annoying?",
  // D — Cold calling
  "How do you coach a rep who's afraid of cold calling?",
  "How do you coach reps to open a cold call without getting hung up on?",
  "How do you coach a rep through call reluctance?",
  "How do you coach reps to handle 'I'm not interested' on a cold call?",
  "How do you coach a rep to sound natural on the phone, not scripted?",
  "How do you run a cold-call coaching session with live dials?",
  "How do you coach reps to leave voicemails that get callbacks?",
  "How do you coach a rep to improve their cold-call connect rate?",
  "How do you coach reps to get past gatekeepers?",
  "How do you coach a rep whose tone kills their cold calls?",
  // E — Email / social outreach
  "How do you coach a rep to write cold emails that get replies?",
  "How do you coach reps to use LinkedIn for social selling?",
  "How do you coach a rep whose emails are too long and salesy?",
  "How do you coach reps on subject lines that get opened?",
  "How do you coach a rep to write better follow-up emails?",
  "How do you coach reps to use video in their outreach?",
  "How do you coach a rep to personalize emails without spending all day?",
  "How do you coach reps to build a multichannel outreach sequence?",
  "How do you coach a rep to write a strong breakup email?",
  "How do you coach reps to use AI for outreach without sounding robotic?",
  // F — Discovery & qualification
  "How do you coach a rep to run a great discovery call?",
  "How do you coach reps to ask better discovery questions?",
  "How do you coach a rep who talks too much on discovery calls?",
  "How do you coach reps to uncover a prospect's real pain?",
  "How do you coach a rep to qualify out bad-fit deals early?",
  "How do you coach reps to use MEDDIC in discovery?",
  "How do you coach a rep to quantify the cost of the prospect's problem?",
  "How do you coach reps to find the economic buyer?",
  "How do you coach a rep who skips discovery and jumps to the demo?",
  "How do you coach reps to confirm budget without killing the deal?",
  // G — Demo / presentation
  "How do you coach a rep to give a demo that closes?",
  "How do you coach reps to stop doing feature-dump demos?",
  "How do you coach a rep to tailor the demo to the buyer's pain?",
  "How do you coach reps to handle questions during a demo?",
  "How do you coach a rep whose demos are technically strong but boring?",
  "How do you coach reps to tell better customer stories?",
  "How do you coach a rep to present pricing with confidence?",
  "How do you coach reps to run a great executive presentation?",
  "How do you coach a rep to control the room in a group demo?",
  "How do you coach reps to set next steps at the end of a demo?",
  // H — Objection handling
  "How do you coach a rep to handle the 'it's too expensive' objection?",
  "How do you coach reps to handle objections without getting defensive?",
  "How do you coach a rep to handle 'we're happy with our current vendor'?",
  "How do you coach reps to handle 'just send me some information'?",
  "How do you coach a rep to handle 'we don't have budget right now'?",
  "How do you coach reps to handle 'I need to think about it'?",
  "How do you coach a rep to handle a competitor comparison objection?",
  "How do you coach reps to surface hidden objections?",
  "How do you coach a rep to handle 'let me talk to my boss'?",
  "How do you coach reps to reframe objections as buying signals?",
  // I — Negotiation & closing
  "How do you coach a rep who's great at demos but can't close?",
  "How do you coach reps to ask for the sale without being pushy?",
  "How do you coach a rep to stop discounting to win deals?",
  "How do you coach reps to negotiate without giving away margin?",
  "How do you coach a rep to create urgency without fake deadlines?",
  "How do you coach reps to handle end-of-quarter procurement pressure?",
  "How do you coach a rep to trade concessions instead of caving?",
  "How do you coach reps to close on value, not price?",
  "How do you coach a rep to get a firm commitment to next steps?",
  "How do you coach reps to walk away from a bad deal?",
  // J — Deal & opportunity coaching
  "How do you run a deal-coaching session that actually moves the deal?",
  "How do you coach a rep on a stalled six-figure deal?",
  "How do you coach reps to build a mutual action plan with buyers?",
  "How do you coach a rep to navigate a buying committee?",
  "How do you coach reps to find and arm a champion?",
  "How do you coach a rep to re-engage a ghosting prospect?",
  "How do you coach reps to qualify the decision-making process?",
  "How do you coach a rep to forecast a deal honestly?",
  "How do you coach reps to compete in a competitive deal?",
  "How do you coach a rep to expand a deal's scope and value?",
  // K — Pipeline reviews & forecasting
  "How do you run a pipeline review that isn't just status updates?",
  "How do you coach reps to keep their CRM clean and current?",
  "How do you coach a rep whose forecast is always wrong?",
  "How do you coach reps to commit deals they can actually close?",
  "How do you coach a rep to inspect their own pipeline?",
  "How do you coach reps to remove dead deals from the pipeline?",
  "How do you coach a rep to improve forecast accuracy?",
  "How do you run a weekly forecast call without it taking two hours?",
  "How do you coach reps to use stage exit criteria correctly?",
  "How do you coach a rep who sandbags their forecast?",
  // L — 1:1s & cadence
  "How do you run a sales 1:1 that's coaching, not a status update?",
  "How do you structure a weekly sales coaching 1:1?",
  "How do you coach a rep who comes to 1:1s unprepared?",
  "How do you balance coaching and accountability in a 1:1?",
  "How do you coach reps to set their own development goals?",
  "How do you keep coaching consistent when you're swamped?",
  "How do you coach a rep using their own call recordings in a 1:1?",
  "How do you follow up on coaching so it actually changes behavior?",
  "How do you coach a rep who gets defensive in 1:1s?",
  "How do you document and track coaching across your team?",
  // M — Call / conversation-intelligence coaching
  "How do you coach reps using Gong or Chorus call recordings?",
  "How do you coach a rep to talk less and listen more on calls?",
  "How do you coach reps on their talk-to-listen ratio?",
  "How do you use conversation-intelligence data to coach a team?",
  "How do you coach a rep who interrupts prospects?",
  "How do you coach reps to ask better questions using call data?",
  "How do you run a call-review session that reps don't dread?",
  "How do you coach a rep to improve their next-steps language?",
  "How do you scale call coaching across a large sales team?",
  "How do you coach reps to act on AI call-coaching feedback?",
  // N — Underperformer turnaround / PIPs
  "How do you coach a sales rep who's consistently missing quota?",
  "How do you tell if a rep needs coaching or a PIP?",
  "How do you turn around an underperforming sales rep?",
  "How do you coach a rep through a performance improvement plan?",
  "How do you coach a rep who's slipping after a strong start?",
  "How do you have a tough conversation with an underperformer?",
  "How do you coach a veteran rep who's coasting?",
  "How do you know when coaching won't fix a sales rep?",
  "How do you coach a rep back from a long slump?",
  "How do you re-motivate a rep who's checked out?",
  // O — Motivation, mindset, burnout, retention
  "How do you coach a sales rep through a confidence crisis?",
  "How do you coach reps to stay motivated during a slow quarter?",
  "How do you coach a rep who's burning out?",
  "How do you coach salespeople to handle rejection?",
  "How do you coach a top performer so they don't leave?",
  "How do you coach reps to build resilience and grit?",
  "How do you motivate a sales team without relying on money?",
  "How do you coach a rep whose attitude is hurting the team?",
  "How do you coach reps to manage their own energy and time?",
  "How do you coach a rep who's stressed about hitting quota?",
  // P — Quota, comp, tough conversations
  "How do you coach a rep who thinks their quota is unfair?",
  "How do you have a comp conversation without demotivating a rep?",
  "How do you coach a rep who's upset about a territory change?",
  "How do you coach reps to sell at higher price points?",
  "How do you coach a rep through a missed quarter without crushing them?",
  "How do you coach a rep who's overly focused on commission?",
  "How do you deliver tough feedback to a sensitive sales rep?",
  "How do you coach a rep who blames marketing for bad leads?",
  "How do you coach reps to take ownership of their numbers?",
  "How do you coach a rep who argues with every piece of feedback?",
  // Q — Activity & metrics-based coaching
  "How do you coach reps using activity metrics without micromanaging?",
  "Which sales metrics should you coach to first?",
  "How do you coach a rep with high activity but low results?",
  "How do you coach a rep with great results but low activity?",
  "How do you coach reps to improve their win rate?",
  "How do you coach a rep to shorten their sales cycle?",
  "How do you coach reps to increase average deal size?",
  "How do you coach a rep to improve conversion at each stage?",
  "How do you use a scorecard to coach a sales team?",
  "How do you coach reps to improve their lead-to-opportunity rate?",
  // R — Skill development & role-play
  "How do you use role-play to coach sales skills effectively?",
  "How do you run a role-play session reps don't hate?",
  "How do you coach a rep to improve one skill at a time?",
  "How do you build a sales skills matrix to guide coaching?",
  "How do you coach storytelling skills to salespeople?",
  "How do you coach active listening to a sales rep?",
  "How do you coach a rep to improve their business acumen?",
  "How do you coach reps to sell to executives?",
  "How do you certify sales skills before reps face real buyers?",
  "How do you coach reps to handle silence and pauses on calls?",
  // S — Remote / hybrid / async coaching
  "How do you coach a remote sales team effectively?",
  "How do you coach reps you never see in person?",
  "How do you build a coaching cadence with a distributed sales team?",
  "How do you coach a rep over video without losing connection?",
  "How do you give async coaching feedback that lands?",
  "How do you coach reps across multiple time zones?",
  "How do you keep remote reps accountable without micromanaging?",
  "How do you onboard and coach a fully remote new hire?",
  "How do you run effective virtual role-play with remote reps?",
  "How do you spot a struggling remote rep before it's too late?",
  // T — Frameworks & scaling coaching
  "How do you use the GROW model to coach salespeople?",
  "How do you scale sales coaching as your team grows?",
  "How do you train your frontline managers to coach?",
  "How do you build a repeatable sales coaching framework?",
  "How do you coach the coaches — developing your sales managers?",
  "How do you use enablement and coaching together?",
  "How do you create coaching playbooks for common rep gaps?",
  "How do you measure the ROI of sales coaching?",
  "How do you coach a sales team through a major change like a new product?",
  "How do you build a self-coaching habit in your sales reps?",
];

function slugify(q) {
  let s = q.toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  // trim long slugs to ~7 words
  s = s.split('-').slice(0, 8).join('-');
  return s;
}

const seen = new Set();
const out = Q.map((title, i) => {
  const id = 'cg' + String(i + 1).padStart(4, '0');
  let slug = slugify(title);
  let base = slug, n = 2;
  while (seen.has(slug)) { slug = base + '-' + n; n++; }
  seen.add(slug);
  return { id, title, slug };
});
if (out.length !== 200) { console.error('EXPECTED 200, got ' + out.length); process.exit(1); }
fs.writeFileSync('C:/Users/koryj/website/_manifest_cg.json', JSON.stringify(out, null, 1));
console.log('Wrote _manifest_cg.json with ' + out.length + ' topics. Sample:');
console.log(out.slice(0, 3).concat(out.slice(-2)).map(o => o.id + ' | ' + o.title).join('\n'));
