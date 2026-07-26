'use strict';
/**
 * Claude Code bench / unbench (owner 2026-07-26).
 * Benched until Tuesday 2026-07-28 local. Override anytime:
 *   CLAUDE_OK=1        → force enable
 *   CLAUDE_BENCHED=1   → force keep benched
 *   CLAUDE_BENCHED=0   → same as CLAUDE_OK=1
 */
function claudeUnbenched() {
  const ok = String(process.env.CLAUDE_OK || '').trim();
  const bench = String(process.env.CLAUDE_BENCHED || '').trim();
  if (ok === '1' || bench === '0') return true;
  if (bench === '1') return false;
  // Tuesday 2026-07-28 00:00 local
  const unlock = new Date(2026, 6, 28, 0, 0, 0, 0);
  return Date.now() >= unlock.getTime();
}

function claudeBenchReason() {
  if (claudeUnbenched()) return '';
  return 'Claude Code cooldown until Tue 2026-07-28 (set CLAUDE_OK=1 to override)';
}

module.exports = { claudeUnbenched, claudeBenchReason };
