// Combined campaign status email: GLOBAL (writing + DDG images vs 8,730) PLUS a
// PER-PILLAR breakdown (written of that pillar's gap target). Run: node _campaign_status_email.js
const fs = require('fs');
// 🔒 KILL SWITCH (owner 2026-06-26 PM: "cancel all automated emails"). If this
// flag exists, send NOTHING — even on accidental relaunch. Delete the flag to re-enable.
if (fs.existsSync('C:/Users/koryj/website/_emails_off.flag')) { console.log('[email] disabled by _emails_off.flag — no send'); process.exit(0); }
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const BASELINE = 19851, TARGET = 8730;
// prefix -> [name, pre-campaign base count (post-dedupe), gap target]
const PILLAR = {
  q:['Knowledge',7318,1400], fr:['Franchises',980,1175], er:['Electronics',626,720], ik:['Industry KPIs',536,559],
  sc:['Schools',324,556], tk:['Tech Stacks',436,384], tl:['Tools/CRO',891,380], cg:['Coaching',593,294],
  st:['Sales Trainings',730,275], pt:['Pets',168,242], bs:['Book Summaries',309,236], aq:['Aquariums',450,216],
  bt:['Boats',400,216], ca:['Cars',973,200], ra:['Revenue Arch',530,180], gb:['Graphics',545,167],
  bo:['Buildouts',235,135], ai:['AI Infra',200,130], ev:['Event Venues',100,130], nl:['Nightlife',179,121],
  dn:['Dining',183,107], sw:['Software',95,105], sk:['Skill Drills',100,100], gp:['GTM Playbooks',398,100],
  hf:['NIL/HS',62,90], tn:['Towns',141,89], co:['Collectibles',74,76], es:['Home Builders',193,67],
  sy:['Style',100,65], mv:['Movies',51,64], tv:['Travel',281,60], gm:['Games',63,57], lv:['Retire',117,50],
  sp:['Speeches',100,50], wl:['Wellness',65,45], cl:['Clubs',50,40], ga:['Wedding Venues',50,30],
};

(async () => {
  const idx = await store.get('_index.json', { type: 'json' });
  const cur = {}; for (const e of idx.entries) { const p = (String(e && e.id).match(/^([a-z]+)/) || [])[1]; if (p) cur[p] = (cur[p] || 0) + 1; }
  const W = Math.max(0, idx.entries.length - BASELINE);
  const P = idx.entries.filter(e => e && e.images_pending).length;
  const imgDone = Math.max(0, W - P);
  const wpct = (W / TARGET * 100).toFixed(1), ipct = (imgDone / TARGET * 100).toFixed(1);
  let visits = 0, clicks = 0, bots = 0, botList = 'none', verified = 0;
  try { const st = require('./netlify/functions/_stats'); const d = await st.readDaily(); visits = d.views || 0; clicks = d.clicks || 0; const r = await st.readRange(24); bots = r.botTotal || 0; botList = st.botBreakdown(r.bots || {}); } catch (e) {}
  try { const v = getStore({ name: 'pulse-votes', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN }); const q = (await v.get('_visitor_alert_quota.json', { type: 'json' })) || {}; const today = new Date().toISOString().slice(0, 10); verified = Object.values(q).filter(x => x === today).length; } catch (e) {}

  // per-pillar rows (only active = written > 0), sorted by written desc
  const rows = Object.entries(PILLAR).map(([p, [name, base, gap]]) => {
    const written = Math.max(0, (cur[p] || 0) - base);
    return { name, p, written, gap, pct: gap ? (written / gap * 100).toFixed(0) : 0 };
  }).filter(r => r.written > 0).sort((a, b) => b.written - a.written);

  const perPillar = rows.map(r => `<tr><td>${r.name} <span style="color:#999">(${r.p})</span></td><td align="right"><b>${r.written}</b> of ${r.gap}</td><td align="right" style="color:#1a7f37">${r.pct}%</td></tr>`).join('') || '<tr><td colspan=3 style="color:#888">warming up…</td></tr>';

  // CURRENT PILLAR = the pillar most of the newest entries belong to (pillar-by-pillar mode)
  const recent = idx.entries.slice().sort((a, b) => (b.ts || 0) - (a.ts || 0)).slice(0, 40);
  const rc = {}; for (const e of recent) { const p = (String(e && e.id).match(/^([a-z]+)/) || [])[1]; if (p && PILLAR[p]) rc[p] = (rc[p] || 0) + 1; }
  const curP = (Object.entries(rc).sort((a, b) => b[1] - a[1])[0] || [])[0];
  let curBlock = '', curSub = '';
  if (curP) { const [cnm, cbase, cgap] = PILLAR[curP]; const cw = Math.max(0, (cur[curP] || 0) - cbase); const cpc = cgap ? (cw / cgap * 100).toFixed(0) : 0;
    curBlock = `<p style="font-size:17px;margin:16px 0 6px;padding:10px 14px;background:#eef4ff;border:1px solid #cfe0ff;border-radius:10px">🎯 <b>Current pillar:</b> ${cnm} <span style="color:#999">(${curP})</span> — <b style="color:#1f5fd6">${cw}</b> of <b>${cgap}</b> &nbsp;(<b>${cpc}%</b> of this pillar)</p>`;
    curSub = ` · 🎯 ${cnm} ${cw}/${cgap} (${cpc}%)`; }

  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.55">
    <h2 style="margin:0 0 10px">Pulse gap-fill — live status</h2>
    <p style="font-size:17px;margin:6px 0"><b>✍️ Writing</b> (DeepSeek + Claude, 4 lanes): <b style="color:#1a7f37">${W.toLocaleString()}</b> of <b>${TARGET.toLocaleString()}</b> &nbsp;(<b>${wpct}%</b> total gap filled)</p>
    <div style="background:#eee;border-radius:8px;height:12px;overflow:hidden"><div style="background:#1a7f37;height:12px;width:${Math.min(100, wpct)}%"></div></div>
    ${curBlock}
    <p style="font-size:17px;margin:16px 0 6px"><b>🖼️ Images</b> (DuckDuckGo): <b style="color:#C8821E">${imgDone.toLocaleString()}</b> of <b>${TARGET.toLocaleString()}</b> &nbsp;(<b>${ipct}%</b>) · ${P.toLocaleString()} in queue</p>
    <div style="background:#eee;border-radius:8px;height:12px;overflow:hidden"><div style="background:#C8821E;height:12px;width:${Math.min(100, ipct)}%"></div></div>
    <p style="font-size:16px;margin:18px 0 6px;padding:10px 14px;background:#f0f6f0;border:1px solid #d4e6d4;border-radius:10px">👥 <b>Visitors today</b> (since midnight ET): <b style="color:#1a7f37">${visits.toLocaleString()}</b> · <b>${clicks.toLocaleString()}</b> clicks <span style="color:#888;font-size:12px">— bots excluded</span></p>
    <h3 style="margin:20px 0 6px">Per-pillar gap filled</h3>
    <table cellpadding="5" cellspacing="0" style="border-collapse:collapse;font-size:14px;width:100%">${perPillar}</table>
    <p style="color:#888;font-size:12px;margin-top:14px">Library: ${idx.entries.length.toLocaleString()} entries. Per-pillar = new entries written vs that pillar's gap target; only active pillars shown.</p>
  </div>`;
  const r = await fetch('https://pulserevops.com/.netlify/functions/pulse-progress-notify?key=pulsemachine-writer-2026', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject: `Pulse: ${W.toLocaleString()}/${TARGET.toLocaleString()} written (${wpct}%)${curSub} · 👥 ${visits.toLocaleString()} today`, html }) });
  console.log('email:', await r.text(), '| W=' + W, 'imgDone=' + imgDone, 'activePillars=' + rows.length);
})().catch(e => { console.error('ERR', e.message); });
