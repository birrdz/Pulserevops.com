const sharp=require('sharp');const fs=require('fs');
const src=process.argv[2],out=process.argv[3];
(async()=>{
  const {data,info}=await sharp(src).extract({left:3,top:3,width:6,height:6}).raw().toBuffer({resolveWithObject:true});
  let r=0,g=0,b=0,n=info.width*info.height;
  for(let i=0;i<data.length;i+=info.channels){r+=data[i];g+=data[i+1];b+=data[i+2];}
  const hex='#'+[r,g,b].map(v=>Math.round(v/n).toString(16).padStart(2,'0')).join('');
  const buf=await sharp(src).trim({threshold:20}).toBuffer();
  const i2=await sharp(buf).resize({width:1280,withoutEnlargement:true}).png({compressionLevel:9}).toFile(out);
  console.log(out,'->',i2.width+'x'+i2.height,'| bg',hex,'|',Math.round(fs.statSync(out).size/1024)+'KB');
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
