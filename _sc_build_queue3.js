const fs=require('fs');
const cur=JSON.parse(fs.readFileSync('C:/Users/koryj/_sc_sprint_queue.json','utf8'));
const keep=cur.slice(0,6);
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const mk=(title,sl)=>({title,slug:sl});
const states2=['Ohio','Georgia','North Carolina','Michigan','New Jersey','Virginia','Washington','Massachusetts','Arizona','Indiana'].map(s=>mk(`Top 10 Public High Schools in ${s}`,'public-high-schools-'+slug(s)));
const uStates=['California','Texas','Florida','New York','Ohio','Georgia','North Carolina','Michigan','Virginia','Washington'].map(s=>mk(`Top 10 Public Universities in ${s}`,'public-universities-'+slug(s)));
const privC=['California','New York','Massachusetts','Pennsylvania','Illinois','Ohio','Texas','Georgia'].map(s=>mk(`Top 10 Private Colleges in ${s}`,'private-colleges-'+slug(s)));
const niche=['Forensic Psychology','Sports Psychology','Industrial-Organizational Psychology','Clinical Psychology','Child Development','Marine Biology','Wildlife Conservation','Astrophysics','Game Design','Esports Management','Audio Engineering','Animation','Fashion Design','Interior Design','Industrial Design','Viticulture and Enology','Equine Studies','Maritime and Marine Engineering','Petroleum Engineering','Agricultural Science','Forestry','Fire Science','Forensic Science','Supply Chain Management','Actuarial Science','Real Estate','Entrepreneurship','Sports Management','Music Production','Creative Writing','Linguistics','Archaeology','Meteorology','Oceanography','Robotics','Biotechnology','Urban Planning','Landscape Architecture','Genetics','Microbiology','Nutrition and Dietetics','Kinesiology','Occupational Therapy','Speech-Language Pathology','Materials Science','Computer Engineering','Geography','Statistics','Neuroscience','Photography'].map(p=>mk(`Top 10 Universities for ${p}`,'universities-'+slug(p)));
const pro=['Optometry Schools','Theology and Divinity Schools','Chiropractic Schools','Podiatry Schools'].map(p=>mk(`Top 10 ${p}`,slug(p)));
const hidden=['Underrated Universities','Hidden Ivies','Up-and-Coming Colleges','Colleges with the Best ROI','Underrated Public Universities','Best Colleges for Merit Scholarships','Best Colleges Nobody Talks About','Most Underrated Liberal Arts Colleges','Best Colleges for First-Generation Students','Best Colleges for Transfer Students','Best Debt-Free Colleges','Best Colleges for Internships','Best Colleges for Study Abroad','Best Colleges for Late Bloomers'].map(c=>mk(`Top 10 ${c}`,slug(c)));
// round-robin interleave for variety
const pools=[niche,states2,hidden,uStates,niche.slice(0),privC,pro];
// rebuild a single interleaved list (consume each pool round-robin)
const all=[states2,uStates,privC,niche,pro,hidden];
const inter=[]; let i=0; let any=true;
while(any){ any=false; for(const pool of all){ if(i<pool.length){ inter.push(pool[i]); any=true; } } i++; }
const final=[...keep,...inter].slice(0,100);
const out=final.map((e,k)=>({id:'sc'+String(21+k).padStart(4,'0'),title:e.title,slug:e.slug}));
fs.writeFileSync('C:/Users/koryj/_sc_sprint_queue.json',JSON.stringify(out,null,2));
console.log('queue:',out.length);
console.log('next up:',out.slice(6,12).map(e=>e.id+' '+e.title).join(' | '));
