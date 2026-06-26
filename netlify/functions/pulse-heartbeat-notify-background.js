// pulse-heartbeat-notify-background — STANDING 15-minute status email (LAW,
// 2026-06-23). Owner gets an email every 15 minutes ALWAYS: if a project is
// actively running it shows progress; if nothing is being performed it literally
// says "No current projects." Never silent.
//
// Activity signal (no LLM, $0 — blob reads only):
//   1. _current_work.json blob (optional, richer): { active, project, detail, updated_at }
//      written by the assistant/work scripts. Used when updated within ACTIVE_WINDOW.
//   2. Fallback: most-recent entry ts in _index.json. If something was published
//      within ACTIVE_WINDOW, that counts as active.
//   3. Otherwise → "No current projects."
const { getStore } = require('@netlify/blobs');

const RECIPIENT = 'koryjordanwhite@gmail.com';
const ACTIVE_WINDOW_MS = 20 * 60 * 1000; // "active" if work touched in the last 20 min

function store() {
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  return (tok && sid) ? getStore({ name: 'pulse-machine-library', siteID: sid, token: tok }) : getStore('pulse-machine-library');
}

async function emailOwner(subject, html) {
  const rs = process.env.RESEND_API_KEY || process.env.resendapikey || process.env.RESENDAPIKEY;
  const from = process.env.ALERT_FROM_EMAIL || process.env.alert_from_email || 'onboarding@resend.dev';
  if (!rs) { console.log('heartbeat: no resend key'); return false; }
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + rs, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [RECIPIENT], subject, html }),
    });
    return r.ok;
  } catch (e) { return false; }
}

exports.handler = async () => {
  const now = Date.now();
  const s = store();
  const idx = await s.get('_index.json', { type: 'json' }).catch(() => null);
  // _projects.json = the live project registry: { projects:[ {name, prefix, base, target} ] }
  // done = (live count of <prefix> entries) - base; denom = target - base.
  const reg = await s.get('_projects.json', { type: 'json' }).catch(() => null);
  const imgAudit = await s.get('_img_audit_progress.json', { type: 'json' }).catch(() => null);
  const regen = await s.get('_regen_progress.json', { type: 'json' }).catch(() => null);

  const entries = (idx && Array.isArray(idx.entries)) ? idx.entries : [];
  const total = entries.length;

  // ── Today's human traffic — best-estimate: non-bot page views + tracked clicks.
  // Resets at MIDNIGHT EASTERN (owner TZ): sum _stats hour-shards back to ET-today's
  // first hour, breaking the moment we cross into yesterday. Views = non-bot page
  // renders (a visitor reading N pages counts as N); clicks = link/CRO/tool clicks.
  // Cheap: 10-shard daily counter for today (ET), not a 240-blob hourly sweep.
  let dViews = 0, dClicks = 0;
  try {
    const d = await require('./_stats').readDaily();
    dViews = d.views; dClicks = d.clicks;
  } catch (e) {}
  const trafficLine = `<p style="font-size:15px;margin:14px 0 6px;padding:12px 14px;background:#f0f6f0;border:1px solid #d4e6d4;border-radius:10px">📊 <b>Today so far</b> (since midnight ET): <b style="color:#1a7f37">${dViews.toLocaleString()}</b> human visits · <b style="color:#1a7f37">${dClicks.toLocaleString()}</b> clicks <span style="color:#888;font-size:12px">— best-estimate, bots excluded; resets at midnight</span></p>`;

  // Image-auditor progress line (continuous catalog scan for wrong/stock images).
  let imgAuditLine = '';
  if (imgAudit && typeof imgAudit.cursor === 'number' && imgAudit.total) {
    const pct = Math.min(100, Math.round((imgAudit.cursor / imgAudit.total) * 100));
    const passDone = imgAudit.cursor >= imgAudit.total;
    imgAuditLine = `<p style="font-size:15px;margin:6px 0;padding:12px 14px;background:#f5f1fb;border:1px solid #e0d6f0;border-radius:10px">🖼️ <b>Image auditor</b>: ${imgAudit.cursor.toLocaleString()} of ${imgAudit.total.toLocaleString()} checked (${pct}%)${passDone ? ' — pass complete ✅' : ''} · <b style="color:#b4304a">${(imgAudit.flagged || 0).toLocaleString()}</b> flagged (stock/wrong-image)${imgAudit.pass ? ` <span style="color:#888;font-size:12px">— pass #${imgAudit.pass}</span>` : ''}</p>`;
  }

  // Fabrication regen progress (Claude grounded regeneration of held entries).
  let regenLine = '';
  if (regen && typeof regen.done === 'number' && regen.total) {
    const rp = Math.min(100, Math.round((regen.done / regen.total) * 100));
    regenLine = `<p style="font-size:15px;margin:6px 0;padding:12px 14px;background:#fbf3ee;border:1px solid #f0ddd0;border-radius:10px">🛠️ <b>Fabrication regen</b> (Claude, grounded): ${regen.done.toLocaleString()} of ${regen.total.toLocaleString()} rebuilt (${rp}%)${regen.done >= regen.total ? ' — complete ✅' : ''}</p>`;
  }

  // Live per-prefix counts from the index.
  const counts = Object.create(null);
  for (const e of entries) {
    const m = e && e.id && String(e.id).match(/^([a-z]+)/i);
    if (m) { const k = m[1].toLowerCase(); counts[k] = (counts[k] || 0) + 1; }
  }

  // Build the numbered project list with live X/Y progress. Drop completed ones
  // only if explicitly flagged done; otherwise show 75/75 until removed.
  const projects = (reg && Array.isArray(reg.projects)) ? reg.projects : [];
  const rows = projects.map((p) => {
    const cur = counts[String(p.prefix || '').toLowerCase()] || 0;
    const base = Number(p.base) || 0;
    const target = Number(p.target) || 0;
    const done = Math.max(0, cur - base);
    const denom = Math.max(0, target - base);
    const pct = denom ? Math.min(100, Math.round((done / denom) * 100)) : 0;
    return { name: p.name || (p.prefix + ' build'), done, denom, pct };
  });

  // Recent publishes (last 20 min), newest first — supplementary detail.
  const recent = entries
    .filter((e) => e && typeof e.ts === 'number' && now - e.ts <= ACTIVE_WINDOW_MS)
    .sort((a, b) => b.ts - a.ts)
    .slice(0, 12);

  const stamp = new Date(now).toISOString().replace('T', ' ').slice(0, 16) + ' UTC';

  // CROSS-PILLAR ONLY (owner request 2026-06-23): the heartbeat email reports
  // only cross-pillar copy progress. Derived from the copied_from marker that
  // _xpillar_copy.js stamps on every copied index row — source→dest flows.
  const NAME = { q:'Knowledge', st:'Sales Trainings', ik:'Industry KPIs', tk:'Tech Stacks', bs:'Book Summaries', er:'Electronic Reviews', ra:'Revenue Architecture', gp:'GTM Playbooks', fr:'Franchises', ca:'Cars', tn:'Towns', sc:'Schools', nl:'Nightlife', dn:'Dining', bt:'Boats', mv:'Movies', wl:'Wellness', tv:'Travel', rs:'Resorts', es:'Estates', cl:'Clubs', lv:'Living', ev:'Events', sy:'Style', ga:'Gatherings', gm:'Gaming', sk:'Skill Drills', sp:'Speeches', tl:'Tools', cg:'Coaching', co:'Collectibles', aq:'Aquariums', hf:'HS Football', ai:'AI Infrastructure', pt:'Pets', sw:'Software', bo:'Buildouts' };
  const nm = (p) => NAME[p] || p;
  const pfxOf = (id) => { const m = String(id || '').match(/^([a-z]+)/i); return m ? m[1].toLowerCase() : '?'; };
  const flows = Object.create(null); const perDest = Object.create(null); let xtotal = 0;
  for (const e of entries) {
    if (e && e.copied_from) {
      const dst = pfxOf(e.id), src = pfxOf(e.copied_from);
      flows[src + '>' + dst] = (flows[src + '>' + dst] || 0) + 1;
      perDest[dst] = (perDest[dst] || 0) + 1; xtotal++;
    }
  }
  let prevTotal = 0;
  try { const stx = await s.get('_xpillar_hb_state.json', { type: 'json' }); if (stx && typeof stx.total === 'number') prevTotal = stx.total; } catch (e) {}
  const delta = xtotal - prevTotal;
  try { await s.setJSON('_xpillar_hb_state.json', { total: xtotal, at: now }); } catch (e) {}
  const flowLines = Object.entries(flows).sort((a, b) => b[1] - a[1])
    .map(([k, n]) => { const [src, dst] = k.split('>'); return `<li>Copied <b>${n}</b>: ${esc(nm(src))} &rarr; <b>${esc(nm(dst))}</b> <span style="color:#888;font-size:12px">(source kept)</span></li>`; }).join('');
  const destLines = Object.entries(perDest).sort((a, b) => b[1] - a[1])
    .map(([d, n]) => `<li><b>${esc(nm(d))}</b>: ${n} copied in</li>`).join('');
  const subject = `PULSE cross-pillar — ${xtotal.toLocaleString()} copies${delta > 0 ? ` (+${delta})` : ''} — ${stamp}`;
  const html = `<h2 style="color:#1a7f37">Cross-pillar copy progress</h2>`
    + `<p style="font-size:16px"><b>${xtotal.toLocaleString()}</b> total cross-pillar copies${delta > 0 ? ` &middot; <b style="color:#1a7f37">+${delta}</b> since last email` : ' &middot; no change since last email'}.</p>`
    + (flowLines ? `<p style="margin:14px 0 4px"><b>Flows (source &rarr; destination):</b></p><ul style="font-size:15px;line-height:1.7">${flowLines}</ul>` : `<p>No cross-pillar copies recorded yet.</p>`)
    + (destLines ? `<p style="margin:14px 0 4px"><b>Copied into each pillar:</b></p><ul style="font-size:14px;line-height:1.6">${destLines}</ul>` : '');

  const sent = await emailOwner(subject, html);
  console.log(`heartbeat: projects=${rows.length} recent=${recent.length} sent=${sent}`);
  return { statusCode: 200, body: JSON.stringify({ ok: true, projects: rows.length, recent: recent.length, total, sent }) };
};

function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

const SEG = { q: 'knowledge', cg: 'coaching', er: 'electronic-reviews', ca: 'cars', sc: 'schools', dn: 'dining', bt: 'boats', mv: 'movies', wl: 'wellness', tv: 'travel', rs: 'resorts', es: 'estates', cl: 'clubs', lv: 'living', ev: 'events', ga: 'gatherings', gm: 'gaming', nl: 'nightlife', tl: 'tools', tn: 'towns', co: 'collectibles', ai: 'ai-infrastructure', aq: 'aquariums', hf: 'highschool-football-recruiting', fr: 'franchises', ik: 'industry-kpis', st: 'sales-trainings', tk: 'tech-stacks', sy: 'style', gb: 'graphics', sp: 'speeches', sk: 'skills' };
function segOf(id) { const m = String(id || '').match(/^([a-z]+)/i); return (m && SEG[m[1].toLowerCase()]) || 'knowledge'; }
