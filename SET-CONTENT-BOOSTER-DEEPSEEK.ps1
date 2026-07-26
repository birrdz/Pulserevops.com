$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path

# Policy consumed by the 7950 hub and inherited by every Content Booster child.
$policy = @{
  CONTENT_BOOSTER_WRITER = 'deepseek'
  BOOSTER_WRITER_ENGINE = 'deepseek'
  CONTENT_WRITER_ENGINE = 'deepseek'
  WRITER_ENGINE = 'deepseek'
  DS_ONLY = '1'
  CLAUDE_ONLY = '0'
  NO_DS = '0'
}
foreach ($item in $policy.GetEnumerator()) {
  Set-Item -Path "Env:$($item.Key)" -Value $item.Value
  [Environment]::SetEnvironmentVariable($item.Key, $item.Value, 'User')
}

# Restart only the watchdog and its managed sites so 7950 inherits the new policy.
$daemonPid = Get-NetTCPConnection -LocalPort 7959 -State Listen -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty OwningProcess -First 1
if ($daemonPid) {
  Stop-Process -Id $daemonPid -Force -ErrorAction SilentlyContinue
  Start-Sleep -Milliseconds 700
}

& (Join-Path $Root 'START-LOCAL-SITES.ps1') -Reset
Write-Host ''
Write-Host '7950 Content Booster now prioritizes DeepSeek for content writing.'
Write-Host 'Claude Code is not assigned a primary Content Booster writer slot.'
