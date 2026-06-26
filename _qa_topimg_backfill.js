// TOP image for Q&A-style pillars — inserts ONE topic-embodying image at the very top
// of each answer (above the Direct Answer), same reasoning as the Top-10 hero shot.
// Keyless DuckDuckGo. Idempotent via the same <!--HERO--> marker the hero backfill uses,
// so an entry never gets two top images. Skips graphics (gb) — those entries ARE images.
//
// Usage:
//   node _qa_topimg_backfill.js q                  # one prefix
//   node _qa_topimg_backfill.js st ik gp           # several
//   node _qa_topimg_backfill.js --all-qa           # all Q&A/text pillars (big)
//   node _qa_topimg_backfill.js q --limit 5        # cap (testing)
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const env = fs.readFileSync('.env.local', 'utf8');
for (const l of env.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOK });

// Q&A / text pillars (no product cards). gb=graphics excluded (entries already are images).
const QA_PREFIXES = ['q', 'st', 'ik', 'gp', 'ra', 'bs', 'cg', 'tk', 'tl', 'fr', 'sk', 'sp', 'sy'];
const CONCURRENCY = 4;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const num = id => parseInt(String(id).match(/\d+/)[0], 10);

const args = process.argv.slice(2);
const ALL = args.includes('--all-qa');
const limIdx = args.indexOf('--limit');
const LIMIT = limIdx >= 0 ? parseInt(args[limIdx + 1], 10) : Infinity;
let prefixes = args.filter(a => /^[a-z]{1,3}$/.test(a) && a !== 'all');
if (ALL) prefixes = QA_PREFIXES.slice();
if (!prefixes.length) { console.error('usage: node _qa_topimg_backfill.js <prefix...> | --all-qa  [--limit N]'); process.exit(1); }

// Build an image query that embodies the Q&A topic from its question/title.
function queryForQA(qRaw) {
  let q = (qRaw || '').replace(/’/g, "'").replace(/\([^)]*\)/g, ' ');
  q = q.toLowerCase()
    .replace(/[?.]+/g, ' ')
    .replace(/^\s*(how do you|how does|how do|how can you|how can|how should|how to|how much|how many|what is the|what are the|what's the|what is|what are|should i|why do|why does|why is|when should|when do|which|where do|do you|is it|are there)\b/, '')
    .replace(/\bin\s+20\d\d\b/g, ' ').replace(/\bfor\s+20\d\d\b/g, ' ').replace(/\b20\d\d\b/g, ' ')
    .replace(/\b(a|an|the|to|of|that|who|your|their|them|with|for|on|in|and|or|without|when|while|using|use|do|you|i|my|our|its|it's|is|are|be|how)\b/g, ' ')
    .replace(/[^a-z0-9 '-]/g, ' ')
    .replace(/\s+/g, ' ').trim();
  // keep the most meaningful 5 words
  const words = q.split(' ').filter(Boolean);
  let core = words.slice(0, 5).join(' ').trim();
  if (core.length < 4) core = (qRaw || '').toLowerCase().replace(/[?.]/g, '').replace(/\s+/g, ' ').trim();
  return core;
}
// Per-pillar context word to keep generic sales topics from returning random images.
const CONTEXT = { q: 'business', st: 'sales team', ik: 'business', gp: 'business strategy', ra: 'business operations', bs: 'business book', cg: 'sales coaching', tk: 'software', tl: 'business software', fr: 'franchise business', sk: 'business skill', sp: 'speech event', sy: 'professional outfit' };

async function headOk(url) {
  try { const r = await fetch(url, { method: 'GET', headers: { Range: 'bytes=0-2048', 'User-Agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(10000) }); const ct = (r.headers.get('content-type') || '').toLowerCase(); return r.ok && ct.startsWith('image/'); } catch (e) { return false; }
}
async function ddg(q, a = 0) {
  try {
    const tp = await fetch('https://duckduckgo.com/?q=' + encodeURIComponent(q) + '&iax=images&ia=images', { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(15000) });
    const html = await tp.text(); const m = html.match(/vqd=([\d-]+)/) || html.match(/vqd="([^"]+)"/);
    if (!m) { if (a < 2) { await sleep(1500 + a * 1500); return ddg(q, a + 1); } return []; }
    await sleep(120);
    const r = await fetch('https://duckduckgo.com/i.js?l=us-en&o=json&q=' + encodeURIComponent(q) + '&vqd=' + m[1] + '&f=,,,&p=1', { headers: { 'User-Agent': UA, 'Referer': 'https://duckduckgo.com/', 'Accept': 'application/json' }, signal: AbortSignal.timeout(15000) });
    if (r.status === 429 || r.status === 403) { if (a < 3) { await sleep(2500 + a * 2500); return ddg(q, a + 1); } return []; }
    const t = await r.text(); let j; try { j = JSON.parse(t); } catch (e) { if (a < 2) { await sleep(2000); return ddg(q, a + 1); } return []; }
    return (j.results || []).map(x => x.image).filter(Boolean);
  } catch (e) { if (a < 2) { await sleep(1500); return ddg(q, a + 1); } return []; }
}
// Query->image cache (duplicate images where applicable: same topic reuses one image).
const CACHE_PATH = '_img_cache.json';
let cache = {};
try { cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8')); } catch (e) { cache = {}; }
let cacheDirty = 0;
function saveCache(force) { if (force || ++cacheDirty % 25 === 0) { try { fs.writeFileSync(CACHE_PATH, JSON.stringify(cache)); } catch (e) {} } }
const pillarDefault = {}; // prefix -> a known-good image, reused for any search miss

async function pickImage(core, ctx, prefix) {
  const key = (core + ' ' + ctx).trim().toLowerCase();
  if (cache[key]) return cache[key];
  const queries = [core + ' ' + ctx, core, ctx + ' professional'];
  for (const q of queries) {
    const arr = await ddg(q.trim());
    for (const img of arr.slice(0, 12)) { if (await headOk(img)) { cache[key] = img; saveCache(); if (!pillarDefault[prefix]) pillarDefault[prefix] = img; return img; } }
  }
  // Miss: reuse the pillar default (duplicate is allowed) so every entry gets an image.
  if (pillarDefault[prefix]) return pillarDefault[prefix];
  // Last resort: a cached image for the pillar's context word.
  const ctxArr = await ddg(ctx + ' professional');
  for (const img of ctxArr.slice(0, 12)) { if (await headOk(img)) { pillarDefault[prefix] = img; cache[key] = img; saveCache(); return img; } }
  return null;
}
function insertHero(body, md) {
  const lines = body.split(/\r?\n/);
  let at = 0;
  if (/^#\s+/.test(lines[0])) at = 1;
  if (lines[at] === '') at++;
  lines.splice(at, 0, '<!--HERO-->', md, '');
  return lines.join('\n');
}
async function processEntry(id, ctx, prefix) {
  const e = await s.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
  if (!e || !e.answer) return { id, skip: 'no-body' };
  if (e.answer.includes('<!--HERO-->')) return { id, skip: 'has-hero' };
  const core = queryForQA(e.question || (e.answer.split(/\r?\n/).find(l => /^#\s+/.test(l)) || '').replace(/^#\s+/, ''));
  if (!core) return { id, skip: 'no-query' };
  const img = await pickImage(core, ctx, prefix);
  if (!img) return { id, skip: 'no-image:' + core };
  const alt = (e.question || core).replace(/[\[\]()]/g, '').slice(0, 90);
  e.answer = insertHero(e.answer, '![' + alt + '](' + img + ')');
  e.ts = Date.now(); e.polished_at = Date.now();
  delete e.images_deferred_at;
  delete e.images_deferred_note;
  e.images_backfilled_at = Date.now();
  e.images_backfill_via = 'qa-topimg-ddg';
  await s.setJSON('answers/' + id + '.json', e);
  return { id, fixed: true, core };
}
(async () => {
  const idx = (await s.get('_index.json', { type: 'json' })) || { entries: [] };
  let grandFixed = 0, grandTotal = 0;
  for (const prefix of prefixes) {
    const rx = new RegExp('^' + prefix + '\\d+$');
    let ids = (idx.entries || []).map(x => x.id).filter(x => rx.test(x)).sort((a, b) => num(a) - num(b));
    if (LIMIT !== Infinity) ids = ids.slice(0, LIMIT);
    const ctx = CONTEXT[prefix] || 'business';
    console.log(`\n[qa-top] ${prefix}: ${ids.length} entries (ctx="${ctx}")`);
    let done = 0, fixed = 0, cursor = 0;
    async function worker() {
      while (cursor < ids.length) {
        const id = ids[cursor++];
        try { const r = await processEntry(id, ctx, prefix); done++; if (r.fixed) { fixed++; if (fixed % 20 === 0 || done <= 3) console.log(`  [${done}/${ids.length}] ${id} +img (${r.core})`); } else if (r.skip.startsWith('no-image')) console.log(`  [${done}/${ids.length}] ${id} skip:${r.skip}`); }
        catch (err) { done++; console.log(`  FAIL ${id}: ${err.message}`); }
      }
    }
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    grandFixed += fixed; grandTotal += ids.length;
    console.log(`[qa-top] ${prefix} DONE: ${fixed} images added / ${ids.length}`);
  }
  saveCache(true);
  fs.writeFileSync('_qa_topimg_result.json', JSON.stringify({ grandFixed, grandTotal, cached: Object.keys(cache).length, at: Date.now() }, null, 1));
  console.log(`\n[qa-top] ALL DONE: ${grandFixed} images added across ${grandTotal} entries`);
})().catch(e => { console.error('FATAL', e.stack); process.exit(1); });
