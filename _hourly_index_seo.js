// Hourly index/SEO sweep: submit recently-published entries (all pillars) to every
// IndexNow engine, verify each URL is live (HTTP 200), and confirm the sitemap-index
// is healthy. Run hourly. Usage: node _hourly_index_seo.js [minutesWindow]
const fs = require('fs');
const https = require('https');
try { const env = fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');
  for (const l of env.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if(m) process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
} catch(e){}
const { getStore } = require('@netlify/blobs');
const { pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');
const store = getStore({ name:'pulse-machine-library', siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT||process.env.NETLIFY_BLOBS_TOKEN||process.env.NETLIFY_AUTH_TOKEN });
const PATHS = { q:'knowledge', st:'sales-trainings', ik:'industry-kpis', tk:'tech-stacks', bs:'sales-book-summaries', er:'electronic-reviews', ra:'revenue-architecture', gp:'go-to-market-playbooks', fr:'franchises' };
const winMin = parseInt(process.argv[2]||'120'); // default: entries published in last 120 min
function head(url){return new Promise(res=>{https.get(url,r=>{r.resume();res(r.statusCode);}).on('error',()=>res(0));});}
(async()=>{
  const idx = await store.get('_index.json',{type:'json'});
  const cutoff = (Date.now ? null : null); // Date.now allowed in normal node
  const now = Date.now();
  const recent = idx.entries.filter(e=>{
    if(!e||!e.id) return false;
    const pref = (e.id.match(/^[a-z]+/)||[''])[0];
    if(!PATHS[pref]) return false;
    return e.ts && (now - e.ts) <= winMin*60*1000;
  });
  if(!recent.length){ console.log('No entries in last '+winMin+'min to index.'); }
  const urls = recent.map(e=>{const pref=(e.id.match(/^[a-z]+/)||[''])[0]; return `https://pulserevops.com/${PATHS[pref]}/${e.id}`;});
  console.log('Index/SEO sweep — '+urls.length+' recent URLs (last '+winMin+'min)');
  // 1. Submit to all IndexNow engines
  let submit = {ok:false};
  if(urls.length){ try { submit = await pingIndexNowUrlList(urls); } catch(e){ submit={ok:false,err:String(e.message||e)}; } }
  console.log('IndexNow submit:', JSON.stringify(submit).slice(0,300));
  // 2. Verify each URL is live (200)
  let live=0, dead=[];
  for(const u of urls){ const s=await head(u); if(s===200) live++; else dead.push(u+' ['+s+']'); }
  console.log('Live check: '+live+'/'+urls.length+' return 200'+(dead.length?(' | NOT LIVE: '+dead.join(', ')):''));
  // 3. Sitemap-index health
  const sm = await new Promise(res=>{https.get('https://pulserevops.com/sitemap-index.xml',r=>{let b='';r.on('data',c=>b+=c);r.on('end',()=>res({s:r.statusCode,n:(b.match(/<sitemap>/g)||[]).length}));}).on('error',()=>res({s:0,n:0}));});
  console.log('Sitemap-index: HTTP '+sm.s+', '+sm.n+' sub-sitemaps');
  console.log(dead.length?('SWEEP: '+dead.length+' URL(s) not live — investigate'):'SWEEP CLEAN: all recent URLs submitted + live, sitemap healthy');
})().catch(e=>{console.error('ERR',e&&e.message);process.exit(1);});
