const fs=require('fs'), sharp=require('sharp');
const WD='C:/Users/koryj/website';
for(const l of fs.readFileSync(WD+'/.env.local','utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
let searchRealPhoto=null; try{({searchRealPhoto}=require(WD+'/netlify/functions/lib/img-search-lib'));}catch(e){console.log('lib fail',e.message);}
const S=760;
function overlaySVG(S){return Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="'+S+'" height="'+S+'"><defs><radialGradient id="v" cx="0.5" cy="0.45" r="0.95"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.26"/></radialGradient><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.12"/></feComponentTransfer></filter></defs><rect width="'+S+'" height="'+S+'" fill="#6b4a1e" opacity="0.08"/><rect width="'+S+'" height="'+S+'" fill="url(#v)"/><rect width="'+S+'" height="'+S+'" filter="url(#grain)" opacity="0.42"/></svg>');}
async function grab(u){try{const r=await fetch(u,{signal:AbortSignal.timeout(30000)});if(!(r.ok&&(r.headers.get('content-type')||'').startsWith('image')))return null;const b=Buffer.from(await r.arrayBuffer());return b.length>3000?b:null;}catch(e){return null;}}
const jobs=[['distinguished older male fractional chief revenue officer executive portrait','hire-cro'],['fractional CRO revenue operations strategy meeting','samp-cro'],['saltwater reef aquarium tank','samp-aq']];
(async()=>{
  if(!fs.existsSync(WD+'/assets/_samples'))fs.mkdirSync(WD+'/assets/_samples',{recursive:true});
  for(const [q,name] of jobs){
    try{
      const pk=await searchRealPhoto(q,name,{skipRefine:true});
      if(!pk||!pk.img){console.log('no photo for',name);continue;}
      const img=await grab(pk.img);
      if(!img){console.log('grab fail',name);continue;}
      const base=await sharp(img).resize(S,S,{fit:'cover',position:'centre'}).modulate({saturation:1.07,brightness:1.16}).toBuffer();
      await sharp(base).composite([{input:overlaySVG(S)}]).jpeg({quality:84,mozjpeg:true}).toFile(WD+'/assets/_samples/'+name+'.jpg');
      console.log('SAVED',name,fs.statSync(WD+'/assets/_samples/'+name+'.jpg').size+'B  src:',pk.img.slice(0,60));
    }catch(e){console.log('err',name,e.message);}
  }
})();
