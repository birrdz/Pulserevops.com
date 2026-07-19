param(
  [switch]$Reset,
  [switch]$NoBrowser
)

$ErrorActionPreference = 'SilentlyContinue'
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Node = (Get-Command node.exe -ErrorAction SilentlyContinue).Source
if (-not $Node) { $Node = (Get-Command node -ErrorAction SilentlyContinue).Source }
if (-not $Node) { throw 'Node.js was not found on PATH.' }

$Daemon = Join-Path $Root '_local_sites_daemon.js'
$State = Join-Path $Root '_local-sites-state'
New-Item -ItemType Directory -Force -Path $State | Out-Null

$alive = $false
try {
  $r = Invoke-WebRequest -UseBasicParsing -TimeoutSec 3 -Uri 'http://127.0.0.1:7959/api/status'
  $alive = $r.StatusCode -eq 200
} catch {}

if ($Reset -and $alive) {
  try {
    Invoke-RestMethod -Method Post -ContentType 'application/json' -Body '{"key":"4444"}' -Uri 'http://127.0.0.1:7959/api/reset' | Out-Null
  } catch {}
}

if (-not $alive) {
  $args = @($Daemon)
  if ($Reset) { $args += '--reset' }
  Start-Process -FilePath $Node -ArgumentList $args -WorkingDirectory $Root -WindowStyle Hidden `
    -RedirectStandardOutput (Join-Path $State 'daemon.out.log') `
    -RedirectStandardError (Join-Path $State 'daemon.err.log')

  for ($i = 0; $i -lt 20; $i++) {
    Start-Sleep -Milliseconds 500
    try {
      $r = Invoke-WebRequest -UseBasicParsing -TimeoutSec 2 -Uri 'http://127.0.0.1:7959/api/status'
      if ($r.StatusCode -eq 200) { $alive = $true; break }
    } catch {}
  }
}

if (-not $alive) {
  Write-Error "Local Sites daemon did not start. Check $State\daemon.err.log"
  exit 1
}

if (-not $NoBrowser) {
  Start-Process 'http://localhost:7959/'
  Start-Sleep -Milliseconds 300
  Start-Process 'http://localhost:7950/'
}

Write-Host 'Local Sites daemon is up: http://localhost:7959/'
Write-Host 'PULSE Machines manager:     http://localhost:7950/'
