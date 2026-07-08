// _seed_sy500.js — seed 500 NEW Pulse Style (sy) "What to Wear" topics, deduped vs
// the live index, ids assigned from max sy id + 1. Output: _sy_sprint_queue500.json
// (array of {id,title}). Titles end in "in 2027" (year-at-end law). Run once AFTER
// the existing sy ids are settled (reads live max id).
require('./_loadenv.js');
const fs = require('fs');
const { getStore } = require('@netlify/blobs');

// Occasion pools — real, searchable "what to wear" intents across life, not just work.
const OCC = [
  // Weddings & related
  'a Summer Wedding','a Winter Wedding','a Beach Wedding','a Black-Tie Wedding','a Garden Wedding','a Courthouse Wedding','a Backyard Wedding','a Rehearsal Dinner','a Bridal Shower','an Engagement Party','a Vow Renewal','a Destination Wedding','a Wedding as a Guest','an Evening Wedding','a Daytime Wedding','a Fall Wedding','a Cocktail-Attire Wedding','a Wedding After-Party',
  // Funerals & solemn
  'a Funeral','a Memorial Service','a Celebration of Life','a Wake','a Catholic Funeral','a Graveside Service',
  // Dates & romance
  'a First Date','a Dinner Date','a Coffee Date','a Second Date','an Anniversary Dinner','Valentine\'s Day','a Double Date','a Date at a Nice Restaurant','Meeting the Parents','a Blind Date',
  // Holidays & seasonal gatherings
  'Thanksgiving Dinner','Christmas Dinner','a Christmas Party','New Year\'s Eve','a Holiday Office Party','Easter Brunch','a Fourth of July Cookout','a Halloween Party','a Hanukkah Dinner','a Diwali Celebration','Lunar New Year',
  // Religious & cultural
  'Church on Sunday','a Baptism','a Christening','a Bar or Bat Mitzvah','a Quinceañera','a Confirmation','a First Communion','an Indian Wedding','a Mosque Visit','a Temple Visit','a Baby Naming',
  // Travel & destinations
  'a Trip to Paris','a Trip to Italy','a Trip to Tokyo','a Caribbean Vacation','a European City Break','a Safari','a Cruise','a Tropical Resort','a Ski Trip','a Desert Trip','a Beach Vacation','a Road Trip','Long-Haul Flights','a Weekend City Trip','a Mountain Getaway','a Wine Country Trip',
  // Seasons & weather
  'a Hot Summer Day','a Rainy Day','a Cold Winter Day','a Humid Day','a Windy Day','Transitional Fall Weather','an Early Spring Day','Unpredictable Weather','a Snowy Day','a Heat Wave',
  // Family & milestones
  'a Graduation Ceremony','a College Graduation','a High School Reunion','a Family Reunion','a Baby Shower','a Gender Reveal','a Kid\'s Birthday Party','a 50th Birthday Party','a Retirement Party','a Housewarming Party','a Milestone Birthday','Family Photos',
  // Social & nightlife
  'a Cocktail Party','a Dinner Party','a Rooftop Party','a House Party','a Nightclub','a Wine Tasting','a Brewery Tour','a Speakeasy','Brunch with Friends','a Garden Party','a Yacht Party','a Pool Party','a Networking Mixer',
  // Arts, performance, spectator
  'the Opera','a Broadway Show','a Symphony','an Art Gallery Opening','a Museum','a Movie Premiere','a Comedy Show','a Concert','a Music Festival','a Jazz Club','the Ballet','a Book Launch',
  // Sports & active
  'a Golf Outing','a Tennis Match','a Day at the Races','a Football Game','a Baseball Game','a Yoga Class','the Gym','a Hiking Trip','a Tailgate','Watching the Game at a Bar','a Country Club','a Polo Match',
  // Practical / life admin
  'a Doctor\'s Appointment','Jury Duty','a Court Appearance','a DMV Visit','Signing on a House Closing','a Bank Meeting','a Parent-Teacher Conference','a College Tour','an Open House','Moving Day',
  // Body type / fit guidance (universal pages)
  'a Petite Frame','a Tall Frame','a Plus-Size Figure','a Pear Body Shape','an Athletic Build','an Apple Body Shape','a Broad-Shouldered Build','a Short-Waisted Frame',
  // Work scenarios not in the first 100
  'a Conference','a Trade Show','a Company Offsite','a Holiday Bonus Review','a Performance Review','Public Speaking','a Keynote Talk','a Panel Discussion','a Headshot Session','a Sales Pitch','a Factory Tour','a Site Inspection','a Video Interview','a Coworking Space','Casual Fridays','a Client Dinner','a Business Trip','an Investor Meeting','a Demo Day','a Pitch Competition',
  // Work — first days, roles & industry-specific (high search intent)
  'Your First Day at a New Job','Your First Day at an Office Job','a Remote Job Video Interview','Working from Home on Video Calls','a Real Estate Showing','a Teaching Interview','a Nursing Interview','a Law Firm Interview','a Consulting Interview','a Tech Startup Interview','a Finance Interview','a Government Job Interview','a Career Fair','a Networking Lunch','an Industry Conference','a Sales Kickoff','an All-Hands Meeting','a Work Happy Hour','a Creative Agency Office','a Law Office','a Hospital Administrative Role','a Construction Site Visit','a Bank Branch Role','a Government Office Job','a Nonprofit Office','a Real Estate Closing','a Property Walkthrough','a Restaurant Management Role','a Retail Management Role','a Startup Demo Day','a Corporate Training Session','a Mentor Coffee Meeting','an Exit Interview Follow-Up','a Promotion Announcement','a Leadership Retreat','an Award Ceremony at Work','a Company Holiday Gala',
  // Sports & casual social branches (owner: baseball game with friends, etc.)
  'a Basketball Game','a Hockey Game','a Soccer Match','a Baseball Game with Friends','an Orioles Game with Friends','a Golf Tournament as a Spectator','a College Game Day','a Super Bowl Party','March Madness Watch Party','a Boxing or UFC Watch Party','a Sports Bar with Coworkers','a Pickup Basketball Game','a Recreational Softball League','a Bowling Night','a Trivia Night','a Karaoke Night','a Casual Friday Lunch Out','a Weekend Farmers Market','a Coffee Shop to Work Remotely',
  // More travel cities
  'a Trip to London','a Trip to New York City','a Trip to Dubai','a Trip to Greece','a Trip to Mexico City','a Trip to Las Vegas','a Trip to Miami','a Trip to Nashville','a Trip to New Orleans','a Trip to Charleston','a Trip to San Francisco','a Trip to Chicago','a Trip to Barcelona','a Trip to Amsterdam','a Trip to Iceland','a Business Trip to a Warm Climate','a Business Trip in Winter',
  // More dates & romance
  'a Speed Dating Event','a Picnic Date','a Brewery Date','a Museum Date','an Outdoor Concert Date','a Mini-Golf Date','a Coffee-to-Dinner Date',
];

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const sy = idx.entries.filter(e => /^sy\d+$/.test(e.id));
  const have = new Set(sy.map(e => norm(e.question)));
  let maxId = sy.map(e => parseInt(e.id.slice(2))).sort((a, b) => b - a)[0] || 100;

  const titles = OCC.map(o => `What to Wear to ${o} in 2027`.replace('to a Hot','for a Hot').replace('to a Rainy','for a Rainy').replace('to a Cold','for a Cold').replace('to a Humid','for a Humid').replace('to a Windy','for a Windy').replace('to Transitional','for Transitional').replace('to an Early','for an Early').replace('to Unpredictable','for Unpredictable').replace('to a Snowy','for a Snowy').replace('to a Heat','for a Heat').replace('to a Petite','for a Petite').replace('to a Tall','for a Tall').replace('to a Plus-Size','for a Plus-Size').replace('to a Pear','for a Pear').replace('to an Athletic','for an Athletic').replace('to an Apple','for an Apple').replace('to a Broad','for a Broad').replace('to a Short-Waisted','for a Short-Waisted').replace('to Long-Haul','for Long-Haul').replace('to Casual Fridays','for Casual Fridays').replace('to Public Speaking','for Public Speaking').replace('to Moving Day','for Moving Day').replace('to Family Photos','for Family Photos'));

  const queue = [];
  for (const t of titles) {
    if (have.has(norm(t))) continue;
    have.add(norm(t));
    maxId++;
    queue.push({ id: 'sy' + String(maxId).padStart(4, '0'), title: t });
  }
  fs.writeFileSync('_sy_sprint_queue500.json', JSON.stringify(queue, null, 1));
  console.log(`seeded ${queue.length} new sy topics → _sy_sprint_queue500.json`);
  console.log(`id range: ${queue[0] && queue[0].id} .. ${queue[queue.length - 1] && queue[queue.length - 1].id}`);
  console.log('sample:', queue.slice(0, 4).map(q => q.id + ': ' + q.title).join(' | '));
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
