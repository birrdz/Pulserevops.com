// _v2_final_gate.js — DEEPSEEK STAGE-2 FINAL GATE (4444 2026-06-30).
// Replaces CC auditor (_v2_auditor.js) when Claude Code is unavailable.
//
// TWO-STAGE APPROVAL (owner law):
//   Stage 1  _v2_components.js  → deterministic pass@12/13 + every station → _v2_approved.json (NO IndexNow)
//   Stage 2  THIS              → DS personal read; PASS only at 12/13 or 13/13 → _v2_cc_approved.json + IndexNow
//
// Final ledger = _v2_cc_approved.json (historical name; now DS final sign-off, not CC).
// Candidates = newest-first entries in _v2_approved.json NOT yet in _v2_cc_approved.json.
// Stop: _v2_final_gate_stop.flag · marker arg: v2finalgate · log: _v2_final_gate.out.log
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const { pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');
const { dsChat } = require('./_ds_lib');
const { fixEntry, C, wordFloorFor } = require('./_v2_components');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const STOP = WD + '/_v2_final_gate_stop.flag';
const APPROVED = WD + '/_v2_approved.json';
const FINAL_APPROVED = WD + '/_v2_cc_approved.json';   // publish-ready ledger (DS final sign-off)
const FINAL_REJECTS = WD + '/_v2_cc_rejects.json';
const FINAL_NEEDS_REVIEW = WD + '/_v2_final_needs_review.json';
const MAX_TRIES = parseInt(process.env.FINAL_DS_TRIES || '3', 10);
const dsAttempts = {};
const CONC = Math.max(1, parseInt(process.env.FINAL_DS_CONC || '2', 10));
const PACE_MS = parseInt(process.env.FINAL_DS_PACE_MS || '0', 10);
const MIN_SCORE = parseInt(process.env.V2C_MIN_SCORE || '12', 10);
const PASS_SCORE = parseInt(process.env.FINAL_PASS_SCORE || process.env.CC_PASS_SCORE || '12', 10);
const WORD_FLOOR = parseInt(process.env.V2C_WORDS || '2000', 10);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const logln = s => { try { fs.appendFileSync(WD + '/_v2_final_gate.out.log', new Date().toISOString() + ' ' + s + '\n'); } catch (e) {} console.log(s); };
const readArr = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return []; } };
const wordCount = b => (String(b || '').replace(/```[\s\S]*?```/g, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').match(/[A-Za-z0-9'-]+/g) || []).length;

function appendUnique(file, id) { const s = new Set(readArr(file)); if (!s.has(id)) { s.add(id); try { fs.writeFileSync(file, JSON.stringify([...s])); } catch (e) {} } }
function pushReject(id, why) { const a = readArr(FINAL_REJECTS).filter(r => r.id !== id); a.push({ id, why, at: new Date().toISOString() }); try { fs.writeFileSync(FINAL_REJECTS, JSON.stringify(a)); } catch (e) {} }
function pushNeedsReview(id, why) { const a = readArr(FINAL_NEEDS_REVIEW).filter(r => r.id !== id); a.push({ id, why, at: new Date().toISOString() }); try { fs.writeFileSync(FINAL_NEEDS_REVIEW, JSON.stringify(a)); } catch (e) {} }
async function publishCounts() {
  try {
    const { enrichContent } = require('./_seo_monitor_sync_lib');
    const cur = await store.get('seo-monitor/content.json', { type: 'json' }).catch(() => null) || {};
    const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' }).catch(() => null);
    await store.setJSON('seo-monitor/content.json', enrichContent(cur, {
      finalApproved: readArr(FINAL_APPROVED).length,
      finalNeedsReview: readArr(FINAL_NEEDS_REVIEW).length,
      finalAuditedAt: new Date().toISOString(),
      finalGate: 'deepseek',
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
  if (!/class=["']cro-ad/.test(b)) f.push('croCard');
  return f;
};

const AUDIT_SYS = `You are a senior content auditor for PULSE RevOps, a revenue-operations authority library. Your job is to confirm an answer is GENUINELY HIGH-VALUE and HONEST — not to nitpick it to death.

HARD FAILS (you MUST return FAIL if any are true):
- Any fabricated/invented stat, vendor, product, price, or quote presented as fact.
- The Direct Answer does not correctly answer the title (generic filler / off-topic).
- A required section is missing: Direct Answer, 6 FAQ Q&As, 2 mermaid diagrams, 5+ Sources, "Related on PULSE", or the Kory White CRO card.
- A mermaid with a REAL syntax error that will not render.
- Sources that are invented or implausible.

DO NOT FAIL for (these are NOT defects): minor word choice or polish; "could be tighter"; render-SAFE escaped characters in mermaid (e.g. &lt; &gt; <br/> &amp; that render fine); ordinary stylistic preference.

Score /13 by how strong the answer is. PASS when it is high-value, complete, correct, and fabrication-free (score >= ${PASS_SCORE}). Reply ONE line only, no preamble:
VERDICT=PASS|score=NN/13|notes=...
or
VERDICT=FAIL|score=NN/13|notes=<the specific HARD FAIL>`;

async function dsRead(id, title, body) {
  const user = `Audit this published answer for "${title}". Apply the HARD-FAIL list strictly, but PASS genuinely high-value, honest, complete content — do not invent nitpicks. A render-safe escaped mermaid is NOT a failure.\n\nScore /13. PASS at >= ${PASS_SCORE} when there are no HARD FAILS.\n\n--- ENTRY (${id}) ---\n${String(body).slice(0, 24000)}`;
  const r = await dsChat([{ role: 'system', content: AUDIT_SYS }, { role: 'user', content: user }], { temperature: 0.3, max_tokens: 200 });
  const txt = String(r.content || '');
  const pass = /VERDICT\s*=\s*PASS/i.test(txt);
  const sm = txt.match(/score\s*=\s*(\d+)\s*\/\s*13/i);
  const nm = txt.match(/notes\s*=\s*(.+)$/i);
  return { pass: pass && (!sm || parseInt(sm[1], 10) >= PASS_SCORE), score: sm ? parseInt(sm[1], 10) : null, notes: nm ? nm[1].trim().slice(0, 200) : txt.slice(0, 120) };
}

async function runTest(ids) {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const titleOf = Object.fromEntries((idx.entries || []).filter(e => e && e.id).map(e => [e.id, e.question]));
  const valid = new Set((idx.entries || []).filter(e => e && e.id).map(e => e.id));
  const results = [];
  for (const id of ids.slice(0, 5)) {
    const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
    if (!e || !e.answer) { results.push({ id, error: 'no-blob' }); continue; }
    const gaps = stationGaps(e.answer, valid);
    const v = gaps.length ? { pass: false, score: gradeEntry(id, e.answer, { imagesDeferred: true }).score, notes: 'stations: ' + gaps.join(',') } : await dsRead(id, titleOf[id] || id, e.answer);
    results.push({ id, gaps, verdict: v.pass ? 'PASS' : 'FAIL', score: v.score, notes: v.notes });
    logln(`[final-test] ${id} ${v.pass ? 'PASS' : 'FAIL'} ${v.score != null ? v.score + '/13' : ''} ${v.notes || ''}`);
  }
  console.log(JSON.stringify(results, null, 2));
  return results;
}

if (require.main === module && process.argv.includes('--test')) {
  const ids = process.argv.slice(process.argv.indexOf('--test') + 1).filter(x => !x.startsWith('-'));
  runTest(ids.length ? ids : readArr(APPROVED).slice(-5).reverse())
    .then(() => process.exit(0))
    .catch(e => { logln('[final-test] FATAL ' + e.message); process.exit(1); });
} else if (require.main === module) (async () => {
  if (!fs.existsSync(WD + '/_v2_allow_single_auditor.flag')) {
    logln('[final] REFUSING — _v2_cc_approved.json is dual-gate only (_v2_nr_dual_gate.js). Create _v2_allow_single_auditor.flag to override.');
    process.exit(0);
  }
  logln(`[final] DS Stage-2 final gate up — ${CONC} worker(s), pass@12/13 (PASS=${PASS_SCORE}), newest-first`);
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const allIds = (idx.entries || []).filter(e => e && e.id).map(e => ({ id: e.id, title: e.question }));
  const titleOf = Object.fromEntries(allIds.map(e => [e.id, e.title]));
  const valid = new Set(allIds.map(e => e.id));
  const byPillar = {}; const pillarOf = id => (String(id).match(/^[a-z]+/) || [''])[0];
  for (const e of allIds) (byPillar[pillarOf(e.id)] = byPillar[pillarOf(e.id)] || []).push(e);

  while (!fs.existsSync(STOP)) {
    await publishCounts();
    const finalDone = new Set(readArr(FINAL_APPROVED));
    const approved = readArr(APPROVED);
    const queue = approved.filter(id => !finalDone.has(id)).reverse();
    const PRIORITY = (process.env.FINAL_PRIORITY_PILLAR || '').toLowerCase();
    if (PRIORITY) queue.sort((a, b) => (pillarOf(b) === PRIORITY ? 1 : 0) - (pillarOf(a) === PRIORITY ? 1 : 0));
    if (!queue.length) { logln('[final] all caught up — idle 5m'); await sleep(300000); continue; }
    logln(`[final] ${queue.length} entries awaiting DS final sign-off (newest-first)`);
    let qi = 0;
    async function worker(wid) {
      while (!fs.existsSync(STOP)) {
        const id = queue[qi++]; if (!id) return;
        const title = titleOf[id] || id;
        try {
          let e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
          if (!e || !e.answer) { pushReject(id, 'no-blob'); removeApproved(id); logln(`[final] w${wid} ${id} ✗ no blob — removed`); continue; }
          let gaps = stationGaps(e.answer, valid);
          if (gaps.length) {
            const sib = (byPillar[pillarOf(id)] || []).filter(s => s.id !== id);
            await fixEntry(id, title, sib, valid, dsChat).catch(() => {});
            e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
            gaps = e && e.answer ? stationGaps(e.answer, valid) : ['no-blob'];
          }
          if (gaps.length) {
            dsAttempts[id] = (dsAttempts[id] || 0) + 1; pushReject(id, 'stations: ' + gaps.join(','));
            if (dsAttempts[id] >= MAX_TRIES) { removeApproved(id); pushNeedsReview(id, 'stations: ' + gaps.join(',')); logln(`[final] w${wid} ${id} ⚠️ NEEDS REVIEW after ${MAX_TRIES} tries — stations: ${gaps.join(',')}`); }
            else logln(`[final] w${wid} ${id} ↻ stations ${gaps.join(',')} (try ${dsAttempts[id]})`);
            continue;
          }
          const v = await dsRead(id, title, e.answer);
          const dsScore = v.score != null ? v.score : null;
          const passAt12 = v.pass && dsScore != null && dsScore >= PASS_SCORE;
          if (passAt12) {
            delete dsAttempts[id]; appendUnique(FINAL_APPROVED, id);
            const qStr = dsScore + '/13';
            try { const cur = await store.get('answers/' + id + '.json', { type: 'json' }); if (cur) await store.setJSON('answers/' + id + '.json', Object.assign({}, cur, { final_signed: true, final_signed_at: new Date().toISOString(), final_gate: 'deepseek', quality: qStr })); } catch (x) {}
            try { await pingIndexNowUrlList(['https://pulserevops.com/knowledge/' + id]); } catch (x) {}
            logln(`[final] w${wid} ${id} ✅ FINAL-SIGNED ${qStr} publish-ready (final-approved ${readArr(FINAL_APPROVED).length})${v.notes ? ' — ' + v.notes : ''}`);
          } else if (v.pass && dsScore != null && dsScore < PASS_SCORE) {
            dsAttempts[id] = (dsAttempts[id] || 0) + 1; pushReject(id, `ds score=${dsScore} below ${PASS_SCORE}/13 min`);
            if (dsAttempts[id] >= MAX_TRIES) { removeApproved(id); pushNeedsReview(id, `sub-12 score=${dsScore}`); logln(`[final] w${wid} ${id} ⚠️ NEEDS REVIEW — score ${dsScore}/13 < ${PASS_SCORE} after ${MAX_TRIES} tries`); }
            else logln(`[final] w${wid} ${id} ↻ sub-12 score ${dsScore}/13 (try ${dsAttempts[id]})`);
          } else {
            dsAttempts[id] = (dsAttempts[id] || 0) + 1; pushReject(id, `ds score=${v.score} ${v.notes}`);
            if (dsAttempts[id] >= MAX_TRIES) { removeApproved(id); pushNeedsReview(id, `ds-stuck score=${v.score} ${v.notes}`); logln(`[final] w${wid} ${id} ⚠️ NEEDS REVIEW after ${MAX_TRIES} tries — score=${v.score} ${v.notes}`); }
            else {
              await fixEntry(id, title, (byPillar[pillarOf(id)] || []).filter(s => s.id !== id), valid, dsChat).catch(() => {});
              logln(`[final] w${wid} ${id} ↻ improving (try ${dsAttempts[id]}) — ${v.notes}`);
            }
          }
        } catch (x) { logln(`[final] w${wid} ${id} ERR ${x.message}`); }
        if (PACE_MS) await sleep(PACE_MS);
      }
    }
    await Promise.all(Array.from({ length: CONC }, (_, i) => worker(i + 1)));
  }
  logln('[final] stop flag — exiting');
})().catch(e => { logln('[final] FATAL ' + (e && e.message)); process.exit(1); });
