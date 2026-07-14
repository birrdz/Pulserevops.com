@echo off
REM Stop Format Fixer and hand all content-passers to Square Builder (auto-approve).
cd /d C:\Users\koryj\website
REM Prefer 8911 (real-run port); fall back to 8902 if you still use that portal.
if "%SCRUB_BTN_BASE%"=="" set SCRUB_BTN_BASE=http://127.0.0.1:8911
echo.
echo  Stopping Format Fixer → Square Builder (passers only · last-hour 5/5)...
echo  Main DB stays put. Green square = face title baked → answer screen.
echo  Styles (sy) answer page = 3 men + 3 women + cover.
echo  Server must already be running on %SCRUB_BTN_BASE%.
echo.
node _handoff_fixer_to_square.js --base=%SCRUB_BTN_BASE% --key=4444
echo.
echo  UI: %SCRUB_BTN_BASE%/face-card-top-image-generator
pause
