# _pulse_spider_autostart.ps1 — keeps the PULSE Spider SEO monitor always running.
# Launched automatically at login (via a .vbs in the Startup folder). Idempotent:
# only starts what isn't already running, so it can be run repeatedly with no dupes.
$ErrorActionPreference = 'SilentlyContinue'
$dir = 'C:\Users\koryj\website'
$node = 'C:\Program Files\nodejs\node.exe'
Set-Location $dir
function running($pat) { @(Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Where-Object { $_.CommandLine -like $pat }).Count }

# 1) the always-on crawler daemon (re-crawls every 30 min, publishes report to blob + local)
if ((running '*_pulse_spider_forever.js*') -lt 1) {
  Remove-Item "$dir\_pulse_spider_stop.flag" -ErrorAction SilentlyContinue
  $env:INTERVAL_MIN = '30'; $env:MAX_URLS = '400'; $env:CONCURRENCY = '6'
  Start-Process $node -ArgumentList '_pulse_spider_forever.js' -WorkingDirectory $dir -WindowStyle Hidden
}

# 2) the local dashboard server (http://localhost:8899/)
if ((running '*_seo_dashboard_server.js*') -lt 1) {
  Start-Process $node -ArgumentList '_seo_dashboard_server.js' -WorkingDirectory $dir -WindowStyle Hidden
}
