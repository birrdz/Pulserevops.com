// PULSE ENGINE — STEP 4 : advance the cursor + audited_count after a tick.
// Stable script. Cron writes _tick_result.json before running this:
//   { "finished": <n slots completed>, "was_visitor": <bool>, "top_sweep": <bool> }
// then runs `node _engine_step4.js`.
//
//   * normal/audit tick : cursor advances to id5 (last slot walked); +finished count.
//   * top-detour tick   : same cursor advance; last_top_sweep refreshed to this tick.
//   * visitor tick      : cursor + last_top_sweep UNCHANGED (normal duties only paused);
//                         +finished count (the visitor question that got golded).
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;

(async () => {
  let result = {};
  try { result = JSON.parse(fs.readFileSync('C:/Users/koryj/website/_tick_result.json', 'utf8')); } catch (e) {}
  const finished  = Math.max(0, Math.min(5, parseInt(result.finished, 10) || 0));
  const wasVisitor = !!result.was_visitor;
  const topSweep  = !!result.top_sweep;

  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const prev = (await store.get('_audit_status.json', { type: 'json' })) || {};
  const before = {
    last_audited_id: prev.last_audited_id || '',
    audited_count: (typeof prev.audited_count === 'number' ? prev.audited_count : 0),
    last_top_sweep: prev.last_top_sweep || 0
  };

  const visitorTick = wasVisitor || prev.tick_kind === 'visitor';

  // cursor follows the AUDIT WALK (walk_last), NOT slot id5 — id5 may be a
  // top-detour pick. visitor ticks never move the cursor.
  const newCursor   = visitorTick ? before.last_audited_id
                                  : (prev.walk_last || before.last_audited_id);
  const newTopSweep = (visitorTick || !topSweep) ? before.last_top_sweep : (prev.ts || Date.now());
  const newCount    = before.audited_count + finished;

  const next = {
    ...prev,
    last_audited_id: newCursor,
    audited_count: newCount,
    last_top_sweep: newTopSweep,
    // clear this-tick fields
    tick_kind: '', id: '', id2: '', id3: '', id4: '', id5: '',
    kinds: [], w_id: '', w_id2: '', visitor_target: '', walk_last: '',
    ts: Date.now()
  };
  await store.setJSON('_audit_status.json', next);
  try { fs.unlinkSync('C:/Users/koryj/website/_tick_result.json'); } catch (e) {}
  console.log(JSON.stringify({
    before,
    after: { last_audited_id: newCursor, audited_count: newCount, last_top_sweep: newTopSweep },
    tick: visitorTick ? 'visitor' : (topSweep ? 'top-detour' : 'normal'),
    finished
  }, null, 2));
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
