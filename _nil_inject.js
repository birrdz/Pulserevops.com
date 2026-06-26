// Stamps nil_rank / nil_total / nil_school / nil_money onto NIL entries whose
// QUESTION clearly centers on a top-40 NIL school. Conservative matching:
// most-specific names first; only badges genuinely school-specific entries.
const fs=require('fs');const { getStore }=require('@netlify/blobs');
try{const e=fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');for(const l of e.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}}catch(e){}
const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN});
const j=JSON.parse(fs.readFileSync('C:/Users/koryj/website/_nil_rank.json','utf8'));
const TOTAL=j.schools.length;
const DRY=process.argv.includes('--dry');
// aliases — list MOST-SPECIFIC first so "Texas A&M" wins over "Texas"
const ALIAS=[
 ['Texas A&M',['texas a&m','texas a and m']],['Texas Tech',['texas tech']],
 ['Ohio State',['ohio state']],['Penn State',['penn state']],['Florida State',['florida state']],['Kansas State',['kansas state']],
 ['North Carolina',['north carolina','unc ']],['Notre Dame',['notre dame']],['Ole Miss',['ole miss']],['South Carolina',['south carolina']],
 ['Michigan',['michigan']],['Oregon',['oregon']],['Miami',['miami']],['Tennessee',['tennessee']],['USC',['usc','southern cal']],
 ['Alabama',['alabama']],['Georgia',['georgia']],['Indiana',['indiana']],['Oklahoma',['oklahoma']],['Louisville',['louisville']],
 ['Auburn',['auburn']],['UCLA',['ucla']],['Washington',['washington']],['Houston',['houston']],['Nebraska',['nebraska']],
 ['Vanderbilt',['vanderbilt']],['Duke',['duke']],['Kentucky',['kentucky']],['Clemson',['clemson']],['BYU',['byu','brigham young']],
 ['Arkansas',['arkansas']],['Kansas',['kansas']],['Arizona',['arizona']],['Missouri',['missouri','mizzou']],['Iowa',['iowa']],
 ['SMU',['smu','southern methodist']],['Illinois',['illinois']],['Texas',['texas']],['LSU',['lsu','louisiana state']],['Florida',['florida']]
];
const bySchool={};for(const sc of j.schools)bySchool[sc.school]=sc;
function matchSchool(q){
  const t=String(q||'');
  for(const [school,als] of ALIAS){
    for(const a of als){
      const esc=a.trim().replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
      // word-boundary match, but NOT when the base name is followed by "State"
      // (so "Iowa State" / "Michigan State" / "Arizona State" don't match Iowa/etc.)
      const re=new RegExp('\\b'+esc+'\\b(?!\\s+state\\b)','i');
      if(re.test(t) && bySchool[school]) return school;
    }
  }
  return null;
}
async function pingIndexNow(id){try{await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:'pulsemachine-writer-2026',id}),signal:AbortSignal.timeout(8000)});}catch(e){}}
(async()=>{
  const idx=await s.get('_index.json',{type:'json'});
  const nil=idx.entries.filter(e=>/\bnil\b|collective/i.test(e.question||''));
  console.log('scanning',nil.length,'NIL entries for top-40 school matches...');
  const matched=[];let cur=0;const CONC=12,clearList=[];
  // first pass: determine matches (read-only)
  for(const e0 of nil){const sch=matchSchool(e0.question);if(sch)matched.push({id:e0.id,school:sch,q:e0.question});}
  console.log('school-specific matches:',matched.length);
  if(DRY){matched.slice(0,40).forEach(m=>console.log('  '+m.id+' -> '+m.school+'  ['+m.q.slice(0,60)+']'));return;}
  let done=0,cleared=0;cur=0;
  // process ALL NIL entries: stamp matches, CLEAR stale badges from non-matches
  async function w(){while(cur<nil.length){const e0=nil[cur++];const sch=matchSchool(e0.question);
    const e=await s.get('answers/'+e0.id+'.json',{type:'json'}).catch(()=>null);if(!e)continue;
    if(sch){const sc=bySchool[sch];
      if(e.nil_rank===sc.rank&&e.nil_school===sch&&e.nil_money===sc.total)continue; // unchanged
      e.nil_rank=sc.rank;e.nil_total=TOTAL;e.nil_school=sch;e.nil_money=sc.total;
      await s.setJSON('answers/'+e0.id+'.json',e);done++;if(done%40===0){console.log('  stamped '+done);await pingIndexNow(e0.id);}
    } else if(e.nil_rank!=null){
      delete e.nil_rank;delete e.nil_total;delete e.nil_school;delete e.nil_money;
      await s.setJSON('answers/'+e0.id+'.json',e);cleared++;
    }
  }}
  await Promise.all(Array.from({length:CONC},w));
  console.log('DONE stamped='+done+' cleared(stale)='+cleared);
})().catch(e=>{console.error('FATAL',e&&e.stack);process.exit(1);});
