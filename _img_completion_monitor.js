// 🔒 4444 — Image-completion monitor (owner 2026-07-02). Every 15 min: scan every entry for a
// top image, compute % complete PER PILLAR (worst first, CRO/Tools = tl highlighted), and EMAIL
// the report via pulse-owner-notify (Resend under the hood). Read-only; writes _img_completion.json.
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const pillarOf = id => (String(id).match(/^[a-z]+/) || [''])[0];
const hasTopImg = b => /!\[[^\]]*\]\([^)]+\)/.test(String(b || '').slice(0, 1000)) || /<img[^>]+src=/i.test(String(b || '').slice(0, 1500));
const CONC = 16, EVERY_MS = 15 * 60 * 1000;
const NAMES = { tl:'Pulse Tools / CRO', ca:'Cars', bt:'Boats', aq:'Aquariums', ik:'Industry KPIs', tk:'Tech Stacks', bs:'Book Summaries', st:'Sales Trainings', fr:'Franchises', co:'Collectibles', ai:'AI Infrastructure', gb:'Graphics', bo:'Buildouts', sy:'Style', cr:'Crabbing', fs:'Fishing', gp:'GTM Playbooks', ra:'Revenue Architecture', pt:'Pets', es:'Espresso', tv:'TVs', rs:'Resorts', cl:'Cologne', lv:'Luxury Vacations', ev:'Events', ga:'Gatherings', gm:'Gaming', mv:'Movies', wl:'Wellness', dr:'Drills', dn:'Dining', nl:'Nightlife', tn:'Towns', sc:'Schools', tc:'Telco', er:'Electronics', ce:'Current Events', q:'Q&A', sk:'Skills', sw:'Software', hf:'Home & Family', dn2:'' };

async function scan() {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const ids = (idx.entries || []).filter(e => e && e.id).map(e => e.id);
  const total = {}, missing = {}; let done = 0, noBlob = 0, qi = 0;
  async function worker() {
    while (qi < ids.length) {
      const id = ids[qi++]; const p = pillarOf(id); total[p] = (total[p] || 0) + 1;
      try { const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null); if (!e || !e.answer) { noBlob++; missing[p] = (missing[p] || 0) + 1; continue; } if (!hasTopImg(e.answer)) missing[p] = (missing[p] || 0) + 1; } catch (x) { }
      if (++done % 5000 === 0) console.log(`[img-mon] ${done}/${ids.length}`);
    }
  }
  await Promise.all(Array.from({ length: CONC }, () => worker()));
  const rows = Object.keys(total).filter(p => /^[a-z]{2,3}$/.test(p) && total[p] >= 5).map(p => {
    const t = total[p], m = missing[p] || 0, have = t - m; return { p, name: NAMES[p] || p.toUpperCase(), total: t, have, missing: m, pct: Math.round(have / t * 1000) / 10 };
  }).sort((a, b) => a.pct - b.pct);   // worst (least complete) first
  const gTotal = ids.length, gMiss = Object.values(missing).reduce((s, x) => s + x, 0), gPct = Math.round((gTotal - gMiss) / gTotal * 1000) / 10;
  return { at: new Date().toISOString(), gTotal, gHave: gTotal - gMiss, gMiss, gPct, rows };
}

function fmt(r) {
  const tl = r.rows.find(x => x.p === 'tl');
  let m = `PULSE image completion — ${r.gPct}% overall (${r.gHave.toLocaleString()}/${r.gTotal.toLocaleString()} have a top image · ${r.gMiss.toLocaleString()} missing)\n`;
  if (tl) m += `\n⭐ CRO / Tools (tl): ${tl.pct}% — ${tl.missing.toLocaleString()} of ${tl.total.toLocaleString()} still missing images\n`;
  m += `\nBy pillar (least complete first):\n`;
  for (const x of r.rows) m += `${x.pct.toFixed(1).padStart(5)}%  ${x.name.padEnd(22)} ${x.have}/${x.total}  (${x.missing} missing)\n`;
  return m;
}

async function emailReport(body) {
  try {
    const r = await fetch('https://pulserevops.com/.netlify/functions/pulse-owner-notify', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'pulsemachine-writer-2026', subject: 'PULSE image completion by pillar', message: body })
    });
    console.log('[img-mon] email status', r.status);
  } catch (e) { console.log('[img-mon] email FAILED', e && e.message); }
}

async function tick() {
  try {
    const r = await scan();
    fs.writeFileSync(WD + '/_img_completion.json', JSON.stringify(r));
    const body = fmt(r);
    console.log('[img-mon] ' + new Date().toLocaleTimeString() + ' overall ' + r.gPct + '%');
    await emailReport(body);
  } catch (e) { console.log('[img-mon] tick error', e && e.message); }
}

(async () => { await tick(); setInterval(tick, EVERY_MS); })();
