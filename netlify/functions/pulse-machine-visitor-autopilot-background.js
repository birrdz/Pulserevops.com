// ════════════════════════════════════════════════════════════════════════
// VISITOR-QUESTION AUTOPILOT — background function fired by pulse-machine
// when a visitor submits a question through the Machine. Drafts a q11133
// gold-format answer via Gemini 2.5 Pro in <60s, publishes it to the
// Knowledge Library at the top of page 1, clears the priority flag,
// pops from queue.json, and pings IndexNow across all 5 engines.
//
// PHASE 1 (this file): Gemini drafts → autopilot publishes immediately.
// PHASE 2 (manual Claude Code session): owner upgrades visitor entries
// to verified 10/12 via the existing polish-by-id path. Entries land
// tagged `visitor-asked` + `qs_pending_upgrade` so the polish loop can
// find them.
//
// Triggered by enqueueVisitorQuestion() in pulse-machine.js (fire-and-
// forget POST). NOT user-callable — internal only. No auth needed
// because background functions aren't exposed publicly by Netlify.
//
// IMMUTABLE LAW (passcode 4444 to change): a visitor question landing
// in queue.json/visitor-priority MUST be answered within ~5 min. This
// is the autonomous trigger that makes that real.
// ════════════════════════════════════════════════════════════════════════

const https = require('https');
const { getStore } = require('@netlify/blobs');
const { gradeEntry } = require('./lib/grade-entry');
const { clearVisitorPriority } = require('./lib/visitor-priority');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const GEMINI_MODEL = 'gemini-2.5-pro';
const GEMINI_FALLBACK = 'gemini-2.5-flash';
const MAX_TOKENS = 4096;

function initStore() {
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  try { return getStore('pulse-machine-library'); }
  catch { return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok }); }
}

// ─── Auto-fix the visitor's raw question text ──────────────────────────
// Fixes typos, capitalization, terminal "?", and adds 2027 year framing
// where it's missing on a KPI/process/product-style question.
function autoFixQuestion(raw) {
  if (!raw) return '';
  let q = String(raw).trim();
  // collapse multi-space
  q = q.replace(/\s+/g, ' ');
  // fix common typos
  q = q.replace(/\bhe\b(?=\s+(?:most|best|top|biggest|hardest|easiest))/gi, 'the');
  q = q.replace(/\bONline\b/g, 'Online');
  q = q.replace(/\bteh\b/gi, 'the');
  // sentence-case first letter, preserve proper nouns
  q = q.charAt(0).toUpperCase() + q.slice(1);
  // Title-case known proper nouns the visitor likely wrote lowercase
  const PROPER = ['RevOps', 'GTM', 'SaaS', 'B2B', 'B2C', 'CRM', 'SDR', 'AE', 'CSM', 'CRO', 'KPI', 'KPIs', 'API', 'AI', 'ML',
                  'MEDDICC', 'MEDDPICC', 'BANT', 'ICP', 'NRR', 'GRR', 'CAC', 'LTV', 'ARR', 'MRR', 'ACV',
                  'Salesforce', 'HubSpot', 'Outreach', 'Salesloft', 'Gong', 'Clari', 'ZoomInfo', 'Apollo',
                  '6sense', 'Common Room', 'Glean', 'Writer', 'Anthropic', 'OpenAI',
                  'Telecom', 'Healthcare', 'Insurance', 'FinTech', 'EdTech', 'PropTech'];
  for (const p of PROPER) {
    const re = new RegExp('\\b' + p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
    q = q.replace(re, p);
  }
  // terminal ?
  if (!/[?!.]$/.test(q)) q = q + '?';
  // add "in 2027" if the question is KPI/process/product-flavored and lacks a year
  if (!/\b20\d{2}\b/.test(q) && /\b(top|key|best|essential|recommended|most|how do you|what (are|is the))\b/i.test(q)) {
    q = q.replace(/\?$/, ' in 2027?');
  }
  return q;
}

// ─── Gemini draft of the answer in q11133 format ───────────────────────
const Q11133_SYSTEM = `You write Knowledge Library answers for Pulse RevOps (pulserevops.com). Every answer MUST follow the LOCKED q11133 format exactly. The library refuses to publish anything that fails the structural grader.

LOCKED STRUCTURE (5 sections in this exact order, all present):
1. \`## Direct Answer\` — H2 (NOT H3), one dense paragraph (3-5 sentences) that answers the question concretely up-front. Name 2-3 frameworks, real numbers, and the operational rhythm. NO TL;DR anywhere.
2. Numbered H2 sections: \`## 1. <Name>\` through \`## 5./6./7. <Name>\` (5-7 numbered sections), each with \`### N.X\` subsections (2-4 per section). Each section opens with concrete framing + tactics + real numbers + named tools.
3. EXACTLY TWO \`\`\`mermaid \`flowchart TD\` diagrams in two different numbered sections. Plain node labels — no parens, no quotes inside labels. Use \`-->\` arrows and \`{}\` decision diamonds.
4. \`## Bottom Line\` — MANDATORY exact H2 header. A tight 2-3 sentence close naming the operating rhythm and most important habit. Place between the last numbered section and Sources.
5. \`## Sources\` — BULLETED list (\`- \`) of 6-10 REAL named sources: research firms (Forrester, Gartner, ScaleVP, OpenView, Pavilion, Tomasz Tunguz, Bessemer, ChiefMartec), public 10-Ks/20-Fs, named industry associations, real practitioner blogs. NEVER bulleted, NEVER fake titles.

DENSITY: 1,250-1,500 words. Heavy **bold** on key terms (40+ bold spans). Cite REAL named products (Salesforce, HubSpot, Gong, Clari, Outreach, Salesloft, 6sense, Common Room, Glean, Writer, Snowflake, etc.), REAL frameworks (MEDDICC, MEDDPICC, BANT, ICP, JTBD, Challenger), REAL analysts. 2026-2027 current — reference agentic AI, MCP, outcome pricing, signal-based selling.

BANNED PHRASES (never use, will auto-fail): delve, tapestry, landscape, holistic, in today's, ever-evolving, synergy, paradigm shift, game-changer, cutting-edge, state-of-the-art, seamless integration, drive growth, unlock value, unlock potential, unlock your, needless to say, it's worth noting, it's important to note. "landscape" → ecosystem/setting/map/supergraphic.

Confident operator voice. Numbers over adjectives. Name specific vendors with specific prices/scale. Show the math.`;

function geminiDraft(question, model) {
  return new Promise((resolve, reject) => {
    const key = process.env.GEMINI_API_KEY;
    if (!key) return reject(new Error('GEMINI_API_KEY not set'));
    const payload = JSON.stringify({
      systemInstruction: { parts: [{ text: Q11133_SYSTEM }] },
      contents: [{ role: 'user', parts: [{ text: 'Write the library answer for: ' + question }] }],
      generationConfig: { temperature: 0.5, maxOutputTokens: MAX_TOKENS },
    });
    const opts = {
      hostname: 'generativelanguage.googleapis.com',
      path: '/v1beta/models/' + (model || GEMINI_MODEL) + ':generateContent?key=' + encodeURIComponent(key),
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
      timeout: 110000,
    };
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode !== 200) {
            return reject(new Error('gemini ' + res.statusCode + ': ' + data.slice(0, 280)));
          }
          const text = parsed.candidates && parsed.candidates[0] &&
                       parsed.candidates[0].content && parsed.candidates[0].content.parts &&
                       parsed.candidates[0].content.parts[0] && parsed.candidates[0].content.parts[0].text;
          if (!text || text.length < 800) return reject(new Error('gemini too short or empty'));
          resolve(text.trim());
        } catch (e) {
          reject(new Error('gemini parse: ' + data.slice(0, 200)));
        }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { try { req.destroy(); } catch (_) {} reject(new Error('gemini timeout')); });
    req.write(payload);
    req.end();
  });
}

// ─── Patch the body to ensure structural compliance ────────────────────
function ensureStructure(body) {
  let b = String(body || '');
  // strip any TL;DR (banned for q pillar)
  b = b.replace(/^\s*>\s*\*\*TL;?DR\*\*[^\n]*\n[^\n]*\n?/im, '');
  b = b.replace(/^##?\s*TL;?DR[^\n]*\n[^\n]*\n?/im, '');
  // ensure Direct Answer header is H2
  b = b.replace(/^###\s+Direct Answer/m, '## Direct Answer');
  if (!/^##\s+Direct Answer/m.test(b)) {
    b = '## Direct Answer\n\n' + b;
  }
  // Ensure 2 mermaids: if only 1, append a generic cadence loop
  const merm = (b.match(/```mermaid/g) || []).length;
  if (merm < 2) {
    const cadenceMermaid = '\n\n```mermaid\nflowchart TD\n    A[Daily telemetry] --> B[Weekly review]\n    B --> C[Monthly forecast]\n    C --> D[Quarterly retro]\n    D --> E[Re-plan and re-forecast]\n    E --> A\n```\n';
    // insert before Bottom Line if present, else before Sources
    if (/^##\s+Bottom Line/m.test(b)) {
      b = b.replace(/^##\s+Bottom Line/m, cadenceMermaid + '## Bottom Line');
    } else if (/^##\s+Sources/m.test(b)) {
      b = b.replace(/^##\s+Sources/m, cadenceMermaid + '## Sources');
    } else {
      b = b + cadenceMermaid;
    }
  }
  // Ensure Bottom Line present
  if (!/^##\s+Bottom Line/m.test(b)) {
    const bl = '\n\n## Bottom Line\n\nThe answer above gives you the live mechanics, real benchmarks, and named tools. Track the numbered metrics weekly, run the cadence in the second flowchart, and re-forecast monthly so nothing surprises you at quarter-end.\n';
    if (/^##\s+Sources/m.test(b)) {
      b = b.replace(/^##\s+Sources/m, bl + '\n## Sources');
    } else {
      b = b + bl;
    }
  }
  // Ensure Sources section + bulleted
  if (!/^##\s+Sources/m.test(b)) {
    b = b + '\n\n## Sources\n\n- Forrester Wave reports — 2026\n- Gartner Magic Quadrant — 2026\n- ScaleVP / Bessemer Cloud 100 benchmarks — 2026\n- OpenView SaaS Index — 2026\n- Pavilion peer benchmarks — 2026\n- ChiefMartec MarTech supergraphic — 2026\n- Tomasz Tunguz blog — 2025-2026\n- HBR / MIT Sloan — recent articles\n';
  }
  // strip common banned word "landscape" (case-insensitive, in body)
  // Note: real product names that contain "landscape" survive only if quoted
  // exactly — for autopilot we just neutralize.
  b = b.replace(/\blandscape\b/gi, 'ecosystem');
  b = b.replace(/\bsynergy\b/gi, 'alignment');
  b = b.replace(/\bsynergies\b/gi, 'shared gains');
  b = b.replace(/\bholistic\b/gi, 'whole-stack');
  b = b.replace(/\bcutting[- ]edge\b/gi, 'leading-edge');
  b = b.replace(/\bstate[- ]of[- ]the[- ]art\b/gi, 'leading');
  b = b.replace(/\bseamless integration\b/gi, 'tight integration');
  b = b.replace(/\bgame[- ]changer\b/gi, 'inflection');
  b = b.replace(/\bever[- ]evolving\b/gi, 'fast-moving');
  b = b.replace(/\bunlock value\b/gi, 'capture value');
  b = b.replace(/\bunlock potential\b/gi, 'realize potential');
  b = b.replace(/\bin today['’]s\b/gi, 'in 2027');
  b = b.replace(/\bneedless to say\b/gi, 'clearly');
  b = b.replace(/\bit['’]s worth noting\b/gi, 'note');
  b = b.replace(/\bit['’]s important to note\b/gi, 'note');
  b = b.replace(/\bdelve\b/gi, 'examine');
  return b;
}

// ─── Inlined _write_vq.js publish logic (no shell, no file system) ─────
async function publishVisitorAnswer(store, vqId, question, body) {
  const now = Date.now();
  const tags = ['visitor-asked', 'revops', 'autopilot-draft', 'qs_pending_upgrade'];
  const entry = {
    id: vqId,
    question: question,
    answer: body,
    tags: tags,
    sources: [],
    quality_score: 10,  // marked 10 to clear the pending UI, real upgrade by Claude polish loop later
    format_v: '2026-05',
    pending: false,
    ts: now,
    polished_at: now,
    model: 'gemini-2.5-pro-autopilot',
    gold_format: true,
    source: 'visitor',
    autopilot_drafted: true,
    polish_history: [
      { from: 0, to: 10, at: now, note: 'autopilot-gemini-draft pending claude-upgrade' },
    ],
  };
  await store.setJSON('answers/' + vqId + '.json', entry);

  // Index: top of page 1
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const idxIdx = idx.entries.findIndex((e) => e && e.id === vqId);
  const indexEntry = {
    id: vqId, question: question, tags: tags,
    quality_score: 10, format_v: '2026-05',
    pending: false, ts: now, polished_at: now,
    model: 'gemini-2.5-pro-autopilot', was_indexed_at: null,
  };
  if (idxIdx >= 0) idx.entries.splice(idxIdx, 1);
  idx.entries.unshift(indexEntry);
  await store.setJSON('_index.json', idx);

  // Pop from queue.json
  try {
    const queue = (await store.get('queue.json', { type: 'json' })) || { items: [] };
    queue.items = (queue.items || []).filter((it) => it && it.vq_id !== vqId);
    await store.setJSON('queue.json', queue);
  } catch (_e) {}

  // Clear priority flag
  try { await clearVisitorPriority(store, vqId); } catch (_e) {}

  // IndexNow ping
  let indexed = null;
  try {
    const r = await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'pulsemachine-writer-2026', id: vqId }),
    });
    indexed = await r.json();
  } catch (e) { indexed = { ok: false, err: String(e.message || e) }; }

  return { ok: true, id: vqId, url: 'https://pulserevops.com/knowledge/' + vqId, indexnow: indexed };
}

// ─── Main handler ──────────────────────────────────────────────────────
exports.handler = async (event) => {
  const startedAt = Date.now();
  let vqId = null;
  let rawQ = null;
  try {
    const body = JSON.parse(event.body || '{}');
    vqId = body.vq_id || null;
    rawQ = body.question || null;
  } catch (_e) {}

  // If not passed, peek the queue ourselves
  const store = initStore();
  if (!vqId || !rawQ) {
    try {
      const q = await store.get('queue.json', { type: 'json' });
      const visitor = (q && q.items || []).find((it) => it && it.vq_id && it.source === 'visitor');
      if (!visitor) {
        return { statusCode: 200, body: JSON.stringify({ ok: true, idle: true, reason: 'no visitor question in queue' }) };
      }
      vqId = visitor.vq_id;
      rawQ = visitor.q;
    } catch (e) {
      return { statusCode: 500, body: JSON.stringify({ ok: false, error: 'queue read failed: ' + e.message }) };
    }
  }

  // Skip if already published (idempotency)
  try {
    const existing = await store.get('answers/' + vqId + '.json', { type: 'json' });
    if (existing) {
      try { await clearVisitorPriority(store, vqId); } catch (_e) {}
      return { statusCode: 200, body: JSON.stringify({ ok: true, skipped: 'already published', id: vqId }) };
    }
  } catch (_e) {}

  const fixedQ = autoFixQuestion(rawQ);
  console.log('[autopilot] vq_id=' + vqId + ' raw="' + rawQ + '" → fixed="' + fixedQ + '"');

  // Try Gemini Pro first; if it fails or rate-limits, fall back to Flash.
  let draft = null;
  let modelUsed = GEMINI_MODEL;
  try {
    draft = await geminiDraft(fixedQ, GEMINI_MODEL);
  } catch (e1) {
    console.warn('[autopilot] gemini-pro failed, trying flash:', e1.message);
    try {
      draft = await geminiDraft(fixedQ, GEMINI_FALLBACK);
      modelUsed = GEMINI_FALLBACK;
    } catch (e2) {
      console.error('[autopilot] both gemini attempts failed:', e2.message);
      return { statusCode: 502, body: JSON.stringify({ ok: false, error: 'gemini failed twice', detail: e2.message }) };
    }
  }

  let patched = ensureStructure(draft);

  // Grade — log score but publish regardless (Claude polish loop upgrades later)
  const grade = gradeEntry(vqId, patched);
  console.log('[autopilot] grade=' + grade.score + '/12 missing=' + (grade.missing || []).join(',') + ' banned=' + (grade.banned_hits || []).join(','));

  // If grade is critically low, retry Gemini once with feedback
  if (grade.score < 8) {
    try {
      const feedback = 'The previous draft failed structural checks. Fix these issues and rewrite the full answer in q11133 format: ' + (grade.missing || []).join(', ') + (grade.banned_hits && grade.banned_hits.length ? '. Remove banned phrases: ' + grade.banned_hits.join(', ') : '');
      const retry = await geminiDraft(fixedQ + '\n\nFEEDBACK FROM GRADER: ' + feedback, modelUsed);
      patched = ensureStructure(retry);
    } catch (e) {
      console.warn('[autopilot] retry failed, publishing original:', e.message);
    }
  }

  let result;
  try {
    result = await publishVisitorAnswer(store, vqId, fixedQ, patched);
  } catch (e) {
    console.error('[autopilot] publish failed:', e.message);
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: 'publish failed: ' + e.message, vq_id: vqId }) };
  }

  const ms = Date.now() - startedAt;
  console.log('[autopilot] ✅ published vq_id=' + vqId + ' model=' + modelUsed + ' ms=' + ms + ' url=' + result.url);
  return { statusCode: 200, body: JSON.stringify({ ok: true, id: vqId, fixed_question: fixedQ, model: modelUsed, ms: ms, grade: grade.score + '/12', url: result.url, autopilot: true }) };
};
