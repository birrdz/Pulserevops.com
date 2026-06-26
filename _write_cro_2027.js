// Double every existing CRO ad Q&A (tl9001-tl9120) into a "... in 2027" variant,
// same answer body, pinned to the top of /tools. Owner request 2026-06-23.
// New ids start at tl9201. Skips source questions that already mention 2027.
//   node _write_cro_2027.js [--dry]
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');

try {
  const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
const DRY = process.argv.includes('--dry');

// Insert "in 2027" before the trailing ? (or append). Skip if already dated.
function to2027(q) {
  if (/\b2027\b/.test(q)) return null; // already dated — skip
  const t = q.trim();
  if (t.endsWith('?')) return t.slice(0, -1).replace(/\s+$/, '') + ' in 2027?';
  return t.replace(/\s*\.?$/, '') + ' in 2027';
}
function normTitle(q) { return q.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };

  // Source CRO entries = tl9001..tl9120 (pull from blobs to copy answer verbatim).
  const srcIds = [];
  for (let n = 9001; n <= 9120; n++) srcIds.push('tl' + n);

  const existingTitles = new Set(idx.entries.filter(e => e && e.question).map(e => normTitle(e.question)));
  const PIN_2027 = 4060000000000; // just BELOW the originals (orig pins are 4070.. / 4090..), so dated variants sit right under their base questions
  const baseTs = Date.now() - 3600000; // 1h behind the originals so originals stay on top

  let nextId = 9201;
  const results = [];
  let i = 0;
  for (const sid of srcIds) {
    const src = await store.get(`answers/${sid}.json`, { type: 'json' }).catch(() => null);
    if (!src || !src.question || !src.answer) { results.push({ src: sid, skip: 'no-blob' }); continue; }
    const q2 = to2027(src.question);
    if (!q2) { results.push({ src: sid, skip: 'already-2027', q: src.question }); continue; }
    if (existingTitles.has(normTitle(q2))) { results.push({ src: sid, skip: 'dup', q: q2 }); continue; }
    existingTitles.add(normTitle(q2));

    const id = 'tl' + nextId++;
    const ts = baseTs - i * 1000;
    const pinned_until = PIN_2027 - i * 1000;
    i++;
    const tags = Array.from(new Set([...(src.tags || []), 'fractional-cro-2027', '2027']));
    const e = {
      ...src,
      id,
      question: q2,
      tags,
      ts,
      polished_at: ts,
      pinned_until,
      pending: false,
      has_answer: true,
      copied_from: sid,
      source: 'cro-ads-2027',
    };
    if (DRY) { results.push({ id, src: sid, q: q2 }); continue; }
    await store.setJSON(`answers/${id}.json`, e);
    const row = {
      id, question: q2, tags, quality_score: e.quality_score || 10, format_v: e.format_v || '2026-05',
      pending: false, ts, polished_at: ts, pinned_until, has_answer: true,
      model: e.model || 'claude-opus-4-8', was_indexed_at: null, source: 'cro-ads-2027',
    };
    const at = idx.entries.findIndex((x) => x && x.id === id);
    if (at >= 0) idx.entries.splice(at, 1);
    idx.entries.unshift(row);
    results.push({ id, src: sid, url: `https://pulserevops.com/tools/${id}`, q: q2 });
  }

  const made = results.filter(r => r.id && !r.skip);
  if (!DRY) {
    await store.setJSON('_index.json', idx);
    for (const r of made) {
      try { await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'pulsemachine-writer-2026', id: r.id }) }); } catch (e) {}
    }
  }
  console.log(JSON.stringify({
    ok: true, dry: DRY,
    made: made.length,
    skipped_already2027: results.filter(r => r.skip === 'already-2027').length,
    skipped_dup: results.filter(r => r.skip === 'dup').length,
    skipped_noblob: results.filter(r => r.skip === 'no-blob').length,
    total_index: idx.entries.length,
    sample: made.slice(0, 8),
  }, null, 2));
})().catch((e) => { console.error('ERR', e && e.message); process.exit(1); });
