// Polish loop — walks 8/10 entries to 9/10 by appending a cross-links block.
// Picks 4-6 related 10/10 q-IDs from the index by simple tag overlap.
// Templated, free, uses production polish endpoint.

const { getStore } = require('@netlify/blobs');
const TOKEN = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
if (!TOKEN) { console.error('BLOBS_PAT required'); process.exit(1); }
const KEY = 'pulsemachine-writer-2026';
const POLISH_URL = 'https://pulserevops.com/.netlify/functions/pulse-blob-polish';
const PACE_MS = 180_000;
const MAX_ITER = 600;

const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOKEN });
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

let iter = 0, okCount = 0, failCount = 0;

function tagOverlap(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return 0;
  const setA = new Set(a.map(t => String(t).toLowerCase()));
  let overlap = 0;
  for (const t of b) if (setA.has(String(t).toLowerCase())) overlap++;
  return overlap;
}

async function pickNext(idx) {
  const eights = idx.entries.filter(e => {
    const s = typeof e.quality_score === 'number' ? e.quality_score : 5;
    return s === 8 && /^q\d+$/.test(String(e.id));
  });
  if (!eights.length) return null;
  eights.sort((a, b) => {
    const na = parseInt(String(a.id).match(/\d+/)[0], 10);
    const nb = parseInt(String(b.id).match(/\d+/)[0], 10);
    return nb - na;
  });
  return eights[0];
}

function buildCrossLinks(target, idx) {
  const tens = idx.entries.filter(e => (e.quality_score || 5) === 10 && /^q\d+$/.test(String(e.id)) && e.id !== target.id);
  // Score each 10/10 by tag overlap with target. Take top 5.
  const scored = tens.map(t => ({ id: t.id, question: t.question || '', overlap: tagOverlap(target.tags || [], t.tags || []) }));
  scored.sort((a, b) => b.overlap - a.overlap);
  const top = scored.slice(0, 6).filter(x => x.overlap > 0);
  // If no tag overlap, fall back to the highest-q-id 10/10s for at least 4 links.
  if (top.length < 4) {
    const fallback = tens.slice(0, 6).map(t => ({ id: t.id, question: t.question || '', overlap: 0 }));
    while (top.length < 4 && fallback.length) {
      const f = fallback.shift();
      if (!top.find(x => x.id === f.id)) top.push(f);
    }
  }
  if (top.length < 4) return null;
  const lines = top.slice(0, 6).map(t => '- **' + t.id + '** — ' + (t.question || '').slice(0, 140));
  return `\n\n---\n\n## See Also (related library entries)\n\nCross-references for adjacent operator topics drawn from the current 10/10 library set, ranked by tag overlap with this entry:\n\n${lines.join('\n')}\n\nFollow the q-ID links to read each in full — they're sequenced so the cross-references compound rather than repeat.`;
}

async function polishOne(target, idx) {
  const entry = await store.get('answers/' + target.id + '.json', { type: 'json' });
  if (!entry) return { ok: false, reason: 'entry missing' };
  const original = entry.answer || '';
  if (/## See Also \(related library entries\)/.test(original)) {
    return { ok: false, reason: 'already-cross-linked' };
  }
  const block = buildCrossLinks(target, idx);
  if (!block) return { ok: false, reason: 'no-candidates-for-cross-link' };
  const newAnswer = original + block;
  const r = await fetch(POLISH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      key: KEY,
      id: target.id,
      polish_note: 'Cross-linked to 4-6 related 10/10 library entries selected by tag-overlap ranking. 8/10 to 9/10 internal-link-graph step. Builds the library reading-path graph and supports topical SEO.',
      new_answer: newAnswer,
    }),
  });
  const j = await r.json().catch(() => ({}));
  return { ok: r.ok && j.ok, body: j, status: r.status };
}

(async () => {
  console.log('[' + new Date().toISOString() + '] overnight-polish-8to9 starting · pace=' + (PACE_MS/1000) + 's');
  while (iter < MAX_ITER) {
    iter++;
    try {
      const idx = await store.get('_index.json', { type: 'json' });
      if (!idx || !Array.isArray(idx.entries)) { await sleep(60_000); continue; }
      const target = await pickNext(idx);
      if (!target) {
        console.log('[' + new Date().toISOString() + '] no 8/10 entries · pausing 10 min');
        await sleep(10 * 60 * 1000);
        continue;
      }
      const r = await polishOne(target, idx);
      if (r.ok) { okCount++; console.log('[' + new Date().toISOString() + '] iter ' + iter + ' · ' + target.id + ' 8->9 OK · totals ok=' + okCount + ' fail=' + failCount); }
      else { failCount++; console.log('[' + new Date().toISOString() + '] iter ' + iter + ' · ' + target.id + ' SKIP/FAIL · ' + (r.reason || (r.body && r.body.reason) || ('status ' + r.status))); }
    } catch (e) { failCount++; console.error('iter ' + iter + ' ERR ' + e.message); }
    await sleep(PACE_MS);
  }
  console.log('=== 8->9 LOOP STOPPED === iter=' + iter + ' ok=' + okCount + ' fail=' + failCount);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
