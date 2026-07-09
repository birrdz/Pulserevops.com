// _fcro_indexnow.js — submit every transformed fractional-CRO URL to IndexNow so Google/Bing crawl
// them fast. Uses the site's own pulse-indexnow-target endpoint (same as _fcro_audit2.js). Throttled.
// RUN AFTER the final deploy (so the logo + any static assets are live). Resume-safe via _fcro_indexnow_done.json.
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const KEY = 'pulsemachine-writer-2026';
const GAP = parseInt(process.env.INDEXNOW_GAP_MS || '250', 10);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const loadJSON = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } };

(async () => {
  const done = new Set(loadJSON(WD + '/_fcro_indexnow_done.json', []));
  const ids = loadJSON(WD + '/_fcro_transform_done.json', []);   // the 4,499 transformed entries
  console.log('[indexnow] submitting ' + ids.length + ' fractional-CRO URLs · ' + done.size + ' already done');
  let ok = 0, fail = 0, n = 0;
  for (const id of ids) {
    n++;
    if (done.has(id)) continue;
    try {
      const r = await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: KEY, id }), signal: AbortSignal.timeout(15000),
      });
      const j = await r.json().catch(() => ({}));
      if (j && j.ok) { ok++; done.add(id); } else fail++;
    } catch (e) { fail++; }
    if (n % 50 === 0) { fs.writeFileSync(WD + '/_fcro_indexnow_done.json', JSON.stringify([...done])); fs.writeFileSync(WD + '/_fcro_indexnow_progress.txt', n + '/' + ids.length + ' ok=' + ok + ' fail=' + fail); }
    await sleep(GAP);
  }
  fs.writeFileSync(WD + '/_fcro_indexnow_done.json', JSON.stringify([...done]));
  console.log('[indexnow] DONE · submitted=' + ok + ' fail=' + fail);
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
