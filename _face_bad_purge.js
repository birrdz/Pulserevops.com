// _face_bad_purge.js — delete face-card + top hero images that fail Pollinator editorial standard.
// Rejects charts, graphs, infographics, brochures, sales/median slides, dashboards, stock clichés.
// Usage:
//   node _face_bad_purge.js --dry              preview
//   node _face_bad_purge.js                    purge + clear index/blob hero
//   node _face_bad_purge.js --pillar ai        one pillar
//   node _face_bad_purge.js --limit 200        cap batch
// Full runs process pillars smallest→largest entry count (fs first, tl last).
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const QDIR = WD + '/assets/qa';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const { faceCoverQualityOk, coverFileOk } = require('./_ddg_facecard_lib');
const { ownerEmail } = require('./_ask_owner');

const PILLAR_NAMES = { tl:'Pulse Tools / CRO', ca:'Cars', bt:'Boats', aq:'Aquariums', ik:'Industry KPIs', tk:'Tech Stacks', bs:'Book Summaries', st:'Sales Trainings', fr:'Franchises', co:'Collectibles', ai:'AI Infrastructure', gb:'Graphics', bo:'Buildouts', sy:'Style', cr:'Crabbing', fs:'Fishing', gp:'GTM Playbooks', ra:'Revenue Architecture', pt:'Pets', es:'Espresso', tv:'TVs', rs:'Resorts', cl:'Cologne', lv:'Luxury Vacations', ev:'Events', ga:'Gatherings', gm:'Gaming', mv:'Movies', wl:'Wellness', dn:'Dining', nl:'Nightlife', tn:'Towns', sc:'Schools', tc:'Telco', er:'Electronics', ce:'Current Events', ed:'Education', hf:'Home Fitness', sw:'Software', sk:'Skills', sp:'Sports', cg:'Coaching' };
const pName = p => PILLAR_NAMES[p] || (p || '').toUpperCase();

const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const NO_EMAIL = args.includes('--no-email');
const PILLAR = args.includes('--pillar') ? args[args.indexOf('--pillar') + 1] : '';
const LIMIT = args.includes('--limit') ? parseInt(args[args.indexOf('--limit') + 1], 10) : Infinity;
const CONC = parseInt(process.env.FACE_PURGE_CONC || '2', 10);
const PACE = parseInt(process.env.FACE_PURGE_PACE_MS || '400', 10);
const STATE_F = WD + '/_face_bad_purge_state.json';
const ORDER = 'pillar-smallest-first';
const sleep = ms => new Promise(r => setTimeout(r, ms));

function pillarOf(id) { return (String(id).match(/^[a-z]+/) || [''])[0]; }
function orderRowsByPillarSize(rows) {
  const byPillar = new Map();
  for (const row of rows) {
    const p = pillarOf(row.id);
    if (!byPillar.has(p)) byPillar.set(p, []);
    byPillar.get(p).push(row);
  }
  const pillars = [...byPillar.keys()].sort((a, b) => byPillar.get(a).length - byPillar.get(b).length || a.localeCompare(b));
  const ordered = [];
  const counts = {};
  for (const p of pillars) {
    counts[p] = byPillar.get(p).length;
    ordered.push(...byPillar.get(p));
  }
  return { rows: ordered, pillars, counts };
}
function saveState(state) {
  if (!DRY) fs.writeFileSync(STATE_F, JSON.stringify(state, null, 2));
}
function heroUrl(body) {
  const m = String(body || '').slice(0, 1600).match(/!\[[^\]]*\]\(([^)\s]+)\)/);
  return m ? m[1].replace(/\?.*$/, '').trim() : '';
}
function stripHero(body) {
  return String(body || '').replace(/^\uFEFF?\s*!\[[^\]]*\]\([^)]*\)\s*\n*/, '');
}
function isBadHeroUrl(url, id) {
  if (!url) return false;
  if (/^https?:\/\//i.test(url)) return true;
  if (/pollinations\.ai|placeholder\.svg|\/img\/auto\/|\.svg(\?|$)/i.test(url)) return true;
  if (/^\/assets\/cro-cover-/i.test(url)) return true;
  if (url === '/assets/qa/' + id + '.jpg') return false;
  if (/^\/assets\/qa\//.test(url)) {
    try { return fs.statSync(WD + url).size < 40000; } catch (e) { return true; }
  }
  return false;
}

async function rejectBrochureSlide(buf, title) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return { ok: true, reason: 'no-gemini' };
  try {
    const body = { contents: [{ parts: [
      { text: 'Reply only KEEP or REJECT. KEEP only for artsy candid editorial documentary photographs (real scene: person, place, thing, activity). REJECT for: chart, graph, diagram, infographic, dashboard, spreadsheet, data table, slide deck, sales deck, median slide, brochure, marketing flyer, UI screenshot, logo, mostly text, generic business handshake meeting, flat graphic design, presentation screen.' },
      { inlineData: { mimeType: 'image/jpeg', data: buf.toString('base64') } },
    ] }], generationConfig: { maxOutputTokens: 8, temperature: 0 } };
    const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + key,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(22000) });
    if (!r.ok) return { ok: true, reason: 'gemini-skip' };
    const j = await r.json();
    const t = String(j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts && j.candidates[0].content.parts[0] && j.candidates[0].content.parts[0].text || '').trim().toUpperCase();
    if (t.startsWith('KEEP')) return { ok: true };
    return { ok: false, reason: 'brochure-slide-chart' };
  } catch (e) { return { ok: true, reason: 'gemini-err' }; }
}

async function auditFace(id, title, buf, coverSrc) {
  if (coverSrc !== 'flux') return { purge: true, reason: coverSrc ? ('cover_src=' + coverSrc) : 'no-flux' };
  if (!buf || buf.length < 40000) return { purge: true, reason: 'small-file' };
  const qc = await faceCoverQualityOk(id, title, buf);
  if (!qc.ok) return { purge: true, reason: qc.reason || 'quality' };
  const extra = await rejectBrochureSlide(buf, title);
  if (!extra.ok) return { purge: true, reason: extra.reason };
  return { purge: false };
}

async function purgeEntry(id, idxRow, blob, reason, stats) {
  const facePath = QDIR + '/' + id + '.jpg';
  if (!DRY) {
    try { if (fs.existsSync(facePath)) fs.unlinkSync(facePath); } catch (e) {}
    if (blob) {
      const nb = stripHero(blob.answer || '');
      await store.setJSON('answers/' + id + '.json', Object.assign({}, blob, {
        answer: nb,
        cover_src: null,
        face_title_baked: false,
        face_purged_at: new Date().toISOString(),
        face_purge_reason: reason,
        updated_at: new Date().toISOString(),
      }));
    }
    if (idxRow) {
      const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
      const ent = (idx.entries || []).find(x => x && x.id === id);
      if (ent) {
        delete ent.cover_src;
        delete ent.img;
        delete ent.face_title_baked;
        ent.face_purged_at = new Date().toISOString();
        ent.face_purge_reason = reason;
        await store.setJSON('_index.json', idx);
      }
    }
  }
  stats.purged++;
  if (stats.log.length < 80) stats.log.push(id + ' · ' + reason);
}

(async () => {
  let state = { cursor: 0, order: ORDER, purged: 0, kept: 0, skipped: 0 };
  try { state = Object.assign(state, JSON.parse(fs.readFileSync(STATE_F, 'utf8'))); } catch (e) {}
  if (state.order !== ORDER) {
    state = { cursor: 0, order: ORDER, purged: 0, kept: 0, skipped: 0 };
  }
  const stateBase = { cursor: state.cursor || 0, purged: state.purged || 0, kept: state.kept || 0, skipped: state.skipped || 0 };
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  let allRows = (idx.entries || []).filter(e => e && e.id && /^[a-z]{2,3}\d/i.test(String(e.id)));
  let pillarPlan = null;
  if (PILLAR) {
    allRows = allRows.filter(e => pillarOf(e.id) === PILLAR);
  } else {
    pillarPlan = orderRowsByPillarSize(allRows);
    allRows = pillarPlan.rows;
    state.pillarOrder = pillarPlan.pillars;
    state.pillarCounts = pillarPlan.counts;
  }
  let rows = allRows.slice(stateBase.cursor);
  if (LIMIT < Infinity) rows = rows.slice(0, LIMIT);

  console.log('[face-purge] ' + (DRY ? 'DRY · ' : '') + rows.length + ' entries' + (PILLAR ? (' · pillar ' + PILLAR) : ' · pillars smallest→largest') + ' · conc ' + CONC);
  if (pillarPlan) {
    console.log('[face-purge] pillar order: ' + pillarPlan.pillars.map(p => p + '(' + pillarPlan.counts[p] + ')').join(' → '));
    if (stateBase.cursor > 0) console.log('[face-purge] resume at cursor ' + stateBase.cursor);
  }

  const stats = { purged: 0, kept: 0, skipped: 0, heroOnly: 0, log: [] };
  let qi = 0;
  let currentPillar = rows[0] ? pillarOf(rows[0].id) : '';
  const pillarProgress = new Map();
  for (const row of rows) {
    const p = pillarOf(row.id);
    if (!pillarProgress.has(p)) pillarProgress.set(p, { total: 0, done: 0, purged: 0, kept: 0, skipped: 0, emailed: false });
    pillarProgress.get(p).total++;
  }
  const emailedSet = new Set(state.emailedPillars || []);
  let pillarEmailChain = Promise.resolve();
  if (currentPillar) console.log('[face-purge] ▶ pillar ' + currentPillar + (pillarPlan ? (' (' + pillarPlan.counts[currentPillar] + ' entries)') : ''));

  function notePillarResult(p, kind) {
    const pg = pillarProgress.get(p);
    if (!pg) return;
    pg.done++;
    if (kind === 'purged') pg.purged++;
    else if (kind === 'kept') pg.kept++;
    else if (kind === 'skipped') pg.skipped++;
    if (pg.done >= pg.total && !pg.emailed && !emailedSet.has(p)) queuePillarEmail(p);
  }

  function queuePillarEmail(p) {
    pillarEmailChain = pillarEmailChain.then(() => sendPillarDoneEmail(p)).catch(e => console.log('[face-purge] ✉ ' + p + ' email ERR · ' + (e.message || e)));
  }

  async function sendPillarDoneEmail(p) {
    if (DRY || NO_EMAIL || fs.existsSync(WD + '/_emails_off.flag')) return;
    const pg = pillarProgress.get(p);
    if (!pg || pg.emailed || emailedSet.has(p)) return;
    pg.emailed = true;
    emailedSet.add(p);
    const globalDone = stateBase.cursor + stats.purged + stats.kept + stats.skipped;
    const pillarIdx = pillarPlan ? pillarPlan.pillars.indexOf(p) : -1;
    const pillarNum = pillarIdx >= 0 ? (pillarIdx + 1) : null;
    const pillarTotal = pillarPlan ? pillarPlan.pillars.length : 1;
    const nextP = pillarPlan && pillarIdx >= 0 ? pillarPlan.pillars[pillarIdx + 1] : null;
    const subject = '🗑 Face purge · ' + p + ' ' + pName(p) + ' done · ' + pg.purged + ' purged · ' + pg.kept + ' kept';
    const html = `<div style="font-family:system-ui,Arial,sans-serif;font-size:15px;line-height:1.6;color:#15110d">
      <p style="font-size:18px;font-weight:800;margin:0 0 8px">🗑 Face/hero purge — pillar complete</p>
      <table style="border-collapse:collapse;font-size:14px">
        <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Pillar</td><td style="font-weight:700">${p} · ${pName(p)}</td></tr>
        <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Entries</td><td>${pg.total}</td></tr>
        <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Purged</td><td>${pg.purged}</td></tr>
        <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Kept (flux OK)</td><td>${pg.kept}</td></tr>
        <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Skipped</td><td>${pg.skipped}</td></tr>
        <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Site progress</td><td>${globalDone.toLocaleString()} / ${allRows.length.toLocaleString()}</td></tr>
        ${pillarNum ? `<tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Pillars done</td><td>${pillarNum} / ${pillarTotal}</td></tr>` : ''}
        ${nextP ? `<tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Next up</td><td>${nextP} · ${pName(nextP)} (${(pillarPlan.counts[nextP] || '?').toLocaleString()} entries)</td></tr>` : '<tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Next up</td><td>All pillars complete</td></tr>'}
      </table>
      <p style="color:#8a7a63;font-size:12px;margin-top:12px">${new Date().toLocaleString()} · pulserevops.com face-card purge</p>
    </div>`;
    try {
      await ownerEmail(subject, html);
      state.emailedPillars = [...emailedSet];
      saveState(state);
      console.log('[face-purge] ✉ sent · pillar ' + p + ' done');
    } catch (e) {
      pg.emailed = false;
      emailedSet.delete(p);
      throw e;
    }
  }

  async function touchState() {
    const done = stats.purged + stats.kept + stats.skipped;
    state.cursor = stateBase.cursor + done;
    state.purged = stateBase.purged + stats.purged;
    state.kept = stateBase.kept + stats.kept;
    state.skipped = stateBase.skipped + stats.skipped;
    state.lastRun = new Date().toISOString();
    state.currentPillar = currentPillar;
    saveState(state);
  }

  async function worker() {
    while (qi < rows.length) {
      const row = rows[qi++];
      const id = row.id;
      const title = row.question || id;
      const p = pillarOf(id);
      if (p !== currentPillar) {
        currentPillar = p;
        console.log('[face-purge] ▶ pillar ' + currentPillar + (pillarPlan ? (' (' + pillarPlan.counts[currentPillar] + ' entries)') : ''));
      }
      try {
        const blob = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
        const coverSrc = (blob && blob.cover_src) || row.cover_src || '';
        const facePath = QDIR + '/' + id + '.jpg';
        let buf = null;
        try { if (fs.existsSync(facePath)) buf = fs.readFileSync(facePath); } catch (e) {}

        if (buf || coverSrc === 'flux' || row.img === '/assets/qa/' + id + '.jpg') {
          const audit = await auditFace(id, title, buf, coverSrc || (buf ? 'flux' : ''));
          if (audit.purge) {
            await purgeEntry(id, row, blob, audit.reason, stats);
            notePillarResult(p, 'purged');
            console.log((DRY ? '[dry] ' : '') + '🗑 ' + id + ' · ' + audit.reason);
          } else {
            stats.kept++;
            notePillarResult(p, 'kept');
          }
        } else {
          const hu = blob && blob.answer ? heroUrl(blob.answer) : heroUrl('');
          if (isBadHeroUrl(hu, id)) {
            await purgeEntry(id, row, blob, 'bad-hero:' + (hu || '').slice(0, 48), stats);
            stats.heroOnly++;
            notePillarResult(p, 'purged');
            console.log((DRY ? '[dry] ' : '') + '🗑 ' + id + ' · bad hero ' + hu);
          } else {
            stats.skipped++;
            notePillarResult(p, 'skipped');
          }
        }
      } catch (e) {
        console.log('⚠️ ' + id + ' · ' + (e.message || e));
      }
      const done = stats.purged + stats.kept + stats.skipped;
      if (done % 25 === 0) {
        const globalDone = stateBase.cursor + done;
        console.log('[face-purge] progress ' + globalDone + '/' + allRows.length + ' · pillar ' + currentPillar + ' · purged=' + stats.purged + ' kept=' + stats.kept);
        await touchState();
      }
      await sleep(PACE);
    }
  }

  await Promise.all(Array.from({ length: CONC }, () => worker()));
  await pillarEmailChain;

  await touchState();
  state.lastLog = stats.log;
  state.finishedAt = new Date().toISOString();
  delete state.currentPillar;
  saveState(state);

  console.log('[face-purge] DONE' + (DRY ? ' (dry)' : '') + ' · purged=' + stats.purged + ' kept=' + stats.kept + ' skipped=' + stats.skipped + ' heroOnly=' + stats.heroOnly);
})().catch(e => { console.error('[face-purge] FATAL', e); process.exit(1); });
