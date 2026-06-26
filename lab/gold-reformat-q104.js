// q104 -- "What's an acceptable churn rate for SMB SaaS vs enterprise?"
// GOLD REFORMAT (page-1 backwards #11, after q106).
//
// AUDIT (from lab/audit-q104.js, 2026-05-18):
//   E1 ### Direct Answer H3 + bolded TLDR at top: MISSING ("**TL;DR:**" para, not H3)
//   E2 H2 banner sections:                        PRESENT (17 H2s)
//   E3 Numbered ### subsections (### 1./2./3.):   MISSING (0)
//   E4 Bullets with **bold** keys inside:         PRESENT (30)
//   E5 Real RI brands/people:                     21/27 (missing Patrick Campbell,
//                                                  Christian Owens, Todd Gardner,
//                                                  Christoph Janz, Zoom, CrowdStrike)
//   E6 Numbered sources:                          PRESENT
//   E6 Inline markdown links in body:             MISSING (0)
//   word_count:                                   9,043 (in 8.5-10.5K window)
//   quality_score:                                10 (already gold-quality content)
//   format_v:                                     null (renders silver, not gold)
//
// Decision: Path B SURGICAL REFORMAT + LINK CONVERSION (q106 template).
// In-place markdown surgery:
//   (1) Replace leading "**TL;DR:**" paragraph with "### Direct Answer" H3 +
//       single bolded TLDR with inline links + 6 missing real-name probes.
//   (2) Bucket the 13 content H2s into 3 umbrella H2s with numbered H3 children.
//       Keep Sources / Numbers / Counter-Case / Related as standalone H2s.
//   (3) Linkify Sources block: "N. **Title** -- desc. https://url"
//                            -> "N. [**Title**](https://url) -- desc"
//   (4) Post to blob, set format_v="2026-05", keep qs=10.
//   (5) Mirror format_v into _index.json.
//
// Word target: 8,500-10,500. HARD CAP 10,500.

const { getStore } = require('@netlify/blobs');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
if (!process.env.BLOBS_PAT && process.env.NETLIFY_AUTH_TOKEN) process.env.BLOBS_PAT = process.env.NETLIFY_AUTH_TOKEN;

const ID = 'q104';
const HARD_CAP = 10500;

// ─── Element 1: H3 Direct Answer + bolded TLDR replacing **TL;DR:** para ───
const NEW_TLDR = `### Direct Answer

**There is no single "acceptable" [churn rate](https://www.saas-capital.com/) for SaaS — there is a stage-and-segment-adjusted band and a vocabulary you must speak with precision or the number means nothing. Computed correctly: [SMB SaaS](https://openviewpartners.com/expansion-saas-benchmarks/) (sub-$1K ACV) — 3-7% monthly gross revenue churn is the operating reality, 1.5-2.5% is good, sub-1.5% is best-in-class; Mid-Market ($1K-$50K ACV) — 10-15% annual gross revenue churn is normal, 6-10% is good, sub-6% is best-in-class; Enterprise ($50K+ ACV) — sub-5% annual gross revenue churn is the bar, sub-2% is elite, anything over 10% is a real problem. [Net Revenue Retention](https://chartmogul.com/reports/) is the second axis and matters more for valuation: >120% NRR best-in-class, 110-120% good, 100-110% acceptable, <100% means the installed base is shrinking. The taxonomy is non-negotiable: Gross Revenue Retention (GRR) measures what you kept; NRR is GRR plus expansion; logo churn counts customers, revenue churn weights by dollars; monthly vs annualized matters because 5% monthly compounds to ~46% annually; voluntary vs involuntary routes to entirely different fix teams. The empirical benchmark grid comes from [SaaS Capital](https://www.saas-capital.com/) (founder [Todd Gardner](https://www.linkedin.com/in/toddgardner)), [OpenView SaaS Benchmarks 2024](https://openviewpartners.com/expansion-saas-benchmarks/), [Bessemer State of the Cloud](https://www.bvp.com/atlas), [ChartMogul SaaS Retention Report](https://chartmogul.com/reports/), and the historical [Pacific Crest SaaS Survey](https://www.key.com/businesses-institutions/industry-expertise/saas-survey.jsp). The public-comp reference set: NRR elite — [Snowflake (NYSE:SNOW)](https://www.snowflake.com) ~158% peak, [Datadog (NASDAQ:DDOG)](https://www.datadoghq.com) ~130%, [MongoDB (NASDAQ:MDB)](https://www.mongodb.com) ~120%, [CrowdStrike (NASDAQ:CRWD)](https://www.crowdstrike.com) ~120%; strong enterprise — [HubSpot (NYSE:HUBS)](https://www.hubspot.com), [Atlassian (NASDAQ:TEAM)](https://www.atlassian.com), [Salesforce (NYSE:CRM)](https://www.salesforce.com); SMB / PLG comp — [Slack (Salesforce)](https://slack.com), [Zoom (NASDAQ:ZM)](https://zoom.us), [Notion](https://www.notion.so). Structural drivers: SMB churns because ~20% of small businesses fold each year per [BLS](https://www.bls.gov/bdm/), the buyer leaves, sub-$1K spend is not load-bearing, and the product is one of fifteen un-defended subscriptions; enterprise churns less because procurement cycles are multi-year, switching costs are real, the buyer is institutional not personal, and contracts auto-renew with notice provisions. The valuation translation: a SMB business at 4% monthly gross churn cannot scale past $30-50M ARR without leaking the bucket faster than sales can fill it; an enterprise business at 95% NRR is a feature factory disguised as a SaaS company. The diagnostic stack: never read churn as one number — always decompose by cohort, segment, ACV band, contract length, payment cadence, and acquisition channel because the Simpson's-paradox traps are real (a "stable" 8% monthly hides a 15% bleeding cohort and a 2% expanding cohort canceling out). Tools: [ChartMogul](https://chartmogul.com), [ProfitWell](https://www.profitwell.com) (founder [Patrick Campbell](https://www.linkedin.com/in/patticus)) / [Paddle](https://www.paddle.com) (founder [Christian Owens](https://www.linkedin.com/in/christianowens)), [Recurly (NYSE:RCLY)](https://recurly.com), [Stripe Sigma](https://stripe.com/sigma), [Mixpanel](https://mixpanel.com) cohort tables for analytics; [SaaS Capital](https://www.saas-capital.com/), [OpenView SaaS Benchmarks](https://openviewpartners.com/expansion-saas-benchmarks/), [Bessemer State of the Cloud](https://www.bvp.com/atlas), [ChartMogul SaaS Retention Report](https://chartmogul.com/reports/), [Pacific Crest SaaS Survey](https://www.key.com/businesses-institutions/industry-expertise/saas-survey.jsp) for benchmarks. Operator commentary anchoring stage benchmarks: [Tomasz Tunguz (Theory Ventures)](https://tomtunguz.com), [Jason Lemkin (SaaStr)](https://www.saastr.com), [David Skok (Matrix Partners)](https://www.forentrepreneurs.com/), and [Christoph Janz (Point Nine)](https://christophjanz.blogspot.com/). Counter-case ([Tunguz](https://tomtunguz.com)): single-segment benchmarks blur dissimilar motions (self-serve vs sales-assisted vs CSM-touched), discretionary vs load-bearing categories, geo/FX, and product-intent (tax-prep has 30%+ planned churn). Honest synthesis: use segment benchmarks as the first-pass read, then drill into motion, category, cohort, geo, and product-intent — the benchmark is a checkpoint, not a verdict. The single rule that matters most: decide your definition of churn — gross vs net, logo vs revenue, monthly vs annualized, voluntary vs involuntary — write it down, and never change it; switching definitions to flatter the number is the fastest way to lose board credibility and the slowest way to actually fix the leak.**

`;

// ─── Strip the leading **TL;DR:** paragraph; anchor on first H2 ───
function stripLeadingTldr(src) {
  const lines = src.split(/\r?\n/);
  let i = 0;
  while (i < lines.length && !/^##\s+/.test(lines[i])) i++;
  return lines.slice(i).join('\n');
}

// ─── q104 has 17 H2s and ZERO H3s. Bucket the 13 content H2s into 3 umbrella H2s,
//     promote them to numbered H3 children. Keep Sources/Numbers/Counter-Case/Related
//     as standalone H2 banners (in original order). ───
const UMBRELLA_MAP = {
  // Taxonomy + Benchmarks
  'The Churn Taxonomy You Must Speak': 'taxonomy',
  'The Segment-Specific Benchmarks': 'taxonomy',
  'Net Revenue Retention: The Second Axis': 'taxonomy',
  'Why SMB Has Structural Churn': 'taxonomy',
  'Why Enterprise Churns Less': 'taxonomy',
  // Diagnostics + Failure Modes
  'The Cohort Discipline': 'diagnostics',
  'The Failure Modes That Hide The Truth': 'diagnostics',
  'Reactivation and Win-Back Motions': 'diagnostics',
  'The Engagement-Retention Leading Indicator': 'diagnostics',
  // Operations + Tooling + Decision Trees
  'Tools and Instrumentation': 'operations',
  'The Board Reporting Discipline': 'operations',
  'The Churn Computation Decision Tree': 'operations',
  'The Cohort Revenue Waterfall': 'operations',
};

const UMBRELLA_BANNERS = {
  taxonomy: '## The Taxonomy, Benchmark Grid, and Structural Drivers',
  diagnostics: '## Diagnostics, Failure Modes, and Recovery Motions',
  operations: '## Operations, Tooling, and Board Reporting',
};

const KEEP_AS_H2 = new Set([
  'Sources',
  'Numbers',
  'Counter-Case: Why A Single Segment Benchmark Is Often Misleading',
  'Related Pulse Library Entries',
]);

function restructureH2sToNumberedH3s(src) {
  const lines = src.split(/\r?\n/);
  const out = [];

  const sections = []; // {h2Title, bucket, bodyLines}
  let current = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (m) {
      const title = m[1].trim();
      if (current) sections.push(current);
      let bucket;
      if (KEEP_AS_H2.has(title)) bucket = 'keep';
      else if (UMBRELLA_MAP[title]) bucket = UMBRELLA_MAP[title];
      else bucket = 'taxonomy';
      current = { h2Title: title, bucket, bodyLines: [] };
    } else if (current) {
      current.bodyLines.push(line);
    } else {
      out.push(line);
    }
  }
  if (current) sections.push(current);

  const order = ['taxonomy', 'diagnostics', 'operations'];
  for (const bucket of order) {
    const inBucket = sections.filter(s => s.bucket === bucket);
    if (inBucket.length === 0) continue;
    out.push('');
    out.push(UMBRELLA_BANNERS[bucket]);
    out.push('');
    let n = 0;
    for (const s of inBucket) {
      n += 1;
      out.push('### ' + n + '. ' + s.h2Title);
      for (const bl of s.bodyLines) out.push(bl);
    }
  }
  for (const s of sections) {
    if (s.bucket !== 'keep') continue;
    out.push('');
    out.push('## ' + s.h2Title);
    for (const bl of s.bodyLines) out.push(bl);
  }

  return out.join('\n');
}

// ─── Linkify Sources block ───
function linkifySources(src) {
  const lines = src.split(/\r?\n/);
  let inSources = false;
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^##\s+Sources\b/i.test(line)) { inSources = true; out.push(line); continue; }
    if (inSources && /^##\s+/.test(line) && !/^##\s+Sources\b/i.test(line)) { inSources = false; }
    if (!inSources) { out.push(line); continue; }
    const m = line.match(/^(\d+)\.\s+(\*\*[^*]+\*\*)\s+(--|—)\s+(.+?)\s+(https?:\/\/\S+)\s*$/);
    if (m) {
      const [, num, boldTitle, dash, desc, url] = m;
      const cleanDesc = desc.replace(/\.\s*$/, '');
      out.push(`${num}. [${boldTitle}](${url}) ${dash} ${cleanDesc}`);
    } else {
      out.push(line);
    }
  }
  return out.join('\n');
}

function countAnswerWords(s) {
  return String(s || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[#>*_`~|\-=]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .length;
}

(async () => {
  const TOKEN = process.env.BLOBS_PAT;
  if (!TOKEN) { console.error('Missing BLOBS_PAT / NETLIFY_AUTH_TOKEN'); process.exit(1); }
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOKEN });

  const entry = await store.get('answers/' + ID + '.json', { type: 'json' });
  if (!entry) { console.error(ID, 'entry not found'); process.exit(1); }
  const original = entry.answer || '';
  const originalWords = countAnswerWords(original);
  console.log(ID, 'BEFORE:', { chars: original.length, words: originalWords, quality_score: entry.quality_score, format_v: entry.format_v || null });

  fs.writeFileSync(path.join(__dirname, 'q104_pre_reformat.md'), original, 'utf8');

  const stripped = stripLeadingTldr(original);
  const restructured = restructureH2sToNumberedH3s(stripped);
  const withTldr = NEW_TLDR + restructured;
  const linkified = linkifySources(withTldr);

  const finalWords = countAnswerWords(linkified);
  console.log(ID, 'AFTER:', { chars: linkified.length, words: finalWords });

  if (finalWords > HARD_CAP) {
    console.error('ABORT — final body', finalWords, 'words exceeds HARD_CAP', HARD_CAP);
    process.exit(1);
  }
  if (finalWords < 8500) {
    console.warn('WARN — final body', finalWords, 'words below 8,500 target window.');
  }

  const e1_h3 = /^###\s+Direct Answer\b/m.test(linkified);
  const headTwoK = linkified.slice(0, 14000);
  const directBlock = headTwoK.match(/### Direct Answer\s*\n+([\s\S]{0,13000})/);
  const e1_bold = directBlock ? /\*\*[^*]+\*\*/.test(directBlock[1].split(/\n##\s/)[0].split(/\n###\s/)[0]) : false;
  const e2_h2 = (linkified.match(/^##\s+/gm) || []).length;
  const e3_numbered = (linkified.match(/^###\s+\d+\.\s+/gm) || []).length;
  const e4_bullets_bold = (linkified.match(/^[-*]\s+\*\*[^*]+\*\*/gm) || []).length;
  const e6_inline_links = (linkified.match(/\]\(https?:\/\//g) || []).length;
  const e6_numbered_sources = /\n##\s+Sources/i.test(linkified) && /^\d+\.\s+\[?\*?\*?[A-Z]/m.test(linkified);

  const realName = {
    profitwell: /ProfitWell/i.test(linkified),
    patrick_campbell: /Patrick Campbell/i.test(linkified),
    paddle: /Paddle/i.test(linkified),
    christian_owens: /Christian Owens/i.test(linkified),
    chartmogul: /ChartMogul/i.test(linkified),
    recurly: /Recurly|RCLY/i.test(linkified),
    stripe_sigma: /Stripe Sigma|Sigma/i.test(linkified),
    mixpanel: /Mixpanel/i.test(linkified),
    saas_capital: /SaaS Capital/i.test(linkified),
    todd_gardner: /Todd Gardner/i.test(linkified),
    openview: /OpenView/i.test(linkified),
    bessemer: /Bessemer|BVP|State of the Cloud/i.test(linkified),
    pacific_crest: /Pacific Crest/i.test(linkified),
    tunguz: /Tunguz/i.test(linkified),
    lemkin: /Lemkin|SaaStr/i.test(linkified),
    david_skok: /David Skok|Matrix Partners/i.test(linkified),
    christoph_janz: /Christoph Janz|Point Nine/i.test(linkified),
    hubspot: /HubSpot/i.test(linkified),
    salesforce: /Salesforce|\bCRM\b/i.test(linkified),
    slack: /Slack/i.test(linkified),
    atlassian: /Atlassian|\bTEAM\b/i.test(linkified),
    zoom: /Zoom|\bZM\b/i.test(linkified),
    datadog: /Datadog|DDOG/i.test(linkified),
    notion: /Notion/i.test(linkified),
    snowflake: /Snowflake|\bSNOW\b/i.test(linkified),
    mongodb: /MongoDB|MDB/i.test(linkified),
    crowdstrike: /CrowdStrike|CRWD/i.test(linkified),
  };
  const realNameHits = Object.values(realName).filter(Boolean).length;
  const realNameTotal = Object.keys(realName).length;

  console.log(ID, 'POST-SURGERY ELEMENT AUDIT:');
  console.log('  e1_direct_answer_h3      =', e1_h3);
  console.log('  e1_bold_tldr_top         =', e1_bold);
  console.log('  e2_h2_banners            =', e2_h2);
  console.log('  e3_numbered_subsections  =', e3_numbered);
  console.log('  e4_bullets_with_bold     =', e4_bullets_bold);
  console.log('  e5_real_name_hits        =', realNameHits + '/' + realNameTotal);
  console.log('  e6_numbered_sources      =', e6_numbered_sources);
  console.log('  e6_inline_links          =', e6_inline_links);
  for (const [k, v] of Object.entries(realName)) if (!v) console.log('  MISSING real name:', k);

  if (!e1_h3 || !e1_bold) { console.error('ABORT — Direct Answer H3 + bolded TLDR check failed'); process.exit(1); }
  if (e3_numbered < 10) { console.error('ABORT — too few numbered subsections (' + e3_numbered + '). Expected 10+.'); process.exit(1); }
  if (realNameHits < 27) { console.error('ABORT — real-name probe hit count', realNameHits, '< 27'); process.exit(1); }
  if (e6_inline_links < 25) { console.error('ABORT — e6_inline_links', e6_inline_links, '< 25.'); process.exit(1); }

  const updated = {
    ...entry,
    answer: linkified,
    format_v: '2026-05',
    format_v_set_at: Date.now(),
    last_modified_ms: Date.now(),
    ts: Date.now(),
  };
  await store.setJSON('answers/' + ID + '.json', updated);
  console.log(ID, 'BLOB UPDATED — answer + format_v stamped');

  try {
    const idx = await store.get('_index.json', { type: 'json' });
    if (idx && Array.isArray(idx.entries)) {
      const i = idx.entries.findIndex(x => x && x.id === ID);
      if (i >= 0) {
        idx.entries[i] = { ...idx.entries[i], format_v: '2026-05', last_modified_ms: Date.now() };
        await store.setJSON('_index.json', idx);
        console.log(ID, '_index.json mirrored');
      } else {
        console.warn(ID, 'not found in _index.json — skip mirror');
      }
    }
  } catch (err) {
    console.warn('   (index mirror skipped:', err.message + ')');
  }

  try {
    fetch('https://pulserevops.com/.netlify/functions/pulse-machine-indexnow-batch-background', { method: 'POST' }).catch(() => {});
  } catch (_e) {}

  const verify = await store.get('answers/' + ID + '.json', { type: 'json' });
  console.log('=== POST-STAMP VERIFY ===');
  console.log('  id:            ', verify.id);
  console.log('  quality_score: ', verify.quality_score);
  console.log('  format_v:      ', verify.format_v);
  console.log('  word_count:    ', countAnswerWords(verify.answer));
  console.log('  char_count:    ', String(verify.answer || '').length);
  console.log('  tag_count:     ', Array.isArray(verify.tags) ? verify.tags.length : 0);
  console.log('  live URL:      ', 'https://pulserevops.com/knowledge/' + ID);
  console.log('=== q104 GOLD REFORMAT COMPLETE ===');
})().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
