// Expand the HS Football Recruiting (hf) pillar with 200 ADDITIONAL similar-search
// phrases beyond the existing city-templated set, then (with --write) append the
// first 200 NEW ones to _hf_keyword_phrases.json.
// Variety: colloquial/abbreviated ("hs fb recruiting"), by-position, by-state,
// by-class-year, questions, platforms, NIL, camps, divisions, cost/value, film.
// Usage: node _hf_expand_keywords.js          (dry: prints counts + sample)
//        node _hf_expand_keywords.js --write   (append 200 new to the JSON)
const fs = require('fs');
const PATH = 'C:/Users/koryj/website/_hf_keyword_phrases.json';

const existing = JSON.parse(fs.readFileSync(PATH, 'utf8'));
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
const seen = new Set(existing.map(norm));

const POSITIONS = ['quarterbacks', 'wide receivers', 'running backs', 'linebackers', 'offensive linemen',
  'defensive linemen', 'defensive backs', 'tight ends', 'safeties', 'cornerbacks', 'edge rushers', 'kickers', 'athletes'];
const STATES = ['Texas', 'Florida', 'California', 'Georgia', 'Ohio', 'Alabama', 'Louisiana', 'New Jersey',
  'Pennsylvania', 'North Carolina', 'Tennessee', 'Michigan', 'Virginia', 'Arizona', 'Washington'];
const CLASSES = ['2027', '2028', '2029', '2030'];
const DIVISIONS = ['D1', 'FBS', 'FCS', 'D2', 'D3', 'JUCO', 'NAIA', 'Ivy League'];
const PLATFORMS = ['Hudl', '247Sports', 'On3', 'Rivals', 'NCSA', 'SportsRecruits', 'FieldLevel', 'BeRecruited'];

const CURATED = [
  // colloquial / abbreviated (the "hs fb recruiting" style)
  'hs fb recruiting', 'hs football recruiting', 'high school football recruiting',
  'hs fb recruiting rankings', 'hs football recruiting services', 'best hs fb recruiting sites',
  'hs fb recruiting near me', 'high school football recruiting services 2027',
  'hs football recruiting websites', 'high school football recruiting rankings 2027',
  'hs fb recruiting profile', 'high school football recruiting help',
  // how-to questions
  'how do you get recruited for college football', 'how to get a football scholarship',
  'how to make a football recruiting highlight tape', 'when should you start the football recruiting process',
  'how to email college football coaches', 'do you need a recruiting service for football',
  'what GPA do you need for football recruiting', 'how to get noticed by college football scouts',
  'how do football camps help recruiting', 'how to build a football recruiting profile',
  'how to make a football recruiting film', 'what coaches look for in recruiting film',
  'how to get recruited as a walk-on football player', 'how to contact college football coaches as a recruit',
  'how to get a football offer from a D1 school', 'how to get recruited if your high school is small',
  'how many football scholarships per team', 'how to handle a football recruiting visit',
  // NIL
  'NIL deals for high school football players', 'high school football NIL rules by state',
  'how NIL affects football recruiting', 'best NIL prep for football recruits',
  'NIL valuation for football recruits', 'high school football NIL collectives',
  // camps / showcases / 7on7
  'best football recruiting camps 2027', 'best football showcases for recruiting',
  'Elite 11 quarterback camp', 'The Opening football showcase', 'best 7on7 teams for recruiting',
  'college football prospect camps', 'satellite football camps for recruiting',
  'football combine results for recruiting', 'best football kicking camps for recruiting',
  // process / timeline
  'football recruiting timeline by grade', 'junior year football recruiting checklist',
  'football verbal commitment vs signing', 'early signing day football',
  'transfer portal and high school recruits', 'football recruiting dead period explained',
  'official visit vs unofficial visit football', 'football national signing day 2027',
  'football recruiting questionnaire tips', 'committable offer vs interest football',
  // cost / value
  'how much do football recruiting services cost', 'are football recruiting services worth it',
  'free football recruiting tools', 'cheap football recruiting help', 'is NCSA worth it for football',
  'best free football recruiting websites', 'football recruiting service reviews',
  // platforms comparisons
  'Rivals vs 247Sports recruiting', 'best alternatives to NCSA recruiting',
  '247Sports recruiting rankings explained', 'On3 recruiting rankings explained',
  'Hudl recruiting profile tips', 'how recruiting star ratings work',
  // misc high-intent
  'best states for football recruiting exposure', 'SEC football recruiting targets 2027',
  'underrated football recruiting prospects 2027', 'football recruiting for academic schools',
  'football recruiting for late bloomers', 'football recruiting after a torn ACL',
  'football recruiting for homeschool athletes', 'football recruiting for international players',
];

const generated = [];
// templated combos
for (const p of POSITIONS) {
  generated.push(`best recruiting help for high school ${p}`);
  generated.push(`how to get recruited as a high school ${p.replace(/s$/, '')}`);
  generated.push(`top high school ${p} recruits 2027`);
  generated.push(`best recruiting service for ${p}`);
}
for (const c of CLASSES) {
  generated.push(`class of ${c} football recruiting rankings`);
  generated.push(`top class of ${c} football recruits`);
  generated.push(`class of ${c} football recruiting timeline`);
  generated.push(`best uncommitted class of ${c} football recruits`);
}
for (const s of STATES) {
  generated.push(`${s} high school football recruiting`);
  generated.push(`best ${s} football recruits 2027`);
  generated.push(`${s} football recruiting rankings`);
}
for (const d of DIVISIONS) {
  generated.push(`${d} football recruiting requirements`);
  generated.push(`${d} football recruiting timeline`);
}
for (const pf of PLATFORMS) {
  generated.push(`${pf} football recruiting review`);
  generated.push(`how to use ${pf} for football recruiting`);
}

const all = [...CURATED, ...generated];
// dedup vs existing + within new set
const fresh = [];
const localSeen = new Set();
for (const phrase of all) {
  const n = norm(phrase);
  if (seen.has(n) || localSeen.has(n)) continue;
  localSeen.add(n);
  fresh.push(phrase);
}

const NEW = fresh.slice(0, 200);
console.log(`existing=${existing.length} candidates=${all.length} fresh=${fresh.length} taking=${NEW.length}`);
console.log('sample:', NEW.slice(0, 10));

if (process.argv.includes('--write')) {
  if (NEW.length < 200) { console.error(`ONLY ${NEW.length} fresh phrases (<200) — add more candidates.`); process.exit(1); }
  const merged = [...existing, ...NEW];
  fs.writeFileSync(PATH, JSON.stringify(merged, null, 2));
  console.log(`WROTE ${PATH} total=${merged.length}`);
}
