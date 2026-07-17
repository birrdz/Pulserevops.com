// gen_daemon.js — AUTONOMOUS HOURLY Q&A GENERATOR (per HOURLY_GENERATOR.md + PIPELINE_GENERATION_PROMPTS.md).
// Wakes on the hour, generates golden-template Q&As across topics, gates each at 13/13, similarity-at-birth
// scans vs its topic, publishes only on pass. Reads gen/config.json HOT at the top of every cycle — the
// operator's dashboard is the only thing that can change the rate; the daemon NEVER raises its own rate.
//
// RUNTIME INDEPENDENCE LAW: zero Claude/Anthropic calls here. Prose = DeepSeek (_ds_lib). Images = existing
// provider ladder via the publish path. Claude built this; Claude does not run inside it.
//
// Usage:
//   node gen_daemon.js --proof[=N]   one dry batch of N (default 10): generate + 13/13 gate-SCORE only,
//                                     print scores + would-be URLs, PUBLISH NOTHING. Awaits operator GO.
//   node gen_daemon.js --once        one live batch now (respects config; publishes on 13/13 pass).
//   node gen_daemon.js               daemon: run a live batch at the top of every hour, forever.
'use strict';
const fs = require('fs');
const crypto = require('crypto');
const WD = 'C:/Users/koryj/website';
for (const l of (() => { try { return fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/); } catch (e) { return []; } })()) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const { dsChat, todaySpend } = require('./_ds_lib');
const { claudeChat } = require('./_claude_chat');
// Generator writer: Claude Code first (Max-plan, hits the golden template far closer to 13/13),
// DeepSeek fallback (owner 2026-07-14 — "use Claude Code for the writing").
async function genWrite(messages, opts) {
  try {
    const r = await claudeChat(messages, { timeoutMs: 240000 });
    const t = (r && (r.content || r.text)) || (typeof r === 'string' ? r : '');
    if (t && t.length > 400) return { content: t };
  } catch (e) {}
  return await dsChat(messages, opts || {});
}
const { publishTextFirst } = require('./_ds_publish');   // real new-entry publish: blob + _index.json insert + URL (images deferred)

const GEN = WD + '/gen';
try { fs.mkdirSync(GEN, { recursive: true }); } catch (e) {}
const CONFIG_F = GEN + '/config.json';
const STATUS_F = GEN + '/run_status.json';
const BANK_F = GEN + '/question_bank.json';
const FAILS_F = GEN + '/gen_failures.md';
const DAILY_F = GEN + '/daily_log.md';
const USED_F = GEN + '/used_questions.json';
const SUGGEST_F = GEN + '/topic_suggestions.json';   // pointed topics from the panel (owner 2026-07-15)
const LAP_F = GEN + '/lap_state.json';
const TODAY_F = GEN + '/today_stats.json';
const GATE_URL = 'http://localhost:8899/gate-publish';   // rubricSignOff 13/13 gate (scrub server)
const GATE_KEY = '4444';
const SIM_THRESHOLD = 0.70;   // similarity-at-birth (LAW-SIM)

const readJSON = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } };
const writeJSON = (f, o) => { try { fs.writeFileSync(f, JSON.stringify(o, null, 1)); } catch (e) {} };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const nowISO = () => new Date().toISOString();
const logFail = (id, why) => { try { fs.appendFileSync(FAILS_F, `- ${nowISO()} · ${id} · ${why}\n`); } catch (e) {} };
const setStatus = o => writeJSON(STATUS_F, Object.assign(readJSON(STATUS_F, {}), o, { updated: nowISO() }));

/** Local calendar day (owner timezone EST/EDT) for "done today" counter. */
function todayKey() {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  } catch (e) {
    return new Date().toLocaleDateString('en-CA');
  }
}
function loadTodayStats() {
  const key = todayKey();
  let st = readJSON(TODAY_F, null);
  if (!st || st.date !== key) {
    let done = 0, passed = 0, published = 0;
    try {
      for (const line of fs.readFileSync(DAILY_F, 'utf8').split(/\r?\n/)) {
        const iso = line.match(/(\d{4}-\d{2}-\d{2}T[\d:.]+Z)/);
        if (!iso) continue;
        const etDay = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(iso[1]));
        if (etDay !== key) continue;
        const g = line.match(/generated\s+(\d+)/i);
        const p = line.match(/passed\s+(\d+)/i);
        const pub = line.match(/published\s+(\d+)/i);
        if (g) done += parseInt(g[1], 10) || 0;
        if (p) passed += parseInt(p[1], 10) || 0;
        if (pub) published += parseInt(pub[1], 10) || 0;
      }
    } catch (e) {}
    st = { date: key, done, passed, published };
    writeJSON(TODAY_F, st);
  }
  return st;
}
function bumpTodayStats(r) {
  const st = loadTodayStats();
  st.done = (Number(st.done) || 0) + 1;
  if (r && r.pass) st.passed = (Number(st.passed) || 0) + 1;
  if (r && r.published) st.published = (Number(st.published) || 0) + 1;
  writeJSON(TODAY_F, st);
  return st;
}
function todayStatusFields() {
  const st = loadTodayStats();
  return {
    todayDate: st.date,
    todayDone: Number(st.done) || 0,
    todayPassed: Number(st.passed) || 0,
    todayPublished: Number(st.published) || 0,
  };
}

// ── CONFIG (single source of truth; re-read HOT every cycle; daemon never edits rate fields) ──
const CONFIG_DEFAULTS = { fixConcurrency: 10, fixScope: 'ALL', entriesPerHour: 10, perTopicPerHour: null, genTopics: 'ALL', runHours: 2, runUntil: null, paused: false, deployEveryHours: 0, pillarLap: false, genNotes: '' };
function loadConfig() {
  const c = Object.assign({}, CONFIG_DEFAULTS, readJSON(CONFIG_F, {}));
  const b = (c._bounds) || {};
  const clamp = (v, k, dflt) => { if (v == null) return dflt; const [lo, hi] = b[k] || [dflt, dflt]; return Math.max(lo, Math.min(hi, v)); };
  if (c.entriesPerHour != null) c.entriesPerHour = clamp(c.entriesPerHour, 'entriesPerHour', 10);
  if (c.perTopicPerHour != null) c.perTopicPerHour = clamp(c.perTopicPerHour, 'perTopicPerHour', 5);
  c.pillarLap = !!c.pillarLap;
  delete c.maxPerHour; // retired
  return c;
}
// Effective batch size for THIS hour from the active rate knob. Never self-raised.
function effectiveBatch(cfg, topics) {
  if (cfg.pillarLap) return 1;
  let n;
  if (cfg.perTopicPerHour != null && cfg.entriesPerHour == null) n = cfg.perTopicPerHour * Math.max(1, topics.length);
  else n = (cfg.entriesPerHour != null ? cfg.entriesPerHour : 10);
  return Math.max(0, n);
}
function withinRunWindow(cfg) {
  if (!cfg.runUntil) return true; // no deadline set — keep going until STOP
  const until = Date.parse(cfg.runUntil);
  if (!Number.isFinite(until)) return true;
  if (Date.now() <= until) return true;
  // expired → auto-stop
  try {
    const file = readJSON(CONFIG_F, {});
    file.paused = true;
    file.runUntil = null;
    writeJSON(CONFIG_F, file);
  } catch (e) {}
  return false;
}

// ── topic universe (pillars) from the live index ──
const PNAMES = { tl:'Pulse Tools', ca:'Cars', bt:'Boats', aq:'Aquariums', ik:'Industry KPIs', tk:'Tech Stacks', bs:'Book Summaries', st:'Sales Trainings', fr:'Franchises', co:'Collectibles', ai:'AI Infra', gb:'Graphics', bo:'Buildouts', sy:'Style', gp:'GTM Playbooks', ra:'Rev Architecture', pt:'Pets', es:'Espresso', tv:'TVs', rs:'Resorts', cl:'Cologne', lv:'Lux Vacations', ev:'Events', ga:'Gatherings', gm:'Gaming', mv:'Movies', wl:'Wellness', dn:'Dining', nl:'Nightlife', tn:'Towns', sc:'Schools', tc:'Telco', er:'Electronics', q:'Q&A', hf:'Home & Family', sw:'Software', sk:'Skill Drills', sp:'Sports', dr:'Drills' };
const pOf = id => (String(id).match(/^([a-z]+)\d/i) || [, ''])[1].toLowerCase();

let _idxCache = null;
async function loadIndex() { if (!_idxCache) _idxCache = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] }; return _idxCache; }
function invalidateIndex() { _idxCache = null; }

async function pillarsFromIndex() {
  const idx = await loadIndex();
  const byP = {};
  for (const e of (idx.entries || [])) { if (!e || !e.id || /^vq_/i.test(e.id)) continue; const p = pOf(e.id); if (p && PNAMES[p]) byP[p] = (byP[p] || 0) + 1; }   // ONLY real, known pillars — never malformed id prefixes
  return Object.keys(byP).sort((a, b) => byP[a] - byP[b]);   // smallest-first (fair rotation)
}
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}
/** Daily Driver: one pillar per tick, random order each lap; finish every pillar before a new lap. */
function nextLapPillar(allPillars) {
  const all = (allPillars && allPillars.length) ? allPillars.slice() : Object.keys(PNAMES).sort();
  let st = readJSON(LAP_F, null);
  if (!st || !Array.isArray(st.order) || !st.order.length || st.index == null || st.index >= st.order.length) {
    st = { lap: (st && st.lap ? st.lap : 0) + 1, order: shuffle(all), index: 0, last: st && st.last || null };
  }
  // Drop unknown codes if PNAMES changed
  st.order = st.order.filter(p => PNAMES[p] || all.includes(p));
  if (!st.order.length) st.order = shuffle(all);
  if (st.index >= st.order.length) {
    st.lap = (st.lap || 0) + 1;
    st.order = shuffle(all);
    st.index = 0;
  }
  const pillar = st.order[st.index];
  st.last = pillar;
  st.lastName = PNAMES[pillar] || pillar;
  st.index += 1;
  st.done = st.index;
  st.total = st.order.length;
  st.next = st.index < st.order.length ? st.order[st.index] : null;
  st.nextName = st.next ? (PNAMES[st.next] || st.next) : null;
  writeJSON(LAP_F, st);
  return { pillar, lap: st };
}
async function topicsForBatch(cfg) {
  const all = await pillarsFromIndex();
  const universe = all.length ? all : Object.keys(PNAMES).sort();
  if (cfg.pillarLap) {
    const { pillar, lap } = nextLapPillar(universe);
    setStatus({
      pillarLap: true,
      mode: 'pillarLap',
      lap: { lap: lap.lap, done: lap.done, total: lap.total, last: lap.last, lastName: lap.lastName, next: lap.next, nextName: lap.nextName },
      note: 'Daily Driver · lap #' + lap.lap + ' · ' + lap.done + '/' + lap.total + ' · now ' + (PNAMES[pillar] || pillar)
    });
    return [pillar];
  }
  if (Array.isArray(cfg.genTopics)) {
    if (!cfg.genTopics.length) return []; // cleared — generate nothing
    return cfg.genTopics.map(t => String(t).toLowerCase()).filter(t => PNAMES[t]);
  }
  if (cfg.genTopics && cfg.genTopics !== 'ALL') {
    const one = String(cfg.genTopics).toLowerCase();
    return PNAMES[one] ? [one] : universe;
  }
  // ALL → rotation: advance a persistent cursor so every topic gets served over time
  const st = readJSON(STATUS_F, {});
  const cur = Number.isInteger(st.rotationCursor) ? st.rotationCursor : 0;
  setStatus({ rotationCursor: (cur + 1) % Math.max(1, universe.length) });
  return universe.slice(cur).concat(universe.slice(0, cur));   // rotate start point
}

// ── question supply: seed patterns per topic + dedupe vs existing titles + used bank ──
const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
function seedQuestions(pillar, name) {
  const T = name || PNAMES[pillar] || pillar;
  // General + Top-list intent seeds; the classifier routes each to the right golden template.
  return [
    `What is the best way to approach ${T} in 2027?`,
    `How do you get started with ${T} in 2027?`,
    `What should you know before investing in ${T} in 2027?`,
    `Top 10 best ${T} options in 2027`,
    `How much does ${T} cost in 2027?`,
    `What are the most common mistakes in ${T} in 2027?`,
    `Is ${T} worth it in 2027?`,
    `Top 10 ${T} strategies for 2027`,
  ];
}
async function pickQuestions(pillar, count, opts) {
  opts = opts || {};
  const idx = await loadIndex();
  const existing = new Set((idx.entries || []).filter(e => e && pOf(e.id) === pillar).map(e => norm(e.question || e.title)));
  const used = new Set(readJSON(USED_F, {})[pillar] || []);
  const notDup = q => { const nq = norm(q); if (existing.has(nq) || used.has(nq)) return false; for (const e of existing) { if (jaccard(nq, e) >= 0.85) return false; } return true; };
  // POINTED suggestions (owner 2026-07-15): if the panel generated specific topics for this pillar,
  // prefer them so auto-mode randomly picks a POINTED title, not just the broad seed templates.
  let suggested = [];
  try { suggested = (((readJSON(SUGGEST_F, {})[pillar]) || {}).topics || []).filter(notDup); } catch (e) {}
  const candidates = [];
  for (const q of seedQuestions(pillar, PNAMES[pillar])) { if (notDup(q)) candidates.push(q); }
  // Prefer pointed suggestions when available; else fall back to the broad seeds.
  const base = suggested.length ? suggested : candidates;
  const pool = (opts.random !== false) ? shuffle(base) : base;
  return pool.slice(0, Math.max(0, count));
}
function jaccard(a, b) { const A = new Set(a.split(' ')), B = new Set(b.split(' ')); let i = 0; for (const x of A) if (B.has(x)) i++; return i / (A.size + B.size - i || 1); }
function markUsed(pillar, question) { const u = readJSON(USED_F, {}); (u[pillar] = u[pillar] || []).push(norm(question)); writeJSON(USED_F, u); }

// ── notes-driven question supply: operator types WHAT they're looking for; DeepSeek generates titles
// that START on that exact topic then BRANCH OFF into adjacent angles. The used-bank dedupe (below)
// consumes the near ideas over successive Daily-Driver ticks, so the topic naturally drifts outward. ──
async function notesQuestions(pillar, count, notes) {
  const T = PNAMES[pillar] || pillar;
  const idx = await loadIndex();
  const existing = new Set((idx.entries || []).filter(e => e && pOf(e.id) === pillar).map(e => norm(e.question || e.title)));
  const used = new Set(readJSON(USED_F, {})[pillar] || []);
  const sys = 'You generate page titles for a knowledge library that has EXACTLY TWO formats: (A) a natural Q&A question (e.g. "How much does X cost in 2027?", "Is X worth it in 2027?", "What is the best way to Y in 2027?", "How do you Z in 2027?"), or (B) a "Top 10 <specific thing>" list — ALWAYS exactly 10, NEVER Top 20/50/100/500/1000 or any other number. Output ONLY a plain list of titles, one per line — no numbering, no commentary, no quotes.';
  const user = [
    `Pillar: ${T}.`,
    `The operator wants: "${String(notes).slice(0, 500)}".`,
    `Generate ${Math.max(6, count * 4)} SPECIFIC titles about that — start squarely on it, then branch to adjacent angles (nearby sub-topics, comparisons, costs, how-tos, common mistakes).`,
    `HARD RULES: (1) Every title is EITHER a Q&A question OR a "Top 10 <specific thing>" — nothing else. (2) NEVER "Top 100 / Top 500 / Top 1000" or any count except 10. (3) If the request is vague or says "gaps" / "fill in", invent SPECIFIC concrete titles about INDIVIDUAL items (one specific brand/model/category/franchise per title) — NEVER a literal meta-title like "top 1000 franchises". (4) One specific topic per title. (5) End in 2027 where a year applies.`,
    existing.size ? `Avoid these existing titles: ${[...existing].slice(0, 40).join(' | ')}.` : '',
    `One title per line.`
  ].filter(Boolean).join('\n');
  let lines = [];
  try {
    const r = await dsChat([{ role: 'system', content: sys }, { role: 'user', content: user }], { max_tokens: 1200, temperature: 0.9 });
    lines = String((r && r.content) || '').split('\n')
      .map(l => l.replace(/^\s*\d+[).\].:]?\s*/, '').replace(/^\s*[-*•]\s*/, '').replace(/^["'`]|["'`]$/g, '').trim())
      .filter(Boolean);
  } catch (e) { return []; }
  // Golden-template guard: only Q&A questions or "Top 10 …". Kill "Top 20/100/500/1000",
  // meta/instruction titles, and anything not shaped like the two templates.
  const badTop = /\btop\s*(\d+)/i;                       // any "top N"
  const metaJunk = /\b(fill in|gap|gaps|the rest|remaining|list of all|all the)\b/i;
  const validShape = q => {
    const m = q.match(badTop);
    if (m && m[1] !== '10') return false;               // top N where N≠10 → reject
    if (metaJunk.test(q)) return false;                 // literal meta-instruction → reject
    const isTop10 = /\btop\s*10\b/i.test(q);
    const isQ = /\?\s*$/.test(q) || /^(how|what|why|is|are|should|when|where|which|can|do|does|will)\b/i.test(q);
    return isTop10 || isQ;                               // must be Top-10 or a question
  };
  const out = [];
  for (const q of lines) {
    const nq = norm(q);
    if (!nq || existing.has(nq) || used.has(nq)) continue;
    if (!validShape(q)) continue;                        // enforce the two golden templates
    let near = false;
    for (const e of existing) { if (jaccard(nq, e) >= 0.85) { near = true; break; } }
    if (near) continue;
    out.push(q);
    if (out.length >= count) break;
  }
  return out;
}

// ── classify TOP_LIST vs GENERAL via the repo router (byte-level golden template law) ──
let pickGoldTemplate = null;
try { ({ pickGoldTemplate } = require('./_pulse_gold_template_router')); } catch (e) {}
function classify(title) {
  if (pickGoldTemplate) { try { const t = pickGoldTemplate('q00000', '', title); if (t) return /top|rank|list/i.test(String(t)) ? 'TOP_LIST' : 'GENERAL'; } catch (e) {} }
  return /\btop\s*\d|\bbest\b|\branked\b|\blist\b/i.test(title) ? 'TOP_LIST' : 'GENERAL';   // fallback heuristic (logged)
}

// ── golden template structural law read fresh from disk (HALT if missing — never from memory) ──
function goldenSpec(kind) {
  const f = kind === 'TOP_LIST' ? WD + '/GOLDEN_TEMPLATE_TOP10.md' : WD + '/GOLDEN_TEMPLATE_QA.md';
  if (!fs.existsSync(f)) throw new Error('HALT: missing golden template ' + f + ' — never regenerate from memory');
  return fs.readFileSync(f, 'utf8');
}
// EXACT q11133 golden Q&A shape — matches the non-waived rubricSignOff checks
// (directAnswer, directAnswerFull, qaGoldOutline, faq6, mermaid2, sources5, relatedPulse, linksClean, words).
const SYS_GENERAL = [
  'You are a senior RevOps editor writing a golden-standard Q&A essay for pulserevops.com. Output COMPLETE markdown ONLY — no preamble, no wrapping code fence, no CRO/widget/"Kory White" markup, and NO image markdown at all (images are added later). Follow this EXACT structure and order:',
  '',
  '## Direct Answer',
  '<2 to 4 sentences, AT LEAST 160 characters, answering the question directly. For a yes/no question, open with **Yes** / **No** / **It depends** and one-sentence condition.>',
  '',
  '<one short intro paragraph>',
  '',
  '## <Depth section 1, phrased as a searchable sub-question>',
  '<2+ paragraphs, 60+ words each section>',
  '',
  '(Write 4 to 6 total "## " depth sections. Place EXACTLY TWO ```mermaid diagrams inside two different depth sections. Never stack two diagrams/lists back-to-back without prose between. Weave 2-3 in-body links to https://pulserevops.com/knowledge/<id> into the prose.)',
  '',
  '## Related questions',
  '### <A related question>?',
  '<answer, 50 words or fewer>',
  '(3 to 5 of these "### question?" + short-answer pairs)',
  '',
  '## FAQ',
  '**<A question>?**',
  '<answer paragraph>',
  '(AT LEAST 6 of these **bold question?** + answer pairs)',
  '',
  '## Sources',
  '- [<real source name>](https://<real-url>)',
  '(5 to 10 real, credible, named sources)',
  '',
  '## Related on PULSE',
  '- [<a related question>](https://pulserevops.com/knowledge/<id>)',
  '(3 to 5 internal links)',
  '',
  'HARD RULES: minimum 2500 words of genuine substance (never pad). NEVER fabricate specific prices, statistics, vendor names, or numbers — stay general and accurate. Output ONLY the markdown, starting exactly at "## Direct Answer".',
].join('\n');
const SYS_TOPLIST = [
  'You are a senior RevOps editor writing a golden Top-10 essay for pulserevops.com. Output COMPLETE markdown ONLY — no preamble, no CRO/"Kory White" markup, no image markdown. Follow this EXACT order:',
  '## Direct Answer',
  '<2-4 sentences, 160+ chars, naming the overall best pick + the runner-up and why.>',
  '<intro paragraph>',
  '## How we chose',
  '<criteria prose>',
  '(Then 4 to 6 "## " depth sections comparing the field — NOT a raw ranked "## 1." product list. Place EXACTLY TWO ```mermaid diagrams inside depth sections. Weave 2-3 links to https://pulserevops.com/knowledge/<id>.)',
  '## Related questions',
  '### <question>?','<=50-word answer','(3 to 5 pairs)',
  '## FAQ','**<question>?**','<answer>','(AT LEAST 6 pairs)',
  '## Sources','- [name](https://url)','(5 to 10 real sources)',
  '## Related on PULSE','- [related](https://pulserevops.com/knowledge/<id>)','(3 to 5 links)',
  'HARD RULES: minimum 2500 words of genuine substance (never pad). Never fabricate prices/stats/vendors. Output only markdown starting at "## Direct Answer".',
].join('\n');
// 🔒 Daily Driver word floor (owner 2026-07-15): new entries kept coming out ~1500; enforce 2500.
// Gen-side only — the shared 13/13 gate stays at its 2000 floor so existing-content fixing is untouched.
const WORD_MIN = parseInt(process.env.GEN_WORD_MIN || '2500', 10);
const wordCount = b => String(b || '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;
// map failing gate checks → concrete repair instructions
const CHECK_HELP = {
  directAnswer: 'Add "## Direct Answer" as the VERY FIRST H2, with 2+ sentences (160+ chars).',
  directAnswerFull: 'Make the "## Direct Answer" block at least 2 full sentences and 160+ characters.',
  faq6: 'The "## FAQ" section must have AT LEAST 6 **bold question?** + answer pairs.',
  mermaid2: 'Include EXACTLY 2 ```mermaid diagrams, each inside a depth section.',
  mermaidClean: 'Ensure both ```mermaid blocks are valid and closed; no stray fences.',
  sources5: 'The "## Sources" section needs 5-10 real named sources as markdown links.',
  relatedPulse: 'Add a "## Related on PULSE" section with 3-5 links to https://pulserevops.com/knowledge/<id>.',
  qaGoldOutline: 'Order MUST be: ## Direct Answer → 4-6 ## depth sections → ## Related questions → ## FAQ → ## Sources → ## Related on PULSE. No image before Direct Answer; no stacked images/diagrams.',
  words2000: 'Expand to at least ' + WORD_MIN + ' words of substantive detail — never pad.',
  linksClean: 'Internal links must be well-formed https://pulserevops.com/knowledge/<id>.',
};

function shapeQaBody(body) {
  try {
    const { ensureQaGoldBodyShape } = require('./_qa_gold_template');
    return ensureQaGoldBodyShape(body || '') || body || '';
  } catch (e) { return body || ''; }
}

async function generateBody(title, kind) {
  goldenSpec(kind);   // HALT-check the template exists on disk before spending a DS call
  const sys = kind === 'TOP_LIST' ? SYS_TOPLIST : SYS_GENERAL;
  const user = `Write the complete golden ${kind} page for this question: "${title}". Follow the structure exactly. Return only the markdown.`;
  const r = await genWrite([{ role: 'system', content: sys }, { role: 'user', content: user }], { max_tokens: 8000, temperature: 0.7 });
  return shapeQaBody((r && r.content) || '');
}
// surgical repair pass: rewrite only to satisfy the failing 13-point checkpoints, never shorten.
async function fixBody(title, kind, body, failed) {
  const sys = kind === 'TOP_LIST' ? SYS_TOPLIST : SYS_GENERAL;
  const help = (failed || []).filter(f => !SIM_WAIVE_LOCAL.has(f)).map(f => '- ' + (CHECK_HELP[f] || f));
  const fb = help.length
    ? ('The golden gate FAILS these checks — fix EXACTLY them, keep everything else, never shorten:\n' + help.join('\n'))
    : 'Revise so it passes every golden check.';
  const r = await genWrite([{ role: 'system', content: sys }, { role: 'user', content: fb + '\n\nQUESTION: "' + title + '"\n\nCURRENT PAGE:\n' + body }], { max_tokens: 8000, temperature: 0.6 });
  return shapeQaBody((r && r.content) || '');
}
// image checks the gate waives in simMode — never worth a repair call
const SIM_WAIVE_LOCAL = new Set(['heroImage', 'faceCardApplicable', 'pollinatorFaceCover', 'pollinatorInternalFlux', 'media3to10', 'imagesLaw', 'top10Images', 'rankingListMaster', 'score12']);

// ── 13/13 gate via the running scrub server (rubricSignOff). dryRun => score without publishing ──
async function gate(id, body, title, dryRun) {
  const res = await fetch(GATE_URL, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: GATE_KEY, id, body, title, question: title, simMode: true, dryRun: !!dryRun }),
    signal: AbortSignal.timeout(120000),
  });
  return await res.json();   // { ok, pass, score, failed[], published }
}

// ── similarity-at-birth: overlap of the new body vs same-topic entries (LAW-SIM, 0.70) ──
function sentsOf(md) {
  let t = String(md || '').replace(/```[\s\S]*?```/g, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').replace(/\[[^\]]*\]\([^)]*\)/g, ' ').replace(/<[^>]+>/g, ' ').toLowerCase();
  t = t.replace(/\$?\b\d[\d,\.]*%?\b/g, ' NUM ').replace(/[^a-z0-9\.\!\?\s]/g, ' ').replace(/\s+/g, ' ');
  return new Set(t.split(/(?<=[\.\!\?])\s+/).map(s => s.replace(/[^a-z0-9 ]/g, '').trim()).filter(s => s.split(' ').length >= 4));
}
function overlap(a, b) { if (!a.size || !b.size) return 0; const s = a.size < b.size ? a : b, big = s === a ? b : a; let n = 0; for (const x of s) if (big.has(x)) n++; return n / s.size; }
async function simAtBirth(pillar, body) {
  const idx = await loadIndex();
  const peers = (idx.entries || []).filter(e => e && pOf(e.id) === pillar).slice(0, 60);   // cap for speed
  const mine = sentsOf(body);
  let mx = 0, worst = null;
  for (const e of peers) {
    try { const a = await store.get('answers/' + e.id + '.json', { type: 'json' }); const o = overlap(mine, sentsOf(a && (a.answer || a.body))); if (o > mx) { mx = o; worst = e.id; } } catch (x) {}
  }
  return { max: mx, against: worst, dup: mx >= SIM_THRESHOLD };
}

// ── id allocation (next free id for a pillar) ──
async function nextId(pillar) {
  const idx = await loadIndex();
  let mx = 0; for (const e of (idx.entries || [])) { const m = String(e.id).match(new RegExp('^' + pillar + '(\\d+)$')); if (m) mx = Math.max(mx, +m[1]); }
  return pillar + (mx + 1);
}
const segOf = pillar => { try { return (require('./_ds_publish').PILLAR[pillar] || {}).seg || 'knowledge'; } catch (e) { return 'knowledge'; } };
const wouldBeUrl = (pillar, id) => `https://pulserevops.com/${segOf(pillar)}/${id}`;

// ── one entry: generate → gate(13/13) → sim-at-birth → (publish unless dry) ──
async function makeEntry(pillar, title, dryRun) {
  const kind = classify(title);
  const id = await nextId(pillar);
  const rec = { id, pillar, title, kind, url: wouldBeUrl(pillar, id) };
  // Panel: show id + title the whole time we're writing this Q
  setStatus({
    currentId: id,
    currentTitle: title,
    currentPillar: pillar,
    currentPillarName: PNAMES[pillar] || pillar,
    currentJob: 'writing · ' + id,
    phase: 'writing · ' + id + ' · ' + String(title).slice(0, 100),
    writing: true,
  });
  let body = '';
  try { body = await generateBody(title, kind); } catch (e) { rec.error = String(e.message || e); return rec; }
  if (!body || body.length < 800) { rec.error = 'short/empty gen (' + body.length + ' chars)'; return rec; }
  rec.words = body.replace(/\s+/g, ' ').split(' ').length;
  setStatus({ currentId: id, currentTitle: title, currentJob: 'gating · ' + id, phase: 'gating · ' + id + ' · ' + String(title).slice(0, 100) });
  // 13/13 gate (dryRun in proof mode → score only, no publish)
  let g; try { g = await gate(id, body, title, true); } catch (e) { rec.error = 'gate unreachable: ' + String(e.message || e); return rec; }
  // surgical fix loop — feed failing checkpoints back to DeepSeek until 13/13 AND >= WORD_MIN words
  // (owner 2026-07-15: entries kept landing ~1500; force expansion toward 2500). 4 strikes → log & move on.
  let attempts = 0;
  while ((!g.pass || wordCount(body) < WORD_MIN) && attempts < 4) {
    attempts++;
    const need = (g.failed || []).slice();
    if (wordCount(body) < WORD_MIN && !need.includes('words2000')) need.push('words2000');   // force expand toward WORD_MIN
    setStatus({ currentId: id, currentTitle: title, currentJob: 'repair ' + attempts + ' · ' + id, phase: 'repairing · ' + id + ' · ' + String(title).slice(0, 100) });
    try { const nb = await fixBody(title, kind, body, need); if (nb && nb.length > body.length * 0.9) body = nb; } catch (e) { break; }
    try { g = await gate(id, body, title, true); } catch (e) { break; }
  }
  rec.attempts = attempts; rec.words = wordCount(body);
  // 🔒 hard floor: never publish a short entry — better skipped than a 1500-word page.
  if (rec.words < WORD_MIN) { logFail(id, 'under ' + WORD_MIN + ' words (' + rec.words + ') after ' + attempts + ' expands'); rec.published = false; rec.blocked = 'short'; return rec; }
  rec.score = g.score; rec.pass = !!g.pass; rec.failed = g.failed || [];
  // similarity-at-birth
  setStatus({ currentId: id, currentTitle: title, currentJob: 'sim-check · ' + id, phase: 'sim-check · ' + id });
  const sim = await simAtBirth(pillar, body); rec.sim = +(sim.max).toFixed(2); rec.simDup = sim.dup;
  if (dryRun) return rec;                                        // DRY: nothing published
  if (!g.pass) { logFail(id, 'gate: ' + (g.failed || []).join(',')); rec.published = false; return rec; }
  if (sim.dup) { logFail(id, 'sim-at-birth ' + rec.sim + ' vs ' + sim.against); rec.published = false; rec.blocked = 'near-dup'; return rec; }
  // REAL new-entry publish: create blob + _index.json insert + live URL. /gate-publish is UPDATE-ONLY
  // (persistAnswerBlob returns 'no blob' for a fresh id), so a brand-new entry goes through publishTextFirst.
  setStatus({ currentId: id, currentTitle: title, currentJob: 'publishing · ' + id, phase: 'publishing · ' + id + ' · ' + String(title).slice(0, 100) });
  try {
    fs.writeFileSync('C:/Users/koryj/' + id + '_answer.md', body);
    const pub = await publishTextFirst(id, title, {});           // grades (>=10), writes blob, inserts index, defers images
    rec.published = !!pub.ok; rec.liveUrl = pub.url || rec.url; rec.pubScore = pub.score;
    if (!pub.ok) rec.pubError = pub.reason || pub.error || 'publish failed';
  } catch (e) { rec.published = false; rec.pubError = String(e.message || e); }
  if (rec.published) {
    markUsed(pillar, title); invalidateIndex();
    // Q&A: top + 2 · Top 10: all product imgs · match → Pexels search → inventory (owner 2026-07-13)
    // IMAGE_APPLY_PAUSED=1 (Fable 2026-07-14): daily driver runs TEXT-ONLY too — images deferred
    // (images_pending) until the render-path deploy lands + one DOM check passes. Same rule as fixer.
    if (process.env.IMAGE_APPLY_PAUSED === '1') {
      try { const cur = await store.get('answers/' + id + '.json', { type: 'json' }); if (cur) await store.setJSON('answers/' + id + '.json', Object.assign({}, cur, { images_pending: true })); } catch (e) {}
      rec.imagesPending = true;
      return rec;
    }
    try {
      const { ensureDdFixerImages } = require('./_dd_fixer_images');
      // CONTRACT-BINDING: bind by the recorded title — SAME rule as the panel's typeOf — so the
      // image applier never auto-guesses. GENERAL = hero+2 · TOP_LIST = hero+10.
      const templateType = /\btop\s*\d|\btop-\d|\bbest\b|\branked\b|\blist\b/i.test(String(title)) ? 'TOP_LIST' : 'GENERAL';
      const filled = await ensureDdFixerImages(store, id, {
        title,
        body,
        templateType,    // bound contract — no auto-detect
        surface: true,   // → homepage Recents + matching pillar row
        quality: 10,
      });
      rec.imgSq = filled.imgSq;
      rec.img = filled.img;
      rec.imgKind = filled.template;
      rec.imgVia = filled.via;
      rec.stamped = !!filled.ok;
      if (filled.body) body = filled.body;
      if (!filled.ok) rec.stampError = filled.why || filled.persistErr || ('img fill incomplete · ' + (filled.template || ''));
    } catch (e) { rec.stampError = String(e.message || e); }
  }
  return rec;
}

// ── one batch (per hour, or one proof run) ──
async function runBatch({ dryRun, cap }) {
  const cfg = loadConfig();
  if (cfg.paused && !dryRun) { setStatus({ stage: 'stopped', currentJob: null, note: 'stopped from panel (config.paused=true)' }); return { skipped: 'paused' }; }
  if (!withinRunWindow(cfg) && !dryRun) { setStatus({ stage: 'stopped', currentJob: null, note: 'runHours finished — auto-stopped' }); return { skipped: 'runUntil' }; }
  const topics = await topicsForBatch(cfg);
  if (!topics.length && !dryRun) { setStatus({ stage: 'armed', currentJob: null, note: 'no topics selected — tag genTopics or set ALL' }); return { skipped: 'no-topics' }; }
  const target = cfg.pillarLap ? 1 : (cap != null ? cap : effectiveBatch(cfg, topics));
  const results = [];
  // Keep a rolling session feed across Daily Driver one-after-another ticks
  const prevSt = readJSON(STATUS_F, {});
  const recentJobs = Array.isArray(prevSt.recentJobs) ? prevSt.recentJobs.slice(-11) : [];
  const recentResults = Array.isArray(prevSt.recentResults) ? prevSt.recentResults.slice(-11) : [];
  let sessionDone = Number(prevSt.sessionDone) || 0;
  let sessionPassed = Number(prevSt.sessionPassed) || 0;
  let sessionPublished = Number(prevSt.sessionPublished) || 0;
  loadTodayStats();
  setStatus(Object.assign({
    stage: dryRun ? 'proof' : 'generating',
    mode: cfg.pillarLap ? 'pillarLap' : (cfg.perTopicPerHour != null ? 'perTopicPerHour' : 'entriesPerHour'),
    pillarLap: !!cfg.pillarLap,
    target,
    topics: topics.slice(0, 12),
    startedAt: nowISO(),
    spend: todaySpend().spent,
    currentJob: 'starting batch…',
    note: cfg.pillarLap ? ('Daily Driver · 1 random Q&A · ' + (PNAMES[topics[0]] || topics[0])) : null
  }, todayStatusFields()));
  outer: for (const pillar of topics) {
    const per = cfg.pillarLap ? 1 : (cfg.perTopicPerHour != null ? cfg.perTopicPerHour : Math.ceil(target / Math.max(1, topics.length)) || 1);
    const notes = String(cfg.genNotes || '').trim();
    let qs = notes ? await notesQuestions(pillar, per, notes) : [];
    if (!qs.length) qs = await pickQuestions(pillar, per, { random: true }); // fallback to seeds so the driver never stalls
    if (!qs.length) {
      console.log(`  · ${pillar}: no unused questions left — skip`);
      continue;
    }
    for (const q of qs) {
      if (results.length >= target) break outer;
      const job = pillar + ': ' + q.slice(0, 80);
      recentJobs.push(job);
      if (recentJobs.length > 12) recentJobs.shift();
      setStatus(Object.assign({
        phase: job,
        currentJob: job,
        currentId: null, // filled the moment makeEntry allocates an id
        currentPillar: pillar,
        currentPillarName: PNAMES[pillar] || pillar,
        currentTitle: q,
        writing: true,
        recentJobs: recentJobs.slice(),
        recentResults: recentResults.slice(),
        done: results.length,
        target,
        sessionDone,
        sessionPassed,
        sessionPublished
      }, todayStatusFields()));
      const r = await makeEntry(pillar, q, dryRun);
      results.push(r);
      sessionDone += 1;
      if (r.pass) sessionPassed += 1;
      if (r.published) sessionPublished += 1;
      bumpTodayStats(r);
      const summary = {
        id: r.id,
        pillar: r.pillar,
        pillarName: PNAMES[r.pillar] || r.pillar,
        title: r.title,
        kind: r.kind,
        score: r.score != null ? r.score : null,
        pass: !!r.pass,
        published: !!r.published,
        url: r.liveUrl || r.url || null,
        error: r.error || r.pubError || r.blocked || null,
        at: nowISO()
      };
      recentResults.push(summary);
      if (recentResults.length > 12) recentResults.shift();
      setStatus(Object.assign({
        lastResult: summary,
        recentResults: recentResults.slice(),
        recentJobs: recentJobs.slice(),
        currentId: r.id,
        currentTitle: r.title,
        writing: false,
        currentJob: r.published ? ('published · ' + r.id) : (r.pass ? ('gated · ' + r.id) : ('failed · ' + r.id)),
        phase: summary.pass ? ('✓ ' + (summary.published ? 'published ' : 'passed ') + summary.id) : ('✗ ' + summary.id + (summary.error ? ' · ' + String(summary.error).slice(0, 60) : '')),
        sessionDone,
        sessionPassed,
        sessionPublished,
        done: results.length,
        target
      }, todayStatusFields()));
      console.log(`  ${r.error ? '✗' : (r.pass ? '✓' : '·')} ${r.id} [${r.kind}] score=${r.score != null ? r.score + '/13' : '—'} sim=${r.sim != null ? Math.round(r.sim * 100) + '%' : '—'}${r.error ? '  ' + r.error : ''}`);
      await sleep(500);
    }
  }
  const passed = results.filter(r => r.pass).length;
  const cfgEnd = loadConfig();
  const nextStage = dryRun ? 'proof-done' : (cfgEnd.paused ? 'stopped' : (cfgEnd.pillarLap ? 'generating' : 'armed'));
  setStatus(Object.assign({
    stage: nextStage,
    done: results.length,
    passed,
    spend: todaySpend().spent,
    finishedAt: nowISO(),
    currentJob: cfgEnd.pillarLap && !cfgEnd.paused ? 'next one…' : null,
    currentTitle: null,
    recentJobs: recentJobs.slice(),
    recentResults: recentResults.slice(),
    sessionDone,
    sessionPassed,
    sessionPublished,
    phase: results.length ? ('last · ' + (recentJobs[recentJobs.length - 1] || '')) : 'batch empty',
    note: nextStage === 'generating' ? 'Daily Driver · one finished → starting next'
      : (nextStage === 'armed' ? 'waiting for next hourly batch'
        : (nextStage === 'stopped' ? 'parked' : null))
  }, todayStatusFields()));
  try { fs.appendFileSync(DAILY_F, `- ${nowISO()} · ${dryRun ? 'DRY PROOF' : 'batch'} · generated ${results.length} · passed ${passed} · published ${results.filter(r => r.published).length} · DS spend today $${todaySpend().spent}\n`); } catch (e) {}
  return { results, passed };
}

// ── proof report (for the operator; publishes nothing) ──
function proofReport(batch) {
  const rows = (batch.results || []).map(r =>
    `${r.pass ? '✅' : (r.error ? '⚠️ ' : '❌')} ${r.id} [${r.kind}]  ${r.score != null ? r.score + '/13' : '—'}  sim ${r.sim != null ? Math.round(r.sim * 100) + '%' : '—'}  ${r.url}${r.failed && r.failed.length ? '  fails: ' + r.failed.join(',') : ''}${r.error ? '  ' + r.error : ''}`);
  console.log('\n========== DRY PROOF REPORT (nothing published) ==========');
  console.log(rows.join('\n'));
  console.log(`\n${batch.passed}/${(batch.results || []).length} scored 13/13. DeepSeek spend today: $${todaySpend().spent}. AWAITING OPERATOR GO before any live publish.`);
}

// ── first-run desktop-icon instructions (append once to daily_log) ──
function firstRunNote() {
  const flag = GEN + '/.icon_note_done';
  if (fs.existsSync(flag)) return;
  try {
    fs.appendFileSync(DAILY_F, `- ${nowISO()} · SETUP: desktop icon → right-click start_dashboard.bat → Send to → Desktop (create shortcut); then right-click the shortcut → Properties → Change Icon → browse to pulse.ico.\n`);
    fs.writeFileSync(flag, '1');
  } catch (e) {}
}

(async () => {
  firstRunNote();
  const arg = process.argv.slice(2).join(' ');
  const proofM = arg.match(/--proof(?:=(\d+))?/);
  if (proofM) {
    const n = proofM[1] ? +proofM[1] : 10;
    console.log(`[gen-daemon] DRY PROOF of ${n} — generate + 13/13 gate-score, PUBLISH NOTHING.`);
    const batch = await runBatch({ dryRun: true, cap: n });
    proofReport(batch);
    return;
  }
  const liveM = arg.match(/--live(?:=(\d+))?/);
  if (liveM) {
    const n = liveM[1] ? +liveM[1] : 1;
    console.log(`[gen-daemon] LIVE PUBLISH TEST of ${n} — real blob + _index.json insert + URL (images deferred).`);
    const batch = await runBatch({ dryRun: false, cap: n });
    const pubbed = (batch.results || []).filter(r => r.published);
    console.log('\n========== LIVE TEST RESULT ==========');
    for (const r of (batch.results || [])) console.log(`${r.published ? '✅ PUBLISHED' : '❌ ' + (r.pubError || 'blocked')}  ${r.id} [${r.kind}] gate=${r.pass ? 'pass' : 'fail'}  ${r.liveUrl || r.url}`);
    console.log(`${pubbed.length}/${(batch.results || []).length} published live. DeepSeek spend today $${todaySpend().spent}.`);
    return;
  }
  if (/--once/.test(arg)) {
    // Panel START / Daily Driver: keep going until STOP or runUntil.
    // Only exit after a single batch when there is no run window AND pillarLap is off.
    const drive = async () => {
      for (;;) {
        const cfg = loadConfig();
        if (cfg.paused) { setStatus({ stage: 'idle', note: 'stopped' }); return; }
        if (cfg.runUntil && new Date(cfg.runUntil) <= new Date()) {
          setStatus({ stage: 'idle', note: 'run window ended' });
          return;
        }
        const continuous = !!cfg.pillarLap || !!(cfg.runUntil && new Date(cfg.runUntil) > new Date());
        console.log('[gen-daemon] ' + (continuous ? 'Daily Driver — next one' : 'one live batch'));
        await runBatch({ dryRun: false });
        if (!continuous) return;
        await new Promise(r => setTimeout(r, 1500)); // tiny breath between Q&As
      }
    };
    await drive();
    return;
  }
  // daemon: fire at the top of each hour, forever
  console.log('[gen-daemon] armed — live batch at :00 every hour. Rate from gen/config.json (operator-only).');
  const tick = async () => { try { await runBatch({ dryRun: false }); } catch (e) { setStatus({ stage: 'error', error: String(e.message || e) }); logFail('BATCH', String(e.message || e)); } };
  const msToTopOfHour = () => { const d = new Date(); return (60 - d.getMinutes()) * 60000 - d.getSeconds() * 1000; };
  const schedule = () => setTimeout(async () => { await tick(); schedule(); }, msToTopOfHour());
  schedule();
})().catch(e => { console.error('[gen-daemon] FATAL', e && e.message); setStatus({ stage: 'error', error: String(e && e.message) }); process.exit(1); });
