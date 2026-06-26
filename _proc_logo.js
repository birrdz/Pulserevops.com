const sharp=require('sharp');const fs=require('fs');
const src=process.argv[2],out=process.argv[3];
(async()=>{
  const meta=await sharp(src).metadata();
  const {data,info}=await sharp(src).extract({left:2,top:2,width:6,height:6}).raw().toBuffer({resolveWithObject:true});
  let r=0,g=0,b=0,n=info.width*info.height;
  for(let i=0;i<data.length;i+=info.channels){r+=data[i];g+=data[i+1];b+=data[i+2];}
  r=Math.round(r/n);g=Math.round(g/n);b=Math.round(b/n);
  const hex='#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');
  await sharp(src).resize({width:Math.min(meta.width,1000)}).png({compressionLevel:9}).toFile(out);
  console.log(out,'|',meta.width+'x'+meta.height,'| bg',hex,'|',Math.round(fs.statSync(out).size/1024)+'KB');
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
