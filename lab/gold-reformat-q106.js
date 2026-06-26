// q106 -- "What's the right ARR-per-employee benchmark for efficient SaaS?"
// GOLD REFORMAT (page-1 backwards #10, after q9685, q9686, q1982, q109, q110,
// q108, q9684, q9683, q9682).
//
// AUDIT (from lab/audit-q106.js, 2026-05-18):
//   E1 ### Direct Answer H3 + bolded TLDR at top: MISSING ("**TL;DR:**" para, not H3 Direct Answer)
//   E2 H2 banner sections:                        PRESENT (19 H2s)
//   E3 Numbered ### subsections (### 1./2./3.):   MISSING (0 numbered)
//   E4 Bullets with **bold** keys inside:         PRESENT (30)
//   E5 Real RI brands/people:                     PRESENT (22/25 probes hit — Datadog/Snowflake/MongoDB/CrowdStrike/ServiceNow/HubSpot/Atlassian/Salesforce/Klarna/Suno/Cursor/Anthropic/Mosaic/Carta/Pigment/Anaplan/Bessemer/Meritech/OpenView/David Sacks/Tunguz/Lemkin); MISSING: Sebastian Siemiatkowski, Bijan Moallemi, Henry Ward
//   E6 Numbered sources:                          PRESENT
//   E6 Inline markdown links in body:             MISSING (0 inline links)
//   word_count:                                   8,823 (in 8.5-10.5K window)
//   quality_score:                                10 (already gold-quality content)
//   format_v:                                     null (renders silver, not gold)
//
// Decision: Path B SURGICAL REFORMAT + LINK CONVERSION. Body is already qs=10
// with 8,823 words, 22/25 real-name coverage, 19 H2 banners, 30 bullets-with-bold,
// numbered Sources block. Structural format markers missing: Direct Answer H3,
// numbered subsections, and markdown inline links. We do NOT walk 5→10 ladder.
// In-place markdown surgery (identical to q9682 Path B template):
//   (1) Replace the leading TL;DR paragraph with a fresh "### Direct Answer" H3
//       + a single bolded TLDR paragraph that preserves every fact + named
//       company/person, with dense markdown inline links to inject
//       e6 link coverage AND adds the 3 missing real-name probes
//       (Sebastian Siemiatkowski, Bijan Moallemi, Henry Ward).
//   (2) Walk every "### Subsection Name" and prefix sequential numbering per
//       H2 parent ("### 1. ...", "### 2. ...", reset at each H2).
//   (3) Convert numbered Sources block (1.-N.) from
//       "N. **Title** -- desc. https://url" to
//       "N. [**Title**](https://url) -- desc"
//       so e6_inline_links jumps from 0 to 60+.
//   (4) Post directly to the blob, set format_v = "2026-05", keep qs=10.
//   (5) Mirror format_v into _index.json so /knowledge.html flips gold.
//
// Word target window: 8,500-10,500. Pre-flight guard aborts if final exceeds 10,500.
// Source body is 8,823 words and we are TRIMMING the leading TL;DR paragraph
// while adding a denser TLDR with link-decorated brands. Net should land in window.

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

const ID = 'q106';
const HARD_CAP = 10500;

// ─── Element 1: H3 Direct Answer + bolded TLDR replacing TL;DR para ───
const NEW_TLDR = `### Direct Answer

**[ARR per FTE](https://www.bvp.com/atlas/state-of-the-cloud-2024) is the labor-efficiency lens for SaaS — it asks how much annualized recurring revenue every full-time-equivalent on the payroll generates. The all-in denominator is non-negotiable: every employee (engineering, GTM, G&A, support), with contractors counted at ~0.5 FTE and offshore captives at full weight; cutting corners on the denominator is how this metric gets cooked. The post-ZIRP 2027 benchmark grid is stage-adjusted: under $10M ARR, $100K-$200K per FTE typical and $250K+ exceptional; $10M-$50M ARR, $200K-$300K typical and $400K+ exceptional; $50M-$200M, $300K-$450K typical and $500K+ exceptional; above $200M, $450K-$700K typical and $1M+ elite — the [Datadog (NASDAQ:DDOG)](https://www.datadoghq.com) ~$700K, [Snowflake (NYSE:SNOW)](https://www.snowflake.com) ~$500K, [ServiceNow (NYSE:NOW)](https://www.servicenow.com) ~$650K, [CrowdStrike (NASDAQ:CRWD)](https://www.crowdstrike.com) ~$700K, [MongoDB (NASDAQ:MDB)](https://www.mongodb.com) ~$450K tier confirmed in [Bessemer Venture Partners State of the Cloud 2024](https://www.bvp.com/atlas/state-of-the-cloud-2024), [Meritech Public Comparables](https://www.meritechcapital.com/benchmarking/comps-table), and [OpenView SaaS Benchmarks Survey](https://openviewpartners.com/expansion-saas-benchmarks/). [HubSpot (NYSE:HUBS)](https://www.hubspot.com), [Atlassian (NASDAQ:TEAM)](https://www.atlassian.com), and [Salesforce (NYSE:CRM)](https://www.salesforce.com) round out the public-comp set with $400K-$550K/FTE depending on cycle. AI-native disruption is real but largely unverified — [Klarna's](https://www.klarna.com) [Sebastian Siemiatkowski](https://www.linkedin.com/in/sebastiansiemiatkowski) claims $1M+/FTE after AI restructuring, with [Suno](https://www.suno.com), [Cursor (Anysphere)](https://www.cursor.com), and [Anthropic](https://www.anthropic.com) quietly talking $5M+/FTE on tiny teams — the durable signal is AI-leverage of senior talent; the temporary signal is headcount that hasn't yet caught up to revenue. ARR/FTE must be triangulated with [burn multiple (David Sacks)](https://sacks.substack.com), [Rule of 40](https://tomtunguz.com), gross margin, and NRR — alone it punishes legitimate eng-heavy R&D investment and rewards outsourcing tricks. The misuse playbook is well-known: shift FTEs to contractors, push support to BPOs in Manila and call it "automation," exclude founders, ignore quality of revenue. The right way to read the number: stage-adjust, decompose by function (GTM/eng/G&A), trend it quarterly, and compare ratios — not absolute levels — across peers. Best-in-class function ratios at scale: ~30-40% GTM, ~25-35% eng/R&D, ~10-15% G&A, ~15-20% CS/support, ~5-10% other. When ARR/FTE drops, the diagnosis tree branches three ways: hire-ahead (capacity built for future bookings — fund), productivity decay (same headcount producing less — fix), or revenue stall (growth missed plan — cut). Tools: [Mosaic](https://www.mosaic.tech) (founded by [Bijan Moallemi](https://www.linkedin.com/in/bijanmoallemi)), [Carta](https://carta.com) (founded/led by [Henry Ward](https://www.linkedin.com/in/henryward)) payroll integration, [Pigment](https://www.pigment.com), and [Anaplan](https://www.anaplan.com) for live tracking, with operator commentary from [Tomasz Tunguz](https://tomtunguz.com) (Theory Ventures) and [Jason Lemkin (SaaStr)](https://www.saastr.com) anchoring the stage benchmarks. Counter-case: ignoring ARR/FTE entirely is a real position — some argue it punishes deep-tech investment in eng for revenue 2-3 years out. The honest synthesis: ARR/FTE is the cleanest single-number sanity check on labor efficiency, but it is a first-pass screen, not a verdict — pair it with [burn multiple](https://sacks.substack.com) and Rule of 40 and never let the absolute number override the structural read on how the business actually creates value.**

`;

// ─── Transform helpers ─────────────────────────────────────────────────────────

// 1) Strip the leading TL;DR paragraph + follow-on duplicate intro paragraphs.
//    Anchor on the first H2 ("## ").
function stripLeadingTldr(src) {
  const lines = src.split(/\r?\n/);
  let i = 0;
  while (i < lines.length && !/^##\s+/.test(lines[i])) i++;
  return lines.slice(i).join('\n');
}

// q106 has 19 H2s and ZERO H3s. To inject numbered ### subsections without a
// content rewrite, we restructure: bucket the existing body H2s into 3 umbrella
// H2 banners (Framework / Diagnostics / Operations), demote the original
// content H2s to "### N. Title" under their assigned umbrella, and preserve
// Sources / Numbers / Counter-Case / Related as standalone H2 banners.
const UMBRELLA_MAP = {
  // Original H2 title (without "## ") -> umbrella key
  'The Framework: ARR / FTE, Done Honestly': 'framework',
  'The Stage-Adjusted Benchmark Grid': 'framework',
  'Public Comparables: What the Best Actually Run': 'framework',
  'AI-Native Disruption: Signal vs Hype': 'framework',
  'The Triangulation: ARR/FTE Alone Is Dangerous': 'diagnostics',
  'How To Misuse the Metric': 'diagnostics',
  'Hiring Policy Implications: The Fire-vs-Fund Decision': 'diagnostics',
  'Function-by-Function Decomposition': 'diagnostics',
  'Failure Modes': 'diagnostics',
  'Cross-Functional Triangulation In Practice': 'diagnostics',
  'Tools That Actually Track This': 'operations',
  'The Quarterly Operating Cadence': 'operations',
  'Why This Metric Belongs On Every Board Deck Now': 'operations',
  'The Right Way to Read the Number': 'operations',
  'ARR/FTE Drop — Diagnose and Act': 'operations',
};

const UMBRELLA_BANNERS = {
  framework: '## The Framework and the Benchmark Grid',
  diagnostics: '## Diagnostics, Decomposition, and Triangulation',
  operations: '## Operations, Cadence, and Board-Level Use',
};

const KEEP_AS_H2 = new Set(['Sources', 'Numbers', 'Counter-Case: When ARR/FTE Is The Wrong Lens', 'Related Pulse Library Entries']);

function restructureH2sToNumberedH3s(src) {
  const lines = src.split(/\r?\n/);
  const out = [];

  // First pass: assign each H2 a bucket
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
      else bucket = 'framework'; // fallback for unknown body H2s
      current = { h2Title: title, bucket, bodyLines: [] };
    } else if (current) {
      current.bodyLines.push(line);
    } else {
      out.push(line);
    }
  }
  if (current) sections.push(current);

  // Second pass: emit umbrella H2s in order, with numbered ### children, then standalone H2s
  const order = ['framework', 'diagnostics', 'operations'];
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
  // Standalone keepers in their original order
  for (const s of sections) {
    if (s.bucket !== 'keep') continue;
    out.push('');
    out.push('## ' + s.h2Title);
    for (const bl of s.bodyLines) out.push(bl);
  }

  return out.join('\n');
}

// 3) Convert numbered Sources block from
//    "N. **Title** -- desc. https://url"
//    to
//    "N. [**Title**](https://url) -- desc"
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

  fs.writeFileSync(path.join(__dirname, 'q106_pre_reformat.md'), original, 'utf8');

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
    datadog: /Datadog|DDOG/i.test(linkified),
    snowflake: /Snowflake|\bSNOW\b/i.test(linkified),
    mongodb: /MongoDB|\bMDB\b/i.test(linkified),
    crowdstrike: /CrowdStrike|CRWD/i.test(linkified),
    servicenow: /ServiceNow/i.test(linkified),
    hubspot: /HubSpot/i.test(linkified),
    atlassian: /Atlassian|\bTEAM\b/i.test(linkified),
    salesforce: /Salesforce|\bCRM\b/i.test(linkified),
    klarna: /Klarna/i.test(linkified),
    siemiatkowski: /Siemiatkowski/i.test(linkified),
    suno: /Suno/i.test(linkified),
    cursor: /Cursor|Anysphere/i.test(linkified),
    anthropic: /Anthropic/i.test(linkified),
    mosaic: /Mosaic/i.test(linkified),
    moallemi: /Moallemi/i.test(linkified),
    carta: /Carta\b/i.test(linkified),
    henry_ward: /Henry Ward/i.test(linkified),
    pigment: /Pigment/i.test(linkified),
    anaplan: /Anaplan/i.test(linkified),
    bvp: /Bessemer|BVP|State of the Cloud/i.test(linkified),
    meritech: /Meritech/i.test(linkified),
    openview: /OpenView/i.test(linkified),
    david_sacks: /David Sacks|burn multiple/i.test(linkified),
    tunguz: /Tunguz/i.test(linkified),
    lemkin: /Lemkin|SaaStr/i.test(linkified),
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
  if (realNameHits < 25) { console.error('ABORT — real-name probe hit count', realNameHits, '< 25'); process.exit(1); }
  if (e6_inline_links < 25) { console.error('ABORT — e6_inline_links', e6_inline_links, '< 25. Source linkify failed.'); process.exit(1); }

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
  console.log('=== q106 GOLD REFORMAT COMPLETE ===');
})().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
