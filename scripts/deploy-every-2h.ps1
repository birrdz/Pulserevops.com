# Deploy to Netlify production every 2 hours (Windows Task Scheduler).
# Same logic as nightly-deploy.ps1 but no "skip if unchanged" — always deploys.
#
# Task Scheduler: trigger every 2 hours, action:
#   powershell -ExecutionPolicy Bypass -File C:\Users\koryj\website\scripts\deploy-every-2h.ps1
#
# Netlify also runs pulse-deploy-scheduled-background on cron 0 */2 * * * when
# NETLIFY_BUILD_HOOK_URL or NETLIFY_AUTH_TOKEN is set in site env.

$ErrorActionPreference = 'Stop'
$projectDir = 'C:\Users\koryj\website'
$logFile = Join-Path $projectDir 'scripts\deploy-2h.log'
$envFile = Join-Path $projectDir '.env.local'

function Write-Log($msg) {
    $line = "[{0}] {1}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $msg
    Write-Host $line
    Add-Content -Path $logFile -Value $line -Encoding utf8
}

try {
    Set-Location $projectDir
    if (-not (Test-Path $envFile)) {
        Write-Log "ABORT: .env.local not found"
        exit 1
    }
    $token = $null
    foreach ($line in Get-Content $envFile) {
        if ($line -match '^NETLIFY_AUTH_TOKEN=(.+)$') { $token = $Matches[1].Trim(); break }
    }
    if (-not $token) {
        Write-Log "ABORT: NETLIFY_AUTH_TOKEN missing"
        exit 1
    }
    $env:NETLIFY_AUTH_TOKEN = $token

    Write-Log "DEPLOY: scheduled 2h production push"
    $deployStart = Get-Date
    $npx = (Get-Command npx.cmd -ErrorAction Stop).Source
    $proc = Start-Process -FilePath $npx -ArgumentList @(
        'netlify-cli','deploy','--prod',
        '--skip-functions-cache',
        '--message','Scheduled 2h deploy'
    ) -NoNewWindow -Wait -PassThru -RedirectStandardOutput "$logFile.out" -RedirectStandardError "$logFile.err"

    $stdout = ''
    $stderr = ''
    if (Test-Path "$logFile.out") { $stdout = Get-Content "$logFile.out" -Raw; Remove-Item "$logFile.out" -Force }
    if (Test-Path "$logFile.err") { $stderr = Get-Content "$logFile.err" -Raw; Remove-Item "$logFile.err" -Force }

    if ($proc.ExitCode -eq 0 -and $stdout -match 'Deploy is live|Production URL') {
        $secs = [int]((Get-Date) - $deployStart).TotalSeconds
        Write-Log "SUCCESS: live in ${secs}s"
        Set-Content -Path (Join-Path $projectDir 'scripts\.last-deploy-ts') -Value (Get-Date -Format 'o') -Encoding utf8
        exit 0
    }
    Write-Log "FAIL: exit=$($proc.ExitCode)"
    exit 1
}
catch {
    Write-Log "EXCEPTION: $($_.Exception.Message)"
    exit 1
}