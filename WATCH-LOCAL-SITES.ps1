param([int]$IntervalSeconds = 120)

$ErrorActionPreference = 'SilentlyContinue'
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Starter = Join-Path $Root 'START-LOCAL-SITES.ps1'
$IntervalSeconds = [Math]::Max(30, $IntervalSeconds)

while ($true) {
  try {
    & $Starter -NoBrowser
  } catch {}
  Start-Sleep -Seconds $IntervalSeconds
}
