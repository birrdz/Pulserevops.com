#!/usr/bin/env bash
# OWNER LAW — exact order, do not freestyle:
# 1) PURGE mangled / broken / blank (“white page”) image slots FIRST for the wave (2750)
# 2) Fact-check audit with Cerebras ONLY (never DeepSeek — it wrote the bad content)
# 3) Content rewrite with Cursor ONLY (never DeepSeek)
# 4) Pexels image redo when content was rewritten
# 5) ONE email per page only when fact-check + Cursor rewrite + Pexels all landed
#    Subject/body must name fact-check sections (e.g. Section 2, Section 3)
# 6) Next 2750 starts again at purge-first; STOP_AT=8000
# 7) Ultra: CURSOR_ULTRA=1 — no artificial brakes (still respect real provider 429s)
set -euo pipefail
cd /workspace
set -a
# shellcheck disable=SC1091
source /tmp/pulse-runtime.env
set +a

export CURSOR_ULTRA=1
export ULTRA_PLAN=1
export PEXELS_ALLOW_FAST=1
export PEXELS_PACE_MS="${PEXELS_PACE_MS:-1000}"
export STOP_AT="${STOP_AT:-8000}"
export BATCH_SIZE="${BATCH_SIZE:-2750}"
LOCK=/tmp/wave1-2750-lock.json
LOG=/tmp/owner-wave-pipeline.log

if [[ ! -f "$LOCK" ]]; then
  echo "missing $LOCK — cannot run wave1" >&2
  exit 1
fi

echo "[owner] STEP 1/3 — PURGE mangled/broken/blank images FIRST on locked ${BATCH_SIZE}…"
PURGE_REPROCESS=1 PURGE_IDS_JSON="$LOCK" PURGE_MAX_NEW="$BATCH_SIZE" \
  node scripts/purge-mangled-images-local.js 2>&1 | tee "$LOG"

echo "[owner] STEP 2/3 — Cerebras fact-check audit → Cursor write queue (no DeepSeek)…"
RESET_AUDIT=1 CYCLE_IDS_JSON="$LOCK" CURSOR_ULTRA=1 \
  node scripts/factcheck-audit-queue-local.js 2>&1 | tee -a "$LOG"

echo "[owner] STEP 3/3 — Cursor must drain queue with scripts/cursor-apply-fix.js (rewrite + Pexels + email)"
echo "[owner] audit queue ready — pending items in _cursor_write_queue.json / logs/cursor-write-queue.json"
