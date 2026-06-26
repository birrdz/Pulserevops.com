// Shared helpers for Q&A review-mirror entries (separate blob per original).
//
// ID scheme: append literal suffix "rv" to the source id.
//   q0123      → q0123rv
//   dn0174     → dn0174rv
//   vq_abc123  → vq_abc123rv
//
// Mirrors store mirror_of = source id, unique review-oriented body, noindex +
// canonical → original (set in pulse-machine-entry renderer).

const path = require('path');
const https = require('https');
const { getStore } = require('@netlify/blobs');
const { loadEnv, blobsPat, netlifySiteId, geminiApiKey } = require('./netlify/functions/lib/load-env');
const { libraryEntryPublicUrl, libraryEntryKind } = require('./netlify/functions/lib/library-entry-url');
const { capitalizeQuestion, capitalizeSentencesInMarkdown } = require('./netlify/functions/lib/text-capitalize');
const { ensureImages } = require('./netlify/functions/lib/ensure-entry-images');
const { prepareEntryForPublish, finalizeIndexNow } = require('./_write_lib');
const { finalizeEconomyAnswer, validateEconomyAnswer, countWords, MIN_WORDS } = require('./netlify/functions/lib/economy-answer-quality');

loadEnv(path.join(__dirname));

const SITE_ID = netlifySiteId();
const MIRROR_SUFFIX = 'rv';

const REVIEW_SYSTEM = `You write a **reviews companion** library page — NOT a copy of the operator guide.

LENGTH: **1,000–1,200 words** of unique prose about how practitioners **evaluate, review, and compare** solutions for the topic.

STRUCTURE (## headings):
- Direct Answer — what reviewers should look for (40–80 words)
- Review criteria — numbered checklist operators use
- What good vs bad reviews signal
- Common review mistakes
- Review FAQ (3–5 Q&As as ### subheads)
- Bottom line

FOCUS: ratings rubrics, evaluation criteria, red flags in vendor/user reviews, peer feedback loops — **not** repeating the step-by-step guide.

MERMAID (required):
- Exactly one \`\`\`mermaid block, flowchart TD or LR, 6–10 nodes, simple IDs, labels in double quotes.

End with ## Bottom line. Markdown only. No AI disclaimers.`;

const EXCLUDED_PREFIXES = new Set(['st', 'ik', 'gb']);

function mirrorIdFor(sourceId) {
  const id = String(sourceId || '').trim();
  if (!id || isMirrorId(id)) return null;
  return id + MIRROR_SUFFIX;
}

function sourceIdFromMirror(mirrorId) {
  const id = String(mirrorId || '');
  if (!id.endsWith(MIRROR_SUFFIX)) return null;
  return id.slice(0, -MIRROR_SUFFIX.length);
}

function isMirrorId(id) {
  return String(id || '').endsWith(MIRROR_SUFFIX);
}

function isSalesTraining(row) {
  const id = String((row && row.id) || '');
  const tags = (row && row.tags) || [];
  return /^st\d+$/i.test(id) || tags.includes('sales-training');
}

function isIndustryKpi(row) {
  const id = String((row && row.id) || '');
  const tags = (row && row.tags) || [];
  return /^ik\d+$/i.test(id) || tags.includes('industry-kpi');
}

function isGraphic(row) {
  return /^gb\d+$/i.test(String((row && row.id) || ''));
}

/** Q&A-style library entry eligible for a review mirror (not trainings/KPIs/graphics). */
function isQaEligible(row) {
  if (!row || !row.id || !row.question) return false;
  const id = String(row.id);
  if (isMirrorId(id)) return false;
  if (row.mirror_of) return false;
  if (isSalesTraining(row)) return false;
  if (isIndustryKpi(row)) return false;
  if (isGraphic(row)) return false;
  const prefix = id.match(/^([a-z]+)/i);
  if (prefix && EXCLUDED_PREFIXES.has(prefix[1].toLowerCase())) return false;
  if (!libraryEntryKind({ id, tags: row.tags || [] })) return false;
  return true;
}

function questionAlreadyReviewVariant(question) {
  // Only treat as already-mirrored when " reviews" was appended as a mirror suffix
  // (avoids false positives like "Quarterly Business Reviews").
  const q = String(question || '').trim();
  return /\sreviews\?$/i.test(q) && !/\b(business|customer|user|product|online)\s+reviews\?$/i.test(q);
}

function reviewQuestionFor(originalQuestion) {
  const q = String(originalQuestion || '').trim();
  if (!q) return '';
  if (questionAlreadyReviewVariant(q)) return q.endsWith('?') ? q : q + '?';
  const base = q.replace(/\?+$/, '').trim();
  return base + ' reviews?';
}

function getStoreClient() {
  const tok = blobsPat();
  try {
    return getStore('pulse-machine-library');
  } catch (_) {
    return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok });
  }
}

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
        res.on('data', (c) => {
          data += c;
        });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(data));
            } catch {
              resolve({ _raw: data });
            }
          } else {
            reject(new Error(`${opts.label || 'api'} ${res.statusCode}: ${data.slice(0, 280)}`));
          }
        });
      }
    );
    req.on('error', reject);
    req.on('timeout', () => {
      try {
        req.destroy();
      } catch (_) {}
      reject(new Error(`${opts.label} timeout`));
    });
    if (payload) req.write(payload);
    req.end();
  });
}

async function generateReviewBody(originalQuestion, originalAnswer, sourceId) {
  const origUrl = libraryEntryPublicUrl({ id: sourceId }) || `https://pulserevops.com/knowledge/${sourceId}`;
  const reviewQ = reviewQuestionFor(originalQuestion);
  const context = String(originalAnswer || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .slice(0, 600)
    .trim();
  const userPrompt = [
    `Reviews companion question: ${reviewQ}`,
    `Original operator guide: ${originalQuestion}`,
    `Original guide URL (link in prose once): ${origUrl}`,
    context ? `Guide context (do NOT copy — use only for topic grounding): ${context}` : '',
  ]
    .filter(Boolean)
    .join('\n\n');

  const key = geminiApiKey();
  if (!key) throw new Error('no gemini key for review mirror body');

  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.5-pro'];
  let lastErr;
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
      const j = await fetchJson(url, { label: 'gemini-review', method: 'POST' }, {
        systemInstruction: { parts: [{ text: REVIEW_SYSTEM }] },
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: { temperature: 0.55, maxOutputTokens: 3200 },
      });
      const text = j.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        lastErr = new Error('gemini empty');
        continue;
      }
      const fin = finalizeEconomyAnswer(text.trim(), reviewQ);
      if (fin.words >= MIN_WORDS && fin.mermaidOk) {
        const linkBlock =
          `> **Full operator guide:** [${originalQuestion.replace(/\?+$/, '')}](${origUrl})\n\n`;
        return {
          answer: capitalizeSentencesInMarkdown(linkBlock + fin.answer),
          source: `gemini-review:${model}`,
          words: fin.words,
        };
      }
      lastErr = new Error(`quality gate words=${fin.words} mermaid=${fin.mermaidOk}`);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error('review body generation failed');
}

function mirrorTags(sourceTags = []) {
  return Array.from(
    new Set([
      ...(sourceTags || []),
      'reviews-mirror-entry',
      'reviews-companion',
      'economy-mode',
      'mirror-reviews-2027',
    ])
  );
}

async function publishMirror(store, sourceRow, sourceEntry, opts = {}) {
  const sourceId = String(sourceRow.id);
  const mirrorId = mirrorIdFor(sourceId);
  if (!mirrorId) return { ok: false, reason: 'bad_source_id', sourceId };

  let existing = null;
  try {
    existing = await store.get(`answers/${mirrorId}.json`, { type: 'json' });
  } catch (_) {
    existing = null;
  }
  if (existing && existing.id && !opts.force) {
    return {
      ok: true,
      skipped: true,
      id: mirrorId,
      sourceId,
      url: libraryEntryPublicUrl({ id: mirrorId, tags: existing.tags || sourceRow.tags }),
    };
  }

  const question = capitalizeQuestion(reviewQuestionFor(sourceRow.question || sourceEntry.question));
  let gen;
  try {
    gen = await generateReviewBody(
      sourceRow.question || sourceEntry.question,
      sourceEntry.answer,
      sourceId
    );
  } catch (e) {
    return { ok: false, reason: 'body_gen', sourceId, mirrorId, error: e.message };
  }

  if (!validateEconomyAnswer(gen.answer).ok) {
    return { ok: false, reason: 'answer_quality', sourceId, mirrorId, words: countWords(gen.answer) };
  }

  const img = await ensureImages(mirrorId, question, gen.answer);
  let answer = img.body;
  if (!img.audit.compliant && !opts.forceImages) {
    return { ok: false, reason: 'images_law', sourceId, mirrorId, needs: img.audit.needs };
  }

  const now = Date.now();
  let entry = {
    id: mirrorId,
    question,
    answer,
    tags: mirrorTags(sourceEntry.tags || sourceRow.tags),
    sources: ['Pulse RevOps reviews companion'],
    mirror_of: sourceId,
    reviews_mirror: true,
    seo_robots: 'noindex, follow',
    ts: now,
    polished_at: now,
    quality_score: 8,
    model: 'gemini-review-mirror',
    lab_run: 'mirror-reviews-1000w',
    mirror_body_source: gen.source,
  };

  entry = prepareEntryForPublish(mirrorId, question, entry);
  await store.setJSON(`answers/${mirrorId}.json`, entry);

  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const indexEntry = {
    id: mirrorId,
    question,
    tags: entry.tags,
    ts: now,
    polished_at: now,
    quality_score: 8,
    mirror_of: sourceId,
    was_indexed_at: null,
    seo_optimized_at: entry.seo_optimized_at || now,
  };
  const pos = (idx.entries || []).findIndex((e) => e && e.id === mirrorId);
  if (pos >= 0) idx.entries.splice(pos, 1);
  idx.entries.unshift(indexEntry);
  idx.entries.sort((a, b) => (b.ts || 0) - (a.ts || 0));
  await store.setJSON('_index.json', idx);

  const indexed = await finalizeIndexNow(mirrorId, store, indexEntry);

  return {
    ok: true,
    skipped: false,
    id: mirrorId,
    sourceId,
    question,
    words: gen.words,
    url: libraryEntryPublicUrl({ id: mirrorId, tags: entry.tags }),
    sourceUrl: libraryEntryPublicUrl({ id: sourceId, tags: sourceRow.tags }),
    indexnow: indexed,
    bodySource: gen.source,
  };
}

async function scanMirrorQueue(opts = {}) {
  const store = getStoreClient();
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const rows = idx.entries || [];
  const existingMirrors = new Set(rows.filter((r) => isMirrorId(r.id)).map((r) => r.id));
  const mirroredSources = new Set();
  for (const row of rows) {
    if (!row || !row.id) continue;
    if (row.mirror_of) mirroredSources.add(String(row.mirror_of));
    if (isMirrorId(row.id)) {
      const src = sourceIdFromMirror(row.id);
      if (src) mirroredSources.add(src);
    }
  }

  const eligible = [];
  const alreadyMirrored = [];
  const skipped = [];
  const harmfulTitleDupes = [];

  for (const row of rows) {
    if (!row || !row.id) continue;

    if (isMirrorId(row.id) || row.mirror_of) continue;

    if (questionAlreadyReviewVariant(row.question) && !row.mirror_of) {
      harmfulTitleDupes.push({
        id: row.id,
        question: String(row.question || '').slice(0, 120),
        url: libraryEntryPublicUrl(row),
        note: 'title ends with reviews but is not an rv mirror — audit candidate',
      });
    }

    if (!isQaEligible(row)) {
      skipped.push({ id: row.id, reason: 'not_qa_eligible' });
      continue;
    }

    const mid = mirrorIdFor(row.id);
    if (existingMirrors.has(mid) || mirroredSources.has(row.id)) {
      alreadyMirrored.push({ sourceId: row.id, mirrorId: mid });
      continue;
    }

    eligible.push({
      sourceId: row.id,
      mirrorId: mid,
      question: row.question,
      reviewQuestion: reviewQuestionFor(row.question),
      url: libraryEntryPublicUrl(row),
      tags: (row.tags || []).slice(0, 8),
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    counts: {
      totalIndex: rows.length,
      eligible: eligible.length,
      alreadyMirrored: alreadyMirrored.length,
      skipped: skipped.length,
      harmfulTitleDupes: harmfulTitleDupes.length,
      existingRvMirrors: existingMirrors.size,
    },
    eligible,
    alreadyMirrored: alreadyMirrored.slice(0, 50),
    harmfulTitleDupes: harmfulTitleDupes.slice(0, 100),
    skippedSample: skipped.slice(0, 30),
  };
}

module.exports = {
  MIRROR_SUFFIX,
  mirrorIdFor,
  sourceIdFromMirror,
  isMirrorId,
  isQaEligible,
  reviewQuestionFor,
  questionAlreadyReviewVariant,
  getStoreClient,
  generateReviewBody,
  publishMirror,
  scanMirrorQueue,
  libraryEntryPublicUrl,
};
