// One-off: strip duplicate markdown images from ranking entry and re-save.
// Usage: node _fix_rank_dup_images.js [--id=aq1162] [--dry-run]
for (const l of require('fs').readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const args = process.argv.slice(2);
const ONE = (args.find(a => a.startsWith('--id=')) || '').split('=')[1] || 'aq1162';
const DRY = args.includes('--dry-run');

const { getStore } = require('@netlify/blobs');
const {
  rebuildRankingProductImages,
  saveRankingEntry,
  spotCheckEntry,
  FORMAT_V_IMAGES,
} = require('./_ranking_list_rebuild_lib');
const {
  auditRankingListMaster,
  stripRankSectionMarkdownImages,
  expectedRankCount,
  auditRankSectionImageLaw,
} = require('./_ranking_list_master_law');

const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const existing = await store.get('answers/' + ONE + '.json', { type: 'json' });
  const title = existing.question || '';
  const before = existing.answer || '';
  const expected = expectedRankCount(before, title);

  console.log('ID:', ONE, 'title:', title);
  console.log('URL: https://pulserevops.com/aquariums/' + ONE);
  console.log('expected ranks:', expected);
  for (let r = 1; r <= expected; r++) {
    const issues = auditRankSectionImageLaw(before, r);
    if (issues.length) console.log('BEFORE rank' + r + ':', issues.join(', '));
  }

  const stripped = stripRankSectionMarkdownImages(before, expected);
  const body = await rebuildRankingProductImages(ONE, title, stripped, {});
  const audit = auditRankingListMaster(body, title);
  const check = await spotCheckEntry(ONE, body, title);

  console.log('master compliant:', audit.compliant, audit.issues);
  console.log('spot pass:', check.pass, 'grade:', check.grade);

  if (DRY) {
    console.log('DRY RUN — not saving');
    return;
  }

  await saveRankingEntry(store, idx, ONE, title, body, existing, FORMAT_V_IMAGES);
  await store.setJSON('_index.json', idx);
  console.log('Saved', ONE);
})().catch(e => { console.error(e); process.exit(1); });
