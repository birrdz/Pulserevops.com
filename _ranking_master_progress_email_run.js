// Shared ranking-list progress email — pillar via --pillar=sw or first positional.
const fs = require('fs');
const PILLARS = require('./_ranking_master_pillar_config');

const WD = 'C:/Users/koryj/website';
const RECIPIENT = 'koryjordanwhite@gmail.com';
const KEY_CACHE = WD + '/_ask_owner_key.cache';
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const INTERVAL_MS = 5 * 60 * 1000;

for (const l of (() => {
  try { return fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/); } catch (e) { return []; }
})()) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

function runEmail(pillarKey) {
  const cfg = PILLARS[pillarKey];
  if (!cfg) throw new Error('Unknown pillar: ' + pillarKey);

  const STOP = WD + '/' + cfg.emailStopF;
  const PROGRESS_F = WD + '/' + cfg.progressF;
  const LOG_F = WD + '/' + cfg.emailLogF;
  const ONCE = process.argv.includes('--once');
  let firstSend = true;

  const env = k => {
    try {
      const m = fs.readFileSync(WD + '/.env.local', 'utf8').match(new RegExp('^' + k + '=(.+)$', 'm'));
      return m ? m[1].trim() : '';
    } catch (e) {
      return '';
    }
  };

  function log(msg) {
    const line = new Date().toISOString() + ' ' + msg;
    console.log(line);
    try { fs.appendFileSync(LOG_F, line + '\n'); } catch (e) {}
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

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function entryUrl(id) {
    return 'https://pulserevops.com/' + cfg.hub + '/' + id;
  }

  function linkHtml(url, label) {
    const u = String(url || '').trim();
    if (!/^https:\/\//i.test(u)) return esc(label || u || '—');
    const text = esc(label || u);
    return '<a href="' + u + '" style="color:#0b57d0;text-decoration:underline;font-weight:700" target="_blank" rel="noopener noreferrer">' + text + '</a>';
  }

  async function send() {
    let p = {};
    try { p = JSON.parse(fs.readFileSync(PROGRESS_F, 'utf8')); } catch (e) {}

    const fixed = p.fixed || 0;
    const total = p.total || 0;
    const remaining = p.remaining != null ? p.remaining : '?';
    const failed = p.failed || 0;
    const running = !!p.running;
    const curId = esc(p.currentId || '—');
    const curTitle = esc(p.currentTitle || '');
    const stage = esc(p.stage || (running ? 'running' : 'idle'));
    const samples = (p.samples || []).slice(0, 5);
    const check = p.lastCheck || {};
    const hubUrl = 'https://pulserevops.com/' + cfg.hub;
    const sampleUrl = entryUrl(cfg.sampleId);
    const strategy = esc(p.strategy || '');
    const samplesHtml = samples.length
      ? samples.map(s => {
          const u = s.url || entryUrl(s.id);
          return '<li style="margin-bottom:10px">' + linkHtml(u, s.title || s.id) + '<br><span style="font-size:12px;color:#555">' + linkHtml(u, u) + '</span> · grade ' + esc(s.grade) + (s.productImgs != null ? ' · ' + s.productImgs + ' prod imgs' : s.imgs != null ? ' · ' + s.imgs + ' section imgs' : '') + '</li>';
        }).join('')
      : '<li style="color:#8a7a63">Sample links appear every 5–10 fixes (first fix included)</li>';

    const stratNote = strategy === 'images-rebuild'
      ? 'Re-fetching <b>all product images</b> — entries with missing imgs get sent back until complete.'
      : strategy === 'ce-complete'
        ? (firstSend ? cfg.label + ': <b>complete ~2000-word writings</b> matching gold standard <a href="https://pulserevops.com/knowledge/ce0023">ce0023</a>. Stubs get full rewrites.' : 'Auto ping every 5 min.')
        : strategy === 'ce-template'
        ? (firstSend ? cfg.label + ': full <b>PULSE template</b> — hero → Direct Answer → 6+ H2s → 2 mermaid → FAQ → Sources → Related. Rubric must pass before save.' : 'Auto ping every 5 min.')
        : strategy === 'ce-news-order'
        ? (firstSend ? cfg.label + ': <b>hero image first</b>, then <b>Direct Answer</b>, then section media — fixing wrong essay pass order.' : 'Auto ping every 5 min.')
        : strategy === 'pillar-images'
        ? (firstSend ? cfg.label + ': <b>ranking lists</b> get product imgs; <b>essays</b> get occasional section imgs; no top hero. Links below are full https URLs.' : 'Auto ping every 5 min.')
        : (firstSend ? 'Ranking lists use <b>product images only</b> — top hero removed. Blob updates are live without Netlify deploy.' : 'Progress ping (every 5 min).');

    const rk = p.ranking || {};
    const es = p.essays || {};
    const subject = firstSend
      ? 'Got it? ' + cfg.emoji + ' ' + cfg.label + ' — image fix running'
      : cfg.emoji + ' ' + cfg.label + ' · ' + fixed + ' fixed · ' + remaining + ' left' + (samples[0] ? ' · ' + samples[0].id : '');

    const html = `<div style="font-family:system-ui,Arial,sans-serif;font-size:15px;line-height:1.6;color:#15110d">
    <p style="font-size:18px;font-weight:800;margin:0 0 8px">${firstSend ? 'Got it? ✅ Email chain running' : cfg.emoji + ' ' + esc(cfg.label) + ' progress'}</p>
    <p style="margin:0 0 12px;color:#6b5d49">${firstSend ? 'You will get a ping every <b>5 minutes</b>. ' + stratNote : stratNote + ' Sample link every ~5–10 fixes below.'}</p>
    <table style="border-collapse:collapse;font-size:14px">
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Pillar</td><td>${esc(cfg.label)} (${cfg.key})</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Fixed</td><td style="font-weight:700">${fixed}${total ? ' / ' + total : ''}</td></tr>
      ${strategy === 'pillar-images' ? '<tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Ranking lists</td><td><b>' + (rk.fixed || 0) + '</b> / ' + (rk.total || 0) + ' · ' + (rk.remaining != null ? rk.remaining : '?') + ' left</td></tr><tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Essay answers</td><td><b>' + (es.fixed || 0) + '</b> / ' + (es.total || 0) + ' · ' + (es.remaining != null ? es.remaining : '?') + ' left</td></tr>' : ''}
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Remaining</td><td>${remaining}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Failed</td><td>${failed}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Status</td><td>${running ? '🟢 running' : '⏸ idle/done'} · ${stage}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Working on</td><td>${curId}${curTitle ? ' — ' + curTitle : ''}${p.currentId ? '<br>' + linkHtml(entryUrl(p.currentId), entryUrl(p.currentId)) : ''}</td></tr>
      ${check.id ? '<tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Last finished</td><td>' + esc(check.id) + '</td></tr>' : ''}
    </table>
    <p style="font-weight:700;margin:16px 0 6px">Spot-check links (≈1 per 10 fixes)</p>
    <ul style="margin:0;padding-left:18px">${samplesHtml}</ul>
    <p style="margin-top:14px">${linkHtml(sampleUrl, 'Template ' + cfg.sampleId)} · ${linkHtml(hubUrl, cfg.label + ' hub')}</p>
    <p style="color:#8a7a63;font-size:12px;margin-top:12px">Auto ping every 5 min · ${new Date().toLocaleString()} · stop: ${esc(cfg.emailStopF)}</p>
  </div>`;

    const key = await resendKey();
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'PULSE Engine <onboarding@resend.dev>', to: [RECIPIENT], subject, html }),
    });
    const txt = await r.text();
    if (!r.ok) throw new Error('resend ' + r.status + ' ' + txt.slice(0, 160));
    log('sent · ' + cfg.key + ' · fixed ' + fixed + '/' + total + ' · to ' + RECIPIENT);
    firstSend = false;
  }

  return (async () => {
    if (!ONCE) {
      try { fs.unlinkSync(STOP); } catch (e) {}
    }
    log('[' + cfg.key + '-ranking-email] ' + (ONCE ? 'one-shot send' : 'every 5 min to ' + RECIPIENT));
    if (ONCE) {
      try { await send(); } catch (e) { log('send ERR ' + e.message); process.exit(1); }
      return;
    }
    try { await send(); } catch (e) { log('send ERR ' + e.message); }
    while (!fs.existsSync(STOP)) {
      for (let i = 0; i < 150 && !fs.existsSync(STOP); i++) await sleep(INTERVAL_MS / 150);
      if (fs.existsSync(STOP)) break;
      try { await send(); } catch (e) { log('send ERR ' + e.message); }
    }
    log('[' + cfg.key + '-ranking-email] stop flag — exiting');
  })();
}

module.exports = { runEmail };

if (require.main === module) {
  const key = process.argv.find(a => a.startsWith('--pillar='))?.split('=')[1] || process.argv[2] || 'aq';
  runEmail(key);
}
