@echo off
REM Register daily 1k Pexels → _live_bank at 3:00 AM local.
schtasks /Create /TN "PulsePexelsBank1k" /TR "\"C:\Program Files\nodejs\node.exe\" \"C:\Users\koryj\website\_pexels_live_bank_daily.js\"" /SC DAILY /ST 03:00 /F
schtasks /Query /TN "PulsePexelsBank1k" /V /FO LIST
