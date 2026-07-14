'use strict';
/**
 * NO SHORTCUTS LAW — face + top internals
 * Owner locked. Bypass only with passcode 4444.
 *
 * Forbidden without 4444:
 *  - Bulk face→top across a whole pillar in one unsupervised loop
 *  - Bulk pre-approve / auto-keep / auto-swap many entries
 *  - Declaring a pillar “done” from a counter alone
 *
 * Allowed:
 *  - Exactly ONE entry id per write (serial manual pass)
 *  - Owner passcode 4444 for an explicit bulk override
 */
const fs = require('fs');
const path = require('path');

const WD = 'C:/Users/koryj/website';
const FLAG = path.join(WD, '_NO_SHORTCUTS_IMAGE.lock');
const BYPASS = '4444';

function assertNoShortcuts(opts) {
  opts = opts || {};
  const pass = String(opts.passcode || process.env.OWNER_PASSCODE || process.argv.find((a) => /^\d{4}$/.test(a)) || '');
  const singleId = String(opts.id || opts.entryId || '').trim();
  const bulk = !!opts.bulk;
  const count = Number(opts.count || 0);

  if (pass === BYPASS) {
    console.warn('[NO-SHORTCUTS] OWNER BYPASS 4444 — bulk allowed this call only');
    try {
      fs.appendFileSync(FLAG, JSON.stringify({ at: new Date().toISOString(), bypass: true, opts: { bulk, count, id: singleId } }) + '\n');
    } catch (e) {}
    return { ok: true, bypass: true };
  }

  if (bulk || count > 1) {
    const msg = [
      '',
      '⛔ NO SHORTCUTS LAW — blocked',
      'Bulk face/top or multi-id image writes are forbidden.',
      'Do ONE id at a time: node _manual_pillar_face_tops_one.js <pillar> <id>',
      'Or owner passcode 4444 for an explicit bulk override.',
      '',
    ].join('\n');
    console.error(msg);
    try {
      fs.appendFileSync(FLAG, JSON.stringify({ at: new Date().toISOString(), blocked: true, opts: { bulk, count, id: singleId } }) + '\n');
    } catch (e) {}
    const err = new Error('NO_SHORTCUTS_LAW');
    err.code = 'NO_SHORTCUTS_LAW';
    throw err;
  }

  if (!singleId || !/^[a-z]{1,3}\d+/i.test(singleId)) {
    const err = new Error('NO_SHORTCUTS_LAW — require a single entry id');
    err.code = 'NO_SHORTCUTS_LAW';
    throw err;
  }

  return { ok: true, id: singleId };
}

module.exports = { assertNoShortcuts, BYPASS, FLAG };
