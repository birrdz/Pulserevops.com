#!/usr/bin/env node
// Audit PULSE env vars — present/missing only, never prints secret values.
// Usage: node _env_audit.js [--netlify]
const path = require('path');
const { execSync } = require('child_process');
const { loadEnv, auditEnv, PULSE_ENV_KEYS } = require('./netlify/functions/lib/load-env');

const CORE_KEYS = [
  'BLOBS_PAT',
  'GEMINI_API_KEY',
  'GROK_API_KEY',
  'XAI_API_KEY',
  'GROQ_API_KEY',
  'ANTHROPIC_API_KEY',
  'SERPER_API_KEY',
];

function netlifyPresence() {
  try {
    const out = execSync('npx --yes netlify-cli env:list --json', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 120000,
    });
    const remote = JSON.parse(out);
    return CORE_KEYS.reduce((acc, name) => {
      acc[name] = remote[name] != null && String(remote[name]).trim().length > 0;
      return acc;
    }, {});
  } catch (e) {
    return { _error: e.message.slice(0, 120) };
  }
}

function localFilePresence(fileName) {
  const fs = require('fs');
  const p = path.join(__dirname, fileName);
  if (!fs.existsSync(p)) return null;
  const raw = fs.readFileSync(p, 'utf8');
  return CORE_KEYS.reduce((acc, name) => {
    acc[name] = new RegExp('^' + name + '=(.+)$', 'm').test(raw);
    return acc;
  }, {});
}

const withNetlify = process.argv.includes('--netlify');
loadEnv(__dirname, { netlifyCli: withNetlify });
const status = auditEnv();
const envLocal = localFilePresence('.env.local');
const envPulled = localFilePresence('.env');
const netlify = withNetlify ? netlifyPresence() : null;

console.log(JSON.stringify({
  runtime: status.runtime,
  sources: status.sources,
  summary: {
    blobs: status.blobs,
    gemini: status.gemini,
    grok: status.grok,
    llm: status.llm,
  },
  local_env_local: envLocal,
  local_env: envPulled,
  netlify_dashboard: netlify,
  recommendation: !envPulled && !netlify?._error
    ? 'Run `npx netlify-cli env:pull` to sync Netlify site env → .env for local batch scripts.'
    : undefined,
}, null, 2));
