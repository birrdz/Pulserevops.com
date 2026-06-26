// HF → Wellness pillar SEO batch: generate stacks, sync hubs, optimize blobs.
// Usage: node _pillar_hf_wellness_seo_batch.js [--dry-run] [--generate-only] [--prefix=hf]
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { loadEnv } = require('./netlify/functions/lib/load-env');
const { generateStack } = require('./_pillar_seo_factory');
const { HF_WELLNESS_BATCH, ALREADY_STACKED } = require('./_pillar_hf_wellness_specs');
const { createBatchProgressReporter } = require('./netlify/functions/lib/progress-email');

loadEnv(__dirname);

const ROOT = __dirname;
const DRY = process.argv.includes('--dry-run');
const GENERATE_ONLY = process.argv.includes('--generate-only');
const PREFIX_ARG = (process.argv.find((a) => a.startsWith('--prefix=')) || '').split('=')[1];

const BATCH = PREFIX_ARG ? [PREFIX_ARG] : HF_WELLNESS_BATCH;
const RESTACK = ALREADY_STACKED;

function upper(prefix) {
  return String(prefix).toUpperCase();
}

function updateRegistry(prefixes) {
  const regPath = path.join(ROOT, '_pillar_seo_registry.js');
  let src = fs.readFileSync(regPath, 'utf8');
  for (const prefix of prefixes) {
    const key = prefix.toLowerCase();
    if (src.includes(`${key}: {`)) continue;
    const P = upper(key);
    const block = `  ${key}: {
    phrasesPath: '_${key}_keyword_phrases.json',
    competeModule: '_${key}_compete_semantic_keywords.js',
    hubPath: '_${key}_seo_sync_hub.js',
    keywordPhrasesExport: '${P}_KEYWORD_PHRASES',
  },`;
    src = src.replace(/(\n};)/, `\n${block}$1`);
  }
  if (!DRY) fs.writeFileSync(regPath, src);
}

function runNode(script, args = '') {
  const cmd = `node "${path.join(ROOT, script)}" ${args}`.trim();
  execSync(cmd, { cwd: ROOT, stdio: 'inherit', env: process.env });
}

(async () => {
  const total = BATCH.length + RESTACK.length;
  const progress = createBatchProgressReporter({
    label: 'PULSE pillar SEO HF→Wellness',
    total,
    pillarUrl: 'https://pulserevops.com/',
  });

  if (!DRY) {
    await progress.start(
      `<p>Starting HF→Wellness pillar SEO batch.</p><p>Generate: <b>${BATCH.join(', ')}</b></p><p>Re-optimize: <b>${RESTACK.join(', ')}</b></p>`
    );
  }

  let done = 0;
  const results = [];

  for (const prefix of BATCH) {
    try {
      const gen = generateStack(prefix);
      results.push({ prefix, step: 'generate', ok: true, phrases: gen.phrases });
      if (!DRY) await progress.tick(`${prefix}: generated ${gen.phrases} phrases`);
      done++;

      if (!GENERATE_ONLY && !DRY) {
        runNode(`_${prefix}_seo_sync_hub.js`);
        runNode(`_${prefix}_seo_optimize.js`);
        results.push({ prefix, step: 'sync+optimize', ok: true });
        if (!DRY) await progress.tick(`${prefix}: hub synced + blobs optimized`);
      }
    } catch (err) {
      results.push({ prefix, ok: false, error: String(err.message || err) });
      if (!DRY) await progress.fail(`${prefix}: ${err.message || err}`);
    }
  }

  if (!GENERATE_ONLY) {
    updateRegistry(BATCH);
    for (const prefix of RESTACK) {
      try {
        if (fs.existsSync(path.join(ROOT, `_${prefix}_seo_sync_hub.js`))) {
          runNode(`_${prefix}_seo_sync_hub.js`);
        }
        if (fs.existsSync(path.join(ROOT, `_${prefix}_seo_optimize.js`))) {
          runNode(`_${prefix}_seo_optimize.js`, DRY ? '--dry-run' : '');
        }
        results.push({ prefix, step: 'restack', ok: true });
        done++;
        if (!DRY) await progress.tick(`${prefix}: re-optimized (existing stack)`);
      } catch (err) {
        results.push({ prefix, step: 'restack', ok: false, error: String(err.message || err) });
        if (!DRY) await progress.fail(`${prefix} restack: ${err.message || err}`);
      }
    }
  }

  const report = { ok: true, dry: DRY, generateOnly: GENERATE_ONLY, batch: BATCH, restack: RESTACK, results, done, total };
  fs.writeFileSync(path.join(ROOT, '_pillar_hf_wellness_seo_batch_report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));

  if (!DRY) {
    await progress.complete(`<p>HF→Wellness SEO batch complete.</p><p>Done: <b>${done}</b> / ${total}</p>`);
  }
})().catch(async (e) => {
  console.error(e);
  process.exit(1);
});
