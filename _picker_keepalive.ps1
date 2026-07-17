# Keeps the Baton Picker (:7802) permanently alive. Runs from a scheduled task every few minutes
# + at logon. If 7802 is not responding, it (re)starts baton_picker.js detached. Self-healing.
$ErrorActionPreference = 'SilentlyContinue'
$log = 'C:\Users\koryj\website\_baton_picker_keepalive.log'
$code = 0
try { $code = (Invoke-WebRequest -Uri 'http://localhost:7802/' -TimeoutSec 5 -UseBasicParsing).StatusCode } catch { $code = 0 }
if ($code -ne 200) {
  $out = 'C:\Users\koryj\AppData\Local\Temp\claude\C--Users-koryj\4e7559a2-4e21-49e6-9c61-0608a0986c88\scratchpad\picker.log'
  Start-Process -FilePath 'node' -ArgumentList 'baton_picker.js' -WorkingDirectory 'C:\Users\koryj\website' -WindowStyle Hidden -RedirectStandardOutput $out -RedirectStandardError "$out.err"
  Add-Content $log ("{0}  restarted (was {1})" -f (Get-Date -Format o), $code)
}
