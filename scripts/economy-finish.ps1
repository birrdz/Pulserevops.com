# After all economy Q&As are posted: optional Netlify deploy + IndexNow ping.
# Blob content is already live without deploy; deploy only ships HTML/JS changes.
#   powershell -ExecutionPolicy Bypass -File C:\Users\koryj\website\scripts\economy-finish.ps1
$ErrorActionPreference = 'Stop'
Set-Location 'C:\Users\koryj\website'

Write-Host 'Triggering IndexNow batch (Bing / Yandex / Seznam)...'
try {
  $r = Invoke-RestMethod -Uri 'https://pulserevops.com/.netlify/functions/pulse-machine-indexnow-batch-background' -Method Get -TimeoutSec 120
  $r | ConvertTo-Json -Depth 5
} catch {
  Write-Warning "IndexNow invoke failed: $_"
}

Write-Host 'Running nightly deploy (only if site files changed)...'
& (Join-Path $PSScriptRoot 'nightly-deploy.ps1')
