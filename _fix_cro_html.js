'use strict';
const fs = require('fs');
const p = 'C:/Users/koryj/website/index.html';
let t = fs.readFileSync(p, 'utf8');

// Fix broken eyebrow
t = t.replace(
  /FRACTIONAL CRO · MARYLAND-BASED, NATIONWIDE · \$0→<\/span>00M<\/span>/,
  'FRACTIONAL CRO · MARYLAND-BASED, NATIONWIDE · $0→$200M</span>'
);
t = t.replace(
  /FRACTIONAL CRO · MARYLAND-BASED, NATIONWIDE · \$0→<\/span>\$?200M<\/span>/,
  'FRACTIONAL CRO · MARYLAND-BASED, NATIONWIDE · $0→$200M</span>'
);

// Remove stray </a> after SEARCH
t = t.replace(
  /(<a id="pulseSearchSq"[^>]*>SEARCH<\/a>)\s*<\/a>\s*(<div class="cro-bar">)/,
  '$1\n  $2'
);

// Fix orphan CSS outside style: wrap pulseSearchSq rules that appear before <style>.crohdr
t = t.replace(
  /(?:\/\* SEARCH on CRO card \*\/\s*)?#pulseSearchSq\{position:absolute[^}]+\}\s*#pulseSearchSq:hover[^}]+\}[^<]*@media\(max-width:640px\)\{#pulseSearchSq\{[^}]+\}\}\s*<style>\.crohdr\{position:relative;/,
  `<style>
  /* SEARCH on CRO card */
  .crohdr{position:relative}
  #pulseSearchSq{position:absolute;left:14px;bottom:58px;z-index:6;width:64px;height:64px;display:flex;align-items:center;justify-content:center;text-align:center;text-decoration:none;background:#130a10;color:#F6C445;font:800 .68rem/1.05 Georgia,serif;letter-spacing:.1em;border:3px solid #EAC15C;border-radius:0;box-shadow:inset 0 0 0 2px rgba(8,6,4,.92),inset 0 0 0 4px rgba(234,193,92,.6),0 6px 16px rgba(0,0,0,.45);transition:border-color .15s,transform .15s,color .15s}
  #pulseSearchSq:hover,#pulseSearchSq:focus{border-color:#F6C445;color:#fff;transform:translateY(-2px);outline:none}
  @media(max-width:640px){#pulseSearchSq{left:10px;bottom:auto;top:12px;width:56px;height:56px;font-size:.6rem}}
  .crohdr{`
);

fs.writeFileSync(p, t);
console.log({
  eyebrow: t.includes('$0→$200M</span>'),
  strayA: /pulseSearchSq[\s\S]{0,40}<\/a>\s*<\/a>/.test(t),
  searchInCro: /crohdr[\s\S]{0,500}pulseSearchSq[\s\S]{0,200}cro-bar/.test(t),
  cssInStyle: /<style>[\s\S]*#pulseSearchSq\{position:absolute/.test(t)
});
