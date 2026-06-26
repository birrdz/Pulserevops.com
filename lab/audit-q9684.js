// Quick audit of q9684 against the 6 gold format elements.
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
  const e = await store.get('answers/q9684.json', { type: 'json' });
  if (!e) { console.error('q9684 not found'); process.exit(1); }
  const ans = e.answer || '';
  fs.writeFileSync(path.join(__dirname, 'q9684_raw.md'), ans, 'utf8');

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
        aoa: /\bAOA\b|American Optometric Association/i.test(ans),
        arbo: /\bARBO\b/i.test(ans),
        asco: /\bASCO\b/i.test(ans),
        essilorluxottica: /EssilorLuxottica/i.test(ans),
        francesco_milleri: /Francesco Milleri/i.test(ans),
        lenscrafters: /LensCrafters/i.test(ans),
        pearle_vision: /Pearle Vision/i.test(ans),
        target_optical: /Target Optical/i.test(ans),
        sunglass_hut: /Sunglass Hut/i.test(ans),
        myeyedr: /MyEyeDr/i.test(ans),
        kkr: /\bKKR\b/i.test(ans),
        national_vision: /National Vision|NASDAQ:EYE|America's Best|Eyeglass World/i.test(ans),
        vision_source: /Vision Source/i.test(ans),
        steven_eiss: /Steven Eiss/i.test(ans),
        idoc: /\bIDOC\b/i.test(ans),
        dave_brown: /Dave Brown/i.test(ans),
        pecaa: /\bPECAA\b/i.test(ans),
        warby_parker: /Warby Parker|NASDAQ:WRBY|Neil Blumenthal|Dave Gilboa/i.test(ans),
        vip_us_eye: /Vision Innovation Partners|\bVIP\b|US Eye|Eyeris|Keplr/i.test(ans),
        vsp: /\bVSP\b/i.test(ans),
        eyemed: /EyeMed/i.test(ans),
        spectera: /Spectera|UnitedHealthcare/i.test(ans),
        davis_vision: /Davis Vision|MetLife/i.test(ans),
        coopervision: /CooperVision|MiSight/i.test(ans),
        jj_acuvue: /J&J|Acuvue|Johnson/i.test(ans),
        alcon: /Alcon|DAILIES/i.test(ans),
        bausch: /Bausch \+ Lomb|Bausch/i.test(ans),
        hoya: /Hoya/i.test(ans),
        essilor: /Essilor/i.test(ans),
        younger: /Younger Optics/i.test(ans),
        shamir: /Shamir/i.test(ans),
        heidelberg: /Heidelberg|Spectralis/i.test(ans),
        zeiss: /Zeiss|Cirrus/i.test(ans),
        topcon: /Topcon|Maestro/i.test(ans),
        optos: /Optos/i.test(ans),
        marco: /Marco TRS|Reichert/i.test(ans),
        eaglet: /Eaglet|Medmont|IOLMaster/i.test(ans),
        compulink: /Compulink/i.test(ans),
        revolutionehr: /RevolutionEHR/i.test(ans),
        eyefinity: /Eyefinity|OfficeMate|Acuity Logic/i.test(ans),
        live_oak: /Live Oak Bank|Provide\.com/i.test(ans),
        tearlab_lumenis: /TearLab|Lumenis|Lipiflow|Solv|Zocdoc/i.test(ans),
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
