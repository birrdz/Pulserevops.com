// mv-pillar-guard.js — HARD EXCLUSION: Movies (mv) pillar is OFF LIMITS for image pipelines.
// mv keeps TMDB real posters via the existing topic override map — never query, touch, count, or fix.

const MV_PILLAR = 'mv';
const MV_ID_RE = /^mv\d+$/i;

function pillarOf(id) {
  return (String(id || '').match(/^[a-z]+/) || [''])[0].toLowerCase();
}

function isMvEntry(id) {
  return MV_ID_RE.test(String(id || ''));
}

function isMvPillar(pillar) {
  return String(pillar || '').toLowerCase() === MV_PILLAR;
}

/** Returns true when this id/pillar must be skipped (mv). */
function shouldSkipMv({ id, pillar } = {}) {
  if (isMvPillar(pillar)) return true;
  if (id && isMvEntry(id)) return true;
  return false;
}

function assertNotMv(context, { id, pillar } = {}) {
  if (!shouldSkipMv({ id, pillar })) return;
  const label = id || pillar || MV_PILLAR;
  throw new Error('HARD EXCLUSION: mv pillar OFF LIMITS — skipped ' + label + (context ? ' (' + context + ')' : ''));
}

function skipMvLog(context, { id, pillar } = {}) {
  if (!shouldSkipMv({ id, pillar })) return false;
  const label = id || pillar || MV_PILLAR;
  console.log('[mv-guard] SKIP ' + label + (context ? ' · ' + context : ''));
  return true;
}

/** Filter index rows / manifest pages — drops every mv#### entry. */
function filterOutMv(rows) {
  return (rows || []).filter((row) => {
    const id = row && (row.id || row.slug || '');
    const pillar = row && row.pillar;
    return !shouldSkipMv({ id, pillar });
  });
}

module.exports = {
  MV_PILLAR,
  MV_ID_RE,
  pillarOf,
  isMvEntry,
  isMvPillar,
  shouldSkipMv,
  assertNotMv,
  skipMvLog,
  filterOutMv,
};
