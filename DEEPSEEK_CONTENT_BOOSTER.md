# DeepSeek Content Booster

Standalone localhost duplicate on `http://localhost:7988/`. It does not modify the 7950 manager, its worker files, or image pipelines.

## Quality-ladder behavior

1. Reads the lowest-score URLs first (one pillar or the whole site).
2. Gives every URL one surgical DeepSeek improvement in the current wave.
3. Locks the existing Top-10 or Q&A gold template before writing.
4. Preserves image lines and safely absorbs image-pipeline swaps.
5. Saves improved sub-13 drafts under `_deepseek_booster_staging/`; they are not published.
6. After the whole wave completes, writes a checkpoint report and advances only staged drafts to the next wave.
7. Publishes only after the content grader reaches 13/13, the gold-template audit passes, image slots are unchanged, and newly added external URLs resolve.
8. Parks no-gain entries and opens a pod circuit breaker if more than 20% of a rolling 25 fail after the first 10.

DeepSeek temperature is `0.1`; Claude Code is never called.

## Start

```powershell
powershell -ExecutionPolicy Bypass -File .\START-DEEPSEEK-CONTENT-BOOSTER.ps1
```

Owner key: `4444`.

Start with one pod and 250 URLs. Once the run is stable, use `0` URLs per pod to cover the entire remaining scope. DeepSeek’s existing daily spending cap in `_ds_lib.js` still applies.

To start the entire catalog at the lowest scores and continue staged waves automatically:

```powershell
powershell -ExecutionPolicy Bypass -File .\START-DEEPSEEK-SITEWIDE.ps1
```
