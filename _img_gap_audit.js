// READ-ONLY. Scans the whole library and reports, per prefix, how many entries
// still need image work under the "every answer needs an image" LAW:
//   - Top-10 entries (have `## N.` headings): need >= min(10, items) @@PRODUCT img= cards
//   - all other entries: need >= 1 leading markdown image  ![...](...)
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try { const env = fs.readFileSync('C:/Users/koryj/website/.env.local','utf8'); for (const l of env.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');} } catch(e){}
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const s = getStore({ name:'pulse-machine-library', siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token:TOK });
const prefixOf = id => (String(id).match(/^([a-z]+)\d+$/i)||[])[1] || '(other)';

(async()=>{
  const idx = (await s.get('_index.json',{type:'json'})) || {entries:[]};
  const entries = idx.entries || [];
  console.log('total index entries:', entries.length);
  const stat = {};   // prefix -> {total, top10, top10NeedImg, essay, essayNeedImg, top10MissingCards}
  const CONC = 12; let cur = 0;
  const needTop10 = [];  // ids needing top-10 cards
  const needEssay = [];  // ids needing a cover image
  async function worker(){
    while(cur < entries.length){
      const e0 = entries[cur++];
      const id = e0.id;
      const pre = prefixOf(id);
      const st = stat[pre] || (stat[pre]={total:0,top10:0,top10NeedImg:0,essay:0,essayNeedImg:0,missingCards:0});
      st.total++;
      const e = await s.get('answers/'+id+'.json',{type:'json'}).catch(()=>null);
      if(!e||!e.answer){ continue; }
      const a = e.answer;
      const items = (a.match(/^##\s+\d+\.\s/gm)||[]).length;
      if(items >= 5){
        st.top10++;
        const imgs = (a.match(/@@PRODUCT[^\n]* img=/g)||[]).length;
        const want = Math.min(10, items);
        if(imgs < want){ st.top10NeedImg++; st.missingCards += (want-imgs); needTop10.push({id,have:imgs,want}); }
      } else {
        st.essay++;
        const hasLead = /^﻿?\s*!\[/.test(a);
        const weakLead = hasLead && (() => {
          const m = a.match(/^﻿?\s*!\[[^\]]*\]\(([^)]+)\)/);
          if (!m) return false;
          const u = m[1].toLowerCase();
          return u.includes('placeholder.svg') || (u.includes('/img/auto/') && u.endsWith('.svg'));
        })();
        if (!hasLead || weakLead) { st.essayNeedImg++; needEssay.push(id); }
      }
    }
  }
  await Promise.all(Array.from({length:CONC},worker));
  const rows = Object.entries(stat).sort((a,b)=> (b[1].top10NeedImg+b[1].essayNeedImg)-(a[1].top10NeedImg+a[1].essayNeedImg));
  console.log('\nprefix | total | top10 | top10NeedImg | essay | essayNeedImg');
  let tNeed=0,eNeed=0;
  for(const [p,v] of rows){
    if(v.top10NeedImg||v.essayNeedImg)
      console.log(`${p.padEnd(8)} | ${String(v.total).padStart(5)} | ${String(v.top10).padStart(5)} | ${String(v.top10NeedImg).padStart(11)} | ${String(v.essay).padStart(5)} | ${String(v.essayNeedImg).padStart(11)}`);
    tNeed+=v.top10NeedImg; eNeed+=v.essayNeedImg;
  }
  console.log(`\nTOTAL top10 entries needing images: ${tNeed}`);
  console.log(`TOTAL essay/Q&A entries needing a cover image: ${eNeed}`);
  fs.writeFileSync('C:/Users/koryj/website/_img_gap.json', JSON.stringify({generated:'audit',top10:needTop10,essay:needEssay,perPrefix:stat},null,1));
  console.log('\nwrote _img_gap.json (full id lists per category)');
})().catch(e=>{console.error('FATAL',e&&e.stack);process.exit(1);});
