// _overnight_gen — keeps the 4-DS-writer generate crew fed all night (owner 4444). Rotates
// pillars, 100 each; every entry must pass the rubric (12/13 + full format) + dual-CC before it
// goes live. Stop: _overnight_gen_stop.flag. Idempotent — only starts a run when the crew is idle.
const fs = require('fs');
const KEY = '4444', BASE = 'http://localhost:8899', STOP = 'C:/Users/koryj/website/_overnight_gen_stop.flag';
const FALLBACK = ['tl', 'q', 'ik', 'tk', 'gp', 'ra', 'bs', 'st', 'fr', 'ai', 'ca', 'bt', 'rs', 'cl', 'er', 'mv', 'wl', 'dn', 'nl', 'sc', 'tv', 'sy', 'co', 'aq', 'pt', 'es', 'ga', 'gm', 'cr', 'fs'];
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function get(p) { const r = await fetch(BASE + p); return r.json(); }
async function post(p, b) { const r = await fetch(BASE + p, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) }); return r.json(); }

(async () => {
  let pillars = [];
  try { pillars = (await get('/pillars?key=' + KEY)).map(x => x.p).filter(Boolean); } catch (e) {}
  if (!pillars.length) pillars = FALLBACK;
  let i = 0, started = 0;
  console.log('[gen-loop] overnight generation started · ' + pillars.length + ' pillars');
  while (!fs.existsSync(STOP)) {
    try {
      const s = await get('/gen-status');
      if (!s.running && !(s.queue && s.queue.length)) {
        const pillar = pillars[i % pillars.length]; i++;
        const r = await post('/gen-start', { key: KEY, pillar, count: 100 });
        if (r && r.ok) { started++; console.log(new Date().toISOString() + ' ▶ ' + pillar + ' (run #' + started + ')'); }
      }
    } catch (e) { console.log('[gen-loop] err ' + (e.message || e)); }
    await sleep(90000);
  }
  console.log('[gen-loop] stopped');
})();
