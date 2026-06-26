// pulse-pillar-counts — real per-pillar totals + last-24h-new counts from
// _index.json, so the pillar filter chips show true counts before any click
// and can highlight pillars that gained entries in the last 24 hours.
let getStore=null; try{ getStore=require('@netlify/blobs').getStore; }catch(e){}
const CORS={'Access-Control-Allow-Origin':'*','Cache-Control':'public, max-age=120','Content-Type':'application/json'};
const SPORTS=/^(sports|nil|football|mbb|wbb|college-sports|college-nil|nil-gtm|nil-business)$/i;
function initStore(){ if(!getStore)return null; const tok=process.env.BLOBS_PAT||process.env.NETLIFY_BLOBS_TOKEN||process.env.NETLIFY_AUTH_TOKEN; const sid=process.env.NETLIFY_SITE_ID||'a2b74b30-a1ac-40e2-9622-aebfc2feb482'; try{ return tok?getStore({name:'pulse-machine-library',siteID:sid,token:tok}):getStore('pulse-machine-library'); }catch(e){ return null; } }
exports.handler=async()=>{
  const s=initStore(); if(!s) return {statusCode:200,headers:CORS,body:JSON.stringify({ok:false,reason:'store'})};
  const idx=(await s.get('_index.json',{type:'json'}))||{entries:[]};
  const entries=idx.entries||[];
  const DAY=86400000, now=Date.now();
  const total={}, new24={}; let sports=0, sportsNew=0;
  for(const e of entries){
    if(!e||!e.id) continue;
    const m=String(e.id).match(/^([a-z]+)\d/i);
    const pfx=m?m[1].toLowerCase():null;
    const fresh=(typeof e.ts==='number') && (now-e.ts)<DAY;
    if(pfx){ total[pfx]=(total[pfx]||0)+1; if(fresh)new24[pfx]=(new24[pfx]||0)+1; }
    if(Array.isArray(e.tags) && e.tags.some(t=>SPORTS.test(String(t)))){ sports++; if(fresh)sportsNew++; }
  }
  total.sports=sports; if(sportsNew)new24.sports=sportsNew;
  total.all=entries.length;
  return {statusCode:200,headers:CORS,body:JSON.stringify({ok:true,total,new24,generatedAt:now})};
};
