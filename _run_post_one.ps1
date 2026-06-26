$ErrorActionPreference = 'Stop'
Set-Location 'C:\Users\koryj\website'
node .\_economy_post_one.js | Tee-Object -FilePath .\_last_post.json
exit $LASTEXITCODE
