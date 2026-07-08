// _baton_pass.js — every 3 hours, write a fresh "BATON PASS" snapshot so a NEW
// Claude Code session can take over cleanly (owner's 3-hour crossover cadence,
// 2026-06-27). Reads the live index, tallies each sprint pillar vs its target,
// and writes _BATON_PASS.md. Pure data snapshot — the durable plan lives in
// _SPRINT_BACKLOG.md + _HANDOFF_NEXT_CLAUDE.md. Background loop; dies on session
// close (relaunch each session).
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

// pillar prefix -> [label, +N target this campaign]
const SPRINTS = [
  ['sp','Speeches',400],['cl','Clubs',300],['co','Collectibles',300],['ev','Events',300],
  ['gm','Gaming',300],['ga','Gatherings',300],['gp','GTM',300],['ik','Industry KPIs',400],
  ['lv','Living',300],['mv','Movies',300],['nl','Nightlife',300],['rs','Resorts',300],
  ['er','Reviews',400],['st','Sales Trainings',300],['sc','Schools',300],['sy','Style',500],
  ['tk','Tech Stacks',300],['tl','Tools',300],['tn','Towns',500],['tv','Travel',500],['wl','Wellness',400],
];
const THREE_H = 3 * 3600 * 1000;

async function snapshot() {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const count = {};
  for (const e of idx.entries) { const m = String(e && e.id).match(/^([a-z]+)\d+$/); if (m) count[m[1]] = (count[m[1]] || 0) + 1; }
  const ts = new Date().toISOString();
  let md = `# 🪃 BATON PASS — live snapshot for the next Claude Code\n\n`;
  md += `_Refreshed ${ts} (auto, every 3h via _baton_pass.js). Plan + mechanism: read **_SPRINT_BACKLOG.md** and **_HANDOFF_NEXT_CLAUDE.md** first._\n\n`;
  md += `**Index total:** ${idx.entries.length.toLocaleString()} entries\n\n`;
  md += `| Pillar | Live | Sprint target | \n|---|---|---|\n`;
  for (const [p, label, tgt] of SPRINTS) md += `| ${label} (${p}) | ${count[p] || 0} | +${tgt} | \n`;
  md += `\n> ONE Claude writer at a time (owner rule). Speeches → _sp_writer_spec.md + _write_sp.js. Top-10 pillars → electronicreview grader + _write_<p>.js. Seed via _seed_<p>300.js → _<p>_sprint_queue.json → serial workflow (for-loop + await agent, NOT parallel). DEPLOY is harness-blocked — content is deploy-free via blobs; _do_deploy.sh staged for owner.\n`;
  md += `\n**SEO ops (recurring):** SF-style crawl audit → \`node _sf_crawl_audit.js --quick --compare\` weekly; full runbook **\`_SF_CRAWL_PROCESS.md\`**. Post-publish pings → \`_indexnow_delta.js\`. Pre/post deploy spot-check → \`--quick --limit=500\`.\n`;
  fs.writeFileSync('C:/Users/koryj/website/_BATON_PASS.md', md);
  console.log(new Date().toISOString(), 'baton snapshot written; index', idx.entries.length);
}

const PAUSE_FLAG = 'C:/Users/koryj/website/_PAUSE_WRITERS.flag';
(async () => {
  await snapshot(); // initial snapshot at session start (no pause — work block begins)
  // ONE-SHOT: 3h from now, write the story + pause WRITERS. DDG keeps running.
  // Owner then opens a fresh Claude Code, says "check logs", and takes it from there.
  setTimeout(() => {
    snapshot().catch(e => console.error('baton err', e.message));
    try {
      fs.writeFileSync(PAUSE_FLAG, new Date().toISOString() + ' — 3h BATON MARK. WRITERS PAUSED; only the DDG image lane keeps running. NEXT CLAUDE CODE (owner will say "check logs"): read _BATON_PASS.md + _SPRINT_BACKLOG.md + _HANDOFF_NEXT_CLAUDE.md, then `rm _PAUSE_WRITERS.flag` and resume the writers (one at a time) for the next 3h block.\n');
      console.log(new Date().toISOString(), '3h BATON: writers paused (flag set); DDG continues; awaiting new Claude.');
    } catch (e) { console.error('pause-flag err', e.message); }
  }, THREE_H);
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
