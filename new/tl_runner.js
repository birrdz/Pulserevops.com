// new/tl_runner.js — two-lane feed. FIXER lane (upgrade_tl → old CRO URLs) + NEW lane (gen_new → net-new
// pages), each with its own concurrency, running in parallel. HOLDS at the shared backlog cap. No cooldown.
// Built entries are never touched. Force Stop & Clear (Control Room) kills it.
'use strict';
const fs = require('fs');
const { spawn } = require('child_process');
const WD = 'C:/Users/koryj/website';
const ENTRIES = WD + '/new/entries';
const STATE = __dirname + '/_tl_target_state.json';
const CAP = parseInt(process.env.TL_CAP || '12', 10);
const TARGET = parseInt(process.env.TL_TARGET || '0', 10);            // fixer target (0 = unlimited)
const FX_CONC = Math.max(0, parseInt(process.env.TL_CONC || '1', 10));      // fixer writers
const NW_CONC = Math.max(0, parseInt(process.env.TL_NEW_CONC || '0', 10));  // new-page writers
const FIXER = WD + '/new/' + (process.env.UPGRADE_SCRIPT || 'upgrade_tl.js');
const NEWGEN = WD + '/new/gen_new.js';
let fxInflight = 0, nwInflight = 0;

try { fs.writeFileSync(STATE, JSON.stringify({ target: TARGET, done: 0 })); } catch (e) {}
const state = () => { try { return JSON.parse(fs.readFileSync(STATE, 'utf8')); } catch (e) { return { target: TARGET, done: 0 }; } };
const save = s => { try { fs.writeFileSync(STATE, JSON.stringify(s)); } catch (e) {} };
function unbuiltCount() {
  let n = 0;
  try { for (const f of fs.readdirSync(ENTRIES)) { if (!f.endsWith('.json')) continue; const id = f.replace('.json', ''); let built = false; try { built = JSON.parse(fs.readFileSync(WD + '/new/output/' + id + '/meta.json', 'utf8')).status === '5/5'; } catch (e) {} if (!built) n++; } } catch (e) {}
  return n;
}
function fire(script, lane) {
  if (lane === 'fx') fxInflight++; else nwInflight++;
  const c = spawn(process.execPath, [script], { cwd: WD });
  let out = '';
  c.stdout.on('data', d => out += d);
  c.stderr.on('data', () => {});
  c.on('close', () => {
    if (lane === 'fx') { fxInflight--; if (/rebuilt →/.test(out)) { const st = state(); st.done = (st.done || 0) + 1; save(st); console.log('[fx] fixed ' + st.done + '/' + (st.target || '∞')); } }
    else { nwInflight--; if (/new page|3\/3/.test(out)) console.log('[nw] new page done'); }
    tick();
  });
  c.on('error', () => { if (lane === 'fx') fxInflight--; else nwInflight--; });
}
function tick() {
  // fixer lane
  while (fxInflight < FX_CONC) {
    const st = state();
    if (st.target && (st.done + fxInflight) >= st.target) break;
    if (unbuiltCount() + fxInflight + nwInflight >= CAP) break;
    console.log('[fx] firing · queue ' + unbuiltCount());
    fire(FIXER, 'fx');
  }
  // new lane
  while (nwInflight < NW_CONC) {
    if (unbuiltCount() + fxInflight + nwInflight >= CAP) break;
    console.log('[nw] firing · queue ' + unbuiltCount());
    fire(NEWGEN, 'nw');
  }
}
setInterval(tick, 8000);
tick();
console.log('[feed] up · FIXER writers ' + FX_CONC + ' · NEW writers ' + NW_CONC + ' · cap ' + CAP + ' · fixer target ' + (TARGET || '∞'));
