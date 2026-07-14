@echo off
REM Square Builder — dedicated localhost site, separate from Format Fixer.
REM No unicorn. No password. Runs on YOUR PC.
cd /d C:\Users\koryj\website
set SCRUB_BTN_PORT=9377
set SQUARE_ONLY=1
set FORMAT_FIXER_AUTORUN=0
echo.
echo  Opening Square Builder own site: http://127.0.0.1:9377/
echo.
start "Pulse Square Builder 9377" cmd /c "set SCRUB_BTN_PORT=9377&& set SQUARE_ONLY=1&& set FORMAT_FIXER_AUTORUN=0&& node _scrub_button_server.js"
timeout /t 4 /nobreak >nul
start "" "http://127.0.0.1:9377/"
