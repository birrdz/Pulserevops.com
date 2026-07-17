// auto_improve.js — AUTORUN LOOK-AHEAD (content only). Pre-writes the entries you're about to
// reach: the current one + the next N-1 in the SAME queue order the picker shows, each rewritten
// to 13/13 by the Claude Code (Max-plan) writer. So by the time you get to them, it's just images.
// Writes live progress to new/_autorun.json so the picker button can show how far ahead it is.
//
// 🔒 SAFE UNDER THE NO-AUTO-BUILD LAW: this ONLY improves CONTENT (prep text). It NEVER places an
// image and NEVER publishes. The human still places every image and hits publish by hand.

'use strict';
const fs = require('fs');
const path = require('path');
const { gateScore } = require('./content_gate');
const { improveEntry } = require('./improve_content');

const ENTRIES = path.join(__dirname, 'entries');
const OUT = path.join(__dirname, 'output');
const PROG = path.join(__dirname, '_autorun.json');
const LOOKAHEAD = Math.max(1, parseInt(process.env.LOOKAHEAD || '10', 10)); // current + next (N-1) in front of you

function writeProg(p) { try { fs.writeFileSync(PROG, JSON.stringify(p, null, 1)); } catch (e) {} }
function readMeta(id) { try { return JSON.parse(fs.readFileSync(path.join(OUT, id, 'meta.json'), 'utf8')); } catch (e) { return { id }; } }

(async () => {
  let files = [];
  try { files = fs.readdirSync(ENTRIES).filter(f => f.endsWith('.json')); } catch (e) {}
  let FOCUS = ''; try { FOCUS = String(JSON.parse(fs.readFileSync(path.join(__dirname, '_focus.json'), 'utf8')).pillar || '').toLowerCase(); } catch (e) {}

  // Build the same queue the picker's currentEntry() builds: sub-13, not top10/thin/published-passing.
  const q = [];
  for (const f of files) {
    let e; try { e = JSON.parse(fs.readFileSync(path.join(ENTRIES, f), 'utf8')); } catch (_) { continue; }
    if (e.format === 'top10') continue;
    if (!(e.body && e.body.length > 300)) continue;
    const m = readMeta(e.id);
    if (m.status === '5/5' || m.status === 'skipped') continue;
    let pass = false; try { pass = gateScore(e).pass; } catch (_) {}
    if (pass) continue; // already 13/13 → not in the queue
    q.push({ id: e.id, created: e.created || '', fresh: /^(bbnew|newmr)/.test(e.id), blackbox: !!e.blackbox, pillar: String(e.id).replace(/\d.*$/, '').toLowerCase(), question: e.question || '' });
  }

  // MATCH baton_picker.js currentEntry() ranking EXACTLY so we pre-write the ones you hit next:
  // 0 Black Box, 1 CRO Pulse Tools (tl + "CRO"/"Chief Revenue Officer"), 2 focus pillar, 3 fix, 4 fresh.
  const isCroTool = x => x.pillar === 'tl' && /\bcro\b|chief revenue officer/i.test(String(x.question || ''));
  const rank = x => x.blackbox ? 0 : (isCroTool(x) ? 1 : (FOCUS && x.pillar === FOCUS ? 2 : (x.fresh ? 4 : 3)));
  q.sort((a, b) => { const ra = rank(a), rb = rank(b); if (ra !== rb) return ra - rb; return a.fresh ? String(b.created).localeCompare(String(a.created)) : String(a.created).localeCompare(String(b.created)); });

  const todo = q.slice(0, LOOKAHEAD).map(x => x.id); // current + next (N-1) in front of you

  const prog = { running: true, mode: 'lookahead', lookahead: LOOKAHEAD, startedAt: new Date().toISOString(), total: todo.length, done: 0, current: null, ahead: todo.length, improved: 0, failed: 0, results: [] };
  writeProg(prog);

  for (const id of todo) {
    prog.current = id; writeProg(prog);
    try {
      const r = await improveEntry(id);
      prog.results.push({ id, before: r.before, after: r.after, pass: !!r.pass, ok: !!r.ok });
      if (r.ok && r.pass) prog.improved++; else prog.failed++;
    } catch (e) {
      prog.results.push({ id, ok: false, err: String((e && e.message) || e) });
      prog.failed++;
    }
    prog.done++; prog.ahead = Math.max(0, todo.length - prog.done); prog.current = null; writeProg(prog);
  }

  prog.running = false; prog.finishedAt = new Date().toISOString(); writeProg(prog);
})();
