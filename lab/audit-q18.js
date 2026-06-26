// Quick audit of q18 against the 6 gold format elements.
// q18 -- "What's the right SDR-to-AE ratio at a $5M ARR seed-stage company?"
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
  const e = await store.get('answers/q18.json', { type: 'json' });
  if (!e) { console.error('q18 not found'); process.exit(1); }
  const ans = e.answer || '';
  fs.writeFileSync(path.join(__dirname, 'q18_raw.md'), ans, 'utf8');

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
        bridge_group: /Bridge Group/i.test(ans),
        openview: /OpenView/i.test(ans),
        pavilion: /Pavilion/i.test(ans),
        sam_jacobs: /Sam Jacobs/i.test(ans),
        aaron_ross: /Aaron Ross|Predictable Revenue/i.test(ans),
        saastr: /SaaStr/i.test(ans),
        jason_lemkin: /Jason Lemkin|Lemkin/i.test(ans),
        tunguz: /Tunguz|Theory Ventures/i.test(ans),
        david_skok: /David Skok|Matrix Partners/i.test(ans),
        janz: /Christoph Janz|Point Nine/i.test(ans),
        eleven_x: /\b11x\b|Hassaan Raza/i.test(ans),
        regie: /Regie\.ai|Regie/i.test(ans),
        apollo: /\bApollo\b|Tim Zheng/i.test(ans),
        zoominfo: /ZoomInfo|\bZI\b/i.test(ans),
        clay: /\bClay\b|Kareem Amin/i.test(ans),
        outreach: /Outreach/i.test(ans),
        manny_medina: /Manny Medina/i.test(ans),
        salesloft: /Salesloft/i.test(ans),
        vista: /\bVista\b/i.test(ans),
        david_obrand: /David Obrand/i.test(ans),
        gong: /\bGong\b/i.test(ans),
        amit_bendov: /Amit Bendov/i.test(ans),
        hubspot: /HubSpot|HUBS/i.test(ans),
        snowflake: /Snowflake|\bSNOW\b/i.test(ans),
        datadog: /Datadog/i.test(ans),
        salesforce: /Salesforce|\bCRM\b/i.test(ans),
        a16z: /Andreessen Horowitz|\ba16z\b/i.test(ans),
        sequoia: /Sequoia/i.test(ans),
        bessemer: /Bessemer/i.test(ans),
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
