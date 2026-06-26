// Seed a NEW pillar with N entries (Top-10 + general Q&A mix, text-first via
// DeepSeek). Ratio is per-pillar discretion (LAW 2026-06-23). 3-parallel, dedup.
// Usage: node _ds_pillar_seed.js <prefix> --top10=N --qa=M --domain="..." [--start=1] [--parallel=3]
const fs = require('fs');
const { dsChat } = require('./_ds_lib');
const { generateGradedBody } = require('./_ds_gen_any');
const { publishTextFirst } = require('./_ds_publish');
try { const e = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8'); for (const l of e.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
const { getStore } = require('@netlify/blobs');

const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const PFX = process.argv[2];
const NTOP = parseInt(arg('top10', '13'), 10);
const NQA = parseInt(arg('qa', '12'), 10);
const DOMAIN = arg('domain', '');
const PAR = parseInt(arg('parallel', '3'), 10);
let nextN = parseInt(arg('start', '1'), 10);
if (!PFX || !DOMAIN) { console.error('usage: node _ds_pillar_seed.js <prefix> --top10=N --qa=M --domain="..." [--start=1]'); process.exit(1); }

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
const LOG = `C:/Users/koryj/website/_ds_seed_${PFX}.log`;
const log = (s) => { fs.appendFileSync(LOG, s + '\n'); console.log(s); };
const EMAIL = 'https://pulserevops.com/.netlify/functions/pulse-progress-notify?key=pulsemachine-writer-2026';
const email = async (s, h) => { try { await fetch(EMAIL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject: s, html: h }) }); } catch (e) {} };

async function topics(kind, n, seen) {
  const ask = kind === 'top10'
    ? `Generate ${Math.max(20, n * 2)} distinct "Top 10 ... for 2027" ranking titles about ${DOMAIN}. Each starts with "Top 10 ", concrete, unique. Return ONLY a JSON array of strings.`
    : `Generate ${Math.max(20, n * 2)} distinct, specific general questions a real person would Google about ${DOMAIN} (NOT "Top 10" lists). Return ONLY a JSON array of strings.`;
  const out = [];
  for (let g = 0; g < 6 && out.length < n; g++) {
    try { const r = await dsChat([{ role: 'user', content: ask }], { temperature: 0.95, max_tokens: 3500 }); const m = r.content.match(/\[[\s\S]*\]/); const arr = m ? JSON.parse(m[0]) : []; for (const t of arr) { const title = String(t).trim(); if (title && !seen.has(norm(title)) && !out.some((x) => norm(x) === norm(title))) out.push(title); if (out.length >= n) break; } } catch (e) {}
  }
  return out;
}

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
  const idx = await store.get('_index.json', { type: 'json' });
  const seen = new Set((idx.entries || []).map((e) => norm(e.question || '')));

  log(`START seed ${PFX} — ${NTOP} top10 + ${NQA} qa`);
  await email(`PULSE ${PFX} pillar seed START`, `<p>Seeding <b>${PFX}</b> with ${NTOP} Top-10 + ${NQA} Q&A (text-first via DeepSeek).</p>`);

  const topList = await topics('top10', NTOP, seen);
  const qaList = await topics('qa', NQA, seen);
  const queue = [];
  for (const t of topList) { queue.push({ id: `${PFX}${String(nextN++).padStart(4, '0')}`, title: t, kind: 'top10' }); }
  for (const t of qaList) { queue.push({ id: `${PFX}${String(nextN++).padStart(4, '0')}`, title: t, kind: 'qa' }); }

  let pub = 0, rej = 0, qi = 0;
  async function worker() {
    while (qi < queue.length) {
      const it = queue[qi++];
      if (seen.has(norm(it.title))) { log(`SKIP dup ${it.id}`); continue; }
      try {
        const { body, grade } = await generateGradedBody(it.id, it.title, { maxTries: 2, kind: it.kind });
        if (!(grade.banned_hits.length === 0 && grade.missing.every((m) => m === 'images_law'))) { rej++; log(`REJ ${it.id} ${it.kind} ${grade.missing.join('|')}`); continue; }
        fs.writeFileSync(`C:/Users/koryj/${it.id}_answer.md`, body);
        const r = await publishTextFirst(it.id, it.title, {});
        if (!r.ok) { rej++; log(`REJ pub ${it.id}`); continue; }
        pub++; seen.add(norm(it.title)); log(`OK ${it.id} ${it.kind} ${r.score}/12 ${r.words}w ${r.url}`);
      } catch (e) { rej++; log(`ERR ${it.id} ${e.message}`); }
    }
  }
  await Promise.all(Array.from({ length: PAR }, () => worker()));
  log(`DONE seed ${PFX} published=${pub} rejected=${rej}`);
  await email(`PULSE ${PFX} pillar seed COMPLETE`, `<p>${PFX}: published <b>${pub}</b>, rejected ${rej}. Text-first; images later.</p>`);
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
