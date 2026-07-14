// _gtm100_gen.js — generate 100 NEW GTM Playbook Q&A-ESSAYS (pillar gp, golden q11133), one per
// industry NOT already covered. Dupe-checks against existing gp questions FIRST (owner rule).
// Serial through the FULL 13/13 pipeline via POST /urgent. Resume-safe (_gtm100_done.json).
'use strict';
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const API = 'http://localhost:8899/urgent';
const DONE_F = WD + '/_gtm100_done.json';
const sleep = ms => new Promise(r => setTimeout(r, ms));

// 110 distinct business verticals (buffer over 100 in case some are already covered)
const INDUSTRIES = [
  'dental practices','HVAC contractors','law firms','accounting firms','med spas','veterinary clinics','independent gyms','full-service restaurants','craft breweries','residential solar installers',
  'roofing contractors','plumbing companies','commercial landscaping','auto repair shops','car washes','franchise brands','DTC e-commerce brands','third-party logistics providers','freight brokerages','trucking fleets',
  'commercial construction firms','real estate brokerages','property management companies','independent insurance agencies','mortgage brokerages','registered investment advisors','wealth management firms','fintech lenders','insurtech startups','proptech platforms',
  'telehealth providers','home health agencies','senior living communities','childcare centers','edtech platforms','private tutoring companies','online universities','nonprofit organizations','govtech vendors','defense contractors',
  'aerospace suppliers','industrial equipment manufacturers','specialty chemical makers','agtech startups','food and beverage CPG brands','online grocery services','specialty retail chains','apparel and fashion brands','beauty and cosmetics brands','fine jewelry retailers',
  'furniture retailers','consumer electronics brands','video game studios','streaming media platforms','digital publishers','independent music labels','esports organizations','event production companies','boutique hotels','tour and travel operators',
  'regional airlines','cruise lines','quick-service restaurant chains','corporate catering companies','cannabis dispensaries','wine and spirits brands','specialty coffee roasters','boutique fitness studios','mental health platforms','optometry practices',
  'dermatology clinics','plastic surgery centers','chiropractic clinics','physical therapy practices','independent pharmacies','pet care and grooming chains','pest control companies','commercial cleaning services','security and alarm companies','moving and storage companies',
  'waste management firms','solar energy developers','oil and gas services','regional utilities','internet service providers','cybersecurity vendors','vertical SaaS platforms','data and analytics platforms','developer tools startups','marketing technology vendors',
  'HR technology platforms','legal technology vendors','supply chain software','procurement platforms','B2B marketplaces','staffing and recruiting agencies','professional employer organizations','payroll providers','digital banks','credit unions',
  'payments processors','commercial real estate developers','residential homebuilders','architecture firms','engineering consultancies','management consulting firms','marketing agencies','public relations firms','industrial distributors','medical device manufacturers',
];

const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ');
async function main() {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const gpQ = (idx.entries || []).filter(e => e && e.id && /^gp\d/i.test(e.id)).map(e => norm(e.question || e.title));
  const done = (() => { try { return JSON.parse(fs.readFileSync(DONE_F, 'utf8')); } catch (e) { return []; } })();
  const doneSet = new Set(done);
  // dupe filter: skip an industry if any existing gp question already names it, or we've done it this run
  const singular = w => w.replace(/ies$/, 'y').replace(/s$/, '');
  const fresh = INDUSTRIES.filter(ind => {
    const key = norm(ind);
    if (doneSet.has(key)) return false;
    const core = singular(key.split(' ').slice(-1)[0]);   // last word core (e.g. "practices"->"practice")
    return !gpQ.some(q => q.includes(core) && q.includes(norm(ind).split(' ')[0]));
  });
  const target = fresh.slice(0, 100);
  console.log('[gtm100] existing gp=' + gpQ.length + '  candidates fresh=' + fresh.length + '  will generate=' + target.length);
  let cert = 0, fail = 0;
  for (let i = 0; i < target.length; i++) {
    const ind = target[i];
    const question = 'What is the go-to-market playbook for ' + ind + ' in 2027?';
    process.stdout.write('[gtm100] ' + (i + 1) + '/' + target.length + '  ' + ind + ' … ');
    try {
      const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: '4444', pillar: 'gp', question, essayOnly: true }), signal: AbortSignal.timeout(900000) });
      const j = await r.json();
      const st = j && j.result && j.result.status;
      if (st === 'certified' || st === 'green') { cert++; console.log('CERTIFIED ' + (j.result.id || '') + ' ' + (j.result.score || '') + '/13'); doneSet.add(norm(ind)); fs.writeFileSync(DONE_F, JSON.stringify([...doneSet])); }
      else { fail++; console.log('NOT-CERT (' + st + ') ' + ((j.result && j.result.notes) || (j.error) || '')); }
    } catch (e) { fail++; console.log('ERR ' + e.message); }
    await sleep(3000);
  }
  console.log('[gtm100] DONE  certified=' + cert + '  not-certified=' + fail);
}
main().catch(e => { console.error('[gtm100] FATAL', e.message); process.exit(1); });
