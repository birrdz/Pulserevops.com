const fs=require('fs');
const sl=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const pilot=new Set(['top 10 bowrider boats 2027','top 10 pontoon boats 2027','top 10 center console boats 2027','top 10 cabin cruiser boats 2027','top 10 fishing boats 2027','top 10 deck boats 2027','top 10 wakeboard boats 2027','top 10 pontoon boats 2026','top 10 center console boats 2026','top 10 yachts 2027']);
const types=['Bass Boats','Jet Boats','Aluminum Fishing Boats','Bay Boats','Cuddy Cabin Boats','Walkaround Boats','Sailboats','Power Catamarans','Trawlers','Houseboats','Express Cruisers','Dual Console Boats','Ski Boats','Flats Boats','Saltwater Fishing Boats','Runabout Boats','Inflatable Boats','Performance Boats','Day Cruisers','Sport Fishing Boats','Offshore Fishing Boats','Center Console Boats','Pontoon Boats','Bowrider Boats','Fishing Boats','Deck Boats','Wakeboard Boats','Cabin Cruiser Boats','Yachts','Aluminum Bass Boats'];
const years=['2027','2026','2025'];
const cats=['Top 10 Best Boats for Families 2027|best-family-boats-2027','Top 10 Best Boats for Beginners 2027|best-beginner-boats-2027','Top 10 Best Boats Under $50,000 2027|best-boats-under-50k','Top 10 Best Pontoon Boat Brands 2027|best-pontoon-brands','Top 10 Best Boat Brands 2027|best-boat-brands-2027','Top 10 Best Saltwater Fishing Boats 2027|best-saltwater-fishing-2027','Top 10 Best Boats for Watersports 2027|best-watersports-boats-2027','Top 10 Best Affordable Boats 2027|best-affordable-boats-2027','Top 10 Best Lake Boats 2027|best-lake-boats-2027','Top 10 Best Center Console Brands 2027|best-center-console-brands'];
const q=[];
for(const y of years){ for(const t of types){ const title='Top 10 '+t+' '+y; if(pilot.has(title.toLowerCase()))continue; q.push({title,slug:sl(t+'-'+y)}); if(q.length>=90)break; } if(q.length>=90)break; }
for(const c of cats){ const [t,s]=c.split('|'); q.push({title:t,slug:s}); }
const out=q.slice(0,100).map((e,k)=>({id:'bt'+String(11+k).padStart(4,'0'),title:e.title,slug:e.slug}));
fs.writeFileSync('C:/Users/koryj/_bt_sprint_queue.json',JSON.stringify(out,null,2));
console.log('boats queue:',out.length,'| first 6:',out.slice(0,6).map(e=>e.id+' '+e.title).join(' | '));
