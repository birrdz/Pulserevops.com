@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0START-LOCAL-SITES.ps1" -Reset
if errorlevel 1 (
  echo(
  echo Reset failed. See _local-sites-state\daemon.err.log
  pause
  exit /b 1
)
exit /b 0
