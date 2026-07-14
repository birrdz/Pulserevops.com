@echo off
REM Square Builder — unused localhost channel 9377 (never used before this run)
REM No unicorn. No password. Runs on YOUR PC.
cd /d C:\Users\koryj\website
set SCRUB_BTN_PORT=9377
echo.
echo  Opening Square Builder: http://127.0.0.1:9377/face-card-top-image-generator
echo.
start "Pulse Square Builder 9377" cmd /c "set SCRUB_BTN_PORT=9377&& node _scrub_button_server.js"
timeout /t 4 /nobreak >nul
start "" "http://127.0.0.1:9377/face-card-top-image-generator"
