const sharp=require('sharp');const fs=require('fs');
(async()=>{
  const svg=fs.readFileSync('pulse-og.svg');
  await sharp(svg,{density:200}).resize(1200,630,{fit:'contain',background:'#FAF8F4'}).png().toFile('pulse-og.png');
  const st=fs.statSync('pulse-og.png');
  console.log('pulse-og.png written:',Math.round(st.size/1024)+'KB');
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
