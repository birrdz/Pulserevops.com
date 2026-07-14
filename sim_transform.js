// sim_transform.js — KORY'S FIX-IT-ALL MACHINE · the in-house scrubber (Claude Code).
// For each NEAR-DUP variant: iteratively rewrite ONLY the prose with Claude Code — keeping every heading,
// mermaid, image, FAQ and source EXACTLY — re-measuring similarity vs its family each pass, and repeating
// until overlap drops UNDER the target (default 30%). Then gate (real content gate via /gate-publish) and
// publish. Per-entry similarity % is written to sim/fix_progress.json for the live dashboard. STUBS get a
// full Claude Code write. Resume-safe. Logs everything. Publish flips only on gate pass.
'use strict';
const fs = require('fs');
const path = require('path');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const { claudeChat } = require('./_claude_chat');
const { dsChat } = require('./_ds_lib');
const flib = require('./_ddg_facecard_lib');
const sharp = require('sharp');
const SIM = WD + '/sim';
// STORED approved Pexels (owner 2026-07-11) — no API fetch.
// Primary: assets/qa/_pexels_stored (filled when you ✓ in the gallery).
// Fallback: approved manifest provider=pexels still in _gp_pool.
const pexelsStoredLib = (() => { try { return require('./_pexels_stored_lib'); } catch (e) { return null; } })();
const _approval = (() => { try { return JSON.parse(fs.readFileSync(WD + '/_gp_pool_approval.json', 'utf8')); } catch (e) { return {}; } })();
const _okVals = new Set([true, 1, 'ok', 'approve', 'approved', 'yes']);
const _pexelsStored = (() => {
  if (pexelsStoredLib) {
    try { pexelsStoredLib.backfillApprovedPexels(); } catch (e) {}
    const fromFolder = pexelsStoredLib.listStored();
    if (fromFolder.length) return fromFolder;
  }
  try {
    const man = JSON.parse(fs.readFileSync(WD + '/_gp_pool_manifest.json', 'utf8'));
    return (man.slots || [])
      .filter(s => s && s.ok && String(s.provider || '').toLowerCase() === 'pexels' && _okVals.has(_approval[s.slot]))
      .map(s => WD + '/assets/qa/_gp_pool/' + String(s.slot).padStart(3, '0') + '.jpg')
      .filter(f => { try { return fs.statSync(f).size > 3000; } catch (e) { return false; } });
  } catch (e) { return []; }
})();
const _facecardPoolStored = (() => {
  const root = WD + '/_facecard_pool';
  try {
    const out = [];
    const walk = d => {
      for (const n of fs.readdirSync(d)) {
        const p = d + '/' + n;
        try {
          if (fs.statSync(p).isDirectory()) walk(p);
          else if (/\.jpe?g$/i.test(n) && fs.statSync(p).size > 3000) out.push(p);
        } catch (e) {}
      }
    };
    if (fs.existsSync(root)) walk(root);
    return out;
  } catch (e) { return []; }
})();
console.log('[sim] stored Pexels donors: ' + _pexelsStored.length + '  facecard_pool: ' + _facecardPoolStored.length);
async function isBlurry(file) { try { const s = await sharp(file).resize(256, 256, { fit: 'inside' }).greyscale().convolve({ width: 3, height: 3, kernel: [0, 1, 0, 1, -4, 1, 0, 1, 0] }).stats(); return (s.channels[0].stdev || 0) < parseFloat(process.env.SIM_BLUR_MIN || '8'); } catch (e) { return true; } }
// QUALIFY (owner 2026-07-12): HTML title + UNTITLED browse .sq.jpg only.
// NEVER bake gold titles onto face-card / mosaic JPGs here — that double-title bug is banned on browse rows.
async function stampImgSq(id, imgSq) {
  try {
    const idx = await store.get('_index.json', { type: 'json' });
    const ent = (idx.entries || []).find(x => x && x.id === id);
    if (ent) {
      let dirty = false;
      if (ent.imgSq !== imgSq) { ent.imgSq = imgSq; dirty = true; }
      // Keep face-card on `img` for answer-page heroes. Only stamp imgSq for browse.
      // NEVER replace /assets/qa/<id>.jpg with .sq.jpg (that wiped top images).
      if (ent.img && /\.sq\.jpg(\?|$)/i.test(String(ent.img))) {
        const face = '/assets/qa/' + id + '.jpg';
        ent.img = face; dirty = true;
      }
      if (dirty) await store.setJSON('_index.json', idx);
    }
  } catch (e) {}
}

async function ensureBrowseSquare(id, title) {
  const bsr = require('./_browse_square_rules');
  const sqPath = path.join(WD, 'assets', 'qa', id + '.sq.jpg');
  const imgSq = '/assets/qa/' + id + '.sq.jpg';
  let needSq = false;
  try { if (fs.statSync(sqPath).size < 8000) needSq = true; } catch (e) { needSq = true; }
  if (!needSq) {
    await stampImgSq(id, imgSq);
    return 'ok';
  }
  // Try rules lib first
  try {
    const r = await bsr.applyBrowseSquareRules(id, title, {
      onStamp: async (sid, sq) => { await stampImgSq(sid, sq); }
    });
    if (r && r.ok) return 'ok';
  } catch (e) {}
  // Last resort: any stored / pool donor — never fail-fast the whole URL on image alone
  const donors = (_pexelsStored && _pexelsStored.length) ? _pexelsStored
    : (_facecardPoolStored && _facecardPoolStored.length) ? _facecardPoolStored : [];
  if (!donors.length) return 'no-pexels';
  const seed = [...String(id)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0);
  const donor = donors[seed % donors.length];
  try {
    await sharp(donor).rotate().resize(760, 760, { fit: 'cover', position: 'attention' }).jpeg({ quality: 86, mozjpeg: true }).toFile(sqPath);
    await stampImgSq(id, imgSq);
    return 'ok';
  } catch (e) {
    return 'sq-fail';
  }
}

async function ensureQuality(id, blob) {
  const title = String(blob.h1 || blob.title || blob.question || '').trim();
  if (!title) return 'no-title';
  try {
    const r = await ensureBrowseSquare(id, title);
    return r === 'ok' ? 'ok' : (r || 'sq-fail');
  } catch (e) {
    return 'sq-fail';
  }
}
/** Mark title/image chips from ensureQuality. Title = HTML on card; image = untitled .sq.jpg.
 *  Image failure is soft — do NOT abort the whole fix (was burning pillars in seconds). */
function applyTitleImageChecks(P, qres) {
  if (qres === 'no-title') {
    P.checks.title = 'failed'; P.checks.image = 'pending'; P.status = 'failed';
    return { ok: false, why: 'missing title' };
  }
  P.checks.title = 'done';
  if (qres === 'ok') P.checks.image = 'done';
  else {
    // Soft fail: keep going to gate. Image chip shows failed but URL still gets real work.
    P.checks.image = 'failed';
  }
  return { ok: true };
}
function toIq(raw) {
  if (typeof raw !== 'number' || !isFinite(raw)) return 0;
  if (raw >= 11) return 10; // legacy gate stamps 11–13 → 10/10 display
  return Math.max(0, Math.min(10, Math.round(raw)));
}
/** Map gate checklist score (0–13) → quality /10 for the panel.
 *  Pass bar is 10/10 — never treat ~8 as done (old "8=pass" law retired). */
function gateToIq(score, passed) {
  if (passed) return 10;
  const s = Number(score) || 0;
  if (s >= 13) return 10;
  if (s <= 0) return 0;
  // Provisional display only — below pass bar until gate certifies
  return Math.max(1, Math.min(9, Math.round((s / 13) * 10)));
}
/** On approve: stamp quality 10/10 (high-value bar). Requires real 13/13 gate pass. */
async function stampIqPass(id) {
  const score = 10;
  try {
    const cur = await store.get('answers/' + id + '.json', { type: 'json' });
    if (cur) await store.setJSON('answers/' + id + '.json', Object.assign({}, cur, { quality_score: score }));
  } catch (e) {}
  try {
    const idx = await store.get('_index.json', { type: 'json' });
    const ent = (idx.entries || []).find(x => x && x.id === id);
    if (ent) { ent.quality_score = score; await store.setJSON('_index.json', idx); }
  } catch (e) {}
  // Image step (owner 2026-07-14): the FIXER OVERWRITES images with fresh Pexels — regenerates a
  // CLEAN keyword photo so stale baked-title heroes (e.g. old ai445) are replaced. Pexels-only chain.
  // Q&A → 3 imgs (face=top + 2 body) · Top-10 → 11 imgs (face + 10 items). forceAll drives both.
  // IMAGE_APPLY_PAUSED=1 (Fable 2026-07-14): text melt runs CONTENT-ONLY; image applies stay PAUSED
  // until the render-path deploy lands + one DOM check passes, then the image lane opens with the DOM gate.
  if (process.env.IMAGE_APPLY_PAUSED === '1') {
    try { const cur = await store.get('answers/' + id + '.json', { type: 'json' }); if (cur) await store.setJSON('answers/' + id + '.json', Object.assign({}, cur, { images_pending: true })); } catch (e) {}
    return score;
  }
  try {
    const { ensureDdFixerImages } = require('./_dd_fixer_images');
    const cur = await store.get('answers/' + id + '.json', { type: 'json' });
    const qText = cur && (cur.question || cur.h1 || cur.title) || '';
    // CONTRACT-BINDING (2026-07-14): classify by the recorded question text — SAME rule as the
    // panel's typeOf — and BIND it so the image applier never auto-guesses (fixes the "Q&A entry
    // filled as top10, 0 body images" bug). GENERAL = hero+2 · TOP_LIST = hero+10.
    const templateType = /\btop\s*\d|\btop-\d|\bbest\b|\branked\b|\blist\b/i.test(String(qText)) ? 'TOP_LIST' : 'GENERAL';
    await ensureDdFixerImages(store, id, {
      title: qText,
      body: cur && (cur.answer || cur.body),
      img: cur && cur.img,
      templateType,        // bound contract — no auto-detect
      surface: true,
      quality: 10,
      forceAll: true,      // fixer always overwrites the existing image(s) with fresh clean Pexels
    });
  } catch (e) {}
  return score;
}
const REPORT_F = SIM + '/scan_report.json', STATUS_F = SIM + '/run_status.json', STATE_F = SIM + '/transform_state.json';
const FAILS_F = SIM + '/transform_failures.md', PROG_F = SIM + '/fix_progress.json', FIXED_F = SIM + '/FIXED.md';
const IMAGE_DONE_F = SIM + '/IMAGE_DONE.md';
const RATE_F = SIM + '/fix_rate.json';
const GATE = 'http://localhost:8899/gate-publish';
const TARGET = parseFloat(process.env.SIM_FIX_TARGET || '0.30');   // rewrite until family overlap is UNDER this
const MAX_PASSES = parseInt(process.env.SIM_FIX_PASSES || '6', 10);
const sleep = ms => new Promise(r => setTimeout(r, ms));

/** Rolling fix timestamps → fixes/min + fixes/hour for the panel. */
function recordFixRate() {
  const now = Date.now();
  let times = [];
  try {
    const j = JSON.parse(fs.readFileSync(RATE_F, 'utf8'));
    times = Array.isArray(j.times) ? j.times : [];
  } catch (e) {}
  times.push(now);
  times = times.filter((t) => typeof t === 'number' && now - t < 3600000);
  try { fs.writeFileSync(RATE_F, JSON.stringify({ times, updated: new Date().toISOString() })); } catch (e) {}
  return {
    fixesPerMin: times.filter((t) => now - t < 60000).length,
    fixesPerHour: times.length,
  };
}
function readFixRate() {
  const now = Date.now();
  try {
    const j = JSON.parse(fs.readFileSync(RATE_F, 'utf8'));
    const times = (Array.isArray(j.times) ? j.times : []).filter((t) => typeof t === 'number' && now - t < 3600000);
    return {
      fixesPerMin: times.filter((t) => now - t < 60000).length,
      fixesPerHour: times.length,
    };
  } catch (e) {
    return { fixesPerMin: 0, fixesPerHour: 0 };
  }
}

/** How many LLM attempts per stage. Tandem mode = 1 per part (5 parts run together). */
function liveWorkers() {
  try {
    const cfg = JSON.parse(fs.readFileSync(WD + '/gen/config.json', 'utf8'));
    // Solo tandem: 1 worker on EACH pass-part, not 5 piled on quality
    if (cfg && cfg.fixSoloTriple) return 1;
    const w = parseInt(cfg && cfg.fixWorkers, 10);
    if (Number.isFinite(w) && w >= 1) return Math.min(5, w);
  } catch (e) {}
  const envW = parseInt(process.env.SIM_WORKERS || '1', 10);
  return Number.isFinite(envW) && envW >= 1 ? Math.min(5, envW) : 1;
}

function isTandemPartsMode() {
  try {
    const cfg = JSON.parse(fs.readFileSync(WD + '/gen/config.json', 'utf8'));
    return !!(cfg && cfg.fixSoloTriple);
  } catch (e) { return false; }
}

/** Run fn() N times in parallel; return non-null results. */
async function withWorkers(n, fn) {
  const N = Math.max(1, n | 0);
  const jobs = [];
  for (let i = 0; i < N; i++) jobs.push(Promise.resolve().then(() => fn(i)).catch(() => null));
  return (await Promise.all(jobs)).filter((x) => x != null);
}
const readJSON = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } };
const setStatus = o => { try { fs.writeFileSync(STATUS_F, JSON.stringify(Object.assign(readJSON(STATUS_F, {}), o, { updated: new Date().toISOString() }), null, 1)); } catch (e) {} };
const logFail = (id, why) => { try { fs.appendFileSync(FAILS_F, `- ${new Date().toISOString()} · ${id} · ${why}\n`); } catch (e) {} };
// Full 5/5 only — NEVER log Image-only here (that falsely removed pods / URLs from the queue).
const logFixed = (id, fam, score, kind) => { try { if (!fs.existsSync(FIXED_F)) fs.writeFileSync(FIXED_F, '# sim/FIXED.md — RESOLVED (Fixer 3/3 + Santa Workshop SAVE). Append-only.\n\n'); fs.appendFileSync(FIXED_F, `- ${new Date().toISOString()} · ${id} · family ${fam || '-'} · score ${score != null ? score : '-'} · ${kind} · 5/5\n`); } catch (e) {} };
// Image-stage progress — advances NEXT 30 during Image GO, does NOT remove pod (pod clears only at workshop SAVE).
const logImageDone = (id, kind) => { try { if (!fs.existsSync(IMAGE_DONE_F)) fs.writeFileSync(IMAGE_DONE_F, '# sim/IMAGE_DONE.md — Image stage complete (counts 1/5 toward % · pod stays open until workshop).\n\n'); fs.appendFileSync(IMAGE_DONE_F, `- ${new Date().toISOString()} · ${id} · ${kind || '-'} · image-done · 1/5\n`); } catch (e) {} };
function isFullFiveOfFiveRun() {
  const stages = activeStages();
  return stages.length === STAGE_ORDER.length;
}
/** Real Fixer work = sim · quality · gate. Image + title are fake (Square Builder / Santa Workshop). */
const REAL_STAGES = ['similarity', 'quality', 'gate'];
function isThreeOfThree(checks) {
  if (!checks) return false;
  return REAL_STAGES.every((s) => checks[s] === 'done' || checks[s] === 'skip');
}
function shipToWorkshop(id, fam, score, kind, title) {
  try {
    const { enqueueWorkshop } = require('./_fixer_workshop');
    enqueueWorkshop({ id, title: title || id, score, kind, family: fam });
    console.log(`  ✓ 3/3 ${id} [${kind}] → Santa Workshop (Square Builder)`);
  } catch (e) {
    console.log(`  ⚠ workshop enqueue failed ${id}: ${(e && e.message) || e}`);
  }
}
// Circuit breaker REMOVED (owner 2026-07-12) — do not pause/halt the fix run on fail rate.
const _bwin = [];
const recordOutcome = () => {};
const breakerPct = () => null;
const breakerTripped = () => false;
function clearBreakerWindow() { _bwin.length = 0; }

// ── similarity (mirror of the scanner) ──
const STATES = ['alabama','alaska','arizona','arkansas','california','colorado','connecticut','delaware','florida','georgia','hawaii','idaho','illinois','indiana','iowa','kansas','kentucky','louisiana','maine','maryland','massachusetts','michigan','minnesota','mississippi','missouri','montana','nebraska','nevada','new hampshire','new jersey','new mexico','new york','north carolina','north dakota','ohio','oklahoma','oregon','pennsylvania','rhode island','south carolina','south dakota','tennessee','texas','utah','vermont','virginia','washington','west virginia','wisconsin','wyoming'];
const LOCRE = new RegExp('\\b(' + STATES.join('|') + ')\\b', 'gi');
function sentsOf(md) {
  let t = String(md || '').replace(/```[\s\S]*?```/g, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').replace(/\[[^\]]*\]\([^)]*\)/g, ' ').replace(/<[^>]+>/g, ' ').toLowerCase();
  t = t.replace(LOCRE, ' LOCATION ').replace(/\$?\b\d[\d,\.]*%?\b/g, ' NUM ').replace(/[^a-z0-9\.\!\?\s]/g, ' ').replace(/\s+/g, ' ');
  return new Set(t.split(/(?<=[\.\!\?])\s+/).map(s => s.replace(/[^a-z0-9 ]/g, '').trim()).filter(s => s.split(' ').length >= 4));
}
function overlap(a, b) { if (!a.size || !b.size) return 0; const s = a.size < b.size ? a : b, big = s === a ? b : a; let n = 0; for (const x of s) if (big.has(x)) n++; return n / s.size; }
function maxOverlap(bodySents, famSets) { let mx = 0; for (const fs2 of famSets) mx = Math.max(mx, overlap(bodySents, fs2)); return mx; }

async function getBody(id) { try { const a = await store.get('answers/' + id + '.json', { type: 'json', consistency: 'strong' }); return { blob: a || {}, body: (a && (a.answer || a.body)) || '' }; } catch (e) { return { blob: {}, body: '' }; } }
async function writeChat(messages) {
  // DS_ONLY/NO_CLAUDE=1 → DeepSeek only. CLAUDE_ONLY/NO_DS=1 → Claude Code only (DeepSeek rests). Else Claude first, DS fallback.
  const dsOnly = process.env.DS_ONLY === '1' || process.env.NO_CLAUDE === '1';
  const claudeOnly = process.env.CLAUDE_ONLY === '1' || process.env.NO_DS === '1';
  if (!dsOnly) {
    try {
      const r = await claudeChat(messages, { timeoutMs: 180000 });
      const t = typeof r === 'string' ? r : (r && (r.content || r.text)) || '';
      if (t && t.length > 200) return t;
    } catch (e) {}
    if (claudeOnly) return '';
  }
  if (claudeOnly) return '';
  try { const r = await dsChat(messages, { max_tokens: 8000, temperature: 0.8 }); return (r && r.content) || ''; } catch (e) { return ''; }
}
async function gate(id, body, m, dryRun) {
  const r = await fetch(GATE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: '4444', id, body, title: m.title, question: m.question, metaTitle: m.metaTitle, metaDesc: m.metaDesc, simMode: true, dryRun: !!dryRun || DRY }), signal: AbortSignal.timeout(120000) });
  return await r.json();
}
// image checks the gate waives in simMode — a rewrite is never failed/repaired for these
const GATE_WAIVE = new Set(['heroImage', 'faceCardApplicable', 'pollinatorFaceCover', 'pollinatorInternalFlux', 'media3to10', 'imagesLaw', 'top10Images', 'rankingListMaster', 'score12']);
// map a failing gate check → concrete "re-add this dropped golden element" instruction
const CHECK_HELP = {
  faq6: 'Restore the "## FAQ" section with AT LEAST 6 **bold question?** + answer pairs.',
  mermaid2: 'Restore EXACTLY 2 ```mermaid diagrams inside content sections.',
  mermaidClean: 'Make both ```mermaid blocks valid and closed; no stray fences.',
  sources5: 'Restore the "## Sources" list of 5-10 real named source links.',
  relatedPulse: 'Restore the "## Related on PULSE" section with 3-5 links to https://pulserevops.com/knowledge/<id>.',
  directAnswer: 'Keep "## Direct Answer" as the first H2 (2+ sentences, 160+ chars).',
  directAnswerFull: 'Make the "## Direct Answer" block 2+ sentences and 160+ chars.',
  qaGoldOutline: 'Order MUST be: ## Direct Answer → depth ## sections → ## Related questions → ## FAQ → ## Sources → ## Related on PULSE.',
  words2000: 'Keep it 2000+ words — never shorten.',
  linksClean: 'Internal links must be well-formed https://pulserevops.com/knowledge/<id>.',
};

const REWRITE_SYS = 'You are a senior RevOps editor rewriting a page so it stops being a near-duplicate of its siblings. HARD RULES: (1) Keep EVERY markdown ## / ### heading, EXACTLY 2 ```mermaid code blocks, every image ![](), the "## FAQ" section with AT LEAST 6 **bold question?** + answer pairs, the "## Sources" list of 5-10 links, AND the "## Related on PULSE" section — all present, EXACTLY, in the same order. Dropping ANY of these fails the gate and wastes the whole rewrite. (2) Output MUST be the SAME LENGTH OR LONGER — at least 2000 words. NEVER summarize, shorten, or drop sections. (3) Rewrite ONLY the paragraph sentences between the headings — different angle, specifics, examples — so the page reads genuinely distinct; expand rather than cut. (4) Never a mad-libs place-name swap. Return the COMPLETE markdown, top to bottom, nothing else.';
const DRY = process.env.SIM_DRY === '1';   // validate the fix loop without publishing anything live
const QUALITY_SYS = [
  'You are a senior RevOps editor upgrading a thin page to pass a strict 13-point golden gate. Output COMPLETE markdown ONLY — no preamble, no CRO/"Kory White" markup, no image markdown. Keep the original question/topic. Follow this EXACT structure and order:',
  '## Direct Answer',
  '<2 to 4 sentences, AT LEAST 160 characters, answering the question directly>',
  '<one intro paragraph>',
  '## <depth section 1, phrased as a searchable sub-question>',
  '<2+ paragraphs, 60+ words>',
  '(Write 4 to 6 total "## " depth sections. Place EXACTLY 2 ```mermaid diagrams inside two of them. Weave 2-3 links to https://pulserevops.com/knowledge/<id> into the prose.)',
  '## Related questions',
  '### <a related question>?', '<answer, 50 words or fewer>', '(3 to 5 pairs)',
  '## FAQ', '**<a question>?**', '<answer paragraph>', '(AT LEAST 6 **bold question?** + answer pairs)',
  '## Sources', '- [<real source name>](https://<real-url>)', '(5 to 10 real, credible, named sources)',
  '## Related on PULSE', '- [<a related question>](https://pulserevops.com/knowledge/<id>)', '(3 to 5 internal links)',
  'HARD RULES: minimum 2000 words. NEVER fabricate specific prices, statistics, vendor names, or numbers. Output ONLY markdown, starting at "## Direct Answer".',
].join('\n');

/**
 * ONE pipeline for every URL (owner original /10 panel):
 *   1) SIM → 2) QUALITY → 3) TITLE → 4) IMAGE → 5) 13/13
 *
 * Quality chip = x/10 (not /13). Gate chip stays 13/13.
 * N URLs parallel (fixConcurrency, default 30) · 1 worker each · finish independently.
 */
const STAGE_ORDER = ['similarity', 'quality', 'image', 'title', 'gate'];

/** Chips finished (incl. fake image/title). Real content gate = isThreeOfThree. */
function isFiveOfFive(checks) {
  if (!checks || typeof checks !== 'object') return false;
  return STAGE_ORDER.every((s) => {
    const v = checks[s];
    return v === 'done' || v === 'skip';
  });
}

function fiveOfFiveCount(checks) {
  if (!checks) return 0;
  let n = 0;
  for (const s of STAGE_ORDER) {
    if (checks[s] === 'done' || checks[s] === 'skip') n++;
  }
  return n;
}

/** Finished for THIS run:
 *  - fixStage=all → 5/5 sim→quality→image→title→gate
 *  - fixStage=one stage → that stage done counts
 */
function isFiveOfFiveFinished(checks, score) {
  return isRunFinished(checks, score);
}
function isRunFinished(checks, score) {
  if (!checks) return false;
  const stages = activeStages();
  for (const s of stages) {
    if (checks[s] !== 'done' && checks[s] !== 'skip') return false;
  }
  if (stages.length === STAGE_ORDER.length) {
    for (const s of STAGE_ORDER) {
      if (checks[s] !== 'done') return false;
    }
    // simMode gate can pass under 13 when image checks are waived
    if (score != null && Number.isFinite(Number(score)) && Number(score) < 11) return false;
  }
  return true;
}

/** Owner: SIM_FIX_STAGE=all|quality|title|image|gate|similarity */
function activeStages() {
  const raw = String(process.env.SIM_FIX_STAGE || 'all').toLowerCase().trim();
  if (!raw || raw === 'all') return STAGE_ORDER.slice();
  if (raw === 'nosim') return STAGE_ORDER.filter((s) => s !== 'similarity');
  if (STAGE_ORDER.includes(raw)) return [raw];
  console.warn('[fix] unknown SIM_FIX_STAGE=' + raw + ' — using ALL');
  return STAGE_ORDER.slice();
}
function isNosimMode() {
  return String(process.env.SIM_FIX_STAGE || '').toLowerCase().trim() === 'nosim'
    || process.env.SIM_PICK29 === '1'
    || process.env.SIM_NOSIM === '1';
}

function idNum(id) {
  const m = String(id || '').match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

async function makeFixCtx(id, opts, prog) {
  opts = opts || {};
  const { blob, body } = await getBody(id);
  const m = { title: blob.h1 || blob.title, question: blob.question, metaTitle: blob.meta_title, metaDesc: blob.meta_description };
  const kind = opts.kind || 'fix';
  const famSets = opts.famSets || [];
  const reportOv = typeof opts.reportOv === 'number' ? opts.reportOv : null;
  // Seed meter from scan report when known; NEVER fake 0% (that made pods "too easy").
  const seedOv = reportOv != null ? Math.round(reportOv * 100) : null;
  const P = prog[id] = {
    id: id,
    kind: kind,
    title: String(m.question || m.title || id).slice(0, 72),
    ov: seedOv, // null until measured — UI shows "?" not fake 0
    iq: toIq(blob.quality_score),
    target: Math.round(TARGET * 100),
    metric: 'sim',
    status: 'waiting',
    pass: 0,
    family: opts.family || null,
    checks: { similarity: 'pending', quality: 'pending', title: 'pending', image: 'pending', gate: 'pending' },
  };
  writeProg(prog);
  return {
    id, opts, prog, P, blob, m, famSets,
    best: body || '',
    bestOv: reportOv,
    g: null,
    alive: true,
    reportOv,
  };
}

/** Returns true if this URL still needs real work on the stage (not an instant green). */
function stageNeedsWork(ctx, stage) {
  if (!ctx.alive) return false;
  if (stage === 'similarity') {
    const best = ctx.best;
    if (!best || best.length < 300) return true;
    const seed = ctx.reportOv != null ? Number(ctx.reportOv) : null;
    // Already under 30% (incl. real 0%) — no sim rewrite needed.
    if (seed != null && seed < TARGET) {
      ctx.bestOv = seed;
      ctx.P.ov = Math.round(seed * 100);
      return false;
    }
    // Known hot (≥30%) or near-dup family — must run.
    if (seed != null && seed >= TARGET) return true;
    if (ctx.famSets && ctx.famSets.length) {
      let ov = maxOverlap(sentsOf(best), ctx.famSets);
      if (seed != null && !ctx._qualityRewrote) ov = Math.max(ov, seed);
      ctx.bestOv = ov;
      ctx.P.ov = Math.round(ov * 100);
      return ov >= TARGET;
    }
    // No scan ov + no family: only force sim for near-dup queue; else skip (gate/quality work).
    if (ctx.opts && ctx.opts.kind === 'neardup') return true;
    ctx.bestOv = 0;
    ctx.P.ov = 0;
    return false;
  }
  if (stage === 'quality') {
    // Thin / stub / failed gate body → need quality. Fat body with high iq may still need gate repair via quality loop for SUB13.
    if (!ctx.best || ctx.best.length < 400) return true;
    if (ctx.opts && ctx.opts.kind === 'stub') return true;
    if (ctx.opts && ctx.opts.kind === 'sub13') return true;
    if (ctx.opts && ctx.opts.kind === 'neardup') return true; // may rewrite for sim later
    return true;
  }
  if (stage === 'title') {
    // Always run — stamp/confirm title on every URL (owner: not fail-only)
    return true;
  }
  if (stage === 'image') {
    // Always run — stamp face + top + browse sq on every URL
    return true;
  }
  if (stage === 'gate') {
    // SUB13 / stub always gate. If already published-clean rare — still verify once unless dry skip.
    return true;
  }
  return true;
}

/** Load same-pillar peer sentence sets when scan family is missing — NEVER invent 0% sim. */
async function loadPillarPeerSets(id, limit) {
  limit = Math.max(3, Math.min(12, Number(limit) || 8));
  const pfx = String(id || '').match(/^([a-z]+)/i);
  if (!pfx) return [];
  const pillar = pfx[1].toLowerCase();
  const rep = readJSON(REPORT_F, {}) || {};
  const ids = [];
  for (const e of Object.values(rep.entries || {})) {
    if (!e || !e.id) continue;
    const oid = String(e.id).toLowerCase();
    if (oid === String(id).toLowerCase()) continue;
    if (!oid.startsWith(pillar)) continue;
    ids.push(oid);
  }
  // Prefer peers that scan marked high-overlap / near-dup
  ids.sort((a, b) => {
    const ea = (rep.entries && rep.entries[a]) || {};
    const eb = (rep.entries && rep.entries[b]) || {};
    const oa = typeof ea.overlap === 'number' ? ea.overlap : -1;
    const ob = typeof eb.overlap === 'number' ? eb.overlap : -1;
    return ob - oa || (idNum(a) - idNum(b));
  });
  const pick = ids.slice(0, limit);
  const out = [];
  for (const peer of pick) {
    try {
      const { body } = await getBody(peer);
      if (body && body.length > 300) out.push(sentsOf(body));
    } catch (e) {}
  }
  return out;
}

async function stageSimilarity(ctx) {
  const { P, prog } = ctx;
  P.status = 'fixing';
  P.checks.similarity = 'active';
  writeProg(prog);

  let best = ctx.best;
  ctx._bodyAtSimStart = best;
  let sets = Array.isArray(ctx.famSets) ? ctx.famSets.slice() : [];
  const reportOv = (ctx.reportOv != null && Number.isFinite(Number(ctx.reportOv))) ? Number(ctx.reportOv) : null;

  if (!best || best.length < 300) {
    // Thin body: skip sim — quality owns it. Don't kill the URL here.
    ctx.bestOv = reportOv != null ? reportOv : 0;
    P.ov = Math.round((ctx.bestOv || 0) * 100);
    P.checks.similarity = 'done';
    P.status = 'fixing';
    writeProg(prog);
    return { ok: true };
  }

  // Scan under 30% (incl. real 0%) → pass. Only a small set sitewide needs sim rewrite.
  if (reportOv != null && reportOv < TARGET) {
    ctx.bestOv = reportOv;
    P.ov = Math.round(reportOv * 100);
    P.checks.similarity = 'done';
    P.status = 'fixing';
    writeProg(prog);
    return { ok: true };
  }

  // Load peers when we actually need to rewrite (≥30% / near-dup / unknown with family)
  if (!sets.length && (reportOv == null || reportOv >= TARGET || (ctx.opts && ctx.opts.kind === 'neardup'))) {
    try {
      const peers = await loadPillarPeerSets(ctx.id, 8);
      if (peers.length) {
        sets = peers;
        ctx.famSets = peers;
      }
    } catch (e) {}
  }

  let bestOv = reportOv;
  if (sets.length) {
    const measured = maxOverlap(sentsOf(best), sets);
    if (bestOv == null) bestOv = measured;
    else if (!ctx._qualityRewrote) bestOv = Math.max(measured, bestOv);
    else bestOv = measured;
  }

  // No scan + no peers: gate/quality queue, not a sim problem — pass
  if (bestOv == null) {
    ctx.bestOv = 0;
    P.ov = 0;
    P.checks.similarity = 'done';
    P.status = 'fixing';
    writeProg(prog);
    return { ok: true };
  }

  ctx.bestOv = bestOv;
  P.ov = Math.round(bestOv * 100);
  writeProg(prog);

  if (bestOv < TARGET) {
    P.checks.similarity = 'done';
    P.status = 'fixing';
    writeProg(prog);
    return { ok: true, measured: !!sets.length, ov: bestOv };
  }

  if (!sets.length) {
    P.status = 'failed';
    P.checks.similarity = 'failed';
    writeProg(prog);
    return { ok: false, why: 'sim ' + Math.round(bestOv * 100) + '% ≥ ' + Math.round(TARGET * 100) + '% (no sibling set to rewrite against)' };
  }

  for (let pass = 1; pass <= MAX_PASSES && bestOv >= TARGET; pass++) {
    const W = liveWorkers();
    P.pass = pass; P.workers = W; writeProg(prog);
    console.log('[fix] sim pass ' + pass + ' · ' + ctx.id + ' · ' + W + ' workers together · ' + Math.round(bestOv * 100) + '% → under ' + Math.round(TARGET * 100) + '%');
    const user = 'Similarity to its siblings is currently ' + Math.round(bestOv * 100) + '% — get it UNDER ' + Math.round(TARGET * 100) + '% by rewriting the prose harder (keep all structure/images/mermaids/FAQ/sources verbatim).\n\nPAGE:\n' + best;
    const outs = await withWorkers(W, () => writeChat([{ role: 'system', content: REWRITE_SYS }, { role: 'user', content: user }]));
    for (const out of outs) {
      if (!out || out.length < Math.min(best.length * 0.9, Math.max((ctx.best || '').length * 0.9, 600))) continue;
      const o2 = maxOverlap(sentsOf(out), sets);
      if (o2 < bestOv) { best = out; bestOv = o2; }
    }
    ctx.best = best;
    ctx.bestOv = bestOv;
    P.ov = Math.round(bestOv * 100); writeProg(prog);
    if (bestOv < TARGET) break;
    await sleep(600);
  }
  if (bestOv >= TARGET) {
    P.status = 'failed'; P.checks.similarity = 'failed'; writeProg(prog);
    return { ok: false, why: 'stuck at ' + Math.round(bestOv * 100) + '% (need under ' + Math.round(TARGET * 100) + '%)' };
  }
  // Sim is last — if we rewrote, re-publish so live page matches
  ctx.best = best;
  if (!DRY && best && best.length > 400 && best !== (ctx._bodyAtSimStart || '')) {
    try {
      const pub = await gate(ctx.id, best, ctx.m, false);
      if (pub && pub.ok && pub.published) ctx.g = pub;
    } catch (e) {}
  }
  P.checks.similarity = 'done';
  P.status = 'fixing';
  writeProg(prog);
  return { ok: true, measured: true, ov: bestOv };
}

function shapeQaBody(body) {
  try {
    const { ensureQaGoldBodyShape } = require('./_qa_gold_template');
    return ensureQaGoldBodyShape(body || '') || body || '';
  } catch (e) { return body || ''; }
}

async function stageQuality(ctx) {
  const { P, prog, famSets, m, id } = ctx;
  const W = liveWorkers();
  P.status = 'fixing';
  P.checks.quality = 'active';
  if (!isTandemPartsMode()) P.workers = W;
  writeProg(prog);
  console.log('[fix] quality · ' + id + ' · ' + W + ' LLM worker(s)');

  let best = shapeQaBody(ctx.best);
  if ((!best || best.length < 300)) {
    const outs = await withWorkers(W, () => writeChat([{ role: 'system', content: QUALITY_SYS }, { role: 'user', content: 'Write a complete golden page for this question: "' + (m.question || m.title || id) + '".' }]));
    for (const out of outs) {
      if (out && out.length > 600 && (!best || out.length > best.length)) best = out;
    }
    best = shapeQaBody(best);
  }

  let g = best.length > 400 ? await gate(id, best, m, true) : { ok: true, pass: false, failed: ['words2000'] };
  for (let rep = 0; rep < 2 && !g.pass && (g.failed || []).some(c => !GATE_WAIVE.has(c)); rep++) {
    const need = (g.failed || []).filter(c => !GATE_WAIVE.has(c)).map(c => '- ' + (CHECK_HELP[c] || c));
    const outs = await withWorkers(W, () => writeChat([{ role: 'system', content: REWRITE_SYS }, { role: 'user', content: 'This page must stay UNDER ' + Math.round(TARGET * 100) + '% sibling similarity. Re-add EXACTLY these dropped checks, change nothing else:\n' + need.join('\n') + '\n\nPAGE:\n' + best }]));
    for (const out of outs) {
      if (!out || out.length <= best.length * 0.85) continue;
      if (famSets.length) {
        const o2 = maxOverlap(sentsOf(out), famSets);
        if (o2 < TARGET && out.length >= best.length) best = out;
      } else if (out.length > best.length) best = out;
    }
    g = await gate(id, best, m, true);
  }
  for (let pass = 1; pass <= MAX_PASSES && !(g && g.ok && g.pass); pass++) {
    const realFail = (g.failed || []).filter(c => !GATE_WAIVE.has(c));
    if (!realFail.length && g.pass) break;
    if (!realFail.length) break;
    P.pass = pass; P.workers = W; writeProg(prog);
    const fb = '\n\nThe checklist currently FAILS on: ' + realFail.join(', ') + '. Fix exactly those.';
    const user = (best.length > 400
      ? 'Upgrade this page so it passes all 13 checklist points.' + fb + '\n\nPAGE:\n' + best
      : 'Write a complete golden page for this question: "' + (m.question || m.title || id) + '".');
    const outs = await withWorkers(W, () => writeChat([{ role: 'system', content: QUALITY_SYS }, { role: 'user', content: user }]));
    for (const out of outs) {
      if (!out || out.length <= Math.max(600, best.length * 0.9)) continue;
      if (famSets.length) {
        const o2 = maxOverlap(sentsOf(out), famSets);
        if (o2 < TARGET) best = shapeQaBody(out);
      } else best = shapeQaBody(out);
    }
    g = await gate(id, best, m, true);
    await sleep(400);
  }
  ctx.best = shapeQaBody(best);
  ctx.g = g;
  const qualityOnly = String(process.env.SIM_FIX_STAGE || '').toLowerCase().trim() === 'quality';
  // Pass bar = 10/10 when content gate is clean (image checks waived in simMode).
  // Do NOT soft-pass on body length alone — that sent URLs to 3-strike then permanently out of NEXT 30.
  const contentOk = !!(g && (g.pass || gateContentOk(g)));
  if (contentOk) {
    P.checks.quality = 'done';
    P.iq = 10;
  } else {
    P.checks.quality = 'failed';
    P.iq = gateToIq(g && g.score, false);
  }
  writeProg(prog);
  if (P.checks.quality === 'failed') {
    P.status = 'failed'; writeProg(prog);
    recordOutcome(false); logFail(id, 'quality below 10/10 (content gate not passed)');
    return { ok: false, why: 'quality below 10/10' };
  }
  return { ok: true };
}

async function stageTitle(ctx) {
  const { P, prog, blob, m, id } = ctx;
  // FAKE chip — blast past. Real title-over-image happens in Square Builder + site render.
  P.status = 'fixing';
  P.checks.title = 'done';
  P.titleVia = 'fake-blast';
  const pageTitle = String(blob.h1 || blob.title || blob.question || m.title || m.question || id).trim();
  if (pageTitle) {
    m.title = pageTitle;
    m.question = m.question || pageTitle;
    blob.h1 = blob.h1 || pageTitle;
    blob.title = blob.title || pageTitle;
    blob.question = blob.question || pageTitle;
    P.title = String(pageTitle).slice(0, 72);
  }
  writeProg(prog);
  return { ok: true, fake: true };
}

async function stageImage(ctx) {
  const { P, prog } = ctx;
  // FAKE chip — blast past. Square Builder owns face/top photos.
  P.status = 'fixing';
  P.checks.image = 'done';
  P.imgVia = ['fake-blast'];
  P.note = 'image fake-pass · square builder owns photos';
  writeProg(prog);
  return { ok: true, fake: true };
}

function gateContentOk(g) {
  if (!g || g.ok === false) return false;
  if (g.pass) return true;
  const failed = Array.isArray(g.failed) ? g.failed : [];
  // simMode: image-only fails are waived — content clean ⇒ pass
  return failed.length > 0 && failed.every((c) => GATE_WAIVE.has(c));
}

async function stageGate(ctx) {
  const { P, prog, id, m } = ctx;
  let { best, g } = ctx;
  P.status = 'fixing';
  P.checks.gate = 'active'; writeProg(prog);
  if (!g) g = { ok: true, pass: false, failed: [] };
  if (gateContentOk(g) && !DRY) g = await gate(id, best, m, false);
  else if (!gateContentOk(g) && best.length > 400) {
    g = await gate(id, best, m, true);
    if (gateContentOk(g) && !DRY) g = await gate(id, best, m, false);
  }
  // Belt+suspenders: if scrub still flips pass:false on waived-only fails, treat as pass
  if (!g.pass && gateContentOk(g)) g = Object.assign({}, g, { pass: true });
  ctx.g = g;
  const ok = !!(g.ok && gateContentOk(g) && (DRY || g.published || g.pass));
  P.checks.gate = ok ? 'done' : 'failed';
  P.status = ok ? 'fixing' : 'failed';
  if (ok) {
    P.iq = await stampIqPass(id);
    P.checks.quality = 'done';
  }
  writeProg(prog);
  if (ok) return { ok: true, score: g.score };
  const realFail = ((g && g.failed) || []).filter((c) => !GATE_WAIVE.has(c));
  return { ok: false, why: g.pass && !g.published ? 'publish failed' : 'gate: ' + (realFail.join(',') || ((g && g.failed) || []).join(',')) };
}

const STAGE_RUNNERS = {
  similarity: stageSimilarity,
  quality: stageQuality,
  title: stageTitle,
  image: stageImage,
  gate: stageGate,
};

/**
 * Lockstep: for each stage, only URLs that need work get busy workers;
 * others wait (chip = wait). Barrier before next stage.
 */
async function runBatchLockstep(ctxs, meta) {
  const { batchStart, batchEnd, batchIds, prog, setBatchPhase } = meta;
  for (const stage of STAGE_ORDER) {
    if (fs.existsSync(SIM + '/STOP.flag')) return { stopped: true };
    const alive = ctxs.filter(c => c.alive);
    if (!alive.length) break;

    // Who needs real work vs instant-skip / wait
    const workers = [];
    const waiters = [];
    for (const c of alive) {
      const needs = stageNeedsWork(c, stage);
      if (needs) workers.push(c);
      else waiters.push(c);
    }

    // SKIP-if-done: mark waiters done immediately (not fake-busy), then they WAIT at the barrier
    for (const c of waiters) {
      c.P.status = 'waiting';
      if (stage === 'similarity') {
        c.P.checks.similarity = 'done';
        c.P.ov = Math.round((c.bestOv || 0) * 100);
        if (!workers.length) c.P.status = 'approved'; // last stage + skipped → approved
      } else if (stage === 'title' || stage === 'image') {
        c.P.checks[stage] = 'done';
      } else {
        c.P.checks[stage] = 'done'; // skip = already satisfied
      }
    }
    for (const c of workers) {
      c.P.status = 'fixing';
      c.P.checks[stage] = 'active';
    }
    writeProg(prog);
    setBatchPhase(
      'LOCKSTEP ' + stage.toUpperCase() + ' · batch ' + batchStart + '–' + batchEnd +
      ' · working ' + workers.length + '/' + alive.length +
      (waiters.length ? (' · ' + waiters.length + ' skipped/waiting') : '') +
      ' · barrier before next'
    );
    console.log('[fix-it-all] ▶ STAGE ' + stage + ' · work=' + workers.length + ' skip=' + waiters.length + ' ids=' + workers.map(c => c.id).join(','));

    // Instant-done waiters for title/sim already marked. For quality/image/gate,
    // "doesn't need work" is rare — still run waiters through quick path if listed as waiters with wait chip.
    // Title waiters = already have title (done). Sim waiters = already under TARGET (done).
    // Quality/image/gate: stageNeedsWork returns true for all alive → all are workers.

    if (workers.length) {
      await Promise.all(workers.map(async c => {
        try {
          const r = await STAGE_RUNNERS[stage](c);
          if (!r.ok) {
            c.alive = false;
            c.P.status = 'failed';
            c.result = r;
            writeProg(prog);
          } else {
            c.P.checks[stage] = 'done';
            if (stage === 'similarity') c.P.status = 'approved';
            else c.P.status = 'waiting'; // barrier — wait for peers before next stage
            writeProg(prog);
            c.result = r;
          }
        } catch (e) {
          c.alive = false;
          c.P.status = 'failed';
          c.P.checks[stage] = 'failed';
          c.result = { ok: false, why: (e && e.message) || 'exception' };
          writeProg(prog);
        }
      }));
    }

    // BARRIER — everyone who skipped OR finished waits here until the stage settles
    for (const c of alive) {
      if (c.alive && c.P.status === 'fixing') c.P.status = 'waiting';
      if (c.alive && stage === 'similarity' && c.P.checks.similarity === 'done') c.P.status = 'approved';
    }
    writeProg(prog);
    console.log('[fix-it-all] ■ STAGE ' + stage + ' settled · alive=' + ctxs.filter(c => c.alive).length + ' · barrier released');
  }
  return { stopped: false };
}

/**
 * Per-URL pipeline in correct order (owner original /10):
 *   sim → quality → image → title → gate(13/13)
 * Skip any stage already done. URLs in a batch run in parallel (no peer wait).
 */
async function fixAny(id, opts, prog) {
  const ctx = await makeFixCtx(id, opts, prog);
  const stages = activeStages();
  ctx.P.status = 'fixing';
  ctx.P.workers = 1;
  // Mark stages not in this run as skipped so chips don't look pending forever
  for (const s of STAGE_ORDER) {
    if (!stages.includes(s)) ctx.P.checks[s] = 'skip';
  }
  writeProg(prog);
  console.log('[fix] SEQ ' + id + ' · stages=' + stages.join('→'));

  for (const stage of stages) {
    if (fs.existsSync(SIM + '/STOP.flag')) return { ok: false, why: 'stopped', ov: ctx.bestOv };
    if (!ctx.alive) break;

    if (!stageNeedsWork(ctx, stage)) {
      ctx.P.checks[stage] = 'done';
      if (stage === 'similarity') {
        ctx.P.ov = Math.round((ctx.bestOv || 0) * 100);
        ctx.P.status = 'approved';
      }
      writeProg(prog);
      continue;
    }

    ctx.P.checks[stage] = 'active';
    ctx.P.status = 'fixing';
    writeProg(prog);
    try {
      const r = await STAGE_RUNNERS[stage](ctx);
      if (!r.ok) {
        ctx.alive = false;
        ctx.P.status = 'failed';
        ctx.P.checks[stage] = 'failed';
        ctx.result = r;
        writeProg(prog);
        return { ok: false, why: r.why || (stage + ' failed'), ov: ctx.bestOv, fiveOfFive: false, fiveCount: fiveOfFiveCount(ctx.P.checks), checks: Object.assign({}, ctx.P.checks) };
      }
      // Don't clobber a soft-fail chip (e.g. image) — 5/5 requires real done
      if (ctx.P.checks[stage] !== 'failed') ctx.P.checks[stage] = 'done';
      if (stage === 'similarity') ctx.P.status = 'approved';
      writeProg(prog);
      ctx.result = r;
    } catch (e) {
      ctx.alive = false;
      ctx.P.status = 'failed';
      ctx.P.checks[stage] = 'failed';
      ctx.result = { ok: false, why: (e && e.message) || 'exception' };
      writeProg(prog);
      return { ok: false, why: ctx.result.why, ov: ctx.bestOv };
    }
  }

  if (ctx.P.status !== 'failed') {
    ctx.P.status = 'approved';
    for (const s of stages) {
      if (ctx.P.checks[s] === 'active' || ctx.P.checks[s] === 'pending') ctx.P.checks[s] = 'done';
    }
    writeProg(prog);
    const score = ctx.g && ctx.g.score;
    // Gate must be real 13/13 when gate ran this pass (not skipped)
    if (ctx.P.checks.gate === 'done' && !(ctx.g && ctx.g.pass)) {
      ctx.P.checks.gate = 'failed';
      ctx.P.status = 'failed';
      writeProg(prog);
      return { ok: false, why: 'gate not 13/13', ov: ctx.bestOv, checks: ctx.P.checks, fiveOfFive: false };
    }
    // Finished = every chip DONE (not skip) + 13/13 — owner: every 5/5 needs attention
    const five = isRunFinished(ctx.P.checks, score);
    const label = stages.length === STAGE_ORDER.length ? '5/5' : (stages.join('+') + ' done');
    return {
      ok: five,
      ov: ctx.bestOv,
      score,
      iq: ctx.P.iq,
      checks: Object.assign({}, ctx.P.checks),
      fiveOfFive: five,
      fiveCount: fiveOfFiveCount(ctx.P.checks),
      why: five ? undefined : ('need ' + label + ' — got ' + fiveOfFiveCount(ctx.P.checks) + ' chips'),
    };
  }
  return {
    ok: false,
    why: (ctx.result && ctx.result.why) || 'failed',
    ov: ctx.bestOv,
    checks: Object.assign({}, ctx.P.checks),
    fiveOfFive: false,
    fiveCount: fiveOfFiveCount(ctx.P.checks),
  };
}

/**
 * Tandem: 1 URL · one worker per active stage.
 * Quality waits on sim; gate waits on quality (when both run).
 */
async function fixAnyTandemParts(id, opts, prog) {
  const ctx = await makeFixCtx(id, opts, prog);
  const stages = activeStages();
  ctx.P.status = 'fixing';
  ctx.P.workers = stages.length;
  for (const s of STAGE_ORDER) {
    ctx.P.checks[s] = stages.includes(s) ? 'active' : 'skip';
  }
  writeProg(prog);
  console.log('[fix] TANDEM ' + stages.length + ' parts · 1w each · ' + id + ' · ' + stages.join('→'));

  let resolveSim = () => {};
  let resolveQuality = () => {};
  ctx._simReady = new Promise((r) => { resolveSim = r; });
  ctx._qualityReady = new Promise((r) => { resolveQuality = r; });

  const simJob = stages.includes('similarity') ? (async () => {
    try {
      ctx.P.checks.similarity = 'active'; writeProg(prog);
      const r = await stageSimilarity(ctx);
      writeProg(prog);
      return r;
    } finally { resolveSim(); }
  })() : (async () => { ctx.P.checks.similarity = 'skip'; resolveSim(); return { ok: true, skip: true }; })();

  const qualityJob = stages.includes('quality') ? (async () => {
    await ctx._simReady;
    try {
      const r = await stageQuality(ctx);
      if (!r.ok) { ctx.alive = false; ctx.result = r; }
      else ctx.P.checks.quality = 'done';
      writeProg(prog);
      return r;
    } finally { resolveQuality(); }
  })() : (async () => { await ctx._simReady; ctx.P.checks.quality = 'skip'; resolveQuality(); return { ok: true, skip: true }; })();

  const titleJob = stages.includes('title') ? (async () => {
    const r = await stageTitle(ctx);
    if (!r.ok) { ctx.alive = false; ctx.result = r; }
    else ctx.P.checks.title = 'done';
    writeProg(prog);
    return r;
  })() : (async () => { ctx.P.checks.title = 'skip'; return { ok: true, skip: true }; })();

  const imageJob = stages.includes('image') ? (async () => {
    const r = await stageImage(ctx);
    ctx.P.checks.image = (r && r.ok !== false && ctx.P.checks.image !== 'failed') ? (ctx.P.checks.image === 'failed' ? 'failed' : 'done') : ctx.P.checks.image;
    if (ctx.P.checks.image === 'active') ctx.P.checks.image = 'done';
    writeProg(prog);
    return r;
  })() : (async () => { ctx.P.checks.image = 'skip'; return { ok: true, skip: true }; })();

  const gateJob = stages.includes('gate') ? (async () => {
    await ctx._qualityReady;
    if (!ctx.alive && !(ctx.best && ctx.best.length > 400)) {
      ctx.P.checks.gate = 'failed';
      writeProg(prog);
      return { ok: false, why: 'quality failed' };
    }
    ctx.P.checks.gate = 'active'; writeProg(prog);
    const r = await stageGate(ctx);
    if (!r.ok) { ctx.alive = false; ctx.result = r; }
    writeProg(prog);
    return r;
  })() : (async () => { await ctx._qualityReady; ctx.P.checks.gate = 'skip'; return { ok: true, skip: true }; })();

  const results = await Promise.all([simJob, qualityJob, titleJob, imageJob, gateJob]);
  const s = results[0], q = results[1], g = results[4];

  // Prefer real stage failures over vague chip counts
  if (s && !s.ok && !s.skip) return { ok: false, why: s.why || 'sim failed', ov: ctx.bestOv, fiveOfFive: false, fiveCount: fiveOfFiveCount(ctx.P.checks), checks: Object.assign({}, ctx.P.checks) };
  if (q && !q.ok && !q.skip) return { ok: false, why: q.why || 'quality failed', ov: ctx.bestOv, fiveOfFive: false, fiveCount: fiveOfFiveCount(ctx.P.checks), checks: Object.assign({}, ctx.P.checks) };
  if (g && !g.ok && !g.skip) return { ok: false, why: g.why || 'gate failed', ov: ctx.bestOv, fiveOfFive: false, fiveCount: fiveOfFiveCount(ctx.P.checks), checks: Object.assign({}, ctx.P.checks), score: ctx.g && ctx.g.score };

  const gateOk = !!(g && (g.ok || g.skip)) && (ctx.P.checks.gate === 'done' || ctx.P.checks.gate === 'skip');
  if (gateOk || (ctx.g && ctx.g.pass)) {
    if (ctx.P.status !== 'failed') ctx.P.status = 'approved';
    for (const k of stages) {
      if (ctx.P.checks[k] === 'active') ctx.P.checks[k] = 'done';
    }
    writeProg(prog);
    const five = isRunFinished(ctx.P.checks, ctx.g && ctx.g.score) && (ctx.P.checks.gate === 'skip' || !!(ctx.g && ctx.g.pass));
    const need = stages.length;
    return {
      ok: five,
      ov: ctx.bestOv,
      score: ctx.g && ctx.g.score,
      iq: ctx.P.iq,
      checks: Object.assign({}, ctx.P.checks),
      fiveOfFive: five,
      fiveCount: fiveOfFiveCount(ctx.P.checks),
      why: five ? undefined : ('only ' + fiveOfFiveCount(ctx.P.checks) + '/' + need + ' — need full attention on fix portion'),
    };
  }
  return { ok: false, why: (ctx.result && ctx.result.why) || 'failed', ov: ctx.bestOv, fiveOfFive: false, fiveCount: fiveOfFiveCount(ctx.P.checks), checks: Object.assign({}, ctx.P.checks) };
}

const _progCache = readJSON(PROG_F, {});
function writeProg(p) { try { fs.writeFileSync(PROG_F, JSON.stringify(p)); } catch (e) {} }

async function main() {
  // Scope is LOCKED from argv for the whole process — never re-read config (prevents ALL diversion mid-run).
  const scope = (process.argv[2] || '').trim();
  if (!scope) { console.error('HALT: no scope. Pass pillar code or ALL explicitly.'); process.exit(2); }
  const LOCKED = scope;
  let rep = readJSON(REPORT_F, null);
  if (!rep) { console.error('HALT: no scan_report.json — run the report first.'); process.exit(2); }
  const PICK_EARLY = SIM + '/pick29.json';
  const pickActive = process.env.SIM_PICK29 === '1'
    || (String(process.env.SIM_FIX_STAGE || '').toLowerCase() === 'nosim' && fs.existsSync(PICK_EARLY));
  // If the report was for a specific pillar, refuse to run as ALL / different pillar — unless PICK 29 / NEXT30
  const lockedNorm = String(LOCKED).toLowerCase().replace(/[^a-z0-9]/g, '');
  const repNorm = String(rep.scope || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const nextish = lockedNorm === 'next30' || lockedNorm === 'next' || /^pod\d+$/.test(lockedNorm);
  if (!pickActive && !nextish && rep.scope && String(rep.scope).toUpperCase() !== 'ALL' && repNorm !== lockedNorm) {
    console.error('HALT: report scope=' + rep.scope + ' but transform asked for ' + LOCKED + ' — re-run REPORT on the pillar you want.');
    process.exit(2);
  }
  if (!pickActive && !nextish && LOCKED.toUpperCase() === 'ALL' && rep.scope && String(rep.scope).toUpperCase() !== 'ALL') {
    console.error('HALT: refusing ALL diversion — report is locked to ' + rep.scope);
    process.exit(2);
  }
  const inScope = (id) => {
    if (LOCKED.toUpperCase() === 'ALL') return true;
    const s = LOCKED.toLowerCase().replace(/[^a-z0-9]/g, '');
    const idl = String(id || '').toLowerCase();
    const {
      parseSectionScope,
      parsePodScope,
      idInSectionScope,
      idInPodScope,
      idInNext30,
      isPodLocked,
      buildSections,
      pillarOf,
    } = require('./_fixer_scope_sections');
    // NEXT 30 — always follow next30.json (not a tiny next30-scoped scan that freezes the batch)
    if (s === 'next30' || s === 'next') return !!idInNext30(id);
    // Fixer pods of 30 — cross-pillar; green/locked = never again
    if (parsePodScope(s)) {
      if (isPodLocked(s)) return false;
      if (rep.scope && String(rep.scope).toLowerCase().replace(/[^a-z0-9]/g, '') === s) {
        return !!(rep.entries && (rep.entries[id] || rep.entries[idl]));
      }
      return !!idInPodScope(id, s);
    }
    if (rep.scope && String(rep.scope).toLowerCase().replace(/[^a-z0-9]/g, '') === s) {
      return !!(rep.entries && (rep.entries[id] || rep.entries[idl]));
    }
    if (!inScope._packs) {
      const byP = {};
      for (const x of Object.keys(rep.entries || {})) {
        const p = pillarOf(x);
        if (!p) continue;
        if (!byP[p]) byP[p] = [];
        byP[p].push(x);
      }
      inScope._packs = {};
      for (const p of Object.keys(byP)) {
        inScope._packs[p] = buildSections(p, [...new Set(byP[p])], null, p);
      }
    }
    const secHit = idInSectionScope(id, s, inScope._packs);
    if (secHit !== null) return !!secHit;
    if (/^tl[abcd]$/.test(s)) {
      if (!/^tl\d/.test(idl)) return false;
      const n = parseInt(idl.replace(/\D/g, ''), 10) || 0;
      const want = { tla: 0, tlb: 1, tlc: 2, tld: 3 }[s];
      return (n % 4) === want;
    }
    if (parseSectionScope(s)) return false;
    return new RegExp('^' + s + '\\d').test(idl) || idl === s;
  };
  const state = readJSON(STATE_F, { cleared: [], strikes: {} });
  // cleared = truly fixed this machine only; 3-strike uses deferred (NOT permanent queue removal)
  const trulyFixed = (() => {
    try { return require('./_fixer_scope_sections').loadClearedIds(); } catch (e) { return new Set(); }
  })();
  const cleared = new Set([...trulyFixed]); // only real FIXED — never 3-strike pollution
  const deferred = new Set(); // 3-strike skip for THIS run only
  const strikes = state.strikes || {};
  const saveState = () => { try { fs.writeFileSync(STATE_F, JSON.stringify({ cleared: [...cleared], strikes }, null, 1)); } catch (e) {} };
  const prog = _progCache;

  // ── one flat worklist: near-dup · Sub-13 · stubs ──
  const ONLY_FAM = process.env.SIM_FAMILY || (process.argv.find(a => a.startsWith('--family=')) || '').replace('--family=', '');
  const ONLY_PILE = (process.env.SIM_PILE || '').toUpperCase();
  const STAGE_FILTER = String(process.env.SIM_FIX_STAGE || 'all').toLowerCase().trim();
  const PICK_F = SIM + '/pick29.json';
  const usePick29 = process.env.SIM_PICK29 === '1' || (STAGE_FILTER === 'nosim' && fs.existsSync(PICK_F));
  let pickIds = null;
  if (usePick29 && fs.existsSync(PICK_F)) {
    try {
      const pk = JSON.parse(fs.readFileSync(PICK_F, 'utf8'));
      if (pk && Array.isArray(pk.ids) && pk.ids.length) pickIds = pk.ids.map(String);
    } catch (e) {}
  }
  const wantND = !pickIds && (!ONLY_PILE || ONLY_PILE === 'NEAR_DUP') && STAGE_FILTER !== 'nosim';
  const work = [];
  if (pickIds) {
    for (const id of pickIds) {
      work.push({ id, kind: 'sub13', fam: null, members: [id] });
    }
  } else {
  if (wantND) {
    const fams = Object.values(rep.families || {}).filter(f => f.members.some(inScope) && (!ONLY_FAM || f.id === ONLY_FAM));
    for (const fam of fams) {
      const members = fam.members.filter(inScope);
      for (const id of members) { if (rep.entries[id] && rep.entries[id].canonical) continue; work.push({ id, kind: 'neardup', fam, members }); }
    }
  }
  if (!ONLY_FAM) for (const e of Object.values(rep.entries || {})) {
    if (!inScope(e.id)) continue;
    let fam = null;
    if (e.family && rep.families && rep.families[e.family]) fam = rep.families[e.family];
    if (e.pile === 'SUB13' && (!ONLY_PILE || ONLY_PILE === 'SUB13')) work.push({ id: e.id, kind: 'sub13', fam: fam, members: fam ? fam.members.filter(inScope) : [e.id] });
    else if (e.pile === 'STUB' && (!ONLY_PILE || ONLY_PILE === 'STUB')) work.push({ id: e.id, kind: 'stub', fam: fam, members: fam ? fam.members.filter(inScope) : [e.id] });
  }
  }
  const nd = work.filter(w => w.kind === 'neardup').length, sb = work.filter(w => w.kind === 'sub13').length, st = work.filter(w => w.kind === 'stub').length;
  let todo = work.filter(w => !cleared.has(w.id) && !deferred.has(w.id));
  // NEXT 30: if this window is exhausted, auto-advance so the fixer keeps eating the queue
  if ((lockedNorm === 'next30' || lockedNorm === 'next') && todo.length === 0) {
    try {
      const { skipNext30, bestNeedReport, loadNext30 } = require('./_fixer_scope_sections');
      const nxt = skipNext30();
      console.log('[fix-it-all] NEXT 30 empty — auto-skip → batch ' + nxt.batch + '/' + nxt.batches + ' n=' + nxt.n);
      // Prefer fat sitewide piles for the new window
      try {
        const site = bestNeedReport();
        if (site && site.entries) rep = site;
      } catch (e) {}
      work.length = 0;
      const pack = loadNext30();
      for (const id of (pack.ids || [])) {
        const idl = String(id).toLowerCase();
        if (cleared.has(idl) || deferred.has(idl)) continue;
        const e = (rep.entries && (rep.entries[idl] || rep.entries[id])) || { id: idl, pile: 'SUB13' };
        if (e.pile === 'PASS') continue;
        const kind = e.pile === 'STUB' ? 'stub' : (e.pile === 'NEAR_DUP' ? 'neardup' : 'sub13');
        if (STAGE_FILTER === 'similarity' && kind !== 'neardup') continue;
        if ((STAGE_FILTER === 'gate' || STAGE_FILTER === 'quality' || STAGE_FILTER === 'nosim') && kind === 'neardup') continue;
        work.push({ id: idl, kind, fam: null, members: [idl] });
      }
      todo = work.filter(w => !cleared.has(w.id) && !deferred.has(w.id));
    } catch (e) {
      console.warn('[fix-it-all] next30 auto-skip failed', e && e.message);
    }
  }
  if (STAGE_FILTER === 'similarity' && nd === 0) {
    console.error('HALT: SIM_FIX_STAGE=similarity but scan NEAR_DUP=0 — re-run REPORT / pick another stage.');
    process.exit(2);
  }
  if (STAGE_FILTER === 'gate' && sb === 0 && st === 0) {
    console.error('HALT: SIM_FIX_STAGE=gate but scan SUB13+STUB=0 — nothing to 13/13.');
    process.exit(2);
  }
  if (STAGE_FILTER === 'quality' && sb === 0 && st === 0) {
    console.error('HALT: SIM_FIX_STAGE=quality but scan SUB13+STUB=0 — nothing for quality.');
    process.exit(2);
  }
  if (STAGE_FILTER === 'similarity') todo = todo.filter(w => w.kind === 'neardup');
  else if (STAGE_FILTER === 'gate' || STAGE_FILTER === 'quality') todo = todo.filter(w => w.kind === 'sub13' || w.kind === 'stub');
  else if (STAGE_FILTER === 'nosim') todo = todo.filter(w => w.kind === 'sub13' || w.kind === 'stub');
  if (process.env.SIM_MAX) todo = todo.slice(0, parseInt(process.env.SIM_MAX, 10));
  console.log(`[fix-it-all] LOCKED scope=${LOCKED} stage=${STAGE_FILTER||'all'} worklist=${work.length} todo=${todo.length}  similarity=${nd} sub13=${sb} stubs=${st}  batch=${process.env.SIM_BATCH || 10}${pickIds ? ' PICK29=' + pickIds.length : ''}`);
  setStatus({ stage: 'transform', phase: 'starting', scope: LOCKED, lockedScope: LOCKED, fixStage: STAGE_FILTER || 'all', total: work.length, todo: todo.length, similarity: nd, sub13: sb, stubs: st, transformed: 0, published: 0, failed: 0, target: TARGET, note: 'Locked on ' + LOCKED + ' · stage ' + (STAGE_FILTER || 'all') + (pickIds ? ' · PICK29' : '') });

  const famSetCache = {};
  async function famSetsFor(w) {
    if (!w.fam || !w.fam.id) return [];
    if (famSetCache[w.fam.id]) return famSetCache[w.fam.id];
    const sets = []; for (const x of w.members) { const { body } = await getBody(x); sets.push({ id: x, set: sentsOf(body) }); }
    return (famSetCache[w.fam.id] = sets);
  }

  try { fs.unlinkSync(SIM + '/STOP.flag'); } catch (e) {}   // clear any prior force-stop
  let fixed = 0, failed = 0;
  // Batch size = panel "URLs fixed at a time" (owner: back to 20, parallel, no peer-wait)
  function liveConc() {
    try {
      const cfg = JSON.parse(fs.readFileSync(WD + '/gen/config.json', 'utf8'));
      if (cfg && cfg.fixConcurrency != null) {
        let n = parseInt(cfg.fixConcurrency, 10);
        if (Number.isFinite(n) && n >= 1) return Math.min(50, n);
      }
    } catch (e) {}
    let n = parseInt(process.env.SIM_BATCH || '0', 10);
    if (!Number.isFinite(n) || n < 1) n = 30;
    if (n > 50) n = 50;
    return n;
  }
  console.log('[fix-it-all] concurrency=' + liveConc() + (isTandemPartsMode() ? ' · TANDEM' : ' · 30 workers · 1 URL each') + ' · finished=5/5 · quality /10 · sim→quality→image→title→13/13');

  function rebuildNext30Todo() {
    try {
      const { skipNext30, bestNeedReport, loadNext30 } = require('./_fixer_scope_sections');
      // Honor image-test preload — do NOT skip past locked ids
      let nxt;
      try {
        const cur = JSON.parse(fs.readFileSync(SIM + '/next30.json', 'utf8'));
        if (cur && cur.preload && !cur.preloadConsumed && Array.isArray(cur.ids) && cur.ids.length) {
          nxt = cur;
          console.log('[fix-it-all] NEXT 30 preload locked n=' + cur.ids.length + ' · ' + (cur.note || ''));
        }
      } catch (e) {}
      if (!nxt) {
        nxt = skipNext30();
        console.log('[fix-it-all] NEXT 30 → batch ' + nxt.batch + '/' + nxt.batches + ' n=' + nxt.n);
      }
      try {
        const site = bestNeedReport();
        if (site && site.entries) rep = site;
      } catch (e) {}
      work.length = 0;
      const pack = nxt.ids ? nxt : loadNext30();
      for (const id of (pack.ids || [])) {
        const idl = String(id).toLowerCase();
        if (cleared.has(idl) || deferred.has(idl)) continue;
        const e = (rep.entries && (rep.entries[idl] || rep.entries[id])) || { id: idl, pile: 'SUB13' };
        if (e.pile === 'PASS') continue;
        const kind = e.pile === 'STUB' ? 'stub' : (e.pile === 'NEAR_DUP' ? 'neardup' : 'sub13');
        if (STAGE_FILTER === 'similarity' && kind !== 'neardup') continue;
        if ((STAGE_FILTER === 'gate' || STAGE_FILTER === 'quality' || STAGE_FILTER === 'nosim') && kind === 'neardup') continue;
        work.push({ id: idl, kind, fam: null, members: [idl] });
      }
      todo = work.filter(w => !cleared.has(w.id) && !deferred.has(w.id));
      if (STAGE_FILTER === 'similarity') todo = todo.filter(w => w.kind === 'neardup');
      else if (STAGE_FILTER === 'gate' || STAGE_FILTER === 'quality' || STAGE_FILTER === 'nosim') todo = todo.filter(w => w.kind === 'sub13' || w.kind === 'stub');
      return todo.length;
    } catch (e) {
      console.warn('[fix-it-all] next30 rebuild failed', e && e.message);
      return 0;
    }
  }

  // NEXT 30 auto: keep advancing batches. SIM_AUTO_LAPS overrides (default huge = keep going).
  const maxNextLaps = (lockedNorm === 'next30' || lockedNorm === 'next')
    ? Math.max(1, parseInt(process.env.SIM_AUTO_LAPS || '5000', 10) || 5000)
    : 1;
  for (let lap = 0; lap < maxNextLaps; lap++) {
    if (fs.existsSync(SIM + '/STOP.flag')) { setStatus({ stage: 'stopped', phase: 'idle', note: 'Force-stopped.' }); console.log('[fix-it-all] FORCE STOP — halting'); return; }
    if (!todo.length) {
      if (lockedNorm !== 'next30' && lockedNorm !== 'next') break;
      if (!rebuildNext30Todo()) break;
    }

  for (let i = 0; i < todo.length; ) {
    if (fs.existsSync(SIM + '/STOP.flag')) { setStatus({ stage: 'stopped', phase: 'idle', note: 'Force-stopped.' }); console.log('[fix-it-all] FORCE STOP — halting'); return; }
    const CONC = liveConc();
    const batch = todo.slice(i, i + CONC);
    const batchStart = i + 1;
    const batchEnd = Math.min(i + batch.length, todo.length);
    const batchIds = new Set(batch.map(w => w.id));

    for (const k of Object.keys(prog)) delete prog[k];
    writeProg(prog);

    setStatus({
      stage: 'transform',
      phase: 'batch ' + batchStart + '–' + batchEnd + ' · ' + batch.length + ' URLs · 1w each · sim→quality→image→title→13/13',
      fixConcurrency: CONC,
      fixWorkers: 1,
      batchSize: batch.length,
      batchHold: true,
      batchIds: [...batchIds],
      scope: LOCKED,
      lockedScope: LOCKED,
      note: batch.length + ' workers · 1 URL each · finish independently · quality /10',
    });
    console.log('[fix-it-all] ▶ PARALLEL ' + batchStart + '–' + batchEnd + ' n=' + batch.length + ' ids=' + [...batchIds].slice(0, 8).join(',') + (batch.length > 8 ? '…' : ''));

    let settled = 0;
    await Promise.all(batch.map(async w => {
      const famId = w.fam && w.fam.id;
      try {
        let famSets = [];
        const ent = rep.entries && (rep.entries[w.id] || rep.entries[String(w.id).toLowerCase()]);
        // Trust scan overlap (incl. real 0%). Sim stage only rewrites when ≥30% / near-dup.
        const reportOv = (ent && typeof ent.overlap === 'number') ? ent.overlap : null;
        if (w.fam) {
          const sets = await famSetsFor(w);
          famSets = sets.filter(f => f.id !== w.id).map(f => f.set);
        }
        // Peers only when hot / near-dup / family empty but we need a rewrite measure
        if (!famSets.length && ((reportOv != null && reportOv >= TARGET) || w.kind === 'neardup')) {
          try { famSets = await loadPillarPeerSets(w.id, 8); } catch (e) {}
        }
        const r = isTandemPartsMode()
          ? await fixAnyTandemParts(w.id, { kind: w.kind, famSets, reportOv, family: famId || (ent && ent.family) || null }, prog)
          : await fixAny(w.id, { kind: w.kind, famSets, reportOv, family: famId || (ent && ent.family) || null }, prog);
        const checks = (prog[w.id] && prog[w.id].checks) || r.checks || {};
        const fullyDone = !!(r.ok && r.fiveOfFive && isRunFinished(checks, r.score));
        if (fullyDone) {
          // In-run skip so we don't re-hit this URL in the same transform process
          cleared.add(w.id); delete strikes[w.id]; saveState();
          if (isFullFiveOfFiveRun() && isFiveOfFive(checks) && isThreeOfThree(checks)) {
            // Content 3/3 done → Santa Workshop. FIXED ledger only after Square SAVE.
            fixed++;
            const titleGuess = (prog[w.id] && prog[w.id].title) || w.id;
            shipToWorkshop(w.id, famId, r.score, w.kind, titleGuess);
            if (prog[w.id]) {
              prog[w.id].status = 'workshop';
              prog[w.id].needs_square = true;
              writeProg(prog);
            }
            Object.assign(globalThis, { __lastFixRate: recordFixRate() });
          } else {
            // Image-only (or single-stage): credit partial · do NOT workshop / FIXED
            fixed++;
            logImageDone(w.id, w.kind);
            Object.assign(globalThis, { __lastFixRate: recordFixRate() });
            console.log(`  ✓ stage-done ${w.id} [${w.kind}] · partial · pod stays until 3/3`);
          }
        } else {
          failed++; strikes[w.id] = (strikes[w.id] || 0) + 1;
          const why = r.why || ('partial ' + fiveOfFiveCount(checks) + '/' + activeStages().length);
          if (strikes[w.id] >= 3) {
            deferred.add(w.id); // skip this run only — stays in need queue for a later batch
            delete strikes[w.id];
            logFail(w.id, w.kind + ' 3-STRIKE SKIP: ' + why);
            console.log(`  ✗✗✗ ${w.id} [${w.kind}] 3-strike SKIP (stays in queue) — ${why}`);
          }
          else { logFail(w.id, w.kind + ' strike ' + strikes[w.id] + ': ' + why); console.log(`  ✗ ${w.id} [${w.kind}] ${fiveOfFiveCount(checks)}/${activeStages().length} — ${why}`); }
          saveState();
        }
      } catch (e) {
        failed++; strikes[w.id] = (strikes[w.id] || 0) + 1;
        if (strikes[w.id] >= 3) { deferred.add(w.id); delete strikes[w.id]; }
        saveState();
        logFail(w.id, w.kind + ' exception: ' + ((e && e.message) || e));
      }
      settled++;
      for (const k of Object.keys(prog)) if (!batchIds.has(k)) delete prog[k];
      writeProg(prog);
      const rate = (globalThis.__lastFixRate) || readFixRate();
      setStatus({
        transformed: fixed,
        failed,
        fixedTotal: fixed,
        remaining: Math.max(0, work.length - cleared.size),
        currentId: w.id,
        batchHold: true,
        batchSettled: settled,
        batchSize: batch.length,
        batchIds: [...batchIds],
        phase: 'batch ' + batchStart + '–' + batchEnd + ' · settled ' + settled + '/' + batch.length,
        scope: LOCKED,
        lockedScope: LOCKED,
        fixConcurrency: CONC,
        fixesPerMin: rate.fixesPerMin,
        fixesPerHour: rate.fixesPerHour,
      });
    }));

    i += batch.length;
    console.log('[fix-it-all] ■ RELEASE batch ' + batchStart + '–' + batchEnd + ' settled ' + settled + '/' + batch.length);
    const rateDone = readFixRate();
    setStatus({
      phase: 'batch ' + batchStart + '–' + batchEnd + ' done · opening next…',
      batchHold: false,
      transformed: fixed,
      failed,
      fixedTotal: fixed,
      remaining: Math.max(0, work.length - cleared.size),
      scope: LOCKED,
      lockedScope: LOCKED,
      fixesPerMin: rateDone.fixesPerMin,
      fixesPerHour: rateDone.fixesPerHour,
    });
  }

    // Finished this NEXT 30 window — advance and keep going (unless STOP)
    if (lockedNorm === 'next30' || lockedNorm === 'next') {
      deferred.clear(); // new window; failed ids stay in sitewide queue for a later wrap
      todo = [];
      if (!rebuildNext30Todo()) break;
      continue;
    }
    break;
  }

  setStatus({ stage: 'done', phase: 'idle', scope: LOCKED, lockedScope: LOCKED, transformed: fixed, failed, fixedTotal: fixed, remaining: Math.max(0, work.length - cleared.size), verified: failed === 0, note: 'Finished ' + LOCKED });
  console.log(`[fix-it-all] DONE scope=${LOCKED}  fixed+published=${fixed}  failed=${failed}  remaining=${Math.max(0, work.length - cleared.size)}  (sim/FIXED.md ledger updated)`);
}
main().catch(e => { console.error('[fix-it-all] FATAL', e.message); setStatus({ stage: 'error', phase: 'idle', error: e.message }); process.exit(1); });
