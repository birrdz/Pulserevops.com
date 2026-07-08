// _facecard_countdown_email.js — one-shot: email a SITE-WIDE countdown of how many Q&A entries still need a
// flux face-card cover (cover_src !== 'flux'), with a per-pillar breakdown. Resend to the owner.
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const store = getStore({ name: 'pulse-machine-library', siteID: SITE, token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const RECIPIENT = 'koryjordanwhite@gmail.com';
function env(k) { try { const m = fs.readFileSync(WD + '/.env.local', 'utf8').match(new RegExp('^' + k + '=(.+)$', 'm')); return m ? m[1].trim().replace(/^["']|["']$/g, '') : ''; } catch (e) { return ''; } }
async function resendKey() { let k = env('resendapikey') || env('RESEND_API_KEY'); if (k) return k; try { return fs.readFileSync(WD + '/_ask_owner_key.cache', 'utf8').trim(); } catch (e) { return ''; } }

async function sendCountdown() {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const ents = (idx.entries || []).filter(e => e && e.id && /^[a-z]+\d+$/.test(e.id) && e.question);
  const total = ents.length;
  const have = ents.filter(e => e.cover_src === 'flux').length;
  const need = total - have;
  const pct = total ? ((have / total) * 100).toFixed(1) : '0';
  // per-pillar remaining
  const rem = {}, tot = {};
  for (const e of ents) { const p = e.id.match(/^([a-z]+)\d+$/)[1]; tot[p] = (tot[p] || 0) + 1; if (e.cover_src !== 'flux') rem[p] = (rem[p] || 0) + 1; }
  const rows = Object.keys(tot).map(p => ({ p, need: rem[p] || 0, tot: tot[p] })).filter(r => r.need > 0).sort((a, b) => b.need - a.need);
  const rowsHtml = rows.map(r => '<tr><td style="padding:3px 10px 3px 0;font-family:monospace">' + r.p + '</td><td style="padding:3px 10px;text-align:right">' + r.need.toLocaleString() + '</td><td style="padding:3px 0;text-align:right;color:#8a7">' + (r.tot - r.need).toLocaleString() + ' / ' + r.tot.toLocaleString() + '</td></tr>').join('');
  const now = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
  const html =
    '<div style="font-family:system-ui,Arial,sans-serif;color:#15110d;max-width:560px">' +
    '<h2 style="margin:0 0 4px">🎏 Face-card countdown — <span style="color:#c98a2e">' + need.toLocaleString() + ' Q&amp;As still need a face card</span></h2>' +
    '<p style="margin:0 0 14px;color:#555">' + have.toLocaleString() + ' of ' + total.toLocaleString() + ' done (' + pct + '%) · ' + now + '</p>' +
    '<table style="border-collapse:collapse;font-size:14px"><thead><tr style="border-bottom:1px solid #ddd">' +
    '<th style="text-align:left;padding:3px 10px 3px 0">pillar</th><th style="text-align:right;padding:3px 10px">need</th><th style="text-align:right">done</th></tr></thead>' +
    '<tbody>' + rowsHtml + '</tbody></table>' +
    '<p style="margin:14px 0 0;font-size:12px;color:#888">Currently generating: <b>tl</b> (CRO Pulse Tools). Face cards = flux covers only.</p></div>';
  const key = await resendKey();
  if (!key) { console.log('NO resend key — counts: need ' + need + ' / total ' + total + ' (' + pct + '% done)'); return; }
  const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: 'PULSE Engine <onboarding@resend.dev>', to: [RECIPIENT], subject: '🎏 ' + need.toLocaleString() + ' Q&As still need face cards (' + pct + '% done)', html }) });
  console.log('email HTTP ' + r.status + ' · need ' + need + ' / total ' + total + ' · have ' + have + ' (' + pct + '%)');
  console.log('pillars needing: ' + rows.map(r => r.p + ':' + r.need).join(' '));
}

const INTERVAL_MS = parseInt(process.env.INTERVAL_MS || '0', 10);
const STOP = WD + '/_facecard_countdown_stop.flag';
(async () => {
  await sendCountdown().catch(e => console.log(new Date().toISOString() + ' send err ' + (e && e.message)));
  if (INTERVAL_MS > 0) {
    console.log('[countdown] looping every ' + Math.round(INTERVAL_MS / 60000) + ' min (stop: _facecard_countdown_stop.flag)');
    const t = setInterval(async () => {
      if (fs.existsSync(STOP)) { console.log('[countdown] stop flag — exiting'); clearInterval(t); process.exit(0); }
      await sendCountdown().catch(e => console.log(new Date().toISOString() + ' send err ' + (e && e.message)));
    }, INTERVAL_MS);
  }
})();
