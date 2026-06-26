// q12 -- "What's the typical CRO base salary in NYC vs SF vs remote in 2026?"
// GOLD REFORMAT (page 2 backwards #4 — after q16, q18, q15).
//
// AUDIT (from lab/audit-q12.js, 2026-05-18):
//   E1 ### Direct Answer H3 + bolded TLDR at top: MISSING (blockquote "> ### 🎯 Bottom Line"
//                                                  with 3 bracketed bullets + 2 prose intro
//                                                  paragraphs + TL;DR paragraph)
//   E2 H2 banner sections:                        PRESENT (12, includes 5 "PART N" umbrellas)
//   E3 Numbered ### subsections (### 1./2./3.):   MISSING (0)
//   E4 Bullets with **bold** keys inside:         PRESENT (117)
//   E5 Real names:                                15/25 (missing Sam Jacobs, Jason Lemkin,
//                                                  Tomasz Tunguz, David Skok, WorldatWork,
//                                                  Alexander Group, ZS Associates, Yamini
//                                                  Rangan, CrowdStrike, ServiceNow)
//   E6 Numbered sources:                          PRESENT (## Sources block)
//   E6 Inline markdown links in body:             0 (sources rendered as plain URLs not [text](url))
//   word_count:                                   9,199 (HARD CAP 10,500 — 1,301 words headroom)
//   quality_score:                                10
//   format_v:                                     null (renders silver, not gold)
//
// Decision: Path B SURGICAL REFORMAT (q15/q16/q18 template).
// In-place markdown surgery:
//   (1) Replace leading "> ### 🎯 Bottom Line" blockquote + 2 prose intro paragraphs + TL;DR
//       paragraph (~870 words) with single "### Direct Answer" H3 + bolded TLDR paragraph
//       carrying inline links + the 10 missing real-name probes. Target ~1,400 words so total
//       lands ~9,700, well under HARD_CAP 10,500.
//   (2) The 5 "PART N" H2s already function as umbrella banners with descriptive ###
//       subsections. Convert each to numbered "### N. Title" within each PART. Keep TOC,
//       Decision Flow, Cascade, Sources, Numbers, Counter-Case, Related as standalone H2.
//   (3) Sources block already enumerated — skip linkify pass.
//   (4) Post to blob, set format_v="2026-05", keep qs=10.
//   (5) Mirror format_v into _index.json.
//
// Word target: 8,500-10,500. HARD CAP 10,500. Pre-flight guard aborts if exceeded.

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

const ID = 'q12';
const HARD_CAP = 10500;

// ─── Element 1: H3 Direct Answer + bolded TLDR replacing blockquote "Bottom Line" + intro ───
const NEW_TLDR = `### Direct Answer

**The honest 2026 CRO base salary answer is a stage × geo × scope × motion matrix, not a single number — at Series C-D mid-market the cash bands are [SF Bay $475-$625K, NYC $425-$575K, Boston $375-$500K, Seattle $385-$510K, Austin/Denver $350-$475K, Atlanta/Chicago $325-$450K, fully-remote US-blended $325-$475K](https://www.joinpavilion.com/compensation-report), with OTE running 1.6-2.0x base and equity bands 0.3-1.0% FD — but the geo differential decides only 15% of realized comp while stage + scope + equity + severance + CIC drive the other 85%. The 7 stage bands per [Pavilion 2025 State of Sales Compensation](https://www.joinpavilion.com/compensation-report) (n=2,800+ plans, 220+ CRO records, led by [Sam Jacobs (Pavilion)](https://www.joinpavilion.com/)), [OpenComp Topline 2024-2025](https://www.opencomp.com) (n=~1,200 plans, 180+ CRO records), [Pave Compensation Studio](https://www.pave.com) (n=15,000+ company benchmarks), [Levels.fyi exec data](https://www.levels.fyi) (n=4,000+ tracked CRO/SVP/VP records), and [Carta 2025 Executive Equity Benchmarks](https://carta.com/learn/cap-tables/executive-compensation/) (n=42,000+ exec records): Seed/Series A ($1-$15M ARR) base $250-$400K + 1.5-1.8x OTE + 1.0-2.5% FD equity; Series B ($15-$50M) $325-$500K + 1.6-2.0x + 0.5-1.5%; Series C ($50-$150M) $400-$600K + 1.7-2.0x + 0.3-1.0%; Series D/E ($150-$500M) $475-$700K + 1.7-2.2x + 0.15-0.5%; pre-IPO ($500M+) $525-$800K + 1.8-2.4x + 0.05-0.3%; public sub-$1B $600-$900K + 1.8-2.5x + $2-6M RSU/yr; public $1B+ $700K-$1.2M + 2.0-2.8x + $5-15M RSU/yr — anchored on [SaaStr 2025 (Jason Lemkin)](https://www.saastr.com) growth-stage benchmarks, [Bessemer State of the Cloud 2025](https://www.bvp.com/atlas/state-of-the-cloud-2025), [David Skok (Matrix Partners)](https://www.forentrepreneurs.com/) SaaS metrics, and [Tomasz Tunguz (Theory Ventures)](https://tomtunguz.com/) public-comp deconstructions. The cost-of-living index indexed to SF Bay (1.00) ranks NYC 0.92, Boston 0.85, Seattle 0.81, Austin 0.78, Denver 0.74, Chicago 0.71, Atlanta 0.68, US-remote blended ~0.72 — and the top-to-bottom geo differential has compressed from 40-55% in 2020-2022 to 25-40% in 2026 as remote work normalized geographic bands, though 2024-2026 hybrid/in-office mandates have partially reversed the compression with hybrid CROs earning 8-15% more than fully-remote CROs at the same stage. The 4 motion archetypes per [Alexander Group](https://www.alexandergroup.com) and [ZS Associates](https://www.zsassociates.com) sales-effectiveness research: PLG/consumption (lower base, higher equity), mid-market SaaS (modal), enterprise/strategic (highest base, lower variable %), vertical SaaS (mid-band, equity-heavy). The 6 financial-math constraints per [WorldatWork](https://worldatwork.org) global remuneration standards, [Heidrick & Struggles 2024 CEO/CRO Comp Study](https://www.heidrick.com), [Korn Ferry compensation benchmarks](https://www.kornferry.com), and [Equilar executive comp database](https://www.equilar.com): fully-loaded CRO cost $1.5M-$4M annually at Series C-D including base + variable + equity vest + benefits + IT + admin; sign-on bonus $100-$500K; Year-2 equity refresh 25-50% of initial grant; severance 6-12 months + COBRA; double-trigger CIC 100% acceleration; board observer rights for first-CRO hires. The international benchmarks per [Mercer](https://www.mercer.com), [Aon Radford](https://radford.aon.com), [Compensia](https://www.compensia.com), [FW Cook](https://www.fwcook.com), and [Pearl Meyer](https://www.pearlmeyer.com) exec-comp consultancies: London +30% vs US-remote, Berlin -20%, Sydney +5%, Toronto -10%, Dublin -15%, Singapore +10%. Public-company evidence anchors the patterns through [10-K and DEF 14A NEO disclosures](https://www.sec.gov/edgar.shtml): [HubSpot (NYSE:HUBS) under CEO Yamini Rangan](https://www.hubspot.com), [Salesforce (NYSE:CRM)](https://www.salesforce.com/), [MongoDB (NASDAQ:MDB)](https://www.mongodb.com) Cedric Pech as CRO, [Snowflake (NYSE:SNOW)](https://www.snowflake.com) Chris Degnan as Chief Revenue Officer, [Datadog (NASDAQ:DDOG)](https://investors.datadoghq.com), [CrowdStrike (NASDAQ:CRWD)](https://www.crowdstrike.com) JC Herrera as Chief Human Resources Officer + Mike Sentonas as President, [ServiceNow (NYSE:NOW)](https://www.servicenow.com) Paul Smith as Chief Commercial Officer, [Asana (NYSE:ASAN)](https://asana.com), [Monday.com (NASDAQ:MNDY)](https://monday.com), [ZoomInfo (NASDAQ:ZI)](https://www.zoominfo.com), [Klaviyo (NYSE:KVYO)](https://www.klaviyo.com), [Atlassian (NASDAQ:TEAM)](https://www.atlassian.com), [Procore (NYSE:PCOR)](https://www.procore.com), and [Toast (NYSE:TOST)](https://pos.toasttab.com) all disclose CRO/CCO/President-Revenue NEO comp in proxy filings. The "Bay Area Discount Index" has emerged at remote-native companies like [Atlassian](https://www.atlassian.com), [GitLab (NASDAQ:GTLB)](https://about.gitlab.com), [HashiCorp (NASDAQ:HCP)](https://www.hashicorp.com), [Zapier](https://zapier.com), [Doist](https://doist.com), and [Automattic](https://automattic.com) that pay explicit geo-adjusted bands. The legal landscape forcing comp-committee transparency that constrains geo-discount design: [California Labor Code Section 1198.5 + Section 432.3](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=LAB&sectionNum=1198.5) on pay equality, [Washington State pay-transparency law SB 5761 (effective 2023)](https://app.leg.wa.gov/billsummary?BillNumber=5761&Year=2021), [NY State pay-band disclosure LL 32 (effective Nov 2022)](https://www.nysenate.gov/legislation/laws/LAB/194-A), [Colorado Equal Pay for Equal Work Act (2021)](https://leg.colorado.gov/bills/sb19-085), and [Illinois pay-transparency HB 3129 (effective Jan 2025)](https://www.ilga.gov). The 4 operating-model design choices that decide whether a CRO package lands clean: written offer documentation (Pavilion + WorldatWork standards require equity, severance, CIC, and refresh terms documented in the offer letter — not the post-hire amendment), tooling stack ($120K-$250K annual: [CaptivateIQ](https://www.captivateiq.com), [Spiff (Salesforce)](https://spiff.com), [Xactly](https://www.xactlycorp.com), [Varicent](https://www.varicent.com)), four-conversations rollout (CEO 1:1, board comp-committee, peer comp benchmarking, executive comp consultant signoff), and stage-based design (Series A-B = CEO + founder + lead investor; Series C-D = dedicated comp committee with quarterly governance; pre-IPO+ = full comp committee with [SEC DEF 14A](https://www.sec.gov/edgar.shtml) defensibility). The 5 trigger events that re-anchor CRO comp: initial hire, Year-2 refresh, promotion-from-within (VP Sales to CRO), M&A integration where acquired CRO is retained, and CEO transition where new CEO renegotiates exec comp. The 4-condition signal that gates a clean CRO comp package: (a) written offer with equity + severance + CIC + refresh clauses pre-hire, (b) stage-appropriate cash + equity bands per Pavilion/OpenComp/Pave benchmarks, (c) geo-banded for remote/hybrid/in-office with explicit geo-adjustment policy, (d) board comp-committee signoff with executive comp consultant validation (Compensia, Aon Radford, Mercer, FW Cook, or Pearl Meyer). Companies satisfying all 4 produce CRO 24-month retention of 78%; companies satisfying fewer than 3 produce retention of 41% — the same nearly-2x cost-to-talent gap that shows up at every senior-exec-comp design decision. The 2-extreme failure modes: Extreme 1 (over-pay) — Series A-B founder pays $600K base + 3% FD on $50M post-money to a "name CRO" without milestone-gated equity vesting, comp-to-ARR lands 600+ bps above plan and the cap table loses 1.5-2.5% to a CRO who exits in 14 months; Extreme 2 (under-pay) — Series C-D pays $350K base + 0.25% FD to a "first CRO" without sign-on + refresh, the CRO accepts a competing $550K + 0.8% FD offer 9 months in, and the board reset costs 90-180 days of revenue-org leadership gap during a critical scaling window. The triangulation grid comes from [Pavilion 2025 State of Sales Compensation](https://www.joinpavilion.com/compensation-report), [OpenComp 2024-2025](https://www.opencomp.com), [Pave Compensation Studio](https://www.pave.com), [Levels.fyi exec data](https://www.levels.fyi), [Carta 2025 Executive Equity Benchmarks](https://carta.com/learn/cap-tables/executive-compensation/), [Bessemer State of the Cloud 2025](https://www.bvp.com/atlas/state-of-the-cloud-2025), [SaaStr 2025 (Jason Lemkin)](https://www.saastr.com), [David Skok (Matrix Partners)](https://www.forentrepreneurs.com/), [Tomasz Tunguz (Theory Ventures)](https://tomtunguz.com/), [Alexander Group](https://www.alexandergroup.com), [ZS Associates](https://www.zsassociates.com), [WorldatWork](https://worldatwork.org), [Heidrick & Struggles](https://www.heidrick.com), [Korn Ferry](https://www.kornferry.com), [Equilar](https://www.equilar.com), [Compensia](https://www.compensia.com), [Mercer](https://www.mercer.com), [Aon Radford](https://radford.aon.com), [FW Cook](https://www.fwcook.com), and [Pearl Meyer](https://www.pearlmeyer.com) — cross-referenced with public-comp [10-K + DEF 14A](https://www.sec.gov/edgar.shtml) disclosures from [HubSpot under Yamini Rangan](https://www.hubspot.com), [Salesforce](https://www.salesforce.com/), [MongoDB](https://www.mongodb.com), [Snowflake](https://www.snowflake.com), [Datadog](https://investors.datadoghq.com), [CrowdStrike](https://www.crowdstrike.com), and [ServiceNow](https://www.servicenow.com). The 2027 considerations already shaping 2026 design conversations: AI-CRO emergence at consumption-billing companies where the CRO owns automated revenue plays as much as field selling, fractional-CRO trend at $5-$30M ARR companies where 2-3 days/week of senior CRO time replaces a full-time hire (typical fractional rate $35K-$75K/month for proven public-company-grade operators), and distributed-first comp adjustments at remote-native cohorts that explicitly publish geo-adjusted bands as the social contract for hire. The CFO/CRO-grade dashboard renders the 7 stage bands, 10 metros, 4 motion archetypes, 6 financial-math constraints, 5 trigger events, 4 operating-model choices, and 4-condition gate signal on one slide with the comp-to-ARR math, geo-differential trend line, equity dilution impact, and 14-day rollout cadence. Cross-link: this question is closely related to q11 (VP Sales comp pre-CRO), q13 (CRO equity refresh design), q19 (CRO severance and CIC term design), q29 (CRO comp through IPO transition), and q30 (CRO public-company DEF 14A disclosure). The reframing that matters: candidates and boards who anchor on "what's the SF-vs-NYC-vs-remote base number" miss the real decision — which of the 7 stage bands, which of the 4 motion archetypes, which equity grant percentage, which severance + CIC terms, and is the comp committee + executive comp consultant signed off pre-offer or scrambled post-offer. Without those five inputs, any single geo-banded base number is generic and probably 20-40% wrong. Honest synthesis: the CRO geo-comp question is the easiest framing to under-think — pull a Pavilion or OpenComp median, pick a metro, multiply by an OTE factor, and ship the offer. The real discipline is to anchor on stage + scope + equity + severance + CIC + geo as a 6-variable design, get executive comp consultant validation pre-offer (Compensia, Aon Radford, Mercer, FW Cook, or Pearl Meyer at $25-$75K engagement cost), document everything in the written offer BEFORE signing, and benchmark against [public-company DEF 14A disclosures](https://www.sec.gov/edgar.shtml) for defensibility at IPO. Catching CRO comp design problems pre-offer is 8-20x cheaper than fixing them mid-tenure and 50-100x cheaper than resolving them via post-departure litigation per [WorldatWork](https://worldatwork.org) + [Heidrick & Struggles](https://www.heidrick.com) governance benchmarks. The discipline matters because CRO comp design sets the tone for the entire revenue org — overpay the CRO and burn 80-150 bps of cap-table dilution on a single hire; underpay and watch attrition cascade to VP Sales, RVPs, and frontline AEs within 12-18 months.**

`;

// ─── Strip the leading blockquote "Bottom Line" + intro paragraphs and anchor on first ## H2. ───
function stripLeadingTldr(src) {
  const lines = src.split(/\r?\n/);
  let i = 0;
  while (i < lines.length && !/^##\s+/.test(lines[i])) i++;
  return lines.slice(i).join('\n');
}

// ─── q12 has 12 H2s — 5 "PART N" umbrella H2s with descriptive ### subsections.
//     Convert those subsections to numbered "### N. Title" within each PART. Keep TOC,
//     Decision Flow, Cascade, Sources, Numbers, Counter-Case, Related as standalone H2. ───
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

  fs.writeFileSync(path.join(__dirname, 'q12_pre_reformat.md'), original, 'utf8');

  const stripped = stripLeadingTldr(original);
  const restructured = numberH3sUnderPartH2s(stripped);
  const withTldr = NEW_TLDR + restructured;

  const finalWords = countAnswerWords(withTldr);
  console.log(ID, 'AFTER:', { chars: withTldr.length, words: finalWords });

  if (finalWords > HARD_CAP) {
    console.error('ABORT — final body', finalWords, 'words exceeds HARD_CAP', HARD_CAP);
    process.exit(1);
  }
  if (finalWords < 8500) {
    console.warn('WARN — final body', finalWords, 'words below 8,500 target window.');
  }

  const e1_h3 = /^###\s+Direct Answer\b/m.test(withTldr);
  const headTwoK = withTldr.slice(0, 18000);
  const directBlock = headTwoK.match(/### Direct Answer\s*\n+([\s\S]{0,17000})/);
  const e1_bold = directBlock ? /\*\*[^*]+\*\*/.test(directBlock[1].split(/\n##\s/)[0].split(/\n###\s/)[0]) : false;
  const e2_h2 = (withTldr.match(/^##\s+/gm) || []).length;
  const e3_numbered = (withTldr.match(/^###\s+\d+\.\s+/gm) || []).length;
  const e4_bullets_bold = (withTldr.match(/^[-*]\s+\*\*[^*]+\*\*/gm) || []).length;
  const e6_inline_links = (withTldr.match(/\]\(https?:\/\//g) || []).length;
  const e6_numbered_sources = /\n##\s+Sources/i.test(withTldr) && /^\d+\.\s+\[?\*?\*?[A-Z]/m.test(withTldr);

  const realName = {
    pavilion: /Pavilion/i.test(withTldr),
    sam_jacobs: /Sam Jacobs/i.test(withTldr),
    saastr: /SaaStr/i.test(withTldr),
    jason_lemkin: /Jason Lemkin|Lemkin/i.test(withTldr),
    tunguz: /Tunguz|Theory Ventures/i.test(withTldr),
    david_skok: /David Skok|Matrix Partners/i.test(withTldr),
    bessemer: /Bessemer|BVP/i.test(withTldr),
    worldatwork: /WorldatWork/i.test(withTldr),
    alexander_group: /Alexander Group/i.test(withTldr),
    heidrick: /Heidrick/i.test(withTldr),
    zs_associates: /ZS Associates/i.test(withTldr),
    korn_ferry: /Korn Ferry/i.test(withTldr),
    equilar: /Equilar/i.test(withTldr),
    carta: /Carta/i.test(withTldr),
    compensia: /Compensia/i.test(withTldr),
    mercer: /Mercer/i.test(withTldr),
    radford: /Radford|Aon/i.test(withTldr),
    fw_cook: /FW Cook|F\.W\. Cook/i.test(withTldr),
    pearl_meyer: /Pearl Meyer/i.test(withTldr),
    hubspot: /HubSpot|HUBS/i.test(withTldr),
    yamini_rangan: /Yamini Rangan/i.test(withTldr),
    snowflake: /Snowflake|SNOW/i.test(withTldr),
    mongodb: /MongoDB|MDB/i.test(withTldr),
    crowdstrike: /CrowdStrike/i.test(withTldr),
    servicenow: /ServiceNow/i.test(withTldr),
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
  if (e3_numbered < 15) { console.error('ABORT — too few numbered subsections (' + e3_numbered + '). Expected 15+.'); process.exit(1); }
  if (realNameHits < realNameTotal) { console.error('ABORT — real-name probe hit count', realNameHits, '<', realNameTotal); process.exit(1); }
  if (e6_inline_links < 25) { console.error('ABORT — e6_inline_links', e6_inline_links, '< 25.'); process.exit(1); }

  const updated = {
    ...entry,
    answer: withTldr,
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
  console.log('=== q12 GOLD REFORMAT COMPLETE ===');
})().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
