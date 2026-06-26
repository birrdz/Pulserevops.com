// PULSE env loader — Netlify site env is source of truth; local dev syncs via
// `.env.local` and/or `netlify env:pull` (writes `.env`).
// Never log secret values — use envStatus() / auditEnv() for present/missing only.

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/** Vars used by blob writes, image pipeline, economy LLM, SEO/index scripts. */
const PULSE_ENV_KEYS = [
  'BLOBS_PAT',
  'NETLIFY_BLOBS_TOKEN',
  'NETLIFY_AUTH_TOKEN',
  'NETLIFY_SITE_ID',
  'SITE_ID',
  'GEMINI_API_KEY',
  'GOOGLE_API_KEY',
  'GOOGLE_GENERATIVE_AI_API_KEY',
  'GROK_API_KEY',
  'XAI_API_KEY',
  'GROQ_API_KEY',
  'ANTHROPIC_API_KEY',
  'SERPER_API_KEY',
  'RESEND_API_KEY',
  'resendapikey',
  'ALERT_TO_EMAIL',
  'ALERT_FROM_EMAIL',
  'NETLIFY_BUILD_HOOK_URL',
  'DEPLOY_HOOK_URL',
];

const DEFAULT_SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

let _loaded = false;
let _sources = [];

function isNetlifyRuntime() {
  return !!(
    process.env.NETLIFY ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.CONTEXT === 'production' ||
    process.env.CONTEXT === 'deploy-preview'
  );
}

function parseEnvLines(raw) {
  const out = {};
  for (const line of String(raw || '').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const m = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    out[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  return out;
}

function applyEnvMap(map, sourceLabel) {
  const applied = [];
  for (const [name, value] of Object.entries(map || {})) {
    if (!value || process.env[name]) continue;
    process.env[name] = value;
    applied.push(name);
  }
  if (applied.length) _sources.push(sourceLabel);
  return applied;
}

function loadEnvFile(filePath, sourceLabel) {
  if (!filePath || !fs.existsSync(filePath)) return [];
  try {
    return applyEnvMap(parseEnvLines(fs.readFileSync(filePath, 'utf8')), sourceLabel);
  } catch (_) {
    return [];
  }
}

function tryNetlifyCliFetch(missingKeys) {
  if (!missingKeys.length || isNetlifyRuntime()) return [];
  try {
    const out = execSync('npx --yes netlify-cli env:list --json', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 120000,
    });
    const remote = JSON.parse(out);
    const patch = {};
    for (const key of missingKeys) {
      const val = remote[key];
      if (val != null && String(val).trim()) patch[key] = String(val).trim();
    }
    return applyEnvMap(patch, 'netlify-cli');
  } catch (_) {
    return [];
  }
}

function applyAliases() {
  if (!process.env.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY =
      process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';
  }
  if (!process.env.NETLIFY_SITE_ID && process.env.SITE_ID) {
    process.env.NETLIFY_SITE_ID = process.env.SITE_ID;
  }
}

/**
 * Load env for local batch scripts. Safe to call multiple times (idempotent).
 * Order: existing process.env (Netlify injects at runtime) → .env.local → .env → netlify CLI.
 */
function loadEnv(rootDir, opts = {}) {
  if (_loaded && !opts.force) {
    applyAliases();
    return envStatus();
  }

  _sources = [];
  const root = rootDir || process.cwd();

  // Local overrides first, then netlify env:pull output (does not overwrite).
  loadEnvFile(path.join(root, '.env.local'), '.env.local');
  loadEnvFile(path.join(root, '.env'), '.env');

  if (opts.netlifyCli !== false) {
    const missing = PULSE_ENV_KEYS.filter((k) => !process.env[k]);
    if (missing.length) tryNetlifyCliFetch(missing);
  }

  applyAliases();
  _loaded = true;
  return envStatus();
}

/** @deprecated use loadEnv — kept for existing scripts */
function loadEnvLocal(rootDir, opts = {}) {
  const status = loadEnv(rootDir, opts);
  if (!blobsPat()) {
    throw new Error(
      'BLOBS_PAT missing — set in Netlify dashboard (Site configuration → Environment variables) ' +
        'then run `netlify env:pull` or add to .env.local'
    );
  }
  return {
    loaded: PULSE_ENV_KEYS.filter((k) => !!process.env[k]),
    hasLlm: !!(geminiApiKey() || process.env.GROQ_API_KEY || process.env.ANTHROPIC_API_KEY || grokApiKey()),
    hasGemini: !!geminiApiKey(),
    sources: _sources.slice(),
    ...status,
  };
}

function geminiApiKey() {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    ''
  ).trim();
}

function grokApiKey() {
  return (process.env.XAI_API_KEY || process.env.GROK_API_KEY || '').trim();
}

function blobsPat() {
  return (
    process.env.BLOBS_PAT ||
    process.env.NETLIFY_BLOBS_TOKEN ||
    process.env.NETLIFY_AUTH_TOKEN ||
    ''
  ).trim();
}

function netlifySiteId() {
  return (
    process.env.NETLIFY_SITE_ID ||
    process.env.SITE_ID ||
    DEFAULT_SITE_ID
  ).trim();
}

function envPresent(name) {
  return !!(process.env[name] && String(process.env[name]).trim());
}

function auditEnv() {
  const rows = PULSE_ENV_KEYS.map((name) => ({
    name,
    present: envPresent(name),
  }));
  return {
    keys: rows,
    gemini: !!geminiApiKey(),
    grok: !!grokApiKey(),
    blobs: !!blobsPat(),
    llm: !!(geminiApiKey() || grokApiKey() || envPresent('GROQ_API_KEY') || envPresent('ANTHROPIC_API_KEY')),
    sources: _sources.slice(),
    runtime: isNetlifyRuntime() ? 'netlify' : 'local',
  };
}

function envStatus() {
  return auditEnv();
}

module.exports = {
  PULSE_ENV_KEYS,
  DEFAULT_SITE_ID,
  loadEnv,
  loadEnvLocal,
  geminiApiKey,
  grokApiKey,
  blobsPat,
  netlifySiteId,
  envPresent,
  auditEnv,
  envStatus,
  isNetlifyRuntime,
  // backwards compat alias used by load-env-local.js consumers
  KEY_NAMES: PULSE_ENV_KEYS,
};
