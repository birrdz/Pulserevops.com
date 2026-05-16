// backfill-between — sweep every entry in the live blob library, ensure
// each one has a clean answer_between baked. Calls the deployed
// voice-translate Netlify function (which holds the Anthropic key).
//
// Usage: BLOBS_PAT=<token> node lab/backfill-between.js [--limit N] [--force]
//   --force    re-translate even if answer_between already exists
//   --limit N  cap the number of entries processed
const https = require('https');
const { getStore } = require('@netlify/blobs');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOKEN = process.env.BLOBS_PAT;
const FORCE = process.argv.includes('--force');
const limitArg = process.argv.find(a => a.startsWith('--limit='));
const LIMIT = limitArg ? parseInt(limitArg.slice(8), 10) : Infinity;
const CONCURRENCY = 4;
const ENDPOINT = 'https://pulserevops.com/.netlify/functions/voice-translate';

if (!TOKEN) { console.error('BLOBS_PAT required'); process.exit(1); }

const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: TOKEN });

function postTranslate(id) {
  return new Promise((resolve) => {
    const body = JSON.stringify({ id, target_voice: 'between' });
    const u = new URL(ENDPOINT);
    const req = https.request({
      hostname: u.hostname, port: 443, path: u.pathname, method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      timeout: 60000,
    }, (res) => {
      let buf = '';
      res.on('data', c => { buf += c; });
      res.on('end', () => {
        try {
          const j = JSON.parse(buf);
          resolve((j && j.ok && j.answer && j.answer.length > 200) ? j.answer : null);
        } catch (e) { resolve(null); }
      });
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
    req.write(body); req.end();
  });
}

function hasMermaid(s) { return /```mermaid[\s\S]*?```/.test(s || ''); }
function countSections(s) { return ((s || '').match(/^#{1,3}\s+/gm) || []).length; }

async function processEntry(id) {
  const full = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
  if (!full) return { id, skipped: 'no-blob' };
  if (!FORCE && full.answer_between && full.answer_between.length > 200) {
    return { id, skipped: 'already-baked' };
  }
  if (!full.answer || full.answer.length < 200) {
    return { id, skipped: 'no-answer' };
  }
  const between = await postTranslate(id);
  if (!between) return { id, skipped: 'translate-failed' };
  // Length sanity: must be within 50-200% of original (allow for glossary expansion)
  const ratio = between.length / full.answer.length;
  if (ratio < 0.5 || ratio > 2.2) {
    return { id, skipped: 'bad-ratio:' + ratio.toFixed(2) };
  }
  // Mermaid preservation check: if original had mermaid, translation must too
  if (hasMermaid(full.answer) && !hasMermaid(between)) {
    return { id, skipped: 'lost-mermaid' };
  }
  // Section count must be roughly preserved (allow Definitions section addition)
  const opSec = countSections(full.answer);
  const btSec = countSections(between);
  if (opSec >= 3 && btSec < opSec - 1) {
    return { id, skipped: 'lost-sections:' + opSec + '/' + btSec };
  }
  full.answer_between = between;
  full.answer_between_baked_at = Date.now();
  await store.setJSON('answers/' + id + '.json', full);
  return { id, ok: true, ratio: ratio.toFixed(2) };
}

(async () => {
  const idx = await store.get('_index.json', { type: 'json' });
  if (!idx || !Array.isArray(idx.entries)) { console.error('No index'); process.exit(1); }
  const ids = idx.entries.map(e => e.id).filter(Boolean);
  // Process oldest first ("from the beginning") so older broken-English entries get fixed first
  ids.sort((a, b) => parseInt(a.replace(/\D/g, '') || '0') - parseInt(b.replace(/\D/g, '') || '0'));
  const work = ids.slice(0, LIMIT);
  console.log('backfill: total entries=' + idx.entries.length + ' processing=' + work.length + ' force=' + FORCE);

  let done = 0, ok = 0, skipped = {};
  // Concurrent workers
  let cursor = 0;
  async function worker() {
    while (cursor < work.length) {
      const i = cursor++;
      const id = work[i];
      const r = await processEntry(id);
      done++;
      if (r.ok) ok++;
      else { skipped[r.skipped] = (skipped[r.skipped] || 0) + 1; }
      if (done % 25 === 0) console.log('  progress: ' + done + '/' + work.length + ' (ok=' + ok + ')');
    }
  }
  await Promise.all(Array.from({length: CONCURRENCY}, () => worker()));

  console.log('---');
  console.log('done. ok=' + ok + ' skipped=' + (done - ok));
  Object.entries(skipped).forEach(([k,v]) => console.log('  ' + k + ': ' + v));
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
