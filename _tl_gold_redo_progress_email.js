// CRO Pulse Tools (tl) dual-gold redo progress email — every 10 min.
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const RECIPIENT = 'koryjordanwhite@gmail.com';
const KEY_CACHE = WD + '/_ask_owner_key.cache';
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const INTERVAL_MS = parseInt(process.env.TL_PROGRESS_EMAIL_MS || String(10 * 60 * 1000), 10);
const PROGRESS_F = WD + '/_tl_gold_redo_progress.json';
const STATE_F = WD + '/_tl_gold_redo_batch_state.json';
const LOG_F = WD + '/_tl_gold_redo_progress_email.log';
const PING_STATE_F = WD + '/_tl_gold_redo_progress_email_ping.json';
const STOP = WD + '/_tl_gold_redo_progress_email_stop.flag';
const ONCE = process.argv.includes('--once');
const FINAL = process.argv.includes('--final');

for (const l of (() => {
  try { return fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/); } catch (e) { return []; }
})()) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const { pillarUrl } = require('./_ranking_list_rebuild_lib');
const sleep = ms => new Promise(r => setTimeout(r, ms));
let firstSend = true;

function env(k) {
  try {
    const m = fs.readFileSync(WD + '/.env.local', 'utf8').match(new RegExp('^' + k + '=(.+)$', 'm'));
    return m ? m[1].trim() : '';
  } catch (e) {
    return '';
  }
}

function log(msg) {
  const line = new Date().toISOString() + ' ' + msg;
  console.log(line);
  try { fs.appendFileSync(LOG_F, line + '\n'); } catch (e) {}
}

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function linkHtml(url, label) {
  const u = String(url || '').trim();
  const text = esc(label || u);
  return '<a href="' + u + '" style="color:#0b57d0;text-decoration:underline;font-weight:700" target="_blank" rel="noopener noreferrer">' + text + '</a>';
}

function entryUrl(id) {
  return pillarUrl(id);
}

function loadDoneEntries() {
  let state = {};
  try { state = JSON.parse(fs.readFileSync(STATE_F, 'utf8')); } catch (e) {}
  const ranking = (state.rankingDone || []).map(id => ({ id, type: 'Top 10' }));
  const qa = (state.qaDone || []).map(id => ({ id, type: 'Q&A' }));
  return [...ranking, ...qa];
}

function loadPingState() {
  try { return JSON.parse(fs.readFileSync(PING_STATE_F, 'utf8')); } catch (e) {
    return { rankingDone: [], qaDone: [], fixed: 0, failed: 0, at: null };
  }
}

function savePingState(p, rk, qa) {
  try {
    fs.writeFileSync(PING_STATE_F, JSON.stringify({
      at: new Date().toISOString(),
      rankingDone: rk.fixed || 0,
      qaDone: qa.fixed || 0,
      fixed: p.fixed || 0,
      failed: p.failed || 0,
      rankingIds: (() => {
        let s = {};
        try { s = JSON.parse(fs.readFileSync(STATE_F, 'utf8')); } catch (e) {}
        return s.rankingDone || [];
      })(),
      qaIds: (() => {
        let s = {};
        try { s = JSON.parse(fs.readFileSync(STATE_F, 'utf8')); } catch (e) {}
        return s.qaDone || [];
      })(),
    }, null, 2));
  } catch (e) {}
}

function sinceLastPingHtml(prev, p, rk, qa, doneEntries) {
  if (!prev || !prev.at) {
    return '<p style="margin:0;color:#6b5d49">First ping — batch started' + (p.startedAt ? ' at ' + esc(new Date(p.startedAt).toLocaleString()) : '') + '.</p>';
  }
  const newRanking = (doneEntries.filter(e => e.type === 'Top 10').map(e => e.id)).filter(id => !(prev.rankingIds || []).includes(id));
  const newQa = (doneEntries.filter(e => e.type === 'Q&A').map(e => e.id)).filter(id => !(prev.qaIds || []).includes(id));
  const dFixed = (p.fixed || 0) - (prev.fixed || 0);
  const dFailed = (p.failed || 0) - (prev.failed || 0);
  const lines = [];
  if (dFixed > 0) lines.push('+' + dFixed + ' completed since last ping');
  if (dFailed > 0) lines.push('+' + dFailed + ' failed since last ping');
  if (newRanking.length) lines.push('New Top 10: ' + newRanking.join(', '));
  if (newQa.length) lines.push('New Q&A: ' + newQa.join(', '));
  if (p.currentId) lines.push('Currently working: ' + p.currentId + (p.currentTitle ? ' — ' + p.currentTitle : ''));
  if (!lines.length) lines.push('No new completions since last ping · still processing ' + esc(p.currentId || '—'));
  return '<ul style="margin:0;padding-left:18px;font-size:14px;line-height:1.5">' + lines.map(l => '<li style="margin:0 0 4px">' + esc(l) + '</li>').join('') + '</ul>';
}

function doneIdsHtml(entries) {
  if (!entries.length) return '<p style="color:#8a7a63;margin:0">No completed entries yet.</p>';
  const top10 = entries.filter(e => e.type === 'Top 10');
  const qa = entries.filter(e => e.type === 'Q&A');
  const section = (label, list) => {
    if (!list.length) return '<p style="font-weight:700;margin:12px 0 6px">' + label + ' (0)</p><p style="color:#8a7a63;margin:0 0 12px;font-size:13px">None yet.</p>';
    const rows = list.map(e => '<li style="margin:0 0 4px">' + linkHtml(entryUrl(e.id), e.id) + '</li>').join('');
    return '<p style="font-weight:700;margin:12px 0 6px">' + label + ' (' + list.length + ')</p><ul style="margin:0 0 12px;padding-left:18px;columns:3;column-gap:24px;font-size:13px;line-height:1.5">' + rows + '</ul>';
  };
  return section('Top 10 ranking', top10) + section('Q&amp;A', qa);
}

function qaIdsExplicitHtml(entries) {
  const qa = entries.filter(e => e.type === 'Q&A');
  if (!qa.length) {
    return '<p style="color:#8a7a63;margin:0;font-size:13px">No Q&amp;A completed yet — every completed Q&amp;A ID will appear here on each ping.</p>';
  }
  const rows = qa.map(e => '<li style="margin:0 0 4px">' + linkHtml(entryUrl(e.id), e.id) + '</li>').join('');
  const plain = qa.map(e => e.id).join(', ');
  return '<ul style="margin:0 0 8px;padding-left:18px;columns:2;column-gap:24px;font-size:13px;line-height:1.5">' + rows + '</ul>'
    + '<p style="margin:0;font-size:12px;color:#6b5d49;font-family:ui-monospace,Consolas,monospace">All Q&amp;A IDs (' + qa.length + '): ' + esc(plain) + '</p>';
}

async function resendKey() {
  let k = env('resendapikey') || env('RESEND_API_KEY');
  if (k) return k;
  try { k = fs.readFileSync(KEY_CACHE, 'utf8').trim(); if (k) return k; } catch (e) {}
  const TOKEN = env('NETLIFY_AUTH_TOKEN');
  const s = await fetch('https://api.netlify.com/api/v1/sites/' + SITE, { headers: { Authorization: 'Bearer ' + TOKEN } }).then(r => r.json());
  const acct = s.account_slug || s.account_name;
  const r = await fetch('https://api.netlify.com/api/v1/accounts/' + acct + '/env/resendapikey?site_id=' + SITE, { headers: { Authorization: 'Bearer ' + TOKEN } });
  if (!r.ok) throw new Error('netlify env ' + r.status);
  const j = await r.json();
  const val = (j.values || []).find(v => v.context === 'all' || v.context === 'production') || (j.values || [])[0];
  k = val && val.value;
  if (!k) throw new Error('no resend key');
  try { fs.writeFileSync(KEY_CACHE, k); } catch (e) {}
  return k;
}

async function send() {
  let p = {};
  try { p = JSON.parse(fs.readFileSync(PROGRESS_F, 'utf8')); } catch (e) {}

  const fixed = p.fixed || 0;
  const total = p.queued || p.total || 0;
  const remaining = p.remaining != null ? p.remaining : '?';
  const failed = p.failed || 0;
  const running = !!p.running;
  const complete = FINAL || (p.phase === 'complete' && !running) || (!running && p.stage === 'complete' && (p.remaining === 0 || p.queued === 0));
  const rk = p.ranking || {};
  const qa = p.qa || {};
  const samples = (p.samples || []).slice(0, 5);
  const check = p.lastCheck || {};
  const doneEntries = loadDoneEntries();
  const doneIds = doneEntries.map(e => e.id);
  const rkDoneIds = doneEntries.filter(e => e.type === 'Top 10').map(e => e.id);
  const qaDoneIds = doneEntries.filter(e => e.type === 'Q&A').map(e => e.id);
  const prevPing = loadPingState();
  const rkRem = rk.remaining != null ? rk.remaining : Math.max(0, (rk.total || 0) - (rk.fixed || 0));
  const qaRem = qa.remaining != null ? qa.remaining : Math.max(0, (qa.total || 0) - (qa.fixed || 0));

  const samplesHtml = samples.length
    ? samples.map(s => {
        const u = s.url || entryUrl(s.id);
        const tpl = s.template === 'q11133' || s.phase === 'qa' ? 'Q&A' : 'Top 10';
        return '<li style="margin-bottom:10px">' + linkHtml(u, s.title || s.id) + '<br><span style="font-size:12px;color:#555">' + tpl + ' · grade ' + esc(s.grade) + '</span></li>';
      }).join('')
    : '<li style="color:#8a7a63">Sample links appear every 5 fixes</li>';

  const subject = complete
    ? '🔧 CRO Pulse Tools COMPLETE — paused · ' + rkDoneIds.length + ' Top 10 + ' + qaDoneIds.length + ' Q&A'
    : firstSend
      ? '🔧 CRO Pulse Tools dual-gold redo — progress emails every 10 min'
      : '🔧 CRO Pulse Tools · ' + rkDoneIds.length + ' Top 10 + ' + qaDoneIds.length + ' Q&A · ' + remaining + ' left' + (p.currentId ? ' · ' + p.currentId : '');

  const html = `<div style="font-family:system-ui,Arial,sans-serif;font-size:15px;line-height:1.6;color:#15110d">
    <p style="font-size:18px;font-weight:800;margin:0 0 8px">${complete ? '✅ CRO Pulse Tools COMPLETE — paused' : firstSend ? 'CRO Pulse Tools dual-gold redo running' : '🔧 CRO Pulse Tools progress'}</p>
    ${complete ? '<p style="background:#e8f5e9;border-left:4px solid #2e7d32;padding:12px 16px;margin:0 0 16px"><b>Batch paused.</b> Review every completed ID below (Top 10 + Q&amp;A). Reply with which pillar to run next.</p>' : ''}
    <p style="margin:0 0 12px;color:#6b5d49">🔒 <b>Golden template law:</b> Top 10 → <a href="https://pulserevops.com/aquariums/aq1158">aq1158</a> · Q&A → <a href="https://pulserevops.com/knowledge/q11133">q11133</a> · progress ping every <b>10 min</b> with every finished link</p>
    <p style="font-weight:700;margin:12px 0 6px">Since last ping</p>
    ${sinceLastPingHtml(prevPing, p, rk, qa, doneEntries)}
    <table style="border-collapse:collapse;font-size:14px;margin-top:12px">
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Fixed</td><td style="font-weight:700">${fixed}${total ? ' / ' + total : ''}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Top 10 ranking</td><td><b>${rk.fixed || 0}</b> fixed · <b>${rk.failed || 0}</b> failed · <b>${rkRem}</b> remaining / ${rk.total || 0}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Q&amp;A</td><td><b>${qa.fixed || 0}</b> fixed · <b>${qa.failed || 0}</b> failed · <b>${qaRem}</b> remaining / ${qa.total || 0}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Failed (total)</td><td>${failed}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Status</td><td>${complete ? '✅ complete' : running ? '🟢 running' : '⏸ idle'} · ${esc(p.stage || '')}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Working on</td><td>${esc(p.currentId || '—')}${p.currentTitle ? ' — ' + esc(p.currentTitle) : ''}</td></tr>
      ${check.id ? '<tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Last</td><td>' + esc(check.id) + ' (' + (check.phase === 'qa' || check.template === 'q11133' ? 'Q&amp;A' : 'Top 10') + ')</td></tr>' : ''}
    </table>
    <p style="font-weight:700;margin:16px 0 6px">All completed entries (${doneIds.length} cumulative · Top 10 ${rkDoneIds.length} · Q&A ${qaDoneIds.length})</p>
    ${doneIdsHtml(doneEntries)}
    <p style="font-weight:700;margin:16px 0 6px">Q&amp;A IDs — every completed question &amp; answer (${qaDoneIds.length})</p>
    ${qaIdsExplicitHtml(doneEntries)}
    <p style="font-weight:700;margin:16px 0 6px">Recent spot-checks</p>
    <ul style="margin:0;padding-left:18px">${samplesHtml}</ul>
    <p style="color:#8a7a63;font-size:12px;margin-top:12px">${new Date().toLocaleString()} · next ping in 10 min · stop: _tl_gold_redo_progress_email_stop.flag</p>
  </div>`;

  const key = await resendKey();
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'PULSE Engine <onboarding@resend.dev>', to: [RECIPIENT], subject, html }),
  });
  const txt = await r.text();
  if (!r.ok) throw new Error('resend ' + r.status + ' ' + txt.slice(0, 160));
  log('sent · done ' + doneIds.length + ' · fixed ' + fixed + '/' + total + (complete ? ' · COMPLETE' : ''));
  savePingState(p, rk, qa);
  firstSend = false;
  return complete;
}

(async () => {
  if (!ONCE) {
    try { fs.unlinkSync(STOP); } catch (e) {}
  }
  log(ONCE ? 'one-shot' : 'every 10 min to ' + RECIPIENT);
  if (ONCE) {
    try { await send(); } catch (e) { log('ERR ' + e.message); process.exit(1); }
    return;
  }
  try {
    const done = await send();
    if (done) {
      try { fs.writeFileSync(STOP, 'complete'); } catch (e) {}
      log('batch complete — exiting');
      return;
    }
  } catch (e) { log('ERR ' + e.message); }
  while (!fs.existsSync(STOP)) {
    for (let i = 0; i < 150 && !fs.existsSync(STOP); i++) await sleep(INTERVAL_MS / 150);
    if (fs.existsSync(STOP)) break;
    try {
      const done = await send();
      if (done) {
        try { fs.writeFileSync(STOP, 'complete'); } catch (e) {}
        log('batch complete — exiting');
        break;
      }
    } catch (e) { log('ERR ' + e.message); }
  }
  log('stop flag — exiting');
})().catch(e => {
  log('FATAL ' + e.message);
  process.exit(1);
});
