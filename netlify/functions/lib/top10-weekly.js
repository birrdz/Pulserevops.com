// Build "Top 10 most viewed this week" snapshot from view counts + library index.

function lastNDays(n) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const d = new Date(Date.now() - i * 86400000);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

function dayCount(slot) {
  if (slot == null) return 0;
  if (typeof slot === 'number') return slot;
  return slot.c || 0;
}

function isKnowledgeEntry(e) {
  if (!e || !e.id) return false;
  if (!/^q\d+$/i.test(e.id)) return false;
  if (/^st\d+$/i.test(e.id) || /^ik\d+$/i.test(e.id)) return false;
  const tags = e.tags || [];
  if (tags.indexOf('sales-training') !== -1) return false;
  if (tags.indexOf('industry-kpi') !== -1) return false;
  return true;
}

function rankTop10FromCounts(counts) {
  const days7 = lastNDays(7);
  return Object.keys(counts.entries || {})
    .map((id) => {
      const e = counts.entries[id] || {};
      let sum = 0;
      for (const d of days7) sum += dayCount(e.days && e.days[d]);
      return { id, count: sum };
    })
    .filter((r) => r.count > 0 && /^q\d+$/i.test(r.id))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

async function enrichWithLibrary(libraryStore, ranked) {
  const idx = (await libraryStore.get('_index.json', { type: 'json' })) || { entries: [] };
  const byId = {};
  for (const e of idx.entries || []) {
    if (isKnowledgeEntry(e)) byId[e.id] = e;
  }
  return ranked
    .map((r) => ({
      id: r.id,
      count: r.count,
      question: (byId[r.id] && byId[r.id].question) || null,
      tags: (byId[r.id] && byId[r.id].tags) || [],
    }))
    .filter((r) => r.question);
}

async function buildTop10Weekly(viewCountsStore, libraryStore) {
  const counts = (await viewCountsStore.get('counts.json', { type: 'json' })) || { entries: {} };
  const ranked = rankTop10FromCounts(counts);
  const items = await enrichWithLibrary(libraryStore, ranked);
  return {
    updated_at: Date.now(),
    period_days: 7,
    items,
  };
}

module.exports = {
  lastNDays,
  dayCount,
  rankTop10FromCounts,
  enrichWithLibrary,
  buildTop10Weekly,
  isKnowledgeEntry,
};
