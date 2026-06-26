const fs=require('fs');
const sharp=require('sharp');
const CAP='<pattern id="capStripe" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="22" height="22" fill="#C0531F"/><rect y="11" width="22" height="11" fill="#F7F3EA"/></pattern>';
const MARK='<g fill="none" stroke="#C0531F" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"><path d="M490 214 C560 214 624 268 624 344 C624 404 590 446 556 472 L424 472 C390 446 356 404 356 344 C356 268 420 214 490 214 Z"/><path d="M466 452 L466 360 C466 330 514 330 514 360 L514 452"/><path d="M490 176 v-30 M404 210 l-22 -22 M576 210 l22 -22 M348 322 h-30 M632 322 h30"/></g><path d="M430 478 L550 478 L544 502 L436 502 Z" fill="url(#capStripe)"/><g fill="none" stroke="#C0531F" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"><path d="M430 478 L550 478 L544 502 L436 502 Z"/><path d="M440 514 h100 M444 530 h92"/><path d="M470 544 q20 26 40 0"/></g>';
function iconSvg(bg){return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs>'+CAP+'</defs>'+(bg?'<rect width="512" height="512" fill="'+bg+'"/>':'')+'<g transform="translate(256,256) scale(0.92) translate(-490,-361)">'+MARK+'</g></svg>';}
fs.writeFileSync('icon-512.svg', iconSvg('#EBE9DE'));
fs.writeFileSync('icon-192.svg', iconSvg('#EBE9DE'));
fs.writeFileSync('pulse-icon.svg', iconSvg('#EBE9DE'));
fs.writeFileSync('pulse-mark.svg', iconSvg(null));
(async()=>{
  const tan=iconSvg('#EBE9DE');
  await sharp(Buffer.from(tan)).resize(512,512).png().toFile('icon-512.png');
  await sharp(Buffer.from(tan)).resize(192,192).png().toFile('icon-192.png');
  await sharp(Buffer.from(tan)).resize(180,180).png().toFile('apple-touch-icon.png');
  await sharp(Buffer.from(tan)).resize(512,512).png().toFile('pulse-icon.png');
  // full logo raster (transparent)
  await sharp('pulse-logo.svg').resize({width:1500}).png().toFile('pulse-logo.png');
  // OG: tan 1200x630 with logo centered
  const logoBuf=await sharp('pulse-logo.svg').resize({width:1060}).png().toBuffer();
  await sharp({create:{width:1200,height:630,channels:4,background:'#EBE9DE'}}).composite([{input:logoBuf,gravity:'center'}]).png().toFile('pulse-og.png');
  console.log('icons+png done');
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
