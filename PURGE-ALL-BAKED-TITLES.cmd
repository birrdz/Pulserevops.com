@echo off
setlocal
cd /d "%~dp0"
echo.
echo  Identifying every face_title_baked entry...
echo  Purging old files, pHashes, registry rows, EXIF reuse, and resume locks.
echo  Clean photo-only regeneration runs in pods of 100.
echo.
node "_purge_stale_baked_titles.js" --all-baked
if errorlevel 1 (
  echo.
  echo Purge stopped with an error. Review _stale_baked_title_purge_report.json.
  pause
  exit /b 1
)
echo.
echo Complete. Report: _stale_baked_title_purge_report.json
pause
endlocal
