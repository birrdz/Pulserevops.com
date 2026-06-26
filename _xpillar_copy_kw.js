// Cross-pillar Q&A COPY — RevOps-destination variant (owns dest pillars
// q/st/ik/tk/ra/gp/sw/cg/fr/bo/bs). Forked from _xpillar_copy.js so concurrent
// agents editing that shared file can't race this one.
//
// Adds:
//   --add-tags sports,football   inject extra tags on every copy in the batch.
//       For pillars WITH a compete module (st/ik/tk/ra/gp/cg/fr/bo/bs) these are
//       merged by tagsForEntry (existingTags). For q/sw (NO compete module) the
//       destTags() output below is authoritative, so they persist directly.
//
// SAFETY: single-process index writer. Writes the answer blob first, then inserts
// ONE index row. Run _index_reconcile_any.js after a batch. NEVER run two
// index-writing node processes at once.
//
// Usage:
//   node _xpillar_copy_kw.js --from hf --to q --ids hf0002,hf0003 --start 13607 --add-tags sports,football
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
const ADD_TAGS = (arg('add-tags', '') || '')
  .split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
const IDS = (() => {
  const inline = arg('ids');
  if (inline) return inline.split(',').map((s) => s.trim()).filter(Boolean);
  const file = arg('ids-file');
  if (file) return JSON.parse(fs.readFileSync(path.join(__dirname, file), 'utf8'));
  return [];
})();

if (!FROM || !TO || !IDS.length) {
  console.error('usage: node _xpillar_copy_kw.js --from <pfx> --to <pfx> --ids a,b [--start N] [--add-tags t1,t2] [--dry-run]');
  process.exit(1);
}

const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();

function store() {
  const tok = blobsPat();
  try { return getStore('pulse-machine-library'); }
  catch (_) { return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok }); }
}

// Destination-appropriate tags for RevOps/business pillars. Keeps only structural
// format markers from the source (NOT the source's topic/SEO tag dump), then adds
// the dest pillar membership tag + any injected --add-tags. For pillars that have a
// compete module, applyPillarSeo (via prepareEntryForPublish) will further enrich /
// overwrite from the dest pillar's own keyword stack; these tags are the seed.
function destTags(toPfx, srcTags = [], question = '') {
  const KEEP = new Set([
    'top-10', 'best-of-2027', 'semantic-search-faq', 'best-overall-best-value',
  ]);
  const cleaned = (srcTags || []).filter((t) => KEEP.has(String(t).toLowerCase()));
  const PILLAR = {
    q:  ['revops', 'business', 'knowledge'],
    st: ['sales-training', 'sales-meeting'],
    ik: ['industry-kpis', 'sales-kpis'],
    tk: ['tech-stack', 'software-stack'],
    ra: ['revenue-architecture', 'revops'],
    gp: ['gtm-playbook', 'go-to-market'],
    sw: ['software', 'business-software', 'top-10'],
    cg: ['sales-coaching', 'coaching'],
    fr: ['franchises', 'business-ideas'],
    bo: ['buildouts', 'commercial-real-estate'],
    bs: ['book-summary', 'sales-books'],
  };
  const base = ['pulse-' + toPfx, ...(PILLAR[toPfx] || [])];
  return Array.from(new Set([...base, ...cleaned, ...ADD_TAGS]));
}

function destTitle(question) {
  return capitalizeQuestion(String(question || '').trim());
}

(async () => {
  const st = store();
  const idx = (await st.get('_index.json', { type: 'json' })) || { entries: [] };
  const inIndex = new Set(idx.entries.filter((e) => e && e.id).map((e) => e.id));
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
    // For pillars whose compete module wiped/replaced tags, re-ensure injected
    // tags survive (q/sw have no module so destTags already has them; this is a
    // belt-and-suspenders guard for module pillars).
    if (ADD_TAGS.length) {
      entry.tags = Array.from(new Set([...(entry.tags || []), ...ADD_TAGS]));
    }
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
    results.push({ srcId, destId, ok: true, title });
    console.log('copied', srcId, '->', destId, '|', title);
  }

  if (!DRY && indexRowsAdded.length) {
    idx.entries.sort((a, b) => (b.ts || 0) - (a.ts || 0));
    await st.setJSON('_index.json', idx);
    for (const row of indexRowsAdded) {
      try { await finalizeIndexNow(row.id, st, row); } catch (_) {}
    }
  }

  const summary = {
    from: FROM, to: TO, dry: DRY, addTags: ADD_TAGS,
    requested: IDS.length,
    copied: results.filter((r) => r.ok && !r.dry).length,
    dryOk: results.filter((r) => r.dry).length,
    skipped: results.filter((r) => !r.ok).length,
    newIndexSize: idx.entries.length,
    firstId: indexRowsAdded[0] && indexRowsAdded[0].id,
    lastId: indexRowsAdded[indexRowsAdded.length - 1] && indexRowsAdded[indexRowsAdded.length - 1].id,
  };
  fs.writeFileSync(
    path.join(__dirname, '_xpillar_copy_kw_report.json'),
    JSON.stringify({ ...summary, results, at: new Date().toISOString() }, null, 2)
  );
  console.log(JSON.stringify(summary, null, 2));
})().catch((e) => { console.error('ERR', e && e.message, e && e.stack); process.exit(1); });
