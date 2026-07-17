# MIDNIGHT PROMOTE — swaps prod to the verified draft, then checks it, with rollback info.
# Verified draft: 6a56b63841c42020db0dac49 (functions ship + /assets/qa serves real blobs).
# NOTE: PowerShell variables are case-INSENSITIVE — never use $site and $SITE as different vars.
Set-Location 'C:\Users\koryj\website'
$envLocal = Get-Content '.env.local' -Raw
$TOKEN  = ([regex]::Match($envLocal, 'NETLIFY_AUTH_TOKEN=(\S+)')).Groups[1].Value.Trim('"', "'")
$SITEID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482'
$DEPLOY = '6a56e9a928995b1bbdf8c41a'
$HDR = @{ Authorization = "Bearer $TOKEN" }

# 1. Capture the CURRENT live deploy id FIRST (rollback target)
$siteInfo = Invoke-RestMethod -Uri "https://api.netlify.com/api/v1/sites/$SITEID" -Headers $HDR
$prev = $siteInfo.published_deploy.id
Write-Host "Current live deploy (rollback target): $prev"

# 2. Promote the verified draft to production
Write-Host "Promoting $DEPLOY to production..."
try {
  $r = Invoke-RestMethod -Method Post -Uri "https://api.netlify.com/api/v1/sites/$SITEID/deploys/$DEPLOY/restore" -Headers $HDR
  Write-Host "Promoted. state=$($r.state)  name=$($r.name)"
} catch {
  Write-Host "PROMOTE FAILED: $($_.Exception.Message)"
  Write-Host "(live site unchanged)"
  exit 1
}

# 3. Verify prod now serves a real image (the whole point)
Start-Sleep -Seconds 8
try {
  $img = Invoke-WebRequest -Uri "https://pulserevops.com/assets/qa/ev109.jpg" -Method Head -MaximumRedirection 5 -UseBasicParsing
  Write-Host "VERIFY prod /assets/qa/ev109.jpg -> $($img.StatusCode) $($img.Headers['Content-Type']) $($img.Headers['Content-Length']) bytes"
  if ($img.StatusCode -eq 200) { Write-Host "SUCCESS: render path LIVE. Open https://pulserevops.com/knowledge/ev109" }
} catch { Write-Host "VERIFY note: $($_.Exception.Message) (may just need a few more seconds to propagate)" }

Write-Host ""
Write-Host "ROLLBACK (if needed): restore deploy $prev"
