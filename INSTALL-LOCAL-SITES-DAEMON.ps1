param([switch]$Uninstall)

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Starter = Join-Path $Root 'START-LOCAL-SITES.ps1'
$TaskName = 'Pulse Local Sites Daemon'
$WatchName = 'Pulse Local Sites Watchdog'

if ($Uninstall) {
  schtasks.exe /Delete /TN $TaskName /F 2>$null | Out-Null
  schtasks.exe /Delete /TN $WatchName /F 2>$null | Out-Null
  Write-Host 'Local Sites daemon scheduled tasks removed.'
  exit 0
}

$action = "powershell.exe -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$Starter`" -NoBrowser"
schtasks.exe /Create /TN $TaskName /TR $action /SC ONLOGON /RL LIMITED /F | Out-Null
schtasks.exe /Create /TN $WatchName /TR $action /SC MINUTE /MO 2 /RL LIMITED /F | Out-Null

& $Starter -Reset
Write-Host ''
Write-Host 'Installed. The localhost/LAN sites now restart at logon and self-heal every two minutes.'
