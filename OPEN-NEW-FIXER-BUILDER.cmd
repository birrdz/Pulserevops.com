@echo off
setlocal
set "BRANCH=cursor/fixer-auto-next-group-3458"
set "REPO=https://github.com/birrdz/Pulserevops.com.git"
set "TARGET=%USERPROFILE%\pulse-new-fixer-builder"
set "OLDENV=C:\Users\koryj\website\.env.local"

echo.
echo  PULSE NEW FIXER + BUILDER
echo  Preparing a separate localhost panel...
echo.

if exist "%TARGET%\.git" (
  echo Updating existing panel files...
  git -C "%TARGET%" fetch origin "%BRANCH%"
  if errorlevel 1 goto :fail
  git -C "%TARGET%" switch "%BRANCH%"
  if errorlevel 1 git -C "%TARGET%" switch -c "%BRANCH%" --track "origin/%BRANCH%"
  if errorlevel 1 goto :fail
  git -C "%TARGET%" pull --ff-only origin "%BRANCH%"
  if errorlevel 1 goto :fail
) else (
  echo Downloading panel files...
  git clone --single-branch --branch "%BRANCH%" "%REPO%" "%TARGET%"
  if errorlevel 1 goto :fail
)

if exist "%OLDENV%" (
  copy /Y "%OLDENV%" "%TARGET%\.env.local" >nul
) else (
  echo WARNING: %OLDENV% was not found. Image/blob credentials may be unavailable.
)

echo Installing required image tools...
call npm --prefix "%TARGET%" install
if errorlevel 1 goto :fail

call "%TARGET%\_start_new_fixer_builder.bat"
exit /b %errorlevel%

:fail
echo.
echo The new panel could not be prepared. Leave this window open and send its error message.
pause
exit /b 1
