// Build st0073-style 60-min facilitator guide from a RevOps topic line (no LLM).

const { hourTraining } = require('./economy-st-hour-template');

function sessionH1(topic) {
  let t = String(topic || '').trim().replace(/\?+$/, '');
  t = t
    .replace(/^how do you /i, '')
    .replace(/^what is (the )?/i, '')
    .replace(/^why does /i, '')
    .replace(/^how to /i, '');
  const words = t.split(/\s+/).filter(Boolean).slice(0, 9);
  const h1 = words
    .map((w) => (w.length <= 3 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join(' ');
  return h1.length > 72 ? h1.slice(0, 69) + '…' : h1 || 'RevOps Team Working Session';
}

function blockBody(topic, title, focus) {
  return (
    `**Focus:** ${focus} on **${topic}**.\n\n` +
    `**Manager says:** "We are not debating slides today—we are building one artifact per rep that survives CRM inspection next week."\n\n` +
    `**Facilitator script:** Open ${title.toLowerCase()} with one real deal where the team skipped this discipline. Ask the rep to name the account, stage, and which CRM field was empty. **CRM action (required):** Each rep opens one live opportunity and creates a note titled "${sessionH1(topic)} — [date]". Paste the worksheet row before the timer ends.\n\n` +
    `**Circulate:** Challenge generic language. Ban marketing adjectives—only buyer words, field names, and dates. If a rep cannot cite a call for a claim, mark the row **discovery gap**.\n\n` +
    `**Timer discipline:** Keep the countdown visible. At halfway, pause only for CRM confirmation—not open debate. **If someone finishes early:** peer-review a partner's CRM note or listen to the pair role-play—no email or Slack.\n\n` +
    `**Close this block:** One volunteer shares account + one sentence outcome only—no feature pitch.`
  );
}

function isNilTopic(topic) {
  return /\bnil\b|college football|transfer portal|nil collective|d1 football/i.test(
    String(topic || '')
  );
}

function buildSpecFromTopic(topic) {
  const nil = isNilTopic(topic);
  const h1 = sessionH1(topic);
  const subtitle = nil
    ? `A 60-Minute Athletics Staff Working Session — ${topic.replace(/\?+$/, '')}`
    : `A 60-Minute Team Working Session on ${topic.replace(/\?+$/, '')}`;
  const question = `${h1} — 60-Min Training`;
  const slug = h1.replace(/[^a-z0-9]+/gi, '-').slice(0, 28).toLowerCase();

  const tags = nil
    ? [
        'sales-training',
        '60-min-meeting',
        'nil',
        'nil-gtm',
        'college-football',
        'year-2027',
        'economy-mode',
        slug,
      ]
    : [
        'sales-training',
        '60-min-meeting',
        'revops',
        'economy-mode',
        'revops-google',
        slug,
      ];

  return {
    h1,
    subtitle,
    question,
    tags,
    why: nil
      ? `Collectives and athletics staff lose **${topic}** when offers and donor promises live in group texts instead of a shared pipeline the AD and collective GM can inspect before the portal opens. ` +
        `This session forces each lead to apply the 2027 NIL GTM playbook on one real athlete or donor target—offer tier, disclosure status, and next touch dated—before the next recruiting weekend.\n\n` +
        `Without a working artifact, portal weeks become panic spending. Donors hear conflicting stories; compliance gaps surface after announcements.\n\n` +
        `**Room rule:** No logged offer sheet or donor stage tonight means no new public NIL commitment until the collective president signs off.`
      : `Reps lose deals on **${topic}** when process lives in Slack threads instead of CRM fields managers can inspect in forecast. ` +
        `This session forces every rep to apply the playbook on one live opportunity—evidence logged, next step dated, gaps named—before the next customer call.\n\n` +
        `Without a working artifact, pipeline reviews become storytelling. Finance, RevOps, and leadership cannot see risk until late quarter. ` +
        `Buyers feel the disorganization when internal handoffs are unclear.\n\n` +
        `**Room rule:** No artifact in CRM tonight means no Commit upgrade on this motion until the manager signs off.`,
    walkout: [
      `A completed worksheet row on one real opportunity tied to ${topic}`,
      'Three buyer-verbatim quotes or data points with source call dates',
      'A documented risk list with owner and due date per item',
      'A ninety-second talk track for the next customer touch',
      'A go/no-go on forecast category based on evidence—not hope',
    ],
    who:
      'Full sales team plus the manager facilitating. Include RevOps or sales ops if they own the fields you will inspect. ' +
      'Every rep needs one live deal where this motion matters—no greenfield hypotheticals.',
    prep: [
      `Pick one opportunity where ${topic} is the blocker or unlock.`,
      'Open CRM notes, last discovery recording, and any support or success tickets the buyer mentioned.',
      'Print or share the worksheet table below—one copy per rep.',
      'Confirm required CRM fields exist—or use a structured note template for this week only.',
    ],
    mermaid:
      '  A[Pick one live deal] --> B[Map current state in CRM]\n' +
      '  B --> C[List risks + switching costs]\n' +
      '  C --> D[Capture buyer evidence]\n' +
      '  D --> E[Define next-step talk track]\n' +
      '  E --> F[Log artifact + task dates]\n' +
      '  F --> G[Manager forecast sign-off]',
    blocks: [
      {
        title: 'Frame — Why CRM Evidence Beats Stories',
        tStart: '0:00',
        tEnd: '0:08',
        min: 8,
        body: blockBody(
          topic,
          'Frame',
          'Connect forecast credibility to inspectable fields'
        ),
      },
      {
        title: 'Teach the Playbook Layers',
        tStart: '0:08',
        tEnd: '0:20',
        min: 12,
        body: blockBody(
          topic,
          'Teach',
          'Walk four layers: facts in CRM, buyer proof, internal risks, next external motion'
        ),
      },
      {
        title: 'Solo Build on a Real Deal',
        tStart: '0:20',
        tEnd: '0:35',
        min: 15,
        body: blockBody(
          topic,
          'Solo build',
          'Silent worksheet completion'
        ),
      },
      {
        title: 'Pair Role-Play — Manager vs. Rep',
        tStart: '0:35',
        tEnd: '0:48',
        min: 13,
        body: blockBody(
          topic,
          'Role-play',
          'Manager challenges vague claims; rep defends with CRM evidence only'
        ),
      },
      {
        title: 'Counter-Case and Rational No',
        tStart: '0:48',
        tEnd: '0:56',
        min: 8,
        body: blockBody(
          topic,
          'Counter-case',
          'When to park, nurture, or downgrade forecast'
        ),
      },
      {
        title: 'Commit — CRM and Forecast Hygiene',
        tStart: '0:56',
        tEnd: '1:00',
        min: 4,
        body:
          `Round-robin: account, one-sentence outcome, next call date, forecast go/no-go. **Manager says:** "If I open CRM tonight, I see the note on every deal you committed."\n\n` +
          `**Forecast tie-in:** Any Commit without tonight's artifact is discussed first in Monday pipeline—not honored as Commit.\n\n` +
          `**RevOps follow-up:** Export opps missing required fields; automation reminder in forty-eight hours if still empty.`,
      },
    ],
    worksheet:
      `| Element | Your deal (fill in) | Source (buyer / data / guess) |\n|---|---|---|\n| Motion: ${topic.slice(0, 60)} | ______ | ______ |\n| CRM opportunity link | ______ | ______ |\n| Buyer proof #1 (verbatim) | ______ | ______ |\n| Buyer proof #2 (verbatim) | ______ | ______ |\n| Internal risk + owner | ______ | ______ |\n| Next customer step + date | ______ | ______ |\n| Ninety-second talk track | ______ | ______ |\n| Rational to commit this quarter? (Y/N) | ______ | ______ |`,
    buyerUse: [
      'Open the next call by repeating one buyer proof quote and asking what changed since they said it.',
      'Name internal work honestly—migration, security, procurement—so you sound like an operator, not a marketer.',
      'Send a mutual action plan that mirrors the worksheet rows your buyer already agreed to.',
    ],
    coaching: [
      'Missing worksheet note on Commit = automatic downgrade until documented.',
      'Manager sign-off on any non-standard forecast exception.',
      'RevOps audits weekly—do not wait for commission or QBR drama.',
      'Celebrate one rational park decision—it protects the team number.',
      'No Slack arguments about credit—use the escalation path in CRM.',
    ],
    bottomLine:
      `**${h1}** only sticks when CRM carries the proof. Reps who log evidence on live deals protect forecast credibility; managers who inspect in the standup stop ${topic} from becoming a quarter-end surprise.`,
  };
}

function buildTrainingFromTopic(topic) {
  const spec = buildSpecFromTopic(topic);
  const answer = hourTraining(spec);
  const words = answer.split(/\s+/).filter(Boolean).length;
  return { spec, answer, words, question: spec.question, tags: spec.tags };
}

module.exports = { buildSpecFromTopic, buildTrainingFromTopic, sessionH1 };
