#!/bin/bash
# Waits for the telco combo writer to finish, then DDG-images the new Top-10s.
cd /c/Users/koryj/website
for i in $(seq 1 120); do
  if grep -q "\[tc\] DONE" _tc_combo_run.log 2>/dev/null; then break; fi
  sleep 30
done
echo "$(date -u +%FT%TZ) combo writer finished -> starting DDG image backfill" >> _tc_combo_run.log
IMG_ASC=1 node _img_backfill_any.js tc /telco >> _tc_ddg_backfill.log 2>&1
echo "$(date -u +%FT%TZ) DDG backfill after combo COMPLETE" >> _tc_combo_run.log
