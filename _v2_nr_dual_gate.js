// _v2_nr_dual_gate.js — RED BOX dual DeepSeek auditors (4444). BOTH must PASS @12/13 before publish.
// Pre-publish deterministic spot-check via _v2_publish_verify.js · post-publish: _v2_spotcheck_watch.js
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { pingIndexNowEntry } = require('./netlify/functions/lib/indexnow-ping-entry');
const { dsChat } = require('./_ds_lib');
const { fixEntry, C } = require('./_v2_components');
const { fixCover } = require('./_v2_nr_ddg');
const { spotCheckEntry, MIN_SCORE, WORD_FLOOR } = require('./_v2_publish_verify');
const { pushSeoCounts } = require('./_seo_monitor_sync_lib');

const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});

const STOP = WD + '/_v2_nr_dual_gate_stop.flag';
const QUEUE = WD + '/_v2_redbox_audit_queue.json';
const DUAL = WD + '/_v2_redbox_dual.json';
const FINAL = WD + '/_v2_cc_approved.json';
const AP = WD + '/_v2_approved.json';
const NR = WD + '/_v2_needs_review.json';
const COMPLETE = WD + '/_v2_redbox_complete.flag';
const LOG = WD + '/_v2_nr_dual_gate.out.log';
const CONC = Math.max(2, parseInt(process.env.RED_DUAL_CONC || '3', 10));
const PASS_SCORE = parseInt(process.env.FINAL_PASS_SCORE || process.env.V2C_MIN_SCORE || '12', 10);
const PACE_MS = parseInt(process.env.RED_DUAL_PACE_MS || '100', 10);

const logln = s => { const line = new Date().toISOString() + ' ' + s; try { fs.appendFileSync(LOG, line + '\n'); } catch (e) {} if (process.stdout.isTTY) console.log(line); };
const readArr = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return []; } };
const writeArr = (f, arr) => { fs.writeFileSync(f, JSON.stringify(Array.isArray(arr) ? arr : [...arr])); };
const readDual = () => { try { return JSON.parse(fs.readFileSync(DUAL, 'utf8')); } catch (e) { return {}; } };
const writeDual = o => { try { fs.writeFileSync(DUAL, JSON.stringify(o, null, 2)); } catch (e) {} };
let ledgerLock = Promise.resolve();
function withLedger(fn) {
  const p = ledgerLock.then(() => fn());
  ledgerLock = p.catch(() => {});
  return p;
}
function slotFor(dual, id) {
  if (!dual[id]?.a1?.pass) return { slot: 'a1', label: 'Auditor-1' };
  if (!dual[id]?.a2?.pass) return { slot: 'a2', label: 'Auditor-2' };
  return null;
}
const pillarOf = id => (String(id).match(/^[a-z]+/) || [''])[0];
const engineMode = () => fs.existsSync(COMPLETE);

function getAuditTodo() {
  const finalDone = new Set(readArr(FINAL));
  if (engineMode()) return readArr(AP).filter(id => !finalDone.has(id)).reverse();
  return readArr(QUEUE).filter(id => !finalDone.has(id));
}

const AUDIT_SYS = `You are {SLOT} for PULSE RevOps QA (2 independent auditors). HARD FAIL: fabrication, wrong answer, missing sections, broken mermaid, fake sources. PASS at >= ${PASS_SCORE}/13. One line:
VERDICT=PASS|score=NN/13|notes=...
or VERDICT=FAIL|score=NN/13|notes=...`;

async function dsRead(id, title, body, slotLabel) {
  const r = await dsChat([
    { role: 'system', content: AUDIT_SYS.replace('{SLOT}', slotLabel) },
    { role: 'user', content: `Audit "${title}" (${id}). PASS only >= ${PASS_SCORE}/13.\n\n---\n${String(body).slice(0, 24000)}` },
  ], { temperature: 0.35, max_tokens: 200 });
  const txt = String(r.content || '');
  const pass = /VERDICT\s*=\s*PASS/i.test(txt);
  const sm = txt.match(/score\s*=\s*(\d+)\s*\/\s*13/i);
  const score = sm ? parseInt(sm[1], 10) : null;
  const nm = txt.match(/notes\s*=\s*(.+)$/i);
  return { pass: pass && score != null && score >= PASS_SCORE, score, notes: nm ? nm[1].trim().slice(0, 180) : txt.slice(0, 100) };
}

function bothPass(dual, id) {
  const d = dual[id];
  if (!d || !d.a1 || !d.a2) return false;
  return d.a1.pass && d.a2.pass
    && d.a1.score != null && d.a2.score != null
    && d.a1.score >= PASS_SCORE && d.a2.score >= PASS_SCORE;
}

function auditStatus(dual, id) {
  const d = dual[id] || {};
  const fmt = s => !s ? 'pending' : `${s.pass ? 'PASS' : 'FAIL'} ${s.score != null ? s.score + '/13' : '?'}`;
  return { a1: fmt(d.a1), a2: fmt(d.a2) };
}

function logDualBlock(id, dual, extra) {
  const { a1, a2 } = auditStatus(dual, id);
  logln(`[red-dual] BLOCK ${id} — need both auditors PASS @${PASS_SCORE}/13 (a1=${a1}, a2=${a2})${extra ? ' · ' + extra : ''}`);
}

async function prepSpotPass(id, title, valid, e, chat, byPillar) {
  let spot = spotCheckEntry(id, e && e.answer, valid);
  if (spot.pass) return { spot, e };
  if (spot.gaps.includes('topImage')) {
    const cr = await fixCover(id, title).catch(() => 'err');
    if (cr === 'fixed') {
      e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
      spot = spotCheckEntry(id, e && e.answer, valid);
      if (spot.pass) logln(`[red-dual] +cover ${id} spot-check pass ${spot.score}/13`);
    }
  }
  if (!spot.pass) {
    await fixEntry(id, title, (byPillar[pillarOf(id)] || []).filter(s => s.id !== id), valid, chat).catch(() => {});
    e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
    spot = spotCheckEntry(id, e && e.answer, valid);
  }
  return { spot, e };
}

function appendFinal(id, dual) {
  if (!bothPass(dual, id)) {
    logDualBlock(id, dual, 'appendFinal refused');
    return false;
  }
  const s = new Set(readArr(FINAL));
  s.add(id);
  writeArr(FINAL, [...s].sort());
  return true;
}

function sendBackToRedBox(id, dual, reason) {
  return withLedger(async () => {
    if (engineMode()) {
      // SEO engine: stage-1 approved is append-only; failed dual-audit only clears partial state for re-pickup.
      delete dual[id];
      writeDual(dual);
      logln(`[red-dual] ↻ ${id} dual-audit retry (engine — stays approved)${reason ? ' — ' + reason : ''}`);
      return;
    }
    const nr = new Set(readArr(NR));
    nr.add(id);
    writeArr(NR, [...nr].sort());
    writeArr(AP, readArr(AP).filter(x => x !== id));
    writeArr(QUEUE, readArr(QUEUE).filter(x => x !== id));
    writeArr(FINAL, readArr(FINAL).filter(x => x !== id));
    delete dual[id];
    writeDual(dual);
    logln(`[red-dual] ↩ ${id} → red box${reason ? ' — ' + reason : ''}`);
    await syncSeo({ lastRedboxReturn: id, lastRedboxReturnAt: new Date().toISOString(), lastRedboxReturnReason: reason || 'fail' });
  });
}

async function publishCounts(extra) {
  try { await pushSeoCounts(store, Object.assign({ redboxDualAt: new Date().toISOString(), spotcheckWatch: !fs.existsSync(WD + '/_v2_spotcheck_watch_stop.flag') }, extra || {})); } catch (e) {}
}

async function syncSeo(extra) {
  try { await pushSeoCounts(store, extra); } catch (e) {}
}

async function publishDualSigned(id, title, valid, byPillar, dsChat, idx) {
  let dual = readDual();
  if (!bothPass(dual, id)) {
    logDualBlock(id, dual, 'publish aborted — dual consensus incomplete');
    return false;
  }
  if (readArr(FINAL).includes(id)) return true;
  let e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
  if (!e || !e.answer) { logln(`[red-dual] publish ${id} ✗ no blob`); return false; }
  let spot;
  ({ spot, e } = await prepSpotPass(id, title, valid, e, dsChat, byPillar));
  if (!spot.pass) {
    logln(`[red-dual] PRE-PUBLISH SPOT FAIL ${id} score=${spot.score} ${spot.gaps.join(',')} — blocked`);
    await sendBackToRedBox(id, dual, `pre-publish spot-check: ${spot.gaps.join(',')}`);
    return false;
  }
  const snap = { a1: dual[id].a1, a2: dual[id].a2, spot: { score: spot.score, words: spot.words, at: new Date().toISOString() } };
  const qStr = `${spot.score}/13`;
  let published = false;
  await withLedger(async () => {
    dual = readDual();
    if (!bothPass(dual, id)) {
      logDualBlock(id, dual, 'publish aborted — dual consensus lost');
      return;
    }
    if (!appendFinal(id, dual)) return;
    writeArr(QUEUE, readArr(QUEUE).filter(x => x !== id));
    delete dual[id];
    writeDual(dual);
    published = true;
  });
  if (!published) return false;
  try {
    const cur = await store.get('answers/' + id + '.json', { type: 'json' });
    if (cur) await store.setJSON('answers/' + id + '.json', Object.assign({}, cur, {
      final_signed: true, final_signed_at: new Date().toISOString(), final_gate: 'redbox-dual-ds',
      dual_audit: snap, quality: qStr, spotcheck_pass: true,
    }));
  } catch (x) {}
  try {
    const idxRow = (idx.entries || []).find(en => en && en.id === id);
    await pingIndexNowEntry(id, store, idxRow);
  } catch (x) {}
  logln(`[red-dual] ✅ DUAL-SIGNED+SPOT OK ${id} ${qStr} words=${spot.words} a1=${snap.a1.score}/13 a2=${snap.a2.score}/13 (final ${readArr(FINAL).length})`);
  await syncSeo({ lastDualSigned: id, lastDualSignedAt: new Date().toISOString() });
  return true;
}

if (require.main === module) (async () => {
  logln(`[red-dual] up — ${CONC} DS auditors + pre-publish spot-check @${MIN_SCORE}/13`);
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const titleOf = Object.fromEntries((idx.entries || []).filter(e => e && e.id).map(e => [e.id, e.question]));
  const valid = new Set((idx.entries || []).filter(e => e && e.id).map(e => e.id));
  const byPillar = {};
  for (const e of idx.entries || []) if (e && e.id) (byPillar[pillarOf(e.id)] = byPillar[pillarOf(e.id)] || []).push({ id: e.id, title: e.question });

  while (!fs.existsSync(STOP)) {
    await publishCounts();
    const todo = getAuditTodo();
    if (!todo.length) {
      logln(`[red-dual] idle — ${engineMode() ? 'no approved awaiting final' : 'audit queue empty'}`);
      await new Promise(r => setTimeout(r, 45000));
      continue;
    }
    logln(`[red-dual] ${todo.length} awaiting dual sign-off`);
    let qi = 0;
    async function worker(wid) {
      while (!fs.existsSync(STOP)) {
        const i = qi++;
        if (i >= todo.length) return;
        const id = todo[i];
        if (readArr(FINAL).includes(id)) continue;
        let dual = readDual();
        if (bothPass(dual, id)) {
          await publishDualSigned(id, titleOf[id] || id, valid, byPillar, dsChat, idx);
          continue;
        }
        const need = slotFor(dual, id);
        if (!need) {
          if (dual[id]?.a1?.pass || dual[id]?.a2?.pass) logDualBlock(id, dual, 'waiting for second auditor');
          continue;
        }
        const { slot, label: slotLabel } = need;
        if (dual[id]?.[slot]?.pass) continue;
        const title = titleOf[id] || id;
        try {
          let e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
          if (!e || !e.answer) { logln(`[red-dual] w${wid} ${id} ✗ no blob`); continue; }
          let spot;
          ({ spot, e } = await prepSpotPass(id, title, valid, e, dsChat, byPillar));
          if (!spot.pass) {
            logln(`[red-dual] w${wid} ${id} spot-check FAIL score=${spot.score} ${spot.gaps.join(',')}`);
            await sendBackToRedBox(id, dual, `pre-audit spot-check: ${spot.gaps.join(',')}`);
            continue;
          }
          const v = await dsRead(id, title, e.answer, slotLabel);
          dual = readDual();
          if (!dual[id]) dual[id] = {};
          const prev = dual[id][slot];
          if (prev && prev.pass && (!v.pass || (v.score != null && prev.score >= v.score))) {
            logln(`[red-dual] w${wid} ${slotLabel} ${id} ${v.pass ? 'PASS' : 'FAIL'} ${v.score != null ? v.score + '/13' : ''} (keep prior ${prev.score}/13)`);
            if (!v.pass) await sendBackToRedBox(id, dual, `${slotLabel} FAIL ${v.score != null ? v.score + '/13' : ''}: ${v.notes}`);
            continue;
          }
          dual[id][slot] = { pass: v.pass, score: v.score, notes: v.notes, at: new Date().toISOString() };
          await withLedger(async () => { writeDual(dual); });
          logln(`[red-dual] w${wid} ${slotLabel} ${id} ${v.pass ? 'PASS' : 'FAIL'} ${v.score != null ? v.score + '/13' : ''}`);
          if (!v.pass) {
            await sendBackToRedBox(id, dual, `${slotLabel} FAIL ${v.score != null ? v.score + '/13' : ''}: ${v.notes}`);
            continue;
          }
          if (!bothPass(dual, id)) {
            logDualBlock(id, dual, `${slotLabel} passed — awaiting second auditor`);
            continue;
          }
          await publishDualSigned(id, title, valid, byPillar, dsChat, idx);
        } catch (x) { logln(`[red-dual] w${wid} ${id} ERR ${x.message}`); }
        if (PACE_MS) await new Promise(r => setTimeout(r, PACE_MS));
      }
    }
    await Promise.all(Array.from({ length: CONC }, (_, i) => worker(i + 1)));
    await new Promise(r => setTimeout(r, 5000));
  }
  logln('[red-dual] stop flag — exiting');
})().catch(e => { logln('[red-dual] FATAL ' + e.message); process.exit(1); });

module.exports = { publishDualSigned, bothPass, readDual };
