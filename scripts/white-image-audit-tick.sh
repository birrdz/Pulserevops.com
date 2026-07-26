#!/usr/bin/env bash
# Fire pulse-white-image-audit-background every 15 minutes (batch 500).
# Safe to run locally as a backup while Netlify cron is live.
set -u
SITE="${WHITE_AUDIT_SITE:-https://pulserevops.com}"
KEY="${WHITE_AUDIT_KEY:-pulsemachine-writer-2026}"
BATCH="${WHITE_AUDIT_BATCH:-500}"
INTERVAL="${WHITE_AUDIT_INTERVAL_SEC:-900}"
LOG="${WHITE_AUDIT_LOG:-/tmp/white-image-audit-tick.log}"
URL="$SITE/.netlify/functions/pulse-white-image-audit-background"

echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] white-image-audit tick started → $URL batch=$BATCH interval=${INTERVAL}s" | tee -a "$LOG"

while true; do
  ts="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  resp="$(curl -sS -m 120 -X POST "$URL" \
    -H 'Content-Type: application/json' \
    -d "{\"key\":\"$KEY\",\"batch\":$BATCH}" 2>&1)" || resp="curl-failed:$?"
  echo "[$ts] $resp" | tee -a "$LOG"
  sleep "$INTERVAL"
done
