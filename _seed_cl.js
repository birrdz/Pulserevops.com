// _seed_cl.js — advance the gap-fill campaign from ga (closed: 80 entries, all
// queue titles published) to the next pillar cl (Clubs). Mirrors how ga was run:
// hand-seed real "The 10 Best … (2027)"-style titles into the active queue (the
// generic top10 refill template emits "Top 10 …" which would break cl's title
// convention). The writer (_gapfill_run.js) skips dupes and publishes the rest.
//
// Safe: rebuilds the queue = (still-unpublished current items) + 40 new cl titles,
// dropping only already-published dupes. Nothing is published here.

const fs = require('fs');
const QFILE = 'C:/Users/koryj/website/_gapfill_queue.json';
const norm = t => String(t || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

// 40 NEW Clubs titles, deduped against the 50 live cl entries, matching the
// pillar's established sub-categories + year-at-end style.
const NEW = [
  // Nightclubs by city (existing: Vegas/Miami/NYC/Ibiza/Berlin/London/Dubai/Amsterdam/Tokyo/LA)
  'The 10 Best Nightclubs in Chicago (2027 Ranking)',
  'The 10 Best Nightclubs in São Paulo (2027 Ranking)',
  'The 10 Best Nightclubs in Mexico City (2027 Ranking)',
  'The 10 Best Nightclubs in Singapore (2027 Ranking)',
  'The 10 Best Nightclubs in Bangkok (2027 Ranking)',
  'The 10 Best Nightclubs in Barcelona (2027 Ranking)',
  'The 10 Best Nightclubs in Seoul (2027 Ranking)',
  'The 10 Best Nightclubs in Toronto (2027 Ranking)',
  // Beach clubs (existing: Ibiza/Mykonos/Tulum/Dubai/Amalfi/Bali/St-Tropez/Miami/Marbella)
  'The 10 Best Beach Clubs in Santorini for 2027',
  'The 10 Best Beach Clubs in Hvar & the Croatian Coast for 2027',
  'The 10 Best Beach Clubs in Sardinia & the Costa Smeralda for 2027',
  'The 10 Best Beach Clubs in Punta Cana for 2027',
  'The 10 Best Beach Clubs in Cabo San Lucas for 2027',
  'The 10 Best Beach Clubs in Phuket for 2027',
  // Country clubs by US region (existing: America/Northeast/CA/FL/Midwest/TX/Southeast/Western)
  'The 10 Most Prestigious Country Clubs in Arizona (2027)',
  'The 10 Most Prestigious Country Clubs in the Carolinas (2027)',
  'The 10 Most Prestigious Country Clubs in Hawaii (2027)',
  'The 10 Most Prestigious Country Clubs in the Rocky Mountain States (2027)',
  // Golf courses by region (existing: Scotland/US public/Ireland/England/Aus-NZ/Continental Europe/Asia-ME)
  'The 10 Best Golf Courses in Canada to Play in 2027',
  'The 10 Best Golf Courses in South Africa to Play in 2027',
  'The 10 Best Golf Courses in Spain & Portugal to Play in 2027',
  'The 10 Best Golf Courses in the American Desert Southwest to Play in 2027',
  'The 10 Best Golf Courses in the Pacific Northwest to Play in 2027',
  // Private members' clubs by city (existing: London/NYC/LA/Miami/Asia/Paris/Soho House)
  "The 10 Best Private Members' Clubs in Hong Kong (2027)",
  "The 10 Best Private Members' Clubs in Singapore (2027)",
  "The 10 Best Private Members' Clubs in Dubai (2027)",
  "The 10 Best Private Members' Clubs in San Francisco (2027)",
  "The 10 Best Private Members' Clubs in Chicago (2027)",
  "The 10 Best Private Members' Clubs in Sydney (2027)",
  // Yacht clubs by region (existing: US/Europe/Mediterranean)
  'The 10 Best Yacht Clubs in the Caribbean (2027)',
  'The 10 Best Yacht Clubs in Asia-Pacific (2027)',
  'The 10 Best Yacht Clubs in Australia & New Zealand (2027)',
  'The 10 Best Yacht Clubs in the United Kingdom (2027)',
  // Specialty clubs
  'The 10 Best Private Ski Clubs in North America (2027)',
  'The 10 Best Polo Clubs in the World (2027)',
  'The 10 Best Private Tennis Clubs in the World (2027)',
  'The 10 Best Jazz Clubs in the World (2027)',
  'The 10 Best Comedy Clubs in America (2027)',
  'The 10 Best Supper Clubs in America (2027)',
  'The 10 Best Rooftop Clubs in the World (2027)',
];

const queue = JSON.parse(fs.readFileSync(QFILE, 'utf8'));
// We can't read the index here without a blob round-trip; the writer dedupes
// against the index anyway. Keep existing queue items that aren't ga/dn drained
// dupes is unnecessary — just keep all current items (writer skips published)
// and append the new cl set, guarding against intra-queue title collisions.
const seen = new Set(queue.map(it => norm(it.title)));
let added = 0;
for (const title of NEW) {
  if (seen.has(norm(title))) continue;
  queue.push({ prefix: 'cl', title, kind: 'top10' });
  seen.add(norm(title));
  added++;
}
fs.writeFileSync(QFILE, JSON.stringify(queue, null, 1));
console.log(`seeded ${added} new cl titles (of ${NEW.length}); queue now ${queue.length}`);

// Flip the active pillar so the handoff + any pillar-scoped logic reflect cl.
fs.writeFileSync('C:/Users/koryj/website/_current_pillar.txt', 'cl\n');
console.log('active pillar -> cl');
