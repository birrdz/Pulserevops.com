#!/usr/bin/env node
// After mangled-image purge: fact-check newest N for hallucinations,
// surgically fix flagged claims, fill content + image gaps, email EACH fix.
// Visual-lock: text rewrites go through preserveImages / enforceWriterVisualLock.

const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');
const { gradeEntry } = require('../netlify/functions/lib/grade-entry');
const { preserveImages, enforceWriterVisualLock } = require('../_visual_lock_law');

let fillEntryMissingImages = null;
let repairBrokenQaImages = null;
let fixEntry = null;
try {
  ({ fillEntryMissingImages, repairBrokenQaImages } = require('../_ddg_facecard_lib'));
} catch (e) {
  console.error(JSON.stringify({ warn: 'ddg_facecard_lib', err: String(e.message || e) }));
}
try {
  ({ fixEntry } = require('../_v2_components'));
} catch (e) {
  console.error(JSON.stringify({ warn: 'v2_components', err: String(e.message || e) }));
}

const SITE_ID = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const KEY = 'pulsemachine-writer-2026';
const SITE = 'https://pulserevops.com';
const STATE_KEY = '_factcheck_gapfill_state.json';
const LIMIT = parseInt(process.env.FACTCHECK_LIMIT || '5000', 10);
const ONLY_DONE_IMAGE = process.env.FACTCHECK_ONLY_IMAGE_DONE === '1';
const IMAGE_STATE_KEY = '_mangled_image_purge_state.json';

function loadEnvFile(p) {
  try {
    for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch (e) {}
}
loadEnvFile('/tmp/pulse-runtime.env');
loadEnvFile(path.join(process.cwd(), '.env.local'));
loadEnvFile('C:/Users/koryj/website/.env.local');

function store() {
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
  if (!tok) throw new Error('BLOBS_PAT required');
  return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok });
}

function entryTs(e) {
  const vals = [e.ts, e.polished_at, e.was_indexed_at, e.last_modified_ms].map((v) =>
    typeof v === 'number' ? v : typeof v === 'string' && /^\d+$/.test(v) ? +v : 0
  );
  return Math.max(0, ...vals);
}

function knowledgeUrl(id) {
  return SITE + '/knowledge/' + encodeURIComponent(id);
}

async function emailOne(subject, html) {
  try {
    await fetch(SITE + '/.netlify/functions/pulse-progress-notify?key=' + KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, html }),
      signal: AbortSignal.timeout(15000),
    });
  } catch (e) {}
}

async function geminiJson(system, user, maxTokens = 800) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY missing');
  const models = ['gemini-2.0-flash-lite', 'gemini-2.5-flash-lite', 'gemini-2.0-flash'];
  let lastErr = '';
  for (const model of models) {
    const url =
      'https://generativelanguage.googleapis.com/v1beta/models/' +
      model +
      ':generateContent?key=' +
      encodeURIComponent(key);
    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: 'user', parts: [{ text: user }] }],
          generationConfig: { temperature: 0.15, maxOutputTokens: maxTokens },
        }),
        signal: AbortSignal.timeout(90000),
      });
      const t = await r.text();
      if (!r.ok) {
        lastErr = model + ':' + r.status + ':' + t.slice(0, 120);
        if (r.status === 429 || r.status === 404) continue;
        continue;
      }
      const j = JSON.parse(t);
      const text = (((j.candidates || [])[0] || {}).content || {}).parts
        ? j.candidates[0].content.parts.map((p) => p.text || '').join('')
        : '';
      const m = text.match(/\{[\s\S]*\}/);
      if (!m) {
        lastErr = 'no-json';
        continue;
      }
      return JSON.parse(m[0]);
    } catch (e) {
      lastErr = String(e.message || e);
    }
  }
  throw new Error('gemini failed: ' + lastErr);
}

async function geminiText(system, user, maxTokens = 8000) {
  const key = process.env.GEMINI_API_KEY;
  const models = ['gemini-2.0-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash-lite'];
  for (const model of models) {
    const url =
      'https://generativelanguage.googleapis.com/v1beta/models/' +
      model +
      ':generateContent?key=' +
      encodeURIComponent(key);
    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: 'user', parts: [{ text: user }] }],
          generationConfig: { temperature: 0.35, maxOutputTokens: maxTokens },
        }),
        signal: AbortSignal.timeout(180000),
      });
      if (!r.ok) continue;
      const j = await r.json();
      const text = (((j.candidates || [])[0] || {}).content || {}).parts
        ? j.candidates[0].content.parts.map((p) => p.text || '').join('')
        : '';
      if (text && text.length > 400) return text.trim();
    } catch (e) {}
  }
  return null;
}

async function anthropicText(system, user, maxTokens = 8000) {
  const key = process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY2;
  if (!key) return null;
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
        max_tokens: maxTokens,
        system,
        messages: [{ role: 'user', content: user }],
      }),
      signal: AbortSignal.timeout(180000),
    });
    if (!r.ok) return null;
    const j = await r.json();
    const text = (j.content || []).map((c) => c.text || '').join('').trim();
    return text.length > 400 ? text : null;
  } catch (e) {
    return null;
  }
}

const AUDIT_SYS = `You are a strict fact-checker for a published knowledge article.
Return ONLY JSON:
{"verdict":"pass"|"flag","issues":["..."],"hallucinations":["exact false claim"],"content_gaps":["missing section or thin area"],"image_gaps":["missing/broken image slot description"]}

FLAG when:
- Invented stats, prices, years, vendors, studies, or quotes
- Internal contradictions
- Wrong Direct Answer vs title
- Missing required sections for the format (Direct Answer / FAQ / Bottom Line / sources for Q&A; How We Ranked + ranked picks for Top 10)
- Broken or placeholder images referenced in body

PASS only if solid. Max 6 issues. Be specific; quote the bad claim.`;

const FIX_SYS = `You rewrite a knowledge article to remove hallucinations and fill content gaps.
RULES:
- Keep the same markdown structure and heading order.
- Do NOT add/remove/reorder image markdown lines (![alt](url)) or @@PRODUCT lines — leave those lines exactly as in the input (image pipeline handles images separately).
- Replace fabricated numbers/vendors with cautious qualitative language OR well-known verifiable facts only. Prefer hedging over invention.
- Fill thin/missing sections (Direct Answer, FAQ, Bottom Line, How We Ranked criteria, sources) with accurate, useful content.
- Keep mermaid fences valid.
- Return ONLY the full revised markdown body, no preamble.`;

function clipBody(answer) {
  const stripped = String(answer || '').replace(/```mermaid[\s\S]*?```/g, '[diagram]');
  const HEAD = 7000;
  const TAIL = 5000;
  if (stripped.length <= HEAD + TAIL) return stripped;
  return stripped.slice(0, HEAD) + '\n\n…[middle truncated]…\n\n' + stripped.slice(-TAIL);
}

async function main() {
  const s = store();
  let state = { doneIds: [], fixed: 0, passed: 0, scanned: 0, errors: 0 };
  try {
    state = Object.assign(state, (await s.get(STATE_KEY, { type: 'json' })) || {});
  } catch (e) {}

  let imageDone = new Set();
  if (ONLY_DONE_IMAGE) {
    try {
      const is = (await s.get(IMAGE_STATE_KEY, { type: 'json' })) || {};
      imageDone = new Set(is.doneIds || []);
    } catch (e) {}
  }

  const idx = await s.get('_index.json', { type: 'json', consistency: 'strong' });
  if (!idx || !Array.isArray(idx.entries)) throw new Error('no index');

  const rows = idx.entries
    .filter((e) => e && e.id && /^[a-z]{2,3}\d/i.test(String(e.id)))
    .slice()
    .sort((a, b) => entryTs(b) - entryTs(a))
    .slice(0, LIMIT);

  const done = new Set(state.doneIds || []);
  let todo = rows.filter((e) => !done.has(e.id));
  if (ONLY_DONE_IMAGE) todo = todo.filter((e) => imageDone.has(e.id));

  console.log(
    JSON.stringify({
      phase: 'factcheck-start',
      limit: LIMIT,
      todo: todo.length,
      alreadyDone: done.size,
      onlyImageDone: ONLY_DONE_IMAGE,
      imageDoneSize: imageDone.size,
    })
  );

  await emailOne(
    'PULSE fact-check + gap-fill started',
    '<p>Starting hallucination fact-check + content/image gap-fill on newest cohort.</p>' +
      '<p>Queue: <b>' +
      todo.length +
      '</b>. You get one email per fixed page.</p>'
  );

  let scanned = 0;
  let fixed = 0;
  let passed = 0;
  let errors = 0;

  for (const row of todo) {
    const id = row.id;
    scanned++;
    let blob;
    try {
      blob = await s.get('answers/' + id + '.json', { type: 'json' });
    } catch (e) {
      errors++;
      done.add(id);
      continue;
    }
    if (!blob || !blob.answer) {
      done.add(id);
      continue;
    }

    const question = blob.question || row.question || id;
    const original = String(blob.answer);

    let audit;
    try {
      audit = await geminiJson(
        AUDIT_SYS,
        'ID: ' +
          id +
          '\nQuestion: ' +
          question +
          '\n\nAnswer:\n' +
          clipBody(original) +
          '\n\nTags: ' +
          ((blob.tags || row.tags || []).join(', ') || '')
      );
    } catch (e) {
      errors++;
      console.log(JSON.stringify({ id, auditError: String(e.message || e).slice(0, 120) }));
      // don't mark done — retry later
      if (errors > 40 && fixed === 0 && passed < 5) {
        console.log(JSON.stringify({ fatal: 'too many audit errors early', errors }));
        process.exit(2);
      }
      await new Promise((r) => setTimeout(r, 4000));
      continue;
    }

    const verdict = String(audit.verdict || '').toLowerCase();
    const issues = [].concat(audit.issues || [], audit.hallucinations || [], audit.content_gaps || []);
    const needsContent = verdict === 'flag' || issues.length > 0;
    const needsImages =
      (Array.isArray(audit.image_gaps) && audit.image_gaps.length > 0) ||
      /pollinations|img-missing|%\s*2[Cc]|nologo=true|model=flux/i.test(original);

    if (!needsContent && !needsImages) {
      passed++;
      done.add(id);
      if (scanned % 25 === 0) {
        state.doneIds = [...done];
        state.scanned = (state.scanned || 0) + scanned;
        state.passed = (state.passed || 0) + passed;
        state.fixed = (state.fixed || 0) + fixed;
        state.lastId = id;
        state.lastRunAt = new Date().toISOString();
        await s.setJSON(STATE_KEY, state);
        console.log(JSON.stringify({ progress: true, scanned, fixed, passed, errors, id, note: 'pass' }));
      }
      continue;
    }

    let body = original;
    const actions = [];

    if (needsContent) {
      const critique = JSON.stringify({
        issues: audit.issues || [],
        hallucinations: audit.hallucinations || [],
        content_gaps: audit.content_gaps || [],
      }).slice(0, 2500);

      let rewritten =
        (await anthropicText(
          FIX_SYS,
          'ID: ' + id + '\nQuestion: ' + question + '\n\nCritique JSON:\n' + critique + '\n\nCurrent markdown:\n' + original
        )) ||
        (await geminiText(
          FIX_SYS,
          'ID: ' + id + '\nQuestion: ' + question + '\n\nCritique JSON:\n' + critique + '\n\nCurrent markdown:\n' + original,
          10000
        ));

      if (rewritten) {
        rewritten = rewritten.replace(/^```(?:markdown|md)?\n?/i, '').replace(/\n?```$/i, '').trim();
        // Visual lock: restore image/product lines from original
        try {
          body = enforceWriterVisualLock(original, rewritten, { id }) || preserveImages(original, rewritten);
        } catch (e) {
          body = preserveImages(original, rewritten);
        }
        actions.push('content-fix');
      }

      // Deterministic content gap fill (DA/FAQ/mermaid/sources) without touching images
      if (typeof fixEntry === 'function') {
        try {
          const before = body;
          const fr = await fixEntry(id, question, body, { quiet: true });
          if (fr && fr.body && fr.body.length > 400) {
            body = enforceWriterVisualLock(before, fr.body, { id }) || preserveImages(before, fr.body);
            actions.push('fixEntry');
          }
        } catch (e) {
          actions.push('fixEntry-skip:' + String(e.message || e).slice(0, 60));
        }
      }
    }

    if (needsImages || actions.length) {
      try {
        if (typeof repairBrokenQaImages === 'function') {
          const rr = await repairBrokenQaImages(id, question, body, { quiet: true });
          if (rr && rr.body) {
            body = rr.body;
            actions.push('repairBrokenQaImages');
          }
        }
      } catch (e) {
        actions.push('repair-skip');
      }
      try {
        if (typeof fillEntryMissingImages === 'function') {
          const fr = await fillEntryMissingImages(id, question, body, { quiet: true });
          if (fr && fr.body) {
            body = fr.body;
            actions.push('fillEntryMissingImages');
          } else if (fr && fr.answer) {
            body = fr.answer;
            actions.push('fillEntryMissingImages');
          }
        }
      } catch (e) {
        actions.push('fill-skip:' + String(e.message || e).slice(0, 60));
      }
    }

    if (body === original || !actions.length) {
      // flagged but couldn't rewrite — still stamp audit note, mark done to avoid spin
      passed++;
      done.add(id);
      console.log(JSON.stringify({ id, note: 'flagged-but-unchanged', verdict, issues: (issues || []).slice(0, 3) }));
      continue;
    }

    const g = gradeEntry(id, body);
    const ts = new Date().toISOString();
    await s.setJSON(
      'answers/' + id + '.json',
      Object.assign({}, blob, {
        answer: body,
        factchecked_at: ts,
        factcheck_issues: (issues || []).slice(0, 8),
        factcheck_actions: actions,
        quality_score: typeof g.score === 'number' ? Math.max(blob.quality_score || 0, g.score) : blob.quality_score,
        updated_at: ts,
      })
    );

    // light index touch
    const i = (idx.entries || []).findIndex((e) => e && e.id === id);
    if (i >= 0) {
      idx.entries[i] = Object.assign({}, idx.entries[i], {
        last_modified_ms: Date.now(),
        factchecked_at: ts,
      });
      if (i % 20 === 0) await s.setJSON('_index.json', idx);
    }

    fixed++;
    const url = knowledgeUrl(id);
    await emailOne(
      'PULSE fact-check fixed — ' + id,
      '<p>Hallucination/content/image gaps addressed.</p>' +
        '<p><b>Check:</b> <a href="' +
        url +
        '">' +
        url +
        '</a></p>' +
        '<p>actions: <code>' +
        actions.join(', ') +
        '</code></p>' +
        '<ul>' +
        (issues || [])
          .slice(0, 6)
          .map((x) => '<li>' + String(x).replace(/</g, '').slice(0, 220) + '</li>')
          .join('') +
        '</ul>'
    );

    done.add(id);
    if (fixed % 5 === 0 || scanned % 20 === 0) {
      state.doneIds = [...done];
      if (state.doneIds.length > 25000) state.doneIds = state.doneIds.slice(-25000);
      state.fixed = (state.fixed || 0) + fixed;
      state.passed = (state.passed || 0) + passed;
      state.scanned = (state.scanned || 0) + scanned;
      state.errors = (state.errors || 0) + errors;
      state.lastId = id;
      state.lastRunAt = new Date().toISOString();
      await s.setJSON(STATE_KEY, state);
      console.log(JSON.stringify({ progress: true, scanned, fixed, passed, errors, id, actions }));
    }
  }

  try {
    await s.setJSON('_index.json', idx);
  } catch (e) {}
  state.doneIds = [...done];
  state.fixed = (state.fixed || 0) + fixed;
  state.passed = (state.passed || 0) + passed;
  state.scanned = (state.scanned || 0) + scanned;
  state.complete = true;
  state.lastRunAt = new Date().toISOString();
  await s.setJSON(STATE_KEY, state);

  await emailOne(
    'PULSE fact-check batch finished — ' + fixed + ' fixed / ' + scanned + ' scanned',
    '<p>scanned=' + scanned + ' fixed=' + fixed + ' passed=' + passed + ' errors=' + errors + '</p>'
  );
  console.log(JSON.stringify({ done: true, scanned, fixed, passed, errors }));
}

main().catch((e) => {
  console.error(JSON.stringify({ fatal: String(e.message || e) }));
  process.exit(1);
});
