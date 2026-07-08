// _top_traffic.js — rank the top-N library entries by real human traffic
// (pulse-view-counts), join with titles/pillars from _index.json, and save a
// reusable list the writers can build similar new entries from.
// Outputs: _top50_traffic.json (data) + _TOP50_TRAFFIC.md (readable).
//   node _top_traffic.js [N]   (default 50)
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const tok = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const sid = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const N = parseInt(process.argv[2] || '50', 10);
const PILLAR = { q: 'Knowledge/RevOps Q&A', ik: 'Industry KPIs', tk: 'Tech Stacks', st: 'Sales Trainings', cg: 'Coaching', ra: 'Revenue Architecture', gp: 'GTM Playbooks', tl: 'Tools', er: 'Electronic Reviews', fr: 'Franchises', ca: 'Cars', co: 'Collectibles', aq: 'Aquariums', hf: 'HS Football', ai: 'AI Infrastructure', sp: 'Speeches', sy: 'Style', bs: 'Book Summaries', gb: 'Graphics', sw: 'Software' };

(async () => {
  const vs = getStore({ name: 'pulse-view-counts', siteID: sid, token: tok });
  const lib = getStore({ name: 'pulse-machine-library', siteID: sid, token: tok });
  const c = await vs.get('counts.json', { type: 'json' });
  const idx = await lib.get('_index.json', { type: 'json', consistency: 'strong' });
  const titleById = new Map((idx.entries || []).map(e => [e.id, e.question || '']));
  const rows = Object.entries(c.entries || {})
    .map(([id, v]) => ({ id, total: v.total || 0, last7: Object.entries(v.days || {}).filter(([d]) => (Date.now() - Date.parse(d)) < 7 * 864e5).reduce((s, [, n]) => s + n, 0) }))
    .filter(r => titleById.has(r.id))            // only live entries
    .sort((a, b) => b.total - a.total)
    .slice(0, N)
    .map((r, i) => {
      const pfx = (r.id.match(/^([a-z]+)/i) || [])[1];
      return { rank: i + 1, id: r.id, total: r.total, last7: r.last7, pillar: PILLAR[pfx] || pfx, title: titleById.get(r.id) };
    });

  fs.writeFileSync('C:/Users/koryj/website/_top50_traffic.json', JSON.stringify(rows, null, 1));
  let md = `# 🏆 TOP ${N} PERFORMING ENTRIES BY TRAFFIC\n\n`;
  md += `_Source: pulse-view-counts (real human views, bot-filtered). Regenerate: \`node _top_traffic.js ${N}\`. Use this to spawn similar new Q&As — match the topic/angle of the winners._\n\n`;
  md += `| # | Views | Last 7d | Pillar | ID | Question |\n|---|---|---|---|---|---|\n`;
  for (const r of rows) md += `| ${r.rank} | ${r.total} | ${r.last7} | ${r.pillar} | ${r.id} | ${r.title.replace(/\|/g, '/')} |\n`;
  // theme summary — which pillars dominate the top N
  const byPillar = {};
  for (const r of rows) byPillar[r.pillar] = (byPillar[r.pillar] || 0) + 1;
  md += `\n## Pillar breakdown of the top ${N}\n`;
  for (const [p, n] of Object.entries(byPillar).sort((a, b) => b[1] - a[1])) md += `- **${p}**: ${n}\n`;
  fs.writeFileSync('C:/Users/koryj/website/_TOP50_TRAFFIC.md', md);
  console.log(`saved _top50_traffic.json + _TOP50_TRAFFIC.md (top ${N}).`);
  console.log('Top pillars:', Object.entries(byPillar).sort((a, b) => b[1] - a[1]).map(([p, n]) => `${p}:${n}`).join(', '));
  console.log('\nTop 10:');
  rows.slice(0, 10).forEach(r => console.log(`  ${r.rank}. [${r.total}] ${r.id} — ${r.title.slice(0, 70)}`));
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
