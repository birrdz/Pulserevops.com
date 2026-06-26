const sharp=require('sharp');
(async()=>{
  for(const [name,src] of [['sports','C:/Users/koryj/Downloads/1781649166663.png'],['kpi','C:/Users/koryj/Downloads/1781649142215.png']]){
    const m=await sharp(src).metadata();
    for(const th of [8,18,30]){
      try{
        const buf=await sharp(src).trim({threshold:th}).toBuffer({resolveWithObject:true});
        console.log(name,'orig',m.width+'x'+m.height,'| trim@'+th,'->',buf.info.width+'x'+buf.info.height,'(aspect '+(buf.info.width/buf.info.height).toFixed(2)+')');
      }catch(e){console.log(name,'trim@'+th,'ERR',e.message);}
    }
  }
})().catch(e=>{console.error(e.message);process.exit(1);});
