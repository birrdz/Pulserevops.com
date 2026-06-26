const fs=require('fs');const {execFileSync}=require('child_process');
const Q=JSON.parse(fs.readFileSync('C:/Users/koryj/_mv_sprint_queue.json','utf8'));
const START=parseInt(process.argv[2]||'11',10);
const END=parseInt(process.argv[3]||'50',10);
let ok=0,fail=0;
for(const e of Q){
  const n=parseInt(e.id.replace('mv',''),10);
  if(n<START||n>END)continue;
  try{
    const b=execFileSync('node',['_build_cards.js',e.id,'movie poster'],{encoding:'utf8',cwd:'C:/Users/koryj/website'});
    const bj=JSON.parse(b.trim().split('\n').pop());
    execFileSync('node',['_insert_cards.js',e.id],{encoding:'utf8',cwd:'C:/Users/koryj/website'});
    const p=execFileSync('node',['_write_mv.js',e.id,e.title,e.slug,'--force'],{encoding:'utf8',cwd:'C:/Users/koryj/website'});
    const pj=JSON.parse(p.trim().split('\n').pop());
    if(pj.ok){ok++;console.log('OK   '+e.id+' imgs='+bj.imgs+' links='+bj.links+' — '+e.title);}
    else{fail++;console.log('FAIL '+e.id+' :: '+p.slice(0,120));}
  }catch(err){fail++;const m=(err.stderr||err.stdout||err.message||'').toString().trim().split('\n').pop();console.log('FAIL '+e.id+' :: '+m.slice(0,160));}
}
console.log('\n=== posters done: '+ok+' ok, '+fail+' fail ===');
