// Coaching test run — 50 entries, 1:1 Top-10 + general Q&A, TEXT-FIRST via DeepSeek.
// LAW: DeepSeek writes all text now; images come later via Claude Code.
// Usage: node _cg_testrun50.js [--limit=N] [--dry-run]
const fs = require('fs');
const { execSync } = require('child_process');
const { generateGradedBody } = require('./_cg_ds_gen');

const Q = JSON.parse(fs.readFileSync('C:/Users/koryj/website/_cg_testrun50.json', 'utf8'));
const PROG = 'C:/Users/koryj/website/_cg_testrun50_progress.json';
const LOG = 'C:/Users/koryj/website/_cg_testrun50.log';
const NORM = JSON.parse(fs.readFileSync('C:/Users/koryj/website/_cg_all_titles_norm.json', 'utf8'));
const seen = new Set(NORM);

const DRY = process.argv.includes('--dry-run');
const limitArg = process.argv.find((a) => /^--limit=\d+$/.test(a));
const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : 0;

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);

// Interleave QA + Top10 (1:1), assign sequential IDs from startId.
function buildQueue() {
  const items = [];
  let n = Q.startId;
  const max = Math.max(Q.qa.length, Q.top10.length);
  for (let i = 0; i < max; i++) {
    if (Q.qa[i]) items.push({ id: `cg${String(n++).padStart(4, '0')}`, kind: 'qa', title: Q.qa[i] });
    if (Q.top10[i]) items.push({ id: `cg${String(n++).padStart(4, '0')}`, kind: 'top10', title: Q.top10[i] });
  }
  return items;
}

function log(line) { fs.appendFileSync(LOG, line + '\n'); console.log(line); }

function loadProg() { return fs.existsSync(PROG) ? JSON.parse(fs.readFileSync(PROG, 'utf8')) : { done: [], updated: '' }; }
function saveProg(p) { fs.writeFileSync(PROG, JSON.stringify(p, null, 2)); }

const EMAIL_URL = 'https://pulserevops.com/.netlify/functions/pulse-progress-notify?key=pulsemachine-writer-2026';
async function email(subject, html) {
  try {
    await fetch(EMAIL_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject, html }) });
  } catch (e) { /* non-fatal */ }
}

function publishTextFirst(id, title, slugStr, body) {
  fs.writeFileSync(`C:/Users/koryj/${id}_answer.md`, body);
  const out = execSync(`node _write_cg.js ${id} "${title.replace(/"/g, '\\"')}" ${slugStr} --text-first`, {
    cwd: 'C:/Users/koryj/website', encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 20 * 1024 * 1024,
  });
  return JSON.parse(out.trim().split('\n').pop());
}

(async () => {
  let items = buildQueue();
  const prog = loadProg();
  const doneSet = new Set(prog.done);
  items = items.filter((it) => !doneSet.has(it.id));
  if (limit > 0) items = items.slice(0, limit);

  const total = items.length;
  log(`START testrun50 — ${total} to do (text-first via DeepSeek)`);
  await email('PULSE Coaching test run — START',
    `<h2>Coaching text-first sprint started</h2><p>Generating <b>${total}</b> entries via DeepSeek (25 Top-10 + 25 Q&A, 1:1). Images deferred to a later Claude pass.</p>`);

  let pub = 0, rej = 0, skip = 0, lastEmail = Date.now();
  for (const it of items) {
    try {
      if (seen.has(norm(it.title))) { skip++; log(`SKIP dup ${it.id} ${it.title}`); continue; }
      const { body, grade, tries } = await generateGradedBody(it.id, it.title, it.kind, { maxTries: 3 });
      const textClean = grade.banned_hits.length === 0 && grade.missing.every((m) => m === 'images_law');
      if (!textClean) { rej++; log(`REJ gen ${it.id} score=${grade.score} missing=${grade.missing.join('|')} banned=${grade.banned_hits.join('|')}`); continue; }
      if (DRY) {
        fs.writeFileSync(`C:/Users/koryj/${it.id}_answer.md`, body);
        log(`DRY ${it.id} ${it.kind} ${grade.score}/12 ${grade.word_count}w tries=${tries}`);
        pub++;
      } else {
        const r = publishTextFirst(it.id, it.title, slug(it.title), body);
        if (!r.ok) { rej++; log(`REJ pub ${it.id} ${JSON.stringify(r)}`); continue; }
        pub++;
        log(`OK ${it.id} ${it.kind} ${r.score}/12 ${r.words}w ${r.url}`);
        prog.done.push(it.id); prog.updated = new Date().toISOString(); saveProg(prog);
      }
      seen.add(norm(it.title));
    } catch (e) {
      rej++; log(`ERR ${it.id} ${e.message}`);
    }
    // Email progress every ~15 minutes.
    if (Date.now() - lastEmail >= 15 * 60 * 1000) {
      lastEmail = Date.now();
      await email(`PULSE Coaching test run — ${pub}/${total} published`,
        `<h2>Coaching text-first progress</h2><ul><li>Published: <b>${pub}</b></li><li>Rejected: <b>${rej}</b></li><li>Skipped (dup): <b>${skip}</b></li><li>Remaining: <b>${total - pub - rej - skip}</b></li></ul><p>Pillar: <a href="https://pulserevops.com/coaching">/coaching</a>. Images deferred to Claude pass.</p>`);
    }
  }

  log(`DONE testrun50 published=${pub} rejected=${rej} skipped=${skip}`);
  await email(`PULSE Coaching test run — COMPLETE (${pub} published)`,
    `<h2>Coaching text-first sprint complete</h2><ul><li>Published: <b>${pub}</b></li><li>Rejected: <b>${rej}</b></li><li>Skipped (dup): <b>${skip}</b></li></ul><p>Next: reconcile index, deploy text, then run the Claude image pass for these ${pub} entries.</p>`);
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
