#!/usr/bin/env node
/**
 * Reset CRO Pulse Tools (tl) media-machine inventory on :7900.
 * - Full catalog (~11042) as inventory
 * - Broken into groups of 250
 * - Face-hero / image jobs cleared; auto scrub stays OFF
 * Does NOT start processing.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const WD = fs.existsSync('C:/Users/koryj/website') ? 'C:/Users/koryj/website' : __dirname;
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const BATCH = 250;
const PILLAR = 'tl';
const PLAN = path.join(WD, '_tl_media_batches.json');
const FACE = path.join(WD, '_face_hero_run.json');
const INV = path.join(WD, '_tl_media_inventory.json');
const QUEUE = path.join(WD, '_scrub_button_queue.json');
const AP = path.join(WD, '_v2_approved.json');
const CC = path.join(WD, '_v2_cc_approved.json');
const NR = path.join(WD, '_v2_needs_review.json');
const REJECT = path.join(WD, '_scrub_reject_fix.json');
const LANE = path.join(WD, '_scrub_lane_jobs.json');

try {
  for (const line of fs.readFileSync('/tmp/aq-drip.env', 'utf8').split(/\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) v = v.slice(1, -1);
    if (!process.env[m[1]]) process.env[m[1]] = v;
  }
} catch (_e) {}

const { getStore } = require('@netlify/blobs');
const cfg = require('/home/ubuntu/.config/netlify/config.json');
const token =
  process.env.BLOBS_PAT ||
  process.env.NETLIFY_AUTH_TOKEN ||
  (Object.values(cfg.users || {})[0] && Object.values(cfg.users || {})[0].auth.token);
const store = getStore({ name: 'pulse-machine-library', siteID: SITE, token });

function readArr(p) {
  try {
    const j = JSON.parse(fs.readFileSync(p, 'utf8'));
    return Array.isArray(j) ? j : [];
  } catch {
    return [];
  }
}
function writeArr(p, a) {
  fs.writeFileSync(p, JSON.stringify(a, null, 2));
}

async function api(pathname, body) {
  try {
    const r = await fetch('http://127.0.0.1:7900' + pathname, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.assign({ key: '4444' }, body || {})),
    });
    return await r.json().catch(() => ({}));
  } catch (e) {
    return { ok: false, err: String(e.message || e) };
  }
}

async function main() {
  console.log('RESET tl media inventory · batches of', BATCH);
  for (const path of [
    '/face-hero-force-stop',
    '/image-generator-force-stop',
    '/image-duplicator-force-stop',
    '/image-rewrite-force-stop',
    '/internal-images-force-stop',
    '/image-generator-reset',
  ]) {
    console.log(path, await api(path, { action: 'stop' }));
  }
  await api('/scrub-auto', { action: 'stop' });

  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const tlIds = (idx.entries || [])
    .filter((e) => e && /^tl\d+$/i.test(String(e.id)))
    .map((e) => String(e.id).toLowerCase())
    .sort((a, b) => Number(a.slice(2)) - Number(b.slice(2)));
  const groups = [];
  for (let i = 0; i < tlIds.length; i += BATCH) {
    groups.push({
      batch: groups.length + 1,
      start: i,
      ids: tlIds.slice(i, i + BATCH),
    });
  }
  const plan = {
    pillar: PILLAR,
    pillarName: 'Pulse Tools / CRO',
    inventory: tlIds.length,
    batchSize: BATCH,
    batchCount: groups.length,
    batchIndex: 0, // next group to run (0-based)
    resetAt: new Date().toISOString(),
    groups: groups.map((g) => ({
      batch: g.batch,
      count: g.ids.length,
      first: g.ids[0],
      last: g.ids[g.ids.length - 1],
      ids: g.ids,
    })),
  };
  fs.writeFileSync(PLAN, JSON.stringify(plan, null, 2));

  const inv = {
    pillar: PILLAR,
    inventory: tlIds.length,
    batchSize: BATCH,
    batchCount: groups.length,
    batchIndex: 0,
    remaining: tlIds.length,
    source: 'live _index.json',
    at: new Date().toISOString(),
    mediaMachine: 'http://localhost:7900/face-card-top-image-generator',
  };
  fs.writeFileSync(INV, JSON.stringify(inv, null, 2));

  // Fresh face-hero state — inventory = full tl, not AI leftover
  const face = {
    running: false,
    stop: false,
    stopAfterReview: false,
    pillar: PILLAR,
    pillarName: 'Pulse Tools / CRO',
    done: 0,
    total: tlIds.length,
    pct: 0,
    entriesDone: 0,
    coversGenerated: 0,
    fluxJobs: 0,
    skippedNoBlob: 0,
    errors: 0,
    currentId: '',
    currentTitle: '',
    currentStep: 'reset · inventory ' + tlIds.length + ' · groups of ' + BATCH,
    phase: 'idle',
    startedAt: null,
    finishedAt: null,
    error: '',
    log: [
      new Date().toLocaleTimeString() +
        ' ↺ RESET inventory ' +
        tlIds.length +
        ' · ' +
        groups.length +
        ' groups × ' +
        BATCH,
    ],
    pendingReview: null,
    reviewAttempt: 1,
    batchSize: BATCH,
    batchIndex: 0,
    batchCount: groups.length,
    inventory: tlIds.length,
  };
  fs.writeFileSync(FACE, JSON.stringify(face, null, 2));

  // Queue: all tl at front; demote green; reject-fix stamped
  const tlSet = new Set(tlIds);
  const ap = readArr(AP).filter((id) => !tlSet.has(String(id).toLowerCase()));
  const cc = readArr(CC).filter((id) => !tlSet.has(String(id).toLowerCase()));
  let nr = readArr(NR).map((id) => String(id).toLowerCase()).filter((id) => !tlSet.has(id));
  nr = nr.concat(tlIds);
  const qRest = readArr(QUEUE).map((id) => String(id).toLowerCase()).filter((id) => !tlSet.has(id));
  writeArr(AP, ap);
  writeArr(CC, cc);
  writeArr(NR, nr);
  writeArr(QUEUE, [...tlIds, ...qRest]);

  const now = new Date().toISOString();
  const rejectRest = readArr(REJECT).filter((x) => x && !tlSet.has(String(x.id).toLowerCase()));
  writeArr(
    REJECT,
    [
      ...tlIds.map((id) => ({
        id,
        title: id,
        pillar: PILLAR,
        why: 'media machine reset — full tl inventory in groups of ' + BATCH,
        ownerTargets: ['pollinatorFaceCover', 'heroImage', 'media3to10'],
        ownerNotes: 'Batch plan: _tl_media_batches.json',
        source: 'tl-reset-media-batches',
        at: now,
        status: 'queued-for-scrub',
      })),
      ...rejectRest,
    ].slice(0, 12000)
  );

  const laneRest = readArr(LANE).filter((j) => j && j.id && !tlSet.has(String(j.id).toLowerCase()));
  const lane = tlIds.map((id) => ({
    id,
    phase: 'image_cover',
    sectionIdx: 0,
    imagesVerified: false,
    ownerNotes: 'tl media reset · groups of ' + BATCH,
    updatedAt: now,
  }));
  writeArr(LANE, [...lane, ...laneRest]);

  fs.writeFileSync(path.join(WD, '_scrub_auto_off.flag'), 'tl media reset paused\n');

  const key = process.env.RESEND_API_KEY || process.env.resendapikey;
  if (key) {
    const html = `<div style="font-family:Arial">
      <div style="background:#B91C1C;color:#fff;padding:14px;font-weight:700">🔴 RED LIGHT — tl inventory RESET (:7900)</div>
      <div style="padding:16px;border:3px solid #B91C1C;background:#FEF2F2">
        <p>CRO Pulse Tools inventory reset on media machine <b>:7900</b> (not unicorn).</p>
        <ul>
          <li>Inventory: <b>${tlIds.length}</b></li>
          <li>Groups of <b>${BATCH}</b>: <b>${groups.length}</b> batches</li>
          <li>Batch 1: ${groups[0].ids[0]} → ${groups[0].ids[groups[0].ids.length - 1]}</li>
        </ul>
        <p>Open <code>http://localhost:7900/face-card-top-image-generator</code> · pillar <code>tl</code> · Start when ready.<br>
        Plan file: <code>_tl_media_batches.json</code></p>
      </div>
    </div>`;
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.ALERT_FROM_EMAIL || 'PULSE Engine <onboarding@resend.dev>',
        to: [process.env.ALERT_TO || 'koryjordanwhite@gmail.com'],
        subject: `🔴 RED LIGHT — tl inventory ${tlIds.length} reset · ${groups.length}×${BATCH} (:7900)`,
        html,
        text: `tl inventory ${tlIds.length} reset into ${groups.length} groups of ${BATCH} on :7900`,
      }),
    });
    console.log('EMAIL', r.status, (await r.text()).slice(0, 120));
  }

  console.log(
    JSON.stringify(
      {
        inventory: tlIds.length,
        batchSize: BATCH,
        batchCount: groups.length,
        plan: PLAN,
        face: FACE,
        head: tlIds.slice(0, 5),
      },
      null,
      2
    )
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
