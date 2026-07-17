@echo off
title Kory's Groundskeeper
cd /d C:\Users\koryj\website
echo Starting the groundskeeper... the dashboard will open in your browser.
start http://localhost:8917
:loop
node groundskeeper.js
if %errorlevel%==42 (
  echo.
  echo Restart requested from the dashboard — relaunching...
  timeout /t 2 /nobreak >nul
  goto loop
)
echo.
echo Groundskeeper stopped.
pause
