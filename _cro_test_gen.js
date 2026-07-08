// one-off: validate the new honest v2 CRO ruleset before resuming the writer.
const { generateGradedBody } = require('./_ds_gen_any');
const fs = require('fs');
(async () => {
  const { body, grade } = await generateGradedBody('tl99001', 'How do I hire a fractional CRO for a B2B SaaS company in Austin in 2027?', { ruleset: 'cro' });
  const has = s => body.includes(s);
  console.log('score:', grade.score, '| missing:', grade.missing.join(','), '| banned:', grade.banned_hits.join(','));
  console.log('v2 blocks -> answer:' + has('```answer') + ' steps:' + has('```steps') + ' compare:' + has('```compare') + ' callout:' + has('```callout'));
  const pct = (body.match(/\d+(\.\d+)?\s?%/g) || []).length;
  const analyst = (body.match(/(Gartner|Forrester|McKinsey|Gong Labs|Clari|SaaStr|HBR)[^.\n]{0,55}(report|shows|found|data|survey|study|average)/gi) || []);
  const amounts = (body.match(/\$\d{1,3},\d{3}/g) || []);
  console.log('FABRICATION markers -> percentages:' + pct + ' | analyst-stat-cites:' + analyst.length + ' | specific-$amounts:' + amounts.length);
  if (analyst.length) console.log('  analyst examples:', analyst.slice(0, 3));
  console.log('words:', body.split(/\s+/).length);
  fs.writeFileSync('C:/Users/koryj/tl99001_test.md', body);
})().catch(e => console.error('ERR', e.message));
