// Mark entries as 10/10 polished when they meet quality criteria:
//   - has mermaid block
//   - has >=3 sources
//   - answer length >= 800 chars
// Writes polished_at timestamp to JSON file + blob (overwrites existing).
//
// Usage:
//   BLOBS_PAT=<token> node lab/mark-polished.js [--limit N]
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');

const LAB_DIR = path.join(__dirname, 'cheap-100');
const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOKEN = process.env.BLOBS_PAT;
if (!TOKEN) { console.error('BLOBS_PAT required'); process.exit(1); }

const limitArg = process.argv.find(a => a.startsWith('--limit='));
const LIMIT = limitArg ? parseInt(limitArg.slice(8), 10) : 2000;

const MIN_SOURCES = 3;
const MIN_ANSWER_LEN = 800;

const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: TOKEN });

function qualifies(entry) {
  if (!entry || !entry.answer) return false;
  if (typeof entry.answer !== 'string') return false;
  if (entry.answer.length < MIN_ANSWER_LEN) return false;
  if (!entry.answer.includes('```mermaid')) return false;
  const srcArr = Array.isArray(entry.sources) ? entry.sources : [];
  const validSources = srcArr.filter(s => s && (typeof s === 'string' || s.url));
  if (validSources.length < MIN_SOURCES) return false;
  return true;
}

(async () => {
  const files = fs.readdirSync(LAB_DIR)
    .filter(f => /^q\d+\.json$/.test(f))
    .sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));

  let scanned = 0, qualified = 0, already_polished = 0, marked = 0, blob_written = 0, errs = 0;
  for (const f of files) {
    if (marked >= LIMIT) break;
    scanned++;
    const filePath = path.join(LAB_DIR, f);
    let entry;
    try { entry = JSON.parse(fs.readFileSync(filePath, 'utf8')); }
    catch (e) { errs++; continue; }
    if (!qualifies(entry)) continue;
    qualified++;
    if (entry.polished_at) { already_polished++; continue; }

    entry.polished_at = Date.now();
    try {
      fs.writeFileSync(filePath, JSON.stringify(entry) + '\n');
      marked++;
    } catch (e) { errs++; continue; }

    try {
      const cur = (await store.get('answers/' + entry.id + '.json', { type: 'json' })) || {};
      await store.setJSON('answers/' + entry.id + '.json', {
        ...cur,
        id: entry.id,
        question: entry.question,
        answer: entry.answer,
        tags: entry.tags || cur.tags || [],
        sources: entry.sources || cur.sources || [],
        polished_at: entry.polished_at,
        ts: cur.ts || Date.now(),
        model: entry.model || cur.model || 'claude-haiku-4-5',
        lab_run: entry.lab_run || cur.lab_run || 'tail-import',
      });
      blob_written++;
    } catch (e) { errs++; }
    if (marked % 50 === 0) console.log('  marked', marked);
  }

  console.log('done:', { scanned, qualified, already_polished, marked, blob_written, errs });
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
