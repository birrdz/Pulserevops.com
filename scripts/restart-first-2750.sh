#!/usr/bin/env bash
# Full restart of wave-1 (first 2750) for the ENTIRE process:
#   1) mangled/broken image purge on the locked 2750 (again)
#   2) fact-check → rewrite → Pexels on that same 2750 (again)
#   3) then continue normal loop (next 2750 purge-first…) until STOP_AT
set -euo pipefail
cd /workspace
set -a
# shellcheck disable=SC1091
source /tmp/pulse-runtime.env
set +a

LOCK=/tmp/wave1-2750-lock.json
LOG=/tmp/batch-cycle-restart.log
STOP_AT="${STOP_AT:-8000}"
BATCH_SIZE="${BATCH_SIZE:-2750}"

echo "[restart] locking first-wave ids + clearing fact-check state…"
node <<'NODE'
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const SITE = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
(async () => {
  const s = getStore({ name: 'pulse-machine-library', siteID: SITE, token: process.env.BLOBS_PAT });
  const img = (await s.get('_mangled_image_purge_state.json', { type: 'json' })) || {};
  const ids = Array.isArray(img.doneIds) ? img.doneIds.slice() : [];
  if (ids.length < 1000) throw new Error('expected ~2750 locked ids, got ' + ids.length);
  const wave = {
    lockedAt: new Date().toISOString(),
    count: ids.length,
    ids,
    note: 'full restart: purge mangled images first, then fact-check same set',
  };
  fs.writeFileSync('/tmp/wave1-2750-lock.json', JSON.stringify(wave));
  await s.setJSON('_wave1_2750_lock.json', wave);
  await s.setJSON('_batch_cycle_state.json', {
    doneIds: [],
    fixed: 0,
    passed: 0,
    imaged: 0,
    errors: 0,
    restartedAt: new Date().toISOString(),
    restartReason: 'owner full restart of first 2750 — all processes',
    stopAt: parseInt(process.env.STOP_AT || '8000', 10),
    batchSize: 2750,
    complete: false,
  });
  console.log(JSON.stringify({ locked: ids.length, first: ids[0], last: ids[ids.length - 1] }));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
NODE

echo "[restart] STEP 1/3 — mangled image PURGE first on locked wave…"
PURGE_REPROCESS=1 PURGE_IDS_JSON="$LOCK" PURGE_MAX_NEW="$BATCH_SIZE" \
  node scripts/purge-mangled-images-local.js 2>&1 | tee "$LOG"

echo "[restart] STEP 2/3 — fact-check / rewrite / Pexels on SAME locked 2750…"
CYCLE_MODE=fix BATCH_SIZE="$BATCH_SIZE" STOP_AT="$STOP_AT" \
CYCLE_IDS_JSON="$LOCK" \
DEEPSEEK_MODEL="${DEEPSEEK_MODEL:-deepseek-v4-flash}" \
  node scripts/batch-cycle-local.js 2>&1 | tee -a "$LOG"

echo "[restart] STEP 3/3 — continue normal cadence until STOP_AT=$STOP_AT (purge-first each new wave)…"
CYCLE_MODE=loop BATCH_SIZE="$BATCH_SIZE" STOP_AT="$STOP_AT" \
DEEPSEEK_MODEL="${DEEPSEEK_MODEL:-deepseek-v4-flash}" \
  node scripts/batch-cycle-local.js 2>&1 | tee -a "$LOG"
