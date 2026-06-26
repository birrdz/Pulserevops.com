// Generate _st_keyword_phrases.json — 300 Pulse Sales Trainings Top-10 SEO phrases.
const fs = require('fs');

const METHODOLOGIES = [
  'MEDDPICC', 'MEDDIC', 'Challenger Sale', 'SPIN Selling', 'Sandler', 'BANT', 'Gap Selling',
  'Value Selling', 'Solution Selling', 'Command of the Message', 'SNAP Selling', 'NEAT Selling',
  'Conceptual Selling', 'Target Account Selling', 'Miller Heiman', 'Challenger Customer',
];

const SKILLS = [
  'discovery call', 'cold call', 'demo', 'objection handling', 'closing', 'negotiation',
  'prospecting', 'qualification', 'follow-up', 'pipeline review', 'forecast call',
  'account planning', 'multi-threading', 'executive access', 'value proposition',
  'storytelling', 'presentation', 'role-play', 'call coaching', 'deal review',
];

const ROLES = [
  'SDR', 'BDR', 'AE', 'enterprise AE', 'mid-market AE', 'SMB AE', 'CSM', 'account manager',
  'sales manager', 'frontline manager', 'VP of Sales', 'RevOps', 'sales enablement',
  'new hire', 'ramping rep', 'underperformer',
];

const FORMATS = [
  'training drills', 'role-play scenarios', 'workshop agendas', 'facilitator guides',
  'training modules', 'skill drills', 'manager trainings', 'team exercises',
  'call frameworks', 'coaching scripts', 'training activities', 'bootcamp sessions',
];

const CONTEXTS = [
  'B2B SaaS', 'enterprise software', 'mid-market', 'SMB', 'PLG handoff', 'channel sales',
  'inside sales', 'field sales', 'remote sales team', 'hybrid sales org',
];

const pools = [];
for (const m of METHODOLOGIES) {
  pools.push(`Top 10 ${m} sales training drills for AEs`);
  pools.push(`Best ${m} training exercises for sales managers`);
}
for (const s of SKILLS) {
  pools.push(`Top 10 ${s} training drills for B2B sales reps`);
  pools.push(`Best ${s} role-play scenarios for sales teams`);
}
for (const r of ROLES) {
  for (const f of FORMATS.slice(0, 4)) {
    pools.push(`Top 10 ${r} ${f} for 2027`);
  }
}
for (const c of CONTEXTS) {
  pools.push(`Top 10 sales training workshops for ${c} teams`);
  pools.push(`Best sales enablement drills for ${c} reps`);
}
for (const m of METHODOLOGIES) {
  for (const s of SKILLS.slice(0, 8)) {
    pools.push(`Top 10 ${m} ${s} training activities`);
  }
}

const EXTRA = [
  'How to run a 60-minute sales training on discovery',
  'How to run a sales role-play workshop for managers',
  'Best sales training agenda for weekly team meeting',
  'Top sales manager pipeline review training formats',
  'Sales forecast training workshop for frontline managers',
  'MEDDPICC gap analysis drill for enterprise deals',
  'Challenger reframe training exercise for SaaS AEs',
  'Objection handling ladder drill for price pushback',
  'Multi-threading role-play for enterprise AEs',
  'Executive sponsor access training for complex deals',
  'Sandbagging forecast coaching training for managers',
  'CRM hygiene training drills for sales reps',
  'Cold call opening training modules for SDRs',
  'Voicemail and email combo prospecting drills',
  'Demo-to-close training workshop for AEs',
  'Mutual action plan training for late-stage deals',
  'Procurement negotiation role-play for enterprise sales',
  'Renewal and expansion training for CSMs',
  'QBR facilitation training for account managers',
  'Win-loss review training for sales leaders',
  'Sales onboarding bootcamp training modules',
  'Ramp plan training for first 90 days in sales',
  'Peer shadowing training program for new hires',
  'Call recording review training with Gong',
  'Conversation intelligence training for managers',
  'Sales methodology certification training paths',
  'Comp plan and SPIF training for sales managers',
  'Territory planning workshop training for AEs',
  'Account-based selling training drills',
  'Inbound lead response training for SDR teams',
  'Outbound sequence training for BDRs',
  'Social selling training exercises for reps',
  'LinkedIn prospecting training for SDRs',
  'Partner co-sell training for channel AEs',
  'Technical demo training for sales engineers',
  'MEDDPICC letter scoring drill for managers',
  'Champion-building training for complex B2B deals',
  'Economic buyer access training scenarios',
  'Decision process mapping training workshop',
  'Paper process and legal review training',
  'Competition displacement training drills',
  'Land-and-expand training for PLG handoff',
  'Usage-based pricing sales training modules',
  'Multi-year contract negotiation training',
  'Discount approval training for sales managers',
  'Pipeline generation training for AEs who prospect',
  'Activity metrics training without micromanaging',
  'Sales kickoff training session ideas',
  'Quarterly business review training for managers',
  'Sales hiring and interview role-play training',
];

const seen = new Set();
const out = [];
for (const p of [...pools, ...EXTRA]) {
  const t = p.trim();
  if (!t || seen.has(t)) continue;
  seen.add(t);
  out.push(t);
  if (out.length >= 300) break;
}
let n = 0;
while (out.length < 300) {
  const row = `Top 10 sales training drills for ${SKILLS[n % SKILLS.length]} — manager edition ${n + 1}`;
  if (!seen.has(row)) {
    seen.add(row);
    out.push(row);
  }
  n++;
}

fs.writeFileSync('C:/Users/koryj/website/_st_keyword_phrases.json', JSON.stringify(out, null, 2));
console.log('wrote', out.length, 'phrases');
