const fs=require('fs');let s=fs.readFileSync('netlify.toml','utf8');
const P=[['towns','town'],['schools','school'],['nightlife','nightlife'],['dining','dining'],['boats','boat']];
let block='\n# New Top-10 pillars (Towns/Schools/Nightlife/Dining/Boats) — 2026-06-16\n';
for(const [r,k] of P){
  block+=`[[redirects]]\n  from = "/${r}/:id/reviews"\n  to = "/.netlify/functions/pulse-machine-entry?id=:id&kind=${k}&view=reviews"\n  status = 200\n`;
  block+=`[[redirects]]\n  from = "/${r}/:id/review"\n  to = "/.netlify/functions/pulse-machine-entry?id=:id&kind=${k}&view=reviews"\n  status = 200\n`;
  block+=`[[redirects]]\n  from = "/${r}/:id"\n  to = "/.netlify/functions/pulse-machine-entry?id=:id&kind=${k}"\n  status = 200\n`;
  block+=`[[redirects]]\n  from = "/${r}"\n  to = "/${r}.html"\n  status = 200\n`;
  block+=`[[redirects]]\n  from = "/${r}/"\n  to = "/${r}.html"\n  status = 200\n`;
}
const anchor='  from = "/cars/"\n  to = "/cars.html"\n  status = 200\n';
if(s.includes(anchor) && !s.includes('kind=town')){ s=s.replace(anchor, anchor+block); fs.writeFileSync('netlify.toml',s); console.log('routes appended for 5 pillars'); }
else console.log('anchor missing or already added');
