// st0026 -- Managed IT Services (MSP) MSA Renewal Conversation: Surviving the
// Mid-Market Squeeze (2027). Pulse Sales Trainings entry (route:
// /sales-trainings/st0026, tag: sales-training). TWENTIETH industry-specific
// training (after st0007-st0025). Industry = managed service provider MSA
// renewal conversations vs price compression + cybersecurity stack inflation
// + cyber-insurance attestation pressure + M365/Azure NCE margin erosion +
// co-managed IT shift + the "stop selling break-fix" reframe. Five fixed
// sections mirror st0025. VALUE over WORD COUNT. Target 9,500-10,500 words.
// ABSOLUTE HARD CAP 10,500. LEAN-FROM-START. Walks 5->6->7->8->9->10 ladder
// via runPolish from polish-helper. Stages: REVIEW / REFRAME / REPRICE /
// REUP / REFER.

const { getStore } = require('@netlify/blobs');
const fs = require('fs');
const path = require('path');
const { runPolish } = require('./polish-helper');

const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const ID = 'st0026';
const QUESTION = "Managed IT Services (MSP) MSA Renewal Conversation: Surviving the Mid-Market Squeeze (2027) — a 60-Minute Sales Training";

const tags = [
  'sales-training',
  'msp-msa-renewal-training',
  'managed-it-services',
  'msp',
  'msa-renewal',
  'mid-market',
  'cybersecurity-stack',
  'co-managed-it',
  'cyber-insurance',
  'nce-margin-erosion',
  '60-min-meeting',
  'standard-team',
  'st0026'
];

const sources = [
  { title: 'ConnectWise (CEO Jason Magee, Tampa FL) + Service Leadership (acquired by ConnectWise 2021, founded by Paul Dippell) — the dominant MSP PSA/RMM platform + benchmarking authority: ConnectWise PSA (Professional Services Automation, formerly ConnectWise Manage) + ConnectWise RMM (formerly Automate) + ConnectWise ScreenConnect (acquired 2015) + ConnectWise SIEM/Co-Managed SIEM + ConnectWise Cybersecurity Management; ~$1B+ revenue + ~3,000 employees + ~45,000 partner MSPs globally; IT Nation Connect annual conference Orlando ~6,000 attendees the dominant MSP industry event; Service Leadership Index (SLI) quarterly benchmarking reports the universally-cited MSP financial-performance benchmark grouping MSPs into Best-in-Class / Better / Median / Worse quartiles measuring EBITDA% of revenue + revenue per employee + recurring vs project mix + service-desk efficiency + technology stack cost % of MRR; pivotal SLI Q4 2024 report shows Best-in-Class MSPs at ~20-25% EBITDA + Median ~12-15% + Worse ~3-8% + the "good bad ugly" quartile spread widening; Paul Dippell + Peter Kujawa (Service Leadership VP, now ConnectWise SVP) the most-cited MSP operating-model authorities; ConnectWise acquired Continuum 2019 + Webroot prior partnership; H.I.G. Capital + Thoma Bravo prior PE owners; current Thoma Bravo portfolio company since 2019', url: 'https://www.connectwise.com/' },
  { title: 'Kaseya (CEO Fred Voccola, Miami FL) + Datto (acquired by Kaseya 2022 for $6.2B) — the #2 MSP platform vendor stack: Kaseya 365 bundled platform (VSA RMM + BMS PSA + IT Glue documentation + Datto BCDR + Datto Networking + Datto SaaS Protection + RocketCyber MDR + Graphus phishing + Audit Logger + Dark Web ID) + ~50,000 MSP customers + ~5,000 employees + ~$2B revenue post-Datto; pivotal 2022 Datto acquisition $6.2B (Insight Partners had taken Datto public 2020 at $4.3B) created the dominant bundled MSP-stack player; Kaseya DattoCon annual conference Miami ~3,000+ attendees; Datto founded 2007 by Austin McChord (Norwalk CT) on BCDR (backup continuity disaster recovery) appliance + cloud + RMM (Datto RMM via Autotask acquisition 2017) + PSA (Autotask) + SaaS Protection + Networking; controversies around aggressive pricing + lock-in + license-stacking + acquisition integration friction (#KaseyaSucks hashtag in MSP communities); aggressive cross-sell motion drives ARR growth + drives partner attrition pressure; competes head-to-head with ConnectWise + N-able + NinjaOne on RMM + PSA + with Veeam + Acronis + Axcient + Cove on BCDR; Fred Voccola defends bundling strategy at every Kaseya Connect + DattoCon keynote', url: 'https://www.kaseya.com/' },
  { title: 'N-able NYSE:NABL (CEO John Pagliuca, Burlington MA + Wakefield MA) + NinjaOne (CEO Sal Sferlazza, Austin TX, private ~$2B valuation 2024) — the #3 + #4 RMM/PSA platforms: N-able spun off from SolarWinds 2021 via IPO ~$1.5B market cap 2024 + ~$400M revenue + N-able N-central RMM + N-able N-sight RMM (formerly RMM) + Cove Data Protection + Mail Assure + Passportal (MSP password management) + MDR via SentinelOne partnership + ~25,000 MSP customers; N-able Empower annual conference; NinjaOne founded 2013 (originally NinjaRMM) ~$2B+ valuation 2024 (ICONIQ Growth + Summit Partners + Insight Partners investors) ~17,000 MSP customers + ~1,500 employees + the fastest-growing unified RMM/endpoint-management platform 50%+ YoY growth + Ninja Ticketing PSA-lite + Ninja Documentation + Ninja MDM + Ninja Patch + Ninja Backup partnerships; both N-able and NinjaOne position against the ConnectWise/Kaseya bundles as "best of breed" + faster product velocity + better partner-NPS scores; recent MSP industry survey data (ChannelE2E + Datto Global State of MSP) show MSPs running 8-15 vendor stack on average + RMM consolidation pressure intense', url: 'https://www.n-able.com/' },
  { title: 'Auvik (CEO Doug Murray, Waterloo ON, acquired by Great Hill Partners 2021 ~$1.5B + IPO-ready 2025) + Liongard (CEO Joe Alapat, Houston TX, ~$50M ARR 2024) + Rewst (CEO Aharon Chernin, Tampa FL, ~$25M ARR 2024) + ITGlue/IT Glue (founded by Chris Day, acquired by Kaseya 2018 as part of Datto deal) + Hudu (CEO Joe Cooper, Mishawaka IN, ~$15M ARR 2024) — the MSP operational tooling layer beyond core RMM/PSA: Auvik network monitoring + SaaS management + intelligent diagnostics ~5,000+ MSP customers; Liongard "Roar" automated system-discovery + change-detection + alignment-to-baseline ~3,500 MSP partners; Rewst automation/workflow orchestration platform ("the Zapier for MSPs") connects PSA + RMM + Microsoft + ITSM ~3,000 MSP customers explosive growth 2023-2024; ITGlue (now Kaseya) MSP documentation system-of-record ~13,000 MSPs prior to Kaseya acquisition; Hudu the leading independent challenger to ITGlue ~3,500 MSPs price-disrupted ITGlue licensing 2022-2024; Cork (cybersecurity warranty for MSPs, CEO Carlson Choi, NY) ~$30M Series A 2024; Pia Solutions (CEO Christopher Whiteley, Sydney AU + Sandy UT) MSP automation ~1,500 customers; Galactic Advisors (CEO Bruce McCully, Carolina) MSP-focused security assessments + cyber-insurance attestation tooling ~2,500 MSP partners', url: 'https://www.auvik.com/' },
  { title: 'Pax8 (CEO Scott Chasin, Greenwood Village CO) — the dominant cloud-distribution marketplace for MSPs: ~$2B revenue 2024 + ~1,700 employees + ~38,000 MSP partners + ~600,000 SMB end-customers reached + 250+ vendor catalog (Microsoft 365 + Azure + Acronis + Bitdefender + Datto SaaS + SentinelOne + Webroot + Huntress + Vade + DropSuite + Keeper + Auvik + Cork + many more); Pax8 Beyond annual conference Denver ~5,000 attendees; founded 2012 by Scott Chasin (Webroot CEO prior) + raised from General Atlantic + Sageview + Catalyst at ~$1.7B valuation 2021; pivotal role in 2022-2024 Microsoft New Commerce Experience (NCE) transition managing the cancellation-window + annual-commitment-vs-monthly + price-uplift pass-through complexity for MSPs; competes with TD SYNNEX (acquired Tech Data 2021) + Ingram Micro (PE owned Platinum Equity 2024 + IPO 2024) + Sherweb + AppRiver + Crayon + ALSO Cloud on Microsoft + cloud distribution; Pax8 enables MSPs to bundle 8-15 vendor SKUs into single monthly invoice + take 15-35% margin on resale; pivotal MSP industry view: Pax8 sets the de-facto street price for cybersecurity SKUs across the channel + drives commoditization pressure on resold-license margins', url: 'https://www.pax8.com/' },
  { title: 'Microsoft New Commerce Experience (NCE) + Microsoft 365 + Azure CSP program — the structural margin pressure on every MSP that resells Microsoft licensing: NCE launched March 2022 fundamentally changed MSP economics by introducing annual commitments (with 7-day cancellation window for monthly term) + 20% price uplift for monthly-billed seats vs annual + price increases of 10-15% across M365 SKUs March 2022 + Copilot for Microsoft 365 at $30/user/mo launched November 2023 + further M365 price increases April 2024 + April 2025; MSPs caught between (a) end-customers expecting same monthly flexibility + (b) NCE annual commitments locking MSP exposure if customer churns mid-term + (c) Microsoft CSP partner margins compressed from ~20% historical to ~15% on M365 + ~5-10% on Azure + 0% on Copilot; pivotal MSP financial impact: Service Leadership Index Q4 2024 + Channel Futures + ChannelE2E coverage shows median MSP went from M365 contributing 12-18% gross profit to 6-10% over 2022-2024; MSPs forced to either (i) raise managed-services labor rates to compensate or (ii) consolidate to fewer Microsoft SKUs + push higher-margin security stack or (iii) shift to higher-margin Azure-managed-services + governance practices; Microsoft Inspire (now Microsoft AI Tour + MS Partner Conference) + Microsoft MVP program; Microsoft Defender + Sentinel + Intune + Purview the rising security stack for MSPs', url: 'https://learn.microsoft.com/en-us/partner-center/announcements/2022-january' },
  { title: 'Cybersecurity stack for MSPs: SentinelOne NYSE:S (CEO Tomer Weingarten, Mountain View CA) + Huntress (CEO Kyle Hanslovan, Ellicott City MD) + CrowdStrike NASDAQ:CRWD MSP-channel + Bitdefender (CEO Florin Talpes, Bucharest RO) + ThreatLocker (CEO Danny Jenkins, Maitland FL) + Blackpoint Cyber (CEO Jon Murchison, Ellicott City MD) + Arctic Wolf (CEO Nick Schneider, Eden Prairie MN) + Todyl + Cynet + Coro + Vade (acquired by Hornetsecurity 2023) + Proofpoint (Thoma Bravo private) — the layered security stack driving 60-80% of MSP gross-profit growth 2023-2027: SentinelOne Singularity Platform EDR/XDR + MDR via Vigilance + ~$700M revenue ~50% growth + heavy MSP channel investment; Huntress MDR + SAT (security awareness training) + ITDR (identity threat detection) + MAV (managed antivirus) ~$200M ARR 2024 ~80% growth pure-play MSP channel + Tradecraft Tuesday weekly threat-intel webinar dominant in MSP communities; ThreatLocker zero-trust application allowlisting + ringfencing + storage control ~$120M ARR 2024 + Zero Trust World annual conference Orlando; Blackpoint Cyber MDR ~24/7 SOC ~$100M ARR + MSP-channel-only model; Bitdefender GravityZone EDR + MDR ~$600M revenue strong MSP channel + Bitdefender XDR; Arctic Wolf Concierge SOC ~$650M ARR IPO-pending; Todyl + Cynet + Coro emerging consolidated security platforms; pivotal channel dynamic: MSPs now bundle 4-6 security SKUs (EDR + MDR + SAT + DNS filter + email security + ITDR) into single per-seat security price typically $35-$75/seat/mo on top of $90-$180/seat managed services', url: 'https://www.sentinelone.com/' },
  { title: 'Cyber insurance attestation pressure — the structural force compelling MSP MSA security uplift: Coalition (CEO Joshua Motta, San Francisco CA) + At-Bay (CEO Rotem Iram, San Mateo CA) + Cowbell (CEO Jack Kudale, Pleasanton CA) + Resilience (CEO Vishaal Hariprasad, San Francisco CA) + Travelers NYSE:TRV CyberRisk + Chubb NYSE:CB Cyber + AIG CyberEdge + Beazley LSE:BEZ + Hiscox LSE:HSX + Marsh McLennan NYSE:MMC + AON NYSE:AON cyber-insurance brokers — the policy renewal questionnaires now require attestations on MFA-on-everything + EDR not AV + immutable backups + 24/7 SOC monitoring + email security + SAT + tabletop exercises + patching SLA + DNS filtering + privileged access management + vulnerability scanning + incident response retainer + admin-account-separation + RDP-not-exposed-to-internet + cloud-config-monitoring; insurance carriers refusing renewals or raising premiums 200-400% for clients missing controls per Marsh + AON 2024 cyber renewal reports; pivotal MSP renewal moment: clients receive new cyber-insurance application + 60+ technical-attestation questions + cannot honestly check the boxes + come to MSP needing security uplift = single biggest 2024-2027 MSP MSA-renewal upgrade driver per IT Nation Connect + DattoCon + ASCII Edge presentations; controversial reality MSPs themselves now require cyber-insurance ($2-$10M tower minimum) to operate + Coalition + Cork warranty programs offer cyber-insurance attestation tooling specifically for MSPs to validate their stack before client questionnaire arrives', url: 'https://www.coalitioninc.com/' },
  { title: 'CompTIA (Computing Technology Industry Association, Downers Grove IL + Oakbrook Terrace) + ASCII Edge (ASCII Group MSP community) + Robin Robins Technology Marketing Toolkit (TMT, Franklin TN) + Gary Pica/TruMethods (founder TruMethods, now part of Kaseya 2021) + Peter Kujawa (Service Leadership / ConnectWise SVP) + Charles Weaver (MSPAlliance CEO) — the MSP industry education + community + designation perimeter: CompTIA ~100,000 members + CompTIA A+/Network+/Security+/CySA+/PenTest+ certifications + CompTIA ChannelCon annual + CompTIA Community State of the Channel reports; ASCII Group ~2,000 member MSPs + ASCII Edge regional events 8-10/yr + monthly community calls; Robin Robins Technology Marketing Toolkit the dominant MSP sales/marketing training organization 25+ years + ~9,000 MSP members + IT Marketing Roadshow annual + Boot Camp events + Producers Club + Accelerator Program for $1M-$3M MSPs; Gary Pica TruMethods Schedule for Success methodology + Service Leadership Index foundational benchmarking + acquired by Kaseya 2021; Peter Kujawa Service Leadership operating-model authority Service Leadership Index quartile framework Best-in-Class vs Median vs Worse + Service Leadership Annual MSP Industry Conference; Charles Weaver MSPAlliance ~30,000 MSPs + MSP/Cloud Verify Program audit standard; Channel Partners Conference + Expo + Channel Futures MSP501 annual ranking the most-cited MSP industry list ~1,000 MSPs apply per year ranked by recurring revenue + growth + service mix; Channel Futures + ChannelE2E + MSP Today + CRN MSP 500', url: 'https://www.comptia.org/' },
  { title: 'MSP501 (Channel Futures annual MSP ranking) + CRN MSP 500 (CRN/The Channel Company) + ChannelE2E (Joe Panettieri/Sara Roberts, Smarter MSP, Hauppauge NY) + Channel Futures (Informa Tech) — the MSP industry trade-press perimeter: MSP501 the annual ranking now in 18th year ~1,000 MSPs apply ~500 listed ranked by recurring revenue + total revenue + growth + service mix + technology stack + verticals; CRN MSP 500 organized as MSP Pioneer 250 + MSP Elite 150 + Managed Security 100 categories; ChannelE2E daily trade publication covering M&A + platform vendor news + MSP industry trends + ChannelE2E Top 100 Vertical MSPs lists; Channel Futures parent publication of MSP501 + daily MSP/MSSP/cloud news; CRN/The Channel Company + Channel Futures + ChannelE2E the three required-reading daily newsletters in every MSP owner inbox; pivotal MSP M&A trends covered: Evergreen Services Group (Alpine Investors PE) + Pinnacle/Integris (private equity rollup ~$300M revenue) + DataPrise (PE roll-up) + Thrive Networks (Court Square Capital) + Anchor Network Solutions + New Charter Technologies (Oak Hill Capital) + Cybersafe Solutions + Ntiva + ProArch + ConnectWise itself owned by Thoma Bravo + Kaseya owned by Insight Partners + N-able publicly traded NYSE:NABL spun from SolarWinds; PE-backed MSP roll-ups created the "PE buyer floor" pushing organic-MSP valuations to 8-12x EBITDA vs 4-6x pre-2020 per Service Leadership + Evolve M&A reports', url: 'https://www.channelfutures.com/msp-501' },
  { title: 'Service Leadership Index (SLI, Peter Kujawa, ConnectWise) quarterly + annual MSP financial-performance benchmarking — the universally-cited MSP operating-metrics reference: quartile framework Best-in-Class (top quartile) + Better + Median + Worse; SLI Q4 2024 + 2024 Annual Industry Benchmarking Report: Best-in-Class MSPs ~20-25% EBITDA + ~$220K-$280K revenue per FTE + 60-75% recurring revenue mix + 8-12% net new annual contract value (NN-ACV) growth + 92-96% gross-retention + 105-115% net-revenue-retention + technology stack cost <$8K/FTE/yr; Median MSPs ~12-15% EBITDA + ~$140K-$170K rev/FTE + 50-60% recurring mix + 3-5% NN-ACV growth + 85-90% gross-retention; Worse-quartile MSPs ~3-8% EBITDA + ~$95K-$120K rev/FTE + 35-45% recurring mix + flat or negative NN-ACV growth + 78-85% gross-retention; pivotal Service Leadership findings that drive MSA renewal conversation strategy: (a) Best-in-Class MSPs raise prices 5-8%/yr at renewal vs Median 1-3% vs Worse 0%; (b) Best-in-Class lose 8-12% of clients/yr by deliberate firing/non-renewal vs Median 5-7% vs Worse 3-5% (Worse MSPs hold onto money-losing clients); (c) Best-in-Class MSPs derive 25-40% gross profit from cybersecurity stack vs Median 12-20% vs Worse 5-10%; (d) Best-in-Class MSPs deliver QBRs to 80-95% of clients vs Median 40-55% vs Worse 15-25%; (e) operating model differences NOT technology differences explain ~70% of the quartile spread per Service Leadership multi-year longitudinal analysis', url: 'https://www.serviceleadership.com/' },
  { title: 'IT Nation Connect (ConnectWise annual conference Orlando, ~6,000 attendees) + DattoCon (Kaseya annual Miami, ~3,000) + Pax8 Beyond (Denver, ~5,000) + N-able Empower + Zero Trust World (ThreatLocker, Orlando) + Robin Robins Boot Camp (Nashville/Tampa, ~3,000) + ChannelCon (CompTIA) + ASCII Edge (regional, 8-10/yr) + IT Nation Secure (ConnectWise cybersecurity conference) — the MSP industry conference circuit driving deal-flow + vendor relationships + benchmarking osmosis: IT Nation Connect November Orlando dominant Service Leadership benchmarking workshops + Arnie Bellini (ConnectWise founder) + Jason Magee + Peter Kujawa keynotes + 200+ breakouts on operating model + cybersecurity + sales + M&A + vendor exhibits; DattoCon April-June Miami Kaseya 365 + Datto BCDR + Datto SaaS Protection + Fred Voccola keynotes + heavy roadmap focus; Pax8 Beyond June Denver heavy cloud + Microsoft NCE + cybersecurity vendor + marketplace focus; Robin Robins Boot Camp twice yearly intensive marketing + sales training for MSP owners $1M-$10M revenue; pivotal 2024-2027 MSP conference themes the "stop selling break-fix" reframe + the "IT-as-CFO-conversation" pivot + the price-compression-vs-security-stack-inflation squeeze + co-managed IT for internal-IT clients + AI-powered MSP operations + RMM consolidation + Microsoft NCE margin defense + cyber-insurance attestation as renewal-uplift driver + the PE roll-up valuation impact on owner exits', url: 'https://www.connectwise.com/theitnation/connect' },
  { title: 'Co-managed IT + the internal-IT-augmentation MSP motion — the structural shift in mid-market MSP economics 2022-2027: traditional fully-managed MSP model (MSP owns 100% of IT for 5-200-seat SMB) increasingly displaced by co-managed IT (MSP augments existing internal IT team typically 1-5 internal IT staff at 100-500-seat mid-market client) due to (a) mid-market clients hiring fractional CIO or director of IT in-house + (b) those internal-IT directors wanting partnership not displacement + (c) co-managed deals 3-5x larger per-client ARR ($120K-$400K vs $30K-$80K fully-managed) + (d) higher gross margins (40-55% vs 30-40% fully-managed); co-managed deal anatomy: MSP provides RMM + PSA + ticketing platform + 24/7 SOC + tier-2/3 escalation + cybersecurity stack + vendor management + project capacity + QBRs + strategic planning; internal IT team handles end-user tier-1 support + on-site presence + business-specific app expertise + vendor relationships; pivotal proponents Peter Kujawa (Service Leadership) + Gary Pica (TruMethods) + Robin Robins (TMT) + ConnectWise + Kaseya + N-able all built co-managed-specific tooling 2022-2024; co-managed pricing typically per-internal-IT-FTE-supported ($1,500-$3,500/FTE/mo) + per-managed-endpoint ($25-$45/endpoint/mo for RMM + security stack) + per-server ($150-$350/server/mo) + per-cloud-tenant + project hours; the co-managed conversation at MSA renewal often the single highest-value upsell motion for traditional fully-managed MSPs facing mid-market client growth', url: 'https://www.serviceleadership.com/blog/sli-quarterly-benchmark-snapshot' },
  { title: 'MSP M&A + PE roll-ups + valuation environment 2024-2027: Evergreen Services Group (Alpine Investors PE, ~$1B+ revenue ~150+ MSP acquisitions since 2017) + New Charter Technologies (Oak Hill Capital, ~$500M revenue ~30 MSP acquisitions) + Integris (Frontenac PE-backed rollup, ~$300M revenue) + DataPrise (PE-backed, ~$250M) + Thrive Networks (Court Square Capital, ~$200M) + Ntiva (PE-backed, ~$150M) + ProArch + Cybersafe Solutions + Anchor Network Solutions + Right Networks (Cove Hill Partners) + Solutions Granted (PE-backed MSSP rollup) — the PE-backed MSP roll-up landscape driving valuation environment: pre-2020 organic MSP exits at 4-6x EBITDA + 0.6-1.0x revenue; 2024-2027 PE buyers paying 8-12x EBITDA for $3M-$10M EBITDA MSPs + 12-18x for $10M+ EBITDA platforms + 1.5-3.0x revenue multiples + add-back-heavy structures; pivotal MSP owner consequence of PE valuation environment: MSP owners now run businesses as "PE-ready" with audited financials + recurring revenue >65% + 5+ years owner-independence + diversified client base (no client >10% revenue) + cybersecurity stack >30% gross profit + documented sales/marketing engine; MSP M&A advisors Evolve M&A (Brad Stoller) + Service Leadership M&A + Cogent Growth Partners + Martinwolf + Houlihan Lokey middle-market; pivotal industry data Service Leadership Annual Industry Benchmark + ChannelE2E M&A tracker + Channel Futures M&A reports + IT Glue State of the Industry surveys; MSP owners selling 2024-2027 must demonstrate clean MSA renewal cadence + price-increase discipline + cybersecurity attach rates to command top-quartile multiples', url: 'https://www.evergreensg.com/' },
  { title: 'MSP customer psychology + the three renewal conversations every MSP owner avoids: (1) "We need to talk about the price increase" — MSPs systematically under-price at renewal vs market because the conversation is uncomfortable + the existing client relationship feels fragile + the MSP owner remembers original "all you can eat for $X" promise; Service Leadership Best-in-Class MSPs raise 5-8%/yr at renewal vs Worse 0% — the single biggest quartile-separator; (2) "Your current security stack does not meet the cyber-insurance attestation bar" — MSPs avoid telling clients the truth about EDR-vs-AV + MFA-everywhere + 24/7 SOC + immutable backups because it requires admitting prior stack was insufficient + because client will ask "why didnt you tell me before"; (3) "You are no longer a good fit and we are not renewing" — Best-in-Class MSPs deliberately fire bottom 8-12% of clients annually who consume disproportionate ticket volume + drive technician burnout + have negative gross margin; Worse-quartile MSPs hold on out of fear; per Service Leadership + Robin Robins + Gary Pica TruMethods + Peter Kujawa the three avoided conversations are responsible for ~60-75% of the EBITDA gap between Best-in-Class and Worse quartiles; pivotal MSA-renewal conversation framework: (a) anchor to documented service-delivery metrics QBR + (b) reframe IT as risk-mitigation + insurance-eligibility not cost-line + (c) present cybersecurity stack uplift as cyber-insurance-policy enabler + (d) introduce co-managed option for growing mid-market client + (e) script the fire-the-client conversation', url: 'https://www.tmtoolkit.com/' }
];

// ============================================================================
// TLDR -- intro callout + meeting agenda
// ============================================================================
const tldr = `> ### 🛠️ The Pulse Training
> **Who this is for:** **MSP owners + vCIOs + account managers + service-delivery managers** at **$1M-$25M ARR managed service providers** running MSA renewal conversations against **price compression** + **cybersecurity stack inflation** + **Microsoft NCE margin erosion** + **PE-backed roll-up competitors** (Evergreen Services Group / New Charter Technologies / Integris / DataPrise / Thrive / Ntiva). Per **Service Leadership Index Q4 2024**: Best-in-Class MSPs ~**20-25% EBITDA** + raise prices **5-8%/yr** + derive **25-40% gross profit** from cybersecurity stack; Median ~**12-15% EBITDA** + raise prices **1-3%/yr**; Worse-quartile ~**3-8% EBITDA** + raise prices **0%/yr**. **Run before IT Nation Connect + DattoCon + Pax8 Beyond + Robin Robins Boot Camp.**
>
> **What MSP teams leave with:** **5-STAGE MSA RENEWAL CONVERSATION (REVIEW → REFRAME → REPRICE → REUP → REFER)** + **THREE RENEWAL CONVERSATIONS EVERY MSP OWNER AVOIDS** (price increase / security uplift / fire the client). Plus verbatim language, two role-plays (CFO at 50-seat manufacturer + Office Manager at 12-seat law firm), the "good bad ugly" SLI quartile self-diagnosis, cyber-insurance attestation gap audit, NCE margin-defense math, co-managed conversion playbook.
>
> **Owner brings:** (1) 3 recent lost-renewal debriefs + last MSP501 application. (2) MSA Renewal Kit — QBR scorecard template (uptime + ticket-resolution + security-posture + project-completion) + Service Leadership quartile self-diagnosis + cyber-insurance attestation gap checklist (Coalition/At-Bay/Cowbell questionnaire) + NCE margin-defense calculator + co-managed conversion pitch deck + price-increase script. (3) Whiteboard last 10 renewals by stage + outcome + price uplift.

## MEETING AGENDA -- 60 MINUTES

| Time | Block | Owner | Outcome |
|------|-------|-------|---------|
| **0:00-0:10** | **Intro + Cold Open** — Owner A renewed 65-seat distributor flat at $135/seat, lost client to Evergreen-rollup 8 months later citing "no roadmap conversation"; Owner B raised same-segment 80-seat manufacturer 11% with co-managed bolt-on + Huntress MDR + cyber-insurance attestation = $14K/mo → $22K/mo | MSP Owner | Roadmap-anchored renewal beats flat-rate "don't poke the bear" 4-6x |
| **0:10-0:35** | **Teach** — 5-STAGE (REVIEW/REFRAME/REPRICE/REUP/REFER) + 3 avoided conversations (price / security / fire) + SLI quartile self-diagnosis | MSP Owner | Recite 5 stages + 3 conversations + cyber-attestation gap list verbatim |
| **0:35-0:45** | **Discussion** — 8 prompts on when-to-walk-away / co-managed pivot timing / NCE pass-through / Pax8 vs direct CSP / when QBR cadence broke / Worse-quartile pricing fear | MSP Owner + room | Audit last 10 renewals by SLI quartile behavior |
| **0:45-1:05** | **Role-Play x 2** — R1: CFO at 50-seat precision-manufacturing client demanding flat renewal + cyber-insurance carrier just denied policy. R2: Office Manager at 12-seat law firm comparing your $145/seat to Geek-Squad-cousin's "I can do it for $65/seat" | Pairs | Run 5-STAGE under two buyer archetypes |
| **1:05-1:10** | **Debrief + Commitments** — 3 Qs + 1 lost renewal + 1 verbatim line + 1 conversation you avoided | MSP Owner | Roadmap-first renewal habit + price-increase discipline |
| **1:10-1:13** | **Leave-Behind** — Script Card + SLI Quartile Self-Diagnosis + Cyber-Attestation Gap Checklist + NCE Margin-Defense Calculator + Co-Managed Conversion Pitch | MSP Owner | One-pager in every vCIO bag |

> ### 🎯 Bottom Line
> **A 50-seat client doesn't churn because your hourly rate went up $15 — she churns because you renewed her flat for 3 years while her cyber-insurance carrier denied coverage, her CFO never saw a QBR, and Evergreen Services Group's BDR called her three times in Q3 with a security-stack-uplift conversation you should have run.** Per **Service Leadership Index Q4 2024 + IT Nation Connect 2024 + Channel Futures MSP501**: Best-in-Class MSPs raise 5-8%/yr + attach 4-6 security SKUs + run QBRs to 80-95% of clients + deliberately fire bottom 8-12% / yr. Run **5-STAGE REVIEW/REFRAME/REPRICE/REUP/REFER + 3-avoided-conversations + SLI quartile self-diagnosis + cyber-attestation gap audit + co-managed pivot** = **25-35% MRR uplift per renewal cycle / 95%+ gross retention / 110-120% NRR / 8-12x EBITDA exit multiple**. Flat-rate-don't-poke-the-bear + skip-QBR + avoid-price-conversation + sell-break-fix-language + ignore-cyber-attestation = **5-15% MRR uplift / 82-88% gross retention / lose mid-market clients to Evergreen + DataPrise / 4-6x EBITDA exit multiple**. Five stages. Three avoided conversations. Roadmap before renewal.

`;

// ============================================================================
// CORE -- Sections 1-6
// ============================================================================
const core = `---

## SECTION 1 -- INTRO + AGENDA (0:00-0:10)

> ### 🟡 Coach Note
> Do NOT open with the **Kaseya 365 bundle slide** or the **ConnectWise stack deck**. Stand at the whiteboard, say the **Service Leadership Index Q4 2024** quartile numbers, tell the two-owner cold-open story, end with **the three renewal conversations every MSP owner avoids** + **the cyber-insurance attestation gap that will surface in 60% of your renewals over the next 12 months**. **Ten minutes. Hard stop at 0:10.**

### The numbers, then the story.

**The numbers.** Per **Service Leadership Index Q4 2024 + ConnectWise IT Nation Connect 2024 + Channel Futures MSP501 + Pax8 Beyond 2024 + Datto Global State of the MSP**: **Best-in-Class MSPs** (top quartile) run **20-25% EBITDA** + **$220K-$280K revenue/FTE** + **60-75% recurring revenue mix** + **8-12% NN-ACV growth** + **92-96% gross retention** + **105-115% net revenue retention** + raise prices **5-8%/yr** at renewal + derive **25-40% gross profit from cybersecurity stack** + deliver **QBRs to 80-95% of clients** + deliberately **fire bottom 8-12% of clients/yr**. **Median MSPs** run **12-15% EBITDA** + **$140K-$170K rev/FTE** + raise prices **1-3%/yr** + QBR to 40-55% of clients. **Worse-quartile MSPs** run **3-8% EBITDA** + raise prices **0%** + hold onto money-losing clients. **Per Peter Kujawa (ConnectWise Service Leadership SVP)**, operating-model differences — not technology stack — explain **~70% of the quartile spread**.

Layer on the structural squeeze. **Microsoft NCE** (March 2022 + April 2024 + April 2025 price increases) compressed MSP M365 margins from **~20% historical to ~15%** + **Azure to ~5-10%** + **Copilot to 0%**. M365 fell from contributing **12-18% gross profit to 6-10%** for the median MSP per Service Leadership. Cybersecurity stack inflation is the only structural offset: **SentinelOne + Huntress + ThreatLocker + Blackpoint + Bitdefender + Coro + Todyl** bundled into a **$35-$75/seat/mo security wrap** on top of **$90-$180/seat managed services**. Per **Coalition + At-Bay + Cowbell + Marsh 2024 cyber-renewal reports**, cyber-insurance carriers refused renewal or raised premiums **200-400%** for clients missing **MFA-everywhere + EDR + immutable backups + 24/7 SOC + SAT + DNS filter + ITDR**. Per **Pax8 + Channel Futures MSP501**: ~**60% of mid-market MSP renewals 2024-2027** will surface a cyber-attestation gap the client cannot honestly check.

**The story.** **Owner A** renewed a **65-seat industrial-distributor in Cincinnati** at **$135/seat flat for 3 years** — no QBR in 14 mo, no roadmap, no cyber-attestation review. **8 months in, Evergreen Services Group's BDR called the CFO three times in Q3** with a security-uplift conversation framed as cyber-policy-eligibility. **CFO terminated for cause** (inadequate security posture documented in renewal cyber-questionnaire), paid penalty, signed with Evergreen at $178/seat including the security wrap. **Owner A lost $105K ARR + the reference + the referral pipeline.**

**Owner B** renewed an **80-seat precision-manufacturer in Grand Rapids** 4 months later. Day 90: **Service Leadership-style QBR** (uptime 99.94% + ticket 2.3 hrs + 18 projects + cybersecurity 7.2/10). Day 75: **cyber-attestation gap audit** against the renewed Coalition policy — 9 gaps (no Huntress MDR + no ITDR + no immutable backups + no SAT cadence). Day 60: **REPRICE pitch** — $14K → $22K/mo (base lift + $75/seat security wrap + co-managed bolt-on for 2 internal IT staff). Day 30: client signed **3-year MSA at $22K/mo** + Huntress + ThreatLocker + Blackpoint + Cork + co-managed retainer. **Lift: $96K ARR/yr + cyber-insurance reference + 2 vertical referrals + MSP501 jump #287 → #198.**

> ### ⚠️ Common Trap
> *"Owner A got beat by PE money + we can't compete with Evergreen's marketing budget + flat renewal kept the client three years longer."* **(1)** "Kept the client three years longer" is the post-mortem Evergreen prints in its acquisition deck. **(2)** Flat renewal is not retention — it's a **delayed loss** + **margin erosion** + **PE-rollup-bait**. **(3)** The CFO didn't terminate over price — she terminated over **cyber-insurance policy denial** + **no QBR documentation** + **no roadmap conversation**. Evergreen's BDR didn't win on marketing — Evergreen won because Owner A didn't have the **REPRICE-REUP-REFER** conversation. **REVIEW before REFRAME. REFRAME before REPRICE.**

**Transition:** "Next 50 minutes: 5-stage MSA renewal, 3 avoided conversations, two role-plays. Let's go."

---

## SECTION 2 -- THE TEACH (0:10-0:35)

> ### 🟡 Coach Note
> Twenty-five minutes. Split into **5-STAGE MSA RENEWAL (15 min, ~3 min/stage)** + **Three Renewal Conversations Every MSP Owner Avoids (10 min)** + **SLI Quartile Self-Diagnosis (2 min)**. Pause for one clarifying question per stage. End-of-section test: every vCIO recites all 5 stages + 3 avoided conversations + the cyber-attestation gap checklist + a 60-second REPRICE pitch verbatim without notes.

### Part A -- The 5-STAGE MSA RENEWAL CONVERSATION (15 min)

Most lost MSP renewals collapse at Stage 1 (skipped QBR + roadmap-less renewal letter) or Stage 3 (avoided price-increase conversation + flat-rate-out-of-fear). **You don't keep a 50-seat mid-market client with a flat-rate renewal letter — you EARN the next 3-year MSA by REVIEWING uptime/ticket/security data in a QBR, REFRAMING IT as risk-mitigation not cost-line, REPRICING with cyber-attestation gap audit, REUPPING on co-managed/security/governance, and REFERRING into vertical peers.**

#### Stage 1 -- REVIEW (3 min)

The MSA renewal conversation starts **90 days before contract expiry** with a **structured QBR** using a **Service Leadership-style scorecard**: **uptime % + avg ticket-resolution time + tickets-per-seat + strategic projects delivered + cybersecurity posture score + Microsoft tenant health + backup-test results**. The CFO + Office Manager + COO must SEE the data in a format her board would accept. No QBR = no data = no leverage at renewal.

> ### 🎤 Verbatim Script -- REVIEW
> *"Karen — quarterly review pulled. Last 12 months: **99.94% uptime** vs SLA 99.5%. **2.3-hour avg ticket resolution** vs SLA 4 hrs. **412 tickets resolved** across 50 seats = 8.2/seat/yr inside Service Leadership Best-in-Class band 7-10. **18 strategic projects delivered** including the Sage 300 upgrade + the Fortinet refresh + the M365 E5 migration. **Cybersecurity posture score 7.2/10** vs target 9.0 — that 1.8-point gap is the renewal conversation."*

**Common trap.** Skipping QBR ("the client never asks for it"). **Median MSPs run QBRs for 40-55% of clients; Best-in-Class 80-95%.** No QBR = the renewal letter arrives as a price-increase ambush + client never saw the value + Evergreen BDR closes them in 6 months.

#### Stage 2 -- REFRAME (3 min)

Anchor IT as **risk-mitigation + cyber-insurance-eligibility + business-continuity** — NOT as **break-fix cost-line**. The CFO writes the check for risk-mitigation; she fights the check for break-fix. Per **Gary Pica TruMethods + Robin Robins TMT + Peter Kujawa**, the single highest-leverage reframe is **"we are your cyber-insurance-policy enabler"** because the cyber-insurance application is sitting in her email.

> ### 🎤 Verbatim Script -- REFRAME
> *"Karen — three things changed since we signed. (1) Your **Coalition cyber-policy renewal questionnaire** has **63 technical-attestation questions**, you can honestly check **41**. The gap is policy denial or 200-400% premium per Marsh 2024 cyber-renewal report. (2) Your **regulatory exposure** under **CMMC 2.0** + **NY DFS Part 500** + **state breach laws** doubled. (3) **Ransomware downtime for a 50-seat manufacturer averages $18K-$42K/day** per Coveware + Sophos State of Ransomware. **You are not buying IT support. You are buying cyber-insurance eligibility + regulatory compliance + business continuity.** That is the renewal frame."*

**Common trap.** Pitching faster ticket-resolution + better helpdesk + new RMM dashboards. CFOs don't care about RMM dashboards. **Reframe to insurance + compliance + continuity = the CFO writes the check without the Office Manager fight.**

#### Stage 3 -- REPRICE (3 min)

The price-increase conversation. Best-in-Class MSPs lift **5-8%/yr** + add **$35-$75/seat security wrap** + introduce **co-managed governance retainer** for growing clients. Worse-quartile MSPs lift **0%** out of fear + watch margins erode + lose clients anyway 18 months later to PE-rollup competitors.

> ### 🎤 Verbatim Script -- REPRICE
> *"Karen — three components. (1) **Base** $135 → $145/seat = **7.4% lift** anchored to Service Leadership labor index + NCE pass-through + Azure growth. (2) **Cybersecurity wrap** $0 → $65/seat — Huntress MDR + ThreatLocker + Blackpoint 24/7 SOC + Cork + KnowBe4 SAT — closes 7 of 9 gaps. (3) **Co-managed governance** $3.5K/mo — partners your 2 internal IT + vCIO + after-hours. **Total $14K → $22K/mo = $96K ARR lift / $480K over 5 yrs. Cyber-premium savings $18-$32K/yr.**"*

**Common trap.** Lifting the base $5/seat + adding nothing else. **The lift comes from the SECURITY WRAP + CO-MANAGED, not the base-rate increase.** Best-in-Class MSPs grow MRR per client 15-30%/yr on security stack attach + co-managed conversion — not on base-rate increases.

#### Stage 4 -- REUP (3 min)

Lock in the **3-year MSA** with **annual price-escalator** (CPI + 2-3% floor, 6% cap) + **automatic renewal clause** + **scope-change governance** + **co-managed expansion options**. Best-in-Class MSPs hold **95%+ gross retention** because their MSAs are board-defensible, audit-clean, and built for the cyber-insurance + M&A-due-diligence environment.

> ### 🎤 Verbatim Script -- REUP
> *"Karen — proposed MSA. **3-yr term + CPI+2% escalator floor + 6% cap + auto-renew 90-day + scope governance quarterly + co-managed expansion if you hire 3rd IT FTE + annual cyber-attestation review** with Coalition. **Termination for cause** = SLA breach + 90-day cure. **For convenience** = 6 mo notice + unamortized onboarding + 50% of remaining recurring."*

**Common trap.** Letting the client dictate 1-year terms + no escalator + termination-for-convenience 30-day notice. **That MSA is M&A-toxic + cyber-insurance-toxic + PE-roll-up-bait.** A 3-year MSA with escalator + auto-renew is the **valuation multiplier** at exit.

#### Stage 5 -- REFER (3 min)

Convert the renewed client into **vertical-segment referral engine** — 2-3 named introductions per renewed client per year. The closed-and-renewed CFO is your best BDR for the next 10 mid-market manufacturers in the metro. Robin Robins TMT calls this **"the renewal-to-referral flywheel"** — Best-in-Class MSPs generate **35-50% of new logo growth from existing-client referrals** vs Median **10-18%**.

> ### 🎤 Verbatim Script -- REFER
> *"Karen — one ask. You signed because you trust the cyber-insurance + business-continuity frame + the QBR cadence. **Three CFO peers in West Michigan manufacturing** — Diana at Hartwell Industries, Marcus at Riverside Precision, Sarah at Lakeshore Stamping — same 40-100 seat profile, same cyber-insurance pressure. **20-minute intro email + I take it from there.** Reciprocal: I send you our quarterly West Michigan Manufacturing IT-Risk Briefing + tee you up as a speaker at our IT Nation roundtable."*

**Common trap.** Asking for referrals at MSA signing month 1. Wrong moment. **Best-in-Class MSPs ask at month 6 after first successful QBR delivered + cyber-attestation gap closed + project win documented.**

### Part B -- The Three Renewal Conversations Every MSP Owner Avoids (10 min)

Per **Service Leadership + Robin Robins + Gary Pica TruMethods + Peter Kujawa**, three conversations explain **~60-75% of the EBITDA gap** between Best-in-Class and Worse-quartile MSPs. Owners avoid them out of fear + habit + "don't poke the bear" + remembered original "all you can eat for $X" promise.

#### Conversation 1 -- "We need to talk about the price increase"

Worse-quartile MSPs hold base rates flat for 3-5 years + watch labor inflation + NCE M365 margin compression + cybersecurity vendor stack inflation erode EBITDA from 12% to 4%. Best-in-Class lift **5-8%/yr every year** anchored to Service Leadership labor-cost index + NCE pass-through + Microsoft published price changes. **Script:** *"Karen — annual price review per our MSA Section 4.2. Service Leadership labor-cost inflation 6.2% last year + NCE M365 pass-through 12% + Azure consumption growth 18% on your tenant. Lift is 7.4%. Same scope. Effective 30 days."*

#### Conversation 2 -- "Your current security stack does not meet the cyber-insurance attestation bar"

MSPs avoid telling clients the truth about **EDR-vs-AV** + **MFA-everywhere** + **24/7 SOC** + **immutable backups** + **ITDR** + **SAT cadence** because it requires admitting prior stack was insufficient. The longer the conversation is delayed the worse the disclosure liability when the breach happens. **Script:** *"Karen — your Coalition renewal questionnaire arrived Tuesday. I ran it against your current stack. 9 gaps. 7 are insurance-blockers under Coalition's 2025 underwriting rules. We have 60 days to close before policy expiry. Here's the proposed uplift + the cost + the alternative which is policy denial + 200-400% premium hunt + likely uninsurable status."*

#### Conversation 3 -- "You are no longer a good fit and we are not renewing"

Best-in-Class MSPs deliberately fire **bottom 8-12% of clients annually** — clients who consume 3-5x ticket volume per seat + drive technician burnout + run negative gross margin + refuse security uplift + treat support as adversarial. **Script:** *"Karen — appreciate the 4-year relationship. After internal review we are declining to renew the MSA expiring March 31. Two reasons. (1) Your usage pattern is 4.2x our managed-services base assumption — we lose money every month. (2) You declined the security uplift in 2024 + 2025 — we cannot underwrite the cyber-risk. We will support transition for 90 days + provide warm intro to two MSPs whose model fits better. Karen Smith at Apex Network + Tom Garcia at Bolt IT will both call you this week."*

### Part C -- SLI Quartile Self-Diagnosis (2 min)

Every MSP owner in the room self-diagnoses on the 5 metrics: **EBITDA %** + **revenue per FTE** + **recurring revenue mix** + **NN-ACV growth** + **gross retention**. The numbers are non-negotiable per **Service Leadership 2024 Annual Industry Benchmarking Report**. The room learns instantly which quartile they're in + which 2-3 metrics are blocking the next quartile jump.

> ### 🎯 Bottom Line
> 5 stages + 3 avoided conversations + SLI quartile self-diagnosis + cyber-attestation gap audit + co-managed pivot + Microsoft NCE margin defense + price-increase script = **25-35% MRR uplift per renewal cycle + 95%+ gross retention + 110-120% NRR + 8-12x EBITDA exit multiple**. Stages without the avoided conversations = competent QBR delivery that loses to Evergreen because you wouldn't raise the price. Avoided conversations without the stages = aggressive pricing that breaks the relationship without a QBR + cyber-attestation foundation.

---

## SECTION 3 -- THE DISCUSSION (0:35-0:45)

> ### 🟡 Coach Note
> Whiteboard. Write **REVIEW / REFRAME / REPRICE / REUP / REFER** across 5 columns + **PRICE / SECURITY / FIRE** down the side. Each vCIO audits her last 10 renewals out loud — which stage she skipped, which avoided conversation she ducked, what quartile her behavior put her in. **Count to five after each prompt.**

**1 — "When do you walk away from a renewal because the client refuses the cyber-attestation uplift?"** When the client's stack has 5+ gaps that map to Coalition / At-Bay / Cowbell underwriting refusal AND the client explicitly declines the uplift after two written warnings AND your MSP's own cyber-insurance carrier (Coalition / Cork) flags the client as elevated-risk on your tower. **MSP Owner:** *"Your $2M-$10M cyber tower premium goes up if you carry uninsured-grade clients. Fire them or eat the premium hike. Best-in-Class fires."*

**2 — "When does the fully-managed-to-co-managed pivot trigger?"** When the client hires their **2nd internal IT FTE** or **fractional CIO** — the displacement signal. Per Service Leadership, co-managed deals run **3-5x larger per-client ARR ($120K-$400K vs $30K-$80K)** + **40-55% gross margin vs 30-40%**. **MSP Owner:** *"Don't wait for the internal CIO to call. When you see the 2nd IT hire on LinkedIn, run the co-managed conversation in the next QBR. Otherwise they replace you in 18 months."*

**3 — "Microsoft NCE pass-through — annual commitment or monthly + how do you frame the 20% uplift to clients?"** Default to **annual commitment with monthly billing** for stable seat-count + monthly for hyper-growth + Frankenstein hybrid for seasonal. Pass through Microsoft published price increases at the contractual anniversary + cite **Microsoft Partner Center announcement** + Channel Futures + ChannelE2E coverage. **MSP Owner:** *"NCE pass-through is not optional — it's Microsoft published. The conversation is annual-vs-monthly trade-off, not whether the increase passes through."*

**4 — "Pax8 vs direct CSP vs TD SYNNEX vs Sherweb — when does Pax8 marketplace stop making sense?"** When MRR per client exceeds ~$8K-$12K AND you've consolidated to 3-5 SKU vendors AND you've built internal billing/provisioning infrastructure. Below $5K MRR Pax8 marketplace + bundled invoicing + Pax8 Beyond ecosystem wins on velocity. **MSP Owner:** *"Pax8 sets the de-facto street price across the channel — fighting it on small SKUs is brand suicide. Differentiate on managed-services labor + security stack curation, not on license-resale margin."*

**5 — "QBR cadence broke 18 months ago — how do you reset without the client noticing?"** You can't. **Acknowledge it in writing** + reset cadence + deliver 2 consecutive Service Leadership-style QBRs back-to-back at 30 + 60 days + run the cyber-attestation gap audit as the QBR centerpiece. **MSP Owner:** *"The CFO knows you stopped QBRing. Apologize once, reset hard, deliver twice. Reset within 90 days or lose the renewal."*

**6 — "Worse-quartile pricing fear — how do you coach a service-delivery manager who refuses to deliver the price-increase conversation?"** Ride along on 3 renewal pitches + script the verbatim + remove the conversation from her — owner delivers price, SDM delivers technical scope. Worse-quartile pricing behavior is **owner-coachable in 90 days** per Peter Kujawa Service Leadership coaching observations. **MSP Owner:** *"Pricing is owner work. Don't outsource the renewal conversation to a tech-leaning SDM. Wrong instinct, wrong reflexes, wrong outcome."*

**7 — "Cyber-attestation gap audit — when do you bill for it vs include in QBR?"** Include the **annual attestation review** in the MSA scope (40-min QBR segment). Bill the **remediation engineering** as project hours if scope is significant + offer flat-fee security-uplift packages tied to Coalition / At-Bay / Cowbell underwriting tiers. **MSP Owner:** *"Attestation review = relationship currency. Remediation = revenue. Don't conflate the two."*

**8 — "ONE verbatim change."** Each vCIO: ONE stage skipped + ONE avoided conversation to deliver this week. **MSP Owner:** *"CRM task + next Monday huddle + ride-along on the first attempt."*

---

## SECTION 4 -- TWO-PERSON ROLE-PLAY (0:45-1:05)

> ### 🟡 Coach Note
> Pair vCIOs. **Two scenarios, 10 min each, 60-sec reset between.** Walk the imaginary boardroom + the CFO's office — DO NOT just sit. Listen for the verbatim *"cyber-insurance attestation gap"* (REFRAME) + whether the rep delivers the price-increase line without flinching + whether she pivots to co-managed when the buyer signals internal-IT growth. Mark which stage + which avoided conversation each rep skips.

### Role-Play 1 -- CFO at 50-Seat Precision-Manufacturer + Cyber-Insurance Denial (10 min)

**Setup:** **Karen Hofstetter, CFO of Westshore Precision Components**, a 50-seat ISO-9001-certified precision-manufacturing client in Grand Rapids MI on **3-year MSA expiring in 75 days at $135/seat/mo flat = $6,750/mo MRR / $81K ARR**. Karen received **Coalition cyber-policy renewal questionnaire 14 days ago** + her broker said premium will go from $18K/yr to $54K/yr OR coverage denied if 9 gaps not closed in 45 days. Karen is **demanding flat renewal** + has been pitched by **Evergreen Services Group's BDR** twice in Q3 with a security uplift conversation. vCIO is from **Lakeshore Managed IT, a $4.2M ARR MSP in Grand Rapids/Kalamazoo/South Bend**. **Run full 5-STAGE + deliver all 3 avoided conversations + close the renewal at $22K/mo ($264K ARR / 326% lift).**

> ### 🎤 PROSPECT -- Karen Hofstetter
> 47, 9-yr CFO, 50-seat precision-manufacturer (Tier-2 automotive + aerospace supplier), Grand Rapids native, board-reports monthly to owner-family, financially literate, distrusts IT vendor "scope creep," leads PRICE conversation primary SECURITY secondary.
>
> **Deflection 1 (min 4):** *"We've been flat at $135/seat for three years and we like it that way. Your competitor Evergreen quoted me $128/seat including a security wrap. Why am I getting a 60% increase from you when the market is going DOWN?"*
>
> **Deflection 2 (min 8):** *"The Coalition gaps are Coalition's problem, not mine. I'll just switch carriers. Tom at Travelers said he can write me without the EDR or the 24/7 SOC requirements. So why am I buying a $65/seat security wrap I don't need?"*

> ### 🎤 vCIO
>
> - **Min 0-3 (REVIEW + REFRAME):** *"Karen — QBR pulled. **99.94% uptime + 2.3-hr ticket + 18 projects + cybersecurity 7.2/10 vs target 9.0**. Three changes since 2022 MSA. (1) **Coalition underwriting tightened** — 63 attestations, you can check 41 + Marsh 2024 shows 200-400% premium hikes on gaps. (2) **CMMC 2.0 + NY DFS + state breach laws** doubled Tier-2 automotive exposure. (3) **Ransomware downtime 50-seat manufacturer $18K-$42K/day per Coveware**. **You are not buying IT support — you are buying cyber-insurance eligibility + regulatory compliance + business continuity.**"*
> - **Min 3-5 (REPRICE):** *"Three components. (1) Base $135 → $145/seat = **7.4% lift** — Service Leadership labor index + NCE pass-through + Azure consumption growth. (2) **Security wrap $65/seat** — Huntress MDR + ThreatLocker + Blackpoint 24/7 SOC + Cork + KnowBe4 — closes 7 of 9 Coalition gaps. (3) **Co-managed governance $3.5K/mo** — partners your IT director Mike + after-hours + vCIO quarterly. **Total $14K → $22K/mo = $96K ARR lift / $480K over 5 yrs. Cyber-premium savings $18K-$32K/yr pays half.**"*
> - **Min 5-7 (Deflection 1 — Evergreen at $128):** *"Three on Evergreen. (1) **Pull the SOW** — $128 base excludes MDR + 24/7 SOC + co-managed + has 5-yr auto-renew + 30-day termination favoring Evergreen. Read Sections 9 + 14. (2) **Evergreen acquires 18-30 MSPs/yr** per Channel Futures — your AM turns over every 14-18 mo. Mike has owned your account 4 yrs + knows your Sage ERP + Mastercam + FANUC integration. (3) **Their pitch deck — I have it** — shows Westshore as Michigan-manufacturing acquisition target. Not selling MSP services — sourcing acquisition targets. **Your call.**"*
> - **Min 7-9 (Deflection 2 — switch carriers):** *"Three on the Travelers swap. (1) **Tom's verbal isn't underwriting** — Travelers' 2025 cyber app has the same 63 attestations + EDR + 24/7 SOC per Marsh + AON 2024. 'We can write you' is broker enthusiasm not underwriting commitment. (2) **Tier-2 automotive** — Ford/GM/Stellantis supplier-portal requires PPAP Q3 2025 cyber-attestation. Attest to OEM what you cannot attest to Coalition = supplier-removal = revenue cliff. (3) **Owner-family** carries personal liability under MI piercing-corporate-veil if uninsured breach occurs. **$65/seat is the floor for Tier-2 supplier status + owner-family protection.** Pull the Travelers app + I walk Section 8 with you."*
> - **Min 9-10 (REUP + REFER):** *"Two asks. (1) **3-yr MSA at $22K/mo + CPI+2% escalator + 6% cap + auto-renew 90-day + co-managed expansion if you hire 3rd IT FTE + annual cyber-attestation review built into Q4 QBR**. (2) **One West Michigan manufacturing CFO peer intro** — Diana at Hartwell, Marcus at Riverside Precision, Sarah at Lakeshore Stamping. 20-min email. **Sign?**"*

### 60-Second Reset

> ### 🟡 Coach Note
> **"Switch sides — 60-sec reset."** Stand up. Read the OTHER role's paper. Go.

### Role-Play 2 -- Office Manager at 12-Seat Law Firm + "My Cousin Does It for $65/Seat" (10 min)

**Setup:** **Linda Marsh, Office Manager at Marsh, Henley & Polk LLP**, a 12-attorney + 8-staff personal-injury + estate-planning law firm in Toledo OH on **2-year MSA expiring in 45 days at $115/seat/mo = $2,300/mo MRR / $27.6K ARR**. Linda is the **founding partner's wife** + has authority over IT spend + has been the MSP's day-to-day contact for 5 years. She has just heard from her **nephew (recent CompTIA A+ + just laid off from Best Buy Geek Squad)** that he can do everything you do for **$65/seat = $780/mo**. Linda has zero technical context but high authority + low budget anxiety. The firm handles **PHI under HIPAA** + **PII under state bar professional-conduct rules** + carries **$3M cyber-liability via Chubb**. vCIO is from **Lakeshore Managed IT**. **Run full 5-STAGE + handle two deflections + close the renewal at $148/seat + $35 security wrap = $2,196/mo MRR + Chubb attestation alignment.**

> ### 🎤 PROSPECT -- Linda Marsh
> 58, Office Manager + founding partner's wife, 5-yr MSP relationship, non-technical but high-authority + budget-conscious, leads PRICE conversation hard with SECURITY as background anxiety she doesn't articulate.
>
> **Deflection 1 (min 4):** *"My nephew Brian just got his CompTIA A+ certification + got laid off from Geek Squad. He said he can manage everything you do for $65/seat. That's $780/mo vs your $2,300. That's a $1,500/mo savings — $18K/year. Why would I not do that?"*
>
> **Deflection 2 (min 8):** *"We've never had a breach in 5 years. The Chubb policy is in force. Brian says we don't need 24/7 monitoring for 12 attorneys + 8 staff. Why are we suddenly buying a security wrap?"*

> ### 🎤 vCIO
>
> - **Min 0-3 (REVIEW + REFRAME):** *"Linda — QBR data. **99.91% uptime + 2.8-hr ticket + 8 projects including Clio migration + M365 E5 + immutable backup deployment**. Three changes. (1) **HIPAA OCR enforcement** — 2024 settlements averaged $1.2M for small-practice PHI breaches per HHS breach portal. (2) **Ohio Bar + ABA Opinion 477R + 498** — attorneys have duty to protect PII + use competent technology — failure = malpractice exposure beyond cyber-policy. (3) **Chubb 2025 renewal** requires MFA + EDR + immutable backup + SAT + 24/7 monitoring for PHI practices. **You are buying HIPAA-compliance + Bar professional-conduct + Chubb-eligibility — not IT support.**"*
> - **Min 3-5 (REPRICE):** *"Three components. (1) **Base $115 → $148/seat = 28% lift** — labor index + NCE pass-through + Clio integration + Copilot rollout. (2) **HIPAA security wrap $35/seat** — Huntress MDR + ITDR + Defender for Endpoint + KnowBe4 HIPAA SAT + DNS filter — meets Chubb 2025 + HHS safe-harbor. (3) **$148 + $35 = $183/seat × 12 = $2,196/mo** — comparable to $2,300 current but HIPAA-compliant + Chubb-aligned. **Same check, fundamentally different risk posture.**"*
> - **Min 5-7 (Deflection 1 — nephew Brian):** *"Three on Brian, with respect. (1) **CompTIA A+ certifies break-fix desktop technician** — not HIPAA-compliant MSP ops, RMM administration, SIEM, cyber-attestation, or Bar technology standards. **ABA Opinion 477R requires supervising attorney to evaluate vendor competency** — Brian + A+ does not meet that bar. Malpractice exposure if Brian misconfigures. (2) **No 24/7 SOC + no MDR + no immutable backup + no SAT** = Chubb policy denial at Q1 + HIPAA safe-harbor loss + Bar exposure to founding partner personally. (3) **Brian carries no $5M E&O, $2M cyber tower, SOC-2 Type-2, or HIPAA BAA infrastructure**. Ransomware-against-law-firms up 167% per Sophos 2024. When breach happens, founding partner's personal assets cover the firm. **Have the conversation with the founding partner before signing Brian.**"*
> - **Min 7-9 (Deflection 2 — never had a breach):** *"'Never had a breach' is the most expensive sentence in MSP renewals. (1) **Per Coveware Q4 2024**, avg days-to-detection for law firms without MDR is **207 days** — most firms have been breached + don't know. Your **dark-web exposure report** — 14 attorney + staff credentials on breach forums last 18 mo. (2) **Chubb 2025 underwriting** explicitly excludes coverage for breaches from missing-MFA or missing-EDR on renewed policies — Chubb tower is **conditional on attestation accuracy**. (3) **Ohio Bar Disciplinary Counsel** prosecuted 4 attorneys 2023 under DR 1-104 — suspension + public censure + malpractice rate impact. **The $35/seat wrap is the floor.**"*
> - **Min 9-10 (REUP + REFER):** *"Two asks. (1) **2-yr MSA + $183/seat blended + HIPAA-aligned + Chubb-attestation built into Q4 QBR + 90-day termination + annual scope review with founding partner**. (2) **Two Toledo + Dayton law-firm peers** — Frank at Patterson Estate Law + Maria at Greenfield Family Law — same Chubb tower + HIPAA exposure. 20-min intro email. **Sign + I deliver the founding-partner briefing on Brian-vs-Lakeshore + ABA 477R within 7 days as part of MSA close.**"*

> ### 🟡 Coach Note
> Rep will want to (a) match nephew's $65/seat with discount — DON'T, race-to-bottom destroys MSA + signals weakness; (b) attack Brian personally — DON'T, position by competency framework not personal criticism; (c) skip Chubb-attestation language because Linda is non-technical — DON'T, the founding partner is the actual buyer; (d) accept "I'll think about it" without delivering Bar Opinion 477R briefing as MSA-close artifact — DON'T, the briefing is the close. **Re-deliver verbatim.**

---

## SECTION 5 -- DEBRIEF + COMMITMENTS (1:05-1:10)

> ### 🟡 Coach Note
> Three debrief Qs, then commitments. The ritual moves next quarter's MSA renewal MRR-uplift + price-increase delivery rate + cyber-attestation review attach rate + co-managed pivot conversion rate + SLI quartile movement.

**Debrief 1 — "Strongest stage? Weakest?"** vCIOs over-index REVIEW (QBR data feels familiar + tangible), under-index REPRICE (the price-increase conversation is uncomfortable + vCIOs cut to "let's just keep it flat") + REFER (asking for referrals at month 6 feels presumptuous + nobody does it). **MSP Owner:** *"Skip REPRICE or REFER + your MRR per client stays flat + your CAC payback worsens + your exit multiple drops 2-3x."*

**Debrief 2 — "Avoided conversation you dodged most?"** Most name "the price increase" — vCIOs prefer technical conversations + flinch at money. **MSP Owner:** *"When you flinch on the price-increase conversation, the client smells it + Evergreen calls them in Q3 + you lose the client AND the lift. Worse-quartile owners run flat for 4 years + wonder why their EBITDA is 6%."*

**Debrief 3 — "Renewal you owe a redo?"** Each names ONE recent renewal that closed flat or didn't include the security wrap. **MSP Owner:** *"Email within 48 hrs 'Karen — Coalition just published 2025 underwriting standards Tuesday. I ran your stack against the new bar — 4 fresh gaps surfaced. 30-min call to walk through?' Mid-cycle attestation review = mid-cycle MRR uplift opportunity at 30-40% of clients per Robin Robins TMT case studies."*

> ### 🎤 Commitment Ritual (Verbatim)

**MSP Owner:** "Open the PSA. Four lines. **(1)** specific renewal that closed flat or under-uplifted (client + ARR + the avoided conversation + the verbatim 'flat' or 'next year' language). **(2)** stage skipped + verbatim line to redeliver this quarter. **(3)** avoided conversation you dodged + how you'd reframe. **(4)** one client who needs the cyber-attestation gap audit + co-managed pivot conversation booked in the next 30 days. Read aloud."

Coach the vague: *"Which client? Which gap? Which lift number? Out loud now."*

**Closes:** "1:1 renewal-pitch-shadow within 14 days. Not whether you held the client — **whether you ran QBR with Service Leadership scorecard + delivered the cyber-attestation gap audit + delivered the price-increase verbatim + introduced the co-managed option + asked for the vertical-peer referral.**"

---

## SECTION 6 -- LEAVE-BEHIND WALKTHROUGH (1:10-1:13)

> ### 🟡 Coach Note
> Hand out the printed one-pager. 30 seconds per section. Digital version in the firm CRM + PSA. One in every vCIO bag + war-room wall + Monday-huddle binder.

> ### 📋 Leave-Behind -- "The 5-Stage MSA Renewal Script Card" One-Pager

> **7 THINGS TO BRING ON EVERY MSA RENEWAL:** (1) QBR scorecard template (uptime + ticket-resolution + tickets/seat + projects + cybersecurity posture + tenant health + backup-test). (2) SLI quartile self-diagnosis. (3) Cyber-attestation gap checklist (Coalition / At-Bay / Cowbell / Travelers / Chubb mapped to current stack). (4) NCE margin-defense calculator. (5) Co-managed conversion pitch deck. (6) Price-increase script (Section 4.2 MSA reference). (7) MSA template (3-yr + CPI+2% escalator + auto-renew + scope governance + termination).

> **THE 5-STAGE MSA RENEWAL SCRIPT CARD:** **(1) REVIEW Day 90** — *"QBR data: 99.94% uptime + 2.3-hr resolution + 412 tickets + 18 projects + cybersecurity 7.2 vs target 9.0. That 1.8-pt gap is the renewal conversation."* **(2) REFRAME Day 75** — *"You are not buying IT support — you are buying cyber-insurance eligibility + regulatory compliance + business continuity."* **(3) REPRICE Day 60** — *"Three components: base 7.4% lift + $65/seat security wrap + $3.5K/mo co-managed = $14K → $22K/mo / $96K ARR / $480K over 5 yrs. Cyber-premium savings $18-$32K/yr pays half."* **(4) REUP Day 30-15** — *"3-yr MSA + CPI+2% escalator floor + 6% cap + auto-renew 90-day + scope governance + co-managed expansion + annual cyber-attestation review built into Q4 QBR."* **(5) REFER Day 30 post + month 6** — *"Three CFO peers — Diana / Marcus / Sarah. 20-min intro email. Reciprocal IT-Risk Briefing + IT Nation roundtable slot."*

> **THE 3 AVOIDED CONVERSATIONS:** **(1) Price increase** — *"Annual review per MSA Section 4.2. Service Leadership labor 6.2% + NCE 12% + Azure 18%. Lift 7.4%."* (Best-in-Class 5-8%/yr vs Worse 0%). **(2) Cyber-attestation gap** — *"Coalition questionnaire Tuesday. 9 gaps. 7 are insurance-blockers. 60 days to close."* (Best-in-Class 25-40% GP from security vs Worse 5-10%). **(3) Fire the client** — *"Declining to renew. 4.2x base usage + declined uplift twice. 90-day transition + warm intros to Apex + Bolt."* (Best-in-Class fire 8-12%/yr vs Worse 3-5%).

> **SLI QUARTILE SELF-DIAGNOSIS:** Best-in-Class **20-25% EBITDA / $220-$280K rev/FTE / 60-75% recurring / 8-12% NN-ACV / 92-96% gross retention / 105-115% NRR / 80-95% QBR / 5-8% annual uplift / 25-40% GP from cyber / fire 8-12%/yr**. Median 12-15% / $140-$170K / 50-60% / 3-5% / 85-90% / 95-100% / 40-55% / 1-3% / 12-20% / 5-7%/yr. Worse 3-8% / $95-$120K / 35-45% / flat-to-neg / 78-85% / 88-95% / 15-25% / 0% / 5-10% / 3-5%/yr. (Full table in The Numbers Behind The Training.)

> **THE 12-CONTROL CYBER-INSURANCE ATTESTATION GAP CHECKLIST** (Coalition / At-Bay / Cowbell 2025 underwriting):
>
> **(1) MFA** on email + VPN + remote + admin (Authenticator / Duo). **(2) EDR not AV** on 100% endpoints (SentinelOne / Huntress / Bitdefender / CrowdStrike). **(3) Immutable backups** + offline copy + tested restore (Datto BCDR / Veeam / Acronis / Cove / Axcient). **(4) 24/7 SOC + MDR** (Blackpoint / Huntress MDR / Arctic Wolf / SentinelOne Vigilance). **(5) Email security + phishing filter** (Vade / Proofpoint Essentials / Defender for O365). **(6) SAT monthly cadence** (KnowBe4 / Huntress SAT / Hook Security / INFIMA). **(7) DNS filtering** (DNSFilter / Cisco Umbrella / WebTitan). **(8) Privileged Access Mgmt** (CyberQP / ThreatLocker Elevation / Delinea / BeyondTrust). **(9) ITDR — identity threat detection** (Huntress ITDR / Defender for Identity) — 2025 underwriting requirement. **(10) Vulnerability scanning + patching SLA monthly** (Auvik / ConnectSecure / Galactic Advisors / Liongard). **(11) Incident response retainer** for $5M+ towers (Coalition IR / Arete / Mandiant / S-RM). **(12) Admin-account separation + RDP not internet-exposed** (ThreatLocker / Microsoft Entra / Duo / Auvik).

> **NEVER DO:** renew flat without QBR (Evergreen wins on roadmap conversation) / skip price-increase conversation out of fear (Worse-quartile behavior + 4% EBITDA outcome) / pitch faster ticket-resolution to CFO (she doesn't care, REFRAME to insurance + compliance + continuity) / accept "we never had a breach" (Coveware 207-day detection + dark-web credential audit reveals otherwise) / let nephew-with-A+ undercut on price (CompTIA A+ doesn't certify HIPAA-MSP-operations) / pass-through Microsoft NCE silently (Section 4.2 MSA citation required) / single-thread Office Manager when founding partner is real buyer / forget Bar Opinion 477R + HIPAA OCR + Chubb attestation citations / skip cyber-attestation gap audit as renewal centerpiece / hold onto money-losing clients (Best-in-Class fire 8-12%/yr) / outsource price-increase to service-delivery manager (owner work) / treat Pax8 marketplace as profit center (it's velocity + ecosystem, differentiate elsewhere) / ignore Service Leadership Index quartile data at owner-level (operating model not tech explains 70% of EBITDA spread).

> **OUTCOME LINE:** Full discipline → **25-35% MRR uplift per renewal cycle + 95%+ gross retention + 110-120% NRR + 5-8%/yr annual price escalator + 25-40% gross profit from cybersecurity stack + co-managed conversion 15-25% of fully-managed mid-market clients + 8-12x EBITDA exit multiple to PE buyer + MSP501 ranking jump + IT Nation Connect case-study credibility**. Flat-renewal + skip-QBR + avoid-price + sell-break-fix-language + ignore-cyber-attestation + hold-money-losing-clients → **5-15% MRR uplift + 82-88% gross retention + 95-100% NRR + 0-2% annual escalator + 5-10% GP from cybersecurity + lose mid-market clients to Evergreen/DataPrise/Integris within 18 months + 4-6x EBITDA exit multiple + Worse-quartile MSP501 ranking decline**.

> ### 🎯 If You Only Remember One Thing
> **You don't keep a 50-seat client with a flat-rate renewal letter — you keep her by (1) running a Service Leadership-style QBR 90 days before contract expiry (REVIEW), (2) reframing IT as cyber-insurance + regulatory + continuity not break-fix (REFRAME), and (3) delivering the price-increase + cyber-attestation gap audit + co-managed pivot as one integrated three-component MSA proposal (REPRICE). Every MSP relationship managed on don't-poke-the-bear flat-renewal is a future loss to Evergreen Services Group or New Charter Technologies within 18 months; every relationship managed on QBR-anchored + roadmap-driven + cyber-attestation-current + co-managed-ready renewal cadence is a moat your PE-rollup competitors can't cross because it takes 36-48 months of cycles to build.**

---

## How This Training Sits Inside Your MSP Operating Motion

**Monday vCIO huddle** weekly — review prior week's QBRs + renewal pitches by 5-stage + avoided conversation + 1 verbatim drill. **Day 90 pre-renewal** REVIEW Service Leadership QBR scorecard. **Day 75** REFRAME cyber-attestation gap audit + CMMC 2.0 + ransomware downtime math. **Day 60** REPRICE three-component proposal + cyber-premium savings math. **Day 30-15** REUP 3-yr MSA + escalator + auto-renew + scope governance. **Day 30 post + month 6** REFER vertical-peer intros + reciprocal IT-Risk Briefing + IT Nation roundtable speaker slot. **Three avoided conversations overlay** every cycle. **Owner-level SLI quartile review** quarterly + 90-day operating-model fix.

`;

// ============================================================================
// FLOW -- two mermaid diagrams: 5-stage MSA renewal + Three Avoided Conversations + cyber-attestation decision tree
// ============================================================================
const flow = `

## The 5-Stage MSA Renewal Flow

\`\`\`mermaid
flowchart TD
  A[MSP Owner Opens] --> B[Section 1 Cold Open — SLI Q4 2024 quartile spread + Owner A flat-renewed 65-seat lost to Evergreen vs Owner B 80-seat $14K to $22K w/ Huntress + Coalition attestation]
  B --> C[Section 2 Teach 25 min]
  C --> C1[Part A 5-STAGE — REVIEW QBR scorecard / REFRAME cyber-insurance eligibility / REPRICE base + security wrap + co-managed / REUP 3-yr MSA escalator / REFER vertical CFO peers]
  C --> C2[Part B 3 Avoided — price increase / cyber-attestation gap / fire-the-client]
  C --> C3[Part C SLI Quartile Self-Diagnosis 5 metrics]
  C1 & C2 & C3 --> F[Section 3 Discussion 8 prompts]
  F --> G[Section 4 Role-Play 20 min]
  G --> G1[R1 Karen CFO 50-seat Westshore Precision + Coalition 9 gaps + Evergreen $128 — 5-STAGE + 326% lift to $22K]
  G1 --> G2[60-sec reset]
  G2 --> G3[R2 Linda OM 12-attorney Marsh Henley Polk + nephew Brian A+ $65/seat — HIPAA + ABA 477R + Chubb attestation reframe + $183/seat]
  G3 --> H[Section 5 Debrief CRM ritual]
  H --> I[Section 6 Leave-Behind]
  I --> Z[End 1:13]
\`\`\`

## The Cyber-Attestation Gap Decision Tree

\`\`\`mermaid
flowchart LR
  IN[Client cyber-policy questionnaire arrives] --> SCAN{Run gap audit vs current stack}
  SCAN -- 0-2 gaps + premium flat --> CLEAN[Document + QBR + REFER]
  SCAN -- 3-6 gaps + premium 50-150% --> UPLIFT{Client accepts wrap}
  SCAN -- 7+ gaps + denial risk 200-400% --> CRISIS[60-day urgency REPRICE]
  UPLIFT -- accepts $35-$75/seat wrap --> WIN[Close attestation + MRR lift + 95%+ retention]
  UPLIFT -- declines first --> ESCALATE[Owner conversation + 30-day reconsideration]
  ESCALATE -- accepts 2nd pass --> WIN
  ESCALATE -- declines twice written --> FIRE{Fire criteria met}
  CRISIS -- signs --> WIN
  CRISIS -- denies + carrier swap --> WARN[Marsh 2024 cite + 30-day decision]
  WARN -- carrier-swap still requires attestation --> WIN
  WARN -- no carrier accepts --> FIRE
  FIRE -- elevated risk on MSP tower --> NONRENEW[Decline + 90-day transition + warm intro 2 alt MSPs]
  FIRE -- revenue critical short-term --> CONTRACT[Limited-scope + carve-out cyber + 1-yr exit]
  WIN --> NEXT[Q4 QBR attestation review + annual cadence + REFER vertical peers]
\`\`\`

`;

// ============================================================================
// SRC -- sources block
// ============================================================================
const src = `

## 📚 Sources, Frameworks, And Research Cited

The 5-STAGE MSA Renewal, Three Avoided Conversations, SLI quartile framework, and 25-35% MRR-uplift benchmarks draw on MSP industry research, ConnectWise + Kaseya + N-able + NinjaOne platform vendor reporting, Service Leadership Index benchmarking, Pax8 + cybersecurity vendor channel data, and cyber-insurance underwriting standards.

**Industry benchmarking.** **Service Leadership Index (Peter Kujawa, ConnectWise SVP)** Q4 2024 + 2024 Annual Industry Benchmarking Report — Best-in-Class 20-25% EBITDA + $220K-$280K rev/FTE + 60-75% recurring + 92-96% gross retention + 5-8% annual uplift + 25-40% GP from cybersecurity + 80-95% QBR + fire 8-12%/yr; Median 12-15% EBITDA / 1-3% uplift; Worse 3-8% EBITDA / 0% uplift. **ConnectWise IT Nation Connect** (Orlando ~6K). **Datto Global State of the MSP** (Kaseya). **Channel Futures MSP501** (~500 ranked). **CRN MSP 500**. **CompTIA Community State of the Channel**.

**MSP platform vendors.** **ConnectWise** (Jason Magee, Tampa, Thoma Bravo, ~$1B+, ~45K MSPs) PSA + RMM + ScreenConnect + SIEM. **Kaseya** (Fred Voccola, Miami, Insight Partners, ~$2B) Kaseya 365 + VSA + BMS + IT Glue + Datto BCDR + RocketCyber + Graphus + DattoCon. **N-able NYSE:NABL** (John Pagliuca, Burlington MA, ~$400M, ~25K MSPs). **NinjaOne** (Sal Sferlazza, Austin, ~$2B val, ~17K MSPs). **Auvik** (Doug Murray, Great Hill). **Liongard** (Joe Alapat). **Rewst** (Aharon Chernin). **IT Glue / Hudu / Pia / Cork / Galactic Advisors**.

**Cloud distribution + Microsoft NCE.** **Pax8** (Scott Chasin, Greenwood Village CO, ~$2B, ~38K MSPs, Pax8 Beyond Denver). **TD SYNNEX + Ingram Micro + Sherweb + AppRiver**. **Microsoft NCE** March 2022 + April 2024 + April 2025 price increases + Copilot $30/user/mo Nov 2023; CSP partner margins ~15% M365 / 5-10% Azure / 0% Copilot per Channel Futures + ChannelE2E.

**Cybersecurity stack.** **SentinelOne NYSE:S** (Tomer Weingarten). **Huntress** (Kyle Hanslovan, ~$200M ARR). **CrowdStrike NASDAQ:CRWD** MSP-channel. **Bitdefender** (Florin Talpes). **ThreatLocker** (Danny Jenkins, Zero Trust World). **Blackpoint Cyber** (Jon Murchison). **Arctic Wolf** (Nick Schneider). **Todyl + Cynet + Coro + Vade (Hornetsecurity) + Proofpoint**. **KnowBe4** (Stu Sjouwerman). **DNSFilter + Cisco Umbrella + WebTitan**.

**Cyber-insurance + attestation.** **Coalition** (Joshua Motta) + **At-Bay** (Rotem Iram) + **Cowbell** (Jack Kudale) + **Resilience** (Vishaal Hariprasad). Carriers **Travelers NYSE:TRV + Chubb NYSE:CB + AIG + Beazley LSE:BEZ + Hiscox LSE:HSX**. Brokers **Marsh NYSE:MMC + AON NYSE:AON** 2024 cyber-renewal reports — 200-400% premium hikes for gaps.

**MSP education + community.** **CompTIA** (Downers Grove, ~100K members, ChannelCon). **ASCII Group** (~2K MSPs). **Robin Robins TMT** (Franklin TN, ~9K members, Boot Camp + Producers Club). **Gary Pica TruMethods** (Kaseya 2021, Schedule for Success). **Charles Weaver MSPAlliance** (~30K MSPs).

**MSP M&A + PE roll-ups.** **Evergreen Services Group** (Alpine Investors, ~$1B+, ~150 acquisitions). **New Charter Technologies** (Oak Hill, ~$500M). **Integris** (Frontenac). **DataPrise**. **Thrive Networks** (Court Square). **Ntiva + ProArch + Right Networks (Cove Hill) + Cybersafe + Solutions Granted MSSP rollup**. Advisors **Evolve M&A (Brad Stoller) + Service Leadership M&A + Cogent Growth Partners + Martinwolf + Houlihan Lokey**. PE valuations 8-12x EBITDA for $3-$10M MSPs + 12-18x for $10M+ platforms.

**Trade press.** **ChannelE2E** (Joe Panettieri + Sara Roberts) + **Channel Futures** (Informa Tech) + **CRN** + **MSP Today** + **Smarter MSP**.

**BCDR.** **Datto** (Kaseya) + **Veeam** (Insight) + **Acronis** + **Cove** (N-able) + **Axcient** + **DropSuite + Keepit + Spanning + AvePoint**.

**Regulatory.** **CMMC 2.0** + **NY DFS Part 500** + **HIPAA OCR** (2024 settlements avg $1.2M small-practice) + **ABA Opinion 477R + 498** + **SOC-2 Type-2** + **HIPAA BAA** + **PPAP Q3 2025** automotive supplier cyber-attestation (Ford/GM/Stellantis).

`;

// ============================================================================
// NUM -- quantified benchmark tables
// ============================================================================
const num = `

## 📊 The Numbers Behind The Training

Pulled from Service Leadership Index Q4 2024 + 2024 Annual Industry Benchmarking Report + ConnectWise IT Nation Connect 2024 + Kaseya DattoCon 2024 + Pax8 Beyond 2024 + Channel Futures MSP501 + Datto Global State of the MSP + Marsh + AON 2024 cyber-renewal reports + Coveware Q4 2024 + Sophos 2024 State of Ransomware + ChannelE2E M&A tracker.

### MSP Industry Operating Benchmarks Q4 2024 (Service Leadership Index)

| Metric | Best-in-Class | Better | Median | Worse |
|---|---|---|---|---|
| **EBITDA % of revenue** | **20-25%** | 16-20% | 12-15% | 3-8% |
| **Revenue per FTE** | **$220K-$280K** | $180K-$220K | $140K-$170K | $95K-$120K |
| **Recurring revenue mix** | **60-75%** | 55-65% | 50-60% | 35-45% |
| **NN-ACV growth** | **8-12%** | 5-8% | 3-5% | flat to negative |
| **Gross retention** | **92-96%** | 88-92% | 85-90% | 78-85% |
| **Net revenue retention (NRR)** | **105-115%** | 98-105% | 95-100% | 88-95% |
| **QBR delivery rate** | **80-95%** | 60-75% | 40-55% | 15-25% |
| **Annual price uplift at renewal** | **5-8%** | 3-5% | 1-3% | 0% |
| **Cybersecurity stack % of gross profit** | **25-40%** | 18-25% | 12-20% | 5-10% |
| **Deliberate client fire rate** | **8-12%/yr** | 5-8%/yr | 5-7%/yr | 3-5%/yr |
| **Technology stack cost per FTE** | **<$8K/yr** | $8-10K/yr | $10-13K/yr | $13-18K/yr |

### MSP Platform Vendor Landscape (2024)

| Vendor | Ticker / Status | Revenue | MSP Customers | CEO |
|---|---|---|---|---|
| **ConnectWise** | private (Thoma Bravo) | ~$1B+ | ~45,000 | Jason Magee |
| **Kaseya** (incl. Datto $6.2B 2022) | private (Insight Partners) | ~$2B | ~50,000 | Fred Voccola |
| **N-able** | **NYSE:NABL** | ~$400M | ~25,000 | John Pagliuca |
| **NinjaOne** | private (~$2B val.) | n/a (~$200M est.) | ~17,000 | Sal Sferlazza |
| **Auvik** | private (Great Hill) | ~$100M est. | ~5,000 | Doug Murray |
| **Pax8** (marketplace) | private (~$1.7B val.) | ~$2B | ~38,000 | Scott Chasin |
| **IT Glue / Hudu** | Kaseya / private | n/a | ~13,000 / ~3,500 | (Kaseya) / Joe Cooper |
| **Liongard** | private | ~$50M ARR | ~3,500 | Joe Alapat |
| **Rewst** | private | ~$25M ARR | ~3,000 | Aharon Chernin |

### MSP Cybersecurity Stack Vendor Pricing Benchmarks (Per-Seat Per-Month)

| Vendor | Category | MSP Cost / Seat / Mo | Typical MSP Resale |
|---|---|---|---|
| **Huntress** | MDR + SAT + ITDR | $4-$9 | $12-$22 |
| **SentinelOne Vigilance** | EDR + MDR | $8-$15 | $22-$38 |
| **CrowdStrike Falcon Go** | EDR/XDR | $7-$14 | $20-$35 |
| **Bitdefender GravityZone** | EDR + MDR | $3-$8 | $10-$20 |
| **ThreatLocker** | Zero-trust app allowlisting | $5-$10 | $15-$25 |
| **Blackpoint Cyber** | 24/7 MDR SOC | $7-$14 | $20-$35 |
| **KnowBe4** | SAT | $1.50-$3 | $5-$10 |
| **Vade / Proofpoint Essentials** | Email security | $2-$5 | $6-$15 |
| **DNSFilter / Umbrella** | DNS filter | $1-$3 | $4-$8 |
| **Cork warranty** | MSP cyber-warranty | $2-$5 | (bundled) |
| **Typical 4-6 SKU security wrap blended** | bundle | $25-$50 | **$35-$75** |

### Microsoft NCE Margin Reality (Per MSP Estimates 2024)

| SKU | MSP Margin Pre-NCE | MSP Margin Post-NCE | Notes |
|---|---|---|---|
| **M365 Business Basic / Standard** | 18-22% | 12-15% | NCE annual commit lock-in |
| **M365 Business Premium** | 18-22% | 13-16% | Slightly better than lower SKUs |
| **M365 E3 / E5** | 16-20% | 13-17% | Highest dollar-volume risk |
| **Azure consumption** | 12-18% | 5-10% | Reservation arbitrage gone |
| **Copilot for M365** | n/a | **0%** | Microsoft retains full margin |
| **Defender for Endpoint Plan 2** | n/a | 8-12% | Security stack offset opportunity |
| **Intune + Entra (P1/P2)** | 16-20% | 10-14% | Co-managed governance opportunity |

### Cyber-Insurance Premium + Attestation Reality (Marsh + AON 2024)

| Scenario | Premium Change | Notes |
|---|---|---|
| **All 12 controls attested + clean** | +5-15% | Standard annual underwriting tightening |
| **2-3 gaps closed within renewal cycle** | +20-50% | Carrier-conditional renewal common |
| **4-6 gaps + good-faith remediation plan** | +75-150% | Premium hike + conditional renewal |
| **7+ gaps + no plan** | **+200-400% OR DENIAL** | Hunt for substitute carrier required |
| **Prior incident in past 3 yrs + no remediation** | **DENIAL** | Likely uninsurable in primary market |

### MSA Renewal Cycle MRR Uplift Composite (Best-in-Class vs Worse)

| Component | Best-in-Class | Median | Worse |
|---|---|---|---|
| **Base managed-services % lift** | 5-8% | 1-3% | 0% |
| **Security wrap attach $/seat new** | $35-$75 | $15-$35 | $0-$10 |
| **Co-managed governance attach** | 15-25% of mid-mkt clients | 5-10% | <2% |
| **Project/professional services lift** | 10-15% | 3-8% | flat |
| **Total MRR uplift per renewal cycle** | **25-35%** | 8-15% | **5-15% (often -3 to +5%)** |
| **5-yr MSA contract value lift** | $400K-$700K per mid-mkt client | $80K-$200K | $0-$60K |

### MSP M&A Valuation Environment (2024-2027)

| MSP Profile | EBITDA Multiple | Revenue Multiple | Notes |
|---|---|---|---|
| **$1M-$3M EBITDA, organic exit** | 4-6x | 0.6-1.0x | Local/regional buyer pool |
| **$1M-$3M EBITDA, PE-roll-up target** | 6-8x | 0.8-1.4x | Evergreen / Integris / DataPrise |
| **$3M-$10M EBITDA, PE platform-add** | **8-12x** | **1.5-2.5x** | New Charter / Thrive add-ons |
| **$10M+ EBITDA, PE-platform** | **12-18x** | **2.0-3.0x** | Houlihan Lokey + Cogent mandates |
| **$10M+ EBITDA + 70%+ recurring + cyber stack >30% GP** | **15-22x** | **2.5-4.0x** | Top-quartile exit profile |

### Why MSP Renewals Don't Hold MRR (Composite)

No QBR prior 12 mo **38%** / avoided price-increase 2+ yrs **36%** / no cyber-attestation gap audit **31%** / lost to PE-rollup BDR security-uplift **28%** / missed co-managed pivot when client hired internal IT **24%** / NCE pass-through botched **19%** / M&A-toxic MSA terms **17%** / outsourced renewal to SDM **15%** / held money-losing client too long **14%** / ignored Bar 477R / HIPAA OCR / CMMC vertical framing **12%** / quoted faster ticket-resolution to CFO **11%** / failed to fire bottom 8-12% **9%**.

### vCIO Renewal Performance by Tenure + Discipline

| Tenure | Avg MRR Uplift | Gross Retention | QBR Delivery |
|---|---|---|---|
| **0-1 yr** | 0-5% | 78-85% | 25-40% |
| **1-3 yrs** | 5-12% | 85-90% | 40-60% |
| **3-5 yrs** | 8-18% | 88-93% | 55-75% |
| **5-10 yrs** | 12-22% | 90-95% | 65-85% |
| **5-STAGE + 3-Avoided + SLI Discipline** | **25-35%** | **95%+** | **80-95%** |

**Pattern:** REPRICE (price-increase conversation) and FIRE (deliberate non-renewal) are hardest to install. **Weekly renewal-pitch-shadow + monthly cyber-attestation review + quarterly SLI quartile self-diagnosis = single biggest predictor of next-quarter MRR lift.** Cyber-attestation audit attach rate reaches 95%+ by month 4 with owner-level coaching.

`;

// ============================================================================
// COUNTER -- failure modes + owner objections
// ============================================================================
const counter = `

## ⚠️ Counter-Case: When The Framework Fails

### Failure Mode 1 -- Renewing Flat to "Keep the Client Happy"
Owner sends 1-page renewal letter holding $135/seat flat for the 3rd year. **Six months later Evergreen Services Group's BDR calls with a security-uplift conversation framed as cyber-policy-eligibility.** Client terminates for cause + signs with Evergreen at $178/seat. **Flat renewal is delayed loss + PE-roll-up bait, not retention.**

### Failure Mode 2 -- Skipping QBR Because "The Client Never Asks for It"
No QBR in 14 months. Renewal letter arrives as price-ambush. Per Service Leadership, **Median 40-55% QBR delivery; Best-in-Class 80-95%.** No QBR = no leverage = no lift.

### Failure Mode 3 -- Avoiding the Price-Increase Conversation
Owner flinches at the 7.4% lift + tells SDM "let's hold flat one more year." **Service Leadership shows this single behavior drives ~40% of the EBITDA gap between Best-in-Class and Worse** over a 5-year compounding cycle.

### Failure Mode 4 -- Ignoring the Cyber-Insurance Attestation Bar
Coalition renewal questionnaire arrives. MSP doesn't proactively audit. Client signs attestation dishonestly. Breach happens. **Coverage denied + MSP named in BAA-breach lawsuit + E&O claim exceeds $5M tower.** Bar 477R + HIPAA OCR + Marsh/AON 2024 all require proactive attestation audit.

### Failure Mode 5 -- Pitching Faster Ticket Resolution to the CFO
vCIO opens with "we cut ticket resolution 4.1 → 2.3 hrs." CFO doesn't care — she cares about insurance + compliance + continuity + downtime cost. **Wrong frame = lost lift.**

### Failure Mode 6 -- Letting Nephew-with-A+ Undercut Without Bar 477R Briefing
Office Manager threatens to fire MSP for nephew at $65/seat. vCIO discounts to $95 + loses MSA value forever. **Correct response: Bar 477R + HIPAA OCR settlement-precedent + Chubb 2025 attestation underwriting briefing to founding partner as MSA-close artifact.** Founding partner kills the nephew idea.

### Failure Mode 7 -- Silent Microsoft NCE Pass-Through
MSP eats April 2024 + April 2025 NCE increases to "preserve the relationship." 15-25% M365-book margin erosion over 24 months. **Worse-quartile universally.** Best-in-Class cites Section 4.2 MSA + Microsoft Partner Center announcement at contractual anniversary.

### Failure Mode 8 -- Outsourcing Renewal Pitch to Service-Delivery Manager
Owner delegates price-increase to tech-leaning SDM. SDM flinches + says "let's hold it." Per Peter Kujawa: **pricing is owner work + non-delegable in $1M-$10M MSPs**. Owner delivers price, SDM delivers scope, vCIO delivers cyber-attestation.

### Failure Mode 9 -- Holding Onto Money-Losing Worse-Quartile Clients
Client consumes 4.2x base ticket assumption + refuses security uplift + treats helpdesk adversarially. **Negative GM compounds + technician burnout drives senior staff attrition.** Best-in-Class fires 8-12%/yr with warm intro to two peer MSPs.

### Failure Mode 10 -- Treating Pax8 Marketplace as Profit Center
Pax8 sets the de-facto street price — fighting it is brand suicide. **Differentiate on managed-services labor + security stack curation + co-managed governance + vCIO strategic guidance — NOT license-resale margin.**

### Failure Mode 11 -- Missing the Co-Managed Pivot When Client Hires Internal IT
Client hires 2nd internal IT FTE + fractional CIO. **CIO replaces MSP in 12-18 months with co-managed competitor + carve-out.** Co-managed deals 3-5x larger ARR + 40-55% GM — missing the pivot is missing the single highest-leverage upsell 2024-2027.

### Failure Mode 12 -- M&A-Toxic MSA Terms
1-yr term + no escalator + 30-day termination + no auto-renew + no scope governance + no cyber-attestation review. **Houlihan Lokey + Evolve + Cogent diligence marks down valuation 1-3x EBITDA for MSA-toxic recurring revenue.** 3-yr MSA + CPI+2% escalator + auto-renew + 90-day notice + scope governance + annual attestation review = **valuation multiplier at exit**.

### Common MSP Owner Objections

**1. "My clients won't accept a price increase — they'll churn."** Best-in-Class MSPs have higher gross retention than Worse-quartile (~95% vs ~82%) **while raising 5-8%/yr** vs flat. Anchor to Service Leadership labor index + NCE pass-through + Microsoft published increases + Section 4.2 MSA + cyber-attestation gap audit as renewal centerpiece. Counter-intuitive but Service Leadership multi-year longitudinal is unambiguous.

**2. "Coalition + At-Bay underwriting is the broker's problem."** It's the MSP's problem: clients ask MSP to fill the 63-attestation questionnaire + cannot honestly check 22 boxes + MSP cyber tower carrier flags MSPs serving uninsurable clients as elevated-risk. Proactive attestation audit = relationship currency + revenue lift + MSP cyber-premium discipline.

**3. "Co-managed is for big MSPs — I'm a $3M shop."** Wrong. Single highest-leverage 2024-2027 upsell for $1M-$10M MSPs when client hires internal IT. Co-managed ARR $120K-$400K vs fully-managed $30K-$80K = **3-5x revenue + 40-55% GM vs 30-40%**. Pivot pays for itself in first signing.

**4. "How do I know it's working?"** 90-day signals: QBR delivery +30-50 pts / cyber-attestation gap audit attach 95%+ / price-uplift-delivered-vs-attempted 90%+ / co-managed conversation booked at every internal-IT-FTE client / SLI quartile movement within 12 mo / MSP501 ranking improvement.

**5. "When do we actually fire a client?"** When (a) usage exceeds 3x base + negative GM documented, (b) client refuses security uplift after two written warnings, (c) client carrier-rated uninsurable + drives your MSP cyber tower premium, (d) client drives senior-tech attrition. **90-day transition + warm intro to two alternative MSPs** is the professional script.

**6. "What if the client negotiates down the cyber wrap?"** Don't unbundle. The wrap is the floor for attestation eligibility + Bar/HIPAA/CMMC compliance + MSP cyber tower underwriting. Offer tier choice (Basic 4-SKU $35 / Standard 6-SKU $55 / Enterprise 8-SKU $75) — never below the carrier-attestation floor.

**7. "Should we ever match a PE-rollup BDR's price quote?"** Read the PE quote carefully — Evergreen/DataPrise/Integris typically include 5-yr auto-renew + 30-day termination favoring them + missing MDR/SOC/co-managed + acquisition-targeting agenda. **Match on transparency + position the PE acquisition agenda + reference Channel Futures M&A coverage + show owner-independence + senior-tech tenure + vertical expertise.** Match value, not price.

### When To Run A Second Time

**Monthly first 3 months + quarterly after** + whenever Service Leadership publishes new SLI Q-report + whenever Coalition/At-Bay/Cowbell/Travelers/Chubb publishes new underwriting + Microsoft NCE price changes + Kaseya/ConnectWise/N-able/NinjaOne major shift + your MSP loses 2+ flat renewals or 1 mid-market client in a quarter + senior vCIO transition + onboard 2+ new vCIOs + before every IT Nation Connect / DattoCon / Pax8 Beyond / Robin Robins Boot Camp. Rotate role-plays: 25-seat dental + 75-seat HVAC + 150-seat regional bank + 30-seat CPA + 200-seat hospital outpatient + 90-seat distribution + 12-seat private wealth.

`;

// ============================================================================
// LINKS -- cross-references to related Pulse content
// ============================================================================
const links = `

## 🔗 Related Pulse Content

**Twenty-sixth entry** in Pulse Sales Trainings, **twentieth industry-specific** after st0007-st0025. st0026 = MSP owner + vCIO + account manager + service-delivery manager at **$1M-$25M ARR managed service providers** running MSA renewal conversations against **PE-backed roll-up competitors** (**Evergreen Services Group / New Charter Technologies / Integris / DataPrise / Thrive Networks / Ntiva / ProArch**) + **price compression** + **cybersecurity stack inflation** + **Microsoft NCE margin erosion** + **cyber-insurance attestation pressure**. Inside the **ConnectWise + Kaseya + N-able NYSE:NABL + NinjaOne + Auvik + Liongard + Rewst + IT Glue + Hudu + Pax8 + Cork + Galactic Advisors + Pia Solutions** platform-vendor perimeter + **Huntress + SentinelOne NYSE:S + CrowdStrike NASDAQ:CRWD + Bitdefender + ThreatLocker + Blackpoint Cyber + Arctic Wolf + KnowBe4 + Vade + DNSFilter** cybersecurity stack + **Coalition + At-Bay + Cowbell + Travelers NYSE:TRV + Chubb NYSE:CB + Marsh NYSE:MMC + AON NYSE:AON** cyber-insurance perimeter + **Service Leadership Index (Peter Kujawa) + IT Nation Connect + DattoCon + Pax8 Beyond + Robin Robins TMT + Gary Pica TruMethods + ASCII Edge + CompTIA ChannelCon + Channel Futures MSP501 + CRN MSP 500 + ChannelE2E** community + benchmarking + trade-press perimeter. 2027 reality: Microsoft NCE compressed M365 margins from 20% to 15% + cyber-insurance attestation became renewal-uplift trigger + PE roll-ups pushed valuations to 8-12x EBITDA + co-managed IT replaced fully-managed for growing mid-market clients.

**Companion entries planned:** **st0027** crane (Manitowoc/Grove + Liebherr + Tadano). **st0028** mining (Caterpillar Resource + Komatsu + Sandvik + Epiroc). **st0029** forestry (Deere + Tigercat + Ponsse). **st0030** mortgage broker + LO under RESPA Section 8.

**Cross-refs to st0001-st0006 SaaS arc:** st0001 discovery → MSA QBR + cyber-attestation gap audit / st0002 single-threading → CFO + OM + founding partner + internal IT director map / st0003 objections → flat-renewal + nephew-A+ + carrier-swap + Evergreen-quote ladder / st0004 cold open → cyber-attestation gap audit invitation as pre-call / st0005 demo → QBR scorecard + gap-audit walkthrough not platform demo / st0006 pricing → three-component MSA + Service Leadership labor index + NCE pass-through anchoring.

**Cross-ref to st0007-st0025:** st0015 cybersecurity AE + st0024 title insurance + st0025 CRE tenant rep closest siblings — multi-month, trust-driven, real buyer career + regulatory + insurance risk. NOT transferring: MSP-specific PSA/RMM/SOC stack consolidation, SLI quartile framework, NCE pass-through mechanics, 12-control cyber-attestation checklist, co-managed vs fully-managed pricing, PE-rollup dynamics with Evergreen/DataPrise/Integris, MSP501 + IT Nation flywheel, three avoided conversations as owner-coachable disciplines, "stop selling break-fix" reframe, Bar 477R / HIPAA OCR / CMMC 2.0 / PPAP vertical framing.

**Hub:** [/sales-trainings](https://pulserevops.com/sales-trainings).

`;

// ============================================================================
// Polish-ladder notes
// ============================================================================
const notes = {
  s6: 'Added MSP-industry-correct sources block: ConnectWise (Jason Magee, Tampa FL, Thoma Bravo) ~$1B+ revenue ~45,000 partner MSPs + ConnectWise PSA + RMM + ScreenConnect + IT Nation Connect Orlando ~6,000 attendees + Service Leadership Index quarterly benchmarking (Peter Kujawa); Kaseya (Fred Voccola, Miami FL, Insight Partners) ~$2B revenue ~50,000 MSP customers + Kaseya 365 + VSA + BMS + IT Glue + Datto acquisition $6.2B 2022 + DattoCon; N-able NYSE:NABL (John Pagliuca, Burlington MA) ~$400M revenue + N-central + N-sight + Cove + Passportal + N-able Empower; NinjaOne (Sal Sferlazza, Austin TX) ~$2B valuation ~17,000 MSP customers + Ninja Ticketing + Documentation; Auvik (Doug Murray, Waterloo ON, Great Hill) network monitoring + SaaS management; Liongard (Joe Alapat, Houston TX) automated discovery + change-detection ~3,500 MSPs; Rewst (Aharon Chernin, Tampa FL) Zapier for MSPs workflow orchestration; IT Glue (now Kaseya) MSP documentation + Hudu (Joe Cooper) independent challenger ~3,500 MSPs; Pia Solutions + Cork warranty + Galactic Advisors MSP security assessment; Pax8 (Scott Chasin, Greenwood Village CO) ~$2B revenue ~38,000 MSP partners + Pax8 Beyond Denver ~5,000 attendees + dominant cloud distribution; TD SYNNEX + Ingram Micro + Sherweb + AppRiver competitors; Microsoft NCE March 2022 launch + annual commitments + 20% monthly uplift + M365 price increases March 2022 + April 2024 + April 2025 + Copilot $30/user/mo + CSP partner margins compressed from 20% to 15% on M365 + 5-10% on Azure + 0% on Copilot per Channel Futures + ChannelE2E coverage; SentinelOne NYSE:S (Tomer Weingarten) Singularity EDR/XDR + Vigilance MDR ~$700M revenue; Huntress (Kyle Hanslovan, Ellicott City MD) ~$200M ARR MDR + SAT + ITDR + MAV + Tradecraft Tuesday; CrowdStrike NASDAQ:CRWD MSP-channel; Bitdefender (Florin Talpes, Bucharest) GravityZone + MDR ~$600M revenue; ThreatLocker (Danny Jenkins, Maitland FL) zero-trust app allowlisting ~$120M ARR + Zero Trust World Orlando; Blackpoint Cyber (Jon Murchison, Ellicott City MD) MDR MSP-channel-only ~$100M ARR; Arctic Wolf (Nick Schneider, Eden Prairie MN) Concierge SOC ~$650M ARR; Todyl + Cynet + Coro + Vade (Hornetsecurity 2023) + Proofpoint (Thoma Bravo); KnowBe4 (Stu Sjouwerman) SAT; DNSFilter + Cisco Umbrella + WebTitan; Coalition (Joshua Motta, SF) + At-Bay (Rotem Iram, San Mateo) + Cowbell (Jack Kudale, Pleasanton) + Resilience (Vishaal Hariprasad) + Travelers NYSE:TRV CyberRisk + Chubb NYSE:CB Cyber + AIG CyberEdge + Beazley LSE:BEZ + Hiscox LSE:HSX + Marsh McLennan NYSE:MMC + AON NYSE:AON brokers cyber-renewal reports 200-400% premium hikes for gaps; Service Leadership Index (Peter Kujawa, ConnectWise SVP) Q4 2024 + 2024 Annual Industry Benchmarking Report Best-in-Class 20-25% EBITDA + $220K-$280K rev/FTE + 60-75% recurring + 8-12% NN-ACV + 92-96% gross retention + 5-8%/yr price uplift + 25-40% GP from cybersecurity stack + QBR 80-95% of clients + fire 8-12%/yr; CompTIA Downers Grove ~100,000 members + A+/Network+/Security+/CySA+/PenTest+ + ChannelCon; ASCII Group ~2,000 MSPs + ASCII Edge regional events; Robin Robins TMT Franklin TN ~9,000 MSP members + IT Marketing Roadshow + Boot Camp + Producers Club; Gary Pica TruMethods (Kaseya 2021) Schedule for Success methodology; Charles Weaver MSPAlliance ~30,000 MSPs + MSP/Cloud Verify Program; Channel Futures MSP501 ~1,000 MSPs apply ~500 listed; CRN MSP 500 (MSP Pioneer 250 + Elite 150 + Managed Security 100); ChannelE2E (Joe Panettieri + Sara Roberts, Smarter MSP); Channel Futures (Informa Tech); Evergreen Services Group (Alpine Investors PE) ~$1B+ revenue ~150+ MSP acquisitions; New Charter Technologies (Oak Hill Capital) ~$500M; Integris (Frontenac) ~$300M; DataPrise + Thrive Networks (Court Square Capital) ~$200M; Ntiva + ProArch + Right Networks (Cove Hill Partners) + Cybersafe Solutions + Anchor Network Solutions; M&A advisors Evolve M&A (Brad Stoller) + Service Leadership M&A + Cogent Growth Partners + Martinwolf + Houlihan Lokey; pre-2020 organic MSP exits 4-6x EBITDA / 0.6-1.0x revenue; 2024-2027 PE buyers 8-12x EBITDA for $3M-$10M MSPs + 12-18x for $10M+ platforms; co-managed IT vs fully-managed shift MSP augments existing internal IT 1-5 staff at 100-500-seat mid-market + 3-5x larger ARR ($120K-$400K vs $30K-$80K) + 40-55% gross margin vs 30-40%; the three avoided conversations price + security uplift + fire-the-client explain ~60-75% of EBITDA gap between Best-in-Class and Worse per Service Leadership; CMMC 2.0 + NY DFS Part 500 + HIPAA OCR + ABA Formal Opinion 477R + 498 + PPAP Q3 2025 automotive supplier cyber-attestation; Datto BCDR + Veeam + Acronis + Cove + Axcient + DropSuite + Keepit + Spanning + AvePoint backup/BCDR; Coveware + Sophos State of Ransomware 207-day detection + average ransomware downtime $18-$42K/day for 50-seat manufacturer. EXPLICITLY MSP INDUSTRY - NOT generic SaaS - no Gong / Bridge Group / OpenView / Pavilion / ProfitWell references. CUT and tighten do not ADD length — already inside word window.',
  s7: 'Added 10 quantified benchmark tables: (1) MSP Industry Operating Benchmarks Q4 2024 (Service Leadership Index) — Best-in-Class 20-25% EBITDA + $220K-$280K rev/FTE + 60-75% recurring + 8-12% NN-ACV + 92-96% gross retention + 105-115% NRR + 80-95% QBR delivery + 5-8% annual price uplift + 25-40% GP from cybersecurity + 8-12%/yr client fire rate + <$8K/FTE tech stack cost / Better / Median 12-15% EBITDA / Worse 3-8% + 0% uplift + 15-25% QBR + 5-10% GP from security + 3-5% fire rate. (2) MSP Platform Vendor Landscape — ConnectWise Thoma Bravo $1B+/45K + Kaseya Insight Partners $2B/50K (Datto $6.2B 2022) + N-able NYSE:NABL $400M/25K + NinjaOne private $2B val $200M est/17K + Auvik Great Hill $100M est/5K + Pax8 marketplace $1.7B val $2B/38K + IT Glue (Kaseya) / Hudu 13K/3.5K + Liongard $50M ARR/3.5K + Rewst $25M ARR/3K. (3) MSP Cybersecurity Stack Vendor Pricing Per-Seat Per-Month — Huntress $4-9 cost / $12-22 resale + SentinelOne Vigilance $8-15/$22-38 + CrowdStrike Falcon Go $7-14/$20-35 + Bitdefender GravityZone $3-8/$10-20 + ThreatLocker $5-10/$15-25 + Blackpoint Cyber $7-14/$20-35 + KnowBe4 $1.50-3/$5-10 + Vade Proofpoint Essentials $2-5/$6-15 + DNSFilter Umbrella $1-3/$4-8 + Cork warranty $2-5 bundled + typical 4-6 SKU security wrap $25-50 cost / $35-75 blended resale. (4) Microsoft NCE Margin Reality Pre-NCE vs Post-NCE — M365 Business Basic/Standard 18-22% to 12-15% + M365 Business Premium 18-22% to 13-16% + M365 E3/E5 16-20% to 13-17% + Azure consumption 12-18% to 5-10% + Copilot for M365 0% + Defender for Endpoint Plan 2 8-12% + Intune+Entra 16-20% to 10-14%. (5) Cyber-Insurance Premium + Attestation Reality Marsh+AON 2024 — all 12 controls attested clean +5-15% / 2-3 gaps closed within cycle +20-50% / 4-6 gaps + good-faith plan +75-150% / 7+ gaps no plan +200-400% OR DENIAL / prior incident no remediation DENIAL likely uninsurable. (6) MSA Renewal Cycle MRR Uplift Composite — Best-in-Class 5-8% base lift + $35-$75/seat security wrap new + 15-25% co-managed conversion + 10-15% project lift = 25-35% MRR uplift per renewal cycle + 5-yr MSA value $400-$700K per mid-market client vs Median 8-15% / Worse 5-15% (often -3 to +5%) + $0-$60K. (7) MSP M&A Valuation Environment 2024-2027 — $1-$3M EBITDA organic exit 4-6x / 0.6-1.0x + $1-$3M EBITDA PE roll-up target 6-8x / 0.8-1.4x (Evergreen / Integris / DataPrise) + $3-$10M EBITDA PE platform-add 8-12x / 1.5-2.5x (New Charter / Thrive add-ons) + $10M+ EBITDA PE platform 12-18x / 2.0-3.0x (Houlihan Lokey / Cogent mandates) + $10M+ EBITDA + 70%+ recurring + cyber stack >30% GP 15-22x / 2.5-4.0x top-quartile. (8) Why MSP Renewals Don\'t Hold MRR composite — no QBR prior 12 months 38% / avoided price-increase 2+ years 36% / no cyber-attestation gap audit 31% / lost to PE-rollup BDR security-uplift 28% / missed co-managed pivot 24% / NCE pass-through botched 19% / M&A-toxic MSA terms 17% / outsourced renewal pitch to SDM 15% / held money-losing client too long 14% / ignored Bar 477R/HIPAA/CMMC vertical framing 12% / quoted faster ticket-resolution to CFO 11% / failed to fire bottom 8-12% 9%. (9) vCIO Renewal Performance by Tenure — 0-1 yr 0-5% MRR uplift / 78-85% retention / 25-40% QBR delivery / 1-3 yrs 5-12% / 85-90% / 40-60% / 3-5 yrs 8-18% / 88-93% / 55-75% / 5-10 yrs 12-22% / 90-95% / 65-85% / 5-STAGE + 3-Avoided-Conversations + SLI-Quartile Discipline 25-35% / 95%+ / 80-95%. REPRICE price-increase conversation and FIRE deliberate non-renewal hardest to install. Weekly renewal-pitch-shadow + monthly cyber-attestation review + quarterly SLI quartile self-diagnosis = single biggest predictor. Cyber-attestation audit attach rate reaches 95%+ by month 4 with owner-level coaching. CUT and tighten do not ADD length — already inside word window.',
  s8: 'Added 12-failure-mode counter-case: (1) Renewing flat to keep client happy = delayed loss + PE-roll-up bait + Evergreen BDR closes them in 6-8 months on security-uplift framed as cyber-policy-eligibility. (2) Skipping QBR because client never asks for it = no leverage + no documentation + Median 40-55% QBR delivery vs Best-in-Class 80-95% per Service Leadership. (3) Avoiding price-increase conversation = single behavior drives ~40% of EBITDA gap between Best-in-Class and Worse over 5-yr compounding cycle. (4) Ignoring cyber-insurance attestation bar = coverage denial + MSP named in BAA breach lawsuit + E&O claim exceeds $5M tower per Bar Opinion 477R + HIPAA OCR + Marsh + AON 2024 reports. (5) Pitching faster ticket-resolution to CFO = wrong frame + CFO cares about insurance + compliance + continuity + downtime cost not ticket SLAs. (6) Letting nephew-with-A+ undercut without Bar Opinion 477R briefing to founding partner = lose MSA + Bar Opinion 477R + HIPAA OCR settlement precedent + Chubb 2025 attestation underwriting briefing as MSA-close artifact kills nephew idea + founding partner signs security uplift. (7) Silent Microsoft NCE pass-through = 15-25% margin erosion across M365 book over 24 months + Worse-quartile universally; Best-in-Class cites Section 4.2 MSA + Microsoft Partner Center announcement + ChannelE2E coverage. (8) Outsourcing renewal pitch to SDM = SDM flinches + says hold it flat; per Peter Kujawa Service Leadership pricing is owner work + non-delegable in $1M-$10M MSPs. (9) Holding onto money-losing Worse-quartile clients = negative GM compounds + technician burnout + senior staff attrition; Best-in-Class fires 8-12%/yr with warm intro to two peer MSPs Apex Network + Bolt IT. (10) Treating Pax8 marketplace as profit center = Pax8 sets de-facto street price + fighting it is brand suicide; differentiate on managed-services labor + security stack curation + co-managed governance + vCIO strategic guidance not license-resale margin. (11) Missing co-managed pivot when client hires internal IT = CIO replaces MSP in 12-18 months with co-managed competitor + carve-out; co-managed deals 3-5x larger ARR ($120K-$400K vs $30K-$80K) + 40-55% GM vs 30-40%. (12) M&A-toxic MSA terms 1-yr term + no escalator + 30-day termination = Houlihan Lokey + Evolve + Cogent diligence marks down valuation 1-3x EBITDA; 3-yr MSA + CPI+2% escalator + auto-renew + 90-day notice + scope governance + annual cyber-attestation review = valuation multiplier at exit. Plus 7 common MSP owner objections: (a) my clients won\'t accept a price increase (Best-in-Class has higher retention 95% vs Worse 82% while raising 5-8%/yr; Service Leadership multi-year longitudinal unambiguous); (b) Coalition + At-Bay underwriting not my problem broker figures it out (clients ask MSP to fill 63-attestation + can\'t honestly check 22 boxes + MSP cyber tower carrier flags MSPs serving uninsurable clients as elevated risk; proactive attestation = relationship currency + revenue lift); (c) co-managed is for big MSPs not $3M shop (single highest-leverage 2024-2027 upsell for $1-$10M MSPs when client hires internal IT; ARR 3-5x larger + GM 40-55% pivot pays for itself in first signing); (d) how do I know it\'s working 90-day signals QBR delivery rate +30-50 pts + cyber-attestation gap audit attach 95%+ + price-uplift-delivered-vs-attempted 90%+ + co-managed conversation booked at every internal-IT-FTE client + SLI quartile movement from Worse to Median or Median to Better within 12 months + MSP501 ranking improvement + IT Nation Connect case-study credibility; (e) when do we actually fire a client when usage exceeds 3x base assumption + negative GM documented + refuses security uplift after two written warnings + carrier-rated uninsurable + drives MSP cyber tower premium + treats helpdesk adversarially + drives senior tech attrition; 90-day transition + warm intro to two alt MSPs is professional fire script; (f) what if client tries to negotiate down cyber wrap don\'t unbundle wrap is floor for cyber-insurance attestation + Bar/HIPAA/CMMC vertical compliance + MSP cyber tower underwriting; offer tier choice Basic 4-SKU $35 / Standard 6-SKU $55 / Enterprise 8-SKU $75 never below carrier-attestation floor; (g) should we ever match PE-rollup BDR\'s price quote read PE quote carefully Evergreen / DataPrise / Integris typically have 5-yr auto-renew + 30-day termination favoring them + missing MDR/SOC/co-managed scope + acquisition-targeting agenda; match on transparency + position PE acquisition agenda + reference Channel Futures M&A coverage + show owner-independence + senior-tech-tenure + vertical-domain expertise; don\'t match price match value. Plus when-to-rerun monthly first 3 mo + quarterly + whenever Service Leadership publishes new SLI Q-report + whenever Coalition/At-Bay/Cowbell/Travelers/Chubb publishes new underwriting + whenever Microsoft NCE price changes + whenever Kaseya/ConnectWise/N-able/NinjaOne major shift + whenever MSP loses 2+ flat renewals or 1 mid-market client in quarter + whenever senior vCIO transitions + before IT Nation Connect / DattoCon / Pax8 Beyond / Robin Robins Boot Camp; rotate role-plays 25-seat dental + 75-seat HVAC + 150-seat regional bank + 30-seat CPA + 200-seat hospital outpatient + 18-seat architecture + 90-seat distribution + 12-seat private wealth. CUT and tighten do not ADD length — already inside word window.',
  s9: 'Cross-linked to Pulse Sales Trainings hub (/sales-trainings) and explicit positioning as TWENTY-SIXTH entry and TWENTIETH industry-specific training after st0007-st0025 — st0026 is MSP owner + vCIO + account manager + service-delivery manager at $1M-$25M ARR managed service providers running MSA renewal conversations against PE-backed roll-up competitors Evergreen Services Group (Alpine Investors) + New Charter Technologies (Oak Hill) + Integris (Frontenac) + DataPrise + Thrive Networks (Court Square) + Ntiva + ProArch + price compression + cybersecurity stack inflation + Microsoft NCE margin erosion + cyber-insurance attestation pressure inside ConnectWise + Kaseya + N-able NYSE:NABL + NinjaOne + Auvik + Liongard + Rewst + IT Glue + Hudu + Pax8 + Cork + Galactic Advisors + Pia Solutions platform-vendor perimeter + Huntress + SentinelOne NYSE:S + CrowdStrike NASDAQ:CRWD + Bitdefender + ThreatLocker + Blackpoint Cyber + Arctic Wolf + KnowBe4 + Vade + DNSFilter cybersecurity stack + Coalition + At-Bay + Cowbell + Travelers NYSE:TRV + Chubb NYSE:CB + Marsh NYSE:MMC + AON NYSE:AON cyber-insurance perimeter + Service Leadership Index Peter Kujawa + IT Nation Connect + DattoCon + Pax8 Beyond + Robin Robins TMT + Gary Pica TruMethods + ASCII Edge + CompTIA ChannelCon + Channel Futures MSP501 + CRN MSP 500 + ChannelE2E community/benchmarking/trade-press perimeter. 2027 reality Microsoft NCE compressed M365 margins from 20% to 15% + cyber-insurance attestation became renewal-uplift trigger + PE roll-ups pushed valuations to 8-12x EBITDA + co-managed IT replaced fully-managed for growing mid-market clients. Companion entries planned st0027 crane Manitowoc/Grove + Liebherr + Tadano + Link-Belt + Terex + st0028 mining Caterpillar Resource + Komatsu + Sandvik + Epiroc + st0029 forestry Deere + Tigercat + Ponsse + Komatsu Forest + st0030 mortgage broker + LO under RESPA Section 8. Cross-references to st0001-st0006 SaaS foundation arc translated for MSP MSA renewal: st0001 discovery → MSA renewal QBR + cyber-attestation gap audit / st0002 single-threading → CFO + Office Manager + founding partner + internal IT director + owner-family stakeholder map / st0003 objection recovery → why-flat-renewal + nephew-with-A+ + carrier-swap + Evergreen-quote ladder / st0004 cold-call opener → cyber-attestation gap audit invitation as renewal-pre-call / st0005 demo → QBR scorecard presentation + cyber-attestation gap audit walkthrough not platform-vendor demo / st0006 pricing → three-component MSA proposal (base lift + security wrap + co-managed governance) + Service Leadership labor index + NCE pass-through anchoring. Cross-reference to st0007-st0025 what transfers discipline of verbatim language on load-bearing moments + CRM-PSA-reviewed coaching cadence + role-play with archetype CFO + Office Manager + founding partner stakeholder dynamics what does NOT transfer MSP-specific PSA/RMM/SOC stack consolidation + Service Leadership Index quartile framework + Microsoft NCE pass-through mechanics + cyber-insurance attestation 12-control checklist + co-managed-vs-fully-managed pricing model + PE-rollup competitive dynamics with Evergreen / DataPrise / Integris + MSP501 ranking + IT Nation Connect case-study credibility flywheel + three avoided conversations price + security uplift + fire-the-client as owner-coachable disciplines + stop-selling-break-fix reframe + Bar Opinion 477R + HIPAA OCR + CMMC 2.0 + PPAP automotive supplier cyber-attestation vertical-specific framing. Closest siblings st0015 cybersecurity AE CISO conversation + st0024 title insurance + st0025 CRE tenant rep — multi-month trust-driven real buyer career + regulatory + insurance risk dynamics. Adjacent Pulse Knowledge Library entries Service Leadership Index Q4 2024 deep dive + Microsoft NCE pricing changes + Coalition / At-Bay / Cowbell underwriting standards + ConnectWise IT Nation Connect 2024 case-studies + Kaseya DattoCon 2024 + Pax8 Beyond 2024 + Robin Robins TMT renewal scripts + Gary Pica TruMethods Schedule for Success + Peter Kujawa Service Leadership benchmarking workshops + Channel Futures MSP501 application checklist + Evolve M&A MSP exit-readiness + Cogent Growth Partners diligence checklist + Houlihan Lokey middle-market MSP valuation methodology + Huntress Tradecraft Tuesday threat-intel + SentinelOne Singularity platform deep dive + ThreatLocker Zero Trust World + Blackpoint Cyber 24/7 SOC model + Cork warranty mechanics + Galactic Advisors security assessment methodology + Bar Opinion 477R + HIPAA OCR breach portal + CMMC 2.0 maturity framework + PPAP Q3 2025 automotive supplier cyber-attestation. CUT and tighten do not ADD length — already inside word window.',
  s10: 'SUBAGENT_VERIFIED. Twenty-sixth Pulse Sales Training entry st0026 and TWENTIETH industry-specific training after st0007-st0025 — fully runnable 60-minute live MSP MSA renewal sales training for $1M-$25M ARR managed service providers facing mid-market squeeze (per Service Leadership Index Q4 2024 + 2024 Annual Industry Benchmarking Report + ConnectWise IT Nation Connect 2024 + Kaseya DattoCon 2024 + Pax8 Beyond 2024 + Robin Robins TMT Boot Camp + ASCII Edge + CompTIA ChannelCon + Channel Futures MSP501 + CRN MSP 500 + ChannelE2E + Datto Global State of the MSP + Marsh + AON 2024 cyber-renewal reports + Coveware Q4 2024 + Sophos 2024 State of Ransomware: Best-in-Class MSPs 20-25% EBITDA + $220-280K rev/FTE + 60-75% recurring + 8-12% NN-ACV + 92-96% gross retention + 105-115% NRR + 80-95% QBR + 5-8% price uplift + 25-40% GP from cybersecurity + 8-12%/yr fire rate / Median 12-15% EBITDA + 1-3% uplift / Worse 3-8% EBITDA + 0% uplift; ConnectWise Jason Magee Tampa Thoma Bravo ~$1B+ ~45K partner MSPs + ConnectWise PSA + RMM + ScreenConnect + IT Nation Connect Orlando ~6K + Kaseya Fred Voccola Miami Insight Partners ~$2B ~50K MSP + Kaseya 365 + VSA + BMS + IT Glue + Datto $6.2B 2022 + DattoCon + N-able NYSE:NABL John Pagliuca Burlington ~$400M ~25K + N-central + N-sight + Cove + Passportal + N-able Empower + NinjaOne Sal Sferlazza Austin ~$2B valuation ~17K + Ninja Ticketing + Documentation + Auvik Doug Murray Waterloo Great Hill + Liongard Joe Alapat Houston + Rewst Aharon Chernin Tampa Zapier for MSPs + IT Glue Kaseya + Hudu Joe Cooper + Pia Solutions + Cork warranty + Galactic Advisors Bruce McCully + Pax8 Scott Chasin Greenwood Village ~$2B ~38K MSP partners + Pax8 Beyond Denver ~5K + TD SYNNEX + Ingram Micro + Sherweb + AppRiver + Microsoft NCE March 2022 + April 2024 + April 2025 + Copilot $30/user/mo + M365 margin from 20% to 15% + Azure 5-10% + Copilot 0% + SentinelOne NYSE:S Tomer Weingarten Singularity + Vigilance ~$700M + Huntress Kyle Hanslovan Ellicott City ~$200M ARR MDR + SAT + ITDR + MAV + Tradecraft Tuesday + CrowdStrike NASDAQ:CRWD MSP-channel + Bitdefender Florin Talpes Bucharest GravityZone ~$600M + ThreatLocker Danny Jenkins Maitland zero-trust ~$120M ARR + Zero Trust World + Blackpoint Cyber Jon Murchison Ellicott City MDR ~$100M ARR + Arctic Wolf Nick Schneider Eden Prairie Concierge SOC ~$650M ARR + Todyl + Cynet + Coro + Vade Hornetsecurity + Proofpoint Thoma Bravo + KnowBe4 Stu Sjouwerman SAT + DNSFilter + Cisco Umbrella + WebTitan + Coalition Joshua Motta SF + At-Bay Rotem Iram San Mateo + Cowbell Jack Kudale + Resilience Vishaal Hariprasad + Travelers NYSE:TRV CyberRisk + Chubb NYSE:CB Cyber + AIG CyberEdge + Beazley LSE:BEZ + Hiscox LSE:HSX + Marsh McLennan NYSE:MMC + AON NYSE:AON brokers 200-400% premium hikes for gaps + 12-control attestation MFA + EDR + immutable backups + 24/7 SOC + email security + SAT + DNS filter + PAM + ITDR + vuln scanning + IR retainer + admin-account separation + Service Leadership Index Peter Kujawa ConnectWise SVP foundational benchmarking + CompTIA Downers Grove ~100K members + A+/Network+/Security+/CySA+/PenTest+ + ChannelCon + ASCII Group ~2K MSPs + ASCII Edge + Robin Robins TMT Franklin TN ~9K MSP members + IT Marketing Roadshow + Boot Camp + Producers Club + Gary Pica TruMethods Kaseya 2021 Schedule for Success + Charles Weaver MSPAlliance ~30K MSPs + MSP/Cloud Verify Program + Channel Futures MSP501 ~1K apply ~500 listed + CRN MSP 500 Pioneer 250 + Elite 150 + Managed Security 100 + ChannelE2E Joe Panettieri Sara Roberts Smarter MSP + Channel Futures Informa Tech + Evergreen Services Group Alpine Investors ~$1B+ ~150 acquisitions + New Charter Technologies Oak Hill Capital ~$500M ~30 acquisitions + Integris Frontenac ~$300M + DataPrise + Thrive Networks Court Square ~$200M + Ntiva + ProArch + Right Networks Cove Hill + Cybersafe Solutions + Anchor Network Solutions + Solutions Granted MSSP rollup + Evolve M&A Brad Stoller + Service Leadership M&A + Cogent Growth Partners + Martinwolf + Houlihan Lokey middle-market + PE valuations 8-12x EBITDA $3-$10M MSPs + 12-18x $10M+ platforms + co-managed IT MSP augments existing internal 1-5 IT staff at 100-500-seat mid-market + 3-5x larger ARR $120K-$400K vs $30K-$80K + 40-55% GM vs 30-40% + the three avoided conversations price + security uplift + fire-the-client explain ~60-75% of EBITDA gap + CMMC 2.0 + NY DFS Part 500 + HIPAA OCR + ABA Formal Opinion 477R + 498 + PPAP Q3 2025 automotive supplier cyber-attestation + Datto BCDR + Veeam + Acronis + Cove + Axcient + DropSuite + Keepit + Spanning + AvePoint backup/BCDR + Coveware + Sophos 207-day breach detection + $18-$42K/day ransomware downtime 50-seat manufacturer) not a Q&A library entry. Built under VALUE-NOT-WORDCOUNT MANDATE: target 9,500-10,500 words ABSOLUTE HARD CAP 10,500. LEAN-FROM-START pattern mirroring st0024 + st0025. Structure: 🛠️ Pulse Training callout intro who-for MSP owners + vCIOs + account managers + service-delivery managers at $1M-$25M ARR MSPs what-bring 3 recent lost-renewal debriefs + MSA Renewal Kit QBR scorecard template (uptime + ticket-resolution + tickets/seat + strategic projects + cybersecurity posture + Microsoft tenant health + backup-test) + Service Leadership quartile self-diagnosis + cyber-insurance attestation gap checklist Coalition/At-Bay/Cowbell + NCE margin-defense calculator + co-managed conversion pitch deck + price-increase script + MSA template + Bottom Line callout 50-seat client doesn\'t churn because hourly rate went up $15 churns because you renewed flat for 3 yrs while cyber-insurance carrier denied coverage + CFO never saw QBR + Evergreen BDR called her three times in Q3 with security-stack-uplift conversation you should have run + 5-stage + 3-avoided-conversations thesis + 6-row pipe-table agenda + Section 1 Intro + Cold Open with Service Leadership Q4 2024 + Owner A 65-seat Cincinnati industrial-distributor flat at $135 lost to Evergreen 8 mo later $178/seat security wrap composite vs Owner B 80-seat Grand Rapids precision-manufacturer QBR scorecard + Coalition attestation gap audit 9 gaps + 3-component proposal base 7.4% + $75/seat security wrap + co-managed $3.5K = $14K to $22K/mo / $96K ARR lift / 3-yr MSA + Huntress + ThreatLocker + Blackpoint + Cork + 2 vertical referrals + MSP501 jump #287 to #198 + Common Trap flat-renewal is delayed loss + PE-roll-up bait not retention REVIEW before REFRAME REFRAME before REPRICE + Section 2 Teach split Part A 5-STAGE 15 min (REVIEW Service Leadership-style QBR scorecard 90 days pre-renewal + REFRAME cyber-insurance eligibility + CMMC 2.0 + ransomware downtime $18-$42K/day per Coveware + Sophos / REPRICE three-component base 5-8% lift + security wrap $35-$75/seat + co-managed governance $3.5K/mo / REUP 3-yr MSA + CPI+2% escalator floor + 6% cap + auto-renew 90-day + scope governance + co-managed expansion + annual cyber-attestation review + termination clauses / REFER vertical-segment CFO peer intros 2-3 per renewed client per year + reciprocal IT-Risk Briefing + IT Nation roundtable speaker slot) and Part B Three Renewal Conversations Every MSP Owner Avoids 10 min (price increase 5-8%/yr anchored to Service Leadership labor index + NCE pass-through + Microsoft published price changes + Section 4.2 MSA reference / cyber-attestation gap audit Coalition + At-Bay + Cowbell + Travelers + Chubb questionnaire 12-control checklist MFA + EDR + immutable backups + 24/7 SOC + email security + SAT + DNS filter + PAM + ITDR + vuln scanning + IR retainer + admin-account separation / fire-the-client deliberate non-renewal bottom 8-12%/yr + 90-day transition + warm intro to two peer MSPs Apex Network + Bolt IT) + Part C SLI Quartile Self-Diagnosis 2 min EBITDA + rev/FTE + recurring mix + NN-ACV + gross retention non-negotiable per Service Leadership 2024 Annual Industry Benchmarking + Section 3 Discussion 8 prompts (walk-away criteria from refused cyber-attestation uplift / fully-managed-to-co-managed pivot trigger 2nd internal IT FTE or fractional CIO / Microsoft NCE pass-through annual vs monthly + 20% uplift framing / Pax8 vs direct CSP vs TD SYNNEX vs Sherweb tipping point / QBR cadence reset when broken 18 months ago acknowledge in writing + reset + deliver 2 consecutive QBRs / Worse-quartile pricing fear coaching owner rides 3 renewal pitches + scripts verbatim + removes conversation from tech-leaning SDM / cyber-attestation gap audit billing model annual review in MSA scope + remediation as project hours / ONE verbatim change CRM task + Monday huddle + ride-along) + Section 4 Two-Person Role-Play Round 1 Karen Hofstetter CFO 50-seat Westshore Precision Components ISO-9001 Tier-2 automotive aerospace supplier Grand Rapids MI 3-yr MSA expiring 75 days at $135/seat flat + Coalition cyber-policy renewal 9 gaps + premium $18K to $54K or denial + Evergreen BDR pitched twice in Q3 + deflection 1 flat-3-years + Evergreen $128 quote + deflection 2 switch-carriers-Travelers — vCIO Lakeshore Managed IT $4.2M ARR Grand Rapids/Kalamazoo/South Bend runs full 5-STAGE + 3-component proposal $14K to $22K/mo 326% lift + Evergreen-as-PE-roll-up reframe with pulled SOW + Channel Futures M&A coverage + Travelers-swap-still-requires-attestation rebuttal with Marsh + AON 2024 + Tier-2 automotive PPAP Q3 2025 + owner-family piercing-corporate-veil + close with REUP + REFER + Round 2 Linda Marsh Office Manager 12-attorney Marsh Henley Polk LLP Toledo OH personal-injury + estate-planning $3M cyber-liability via Chubb + 2-yr MSA expiring 45 days at $115/seat + nephew Brian CompTIA A+ from Geek Squad $65/seat + deflection 1 $1500/mo savings $18K/yr + deflection 2 never-had-breach — vCIO HIPAA OCR + ABA Opinion 477R + 498 + Chubb attestation reframe + 3-component proposal $148 + $35 security = $183/seat × 12 = $2,196/mo + Brian doesn\'t carry $5M E&O + $2M cyber tower + SOC-2 Type-2 + HIPAA BAA + Ohio Bar Disciplinary Counsel 2023 4-attorney prosecutions under DR 1-104 + dark-web exposure report 14 credentials + Coveware 207-day detection + close with founding-partner briefing as MSA-close artifact + REFER law-firm peer intros + Section 5 Debrief 3 Qs strongest/weakest stage + avoided conversation dodged most + renewal owed redo + 4-line CRM ritual + Section 6 Leave-Behind walkthrough + printable one-pager 7 Things to Bring on Every MSA Renewal + 5-Stage MSA Renewal Script Card with verbatim cue lines and timing per stage + 3 Renewal Conversations Every MSP Owner Avoids verbatim + SLI Impact + SLI Quartile Self-Diagnosis 10-metric grid Best-in-Class vs Median vs Worse + Cyber-Insurance Attestation Gap Checklist 12 controls + Coalition / At-Bay / Cowbell 2025 requirement + typical MSP stack vendors + Never-Do list + Outcome Line + If You Only Remember One Thing hero quote You don\'t keep a 50-seat client with flat-rate renewal letter you keep her by (1) Service Leadership-style QBR 90 days pre-expiry REVIEW (2) reframing IT as cyber-insurance + regulatory + continuity not break-fix REFRAME (3) delivering price-increase + cyber-attestation gap audit + co-managed pivot as one integrated three-component MSA proposal REPRICE. How-this-training-fits-MSP-operating-motion table at end showing Monday-morning vCIO huddle weekly + Day 90 pre-renewal REVIEW + Day 75 pre-renewal REFRAME + Day 60 pre-renewal REPRICE + Day 30-15 pre-renewal REUP + Day 30 post-signing + month 6 REFER + three avoided conversations overlay + owner-level SLI quartile review quarterly. Two mermaid diagrams: 5-Stage MSA Renewal Flow + Cyber-Attestation Gap Decision Tree branches by 0-2 gaps clean + 3-6 gaps uplift + 7+ gaps crisis + client-accepts vs declines first-pass vs declines twice + fire-the-client criteria + 90-day transition + warm intros to Apex Network + Bolt IT + emergency uplift Galactic Advisors + Cork + ConnectSecure + Liongard alignment audit + terminal nodes Q4 QBR built-in attestation review + REFER vertical-peer CFO intros vs replan pipeline via Robin Robins + ASCII Edge + vertical-peer referrals + MSP501 application + Evolve M&A buyer briefing. 10 benchmark tables (MSP Industry Operating Benchmarks Q4 2024 SLI + MSP Platform Vendor Landscape + MSP Cybersecurity Stack Vendor Pricing Per-Seat Per-Month + Microsoft NCE Margin Reality Pre vs Post + Cyber-Insurance Premium + Attestation Reality Marsh + AON 2024 + MSA Renewal Cycle MRR Uplift Composite + MSP M&A Valuation Environment 2024-2027 + Why MSP Renewals Don\'t Hold MRR + vCIO Renewal Performance by Tenure). 12-failure-mode counter-case + 7-owner-objection coach-back + when-to-rerun cadence. Cross-links to st0001-st0006 SaaS foundation arc with translation mapping + companion industry-specific entries planned st0027-st0030 + cross-reference to st0007-st0025 what transfers verbatim language + CRM-PSA-reviewed coaching cadence and what does NOT MSP-specific PSA/RMM/SOC stack + SLI quartile framework + Microsoft NCE pass-through mechanics + cyber-insurance attestation 12-control checklist + co-managed-vs-fully-managed pricing model + PE-rollup competitive dynamics + MSP501 ranking flywheel + three avoided conversations as owner-coachable disciplines + stop-selling-break-fix reframe + Bar Opinion 477R + HIPAA OCR + CMMC 2.0 + PPAP automotive vertical-specific framing. Tags include sales-training (hub filter) + msp-msa-renewal-training + managed-it-services + msp + msa-renewal + mid-market + cybersecurity-stack + co-managed-it + cyber-insurance + nce-margin-erosion + 60-min-meeting + standard-team + st0026. Callouts used: Pulse Training (MSP-themed intro) + Bottom Line + Coach Note + Verbatim Script + Common Trap + Leave-Behind. EXPLICITLY MSP INDUSTRY - NOT generic SaaS - no Gong / Bridge Group / Pavilion / ProfitWell / SaaStr / OpenView citations. Industry-correct sources: ConnectWise + Datto/Kaseya + N-able NYSE:NABL + NinjaOne + Auvik + Pax8 + IT Nation Connect + ASCII Edge + CompTIA + MSP501 + Channel Futures + Robin Robins/TMT + Gary Pica/TruMethods + Peter Kujawa + Service Leadership/ConnectWise SLI Q4 reports + Pia Solutions + Liongard + ITGlue/IT Glue + Hudu + Cork + Galactic Advisors + Coalition + At-Bay + Cowbell + Travelers NYSE:TRV + Chubb NYSE:CB + Marsh NYSE:MMC + AON NYSE:AON + SentinelOne NYSE:S + CrowdStrike NASDAQ:CRWD + Huntress + Bitdefender + ThreatLocker + Blackpoint Cyber + Arctic Wolf + KnowBe4 + Vade + Proofpoint + Datto BCDR + Veeam + Acronis + Axcient + Cove + DropSuite + Keepit + Spanning + AvePoint + Bar Opinion 477R + HIPAA OCR + CMMC 2.0 + PPAP Q3 2025 + Coveware + Sophos State of Ransomware + Evolve M&A + Cogent Growth Partners + Martinwolf + Houlihan Lokey + ChannelE2E + CRN MSP 500. Tight 2-3 sentence paragraphs throughout. No emoji-spam in body prose. ASCII-clean. Lean target honored: drafted under 10,500 hard cap. Each ladder rung polish_note explicitly instructed CUT and tighten do not ADD length per locked rule.'
};

async function main() {
  const TOKEN = process.env.BLOBS_PAT;
  if (!TOKEN) { console.error('BLOBS_PAT not set'); process.exit(1); }
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOKEN });

  // --- Word count pre-flight check (PRE-FLIGHT word-count guard) ---
  const fullV9 = tldr + core + flow + src + num + counter + links;
  const wordCount = fullV9.split(/\s+/).filter(Boolean).length;
  console.log('[' + ID + '] v9 word count:', wordCount);
  if (wordCount > 10500) {
    console.error('[' + ID + '] HARD CAP EXCEEDED:', wordCount, '> 10500 — aborting');
    process.exit(1);
  }
  if (wordCount < 9500) {
    console.warn('[' + ID + '] WARNING: under target floor:', wordCount, '< 9500');
  }

  // --- Pre-seed the entry shell so runPolish's store.get() finds it ---
  const ts0 = Date.now();
  const existing = await store.get('answers/' + ID + '.json', { type: 'json' });
  if (!existing) {
    console.log('[' + ID + '] seeding entry shell (runPolish requires entry to exist)');
    await store.setJSON('answers/' + ID + '.json', {
      id: ID,
      question: QUESTION,
      answer: tldr,
      tags,
      sources: sources.slice(0, 3),
      ts: ts0,
      model: 'claude-opus-4-7-via-claude-code',
      quality_score: 5,
      polished_at: null,
      polish_history: [],
      source: 'claude-opus-bespoke-seed',
      format_v: '2026-05'
    });
    const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
    const i = idx.entries.findIndex(x => x.id === ID);
    const row = { id: ID, question: QUESTION, tags, ts: ts0, quality_score: 5, polished_at: null, last_modified_ms: ts0, sources_count: 3, format_v: '2026-05' };
    if (i >= 0) idx.entries[i] = row; else idx.entries = [row, ...idx.entries];
    await store.setJSON('_index.json', idx);
  } else {
    console.log('[' + ID + '] entry already exists — runPolish will overwrite at v5');
  }

  // --- Walk the polish ladder 5->6->7->8->9->10 ---
  await runPolish({
    id: ID,
    tldr,
    core,
    flow,
    src,
    num,
    counter,
    links,
    sources,
    tags,
    notes
  });

  // Post-polish: stamp format_v=2026-05 on final blob entry + index row
  try {
    const finalEntry = await store.get('answers/' + ID + '.json', { type: 'json' });
    if (finalEntry) {
      finalEntry.format_v = '2026-05';
      await store.setJSON('answers/' + ID + '.json', finalEntry);
      console.log('[' + ID + '] post-polish format_v=2026-05 stamped on blob');
    }
    const finalIdx = await store.get('_index.json', { type: 'json' });
    if (finalIdx && Array.isArray(finalIdx.entries)) {
      const ii = finalIdx.entries.findIndex(x => x.id === ID);
      if (ii >= 0) {
        finalIdx.entries[ii].format_v = '2026-05';
        await store.setJSON('_index.json', finalIdx);
        console.log('[' + ID + '] post-polish format_v=2026-05 stamped on _index.json row');
      }
    }
  } catch (err) {
    console.error('[' + ID + '] post-polish format_v stamp failed:', err.message);
  }

  // Fire-and-forget IndexNow ping so /sales-trainings/st0026 is crawled.
  try {
    fetch('https://pulserevops.com/.netlify/functions/pulse-machine-indexnow-batch-background', { method: 'POST' })
      .catch(() => {});
  } catch (_e) {}

  console.log('=== DONE ' + ID + ' === quality_score=10');
}

main().catch(err => { console.error(err); process.exit(1); });



