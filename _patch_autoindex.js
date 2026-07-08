const fs = require('fs');
const p = 'C:/Users/koryj/website/_scrub_button_server.js';
let s = fs.readFileSync(p, 'utf8');
const old = `    if (gate.pass) {
      pipelineStage(ui, 'certify', 1, 1, certifyOnPass ? 'Publishing…' : 'Passed — Cursor or Claude Code approval required');
      if (certifyOnPass) {
        await certify(id, gate.score, body);
        bumpDay();
        pipelineDone(ui, 'certify', 'Certified ' + gate.score + '/13');
        if (!generated && !out.steps.includes('deterministic — no audit needed')) out.steps.push('deterministic');
        return { status: 'certified', score: gate.score, body, passedGate: true };
      }
      pipelineDone(ui, 'certify', 'Awaiting Cursor or Claude Code approval');
      if (ui === 'gen') { genJob.stage = '✅ factor-1 pass → scrub queue'; saveGen(); }
      return { status: 'ready', score: gate.score, body, passedGate: true, rubric: gate.rubric };
    }`;
const neu = `    if (gate.pass) {
      // Owner 2026-07-04: full rubric pass (13/13 checklist) → auto-index immediately — no pending pile, no queue strip.
      pipelineStage(ui, 'certify', 1, 1, 'Publishing…');
      await certify(id, gate.score, body);
      bumpDay();
      pipelineDone(ui, 'certify', 'Certified ' + gate.score + '/13');
      if (!generated && !out.steps.includes('deterministic — no audit needed')) out.steps.push('deterministic');
      if (ui === 'gen') { genJob.stage = '✅ auto-indexed ' + gate.score + '/13'; saveGen(); }
      return { status: 'certified', score: gate.score, body, passedGate: true, rubric: gate.rubric };
    }`;
if (!s.includes(old)) { console.error('gate block not found'); process.exit(1); }
s = s.replace(old, neu);
fs.writeFileSync(p, s);
console.log('patched gate block');
