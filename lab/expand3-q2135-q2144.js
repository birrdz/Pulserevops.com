// expand3 — top up q2136, q2137, q2138 over the 2,500-word floor
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });

const MARKER = '## Building Skill Before You Start';

const additions = {
  q2136: `

## Building Skill Before You Start

The fastest route into competence is a deliberate apprenticeship rather than a cold start. Ride along with an established locksmith, work as a helper for an existing shop, or take structured training through ALOA and the major automotive-equipment manufacturers. The mechanical side — pinning, picking, impressioning, key-machine operation, master-key system design — is learnable in months of focused practice. The automotive side is an ongoing education because the vehicle landscape changes every model year; treat the programming-database subscriptions and continued learning as permanent parts of the job, not one-time hurdles. Commercial work — panic hardware, access control, electric strikes, master-key architecture — is the highest-skill, highest-margin layer and is worth deliberately building toward. The practical sequence most successful operators follow: get genuinely competent at residential and mechanical work, launch, add automotive within the first six months, and layer in commercial capability as the relationships and skills mature. Skipping the apprenticeship and learning entirely on paying customers is how operators damage their reputation in the first ninety days — exactly when the review base that carries the business is being built.`,

  q2137: `

## Building Skill And Knowledge Before You Start

Septic is a trade where the knowledge gap is as important as the equipment gap. Before you take the first job, spend real time learning how onsite systems actually work — conventional gravity systems, pump systems, aerobic treatment units, mound systems — because diagnosing a struggling system, not just emptying a tank, is what separates a pumper from a service company. Work alongside an established operator if you can, take NOWRA and state-extension training, and study your state's onsite wastewater code closely; the regulatory framework is detailed and the penalties for getting it wrong are serious. Learn to read a tank — the scum and sludge layers tell you the system's history — and learn to locate an unmarked tank quickly, because access time is a major driver of per-job profitability. The inspection side is its own skill set and often its own credential, and it is worth building toward because real-estate inspections are fast, high-margin, and a steady referral pipeline. The operators who treat septic as a knowledge business, not just a truck-and-hose business, are the ones who can sell the full service stack and command better pricing.`,

  q2138: `

## Building Skill Before You Start — Safety Is The Curriculum

There is no responsible way to enter garage door repair without first becoming genuinely competent, because the central task — torsion spring work — is dangerous enough to maim or kill an untrained person. The curriculum is specific: learn spring sizing (wire diameter, inside diameter, length, and how they translate to the door's weight and balance), learn correct winding-bar technique cold, learn cable and drum systems, learn opener mechanics and the increasingly connected logic boards, and learn to diagnose an off-track or out-of-balance door. The best path is an apprenticeship — ride along with an experienced tech, or work as a helper for an established shop — supplemented by International Door Association training and manufacturer programs from the major door and opener brands. Practice on your own and friends' doors until your spring work is procedural and unhurried. The operators who get hurt, or who hurt customers, are almost always the ones who took paid spring calls before the skill was genuinely automatic. Treat the training period as the real startup cost of this business — it is more important than the van, the tools, or the marketing.`,
};

(async () => {
  const idx = await store.get('_index.json', { type: 'json' });
  for (const id of Object.keys(additions)) {
    const e = await store.get('answers/' + id + '.json', { type: 'json' });
    if (e.answer.includes(MARKER) || e.answer.includes('## Building Skill And Knowledge Before You Start') || e.answer.includes('## Building Skill Before You Start — Safety')) { console.log(id + ' already topped up, skipping'); continue; }
    const ts = Date.now();
    e.answer = e.answer + additions[id];
    e.ts = ts;
    await store.setJSON('answers/' + id + '.json', e);
    const wc = e.answer.split(/\s+/).filter(Boolean).length;
    const i = idx.entries.findIndex(x => x.id === id);
    if (i >= 0) { idx.entries[i].ts = ts; idx.entries[i].last_modified_ms = ts; }
    console.log('topped up ' + id + ' :: now ' + wc + ' words');
  }
  await store.setJSON('_index.json', idx);
  console.log('=== DONE ===');
})().catch(e => { console.error('FATAL', e); process.exit(1); });
