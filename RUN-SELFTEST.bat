@echo off
title Groundskeeper SELF-TEST
cd /d C:\Users\koryj\website
echo Running the groundskeeper self-test (nothing real is touched)...
echo.
node groundskeeper.js --selftest
echo.
pause
