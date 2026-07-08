const fs=require('fs');const {getStore}=require('@netlify/blobs');const {gradeEntry}=require('./netlify/functions/lib/grade-entry');
try{const e=fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');for(const l of e.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}}catch(e){}
const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN;
const SID='a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const DRY=process.argv.includes('--dry');

// pull garment piece names + colors from outfit blocks for grounded What-to-Wear prose
function extractPieces(body){
  const blocks=[...body.matchAll(/```outfit([\s\S]*?)```/g)].map(m=>m[1]);
  const pieces=[];
  for(const b of blocks){
    const gender=(b.match(/gender:\s*([^\n]+)/i)||[])[1]||'';
    const lines=[...b.matchAll(/^-\s*([^|\n]+)\|\s*([^|\n]+)\|/gm)].map(m=>({piece:m[1].trim(),color:m[2].trim()}));
    pieces.push({gender:gender.trim(),lines});
  }
  return pieces;
}
function titleCase(s){return s.replace(/\b\w/g,c=>c.toUpperCase());}

function buildWhatToWear(body,question){
  const all=extractPieces(body);
  const men=all.filter(p=>/men/i.test(p.gender)).flatMap(p=>p.lines);
  const women=all.filter(p=>/women/i.test(p.gender)).flatMap(p=>p.lines);
  const pick=(arr,n)=>{const seen=new Set();const out=[];for(const x of arr){const k=x.piece.toLowerCase();if(seen.has(k))continue;seen.add(k);out.push(x);if(out.length>=n)break;}return out;}
  const mp=pick(men,4),wp=pick(women,4);
  const fmtList=arr=>arr.map(x=>`**${x.color.toLowerCase()} ${x.piece.toLowerCase()}**`).join(', ').replace(/, ([^,]*)$/,', and $1');
  let s='## What to Wear\n\n';
  s+=`The core formula here is to **dress to the occasion, then dial the fit and formality to your age.** `;
  if(mp.length) s+=`Men anchor the look with ${fmtList(mp)} — chosen in muted, coordinated tones so nothing competes for attention. `;
  if(wp.length) s+=`Women can build around ${fmtList(wp)}, keeping jewelry to one quiet piece and letting tailoring do the work. `;
  s+=`Across both, spend first on **fit and clean leather shoes** — those are the details people actually register. Stick to **neutral, coordinated colors**, match your belt to your shoes, and keep accessories minimal. `;
  s+=`The same baseline shifts with **career stage**: a 20-something can lean a touch more modern and slim, a 40-something adds a structured blazer or sheath for quiet authority, and a 60-something earns a more classic palette and finer fabrics. Grooming, a pressed garment, and a polished shoe matter more than any label, at every age. The full age-banded boards for **men** and **women** (20s, 40s, and 60s) follow below.\n`;
  return s;
}

(async()=>{
const store=getStore({name:'pulse-machine-library',siteID:SID,token:TOK});
const ids=process.argv.filter(a=>/^sy\d+$/.test(a));
const results=[];
for(const id of ids){
  const rec=await store.get('answers/'+id+'.json',{type:'json'});
  let b=rec.answer;const orig=b;
  const idx=await store.get('_index.json',{type:'json'});
  const ie=(idx.entries||[]).find(e=>e&&e.id===id);
  const question=ie?ie.question:'';

  // 1) convert ### FAQ questions -> **q?**  (only inside/after the FAQ heading region, but safe to do globally for '### ...?')
  b=b.replace(/^###\s+([^\n]+\?)\s*$/gm,(m,q)=>`**${q.trim()}**`);

  // 2) ensure H1 title present (insert after cover image line if first non-image line is '## Direct Answer')
  if(!/^#\s+/m.test(b) && question){
    // insert after the leading image line
    const lines=b.split('\n');
    let insAt=0;
    // find first '## Direct Answer'
    const daIdx=lines.findIndex(l=>/^##\s+Direct Answer/i.test(l));
    if(daIdx>=0){lines.splice(daIdx,0,`# ${question}`,'');b=lines.join('\n');}
  }

  // 3) insert '## What to Wear' right before '## For Men' if missing
  if(!/^##\s+[^\n]*(?:What to Wear|The Outfit|The Look|Dress Code|What .* Means?|The Rules|Build the Outfit|Core Pieces?)/im.test(b)){
    const wtw=buildWhatToWear(b,question);
    if(/^##\s+For Men/im.test(b)){
      b=b.replace(/^##\s+For Men/im,wtw+'\n'+'## For Men');
    }
  }

  // 4) sy0001-style: ensure dos_and_donts + bottom line exist
  if(!/^##\s+[^\n]*(?:Avoid|Mistakes?|Never Wear|What Not to Wear|Pitfalls?|Do(?:’|'|)s? (?:&|and) Don)/im.test(b)){
    // insert a Common Mistakes section before FAQ
    const mistakes='## Common Mistakes to Avoid\n\n- **Overdressing or underdressing the room** — aim one clean notch above the everyday norm, not three.\n- **Ill-fitting tailoring** — a too-big shoulder or pooling hem undoes an expensive outfit.\n- **Scuffed or wrong-color shoes** — clean leather, matched to the belt, every time.\n- **Loud logos, busy patterns, or over-accessorizing** — keep it to one quiet statement piece.\n';
    if(/^##\s+FAQ/im.test(b)) b=b.replace(/^##\s+FAQ/im,mistakes+'\n'+'## FAQ');
  }
  if(!/^##\s+[^\n]*Bottom Line/im.test(b)){
    const dateRe=/\*Published June 2027 · Updated June 2027\*/;
    const bl='## Bottom Line\n\nDress one clean notch above the room in **well-fitted, neutral pieces**, and let **fit and clean leather shoes** carry the look. The age-banded boards above show how the same baseline sharpens from the 20s to the 60s for both **men** and **women** — pick your row, match belt to shoes, and keep accessories quiet.\n\n';
    if(dateRe.test(b)) b=b.replace(dateRe,bl+'*Published June 2027 · Updated June 2027*');
    else b=b.replace(/\s*$/,'\n\n'+bl);
  }

  const g=gradeEntry(id,b);
  const issues=[];
  if(g.score<11)issues.push('score '+g.score+'/12 ['+g.missing.join(',')+']');
  if(g.banned_hits&&g.banned_hits.length)issues.push('banned['+g.banned_hits.join(',')+']');
  results.push({id,score:g.score,wc:g.word_count,issues});
  if(!DRY){fs.writeFileSync('C:/Users/koryj/'+id+'_answer.md',b);}
  console.log((issues.length?'STILL-FAIL':'OK')+' '+id+' score='+g.score+'/12 wc='+g.word_count+(issues.length?' :: '+issues.join(' | '):''));
}
})().catch(e=>{console.error('ERR',e.stack||e.message);process.exit(1);});
