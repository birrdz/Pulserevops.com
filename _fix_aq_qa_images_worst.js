// Fix top N worst aq Q&A image offenders from _aq_qa_image_audit.json
// Usage: node _fix_aq_qa_images_worst.js [--top=10]
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const REPORT_F = WD + '/_aq_qa_image_audit.json';
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const { getStore } = require('@netlify/blobs');
const { fillEntryMissingImages, isBrokenQaImageUrl, bodyPageImageUrls } = require('./_ddg_facecard_lib');
const { rebuildEssayOccasionalImages } = require('./_answer_occasional_images_lib');
const { ensureDirectAnswerAfterHero } = require('./_format_fixer_lib');
const { stripAllCroFromBody } = require('./_cro_strip_lib');

const TOP = parseInt((process.argv.find(a => a.startsWith('--top=')) || '--top=10').split('=')[1], 10) || 10;

(async () => {
  const report = JSON.parse(fs.readFileSync(REPORT_F, 'utf8'));
  const worst = (report.worst || []).slice(0, TOP);
  if (!worst.length) throw new Error('No worst entries in report — run _audit_aq_qa_images.js first');

  const store = getStore({
    name: 'pulse-machine-library',
    siteID: SITE,
    token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
  });
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const results = [];

  for (const item of worst) {
    const id = item.id;
    console.log('\n--- FIX', id, 'severity=' + item.severity, '---');
    try {
      const e = await store.get('answers/' + id + '.json', { type: 'json' });
      if (!e || !e.answer) {
        results.push({ id, ok: false, error: 'no blob' });
        continue;
      }
      const title = e.question || item.title;
      let body = stripAllCroFromBody(e.answer);
      const beforeBroken = [...bodyPageImageUrls(body)].filter(u => isBrokenQaImageUrl(u, id, {})).length;

      const filled = await fillEntryMissingImages(id, title, body, {
        upgradeMode: true,
        pollinatorPrefer: true,
        onProgress: (m) => console.log('  ' + m),
      });
      body = filled.body || body;
      body = ensureDirectAnswerAfterHero(body);

      const rebuilt = await rebuildEssayOccasionalImages(id, title, body, {});
      body = rebuilt.body || body;
      body = ensureDirectAnswerAfterHero(stripAllCroFromBody(body));

      const afterBroken = [...bodyPageImageUrls(body)].filter(u => isBrokenQaImageUrl(u, id, {})).length;
      const heroM = body.match(/^!\[[^\]]*\]\(([^)]+)\)/);
      const entry = Object.assign({}, e, {
        answer: body,
        polished_at: Date.now(),
        cover_src: heroM ? 'inline-hero' : 'no-hero',
      });
      await store.setJSON('answers/' + id + '.json', entry);

      const i = (idx.entries || []).findIndex(r => r && r.id === id);
      if (i >= 0) {
        idx.entries[i] = Object.assign({}, idx.entries[i], {
          img: heroM ? heroM[1] : '',
          cover_src: entry.cover_src,
          polished_at: Date.now(),
        });
      }

      results.push({
        id,
        ok: true,
        beforeBroken,
        afterBroken,
        beforeImages: item.imageCount,
        afterImages: (body.match(/!\[[^\]]*\]\([^)]+\)/g) || []).length,
        fixedSlots: filled.fixed || 0,
        hero: heroM ? heroM[1].slice(0, 80) : '',
      });
      console.log('  OK beforeBroken=' + beforeBroken + ' afterBroken=' + afterBroken + ' fixed=' + (filled.fixed || 0));
    } catch (err) {
      console.error('  ERR', err.message);
      results.push({ id, ok: false, error: err.message });
    }
  }

  await store.setJSON('_index.json', idx);
  const outF = WD + '/_aq_qa_image_fix_results.json';
  fs.writeFileSync(outF, JSON.stringify({ at: new Date().toISOString(), top: TOP, results }, null, 2));
  console.log('\nFixed', results.filter(r => r.ok).length, '/', results.length);
  console.log('Wrote', outF);
})().catch(err => {
  console.error('FATAL', err && err.stack ? err.stack : err);
  process.exit(1);
});
