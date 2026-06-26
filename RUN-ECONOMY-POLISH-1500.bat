@echo off
cd /d "%~dp0"
echo Polishing newest 1500 Q^&As via Netlify Gemini (background)...
node _economy_polish_run_down.js --count=1500
pause
