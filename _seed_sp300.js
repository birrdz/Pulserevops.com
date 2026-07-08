// _seed_sp300.js — generate 300 NEW unique Speeches (sp) titles, deduped against
// the live sp catalog, and write them to _sp_sprint_queue300.json with reserved
// IDs sp0101+. Titles are real speech/toast occasions across many categories.
// The Claude writer (_write_sp.js) then drafts each body to the gold grader.
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const norm = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const slug = s => norm(s).replace(/\s+/g, '-').slice(0, 60);

const T = [];
// Wedding party
['the Groom','the Bride','a Best Man','a Maid of Honor','the Father of the Bride','the Mother of the Bride','the Father of the Groom','the Mother of the Groom','a Best Woman','a Man of Honor','the Officiant','a Bridesmaid','a Groomsman','a Wedding Rehearsal Dinner','a Second Marriage','a Small Backyard Wedding','a Destination Wedding','a Same-Sex Wedding','a Surprise Wedding','a Vow Renewal']
  .forEach(x => T.push(`A Wedding Speech for ${x}`));
// Toasts (life events)
['a 30th Birthday','a 40th Birthday','a 50th Birthday','a 60th Birthday','a 70th Birthday','an 80th Birthday','a 90th Birthday','a 100th Birthday','a Sweet Sixteen','a 21st Birthday','a Surprise Birthday Party','a Milestone Wedding Anniversary','a 25th Anniversary','a 50th Anniversary','an Engagement Party','a Housewarming','a Retirement Dinner','a Going-Away Party','a New Year’s Eve Gathering','a Thanksgiving Dinner','a Holiday Office Party','a Graduation Party','a Baby Shower','a Gender Reveal','a Christening','a Bar Mitzvah','a Bat Mitzvah','a Quinceañera','a First Communion','a Family Reunion']
  .forEach(x => T.push(`A Toast for ${x}`));
// Eulogies / memorials
['a Parent','a Mother','a Father','a Grandparent','a Spouse','a Sibling','a Child','a Close Friend','a Colleague','a Mentor','a Beloved Teacher','a Veteran','a Community Leader','a Family Pet','a Coworker Who Died Young','a Grandmother Who Raised You']
  .forEach(x => T.push(`A Eulogy for ${x}`));
// Graduation
['a High School Graduation','a College Commencement','a Valedictorian','a Kindergarten Graduation','a Nursing School Pinning','an MBA Graduation','a Trade School Completion','a Graduate as the Class President','a Homeschool Graduation','a PhD Defense Celebration']
  .forEach(x => T.push(`A Graduation Speech for ${x}`));
// Retirement by role
['a Teacher','a Nurse','a Police Officer','a Firefighter','a Military Officer','a CEO','a Small Business Owner','a Factory Worker','a Pastor','a Coach','a Doctor','a Long-Serving Employee','a Government Worker','a Union Member','a Flight Attendant']
  .forEach(x => T.push(`A Retirement Speech for ${x}`));
// Business / workplace
['a Sales Kickoff','a Company All-Hands','a Product Launch','an Award Ceremony','an Employee of the Year','a Team Offsite Kickoff','a Farewell to a Departing Colleague','Welcoming a New Hire','a Promotion Announcement','a Company 10th Anniversary','an IPO Celebration','a Board Dinner','a Customer Appreciation Event','a Conference Opening Keynote','a Project Wrap Celebration','a Layoff Announcement with Compassion','a Merger Town Hall','Accepting an Industry Award','a Mentor Recognition','a Volunteer Appreciation Night']
  .forEach(x => T.push(`A Speech for ${x}`));
// Community / sports / civic
['a Youth Sports Banquet','a Championship Celebration','a Coach’s End-of-Season Talk','a Charity Fundraiser','a Nonprofit Gala','a Scout Eagle Court of Honor','a Club Induction','a City Council Swearing-In','a Ribbon-Cutting','a Memorial Day Ceremony','a Veterans Day Tribute','a Fourth of July Gathering','a Neighborhood Block Party','a Church Anniversary','a PTA Meeting','a Library Reopening','a Hall of Fame Induction','a Little League Opening Day','a Rotary Club Meeting','a Town Hall on a Local Issue']
  .forEach(x => T.push(`A Speech for ${x}`));
// Famous speeches (analysis — pillar's "Famous Speeches" angle)
['Lincoln’s Gettysburg Address','Martin Luther King Jr.’s “I Have a Dream”','Churchill’s “We Shall Fight on the Beaches”','JFK’s Inaugural Address','Steve Jobs’ Stanford Commencement','Nelson Mandela’s Inauguration Speech','FDR’s “Nothing to Fear”','Susan B. Anthony’s “On Women’s Right to Vote”','Reagan’s “Tear Down This Wall”','Maya Angelou’s “On the Pulse of Morning”','Winston Churchill’s “Their Finest Hour”','David Foster Wallace’s “This Is Water”','Theodore Roosevelt’s “The Man in the Arena”','Sojourner Truth’s “Ain’t I a Woman?”','Patrick Henry’s “Give Me Liberty”']
  .forEach(x => T.push(`What Makes ${x} a Great Speech`));
// How-to guides
['Open a Speech with a Story','Land a Joke in a Toast','Write a Speech in 30 Minutes','Beat Public-Speaking Nerves','End a Speech Memorably','Give an Impromptu Toast','Use the Rule of Three in a Speech','Write a Heartfelt Eulogy When You’re Grieving','Tailor a Toast to the Audience','Practice a Speech So It Sounds Natural','Keep a Wedding Toast Under Three Minutes','Add Humor to a Retirement Speech','Quote Someone Without Sounding Cliche','Structure a Best Man Speech','Handle a Hostile Audience','Write a Toast for Someone You Barely Know','Memorize a Speech Without Notecards','Recover When You Lose Your Place','Make a Virtual Toast Land on Video','Write a Bilingual Wedding Toast','Write a Speech Your Audience Remembers','Choose the Right Tone for a Eulogy','Cut a Speech Down to Time','Use Pauses for Effect','Write a Toast That Isn’t Cheesy','Tell a Story That Lands an Emotional Point','Calm Your Hands and Voice on Stage','Open with a Question That Hooks the Room','Close a Business Speech with a Call to Action','Read the Room and Adjust on the Fly']
  .forEach(x => T.push(`How to ${x}`));
// Birthday speeches by relationship
['Mom','Dad','a Grandmother','a Grandfather','a Best Friend','a Spouse','a Daughter','a Son','a Sister','a Brother','a Coworker','a Boss','a Mentor','a Twin','an Aunt','an Uncle']
  .forEach(x => T.push(`A Birthday Speech for ${x}`));
// Anniversary toasts by milestone
['a 1st Anniversary','a 5th Anniversary','a 10th Anniversary','a 20th Anniversary','a 30th Anniversary','a 40th Anniversary','a 60th Anniversary','a Parents’ Anniversary','a Work Anniversary','a Company Founding Anniversary']
  .forEach(x => T.push(`A Toast for ${x}`));
// Holiday & cultural toasts
['Mother’s Day','Father’s Day','Easter Dinner','Hanukkah','Diwali','Eid al-Fitr','Lunar New Year','Juneteenth','a Friendsgiving','a Christmas Eve Dinner','a New Year’s Day Brunch','a Halloween Party','a Cinco de Mayo Gathering','a St. Patrick’s Day Party','an Oktoberfest Celebration']
  .forEach(x => T.push(`A Toast for ${x}`));
// Acceptance speeches by award
['a Lifetime Achievement Award','a Sports MVP Award','an Academic Scholarship','a Volunteer of the Year Award','an Industry Innovation Award','a Teacher of the Year Award','a Sales Rep of the Year Award','a Community Service Medal','a Hall of Fame Honor','a Film or Arts Award']
  .forEach(x => T.push(`An Acceptance Speech for ${x}`));
// Welcome & farewell
['a New CEO','a New Team Member','International New Hires','a New Pastor','a New School Principal','a Foreign Exchange Student','a New Club President','New Recruits at Orientation','a Returning Veteran','a New Daughter-in-Law']
  .forEach(x => T.push(`A Welcome Speech for ${x}`));
['a Departing CEO','a Beloved Teacher Leaving','a Coworker Moving Away','a Coach Stepping Down','a Pastor Relocating','an Exchange Student Going Home','a Friend Moving Abroad','a Manager Taking a New Role','a Soldier Deploying','a Long-Time Neighbor Moving']
  .forEach(x => T.push(`A Farewell Speech for ${x}`));
// Sports banquet / coach by sport
['a Soccer Team','a Basketball Team','a Football Team','a Baseball Team','a Volleyball Team','a Swim Team','a Track Team','a Hockey Team','a Wrestling Team','a Youth Cheer Squad','a Gymnastics Team','a Tennis Team']
  .forEach(x => T.push(`A Coach’s End-of-Season Speech for ${x}`));
// More business occasions
['a Quarterly Business Review','a Startup Pitch Day','an Investor Update Dinner','a Diversity & Inclusion Event','a Safety Milestone Celebration','a Store Grand Opening','a Franchise Convention','a Partner Kickoff','an Onboarding Welcome','a Recognition Lunch','a Holiday Bonus Announcement','a Return-to-Office Town Hall']
  .forEach(x => T.push(`A Speech for ${x}`));
// Life-milestone toasts
['a New Baby’s Arrival','an Adoption Celebration','Becoming a Citizen','Buying a First Home','Starting a New Job','Beating an Illness','Finishing a Marathon','Opening a New Business','Paying Off a Mortgage','Moving Into a Dream Home','a Military Homecoming','Passing the Bar Exam','Earning a Black Belt','Completing Basic Training','a Confirmation','a Baptism','a Naming Ceremony','an Empty-Nest Send-Off','a Divorce-Recovery Celebration','a Sober Anniversary']
  .forEach(x => T.push(`A Toast for ${x}`));
// More eulogies
['a Beloved Coach','a Lifelong Best Friend','a Family Patriarch','a Family Matriarch','a Young Person Gone Too Soon','a Devoted Volunteer','a War Hero','a Small-Town Doctor','a Favorite Aunt','a First Responder']
  .forEach(x => T.push(`A Eulogy for ${x}`));
// More famous speeches
['Barbara Jordan’s 1976 DNC Keynote','Mary Fisher’s “A Whisper of AIDS”','Elie Wiesel’s “The Perils of Indifference”','General MacArthur’s “Duty, Honor, Country”','Robert Kennedy’s Speech on MLK’s Death','Lou Gehrig’s “Luckiest Man” Speech','Chief Joseph’s “I Will Fight No More Forever”','Frederick Douglass’s “What to the Slave Is the Fourth of July?”','Emmeline Pankhurst’s “Freedom or Death”','Greta Thunberg’s “How Dare You”']
  .forEach(x => T.push(`What Makes ${x} a Great Speech`));

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const have = new Set(idx.entries.filter(e => e && e.question).map(e => norm(e.question)));
  let maxId = 0;
  for (const e of idx.entries) { const m = String(e.id).match(/^sp(\d+)$/); if (m) maxId = Math.max(maxId, +m[1]); }
  // unique + not already present
  const seen = new Set(); const fresh = [];
  for (const t of T) { const n = norm(t); if (seen.has(n) || have.has(n)) continue; seen.add(n); fresh.push(t); }
  const take = fresh.slice(0, 300);
  const queue = take.map((title, i) => { const id = 'sp' + String(maxId + 1 + i).padStart(4, '0'); return { id, title, slug: slug(title) }; });
  fs.writeFileSync('C:/Users/koryj/website/_sp_sprint_queue300.json', JSON.stringify(queue, null, 2));
  console.log(`generated ${T.length} candidates, ${fresh.length} fresh, took ${queue.length}. IDs ${queue[0] && queue[0].id}..${queue[queue.length-1] && queue[queue.length-1].id}`);
  console.log('sample:', queue.slice(0, 5).map(q => q.id + ' ' + q.title).join(' | '));
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
