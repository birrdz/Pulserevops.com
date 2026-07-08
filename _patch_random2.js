const fs=require('fs');
const f='C:/Users/koryj/website/_random_gold_publish_one.js';
let s=fs.readFileSync(f,'utf8');
const old = `async function preparePipeline() {
  try {
    fs.unlinkSync(WD + '/_scrub_auto_off.flag');
  } catch (e) {}
  await fetch(SCRUB + '/scrub-auto', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: KEY }),
    signal: AbortSignal.timeout(15000),
  }).catch(() => {});
  await fetch(SCRUB + '/gen-reset-stop', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: KEY }),
    signal: AbortSignal.timeout(15000),
  }).catch(() => {});
}`;
const neu = `async function preparePipeline() {
  try {
    fs.writeFileSync(WD + '/_scrub_auto_off.flag', '1');
  } catch (e) {}
  await fetch(SCRUB + '/scrub-auto', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: KEY, action: 'stop' }),
    signal: AbortSignal.timeout(15000),
  }).catch(() => {});
  await fetch(SCRUB + '/gen-reset-stop', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: KEY }),
    signal: AbortSignal.timeout(15000),
  }).catch(() => {});
}`;
if (s.includes('action: \'stop\'')) { console.log('already patched prepare'); }
else if (!s.includes(old.split('\n')[0])) { throw new Error('prepare block changed'); }
else { s=s.replace(old, neu); fs.writeFileSync(f,s); console.log('preparePipeline patched'); }
