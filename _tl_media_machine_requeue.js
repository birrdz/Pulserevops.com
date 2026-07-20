#!/usr/bin/env node
/**
 * Put ALL CRO Pulse Tools (tl) Q&As into Kory's media-machine / scrubber red slot.
 * - Prepend every tl id to _scrub_button_queue.json
 * - Demote out of green (_v2_approved / _v2_cc_approved)
 * - Add to _v2_needs_review.json
 * - Stamp reject-fix + lane image_cover (face card / media redo)
 * Does NOT auto-start Face Hero or scrub (owner presses Begin / Face Hero).
 */
'use strict';
const fs = require('fs');
const path = require('path');
const WD = __dirname;
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const PILLAR = 'tl';
const QUEUE = path.join(WD, '_scrub_button_queue.json');
const AP = path.join(WD, '_v2_approved.json');
const CC = path.join(WD, '_v2_cc_approved.json');
const NR = path.join(WD, '_v2_needs_review.json');
const PARK = path.join(WD, '_redbox_parked.json');
const PENDING = path.join(WD, '_scrub_pending_signoff.json');
const REJECT_FIX = path.join(WD, '_scrub_reject_fix.json');
const LANE_JOBS = path.join(WD, '_scrub_lane_jobs.json');
const BAK = path.join(WD, '_ledger_bak_tl_media_' + Date.now());
const LOG = '/tmp/tl-media-machine-requeue.log';
const REPORT = '/tmp/tl-media-machine-requeue-report.json';

try {
  for (const line of fs.readFileSync('/tmp/aq-drip.env', 'utf8').split(/\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) v = v.slice(1, -1);
    if (!process.env[m[1]]) process.env[m[1]] = v;
  }
} catch (_e) {}
try {
  for (const line of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (_e) {}

const { getStore } = require('@netlify/blobs');
const cfg = require('/home/ubuntu/.config/netlify/config.json');
const token =
  process.env.BLOBS_PAT ||
  process.env.NETLIFY_AUTH_TOKEN ||
  (Object.values(cfg.users || {})[0] && Object.values(cfg.users || {})[0].auth.token);
const store = getStore({ name: 'pulse-machine-library', siteID: SITE, token });

function log(s) {
  const line = `[${new Date().toISOString()}] ${s}`;
  console.log(line);
  fs.appendFileSync(LOG, line + '\n');
}
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

async function emailDone(stats) {
  const key = process.env.RESEND_API_KEY || process.env.resendapikey;
  const to = process.env.ALERT_TO || 'koryjordanwhite@gmail.com';
  const from = process.env.ALERT_FROM_EMAIL || 'PULSE Engine <onboarding@resend.dev>';
  if (!key) return;
  const html = `<div style="font-family:Arial,sans-serif">
    <div style="background:#B91C1C;color:#fff;padding:14px 18px;font-weight:700;font-size:20px">🔴 RED LIGHT — CRO Pulse Tools in media machine slot</div>
    <div style="padding:16px;border:3px solid #B91C1C;background:#FEF2F2">
      <p>All <b>CRO Pulse Tools (tl)</b> Q&amp;As are in your scrubber / media-machine red slot.</p>
      <ul>
        <li>tl queued: <b>${stats.tlCount}</b></li>
        <li>Demoted from green: ${stats.demotedGreen}</li>
        <li>Queue total now: ${stats.queueTotal}</li>
        <li>Reject-fix stamped: ${stats.rejectFix}</li>
      </ul>
      <p style="margin-top:12px">Open unicorn portal → filter <code>tl</code> → Face Card / Media Machine / Begin Scrub when ready.<br>
      <b>Not auto-started</b> (you press Start).</p>
    </div>
  </div>`;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `🔴 RED LIGHT — tl (${stats.tlCount}) ready in media machine slot`,
      html,
      text: `tl ${stats.tlCount} in media machine / scrubber red slot`,
    }),
  });
  log('EMAIL ' + r.status + ' ' + (await r.text()).slice(0, 140));
}

async function main() {
  log('START requeue ALL tl → media machine / scrubber red slot');
  fs.mkdirSync(BAK, { recursive: true });
  for (const f of [QUEUE, AP, CC, NR, PARK, PENDING, REJECT_FIX, LANE_JOBS]) {
    if (fs.existsSync(f)) fs.copyFileSync(f, path.join(BAK, path.basename(f)));
  }
  log('backed up ledgers → ' + BAK);

  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const tlIds = (idx.entries || [])
    .filter((e) => e && /^tl\d+$/i.test(String(e.id)))
    .map((e) => String(e.id).toLowerCase())
    .sort((a, b) => Number(a.slice(2)) - Number(b.slice(2)));
  const tlSet = new Set(tlIds);
  log('tl catalog count=' + tlIds.length);

  const apBefore = readArr(AP);
  const ccBefore = readArr(CC);
  const demotedGreen = apBefore.filter((id) => tlSet.has(String(id).toLowerCase())).length;

  const ap = apBefore.filter((id) => !tlSet.has(String(id).toLowerCase()));
  const cc = ccBefore.filter((id) => !tlSet.has(String(id).toLowerCase()));
  const nr = readArr(NR)
    .map((id) => String(id).toLowerCase())
    .filter((id) => !tlSet.has(id));
  for (const id of tlIds) nr.push(id);

  const qRest = readArr(QUEUE)
    .map((id) => String(id).toLowerCase())
    .filter((id) => !tlSet.has(id));
  const queue = [...tlIds, ...qRest];

  const park = readArr(PARK).filter((p) => !tlSet.has(String((p && p.id) || p).toLowerCase()));
  const pending = readArr(PENDING).filter((x) => x && !tlSet.has(String(x.id).toLowerCase()));

  const now = new Date().toISOString();
  const rejectRest = readArr(REJECT_FIX).filter((x) => x && !tlSet.has(String(x.id).toLowerCase()));
  // Keep reject-fix lean for UI (cap) but stamp ALL tl into lane jobs.
  const rejectFix = [
    ...tlIds.map((id) => ({
      id,
      title: id,
      pillar: PILLAR,
      why: 'media machine — full CRO Pulse Tools inventory (face cards + images)',
      ownerTargets: ['pollinatorFaceCover', 'heroImage', 'media3to10', 'imagesLaw'],
      ownerNotes: 'Run through Kory media machine / Face Card slot. Full tl pillar inventory.',
      source: 'tl-media-machine-requeue',
      at: now,
      status: 'queued-for-scrub',
    })),
    ...rejectRest,
  ].slice(0, 12000);

  const laneAll = readArr(LANE_JOBS).filter((j) => j && j.id && !tlSet.has(String(j.id).toLowerCase()));
  const laneById = new Map(laneAll.map((j) => [String(j.id).toLowerCase(), j]));
  for (const id of tlIds) {
    const prev = laneById.get(id) || { id, sectionIdx: 0, contentRounds: 0 };
    laneById.set(
      id,
      Object.assign(prev, {
        id,
        phase: 'image_cover',
        sectionIdx: 0,
        imagesVerified: false,
        ownerNotes: 'CRO Pulse Tools — media machine inventory',
        updatedAt: now,
      })
    );
  }

  writeArr(AP, ap);
  writeArr(CC, cc);
  writeArr(NR, nr);
  writeArr(QUEUE, queue);
  writeArr(PARK, park);
  writeArr(PENDING, pending);
  writeArr(REJECT_FIX, rejectFix);
  writeArr(LANE_JOBS, [...laneById.values()]);

  // Keep scrub auto OFF — owner starts media machine manually.
  try {
    fs.writeFileSync(path.join(WD, '_scrub_auto_off.flag'), 'tl media machine requeue ' + now + '\n');
  } catch (_e) {}

  const stats = {
    tlCount: tlIds.length,
    demotedGreen,
    queueTotal: queue.length,
    rejectFix: rejectFix.length,
    greenNow: ap.length,
    nrNow: nr.length,
    bak: BAK,
    at: now,
  };
  fs.writeFileSync(REPORT, JSON.stringify(stats, null, 2));
  log('DONE ' + JSON.stringify(stats));
  await emailDone(stats);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
