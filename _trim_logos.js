const sharp=require('sharp');const fs=require('fs');
const map=[
 ['pulse-kpi-logo.png','C:/Users/koryj/Downloads/1781649142215.png'],
 ['pulse-franchises-logo.png','C:/Users/koryj/Downloads/1781649136169.png'],
 ['pulse-sports-logo.png','C:/Users/koryj/Downloads/1781649166663.png'],
 ['pulse-trainings-logo.png','C:/Users/koryj/Downloads/1781649157175.png'],
];
(async()=>{
  for(const [out,src] of map){
    const buf=await sharp(src).trim({threshold:20}).toBuffer();
    const info=await sharp(buf).resize({width:1280,withoutEnlargement:true}).png({compressionLevel:9}).toFile(out);
    console.log(out,'->',info.width+'x'+info.height,Math.round(fs.statSync(out).size/1024)+'KB');
  }
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
