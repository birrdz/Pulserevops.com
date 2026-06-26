// Validates + writes back year-audited NIL bodies from nil_gen/<id>.out.md.
// Backs up the original (e._nil_audit_backup) so it's reversible, re-prepends the
// leading image, marks e._nil_audited=true. Skips/flags suspicious rewrites.
const fs=require('fs');const { getStore }=require('@netlify/blobs');
try{const e=fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');for(const l of e.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}}catch(e){}
const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN});
const DIR='C:/Users/koryj/website/nil_gen';
const origBody=txt=>{const i=txt.indexOf('\nANSWER');const j=txt.indexOf('\n',i+1);return j>0?txt.slice(j+1):txt;};
function countSections(b){return {sources:/^#{2,3}\s*Sources\b/im.test(b),faq:/^#{2,3}\s*(FAQ|Frequently Asked)/im.test(b),mermaid:(b.match(/```mermaid/g)||[]).length};}
async function pingIndexNow(id){try{await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:'pulsemachine-writer-2026',id}),signal:AbortSignal.timeout(8000)});}catch(e){}}
(async()=>{
  const files=fs.readdirSync(DIR).filter(f=>/\.out\.md$/.test(f));
  console.log('revised files to apply:',files.length);
  let ok=0,bad=0;
  for(const f of files){
    const id=f.replace(/\.out\.md$/,'');
    let rev=fs.readFileSync(DIR+'/'+f,'utf8').trim().replace(/^```(?:markdown)?\s*/i,'').replace(/```\s*$/,'').trim();
    let orig='';try{orig=origBody(fs.readFileSync(DIR+'/'+id+'.txt','utf8'));}catch(_){}
    const img=(()=>{try{return fs.readFileSync(DIR+'/'+id+'.img','utf8');}catch(_){return '';}})();
    // validation: length sane + structure preserved
    if(!rev||rev.length<400){bad++;console.log('  REJECT',id,'too short');continue;}
    if(orig){const r=rev.length/orig.length; if(r<0.55||r>1.8){bad++;console.log('  REJECT',id,'len ratio '+r.toFixed(2));continue;}
      const so=countSections(orig),sr=countSections(rev);
      if(so.sources&&!sr.sources){bad++;console.log('  REJECT',id,'lost Sources');continue;}
      if(so.faq&&!sr.faq){bad++;console.log('  REJECT',id,'lost FAQ');continue;}
      if(so.mermaid>sr.mermaid){bad++;console.log('  REJECT',id,'lost mermaid '+so.mermaid+'->'+sr.mermaid);continue;}
    }
    const e=await s.get('answers/'+id+'.json',{type:'json'}).catch(()=>null);
    if(!e||!e.answer){bad++;console.log('  no-blob',id);continue;}
    if(!e._nil_audit_backup)e._nil_audit_backup=e.answer; // reversible (first time only)
    e.answer=(img?img.replace(/\s*$/,'')+'\n\n':'')+rev;
    e._nil_audited=true;e.ts=Date.now();e.polished_at=Date.now();
    await s.setJSON('answers/'+id+'.json',e);
    await pingIndexNow(id);
    ok++;console.log('  +audited',id);
    fs.unlinkSync(DIR+'/'+f);try{fs.unlinkSync(DIR+'/'+id+'.txt');fs.unlinkSync(DIR+'/'+id+'.img');}catch(_){}
  }
  console.log(`\nAPPLY DONE. audited=${ok} rejected=${bad}`);
})().catch(e=>{console.error('FATAL',e&&e.stack);process.exit(1);});
