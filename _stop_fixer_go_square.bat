@echo off
REM Stop Format Fixer and hand all content-passers to Square Builder (auto-approve).
cd /d C:\Users\koryj\website
set SCRUB_BTN_BASE=http://127.0.0.1:8902
echo.
echo  Stopping Format Fixer → Square Builder (passers only)...
echo  Server must already be running on 8902.
echo.
node _handoff_fixer_to_square.js --base=http://127.0.0.1:8902 --key=4444
echo.
echo  UI: http://127.0.0.1:8902/face-card-top-image-generator
pause
