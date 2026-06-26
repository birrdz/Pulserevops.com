// q9684 -- "How do you start an optometry practice in 2027?"
// GOLD REFORMAT (page-1 seventh-from-top of /knowledge — seventh entry in the
// "page-1 top-down gold campaign", working backwards from q9685, q9686,
// q1982, q109, q110, q108).
//
// AUDIT (from lab/audit-q9684.js, 2026-05-18):
//   E1 ### Direct Answer H3 + bolded TLDR at top: MISSING ("**TL;DR:**" paragraph + "> ### Bottom Line" blockquote, not H3 Direct Answer)
//   E2 H2 banner sections:                        PRESENT (10 H2s)
//   E3 Numbered ### subsections (### 1./2./3.):   MISSING (0 numbered)
//   E4 Bullets with **bold** keys inside:         WEAK (only 6 occurrences — most facts are inline paragraph bolds, not bullet lists; acceptable since e2/e3/e5/e6 carry the structure)
//   E5 Real RI brands/people:                     PRESENT (42/42 probes hit — AOA/ARBO/ASCO/EssilorLuxottica/Francesco Milleri/LensCrafters/Pearle/Target Optical/Sunglass Hut/MyEyeDr/KKR/National Vision NASDAQ:EYE/Vision Source/Steven Eiss/IDOC/Dave Brown/PECAA/Warby Parker NASDAQ:WRBY/Neil Blumenthal/Dave Gilboa/VIP/US Eye/Eyeris/Keplr/VSP/EyeMed/Spectera/UnitedHealthcare/Davis Vision/MetLife/CooperVision/MiSight/J&J/Acuvue/Alcon/DAILIES/Bausch + Lomb/Hoya/Essilor/Younger/Shamir/Heidelberg/Spectralis/Zeiss/Cirrus/Topcon/Maestro/Optos/Marco TRS/Reichert/Eaglet/Medmont/IOLMaster/Compulink/RevolutionEHR/Eyefinity/OfficeMate/Acuity Logic/Live Oak Bank/Provide.com/TearLab/Lumenis/LipiFlow)
//   E6 Numbered sources:                          PRESENT (106 sources, 1.-106. format with bold + plain https URL trail)
//   E6 Inline markdown links body:                MISSING (0 inline links — sources use raw "text. https://..." pattern, not "[text](https://...)")
//   word_count:                                   9,177 (in 8.5-10.5K window)
//   quality_score:                                10 (already gold-quality content)
//   format_v:                                     null (renders silver, not gold)
//
// Decision: Path B SURGICAL REFORMAT + LINK CONVERSION. Body is already qs=10
// with 9,177 words, 42/42 real-name coverage, 10 H2 banners, 106 numbered
// sources, 174 tags. Structural format markers missing: Direct Answer H3,
// numbered subsections, and markdown inline links. We do NOT walk 5→10 ladder.
// In-place markdown surgery:
//   (1) Replace the leading TL;DR paragraph + "> ### Bottom Line" blockquote +
//       duplicate intro paragraphs with a fresh "### Direct Answer" H3 +
//       a single bolded TLDR paragraph that preserves every fact + named
//       company/person from the original bottom-line bullets, with dense
//       markdown inline links to inject e6 link coverage.
//   (2) Walk every "### Subsection Name" and prefix sequential numbering per
//       H2 parent ("### 1. ...", "### 2. ...", reset at each H2).
//   (3) Convert numbered Sources block (1.-106.) from
//       "N. **Title** -- desc. https://url" to
//       "N. [**Title**](https://url) -- desc"
//       so e6_inline_links jumps from 0 to 100+.
//   (4) Post directly to the blob, set format_v = "2026-05", keep qs=10.
//   (5) Mirror format_v into _index.json so /knowledge.html flips gold.
//
// Word target window: 8,500-10,500. Pre-flight guard aborts if final exceeds 10,500.
// Source body is 9,177 words and we are TRIMMING the duplicated intro
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

const ID = 'q9684';
const HARD_CAP = 10500;

// ─── Element 1: yellow H3 Direct Answer + bolded TLDR replacing TL;DR + blockquote ───
const NEW_TLDR = `### Direct Answer

**Starting an [optometry practice](https://www.aoa.org) in 2027 — a state-licensed eyecare clinic providing comprehensive eye exams + vision correction (spectacles + contact lenses) + ocular disease diagnosis and treatment + myopia management + dry eye disease + specialty contact lens fitting — means choosing among five business models against a fast-consolidating chain landscape, then nailing the capital + equipment + payer + optical-capture quartet. The five models: (1) **solo-OD independent** (~75% of independent ODs per [AOA Annual Practice Survey](https://www.aoa.org), 2-3 lanes, 1,800-3,500 sq ft, $550K-$1.2M gross, 22-35% net = $135K-$420K owner-OD); (2) **multi-OD group** (2-4 ODs, 4-8 lanes, $1.5M-$5M gross, 18-30% net); (3) **affiliate-network independent** ([Vision Source](https://www.visionsource.com) ~3,000+ ODs at $750/mo led by Steven Eiss + Essilor-owned since 2015 / [IDOC](https://www.idoc.net) ~500 practices at ~$1,200/mo led by Dave Brown / [PECAA](https://www.pecaa.com) ~1,500+ aligned ODs); (4) **corporate-affiliated** — sublease at [LensCrafters](https://www.lenscrafters.com) or [Pearle Vision](https://www.pearlevision.com) OR W-2 employed at [MyEyeDr](https://www.myeyedr.com) (KKR-backed, Sue Downes CEO, ~860 offices) / [National Vision](https://www.nationalvision.com) NASDAQ:EYE (Reade Fahs CEO, ~1,400 stores including [America's Best](https://www.americasbest.com) ~900 + Eyeglass World ~125) / [Walmart Vision](https://www.walmart.com/cp/vision-center) ~3,000+ sublease / [Costco Optical](https://www.costco.com/optical.html) ~580+ at $130-$180K base; (5) **IDSO-equivalent partial-recap** ([EyeCare Partners](https://www.eyecare-partners.com) Partners Group+FFL ~700+ / [EyeSouth Partners](https://www.eyesouthpartners.com) Shore Capital ~300+ / [Keplr Vision](https://www.keplrvision.com) Greenbriar Equity ~110+ / [US Eye](https://www.useye.com) Kuvera+Aldine ~75+ / [Vision Innovation Partners](https://visioninnovationpartners.com) Centre Lane ~80+ / Spectrum Vision Partners), selling 60-80% at 5-8x EBITDA vs traditional 0.65-0.85x collections. The chain threat is real: [EssilorLuxottica](https://www.essilorluxottica.com) NYSE:EL (Chairman Francesco Milleri + CEO Andrea Guerra) owns LensCrafters ~840 + Pearle ~500 + [Target Optical](https://www.targetoptical.com) ~500 + [Sunglass Hut](https://www.sunglasshut.com) ~3,200 + [EyeMed](https://www.eyemedvisioncare.com) ~70M covered lives + Essilor lens manufacturing, [Warby Parker](https://www.warbyparker.com) NASDAQ:WRBY (Neil Blumenthal + Dave Gilboa ~270 stores), and chain share rose from ~15% in 2010 to ~30%+ in 2024 toward 40%+ by 2030 per [Review of Optometric Business](https://www.reviewob.com). Capital — **$350K-$800K cold-start 2-3 lane** OR **$600K-$1.5M acquisition** at 60-80% of trailing 12-mo collections — funded via SBA 7(a) through [Live Oak Bank Eyecare](https://www.liveoakbank.com), [Bank of America Practice Solutions](https://www.bankofamerica.com/smallbusiness/business-financing/practice-solutions), [First Citizens Practice Solutions](https://www.firstcitizens.com), [Provide.com](https://www.provide.com) (was Lendeavor), Huntington Practice Finance, or US Bank Practice Finance. Exam-lane equipment fundamentals at $15-$25K/lane: [Marco](https://www.marco.com) TRS-3100/5100/6100 chair-stand + Reichert Ultramatic phoropter $4-$18K + Haag-Streit BQ-900 slit lamp gold $4-$15K + Nidek/Topcon auto-refractor $7-$15K + NCT $3-$8K. Diagnostic imaging (the medical-OD enablers): Canon CR-2 retinal camera $25-$40K OR [Optos](https://www.optos.com) California ultra-widefield 200° $90-$130K + [Heidelberg Spectralis](https://www.heidelbergengineering.com) OCT $60-$80K gold standard OR Topcon Maestro2 / [Zeiss Cirrus](https://www.zeiss.com/meditec) 6000 + corneal topographer [Medmont](https://www.medmont.com) E300 / [Eaglet](https://www.eagleteye.nl) ESP / Oculus Pentacam $25-$45K + HFA3 visual field $22-$30K + Zeiss [IOLMaster 700](https://www.zeiss.com/meditec) axial length biometer $55-$70K (CRITICAL for myopia management). Optical lab: [Essilor](https://www.essilorusa.com) Independent Labs (Varilux + Crizal + Transitions + Stellest myopia) + Walman Optical employee-owned + [Hoya Vision](https://www.hoyavision.com) (MiYOSMART myopia + Recharge AR) + [Younger Optics](https://www.youngeroptics.com) (Drivewear + NuPolar) + [Shamir Insight](https://www.shamirlens.com) (Autograph III + Glacier+ AR). PMS at $300-$1,500/mo: [Compulink](https://www.compulinkadvantage.com) Advantage + [RevolutionEHR](https://www.revolutionehr.com) cloud OD-specific fastest-growing + Crystal PM + [Eyefinity OfficeMate](https://www.eyefinity.com) (VSP-owned, deep VSP integration) + Maximeyes / Acuity Logic / Uprise. Operations: hiring associate OD $130-$170K + opticians $22-$35/hr + techs $18-$26/hr; vision insurance vs medical billing workflow ([VSP](https://www.vsp.com) ~80M Mike Hamlin CEO + ~30% US vision insurance share / [EyeMed](https://www.eyemedvisioncare.com) ~70M Lukas Ruecker CEO EssilorLuxottica-owned / [Spectera](https://www.spectera.com) ~25M UHG / [Davis Vision](https://www.davisvision.com)/[MetLife](https://www.metlife.com) ~20M / Versant Health Superior+Davis) compresses optical margin 40-60%, vs medical-OD 99213-99215 ($75-$170) + 92133 RNFL $45 + 92134 macular $45 + 92250 fundus $50 + G0117 diabetic $53 at 2-3x reimbursement. The S-T-O-P optical sale workflow (Select frame → Talk lens tech → Offer treatments AR/blue/photochromic → Position pricing) drives the top-vs-bottom delta — top quartile closes 70-85%, bottom 35-45%. Contact lens annual supply 75-90% conversion: [Acuvue](https://www.jjvision.com) Oasys 1-Day HydraLuxe ([Johnson & Johnson](https://www.jjvision.com) Vision) / [Alcon](https://www.alcon.com) DAILIES TOTAL1 + Precision1 + Air Optix HydraGlyde / [CooperVision](https://coopervision.com) MyDay + Biofinity / [Bausch + Lomb](https://www.bausch.com) Biotrue ONEday + INFUSE + Ultra. The four 2027 revenue moats independents counter chains with: **(A) myopia management** $4-$6B emerging specialty 25-40%/yr — CooperVision [MiSight](https://coopervision.com) 1-day FDA + Essilor Stellest CE-mark + Hoya MiYOSMART + Visioneering [NaturalVue Multifocal](https://vtivision.com) + Paragon CRT/Wave/Euclid ortho-k + atropine 0.05% compounded via Imprimis/Leiter's at $1,500-$3,500/yr/pediatric packages; **(B) dry eye disease center** $300-$3,000 protocols outside vision insurance — [TearLab](https://www.tearlab.com) osmolarity + [Lumenis](https://www.lumenis.com) OptiLight M22 IPL $75-$110K FDA + [J&J LipiFlow](https://www.jjvision.com) + [NULIDS](https://www.nulids.com) + Restasis (AbbVie) / Cequa (Sun Pharma) / Xiidra / Tyrvaya (Viatris) / [Miebo](https://www.miebo.com) (Bausch + Lomb); **(C) specialty contact lens** — sclerals $1,200-$3,500 ([BostonSight](https://www.bostonsight.org) / Valley Contax / X-Cel Specialty / Visionary Optics) + ortho-k $1,500-$3,500; **(D) medical-OD transition** away from vision-plan reliance toward 99213-99215 medical CPT billing. Compliance non-negotiables: state OD board + DEA + state therapeutic/laser (TPA scope varies; OK+LA+KY+AK+VA grant laser SLT/YAG/LPI) + NPI + HIPAA + OSHA Bloodborne Pathogens + [FTC Eyeglass Rule](https://www.ftc.gov/legal-library/browse/rules/ophthalmic-practice-rules) (Rx released after refraction no charge) + [FTC Contact Lens Rule](https://www.ftc.gov/legal-library/browse/rules/contact-lens-rule) (CL Rx + 1-yr verification) + state optician licensure (~22 states). AI imaging FDA-cleared add-ons $300-$2,000/mo: [Eyenuk](https://www.eyenuk.com) EyeArt diabetic retinopathy + [Notal Vision](https://www.notalvision.com) ForeseeHome AMD + [RetinAI](https://www.retinai.com) multi-pathology OCT + [AEYE Health](https://www.aeyehealth.com) autonomous DR. The hardest part is NOT capital or OCT/topographer spend — it is the trifecta of **(1) optical capture via S-T-O-P** (55-70% of independent OD gross), **(2) VSP/EyeMed write-off management + medical-OD billing transition**, and **(3) chain/corporate positioning** via myopia + dry eye + specialty CL + medical-OD moats. Benchmark sources: [American Optometric Association (AOA)](https://www.aoa.org), [Review of Optometric Business](https://www.reviewob.com), [Vision Council](https://thevisioncouncil.org), [BLS Occupational Outlook 2024 — Optometrists](https://www.bls.gov/ooh/healthcare/optometrists.htm), [ASCO](https://www.optometriceducation.org), [ARBO](https://www.arbo.org), [NBEO](https://www.optometry.org), [American Academy of Optometry](https://www.aaopt.org), [Brien Holden Vision Institute](https://www.brienholdenvision.org), and [International Myopia Institute](https://myopiainstitute.org) for the myopia management consensus that grounds the $4-$6B emerging-specialty thesis.**

`;

// ─── Transform helpers ─────────────────────────────────────────────────────────

// 1) Strip the leading TL;DR paragraph + "> ### Bottom Line" blockquote + the
//    follow-on duplicate intro paragraphs. Anchor on the first H2 ("## ") which
//    is "## Table of Contents".
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
      if (RESERVED.has(title)) { out.push(line); continue; }
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
    // Also handle: "N. **Title** -- desc.\n" (no URL — leave alone)
    const m = line.match(/^(\d+)\.\s+(\*\*[^*]+\*\*)\s+(--|—)\s+(.+?)\s+(https?:\/\/\S+)\s*$/);
    if (m) {
      const [, num, boldTitle, dash, desc, url] = m;
      // Strip trailing "." from desc to avoid "desc.." after we move url out
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

  fs.writeFileSync(path.join(__dirname, 'q9684_pre_reformat.md'), original, 'utf8');

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
  const headTwoK = linkified.slice(0, 12000);
  const directBlock = headTwoK.match(/### Direct Answer\s*\n+([\s\S]{0,11000})/);
  const e1_bold = directBlock ? /\*\*[^*]+\*\*/.test(directBlock[1].split(/\n##\s/)[0].split(/\n###\s/)[0]) : false;
  const e2_h2 = (linkified.match(/^##\s+/gm) || []).length;
  const e3_numbered = (linkified.match(/^###\s+\d+\.\s+/gm) || []).length;
  const e4_bullets_bold = (linkified.match(/^[-*]\s+\*\*[^*]+\*\*/gm) || []).length;
  const e6_inline_links = (linkified.match(/\]\(https?:\/\//g) || []).length;
  const e6_numbered_sources = /\n##\s+Sources/i.test(linkified) && /^\d+\.\s+\[?\*?\*?[A-Z]/m.test(linkified);

  const realName = {
    aoa: /\bAOA\b|American Optometric Association/i.test(linkified),
    arbo: /\bARBO\b/i.test(linkified),
    asco: /\bASCO\b/i.test(linkified),
    essilorluxottica: /EssilorLuxottica/i.test(linkified),
    francesco_milleri: /Francesco Milleri/i.test(linkified),
    lenscrafters: /LensCrafters/i.test(linkified),
    pearle_vision: /Pearle Vision/i.test(linkified),
    target_optical: /Target Optical/i.test(linkified),
    sunglass_hut: /Sunglass Hut/i.test(linkified),
    myeyedr: /MyEyeDr/i.test(linkified),
    kkr: /\bKKR\b/i.test(linkified),
    national_vision: /National Vision|NASDAQ:EYE|America's Best|Eyeglass World/i.test(linkified),
    vision_source: /Vision Source/i.test(linkified),
    steven_eiss: /Steven Eiss/i.test(linkified),
    idoc: /\bIDOC\b/i.test(linkified),
    dave_brown: /Dave Brown/i.test(linkified),
    pecaa: /\bPECAA\b/i.test(linkified),
    warby_parker: /Warby Parker|NASDAQ:WRBY|Neil Blumenthal|Dave Gilboa/i.test(linkified),
    vip_us_eye: /Vision Innovation Partners|US Eye|Keplr/i.test(linkified),
    vsp: /\bVSP\b/i.test(linkified),
    eyemed: /EyeMed/i.test(linkified),
    spectera: /Spectera|UnitedHealthcare/i.test(linkified),
    davis_vision: /Davis Vision|MetLife/i.test(linkified),
    coopervision: /CooperVision|MiSight/i.test(linkified),
    jj_acuvue: /J&J|Acuvue|Johnson/i.test(linkified),
    alcon: /Alcon|DAILIES/i.test(linkified),
    bausch: /Bausch \+ Lomb|Bausch/i.test(linkified),
    hoya: /Hoya/i.test(linkified),
    essilor: /Essilor/i.test(linkified),
    younger: /Younger Optics/i.test(linkified),
    shamir: /Shamir/i.test(linkified),
    heidelberg: /Heidelberg|Spectralis/i.test(linkified),
    zeiss: /Zeiss|Cirrus/i.test(linkified),
    topcon: /Topcon|Maestro/i.test(linkified),
    optos: /Optos/i.test(linkified),
    marco: /Marco TRS|Reichert/i.test(linkified),
    eaglet: /Eaglet|Medmont|IOLMaster/i.test(linkified),
    compulink: /Compulink/i.test(linkified),
    revolutionehr: /RevolutionEHR/i.test(linkified),
    eyefinity: /Eyefinity|OfficeMate/i.test(linkified),
    live_oak: /Live Oak Bank|Provide\.com/i.test(linkified),
    tearlab_lumenis: /TearLab|Lumenis|Lipiflow/i.test(linkified),
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
  console.log('=== q9684 GOLD REFORMAT COMPLETE ===');
})().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
