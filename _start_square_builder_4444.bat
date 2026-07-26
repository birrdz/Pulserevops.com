@echo off
REM Square Builder — dedicated localhost site, separate from Format Fixer.
setlocal
cd /d "%~dp0"
set "URL=http://127.0.0.1:4444/"
echo.
echo  Starting Square Builder: %URL%
echo.
start "Pulse Square Builder 4444" /D "%~dp0" cmd /k "set SQUARE_ONLY=1&& set SQUARE_PORT=4444&& set FORMAT_FIXER_AUTORUN=0&& node _scrub_button_server.js --square-only"
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$url='%URL%';" ^
  "for($i=0;$i -lt 90;$i++){" ^
  "  try{$r=Invoke-WebRequest -UseBasicParsing -TimeoutSec 2 $url;if($r.StatusCode -eq 200){Start-Process $url;exit 0}}catch{};" ^
  "  Start-Sleep -Seconds 1" ^
  "};exit 1"
if errorlevel 1 (
  echo.
  echo Square Builder did not start. Read the error in the open server window.
  pause
)
endlocal
