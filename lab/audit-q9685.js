// Quick audit of q9685 against the 6 gold format elements.
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
  const e = await store.get('answers/q9685.json', { type: 'json' });
  if (!e) { console.error('q9685 not found'); process.exit(1); }
  const ans = e.answer || '';
  fs.writeFileSync(path.join(__dirname, 'q9685_raw.md'), ans, 'utf8');

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
      e1_bold_tldr_top: false, // check below
      e2_h2_banners: (ans.match(/^##\s+/gm) || []).length,
      e3_numbered_subsections: (ans.match(/^###\s+\d+\.\s+/gm) || []).length,
      e4_bullets_with_bold: (ans.match(/^[-*]\s+\*\*[^*]+\*\*/gm) || []).length,
      e5_real_companies: {
        joint: /The Joint|JYNT/i.test(ans),
        palmer: /Palmer/i.test(ans),
        logan: /Logan/i.test(ans),
        life_university: /Life University|Life Chiropractic/i.test(ans),
        sherman: /Sherman/i.test(ans),
        hill_table: /Hill HA|HA90|HA95|Hill Laboratories/i.test(ans),
        drx9000: /DRX9000|DRX-9000/i.test(ans),
        ica: /\bICA\b|International Chiropractors Association/i.test(ans),
        aca: /\bACA\b|American Chiropractic Association/i.test(ans),
        icpa: /\bICPA\b/i.test(ans),
        ccsp: /\bCCSP\b/i.test(ans),
        chirotouch: /ChiroTouch/i.test(ans),
        genesis: /Genesis Chiropractic/i.test(ans),
        cms_codes: /98940|98941|98942/.test(ans),
      },
      e6_numbered_sources: /^\d+\.\s+\*?\*?\[?[A-Z]/m.test(ans) && /\n##\s+Sources/i.test(ans),
      e6_inline_links: (ans.match(/\]\(https?:\/\//g) || []).length,
    },
  };

  // Check if direct answer TLDR is bolded near the top (within first 1500 chars)
  const head = ans.slice(0, 2000);
  const directAnswerMatch = head.match(/### Direct Answer\s*\n+([\s\S]{0,1500})/);
  if (directAnswerMatch) {
    const block = directAnswerMatch[1];
    // Look for bolded paragraph in the block (before the next ## or ###)
    const upToNextHeader = block.split(/\n##\s/)[0].split(/\n###\s/)[0];
    audit.elements.e1_bold_tldr_top = /\*\*[^*]+\*\*/.test(upToNextHeader);
  }

  console.log(JSON.stringify(audit, null, 2));
  console.log('\n--- FIRST 600 CHARS ---');
  console.log(ans.slice(0, 600));
  console.log('\n--- HEADER OUTLINE (first 60 headers) ---');
  const headers = ans.match(/^#{1,3}\s+.+$/gm) || [];
  console.log(headers.slice(0, 60).join('\n'));
})().catch(err => { console.error(err); process.exit(1); });
