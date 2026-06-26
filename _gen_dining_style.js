// Scoped striped-logo generator for dining (new) + style (refresh). Mirrors
// gen-pillars.js helpers exactly, writes only these two SVGs, then rasterizes
// each to a 1500x810 PNG (entry-renderer hero banners use the .png).
const fs=require('fs');
const sharp=require('sharp');
const STRIPE='<pattern id="ST" width="30" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="30" height="30" fill="#C0531F"/><rect y="15" width="30" height="15" fill="#F7F3EA"/></pattern>';
const FONT="font-family=\"'Plus Jakarta Sans','Trebuchet MS',Verdana,sans-serif\" font-weight=\"800\" letter-spacing=\"-2\"";
const L='fill="none" stroke="#C0531F" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"';
function word(name){const n=name.length;const s=n<=5?156:n<=7?140:n<=9?122:104;return '<g '+FONT+'><text x="806" y="452" font-size="150" fill="#E3C9B8">Pulse</text><text x="800" y="446" font-size="150" fill="#C0531F">Pulse</text><text x="806" y="640" font-size="'+s+'" fill="#E3C9B8">'+name+'</text><text x="800" y="634" font-size="'+s+'" fill="#C0531F">'+name+'</text></g>';}
function build(name,body){return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 810" role="img" aria-label="Pulse '+name+'"><rect width="1440" height="810" fill="#EBE9DE"/><defs>'+STRIPE+'</defs>'+body+word(name)+'</svg>';}

const DINING='<circle cx="565" cy="500" r="92" fill="url(#ST)"/><g '+L+'><circle cx="565" cy="500" r="92"/><circle cx="565" cy="500" r="56" fill="#EBE9DE"/><path d="M436 392 V452 Q436 472 452 472 Q468 472 468 452 V392"/><path d="M452 392 V452"/><path d="M452 472 V628"/><path d="M694 392 Q722 402 722 456 Q722 480 694 480 Z"/><path d="M694 480 V628"/></g>';
const STYLE='<defs><clipPath id="tsS"><path d="M500 430 L540 410 Q565 442 590 410 L630 430 L668 470 L630 506 L618 506 L618 622 L512 622 L512 506 L500 506 L462 470 Z"/></clipPath></defs><rect x="462" y="410" width="206" height="212" fill="url(#ST)" clip-path="url(#tsS)"/><g '+L+'><path d="M500 430 L540 410 Q565 442 590 410 L630 430 L668 470 L630 506 L618 506 L618 622 L512 622 L512 506 L500 506 L462 470 Z"/></g>';

(async()=>{
  const out=[['dining','Dining',DINING],['style','Style',STYLE]];
  for(const [k,name,body] of out){
    const svg=build(name,body);
    fs.writeFileSync('pulse-'+k+'-logo.svg',svg);
    await sharp(Buffer.from(svg)).resize(1500,810,{fit:'contain',background:'#EBE9DE'}).png().toFile('pulse-'+k+'-logo.png');
    console.log('wrote pulse-'+k+'-logo.svg + .png');
  }
})().catch(e=>{console.error(e);process.exit(1);});
