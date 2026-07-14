@echo off
REM Square Builder — open on YOUR PC (cloud localhost won't open in your browser).
REM Fresh unused channel: 9127 · no unicorn · no password screen.
cd /d C:\Users\koryj\website
set SCRUB_BTN_PORT=9127
echo.
echo  Square Builder on THIS computer: http://127.0.0.1:9127/face-card-top-image-generator
echo  (Cloud agent localhost cannot open on your laptop — must run here.)
echo.
start "Pulse Square Builder 9127" cmd /c "set SCRUB_BTN_PORT=9127&& node _scrub_button_server.js"
timeout /t 4 /nobreak >nul
start "" "http://127.0.0.1:9127/face-card-top-image-generator"
