const fs = require('fs');
const md = fs.readFileSync('C:/Users/koryj/website/lab/_gold_q1863_v2.md', 'utf8');
const wc = md.trim().split(/\s+/).length;
const m = (re) => (md.match(re) || []).length;
console.log('WORD COUNT:', wc);
console.log('CHARS:', md.length);
console.log('1 Direct Answer H3:', m(/^### Direct Answer/m));
console.log('2 TL;DR:', m(/TL;DR/));
console.log('3 H2 sections:', m(/^## /gm));
const subs = (md.match(/^### (\d+\.\d+)/gm) || []).map(s => s.replace('### ',''));
console.log('4 numbered subsections:', subs.length, '->', subs.join(','));
console.log('5 bold-lead:', m(/\*\*[^*]+\*\*/g), 'bold spans');
console.log('6 tickers (NYSE/NASDAQ/OTC):', m(/\((NYSE|NASDAQ|OTC):/g));
console.log('7 mermaid blocks:', m(/```mermaid/g));
console.log('8 pipe table separator rows:', m(/^\|[\s|:-]+\|\s*$/gm));
console.log('9 Counter-Case section:', m(/^## Counter-Case/m));
const links = [...new Set((md.match(/\(q\d+\)/g) || []))];
console.log('10 unique cross-links:', links.length, '->', links.join(' '));
console.log('   wiki brackets [[:', m(/\[\[q/g));
console.log('   comma-grouped:', m(/\(q\d+\s*,/g));
console.log('   citations:', m(/^\d+\.\s+\*\*/gm));
// check sequencing
let ok = true;
const groups = {};
subs.forEach(s => { const [a,b] = s.split('.').map(Number); (groups[a]=groups[a]||[]).push(b); });
Object.keys(groups).forEach(g => {
  const arr = groups[g];
  for (let i=0;i<arr.length;i++){ if(arr[i]!==i+1){ ok=false; console.log('SEQ GAP in section',g,arr);} }
});
console.log('SEQUENCING OK:', ok);
// mermaid label char check
const mer = md.match(/```mermaid([\s\S]*?)```/);
if (mer) {
  const bad = mer[1].match(/\[[^\]]*[%/][^\]]*\]/g);
  console.log('MERMAID bad-char labels:', bad ? bad.join(' | ') : 'none');
}
