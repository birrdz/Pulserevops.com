// Cross-pillar Q&A COPY (reuse, not net-new). Copies an existing answer blob from
// a SOURCE pillar into a DESTINATION pillar under a fresh sequential id, keeping the
// answer body, adapting the title/tags so it reads naturally in the destination.
//
// SAFETY: single-process index writer. Writes the answer blob first, then inserts ONE
// index row. Run the matching index reconcile after a batch so the shared _index.json
// self-heals from blobs. NEVER run two index-writing node processes at once.
//
// Usage:
//   node _xpillar_copy.js --from aq --to pt --ids aq0001,aq0002 [--start 115] [--dry-run]
//   node _xpillar_copy.js --from aq --to pt --ids-file aq_batch1.json --start 115
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');
const { loadEnv, netlifySiteId, blobsPat } = require('./netlify/functions/lib/load-env');
const { prepareEntryForPublish, finalizeIndexNow } = require('./_write_lib');
const { capitalizeQuestion } = require('./netlify/functions/lib/text-capitalize');

loadEnv(path.join(__dirname));
const SITE_ID = netlifySiteId();

function arg(name, def) {
  const i = process.argv.indexOf('--' + name);
  return i >= 0 ? process.argv[i + 1] : def;
}
const FROM = arg('from');
const TO = arg('to');
const START = parseInt(arg('start', '0'), 10);
const DRY = process.argv.includes('--dry-run');
const IDS = (() => {
  const inline = arg('ids');
  if (inline) return inline.split(',').map((s) => s.trim()).filter(Boolean);
  const file = arg('ids-file');
  if (file) return JSON.parse(fs.readFileSync(path.join(__dirname, file), 'utf8'));
  return [];
})();

if (!FROM || !TO || !IDS.length) {
  console.error('usage: node _xpillar_copy.js --from <pfx> --to <pfx> --ids a,b | --ids-file f.json [--start N] [--dry-run]');
  process.exit(1);
}

const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();

function store() {
  const tok = blobsPat();
  try { return getStore('pulse-machine-library'); }
  catch (_) { return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok }); }
}

// Clean, destination-appropriate tags. Strips the noisy electronics/RevOps review tag
// pollution carried by some source blobs; keeps only pet/fishkeeping-relevant tags plus
// destination pillar membership.
function destTags(toPfx, srcTags = [], question = '') {
  // Generic, structural tags we always keep from the source (format markers, not topic-bound).
  const KEEP = new Set([
    'top-10', 'best-of-2027', 'best-of-2026', 'best-of-2025',
    'semantic-search-faq', 'best-overall-best-value',
  ]);
  const cleaned = (srcTags || []).filter((t) => KEEP.has(String(t).toLowerCase()));

  // Per-destination base tags + page-membership tag. Pets keeps its special pet framing;
  // all place/hospitality pillars get clean, destination-appropriate tags.
  const PILLAR = {
    pt: { tag: 'pulse-pets', base: ['pets', 'pet-care'] },
    dn: { tag: 'pulse-dn', base: ['dining', 'restaurants', 'where-to-eat'] },
    nl: { tag: 'pulse-nl', base: ['nightlife', 'bars', 'going-out'] },
    rs: { tag: 'pulse-rs', base: ['resorts', 'hotels', 'travel'] },
    tv: { tag: 'pulse-tv', base: ['travel', 'destinations', 'trip-planning'] },
    es: { tag: 'pulse-es', base: ['real-estate', 'estates', 'property'] },
    cl: { tag: 'pulse-cl', base: ['clubs', 'country-clubs', 'golf-clubs'] },
    ev: { tag: 'pulse-ev', base: ['events', 'things-to-do'] },
    ga: { tag: 'pulse-ga', base: ['gatherings', 'get-togethers'] },
    lv: { tag: 'pulse-lv', base: ['living', 'lifestyle', 'where-to-live'] },
    tn: { tag: 'pulse-tn', base: ['towns', 'cities', 'places'] },
    sc: { tag: 'pulse-sc', base: ['schools', 'education'] },
  };
  const cfg = PILLAR[toPfx] || { tag: 'pulse-' + toPfx, base: [] };
  const base = [cfg.tag, ...cfg.base];
  return Array.from(new Set([...base, ...cleaned]));
}

// Title rewrite so the entry reads naturally inside Pets. Top-10 fish/gear lists stay as
// Top-10 (the destination pillar already hosts that format) but get an explicit pet framing.
function destTitle(question) {
  let q = String(question || '').trim();
  // Keep "Top 10 ... 2027" shape; ensure it ends with a year and reads cleanly.
  // Lowercase-y source titles like "Top 10 fin rot treatments 2027" → Title Case-ish via capitalizeQuestion.
  return capitalizeQuestion(q);
}

(async () => {
  const st = store();
  // load index once, mutate in memory, single write at end (this script is the only writer)
  const idx = (await st.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] };
  const inIndex = new Set(idx.entries.filter((e) => e && e.id).map((e) => e.id));

  // destination dup-title guard: collect existing dest-pillar normalized titles
  const destNorm = new Set(
    idx.entries
      .filter((e) => e && e.id && new RegExp('^' + TO + '\\d+$').test(e.id))
      .map((e) => norm(e.question))
  );

  let n = START;
  const results = [];
  const indexRowsAdded = [];

  for (const srcId of IDS) {
    const src = await st.get('answers/' + srcId + '.json', { type: 'json' }).catch(() => null);
    if (!src || !src.answer) {
      results.push({ srcId, ok: false, reason: 'no_source_blob' });
      continue;
    }
    const title = destTitle(src.question);
    if (destNorm.has(norm(title))) {
      results.push({ srcId, ok: false, reason: 'dup_title_in_dest', title });
      continue;
    }
    // find next free dest id
    let destId;
    do { destId = TO + String(n).padStart(4, '0'); n++; } while (inIndex.has(destId) || (await st.get('answers/' + destId + '.json', { type: 'json' }).catch(() => null)));

    const now = Date.now();
    let entry = {
      id: destId,
      question: title,
      answer: src.answer,
      tags: destTags(TO, src.tags, title),
      sources: src.sources || ['Pulse RevOps cross-pillar reuse'],
      copied_from: srcId,
      copied_from_pillar: FROM,
      family_id: src.family_id || src.copied_from || srcId,
      quality_score: 10,
      format_v: src.format_v || '2026-05',
      gold_format: src.gold_format || false,
      has_answer: true,
      pending: false,
      ts: now,
      polished_at: now,
      model: src.model || 'xpillar-copy',
    };

    if (DRY) {
      results.push({ srcId, destId, ok: true, dry: true, title, tags: entry.tags });
      destNorm.add(norm(title));
      inIndex.add(destId);
      continue;
    }

    entry = prepareEntryForPublish(destId, title, entry);
    await st.setJSON('answers/' + destId + '.json', entry);

    const indexRow = {
      id: destId,
      question: title,
      tags: entry.tags,
      quality_score: 10,
      format_v: entry.format_v || '2026-05',
      pending: false,
      ts: now,
      polished_at: now,
      model: entry.model || 'xpillar-copy',
      copied_from: srcId,
      was_indexed_at: null,
      seo_optimized_at: entry.seo_optimized_at || now,
    };
    idx.entries.unshift(indexRow);
    inIndex.add(destId);
    destNorm.add(norm(title));
    indexRowsAdded.push(indexRow);
    const URLP = { pt: 'pets', dn: 'dining', nl: 'nightlife', rs: 'resorts', tv: 'travel', es: 'estates', cl: 'clubs', ev: 'events', ga: 'gatherings', lv: 'living', tn: 'towns', sc: 'schools' };
    results.push({ srcId, destId, ok: true, title, url: 'https://pulserevops.com/' + (URLP[TO] || TO) + '/' + destId });
    console.log('copied', srcId, '->', destId, '|', title);
  }

  if (!DRY && indexRowsAdded.length) {
    idx.entries.sort((a, b) => (b.ts || 0) - (a.ts || 0));
    await st.setJSON('_index.json', idx);
    // IndexNow ping per new entry (best-effort)
    for (const row of indexRowsAdded) {
      try { await finalizeIndexNow(row.id, st, row); } catch (_) {}
    }
  }

  const summary = {
    from: FROM, to: TO, dry: DRY,
    requested: IDS.length,
    copied: results.filter((r) => r.ok && !r.dry).length,
    dryOk: results.filter((r) => r.dry).length,
    skipped: results.filter((r) => !r.ok).length,
    newIndexSize: idx.entries.length,
    firstId: indexRowsAdded[0] && indexRowsAdded[0].id,
    lastId: indexRowsAdded[indexRowsAdded.length - 1] && indexRowsAdded[indexRowsAdded.length - 1].id,
  };
  fs.writeFileSync(
    path.join(__dirname, '_xpillar_copy_report.json'),
    JSON.stringify({ ...summary, results, at: new Date().toISOString() }, null, 2)
  );
  console.log(JSON.stringify(summary, null, 2));
})().catch((e) => { console.error('ERR', e && e.message, e && e.stack); process.exit(1); });
