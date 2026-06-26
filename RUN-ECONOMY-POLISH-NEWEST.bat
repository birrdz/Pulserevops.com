@echo off
cd /d "%~dp0"
:loop
node _economy_stop_cadence.js
node _economy_polish_newest.js --batch=1
timeout /t 45 /nobreak >nul
goto loop
