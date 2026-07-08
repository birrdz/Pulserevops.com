// _spider_verify.js — AUDITOR for the SEO back-end (owner 4444 2026-06-29: "make sure all
// auditors/supervisors double-check the spider work is done correctly"). Samples the most
// recently auto-fixed pages (from the fixer logs), then for each fetches the LIVE rendered page
// and confirms the fix is actually present on-site — not just in the blob. Prints a summary line
// "VERIFY pass=N fail=M" that the self-heal loop records to the /seo changelog.
// Run: node _spider_verify.js [sampleN]
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local','utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const store = getStore({ name:'pulse-machine-library', siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN });
const SITE = 'https://pulserevops.com';
const N = parseInt(process.argv[2]||'12',10);
const WD = 'C:/Users/koryj/website';
function recentIds(logFile, n){ // pull the latest "✓ <id>" ids from a fixer log
  try { const lines = fs.readFileSync(WD+'/'+logFile,'utf8').trim().split(/\r?\n/); const ids=[];
    for (let i=lines.length-1;i>=0 && ids.length<n;i--){ const m=lines[i].match(/✓\s+([a-z]{1,4}\d[\w-]*)/i); if(m && !ids.includes(m[1])) ids.push(m[1]); }
    return ids; } catch(e){ return []; }
}
const get = async url => { try { const r = await fetch(url,{redirect:'follow'}); return { status:r.status, html: await r.text() }; } catch(e){ return { status:0, html:'' }; } };
const hasFAQlive = h => /<h[1-4][^>]*>\s*((\d+|[ivxlc]+)[.)]\s*)?(FAQ|Frequently Asked)/i.test(h) || /id="faq"/i.test(h);
const hasMermLive = h => /class="[^"]*mermaid/i.test(h) || /```mermaid/.test(h) || /<pre[^>]*mermaid/i.test(h);
(async()=>{
  const jobs = [
    ...recentIds('_faq_autofix.out.log', Math.ceil(N/3)).map(id=>({id,kind:'faq'})),
    ...recentIds('_mermaid_autofix.out.log', Math.ceil(N/3)).map(id=>({id,kind:'merm'})),
    ...recentIds('_h1_autofix.out.log', Math.ceil(N/3)).map(id=>({id,kind:'h1'})),
  ].slice(0,N);
  if (!jobs.length){ console.log('VERIFY pass=0 fail=0 (nothing recently fixed to check)'); return; }
  let pass=0, fail=0;
  for (const j of jobs){
    const e = await store.get('answers/'+j.id+'.json',{type:'json'}).catch(()=>null);
    const { status, html } = await get(SITE+'/knowledge/'+j.id);
    let ok=false, why='';
    if (status!==200){ why='status '+status; }
    else if (j.kind==='faq'){ ok = hasFAQlive(html); why = ok?'FAQ present':'no FAQ on live page'; }
    else if (j.kind==='merm'){ ok = hasMermLive(html); why = ok?'mermaid present':'no mermaid on live page'; }
    else if (j.kind==='h1'){ const want=(e&&e.h1||'').trim(); ok = want && html.includes(want.replace(/&/g,'&amp;')); why = ok?'unique H1 live':'H1 override not live'; }
    if (ok) pass++; else fail++;
    console.log(`${ok?'PASS':'FAIL'} ${j.kind} ${j.id} — ${why}`);
  }
  console.log(`VERIFY pass=${pass} fail=${fail}`);
})().catch(e=>{ console.log('VERIFY pass=0 fail=0 (verifier error: '+e.message+')'); });
