$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path

& (Join-Path $Root 'START-DEEPSEEK-CONTENT-BOOSTER.ps1') -NoBrowser

$key = $env:DEEPSEEK_BOOSTER_KEY
if (-not $key) {
  try {
    $line = Get-Content (Join-Path $Root '.env.local') |
      Where-Object { $_ -match '^\s*DEEPSEEK_BOOSTER_KEY\s*=' } |
      Select-Object -First 1
    if ($line) { $key = ($line -replace '^\s*DEEPSEEK_BOOSTER_KEY\s*=\s*', '').Trim().Trim('"').Trim("'") }
  } catch {}
}
if (-not $key) { $key = '4444' }

$uri = 'http://127.0.0.1:7970/api/start'
$payload = @{
  key = $key
  pillar = 'ALL'
  pods = 1
  perPod = 0
  autoWaves = $true
} | ConvertTo-Json -Compress

try {
  $result = Invoke-RestMethod -Method Post -ContentType 'application/json' -Body $payload -Uri $uri
  if (-not $result.ok) { throw 'Sitewide booster rejected the launch.' }
  Write-Host 'DeepSeek sitewide quality ladder started: lowest-score URLs first.'
} catch {
  if ($_.Exception.Message -match 'already active') {
    Write-Host 'The DeepSeek sitewide quality ladder is already running.'
  } else {
    throw
  }
}

Start-Process 'http://localhost:7970/'
