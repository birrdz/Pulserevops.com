// Integrity check for the answer-page reskin. Captures body text + link set
// for a sample of live entries; run with `baseline` first, then `compare`
// after deploy. PASS = identical body text + same internal-link set on every
// page (proves the reskin changed only the view, not content/links).
const fs = require('fs');
const https = require('https');
const { getStore } = require('@netlify/blobs');
try { const e = fs.readFileSync('C:/Users/koryj/website/.env.local','utf8'); for (const l of e.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}}catch(e){}
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const MODE = process.argv[2] || 'baseline';
const FILE = 'C:/Users/koryj/_skin_baseline.json';
const PMAP = {q:'/knowledge/',st:'/sales-trainings/',ik:'/industry-kpis/',tk:'/tech-stacks/',bs:'/sales-book-summaries/',er:'/electronic-reviews/',ra:'/revenue-architecture/',gp:'/go-to-market-playbooks/',fr:'/franchises/',ca:'/cars/',tn:'/towns/',sc:'/schools/',nl:'/nightlife/',dn:'/dining/',bt:'/boats/',mv:'/movies/',sk:'/skills/'};
function get(url){return new Promise((res)=>{https.get(url,r=>{if(r.statusCode>=300&&r.statusCode<400&&r.headers.location)return res(get(r.headers.location));let d='';r.on('data',c=>d+=c);r.on('end',()=>res({code:r.statusCode,html:d}));}).on('error',()=>res({code:0,html:''}));});}
function extractBody(html){const s=html.search(/<div class="body">/);if(s<0)return null;let i=html.indexOf('>',s)+1;const st=i;let depth=1;const re=/<\/?div\b[^>]*>/g;re.lastIndex=i;let m;while((m=re.exec(html))){if(m[0].slice(0,2)==='</')depth--;else depth++;if(depth===0)return html.slice(st,m.index);}return html.slice(st);}
function textOf(h){return h.replace(/<[^>]+>/g,' ').replace(/&[a-z#0-9]+;/gi,' ').replace(/\s+/g,' ').trim();}
function linksOf(h){const out=[];const re=/href="([^"]+)"/g;let m;while((m=re.exec(h)))out.push(m[1]);return out.sort();}
function mermaidCount(h){return (h.match(/class="mermaid"/g)||[]).length;}
(async()=>{
  const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:TOK});
  const idx=await s.get('_index.json',{type:'json'})||{};const items=idx.entries||[];
  // 50 sample: spread across pillars + recency
  const byp={};items.forEach(e=>{const p=(String(e.id).match(/^[a-z]+/)||[''])[0];(byp[p]=byp[p]||[]).push(e.id);});
  let sample=[];Object.keys(byp).forEach(p=>{if(PMAP[p])sample.push.apply(sample,byp[p].slice(0,3));});
  sample=sample.slice(0,50);
  const data={};
  for(const id of sample){
    const p=(String(id).match(/^[a-z]+/)||[''])[0];const route=PMAP[p];if(!route)continue;
    const r=await get('https://pulserevops.com'+route+id);
    const body=r.html?extractBody(r.html):null;
    data[id]={code:r.code,len:body?textOf(body).length:0,links:body?linksOf(body):[],merm:body?mermaidCount(body):0,text:body?textOf(body):''};
  }
  if(MODE==='baseline'){fs.writeFileSync(FILE,JSON.stringify(data));console.log('baseline captured for',Object.keys(data).length,'entries');return;}
  // compare
  const base=JSON.parse(fs.readFileSync(FILE,'utf8'));let pass=0,fail=0,issues=[];
  for(const id of Object.keys(base)){
    const b=base[id],n=data[id]||{};
    if(n.code!==200){issues.push(id+': HTTP '+n.code);fail++;continue;}
    if(n.text!==b.text){issues.push(id+': BODY TEXT CHANGED ('+b.len+'->'+n.len+' chars)');fail++;continue;}
    const bl=b.links.join('|'),nl=(n.links||[]).join('|');
    if(bl!==nl){issues.push(id+': LINK SET CHANGED ('+b.links.length+'->'+(n.links||[]).length+')');fail++;continue;}
    if(n.merm!==b.merm){issues.push(id+': mermaid count '+b.merm+'->'+n.merm);fail++;continue;}
    pass++;
  }
  console.log('PASS '+pass+' / FAIL '+fail+' (of '+Object.keys(base).length+')');
  if(issues.length)console.log(issues.slice(0,30).join('\n'));else console.log('✅ ALL identical — content + links + diagrams preserved, only the view changed.');
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
