const fs=require('fs');
const cur=JSON.parse(fs.readFileSync('C:/Users/koryj/_sc_sprint_queue.json','utf8'));
const keep=cur.slice(0,6); // sc0021-0026 state public high schools (launched)
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
// More state public high schools (broad base)
const states2=['Ohio','Georgia','North Carolina','Michigan','New Jersey','Virginia','Washington','Massachusetts','Arizona','Indiana'];
// State public universities
const uStates=['California','Texas','Florida','New York','Ohio','Georgia','North Carolina','Michigan','Virginia','Washington'];
// NICHE / sub-specialty program rankings (the "not obvious" stuff)
const niche=['Forensic Psychology','Sports Psychology','Industrial-Organizational Psychology','Clinical Psychology','Child Development','Marine Biology','Wildlife Conservation','Astrophysics','Game Design','Esports Management','Audio Engineering','Animation','Fashion Design','Interior Design','Industrial Design','Viticulture and Enology','Equine Studies','Maritime and Marine Engineering','Petroleum Engineering','Agricultural Science','Forestry','Fire Science','Forensic Science','Supply Chain Management','Actuarial Science','Real Estate','Entrepreneurship','Sports Management','Music Production','Creative Writing','Linguistics','Archaeology','Meteorology','Oceanography','Robotics','Biotechnology','Urban Planning','Landscape Architecture','Sound Design and Film Scoring','Video Game Programming'];
// Hidden-gem / value / underrated categories
const hidden=['Underrated Universities','Hidden Ivies','Up-and-Coming Colleges','Colleges with the Best ROI','Underrated Public Universities','Best Colleges for Merit Scholarships','Best Colleges Nobody Talks About','Most Underrated Liberal Arts Colleges','Best Colleges for First-Generation Students','Best Colleges for Late Bloomers','Best Colleges for Transfer Students','Best Debt-Free Colleges','Best Colleges for Internships','Best Colleges for Study Abroad'];
const q=[...keep];
for(const s of states2) q.push({id:'',title:`Top 10 Public High Schools in ${s}`, slug:'public-high-schools-'+slug(s)});
for(const s of uStates) q.push({id:'',title:`Top 10 Public Universities in ${s}`, slug:'public-universities-'+slug(s)});
for(const p of niche) q.push({id:'',title:`Top 10 Universities for ${p}`, slug:'universities-'+slug(p)});
for(const c of hidden) q.push({id:'',title:`Top 10 ${c}`, slug:slug(c)});
const out=q.slice(0,100).map((e,i)=>({id:'sc'+String(21+i).padStart(4,'0'),title:e.title,slug:e.slug}));
fs.writeFileSync('C:/Users/koryj/_sc_sprint_queue.json',JSON.stringify(out,null,2));
console.log('rebuilt queue:',out.length);
console.log('sc0027:',out[6].title,'| sc0041:',out[20].title,'| sc0081:',out[60].title,'| sc0120:',out[99].title);
