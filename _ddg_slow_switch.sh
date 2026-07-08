#!/bin/bash
cd /c/Users/koryj/website
echo "$(date -u +%T) stopping fast DDG lanes via stop flag"
touch _img_audit_stop.flag
# wait up to 6 min for the fast sitewide lanes to drain/exit
for i in $(seq 1 36); do
  n=$(powershell -NoProfile -Command "(Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | Where-Object { \$_.CommandLine -match 'img_backfill_sitewide' }).ProcessId | Measure-Object | Select-Object -ExpandProperty Count" 2>/dev/null)
  echo "$(date -u +%T) sitewide lanes alive: ${n:-?}"
  [ "${n:-0}" = "0" ] && break
  sleep 10
done
# also stop any lingering _cover_img_any children
rm -f _img_audit_stop.flag
echo "$(date -u +%T) starting ONE slow detached DDG lane (DDG_SLOW=150000 = ~2.5min/image, conc=1)"
DDG_SLOW=150000 LANE=SLOW nohup node _img_backfill_sitewide.js > _img_ddg_slow.out.log 2>&1 &
echo "slow DDG lane PID $!"
