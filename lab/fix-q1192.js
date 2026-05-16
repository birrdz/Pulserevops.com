const fs = require('fs');
const j = JSON.parse(fs.readFileSync('lab/cheap-100/q1192.json', 'utf8'));
const a = j.answer || {};
const M_OPEN = '```mermaid';
const FENCE = '```';

let body = '';
if (a.direct_answer) body += a.direct_answer + '\n\n';

if (a.whats_actually_broken) {
  body += "## What's Actually Broken\n\n";
  if (Array.isArray(a.whats_actually_broken)) {
    body += a.whats_actually_broken.map(b => '- ' + (typeof b === 'string' ? b : JSON.stringify(b))).join('\n') + '\n\n';
  } else {
    body += a.whats_actually_broken + '\n\n';
  }
}

const pb = a.fix_playbook || a.the_2026_fix_playbook || a.playbook;
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

const mer = a.mermaid || a.mermaid_diagram;
if (mer) {
  const merStr = typeof mer === 'string' ? mer : (mer.code || mer.diagram || JSON.stringify(mer));
  body += M_OPEN + '\n' + merStr + '\n' + FENCE + '\n\n';
}

const chro = a.chro_week_1 || a.how_id_partner_with_the_chro_week_1 || a.partnership_week_1;
if (chro) {
  body += "## How I'd Partner With The CHRO Week 1\n\n";
  if (Array.isArray(chro)) {
    body += chro.map(b => '- ' + (typeof b === 'string' ? b : JSON.stringify(b))).join('\n') + '\n\n';
  } else {
    body += chro + '\n\n';
  }
}

if (a.bottom_line || a.bottomLine) {
  body += '**Bottom line**: ' + (a.bottom_line || a.bottomLine) + '\n\n';
}

const tags = (a.tags && Array.isArray(a.tags)) ? a.tags : ['travelers', 'revenue-fix', 'turnaround', 'cro-candidate-pitch', 'executive-outreach', 'insurance', 'p-and-c'];
body = body.replace(/\s+$/, '') + '\n\nTAGS: ' + tags.join(',');

const clean = {
  id: 'q1192',
  question: j.q || "How'd you fix Travelers' revenue issues in 2026?",
  answer: body,
  tags: tags,
  sources: a.sources || j.source || [],
  ts: j.ts || Date.now(),
  model: 'claude-haiku-4-5',
  lab_run: 'drip-cro-pitch',
};
fs.writeFileSync('lab/cheap-100/q1192.json', JSON.stringify(clean));
console.log('q1192 normalized · len:', clean.answer.length, '· mermaid:', body.indexOf(M_OPEN) !== -1);
