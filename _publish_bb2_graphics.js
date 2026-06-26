// Publishes the 25 BB2 graphics via _write_gb.js
const { execSync } = require('child_process');

const ITEMS = [
  { id:'gb0446', title:'Pharmaceutical CRO — LinkedIn Banner',           cat:'linkedin-banner', desc:'Banner for fractional and full-time pharmaceutical Chief Revenue Officers across branded, generics, biotech, and medical-device verticals — recolor and drop into LinkedIn.' },
  { id:'gb0447', title:'Real Estate CRO — LinkedIn Banner',              cat:'linkedin-banner', desc:'LinkedIn banner for residential, commercial, REIT, and home-builder revenue leaders — recolor to your brand and download as SVG or PNG.' },
  { id:'gb0448', title:'Construction CRO — LinkedIn Banner',             cat:'linkedin-banner', desc:'Banner for construction-equipment, materials, heavy-rental, and modular revenue leaders — recolor and download free.' },
  { id:'gb0449', title:'Industrial Robotics CRO — LinkedIn Banner',      cat:'linkedin-banner', desc:'Banner for industrial-robotics OEM, integrator, vision, and collaborative-robot revenue leaders — free to download and recolor.' },
  { id:'gb0450', title:'Semiconductor Foundry CRO — LinkedIn Banner',    cat:'linkedin-banner', desc:'Banner for foundry, EDA, IP, and packaging revenue leaders — recolor to your brand palette and download as SVG or PNG.' },
  { id:'gb0451', title:'Enterprise SaaS Renewals — LinkedIn Banner',     cat:'linkedin-banner', desc:'Banner highlighting Net Revenue Retention as the headline metric for renewals leaders — recolor and download free.' },
  { id:'gb0452', title:'Document Capture CRO — LinkedIn Banner',         cat:'linkedin-banner', desc:'Banner for print, capture, archive, and workflow revenue leaders in document services — free to recolor and download.' },
  { id:'gb0453', title:'Identity and Trust — LinkedIn Banner',           cat:'linkedin-banner', desc:'Banner for KYC, KYB, background-check, and biometric identity revenue leaders — recolor to your brand and download.' },
  { id:'gb0454', title:'Fraud and AML — LinkedIn Banner',                cat:'linkedin-banner', desc:'Banner for sanctions, KYC, transaction-monitoring, and SAR-drafting fraud-and-AML revenue leaders — recolor and download.' },
  { id:'gb0455', title:'Offensive Security Pentest CRO — LinkedIn Banner', cat:'linkedin-banner', desc:'Banner for web, mobile, cloud, and red-team penetration-testing revenue leaders — recolor to your brand palette and download.' },
  { id:'gb0456', title:'MDR Services CRO — LinkedIn Banner',             cat:'linkedin-banner', desc:'Banner for EDR, XDR, IR, and threat-hunt Managed Detection and Response revenue leaders — free to recolor and download.' },
  { id:'gb0457', title:'SIEM and Data Lake CRO — LinkedIn Banner',       cat:'linkedin-banner', desc:'Banner for Splunk, Sentinel, Chronicle, and Panther detection engineers and SIEM revenue leaders — recolor and download.' },
  { id:'gb0458', title:'Zero Trust Network Access CRO — LinkedIn Banner', cat:'linkedin-banner', desc:'Banner for Zscaler, Netskope, Cloudflare, and Prisma ZTNA revenue leaders — recolor to your brand and download free.' },
  { id:'gb0459', title:'Cyber Insurance Underwriter — LinkedIn Banner',  cat:'linkedin-banner', desc:'Banner for cyber-insurance underwriting leaders focused on loss ratio, sub-limits, and vendor endorsement — recolor and download.' },
  { id:'gb0460', title:'NRR Beats New Logos — Revenue Law Banner',       cat:'mindset-quote-banner', desc:'Quote banner reminding revenue leaders that expansion and retention beat new logos in the long-run revenue equation — recolor and download.' },
  { id:'gb0461', title:'Forecast First, Pipeline Second — Banner',       cat:'mindset-quote-banner', desc:'Quote banner on forecasting discipline — commit, best case, pipeline coverage — for revenue operators who close on the number — recolor and download.' },
  { id:'gb0462', title:'Deals Do Not Stall, People Do — Banner',         cat:'mindset-quote-banner', desc:'Quote banner on the human side of pipeline movement — champion, economic buyer, decision process — for sellers and CROs — recolor and download.' },
  { id:'gb0463', title:'Discovery is the Whole Job — Banner',            cat:'mindset-quote-banner', desc:'Quote banner on discovery discipline — pain, impact, decision, process — for AEs and sales managers — recolor and download.' },
  { id:'gb0464', title:'Champions Close Deals — Banner',                 cat:'mindset-quote-banner', desc:'Quote banner on champion-building motion — build, test, mobilize, reference — for AEs running enterprise deals — recolor and download.' },
  { id:'gb0465', title:'Renewal is the New Sale — Banner',               cat:'mindset-quote-banner', desc:'Quote banner reframing renewal as the primary revenue motion — health score, QBR, co-term, multi-year — recolor and download.' },
  { id:'gb0466', title:'Sales Cycles Shrink With Trust — Banner',        cat:'mindset-quote-banner', desc:'Quote banner on trust as cycle-time accelerator — reference, proof, pilot, land — for sellers and revenue leaders — recolor and download.' },
  { id:'gb0467', title:'MEDDPICC Qualification Framework — Banner',      cat:'mindset-quote-banner', desc:'Framework banner spelling out MEDDPICC — metrics, economic buyer, decision criteria, paper process, pain, champion, competition — recolor and download.' },
  { id:'gb0468', title:'BANT is Dead — Banner',                          cat:'mindset-quote-banner', desc:'Quote banner declaring BANT obsolete and pointing toward the modern qualification frameworks revenue teams actually run — recolor and download.' },
  { id:'gb0469', title:'Forecast Bands Beat Point Estimates — Stat Card', cat:'stat-card-banner', desc:'Stat-card banner on forecast discipline showing low, commit, high, and stretch bands as the better operating model — recolor and download.' },
  { id:'gb0470', title:'ICP Discipline: Say No to Win More — Banner',    cat:'mindset-quote-banner', desc:'Quote banner on ideal customer profile discipline — fit, pain, power, buy cycle — for CROs and sales leaders — recolor and download.' },
];

let ok = 0, fail = 0;
for (const it of ITEMS) {
  const cmd = `node _write_gb.js ${it.id} "${it.title.replace(/"/g, '\\"')}" ${it.cat} "${it.desc.replace(/"/g, '\\"')}"`;
  try {
    const out = execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    const last = out.trim().split('\n').pop();
    const j = JSON.parse(last);
    if (j.ok) { console.log('OK', it.id, j.url); ok++; }
    else      { console.log('FAIL', it.id, last); fail++; }
  } catch (e) {
    console.log('ERR', it.id, String(e.stderr || e.message).slice(0, 200));
    fail++;
  }
}
console.log(`---\npublished ${ok}/${ITEMS.length}  fail=${fail}`);
