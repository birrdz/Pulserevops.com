@echo off
REM Starts the tracked Fixer + Builder on the first unused localhost port from 8916-8999.
setlocal
cd /d "%~dp0"
set "DATA_ROOT=%USERPROFILE%\website"
if not exist "%DATA_ROOT%" set "DATA_ROOT=%~dp0"

for /f %%P in ('powershell -NoProfile -ExecutionPolicy Bypass -Command "$used=@(Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty LocalPort); $p=8916..8999 | Where-Object {$_ -notin $used} | Select-Object -First 1; if($p){$p}"') do set "PORT=%%P"
if not defined PORT (
  echo No unused localhost port found between 8916 and 8999.
  pause
  exit /b 1
)

set "URL=http://127.0.0.1:%PORT%/?code=4444"
echo.
echo  Starting NEW Fixer + Builder at %URL%
echo  Fixer: TL / CRO Pulse Tools, automatic pods of 100.
echo  Builder: manual or learned auto-run, continuous pods of 100.
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$pids=Get-NetTCPConnection -LocalPort 8904 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique;" ^
  "foreach($pid in $pids){try{Stop-Process -Id $pid -Force -ErrorAction Stop}catch{}}"
start "PULSE ORIGINAL SIM MACHINE 8904" /D "%~dp0" cmd /k "set SIM_PORT=8904&& set SIM_AUTO_RUN=1&& node _sim_machine_server_cursor.js"

start "PULSE NEW Fixer + Builder %PORT%" /D "%~dp0" cmd /k "set PULSE_ROOT=%DATA_ROOT%&& set SCRUB_BTN_PORT=%PORT%&& set FIXER_BUILDER_HOME=1&& set SIM_AUTO_RUN=1&& set FORMAT_FIXER_AUTORUN=0&& set FORMAT_FIXER_BOOT_PILLAR=tl&& node _scrub_button_server.js"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$url='%URL%';" ^
  "for($i=0;$i -lt 90;$i++){" ^
  "  try{$health='http://127.0.0.1:%PORT%/health';$r=Invoke-RestMethod -TimeoutSec 2 $health;if($r.ok -and $r.app -eq 'pulse-fixer-square-builder'){Start-Process $url;exit 0}}catch{};" ^
  "  Start-Sleep -Seconds 1" ^
  "};exit 1"
if errorlevel 1 (
  echo.
  echo New Fixer + Builder did not start. Read the error in its server window.
  pause
)
endlocal
