// Quick audit of q9683 against the 6 gold format elements.
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

(async () => {
  const TOKEN = process.env.BLOBS_PAT;
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOKEN });
  const e = await store.get('answers/q9683.json', { type: 'json' });
  if (!e) { console.error('q9683 not found'); process.exit(1); }
  const ans = e.answer || '';
  fs.writeFileSync(path.join(__dirname, 'q9683_raw.md'), ans, 'utf8');

  const wordCount = ans.replace(/```[\s\S]*?```/g, ' ').replace(/https?:\/\/\S+/g, ' ').replace(/[#>*_`~|\-=]/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;

  const audit = {
    id: e.id,
    question: e.question,
    quality_score: e.quality_score,
    format_v: e.format_v || null,
    tag_count: Array.isArray(e.tags) ? e.tags.length : 0,
    char_count: ans.length,
    word_count: wordCount,
    elements: {
      e1_direct_answer_h3: /^###\s+Direct Answer\b/m.test(ans) || /\n###\s+Direct Answer\b/.test(ans),
      e1_bold_tldr_top: false,
      e2_h2_banners: (ans.match(/^##\s+/gm) || []).length,
      e3_numbered_subsections: (ans.match(/^###\s+\d+\.\s+/gm) || []).length,
      e4_bullets_with_bold: (ans.match(/^[-*]\s+\*\*[^*]+\*\*/gm) || []).length,
      e5_real_companies: {
        ada: /\bADA\b|American Dental Association/i.test(ans),
        agd: /\bAGD\b|Academy of General Dentistry/i.test(ans),
        adea: /\bADEA\b|Educational Debt Survey/i.test(ans),
        heartland: /Heartland Dental|Pat Bauer/i.test(ans),
        kkr: /\bKKR\b/i.test(ans),
        pacific_dental: /Pacific Dental|Steve Thorne/i.test(ans),
        aspen: /Aspen Dental/i.test(ans),
        smile_brands: /Smile Brands/i.test(ans),
        affordable_care: /Affordable Care/i.test(ans),
        mb2: /MB2 Dental/i.test(ans),
        smile_doctors: /Smile Doctors/i.test(ans),
        western_dental: /Western Dental/i.test(ans),
        nadg: /North American Dental/i.test(ans),
        imagen: /Imagen Dental/i.test(ans),
        henry_schein: /Henry Schein|NASDAQ:HSIC/i.test(ans),
        patterson: /Patterson Companies|NASDAQ:PDCO|Patterson Dental/i.test(ans),
        benco: /Benco Dental/i.test(ans),
        adec: /A-dec/i.test(ans),
        pelton: /Pelton & Crane|Pelton/i.test(ans),
        belmont: /Belmont/i.test(ans),
        midmark: /Midmark/i.test(ans),
        itero: /iTero|Align Technology/i.test(ans),
        threeshape: /3Shape|Trios/i.test(ans),
        medit: /Medit/i.test(ans),
        planmeca: /Planmeca/i.test(ans),
        carestream: /Carestream/i.test(ans),
        dexis: /DEXIS/i.test(ans),
        cerec: /CEREC|Dentsply Sirona|NASDAQ:XRAY/i.test(ans),
        glidewell: /Glidewell/i.test(ans),
        pearl_ai: /Pearl|Ophir Tanz/i.test(ans),
        overjet: /Overjet|Wardah Inam/i.test(ans),
        videahealth: /VideaHealth|Videa/i.test(ans),
        denti_ai: /Denti\.AI|Denti AI/i.test(ans),
        dentrix: /Dentrix/i.test(ans),
        eaglesoft: /Eaglesoft/i.test(ans),
        open_dental: /Open Dental/i.test(ans),
        curve: /Curve Dental/i.test(ans),
        tab32: /tab32/i.test(ans),
        denticon: /Denticon/i.test(ans),
        live_oak: /Live Oak Bank/i.test(ans),
        bofa: /Bank of America Practice|BofA Practice/i.test(ans),
        first_citizens: /First Citizens/i.test(ans),
        provide: /Provide\.com/i.test(ans),
        invisalign: /Invisalign|Align Technology/i.test(ans),
        suresmile: /SureSmile|Dentsply/i.test(ans),
        spark: /Spark|Ormco/i.test(ans),
        kleer: /Kleer/i.test(ans),
      },
      e6_numbered_sources: /^\d+\.\s+\*?\*?\[?[A-Z]/m.test(ans) && /\n##\s+Sources/i.test(ans),
      e6_inline_links: (ans.match(/\]\(https?:\/\//g) || []).length,
    },
  };

  const head = ans.slice(0, 2500);
  const directAnswerMatch = head.match(/### Direct Answer\s*\n+([\s\S]{0,1800})/);
  if (directAnswerMatch) {
    const block = directAnswerMatch[1];
    const upToNextHeader = block.split(/\n##\s/)[0].split(/\n###\s/)[0];
    audit.elements.e1_bold_tldr_top = /\*\*[^*]+\*\*/.test(upToNextHeader);
  }

  const realNameHits = Object.values(audit.elements.e5_real_companies).filter(Boolean).length;
  const realNameTotal = Object.keys(audit.elements.e5_real_companies).length;
  audit.elements.e5_real_name_hits = realNameHits + '/' + realNameTotal;

  console.log(JSON.stringify(audit, null, 2));
  console.log('\n--- FIRST 1500 CHARS ---');
  console.log(ans.slice(0, 1500));
  console.log('\n--- HEADER OUTLINE (first 100 headers) ---');
  const headers = ans.match(/^#{1,3}\s+.+$/gm) || [];
  console.log(headers.slice(0, 100).join('\n'));
})().catch(err => { console.error(err); process.exit(1); });
