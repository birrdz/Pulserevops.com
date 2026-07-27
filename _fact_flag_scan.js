'use strict';
/**
 * _fact_flag_scan.js — scan library for likely FABRICATED venues/entities, queue for fact drip.
 * Writes: _fact_flagged.json · merges into _fact_drip_queue.json
 *
 *   node _fact_flag_scan.js           # scan + queue
 *   node _fact_flag_scan.js --live    # scan + queue + start _fact_drip.js (publish)
 *   FACT_SCAN_MAX=200 node _fact_flag_scan.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const WD = __dirname;
try {
  for (const l of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const { getStore } = require('@netlify/blobs');
const FLAGGED = path.join(WD, '_fact_flagged.json');
const QUEUEF = path.join(WD, '_fact_drip_queue.json');
const LOGF = path.join(WD, '_fact_flag_scan.out.log');
const MAX = parseInt(process.env.FACT_SCAN_MAX || '400', 10);
const LIVE = process.argv.includes('--live');

function log(m) {
  const line = new Date().toISOString() + ' ' + m;
  console.log(line);
  try { fs.appendFileSync(LOGF, line + '\n'); } catch (e) {}
}
function theStore() {
  return getStore({
    name: 'pulse-machine-library',
    siteID: process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN,
  });
}

const FAKE_NAME = /Meridian Hall|Atlas Hall|Onyx Las Hall|Jade Hall|Sapphire Hall|Copper Las|Ivory at Las Vegas|Las Vegas Crimson|Las Vegas Golden|The Silver at Las Vegas|Crimson Hall|Onyx Hall|Ivory Hall|Jade Garden|Copper Hall/i;
const REAL_VEGAS_NIGHT = /Caesars|Bellagio|Wynn|MGM|Palms|Resorts World|Sphere|Tao|Omnia|Hakkasan|XS\b|Marquee|Zouk|LIV\b|Jewel|Encore Beach|Wet Republic|Drai|Hakkasan|Light Nightclub|Surreal|KAOS|Aria|Cosmopolitan|Vdara/i;

function classify(title, body) {
  const t = String(title || '');
  const b = String(body || '');
  const reasons = [];
  if (FAKE_NAME.test(b)) reasons.push('known_fake_venue_name');
  if (/hinges on a clear operating definition/i.test(b)) reasons.push('surgical_da_boilerplate');
  if (/practical takeaway #\d/i.test(b)) reasons.push('surgical_faq_filler');
  if (/mckinsey\.com\/?\s*$/im.test(b) && /nightlife|nightclub|bar|football|recruit|school|resort|hotel|wear|outfit/i.test(t)) {
    reasons.push('irrelevant_mckinsey_source');
  }
  const isVegasNight = /vegas/i.test(t) && /nightlife|nightclub|bars?|clubs?/i.test(t);
  if (isVegasNight && FAKE_NAME.test(b)) reasons.push('vegas_nightlife_fake');
  if (isVegasNight && /\b\w+ Hall\b/.test(b) && !REAL_VEGAS_NIGHT.test(b)) reasons.push('vegas_nightlife_no_real_anchors');
  const isTopList = /top\s*10|best\s*10|\b10 best\b/i.test(t);
  if (isTopList && /vegas/i.test(t) && /Hall|Garden|At Las Vegas/i.test(b) && !REAL_VEGAS_NIGHT.test(b) && /nightlife|resort|hotel|bar|club/i.test(t)) {
    reasons.push('vegas_toplist_suspicious_names');
  }
  return reasons;
}

async function main() {
  const store = theStore();
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const entries = (idx.entries || []).filter(e => e && e.id);
  // Prioritize: Vegas + nightlife/travel/toplists, then recent polished
  const scored = entries.map(e => {
    const q = String(e.question || e.title || '');
    let pri = 0;
    if (/vegas/i.test(q)) pri += 50;
    if (/nightlife|nightclub|bars?|clubs?|resort|hotel/i.test(q)) pri += 20;
    if (/top\s*10|best\s*10/i.test(q)) pri += 10;
    if (/glasgow|fractional/i.test(q) && /hinges|operating definition/i.test(q)) pri += 5;
    pri += Math.min(10, Math.floor(((e.polished_at || 0) / 1e12)));
    return { e, pri, q };
  }).filter(x => x.pri >= 20 || /vegas/i.test(x.q))
    .sort((a, b) => b.pri - a.pri || (b.e.polished_at || 0) - (a.e.polished_at || 0))
    .slice(0, MAX);

  log('scan candidates ' + scored.length + ' (max ' + MAX + ')');
  const flagged = [];
  let checked = 0;
  for (const { e, q } of scored) {
    checked++;
    let body = '';
    try {
      const blob = await store.get('answers/' + e.id + '.json', { type: 'json', consistency: 'strong' });
      body = String((blob && blob.answer) || '');
    } catch (err) { continue; }
    if (body.length < 200) continue;
    const reasons = classify(q, body);
    if (!reasons.length) continue;
    flagged.push({
      id: e.id,
      question: q.slice(0, 180),
      reasons,
      gate_score: e.gate_score,
      polished_at: e.polished_at || null,
      url: 'https://pulserevops.com/knowledge/' + e.id,
      flagged_at: new Date().toISOString(),
    });
    log('FLAG ' + e.id + ' · ' + reasons.join(',') + ' · ' + q.slice(0, 80));
  }

  const report = {
    at: new Date().toISOString(),
    checked,
    flagged: flagged.length,
    items: flagged,
  };
  fs.writeFileSync(FLAGGED, JSON.stringify(report, null, 2));
  log('wrote ' + FLAGGED + ' · ' + flagged.length + ' flagged');

  // merge queue
  let qlist = [];
  try { qlist = JSON.parse(fs.readFileSync(QUEUEF, 'utf8')); } catch (e) {}
  const have = new Set(qlist);
  for (const f of flagged) if (!have.has(f.id)) qlist.push(f.id);
  // always front-load known bad
  for (const id of ['nl0137']) {
    qlist = [id].concat(qlist.filter(x => x !== id));
  }
  fs.writeFileSync(QUEUEF, JSON.stringify(qlist));
  log('queue ' + QUEUEF + ' · ' + qlist.length + ' ids');

  // stamp index quality down? optional — write a local "needs fact" ledger only
  const ledger = path.join(WD, 'new', 'imagebank', '_fact_needs_fix.json');
  try {
    let prev = [];
    try { prev = JSON.parse(fs.readFileSync(ledger, 'utf8')); } catch (e) {}
    const map = new Map(prev.map(x => [x.id, x]));
    for (const f of flagged) map.set(f.id, { id: f.id, reasons: f.reasons, at: f.flagged_at });
    fs.writeFileSync(ledger, JSON.stringify([...map.values()], null, 0));
    log('ledger ' + ledger + ' · ' + map.size);
  } catch (e) { log('ledger skip ' + e.message); }

  console.log(JSON.stringify({ checked, flagged: flagged.length, queue: qlist.length, live: LIVE, top: flagged.slice(0, 8).map(f => f.id + ':' + f.reasons[0]) }, null, 2));

  if (LIVE && flagged.length) {
    // clear dry env; spawn fact drip
    try { fs.unlinkSync(path.join(WD, '_fact_drip_stop.flag')); } catch (e) {}
    const child = spawn(process.execPath, [path.join(WD, '_fact_drip.js')], {
      cwd: WD,
      env: Object.assign({}, process.env, { WRITER_ENGINE: 'deepseek', FACT_DRY: '0' }),
      detached: true,
      stdio: 'ignore',
      windowsHide: true,
    });
    child.unref();
    log('spawned fact drip pid=' + child.pid + ' (live publish)');
    console.log('FACT DRIP LIVE pid', child.pid);
  } else {
    console.log('Next: Force Stop crews in hub, then: node _fact_drip.js');
    console.log('Or: node _fact_flag_scan.js --live');
  }
}

main().catch(e => { console.error(e); process.exit(1); });
