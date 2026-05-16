// ═══════════════════════════════════════════════════════════════════════════
// lead-enrich — Clay-lite enrichment via Claude. Takes a JSON body with an
// ICP description and a list of rows ({name, company, title}), returns each
// row scored 1-10 for ICP fit + a one-sentence first-touch hook.
//
// POST body:  { icp: "mid-market solar dealers", rows: [{name,company,title}, ...] }
// Response:   { ok: true, rows: [{name,company,title,fit,hook}, ...] }
// ═══════════════════════════════════════════════════════════════════════════
const https = require('https');

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
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

const PROMPT = (icp, rows) => `You are a B2B prospecting analyst. Score each lead's fit against this ICP and write a one-sentence first-touch hook for each.

ICP: ${icp}

Leads (${rows.length}):
${rows.map((r, i) => `${i+1}. ${r.name} — ${r.company}${r.title ? ' — ' + r.title : ''}`).join('\n')}

For each lead, judge:
- ICP fit on a 1–10 scale (10 = textbook ICP match, 1 = totally wrong)
- A first-touch outreach hook (one sentence, ≤ 25 words, specific to their company/role, no generic "Hope this finds you well")

Return ONLY a valid JSON array with one object per lead in the same order. Each object: { "fit": <number 1-10>, "hook": "<one sentence>" }

No markdown fences, no prose around the JSON. Just the array.`;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ ok: false, error: 'POST only' }) };
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return { statusCode: 503, body: JSON.stringify({ ok: false, error: 'ANTHROPIC_API_KEY missing' }) };
  }

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'invalid json' }) };
  }
  const icp = String(body.icp || '').trim();
  const rows = Array.isArray(body.rows) ? body.rows.slice(0, 25) : [];
  if (!icp || !rows.length) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'need icp + rows' }) };
  }

  try {
    const response = await claudePost({
      model: 'claude-sonnet-4-6',
      max_tokens: 3072,
      messages: [{ role: 'user', content: PROMPT(icp, rows) }],
    });

    const blocks = response?.content || [];
    const textBlock = [...blocks].reverse().find(b => b.type === 'text');
    let raw = (textBlock?.text || '').replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim();

    let parsed = null;
    try { parsed = JSON.parse(raw); } catch (e) {
      const m = raw.match(/\[[\s\S]*\]/);
      if (m) { try { parsed = JSON.parse(m[0]); } catch (e2) {} }
    }
    if (!Array.isArray(parsed)) {
      console.error('[lead-enrich] could not parse, raw:', raw.slice(0, 400));
      return { statusCode: 502, body: JSON.stringify({ ok: false, error: 'parse failed' }) };
    }

    // Merge enrichment back onto input rows in order
    const out = rows.map((r, i) => {
      const e = parsed[i] || {};
      const fit = Number.isFinite(+e.fit) ? Math.max(1, Math.min(10, Math.round(+e.fit))) : null;
      const hook = String(e.hook || '').trim().slice(0, 320);
      return { name: r.name, company: r.company, title: r.title || '', fit, hook };
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, rows: out }),
    };
  } catch (err) {
    console.error('[lead-enrich] error:', err);
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: err.message || 'unknown' }) };
  }
};
