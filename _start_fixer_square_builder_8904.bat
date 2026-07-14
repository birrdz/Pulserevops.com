@echo off
REM Format Fixer + attached Square Builder — one localhost dashboard.
setlocal
cd /d "%~dp0"
set "URL=http://127.0.0.1:8904/"
echo.
echo  Starting Format Fixer + Square Builder: %URL%
echo  Fixer pods: 100, automatic until Stop.
echo.
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$pids=Get-NetTCPConnection -LocalPort 8904 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique;" ^
  "foreach($pid in $pids){try{Stop-Process -Id $pid -Force -ErrorAction Stop;Write-Host ('Stopped stale port 8904 process '+$pid)}catch{}};" ^
  "Start-Sleep -Milliseconds 750"
start "PULSE Fixer + Square Builder 8904" /D "%~dp0" cmd /k "set SCRUB_BTN_PORT=8904&& set FORMAT_FIXER_AUTORUN=1&& node _scrub_button_server.js"
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$url='%URL%';" ^
  "for($i=0;$i -lt 90;$i++){" ^
  "  try{$r=Invoke-RestMethod -TimeoutSec 2 ($url+'health');if($r.ok -and $r.app -eq 'pulse-fixer-square-builder' -and $r.build -eq 'pods-100-image-proxy-v1'){Start-Process $url;exit 0}}catch{};" ^
  "  Start-Sleep -Seconds 1" ^
  "};exit 1"
if errorlevel 1 (
  echo.
  echo New Fixer dashboard did not start or failed its build check.
  echo Read the error in the open server window.
  pause
)
endlocal
