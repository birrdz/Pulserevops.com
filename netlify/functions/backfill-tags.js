// ════════════════════════════════════════════════════════════════════════
// backfill-tags — owner-only one-shot endpoint to scan the library for
// entries with no tags and generate them via Haiku. ~$0.001 per entry.
//
// Auth: ?key=pulsemachine
// POST → { processed, fixed, errors }
// Optional: ?limit=N to cap the run (default 20, max 100)
// ════════════════════════════════════════════════════════════════════════

const https = require('https');

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const ADMIN_KEY = 'pulsemachine';
const HAIKU_MODEL = 'claude-haiku-4-5-20251001';

function initStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) { try { return getStore({ name: 'pulse-machine-library', siteID: sid, token: tok }); } catch (e) { return null; } }
  try { return getStore('pulse-machine-library'); } catch (e) { return null; }
}

function claudePost(payload) {
  return new Promise((resolve) => {
    const data = JSON.stringify(payload);
    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      timeout: 12000,
    }, (res) => {
      let buf = '';
      res.on('data', c => buf += c);
      res.on('end', () => {
        try { resolve({ ok: res.statusCode === 200, data: JSON.parse(buf) }); }
        catch (e) { resolve({ ok: false }); }
      });
    });
    req.on('error', () => resolve({ ok: false }));
    req.on('timeout', () => { req.destroy(); resolve({ ok: false }); });
    req.write(data);
    req.end();
  });
}

async function genTags(question, answer) {
  const r = await claudePost({
    model: HAIKU_MODEL,
    max_tokens: 80,
    system: 'You generate 3-6 short topic tags for a Sales/RevOps knowledge-library entry. Output ONLY the tags, lowercase, hyphenated, comma-separated. No prose. No explanation. Example: comp,ote,enterprise-ae,saas,series-b',
    messages: [{ role: 'user', content: 'QUESTION: ' + String(question).slice(0, 200) + '\n\nANSWER (excerpt):\n' + String(answer).slice(0, 1200) + '\n\nReturn 3-6 tags only.' }],
  });
  if (!r.ok) return [];
  const blocks = (r.data && r.data.content) || [];
  let txt = '';
  for (const b of blocks) { if (b.type === 'text' && b.text) txt += b.text; }
  return txt
    .replace(/\*\*/g, '')
    .replace(/^.*?:\s*/, '')
    .split(/[,\n·]/)
    .map(t => t.trim().toLowerCase().replace(/^[#-]+/, '').replace(/[\.\s]+$/, ''))
    .filter(t => t && t.length < 50)
    .map(t => t.replace(/\s+/g, '-'))
    .filter(t => /^[a-z0-9-]+$/.test(t))
    .slice(0, 8);
}

exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  if (params.key !== ADMIN_KEY) return { statusCode: 403, body: 'forbidden' };
  if (!process.env.ANTHROPIC_API_KEY) return { statusCode: 500, body: 'no api key' };

  const store = initStore();
  if (!store) return { statusCode: 500, body: 'no store' };

  const limit = Math.min(parseInt(params.limit, 10) || 20, 100);

  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const candidates = (idx.entries || []).filter(e => !e.tags || !e.tags.length).slice(0, limit);

  const results = { processed: 0, fixed: 0, errors: 0, fixed_ids: [] };

  for (const e of candidates) {
    results.processed++;
    try {
      const full = await store.get('answers/' + e.id + '.json', { type: 'json' });
      if (!full) { results.errors++; continue; }
      const newTags = await genTags(full.question, full.answer);
      if (newTags.length >= 2) {
        full.tags = newTags;
        await store.setJSON('answers/' + e.id + '.json', full);
        // Update index entry too
        const idxEntry = idx.entries.find(x => x.id === e.id);
        if (idxEntry) idxEntry.tags = newTags;
        results.fixed++;
        results.fixed_ids.push({ id: e.id, tags: newTags });
      } else {
        results.errors++;
      }
    } catch (err) {
      results.errors++;
    }
  }

  if (results.fixed > 0) {
    try { await store.setJSON('_index.json', idx); } catch (e) {}
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, ...results }),
  };
};
