// One-shot + reusable: push tail q*.json entries into the Head's
// pulse-machine-library blob store. Run with BLOBS_PAT env var set.
//
// Usage:
//   BLOBS_PAT=<token> node lab/tail-to-head.js [--limit N]
//
// Default writes ALL valid q*.json. Use --limit to write only the first N
// (useful for incremental drip-into-head from the loop).
const fs = require('fs');
const path = require('path');
const https = require('https');
const { getStore } = require('@netlify/blobs');

const LAB_DIR = path.join(__dirname, 'cheap-100');
const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOKEN = process.env.BLOBS_PAT;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

// Pre-bake the In-Between voice translation at promote time so the per-entry
// page can default-render In-Between without an on-demand API call.
// Skips silently if ANTHROPIC_API_KEY isn't set; the page falls back to operator.
async function bakeInBetween(question, answer) {
  if (!ANTHROPIC_KEY || !answer) return null;
  const SYSTEM = `You translate B2B/SaaS/RevOps library entries into the IN-BETWEEN voice — clear-but-substantive, MBA-adjacent reader, knows what NRR roughly is but doesn't want jargon walls. Translate dense terms into accessible phrasing while keeping all named numbers, named companies, named executives.\n\nJARGON EXPANSION: ON FIRST USE of any acronym (ARR, NRR, cRPO, ACV, OTE, SIEM, APM, ITSM, GTM, FCF, GM, S&M, R&D, FY, PE, M&A, SaaS, PLG, RPA, LLM, MCP, FedRAMP, RPO, ICP, ROI, TCO, GRC, API, GPU, etc.), spell out the full meaning in parentheses inline. Example: "ARR (Annual Recurring Revenue)". After first use, the bare acronym is fine. Assume the reader hasn't worked in B2B SaaS.\n\nGLOSSARY SECTION: AT THE END of every entry, AFTER Tags + Sources, ADD a "## Definitions" section as a bullet list of every acronym/jargon term used in the entry. Format: "**ACRONYM** — Full Name. One-sentence plain-English explanation."\n\nABSOLUTE PRESERVATION: same number of sections, same number of bullets, same markdown tables (translate text, keep structure), same mermaid blocks (translate node labels only, keep graph structure), same source URLs unchanged, same cross-link references (q1610 etc), target length within +/-25% of original (longer ok due to expansions + glossary). Output ONLY the translated markdown — no preamble.`;
  const payload = JSON.stringify({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 8000,
    system: SYSTEM,
    messages: [{ role: 'user', content: `Question: ${question}\n\nOriginal answer (markdown):\n${answer}\n\nTranslate to In-Between voice now.` }],
  });
  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'api.anthropic.com', path: '/v1/messages', method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      timeout: 45000,
    }, (res) => {
      let body = '';
      res.on('data', c => { body += c; });
      res.on('end', () => {
        try {
          const j = JSON.parse(body);
          const text = j?.content?.[0]?.text;
          resolve((text && text.trim().length > 200) ? text.trim() : null);
        } catch (e) { resolve(null); }
      });
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
    req.write(payload);
    req.end();
  });
}

if (!TOKEN) {
  console.error('BLOBS_PAT env var required');
  process.exit(1);
}

const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: TOKEN });

// Optional: --only=<id> to push just one specific entry (for per-tick drip)
const only = (process.argv.find(a => a.startsWith('--only=')) || '').slice(7);
const limitArg = process.argv.find(a => a.startsWith('--limit='));
const limit = limitArg ? parseInt(limitArg.slice(8), 10) : Infinity;

(async () => {
  // Read existing index
  let idx;
  try { idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] }; }
  catch (e) { idx = { entries: [] }; }
  const existing = new Set(idx.entries.map(e => e.id));
  console.log('head index entries (pre):', idx.entries.length);

  // Load tail entries
  const files = fs.readdirSync(LAB_DIR)
    .filter(f => /^q\d+\.json$/.test(f))
    .sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));

  let pushed = 0, skipped = 0, broken = 0;
  for (const f of files) {
    if (only && !f.startsWith(only + '.')) continue;
    if (pushed >= limit) break;
    let entry;
    try { entry = JSON.parse(fs.readFileSync(path.join(LAB_DIR, f), 'utf8')); }
    catch (e) { broken++; continue; }
    if (!entry.id || !entry.question || !entry.answer) { broken++; continue; }
    if (existing.has(entry.id)) { skipped++; continue; }

    // Stamp ts at PUSH time so "added today" + run-rate counters reflect actual
    // posting events, not whatever the worker hardcoded into the JSON file.
    const pushTs = Date.now();
    // Bake step KILLED 2026-05-04 per owner — $0 ongoing API cost, all entries
    // (old + new) now consistently show original Operator voice. Re-enable by
    // uncommenting the bakeInBetween call if In-Between default ever returns.
    // const answerBetween = await bakeInBetween(entry.question, entry.answer);
    // Write per-entry file
    await store.setJSON('answers/' + entry.id + '.json', {
      id: entry.id,
      question: entry.question,
      answer: entry.answer,
      tags: entry.tags || [],
      sources: entry.sources || [],
      ts: pushTs,
      model: entry.model || 'claude-haiku-4-5',
      lab_run: entry.lab_run || 'tail-import',
    });
    // Add to index
    idx.entries.push({
      id: entry.id,
      question: entry.question,
      tags: entry.tags || [],
      ts: pushTs,
    });
    existing.add(entry.id);
    pushed++;
    if (pushed % 50 === 0) console.log('  pushed', pushed);
  }

  // Sort index by numeric q-id DESC (newest q-id at top). Fall back to ts.
  // ts isn't reliable because workers hardcode the same ts value across drip ticks.
  idx.entries.sort((a, b) => {
    const na = parseInt(String(a.id).match(/\d+/)?.[0] || '0', 10);
    const nb = parseInt(String(b.id).match(/\d+/)?.[0] || '0', 10);
    if (nb !== na) return nb - na;
    return (b.ts || 0) - (a.ts || 0);
  });

  await store.setJSON('_index.json', idx);

  // Mirror Head index IDs to a local cache so build-mega-page.js can filter
  // queue page (/answers.html) to entries NOT yet posted to Head.
  try {
    const cachePath = path.join(__dirname, 'head-index-cache.json');
    fs.writeFileSync(cachePath, JSON.stringify({
      updated_at: new Date().toISOString(),
      total: idx.entries.length,
      ids: idx.entries.map(e => e.id),
    }), 'utf8');
  } catch (e) { console.warn('cache write failed:', e.message); }

  // Ping IndexNow with per-entry URLs we just pushed. Faster Bing/Yandex/Seznam
  // indexing than relying on sitemap crawl. Silent on failure.
  if (pushed > 0 && only) {
    try {
      const pingUrls = [
        'https://pulserevops.com/knowledge/' + only,
        'https://pulserevops.com/knowledge.html',
      ];
      const r = await fetch('https://pulserevops.com/.netlify/functions/indexnow-ping?key=pulsemachine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: pingUrls }),
      });
      if (r.ok) {
        const j = await r.json().catch(() => ({}));
        console.log('indexnow:', j.submitted || pingUrls.length, 'urls submitted');
      } else {
        console.warn('indexnow non-200:', r.status);
      }
    } catch (e) { console.warn('indexnow ping err:', e.message); }
  }

  console.log('done:', { pushed, skipped, broken, total_now: idx.entries.length });
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
