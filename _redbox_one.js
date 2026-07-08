// _redbox_one.js — OWNER 1-by-1 red-box driver (2026-06-30).
// Fix ONE needs-review entry end-to-end with the exact crew gate, then move it red→green (1:1).
//   2 DeepSeek writes (fixEntry ×2)  ·  1 DDG cover (if missing)  ·  1 CC personal audit  ·  owner sign-off
// Promote ONLY when: deterministic gradeEntry >= MIN_SCORE + every text station + CC PASS >= CC_PASS.
// Promotion is clobber-safe (re-read each ledger immediately before write) so it is safe even if
// another writer is active. Accounting is strictly 1:1 — NR -1, AP +1 (warns otherwise).
//
//   node _redbox_one.js <id>          fix+audit+promote a specific id
//   node _redbox_one.js --next        take the first id in _v2_needs_review.json
//   node _redbox_one.js --audit <id>  audit only, do NOT write/promote (dry look)
//
// Prints ONE JSON result line: { id, detScore, ccScore, ccPass, promoted, redBefore, redAfter, greenBefore, greenAfter, notes }
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
if (!process.env.V2C_MIN_SCORE) process.env.V2C_MIN_SCORE = '12';

const { getStore } = require('@netlify/blobs');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const { claudeChat } = require('./_claude_chat');
const { dsChat } = require('./_ds_lib');
const { fixEntry, C } = require('./_v2_components');
const { fixCover } = require('./_v2_nr_ddg');
const { pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');
const { pushSeoCounts } = require('./_seo_monitor_sync_lib');

const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const NR = WD + '/_v2_needs_review.json';
const AP = WD + '/_v2_approved.json';
const CC = WD + '/_v2_cc_approved.json';
const MIN_SCORE = parseInt(process.env.V2C_MIN_SCORE || '12', 10);
const CC_PASS = parseInt(process.env.CC_PASS_SCORE || '12', 10);
const WORD_FLOOR = parseInt(process.env.V2C_WORDS || '2000', 10);

const readArr = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return []; } };
const writeArr = (f, a) => fs.writeFileSync(f, JSON.stringify(a));
const wordCount = b => (String(b || '').replace(/```[\s\S]*?```/g, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').match(/[A-Za-z0-9'-]+/g) || []).length;
const pillarOf = id => (String(id).match(/^[a-z]+/) || [''])[0];

// every text station the crew requires (images are deferred to the DDG lanes, per system law)
function stationGaps(b, valid) {
  const f = [];
  if (gradeEntry('x', b, { imagesDeferred: true }).score < MIN_SCORE) f.push('score<' + MIN_SCORE);
  if (wordCount(b) < WORD_FLOOR) f.push('words<' + WORD_FLOOR);
  if (!C.directAnswer(b)) f.push('directAnswer');
  if (!C.faq5(b)) f.push('faq6');
  if (!C.twoMermaid(b)) f.push('mermaid2');
  if (!C.mermaidClean(b)) f.push('mermaidDirty');
  if (!C.sources5(b)) f.push('sources5');
  if (!C.related(b)) f.push('related');
  if (!C.linksClean(b, valid)) f.push('links');
  return f;
}

const AUDIT_SYS = `You are a senior content auditor for PULSE RevOps, a revenue-operations authority library. Confirm an answer is GENUINELY HIGH-VALUE and HONEST — do not nitpick.
HARD FAILS (return FAIL if any true): fabricated stat/vendor/product/price/quote as fact; Direct Answer does not answer the title; a required section missing (Direct Answer, 6 FAQ Q&As, 2 mermaid, 5+ Sources, "Related on PULSE"); a mermaid with a REAL syntax error; invented/implausible Sources.
DO NOT FAIL for: minor word choice; "could be tighter"; render-safe escaped chars in mermaid; stylistic preference.
Score /13. PASS at >= ${CC_PASS} when high-value, complete, correct, fabrication-free. Reply ONE line only:
VERDICT=PASS|score=NN/13|notes=...   or   VERDICT=FAIL|score=NN/13|notes=<the HARD FAIL>`;

async function ccRead(id, title, body) {
  const user = `Audit this published answer for "${title}". Apply HARD-FAIL list strictly but PASS genuinely high-value, honest, complete content. Score /13. PASS at >= ${CC_PASS}.\n\n--- ENTRY (${id}) ---\n${String(body).slice(0, 24000)}`;
  const r = await claudeChat([{ role: 'system', content: AUDIT_SYS }, { role: 'user', content: user }], { timeoutMs: 240000 });
  const txt = String(r.content || '');
  const pass = /VERDICT\s*=\s*PASS/i.test(txt);
  const sm = txt.match(/score\s*=\s*(\d+)\s*\/\s*13/i);
  const nm = txt.match(/notes\s*=\s*(.+)$/i);
  return { pass: pass && (!sm || parseInt(sm[1], 10) >= CC_PASS), score: sm ? parseInt(sm[1], 10) : null, notes: nm ? nm[1].trim().slice(0, 220) : txt.slice(0, 160) };
}

(async () => {
  const arg = process.argv[2];
  const auditOnly = arg === '--audit';
  let id = auditOnly ? process.argv[3] : arg;
  if (arg === '--next') { const q = readArr(NR); id = q[0]; }
  if (!id) { console.log(JSON.stringify({ error: 'no id (pass <id>, --next, or --audit <id>)' })); process.exit(1); }

  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const entries = (idx.entries || []).filter(e => e && e.id);
  const titleOf = Object.fromEntries(entries.map(e => [e.id, e.question]));
  const valid = new Set(entries.map(e => e.id));
  const title = titleOf[id] || id;
  const sib = entries.filter(e => pillarOf(e.id) === pillarOf(id) && e.id !== id).map(e => ({ id: e.id, title: e.question }));

  const out = { id, title: String(title).slice(0, 90), pillar: pillarOf(id) };

  // ── 2 DeepSeek writes ──
  let w1 = null, w2 = null;
  if (!auditOnly) {
    w1 = await fixEntry(id, title, sib, valid, dsChat).catch(e => ({ err: e.message }));
    w2 = await fixEntry(id, title, sib, valid, dsChat).catch(e => ({ err: e.message }));
    out.ds1 = w1 && (w1.fixed ? w1.fixed.join('+') || 'none' : w1.err || w1.skipped);
    out.ds2 = w2 && (w2.fixed ? w2.fixed.join('+') || 'none' : w2.err || w2.skipped);
    // ── 1 DDG cover (if missing) ──
    out.ddg = await fixCover(id, title).catch(e => 'err:' + e.message);
  }

  // re-load final body
  const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
  if (!e || !e.answer) { console.log(JSON.stringify(Object.assign(out, { error: 'no-blob' }))); process.exit(0); }
  const body = e.answer;

  const g = gradeEntry(id, body, { imagesDeferred: true });
  out.detScore = g.score;
  out.words = wordCount(body);
  const gaps = stationGaps(body, valid);
  out.stationGaps = gaps;

  // ── 1 CC personal audit ──
  const v = await ccRead(id, title, body);
  out.ccScore = v.score; out.ccPass = v.pass; out.notes = v.notes;

  const detOk = g.score >= MIN_SCORE && gaps.length === 0;
  const passes = detOk && v.pass && v.score != null && v.score >= CC_PASS;
  out.gatePass = passes;

  if (auditOnly || !passes) { console.log(JSON.stringify(out)); process.exit(0); }

  // ── owner sign-off: move red→green, 1:1, clobber-safe ──
  const nrBefore = readArr(NR), apBefore = readArr(AP), ccBefore = readArr(CC);
  out.redBefore = nrBefore.length; out.greenBefore = apBefore.length;
  if (apBefore.includes(id)) {
    // already green — just dedupe out of red
    const nrAfter = nrBefore.filter(x => x !== id);
    if (nrAfter.length < nrBefore.length) writeArr(NR, nrAfter);
    out.note = 'already-green';
  } else {
    const nrAfter = nrBefore.filter(x => x !== id);
    const apAfter = [...new Set([...apBefore, id])];
    writeArr(AP, apAfter);
    writeArr(NR, nrAfter);
    const redDrop = nrBefore.length - nrAfter.length;
    const greenRise = apAfter.length - apBefore.length;
    if (redDrop !== greenRise) out.accountingWarn = `red-${redDrop} green+${greenRise}`;
  }
  // stage-2 publish: cc-approved + stamp + IndexNow
  const qStr = (v.score >= 13 ? 13 : v.score) + '/13';
  if (!ccBefore.includes(id)) writeArr(CC, [...new Set([...ccBefore, id])]);
  try { const cur = await store.get('answers/' + id + '.json', { type: 'json' }); if (cur) await store.setJSON('answers/' + id + '.json', Object.assign({}, cur, { cc_signed: true, cc_signed_at: new Date().toISOString(), quality: qStr })); } catch (x) {}
  try { await pingIndexNowUrlList(['https://pulserevops.com/knowledge/' + id]); out.indexnow = 'pinged'; } catch (x) { out.indexnow = 'err'; }
  try { await pushSeoCounts(store, { lastRedboxClear: id, lastRedboxClearAt: new Date().toISOString() }); } catch (x) {}

  out.redAfter = readArr(NR).length; out.greenAfter = readArr(AP).length;
  out.promoted = true; out.quality = qStr;
  console.log(JSON.stringify(out));
  process.exit(0);
})().catch(e => { console.log(JSON.stringify({ fatal: e && e.message })); process.exit(1); });
