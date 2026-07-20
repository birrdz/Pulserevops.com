#!/usr/bin/env node
/**
 * CRO Pulse Tools — Content Booster lift to 12/13 (owner 2026-07-20).
 *
 * Copies the scrub-button Format Fixer path exactly:
 *   formatFixEntry → fixEntry (DeepSeek stations) → preserveImages / visual lock
 *
 * Rules:
 * - ONE page at a time (never 2 pages in parallel)
 * - Target score/rubric pass @ 12 (not fake 13)
 * - Never strip existing images (preserveImages / enforceWriterVisualLock)
 * - Reverse queue (high → low) — rework the bad end first
 * - Email every page that finishes at 12
 * - DeepSeek only for real lifts (skip already-pass)
 *
 *   INTERVAL_MS=90000 DS_DAILY_CAP=15 node _tl_content_booster_lift12.js
 *   ONCE=1 node _tl_content_booster_lift12.js
 */
'use strict';

process.env.GOLD_SKIP_IMG_GATE = process.env.GOLD_SKIP_IMG_GATE || '1';
process.env.V2C_DS_CONC = '1'; // never spin 2 page workers
process.env.CONTENT_WRITER_ENGINE = process.env.CONTENT_WRITER_ENGINE || 'deepseek';

const fs = require('fs');
const { getStore } = require('/workspace/node_modules/@netlify/blobs');
const { dsChat: _dsChatRaw, todaySpend, DAILY_CAP } = require('/workspace/_ds_lib');
const { gradeEntry } = require('/workspace/netlify/functions/lib/grade-entry');
const { formatFixEntry, contentFormatPass, preserveImages } = require('/workspace/_format_fixer_lib');
const { fixEntry } = require('/workspace/_v2_components');
const { stampIndexFromAnswers } = require('/workspace/_finish_index_stamp_lib');

// Owner: only 1 DeepSeek call at a time — no parallel station/page calls.
let _dsLock = Promise.resolve();
function dsChat(messages, opts) {
  const run = _dsLock.then(() => _dsChatRaw(messages, opts));
  _dsLock = run.then(
    () => {},
    () => {}
  );
  return run;
}

// Load drip env (ds1, blobs, resend)
try {
  const envPath = process.env.AQ_DRIP_ENV || '/tmp/aq-drip.env';
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split(/\n/)) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (!m) continue;
      let v = m[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      if (!process.env[m[1]]) process.env[m[1]] = v;
    }
  }
} catch (_e) {}

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const store = getStore({
  name: 'pulse-machine-library',
  siteID: SITE_ID,
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});

const STATE_PATH = process.env.LIFT12_STATE || '/tmp/tl-content-booster-lift12-state.json';
const LOG_PATH = process.env.LIFT12_LOG || '/tmp/tl-content-booster-lift12.log';
const INTERVAL_MS = Number(process.env.INTERVAL_MS || 90 * 1000); // slow at first
// Only stop after one unit when ONCE is exactly "1" (never treat "0" as truthy)
const ONCE = String(process.env.ONCE || '') === '1';
const TARGET = Number(process.env.TARGET_SCORE || 12);
// Owner 2026-07-20: after 3 tries if score won't climb, approve + email + move on.
const MAX_TRIES = Math.max(1, Number(process.env.MAX_TRIES || 3));
const RETRY_PAUSE_MS = Number(process.env.RETRY_PAUSE_MS || 5000);
const RECIPIENT = process.env.ALERT_TO || process.env.ALERT_TO_EMAIL || 'koryjordanwhite@gmail.com';
const RESEND_KEY = process.env.resendapikey || process.env.RESEND_API_KEY || process.env.RESENDAPIKEY || '';
const RESEND_FROM = process.env.ALERT_FROM_EMAIL || 'PULSE Engine <onboarding@resend.dev>';
const EMAIL_ON_PASS = process.env.EMAIL_ON_PASS !== '0';

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  try {
    fs.appendFileSync(LOG_PATH, line + '\n');
  } catch (_e) {}
  console.log(line);
}

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
  } catch {
    return null;
  }
}

function saveState(st) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(st, null, 2));
}

function absUrl(u) {
  const s = String(u || '').trim();
  if (!s) return '';
  if (/^https?:\/\//i.test(s)) return s;
  if (s.startsWith('/')) return 'https://pulserevops.com' + s;
  return 'https://pulserevops.com/' + s.replace(/^\.\//, '');
}

function pageUrl(id) {
  return `https://pulserevops.com/tools/${id}`;
}

function bodyImages(body) {
  return [...String(body || '').matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map((m) => m[1]);
}

function imageFingerprint(entry, body) {
  const urls = bodyImages(body);
  return {
    img: entry.img || null,
    cover: entry.cover || null,
    face: entry.face || null,
    bodyN: urls.length,
    bodyUrls: urls.slice(),
  };
}

function imagesPreserved(beforeFp, afterFp) {
  if ((beforeFp.img || '') !== (afterFp.img || '')) return false;
  if ((beforeFp.cover || '') !== (afterFp.cover || '')) return false;
  if ((beforeFp.face || '') !== (afterFp.face || '')) return false;
  if (beforeFp.bodyN !== afterFp.bodyN) return false;
  const a = beforeFp.bodyUrls.slice().sort().join('\n');
  const b = afterFp.bodyUrls.slice().sort().join('\n');
  return a === b;
}

async function emailFinished({ id, title, before, after, url, cover, bodyImgs, steps, approvedAfterTries }) {
  if (!EMAIL_ON_PASS) {
    log('EMAIL skipped ' + id + ' EMAIL_ON_PASS=0');
    return { ok: false, reason: 'email_off' };
  }
  if (!RESEND_KEY) {
    log('EMAIL skipped ' + id + ' no Resend key');
    return { ok: false, reason: 'no_key' };
  }
  const liveUrl = url || pageUrl(id);
  const approved = !!approvedAfterTries;
  const banner = approved
    ? `✅ CRO Pulse Tools — approved after ${MAX_TRIES} tries · ${after}/13`
    : `✅ CRO Pulse Tools — finished ${after}/${TARGET}`;
  const subject = approved
    ? `✅ ${id} approved after ${MAX_TRIES} tries (${after}/13) — ${liveUrl}`
    : `✅ ${id} finished ${after}/${TARGET} — ${liveUrl}`;
  const thumbs = [cover, ...((bodyImgs || []).filter((u) => u && u !== cover))]
    .filter(Boolean)
    .slice(0, 3)
    .map((src) => absUrl(src));
  const thumbsHtml = thumbs.length
    ? thumbs
        .map(
          (src) =>
            `<a href="${liveUrl}" style="display:inline-block;margin:0 8px 8px 0"><img src="${src}" alt="" width="220" style="width:220px;max-width:100%;height:auto;border:2px solid #15803d;display:block" /></a>`
        )
        .join('')
    : '';
  const note = approved
    ? `<p style="margin:0 0 12px;color:#854d0e;font-weight:700">Hit a snag at ${after}/13 after ${MAX_TRIES} Content Booster tries — approved to keep the queue moving.</p>`
    : '';
  const html = `<div style="font-family:Arial,sans-serif;line-height:1.5">
    <div style="background:#15803d;color:#fff;padding:14px 18px;font-size:20px;font-weight:700">
      ${banner}
    </div>
    <div style="padding:16px;border:3px solid #15803d;background:#F0FDF4">
      <p style="margin:0 0 8px;font-size:18px;font-weight:700">${id} · score ${before} → ${after}</p>
      <p style="margin:0 0 12px;font-weight:700">${String(title || '').replace(/</g, '&lt;')}</p>
      ${note}
      <p style="margin:0 0 16px">
        <a href="${liveUrl}" style="display:inline-block;background:#15803d;color:#fff;padding:12px 18px;border-radius:6px;font-weight:700;text-decoration:none">
          Open live page →
        </a>
      </p>
      <p style="margin:0 0 12px;font-size:14px">Link: <a href="${liveUrl}" style="color:#0b57d0;font-weight:700">${liveUrl}</a></p>
      <div style="margin:0 0 12px">${thumbsHtml}</div>
      <p style="margin:0;color:#666;font-size:12px">Content Booster · ${steps || ''} · ${new Date().toISOString()}</p>
    </div>
  </div>`;
  const payload = {
    from: RESEND_FROM,
    to: [RECIPIENT],
    subject,
    html,
    text: `DONE ${id}\nScore ${before} → ${after}${approved ? ` (approved after ${MAX_TRIES} tries)` : ''}\nOpen: ${liveUrl}\n`,
  };
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const text = await r.text();
      log('EMAIL ' + id + ' attempt=' + attempt + ' ' + r.status + ' ' + text.slice(0, 120));
      if (r.ok) return { ok: true, status: r.status, url: liveUrl };
      if (attempt < 3) await new Promise((res) => setTimeout(res, 1500 * attempt));
    } catch (e) {
      log('EMAIL err ' + id + ' attempt=' + attempt + ' ' + e.message);
      if (attempt < 3) await new Promise((res) => setTimeout(res, 1500 * attempt));
    }
  }
  return { ok: false, reason: 'resend_failed', url: liveUrl };
}

async function buildReverseQueue() {
  let ids = [];
  try {
    ids = JSON.parse(fs.readFileSync('/tmp/tl-all-ids.json', 'utf8'));
  } catch {
    const listed = await store.list({ prefix: 'answers/tl' });
    ids = ((listed && listed.blobs) || [])
      .map((b) => String(b.key || '').replace(/^answers\//, '').replace(/\.json$/, ''))
      .filter((id) => /^tl\d+$/i.test(id));
  }
  ids.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  ids.reverse();
  return ids;
}

async function loadSiblings(id) {
  // Lightweight: pull a few nearby tl titles from index if present
  try {
    const idx = await store.get('index.json', { type: 'json' });
    const entries = (idx && (idx.entries || idx)) || [];
    const tl = (Array.isArray(entries) ? entries : [])
      .filter((e) => e && /^tl\d+/i.test(e.id) && e.id !== id)
      .slice(0, 40)
      .map((e) => ({ id: e.id, title: e.question || e.title || e.id }));
    return tl.slice(0, 8);
  } catch {
    return [];
  }
}

function structOk(body) {
  return (
    /^##\s*Direct Answer\b/m.test(body) &&
    /^##\s*FAQ\b/m.test(body) &&
    /^##\s*Sources\b/m.test(body)
  );
}

/** One Content Booster pass. Does not email. */
async function boosterPass(id, valid, entry) {
  const title = entry.question || entry.h1 || id;
  const beforeFp = imageFingerprint(entry, entry.answer);
  const beforeG = gradeEntry(id, entry.answer, { imagesDeferred: true, title });
  const sib = await loadSiblings(id);
  const r = await formatFixEntry(id, title, entry.answer, {
    valid,
    siblings: sib,
    store,
    entryMeta: entry,
    fixEntry,
    dsChat,
    pillarOf: (x) => (String(x).match(/^[a-z]+/i) || [''])[0].toLowerCase(),
    qaGoldOutline: true,
    maxRounds: 2,
  });

  let nextBody = r.body || entry.answer;
  nextBody = preserveImages(entry.answer, nextBody, { id, title, qaGold: true });
  const afterG = gradeEntry(id, nextBody, { imagesDeferred: true, title });
  const afterFp = imageFingerprint(entry, nextBody);
  const imagesOk = imagesPreserved(beforeFp, afterFp);
  if (!imagesOk) {
    log('IMAGE_LOCK_ABORT ' + id + ' before=' + beforeFp.bodyN + ' after=' + afterFp.bodyN);
    return {
      ok: false,
      aborted: 'images',
      before: beforeG.score,
      after: beforeG.score,
      body: entry.answer,
      imagesOk: false,
      bodyImgCount: beforeFp.bodyN,
      steps: r.steps || [],
      failed: (r.after && r.after.failed) || [],
      hitTarget: beforeG.score >= TARGET && structOk(entry.answer),
    };
  }
  const hitTarget = afterG.score >= TARGET && structOk(nextBody);
  return {
    ok: true,
    before: beforeG.score,
    after: afterG.score,
    body: nextBody,
    imagesOk: true,
    bodyImgCount: afterFp.bodyN,
    steps: r.steps || [],
    failed: (r.after && r.after.failed) || [],
    hitTarget,
    changed: nextBody !== entry.answer,
  };
}

/**
 * Up to MAX_TRIES Content Booster passes.
 * If still under target after 3 tries → APPROVE + email + move on (owner 2026-07-20).
 */
async function processOne(id, valid) {
  let entry = await store.get(`answers/${id}.json`, { type: 'json', consistency: 'strong' });
  if (!entry || !entry.answer) return { id, error: 'missing' };

  const title = entry.question || entry.h1 || id;
  const startScore = gradeEntry(id, entry.answer, { imagesDeferred: true, title }).score;
  const startFp = imageFingerprint(entry, entry.answer);

  // Already good enough — skip (no re-email unless never emailed; keep moving)
  if (entry.tl_booster_approved || (startScore >= TARGET && structOk(entry.answer))) {
    return {
      id,
      title: String(title).slice(0, 80),
      skipped: true,
      before: startScore,
      after: startScore,
      pass: true,
      imagesOk: true,
      bodyImgCount: startFp.bodyN,
      tries: 0,
    };
  }

  let best = {
    score: startScore,
    body: entry.answer,
    steps: [],
    failed: [],
    bodyImgCount: startFp.bodyN,
  };
  let tries = 0;
  let hitTarget = false;
  const scoreHistory = [startScore];

  for (let attempt = 1; attempt <= MAX_TRIES; attempt++) {
    tries = attempt;
    log(`TRY ${attempt}/${MAX_TRIES} → ${id} (score=${best.score})`);
    // Reload entry so each try starts from latest saved body
    entry = await store.get(`answers/${id}.json`, { type: 'json', consistency: 'strong' });
    if (!entry || !entry.answer) break;

    let passResult;
    try {
      passResult = await boosterPass(id, valid, entry);
    } catch (e) {
      log('TRY_ERR ' + id + ' attempt=' + attempt + ' ' + (e.message || e));
      passResult = null;
    }

    if (passResult && passResult.ok && passResult.after >= best.score) {
      best = {
        score: passResult.after,
        body: passResult.body,
        steps: passResult.steps,
        failed: passResult.failed,
        bodyImgCount: passResult.bodyImgCount,
      };
      // Persist improving body (images locked inside boosterPass)
      if (passResult.changed) {
        await store.setJSON(`answers/${id}.json`, {
          ...entry,
          answer: passResult.body,
          img: entry.img,
          cover: entry.cover,
          face: entry.face,
          cover_src: entry.cover_src,
          cro_kit: entry.cro_kit,
          cro_kit_body: entry.cro_kit_body,
          h1: entry.h1 || title,
          polished_at: Date.now(),
          quality_score: passResult.after,
          tl_content_booster_at: Date.now(),
          tl_booster_before: startScore,
          tl_booster_after: passResult.after,
          updated_at: new Date().toISOString(),
        });
        try {
          await stampIndexFromAnswers(store, [id], { log, lockTlCover: true });
        } catch (_e) {}
      }
    }

    scoreHistory.push(best.score);
    if (passResult && passResult.hitTarget) {
      hitTarget = true;
      break;
    }

    // Stuck: no score gain this try and already tried once — still use remaining tries
    const gained = best.score > (scoreHistory[scoreHistory.length - 2] || startScore);
    log(
      `TRY_RESULT ${id} attempt=${attempt} best=${best.score} gained=${gained} hit=${hitTarget}`
    );
    if (attempt < MAX_TRIES) {
      await new Promise((r) => setTimeout(r, RETRY_PAUSE_MS));
    }
  }

  const approvedAfterTries = !hitTarget && tries >= MAX_TRIES;
  const pass = hitTarget || approvedAfterTries;

  if (pass) {
    const latest = await store.get(`answers/${id}.json`, { type: 'json', consistency: 'strong' });
    const finalBody = best.body || (latest && latest.answer) || entry.answer;
    await store.setJSON(`answers/${id}.json`, {
      ...(latest || entry),
      answer: finalBody,
      img: (latest || entry).img,
      cover: (latest || entry).cover,
      face: (latest || entry).face,
      cover_src: (latest || entry).cover_src,
      cro_kit: (latest || entry).cro_kit,
      cro_kit_body: (latest || entry).cro_kit_body,
      h1: (latest || entry).h1 || title,
      polished_at: Date.now(),
      quality_score: best.score,
      tl_content_booster_at: Date.now(),
      tl_booster_before: startScore,
      tl_booster_after: best.score,
      tl_booster_pass: hitTarget,
      tl_booster_approved: approvedAfterTries,
      tl_booster_tries: tries,
      updated_at: new Date().toISOString(),
    });
    try {
      await stampIndexFromAnswers(store, [id], { log, lockTlCover: true });
    } catch (_e) {}

    if (approvedAfterTries) {
      log(`APPROVE_AFTER_${MAX_TRIES} ${id} score=${best.score} history=${scoreHistory.join('→')}`);
    }

    const emailed = await emailFinished({
      id,
      title,
      before: startScore,
      after: best.score,
      url: pageUrl(id),
      cover: (latest || entry).cover || (latest || entry).img || (latest || entry).face,
      bodyImgs: bodyImages(finalBody),
      steps: (best.steps || []).join('+') + (approvedAfterTries ? '+approve-after-' + MAX_TRIES : ''),
      approvedAfterTries,
    });
    if (!emailed || !emailed.ok) {
      log('EMAIL_FAIL ' + id + ' ' + JSON.stringify(emailed) + ' link=' + pageUrl(id));
    } else {
      log('EMAIL_OK ' + id + ' link=' + pageUrl(id) + (approvedAfterTries ? ' approved_after_tries' : ''));
    }

    return {
      id,
      title: String(title).slice(0, 80),
      changed: true,
      before: startScore,
      after: best.score,
      pass: true,
      approvedAfterTries,
      tries,
      scoreHistory,
      imagesOk: true,
      bodyImgCount: best.bodyImgCount,
      steps: best.steps,
      failed: best.failed,
      emailed: emailed && emailed.ok ? emailed.status : emailed,
      spend: todaySpend(),
    };
  }

  log('NO_EMAIL ' + id + ' score=' + best.score + ' tries=' + tries + ' (unexpected)');
  return {
    id,
    title: String(title).slice(0, 80),
    before: startScore,
    after: best.score,
    pass: false,
    tries,
    scoreHistory,
    imagesOk: true,
    bodyImgCount: best.bodyImgCount,
    emailed: null,
    spend: todaySpend(),
  };
}

async function main() {
  log(
    `BOOT content-booster lift12 TARGET=${TARGET} MAX_TRIES=${MAX_TRIES} INTERVAL_MS=${INTERVAL_MS} ONCE=${ONCE} DS_CAP=$${DAILY_CAP} spend=${JSON.stringify(todaySpend())} serial=1 approve_after_tries=1`
  );

  let st = loadState();
  if (!st || !Array.isArray(st.queue) || !st.queue.length || st.mode !== 'content-booster-lift12-reverse') {
    const queue = await buildReverseQueue();
    st = {
      mode: 'content-booster-lift12-reverse',
      direction: 'reverse',
      target: TARGET,
      queue,
      cursor: 0,
      finished: [],
      emailed: [],
      startedAt: new Date().toISOString(),
    };
    saveState(st);
    log(`Queue ready reverse ${queue.length} · first=${queue[0]} last=${queue[queue.length - 1]}`);
  } else {
    log(`Resume cursor=${st.cursor}/${st.queue.length} id=${st.queue[st.cursor]}`);
  }

  // valid id set for link cleaning — tl + q knowledge links
  let valid = new Set(st.queue);
  try {
    const idx = await store.get('index.json', { type: 'json' });
    const entries = (idx && (idx.entries || idx)) || [];
    for (const e of Array.isArray(entries) ? entries : []) if (e && e.id) valid.add(e.id);
  } catch (_e) {}

  while (st.cursor < st.queue.length) {
    const id = st.queue[st.cursor];
    log(`UNIT ${st.cursor + 1}/${st.queue.length} → ${id} (serial)`);
    let result;
    try {
      result = await processOne(id, valid);
    } catch (e) {
      result = { id, error: String(e.message || e) };
      log('ERR ' + id + ' ' + result.error);
    }
    log(JSON.stringify(result));
    if (result && result.pass) {
      st.finished.push(id);
      if (result.emailed && result.emailed !== null) st.emailed.push(id);
    }
    st.cursor += 1;
    st.updatedAt = new Date().toISOString();
    saveState(st);

    if (ONCE) break;
    if (st.cursor >= st.queue.length) break;

    // Hard serial pause between pages
    log(`Sleeping ${INTERVAL_MS}ms…`);
    await new Promise((r) => setTimeout(r, INTERVAL_MS));
  }

  if (st.cursor >= st.queue.length) {
    log(`COMPLETE finished=${st.finished.length} emailed=${st.emailed.length}`);
    try {
      fs.writeFileSync('/tmp/tl-content-booster-COMPLETE.flag', new Date().toISOString());
    } catch (_e) {}
  }
}

main().catch((e) => {
  console.error(e);
  log('FATAL ' + (e && e.message));
  process.exit(1);
});
