@echo off
REM Square Builder — dedicated localhost site, separate from Format Fixer.
cd /d C:\Users\koryj\website
set SQUARE_ONLY=1
set SQUARE_PORT=4444
set FORMAT_FIXER_AUTORUN=0
echo.
echo  Opening Square Builder: http://127.0.0.1:4444/
echo.
start "Pulse Square Builder 4444" cmd /c "set SQUARE_PORT=4444&& set FORMAT_FIXER_AUTORUN=0&& node _scrub_button_server.js --square-only"
timeout /t 4 /nobreak >nul
start "" "http://127.0.0.1:4444/"
