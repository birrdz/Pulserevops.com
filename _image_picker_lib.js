// _image_picker_lib.js — Fable v2 cover picker queue (graded previews only, never raw DDG in UI)
const fs = require('fs');
const path = require('path');
const WD = 'C:/Users/koryj/website';
const QUEUE_F = WD + '/_image_picker_queue.json';
const PICK_F = WD + '/_image_picker_pick.json';
const PICK_DIR = WD + '/assets/qa/_pick';
const { gatherCoverCandidates, storeGradedImage, verifyGradeStamp, coverPath, stampDdgProvenance, coverFileOk } = require('./_ddg_facecard_lib');

const readJ = (p, d) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return d; } };
const writeJ = (p, o) => { try { fs.writeFileSync(p, JSON.stringify(o, null, 0)); } catch (e) {} };

function readQueue() { return readJ(QUEUE_F, { waiting: null, history: [] }); }
function writeQueue(q) { writeJ(QUEUE_F, q); }

async function buildCoverPicker(id, question, pillar) {
  if (!fs.existsSync(PICK_DIR)) fs.mkdirSync(PICK_DIR, { recursive: true });
  // clear old previews for this id
  try { fs.readdirSync(PICK_DIR).filter(f => f.startsWith(id + '-')).forEach(f => fs.unlinkSync(path.join(PICK_DIR, f))); } catch (e) {}
  const stats = { fetched: 0, graded: 0, dedupedRejected: 0, placeholderHits: 0 };
  const raw = await gatherCoverCandidates(question, id, 10, stats);
  const candidates = [];
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    const rel = '/assets/qa/_pick/' + id + '-' + i + '.jpg';
    const dest = PICK_DIR + '/' + id + '-' + i + '.jpg';
    await storeGradedImage(c.buf, dest, { square: 760, bright: c.qual.meanB > 175 });
    if (!(await verifyGradeStamp(dest))) throw new Error('GRADE_MISSING on picker preview ' + id + '-' + i);
    candidates.push({ idx: i, preview: rel, artistic: !!c.artistic, query: c.query || '' });
  }
  const item = { id, question, pillar, slot: 'cover', candidates, created: new Date().toISOString(), stats };
  const q = readQueue();
  q.waiting = item;
  writeQueue(q);
  return item;
}

function clearPickSignal() { try { fs.unlinkSync(PICK_F); } catch (e) {} }

async function waitForCoverPick(id, timeoutMs) {
  const deadline = Date.now() + (timeoutMs || 30 * 60 * 1000);
  clearPickSignal();
  while (Date.now() < deadline) {
    const sig = readJ(PICK_F, null);
    if (sig && sig.id === id && Number.isInteger(sig.idx)) return sig;
    await new Promise(r => setTimeout(r, 1500));
  }
  return { id, idx: 0, auto: true };
}

async function applyCoverPick(id, idx, store, candidates) {
  const c = (candidates || [])[idx];
  if (!c) return false;
  const src = WD + c.preview;
  if (!fs.existsSync(src) || !(await verifyGradeStamp(src))) return false;
  if (!fs.existsSync(path.dirname(coverPath(id)))) fs.mkdirSync(path.dirname(coverPath(id)), { recursive: true });
  fs.copyFileSync(src, coverPath(id));
  if (!coverFileOk(id) || !(await verifyGradeStamp(coverPath(id)))) return false;
  await stampDdgProvenance(id, store);
  try {
    const idxStore = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    const e = (idxStore.entries || []).find(x => x && x.id === id);
    if (e) { e.img = '/assets/qa/' + id + '.jpg'; e.cover_src = 'ddg-facecard'; await store.setJSON('_index.json', idxStore); }
  } catch (e) {}
  return true;
}

async function resolveCoverViaPicker(id, question, pillar, store, opts) {
  opts = opts || {};
  if (opts.autoOnly) {
    const { ensureDdgFaceCover } = require('./_ddg_facecard_lib');
    const src = await ensureDdgFaceCover(id, question, store, null);
    return { ok: src === 'ddg-facecard' && coverFileOk(id) && await verifyGradeStamp(coverPath(id)), picked: 'auto' };
  }
  const item = await buildCoverPicker(id, question, pillar);
  if (!item.candidates.length) return { ok: false, picked: 'none', stats: item.stats };
  const sig = await waitForCoverPick(id, opts.timeoutMs);
  const ok = await applyCoverPick(id, sig.idx, store, item.candidates);
  const q = readQueue();
  q.history = [{ id, idx: sig.idx, auto: !!sig.auto, at: new Date().toISOString() }, ...(q.history || [])].slice(0, 40);
  q.waiting = null;
  writeQueue(q);
  clearPickSignal();
  return { ok, picked: sig.auto ? 'auto-timeout' : 'human', idx: sig.idx, stats: item.stats };
}

function recordPick(id, idx, action) {
  writeJ(PICK_F, { id, idx, action: action || 'pick', at: new Date().toISOString() });
  if (action === 'none') {
    const q = readQueue();
    if (q.waiting && q.waiting.id === id) q.waiting.needsRefetch = true;
    writeQueue(q);
  }
}

module.exports = { buildCoverPicker, waitForCoverPick, applyCoverPick, resolveCoverViaPicker, recordPick, readQueue, QUEUE_F, PICK_F };
