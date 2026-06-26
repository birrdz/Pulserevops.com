@echo off
cd /d "%~dp0"
echo Posting economy RevOps 100 to pulserevops.com ...
node _economy_run_all.js
echo.
echo Done. Check _economy_run_all_log.txt
pause
