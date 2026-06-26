const sharp=require('sharp');const fs=require('fs');
const map=[['pulse-knowledge-logo.png','1781649074741'],['pulse-trainings-logo.png','1781649157175'],['pulse-kpi-logo.png','1781649142215'],['pulse-tech-logo.png','1781649087399'],['pulse-books-logo.png','1781649101961'],['pulse-reviews-logo.png','1781649130296'],['pulse-revenue-logo.png','1781646736969'],['pulse-gtm-logo.png','1781649195390'],['pulse-franchises-logo.png','1781649136169'],['pulse-sports-logo.png','1781649166663'],['pulse-cars-logo.png','1781646585301']];
(async()=>{
 for(const [out,id] of map){
   const src='C:/Users/koryj/Downloads/'+id+'.png';
   const {data,info}=await sharp(src).removeAlpha().raw().toBuffer({resolveWithObject:true});const ch=info.channels;
   for(let i=0;i<data.length;i+=ch){const r=data[i],g=data[i+1],b=data[i+2];const mx=Math.max(r,g,b),mn=Math.min(r,g,b);const lum=0.299*r+0.587*g+0.114*b;if(lum>=232||(mx-mn<26&&lum>200)){data[i]=255;data[i+1]=255;data[i+2]=255;}}
   const white=await sharp(data,{raw:{width:info.width,height:info.height,channels:ch}}).png().toBuffer();
   const i2=await sharp(white).trim({threshold:12,background:'#ffffff'}).resize({width:1280}).flatten({background:'#ffffff'}).png({compressionLevel:9}).toFile(out);
   console.log(out,'->',i2.width+'x'+i2.height);
 }
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
