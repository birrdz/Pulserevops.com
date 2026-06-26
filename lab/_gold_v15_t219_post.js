const fs = require('fs');
const body = fs.readFileSync('C:\\Users\\koryj\\website\\lab\\_gold_v15_t219_answer.md','utf8');
const payload = {
  id: 'q425',
  new_answer: body,
  format_v: '2026-05',
  polish_note: 'Gold-format rewrite v15.2 t219: format_v 2026-05, all 10 gold elements',
  key: 'pulsemachine-writer-2026'
};
fs.writeFileSync('C:\\Users\\koryj\\website\\lab\\_gold_v15_t219_payload.json', JSON.stringify(payload));
console.log('payload bytes:', JSON.stringify(payload).length, 'answer words:', body.split(/\s+/).filter(Boolean).length);
