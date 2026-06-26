// Post one queue file of up to 500 economy RevOps Q&As. Usage: node _revops500_run_all.js [batchNumber]
const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const batch = parseInt(process.argv[2] || '1', 10);
const QUEUE = path.join(__dirname, `_revops500_queue_b${batch}.txt`);
const LOG = path.join(__dirname, `_revops500_run_b${batch}_log.txt`);
const STATE = path.join(__dirname, '_revops500_state.json');
const START_ID = 9883; // after revops-100 batch (~q9882 live)

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE, 'utf8'));
  } catch {
    return { lastId: START_ID, batchesCompleted: 0 };
  }
}
function saveState(s) {
  fs.writeFileSync(STATE, JSON.stringify(s, null, 2), 'utf8');
}

function toQuestion(line) {
  const t = line.trim();
  if (/^(how|what|why) /i.test(t)) return t.endsWith('?') ? t : t + '?';
  return 'How do you ' + t.replace(/\.$/, '') + '?';
}

function answerFor(question) {
  const hook =
    question.startsWith('Why') || question.startsWith('What')
      ? question.replace(/\?$/, ' is a gap most SaaS vendors gloss over — here is the operator-level answer.')
      : question.replace(/^How do you /, 'To ').replace(/\?$/, ',') +
        ' most teams only get a generic blog post — this is the CRM-native operator playbook.';

  return `## Direct Answer

${hook}

Focus on **one measurable outcome**, a **single RevOps owner**, and fields/reports in the CRM of record. Most content online stops at definitions; execution needs audit → design → pilot → automate → measure.

\`\`\`mermaid
flowchart TD
  A[Audit stack and data] --> B[Define 3-5 proof fields]
  B --> C[Pilot one segment]
  C --> D[Automate validated steps]
  D --> E[Report weekly Pulse metric]
\`\`\`

## Why this is under-answered online

Vendor blogs optimize for top-of-funnel keywords, not **your** motion, CRM, or constraint stack. Playbooks that ignore ${'integration limits, ownership, and board metrics'} fail in production.

## What good looks like

- Definition of done tied to revenue or data quality, not activity counts.
- Documented rollback and a named DRI.
- No shadow spreadsheets for metrics leadership reviews.

## Bottom line

Treat as RevOps product work: prove value on one slice, then scale. Polish can deepen this entry later.`;
}

function postOne(num, question, tags, labRun) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      key: 'pulsemachine-writer-2026',
      id: 'q' + num,
      question,
      answer: answerFor(question),
      tags,
      sources: ['Pulse RevOps — long-tail RevOps gaps'],
      lab_run: labRun,
    });
    const req = https.request(
      {
        hostname: 'pulserevops.com',
        path: '/.netlify/functions/pulse-blob-writer',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
      },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve({ id: 'q' + num, status: res.statusCode, body }));
      }
    );
    req.on('error', (e) => resolve({ id: 'q' + num, status: 0, body: e.message }));
    req.write(payload);
    req.end();
  });
}

function slugTag(q) {
  return q.replace(/[^a-z0-9]+/gi, '-').slice(0, 36).toLowerCase();
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  if (!fs.existsSync(QUEUE)) {
    execSync(`node "${path.join(__dirname, '_generate_revops500_queue.js')}" ${batch}`, {
      stdio: 'inherit',
    });
  }

  const state = loadState();
  let num = state.lastId || START_ID;
  const lines = fs.readFileSync(QUEUE, 'utf8').split(/\r?\n/);
  const log = [];
  let posted = 0;
  let failed = 0;
  const labRun = `revops-500-b${batch}`;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line || line.startsWith('#')) continue;
    if (line.startsWith('DONE|')) continue;

    const question = toQuestion(line);
    const tags = ['revops', 'revops-500', 'revops-gap', slugTag(question)];

    let r;
    for (let t = 0; t < 200; t++) {
      r = await postOne(num, question, tags, labRun);
      if (r.status === 200 || r.status === 201) {
        num++;
        break;
      }
      if (r.status === 409) {
        num++;
        continue;
      }
      break;
    }

    if (r.status === 200 || r.status === 201) {
      lines[i] = 'DONE|' + question;
      posted++;
      log.push(`OK ${r.id} ${question.slice(0, 70)}`);
      if (posted % 25 === 0) fs.writeFileSync(QUEUE, lines.join('\n'), 'utf8');
    } else {
      failed++;
      log.push(`FAIL ${r.status} ${r.body}`);
      break;
    }
    await sleep(300);
  }

  fs.writeFileSync(QUEUE, lines.join('\n'), 'utf8');
  state.lastId = num;
  if (failed === 0) state.batchesCompleted = (state.batchesCompleted || 0) + 1;
  state.lastBatchAt = new Date().toISOString();
  saveState(state);

  log.push(`\nSUMMARY batch=${batch} posted=${posted} failed=${failed} next=q${num}`);
  fs.writeFileSync(LOG, log.join('\n'), 'utf8');
  console.log(log.join('\n'));

  if (failed === 0 && posted > 0 && batch === 1) {
    try {
      execSync(
        'powershell -NoProfile -ExecutionPolicy Bypass -File "' +
          path.join(__dirname, 'scripts', 'economy-finish.ps1') +
          '"',
        { stdio: 'inherit' }
      );
    } catch (e) {
      console.error('finish:', e.message);
    }
  }
}

main();
