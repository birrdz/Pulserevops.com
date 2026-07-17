@echo off
REM setup_baton.bat - RUN THIS YOURSELF (Kory). Generates the HMAC secret Claude never sees.
REM Double-click it, or run it from a terminal. Claude is blocked from reading the file it creates.
cd /d "%~dp0.."
if not exist ".guard" mkdir ".guard"
if exist ".guard\secret.key" (
  echo(
  echo A secret already exists at .guard\secret.key
  echo Delete it yourself first if you really want to regenerate ^(this invalidates all future receipts^).
  echo(
  pause
  goto :eof
)
powershell -NoProfile -Command "$b=New-Object byte[] 48; [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b); [IO.File]::WriteAllText('.guard\secret.key',[Convert]::ToBase64String($b))"
if exist ".guard\secret.key" (
  echo(
  echo Baton secret generated at .guard\secret.key
  echo Claude has NEVER seen this value and is blocked from opening it.
  echo You can now start the picker:  node baton_picker.js   ^(http://localhost:7802^)
  echo(
) else (
  echo Failed to generate the secret. Check PowerShell is available.
)
pause
