// _v2_auditor.js — CC STAGE-2 PERSONAL AUDITOR (4444 2026-06-30, re-instated).
// The CC auditor was dropped ~2026-06-30 03:04Z (Claude CLI was erroring / out of tokens), after
// which entries were deterministic-approved with NO personal read. Owner wants 13/13 high-quality,
// personally verified by Claude Code, on every entry from the drop point forward + going forward.
//
// TWO-STAGE APPROVAL (owner law: DeepSeek/CC FIX → Anthropic AUDITS):
//   Stage 1  _v2_components.js  → deterministic pass@12/13 (13 ideal, 12 min) + every station → _v2_approved.json
//   Stage 2  THIS              → CC personal read; PASS only at 12/13 or 13/13 → _v2_cc_approved.json + IndexNow
//
// Candidates = newest-first entries in _v2_approved.json NOT yet in _v2_cc_approved.json.
// Slow on purpose (CC personal read is the quality pace-setter — owner: "slow it down for QC").
// Dies on host close; supervisor relaunches. Stop: _v2_auditor_stop.flag.
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const { isComparisonEntry, expertPanelFor, expertAuditSystem, auditComparisonEntry } = require('./netlify/functions/lib/vs-expert-verify');
const { pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');
const { claudeChat } = require('./_claude_chat');
const { fixEntry, C, wordFloorFor } = require('./_v2_components');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const STOP = WD + '/_v2_auditor_stop.flag';
const APPROVED = WD + '/_v2_approved.json';
const CC_APPROVED = WD + '/_v2_cc_approved.json';
const CC_REJECTS = WD + '/_v2_cc_rejects.json';
const CC_NEEDS_REVIEW = WD + '/_v2_cc_needs_review.json';   // CC couldn't sign off after 3 tries → owner deep-audit
const CC_BOX12 = WD + '/_v2_cc_12of13.json';                // 12/13 "look at later" box — strong but not flawless, parked (no churn)
const MAX_CC_TRIES = parseInt(process.env.CC_AUDIT_TRIES || '3', 10);
const ccAttempts = {};
const CONC = Math.max(1, parseInt(process.env.CC_AUDIT_CONC || '2', 10));   // 2 CC audit workers (slow, Max plan)
const PACE_MS = parseInt(process.env.CC_AUDIT_PACE_MS || '0', 10);
const MIN_SCORE = parseInt(process.env.V2C_MIN_SCORE || '12', 10);   // pass@12: deterministic station gate (13 ideal, 12 min)
const WORD_FLOOR = parseInt(process.env.V2C_WORDS || '2000', 10);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const logln = s => { try { fs.appendFileSync(WD + '/_v2_auditor.out.log', new Date().toISOString() + ' ' + s + '\n'); } catch (e) {} console.log(s); };
const readArr = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return []; } };
const wordCount = b => (String(b || '').replace(/```[\s\S]*?```/g, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').match(/[A-Za-z0-9'-]+/g) || []).length;

// clobber-safe single-key append (re-read just before write to merge concurrent worker adds)
function appendUnique(file, id) { const s = new Set(readArr(file)); if (!s.has(id)) { s.add(id); try { fs.writeFileSync(file, JSON.stringify([...s])); } catch (e) {} } }
function pushReject(id, why) { const a = readArr(CC_REJECTS).filter(r => r.id !== id); a.push({ id, why, at: new Date().toISOString() }); try { fs.writeFileSync(CC_REJECTS, JSON.stringify(a)); } catch (e) {} }
function pushNeedsReview(id, why) { const a = readArr(CC_NEEDS_REVIEW).filter(r => r.id !== id); a.push({ id, why, at: new Date().toISOString() }); try { fs.writeFileSync(CC_NEEDS_REVIEW, JSON.stringify(a)); } catch (e) {} }
function pushBox12(id, title, why) { const a = readArr(CC_BOX12).filter(r => r.id !== id); a.push({ id, title, score: 12, why, at: new Date().toISOString() }); try { fs.writeFileSync(CC_BOX12, JSON.stringify(a)); } catch (e) {} }
// publish CC-audit counts to the /seo monitor blob (clobber-safe ADD — never overwrite the engine's needsReview)
async function publishCounts() {
  try {
    const { enrichContent } = require('./_seo_monitor_sync_lib');
    const cur = await store.get('seo-monitor/content.json', { type: 'json' }).catch(() => null) || {};
    const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' }).catch(() => null);
    await store.setJSON('seo-monitor/content.json', enrichContent(cur, {
      ccApproved: readArr(CC_APPROVED).length,
      ccNeedsReview: readArr(CC_NEEDS_REVIEW).length,
      ccAuditedAt: new Date().toISOString(),
    }, idx));
  } catch (e) {}
}
function removeApproved(id) { const a = readArr(APPROVED).filter(x => x !== id); try { fs.writeFileSync(APPROVED, JSON.stringify(a)); } catch (e) {} }

const stationGaps = (b, valid) => {
  const f = [];
  if (gradeEntry('x', b, { imagesDeferred: true }).score < MIN_SCORE) f.push(`score<${MIN_SCORE}`);
  if (wordCount(b) < WORD_FLOOR) f.push('words<2000');
  if (!C.directAnswer(b)) f.push('directAnswer');
  if (!C.faq5(b)) f.push('faq');
  if (!C.twoMermaid(b)) f.push('mermaid2');
  if (!C.mermaidClean(b)) f.push('mermaidDirty');
  if (!C.sources5(b)) f.push('sources5');
  if (!C.related(b)) f.push('related');
  if (!C.linksClean(b, valid)) f.push('links');
  // croCard station intentionally EXCLUDED: the CRO card is injected at render-time
  // (pulse-machine-entry.js), never stored in the body — checking the body false-fails every
  // entry (see _redbox_repopulate.js). owner 2026-07-06.
  return f;
};

// CC PERSONAL READ — strict semantic audit. Returns { pass, score, notes }.
// HIGH-VALUE gate (owner 2026-06-30, 4444): confirm the answer is genuinely high-value & honest —
// do NOT nitpick it to death. Pass strong content; reserve FAIL for real defects (fabrication,
// wrong answer, a missing section, a truly broken mermaid). PASS threshold = CC_PASS_SCORE (default 12).
const CC_PASS_SCORE = parseInt(process.env.CC_PASS_SCORE || '12', 10);
const AUDIT_SYS = `You are a senior content auditor for PULSE RevOps, a revenue-operations authority library. Your job is to confirm an answer is GENUINELY HIGH-VALUE and HONEST — not to nitpick it to death.

HARD FAILS (you MUST return FAIL if any are true):
- Any fabricated/invented stat, vendor, product, price, or quote presented as fact.
- The Direct Answer does not correctly answer the title (generic filler / off-topic).
- A required section is missing: Direct Answer, 6 FAQ Q&As, 2 mermaid diagrams, 5+ Sources, "Related on PULSE", or the Kory White CRO card.
- A mermaid with a REAL syntax error that will not render.
- Sources that are invented or implausible.

DO NOT FAIL for (these are NOT defects): minor word choice or polish; "could be tighter"; render-SAFE escaped characters in mermaid (e.g. &lt; &gt; <br/> &amp; that render fine); ordinary stylistic preference.

Score /13 by how strong the answer is. PASS when it is high-value, complete, correct, and fabrication-free (score >= ${CC_PASS_SCORE}). Reply ONE line only, no preamble:
VERDICT=PASS|score=NN/13|notes=...
or
VERDICT=FAIL|score=NN/13|notes=<the specific HARD FAIL>`;
async function ccRead(id, title, body) {
  let sys = AUDIT_SYS;
  if (isComparisonEntry(id, title, body)) {
    const struct = auditComparisonEntry(id, title, body);
    if (!struct.structuralPass) {
      return { pass: false, score: 0, notes: 'vs structural fail: ' + (struct.gaps || []).join(', ') };
    }
    const panel = expertPanelFor(id, title, body);
    sys = expertAuditSystem(panel) + `\n\nAlso enforce general PULSE completeness (Direct Answer, FAQ, mermaid, Sources). Score /13. PASS at >= ${CC_PASS_SCORE}.`;
  }
  const user = `Audit this published answer for "${title}". Apply the HARD-FAIL list strictly, but PASS genuinely high-value, honest, complete content — do not invent nitpicks. A render-safe escaped mermaid is NOT a failure.\n\nScore /13. PASS at >= ${CC_PASS_SCORE} when there are no HARD FAILS.\n\n--- ENTRY (${id}) ---\n${String(body).slice(0, 24000)}`;
  const r = await claudeChat([{ role: 'system', content: sys }, { role: 'user', content: user }], { timeoutMs: 240000 });
  const txt = String(r.content || '');
  const pass = /VERDICT\s*=\s*PASS/i.test(txt);
  const sm = txt.match(/score\s*=\s*(\d+)\s*\/\s*13/i);
  const nm = txt.match(/notes\s*=\s*(.+)$/i);
  return { pass: pass && (!sm || parseInt(sm[1], 10) >= CC_PASS_SCORE), score: sm ? parseInt(sm[1], 10) : null, notes: nm ? nm[1].trim().slice(0, 200) : txt.slice(0, 120) };
}

// CC IMPROVEMENT PASS — revise the body to fix exactly the auditor's critique and reach a flawless 13/13.
const IMPROVE_SYS = `You are revising a published PULSE RevOps answer to reach a FLAWLESS 13/13. Fix EXACTLY the problems the auditor noted (contradictions, weak/padded prose, broken mermaid syntax, thin FAQ, vague answer, etc.). KEEP every required section: a "## Direct Answer", 6 real FAQ Q&As, 2 VALID render-safe mermaid diagrams, a "## Sources" with 5+ REAL references, "## Related on PULSE", and the Kory White CRO card. NO fabricated stats/vendors/prices. Output ONLY the full corrected Markdown body — no preamble, no code fences around the whole thing.`;
async function ccImprove(id, title, body, critique) {
  try {
    const r = await claudeChat([{ role: 'system', content: IMPROVE_SYS }, { role: 'user', content: `Title: "${title}"\n\nAUDITOR CRITIQUE TO FIX:\n${critique}\n\nCURRENT BODY:\n${String(body).slice(0, 26000)}\n\nReturn the full corrected Markdown body now.` }], { timeoutMs: 300000 });
    let nb = String(r.content || '').replace(/^```[a-z]*\s*/i, '').replace(/\s*```$/i, '').trim();
    if (nb.length < Math.max(800, String(body).length * 0.6)) return false;   // guard against truncated/garbled rewrites
    const cur = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
    if (cur) { await store.setJSON('answers/' + id + '.json', Object.assign({}, cur, { answer: nb, updated_at: new Date().toISOString() })); return true; }
  } catch (e) {}
  return false;
}

if (require.main === module) (async () => {
  if (!fs.existsSync(WD + '/_v2_allow_single_auditor.flag')) {
    logln('[audit] REFUSING — _v2_cc_approved.json is dual-gate only (_v2_nr_dual_gate.js). Create _v2_allow_single_auditor.flag to override.');
    process.exit(0);
  }
  logln(`[audit] CC Stage-2 personal auditor up — ${CONC} CC worker(s), pass@12/13 (CC_PASS=${CC_PASS_SCORE}), newest-first`);
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const allIds = (idx.entries || []).filter(e => e && e.id).map(e => ({ id: e.id, title: e.question }));
  const titleOf = Object.fromEntries(allIds.map(e => [e.id, e.title]));
  const valid = new Set(allIds.map(e => e.id));
  const byPillar = {}; const pillarOf = id => (String(id).match(/^[a-z]+/) || [''])[0];
  for (const e of allIds) (byPillar[pillarOf(e.id)] = byPillar[pillarOf(e.id)] || []).push(e);

  while (!fs.existsSync(STOP)) {
    await publishCounts();
    const ccDone = new Set(readArr(CC_APPROVED));
    const approved = readArr(APPROVED);
    // newest-first: last appended = most recently det-approved (the post-drop tail = priority)
    const queue = approved.filter(id => !ccDone.has(id)).reverse();
    const PRIORITY = (process.env.CC_AUDIT_PRIORITY_PILLAR || '').toLowerCase();   // e.g. 'tl' = Pulse Tools first
    if (PRIORITY) queue.sort((a, b) => (pillarOf(b) === PRIORITY ? 1 : 0) - (pillarOf(a) === PRIORITY ? 1 : 0));  // stable: priority pillar to front, newest-first within
    if (!queue.length) { logln('[audit] all caught up — idle 5m'); await sleep(300000); continue; }
    logln(`[audit] ${queue.length} entries awaiting CC sign-off (newest-first)`);
    let qi = 0;
    async function worker(wid) {
      while (!fs.existsSync(STOP)) {
        const id = queue[qi++]; if (!id) return;
        const title = titleOf[id] || id;
        try {
          let e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
          if (!e || !e.answer) { pushReject(id, 'no-blob'); removeApproved(id); logln(`[audit] w${wid} ${id} ✗ no blob — removed`); continue; }
          let gaps = stationGaps(e.answer, valid);
          if (gaps.length) {  // repair deterministically first (incl CRO), CC engine fixers
            const sib = (byPillar[pillarOf(id)] || []).filter(s => s.id !== id);
            await fixEntry(id, title, sib, valid, claudeChat).catch(() => {});
            e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
            gaps = e && e.answer ? stationGaps(e.answer, valid) : ['no-blob'];
          }
          if (gaps.length) {  // still missing after the repair attempt — retry (stays in approved) up to MAX, then manual review
            ccAttempts[id] = (ccAttempts[id] || 0) + 1; pushReject(id, 'stations: ' + gaps.join(','));
            if (ccAttempts[id] >= MAX_CC_TRIES) { removeApproved(id); pushNeedsReview(id, 'stations: ' + gaps.join(',')); logln(`[audit] w${wid} ${id} ⚠️ NEEDS REVIEW after ${MAX_CC_TRIES} tries — stations: ${gaps.join(',')}`); }
            else logln(`[audit] w${wid} ${id} ↻ stations ${gaps.join(',')} (try ${ccAttempts[id]}) — will re-fix next pass`);
            continue;
          }
          const v = await ccRead(id, title, e.answer);
          const ccScore = v.score != null ? v.score : null;
          const passAt12 = v.pass && ccScore != null && ccScore >= CC_PASS_SCORE;
          if (passAt12) {
            delete ccAttempts[id]; appendUnique(CC_APPROVED, id);
            const qStr = ccScore + '/13';
            // stamp the blob so the renderer shows the GOLD trim + accurate score (12/13 or 13/13) on the live Q&A page
            try { const cur = await store.get('answers/' + id + '.json', { type: 'json' }); if (cur && cur.quality !== qStr) await store.setJSON('answers/' + id + '.json', Object.assign({}, cur, { cc_signed: true, cc_signed_at: new Date().toISOString(), quality: qStr })); } catch (x) {}
            try { await pingIndexNowUrlList(['https://pulserevops.com/knowledge/' + id]); } catch (x) {}
            logln(`[audit] w${wid} ${id} ✅ CC-SIGNED ${qStr} publish-ready (cc-approved ${readArr(CC_APPROVED).length})${v.notes ? ' — ' + v.notes : ''}`);
          } else if (v.pass && ccScore != null && ccScore < CC_PASS_SCORE) {
            ccAttempts[id] = (ccAttempts[id] || 0) + 1; pushReject(id, `cc score=${ccScore} below ${CC_PASS_SCORE}/13 min`);
            if (ccAttempts[id] >= MAX_CC_TRIES) { removeApproved(id); pushNeedsReview(id, `sub-12 score=${ccScore}`); logln(`[audit] w${wid} ${id} ⚠️ NEEDS REVIEW — score ${ccScore}/13 < ${CC_PASS_SCORE} after ${MAX_CC_TRIES} tries`); }
            else logln(`[audit] w${wid} ${id} ↻ sub-12 score ${ccScore}/13 (try ${ccAttempts[id]}) — must reach ≥${CC_PASS_SCORE}/13`);
          }
          else {  // not flawless → ACTIVELY IMPROVE the body to 13/13 per the critique, then re-audit next pass
            ccAttempts[id] = (ccAttempts[id] || 0) + 1; pushReject(id, `cc score=${v.score} ${v.notes}`);
            if (ccAttempts[id] >= MAX_CC_TRIES) { removeApproved(id); pushNeedsReview(id, `cc-stuck score=${v.score} ${v.notes}`); logln(`[audit] w${wid} ${id} ⚠️ NEEDS REVIEW after ${MAX_CC_TRIES} improve tries — score=${v.score} ${v.notes}`); }
            else { const imp = await ccImprove(id, title, e.answer, v.notes); logln(`[audit] w${wid} ${id} ↻ improving ${v.score}→13 (try ${ccAttempts[id]}${imp ? '' : ', rewrite-skipped'}) — ${v.notes}`); }
          }
        } catch (x) { logln(`[audit] w${wid} ${id} ERR ${x.message}`); }
        if (PACE_MS) await sleep(PACE_MS);
      }
    }
    await Promise.all(Array.from({ length: CONC }, (_, i) => worker(i + 1)));
  }
  logln('[audit] stop flag — exiting');
})().catch(e => { logln('[audit] FATAL ' + (e && e.message)); process.exit(1); });
