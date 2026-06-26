const sharp=require('sharp');
(async()=>{
  const src='C:/Users/koryj/Downloads/1781649142215.png';
  const meta=await sharp(src).metadata();
  // sample top-left 4x4 avg for background color
  const {data,info}=await sharp(src).extract({left:2,top:2,width:6,height:6}).raw().toBuffer({resolveWithObject:true});
  let r=0,g=0,b=0,n=info.width*info.height;
  for(let i=0;i<data.length;i+=info.channels){r+=data[i];g+=data[i+1];b+=data[i+2];}
  r=Math.round(r/n);g=Math.round(g/n);b=Math.round(b/n);
  const hex='#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');
  // write optimized version (cap width 1000 for retina), keep as-is otherwise
  const targetW=Math.min(meta.width,1000);
  await sharp(src).resize({width:targetW}).png({quality:90,compressionLevel:9}).toFile('pulse-kpi-logo.png');
  const fs=require('fs');const st=fs.statSync('pulse-kpi-logo.png');
  console.log('source:',meta.width+'x'+meta.height,'| bg color:',hex,'| wrote pulse-kpi-logo.png',targetW+'px',Math.round(st.size/1024)+'KB');
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
