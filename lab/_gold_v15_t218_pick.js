const fs = require('fs');
const data = JSON.parse(fs.readFileSync('_gold_v15_t218_library.json','utf8'));
const skip = new Set(('q01,q02,q05,q07,q08,q10,q11,q13,q27,q100,q101,q102,q161,q164,q165,q167,q168,q169,q170,q171,q172,q173,q174,q175,q176,q178,q179,q223,q405,q406,q407,q414,q415,q416,q417,q419,q421,q422,q423,q429,q431,q1100,q1103,q1106,q1108,q1112,q1123,q1133,q1157,q1161,q1163,q1982,q9678,q9679,q9680,q9681').split(','));
const q1946 = new Set(['q1946','q1947','q1948','q1949','q1950','q1951','q1952','q1953','q1954']);

const filtered = data.entries.filter(e => {
  if (!(e.quality_score >= 10)) return false;
  if (e.format_v === '2026-05') return false;
  if (String(e.id).startsWith('st')) return false;
  if (!/^q\d+$/.test(e.id)) return false;
  if (parseInt(e.id.replace(/^q/,''),10) >= 9501) return false;
  if (q1946.has(e.id)) return false;
  if (Array.isArray(e.tags) && e.tags.includes('sales-training')) return false;
  if (skip.has(e.id)) return false;
  return true;
});

filtered.sort((a,b) => {
  const ta = a.ts || a.timestamp || a.created_at || '';
  const tb = b.ts || b.timestamp || b.created_at || '';
  return String(tb).localeCompare(String(ta));
});

console.log('Filtered count:', filtered.length);
const pick = filtered[0];
function wc(s){ return (s||'').trim().split(/\s+/).filter(Boolean).length; }
console.log('PICK id:', pick.id);
console.log('ts:', pick.ts);
console.log('question:', pick.question);
console.log('quality_score:', pick.quality_score);
console.log('format_v:', pick.format_v);
console.log('tags:', JSON.stringify(pick.tags));
console.log('current answer word count:', wc(pick.answer));
console.log('--- next 4 ---');
for (let i=1;i<5;i++){ if(filtered[i]) console.log(i, filtered[i].id, filtered[i].ts, '|', filtered[i].question); }
fs.writeFileSync('_gold_v15_t218_pick.json', JSON.stringify(pick,null,2));
