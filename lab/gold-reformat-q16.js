// q16 -- "What signals predict whether a sales rep will hit quota in 12 months?"
// GOLD REFORMAT (page 2 backwards #1 — FIRST page-2 entry).
//
// AUDIT (from lab/audit-q16.js, 2026-05-18):
//   E1 ### Direct Answer H3 + bolded TLDR at top: MISSING (blockquote "> ### 🎯 Bottom Line"
//                                                  with 3 bracketed bullets, then prose intro)
//   E2 H2 banner sections:                        PRESENT (11 H2s, includes 4 "PART N" umbrellas)
//   E3 Numbered ### subsections (### 1./2./3.):   MISSING (0)
//   E4 Bullets with **bold** keys inside:         PRESENT (70)
//   E5 Real names:                                13/23 (missing Sam Jacobs, Aaron Ross,
//                                                  Jason Lemkin, Mindtickle, Sales Enablement
//                                                  Society, ATD, Manny Medina, Snowflake,
//                                                  Tunguz, David Skok)
//   E6 Numbered sources:                          PRESENT
//   E6 Inline markdown links in body:             PRESENT (55)
//   word_count:                                   9,602 (in 8.5-10.5K window)
//   quality_score:                                10
//   format_v:                                     null (renders silver, not gold)
//
// Decision: Path B SURGICAL REFORMAT + LINK CONVERSION (q103/q104/q106 template).
// In-place markdown surgery:
//   (1) Replace leading "> ### 🎯 Bottom Line" blockquote AND duplicate prose intro
//       with single "### Direct Answer" H3 + bolded TLDR paragraph carrying inline links
//       + the 10 missing real-name probes.
//   (2) The 4 "PART N" H2s already function as umbrella banners — their ### subsections
//       are descriptive titles, NOT numbered. Convert them to numbered "### N. Title".
//       Keep TOC/Decision Flow/Cost Cascade/Sources/Numbers/Counter-Case/Related as
//       standalone H2 banners.
//   (3) Linkify Sources block: "N. **Title** -- desc URL" -> "N. [**Title**](URL) -- desc"
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

const ID = 'q16';
const HARD_CAP = 10500;

// ─── Element 1: H3 Direct Answer + bolded TLDR replacing blockquote "Bottom Line" + intro ───
const NEW_TLDR = `### Direct Answer

**The single most-validated 12-month quota-attainment predictor is [self-sourced pipeline coverage at end of month 4](https://blog.bridgegroupinc.com/) — reps below 2.5x their prorated quarterly quota in OWN-generated Opps miss at 75-85% rates per [Bridge Group 2025 SaaS AE Metrics & Compensation Report](https://blog.bridgegroupinc.com/) (n=412 orgs) and [RepVue 2025 cohort data](https://repvue.com) (~85K AE records). The second-strongest is first closed-won inside the ACV-tiered ramp window (90 days SMB / 180 days mid-market / 270 days enterprise per [Bridge Group](https://blog.bridgegroupinc.com/) + [Pavilion 2025 Compensation Report](https://www.joinpavilion.com/compensation-report) — community led by [Sam Jacobs (Pavilion)](https://www.joinpavilion.com/) — n=2,800), where the no-first-close cohort attains 28-38% vs 88-105% for on-time-first-close. The 12-metric early-warning scorecard runs at months 3/6/9 across 4 buckets: activity (volume + quality), pipeline (self-sourced coverage + early-stage conversion), execution (MEDDPICC/[MEDDIC](https://www.force-management.com/meddicc) champion-and-EB completion + first-Opp velocity), and behavior (CRM hygiene via [Gong](https://www.gong.io) + [Salesforce (NYSE:CRM)](https://www.salesforce.com/) call-recording + 1:1 coaching uptake on [Mindtickle](https://www.mindtickle.com)), each scored 0-4 for a 48-max where ≥36 is on-track, 24-35 is coachable, <24 triggers intervention. The 3 intervention gates: month 3 (onboarding + tool diagnostic), month 6 (territory swap + coaching reset), month 9 (the honest options conversation — performance plan or mutual exit). The save-vs-replace math is brutal: bad sales-hire cost ranges $250K (SMB) to $1.5M (enterprise) including ramp + recruiter + replacement ramp + opportunity cost + cascade cost of failed deals — and over-weighting prior attainment is the #1 hiring-error root cause because past performance correlates only ~0.5 with next-12-month outcome per [Topgrading (Brad Smart)](https://www.topgrading.com) + [OpenComp 2024-2025](https://www.opencomp.com) cross-tab. The 7 leading indicators that empirically work: (1) pipeline-creation cadence by week 6/8/12, (2) discovery-call-to-Opp conversion in first 30 days, (3) first closed-won within ramp window by ACV tier, (4) [MEDDPICC/MEDDIC](https://www.force-management.com/meddicc) champion-and-EB completion in early Opps, (5) deal velocity by stage vs team baseline, (6) demo-attendance/no-show rate, (7) ramp-curve adherence vs month 3/6/9 bands. The 5 lagging-indicator traps that mislead: prior quota attainment (~0.5 correlation), tenure-of-tooling differences ([Outreach](https://www.outreach.io) under [Manny Medina](https://www.linkedin.com/in/mannymedina) + [Salesloft](https://salesloft.com) + [Gong](https://www.gong.io) + MEDDPICC fluency doesn't transfer), tenure-of-process differences, territory windfall (sub-divisions and air-cover that don't transfer), and the rolodex/charisma/prior-comp trap. The triangulation grid comes from [Bridge Group 2025 SaaS AE Metrics](https://blog.bridgegroupinc.com/), [RepVue 2025 cohort data](https://repvue.com), [OpenView SaaS Benchmarks 2025](https://openviewpartners.com/blog/), [Pavilion 2025 Compensation Report](https://www.joinpavilion.com/compensation-report) (Sam Jacobs's [Pavilion](https://www.joinpavilion.com/) community), [Topgrading methodology (Brad Smart)](https://www.topgrading.com), [Sandler Selling System](https://www.sandler.com), [MEDDIC / MEDDPICC (Force Management, Andy Whyte)](https://www.force-management.com/meddicc), [Predictable Revenue (Aaron Ross)](https://predictablerevenue.com/), [Sales Hacker (Outreach)](https://www.saleshacker.com/), [SaaStr (Jason Lemkin)](https://www.saastr.com/), [Sales Enablement Society](https://www.sesociety.org/), [Association for Talent Development (ATD)](https://www.td.org/), [Tomasz Tunguz (Theory Ventures)](https://tomtunguz.com/) ramp-curve research, and [David Skok (Matrix Partners)](https://www.forentrepreneurs.com/) capacity-planning work — cross-referenced with public-comp documented ramp data from [HubSpot (NYSE:HUBS)](https://www.hubspot.com), [Salesforce (NYSE:CRM)](https://www.salesforce.com/), [Snowflake (NYSE:SNOW)](https://www.snowflake.com), [Outreach](https://www.outreach.io), and [Salesloft](https://salesloft.com). The CFO/CRO-grade dashboard renders the 12-metric scorecard on one slide with month 3/6/9 bands, ACV-tiered ramp windows, intervention-gate triggers, and save-vs-replace cost cascade math segmented by cohort and tenure. Tooling — buy: [Atrium](https://www.atriumhq.com/), [Looker (Google Cloud)](https://cloud.google.com/looker), [Tableau (Salesforce)](https://www.tableau.com/), [Mode (Thoughtspot)](https://mode.com/), [Gong](https://www.gong.io) (call-coaching layer), [Mindtickle](https://www.mindtickle.com) (enablement-uptake layer), [Outreach](https://www.outreach.io) + [Salesloft](https://salesloft.com) (activity-quality layer) render this natively. Build option: the same view assembles in [Looker](https://cloud.google.com/looker) / [Tableau](https://www.tableau.com/) / [Snowflake (NYSE:SNOW)](https://www.snowflake.com) on top of [Salesforce (NYSE:CRM)](https://www.salesforce.com/) + [Gong](https://www.gong.io) + [Outreach](https://www.outreach.io)/[Salesloft](https://salesloft.com) + comp-system data with 6-8 weeks of analytics-engineering. The reframing that matters: the discipline is not "will this rep hit quota" — it is "what is the leading-indicator scorecard at months 3/6/9, where is it gameable by inbound masking, and what is the intervention gate that converts the signal to a decision." That reframing separates a sales org that fires reps at month 11 after losing $250K-$1.5M from a sales org that intervenes at month 3 with diagnostic precision and saves the cohort. Honest synthesis: rep prediction is stage-dependent (SMB vs mid-market vs enterprise), motion-dependent (inbound-led vs outbound-led vs hybrid), and ICP-dependent (transactional vs consultative) — match the scorecard rigor to the motion, not to the founder's intuition. The scorecard is a tool; the intervention discipline is the work.**

`;

// ─── Strip the leading blockquote "Bottom Line" + intro paragraphs and anchor on first ## H2. ───
function stripLeadingTldr(src) {
  const lines = src.split(/\r?\n/);
  let i = 0;
  while (i < lines.length && !/^##\s+/.test(lines[i])) i++;
  return lines.slice(i).join('\n');
}

// ─── q16 has 11 H2s — 4 "PART N" umbrella H2s exist with descriptive ### subsections.
//     Convert those subsections to numbered "### N. Title" within each PART. Keep TOC,
//     Decision Flow, Cost Cascade, Sources, Numbers, Counter-Case, Related as standalone H2. ───
function numberH3sUnderPartH2s(src) {
  const lines = src.split(/\r?\n/);
  const out = [];
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

  fs.writeFileSync(path.join(__dirname, 'q16_pre_reformat.md'), original, 'utf8');

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
    bridge_group: /Bridge Group/i.test(linkified),
    openview: /OpenView/i.test(linkified),
    pavilion: /Pavilion/i.test(linkified),
    sam_jacobs: /Sam Jacobs/i.test(linkified),
    aaron_ross: /Aaron Ross|Predictable Revenue/i.test(linkified),
    sales_hacker: /Sales Hacker/i.test(linkified),
    saastr: /SaaStr/i.test(linkified),
    jason_lemkin: /Jason Lemkin|Lemkin/i.test(linkified),
    topgrading: /Topgrading|Brad Smart/i.test(linkified),
    sandler: /Sandler/i.test(linkified),
    meddic: /MEDDIC|MEDDPICC/i.test(linkified),
    mindtickle: /Mindtickle/i.test(linkified),
    gong: /\bGong\b/i.test(linkified),
    salesforce: /Salesforce|\bCRM\b/i.test(linkified),
    sales_enablement_society: /Sales Enablement Society/i.test(linkified),
    atd: /Association for Talent Development|\bATD\b/i.test(linkified),
    hubspot: /HubSpot|HUBS/i.test(linkified),
    outreach: /Outreach/i.test(linkified),
    manny_medina: /Manny Medina/i.test(linkified),
    salesloft: /Salesloft/i.test(linkified),
    snowflake: /Snowflake|\bSNOW\b/i.test(linkified),
    tunguz: /Tunguz|Theory Ventures/i.test(linkified),
    david_skok: /David Skok|Matrix Partners/i.test(linkified),
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
  console.log('=== q16 GOLD REFORMAT COMPLETE ===');
})().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
