const { getStore } = require('@netlify/blobs');
const fs = require('fs');
try { const env = fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');
  for (const line of env.split(/\r?\n/)){const m=line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if(m) process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
} catch(e){}
const store=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:process.env.BLOBS_PAT||process.env.NETLIFY_BLOBS_TOKEN||process.env.NETLIFY_AUTH_TOKEN});
const norm = s => (s||'').toLowerCase().replace(/[’']/g,"'").replace(/\s+/g,' ').trim();
const normBrand = s => (s||'').toLowerCase().replace(/[’'`]/g,'').replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').replace(/\b(franchise|business|the|inc|llc|co|company)\b/g,'').replace(/\s+/g,' ').trim();
(async()=>{
  const manifest=require('./_fr_batch_manifest2.json');
  const idx=(await store.get('_index.json',{type:'json'}))||{entries:[]};
  const inIndex=new Set(idx.entries.filter(e=>e&&e.id).map(e=>e.id));
  console.log('Library total index entries:', idx.entries.length);
  let missing=[], titleFails=[], checked=0;
  for(const it of manifest.items){
    if(!inIndex.has(it.id)) missing.push(it.id+'(idx)');
    let rec; try{rec=await store.get('answers/'+it.id+'.json',{type:'json'});}catch(e){}
    if(!rec){missing.push(it.id+'(blob)');continue;}
    checked++;
    if(norm(rec.question)!==norm(it.title)) titleFails.push(`${it.id}: blob="${rec.question}" | manifest="${it.title}"`);
  }
  // internal dup within the 100
  const seen={}; let dups=[];
  for(const it of manifest.items){const k=normBrand(it.title.match(/buy an? (.+?) franchise/)[1]); if(seen[k])dups.push(`${it.id}==${seen[k]}`); else seen[k]=it.id;}
  // dup of new brands vs ALL existing fr (excluding the new 100)
  const newIds=new Set(manifest.items.map(x=>x.id));
  const existBrands=new Set();
  for(const e of idx.entries){ if(!e||!e.id||!/^fr\d+$/.test(e.id)||newIds.has(e.id))continue; const m=(e.question||'').match(/(?:open|buy)(?: or buy)? an? (.+?) (?:franchise|business)/i); if(m) existBrands.add(normBrand(m[1])); }
  let crossDups=[];
  for(const it of manifest.items){const b=normBrand(it.title.match(/buy an? (.+?) franchise/)[1]); if(existBrands.has(b)) crossDups.push(it.id+' ('+it.title.match(/buy an? (.+?) franchise/)[1]+')');}
  console.log('\n=== FINAL VERIFICATION (100 new: fr0824-fr0923) ===');
  console.log('Manifest items   :', manifest.items.length);
  console.log('Found in blob    :', checked);
  console.log('Missing          :', missing.length, missing.join(', '));
  console.log('Title mismatches :', titleFails.length); titleFails.forEach(x=>console.log('   '+x));
  console.log('Internal dups    :', dups.length, dups.join(', '));
  console.log('Cross dups vs existing library:', crossDups.length); crossDups.forEach(x=>console.log('   '+x));
  const pass = missing.length===0 && titleFails.length===0 && dups.length===0 && crossDups.length===0;
  console.log('\nRESULT:', pass?'ALL 100 PASS — 0 missing, 0 mismatch, 0 internal dups, 0 cross-dups':'ISSUES ABOVE');
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
