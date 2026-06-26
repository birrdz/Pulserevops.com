const fs=require('fs');
const existing=new Set(fs.readFileSync('C:/Users/koryj/_ca_titles.txt','utf8')
  .split('\n').map(l=>l.replace(/^ca\d+:\s*/,'').trim().toLowerCase().replace(/\s+/g,' ')));
const norm=t=>t.trim().toLowerCase().replace(/\s+/g,' ');
const cats=[
 ['Coupes','coupes'],['Crossover SUVs','crossover-suvs'],['Family SUVs','family-suvs'],
 ['Affordable Cars','affordable-cars'],['Luxury EVs','luxury-evs'],['Affordable EVs','affordable-evs'],
 ['Plug-In Hybrids','plug-in-hybrids'],['Roadsters','roadsters'],['Grand Tourers','grand-tourers'],
 ['Compact Pickup Trucks','compact-pickups'],['Work Trucks','work-trucks'],['Fuel-Efficient Cars','fuel-efficient-cars'],
 ['7-Seater SUVs','7-seater-suvs'],['Performance SUVs','performance-suvs'],['Luxury Pickup Trucks','luxury-pickups'],
 ['Hybrid Trucks','hybrid-trucks'],['Electric Minivans','electric-minivans'],['Hydrogen Cars','hydrogen-cars'],
 ['Economy Cars','economy-cars'],['Cars for Teens','cars-for-teens'],['Cars for Seniors','cars-for-seniors'],
 ['First Cars','first-cars'],['Commuter Cars','commuter-cars'],['AWD Cars','awd-cars'],
 ['Hybrid Hatchbacks','hybrid-hatchbacks'],['Family Sedans','family-sedans'],['Two-Row SUVs','two-row-suvs'],
 ['Luxury Minivans','luxury-minivans'],['Electric Hatchbacks','electric-hatchbacks'],['Hybrid Minivans','hybrid-minivans'],
 ['Coupe SUVs','coupe-suvs'],['Full-Size Sedans','full-size-sedans'],['Compact Cars','compact-cars'],
 ['Off-Road Trucks','off-road-trucks']
];
const years=[2027,2026,2025];
const q=[]; let n=215;
for(const y of years){ for(const [cat,slug] of cats){
  const title=`Top 10 ${cat} ${y} — Best Overall + Best Value`;
  if(existing.has(norm(title))){ console.log('DUP SKIP',title); continue; }
  q.push({id:'ca'+String(n).padStart(4,'0'),title,slug,cat,year:y});
  n++;
  if(q.length>=100) break;
}
 if(q.length>=100) break;
}
fs.writeFileSync('C:/Users/koryj/_ca_sprint_queue.json',JSON.stringify(q,null,2));
console.log('queue length',q.length,'| first',q[0].id,q[0].title,'| last',q[q.length-1].id,q[q.length-1].title);
