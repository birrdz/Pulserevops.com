const fs=require('fs');
const slug=s=>('dine-'+s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const mk=(title,sl)=>({title,slug:sl});
const national=['America','the United States'].map(p=>mk(`Top 10 Places to Dine in ${p}`,slug(p)));
const regional=['the Pacific Northwest','New England','the American South','the Midwest','the Mid-Atlantic','the Southwest','the Gulf Coast','Northern California'].map(p=>mk(`Top 10 Places to Dine in ${p}`,slug(p)));
const states=['California','New York','Texas','Florida','Louisiana','Illinois','Georgia','Massachusetts','Washington','Oregon','Tennessee','North Carolina','South Carolina','Virginia','Pennsylvania','Colorado','Arizona','Michigan'].map(p=>mk(`Top 10 Places to Dine in ${p}`,slug(p)));
const cities=['New York City','Chicago','Los Angeles','San Francisco','New Orleans','Austin','Nashville','Miami','Seattle','Portland, Oregon','Boston','Washington, D.C.','Philadelphia','Las Vegas','Charleston, South Carolina','Houston','Dallas','Atlanta','Denver','San Diego','Savannah, Georgia','Asheville, North Carolina','Brooklyn','Memphis','Napa Valley'].map(p=>mk(`Top 10 Places to Dine in ${p}`,slug(p)));
const counties=['Montgomery County, Maryland','Howard County, Maryland','Baltimore County, Maryland','Sonoma County, California','Orange County, California','Worcester County, Maryland'].map(p=>mk(`Top 10 Places to Dine in ${p}`,slug(p)));
const countries=['Italy','France','Japan','Spain','Mexico','Thailand','Greece','India','Vietnam','Peru','Portugal','Turkey'].map(p=>mk(`Top 10 Places to Dine in ${p}`,slug(p)));
const cuisine=['Top 10 BBQ Joints in Texas|bbq-texas','Top 10 Sushi Restaurants in Los Angeles|sushi-los-angeles','Top 10 Italian Restaurants in New York City|italian-nyc','Top 10 Pizza Places in New York City|pizza-nyc','Top 10 Mexican Restaurants in San Diego|mexican-san-diego','Top 10 Cajun Restaurants in New Orleans|cajun-new-orleans','Top 10 Lobster Shacks in Maine|lobster-maine','Top 10 Steakhouses in Chicago|steakhouses-chicago','Top 10 Dim Sum Spots in San Francisco|dim-sum-san-francisco','Top 10 Taco Spots in Austin|tacos-austin','Top 10 Hot Chicken Spots in Nashville|hot-chicken-nashville','Top 10 Cuban Restaurants in Miami|cuban-miami','Top 10 Deep Dish Pizza Spots in Chicago|deep-dish-chicago','Top 10 Soul Food Restaurants in Atlanta|soul-food-atlanta','Top 10 Cheesesteak Spots in Philadelphia|cheesesteaks-philadelphia','Top 10 Clam Chowder Spots in Boston|clam-chowder-boston','Top 10 Ramen Shops in Los Angeles|ramen-los-angeles','Top 10 Fried Chicken Spots in the South|fried-chicken-south','Top 10 Oyster Bars in the United States|oyster-bars-usa'].map(s=>{const[t,sl]=s.split('|');return mk(t,'dine-'+sl);});
// interleave by level for variety
const pools=[cities,countries,states,cuisine,regional,counties,national];
const inter=[];let i=0,any=true;while(any){any=false;for(const p of pools){if(i<p.length){inter.push(p[i]);any=true;}}i++;}
const out=inter.slice(0,100).map((e,k)=>({id:'dn'+String(11+k).padStart(4,'0'),title:e.title,slug:e.slug}));
fs.writeFileSync('C:/Users/koryj/_dn_sprint_queue.json',JSON.stringify(out,null,2));
console.log('dining queue:',out.length);
console.log('first 6:',out.slice(0,6).map(e=>e.id+' '+e.title).join(' | '));
