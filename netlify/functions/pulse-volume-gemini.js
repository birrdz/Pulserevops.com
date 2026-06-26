// ════════════════════════════════════════════════════════════════════════
// pulse-volume-gemini — Free-tier Gemini Flash volume writer.
//
// Reads queue.json from the pulse-machine-library blob, picks the next
// question, asks Gemini Flash for an initial sales/RevOps answer, and
// writes it to the library at quality_score = 5. The polish loop (run via
// the Claude Code wake-loop on the owner's Max plan) upgrades 5 → 10 over
// subsequent passes.
//
// Cost: $0. Gemini Flash free tier — 1500 RPD, 1M TPM, 15 RPM.
// Per-run target: 4 entries. Hourly schedule → 96/day, near the 100/day
// volume goal.
//
// No Anthropic API calls anywhere in this file. ANTHROPIC_API_KEY is
// untouched — that's the wake-loop's job, not this cron's.
// ════════════════════════════════════════════════════════════════════════
const https = require('https');
const { normalizeQuestion, visitorQuestionId } = require('./lib/visitor-question-id');
const { clearVisitorPriority } = require('./lib/visitor-priority');

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const SITE_ID         = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const GEMINI_MODEL    = 'gemini-2.5-flash';
const ENTRIES_PER_RUN = 4;        // 4 × 24 hourly runs = 96/day
const MAX_TOKENS_OUT  = 1400;
const STARTING_SCORE  = 5;        // every Gemini entry lands at 5/10; polish wave upgrades it.

const SYSTEM_PROMPT = `You are THE MACHINE — an operator-voice expert on sales, GTM, SaaS, RevOps, and revenue leadership. Answer questions with the voice of a CRO who has actually carried a number — direct, specific, math-backed.

DOMAIN: anything sales, growth, marketing, ops, leadership, pricing, hiring, comp, fundraising, unit economics, go-to-market. Industry-agnostic — B2B SaaS, services, agencies, ecommerce, retail, restaurants, real estate, marketplaces, anything with customers and revenue.

OUTPUT FORMAT (use on every answer):
1. **Quick take** — 2-3 sentences, the bottom-line answer
2. **The detail** — full breakdown with subheadings, numbers, named vendors, benchmarks
3. **A Mermaid diagram** — fenced \`\`\`mermaid block. Use flowchart LR for processes, sequenceDiagram for handoffs, gantt for ramps/timelines, stateDiagram-v2 for lifecycle states, mindmap for frameworks. 6-14 nodes.
4. **A markdown table** — when comparative data applies (benchmarks, vendor matrices, ratios, segment splits). Two columns minimum, with header row.
5. **Sources** — clickable URLs (full https://) inline where claims are made
6. **One sharp closer** — the truth or the action

VOICE rules:
- Direct. Specific. Numbered when actionable.
- Names vendors, books, frameworks, people when relevant (Outreach, Apollo, Salesforce, HubSpot, Gong, Clari, Pavilion, Bridge Group, Force Management, Challenger, MEDDPICC).
- 600-1100 words is the normal floor for any non-trivial question. Depth > brevity.
- Show the math, name trade-offs, give benchmark numbers, list failure modes, explain when the answer flips.

BANNED PHRASES — never use:
"landscape", "tapestry", "leverage" (as verb), "utilize", "in today's", "holistic", "synergy", "synergies", "paradigm shift", "game-changer", "best-in-class", "world-class", "cutting-edge", "state-of-the-art", "streamline", "seamless integration", "robust", "delve", "delve into", "dive into", "navigate the", "ever-evolving", "unlock value", "unlock potential", "drive growth" (as closer), "let me explain", "it's important to note", "it's worth noting", "needless to say".

Never mention you are Gemini, an AI, or a language model. You are The Machine.

AFTER your answer, on a new line at the very end, emit exactly one line in this format (used by downstream tagging):
TAGS: tag1, tag2, tag3, tag4
Pick 3-6 short kebab-case tags that capture the topic (e.g. "comp-plan", "outbound-sequencing", "saas-pricing", "channel-partnerships").`;

function geminiPost(question) {
  return new Promise((resolve, reject) => {
    const key = process.env.GEMINI_API_KEY;
    if (!key) return reject(new Error('GEMINI_API_KEY not set'));
    const payload = JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: 'user', parts: [{ text: question }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: MAX_TOKENS_OUT },
    });
    const opts = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(key)}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
      timeout: 60000,
    };
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode !== 200) return reject(new Error(`gemini ${res.statusCode}: ${data.slice(0, 240)}`));
          const text = parsed.candidates && parsed.candidates[0] && parsed.candidates[0].content
                    && parsed.candidates[0].content.parts && parsed.candidates[0].content.parts[0]
                    && parsed.candidates[0].content.parts[0].text;
          if (!text) return reject(new Error('gemini empty response'));
          resolve(text);
        } catch (e) { reject(new Error('gemini parse: ' + data.slice(0, 240))); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { try { req.destroy(); } catch (_) {} reject(new Error('gemini timeout')); });
    req.write(payload);
    req.end();
  });
}

function parseOutput(raw) {
  const tagMatch = raw.match(/^TAGS:\s*(.+)$/im);
  let tags = [];
  if (tagMatch) {
    tags = tagMatch[1].split(',').map(t => t.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')).filter(Boolean).slice(0, 6);
  }
  const answer = raw.replace(/^TAGS:.*$/im, '').trim();
  return { answer, tags };
}

function normalize(s) {
  return normalizeQuestion(s);
}

function makeId() {
  return 'q' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

async function getLibraryStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  try { return getStore('pulse-machine-library'); }
  catch (e) {
    if (tok && SITE_ID) return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok });
    throw e;
  }
}

exports.handler = async () => {
  if (!process.env.GEMINI_API_KEY) {
    console.log('[volume-gemini] GEMINI_API_KEY not set — no-op');
    return { statusCode: 200, body: JSON.stringify({ ok: false, reason: 'no GEMINI_API_KEY in env' }) };
  }

  let store;
  try { store = await getLibraryStore(); }
  catch (e) {
    console.error('[volume-gemini] store unavailable', e && e.message);
    return { statusCode: 200, body: 'no store' };
  }
  if (!store) return { statusCode: 200, body: 'no store' };

  const queue = (await store.get('queue.json', { type: 'json' })) || { items: [] };
  const idx   = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  if (!queue.items || !queue.items.length) {
    console.log('[volume-gemini] queue empty');
    return { statusCode: 200, body: 'queue empty' };
  }

  const answered = new Set((idx.entries || []).map(e => normalize(e.question)));
  const fresh = queue.items.filter(it => it && it.q && !answered.has(normalize(it.q)));
  if (!fresh.length) {
    console.log('[volume-gemini] no fresh items in queue');
    return { statusCode: 200, body: 'no fresh' };
  }

  // Pick up to N: higher priority first, then older first
  fresh.sort((a, b) => (b.priority || 1) - (a.priority || 1) || (a.ts || 0) - (b.ts || 0));
  const batch = fresh.slice(0, ENTRIES_PER_RUN);

  const newEntries = [];
  const processedQs = new Set();
  const failures = [];   // collect per-item failure reasons for diagnostic visibility
  const failedVisitors = []; // visitor questions we couldn't write — flag for human fallback
  for (const item of batch) {
    const question = String(item.q).trim();
    if (!question || question.length < 6) { failures.push({ q: question.slice(0,80), reason: 'too short' }); continue; }
    let raw;
    try { raw = await geminiPost(question); }
    catch (e) {
      const msg = (e && e.message) || 'unknown';
      console.warn('[volume-gemini] gemini call failed', msg);
      failures.push({ q: question.slice(0,80), reason: 'gemini-fail: ' + msg.slice(0, 220) });
      if (item.source === 'visitor') failedVisitors.push({ vq_id: item.vq_id, q: question, reason: msg.slice(0, 220) });
      // Don't break the whole batch on a single failure — try the next item.
      // (Quota-related failures will fail uniformly; transient errors will not.)
      continue;
    }
    const { answer, tags } = parseOutput(raw);
    if (!answer || answer.length < 200) {
      console.warn('[volume-gemini] short answer, skip:', question.slice(0, 80));
      failures.push({ q: question.slice(0,80), reason: 'short answer: ' + (answer ? answer.length : 0) + ' chars' });
      if (item.source === 'visitor') failedVisitors.push({ vq_id: item.vq_id, q: question, reason: 'short-answer' });
      continue;
    }
    const id = item.vq_id || (item.source === 'visitor' ? visitorQuestionId(question) : makeId());
    const ts = Date.now();
    const entry = {
      id,
      question,
      answer,
      tags: tags.length ? tags : (item.source === 'visitor' ? ['visitor-asked'] : tags),
      sources: [],
      ts,
      model: GEMINI_MODEL,
      quality_score: STARTING_SCORE,
      polish_history: [],
      polished_at: null,
      source: item.source === 'visitor' ? 'visitor' : 'volume-gemini',
      parent_id: item.parent_id || null,
    };
    await store.setJSON('answers/' + id + '.json', entry);
    newEntries.push({ id, question, tags, ts, quality_score: STARTING_SCORE });
    processedQs.add(normalize(question));
    console.log('[volume-gemini] wrote', id, '·', question.slice(0, 80));
  }

  if (newEntries.length) {
    const updatedIndex = {
      entries: [...newEntries, ...(idx.entries || [])].slice(0, 5000),
    };
    await store.setJSON('_index.json', updatedIndex);

    const updatedQueue = {
      items: (queue.items || []).filter(it => !processedQs.has(normalize(it.q))),
    };
    await store.setJSON('queue.json', updatedQueue);

    try {
      const meta = (await store.get('_meta_volume.json', { type: 'json' })) || { day: '', runs_today: 0, items_today: 0 };
      const today = new Date().toISOString().slice(0, 10);
      if (meta.day !== today) { meta.day = today; meta.runs_today = 0; meta.items_today = 0; }
      meta.runs_today = (meta.runs_today || 0) + 1;
      meta.items_today = (meta.items_today || 0) + newEntries.length;
      meta.last_run = Date.now();
      await store.setJSON('_meta_volume.json', meta);
    } catch (_e) {}

    // VISITOR PRIORITY: if any of the entries we just wrote was a visitor
    // question, clear the priority pause so the rest of the engine resumes.
    try {
      const visitorEntry = newEntries.find(e => {
        const item = batch.find(it => normalize(it.q) === normalize(e.question));
        return item && item.source === 'visitor';
      });
      if (visitorEntry) await clearVisitorPriority(store, visitorEntry.id);
    } catch (_e) {}
  }

  // If any visitor questions failed (Gemini error, short answer, etc.), flag
  // them so the Claude Code wake-loop can pick them up on the next polish run.
  if (failedVisitors.length) {
    try {
      const cur = (await store.get('_visitor_needs_human.json', { type: 'json' })) || { items: [] };
      const existingIds = new Set((cur.items || []).map(i => i.vq_id));
      for (const v of failedVisitors) {
        if (v.vq_id && !existingIds.has(v.vq_id)) cur.items.unshift({ ...v, flagged_at: Date.now() });
      }
      cur.items = (cur.items || []).slice(0, 200);
      cur.last_flag_at = Date.now();
      await store.setJSON('_visitor_needs_human.json', cur);
    } catch (_e) {}
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      ok: true,
      wrote: newEntries.length,
      of: batch.length,
      ids: newEntries.map(e => e.id),
      failures,
      failed_visitors: failedVisitors.length,
    }),
  };
};
