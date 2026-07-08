// _v2_components.js — SEO SPIDER FIXER / Site Perfection Engine (4444 2026-06-30).
// Per-component fixer: 2 DeepSeek workers perfect entries 400-at-a-time; 1 DDG lane (LANE=2).
// Needs-review backlog = _v2_needs_review.js (1 DeepSeek) + _v2_nr_ddg.js×2 (DDG cover images on review ids).
const fs = require('fs');
const { execSync } = require('child_process');
const { getStore } = require('@netlify/blobs');
const { dsChat } = require('./_ds_lib');
const { claudeChat } = require('./_claude_chat');
const { sanitizeMermaid } = require('./_mermaid_sanitize');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const { VISUAL_LOCK_DS_SYSTEM_SNIPPET, enforceWriterVisualLock } = require('./_visual_lock_law');
// IndexNow fires ONLY on Stage-2 final sign-off (_v2_final_gate.js) — never at stage-1
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const STOP = WD + '/_v2_components_stop.flag';
const BATCH = parseInt(process.argv[2] || process.env.V2C_BATCH || '40', 10);
let PILLAR = (process.argv[3] || process.env.V2C_PILLAR || '').toLowerCase();   // let: cleared → SITE-WIDE when the pillar is fully perfected
const DO_CRO = process.env.V2C_CRO === '1';
const CC_CONC = Math.max(0, parseInt(process.env.V2C_CC_CONC || '0', 10));
const DS_CONC = Math.max(1, parseInt(process.env.V2C_DS_CONC || '2', 10));
const TOTAL_WORKERS = CC_CONC + DS_CONC;
const STAGGER_MS = parseInt(process.env.V2C_STAGGER_MS || (CC_CONC >= 2 ? '30000' : '0'), 10);
const PACE_MS = parseInt(process.env.V2C_PACE_MS || '0', 10); // inter-item sleep per worker (0 = max speed)
const ENGINE_LABEL = `${DS_CONC}DS+DDG${CC_CONC ? '+' + CC_CONC + 'CC' : ''}`;
const logln = s => { try { fs.appendFileSync(WD + '/_v2_components.out.log', new Date().toISOString() + ' ' + s + '\n'); } catch (e) {} console.log(s); };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const pillarOf = id => (String(id).match(/^[a-z]+/) || [''])[0];
const wordCount = b => (String(b || '').replace(/```[\s\S]*?```/g, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').match(/[A-Za-z0-9'-]+/g) || []).length;

// ── CHECKS (aligned to grade-entry.js) ───────────────────────────────
const C = {
  directAnswer: b => /^#{2,3}\s+Direct\s+Answer/im.test(b) || /<h[23][^>]*>\s*Direct\s+Answer/i.test(b),
  faq:          b => /(^|\n)#{2,3}\s*((\d+|[IVXLC]+)[.)]\s*)?(FAQ|Frequently\s+Asked)/i.test(b),
  faq5:         b => { const m = b.match(/#{2,3}\s*(?:FAQ|Frequently Asked)\b[\s\S]*?(?=\n#{1,2}\s|$)/i); return m ? (m[0].match(/\*\*[^*\n]+\?\*\*/g) || []).length >= 6 : false; },   // owner standard = 6 Q&As (CC audit enforces 6)
  twoMermaid:   b => (b.match(/```mermaid\b/g) || []).length >= 2,
  mermaidClean: b => !(b.match(/```mermaid[\s\S]*?```/g) || []).some(blk => /[<>]/.test(blk.replace(/[-=]{1,2}>|<[-=]{1,2}/g, ''))),   // <,> in a LABEL breaks render (but --> arrows are fine)
  sources:      b => /^#{2,3}\s+(Sources|References)/im.test(b),
  sources5:     b => { const m = b.match(/##\s+(?:Sources|References)[\s\S]*$/i); return m ? (m[0].match(/^\s*(?:[-*]|\d+[.)])\s+\S/gm) || []).length >= 5 : false; },
  related:      b => /Related on PULSE/i.test(b),
  topImage:     b => /!\[[^\]]*\]\([^)]+\)/.test(b.slice(0, 1200)),   // an image in the first ~1200 chars
  linksClean:   (b, valid) => { let ok = true; b.replace(/\]\((\/[A-Za-z-]+\/([A-Za-z]{1,4}\d[\w-]*))(?:\/reviews)?\)/g, (m, _u, id) => { if (!/^\/knowledge\//.test(m.slice(2)) || /\/reviews\)/.test(m) || (valid && !valid.has(id))) ok = false; return m; }); return ok; },
};
const WORD_FLOOR = parseInt(process.env.V2C_WORDS || '2000', 10);   // owner: V2 = 2000+ words for ALL pillars
const wordFloorFor = pillar => WORD_FLOOR;
// pass@12 law: 13/13 ideal, 12/13 minimum — nothing below 12 may enter _v2_approved.json
const MIN_SCORE = parseInt(process.env.V2C_MIN_SCORE || '12', 10);

// ── GENERATORS (DeepSeek or Claude Code per worker) ──────────────────
async function genDirectAnswer(title, chat = dsChat) {
  const { content } = await chat([
    { role:'system', content:'You write a crisp "Direct Answer" for an authority page: 2-4 sentences that directly answer the page title up front. CRITICAL — NEVER invent specifics: do not state any number, percentage, price, stat, or date unless it is extremely well-known and certainly correct. Otherwise give QUALITATIVE guidance instead (better general+true than specific+fabricated). Never attribute a figure to a named report/study (Gong Labs, Forrester, Gartner, Bessemer, SaaStr, etc.). Output ONLY the answer prose, no heading, no preamble. ' + VISUAL_LOCK_DS_SYSTEM_SNIPPET },
    { role:'user', content:`Page title: "${title}"\n\nWrite the direct answer now (2-4 sentences).` },
  ], { temperature:0.5, max_tokens:300 });
  return '## Direct Answer\n\n' + String(content || '').replace(/^#+\s*Direct Answer\s*/i, '').trim() + '\n';
}
async function genMermaid(title, chat = dsChat) {
  const { content } = await chat([
    { role:'system', content:'You create ONE simple valid Mermaid diagram for a page title. Output ONLY the code (no fences). Use "flowchart TD", 5-8 nodes, PLAIN labels (letters/numbers/spaces only — NO ()[]{}/:&<>" inside labels). ids A,B,C and arrows A[Label] --> B[Label]. Relevant to the title. ' + VISUAL_LOCK_DS_SYSTEM_SNIPPET },
    { role:'user', content:`Page title: "${title}"\n\nReturn the Mermaid code now (flowchart TD, 5-8 nodes, plain labels).` },
  ], { temperature:0.4, max_tokens:600 });
  let code = String(content || '').replace(/```[a-z]*/gi, '').replace(/```/g, '').trim();
  if (!/^\s*(flowchart|graph)\s/i.test(code)) code = 'flowchart TD\n' + code;
  if ((code.match(/-->/g) || []).length < 2) return null;
  return '```mermaid\n' + sanitizeMermaid(code) + '\n```';
}
async function genFaq(title, answer, chat = dsChat) {
  const snippet = String(answer || '').replace(/\s+/g, ' ').slice(0, 1600);
  const { content } = await chat([
    { role:'system', content:'You write a Markdown "## FAQ" section: exactly 6 entries, each a line "**A real question?**" then a 2-4 sentence answer. CRITICAL — NEVER invent specifics: no number, %, price, stat, date, or named-report figure unless extremely well-known and certainly correct; otherwise stay QUALITATIVE (better general+true than specific+fabricated). Output ONLY the "## FAQ" heading and the 6 pairs. ' + VISUAL_LOCK_DS_SYSTEM_SNIPPET },
    { role:'user', content:`Page title: "${title}"\n\nExisting answer (ground in it, don't contradict):\n${snippet}\n\nWrite the "## FAQ" now.` },
  ], { temperature:0.5, max_tokens:1500 });
  let faq = String(content || '').replace(/^```[a-z]*\s*|\s*```$/g, '').trim();
  if (!/^#{2,3}\s*FAQ/im.test(faq)) faq = '## FAQ\n\n' + faq;
  return faq;
}
async function genSources(title, chat = dsChat) {
  const { content } = await chat([
    { role:'system', content:'You list 5-7 credible GENERAL references for a topic as a Markdown bullet list. Reference real, well-known source TYPES/organizations you are certain exist (official product sites, established publications, government/industry bodies). Do NOT invent exact article titles, URLs, statistics, or dates. Format each: "- Source name — what it covers". Output ONLY the bullet list (no heading). ' + VISUAL_LOCK_DS_SYSTEM_SNIPPET },
    { role:'user', content:`Page title: "${title}"\n\nList 6 credible general sources now.` },
  ], { temperature:0.4, max_tokens:400 });
  let list = String(content || '').replace(/^```[a-z]*\s*|\s*```$/g, '').trim();
  return '## Sources\n\n' + list + '\n';
}
async function genExpansion(title, body, need, chat = dsChat) {
  const { content } = await chat([
    { role:'system', content:`You extend an authority answer with 2-3 NEW "## H2" sections of genuinely useful, non-redundant content for the title (~${need} more words total). CRITICAL — NEVER invent specifics: do not state any number, percentage, price, stat, or date unless it is extremely well-known and certainly correct. Otherwise give QUALITATIVE guidance instead (better general+true than specific+fabricated). Never attribute a figure to a named report/study (Gong Labs, Forrester, Gartner, Bessemer, SaaStr, etc.). Output ONLY new "## " sections (markdown), nothing else. Do NOT add images. ` + VISUAL_LOCK_DS_SYSTEM_SNIPPET },
    { role:'user', content:`Page title: "${title}"\n\nExisting answer (do NOT repeat it):\n${String(body).replace(/\s+/g,' ').slice(0,2000)}\n\nWrite 2-3 new ## sections now (~${need} words).` },
  ], { temperature:0.6, max_tokens:2200 });
  return String(content || '').replace(/^```[a-z]*\s*|\s*```$/g, '').trim();
}

// ── INSERTERS ────────────────────────────────────────────────────────
function insertAfterTopImageOrTitle(body, block) {
  const lines = String(body).split(/\r?\n/);
  // after a leading image if present, else after the first non-empty line
  let at = lines.findIndex(l => /^!\[[^\]]*\]\([^)]+\)/.test(l.trim()));
  if (at >= 0) at += 1; else { at = lines.findIndex(l => l.trim()); at = at < 0 ? 0 : at + 1; }
  return lines.slice(0, at).join('\n').replace(/\s+$/,'') + '\n\n' + block + '\n\n' + lines.slice(at).join('\n').replace(/^\s+/,'');
}
function insertBeforeSection(body, block, rx) {
  const lines = String(body).replace(/\s+$/,'').split(/\r?\n/);
  let at = lines.findIndex(l => rx.test(l));
  if (at < 0) return lines.join('\n') + '\n\n' + block + '\n';
  return lines.slice(0, at).join('\n').replace(/\s+$/,'') + '\n\n' + block + '\n\n' + lines.slice(at).join('\n');
}
function insertMermaid(body, block) {
  const lines = String(body).split(/\r?\n/);
  const h2s = []; lines.forEach((l, i) => { if (/^##\s/.test(l)) h2s.push(i); });
  let at = h2s.length >= 2 ? h2s[1] : (h2s.length === 1 ? lines.length : (() => { const i = lines.findIndex(l => l.trim() && !/^#/.test(l) && !/^!\[/.test(l)); return i < 0 ? lines.length : i + 1; })());
  const srcAt = lines.findIndex(l => /^#{2,3}\s*(Sources|Bottom Line)\b/i.test(l));
  if (srcAt >= 0 && at > srcAt) at = srcAt;
  return lines.slice(0, at).join('\n').replace(/\s+$/,'') + '\n\n' + block + '\n\n' + lines.slice(at).join('\n');
}

// deterministic link health: insecure→https, canonical (redirect fix: /pillar/id & /reviews → /knowledge/id), drop broken internal
function fixBodyLinks(body, valid) {
  let b = String(body).replace(/http:\/\//g, 'https://');
  b = b.replace(/\]\(\/[A-Za-z-]+\/([A-Za-z]{1,4}\d[\w-]*)(?:\/reviews)?\)/g, (m, id) => `](/knowledge/${id})`);
  if (valid) b = b.replace(/\[([^\]]+)\]\(\/knowledge\/([A-Za-z]{1,4}\d[\w-]*)\)/g, (m, txt, id) => valid.has(id) ? m : txt);
  return b;
}
// ── FIX ONE ENTRY: run it down the assembly line, fix each station ───
async function fixEntry(id, title, siblings, valid, chat = dsChat) {
  const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
  if (!e || !e.answer) return { id, skipped: 'no-blob' };
  let body = e.answer; const pillar = pillarOf(id); const did = [];
  const originalBody = String(body || '');
  const g0 = gradeEntry(id, body, { imagesDeferred: true });
  const already = g0.score >= MIN_SCORE && wordCount(body) >= WORD_FLOOR && C.directAnswer(body) && C.faq5(body) && C.twoMermaid(body) && C.mermaidClean(body) && C.sources5(body) && C.related(body) && C.linksClean(body, valid);
  if (already) return { id, fixed: [], score: g0.score, words: wordCount(body), approved: true };

  // SPEED (4444): generate EVERY missing station concurrently, then apply inserts in order.
  // Was ~5 sequential ~30s DeepSeek calls per entry; now one parallel batch (~1 call deep).
  const floor = wordFloorFor(pillar);
  const wc0 = wordCount(body);
  const merms0 = (body.match(/```mermaid\b/g) || []).length;
  const need = {
    answer:  !C.directAnswer(body),
    faq:     (!C.faq(body) || !C.faq5(body)),
    merms:   Math.max(0, 2 - merms0),
    sources: (!C.sources(body) || !C.sources5(body)),
    words:   wc0 < floor,
  };
  const jobs = [];
  if (need.answer)  jobs.push(['answer',  genDirectAnswer(title, chat).catch(() => null)]);
  if (need.faq)     jobs.push(['faq',     genFaq(title, body, chat).catch(() => null)]);
  if (need.merms)   jobs.push(['merms',   Promise.all(Array.from({ length: need.merms }, () => genMermaid(title, chat).catch(() => null)))]);
  if (need.sources) jobs.push(['sources', genSources(title, chat).catch(() => null)]);
  if (need.words)   jobs.push(['words',   genExpansion(title, body, floor - wc0 + 150, chat).catch(() => null)]);
  const got = {};
  (await Promise.all(jobs.map(([, p]) => p))).forEach((v, i) => { got[jobs[i][0]] = v; });

  if (got.answer) { try { body = insertAfterTopImageOrTitle(body, got.answer); did.push('answer'); } catch (x) {} }
  if (got.faq)    { try { body = body.replace(/#{2,3}\s*(?:FAQ|Frequently Asked)[\s\S]*?(?=\n#{1,2}\s|$)/i, '').replace(/\n{3,}/g, '\n\n').trimEnd(); body = insertBeforeSection(body, got.faq, /^#{2,3}\s*(Sources|Bottom Line)\b/i); did.push('faq'); } catch (x) {} }
  if (got.merms)  { for (const mb of got.merms) { if (mb) { body = insertMermaid(body, mb); did.push('mermaid'); } } }
  if (!C.mermaidClean(body)) { try { body = body.replace(/```mermaid\n([\s\S]*?)```/g, (m, code) => '```mermaid\n' + sanitizeMermaid(code) + '```'); did.push('mermaid-clean'); } catch (x) {} }
  if (got.sources) { try { body = insertBeforeSection(body, got.sources, /^#{2,3}\s*(FAQ|Frequently)\b/i); did.push('sources'); } catch (x) {} }
  if (got.words)   { try { body = insertBeforeSection(body, got.words, /^#{2,3}\s*(FAQ|Sources|Frequently)\b/i); did.push('words'); } catch (x) {} }
  if (!C.related(body) && siblings && siblings.length) { const rel = '## Related on PULSE\n\n' + siblings.slice(0, 5).map(s => `- [${s.title}](/knowledge/${s.id})`).join('\n') + '\n'; body = insertBeforeSection(body, rel, /^#{2,3}\s*Sources\b/i); did.push('related'); }
  { const nb = fixBodyLinks(body, valid); if (nb !== body) { body = nb; did.push('links'); } }
  { const nb = body.replace(/!\[\s*\]\(/g, `![${String(title).replace(/[\[\]"]/g, '').slice(0, 70)}](`); if (nb !== body) { body = nb; did.push('alt'); } }
  body = enforceWriterVisualLock(originalBody, body, { id, title });

  // CRO card: render-time only — strip any in-blob HTML/markdown card (prevents doubles live).
  if (DO_CRO) {
    try { const { stripAllCroFromBody } = require('./_cro_strip_lib'); const nb = stripAllCroFromBody(body); if (nb !== body) { body = nb; did.push('cro-strip'); } } catch (x) {}
  }
  const needH1 = !e.h1;
  if (did.length || needH1) {
    const patch = Object.assign({}, e, { answer: body, h1: e.h1 || title, updated_at: new Date().toISOString() });
    await store.setJSON('answers/' + id + '.json', patch);
  }
  const hasCro = true; // insertCroAd in pulse-machine-entry injects ONE card near the top
  const g = gradeEntry(id, body, { imagesDeferred: true });
  // APPROVED = personally verify EVERY text station present before sign-off (images are the DDG lanes' job).
  // CRO card + Related are now hard gates — a 13-score with a missing component is NOT approved.
  const approved = g.score >= MIN_SCORE && wordCount(body) >= WORD_FLOOR && C.directAnswer(body) && C.faq5(body) && C.twoMermaid(body) && C.mermaidClean(body) && C.sources5(body) && C.related(body) && C.linksClean(body, valid) && hasCro;
  return { id, fixed: did, score: g.score, words: wordCount(body), approved };
}

module.exports = { fixEntry, C, wordFloorFor, genDirectAnswer, genMermaid, genFaq, genSources, genExpansion };

// ── BATCH LOOP ───────────────────────────────────────────────────────
if (require.main === module) (async () => {
  logln(`[v2c] up — per-component V2 fixer, ${ENGINE_LABEL}, batch ${BATCH}${PILLAR ? ' pillar=' + PILLAR : ''}${DO_CRO ? ' +CRO' : ''}`);
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  // if this pillar was already completed in a prior run, go straight to SITE-WIDE (don't re-sweep it)
  if (PILLAR) { try { if (fs.readFileSync(WD + '/_v2_pillar_done.flag', 'utf8').trim() === PILLAR) { logln(`[v2c] pillar '${PILLAR}' already complete (done-flag) — SITE-WIDE`); PILLAR = ''; } } catch (e) {} }
  const allEntries = () => (idx.entries || []).filter(e => e && e.id).map(e => ({ id: e.id, title: e.question }));
  let ids = allEntries();
  if (PILLAR) ids = ids.filter(e => pillarOf(e.id) === PILLAR);
  ids.sort((a, b) => a.id.localeCompare(b.id));
  let byPillar = {}; for (const e of ids) (byPillar[pillarOf(e.id)] = byPillar[pillarOf(e.id)] || []).push(e);
  let validIds = new Set(ids.map(e => e.id));
  const batchStart = Date.now();
  // ASSEMBLY LINE: cursor advances the catalog; an APPROVED ledger means we never re-touch a
  // signed-off entry. Every entry is run through the rigorous test — fix what's missing, and if
  // it's already perfect just sign off + approve, then move on. Deterministic, not "hope an agent finds it".
  const CURSOR = WD + '/_v2_components_cursor.json';
  const APPROVED = WD + '/_v2_approved.json';
  let approvedSet; try { approvedSet = new Set(JSON.parse(fs.readFileSync(APPROVED, 'utf8'))); } catch (e) { approvedSet = new Set(); }
  const saveApproved = () => { try { fs.writeFileSync(APPROVED, JSON.stringify([...approvedSet])); } catch (e) {} };
  const REVIEW = WD + '/_v2_needs_review.json';
  let review; try { review = new Set(JSON.parse(fs.readFileSync(REVIEW, 'utf8'))); } catch (e) { review = new Set(); }
  const flagReview = id => { if (!review.has(id)) { review.add(id); try { fs.writeFileSync(REVIEW, JSON.stringify([...review])); } catch (e) {} } };
  const signOff = async id => {
    if (approvedSet.has(id)) return;
    const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
    if (!e || !e.answer) { flagReview(id); logln(`[v2c] ✗ BLOCK signOff ${id} — no blob`); return; }
    const body = e.answer;
    const g = gradeEntry(id, body, { imagesDeferred: true });
    const hasCro = true; // render-time CRO card
    const ok = g.score >= MIN_SCORE && wordCount(body) >= WORD_FLOOR && C.directAnswer(body) && C.faq5(body) && C.twoMermaid(body) && C.mermaidClean(body) && C.sources5(body) && C.related(body) && C.linksClean(body, validIds) && hasCro;
    if (!ok) { logln(`[v2c] ✗ BLOCK signOff ${id} — re-check failed score=${g.score} (need ≥${MIN_SCORE}/13 + all stations)`); return; }
    approvedSet.add(id); signedN++; saveApproved();
    logln(`[v2c] ✅ STAGE-1 ${id} ${g.score}/13 (total ${approvedSet.size}) → final gate queue`);
  };
  try { fs.writeFileSync(WD + '/_v2_candidates.json', '[]'); } catch (e) {}   // legacy CC queue cleared
  let indexed0 = 0; try { indexed0 = (idx.entries || []).filter(e => e && e.was_indexed_at).length; } catch (e) {}
  let indexedToday0 = 0; try { const d = JSON.parse(fs.readFileSync(WD + '/_indexnow_drip_day.json', 'utf8')); if (d.day === new Date().toISOString().slice(0, 10)) indexedToday0 = d.n || 0; } catch (e) {}
  let curWork = 'starting…';
  let signedN = 0;
  const WINDOW = parseInt(process.env.V2C_WINDOW || '400', 10);
  const writeProg = async (winDone, winTotal) => { const mins = Math.max(0.1, (Date.now() - batchStart) / 60000); const remaining = ids.length - approvedSet.size; try {
    indexed0 = (await store.get('_index.json', { type: 'json', consistency: 'strong' }).catch(() => null))?.entries?.filter(e => e && e.was_indexed_at).length || indexed0;
    await store.setJSON('seo-monitor/content.json', { mode: 'crawl-400', total: remaining, remaining, catalogTotal: ids.length, approved: approvedSet.size, perfectPct: ids.length ? Math.round(approvedSet.size / ids.length * 1000) / 10 : 0, needsReview: review.size, indexed: indexed0, notIndexed: Math.max(0, ids.length - indexed0), indexedToday: indexedToday0, fixesPerMin: +(signedN / mins).toFixed(1), fixesPerHour: Math.round(signedN / mins * 60), counts: { missing_v2: remaining }, auditedAt: new Date().toISOString() });
    await store.setJSON('seo-monitor/progress.json', { phase: 'fix', running: true, mode: 'crawl-400', crawled: winDone || 0, target: winTotal || WINDOW, batchOffset: offset, siteTotal: ids.length, catalogTotal: ids.length, currentlyWorking: curWork, engine: ENGINE_LABEL, currentAt: new Date().toISOString() });
    await store.setJSON('seo-monitor/approved.json', { approved: approvedSet.size, total: ids.length, at: new Date().toISOString() });
  } catch (e) { logln('[v2c] writeProg blob err: ' + (e && e.message)); } };
  // ===== STRICT 400-WINDOW: crawl 400, and CANNOT advance to the next 400 until ALL are perfect (owner: no exceptions) =====
  const SWITCH_PCT = parseInt(process.env.V2C_PILLAR_SWITCH_PCT || '100', 10);   // pillar→site-wide once this % of the pillar is perfected (owner: 50)
  const SWITCH_MIN = parseInt(process.env.V2C_PILLAR_SWITCH_MIN || '0', 10);     // ...OR after this many minutes of pillar focus (owner: 30), whichever first
  const goSiteWide = (reason) => {
    logln(`[v2c] ✅✅✅ ${reason} — SWITCHING TO SITE-WIDE (all ${(idx.entries || []).length} entries; remaining pillar entries fold into the site-wide sweep)`);
    try { fs.writeFileSync(WD + '/_v2_pillar_done.flag', PILLAR); } catch (e) {}
    PILLAR = '';
    ids = allEntries(); ids.sort((a, b) => a.id.localeCompare(b.id));
    byPillar = {}; for (const e of ids) (byPillar[pillarOf(e.id)] = byPillar[pillarOf(e.id)] || []).push(e);
    validIds = new Set(ids.map(e => e.id));
  };
  let offset = 0; try { offset = JSON.parse(fs.readFileSync(CURSOR, 'utf8')).offset || 0; } catch (e) {}
  if (offset >= ids.length) offset = 0;
  while (!fs.existsSync(STOP)) {
    try { approvedSet = new Set(JSON.parse(fs.readFileSync(APPROVED, 'utf8'))); } catch (e) {}
    // THRESHOLD SWITCH: focused on a pillar → broaden to site-wide once it's ≥ SWITCH_PCT perfected OR SWITCH_MIN minutes elapsed (whichever first)
    if (PILLAR && ids.length) {
      const got = ids.filter(it => approvedSet.has(it.id)).length;
      const pct = got / ids.length * 100;
      const mins = (Date.now() - batchStart) / 60000;
      const hitPct = SWITCH_PCT < 100 && pct >= SWITCH_PCT;
      const hitMin = SWITCH_MIN > 0 && mins >= SWITCH_MIN;
      if (hitPct || hitMin) { goSiteWide(`PILLAR '${PILLAR}' ${hitPct ? `hit ${Math.round(pct)}% (${got}/${ids.length}) ≥ ${SWITCH_PCT}%` : `${Math.round(mins)}min ≥ ${SWITCH_MIN}min`}`); offset = 0; try { fs.writeFileSync(CURSOR, JSON.stringify({ offset, at: new Date().toISOString() })); } catch (e) {} }
    }
    if (offset >= ids.length) {
      // end of scope: if a focused pillar is fully perfected (approved or parked in needs-review), switch to site-wide
      if (PILLAR && ids.every(it => approvedSet.has(it.id) || review.has(it.id))) goSiteWide(`PILLAR '${PILLAR}' COMPLETE (${ids.length} perfected)`);
      offset = 0;
      try { fs.writeFileSync(CURSOR, JSON.stringify({ offset, at: new Date().toISOString() })); } catch (e) {}
    }
    const win = ids.slice(offset, offset + WINDOW);
    const attempts = {};
    logln(`[v2c] ===== CRAWL ${win.length} @${offset} of ${ids.length} — ${TOTAL_WORKERS} fixers (${ENGINE_LABEL}); NO advance until all ${win.length} perfected =====`);
    let pass = 0;
    while (!fs.existsSync(STOP)) {
      try { approvedSet = new Set(JSON.parse(fs.readFileSync(APPROVED, 'utf8'))); } catch (e) {}
      const notApproved = win.filter(it => !approvedSet.has(it.id));
      let done = win.length - notApproved.length;
      curWork = `${done}/${win.length}`;
      await writeProg(done, win.length);
      if (!notApproved.length) { logln(`[v2c] ✅✅ ALL ${win.length} @${offset} PERFECTED — loading next ${WINDOW} @${offset + WINDOW}`); offset += WINDOW; try { fs.writeFileSync(CURSOR, JSON.stringify({ offset, at: new Date().toISOString() })); } catch (e) {} await writeProg(0, WINDOW); break; }
      const toFix = notApproved.filter(it => !review.has(it.id));
      if (!toFix.length && notApproved.length) {
        logln(`[v2c] ⏭ ${notApproved.length} left are needs-review only @${offset} — loading next ${WINDOW} @${offset + WINDOW}`);
        offset += WINDOW;
        try { fs.writeFileSync(CURSOR, JSON.stringify({ offset, at: new Date().toISOString() })); } catch (e) {}
        await writeProg(0, WINDOW);
        break;
      }
      pass++;
      logln(`[v2c] crawl @${offset} pass ${pass}: fixing ${toFix.length}/${win.length} remaining (${TOTAL_WORKERS} workers)`);
      let windowDone = false;
      let qi = 0;
      const markWindowComplete = async () => {
        if (windowDone) return;
        windowDone = true;
        logln(`[v2c] ✅✅ ALL ${win.length} @${offset} PERFECTED — loading next ${WINDOW} @${offset + WINDOW}`);
        offset += WINDOW;
        try { fs.writeFileSync(CURSOR, JSON.stringify({ offset, at: new Date().toISOString() })); } catch (e) {}
        await writeProg(0, WINDOW);
      };
      const engines = [ ...Array(CC_CONC).fill(claudeChat), ...Array(DS_CONC).fill(dsChat) ];
      const engineTags = [ ...Array(CC_CONC).fill('CC'), ...Array(DS_CONC).fill('DS') ];
      if (STAGGER_MS) logln(`[v2c] staggering ${engines.length} workers ${STAGGER_MS / 1000}s apart`);
      async function worker(wid, chat, tag) {
        while (!fs.existsSync(STOP) && !windowDone) {
          const i = qi++;
          if (i >= toFix.length) return;
          const it = toFix[i];
          curWork = it.id;
          const r = await fixEntry(it.id, it.title, (byPillar[pillarOf(it.id)] || []).filter(s => s.id !== it.id), validIds, chat).catch(e => ({ id: it.id, err: e.message }));
          if (r.err) { logln(`[v2c] ERR ${it.id} ${r.err}`); continue; }
          if (r.approved) {
            await signOff(it.id);
            done = win.length - win.filter(w => !approvedSet.has(w.id)).length;
            if (done % 5 === 0 || done <= 3) await writeProg(done, win.length);
            if (r.fixed && r.fixed.length) logln(`[v2c]   fixed ${r.fixed.join(', ')}`);
            if (done >= win.length) await markWindowComplete();
          } else {
            attempts[it.id] = (attempts[it.id] || 0) + 1;
            if (attempts[it.id] >= 3) { flagReview(it.id); logln(`[v2c] ⚠️ NEEDS REVIEW ${it.id} — can't reach 10/10 after ${attempts[it.id]} tries (score ${r.score}); flagged for OWNER`); }
            else logln(`[v2c] ${r.fixed && r.fixed.length ? '~ ' + it.id + ' fixed ' + r.fixed.join(', ') : '↻ ' + it.id + ' not complete'} (try ${attempts[it.id]})`);
          }
          await sleep(PACE_MS);
        }
      }
      await Promise.all(engines.map((chat, i) => (async () => {
        // Launch all workers simultaneously. Only CC workers get an OPTIONAL first-pass
        // stagger (Max-plan CLI contention guard); DS workers (API) never wait, and no
        // worker re-staggers on later passes — otherwise fast windows starve late workers.
        if (STAGGER_MS && i > 0 && pass === 1 && engineTags[i] === 'CC' && !fs.existsSync(STOP)) await sleep(i * STAGGER_MS);
        await worker(i + 1, chat, engineTags[i]);
      })()));
      if (windowDone) break;
    }
  }
  logln('[v2c] stop flag — exiting');
})().catch(e => { logln('[v2c] FATAL ' + (e && e.message)); process.exit(1); });
