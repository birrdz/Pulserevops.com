// Quick audit of q9688 against the 6 gold format elements.
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
  const e = await store.get('answers/q9688.json', { type: 'json' });
  if (!e) { console.error('q9688 not found'); process.exit(1); }
  const ans = e.answer || '';

  const wordCount = ans.replace(/```[\s\S]*?```/g, ' ').replace(/https?:\/\/\S+/g, ' ').replace(/[#>*_`~|\-=]/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;
  const rawWords = ans.split(/\s+/).filter(Boolean).length;

  // Real-name probes per the task spec
  const probes = {
    NECA: /NECA/.test(ans),
    IBEW: /IBEW/.test(ans),
    ServiceTitan: /ServiceTitan/i.test(ans),
    HousecallPro: /Housecall Pro/i.test(ans),
    Jobber: /Jobber/i.test(ans),
    FieldEdge: /FieldEdge|FieldRoutes/i.test(ans),
    Apex: /Apex Service Partners/i.test(ans),
    Wrench: /Wrench Group/i.test(ans),
    Authority: /Authority Brands/i.test(ans),
    BenFranklin: /Benjamin Franklin/i.test(ans),
    MrRooter: /Mr\.? Rooter/i.test(ans),
    RotoRooter: /Roto-Rooter/i.test(ans),
    Chemed: /Chemed|NYSE:CHE/i.test(ans),
    Ferguson: /Ferguson|NYSE:FERG/i.test(ans),
    Hajoca: /Hajoca/i.test(ans),
    Winsupply: /Winsupply/i.test(ans),
    BradfordWhite: /Bradford White/i.test(ans),
    Rinnai: /Rinnai/i.test(ans),
    Navien: /Navien/i.test(ans),
    AOSmith: /A\.?O\.? Smith/i.test(ans),
    Kohler: /Kohler/i.test(ans),
    Moen: /Moen/i.test(ans),
    Wisetack: /Wisetack/i.test(ans),
    GreenSky: /GreenSky/i.test(ans),
    EPA_LSL: /EPA Lead Service Line|EPA LSL|LCRR|LCRI/i.test(ans),
    IIJA_IRA: /IIJA|IRA/i.test(ans),
  };
  const probesHit = Object.values(probes).filter(Boolean).length;
  const probesTotal = Object.keys(probes).length;

  const audit = {
    id: e.id,
    question: e.question,
    quality_score: e.quality_score,
    format_v: e.format_v || null,
    tag_count: Array.isArray(e.tags) ? e.tags.length : 0,
    char_count: ans.length,
    word_count_counted: wordCount,
    raw_word_count: rawWords,
    elements: {
      e1_direct_answer_h3: /(^|\n)###\s+Direct Answer\b/.test(ans),
      e1_bold_tldr_top: false,
      e2_h2_banners: (ans.match(/^##\s+/gm) || []).length,
      e3_numbered_subsections: (ans.match(/^###\s+\d+\.\s+/gm) || []).length,
      e4_bullets_with_bold: (ans.match(/^[-*]\s+\*\*[^*]+\*\*/gm) || []).length,
      e6_inline_links: (ans.match(/\]\(https?:\/\//g) || []).length,
      e6_numbered_sources: /\n##\s+Sources/i.test(ans),
    },
    real_names: probes,
    real_names_hit: probesHit + '/' + probesTotal,
  };

  const head = ans.slice(0, 2000);
  const directAnswerMatch = head.match(/### Direct Answer\s*\n+([\s\S]{0,1500})/);
  if (directAnswerMatch) {
    const block = directAnswerMatch[1];
    const upToNextHeader = block.split(/\n##\s/)[0].split(/\n###\s/)[0];
    audit.elements.e1_bold_tldr_top = /\*\*[^*]+\*\*/.test(upToNextHeader);
  }

  console.log(JSON.stringify(audit, null, 2));
  console.log('\n--- HEADER OUTLINE (first 40 headers) ---');
  const headers = ans.match(/^#{1,3}\s+.+$/gm) || [];
  console.log(headers.slice(0, 40).join('\n'));
})().catch(err => { console.error(err); process.exit(1); });
