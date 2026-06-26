// Give EVERY library answer a good-quality, IN-HOUSE-hosted generated image
// (the "≥1 image/answer" LAW). Images are generated per topic, downloaded, and
// saved under website/img/auto/<slug>.jpg, then referenced from our own domain
// (https://pulserevops.com/img/auto/<slug>.jpg) — no third-party hotlinks.
//
// Engine is swappable and auto-detecting:
//   1) Gemini/Imagen 4 Fast (paid API tier) — used automatically IF the key bills.
//   2) Pollinations (Flux, free, keyless) — fallback that still yields clean,
//      on-brand flat-vector business illustrations.
// One image is generated per TOPIC and REUSED across same-topic entries
// (duplicates allowed per owner), so we generate far fewer images than entries.
//
// Durable + resumable: a manifest (_img_gen_manifest.json) maps topicKey->slug;
// existing image files are reused. Never regresses (grade-guarded). Republishes
// each touched entry + pings IndexNow.
//
// Usage: node _img_gen_fill.js <prefixCSV> [--limit N] [--conc N]
//   e.g. node _img_gen_fill.js cg,fr,ik,ra,gp,st,q --limit 800 --conc 4
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
} catch (e) {}
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const GKEY = (process.env.GEMINI_API_KEY || '').trim();
const s = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });

const IMG_DIR = 'C:/Users/koryj/website/img/auto';
const PUB_BASE = 'https://pulserevops.com/img/auto/';
const MANIFEST_PATH = 'C:/Users/koryj/website/_img_gen_manifest.json';
const RESULT_PATH = 'C:/Users/koryj/website/_img_gen_fill_result.json';
fs.mkdirSync(IMG_DIR, { recursive: true });

const args = process.argv.slice(2);
const PREFIXES = (args.find(a => !a.startsWith('--')) || 'cg,fr,ik,ra,gp,st,q')
  .split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
const LIMIT = (() => { const i = args.indexOf('--limit'); return i >= 0 ? parseInt(args[i + 1]) : Infinity; })();
const CONC = (() => { const i = args.indexOf('--conc'); return i >= 0 ? parseInt(args[i + 1]) : 4; })();

const sleep = ms => new Promise(r => setTimeout(r, ms));
const hasImage = (a) => /@@PRODUCT[^\n]*\bimg=/.test(a) || /!\[[^\]]*\]\([^)]+\)/.test(a) || /<img\s/i.test(a) || /<svg/i.test(a);
const prefixOf = (id) => { const m = String(id).match(/^([a-z]+)/i); return m ? m[1].toLowerCase() : '?'; };
function hash(str) { let h = 5381; for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0; return h; }

const STOP = new Set('the a an of for for to in on and or how do you what is are best top 2027 2026 with your my we i it that this when why which who whom should can will be as at by from into about a an'.split(/\s+/));
const GENERIC_TAGS = new Set(['industry-kpi', 'sales-training', 'tech-stack', 'gtm-playbook', 'revenue-architecture', 'coaching', 'top-10', 'best-of-2027', 'collectible', 'collecting', 'review']);
function topicWords(question, tags) {
  const tag = (tags || []).map(t => String(t).toLowerCase()).find(t => !GENERIC_TAGS.has(t) && t.length > 3);
  const words = String(question || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/)
    .filter(w => w.length > 2 && !STOP.has(w)).slice(0, 5);
  return { tag, phrase: (tag ? tag.replace(/-/g, ' ') + ' ' : '') + words.join(' ') };
}
function topicKey(question, tags, prefix) {
  const { phrase } = topicWords(question, tags);
  return prefix + ':' + phrase.trim();
}
function slugFor(key) {
  const base = key.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase().slice(0, 48);
  return base + '-' + hash(key).toString(36);
}

const STYLE = 'Clean modern flat vector illustration, professional corporate B2B style, muted navy blue and amber-orange palette, minimal soft geometric shapes, lots of negative space, no text, no words, no letters, no numbers, no logos, no watermark, no people faces.';
function promptFor(prefix, question, tags) {
  const { phrase } = topicWords(question, tags);
  const subjByPrefix = {
    ik: `a business analytics dashboard with KPI charts and graphs representing ${phrase}`,
    st: `a sales team coaching and training concept about ${phrase}`,
    cg: `a sales manager coaching a rep, office scene, about ${phrase}`,
    tk: `an arrangement of SaaS software tools and app icons for ${phrase}`,
    gp: `a go-to-market funnel and strategy whiteboard about ${phrase}`,
    ra: `a revenue operations system architecture diagram about ${phrase}`,
    fr: `a small-business franchise storefront concept for ${phrase}`,
  };
  const subj = subjByPrefix[prefix] || `a professional B2B revenue operations concept about ${phrase}`;
  return `${subj}. ${STYLE}`;
}

// ── engines ──────────────────────────────────────────────────────────────
let GEMINI_OK = !!GKEY; // probed/flipped at runtime
async function genGemini(prompt) {
  try {
    const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-fast-generate-001:predict?key=' + GKEY, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ instances: [{ prompt }], parameters: { sampleCount: 1, aspectRatio: '16:9' } }),
      signal: AbortSignal.timeout(60000),
    });
    if (r.status !== 200) { if (r.status === 400 || r.status === 403 || r.status === 429) GEMINI_OK = false; return null; }
    const j = await r.json();
    const p = j.predictions && j.predictions[0];
    const b64 = p && (p.bytesBase64Encoded || (p.image && p.image.imageBytes));
    return b64 ? Buffer.from(b64, 'base64') : null;
  } catch (e) { return null; }
}
const POLL_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
// Pollinations is flaky under load — alternate flux/turbo models with growing
// backoff so a degraded model on one attempt is retried via the other. 9 tries.
async function genPollinations(prompt, seed, attempt = 0) {
  const MAX = 8;
  // flux = best quality, sana = reliable free fallback (both 4/4 in testing);
  // turbo proved flaky so it is not used.
  const model = (attempt % 2 === 0) ? 'flux' : 'sana';
  try {
    const url = 'https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt) +
      '?width=1280&height=720&nologo=true&model=' + model + '&seed=' + ((seed + attempt) % 1000000);
    const r = await fetch(url, { headers: { 'User-Agent': POLL_UA }, signal: AbortSignal.timeout(120000) });
    if (!r.ok) throw new Error('status ' + r.status);
    const ct = (r.headers.get('content-type') || '').toLowerCase();
    if (!ct.startsWith('image/')) throw new Error('ct ' + ct);
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length < 3000) throw new Error('tiny ' + buf.length);
    return buf;
  } catch (e) {
    if (attempt < MAX) { await sleep(4000 + attempt * 3000); return genPollinations(prompt, seed, attempt + 1); }
    return null;
  }
}
// Global semaphore: the generation backends (esp. free Pollinations) are flaky
// under heavy parallelism, so cap concurrent GENERATIONS even when many workers
// run. Cache hits/reuse stay fully parallel; only fresh generations queue here.
const GEN_MAX = 2;
let genActive = 0; const genWaiters = [];
async function genAcquire() { if (genActive < GEN_MAX) { genActive++; return; } await new Promise(r => genWaiters.push(r)); genActive++; }
function genRelease() { genActive--; const w = genWaiters.shift(); if (w) w(); }
// Minimum spacing between fresh generation starts — bursts trigger a temporary
// IP-wide 429 on Pollinations, so pace requests ~1.5s apart.
let lastGenStart = 0;
async function genSpacing() { const wait = lastGenStart + 1500 - Date.now(); if (wait > 0) await sleep(wait); lastGenStart = Date.now(); }
async function generateImage(prompt, seed) {
  await genAcquire();
  try {
    await genSpacing();
    if (GEMINI_OK) { const b = await genGemini(prompt); if (b) return b; }
    return await genPollinations(prompt, seed);
  } finally { genRelease(); }
}

function insertImage(body, url, alt) {
  const safeAlt = String(alt || 'illustration').replace(/[\[\]]/g, '').slice(0, 90);
  const imgMd = `![${safeAlt}](${url})`;
  const lines = body.split(/\r?\n/);
  let at = lines.findIndex(l => /^#{1,3}\s+\S/.test(l));
  if (at < 0) at = lines.findIndex(l => l.trim().length);
  if (at < 0) return imgMd + '\n\n' + body;
  lines.splice(at + 1, 0, '', imgMd);
  return lines.join('\n');
}

let manifest = {};
try { manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8')); } catch (e) {}
let mDirty = 0;
function saveManifest() { try { fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest)); mDirty = 0; } catch (e) {} }

// get-or-generate a hosted image URL for a topic key (deduped across workers)
const inflight = new Map();
async function urlForTopic(key, prefix, question, tags) {
  const slug = manifest[key] || slugFor(key);
  const file = path.join(IMG_DIR, slug + '.jpg');
  if (manifest[key] && fs.existsSync(file)) return PUB_BASE + slug + '.jpg';
  if (inflight.has(key)) return inflight.get(key);
  const p = (async () => {
    if (fs.existsSync(file)) { manifest[key] = slug; return PUB_BASE + slug + '.jpg'; }
    const buf = await generateImage(promptFor(prefix, question, tags), hash(key));
    if (!buf) return null;
    fs.writeFileSync(file, buf);
    manifest[key] = slug; if (++mDirty >= 5) saveManifest();
    return PUB_BASE + slug + '.jpg';
  })();
  inflight.set(key, p);
  try { return await p; } finally { inflight.delete(key); }
}

(async () => {
  if (GKEY) { const probe = await genGemini('flat minimal blue business icon, no text'); GEMINI_OK = !!probe; }
  console.log('Engine:', GEMINI_OK ? 'Gemini/Imagen (paid)' : 'Pollinations/Flux (free fallback)');
  const idx = (await s.get('_index.json', { type: 'json' })) || { entries: [] };
  const ids = (idx.entries || []).map(e => e.id).filter(id => PREFIXES.includes(prefixOf(id)));
  console.log('Candidate ids in', PREFIXES.join(','), '=', ids.length);

  let fixed = 0, failed = 0, skipped = 0, generated = 0, i = 0, processed = 0;
  const seenFilesBefore = new Set(fs.readdirSync(IMG_DIR));
  async function worker() {
    while (i < ids.length && processed < LIMIT) {
      const id = ids[i++];
      let e;
      try { e = await s.get('answers/' + id + '.json', { type: 'json' }); } catch (err) { continue; }
      const a = (e && e.answer) || '';
      if (!a || hasImage(a)) { skipped++; continue; }
      processed++;
      const prefix = prefixOf(id);
      const key = topicKey(e.question, e.tags, prefix) || (prefix + ':' + id);
      try {
        const url = await urlForTopic(key, prefix, e.question, e.tags);
        if (!url) { failed++; console.log('  NO-IMG', id, key.slice(0, 44)); continue; }
        const before = gradeEntry(id, e.answer);
        const newBody = insertImage(e.answer, url, e.question || id);
        const after = gradeEntry(id, newBody);
        if (after.score < before.score) { failed++; console.log('  SKIP(regress)', id, before.score, '->', after.score); continue; }
        e.answer = newBody; e.ts = Date.now(); e.polished_at = Date.now();
        await s.setJSON('answers/' + id + '.json', e);
        try { await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'pulsemachine-writer-2026', id }), signal: AbortSignal.timeout(8000) }); } catch (e2) {}
        fixed++;
        if (fixed % 25 === 0) {
          generated = fs.readdirSync(IMG_DIR).length - seenFilesBefore.size;
          console.log(`  [${fixed}] ${id} +img  (uniqueImgs=${Object.keys(manifest).length} newGen=${generated})`);
          fs.writeFileSync(RESULT_PATH, JSON.stringify({ prefixes: PREFIXES, engine: GEMINI_OK ? 'gemini' : 'pollinations', processed, fixed, failed, uniqueImages: Object.keys(manifest).length }, null, 1));
        }
      } catch (err) { failed++; console.log('  ERR', id, err.message); }
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  saveManifest();
  generated = fs.readdirSync(IMG_DIR).length - seenFilesBefore.size;
  const out = { prefixes: PREFIXES, engine: GEMINI_OK ? 'gemini' : 'pollinations', processed, fixed, failed, skipped, uniqueImages: Object.keys(manifest).length, newGeneratedThisRun: generated };
  fs.writeFileSync(RESULT_PATH, JSON.stringify(out, null, 1));
  console.log('DONE', JSON.stringify(out));
})().catch(e => { saveManifest(); console.error('FATAL', e && e.stack); process.exit(1); });
