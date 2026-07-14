@echo off
REM Real-run Square Builder on a fresh port (8911) — not 8902/8899.
cd /d C:\Users\koryj\website
set SCRUB_BTN_PORT=8911
set SCRUB_BTN_BASE=http://127.0.0.1:8911
echo.
echo  Starting scrub on 8911 (Square Builder real run)...
echo  UI: http://127.0.0.1:8911/face-card-top-image-generator
echo  Unlock with 4444. Format Fixer passers (last-hour 5/5) → Square.
echo  Green square = face-card title baked → auto opens answer screen.
echo  Styles (sy) answer page = 3 men + 3 women outfits + cover.
echo.
start "Pulse Square Builder 8911" cmd /c "set SCRUB_BTN_PORT=8911&& node _scrub_button_server.js"
timeout /t 3 /nobreak >nul
start "" "http://127.0.0.1:8911/face-card-top-image-generator"
