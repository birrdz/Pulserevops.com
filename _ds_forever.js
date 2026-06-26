// CONTINUOUS 3-at-a-time DeepSeek Q&A engine across pillars (LAWS 2026-06-23):
//  - 3 in parallel, continuously, until owner says stop (passcode 4444) -> create _ds_stop.flag
//  - DeepSeek = all text, text-first (images later via Claude)
//  - dedup before write + before publish (global normalized-title set)
// Targets +TARGET new entries per Q&A pillar, rotating across pillars.
// Usage: node _ds_forever.js [--target=150] [--parallel=3]
const fs = require('fs');
const { dsChat, todaySpend, DAILY_CAP } = require('./_ds_lib');
const { generateGradedBody } = require('./_ds_gen_any');
const { publishTextFirst } = require('./_ds_publish');
try { const e = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8'); for (const l of e.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
const { getStore } = require('@netlify/blobs');

const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const TARGET = parseInt(arg('target', '150'), 10);
const PAR = parseInt(arg('parallel', '3'), 10);
const HOURS = parseFloat(arg('hours', '0'));
const DEADLINE = HOURS > 0 ? Date.now() + HOURS * 3600 * 1000 : 0;
const STOP_FLAG = 'C:/Users/koryj/website/_ds_stop.flag';
const PROG = 'C:/Users/koryj/website/_ds_forever_progress.json';
const LOG = 'C:/Users/koryj/website/_ds_forever.log';
const DS_KEY = process.env.DEEPSEEK_API_KEY || process.env.ds1;
const log = (s) => { const line = `${new Date().toISOString().slice(11, 19)} ${s}`; fs.appendFileSync(LOG, line + '\n'); console.log(line); };
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();

const PILLARS = ['q', 'ra', 'gp', 'ik', 'tk', 'st', 'cg'];
const DOMAIN = {
  q: 'B2B RevOps / sales / GTM, framed around current 2027 events (AI in the funnel, vendor consolidation, longer cycles, buying committees)',
  ra: 'revenue architecture: how to architect revenue operations for specific industries and business types (one per title)',
  gp: 'go-to-market playbooks: concrete GTM motions, launches, segments, plays',
  ik: 'industry-specific KPIs / revenue metrics (one industry per title)',
  tk: 'recommended software/tech stacks for specific industries and roles',
  st: 'ready-to-run sales training session / team-meeting templates',
  cg: 'sales coaching questions a manager would ask (mix general Q&A + Top 10)',
};
const EMAIL = 'https://pulserevops.com/.netlify/functions/pulse-progress-notify?key=pulsemachine-writer-2026';
const email = async (s, h) => { try { await fetch(EMAIL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject: s, html: h }) }); } catch (e) {} };

async function balance() { try { const r = await fetch('https://api.deepseek.com/user/balance', { headers: { Authorization: 'Bearer ' + DS_KEY } }); const j = await r.json(); return parseFloat(j.balance_infos[0].total_balance); } catch (e) { return null; } }

(async () => {
  try { fs.unlinkSync(STOP_FLAG); } catch (e) {} // fresh start clears any old flag
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
  const idx = await store.get('_index.json', { type: 'json' });
  const seen = new Set((idx.entries || []).map((e) => norm(e.question || '')));

  const prog = fs.existsSync(PROG) ? JSON.parse(fs.readFileSync(PROG, 'utf8')) : { counts: {}, nextId: {}, titles: [] };
  for (const t of (prog.titles || [])) seen.add(norm(t));
  // init per-pillar id counters + published counts
  for (const p of PILLARS) {
    if (prog.nextId[p] == null) {
      const max = (idx.entries || []).filter((e) => e && new RegExp(`^${p}\\d+$`).test(e.id)).map((e) => parseInt(e.id.slice(p.length), 10)).reduce((a, b) => Math.max(a, b), 0);
      prog.nextId[p] = max + 1;
    }
    if (prog.counts[p] == null) prog.counts[p] = 0;
  }
  fs.writeFileSync(PROG, JSON.stringify(prog, null, 2));

  // Two pools per pillar for the 1:1 LAW: Top-10 entries + regular single-answer.
  const pool = Object.fromEntries(PILLARS.map((p) => [p, { top10: [], regular: [] }]));
  async function refill(p, kind) {
    const ask = kind === 'top10'
      ? `Generate 40 distinct "Top 10 ..." ranking titles about ${DOMAIN[p]}. Each MUST start with "Top 10 ", be unique and concrete. Return ONLY a JSON array of strings.`
      : `Generate 40 distinct, specific, search-worthy ${p === 'q' || p === 'cg' ? 'questions (each a single clear question)' : 'titles'} about ${DOMAIN[p]}. Each unique and concrete, NOT a "Top 10" list. Return ONLY a JSON array of strings.`;
    try { const r = await dsChat([{ role: 'user', content: ask }], { temperature: 0.95, max_tokens: 4000 }); const m = r.content.match(/\[[\s\S]*\]/); const arr = m ? JSON.parse(m[0]) : []; for (const t of arr) { const title = String(t).trim(); if (title && !seen.has(norm(title)) && !pool[p][kind].some((x) => norm(x) === norm(title))) pool[p][kind].push(title); } } catch (e) { log(`refill ${p}/${kind} err ${e.message}`); }
  }

  function pillarsNeeding() { return PILLARS.filter((p) => prog.counts[p] < TARGET); }
  let rr = 0;
  async function nextTask() {
    const need = pillarsNeeding();
    if (!need.length) return null;
    const p = need[rr++ % need.length];
    const kind = (prog.counts[p] % 2 === 0) ? 'top10' : 'regular'; // strict 1:1 alternation
    if (pool[p][kind].length === 0) { await refill(p, kind); if (pool[p][kind].length === 0) return 'retry'; }
    let title = null;
    while (pool[p][kind].length) { const cand = pool[p][kind].shift(); if (!seen.has(norm(cand))) { title = cand; break; } }
    if (!title) return 'retry';
    seen.add(norm(title)); // claim now (dedup before write)
    const id = `${p}${String(prog.nextId[p]++).padStart(4, '0')}`;
    return { p, id, title, kind };
  }

  let pub = 0, rej = 0, lastEmail = Date.now(), lastEmailCount = 0, paused = false;
  const bal0 = await balance();
  log(`START forever — target ${TARGET}/pillar, parallel ${PAR}, balance $${bal0}`);
  await email('PULSE continuous engine START', `<p>3-in-parallel DeepSeek Q&A engine running continuously across ${PILLARS.join(', ')} — target <b>${TARGET}</b> new each, text-first. Balance $${bal0}. Stops on _ds_stop.flag or your 4444 stop.</p>`);

  async function worker(w) {
    while (true) {
      if (fs.existsSync(STOP_FLAG)) { log(`worker ${w} stop flag`); return; }
      if (DEADLINE && Date.now() > DEADLINE) { log(`worker ${w} 3h deadline reached`); return; }
      // balance guard
      if (pub > 0 && pub % 30 === 0 && !paused) { const b = await balance(); if (b != null && b < 0.5) { paused = true; log(`PAUSE balance $${b}`); await email('PULSE engine PAUSED — DeepSeek balance low', `<p>Balance $${b}. Top up at platform.deepseek.com; delete _ds_stop.flag-style pause by re-running. Published so far: ${pub}.</p>`); fs.writeFileSync(STOP_FLAG, 'low-balance'); return; } }
      const task = await nextTask();
      if (task === null) { log(`worker ${w} done (all targets met)`); return; }
      if (task === 'retry') { await new Promise((r) => setTimeout(r, 500)); continue; }
      try {
        const { body, grade } = await generateGradedBody(task.id, task.title, { maxTries: 2, kind: task.kind });
        if (!(grade.banned_hits.length === 0 && grade.missing.every((m) => m === 'images_law'))) { rej++; log(`REJ ${task.id} ${task.kind} ${grade.missing.join('|')} ${grade.banned_hits.join('|')}`); continue; }
        fs.writeFileSync(`C:/Users/koryj/${task.id}_answer.md`, body);
        const r = await publishTextFirst(task.id, task.title, {});
        if (!r.ok) { rej++; log(`REJ pub ${task.id} ${(r.missing || []).join('|')}`); continue; }
        pub++; prog.counts[task.p]++; prog.titles.push(task.title); fs.writeFileSync(PROG, JSON.stringify(prog, null, 2));
        log(`OK ${task.id} [${task.p} ${prog.counts[task.p]}/${TARGET}] ${task.kind} ${r.score}/12 ${r.words}w`);
      } catch (e) { rej++; log(`ERR ${task.id} ${e.message}`); }
      // COUNT-BASED heartbeat (FOUNDATIONAL LAW 2026-06-23): email every 10 things shipped,
      // not on a clock. Runs forever; only owner code 4444 changes/disables it.
      if (pub > 0 && pub - lastEmailCount >= 10) { const batch = pub - lastEmailCount; lastEmailCount = pub; lastEmail = Date.now(); const tally = PILLARS.map((p) => `${p}:${prog.counts[p]}`).join(' '); const sp = todaySpend(); await email(`PULSE engine — ${pub} shipped (+${batch})`, `<p>Just shipped <b>${batch} more</b> — <b>${pub}</b> published this run, rejected ${rej}.</p><p>Per pillar (target ${TARGET}): ${tally}</p><p>DeepSeek spend today: <b>$${(sp.spent || 0).toFixed(2)}</b> / $${DAILY_CAP} cap · ${sp.calls || 0} calls</p>`); }
    }
  }
  await Promise.all(Array.from({ length: PAR }, (_, w) => worker(w)));
  const tally = PILLARS.map((p) => `${p}:${prog.counts[p]}`).join(' ');
  log(`STOPPED forever published=${pub} rejected=${rej} | ${tally}`);
  await email('PULSE continuous engine STOPPED', `<p>Published <b>${pub}</b> this run, rejected ${rej}.</p><p>Per pillar: ${tally}</p>`);
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
