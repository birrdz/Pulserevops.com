// hf-pillar-guard.js — HARD EXCLUSION: Health & Family (hf) pillar is OFF LIMITS for this image run.
// Never query, touch, count, or fix hf pages even if the validator flags them (owner 2026-07-08).

const HF_PILLAR = 'hf';
const HF_ID_RE = /^hf\d+$/i;

function pillarOf(id) {
  return (String(id || '').match(/^[a-z]+/) || [''])[0].toLowerCase();
}

function isHfEntry(id) {
  return HF_ID_RE.test(String(id || ''));
}

function isHfPillar(pillar) {
  return String(pillar || '').toLowerCase() === HF_PILLAR;
}

/** Returns true when this id/pillar must be skipped (hf). */
function shouldSkipHf({ id, pillar } = {}) {
  if (isHfPillar(pillar)) return true;
  if (id && isHfEntry(id)) return true;
  return false;
}

function assertNotHf(context, { id, pillar } = {}) {
  if (!shouldSkipHf({ id, pillar })) return;
  const label = id || pillar || HF_PILLAR;
  throw new Error('HARD EXCLUSION: hf pillar OFF LIMITS — skipped ' + label + (context ? ' (' + context + ')' : ''));
}

function skipHfLog(context, { id, pillar } = {}) {
  if (!shouldSkipHf({ id, pillar })) return false;
  const label = id || pillar || HF_PILLAR;
  console.log('[hf-guard] SKIP ' + label + (context ? ' · ' + context : ''));
  return true;
}

/** Filter index rows / manifest pages — drops every hf#### entry. */
function filterOutHf(rows) {
  return (rows || []).filter(r => r && !shouldSkipHf({ id: r.id, pillar: r.pillar || pillarOf(r.id) }));
}

module.exports = { HF_PILLAR, HF_ID_RE, pillarOf, isHfEntry, isHfPillar, shouldSkipHf, assertNotHf, skipHfLog, filterOutHf };
