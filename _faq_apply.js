// Validates + commits Claude-generated FAQs from faq_gen/<id>.faq.md into the
// live blobs: checks format (>=5 bold-question pairs, no banned words), inserts
// before ## Sources, saves, pings IndexNow, then removes the processed files.
// Usage: node _faq_apply.js
const fs=require('fs');const { getStore }=require('@netlify/blobs');
try{const e=fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');for(const l of e.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}}catch(e){}
const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN});
const DIR='C:/Users/koryj/website/faq_gen';
const hasFAQ=a=>/^#{2,4}\s*(\d+[.)]\s*)?(FAQ|Frequently Asked)/im.test(a);
const BANNED=/\b(delve|tapestry|landscape|holistic|ever-evolving|synerg|paradigm shift|game-changer|cutting-edge|state-of-the-art|seamless integration|drive growth|unlock (value|potential)|needless to say)\b|in today's|it's worth noting|it's important to note/i;
function cleanFaq(text){let t=String(text||'').trim();t=t.replace(/^```(?:markdown)?\s*/i,'').replace(/```\s*$/i,'').trim();const i=t.search(/^##\s*FAQ/im);if(i>0)t=t.slice(i);if(!/^##\s*FAQ/im.test(t))t='## FAQ\n\n'+t;return t.trim();}
function validFaq(faq){if(BANNED.test(faq))return 'banned-word';const pairs=(faq.match(/^\*\*[^*\n]+\?\*\*\s*$/gim)||[]).length;if(pairs<5)return 'only '+pairs+' pairs';return null;}
function insertFaq(body,faq){const b=body.replace(/\s+$/,'');const lines=b.split(/\r?\n/);let at=lines.findIndex(l=>/^#{2,3}\s*Sources\b/i.test(l));if(at<0)at=lines.findIndex(l=>/^#{2,3}\s*Bottom Line\b/i.test(l));if(at<0)return b+'\n\n'+faq+'\n';return lines.slice(0,at).join('\n').replace(/\s+$/,'')+'\n\n'+faq+'\n\n'+lines.slice(at).join('\n');}
async function pingIndexNow(id){try{await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:'pulsemachine-writer-2026',id}),signal:AbortSignal.timeout(8000)});}catch(e){}}
(async()=>{
  const files=fs.readdirSync(DIR).filter(f=>/\.faq\.md$/.test(f));
  console.log('faq files to apply:',files.length);
  let ok=0,bad=0,skip=0;
  for(const f of files){
    const id=f.replace(/\.faq\.md$/,'');
    const faq=cleanFaq(fs.readFileSync(DIR+'/'+f,'utf8'));
    const v=validFaq(faq);
    if(v){bad++;console.log('  INVALID',id,'-',v);continue;}
    const e=await s.get('answers/'+id+'.json',{type:'json'}).catch(()=>null);
    if(!e||!e.answer){bad++;console.log('  no-blob',id);continue;}
    if(hasFAQ(e.answer)){skip++;fs.unlinkSync(DIR+'/'+f);try{fs.unlinkSync(DIR+'/'+id+'.txt');}catch(_){}continue;}
    e.answer=insertFaq(e.answer,faq);e.ts=Date.now();e.polished_at=Date.now();
    await s.setJSON('answers/'+id+'.json',e);
    await pingIndexNow(id);
    ok++;console.log('  +FAQ',id);
    fs.unlinkSync(DIR+'/'+f);try{fs.unlinkSync(DIR+'/'+id+'.txt');}catch(_){}
  }
  console.log(`\nAPPLY DONE. applied=${ok} invalid=${bad} alreadyHad=${skip}`);
})().catch(e=>{console.error('FATAL',e&&e.stack);process.exit(1);});
