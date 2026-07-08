# PowerShell mirror of _do_deploy.sh — parks the big junk dir + secrets out of the deploy
# root, runs a prod netlify deploy of the site root, then ALWAYS restores (even on failure).
# Owner-approved deploy method. Used here for the fish-crabs heat-map fix.
$ErrorActionPreference = 'Continue'
$root = 'C:\Users\koryj\website'
$park = 'C:\Users\koryj\_DEPLOY_PARK'
Set-Location $root
New-Item -ItemType Directory -Force -Path $park | Out-Null

# token from .env.local, site id is fixed for this project
$token = $null
foreach ($l in Get-Content "$root\.env.local") { if ($l -match '^\s*NETLIFY_AUTH_TOKEN\s*=\s*(.+)\s*$') { $token = $matches[1].Trim('"',"'") } }
$site = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482'
Write-Host "site=$site token_present=$([bool]$token)"

function Park($name) { if (Test-Path "$root\$name") { Move-Item -Force "$root\$name" "$park\$name"; Write-Host "parked $name" } }
function Restore-Parked {
  foreach ($n in '_site_deploy', '.env', '.env.local') {
    if (Test-Path "$park\$n") { Move-Item -Force "$park\$n" "$root\$n"; Write-Host "restored $n" }
  }
}

try {
  Park '_site_deploy'   # 1.7GB build junk — must be out of the deploy root
  Park '.env'
  Park '.env.local'     # secrets — never deploy
  $env:NETLIFY_AUTH_TOKEN = $token
  $msg = "CRO card after Direct Answer: hero -> Direct Answer -> Kory White card -> rest (owner 4444)"
  Write-Host "=== deploying (npx netlify-cli, prod) ==="
  npx --yes netlify-cli@latest deploy --prod --dir=. --site=$site --message=$msg
  Write-Host "=== deploy exit code: $LASTEXITCODE ==="
}
finally {
  Restore-Parked
  Write-Host "env restored: $([bool](Test-Path "$root\.env.local"))"
}
