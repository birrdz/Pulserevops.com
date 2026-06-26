# Nightly deploy — single batched push to Netlify, only when something
# actually changed since the last successful deploy. Hard cost ceiling:
# 15 credits/day on days with changes, 0 credits on quiet days.
#
# Triggered by Windows Task Scheduler. Reads NETLIFY_AUTH_TOKEN from
# .env.local. Writes a marker file on success so the next run can detect
# whether new work is queued.
#
# Manual run for testing:
#   powershell -ExecutionPolicy Bypass -File C:\Users\koryj\website\scripts\nightly-deploy.ps1
#
# Logs to C:\Users\koryj\website\scripts\deploy.log (rolling).

$ErrorActionPreference = 'Stop'
$projectDir = 'C:\Users\koryj\website'
$markerFile = Join-Path $projectDir 'scripts\.last-deploy-ts'
$logFile = Join-Path $projectDir 'scripts\deploy.log'
$envFile = Join-Path $projectDir '.env.local'

function Write-Log($msg) {
    $line = "[{0}] {1}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $msg
    Write-Host $line
    Add-Content -Path $logFile -Value $line -Encoding utf8
}

try {
    Set-Location $projectDir

    # Load NETLIFY_AUTH_TOKEN from .env.local
    if (-not (Test-Path $envFile)) {
        Write-Log "ABORT: .env.local not found at $envFile"
        exit 1
    }
    $token = $null
    foreach ($line in Get-Content $envFile) {
        if ($line -match '^NETLIFY_AUTH_TOKEN=(.+)$') { $token = $Matches[1].Trim(); break }
    }
    if (-not $token) {
        Write-Log "ABORT: NETLIFY_AUTH_TOKEN not found in .env.local"
        exit 1
    }
    $env:NETLIFY_AUTH_TOKEN = $token

    # Determine "last deploy" timestamp
    $lastTs = [DateTime]::MinValue
    if (Test-Path $markerFile) {
        try { $lastTs = (Get-Content $markerFile -Raw).Trim() | ForEach-Object { [DateTime]::Parse($_) } } catch { $lastTs = [DateTime]::MinValue }
    }

    # Scan the project for any file modified since lastTs (excluding ignored dirs)
    $ignored = @('node_modules', '.git', 'scripts\.last-deploy-ts', 'scripts\deploy.log')
    $latestMod = [DateTime]::MinValue
    $changedCount = 0
    Get-ChildItem -Path $projectDir -Recurse -File -Force | ForEach-Object {
        $rel = $_.FullName.Substring($projectDir.Length + 1)
        $skip = $false
        foreach ($ig in $ignored) { if ($rel -like "$ig*") { $skip = $true; break } }
        if ($skip) { return }
        if ($_.LastWriteTime -gt $lastTs) {
            $changedCount++
            if ($_.LastWriteTime -gt $latestMod) { $latestMod = $_.LastWriteTime }
        }
    }

    if ($changedCount -eq 0) {
        Write-Log "SKIP: no changes since $lastTs (saved 15 credits)"
        exit 0
    }
    Write-Log "DEPLOY: $changedCount file(s) changed since $lastTs (latest mod $latestMod)"

    # Run the deploy — --no-build keeps it local-built (no build minutes consumed)
    $deployStart = Get-Date
    $npx = (Get-Command npx.cmd -ErrorAction Stop).Source
    $proc = Start-Process -FilePath $npx -ArgumentList @('netlify-cli','deploy','--prod','--no-build','--functions','netlify/functions','--dir','.','--skip-functions-cache') -NoNewWindow -Wait -PassThru -RedirectStandardOutput "$logFile.out" -RedirectStandardError "$logFile.err"

    $stdout = ''; $stderr = ''
    if (Test-Path "$logFile.out") { $stdout = Get-Content "$logFile.out" -Raw; Remove-Item "$logFile.out" -Force }
    if (Test-Path "$logFile.err") { $stderr = Get-Content "$logFile.err" -Raw; Remove-Item "$logFile.err" -Force }

    if ($proc.ExitCode -eq 0 -and $stdout -match 'Deploy is live|Production URL') {
        $deployEnd = Get-Date
        $secs = [int]($deployEnd - $deployStart).TotalSeconds
        Write-Log "SUCCESS: deploy live in ${secs}s"
        # Update marker so we don't re-deploy on the next run unless new edits land
        Set-Content -Path $markerFile -Value (Get-Date -Format 'o') -Encoding utf8
        exit 0
    }
    elseif ($stderr -match 'credit usage exceeded') {
        Write-Log "BLOCKED: Netlify credit cap hit - deploy refused. Will retry next run."
        exit 2
    }
    else {
        Write-Log ("FAIL: exit=$($proc.ExitCode). stdout-tail: " + ($stdout -split "`n" | Select-Object -Last 6 -join ' | '))
        Write-Log ("       stderr-tail: " + ($stderr -split "`n" | Select-Object -Last 6 -join ' | '))
        exit 1
    }
}
catch {
    Write-Log "EXCEPTION: $($_.Exception.Message)"
    exit 1
}
