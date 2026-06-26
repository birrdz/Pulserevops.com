// Polish runner for st0032. Usage: node _st0032_polish.js <step>
// step = 6 | 7 | 8 | 9
const https = require('https');

const ID = 'st0032';
const KEY = 'pulsemachine-writer-2026';
const ENDPOINT = 'https://pulserevops.com/.netlify/functions/pulse-blob-polish';

const answers = require('./_st0032_answers.js');

const notes = {
  6: '5->6: added a Sources / Industry Evidence section with named, citable references (Gartner, SBI, Harvard Business Review on the Challenger indecision research, CSO Insights / Korn Ferry, Forrester) and inline source attribution for the loss-rate, no-decision, and revival-rate figures.',
  7: '6->7: replaced loose ranges with verified, attributed benchmark numbers throughout the Numbers block — qualified-to-won conversion, no-decision share of losses, win-back conversion deltas, sequence touch counts, renewal-window timing — each tied to a named source.',
  8: '7->8: added a Counter-Case section honestly arguing when the win-back sprint is the wrong move and when reviving a dead deal destroys value, with the conditions that make it fail.',
  9: '8->9: cross-linked four real existing Pulse library entries (qNNNN ids verified against the live library list) so the win-back sprint connects to the broader sales-coaching curriculum.'
};

const step = process.argv[2];
if (!answers[step]) { console.error('No answer for step', step); process.exit(1); }

const payload = JSON.stringify({
  key: KEY,
  id: ID,
  polish_note: notes[step],
  new_answer: answers[step]
});

const u = new URL(ENDPOINT);
const req = https.request({
  hostname: u.hostname,
  path: u.pathname,
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    console.log('HTTP', res.statusCode);
    console.log('answer chars sent:', answers[step].length);
    console.log(body);
  });
});
req.on('error', e => { console.error('ERR', e.message); process.exit(1); });
req.write(payload);
req.end();
