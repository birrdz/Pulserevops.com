const fs = require('fs');
const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
for (const l of env.split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
(async () => {
  const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
  const e = await s.get('answers/q10909.json', { type: 'json' });
  console.log('polished_at:', new Date(e.polished_at).toISOString());
  console.log('ts:', new Date(e.ts).toISOString());
  console.log('answer length:', e.answer.length);
  console.log('---first 800 chars---');
  console.log(e.answer.slice(0, 800));
  console.log('---');
  console.log('contains "Lane Kiffin":', e.answer.includes('Lane Kiffin'));
  console.log('contains "Brian Kelly":', e.answer.includes('Brian Kelly'));
  console.log('contains "Sam Leavitt":', e.answer.includes('Sam Leavitt'));
  console.log('contains "Nussmeier":', e.answer.includes('Nussmeier'));
  console.log('contains "54 million" or "$54M":', /\$54M|54 million/.test(e.answer));
})();
