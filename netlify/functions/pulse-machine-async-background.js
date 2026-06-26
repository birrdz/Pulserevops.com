// pulse-machine-async-background — Netlify Background Function (15-min timeout).
// Runs the heavy Claude call + web_search, writes the result to blob storage
// keyed by request_id. Client polls /pulse-machine-status?id=<request_id>
// for the result.
//
// Triggered by: pulse-machine.js POSTing to this endpoint when a cache miss
// requires a real Claude generation. Returns 202 immediately to the caller.
//
// POST { request_id, message, history?, system_prompt }
const https = require('https');

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

function initBlob(name) {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  try { return getStore(name); }
  catch (e1) { if (tok && sid) { try { return getStore({ name, siteID: sid, token: tok }); } catch (e2) { return null; } } return null; }
}

function claudePost(payload) {
  return new Promise((resolve) => {
    const body = JSON.stringify(payload);
    const req = https.request({
      hostname: 'api.anthropic.com', path: '/v1/messages', method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      timeout: 600000, // 10-min API call cap
    }, (res) => {
      let buf = '';
      res.on('data', c => { buf += c; });
      res.on('end', () => {
        try {
          const j = JSON.parse(buf);
          resolve({ ok: res.statusCode === 200, status: res.statusCode, data: j, raw: buf });
        } catch (e) { resolve({ ok: false, status: res.statusCode, raw: buf }); }
      });
    });
    req.on('error', (err) => resolve({ ok: false, status: 0, raw: err.message }));
    req.on('timeout', () => { req.destroy(); resolve({ ok: false, status: 0, raw: 'timeout' }); });
    req.write(body); req.end();
  });
}

const { isVisitorPriorityActive } = require('./lib/visitor-priority');

exports.handler = async (event) => {
  /* visitor-priority-injected */
  try {
    let __vp_getStore = null;
    try { __vp_getStore = require('@netlify/blobs').getStore; } catch (_e) {}
    if (__vp_getStore) {
      let __vp_store = null;
      try { __vp_store = __vp_getStore('pulse-machine-library'); }
      catch (_e) {
        const __vp_tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
        const __vp_sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
        if (__vp_tok && __vp_sid) {
          try { __vp_store = __vp_getStore({ name: 'pulse-machine-library', siteID: __vp_sid, token: __vp_tok }); } catch (_e2) {}
        }
      }
      if (__vp_store && await isVisitorPriorityActive(__vp_store)) {
        return { statusCode: 200, body: JSON.stringify({ ok: true, paused: 'visitor-priority' }) };
      }
    }
  } catch (_e) {}

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch (e) { return { statusCode: 400, body: 'bad json' }; }

  const { request_id, message, history, system_prompt } = body;
  if (!request_id || !message) return { statusCode: 400, body: 'request_id + message required' };

  const resultStore = initBlob('pulse-machine-async');
  if (!resultStore) return { statusCode: 500, body: 'blob unavailable' };

  // Mark as in-progress immediately so status checks know it started
  await resultStore.setJSON(request_id + '.json', { status: 'running', started_at: Date.now() });

  // Build the messages stack
  const messages = [];
  if (Array.isArray(history)) {
    history.slice(-6).forEach(h => {
      if (h && h.q && h.a) {
        messages.push({ role: 'user', content: String(h.q) });
        messages.push({ role: 'assistant', content: String(h.a) });
      }
    });
  }
  messages.push({ role: 'user', content: message });

  // Pull fresh-feed context (same as sync function)
  let feedContext = '';
  try {
    const feedStore = initBlob('pulse-machine-feed');
    const feed = feedStore && (await feedStore.get('latest.json', { type: 'json' }));
    if (feed && Array.isArray(feed.entries) && feed.entries.length) {
      const top = feed.entries.slice(0, 12);
      feedContext = '\n\nFRESH SCANNED INTEL (last few hours, use when relevant — cite the URL):\n'
        + top.map(e => `- [${e.topic||'misc'}] ${e.headline}${e.url ? ' — ' + e.url : ''}`).join('\n');
    }
  } catch (e) { /* skip */ }

  // Heavy call — Haiku, max_tokens 900, NO web_search.
  // Tuned for UNDER 15s end-to-end: 900 tokens generates in ~12-13s on Haiku.
  // Trade-off: tighter answers (still mermaid + table when relevant). Library
  // cache handles deeper queries via 0.55+ keyword overlap.
  const t0 = Date.now();
  const response = await claudePost({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 900,
    system: (system_prompt || '') + feedContext,
    messages,
  });
  const elapsedMs = Date.now() - t0;
  console.log('[pulse-machine-async]', request_id, response.status, 'in', elapsedMs, 'ms');

  if (!response.ok) {
    await resultStore.setJSON(request_id + '.json', {
      status: 'error',
      reason: 'claude api error: ' + response.status,
      raw_snippet: (response.raw || '').toString().slice(0, 400),
      elapsed_ms: elapsedMs,
      finished_at: Date.now(),
    });
    return { statusCode: 200, body: 'logged' };
  }

  // Extract text + sources from Claude response (may include web_search results)
  let replyText = '';
  const sources = [];
  try {
    const blocks = response.data && response.data.content;
    if (Array.isArray(blocks)) {
      blocks.forEach(b => {
        if (b.type === 'text' && b.text) replyText += b.text;
        if (b.type === 'web_search_tool_result' && Array.isArray(b.content)) {
          b.content.forEach(r => {
            if (r && r.url) sources.push({ url: r.url, title: r.title || '' });
          });
        }
      });
    }
  } catch (e) { /* parse fail */ }

  const finalReply = replyText.trim() || 'The Machine fell silent. Try rephrasing.';

  await resultStore.setJSON(request_id + '.json', {
    status: 'ready',
    reply: finalReply,
    sources,
    elapsed_ms: elapsedMs,
    finished_at: Date.now(),
  });

  // ── AUTO-PROMOTE TO LIBRARY ──────────────────────────────────────────
  // When a visitor asks a real question and gets a real answer, add it to
  // the library so the next visitor finds it via cache. Guardrails: skip
  // short questions, short answers, error placeholders.
  try {
    const isQualityAnswer = finalReply.length >= 600
      && !/fell silent|machine is silent|couldn't reach/i.test(finalReply);
    const isQualityQuestion = String(message || '').trim().length >= 15;
    if (isQualityAnswer && isQualityQuestion) {
      const libStore = initBlob('pulse-machine-library');
      if (libStore) {
        const visitorId = 'vq_' + request_id.replace(/^rq_/, '');
        const tags = inferTags(message, finalReply);
        const ts = Date.now();
        await libStore.setJSON('answers/' + visitorId + '.json', {
          id: visitorId,
          question: String(message).slice(0, 320),
          answer: finalReply,
          tags,
          sources: sources.map(s => s && s.url).filter(Boolean),
          ts,
          model: 'claude-haiku-4-5-20251001',
          lab_run: 'visitor-asked',
          source: 'visitor',
          quality_score: 5,
        });
        // Add to index (read-modify-write)
        try {
          const idx = (await libStore.get('_index.json', { type: 'json' })) || { entries: [] };
          // Skip if same question text already in index (rough dedupe)
          const norm = String(message).toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
          const dupe = idx.entries.find(e => String(e.question || '').toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim() === norm);
          if (!dupe) {
            idx.entries.unshift({ id: visitorId, question: String(message).slice(0, 320), tags, ts, source: 'visitor', quality_score: 5 });
            await libStore.setJSON('_index.json', idx);
          }
        } catch (_eIdx) { /* non-fatal */ }
      }
    }
  } catch (_eLib) { console.error('[pulse-machine-async] library auto-promote err', _eLib && _eLib.message); }

  return { statusCode: 200, body: 'ok' };
};

// Cheap tag inference from question + answer keywords. Maps to existing
// library tag taxonomy. Returns 3-6 tags max.
function inferTags(question, answer) {
  const text = (String(question) + ' ' + String(answer || '').slice(0, 1000)).toLowerCase();
  const KEYWORDS = {
    'comp': /\b(ote|comp plan|commission|accelerator|spiff|base salary|pay mix)\b/,
    'ote': /\bote\b/,
    'sdr': /\bsdr\b|sales develop/,
    'ae': /\bae\b|account exec/,
    'cro': /\bcro\b|chief revenue/,
    'forecast': /\bforecast/,
    'pipeline': /\bpipeline|pipeline coverage/,
    'churn': /\bchurn|retention/,
    'nrr': /\bnrr\b|net revenue retention/,
    'cac': /\bcac\b|customer acquisition cost/,
    'ramp': /\bramp\b|new hire ramp/,
    'coaching': /\bcoaching\b/,
    'enterprise': /\benterprise\b/,
    'mid-market': /\bmid-?market\b/,
    'smb': /\bsmb\b|small business/,
    'plg': /\bplg\b|product-led/,
    'hubspot': /\bhubspot\b/,
    'salesforce': /\bsalesforce\b/,
    'outreach': /\boutreach\b/,
    'apollo': /\bapollo\b/,
    'gong': /\bgong\b/,
    'salesloft': /\bsalesloft\b/,
    'ai-strategy': /\bai\b/,
    'gtm-strategy': /\bgtm\b|go-to-market/,
    'visitor-asked': /.*/,
  };
  const out = [];
  for (const [tag, re] of Object.entries(KEYWORDS)) {
    if (re.test(text)) out.push(tag);
    if (out.length >= 6) break;
  }
  if (!out.includes('visitor-asked')) out.push('visitor-asked');
  return out;
}
