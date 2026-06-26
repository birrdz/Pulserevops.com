// One-off structural audit of the last-3-day publishes. Read-only.
const { getStore } = require('@netlify/blobs');
const fs = require('fs');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const env = fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');
for (const l of env.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if(m) process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const store=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:process.env.BLOBS_PAT||process.env.NETLIFY_BLOBS_TOKEN||process.env.NETLIFY_AUTH_TOKEN});

const LAWFLOOR = { fr:1800, tk:1800, q:1200, ik:1200, st:1500, bs:1500, er:1800, ra:1800, gp:1800 };
const norm = s => (s||'').toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();

(async()=>{
  const idx=await store.get('_index.json',{type:'json'});
  const maxTs=Math.max(...idx.entries.filter(e=>e&&e.ts).map(e=>e.ts));
  const cutoff=maxTs-3*86400*1000;
  const recent=idx.entries.filter(e=>e&&e.ts&&e.ts>=cutoff).sort((a,b)=>b.ts-a.ts);

  // sitewide normalized-title map for dup detection
  const allTitles=new Map();
  for(const e of idx.entries){ if(!e) continue; const n=norm(e.question); if(!allTitles.has(n)) allTitles.set(n,[]); allTitles.get(n).push(e.id); }

  const findings=[];
  let done=0;
  for(const e of recent){
    const p=(e.id.match(/^[a-z]+/)||['?'])[0];
    let a; try{ a=await store.get('answers/'+e.id+'.json',{type:'json'}); }catch(err){ findings.push({id:e.id,p,sev:'HIGH',issues:['answer blob unreadable']}); continue; }
    if(!a||!a.answer){ findings.push({id:e.id,p,sev:'HIGH',issues:['missing answer body']}); continue; }
    const b=a.answer; const r=gradeEntry(e.id,b); const iss=[];
    if(r.score<12) iss.push('grade '+r.score+'/12 missing['+r.missing.join(',')+']');
    if(r.banned_hits.length) iss.push('BANNED:'+r.banned_hits.join('|'));
    const floor=LAWFLOOR[p]||1100;
    if(r.word_count<floor) iss.push('words '+r.word_count+'<LAW'+floor);
    // mermaids
    const mm=(b.match(/```mermaid/g)||[]).length;
    if((b.match(/<\/mermaid>/g)||[]).length) iss.push('malformed </mermaid>');
    const needMM = p==='er'?1:2;
    if(mm<needMM) iss.push('mermaids '+mm+'<'+needMM);
    // dateline + footer laws
    if(!/Published .{3,40}·.{0,6}Updated /.test(b)) iss.push('no dateline');
    if(!/review/i.test(b.slice(-700))) iss.push('no review footer');
    // tldr rule: q/st/bs/er/ra/gp/fr must NOT have TLDR; ik/tk SHOULD
    const hasTL=/TL;?DR/i.test(b);
    if(['q','st','bs','er','ra','gp','fr'].includes(p) && hasTL) iss.push('has TLDR (should not)');
    if(['ik','tk'].includes(p) && !hasTL) iss.push('missing TLDR (should have)');
    // title hygiene
    const q=e.question||'';
    if(!/^[A-Z0-9$]/.test(q)) iss.push('title not capitalized');
    if(/\bsaas\b|\brevops\b|\bgtm\b|\bkpi\b|\bcro\b|\bai\b/.test(q)) iss.push('title acronym lowercase');
    if(p==='q' && !/[.?!]$/.test(q.trim())) iss.push('q title no terminal punctuation');
    // sitewide dup
    const dupIds=(allTitles.get(norm(q))||[]).filter(x=>x!==e.id);
    if(dupIds.length) iss.push('DUP-TITLE with '+dupIds.join(','));
    if(iss.length){ const sev = (r.banned_hits.length||dupIds.length||r.score<10||iss.some(x=>/unreadable|missing answer/.test(x)))?'HIGH':(r.score<12||iss.some(x=>/words .*<LAW|malformed|no dateline|no review|TLDR|DUP/.test(x)))?'MED':'LOW';
      findings.push({id:e.id,p,sev,score:r.score,words:r.word_count,issues:iss}); }
    done++;
  }
  // summary
  const clean=recent.length-findings.length;
  console.log('SCANNED',recent.length,'| CLEAN',clean,'| FLAGGED',findings.length);
  const bySev={HIGH:0,MED:0,LOW:0}; for(const f of findings) bySev[f.sev]++;
  console.log('Severity:',JSON.stringify(bySev));
  const byPillarFlag={}; for(const f of findings){byPillarFlag[f.p]=(byPillarFlag[f.p]||0)+1;}
  console.log('Flagged by pillar:',JSON.stringify(byPillarFlag));
  // issue-type frequency
  const freq={}; for(const f of findings) for(const i of f.issues){const k=i.replace(/:.*/,'').replace(/\[.*/,'').replace(/ .*<LAW.*/,' <LAW').replace(/with .*/,'').trim(); freq[k]=(freq[k]||0)+1;}
  console.log('\nISSUE FREQUENCY:'); Object.entries(freq).sort((a,b)=>b[1]-a[1]).forEach(([k,v])=>console.log('  '+v+'  '+k));
  console.log('\n=== HIGH severity ('+bySev.HIGH+') ===');
  findings.filter(f=>f.sev==='HIGH').forEach(f=>console.log(f.id,'['+f.p+'] s'+f.score+' w'+f.words+' :: '+f.issues.join(' ; ')));
  fs.writeFileSync('C:/Users/koryj/_audit_findings.json', JSON.stringify(findings,null,1));
  console.log('\nFull findings -> C:/Users/koryj/_audit_findings.json ('+findings.length+' rows)');
})().catch(e=>{console.error('ERR',e&&e.message);process.exit(1);});
