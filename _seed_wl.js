// _seed_wl.js — advance gap-fill from cl (Clubs) to wl (Wellness) when cl drains.
// Mirrors _seed_cl.js: hand-seed real "Top 10 … 2027"-style consumer wellness
// product rankings (wl's existing convention) into the active queue + flip
// _current_pillar.txt. Writer skips dupes and publishes the rest. Nothing
// published here. wl is NOT in _gapfill_refill.js PILLARS (controlled close).

const fs = require('fs');
const QFILE = 'C:/Users/koryj/website/_gapfill_queue.json';
const norm = t => String(t || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

// 45 NEW Wellness titles, deduped against the 65 live wl entries.
const NEW = [
  // Supplements
  'Top 10 Turmeric Curcumin Supplements 2027',
  'Top 10 Melatonin Supplements 2027',
  'Top 10 Zinc Supplements 2027',
  'Top 10 Vitamin B12 Supplements 2027',
  'Top 10 Iron Supplements 2027',
  'Top 10 L-Theanine Supplements 2027',
  "Top 10 Lion's Mane Mushroom Supplements 2027",
  'Top 10 BCAA Supplements 2027',
  'Top 10 Joint Support Supplements 2027',
  'Top 10 Biotin Supplements for Hair, Skin, and Nails 2027',
  'Top 10 CoQ10 Supplements 2027',
  'Top 10 Berberine Supplements 2027',
  'Top 10 Digestive Enzyme Supplements 2027',
  'Top 10 Prebiotic Supplements 2027',
  'Top 10 Fiber Supplements 2027',
  // Fitness equipment
  'Top 10 Kettlebells 2027',
  'Top 10 Weight Benches 2027',
  'Top 10 Pull-Up Bars 2027',
  'Top 10 Jump Ropes 2027',
  'Top 10 Medicine Balls 2027',
  'Top 10 Squat Racks 2027',
  'Top 10 Ellipticals 2027',
  'Top 10 Stair Climbers 2027',
  'Top 10 Vibration Plates 2027',
  'Top 10 Barbells 2027',
  'Top 10 Weightlifting Belts 2027',
  'Top 10 Gymnastic Rings 2027',
  'Top 10 Ab Rollers 2027',
  'Top 10 Spin Bikes 2027',
  'Top 10 Cross-Training Shoes 2027',
  // Recovery & devices
  'Top 10 Compression Boots for Recovery 2027',
  'Top 10 EMS Muscle Stimulators 2027',
  'Top 10 Acupressure Mats 2027',
  'Top 10 Inversion Tables 2027',
  'Top 10 Compression Socks 2027',
  'Top 10 Hand Grip Strengtheners 2027',
  'Top 10 Massage Balls 2027',
  'Top 10 Heart Rate Monitor Chest Straps 2027',
  // Sleep / home / nutrition / apps
  'Top 10 White Noise Machines 2027',
  'Top 10 Sunrise Alarm Clocks 2027',
  'Top 10 Essential Oil Diffusers 2027',
  'Top 10 Continuous Glucose Monitors 2027',
  'Top 10 Protein Bars 2027',
  'Top 10 Habit Tracker Apps 2027',
  'Top 10 Breathwork Apps 2027',
];

const queue = JSON.parse(fs.readFileSync(QFILE, 'utf8'));
const seen = new Set(queue.map(it => norm(it.title)));
let added = 0;
for (const title of NEW) {
  if (seen.has(norm(title))) continue;
  queue.push({ prefix: 'wl', title, kind: 'top10' });
  seen.add(norm(title));
  added++;
}
fs.writeFileSync(QFILE, JSON.stringify(queue, null, 1));
console.log(`seeded ${added} new wl titles (of ${NEW.length}); queue now ${queue.length}`);
fs.writeFileSync('C:/Users/koryj/website/_current_pillar.txt', 'wl\n');
console.log('active pillar -> wl');
