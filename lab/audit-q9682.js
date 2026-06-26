// Quick audit of q9682 against the 6 gold format elements.
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
  const e = await store.get('answers/q9682.json', { type: 'json' });
  if (!e) { console.error('q9682 not found'); process.exit(1); }
  const ans = e.answer || '';
  fs.writeFileSync(path.join(__dirname, 'q9682_raw.md'), ans, 'utf8');

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
        ase: /\bASE\b|National Institute for Automotive Service Excellence/i.test(ans),
        driven_brands: /Driven Brands/i.test(ans),
        take5: /Take 5/i.test(ans),
        meineke: /Meineke/i.test(ans),
        maaco: /Maaco/i.test(ans),
        monro: /Monro Inc|Monro\b/i.test(ans),
        sun_auto: /Sun Auto Tire/i.test(ans),
        christian_brothers: /Christian Brothers Automotive/i.test(ans),
        midas: /Midas\b/i.test(ans),
        big_o: /Big O Tires/i.test(ans),
        aamco: /AAMCO/i.test(ans),
        pep_boys: /Pep Boys/i.test(ans),
        ntb: /\bNTB\b/i.test(ans),
        mavis: /Mavis Tire/i.test(ans),
        greenbriar: /Greenbriar Equity/i.test(ans),
        sp_global_mobility: /S&P Global Mobility/i.test(ans),
        ibisworld: /IBISWorld/i.test(ans),
        aaa: /AAA Cost|AAA\b/i.test(ans),
        nhtsa: /NHTSA/i.test(ans),
        auto_care_assoc: /Auto Care Association/i.test(ans),
        mema_sae: /MEMA|\bSAE\b/i.test(ans),
        epa_rcra: /EPA RCRA|RCRA\b/i.test(ans),
        epa_608: /EPA Section 608|Section 608/i.test(ans),
        osha: /OSHA/i.test(ans),
        ira_ev: /IRA-style|IRA EV|ADAS regulations|EV.*regulations/i.test(ans),
        napa_autocare: /NAPA AutoCare|NAPA\b/i.test(ans),
        technet: /TechNet/i.test(ans),
        ase_blue_seal: /ASE Blue Seal|Blue Seal/i.test(ans),
        autozone_commercial: /AutoZone Commercial|AutoZone\b/i.test(ans),
        oreilly_pro: /O'Reilly Pro|O'Reilly/i.test(ans),
        advance_pro: /Advance Pro|Advance Auto/i.test(ans),
        worldpac: /Worldpac/i.test(ans),
        fcp_euro: /FCP Euro/i.test(ans),
        mitchell1: /Mitchell 1|ManagerSE/i.test(ans),
        tekmetric: /Tekmetric/i.test(ans),
        shopmonkey: /Shopmonkey/i.test(ans),
        autoleap: /AutoLeap/i.test(ans),
        identifix: /Identifix/i.test(ans),
        autovitals: /AutoVitals/i.test(ans),
        baymaster: /Bay-masteR|BayMaster/i.test(ans),
        hunter: /Hunter Engineering/i.test(ans),
        bosch: /Bosch Automotive|Bosch\b/i.test(ans),
        autel: /AUTEL|Autel/i.test(ans),
        car_o_liner: /Car-O-Liner/i.test(ans),
        john_bean: /John Bean/i.test(ans),
        adas_calibration: /ADAS calibration/i.test(ans),
        r454b: /R-454B|R454B|AIM Act/i.test(ans),
        live_oak: /Live Oak Bank/i.test(ans),
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
  console.log('\n--- FIRST 2000 CHARS ---');
  console.log(ans.slice(0, 2000));
  console.log('\n--- HEADER OUTLINE (first 120 headers) ---');
  const headers = ans.match(/^#{1,3}\s+.+$/gm) || [];
  console.log(headers.slice(0, 120).join('\n'));
})().catch(err => { console.error(err); process.exit(1); });
