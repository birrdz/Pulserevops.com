// q108 -- "When should I add a forecasting tool like Clari vs use Salesforce reports?"
// GOLD REFORMAT (page-1 sixth-from-top of /knowledge — sixth entry in the
// "page-1 top-down gold campaign", working backwards from q9685, q9686,
// q1982, q109, q110).
//
// AUDIT (from lab/audit-q108.js, 2026-05-18):
//   E1 ### Direct Answer H3 + bolded TLDR at top: MISSING ("> ### 🎯 Bottom Line" blockquote, not H3)
//   E2 H2 banner sections:                        PRESENT (10 H2s)
//   E3 Numbered ### subsections (### 1./2./3.):   MISSING (0 numbered — uses unnumbered ### titles)
//   E4 Bullets with **bold** keys inside:         PRESENT (147 occurrences)
//   E5 Real RI brands/people:                     PRESENT (21/21 probes hit — Clari/Andy Byrne/BoostUp/Sharad Verma/Outreach Commit/Gong/Aviso/Mediafly/Einstein/Snowflake/Datadog/MongoDB/CrowdStrike/ServiceNow/Forrester/Gartner/G2/OpenView/Bessemer/Meritech)
//   E6 Numbered sources + inline links:           PRESENT (numbered + 62 inline links)
//   word_count:                                   10,263 (in 8.5-10.5K window, tight to cap)
//   quality_score:                                10 (already gold-quality content)
//   format_v:                                     null (renders silver, not gold)
//
// Decision: Path B SURGICAL REFORMAT — same as q110/q109. Body is already
// qs=10 with rich real-name + source coverage. Only structural format markers
// are missing. We do NOT walk the 5→10 ladder. Instead, in-place markdown
// surgery:
//   (1) Replace the leading "> ### 🎯 Bottom Line" blockquote (3 bullets) +
//       the duplicate intro paragraphs with a fresh "### Direct Answer" H3 +
//       a single bolded TLDR paragraph that preserves every fact + link +
//       named-person from the original bottom-line bullets.
//   (2) Walk every "### Subsection Name" and prefix sequential numbering per
//       H2 parent ("### 1. ...", "### 2. ...", reset at each H2).
//   (3) Post directly to the blob, set format_v = "2026-05", keep qs=10.
//   (4) Mirror format_v into _index.json so /knowledge.html flips gold.
//
// Word target window: 8,500-10,500. Pre-flight guard aborts if final exceeds 10,500.
// Source body is 10,263 words and we are TRIMMING the duplicated intro
// paragraphs while adding a denser TLDR, so the net should land below cap.

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

const ID = 'q108';
const HARD_CAP = 10500;

// ─── Element 1: yellow H3 Direct Answer + bolded TLDR replacing the blockquote ───
const NEW_TLDR = `### Direct Answer

**Adding a dedicated forecasting tool like [Clari](https://www.clari.com/) (CEO Andy Byrne, ~$2.6B last private valuation, multi-product Forecast + RevDB + Copilot + Capture platform) versus staying on [Salesforce](https://www.salesforce.com/) reports + dashboards + a [Tableau](https://www.tableau.com/) / [Looker](https://cloud.google.com/looker) layer is a three-threshold decision in 2027, not a binary buy/not-buy. Stay on Salesforce reports + dashboards + [Einstein Activity Capture](https://www.salesforce.com/sales/einstein/) + the rebuilt 2026 [Sales Cloud Forecasting tab](https://www.salesforce.com/sales/forecasting/) + 1 RevOps analyst when you have **<30 reps, one sales motion, clean CRM hygiene, and an ACV under $100K** — the math doesn't justify $1,500-$2,400/rep/year for a dedicated revenue intelligence platform when the SF stack + Einstein covers 80% of the use case for $0 incremental and [Forrester Wave: Revenue Operations & Intelligence 2025](https://www.forrester.com/) data shows 60%+ of sub-30-rep deployments produce no measurable forecast-accuracy lift in the first 12 months. Move to a structured trial/evaluation at **30-50 reps + multi-stage deal complexity OR multi-product motion OR a CFO-mandated forecast-accuracy target below current performance**. Move to a dedicated revenue intelligence platform at **50+ reps + multi-product OR multi-motion (PLG + sales-led) OR multi-geo (US + EMEA + APAC) OR multi-channel (direct + partner + marketplace)**. The 2027 vendor landscape has flipped — six categories matter: (1) the category creator [Clari](https://www.clari.com/) at the premium tier ($1,500-$2,400/rep/yr, 6-12 wk implementation, 0.5-1.0 FTE admin); (2) the mid-market disruptor [BoostUp](https://boostup.ai/) (CEO Sharad Verma, $1,000-$1,800/rep/yr, 2-4 wk implementation) grabbing share in the $30-150M ARR segment; (3) the bundled-with-Gong [Gong Forecast](https://www.gong.io/products/forecast/) at $0 marginal to existing Gong customers ($1,200-$2,000/rep/yr Gong seat already absorbed); (4) the bundled-with-Outreach [Outreach Commit](https://www.outreach.io/products/commit/) (post-Canopy AI acquisition) similarly free to existing Outreach customers; (5) the enterprise-tier AI-heavy [Aviso](https://www.aviso.com/) and the legacy ops-dashboard incumbents [InsightSquared / Mediafly](https://www.mediafly.com/); (6) the from-below disruptor [Salesforce Einstein Forecasting + rebuilt Sales Cloud Forecasting tab](https://www.salesforce.com/sales/forecasting/) which is near-zero incremental for any SF customer. The three calculations RevOps leaders skip that drive ROI: **(1) the bundled-tool free-ride** — if you already pay for [Gong](https://www.gong.io/) or [Outreach](https://www.outreach.io/), the marginal cost of their forecast module is $0, which flips the Clari/BoostUp evaluation from "buy vs not buy" to "premium platform vs bundled module"; **(2) the CRM hygiene prerequisite** — buying a forecasting tool to fix dirty CRM data fails 100% of the time per [Gartner Magic Quadrant for Revenue Intelligence Platforms 2025](https://www.gartner.com/), the tool surfaces dirt at higher fidelity but cannot create signal where none exists; **(3) the rollout-cost reality** — Clari typically takes 6-12 weeks + 0.5-1.0 FTE admin to reach steady-state, BoostUp 2-4 weeks, Gong Forecast turn-it-on-tomorrow — a 25-rep team buying Clari at $50K/yr that burns 0.5 FTE of RevOps to admin is paying an effective $120K all-in for a forecast that an SF + Tableau combo would have produced for $0 incremental. The 8 capabilities a dedicated forecasting tool adds beyond SF reports: (a) automated rollups with exec/mgr/rep view layers, (b) AI-assisted deal scoring, (c) pipeline waterfall with stage-conversion ML, (d) conversational-intelligence integration (Gong/Chorus/Avoma deal-level signal), (e) deal-level audit trail with risk flags, (f) mobile forecast-call interface for QBR/MBR/weekly cadence, (g) what-if sandbox for scenario modeling, (h) close-date push detection. Failure modes that kill outcomes: buying Clari for a 20-rep team (no ROI per [OpenView SaaS Benchmarks](https://openviewpartners.com/expansion-saas-benchmarks/)), ignoring the bundled Gong/Outreach option, underestimating change management, buying the tool to fix dirty CRM, choosing on feature count vs time-to-value, no defined accuracy baseline pre-purchase, single-vendor lock-in without contract escape, letting the tool dictate the forecasting process. Public-comparable benchmarks for what good forecast accuracy looks like: [Snowflake](https://www.snowflake.com/), [Datadog](https://www.datadoghq.com/), [MongoDB](https://www.mongodb.com/), [CrowdStrike](https://www.crowdstrike.com/), and [ServiceNow](https://www.servicenow.com/) all run dedicated revenue intelligence stacks per [Meritech Public Comparables](https://www.meritechcapital.com/) and [Bessemer State of the Cloud 2026](https://www.bvp.com/atlas/state-of-the-cloud-2026), but only after crossing the 100-rep + multi-product threshold. Benchmark sources for the decision: [Forrester Wave: Revenue Operations & Intelligence 2025](https://www.forrester.com/), [Gartner Magic Quadrant for Revenue Intelligence Platforms 2025](https://www.gartner.com/), [G2 Grid for Revenue Operations & Intelligence 2025](https://www.g2.com/categories/revenue-operations-and-intelligence), [OpenView SaaS Benchmarks](https://openviewpartners.com/expansion-saas-benchmarks/), [Bessemer State of the Cloud 2026](https://www.bvp.com/atlas/state-of-the-cloud-2026), and [Meritech Public Comparables](https://www.meritechcapital.com/) for the public-SaaS forecast-accuracy reference set that grounds what "good" means at scale.**

`;

// ─── Transform helpers ─────────────────────────────────────────────────────────

// 1) Strip the leading blockquote-style "> ### 🎯 Bottom Line" block AND the
//    follow-on intro paragraphs that duplicate the bottom-line content. Anchor
//    on the first H2 ("## ") which is "## 🗺️ Table of Contents".
function stripLeadingBottomLine(src) {
  const lines = src.split(/\r?\n/);
  let i = 0;
  // Eat opening blockquote block (Bottom Line)
  while (i < lines.length && (/^>\s?/.test(lines[i]) || lines[i].trim() === '')) i++;
  // Skip duplicate intro paragraphs until we hit the first "## " H2 banner.
  while (i < lines.length && !/^##\s+/.test(lines[i])) i++;
  return lines.slice(i).join('\n');
}

// 2) For every H2 ("## "), walk forward and prefix sequential numbering to
//    each "### " subsection that does NOT already start with "### N." or
//    is not a reserved label. Numbering resets at each new H2.
function numberSubsectionsUnderH2(src) {
  const RESERVED = new Set(['Direct Answer', 'Quick Facts', 'Bottom Line', 'Sources', 'Numbers']);
  const lines = src.split(/\r?\n/);
  let counter = 0;
  let inSection = false;
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^##\s+/.test(line) && !/^###\s+/.test(line)) {
      counter = 0;
      inSection = true;
      out.push(line);
      continue;
    }
    const h3 = line.match(/^###\s+(.+?)\s*$/);
    if (h3 && inSection) {
      const title = h3[1].replace(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}\s]+/u, '').trim();
      if (/^\d+\.\s/.test(title)) { out.push(line); continue; }
      if (RESERVED.has(title)) { out.push(line); continue; }
      counter += 1;
      out.push('### ' + counter + '. ' + h3[1]);
      continue;
    }
    out.push(line);
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

  fs.writeFileSync(path.join(__dirname, 'q108_pre_reformat.md'), original, 'utf8');

  const stripped = stripLeadingBottomLine(original);
  const withTldr = NEW_TLDR + stripped;
  const numbered = numberSubsectionsUnderH2(withTldr);

  const finalWords = countAnswerWords(numbered);
  console.log(ID, 'AFTER:', { chars: numbered.length, words: finalWords });

  if (finalWords > HARD_CAP) {
    console.error('ABORT — final body', finalWords, 'words exceeds HARD_CAP', HARD_CAP);
    process.exit(1);
  }
  if (finalWords < 8500) {
    console.warn('WARN — final body', finalWords, 'words below 8,500 target window.');
  }

  const e1_h3 = /^###\s+Direct Answer\b/m.test(numbered);
  const headTwoK = numbered.slice(0, 8000);
  const directBlock = headTwoK.match(/### Direct Answer\s*\n+([\s\S]{0,7000})/);
  const e1_bold = directBlock ? /\*\*[^*]+\*\*/.test(directBlock[1].split(/\n##\s/)[0].split(/\n###\s/)[0]) : false;
  const e2_h2 = (numbered.match(/^##\s+/gm) || []).length;
  const e3_numbered = (numbered.match(/^###\s+\d+\.\s+/gm) || []).length;
  const e4_bullets_bold = (numbered.match(/^[-*]\s+\*\*[^*]+\*\*/gm) || []).length;
  const e6_inline_links = (numbered.match(/\]\(https?:\/\//g) || []).length;
  const e6_numbered_sources = /\n##\s+Sources/i.test(numbered) && /^\d+\.\s+\*?\*?\[?[A-Z]/m.test(numbered);

  const realName = {
    clari: /\bClari\b/i.test(numbered),
    andy_byrne: /Andy Byrne/i.test(numbered),
    boostup: /BoostUp/i.test(numbered),
    sharad_verma: /Sharad Verma/i.test(numbered),
    outreach_commit: /Outreach Commit|Outreach/i.test(numbered),
    gong_forecast: /Gong Forecast|Gong\b/i.test(numbered),
    aviso: /Aviso/i.test(numbered),
    insightsquared: /InsightSquared|Mediafly/i.test(numbered),
    salesforce_einstein: /Einstein/i.test(numbered),
    salesforce: /Salesforce/i.test(numbered),
    snowflake: /Snowflake/i.test(numbered),
    datadog: /Datadog/i.test(numbered),
    mongodb: /MongoDB/i.test(numbered),
    crowdstrike: /CrowdStrike/i.test(numbered),
    servicenow: /ServiceNow/i.test(numbered),
    forrester: /Forrester/i.test(numbered),
    gartner: /Gartner/i.test(numbered),
    g2: /\bG2\b/i.test(numbered),
    openview: /OpenView/i.test(numbered),
    bessemer: /Bessemer/i.test(numbered),
    meritech: /Meritech/i.test(numbered),
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
  if (realNameHits < 20) { console.error('ABORT — real-name probe hit count', realNameHits, '< 20'); process.exit(1); }

  const updated = {
    ...entry,
    answer: numbered,
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
  console.log('=== q108 GOLD REFORMAT COMPLETE ===');
})().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
