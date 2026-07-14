@echo off
REM Start scrub portal on 8902 (keeps 8899 free for SEO dashboard / avoids mixups)
REM Then open Format Fixer: http://127.0.0.1:8902/format-fixer
REM Tap unicorn → enter 4444 → pick pillar → Fix
cd /d C:\Users\koryj\website
set SCRUB_BTN_PORT=8902
echo.
echo  Format Fixer portal starting on http://127.0.0.1:8902/format-fixer
echo  1) Tap the unicorn
echo  2) Enter 4444
echo  3) Pick a pillar and hit Fix
echo.
node _scrub_button_server.js
