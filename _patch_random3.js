const fs=require('fs');
const f='C:/Users/koryj/website/_random_gold_publish_one.js';
let s=fs.readFileSync(f,'utf8');
if(!s.includes('QA_PILLARS')) {
  s=s.replace(
    "const SKIP = new Set(['tl', 'vq', 'q', 'dr']);",
    "const SKIP = new Set(['tl', 'vq', 'q', 'dr']);\nconst QA_PILLARS = new Set(['cg', 'tk', 'pt', 'sw', 'ai', 'aq', 'tl', 'tc', 'ga', 'gm']);"
  );
  s=s.replace(
    '  const pool = Object.entries(counts).filter(([, n]) => n >= 20).map(([p]) => p);',
    '  const pool = Object.entries(counts).filter(([p, n]) => n >= 20 && QA_PILLARS.has(p)).map(([p]) => p);'
  );
  fs.writeFileSync(f,s);
  console.log('QA pillar filter added');
} else console.log('already has QA_PILLARS');
