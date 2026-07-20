param([switch]$NoBrowser)

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Port = 7970

$existing = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty OwningProcess -First 1
if (-not $existing) {
  $stateDir = Join-Path $Root '_local-sites-state'
  New-Item -ItemType Directory -Force -Path $stateDir | Out-Null
  Start-Process node -ArgumentList '_deepseek_content_booster_server.js' -WorkingDirectory $Root -WindowStyle Hidden `
    -RedirectStandardOutput (Join-Path $stateDir 'deepseek-booster.out.log') `
    -RedirectStandardError (Join-Path $stateDir 'deepseek-booster.err.log')
  for ($i = 0; $i -lt 20; $i++) {
    Start-Sleep -Milliseconds 500
    try {
      $response = Invoke-WebRequest -UseBasicParsing -TimeoutSec 2 -Uri "http://127.0.0.1:$Port/"
      if ($response.StatusCode -eq 200) { break }
    } catch {}
  }
}

try {
  $status = Invoke-RestMethod -TimeoutSec 3 -Uri "http://127.0.0.1:$Port/api/status"
  if (-not $status.ok) { throw 'Port 7970 is not the DeepSeek Content Booster.' }
} catch {
  throw "DeepSeek Content Booster failed to start on port 7970. Check _local-sites-state\deepseek-booster.err.log. $($_.Exception.Message)"
}

if (-not $NoBrowser) {
  Start-Process "http://localhost:$Port/"
}
