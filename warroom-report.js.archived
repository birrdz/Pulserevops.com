// warroom-report — POST { prompt, deals[], mode } → Claude Haiku generates
// either an ECharts JSON spec (visual) or a CSV string (download).
//
// Used by the War Room "✨ AI Custom Report" generator on dashboard.html.
// Caps the deals payload server-side to keep the prompt cheap + fast.

const https = require('https');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const MAX_DEALS = 600; // hard cap on deals sent to model
const MAX_DEAL_FIELDS = ['id','name','company','rep','stage','amount','status','industry','size','source','created_at','closed_at','close_date','probability','age_days','region','product','notes'];

function trimDeals(deals) {
  if (!Array.isArray(deals)) return [];
  return deals.slice(0, MAX_DEALS).map(d => {
    const out = {};
    for (const k of MAX_DEAL_FIELDS) if (d[k] !== undefined) out[k] = d[k];
    if (out.notes && typeof out.notes === 'string') out.notes = out.notes.slice(0, 140);
    return out;
  });
}

const VISUAL_SYSTEM = `You are a sales-analytics expert that turns a CRO's plain-English request + a CRM deals dataset into a complete, valid ECharts 5 option JSON object.

Rules:
- Output ONLY the JSON object. No markdown fences, no commentary. Must parse with JSON.parse.
- Use ECharts 5 syntax. Choose the chart type that best answers the user's question (bar/line/pie/scatter/radar/funnel/heatmap/sankey/etc).
- Include: title.text (concise), title.subtext (one line context), legend, tooltip, grid (left:60, right:30, top:60, bottom:50), xAxis, yAxis, series.
- Color palette: ["#E8710A","#FF8C1A","#FFB46A","#a78bfa","#22c55e","#facc15","#06b6d4","#ef4444"].
- Background: transparent. Text color: "#EDE5D8". Axis line color: "rgba(255,255,255,0.15)". Split line color: "rgba(255,255,255,0.06)".
- Use "textStyle":{"color":"#EDE5D8"} on title, axis labels, legend.
- For money axes use axisLabel.formatter that returns "$" + value rounded; never inject JS functions — use ECharts string-template format instead (e.g. "{value}").
- Be honest: if the data doesn't support the chart, return a valid bar chart with one series labelled "Insufficient data" and a single zero value. Never invent data.
- Aggregate the provided deals to answer the question — sum/count/avg as appropriate.

Output: a single JSON object, nothing else.`;

const CSV_SYSTEM = `You are a sales-analytics expert that turns a CRO's plain-English request + a CRM deals dataset into a clean CSV (comma-separated values) report.

Rules:
- Output ONLY the CSV. First line is the header row. No markdown fences, no commentary, no leading blank line.
- 2-12 columns. 1-200 data rows. Include only columns relevant to the user's question.
- Aggregate the provided deals as appropriate (group by, sum, count, avg). Don't dump raw rows unless the user explicitly asks.
- Quote any cell containing a comma or quote per RFC 4180.
- Be honest about gaps: if a value isn't in the data, leave the cell empty (don't fabricate).
- Sort sensibly (by the metric the user cares about, descending).

Output: raw CSV, nothing else.`;

function callClaude(apiKey, system, userMsg) {
  const payload = JSON.stringify({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4096,
    system,
    messages: [{ role: 'user', content: userMsg }],
  });
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.anthropic.com', path: '/v1/messages', method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      timeout: 25000,
    }, (res) => {
      let body = '';
      res.on('data', c => { body += c; });
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(body), raw: body }); }
        catch (e) { resolve({ status: res.statusCode, data: null, raw: body }); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.write(payload);
    req.end();
  });
}

function stripFences(s) {
  if (!s) return s;
  let t = String(s).trim();
  t = t.replace(/^```(?:json|csv)?\s*\n?/i, '').replace(/\n?```\s*$/i, '');
  return t.trim();
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: 'POST only' };

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, reason: 'ANTHROPIC_API_KEY not set' }) };
  }

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch (e) { return { statusCode: 400, headers: CORS, body: 'bad json' }; }

  const prompt = String(body.prompt || '').trim().slice(0, 800);
  const mode = String(body.mode || 'visual').toLowerCase();
  if (!prompt) return { statusCode: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: false, reason: 'prompt required' }) };

  const deals = trimDeals(body.deals);
  if (!deals.length) return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: false, reason: 'no deals provided' }) };

  const dealsJson = JSON.stringify(deals);
  const userMsg = `User request: ${prompt}\n\nDeals dataset (${deals.length} rows):\n${dealsJson}`;

  try {
    const out = { ok: true };

    if (mode === 'visual' || mode === 'both') {
      const r = await callClaude(apiKey, VISUAL_SYSTEM, userMsg);
      const text = r.data?.content?.[0]?.text || '';
      const cleaned = stripFences(text);
      try {
        out.spec = JSON.parse(cleaned);
        out.title = out.spec?.title?.text || prompt.slice(0, 80);
      } catch (e) {
        out.spec_error = 'invalid JSON from model';
        out.spec_raw = cleaned.slice(0, 400);
      }
    }

    if (mode === 'csv' || mode === 'both') {
      const r = await callClaude(apiKey, CSV_SYSTEM, userMsg);
      const text = r.data?.content?.[0]?.text || '';
      out.csv = stripFences(text);
    }

    out.deals_used = deals.length;
    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      body: JSON.stringify(out),
    };
  } catch (e) {
    return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, reason: e.message }) };
  }
};
