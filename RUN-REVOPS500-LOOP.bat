@echo off
cd /d "%~dp0"
echo RevOps 500 loop: post 500, wait 1 hour, repeat. No LLM cost. Ctrl+C to stop.
node _revops500_loop.js
