const fs = require('fs');
const answer = fs.readFileSync('C:/Users/koryj/website/lab/_gold_q2149_solo.md', 'utf8');
const payload = {
  key: 'pulsemachine-writer-2026',
  id: 'q2149',
  polish_note: 'v15.2 staggered-batch gold-upgrade',
  new_answer: answer,
  format_v: '2026-05'
};
fs.writeFileSync('C:/Users/koryj/website/lab/_post_q2149_solo.json', JSON.stringify(payload));
console.log('payload written; new_answer.len=' + answer.length + ' words≈' + answer.trim().split(/\s+/).length);
