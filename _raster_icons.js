const sharp=require('sharp');const fs=require('fs');
(async()=>{
  const svg=fs.readFileSync('pulse-app-icon.svg');
  for(const sz of [192,512,180]){
    const name = sz===180?'apple-touch-icon.png':('icon-'+sz+'.png');
    await sharp(svg,{density:300}).resize(sz,sz).png().toFile(name);
    console.log('wrote',name,sz+'x'+sz);
  }
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
