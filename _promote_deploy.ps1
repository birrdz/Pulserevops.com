# Promote a draft deploy to production via Netlify restore API (owner 4444)
param([Parameter(Mandatory=$true)][string]$DeployId)
Set-Location 'C:\Users\koryj\website'
$envLocal = Get-Content '.env.local' -Raw
$TOKEN = ([regex]::Match($envLocal, 'NETLIFY_AUTH_TOKEN=(\S+)')).Groups[1].Value.Trim('"', "'")
$SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482'
$uri = "https://api.netlify.com/api/v1/sites/$SITE/deploys/$DeployId/restore"
Write-Host "Promoting deploy $DeployId ..."
$r = Invoke-RestMethod -Method Post -Uri $uri -Headers @{ Authorization = "Bearer $TOKEN" }
$r | ConvertTo-Json -Depth 3
Write-Host "Done. Verify: https://pulserevops.com/"
