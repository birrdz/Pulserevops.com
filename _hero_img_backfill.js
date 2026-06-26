// Top-10 HERO image backfill — inserts ONE category establishing image near the very
// top of each Top-10 ranked-list entry (e.g. "Top 10 Bowrider Boats 2027" -> a photo of
// bowrider boats), ABOVE the Direct Answer, distinct from the per-item @@PRODUCT cards.
// Keyless DuckDuckGo image search. Idempotent via a <!--HERO--> marker.
//
// Usage:
//   node _hero_img_backfill.js bt              # one pillar prefix
//   node _hero_img_backfill.js er ca bt        # several prefixes
//   node _hero_img_backfill.js --all           # all Top-10 ranked-list prefixes
//   node _hero_img_backfill.js bt --limit 5    # cap (testing)
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const env = fs.readFileSync('.env.local', 'utf8');
for (const l of env.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOK });

// Top-10 ranked-list pillars only (have @@PRODUCT item cards; hero = the category).
const TOP10_PREFIXES = ['ai', 'bt', 'ca', 'cl', 'co', 'dn', 'er', 'es', 'ev', 'ga', 'gm', 'lv', 'mv', 'nl', 'rs', 'sc', 'tn', 'tv', 'wl'];
const CONCURRENCY = 4;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const num = id => parseInt(String(id).match(/\d+/)[0], 10);

const args = process.argv.slice(2);
const ALL = args.includes('--all');
const limIdx = args.indexOf('--limit');
const LIMIT = limIdx >= 0 ? parseInt(args[limIdx + 1], 10) : Infinity;
let prefixes = args.filter(a => /^[a-z]{2}$/.test(a));
if (ALL) prefixes = TOP10_PREFIXES.slice();
if (!prefixes.length) { console.error('usage: node _hero_img_backfill.js <prefix...> | --all  [--limit N]'); process.exit(1); }

// Turn a Top-10 title into a clean image-search category phrase.
function categoryFor(title) {
  let t = (title || '').replace(/’/g, "'");
  // strip the "— Best Overall + Best Value" style tails and parentheticals
  t = t.replace(/\s*[—-]\s*best overall.*$/i, '').replace(/\([^)]*\)/g, ' ');
  // strip leading ranking boilerplate: "The 100 Best", "Top 10", "The 10 Best", "Best", "10 Best"
  t = t.replace(/^\s*the\s+\d+\s+best\s+/i, '')
       .replace(/^\s*top\s+\d+\s+/i, '')
       .replace(/^\s*the\s+\d+\s+/i, '')
       .replace(/^\s*\d+\s+best\s+/i, '')
       .replace(/^\s*best\s+/i, '');
  // strip trailing year / "of all time" / "in YYYY" / "to collect/buy in YYYY"
  t = t.replace(/\bto\s+(collect|buy|own|watch)\b.*$/i, '')
       .replace(/\bof all time\b/i, '')
       .replace(/\bin\s+20\d\d\b/gi, '')
       .replace(/\b20\d\d\b/g, '')
       .replace(/[.,]+\s*$/,'')
       .replace(/\s+/g, ' ').trim();
  return t;
}

async function headOk(url) {
  try {
    const r = await fetch(url, { method: 'GET', headers: { Range: 'bytes=0-2048', 'User-Agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(10000) });
    const ct = (r.headers.get('content-type') || '').toLowerCase();
    return r.ok && ct.startsWith('image/');
  } catch (e) { return false; }
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
async function pickImage(cat) {
  const queries = [cat, cat + ' photo', cat.split(' ').slice(0, 3).join(' ')];
  for (const q of queries) {
    const arr = await ddg(q);
    for (const img of arr.slice(0, 12)) { if (await headOk(img)) return img; }
  }
  return null;
}

function insertHero(body, md) {
  const lines = body.split(/\r?\n/);
  // After a leading "# H1" title if present; else at the very top.
  let at = 0;
  if (/^#\s+/.test(lines[0])) at = 1;
  // skip a blank line right after the H1
  if (lines[at] === '') at++;
  lines.splice(at, 0, '<!--HERO-->', md, '');
  return lines.join('\n');
}

async function processEntry(id) {
  const e = await s.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
  if (!e || !e.answer) return { id, skip: 'no-body' };
  if (e.answer.includes('<!--HERO-->')) return { id, skip: 'has-hero' };
  const titleLine = (e.answer.split(/\r?\n/).find(l => /^#\s+/.test(l)) || '').replace(/^#\s+/, '');
  const cat = categoryFor(titleLine || e.question || '');
  if (!cat) return { id, skip: 'no-category' };
  const img = await pickImage(cat);
  if (!img) return { id, skip: 'no-image:' + cat };
  const alt = (cat + ' — Top 10 (2027)').replace(/[\[\]()]/g, '');
  e.answer = insertHero(e.answer, '![' + alt + '](' + img + ')');
  e.ts = Date.now(); e.polished_at = Date.now();
  await s.setJSON('answers/' + id + '.json', e);
  return { id, fixed: true, cat };
}

(async () => {
  const idx = (await s.get('_index.json', { type: 'json' })) || { entries: [] };
  for (const prefix of prefixes) {
    const rx = new RegExp('^' + prefix + '\\d+$');
    let ids = (idx.entries || []).map(x => x.id).filter(x => rx.test(x)).sort((a, b) => num(a) - num(b));
    if (LIMIT !== Infinity) ids = ids.slice(0, LIMIT);
    console.log(`\n[hero] ${prefix}: ${ids.length} entries`);
    let done = 0, fixed = 0, cursor = 0;
    async function worker() {
      while (cursor < ids.length) {
        const id = ids[cursor++];
        try { const r = await processEntry(id); done++; if (r.fixed) { fixed++; console.log(`  [${done}/${ids.length}] ${id} +hero (${r.cat})`); } else if (done % 25 === 0 || r.skip.startsWith('no-image')) console.log(`  [${done}/${ids.length}] ${id} skip:${r.skip}`); }
        catch (err) { done++; console.log(`  FAIL ${id}: ${err.message}`); }
      }
    }
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    console.log(`[hero] ${prefix} DONE: ${fixed} heroes added / ${ids.length}`);
  }
})().catch(e => { console.error('FATAL', e.stack); process.exit(1); });
