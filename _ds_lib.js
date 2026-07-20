// DeepSeek client — the main TEXT generator for Pulse (LAW 2026-06-23).
// All content/answer text routes here (pay-as-you-go). Anthropic = images only.
// Key: DEEPSEEK_API_KEY or ds1 (Netlify env + .env.local). Model: deepseek-chat.
const fs = require('fs');

// Load env so the key is available to plain `node` scripts (Linux cloud + Windows).
try {
  const envPaths = [
    process.env.AQ_DRIP_ENV || '/tmp/aq-drip.env',
    '/workspace/.env.local',
    '/workspace/.env',
    'C:/Users/koryj/website/.env.local',
  ];
  for (const ep of envPaths) {
    try {
      if (!fs.existsSync(ep)) continue;
      const env = fs.readFileSync(ep, 'utf8');
      for (const line of env.split(/\r?\n/)) {
        const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
        if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
      }
    } catch (_e) {}
  }
} catch (e) {}

function dsKey() {
  return process.env.DEEPSEEK_API_KEY || process.env.ds1 || '';
}
const DS_URL = 'https://api.deepseek.com/chat/completions';
const DS_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- Cost controls (LAW 2026-06-23): daily cap + spend tracking + tally ----
// DeepSeek pricing (conservative, USD per 1M tokens): input ~$0.27, output ~$1.10.
const DS_IN_PER_M = 0.27, DS_OUT_PER_M = 1.10;
const DAILY_CAP = parseFloat(process.env.DS_DAILY_CAP || '5');   // hard stop ($/day)
const SPEND_FILE =
  process.env.DS_SPEND_FILE ||
  (fs.existsSync('/workspace') ? '/workspace/_ds_spend.json' : 'C:/Users/koryj/website/_ds_spend.json');
const today = () => new Date().toISOString().slice(0, 10);

function loadSpend() {
  let s = { date: today(), spent: 0, calls: 0, in_tokens: 0, out_tokens: 0 };
  try { const d = JSON.parse(fs.readFileSync(SPEND_FILE, 'utf8')); if (d && d.date === today()) s = d; } catch (e) {}
  return s;
}
function todaySpend() { return loadSpend(); }
function recordUsage(usage) {
  if (!usage) return;
  const s = loadSpend();
  const pin = usage.prompt_tokens || 0, pout = usage.completion_tokens || 0;
  s.spent += (pin / 1e6) * DS_IN_PER_M + (pout / 1e6) * DS_OUT_PER_M;
  s.calls += 1; s.in_tokens += pin; s.out_tokens += pout;
  s.spent = Math.round(s.spent * 10000) / 10000;
  try { fs.writeFileSync(SPEND_FILE, JSON.stringify(s)); } catch (e) {}
  return s;
}

/**
 * Call DeepSeek chat completions. Returns the assistant text.
 * @param {Array<{role,content}>} messages
 * @param {{temperature?:number, max_tokens?:number, retries?:number, model?:string}} opts
 */
async function dsChat(messages, opts = {}) {
  const DS_KEY = dsKey();
  if (!DS_KEY) throw new Error('DEEPSEEK_API_KEY/ds1 not set');
  // Hard daily cap — stop runaway spend. Engines catch this and halt.
  const sp = loadSpend();
  if (sp.spent >= DAILY_CAP) {
    throw new Error(`DS_DAILY_CAP reached: $${sp.spent.toFixed(2)} / $${DAILY_CAP} today — paused. Raise DS_DAILY_CAP to continue.`);
  }
  const temperature = opts.temperature ?? 0.6;
  const max_tokens = opts.max_tokens ?? 8000;
  const retries = opts.retries ?? 4;
  const model = opts.model || DS_MODEL;

  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(DS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${DS_KEY}` },
        body: JSON.stringify({ model, messages, temperature, max_tokens, stream: false }),
        // hard cap per attempt — a stalled DeepSeek connection must NOT hang the writer
        // forever (that's the "stuck in a pillar" freeze). Abort → retry → eventually throw,
        // which the generator's .catch() handles so the job advances instead of wedging.
        signal: AbortSignal.timeout(120000),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        // 429/503 → back off and retry (DeepSeek rate limit / busy)
        if ((res.status === 429 || res.status >= 500) && attempt < retries) {
          await sleep(2000 * (attempt + 1));
          continue;
        }
        throw new Error(`DeepSeek ${res.status}: ${txt.slice(0, 300)}`);
      }
      const json = await res.json();
      const content = json.choices?.[0]?.message?.content;
      if (!content) throw new Error('DeepSeek: empty content');
      recordUsage(json.usage);  // track spend (incl. this call even if caller later rejects the draft)
      return { content, usage: json.usage || null };
    } catch (e) {
      lastErr = e;
      if (attempt < retries) { await sleep(1500 * (attempt + 1)); continue; }
    }
  }
  throw lastErr || new Error('DeepSeek: unknown failure');
}

module.exports = {
  dsChat,
  DS_MODEL,
  get hasKey() {
    return !!dsKey();
  },
  todaySpend,
  DAILY_CAP,
};
