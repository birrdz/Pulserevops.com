// ════════════════════════════════════════════════════════════════════════
// pulse-knowledge — receives "knowledge offerings" from visitors before
// they can ask The Machine. Uses Claude Haiku as a cheap fast classifier:
// real sales/business insight passes, junk gets rejected, user re-tries.
//
// POST { text }   → { ok, accepted, reason?, count }
// GET  ?count=1   → { count }   (tally of accepted offerings)
//
// Storage: Netlify Blobs (key "offerings/<ts>-<id>.json"). Total count
// kept in "offerings/_count.json" for fast reads.
// ════════════════════════════════════════════════════════════════════════
const https = require('https');

let getStore = null;
let _blobLoadErr = null;
try {
  const blobs = require('@netlify/blobs');
  getStore = blobs.getStore;
} catch (e) {
  _blobLoadErr = (e && e.message) ? String(e.message).slice(0, 200) : 'require failed';
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const CLASSIFIER_PROMPT = `You are a strict gatekeeper for a sales-knowledge community. Decide if the user's submission is GENUINE sales / GTM / SaaS / business / leadership knowledge — a real insight, lesson, stat, play, framework, or observation.

REJECT if it's any of:
- Gibberish, random characters, copy-paste fillers
- Off-topic (recipes, sports, politics, code, personal life unrelated to sales)
- Obvious AI-generated platitudes with zero specificity ("communication is key", "be authentic")
- Promotional spam, links to products, self-promotion of services
- Profanity-only or offensive content
- Less than one substantive sentence

ACCEPT if it's:
- A specific lesson learned, even short
- A useful stat or benchmark
- A named tactic, play, or framework
- A pattern they observed in their team / market / vertical
- A hot take with reasoning (even if the reasoning is one line)

When you ACCEPT, ALSO extract a 2-4 word topic — the absorbed-knowledge label that goes on the wall poster. Make it terse and uppercase-ish (the page caps it). Examples: "DISCOVERY CALL FRAMING", "SDR-AE HANDOFF", "DISCOUNT GUARDRAILS", "PIPELINE HYGIENE", "RAMP COMP", "WIN RATE LIFT".

Respond with EXACTLY one of:
ACCEPT
TOPIC: <2-4 word phrase>

— or —

REJECT: <brief reason in ≤ 15 words>

Nothing else. No quotes around the topic.`;

function claudePost(payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const opts = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
    };
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => {
        try { resolve({ ok: res.statusCode === 200, status: res.statusCode, data: JSON.parse(data) }); }
        catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function readCount(store) {
  if (!store) return null;
  try {
    const cur = await store.get('_count.json', { type: 'json' });
    return cur && Number.isFinite(cur.count) ? cur.count : 0;
  } catch (e) { return 0; }
}
async function bumpCount(store) {
  if (!store) return null;
  try {
    const cur = await readCount(store);
    const next = (cur || 0) + 1;
    await store.setJSON('_count.json', { count: next, ts: Date.now() });
    return next;
  } catch (e) { return null; }
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };

  let store = null;
  let _storeInitErr = _blobLoadErr;
  // Try the auto-injected runtime context first; if that fails, fall back to
  // explicit siteID + NETLIFY_BLOBS_TOKEN env var (CLI-deploys don't get the
  // automatic context, so the explicit form is what unblocks them).
  function _initStore() {
    if (!getStore) { _storeInitErr = _storeInitErr || 'getStore not loaded'; return null; }
    const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
    const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
    // If token env var exists, use explicit creds (works on CLI deploys).
    if (tok && sid) {
      try { return getStore({ name: 'pulse-machine-offerings', siteID: sid, token: tok }); }
      catch (e2) {
        _storeInitErr = (e2 && e2.message) ? String(e2.message).slice(0, 200) : 'explicit init failed';
        return null;
      }
    }
    // Otherwise auto-context (only works for Netlify-build deploys).
    try { return getStore('pulse-machine-offerings'); }
    catch (e1) {
      _storeInitErr = (e1 && e1.message) ? String(e1.message).slice(0, 200) : 'auto init failed; set NETLIFY_BLOBS_TOKEN';
      return null;
    }
  }
  store = _initStore();

  // ── GET: tally + optional recent feed for the "Thoughts I took today" wall poster ──
  if (event.httpMethod === 'GET') {
    const params = event.queryStringParameters || {};
    const wantRecent = params.recent || params.feed;
    const count = await readCount(store);
    let recent = [];
    if (wantRecent && store) {
      try {
        const limit = Math.max(1, Math.min(40, parseInt(params.recent, 10) || 12));
        // List blob keys under offerings/, sort by ts desc, read top N
        const list = await store.list({ prefix: 'offerings/' });
        const keys = (list && list.blobs ? list.blobs : []).map(b => b.key);
        keys.sort();
        keys.reverse();
        const top = keys.slice(0, limit * 2); // overfetch in case some are stale
        const items = await Promise.all(top.map(k => store.get(k, { type: 'json' }).catch(() => null)));
        recent = items
          .filter(Boolean)
          .map(it => ({
            ts: it.ts || Date.now(),
            topic: it.topic ? String(it.topic).slice(0, 48) : null,
            text:  String(it.text || '').slice(0, 240),
          }))
          .sort((a, b) => b.ts - a.ts)
          .slice(0, limit);
      } catch (e) {
        try { console.error('[pulse-knowledge] list err', e && e.message); } catch(_){}
      }
    }
    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ count: count == null ? 0 : count, recent }),
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: 'POST or GET only' };
  }

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch (e) { return { statusCode: 400, headers: CORS, body: JSON.stringify({ ok:false, reason:'bad json' }) }; }

  const text = String(body.text || '').trim();
  if (text.length < 12 || text.length > 1200) {
    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok:false, accepted:false, reason: 'too short / too long' }),
    };
  }

  // Cheap pre-filter: looks like keyboard mashing? reject.
  if (!/[a-zA-Z]/.test(text) || /^[a-z]{20,}$/i.test(text.replace(/\s+/g,''))) {
    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok:false, accepted:false, reason: 'looks like noise' }),
    };
  }

  // ── Free local "dumb-check" classifier — no API spend ───────────────
  // Reject obvious gibberish / spam without calling Claude. Topic is just
  // a short auto-derived snippet (first 3-4 sales-y words / fallback to
  // first 4 words). Lower bar than the AI classifier but $0/submission.
  let verdict = 'ACCEPT';
  let reason  = '';
  let topic   = '';
  (function localClassify() {
    const t = text.trim();
    // Must have letters
    if (!/[a-zA-Z]/.test(t)) { verdict = 'REJECT'; reason = 'looks like noise — try again'; return; }
    // Reject runs of 18+ identical chars (keyboard mashing)
    if (/(.)\1{17,}/.test(t)) { verdict = 'REJECT'; reason = 'looks like keyboard mashing'; return; }
    // Must contain a vowel somewhere (real words)
    if (!/[aeiouAEIOU]/.test(t.replace(/\s+/g, ''))) { verdict = 'REJECT'; reason = 'no real words'; return; }
    // Reject if 80%+ of characters are the same one
    const counts = {};
    for (const c of t.toLowerCase().replace(/\s/g,'')) counts[c] = (counts[c]||0)+1;
    const top = Math.max(0, ...Object.values(counts));
    if (top / Math.max(1, t.replace(/\s/g,'').length) > 0.8) { verdict = 'REJECT'; reason = 'low character variety'; return; }
    // Derive a cheap topic — first 3 meaningful words, uppercased
    const words = t.replace(/[^\w\s\-]/g, ' ').split(/\s+/).filter(w => w.length > 2);
    topic = words.slice(0, 3).join(' ').toUpperCase().slice(0, 40);
  })();

  if (verdict === 'REJECT') {
    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok:false, accepted:false, reason: reason || 'try again with real sales knowledge' }),
    };
  }

  // ── Persist to Blob (best-effort) ───────────────────────────────────
  let count = null;
  let blobErr = null;
  if (store) {
    try {
      const id  = (Date.now().toString(36) + Math.random().toString(36).slice(2, 8));
      const ipH = (event.headers && (event.headers['x-nf-client-connection-ip'] || event.headers['x-forwarded-for'] || '')).toString().split(',')[0].trim();
      await store.setJSON('offerings/' + id + '.json', {
        id,
        ts: Date.now(),
        text,
        topic: topic || null,
        ip_hash: ipH ? simpleHash(ipH) : null,
        ua: (event.headers && event.headers['user-agent']) ? String(event.headers['user-agent']).slice(0, 240) : null,
      });
      count = await bumpCount(store);
    } catch (e) {
      blobErr = (e && e.message) ? String(e.message).slice(0, 240) : 'blob err';
      try { console.error('[pulse-knowledge] store err', blobErr); } catch(_){}
    }
  } else {
    blobErr = _storeInitErr || 'store unavailable';
  }

  // Diagnostic: surface env-var state so we can see if the token's actually there
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN || '';
  const diag = {
    has_blobs_pat:   !!process.env.BLOBS_PAT,
    has_blobs_token: !!process.env.NETLIFY_BLOBS_TOKEN,
    has_auth_token:  !!process.env.NETLIFY_AUTH_TOKEN,
    token_len:       tok.length,
    site_id_set:     !!process.env.NETLIFY_SITE_ID,
  };

  return {
    statusCode: 200,
    headers: { ...CORS, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok:true, accepted:true, count: count || null, blob_err: blobErr, diag }),
  };
};

// Tiny non-cryptographic hash so we don't store raw IPs
function simpleHash(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}
