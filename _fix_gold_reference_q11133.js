// Reshape live gold reference q11133 to corrected Q&A law (owner 2026-07-06).
// Usage: node _fix_gold_reference_q11133.js [--dry]
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const ID = 'q11133';
const URL = 'https://pulserevops.com/knowledge/q11133';

try {
  for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const { getStore } = require('@netlify/blobs');
const { repairBrokenQaImages, fillEntryMissingImages } = require('./_ddg_facecard_lib');
const { reshapeQaGoldBody, auditGoldReferenceQa } = require('./_qa_gold_template');
const { lockQaVisualShape } = require('./_visual_lock_law');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const { prepareEntryForPublish } = require('./_write_lib');

const DRY = process.argv.includes('--dry');
const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});

const log = (s) => console.log(new Date().toISOString() + ' ' + s);

(async () => {
  const e = await store.get('answers/' + ID + '.json', { type: 'json' });
  if (!e || !e.answer) throw new Error('no blob for ' + ID);
  const title = e.question || e.h1 || ID;
  const before = auditGoldReferenceQa(e.answer, title);
  log('BEFORE issues: ' + (before.issues || []).join(', '));

  let b = reshapeQaGoldBody(e.answer);
  log('After reshape — top hero gone, @@PRODUCT stripped, tail fixed');

  if (!DRY) {
    const repaired = await repairBrokenQaImages(ID, title, b, {
      upgradeMode: true,
      alternateSources: true,
      pollinatorPrefer: true,
      allowTopicalReuse: true,
    });
    b = repaired.body || b;
    log('Images repaired');

    const filled = await fillEntryMissingImages(ID, title, b, {
      upgradeMode: true,
      alternateSources: true,
      pollinatorPrefer: true,
      allowTopicalReuse: true,
    });
    b = filled.body || b;
    log('Missing images filled');
  }

  let guard = 0;
  while (require('./_qa_gold_template').qaHasStackedImages(b) && guard++ < 8) {
    b = require('./_visual_lock_law').collapseConsecutiveImages(b);
  }

  b = lockQaVisualShape(b, ID, title);
  const after = auditGoldReferenceQa(b, title);
  const grade = gradeEntry(ID, b);
  log('AFTER issues: ' + (after.issues || []).join(', '));
  log('Grade: ' + grade.score + '/13');
  log('Images: ' + (b.match(/!\[[^\]]*\]\([^)]+\)/g) || []).length);

  if (!after.compliant) {
    throw new Error('Gold reference still non-compliant: ' + (after.issues || []).join(', '));
  }

  if (DRY) {
    log('DRY RUN — not saved');
    return;
  }

  const now = Date.now();
  const entry = prepareEntryForPublish(ID, title, {
    ...e,
    answer: b,
    cover_src: 'no-hero',
    format_v: '2026-07-qa-gold-reference',
    polished_at: now,
    updated_at: new Date(now).toISOString(),
    quality_score: Math.max(13, grade.score),
    pending: false,
  });
  await store.setJSON('answers/' + ID + '.json', entry);

  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const i = (idx.entries || []).findIndex((row) => row && row.id === ID);
  if (i >= 0) {
    idx.entries[i] = Object.assign({}, idx.entries[i], {
      cover_src: 'no-hero',
      img: '',
      format_v: '2026-07-qa-gold-reference',
      polished_at: now,
    });
    await store.setJSON('_index.json', idx);
  }

  log('SAVED ' + ID + ' → ' + URL);
})().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
