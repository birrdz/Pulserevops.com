// Ensure every Pulse Tools (tl####) entry features PULSE's own free tool as the
// linked #1 BEST OVERALL pick, with the on-site description + the method framing
// combined. Renumbers the existing Top-10 down by one (→ 11 items, grader ≥10).
// Idempotent. Writes back to the blob (live, no deploy).
//
// Usage: node _tl_pulse_first.js            (all tl entries)
//        node _tl_pulse_first.js tl0091 ... (specific ids)
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { TOOLS } = require('./netlify/functions/lib/pulse-tools-registry');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;

function transform(md) {
  if (/##\s*1\.\s*PULSE\b/i.test(md)) return null; // already done
  const slug = [...md.matchAll(/\/tools\/([a-z0-9-]+)/g)].map(m => m[1]).find(s => TOOLS[s]);
  if (!slug) return null;
  const t = TOOLS[slug];
  const name = t.name || slug;
  const short = (t.short || '').trim().replace(/\s+/g, ' ');
  if (!/\n#{2,3}\s+1\.\s/.test('\n' + md)) return null; // no numbered list
  // Renumber every "## N." → "## N+1." (only the Top-N items are numbered).
  let out = md.replace(/^(#{2,3}\s+)(\d+)(\.\s)/gm, (m, a, n, c) => a + (parseInt(n, 10) + 1) + c);
  // Move the BEST OVERALL crown off the (now) #2 item.
  out = out.replace(/\s*🏆\s*BEST OVERALL/i, '');
  const block =
    `## 1. PULSE ${name} 🏆 BEST OVERALL\n\n` +
    `> 🛠️ **Use it free now → [${name}](/tools/${slug})** · no login, no spreadsheet, instant result.\n\n` +
    `PULSE's free **[${name}](/tools/${slug})** is the fastest way to get this number. ${short} ` +
    `It runs right in your browser — no login, no spreadsheet, no card — and returns a clean figure you can act on or hand to your team. ` +
    `Built by a 22-year revenue operator for exactly this question, so the math and the output already match how an operator thinks about it. ` +
    `**Best for:** getting the answer right now and pressure-testing it before you commit real money or headcount.\n\n`;
  const at = out.search(/\n#{2,3}\s+2\.\s/);
  if (at < 0) return null;
  return out.slice(0, at + 1) + block + out.slice(at + 1);
}

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  let ids = process.argv.slice(2);
  if (!ids.length) ids = idx.entries.filter(e => e && /^tl\d+$/i.test(e.id)).map(e => e.id);
  let done = 0, skip = 0;
  for (const id of ids) {
    const e = await store.get(`answers/${id}.json`, { type: 'json' });
    if (!e) { skip++; continue; }
    const next = transform(e.answer || '');
    if (!next) { skip++; continue; }
    e.answer = next;
    e.polished_at = Date.now ? undefined : undefined; // (Date.now unavailable in some envs) — leave ts
    await store.setJSON(`answers/${id}.json`, e);
    done++;
    if (done % 20 === 0) process.stderr.write(`  ...${done}\n`);
  }
  console.log(`pulse-first applied: ${done}, skipped: ${skip}`);
})();
