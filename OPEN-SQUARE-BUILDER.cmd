@echo off
setlocal
set "URL=http://localhost:8899/square-builder"
cd /d "%~dp0"

start "PULSE Square Builder Server" /D "%~dp0" cmd /k node "_scrub_button_server.js"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$url='%URL%';" ^
  "for($i=0;$i -lt 60;$i++){" ^
  "  try{$r=Invoke-WebRequest -UseBasicParsing -TimeoutSec 2 $url;if($r.StatusCode -eq 200){Start-Process $url;exit 0}}catch{};" ^
  "  Start-Sleep -Seconds 1" ^
  "};exit 1"

if errorlevel 1 (
  echo Square Builder did not start. Keep the server window open and check its error message.
  pause
)
endlocal
