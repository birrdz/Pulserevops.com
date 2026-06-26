const fs = require('fs');
const answer = fs.readFileSync('_gold_v15_t218_answer.md','utf8');
const wc = answer.trim().split(/\s+/).filter(Boolean).length;
console.error('word count:', wc);
if (wc < 9000) { console.error('FAIL: under 9000'); process.exit(1); }
if (wc > 10500) { console.error('FAIL: over 10500'); process.exit(1); }
const payload = {
  id: 'q444',
  new_answer: answer,
  format_v: '2026-05',
  polish_note: 'Gold-format rewrite v15.2 t218: format_v 2026-05, all 10 gold elements',
  key: 'pulsemachine-writer-2026'
};
fs.writeFileSync('_gold_v15_t218_payload.json', JSON.stringify(payload));
console.error('payload bytes:', fs.statSync('_gold_v15_t218_payload.json').size);
