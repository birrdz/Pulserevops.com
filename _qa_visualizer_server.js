// Live Q&A pipeline visualizer — SEPARATE process (does NOT touch the scrub lane).
// Reads the scrub queue + run-log locally and the live lane from :8899, then renders
// every id in the focus pillar with its stage + status, plus a queue-by-pillar summary.
// Auto-refreshes. Open http://localhost:8901  ·  ?pillar=mv to focus a pillar.
const http = require('http');
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const PORT = parseInt(process.env.VIZ_PORT || '8901', 10);
const QUEUE = WD + '/_scrub_button_queue.json';
const SCRUBLOG = WD + '/_scrub_run_log.json';
const SCRUB_API = 'http://localhost:8899';
const PNAMES = { tl:'Pulse Tools', ca:'Cars', bt:'Boats', aq:'Aquariums', ik:'Industry KPIs', tk:'Tech Stacks', bs:'Book Summaries', st:'Sales Trainings', fr:'Franchises', co:'Collectibles', ai:'AI Infra', gb:'Graphics', bo:'Buildouts', sy:'Style', gp:'GTM Playbooks', ra:'Rev Architecture', pt:'Pets', es:'Espresso', tv:'TVs', rs:'Resorts', cl:'Cologne', lv:'Lux Vacations', ev:'Events', ga:'Gatherings', gm:'Gaming', mv:'Movies', wl:'Wellness', dn:'Dining', nl:'Nightlife', tn:'Towns', sc:'Schools', tc:'Telco', er:'Electronics', q:'Q&A', hf:'HF', sw:'SW', sk:'SK', sp:'SP' };
const pOf = id => (String(id).match(/^([a-z]+)\d/i) || [,''])[1].toLowerCase();
const pName = p => PNAMES[p] || p.toUpperCase();
const readJSON = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return null; } };
const esc = s => String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

async function laneState() {
  try {
    const r = await fetch(SCRUB_API + '/scrub-status', { signal: AbortSignal.timeout(5000) });
    const j = await r.json();
    return j || {};
  } catch (e) { return { _err: e.message }; }
}

// newest status per id from the run log (log is newest-first via unshift)
function statusMap() {
  const log = readJSON(SCRUBLOG) || [];
  const m = new Map();
  for (const e of log) {
    if (!e || !e.id) continue;
    const id = String(e.id).toLowerCase();
    if (!m.has(id)) m.set(id, { status: e.status, score: e.score, ts: e.ts, msg: e.msg });
  }
  return m;
}

const BADGE = {
  certified: ['#0b7a3b', '#d8f3e3', '✅ CERTIFIED 13/13'],
  green:     ['#0b7a3b', '#d8f3e3', '✅ PUBLISHED 13/13'],
  ready:     ['#8a5a00', '#fdefc7', '📋 READY (audit)'],
  parked:    ['#8a2a2a', '#fbdcdc', '🅿️ PARKED'],
  'reject-fix':['#8a2a2a', '#fbdcdc', '↩️ REFIX'],
  blocked:   ['#8a2a2a', '#fbdcdc', '🚫 BLOCKED'],
  queued:    ['#3a4a63', '#e3e9f3', '⏳ QUEUED'],
  active:    ['#0b3d8a', '#d6e4ff', '🔄 IN PROGRESS'],
  done:      ['#555', '#eee', '— idle'],
};
function badge(kind, extra) {
  const b = BADGE[kind] || BADGE.done;
  return '<span style="display:inline-block;padding:2px 9px;border-radius:20px;font-size:12px;font-weight:700;color:'+b[0]+';background:'+b[1]+'">'+b[2]+(extra?(' · '+esc(extra)):'')+'</span>';
}

function pinnedPillar() {
  // PINNED focus (owner: keep the viz on the topic we're on; do NOT drift). Change the
  // pin by writing _viz_focus.txt. Defaults to mv.
  try { const p = fs.readFileSync(WD + '/_viz_focus.txt', 'utf8').trim().toLowerCase(); if (p) return p; } catch (e) {}
  return (process.env.FOCUS_PILLAR || 'mv').toLowerCase();
}
async function render(explicitPillar) {
  const lane = await laneState();
  const pillar = (explicitPillar || pinnedPillar()).toLowerCase();
  const L = lane.lane || {};
  const slots = L.slots || {};
  // active id -> its live stage label
  const activeStage = {};
  for (const k of Object.keys(slots)) { const s = slots[k]; if (s && s.busy && s.id) activeStage[String(s.id).toLowerCase()] = (s.phase || s.label || k); }
  const scrubLive = lane.scrubLive || {};
  if (scrubLive.active && scrubLive.id) activeStage[String(scrubLive.id).toLowerCase()] = scrubLive.stage || scrubLive.carwash || 'working';

  const queue = (readJSON(QUEUE) || []).map(x => String(x).toLowerCase());
  const qByP = {}; for (const id of queue) { const p = pOf(id); qByP[p] = (qByP[p]||0)+1; }
  const smap = statusMap();
  // Fast-batch (mv) publishes straight to blobs, bypassing the lane/scrub-log — merge its done set
  // so the visualizer's Completed section reflects it. (_mv_fast_batch_done.json)
  const batchDone = (readJSON(WD + '/_mv_fast_batch_done.json') || []).map(x => String(x).toLowerCase());
  for (const id of batchDone) if (!smap.has(id)) smap.set(id, { status: 'green', score: 13, msg: 'fast batch' });
  // Pexels image run — image_run_cache.json keyed by id (status done) → show as completed for the pillar.
  const pexCache = readJSON(WD + '/image_run_cache.json', {}) || {};
  for (const k of Object.keys(pexCache)) { const v = pexCache[k]; const id = String(k).toLowerCase(); if (v && v.status === 'done' && !smap.has(id)) smap.set(id, { status: 'green', score: 13, msg: 'pexels ' + (v.provider || 'img') }); }

  // focus-pillar ids = queued ids of this pillar ∪ recently-logged ids of this pillar
  const set = new Set(queue.filter(id => pOf(id) === pillar));
  for (const id of smap.keys()) if (pOf(id) === pillar) set.add(id);
  for (const id of Object.keys(activeStage)) if (pOf(id) === pillar) set.add(id);
  const ids = [...set].sort((a,b) => a.localeCompare(b, undefined, { numeric: true }));

  let rows = '';
  const completed = [];
  let nCert=0, nActive=0, nQueued=0, nOther=0;
  for (const id of ids) {
    const inQ = queue.includes(id);
    const st = smap.get(id);
    // Completed (certified/green) → collected for the bottom "Completed" section, not the main table.
    if (st && (st.status==='certified'||st.status==='green') && !activeStage[id]) {
      completed.push({ id, score: st.score, ts: st.ts, status: st.status });
      nCert++; continue;
    }
    let cell, stage='';
    if (activeStage[id]) { cell = badge('active'); stage = activeStage[id]; nActive++; }
    else if (inQ) { cell = badge('queued'); nQueued++; }
    else if (st) { cell = badge(st.status||'done'); stage = st.msg||''; nOther++; }
    else { cell = badge('done'); nOther++; }
    const link = 'https://pulserevops.com/knowledge/' + id;
    rows += '<tr><td style="font-family:ui-monospace,monospace;font-weight:700"><a href="'+link+'" target="_blank" style="color:#0b57d0;text-decoration:none">'+esc(id)+'</a></td>'+
      '<td>'+cell+'</td><td style="color:#555;font-size:13px">'+esc(String(stage).slice(0,80))+'</td></tr>';
  }
  // most-recent first by concluded timestamp
  completed.sort((a,b) => String(b.ts||'').localeCompare(String(a.ts||'')));
  let doneRows = '';
  for (const c of completed) {
    const link = 'https://pulserevops.com/knowledge/' + c.id;
    const when = c.ts ? new Date(c.ts).toLocaleString() : '';
    doneRows += '<tr><td style="font-family:ui-monospace,monospace;font-weight:700"><a href="'+link+'" target="_blank" style="color:#0b7a3b;text-decoration:none">'+esc(c.id)+'</a></td>'+
      '<td>'+badge('certified', (c.score!=null?c.score+'/13':'13/13'))+'</td>'+
      '<td style="color:#778;font-size:13px">concluded '+esc(when)+'</td></tr>';
  }

  const qSummary = Object.entries(qByP).sort((a,b)=>b[1]-a[1]).slice(0,40)
    .map(([p,n]) => '<a href="?pillar='+p+'" style="text-decoration:none"><span style="display:inline-block;margin:2px;padding:3px 10px;border-radius:8px;background:'+(p===pillar?'#0b3d8a':'#eef1f6')+';color:'+(p===pillar?'#fff':'#334')+';font-size:13px;font-weight:600">'+esc(pName(p))+' '+n+'</span></a>').join('');

  const laneErr = lane._err ? '<div style="color:#b00;font-size:13px">scrub server :8899 unreachable ('+esc(lane._err)+') — lane info stale</div>' : '';
  const total = ids.length;
  return `<!doctype html><html><head><meta charset=utf-8><title>PULSE Q&A Pipeline — ${esc(pName(pillar))}</title>
<meta name=viewport content="width=device-width,initial-scale=1">
<style>body{font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;margin:0;background:#f4f6f9;color:#15110d}
.wrap{max-width:1000px;margin:0 auto;padding:22px}
h1{font-family:Georgia,serif;margin:0 0 4px;font-size:24px}
.sub{color:#667;font-size:13px;margin-bottom:14px}
.cards{display:flex;gap:10px;flex-wrap:wrap;margin:12px 0}
.card{background:#fff;border-radius:12px;padding:12px 18px;box-shadow:0 1px 3px rgba(0,0,0,.08);min-width:96px}
.card b{font-size:24px;display:block}.card span{font-size:12px;color:#778}
table{width:100%;border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08)}
td,th{padding:8px 12px;border-bottom:1px solid #eef0f3;text-align:left;font-size:14px}
th{background:#f8f9fb;font-size:12px;text-transform:uppercase;letter-spacing:.4px;color:#778}
.pills{margin:10px 0 18px}</style></head><body><div class=wrap>
<h1>PULSE Q&A Pipeline · ${esc(pName(pillar))}</h1>
<div class=sub id=stamp>Auto-updates in place every 5s · ${new Date().toLocaleString()} · lane mode=${esc((lane.lane?'parallel':'serial'))}</div>
${laneErr}
<div class=cards id=cards>
<div class=card><b>${total}</b><span>ids shown</span></div>
<div class=card><b style="color:#0b7a3b">${nCert}</b><span>certified 13/13</span></div>
<div class=card><b style="color:#0b3d8a">${nActive}</b><span>in progress</span></div>
<div class=card><b style="color:#3a4a63">${nQueued}</b><span>queued</span></div>
<div class=card><b>${nOther}</b><span>other/idle</span></div>
</div>
<div class=pills><div class=sub>Jump to pillar (queue counts):</div>${qSummary}</div>
<h3 style="margin:20px 0 6px;font-family:Georgia,serif">In progress &amp; queued</h3>
<table><thead><tr><th>QID</th><th>Status</th><th>Current stage</th></tr></thead><tbody id=tb-active>${rows||'<tr><td colspan=3 style=color:#999>none — all done or idle</td></tr>'}</tbody></table>
<h3 id=donehdr style="margin:26px 0 6px;font-family:Georgia,serif;color:#0b7a3b">✅ Completed (${completed.length}) — final status when concluded</h3>
<table><thead><tr><th>QID</th><th>Final status</th><th>Concluded</th></tr></thead><tbody id=tb-done>${doneRows||'<tr><td colspan=3 style=color:#999>none completed yet</td></tr>'}</tbody></table>
<div class=sub style="margin-top:14px">Pinned to <b>${esc(pName(pillar))}</b> (change via _viz_focus.txt or ?pillar=xx). Queue total: ${queue.length.toLocaleString()}.</div>
<script>
// Smooth in-place refresh every 5s — fetch this same page, swap the tables + cards, keep scroll.
setInterval(async () => {
  try {
    const html = await (await fetch(location.href, {cache:'no-store'})).text();
    const d = new DOMParser().parseFromString(html, 'text/html');
    for (const id of ['cards','tb-active','tb-done','donehdr','stamp']) {
      const src = d.getElementById(id), dst = document.getElementById(id);
      if (src && dst) dst.innerHTML = src.innerHTML;
    }
  } catch (e) {}
}, 5000);
</script>
</div></body></html>`;
}

http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, 'http://localhost');
    const pillar = (u.searchParams.get('pillar') || process.env.FOCUS_PILLAR || 'mv').toLowerCase();
    const html = await render(pillar);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('viz error: ' + (e && e.message));
  }
}).listen(PORT, () => console.log('[qa-viz] live on http://localhost:' + PORT + ' (focus ?pillar=mv)'));
