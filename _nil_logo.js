// Add the team logo to NIL sports entries. Usage: node _nil_logo.js st94 st95 ...
// For each id: extract the team from the title ("... FOR <Team> D1 ..."), fetch a
// real team logo via Serper Google Images, prepend it as a standalone image, save
// the blob, IndexNow-ping, and email the owner.
const fs = require('fs');
const { getStore } = require('@netlify/blobs');

function env(k){ try{ const m=fs.readFileSync('C:/Users/koryj/website/.env.local','utf8').match(new RegExp('^'+k+'=(.+)$','m')); return m?m[1].trim():''; }catch(e){return '';} }
const SERPER = env('SERPER_API_KEY');
const TOKEN = env('NETLIFY_AUTH_TOKEN');
const RESEND = env('resendapikey') || env('RESEND_API_KEY');
const store = getStore({ name:'pulse-machine-library', siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token:TOKEN });

async function headOk(u){ try{ const r=await fetch(u,{method:'HEAD',redirect:'follow',signal:AbortSignal.timeout(9000)}); return r.ok && (r.headers.get('content-type')||'').toLowerCase().startsWith('image/'); }catch(e){return false;} }
async function logoFor(team){
  const r = await fetch('https://google.serper.dev/images',{method:'POST',headers:{'X-API-KEY':SERPER,'Content-Type':'application/json'},body:JSON.stringify({q:team+' college athletics logo'}),signal:AbortSignal.timeout(20000)});
  const d = await r.json();
  const imgs = (d.images||[]);
  for (const c of imgs.slice(0,8)){ if(c.imageUrl && await headOk(c.imageUrl)) return {img:c.imageUrl, src:c.link||''}; }
  return {img:'',src:''};
}
async function email(sub,html){ if(!RESEND) return; try{ await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+RESEND,'Content-Type':'application/json'},body:JSON.stringify({from:'onboarding@resend.dev',to:['koryjordanwhite@gmail.com'],subject:sub,html})}); }catch(e){} }

(async()=>{
  const ids = process.argv.slice(2);
  let n=0;
  for (const id of ids){
    const e = await store.get('answers/'+id+'.json',{type:'json'});
    if(!e || !e.answer){ console.log(id,'NO ENTRY'); continue; }
    const m = (e.question||'').match(/FOR\s+(.+?)\s+D1/i);
    const team = m ? m[1].trim() : (e.question||'').replace(/2027 NIL.*/i,'').trim();
    const { img, src } = await logoFor(team);
    if(!img){ console.log(id,'no logo for',team); await email(`PULSE NIL logo: ${id} - no logo found`,`<p>${id} (${team}): no verified logo found.</p>`); continue; }
    // strip any existing leading standalone image, then prepend the logo
    let body = e.answer.replace(/^\s*!\[[^\]]*\]\([^)]*\)\s*\n/,'');
    body = `![${team} athletics logo](${img})\n\n` + body.replace(/^\n+/,'');
    e.answer = body; e.ts = Date.now(); e.polished_at = Date.now();
    await store.setJSON('answers/'+id+'.json', e);
    try{ await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:'pulsemachine-writer-2026',id})}); }catch(_){}
    n++;
    console.log(id,'OK -',team,'->',img.slice(0,70));
    await email(`PULSE NIL logo: ${id} done (${n}/${ids.length})`,`<p><b>${id}</b> - ${team} logo added.</p><p>${img}</p><p>https://pulserevops.com/sales-trainings/${id}</p>`);
  }
  console.log('DONE',n,'of',ids.length);
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
