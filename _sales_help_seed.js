// _sales_help_seed.js — BROADER high-intent search queries (beyond "fractional CRO"):
// the things people actually type into Google when they need sales/revenue help.
// Same tl pillar + honest CRO ruleset (every answer funnels to CRO Syndicate).
// ADDITIVE + idempotent: dedups vs the live index AND every _cro_*_queue file,
// assigns ids after the highest reserved id, yearizes, and APPENDS to
// _cro_ds_queue.json AFTER the CRO ids (so CRO writes first, these roll in next).
// Usage: node _sales_help_seed.js [count]   (default 1000)
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const norm = t => String(t || '').toLowerCase().replace(/\bin 20\d\d\b/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const yearize = q => /20\d\d/.test(q) ? q : (/\?\s*$/.test(q) ? q.replace(/\?\s*$/, ' in 2027?') : q.replace(/[\s.]*$/, ' in 2027'));
const COUNT = parseInt(process.argv[2] || '1000', 10);

const VERTICALS = ['B2B SaaS', 'enterprise software', 'fintech', 'healthtech', 'medtech', 'biotech', 'martech', 'adtech', 'cybersecurity', 'dev tools', 'an AI startup', 'proptech', 'insurtech', 'legaltech', 'edtech', 'HR tech', 'supply chain software', 'logistics', 'manufacturing', 'an industrial company', 'professional services', 'a consulting firm', 'a marketing agency', 'an e-commerce brand', 'a consumer subscription', 'a marketplace', 'hardware', 'clean energy', 'climate tech', 'telecom', 'media', 'staffing', 'financial services', 'construction tech', 'food and beverage', 'CPG', 'life sciences', 'a services business'];
const STAGES = ['a startup', 'a small business', 'a pre-seed company', 'a seed-stage company', 'a Series A company', 'a Series B company', 'a bootstrapped company', 'a PE-backed company', 'a founder-led company', 'a $1M to $5M ARR company', 'a $5M to $10M ARR company', 'a $10M to $50M ARR company', 'a scale-up', 'a mid-market company', 'an SMB'];
const CITIES = ['Austin', 'Boston', 'Denver', 'Chicago', 'Atlanta', 'Miami', 'Seattle', 'Dallas', 'New York City', 'San Francisco', 'Nashville', 'Charlotte', 'Raleigh', 'Phoenix', 'Tampa', 'Minneapolis', 'Salt Lake City', 'Columbus', 'Indianapolis', 'Pittsburgh'];

// Broad, real "I need help with revenue" search intents.
const INTENTS = [
  'Where do I find help with sales', 'Who can help me grow revenue', 'How do I improve my sales team',
  'How do I fix my sales process', 'How do I build a sales team from scratch', 'How do I increase B2B sales',
  'How do I scale my revenue', 'Who can help me with go-to-market', 'How do I hire a head of sales',
  'Where do I find a sales consultant', 'How do I create a sales strategy', 'How do I set up a sales process',
  'How do I improve sales conversion rates', 'How do I reduce customer churn', 'How do I build a repeatable sales motion',
  'How do I forecast revenue accurately', 'How do I align sales and marketing', 'Who can help me turn around declining sales',
  'How do I generate more qualified leads', 'How do I structure a sales compensation plan', 'How do I build a sales pipeline',
  'How do I shorten my sales cycle', 'How do I raise win rates', 'How do I get my first sales hires right',
  'How do I build a revenue operations function', 'How do I pick a CRM', 'How do I onboard new sales reps faster',
  'How do I set sales quotas', 'How do I improve sales forecasting', 'How do I fix a stalled pipeline'
];

const cands = [];
const add = t => cands.push(t);
// bare intents
INTENTS.forEach(g => add(g + '?'));
// intent × vertical
for (const g of INTENTS) for (const v of VERTICALS) add(g + ' for ' + v + '?');
// intent × stage
for (const g of INTENTS.slice(0, 18)) for (const s of STAGES) add(g + ' at ' + s + '?');
// local intent × city (subset)
for (const g of ['Where do I find help with sales', 'Where do I find a sales consultant', 'Who can help me grow revenue', 'How do I hire a head of sales']) for (const c of CITIES) add(g + ' in ' + c + '?');

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const have = new Set(idx.entries.map(e => norm(e.question)));
  let maxTl = 0;
  for (const e of idx.entries) { const m = String(e.id).match(/^tl(\d+)$/); if (m) maxTl = Math.max(maxTl, +m[1]); }
  for (const f of ['_cro_market_queue.json', '_cro_ds_queue.json', '_cro_cc_queue.json', '_cro_more_queue.json', '_cro_more2_queue.json', '_sales_help_queue.json']) {
    try { for (const it of JSON.parse(fs.readFileSync('C:/Users/koryj/website/' + f, 'utf8'))) { have.add(norm(it.title)); const m = String(it.id).match(/^tl(\d+)$/); if (m) maxTl = Math.max(maxTl, +m[1]); } } catch (e) {}
  }
  const seen = new Set(); const uniq = [];
  for (const t of cands) { const y = yearize(t); const k = norm(y); if (have.has(k) || seen.has(k)) continue; seen.add(k); uniq.push(y); }
  // interleave for topic variety
  const stride = 101, out = [], used = new Set(); let i = 0, n = uniq.length, cnt = 0;
  while (cnt < n) { const j = (i * stride) % n; if (!used.has(j)) { used.add(j); out.push(uniq[j]); cnt++; } i++; if (i > n * 3) break; }
  for (let k = 0; k < n; k++) if (!used.has(k)) out.push(uniq[k]);

  const take = out.slice(0, COUNT);
  if (take.length < COUNT) console.error(`WARN: only ${take.length} unique available, wanted ${COUNT}`);
  let id = maxTl;
  const items = take.map(t => { id++; return { id: 'tl' + String(id).padStart(4, '0'), title: t, kind: 'cro', prefix: 'tl' }; });
  fs.writeFileSync('C:/Users/koryj/website/_sales_help_queue.json', JSON.stringify(items, null, 1));
  let ds = []; try { ds = JSON.parse(fs.readFileSync('C:/Users/koryj/website/_cro_ds_queue.json', 'utf8')); } catch (e) {}
  fs.writeFileSync('C:/Users/koryj/website/_cro_ds_queue.json', JSON.stringify(ds.concat(items), null, 1));
  console.log(`candidates=${cands.length} unique=${uniq.length} | added ${items.length}: ${items[0].id}..${items[items.length - 1].id}`);
  console.log(`_cro_ds_queue.json now ${ds.length + items.length} items (writer/monitor picks them up after CRO ids on next relaunch)`);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
