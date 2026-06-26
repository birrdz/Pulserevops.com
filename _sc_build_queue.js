const fs=require('fs');
// State public high schools (skip MD - done)
const A_states=['California','Texas','Florida','New York','Illinois','Pennsylvania','Ohio','Georgia','North Carolina','Michigan','New Jersey','Virginia','Washington','Massachusetts','Arizona','Tennessee','Indiana','Missouri','Wisconsin','Colorado','Minnesota','South Carolina','Alabama','Kentucky','Oregon'];
// State public universities (skip MD)
const B_states=['California','Texas','Florida','New York','Illinois','Pennsylvania','Ohio','Georgia','North Carolina','Michigan','Virginia','Washington','Arizona','Indiana','Colorado'];
// State private colleges
const C_states=['California','New York','Massachusetts','Pennsylvania','Illinois','Ohio','Texas','North Carolina','Georgia','Virginia'];
// National program/major rankings (avoid existing: nursing,law,engineering,mba,medical,cs,education,psychology,architecture,pharmacy)
const D=['Accounting','Finance','Marketing','Economics','Data Science','Artificial Intelligence','Cybersecurity','Mechanical Engineering','Electrical Engineering','Civil Engineering','Chemical Engineering','Aerospace Engineering','Biomedical Engineering','Physics','Chemistry','Biology','Mathematics','Political Science','International Relations','Journalism','Communications','Film','Music','Graphic Design','Public Health','Neuroscience','Environmental Science','Aviation','Hospitality Management','Criminal Justice'];
const D_pro=['Dental Schools','Veterinary Schools','Culinary Schools','Art Schools','Physical Therapy Programs','Social Work Programs'];
// Category rankings
const E=['Liberal Arts Colleges','HBCUs','Catholic Universities','Christian Colleges','Women’s Colleges','Military Colleges','Online Universities','Community Colleges','Public Ivies','Honors Colleges','Best Value Colleges','Trade Schools','Coding Bootcamps','Film Schools'];
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const q=[];
for(const s of A_states) q.push({title:`Top 10 Public High Schools in ${s}`, slug:'public-high-schools-'+slug(s)});
for(const s of B_states) q.push({title:`Top 10 Public Universities in ${s}`, slug:'public-universities-'+slug(s)});
for(const s of C_states) q.push({title:`Top 10 Private Colleges in ${s}`, slug:'private-colleges-'+slug(s)});
for(const p of D) q.push({title:`Top 10 Universities for ${p}`, slug:'universities-'+slug(p)});
for(const p of D_pro) q.push({title:`Top 10 ${p}`, slug:slug(p)});
for(const c of E) q.push({title:`Top 10 ${c}`, slug:slug(c)});
// assign ids sc0021+
const out=q.slice(0,100).map((e,i)=>({id:'sc'+String(21+i).padStart(4,'0'),...e}));
fs.writeFileSync('C:/Users/koryj/_sc_sprint_queue.json',JSON.stringify(out,null,2));
console.log('queue:',out.length,'| first',out[0].id,out[0].title,'| last',out[out.length-1].id,out[out.length-1].title);
console.log('breakdown: A(high)='+A_states.length,'B(pubU)='+B_states.length,'C(privC)='+C_states.length,'D(prog)='+(D.length+D_pro.length),'E(cat)='+E.length);
