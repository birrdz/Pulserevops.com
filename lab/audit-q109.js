// Quick audit of q109 against the 6 gold format elements.
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
  const e = await store.get('answers/q109.json', { type: 'json' });
  if (!e) { console.error('q109 not found'); process.exit(1); }
  const ans = e.answer || '';
  fs.writeFileSync(path.join(__dirname, 'q109_raw.md'), ans, 'utf8');

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
        salesforce: /Salesforce/i.test(ans),
        hubspot: /HubSpot/i.test(ans),
        pipedrive: /Pipedrive/i.test(ans),
        microsoft_dynamics: /Microsoft Dynamics|MS Dynamics|Dynamics 365/i.test(ans),
        outreach: /\bOutreach\b/i.test(ans),
        salesloft: /Salesloft|SalesLoft/i.test(ans),
        apollo: /\bApollo\b/i.test(ans),
        gong: /\bGong\b/i.test(ans),
        clari: /\bClari\b/i.test(ans),
        boostup: /BoostUp/i.test(ans),
        scratchpad: /Scratchpad/i.test(ans),
        peopleai: /People\.ai|People AI/i.test(ans),
        pipl: /\bPipl\b/i.test(ans),
        workato: /Workato/i.test(ans),
        zapier: /Zapier/i.test(ans),
        forrester: /Forrester/i.test(ans),
        gartner: /Gartner/i.test(ans),
        bridge_group: /Bridge Group/i.test(ans),
        openview: /OpenView/i.test(ans),
      },
      e6_numbered_sources: /^\d+\.\s+\*?\*?\[?[A-Z]/m.test(ans) && /\n##\s+Sources/i.test(ans),
      e6_inline_links: (ans.match(/\]\(https?:\/\//g) || []).length,
    },
  };

  // Check if direct answer TLDR is bolded near the top (within first 2000 chars)
  const head = ans.slice(0, 2500);
  const directAnswerMatch = head.match(/### Direct Answer\s*\n+([\s\S]{0,1800})/);
  if (directAnswerMatch) {
    const block = directAnswerMatch[1];
    const upToNextHeader = block.split(/\n##\s/)[0].split(/\n###\s/)[0];
    audit.elements.e1_bold_tldr_top = /\*\*[^*]+\*\*/.test(upToNextHeader);
  }

  console.log(JSON.stringify(audit, null, 2));
  console.log('\n--- FIRST 800 CHARS ---');
  console.log(ans.slice(0, 800));
  console.log('\n--- HEADER OUTLINE (first 80 headers) ---');
  const headers = ans.match(/^#{1,3}\s+.+$/gm) || [];
  console.log(headers.slice(0, 80).join('\n'));
})().catch(err => { console.error(err); process.exit(1); });
