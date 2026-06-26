const fs=require('fs');
const files=['knowledge.html','sales-trainings.html','industry-kpis.html','tech-stacks.html','sales-book-summaries.html','electronic-reviews.html','revenue-architecture.html','go-to-market-playbooks.html','franchises.html','sports.html','cars.html'];
for(const f of files){
  let s=fs.readFileSync(f,'utf8');const o=s;
  s=s.replace(/--bg:#[0-9A-Fa-f]{6}/,'--bg:#FFFFFF');
  s=s.replace(/body\{background-color:#[0-9A-Fa-f]{6};background-image:radial-gradient\(rgba\([^)]*\)[^;]*;background-size:26px 26px\}/,'body{background-color:#FFFFFF;background-image:none}');
  s=s.replace(/\.hdr\{background:rgba\(\d+,\d+,\d+,\.92\)/,'.hdr{background:rgba(255,255,255,.94)');
  s=s.replace(/--s1:#[0-9A-Fa-f]{6}/,'--s1:#F5F5F5');
  if(s!==o){fs.writeFileSync(f,s);console.log('whitened',f);}else{console.log('NO-CHANGE',f);}
}
