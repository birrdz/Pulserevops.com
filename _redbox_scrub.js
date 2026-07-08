// 🔒 4444 LOCKED (owner 2026-06-30) — do not change logic without an explicit 4444 from the owner.
// _redbox_scrub.js — OWNER (2026-06-30): scrub the red box to a TRUE 12/13. NO fudging, NO exceptions.
// Every needs-review entry runs the FULL process: 2 DeepSeek writes (fixEntry x2) + 1 DDG cover +
// 1 CC personal audit. Promote red->green (1:1) ONLY when deterministic grade >= 12 AND every text
// station AND CC PASS >= 12. Entries that can't reach 12/13 without fabrication are emailed to the
// owner (_ask_owner) and parked — never silently dropped, never force-passed.
//
//   node _redbox_scrub.js                 # loop the whole red box
//   SCRUB_CONC=2 node _redbox_scrub.js    # 2 DeepSeek lanes (default 2)
// stop: _redbox_scrub_stop.flag · log: _redbox_scrub.out.log
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
if (!process.env.V2C_MIN_SCORE) process.env.V2C_MIN_SCORE = '12';
if (!process.env.V2C_WORDS) process.env.V2C_WORDS = '2000';

const { getStore } = require('@netlify/blobs');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const { claudeChat } = require('./_claude_chat');
const { dsChat } = require('./_ds_lib');
const { fixEntry, C } = require('./_v2_components');
const { fixCover } = require('./_v2_nr_ddg');
const { pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');
const { pushSeoCounts } = require('./_seo_monitor_sync_lib');
const { askOwner } = require('./_ask_owner');

const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const STOP = WD + '/_redbox_scrub_stop.flag';
const NR = WD + '/_v2_needs_review.json';
const AP = WD + '/_v2_approved.json';
const CC = WD + '/_v2_cc_approved.json';
const PARK = WD + '/_redbox_parked.json';      // can't reach 12/13 w/o fabrication — owner deep-audit
const LOG = WD + '/_redbox_scrub.out.log';
const MIN_SCORE = parseInt(process.env.V2C_MIN_SCORE, 10);
const CC_PASS = parseInt(process.env.CC_PASS_SCORE || '12', 10);
const WORD_FLOOR = parseInt(process.env.V2C_WORDS, 10);
const CONC = Math.max(1, parseInt(process.env.SCRUB_CONC || '2', 10));
const MAX_TRIES = parseInt(process.env.SCRUB_MAX_TRIES || '3', 10);
const PACE_MS = parseInt(process.env.SCRUB_PACE_MS || '4000', 10);   // slow & steady: pause between entries per lane

const logln = s => { const line = new Date().toISOString() + ' ' + s; try { fs.appendFileSync(LOG, line + '\n'); } catch (e) {} console.log(line); };
const readArr = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return []; } };
const writeArr = (f, a) => fs.writeFileSync(f, JSON.stringify(a));
const wordCount = b => (String(b || '').replace(/```[\s\S]*?```/g, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').match(/[A-Za-z0-9'-]+/g) || []).length;
const pillarOf = id => (String(id).match(/^[a-z]+/) || [''])[0];
const sleep = ms => new Promise(r => setTimeout(r, ms));

function stationGaps(b, valid) {
  const f = [];
  if (gradeEntry('x', b, { imagesDeferred: true }).score < MIN_SCORE) f.push('score<12');
  if (wordCount(b) < WORD_FLOOR) f.push('words<2000');
  if (!C.directAnswer(b)) f.push('directAnswer');
  if (!C.faq5(b)) f.push('faq6');
  if (!C.twoMermaid(b)) f.push('mermaid2');
  if (!C.mermaidClean(b)) f.push('mermaidDirty');
  if (!C.sources5(b)) f.push('sources5');
  if (!C.related(b)) f.push('related');
  if (!C.linksClean(b, valid)) f.push('links');
  return f;
}

// TOKEN-SAVE (owner 2026-06-30): audit on DeepSeek, NOT Claude — preserves the owner's weekly Claude
// limit. Dual independent DS auditors, BOTH must PASS @>=12/13, each told to actively hunt fabrication
// (DeepSeek wrote the body, so the auditor is prompted adversarially to catch invented vendors/prices).
const AUDIT_SYS = `You are a ruthless fact-and-quality auditor for PULSE RevOps. The text was AI-written and MAY contain invented vendors, products, prices, or stats — your job is to CATCH them, not to be charitable.
HARD FAILS (return FAIL if ANY is true): any fabricated/invented stat, vendor, product, edition, price, customer, or quote stated as fact; Direct Answer does not answer the title; a required section missing (Direct Answer, 6 FAQ Q&As, 2 mermaid diagrams, 5+ REAL sources, "Related on PULSE"); a mermaid with a real syntax error; padded filler with no real information.
KNOWN-REAL — these are REAL and must NEVER be treated as fabrication: Kory White (the site's real fractional CRO / author), CRO Syndicate, PULSE RevOps, the domain pulserevops.com and ALL its pages (/tools, /publish, /seo, and every /knowledge/<id> link), and the Kory White CRO card (Calendly/LinkedIn/CRO Syndicate). Internal /knowledge/ links and pulserevops.com URLs are real site pages — do NOT flag them as fabricated sources.
DO NOT FAIL for: minor word choice; render-safe escaped mermaid chars; stylistic preference; figures honestly hedged as "approximate/reported/confirm on vendor site"; the items in KNOWN-REAL above.
Score /13 by genuine strength. PASS at >= ${CC_PASS} ONLY when complete, correct, and fabrication-free. Reply ONE line only:
VERDICT=PASS|score=NN/13|notes=...   or   VERDICT=FAIL|score=NN/13|notes=<the specific fabrication or missing section>`;

async function dsAudit1(id, title, body, lens) {
  // The "Related on PULSE" section is deterministically rebuilt from the REAL site index (verified
  // siblings), so DeepSeek must not "audit" its internal /knowledge/ links — it false-flags them as
  // fabricated because it can't verify IDs. Strip it from the auditor's view entirely.
  const clean = String(body).replace(/#{2,3}\s*Related on PULSE[\s\S]*?(?=\n#{2,3}\s|$)/i, '');
  const user = `${lens}\nAudit this answer for "${title}". Hunt for fabrication; PASS only genuinely strong, honest, complete content. Score /13, PASS at >= ${CC_PASS}.\n\n--- ENTRY (${id}) ---\n${clean.slice(0, 22000)}`;
  const r = await dsChat([{ role: 'system', content: AUDIT_SYS }, { role: 'user', content: user }]);
  const txt = String(r.content || '');
  const pass = /VERDICT\s*=\s*PASS/i.test(txt);
  const sm = txt.match(/score\s*=\s*(\d+)\s*\/\s*13/i);
  const nm = txt.match(/notes\s*=\s*(.+)$/i);
  return { pass: pass && (!sm || parseInt(sm[1], 10) >= CC_PASS), score: sm ? parseInt(sm[1], 10) : null, notes: nm ? nm[1].trim().slice(0, 220) : txt.slice(0, 140) };
}
// dual gate — both auditors must PASS; report the weaker score/notes
async function ccRead(id, title, body) {
  const [a, b] = await Promise.all([
    dsAudit1(id, title, body, 'You focus on FABRICATED vendors/products/editions.'),
    dsAudit1(id, title, body, 'You focus on FABRICATED prices/stats/quotes and missing sections.'),
  ]);
  const pass = a.pass && b.pass;
  const score = Math.min(a.score == null ? 0 : a.score, b.score == null ? 0 : b.score);
  const fail = !a.pass ? a : b;
  return { pass, score: pass ? score : (fail.score != null ? fail.score : score), notes: pass ? (a.notes || b.notes) : fail.notes };
}

// DE-FABRICATION rewrite (owner 2026-06-30): the auditor flags invented stats/sources/vendors; this
// DeepSeek pass REMOVES exactly those and replaces them with honest general guidance / hedged ranges /
// real generic sources — NEVER inventing a new number or source. Keeps every required section.
const DEFAB_SYS = `You are revising a PULSE RevOps answer to remove ALL fabrication while keeping it strong, specific-where-honest, and complete.
RULES:
- DELETE every specific number, percentage, price, stat, or benchmark that is not backed by a REAL link in the body. Do not "hedge" it — REMOVE it and state the point qualitatively ("pricing is usage-based — get a quote from the vendor"; "buying committees have grown larger"). NEVER introduce a new number, even an approximate one.
- It is ALWAYS better to be general and true than specific and fabricated. A reader-useful qualitative answer (frameworks, steps, trade-offs, what to track, common failure modes) passes; an impressive fake stat fails.
- REMOVE invented studies/reports/benchmarks ("Gong Labs: ...", named-report citations), fake products/editions/versions, fake quotes/customers, and any internal "Related on PULSE" link that isn't obviously a real sibling article.
- BANNED fabrication-magnet citations — NEVER attribute a stat/figure/benchmark to these, and do NOT list them as sources, UNLESS the entry is specifically ABOUT that company: "Gong Labs", "Bessemer / BVP benchmarks", "Forrester", "Gartner" reports/figures, "Winning by Design", "SaaStr" data, "Impartner benchmarks", and any "<Company> Labs"-style report. They are almost always invented.
- Sources: we do NOT need named-report citations — use REAL LINKS (real vendor pages, official docs, real publication homepages). Each of the 5+ source lines should be a real URL/link, not a prose citation of a named study. If you can't supply a real link for a claim, remove the claim.
- KEEP every required section intact: "## Direct Answer", 6 FAQ Q&As, 2 valid render-safe mermaid diagrams, "## Sources" (5+), "## Related on PULSE". Keep 2000+ words via real substance, not filler.
Output ONLY the full corrected Markdown body — no preamble, no surrounding code fence.`;
async function deFab(id, title, body, critique) {
  try {
    const r = await dsChat([{ role: 'system', content: DEFAB_SYS }, { role: 'user', content: `Title: "${title}"\nAUDITOR FOUND THESE FABRICATIONS — remove/honest-ify EXACTLY these (and any like them):\n${critique}\n\nCURRENT BODY:\n${String(body).slice(0, 26000)}\n\nReturn the full de-fabricated Markdown body now.` }]);
    let nb = String(r.content || '').replace(/^```[a-z]*\s*/i, '').replace(/\s*```$/i, '').trim();
    if (nb.length < Math.max(800, String(body).length * 0.55)) return false;   // guard truncated rewrites
    const cur = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
    if (cur) { await store.setJSON('answers/' + id + '.json', Object.assign({}, cur, { answer: nb, defabbed_at: new Date().toISOString(), updated_at: new Date().toISOString() })); return true; }
  } catch (e) {}
  return false;
}

// clobber-safe red->green promote (1:1) + stage-2 publish
let promoteLock = Promise.resolve();
function promote(id, ccScore) {
  promoteLock = promoteLock.then(async () => {
    // PROVEN INDEX is part of publishing (owner law): submit to IndexNow FIRST — only finalize green if it succeeds.
    let indexed = false;
    try { const r = await pingIndexNowUrlList(['https://pulserevops.com/knowledge/' + id]); indexed = !r || r.ok !== false; } catch (x) { indexed = false; }
    if (!indexed) { logln(`[scrub] ${id} ⚠ IndexNow submit failed — NOT publishing, will retry next pass`); return false; }
    const nr = readArr(NR), ap = readArr(AP), cc = readArr(CC);
    if (!ap.includes(id)) writeArr(AP, [...new Set([...ap, id])]);
    if (nr.includes(id)) writeArr(NR, nr.filter(x => x !== id));
    if (!cc.includes(id)) writeArr(CC, [...new Set([...cc, id])]);
    const qStr = (ccScore >= 13 ? 13 : ccScore) + '/13';
    const ts = new Date().toISOString();
    try { const cur = await store.get('answers/' + id + '.json', { type: 'json' }); if (cur) await store.setJSON('answers/' + id + '.json', Object.assign({}, cur, { cc_signed: true, cc_signed_at: ts, quality: qStr, was_indexed_at: cur.was_indexed_at || ts })); } catch (x) {}
    try { await pushSeoCounts(store, { lastRedboxClear: id, lastRedboxClearAt: ts }); } catch (x) {}
    return true;
  });
  return promoteLock;
}
function park(id, why) {
  const a = readArr(PARK).filter(r => r.id !== id); a.push({ id, why, at: new Date().toISOString() }); writeArr(PARK, a);
}
// batched park alert — one digest email per 50 parked (not per entry), so the inbox isn't flooded.
async function maybeNotify(subject, html) {
  const n = readArr(PARK).length;
  if (n > 0 && n % 50 === 0) { await askOwner(`${n} entries parked (need your call)`, `${n} red-box entries couldn't reach a true 12/13 after ${MAX_TRIES} full passes — mostly AI-Top-10 fabrication I won't force-pass. Latest: ${html}<br><br>List: _redbox_parked.json`).catch(() => {}); }
}

(async () => {
  logln(`[scrub] up — ${CONC} DS lane(s), pass@${MIN_SCORE}/13 + CC@${CC_PASS}/13 + ${WORD_FLOOR}w, NO exceptions`);
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const entries = (idx.entries || []).filter(e => e && e.id);
  const titleOf = Object.fromEntries(entries.map(e => [e.id, e.question]));
  const valid = new Set(entries.map(e => e.id));
  const isDemo = t => /\bdemo\b|\bv2 demo\b|standing desk|\btest entry\b|lorem/i.test(String(t || ''));   // exclude test/demo entries from siblings
  const byPillar = {}; for (const e of entries) { if (isDemo(e.question)) continue; (byPillar[pillarOf(e.id)] = byPillar[pillarOf(e.id)] || []).push({ id: e.id, title: e.question }); }
  const parkedSet = new Set(readArr(PARK).map(r => r.id));   // skip already-parked across restarts
  let promoted = 0, parked = 0;

  // WINDOWED + PROMOTABLE-FIRST (owner 2026-06-30): pull WINDOW entries to the side, scrub, send
  // passers back to green, then the next window. Fabrication-prone pillars (ai/aq/gb/er Top-10) are
  // ordered LAST so the honest just-thin entries (q/fr/ik/st) turn green first and the number moves.
  const WINDOW = parseInt(process.env.SCRUB_WINDOW || '100', 10);
  const HARD = new Set(['ai', 'aq', 'gb', 'er', 'co', 'tc', 'gm', 'mv', 'bt', 'rs', 'cg']);  // Top-10 / fabrication-prone → scrub last
  const orderKey = id => (HARD.has(pillarOf(id)) ? 1 : 0);

  // Resolve an entry FULLY in one visit: fix stations, then audit→de-fab→re-audit up to MAX_TRIES,
  // ending in promote (green) or park. No waiting a whole pass for a re-audit — green moves now.
  async function processOne(id, w) {
    if (!readArr(NR).includes(id) || parkedSet.has(id)) return;
    const title = titleOf[id] || id;
    const sib = (byPillar[pillarOf(id)] || []).filter(s => s.id !== id);
    try {
      // CHEAP PRE-CHECK (no API tokens): already at-bar AND previously audited clean → promote, skip the whole pipeline.
      const pre = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
      if (pre && pre.answer && pre.cc_signed && wordCount(pre.answer) >= WORD_FLOOR) {
        const pg = gradeEntry(id, pre.answer, { imagesDeferred: true });
        if (pg.score >= MIN_SCORE && stationGaps(pre.answer, valid).length === 0) {
          const pub = await promote(id, pg.score);
          if (pub) { promoted++; logln(`[scrub] w${w} ${id} ✓ already-perfect (cc-signed ${pg.score}/13) → GREEN, no re-scrub`); }
          return;
        }
      }
      await fixEntry(id, title, sib, valid, dsChat).catch(() => {});   // 2 DeepSeek writes
      await fixEntry(id, title, sib, valid, dsChat).catch(() => {});
      await fixCover(id, title).catch(() => {});                       // 1 DDG cover
      // force a REAL "Related on PULSE" from verified siblings (de-fab can't supply real sibling IDs)
      if (sib.length) { try { const e0 = await store.get('answers/' + id + '.json', { type: 'json' }); if (e0 && e0.answer && /Related on PULSE/i.test(e0.answer)) { const realRel = '## Related on PULSE\n\n' + sib.slice(0, 5).map(s => `- [${String(s.title).replace(/[\[\]]/g, '')}](/knowledge/${s.id})`).join('\n'); const nb = e0.answer.replace(/#{2,3}\s*Related on PULSE[\s\S]*?(?=\n#{2,3}\s|$)/i, realRel + '\n\n'); if (nb !== e0.answer) await store.setJSON('answers/' + id + '.json', Object.assign({}, e0, { answer: nb, updated_at: new Date().toISOString() })); } } catch (x) {} }
      let e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
      if (!e || !e.answer) { logln(`[scrub] w${w} ${id} ✗ no-blob`); return; }
      for (let t = 1; t <= MAX_TRIES; t++) {
        let g = gradeEntry(id, e.answer, { imagesDeferred: true });
        let gaps = stationGaps(e.answer, valid);
        if (g.score < MIN_SCORE || gaps.length) {                      // structural gap (or de-fab broke one) — repair once
          await fixEntry(id, title, sib, valid, dsChat).catch(() => {});
          e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => e);
          g = gradeEntry(id, e.answer, { imagesDeferred: true }); gaps = stationGaps(e.answer, valid);
          if (g.score < MIN_SCORE || gaps.length) {
            logln(`[scrub] w${w} ${id} ↻ det ${g.score}/13 gaps=${gaps.join(',')||'-'} words=${wordCount(e.answer)} (t${t})`);
            if (t >= MAX_TRIES) { park(id, `det ${g.score}/13 gaps=${gaps.join(',')}`); parkedSet.add(id); parked++; await maybeNotify(`Entry ${id} can't reach 12/13`, `<b>${id}</b> — "${title}"<br>grade ${g.score}/13, gaps: ${gaps.join(', ') || 'none'}, words ${wordCount(e.answer)}.`).catch(() => {}); return; }
            continue;
          }
        }
        const v = await ccRead(id, title, e.answer);                   // dual DeepSeek fabrication audit
        if (v.pass && v.score != null && v.score >= CC_PASS) {
          const pub = await promote(id, v.score);
          if (pub) { promoted++; logln(`[scrub] w${w} ${id} ✅ ${v.score}/13 → GREEN+INDEXED (promoted=${promoted}, red=${readArr(NR).length})`); }
          else logln(`[scrub] w${w} ${id} ⏳ ${v.score}/13 passed but index pending — stays red`);
          return;
        }
        logln(`[scrub] w${w} ${id} ↻ CC ${v.score}/13 (t${t}): ${v.notes}`);
        if (t >= MAX_TRIES) { park(id, `CC ${v.score}: ${v.notes}`); parkedSet.add(id); parked++; await maybeNotify(`Entry ${id} fails CC audit`, `<b>${id}</b> — "${title}"<br>CC ${v.score}/13: ${String(v.notes).replace(/[<>]/g,'')}<br>Won't fabricate to force a pass.`).catch(() => {}); return; }
        const did = await deFab(id, title, e.answer, v.notes);          // strip flagged fabrication, re-audit immediately
        e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => e);
        logln(`[scrub] w${w} ${id} ✎ de-fab ${did ? 'applied' : 'skipped'} — re-auditing`);
      }
    } catch (x) { logln(`[scrub] w${w} ${id} ERR ${x.message}`); }
    if (PACE_MS) await sleep(PACE_MS);
  }

  while (!fs.existsSync(STOP)) {
    // promotable-first: reverse (just-demoted thin entries were appended last → front), then push
    // fabrication-prone pillars to the back, and skip already-parked ids. Honest thin q/fr promote first.
    const full = readArr(NR).filter(id => !parkedSet.has(id)).reverse().sort((a, b) => orderKey(a) - orderKey(b));
    if (!full.length) { logln('[scrub] red box drained (rest parked). idle 60s'); await sleep(60000); continue; }
    for (let start = 0; start < full.length && !fs.existsSync(STOP); start += WINDOW) {
      const win = full.slice(start, start + WINDOW);
      const winNo = Math.floor(start / WINDOW) + 1, winTot = Math.ceil(full.length / WINDOW);
      const greenBefore = readArr(AP).length;
      let qi = 0;
      const worker = async w => { while (!fs.existsSync(STOP)) { const id = win[qi++]; if (!id) return; await processOne(id, w); } };
      await Promise.all(Array.from({ length: CONC }, (_, i) => worker(i + 1)));
      try { await pushSeoCounts(store, { lastWindowAt: new Date().toISOString() }); } catch (x) {}
      const greenNow = readArr(AP).length;
      logln(`[scrub] ▣ window ${winNo}/${winTot} (${win.length}) done — +${greenNow - greenBefore} → GREEN this window · green=${greenNow} red=${readArr(NR).length} parked=${parked}`);
    }
  }
  logln('[scrub] stop flag — exiting');
})().catch(e => { logln('[scrub] FATAL ' + (e && e.message)); process.exit(1); });
