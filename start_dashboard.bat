@echo off
REM ===================================================================
REM  Kory's Pulse Control Panel — desktop launcher (no CMD window)
REM  Opens http://localhost:8904 — starts the panel hidden if needed.
REM ===================================================================
cd /d C:\Users\koryj\website

REM Already up?
powershell -NoProfile -WindowStyle Hidden -Command "try { $c = New-Object Net.Sockets.TcpClient('127.0.0.1',8904); $c.Close(); exit 0 } catch { exit 1 }"
if %errorlevel%==0 goto open

REM Start node with NO console window (never use `start ... node` — that pops CMD)
powershell -NoProfile -WindowStyle Hidden -Command "Start-Process -FilePath 'C:\Program Files\nodejs\node.exe' -ArgumentList 'C:\Users\koryj\website\dashboard_server.js' -WorkingDirectory 'C:\Users\koryj\website' -WindowStyle Hidden"

powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 2"

:open
start "" http://localhost:8904/full
exit /b 0
