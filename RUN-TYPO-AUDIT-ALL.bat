@echo off
REM Site-wide typo audit: every q / vq_ / st / ik answer. Auto-resumes until done.
cd /d "%~dp0"
set NODE_ENV=production
node _library_typo_audit.js --until-done >> _typo_audit_run.log 2>&1
