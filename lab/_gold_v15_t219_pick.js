const fs = require('fs');
const data = JSON.parse(fs.readFileSync('C:\\Users\\koryj\\website\\lab\\_gold_v15_t219_library.json','utf8'));
const entries = data.entries || data;
const skip = new Set(['q01','q02','q05','q07','q08','q10','q11','q13','q27','q100','q101','q102','q161','q164','q165','q167','q168','q169','q170','q171','q172','q173','q174','q175','q176','q178','q179','q223','q405','q406','q407','q414','q415','q416','q417','q419','q421','q422','q423','q429','q431','q444','q1100','q1103','q1106','q1108','q1112','q1123','q1133','q1157','q1161','q1163','q1982','q9678','q9679','q9680','q9681']);
const filtered = entries.filter(e=>{
  if(!(e.quality_score>=10)) return false;
  if(e.format_v==='2026-05') return false;
  if(String(e.id).startsWith('st')) return false;
  if(!/^q\d+$/.test(e.id)) return false;
  const n = parseInt(e.id.replace(/^q/,''),10);
  if(n>=9501) return false;
  if(n>=1946 && n<=1954) return false;
  if((e.tags||[]).includes('sales-training')) return false;
  if(skip.has(e.id)) return false;
  return true;
});
filtered.sort((a,b)=> (b.ts||0)-(a.ts||0));
console.log('filtered count:', filtered.length);
filtered.slice(0,5).forEach((e,i)=>{
  const wc = (e.answer||'').split(/\s+/).filter(Boolean).length;
  console.log(`#${i} id=${e.id} ts=${e.ts} qs=${e.quality_score} wc=${wc} fmt=${e.format_v} q="${(e.question||'').slice(0,90)}"`);
});
const pick = filtered[0];
fs.writeFileSync('C:\\Users\\koryj\\website\\lab\\_gold_v15_t219_target.json', JSON.stringify(pick,null,2));
console.log('PICKED:', pick.id);
