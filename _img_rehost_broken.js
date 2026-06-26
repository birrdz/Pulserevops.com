// RE-HOST PASS: find body markdown images that are broken (dead / hotlink-blocked
// so they don't display) and swap them to a wsrv.nl proxy URL that we've CONFIRMED
// serves a real image. Never-regress: a direct image is only replaced when (a) it
// fails HEAD/GET validation AND (b) the wsrv-proxied version validates OK. Working
// direct images and already-proxied/relative/data images are left untouched.
// Resumable (progress file), parallel, honors a stop flag.
//   node _img_rehost_broken.js [prefixCSV] [--conc 4] [--limit N]
const fs = require('fs');
const path = require('path');
try { const e = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8'); for (const l of e.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
const { getStore } = require('@netlify/blobs');
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i >= 0 ? process.argv[i + 1] : d; };
const PREFIXES = (process.argv.find(a => !a.startsWith('--') && /^[a-z,]+$/i.test(a)) || 'q').split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
const CONC = parseInt(arg('conc', '4'), 10);
const LIMIT = parseInt(arg('limit', '0'), 10) || Infinity;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
const LOG = path.join(__dirname, '_img_rehost_broken.log');
const PROG = path.join(__dirname, '_img_rehost_broken_progress.json');
const STOP = path.join(__dirname, '_img_rehost_stop.flag');
const log = s => { const l = new Date().toISOString().slice(11, 19) + ' ' + s; fs.appendFileSync(LOG, l + '\n'); console.log(l); };

async function imgOk(url) {
  try {
    const r = await fetch(url, { method: 'GET', headers: { Range: 'bytes=0-2048', 'User-Agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(12000) });
    const ct = (r.headers.get('content-type') || '').toLowerCase();
    return r.ok && ct.startsWith('image/');
  } catch (e) { return false; }
}
const wsrv = u => 'https://wsrv.nl/?url=' + encodeURIComponent(u) + '&w=1200&output=webp';
// keyless DuckDuckGo image search — used to REPLACE images whose source is dead
// (so even the proxy can't save it). Returns the first http(s) result.
async function ddgImage(query) {
  try {
    const tp = await fetch('https://duckduckgo.com/?q=' + encodeURIComponent(query) + '&iax=images&ia=images', { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(15000) });
    const html = await tp.text(); const m = html.match(/vqd=["']?([\d-]+)/); if (!m) return null;
    const r = await fetch('https://duckduckgo.com/i.js?l=us-en&o=json&q=' + encodeURIComponent(query) + '&vqd=' + m[1] + '&f=,,,&p=1', { headers: { 'User-Agent': UA, 'Referer': 'https://duckduckgo.com/', 'Accept': 'application/json' }, signal: AbortSignal.timeout(15000) });
    const j = await r.json(); const results = (j && j.results) || [];
    for (const it of results) { if (it.image && /^https?:\/\//.test(it.image)) return it.image; }
    return null;
  } catch (e) { return null; }
}
// only direct external http(s) images that aren't already proxied / generated
const skip = u => !/^https?:\/\//i.test(u) || /wsrv\.nl/i.test(u) || /pollinations\.ai/i.test(u) || /image\.pollinations/i.test(u);

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const idx = await store.get('_index.json', { type: 'json' });
  const prog = fs.existsSync(PROG) ? JSON.parse(fs.readFileSync(PROG, 'utf8')) : { done: [] };
  const doneSet = new Set(prog.done);
  let ids = (idx.entries || []).filter(e => e && e.id && PREFIXES.some(p => new RegExp('^' + p + '\\d+$').test(e.id)) && !doneSet.has(e.id)).map(e => e.id);
  ids = ids.slice(0, LIMIT);
  log('re-host pass: ' + ids.length + ' ' + PREFIXES.join('/') + ' entries to scan (conc ' + CONC + ')');
  let i = 0, scanned = 0, fixedEntries = 0, fixedImgs = 0, deadLeft = 0;
  async function worker() {
    while (i < ids.length) {
      if (fs.existsSync(STOP)) { log('STOP flag — halting'); return; }
      const id = ids[i++];
      try {
        const b = await store.get('answers/' + id + '.json', { type: 'json' });
        if (!b || !b.answer) { doneSet.add(id); continue; }
        const imgRe = /!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/g;
        const urls = []; let m;
        while ((m = imgRe.exec(b.answer)) !== null) urls.push(m[1]);
        const uniq = [...new Set(urls)].filter(u => !skip(u));
        let body = b.answer, changed = 0;
        for (const u of uniq) {
          if (await imgOk(u)) continue;            // direct image works — leave it
          const p = wsrv(u);
          if (await imgOk(p)) { body = body.split(u).join(p); changed++; fixedImgs++; }
          else deadLeft++;                          // even proxy can't save it (dead URL)
        }
        if (changed) { b.answer = body; b.polished_at = Date.now(); await store.setJSON('answers/' + id + '.json', b); fixedEntries++; }
        doneSet.add(id);
        scanned++;
        if (scanned % 100 === 0) { prog.done = [...doneSet]; fs.writeFileSync(PROG, JSON.stringify(prog)); log('  ' + scanned + '/' + ids.length + ' scanned · ' + fixedEntries + ' entries fixed · ' + fixedImgs + ' imgs re-hosted · ' + deadLeft + ' unsalvageable'); }
      } catch (err) { log('  ERR ' + id + ' ' + (err.message || err)); doneSet.add(id); }
    }
  }
  await Promise.all(Array.from({ length: CONC }, () => worker()));
  prog.done = [...doneSet]; fs.writeFileSync(PROG, JSON.stringify(prog));
  log('DONE scanned=' + scanned + ' entriesFixed=' + fixedEntries + ' imgsRehosted=' + fixedImgs + ' unsalvageable=' + deadLeft);
  try { await fetch('https://pulserevops.com/.netlify/functions/pulse-progress-notify?key=pulsemachine-writer-2026', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject: 'PULSE re-host pass done — ' + fixedImgs + ' images re-hosted', html: '<h2>Re-host pass complete</h2><p>' + fixedEntries + ' entries fixed, ' + fixedImgs + ' broken/hotlinked images routed through wsrv.nl, ' + deadLeft + ' unsalvageable (dead URLs). Prefixes: ' + PREFIXES.join(', ') + '.</p>' }) }); } catch (e) {}
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
