// _cursor_run_once.js — one-shot Cursor Agent writer (owner 2026-07-26).
// Reads a full prompt from stdin, runs a local Cursor Agent via @cursor/sdk,
// prints the assistant markdown to stdout. Called by improve_content.js
// runCursor() via spawnSync so the sync writer path stays sync.
//
// Auth: CURSOR_API_KEY from env / .env.local (same pattern as DeepSeek).
'use strict';
const path = require('path');
const fs = require('fs');

const WD = path.join(__dirname, '..');
try {
  for (const l of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', c => (input += c)).on('end', async () => {
  try {
    const apiKey = process.env.CURSOR_API_KEY || process.env.CURSOR_API_TOKEN || '';
    if (!apiKey) {
      process.stderr.write('CURSORERR:CURSOR_API_KEY not set in .env.local');
      process.exit(4);
    }
    let Agent;
    try {
      ({ Agent } = require('@cursor/sdk'));
    } catch (e) {
      process.stderr.write('CURSORERR:sdk missing — npm install @cursor/sdk (' + String((e && e.message) || e) + ')');
      process.exit(4);
    }
    const wrapped = [
      'You are a content writer. Do NOT edit, create, or delete any files.',
      'Do NOT run shell commands or use tools that change the repo.',
      'Reply with ONLY the finished markdown body requested below — no preamble, no code fences around the whole answer.',
      '',
      input,
    ].join('\n');
    const modelId = process.env.CURSOR_MODEL || 'composer-2.5';
    const result = await Agent.prompt(wrapped, {
      apiKey,
      model: { id: modelId },
      local: { cwd: WD },
    });
    if (!result || result.status === 'error') {
      process.stderr.write('CURSORERR:run failed status=' + String(result && result.status));
      process.exit(3);
    }
    const text = String((result && (result.result || result.text || result.output)) || '').trim();
    if (!text) {
      process.stderr.write('CURSORERR:empty output');
      process.exit(3);
    }
    process.stdout.write(text);
  } catch (e) {
    process.stderr.write('CURSORERR:' + String((e && e.message) || e));
    process.exit(3);
  }
});
