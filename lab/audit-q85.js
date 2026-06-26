// Quick audit of q85 against the 6 gold format elements.
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
  const e = await store.get('answers/q85.json', { type: 'json' });
  if (!e) { console.error('q85 not found'); process.exit(1); }
  const ans = e.answer || '';

  const wordCount = ans.replace(/```[\s\S]*?```/g, ' ').replace(/https?:\/\/\S+/g, ' ').replace(/[#>*_`~|\-=]/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;
  const rawWords = ans.split(/\s+/).filter(Boolean).length;

  const probes = {
    Pavilion: /Pavilion/i.test(ans),
    SamJacobs: /Sam Jacobs/i.test(ans),
    MEDDIC: /MEDDIC|MEDDPICC/i.test(ans),
    DickDunkel: /Dick Dunkel/i.test(ans),
    Bessemer: /Bessemer/i.test(ans),
    OpenView: /OpenView/i.test(ans),
    Clearbit: /Clearbit/i.test(ans),
    ZoomInfo: /ZoomInfo|NASDAQ:ZI/i.test(ans),
    SixSense: /6sense/i.test(ans),
    JasonZintak: /Jason Zintak/i.test(ans),
    Demandbase: /Demandbase/i.test(ans),
    Bombora: /Bombora/i.test(ans),
    LeanData: /LeanData/i.test(ans),
    Crossbeam: /Crossbeam/i.test(ans),
    Reveal: /Reveal/i.test(ans),
    TomaszTunguz: /Tomasz Tunguz|Theory Ventures/i.test(ans),
    DavidSkok: /David Skok|Matrix Partners/i.test(ans),
    ChristophJanz: /Christoph Janz|Point Nine/i.test(ans),
    Salesforce: /Salesforce|NYSE:CRM/i.test(ans),
    Einstein: /Einstein/i.test(ans),
    HubSpot: /HubSpot|NYSE:HUBS/i.test(ans),
    Breeze: /Breeze/i.test(ans),
    Snowflake: /Snowflake|NYSE:SNOW/i.test(ans),
    Datadog: /Datadog|NASDAQ:DDOG/i.test(ans),
    MongoDB: /MongoDB|NASDAQ:MDB/i.test(ans),
    Slack: /Slack/i.test(ans),
    Notion: /Notion/i.test(ans),
    Airtable: /Airtable/i.test(ans),
    Asana: /Asana|NYSE:ASAN/i.test(ans),
    AaronRoss: /Aaron Ross|Predictable Revenue/i.test(ans),
    JasonLemkin: /Jason Lemkin|SaaStr/i.test(ans),
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
      e1_bold_tldr_top: /^\s*\*\*[^*]+\*\*/m.test(ans.slice(0, 4000)),
      e2_h2_banners: (ans.match(/^##\s+/gm) || []).length,
      e3_numbered_subsections: (ans.match(/^###\s+\d+\.\s+/gm) || []).length,
      e4_bullets_with_bold: (ans.match(/^[-*]\s+\*\*[^*]+\*\*/gm) || []).length,
      e6_inline_links: (ans.match(/\]\(https?:\/\//g) || []).length,
      e6_numbered_sources: /\n##\s+Sources/i.test(ans),
    },
    real_names: probes,
    real_names_hit: probesHit + '/' + probesTotal,
  };

  console.log(JSON.stringify(audit, null, 2));
  fs.writeFileSync(path.join(__dirname, 'q85_current.md'), ans, 'utf8');
  console.log('\nWritten q85_current.md (' + ans.length + ' chars)');
})();
