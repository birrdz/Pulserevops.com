// Print a blob field (for auditing). node _blobcat.js <id> <field>
const fs=require('fs');const path=require('path');
try{const e=fs.readFileSync(path.join(__dirname,'.env.local'),'utf8');for(const l of e.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'')}}catch(e){}
const {getStore}=require('@netlify/blobs');
const id=process.argv[2],field=process.argv[3]||'answer';
(async()=>{const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN});const b=await s.get('answers/'+id+'.json',{type:'json'});if(!b){console.log('(no blob)');return;}console.log(String(b[field]==null?'(empty '+field+')':b[field]));})().catch(e=>console.log('ERR '+e.message));
