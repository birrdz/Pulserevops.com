param([switch]$NoBrowser)

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$PortFile = Join-Path $Root '_deepseek_booster_port.txt'
$Port = 0

function Test-BoosterPort([int]$Candidate) {
  try {
    $status = Invoke-RestMethod -TimeoutSec 2 -Uri "http://127.0.0.1:$Candidate/api/status"
    return $status.ok -eq $true
  } catch {
    return $false
  }
}

if (Test-Path $PortFile) {
  try {
    $remembered = [int](Get-Content $PortFile -Raw)
    if (Test-BoosterPort $remembered) { $Port = $remembered }
  } catch {}
}

if (-not $Port) {
  foreach ($candidate in (@(7988..7999) + @(8998..9009))) {
    $listener = Get-NetTCPConnection -LocalPort $candidate -State Listen -ErrorAction SilentlyContinue
    if (-not $listener) { $Port = $candidate; break }
    if (Test-BoosterPort $candidate) { $Port = $candidate; break }
  }
}
if (-not $Port) { throw 'No free localhost port was found for the DeepSeek Content Booster.' }

if (-not (Test-BoosterPort $Port)) {
  $stateDir = Join-Path $Root '_local-sites-state'
  New-Item -ItemType Directory -Force -Path $stateDir | Out-Null
  $env:DEEPSEEK_BOOSTER_PORT = [string]$Port
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
  if (-not $status.ok) { throw "Port $Port is not the DeepSeek Content Booster." }
} catch {
  throw "DeepSeek Content Booster failed to start on port $Port. Check _local-sites-state\deepseek-booster.err.log. $($_.Exception.Message)"
}

Set-Content -Path $PortFile -Value $Port -Encoding Ascii
Write-Host "DeepSeek Content Booster: http://localhost:$Port/"
if (-not $NoBrowser) {
  Start-Process "http://localhost:$Port/"
}
