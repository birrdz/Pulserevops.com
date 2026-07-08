const fs=require('fs'), sharp=require('sharp');
const WD='C:/Users/koryj/website';
for(const l of fs.readFileSync(WD+'/.env.local','utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
let searchRealPhoto=null; try{({searchRealPhoto}=require(WD+'/netlify/functions/lib/img-search-lib'));}catch(e){console.log('lib fail',e.message);}
const S=760;
// DATED / VINTAGE overlay: warm sepia wash + strong vignette + heavy film grain + faded corners.
function datedSVG(S){return Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="'+S+'" height="'+S+'">'+
  '<defs>'+
  '<radialGradient id="v" cx="0.5" cy="0.44" r="0.9"><stop offset="0.42" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#1a0f02" stop-opacity="0.5"/></radialGradient>'+
  '<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.22"/></feComponentTransfer></filter>'+
  '</defs>'+
  '<rect width="'+S+'" height="'+S+'" fill="#7a5320" opacity="0.2"/>'+       // warm sepia wash
  '<rect width="'+S+'" height="'+S+'" fill="#efe2c4" opacity="0.1"/>'+        // faded cream lift
  '<rect width="'+S+'" height="'+S+'" fill="url(#v)"/>'+                       // heavy vintage vignette
  '<rect width="'+S+'" height="'+S+'" filter="url(#grain)" opacity="0.6"/>'+  // heavy film grain
  '</svg>');}
async function grab(u){try{const r=await fetch(u,{signal:AbortSignal.timeout(30000)});if(!(r.ok&&(r.headers.get('content-type')||'').startsWith('image')))return null;const b=Buffer.from(await r.arrayBuffer());return b.length>3000?b:null;}catch(e){return null;}}
async function dated(img,out){
  const base=await sharp(img)
    .resize(S,S,{fit:'cover',position:'centre'})
    .modulate({saturation:0.64,brightness:1.04})   // muted, slightly lifted
    .tint({r:255,g:238,b:206})                       // warm aged cast
    .gamma(1.12)                                     // faded contrast
    .toBuffer();
  await sharp(base).composite([{input:datedSVG(S)}]).jpeg({quality:82,mozjpeg:true}).toFile(out);
}
const jobs=[['saltwater reef aquarium tank','dated-aq'],['classic vintage muscle car','dated-car'],['small charming american main street town','dated-town']];
(async()=>{
  if(!fs.existsSync(WD+'/assets/_samples'))fs.mkdirSync(WD+'/assets/_samples',{recursive:true});
  for(const [q,name] of jobs){
    try{
      const pk=await searchRealPhoto(q,name,{skipRefine:true});
      if(!pk||!pk.img){console.log('no photo',name);continue;}
      const img=await grab(pk.img); if(!img){console.log('grab fail',name);continue;}
      await dated(img, WD+'/assets/_samples/'+name+'.jpg');
      console.log('SAVED',name,fs.statSync(WD+'/assets/_samples/'+name+'.jpg').size+'B');
    }catch(e){console.log('err',name,e.message);}
  }
})();
