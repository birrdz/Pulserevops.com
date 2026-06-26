// Parallel DeepSeek Q&A rollout for any pillar. LAW: 3-in-parallel (passcode 4444),
// text-first (images later via Claude), dedup before write+publish+deploy.
// Usage: node _ds_run.js <pillarPrefix> --count=150 --start=<num> [--parallel=3] [--topics=file.json]
const fs = require('fs');
const { dsChat } = require('./_ds_lib');
const { generateGradedBody, pillarKey } = require('./_ds_gen_any');
const { publishTextFirst } = require('./_ds_publish');

const env = (() => { try { const e = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8'); for (const l of e.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {} })();
const { getStore } = require('@netlify/blobs');

const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const PFX = process.argv[2];
const COUNT = parseInt(arg('count', '150'), 10);
const START = parseInt(arg('start', '0'), 10);
const PAR = parseInt(arg('parallel', '3'), 10);
const TOPICS_FILE = arg('topics', '');
if (!PFX || !START) { console.error('usage: node _ds_run.js <pfx> --count=N --start=NUM [--parallel=3] [--topics=f.json]'); process.exit(1); }

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
const LOG = `C:/Users/koryj/website/_ds_run_${PFX}.log`;
const PROG = `C:/Users/koryj/website/_ds_run_${PFX}_progress.json`;
const log = (s) => { fs.appendFileSync(LOG, s + '\n'); console.log(s); };
const idOf = (n) => `${PFX}${String(n).padStart(4, '0')}`;

const EMAIL = 'https://pulserevops.com/.netlify/functions/pulse-progress-notify?key=pulsemachine-writer-2026';
async function email(subject, html) { try { await fetch(EMAIL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject, html }) }); } catch (e) {} }

const PILLAR_DOMAIN = {
  q: 'B2B RevOps / sales / go-to-market, framed around current 2027 events (AI in the funnel, vendor consolidation, longer sales cycles, buying committees)',
  ra: 'revenue architecture: how to architect revenue operations for specific industries and business types',
  gp: 'go-to-market playbooks: concrete GTM motions, launches, segments, and plays',
  ik: 'industry-specific KPIs and revenue metrics (one industry per title)',
  tk: 'recommended software/tech stacks for specific industries and roles',
  st: 'ready-to-run sales training sessions and team meeting templates',
  cg: 'sales coaching questions a manager would ask',
};

async function genTopics(n, existingSet) {
  if (TOPICS_FILE && fs.existsSync(TOPICS_FILE)) {
    return JSON.parse(fs.readFileSync(TOPICS_FILE, 'utf8')).filter((t) => !existingSet.has(norm(t)));
  }
  const domain = PILLAR_DOMAIN[PFX] || PILLAR_DOMAIN.q;
  const out = [];
  const localSeen = new Set();
  let guard = 0;
  while (out.length < n && guard++ < 12) {
    const ask = `Generate ${Math.min(60, n * 2)} distinct, specific, search-worthy ${PFX === 'q' ? 'questions' : 'titles'} about ${domain}. Each must be unique and concrete (name real industries/roles/scenarios where relevant). Return ONLY a JSON array of strings, no prose.`;
    let arr = [];
    try { const r = await dsChat([{ role: 'user', content: ask }], { temperature: 0.9, max_tokens: 4000 }); const m = r.content.match(/\[[\s\S]*\]/); arr = m ? JSON.parse(m[0]) : []; } catch (e) { continue; }
    for (const t of arr) {
      const title = String(t).trim(); const k = norm(title);
      if (!title || existingSet.has(k) || localSeen.has(k)) continue;
      localSeen.add(k); out.push(title); if (out.length >= n) break;
    }
    log(`topics: ${out.length}/${n}`);
  }
  return out;
}

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
  const idx = await store.get('_index.json', { type: 'json' });
  const existing = new Set((idx.entries || []).map((e) => norm(e.question || '')));

  const prog = fs.existsSync(PROG) ? JSON.parse(fs.readFileSync(PROG, 'utf8')) : { done: [], titles: [] };
  const doneSet = new Set(prog.done);
  // restore previously chosen titles into existing-set so we never re-pick them
  for (const t of (prog.titles || [])) existing.add(norm(t));

  const need = COUNT - prog.done.length;
  log(`START ${PFX} rollout — target ${COUNT}, already ${prog.done.length}, need ${need}, parallel ${PAR}`);
  await email(`PULSE ${PFX} rollout START`, `<p>Generating <b>${need}</b> ${PFX} entries text-first via DeepSeek, ${PAR} in parallel. Images deferred to Claude pass.</p>`);
  if (need <= 0) { log('nothing to do'); return; }

  const topics = await genTopics(need, existing);
  if (topics.length < need) log(`WARN only ${topics.length} fresh topics (<${need})`);

  // assign ids sequentially from START, skipping done
  const queue = [];
  let n = START;
  for (const title of topics) { const id = idOf(n++); if (doneSet.has(id)) continue; queue.push({ id, title }); }

  let pub = 0, rej = 0, lastEmail = Date.now();
  let qi = 0;
  async function worker(w) {
    while (qi < queue.length) {
      const item = queue[qi++];
      try {
        if (existing.has(norm(item.title))) { log(`SKIP dup ${item.id} ${item.title}`); continue; }
        const { body, grade } = await generateGradedBody(item.id, item.title, { maxTries: 3 });
        if (!(grade.banned_hits.length === 0 && grade.missing.every((m) => m === 'images_law'))) { rej++; log(`REJ gen ${item.id} ${grade.missing.join('|')} ${grade.banned_hits.join('|')}`); continue; }
        fs.writeFileSync(`C:/Users/koryj/${item.id}_answer.md`, body);
        // dedup re-check immediately before publish
        if (existing.has(norm(item.title))) { log(`SKIP dup@publish ${item.id}`); continue; }
        const r = await publishTextFirst(item.id, item.title, {});
        if (!r.ok) { rej++; log(`REJ pub ${item.id} ${JSON.stringify(r).slice(0, 120)}`); continue; }
        pub++; existing.add(norm(item.title));
        prog.done.push(item.id); prog.titles.push(item.title); fs.writeFileSync(PROG, JSON.stringify(prog, null, 2));
        log(`OK ${item.id} ${r.score}/12 ${r.words}w ${r.url}`);
      } catch (e) { rej++; log(`ERR ${item.id} ${e.message}`); }
      if (Date.now() - lastEmail >= 15 * 60 * 1000) { lastEmail = Date.now(); await email(`PULSE ${PFX} rollout — ${pub} published`, `<p>${PFX}: published <b>${pub}</b>, rejected <b>${rej}</b>, remaining <b>${queue.length - qi}</b>.</p>`); }
    }
  }
  await Promise.all(Array.from({ length: PAR }, (_, w) => worker(w)));

  log(`DONE ${PFX} published=${pub} rejected=${rej} total=${prog.done.length}`);
  await email(`PULSE ${PFX} rollout COMPLETE — ${prog.done.length}/${COUNT}`, `<p>${PFX}: ${prog.done.length} published text-first. Rejected ${rej}. Images deferred to Claude pass.</p>`);
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
