const fs=require('fs');
const f='C:/Users/koryj/website/_random_gold_publish_one.js';
let s=fs.readFileSync(f,'utf8');
if(!s.includes('reshapeQaGoldBody')) {
  s=s.replace(
    "const { auditQaGoldTemplate } = require('./_qa_gold_template');",
    "const { auditQaGoldTemplate, reshapeQaGoldBody } = require('./_qa_gold_template');"
  );
}
if(!s.includes('gen-reset-stop')) {
  s=s.replace(
    `  await fetch(SCRUB + '/scrub-auto', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: KEY }),
    signal: AbortSignal.timeout(15000),
  }).catch(() => {});`,
    `  await fetch(SCRUB + '/scrub-auto', {
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
  }).catch(() => {});`
  );
}
if(!s.includes('prepBody = reshapeQaGoldBody')) {
  s=s.replace(
    `  const rebuilt = await rebuildAqQaEntry(id, question, existing.answer, {`,
    `  let prepBody = existing.answer;
  if (pickGoldTemplate(id, prepBody, question).template !== 'qa') {
    prepBody = reshapeQaGoldBody(prepBody);
    await store.setJSON('answers/' + id + '.json', Object.assign({}, existing, { answer: prepBody, updated_at: new Date().toISOString() }));
  }
  const rebuilt = await rebuildAqQaEntry(id, question, prepBody, {`
  );
}
if(!s.includes('essayOnly: true')) {
  s=s.replace(
    'body: JSON.stringify({ key: KEY, pillar, question }),',
    'body: JSON.stringify({ key: KEY, pillar, question, essayOnly: true }),'
  );
}
if(!s.includes('Never write a Top 10')) {
  s=s.replace(
    'Essay/Q&A shape (not a Top 10 list).',
    'Essay/Q&A shape only — never a ranked list, never "top 10", never product comparison rankings. Single-topic explanatory essay.'
  );
}
fs.writeFileSync(f,s);
console.log('random script patched');
