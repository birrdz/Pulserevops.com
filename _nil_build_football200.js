const fs=require('fs');
const existing=new Set(fs.readFileSync('C:/Users/koryj/_nil_all_q.txt','utf8').split('\n').map(t=>t.trim().toLowerCase().replace(/\s+/g,' ')));
const norm=t=>t.trim().toLowerCase().replace(/\s+/g,' ');
const slug=s=>s.toLowerCase().replace(/&/g,'and').replace(/[()]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

// FBS programs (all 134) + notable FCS
const teams=[
// SEC
'Alabama','Arkansas','Auburn','Florida','Georgia','Kentucky','LSU','Mississippi State','Missouri','Oklahoma','Ole Miss','South Carolina','Tennessee','Texas','Texas A&M','Vanderbilt',
// Big Ten
'Illinois','Indiana','Iowa','Maryland','Michigan','Michigan State','Minnesota','Nebraska','Northwestern','Ohio State','Oregon','Penn State','Purdue','Rutgers','UCLA','USC','Washington','Wisconsin',
// Big 12
'Arizona','Arizona State','Baylor','BYU','Cincinnati','Colorado','Houston','Iowa State','Kansas','Kansas State','Oklahoma State','TCU','Texas Tech','UCF','Utah','West Virginia',
// ACC
'Boston College','California','Clemson','Duke','Florida State','Georgia Tech','Louisville','Miami','NC State','North Carolina','Pittsburgh','SMU','Stanford','Syracuse','Virginia','Virginia Tech','Wake Forest',
// Pac-12 remnant
'Oregon State','Washington State',
// AAC
'Army','Charlotte','East Carolina','Florida Atlantic','Memphis','Navy','North Texas','Rice','South Florida','Temple','Tulane','Tulsa','UAB','UTSA',
// Mountain West
'Air Force','Boise State','Colorado State','Fresno State','Hawaii','Nevada','New Mexico','San Diego State','San Jose State','UNLV','Utah State','Wyoming',
// MAC
'Akron','Ball State','Bowling Green','Buffalo','Central Michigan','Eastern Michigan','Kent State','Miami (OH)','Northern Illinois','Ohio','Toledo','Western Michigan',
// Sun Belt
'Appalachian State','Arkansas State','Coastal Carolina','Georgia Southern','Georgia State','James Madison','Louisiana','Louisiana-Monroe','Marshall','Old Dominion','South Alabama','Southern Miss','Texas State','Troy',
// Conference USA
'Jacksonville State','Kennesaw State','Liberty','Louisiana Tech','Middle Tennessee','New Mexico State','Sam Houston','UTEP','Western Kentucky','Florida International','Delaware','Missouri State',
// Independents
'Notre Dame','UConn','UMass',
// FCS notables (powers + Ivy + HBCU)
'North Dakota State','South Dakota State','Montana','Montana State','Sacramento State','Idaho','South Dakota','North Dakota','Villanova','William & Mary','Richmond','Incarnate Word','Furman','Mercer','Chattanooga','Holy Cross','Princeton','Harvard','Yale','Dartmouth','Penn','Cornell','Columbia','Brown','Jackson State','Florida A&M','North Carolina Central','Southern','Grambling','Howard','Tennessee State','Alcorn State','Lehigh','Lafayette','Colgate','Rhode Island','Maine','New Hampshire','Albany','Elon','Towson','Monmouth','Stony Brook','Weber State','Eastern Washington','UC Davis','Cal Poly','Northern Arizona','Southern Illinois','Northern Iowa','Illinois State','Youngstown State',
'Western Carolina','Wofford','Samford','The Citadel','VMI','East Tennessee State','Gardner-Webb','Tennessee Tech','Austin Peay','Eastern Kentucky','Indiana State','North Alabama','Central Arkansas','Stephen F. Austin','Abilene Christian','McNeese','Nicholls','Portland State','Idaho State','Northern Colorado','Fordham','Bucknell','Hampton','Norfolk State','South Carolina State','Bethune-Cookman','Prairie View A&M','Texas Southern'
];

const q=[];let n=13302;const seen=new Set();
for(const team of teams){
  if(q.length>=200)break;
  const question=`How much do ${team} football players earn from NIL in 2027?`;
  const key=norm(question);
  if(existing.has(key)||seen.has(key))continue;
  seen.add(key);
  q.push({id:'q'+n++,question,team,slug:slug(team)+'-fb',sport:'football'});
}
fs.writeFileSync('C:/Users/koryj/_nil_football200.json',JSON.stringify(q,null,1));
fs.writeFileSync('C:/Users/koryj/_nil_football200_compact.json',JSON.stringify(q));
console.log('queue:',q.length,'| candidates:',teams.length);
console.log('first:',q[0].id,q[0].question);
console.log('last:',q[q.length-1].id,q[q.length-1].question);
