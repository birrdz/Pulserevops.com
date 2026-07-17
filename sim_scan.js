// sim_scan.js — SIMILARITY_MACHINE Phase 1 (SCAN, detect only — changes nothing).
// Reads the blob library, normalizes bodies (location->LOCATION, numbers->NUM), computes
// pairwise sentence-overlap within the scope, groups clone families, flags stubs, and writes
// sim/scan_report.json + sim/summary.json. Resume-safe via a content-hash keyed cache.
//
// Usage:  node sim_scan.js <scope>       scope = ALL | <pillar> (e.g. gp) | <id-prefix topic> (e.g. gp0)
//   env:  SIM_THRESHOLD (0.70)  STUB_MIN (250)  SIM_MAX (cap entries, debug)
'use strict';
const fs = require('fs');
const crypto = require('crypto');
const WD = 'C:/Users/koryj/website';
try { for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

const SIM_DIR = WD + '/sim';
try { fs.mkdirSync(SIM_DIR, { recursive: true }); } catch (e) {}
const SIM_THRESHOLD = parseFloat(process.env.SIM_THRESHOLD || '0.70');
const STUB_MIN = parseInt(process.env.STUB_MIN || '250', 10);
const CACHE_F = SIM_DIR + '/scan_cache.json';
const REPORT_F = SIM_DIR + '/scan_report.json';
const SUMMARY_F = SIM_DIR + '/summary.json';
const STATUS_F = SIM_DIR + '/run_status.json';

const readJSON = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } };

/** Scope match: ALL | pillar | {prefix}{n} section chips | legacy tlA–tlD. */
const {
  parseSectionScope,
  idInSectionScope,
  buildSections,
  sortIds,
  pillarOf,
} = require('./_fixer_scope_sections');

function packsFromEntries(entries) {
  const byP = {};
  for (const e of entries || []) {
    const id = String((e && e.id) || e || '');
    const p = pillarOf(id);
    if (!p) continue;
    if (!byP[p]) byP[p] = [];
    byP[p].push(id);
  }
  const packs = {};
  for (const p of Object.keys(byP)) {
    packs[p] = buildSections(p, byP[p], null, p);
  }
  return packs;
}

function idInScope(id, scope, packsByPrefix) {
  const s = String(scope || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const idl = String(id || '').toLowerCase();
  if (!s || s === 'all') return true;
  // Fixer pods (podN / doneN) — cross-pillar OK
  const { idInPodScope, isPodLocked, parsePodScope } = require('./_fixer_scope_sections');
  if (parsePodScope(s)) {
    if (isPodLocked(s)) return false; // locked green pods never re-enter work
    return !!idInPodScope(id, s);
  }
  const secHit = idInSectionScope(id, s, packsByPrefix);
  if (secHit !== null) return secHit;
  if (/^tl[abcd]$/.test(s)) {
    if (!/^tl\d/.test(idl)) return false;
    const n = parseInt(idl.replace(/\D/g, ''), 10) || 0;
    const want = { tla: 0, tlb: 1, tlc: 2, tld: 3 }[s];
    return (n % 4) === want;
  }
  if (parseSectionScope(s)) return false;
  return new RegExp('^' + s + '\\d').test(idl) || idl === s;
}
const pOf = id => (String(id).match(/^([a-z]+)\d/i) || [, ''])[1].toLowerCase();

// ── location + number normalization (kills the doorway "…in <State>" variant signal) ──
const STATES = ['alabama','alaska','arizona','arkansas','california','colorado','connecticut','delaware','florida','georgia','hawaii','idaho','illinois','indiana','iowa','kansas','kentucky','louisiana','maine','maryland','massachusetts','michigan','minnesota','mississippi','missouri','montana','nebraska','nevada','new hampshire','new jersey','new mexico','new york','north carolina','north dakota','ohio','oklahoma','oregon','pennsylvania','rhode island','south carolina','south dakota','tennessee','texas','utah','vermont','virginia','washington','west virginia','wisconsin','wyoming','district of columbia','washington dc','d c'];
// top US cities (covers the vast majority of geo-variant families)
const CITIES = ['new york city','los angeles','san francisco','san diego','san jose','san antonio','las vegas','new orleans','oklahoma city','kansas city','salt lake city','virginia beach','colorado springs','fort worth','el paso','long beach','santa ana','baton rouge','chicago','houston','phoenix','philadelphia','dallas','austin','jacksonville','columbus','charlotte','indianapolis','seattle','denver','boston','nashville','detroit','portland','memphis','louisville','milwaukee','albuquerque','tucson','fresno','sacramento','mesa','atlanta','omaha','miami','raleigh','cleveland','tulsa','arlington','tampa','honolulu','anaheim','aurora','bakersfield','wichita','cincinnati','pittsburgh','richmond','orlando','irvine','norfolk','madison','lubbock','reno','buffalo','fremont','chandler','scottsdale','glendale','gilbert','plano','laredo','henderson','chula vista','chesapeake','garland','irving','hialeah','boise','spokane','montgomery','frisco','mckinney','tacoma','fontana','modesto','fayetteville','moreno valley','huntington beach','yonkers','glendale','columbus','worcester','newark','oakland','minneapolis','tempe','durham','st louis','st paul','saint louis','saint paul','jersey city','fort lauderdale','naperville','cary','provo'];
const LOCRE = new RegExp('\\b(' + STATES.concat(CITIES).sort((a, b) => b.length - a.length).map(s => s.replace(/ /g, '\\s+')).join('|') + ')\\b', 'gi');
function normalize(md) {
  let t = String(md || '');
  t = t.replace(/```[\s\S]*?```/g, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').replace(/\[[^\]]*\]\([^)]*\)/g, ' '); // strip code + images + links
  t = t.replace(/<[^>]+>/g, ' ');                        // strip html/widgets
  t = t.toLowerCase();
  t = t.replace(LOCRE, ' LOCATION ');
  t = t.replace(/\$?\b\d[\d,\.]*%?\b/g, ' NUM ');         // numbers/prices/percents -> NUM
  t = t.replace(/[#>*_`~\-|]+/g, ' ').replace(/[^a-z0-9\.\!\?\s]/g, ' ');
  return t.replace(/\s+/g, ' ').trim();
}
function sentences(norm) {
  return norm.split(/(?<=[\.\!\?])\s+|\n+/).map(s => s.replace(/[^a-z0-9 ]/g, '').trim()).filter(s => s.split(' ').length >= 4);
}
function wordCount(md) { return normalize(md).split(' ').filter(Boolean).length; }
// Jaccard-style sentence overlap (min-normalized so a short variant vs long canonical still trips)
function overlap(aSet, bSet) {
  if (!aSet.size || !bSet.size) return 0;
  let inter = 0; const small = aSet.size < bSet.size ? aSet : bSet, big = small === aSet ? bSet : aSet;
  for (const s of small) if (big.has(s)) inter++;
  return inter / small.size;
}

function writeStatus(o) { try { fs.writeFileSync(STATUS_F, JSON.stringify(Object.assign(readJSON(STATUS_F, {}), o, { updated: new Date().toISOString() }), null, 1)); } catch (e) {} }

async function main() {
  const scope = (process.argv[2] || '').trim();
  if (!scope) { console.error('HALT: no scope. Usage: node sim_scan.js <ALL|pillar|topic-prefix>'); process.exit(2); }
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  let entries = ((idx && idx.entries) || []).filter(e => e && e.id && !/^vq_/i.test(String(e.id)));
  if (scope.toUpperCase() !== 'ALL') {
    const s = scope.toLowerCase();
    const packs = packsFromEntries(((idx && idx.entries) || []));
    entries = entries.filter((e) => idInScope(String(e.id), s, packs));
  }
  if (process.env.SIM_MAX) entries = entries.slice(0, parseInt(process.env.SIM_MAX, 10));
  const total = entries.length;
  console.log(`[sim-scan] scope=${scope}  entries=${total}  threshold=${SIM_THRESHOLD}  stub<${STUB_MIN}w`);
  writeStatus({ stage: 'scan', scope, total, scanned: 0, phase: 'reading bodies' });
  if (!total) { console.error('HALT: scope matched 0 entries — check the scope name against the registry.'); process.exit(2); }

  const cache = readJSON(CACHE_F, {});
  const recs = [];   // {id, pillar, score, words, hash, sents:Set, stub}
  let scanned = 0;
  // Owner 2026-07-12: default was 18 + rewrite 140MB cache every batch → scan crashes / blob rate limits.
  // Keep reads gentle; pause between batches; flush cache sparsely.
  const CONC = Math.max(1, Math.min(8, parseInt(process.env.SIM_READ_CONC || '4', 10) || 4));
  const PAUSE_MS = Math.max(0, parseInt(process.env.SIM_SCAN_PAUSE_MS || '280', 10) || 0);
  const CACHE_EVERY = Math.max(1, parseInt(process.env.SIM_CACHE_EVERY || '25', 10) || 25); // batches between cache flushes
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  async function readOne(e) {
    const id = String(e.id);
    let body = null;
    for (let attempt = 0; attempt < 3 && body == null; attempt++) {
      try {
        const a = await store.get('answers/' + id + '.json', { type: 'json' });
        body = a && (a.answer || a.body || '');
        if (body == null) body = '';
      } catch (x) {
        body = null;
        if (attempt < 2) await sleep(400 * (attempt + 1));
      }
    }
    if (body == null) body = '';
    const hash = crypto.createHash('sha1').update(body).digest('hex');
    let sentsArr, words;
    if (cache[id] && cache[id].hash === hash) { sentsArr = cache[id].sents; words = cache[id].words; }
    else { const norm = normalize(body); const ss = sentences(norm); sentsArr = ss; words = norm.split(' ').filter(Boolean).length; cache[id] = { hash, sents: ss, words }; }
    recs.push({ id, pillar: pOf(id), score: (typeof e.quality_score === 'number' ? e.quality_score : 0), words, hash, sents: new Set(sentsArr), stub: words < STUB_MIN });
  }
  let batches = 0;
  for (let i = 0; i < entries.length; i += CONC) {
    await Promise.all(entries.slice(i, i + CONC).map(readOne));
    scanned = recs.length;
    batches++;
    writeStatus({ scanned, phase: 'reading bodies', readConc: CONC });
    // Sparse cache flush — full rewrite of ~100MB+ every batch was killing the scan phase
    if (batches % CACHE_EVERY === 0) {
      try { fs.writeFileSync(CACHE_F, JSON.stringify(cache)); } catch (e) {}
    }
    process.stdout.write(`\r[sim-scan] read ${scanned}/${total} · conc=${CONC}`);
    if (PAUSE_MS) await sleep(PAUSE_MS);
  }
  try { fs.writeFileSync(CACHE_F, JSON.stringify(cache)); } catch (e) {}
  process.stdout.write('\n');

  // ── pairwise within pillar blocks (clone families are geo/topic variants inside a pillar) ──
  writeStatus({ scanned: total, phase: 'comparing' });
  const parent = {}; recs.forEach(r => parent[r.id] = r.id);
  const find = x => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };
  const union = (a, b) => { const ra = find(a), rb = find(b); if (ra !== rb) parent[ra] = rb; };
  const bestOverlap = {}; recs.forEach(r => bestOverlap[r.id] = 0);
  const byPillar = {}; for (const r of recs) (byPillar[r.pillar] = byPillar[r.pillar] || []).push(r);
  let compared = 0, pairs = 0;
  for (const p of Object.keys(byPillar)) {
    const g = byPillar[p].filter(r => !r.stub);
    for (let i = 0; i < g.length; i++) {
      for (let j = i + 1; j < g.length; j++) {
        const ov = overlap(g[i].sents, g[j].sents);
        if (ov > bestOverlap[g[i].id]) bestOverlap[g[i].id] = ov;
        if (ov > bestOverlap[g[j].id]) bestOverlap[g[j].id] = ov;
        if (ov >= SIM_THRESHOLD) { union(g[i].id, g[j].id); pairs++; }
      }
      if (++compared % 200 === 0) { writeStatus({ phase: 'comparing', compared, families: pairs }); process.stdout.write(`\r[sim-scan] compared ${compared} · near-dup pairs ${pairs}`); }
    }
  }
  process.stdout.write('\n');

  // ── families + piles ──
  const famMembers = {};
  for (const r of recs) if (!r.stub) { const root = find(r.id); (famMembers[root] = famMembers[root] || []).push(r); }
  const families = {}; let famN = 0;
  const report = {};
  const byId = Object.fromEntries(recs.map(r => [r.id, r]));
  for (const root of Object.keys(famMembers)) {
    const mem = famMembers[root];
    if (mem.length < 2) continue;                        // singletons aren't a family
    const canonical = mem.slice().sort((a, b) => (b.score - a.score) || (b.words - a.words))[0];
    const fid = 'F' + (++famN).toString().padStart(4, '0');
    families[fid] = { id: fid, pillar: canonical.pillar, size: mem.length, canonical: canonical.id, members: mem.map(m => m.id) };
    for (const m of mem) report[m.id] = { id: m.id, pillar: m.pillar, pile: 'NEAR_DUP', family: fid, canonical: m.id === canonical.id, overlap: +bestOverlap[m.id].toFixed(3), words: m.words, score: m.score };
  }
  for (const r of recs) {
    if (report[r.id]) continue;
    const base = { id: r.id, pillar: r.pillar, family: null, canonical: false, overlap: +bestOverlap[r.id].toFixed(3), words: r.words, score: r.score };
    if (r.stub) report[r.id] = { ...base, pile: 'STUB' };
    else if ((r.score || 0) < 10) report[r.id] = { ...base, pile: 'SUB13' };   // below the certified bar (stampIqPass writes 10; panel counts >=10) → needs a quality pass. NOT <13: images are paused so a content fix can only reach 10, and <13 re-flagged every just-fixed entry forever (false positives).
    else report[r.id] = { ...base, pile: 'PASS' };
  }
  const piles = { PASS: 0, NEAR_DUP: 0, STUB: 0, SUB13: 0 };
  for (const id of Object.keys(report)) piles[report[id].pile]++;
  const largest = Object.values(families).sort((a, b) => b.size - a.size).slice(0, 12)
    .map(f => ({ family: f.id, pillar: f.pillar, size: f.size, canonical: f.canonical }));
  const summary = { scope, total, piles, familyCount: Object.keys(families).length, nearDupPairs: pairs, largestFamilies: largest, threshold: SIM_THRESHOLD, stubMin: STUB_MIN, at: new Date().toISOString() };

  fs.writeFileSync(REPORT_F, JSON.stringify({ scope, at: summary.at, families, entries: report }, null, 1));
  // Preserve fat sitewide reports — next30 scans must not wipe the need-fix pool
  try {
    const needN = Object.values(report).filter((e) => e && e.pile && e.pile !== 'PASS').length;
    if (String(scope).toLowerCase() !== 'next30' && needN >= 50) {
      fs.writeFileSync(SIM_DIR + '/scan_report_sitewide.json', JSON.stringify({ scope, at: summary.at, families, entries: report }, null, 1));
    }
  } catch (e) {}
  fs.writeFileSync(SUMMARY_F, JSON.stringify(summary, null, 1));
  writeStatus({ stage: 'scan-done', phase: 'idle', piles, families: summary.familyCount });
  console.log(`\n[sim-scan] DONE  total=${total}  PASS=${piles.PASS}  NEAR_DUP=${piles.NEAR_DUP}  SUB13=${piles.SUB13}  STUB=${piles.STUB}  families=${summary.familyCount}`);
  console.log(`[sim-scan] wrote ${REPORT_F} + ${SUMMARY_F}`);
}
main().catch(e => { console.error('[sim-scan] FATAL', e && e.message); writeStatus({ stage: 'error', phase: 'idle', error: e && e.message }); process.exit(1); });
