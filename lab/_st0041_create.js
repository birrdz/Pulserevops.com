const { getStore } = require('@netlify/blobs');
const fs = require('fs');

const token = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8')
  .split(/\r?\n/).find(l => l.startsWith('BLOBS_PAT=')).slice('BLOBS_PAT='.length).trim();

const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token
});

const ID = 'st0041';

const QUESTION = 'The Discovery Question Calibration Clinic: Peer-Reviewing Real Discovery Calls So Reps Stop Asking Shallow Questions and Start Surfacing Real Pain — a 60-Minute Sales Training';

const ANSWER = `### Direct Answer

**Most deals are not lost in the close — they are lost in a discovery call where the rep collected facts instead of finding pain.** A rep asks "what tools are you using today?", gets an answer, moves on, and never learns what that costs the buyer, who feels it, or what happens if nothing changes. The deal then stalls in late stage because there was never a real problem worth paying to solve. This 60-minute clinic fixes discovery as a team skill by reviewing actual recorded calls and rebuilding the questions out loud.

The goal of this session is not to grade reps or replay a script. It is to install a shared standard for what a good discovery question sounds like, give every rep three or four reusable question patterns that go a layer deeper, and create a habit of peer calibration so the bar holds after the meeting ends.

\`\`\`mermaid
flowchart TD
    A[Pull two recent discovery call recordings] --> B[Team listens to a flat fact-collecting clip]
    B --> C[Identify the missed layer of pain]
    C --> D[Rewrite the question as a group]
    D --> E[Practice the deeper question in pairs]
    E --> F{Did the rewrite surface real pain}
    F -->|Yes| G[Add the pattern to the team question bank]
    F -->|No| H[Coach the follow-up and retry]
    H --> E
    G --> I[Commit to one new question per rep this week]
\`\`\`

---

### SECTION 1 — Frame the Real Cost of Shallow Discovery (8 minutes)

Open with the pattern, not the blame. Most reps treat discovery as a fact-gathering survey: current tools, team size, budget cycle. Facts are not pain. A buyer with a fact has no urgency; a buyer who has just said out loud what a problem is costing them has urgency. Show the team a slow-deal report and point out how many stalled opportunities had a clean discovery on paper but no quantified pain. Land the message: a discovery call's only job is to make the buyer hear their own problem clearly enough to want it gone.

### SECTION 2 — Listen to a Flat Call Clip (10 minutes)

Play a real two-to-three-minute clip from a recent recorded discovery call where the rep collected facts and moved on. Do not pick a disaster — pick an average call, because average is the actual problem. Have the team write down, silently, the exact moment the rep had an opening to go deeper and instead changed topics. Then surface the answers. The team will usually find three or four missed layers in a single short clip.

### SECTION 3 — Teach the Three Deeper Layers (12 minutes)

Give the team a simple model for going past the fact. Every surface answer has three layers underneath it: the impact layer (what does this cost in time, money, or risk), the people layer (who feels this and how does it affect them), and the consequence layer (what happens in six months if nothing changes). Walk through one example: "We use spreadsheets for forecasting" becomes "How far off was last quarter's number, and what did that miss cost you with your board?" Same topic, three layers deeper.

### SECTION 4 — Rebuild the Questions as a Group (12 minutes)

Return to the flat clip from Section 2. Take each missed moment and have the team rewrite the question live on a whiteboard, pushing it down through the impact, people, and consequence layers. Argue about wording — the disagreement is the learning. The output of this section is four to six rebuilt questions written in the team's own language, not a vendor's framework.

### SECTION 5 — Pair Practice With a Live Buyer (12 minutes)

Break into pairs. One rep plays a buyer using a real account they know; the other runs three minutes of discovery using only the rebuilt questions. The listener's single job is to catch every moment the rep accepted a surface answer and let it go. Swap roles. Practice is where the question patterns move from a whiteboard into muscle memory, so protect this time and do not let it get cut.

### SECTION 6 — Counter-Case: When NOT to Dig (6 minutes)

Deeper is not always better. Close by naming the limits. With a buyer who has almost no time, two sharp questions beat ten — earn the deeper call later. Early in a relationship, interrogation-style stacking of pain questions reads as aggressive and breaks trust. And in a transactional, low-price motion, heavy multi-layer discovery is wasted overhead. Teach reps to read the room: calibrate depth to deal size, buyer rapport, and time, not to a quota of questions.

---

### How to Run This Training

Block 60 minutes with the full sales team. Before the session, the manager pulls two real recorded discovery calls and clips one average two-to-three-minute segment. Bring a whiteboard and recording software. Leave the session with two artifacts: a shared question bank of the rebuilt discovery questions, and a commitment from every rep to use one new deeper question on their next live discovery call. In the following week's pipeline review, ask each rep which question they used and what pain it surfaced — that follow-up is what makes the clinic stick.`;

const TAGS = [
  'sales-training',
  'discovery-call-training',
  'discovery-questions',
  'sales-discovery',
  'pain-discovery',
  'call-review',
  'sales-coaching',
  'questioning-skills',
  'deal-qualification',
  'revops',
  '60-min-meeting',
  'standard-team',
  ID
];

(async () => {
  const idxBefore = await store.get('_index.json', { type: 'json' });
  const stIds = (idxBefore.entries || []).map(e => e.id).filter(id => /^st\d+$/.test(id))
    .map(id => parseInt(id.slice(2), 10)).sort((a, b) => a - b);
  console.log('Highest existing st id:', 'st' + String(stIds[stIds.length - 1]).padStart(4, '0'));
  if ((idxBefore.entries || []).some(e => e.id === ID)) {
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

  await store.setJSON('answers/' + ID + '.json', record);
  console.log('Wrote answers/' + ID + '.json');

  // re-read index immediately before write, prepend, save
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

  const check = await store.get('answers/' + ID + '.json', { type: 'json' });
  console.log('VERIFY answer record id:', check.id, 'qs:', check.quality_score);
})().catch(e => console.error('ERR', e.message));
