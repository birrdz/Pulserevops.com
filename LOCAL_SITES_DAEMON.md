# Local Sites daemon

One watchdog keeps the localhost/LAN control sites alive, with special handling for the PULSE Machines manager on `http://localhost:7950/`.

## Reset now

Double-click `RESET-LOCAL-SITES.bat`.

The watchdog status page opens at `http://localhost:7959/`. It shows every known site, its port, detected entrypoint, health, and a **RESET ALL SITES** button. Reset key: `4444`.

## Install self-healing startup

Run this once in PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\INSTALL-LOCAL-SITES-DAEMON.ps1
```

This starts the daemon at Windows logon and checks it every two minutes. The daemon itself health-checks sites every ten seconds.

## Discovery

Port 7950, its 7900–7902 workers, and the 7931 local app are auto-discovered by scanning local server entrypoints. This supports locally generated machine services even when their filenames change.

Known sites are listed in `local-sites.json`. Put machine-specific additions in the ignored `local-sites.user.json`:

```json
[
  {
    "id": "another-panel",
    "name": "Another panel",
    "port": 7940,
    "script": "another_panel.js"
  }
]
```

User entries take precedence over defaults with the same ID or port. Missing optional scripts are reported as `not-installed`; they do not prevent other sites from running. Port 7950 is required and is reported as `missing` if no matching manager entrypoint exists.

## Command line

```powershell
node .\_local_sites_daemon.js --once --dry-run
node .\_local_sites_daemon.js --reset
```

Runtime logs are written to `_local-sites-state\logs\`.

## Prefer DeepSeek in the 7950 Content Booster

To persist DeepSeek as the primary Content Booster writer and restart the 7950 hub with that policy:

```powershell
powershell -ExecutionPolicy Bypass -File .\SET-CONTENT-BOOSTER-DEEPSEEK.ps1
```
