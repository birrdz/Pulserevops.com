// Sort knowledge ids smallest-pillar-first, then by id.
// Used by cursor-drip + white-purge so tiny pillars finish before giants (tl).

function pillarOf(id) {
  const m = String(id || '').match(/^([a-z]{2,3})\d/i);
  return m ? m[1].toLowerCase() : 'zz';
}

function sortSmallestPillarFirst(ids) {
  const list = (ids || []).map((id) => String(id).toLowerCase());
  const counts = {};
  for (const id of list) {
    const p = pillarOf(id);
    counts[p] = (counts[p] || 0) + 1;
  }
  return list.slice().sort((a, b) => {
    const pa = pillarOf(a);
    const pb = pillarOf(b);
    if (counts[pa] !== counts[pb]) return counts[pa] - counts[pb];
    if (pa !== pb) return pa < pb ? -1 : 1;
    return a < b ? -1 : a > b ? 1 : 0;
  });
}

function pillarOrderSummary(ids) {
  const counts = {};
  for (const id of ids || []) {
    const p = pillarOf(id);
    counts[p] = (counts[p] || 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => a[1] - b[1] || (a[0] < b[0] ? -1 : 1))
    .map(([p, n]) => p + ':' + n);
}

module.exports = { pillarOf, sortSmallestPillarFirst, pillarOrderSummary };
