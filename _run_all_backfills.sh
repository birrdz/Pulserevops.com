#!/usr/bin/env bash
cd /c/Users/koryj/website
# prefix:path  — applicable Top-10 pillars still needing images (smallest first)
PAIRS="er:/electronic-reviews cl:/clubs es:/estates ev:/events ga:/gatherings gm:/gaming lv:/living tv:/travel dn:/dining nl:/nightlife tn:/towns tl:/tools"
for pair in $PAIRS; do
  pre="${pair%%:*}"; path="${pair##*:}"
  echo "===== $(date) START $pre ($path) ====="
  node _img_backfill_any.js "$pre" "$path"
  echo "===== DONE $pre ====="
done
echo "ALL PILLAR BACKFILLS COMPLETE"
