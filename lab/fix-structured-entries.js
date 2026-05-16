// Some workers wrote structured JSON ({directAnswer, whatsActuallyBroken, ...})
// instead of the canonical {id, question, answer, tags, sources, ts, model, lab_run}.
// This rebuilds the markdown body from the structured fields and writes back the
// canonical shape so the library renderer + audit-visuals work.
const fs = require('fs');
const path = require('path');

const targets = ['q1190', 'q1195', 'q1199', 'q1202', 'q1203'];

for (const id of targets) {
  const fp = path.join(__dirname, 'cheap-100', id + '.json');
  let j;
  try {
    j = JSON.parse(fs.readFileSync(fp, 'utf8'));
  } catch (e) {
    console.log(id, '| could not parse:', e.message);
    continue;
  }

  // Skip if already has populated answer with mermaid
  if (j.answer && j.answer.length > 1000 && /```mermaid/.test(j.answer)) {
    console.log(id, '| already canonical, skipping');
    continue;
  }

  // Reconstruct markdown body from structured fields
  let body = '';

  if (j.directAnswer) {
    body += '## Direct Answer\n\n' + j.directAnswer + '\n\n';
  }

  if (j.whatsActuallyBroken) {
    body += "## What's Actually Broken\n\n";
    if (Array.isArray(j.whatsActuallyBroken)) {
      body += j.whatsActuallyBroken.map(b => '- ' + b).join('\n') + '\n\n';
    } else {
      body += j.whatsActuallyBroken + '\n\n';
    }
  }

  if (j.the2026FixPlaybook) {
    body += '## The 2026 Fix Playbook\n\n';
    if (Array.isArray(j.the2026FixPlaybook)) {
      j.the2026FixPlaybook.forEach((m, i) => {
        if (typeof m === 'string') {
          body += (i + 1) + '. ' + m + '\n\n';
        } else if (m && m.title) {
          body += (i + 1) + '. **' + m.title + '** — ' + (m.detail || m.description || m.summary || '') + '\n\n';
        } else if (m && typeof m === 'object') {
          const k = Object.keys(m)[0];
          body += (i + 1) + '. **' + k + '** — ' + m[k] + '\n\n';
        }
      });
    } else {
      body += j.the2026FixPlaybook + '\n\n';
    }
  }

  if (j.theFixPlaybookTable) {
    if (typeof j.theFixPlaybookTable === 'string') {
      body += j.theFixPlaybookTable + '\n\n';
    } else if (Array.isArray(j.theFixPlaybookTable) && j.theFixPlaybookTable.length) {
      const cols = Object.keys(j.theFixPlaybookTable[0]);
      body += '| ' + cols.join(' | ') + ' |\n';
      body += '|' + cols.map(() => '---').join('|') + '|\n';
      j.theFixPlaybookTable.forEach(row => {
        body += '| ' + cols.map(c => String(row[c] || '')).join(' | ') + ' |\n';
      });
      body += '\n';
    }
  }

  if (j.mermaidDiagram) {
    let mer = j.mermaidDiagram;
    if (typeof mer === 'object') {
      mer = mer.code || mer.diagram || mer.source || JSON.stringify(mer);
    }
    body += '```mermaid\n' + mer + '\n```\n\n';
  } else {
    // No mermaid in structured form — synthesize a basic graph LR from the playbook
    let synth = 'graph LR\n  A["Diagnosis"] --> B["5 fix moves"]';
    if (Array.isArray(j.the2026FixPlaybook)) {
      synth = 'graph LR\n  A["Current State"]';
      j.the2026FixPlaybook.slice(0, 5).forEach((m, i) => {
        const label = (typeof m === 'string' ? m : (m.title || Object.keys(m)[0] || ('Move ' + (i + 1)))).slice(0, 40);
        synth += '\n  A --> M' + i + '["' + label.replace(/"/g, "'") + '"]';
        synth += '\n  M' + i + ' --> Z["2026 Target"]';
      });
    }
    body += '```mermaid\n' + synth + '\n```\n\n';
  }

  if (j.howIdPartnerWithTheChroWeek1) {
    body += "## How I'd Partner With The CHRO Week 1\n\n";
    if (Array.isArray(j.howIdPartnerWithTheChroWeek1)) {
      body += j.howIdPartnerWithTheChroWeek1.map(b => {
        if (typeof b === 'string') return '- ' + b;
        if (b && b.day) return '- **' + b.day + ':** ' + (b.action || b.detail || '');
        return '- ' + JSON.stringify(b);
      }).join('\n') + '\n\n';
    } else {
      body += j.howIdPartnerWithTheChroWeek1 + '\n\n';
    }
  }

  if (j.bottomLine) {
    body += '**Bottom line**: ' + j.bottomLine + '\n\n';
  }

  // TAGS line — coerce to array
  let tags = j.tags || [];
  if (!Array.isArray(tags)) {
    if (typeof tags === 'string') tags = tags.split(/[,\s]+/).filter(Boolean);
    else if (typeof tags === 'object') tags = Object.values(tags).flat().filter(t => typeof t === 'string');
    else tags = [];
  }
  body += 'TAGS: ' + tags.join(',');

  // Build clean canonical entry
  const clean = {
    id: j.id,
    question: j.question || ('How\'d you fix ' + (j.company || id) + '\'s revenue issues in 2026?'),
    answer: body,
    tags: tags,
    sources: j.sources || [],
    ts: (j.metadata && j.metadata.ts) || j.ts || Date.now(),
    model: 'claude-haiku-4-5',
    lab_run: 'drip-cro-pitch',
  };

  fs.writeFileSync(fp, JSON.stringify(clean));
  const hasMer = /```mermaid/.test(clean.answer);
  console.log(id, '| reformed | len:', clean.answer.length, '| mermaid:', hasMer);
}
