// _mv_audit.js — DETERMINISTIC Q&A/Top-10 detector (READ-ONLY). No fixes. Emits a failures manifest.
// Architecture (owner 2026-07-07): detect is split from fix. This script is the single source of truth for
// "does an entry meet the golden-template standard." Completion of the fix job = a fresh run here with an
// empty manifest for the target set.
//
//   node _mv_audit.js                 → audit all mv entries → _mv_failures.json + _mv_registry.json
//   node _mv_audit.js mv0001 mv0002   → audit only those ids
//   SELFTEST_ONLY=1 node _mv_audit.js → run only the known-answer self-test of the checker
//
// Every criterion below is BINARY + script-detectable (no "does this feel right"):
//   C1 classify   — pickGoldTemplate resolves a template (top10|qa)
//   C2 gold       — auditTop10GoldTemplate/auditQaGoldTemplate compliant (structure/section order/mermaid/etc.)
//   C3 grade13    — gradeEntry score == 13/13 (13-point content rubric)
//   C4 imgrender  — every INTERNAL image self-hosted + decodable + grade-stamped (Fable render guard); cover excluded
//   C5 nopoll     — no live image.pollinations.ai URL baked in the blob
//   C6 formatv    — entry.format_v stamped to the golden format version
//   C14 titleimg  — (mv only) each @@PRODUCT image matches slot movie title + poster aspect; no junk URLs
//   C15 foreign   — (mv only) no cross-pillar boilerplate (aquarium/SaaS product text)
//   C15b filler   — (mv only) no duplicate stub Pros/Cons/Verdict appended to rich authored sections
//   C16 related   — Related on PULSE link text matches destination entry question
//   C17 artifacts — no weave HTML comments in blob; no duplicate caption lines
//   C22 imgsrc    — every self-hosted /assets/ image referenced in the blob exists on disk (no 404 desync)
'use strict';
const fs = require('fs');
const WD = __dirname;
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
process.env.STAGGER_DDG_POLLINATOR = process.env.STAGGER_DDG_POLLINATOR || '1';

const { getStore } = require('@netlify/blobs');
const { pickGoldTemplate } = require('./_pulse_gold_template_router');
const { auditTop10GoldTemplate } = require('./_ranking_top10_gold_template');
const { auditQaGoldTemplate } = require('./_qa_gold_template');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const { auditLivePollinationsInBody } = require('./_image_provider_alternate');
const { scanEntryImages } = require('./_fable_image_render_gate');
const { collapseToGoldStructure } = require('./_aq_top10_gold_fix_lib');
const {
  auditMovieTitleMatch,
  auditForeignPillarText,
  auditTemplateArtifacts,
  auditDuplicateFiller,
  auditImgSrcResolve,
  auditRelatedIntegrity,
} = require('./_mv_image_title_match');

// Structural (non-image) gold issues — used by the known-answer self-test to prove the structure checker works
// independently of image presence.
const STRUCTURAL_ISSUE = /first_section|second_section|rank_\d+_out_of_order|tail_out_of_order|extra_sections|mermaid|missing_how_to_choose|how_to_choose_missing|direct_answer|second_/i;

const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const PILLAR = process.env.PILLAR || 'mv';
const FAILURES_F = WD + '/_mv_failures.json';
const REGISTRY_F = WD + '/_mv_registry.json';
const FORMAT_V_AQ_TOP10 = '2026-07-aq-top10-gold';
const FORMAT_V_IMAGES = '2026-07-ranking-no-hero-imgs';
const FORMAT_V_AQ_QA = '2026-07-aq-qa-gold';

// One entry → { id, template, pass, failed:[codes], detail:{} }. READ-ONLY; scanEntryImages does not write.
async function auditEntry(id, entry, idxEntries) {
  const body = (entry && (entry.answer || entry.body)) || '';
  const title = (entry && entry.question) || id;
  const failed = [];
  const detail = {};

  const pick = pickGoldTemplate(id, body, title);
  const template = pick.template === 'qa' ? 'qa' : 'top10';
  if (!pick.template) { failed.push('C1_classify'); detail.C1 = 'router returned null'; }

  let gold;
  if (template === 'top10') gold = auditTop10GoldTemplate(body, title);
  else gold = auditQaGoldTemplate(body, title, id);
  // applies===false means the gold template does not even apply → vacuous compliant:true. Treat as a failure:
  // a golden entry must APPLY its template AND be compliant.
  if (!gold || gold.applies === false || !gold.compliant) {
    failed.push('C2_gold');
    detail.C2 = (gold && gold.applies === false) ? ['gold_template_not_applicable'] : ((gold && (gold.issues || []).slice(0, 8)) || ['no audit result']);
  }

  let score = 0;
  try { score = gradeEntry(id, body).score; } catch (e) { detail.C3err = e.message; }
  if (score < 13) { failed.push('C3_grade13'); detail.C3 = score + '/13'; }

  const scan = await scanEntryImages(id, body, { includeCover: false, skipTitleMatch: true });
  if (scan.failed.length) { failed.push('C4_imgrender'); detail.C4 = scan.failed.map(f => f.url + ' [' + f.flag + ']').slice(0, 8); detail.C4count = scan.failed.length + '/' + scan.total; }

  if (auditLivePollinationsInBody(body).length) { failed.push('C5_nopoll'); detail.C5 = 'live pollinations url in blob'; }

  const okFormat = template === 'top10'
    ? (entry && (entry.format_v === FORMAT_V_AQ_TOP10 || entry.format_v === FORMAT_V_IMAGES))
    : (entry && entry.format_v === FORMAT_V_AQ_QA);
  if (!okFormat) { failed.push('C6_formatv'); detail.C6 = (entry && entry.format_v) || 'none'; }

  const isMv = /^mv\d+$/i.test(id);
  if (isMv) {
    const tm = await auditMovieTitleMatch(id, body);
    if (tm.failed.length) {
      failed.push('C14_titleimg');
      detail.C14 = tm.failed.map((f) => f.name + ' [' + f.flag + '] ' + (f.url || '')).slice(0, 8);
      detail.C14count = tm.failed.length + '/' + tm.total;
    }
    const foreign = auditForeignPillarText(body);
    if (foreign.length) { failed.push('C15_foreign'); detail.C15 = foreign.slice(0, 6); }
    const filler = auditDuplicateFiller(body);
    if (filler.length) { failed.push('C15b_filler'); detail.C15b = filler; }
    const artifacts = auditTemplateArtifacts(body);
    if (artifacts.length) { failed.push('C17_artifacts'); detail.C17 = artifacts; }
  }
  const missingImgs = auditImgSrcResolve(body);
  if (missingImgs.length) { failed.push('C22_imgsrc'); detail.C22 = missingImgs.slice(0, 8); }
  const relatedFails = auditRelatedIntegrity(body, idxEntries);
  if (relatedFails.length) {
    failed.push('C16_related');
    detail.C16 = relatedFails.slice(0, 6);
  }

  return { id, template, pass: failed.length === 0, failed, detail };
}

// Known-answer self-test: a checker that can't tell good from bad is useless. We synthesize a KNOWN-BAD
// (empty stub) which MUST fail C2/C3/C6, and treat the aquariums gold reference aq1158 as KNOWN-GOOD for the
// structural check C2 (auditTop10GoldTemplate must be compliant on its own reference).
async function selfTest(store) {
  const problems = [];
  // KNOWN-BAD: an empty stub must fail structure (C2) and grade (C3) and never report pass.
  const bad = await auditEntry('mv_selftest_bad', { answer: 'stub', question: 'Top 10 Test Movies', format_v: 'x' }, []);
  if (!bad.failed.includes('C2_gold')) problems.push('known-bad did not fail C2_gold');
  if (!bad.failed.includes('C3_grade13')) problems.push('known-bad did not fail C3_grade13');
  if (bad.pass) problems.push('known-bad reported pass');

  // KNOWN-GOOD (structure): the gold reference aq1158, run through the same normalizer the rebuild uses, must have
  // ZERO structural issues (only image-slot issues remain on a stripped body). This proves the structure checker
  // passes good structure — independent of image presence. (Raw stored aq1158 has render-time drift, so we
  // normalize first — same transform every rebuilt entry gets.)
  try {
    const gref = await store.get('answers/aq1158.json', { type: 'json' });
    if (gref) {
      const body = gref.answer || gref.body || '';
      const title = gref.question || 'aq1158';
      const norm = collapseToGoldStructure(body, 'aq1158', title);
      const g = auditTop10GoldTemplate(norm, title);
      const structuralIssues = (g.issues || []).filter(i => STRUCTURAL_ISSUE.test(i));
      if (structuralIssues.length) problems.push('known-good aq1158 has structural issues after normalize: ' + JSON.stringify(structuralIssues).slice(0, 240));
    } else problems.push('known-good aq1158 not found (skipped)');
  } catch (e) { problems.push('known-good aq1158 load error: ' + e.message); }

  return { ok: problems.length === 0, problems };
}

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE, token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

  const st = await selfTest(store);
  if (!st.ok) {
    console.error('❌ AUDIT SELF-TEST FAILED — the checker is wrong, fix it before auditing pages:');
    for (const p of st.problems) console.error('   · ' + p);
    process.exitCode = 2;
    return;
  }
  console.log('✅ self-test passed (checker distinguishes known-good aq1158 from known-bad stub)');
  if (process.env.SELFTEST_ONLY === '1') return;

  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const re = new RegExp('^' + PILLAR + '\\d+$');
  const want = process.argv.slice(2).filter(a => /^[a-z]+\d+$/i.test(a));
  let rows = (idx.entries || []).filter(e => e && re.test(e.id));
  if (want.length) rows = rows.filter(e => want.includes(e.id));
  rows.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

  const failures = {};
  const registry = fs.existsSync(REGISTRY_F) ? JSON.parse(fs.readFileSync(REGISTRY_F, 'utf8')) : {};
  let pass = 0, fail = 0;
  for (const row of rows) {
    let a; try { a = await store.get('answers/' + row.id + '.json', { type: 'json' }); } catch (e) { failures[row.id] = { failed: ['C0_missing'], detail: e.message }; fail++; continue; }
    const r = await auditEntry(row.id, Object.assign({}, a, { question: row.question, format_v: (a && a.format_v) }), idx.entries || []);
    if (r.pass) { pass++; registry[row.id] = { clean: true, ts: new Date().toISOString(), template: r.template }; }
    else { fail++; failures[row.id] = { template: r.template, failed: r.failed, detail: r.detail }; if (registry[row.id]) delete registry[row.id]; }
    console.log((r.pass ? '✓ ' : '✗ ') + row.id + ' [' + r.template + ']' + (r.pass ? ' PASS' : ' ' + r.failed.join(',')));
  }
  fs.writeFileSync(FAILURES_F, JSON.stringify(failures, null, 2));
  fs.writeFileSync(REGISTRY_F, JSON.stringify(registry, null, 2));
  console.log('\n=== AUDIT ' + PILLAR + ' · pass ' + pass + ' · fail ' + fail + ' · manifest → _mv_failures.json (' + Object.keys(failures).length + ' entries) ===');
  if (fail === 0) console.log('🎉 DONE — zero failures for target set.');
})().catch(e => { console.error('FATAL', e && e.message); process.exitCode = 1; });
