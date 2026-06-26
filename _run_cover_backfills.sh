#!/usr/bin/env bash
cd /c/Users/koryj/website
echo "===== $(date) START bs (book covers) ====="; node _cover_img_any.js bs "book cover"
echo "===== $(date) START sp (speeches) ====="; node _cover_img_any.js sp ""
echo "===== $(date) START sk (skill drills) ====="; node _cover_img_any.js sk "drill"
echo "===== $(date) START sy (style outfits) ====="; node _cover_img_any.js sy "outfit"
echo "ALL COVER BACKFILLS COMPLETE"
