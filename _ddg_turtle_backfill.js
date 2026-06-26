// DDG Turtle — slow background cover backfill for q#### + st#### (ship-first law).
// Does NOT run in publish path. One entry at a time, deferred-first, DDG only.
//
// Usage:
//   node _ddg_turtle_backfill.js           # loop forever (turtle pace)
//   node _ddg_turtle_backfill.js --once    # one entry then exit
//   node _ddg_turtle_backfill.js --dry-run
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');
const { sendProgressEmail } = require('./_progress_email');

const ROOT = __dirname;
const PREFIXES = ['q', 'st'];
const TURTLE_PAUSE_MS = 90 * 1000;
const EMAIL_EVERY_MS = 15 * 60 * 1000;
const PID_FILE = path.join(ROOT, '_ddg_turtle_backfill.pid');
const ONCE = process.argv.includes('--once');
const DRY = process.argv.includes('--dry-run');

try {
  const env = fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (_) {}

const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN;
const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
const CONTEXT = { q: 'business', st: 'sales team' };
const CACHE_PATH = path.join(ROOT, '_img_cache.json');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const num = (id) => parseInt(String(id).match(/\d+/)[0], 10);

let cache = {};
try {
  cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
} catch (_) {}

const FRAMES = ['🐢    ', ' 🐢   ', '  🐢  ', '   🐢 ', '    🐢'];
let frame = 0;
function turtleLog(msg) {
  const f = FRAMES[frame++ % FRAMES.length];
  console.log(`${new Date().toISOString()} ${f} ${msg}`);
}

function queryForQA(qRaw) {
  let q = String(qRaw || '')
    .replace(/'/g, "'")
    .replace(/\([^)]*\)/g, ' ')
    .toLowerCase()
    .replace(/[?.]+/g, ' ')
    .replace(
      /^\s*(how do you|how does|how do|how can you|how can|how should|how to|what is the|what are the|what is|what are|should i|why do|why does|why is|when should|when do|which|where do|do you|is it|are there)\b/,
      ''
    )
    .replace(/\b20\d\d\b/g, ' ')
    .replace(/\b(a|an|the|to|of|that|who|your|their|with|for|on|in|and|or|without|when|while|using|use|do|you|i|my|our|its|is|are|be|how)\b/g, ' ')
    .replace(/[^a-z0-9 '-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = q.split(' ').filter(Boolean);
  let core = words.slice(0, 5).join(' ').trim();
  if (core.length < 4) core = String(qRaw || '').toLowerCase().replace(/[?.]/g, '').replace(/\s+/g, ' ').trim();
  return core;
}

async function headOk(url) {
  try {
    const r = await fetch(url, {
      method: 'GET',
      headers: { Range: 'bytes=0-2048', 'User-Agent': UA },
      redirect: 'follow',
      signal: AbortSignal.timeout(10000),
    });
    return r.ok && (r.headers.get('content-type') || '').toLowerCase().startsWith('image/');
  } catch (_) {
    return false;
  }
}

async function ddg(q, attempt = 0) {
  try {
    const tp = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(q)}&iax=images&ia=images`, {
      headers: { 'User-Agent': UA },
      signal: AbortSignal.timeout(15000),
    });
    const html = await tp.text();
    const m = html.match(/vqd=([\d-]+)/) || html.match(/vqd="([^"]+)"/);
    if (!m) {
      if (attempt < 2) {
        await sleep(1500 + attempt * 1500);
        return ddg(q, attempt + 1);
      }
      return [];
    }
    await sleep(150);
    const r = await fetch(
      `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(q)}&vqd=${m[1]}&f=,,,&p=1`,
      {
        headers: { 'User-Agent': UA, Referer: 'https://duckduckgo.com/', Accept: 'application/json' },
        signal: AbortSignal.timeout(15000),
      }
    );
    if (r.status === 429 || r.status === 403) {
      if (attempt < 3) {
        await sleep(2500 + attempt * 2500);
        return ddg(q, attempt + 1);
      }
      return [];
    }
    const j = await r.json().catch(() => ({}));
    return (j.results || []).map((x) => x.image).filter(Boolean);
  } catch (_) {
    if (attempt < 2) {
      await sleep(1500);
      return ddg(q, attempt + 1);
    }
    return [];
  }
}

async function pickImage(core, ctx, prefix) {
  const key = `${core} ${ctx}`.trim().toLowerCase();
  if (cache[key]) return cache[key];
  for (const q of [core + ' ' + ctx, core, ctx + ' professional']) {
    const arr = await ddg(q.trim());
    for (const img of arr.slice(0, 10)) {
      if (await headOk(img)) {
        cache[key] = img;
        try {
          fs.writeFileSync(CACHE_PATH, JSON.stringify(cache));
        } catch (_) {}
        return img;
      }
    }
  }
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

async function findNextId() {
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const candidates = [];
  for (const row of idx.entries || []) {
    if (!row || !row.id) continue;
    const id = row.id;
    const prefix = PREFIXES.find((p) => new RegExp(`^${p}\\d+$`, 'i').test(id));
    if (!prefix) continue;
    const entry = await store.get(`answers/${id}.json`, { type: 'json' });
    if (!entry || !entry.answer) continue;
    if (entry.answer.includes('<!--HERO-->')) continue;
    candidates.push({
      id,
      prefix,
      deferred: !!entry.images_deferred_at,
      ts: entry.images_deferred_at || entry.ts || 0,
    });
  }
  candidates.sort((a, b) => {
    if (a.deferred !== b.deferred) return a.deferred ? -1 : 1;
    return num(a.id) - num(b.id);
  });
  return candidates[0] || null;
}

async function processOne(next) {
  const { id, prefix } = next;
  const e = await store.get(`answers/${id}.json`, { type: 'json' });
  if (!e || !e.answer || e.answer.includes('<!--HERO-->')) return { id, skip: 'has-hero' };
  const core = queryForQA(e.question || '');
  if (!core) return { id, skip: 'no-query' };
  const ctx = CONTEXT[prefix] || 'business';
  turtleLog(`searching DDG for ${id} (${core.slice(0, 40)}…)`);
  const img = await pickImage(core, ctx, prefix);
  if (!img) return { id, skip: 'no-image' };
  if (DRY) return { id, dry: true, img: img.slice(0, 60) };
  const alt = (e.question || core).replace(/[\[\]()]/g, '').slice(0, 90);
  e.answer = insertHero(e.answer, `![${alt}](${img})`);
  e.ts = Date.now();
  delete e.images_deferred_at;
  delete e.images_deferred_note;
  e.images_backfilled_at = Date.now();
  e.images_backfill_via = 'ddg-turtle';
  await store.setJSON(`answers/${id}.json`, e);
  return { id, fixed: true, core };
}

async function emailProgress(done, fixed, lastId, lastErr) {
  const html = `<p><b>DDG Turtle heartbeat</b></p>
<ul>
  <li>Processed this session: <b>${done}</b></li>
  <li>Images added: <b>${fixed}</b></li>
  <li>Last: ${lastId || '—'} ${lastErr ? esc(lastErr) : ''}</li>
  <li>Law: publish 12/12 → turtle async → move on</li>
</ul>
<p><i>${new Date().toISOString()}</i></p>`;
  await sendProgressEmail('PULSE DDG Turtle — slow backfill heartbeat', html);
}

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

(async () => {
  if (!ONCE && fs.existsSync(PID_FILE)) {
    try {
      process.kill(Number(fs.readFileSync(PID_FILE, 'utf8')), 0);
      console.error('Another turtle is already running.');
      process.exit(1);
    } catch (_) {}
  }
  if (!ONCE) fs.writeFileSync(PID_FILE, String(process.pid));

  let done = 0;
  let fixed = 0;
  let lastEmail = Date.now();

  turtleLog('started — publish 12/12, turtle cleans covers, you move on');

  for (;;) {
    const next = await findNextId();
    if (!next) {
      turtleLog('queue empty — napping 5 min');
      if (ONCE) break;
      await sleep(5 * 60 * 1000);
      continue;
    }
    try {
      const r = await processOne(next);
      done++;
      if (r.fixed) {
        fixed++;
        turtleLog(`+cover ${r.id} (${r.core?.slice(0, 50) || ''})`);
      } else {
        turtleLog(`${r.id} skip: ${r.skip || r.dry || 'unknown'}`);
      }
    } catch (e) {
      done++;
      turtleLog(`FAIL ${next.id}: ${e.message}`);
    }

    if (Date.now() - lastEmail >= EMAIL_EVERY_MS) {
      lastEmail = Date.now();
      await emailProgress(done, fixed, next.id).catch(() => {});
    }

    if (ONCE) break;
    turtleLog(`pause ${TURTLE_PAUSE_MS / 1000}s…`);
    await sleep(TURTLE_PAUSE_MS);
  }

  try {
    fs.unlinkSync(PID_FILE);
  } catch (_) {}
  turtleLog(`session done processed=${done} fixed=${fixed}`);
})().catch((e) => {
  console.error('FATAL', e);
  try {
    fs.unlinkSync(PID_FILE);
  } catch (_) {}
  process.exit(1);
});
