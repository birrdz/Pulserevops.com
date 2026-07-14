@echo off
cd /d C:\Users\koryj\website
set SCRUB_BTN_PORT=3229
start "Square Builder" cmd /c "set SCRUB_BTN_PORT=3229&& node _scrub_button_server.js"
timeout /t 4 /nobreak >nul
start "" "http://localhost:3229/face-card-top-image-generator"
