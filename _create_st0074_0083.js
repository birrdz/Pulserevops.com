// Create 10 sales trainings (st0074–st0083) and index via IndexNow.
const fs = require('fs');
const https = require('https');
const { getStore } = require('@netlify/blobs');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const HOST = 'pulserevops.com';
const SHARED_KEY = 'pulsemachine-writer-2026';
const INDEXNOW_KEY = '7f3e9a2c8b1d4e5f6a7b8c9d0e1f2a3b';

function loadToken() {
  const p = `${__dirname}/.env.local`;
  const line = fs.readFileSync(p, 'utf8').split(/\r?\n/).find((l) => l.startsWith('BLOBS_PAT='));
  if (!line) throw new Error('BLOBS_PAT missing');
  return line.slice('BLOBS_PAT='.length).trim();
}

function mermaid(nodes) {
  return '```mermaid\nflowchart TD\n' + nodes + '\n```';
}

function training(id, title, directAnswer, mermaidBody, sections, tags) {
  const question = `${title} — a 60-Minute Sales Training`;
  const body = sections.map((s) => `### ${s.h}\n\n${s.p}`).join('\n\n');
  const answer = `### Direct Answer

${directAnswer}

${mermaidBody}

---

${body}

---

### How to Run This Training

Block 60 minutes with the full team in one room. Assign pairs for role-play sections. Leave with one live artifact in your CRM or playbook doc before anyone leaves the room. Review adoption in the weekly forecast or pipeline meeting until the behavior sticks.`;
  return {
    id,
    question,
    answer,
    tags: ['sales-training', '60-min-meeting', 'revops', id, ...tags],
  };
}

const TRAININGS = [
  training(
    'st0074',
    'The Incumbent Displacement Map: Running a 60-Minute Team Working Session Where Every Rep Documents the Buyer\'s Current Vendor Pain Before Pitching a Switch',
    '**Deals die when reps pitch features before they map incumbent pain.** This session forces every rep to build a displacement map—current vendor, contract timing, switching costs, and the one pain the buyer will admit on record—before the next competitive call.',
    mermaid('  A[Pick one competitive deal] --> B[Map incumbent + contract end]\n  B --> C[List switching costs honestly]\n  C --> D[Capture buyer-stated pain quotes]\n  D --> E[Define displacement wedge]\n  E --> F[Align next call to wedge only]'),
    [
      {
        h: 'SECTION 1 — Name the Incumbent (10 minutes)',
        p: 'Each rep writes the incumbent vendor, renewal date, and who owns the relationship internally. No incumbent named means no competitive strategy—send the rep back to discovery.',
      },
      {
        h: 'SECTION 2 — Switching-Cost Honesty (12 minutes)',
        p: 'List data migration, retraining, political capital, and timeline risk. Reps who skip this step oversell and lose trust when procurement surfaces the real cost.',
      },
      {
        h: 'SECTION 3 — Pain in Buyer Words (15 minutes)',
        p: 'Capture three verbatim quotes from discovery or support tickets. The displacement pitch must repeat buyer language, not marketing copy.',
      },
      {
        h: 'SECTION 4 — Role-Play the Wedge (13 minutes)',
        p: 'Pairs practice opening the next call with the wedge only—one pain, one proof point, one ask. Cut any feature dump on the spot.',
      },
      {
        h: 'SECTION 5 — Counter-Case (10 minutes)',
        p: 'When displacement is irrational—long contract, zero pain, sponsor leaving—name it and park the deal. Not every competitive logo is winnable.',
      },
    ],
    ['competitive-displacement', 'incumbent-vendor', 'enterprise-sales']
  ),
  training(
    'st0075',
    'The Mutual Action Plan Co-Build: Running a 60-Minute Team Working Session Where Reps Draft Buyer-Aligned MAPs Before Legal or Procurement Stalls the Deal',
    '**A MAP nobody co-authored with the buyer is a wish list.** This training installs a shared MAP template—dates, owners, and exit criteria on both sides—so late-stage deals have a visible path to signature.',
    mermaid('  A[Select late-stage deal] --> B[Draft buyer-side steps]\n  B --> C[Draft seller-side steps]\n  C --> D[Review with champion live]\n  D --> E[Publish MAP in CRM]\n  E --> F[Weekly MAP checkpoint]'),
    [
      {
        h: 'SECTION 1 — MAP Anatomy (10 minutes)',
        p: 'Walk through the five required rows: milestone, buyer owner, seller owner, target date, and proof of completion. Anything without a buyer owner is fiction.',
      },
      {
        h: 'SECTION 2 — Build From a Real Deal (20 minutes)',
        p: 'Each rep drafts a MAP for one live opportunity. Manager spot-checks that every date is defensible in the next forecast call.',
      },
      {
        h: 'SECTION 3 — Champion Review Script (12 minutes)',
        p: 'Practice asking the champion to edit the MAP on the call: "What did we get wrong?" Reps who cannot get edits are not multi-threaded.',
      },
      {
        h: 'SECTION 4 — CRM Discipline (10 minutes)',
        p: 'Store the MAP where managers inspect pipeline—opportunity notes, mutual plan object, or attached doc linked from CRM.',
      },
      {
        h: 'SECTION 5 — When to Skip a MAP (8 minutes)',
        p: 'Sub-$15K velocity deals and repeat buyers may need a one-page email, not a MAP. Match ceremony to ACV.',
      },
    ],
    ['mutual-action-plan', 'late-stage-sales', 'forecast-discipline']
  ),
  training(
    'st0076',
    'The Discovery Debrief Ritual: Running a 60-Minute Team Working Session Where Managers and Reps Grade One Real Call and Fix the Next One Live',
    '**Discovery quality compounds—or decays—one call at a time.** This session replaces vague coaching with a repeatable debrief scorecard: pain clarity, next step, and economic buyer access.',
    mermaid('  A[Listen to 8-min clip] --> B[Score pain clarity 1-5]\n  B --> C[Score next-step quality]\n  C --> D[Score multithreading]\n  D --> E[Assign one fix]\n  E --> F[Re-record opener]'),
    [
      {
        h: 'SECTION 1 — Scorecard (10 minutes)',
        p: 'Introduce three scores only. More than three dilutes focus. Define what a "5" sounds like with a recorded exemplar clip.',
      },
      {
        h: 'SECTION 2 — Live Grading (25 minutes)',
        p: 'Play one anonymized discovery clip. Each rep scores privately, then discusses gaps. Manager assigns exactly one behavior to fix per rep.',
      },
      {
        h: 'SECTION 3 — Fix in Room (15 minutes)',
        p: 'Reps rewrite their opening two minutes and read aloud. Peers flag feature-dumping and yes/no questions.',
      },
      {
        h: 'SECTION 4 — Manager Commitment (10 minutes)',
        p: 'Managers schedule the next debrief before the following forecast. No debrief within 14 days means the ritual died.',
      },
    ],
    ['discovery-coaching', 'call-review', 'sales-manager-training']
  ),
  training(
    'st0077',
    'The Renewal Rescue Standup: Running a 60-Minute Team Working Session Where AEs and CSMs Align on At-Risk Accounts Before the Quarter Ends',
    '**Renewals fail in the handoff between AE optimism and CSM telemetry.** This session aligns both roles on one at-risk list, one save play, and one executive touch per account.',
    mermaid('  A[Pull health + usage signals] --> B[Flag accounts <90 health]\n  B --> C[Assign AE + CSM owner]\n  C --> D[Pick one save play each]\n  D --> E[Book exec touch]\n  E --> F[Log in CRM weekly]'),
    [
      {
        h: 'SECTION 1 — Define At-Risk (10 minutes)',
        p: 'Agree on three triggers: usage drop, champion gone, or support escalations. Subjective "feels shaky" does not count.',
      },
      {
        h: 'SECTION 2 — Account Triage (20 minutes)',
        p: 'Review every account under the bar. Each pair gets five minutes: signal, root cause, save play, date.',
      },
      {
        h: 'SECTION 3 — Save Play Library (15 minutes)',
        p: 'Document five plays that worked last quarter—executive bridge, success plan reset, commercial concession, roadmap preview, reference call.',
      },
      {
        h: 'SECTION 4 — Weekly Cadence (15 minutes)',
        p: 'Add a 15-minute renewal standup to the calendar through quarter-end. Track save-rate, not activity.',
      },
    ],
    ['renewal-risk', 'customer-success', 'account-management']
  ),
  training(
    'st0078',
    'The Three-Touch Outbound Sprint: Running a 60-Minute Team Working Session Where SDRs Build Signal-Based Sequences Instead of Generic Blasts',
    '**Outbound fails when touch one, two, and three say the same thing louder.** This sprint builds three distinct touches tied to one signal—funding, hiring, tech install, or intent—and measures reply rate per play.',
    mermaid('  A[Pick one ICP segment] --> B[Choose one signal]\n  B --> C[Write touch 1 insight]\n  C --> D[Write touch 2 proof]\n  D --> E[Write touch 3 ask]\n  E --> F[Launch 50-account test]'),
    [
      {
        h: 'SECTION 1 — Signal Picker (12 minutes)',
        p: 'Each SDR selects one signal they can operationalize this week. No signal, no sequence—do not launch "check-in" emails.',
      },
      {
        h: 'SECTION 2 — Touch Differentiation (20 minutes)',
        p: 'Touch 1 teaches, touch 2 proves with a customer story, touch 3 makes a small ask. Peers reject duplicates.',
      },
      {
        h: 'SECTION 3 — Launch Cohort (15 minutes)',
        p: 'Enroll 50 accounts in Apollo or your sequencer. Tag the play name in CRM for attribution.',
      },
      {
        h: 'SECTION 4 — Review in 7 Days (13 minutes)',
        p: 'Set the calendar invite now. Compare reply and meeting rates to the team median. Kill losing plays fast.',
      },
    ],
    ['outbound-sdr', 'apollo-sequences', 'prospecting']
  ),
  training(
    'st0079',
    'The Executive Access Workshop: Running a 60-Minute Team Working Session Where Reps Earn C-Level Meetings With Business Outcomes Not Product Tours',
    '**Executives take meetings about risk and numbers, not features.** Reps practice a 90-second executive narrative—business outcome, peer proof, one ask—and map which deals actually need C-level access.',
    mermaid('  A[Select enterprise deal] --> B[Draft outcome headline]\n  B --> C[Add peer proof point]\n  C --> D[Define single exec ask]\n  D --> E[Route via champion]\n  E --> F[Log exec meeting in CRM]'),
    [
      {
        h: 'SECTION 1 — Outcome Headline (15 minutes)',
        p: 'Strip product language. Each rep writes: "We help [peer type] achieve [metric] in [timeframe]." Manager rejects vague adjectives.',
      },
      {
        h: 'SECTION 2 — Champion Routing (15 minutes)',
        p: 'Practice asking the champion to sponsor the exec meeting with a forwardable blurb. No champion path means the deal is not ready.',
      },
      {
        h: 'SECTION 3 — Exec Meeting Agenda (15 minutes)',
        p: 'Draft a 25-minute agenda: context, peer story, one decision needed. Executives leave if there is no decision.',
      },
      {
        h: 'SECTION 4 — Anti-Patterns (15 minutes)',
        p: 'List what kills exec access—demo requests, feature roadmaps, unpaid consulting. Post the list in Slack.',
      },
    ],
    ['executive-selling', 'enterprise-sales', 'c-level-access']
  ),
  training(
    'st0080',
    'The Contract Pre-Flight: Running a 60-Minute Team Working Session Where Reps Surface Legal and Security Landmines Before Procurement Goes Dark',
    '**Deals slip when legal surprises appear after verbal yes.** Reps build a pre-flight checklist—MSA status, security review, data residency, payment terms—and run it before forecast commit.',
    mermaid('  A[Verbal yes on deal] --> B[Run pre-flight checklist]\n  B --> C{Blockers found?}\n  C -->|Yes| D[Engage legal early]\n  C -->|No| E[Confirm close timeline]\n  D --> F[Update forecast category]'),
    [
      {
        h: 'SECTION 1 — Checklist Build (15 minutes)',
        p: 'Co-create ten yes/no items with legal and RevOps. Include security questionnaire, insurance, and signature authority.',
      },
      {
        h: 'SECTION 2 — Apply to Live Deals (25 minutes)',
        p: 'Each rep runs the checklist on their top three commits. Any "unknown" downgrades forecast stage.',
      },
      {
        h: 'SECTION 3 — Early Legal Intro (12 minutes)',
        p: 'Role-play inviting legal to a 20-minute buyer call before redlines fly. Reps who hide from legal get surprised.',
      },
      {
        h: 'SECTION 4 — Forecast Hygiene (8 minutes)',
        p: 'Managers adopt a rule: no Commit without completed pre-flight. RevOps audits monthly.',
      },
    ],
    ['legal-redlines', 'procurement', 'deal-desk']
  ),
  training(
    'st0081',
    'The Win-Loss Sprint: Running a 60-Minute Team Working Session Where Reps Turn Three Lost Deals Into Playbook Updates the Whole Team Uses',
    '**Teams repeat losses when nobody writes them down.** Each rep interviews one lost deal, tags the loss reason in CRM, and contributes one playbook change the team adopts Monday.',
    mermaid('  A[Pick closed-lost deal] --> B[Interview buyer or champion]\n  B --> C[Tag primary loss reason]\n  C --> D[Draft playbook fix]\n  D --> E[Present to team]\n  E --> F[Ship update in enablement]'),
    [
      {
        h: 'SECTION 1 — Loss Reason Taxonomy (10 minutes)',
        p: 'Lock five allowed reasons—price, timing, incumbent, no decision, fit. "Other" capped at 10% of losses.',
      },
      {
        h: 'SECTION 2 — Interview Script (15 minutes)',
        p: 'Practice a 15-minute neutral interview. No selling on the call. Thank the buyer for honesty.',
      },
      {
        h: 'SECTION 3 — Playbook Extraction (25 minutes)',
        p: 'Each rep presents one lost deal and one fix—new talk track, competitor card, or discovery question.',
      },
      {
        h: 'SECTION 4 — Publish (10 minutes)',
        p: 'Enablement owner posts updates to the shared doc before end of week. Unpublished fixes do not count.',
      },
    ],
    ['win-loss-analysis', 'sales-enablement', 'closed-lost']
  ),
  training(
    'st0082',
    'The Territory Signal Stack: Running a 60-Minute Team Working Session Where Reps Rank Accounts by Intent Signals Instead of Alphabetical CRM Sorts',
    '**Reps waste quarters on accounts that look big but will never buy.** This session builds a signal stack—firmographic fit, intent, engagement, and timing—and forces a ranked call list for the next two weeks.',
    mermaid('  A[Export territory accounts] --> B[Score fit 1-3]\n  B --> C[Add intent + engagement]\n  C --> D[Compute stack rank]\n  D --> E[Top 20 = weekly focus]\n  E --> F[Log touches in CRM]'),
    [
      {
        h: 'SECTION 1 — Scoring Model (15 minutes)',
        p: 'Define three tiers with numeric weights. RevOps provides the fields; reps do not invent spreadsheets.',
      },
      {
        h: 'SECTION 2 — Rank Live (25 minutes)',
        p: 'Each rep ranks their top 30 accounts. Manager challenges any top-10 account with zero recent engagement.',
      },
      {
        h: 'SECTION 3 — Two-Week Plan (12 minutes)',
        p: 'Assign channels per tier: exec touch for tier 1, sequence for tier 2, nurture for tier 3.',
      },
      {
        h: 'SECTION 4 — Review Metrics (8 minutes)',
        p: 'Track meetings booked from tier 1 only. If tier 1 underperforms, fix the signal model—not the rep.',
      },
    ],
    ['territory-planning', 'account-prioritization', 'intent-data']
  ),
  training(
    'st0083',
    'The Split Documentation Standup: Running a 60-Minute Team Working Session Where Reps Lock Credit Splits Before Quarter Close Prevents Commission Fights',
    '**Commission disputes are forecast noise turned toxic.** Reps document splits, overlays, and partner involvement in CRM while the deal is live—not after the check prints.',
    mermaid('  A[Open commit deal] --> B[Document all roles]\n  B --> C[Confirm split % in CRM]\n  C --> D[Manager sign-off]\n  D --> E[Close won]\n  E --> F[Audit vs comp plan]'),
    [
      {
        h: 'SECTION 1 — Split Fields (12 minutes)',
        p: 'RevOps shows where splits live in CRM. Every overlay AE, SE, and partner gets a named row.',
      },
      {
        h: 'SECTION 2 — Live Audit (25 minutes)',
        p: 'Review every deal in Commit. Any missing split is downgraded until documented.',
      },
      {
        h: 'SECTION 3 — Partner Deals (13 minutes)',
        p: 'Channel and marketplace deals get a separate checklist—who sourced, who closed, who gets renewal.',
      },
      {
        h: 'SECTION 4 — Escalation Path (10 minutes)',
        p: 'Define the 48-hour dispute window and required evidence. Post in #sales-ops.',
      },
    ],
    ['sales-compensation', 'deal-splits', 'revops-ops']
  ),
];

function postJSON(url, body) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const data = JSON.stringify(body);
    const req = https.request(
      {
        hostname: u.hostname,
        path: u.pathname,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
        timeout: 15000,
      },
      (res) => {
        let buf = '';
        res.on('data', (c) => (buf += c));
        res.on('end', () => resolve({ status: res.statusCode, body: buf }));
      }
    );
    req.on('error', (e) => resolve({ status: 0, body: e.message }));
    req.write(data);
    req.end();
  });
}

function getPage(url) {
  return new Promise((resolve) => {
    https
      .get(url, (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve({ status: res.statusCode, body }));
      })
      .on('error', (e) => resolve({ status: 0, body: e.message }));
  });
}

function checkSeo(html, id) {
  const url = `https://${HOST}/sales-trainings/${id}`;
  const ok =
    html &&
    html.length > 5000 &&
    /<title[^>]*>/i.test(html) &&
    /meta\s+name="description"/i.test(html) &&
    html.includes(`rel="canonical" href="${url}"`) &&
    /application\/ld\+json/i.test(html);
  return { ok, url };
}

async function indexOne(id) {
  return postJSON(`https://${HOST}/.netlify/functions/pulse-indexnow-target`, {
    key: SHARED_KEY,
    id,
  });
}

async function indexBatch(urls) {
  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };
  const eps = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
    'https://yandex.com/indexnow',
    'https://searchadvisor.naver.com/indexnow',
    'https://search.seznam.cz/indexnow',
  ];
  const out = {};
  for (const ep of eps) {
    const r = await postJSON(ep, payload);
    out[new URL(ep).hostname] = r.status;
    await new Promise((x) => setTimeout(x, 400));
  }
  return out;
}

async function main() {
  const token = loadToken();
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const existing = new Set((idx.entries || []).map((e) => e.id));

  const report = { created: [], seo: [], index: [], errors: [] };

  for (const t of TRAININGS) {
    if (existing.has(t.id)) {
      report.errors.push(`${t.id} already exists`);
      continue;
    }
    if (t.answer.length < 800) {
      report.errors.push(`${t.id} answer too short`);
      continue;
    }
    const ts = Date.now();
    await store.setJSON(`answers/${t.id}.json`, {
      id: t.id,
      question: t.question,
      answer: t.answer,
      tags: t.tags,
      sources: ['Pulse RevOps sales training methodology'],
      ts,
      model: 'claude-opus-4-7-via-claude-code',
      quality_score: 5,
      polished_at: null,
      polish_history: [],
      source: 'batch-st0074-0083',
    });
    idx.entries.unshift({
      id: t.id,
      question: t.question,
      tags: t.tags,
      ts,
      quality_score: 5,
      polished_at: null,
      last_modified_ms: ts,
    });
    report.created.push({ id: t.id, url: `https://${HOST}/sales-trainings/${t.id}`, chars: t.answer.length });
    console.log('Created', t.id);
    await new Promise((r) => setTimeout(r, 300));
  }

  idx.entries.sort((a, b) => (b.ts || 0) - (a.ts || 0));
  await store.setJSON('_index.json', idx);

  // SEO verify
  for (const c of report.created) {
    const page = await getPage(c.url);
    const seo = checkSeo(page.body, c.id);
    report.seo.push({ id: c.id, status: page.status, ok: seo.ok && page.status === 200 });
    console.log('SEO', c.id, page.status, seo.ok ? 'OK' : 'FAIL');
  }

  // Sitemap check
  const sm = await getPage(`https://${HOST}/.netlify/functions/pulse-machine-sitemap`);
  for (const c of report.created) {
    c.inSitemap = sm.body.includes(`/sales-trainings/${c.id}</loc>`);
  }

  // IndexNow batch + per-id stamp
  const urls = report.created.map((c) => c.url);
  if (urls.length) {
    const batchResult = await indexBatch(urls);
    report.index.push({ batch: batchResult });
    const ts = Date.now();
    const idSet = new Set(report.created.map((c) => c.id));
    const idx2 = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
    idx2.entries = (idx2.entries || []).map((e) =>
      idSet.has(e.id) ? { ...e, was_indexed_at: ts } : e
    );
    await store.setJSON('_index.json', idx2);
    for (const c of report.created) {
      const r = await indexOne(c.id);
      let pings = {};
      try {
        pings = JSON.parse(r.body).pings || {};
      } catch (_) {}
      c.indexTarget = pings;
      await new Promise((x) => setTimeout(x, 1500));
    }
  }

  const logPath = `${__dirname}/_st0074_0083_report.json`;
  fs.writeFileSync(logPath, JSON.stringify(report, null, 2));
  console.log('\n=== REPORT ===');
  console.log('Created:', report.created.length);
  report.created.forEach((c) => {
    console.log(`  ${c.id}  SEO:${c.inSitemap && report.seo.find((s) => s.id === c.id)?.ok ? 'OK' : 'CHECK'}  ${c.url}`);
  });
  console.log('Wrote', logPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
