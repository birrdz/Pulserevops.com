const fs = require('fs');
const data = JSON.parse(fs.readFileSync('C:/Users/koryj/website/lab/_gold_v15_t212c_library.json','utf8'));
const entries = data.entries || data;
const skip = new Set(['q01','q02','q05','q07','q08','q10','q11','q13','q27','q100','q101','q102','q168','q169','q170','q172','q173','q174','q175','q176','q178','q179','q223','q406','q415','q1103','q1108','q1133','q1163','q1982','q9678','q9679','q9680','q9681']);
const filtered = entries.filter(e=>{
  if(!(e.quality_score>=10)) return false;
  if(e.format_v==='2026-05') return false;
  if(typeof e.id!=='string') return false;
  if(e.id.startsWith('st')) return false;
  if(!/^q\d+$/.test(e.id)) return false;
  const n=parseInt(e.id.replace(/^q/,''),10);
  if(!(n<9501)) return false;
  if(n>=1946 && n<=1954) return false;
  const tags=e.tags||[];
  if(tags.includes('sales-training')) return false;
  if(skip.has(e.id)) return false;
  return true;
});
filtered.sort((a,b)=>{
  const ta=a.ts||a.created_at||a.created||0, tb=b.ts||b.created_at||b.created||0;
  return (typeof ta==='string'?Date.parse(ta):ta)-(typeof tb==='string'?Date.parse(tb):tb);
});
console.log('TOTAL ENTRIES:', entries.length);
console.log('FILTERED:', filtered.length);
const pick=filtered[0];
function wc(s){return (s||'').replace(/<[^>]+>/g,' ').split(/\s+/).filter(Boolean).length;}
if(pick){
  console.log('PICK id:', pick.id);
  console.log('ts:', pick.ts);
  console.log('question:', pick.question || pick.q || pick.title);
  console.log('quality_score:', pick.quality_score);
  console.log('format_v:', pick.format_v);
  console.log('tags:', JSON.stringify(pick.tags));
  console.log('answer wordcount:', wc(pick.answer||pick.a||pick.body));
  console.log('answer field keys:', Object.keys(pick).join(','));
  fs.writeFileSync('C:/Users/koryj/website/lab/_gold_v15_t212c_pick.json', JSON.stringify(pick,null,2));
}
console.log('NEXT 5:');
filtered.slice(0,5).forEach((e,i)=>console.log(i, e.id, e.ts, (e.question||e.q||'').slice(0,70)));
