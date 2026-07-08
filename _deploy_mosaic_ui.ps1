# Draft deploy from pulse-deploy-clean + promote (owner approved 2026-07-04)
$ErrorActionPreference = 'Continue'
$envLocal = Get-Content 'C:\Users\koryj\website\.env.local' -Raw
$TOKEN = ([regex]::Match($envLocal, 'NETLIFY_AUTH_TOKEN=(\S+)')).Groups[1].Value.Trim('"', "'")
$SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482'
$MSG = 'Homepage mosaic hub Recent + Current Events tiles (2026-07-05)'
$OUT = 'C:\Users\koryj\_deploy_out.json'
$ERR = 'C:\Users\koryj\_deploy_out.err'
Set-Location 'C:\Users\koryj\pulse-deploy-clean'
$env:NETLIFY_AUTH_TOKEN = $TOKEN
$ok = $false
for ($i = 1; $i -le 8; $i++) {
  Write-Host "--- draft attempt $i ---"
  & npx --yes netlify-cli@latest deploy --dir=. --functions=netlify/functions --site=$SITE --json --no-build --message=$MSG 1> $OUT 2> $ERR
  if ($LASTEXITCODE -eq 0 -and (Test-Path $OUT) -and (Get-Content $OUT -Raw) -match 'deploy_id|deploy_url|"id"') { $ok = $true; break }
  Write-Host "attempt $i failed (exit $LASTEXITCODE)"
  Start-Sleep -Seconds 4
}
if (-not $ok) {
  Write-Host 'DRAFT DEPLOY FAILED'
  if (Test-Path $ERR) { Get-Content $ERR -Tail 10 }
  exit 1
}
$json = Get-Content $OUT -Raw | ConvertFrom-Json
$deployId = $json.deploy_id
if (-not $deployId) { $deployId = $json.id }
$draftUrl = $json.deploy_url
Write-Host "Draft OK: $draftUrl"
Write-Host "Deploy ID: $deployId"
$uri = "https://api.netlify.com/api/v1/sites/$SITE/deploys/$deployId/restore"
Write-Host 'Promoting to production...'
$r = Invoke-RestMethod -Method Post -Uri $uri -Headers @{ Authorization = "Bearer $TOKEN" }
Write-Host "Promoted. State: $($r.state)"
Write-Host 'Live: https://pulserevops.com/'
