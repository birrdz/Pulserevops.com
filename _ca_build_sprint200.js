const fs=require('fs');
const all=fs.readFileSync('C:/Users/koryj/_ca_all_titles.txt','utf8').split('\n');
const norm=t=>t.trim().toLowerCase().replace(/\s+/g,' ').replace(/[—–-]/g,'-');
const existing=new Set(all.map(norm));
const covered=new Set();
for(const t of all){const m=t.match(/^Best (.+?) (?:Model Years|Generations) \(Ranked\)/i);if(m)covered.add(m[1].toLowerCase().trim());}
const models=[
'Toyota Camry','Toyota Corolla','Toyota RAV4','Toyota Highlander','Toyota Tacoma','Toyota Tundra','Toyota 4Runner','Toyota Sequoia','Toyota Sienna','Toyota Prius','Toyota Avalon','Toyota Land Cruiser','Toyota Supra','Toyota 86','Toyota C-HR','Toyota Venza','Toyota Corolla Cross','Toyota Crown','Toyota bZ4X','Toyota Matrix','Toyota Yaris','Toyota FJ Cruiser',
'Honda Accord','Honda Civic','Honda CR-V','Honda Pilot','Honda Odyssey','Honda Ridgeline','Honda HR-V','Honda Passport','Honda Fit','Honda Insight','Honda Element','Honda S2000','Honda Prelude','Honda CR-Z','Honda Crosstour',
'Ford F-150','Ford F-250','Ford Mustang','Ford Explorer','Ford Escape','Ford Edge','Ford Expedition','Ford Bronco','Ford Bronco Sport','Ford Ranger','Ford Maverick','Ford Focus','Ford Fusion','Ford Fiesta','Ford Taurus','Ford Flex','Ford EcoSport','Ford Mustang Mach-E','Ford Transit','Ford Excursion','Ford Crown Victoria',
'Chevrolet Silverado','Chevrolet Colorado','Chevrolet Equinox','Chevrolet Traverse','Chevrolet Tahoe','Chevrolet Suburban','Chevrolet Malibu','Chevrolet Camaro','Chevrolet Corvette','Chevrolet Blazer','Chevrolet Trailblazer','Chevrolet Trax','Chevrolet Impala','Chevrolet Cruze','Chevrolet Bolt','Chevrolet Spark','Chevrolet Sonic','Chevrolet Volt','Chevrolet Avalanche','Chevrolet HHR',
'GMC Sierra','GMC Canyon','GMC Acadia','GMC Terrain','GMC Yukon','GMC Yukon XL','Buick Enclave','Buick Encore','Buick Envision','Buick LaCrosse','Buick Regal','Cadillac Escalade','Cadillac XT5','Cadillac CT5','Cadillac CT4','Cadillac XT4','Cadillac XT6','Cadillac CTS','Cadillac ATS','Cadillac SRX',
'Jeep Wrangler','Jeep Grand Cherokee','Jeep Cherokee','Jeep Compass','Jeep Renegade','Jeep Gladiator','Jeep Wagoneer','Jeep Grand Wagoneer','Jeep Liberty','Jeep Patriot','Ram 1500','Ram 2500','Ram 3500','Dodge Charger','Dodge Challenger','Dodge Journey','Chrysler Pacifica','Chrysler 300','Chrysler Town and Country',
'Nissan Sentra','Nissan Versa','Nissan Kicks','Nissan Murano','Nissan Armada','Nissan Titan','Nissan Leaf','Nissan Ariya','Nissan 370Z','Nissan GT-R','Nissan Juke','Nissan Cube','Nissan Xterra','Infiniti Q50','Infiniti QX60','Infiniti QX80','Infiniti QX50','Infiniti G37','Infiniti FX35',
'Hyundai Elantra','Hyundai Sonata','Hyundai Santa Fe','Hyundai Palisade','Hyundai Kona','Hyundai Venue','Hyundai Ioniq 5','Hyundai Ioniq 6','Hyundai Veloster','Hyundai Accent','Hyundai Genesis Coupe','Hyundai Santa Cruz','Kia Forte','Kia Soul','Kia Sportage','Kia Optima','Kia Stinger','Kia Carnival','Kia Seltos','Kia Niro','Kia EV6','Kia Rio','Kia Sedona','Genesis G70','Genesis G80','Genesis GV70','Genesis GV80',
'Subaru Impreza','Subaru Legacy','Subaru BRZ','Mazda CX-30','Mazda CX-50','Mazda MX-5 Miata','Mazda CX-3','Mazda CX-90','Mazda RX-8','Mazda Tribute',
'Volkswagen Jetta','Volkswagen Passat','Volkswagen Golf','Volkswagen GTI','Volkswagen Tiguan','Volkswagen Atlas','Volkswagen Beetle','Volkswagen Touareg','Volkswagen ID.4','Volkswagen Arteon','Audi A4','Audi A6','Audi Q5','Audi Q7','Audi Q3','Audi A3','Audi A5','Audi Q8','Audi e-tron','Audi TT',
'BMW 3 Series','BMW 5 Series','BMW X3','BMW X5','BMW X1','BMW X7','BMW 4 Series','BMW M3','BMW i4','BMW 7 Series','BMW Z4','BMW X6','Mercedes-Benz C-Class','Mercedes-Benz E-Class','Mercedes-Benz GLC','Mercedes-Benz GLE','Mercedes-Benz S-Class','Mercedes-Benz GLA','Mercedes-Benz GLB','Mercedes-Benz A-Class','Mercedes-Benz CLA','Mercedes-Benz GLS',
'Lexus RX','Lexus ES','Lexus NX','Lexus GX','Lexus IS','Lexus LX','Lexus UX','Lexus LS','Lexus RC','Acura MDX','Acura RDX','Acura TLX','Acura TSX','Acura ILX','Acura Integra','Acura TL','Volvo XC90','Volvo XC60','Volvo XC40','Volvo S60','Volvo V60',
'Tesla Model 3','Tesla Model Y','Tesla Model S','Tesla Model X','Rivian R1T','Rivian R1S','Lucid Air','Porsche 911','Porsche Cayenne','Porsche Macan','Porsche Panamera','Porsche Boxster','Porsche Cayman','Mini Cooper','Mitsubishi Outlander','Mitsubishi Eclipse Cross','Mitsubishi Mirage','Land Rover Range Rover','Land Rover Discovery','Land Rover Defender','Jaguar F-Pace','Fiat 500','Alfa Romeo Giulia',
'Toyota GR86','Toyota GR Corolla','Toyota Mirai','Toyota Celica','Toyota MR2','Toyota Solara','Toyota Tercel','Toyota Previa','Toyota Echo',
'Honda Clarity','Honda del Sol','Honda Civic Type R','Honda CRX','Honda Pilot','Honda Accord Hybrid',
'Ford GT','Ford Thunderbird','Ford Five Hundred','Ford Freestyle','Ford Probe','Ford Contour','Ford Windstar','Ford F-150 Lightning','Ford Galaxie','Ford Falcon',
'Chevrolet SS','Chevrolet Caprice','Chevrolet Monte Carlo','Chevrolet Cobalt','Chevrolet Aveo','Chevrolet Captiva','Chevrolet Express','Chevrolet Nova','Chevrolet Bel Air',
'Dodge Dart','Dodge Caliber','Dodge Magnum','Dodge Neon','Dodge Viper','Dodge Nitro','Dodge Avenger','Dodge Durango',
'Chrysler Sebring','Chrysler PT Cruiser','Chrysler 200','Chrysler Crossfire','Chrysler Voyager',
'Nissan 350Z','Nissan Quest','Nissan Rogue Sport','Nissan Pulsar','Nissan 240SX',
'Hyundai Azera','Hyundai Entourage','Hyundai Tiburon','Hyundai Equus','Hyundai Nexo',
'Kia Cadenza','Kia K5','Kia K900','Kia Borrego','Kia Amanti',
'Mazda2','Mazda MPV','Mazdaspeed3','Mazda B-Series','Mazda CX-7','Mazda5',
'Volkswagen CC','Volkswagen Eos','Volkswagen Rabbit','Volkswagen Routan','Volkswagen Taos','Volkswagen e-Golf',
'BMW 2 Series','BMW 6 Series','BMW 8 Series','BMW X2','BMW X4','BMW i3','BMW iX','BMW M5','BMW 1 Series',
'Mercedes-Benz G-Class','Mercedes-Benz GLK','Mercedes-Benz CLS','Mercedes-Benz SL','Mercedes-Benz SLK','Mercedes-Benz GL','Mercedes-Benz EQS','Mercedes-Benz Sprinter',
'Lexus CT','Lexus HS','Lexus GS','Lexus LC','Lexus RZ','Lexus TX',
'Acura RL','Acura RLX','Acura ZDX','Acura NSX','Acura CL','Acura Legend',
'Volvo S90','Volvo V90','Volvo C40','Volvo XC70','Volvo S40','Volvo C30',
'Audi A7','Audi A8','Audi Q4 e-tron','Audi S4','Audi S5','Audi RS5','Audi allroad','Audi R8',
'Porsche Taycan','Porsche 718','Porsche 944','Porsche 928',
'Tesla Cybertruck','Polestar 2','Genesis GV60','Mini Countryman','Mitsubishi Lancer','Mitsubishi Montero','Subaru Baja','Subaru Tribeca','Subaru SVX',
'Pontiac G6','Pontiac GTO','Pontiac Firebird','Hummer H2','Hummer H3',
'Lincoln Navigator','Lincoln Aviator','Lincoln MKZ','Lincoln Continental','Lincoln Corsair','Lincoln MKX',
'Jaguar XF','Jaguar XE','Jaguar E-Pace','Jaguar I-Pace','Maserati Ghibli','Maserati Levante'
];
const q=[];const seen=new Set();
const gaps=[343,352,383,399,425,440,442,453,462,493,496,503,515,534];
const idPool=[...gaps];let next=538;
const nextId=()=>{if(idPool.length)return 'ca'+String(idPool.shift()).padStart(4,'0');return 'ca'+String(next++).padStart(4,'0');};
for(const m of models){
  const key=m.toLowerCase().trim();
  if(covered.has(key)||seen.has(key))continue;
  const useGen=/(Civic|Accord|Corolla|Camry|Mustang|911|Miata|3 Series|5 Series|C-Class|E-Class|Golf|GTI)/i.test(m);
  const title='Best '+m+' '+(useGen?'Generations':'Model Years')+' (Ranked)';
  if(existing.has(norm(title)))continue;
  seen.add(key);
  q.push({id:nextId(),title,model:m,slug:m.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')});
  if(q.length>=200)break;
}
fs.writeFileSync('C:/Users/koryj/_ca_sprint200.json',JSON.stringify(q,null,1));
console.log('queue:',q.length,'| candidate models:',models.length,'| already covered:',covered.size);
console.log('first:',q[0].id,q[0].title);
console.log('last:',q[q.length-1].id,q[q.length-1].title);
