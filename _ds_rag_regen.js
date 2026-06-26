// DDG-grounded DeepSeek regen: for each held rs/dn/er entry, fetch REAL venue/
// product names from DuckDuckGo, feed them as grounding to DeepSeek's top10
// generator (so it can't invent), write <id>_draft_ds.md. Claude auditor then
// verifies + publishes. NO index writes here. Parallel-safe (local .md only).
const fs=require('fs');const path=require('path');
const { generateGradedBody } = require('./_ds_gen_any.js');
const HOME='C:/Users/koryj/';
const UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';
const PAR=parseInt((process.argv.find(a=>a.startsWith('--par='))||'--par=2').split('=')[1],10);
const LIMIT=parseInt((process.argv.find(a=>a.startsWith('--limit='))||'--limit=0').split('=')[1],10);
const KIND={rs:'resorts (real, currently-operating hotels/resorts)',dn:'restaurants (real, currently-operating)',er:'products (real, currently-sold models with real brand names)'};

async function ddgText(q){
  for(let a=0;a<2;a++){try{
    const r=await fetch('https://html.duckduckgo.com/html/?q='+encodeURIComponent(q),{headers:{'User-Agent':UA,'Accept':'text/html'},signal:AbortSignal.timeout(15000)});
    const html=await r.text();
    const titles=[...html.matchAll(/class="result__a"[^>]*>([\s\S]*?)<\/a>/g)].map(m=>m[1].replace(/<[^>]+>/g,'').trim()).filter(Boolean);
    const snips=[...html.matchAll(/class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g)].map(m=>m[1].replace(/<[^>]+>/g,'').trim()).filter(Boolean);
    if(titles.length||snips.length)return {titles:titles.slice(0,12),snips:snips.slice(0,12)};
  }catch(e){}await new Promise(r=>setTimeout(r,1200));}
  return {titles:[],snips:[]};
}
function queryFor(title){return String(title).replace(/^top\s*10\s*/i,'best ').replace(/\?$/,'')+' 2027';}

(async()=>{
  const q=JSON.parse(fs.readFileSync(path.join(__dirname,'_held_queue.json'),'utf8'));
  const arr=Array.isArray(q)?q:(q.ids||q.held||q.entries||[]);
  let items=arr.map(x=>({id:x.id||x,title:x.question||x.title||''})).filter(x=>x.title&&/^(rs|dn|er)\d/.test(x.id));
  items=items.filter(x=>!fs.existsSync(HOME+x.id+'_answer.md')&&!fs.existsSync(HOME+x.id+'_draft_ds.md'));
  if(LIMIT>0)items=items.slice(0,LIMIT);
  console.log('RAG regen: '+items.length+' held rs/dn/er to ground+draft (par '+PAR+')');
  let i=0,done=0,fail=0,thin=0;
  async function worker(){while(i<items.length){const it=items[i++];const pfx=it.id.match(/^[a-z]+/)[0];try{
    const {titles,snips}=await ddgText(queryFor(it.title));
    const ctx=[...titles,...snips].join('\n').slice(0,3500);
    if(ctx.length<200){thin++; /* still attempt, but flag */ }
    const grounding=`REAL WEB-SEARCH RESULTS for "${it.title}" (use ONLY ${KIND[pfx]||'real items'} that actually appear in or are clearly named by these results; do NOT invent any name not grounded here; if fewer than 10 real ones are findable, write fewer rather than fabricate):\n${ctx}`;
    const {body,grade}=await generateGradedBody(it.id,it.title,{kind:'top10',grounding,maxTries:2});
    fs.writeFileSync(HOME+it.id+'_draft_ds.md',body);
    done++; if(done%8===0)console.log('  drafted '+done+'/'+items.length+' (last '+it.id+' '+grade.score+'/12, ctx '+ctx.length+'b)');
  }catch(e){fail++;console.log('  ERR '+it.id+' '+(e.message||e));}}}
  await Promise.all(Array.from({length:PAR},()=>worker()));
  console.log('DONE rag-regen done='+done+' fail='+fail+' thin-context='+thin);
})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
