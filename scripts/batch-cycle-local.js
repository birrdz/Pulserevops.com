#!/usr/bin/env node
// Cadence (owner): 2725 at a time.
//   1) mangled-image purge for BATCH_SIZE new ids
//   2) same BATCH_SIZE: fact-check → content rewrite if flagged
//      → Pexels ONLY if rewrite needs a new image depiction
//   3) email after EVERY entry
//   4) repeat (CYCLE_MODE=loop) until purge finds nothing new
//
// Env:
//   CYCLE_MODE=fix|purge-then-fix|loop   (default: fix)
//   BATCH_SIZE / PURGE_MAX_NEW=2725
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
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || process.env.PURGE_MAX_NEW || '2725', 10);
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
  try {
    await fetch(SITE + '/.netlify/functions/pulse-progress-notify?key=' + KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, html }),
      signal: AbortSignal.timeout(15000),
    });
  } catch (e) {}
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
{"verdict":"pass"|"flag","issues":["..."],"hallucinations":["exact false claim"],"content_gaps":["thin/missing section"],"needs_new_image":false,"image_reason":""}
Set needs_new_image=true ONLY if a content rewrite would change what the section image should depict (topic/subject change). Do NOT request images for blank/white photos or style tweaks.
FLAG invented facts/vendors/stats/years, contradictions, wrong Direct Answer, missing required sections.`;

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

  await emailOne(
    'PULSE batch cycle started — ' + todo.length + ' entries',
    '<p>Cadence: image purge ' +
      BATCH_SIZE +
      ' → fact-check / content / conditional Pexels on the <b>same</b> ' +
      BATCH_SIZE +
      '.</p>' +
      '<p>Per entry: fact-check → content rewrite if needed → <b>Pexels only if rewrite needs a new image</b>.</p>' +
      '<p>Email after <b>every</b> entry.</p>'
  );

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
    let needsImg = false;
    let imgReason = '';

    try {
      const audit = await dsJson(
        AUDIT_SYS,
        'ID: ' + id + '\nQuestion: ' + question + '\n\nAnswer:\n' + clip(original)
      );
      const verdict = String(audit.verdict || '').toLowerCase();
      issues = [].concat(audit.issues || [], audit.hallucinations || [], audit.content_gaps || []);
      needsImg = !!audit.needs_new_image;
      imgReason = String(audit.image_reason || '');

      if (verdict === 'flag' || issues.length) {
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
          if (needsImg) actions.push('needs-pexels:' + (imgReason || 'topic-change'));
        }
      }

      if (actions.includes('content-rewrite') && needsImg) {
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
          imaged++;
        } catch (e) {
          actions.push('pexels-fail:' + String(e.message || e).slice(0, 80));
        }
      }

      if (body !== original || actions.some((a) => a.startsWith('pexels:') || a === 'content-rewrite')) {
        const ts = new Date().toISOString();
        await s.setJSON(
          'answers/' + id + '.json',
          Object.assign({}, blob, {
            answer: body,
            img: actions.find((a) => a.startsWith('pexels:'))
              ? '/assets/qa/' + id + '.jpg'
              : blob.img,
            cover_src: actions.find((a) => a.startsWith('pexels:')) ? 'pexels' : blob.cover_src,
            batch_cycled_at: ts,
            batch_cycle_actions: actions,
            batch_cycle_issues: issues.slice(0, 8),
            updated_at: ts,
          })
        );
        fixed++;
        await emailOne(
          'PULSE fixed — ' + id,
          '<p><b>Check:</b> <a href="' +
            url +
            '">' +
            url +
            '</a></p>' +
            '<p>actions: <code>' +
            actions.join(', ') +
            '</code></p>' +
            '<ul>' +
            issues
              .slice(0, 6)
              .map((x) => '<li>' + String(x).replace(/</g, '').slice(0, 200) + '</li>')
              .join('') +
            '</ul>'
        );
      } else {
        passed++;
        await emailOne(
          'PULSE checked OK — ' + id,
          '<p>Fact-check pass (no content rewrite; no new Pexels image).</p>' +
            '<p><a href="' +
            url +
            '">' +
            url +
            '</a></p>'
        );
      }

      done.add(id);
      console.log(JSON.stringify({ id, actions, needsImg, fixed, passed, imaged }));
    } catch (e) {
      errors++;
      console.log(JSON.stringify({ id, err: String(e.message || e).slice(0, 160) }));
      await emailOne(
        'PULSE cycle error — ' + id,
        '<p><a href="' +
          url +
          '">' +
          url +
          '</a></p><p><code>' +
          String(e.message || e).replace(/</g, '').slice(0, 300) +
          '</code></p>'
      );
      await new Promise((r) => setTimeout(r, 2000));
      continue;
    }

    if ((fixed + passed) % 15 === 0) await checkpoint(id);
  }

  await checkpoint(todo[todo.length - 1]);
  state.complete = true;
  await s.setJSON(STATE_KEY, state);

  await emailOne(
    'PULSE batch cycle finished — fixed ' + fixed + ' / passed ' + passed,
    '<p>fixed=' +
      fixed +
      ' passed=' +
      passed +
      ' pexels=' +
      imaged +
      ' errors=' +
      errors +
      ' batch=' +
      BATCH_SIZE +
      '</p>'
  );
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
    // Finish any already-purged-but-not-fact-checked ids first (e.g. first 2750),
    // then purge→fix in BATCH_SIZE waves until purge adds nothing.
    for (;;) {
      const s = store();
      const img = (await s.get(IMAGE_STATE_KEY, { type: 'json' })) || {};
      const cycle = (await s.get(STATE_KEY, { type: 'json' })) || {};
      const purgeDone = new Set(img.doneIds || []);
      const cycleDone = new Set(cycle.doneIds || []);
      const pending = [...purgeDone].filter((id) => !cycleDone.has(id)).length;

      if (pending > 0) {
        console.log(JSON.stringify({ phase: 'loop-drain-pending', pending }));
        await runFactFixBatch();
        continue;
      }

      const before = purgeDone.size;
      const after = await runPurgeBatch(BATCH_SIZE);
      const added = after - before;
      console.log(JSON.stringify({ phase: 'loop-purge', before, after, added }));
      if (added <= 0) {
        await emailOne(
          'PULSE loop complete — no more mangled images',
          '<p>Purge found 0 new mangled entries. Fact-check queue empty.</p>'
        );
        console.log(JSON.stringify({ phase: 'loop-complete' }));
        return;
      }
      await runFactFixBatch();
    }
  }

  throw new Error('unknown CYCLE_MODE=' + CYCLE_MODE);
}

main().catch((e) => {
  console.error(JSON.stringify({ fatal: String(e.message || e) }));
  process.exit(1);
});
