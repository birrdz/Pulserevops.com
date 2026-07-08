// 🔒 4444 LOCKED (owner 2026-06-30). _scrub_roll.js — auto-press the Scrub Button: hit /scrub-one
// one-at-a-time (waits for each to finish before the next — owner's exact model), until the queue
// is empty or the daily cap is hit. The audit gate parks fabricated ones; clean ones certify → green.
// stop: _scrub_roll_stop.flag · log: _scrub_roll.out.log
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const STOP = WD + '/_scrub_roll_stop.flag';
const LOG = WD + '/_scrub_roll.out.log';
const PORT = parseInt(process.env.SCRUB_BTN_PORT || '8899', 10);
const PACE_MS = parseInt(process.env.ROLL_PACE_MS || '1500', 10);
const log = s => { const l = new Date().toISOString() + ' ' + s; try { fs.appendFileSync(LOG, l + '\n'); } catch (e) {} console.log(l); };
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  log(`[roll] auto-rolling the scrub button on :${PORT}`);
  let cert = 0, park = 0, n = 0;
  while (!fs.existsSync(STOP)) {
    let d;
    try { const r = await fetch(`http://localhost:${PORT}/scrub-one`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: '4444' }) }); d = await r.json(); }
    catch (e) { log('[roll] fetch err ' + e.message + ' — server up? idle 15s'); await sleep(15000); continue; }
    if (d.done === 'cap') { log(`[roll] daily cap reached — done for today (cert ${cert}/park ${park})`); break; }
    if (d.done === 'empty') { log(`[roll] queue EMPTY 🎉 — all under-12 worked (cert ${cert}/park ${park})`); break; }
    n++;
    if (d.status === 'certified') { cert++; log(`[roll] ✅ ${d.id} ${d.score || ''}/13 → GREEN (cert ${cert}, green ${d.state ? d.state.green : '?'}, left ${d.state ? d.state.under : '?'})`); }
    else if (d.status === 'parked') { park++; log(`[roll] 🅿️ ${d.id} parked — ${(d.msg || '').slice(0, 120)}`); }
    else log(`[roll] · ${d.id || ''} ${d.status || ''} ${(d.msg || '').slice(0, 80)}`);
    await sleep(PACE_MS);
  }
  log(`[roll] stopped — total ${n} (cert ${cert} / park ${park})`);
})();
