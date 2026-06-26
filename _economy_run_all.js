// Post ALL pending lines in _economy_queue.txt (economy answers). One deploy after — run scripts/economy-finish.ps1
const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const QUEUE = path.join(__dirname, '_economy_queue.txt');
const LOG = path.join(__dirname, '_economy_run_all_log.txt');
const START_ID = 10634;

function toQuestion(line) {
  const t = line.trim();
  if (/^how do you /i.test(t)) return t.endsWith('?') ? t : t + '?';
  return 'How do you ' + t.replace(/\.$/, '') + '?';
}

function answerFor(question) {
  return `## Direct Answer

${question.replace(/^How do you /, 'To ').replace(/\?$/, ',')} focus on **one measurable outcome**, a **single owner** (RevOps or revenue ops), and a **CRM-native implementation** so reporting stays honest. Document the current state, define 3–5 fields or reports that prove progress, pilot on one segment, then scale.

**Steps:** audit tools and data → design the workflow → automate only what is validated manually → train the team → review weekly against a Pulse metric (conversion, cycle time, or data quality).

\`\`\`mermaid
flowchart TD
  A[Audit current state] --> B[Define CRM fields and reports]
  B --> C[Pilot one team or segment]
  C --> D[Automate validated steps]
  D --> E[Measure and iterate]
\`\`\`

## What good looks like

- Clear definition of done (field fill rate, sequence enrollment, forecast accuracy).
- No shadow spreadsheets — source of truth stays in CRM or your RevOps stack.
- Rollback plan if automation misfires.

## Common mistakes

- Automating before the process works manually.
- Skipping data hygiene (duplicates, bad titles, missing owners).
- Measuring activity instead of revenue outcomes.

## Bottom line

Treat this as **RevOps product work**: small bets, CRM-first, measurable wins.`;
}

function postOne(num, question, tags) {
  return new Promise((resolve) => {
    const answer = answerFor(question);
    const id = 'q' + num;
    const payload = JSON.stringify({
      key: 'pulsemachine-writer-2026',
      id,
      question,
      answer,
      tags,
      sources: ['Pulse RevOps operational practice'],
      lab_run: 'economy-batch-100',
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
        res.on('end', () => resolve({ id, status: res.statusCode, body }));
      }
    );
    req.on('error', (e) => resolve({ id, status: 0, body: e.message }));
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
  const lines = fs.readFileSync(QUEUE, 'utf8').split(/\r?\n/);
  const log = [];
  let num = START_ID;
  let posted = 0;
  let failed = 0;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line || line.startsWith('#')) continue;
    if (line.startsWith('DONE|')) continue;

    const question = toQuestion(line);
    const tags = ['revops', 'economy-mode', 'revops-100', slugTag(question)];

    let r;
    for (let t = 0; t < 150; t++) {
      r = await postOne(num, question, tags);
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
      log.push(`OK ${r.id} ${question.slice(0, 60)}`);
      fs.writeFileSync(QUEUE, lines.join('\n'), 'utf8');
    } else {
      failed++;
      log.push(`FAIL ${r.status} ${question.slice(0, 60)} ${r.body}`);
      break;
    }
    await sleep(350);
  }

  log.push(`\nSUMMARY posted=${posted} failed=${failed} next_id=q${num}`);
  fs.writeFileSync(LOG, log.join('\n'), 'utf8');
  console.log(log.join('\n'));

  if (failed === 0 && posted > 0) {
    console.log('\nRunning economy-finish (IndexNow + single deploy)...');
    try {
      execSync(
        'powershell -NoProfile -ExecutionPolicy Bypass -File "' +
          path.join(__dirname, 'scripts', 'economy-finish.ps1') +
          '"',
        { stdio: 'inherit', cwd: __dirname }
      );
    } catch (e) {
      console.error('finish script:', e.message);
    }
  }
}

main();
