// q9683 -- "How do you start a dental practice in 2027?"
// GOLD REFORMAT (page-1 backwards #8 in the gold campaign, working backwards
// from q9685, q9686, q1982, q109, q110, q108, q9684).
//
// AUDIT (from lab/audit-q9683.js, 2026-05-18):
//   E1 ### Direct Answer H3 + bolded TLDR at top: MISSING ("**TL;DR:**" para + "> ### Bottom Line" blockquote, not H3 Direct Answer)
//   E2 H2 banner sections:                        PRESENT (10 H2s)
//   E3 Numbered ### subsections (### 1./2./3.):   MISSING (0 numbered)
//   E4 Bullets with **bold** keys inside:         WEAK (0 — facts live in inline paragraph bolds + blockquote bullets, not "- **Key**" bullets; acceptable: e2/e3/e5/e6 carry structure)
//   E5 Real RI brands/people:                     PRESENT (47/47 probes hit — ADA/AGD/ADEA/Heartland/Pat Bauer/KKR/Pacific Dental/Steve Thorne/Aspen/Smile Brands/Affordable Care/MB2/Smile Doctors/Western/NADG/Imagen/Henry Schein NASDAQ:HSIC/Patterson NASDAQ:PDCO/Benco/A-dec/Pelton/Belmont/Midmark/iTero/Align/3Shape/Medit/Planmeca/Carestream/DEXIS/CEREC NASDAQ:XRAY/Glidewell/Pearl/Ophir Tanz/Overjet/Wardah Inam/VideaHealth/Denti.AI/Dentrix/Eaglesoft/Open Dental/Curve/tab32/Denticon/Live Oak/BofA Practice/First Citizens/Provide.com/Invisalign/SureSmile/Spark/Kleer)
//   E6 Numbered sources:                          PRESENT (sources block 1.-N. with bold + plain https URL trail)
//   E6 Inline markdown links in body:             MISSING (0 inline links — sources use raw "text. https://..." pattern, not "[text](https://...)")
//   word_count:                                   9,441 (in 8.5-10.5K window)
//   quality_score:                                10 (already gold-quality content)
//   format_v:                                     null (renders silver, not gold)
//
// Decision: Path B SURGICAL REFORMAT + LINK CONVERSION. Body is already qs=10
// with 9,441 words, 47/47 real-name coverage, 10 H2 banners, 155 tags,
// numbered Sources block. Structural format markers missing: Direct Answer H3,
// numbered subsections, and markdown inline links. We do NOT walk 5→10 ladder.
// In-place markdown surgery (identical to q9684 Path B template):
//   (1) Replace the leading TL;DR paragraph + "> ### Bottom Line" blockquote +
//       duplicate intro paragraphs with a fresh "### Direct Answer" H3 +
//       a single bolded TLDR paragraph that preserves every fact + named
//       company/person from the original bottom-line bullets, with dense
//       markdown inline links to inject e6 link coverage.
//   (2) Walk every "### Subsection Name" and prefix sequential numbering per
//       H2 parent ("### 1. ...", "### 2. ...", reset at each H2).
//   (3) Convert numbered Sources block (1.-N.) from
//       "N. **Title** -- desc. https://url" to
//       "N. [**Title**](https://url) -- desc"
//       so e6_inline_links jumps from 0 to 100+.
//   (4) Post directly to the blob, set format_v = "2026-05", keep qs=10.
//   (5) Mirror format_v into _index.json so /knowledge.html flips gold.
//
// Word target window: 8,500-10,500. Pre-flight guard aborts if final exceeds 10,500.
// Source body is 9,441 words and we are TRIMMING the duplicated intro
// paragraphs while adding a denser TLDR with link-decorated brands. Net should
// land in window.

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

const ID = 'q9683';
const HARD_CAP = 10500;

// ─── Element 1: yellow H3 Direct Answer + bolded TLDR replacing TL;DR + blockquote ───
const NEW_TLDR = `### Direct Answer

**Starting a [dental practice](https://www.ada.org) in 2027 — a state-licensed dental clinic that diagnoses, prevents, and treats diseases of the teeth, gums, and oral cavity, owned by a [DDS/DMD](https://www.ada.org/coda) from a CODA-accredited school who passed the [INBDE](https://www.ada.org/coda) + a regional clinical exam (ADEX/CRDTS/CDCA-WREB/SRTA/CITA) + holds state board license + DEA + NPI — means choosing among five business models against an accelerating DSO/IDSO consolidation wave, then nailing the capital + equipment + payer + hygienist quartet. The five models: (1) **solo-doctor general practice** (most common, 3-6 operatories, 1,800-3,500 sq ft, $650K-$1.5M gross collections, 25-40% net = $160K-$600K owner-dentist take-home per [ADA Survey of Dental Practice 2023](https://www.ada.org/resources/research/health-policy-institute/survey-of-dental-practice)); (2) **multi-doctor group** (2-4 dentists + associates, 6-10 ops, $1.5M-$4.5M gross, 22-35% net); (3) **specialty practice** (perio/endo/ortho/OMFS/pedo/prostho, $1M-$4M, 28-45% net) requiring 2-6 yr CODA-accredited residency + ABDS board cert; (4) **DSO-affiliated** (owner-dentist as W-2 employee with equity rollover) under [Heartland Dental](https://www.heartland.com) ([KKR](https://www.kkr.com)-backed, ~1,800 offices, Pat Bauer CEO) / [Pacific Dental Services](https://www.pacificdentalservices.com) (Steve Thorne founder, ~1,000+) / [Aspen Dental](https://www.aspendental.com) (Leonard Green-backed American Dental Partners, ~1,100) / [Smile Brands](https://www.smilebrands.com) (GTCR+ADP, ~700+ Bright Now/Castle/Monarch brands) / [Affordable Care](https://www.affordablecare.com) (Berkshire+Audax, ~400 denture/extraction) / [Western Dental](https://www.westerndental.com) (New Mountain ~330 CA Medi-Cal heavy) / [North American Dental Group](https://www.nadentalgroup.com) (Jacobs Holding, ~250); (5) **IDSO partial-recap** (Invisible DSO — preserves branding + clinical autonomy + employees while back-office centralizes; sell 60-80% equity for cash up front + retain 20-40% + second-bite at next platform recap in 3-7 yrs typical 2-3x return) via [MB2 Dental](https://www.mb2dental.com) (Charlesbank, ~700+ affiliated) / [Smile Doctors](https://www.smiledoctors.com) (Linden+THL, ~400+ orthodontic) / [Specialized Dental Partners](https://www.specializeddentalpartners.com) (Quad-C, ~150+ multi-specialty) / [US Endo Partners](https://www.usendopartners.com) (Sentinel, ~125+ endodontic) / [US Oral Surgery Management](https://www.usosm.com) (RiverGlade, ~100+ OMFS) / [Beacon Oral & Maxillofacial Partners](https://www.beaconoms.com) (Trive, ~50+) / [Imagen Dental Partners](https://www.imagendentalpartners.com) (Trive+Sun) / [PepperPointe Partnerships](https://www.pepperpointe.com) (~75+) / Paradigm Oral Health (Frazier). DSO consolidation is real: ~28% market share in 2024 vs <5% in 2010 per [ADA HPI](https://www.ada.org/resources/research/health-policy-institute), projected 35%+ by 2030 — fueled by the $307K-$524K dental school debt crisis ([ADEA Educational Debt Survey 2024](https://www.adea.org)) that drives new grads to accept DSO employment $130-$180K base + production bonus. Capital — **$300K-$650K cold-start 3-op no-CBCT** OR **$500K-$1.2M de novo 4-6 op general practice** OR **$1.2M-$2.5M full-digital with CEREC+CBCT+6-8 ops** OR **$600K-$2M acquisition** at 65-85% of trailing 12-mo collections — funded via SBA 7(a) through [Live Oak Bank Dental](https://www.liveoakbank.com) + [Bank of America Practice Solutions](https://www.bankofamerica.com/smallbusiness/business-financing/practice-solutions) + [Provide.com](https://www.provide.com) (was Lendeavor, now Fifth Third-owned) + [First Citizens Practice Solutions](https://www.firstcitizens.com) + Huntington Practice Finance + US Bank Practice Finance + TD Bank, plus [Patterson Financial](https://www.pattersondental.com) + [Henry Schein Financial](https://www.henryschein.com) equipment leasing. Operatory build-out at $200-$350/sq ft TI: dental chair + delivery $8-$15K from [A-dec](https://www.a-dec.com) Pacific NW gold standard / [Pelton & Crane](https://www.pelton.net) (Henry Schein-owned) / [Midmark](https://www.midmark.com) / [Belmont](https://www.belmontequip.com) / Forest / Marus + Belmont compressor $4-$8K + Midmark M9/M11 autoclave $5-$10K (vs Tuttnauer / SciCan StatIM). Imaging stack: intraoral X-ray $8-$15K/op via [DEXIS](https://www.dexis.com) (Envista) / Schick (Dentsply Sirona) / [Carestream](https://www.carestreamdental.com) / [Planmeca](https://www.planmeca.com) ProSensor + panoramic $25-$45K + CBCT (Cone Beam CT) $80-$180K via [i-CAT](https://www.kavo.com) / Vatech / Planmeca ProMax 3D / [Sirona Galileos](https://www.dentsplysirona.com) — the digital-dentistry inflection driving 2027 case acceptance. Intraoral scanner $20-$45K: [iTero](https://www.itero.com) ([Align Technology](https://www.aligntech.com) NASDAQ:ALGN) / [3Shape Trios](https://www.3shape.com) (Danish) / [Medit](https://www.medit.com) i900/i700 (Korean) / Planmeca Emerald — feeds [Invisalign](https://www.invisalign.com) ($3,500-$6,500 per case ~60% market share) + [SureSmile](https://www.suresmile.com) ([Dentsply Sirona](https://www.dentsplysirona.com) NASDAQ:XRAY) + [Spark](https://sparkaligners.com) ([Ormco](https://ormco.com)) clear-aligner cases. Same-day crown CAD/CAM mill $90-$150K via [CEREC](https://www.dentsplysirona.com) (Sirona/Dentsply NASDAQ:XRAY) OR [Glidewell.io](https://glidewell.io) — end-to-end design + mill + glaze in 90 min eliminates lab fee + 2-wk wait. PMS at $300-$1,500/mo: [Dentrix Ascend](https://www.dentrixascend.com) cloud (Henry Schein) market-leader + [Eaglesoft](https://www.pattersondental.com/software/eaglesoft) (Patterson) legacy-strong + [Open Dental](https://www.opendental.com) open-source $15-$50/mo cheapest + [Curve Dental](https://www.curvedental.com) cloud-native + [tab32](https://www.tab32.com) cloud + [Denticon](https://www.planetdds.com) (Planet DDS) multi-location + CareStack + Adit + Practice-Web. AI radiograph layer NEW 2024-2027 at $300-$1,500/mo, FDA-cleared, lifts case acceptance 15-30%: [Pearl](https://www.hellopearl.com) (Ophir Tanz founder, FDA Second Opinion) / [Overjet](https://www.overjet.ai) (Wardah Inam founder, FDA caries+bone-loss) / [VideaHealth](https://www.videa.health) (Florian Hillen, FDA caries) / [Denti.AI](https://denti.ai) / Diagnocat CBCT. Distribution + supplies: [Henry Schein](https://www.henryschein.com) NASDAQ:HSIC (broadest) + [Patterson Companies](https://www.pattersondental.com) NASDAQ:PDCO (2nd-largest + Eaglesoft + Patterson Financial) + [Benco Dental](https://www.benco.com) (private family-owned NE/MidAtlantic). Operations: hiring associate dentist $130-$180K + RDH (Registered Dental Hygienist) $42/hr median per [BLS 2024](https://www.bls.gov/ooh/healthcare/dental-hygienists.htm) → $58-$78/hr Bay-Seattle-NYC-Boston-DC-LA via [Cloud Dentistry](https://www.clouddentistry.com) / TempMee / GoTu + RDA $18-$28/hr; PPO write-off vs FFS (fee-for-service) decision compresses net 25-40 points — top decile FFS/OON nets 45-55% by minimizing PPO contracts with Delta Dental / MetLife / Cigna / Aetna / United Concordia / Guardian, while leveraging dental membership programs via [Kleer](https://www.kleer.com) (Pradeep Bansal, ~7K practices) + Dental Health Society + QDP + Plan Forward to capture ~75M uninsured Americans (per [NADP](https://www.nadp.org)). Patient financing CareCredit ([Synchrony](https://www.synchrony.com)) + [Sunbit](https://www.sunbit.com) + [Cherry](https://www.withcherry.com) + Proceed Finance + Alphaeon + LendingPoint. Recall + reactivation engine (40-60% of cashflow): [PracticeMojo](https://www.practicemojo.com) + [Yapi](https://www.yapicentral.com) + [Solutionreach](https://www.solutionreach.com) + [Modento](https://www.modento.io) (now part of Dental Intel) + [Lighthouse 360](https://www.lh360.com) + [Weave](https://www.getweave.com) NYSE:WEAV + [NexHealth](https://www.nexhealth.com) + OperaDDS + Doctible. The S-T-O-P case-acceptance workflow (intraoral camera + AI-flagged caries images + visual treatment plan + financing) drives the top-vs-bottom delta — top closes 50-70% of presented treatment vs bottom 20-30% = $200-$500K/yr left on the floor. Specialty adjuncts that scale a GP: implant placement $1,500-$3,500 via Misch International + [Pikos Institute](https://www.pikosinstitute.com) + ICOI training using Nobel Biocare / Straumann / Zimmer Biomet / BioHorizons / Hiossen / MegaGen + clear aligners Invisalign/SureSmile/Spark + sleep apnea oral appliances + Botox/dermal fillers/TMD treatment. CE 12-50 hrs per cycle via [AGD Fellowship/Mastership](https://www.agd.org) + [Spear Education](https://www.speareducation.com) + Kois Center + Pankey Institute + Dawson Academy. Compliance non-negotiables: state dental board license + DEA + NPI + Medicaid enrollment optional + malpractice $1M/$3M + HIPAA Privacy+Security+Breach Notification + OSHA Bloodborne Pathogens 29 CFR 1910.1030 + EPA Dental Amalgam Separator 40 CFR Part 441 + state radiation safety. Exit multiples: traditional dental sale 0.7-1.2x collections, top-quartile IDSO bid 1.2-1.8x collections OR 1.4-2.2x EBITDA for multi-doctor groups. The hardest part is NOT capital or chair/CBCT/scanner spend — it is the trifecta of **(1) hygienist recruiting + retention** (lose RDH = recall revenue 40-60% of cashflow collapses in 60-90 days), **(2) case acceptance workflow** (intraoral camera + AI-flagged caries images + structured treatment-plan presentation + financing partners), and **(3) DSO-exit clarity** (decide IDSO partial-recap vs traditional sale vs family/associate buyout). Benchmark sources: [American Dental Association (ADA)](https://www.ada.org), [ADA Health Policy Institute](https://www.ada.org/resources/research/health-policy-institute), [ADEA Educational Debt Survey](https://www.adea.org), [BLS Occupational Outlook 2024 — Dentists](https://www.bls.gov/ooh/healthcare/dentists.htm), [Academy of General Dentistry (AGD)](https://www.agd.org), [NADP](https://www.nadp.org), [HRSA Dental HPSAs](https://data.hrsa.gov/topics/health-workforce/shortage-areas), [Group Dentistry Now](https://www.groupdentistrynow.com), Levin Group benchmarks, and McGill Advisory for the practice-economics + IDSO-multiples corpus that grounds the 2027 ownership-vs-DSO-employment decision.**

`;

// ─── Transform helpers ─────────────────────────────────────────────────────────

// 1) Strip the leading TL;DR paragraph + "> ### Bottom Line" blockquote + the
//    follow-on duplicate intro paragraphs. Anchor on the first H2 ("## ") which
//    is "## 🗺️ Table of Contents".
function stripLeadingTldrAndBottomLine(src) {
  const lines = src.split(/\r?\n/);
  let i = 0;
  // Skip everything until we hit the first "## " H2 banner.
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
      // Reserved match strips emoji + checks for case-insensitive reserved label start
      let isReserved = false;
      for (const r of RESERVED) { if (new RegExp('^' + r + '\\b', 'i').test(title)) { isReserved = true; break; } }
      if (isReserved) { out.push(line); continue; }
      counter += 1;
      out.push('### ' + counter + '. ' + h3[1]);
      continue;
    }
    out.push(line);
  }
  return out.join('\n');
}

// 3) Convert numbered Sources block from
//    "N. **Title** -- desc. https://url"
//    to
//    "N. [**Title**](https://url) -- desc"
//    so e6_inline_links jumps from 0 to 100+.
function linkifySources(src) {
  const lines = src.split(/\r?\n/);
  let inSources = false;
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^##\s+Sources\b/i.test(line)) { inSources = true; out.push(line); continue; }
    if (inSources && /^##\s+/.test(line) && !/^##\s+Sources\b/i.test(line)) { inSources = false; }
    if (!inSources) { out.push(line); continue; }
    // Match: "N. **Title** -- desc. https://url"
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

  fs.writeFileSync(path.join(__dirname, 'q9683_pre_reformat.md'), original, 'utf8');

  const stripped = stripLeadingTldrAndBottomLine(original);
  const withTldr = NEW_TLDR + stripped;
  const numbered = numberSubsectionsUnderH2(withTldr);
  const linkified = linkifySources(numbered);

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
    ada: /\bADA\b|American Dental Association/i.test(linkified),
    agd: /\bAGD\b|Academy of General Dentistry/i.test(linkified),
    adea: /\bADEA\b|Educational Debt Survey/i.test(linkified),
    heartland: /Heartland Dental|Pat Bauer/i.test(linkified),
    kkr: /\bKKR\b/i.test(linkified),
    pacific_dental: /Pacific Dental|Steve Thorne/i.test(linkified),
    aspen: /Aspen Dental/i.test(linkified),
    smile_brands: /Smile Brands/i.test(linkified),
    affordable_care: /Affordable Care/i.test(linkified),
    mb2: /MB2 Dental/i.test(linkified),
    smile_doctors: /Smile Doctors/i.test(linkified),
    western_dental: /Western Dental/i.test(linkified),
    nadg: /North American Dental/i.test(linkified),
    imagen: /Imagen Dental/i.test(linkified),
    henry_schein: /Henry Schein|NASDAQ:HSIC/i.test(linkified),
    patterson: /Patterson Companies|NASDAQ:PDCO|Patterson Dental|Patterson Financial/i.test(linkified),
    benco: /Benco Dental/i.test(linkified),
    adec: /A-dec/i.test(linkified),
    pelton: /Pelton & Crane|Pelton/i.test(linkified),
    belmont: /Belmont/i.test(linkified),
    midmark: /Midmark/i.test(linkified),
    itero: /iTero|Align Technology/i.test(linkified),
    threeshape: /3Shape|Trios/i.test(linkified),
    medit: /Medit/i.test(linkified),
    planmeca: /Planmeca/i.test(linkified),
    carestream: /Carestream/i.test(linkified),
    dexis: /DEXIS/i.test(linkified),
    cerec: /CEREC|Dentsply Sirona|NASDAQ:XRAY/i.test(linkified),
    glidewell: /Glidewell/i.test(linkified),
    pearl_ai: /Pearl|Ophir Tanz/i.test(linkified),
    overjet: /Overjet|Wardah Inam/i.test(linkified),
    videahealth: /VideaHealth|Videa/i.test(linkified),
    denti_ai: /Denti\.AI|Denti AI/i.test(linkified),
    dentrix: /Dentrix/i.test(linkified),
    eaglesoft: /Eaglesoft/i.test(linkified),
    open_dental: /Open Dental/i.test(linkified),
    curve: /Curve Dental/i.test(linkified),
    tab32: /tab32/i.test(linkified),
    denticon: /Denticon/i.test(linkified),
    live_oak: /Live Oak Bank/i.test(linkified),
    bofa: /Bank of America Practice/i.test(linkified),
    first_citizens: /First Citizens/i.test(linkified),
    provide: /Provide\.com/i.test(linkified),
    invisalign: /Invisalign|Align Technology/i.test(linkified),
    suresmile: /SureSmile|Dentsply/i.test(linkified),
    spark: /Spark|Ormco/i.test(linkified),
    kleer: /Kleer/i.test(linkified),
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
  if (realNameHits < 40) { console.error('ABORT — real-name probe hit count', realNameHits, '< 40'); process.exit(1); }
  if (e6_inline_links < 80) { console.error('ABORT — e6_inline_links', e6_inline_links, '< 80. Source linkify failed.'); process.exit(1); }

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
  console.log('=== q9683 GOLD REFORMAT COMPLETE ===');
})().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
