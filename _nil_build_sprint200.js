const fs=require('fs');
const existing=new Set(fs.readFileSync('C:/Users/koryj/_nil_all_q.txt','utf8').split('\n').map(t=>t.trim().toLowerCase().replace(/\s+/g,' ')));
const norm=t=>t.trim().toLowerCase().replace(/\s+/g,' ');
const slug=s=>s.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

// Major D1 MEN'S basketball programs
const mens=['Kansas','Kentucky','North Carolina','UCLA','Indiana','Michigan State','Villanova','Gonzaga','Arizona','Michigan','Louisville','Syracuse','UConn','Florida','Ohio State','Wisconsin','Maryland','Texas','Tennessee','Auburn','Alabama','Arkansas','Baylor','Houston','Purdue','Illinois','Iowa','Iowa State','Creighton','Marquette','Xavier','Providence','Seton Hall','St. John’s','Georgetown','Butler','DePaul','Memphis','Cincinnati','Wichita State','San Diego State','Saint Mary’s','BYU','Utah','Colorado','Oregon','Oregon State','Washington','Washington State','Stanford','California','USC','Arizona State','TCU','Texas Tech','Oklahoma','Oklahoma State','West Virginia','Kansas State','Missouri','Mississippi State','Ole Miss','LSU','Georgia','South Carolina','Florida State','Miami','Clemson','NC State','Virginia','Virginia Tech','Wake Forest','Pittsburgh','Boston College','Notre Dame','Georgia Tech','Penn State','Rutgers','Nebraska','Minnesota','Northwestern','Vanderbilt','Texas A&M','Dayton','VCU','Saint Louis','Rhode Island','Davidson','Richmond','George Mason','Loyola Chicago','Drake','Bradley','Northern Iowa','Murray State','Belmont','Vermont','Colgate','Yale','Princeton','Harvard','Cornell','UC Irvine','UC Santa Barbara','Hawaii','Nevada','UNLV','New Mexico','Boise State','Fresno State','Utah State','Colorado State','Wyoming','Air Force','Grand Canyon','Liberty','Florida Atlantic','Charleston','UAB','North Texas','Temple','Tulane','SMU','East Carolina','South Florida','Akron','Toledo','Kent State','Ohio','Buffalo','Northern Kentucky','Oakland','Cleveland State','Milwaukee','Wright State','Montana','Montana State','Eastern Washington','Weber State','North Dakota State','South Dakota State','Oral Roberts','McNeese','Indiana State','Furman','Samford','UNC Greensboro','Chattanooga','Mercer','Wofford','Stephen F. Austin','Abilene Christian','Vermont','Bucknell','Lehigh','American','Navy','Army','Lipscomb','Kennesaw State','Jacksonville State','Sam Houston','Utah Valley','Seattle','Cal State Fullerton','UC Davis','Long Beach State','UC San Diego','Portland','Pacific','San Francisco','Santa Clara','Loyola Marymount','Pepperdine'];

// Major D1 WOMEN'S basketball programs
const womens=['South Carolina','LSU','Iowa','Stanford','Texas','UCLA','Notre Dame','Tennessee','Baylor','Maryland','Ohio State','Virginia Tech','Indiana','NC State','Duke','Utah','Colorado','Oregon State','Louisville','Florida State','Ole Miss','Kansas State','Creighton','Villanova','Oklahoma','Oklahoma State','Texas A&M','Kentucky','Georgia','Arkansas','Mississippi State','Michigan','Michigan State','Nebraska','Washington State','Gonzaga','West Virginia','Princeton','Columbia','South Dakota State','Fairfield','Middle Tennessee','Florida Gulf Coast','James Madison','Richmond','North Carolina','Syracuse','Arizona','California','USC'];

const q=[];let n=13102;const seen=new Set();
function add(team,sport){
  const sportWord=sport==='mbb'?'men’s':'women’s';
  const question=`How much do ${team} ${sportWord} basketball players earn from NIL in 2027?`;
  const key=norm(question);
  if(existing.has(key)||seen.has(key))return false;
  // also skip if a non-gendered "<team> basketball players earn" already exists (Duke mens)
  const alt=norm(`How much do ${team} basketball players earn from NIL in 2027?`);
  if(existing.has(alt)&&sport==='mbb')return false;
  seen.add(key);
  q.push({id:'q'+n++,question,team,slug:slug(team)+(sport==='mbb'?'-mbb':'-wbb'),sport});
  return true;
}
for(const t of mens){if(q.length>=150)break;add(t,'mbb');}
for(const t of womens){if(q.length>=200)break;add(t,'wbb');}
// if still short, top up with more mens
for(const t of mens){if(q.length>=200)break;add(t,'mbb');}
fs.writeFileSync('C:/Users/koryj/_nil_sprint200.json',JSON.stringify(q,null,1));
const mc=q.filter(x=>x.sport==='mbb').length,wc=q.filter(x=>x.sport==='wbb').length;
console.log('queue:',q.length,'| mbb:',mc,'| wbb:',wc);
console.log('first:',q[0].id,q[0].question);
console.log('last:',q[q.length-1].id,q[q.length-1].question);
