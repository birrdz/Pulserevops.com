# _topic_run.ps1 <topic> — full per-topic face-card flow with retry guard.
#   gen 12 (bright+sharp+faceless gates) retry until >=8 -> pick best 10 -> apply across topic -> build grid.
param([Parameter(Mandatory=$true)][string]$t)
$w='C:\Users\koryj\website'
$env:POOL10_DDG_ONLY=''; $env:POOL10_FLUX_ONLY=''; $env:POOL10_SOFT_OK=''; $env:POOL10_CROP=''
[System.IO.File]::Delete("$w\_pool10_applied_$t.flag") 2>$null
$n=0
for($try=1; $try -le 3; $try++){
  Get-ChildItem "$w\assets\pool10\$t\*.jpg" -EA SilentlyContinue | ForEach-Object { Remove-Item $_.FullName -Force }
  [System.IO.File]::WriteAllText("$w\_pool10_topic.txt",$t)
  $env:MODE='gen'; $env:ONLY_TOPIC=$t; $env:N_IMAGES='12'; $env:POOL10_COOL_MS='0'; $env:POOL10_STAGGER_MS='20000'; $env:POOL10_BLUR_MIN='210'; $env:POOL10_BRIGHT_MIN='82'; $env:NO_EMAIL='1'
  Start-Process -FilePath 'node' -ArgumentList '_pool10_new.js' -WorkingDirectory $w -Wait -WindowStyle Hidden -RedirectStandardOutput "$w\_spotchecks\_$($t)_gen.log" -RedirectStandardError "$w\_spotchecks\_$($t)_gen.err"
  $n=@(Get-ChildItem "$w\assets\pool10\$t\*.jpg" -EA SilentlyContinue).Count
  if($n -ge 8){ break }
}
Start-Process -FilePath 'node' -ArgumentList '_pool10_pick.js',$t -WorkingDirectory $w -Wait -WindowStyle Hidden -RedirectStandardOutput "$w\_spotchecks\_$($t)_pick.log" -RedirectStandardError "$w\_spotchecks\_$($t)_pick.err"
$env:MODE='apply'; $env:ONLY_TOPIC=$t; $env:NO_EMAIL='1'
Start-Process -FilePath 'node' -ArgumentList '_pool10_new.js' -WorkingDirectory $w -Wait -WindowStyle Hidden -RedirectStandardOutput "$w\_spotchecks\_$($t)_apply.log" -RedirectStandardError "$w\_spotchecks\_$($t)_apply.err"
[System.IO.File]::WriteAllText("$w\_pool10_applied_$t.flag","x")
node "$w\_pool10_grid.js" $t "$w\_spotchecks\spotcheck_$t.html"
"DONE $t : final pool $(@(Get-ChildItem "$w\assets\pool10\$t\*.jpg" -EA SilentlyContinue).Count) images"
