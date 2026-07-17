// tl_scan.js — READ-ONLY quality scan of the whole tl (Pulse Tools) pillar. Fetches each entry's
// live body and scores it against the 13-point gate. Writes running tally to new/_tlscan.json.
// Changes NOTHING — no content edits, no images, no publish. Just counts how many need help.

'use strict';
const fs = require('fs');
const path = require('path');
const https = require('https');
const { gateScore } = require('./content_gate');

const IDS = path.join(__dirname, '_tl_ids.json');
const PROG = path.join(__dirname, '_tlscan.json');
const API = 'https://pulserevops.com/.netlify/functions/pulse-machine-library-list?id=';

function get(url) {
  return new Promise((res) => {
    https.get(url, r => { let d = ''; r.on('data', c => d += c); r.on('end', () => res(d)); }).on('error', () => res(''));
  });
}

(async () => {
  let ids = [];
  try { ids = JSON.parse(fs.readFileSync(IDS, 'utf8')); } catch (e) {}
  const prog = { running: true, total: ids.length, done: 0, pass: 0, fail: 0, failsBy: {}, examples: [], startedAt: new Date().toISOString() };
  const write = () => { try { fs.writeFileSync(PROG, JSON.stringify(prog, null, 1)); } catch (e) {} };
  write();

  let i = 0;
  const CONC = 6;
  async function worker() {
    while (i < ids.length) {
      const id = ids[i++];
      const raw = await get(API + id);
      let body = '';
      try { const d = JSON.parse(raw); const e = d.entry || d; body = e.answer || e.body || ''; } catch (_) {}
      let g; try { g = gateScore({ body }); } catch (_) { g = { pass: false, score: 0, fails: [] }; }
      if (g.pass) prog.pass++;
      else {
        prog.fail++;
        for (const f of g.fails) prog.failsBy[f.name] = (prog.failsBy[f.name] || 0) + 1;
        if (prog.examples.length < 20) prog.examples.push({ id, score: g.score, missing: g.fails.map(f => f.name) });
      }
      prog.done++;
      if (prog.done % 25 === 0) write();
    }
  }
  await Promise.all(Array.from({ length: CONC }, () => worker()));
  prog.running = false; prog.finishedAt = new Date().toISOString(); write();
})();
