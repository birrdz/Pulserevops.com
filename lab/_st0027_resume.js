// Resume st0027 polish ladder from current quality_score → 10, then stamp
// format_v=2026-05. The original run hit a single 504 between rung 6 and 7;
// production shows qs=7 already, so we resume from 8.

const { getStore } = require('@netlify/blobs');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

// Load the original script as a module to pull tldr/core/flow/src/num/counter/
// links/notes/sources/tags without re-defining 600 lines.
// Easiest: re-require by eval'ing the bits we need. Cleaner: just re-import.
const ORIG = path.join(__dirname, '_st0027_create.js');
const tmpFile = null; // not used in this implementation

const KEY = 'pulsemachine-writer-2026';
const POLISH_URL = 'https://pulserevops.com/.netlify/functions/pulse-blob-polish';
const ID = 'st0027';
const sleep = ms => new Promise(r => setTimeout(r, ms));

const postPolish = async p => {
  const r = await fetch(POLISH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(p)
  });
  return { status: r.status, body: await r.json().catch(() => ({})) };
};

async function main() {
  const TOKEN = process.env.BLOBS_PAT;
  if (!TOKEN) { console.error('BLOBS_PAT not set'); process.exit(1); }
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOKEN });

  // Pull current entry to learn quality_score + already-stored answer
  const e = await store.get('answers/' + ID + '.json', { type: 'json' });
  if (!e) { console.error(ID, 'entry not found'); process.exit(1); }
  console.log('[' + ID + '] current qs=' + e.quality_score + ' fv=' + e.format_v + ' wc=' + (e.answer||'').length);

  // Re-extract layers from original script source so notes + new_answer match
  const orig = fs.readFileSync(ORIG, 'utf8');
  const tldr = orig.match(/const tldr = `([\s\S]*?)`;/)[1];
  const core = orig.match(/const core = `([\s\S]*?)`;/)[1];
  const flow = orig.match(/const flow = `([\s\S]*?)`;/)[1];
  const src = orig.match(/const src = `([\s\S]*?)`;/)[1];
  const num = orig.match(/const num = `([\s\S]*?)`;/)[1];
  const counter = orig.match(/const counter = `([\s\S]*?)`;/)[1];
  const links = orig.match(/const links = `([\s\S]*?)`;/)[1];
  // notes is an object literal — slurp the entire { ... } block
  const notesMatch = orig.match(/const notes = (\{[\s\S]*?\n\};)/);
  const notes = eval('(' + notesMatch[1].replace(/;\s*$/, '') + ')');

  const v5 = tldr + core + flow;
  const v6 = v5 + src;
  const v7 = v6 + num;
  const v8 = v7 + counter;
  const v9 = v8 + links;
  console.log('layers:', v5.length, v6.length, v7.length, v8.length, v9.length);

  const allSteps = [
    { target: 6, new_answer: v6, note: notes.s6 },
    { target: 7, new_answer: v7, note: notes.s7 },
    { target: 8, new_answer: v8, note: notes.s8 },
    { target: 9, new_answer: v9, note: notes.s9 },
    { target: 10, new_answer: null, note: notes.s10 },
  ];

  // Resume from current qs + 1
  const startScore = (e.quality_score || 5) + 1;
  const remaining = allSteps.filter(s => s.target >= startScore);
  console.log('[' + ID + '] resuming at rung ' + startScore + ' (' + remaining.length + ' steps left)');

  for (const s of remaining) {
    const payload = { key: KEY, id: ID, polish_note: s.note };
    if (s.new_answer) payload.new_answer = s.new_answer;
    let attempt = 0;
    while (true) {
      attempt++;
      const r = await postPolish(payload);
      console.log(ID, '->' + s.target + ' attempt ' + attempt + ' · ' + r.status);
      if (r.status === 200) break;
      if (r.status === 429 || r.status === 503) {
        console.error(ID, 'throttle ' + r.status + ' — STOP per loop rule');
        process.exit(2);
      }
      if (r.status === 504 && attempt < 2) {
        console.log(ID, '504 gateway timeout — single retry after 30s');
        await sleep(30000);
        continue;
      }
      console.error(ID, 'FAIL at rung ' + s.target + ' status ' + r.status, JSON.stringify(r.body).slice(0,400));
      process.exit(1);
    }
    await sleep(500);
  }

  // Post-polish: stamp format_v=2026-05 on blob + index row
  try {
    const finalEntry = await store.get('answers/' + ID + '.json', { type: 'json' });
    if (finalEntry) {
      finalEntry.format_v = '2026-05';
      await store.setJSON('answers/' + ID + '.json', finalEntry);
      console.log('[' + ID + '] format_v=2026-05 stamped on blob (qs=' + finalEntry.quality_score + ', wc=' + (finalEntry.answer||'').length + ')');
    }
    const finalIdx = await store.get('_index.json', { type: 'json' });
    if (finalIdx && Array.isArray(finalIdx.entries)) {
      const ii = finalIdx.entries.findIndex(x => x.id === ID);
      if (ii >= 0) {
        finalIdx.entries[ii].format_v = '2026-05';
        await store.setJSON('_index.json', finalIdx);
        console.log('[' + ID + '] format_v=2026-05 stamped on _index.json row');
      }
    }
  } catch (err) {
    console.error('[' + ID + '] format_v stamp failed:', err.message);
  }

  // Fire-and-forget IndexNow ping
  try {
    fetch('https://pulserevops.com/.netlify/functions/pulse-machine-indexnow-batch-background', { method: 'POST' }).catch(() => {});
  } catch (_e) {}

  console.log('=== DONE ' + ID + ' === quality_score=10');
}

main().catch(err => { console.error(err); process.exit(1); });
