#!/usr/bin/env node
// Cadence (owner): 2750 at a time — ALWAYS purge first, then fact-check.
//   1) REMOVE mangled/broken images for BATCH_SIZE new ids (full wave)
//   2) ONLY AFTER that wave is purged: fact-check the SAME ids
//      → if issue: rewrite content AND redo Pexels image
//   3) ONE email per entry only when fact-check + content rewrite + image redo
//      all landed (single combined email)
//   4) when that 2750 finishes → next 2750 starting again at step 1 (purge first)
//
// Env:
//   CYCLE_MODE=fix|purge-then-fix|loop   (default: fix)
//   BATCH_SIZE / PURGE_MAX_NEW=2750
//   CYCLE_LIMIT=0               (0 = all not-yet-cycled purge ids)
//   DEEPSEEK_MODEL=deepseek-v4-flash

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { getStore } = require('@netlify/blobs');
const { preserveImages, enforceWriterVisualLock } = require('../_visual_lock_law');
const { pexelsRequest } = require('../netlify/functions/lib/pexels-throttle');
const { deriveImageSearchQuery } = require('../netlify/functions/lib/derive-image-search-query');

let storeGradedImage;
try {
  ({ storeGradedImage } = require('../_ddg_facecard_lib'));
} catch (e) {
  console.error(JSON.stringify({ warn: 'sharp/storeGradedImage', err: String(e.message || e) }));
}

function loadEnv(p) {
  try {
    for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch (e) {}
}
loadEnv('/tmp/pulse-runtime.env');
loadEnv(path.join(process.cwd(), '.env.local'));
loadEnv('C:/Users/koryj/website/.env.local');

const SITE_ID = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const KEY = 'pulsemachine-writer-2026';
const SITE = 'https://pulserevops.com';
const STATE_KEY = '_batch_cycle_state.json';
const IMAGE_STATE_KEY = '_mangled_image_purge_state.json';
const ASSET_DIR = path.join(process.cwd(), 'assets', 'qa');
const DS_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash';
const PEXELS_KEY = process.env.PEXELS_API_KEY || process.env.Pexels_Api_Key;
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || process.env.PURGE_MAX_NEW || '2750', 10);
const CYCLE_MODE = String(process.env.CYCLE_MODE || 'fix').toLowerCase();

fs.mkdirSync(ASSET_DIR, { recursive: true });

function store() {
  const tok = process.env.BLOBS_PAT;
  if (!tok) throw new Error('BLOBS_PAT required');
  return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok });
}

function knowledgeUrl(id) {
  return SITE + '/knowledge/' + encodeURIComponent(id);
}

async function emailOne(subject, html) {
  // Owner: ONE email per id only after fact-check + content rewrite + image redo.
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const r = await fetch(SITE + '/.netlify/functions/pulse-progress-notify?key=' + KEY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, html }),
        signal: AbortSignal.timeout(20000),
      });
      const t = await r.text();
      if (!r.ok) throw new Error('http ' + r.status + ':' + t.slice(0, 120));
      console.log(JSON.stringify({ email: 'ok', subject: String(subject).slice(0, 80), attempt }));
      return true;
    } catch (e) {
      console.log(
        JSON.stringify({
          email: 'fail',
          subject: String(subject).slice(0, 80),
          attempt,
          err: String(e.message || e).slice(0, 120),
        })
      );
      if (attempt < 3) await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }
  return false;
}

async function dsChat(system, user, maxTokens = 1200) {
  const key = process.env.DEEPSEEK_API_KEY || process.env.ds1;
  if (!key) throw new Error('DEEPSEEK missing');
  const r = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
    body: JSON.stringify({
      model: DS_MODEL,
      temperature: 0.2,
      max_tokens: maxTokens,
      // v4-flash otherwise burns the whole budget on reasoning_content → empty content / no-json
      thinking: { type: 'disabled' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
    signal: AbortSignal.timeout(180000),
  });
  const t = await r.text();
  if (!r.ok) throw new Error('ds ' + r.status + ':' + t.slice(0, 160));
  const j = JSON.parse(t);
  const msg = ((j.choices || [])[0] || {}).message || {};
  const content = String(msg.content || '').trim();
  if (content) return content;
  const reason = String(msg.reasoning_content || '').trim();
  const m = reason.match(/\{[\s\S]*\}/);
  if (m) return m[0];
  return '';
}

async function dsJson(system, user) {
  const text = await dsChat(system, user, 1200);
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) throw new Error('no-json');
  return JSON.parse(m[0]);
}

function clip(answer) {
  const s = String(answer || '').replace(/```mermaid[\s\S]*?```/g, '[diagram]');
  if (s.length <= 12000) return s;
  return s.slice(0, 7000) + '\n\n…\n\n' + s.slice(-4000);
}

const AUDIT_SYS = `Strict fact-checker. Return ONLY JSON:
{"verdict":"pass"|"flag","issues":["..."],"hallucinations":["..."],"content_gaps":["..."],"sections":["Direct Answer","## 2. ...","FAQ"]}
RULES for each string in issues/hallucinations/content_gaps:
- Start with the section name or number when possible, e.g. "Section 2:", "Section 3:", "Direct Answer:", "FAQ:", "Bottom Line:", "How We Ranked:".
- Then name the bad number/claim, e.g. "Section 2: price \$12k contradicts Section 3 \$18k".
- Prefer concrete wrong numbers/years/stats over vague wording.
FLAG invented facts/vendors/stats/years, contradictions, wrong Direct Answer, missing required sections.
"sections" = list of section headings/numbers you actually checked that had problems.
(Pipeline always redoes the Pexels image whenever content is rewritten for a flag.)`;

const FIX_SYS = `Rewrite the article to remove hallucinations and fill content gaps.
RULES:
- Keep heading order and structure.
- Leave every existing ![alt](url) and @@PRODUCT line EXACTLY unchanged (image pipeline handles swaps).
- Replace fabricated specifics with cautious accurate language — do not invent new numbers.
- Fill thin Direct Answer / FAQ / Bottom Line / How We Ranked / sources as needed.
- Keep mermaid fences valid.
Return ONLY full revised markdown.`;

async function pexelsCover(id, title) {
  if (!PEXELS_KEY || !storeGradedImage) throw new Error('pexels/store unavailable');
  const query = deriveImageSearchQuery(title || id);
  const url =
    'https://api.pexels.com/v1/search?per_page=5&orientation=landscape&query=' +
    encodeURIComponent(query);
  const r = await pexelsRequest(async () => {
    const res = await fetch(url, {
      headers: { Authorization: PEXELS_KEY, 'User-Agent': 'pulserevops-batch-cycle/1.0' },
      signal: AbortSignal.timeout(30000),
    });
    return { status: res.status, body: Buffer.from(await res.arrayBuffer()) };
  });
  if (r.status !== 200) throw new Error('pexels ' + r.status);
  const data = JSON.parse(r.body.toString('utf8'));
  const photos = data.photos || [];
  const ok = photos.filter((p) => p && p.width >= 1200 && p.width >= p.height);
  const pool = ok.length ? ok : photos;
  pool.sort((a, b) => b.width * b.height - a.width * a.height);
  const p = pool[0];
  const src = p && p.src && (p.src.large2x || p.src.large || p.src.original);
  if (!src) throw new Error('pexels miss');
  const dl = await fetch(src, { signal: AbortSignal.timeout(45000) });
  if (!dl.ok) throw new Error('dl ' + dl.status);
  const buf = Buffer.from(await dl.arrayBuffer());
  const dest = path.join(ASSET_DIR, id + '.jpg');
  await storeGradedImage(buf, dest, {
    square: 760,
    faceCard: true,
    cropPosition: 'attention',
    bright: false,
  });
  return { rel: '/assets/qa/' + id + '.jpg', query };
}

function swapLeadingImage(answer, rel, title) {
  const ans = String(answer || '');
  const alt = String(title || 'cover').replace(/[\[\]"]/g, '').slice(0, 80);
  if (/^﻿?\s*!\[[^\]]*\]\([^)]*\)\s*\n*/.test(ans)) {
    return '![' + alt + '](' + rel + ')\n\n' + ans.replace(/^﻿?\s*!\[[^\]]*\]\([^)]*\)\s*\n*/, '');
  }
  // no leading image slot — do not add (visual lock / slot count)
  return ans;
}

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Pull section labels like "Section 2", "FAQ", "Direct Answer" from issue text. */
function extractSectionLabels(items) {
  const labels = [];
  const seen = new Set();
  for (const raw of items || []) {
    const s = String(raw || '');
    const m =
      s.match(/^(Direct Answer|Bottom Line|How We Ranked|FAQ|Sources|What to Look For)\b/i) ||
      s.match(/^Section\s+(\d+)\b/i) ||
      s.match(/^##\s*(\d+)[.:]\s*([^\n—:-]{0,40})/i) ||
      s.match(/\b(?:in|for)\s+Section\s+(\d+)\b/i);
    let label = '';
    if (m) {
      if (/^\d+$/.test(m[1] || '')) label = 'Section ' + m[1];
      else if (m[0].toLowerCase().startsWith('section')) label = 'Section ' + (m[1] || '').trim();
      else label = m[1] || m[0];
      label = String(label).replace(/\s+/g, ' ').trim();
      // normalize casing for named sections
      if (/^direct answer$/i.test(label)) label = 'Direct Answer';
      if (/^bottom line$/i.test(label)) label = 'Bottom Line';
      if (/^faq$/i.test(label)) label = 'FAQ';
      if (/^how we ranked$/i.test(label)) label = 'How We Ranked';
      if (/^sources$/i.test(label)) label = 'Sources';
    }
    if (label && !seen.has(label.toLowerCase())) {
      seen.add(label.toLowerCase());
      labels.push(label);
    }
  }
  return labels;
}

/** Build subject + HTML that states exactly what was done, including fact-check sections. */
function describeUpdateEmail({ id, question, url, audit, actions, issues, writer }) {
  const halls = [].concat((audit && audit.hallucinations) || []);
  const gaps = [].concat((audit && audit.content_gaps) || []);
  const other = [].concat((audit && audit.issues) || []);
  const auditSections = [].concat((audit && audit.sections) || []);
  const pexelsActs = actions.filter((a) => String(a).startsWith('pexels:'));
  const imgQueries = pexelsActs.map((a) => String(a).replace(/^pexels:/, '').trim()).filter(Boolean);
  const imgCount = pexelsActs.length;
  const didRewrite = actions.includes('content-rewrite') || actions.includes('pexels-backfill');

  const fromText = extractSectionLabels([].concat(halls, gaps, other, issues));
  const sectionLabels = [];
  const seenSec = new Set();
  for (const s of [].concat(auditSections, fromText)) {
    const t = String(s || '').replace(/\s+/g, ' ').trim();
    if (!t || seenSec.has(t.toLowerCase())) continue;
    seenSec.add(t.toLowerCase());
    sectionLabels.push(t);
  }

  const factBits = [];
  if (sectionLabels.length) {
    factBits.push('fact-check ' + sectionLabels.slice(0, 4).join(', '));
  } else {
    factBits.push('fact-check');
  }
  if (halls.length) factBits.push(halls.length + ' incorrect number/claim' + (halls.length === 1 ? '' : 's'));
  if (gaps.length) factBits.push(gaps.length + ' gap' + (gaps.length === 1 ? '' : 's') + ' filled');
  if (!halls.length && !gaps.length && other.length) {
    factBits.push(other.length + ' issue' + (other.length === 1 ? '' : 's') + ' fixed');
  }

  const bits = [];
  bits.push(factBits.join(' — '));
  if (didRewrite) bits.push('rewrote body with ' + (writer || 'DeepSeek'));
  if (imgCount) bits.push(imgCount + ' Pexels image' + (imgCount === 1 ? '' : 's') + ' replaced');

  const subject = ('PULSE ' + id + ': ' + bits.join(' · ')).slice(0, 180);

  const issueLines = issues
    .slice(0, 8)
    .map((x) => '<li>' + esc(String(x).slice(0, 220)) + '</li>')
    .join('');

  const sectionLine = sectionLabels.length
    ? sectionLabels.map((s) => '<code>' + esc(s) + '</code>').join(', ')
    : '<i>see issues below</i>';

  const html =
    '<p><b>What I did on <code>' +
    esc(id) +
    '</code></b></p>' +
    '<p><a href="' +
    esc(url) +
    '">' +
    esc(url) +
    '</a></p>' +
    '<p><b>Question:</b> ' +
    esc(String(question || '').slice(0, 200)) +
    '</p>' +
    '<ol>' +
    '<li><b>Fact-check:</b> checked/corrected <b>' +
    sectionLine +
    '</b>' +
    (halls.length ? ' — ' + halls.length + ' incorrect number/claim(s)' : '') +
    (gaps.length ? ' — ' + gaps.length + ' content gap(s)' : '') +
    (other.length ? ' — ' + other.length + ' other issue(s)' : '') +
    '.</li>' +
    '<li><b>Content:</b> ' +
    (didRewrite
      ? 'rewrote/corrected those sections with <b>' +
        esc(writer || 'DeepSeek') +
        '</b> (visual-lock: existing image markdown slots preserved, then cover swapped).'
      : 'no body rewrite') +
    '</li>' +
    '<li><b>Images:</b> ' +
    (imgCount
      ? 'replaced <b>' +
        imgCount +
        '</b> image' +
        (imgCount === 1 ? '' : 's') +
        ' via <b>Pexels</b>' +
        (imgQueries.length
          ? ' — search: <code>' + esc(imgQueries.join('; ').slice(0, 160)) + '</code>'
          : '') +
        ' → <code>/assets/qa/' +
        esc(id) +
        '.jpg</code>.'
      : 'no image change') +
    '</li>' +
    '</ol>' +
    (issueLines
      ? '<p><b>Fact-check findings (by section):</b></p><ul>' + issueLines + '</ul>'
      : '') +
    '<p><b>Summary:</b> ' +
    esc(bits.join('; ')) +
    '.</p>';

  return { subject, html };
}

async function runPurgeBatch(batchSize) {
  console.log(JSON.stringify({ phase: 'purge-start', batchSize }));
  const r = spawnSync(
    process.execPath,
    [path.join(__dirname, 'purge-mangled-images-local.js')],
    {
      cwd: process.cwd(),
      env: Object.assign({}, process.env, {
        PURGE_MAX_NEW: String(batchSize),
        PURGE_LIMIT: String(Math.max(batchSize * 4, 10000)),
      }),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 64 * 1024 * 1024,
    }
  );
  if (r.stdout) process.stdout.write(r.stdout.slice(-4000));
  if (r.stderr) process.stderr.write(r.stderr.slice(-2000));
  if (r.status !== 0) throw new Error('purge-exit-' + r.status);
  const s = store();
  const imgState = (await s.get(IMAGE_STATE_KEY, { type: 'json' })) || {};
  return (imgState.doneIds || []).length;
}

async function runFactFixBatch() {
  const s = store();
  let state = { doneIds: [], fixed: 0, passed: 0, imaged: 0, errors: 0 };
  try {
    state = Object.assign(state, (await s.get(STATE_KEY, { type: 'json' })) || {});
  } catch (e) {}

  const imgState = (await s.get(IMAGE_STATE_KEY, { type: 'json' })) || {};
  let ids = Array.isArray(imgState.doneIds) ? imgState.doneIds.slice() : [];
  if (!ids.length) throw new Error('no mangled-purge doneIds — run image purge first');

  const limit = parseInt(process.env.CYCLE_LIMIT || '0', 10);
  if (limit > 0) ids = ids.slice(0, limit);

  const done = new Set(state.doneIds || []);
  // Fact-check exactly the not-yet-cycled purge ids (same set as the last purge wave).
  const todo = ids.filter((id) => !done.has(id));

  console.log(
    JSON.stringify({
      phase: 'fix-start',
      todo: todo.length,
      already: done.size,
      purgeDone: ids.length,
      batchSize: BATCH_SIZE,
    })
  );

  if (!todo.length) {
    console.log(JSON.stringify({ phase: 'fix-empty' }));
    return { fixed: 0, passed: 0, imaged: 0, errors: 0, processed: 0 };
  }

  const idx = await s.get('_index.json', { type: 'json', consistency: 'strong' });
  const baseFixed = state.fixed || 0;
  const basePassed = state.passed || 0;
  const baseImaged = state.imaged || 0;
  const baseErrors = state.errors || 0;
  let fixed = 0;
  let passed = 0;
  let imaged = 0;
  let errors = 0;
  let dirty = false;

  async function checkpoint(id) {
    if (dirty) {
      await s.setJSON('_index.json', idx);
      dirty = false;
    }
    state.doneIds = [...done];
    state.fixed = baseFixed + fixed;
    state.passed = basePassed + passed;
    state.imaged = baseImaged + imaged;
    state.errors = baseErrors + errors;
    state.lastId = id;
    state.batchSize = BATCH_SIZE;
    state.lastRunAt = new Date().toISOString();
    state.complete = false;
    await s.setJSON(STATE_KEY, state);
  }

  for (const id of todo) {
    let blob;
    try {
      blob = await s.get('answers/' + id + '.json', { type: 'json' });
    } catch (e) {
      errors++;
      continue;
    }
    if (!blob || !blob.answer) {
      done.add(id);
      continue;
    }

    const question = blob.question || id;
    const original = String(blob.answer);
    const url = knowledgeUrl(id);
    let actions = [];
    let issues = [];
    let body = original;
    const prior = Array.isArray(blob.batch_cycle_actions) ? blob.batch_cycle_actions : [];
    // Backfill: earlier rewrites that skipped Pexels still need an image redo
    const needsImgBackfill =
      prior.includes('content-rewrite') && !prior.some((a) => String(a).startsWith('pexels:'));

    try {
      const audit = await dsJson(
        AUDIT_SYS,
        'ID: ' + id + '\nQuestion: ' + question + '\n\nAnswer:\n' + clip(original)
      );
      const verdict = String(audit.verdict || '').toLowerCase();
      issues = [].concat(audit.issues || [], audit.hallucinations || [], audit.content_gaps || []);
      const hasIssue = verdict === 'flag' || issues.length > 0;

      if (hasIssue) {
        const critique = JSON.stringify({
          issues: audit.issues || [],
          hallucinations: audit.hallucinations || [],
          content_gaps: audit.content_gaps || [],
        }).slice(0, 2500);

        let rewritten = await dsChat(
          FIX_SYS,
          'ID: ' + id + '\nQuestion: ' + question + '\n\nCritique:\n' + critique + '\n\nMarkdown:\n' + original,
          10000
        );
        rewritten = rewritten.replace(/^```(?:markdown|md)?\n?/i, '').replace(/\n?```$/i, '').trim();
        if (rewritten.length > 400) {
          try {
            body = enforceWriterVisualLock(original, rewritten, { id }) || preserveImages(original, rewritten);
          } catch (e) {
            body = preserveImages(original, rewritten);
          }
          actions.push('content-rewrite');
        }
      }

      // Owner rule: any content issue → rewrite AND redo Pexels image
      if (actions.includes('content-rewrite') || needsImgBackfill) {
        try {
          const { rel, query } = await pexelsCover(id, question);
          body = swapLeadingImage(body, rel, question);
          const i = (idx.entries || []).findIndex((e) => e && e.id === id);
          if (i >= 0) {
            idx.entries[i].img = rel;
            idx.entries[i].cover_src = 'pexels';
            dirty = true;
          }
          actions.push('pexels:' + query);
          if (needsImgBackfill && !actions.includes('content-rewrite')) actions.push('pexels-backfill');
          imaged++;
        } catch (e) {
          actions.push('pexels-fail:' + String(e.message || e).slice(0, 80));
        }
      }

      const pexelsAct = actions.find((a) => String(a).startsWith('pexels:'));
      const fullFix =
        (actions.includes('content-rewrite') || actions.includes('pexels-backfill')) && !!pexelsAct;

      if (body !== original || actions.some((a) => a.startsWith('pexels:') || a === 'content-rewrite' || a === 'pexels-backfill')) {
        const ts = new Date().toISOString();
        await s.setJSON(
          'answers/' + id + '.json',
          Object.assign({}, blob, {
            answer: body,
            img: pexelsAct ? '/assets/qa/' + id + '.jpg' : blob.img,
            cover_src: pexelsAct ? 'pexels' : blob.cover_src,
            batch_cycled_at: ts,
            batch_cycle_actions: actions,
            batch_cycle_issues: issues.slice(0, 8),
            updated_at: ts,
          })
        );
        fixed++;

        // Owner: ONE email — subject/body spell out exactly what was done
        if (fullFix) {
          const mail = describeUpdateEmail({
            id,
            question,
            url,
            audit,
            actions,
            issues,
            writer: 'DeepSeek',
          });
          await emailOne(mail.subject, mail.html);
        }
      } else {
        passed++;
        // No email on clean pass — owner only wants the full update email
      }

      done.add(id);
      console.log(JSON.stringify({ id, actions, hasIssue, fullFix, emailed: fullFix, fixed, passed, imaged }));
    } catch (e) {
      errors++;
      console.log(JSON.stringify({ id, err: String(e.message || e).slice(0, 160) }));
      // No error email — owner only wants one email when full update lands
      await new Promise((r) => setTimeout(r, 2000));
      continue;
    }

    if ((fixed + passed) % 15 === 0) await checkpoint(id);
  }

  await checkpoint(todo[todo.length - 1]);
  state.complete = true;
  await s.setJSON(STATE_KEY, state);

  // No batch-summary email — owner wants one email per individual entry only.
  console.log(JSON.stringify({ phase: 'fix-done', fixed, passed, imaged, errors, processed: fixed + passed }));
  return { fixed, passed, imaged, errors, processed: fixed + passed };
}

async function main() {
  console.log(JSON.stringify({ phase: 'boot', mode: CYCLE_MODE, batchSize: BATCH_SIZE }));

  if (CYCLE_MODE === 'fix') {
    await runFactFixBatch();
    return;
  }

  if (CYCLE_MODE === 'purge-then-fix') {
    const before = await (async () => {
      const s = store();
      const img = (await s.get(IMAGE_STATE_KEY, { type: 'json' })) || {};
      return (img.doneIds || []).length;
    })();
    const after = await runPurgeBatch(BATCH_SIZE);
    console.log(JSON.stringify({ phase: 'purge-done', before, after, newIds: after - before }));
    await runFactFixBatch();
    return;
  }

  if (CYCLE_MODE === 'loop') {
    // Hard order every wave:
    //   A) if a purge wave is already complete but not fact-checked → finish fact-check
    //   B) else purge next BATCH_SIZE mangled images ALL THE WAY THROUGH
    //   C) then fact-check that same BATCH_SIZE
    // Never start fact-check on a wave before its purge finishes.
    for (;;) {
      const s = store();
      const img = (await s.get(IMAGE_STATE_KEY, { type: 'json' })) || {};
      const cycle = (await s.get(STATE_KEY, { type: 'json' })) || {};
      const purgeDone = new Set(img.doneIds || []);
      const cycleDone = new Set(cycle.doneIds || []);
      const pending = [...purgeDone].filter((id) => !cycleDone.has(id)).length;

      if (pending > 0) {
        console.log(
          JSON.stringify({
            phase: 'loop-factcheck-after-purge',
            pending,
            note: 'purge wave already complete — fact-check same ids only',
          })
        );
        await runFactFixBatch();
        continue;
      }

      console.log(
        JSON.stringify({
          phase: 'loop-purge-first',
          batchSize: BATCH_SIZE,
          note: 'always remove mangled images for full wave before fact-check',
        })
      );
      const before = purgeDone.size;
      const after = await runPurgeBatch(BATCH_SIZE);
      const added = after - before;
      console.log(JSON.stringify({ phase: 'loop-purge-done', before, after, added }));
      if (added <= 0) {
        console.log(JSON.stringify({ phase: 'loop-complete', note: 'no more mangled images' }));
        return;
      }
      console.log(
        JSON.stringify({
          phase: 'loop-factcheck-start',
          waveSize: added,
          note: 'purge finished — now fact-check / rewrite / image this wave',
        })
      );
      await runFactFixBatch();
    }
  }

  throw new Error('unknown CYCLE_MODE=' + CYCLE_MODE);
}

main().catch((e) => {
  console.error(JSON.stringify({ fatal: String(e.message || e) }));
  process.exit(1);
});
