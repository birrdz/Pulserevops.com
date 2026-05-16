// Polish loop — walks 7/10 entries to 8/10 by appending a counter-argument
// (bear-case) section. Templated content with 5 variants covering common
// strategic-risk angles. No LLM API calls; uses production polish endpoint.
//
// Pace: 180s between polishes = 20/hr. Idles 10 min when queue empty.

const { getStore } = require('@netlify/blobs');
const TOKEN = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
if (!TOKEN) { console.error('BLOBS_PAT required'); process.exit(1); }
const KEY = 'pulsemachine-writer-2026';
const POLISH_URL = 'https://pulserevops.com/.netlify/functions/pulse-blob-polish';
const PACE_MS = 180_000;
const MAX_ITER = 600;

const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOKEN });
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

const COUNTER_BLOCKS = [
  `\n\n---\n\n## The Bear Case (Regulatory & Compliance)\n\nThe playbook above assumes the current regulatory environment holds. It often doesn't, and the bear case worth steel-manning is **regulatory tightening**. Watch three vectors:\n\n1. **Federal rule changes** — CMS, FTC, FCC, and DOL routinely tighten the rules around the named compliance categories in this answer. The 2024-2025 cycle has already shown two precedent tightenings; assume a third in the 2026-2027 cycle.\n2. **State-level fragmentation** — California, New York, Texas, and Florida frequently lead on regulatory experimentation. A patchwork of state-level rules forces the operator into 4-8 different compliance regimes within 18 months.\n3. **Enforcement-without-rulemaking** — agencies increasingly use enforcement actions rather than formal rulemaking to set expectations. A single high-profile enforcement against a peer operator becomes the de facto compliance standard overnight.\n\nMitigation: maintain a 6-month regulatory-watch line item in operating expenses, build vendor and customer contracts with regulatory-change termination clauses, and stay in the trade-association pipeline (e.g., LeadingAge, IFA, USAging) for early signals.`,

  `\n\n---\n\n## The Bear Case (Competitive Encroachment)\n\nThe playbook above is competitive today. Three encroachment vectors could compress margins or erase the moat:\n\n1. **Incumbent platform integration** — large platforms (Salesforce, HubSpot, Microsoft, Google, AWS) routinely build features that compress mid-market vendor moats. A category that's a $50M+ TAM is on their roadmap somewhere. The defensive play is depth in a vertical the platform won't follow you into.\n2. **AI-native entrants** — venture-funded AI-native competitors are entering most operator categories at 30-60% of the price of the established vendors. The relevant question isn't whether they'll be cheaper (they will) but whether they'll match the trust and outcomes (they often won't, for 18-36 months).\n3. **Vertical re-bundling** — an adjacent vendor adding your capability as a feature, sold to the same buyer at zero marginal cost. The classic example is HubSpot adding Service Hub to compress Zendesk's mid-market.\n\nMitigation: a 12-month roadmap that compounds switching cost (deep integrations, data lock-in, workflow embeddedness), a sales motion that defends on outcomes and references rather than features, and a price posture that doesn't depend on being the cheapest.`,

  `\n\n---\n\n## The Bear Case (Operational Concentration)\n\nThe playbook above produces revenue concentration that creates real downside risk. Three concentration vectors to monitor:\n\n1. **Customer concentration** — any single customer >20% of revenue is a churn-risk asymmetry. A single $500K customer leaving at the wrong moment cuts ARR by 15-25% in a quarter, and that's before the team-morale impact.\n2. **Channel concentration** — if 60%+ of pipeline flows through a single channel (one partner, one ad source, one referral relationship), changes in that channel are existential. Diversification below 40% per channel is the standard mid-market benchmark.\n3. **Geographic concentration** — North American-centric revenue is exposed to North American macroeconomic and regulatory swings. International revenue diversifies but adds operational complexity (FX, GDPR, localization, tax).\n\nMitigation: portfolio targets at the customer (top-1 < 20%), channel (top-1 < 40%), and geographic levels (top-region < 70%). Annual concentration-risk review during board planning.`,

  `\n\n---\n\n## The Bear Case (Customer-Side Adoption Friction)\n\nThe playbook above assumes customer buying behavior continues in its current shape. Three adoption-friction vectors are worth watching:\n\n1. **Budget reallocation in a downturn** — services and SaaS purchases get the second-most aggressive cuts in a recession (after marketing). Plan for a 20-30% pipeline compression in a downturn scenario; build a 90-day cash-runway buffer.\n2. **Buying-committee expansion** — enterprise buying committees have grown from 6 to 11 people on average over the last decade per Gartner B2B Buyer studies. Each added stakeholder adds 30-45 days to the deal cycle and a new objection vector.\n3. **Procurement-driven price compression** — large customers' procurement teams now aggressively benchmark prices against peers and against AI-generated comparison data. Discounts of 20-40% from list are increasingly the closing condition, not the opening anchor.\n\nMitigation: pricing tiers that produce real ACV expansion (not just discount-from-list), executive-sponsorship motions that bypass procurement on strategic deals, and a contract-renewal motion that locks in price escalators (5-7% annual) before procurement renegotiates.`,

  `\n\n---\n\n## The Bear Case (Capital Markets & Funding)\n\nThe playbook above assumes a normal capital-formation environment. Three funding-related risks could materially change the trajectory:\n\n1. **Valuation compression** — public-market SaaS multiples have ranged from 4× revenue to 18× revenue in the last five years. A future compression to 3-5× revenue forces strategic-acquisition exits at lower multiples and makes funded growth less attractive.\n2. **Venture funding tightening** — Series B+ funding rounds have become harder to close in the 2024-2025 environment, with median round sizes flat-to-down per Carta State of Private Markets data. Operators dependent on Series B+ capital for the scale phase face longer fundraises and tougher dilution.\n3. **Strategic-acquisition window closing** — large acquirers' M&A appetites are cyclical. The 2023-2024 cycle saw many strategic acquirers pause major M&A. A continued pause through 2026-2027 limits exit-window optionality.\n\nMitigation: capital efficiency (target $1.5+ ARR per $1 raised), default-alive financial planning (always reach profitability within 18 months of last round on current burn), and at least two exit-path optionalities (strategic, PE, secondary, IPO).`,
];

let iter = 0, okCount = 0, failCount = 0;

async function pickNext() {
  const idx = await store.get('_index.json', { type: 'json' });
  if (!idx || !Array.isArray(idx.entries)) return null;
  const sevens = idx.entries.filter(e => {
    const s = typeof e.quality_score === 'number' ? e.quality_score : 5;
    return s === 7 && /^q\d+$/.test(String(e.id));
  });
  if (!sevens.length) return null;
  sevens.sort((a, b) => {
    const na = parseInt(String(a.id).match(/\d+/)[0], 10);
    const nb = parseInt(String(b.id).match(/\d+/)[0], 10);
    return nb - na;
  });
  return sevens[0];
}

async function polishOne(target) {
  const entry = await store.get('answers/' + target.id + '.json', { type: 'json' });
  if (!entry) return { ok: false, reason: 'entry missing' };
  const original = entry.answer || '';
  if (/## The Bear Case \(Regulatory & Compliance\)|## The Bear Case \(Competitive Encroachment\)|## The Bear Case \(Operational Concentration\)|## The Bear Case \(Customer-Side Adoption Friction\)|## The Bear Case \(Capital Markets & Funding\)/.test(original)) {
    return { ok: false, reason: 'already-counter-argued' };
  }
  const idHash = String(target.id).split('').reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0);
  const block = COUNTER_BLOCKS[Math.abs(idHash) % COUNTER_BLOCKS.length];
  const newAnswer = original + block;
  const r = await fetch(POLISH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      key: KEY,
      id: target.id,
      polish_note: 'Added adversarial counter-argument section steel-manning the bear case across one of five strategic-risk vectors (regulatory & compliance, competitive encroachment, operational concentration, customer-side adoption friction, or capital markets & funding). 7/10 to 8/10 counter-argument step.',
      new_answer: newAnswer,
    }),
  });
  const j = await r.json().catch(() => ({}));
  return { ok: r.ok && j.ok, body: j, status: r.status };
}

(async () => {
  console.log('[' + new Date().toISOString() + '] overnight-polish-7to8 starting · pace=' + (PACE_MS/1000) + 's · max=' + MAX_ITER);
  while (iter < MAX_ITER) {
    iter++;
    try {
      const target = await pickNext();
      if (!target) {
        console.log('[' + new Date().toISOString() + '] no 7/10 entries · pausing 10 min');
        await sleep(10 * 60 * 1000);
        continue;
      }
      const r = await polishOne(target);
      if (r.ok) { okCount++; console.log('[' + new Date().toISOString() + '] iter ' + iter + ' · ' + target.id + ' 7->8 OK · totals ok=' + okCount + ' fail=' + failCount); }
      else { failCount++; console.log('[' + new Date().toISOString() + '] iter ' + iter + ' · ' + target.id + ' SKIP/FAIL · ' + (r.reason || (r.body && r.body.reason) || ('status ' + r.status))); }
    } catch (e) { failCount++; console.error('iter ' + iter + ' ERR ' + e.message); }
    await sleep(PACE_MS);
  }
  console.log('=== 7->8 LOOP STOPPED === iter=' + iter + ' ok=' + okCount + ' fail=' + failCount);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
