const fs=require('fs');
const {getStore}=require('@netlify/blobs');
try{const env=fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');for(const l of env.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}}catch(e){}
const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN;
const pad=n=>'tl';// unused
const norm=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const STATES=["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];
const METROS=["Chicago","Houston","Dallas-Fort Worth","Atlanta","Boston","Phoenix","Seattle","Denver","Miami","Minneapolis-St. Paul","Detroit","Philadelphia","San Diego","Tampa Bay","Charlotte","Nashville","Austin","Portland","Las Vegas","Orlando","Cleveland","Pittsburgh","Kansas City","Columbus","Indianapolis","San Antonio","Sacramento","Salt Lake City","Cincinnati","Raleigh-Durham"];
const MAJORS=["Accounting","Finance","Marketing","Data Science","Artificial Intelligence","Cybersecurity","Aerospace Engineering","Mechanical Engineering","Civil Engineering","Electrical Engineering","Chemical Engineering","Biomedical Engineering","Biology","Chemistry","Physics","Mathematics","Economics","Political Science","International Relations","Journalism","Communications","Film and Media","Music","Theater and Drama","Fine Arts","Graphic Design","Fashion Design","Culinary Arts","Hospitality Management","Criminal Justice","Social Work","Public Health","Nutrition and Dietetics","Kinesiology","Veterinary Medicine","Dentistry","Physician Assistant Studies","Physical Therapy","Occupational Therapy","Speech-Language Pathology","Environmental Science","Geology","Agriculture","Supply Chain Management","Real Estate","Entrepreneurship","Aviation","Sports Management","Animation","Interior Design","Robotics","Statistics","Neuroscience","Public Policy","Anthropology","Linguistics","Creative Writing","Photography","Information Technology"];
const ANGLES=["Best Value Colleges","Colleges With No Student Loans","Need-Blind Colleges","Colleges With the Best Financial Aid","Best Honors Colleges","Best Colleges for Study Abroad","Best Colleges for Internships","Best Colleges for Greek Life","Historically Black Colleges and Universities","Best Women's Colleges","Best Military Colleges and Academies","Best Online Universities","Best Colleges for Student Athletes","Best Colleges for Entrepreneurs","Best Colleges for Pre-Med","Best Colleges for Pre-Law","Best Colleges for Veterans","Best Colleges for Transfer Students","Best Colleges for Adult Learners","Best Liberal Arts Colleges","Best Colleges for Job Placement","Best Colleges for Research","Best Public Honors Programs","Best Colleges for Financial Aid for Middle-Class Families","Most Beautiful College Campuses","Best College Towns","Best Colleges for Mental Health Support","Best Colleges for Disability Services","Best Colleges for Rural Students","Best Colleges for Music Production"];
const HS_TYPES=["Public High Schools","Private High Schools","Public Middle Schools","Public Elementary Schools","Catholic High Schools","Charter Schools","Boarding Schools","STEM and Magnet High Schools","School Districts","Community Colleges"];
const UNI_TYPES=["Public Universities","Private Colleges"];

(async()=>{
const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:TOK});
const idx=(await s.get('_index.json',{type:'json'}))||{entries:[]};
const sc=(idx.entries||[]).filter(e=>/^sc\d+$/.test(e.id));
const existing=new Set(sc.map(e=>norm(e.question)));
const maxNum=Math.max(...sc.map(e=>parseInt(e.id.slice(2),10)));
// candidate pools (round-robin for variety)
const pools=[];
pools.push(STATES.flatMap(st=>HS_TYPES.map(t=>`Top 10 ${t} in ${st}`)));
pools.push(STATES.flatMap(st=>UNI_TYPES.map(t=>`Top 10 ${t} in ${st}`)));
pools.push(MAJORS.map(m=>`Top 10 Universities for ${m}`));
pools.push(ANGLES.map(a=>`Top 10 ${a}`));
pools.push(METROS.map(c=>`Top 10 Public High Schools in ${c}`));
pools.push(METROS.map(c=>`Top 10 Private High Schools in ${c}`));
const picks=[];const seen=new Set();
let idxp=0;
while(picks.length<200){
  let progressed=false;
  for(const pool of pools){
    if(picks.length>=200)break;
    // pull next unused from this pool
    while(pool.length){const q=pool.shift();const k=norm(q);if(!existing.has(k)&&!seen.has(k)){seen.add(k);picks.push(q);progressed=true;break;}}
  }
  if(!progressed)break;
}
const out=picks.slice(0,200).map((q,i)=>{const n=maxNum+1+i;return{id:'sc'+String(n).padStart(4,'0'),q};});
fs.writeFileSync('_sctopics.json',JSON.stringify(out));
console.log('wrote '+out.length+' sc topics. range '+out[0].id+'-'+out[out.length-1].id);
console.log('sample:');out.slice(0,8).forEach(o=>console.log('  '+o.id+': '+o.q));
})().catch(e=>{console.error('ERR',e.stack);process.exit(1);});
