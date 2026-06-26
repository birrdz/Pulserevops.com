// Quality answers via LLM cascade: Gemini (pro first) → Grok → Groq → Claude (optional).
// Set SKIP_ANTHROPIC_LLM=1 when Claude/Anthropic is down — skips Claude entirely.

const https = require('https');
const { finalizeEconomyAnswer, countWords, MIN_WORDS } = require('./economy-answer-quality');
const { geminiApiKey, grokApiKey } = require('./load-env');

const SYSTEM = `You write one library answer for the exact question below.

LENGTH (required): **1,000–1,200 words** of substantive prose. Use ## headings: Direct Answer, What to do (numbered steps), metrics, common mistakes, Bottom line.

QUALITY:
- First paragraph must directly answer the question — no template filler.
- College football NIL: write for ADs/collectives at the named school — not generic RevOps.
- B2B RevOps: name the CRM/tool from the question and the specific failure mode.
- Every section must add new detail (tools, steps, numbers, dates, names).

MERMAID (required — must render in Mermaid 10):
- Exactly one \`\`\`mermaid fenced block.
- Start with \`flowchart TD\` or \`flowchart LR\` (not \`graph\`).
- 6–10 nodes. Use simple IDs: A, B, C…
- Node labels in double quotes: A["Roster tiers"] not A[Roster (tiers)].
- Edges: A --> B or A -->|label| B — NEVER use -->|label|> (invalid syntax).
- No style/classDef lines.

Optional: one markdown table. End with ## Bottom line.

BANNED: "RevOps product work", "economy-mode depth", landscape, leverage (verb), holistic, synergy, delve, game-changer.

Output markdown only. No AI disclaimers.`;

const MAX_TOKENS = 3200;

function fetchJson(url, opts, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const payload = body ? JSON.stringify(body) : null;
    const req = https.request(
      {
        hostname: u.hostname,
        path: u.pathname + u.search,
        method: opts.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(opts.headers || {}),
          ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        },
        timeout: 120000,
      },
      (res) => {
        let data = '';
        res.on('data', (c) => { data += c; });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try { resolve(JSON.parse(data)); }
            catch { resolve({ _raw: data }); }
          } else {
            reject(new Error(`${opts.label || 'api'} ${res.statusCode}: ${data.slice(0, 280)}`));
          }
        });
      }
    );
    req.on('error', reject);
    req.on('timeout', () => { try { req.destroy(); } catch (_) {} reject(new Error(`${opts.label} timeout`)); });
    if (payload) req.write(payload);
    req.end();
  });
}

async function geminiAnswer(question) {
  const key = geminiApiKey();
  if (!key) {
    throw new Error(
      'no gemini key — set GEMINI_API_KEY in Netlify site env (https://aistudio.google.com/apikey) ' +
        'then run `netlify env:pull` or add to .env.local'
    );
  }
  // Gemini 1.5 family deprecated in 2026 — 2.5 is current default, 2.0 fallback.
  const models = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-2.5-pro',
  ];
  let lastErr;
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
      const j = await fetchJson(url, { label: 'gemini', method: 'POST' }, {
        systemInstruction: { parts: [{ text: SYSTEM }] },
        contents: [{ role: 'user', parts: [{ text: question }] }],
        generationConfig: { temperature: 0.55, maxOutputTokens: MAX_TOKENS },
      });
      const text = j.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text && countWords(text) >= MIN_WORDS) return { text: text.trim(), source: `gemini:${model}` };
      lastErr = new Error('gemini empty');
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

async function groqAnswer(question) {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error('no groq key');
  const models = ['llama-3.3-70b-versatile', 'llama-3.1-70b-versatile', 'llama-3.1-8b-instant'];
  let lastErr;
  for (const model of models) {
    try {
      const j = await fetchJson('https://api.groq.com/openai/v1/chat/completions', {
        label: 'groq',
        headers: { Authorization: 'Bearer ' + key },
      }, {
        model,
        temperature: 0.55,
        max_tokens: MAX_TOKENS,
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: question },
        ],
      });
      const text = j.choices?.[0]?.message?.content;
      if (text && countWords(text) >= MIN_WORDS) return { text: text.trim(), source: `groq:${model}` };
      lastErr = new Error('groq empty');
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

async function claudeAnswer(question) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('no anthropic key');
  const models = ['claude-sonnet-4-20250514', 'claude-3-5-haiku-20241022'];
  let lastErr;
  for (const model of models) {
    try {
      const j = await fetchJson('https://api.anthropic.com/v1/messages', {
        label: 'claude',
        headers: {
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
        },
      }, {
        model,
        max_tokens: MAX_TOKENS,
        system: SYSTEM,
        messages: [{ role: 'user', content: question }],
      });
      const text = j.content?.find((p) => p.type === 'text')?.text;
      if (text && countWords(text) >= MIN_WORDS) return { text: text.trim(), source: `claude:${model}` };
      lastErr = new Error('claude empty');
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

async function grokAnswer(question) {
  const key = grokApiKey();
  if (!key) throw new Error('no grok key');
  const models = ['grok-3', 'grok-2-1212', 'grok-2-latest'];
  let lastErr;
  for (const model of models) {
    try {
      const j = await fetchJson('https://api.x.ai/v1/chat/completions', {
        label: 'grok',
        headers: { Authorization: 'Bearer ' + key },
      }, {
        model,
    temperature: 0.55,
    max_tokens: MAX_TOKENS,
    messages: [
      { role: 'system', content: SYSTEM },
      { role: 'user', content: question },
    ],
      });
      const text = j.choices?.[0]?.message?.content;
      if (text && countWords(text) >= MIN_WORDS) return { text: text.trim(), source: `grok:${model}` };
      lastErr = new Error('grok empty');
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

function skipAnthropic() {
  const v = (process.env.SKIP_ANTHROPIC_LLM || process.env.DISABLE_ANTHROPIC_LLM || '').toLowerCase();
  return v === '1' || v === 'true' || v === 'yes';
}

async function llmAnswer(question, opts = {}) {
  const prefer =
    (opts.preferProvider || process.env.ECONOMY_LLM_PREFER || '').toLowerCase();
  const grokFirst = opts.preferGrok || prefer === 'grok' || prefer === 'xai';

  const providers = grokFirst
    ? [
        () => grokAnswer(question),
        () => groqAnswer(question),
        () => geminiAnswer(question),
      ]
    : [
        () => geminiAnswer(question),
        () => grokAnswer(question),
        () => groqAnswer(question),
      ];
  if (!skipAnthropic()) providers.push(() => claudeAnswer(question));
  const errors = [];
  for (const fn of providers) {
    try {
      const { text, source } = await fn();
      const fin = finalizeEconomyAnswer(text, question);
      if (fin.words >= MIN_WORDS && fin.mermaidOk) {
        return { text: fin.answer, source, words: fin.words };
      }
      errors.push(`${source}: words=${fin.words} mermaid=${fin.mermaidOk}`);
    } catch (e) {
      errors.push(e.message);
    }
  }
  throw new Error('all LLM providers failed: ' + errors.join(' | '));
}

module.exports = {
  llmAnswer,
  geminiAnswer,
  groqAnswer,
  claudeAnswer,
  grokAnswer,
  grokApiKey,
  countWords,
  MIN_WORDS,
};
