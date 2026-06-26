// Engine-pluggable gap-fill writer (Gemini / Groq). Pulls _gapfill_queue.json,
// generates via the chosen engine (REUSING the DeepSeek prompts + grader + retry),
// publishes text-first, and EXITS when the key is exhausted (sustained 429/quota).
// One worker. Skips prefix 'ai' (the Claude lanes own the web-dev AI series).
// Usage: node _alt_gapfill.js --engine=gemini   |   --engine=groq
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { generateGradedBody } = require('./_ds_gen_any');
const { publishTextFirst } = require('./_ds_publish');
const { getStore } = require('@netlify/blobs');
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const QFILE = 'C:/Users/koryj/website/_gapfill_queue.json';
const ENGINE = (process.argv.find(a => a.startsWith('--engine=')) || '--engine=gemini').split('=')[1];
const LOG = `C:/Users/koryj/website/_alt_${ENGINE}.log`;
const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
const log = s => { const line = new Date().toISOString() + ' ' + s; try { fs.appendFileSync(LOG, line + '\n'); } catch (e) {} console.log(line); };

// engine chat fns — signature (messages, {temperature, max_tokens}) => {content}; throw e.quota on exhaustion
async function geminiChat(messages, opts = {}) {
  const key = process.env.GEMINI_API_KEY;
  const sys = messages.find(m => m.role === 'system');
  const user = messages.filter(m => m.role === 'user').map(m => m.content).join('\n\n');
  const body = { contents: [{ role: 'user', parts: [{ text: user }] }], generationConfig: { temperature: opts.temperature ?? 0.6, maxOutputTokens: opts.max_tokens ?? 8000 } };
  if (sys) body.systemInstruction = { parts: [{ text: sys.content }] };
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-pro';
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(180000) });
  if (r.status === 429) { const e = new Error('gemini quota 429'); e.quota = true; throw e; }
  if (!r.ok) { const t = await r.text().catch(() => ''); const e = new Error('gemini ' + r.status + ' ' + t.slice(0, 160)); if (/RESOURCE_EXHAUSTED|quota|billing/i.test(t)) e.quota = true; throw e; }
  const j = await r.json();
  const text = (((j.candidates || [])[0] || {}).content || {}).parts?.map(p => p.text).join('') || '';
  if (!text) throw new Error('gemini empty response');
  return { content: text };
}
async function groqChat(messages, opts = {}) {
  const key = process.env.GROQ_API_KEY;
  if (!key) { const e = new Error('no GROQ_API_KEY'); e.quota = true; throw e; }
  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key }, body: JSON.stringify({ model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile', messages, temperature: opts.temperature ?? 0.6, max_tokens: Math.min(opts.max_tokens ?? 8000, 8000) }), signal: AbortSignal.timeout(180000) });
  if (r.status === 429) { const e = new Error('groq 429'); e.quota = true; throw e; }
  if (!r.ok) { const t = await r.text().catch(() => ''); const e = new Error('groq ' + r.status + ' ' + t.slice(0, 160)); if (/rate.?limit|quota|exhaust|insufficient|credit/i.test(t)) e.quota = true; throw e; }
  const j = await r.json();
  const text = j.choices?.[0]?.message?.content || '';
  if (!text) throw new Error('groq empty response');
  return { content: text };
}
async function cerebrasChat(messages, opts = {}) {
  const key = process.env.CEREBRAS_API_KEY;
  if (!key) { const e = new Error('no CEREBRAS_API_KEY'); e.quota = true; throw e; }
  const r = await fetch('https://api.cerebras.ai/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key }, body: JSON.stringify({ model: process.env.CEREBRAS_MODEL || 'gpt-oss-120b', messages, temperature: opts.temperature ?? 0.6, max_tokens: Math.min(opts.max_tokens ?? 8000, 8000), reasoning_effort: 'low' }), signal: AbortSignal.timeout(180000) });
  if (r.status === 429) { const e = new Error('cerebras 429'); e.quota = true; throw e; }
  if (!r.ok) { const t = await r.text().catch(() => ''); const e = new Error('cerebras ' + r.status + ' ' + t.slice(0, 160)); if (/rate.?limit|quota|exhaust|insufficient|credit/i.test(t)) e.quota = true; throw e; }
  const j = await r.json();
  const text = j.choices?.[0]?.message?.content || '';
  if (!text) throw new Error('cerebras empty response');
  return { content: text };
}
const CHAT = { gemini: geminiChat, groq: groqChat, cerebras: cerebrasChat }[ENGINE];
if (!CHAT) { console.error('unknown engine', ENGINE); process.exit(1); }
const isQuota = e => e && (e.quota || /quota|429|exhaust|RESOURCE_EXHAUSTED|rate.?limit|billing|credit/i.test(e.message || ''));

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const maxId = {};
  for (const e of idx.entries) { const m = String(e.id).match(/^([a-z]+)(\d+)$/); if (m) { const p = m[1], n = +m[2]; if (!maxId[p] || n > maxId[p]) maxId[p] = n; } }
  const have = new Set(idx.entries.map(e => norm(e.question)));
  const QUEUE = JSON.parse(fs.readFileSync(QFILE, 'utf8'));
  const work = QUEUE.filter(it => it.prefix !== 'ai' && !have.has(norm(it.title))); // ai = Claude lanes
  log(`[alt-${ENGINE}] start: ${work.length} queue items to attempt (skipping ai)`);
  let done = 0, fail = 0, quotaStreak = 0;
  for (const item of work) {
    if (fs.existsSync('C:/Users/koryj/website/_alt_stop.flag')) { log('[alt] stop flag'); break; }
    const pfx = item.prefix; maxId[pfx] = (maxId[pfx] || 0) + 1;
    const id = pfx + String(maxId[pfx]).padStart(4, '0');
    try {
      const { body, grade } = await generateGradedBody(id, item.title, { kind: item.kind, chat: CHAT });
      fs.writeFileSync('C:/Users/koryj/' + id + '_answer.md', body);
      const r = await publishTextFirst(id, item.title);
      if (r.ok) { done++; quotaStreak = 0; log(`OK ${id} ${r.words}w ${item.title.slice(0, 50)}`); }
      else { fail++; quotaStreak = 0; log(`FAIL ${id} grade=${r.score} ${(r.missing || []).join('|')}`); }
    } catch (e) {
      if (isQuota(e)) { quotaStreak++; maxId[pfx]--; log(`QUOTA ${ENGINE} (${quotaStreak}) ${e.message.slice(0, 80)}`); if (quotaStreak >= 4) { log(`[alt-${ENGINE}] KEY EXHAUSTED after ${done} written — exiting`); break; } }
      else { fail++; quotaStreak = 0; log(`ERR ${id} ${e.message.slice(0, 90)}`); }
    }
  }
  log(`[alt-${ENGINE}] DONE. written ${done}, failed ${fail}`);
})().catch(e => { log('[alt] FATAL ' + e.message); process.exit(1); });
