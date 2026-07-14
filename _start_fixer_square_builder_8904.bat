@echo off
REM Format Fixer + attached Square Builder — one localhost dashboard.
setlocal
cd /d "%~dp0"
set "URL=http://127.0.0.1:8904/"
echo.
echo  Starting Format Fixer + Square Builder: %URL%
echo  Fixer pods: 100, automatic until Stop.
echo.
start "PULSE Fixer + Square Builder 8904" /D "%~dp0" cmd /k "set SCRUB_BTN_PORT=8904&& set FORMAT_FIXER_AUTORUN=1&& node _scrub_button_server.js"
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$url='%URL%';" ^
  "for($i=0;$i -lt 90;$i++){" ^
  "  try{$r=Invoke-WebRequest -UseBasicParsing -TimeoutSec 2 ($url+'health');if($r.StatusCode -eq 200){Start-Process $url;exit 0}}catch{};" ^
  "  Start-Sleep -Seconds 1" ^
  "};exit 1"
if errorlevel 1 (
  echo.
  echo Fixer dashboard did not start. Read the error in the open server window.
  pause
)
endlocal
