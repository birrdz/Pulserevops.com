// Publish review-mirror Q&A entries (separate id = sourceId + "rv").
// Progress email: start, every 10, complete.
//
// Usage:
//   node _mirror_reviews_run.js --limit 3
//   node _mirror_reviews_run.js --dry-run
//   node _mirror_reviews_run.js --ids q10419,q10500
const fs = require('fs');
const path = require('path');
const { createBatchProgressReporter } = require('./netlify/functions/lib/progress-email');
const {
  getStoreClient,
  publishMirror,
  scanMirrorQueue,
  mirrorIdFor,
} = require('./_mirror_reviews_lib');

const QUEUE_PATH = path.join(__dirname, '_mirror_reviews_queue.json');
const DRY = process.argv.includes('--dry-run');
const LIMIT = (() => {
  const i = process.argv.indexOf('--limit');
  return i >= 0 ? parseInt(process.argv[i + 1], 10) : 0;
})();
const IDS = (() => {
  const i = process.argv.indexOf('--ids');
  if (i < 0) return null;
  return process.argv[i + 1].split(',').map((s) => s.trim()).filter(Boolean);
})();

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  let queue;
  if (fs.existsSync(QUEUE_PATH)) {
    queue = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
  } else {
    queue = await scanMirrorQueue();
    fs.writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2));
  }

  let work = queue.eligible || [];
  if (IDS && IDS.length) {
    const want = new Set(IDS);
    work = work.filter((w) => want.has(w.sourceId));
    for (const id of IDS) {
      if (!work.find((w) => w.sourceId === id)) {
        work.push({
          sourceId: id,
          mirrorId: mirrorIdFor(id),
          question: '(from --ids)',
        });
      }
    }
  }
  if (LIMIT > 0) work = work.slice(0, LIMIT);

  const total = work.length;
  if (!total) {
    console.log(JSON.stringify({ ok: true, message: 'nothing to publish', counts: queue.counts }, null, 2));
    return;
  }

  const progress = createBatchProgressReporter({
    label: 'PULSE review-mirror Q&A batch',
    total,
    interval: 10,
    pillarUrl: 'https://pulserevops.com/knowledge',
  });

  await progress.start(
    `<p>Starting review-mirror publish (${total} entries)${DRY ? ' <b>DRY RUN</b>' : ''}</p>` +
      `<p>SEO: unique review body, <code>noindex,follow</code>, canonical → original</p>`
  );

  const store = getStoreClient();
  const results = [];
  let done = 0;
  let failed = 0;
  let skipped = 0;

  for (const item of work) {
    const sourceId = item.sourceId;
    let sourceEntry;
    try {
      sourceEntry = await store.get(`answers/${sourceId}.json`, { type: 'json' });
    } catch (_) {}
    if (!sourceEntry) {
      failed++;
      await progress.fail(`${sourceId}: source blob missing`);
      results.push({ sourceId, ok: false, reason: 'no_source_blob' });
      continue;
    }

    const sourceRow = {
      id: sourceId,
      question: item.question || sourceEntry.question,
      tags: item.tags || sourceEntry.tags,
    };

    if (DRY) {
      done++;
      results.push({ sourceId, mirrorId: item.mirrorId, ok: true, dry: true });
      if (done % 10 === 0) await progress.tick(`${sourceId} (dry)`);
      continue;
    }

    const r = await publishMirror(store, sourceRow, sourceEntry);
    if (r.skipped) {
      skipped++;
      done++;
      results.push(r);
      if (done % 10 === 0) await progress.tick(`${r.id} skipped`);
    } else if (r.ok) {
      done++;
      results.push(r);
      console.log(JSON.stringify({ published: r.id, url: r.url, words: r.words }, null, 2));
      if (done % 10 === 0) await progress.tick(`${r.id} published`);
    } else {
      failed++;
      await progress.fail(`${sourceId}: ${r.reason || r.error || 'fail'}`);
      results.push(r);
    }

    await sleep(1200);
  }

  const summary = {
    ok: failed === 0,
    dry: DRY,
    total,
    published: results.filter((r) => r.ok && !r.skipped && !r.dry).length,
    skipped,
    failed,
    last: results.slice(-5),
  };

  fs.writeFileSync(
    path.join(__dirname, '_mirror_reviews_run_report.json'),
    JSON.stringify({ ...summary, results, at: new Date().toISOString() }, null, 2)
  );

  await progress.complete(
  );

  console.log(JSON.stringify(summary, null, 2));
})().catch(async (e) => {
  console.error(e);
  try {
    const { createBatchProgressReporter } = require('./netlify/functions/lib/progress-email');
    const p = createBatchProgressReporter({ label: 'PULSE review-mirror Q&A batch', total: 1, interval: 10 });
    await p.start('<p>Fatal error</p>');
    await p.fail(e.message);
    await p.complete();
  } catch (_) {}
  process.exit(1);
});
