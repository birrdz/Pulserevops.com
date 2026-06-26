/**
 * Site-wide typo copyedit — every indexed library answer on all public pages:
 *   /knowledge/{q|vq}  /sales-trainings/{st}  /industry-kpis/{ik}
 *
 * Walk order: knowledge + visitor (newest ts first), then trainings, then KPIs.
 *
 *   node _library_typo_audit.js [--dry-run] [--limit=N] [--offset=N] [--resume]
 *   node _library_typo_audit.js --until-done   # auto-resume batches until finished
 *
 * Env: BLOBS_PAT, GEMINI_API_KEY (or in .env.local)
 */
const fs = require('fs');
const https = require('https');
const { getStore } = require('@netlify/blobs');
const { libraryEntryPublicUrl } = require('./netlify/functions/lib/library-entry-url');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const PROGRESS_FILE = '_typo_audit_progress.json';
const BLOB_PROGRESS = '_typo_audit_progress.json';
const MODEL = 'gemini-2.5-flash';
const PAUSE_MS = 2200;
const BATCH_DEFAULT = 0; // 0 = no limit (full run)
const ANSWER_SLICE = 28000;

const INDEXABLE_RE = /^(?:q\d+|st\d+|ik\d+|vq_[a-z0-9]+)$/i;

const DRY = process.argv.includes('--dry-run');
const RESUME = process.argv.includes('--resume') || process.argv.includes('--until-done');
const UNTIL_DONE = process.argv.includes('--until-done');
const limitArg = process.argv.find((a) => a.startsWith('--limit='));
const offsetArg = process.argv.find((a) => a.startsWith('--offset='));
const pillarArg = process.argv.find((a) => a.startsWith('--pillar='));
const LIMIT = limitArg ? parseInt(limitArg.split('=')[1], 10) : BATCH_DEFAULT;
const OFFSET = offsetArg ? parseInt(offsetArg.split('=')[1], 10) : 0;
const PILLAR_FILTER = pillarArg ? pillarArg.split('=')[1].toLowerCase() : 'all';

function loadPat() {
  if (process.env.BLOBS_PAT) return process.env.BLOBS_PAT.trim();
  const env = fs.readFileSync('.env.local', 'utf8');
  const m = env.match(/^BLOBS_PAT=(.+)$/m);
  if (!m) throw new Error('BLOBS_PAT missing');
  return m[1].trim();
}

function loadGeminiKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY.trim();
  try {
    const env = fs.readFileSync('.env.local', 'utf8');
    const m = env.match(/^GEMINI_API_KEY=(.+)$/m);
    if (m) return m[1].trim();
  } catch (_e) {}
  throw new Error('GEMINI_API_KEY missing');
}

function entryPillar(e) {
  const id = String(e.id || '');
  if (/^st\d+$/i.test(id) || (e.tags || []).includes('sales-training')) return 'training';
  if (/^ik\d+$/i.test(id) || (e.tags || []).includes('industry-kpi')) return 'kpi';
  if (/^vq_/i.test(id) || e.source === 'visitor') return 'visitor';
  return 'knowledge';
}

function pillarRank(p) {
  if (p === 'knowledge' || p === 'visitor') return 0;
  if (p === 'training') return 1;
  if (p === 'kpi') return 2;
  return 3;
}

function buildWorklist(indexEntries) {
  let rows = (indexEntries || []).filter((e) => e && INDEXABLE_RE.test(e.id));
  if (PILLAR_FILTER !== 'all') {
    rows = rows.filter((e) => {
      const p = entryPillar(e);
      if (PILLAR_FILTER === 'knowledge') return p === 'knowledge' || p === 'visitor';
      return p === PILLAR_FILTER;
    });
  }
  rows.sort((a, b) => {
    const pr = pillarRank(entryPillar(a)) - pillarRank(entryPillar(b));
    if (pr !== 0) return pr;
    return (b.ts || 0) - (a.ts || 0);
  });
  return rows;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function geminiCopyedit(question, answer, pillar) {
  return new Promise((resolve, reject) => {
    const key = loadGeminiKey();
    const system = `You are a careful copy editor for Pulse RevOps public library pages (${pillar}: knowledge Q&A, sales trainings, or industry KPIs).
Fix ONLY: spelling typos, grammar slips, doubled words, wrong homophones, broken punctuation, obvious wrong vendor names (e.g. Saleforce→Salesforce).
Do NOT: change meaning, delete sections, add sections, rewrite for style, change numbers, remove mermaid/diagram blocks, or shorten below 95% of original length.
Return ONLY valid JSON: {"changed":true|false,"answer":"..."}
If nothing needs fixing, {"changed":false,"answer":""}`;
    const user = 'Page type: ' + pillar + '\nTitle/question: ' + question
      + '\n\nAnswer markdown:\n\n' + answer.slice(0, ANSWER_SLICE);
    const payload = JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: 'user', parts: [{ text: user }] }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 8192 },
    });
    const opts = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(key)}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
      timeout: 120000,
    };
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            return reject(new Error('gemini ' + res.statusCode + ': ' + data.slice(0, 240)));
          }
          const parsed = JSON.parse(data);
          const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!text) return reject(new Error('gemini empty'));
          const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
          resolve(JSON.parse(cleaned));
        } catch (e) {
          reject(new Error('parse: ' + e.message + ' · ' + data.slice(0, 200)));
        }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.write(payload);
    req.end();
  });
}

function loadLocalProgress() {
  try {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  } catch (_e) {
    return { cursor: 0, fixed: 0, skipped: 0, unchanged: 0, failed: 0, ids: [], by_pillar: {} };
  }
}

function saveLocalProgress(p) {
  p.last_run_ms = Date.now();
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(p, null, 2));
}

async function runBatch(store, rows, prog, start, batchLimit) {
  const end = batchLimit ? Math.min(start + batchLimit, rows.length) : rows.length;
  const slice = rows.slice(start, end);

  await store.setJSON(BLOB_PROGRESS, {
    scope: 'all-pages',
    pillars: ['knowledge', 'visitor', 'training', 'kpi'],
    total: rows.length,
    cursor: start,
    in_progress: true,
    fixed: prog.fixed,
    unchanged: prog.unchanged,
    failed: prog.failed,
    skipped: prog.skipped,
    last_run_ms: Date.now(),
  });

  for (let i = 0; i < slice.length; i++) {
    const row = slice[i];
    const cursor = start + i;
    const pillar = entryPillar(row);
    const url = libraryEntryPublicUrl(row) || ('https://pulserevops.com/knowledge/' + row.id);

    const e = await store.get('answers/' + row.id + '.json', { type: 'json' });
    if (!e || !e.answer || e.answer.length < 80) {
      prog.skipped++;
      prog.cursor = cursor + 1;
      continue;
    }

    if ((i + 1) % 5 === 0 || i === 0) {
      console.log('[' + (cursor + 1) + '/' + rows.length + '] ' + row.id + ' (' + pillar + ') ' + url);
    }

    const question = e.question || row.question || row.id;
    let result;
    try {
      result = await geminiCopyedit(question, e.answer, pillar);
    } catch (err) {
      prog.failed++;
      prog.by_pillar = prog.by_pillar || {};
      prog.by_pillar[pillar] = prog.by_pillar[pillar] || { fixed: 0, failed: 0 };
      prog.by_pillar[pillar].failed++;
      console.warn('  FAIL ' + row.id + ': ' + (err.message || err));
      prog.cursor = cursor + 1;
      saveLocalProgress(prog);
      await sleep(PAUSE_MS);
      continue;
    }

    const unchanged = () => {
      prog.unchanged++;
      prog.cursor = cursor + 1;
      if ((i + 1) % 20 === 0) saveLocalProgress(prog);
    };

    if (!result.changed || !result.answer || result.answer.length < e.answer.length * 0.92) {
      unchanged();
      await sleep(PAUSE_MS);
      continue;
    }
    if (result.answer.trim() === e.answer.trim()) {
      unchanged();
      await sleep(PAUSE_MS);
      continue;
    }
    if (!/```mermaid/.test(result.answer) && /```mermaid/.test(e.answer)) {
      prog.failed++;
      console.warn('  SKIP ' + row.id + ': mermaid stripped');
      prog.cursor = cursor + 1;
      await sleep(PAUSE_MS);
      continue;
    }

    prog.by_pillar = prog.by_pillar || {};
    prog.by_pillar[pillar] = prog.by_pillar[pillar] || { fixed: 0, failed: 0 };

    if (DRY) {
      prog.fixed++;
      prog.by_pillar[pillar].fixed++;
      prog.ids.push(row.id);
      console.log('  [dry] would fix ' + row.id);
    } else {
      e.answer = result.answer;
      e.typo_audit_at = Date.now();
      e.typo_audit_note = 'site-wide-copyedit-' + MODEL;
      await store.setJSON('answers/' + row.id + '.json', e);
      prog.fixed++;
      prog.by_pillar[pillar].fixed++;
      prog.ids.push(row.id);
      console.log('  FIXED ' + row.id);
    }

    prog.cursor = cursor + 1;
    saveLocalProgress(prog);
    await store.setJSON(BLOB_PROGRESS, {
      scope: 'all-pages',
      total: rows.length,
      cursor: prog.cursor,
      in_progress: prog.cursor < rows.length,
      fixed: prog.fixed,
      unchanged: prog.unchanged,
      failed: prog.failed,
      skipped: prog.skipped,
      by_pillar: prog.by_pillar,
      last_id: row.id,
      last_url: url,
      last_run_ms: Date.now(),
    });
    await sleep(PAUSE_MS);
  }

  return prog.cursor >= rows.length;
}

async function main() {
  const token = loadPat();
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const rows = buildWorklist(idx.entries);

  const prog = RESUME ? loadLocalProgress() : {
    cursor: 0, fixed: 0, skipped: 0, unchanged: 0, failed: 0, ids: [], by_pillar: {},
  };
  let start = RESUME ? prog.cursor : OFFSET;
  if (OFFSET && !RESUME) start = OFFSET;

  const counts = { knowledge: 0, visitor: 0, training: 0, kpi: 0 };
  for (const r of rows) counts[entryPillar(r)] = (counts[entryPillar(r)] || 0) + 1;

  console.log(JSON.stringify({
    mode: DRY ? 'dry-run' : 'live',
    scope: 'all-pages (q, vq_, st, ik)',
    pillar_filter: PILLAR_FILTER,
    total_indexed: rows.length,
    counts,
    start,
    batch_limit: LIMIT || 'all remaining',
    until_done: UNTIL_DONE,
  }, null, 2));

  if (!rows.length) {
    console.log('No indexable entries.');
    return;
  }

  do {
    const done = await runBatch(store, rows, prog, start, LIMIT || 0);
    if (done || DRY) break;
    start = prog.cursor;
    if (UNTIL_DONE && prog.cursor < rows.length) {
      console.log('\n--- resuming at ' + prog.cursor + ' / ' + rows.length + ' ---\n');
      await sleep(3000);
    } else {
      break;
    }
  } while (UNTIL_DONE && prog.cursor < rows.length);

  await store.setJSON(BLOB_PROGRESS, {
    scope: 'all-pages',
    total: rows.length,
    cursor: prog.cursor,
    in_progress: prog.cursor < rows.length,
    fixed: prog.fixed,
    unchanged: prog.unchanged,
    failed: prog.failed,
    skipped: prog.skipped,
    by_pillar: prog.by_pillar,
    complete: prog.cursor >= rows.length,
    last_run_ms: Date.now(),
  });

  console.log('\n=== TYPO AUDIT ' + (prog.cursor >= rows.length ? 'COMPLETE' : 'BATCH PAUSED') + ' ===');
  console.log(JSON.stringify(prog, null, 2));
  if (prog.cursor < rows.length) {
    console.log('Resume: node _library_typo_audit.js --resume');
    console.log('Or:    node _library_typo_audit.js --until-done');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
