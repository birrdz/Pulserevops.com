# SAFE draft deploy (PowerShell). Parks secrets + _site_deploy, deploys draft, restores on exit.
$ErrorActionPreference = 'Continue'
Set-Location 'C:\Users\koryj\website'
$envLocal = Get-Content '.env.local' -Raw
$TOKEN = ([regex]::Match($envLocal, 'NETLIFY_AUTH_TOKEN=(\S+)')).Groups[1].Value.Trim('"', "'")
$SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482'
$PARK = 'C:\Users\koryj\_DEPLOY_PARK'
New-Item -ItemType Directory -Force -Path $PARK | Out-Null
function Restore-Parked {
  if (Test-Path "$PARK\_site_deploy") { Move-Item "$PARK\_site_deploy" '_site_deploy' -Force }
  if (Test-Path "$PARK\.env") { Move-Item "$PARK\.env" '.env' -Force }
  if (Test-Path "$PARK\.env.local") { Move-Item "$PARK\.env.local" '.env.local' -Force }
}
try {
  if (Test-Path '_site_deploy') { Move-Item '_site_deploy' "$PARK\_site_deploy" -Force }
  if (Test-Path '.env') { Move-Item '.env' "$PARK\.env" -Force }
  if (Test-Path '.env.local') { Move-Item '.env.local' "$PARK\.env.local" -Force }
  $MSG = 'Endless scroll site-wide + hire mosaic + pulse-mosaic/idle-scroll JS (owner 4444 2026-07-04)'
  $OUT = 'C:\Users\koryj\_deploy_out.json'
  $ERR = 'C:\Users\koryj\_deploy_out.err'
  $env:NETLIFY_AUTH_TOKEN = $TOKEN
  $ok = $false
  for ($i = 1; $i -le 8; $i++) {
    Write-Host "--- attempt $i ---"
    & npx --yes netlify-cli@latest deploy --dir=. --site=$SITE --json --no-build --message=$MSG 1> $OUT 2> $ERR
    if ($LASTEXITCODE -eq 0 -and (Test-Path $OUT) -and (Get-Content $OUT -Raw) -match 'deploy_id|deploy_url|"id"') { $ok = $true; break }
    Write-Host "attempt $i failed (exit $LASTEXITCODE)"
    Start-Sleep -Seconds 4
  }
  Write-Host "=== deploy ok=$ok ==="
  if (Test-Path $OUT) { Get-Content $OUT -Raw }
  if (Test-Path $ERR) { Get-Content $ERR -Tail 3 }
} finally {
  Restore-Parked
}
