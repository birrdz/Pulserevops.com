# Post ONE economy Q&A (reads _economy_queue.txt, writes live to blob store).
# Run from project root:
#   powershell -ExecutionPolicy Bypass -File C:\Users\koryj\website\scripts\economy-next.ps1
$ErrorActionPreference = 'Stop'
Set-Location 'C:\Users\koryj\website'
node .\_economy_post_one.js | Tee-Object -FilePath .\_last_post.json
$remaining = (Get-Content .\_economy_queue.txt | Where-Object { $_ -and $_ -notmatch '^\s*#' -and $_ -notmatch '^DONE\|' }).Count
Write-Host "Remaining in queue: $remaining"
if ($remaining -eq 0) {
  Write-Host 'Queue empty — run scripts\economy-finish.ps1 for deploy + search ping.'
}
