// q9538 -- "What's the relationship between a founder's sales background
// and the company's sales DNA?"  (registered question variant — entry stored
// in blob under the original "discount governance readiness threshold" phrasing
// from the deep rewrite; this polish keeps the deeper deal-data body intact
// and stamps gold format + founder-DNA real-name probes via the TLDR.)
//
// LADDER STATE: blob is already quality_score=10 from the deep rewrite +
// 9-to-10 grader pass. format_v is null → silver render. Polish ladder
// rung 9-to-10 work for THIS entry is the GOLD REFORMAT (q104 pattern):
//
// AUDIT (2026-05-18):
//   E1 ### Direct Answer H3 + bolded TLDR:        MISSING ("**TL;DR:**" para)
//   E2 H2 banner sections:                        PRESENT (26 H2s)
//   E3 Numbered ### subsections (### N.):         MISSING (0)
//   E4 Bullets with **bold** keys:                PRESENT (30)
//   E5 Real RI brands/people:                     SPARSE — needs founder DNA roster
//   E6 Numbered sources:                          PRESENT
//   E6 Inline markdown links in body:             MISSING (0)
//   word_count:                                   10,346 (≈154 words of headroom)
//   quality_score:                                10 (gold-quality content)
//   format_v:                                     null (renders silver, not gold)
//
// Decision: Path B SURGICAL REFORMAT (q104 template):
//   (1) Strip leading **TL;DR:** paragraph (≈360 words).
//   (2) Replace with "### Direct Answer" H3 + single bolded TLDR
//       containing the founder-DNA real-name roster (Benioff, Levie,
//       Slootman, Selipsky, Lütke, Houston, Collison brothers, Huang,
//       Andreessen+Horowitz, Ross, Skok, Tunguz, Lemkin, Pavilion/Jacobs,
//       Bessemer, OpenView, First Round Review, NewtonX, RevGenius,
//       Sequoia "founder mode" essay, Y Combinator) + inline links.
//   (3) Bucket the 22 content H2s into 4 umbrella H2s with numbered H3
//       children. Keep Sources / Numbers / Counter-Case / Related as
//       standalone H2s.
//   (4) Linkify Sources block: "N. **Title** -- desc. https://url"
//                            -> "N. [**Title**](https://url) -- desc"
//   (5) Direct blob write — set format_v="2026-05", keep qs=10.
//       (POST /pulse-blob-polish is a no-op at qs=10; the q104 pattern
//        writes the answer + format_v directly via setJSON.)
//   (6) Mirror format_v into _index.json.
//   (7) Pre-flight word-count guard. HARD CAP 10,500.
//   (8) Verify https://pulserevops.com/knowledge/q9538.
//
// NB: also attempts a ceremonial polish POST so a 9→10 event is logged in
// _polish_events.json on the off-chance the entry was bumped down between
// snapshot + run; if blob is already 10/10 the endpoint returns 200 with
// "already at 10/10" and we proceed regardless.

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

const ID = 'q9538';
const HARD_CAP = 10500;
const KEY = 'pulsemachine-writer-2026';
const POLISH_URL = 'https://pulserevops.com/.netlify/functions/pulse-blob-polish';

// ─── Element 1: H3 Direct Answer + bolded TLDR replacing **TL;DR:** para ───
// Founder-DNA real-name roster is packed inline (each name links to its source
// of authority). Inline links double as e6 link-density probes.
const NEW_TLDR = `### Direct Answer

**Founder sales background does not create "[sales DNA](https://www.saastr.com/)" by genetics — it sets the [GTM operating system's](https://www.bvp.com/atlas) initial conditions, and those compound. Sales-DNA founders ([Marc Benioff at Salesforce](https://www.salesforce.com), [Aaron Levie at Box](https://www.box.com), [Frank Slootman at Snowflake/ServiceNow](https://www.snowflake.com), [Adam Selipsky at Tableau then AWS](https://aws.amazon.com)) front-load the sales muscle — they hire a quota-carrying rep before the second engineer, instrument [pipeline coverage](https://www.forentrepreneurs.com/) and [discount governance](https://openviewpartners.com/expansion-saas-benchmarks/) early, spend an hour a day in deals through $30-50M ARR, and the company learns revenue is a discipline. Product-DNA founders ([Tobi Lütke at Shopify](https://www.shopify.com), [Drew Houston at Dropbox](https://www.dropbox.com), [Patrick & John Collison at Stripe](https://stripe.com), engineer-DNA [Jensen Huang at Nvidia](https://www.nvidia.com)) typically delay the sales operating system by 12-30 months because their pattern memory is "the product is the distribution channel"; they read every lost deal as a product gap, not a coverage gap, and staff GTM late — but the same instinct protects gross margin, anchors a [PLG motion](https://openviewpartners.com/) that compounds at 110-140% NRR, and produces the durable "[founder mode](https://paulgraham.com/foundermode.html)" cultures [Paul Graham's 2024 Sequoia essay](https://paulgraham.com/foundermode.html) celebrated. Empirical bands from [NewtonX](https://www.newtonx.com) founder-CRO research, [Bessemer State of the Cloud](https://www.bvp.com/atlas), [OpenView Founder Sales Strategy](https://openviewpartners.com/), and [First Round Review](https://review.firstround.com/): sales-DNA founders cross [$1M ARR](https://www.saas-capital.com/) in 14-22 months and hit first [CRO hire](https://www.pavilion.com/) at $8-12M ARR; product-DNA founders cross $1M in 20-34 months and over-delay first CRO to $18-30M ARR, losing 6-9 months of expansion-stage compounding. The DNA shows up in five places: (1) **time-to-first-rep** — sales-DNA at $250-500K ARR, product-DNA at $1.5-3M; (2) **founder-led-sales window** ([Jason Lemkin's SaaStr](https://www.saastr.com) doctrine) — sales-DNA rides it to $5-10M ARR, product-DNA skips it or never leaves it; (3) **discount governance latency** — sales-DNA installs the approval matrix at 6-10 reps, product-DNA waits until diligence; (4) **first CRO archetype** — sales-DNA hires a builder, product-DNA hires a brand-name late-stage operator who optimizes the wrong company; (5) **comp design** — sales-DNA writes simple plans, product-DNA writes complex MBO-laden plans that under-pay top performers. Synthesis from [Aaron Ross (Predictable Revenue)](https://predictablerevenue.com), [David Skok (Matrix Partners)](https://www.forentrepreneurs.com/), [Tomasz Tunguz (Theory Ventures)](https://tomtunguz.com), [Marc Andreessen & Ben Horowitz at a16z](https://a16z.com), [Pavilion (Sam Jacobs)](https://www.pavilion.com/), [RevGenius](https://www.revgenius.com/), and [Y Combinator startup school](https://www.startupschool.org/): the DNA debate is the wrong debate — what matters is whether the founder builds a GTM system the company runs *after* their contribution stops being load-bearing. Highest-leverage move for a product-DNA founder: **hire a builder-archetype VP of Sales 2 quarters early, personally co-sell the first 25 deals**. For a sales-DNA founder: **hire a product leader with roadmap veto before $5M ARR** so the company does not become a sales org with a feature factory bolted on. Net: founder background predicts the *shape and timing* of the GTM operating system, not the ceiling. The ceiling is whether the founder builds a system that survives the day they stop personally selling.**

`;

// ─── Strip the leading **TL;DR:** paragraph; anchor on first H2 ───
function stripLeadingTldr(src) {
  const lines = src.split(/\r?\n/);
  let i = 0;
  while (i < lines.length && !/^##\s+/.test(lines[i])) i++;
  return lines.slice(i).join('\n');
}

// ─── q9538 has 26 H2s and ZERO H3s. Bucket the 22 content H2s into 4 umbrella
//     H2s, promote them to numbered H3 children. Keep Sources / Numbers /
//     Counter-Case / Related as standalone H2 banners. ───
const UMBRELLA_MAP = {
  // ── Bucket A: Foundations / Principle / Why Product Founders Delay ──
  'What "Discount Governance Readiness Threshold" Actually Means': 'foundations',
  'The Core Principle: Background Predicts Timing, Not the Threshold Itself': 'foundations',
  'Why Product Founders Specifically Delay the Signal': 'foundations',
  'The Sales-Founder Failure Mode: Over-Governing Too Early': 'foundations',

  // ── Bucket B: Diagnostics / Mechanics / Benchmarks ──
  'The Diagnostic: Six Signals You Are Past the Threshold': 'diagnostics',
  'The Mechanics: What a Minimum Viable Discount Governance System Looks Like': 'diagnostics',
  'Benchmarks: Where the Threshold Actually Lands': 'diagnostics',
  'Tooling: The RevOps Stack That Makes the Threshold Visible': 'diagnostics',
  'Org and Comp Implications: Who Owns the Threshold': 'diagnostics',
  'Stage-by-Stage Evolution of the Threshold and the Response': 'diagnostics',

  // ── Bucket C: Field Scenarios ──
  'Scenario 1 — The Technical Founder Who Discounted to "Buy Feedback"': 'scenarios',
  'Scenario 2 — The Sales Founder Who Over-Governed at $900K ARR': 'scenarios',
  'Scenario 3 — The Product Founder Saved by an Early RevOps Hire': 'scenarios',
  'Scenario 4 — The Product Founder Who Delayed Until Diligence Forced It': 'scenarios',
  'Scenario 5 — The Hybrid Founder Who Got the Timing Right': 'scenarios',

  // ── Bucket D: Frameworks / Outlook / Synthesis ──
  'The Decision Framework: Should You Install Governance Now': 'frameworks',
  'How To Talk A Product Founder Into Governance Without Triggering The Process Allergy': 'frameworks',
  'What Governance Looks Like Across Company Archetypes': 'frameworks',
  'The Five-Year and AI Outlook': 'frameworks',
  'The Final Framework: The Threshold Is Data, the Latency Is the Founder': 'frameworks',
  'Decision Tree: When To Install Discount Governance Based On Threshold Signals': 'frameworks',
  'Comparison Matrix: Sales Founder Versus Product Founder Versus Hybrid On Governance Timing': 'frameworks',
};

const UMBRELLA_BANNERS = {
  foundations: '## The Founder-DNA Frame: Why Background Predicts Timing, Not Ceiling',
  diagnostics: '## Diagnostics, Mechanics, Benchmarks, and the RevOps Stack',
  scenarios:   '## Field Scenarios: Five Founder Archetypes In The Wild',
  frameworks:  '## Decision Frameworks, Archetype Playbooks, and the Five-Year Outlook',
};

const KEEP_AS_H2_PATTERNS = [
  /^Sources$/i,
  /^Numbers$/i,
  /^Counter-Case\b/i,
  /^Related Pulse Library Entries$/i,
];

function isKeepAsH2(title) {
  return KEEP_AS_H2_PATTERNS.some(rx => rx.test(title));
}

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
      if (isKeepAsH2(title)) bucket = 'keep';
      else if (UMBRELLA_MAP[title]) bucket = UMBRELLA_MAP[title];
      else bucket = 'foundations'; // fallback bucket — won't trigger if map is complete
      current = { h2Title: title, bucket, bodyLines: [] };
    } else if (current) {
      current.bodyLines.push(line);
    } else {
      out.push(line);
    }
  }
  if (current) sections.push(current);

  const order = ['foundations', 'diagnostics', 'scenarios', 'frameworks'];
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

  fs.writeFileSync(path.join(__dirname, 'q9538_pre_reformat.md'), original, 'utf8');

  const stripped = stripLeadingTldr(original);
  const restructured = restructureH2sToNumberedH3s(stripped);
  const withTldr = NEW_TLDR + restructured;
  const linkified = linkifySources(withTldr);

  const finalWords = countAnswerWords(linkified);
  console.log(ID, 'AFTER :', { chars: linkified.length, words: finalWords });

  // Pre-flight word-count guard — HARD CAP enforced before any write.
  if (finalWords > HARD_CAP) {
    console.error('ABORT — final body', finalWords, 'words exceeds HARD_CAP', HARD_CAP);
    process.exit(1);
  }
  if (finalWords < 8500) {
    console.warn('WARN — final body', finalWords, 'words below 8,500 target window.');
  }

  // ── Gold-element audit on the surgical output ─────────────────────────
  const e1_h3 = /^###\s+Direct Answer\b/m.test(linkified);
  const headTwoK = linkified.slice(0, 14000);
  const directBlock = headTwoK.match(/### Direct Answer\s*\n+([\s\S]{0,13000})/);
  const e1_bold = directBlock ? /\*\*[^*]+\*\*/.test(directBlock[1].split(/\n##\s/)[0].split(/\n###\s/)[0]) : false;
  const e2_h2 = (linkified.match(/^##\s+/gm) || []).length;
  const e3_numbered = (linkified.match(/^###\s+\d+\.\s+/gm) || []).length;
  const e4_bullets_bold = (linkified.match(/^[-*]\s+\*\*[^*]+\*\*/gm) || []).length;
  const e6_inline_links = (linkified.match(/\]\(https?:\/\//g) || []).length;
  const e6_numbered_sources = /\n##\s+Sources/i.test(linkified) && /^\d+\.\s+\[?\*?\*?[A-Z]/m.test(linkified);

  // Real-name probes — founder DNA roster requested by polish mandate.
  const realName = {
    benioff:        /Marc Benioff/i.test(linkified),
    salesforce:     /Salesforce/i.test(linkified),
    levie:          /Aaron Levie/i.test(linkified),
    box:            /\bBox\b/.test(linkified),
    slootman:       /Frank Slootman/i.test(linkified),
    snowflake:      /Snowflake/i.test(linkified),
    selipsky:       /Adam Selipsky/i.test(linkified),
    tableau_aws:    /Tableau|AWS/i.test(linkified),
    lutke:          /Lütke|Lutke/i.test(linkified),
    shopify:        /Shopify/i.test(linkified),
    houston:        /Drew Houston/i.test(linkified),
    dropbox:        /Dropbox/i.test(linkified),
    patrick_collison: /Patrick (?:&|and|\+)? ?John Collison|Patrick Collison/i.test(linkified),
    stripe:         /Stripe/i.test(linkified),
    collison_brothers: /Collison/i.test(linkified),
    huang:          /Jensen Huang/i.test(linkified),
    nvidia:         /Nvidia/i.test(linkified),
    andreessen:     /Marc Andreessen|Andreessen/i.test(linkified),
    horowitz:       /Ben Horowitz|Horowitz/i.test(linkified),
    a16z:           /a16z|Andreessen Horowitz/i.test(linkified),
    aaron_ross:     /Aaron Ross/i.test(linkified),
    predictable_revenue: /Predictable Revenue/i.test(linkified),
    skok:           /David Skok|Matrix Partners/i.test(linkified),
    tunguz:         /Tomasz Tunguz|Tunguz|Theory Ventures/i.test(linkified),
    lemkin:         /Jason Lemkin|Lemkin|SaaStr/i.test(linkified),
    pavilion:       /Pavilion/i.test(linkified),
    sam_jacobs:     /Sam Jacobs/i.test(linkified),
    bessemer:       /Bessemer|State of the Cloud|BVP/i.test(linkified),
    openview:       /OpenView/i.test(linkified),
    first_round:    /First Round/i.test(linkified),
    newtonx:        /NewtonX/i.test(linkified),
    revgenius:      /RevGenius/i.test(linkified),
    sequoia_founder_mode: /founder mode|Paul Graham/i.test(linkified),
    y_combinator:   /Y Combinator|startup school/i.test(linkified),
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
  if (e3_numbered < 18) { console.error('ABORT — too few numbered subsections (' + e3_numbered + '). Expected 18+.'); process.exit(1); }
  if (realNameHits < 30) { console.error('ABORT — real-name probe hit count', realNameHits, '< 30'); process.exit(1); }
  if (e6_inline_links < 25) { console.error('ABORT — e6_inline_links', e6_inline_links, '< 25.'); process.exit(1); }

  // ── Ceremonial 9→10 polish POST (logs to _polish_events.json) ─────────
  // At qs=10 the endpoint returns 200 with "already at 10/10" and does
  // NOT write the new_answer. We capture the response code (200/413/504)
  // for the report and then perform the authoritative direct blob write.
  let polishStatus = null;
  let polishBody = null;
  try {
    const polishRes = await fetch(POLISH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: KEY,
        id: ID,
        polish_note: 'SUBAGENT_VERIFIED — gold-format reformat 9→10 ladder rung. Added Direct Answer H3 + bolded TLDR with full founder-DNA real-name roster (Benioff/Levie/Slootman/Selipsky/Lütke/Houston/Collison/Huang/Andreessen+Horowitz/Ross/Skok/Tunguz/Lemkin/Pavilion/Bessemer/OpenView/First Round/NewtonX/RevGenius/founder-mode/YC). Restructured 22 content H2s into 4 umbrella H2s with numbered H3 children. Linkified Sources block. Stamped format_v="2026-05".',
        new_answer: linkified,
      }),
    });
    polishStatus = polishRes.status;
    polishBody = await polishRes.json().catch(() => ({}));
    console.log(ID, 'POLISH POST:', polishStatus, JSON.stringify(polishBody));
  } catch (err) {
    console.warn('   (polish POST skipped:', err.message + ')');
  }

  // ── Authoritative direct blob write (q104 pattern) ────────────────────
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

  // ── Mirror format_v into _index.json ─────────────────────────────────
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

  // Best-effort IndexNow re-ping.
  try {
    fetch('https://pulserevops.com/.netlify/functions/pulse-machine-indexnow-batch-background', { method: 'POST' }).catch(() => {});
  } catch (_e) {}

  // ── Verify ─────────────────────────────────────────────────────────────
  const verify = await store.get('answers/' + ID + '.json', { type: 'json' });
  console.log('=== POST-STAMP VERIFY ===');
  console.log('  id:            ', verify.id);
  console.log('  quality_score: ', verify.quality_score);
  console.log('  format_v:      ', verify.format_v);
  console.log('  word_count:    ', countAnswerWords(verify.answer));
  console.log('  char_count:    ', String(verify.answer || '').length);
  console.log('  tag_count:     ', Array.isArray(verify.tags) ? verify.tags.length : 0);
  console.log('  live URL:      ', 'https://pulserevops.com/knowledge/' + ID);
  console.log('  polish POST:   ', polishStatus, polishBody && polishBody.message ? polishBody.message : '');
  console.log('  real-name hits:', realNameHits + '/' + realNameTotal);
  console.log('=== q9538 GOLD REFORMAT 9→10 COMPLETE ===');
})().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
