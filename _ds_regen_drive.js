// DeepSeek drafts grounded-style bodies for held entries -> <id>_draft_ds.md
// (separate from Claude .md so the auditor knows the source). Skips ids that
// already have a Claude-authored <id>_answer.md. Parallel, cheap. NO index writes.
const fs=require('fs');const path=require('path');
const {generateGradedBody}=require('./_ds_gen_any.js');
const HOME='C:/Users/koryj/';
const PAR=parseInt((process.argv.find(a=>a.startsWith('--par='))||'--par=2').split('=')[1],10);
const LIMIT=parseInt((process.argv.find(a=>a.startsWith('--limit='))||'--limit=0').split('=')[1],10);
(async()=>{
  const q=JSON.parse(fs.readFileSync(path.join(__dirname,'_held_queue.json'),'utf8'));
  const arr=Array.isArray(q)?q:(q.ids||q.held||q.entries||[]);
  let items=arr.map(x=>({id:x.id||x,title:x.question||x.title||''})).filter(x=>x.title);
  // skip ids that already have a Claude .md (answer) OR a ds draft
  items=items.filter(x=>!fs.existsSync(HOME+x.id+'_answer.md')&&!fs.existsSync(HOME+x.id+'_draft_ds.md'));
  if(LIMIT>0)items=items.slice(0,LIMIT);
  console.log('DS regen draft: '+items.length+' held ids to draft (par '+PAR+')');
  let i=0,done=0,fail=0;
  async function worker(w){while(i<items.length){const it=items[i++];try{
    const {body,grade}=await generateGradedBody(it.id,it.title);
    fs.writeFileSync(HOME+it.id+'_draft_ds.md',body);
    done++; if(done%10===0)console.log('  drafted '+done+'/'+items.length+' (last '+it.id+' '+grade.score+'/12)');
  }catch(e){fail++;console.log('  ERR '+it.id+' '+e.message);}}}
  await Promise.all(Array.from({length:PAR},(_,w)=>worker(w)));
  console.log('DONE ds-regen-draft done='+done+' fail='+fail);
})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
