@echo off
REM Real-run Square Builder on fresh site channel 8933
cd /d C:\Users\koryj\website
set SCRUB_BTN_PORT=8933
set SCRUB_BTN_BASE=http://127.0.0.1:8933
echo.
echo  Starting scrub on 8933 (Square Builder)...
echo  UI: http://127.0.0.1:8933/face-card-top-image-generator
echo  Unlock with 4444.
echo.
start "Pulse Square Builder 8933" cmd /c "set SCRUB_BTN_PORT=8933&& node _scrub_button_server.js"
timeout /t 3 /nobreak >nul
start "" "http://127.0.0.1:8933/face-card-top-image-generator"
