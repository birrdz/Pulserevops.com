@echo off
REM ===================================================================
REM  Kory's Pulse Control Panel — desktop launcher
REM  Starts the merged dashboard server on http://localhost:8904 if it
REM  isn't already running, then opens it in the default browser.
REM  (The fix machine + generator daemon run regardless via Task
REM   Scheduler; this is just the convenient opener.)
REM ===================================================================
cd /d C:\Users\koryj\website

REM Is 8904 already serving? (silent TCP probe)
powershell -NoProfile -Command "try { $c = New-Object Net.Sockets.TcpClient('127.0.0.1',8904); $c.Close(); exit 0 } catch { exit 1 }"
if %errorlevel%==0 goto open

echo Starting Pulse control panel on http://localhost:8904 ...
start "pulse-dashboard" /min node dashboard_server.js
REM give it a moment to bind the port
powershell -NoProfile -Command "Start-Sleep -Seconds 3"

:open
start "" http://localhost:8904
exit /b 0
