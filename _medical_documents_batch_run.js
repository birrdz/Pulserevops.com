'use strict';
/**
 * Medical Documents Batch Extractor — CLI (Gemini Flash Lite).
 * Usage: node _medical_documents_batch_run.js [--dir=path] [--batch=48] [--limit=N]
 *
 * Checkpoint CSV + PROGRESS after every batch. Fully resumable — skips files
 * whose output JSON already has ok:true.
 */
const fs = require('fs');
const path = require('path');

const WD = __dirname;
const BATCH = parseInt((process.argv.find((a) => a.startsWith('--batch=')) || '').split('=')[1] || '48', 10);
const LIMIT = parseInt((process.argv.find((a) => a.startsWith('--limit=')) || '').split('=')[1] || '999999', 10);
const IN_DIR = (() => {
  const arg = (process.argv.find((a) => a.startsWith('--dir=')) || '').split('=')[1];
  return path.resolve(arg || path.join(WD, '_medical_docs_in'));
})();
const OUT_DIR = path.join(WD, '_medical_documents_out');
const CHECKPOINT_CSV = path.join(WD, '_medical_documents_checkpoint.csv');
const PROGRESS_JSON = path.join(WD, '_medical_documents_progress.json');
const STOP = path.join(WD, '_medical_documents_batch_stop.flag');

for (const line of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const {
  extractMedicalDocument,
  mimeForFilename,
} = require('./netlify/functions/lib/medical-document-extract-lib');

const ALLOWED = new Set(['.pdf', '.png', '.jpg', '.jpeg', '.webp', '.tif', '.tiff', '.txt']);

function csvEsc(s) {
  const t = String(s == null ? '' : s);
  if (/[",\r\n]/.test(t)) return '"' + t.replace(/"/g, '""') + '"';
  return t;
}

function appendCheckpoint(row) {
  const header = 'at,filename,status,model,error\n';
  if (!fs.existsSync(CHECKPOINT_CSV)) fs.writeFileSync(CHECKPOINT_CSV, header);
  fs.appendFileSync(
    CHECKPOINT_CSV,
  [row.at, row.filename, row.status, row.model || '', row.error || ''].map(csvEsc).join(',') + '\n',
  );
}

function writeProgress(p) {
  fs.writeFileSync(PROGRESS_JSON, JSON.stringify(p, null, 2));
}

function outPathFor(file) {
  const base = path.basename(file, path.extname(file));
  return path.join(OUT_DIR, base + '.json');
}

function alreadyDone(file) {
  const op = outPathFor(file);
  if (!fs.existsSync(op)) return false;
  try {
    const j = JSON.parse(fs.readFileSync(op, 'utf8'));
    return !!(j && j.ok);
  } catch (e) {
    return false;
  }
}

function listInputFiles() {
  if (!fs.existsSync(IN_DIR)) {
    fs.mkdirSync(IN_DIR, { recursive: true });
    return [];
  }
  return fs
    .readdirSync(IN_DIR)
    .filter((f) => ALLOWED.has(path.extname(f).toLowerCase()))
    .map((f) => path.join(IN_DIR, f))
    .sort();
}

async function processFile(file) {
  const filename = path.basename(file);
  const ext = path.extname(file).toLowerCase();
  const mimeType = mimeForFilename(filename);
  let base64;
  let textFallback;
  if (ext === '.txt') {
    textFallback = fs.readFileSync(file, 'utf8');
  } else {
    base64 = fs.readFileSync(file).toString('base64');
  }
  const result = await extractMedicalDocument({
    filename,
    mimeType,
    base64,
    textFallback,
  });
  result.source_file = filename;
  result.status = 'ok';
  fs.writeFileSync(outPathFor(file), JSON.stringify(result, null, 2));
  return result;
}

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const all = listInputFiles();
  const todo = all.filter((f) => !alreadyDone(f)).slice(0, LIMIT);
  const skipped = all.length - all.filter((f) => !alreadyDone(f)).length;

  console.log('[medical-batch] in=' + IN_DIR + ' total=' + all.length + ' todo=' + todo.length);
  if (!todo.length) {
    writeProgress({
      at: new Date().toISOString(),
      done: all.length,
      total: all.length,
      skipped,
      status: 'nothing_todo',
    });
    console.log('[medical-batch] nothing to do');
    return;
  }

  let done = all.length - todo.length;
  let batchCount = 0;
  const startedAt = Date.now();

  for (let i = 0; i < todo.length; i++) {
    if (fs.existsSync(STOP)) {
      console.log('[medical-batch] stop flag');
      break;
    }
    const file = todo[i];
    const filename = path.basename(file);
    try {
      const r = await processFile(file);
      done++;
      batchCount++;
      appendCheckpoint({
        at: new Date().toISOString(),
        filename,
        status: 'ok',
        model: r.model,
        error: '',
      });
      console.log('  ✓', done + '/' + all.length, filename, '·', r.model);
    } catch (e) {
      batchCount++;
      appendCheckpoint({
        at: new Date().toISOString(),
        filename,
        status: 'fail',
        model: '',
        error: String(e.message || e).slice(0, 200),
      });
      console.log('  ✗', filename, e.message);
    }

    if (batchCount >= BATCH || i === todo.length - 1) {
      writeProgress({
        at: new Date().toISOString(),
        done,
        total: all.length,
        remaining: all.length - done,
        batch_size: BATCH,
        last_file: filename,
        elapsed_sec: Math.round((Date.now() - startedAt) / 1000),
        in_dir: IN_DIR,
        out_dir: OUT_DIR,
      });
      console.log('[medical-batch] checkpoint batch · done=' + done + '/' + all.length);
      batchCount = 0;
    }
  }

  writeProgress({
    at: new Date().toISOString(),
    done,
    total: all.length,
    remaining: all.length - done,
    finished: true,
    elapsed_sec: Math.round((Date.now() - startedAt) / 1000),
  });
  console.log('[medical-batch] finished · ' + done + '/' + all.length);
})().catch((e) => {
  console.error('[medical-batch] FATAL', e.message);
  process.exit(1);
});
