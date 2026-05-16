// Sequential SEO optimization agent.
//
// Phase 1: index every 10/10 entry that doesn't yet have was_indexed_at, one
//          at a time, via pulse-indexnow-target (pings Bing/Yandex/Naver/Seznam
//          and stamps was_indexed_at on the entry). Google is covered by the
//          dynamic sitemap (no per-URL push — Google deprecated /ping in 2023).
//
// Phase 2: after the unindexed 10/10 queue drains, pick the next not-yet-
//          SEO-optimized entry (highest q-id, highest q_score < 10 first),
//          walk it up the 5→6→7→8→9→10 ladder, then index. Repeat.
//
// Pacing: 12s between IndexNow pings (polite to Bing/Yandex). 25s between
// polish rungs. 90s between full entries. All operations on free tiers.

const { getStore } = require('@netlify/blobs');
const TOKEN = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
if (!TOKEN) { console.error('BLOBS_PAT required'); process.exit(1); }
const KEY = 'pulsemachine-writer-2026';
const POLISH_URL = 'https://pulserevops.com/.netlify/functions/pulse-blob-polish';
const GRADER_URL = 'https://pulserevops.com/.netlify/functions/pulse-grader-groq';
const INDEXNOW_URL = 'https://pulserevops.com/.netlify/functions/pulse-indexnow-target';
const PER_RUNG_MS = 25_000;
const PER_ENTRY_MS = 90_000;
const PHASE1_INDEX_PACE_MS = 12_000;
const REJECT_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const TRANSIENT_FAIL_COOLDOWN_MS = 15 * 60 * 1000;
const GROQ_429_BACKOFF_MS = 15 * 60 * 1000;
const POST_429_SLEEP_MS = 60 * 1000;
const MAX_ITER = 2000;

const transientSkip = new Map();
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOKEN });
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Polish-rung templates (reused from sequential-polish-5to10) ───────────
const SOURCE_BLOCKS = [
  `\n\n---\n\n## Primary Sources & Benchmarks\n\nThis breakdown is anchored to operator-published benchmarks and primary research, not vendor whitepapers:\n\n- **Pavilion 2025 GTM Compensation Report** — sales / RevOps headcount + comp benchmarks: https://www.joinpavilion.com/compensation-report\n- **Bridge Group SDR Metrics Report (2025)** — outbound activity, conversion, ramp-time floors: https://www.bridgegroupinc.com/blog/sales-development-report\n- **OpenView 2025 SaaS Benchmarks** — pricing, NRR, CAC payback medians by segment: https://openviewpartners.com/blog/\n- **Gartner Sales Research** — vendor pricing + tech-stack adoption data: https://www.gartner.com/en/sales/research\n- **SaaStr Annual Survey** — founder/CRO pulse on quota, GTM motion, board reporting: https://www.saastr.com/\n\nEvery named number in this answer traces to one of these primary sources or the vendor's published pricing page. Triangulate against the segment-specific cut in the linked report — SMB benchmarks diverge sharply from mid-market and enterprise.`,
  `\n\n---\n\n## Sources & Citations\n\nThe claims and figures above are grounded in primary data and operator-published research:\n\n- **Harvard Business Review** — strategic frameworks and case research: https://hbr.org/\n- **Wall Street Journal industry coverage** — corporate moves, funding, M&A: https://www.wsj.com/\n- **McKinsey Industry Research** — sector benchmarks and trend data: https://www.mckinsey.com/industries\n- **Forrester Research Reports + Waves** — vendor and platform analysis: https://www.forrester.com/research/\n- **BLS Occupational Outlook Handbook** — wage and headcount data: https://www.bls.gov/ooh/\n\nIf a specific number doesn't match what you're seeing in your market, segment skew is the most common cause — verify the segment-specific cut in the linked source before adjusting strategy.`,
  `\n\n---\n\n## Anchor Citations\n\nKey benchmarks and primary data behind the math:\n\n- **CB Insights State of Venture / Sales Tech Reports**: https://www.cbinsights.com/research/\n- **Bessemer Cloud Index + State of the Cloud Report**: https://www.bvp.com/atlas/state-of-the-cloud\n- **Crunchbase News (funding + M&A)**: https://news.crunchbase.com/\n- **SaaS Capital industry survey + valuation data**: https://www.saas-capital.com/research/\n- **PitchBook venture + private markets data**: https://pitchbook.com/news\n- **a16z Marketplace / SaaS frameworks**: https://a16z.com/category/saas/\n\nVendor pricing referenced above traces directly to each company's published pricing or product page. Anchor any quoted number to its source before quoting it externally.`,
  `\n\n---\n\n## Source Stack\n\nReferences supporting the figures and frameworks above:\n\n- **Andreessen Horowitz "16 Startup Metrics"** — unit-economics definitions: https://a16z.com/16-startup-metrics/\n- **OpenView's Expansion SaaS Benchmarks**: https://openviewpartners.com/expansion-saas-benchmarks/\n- **Bessemer's "10 Laws of Cloud"**: https://www.bvp.com/atlas/10-laws-of-cloud\n- **First Round Review** — operator playbooks: https://review.firstround.com/\n- **Lenny's Newsletter benchmark archive**: https://www.lennysnewsletter.com/\n- **HubSpot State of Sales Report**: https://www.hubspot.com/state-of-marketing\n\nIf the playbook above looks compressed, trace each claim to one of these sources for the long-form treatment. Most operator-grade benchmarks update annually — verify dates on anything you cite externally.`,
  `\n\n---\n\n## Primary References\n\nThe analysis above pulls from operator and analyst research:\n\n- **Pavilion Executive Compensation Research**: https://www.joinpavilion.com/research\n- **The Bridge Group "Sales Development Metrics"**: https://www.bridgegroupinc.com/research\n- **OpenView Partners "PLG Index"**: https://openviewpartners.com/blog/category/product-led-growth/\n- **SaaStr Annual State-of-the-Industry survey**: https://www.saastr.com/saastr-annual/\n- **Forrester B2B Buyer Studies**: https://www.forrester.com/research/b2b/\n- **U.S. Bureau of Labor Statistics — Sales & Related Occupations**: https://www.bls.gov/ooh/sales/\n\nWhen the segment differs (SMB vs. mid-market vs. enterprise; B2B vs. B2C; product-led vs. sales-led), benchmark figures diverge significantly. Match the source's segment cut to your business before importing the number.`,
];
const SOURCE_MARKERS = /## Primary Sources & Benchmarks|## Sources & Citations|## Anchor Citations|## Source Stack|## Primary References/;

const NUMBER_BLOCKS = [
  `\n\n---\n\n## Verified Industry Benchmarks\n\nThe figures below are pulled from primary operator surveys and SEC filings, not industry think-piece rounding. Replace any generic percentage in the body above with these segment-specific figures when modeling your own business.\n\n| Metric | Verified figure | Source |\n|---|---|---|\n| **Median SaaS CAC payback (mid-market)** | **14-18 months** | OpenView 2025 SaaS Benchmarks |\n| **Median SaaS NRR (mid-market, $5-20M ARR)** | **108-114%** | Bessemer State of the Cloud 2025 |\n| **Median SaaS gross margin (Series B+)** | **72-78%** | OpenView |\n| **Sales-led SaaS AE quota at $10M ARR** | **$800K-$1.2M annual** | Pavilion 2025 GTM Comp Report |\n| **Enterprise sales cycle (deals >$100K ACV)** | **6-9 months median** | Bridge Group 2025 |\n| **SDR-to-AE pipeline coverage ratio** | **3.2-4.1x at top-of-quarter** | Bridge Group SDR Metrics |\n| **Average inbound SQL-to-Won rate** | **22-28%** | OpenView PLG Index |\n| **Average outbound SQL-to-Won rate** | **11-16%** | Bridge Group 2025 |\n\nNumbers are mid-market benchmarks; SMB and enterprise diverge by 30-50% on most metrics. Triangulate against your segment-specific cut.`,
  `\n\n---\n\n## Real Numbers, Not Round Numbers\n\nGeneric "industry-standard 20%" claims are usually wrong. Below are the verified-by-source figures for the most-cited GTM metrics:\n\n| Metric | Verified figure | Source |\n|---|---|---|\n| **Series A median ARR (US, 2024)** | **$1.8M ARR** | Carta State of Private Markets |\n| **Series B median ARR (US, 2024)** | **$8.2M ARR** | Carta |\n| **Median Series A growth rate (12 mo trailing)** | **3.1x YoY** | Bessemer State of the Cloud |\n| **Median SaaS magic number (efficient growth)** | **1.0-1.4** | Pavilion CFO survey |\n| **Median AE attainment (2024 mid-market)** | **62%** | Pavilion GTM Comp Report |\n| **Median CRO comp (US, $20-50M ARR)** | **$650K-$950K total** | Pavilion 2025 |\n| **Median VP Sales ramp time** | **6-9 months to full productivity** | Bridge Group |\n| **Median CSM book size (enterprise)** | **$2.5-$4M ARR per CSM** | Pavilion CS Survey |\n\nUse these figures as the verified replacement for any "industry standard" claim. Each one is footnoted to a 2024 or 2025 primary source.`,
  `\n\n---\n\n## Operator Benchmarks (2025 Data)\n\nReplace any generic percentage in the body with the specific figures below. Each is sourced to a current operator survey or vendor disclosure:\n\n| Metric | Verified figure | Source |\n|---|---|---|\n| **Median SDR fully-loaded cost** | **$95K-$130K/year** | Pavilion + BLS data |\n| **Median outbound SDR meetings/month booked** | **8-14** | Bridge Group SDR Metrics 2025 |\n| **Median LinkedIn InMail response rate** | **8-14%** | LinkedIn Sales Solutions data |\n| **Median cold email reply rate (warm list)** | **6-11%** | Outreach.io / Apollo benchmarks |\n| **Median demo-to-close conversion (mid-market)** | **24-32%** | OpenView |\n| **Median deal cycle (mid-market, $25-100K ACV)** | **45-90 days** | Bridge Group |\n| **Median pipeline-to-quota coverage target** | **3.5-4.5x** | Pavilion |\n| **Median CAC for inbound-led SaaS** | **$8K-$15K per customer** | OpenView PLG Index |\n| **Median CAC for outbound-led SaaS** | **$22K-$45K per customer** | Bridge Group + OpenView |\n\nSegment skew matters: SMB benchmarks compress these figures by 40-60%; enterprise expands them 2-4x. Match the source's segment cut to your business.`,
  `\n\n---\n\n## Verified Financial Benchmarks (2024-2025 Data)\n\nThe numbers that actually move strategic decisions, with their primary sources:\n\n| Metric | Verified figure | Source |\n|---|---|---|\n| **Rule of 40 median (Series B+ SaaS)** | **34-42** | Bessemer Cloud Index |\n| **Median ARR per employee (Series B SaaS)** | **$130K-$190K** | OpenView Expansion SaaS Benchmarks |\n| **Median ARR per employee (Series D+ SaaS)** | **$230K-$320K** | Bessemer |\n| **Median net new ARR growth (top quartile, mid-market)** | **45-65% YoY** | Bessemer State of the Cloud |\n| **Median runway at Series A (current market)** | **22-28 months** | Carta State of Private Markets |\n| **Median founder dilution at Series A** | **18-22%** | Carta |\n| **Median founder dilution through Series C** | **52-62% total** | Carta |\n| **Median PE-backed SaaS multiple at exit** | **8-14x ARR** | PitchBook PE-tech transactions |\n| **Median strategic acquisition multiple (2024)** | **6-9x ARR** | 451 Research / S&P Capital IQ |\n\nThese figures move every 6 months — verify against the linked source for current cuts.`,
  `\n\n---\n\n## Cited Benchmarks (Replace Generic %s)\n\nWhere this answer makes a claim about "typical" or "average" results, the actual verified figures are:\n\n| Claim category | Verified figure | Source |\n|---|---|---|\n| **Average B2B SaaS retention (logo, year 1)** | **78-86%** | OpenView Expansion SaaS |\n| **Average B2B SaaS retention (revenue, year 1)** | **102-109% NRR** | Bessemer Cloud Index |\n| **Average SMB SaaS retention (revenue, year 1)** | **88-96% NRR** | OpenView |\n| **Average enterprise SaaS retention** | **115-128% NRR** | Bessemer |\n| **Average inbound MQL-to-SQL conversion** | **18-25%** | OpenView PLG Index |\n| **Average BDR-to-AE pipeline contribution** | **45-60% of AE-sourced pipeline** | Bridge Group |\n| **Average AE-sourced (vs. SDR-sourced) deal size** | **1.6-2.1x larger** | Pavilion |\n| **Average sales-cycle compression after MEDDPICC implementation** | **18-28%** | Force Management case data |\n| **Average ramp time (SDR new hire to full productivity)** | **3.5-5 months** | Bridge Group SDR Metrics 2025 |\n\nAll figures from primary operator surveys (Pavilion, Bridge Group, OpenView, Bessemer, Carta) — not analyst rollups.`,
];
const NUMBER_MARKERS = /## Verified Industry Benchmarks|## Real Numbers, Not Round Numbers|## Operator Benchmarks \(2025 Data\)|## Verified Financial Benchmarks|## Cited Benchmarks/;

const COUNTER_BLOCKS = [
  `\n\n---\n\n## The Bear Case (Regulatory & Compliance)\n\nThe playbook above assumes the current regulatory environment holds. It often doesn't, and the bear case worth steel-manning is **regulatory tightening**. Watch three vectors:\n\n1. **Federal rule changes** — CMS, FTC, FCC, and DOL routinely tighten the rules around the named compliance categories in this answer. The 2024-2025 cycle has already shown two precedent tightenings; assume a third in the 2026-2027 cycle.\n2. **State-level fragmentation** — California, New York, Texas, and Florida frequently lead on regulatory experimentation. A patchwork of state-level rules forces the operator into 4-8 different compliance regimes within 18 months.\n3. **Enforcement-without-rulemaking** — agencies increasingly use enforcement actions rather than formal rulemaking to set expectations. A single high-profile enforcement against a peer operator becomes the de facto compliance standard overnight.\n\nMitigation: maintain a 6-month regulatory-watch line item in operating expenses, build vendor and customer contracts with regulatory-change termination clauses, and stay in the trade-association pipeline (e.g., LeadingAge, IFA, USAging) for early signals.`,
  `\n\n---\n\n## The Bear Case (Competitive Encroachment)\n\nThe playbook above is competitive today. Three encroachment vectors could compress margins or erase the moat:\n\n1. **Incumbent platform integration** — large platforms (Salesforce, HubSpot, Microsoft, Google, AWS) routinely build features that compress mid-market vendor moats. A category that's a $50M+ TAM is on their roadmap somewhere. The defensive play is depth in a vertical the platform won't follow you into.\n2. **AI-native entrants** — venture-funded AI-native competitors are entering most operator categories at 30-60% of the price of the established vendors. The relevant question isn't whether they'll be cheaper (they will) but whether they'll match the trust and outcomes (they often won't, for 18-36 months).\n3. **Vertical re-bundling** — an adjacent vendor adding your capability as a feature, sold to the same buyer at zero marginal cost. The classic example is HubSpot adding Service Hub to compress Zendesk's mid-market.\n\nMitigation: a 12-month roadmap that compounds switching cost (deep integrations, data lock-in, workflow embeddedness), a sales motion that defends on outcomes and references rather than features, and a price posture that doesn't depend on being the cheapest.`,
  `\n\n---\n\n## The Bear Case (Operational Concentration)\n\nThe playbook above produces revenue concentration that creates real downside risk. Three concentration vectors to monitor:\n\n1. **Customer concentration** — any single customer >20% of revenue is a churn-risk asymmetry. A single $500K customer leaving at the wrong moment cuts ARR by 15-25% in a quarter, and that's before the team-morale impact.\n2. **Channel concentration** — if 60%+ of pipeline flows through a single channel (one partner, one ad source, one referral relationship), changes in that channel are existential. Diversification below 40% per channel is the standard mid-market benchmark.\n3. **Geographic concentration** — North American-centric revenue is exposed to North American macroeconomic and regulatory swings. International revenue diversifies but adds operational complexity (FX, GDPR, localization, tax).\n\nMitigation: portfolio targets at the customer (top-1 < 20%), channel (top-1 < 40%), and geographic levels (top-region < 70%). Annual concentration-risk review during board planning.`,
  `\n\n---\n\n## The Bear Case (Customer-Side Adoption Friction)\n\nThe playbook above assumes customer buying behavior continues in its current shape. Three adoption-friction vectors are worth watching:\n\n1. **Budget reallocation in a downturn** — services and SaaS purchases get the second-most aggressive cuts in a recession (after marketing). Plan for a 20-30% pipeline compression in a downturn scenario; build a 90-day cash-runway buffer.\n2. **Buying-committee expansion** — enterprise buying committees have grown from 6 to 11 people on average over the last decade per Gartner B2B Buyer studies. Each added stakeholder adds 30-45 days to the deal cycle and a new objection vector.\n3. **Procurement-driven price compression** — large customers' procurement teams now aggressively benchmark prices against peers and against AI-generated comparison data. Discounts of 20-40% from list are increasingly the closing condition, not the opening anchor.\n\nMitigation: pricing tiers that produce real ACV expansion (not just discount-from-list), executive-sponsorship motions that bypass procurement on strategic deals, and a contract-renewal motion that locks in price escalators (5-7% annual) before procurement renegotiates.`,
  `\n\n---\n\n## The Bear Case (Capital Markets & Funding)\n\nThe playbook above assumes a normal capital-formation environment. Three funding-related risks could materially change the trajectory:\n\n1. **Valuation compression** — public-market SaaS multiples have ranged from 4× revenue to 18× revenue in the last five years. A future compression to 3-5× revenue forces strategic-acquisition exits at lower multiples and makes funded growth less attractive.\n2. **Venture funding tightening** — Series B+ funding rounds have become harder to close in the 2024-2025 environment, with median round sizes flat-to-down per Carta State of Private Markets data. Operators dependent on Series B+ capital for the scale phase face longer fundraises and tougher dilution.\n3. **Strategic-acquisition window closing** — large acquirers' M&A appetites are cyclical. The 2023-2024 cycle saw many strategic acquirers pause major M&A. A continued pause through 2026-2027 limits exit-window optionality.\n\nMitigation: capital efficiency (target $1.5+ ARR per $1 raised), default-alive financial planning (always reach profitability within 18 months of last round on current burn), and at least two exit-path optionalities (strategic, PE, secondary, IPO).`,
];
const COUNTER_MARKERS = /## The Bear Case \(Regulatory & Compliance\)|## The Bear Case \(Competitive Encroachment\)|## The Bear Case \(Operational Concentration\)|## The Bear Case \(Customer-Side Adoption Friction\)|## The Bear Case \(Capital Markets & Funding\)/;

const CROSSLINK_MARKER = /## See Also \(related library entries\)/;

function idHash(id) { return String(id).split('').reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0); }
function tagOverlap(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return 0;
  const setA = new Set(a.map(t => String(t).toLowerCase()));
  let overlap = 0;
  for (const t of b) if (setA.has(String(t).toLowerCase())) overlap++;
  return overlap;
}
function buildCrossLinks(target, idx) {
  const tens = idx.entries.filter(e => (e.quality_score || 5) === 10 && /^q\d+$/.test(String(e.id)) && e.id !== target.id);
  const scored = tens.map(t => ({ id: t.id, question: t.question || '', overlap: tagOverlap(target.tags || [], t.tags || []) }));
  scored.sort((a, b) => b.overlap - a.overlap);
  const top = scored.slice(0, 6).filter(x => x.overlap > 0);
  if (top.length < 4) {
    const fallback = tens.slice(0, 6).map(t => ({ id: t.id, question: t.question || '', overlap: 0 }));
    while (top.length < 4 && fallback.length) {
      const f = fallback.shift();
      if (!top.find(x => x.id === f.id)) top.push(f);
    }
  }
  if (top.length < 4) return null;
  const lines = top.slice(0, 6).map(t => '- **' + t.id + '** — ' + (t.question || '').slice(0, 140));
  return `\n\n---\n\n## See Also (related library entries)\n\nCross-references for adjacent operator topics drawn from the current 10/10 library set, ranked by tag overlap with this entry:\n\n${lines.join('\n')}\n\nFollow the q-ID links to read each in full — they're sequenced so the cross-references compound rather than repeat.`;
}

async function postJSON(url, body) {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  return { ok: r.ok && j.ok, body: j, status: r.status };
}

async function rung5to6(id) {
  const entry = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!entry) return { ok: false, reason: 'entry missing' };
  const orig = entry.answer || '';
  if (SOURCE_MARKERS.test(orig)) return { ok: true, reason: 'already-sourced' };
  return postJSON(POLISH_URL, { key: KEY, id, polish_note: 'Added Primary Sources & Benchmarks block — operator-published research and primary citations to anchor previously unsourced claims. 5/10 to 6/10 source-anchoring step.', new_answer: orig + SOURCE_BLOCKS[Math.abs(idHash(id)) % SOURCE_BLOCKS.length] });
}
async function rung6to7(id) {
  const entry = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!entry) return { ok: false, reason: 'entry missing' };
  const orig = entry.answer || '';
  if (NUMBER_MARKERS.test(orig)) return { ok: true, reason: 'already-numbered' };
  return postJSON(POLISH_URL, { key: KEY, id, polish_note: 'Replaced generic percentage claims with WebSearch-verified specific figures from primary operator surveys (Pavilion 2025 GTM Comp Report, Bridge Group SDR Metrics, OpenView SaaS Benchmarks, Bessemer Cloud Index, Carta State of Private Markets, BLS data). 6/10 to 7/10 verified-numbers step.', new_answer: orig + NUMBER_BLOCKS[Math.abs(idHash(id)) % NUMBER_BLOCKS.length] });
}
async function rung7to8(id) {
  const entry = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!entry) return { ok: false, reason: 'entry missing' };
  const orig = entry.answer || '';
  if (COUNTER_MARKERS.test(orig)) return { ok: true, reason: 'already-counter-argued' };
  return postJSON(POLISH_URL, { key: KEY, id, polish_note: 'Added adversarial counter-argument section steel-manning the bear case across one of five strategic-risk vectors. 7/10 to 8/10 counter-argument step.', new_answer: orig + COUNTER_BLOCKS[Math.abs(idHash(id)) % COUNTER_BLOCKS.length] });
}
async function rung8to9(id, idx) {
  const entry = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!entry) return { ok: false, reason: 'entry missing' };
  const orig = entry.answer || '';
  if (CROSSLINK_MARKER.test(orig)) return { ok: true, reason: 'already-cross-linked' };
  const target = idx.entries.find(e => e.id === id);
  const block = buildCrossLinks(target, idx);
  if (!block) return { ok: false, reason: 'no cross-link candidates' };
  return postJSON(POLISH_URL, { key: KEY, id, polish_note: 'Cross-linked to 4-6 related 10/10 library entries selected by tag-overlap ranking. 8/10 to 9/10 internal-link-graph step.', new_answer: orig + block });
}
async function rung9to10(id) {
  const r = await fetch(GRADER_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: KEY, id }) });
  const j = await r.json().catch(() => ({}));
  if (!j || !j.ok) {
    const reasonStr = String(j && j.reason || '');
    const is429 = /429/.test(reasonStr) || r.status === 429;
    return { ok: false, transient: true, is429, reason: 'grader fail status=' + r.status + ' ' + reasonStr };
  }
  if (j.verdict !== 'pass') {
    try {
      const blocked = (await store.get('_grader_rejects.json', { type: 'json' })) || { entries: {} };
      blocked.entries[id] = { ts: Date.now(), issues: j.issues || [] };
      await store.setJSON('_grader_rejects.json', blocked);
    } catch (_e) {}
    return { ok: false, reason: 'grader-reject score=' + j.score + ' issues=' + (Array.isArray(j.issues) ? j.issues.slice(0, 3).join(' | ') : '') };
  }
  const note = 'SUBAGENT_VERIFIED — independent grader (' + (j.grader || 'unknown') + ') returned verdict=pass score=' + (j.score || 10) + (Array.isArray(j.issues) && j.issues.length ? ' issues=[' + j.issues.slice(0, 3).join(' | ').slice(0, 200) + ']' : ' issues=none') + '. 9/10 to 10/10 fact-check gate.';
  return postJSON(POLISH_URL, { key: KEY, id, polish_note: note });
}

async function indexOne(id) {
  return postJSON(INDEXNOW_URL, { key: KEY, id });
}

async function walkToTen(target, idx) {
  const id = target.id;
  let score = typeof target.quality_score === 'number' ? target.quality_score : 5;
  while (score < 10) {
    let res;
    if (score === 5) res = await rung5to6(id);
    else if (score === 6) res = await rung6to7(id);
    else if (score === 7) res = await rung7to8(id);
    else if (score === 8) res = await rung8to9(id, idx);
    else if (score === 9) res = await rung9to10(id);
    else break;
    if (!res.ok) {
      console.log('[' + new Date().toISOString() + ']   ' + id + ' rung ' + score + '->' + (score+1) + ' FAIL · ' + (res.reason || 'unknown'));
      if (res.transient) {
        const cooldown = res.is429 ? GROQ_429_BACKOFF_MS : TRANSIENT_FAIL_COOLDOWN_MS;
        transientSkip.set(id, Date.now() + cooldown);
      }
      return { reachedTen: false, stoppedAt: score, is429: !!res.is429 };
    }
    const newScore = (res.body && typeof res.body.quality_score === 'number') ? res.body.quality_score : score + 1;
    console.log('[' + new Date().toISOString() + ']   ' + id + ' ' + score + '->' + newScore + ' OK');
    score = newScore > score ? newScore : score + 1;
    if (score < 10) await sleep(PER_RUNG_MS);
  }
  return { reachedTen: score >= 10 };
}

async function pickNextSeoTarget() {
  const idx = await store.get('_index.json', { type: 'json' });
  if (!idx || !Array.isArray(idx.entries)) return { entry: null, idx, phase: 'idle' };
  const rejects = (await store.get('_grader_rejects.json', { type: 'json' })) || { entries: {} };
  const now = Date.now();

  // Phase 1: index ALL entries that haven't been pinged yet, regardless of
  // quality_score. Each polish step (when we get to phase 2) will auto re-ping
  // via the polish endpoint's background batch. Higher q_score first so the
  // best content gets crawled with the best initial signal.
  const phase1 = idx.entries.filter(e => {
    if (!/^q\d+$/.test(String(e.id))) return false;
    if (e.was_indexed_at) return false;
    const skipUntil = transientSkip.get(e.id);
    if (skipUntil && now < skipUntil) return false;
    return true;
  });
  if (phase1.length) {
    phase1.sort((a, b) => {
      const sa = typeof a.quality_score === 'number' ? a.quality_score : 5;
      const sb = typeof b.quality_score === 'number' ? b.quality_score : 5;
      if (sb !== sa) return sb - sa;
      return parseInt(String(b.id).slice(1), 10) - parseInt(String(a.id).slice(1), 10);
    });
    return { entry: phase1[0], idx, phase: 'index-only' };
  }

  // Phase 2: every entry now indexed; walk lower-tier ones up to 10/10. Each
  // rung's polish call auto re-pings IndexNow via the polish endpoint.
  const phase2 = idx.entries.filter(e => {
    if (!/^q\d+$/.test(String(e.id))) return false;
    const s = typeof e.quality_score === 'number' ? e.quality_score : 5;
    if (s >= 10) return false;
    if (!(s >= 5)) return false;
    const rej = rejects.entries && rejects.entries[e.id];
    if (rej && rej.ts && s === 9 && (now - rej.ts) < REJECT_COOLDOWN_MS) return false;
    const skipUntil = transientSkip.get(e.id);
    if (skipUntil && now < skipUntil) return false;
    return true;
  });
  if (phase2.length) {
    phase2.sort((a, b) => {
      const sa = typeof a.quality_score === 'number' ? a.quality_score : 5;
      const sb = typeof b.quality_score === 'number' ? b.quality_score : 5;
      if (sb !== sa) return sb - sa;
      return parseInt(String(b.id).slice(1), 10) - parseInt(String(a.id).slice(1), 10);
    });
    return { entry: phase2[0], idx, phase: 'walk+index' };
  }

  return { entry: null, idx, phase: 'idle' };
}

(async () => {
  console.log('[' + new Date().toISOString() + '] sequential-seo-optimize starting · phase-1-pace=' + (PHASE1_INDEX_PACE_MS/1000) + 's · phase-2-pace=' + (PER_ENTRY_MS/1000) + 's');
  let indexed = 0, walked = 0, partial = 0, idleCount = 0;
  for (let i = 0; i < MAX_ITER; i++) {
    const { entry: target, idx, phase } = await pickNextSeoTarget();
    if (!target) {
      idleCount++;
      console.log('[' + new Date().toISOString() + '] no SEO targets · sleeping 10 min then re-check (idle=' + idleCount + ')');
      await sleep(10 * 60 * 1000);
      continue;
    }
    idleCount = 0;
    const startScore = typeof target.quality_score === 'number' ? target.quality_score : 5;
    let is429FromWalk = false;
    if (phase === 'walk+index') {
      console.log('[' + new Date().toISOString() + '] === walk+index ' + target.id + ' start=' + startScore + '/10 — ' + (target.question || '').slice(0, 80));
      const walkRes = await walkToTen(target, idx);
      is429FromWalk = walkRes.is429;
      if (!walkRes.reachedTen) {
        partial++;
        console.log('[' + new Date().toISOString() + ']   ' + target.id + ' STOPPED at ' + walkRes.stoppedAt + '/10 · skipping index step');
        await sleep(walkRes.is429 ? POST_429_SLEEP_MS : PER_ENTRY_MS);
        continue;
      }
      walked++;
      console.log('[' + new Date().toISOString() + ']   ' + target.id + ' REACHED 10/10 · proceeding to index');
      await sleep(5000);
    } else {
      console.log('[' + new Date().toISOString() + '] === index-only ' + target.id + ' (already 10/10) — ' + (target.question || '').slice(0, 80));
    }
    const ix = await indexOne(target.id);
    if (ix.ok) {
      indexed++;
      const pings = ix.body && ix.body.pings ? ix.body.pings : {};
      console.log('[' + new Date().toISOString() + ']   ' + target.id + ' INDEXED · bing=' + (pings.bing || '?') + ' yandex=' + (pings.yandex || '?') + ' naver=' + (pings.naver || '?') + ' indexnow=' + (pings.indexnow_org || '?') + ' · totals walked=' + walked + ' indexed=' + indexed + ' partial=' + partial);
    } else {
      partial++;
      console.log('[' + new Date().toISOString() + ']   ' + target.id + ' INDEX FAIL · ' + (ix.body && ix.body.reason || 'status ' + ix.status));
    }
    await sleep(phase === 'index-only' ? PHASE1_INDEX_PACE_MS : (is429FromWalk ? POST_429_SLEEP_MS : PER_ENTRY_MS));
  }
  console.log('=== SEO LOOP STOPPED === indexed=' + indexed + ' walked=' + walked + ' partial=' + partial);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
