const fs = require('fs');
const p = 'C:/Users/koryj/website/_scrub_button_server.js';
let s = fs.readFileSync(p, 'utf8');
const oldLane = `      if (gate.pass) {
        writeArr(QUEUE, readArr(QUEUE).filter(x => x !== id));
        removeRejectFix(id);
        // 🔒 AUTO-PUBLISH LAW (owner 2026-07-04): auto-green ONLY when full rubric 13/13 +
        // two auditors (Claude Code CLI + DeepSeek skeptic) + Claude Code personal pass — ALL PASS.
        // Anything short (12/13, an auditor fails, or an auditor can't run) → owner review pile.
        const auto = await laneAutoPublishGate(id, title, body, gate);
        if (auto.publish) {
          await certify(id, gate.score, body);
          appendScrubLog({ ts: new Date().toISOString(), id, status: 'green', score: gate.score, msg: 'auto-publish — 13/13 + 2 auditors + CC personal' });
          autoJob.ready++;
          autoJob.lastFinish = { type: 'green', id, score: gate.score, at: Date.now() };
          autoLog('✅ ' + id + ' ' + gate.score + '/13 — AUTO-PUBLISHED (2 auditors + CC pass)');
          return { done: true, drop: true };
        }`;
const neuLane = `      if (gate.pass) {
        writeArr(QUEUE, readArr(QUEUE).filter(x => x !== id));
        removeRejectFix(id);
        // Owner 2026-07-04: full rubric pass → certify + index immediately (same as entryScrubPipeline).
        await certify(id, gate.score, body);
        bumpDay();
        await loadIndex();
        appendScrubLog({ ts: new Date().toISOString(), id, status: 'green', score: gate.score, msg: 'auto-index — rubric pass' });
        autoJob.certified++;
        autoJob.lastFinish = { type: 'green', id, score: gate.score, at: Date.now() };
        autoLog('✅ ' + id + ' ' + gate.score + '/13 — auto-indexed (rubric pass)');
        return { done: true, drop: true };
        /* legacy auditor gate — disabled for rubric-first auto-index
        const auto = await laneAutoPublishGate(id, title, body, gate);
        if (auto.publish) {
          await certify(id, gate.score, body);`;
if (!s.includes(oldLane)) { console.error('lane gate block not found'); process.exit(1);} 
// simpler: replace whole case 'gate' section - the old block continues with requeue logic. Need careful patch.

