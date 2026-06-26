// _ds_regen_grounded.js — regenerate fabricated Top-10 entries GROUNDED in real
// web-searched entities, so the model can't invent venue/product names again.
// Per entry: Serper-search the topic → feed real results to DeepSeek as grounding
// → GUARDRAIL: every ranked name must appear in the search results → publish
// (publishTextFirst overwrites the blob with a fresh entry that has no `noindex`,
// so a successful regen auto-clears the noindex). One-at-a-time (from-scratch).
//
//   node _ds_regen_grounded.js <prefix> <minNum> [maxNum] [--limit=N] [--dry]
//   node _ds_regen_grounded.js --ids=pt0030,pt0035,pt0055
require('./_ds_lib');
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { generateGradedBody } = require('./_ds_gen_any');
const { publishTextFirst } = require('./_ds_publish');

const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const store = () => getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });

const args = process.argv.slice(2);
const flag = (k, d) => { const a = args.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const DRY = args.includes('--dry');
const LIMIT = parseInt(flag('limit', '0'), 10) || 0;
const IDS = flag('ids', '');

async function serper(q) {
  const r = await fetch('https://google.serper.dev/search', {
    method: 'POST', headers: { 'X-API-KEY': process.env.SERPER_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ q, num: 20 }),
  });
  const j = await r.json().catch(() => ({}));
  const org = j.organic || [];
  return org.map((o) => `${o.title || ''} — ${o.snippet || ''} (${o.link || ''})`).join('\n');
}

function searchQuery(title) {
  return String(title || '').replace(/^top\s*\d+\s*/i, 'best ').trim();
}
function h2Names(body) {
  const out = []; const re = /^##\s*\d+\.\s*(.+)$/gm; let m;
  while ((m = re.exec(body))) {
    out.push(String(m[1]).replace(/🏆|💎|BEST OVERALL|BEST VALUE|[*_`]/g, '').replace(/\s[—–-]\s.*$/, '').trim());
  }
  return out;
}

async function listIds() {
  if (IDS) return IDS.split(',').map((s) => s.trim()).filter(Boolean);
  const pfx = (args[0] || '').toLowerCase();
  const min = parseInt(args[1] || '0', 10);
  const max = parseInt(args[2] && /^\d+$/.test(args[2]) ? args[2] : '999999', 10);
  if (!pfx) { console.error('usage: _ds_regen_grounded.js <prefix> <min> [max] | --ids=a,b'); process.exit(1); }
  const ids = []; let cursor;
  const s = store();
  do {
    const res = await s.list({ prefix: 'answers/' + pfx, cursor });
    for (const b of res.blobs) { const m = b.key.match(new RegExp('^answers/(' + pfx + '(\\d+))\\.json$')); if (m) { const n = +m[2]; if (n >= min && n <= max) ids.push(m[1]); } }
    cursor = res.cursor;
  } while (cursor);
  ids.sort();
  return ids;
}

(async () => {
  const s = store();
  let ids = await listIds();
  if (LIMIT) ids = ids.slice(0, LIMIT);
  console.log(`REGEN-GROUNDED: ${ids.length} entries${DRY ? ' (DRY)' : ''}`);
  let ok = 0, skip = 0, fail = 0;
  for (const id of ids) {
    const rec = await s.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
    if (!rec || !rec.question) { console.log(`SKIP ${id} (no blob)`); skip++; continue; }
    const title = rec.question;
    try {
      const sources = await serper(searchQuery(title));
      if (!sources || sources.length < 200) { console.log(`SKIP ${id} thin-search`); skip++; continue; }
      const grounding = `CRITICAL GROUNDING — below are REAL Google results for this topic. Rank ONLY real, specific, currently-operating places/products whose names appear in these results. NEVER invent a name. If unsure something is real, drop it and use another real one from the results. Use each venue's real, exact name.\n\nSEARCH RESULTS:\n${sources}`;
      const gen = await generateGradedBody(id, title, { kind: 'top10', grounding, maxTries: 2 });
      const names = h2Names(gen.body);
      const srcLower = sources.toLowerCase();
      const unverified = names.filter((n) => n.length > 2 && !srcLower.includes(n.toLowerCase()));
      // Guardrail: need a real Top-10 and most names verifiable in the sources.
      if (names.length < 8 || unverified.length > 3) {
        console.log(`FAIL-GUARD ${id} names=${names.length} unverified=${unverified.length} [${unverified.slice(0, 4).join(' | ')}]`);
        fail++; continue;
      }
      if (DRY) { console.log(`DRY-OK ${id} names=${names.length} unverified=${unverified.length} score=${gen.grade.score}`); ok++; continue; }
      fs.writeFileSync(`C:/Users/koryj/${id}_answer.md`, gen.body);
      const res = await publishTextFirst(id, title);
      if (res.ok) { console.log(`OK ${id} ${res.words}w unverified=${unverified.length} ${res.url}`); ok++; }
      else { console.log(`FAIL-PUB ${id} ${res.reason} score=${res.score} ${(res.missing || []).join(',')}`); fail++; }
    } catch (e) { console.log(`ERR ${id} ${e.message}`); fail++; }
  }
  console.log(`DONE regen ok=${ok} skip=${skip} fail=${fail}`);
})().catch((e) => { console.error('FATAL', e && e.message); process.exit(1); });
