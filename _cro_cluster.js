// _cro_cluster.js — group the CRO/chief-revenue-officer near-dups into CLUSTERS ("big groups").
// Union-find over every near-dup edge we have (Phase 0 census + original fractional-cro census),
// so a template shared by 50 entries surfaces as ONE group of 50 — the rewrite targets.
// MEASURE ONLY. Output _cro_clusters.json {clusters:[{size, ids, sample}], singles, totalNearDup}.
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const loadJSON = (f, d) => { try { return JSON.parse(fs.readFileSync(WD + '/' + f, 'utf8')); } catch (e) { return d; } };

// pull near-dup edges {id -> dupOf} from whatever census files exist
const edges = [];
function harvest(obj) {
  if (!obj) return;
  const list = obj.nearDupList || obj.nearDup || obj.near_dups || [];
  for (const d of list) { if (d && d.id && d.dupOf) edges.push([d.id, d.dupOf]); }
}
harvest(loadJSON('_cro_phase0_unique.json'));
harvest(loadJSON('_fcro_unique.json'));

// titles: prefer the phase0 manifest, fall back to nothing
const titleOf = {};
const man = loadJSON('_cro_phase0_manifest.json', { matches: [] });
for (const m of (man.matches || [])) titleOf[m.id] = m.title;

// union-find
const parent = {};
const find = x => { while (parent[x] !== undefined && parent[x] !== x) { parent[x] = parent[parent[x]] ?? parent[x]; x = parent[x]; } return x; };
const add = x => { if (parent[x] === undefined) parent[x] = x; };
for (const [a, b] of edges) { add(a); add(b); const ra = find(a), rb = find(b); if (ra !== rb) parent[ra] = rb; }

const groups = {};
for (const id of Object.keys(parent)) { const r = find(id); (groups[r] = groups[r] || []).push(id); }
const clusters = Object.values(groups).map(ids => ({
  size: ids.length,
  ids,
  sample: ids.slice(0, 6).map(id => id + ': ' + String(titleOf[id] || '').slice(0, 60)),
})).sort((a, b) => b.size - a.size);

const big = clusters.filter(c => c.size >= 3);
const pairs = clusters.filter(c => c.size === 2);
const out = {
  totalNearDupEntries: new Set(edges.flat()).size,
  totalClusters: clusters.length,
  bigGroups: big.length,
  pairs: pairs.length,
  clusters,
};
fs.writeFileSync(WD + '/_cro_clusters.json', JSON.stringify(out, null, 1));

console.log('CRO near-dup CLUSTERS (union-find over ' + edges.length + ' edges):');
console.log('  entries involved: ' + out.totalNearDupEntries + '  clusters: ' + out.totalClusters + '  (big>=3: ' + big.length + ', pairs: ' + pairs.length + ')');
console.log('  ---- BIGGEST GROUPS ----');
for (const c of clusters.slice(0, 15)) {
  console.log('  [' + c.size + '] ' + (c.sample[0] || c.ids[0]));
  for (const s of c.sample.slice(1, 3)) console.log('        ' + s);
}
console.log('wrote _cro_clusters.json');
