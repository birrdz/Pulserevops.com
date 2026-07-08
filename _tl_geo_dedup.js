// _tl_geo_dedup.js — CRO Pulse Tools (tl) golden-template pass with GEO DEDUP (owner 2026-07-07).
// Most tl questions are geo-variants of the same title ("... fractional CRO in {LOC}?"). So: group by
// title-template (location abstracted), fix ONE canonical per template to golden-template compliance via
// DeepSeek (gate = golden audit .compliant, NOT 13/13 — owner), then CLONE the canonical body to every other
// variant with the location string + image id swapped. Preserves the flux face-card cover on every write.
// Stop: _tl_geo_dedup_stop.flag.  Env: CONC (canonical fix parallelism, default 4), MIN_GROUP (default 2).
'use strict';
const fs = require('fs');
const WD = __dirname;
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const { pickGoldTemplate } = require('./_pulse_gold_template_router');
const { rebuildAqTop10Entry } = require('./_aq_top10_gold_fix_lib');
const { rebuildAqQaEntry } = require('./_aq_qa_gold_fix_lib');
const { auditTop10GoldTemplate } = require('./_ranking_top10_gold_template');
const { auditQaGoldTemplate } = require('./_qa_gold_template');
const { dsChat } = require('./_ds_lib');
const { ccGoldenFix } = require('./_cc_golden_fix');
const { auditBatch } = require('./_geo_auditor'); // read-only drift watchdogs (owner spec 2026-07-07)
const { reshapeQaToGold } = require('./_gold_reshape'); // deterministic structure re-slot (no AI)
const { repairBrokenQaImages } = require('./_ddg_facecard_lib'); // self-host broken/live-pollinations imgs, alternate DDG/pollinator

// Verify every body image renders (HTTP 200 image) — desktop + mobile serve the same URLs, so one check covers both.
// Drops any image line that doesn't render so a broken image never publishes. (owner 2026-07-07)
async function imgOk(url) {
  try { const u = /^https?:/i.test(url) ? url : ('https://pulserevops.com' + (url.startsWith('/') ? url : '/' + url)); const r = await fetch(u, { signal: AbortSignal.timeout(15000) }); return r.ok && (r.headers.get('content-type') || '').startsWith('image'); } catch (e) { return false; }
}
async function verifyImagesRender(body) {
  const lines = String(body).split('\n'); const out = []; let dropped = 0;
  for (const line of lines) { const m = line.match(/^\s*!\[[^\]]*\]\(([^)\s]+)\)\s*$/); if (m) { if (!(await imgOk(m[1]))) { dropped++; continue; } } out.push(line); }
  return { body: out.join('\n').replace(/\n{3,}/g, '\n\n').trim(), dropped };
}

const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const RECIP = 'koryjordanwhite@gmail.com';
const RESEND_KEY = process.env.RESEND_API_KEY || process.env.resendapikey || process.env.RESENDAPIKEY;
const STOP = WD + '/_tl_geo_dedup_stop.flag';
const CONC = parseInt(process.env.CONC || '1', 10); // serial by default — rebuild does DDG image-ensure; parallel = throttle (owner 2026-07-07)
const MIN_GROUP = parseInt(process.env.MIN_GROUP || '2', 10);
const PAUSE_AFTER = parseInt(process.env.PAUSE_AFTER || '0', 10); // >0: stop after N canonicals (review checkpoint, owner 2026-07-07)
const APPROVED_F = WD + '/_v2_approved.json'; // hand DeepSeek canonicals to the Claude Code auditors (_v2_auditor.js)
function approveForCcAudit(id) { try { let a = []; try { a = JSON.parse(fs.readFileSync(APPROVED_F, 'utf8')) || []; } catch (e) {} if (!a.includes(id)) { a.push(id); fs.writeFileSync(APPROVED_F, JSON.stringify(a)); } } catch (e) {} }
const store = getStore({ name: 'pulse-machine-library', siteID: SITE, token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const nowIso = () => new Date().toISOString();
const log = (...a) => console.log(nowIso().slice(11, 19), ...a);
const sleep = ms => new Promise(r => setTimeout(r, ms));
function esc(s) { return String(s == null ? '' : s).replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c])); }
function re2(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

async function email(subject, html) { try { if (!RESEND_KEY) return; await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: 'PULSE Engine <onboarding@resend.dev>', to: [RECIP], subject, html }) }); } catch (e) { log('email err', e.message); } }
function emailFix(id, title, tpl, cloned) {
  const url = 'https://pulserevops.com/knowledge/' + id;
  const cover = 'https://pulserevops.com/assets/qa/' + id + '.jpg';
  return email((cloned ? '📋' : '✅') + ' CRO Pulse Tools ' + (cloned ? 'cloned' : 'fixed') + ' · ' + id + ' [' + tpl + ']',
    '<div style="font-family:system-ui,Arial,sans-serif;font-size:14px;color:#15110d"><p style="font-weight:700;margin:0 0 6px">' + esc(title) + '</p>' +
    '<p style="margin:0 0 8px"><a href="' + url + '" style="color:#0b57d0;font-weight:700">' + url + '</a></p>' +
    '<img src="' + cover + '" width="360" style="border-radius:8px;display:block;margin:0 0 8px" alt="">' +
    '<p style="margin:0;color:#3a3229">' + (cloned ? 'Cloned from golden canonical + location swapped · images shared' : 'Golden template + images repaired & verified rendering') + ' · <b>' + tpl + '</b></p></div>');
}

// ── location extraction + template key ──
function locOf(t) { t = String(t).replace(/\?/g, '').trim(); const m = t.match(/\bin\s+([A-Z][A-Za-z.]+(?:[\s-][A-Z][A-Za-z.]+){0,2})(?:\s+in\s+20\d\d)?\s*$/); return m ? m[1].trim() : null; }
function templKey(t) { const L = locOf(t); return L ? String(t).replace(new RegExp('\\b' + re2(L) + '\\b'), '{LOC}') : String(t); }

// swap canonical location → variant location, and canonical id → variant id (for /assets/qa/<id>.jpg + any refs)
function cloneBody(body, canonId, canonLoc, varId, varLoc) {
  // swap ONLY the location text; KEEP the canonical's self-hosted (verified-rendering) images — shared across
  // geo-variants (same topic). Do NOT rewrite image ids/urls (that would point clones at files that don't exist).
  return (canonLoc && varLoc && canonLoc !== varLoc) ? body.replace(new RegExp('\\b' + re2(canonLoc) + '\\b', 'g'), varLoc) : body;
}

// ── index write: merge-safe (re-read fresh, apply our fields, write) so the face-card generator isn't clobbered.
// PRESERVES / RESTORES the flux face-card cover when assets/qa/<id>.jpg exists. ──
let pendIdx = {};
let flushChain = Promise.resolve(); // serialize flushes even under concurrency
function coverFields(id) { return fs.existsSync(WD + '/assets/qa/' + id + '.jpg') ? { cover_src: 'flux', img: '/assets/qa/' + id + '.jpg', face_title_baked: true } : {}; }
async function saveEntry(id, title, newBody, existing) {
  const now = Date.now();
  const cover = coverFields(id);
  const entry = Object.assign({}, existing, { id, question: title, answer: newBody, pending: false, polished_at: now }, cover);
  await store.setJSON('answers/' + id + '.json', entry); // per-entry blob — safe
  pendIdx[id] = Object.assign({ question: title, polished_at: now }, cover);
}
function flushIdx() {
  flushChain = flushChain.then(async () => {
    const ids = Object.keys(pendIdx); if (!ids.length) return;
    const mine = pendIdx; pendIdx = {};
    try {
      const fresh = await store.get('_index.json', { type: 'json', consistency: 'strong' });
      for (const id of ids) { const e = (fresh.entries || []).find(x => x && x.id === id); if (e) Object.assign(e, mine[id]); }
      await store.setJSON('_index.json', fresh);
    } catch (z) { log('idx flush err', z.message); Object.assign(pendIdx, mine); }
  });
  return flushChain;
}

// fix a canonical to golden compliance. gate = golden audit .compliant (NOT 13/13). returns {body, template, compliant}
async function fixCanonical(id, title, validIds) {
  const existing = await store.get('answers/' + id + '.json', { type: 'json' });
  let body = (existing && (existing.answer || existing.body)) || '';
  const template = pickGoldTemplate(id, body, title).template === 'qa' ? 'qa' : 'top10';
  const audit = b => template === 'qa' ? auditQaGoldTemplate(b, title, id).compliant : auditTop10GoldTemplate(b, title).compliant;
  // 1. DETERMINISTIC structure re-slot (instant, no AI) — the cookie-cutter
  if (template === 'qa') body = reshapeQaToGold(body);
  // 2. repair broken / live-pollinations images → self-hosted, alternating DDG/pollinator (serial — image-safe)
  try { const r = await repairBrokenQaImages(id, title, body, {}); if (r && r.body) body = r.body; } catch (e) { log('  ⚠ img repair ' + id + ' ' + String(e.message).slice(0, 60)); }
  // 3. VERIFY every image renders; drop any that don't — a broken image never publishes
  const v = await verifyImagesRender(body); body = v.body; if (v.dropped) log('  🖼 dropped ' + v.dropped + ' non-rendering img · ' + id);
  // 4. structure still off (rare after reshape)? Claude Code fixer, then re-verify images
  let compliant = audit(body);
  if (!compliant) { try { const cc = await ccGoldenFix(id, title, body, template, { log }); if (cc && cc.body) { const v2 = await verifyImagesRender(cc.body); body = v2.body; compliant = audit(body); } } catch (e) { log('  ⚠ CC ' + id + ' ' + String(e.message).slice(0, 60)); } }
  return { body, template, compliant, existing };
}

// is an entry already golden-compliant? (e.g. fixed earlier). returns {body,template} or null
async function alreadyGolden(id, title) {
  try {
    const a = await store.get('answers/' + id + '.json', { type: 'json' }); if (!a) return null;
    const bd = a.answer || a.body || '';
    const tpl = pickGoldTemplate(id, bd, title).template === 'qa' ? 'qa' : 'top10';
    const comp = tpl === 'qa' ? auditQaGoldTemplate(bd, title, id).compliant : auditTop10GoldTemplate(bd, title).compliant;
    return comp ? { body: bd, template: tpl, existing: a } : null;
  } catch (e) { return null; }
}

async function pool(items, k, fn) { let i = 0; const workers = Array.from({ length: Math.min(k, items.length) }, async () => { while (i < items.length) { const j = i++; if (fs.existsSync(STOP)) return; await fn(items[j], j); } }); await Promise.all(workers); }

(async () => {
  // Never run DDG image-ensure while flux face cards are still generating (parallel image gen → throttle, owner 2026-07-07).
  if (process.env.SKIP_WAIT !== '1') {
    for (;;) {
      if (fs.existsSync(STOP)) return;
      const fresh = await store.get('_index.json', { type: 'json', consistency: 'strong' });
      const rem = (fresh.entries || []).filter(e => e && /^tl\d+$/.test(e.id) && e.cover_src !== 'flux').length;
      if (rem <= 25) { log('face cards essentially done (' + rem + ' left) — starting geo-dedup'); break; }
      log('waiting for face cards — ' + rem + ' tl covers left'); await sleep(60000);
    }
  }
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const validIds = new Set((idx.entries || []).filter(e => e && e.id).map(e => e.id));
  const tl = (idx.entries || []).filter(e => e && /^tl\d+$/.test(e.id) && e.question);
  const groups = {};
  for (const e of tl) { const k = templKey(e.question); (groups[k] = groups[k] || []).push({ id: e.id, title: e.question }); }
  let list = Object.entries(groups).map(([k, members]) => ({ k, members })).filter(g => g.members.length >= MIN_GROUP);
  list.forEach(g => g.members.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true })));
  list.sort((a, b) => b.members.length - a.members.length); // biggest first
  const covered = list.reduce((s, g) => s + g.members.length, 0);
  const otherLocs = [...new Set(tl.map(e => locOf(e.question)).filter(Boolean))]; // every location seen — for stray-token audit
  log('geo-dedup: ' + tl.length + ' tl · ' + list.length + ' multi-templates covering ' + covered + ' entries · CONC=' + CONC);
  await email('▶ CRO Pulse Tools — geo-dedup golden pass started', '<p><b>' + list.length + '</b> title-templates cover <b>' + covered + '</b> geo-variant entries. Fixing one canonical per template (golden-template compliant), cloning the rest with location swapped. Face cards preserved. Emailing each.</p>');

  let canonFixed = 0, canonReused = 0, cloned = 0, groupsDone = 0;

  // INTERLEAVED (CONC=1, image-safe) — per template group: fix the canonical (reshape → repair+verify images →
  // publish), email the finished fix, then clone every geo-variant (shared verified images, location swapped),
  // publish + email each. Continuous output — you see finished Q&As flow, not a long silent phase.
  await pool(list, CONC, async (g) => {
    try {
      if (fs.existsSync(STOP)) return;
      // pick the canonical member with the most images (best raw material)
      let pickId = g.members[0].id, pickTitle = g.members[0].title, best = -1;
      for (const m of g.members.slice(0, 10)) { try { const a = await store.get('answers/' + m.id + '.json', { type: 'json' }); const b = (a && (a.answer || a.body)) || ''; const n = (b.match(/!\[[^\]]*\]\([^)]+\)/g) || []).length; if (n > best) { best = n; pickId = m.id; pickTitle = m.title; } if (n >= 3) break; } catch (e) {} }
      const c = await fixCanonical(pickId, pickTitle, validIds);
      if (!c.body || !c.compliant) { log('  ✗ canon not compliant ' + pickId + ' — skip [' + g.k.slice(0, 40) + ']'); return; }
      await saveEntry(pickId, pickTitle, c.body, c.existing); await flushIdx();
      canonFixed++;
      await emailFix(pickId, pickTitle, c.template === 'qa' ? 'Q&A (q11133)' : 'Top-10 (aq1158)', false);
      log('  ✓ canon ' + pickId + ' [' + c.template + '] → cloning ' + (g.members.length - 1));
      const canonLoc = locOf(pickTitle);
      for (const m of g.members) { // clone + publish + email every variant now
        if (m.id === pickId) continue;
        if (fs.existsSync(STOP)) break;
        try {
          const ex = (await store.get('answers/' + m.id + '.json', { type: 'json' })) || c.existing;
          const nb = cloneBody(c.body, pickId, canonLoc, m.id, locOf(m.title));
          await saveEntry(m.id, m.title, nb, ex);
          cloned++;
          await emailFix(m.id, m.title, c.template === 'qa' ? 'Q&A (q11133)' : 'Top-10 (aq1158)', true);
          if (Object.keys(pendIdx).length >= 25) await flushIdx();
        } catch (e) { log('  ✗ clone ' + m.id + ' ' + String(e.message).slice(0, 60)); }
      }
      await flushIdx();
      groupsDone++;
      log('  ✔ group [' + g.k.slice(0, 34) + '] done · ' + groupsDone + '/' + list.length + ' · total published ' + (canonFixed + cloned));
      if (PAUSE_AFTER > 0 && groupsDone >= PAUSE_AFTER) fs.writeFileSync(STOP, 'pause-after-' + PAUSE_AFTER);
    } catch (e) { log('  ✗ group err [' + g.k.slice(0, 40) + '] ' + String(e.message).slice(0, 80)); }
  });
  await flushIdx();
  log('DONE · canon fixed=' + canonFixed + ' cloned=' + cloned + ' groups=' + groupsDone);
  await email('✅ CRO Pulse Tools — geo-dedup done', '<p>Canonicals fixed: <b>' + canonFixed + '</b> · <b>' + cloned + '</b> geo-variants cloned (location swapped, images shared + verified rendering) · <b>' + groupsDone + '</b> templates. Every one published + emailed.</p>');
})().catch(e => { log('FATAL', e && e.message, e && e.stack); process.exit(1); });
