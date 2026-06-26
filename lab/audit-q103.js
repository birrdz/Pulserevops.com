// Quick audit of q103 against the 6 gold format elements.
// q103 -- "How do I track burn multiple alongside efficiency metrics?"
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
  const e = await store.get('answers/q103.json', { type: 'json' });
  if (!e) { console.error('q103 not found'); process.exit(1); }
  const ans = e.answer || '';
  fs.writeFileSync(path.join(__dirname, 'q103_raw.md'), ans, 'utf8');

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
        david_sacks: /David Sacks|Craft Ventures/i.test(ans),
        tunguz: /Tunguz|Theory Ventures/i.test(ans),
        lemkin: /Lemkin|SaaStr/i.test(ans),
        christoph_janz: /Christoph Janz|Point Nine/i.test(ans),
        david_skok: /David Skok|Matrix Partners/i.test(ans),
        snowflake: /Snowflake|\bSNOW\b/i.test(ans),
        datadog: /Datadog|DDOG/i.test(ans),
        mongodb: /MongoDB|\bMDB\b/i.test(ans),
        crowdstrike: /CrowdStrike|CRWD/i.test(ans),
        servicenow: /ServiceNow|\bNOW\b/i.test(ans),
        hubspot: /HubSpot|HUBS/i.test(ans),
        atlassian: /Atlassian|\bTEAM\b/i.test(ans),
        asana: /Asana|ASAN/i.test(ans),
        confluent: /Confluent|CFLT/i.test(ans),
        klipfolio: /Klipfolio/i.test(ans),
        bessemer: /Bessemer|BVP|State of the Cloud/i.test(ans),
        openview: /OpenView/i.test(ans),
        meritech: /Meritech/i.test(ans),
        bain: /Bain/i.test(ans),
        mosaic: /Mosaic/i.test(ans),
        bijan_moallemi: /Bijan Moallemi/i.test(ans),
        cube: /\bCube\b/i.test(ans),
        christina_ross: /Christina Ross/i.test(ans),
        pigment: /Pigment/i.test(ans),
        anaplan: /Anaplan/i.test(ans),
        stripe: /Stripe/i.test(ans),
        salesforce: /Salesforce|\bCRM\b/i.test(ans),
        tableau: /Tableau/i.test(ans),
        looker: /Looker/i.test(ans),
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
  console.log('\n--- FIRST 3000 CHARS ---');
  console.log(ans.slice(0, 3000));
  console.log('\n--- HEADER OUTLINE ---');
  const headers = ans.match(/^#{1,3}\s+.+$/gm) || [];
  console.log(headers.join('\n'));
  console.log('\n--- LAST 1800 CHARS ---');
  console.log(ans.slice(-1800));
})().catch(err => { console.error(err); process.exit(1); });
