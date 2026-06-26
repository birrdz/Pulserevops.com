const { getStore } = require('@netlify/blobs');
const fs = require('fs');

const token = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8')
  .split(/\r?\n/).find(l => l.startsWith('BLOBS_PAT=')).slice('BLOBS_PAT='.length).trim();

const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token
});

const ID = 'st0040';

const QUESTION = 'The SDR-to-AE Handoff: Running a Lead-Qualification Sync That Stops Good Pipeline From Dying in the Gap Between Prospecting and Selling — a 60-Minute Sales Training';

const ANSWER = `### Direct Answer

**The single most expensive leak in a two-tier sales org is not bad prospecting and not bad closing — it is the handoff between them.** An SDR books a meeting, an AE inherits a name and a one-line note, the AE shows up cold, the buyer repeats themselves, and the deal dies of friction nobody owns. This 60-minute training installs a standardized SDR-to-AE handoff so qualified pipeline survives the transfer instead of evaporating in the gap.

The goal of this session is not to assign blame for no-shows or stage-zero churn. It is to build one shared definition of a "qualified, accepted" opportunity, one handoff artifact both roles trust, and one weekly sync that catches a weak transfer before the AE wastes a discovery slot on it.

\`\`\`mermaid
flowchart TD
    A[SDR books meeting] --> B[SDR writes handoff brief]
    B --> C[AE reviews brief before accept]
    C --> D{Meets accepted-opportunity bar}
    D -->|Yes| E[AE accepts and confirms with buyer]
    D -->|No| F[Bounce back to SDR with one reason]
    F --> G[SDR re-qualifies or recycles lead]
    E --> H[Discovery call held warm]
    H --> I[Weekly sync inspects handoff quality]
    I --> J[Update shared accepted bar definition]
\`\`\`

---

### SECTION 1 — Frame the Cost (10 minutes)

Open with the math, not the lecture. Pull last quarter's numbers: meetings booked by SDRs, meetings actually held, and meetings that converted to a real opportunity. The drop from "booked" to "held" is your no-show tax. The drop from "held" to "accepted opportunity" is your handoff tax. Most teams discover the handoff tax is 30 to 50 percent — half the meetings the SDR celebrated never become pipeline.

Make the team feel the waste in human terms: every dead handoff is an SDR who hit quota on paper and an AE who burned a discovery slot for nothing. Neither role is lying; the system has no shared bar.

### SECTION 2 — Define the Accepted-Opportunity Bar (12 minutes)

As a group, write a single checklist that converts a "booked meeting" into an "accepted opportunity." Keep it to five or six items the SDR can actually verify on a call: a named pain or trigger event, the prospect's role and authority, a rough timeline, an acknowledged budget reality, confirmed attendees, and a reason the meeting is happening now. This is your contract. If the SDR clears the bar, the AE accepts. If not, the AE bounces it.

### SECTION 3 — Build the Handoff Brief (12 minutes)

Design the artifact. The handoff brief is a short, structured note — not a paragraph of vibes. It carries the trigger, the pain in the buyer's own words, who will attend, what the SDR promised the meeting would cover, and any landmine the SDR heard. Have each AE-SDR pair draft one brief together from a real recent lead so the format is muscle memory, not a template nobody opens.

### SECTION 4 — Practice the Bounce-Back (10 minutes)

The hardest skill is the friendly rejection. Role-play an AE bouncing a weak handoff back to the SDR with exactly one specific reason and a clear path to fix it. The rule: bounce with a reason, never with a shrug. A bounce is coaching, not a strike against the SDR. Practice both sides so the SDR learns the bar by feeling it.

### SECTION 5 — Install the Weekly Sync (10 minutes)

Stand up a 25-minute weekly SDR-AE sync. Agenda: review every handoff from the prior week, mark each accepted or bounced, and tally the acceptance rate. When acceptance climbs, the SDR is qualifying better. When bounces cluster on one checklist item, that item gets coached. The sync also feeds the bar itself — if a "passing" lead keeps dying in discovery, the bar is missing something.

### SECTION 6 — Counter-Case: When to Loosen the Bar (6 minutes)

A rigid bar can starve a new AE or choke a brand-new market where no buyer has a clean trigger yet. Close by naming the exceptions: in greenfield segments, accept lower-qualified meetings deliberately as learning at-bats; for ramping SDRs, coach inputs before grading output; and in high-velocity, low-ACV motions, a heavy six-point bar is overkill — trim it to two or three. The handoff process should match deal size and team maturity, not fight them.

---

### How to Run This Training

Block 60 minutes with the full SDR and AE teams in one room. Assign one SDR-AE pair per breakout for Sections 3 and 4. Leave the session with three artifacts live by end of day: the written accepted-opportunity bar, the handoff brief template in your CRM, and a recurring weekly sync on the calendar. Inspect the acceptance rate every week until it stabilizes above 80 percent.`;

const TAGS = [
  'sales-training',
  'sdr-ae-handoff-training',
  'lead-qualification',
  'sales-development',
  'pipeline-handoff',
  'opportunity-acceptance',
  'sdr-management',
  'sales-process',
  'meeting-to-opportunity-conversion',
  'revops',
  '60-min-meeting',
  'standard-team',
  ID
];

(async () => {
  // (a) read index, confirm highest st id
  const idxBefore = await store.get('_index.json', { type: 'json' });
  const stIds = (idxBefore.entries || [])
    .map(e => e.id).filter(id => /^st\d+$/.test(id))
    .sort();
  console.log('Highest existing st id:', stIds[stIds.length - 1]);
  if (stIds.includes(ID)) {
    console.error('ABORT: ' + ID + ' already exists');
    return;
  }
  console.log('ANSWER LENGTH:', ANSWER.length, 'HAS MERMAID:', ANSWER.includes('```mermaid'));

  const ts = Date.now();
  const record = {
    id: ID,
    question: QUESTION,
    answer: ANSWER,
    tags: TAGS,
    sources: [],
    ts,
    model: 'claude-opus-4-7-via-claude-code',
    quality_score: 5,
    polished_at: null,
    polish_history: [],
    source: 'claude-opus-bespoke-seed',
    format_v: null
  };

  // (d) write the answer record
  await store.setJSON('answers/' + ID + '.json', record);
  console.log('Wrote answers/' + ID + '.json');

  // (e) re-read index immediately before write, prepend, save
  const idx = await store.get('_index.json', { type: 'json' });
  const already = new Set((idx.entries || []).map(e => e.id));
  if (!already.has(ID)) {
    idx.entries.unshift({
      id: ID,
      question: QUESTION,
      tags: TAGS,
      ts,
      quality_score: 5
    });
    await store.setJSON('_index.json', idx);
    console.log('Index updated. total_now:', idx.entries.length);
  } else {
    console.log('Index already had ' + ID + ' — skipped index write');
  }

  // verify
  const check = await store.get('answers/' + ID + '.json', { type: 'json' });
  console.log('VERIFY answer record id:', check.id, 'qs:', check.quality_score);
})().catch(e => console.error('ERR', e.message));
