param([switch]$Uninstall)

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Starter = Join-Path $Root 'START-LOCAL-SITES.ps1'
$Watcher = Join-Path $Root 'WATCH-LOCAL-SITES.ps1'
$TaskName = 'Pulse Local Sites Daemon'
$WatchName = 'Pulse Local Sites Watchdog'
$StartupDir = [Environment]::GetFolderPath('Startup')
$StartupCmd = Join-Path $StartupDir 'Pulse-Local-Sites-Watchdog.cmd'

if ($Uninstall) {
  schtasks.exe /Delete /TN $TaskName /F 2>$null | Out-Null
  schtasks.exe /Delete /TN $WatchName /F 2>$null | Out-Null
  Remove-Item $StartupCmd -Force -ErrorAction SilentlyContinue
  Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
    Where-Object { $_.CommandLine -like "*$Watcher*" } |
    ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
  Write-Host 'Local Sites daemon startup hooks removed.'
  exit 0
}

$action = "powershell.exe -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$Starter`" -NoBrowser"
$taskOk = $true
& schtasks.exe /Create /TN $TaskName /TR $action /SC ONLOGON /RL LIMITED /F 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) { $taskOk = $false }
& schtasks.exe /Create /TN $WatchName /TR $action /SC MINUTE /MO 2 /RL LIMITED /F 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) { $taskOk = $false }

if (-not $taskOk) {
  $startup = @"
@echo off
start "" /min powershell.exe -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File "$Watcher"
"@
  Set-Content -Path $StartupCmd -Value $startup -Encoding Ascii
  $alreadyWatching = Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
    Where-Object { $_.CommandLine -like "*$Watcher*" }
  if (-not $alreadyWatching) {
    Start-Process powershell.exe -ArgumentList @('-NoProfile', '-WindowStyle', 'Hidden', '-ExecutionPolicy', 'Bypass', '-File', $Watcher) -WindowStyle Hidden
  }
}

& $Starter -Reset
Write-Host ''
if ($taskOk) {
  Write-Host 'Installed with Scheduled Tasks. Sites self-heal every two minutes.'
} else {
  Write-Host 'Scheduled Tasks were unavailable; installed the no-admin Startup watchdog instead.'
  Write-Host 'Sites will still restart at logon and self-heal every two minutes.'
}
