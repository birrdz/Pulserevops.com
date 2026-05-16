// Normalize entries where workers used wrong key names (q/a/cro_pitch/qid)
// instead of the canonical id/question/answer shape.
const fs = require('fs');
const path = require('path');

const targets = ['q1192', 'q1194', 'q1196', 'q1204', 'q1207'];
const MERMAID_OPEN = '```mermaid';
const FENCE = '```';

for (const id of targets) {
  const fp = path.join(__dirname, 'cheap-100', id + '.json');
  let j;
  try {
    j = JSON.parse(fs.readFileSync(fp, 'utf8'));
  } catch (e) {
    console.log(id, 'PARSE ERR:', e.message);
    continue;
  }

  const question = j.question || j.q || j.qa ||
    ('How\'d you fix ' + id + ' revenue issues in 2026?');
  let answer = j.answer || j.a || j.cro_pitch || j.body || j.markdown || j.content || '';

  if (!answer || answer.length < 500) {
    let body = '';
    if (j.directAnswer) body += '## Direct Answer\n\n' + j.directAnswer + '\n\n';
    if (j.whatsActuallyBroken) {
      body += '## What\'s Actually Broken\n\n';
      if (Array.isArray(j.whatsActuallyBroken)) {
        body += j.whatsActuallyBroken.map(b => '- ' + (typeof b === 'string' ? b : JSON.stringify(b))).join('\n') + '\n\n';
      } else {
        body += j.whatsActuallyBroken + '\n\n';
      }
    }
    const pb = j.fixPlaybook || j.the2026FixPlaybook || j.playbook;
    if (pb) {
      body += '## The 2026 Fix Playbook\n\n';
      if (Array.isArray(pb)) {
        pb.forEach((m, i) => {
          if (typeof m === 'string') body += (i + 1) + '. ' + m + '\n\n';
          else if (m && m.title) body += (i + 1) + '. **' + m.title + '** — ' + (m.detail || m.description || m.summary || '') + '\n\n';
          else body += (i + 1) + '. ' + JSON.stringify(m) + '\n\n';
        });
      } else {
        body += pb + '\n\n';
      }
    }
    const mer = j.mermaid || j.mermaidDiagram;
    if (mer) {
      const merStr = typeof mer === 'string' ? mer : (mer.code || mer.diagram || JSON.stringify(mer));
      body += MERMAID_OPEN + '\n' + merStr + '\n' + FENCE + '\n\n';
    }
    const chro = j.chroWeek1 || j.howIdPartnerWithTheChroWeek1;
    if (chro) {
      body += '## How I\'d Partner With The CHRO Week 1\n\n';
      if (Array.isArray(chro)) {
        body += chro.map(b => '- ' + (typeof b === 'string' ? b : JSON.stringify(b))).join('\n') + '\n\n';
      } else {
        body += chro + '\n\n';
      }
    }
    if (j.bottomLine || j.bottom_line) {
      body += '**Bottom line**: ' + (j.bottomLine || j.bottom_line) + '\n\n';
    }
    if (body.length > 200) answer = body;
  }

  let tags = j.tags || [];
  if (!Array.isArray(tags)) {
    tags = (typeof tags === 'string') ? tags.split(/[,\s]+/).filter(Boolean) : [];
  }

  if (typeof answer !== 'string') answer = String(answer || '');
  if (answer && !/^TAGS:/m.test(answer)) {
    answer = answer.replace(/\s+$/, '') + '\n\nTAGS: ' + tags.join(',');
  }

  if (!answer || answer.length < 500) {
    console.log(id, 'STILL EMPTY · keys:', Object.keys(j).join(','));
    continue;
  }

  const clean = {
    id: id,
    question: question,
    answer: answer,
    tags: tags,
    sources: j.sources || [],
    ts: j.ts || Date.now(),
    model: j.model || 'claude-haiku-4-5',
    lab_run: j.lab_run || 'drip-cro-pitch',
  };

  fs.writeFileSync(fp, JSON.stringify(clean));
  const hasMer = answer.indexOf(MERMAID_OPEN) !== -1;
  console.log(id, 'NORMALIZED · len:', clean.answer.length, '· mermaid:', hasMer);
}
