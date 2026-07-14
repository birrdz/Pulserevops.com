// PULSE — "Every Pillar Perfect" dashboard (NEW, replaces the pillar-pinned _qa_visualizer_server.js).
// Reads the AUTHORITATIVE blob _index.json (quality_score per entry) + the local scrub queue,
// and shows site-wide + per-pillar progress toward a TRUE 13/13 on every topic.
// Standalone process — does NOT touch the scrub lane. Open http://localhost:8902
const http = require('http');
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
// load .env.local (for the blobs token) the same way the generators do
try { for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const PORT = parseInt(process.env.PERFECT_PORT || '8902', 10);
const QUEUE = WD + '/_scrub_button_queue.json';
const PNAMES = { tl:'Pulse Tools', ca:'Cars', bt:'Boats', aq:'Aquariums', ik:'Industry KPIs', tk:'Tech Stacks', bs:'Book Summaries', st:'Sales Trainings', fr:'Franchises', co:'Collectibles', ai:'AI Infra', gb:'Graphics', bo:'Buildouts', sy:'Style', gp:'GTM Playbooks', ra:'Rev Architecture', pt:'Pets', es:'Espresso', tv:'TVs', rs:'Resorts', cl:'Cologne', lv:'Lux Vacations', ev:'Events', ga:'Gatherings', gm:'Gaming', mv:'Movies', wl:'Wellness', dn:'Dining', nl:'Nightlife', tn:'Towns', sc:'Schools', tc:'Telco', er:'Electronics', q:'Q&A', hf:'Home & Family', sw:'Software', sk:'Skill Drills', sp:'Sports', cg:'Cologne', dr:'Drills', pt2:'Pets' };
const pName = p => PNAMES[p] || p.toUpperCase();
const pOf = id => (String(id).match(/^([a-z]+)\d/i) || [,''])[1].toLowerCase();
const readJSON = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return null; } };

// cache the blob index (big) so refreshes don't hammer blobs
let cache = { at: 0, data: null };
async function computeStats() {
  if (cache.data && Date.now() - cache.at < 25000) return cache.data;
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const es = ((idx && idx.entries) || []).filter(e => e && e.id && !/^vq_/i.test(String(e.id)));
  const queue = (readJSON(QUEUE) || []).map(x => String(x).toLowerCase());
  const qByP = {}; for (const id of queue) { const p = pOf(id); if (p) qByP[p] = (qByP[p] || 0) + 1; }
  const byP = {};
  let total = 0, perfect = 0, ge12 = 0, eleven = 0, ten = 0, below = 0, none = 0;
  for (const e of es) {
    const p = pOf(e.id); if (!p) continue;
    const s = (typeof e.quality_score === 'number') ? e.quality_score : null;
    const b = byP[p] || (byP[p] = { p, name: pName(p), n: 0, perfect: 0, ge12: 0, queued: 0 });
    b.n++; total++;
    if (s === 13) { b.perfect++; perfect++; }
    if (s != null && s >= 12) { b.ge12++; ge12++; }
    if (s === 11) eleven++; else if (s === 10) ten++; else if (s == null) none++; else if (s < 10) below++;
  }
  for (const p of Object.keys(byP)) byP[p].queued = qByP[p] || 0;
  const rows = Object.values(byP).sort((a, b) => b.n - a.n);
  const data = { at: new Date().toISOString(), total, perfect, ge12, eleven, ten, below, none,
    pctPerfect: total ? (perfect / total * 100) : 0, pct12: total ? (ge12 / total * 100) : 0,
    queueTotal: queue.length, rows };
  cache = { at: Date.now(), data };
  return data;
}

const esc = s => String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function bar(pct, good) {
  const c = good ? '#1a7f4b' : '#c98a1a';
  return `<div style="background:#efe7dc;border-radius:6px;height:10px;overflow:hidden;min-width:120px"><div style="width:${pct.toFixed(1)}%;height:100%;background:${c}"></div></div>`;
}
function page(d) {
  const rows = d.rows.map(r => {
    const pc = r.n ? (r.perfect / r.n * 100) : 0;
    const done = r.perfect === r.n && r.n > 0;
    return `<tr>
      <td><b>${esc(r.name)}</b> <span class=k>${esc(r.p)}</span></td>
      <td class=num>${r.n.toLocaleString()}</td>
      <td class=num style="color:#1a7f4b;font-weight:700">${r.perfect.toLocaleString()}</td>
      <td>${bar(pc, done)}<span class=pct>${pc.toFixed(0)}%</span></td>
      <td class=num>${r.ge12.toLocaleString()}</td>
      <td class=num>${r.queued ? '<span style="color:#8a2a2a">'+r.queued.toLocaleString()+'</span>' : '—'}</td>
      <td>${done ? '<span class=badge-ok>✅ PERFECT</span>' : '<span class=badge-work>in progress</span>'}</td>
    </tr>`;
  }).join('');
  return `<!doctype html><html><head><meta charset=utf-8><title>PULSE — Every Pillar Perfect</title>
<meta name=viewport content="width=device-width,initial-scale=1">
<style>
:root{color-scheme:light}
body{font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;margin:0;background:#f7f2ea;color:#15110d}
.wrap{max-width:1080px;margin:0 auto;padding:24px}
h1{font-family:Georgia,'Fraunces',serif;margin:0 0 2px;font-size:26px}
.sub{color:#7a6a58;font-size:13px;margin-bottom:18px}
.hero{display:flex;gap:14px;flex-wrap:wrap;margin:14px 0 20px}
.big{background:#fff;border:1px solid #e7ddce;border-radius:16px;padding:16px 22px;box-shadow:0 1px 4px rgba(0,0,0,.05)}
.big b{display:block;font-family:Georgia,serif;font-size:34px;line-height:1;color:#15110d}
.big.gold b{color:#1a7f4b}
.big span{font-size:12px;color:#7a6a58;text-transform:uppercase;letter-spacing:.5px}
table{width:100%;border-collapse:collapse;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.05)}
th,td{padding:9px 12px;text-align:left;font-size:13px;border-bottom:1px solid #f0e8db;vertical-align:middle}
th{background:#efe7dc;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:#7a6a58}
td.num,th.num{text-align:right;font-variant-numeric:tabular-nums}
.k{color:#b09a80;font-size:11px}
.pct{font-size:11px;color:#7a6a58;margin-left:8px}
.badge-ok{background:#d8f3e3;color:#0b7a3b;font-weight:700;padding:2px 9px;border-radius:20px;font-size:11px}
.badge-work{background:#fdefc7;color:#8a5a00;font-weight:600;padding:2px 9px;border-radius:20px;font-size:11px}
a{color:#a86b1f}
.links{margin:16px 0 4px;font-size:13px}
</style></head><body><div class=wrap>
<h1>🎯 Every Pillar Perfect</h1>
<div class=sub>True <b>13/13</b> on every topic across all pillars · updated ${new Date(d.at).toLocaleTimeString()} · auto-refresh 15s · reads the live library index</div>
<div class=hero>
  <div class="big gold"><b>${d.perfect.toLocaleString()}</b><span>Perfect 13/13</span></div>
  <div class=big><b>${d.total.toLocaleString()}</b><span>Total topics</span></div>
  <div class=big><b>${d.pctPerfect.toFixed(1)}%</b><span>Site perfect</span></div>
  <div class=big><b>${d.ge12.toLocaleString()}</b><span>12/13 and up</span></div>
  <div class=big><b>${d.queueTotal.toLocaleString()}</b><span>In scrub queue</span></div>
</div>
<table>
<thead><tr><th>Pillar</th><th class=num>Topics</th><th class=num>13/13</th><th>Perfect %</th><th class=num>12+</th><th class=num>Left</th><th>Status</th></tr></thead>
<tbody>${rows}</tbody>
</table>
<div class=links>🖼️ <a href="http://localhost:8905/?batch=561">Keep/throw-away image gallery</a> · 🧽 <a href="http://localhost:8899/scrubber">Scrub engine</a></div>
</div>
<script>setTimeout(()=>location.reload(),15000)</script>
</body></html>`;
}

http.createServer(async (req, res) => {
  try {
    if (req.url.startsWith('/data.json')) { const d = await computeStats(); res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); return res.end(JSON.stringify(d)); }
    const d = await computeStats();
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(page(d));
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.end('<body style="font-family:sans-serif;padding:40px"><h2>index read error</h2><pre>' + esc(e.message) + '</pre><p>retrying…</p><script>setTimeout(()=>location.reload(),5000)</script>');
  }
}).listen(PORT, () => console.log('[perfect-dashboard] live on http://localhost:' + PORT + '  (reads blob _index.json + scrub queue)'));
