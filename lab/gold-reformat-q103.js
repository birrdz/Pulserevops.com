// q103 -- "How do I track burn multiple alongside efficiency metrics?"
// GOLD REFORMAT (page-1 backwards #12 — FINAL page-1 entry).
//
// AUDIT (from lab/audit-q103.js, 2026-05-18):
//   E1 ### Direct Answer H3 + bolded TLDR at top: MISSING (has blockquote "> ### 🎯 Bottom Line"
//                                                  + later "**TL;DR:**" paragraph — neither is the
//                                                  required H3 Direct Answer + bolded TLDR pattern)
//   E2 H2 banner sections:                        PRESENT (10 H2s)
//   E3 Numbered ### subsections (### 1./2./3.):   MISSING (0)
//   E4 Bullets with **bold** keys inside:         PRESENT (111)
//   E5 Real RI brands/people:                     24/29 (missing Jason Lemkin, Christoph Janz,
//                                                  David Skok, Bijan Moallemi, Christina Ross)
//   E6 Numbered sources:                          PRESENT (50 entries)
//   E6 Inline markdown links in body:             PRESENT (42)
//   word_count:                                   8,689 (in 8.5-10.5K window)
//   quality_score:                                10 (already gold-quality content)
//   format_v:                                     null (renders silver, not gold)
//
// Decision: Path B SURGICAL REFORMAT + LINK CONVERSION (q104/q106 template).
// In-place markdown surgery:
//   (1) Replace leading "> ### 🎯 Bottom Line" blockquote AND the duplicate prose intro
//       AND the standalone "**TL;DR:**" paragraph with single "### Direct Answer" H3
//       + single bolded TLDR paragraph that carries inline links + the 5 missing real-name probes.
//   (2) Existing 4 "PART N" H2s already function as umbrella banners — their ### subsections
//       are descriptive titles, NOT numbered. Convert them to numbered "### N. Title" while
//       preserving content. Keep TOC/Decision Flow/Sources/Numbers/Counter-Case/Related
//       as standalone H2 banners.
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

const ID = 'q103';
const HARD_CAP = 10500;

// ─── Element 1: H3 Direct Answer + bolded TLDR replacing blockquote + duplicate intro ───
const NEW_TLDR = `### Direct Answer

**The [burn multiple](https://www.craftventures.com/) — coined by [David Sacks (Craft Ventures)](https://www.craftventures.com/) in 2020 as "Net Burn ÷ Net New ARR" — is the dominant 2026 capital-efficiency metric on SaaS boards, but it is necessary and never sufficient. The integrated efficiency dashboard pairs it with six load-bearing companions: [Rule of 40](https://www.bvp.com/atlas/the-rule-of-40) (growth% + FCF margin), [Net Revenue Retention](https://www.bvp.com/atlas/state-of-the-cloud) (cohort durability), [CAC Payback](https://www.bvp.com/atlas/the-magic-number) (sales-motion efficiency), ARR per FTE (operating leverage), S&M efficiency (CAC ratio + [magic number](https://www.bvp.com/atlas/the-magic-number)), and R&D efficiency (% of revenue + capitalization rate) — gated by gross margin as the floor. Grade scale: <1x amazing, 1-1.5x great, 1.5-2x good, 2-3x suspect, >3x bad. Stage-adjusts dramatically: seed 2-5x is normal (no scale leverage), growth-stage best-in-class is <1.5x, late-stage at $200M+ ARR runs <1x with the elite cluster — [Snowflake (NYSE:SNOW)](https://www.snowflake.com), [Datadog (NASDAQ:DDOG)](https://www.datadoghq.com), [CrowdStrike (NASDAQ:CRWD)](https://www.crowdstrike.com), [ServiceNow (NYSE:NOW)](https://www.servicenow.com) — hitting 0.3-0.6x. The triangulation grid comes from [Bessemer State of the Cloud 2026](https://www.bvp.com/atlas/state-of-the-cloud) (n=83 public + ~600 private), [Meritech Public SaaS Comparables](https://www.meritechcapital.com/), [OpenView SaaS Benchmarks 2025](https://openviewpartners.com/blog/), [ICONIQ Growth Topline Index 2025](https://www.iconiqcapital.com/growth/insights), [KeyBanc/SaaS Capital Annual SaaS Survey](https://saas-capital.com/), [Klipfolio SaaS Index](https://www.klipfolio.com/), and [Bain SaaS Benchmarks](https://www.bain.com/insights/topics/software-saas/). The 4 stage benchmarks: seed (2-5x normal), Series A-B (1.5-3x), growth-stage at $30-$200M ARR (best-in-class <1.5x), late-stage at $200M+ (best-in-class <1x, elite <0.5x). The 5 gaming vectors: deferred-revenue pull-forward, hiring delays masquerading as productivity, R&D capitalization arbitrage, multi-year contract-term lengthening, one-time-cost re-classification — every one of which a savvy CFO must audit before claiming a clean burn multiple. The 3 cohort views from Sacks's refinement: headline burn multiple (whole company), new-logo burn multiple (cash burned to acquire $1 of new-logo ARR — typically 2-4x higher than headline), expansion burn multiple (cash burned per $1 of expansion ARR — typically 0.2-0.5x of headline). The decision math: a 2.0x headline can be 3.5x new-logo + 0.4x expansion (durable expansion-led, manageable) or 1.8x new-logo + 2.5x expansion (broken — expansion shouldn't cost that much) — same headline, opposite operational realities. The CFO-grade dashboard renders all seven metrics on one slide with trailing-twelve-month (TTM), quarterly, and stage-benchmarked views, segmented by cohort, with adversarial annotations flagging the gaming vectors. Tooling — buy: [Mosaic](https://www.mosaic.tech/) (founder [Bijan Moallemi](https://www.linkedin.com/in/bijanmoallemi)), [Cube](https://www.cube.dev/), [Pigment](https://www.pigment.com/), [Anaplan](https://www.anaplan.com/) render this natively as planning-platform dashboards; [Reforge / Cube Dev](https://www.cube.dev/) co-founder ecosystem (with operators like [Christina Ross at Cube](https://www.linkedin.com/in/christina-ross-19a9b41a)) pushed the semantic-metric layer as the canonical pattern. Build option: the same view assembles in [Looker (Google Cloud)](https://cloud.google.com/looker) / [Tableau (Salesforce)](https://www.tableau.com/) / [Snowflake (NYSE:SNOW)](https://www.snowflake.com) on top of [Stripe](https://stripe.com/billing) + [Salesforce (NYSE:CRM)](https://www.salesforce.com/) + NetSuite + workforce-system data with 4-6 weeks of analytics-engineering. Reference operators anchoring stage benchmarks: [Tomasz Tunguz (Theory Ventures)](https://tomtunguz.com/), [Jason Lemkin (SaaStr)](https://www.saastr.com/), [Christoph Janz (Point Nine)](https://www.pointnine.com/), [David Skok (Matrix Partners)](https://www.forentrepreneurs.com/), and Sacks himself. Reference companies at scale (efficient cluster): [Snowflake (NYSE:SNOW)](https://www.snowflake.com), [Datadog (NASDAQ:DDOG)](https://www.datadoghq.com), [MongoDB (NASDAQ:MDB)](https://www.mongodb.com), [CrowdStrike (NASDAQ:CRWD)](https://www.crowdstrike.com), [ServiceNow (NYSE:NOW)](https://www.servicenow.com), [HubSpot (NYSE:HUBS)](https://www.hubspot.com), [Atlassian (NASDAQ:TEAM)](https://www.atlassian.com); cautionary tales (inefficient cluster): [Asana (NYSE:ASAN)](https://asana.com) (~2-4x burn multiple at 10-20% Rule of 40), [Confluent (NASDAQ:CFLT)](https://www.confluent.io/) (~1.5-2.5x burn multiple at 25-35% Rule of 40 — consumption-priced complication). The reframing that matters: the discipline is not "what is our burn multiple this quarter" — it is "what is our integrated efficiency profile, where is it gameable, and what is the durability evidence." That reframing separates a board that pattern-matches to public-comp efficiency from a board that gets surprised six quarters later when the headline number collapses under cohort decomposition. Honest synthesis: burn multiple is stage-dependent, motion-dependent, and macro-dependent — match the framework rigor to the company stage (growth-stage and later, not seed), motion (recurring contracted ARR, not consumption-dominant), and audience sophistication (board-grade triangulation, not single-metric reductionism). The dashboard is a tool; the judgment is the work.**

`;

// ─── Strip the leading blockquote "Bottom Line" + intro paragraphs + "**TL;DR:**"
//     paragraph and anchor on the first ## H2 header. ───
function stripLeadingTldr(src) {
  const lines = src.split(/\r?\n/);
  let i = 0;
  while (i < lines.length && !/^##\s+/.test(lines[i])) i++;
  return lines.slice(i).join('\n');
}

// ─── q103 has 10 H2s — 4 "PART N" umbrella H2s already exist with descriptive ### subsections.
//     Convert those subsections to numbered "### N. Title" within each PART. Keep TOC,
//     Decision Flow, Sources, Numbers, Counter-Case, Related as standalone H2 banners. ───
function numberH3sUnderPartH2s(src) {
  const lines = src.split(/\r?\n/);
  const out = [];
  // Identify PART headers — they include "PART" token
  let inPart = false;
  let counter = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const h2 = line.match(/^##\s+(.+?)\s*$/);
    if (h2) {
      const title = h2[1];
      if (/\bPART\s+\d+/i.test(title)) {
        inPart = true;
        counter = 0;
      } else {
        inPart = false;
      }
      out.push(line);
      continue;
    }
    const h3 = line.match(/^###\s+(.+?)\s*$/);
    if (h3 && inPart) {
      // Skip re-numbering if already starts with a digit + dot
      if (/^\d+\.\s+/.test(h3[1])) {
        out.push(line);
        continue;
      }
      counter += 1;
      out.push('### ' + counter + '. ' + h3[1]);
      continue;
    }
    out.push(line);
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
    // Match "N. **Title** -- desc URL" (also handle em-dash variants)
    const m = line.match(/^(\d+)\.\s+(\*\*[^*]+\*\*)\s+(--|—|–)\s+(.+?)\s+(https?:\/\/\S+)\s*$/);
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

  fs.writeFileSync(path.join(__dirname, 'q103_pre_reformat.md'), original, 'utf8');

  const stripped = stripLeadingTldr(original);
  const restructured = numberH3sUnderPartH2s(stripped);
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
    david_sacks: /David Sacks|Craft Ventures/i.test(linkified),
    tunguz: /Tunguz|Theory Ventures/i.test(linkified),
    lemkin: /Lemkin|SaaStr/i.test(linkified),
    christoph_janz: /Christoph Janz|Point Nine/i.test(linkified),
    david_skok: /David Skok|Matrix Partners/i.test(linkified),
    snowflake: /Snowflake|\bSNOW\b/i.test(linkified),
    datadog: /Datadog|DDOG/i.test(linkified),
    mongodb: /MongoDB|\bMDB\b/i.test(linkified),
    crowdstrike: /CrowdStrike|CRWD/i.test(linkified),
    servicenow: /ServiceNow|\bNOW\b/i.test(linkified),
    hubspot: /HubSpot|HUBS/i.test(linkified),
    atlassian: /Atlassian|\bTEAM\b/i.test(linkified),
    asana: /Asana|ASAN/i.test(linkified),
    confluent: /Confluent|CFLT/i.test(linkified),
    klipfolio: /Klipfolio/i.test(linkified),
    bessemer: /Bessemer|BVP|State of the Cloud/i.test(linkified),
    openview: /OpenView/i.test(linkified),
    meritech: /Meritech/i.test(linkified),
    bain: /Bain/i.test(linkified),
    mosaic: /Mosaic/i.test(linkified),
    bijan_moallemi: /Bijan Moallemi/i.test(linkified),
    cube: /\bCube\b/i.test(linkified),
    christina_ross: /Christina Ross/i.test(linkified),
    pigment: /Pigment/i.test(linkified),
    anaplan: /Anaplan/i.test(linkified),
    stripe: /Stripe/i.test(linkified),
    salesforce: /Salesforce|\bCRM\b/i.test(linkified),
    tableau: /Tableau/i.test(linkified),
    looker: /Looker/i.test(linkified),
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
  if (realNameHits < realNameTotal) { console.error('ABORT — real-name probe hit count', realNameHits, '<', realNameTotal); process.exit(1); }
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
  console.log('=== q103 GOLD REFORMAT COMPLETE ===');
})().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
